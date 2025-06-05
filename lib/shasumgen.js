// lib/shasumgen.js
import crypto from "crypto";

/**
 * Generate SHA-256 checksum of a given string
 * @param {string} text - The input text to hash
 * @returns {string} - The SHA-256 hex digest
 */
export function generateSha256(text) {
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}
