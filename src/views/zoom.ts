import { h, html } from "../dom";
import { reducedMotion } from "../typewriter";
import { btn } from "./dialog";

/** Light up the named parts of a diagram and dim the rest ([] shows it all). */
export function focusParts(svg: SVGSVGElement | null, parts: string[]): void {
  if (!svg) return;
  svg.classList.toggle("focusing", parts.length > 0);
  svg.querySelectorAll<SVGGElement>("[data-part]").forEach((g) => g.classList.toggle("lit", parts.includes(g.dataset.part ?? "")));
}

const STEP_MS = 1600;

/**
 * Full-screen view of a diagram. With a lesson's focus lists, REPLAY steps
 * through what each page highlighted.
 */
export function openDiagram(markup: string, title: string, focus: string[][] = []): void {
  document.querySelector(".zoom")?.remove();
  const opener = document.activeElement as HTMLElement | null;
  const steps = focus.filter((f) => f.length);
  const stage = h("div", { class: "zoom-stage" }, html(markup));
  const svg = stage.querySelector("svg");
  if (reducedMotion()) svg?.pauseAnimations();
  const caption = h("p", { class: "zoom-caption", "aria-live": "polite" });
  let step = -1;
  let timer = 0;

  const show = (i: number) => {
    step = i;
    focusParts(svg, i < 0 ? [] : steps[i]);
    caption.textContent = i < 0 ? "Whole diagram" : `Highlight ${i + 1} of ${steps.length}: ${steps[i].join(", ").replace(/-/g, " ")}`;
  };
  const stop = () => window.clearInterval(timer);
  const replay = () => {
    stop();
    show(0);
    if (reducedMotion()) return;
    timer = window.setInterval(() => {
      if (step + 1 >= steps.length) {
        stop();
        show(-1);
      } else show(step + 1);
    }, STEP_MS);
  };
  const move = (d: number) => {
    stop();
    show(Math.max(-1, Math.min(steps.length - 1, step + d)));
  };

  const closeBtn = btn("CLOSE ✕", () => close(), "btn btn-small");
  const controls = steps.length
    ? h(
        "div",
        { class: "dialog-actions zoom-controls" },
        btn("◀", () => move(-1), "btn btn-small btn-ghost"),
        btn("REPLAY ▶", replay, "btn btn-small"),
        btn("▶", () => move(1), "btn btn-small btn-ghost"),
      )
    : null;
  const overlay = h(
    "div",
    { class: "zoom", role: "dialog", "aria-modal": "true", "aria-label": `Diagram: ${title}` },
    h(
      "section",
      { class: "box zoom-card" },
      h("div", { class: "zoom-head" }, h("h2", {}, title), closeBtn),
      stage,
      h("p", { class: "zoom-hint" }, "Swipe sideways to see the whole diagram."),
      steps.length ? caption : null,
      controls,
    ),
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight" && steps.length) move(1);
    else if (e.key === "ArrowLeft" && steps.length) move(-1);
    else return;
    e.preventDefault();
    e.stopPropagation();
  };
  function close(): void {
    stop();
    overlay.remove();
    window.removeEventListener("keydown", onKey, true);
    opener?.focus?.({ preventScroll: true });
  }
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  window.addEventListener("keydown", onKey, true);
  document.body.append(overlay);
  show(-1);
  closeBtn.focus();
}
