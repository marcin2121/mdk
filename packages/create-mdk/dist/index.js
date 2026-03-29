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

// index.ts
var import_commander = require("commander");
var import_prompts = __toESM(require("prompts"));
var import_picocolors = __toESM(require("picocolors"));
var import_execa = require("execa");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var import_url = require("url");
var import_meta = {};
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
async function init() {
  const program = new import_commander.Command();
  program.name("create-mdk").description("Initialize a new MDK project").argument("[directory]", "Destination directory").action(async (directory) => {
    console.log(import_picocolors.default.bold(import_picocolors.default.yellow("\n\u{1F527} MDK \u2014 Modern Development Kit\n")));
    const response = await (0, import_prompts.default)([
      {
        type: directory ? null : "text",
        name: "directory",
        message: "Where would you like to create your project?",
        initial: "my-mdk-app"
      },
      {
        type: "select",
        name: "template",
        message: "Which template would you like to use?",
        choices: [
          { title: "SaaS AI (Landing + Pricing + Hero)", value: "saas-ai" },
          { title: "Dev Portfolio (Dark Mode)", value: "portfolio-dev" },
          { title: "Creative Agency", value: "agency-creative" },
          { title: "Admin Dashboard", value: "dashboard-admin" },
          { title: "Minimal E-commerce", value: "ecommerce-minimal" }
        ]
      },
      {
        type: "confirm",
        name: "install",
        message: "Would you like to install dependencies automatically?",
        initial: true
      }
    ]);
    const targetPath = import_path.default.resolve(process.cwd(), directory || response.directory);
    if (import_fs.default.existsSync(targetPath)) {
      console.error(import_picocolors.default.red(`
\u274C Error: Directory '${targetPath}' already exists.`));
      process.exit(1);
    }
    console.log(import_picocolors.default.cyan(`
\u{1F4E5} Downloading MDK template (${response.template})...`));
    try {
      await (0, import_execa.execa)("npx", ["-y", "degit", "marcin2121/mdk", targetPath]);
      if (response.install) {
        console.log(import_picocolors.default.cyan(`
\u{1F4E6} Installing dependencies (this may take a minute)...`));
        await (0, import_execa.execa)("npm", ["install"], {
          cwd: targetPath,
          stdio: "inherit"
        });
      }
      console.log(import_picocolors.default.green(`
\u2705 Success! MDK project initialized in ${import_picocolors.default.bold(targetPath)}`));
      console.log(`
To get started, run:`);
      console.log(import_picocolors.default.cyan(`  cd ${import_path.default.relative(process.cwd(), targetPath)}`));
      if (!response.install) {
        console.log(import_picocolors.default.cyan(`  npm install`));
      }
      console.log(import_picocolors.default.cyan(`  npm run dev`));
      console.log(`
Your browser will open automatically to the setup wizard.`);
    } catch (error) {
      console.error(import_picocolors.default.red(`
\u274C Setup failed: ${error.message}`));
      process.exit(1);
    }
  });
  program.parse(process.argv);
}
init().catch((err) => {
  console.error(err);
  process.exit(1);
});
