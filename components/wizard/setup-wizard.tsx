"use client"

import { useState } from "react"
import { Check, TerminalSquare, Loader2, Package, LayoutTemplate, ShieldAlert, Cloud, Store, Code2, ArrowLeft, Palette, Image as ImageIcon, Type, MapPin, Phone, Mail, Megaphone, Sparkles, MessageCircle, Calculator } from "lucide-react"
import { runSetupAction } from "../../lib/actions/setup-wizard"

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
     modules: {
        chatbot: false,
        chatbotContext: '',
        calculator: false,
        testimonials: false
     },
     selectedPackages: [] as string[]
  })

  const [activePkgTab, setActivePkgTab] = useState('all')

  const [isInstalling, setIsInstalling] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  
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
            <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest border border-zinc-800 bg-[#0A0A0A] py-2 px-4 inline-block">MDK System Initializer</p>
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


         {/* -------------------- Krok 3: TWARDA PERSONALIZACJA (PRAWIE GOTOVA STRONA) -------------------- */}
         {step === 3 && (
            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-5xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">
                  <button onClick={() => setStep(2)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316]">Dynamiczny Wtrysk Treści (70% Pracy Wstępnej)</h2>
                    <p className="text-zinc-400 mt-1">Uzupełnij jak najwięcej pól. Generator przepisze kod z gotowymi zmiennymi dla sekcji Hero, O Nas i Kontaktu.</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                  
                  {/* KOLUMNA 1: Wygląd Główny */}
                  <div className="space-y-6 lg:col-span-2 bg-zinc-900/40 border border-zinc-800 p-6">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 pb-3 mb-4">Core Branding</h3>
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Type size={14} className="text-[#f97316]"/> Pełna Nazwa Biznesu</label>
                        <input type="text" value={branding.companyName} onChange={(e) => setBranding({...branding, companyName: e.target.value})} placeholder="np. Złoty Widelec sp. z o.o." className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Megaphone size={14} className="text-[#f97316]"/> Call-to-Action (Tekst na guzikach)</label>
                        <input type="text" value={branding.ctaText} onChange={(e) => setBranding({...branding, ctaText: e.target.value})} placeholder="Umów wizytę natychmiastowo" className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><ImageIcon size={14} className="text-[#f97316]"/> URL głównego zdjęcia (Unsplash Hero)</label>
                        <input type="text" value={branding.heroImageUrl} onChange={(e) => setBranding({...branding, heroImageUrl: e.target.value})} placeholder="https://images.unsplash.com/photo-..." className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Palette size={14} className="text-[#f97316]"/> Precyzyjny Kolor Marki (HEX)</label>
                        <div className="flex gap-4">
                           <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="w-12 h-12 bg-zinc-900 border border-zinc-700 p-0.5 cursor-pointer shrink-0" />
                           <input type="text" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="flex-1 h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono uppercase" />
                        </div>
                     </div>
                  </div>

                  {/* KOLUMNA 2: Kontakt & Systemy */}
                  <div className="space-y-6 lg:col-span-1 bg-zinc-900/40 border border-zinc-800 p-6">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-[#f97316] border-b border-zinc-800 pb-3 mb-4">Kontakt & Architektura</h3>
                     
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> Profil Typografii</label>
                        <select value={branding.typography} onChange={(e) => setBranding({...branding, typography: e.target.value})} className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm shadow-inner appearance-none cursor-pointer">
                           <option value="geist">Geist Sans (Natywny MDK)</option>
                           <option value="inter">Inter (Klasyczny SaaS)</option>
                           <option value="playfair">Playfair Display (Premium / Fashion)</option>
                           <option value="outfit">Outfit (Startupowy Vibe)</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">Tracking ID (GA4/Pixel)</label>
                        <input type="text" value={branding.analyticsId} onChange={(e) => setBranding({...branding, analyticsId: e.target.value})} placeholder="np. G-123456789" className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                     </div>
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
                        <textarea rows={3} value={branding.address} onChange={(e) => setBranding({...branding, address: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 p-4 text-white focus:border-[#f97316] outline-none font-mono text-sm resize-none" />
                     </div>
                  </div>
               </div>

               {/* KOLUMNA 3: AI SEO Generation (MDK Golden Feature) */}
               <div className="lg:col-span-3 bg-zinc-900 border border-[#f97316]/50 p-6 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                     <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-[#f97316] flex items-center gap-2"><Sparkles size={16}/> MDK AI-Driven Copywriting</h3>
                        <p className="text-zinc-500 text-xs mt-1">Użyj sztucznej inteligencji (Gemini, OpenAI, Claude), aby wygenerować profesjonalne, optymalizowane teksty dla witryny.</p>
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
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in zoom-in-95">
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-zinc-400 uppercase">Dostawca API Interfejsu</label>
                           <select value={branding.aiProvider} onChange={(e) => setBranding({...branding, aiProvider: e.target.value})} className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm shadow-inner appearance-none cursor-pointer">
                              <option value="openai">OpenAI (Natywne REST API)</option>
                              <option value="gemini">Google Gemini (Natywne REST API)</option>
                              <option value="claude">Anthropic Claude (Natywne REST API)</option>
                              <option value="custom">Niestandardowy Endpoint (OpenRouter, Groq, Ollama)</option>
                           </select>
                        </div>
                        
                        {branding.aiProvider === 'custom' && (
                           <div className="space-y-3">
                              <label className="text-xs font-bold text-zinc-400 uppercase text-[#f97316]">Własny Adres URL Endpointu</label>
                              <input type="text" value={branding.aiCustomEndpoint} onChange={(e) => setBranding({...branding, aiCustomEndpoint: e.target.value})} placeholder="https://openrouter.ai/api/v1/chat/completions" className="w-full h-12 bg-black border border-[#f97316] px-4 text-white focus:outline-none font-mono text-sm shadow-inner" />
                           </div>
                        )}
                        
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-zinc-400 uppercase">Precyzyjna Nazwa Modelu</label>
                           <input type="text" value={branding.aiModel} onChange={(e) => setBranding({...branding, aiModel: e.target.value})} placeholder="np. gpt-4o, claude-3-5-sonnet-20241022, llama3-70b..." className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm shadow-inner" />
                        </div>
                        
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-zinc-400 uppercase">Klucz dostępu (API KEY)</label>
                           <input type="password" value={branding.aiKey} onChange={(e) => setBranding({...branding, aiKey: e.target.value})} placeholder="sk-proj... / AIzaSy..." className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm shadow-inner" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-xs font-bold text-zinc-400 uppercase">Branża SEO (Wymagane)</label>
                           <input type="text" value={branding.seoKeywords} onChange={(e) => setBranding({...branding, seoKeywords: e.target.value})} placeholder="np. klinika wrocław, medycyna estetyczna, wolne terminy" className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm shadow-inner" />
                        </div>
                        <div className="space-y-3 md:col-span-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase">Dodatkowy Kontekst Brandingu (Tone of Voice)</label>
                           <textarea rows={2} value={branding.aiContext} onChange={(e) => setBranding({...branding, aiContext: e.target.value})} placeholder="np. Komunikuj się luksusowo i bezpośrednio, używaj branżowego slangu IT." className="w-full bg-black border border-zinc-700 p-4 text-white focus:border-[#f97316] outline-none font-mono text-sm resize-none shadow-inner" />
                        </div>
                     </div>
                  )}
               </div>

               <div className="lg:col-span-3 bg-[#0A0A0A] border border-zinc-800 p-6 shadow-inner mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#f97316] border-b border-zinc-800 pb-4 mb-6"><TerminalSquare size={16} className="inline mr-2"/> Cechy Architektury Infrastruktury & Bazy Danych</h3>
                  
                  <div className="space-y-6">
                     {/* Feature 3 */}
                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.injectTailwindVars} onChange={(e) => setBranding({...branding, injectTailwindVars: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.injectTailwindVars ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.injectTailwindVars ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">3. Globalne CSS (Tailwind Injector)</span>
                           <p className="text-zinc-500 text-xs mt-1">Zamień inline styling w reaktorze na globalnie wstrzyknięte zmienne środowiskowe zadeklarowane we wszystkich ścieżkach za pomocą edycji plików root (globals.css/layout.tsx).</p>
                        </div>
                     </label>

                     {/* Feature 4 */}
                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateTopology} onChange={(e) => setBranding({...branding, generateTopology: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateTopology ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateTopology ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">4. Generatywna Topologia (Multi-Page Routing)</span>
                           <p className="text-zinc-500 text-xs mt-1">AI zidentyfikuje branżę i wygeneruje do pełnego działania obok strony głównej dwie krytyczne podstrony (np. /cennik, /uslugi) budując foldery łącząc je w w pełni funkcjonalny ekosystem Next.js.</p>
                        </div>
                     </label>

                     {/* Feature 2 Opcja */}
                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateDatabase} onChange={(e) => setBranding({...branding, generateDatabase: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateDatabase ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateDatabase ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316]">2 (Opcja). Inżynieria Supabase (SQL Builder)</span>
                           <p className="text-zinc-500 text-xs mt-1">Model LLM dopisze fizycznie na dysk dedykowany plik migracyjny SQL z zaawansowanym relacyjnym systemem bazy danych dopasowanym precyzyjnie pod wybraną przez Ciebie branżę.</p>
                        </div>
                     </label>
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(4)} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     Dalej: Moduły Premium (Krok 4)
                  </button>
               </div>
            </div>
         )}


         {/* -------------------- Krok 4: Sklep Modułów (Premium Components) -------------------- */}
         {step === 4 && (
            <div className="bg-[#0A0A0A] border-2 border-[#f97316] p-8 sm:p-10 max-w-4xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="flex items-center gap-4 mb-10 border-b border-zinc-900 pb-6">
                  <button onClick={() => setStep(3)} className="w-12 h-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400">
                     <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316]">Wybór Modułów Komponentowych</h2>
                    <p className="text-zinc-400 mt-1">Wybierz zaawansowane bloki aplikacyjne, by natychmiast wrzucić na wygenerowaną stronę fizyczny, zwalidowany kod TSX.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  {/* Chatbot */}
                  <div className={`border-2 p-6 transition-all ${branding.modules.chatbot ? 'border-[#f97316] bg-[#f97316]/5' : 'border-zinc-800 bg-zinc-900/40'}`}>
                     <label className="flex items-start cursor-pointer w-full">
                        <div className="mt-1 mr-4">
                           <input type="checkbox" checked={branding.modules.chatbot} onChange={(e) => setBranding({...branding, modules: {...branding.modules, chatbot: e.target.checked}})} className="w-5 h-5 accent-[#f97316] cursor-pointer" />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg uppercase tracking-widest text-white mb-1"><MessageCircle size={18} className="inline mr-2 text-[#f97316]"/> AI LLM Assistant (Chatbot B2B)</h3>
                           <p className="text-zinc-500 text-sm mb-4">Interaktywny dymek w prawym dolnym rogu. Twoi klienci będą obsługiwani na żywo. </p>
                           {branding.modules.chatbot && (
                              <div className="animate-in fade-in slide-in-from-top-2 pt-4 border-t border-zinc-800/50 mt-4">
                                 <label className="text-xs font-bold text-zinc-400 uppercase">Instrukcja systemowa Bota (Prompt Systemowy B2B)</label>
                                 <textarea rows={2} value={branding.modules.chatbotContext} onChange={(e) => setBranding({...branding, modules: {...branding.modules, chatbotContext: e.target.value}})} placeholder="Jesteś asystentem sprzedaży. Pomagasz w wycenie usług i zbierasz leady. Przekonuj inteligentnie." className="w-full bg-black border border-zinc-700 p-4 text-white focus:border-[#f97316] outline-none font-mono text-sm resize-none shadow-inner mt-2" />
                              </div>
                           )}
                        </div>
                     </label>
                  </div>

                  {/* Calculator */}
                  <div className={`border-2 p-6 transition-all ${branding.modules.calculator ? 'border-[#f97316] bg-[#f97316]/5' : 'border-zinc-800 bg-zinc-900/40'}`}>
                     <label className="flex items-start cursor-pointer w-full">
                        <div className="mt-1 mr-4">
                           <input type="checkbox" checked={branding.modules.calculator} onChange={(e) => setBranding({...branding, modules: {...branding.modules, calculator: e.target.checked}})} className="w-5 h-5 accent-[#f97316] cursor-pointer" />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg uppercase tracking-widest text-white mb-1"><Calculator size={18} className="inline mr-2 text-[#f97316]"/> Estymator Kosztorysów z Suwakiem</h3>
                           <p className="text-zinc-500 text-sm">Rozbudowany interfejs ze sliderami i opcjami (radio), pozwalający użytkownikom estymować koszty B2B/B2C na żywo z wynikiem widocznym na ekranie.</p>
                        </div>
                     </label>
                  </div>

                  {/* Testimonials */}
                  <div className={`border-2 p-6 transition-all ${branding.modules.testimonials ? 'border-[#f97316] bg-[#f97316]/5' : 'border-zinc-800 bg-zinc-900/40'}`}>
                     <label className="flex items-start cursor-pointer w-full">
                        <div className="mt-1 mr-4">
                           <input type="checkbox" checked={branding.modules.testimonials} onChange={(e) => setBranding({...branding, modules: {...branding.modules, testimonials: e.target.checked}})} className="w-5 h-5 accent-[#f97316] cursor-pointer" />
                        </div>
                        <div className="flex-1">
                           <h3 className="font-bold text-lg uppercase tracking-widest text-white mb-1"><MessageCircle size={18} className="inline mr-2 text-[#f97316]"/> Dynamiczny Suwak Referencji (Testimonials)</h3>
                           <p className="text-zinc-500 text-sm">Gotowa sekcja społecznego dowodu słuszności (Social Proof) pobrana z mdk-registry wykorzystująca karuzelę Embla i szkliste karty.</p>
                        </div>
                     </label>
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(5)} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     Dalej: Narzędzia Deweloperskie (Krok 5)
                  </button>
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
    </div>
  )
}
