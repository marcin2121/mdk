import { getPublishedServices } from "../../lib/actions/services";
import { Database, Server, Component, AlertOctagon } from "lucide-react";

// Prosty mapownik stringów id z bazy (icon_name) na dynamiczne obiekty SVG
const iconDict: Record<string, React.ElementType> = {
  database: Database,
  server: Server,
  component: Component
};

export async function ServicesList() {
  let services = [];

  try {
    // Zero useState, zero useEffect. Await blokuje rzut do momentu otrzymania danych z bazy (Server Component rendering).
    services = await getPublishedServices();
  } catch (error: any) {
    return (
      <div className="w-full flex md:flex-row flex-col items-center gap-4 text-red-500 bg-red-950/20 p-6 border border-red-900/50 rounded-2xl">
        <AlertOctagon size={32} className="shrink-0" />
        <div>
           <p className="font-bold text-lg">Przerwano fetcho-wanie:</p>
           <p className="font-mono text-sm break-all opacity-80">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="w-full p-12 border-2 border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center bg-[#0A0A0A] gap-4">
         <Database size={48} className="text-zinc-800" />
         <span className="text-zinc-500 font-mono text-sm tracking-widest uppercase">Brak danych - Czekamy na wiersze z bazy...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {services.map((service) => {
        // Fallback w razie pustego pola ikony na poziomie Supabase
        const LucideIcon = service.icon_name ? iconDict[service.icon_name.toLowerCase()] || Component : Component;
        
        return (
          <div 
            key={service.id} 
            className="group p-8 rounded-[2rem] border border-zinc-800 bg-[#0A0A0A] hover:bg-[#EAB308] hover:border-[#EAB308] transition-all duration-500 cursor-pointer flex flex-col justify-between h-full hover:-translate-y-2 shadow-xl hover:shadow-[#EAB308]/20"
          >
            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 group-hover:bg-black text-[#EAB308] shadow-lg transition-colors">
              <LucideIcon size={32} strokeWidth={1.5} />
            </div>
            
            <div>
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-3 text-white group-hover:text-black transition-colors">{service.title}</h3>
              <p className="text-zinc-400 font-medium leading-relaxed group-hover:text-black/80 transition-colors">
                {service.short_description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
