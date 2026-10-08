import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// Inline all JS and CSS into dist/index.html, so the built site opens with a
// double-click (file://) as well as on GitHub Pages. Relative base keeps it
// working at /Agentica/ or any other sub-path.
export default defineConfig({
  base: "./",
  plugins: [viteSingleFile()],
});
