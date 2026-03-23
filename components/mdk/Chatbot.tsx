// Automatycznie wstrzyknięto przez MDK Wizard Remote Registry
"use client"
import { useState } from 'react';

export default function Chatbot() {
   const [isOpen, setIsOpen] = useState(false);

   if (!isOpen) return (
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 w-16 h-16 bg-[var(--mdk-primary)] rounded-full shadow-2xl z-50 flex items-center justify-center hover:scale-110 transition-transform">
         <span className="text-black font-black text-2xl">AI</span>
      </button>
   );

   return (
      <div className="fixed bottom-6 right-6 w-80 bg-[#0A0A0A] border border-[var(--mdk-primary)] rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
         <div className="bg-[var(--mdk-primary)] text-black font-bold p-4 uppercase tracking-widest text-sm flex justify-between items-center">
            <span>Enterprise AI</span>
            <button onClick={() => setIsOpen(false)} className="cursor-pointer font-black text-xl leading-none hover:text-white">&times;</button>
         </div>
         <div className="p-4 h-64 overflow-y-auto bg-black flex flex-col gap-3">
            <div className="bg-zinc-900 text-zinc-300 p-3 rounded-r-xl rounded-bl-xl text-sm w-4/5">
                Witaj! Jestem automatycznym doradcą i inżynierem ofert. 
                <span className="hidden">{{CHATBOT_CONTEXT}}</span>
                W czym mogę pomoc?
            </div>
         </div>
         <div className="p-4 border-t border-zinc-800 bg-[#0A0A0A]">
            <input type="text" placeholder="Wpisz zapytanie..." className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white focus:border-[var(--mdk-primary)] outline-none font-mono text-xs rounded" />
         </div>
      </div>
   )
}