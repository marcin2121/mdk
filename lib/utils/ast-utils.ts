import { Project, SourceFile, SyntaxKind, JsxElement, JsxSelfClosingElement } from "ts-morph";

/**
 * Adds a named import to a source file if it doesn't already exist.
 */
export function addImport(sourceFile: SourceFile, moduleSpecifier: string, namedImports: string[]) {
  const existingImport = sourceFile.getImportDeclaration(moduleSpecifier);
  if (existingImport) {
    const existingNamedImports = existingImport.getNamedImports().map(ni => ni.getName());
    for (const name of namedImports) {
      if (!existingNamedImports.includes(name)) {
        existingImport.addNamedImport(name);
      }
    }
  } else {
    sourceFile.addImportDeclaration({
      moduleSpecifier,
      namedImports: namedImports.map(name => ({ name })),
    });
  }
}

/**
 * Injects a component into the <main> tag of a JSX structure.
 */
export function injectComponentIntoMain(sourceFile: SourceFile, componentName: string, props: Record<string, string> = {}) {
  const mainTag = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)
    .find(node => {
        const opening = node.getOpeningElement();
        return opening.getTagNameNode().getText() === "main";
    });

  if (mainTag) {
    const propsString = Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(" ");
    
    const componentTag = `<${componentName} ${propsString}/>`;
    // Find the end tag </main> and insert before it
    const closingElement = mainTag.getClosingElement();
    if (closingElement) {
        sourceFile.insertText(closingElement.getStart(), `\n        ${componentTag}\n      `);
    } else {
        // Fallback if it's somehow not a JsxElement with closing tag (unlikely for <main>)
        mainTag.replaceWithText(`${mainTag.getText().slice(0, -7)}${componentTag}\n      </main>`);
    }
  }
}

/**
 * Updates or adds a variable in a Tailwind CSS file or style block.
 * (Simple implementation for now)
 */
export function updateMdkPrimaryColor(sourceFile: SourceFile, color: string) {
    // This is more for CSS files, but if we have a TS file with styles we can use this.
    // For MDK we usually inject into globals.css which is handled by fs for now or a specialized CSS parser.
    // But we can use ts-morph for layout.tsx modifications.
}

/**
 * Finds a specific JSX element and updates its attribute.
 */
export function updateJsxAttribute(sourceFile: SourceFile, tagName: string, attrName: string, newValue: string) {
    const elements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
        .filter(node => node.getTagNameNode().getText() === tagName);
    
    for (const el of elements) {
        const attr = el.getAttribute(attrName);
        if (attr) {
            attr.remove();
        }
        el.addAttribute({ name: attrName, initializer: `"${newValue}"` });
    }
}
