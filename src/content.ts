import { parseLesson } from "./parse";
import { ROUTE } from "./worlds";
import type { Lesson, QuizQuestion } from "./types";

const files = import.meta.glob("/content/**/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const byId = new Map<string, Lesson>();
for (const [path, raw] of Object.entries(files)) {
  const lesson = parseLesson(raw, path);
  byId.set(lesson.id, lesson);
}

/** Lessons that exist, in curriculum order. */
export const LESSONS: Lesson[] = ROUTE.filter((l) => !l.boss)
  .map((l) => byId.get(l.id))
  .filter((l): l is Lesson => l !== undefined);

export function getLesson(id: string): Lesson | undefined {
  return byId.get(id);
}

/** Every question from a world's lessons: the boss fight's pool. */
export function bossPool(world: number): QuizQuestion[] {
  return LESSONS.filter((l) => l.world === world).flatMap((l) => l.quiz);
}

/** Boss hit points: one per lesson plus two, capped at six. */
export function bossHp(world: number): number {
  return Math.min(6, LESSONS.filter((l) => l.world === world).length + 2);
}

export const HEARTS = 3;
