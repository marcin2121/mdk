"use client";

import { useBuilderStore } from "@/lib/store/builder-store";
import { Plus, Trash2, Database } from "lucide-react";
import { useState } from "react";

export default function VariablesPanel() {
  const { variables, addVariable, removeVariable } = useBuilderStore();
  
  const [name, setName] = useState("");
  const [type, setType] = useState<"string" | "number">("string");
  const [defaultValue, setDefaultValue] = useState("");

  const handleAdd = (e: React.FormEvent) => {
     e.preventDefault();
     if (!name.trim()) return;

     // Sanitize special characters
     const safeName = name.replace(/[^a-zA-Z0-9_]/g, "");
     addVariable(safeName, type, defaultValue);

     setName("");
     setDefaultValue("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505]/50">
        
        {/* ADD FORM */}
        <form onSubmit={handleAdd} className="p-4 border-b border-zinc-900 bg-zinc-900/10 space-y-3">
             <h4 className="text-[10px] font-black text-white tracking-widest uppercase mb-2 flex items-center gap-1">
                 <Plus size={12} className="text-[#f97316]"/> Add Prop / Variable
             </h4>

             <div className="space-y-1">
                 <label className="text-[9px] font-bold text-zinc-500 uppercase">Name (camelCase)</label>
                 <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. title, count"
                    className="w-full bg-black border border-zinc-800 text-white font-mono text-xs h-8 px-2 outline-none focus:border-[#f97316] rounded-sm"
                 />
             </div>

             <div className="grid grid-cols-2 gap-2">
                 <div className="space-y-1">
                     <label className="text-[9px] font-bold text-zinc-500 uppercase">Type</label>
                     <select 
                        value={type}
                        onChange={(e) => setType(e.target.value as "string" | "number")}
                        className="w-full bg-black border border-zinc-800 text-white text-xs h-8 px-1 outline-none focus:border-[#f97316] rounded-sm"
                     >
                         <option value="string">String</option>
                         <option value="number">Number</option>
                     </select>
                 </div>
                 <div className="space-y-1">
                     <label className="text-[9px] font-bold text-zinc-500 uppercase">Default Value</label>
                     <input 
                        type="text"
                        value={defaultValue}
                        onChange={(e) => setDefaultValue(e.target.value)}
                        placeholder="e.g. Hello"
                        className="w-full bg-black border border-zinc-800 text-white text-xs h-8 px-2 outline-none focus:border-[#f97316] rounded-sm"
                     />
                 </div>
             </div>

             <button type="submit" className="w-full bg-[#f97316] hover:bg-white text-black font-bold uppercase tracking-widest text-[10px] py-2 rounded-md transition-colors flex items-center justify-center gap-1 shadow-lg mt-2">
                 <Plus size={12} /> Add Variable
             </button>
        </form>

        {/* VARIABLES LIST */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
             <h4 className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-3 flex items-center gap-1">
                 <Database size={12}/> Active Props
             </h4>

             {Object.keys(variables).length === 0 ? (
                <div className="text-center text-zinc-600 text-[10px] py-10 font-mono">
                    No variables defined.<br/>Add a variable above.
                </div>
             ) : (
                Object.entries(variables).map(([vName, vData]) => (
                   <div key={vName} className="flex items-center justify-between p-2 bg-zinc-900 border border-zinc-800 rounded-md group">
                       <div>
                           <span className="text-xs font-bold text-white font-mono">{vName}</span>
                           <span className="text-[9px] text-zinc-500 ml-2">({vData.type})</span>
                           {vData.default && (
                             <p className="text-[9px] text-zinc-600 truncate max-w-[140px]">Default: "{vData.default}"</p>
                           )}
                       </div>
                       <button 
                          onClick={() => removeVariable(vName)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-600 hover:text-red-500 transition-colors"
                       >
                          <Trash2 size={12} />
                       </button>
                   </div>
                ))
             )}
        </div>

    </div>
  );
}
