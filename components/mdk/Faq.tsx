"use client"
const isEn = typeof window !== "undefined" && window.location.href.includes("/en");
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function AccordionFAQ() {
  const faqs = [
    { q: "Czym jest MDK Framework?", a: "MDK to zaawansowany zestaw deweloperski umożliwiający niemal natychmiastowe budowanie aplikacji SaaS i Landing Page opartych o Next.js oraz Supabase." },
    { q: "Jak wygląda proces instalacji?", a: "Wystarczy uruchomić serwer, a graficzny instalator w przeglądarce zażąda od Ciebie podstawowych specyfikacji i skonfiguruje cały modułowy szkielet za Ciebie." },
    { q: "Czy mogę modyfikować kod?", a: "Oczywiście. MDK wstrzykuje czysty kod React/TypeScript, który możesz dowolnie edytować i rozwijać zgodnie ze swoimi standardami." }
  ]
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
     <div className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-12 text-center">Częste <span className="text-[var(--mdk-primary)]">Pytania</span> (FAQ)</h2>
           <div className="space-y-4">
              {faqs.map((faq, i) => {
                 const isOpen = openIndex === i;
                 return (
                    <div key={i} className={`border border-zinc-800 bg-[#0A0A0A] rounded-xl overflow-hidden transition-all ${isOpen ? 'border-[var(--mdk-primary)]' : ''}`}>
                       <button onClick={() => setOpenIndex(isOpen ? null : i)} className="w-full p-6 flex justify-between items-center text-left hover:bg-zinc-900/50 transition-colors">
                          <span className="font-bold text-white tracking-tight">{faq.q}</span>
                          <ChevronDown size={18} className={`text-[var(--mdk-primary)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                       </button>
                       {isOpen && (
                          <div className="p-6 pt-0 text-zinc-400 text-sm font-medium leading-relaxed animate-in fade-in slide-in-from-top-2">
                             {faq.a}
                          </div>
                       )}
                    </div>
                 )
              })}
           </div>
        </div>
     </div>
  )
}