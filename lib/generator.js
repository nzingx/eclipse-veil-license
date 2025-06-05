import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeLicenseFile } from "./output.js";
import { generateSha256 } from "./shasumgen.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fillTemplate(template, data) {
  const projectBlock = data.project ? ` for the project "${data.project}"` : "";
  const projectText = data.project ? ` (specifically the "${data.project}" project)` : "";
  const projectAttribution = data.project ? ` for "${data.project}"` : "";

  return template
    .replace(/{{author}}/g, data.author || "Unknown")
    .replace(/{{year}}/g, data.year || new Date().getFullYear())
    .replace(/{{project}}/g, data.project || "")
    .replace(/{{projectBlock}}/g, projectBlock)
    .replace(/{{projectText}}/g, projectText)
    .replace(/{{projectAttribution}}/g, projectAttribution);
}

export function runInit(data) {
  const templatePath = path.resolve(__dirname, "../templates/LICENSE.template.txt");

  if (!fs.existsSync(templatePath)) {
    console.error(`❌ Template not found at: ${templatePath}`);
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(templatePath, "utf-8");
  let filled = fillTemplate(rawTemplate, data);

  const hash = generateSha256(filled);
  filled += `\n---\nLicense Hash (SHA-256):\n${hash}\n`;

  const cwd = data.cwd ? path.resolve(data.cwd) : process.cwd();
  const defaultOutput = path.resolve(cwd, ".output-evl-lic", "LICENSE.txt");
  const outputPath = data.output
    ? path.resolve(cwd, data.output)
    : defaultOutput;

  writeLicenseFile({
    outputPath,
    content: filled,
    force: data.force,
    dryRun: data.dryRun,
  });
}
