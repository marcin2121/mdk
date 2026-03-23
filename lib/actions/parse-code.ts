"use server";

import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import { CanvasNode, ComponentType } from "../types/builder";

/**
 * Mapuje tagi HTML na typy klocków w MDK Builder
 */
const mapTagToType = (tag: string, className = ""): ComponentType => {
  const t = tag.toLowerCase();
  if (t === "section") return "Section";
  if (t === "h1" || t === "h2") return "Heading";
  if (t === "h3" || t === "h4" || t === "h5") return "Subheading";
  if (t === "p" || t === "span") return "Text";
  if (t === "button" || t === "a") return "Button";
  if (t === "img") return "Image";
  
  if (t === "div") {
     if (className.includes("grid")) return "Grid2"; // domyślny Grid
     return "Column";
  }
  return "Column"; // fallback
};

/**
 * Rekurencyjnie mapuje Node AST JSXElement na CanvasNode
 */
const mapJsxNodeToCanvasNode = (jsxNode: any): CanvasNode => {
  const tagName = jsxNode.openingElement.name.name;
  const props: Record<string, any> = {};
  
  // 1. Ekstrakcja właściwości (Attributes)
  jsxNode.openingElement.attributes.forEach((attr: any) => {
     if (attr.type === "JSXAttribute") {
        const name = attr.name.name;
        const valueNode = attr.value;
        
        if (valueNode) {
           if (valueNode.type === "StringLiteral") {
              // W mapowaniu class -> className
              const propName = name === "class" ? "className" : name;
              props[propName] = valueNode.value;
           } else if (valueNode.type === "JSXExpressionContainer") {
              // dla obiektów np style={{ ... }}
              if (valueNode.expression.type === "ObjectExpression") {
                 // Uproszczone wyciągniecie style
                 props[name] = {}; // mockup dla uproszczenia
              }
           }
        }
     }
  });

  const className = props.className || "";
  const type = mapTagToType(tagName, className);

  // 2. Ekstrakcja dzieci (Children)
  const children: CanvasNode[] = [];
  let textContent = "";

  if (jsxNode.children && jsxNode.children.length > 0) {
     jsxNode.children.forEach((child: any) => {
        if (child.type === "JSXElement") {
           children.push(mapJsxNodeToCanvasNode(child));
        } else if (child.type === "JSXText") {
           textContent += child.value.trim();
        } else if (child.type === "JSXExpressionContainer") {
           if (child.expression.type === "StringLiteral") {
              textContent += child.expression.value;
           }
        }
     });
  }

  if (textContent) {
     if (type === "Button") props.label = textContent;
     else props.text = textContent;
  }

  return {
     id: `imported_${Math.random().toString(36).substr(2, 9)}`,
     type,
     props,
     children: ["Section", "Column", "Root", "Grid2", "Grid3", "Card"].includes(type) ? children : []
  };
};

export async function parseCodeToNodes(code: string): Promise<{ success: boolean; nodes?: CanvasNode[]; error?: string }> {
  try {
     if (!code || !code.trim()) throw new Error("Kod jest pusty");

     // Opatrujemy w <main> jeśli to zbiór tagów, żeby parser miał jeden Root
     let codeToParse = code.trim();
     if (!codeToParse.startsWith("<") && !codeToParse.startsWith("import")) {
         throw new Error("Wklejony kod nie wygląda na element JSX/HTML");
     }

     if (!codeToParse.startsWith("<")) {
         // Możliwe że funkcja np export default...
         // Szukamy return ( ... )
         const returnMatch = codeToParse.match(/return\s*\(\s*(<[\s\S]*?>)\s*\)/);
         if (returnMatch) {
             codeToParse = returnMatch[1];
         } else {
             throw new Error("Nie znaleziono bloku 'return ( <JSX> )' w podanym kodzie.");
         }
     }

     // Opatrzenie w wrap <main> na wszelki wypadek (obsługa wielu sąsiadów)
     const wrappedCode = `<main>\n${codeToParse}\n</main>`;

     const ast = parse(wrappedCode, {
        sourceType: "module",
        plugins: ["jsx"]
     });

     const resultNodes: CanvasNode[] = [];

     traverse(ast, {
        JSXElement(path: any) {
            // bierzemy tylko najwyższy wrapper <main> który dodaliśmy
            if (path.node.openingElement.name.name === "main" && resultNodes.length === 0) {
                // Mapujemy dzieci tego wrappera
                path.node.children.forEach((child: any) => {
                    if (child.type === "JSXElement") {
                        resultNodes.push(mapJsxNodeToCanvasNode(child));
                    }
                });
            }
        }
     });

     if (resultNodes.length === 0) {
        throw new Error("Nie udało się sparsować żadnego elementu JSXElement");
     }

     // Zawsze zwracamy Root na samej górze tablicy jak wymaga Canvas
     const root: CanvasNode = {
        id: "root",
        type: "Root",
        props: {
           className: "flex flex-col min-h-[500px] w-full items-center p-4 gap-4 bg-[#0A0A0A] border border-dashed border-zinc-800 rounded-lg"
        },
        children: resultNodes
     };

     return { success: true, nodes: [root] };

  } catch (error: any) {
     console.error("Parse Error:", error);
     return { success: false, error: error.message };
  }
}
