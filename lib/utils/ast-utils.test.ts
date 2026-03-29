import { describe, it, expect } from 'vitest';
import { Project } from 'ts-morph';
import { addImport, injectComponentIntoMain, updateJsxAttribute } from './ast-utils';

describe('ast-utils', () => {
    it('should add a named import if it does not exist', () => {
        const project = new Project({ useInMemoryFileSystem: true });
        const sourceFile = project.createSourceFile('test.tsx', `import { Home } from 'lucide-react';`);

        addImport(sourceFile, 'lucide-react', ['User']);

        const code = sourceFile.getFullText();
        expect(code).toContain('import { Home, User } from \'lucide-react\';');
    });

    it('should create a new import declaration if the module is not imported', () => {
        const project = new Project({ useInMemoryFileSystem: true });
        const sourceFile = project.createSourceFile('test.tsx', `export default function Page() { return <div />; }`);

        addImport(sourceFile, 'framer-motion', ['motion']);

        const code = sourceFile.getFullText();
        expect(code).toContain('import { motion } from "framer-motion";');
    });

    it('should inject a component into the <main> tag', () => {
        const project = new Project({ useInMemoryFileSystem: true });
        const sourceFile = project.createSourceFile('layout.tsx', `
            export default function Layout({ children }: { children: React.ReactNode }) {
                return (
                    <html>
                        <body>
                            <main>
                                {children}
                            </main>
                        </body>
                    </html>
                );
            }
        `);

        injectComponentIntoMain(sourceFile, 'Chatbot', { id: 'test-id' });

        const code = sourceFile.getFullText();
        expect(code).toContain('<Chatbot id="test-id"/>');
        expect(code).toContain('<main>');
        expect(code).toContain('</main>');
    });

    it('should update a JSX attribute value', () => {
        const project = new Project({ useInMemoryFileSystem: true });
        const sourceFile = project.createSourceFile('page.tsx', `
            export default function Page() {
                return <div className="old-class" data-test="old">Content</div>;
            }
        `);

        updateJsxAttribute(sourceFile, 'div', 'className', 'new-class');

        const code = sourceFile.getFullText();
        expect(code).toContain('className="new-class"');
        expect(code).not.toContain('className="old-class"');
        expect(code).toContain('data-test="old"');
    });
});
