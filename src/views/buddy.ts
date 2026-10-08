import { h } from "../dom";
import { bitSprite, type BitFace } from "../map/pixels";
import { reducedMotion } from "../typewriter";

export type Mood = "cheer" | "slump";

export interface Buddy {
  el: HTMLElement;
  /** Cheer for a right answer or a clear; slump for a wrong answer. */
  react(mood: Mood): void;
  destroy(): void;
}

const MOOD_MS = 1400;

/** Bit, standing on the edge of a dialog box, reacting to how things go. */
export function createBuddy(): Buddy {
  const canvas = h("canvas", { class: "buddy-canvas" });
  const el = h("div", { class: "buddy", "aria-hidden": "true" }, canvas);
  const faces = new Map<BitFace, HTMLCanvasElement>();
  const face = (f: BitFace) => {
    if (!faces.has(f)) faces.set(f, bitSprite(f));
    const img = faces.get(f)!;
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
  };
  face("idle");

  let moodTimer = 0;
  let mood: Mood | undefined;
  // Blink now and then while idle.
  const blink = window.setInterval(() => {
    if (mood || reducedMotion()) return;
    face("blink");
    window.setTimeout(() => !mood && face("idle"), 160);
  }, 3800);

  return {
    el,
    react(m) {
      window.clearTimeout(moodTimer);
      mood = m;
      face(m === "cheer" ? "happy" : "sad");
      el.classList.remove("cheer", "slump");
      void el.offsetWidth; // restart the animation
      el.classList.add(m);
      moodTimer = window.setTimeout(() => {
        mood = undefined;
        el.classList.remove("cheer", "slump");
        face("idle");
      }, MOOD_MS);
    },
    destroy() {
      window.clearInterval(blink);
      window.clearTimeout(moodTimer);
    },
  };
}
