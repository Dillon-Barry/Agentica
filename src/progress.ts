import { getLesson } from "./content";
import { ROUTE, worldOf } from "./worlds";

const KEY = "agentica.v3";

interface Saved {
  /** Cleared lesson ids and boss ids ("1-B"). */
  cleared: string[];
  /** Stop the player stands on in the overworld. */
  position?: string;
  /** Number of route stops whose path has already been drawn on the map. */
  revealed?: number;
  /** The first-visit intro has been dismissed. */
  introSeen?: boolean;
  /** Boss questions answered wrongly (by question text), for the review pile. */
  missed?: string[];
}

// Storage can be blocked (private windows, previews). Fall back to memory so
// the site still works; progress just won't survive a reload.
let state: Saved = load();

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Saved;
  } catch {
    /* ignore */
  }
  return { cleared: [] };
}

function save(): void {
  try {
    // Merge with what's stored, so a second open tab can't erase progress
    // made in this one (or vice versa). Clears are only ever added.
    const raw = localStorage.getItem(KEY);
    if (raw && state.cleared.length) {
      const stored = JSON.parse(raw) as Saved;
      state.cleared = [...new Set([...stored.cleared, ...state.cleared])];
      state.revealed = Math.max(stored.revealed ?? 1, state.revealed ?? 1);
    }
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** A stop exists if it's a boss or challenge, or its lesson has been written. */
export const isAvailable = (id: string): boolean => ROUTE.some((l) => l.id === id && (l.boss || l.challenge || !!getLesson(id)));

export function isCleared(id: string): boolean {
  return state.cleared.includes(id);
}

/** On the game path, a stop opens once every stop before it is cleared. */
export function isOnPath(id: string): boolean {
  for (const l of ROUTE) {
    if (l.id === id) return isAvailable(id);
    if (isAvailable(l.id) && !isCleared(l.id)) return false;
  }
  return false;
}

/** A stop can be played: it's on the path, or study mode opens everything. */
export function isUnlocked(id: string): boolean {
  return isAvailable(id) && (studyMode() || isOnPath(id));
}

/**
 * Skip ahead: the boss of the world you're currently in can be fought early.
 * Beating it clears the whole world (see clearWorld).
 */
export function canSkipTo(id: string): boolean {
  const l = ROUTE.find((r) => r.id === id);
  if (!l?.boss || isUnlocked(id)) return false;
  const first = worldOf(id).levels[0].id;
  return isOnPath(first);
}

/** Beating a boss clears its whole world: lessons, challenge and boss. */
export function clearWorld(num: number): void {
  for (const l of ROUTE) if (worldOf(l.id).num === num && !isCleared(l.id)) state.cleared.push(l.id);
  save();
}

export function markCleared(id: string): void {
  if (!isCleared(id)) state.cleared.push(id);
  save();
}

export function clearedCount(): number {
  return ROUTE.filter((l) => isCleared(l.id)).length;
}

export function getPosition(): string | undefined {
  return state.position;
}

export function setPosition(id: string): void {
  state.position = id;
  save();
}

export function getRevealed(): number {
  return state.revealed ?? 1;
}

export function setRevealed(n: number): void {
  state.revealed = n;
  save();
}

export function introSeen(): boolean {
  return !!state.introSeen;
}

export function setIntroSeen(): void {
  state.introSeen = true;
  save();
}

/** Questions to practise again, most recent last. */
export function missedQuestions(): string[] {
  return state.missed ?? [];
}

export function addMissed(question: string): void {
  state.missed = [...(state.missed ?? []).filter((q) => q !== question), question];
  save();
}

export function removeMissed(question: string): void {
  state.missed = (state.missed ?? []).filter((q) => q !== question);
  save();
}

// Study mode is a reading preference, stored apart from progress.
const STUDY_KEY = "agentica.study";
let study = (() => {
  try {
    return localStorage.getItem(STUDY_KEY) === "1";
  } catch {
    return false;
  }
})();

/** Study mode: every stop is open, for looking things up. Clears still count. */
export function studyMode(): boolean {
  return study;
}

export function setStudyMode(on: boolean): void {
  study = on;
  try {
    localStorage.setItem(STUDY_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function resetProgress(): void {
  state = { cleared: [] };
  save();
}
