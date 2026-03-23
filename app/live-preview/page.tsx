// @ts-nocheck
import Link from "next/link";
import { MapPin, Phone, Clock, Mail, ArrowRight, Instagram, Facebook } from "lucide-react";

export default function ClientWebsite() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-[#f97316] selection:text-white">
      
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-6 lg:px-12 flex justify-between items-center font-medium">
         <div className="flex items-center gap-6">
            <span className="hidden sm:flex items-center gap-2"><Phone size={14}/> +48 500 000 000</span>
            <span className="flex items-center gap-2"><Mail size={14}/> biuro@firma.pl</span>
         </div>
         <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors"><Instagram size={14}/></a>
            <a href="#" className="hover:text-white transition-colors"><Facebook size={14}/></a>
         </div>
      </div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-full flex items-center justify-between px-8 h-16 z-50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
             <div className="font-black text-xl tracking-tighter uppercase flex items-center gap-3">
                <span className="text-white">MDK STARTUP</span>
             </div>
             <nav className="flex items-center gap-6 text-sm font-bold tracking-widest uppercase">
                <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Start</span>
                <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Usługi</span>
                <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Oferta Premium</span>
                <button className="text-black px-6 py-2 rounded-full transition-transform hover:scale-105" style={{ backgroundColor: '#f97316' }}>Rozpocznij</button>
             </nav>
          </header>

      <main>
         <section className="relative w-full h-[75vh] flex flex-col justify-center px-6 lg:px-12 bg-stone-900 overflow-hidden">
            {`https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070` ? <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070" alt="Tło" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-105" /> : <div className="absolute inset-0 bg-stone-800" />}
            
            <div className="relative z-10 max-w-4xl border-l-[8px] pl-6 md:pl-12" style={{ borderColor: '#f97316' }}>
               <h2 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 leading-[0.9] drop-shadow-xl">
                  Twój Biznes <br/><span style={{ color: '#f97316' }}>Na Zasięgu Ręki.</span>
               </h2>
               <p className="text-lg md:text-2xl text-stone-200 font-medium mb-10 max-w-2xl text-shadow-sm line-clamp-3">
                  Eksperci od kompleksowych realizacji. Nasze doświadczenie przekłada się na mierzalne rezultaty. Dołącz do nas już dzisiaj.
               </p>
               <button className="px-10 py-5 font-black uppercase tracking-widest text-black transition-all hover:translate-x-2 flex items-center gap-4 text-sm sm:text-base cursor-pointer" style={{ backgroundColor: '#f97316' }}>
                  Rozpocznij <ArrowRight size={20} />
               </button>
            </div>
         </section>

         <section className="py-24 px-6 lg:px-12 bg-white max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1">
               <h3 className="text-sm font-bold uppercase tracking-widest mb-4 border-b-2 pb-2 inline-block" style={{ borderColor: '#f97316', color: '#f97316' }}>Solidne Fundamenty</h3>
               <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight mb-6">Dlaczego warto nam zaufać?</h2>
               <p className="text-lg text-stone-500 mb-8 leading-relaxed">
                  Każdy projekt traktujemy z najwyższym rygorem jakościowym. Pracujemy sprawnie generując konwersje.
               </p>
            </div>
            <div className="flex-1">
               {`https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070` ? <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070" className="w-full aspect-[4/3] object-cover rounded-tr-[100px] rounded-bl-[100px] shadow-2xl" /> : <div className="w-full aspect-[4/3] bg-stone-200 rounded-[100px]"/>}
            </div>
         </section>

         <section id="kontakt" className="py-24 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-0 bg-stone-100 max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-sm mb-20 border-t-8" style={{ borderColor: '#f97316' }}>
            <div className="flex flex-col items-center text-center p-12 bg-white">
               <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f9731620' }}>
                  <MapPin size={32} style={{ color: '#f97316' }} />
               </div>
               <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Siedziba Główna</h3>
               <p className="text-stone-500 font-medium max-w-[200px] leading-relaxed">ul. Architektoniczna 1, Warszawa</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-12 bg-stone-50 border-y md:border-y-0 md:border-x border-stone-200">
               <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f9731620' }}>
                  <Phone size={32} style={{ color: '#f97316' }} />
               </div>
               <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Linia Otwarta</h3>
               <p className="text-stone-500 font-medium">+48 500 000 000<br/>biuro@firma.pl</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-12 bg-white">
               <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#f9731620' }}>
                  <Clock size={32} style={{ color: '#f97316' }} />
               </div>
               <h3 className="text-xl font-black uppercase mb-3 tracking-tight">Dostępność Usług</h3>
               <p className="text-stone-500 font-medium">Poniedziałek - Piątek<br/>09:00 - 18:00</p>
            </div>
         </section>
      </main>
    </div>
  );
}
