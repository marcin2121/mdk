"use server"

import fs from 'fs'
import path from 'path'

export async function generateLivePreview(templateId: string, branding: any) {
    try {
        console.log(`[Molenda CLI] Wypalanie Live Preview w locie dla: ${templateId}...`)
        
        const isEn = branding.lang === 'en';
        let rawCodeStr = "";
        const templatesDir = path.join(process.cwd(), '..', 'mdk-registry', 'templates');
        const exactPath = path.join(templatesDir, isEn ? `${templateId}-en.txt` : `${templateId}.txt`);
        const fallbackIdPath = path.join(templatesDir, `${templateId}.txt`);
        const ultimateFallback = path.join(templatesDir, isEn ? 'saas-ai-en.txt' : 'saas-ai.txt');

        try {
            if (fs.existsSync(exactPath)) {
                rawCodeStr = fs.readFileSync(exactPath, 'utf-8');
            } else if (fs.existsSync(fallbackIdPath)) {
                // If English specific doesn't exist, try the base one
                rawCodeStr = fs.readFileSync(fallbackIdPath, 'utf-8');
            } else {
                rawCodeStr = fs.readFileSync(ultimateFallback, 'utf-8');
            }
        } catch(e) {
            console.error(`[Molenda CLI] Template loading failed for ${templateId}`, e);
            // absolute desperate fallback
            try { rawCodeStr = fs.readFileSync(path.join(templatesDir, 'saas-ai.txt'), 'utf-8'); } catch(err) {}
        }

        const brandName = branding.companyName || "MDK STARTUP"
        
        // Guard against incomplete hex codes (e.g., just '#') while typing
        const primaryColor = (branding.primaryColor && branding.primaryColor.startsWith('#') && branding.primaryColor.length === 7) 
            ? branding.primaryColor 
            : "#f97316"; // global fallback if incomplete
            
        const heroImage = branding.heroImageUrl || "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070"
        
        const aiHeroTitle = branding.heroTitle || (isEn 
            ? `Modern <br/> <span style="color: ${primaryColor}">Infrastructure.</span>`
            : `Infrastruktura <br/> <span style="color: ${primaryColor}">W Nowej Epoce.</span>`)
            
        const aiHeroDesc = branding.heroDesc || (isEn 
            ? `Automatically processed by MDK Live Engine. Build scalable apps right now.`
            : `Automatycznie przetworzone przez MDK Live Engine. Zbuduj skalowalne aplikacje już teraz.`)

        const ctaText = branding.ctaText || (isEn ? "Sign In" : "Zaloguj");
        const address = branding.address || (isEn ? "123 Architect St, NYC" : "ul. Przykładowa 1");

        let compiledCode = rawCodeStr
           .replace(/{{COMPANY_NAME}}/g, brandName)
           .replace(/{{PRIMARY_COLOR}}/g, primaryColor)
           .replace(/{{HERO_IMAGE}}/g, heroImage)
           .replace(/{{CTA_TEXT}}/g, ctaText)
           .replace(/{{CONTACT_PHONE}}/g, branding.contactPhone || (isEn ? "+1 (123) 000-0000" : "+48 000 000 000"))
           .replace(/{{CONTACT_EMAIL}}/g, branding.contactEmail || "contact@company.com")
           .replace(/{{ADDRESS}}/g, address)
           .replace(/{{HERO_TITLE}}/g, aiHeroTitle)
           .replace(/{{HERO_DESC}}/g, aiHeroDesc);

        // FEATURE 5: Dynamic Navbar & Footer Injection (Copied from setup-wizard)
        let newHeader = "";
        if (branding.navbarStyle === 'glass') {
            newHeader = `
          <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-full flex items-center justify-between px-8 h-16 z-50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
             <div className="font-black text-xl tracking-tighter uppercase flex items-center gap-3">
                <span className="text-white">${brandName}</span>
             </div>
              <nav className="flex items-center gap-6 text-sm font-bold tracking-widest uppercase">
                 <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">${isEn ? 'Home' : 'Start'}</span>
                 <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">${isEn ? 'Services' : 'Usługi'}</span>
                 <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">${isEn ? 'Premium' : 'Oferta Premium'}</span>
                 <button className="text-black px-6 py-2 rounded-full transition-transform hover:scale-105" style={{ backgroundColor: '${primaryColor}' }}>${branding.ctaText || (isEn ? 'Action' : 'Akcja')}</button>
              </nav>
          </header>
            `;
        } else if (branding.navbarStyle === 'minimal') {
            newHeader = `
          <header className="border-b border-zinc-800 bg-[#0A0A0A] px-6 h-16 flex items-center justify-between sticky top-0 z-50">
             <div className="font-bold text-lg tracking-widest uppercase text-white">${brandName}</div>
             <button className="text-[var(--mdk-primary)] font-mono text-sm uppercase tracking-widest hover:underline" style={{ color: '${primaryColor}' }}>${branding.ctaText || 'Akcja'}</button>
          </header>
            `;
        } else if (branding.navbarStyle === 'hidden') {
            newHeader = ``;
        }
        if (newHeader !== "") {
            const hasHeader = compiledCode.includes('<header');
            const navRegex = hasHeader ? /<header[\s\S]*?<\/header>/ : /<nav[\s\S]*?<\/nav>/;
            compiledCode = compiledCode.replace(navRegex, newHeader.trim());
        }

        let newFooter = "";
        if (branding.footerStyle === 'glass') {
            newFooter = `
          <footer className="mt-20 my-6 mx-auto w-[95%] max-w-7xl bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--mdk-primary)] opacity-50 blur-xl" style={{ backgroundColor: '${primaryColor}' }}></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 text-center md:text-left">
                <div>
                   <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-4">${brandName}</h4>
                   <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">${branding.address || 'Adres'}</p>
                </div>
                 <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest text-zinc-400">
                    <span className="hover:text-[var(--mdk-primary)] cursor-pointer transition-colors" style={{ ':hover': { color: '${primaryColor}' } } as any}>${isEn ? 'Home' : 'Start'}</span>
                    <span className="hover:text-[var(--mdk-primary)] cursor-pointer transition-colors" style={{ ':hover': { color: '${primaryColor}' } } as any}>${isEn ? 'Offer' : 'Oferta'}</span>
                    <span className="hover:text-[var(--mdk-primary)] cursor-pointer transition-colors" style={{ ':hover': { color: '${primaryColor}' } } as any}>${isEn ? 'Estimates' : 'Kosztorys'}</span>
                 </div>
                 <div>
                    <p className="font-mono text-zinc-500 mb-2">${isEn ? 'Quick Contact' : 'Szybki Kontakt'}</p>
                   <p className="text-xl font-black text-white mb-1">${branding.contactPhone || 'TEL'}</p>
                   <p className="text-[var(--mdk-primary)]" style={{ color: '${primaryColor}' }}>${branding.contactEmail || 'MAIL'}</p>
                </div>
             </div>
             <div className="border-t border-zinc-800/50 mt-12 pt-6 text-center text-zinc-700 font-mono text-xs">
                © 2026 ${brandName}. Architektura MDK Live Preview.
             </div>
          </footer>
            `;
        } else if (branding.footerStyle === 'minimal') {
            newFooter = `
          <footer className="border-t border-zinc-900 mt-32 py-8 text-center text-zinc-700 font-mono text-xs uppercase tracking-widest">
             © 2026 ${brandName}. ${isEn ? 'All rights reserved.' : 'Wszelkie prawa zastrzeżone.'}
          </footer>
            `;
        }
        if (newFooter !== "") compiledCode = compiledCode.replace(/<footer[\s\S]*?<\/footer>/, newFooter.trim());

        // Replace global styles to inline styles just for the preview to work without tailwind injection config
        compiledCode = compiledCode.replace(/var\(--mdk-primary\)/g, primaryColor)
                                   .replace(/className="text-\[var\(--mdk-primary\)\]/g, `style={{ color: '${primaryColor}' }} className="`)
                                   .replace(/className="bg-\[var\(--mdk-primary\)\]/g, `style={{ backgroundColor: '${primaryColor}' }} className="`)
                                   .replace(/className="border-\[var\(--mdk-primary\)\]/g, `style={{ borderColor: '${primaryColor}' }} className="`);

        // Handle font family injection inline for preview
        let fontCssValue = '"Geist", sans-serif'; // CSS font-family value with proper quoting
        let fontCdn = '';
        
        if (branding.typography === 'inter') {
            fontCssValue = '"Inter", sans-serif';
            fontCdn = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap';
        } else if (branding.typography === 'playfair') {
            fontCssValue = '"Playfair Display", serif';
            fontCdn = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap';
        } else if (branding.typography === 'outfit') {
            fontCssValue = '"Outfit", sans-serif';
            fontCdn = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap';
        }

        // Inject CDN link and * { font-family } into the template
        // Use regex to handle both LF and CRLF line endings
        if (fontCdn) {
            const returnMatch = compiledCode.match(/return\s*\(\s*[\r\n]/);
            if (returnMatch) {
                const matchStr = returnMatch[0];
                compiledCode = compiledCode.replace(matchStr, `${matchStr}    <>\n      <link rel="stylesheet" href="${fontCdn}" />\n      <style>{\`* { font-family: ${fontCssValue} !important; }\`}</style>\n`);
                // Close the fragment before the last );
                const lastClose = compiledCode.lastIndexOf(');');
                if (lastClose > 0) {
                    compiledCode = compiledCode.slice(0, lastClose) + '\n    </>\n  );' + compiledCode.slice(lastClose + 2);
                }
            }
        }


        // INIEKCJA ZAAWANSOWANYCH MODUŁÓW (TESTIMONIALS/PRICING/FAQ ITD) PRZEZ POBRANY MDK-REGISTRY
        let appendedImports = "";
        let appendedComponents = "";
        if (branding.modules) {
            const activeModules = Object.keys(branding.modules).filter(k => branding.modules[k] === true);
            for (const modId of activeModules) {
                const className = modId.charAt(0).toUpperCase() + modId.slice(1);
                appendedImports += `import ${className} from '@/components/mdk/${className}';\n`;
                appendedComponents += `\n            {/* Live Moduł MDK: ${className} */}\n            <${className} />\n`;
            }
        }
        
        if (appendedComponents !== "") {
           compiledCode = appendedImports + compiledCode;
           compiledCode = compiledCode.replace('</main>', `${appendedComponents}\n        </main>`);
        }

        // Wstrzyknij @ts-nocheck żeby omijać błędy kompilatora na podglądzie
        compiledCode = "// @ts-nocheck\n" + compiledCode;

        // Save
        const dir = path.join(process.cwd(), 'app', 'live-preview');
        if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        fs.writeFileSync(path.join(dir, 'page.tsx'), compiledCode);

        // Also we need to copy over the globals so it renders smoothly?
        // Actually, just having page.tsx is fine since RootLayout provides CSS.

        return { timestamp: Date.now() }

    } catch(e: any) {
        console.error("Preview Generator Error", e);
        return { error: e.message }
    }
}
