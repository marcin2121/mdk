import re

filepath = r"c:\molendavdevelopment\mdk\components\wizard\setup-wizard.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# ZADANIE 1: Zmiana Numeracji
# Krok 3 -> "WIZUALNY KREATOR" znajduje się między `step === 3` a `step === 4`
# Przeszukaj bloki od "Krok 3:" do "Krok 4: SYSTEMY", a potem "Krok 4:" do "Krok 5:"
start_step3 = content.find('{/* -------------------- Krok 3: WIZUALNY KREATOR')
start_step4 = content.find('{/* -------------------- Krok 4: SYSTEMY I ARCHITEKTURA')
start_step5 = content.find('{/* -------------------- Krok 4: Sklep Modułów') # wait, I renamed it before but the comment might still say Krok 4! Let's check: Yes, the comment is "{/* -------------------- Krok 4: Sklep Modułów (Premium Components) -------------------- */}"
if start_step5 == -1:
    start_step5 = content.find('{/* -------------------- Krok 5: Sklep')

# Wydobądźmy te dwa stringi block3 i block4
block3 = content[start_step3:start_step4]
block4 = content[start_step4:start_step5]

# Swap their definitions
# Block3 is currently visual builder (step === 3). Let's make it step === 4.
block3 = block3.replace("step === 3", "step === 4")
block3 = block3.replace("setStep(2)", "setStep(3)")
block3 = block3.replace("setStep(4)", "setStep(5)")
block3 = block3.replace("Dalej: Architektura (4)", "Dalej: Moduły (5)")
block3 = block3.replace("Krok 3:", "Krok 4:")

# Block4 is business data (step === 4). Let's make it step === 3.
block4 = block4.replace("step === 4", "step === 3")
block4 = block4.replace("setStep(3)", "setStep(2)")
block4 = block4.replace("setStep(5)", "setStep(4)")
block4 = block4.replace("Dalej: Sklep Modułów (Krok 5)", "Wygeneruj AI & Idź do Kreatora (4)")
block4 = block4.replace("Krok 4: SYSTEMY", "Krok 3: SYSTEMY")

# W Block4 dodajmy przycisk uruchamiajacy AI Generator
ai_import = 'import { generateCopywriting } from "../../lib/actions/ai-generator"'
if ai_import not in content:
    content = content.replace('import { generateLivePreview', ai_import + '\nimport { generateLivePreview')

# Wstrzyknij stan ładowania do setup-wizard.tsx
if "const [isGeneratingAI, setIsGeneratingAI] = useState(false)" not in content:
    content = content.replace("const [isInstalling, setIsInstalling] = useState(false)", "const [isInstalling, setIsInstalling] = useState(false)\n  const [isGeneratingAI, setIsGeneratingAI] = useState(false)")

ai_func_logic = """
  const handleGenerateAIAndProceed = async () => {
      if(!branding.useAI) {
         setStep(4);
         return;
      }
      setIsGeneratingAI(true);
      setLogs(prev => [...prev, `[MDK AI] Wytwarzanie copywritingu dla podglądu lądowania...`]);
      const res = await generateCopywriting(branding);
      setIsGeneratingAI(false);
      if(res.error) {
         setLogs(prev => [...prev, `[MDK AI BŁĄD] ${res.error}`]);
         // Proceed anyway without strings
         setStep(4);
      } else {
         setBranding({...branding, heroTitle: res.heroTitle, heroDesc: res.heroDesc, ctaText: res.ctaText || branding.ctaText});
         setStep(4);
      }
  }
"""
if "handleGenerateAIAndProceed" not in content:
    content = content.replace("const handleStartSetup =", ai_func_logic + "\n  const handleStartSetup =")

# W Block4 podmień przycisk Dalej na wywołanie funkcji
block4 = block4.replace("onClick={() => setStep(4)}", "onClick={handleGenerateAIAndProceed}")

# W Block3 (teraz Visual Editor) dodaj Inputs to tekstu, żeby można było je modyfikować!
custom_text_inputs = r'''
                         <div className="pt-6 border-t border-zinc-900 space-y-6">
                            <h3 className="text-[10px] font-black uppercase text-[#f97316]">Edytor Treści & Odnośników</h3>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase">Główny Nagłówek (Hero Title)</label>
                               <textarea rows={2} value={branding.heroTitle || ''} onChange={(e) => setBranding({...branding, heroTitle: e.target.value})} placeholder="np. Zbuduj swój <br/> wspaniały startup <span style='color: var(--mdk-primary)'>z MDK.</span>" className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-[#f97316] outline-none font-mono text-xs resize-none" />
                               <p className="text-[9px] text-zinc-600">Tip: Użyj &lt;br/&gt; i &lt;span style=...&gt;</p>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase">Opis Poboczny (Hero Desc)</label>
                               <textarea rows={2} value={branding.heroDesc || ''} onChange={(e) => setBranding({...branding, heroDesc: e.target.value})} placeholder="np. Platforma do kreowania oprogramowania..." className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-[#f97316] outline-none font-mono text-xs resize-none" />
                            </div>
                         </div>
'''
block3 = block3.replace('<div className="pt-6 border-t border-zinc-900 space-y-6">', custom_text_inputs + '\n                         <div className="pt-6 border-t border-zinc-900 space-y-6">')

# Also fix the Step 2 "Next" button. It currently does `onClick={() => { setSelectedTemplate(tmpl.id); setStep(3); }}`
# It should stay `setStep(3)`! Because Step 3 is now AI/Biznes.

# Also fix the Step 5 Back button. Step 5 is Sklep Modulow. It currently does `setStep(4)`. This is CORRECT because 4 is now the Visual Builder!

# Update the main content
new_content = content[:start_step3] + block4 + "\n\n" + block3 + content[start_step5:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Kroki zamienione, dodane AI i zmienione nazewnictwo.")
