import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseLesson, parseWorld } from "../src/parse";
import type { QuizQuestion } from "../src/types";

/** Every question in the course, read from content/, so a test can win a boss fight. */
const root = path.resolve("content");
const questions: QuizQuestion[] = [
  ...readdirSync(root)
    .filter((d) => /^w\d$/.test(d))
    .flatMap((w) => readdirSync(path.join(root, w)).map((f) => parseLesson(readFileSync(path.join(root, w, f), "utf8"), f).quiz).flat()),
  ...readdirSync(path.join(root, "worlds")).flatMap((f) => parseWorld(readFileSync(path.join(root, "worlds", f), "utf8"), f).scenarios),
];

/** Index of the right option, found by the options shown on screen. */
export function rightAnswer(options: string[]): number {
  const key = options.join("|");
  const q = questions.find((x) => x.options.join("|") === key);
  if (!q) throw new Error(`unknown question with options: ${key}`);
  return q.answer;
}
