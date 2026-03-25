
import Link from "next/link";
import { MapPin, Phone, Clock, Star } from "lucide-react";
import fs from "fs";
import path from "path";
import SetupWizard from "../../components/wizard/setup-wizard";

export default function ClientWebsite() {
  const isSetupComplete = fs.existsSync(path.join(process.cwd(), '.molenda-setup'));
  if (!isSetupComplete) return <SetupWizard />;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-[#a80011] selection:text-white">
      <header className="px-6 lg:px-12 h-24 flex items-center justify-between bg-white border-b border-stone-200 shadow-sm sticky top-0 z-50">
         <h1 className="font-black text-3xl tracking-tighter uppercase text-stone-900 shadow-sm">
            Złota Medycyna
         </h1>
         <Link href="/dashboard" className="px-8 py-3 font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 shadow-lg" style={{ backgroundColor: '#a80011' }}>
            Strefa Klienta
         </Link>
      </header>

      <main>
         <section className="relative w-full h-[70vh] flex flex-col justify-center px-6 lg:px-12 bg-stone-900 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1659353887488-b3c443982a57?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Tło" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" />
            <div className="relative z-10 max-w-3xl border-l-[6px] pl-6 md:pl-10" style={{ borderColor: '#a80011' }}>
               <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 leading-none shadow-sm">Usługi Na Najwyższym <br/><span style={{ color: '#a80011' }}>Poziomie.</span></h2>
               <p className="text-xl md:text-2xl text-stone-300 font-medium mb-8 max-w-xl">Budujemy zaufanie poprzez niezrównany profesjonalizm w każdym calu naszej pracy. Poznaj naszą wizytówkę.</p>
               <button className="px-10 py-5 font-black uppercase tracking-widest text-white transition-transform hover:translate-x-2" style={{ backgroundColor: '#a80011' }}>
                  Sprawdź Katalog
               </button>
            </div>
         </section>

         <section className="py-24 px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 bg-white max-w-7xl mx-auto -mt-16 relative z-20 shadow-2xl rounded-t-3xl border-t-4" style={{ borderColor: '#a80011' }}>
            <div className="flex flex-col items-center text-center p-6">
               <MapPin size={48} style={{ color: '#a80011' }} className="mb-6 drop-shadow-md" />
               <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">Nasze Biuro</h3>
               <p className="text-stone-500 font-medium">ul. Architektoniczna 1<br/>Vercel City, 00-100</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border-y md:border-y-0 md:border-x border-stone-100">
               <Phone size={48} style={{ color: '#a80011' }} className="mb-6 drop-shadow-md" />
               <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">Linia Otwarta</h3>
               <p className="text-stone-500 font-medium">+48 777 888 999<br/>contact@goldmed.com</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
               <Clock size={48} style={{ color: '#a80011' }} className="mb-6 drop-shadow-md" />
               <h3 className="text-xl font-bold uppercase mb-2 tracking-tight">Dostępność</h3>
               <p className="text-stone-500 font-medium">Poniedziałek - Piątek<br/>09:00 - 17:00</p>
            </div>
         </section>
      </main>
    </div>
  );
}
