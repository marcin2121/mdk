#!/usr/bin/env node

import { Command } from 'commander';
import prompts from 'prompts';
import pc from 'picocolors';
import { execa } from 'execa';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
  const program = new Command();

  program
    .name('create-mdk')
    .description('Initialize a new MDK project')
    .argument('[directory]', 'Destination directory')
    .action(async (directory) => {
      console.log(pc.bold(pc.yellow('\n🔧 MDK — Modern Development Kit\n')));

      const response = await prompts([
        {
          type: directory ? null : 'text',
          name: 'directory',
          message: 'Where would you like to create your project?',
          initial: 'my-mdk-app',
        },
        {
          type: 'select',
          name: 'template',
          message: 'Which template would you like to use?',
          choices: [
            { title: 'SaaS AI (Landing + Pricing + Hero)', value: 'saas-ai' },
            { title: 'Dev Portfolio (Dark Mode)', value: 'portfolio-dev' },
            { title: 'Creative Agency', value: 'agency-creative' },
            { title: 'Admin Dashboard', value: 'dashboard-admin' },
            { title: 'Minimal E-commerce', value: 'ecommerce-minimal' },
          ],
        },
        {
          type: 'confirm',
          name: 'install',
          message: 'Would you like to install dependencies automatically?',
          initial: true,
        }
      ]);

      const targetPath = path.resolve(process.cwd(), directory || response.directory);

      if (fs.existsSync(targetPath)) {
        console.error(pc.red(`\n❌ Error: Directory '${targetPath}' already exists.`));
        process.exit(1);
      }

      console.log(pc.cyan(`\n📥 Downloading MDK template (${response.template})...`));
      
      try {
        // We use degit to clone the repo without history
        await execa('npx', ['-y', 'degit', 'marcin2121/mdk', targetPath]);

        if (response.install) {
          console.log(pc.cyan(`\n📦 Installing dependencies (this may take a minute)...`));
          await execa('npm', ['install'], {
            cwd: targetPath,
            stdio: 'inherit',
          });
        }

        console.log(pc.green(`\n✅ Success! MDK project initialized in ${pc.bold(targetPath)}`));
        console.log(`\nTo get started, run:`);
        console.log(pc.cyan(`  cd ${path.relative(process.cwd(), targetPath)}`));
        if (!response.install) {
          console.log(pc.cyan(`  npm install`));
        }
        console.log(pc.cyan(`  npm run dev`));
        console.log(`\nYour browser will open automatically to the setup wizard.`);

      } catch (error: any) {
        console.error(pc.red(`\n❌ Setup failed: ${error.message}`));
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
