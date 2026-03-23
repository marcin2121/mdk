"use server";

import fs from 'fs';
import path from 'path';
import { CanvasNode } from '../types/builder';

/**
 * Konwertuje camelCase (np backgroundColor) do Notacji CSS React (backgroundColor)
 */
const stringifyStyle = (styleObj: Record<string, any> | undefined) => {
   if (!styleObj || Object.keys(styleObj).length === 0) return "{}";
   return JSON.stringify(styleObj);
};

/**
 * Parser węzła rekursywnego - konwertuje format JSON obiektu na ciąg React TSX
 */
const renderNodeToJsx = (node: CanvasNode, builderMode: string): string => {
   const { type, props, children, bindings } = node;
   const classNameAttr = props.className ? ` className="${props.className.replace(/"/g, "'")}"` : "";
   const styleAttr = props.style ? ` style={${stringifyStyle(props.style)}}` : "";
   
   const childrenJsx = children && children.length > 0 
      ? children.map(child => renderNodeToJsx(child, builderMode)).join('\n')
      : "";

   let content = "";
   const getPropOrBind = (key: string, fallback: string) => {
       if (bindings && bindings[key] && builderMode === "component") {
          return `{${bindings[key]}}`;
       }
       return props[key] || fallback;
   };

   if (type === "Heading") content = getPropOrBind("text", "Heading");
   if (type === "Subheading") content = getPropOrBind("text", "Subheading");
   if (type === "Text") content = getPropOrBind("text", "Text");
   if (type === "Button") content = getPropOrBind("label", "Button");

   // Zapobieganie błędom w JSX jeśli content nie ma klamer (jest stringiem)
   const formatContent = (val: string) => val.startsWith("{") ? val : `"${val}"`;

   switch (type) {
      case "Root":
         return `<main${classNameAttr}${styleAttr}>\n${childrenJsx}\n</main>`;
      case "Section":
         return `<section${classNameAttr}${styleAttr}>\n${childrenJsx}\n</section>`;
      case "Column":
      case "Grid2":
      case "Grid3":
      case "Card":
         return `<div${classNameAttr}${styleAttr}>\n${childrenJsx}\n</div>`;
      case "Heading":
         return `<h2${classNameAttr}${styleAttr}>${content.startsWith("{") ? content : content}</h2>`;
      case "Subheading":
         return `<h3${classNameAttr}${styleAttr}>${content.startsWith("{") ? content : content}</h3>`;
      case "Text":
         return `<p${classNameAttr}${styleAttr}>${content.startsWith("{") ? content : content}</p>`;
      case "Button":
         return `<button${classNameAttr}${styleAttr}>${content.startsWith("{") ? content : content}</button>`;
      case "Divider":
         return `<div${classNameAttr}${styleAttr} />`;
      default:
         return `<div${classNameAttr}${styleAttr}>\n${childrenJsx}\n</div>`;
   }
};

export async function publishBuilderCode(
    nodes: CanvasNode[], 
    builderMode: "page" | "component" = "page", 
    variables: Record<string, { type: string, default: string }> = {}
) {
   try {
       if (!nodes || nodes.length === 0) throw new Error("Canvas is empty");

       const rootNode = nodes[0];
       const jsxContent = renderNodeToJsx(rootNode, builderMode);

       let fileContent = "";
       if (builderMode === "component") {
           const keys = Object.keys(variables);
           const propsArg = keys.length > 0 ? `{ ${keys.join(", ")} }` : "";
           const typesArg = keys.length > 0 ? `{ ${keys.map(k => `${k}: ${variables[k].type}`).join("; ")} }` : "any";

           fileContent = `"use client";\n\n// 🧩 Komponent Wygenerowany przez MDK Builder\n\nexport default function CustomComponent(${propsArg ? `${propsArg}: ${typesArg}` : ""}) {\n   return (\n      <>\n         ${jsxContent}\n      </>\n   );\n}\n`;
       } else {
           fileContent = `"use client";\n\n// ⚡ Strona Wygenerowana przez MDK Builder\n\nexport default function DynamicPage() {\n   return (\n      <>\n         ${jsxContent}\n      </>\n   );\n}\n`;
       }

       const targetPath = path.join(process.cwd(), 'app', '(public)', 'page.tsx');
       
       // Sprawdzamy, czy folder (public) na pewno gra
       const dirPath = path.join(process.cwd(), 'app', '(public)');
       if (!fs.existsSync(dirPath)) {
           fs.mkdirSync(dirPath, { recursive: true });
       }

       fs.writeFileSync(targetPath, fileContent, 'utf8');

       return { success: true, timestamp: Date.now() };

   } catch (error: any) {
       console.error("Publish Error:", error);
       return { success: false, error: error.message };
   }
}
