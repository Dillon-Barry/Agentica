export interface Term {
  term: string;
  def: string;
}

export interface Source {
  label: string;
  url: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answer: number;
  /** Shown after answering, right or wrong. */
  why: string;
}

export interface Lesson {
  /** "<world>-<order>", e.g. "1-2". */
  id: string;
  world: number;
  order: number;
  title: string;
  diagram: string;
  terms: Term[];
  sources: Source[];
  /** Questions this lesson adds to its world's boss fight. */
  quiz: QuizQuestion[];
  /** Markdown, one entry per dialog box. */
  boxes: string[];
  /** Optional markdown for the "Go deeper" block. */
  deeper?: string;
}

/** A stop on the overworld route: a lesson, or a world's boss fortress. */
export interface PlannedLevel {
  id: string;
  title: string;
  /** Position on the overworld map, in map pixels. */
  x: number;
  y: number;
  boss?: boolean;
}

export type Theme = "grass" | "forge" | "cave" | "forest" | "shadow" | "castle";

export interface Boss {
  name: string;
  x: number;
  y: number;
  /** Body and shade colours for the boss sprite. */
  body: string;
  shade: string;
}

export interface World {
  num: number;
  name: string;
  blurb: string;
  theme: Theme;
  levels: PlannedLevel[];
  boss: Boss;
}
