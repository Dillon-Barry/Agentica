import { h } from "../dom";
import { LESSONS, worldContent } from "../content";
import { clearedCount, isCleared } from "../progress";
import { href } from "../nav";
import { reducedMotion } from "../typewriter";
import { ROUTE, WORLDS, bossId } from "../worlds";
import { fontToggle } from "./font-toggle";
import { blocked, btn, confetti } from "./dialog";

/** The end of the quest: what you learned in every world, and a link to share. */
export function renderFinish(root: HTMLElement): () => void {
  if (!isCleared(bossId(WORLDS.length))) return blocked(root, "Beat the final boss in the Solo Citadel to see your results.");

  const terms = LESSONS.reduce((n, l) => n + l.terms.length, 0);
  const site = `${location.origin}${location.pathname}`;
  const shareStatus = h("p", { class: "bar-status", "aria-live": "polite" });

  const share = async () => {
    const text = "I finished Agentica: a retro quest from zero to expert in AI agents.";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Agentica", text, url: site });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${site}`);
      shareStatus.textContent = "Link copied. Paste it anywhere.";
    } catch {
      shareStatus.textContent = `Share this link: ${site}`;
    }
  };

  const hero = h(
    "section",
    { class: "dialog cleared finish-hero" },
    h("div", { class: "nametag" }, "QUEST COMPLETE!"),
    h(
      "div",
      { class: "dialog-text" },
      h("p", {}, "Bit started as a chatbot. It learned to think, plan and remember, picked up tools and skills, joined a team, survived the Shadow Dungeon, and now runs safely in the Citadel. So do you: you went from zero to the ideas experts use every day."),
      h(
        "p",
        { class: "finish-stats" },
        `★ ${clearedCount()}/${ROUTE.length} STOPS · ${WORLDS.length} BOSSES BEATEN · ${terms} AGENTDEX TERMS`,
      ),
    ),
    h(
      "div",
      { class: "dialog-actions" },
      h("a", { class: "btn btn-ghost", href: href("agentdex") }, "AGENTDEX"),
      h("a", { class: "btn btn-ghost", href: href("") }, "◀ MAP"),
      btn("SHARE AGENTICA ▶", () => void share()),
    ),
    shareStatus,
  );
  if (!reducedMotion()) hero.append(confetti());

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href("") }, "◀ MAP"),
      h("span", { class: "chip" }, "YOUR RESULTS"),
      fontToggle(),
    ),
    h(
      "main",
      { class: "level" },
      h("h1", { class: "level-title" }, "You did it!"),
      hero,
      h(
        "ol",
        { class: "finish-worlds" },
        ...WORLDS.map((w) =>
          h(
            "li",
            { class: "box finish-world" },
            h("h2", {}, `WORLD ${w.num} · ${w.name.toUpperCase()}`),
            h("ul", {}, ...worldContent(w.num).recap.map((r) => h("li", {}, r))),
          ),
        ),
      ),
    ),
  );
  return () => {};
}
