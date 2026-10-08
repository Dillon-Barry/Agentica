import data from "virtual:content";
import { ROUTE } from "./worlds";
import type { Lesson, QuizQuestion, WorldContent } from "./types";

const byId = new Map<string, Lesson>(data.lessons.map((l) => [l.id, l]));
const worldById = new Map<number, WorldContent>(data.worlds.map((w) => [w.world, w]));

/** Lessons that exist, in curriculum order. */
export const LESSONS: Lesson[] = ROUTE.filter((l) => !l.boss && !l.challenge)
  .map((l) => byId.get(l.id))
  .filter((l): l is Lesson => l !== undefined);

export function getLesson(id: string): Lesson | undefined {
  return byId.get(id);
}

/** Recap bullets and scenario questions for a world. */
export function worldContent(world: number): WorldContent {
  return worldById.get(world) ?? { world, recap: [], scenarios: [] };
}

/** Recall questions from a world's lessons. */
export function lessonQuestions(world: number): QuizQuestion[] {
  return LESSONS.filter((l) => l.world === world).flatMap((l) => l.quiz);
}

/** Every question a boss can ask: the world's scenarios plus its lesson questions. */
export function bossPool(world: number): QuizQuestion[] {
  return [...worldContent(world).scenarios, ...lessonQuestions(world)];
}

/** Boss hit points: one per lesson plus two, capped at six. */
export function bossHp(world: number): number {
  return Math.min(6, LESSONS.filter((l) => l.world === world).length + 2);
}

export const HEARTS = 3;

/** Every Agentdex term, for linking bold words in lessons to their definition. */
export const TERMS: Map<string, { term: string; def: string }> = new Map(
  LESSONS.flatMap((l) => l.terms.map((t) => [t.term.toLowerCase(), t] as const)),
);

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * A boss fight's question order: scenario questions (apply what you learned)
 * alternate with recall questions (check the basics), so at least half of
 * every fight is about judgement. Shuffled fresh for every attempt.
 */
export function fightOrder(scenarios: QuizQuestion[], recall: QuizQuestion[]): QuizQuestion[] {
  const a = shuffle(scenarios);
  const b = shuffle(recall);
  const out: QuizQuestion[] = [];
  while (a.length || b.length) {
    if (a.length) out.push(a.shift()!);
    if (b.length) out.push(b.shift()!);
  }
  return out;
}
