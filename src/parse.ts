import { parse as parseYaml } from "yaml";
import type { Lesson, QuizQuestion, Source, Term, WorldContent } from "./types";

/**
 * Lesson file format:
 *
 *   ---
 *   id: 1-1
 *   title: ...
 *   diagram: ...
 *   terms: [...]
 *   sources: [...]
 *   quiz: [...]
 *   ---
 *   First dialog box (markdown).
 *   ===
 *   Second dialog box.
 *   === deeper
 *   Optional "Go deeper" text.
 *   === peek
 *   Optional read-only example, usually a fenced code block.
 *
 * Runs at build time (see vite.config.ts), so the YAML parser never ships.
 */
export function parseLesson(raw: string, file = "lesson"): Lesson {
  const text = raw.replace(/\r\n/g, "\n");
  const fm = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(text);
  if (!fm) throw new Error(`${file}: missing YAML frontmatter`);

  const meta = (parseYaml(fm[1]) ?? {}) as Record<string, unknown>;
  const id = String(meta.id ?? "");
  const idMatch = /^(\d+)-(\d+)$/.exec(id);
  if (!idMatch) throw new Error(`${file}: id "${id}" must look like "1-2"`);

  const boxes: string[] = [];
  const extras: Partial<Record<"deeper" | "peek", string>> = {};
  let current: string[] = [];
  let section: "box" | "deeper" | "peek" = "box";
  let inFence = false;

  const flush = () => {
    const chunk = current.join("\n").trim();
    current = [];
    if (section === "box") {
      if (chunk) boxes.push(chunk);
    } else extras[section] = chunk;
  };

  for (const line of fm[2].split("\n")) {
    if (/^```/.test(line)) inFence = !inFence;
    const sep = inFence ? null : /^===\s*(deeper|peek)?\s*$/.exec(line);
    if (!sep) {
      current.push(line);
      continue;
    }
    if (section !== "box" && !sep[1]) throw new Error(`${file}: dialog boxes must come before "=== deeper" / "=== peek"`);
    flush();
    if (sep[1]) {
      const next = sep[1] as "deeper" | "peek";
      if (extras[next] !== undefined || section === next) throw new Error(`${file}: only one "=== ${next}" section allowed`);
      section = next;
    }
  }
  flush();

  return {
    id,
    world: Number(idMatch[1]),
    order: Number(idMatch[2]),
    title: String(meta.title ?? ""),
    diagram: String(meta.diagram ?? ""),
    terms: (meta.terms ?? []) as Term[],
    sources: (meta.sources ?? []) as Source[],
    quiz: (meta.quiz ?? []) as QuizQuestion[],
    boxes,
    deeper: extras.deeper,
    peek: extras.peek,
  };
}

/** World file (content/worlds/wN.yaml): recap bullets and scenario questions. */
export function parseWorld(raw: string, file = "world"): WorldContent {
  const meta = (parseYaml(raw.replace(/\r\n/g, "\n")) ?? {}) as Record<string, unknown>;
  const world = Number(meta.world);
  if (!Number.isInteger(world)) throw new Error(`${file}: missing "world: <number>"`);
  return {
    world,
    recap: (meta.recap ?? []) as string[],
    scenarios: (meta.scenarios ?? []) as QuizQuestion[],
  };
}

export function wordCount(markdown: string): number {
  return markdown
    .replace(/[*_`#>\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}
