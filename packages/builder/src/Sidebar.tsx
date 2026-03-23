"use client";

import { BUILDER_REGISTRY } from "@/lib/builder/registry";
import { CopyPlus } from "lucide-react";
import { DraggableSidebarItem } from "@/components/builder/DraggableSidebarItem";
import { useState } from "react";
import LayersPanel from "./LayersPanel";
import VariablesPanel from "./VariablesPanel";
import { useBuilderStore } from "@/lib/store/builder-store";

export default function Sidebar() {
  const blocks = Object.values(BUILDER_REGISTRY);
  const [activeTab, setActiveTab] = useState<"blocks" | "layers" | "variables">("blocks");
  const { builderMode } = useBuilderStore();
  
  return (
    <div className="flex-1 overflow-hidden flex flex-col h-full">
        
        {/* TABBAR */}
        <div className="flex border-b border-zinc-900 shrink-0">
           <button 
              onClick={() => setActiveTab("blocks")}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                 activeTab === "blocks" ? "border-[#f97316] text-white" : "border-transparent text-zinc-500 hover:text-white"
              }`}
           >
              Klocki
           </button>
           <button 
              onClick={() => setActiveTab("layers")}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                 activeTab === "layers" ? "border-[#f97316] text-white" : "border-transparent text-zinc-500 hover:text-white"
              }`}
           >
              Warstwy
           </button>
           {builderMode === "component" && (
             <button 
                onClick={() => setActiveTab("variables")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                   activeTab === "variables" ? "border-[#f97316] text-white" : "border-transparent text-zinc-500 hover:text-white"
                }`}
             >
                Zmienne
             </button>
           )}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto flex flex-col">
           {activeTab === "blocks" && (
             <div className="p-4 flex flex-col gap-6">
               <div>
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2">Layout & Grid</h3>
                 <div className="grid grid-cols-2 gap-2">
                    {blocks.filter(b => b.category === "layout").map(block => (
                       <DraggableSidebarItem 
                         key={block.type} 
                         block={block} 
                         className="flex flex-[1_1_0%] flex-col items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-md group"
                       >
                          <div className="w-8 h-8 mb-2 border-2 border-dashed border-zinc-600 group-hover:border-[#f97316]"></div>
                          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase drop-shadow">{block.name}</span>
                       </DraggableSidebarItem>
                    ))}
                 </div>
               </div>

               <div>
                 <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2">Typography & UI</h3>
                 <div className="grid grid-cols-2 gap-2">
                    {blocks.filter(b => b.category === "content").map(block => (
                       <DraggableSidebarItem 
                         key={block.type} 
                         block={block} 
                         className="flex flex-[1_1_0%] flex-col items-center justify-center p-4 bg-zinc-900 border border-zinc-800 rounded-md group relative overflow-hidden"
                       >
                          <CopyPlus size={20} className="mb-2 text-zinc-600 group-hover:text-[#f97316] drop-shadow-md" />
                          <span className="text-[10px] font-bold text-zinc-400 group-hover:text-white uppercase drop-shadow">{block.name}</span>
                       </DraggableSidebarItem>
                    ))}
                 </div>
               </div>
             </div>
           )}
           
           {activeTab === "layers" && (
             <div className="p-4 flex-1 flex flex-col">
                 <LayersPanel />
             </div>
           )}

           {activeTab === "variables" && builderMode === "component" && (
             <VariablesPanel />
           )}
        </div>

    </div>
  );
}
