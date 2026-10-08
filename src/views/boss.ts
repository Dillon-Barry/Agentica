import { h } from "../dom";
import { HEARTS, bossHp, fightOrder, lessonQuestions, worldContent } from "../content";
import { addMissed, canSkipTo, clearWorld, isUnlocked, removeMissed } from "../progress";
import { go, href } from "../nav";
import { reducedMotion } from "../typewriter";
import { MAIN_WORLDS, WORLDS, bossId } from "../worlds";
import { ARENA_H, ARENA_W, Arena } from "../map/arena";
import { fontToggle } from "./font-toggle";
import { searchButton } from "./search";
import { blocked, btn, confetti, createDialog, md } from "./dialog";

/**
 * A world's boss fight. Questions come from the world's lessons. A right
 * answer hits the boss, a wrong one costs a heart.
 */
export function renderBoss(root: HTMLElement, worldNum: number): () => void {
  const world = WORLDS.find((w) => w.num === worldNum);
  if (!world) return blocked(root, "No boss here, traveler.");
  const id = bossId(worldNum);
  // Skip ahead: the current world's boss can be fought early.
  const skipping = !isUnlocked(id) && canSkipTo(id);
  if (!isUnlocked(id) && !skipping) return blocked(root, `Clear every level in ${world.name} to reach its boss.`, true);

  const { recap, scenarios } = worldContent(worldNum);
  const recall = lessonQuestions(worldNum);
  const maxHp = bossHp(worldNum);
  // World 6 ends the main quest; world 7 (Star Road) is the bonus after it.
  const last = worldNum >= MAIN_WORLDS;
  const bonus = worldNum > MAIN_WORLDS;
  const name = world.boss.name;

  const canvas = h("canvas", { class: "arena-canvas", "aria-hidden": "true" });
  const stage = h("div", { class: "stage arena" }, canvas);
  const arena = new Arena(canvas, world, maxHp, HEARTS);
  const d = createDialog("BOSS");
  const status = h("p", { class: "sr-only", "aria-live": "polite" });

  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href("") }, "◀ MAP"),
      h("span", { class: "chip" }, `WORLD ${worldNum} BOSS · ${world.name.toUpperCase()}`),
      searchButton(),
      fontToggle(),
    ),
    h("main", { class: "level" }, h("h1", { class: "level-title" }, name), stage, status, d.el),
  );

  // Whole device pixels per arena pixel, so the art stays crisp.
  const layout = () => {
    const dpr = window.devicePixelRatio || 1;
    const k = Math.max(1, Math.floor((stage.clientWidth * dpr) / ARENA_W));
    canvas.style.width = `${(ARENA_W * k) / dpr}px`;
    canvas.style.height = `${(ARENA_H * k) / dpr}px`;
  };
  const resize = new ResizeObserver(layout);
  resize.observe(stage);
  layout();
  arena.start();

  let advance: (() => void) | undefined;
  let order = fightOrder(scenarios, recall);
  let asked = 0;

  const report = () => (status.textContent = `${name}: ${arena.hp} of ${maxHp} HP. You: ${arena.hearts} of ${HEARTS} hearts.`);

  /** Before the fight: a one-screen reminder of the world's key ideas. */
  function showRecap(): void {
    d.setName("WHAT YOU LEARNED");
    d.say(md(recap.map((r) => `- ${r}`).join("\n")), false);
    advance = intro;
    d.extra.append(h("p", { class: "recap-sheet" }, h("a", { href: href(`cheatsheet/${worldNum}`) }, `Cheat sheet for ${world!.name}`), ": key ideas, terms and diagrams on one page."));
    d.setActions(btn("◀ MAP", () => go(""), "btn btn-ghost"), btn("I'M READY ▶", intro));
  }

  function intro(): void {
    d.setName("BOSS");
    d.say(
      md(
        (skipping
          ? `**Skipping ahead.** Beat the **${name}** and all of ${world!.name} counts as cleared, Agentdex terms included. Lose, and nothing changes: the lessons are still there.\n\n`
          : "") +
          `The **${name}** guards the way out of ${world!.name}! Some questions check the basics. Others give you a situation and ask what you'd do.\n\n` +
          `Each right answer hits it. Each wrong answer costs you a heart. **${maxHp} hits** to win, **${HEARTS} hearts** to lose.`,
      ),
    );
    advance = fight;
    d.setActions(btn("◀ MAP", () => go(""), "btn btn-ghost"), btn("FIGHT ▶", fight));
  }

  function fight(): void {
    arena.reset();
    d.el.classList.remove("cleared");
    order = fightOrder(scenarios, recall);
    asked = 0;
    report();
    question();
  }

  function question(): void {
    const q = order[asked++ % order.length];
    d.setName(`QUESTION ${asked}`);
    advance = () => d.finishTyping();
    d.ask(q, (correct) => {
      advance = undefined;
      // Wrong answers go to the review pile on the Agentdex page.
      if (correct) removeMissed(q.q);
      else addMissed(q.q);
      const after = () => {
        report();
        if (arena.hp === 0) {
          advance = victory;
          d.setActions(btn("VICTORY ▶", victory));
        } else if (arena.hearts === 0) {
          advance = defeat;
          d.setActions(btn("CONTINUE ▶", defeat));
        } else {
          advance = question;
          d.setActions(btn("NEXT ▶", question));
        }
      };
      // The arena shakes when a hit lands.
      const land = () => {
        if (!reducedMotion()) {
          stage.classList.remove("shake");
          void stage.offsetWidth;
          stage.classList.add("shake");
        }
        after();
      };
      if (correct) arena.hitBoss(land);
      else arena.hitPlayer(land);
    });
  }

  function victory(): void {
    // Beating a boss clears its whole world, even when you skipped ahead.
    clearWorld(worldNum);
    d.el.classList.add("cleared");
    if (!reducedMotion()) d.el.append(confetti());
    d.setName("BOSS DEFEATED!");
    d.say(
      md(
        bonus
          ? `You beat the **${name}** and conquered the Star Road! That's expert territory: sandboxes, guardrails, MCP sign-in, cost, evals and browser agents.`
          : last
            ? `You beat the **${name}** and finished Agentica! You know where agents came from, how they work, why they're hard to secure, and how to keep them in check. **Quest complete!** A bonus Star Road has appeared on the map.`
            : `You beat the **${name}**! ${world!.name} is clear${skipping ? ", and its Agentdex terms are yours" : ""}. Head back to the map: the road to World ${worldNum + 1} is open.`,
      ),
    );
    const toMap = () => go("");
    const toFinish = () => go("finish");
    advance = last ? toFinish : toMap;
    d.setActions(...(last ? [btn("◀ MAP", toMap, "btn btn-ghost"), btn("SEE YOUR RESULTS ▶", toFinish)] : [btn("TO THE MAP ▶", toMap)]));
  }

  function defeat(): void {
    d.setName("KNOCKED OUT");
    d.say(md(`The **${name}** wins this round. Review the lessons on the map, or jump straight back in. The questions get shuffled.`));
    advance = fight;
    d.setActions(btn("◀ MAP", () => go(""), "btn btn-ghost"), btn("RETRY ▶", fight));
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const k = Math.max("1234".indexOf(e.key), "abcd".indexOf(e.key.toLowerCase()));
    if (k >= 0 && d.pick(k)) {
      e.preventDefault();
      return;
    }
    const onControl = (e.target as HTMLElement).closest("button, a");
    if (e.key === "ArrowRight" || ((e.key === " " || e.key === "Enter") && !onControl)) {
      e.preventDefault();
      advance?.();
    }
  };
  window.addEventListener("keydown", onKey);

  if (recap.length) showRecap();
  else intro();

  return () => {
    arena.stop();
    resize.disconnect();
    d.destroy();
    window.removeEventListener("keydown", onKey);
  };
}
