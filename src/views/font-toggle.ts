import { h } from "../dom";

const KEY = "agentica.pixelText";

const isPixel = () => document.documentElement.classList.contains("pixel-text");

/** Restore the reader's font choice on load. */
export function applyFontPref(): void {
  try {
    if (localStorage.getItem(KEY) === "1") document.documentElement.classList.add("pixel-text");
  } catch {
    /* ignore */
  }
}

/** "Aa" button: swaps the legible body font for a retro pixel one, and back. */
export function fontToggle(): HTMLButtonElement {
  const btn = h(
    "button",
    {
      class: "btn btn-small btn-ghost",
      type: "button",
      title: "Switch lesson text between the easy-to-read font and a retro pixel font",
      "aria-pressed": String(isPixel()),
      onclick: () => {
        const pixel = !isPixel();
        document.documentElement.classList.toggle("pixel-text", pixel);
        btn.setAttribute("aria-pressed", String(pixel));
        try {
          localStorage.setItem(KEY, pixel ? "1" : "0");
        } catch {
          /* ignore */
        }
      },
    },
    "Aa",
  );
  return btn;
}
