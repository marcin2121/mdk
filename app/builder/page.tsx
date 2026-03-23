"use client";

import Sidebar from "@/components/builder/Sidebar";
import Workspace from "@/components/builder/Workspace";
import Inspector from "@/components/builder/Inspector";
import { Monitor, Smartphone, Tablet, Undo, Redo } from "lucide-react";
import { DndContext, DragEndEvent, pointerWithin, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useBuilderStore } from "@/lib/store/builder-store";
import { BUILDER_REGISTRY } from "@/lib/builder/registry";

import { publishBuilderCode } from "@/lib/actions/publish-builder";
import { parseCodeToNodes } from "@/lib/actions/parse-code";
import { useState } from "react";

import { SAAS_STARTER_PRESET, PORTFOLIO_STARTER_PRESET } from "@/lib/builder/presets";

export default function BuilderPage() {
  const { addNode, moveNode, nodes, setNodes, clearCanvas, undo, redo, past, future, builderMode, setBuilderMode, variables } = useBuilderStore();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importCode, setImportCode] = useState("");
  const [importError, setImportError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
         distance: 8, // 8px minimalnego przesunięcia przed rozpoczęciem Drag klocka
      },
    })
  );

  const handleImport = async () => {
     setImportError("");
     const res = await parseCodeToNodes(importCode);
     if (res.success && res.nodes) {
        setNodes(res.nodes);
        setIsImportModalOpen(false);
        setImportCode("");
     } else {
        setImportError(res.error || "Wystąpił błąd parsowania kodu.");
     }
  };

  const handlePublish = async () => {
     setIsPublishing(true);
     const res = await publishBuilderCode(nodes, builderMode, variables);
     if (res.success) {
        alert("Kod opublikowany! Przejdź do strony głównej (/) żeby zobaczyć efekt.");
     } else {
        alert("Wystąpił błąd publikacji.");
     }
     setIsPublishing(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.isNew) {
       const type = active.data.current.type as string;
       const blockDef = BUILDER_REGISTRY[type];
       if (!blockDef) return;

       const newNode = {
           id: `${type}_${Date.now().toString()}`,
           type: type as import('../../lib/types/builder').ComponentType,
           props: { ...blockDef.defaultProps },
           children: []
       };

       if (over.data.current?.acceptsDropping) {
          addNode(newNode, over.id as string);
       } else {
          const insertNodeAdjacent = useBuilderStore.getState().insertNodeAdjacent;
          insertNodeAdjacent(newNode, over.id as string);
       }
    } else {
       if (active.id !== over.id) {
          moveNode(active.id as string, over.id as string, over.data.current?.acceptsDropping || false);
       }
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={pointerWithin}>
      <div className="flex h-screen w-full bg-black text-white overflow-hidden selection:bg-[#f97316] font-sans">
        
        <div className="w-80 shrink-0 border-r border-zinc-900 bg-[#050505] flex flex-col z-20 shadow-2xl">
           <div className="h-14 border-b border-zinc-900 flex items-center px-6">
              <span className="font-black text-xl uppercase tracking-widest text-white">MDK <span className="text-[#f97316]">BUILDER</span></span>
           </div>
           <Sidebar />
         </div>

         <div className="flex-1 flex flex-col bg-[#0A0A0A] relative shadow-inner">
            <div className="h-14 border-b border-zinc-900 flex items-center justify-between px-6 bg-black z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="flex bg-zinc-900 rounded-md p-1">
                        <button className="px-3 py-1 rounded bg-[#f97316] text-black"><Monitor size={14} /></button>
                        <button className="px-3 py-1 rounded text-zinc-500 hover:text-white"><Tablet size={14} /></button>
                        <button className="px-3 py-1 rounded text-zinc-500 hover:text-white"><Smartphone size={14} /></button>
                    </div>

                    <div className="h-6 w-px bg-zinc-800" />
                    <div className="flex bg-zinc-900 rounded-md p-1">
                        <button 
                           onClick={() => setBuilderMode("page")}
                           className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${builderMode === "page" ? "bg-white text-black" : "text-zinc-500 hover:text-white"}`}
                        >
                           Strona
                        </button>
                        <button 
                           onClick={() => setBuilderMode("component")}
                           className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${builderMode === "component" ? "bg-[#f97316] text-black" : "text-zinc-500 hover:text-white"}`}
                        >
                           Komponent
                        </button>
                    </div>

                    <div className="h-6 w-px bg-zinc-800" />
                    <div className="flex items-center gap-1 bg-zinc-900 rounded-md p-1">
                        <button 
                           onClick={undo}
                           disabled={past.length === 0}
                           className="px-2 py-1 rounded text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                           <Undo size={14} />
                        </button>
                        <button 
                           onClick={redo}
                           disabled={future.length === 0}
                           className="px-2 py-1 rounded text-zinc-500 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                           <Redo size={14} />
                        </button>
                    </div>

                    <div className="h-6 w-px bg-zinc-800" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Makiety:</span>
                        <button onClick={() => setNodes(structuredClone(SAAS_STARTER_PRESET))} className="text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold px-3 py-1 rounded transition-colors">SaaS</button>
                        <button onClick={() => setNodes(structuredClone(PORTFOLIO_STARTER_PRESET))} className="text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold px-3 py-1 rounded transition-colors">Portfolio</button>
                        <button onClick={clearCanvas} className="text-[10px] bg-red-950/20 border border-red-900/50 hover:bg-red-900 hover:text-white text-red-500 font-bold px-3 py-1 rounded transition-colors">Reset</button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setIsImportModalOpen(true)}
                        className="text-xs font-bold uppercase tracking-widest bg-emerald-950/20 border border-emerald-900/50 hover:border-emerald-500 hover:bg-emerald-950 px-4 py-1.5 transition-colors rounded-md text-emerald-400 flex items-center gap-1"
                    >
                        📋 Import
                    </button>

                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="text-xs font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 hover:border-[#f97316] px-4 py-1.5 transition-colors disabled:opacity-50"
                    >
                        {isPublishing ? "Generowanie..." : "Opublikuj Kod"}
                    </button>
                </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto bg-[#0a0a0a] p-12">
                    <div className="w-full max-w-5xl mx-auto shadow-2xl ring-1 ring-zinc-800 rounded-xl overflow-hidden min-h-[800px] bg-black">
                        <Workspace />
                    </div>
                </div>
            </div>
         </div>

         <div className="w-80 shrink-0 border-l border-zinc-900 bg-[#050505] flex flex-col z-20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="h-14 border-b border-zinc-900 flex items-center px-6">
               <span className="font-bold text-xs uppercase tracking-widest text-[#f97316]">Inspektor Zmiennosći</span>
            </div>
            <Inspector />
         </div>

       </div>

       {isImportModalOpen && (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000] flex items-center justify-center p-6 animate-fadeIn">
             <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                 <div className="p-5 border-b border-zinc-900 flex items-center justify-between">
                     <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                         <span className="text-emerald-400 text-lg">📋</span> Importuj Kod JSX / HTML
                     </h3>
                     <button onClick={() => setIsImportModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors text-xs uppercase font-bold">Zamknij</button>
                 </div>
                 <div className="flex-1 p-5 flex flex-col space-y-4 overflow-y-auto">
                     <p className="text-[11px] text-zinc-400 leading-relaxed">Wklej płaski kod JSX lub HTML. System przekształci go na klocki.</p>
                     <div className="flex-1 flex flex-col">
                         <textarea rows={12} value={importCode} onChange={(e) => setImportCode(e.target.value)} placeholder={`<div className="bg-red-500 p-4">\n  <h1 className="text-white">Hello World</h1>\n</div>`} className="w-full flex-1 bg-black border border-zinc-800 text-green-400 font-mono text-xs p-4 outline-none resize-none rounded-md" />
                     </div>
                     {importError && <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-md text-red-400 text-xs font-mono">⚠️ Błąd: {importError}</div>}
                 </div>
                 <div className="p-5 border-t border-zinc-900 flex items-center justify-end gap-3 bg-zinc-900/20">
                     <button onClick={() => setIsImportModalOpen(false)} className="text-xs font-bold text-zinc-400 hover:text-white px-4 py-2">Anuluj</button>
                     <button onClick={handleImport} className="text-xs font-bold uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-2 rounded-md transition-all shadow-lg">Importuj Klocki</button>
                 </div>
             </div>
         </div>
       )}

    </DndContext>
  );
}