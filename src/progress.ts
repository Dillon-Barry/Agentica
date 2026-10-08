import { getLesson } from "./content";
import { ROUTE } from "./worlds";

const KEY = "agentica.v2";

interface Saved {
  /** Cleared lesson ids and boss ids ("1-B"). */
  cleared: string[];
  /** Stop the player stands on in the overworld. */
  position?: string;
  /** Number of route stops whose path has already been drawn on the map. */
  revealed?: number;
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
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

/** A stop exists if it's a boss or its lesson has been written. */
export const isAvailable = (id: string): boolean => ROUTE.some((l) => l.id === id && (l.boss || !!getLesson(id)));

export function isCleared(id: string): boolean {
  return state.cleared.includes(id);
}

/** A stop is open once every stop before it on the route is cleared. */
export function isUnlocked(id: string): boolean {
  for (const l of ROUTE) {
    if (l.id === id) return isAvailable(id);
    if (isAvailable(l.id) && !isCleared(l.id)) return false;
  }
  return false;
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

export function resetProgress(): void {
  state = { cleared: [] };
  save();
}
