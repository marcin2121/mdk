import os

filepath = r"c:\molendavdevelopment\mdk\lib\actions\setup-wizard.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

anchor_start = "// 4.5. MODULES INJECTION: Chatbot & Calculator (UI Components Generator)"
anchor_end = "// 4.6. WSTRZYKIWANIE TYPOGRAFII I ANALITYKI DO layout.tsx"

if anchor_start not in content:
    print("Anchor start not found")
    exit(1)

if anchor_end not in content:
    print("Anchor end not found")
    exit(1)

before_modules = content.split(anchor_start)[0]
after_modules = content.split(anchor_end)[1]

new_code = r"""
    let appendedComponents = "";
    let appendedImports = "";
    
    const MDK_REGISTRY_URL = 'https://raw.githubusercontent.com/marcin2121/mdk-registry/main/components';

    if (config.branding.modules) {
        const MODULE_FILES_MAP: Record<string, string> = {
            chatbot: 'chatbot.txt',
            calculator: 'calculator.txt',
            testimonials: 'testimonials.txt',
            pricing: 'pricing-cards.txt',
            faq: 'accordion-faq.txt'
        };

        const activeModules = Object.keys(config.branding.modules).filter(k => 
            config.branding.modules[k] === true && MODULE_FILES_MAP[k]
        );

        for (const modId of activeModules) {
            const fileName = MODULE_FILES_MAP[modId];
            const className = modId.charAt(0).toUpperCase() + modId.slice(1); 
            
            console.log(`[MDK SYSTEM] Pobieranie Modułu ${className} ze zdalnego repozytorium...`);
            const componentsDir = path.join(process.cwd(), 'components', 'mdk');
            if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

            let code = "";
            try {
                const res = await fetch(`${MDK_REGISTRY_URL}/${fileName}`);
                if (res.ok) {
                    code = await res.text();
                } else {
                    throw new Error(`Fetch failed`);
                }
            } catch (err) {
                try {
                    code = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', fileName), 'utf-8');
                } catch {
                    code = `export default function ${className}Crash() { return <div className="p-4 border border-red-500">MDK Registry Error: Moduł ${fileName} niedostępny.</div> }`;
                }
            }

            if (modId === 'chatbot') {
                code = code.replace(/{{CHATBOT_CONTEXT}}/g, config.branding.modules.chatbotContext || "Pomóż klientowi i odpowiadaj krótko.");
            }

            const meta = parseMdkMetadata(code);
            if (meta.dependencies?.length > 0) {
                console.log(`[MDK] Autoinstalacja zależności dla ${className}: ${meta.dependencies.join(' ')}`);
                try { await execAsync(`npm install ${meta.dependencies.join(' ')}`); } catch (e) {}
            }
            code = code.replace(/\/\* MDK-METADATA[\s\S]*?\*\//, '').trim();

            fs.writeFileSync(path.join(componentsDir, `${className}.tsx`), code);
            appendedImports += `import ${className} from '@/components/mdk/${className}';\n`;
            
            if (modId === 'chatbot') {
                appendedComponents += `<${className} />\n`;
            } else {
                appendedComponents += `\n            {/* Wstrzykiwany Moduł ${className} */}\n            <${className} />\n`;
            }
        }
    }
"""

content_new = before_modules + anchor_start + "\n" + new_code + "\n    " + anchor_end + after_modules

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content_new)

print("Success building dynamic loop")
