"use client";

import { useBuilderStore } from "@/lib/store/builder-store";
import { CanvasNode, CONTAINER_TYPES } from "@/lib/types/builder";
import { useDroppable, useDraggable } from "@dnd-kit/core";

interface CanvasNodeContainerProps {
  node: CanvasNode;
  children?: React.ReactNode;
  isSelected: boolean;
  onClick: (e: React.MouseEvent) => void;
  isContainer: boolean;
  depth: number;
  isStatic?: boolean;
}

const CanvasNodeContainer = ({ node, children, isSelected, onClick, isContainer, depth, isStatic }: CanvasNodeContainerProps) => {
  const { builderMode } = useBuilderStore();
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: node.id,
    data: { type: node.type, acceptsDropping: isContainer }
  });

  const { isOver, setNodeRef: setDropRef } = useDroppable({
     id: node.id,
     data: { type: node.type, acceptsDropping: isContainer }
  });

  const setNodeRefs = (el: any) => {
    setDropRef(el);
    if (node.id !== "root") {
      setDragRef(el); // Głównego rodzica Root nie przeciągamy
    }
  };

  const borderClass = isSelected ? "ring-2 ring-[#f97316] z-[60]" : "hover:ring-1 hover:ring-zinc-700 z-10 hover:z-50";
  const dropIndicator = isOver ? "ring-[3px] ring-emerald-500 bg-emerald-900/10 z-[70]" : "";
  const draggingClass = isDragging ? "opacity-30 grayscale z-[100] pointer-events-none" : "";

  const isTextual = !isContainer && (node.type === "Heading" || node.type === "Text" || node.type === "Button");

  const badgeVisibility = isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100";

  return (
    <div 
       ref={isStatic ? undefined : setNodeRefs}
       onClick={isStatic ? undefined : onClick}
       style={node.props.style}
       className={`${node.props.className || (isContainer ? "p-4 min-h-[50px] border border-dashed border-zinc-700 bg-zinc-900/20" : "p-2")} ${borderClass} ${dropIndicator} ${draggingClass} relative group transition-colors select-none`}
    >
       {!isStatic && node.type !== "Root" && (
          <div 
            {...listeners} 
            {...attributes}
            style={{ right: `${depth * 75}px` }}
            className={`absolute bottom-full bg-[#f97316] hover:bg-white transition-all text-black text-[9px] font-black px-2.5 py-1 ${badgeVisibility} uppercase z-[120] cursor-grab active:cursor-grabbing flex items-center gap-1 shadow-md rounded-t-md`}
          >
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse" /> {node.type}
          </div>
       )}
       {isTextual ? (
          node.bindings && (node.bindings.text || node.bindings.label) && builderMode === "component" ? (
             <span className="text-[#f97316] font-mono font-bold">{`{ ${node.bindings.text || node.bindings.label} }`}</span>
          ) : (
             node.props.text || node.props.label || `[Pusty ${node.type}]`
          )
       ) : children}
    </div>
  );
};

export default function BuilderWorkspace() {
  const { nodes, selectedNodeId, selectNode } = useBuilderStore();

  const renderNode = (node: CanvasNode, depth = 0, isStatic = false) => {
    const isSelected = selectedNodeId === node.id;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      selectNode(node.id);
    };

    const isContainer = (CONTAINER_TYPES as unknown as string[]).includes(node.type);

    return (
       <CanvasNodeContainer 
         key={node.id} 
         node={node} 
         isSelected={isSelected} 
         onClick={handleClick} 
         isContainer={isContainer}
         depth={depth}
         isStatic={isStatic}
       >
          {isContainer ? (
             node.children && node.children.length > 0 ? (
                <div className={`${node.type.startsWith("Grid") ? "grid grid-cols-1 " + (node.type === "Grid2" ? "md:grid-cols-2" : "md:grid-cols-3") + " gap-4 w-full" : "flex flex-col w-full"}`}>
                    {node.children.map(child => renderNode(child, depth + 1))}
                </div>
             ) : (
                <div className="w-full text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest py-8 font-mono select-none pointer-events-none">
                   [ Pusty {node.type} - Upuść bloki tutaj ]
                </div>
             )
          ) : node.type === "Divider" ? (
             <div className="w-full h-px bg-zinc-800 my-4" />
          ) : null}
       </CanvasNodeContainer>
    );
  };

  return (
    <div className="flex-1 bg-black p-4 w-full h-full overflow-y-auto overflow-x-hidden" onClick={() => selectNode(null)}>
       {nodes.map(node => renderNode(node))}
    </div>
  );
}
