"use client";

import { useBuilderStore } from "@/lib/store/builder-store";
import { CanvasNode } from "@/lib/types/builder";
import { ChevronRight, ChevronDown, Layers, Box, Type, MousePointer } from "lucide-react";
import { useState } from "react";

/**
 * Returns an icon matching the component type
 */
const getNodeIcon = (type: string) => {
  switch (type) {
    case "Root": return <Layers size={12} className="text-zinc-500" />;
    case "Section": return <Box size={12} className="text-emerald-500" />;
    case "Column": return <Box size={12} className="text-blue-500" />;
    case "Grid2": return <Box size={12} className="text-purple-500" />;
    case "Grid3": return <Box size={12} className="text-purple-500" />;
    case "Heading": case "Subheading": return <Type size={12} className="text-[#f97316]" />;
    case "Text": return <Type size={12} className="text-zinc-400" />;
    default: return <MousePointer size={12} className="text-zinc-600" />;
  }
};

interface TreeNodeProps {
  node: CanvasNode;
  depth: number;
}

const TreeNodeItem = ({ node, depth }: TreeNodeProps) => {
  const { selectedNodeId, selectNode } = useBuilderStore();
  const [isOpen, setIsOpen] = useState(true);
  
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  const handleSelect = (e: React.MouseEvent) => {
     e.stopPropagation();
     selectNode(node.id);
  };

  return (
    <div className="flex flex-col">
       <div 
          onClick={handleSelect}
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          className={`flex items-center gap-2 py-1.5 cursor-pointer border-l-2 transition-all ${
             isSelected 
                ? "border-[#f97316] bg-zinc-900/80 text-white font-bold" 
                : "border-transparent hover:bg-zinc-900 hover:text-zinc-200 text-zinc-400"
          }`}
       >
           {hasChildren ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} 
                className="w-4 h-4 flex items-center justify-center text-zinc-500 hover:text-white"
              >
                  {isOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
           ) : (
              <div className="w-4" />
           )}

           {getNodeIcon(node.type)}

           <span className="text-[10px] uppercase font-mono tracking-wider truncate">
               {node.props.text || node.props.label || node.type}
           </span>
       </div>

       {hasChildren && isOpen && (
          <div className="flex flex-col">
              {node.children.map(child => (
                 <TreeNodeItem key={child.id} node={child} depth={depth + 1} />
              ))}
          </div>
       )}
    </div>
  );
};

export default function LayersPanel() {
  const { nodes } = useBuilderStore();

  return (
    <div className="flex-1 overflow-y-auto w-full bg-[#050505]/50 flex flex-col py-2">
       {nodes.map(node => (
          <TreeNodeItem key={node.id} node={node} depth={0} />
       ))}
    </div>
  );
}
