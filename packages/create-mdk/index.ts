#!/usr/bin/env tsx

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const targetDir = process.argv[2] || 'my-mdk-app';
const targetPath = path.join(process.cwd(), targetDir);

console.log(`\n🚀 Initializing MDK Starter Kit inside: ${targetDir}...`);

if (fs.existsSync(targetPath)) {
  console.error(`❌ Error: Directory '${targetDir}' already exists. Choose a different name.`);
  process.exit(1);
}

try {
  // Use degit for fast cloning without history bloating
  console.log(`\n📥 Downloading repository template (marcin2121/mdk)...`);
  execSync(`npx -y degit marcin2121/mdk "${targetDir}"`, { stdio: 'inherit' });

  // Install dependencies automatically 
  console.log(`\n📦 Installing dependencies...`);
  execSync(`npm install`, { cwd: targetPath, stdio: 'inherit' });

  console.log(`\n✅ Success! MDK initialized inside ${targetDir}`);
  console.log(`\nTo get started visually, run these commands:`);
  console.log(`  cd ${targetDir}`);
  console.log(`  npm run dev`);
  console.log(`\nYour browser will open up to start visual configuration wizard.`);

} catch (error: any) {
  console.error(`\n❌ Setup failed:`, error.message);
  process.exit(1);
}
