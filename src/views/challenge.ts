import { h } from "../dom";
import { isUnlocked, markCleared } from "../progress";
import { go, href } from "../nav";
import { reducedMotion } from "../typewriter";
import { WORLDS, challengeId } from "../worlds";
import { CHALLENGES } from "../challenges";
import { fontToggle } from "./font-toggle";
import { searchButton } from "./search";
import { blocked, btn, confetti, md } from "./dialog";
import { attachTermPopovers, linkTerms } from "./terms";
import { createBuddy } from "./buddy";

/** A world's hands-on challenge, between its lessons and its boss. */
export function renderChallenge(root: HTMLElement, worldNum: number): () => void {
  const world = WORLDS.find((w) => w.num === worldNum);
  const challenge = CHALLENGES[worldNum];
  if (!world || !challenge) return blocked(root, "No challenge here, traveler.");
  const id = challengeId(worldNum);
  if (!isUnlocked(id)) return blocked(root, `Clear the levels in ${world.name} to reach its challenge.`, true);

  const intro = h("div", { class: "dialog-text ch-intro" });
  intro.innerHTML = linkTerms(md(challenge.intro));
  const stage = h("section", { class: "box ch" });
  const finish = h("section", { class: "dialog ch-done has-buddy", hidden: true });
  const buddy = createBuddy();

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href("") }, "◀ MAP"),
      h("span", { class: "chip" }, `WORLD ${worldNum} CHALLENGE · ${world.name.toUpperCase()}`),
      searchButton(),
      fontToggle(),
    ),
    h(
      "main",
      { class: "level" },
      h("h1", { class: "level-title" }, world.challenge.title),
      h("section", { class: "dialog" }, h("div", { class: "nametag" }, "CHALLENGE"), intro),
      stage,
      finish,
    ),
  );

  const done = () => {
    markCleared(id);
    const text = h("div", { class: "dialog-text" });
    text.innerHTML = linkTerms(md(challenge.takeaway));
    finish.replaceChildren(
      h("div", { class: "nametag" }, "CHALLENGE CLEAR!"),
      text,
      h(
        "div",
        { class: "dialog-actions" },
        btn("TRY AGAIN", () => {
          root.replaceChildren();
          cleanup();
          cleanup = renderChallenge(root, worldNum);
        }, "btn btn-ghost"),
        btn("TO THE MAP ▶", () => go("")),
      ),
    );
    finish.append(buddy.el);
    finish.hidden = false;
    buddy.react("cheer");
    finish.classList.add("cleared");
    if (!reducedMotion()) finish.append(confetti());
    finish.scrollIntoView({ block: "nearest", behavior: reducedMotion() ? "auto" : "smooth" });
  };

  challenge.mount(stage, done);
  let cleanup = attachTermPopovers(root);
  return () => {
    buddy.destroy();
    cleanup();
  };
}
