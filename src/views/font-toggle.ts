import { h } from "../dom";

const KEY = "agentica.plainFont";

const isPlain = () => document.documentElement.classList.contains("plain-font");

/** Restore the reader's font choice on load. */
export function applyFontPref(): void {
  try {
    if (localStorage.getItem(KEY) === "1") document.documentElement.classList.add("plain-font");
  } catch {
    /* ignore */
  }
}

/** "Aa" button: swaps the pixel body font for a plain one. */
export function fontToggle(): HTMLButtonElement {
  const btn = h(
    "button",
    {
      class: "btn btn-small btn-ghost",
      type: "button",
      title: "Switch between pixel and plain text",
      "aria-pressed": String(isPlain()),
      onclick: () => {
        const plain = !isPlain();
        document.documentElement.classList.toggle("plain-font", plain);
        btn.setAttribute("aria-pressed", String(plain));
        try {
          localStorage.setItem(KEY, plain ? "1" : "0");
        } catch {
          /* ignore */
        }
      },
    },
    "Aa",
  );
  return btn;
}
