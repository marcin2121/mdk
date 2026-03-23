import { CanvasNode } from "../types/builder";

export const SAAS_STARTER_PRESET: CanvasNode[] = [
  {
    id: "root",
    type: "Root",
    props: { className: "flex flex-col min-h-screen w-full bg-[#030303] text-white selection:bg-[#f97316]" },
    children: [
       // NAVBAR
       {
         id: "nav_01",
         type: "Section",
         props: { className: "w-full h-16 px-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-lg sticky top-0 z-50" },
         children: [
            { id: "nav_heading", type: "Heading", props: { text: "MDK.io", className: "text-xl font-black tracking-wider bg-gradient-to-r from-[#f97316] to-pink-500 bg-clip-text text-transparent" }, children: [] },
            { id: "nav_btn", type: "Button", props: { label: "Log In", className: "px-5 py-1.5 bg-white text-black font-bold rounded-full text-xs hover:bg-[#f97316] hover:text-white transition-all shadow-lg shadow-white/5" }, children: [] }
         ]
       },
       // HERO SEKCJA
       {
         id: "hero_01",
         type: "Section",
         props: { className: "w-full py-32 px-6 flex flex-col items-center text-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-[#030303] to-[#030303] relative overflow-hidden" },
         children: [
            // Ambient Glow Backgorund element (as sub div structure using Column style inside) -> will create dynamic look!
            { id: "hero_sub", type: "Subheading", props: { text: "Nowa era rozwoju aplikacji", className: "text-xs text-[#f97316] font-bold uppercase tracking-[0.2em] mb-4 bg-[#f97316]/10 px-4 py-1.5 rounded-full border border-[#f97316]/20" }, children: [] },
            { id: "hero_head", type: "Heading", props: { text: "Build Applications Without Limits.", className: "text-6xl sm:text-7xl font-black text-white tracking-tighter mb-6 max-w-4xl bg-clip-text bg-gradient-to-b from-white via-white to-zinc-600 !text-transparent" }, children: [] },
            { id: "hero_txt", type: "Text", props: { text: "The evolution of standard boilerplates. Specialized development kit with built-in modular rendering cascade on the edge.", className: "text-zinc-500 text-base max-w-2xl mb-10 leading-relaxed font-medium" }, children: [] },
            {
                id: "hero_actions", type: "Column", props: { className: "flex items-center gap-4" }, children: [
                    { id: "hero_btn", type: "Button", props: { label: "Get Started Now", className: "px-6 py-3 bg-[#f97316] text-black font-extrabold rounded-full text-xs shadow-xl shadow-[#f97316]/20 hover:scale-105 hover:bg-white transition-all" }, children: [] },
                    { id: "hero_btn_sec", type: "Button", props: { label: "Dokumentacja", className: "px-6 py-3 bg-transparent border border-white/10 hover:border-white/30 text-zinc-300 font-bold rounded-full text-xs transition-all" }, children: [] }
                ]
            }
         ]
       },
       // CECHY (FEATURES) - GRID GLASS CARDS
       {
         id: "features_01",
         type: "Section",
         props: { className: "w-full py-24 px-6 flex justify-center bg-[#030303]" },
         children: [
            {
               id: "features_grid",
               type: "Grid3",
               props: { className: "max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6" },
               children: [
                  {
                     id: "f_1", type: "Card", props: { className: "p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col gap-4 group hover:border-[#f97316]/40 transition-all hover:translate-y-[-4px] shadow-2xl" }, children: [
                        { id: "f_1_icon", type: "Column", props: { className: "w-10 h-10 bg-[#f97316]/10 rounded-xl flex items-center justify-center border border-[#f97316]/20 text-[#f97316] font-bold font-mono text-sm" }, children: [ { id: "f_1_icon_in", type: "Text", props: { text: "01", className: "font-black" }, children: [] } ] },
                        { id: "f_1_head", type: "Heading", props: { text: "Zero-Lag Performance", className: "text-lg font-black text-white group-hover:text-[#f97316] transition-colors" }, children: [] },
                        { id: "f_1_txt", type: "Text", props: { text: "Edge-rendered applications for minimum latency on Vercel nodes across all regions.", className: "text-sm text-zinc-500 leading-relaxed" }, children: [] }
                     ]
                   },
                  {
                     id: "f_2", type: "Card", props: { className: "p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col gap-4 group hover:border-[#f97316]/40 transition-all hover:translate-y-[-4px] shadow-2xl" }, children: [
                        { id: "f_2_icon", type: "Column", props: { className: "w-10 h-10 bg-[#f97316]/10 rounded-xl flex items-center justify-center border border-[#f97316]/20 text-[#f97316] font-bold font-mono text-sm" }, children: [ { id: "f_2_icon_in", type: "Text", props: { text: "02", className: "font-black" }, children: [] } ] },
                        { id: "f_2_head", type: "Heading", props: { text: "Enterprise Level Security", className: "text-lg font-black text-white group-hover:text-[#f97316] transition-colors" }, children: [] },
                        { id: "f_2_txt", type: "Text", props: { text: "Native row-level security (RLS) integration powered by Supabase SSR providing 100% tenant isolation.", className: "text-sm text-zinc-500 leading-relaxed" }, children: [] }
                     ]
                  },
                  {
                     id: "f_3", type: "Card", props: { className: "p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col gap-4 group hover:border-[#f97316]/40 transition-all hover:translate-y-[-4px] shadow-2xl" }, children: [
                        { id: "f_3_icon", type: "Column", props: { className: "w-10 h-10 bg-[#f97316]/10 rounded-xl flex items-center justify-center border border-[#f97316]/20 text-[#f97316] font-bold font-mono text-sm" }, children: [ { id: "f_3_icon_in", type: "Text", props: { text: "03", className: "font-black" }, children: [] } ] },
                        { id: "f_3_head", type: "Heading", props: { text: "100/100 Core Vitals Performance", className: "text-lg font-black text-white group-hover:text-[#f97316] transition-colors" }, children: [] },
                        { id: "f_3_txt", type: "Text", props: { text: "Green Google PageSpeed scores thanks to DOM tree optimization and dynamic bundle splitters.", className: "text-sm text-zinc-500 leading-relaxed" }, children: [] }
                     ]
                  }
               ]
            }
         ]
       }
    ]
  }
];

export const PORTFOLIO_STARTER_PRESET: CanvasNode[] = [
  {
    id: "root",
    type: "Root",
    props: { className: "flex flex-col min-h-screen w-full bg-[#000000] text-white font-sans" },
    children: [
       {
         id: "p_hero",
         type: "Section",
         props: { className: "flex-1 py-32 px-6 flex flex-col items-start justify-center max-w-7xl mx-auto w-full" },
         children: [
            { id: "p_sub", type: "Subheading", props: { text: "Software Developer // Designer", className: "text-sm text-zinc-500 font-mono tracking-widest mb-4 border-l-2 border-[#f97316] pl-3" }, children: [] },
            { id: "p_head", type: "Heading", props: { text: "Creating Next-Gen Digital Modules.", className: "text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter max-w-4xl mb-6 leading-[0.9]" }, children: [] },
            { id: "p_txt", type: "Text", props: { text: "Helping brands and startups break standard frames based on fluid and animated edge visuals without slowing down TTFB.", className: "text-base text-zinc-400 max-w-xl mb-8" }, children: [] },
            { id: "p_btn", type: "Button", props: { label: "Porozmawiajmy", className: "bg-white text-black font-bold uppercase tracking-widest px-8 py-3 rounded-none hover:bg-[#f97316] transition-colors" }, children: [] }
         ]
       }
    ]
  }
];
