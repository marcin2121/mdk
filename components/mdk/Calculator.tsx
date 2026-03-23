// Kalkulator z suwakiem - Wstrzyknięto przez MDK Wizard Remote
"use client"
const isEn = typeof window !== "undefined" && window.location.href.includes("/en");
import { useState } from 'react';

export default function Calculator() {
   const [val, setVal] = useState(50);
   return (
      <div className="my-20 p-8 border border-zinc-800 bg-[#0A0A0A] w-full max-w-4xl mx-auto rounded-xl shadow-2xl">
         <h2 className="text-2xl font-black uppercase text-white mb-6">{isEn ? "Project Cost Estimator" : "Estymator Kosztów Projektu"}</h2>
         <div className="flex flex-col gap-4 mb-8">
            <label className="text-zinc-400 font-bold uppercase text-xs">{isEn ? "Order Scale / Number of Units" : "Skala Zamówienia / Ilość Jednostek"}</label>
            <input type="range" min="10" max="500" value={val} onChange={e=>setVal(Number(e.target.value))} className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[var(--mdk-primary)]" />
            <div className="text-[var(--mdk-primary)] font-mono text-xl">{val} {isEn ? "working units" : "jednostek roboczych"}</div>
         </div>
         <div className="mt-8 pt-8 border-t border-zinc-800 flex justify-between items-center bg-black p-6 rounded shadow-inner">
            <span className="text-zinc-500 font-bold uppercase">{isEn ? "Estimated System Cost:" : "Szacowany Koszt Systemowy:"}</span>
            <span className="text-4xl font-black text-white">{(val * 150).toLocaleString()} PLN</span>
         </div>
      </div>
   )
}