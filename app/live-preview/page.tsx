// @ts-nocheck
import Link from "next/link";
import { BarChart3, Users, Zap, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function SaaSPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans selection:bg-[#f97316] selection:text-black">
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

      <main className="max-w-7xl mx-auto px-6 py-20">
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-xs font-bold uppercase tracking-widest rounded-full mb-6 text-zinc-400">
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#f97316' }} /> System Ready
               </div>
               <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 text-white leading-none" dangerouslySetInnerHTML={{ __html: `Modern <br/> <span style="color: #f97316">Infrastructure.</span>` }} />
               <p className="text-xl text-zinc-400 mb-10 max-w-xl font-medium leading-relaxed border-l-4 pl-6" style={{ borderColor: '#f97316' }}>
                  Automatically processed by MDK Live Engine. Build scalable apps right now.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                  <button className="text-black font-black uppercase tracking-widest px-8 py-5 transition-transform hover:-translate-y-1 flex items-center justify-center gap-3" style={{ backgroundColor: '#f97316' }}>
                     Sign In <ArrowRight size={20} />
                  </button>
                  <button className="text-white bg-zinc-900 border border-zinc-800 font-bold uppercase tracking-widest px-8 py-5 transition-colors hover:bg-zinc-800">
                     Documentation
                  </button>
               </div>
            </div>

            <div className="relative">
               <div className="absolute inset-0 blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: '#f97316' }} />
               {`https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070` ? <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070" alt="Dashboard" className="w-full aspect-square object-cover border border-zinc-800 rounded-3xl relative z-10 shadow-2xl" /> : <div className="w-full aspect-square border border-zinc-900 border-dashed rounded-3xl relative z-10 flex items-center justify-center text-zinc-700 font-mono text-sm">(Brak Obrazu MDK)</div>}
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
            <div className="p-8 border border-zinc-800 bg-[#0A0A0A] hover:-translate-y-2 transition-transform group">
               <BarChart3 size={40} style={{ color: '#f97316' }} className="mb-6 opacity-80 group-hover:opacity-100" strokeWidth={1.5} />
               <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Real-time Statistics</h3>
               <p className="text-zinc-500 text-sm font-medium">Lightning-fast integration with PostgreSQL database. Zero lag.</p>
            </div>
            <div className="p-8 border border-zinc-800 bg-[#0A0A0A] hover:-translate-y-2 transition-transform group">
               <Users size={40} style={{ color: '#f97316' }} className="mb-6 opacity-80 group-hover:opacity-100" strokeWidth={1.5} />
               <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Roles & Permissions</h3>
               <p className="text-zinc-500 text-sm font-medium">Absolute row-level security with native RLS policies.</p>
            </div>
            <div className="p-8 border border-zinc-800 bg-[#0A0A0A] hover:-translate-y-2 transition-transform group">
               <Zap size={40} style={{ color: '#f97316' }} className="mb-6 opacity-80 group-hover:opacity-100" strokeWidth={1.5} />
               <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Edge Speed</h3>
               <p className="text-zinc-500 text-sm font-medium">Applications rendered directly on Vercel Edge nodes for 100/100 LH.</p>
            </div>
         </div>
      </main>

      <footer className="border-t border-zinc-900 mt-20 py-10 text-center text-zinc-600 font-mono text-sm">
         <p>contact@company.com // +1 (123) 000-0000</p>
         <p className="mt-2 text-zinc-700">© 2026 MDK STARTUP. Generated by MDK.</p>
      </footer>
    </div>
  );
}
