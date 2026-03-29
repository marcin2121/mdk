#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// mdk.ts
var import_commander = require("commander");
var import_prompts = __toESM(require("prompts"));
var import_picocolors = __toESM(require("picocolors"));
var import_execa = require("execa");
var import_path = __toESM(require("path"));
var import_fs_extra = __toESM(require("fs-extra"));
var MDK_REGISTRY_URL = "https://raw.githubusercontent.com/marcin2121/mdk-registry/main/components";
async function main() {
  const program = new import_commander.Command();
  program.name("mdk").description("MDK Registry CLI").version("0.1.0");
  program.command("add").description("Add a component from MDK Registry").argument("<component>", "Component ID to add (e.g., chatbot, pricing)").option("-y, --yes", "Skip confirmation prompts", false).action(async (componentId, options) => {
    console.log(import_picocolors.default.bold(import_picocolors.default.yellow(`
\u{1F527} MDK Registry \u2014 Adding ${componentId}...
`)));
    const className = componentId.charAt(0).toUpperCase() + componentId.slice(1);
    const targetDir = import_path.default.join(process.cwd(), "components", "mdk");
    const targetPath = import_path.default.join(targetDir, `${className}.tsx`);
    if (import_fs_extra.default.existsSync(targetPath) && !options.yes) {
      const confirm = await (0, import_prompts.default)({
        type: "confirm",
        name: "overwrite",
        message: `Component ${className} already exists. Overwrite?`,
        initial: false
      });
      if (!confirm.overwrite) {
        process.exit(0);
      }
    }
    console.log(import_picocolors.default.cyan(`\u{1F4E5} Fetching ${componentId} from registry...`));
    try {
      let code = "";
      const localRegistryPath = import_path.default.join(process.cwd(), "..", "mdk-registry", "components", `${componentId}.txt`);
      if (import_fs_extra.default.existsSync(localRegistryPath)) {
        code = import_fs_extra.default.readFileSync(localRegistryPath, "utf8");
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
          console.warn(import_picocolors.default.yellow("\u26A0\uFE0F  Failed to parse MDK-METADATA."));
        }
      }
      await import_fs_extra.default.ensureDir(targetDir);
      await import_fs_extra.default.writeFile(targetPath, code);
      console.log(import_picocolors.default.green(`\u2705 Created: components/mdk/${className}.tsx`));
      if (dependencies.length > 0) {
        console.log(import_picocolors.default.cyan(`\u{1F4E6} Installing dependencies: ${dependencies.join(", ")}...`));
        await (0, import_execa.execa)("npm", ["install", ...dependencies], { stdio: "inherit" });
      }
      console.log(import_picocolors.default.bold(import_picocolors.default.green(`
\u{1F389} ${className} added successfully!`)));
      console.log(`
You can now use it in your layout or page:`);
      console.log(import_picocolors.default.cyan(`import ${className} from '@/components/mdk/${className}';`));
    } catch (error) {
      console.error(import_picocolors.default.red(`
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
