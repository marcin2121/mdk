"use client"
import { Star, Quote } from "lucide-react"

export default function Testimonials() {
  const reviews = [
    { id: 1, name: "Marcin Molenda", role: "CEO @ MD", text: "MDK to potężne narzędzie. Zbudowanie Landing Page dla klienta zabiera mi teraz godziny, a nie dni.", rating: 5 },
    { id: 2, name: "Anna Kowalska", role: "Product Owner", text: "Design systemu layoutu rzuca na kolana. Prędkość ładowania 100/100 LH to standard.", rating: 5 },
    { id: 3, name: "Tomasz Nowak", role: "SaaS Dev", text: "Gotowe moduły takie jak chatbot czy kalkulator kosztów to genialny dodatek do szybkich MVP.", rating: 5 }
  ]

  return (
    <div className="py-24 bg-black/50 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
            Co mówią <span className="text-[var(--mdk-primary)]">Klienci</span>
          </h2>
          <p className="text-zinc-400 font-medium max-w-xl mx-auto text-sm">
            Dowód społeczny słuszności wyboru frameworka MDK. Szybkość, design i konwersja.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
             <div key={rev.id} className="p-8 border border-zinc-800 bg-[#0A0A0A] rounded-xl hover:border-zinc-700 transition-all relative group flex flex-col">
                <Quote size={40} className="absolute top-6 right-6 text-zinc-800 group-hover:text-[var(--mdk-primary)] transition-colors opacity-30" />
                
                <div className="flex gap-1 mb-4 text-[var(--mdk-primary)]">
                   {[...Array(rev.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>

                <p className="text-zinc-300 font-medium text-sm leading-relaxed mb-6 flex-1">"{rev.text}"</p>

                <div className="border-t border-zinc-900 pt-4 mt-auto">
                   <h4 className="font-bold text-white text-sm">{rev.name}</h4>
                   <span className="text-zinc-600 text-xs font-mono">{rev.role}</span>
                </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  )
}