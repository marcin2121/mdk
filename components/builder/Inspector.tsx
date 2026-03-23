"use client";

import { useBuilderStore } from "@/lib/store/builder-store";
import { CanvasNode } from "@/lib/types/builder";
import { Trash2, Palette, Type } from "lucide-react";

export default function Inspector() {
  const { nodes, selectedNodeId, updateNodeProps, removeNode, builderMode, variables, updateNodeBinding } = useBuilderStore();

  const activeNode = useBuilderStore((s) => {
     const findNode = (list: CanvasNode[], id: string): CanvasNode | null => {
        for (const n of list) {
           if (n.id === id) return n;
           if (n.children && n.children.length > 0) {
              const found = findNode(n.children, id);
              if (found) return found;
           }
        }
        return null;
     };
     return s.selectedNodeId ? findNode(s.nodes, s.selectedNodeId) : null;
  });
  
  const STYLE_PRESETS: Record<string, string> = {
    glass: "backdrop-blur-md bg-white/10 border border-white/20 shadow-xl",
    neon: "bg-black border border-[#f97316]/20 shadow-[0_0_20px_rgba(249,115,22,0.2)]",
    neoPop: "bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all text-black",
    clay: "bg-white rounded-2xl shadow-[inset_0_-8px_8px_rgba(0,0,0,0.1),_0_20px_20px_rgba(0,0,0,0.08)] text-black"
  };

  const applyStylePreset = (node: CanvasNode, presetKey: string) => {
     let classes = (node.props.className || "").split(" ").filter(Boolean);
     const allPresetClasses = Object.values(STYLE_PRESETS).flatMap((p: string) => p.split(" "));
     classes = classes.filter((cls: string) => !allPresetClasses.includes(cls));
     if (presetKey && STYLE_PRESETS[presetKey]) {
         classes.push(...STYLE_PRESETS[presetKey].split(" "));
     }
     updateNodeProps(node.id, { className: classes.join(" ").trim() });
  };



  if (!selectedNodeId) {
     return (
        <div className="flex flex-col items-center justify-center p-10 text-center text-zinc-600 h-full font-mono text-xs leading-relaxed select-none">
           Zaznacz węzeł na<br/>głównej makiecie Canvas,<br/>aby dostroić jego parametry.
        </div>
     );
  }

  if (!activeNode) return null;

    const propKeys = Object.keys(activeNode.props).filter(k => k !== 'style'); // Odfiltruj obiekt style z ogólnej pętli
  const currentStyle = activeNode.props.style || {};

  const handleStyleChange = (key: string, value: string) => {
      updateNodeProps(activeNode.id, { 
          style: { ...currentStyle, [key]: value } 
      });
  };

  const toggleTailwindClass = (category: string, removePrefixes: string[], addClass: string) => {
       const className = activeNode.props.className ?? "";
       let classes = className.split(" ").filter(Boolean);

      // Usunięcie kolidujących klas na bazie prefiksów
      classes = classes.filter((c: string) => {
         return !removePrefixes.some(prefix => c === prefix || c.startsWith(prefix + "-") || c.startsWith(prefix));
      });

      if (addClass) {
         classes.push(...addClass.split(" "));
      }

      updateNodeProps(activeNode.id, { className: classes.join(" ") });
  };

  return (
    <div className="flex-1 p-6 relative flex flex-col h-full bg-[#050505]">
       
       {/* Panel Nagłówkowy Inspektoratu */}
       <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
           <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-[#f97316]">Active Node</p>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">{activeNode.type}</h2>
              <span className="text-zinc-600 font-mono text-[9px] break-all">{activeNode.id}</span>
           </div>
           {activeNode.id !== "root" && (
              <button onClick={() => removeNode(activeNode.id)} className="w-10 h-10 border border-red-900/50 bg-red-950/20 text-red-500 rounded flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 size={16} />
              </button>
           )}
       </div>

       <div className="flex-1 overflow-y-auto w-full space-y-8 pr-2">

           {/* --- SEKCJA 1: QUICK DESIGN (KOLORY) --- */}
           <div className="space-y-4 bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
               <h3 className="text-[10px] font-black text-white tracking-widest uppercase mb-4 flex items-center gap-2">
                 <Palette size={14} className="text-[#f97316]"/> Szybki Design
               </h3>
               
               <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1"><Palette size={10}/> Tło (Background)</label>
                      <div className="flex items-center gap-2 border border-zinc-800 bg-black p-1 rounded-md focus-within:border-[#f97316] transition-colors">
                          <input 
                             type="color" 
                             value={currentStyle.backgroundColor || "#000000"} 
                             onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                             className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input 
                             type="text" 
                             value={currentStyle.backgroundColor || ""} 
                             placeholder="np. #ff0000"
                             onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
                             className="w-full bg-transparent text-white font-mono text-xs outline-none"
                          />
                      </div>
                  </div>
               </div>

               <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="flex-1 space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase flex items-center gap-1"><Type size={10}/> Tekst (Font Color)</label>
                      <div className="flex items-center gap-2 border border-zinc-800 bg-black p-1 rounded-md focus-within:border-[#f97316] transition-colors">
                          <input 
                             type="color" 
                             value={currentStyle.color || "#ffffff"} 
                             onChange={(e) => handleStyleChange("color", e.target.value)}
                             className="w-8 h-8 rounded shrink-0 cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <input 
                             type="text" 
                             value={currentStyle.color || ""} 
                             placeholder="np. #ffffff"
                             onChange={(e) => handleStyleChange("color", e.target.value)}
                             className="w-full bg-transparent text-white font-mono text-xs outline-none"
                          />
                      </div>
                  </div>
               </div>
           </div>

            {/* --- SEKCJA 1C: NOWOCZESNE PRESETY STYLÓW --- */}
           <div className="space-y-4 bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
               <h3 className="text-[10px] font-black text-white tracking-widest uppercase mb-2 flex items-center gap-2">
                 <div className="w-2.5 h-2.5 bg-gradient-to-tr from-[#f97316] to-pink-500 rounded-full"></div> Efekty i Style (Presets)
               </h3>
               <div className="grid grid-cols-2 gap-2">
                   <button 
                      onClick={() => applyStylePreset(activeNode, "glass")}
                      className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/40 text-left rounded-md transition-all group"
                   >
                      <span className="text-[11px] font-bold text-white group-hover:text-[#f97316]">Glassmorphism</span>
                      <p className="text-[8px] text-zinc-500 mt-1">Szkliste tło & blur</p>
                   </button>
                   <button 
                      onClick={() => applyStylePreset(activeNode, "neon")}
                      className="p-3 bg-black border border-zinc-900 hover:border-[#f97316] text-left rounded-md transition-all group"
                   >
                      <span className="text-[11px] font-bold text-zinc-400 group-hover:text-white">Neon Glow</span>
                      <p className="text-[8px] text-zinc-600 mt-1">Poświaty i cienie</p>
                   </button>
                   <button 
                      onClick={() => applyStylePreset(activeNode, "clay")}
                      className="p-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-left rounded-md transition-all group"
                   >
                      <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white">Soft Clay</span>
                      <p className="text-[8px] text-zinc-600 mt-1">Wypukłe cienie</p>
                   </button>
                   <button 
                      onClick={() => applyStylePreset(activeNode, "neoPop")}
                      className="p-3 bg-yellow-400 border-2 border-black hover:bg-yellow-300 text-left rounded-md transition-all text-black group"
                   >
                      <span className="text-[11px] font-black uppercase">Neopop</span>
                      <p className="text-[8px] text-zinc-900/60 mt-1">Brutalizm & cienie</p>
                   </button>
               </div>
               <button 
                  onClick={() => applyStylePreset(activeNode, "")}
                  className="w-full text-center text-[9px] font-bold text-zinc-500 hover:text-white py-1 transition-colors border border-dashed border-zinc-800/50 rounded-sm mt-1"
               >
                  Zeruj Preset Stylu
               </button>
           </div>

           {/* --- SEKCJA 1B: SMART LAYOUT (TAILWIND TOGGLES) --- */}
            {["Section", "Column", "Root", "Grid2", "Grid3", "Card"].includes(activeNode.type) && (
              <div className="space-y-4 bg-zinc-900/40 border border-zinc-800 p-4 rounded-lg">
                  <h3 className="text-[10px] font-black text-white tracking-widest uppercase mb-2 flex items-center gap-2">
                    <Palette size={14} className="text-blue-500"/> Układ i Odstępy
                  </h3>

                  {/* FLEX / GRID TOGGLE */}
                  <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">Układ (Display)</label>
                      <div className="grid grid-cols-2 gap-1 bg-black p-1 rounded-md border border-zinc-800">
                          <button 
                             onClick={() => toggleTailwindClass("display", ["flex", "grid", "block"], "flex flex-col")}
                             className={`text-[10px] font-bold p-1.5 rounded transition-colors ${activeNode.props.className?.includes("flex") && activeNode.props.className?.includes("flex-col") ? "bg-[#f97316] text-black" : "text-zinc-500 hover:text-white"}`}
                          >
                             Flexbox
                          </button>
                          <button 
                             onClick={() => toggleTailwindClass("display", ["flex", "grid", "block"], "grid")}
                             className={`text-[10px] font-bold p-1.5 rounded transition-colors ${activeNode.props.className?.includes("grid") && !activeNode.props.className?.includes("flex") ? "bg-[#f97316] text-black" : "text-zinc-500 hover:text-white"}`}
                          >
                             Grid
                          </button>
                      </div>
                  </div>

                  {/* PADDING BUTTONS */}
                  <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">Padding (Odstępy wewn.)</label>
                      <div className="grid grid-cols-4 gap-1 bg-black p-1 rounded-md border border-zinc-800">
                          {["p-0", "p-2", "p-4", "p-8"].map(p => (
                            <button 
                               key={p}
                               onClick={() => toggleTailwindClass("padding", ["p-0", "p-1", "p-2", "p-3", "p-4", "p-6", "p-8", "p-12", "p-16"], p)}
                               className={`text-[10px] font-bold p-1.5 rounded transition-colors ${activeNode.props.className?.match(new RegExp(`\\b${p}\\b`)) ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                            >
                               {p.split('-')[1]}
                            </button>
                          ))}
                      </div>
                  </div>

                  {/* ALIGNMENT (CENTER ITEM) */}
                  <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase">Wyrównanie (Align)</label>
                      <button 
                          onClick={() => {
                             const hasCenter = activeNode.props.className?.includes("items-center");
                             if (hasCenter) {
                                toggleTailwindClass("align", ["items-center", "justify-center"], ""); // Toggle off
                             } else {
                                toggleTailwindClass("align", [], "items-center justify-center"); // Toggle on
                             }
                          }}
                          className={`w-full text-[10px] font-bold p-2 border rounded-md transition-colors ${
                              activeNode.props.className?.includes("items-center") 
                                 ? "bg-emerald-950/20 border-emerald-800 text-emerald-400" 
                                 : "border-zinc-800 text-zinc-500 hover:text-white"
                          }`}
                      >
                          Środek (Center Items)
                      </button>
                  </div>
              </div>
            )}

           {/* --- SEKCJA 2: ZAAWANSOWANE PROPSY (JSON) --- */}
           <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase mb-2">Parametry Systemowe (Props)</h3>
              {propKeys.map(key => {
                  const isBound = activeNode.bindings && activeNode.bindings[key];
                  
                  return (
                    <div key={key} className="flex flex-col gap-2 bg-zinc-950/50 p-3 rounded-md border border-zinc-900">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-zinc-400 tracking-widest uppercase">{key}</label>
                            
                            {/* POWIĄZANIE (BINDING) JEŚLI TRYB KOMPONENTU */}
                            {builderMode === "component" && key !== "className" && (
                                <div className="flex items-center gap-1">
                                    <label className="text-[8px] font-bold text-zinc-600 uppercase">Bind:</label>
                                    <select 
                                       value={isBound || ""}
                                       onChange={(e) => updateNodeBinding(activeNode.id, key, e.target.value === "" ? null : e.target.value)}
                                       className="bg-black border border-zinc-800 text-[10px] text-[#f97316] h-6 px-1 outline-none rounded-sm"
                                    >
                                        <option value="">Static</option>
                                        {Object.keys(variables).map(vName => (
                                          <option key={vName} value={vName}>{vName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {key === "className" ? (
                            <textarea 
                               rows={3}
                               value={activeNode.props[key]} 
                               onChange={(e) => updateNodeProps(activeNode.id, { [key]: e.target.value })}
                               className="w-full bg-black border border-zinc-800 text-white font-mono text-xs p-2 outline-none focus:border-[#f97316] resize-y rounded-sm"
                            />
                        ) : isBound ? (
                            <div className="w-full bg-zinc-900 border border-[#f97316]/30 text-[#f97316] font-mono text-xs h-8 flex items-center px-3 rounded-sm">
                                🔗 Bound to: <span className="font-bold ml-1">{isBound}</span>
                            </div>
                        ) : (
                            <input 
                               type="text" 
                               value={activeNode.props[key] || ""} 
                               onChange={(e) => updateNodeProps(activeNode.id, { [key]: e.target.value })}
                               className="w-full bg-black border border-zinc-800 text-white font-mono text-sm h-8 px-2 outline-none focus:border-[#f97316] rounded-sm"
                            />
                        )}
                    </div>
                  );
              })}
           </div>

       </div>
    </div>
  );
}
