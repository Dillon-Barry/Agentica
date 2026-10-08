import { parse as parseYaml } from "yaml";
import type { Lesson, QuizQuestion, Source, Term } from "./types";

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
  let deeper: string | undefined;
  let current: string[] = [];
  let inDeeper = false;

  const flush = () => {
    const chunk = current.join("\n").trim();
    current = [];
    if (inDeeper) deeper = chunk;
    else if (chunk) boxes.push(chunk);
  };

  for (const line of fm[2].split("\n")) {
    const sep = /^===\s*(deeper)?\s*$/.exec(line);
    if (!sep) {
      current.push(line);
      continue;
    }
    if (inDeeper) throw new Error(`${file}: "=== deeper" must be the last section`);
    flush();
    if (sep[1]) inDeeper = true;
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
    deeper,
  };
}

export function wordCount(markdown: string): number {
  return markdown
    .replace(/[*_`#>\[\]()]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}
