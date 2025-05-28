const fs = require("fs");
const path = require("path");

const mode = process.argv[2] || "development";

const manifestSrc =
 mode === "development"
  ? path.resolve(__dirname, "public/manifest.dev.json")
  : path.resolve(__dirname, "public/manifest.prod.json");

const manifestDest = path.resolve(__dirname, "public/manifest.json");

try {
 if (fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log(`✓ Copied manifest for ${mode} mode`);
 } else {
  console.error(`✗ Manifest source not found: ${manifestSrc}`);
  process.exit(1);
 }
} catch (error) {
 console.error(`✗ Error copying manifest: ${error.message}`);
 process.exit(1);
}
