const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function calculateFileHash(filePath) {
 const fileBuffer = fs.readFileSync(filePath);
 const hashSum = crypto.createHash("sha256");
 hashSum.update(fileBuffer);
 return hashSum.digest("hex");
}

function addIntegrityHashes() {
 const distPath = path.join(__dirname, "../dist");
 const manifestPath = path.join(distPath, "manifest.json");

 if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  // Tính hash cho các file JS
  const jsFiles = ["background.js", "content.js", "popup.js"];
  const hashes = {};

  jsFiles.forEach((file) => {
   const filePath = path.join(distPath, file);
   if (fs.existsSync(filePath)) {
    hashes[file] = calculateFileHash(filePath);
   }
  });

  // Thêm metadata bảo mật vào manifest
  manifest.security = {
   hashes: hashes,
   buildTime: new Date().toISOString(),
   version: manifest.version,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
 }
}

addIntegrityHashes();
console.log("🔒 Running post-build security...");
addIntegrityHashes();
console.log("✅ Post-build security completed!");
