import { LESSONS } from "./content";
import { CHALLENGES } from "./challenges";
import { WORLDS } from "./worlds";

/** Search across lessons, Agentdex terms, challenges and bosses. No library: the course is small. */

export type ResultKind = "lesson" | "term" | "challenge" | "boss";

export interface Entry {
  kind: ResultKind;
  title: string;
  /** Plain text to search and quote from. */
  text: string;
  /** Route without the leading "#/". */
  path: string;
  /** Lesson id ("2-3") or stop id ("2-B") it belongs to. */
  stop: string;
}

export interface Result extends Entry {
  snippet: string;
}

/** "Prompt injection" -> "prompt-injection", for Agentdex links. */
export const termSlug = (term: string) => term.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Markdown to plain text, enough for searching and snippets. */
export const plain = (md: string) =>
  md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const INDEX: Entry[] = [
  ...LESSONS.map((l) => ({
    kind: "lesson" as const,
    title: l.title,
    text: plain([...l.boxes, l.deeper ?? ""].join(" ")),
    path: `level/${l.id}`,
    stop: l.id,
  })),
  ...LESSONS.flatMap((l) =>
    l.terms.map((t) => ({ kind: "term" as const, title: t.term, text: t.def, path: `agentdex/${termSlug(t.term)}`, stop: l.id })),
  ),
  ...WORLDS.filter((w) => CHALLENGES[w.num]).map((w) => ({
    kind: "challenge" as const,
    title: w.challenge.title,
    text: plain(`${CHALLENGES[w.num].intro} ${CHALLENGES[w.num].takeaway}`),
    path: `challenge/${w.num}`,
    stop: `${w.num}-C`,
  })),
  ...WORLDS.map((w) => ({
    kind: "boss" as const,
    title: w.boss.name,
    text: `World ${w.num} boss: ${w.name}. ${w.blurb}`,
    path: `boss/${w.num}`,
    stop: `${w.num}-B`,
  })),
];

const SNIPPET = 160;

/** Up to `limit` entries containing every word of the query, best first. */
export function search(query: string, limit = 12): Result[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: [Entry, number][] = [];
  for (const e of INDEX) {
    const title = e.title.toLowerCase();
    const text = e.text.toLowerCase();
    if (!words.every((w) => title.includes(w) || text.includes(w))) continue;
    let score = 0;
    for (const w of words) {
      if (title === w) score += 30;
      else if (title.startsWith(w)) score += 20;
      else if (title.includes(w)) score += 12;
      score += Math.min(5, text.split(w).length - 1);
    }
    // A term's own entry is the most direct answer to a one-word lookup.
    if (e.kind === "term" && title.includes(words.join(" "))) score += 10;
    scored.push([e, score]);
  }
  return scored
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([e]) => ({ ...e, snippet: snippet(e.text, words) }));
}

/** A slice of text around the first matched word. */
function snippet(text: string, words: string[]): string {
  const lower = text.toLowerCase();
  const at = Math.min(...words.map((w) => lower.indexOf(w)).filter((i) => i >= 0), text.length);
  if (text.length <= SNIPPET) return text;
  let start = Math.max(0, Math.min(at - 30, text.length - SNIPPET));
  // Begin at a word, not halfway through one.
  if (start > 0) start = text.indexOf(" ", start) + 1 || start;
  const cut = text.slice(start, start + SNIPPET);
  return `${start > 0 ? "…" : ""}${cut.trim()}${start + SNIPPET < text.length ? "…" : ""}`;
}
