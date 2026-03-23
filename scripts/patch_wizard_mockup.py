import os

filepath = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Zmiana kontenera kroku 3 z max-w-5xl na max-w-7xl i dodanie grida
anchor_start = '{step === 3 && (\n            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-5xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">'
new_start = '{step === 3 && (\n            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-7xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">'

if anchor_start in content:
    content = content.replace(anchor_start, new_start)
    print("Fixed wrapper width.")
else:
    print("Warning: wrapper width not found.")

# 2. Split kontentu na lewą sekcję
header_b = '<div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">'

# We'll split the entire inner form section of Step 3 exactly after the header closes
grid_start = '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">'
grid_end = 'Dalej: Narzędzia Deweloperskie (Krok 4)\n                   </button>\n                </div>'
# wait, the button says "Dalej: MDK Registry (Krok 4)". I need to check exactly what the button inside step 3 says.
# from line 380: Dalej: MDK Registry (Krok 4)

button_find = 'onClick={() => setStep(4)}'

live_preview_code = r'''
               <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                  {/* LEWA STRONA: Ustawienia */}
                  <div className="xl:col-span-3 lg:h-[70vh] overflow-y-auto pr-4 snap-y custom-scrollbar space-y-10">
'''

closing_preview_code = r'''
                  </div>
                  
                  {/* PRAWA STRONA: MDK LIve Preview */}
                  <div className="xl:col-span-2 hidden xl:flex flex-col sticky top-0 h-[70vh]">
                     <div className="border border-zinc-800 rounded-2xl bg-[#050505] w-full h-full relative overflow-hidden flex flex-col shadow-[0_0_50px_rgba(249,115,22,0.1)] transition-all">
                        <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
                           <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/50"></div><div className="w-3 h-3 rounded-full bg-yellow-500/50"></div><div className="w-3 h-3 rounded-full bg-green-500/50"></div></div>
                           <div className="mx-auto bg-black border border-zinc-800 rounded-md px-10 py-1 text-[10px] text-zinc-500 font-mono tracking-widest flex items-center gap-2">
                              <ShieldAlert size={10} className="text-zinc-600"/> mbp-live-render.localhost
                           </div>
                        </div>
                        
                        <div className="flex-1 overflow-hidden relative" style={{ fontFamily: branding.typography === 'inter' ? 'Inter, sans-serif' : branding.typography === 'playfair' ? 'Playfair Display, serif' : branding.typography === 'outfit' ? 'Outfit, sans-serif' : 'Geist, sans-serif' }}>
                           
                           {/* Navbar Mock */}
                           {branding.navbarStyle === 'glass' && (
                              <div className="absolute top-4 left-1/2 w-[90%] -translate-x-1/2 rounded-full border border-zinc-700/50 bg-zinc-900/60 backdrop-blur-md h-10 flex items-center justify-between px-4 z-50">
                                 <span className="text-xs font-black text-white uppercase tracking-tighter" style={{ color: branding.primaryColor }}>{branding.companyName || 'MDK LOGO'}</span>
                                 <div className="w-16 h-5 rounded-full opacity-80" style={{ backgroundColor: branding.primaryColor }}></div>
                              </div>
                           )}
                           {branding.navbarStyle === 'minimal' && (
                              <div className="absolute top-0 w-full border-b border-zinc-800 bg-black h-12 flex items-center justify-between px-6 z-50">
                                 <span className="text-xs font-bold text-white uppercase tracking-widest">{branding.companyName || 'LOGO'}</span>
                                 <span className="text-[10px] uppercase font-bold" style={{ color: branding.primaryColor }}>{branding.ctaText || 'CTA'}</span>
                              </div>
                           )}

                           {/* Hero Mock */}
                           <div className="pt-24 px-6 pb-20 h-full flex flex-col items-center text-center overflow-y-auto custom-scrollbar">
                              <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-[8px] font-bold uppercase tracking-widest rounded-full mb-4 text-zinc-400">
                                 <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: branding.primaryColor }}></span> Live Rendering
                              </div>
                              <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 leading-tight">
                                 Infrastruktura <br/><span style={{ color: branding.primaryColor }}>Nowej Generacji</span>
                              </h1>
                              <p className="text-xs text-zinc-500 max-w-[280px] mb-6 border-l-2 pl-3" style={{ borderColor: branding.primaryColor }}>
                                 MDK symuluje wygląd Twojej aplikacji w czasie rzeczywistym.
                              </p>
                              
                              <div className="h-10 px-8 text-xs shrink-0 font-bold uppercase flex items-center justify-center text-black mb-8 transition-transform hover:scale-105 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.1)]" style={{ backgroundColor: branding.primaryColor }}>
                                 {branding.ctaText || 'Rozpocznij'}
                              </div>

                              <div className="w-full aspect-video border border-zinc-800 rounded-xl relative overflow-hidden bg-zinc-900/50 shadow-2xl">
                                {branding.heroImageUrl ? <img src={branding.heroImageUrl} className="w-full h-full object-cover opacity-80" /> : <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] text-zinc-700 font-mono tracking-widest border border-dashed border-zinc-800 m-4 rounded"><ImageIcon size={16} className="mb-2 opacity-50"/>HERO_IMAGE</div>}
                              </div>
                              
                              <div className="h-[200px]"></div> {/* spacer na scrollowanie */}
                           </div>

                           {/* Footer Mock */}
                           <div className="absolute bottom-0 w-full flex justify-center pointer-events-none align-bottom z-50">
                              {branding.footerStyle === 'glass' && (
                                 <div className="w-[95%] mb-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl h-20 p-4 flex flex-col justify-center text-[9px] shadow-2xl overflow-hidden relative pointer-events-auto">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 opacity-50 blur-xl" style={{ backgroundColor: branding.primaryColor }}></div>
                                    <span className="font-black text-white uppercase tracking-widest mb-1">{branding.companyName || 'MDK INC'}</span>
                                    <span className="text-zinc-500">{branding.address || 'Adres firmy pojawia się tutaj'}</span>
                                    <div className="absolute top-0 right-4 h-full flex flex-col justify-center items-end text-right">
                                       <span className="font-bold font-mono py-1" style={{ color: branding.primaryColor }}>{branding.contactPhone || '+48 500'}</span>
                                    </div>
                                 </div>
                              )}
                              {branding.footerStyle === 'minimal' && (
                                 <div className="w-full border-t border-zinc-900 bg-black/90 backdrop-blur h-10 flex items-center justify-center text-[9px] text-zinc-600 uppercase tracking-widest pointer-events-auto">
                                    © {new Date().getFullYear()} {branding.companyName || 'MDK'}. Wszelkie prawa zastrzeżone.
                                 </div>
                              )}
                              {branding.footerStyle === 'default' && (
                                 <div className="w-full border-t border-zinc-900 bg-[#0A0A0A]/90 backdrop-blur h-16 p-4 flex justify-between text-[9px] pointer-events-auto">
                                    <div className="text-zinc-500 flex flex-col gap-1"><span>{branding.contactEmail || 'Zaloguj e-mail'}</span><span style={{ color: branding.primaryColor }}>{branding.contactPhone || '+48 000 000'}</span></div>
                                    <div className="text-zinc-600 font-black uppercase text-[8px] text-right">© {branding.companyName || 'STARTUP'}<br/>BUILT WITH MDK</div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
'''

if grid_start in content:
    # 1. Replace the top grid start with the new split wrapper
    content = content.replace(grid_start, live_preview_code + '\n                  ' + grid_start)
    
    # 2. We need to find the specific button "Dalej" that closes Step 3.
    # It looks like:
    #                <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
    #                   <button onClick={() => setStep(4)}
    
    close_anchor = '               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">\n                  <button onClick={() => setStep(4)}'
    
    if close_anchor in content:
        content = content.replace(close_anchor, closing_preview_code + '\n' + close_anchor)
        print("Success patching Live Preview mockup logic.")
    else:
        print("Could not find the closing anchor for step 3.")
else:
    print("Warning: internal grid_start not found in file.")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Script execution done.")
