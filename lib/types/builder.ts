export type ComponentType = "Root" | "Section" | "Column" | "Heading" | "Text" | "Button" | "Image" | "Spacer" | "Divider" | string;

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
