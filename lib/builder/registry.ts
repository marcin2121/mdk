export interface BlockDefinition {
  type: string;
  name: string;
  category: "layout" | "content" | "advanced";
  defaultProps: Record<string, string>;
}

export const BUILDER_REGISTRY: Record<string, BlockDefinition> = {
  Section: {
    type: "Section",
    name: "Section (Full Width)",
    category: "layout",
    defaultProps: {
      className: "w-full py-12 px-6 flex flex-col items-center bg-[#050505]"
    }
  },
  Column: {
    type: "Column",
    name: "Column",
    category: "layout",
    defaultProps: {
      className: "flex flex-col flex-1 gap-4 p-4 border border-zinc-800"
    }
  },
  Grid2: {
    type: "Grid2",
    name: "2 Columns",
    category: "layout",
    defaultProps: {
      className: "w-full flex flex-col md:flex-row gap-6 py-8"
    }
  },
  Grid3: {
    type: "Grid3",
    name: "3 Columns",
    category: "layout",
    defaultProps: {
      className: "w-full flex flex-col md:flex-row gap-4 py-8"
    }
  },
  Heading: {
    type: "Heading",
    name: "Heading",
    category: "content",
    defaultProps: {
      text: "Main Heading",
      className: "text-4xl font-black text-white uppercase tracking-tighter mb-4"
    }
  },
  Subheading: {
    type: "Subheading",
    name: "Subheading",
    category: "content",
    defaultProps: {
      text: "Short subtitle or context description",
      className: "text-lg font-medium text-[#f97316] tracking-wide mb-2"
    }
  },
  Text: {
    type: "Text",
    name: "Paragraph Text",
    category: "content",
    defaultProps: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      className: "text-zinc-400 text-sm leading-relaxed max-w-2xl"
    }
  },
  Button: {
    type: "Button",
    name: "Button",
    category: "content",
    defaultProps: {
      label: "Click here",
      link: "#",
      className: "px-6 py-3 bg-[#f97316] text-black font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
    }
  },
  Card: {
    type: "Card",
    name: "Card / Box",
    category: "content",
    defaultProps: {
      className: "p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors flex flex-col gap-3"
    }
  },
  Divider: {
    type: "Divider",
    name: "Divider",
    category: "content",
    defaultProps: {
      className: "w-full h-px bg-zinc-800 my-4"
    }
  },
  Loop: {
    type: "Loop",
    name: "Loop",
    category: "advanced",
    defaultProps: {
      listKey: "items",
      mockData: JSON.stringify([
         { title: "Example Item 1", desc: "Item Description 1" },
         { title: "Example Item 2", desc: "Item Description 2" }
      ]),
      className: "flex flex-col gap-4 w-full p-4 border border-dashed border-zinc-700 bg-zinc-900/20 rounded-lg min-h-[100px]"
    }
  },
  Image: {
    type: "Image",
    name: "Image",
    category: "content",
    defaultProps: {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600",
      alt: "Preview",
      className: "w-full aspect-video object-cover rounded-xl"
    }
  },
  Icon: {
    type: "Icon",
    name: "Icon",
    category: "content",
    defaultProps: {
      name: "Heart",
      className: "w-6 h-6 text-[#f97316]"
    }
  }
};
