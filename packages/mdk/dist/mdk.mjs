#!/usr/bin/env node

// mdk.ts
import { Command } from "commander";
import prompts from "prompts";
import pc from "picocolors";
import { execa } from "execa";
import path from "path";
import fs from "fs-extra";
var MDK_REGISTRY_URL = "https://raw.githubusercontent.com/marcin2121/mdk-registry/main/components";
async function main() {
  const program = new Command();
  program.name("mdk").description("MDK Registry CLI").version("0.1.0");
  program.command("add").description("Add a component from MDK Registry").argument("<component>", "Component ID to add (e.g., chatbot, pricing)").option("-y, --yes", "Skip confirmation prompts", false).action(async (componentId, options) => {
    console.log(pc.bold(pc.yellow(`
\u{1F527} MDK Registry \u2014 Adding ${componentId}...
`)));
    const className = componentId.charAt(0).toUpperCase() + componentId.slice(1);
    const targetDir = path.join(process.cwd(), "components", "mdk");
    const targetPath = path.join(targetDir, `${className}.tsx`);
    if (fs.existsSync(targetPath) && !options.yes) {
      const confirm = await prompts({
        type: "confirm",
        name: "overwrite",
        message: `Component ${className} already exists. Overwrite?`,
        initial: false
      });
      if (!confirm.overwrite) {
        process.exit(0);
      }
    }
    console.log(pc.cyan(`\u{1F4E5} Fetching ${componentId} from registry...`));
    try {
      let code = "";
      const localRegistryPath = path.join(process.cwd(), "..", "mdk-registry", "components", `${componentId}.txt`);
      if (fs.existsSync(localRegistryPath)) {
        code = fs.readFileSync(localRegistryPath, "utf8");
      } else {
        const response = await fetch(`${MDK_REGISTRY_URL}/${componentId}.txt`);
        if (!response.ok) {
          throw new Error(`Failed to fetch component: ${response.statusText}`);
        }
        code = await response.text();
      }
      const metaMatch = code.match(/\/\* MDK-METADATA([\s\S]*?)\*\//);
      let dependencies = [];
      if (metaMatch) {
        try {
          const meta = JSON.parse(metaMatch[1].trim());
          dependencies = meta.dependencies || [];
          code = code.replace(/\/\* MDK-METADATA[\s\S]*?\*\//, "").trim();
        } catch (e) {
          console.warn(pc.yellow("\u26A0\uFE0F  Failed to parse MDK-METADATA."));
        }
      }
      await fs.ensureDir(targetDir);
      await fs.writeFile(targetPath, code);
      console.log(pc.green(`\u2705 Created: components/mdk/${className}.tsx`));
      if (dependencies.length > 0) {
        console.log(pc.cyan(`\u{1F4E6} Installing dependencies: ${dependencies.join(", ")}...`));
        await execa("npm", ["install", ...dependencies], { stdio: "inherit" });
      }
      console.log(pc.bold(pc.green(`
\u{1F389} ${className} added successfully!`)));
      console.log(`
You can now use it in your layout or page:`);
      console.log(pc.cyan(`import ${className} from '@/components/mdk/${className}';`));
    } catch (error) {
      console.error(pc.red(`
\u274C Error: ${error.message}`));
      process.exit(1);
    }
  });
  program.parse(process.argv);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
