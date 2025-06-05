// lib/output.js
import fs from "fs";
import path from "path";

export function writeLicenseFile({ outputPath, content, force = false, dryRun = false }) {
  if (dryRun) {
    console.log("📄 License output (dry-run):\n");
    console.log(content);
    return;
  }

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (fs.existsSync(outputPath) && !force) {
    console.error(`❌ Error: File "${outputPath}" already exists. Use --force to overwrite.`);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, content, "utf-8");
  console.log(`✅ License file created at ${outputPath}`);
}
