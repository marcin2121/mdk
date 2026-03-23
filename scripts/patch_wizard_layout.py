import os

filepath = r"c:\molendavdevelopment\mdk\lib\actions\setup-wizard.ts"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

snippet = r"""

    // 4.1 INIEKCJA HEADER / FOOTER W ZALEŻNOŚCI OD WYBRANEGO STYLU 
    // Zastępuje domyślne tagi <header> i <footer> w pobranym szablonie
    let newHeader = "";
    if (config.branding.navbarStyle === 'glass') {
        newHeader = `
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-full flex items-center justify-between px-8 h-16 z-50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
         <div className="font-black text-xl tracking-tighter uppercase flex items-center gap-3">
            <span className="text-white">{{COMPANY_NAME}}</span>
         </div>
         <nav className="flex items-center gap-6 text-sm font-bold tracking-widest uppercase">
            <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Usługi</span>
            <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Cennik</span>
            <button className="text-black px-6 py-2 rounded-full transition-transform hover:scale-105" style={{ backgroundColor: '{{PRIMARY_COLOR}}' }}>{{CTA_TEXT}}</button>
         </nav>
      </header>
        `;
    } else if (config.branding.navbarStyle === 'minimal') {
        newHeader = `
      <header className="border-b border-zinc-800 bg-[#0A0A0A] px-6 h-16 flex items-center justify-between sticky top-0 z-50">
         <div className="font-bold text-lg tracking-widest uppercase text-white">{{COMPANY_NAME}}</div>
         <button className="text-[var(--mdk-primary)] font-mono text-sm uppercase tracking-widest hover:underline">{{CTA_TEXT}}</button>
      </header>
        `;
    } else if (config.branding.navbarStyle === 'hidden') {
        newHeader = ``;
    }

    if (newHeader !== "") {
        compiledCode = compiledCode.replace(/<header[\s\S]*?<\/header>/, newHeader.trim());
    }

    let newFooter = "";
    if (config.branding.footerStyle === 'glass') {
        newFooter = `
      <footer className="mt-20 my-6 mx-auto w-[95%] max-w-7xl bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/60 rounded-[3rem] p-12 shadow-2xl overflow-hidden relative">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-[var(--mdk-primary)] opacity-50 blur-xl"></div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 text-center md:text-left">
            <div>
               <h4 className="text-white font-black text-2xl uppercase tracking-tighter mb-4">{{COMPANY_NAME}}</h4>
               <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">{{ADDRESS}}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm font-bold uppercase tracking-widest text-zinc-400">
               <span className="hover:text-[var(--mdk-primary)] cursor-pointer transition-colors">Start</span>
               <span className="hover:text-[var(--mdk-primary)] cursor-pointer transition-colors">Oferta</span>
               <span className="hover:text-[var(--mdk-primary)] cursor-pointer transition-colors">Kosztorys</span>
            </div>
            <div>
               <p className="font-mono text-zinc-500 mb-2">Szybki Kontakt</p>
               <p className="text-xl font-black text-white mb-1">{{CONTACT_PHONE}}</p>
               <p className="text-[var(--mdk-primary)]">{{CONTACT_EMAIL}}</p>
            </div>
         </div>
         <div className="border-t border-zinc-800/50 mt-12 pt-6 text-center text-zinc-700 font-mono text-xs">
            © 2026 {{COMPANY_NAME}}. Architektura MDK.
         </div>
      </footer>
        `;
    } else if (config.branding.footerStyle === 'minimal') {
        newFooter = `
      <footer className="border-t border-zinc-900 mt-32 py-8 text-center text-zinc-700 font-mono text-xs uppercase tracking-widest">
         © 2026 {{COMPANY_NAME}}. Wszelkie prawa zastrzeżone.
      </footer>
        `;
    }

    if (newFooter !== "") {
        compiledCode = compiledCode.replace(/<footer[\s\S]*?<\/footer>/, newFooter.trim());
    }
"""

anchor = r"// 4.5. MODULES INJECTION: Chatbot & Calculator"

if anchor in content:
    content = content.replace(anchor, snippet + "\n    " + anchor)
    print("Success injecting layout builder snippet.")
else:
    print("Error: anchor for layout build not found.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Setup Wizard modified ok.")
