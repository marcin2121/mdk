import os

filepath = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Dodanie importu Eye
if 'Layers } from "lucide-react"' in content:
    content = content.replace('Layers } from "lucide-react"', 'Layers, Eye } from "lucide-react"')
elif 'Layers, Eye }' not in content:
    print("Warning: Eye import target may vary.")

# 2. Dodanie stanu
state_anchor = "const [activePkgTab, setActivePkgTab] = useState('all')"
if state_anchor in content:
    content = content.replace(state_anchor, state_anchor + "\n  const [previewUrl, setPreviewUrl] = useState<string | null>(null)")
else:
    print("Warning: State anchor not found")

# 3. Podmiana bloku modeli
modules_start = '<div className="space-y-6">\n                  {/* Chatbot */}'
modules_end = '{/* Accordion FAQ */}'

# Using larger anchors that are exact to visual file
cards_container_start = '<div className="space-y-6">'
cards_container_end = '<div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">'

split_1 = content.split(cards_container_start)
if len(split_1) < 4:  # There are multiple <div className="space-y-6"> on page
    print(f"Ambiguous start split: {len(split_1)}")
    # Target via better uniqueness, line 387 is the ONE under step === 4
    # Let's find step === 4 block
    pass

# Direct REPLACE from string matching for safety below the header:
header_sub = '<p className="text-zinc-400 mt-1">Wybierz zaawansowane bloki aplikacyjne, by natychmiast wrzucić na wygenerowaną stronę fizyczny, zwalidowany kod TSX.</p>\n                  </div>\n               </div>\n\n               <div className="space-y-6">'

# Let's write the fully looped block to insert:
new_loop_code = r'''<p className="text-zinc-400 mt-1">Wybierz zaawansowane bloki aplikacyjne, by natychmiast wrzucić na wygenerowaną stronę fizyczny, zwalidowany kod TSX.</p>
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                     { id: 'chatbot', name: 'AI LLM Assistant (Chatbot B2B)', desc: 'Interaktywny dymek w prawym dolnym rogu. Twoi klienci będą obsługiwani na żywo.', icon: MessageCircle, preview: 'https://mdk-previews.vercel.app/chatbot' },
                     { id: 'calculator', name: 'Estymator Kosztorysów z Suwakiem', desc: 'Rozbudowany interfejs ze sliderami i opcjami (radio), pozwalający użytkownikom estymować koszty B2B/B2C na żywo.', icon: Calculator, preview: 'https://mdk-previews.vercel.app/calculator' },
                     { id: 'testimonials', name: 'Dynamiczny Suwak Referencji (Testimonials)', desc: 'Gotowa sekcja społecznego dowodu słuszności (Social Proof) pobrana z mdk-registry.', icon: MessageCircle, preview: 'https://mdk-previews.vercel.app/testimonials' },
                     { id: 'pricing', name: 'Plany Abonamentowe (Pricing Cards)', desc: 'Nowoczesne, szkliste karty subskrypcyjne SaaS z listą zalet i dynamicznym podświetleniem.', icon: Layers, preview: 'https://mdk-previews.vercel.app/pricing' },
                     { id: 'faq', name: 'Sekcja Pytań i Odpowiedzi (FAQ)', desc: 'Rozwijana, dynamiczna lista najczęstszych pytań B2B/SaaS zapewniająca lepsze pozycjonowanie SEO.', icon: HelpCircle, preview: 'https://mdk-previews.vercel.app/faq' }
                  ].map((m) => {
                     const isChecked = branding.modules[m.id as keyof typeof branding.modules];
                     const Icon = m.icon;
                     return (
                        <div key={m.id} className={`border-2 p-6 transition-all ${isChecked ? 'border-[#f97316] bg-[#f97316]/5' : 'border-zinc-800 bg-zinc-900/40'}`}>
                           <div className="flex items-start justify-between w-full">
                              <label className="flex items-start cursor-pointer flex-1">
                                 <div className="mt-1 mr-4">
                                    <input type="checkbox" checked={isChecked as boolean} onChange={(e) => setBranding({...branding, modules: {...branding.modules, [m.id]: e.target.checked}})} className="w-5 h-5 accent-[#f97316] cursor-pointer" />
                                 </div>
                                 <div className="flex-1">
                                    <h3 className="font-bold text-lg uppercase tracking-widest text-white mb-1"><Icon size={18} className="inline mr-2 text-[#f97316]"/> {m.name}</h3>
                                    <p className="text-zinc-500 text-sm">{m.desc}</p>
                                 </div>
                              </label>

                              {m.preview && (
                                 <button onClick={() => setPreviewUrl(m.preview)} className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 p-3 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all hover:text-[#f97316]">
                                    <Eye size={16} /> <span className="hidden sm:inline">Podgląd</span>
                                 </button>
                              )}
                           </div>

                           {m.id === 'chatbot' && isChecked && (
                              <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-zinc-800/50 mt-4">
                                 <label className="text-xs font-bold text-zinc-400 uppercase">Instrukcja systemowa Bota (Prompt Systemowy B2B)</label>
                                 <textarea rows={2} value={branding.modules.chatbotContext} onChange={(e) => setBranding({...branding, modules: {...branding.modules, chatbotContext: e.target.value}})} className="w-full bg-black border border-zinc-700 p-4 text-white focus:border-[#f97316] outline-none font-mono text-sm resize-none shadow-inner mt-2" />
                              </div>
                           )}
                        </div>
                     )
                  })}
               </div>'''

# Target replacing complete loop
if header_sub in content:
    # Need to isolate slice. 
    pass

# Alternative using full splits:
split_1 = content.split('Dalej: Narzędzia Deweloperskie (Krok 5)')
if len(split_1) > 1:
    # Everything before step 5 button is step 4 cards block:
    head_part = split_1[0].split('<div className="space-y-6">')
    # Use last index of space-y-6 inside head_part (there are exactly 1 preceding in header framing)
    # The list is inside the last slice
    target_to_replace = '<div className="space-y-6">' + head_part[-1]
    
    content = content.replace(target_to_replace, new_loop_code + "\n\n               ")
    print("Loops applied via Step 5 button cut.")

# 4. Dodanie Modala na sam dół przed finalnym </div>
final_div_anchor = ")\n}\n" # Close of SetupWizard
iframe_modal = r'''
         {previewUrl && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-[#0A0A0A] border-2 border-[#f97316] w-full max-w-6xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in zoom-in-95">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/50">
                     <h3 className="font-bold uppercase tracking-wider text-sm text-[#f97316]">Przegląd Live Componentu</h3>
                     <button onClick={() => setPreviewUrl(null)} className="text-zinc-400 hover:text-white font-black text-xl px-3">&times;</button>
                  </div>
                  <div className="flex-1 w-full h-full bg-white relative">
                     <iframe src={previewUrl} className="w-full h-full border-0" title="Live Preview" />
                  </div>
               </div>
            </div>
         )}
'''

if ")\n}" in content:
    # Append inside the LAST </div> return wrapper
    # Let's replace the last </div> before final wrap
    content = content.replace('\n      </div>\n   )\n}', iframe_modal + '\n      </div>\n   )\n}')
    print("Modal injected")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Success final")
