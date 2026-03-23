import os
import re

filepath = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# --- PART 1: Rename Step 5 to Step 6, and Step 4 to Step 5 ---
# Find exact step conditions and rename them.
# We do 5->6 first, then 4->5 to avoid conflicts.
content = content.replace("step === 6", "step === 7") # Just in case there's a 6
content = content.replace("step === 5", "step === 6")
content = content.replace("step === 4", "step === 5")

# Also update the buttons in old steps:
# old step 4 (now 5) had a back button to 3, and a next button to 5
# Wait, old step 4 button `setStep(3)` needs to become `setStep(4)`.
# And `setStep(5)` needs to become `setStep(6)`.
# Since we might globally replace `setStep(4)` and mess up history, let's be very careful.

# Let's extract the exact blocks instead of regex logic, because it's too risky.
# Instead, I'll rewrite the entire Step 3 block from scratch since I want a fullscreen UI !
# I'll locate `step === 3 && (` to `step === 5 && (` start.

# We need to construct Step 3 and Step 4.

step3_and_4 = r'''
         {/* -------------------- Krok 3: WIZUALNY KREATOR (FULLSCREEN) -------------------- */}
         {step === 3 && (
            <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95">
               {/* SIDEBAR: WIZUALNA PERSONALIZACJA */}
               <div className="w-full md:w-[450px] h-full bg-[#0A0A0A] border-r border-[#f97316]/50 flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                   <div className="p-6 border-b border-zinc-900 shrink-0">
                      <button onClick={() => setStep(2)} className="flex items-center gap-2 text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-bold mb-4">
                         <ArrowLeft size={14}/> Wróć
                      </button>
                      <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316] leading-none mb-2">Visual <br/>Builder</h2>
                      <p className="text-zinc-400 text-xs">Podejmuj decyzje wizualne na żywo. Pełen pogląd.</p>
                   </div>
                   
                   <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Type size={14} className="text-[#f97316]"/> Główne LOGO (Tekst)</label>
                            <input type="text" value={branding.companyName} onChange={(e) => setBranding({...branding, companyName: e.target.value})} placeholder="np. MDK Startup" className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Megaphone size={14} className="text-[#f97316]"/> Call-to-Action</label>
                            <input type="text" value={branding.ctaText} onChange={(e) => setBranding({...branding, ctaText: e.target.value})} placeholder="Rozpocznij" className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><ImageIcon size={14} className="text-[#f97316]"/> URL Obrazka (Hero)</label>
                            <input type="text" value={branding.heroImageUrl} onChange={(e) => setBranding({...branding, heroImageUrl: e.target.value})} placeholder="https://images.unsplash..." className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Palette size={14} className="text-[#f97316]"/> Kolor Przewodni (HEX)</label>
                            <div className="flex gap-4">
                               <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="w-12 h-12 bg-black border border-zinc-800 p-0.5 cursor-pointer shrink-0" />
                               <input type="text" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="flex-1 h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono uppercase" />
                            </div>
                         </div>

                         <div className="pt-6 border-t border-zinc-900 space-y-6">
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> Profil Typografii</label>
                               <select value={branding.typography} onChange={(e) => setBranding({...branding, typography: e.target.value})} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm cursor-pointer">
                                  <option value="geist">Geist Sans (Natywny)</option>
                                  <option value="inter">Inter (Klasyczny SaaS)</option>
                                  <option value="playfair">Playfair Display (Premium)</option>
                                  <option value="outfit">Outfit (Startup)</option>
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> Styl Navbara</label>
                               <select value={branding.navbarStyle} onChange={(e) => setBranding({...branding, navbarStyle: e.target.value})} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm cursor-pointer">
                                  <option value="glass">Szklisty (Kapsuła 3D)</option>
                                  <option value="minimal">Minimalistyczny (Rozciągnięty)</option>
                                  <option value="hidden">Ukryty (Brak)</option>
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> Styl Stopki</label>
                               <select value={branding.footerStyle} onChange={(e) => setBranding({...branding, footerStyle: e.target.value})} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm cursor-pointer">
                                  <option value="default">Standardowa (Listy B2B)</option>
                                  <option value="glass">Szklista Pływająca (Premium)</option>
                                  <option value="minimal">Mała (Tylko Copyright)</option>
                               </select>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 border-t border-zinc-900 shrink-0">
                      <button onClick={() => setStep(4)} className="w-full bg-[#f97316] text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                         Dalej: Architektura (4)
                      </button>
                   </div>
               </div>

               {/* MAIN AREA: FULLSCREEN PREVIEW */}
               <div className="flex-1 h-full relative bg-[#050505] flex flex-col p-4 lg:p-12 overflow-hidden shadow-inner">
                    <div className="w-full h-full rounded-xl border border-zinc-800 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)] relative flex flex-col bg-black ring-1 ring-white/5">
                        <div className="h-10 bg-[#0A0A0A] border-b border-zinc-800 flex items-center px-4 gap-3 shrink-0">
                           <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-zinc-800"></div><div className="w-3 h-3 rounded-full bg-zinc-800"></div><div className="w-3 h-3 rounded-full bg-zinc-800"></div></div>
                           <div className="mx-auto bg-black border border-zinc-800 rounded px-12 py-1 text-[10px] text-zinc-500 font-mono tracking-widest flex items-center gap-2">
                              <ShieldAlert size={10} className="text-zinc-600"/> <span className="text-white">mdk-live-render.localhost</span>
                           </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden bg-[#0A0A0A]">
                           <iframe src="/live-preview" className="absolute inset-0 w-full h-full border-0 bg-transparent z-10" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-black/50">
                               <Loader2 size={32} className="animate-spin text-zinc-500 mb-4" />
                               <span className="font-mono text-xs uppercase tracking-widest text-zinc-600">Trwa kompilacja HMR...</span>
                           </div>
                        </div>
                    </div>
               </div>
            </div>
         )}


         {/* -------------------- Krok 4: SYSTEMY I ARCHITEKTURA -------------------- */}
         {step === 4 && (
            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-5xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
               <div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">
                  <button onClick={() => setStep(3)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316]">Architektura Biznesowa & AI</h2>
                    <p className="text-zinc-400 mt-1">Skonfiguruj kontakt, zautomatyzowany copywriting sztucznej inteligencji oraz wbudowaną bazę danych w jednym kroku.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                   
                   <div className="space-y-6">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-[#f97316] border-b border-zinc-800 pb-3 mb-4">Metadane Kontaktowe</h3>
                       <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Phone size={14}/> Numer Telefonu</label>
                          <input type="text" value={branding.contactPhone} onChange={(e) => setBranding({...branding, contactPhone: e.target.value})} className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Mail size={14}/> Adres E-mail</label>
                          <input type="text" value={branding.contactEmail} onChange={(e) => setBranding({...branding, contactEmail: e.target.value})} className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><MapPin size={14}/> Pełny Adres Siedziby</label>
                          <textarea rows={2} value={branding.address} onChange={(e) => setBranding({...branding, address: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 p-4 text-white focus:border-[#f97316] outline-none font-mono text-sm resize-none" />
                       </div>
                       <div className="space-y-3 pt-6 border-t border-zinc-800">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">Tracking ID (GA4/Pixel)</label>
                          <input type="text" value={branding.analyticsId} onChange={(e) => setBranding({...branding, analyticsId: e.target.value})} placeholder="np. G-123456789" className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                       </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-zinc-900 border border-[#f97316]/50 p-6 shadow-inner">
                         <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                            <div>
                               <h3 className="text-sm font-black uppercase tracking-widest text-[#f97316] flex items-center gap-2"><Sparkles size={16}/> AI SEO Wtrysk</h3>
                               <p className="text-zinc-500 text-xs mt-1">Wygenereuj inteligentny copywriting do bazy źródłowej.</p>
                            </div>
                            <label className="flex items-center cursor-pointer">
                               <div className="relative">
                                 <input type="checkbox" className="sr-only" checked={branding.useAI} onChange={(e) => setBranding({...branding, useAI: e.target.checked})} />
                                 <div className={`block w-14 h-8 rounded-full transition-colors ${branding.useAI ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                                 <div className={`dot absolute left-1 top-1 bg-black w-6 h-6 rounded-full transition-transform ${branding.useAI ? 'transform translate-x-6' : ''}`}></div>
                               </div>
                            </label>
                         </div>
                         
                         {branding.useAI && (
                            <div className="space-y-4 animate-in fade-in zoom-in-95">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Klucz dostępu (AI API KEY)</label>
                                  <input type="password" value={branding.aiKey} onChange={(e) => setBranding({...branding, aiKey: e.target.value})} placeholder="sk-proj... / AIzaSy..." className="w-full h-10 bg-black border border-zinc-700 px-3 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Branża SEO (Słowa Kluczowe)</label>
                                  <input type="text" value={branding.seoKeywords} onChange={(e) => setBranding({...branding, seoKeywords: e.target.value})} placeholder="np. medycyna, dentysta wrocław" className="w-full h-10 bg-black border border-zinc-700 px-3 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">Dodatkowy Tone of Voice</label>
                                  <textarea rows={2} value={branding.aiContext} onChange={(e) => setBranding({...branding, aiContext: e.target.value})} placeholder="np. Komunikuj się agresywnie i z humorem." className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-[#f97316] outline-none font-mono text-xs resize-none" />
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
               </div>

               <div className="bg-[#0A0A0A] border border-zinc-800 p-6 shadow-inner mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#f97316] border-b border-zinc-800 pb-4 mb-6"><TerminalSquare size={16} className="inline mr-2"/> Inny Zespół Backendowy (MDK Architektura)</h3>
                  
                  <div className="space-y-6">
                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateDatabase} onChange={(e) => setBranding({...branding, generateDatabase: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateDatabase ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateDatabase ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316]">1. Inżynieria Supabase (SQL Builder)</span>
                           <p className="text-zinc-500 text-xs mt-1">LLM dopisze gotowe migracje bazy relacyjnej SQL pod twoją branżę.</p>
                        </div>
                     </label>

                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.injectTailwindVars} onChange={(e) => setBranding({...branding, injectTailwindVars: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.injectTailwindVars ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.injectTailwindVars ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">2. Globalne CSS (Tailwind Injector)</span>
                           <p className="text-zinc-500 text-xs mt-1">Zastąp inline styles globalnymi klasami Tailwind.</p>
                        </div>
                     </label>

                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateTopology} onChange={(e) => setBranding({...branding, generateTopology: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateTopology ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateTopology ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">3. Generatywna Topologia Zagnieżdżeń</span>
                           <p className="text-zinc-500 text-xs mt-1">AI dopisze ci 2 potężne gotowe, fizyczne podstrony URL do projektu z route group!</p>
                        </div>
                     </label>
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(5)} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     Dalej: Sklep Modułów (Krok 5)
                  </button>
               </div>
            </div>
         )}
'''

# Find bounds of old step 3 and replace
import re

start_flag = r'{/\* -------------------- Krok 3: TWARDA PERSONALIZACJA \(PRAWIE GOTOVA STRONA\) -------------------- \*/}'
end_flag = r'{/\* -------------------- Krok 4: Sklep Modułów \(Premium Components\) -------------------- \*/}'

pattern = re.compile(start_flag + r'.*?' + end_flag, re.DOTALL)
match = pattern.search(content)

if match:
    content = content[:match.start()] + step3_and_4 + "\n\n         " + end_flag + content[match.end():]
    
    # We must also change onClick={() => setStep(3)} inside step 5 back button to setStep(4)
    # The old step 4 -> now step 5 is just below end_flag.
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Steps injected and reorganized.")
else:
    print("Error: Could not locate bounds for step 3.")

