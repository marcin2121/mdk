"use client";

import { useDraggable } from "@dnd-kit/core";

export function DraggableSidebarItem({ block, children, className }: any) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${block.type}`,
    data: {
      isNew: true,
      type: block.type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${className} ${isDragging ? "opacity-50 grayscale scale-95" : "hover:border-[#f97316]"} transition-all cursor-grab active:cursor-grabbing`}
    >
      {children}
    </div>
  );
}
