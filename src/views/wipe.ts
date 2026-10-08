import { reducedMotion } from "../typewriter";

/**
 * Super Mario World-style circle wipe between the map and a stop: the screen
 * irises shut, the view changes, then it irises open. Skipped with reduced motion.
 */
const HALF_MS = 260;

let el: HTMLDivElement | undefined;
let busy = 0;

function overlay(): HTMLDivElement {
  if (!el) {
    el = document.createElement("div");
    el.className = "wipe";
    el.setAttribute("aria-hidden", "true");
    document.body.append(el);
  }
  return el;
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Run `swap` behind a closing and opening iris. */
export async function wipe(swap: () => void): Promise<void> {
  if (reducedMotion()) {
    swap();
    return;
  }
  const token = ++busy;
  const w = overlay();
  w.className = "wipe";
  await frame();
  w.classList.add("closing");
  await wait(HALF_MS);
  // A newer navigation took over; it will finish the job.
  if (token !== busy) return;
  swap();
  await frame();
  w.classList.replace("closing", "opening");
  await wait(HALF_MS);
  if (token === busy) w.className = "wipe";
}
