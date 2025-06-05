#!/usr/bin/env node

import { program } from "commander";
import { runInit } from "../lib/generator.js";
import prompts from "prompts";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load package.json
const packageJsonPath = path.resolve(__dirname, "../package.json");
const packageJsonRaw = await fs.readFile(packageJsonPath, "utf-8");
const packageJson = JSON.parse(packageJsonRaw);

// CLI definition
program
  .name("eclipse-veil")
  .description("Init Eclipse Veil License v1.0")
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize license file in current directory")
  .option("--author <name>", "License holder's name")
  .option("--year <year>", "Year of publication", new Date().getFullYear().toString())
  .option("--project <name>", "Project name")
  .option("--output <file>", "Output file path")
  .option("--cwd <path>", "Custom working directory", process.cwd())
  .option("--force", "Overwrite file if exists", false)
  .option("--no-prompt", "Skip interactive prompt")
  .option("--dry-run", "Output license to stdout only", false)
  .action(async (opts) => {
    const missingFields = [];

    if (!opts.author) missingFields.push({
      type: "text",
      name: "author",
      message: "Author name:"
    });

    if (!opts.year) missingFields.push({
      type: "text",
      name: "year",
      message: "Year of publication:",
      initial: new Date().getFullYear().toString()
    });

    if (!opts.project) missingFields.push({
      type: "text",
      name: "project",
      message: "Project name (optional):",
      initial: ""
    });

    let promptData = {};
    if (!opts.noPrompt && missingFields.length > 0) {
      promptData = await prompts(missingFields, {
        onCancel: () => {
          console.error("❌ Prompt cancelled.");
          process.exit(1);
        }
      });
    }

    const data = {
      ...opts,
      ...promptData
    };

    if (!data.author || !data.year) {
      console.error("❌ Missing required fields: author and/or year.");
      process.exit(1);
    }

    runInit(data);
  });

program.parse();
