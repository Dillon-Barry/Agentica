import { getLesson } from "./content";
import { ROUTE } from "./worlds";

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

export function introSeen(): boolean {
  return !!state.introSeen;
}

export function setIntroSeen(): void {
  state.introSeen = true;
  save();
}

export function resetProgress(): void {
  state = { cleared: [] };
  save();
}
