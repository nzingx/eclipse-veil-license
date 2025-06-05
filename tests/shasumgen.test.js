import { generateSha256 } from "../lib/shasumgen.js";

describe("generateSha256", () => {
  it("should generate the correct SHA-256 hash", () => {
    const text = "hello world";
    const expected = "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9";
    const result = generateSha256(text);
    expect(result).toBe(expected);
  });
});
