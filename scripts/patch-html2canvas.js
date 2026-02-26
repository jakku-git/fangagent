/**
 * Patches html2canvas to gracefully handle modern CSS color functions
 * (oklab, oklch, color-mix) that its internal parser doesn't support.
 * Instead of throwing an error, unsupported functions return transparent.
 *
 * This runs automatically after `npm install` via the postinstall script.
 */

const fs = require("fs");
const path = require("path");

const files = [
  path.join(__dirname, "../node_modules/html2canvas/dist/html2canvas.esm.js"),
  path.join(__dirname, "../node_modules/html2canvas/dist/html2canvas.js"),
];

const OLD = `throw new Error("Attempting to parse an unsupported color function \\"" + value.name + "\\"");`;
const NEW = `return 0x00000000; // patched: unsupported color functions (oklab/oklch/color-mix) return transparent`;

let patched = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  if (src.includes(NEW)) {
    console.log(`[patch-html2canvas] Already patched: ${path.basename(file)}`);
    continue;
  }
  if (!src.includes(OLD)) {
    console.warn(`[patch-html2canvas] Pattern not found in: ${path.basename(file)}`);
    continue;
  }
  fs.writeFileSync(file, src.replace(OLD, NEW), "utf8");
  console.log(`[patch-html2canvas] Patched: ${path.basename(file)}`);
  patched++;
}

if (patched > 0) {
  console.log(`[patch-html2canvas] Done. ${patched} file(s) patched.`);
}
