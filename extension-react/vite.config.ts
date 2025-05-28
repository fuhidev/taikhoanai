import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
 console.log("Building in mode:", mode);

 return {
  plugins: [
   react(),
   {
    name: "copy-manifest",
    buildStart() {
     // Copy appropriate manifest based on mode
     const manifestSrc =
      mode === "development"
       ? resolve(__dirname, "public/manifest.dev.json")
       : resolve(__dirname, "public/manifest.prod.json");

     const manifestDest = resolve(__dirname, "public/manifest.json");

     if (existsSync(manifestSrc)) {
      try {
       copyFileSync(manifestSrc, manifestDest);
       console.log(`Copied manifest for ${mode} mode`);
      } catch (error) {
       console.warn(`Could not copy manifest: ${error}`);
      }
     } else {
      console.warn(`Manifest source not found: ${manifestSrc}`);
     }
    },
   },
  ],
  build: {
   rollupOptions: {
    input: {
     popup: resolve(__dirname, "src/index.html"),
     background: resolve(__dirname, "src/background/background.ts"),
     content: resolve(__dirname, "src/content/content.ts"),
    },
    output: {
     entryFileNames: "[name].js",
     chunkFileNames: "[name].js",
     assetFileNames: "[name].[ext]",
    },
   },
   outDir: "dist",
   emptyOutDir: true,
  },
  define: {
   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || mode),
  },
 };
});
