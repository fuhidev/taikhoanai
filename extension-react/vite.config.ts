import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
 plugins: [react()],
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
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
 },
});
