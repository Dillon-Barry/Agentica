import { h } from "../dom";
import { LESSONS } from "../content";
import { isCleared } from "../progress";
import { href } from "../nav";
import { fontToggle } from "./font-toggle";

export function renderAgentdex(root: HTMLElement): () => void {
  const all = LESSONS.flatMap((l) => l.terms.map((t) => ({ ...t, lesson: l.id, found: isCleared(l.id) })));
  const found = all.filter((t) => t.found).length;

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href(""), "data-autofocus": true }, "◀ MAP"),
      h("span", { class: "chip" }, `AGENTDEX · ${found}/${all.length} FOUND`),
      fontToggle(),
    ),
    h(
      "main",
      { class: "dex" },
      h("h1", { class: "level-title" }, "Agentdex"),
      h("p", { class: "dex-intro" }, "Every term you collect by clearing levels. Locked entries show which level holds them."),
      h(
        "ol",
        { class: "dex-list" },
        ...all.map((t, i) =>
          h(
            "li",
            { class: `dex-entry${t.found ? "" : " unknown"}` },
            h("span", { class: "dex-num" }, String(i + 1).padStart(3, "0")),
            h("div", {}, h("h2", {}, t.found ? t.term : "???"), h("p", {}, t.found ? t.def : `Clear level ${t.lesson} to unlock.`)),
          ),
        ),
      ),
    ),
  );

  return () => {};
}
