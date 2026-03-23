"use client"
const isEn = typeof window !== "undefined" && window.location.href.includes("/en");
import { Check } from "lucide-react"

export default function Pricing() {
  const tiers = [
    { name: "Starter", price: "49", desc: isEn ? "Build and launch your first MVP." : "Zbuduj i wypuść swoje pierwsze MVP.", features: isEn ? ["1 project", "Basic UI", "24/7 Support", "Domain included"] : ["1 projekt", "Podstawowe UI", "Wsparcie 24/7", "Domena .pl"] },
    { name: "Pro", price: "129", desc: isEn ? "Scale up and add automations." : "Zwiększ skalę i dodaj automatyzacje.", features: isEn ? ["5 projects", "MDK Premium Nodes", "Dedicated Analytics", "Mobile App"] : ["5 projektów", "Klocki Premium MDK", "Dedykowana analityka", "Aplikacja mobilna"], popular: true },
    { name: "Enterprise", price: "399", desc: isEn ? "For corporations and scalable systems." : "Dla korporacji i skalowalnych systemów.", features: isEn ? ["Unlimited amount", "Dedicated server", "SLA 99.9%", "B2B Billing"] : ["Nielimitowana ilość", "Serwer dedykowany", "SLA 99.9%", "Rozliczenia B2B"] }
  ]

  return (
     <div className="py-24 bg-[#050505] text-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">{isEn ? "Subscription " : "Plany "}<span className="text-[var(--mdk-primary)]">{isEn ? "Plans" : "Abonamentowe"}</span></h2>
              <p className="text-zinc-500 font-medium max-w-xl mx-auto text-sm">{isEn ? "Transparent terms, zero hidden costs. Scale from zero to success." : "Przejrzyste warunki, zero ukrytych kosztów. Skaluj od zera do sukcesu."}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((tier, i) => (
                 <div key={i} className={`p-8 border rounded-xl relative flex flex-col ${tier.popular ? 'border-[var(--mdk-primary)] bg-[var(--mdk-primary)]/5 shadow-[0_0_50px_rgba(234,179,8,0.05)]' : 'border-zinc-800 bg-[#0A0A0A]'}`}>
                    {tier.popular && <span className="absolute top-0 right-8 -translate-y-1/2 bg-[var(--mdk-primary)] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase">{isEn ? "Popular" : "Polecany"}</span>}
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-2">{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                       <span className="text-4xl font-black">{tier.price}</span>
                       <span className="text-zinc-500 text-sm">{isEn ? "/ mo." : "/ mies."}</span>
                    </div>
                    <p className="text-zinc-400 text-xs mb-8">{tier.desc}</p>
                    
                    <ul className="space-y-4 mb-8 flex-1">
                       {tier.features.map((f, j) => (
                          <li key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                             <Check size={16} className="text-[var(--mdk-primary)]" /> {f}
                          </li>
                       ))}
                    </ul>

                    <button className={`w-full py-4 font-black uppercase tracking-wider text-sm transition-transform hover:scale-[1.02] ${tier.popular ? 'bg-[var(--mdk-primary)] text-black' : 'bg-white text-black hover:bg-zinc-200'}`}>{isEn ? "Choose Plan" : "Wybierz Plan"}</button>
                 </div>
              ))}
           </div>
        </div>
     </div>
  )
}