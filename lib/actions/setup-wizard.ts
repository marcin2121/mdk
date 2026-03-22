"use server"

import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Powłoka wykonawcza rozszerzona o payload brandingowy (nazwa, obraz, wariant wizualny)
export async function runSetupAction(packages: string[], config: any) {
  try {
    if (packages.length > 0) {
      console.log(`[Molenda CLI] Instalowanie zaleznosci: ${packages.join(', ')}...`)
      
      const { stdout, stderr } = await execAsync(`npm install ${packages.join(' ')} --save`)
      
      console.log(`[Molenda CLI] Pakiety zainstalowane. Wynik:`, stdout)
      if (stderr) console.error(`[Molenda CLI] Ostrzeżenia NPM:`, stderr)
    }

    // 1.5. OBSŁUGA OPCJONALNYCH PAKIETÓW (Showcase)
    if (config.branding?.selectedPackages && config.branding.selectedPackages.length > 0) {
       console.log(`[Molenda CLI] Przetwarzanie dodatkowych pakietów: ${config.branding.selectedPackages.join(', ')}...`)
       
       let extraPackages: string[] = []
       let extraDevPackages: string[] = []
       
       config.branding.selectedPackages.forEach((id: string) => {
          if (id === 'prettier') extraDevPackages.push('prettier', 'prettier-plugin-tailwindcss');
          if (id === 'husky') extraDevPackages.push('husky');
          if (id === 'prisma') extraPackages.push('prisma', '@prisma/client');
          if (id === 'drizzle') extraPackages.push('drizzle-orm', 'drizzle-kit');
          if (id === 'zustand') extraPackages.push('zustand');
          if (id === 'query') extraPackages.push('@tanstack/react-query');
          if (id === 'axios') extraPackages.push('axios');
          if (id === 'clerk') extraPackages.push('@clerk/nextjs');
          if (id === 'nextauth') extraPackages.push('next-auth');
          if (id === 'framer') extraPackages.push('framer-motion');
          if (id === 'gsap') extraPackages.push('gsap');
          if (id === 'reacticons') extraPackages.push('react-icons');
          if (id === 'stripe') extraPackages.push('stripe', '@stripe/stripe-js');
          if (id === 'resend') extraPackages.push('resend', '@react-email/components');
          if (id === 'uploadthing') extraPackages.push('uploadthing');
          if (id === 'sentry') extraPackages.push('@sentry/nextjs');
          if (id === 'redis') extraPackages.push('@upstash/redis');
          if (id === 'datefns') extraPackages.push('date-fns');
          if (id === 'pusher') extraPackages.push('pusher-js');
          if (id === 'markdown') extraPackages.push('react-markdown', 'rehype-raw', 'remark-gfm');
          if (id === 'sonner') extraPackages.push('sonner');
       })

       if (extraPackages.length > 0) {
          console.log(`[Molenda CLI] Instalowanie dodatkowych bibliotek: ${extraPackages.join(' ')}`)
          await execAsync(`npm install ${extraPackages.join(' ')}`)
       }

       if (extraDevPackages.length > 0) {
          console.log(`[Molenda CLI] Instalowanie dodatkowych DEV bibliotek: ${extraDevPackages.join(' ')}`)
          await execAsync(`npm install ${extraDevPackages.join(' ')} -D`)
       }

       if (config.branding.selectedPackages.includes('docker')) {
          console.log(`[Molenda CLI] Generowanie plików Docker (Dockerfile, compose)...`)
          const dockerfile = `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY .\nRUN npm run build\nEXPOSE 3000\nCMD ["npm", "start"]`
          const dockerCompose = `version: '3.8'\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    env_file:\n      - .env.local`
          
          fs.writeFileSync(path.join(process.cwd(), 'Dockerfile'), dockerfile)
          fs.writeFileSync(path.join(process.cwd(), 'docker-compose.yml'), dockerCompose)
       }
    }

    // 2. INIEKCJA ARCHITEKTURY REJESTROWEJ (Registry Pattern)
    // Zamiast wstrzykiwać kod z ogromnych brzydkich i ciężkich plików JS do repozytorium, 
    // architekci pobierają szablony jako czysty surowy tekst 
    // albo po URL (.fetch('https...')) albo z wydzielonego pliku lokalnego 'registry/'.
    // W tej implementacji symulujemy fetch czytając przygotowany na zewnątrz czysty TXT.
    
    // Szukamy pasującego pliku w wydzielonym repozytorium/folderze 'registry/' (Jak w shadcn CLI)
    const registryFileName = config.templateId + '.txt';
    // MDK szuka plików z WYDZIELONEGO repozytorium (folder izolowany poza główną bazą projektową)
    const registryPath = path.join(process.cwd(), '..', 'mdk-registry', 'templates', registryFileName);
    
    let rawCodeStr = "";
    try {
        rawCodeStr = fs.readFileSync(registryPath, 'utf-8');
    } catch(e) {
        // Fallback w przypadku braku wybranego szablonu tekstowego (Fail-safe)
        rawCodeStr = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'templates', 'saas-ai.txt'), 'utf-8');
    }

    // 3. AI SEO GENERATION (MDK GEMINI INTEGRATION)
    const brandName = config.branding.companyName || "MDK Startup"
    const primaryColor = config.branding.primaryColor || "#EAB308"
    const heroImage = config.branding.heroImageUrl || ""
    
    // Dynamicznie przepisz zmienne tekstowe używając Sztucznej Inteligencji przed kompilacją
    let aiHeroTitle = `Twój Biznes <br/> <span style={{ color: '${primaryColor}' }}>W Nowej Epoce.</span>`
    let aiHeroDesc  = `Skalowalna architektura i niezwykła szybkość ładowania poprawiająca SEO oraz współczynnik konwersji Twoich klientów.`

    if (config.branding.useAI && config.branding.aiKey && config.branding.seoKeywords) {
        console.log(`[MDK AI] Uderzanie do endpointów ${config.branding.aiProvider.toUpperCase()} w trybie REST API...`)
        try {
            const contextAddon = config.branding.aiContext ? `Dodatkowy kontekst od kierownika projektu: ${config.branding.aiContext}` : '';
            const optDb = config.branding.generateDatabase ? `, klucz "sqlSchema" z czystym poprawnym kodem SQL tworzącym 3 pełne tabele do bazy Supabase` : '';
            const optTop = config.branding.generateTopology ? `, oraz klucz "subpages" z tablicą (min. 2 obiekty: "slug" url podstrony bez ukośnika, "title" nagłówek, "content" wyczerpujący kod HTML podstrony)` : '';
            
            const prompt = `Jesteś światowej klasy ekspertem SEO i Programistą MDK. Nazwa firmy: "${brandName}". Główne słowa kluczowe SEO: "${config.branding.seoKeywords}". ${contextAddon}. Zwróć TYLKO czysty obiekt w poprawnym formacie JSON. Zawartość: "heroTitle" (max 4 słowa, agresywny tytuł B2B), "heroDesc" (Opis na ok. 250 znaków upchnięte bardzo inteligentnie słowa kluczowe)${optDb}${optTop}.`;
            
            let extractedJsonText = "";

            if (config.branding.aiProvider === 'gemini') {
                const modelName = config.branding.aiModel || 'gemini-1.5-flash';
                const aiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.branding.aiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });
                if (!aiRes.ok) {
                    const err = await aiRes.json().catch(()=>({}));
                    throw new Error(err?.error?.message || `Google API Error: HTTP ${aiRes.status}`);
                }
                const data = await aiRes.json();
                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    extractedJsonText = data.candidates[0].content.parts[0].text;
                }
            } 
            else if (config.branding.aiProvider === 'openai' || config.branding.aiProvider === 'custom') {
                const endpointUrl = (config.branding.aiProvider === 'custom' && config.branding.aiCustomEndpoint)
                     ? config.branding.aiCustomEndpoint 
                     : 'https://api.openai.com/v1/chat/completions';
                     
                const aiRes = await fetch(endpointUrl, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.branding.aiKey}`
                    },
                    body: JSON.stringify({
                        model: config.branding.aiModel || "gpt-4o-mini",
                        messages: [{ role: "user", content: prompt }],
                        response_format: { type: "json_object" }
                    })
                });
                if (!aiRes.ok) {
                    const err = await aiRes.json().catch(()=>({}));
                    throw new Error(err?.error?.message || `OpenAI/Custom API Error: HTTP ${aiRes.status}`);
                }
                const data = await aiRes.json();
                if (data.choices && data.choices[0].message.content) {
                    extractedJsonText = data.choices[0].message.content;
                }
            }
            else if (config.branding.aiProvider === 'claude') {
                const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-api-key': config.branding.aiKey,
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerously-allow-browser': 'true' // Allow for isomorphic fetch
                    },
                    body: JSON.stringify({
                        model: config.branding.aiModel || "claude-3-5-sonnet-20241022",
                        max_tokens: 2500,
                        messages: [{ role: "user", content: prompt }]
                    })
                });
                if (!aiRes.ok) {
                    const err = await aiRes.json().catch(()=>({}));
                    throw new Error(err?.error?.message || `Claude API Error: HTTP ${aiRes.status}`);
                }
                const data = await aiRes.json();
                if (data.content && data.content[0].text) {
                    extractedJsonText = data.content[0].text;
                }
            }

            // Globalne parsowanie odfiltrowanego tekstu nienależnie od modelu
            if (extractedJsonText) {
                // Wycięcie ewentualnych znaczników json
                const cleanJsonStr = extractedJsonText.replace(/```json/g, '').replace(/```/g, '').trim();
                const aiResult = JSON.parse(cleanJsonStr);
                
                // Wzbogacamy Tytuł o stylizację koloru na ostatnim słowie dla zachowania Brutalizmu Designu
                const titleWords = aiResult.heroTitle.split(' ')
                if(titleWords.length > 1) {
                    const lastWord = titleWords.pop()
                    aiHeroTitle = `${titleWords.join(' ')} <br/><span style={{ color: '${primaryColor}' }}>${lastWord}</span>`
                } else {
                    aiHeroTitle = aiResult.heroTitle
                }
                aiHeroDesc = aiResult.heroDesc
                console.log("[MDK AI] Sukces. Model API dostarczył wylosowany i trafny Copywriting JSON.")
                
                // FEATURE 4: Multi-Page Topology Build
                if (config.branding.generateTopology && aiResult.subpages && Array.isArray(aiResult.subpages)) {
                   console.log(`[MDK AI] Generowanie ${aiResult.subpages.length} podstron Topologicznych (Routing Next.js)...`)
                   aiResult.subpages.forEach((page: any) => {
                      try {
                         const cleanSlug = page.slug.replace(/[^a-z0-9-]/gi, '').toLowerCase();
                         if (cleanSlug) {
                            const dirPath = path.join(process.cwd(), 'app', '(public)', cleanSlug);
                            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
                            
                            const pageCode = `export default function ${cleanSlug.charAt(0).toUpperCase() + cleanSlug.slice(1)}Page() {\n   return (\n      <div className="min-h-screen bg-[#050505] text-white pt-32 px-6">\n         <div className="max-w-4xl mx-auto">\n            <h1 className="text-5xl font-black uppercase tracking-tighter mb-10 text-[var(--mdk-primary)]">${page.title}</h1>\n            <div className="text-zinc-400 font-medium leading-relaxed">${page.content}</div>\n         </div>\n      </div>\n   )\n}`;
                            fs.writeFileSync(path.join(dirPath, 'page.tsx'), pageCode);
                         }
                      } catch (err) {}
                   });
                }

                // FEATURE 2: Supabase Schema Generation
                if (config.branding.generateDatabase && aiResult.sqlSchema) {
                   console.log(`[MDK AI] Wytwarzanie potężnych skryptów migracyjnych Supabase (Folder: supabase/migrations)...`)
                   const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
                   if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true });
                   const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
                   fs.writeFileSync(path.join(migrationsDir, `${timestamp}_mdk_ai_schema.sql`), aiResult.sqlSchema);
                }
            }
        } catch (e: any) {
            console.error("[MDK AI] Krytyczny błąd w autoryzacji AI/Model API:", e)
            return { error: `[Błąd Dostawcy AI] ${e.message || "Prawdopodobnie wprowadzono nieprawidłowy model, nieważny klucz API lub niedostępny endpoint. Spróbuj poprawić węzeł."}` };
        }
    }

    // 4. KOMPILACJA W LOCIE (Regex Template Engine)
    let compiledCode = rawCodeStr;

    // FEATURE 3: Globalne Wstrzykiwanie Tailwind CSS JIT (Zastępuje sztywne zmienne style="")
    if (config.branding.injectTailwindVars) {
        compiledCode = compiledCode.replace(/style=\{\{ color: '\{\{PRIMARY_COLOR\}\}' \}\}/g, `className="text-[var(--mdk-primary)] transition-colors"`)
                                   .replace(/style=\{\{ backgroundColor: '\{\{PRIMARY_COLOR\}\}' \}\}/g, `className="bg-[var(--mdk-primary)] transition-colors"`)
                                   .replace(/style=\{\{ borderColor: '\{\{PRIMARY_COLOR\}\}' \}\}/g, `className="border-[var(--mdk-primary)]"`);
        try {
            const cssPath = path.join(process.cwd(), 'app', 'globals.css');
            if (fs.existsSync(cssPath)) {
                let cssText = fs.readFileSync(cssPath, 'utf-8');
                if (!cssText.includes('--mdk-primary')) {
                    fs.appendFileSync(cssPath, `\n\n/* ----- MDK GLOBAL ENGINE INJECTION ----- */\n@layer base {\n  :root {\n    --mdk-primary: ${primaryColor};\n  }\n}\n`);
                    console.log(`[MDK SYSTEM] Wpięto globalnie: --mdk-primary do globals.css z HEX: ${primaryColor}.`);
                }
            }
        } catch (e) {
            console.error("[MDK SYSTEM] Ostrzeżenie! Błąd nadpisywania CSS.", e);
        }
    }

    compiledCode = compiledCode
       .replace(/{{COMPANY_NAME}}/g, brandName)
       .replace(/{{PRIMARY_COLOR}}/g, primaryColor)
       .replace(/{{HERO_IMAGE}}/g, heroImage)
       .replace(/{{CTA_TEXT}}/g, config.branding.ctaText || "Zaloguj")
       .replace(/{{CONTACT_PHONE}}/g, config.branding.contactPhone || "+48 000 000 000")
       .replace(/{{CONTACT_EMAIL}}/g, config.branding.contactEmail || "kontakt@firma.pl")
       .replace(/{{ADDRESS}}/g, config.branding.address || "ul. Przykładowa 1")
       // Flagowane znaczniki AI
       .replace(/{{HERO_TITLE}}/g, aiHeroTitle)
       .replace(/{{HERO_DESC}}/g, aiHeroDesc);

    // 4.5. MODULES INJECTION: Chatbot & Calculator (UI Components Generator)
    let appendedComponents = "";
    let appendedImports = "";
    
    // GŁÓWNY ADRES NOWEGO REPOZYTORIUM Z MODUŁAMI
    const MDK_REGISTRY_URL = 'https://raw.githubusercontent.com/marcin2121/mdk-registry/main/components';

    if (config.branding.modules?.chatbot) {
       console.log(`[MDK SYSTEM] Pobieranie Modułu Chatbota ze zdalnego repozytorium mdk-registry...`);
       const componentsDir = path.join(process.cwd(), 'components', 'mdk');
       if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
       
       let chatbotCode = "";
       try {
           const res = await fetch(`${MDK_REGISTRY_URL}/chatbot.txt`);
           if (res.ok) {
               chatbotCode = await res.text();
           } else {
               throw new Error(`API Github odrzuciło żądanie z kodem HTTP: ${res.status}`);
           }
       } catch (err: any) {
           console.log("[MDK SYSTEM] Moduł z GitHub niedostępny, używam wersji z lokalnego repozytorium twórcy (../mdk-registry/components)...");
           try {
               chatbotCode = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', 'chatbot.txt'), 'utf-8');
           } catch {
               console.error("[MDK SYSTEM] Fatal Error - Moduł w pełni niedostępny lokalnie i zdalnie:", err.message);
               chatbotCode = `export default function ChatbotCrash() { return <div className="fixed bottom-4 right-4 bg-red-900 border border-red-500 text-red-200 text-xs p-4 rounded-xl shadow-2xl z-50"><b>MDK Registry Error</b>: Plik chatbot.txt niedostępny online na koncie twórcy ani w repozytorium lokalnym.</div> }`;
           }
       }
       
       // Szybkie wstrzyknięcie Kontekstu (Promptu dewelopera) do komponentu klienta
       chatbotCode = chatbotCode.replace(/{{CHATBOT_CONTEXT}}/g, config.branding.modules.chatbotContext || "Pomóż klientowi i odpowiadaj krótko.");
       
       fs.writeFileSync(path.join(componentsDir, 'Chatbot.tsx'), chatbotCode);
       appendedImports += `import Chatbot from '@/components/mdk/Chatbot';\n`;
       appendedComponents += `<Chatbot />\n`;
    }

    if (config.branding.modules?.calculator) {
       console.log(`[MDK SYSTEM] Pobieranie Modułu Kalkulatora ze zdalnego repozytorium mdk-registry...`);
       const componentsDir = path.join(process.cwd(), 'components', 'mdk');
       if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
       
       let calcCode = "";
       try {
           const res = await fetch(`${MDK_REGISTRY_URL}/calculator.txt`);
           if (res.ok) {
               calcCode = await res.text();
           } else {
               throw new Error(`API Github odrzuciło żądanie z kodem HTTP: ${res.status}`);
           }
       } catch (err: any) {
           console.log("[MDK SYSTEM] Moduł kalkulatora z GitHub niedostępny, używam wersji z lokalnego repozytorium twórcy (../mdk-registry/components)...");
           try {
               calcCode = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', 'calculator.txt'), 'utf-8');
           } catch {
               console.error("[MDK SYSTEM] Fatal Error - Kalkulator niedostępny lokalnie i zdalnie:", err.message);
               calcCode = `export default function CalculatorCrash() { return <div className="p-8 border-2 border-red-500/50 bg-red-900/20 text-red-500 font-bold max-w-4xl mx-auto rounded mt-20">MDK Registry Error: Moduł calculator.txt nie istnieje na bazowym GitHubie ani w repozytorium lokalnym.</div> }`;
           }
       }
       
       fs.writeFileSync(path.join(componentsDir, 'Calculator.tsx'), calcCode);
       appendedImports += `import Calculator from '@/components/mdk/Calculator';\n`;
       appendedComponents += `\n            {/* Wstrzykiwany Modul Kalkulatora */}\n            <Calculator />\n`;
    }

    if (config.branding.modules?.testimonials) {
       console.log(`[MDK SYSTEM] Pobieranie Modułu Testimonials ze zdalnego repozytorium mdk-registry...`);
       const componentsDir = path.join(process.cwd(), 'components', 'mdk');
       if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
       
       let testCode = "";
       try {
           const res = await fetch(`${MDK_REGISTRY_URL}/testimonials.txt`);
           if (res.ok) {
               testCode = await res.text();
           } else {
               throw new Error(`API Github odrzuciło: ${res.status}`);
           }
       } catch (err: any) {
           try {
               testCode = fs.readFileSync(path.join(process.cwd(), '..', 'mdk-registry', 'components', 'testimonials.txt'), 'utf-8');
           } catch {
               testCode = `export default function TestiCrash() { return <div className="border border-red-500 p-4">Brak komponentu Referencji (Testimonials).</div> }`;
           }
       }
       
       fs.writeFileSync(path.join(componentsDir, 'Testimonials.tsx'), testCode);
       appendedImports += `import Testimonials from '@/components/mdk/Testimonials';\n`;
       appendedComponents += `\n            {/* Wstrzykiwany Suwak Referencji */}\n            <Testimonials />\n`;
    }

    // 4.6. WSTRZYKIWANIE TYPOGRAFII I ANALITYKI DO layout.tsx
    if (config.branding.typography || config.branding.analyticsId || config.branding.selectedPackages?.includes('sonner')) {
        console.log(`[MDK SYSTEM] Modyfikacja pliku app/layout.tsx (Typografia: ${config.branding.typography}, Analytics: ${config.branding.analyticsId ? 'TAK' : 'NIE'})`);
        try {
            const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
            if (fs.existsSync(layoutPath)) {
                let layoutFile = fs.readFileSync(layoutPath, 'utf-8');
                
                // Analityka Pixel/GA4
                if (config.branding.analyticsId) {
                    const trackingScript = `\n        {/* MDK Analytics Injection */}\n        <script async src="https://www.googletagmanager.com/gtag/js?id=${config.branding.analyticsId}"></script>\n        <script dangerouslySetInnerHTML={{ __html: \`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${config.branding.analyticsId}');\` }} />\n`;
                    layoutFile = layoutFile.replace('<body', `${trackingScript}\n      <body`);
                }

                // Sonner Toaster
                if (config.branding.selectedPackages?.includes('sonner')) {
                    if (!layoutFile.includes('<Toaster')) {
                        layoutFile = layoutFile.replace(`import "./globals.css";`, `import "./globals.css";\nimport { Toaster } from "sonner";`);
                        layoutFile = layoutFile.replace('{children}', `{children}\n        <Toaster position="top-right" theme="dark" />`);
                    }
                }

                // Typografia
                if (config.branding.typography && config.branding.typography !== 'geist') {
                    let fontImport = '';
                    let variableName = '';
                    
                    if (config.branding.typography === 'inter') { fontImport = 'Inter'; variableName = 'inter'; }
                    if (config.branding.typography === 'playfair') { fontImport = 'Playfair_Display'; variableName = 'playfair'; }
                    if (config.branding.typography === 'outfit') { fontImport = 'Outfit'; variableName = 'outfit'; }
                    
                    if (fontImport) {
                        layoutFile = layoutFile.replace(`import { Geist, Geist_Mono } from "next/font/google";`, `import { ${fontImport} } from "next/font/google";`);
                        layoutFile = layoutFile.replace(/const geistSans = Geist\(\{\s*variable: "--font-geist-sans",\s*subsets: \["latin"\],\s*\}\);\s*const geistMono = Geist_Mono\(\{\s*variable: "--font-geist-mono",\s*subsets: \["latin"\],\s*\}\);/g, `const ${variableName} = ${fontImport}({ subsets: ['latin'], variable: '--font-${variableName}' });`);
                        layoutFile = layoutFile.replace(/className={\`\$\{geistSans\.variable\} \$\{geistMono\.variable\}/g, `className={\`\$\{${variableName}.variable\}`);
                        layoutFile = layoutFile.replace(/\| Niezwykle szybkie strony internetowe/g, `| ${config.branding.companyName || 'MDK'}`);
                    }
                }
                
                fs.writeFileSync(layoutPath, layoutFile);
                console.log(`[MDK SYSTEM] Sukces nadpisywania layout.tsx.`);
            }
        } catch (e) {
            console.error(`[MDK SYSTEM] Błąd przy modyfikacji layout.tsx:`, e);
        }
    }

    if (appendedComponents) {
       // Podmieniamy nagłówki importów
       compiledCode = appendedImports + compiledCode;
       // Jeżeli szablon nie ma jawnie określonego <main>, próbujemy wsadzić w najbardziej logczny przedostatni kontener
       compiledCode = compiledCode.replace('</main>', `${appendedComponents}\n        </main>`);
    }

    // Zrujnowanie i zastąpienie starej aplikacji wyrenderowanym wynikiem!
    const pagePath = path.join(process.cwd(), 'app', '(public)', 'page.tsx')
    fs.writeFileSync(pagePath, compiledCode)

    console.log(`[MDK] Zastąpiono boilerplate. Wstrzyknięto zwalidowany szablon.`)

    // 5. Utworzenie .env.local dla Amatorów (Generowanie bezbłędnych kluczy)
    if (config.branding.supabaseUrl || config.branding.supabaseAnonKey) {
        console.log(`[MDK SYSTEM] Generowanie środowiska .env.local z kluczami API...`)
        let envContent = `# Automatycznie wygenerowane przez MDK Setup Wizard\n`
        envContent += `NEXT_PUBLIC_SUPABASE_URL="${config.branding.supabaseUrl || ''}"\n`
        envContent += `NEXT_PUBLIC_SUPABASE_ANON_KEY="${config.branding.supabaseAnonKey || ''}"\n`
        
        if (config.branding.supabaseServiceRole) {
            envContent += `\n# Tajny klucz serwerowy\nSUPABASE_SERVICE_ROLE_KEY="${config.branding.supabaseServiceRole}"\n`
        }
        
        if (config.branding.aiKey) {
            envContent += `\n# Klucz autoryzacji do wprowadzania promptów\nGEMINI_API_KEY="${config.branding.aiKey}"\n`
        }
        
        fs.writeFileSync(path.join(process.cwd(), '.env.local'), envContent)
    }

    // 6. Utworzenie pliku z konfiguracją dla Layoutu: .molenda-setup
    // Plik informuje komponenty ochronne i CMS, że tryb instalacji GUI się zakończył.
    const markerPath = path.join(process.cwd(), '.molenda-setup')
    const payload = {
       installed: true,
       templateId: config.templateId,
       branding: config.branding,
       date: new Date().toISOString()
    }
    
    fs.writeFileSync(markerPath, JSON.stringify(payload, null, 2))
    
    return { success: true }
  } catch (error: any) {
    console.error("[Molenda CLI] Krytyczny błąd instalatora Node.js:", error)
    return { error: error.message || "Wystąpił błąd egzekucji polecenia powłoki w Node.js." }
  }
}
