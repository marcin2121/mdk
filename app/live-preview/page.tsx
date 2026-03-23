// @ts-nocheck
import Link from "next/link";
import { Code2, MonitorPlay, Layers, ArrowRight } from "lucide-react";

export default function PortfolioPage() {
  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" />
      <style>{`* { font-family: "Playfair Display, serif" !important; }`}</style>

    <div className="min-h-screen bg-[#000000] text-white font-sans overflow-hidden selection:bg-[#f97316] selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 mix-blend-screen" style={{ backgroundColor: '#f97316' }} />
         <div className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] rounded-full blur-[200px] opacity-10 mix-blend-screen animate-pulse" style={{ backgroundColor: '#f97316' }} />
      </div>

      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl bg-zinc-900/40 backdrop-blur-xl border border-zinc-700/50 rounded-full flex items-center justify-between px-8 h-16 z-50 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
             <div className="font-black text-xl tracking-tighter uppercase flex items-center gap-3">
                <span className="text-white">MDK STARTUP</span>
             </div>
              <nav className="flex items-center gap-6 text-sm font-bold tracking-widest uppercase">
                 <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Home</span>
                 <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Services</span>
                 <span className="hidden sm:block text-zinc-400 hover:text-white transition-colors cursor-pointer">Premium</span>
                 <button className="text-black px-6 py-2 rounded-full transition-transform hover:scale-105" style={{ backgroundColor: '#f97316' }}>Action</button>
              </nav>
          </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[75vh] text-center px-4">
         <h1 className="text-[14vw] sm:text-[10vw] font-black leading-[0.85] tracking-tighter uppercase mix-blend-difference drop-shadow-2xl">
            We Create <br/> 
            <i className="font-serif italic font-light block mt-4" style={{ color: '#f97316' }}>Digital Modules.</i>
         </h1>
         
         <p className="mt-12 text-xl md:text-3xl text-zinc-400 max-w-4xl font-light leading-relaxed">
            Exclusive MDK developer studio. We achieve rendering performance on the edge of today's browsers' capabilities.
         </p>

         <button className="mt-16 text-black font-black uppercase tracking-widest px-10 py-6 transition-transform hover:scale-105 flex items-center gap-4 group" style={{ backgroundColor: '#f97316' }}>
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
         </button>

         <div className="mt-32 grid grid-cols-1 sm:grid-cols-3 gap-0 max-w-7xl mx-auto w-full text-left border-y border-zinc-900 border-x-0">
            <div className="p-10 hover:bg-zinc-950 transition-colors group md:border-r border-zinc-900 border-b md:border-b-0">
               <MonitorPlay size={40} className="mb-6 text-zinc-600 transition-colors" style={{ color: '#f97316' }} />
               <h3 className="text-xl font-bold uppercase mb-4 tracking-widest text-white">Generative UI</h3>
               <p className="text-sm text-zinc-500 font-medium leading-relaxed">Interactive in-browser animations created live using the raw power of fragment mathematics.</p>
            </div>
            <div className="p-10 hover:bg-zinc-950 transition-colors group md:border-r border-zinc-900 border-b md:border-b-0">
               <Code2 size={40} className="mb-6 text-zinc-600 transition-colors" style={{ color: '#f97316' }} />
               <h3 className="text-xl font-bold uppercase mb-4 tracking-widest text-white">Web Architecture</h3>
               <p className="text-sm text-zinc-500 font-medium leading-relaxed">System pushed to the Edge server. Lowest possible Time-To-First-Byte and full scale of SEO deployments.</p>
            </div>
            <div className="p-10 hover:bg-zinc-950 transition-colors group">
               <Layers size={40} className="mb-6 text-zinc-600 transition-colors" style={{ color: '#f97316' }}/>
               <h3 className="text-xl font-bold uppercase mb-4 tracking-widest text-white">Typography & Brand</h3>
               <p className="text-sm text-zinc-500 font-medium leading-relaxed">We exclude standard components. Entire projects are driven by unconventional visionary and editorial approach. Awwwards awards.</p>
            </div>
         </div>
      </main>

      <footer className="w-full text-center py-10 mt-20 text-xs font-mono tracking-widest uppercase text-zinc-600">
         123 Architect St, NYC // +1 (123) 000-0000
      </footer>
    </div>
  
    </>
  );
}
