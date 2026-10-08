import { marked } from "marked";
import { h } from "../dom";
import { href } from "../nav";
import { setStudyMode } from "../progress";
import { reducedMotion, typewrite, type Typing } from "../typewriter";
import type { QuizQuestion } from "../types";
import { createBuddy, type Buddy } from "./buddy";

/** Shared RPG message box used by lessons and boss fights. */

export const md = (src: string): string => marked.parse(src, { async: false });

export const btn = (label: string, onclick: () => void, cls = "btn") =>
  h("button", { class: cls, type: "button", onclick }, label);

export interface Dialog {
  el: HTMLElement;
  /** Bit standing on the box, when the dialog has one. */
  buddy?: Buddy;
  setName(name: string): void;
  setPips(states: string[]): void;
  /** Show markdown-rendered HTML, typed out unless `animate` is false. */
  say(markup: string, animate?: boolean): void;
  /** Reveal the rest of the text if it's still typing. Returns true if it was. */
  finishTyping(): boolean;
  extra: HTMLElement;
  live: HTMLElement;
  setActions(...els: HTMLElement[]): void;
  /** Ask a multiple-choice question; `onAnswer` fires the moment one is picked. */
  ask(q: QuizQuestion, onAnswer: (correct: boolean) => void): void;
  /** Number key pressed (0-based); picks an option while a question is open. */
  pick(k: number): boolean;
  destroy(): void;
}

export function createDialog(name: string, opts: { buddy?: boolean } = {}): Dialog {
  const nametag = h("div", { class: "nametag" }, name);
  const pips = h("div", { class: "pips", "aria-hidden": "true" });
  const text = h("div", { class: "dialog-text" });
  const live = h("div", { class: "sr-only", "aria-live": "polite" });
  const extra = h("div", { class: "dialog-extra" });
  const actions = h("div", { class: "dialog-actions" });
  const el = h("section", { class: "dialog", tabindex: "-1" }, nametag, pips, text, extra, live, actions);
  const buddy = opts.buddy ? createBuddy() : undefined;
  if (buddy) {
    el.append(buddy.el);
    el.classList.add("has-buddy");
  }

  let typing: Typing | undefined;
  let picker: ((k: number) => void) | undefined;

  const d: Dialog = {
    el,
    buddy,
    extra,
    live,
    setName: (n) => {
      nametag.textContent = n;
      delete el.dataset.verdict;
    },
    setPips: (states) => pips.replaceChildren(...states.map((s) => h("span", { class: `pip ${s}` }))),
    say(markup, animate = true) {
      typing?.cancel();
      typing = undefined;
      picker = undefined;
      live.innerHTML = markup;
      extra.replaceChildren();
      if (animate) typing = typewrite(text, markup);
      else text.innerHTML = markup;
    },
    finishTyping() {
      if (!typing?.active()) return false;
      typing.finish();
      return true;
    },
    setActions(...els) {
      actions.replaceChildren(...els);
      els[els.length - 1]?.focus({ preventScroll: true });
    },
    ask(q, onAnswer) {
      d.say(md(q.q));
      const options = q.options.map((opt, k) =>
        h(
          "button",
          { class: "option", type: "button", onclick: () => picker?.(k) },
          h("span", { class: "option-key" }, String.fromCharCode(65 + k)),
          h("span", {}, opt),
        ),
      );
      extra.append(h("div", { class: "options" }, ...options));
      actions.replaceChildren();
      // Focus the box, not an option, so a held Enter key can't pick an answer.
      el.focus({ preventScroll: true });

      picker = (k) => {
        if (k >= q.options.length) return;
        picker = undefined;
        typing?.finish();
        const correct = k === q.answer;
        options.forEach((o, j) => {
          o.disabled = true;
          if (j === q.answer) o.classList.add("right");
          else if (j === k) o.classList.add("wrong");
        });
        options[k].append(h("span", { class: "option-tag" }, correct ? "RIGHT!" : "WRONG!"));
        nametag.textContent = correct ? "RIGHT!" : "WRONG!";
        el.dataset.verdict = correct ? "right" : "wrong";
        buddy?.react(correct ? "cheer" : "slump");
        // A wrong pick explains why that option is wrong, then why the right one is right.
        const whyNot = !correct ? q.explain?.[k] : undefined;
        const verdict = h(
          "div",
          { class: `verdict ${correct ? "right" : "wrong"}` },
          h("p", {}, h("strong", {}, correct ? "✔ RIGHT! " : "✘ WRONG. "), whyNot ?? q.why),
          whyNot ? h("p", {}, h("strong", {}, "THE RIGHT ANSWER: "), q.why) : null,
        );
        extra.append(verdict);
        verdict.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
        live.textContent = correct ? `Right. ${q.why}` : `Wrong. ${whyNot ? `${whyNot} The right answer: ` : ""}${q.why}`;
        onAnswer(correct);
      };
    },
    pick(k) {
      if (!picker) return false;
      picker(k);
      return true;
    },
    destroy: () => {
      typing?.cancel();
      buddy?.destroy();
    },
  };
  return d;
}

/** A burst of square confetti falling over an element. */
export function confetti(): HTMLElement {
  const colors = ["#f8d800", "#e83800", "#00a800", "#58d8f8", "#f8f8f8"];
  return h(
    "div",
    { class: "confetti", "aria-hidden": "true" },
    ...Array.from({ length: 18 }, (_, i) =>
      h("span", {
        style: `left:${(i * 37) % 100}%;background:${colors[i % colors.length]};animation-delay:${(i % 6) * 0.08}s;--drift:${((i % 5) - 2) * 18}px`,
      }),
    ),
    // A burst of stars from the middle, like grabbing a power-up.
    ...Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return h("i", { class: "star", style: `--dx:${Math.round(Math.cos(a) * 120)}px;--dy:${Math.round(Math.sin(a) * 70)}px` }, "★");
    }),
  );
}

/** Message shown for a locked or missing stop. Locked stops offer study mode. */
export function blocked(root: HTMLElement, message: string, locked = false): () => void {
  const study = () => {
    setStudyMode(true);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  };
  root.append(
    h(
      "main",
      { class: "level blocked" },
      h(
        "section",
        { class: "dialog" },
        h("div", { class: "nametag" }, "SAGE"),
        h(
          "div",
          { class: "dialog-text" },
          h("p", {}, message),
          locked ? h("p", {}, "Just want to read it? Study mode opens every stop, and anything you finish still counts.") : null,
        ),
        h(
          "div",
          { class: "dialog-actions" },
          h("a", { class: locked ? "btn btn-ghost" : "btn", href: href(""), "data-autofocus": !locked }, "◀ MAP"),
          locked ? h("button", { class: "btn", type: "button", onclick: study, "data-autofocus": true }, "OPEN IN STUDY MODE ▶") : null,
        ),
      ),
    ),
  );
  return () => {};
}
