import { h } from "../dom";

/** A hands-on challenge. `mount` builds the UI in `el` and calls `done` when solved. */
export interface Challenge {
  /** Markdown shown above the challenge: what to do. */
  intro: string;
  /** Markdown shown after solving: the idea to take away. */
  takeaway: string;
  mount(el: HTMLElement, done: () => void): void;
}

/** A feedback line that shows right/wrong with an explanation. */
export function feedback(): { el: HTMLElement; show(ok: boolean, text: string): void; clear(): void } {
  const el = h("p", { class: "ch-feedback", "aria-live": "polite" });
  return {
    el,
    show(ok, text) {
      el.className = `ch-feedback ${ok ? "right" : "wrong"}`;
      el.replaceChildren(h("strong", {}, ok ? "✔ RIGHT! " : "✘ NOT QUITE. "), text);
    },
    clear() {
      el.className = "ch-feedback";
      el.replaceChildren();
    },
  };
}

export const button = (label: string, onclick: () => void, cls = "btn") =>
  h("button", { class: cls, type: "button", onclick }, label);

export function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
