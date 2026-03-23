"use client"

import { useState } from "react"
import { Check, TerminalSquare, Loader2, Package, LayoutTemplate, ShieldAlert, Cloud, Store, Code2, ArrowLeft, Palette, Image as ImageIcon, Type, MapPin, Phone, Mail, Megaphone, Sparkles, MessageCircle, Calculator, HelpCircle, Layers, Eye, Github, Star } from "lucide-react"
import { TRANSLATIONS } from "../../lib/translations"
import { runSetupAction } from "../../lib/actions/setup-wizard"
import { generateCopywriting } from "../../lib/actions/ai-generator"
import { generateLivePreview } from "../../lib/actions/preview-builder"
import { useEffect } from "react"

const PROJECT_TYPES = [
  { id: 'saas', name: 'saas_name', desc: 'saas_desc', icon: Cloud },
  { id: 'client', name: 'client_name', desc: 'client_desc', icon: Store },
  { id: 'portfolio', name: 'portfolio_name', desc: "portfolio_desc", icon: Code2 }
]

const TEMPLATES: Record<string, any[]> = {
  saas: [
    { id: 'saas-ai', name: 'tmpl_saas_ai_name', desc: 'tmpl_saas_ai_desc', packages: ['lucide-react', 'clsx'] }
  ],
  client: [
    { id: 'client-beauty', name: 'tmpl_client_beauty_name', desc: 'tmpl_client_beauty_desc', packages: ['lucide-react'] }
  ],
  portfolio: [
    { id: 'portfolio-minimal', name: 'tmpl_portfolio_minimal_name', desc: 'tmpl_portfolio_minimal_desc', packages: ['lucide-react'] }
  ]
}

const OPTIONAL_PACKAGES = [
  { id: 'prettier', name: 'Prettier + Tailwind', desc: 'prettier_desc', category: 'dev', packages: ['prettier', 'prettier-plugin-tailwindcss'], isDev: true, repo: 'https://prettier.io' },
  { id: 'docker', name: 'Docker (Dockerfile/Compose)', desc: 'docker_desc', category: 'dev', packages: [], isDev: false, repo: 'https://docker.com' },
  { id: 'husky', name: 'Husky Git Hooks', desc: 'husky_desc', category: 'dev', packages: ['husky'], isDev: true, repo: 'https://typicode.github.io/husky' },
  
  { id: 'prisma', name: 'Prisma ORM', desc: 'prisma_desc', category: 'db', packages: ['prisma', '@prisma/client'], isDev: false, repo: 'https://prisma.io' },
  { id: 'drizzle', name: 'Drizzle ORM', desc: 'drizzle_desc', category: 'db', packages: ['drizzle-orm', 'drizzle-kit'], isDev: false, repo: 'https://orm.drizzle.team' },
  
  { id: 'zustand', name: 'Zustand State', desc: 'zustand_desc', category: 'state', packages: ['zustand'], isDev: false, repo: 'https://zustand-demo.pmnd.rs' },
  { id: 'query', name: 'TanStack React Query', desc: 'query_desc', category: 'state', packages: ['@tanstack/react-query'], isDev: false, repo: 'https://tanstack.com/query' },
  { id: 'axios', name: 'Axios Client', desc: 'axios_desc', category: 'state', packages: ['axios'], isDev: false, repo: 'https://axios-http.com' },

  { id: 'clerk', name: 'Clerk Auth', desc: 'clerk_desc', category: 'auth', packages: ['@clerk/nextjs'], isDev: false, repo: 'https://clerk.com' },
  { id: 'nextauth', name: 'NextAuth.js', desc: 'nextauth_desc', category: 'auth', packages: ['next-auth'], isDev: false, repo: 'https://next-auth.js.org' },

  { id: 'framer', name: 'Framer Motion', desc: 'framer_desc', category: 'ui', packages: ['framer-motion'], isDev: false, repo: 'https://framer.com/motion' },
  { id: 'gsap', name: 'GSAP Scroller', desc: 'gsap_desc', category: 'ui', packages: ['gsap'], isDev: false, repo: 'https://gsap.com' },
  { id: 'reacticons', name: 'React Icons', desc: 'reacticons_desc', category: 'ui', packages: ['react-icons'], isDev: false, repo: 'https://react-icons.github.io/react-icons/' },

  { id: 'stripe', name: 'Stripe Payments', desc: 'stripe_desc', category: 'api', packages: ['stripe', '@stripe/stripe-js'], isDev: false, repo: 'https://stripe.com' },
  { id: 'resend', name: 'Resend Email', desc: 'resend_desc', category: 'api', packages: ['resend', '@react-email/components'], isDev: false, repo: 'https://resend.com' },
  { id: 'uploadthing', name: 'Uploadthing', desc: 'uploadthing_desc', category: 'api', packages: ['uploadthing'], isDev: false, repo: 'https://uploadthing.com' },
  { id: 'sentry', name: 'Sentry Error Log', desc: 'sentry_desc', category: 'api', packages: ['@sentry/nextjs'], isDev: false, repo: 'https://sentry.io' },
  
  { id: 'redis', name: 'Upstash Redis KV', desc: 'redis_desc', category: 'api', packages: ['@upstash/redis'], isDev: false, repo: 'https://upstash.com' },
  { id: 'datefns', name: 'Date-fns', desc: 'datefns_desc', category: 'state', packages: ['date-fns'], isDev: false, repo: 'https://date-fns.org' },
  { id: 'pusher', name: 'Pusher Realtime', desc: 'pusher_desc', category: 'api', packages: ['pusher-js'], isDev: false, repo: 'https://pusher.com' },
  { id: 'markdown', name: 'Markdown Stack', desc: 'markdown_desc', category: 'api', packages: ['react-markdown', 'rehype-raw', 'remark-gfm'], isDev: false, repo: 'https://github.com/remarkjs/react-markdown' },
  { id: 'sonner', name: 'Sonner Toasts', desc: 'sonner_desc', category: 'ui', packages: ['sonner'], isDev: false, repo: 'https://sonner.emilkowal.ski' }
]

export default function SetupWizard() {
  const [step, setStep] = useState(1)
  const [lang, setLang] = useState<"pl" | "en">("en")
  const t = (key: string) => TRANSLATIONS[lang][key] || key

  const PACKAGE_CATEGORIES = [
    { id: 'all', name: t('cat_all') },
    { id: 'dev', name: t('cat_dev') },
    { id: 'db', name: t('cat_db') },
    { id: 'state', name: t('cat_state') },
    { id: 'auth', name: t('cat_auth') },
    { id: 'ui', name: t('cat_ui') },
    { id: 'api', name: t('cat_api') }
  ]
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  
  // Ewolucja Formularza 70% Gotowości Zlecenia:
  const [branding, setBranding] = useState({
     companyName: '',
     heroTitle: '',
     heroDesc: '',
     primaryColor: '#f97316',
     heroImageUrl: '',
     ctaText: '',
     contactPhone: '',
     contactEmail: '',
     address: '',
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
         const res = await generateLivePreview(selectedTemplate || 'saas-ai', { ...branding, lang });
         if(res?.timestamp) {
             setLivePreviewTimestamp(Date.now());
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
      const res = await generateCopywriting({ ...branding, lang });
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
                  <Star size={14} className="text-[#EAB308] group-hover:fill-[#EAB308] transition-all" /> {t('star_mdk')}
                  {starCount !== null && (
                     <span className="ml-1 px-1.5 py-0.5 bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                        {starCount}
                     </span>
                  )}
               </a>
               <div className="flex border border-zinc-800 bg-[#0A0A0A] p-0.5">
                  <button onClick={() => setLang('pl')} className={`px-2 py-1 text-[10px] font-bold ${lang === 'pl' ? 'bg-[#f97316] text-black' : 'text-zinc-500 hover:text-white'}`}>PL</button>
                  <button onClick={() => setLang('en')} className={`px-2 py-1 text-[10px] font-bold ${lang === 'en' ? 'bg-[#f97316] text-black' : 'text-zinc-500 hover:text-white'}`}>EN</button>
               </div>
            </div>
         </div>

         {/* -------------------- STEPS 1 & 2 (Uproszczone by utrzymać flow dla usera) -------------------- */}
         {step === 1 && (
            <div className="bg-[#0A0A0A] border-2 border-zinc-800 p-8 sm:p-10 max-w-4xl w-full shadow-2xl relative animate-in fade-in slide-in-from-bottom-8">
               <div className="mb-8 border-b border-zinc-900 pb-6"><h2 className="text-3xl font-black uppercase tracking-tight">{t('step1_title')}</h2></div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 {PROJECT_TYPES.map((type) => {
                    const Icon = type.icon
                    return (
                    <div key={type.id} onClick={() => { setSelectedType(type.id); setStep(2); }} className="p-6 border-2 border-zinc-800 hover:border-[#f97316] hover:bg-[#f97316]/5 bg-zinc-900/50 transition-all cursor-pointer flex flex-col items-center text-center">
                       <Icon size={40} className="mb-4 text-[#f97316]" />
                       <h3 className="font-bold text-lg uppercase tracking-tight mb-2 text-white">{t(type.name)}</h3>
                       <p className="text-zinc-500 text-xs">{t(type.desc)}</p>
                    </div>
                 )})}
               </div>
            </div>
         )}

         {step === 2 && selectedType && (
            <div className="bg-[#0A0A0A] border-2 border-zinc-800 p-8 sm:p-10 max-w-4xl w-full shadow-2xl animate-in fade-in slide-in-from-right-8 text-center">
               <h2 className="text-3xl font-black uppercase tracking-tight mb-8">{t('step2_title')}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                 {TEMPLATES[selectedType].map((tmpl) => (
                    <div key={tmpl.id} onClick={() => { setSelectedTemplate(tmpl.id); setStep(3); }} className="p-6 border-2 border-zinc-800 hover:border-[#f97316] hover:bg-[#f97316]/5 bg-zinc-900/50 transition-all cursor-pointer group">
                       <h3 className="font-bold text-xl uppercase tracking-tight mb-2 text-[#f97316] group-hover:text-white">{t(tmpl.name) === tmpl.name ? tmpl.name : t(tmpl.name)}</h3>
                       <p className="text-zinc-400 text-sm">{t(tmpl.desc) === tmpl.desc ? tmpl.desc : t(tmpl.desc)}</p>
                    </div>
                 ))}
               </div>
               <button onClick={() => setStep(1)} className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest font-bold">{t('back')}</button>
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
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316]">{t('step3_title')}</h2>
                    <p className="text-zinc-400 mt-1">{t('step3_desc')}</p>
                  </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                   
                   <div className="space-y-6">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-[#f97316] border-b border-zinc-800 pb-3 mb-4">{t('contact_metadata')}</h3>
                       <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Phone size={14}/> {t('phone')}</label>
                          <input type="text" value={branding.contactPhone} onChange={(e) => setBranding({...branding, contactPhone: e.target.value})} placeholder={t('phone_placeholder')} className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Mail size={14}/> {t('email')}</label>
                          <input type="text" value={branding.contactEmail} onChange={(e) => setBranding({...branding, contactEmail: e.target.value})} placeholder={t('email_placeholder')} className="w-full h-12 bg-zinc-900 border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><MapPin size={14}/> {t('address')}</label>
                          <textarea rows={2} value={branding.address} onChange={(e) => setBranding({...branding, address: e.target.value})} placeholder={t('address_placeholder')} className="w-full bg-zinc-900 border border-zinc-700 p-4 text-white focus:border-[#f97316] outline-none font-mono text-sm resize-none" />
                       </div>
                       <div className="space-y-3 pt-6 border-t border-zinc-800">
                          <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">{t('analytics_id')}</label>
                          <input type="text" value={branding.analyticsId} onChange={(e) => setBranding({...branding, analyticsId: e.target.value})} placeholder={t('analytics_placeholder')} className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                       </div>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-zinc-900 border border-[#f97316]/50 p-6 shadow-inner">
                         <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
                            <div>
                               <h3 className="text-sm font-black uppercase tracking-widest text-[#f97316] flex items-center gap-2"><Sparkles size={16}/> {t('ai_injection')}</h3>
                               <p className="text-zinc-500 text-xs mt-1">{t('ai_injection_desc')}</p>
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
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">{t('ai_key')}</label>
                                  <input type="password" value={branding.aiKey} onChange={(e) => setBranding({...branding, aiKey: e.target.value})} placeholder="sk-proj... / AIzaSy..." className="w-full h-10 bg-black border border-zinc-700 px-3 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">{t('seo_keywords')}</label>
                                  <input type="text" value={branding.seoKeywords} onChange={(e) => setBranding({...branding, seoKeywords: e.target.value})} placeholder={t('seo_placeholder')} className="w-full h-10 bg-black border border-zinc-700 px-3 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-bold text-zinc-400 uppercase">{t('tone')}</label>
                                  <textarea rows={2} value={branding.aiContext} onChange={(e) => setBranding({...branding, aiContext: e.target.value})} placeholder={t('tone_placeholder')} className="w-full bg-black border border-zinc-700 p-3 text-white focus:border-[#f97316] outline-none font-mono text-xs resize-none" />
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
               </div>

               <div className="bg-[#0A0A0A] border border-zinc-800 p-6 shadow-inner mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#f97316] border-b border-zinc-800 pb-4 mb-6"><TerminalSquare size={16} className="inline mr-2"/> {t('other_backend')}</h3>
                  
                  <div className="space-y-6">
                     <label className={`flex items-center cursor-pointer group ${!branding.useAI ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateDatabase} disabled={!branding.useAI} onChange={(e) => setBranding({...branding, generateDatabase: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateDatabase ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateDatabase ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316]">{t('supabase_name')}</span>
                           <p className="text-zinc-500 text-xs mt-1">{t('supabase_desc')} {!branding.useAI && t('requires_ai')}</p>
                        </div>
                     </label>

                     <label className="flex items-center cursor-pointer group">
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.injectTailwindVars} onChange={(e) => setBranding({...branding, injectTailwindVars: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.injectTailwindVars ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.injectTailwindVars ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">{t('tailwind_vars_name')}</span>
                           <p className="text-zinc-500 text-xs mt-1">{t('tailwind_vars_desc')}</p>
                        </div>
                     </label>

                     <label className={`flex items-center cursor-pointer group ${!branding.useAI ? 'opacity-40 cursor-not-allowed' : ''}`}>
                        <div className="relative mr-5 shrink-0">
                          <input type="checkbox" className="sr-only" checked={branding.generateTopology} disabled={!branding.useAI} onChange={(e) => setBranding({...branding, generateTopology: e.target.checked})} />
                          <div className={`block w-12 h-6 rounded-full transition-colors ${branding.generateTopology ? 'bg-[#f97316]' : 'bg-zinc-800'}`}></div>
                          <div className={`dot absolute left-1 top-1 bg-black w-4 h-4 rounded-full transition-transform ${branding.generateTopology ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <div>
                           <span className="font-bold text-sm uppercase tracking-widest text-[#f97316] transition-colors">{t('topology_name')}</span>
                           <p className="text-zinc-500 text-xs mt-1">{t('topology_desc')} {!branding.useAI && t('requires_ai')}</p>
                        </div>
                     </label>
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={handleGenerateAIAndProceed} disabled={isGeneratingAI} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)] flex items-center justify-center min-w-[300px]">
                     {isGeneratingAI ? <Loader2 size={24} className="animate-spin mr-3" /> : null}
                     {isGeneratingAI ? t('analyzing') : (branding.useAI ? t('ai_proceed') : t('visual_builder_btn'))}
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
                      <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316] leading-none mb-2">{t('visual_builder')}</h2>
                      <p className="text-zinc-400 text-xs">{t('visual_builder_desc')}</p>
                   </div>
                   
                   <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Type size={14} className="text-[#f97316]"/> {t('logo_text')}</label>
                            <input type="text" value={branding.companyName} onChange={(e) => setBranding({...branding, companyName: e.target.value})} placeholder={t('logo_placeholder')} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Megaphone size={14} className="text-[#f97316]"/> {t('cta_btn_text')}</label>
                            <input type="text" value={branding.ctaText} onChange={(e) => setBranding({...branding, ctaText: e.target.value})} placeholder={t('cta_placeholder')} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><ImageIcon size={14} className="text-[#f97316]"/> {t('hero_image')}</label>
                            <input type="text" value={branding.heroImageUrl} onChange={(e) => setBranding({...branding, heroImageUrl: e.target.value})} placeholder="https://images.unsplash..." className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-xs" />
                         </div>
                         <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><Palette size={14} className="text-[#f97316]"/> {t('primary_color')}</label>
                            <div className="flex gap-4">
                               <input type="color" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="w-12 h-12 bg-black border border-zinc-800 p-0.5 cursor-pointer shrink-0" />
                               <input type="text" value={branding.primaryColor} onChange={(e) => setBranding({...branding, primaryColor: e.target.value})} className="flex-1 h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono uppercase" />
                            </div>
                         </div>

                         
                         <div className="pt-6 border-t border-zinc-900 space-y-6">
                            <h3 className="text-[10px] font-black uppercase text-[#f97316]">{t('content_editor')}</h3>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase">{t('hero_title_editor')}</label>
                               <textarea rows={2} value={branding.heroTitle || ''} onChange={(e) => setBranding({...branding, heroTitle: e.target.value})} placeholder={t('hero_title_placeholder')} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-[#f97316] outline-none font-mono text-xs resize-none" />
                               <p className="text-[9px] text-zinc-600">Tip: Użyj &lt;br/&gt; i &lt;span style=...&gt;</p>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase">{t('hero_desc_editor')}</label>
                               <textarea rows={2} value={branding.heroDesc || ''} onChange={(e) => setBranding({...branding, heroDesc: e.target.value})} placeholder={t('hero_desc_placeholder')} className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-[#f97316] outline-none font-mono text-xs resize-none" />
                            </div>
                         </div>

                         <div className="pt-6 border-t border-zinc-900 space-y-6">
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> {t('typography')}</label>
                               <select value={branding.typography} onChange={(e) => setBranding({...branding, typography: e.target.value})} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm cursor-pointer">
                                  <option value="geist">{t('type_geist')}</option>
                                  <option value="inter">{t('type_inter')}</option>
                                  <option value="playfair">{t('type_playfair')}</option>
                                  <option value="outfit">{t('type_outfit')}</option>
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> {t('navbar_style')}</label>
                               <select value={branding.navbarStyle} onChange={(e) => setBranding({...branding, navbarStyle: e.target.value})} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm cursor-pointer">
                                  <option value="glass">{t('nav_glass')}</option>
                                  <option value="minimal">{t('nav_minimal')}</option>
                                  <option value="hidden">{t('nav_hidden')}</option>
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2"><LayoutTemplate size={14}/> {t('footer_style')}</label>
                               <select value={branding.footerStyle} onChange={(e) => setBranding({...branding, footerStyle: e.target.value})} className="w-full h-12 bg-black border border-zinc-800 px-4 text-white focus:border-[#f97316] outline-none font-mono text-sm cursor-pointer">
                                  <option value="default">{t('foot_default')}</option>
                                  <option value="glass">{t('foot_glass')}</option>
                                  <option value="minimal">{t('foot_minimal')}</option>
                               </select>
                            </div>
                             <div className="pt-6 border-t border-zinc-900 space-y-4">
                                <h3 className="text-[10px] font-black uppercase text-[#f97316] flex items-center justify-between">
                                    {t('premium_modules')} 
                                    {downloadingModule && <span className="text-white flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> {downloadingModule}</span>}
                                </h3>
                                 <div className="space-y-2">
                                 {[
                                     { id: 'chatbot', name_key: 'chatbot_name', name_fallback: 'Chatbot AI B2B' },
                                     { id: 'calculator', name_key: 'calculator_name', name_fallback: 'Kalkulator B2B' },
                                     { id: 'testimonials', name_key: 'testimonials_name', name_fallback: 'Karuzela Opinii' },
                                     { id: 'pricing', name_key: 'pricing_name', name_fallback: 'Plany Abonamentowe' },
                                     { id: 'faq', name_key: 'faq_name', name_fallback: 'Zwijane Sekcje (FAQ)' }
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
                                                        setDownloadingModule(m.name_fallback);
                                                        const res = await installMdkModule(m.id);
                                                        setDownloadingModule(null);
                                                        if(res.error) console.error(res.error);
                                                    }
                                               }} className="accent-[#f97316] w-4 h-4 cursor-pointer" />
                                               <span className="font-bold text-xs uppercase tracking-widest text-white">{t(m.name_key)}</span>
                                            </div>
                                            {m.id === 'chatbot' && isChecked && (
                                                <div className="mt-3 pt-3 border-t border-zinc-800/50">
                                                   <input type="text" placeholder={t('chatbot_placeholder')} value={branding.modules.chatbotContext} onChange={(e) => setBranding({...branding, modules: {...branding.modules, chatbotContext: e.target.value}})} className="w-full bg-black border border-zinc-700 px-3 py-2 text-white outline-none font-mono text-[10px]" />
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
                          {downloadingModule ? t('downloading') : t('goto_packages_btn')}
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
                           <iframe src="/live-preview" key={livePreviewTimestamp} className="absolute inset-0 w-full h-full border-0 bg-transparent z-10" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center -z-10 bg-black/50">
                               <Loader2 size={32} className="animate-spin text-zinc-500 mb-4" />
                               <span className="font-mono text-xs uppercase tracking-widest text-zinc-600">{t('live_preview_loading')}</span>
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
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#f97316]">{t('step5_title')}</h2>
                    <p className="text-zinc-400 mt-1">{t('step5_desc')}</p>
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
                              <p className="text-zinc-500 text-xs line-clamp-2">{t(pkg.desc)}</p>
                           </div>
                           <div className="mt-3 pt-3 border-t border-zinc-900 flex justify-between items-center">
                              <span className="text-[10px] font-mono text-zinc-600 uppercase">{pkg.category}</span>
                              <a href={pkg.repo} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-[10px] uppercase font-mono text-zinc-500 hover:text-[#f97316] flex items-center gap-1">
                                 <Package size={12} /> Repo
                              </a>
               <div className="flex border border-zinc-800 bg-[#0A0A0A] p-0.5">
                  <button onClick={() => setLang('pl')} className={`px-2 py-1 text-[10px] font-bold ${lang === 'pl' ? 'bg-[#f97316] text-black' : 'text-zinc-500 hover:text-white'}`}>PL</button>
                  <button onClick={() => setLang('en')} className={`px-2 py-1 text-[10px] font-bold ${lang === 'en' ? 'bg-[#f97316] text-black' : 'text-zinc-500 hover:text-white'}`}>EN</button>
               </div>
                           </div>
                        </div>
                     )
                  })}
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(6)} className="bg-[#f97316] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     {t('goto_env_btn')}
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
                    <h2 className="text-3xl font-black uppercase tracking-tight text-[#EAB308]">{t('step6_title')}</h2>
                    <p className="text-zinc-400 mt-1">{t('step6_desc')}</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-zinc-400 uppercase">{t('supabase_url_label')}</label>
                     <input type="text" value={branding.supabaseUrl} onChange={(e) => setBranding({...branding, supabaseUrl: e.target.value})} placeholder={t('supabase_url_placeholder')} className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#EAB308] outline-none font-mono text-sm" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-zinc-400 uppercase">{t('supabase_anon_label')}</label>
                     <input type="password" value={branding.supabaseAnonKey} onChange={(e) => setBranding({...branding, supabaseAnonKey: e.target.value})} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#EAB308] outline-none font-mono text-sm" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-bold text-zinc-400 uppercase">{t('supabase_role_label')}</label>
                     <input type="password" value={branding.supabaseServiceRole} onChange={(e) => setBranding({...branding, supabaseServiceRole: e.target.value})} placeholder={t('supabase_role_placeholder')} className="w-full h-12 bg-black border border-zinc-700 px-4 text-white focus:border-[#EAB308] outline-none font-mono text-sm" />
                  </div>
               </div>

               <div className="flex justify-end pt-8 mt-8 border-t border-zinc-900">
                  <button onClick={() => setStep(7)} className="bg-[#EAB308] text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all transform hover:scale-[1.02] shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                     {t('final_submit_btn')}
                  </button>
               </div>
            </div>
         )}


         {/* -------------------- Krok 7: Egzekucja Terminalowa -------------------- */}
         {step === 7 && (
            <div className="bg-[#0A0A0A] border-2 border-white p-8 sm:p-12 max-w-4xl w-full flex flex-col animate-in fade-in zoom-in duration-500">
               <h2 className="text-4xl font-black uppercase tracking-tight mb-8 text-center">{t('final_build')}</h2>

               <div className="bg-black border border-zinc-800 rounded p-6 h-64 overflow-y-auto font-mono text-sm leading-loose mb-10 flex flex-col gap-2 relative">
                  {logs.length === 0 && <span className="text-zinc-500">{t('wait_script')}</span>}
                  
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4">
                       <span className={log.includes('[ERROR]') ? 'text-red-500 font-bold' : log.includes('[SUCCESS]') || log.includes('[SYSTEM]') ? 'text-[#EAB308] font-bold' : 'text-zinc-400'}>{log}</span>
                    </div>
                  ))}
                  
                  {isInstalling && (
                     <div className="flex gap-4 mt-6 text-white items-center animate-pulse">
                        <Loader2 size={18} className="animate-spin" /> {t('processing_source')}
                     </div>
                  )}
               </div>

               {!logs.some(l => l.includes('ERROR')) ? (
                  <button 
                     onClick={handleStartSetup}
                     disabled={isInstalling || logs.some(l => l.includes('SUCCESS'))}
                     className="bg-white text-black font-black text-xl uppercase tracking-widest px-8 py-6 hover:bg-[#EAB308] transition-colors disabled:opacity-0 disabled:pointer-events-none"
                  >
                     {t('run_generator_btn')}
                  </button>
               ) : (
                  <button 
                     onClick={() => { setLogs([]); setStep(6); }}
                     className="bg-red-900/50 border border-red-500 text-red-100 font-black text-xl uppercase tracking-widest px-8 py-6 hover:bg-red-500 transition-colors"
                  >
                     {t('fix_config_btn')}
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
