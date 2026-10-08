import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { parseLesson, parseWorld } from "./src/parse";

const CONTENT = resolve(__dirname, "content");
const ID = "virtual:content";

const filesIn = (dir: string, ext: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? filesIn(join(dir, e.name), ext) : e.name.endsWith(ext) ? [join(dir, e.name)] : [],
  );

/**
 * Parses lessons (content/**\/*.md) and world files (content/worlds/*.yaml)
 * at build time and serves them as plain JSON, so the YAML parser never
 * reaches the browser. Edits to content files reload in dev.
 */
function content(): Plugin {
  return {
    name: "agentica-content",
    resolveId: (id) => (id === ID ? "\0" + ID : undefined),
    load(id) {
      if (id !== "\0" + ID) return;
      const md = filesIn(CONTENT, ".md");
      const yaml = filesIn(join(CONTENT, "worlds"), ".yaml");
      for (const f of [...md, ...yaml]) this.addWatchFile(f);
      const lessons = md.map((f) => parseLesson(readFileSync(f, "utf8"), f));
      const worlds = yaml.map((f) => parseWorld(readFileSync(f, "utf8"), f));
      return `export default ${JSON.stringify({ lessons, worlds })};`;
    },
  };
}

// Inline all JS and CSS into dist/index.html, so the built site opens with a
// double-click (file://) as well as on GitHub Pages. Relative base keeps it
// working at /Agentica/ or any other sub-path.
export default defineConfig({
  base: "./",
  plugins: [content(), viteSingleFile()],
});
