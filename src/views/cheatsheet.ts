import { h, html } from "../dom";
import { LESSONS, worldContent, worldMinutes } from "../content";
import { DIAGRAMS } from "../diagrams";
import { href } from "../nav";
import { termSlug } from "../search";
import { MAIN_WORLDS, WORLDS } from "../worlds";
import type { World } from "../types";
import { fontToggle } from "./font-toggle";
import { searchButton } from "./search";
import { copyLinkButton } from "./share";
import { btn } from "./dialog";
import { openDiagram } from "./zoom";

/**
 * Printable cheat sheets: key ideas and terms for every world on one page, or
 * one world with its lesson diagrams. Built from the recaps and the Agentdex.
 */
export function renderCheatsheet(root: HTMLElement, worldNum?: number): () => void {
  const world = WORLDS.find((w) => w.num === worldNum);
  const path = world ? `cheatsheet/${world.num}` : "cheatsheet";
  const label = (w: World) => (w.num > MAIN_WORLDS ? "★" : String(w.num));

  const picker = h(
    "nav",
    { class: "cheat-picker", "aria-label": "Choose a cheat sheet" },
    h("a", { class: `btn btn-small${world ? " btn-ghost" : ""}`, href: href("cheatsheet"), "aria-current": world ? undefined : "page" }, "ALL"),
    ...WORLDS.map((w) =>
      h(
        "a",
        { class: `btn btn-small${w === world ? "" : " btn-ghost"}`, href: href(`cheatsheet/${w.num}`), "aria-current": w === world ? "page" : undefined, title: w.name },
        label(w),
      ),
    ),
  );

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href(""), "data-autofocus": true }, "◀ MAP"),
      h("span", { class: "chip" }, world ? `CHEAT SHEET · WORLD ${label(world)}` : "CHEAT SHEET"),
      btn("PRINT", () => window.print(), "btn btn-small"),
      copyLinkButton(path),
      searchButton(),
      fontToggle(),
    ),
    h(
      "main",
      { class: "cheat" },
      h("h1", { class: "level-title" }, world ? `${world.name} cheat sheet` : "Agentica cheat sheet"),
      h(
        "p",
        { class: "cheat-intro" },
        world
          ? "The key ideas, terms and diagrams from this world. Print it, or keep it open while you build."
          : "Every world's key ideas and terms on one page. Pick a world for its diagrams too.",
      ),
      picker,
      ...(world ? [worldSection(world, true)] : WORLDS.map((w) => worldSection(w, false))),
      h("p", { class: "cheat-foot" }, "Agentica · dillon-barry.github.io/Agentica"),
    ),
  );
  return () => {};
}

function worldSection(w: World, withDiagrams: boolean): HTMLElement {
  const lessons = LESSONS.filter((l) => l.world === w.num);
  const terms = lessons.flatMap((l) => l.terms);
  return h(
    "section",
    { class: "box cheat-world" },
    h("h2", {}, `${w.num > MAIN_WORLDS ? "★ BONUS" : `WORLD ${w.num}`} · ${w.name.toUpperCase()}`),
    h("p", { class: "cheat-meta" }, `${w.blurb} · ~${worldMinutes(w.num)} min`),
    h("h3", {}, "KEY IDEAS"),
    h("ul", { class: "cheat-ideas" }, ...worldContent(w.num).recap.map((r) => h("li", {}, r))),
    h("h3", {}, "TERMS"),
    h(
      "dl",
      { class: "cheat-terms" },
      ...terms.flatMap((t) => [h("dt", {}, h("a", { href: href(`agentdex/${termSlug(t.term)}`) }, t.term)), h("dd", {}, t.def)]),
    ),
    h("h3", {}, "LESSONS"),
    withDiagrams
      ? h(
          "div",
          { class: "cheat-diagrams" },
          ...lessons.map((l) => {
            const figure = h(
              "figure",
              {},
              h(
                "button",
                {
                  class: "diagram-zoom",
                  type: "button",
                  "aria-label": `Enlarge the diagram for ${l.title}`,
                  onclick: () => openDiagram(DIAGRAMS[l.diagram] ?? "", l.title, l.focus),
                },
                html(DIAGRAMS[l.diagram] ?? ""),
              ),
              h("figcaption", {}, h("a", { href: href(`level/${l.id}`) }, `${l.id} ${l.title}`)),
            );
            figure.querySelector("svg")?.pauseAnimations();
            return figure;
          }),
        )
      : h("ol", { class: "cheat-lessons" }, ...lessons.map((l) => h("li", {}, h("a", { href: href(`level/${l.id}`) }, `${l.id} ${l.title}`)))),
    h("p", { class: "cheat-meta" }, `Challenge: ${w.challenge.title} · Boss: ${w.boss.name}`),
  );
}
