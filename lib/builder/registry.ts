export interface BlockDefinition {
  type: string;
  name: string;
  category: "layout" | "content" | "advanced";
  defaultProps: Record<string, any>;
}

export const BUILDER_REGISTRY: Record<string, BlockDefinition> = {
  Section: {
    type: "Section",
    name: "Sekcja (Full Width)",
    category: "layout",
    defaultProps: {
      className: "w-full py-12 px-6 flex flex-col items-center bg-[#050505]"
    }
  },
  Column: {
    type: "Column",
    name: "Kolumna",
    category: "layout",
    defaultProps: {
      className: "flex flex-col flex-1 gap-4 p-4 border border-zinc-800"
    }
  },
  Grid2: {
    type: "Grid2",
    name: "2 Kolumny",
    category: "layout",
    defaultProps: {
      className: "w-full flex flex-col md:flex-row gap-6 py-8"
    }
  },
  Grid3: {
    type: "Grid3",
    name: "3 Kolumny",
    category: "layout",
    defaultProps: {
      className: "w-full flex flex-col md:flex-row gap-4 py-8"
    }
  },
  Heading: {
    type: "Heading",
    name: "Nagłówek",
    category: "content",
    defaultProps: {
      text: "Główny Nagłówek",
      className: "text-4xl font-black text-white uppercase tracking-tighter mb-4"
    }
  },
  Subheading: {
    type: "Subheading",
    name: "Podnagłówek",
    category: "content",
    defaultProps: {
      text: "Krótki podtytuł lub opis kontekstu",
      className: "text-lg font-medium text-[#f97316] tracking-wide mb-2"
    }
  },
  Text: {
    type: "Text",
    name: "Akapit Tekstu",
    category: "content",
    defaultProps: {
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      className: "text-zinc-400 text-sm leading-relaxed max-w-2xl"
    }
  },
  Button: {
    type: "Button",
    name: "Przycisk",
    category: "content",
    defaultProps: {
      label: "Kliknij tutaj",
      link: "#",
      className: "px-6 py-3 bg-[#f97316] text-black font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
    }
  },
  Card: {
    type: "Card",
    name: "Karta / Boks",
    category: "content",
    defaultProps: {
      className: "p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors flex flex-col gap-3"
    }
  },
  Divider: {
    type: "Divider",
    name: "Separator",
    category: "content",
    defaultProps: {
      className: "w-full h-px bg-zinc-800 my-4"
    }
  }
};
