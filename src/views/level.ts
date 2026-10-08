import { h, html } from "../dom";
import { getLesson } from "../content";
import { DIAGRAMS } from "../diagrams";
import { isUnlocked, markCleared } from "../progress";
import { go, href } from "../nav";
import { reducedMotion } from "../typewriter";
import { worldOf } from "../worlds";
import { fontToggle } from "./font-toggle";
import { searchButton } from "./search";
import { copyLinkButton } from "./share";
import { focusParts, openDiagram } from "./zoom";
import { blocked, btn, confetti, createDialog, md } from "./dialog";
import { attachTermPopovers, linkTerms } from "./terms";

/** A lesson: short text pages, then it's cleared. The world's boss tests it. */
export function renderLevel(root: HTMLElement, id: string): () => void {
  const lesson = getLesson(id);
  if (!lesson) return blocked(root, "No level here, traveler.");
  if (!isUnlocked(id)) return blocked(root, "This level is still locked. Clear the stops before it first.", true);

  const world = worldOf(id);
  const isLastLesson = world.levels[world.levels.length - 1].id === id;

  const markup = DIAGRAMS[lesson.diagram] ?? "";
  const enlarge = btn("⤢ ENLARGE", () => openDiagram(markup, lesson.title, lesson.focus), "btn btn-small btn-ghost stage-zoom");
  enlarge.setAttribute("aria-label", "Enlarge the diagram");
  const stage = h("div", { class: "stage" }, html(markup), enlarge);
  if (reducedMotion()) stage.querySelector("svg")?.pauseAnimations();
  const d = createDialog("SAGE", { buddy: true });

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href("") }, "◀ MAP"),
      h("span", { class: "chip" }, `WORLD ${lesson.id} · ${world.name.toUpperCase()}`),
      copyLinkButton(`level/${id}`),
      searchButton(),
      fontToggle(),
    ),
    h("main", { class: "level" }, h("h1", { class: "level-title" }, lesson.title), stage, d.el),
  );

  /** Light up the diagram parts this page talks about and dim the rest. */
  const svg = stage.querySelector("svg");
  const focusDiagram = (parts: string[]) => focusParts(svg, parts);

  /** What Enter / Space / → do right now. */
  let advance: (() => void) | undefined;
  let back: (() => void) | undefined;

  function showBox(i: number): void {
    const last = i === lesson!.boxes.length - 1;
    d.setName("SAGE");
    d.setPips(lesson!.boxes.map((_, j) => (j <= i ? "on" : "")));
    d.say(linkTerms(md(lesson!.boxes[i])));
    focusDiagram(lesson!.focus[i] ?? []);
    const next = () => (last ? showClear() : showBox(i + 1));
    advance = next;
    back = i > 0 ? () => showBox(i - 1) : undefined;
    d.setActions(...(back ? [btn("◀ BACK", back, "btn btn-ghost")] : []), btn(last ? "FINISH ▶" : "NEXT ▼", advance));
  }

  function showClear(): void {
    focusDiagram([]);
    markCleared(lesson!.id);
    d.el.classList.add("cleared");
    if (!reducedMotion() && !d.el.querySelector(".confetti")) d.el.append(confetti());
    d.setName("LEVEL CLEAR!");
    d.buddy?.react("cheer");
    d.setPips(lesson!.boxes.map(() => "on"));
    const terms = lesson!.terms.map((t) => t.term).join(", ");
    d.say(
      md(
        `Level ${lesson!.id} cleared!` +
          (terms ? ` New in your Agentdex: ${terms}.` : "") +
          (isLastLesson
            ? `\n\nNext: the **${world.challenge.title}** challenge, then the **${world.boss.name}**. Beat it to open the next world.`
            : `\n\nThe boss at the end of ${world.name} will test you on this.`) +
          (lesson!.deeper ? " Curious? Hit the **?** block first." : ""),
      ),
    );
    const toMap = () => go("");
    advance = toMap;
    back = () => showBox(lesson!.boxes.length - 1);
    d.setActions(btn("◀ BACK", back, "btn btn-ghost"), ...(lesson!.deeper ? [qBlock()] : []), btn("TO THE MAP ▶", toMap));
  }

  /** "?" block: bumps when hit, then opens the deeper section. */
  function qBlock(): HTMLButtonElement {
    const b = btn("", () => {
      b.classList.add("bump");
      window.setTimeout(showDeeper, reducedMotion() ? 0 : 260);
    }, "btn btn-q");
    b.append(h("span", { class: "q-icon", "aria-hidden": "true" }, "?"), "GO DEEPER");
    return b;
  }

  function showDeeper(): void {
    d.setName("BONUS");
    d.say(linkTerms(md(lesson!.deeper!)), false);
    if (lesson!.peek) {
      const peek = h("div", { class: "peek" });
      peek.innerHTML = md(lesson!.peek);
      d.extra.append(h("p", { class: "sources-label" }, "WHAT IT LOOKS LIKE"), peek);
    }
    if (lesson!.sources.length) {
      d.extra.append(
        h("p", { class: "sources-label" }, "SOURCES"),
        h(
          "ul",
          { class: "sources" },
          ...lesson!.sources.map((s) => h("li", {}, h("a", { href: s.url, target: "_blank", rel: "noopener noreferrer" }, s.label))),
        ),
      );
    }
    const toMap = () => go("");
    advance = toMap;
    back = showClear;
    d.setActions(btn("◀ BACK", showClear, "btn btn-ghost"), btn("TO THE MAP ▶", toMap));
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const onControl = (e.target as HTMLElement).closest("button, a");
    if (e.key === "ArrowRight" || ((e.key === " " || e.key === "Enter") && !onControl)) {
      e.preventDefault();
      advance?.();
    } else if (e.key === "ArrowLeft" && back) {
      e.preventDefault();
      back();
    }
  };
  window.addEventListener("keydown", onKey);
  const detachTerms = attachTermPopovers(d.el);

  showBox(0);

  return () => {
    d.destroy();
    detachTerms();
    window.removeEventListener("keydown", onKey);
  };
}
