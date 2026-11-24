import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const sentence =
  "The committee spent three hours debating the PDF, then asked IT to print it, scan it, and email it back as a PDF — democracy in action, just with extra steps and a paper jam.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, sentence, "utf8");

const written = readFileSync(outPath, "utf8");
if (written !== sentence) {
  throw new Error("entry.txt does not match the sentence exactly");
}

// Byte-level check: the em dash is multi-byte UTF-8, so bytes != chars.
// Also guard the hard rule: exactly the sentence, no trailing newline.
const writtenBytes = Buffer.from(written, "utf8");
const expectedBytes = Buffer.from(sentence, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  throw new Error("entry.txt bytes do not match the sentence exactly");
}
if (written.endsWith("\n") || !written.endsWith(".")) {
  throw new Error("entry.txt must end with '.' and have no trailing newline");
}
console.log(
  `Wrote ${written.length} characters (${writtenBytes.length} bytes) to ${outPath}`,
);
