import { h } from "../dom";
import { LESSONS, QUESTIONS } from "../content";
import { isCleared, missedQuestions, removeMissed } from "../progress";
import { href } from "../nav";
import { fontToggle } from "./font-toggle";
import { searchButton } from "./search";
import { btn, createDialog } from "./dialog";
import { copyLinkButton } from "./share";
import { termSlug } from "../search";

/**
 * Glossary of collected terms, plus a review pile of boss questions you got wrong.
 * `target` is a term slug from a shared link: that entry is shown and highlighted.
 */
export function renderAgentdex(root: HTMLElement, target?: string): () => void {
  const all = LESSONS.flatMap((l) => l.terms.map((t) => ({ ...t, lesson: l.id, found: isCleared(l.id) })));
  const found = all.filter((t) => t.found).length;

  const review = h("section", { class: "box review", "aria-labelledby": "review-title" });
  let keyHandler: ((e: KeyboardEvent) => void) | undefined;

  /** Review summary, or the practice round when started. */
  function renderReview(): void {
    const pile = missedQuestions().filter((q) => QUESTIONS.has(q));
    review.replaceChildren(h("h2", { class: "finish-heading", id: "review-title" }, `REVIEW · ${pile.length} TO PRACTISE`));
    if (!pile.length) {
      review.append(h("p", {}, "Boss questions you get wrong land here, so you can practise just those. Nothing to review right now."));
      return;
    }
    review.append(
      h("p", {}, "Questions you missed in boss fights. Get one right and it leaves the pile."),
      h("div", { class: "dialog-actions" }, btn("PRACTISE ▶", () => practise(pile))),
    );
  }

  function practise(pile: string[]): void {
    const d = createDialog("REVIEW", { buddy: true });
    const queue = [...pile];
    let right = 0;
    review.replaceChildren(d.el);
    const next = () => {
      const text = queue.shift();
      if (!text) {
        d.setName("REVIEW DONE");
        d.say(`<p>You got ${right} of ${pile.length} right. ${missedQuestions().length ? "The rest stay in the pile for next time." : "The pile is empty. Nice work!"}</p>`, false);
        d.setActions(btn("BACK TO AGENTDEX", renderReview));
        return;
      }
      const q = QUESTIONS.get(text)!;
      d.setName(`REVIEW ${pile.length - queue.length}/${pile.length}`);
      d.ask(q, (correct) => {
        if (correct) {
          right++;
          removeMissed(text);
        }
        d.setActions(btn(queue.length ? "NEXT ▶" : "FINISH ▶", next));
      });
    };
    keyHandler = (e: KeyboardEvent) => {
      const k = Math.max("1234".indexOf(e.key), "abcd".indexOf(e.key.toLowerCase()));
      if (k >= 0 && d.pick(k)) e.preventDefault();
    };
    window.addEventListener("keydown", keyHandler);
    next();
  }

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href(""), "data-autofocus": !target }, "◀ MAP"),
      h("span", { class: "chip" }, `AGENTDEX · ${found}/${all.length} FOUND`),
      searchButton(),
      fontToggle(),
    ),
    h(
      "main",
      { class: "dex" },
      h("h1", { class: "level-title" }, "Agentdex"),
      review,
      h("p", { class: "dex-intro" }, "Every term you collect by clearing levels. Locked entries show which level holds them. Want them all on one page? ", h("a", { href: href("cheatsheet") }, "Open the cheat sheet"), "."),
      h(
        "ol",
        { class: "dex-list" },
        ...all.map((t, i) => {
          const slug = termSlug(t.term);
          // A shared link always shows its term, collected or not.
          const shown = t.found || slug === target;
          return h(
            "li",
            { class: `dex-entry${shown ? "" : " unknown"}${slug === target ? " dex-target" : ""}`, id: `term-${slug}` },
            h("span", { class: "dex-num" }, String(i + 1).padStart(3, "0")),
            h(
              "div",
              {},
              h("h2", {}, shown ? t.term : "???"),
              h("p", {}, shown ? t.def : `Clear level ${t.lesson} to unlock.`),
              shown && !t.found ? h("p", { class: "dex-note" }, `Shared with you. Level ${t.lesson} teaches it, and clearing it adds it to your Agentdex.`) : null,
            ),
            shown ? copyLinkButton(`agentdex/${slug}`, "LINK", "btn btn-small btn-ghost dex-link") : null,
          );
        }),
      ),
    ),
  );
  renderReview();
  if (target) {
    const el = document.getElementById(`term-${target}`);
    el?.scrollIntoView({ block: "center" });
    el?.querySelector<HTMLElement>(".dex-link")?.setAttribute("data-autofocus", "");
  }

  return () => {
    if (keyHandler) window.removeEventListener("keydown", keyHandler);
  };
}
