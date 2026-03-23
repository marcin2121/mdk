"use client"

import { useState } from "react"
import { Check, TerminalSquare, Loader2, Package, LayoutTemplate, ShieldAlert, Cloud, Store, Code2, ArrowLeft, Palette, Image as ImageIcon, Type, MapPin, Phone, Mail, Megaphone, Sparkles, MessageCircle, Calculator, HelpCircle, Layers, Eye, Github, Star } from "lucide-react"
import { runSetupAction } from "../../lib/actions/setup-wizard"
import { generateCopywriting } from "../../lib/actions/ai-generator"
import { generateLivePreview } from "../../lib/actions/preview-builder"
import { useEffect } from "react"

const PROJECT_TYPES = [
  { id: 'saas', name: 'SaaS Platforma', desc: 'Aplikacje B2B, modele subskrypcyjne (Stripe), analityka i monetyzacja API.', icon: Cloud },
  { id: 'client', name: 'Wizytówka (MŚP)', desc: 'Szybkie i potężnie konwertujące strony dla firm usługowych i lokalnych.', icon: Store },
  { id: 'portfolio', name: 'Agencja / Portfolio', desc: "Kreatywne i silnie animowane wizje wizytówkowe z wariantami Premium 3D.", icon: Code2 }
]

const TEMPLATES: Record<string, any[]> = {
  saas: [
    { id: 'saas-ai', name: 'AI SaaS Dashboard', desc: 'Ciemny panel. Tabele konwertujące dla analityki oraz logowanie CMS SSR.', packages: ['lucide-react', 'clsx'] }
  ],
  client: [
    { id: 'client-beauty', name: 'Klasyczna Oferta B2C', desc: 'Trzysekcyjny klasyk: O nas, Pełna sekcja adresowo-kontaktowa oraz Cennik.', packages: ['lucide-react'] }
  ],
  portfolio: [
    { id: 'portfolio-minimal', name: 'Minimal & Typo', desc: 'Zatopienie układu w bezwględnej ciemności napędzanej olbrzymią typografią i wireframami.', packages: ['lucide-react'] }
  ]
}

const OPTIONAL_PACKAGES = [
  { id: 'prettier', name: 'Prettier + Tailwind', desc: 'Automatyczne formatowanie kodu i sortowanie klas.', category: 'dev', packages: ['prettier', 'prettier-plugin-tailwindcss'], isDev: true, repo: 'https://prettier.io' },
  { id: 'docker', name: 'Docker (Dockerfile/Compose)', desc: 'Generuje konfiguracje do konteneryzacji.', category: 'dev', packages: [], isDev: false, repo: 'https://docker.com' },
  { id: 'husky', name: 'Husky Git Hooks', desc: 'Weryfikacja kodu przed commitem.', category: 'dev', packages: ['husky'], isDev: true, repo: 'https://typicode.github.io/husky' },
  
  { id: 'prisma', name: 'Prisma ORM', desc: 'Stabilny, dojrzały typowany ORM SQL.', category: 'db', packages: ['prisma', '@prisma/client'], isDev: false, repo: 'https://prisma.io' },
  { id: 'drizzle', name: 'Drizzle ORM', desc: 'Lekki i hiper-szybki SQL-builder.', category: 'db', packages: ['drizzle-orm', 'drizzle-kit'], isDev: false, repo: 'https://orm.drizzle.team' },
  
  { id: 'zustand', name: 'Zustand State', desc: 'Prostota stanu bez reduxa.', category: 'state', packages: ['zustand'], isDev: false, repo: 'https://zustand-demo.pmnd.rs' },
  { id: 'query', name: 'TanStack React Query', desc: 'Mądry cache asynchronicznych danych.', category: 'state', packages: ['@tanstack/react-query'], isDev: false, repo: 'https://tanstack.com/query' },
  { id: 'axios', name: 'Axios Client', desc: 'Rozszerzony klient fetch API.', category: 'state', packages: ['axios'], isDev: false, repo: 'https://axios-http.com' },

  { id: 'clerk', name: 'Clerk Auth', desc: 'Wydajna autoryzacja Cloud.', category: 'auth', packages: ['@clerk/nextjs'], isDev: false, repo: 'https://clerk.com' },
  { id: 'nextauth', name: 'NextAuth.js', desc: 'Lokalna, wolna tożsamość.', category: 'auth', packages: ['next-auth'], isDev: false, repo: 'https://next-auth.js.org' },

  { id: 'framer', name: 'Framer Motion', desc: 'Płynne animacje React.', category: 'ui', packages: ['framer-motion'], isDev: false, repo: 'https://framer.com/motion' },
  { id: 'gsap', name: 'GSAP Scroller', desc: 'Ciężkie, płynne animacje kinowe.', category: 'ui', packages: ['gsap'], isDev: false, repo: 'https://gsap.com' },
  { id: 'reacticons', name: 'React Icons', desc: 'Wszystkie ikony w jednym miejscu.', category: 'ui', packages: ['react-icons'], isDev: false, repo: 'https://react-icons.github.io/react-icons/' },

  { id: 'stripe', name: 'Stripe Payments', desc: 'Płatności online i subskrypcje.', category: 'api', packages: ['stripe', '@stripe/stripe-js'], isDev: false, repo: 'https://stripe.com' },
  { id: 'resend', name: 'Resend Email', desc: 'Automatyzacja wysyłki maili.', category: 'api', packages: ['resend', '@react-email/components'], isDev: false, repo: 'https://resend.com' },
  { id: 'uploadthing', name: 'Uploadthing', desc: 'Upload plików do chmury (S3).', category: 'api', packages: ['uploadthing'], isDev: false, repo: 'https://uploadthing.com' },
  { id: 'sentry', name: 'Sentry Error Log', desc: 'Monitor błędów w produkcji.', category: 'api', packages: ['@sentry/nextjs'], isDev: false, repo: 'https://sentry.io' },
  
  { id: 'redis', name: 'Upstash Redis KV', desc: 'Szybka baza do cache / rate-limits.', category: 'api', packages: ['@upstash/redis'], isDev: false, repo: 'https://upstash.com' },
  { id: 'datefns', name: 'Date-fns', desc: 'Łatwe zarządzanie datami React.', category: 'state', packages: ['date-fns'], isDev: false, repo: 'https://date-fns.org' },
  { id: 'pusher', name: 'Pusher Realtime', desc: 'Websockety do chatu / live eventów.', category: 'api', packages: ['pusher-js'], isDev: false, repo: 'https://pusher.com' },
  { id: 'markdown', name: 'Markdown Stack', desc: 'Wsparcie wpisów MD na bloga.', category: 'api', packages: ['react-markdown', 'rehype-raw', 'remark-gfm'], isDev: false, repo: 'https://github.com/remarkjs/react-markdown' },
  { id: 'sonner', name: 'Sonner Toasts', desc: 'Szybkie powiadomienia wyskakujące (Toaster).', category: 'ui', packages: ['sonner'], isDev: false, repo: 'https://sonner.emilkowal.ski' }
]

const PACKAGE_CATEGORIES = [
  { id: 'all', name: 'Wszystkie' },
  { id: 'dev', name: 'DevOps & Narzędzia' },
  { id: 'db', name: 'Bazy i ORM' },
  { id: 'state', name: 'Stan & Dane' },
  { id: 'auth', name: 'Autoryzacja' },
  { id: 'ui', name: 'UI & Animacje' },
  { id: 'api', name: 'API & SaaS' }
]

export default function SetupWizard() {
  const [step, setStep] = useState(1)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  // Ewolucja Formularza 70% Gotowości Zlecenia:
  const [branding, setBranding] = useState({
     companyName: '',
     heroTitle: '',
     heroDesc: '',
     primaryColor: '#f97316',
     heroImageUrl: '',
     ctaText: 'Rozpocznij',
     contactPhone: '+48 500 000 000',
     contactEmail: 'biuro@firma.pl',
     address: 'ul. Architektoniczna 1, Warszawa',
     useAI: false,
     aiProvider: 'openai',
     aiModel: 'gpt-4o-mini',
     aiKey: '',
     aiCustomEndpoint: '',
     seoKeywords: '',
     aiContext: '',
     injectTailwindVars: true,
     generateTopology: true,
     generateDatabase: false,
     supabaseUrl: '',
     supabaseAnonKey: '',
     supabaseServiceRole: '',
     typography: 'geist',
     analyticsId: '',
     navbarStyle: 'glass',
     footerStyle: 'default',
     modules: {
        chatbot: false,
        chatbotContext: '',
        calculator: false,
        testimonials: false
     },
     selectedPackages: [] as string[]
  })

  const [activePkgTab, setActivePkgTab] = useState('all')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [isInstalling, setIsInstalling] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [downloadingModule, setDownloadingModule] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [starCount, setStarCount] = useState<number | null>(null);

  const [livePreviewTimestamp, setLivePreviewTimestamp] = useState(Date.now());

  useEffect(() => {
     fetch('https://api.github.com/repos/marcin2121/mdk')
        .then(res => res.json())
        .then(data => {
            if (data.stargazers_count !== undefined) {
                setStarCount(data.stargazers_count);
            }
        })
        .catch(err => console.error('[MDK GitHub Stars]', err));
  }, []);

  useEffect(() => {
     if(step !== 4) return;
     const timer = setTimeout(async () => {
         const res = await generateLivePreview(selectedTemplate || 'saas-ai', branding);
         if(res?.timestamp) {
             // Nie zmieniamy klucza Iframe żeby Next.js Hot Reload zadziałał gładko przez stelaż!
             console.log('[MDK Live Preview] Nowy build hmr zrzucony do /live-preview');
         }
     }, 1000);
     return () => clearTimeout(timer);
  }, [branding, step, selectedTemplate]);

  
  
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

  const handleStartSetup = async () => {
    if (!selectedType || !selectedTemplate) return
    setIsInstalling(true)
    
    const templateData = TEMPLATES[selectedType].find(t => t.id === selectedTemplate)
    
    setLogs(prev => [...prev, `[INIT] Autoryzacja iniekcji kodu docelowego...`])
    setLogs(prev => [...prev, `[SYSTEM] Generowanie layoutu na bazie 6 zmiennych formularza.`])
    if (branding.useAI) setLogs(prev => [...prev, `[MDK AI] Wykryto żądanie SEO Copywritingu. Trwa uderzanie do endpointów V1 Google Gemini...`])
    
    // Wypchnięcie szerokiej bazy informacyjnej do Node.js -> Server Actions -> fs.writeFileSync()
    const response = await runSetupAction(templateData?.packages || [], {
       templateId: selectedTemplate,
       branding: branding
    })
    
    if (response.error) {
       setLogs(prev => [...prev, `[ERROR] FATAL: ${response.error}`])
       setIsInstalling(false)
       return
    }

    setLogs(prev => [...prev, `[SUCCESS] Plik wejściowy MDK pomyślnie zrzucony do /app/(public)/page.tsx.`])
    setLogs(prev => [...prev, `[SYSTEM] Zwalnianie blokady Middleware MDK. Trwa reload...`])
    
    setTimeout(() => {
       window.location.reload()
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#f97316] selection:text-black">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5">
        <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 my-12">
         
         <div className="mb-10 text-center w-full max-w-4xl mx-auto relative">
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 text-[#f97316]">MDK <span className="text-white text-3xl sm:text-4xl tracking-tight">(Molenda Development Kit)</span></h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
               <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest border border-zinc-800 bg-[#0A0A0A] py-2 px-4 inline-block">MDK System Initializer</p>
               <a href="https://github.com/marcin2121/mdk" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-zinc-800 bg-[#0A0A0A] hover:bg-zinc-900 transition-colors py-2 px-4 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_15px_rgba(234,179,8,0.15)] group">
                  <Star size={14} className="text-[#EAB308] group-hover:fill-[#EAB308] transition-all" /> Daj gwiazdkę
                  {starCount !== null && (
                     <span className="ml-1 px-1.5 py-0.5 bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                        {starCount}
                     </span>
                  )}
               </a>
            </div>
         </div>

         {/* -------------------- STEPS 1 & 2 (Uproszczone by utrzymać flow dla usera) -------------------- */}
         {step === 1 && (
            <div className="bg-[#0A0A0A] border-2 border-zinc-800 p-8 sm:p-10 max-w-4xl w-full shadow-2xl relative animate-in fade-in slide-in-from-bottom-8">
               <div className="mb-8 border-b border-zinc-900 pb-6"><h2 className="text-3xl font-black uppercase tracking-tight">Określ Wektor Biznesowy (Krok 1)</h2></div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                    <div key={type.id} onClick={() => { setSelectedType(type.id); setStep(2); }} className="p-6 border-2 border-zinc-800 hover:border-[#f97316] hover:bg-[#f97316]/5 bg-zinc-900/50 transition-all cursor-pointer flex flex-col items-center text-center">
                       <Icon size={40} className="mb-4 text-[#f97316]" />
                       <h3 className="font-bold text-lg uppercase tracking-tight mb-2 text-white">{type.name}</h3>
                       <p className="text-zinc-500 text-xs">{type.desc}</p>
                    </div>
                 )})}
               </div>
            </div>
         )}

         {step === 2 && selectedType && (
            <div className="bg-[#0A0A0A] border-2 border-zinc-800 p-8 sm:p-10 max-w-4xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 text-center">
               <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Wybierz Moduł UI (Krok 2)</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                 {TEMPLATES[selectedType].map((tmpl) => (
                    <div key={tmpl.id} onClick={() => { setSelectedTemplate(tmpl.id); setStep(3); }} className="p-6 border-2 border-zinc-800 hover:border-[#f97316] hover:bg-[#f97316]/5 bg-zinc-900/50 transition-all cursor-pointer group">
                       <h3 className="font-bold text-xl uppercase tracking-tight mb-2 text-[#f97316] group-hover:text-white">{tmpl.name}</h3>
                       <p className="text-zinc-400 text-sm">{tmpl.desc}</p>
                    </div>
                 ))}
               </div>
               <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest font-bold">Wróć</button>
            </div>
         )}
         
         {/* -------------------- Krok 3: SYSTEMY I ARCHITEKTURA -------------------- */}
         {step === 3 && (
            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-5xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500 relative z-10">
               <div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">
                  <button onClick={() => setStep(2)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400">
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
                     <label className={`flex items-center cursor-pointer group ${!branding.useAI ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateDatabase} disabled={!branding.useAI} onChange={(e) => setBranding({...branding, generateDatabase: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateDatabase ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateDatabase ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316]">Inżynieria Supabase (SQL Builder)</span>
                           <p className="text-zinc-500 text-xs mt-1">LLM dopisze gotowe migracje bazy relacyjnej SQL pod twoją branżę. {!branding.useAI && '(Wymaga AI)'}</p>
                        </div>
                     </label>

                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.injectTailwindVars} onChange={(e) => setBranding({...branding, injectTailwindVars: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.injectTailwindVars ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.injectTailwindVars ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">Globalne CSS (Tailwind Injector)</span>
                           <p className="text-zinc-500 text-xs mt-1">Zastąp inline styles globalnymi klasami Tailwind.</p>
                        </div>
                     </label>

                     <label className={`flex items-center cursor-pointer group ${!branding.useAI ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateTopology} disabled={!branding.useAI} onChange={(e) => setBranding({...branding, generateTopology: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateTopology ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateTopology ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">Generatywna Topologia Zagnieżdżeń</span>
                           <p className="text-zinc-500 text-xs mt-1">AI dopisze ci 2 potężne gotowe, fizyczne podstrony URL do projektu z route group! {!branding.useAI && '(Wymaga AI)'}</p>
                        </div>
                     </label>
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={handleGenerateAIAndProceed} disabled={isGeneratingAI} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)] flex items-center justify-center min-w-[300px]">
                     {isGeneratingAI ? <Loader2 size={24} className="animate-spin mr-3" /> : null}
                     {isGeneratingAI ? 'Analiza AI w toku...' : (branding.useAI ? '✨ Zezwól AI na Copywriting & Kontynuuj' : 'Dalej: Wizualny Kreator (4)')}
                  </button>
               </div>
            </div>
         )}


         

{/* -------------------- Krok 4: WIZUALNY KREATOR (FULLSCREEN) -------------------- */}
         {step === 4 && (
            <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95">
               {/* SIDEBAR: WIZUALNA PERSONALIZACJA */}
               <div className="w-full md:w-[450px] h-full bg-[#0A0A0A] border-r border-[#f97316]/50 flex flex-col z-20 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
                   <div className="p-6 border-b border-zinc-900 shrink-0">
                      <button onClick={() => setStep(3)} className="flex items-center gap-2 text-zinc-500 hover:text-white uppercase tracking-widest text-xs font-bold mb-4">
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
                             <div className="pt-6 border-t border-zinc-900 space-y-4">
                                <h3 className="text-[10px] font-black uppercase text-[#f97316] flex items-center justify-between">
                                    Sklep Modułów (Premium MDK) 
                                    {downloadingModule && <span className="text-white flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> {downloadingModule}</span>}
                                </h3>
                                 <div className="space-y-2">
                                 {[
                                     { id: 'chatbot', name: 'Chatbot AI B2B' },
                                     { id: 'calculator', name: 'Kalkulator B2B' },
                                     { id: 'testimonials', name: 'Karuzela Opinii' },
                                     { id: 'pricing', name: 'Plany Abonamentowe' },
                                     { id: 'faq', name: 'Zwijane Sekcje (FAQ)' }
                                 ].map((m) => {
                                      const isChecked = branding.modules[m.id as keyof typeof branding.modules];
                                      return (
                                        <label key={m.id} className={`flex flex-col cursor-pointer border p-3 ${isChecked ? 'border-[#f97316] bg-[#f97316]/10' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'} transition-all`}>
                                            <div className="flex items-center gap-3">
                                               <input type="checkbox" checked={isChecked as boolean} onChange={async (e) => {
                                                    const checked = e.target.checked;
                                                    setBranding({...branding, modules: {...branding.modules, [m.id]: checked}});
                                                    if(checked) {
                                                        const { installMdkModule } = await import('../../lib/actions/install-module');
                                                        setDownloadingModule(m.name);
                                                        const res = await installMdkModule(m.id);
                                                        setDownloadingModule(null);
                                                        if(res.error) console.error(res.error);
                                                    }
                                               }} className="accent-[#f97316] w-4 h-4 cursor-pointer" />
                                               <span className="font-bold text-xs uppercase tracking-widest text-white">{m.name}</span>
                                            </div>
                                            {m.id === 'chatbot' && isChecked && (
                                                <div className="mt-3 pt-3 border-t border-zinc-800/50">
                                                   <input type="text" placeholder="Wypełnij wiedzę asystentowi B2B..." value={branding.modules.chatbotContext} onChange={(e) => setBranding({...branding, modules: {...branding.modules, chatbotContext: e.target.value}})} className="w-full bg-black border border-zinc-700 px-3 py-2 text-white outline-none font-mono text-[10px]" />
                                                </div>
                                            )}
                                        </label>
                                      )
                                 })}
                                 </div>
                             </div>

                          </div>
                       </div>
                    </div>

                    <div className="p-6 border-t border-zinc-900 shrink-0">
                       <button onClick={() => setStep(5)} disabled={downloadingModule !== null} className={`w-full text-black font-black uppercase tracking-widest py-4 transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)] ${downloadingModule !== null ? 'bg-zinc-700 cursor-not-allowed text-zinc-500' : 'bg-[#f97316] hover:bg-white'}`}>
                          {downloadingModule ? 'Pobieranie...' : 'Dalej: Narzędzia (5)'}
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


         {/* -------------------- Krok 5: Narzędzia Deweloperskie (Showcase) -------------------- */}
         {step === 5 && (
            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-4xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="flex items-center gap-4 mb-8 border-b border-zinc-900 pb-6">
                  <button onClick={() => setStep(4)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316]">Narzędzia Deweloperskie</h2>
                    <p className="text-zinc-400 mt-1">Zaznacz dodatkowe pakiety, które zostaną zainstalowane i skonfigurowane na dysku.</p>
                  </div>
               </div>

               <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-900/50">
                  {PACKAGE_CATEGORIES.map(cat => (
                     <button key={cat.id} onClick={() => setActivePkgTab(cat.id)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border ${activePkgTab === cat.id ? 'border-[#f97316] text-[#f97316] bg-[#f97316]/5' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'}`}>
                        {cat.name}
                     </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {OPTIONAL_PACKAGES.filter(pkg => activePkgTab === 'all' || pkg.category === activePkgTab).map((pkg) => {
                     const isSelected = branding.selectedPackages.includes(pkg.id);
                     return (
                        <div key={pkg.id} onClick={() => {
                           const updated = isSelected 
                              ? branding.selectedPackages.filter(id => id !== pkg.id)
                              : [...branding.selectedPackages, pkg.id];
                           setBranding({...branding, selectedPackages: updated});
                        }} className={`p-4 border-2 cursor-pointer transition-all flex flex-col justify-between ${isSelected ? 'border-[#f97316] bg-[#f97316]/5' : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'}`}>
                           <div>
                              <div className="flex justify-between items-start mb-1">
                                 <h3 className="font-bold text-white tracking-tight text-sm flex items-center gap-2">
                                    {pkg.name}
                                    {pkg.isDev && <span className="text-[9px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">DEV</span>}
                                 </h3>
                                 <input type="checkbox" checked={isSelected} readOnly className="accent-[#f97316] h-4 w-4" />
                              </div>
                              <p className="text-zinc-500 text-xs line-clamp-2">{pkg.desc}</p>
                           </div>
                           <div className="mt-3 pt-3 border-t border-zinc-900 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-zinc-600 uppercase">{pkg.category}</span>
                              <a href={pkg.repo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] uppercase font-mono text-zinc-500 hover:text-[#f97316] flex items-center gap-1">
                                 <Package size={12} /> Repo
                              </a>
                           </div>
                        </div>
                     )
                  })}
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(6)} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     Dalej: .env.local (Krok 6)
                  </button>
               </div>
            </div>
         )}

         {/* -------------------- Krok 6: Tworzenie .env.local -------------------- */}
         {step === 6 && (
            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-4xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">
                  <button onClick={() => setStep(5)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#EAB308]">Środowisko API (.env.local)</h2>
                    <p className="text-zinc-400 mt-1">Ułatwienie dla deweloperów. Wklej tutaj klucze do Supabase, a instalator automatycznie wygeneruje chroniony plik .env.local na Twoim dysku ułatwiając całą pracę z plikami ukrytymi.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-zinc-400 uppercase">NEXT_PUBLIC_SUPABASE_URL (Opcjonalne dla szablonu, Wymagane dla CMS)</label>
                     <input type="text" value={branding.supabaseUrl} onChange={(e) => setBranding({...branding, supabaseUrl: e.target.value})} placeholder="https://twoj-projekt-url.supabase.co" className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#EAB308] outline-none font-mono text-sm" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-zinc-400 uppercase">NEXT_PUBLIC_SUPABASE_ANON_KEY (Wymagane)</label>
                     <input type="password" value={branding.supabaseAnonKey} onChange={(e) => setBranding({...branding, supabaseAnonKey: e.target.value})} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#EAB308] outline-none font-mono text-sm" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-zinc-400 uppercase">SUPABASE_SERVICE_ROLE_KEY (Opcjonalne zlecenia backendowe)</label>
                     <input type="password" value={branding.supabaseServiceRole} onChange={(e) => setBranding({...branding, supabaseServiceRole: e.target.value})} placeholder="eyJhbG... (Omija bezpieczeństwo RLS w Server Actions)" className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#EAB308] outline-none font-mono text-sm" />
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(7)} className="bg-[#EAB308] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     Wygeneruj Pełną Aplikację (Zakończ)
                  </button>
               </div>
            </div>
         )}


         {/* -------------------- Krok 7: Egzekucja Terminalowa -------------------- */}
         {step === 7 && (
            <div className="bg-[#0A0A0A] border-2 border-white p-8 sm:p-12 max-w-4xl w-full flex flex-col animate-in fade-in zoom-in duration-500">
               <h2 className="text-4xl font-black uppercase tracking-tight mb-8 text-center">Finałowa Kompilacja</h2>

               <div className="bg-black border border-zinc-800 rounded p-6 h-64 overflow-y-auto font-mono text-sm leading-loose mb-10 flex flex-col gap-2 relative">
                  {logs.length === 0 && <span className="text-zinc-500">Node.js oczekuje na komendę wstrzyknięcia...</span>}
                  
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                       <span className={log.includes('[ERROR]') ? 'text-red-500 font-bold' : log.includes('[SUCCESS]') || log.includes('[SYSTEM]') ? 'text-[#EAB308] font-bold' : 'text-zinc-400'}>{log}</span>
                    </div>
                  ))}
                  
                  {isInstalling && (
                     <div className="flex gap-4 mt-6 text-white items-center animate-pulse">
                        <Loader2 size={18} className="animate-spin" /> Mielenie surowego kodu źródłowego na dysku...
                     </div>
                  )}
               </div>

               {!logs.some(l => l.includes('ERROR')) ? (
                  <button 
                     onClick={handleStartSetup}
                     disabled={isInstalling || logs.some(l => l.includes('SUCCESS'))}
                     className="bg-white text-black font-black text-xl uppercase tracking-widest px-8 py-6 hover:bg-[#EAB308] transition-colors disabled:opacity-0 disabled:pointer-events-none"
                  >
                     URUCHOM SKRYPT GENERATORA
                  </button>
               ) : (
                  <button 
                     onClick={() => { setLogs([]); setStep(6); }}
                     className="bg-red-900/50 border border-red-500 text-red-100 font-black text-xl uppercase tracking-widest px-8 py-6 hover:bg-red-500 transition-colors"
                  >
                     WRÓĆ I POPRAW KONFIGURACJĘ API (KROK 6)
                  </button>
               )}
            </div>
         )}
      </div>
    

         {previewUrl && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
               <div className="bg-[#0A0A0A] border-2 border-[#f97316] w-full max-w-6xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in zoom-in-95">
                  <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/50">
                     <h3 className="font-bold uppercase tracking-wider text-sm text-[#f97316]">Przegląd Live Componentu</h3>
                     <button onClick={() => setPreviewUrl(null)} className="text-zinc-400 hover:text-white font-black text-xl px-3">&times;</button>
                  </div>
                  <div className="flex-1 w-full bg-white relative">
                     <iframe src={previewUrl} className="w-full h-full border-0" title="Live Preview" />
                  </div>
               </div>
            </div>
         )}

</div>
  )
}
