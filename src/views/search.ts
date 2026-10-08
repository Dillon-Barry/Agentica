import { h } from "../dom";
import { isUnlocked } from "../progress";
import { href } from "../nav";
import { search, type ResultKind } from "../search";

const KIND: Record<ResultKind, string> = { lesson: "LESSON", term: "AGENTDEX", challenge: "CHALLENGE", boss: "BOSS" };

/** Search box over the whole course. Opens with "/" or the SEARCH button. */
export function openSearch(): void {
  if (document.querySelector(".search")) return;
  const opener = document.activeElement as HTMLElement | null;

  const input = h("input", {
    type: "search",
    class: "search-input",
    placeholder: "Search lessons and terms…",
    "aria-label": "Search Agentica",
    autocomplete: "off",
    spellcheck: "false",
  });
  const list = h("ul", { class: "search-results", id: "search-results" });
  const count = h("p", { class: "search-count", "aria-live": "polite" });
  const overlay = h(
    "div",
    { class: "search", role: "dialog", "aria-modal": "true", "aria-label": "Search" },
    h(
      "section",
      { class: "box search-card" },
      h("div", { class: "search-row" }, input, h("button", { class: "btn btn-small btn-ghost", type: "button", onclick: () => close() }, "ESC")),
      count,
      list,
    ),
  );

  const links = () => [...list.querySelectorAll<HTMLAnchorElement>("a")];

  function render(): void {
    const q = input.value.trim();
    const results = search(q);
    list.replaceChildren(
      ...results.map((r) => {
        const locked = r.kind !== "term" && !isUnlocked(r.stop);
        return h(
          "li",
          {},
          h(
            "a",
            { href: href(r.path), class: "search-hit", onclick: () => close(false) },
            h("span", { class: "search-kind" }, `${KIND[r.kind]} ${r.stop}${locked ? " · LOCKED" : ""}`),
            h("strong", {}, r.title),
            h("span", { class: "search-snippet" }, r.snippet),
          ),
        );
      }),
    );
    count.textContent = q ? (results.length ? `${results.length} result${results.length > 1 ? "s" : ""}` : "No results. Try another word.") : "Type a word, like MCP or injection.";
  }

  const onKey = (e: KeyboardEvent) => {
    const items = links();
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      items[Math.min(items.length - 1, i + 1)]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (i <= 0) input.focus();
      else items[i - 1].focus();
    } else if (e.key === "Enter" && document.activeElement === input && items[0]) {
      e.preventDefault();
      items[0].click();
    }
    // Keep the page underneath from reacting (arrow keys walk the map).
    e.stopPropagation();
  };

  function close(restoreFocus = true): void {
    overlay.remove();
    window.removeEventListener("keydown", onKey, true);
    if (restoreFocus) opener?.focus?.({ preventScroll: true });
  }

  input.addEventListener("input", render);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener("keydown", onKey, true);
  document.body.append(overlay);
  render();
  input.focus();
}

/** Header button that opens the search box. */
export const searchButton = () =>
  h("button", { class: "btn btn-small btn-ghost", type: "button", title: "Search (press /)", onclick: () => openSearch() }, "SEARCH");
