import fs from "fs";
import { jest } from "@jest/globals";
import { runInit } from "../lib/generator.js";

describe("runInit", () => {
  it("should exit with error if template not found", () => {
    const mockExistsSync = jest.spyOn(fs, "existsSync").mockReturnValue(false);
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => { throw new Error("Exited"); });
    const mockError = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => runInit({
      name: "UnknownLicense",
      author: "John",
      year: "2025",
      output: ".output-test",
    })).toThrow("Exited");

    expect(mockError.mock.calls[0][0]).toMatch(/❌ Template not found at:/);
    expect(mockExit).toHaveBeenCalledWith(1);

    // Bersihkan spy
    mockExistsSync.mockRestore();
    mockExit.mockRestore();
    mockError.mockRestore();
  });
});
