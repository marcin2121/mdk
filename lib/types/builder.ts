export type ComponentType = "Root" | "Section" | "Column" | "Grid2" | "Grid3" | "Card" | "Heading" | "Subheading" | "Text" | "Button" | "Image" | "Icon" | "Divider" | "Loop";

export interface CanvasNode {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  bindings?: Record<string, string>; // { text: "variableName" }
  children: CanvasNode[];
}

export interface CanvasState {
  nodes: CanvasNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
}

export const CONTAINER_TYPES = ["Section", "Column", "Root", "Grid2", "Grid3", "Card", "Loop"] as const;
