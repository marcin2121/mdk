import { create } from 'zustand';
import { CanvasNode } from '../types/builder';

export interface BuilderStore {
  nodes: CanvasNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;

  past: CanvasNode[][];
  future: CanvasNode[][];

  builderMode: "page" | "component";
  variables: Record<string, { type: "string" | "number"; default: string }>;

  setBuilderMode: (mode: "page" | "component") => void;
  addVariable: (name: string, type: "string" | "number", defaultValue: string) => void;
  removeVariable: (name: string) => void;
  updateNodeBinding: (id: string, key: string, variableName: string | null) => void;

  setNodes: (nodes: CanvasNode[]) => void;
  addNode: (node: CanvasNode, parentId?: string, index?: number) => void;
  removeNode: (id: string) => void;
  updateNodeProps: (id: string, props: Partial<CanvasNode['props']>) => void;
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  moveNode: (activeId: string, overId: string, isOverContainer: boolean) => void;
  insertNodeAdjacent: (node: CanvasNode, siblingId: string) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export const useBuilderStore = create<BuilderStore>((set) => ({
  nodes: [
    {
      id: "root",
      type: "Root",
      props: {
        className: "flex flex-col min-h-[500px] w-full items-center p-4 gap-4 bg-[#0A0A0A] border border-dashed border-zinc-800 rounded-lg"
      },
      children: []
    }
  ],
  selectedNodeId: null,
  hoveredNodeId: null,
  past: [],
  future: [],
  builderMode: "page",
  variables: {},

  setNodes: (nodes) => set((state) => ({ 
     past: [...state.past.slice(-49), structuredClone(state.nodes)],
     future: [],
     nodes 
  })),

  addNode: (node, parentId = "root", index) => set((state) => {
    const newNodes = structuredClone(state.nodes);

    const insertIntoChildren = (children: CanvasNode[]) => {
      for (const child of children) {
        if (child.id === parentId) {
          if (index !== undefined) {
             child.children.splice(index, 0, node);
          } else {
             child.children.push(node);
          }
          return true;
        }
        if (child.children && child.children.length > 0) {
           if (insertIntoChildren(child.children)) return true;
        }
      }
      return false;
    };

    insertIntoChildren(newNodes);
    return { 
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      future: [],
      nodes: newNodes 
    };
  }),

  removeNode: (id) => set((state) => {
    if (id === "root") return state; 
    const newNodes = structuredClone(state.nodes);

    const removeFromChildren = (children: CanvasNode[]) => {
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === id) {
          children.splice(i, 1);
          return true;
        }
        if (children[i].children && children[i].children.length > 0) {
           if (removeFromChildren(children[i].children)) return true;
        }
      }
      return false;
    };

    removeFromChildren(newNodes);
    
    return { 
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      future: [],
      nodes: newNodes, 
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId 
    };
  }),

  updateNodeProps: (id, props: Partial<CanvasNode['props']>) => set((state) => {
    const newNodes = structuredClone(state.nodes);

    const updateInChildren = (children: CanvasNode[]) => {
      for (const child of children) {
        if (child.id === id) {
          child.props = { ...child.props, ...props };
          return true;
        }
        if (child.children && child.children.length > 0) {
           if (updateInChildren(child.children)) return true;
        }
      }
      return false;
    };

    updateInChildren(newNodes);
    return { 
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      future: [],
      nodes: newNodes 
    };
  }),

  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),
  
  insertNodeAdjacent: (node, siblingId) => set((state) => {
    const newNodes = structuredClone(state.nodes);
    
    const insertAdj = (children: CanvasNode[]) => {
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === siblingId) {
          children.splice(i + 1, 0, node); 
          return true;
        }
        if (children[i].children && children[i].children.length > 0) {
          if (insertAdj(children[i].children)) return true;
        }
      }
      return false;
    };
    
    insertAdj(newNodes);
    return { 
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      future: [],
      nodes: newNodes 
    };
  }),

  moveNode: (activeId, overId, isOverContainer) => set((state) => {
    if (activeId === overId) return state;

    const newNodes = structuredClone(state.nodes);
    let activeNodeTemp: CanvasNode | null = null;
    let removeSuccess = false;

    const extractNode = (children: CanvasNode[]) => {
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === activeId) {
          activeNodeTemp = children.splice(i, 1)[0];
          return true;
        }
        if (children[i].children && children[i].children.length > 0) {
          if (extractNode(children[i].children)) return true;
        }
      }
      return false;
    };
    removeSuccess = extractNode(newNodes);
    
    if (!removeSuccess || !activeNodeTemp) return state;

    const insertNode = (children: CanvasNode[]) => {
      for (let i = 0; i < children.length; i++) {
        if (children[i].id === overId) {
          if (isOverContainer) {
             children[i].children.push(activeNodeTemp!);
          } else {
             children.splice(i + 1, 0, activeNodeTemp!);
          }
          return true;
        }
        if (children[i].children && children[i].children.length > 0) {
          if (insertNode(children[i].children)) return true;
        }
      }
      return false;
    };

    const inserted = insertNode(newNodes);
    if (!inserted && overId === "root") {
       newNodes[0].children.push(activeNodeTemp);
    }

    return { 
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      future: [],
      nodes: newNodes 
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    
    return {
      past: newPast,
      nodes: previous,
      future: [structuredClone(state.nodes), ...state.future],
      selectedNodeId: null
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    return {
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      nodes: next,
      future: newFuture,
      selectedNodeId: null
    };
  }),
  
  clearCanvas: () => set((state) => ({ 
      past: [...state.past.slice(-49), structuredClone(state.nodes)],
      future: [],
      nodes: [{ 
        id: "root", 
        type: "Root", 
        props: {
          className: "flex flex-col min-h-[500px] w-full items-center p-4 gap-4 bg-[#0A0A0A] border border-dashed border-zinc-800 rounded-lg"
        }, 
        children: [] 
      }], 
      selectedNodeId: null,
      hoveredNodeId: null
  })),

  setBuilderMode: (mode) => set({ builderMode: mode }),

  addVariable: (name, type, defaultValue) => set((state) => ({
      variables: { ...state.variables, [name]: { type, default: defaultValue } }
  })),

  removeVariable: (name) => set((state) => {
      const newVars = { ...state.variables };
      delete newVars[name];
      return { variables: newVars };
  }),

  updateNodeBinding: (id, key, variableName) => set((state) => {
      const newNodes = structuredClone(state.nodes);

      const updateBinding = (children: CanvasNode[]) => {
         for (const child of children) {
            if (child.id === id) {
               if (!child.bindings) child.bindings = {};
               if (variableName) {
                  child.bindings[key] = variableName;
               } else {
                  delete child.bindings[key];
               }
               return true;
            }
            if (child.children && child.children.length > 0) {
               if (updateBinding(child.children)) return true;
            }
         }
         return false;
      };

      updateBinding(newNodes);
      return { past: [...state.past.slice(-49), structuredClone(state.nodes)], future: [], nodes: newNodes };
  })
}));
