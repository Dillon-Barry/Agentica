import { TERMS } from "../content";
import { h } from "../dom";

/** Find the Agentdex entry for a bold phrase, allowing a simple plural. */
function lookup(text: string) {
  const key = text.trim().toLowerCase();
  return TERMS.get(key) ?? (key.endsWith("s") ? TERMS.get(key.slice(0, -1)) : undefined);
}

/**
 * Turn bold phrases that are Agentdex terms into buttons, so a beginner can
 * click any key term for its definition without leaving the lesson.
 */
export function linkTerms(html: string): string {
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  for (const strong of [...tpl.content.querySelectorAll("strong")]) {
    const entry = lookup(strong.textContent ?? "");
    if (!entry || strong.closest("button")) continue;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "term";
    btn.dataset.term = entry.term.toLowerCase();
    btn.title = "What's this?";
    strong.replaceWith(btn);
    btn.append(strong);
  }
  return tpl.innerHTML;
}

/** Show a definition popover when a linked term inside `root` is clicked. */
export function attachTermPopovers(root: HTMLElement): () => void {
  let pop: HTMLElement | undefined;
  const close = () => {
    pop?.remove();
    pop = undefined;
  };
  const onClick = (e: Event) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("button.term");
    if (!btn) {
      if (pop && !pop.contains(e.target as Node)) close();
      return;
    }
    const entry = TERMS.get(btn.dataset.term ?? "");
    if (!entry) return;
    close();
    pop = h(
      "div",
      { class: "term-pop", role: "dialog", "aria-label": entry.term },
      h("strong", {}, entry.term),
      h("p", {}, entry.def),
    );
    document.body.append(pop);
    const r = btn.getBoundingClientRect();
    const left = Math.min(window.innerWidth - pop.offsetWidth - 8, Math.max(8, r.left + window.scrollX));
    pop.style.left = `${left}px`;
    pop.style.top = `${r.bottom + window.scrollY + 8}px`;
  };
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKey);
  void root;
  return () => {
    close();
    document.removeEventListener("click", onClick);
    document.removeEventListener("keydown", onKey);
  };
}
