#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const args = process.argv.slice(2);
const command = args[0];
const subArgs = args.slice(1);

if (!command) {
    console.log(`
🔧 MDK CLI — Modular Plugin System

Usage:
   npm run mdk add <module>

Available Modules:
   - chatbot       (AI Assistant with dynamic provider prompt)
   - calculator    (Project Cost Estimator Slider)
   - pricing       (Subscription Section Cards)
`);
    process.exit(0);
}

if (command === 'add') {
    const componentId = subArgs[0];
    
    if (!componentId) {
        console.error('❌ Error: Please specify a module to add (e.g., chatbot)');
        process.exit(1);
    }

    if (componentId === 'chatbot') {
        installChatbot();
    } else {
        installGenericComponent(componentId);
    }
}

function installChatbot() {
    console.log(`\n🤖 [MDK add] Configuring Chatbot AI...`);

    rl.question('\nWhich AI Provider do you want to use? (gemini / openai / anthropic): ', (provider) => {
        const prov = provider.trim().toLowerCase();
        
        const validProviders = ['gemini', 'openai', 'anthropic'];
        if (!validProviders.includes(prov)) {
            console.error('❌ Invalid provider. Choose gemini, openai, or anthropic.');
            rl.close();
            return;
        }

        rl.question(`Enter your ${prov.toUpperCase()} API Key: `, (apiKey) => {
            const key = apiKey.trim();
            if (!key) {
                console.warn('⚠️  Warning: API Key was left empty. You can set it in .env.local later.');
            }

            const envMap: Record<string, string> = {
                gemini: 'GEMINI_API_KEY',
                openai: 'OPENAI_API_KEY',
                anthropic: 'ANTHROPIC_API_KEY'
            };

            updateEnvFile({
                [envMap[prov]]: key,
                'NEXT_PUBLIC_AI_PROVIDER': prov
            });

            const registryPath = path.join(process.cwd(), '..', 'mdk-registry', 'components', 'chatbot.txt');
            const targetPath = path.join(process.cwd(), 'components', 'mdk', 'Chatbot.tsx');

            if (!fs.existsSync(registryPath)) {
                console.error(`❌ Error: Could not find chatbot in registry at ${registryPath}`);
                rl.close();
                process.exit(1);
            }

            fs.mkdirSync(path.join(process.cwd(), 'components', 'mdk'), { recursive: true });

            const content = fs.readFileSync(registryPath, 'utf-8');
            fs.writeFileSync(targetPath, content, 'utf-8');
            console.log(`\n✅ Written component to: components/mdk/Chatbot.tsx`);

            const packageMap: Record<string, string[]> = {
                gemini: ['@google/generative-ai'],
                openai: ['openai'],
                anthropic: ['@anthropic-ai/sdk']
            };
            const deps = packageMap[prov] || [];
            deps.push('lucide-react', 'framer-motion');

            console.log(`\n📦 Installing dependencies: ${deps.join(', ')}...`);
            try {
                execSync(`npm install ${deps.join(' ')} --save`, { stdio: 'inherit' });
                console.log(`\n🎉 Chatbot added successfully! Import it via: '@/components/mdk/Chatbot'`);
            } catch (err: any) {
                console.error('❌ Failed to install packages:', err.message);
            }

            rl.close();
        });
    });
}

function installGenericComponent(modId: string) {
    const registryPath = path.join(process.cwd(), '..', 'mdk-registry', 'components', `${modId}.txt`);
    const targetPath = path.join(process.cwd(), 'components', 'mdk', `${modId.charAt(0).toUpperCase() + modId.slice(1)}.tsx`);

    if (!fs.existsSync(registryPath)) {
        console.error(`❌ Error: Module '${modId}' not found in registry.`);
        rl.close();
        process.exit(1);
    }

    fs.mkdirSync(path.join(process.cwd(), 'components', 'mdk'), { recursive: true });
    fs.copyFileSync(registryPath, targetPath);
    console.log(`\n✅ Added ${modId} component to: components/mdk`);
    rl.close();
}

function updateEnvFile(values: Record<string, string>) {
    const envPath = path.join(process.cwd(), '.env.local');
    let content = "";
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf-8');
    }

    for (const [key, val] of Object.entries(values)) {
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (content.match(regex)) {
            content = content.replace(regex, `${key}=${val}`);
        } else {
            content += `\n${key}=${val}`;
        }
    }

    fs.writeFileSync(envPath, content.trim() + '\n', 'utf-8');
    console.log(`✅ Updated .env.local variables.`);
}
