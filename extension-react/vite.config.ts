import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
 const isDev = mode === "development";

 return {
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
   }, // Cấu hình minify mạnh để làm code khó đọc
   minify: isDev ? false : "terser",
   terserOptions: {
    compress: {
     drop_console: true,
     drop_debugger: true,
     passes: 2, // Tăng lên 2 passes
     pure_funcs: ["console.log", "console.info", "console.warn"],
     unsafe: true, // Bật unsafe optimizations
     unsafe_comps: true,
     unsafe_Function: true,
     unsafe_math: true,
     unsafe_symbols: true,
     unsafe_methods: true,
     unsafe_proto: true,
     unsafe_regexp: true,
     unsafe_undefined: true,
     // Xóa các comment và unused code
     dead_code: true,
     unused: true,
     // Rút gọn tên biến
     reduce_vars: true,
     reduce_funcs: true,
     // Inline functions
     inline: true,
     // Collapse variables
     collapse_vars: true,
     // Hoist functions and variables
     hoist_funs: true,
     hoist_vars: true,
    },
    mangle: {
     toplevel: true, // Bật toplevel mangling
     safari10: true,
     // Mangle property names với regex
     properties: {
      regex: /^_/,
     },
     // Làm rối tên variables
     eval: true,
    },
    format: {
     comments: false,
     // Làm code thành 1 dòng dài
     beautify: false,
     // Xóa whitespace
     indent_level: 0,
    },
   },
   outDir: "dist",
   emptyOutDir: true,
  },
  define: {
   "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
 };
});
