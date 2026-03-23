"use server"

import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

const MDK_REGISTRY_URL = 'https://raw.githubusercontent.com/marcin2121/mdk-registry/main/components'

function parseMdkMetadata(code: string) {
    const metaMatch = code.match(/\/\* MDK-METADATA([\s\S]*?)\*\//)
    if (!metaMatch) return {}
    try {
        const rawJson = metaMatch[1].trim()
        const meta = JSON.parse(rawJson)
        return meta
    } catch (e) {
        return {}
    }
}

export async function installMdkModule(modId: string) {
    const MODULE_FILES_MAP: Record<string, string> = {
        chatbot: 'chatbot.txt',
        calculator: 'calculator.txt',
        testimonials: 'testimonials.txt',
        pricing: 'pricing-cards.txt',
        faq: 'accordion-faq.txt'
    }

    const fileName = MODULE_FILES_MAP[modId]
    if (!fileName) return { error: "Moduł nie istnieje w MDK Registry." }

    const className = modId.charAt(0).toUpperCase() + modId.slice(1)
    const componentsDir = path.join(process.cwd(), 'components', 'mdk')
    if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true })

    const destPath = path.join(componentsDir, `${className}.tsx`)
    if (fs.existsSync(destPath)) {
        return { success: true, message: "Moduł był już zachowany lokalnie." }
    }

    try {
        let code = ""
        const res = await fetch(`${MDK_REGISTRY_URL}/${fileName}`)
        if (res.ok) {
            code = await res.text()
        } else {
            // Fallback (jeśli folder registry obok jest rozpakowany)
            code = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', fileName), 'utf-8')
        }

        const meta = parseMdkMetadata(code)
        if (meta.dependencies && meta.dependencies.length > 0) {
            // Zainstaluj dependencje Next.js
            try {
                await execAsync(`npm install ${meta.dependencies.join(' ')}`, { cwd: process.cwd() })
            } catch (instErr) {
                console.error("[MDK SYSTEM] NPM Install Failed:", instErr)
            }
        }

        code = code.replace(/\/\* MDK-METADATA[\s\S]*?\*\//, '').trim()
        fs.writeFileSync(destPath, code)

        return { success: true }
    } catch (e: any) {
        console.error("MDK Module Error:", e)
        return { error: `Nie udało się pobrać kodu: ${e.message}` }
    }
}
