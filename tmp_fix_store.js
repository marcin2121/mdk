const fs = require('fs');
const filePath = 'c:\\molendavdevelopment\\mdk\\lib\\store\\builder-store.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix past with slicing to limit history
const pastRegex = /past:\s*\[\s*\.\.\.state\.past\s*,\s*structuredClone\(state\.nodes\)\s*\]/g;
content = content.replace(pastRegex, 'past: [...state.past.slice(-49), structuredClone(state.nodes)]');

// 2. Fix updateNodeProps type on interface
content = content.replace(
  'updateNodeProps: (id: string, props: Record<string, any>) => void;',
  "updateNodeProps: (id: string, props: Partial<CanvasNode['props']>) => void;"
);

// 3. Fix updateNodeProps type on implementation
content = content.replace(
  'updateNodeProps: (id, props) => set((state) => {',
  "updateNodeProps: (id, props: Partial<CanvasNode['props']>) => set((state) => {"
);

// 4. Update updateNodeBinding to write to past
const bindingRegex = /updateNodeBinding: \(id, key, variableName\) => set\(\(state\) => \{([\s\S]*?)return \{ nodes: newNodes \};\s*\}\)/g;
if (bindingRegex.test(content)) {
    content = content.replace(bindingRegex, (match, code) => {
        return `updateNodeBinding: (id, key, variableName) => set((state) => {${code}return { past: [...state.past.slice(-49), structuredClone(state.nodes)], future: [], nodes: newNodes };\n  })`;
    });
} else {
    console.log("Binding Regex failed to match!");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Store refactored successfully!");
