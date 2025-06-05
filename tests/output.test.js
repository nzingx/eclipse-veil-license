import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";
import { writeLicenseFile } from "../lib/output.js";

const testOutputPath = path.resolve(".output-test/LICENSE.txt");

afterAll(() => {
  if (fs.existsSync(testOutputPath)) {
    fs.unlinkSync(testOutputPath);
    fs.rmdirSync(path.dirname(testOutputPath));
  }
});

describe("writeLicenseFile", () => {
  it("should write file correctly", () => {
    const content = "This is a test license.";
    writeLicenseFile({
      outputPath: testOutputPath,
      content,
      force: true,
      dryRun: false,
    });

    expect(fs.existsSync(testOutputPath)).toBe(true);
    const written = fs.readFileSync(testOutputPath, "utf-8");
    expect(written).toBe(content);
  });

  it("should output to console in dry-run mode", () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    writeLicenseFile({
      outputPath: testOutputPath,
      content: "Dry run license",
      dryRun: true,
    });

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("📄 License output (dry-run):"));
    logSpy.mockRestore();
  });
});
