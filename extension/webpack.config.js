const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
 mode: "production",
 entry: {
  background: "./src/background.ts",
  content: "./src/content.ts",
  popup: "./src/popup.ts",
 },
 output: {
  path: path.resolve(__dirname, "dist"),
  filename: "[name].js",
  clean: true,
 },
 module: {
  rules: [
   {
    test: /\.ts$/,
    use: "ts-loader",
    exclude: /node_modules/,
   },
  ],
 },
 resolve: {
  extensions: [".ts", ".js"],
 },
 plugins: [
  new CopyWebpackPlugin({
   patterns: [
    { from: "src/manifest.json", to: "manifest.json" },
    { from: "src/popup.html", to: "popup.html" },
   ],
  }),
 ],
};
