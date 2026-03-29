#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import pc from 'picocolors';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs-extra';
import { Project, SyntaxKind, SourceFile } from 'ts-morph';

const MDK_REGISTRY_URL = 'https://raw.githubusercontent.com/marcin2121/mdk-registry/main/components';

// AST Utilities (Replicated from lib/utils/ast-utils.ts for CLI independence)
function addImport(sourceFile: SourceFile, moduleSpecifier: string, defaultImport?: string, namedImports: string[] = []) {
  const existingImport = sourceFile.getImportDeclaration(moduleSpecifier);
  if (existingImport) {
    if (defaultImport && !existingImport.getDefaultImport()) {
        existingImport.setDefaultImport(defaultImport);
    }
    const existingNamedImports = existingImport.getNamedImports().map(ni => ni.getName());
    for (const name of namedImports) {
      if (!existingNamedImports.includes(name)) {
        existingImport.addNamedImport(name);
      }
    }
  } else {
    sourceFile.addImportDeclaration({
      moduleSpecifier,
      defaultImport,
      namedImports: namedImports.map(name => ({ name })),
    });
  }
}

function injectComponent(sourceFile: SourceFile, componentName: string, targetTag: string = "main") {
  const target = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)
    .find(node => node.getOpeningElement().getTagNameNode().getText() === targetTag);

  if (target) {
    const componentTag = `<${componentName} />`;
    const closingElement = target.getClosingElement();
    if (closingElement) {
        sourceFile.insertText(closingElement.getStart(), `\n        ${componentTag}\n      `);
        return true;
    }
  }
  return false;
}

async function main() {
  const program = new Command();

  program
    .name('mdk')
    .description('MDK Registry CLI')
    .version('0.1.0');

  program
    .command('add')
    .description('Add a component from MDK Registry')
    .argument('<component>', 'Component ID to add (e.g., chatbot, pricing)')
    .option('-y, --yes', 'Skip confirmation prompts', false)
    .option('-t, --target <file>', 'Target file to inject the component into', 'app/page.tsx')
    .action(async (componentId, options) => {
      console.log(pc.bold(pc.yellow(`\n🏆 MDK Holy Grail — Adding ${componentId}...\n`)));

      const className = componentId.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
      const targetDir = path.join(process.cwd(), 'components', 'mdk');
      const componentPath = path.join(targetDir, `${className}.tsx`);

      if (fs.existsSync(componentPath) && !options.yes) {
        const confirm = await prompts({
          type: 'confirm',
          name: 'overwrite',
          message: `Component ${className} already exists. Overwrite?`,
          initial: false,
        });
        if (!confirm.overwrite) process.exit(0);
      }

      console.log(pc.cyan(`📥 Fetching ${componentId} from registry...`));

      try {
        let code = "";
        const localRegistryPath = path.join(process.cwd(), '..', 'mdk-registry', 'components', `${componentId}.txt`);
        
        if (fs.existsSync(localRegistryPath)) {
            code = fs.readFileSync(localRegistryPath, 'utf8');
        } else {
            const response = await fetch(`${MDK_REGISTRY_URL}/${componentId}.txt`);
            if (!response.ok) throw new Error(`Failed to fetch component: ${response.statusText}`);
            code = await response.text();
        }

        // Parse Metadata
        const metaMatch = code.match(/\/\* MDK-METADATA([\s\S]*?)\*\//);
        let dependencies: string[] = [];
        if (metaMatch) {
            try {
                const meta = JSON.parse(metaMatch[1].trim());
                dependencies = meta.dependencies || [];
                code = code.replace(/\/\* MDK-METADATA[\s\S]*?\*\//, '').trim();
            } catch (e) {
                console.warn(pc.yellow('⚠️  Failed to parse MDK-METADATA.'));
            }
        }

        // Ensure directory exists
        await fs.ensureDir(targetDir);

        // Write component
        await fs.writeFile(componentPath, code);
        console.log(pc.green(`✅ Created: components/mdk/${className}.tsx`));

        // Install dependencies
        if (dependencies.length > 0) {
            console.log(pc.cyan(`📦 Installing dependencies: ${dependencies.join(', ')}...`));
            await execa('npm', ['install', ...dependencies], { stdio: 'inherit' });
        }

        // --- AST INJECTION ---
        const pagePath = path.join(process.cwd(), options.target);
        if (fs.existsSync(pagePath)) {
            const injectConfirm = options.yes || (await prompts({
                type: 'confirm',
                name: 'inject',
                message: `Would you like to automatically inject <${className} /> into ${options.target}?`,
                initial: true,
            })).inject;

            if (injectConfirm) {
                console.log(pc.cyan(`🔧 Injecting <${className} /> into ${options.target} using AST...`));
                const project = new Project();
                const sourceFile = project.addSourceFileAtPath(pagePath);
                
                // Add Import
                const relativeImportPath = `@/components/mdk/${className}`;
                addImport(sourceFile, relativeImportPath, className);
                
                // Inject into <main> or first JsxElement
                const success = injectComponent(sourceFile, className);
                
                if (success) {
                    await sourceFile.save();
                    console.log(pc.green(`🚀 Successfully injected into ${options.target}!`));
                } else {
                    console.log(pc.yellow(`⚠️  Could not find <main> tag for automatic injection. Adding import only.`));
                    await sourceFile.save();
                }
            }
        }

        console.log(pc.bold(pc.green(`\n🎉 ${className} added successfully!`)));

      } catch (error: any) {
        console.error(pc.red(`\n❌ Error: ${error.message}`));
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
