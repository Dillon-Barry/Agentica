import { h } from "../dom";
import { HEARTS, bossHp, bossPool } from "../content";
import { isUnlocked, markCleared } from "../progress";
import { go, href } from "../nav";
import { reducedMotion } from "../typewriter";
import { WORLDS, bossId } from "../worlds";
import { ARENA_H, ARENA_W, Arena } from "../map/arena";
import { fontToggle } from "./font-toggle";
import { blocked, btn, confetti, createDialog, md } from "./dialog";

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * A world's boss fight. Questions come from the world's lessons. A right
 * answer hits the boss, a wrong one costs a heart.
 */
export function renderBoss(root: HTMLElement, worldNum: number): () => void {
  const world = WORLDS.find((w) => w.num === worldNum);
  if (!world) return blocked(root, "No boss here, traveler.");
  const id = bossId(worldNum);
  if (!isUnlocked(id)) return blocked(root, `Clear every level in ${world.name} to reach its boss.`);

  const pool = bossPool(worldNum);
  const maxHp = bossHp(worldNum);
  const last = worldNum === WORLDS.length;
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
  let order = shuffle(pool);
  let asked = 0;

  const report = () => (status.textContent = `${name}: ${arena.hp} of ${maxHp} HP. You: ${arena.hearts} of ${HEARTS} hearts.`);

  function intro(): void {
    d.setName("BOSS");
    d.say(
      md(
        `The **${name}** guards the way out of ${world!.name}! Answer questions from this world's lessons.\n\n` +
          `Each right answer hits it. Each wrong answer costs you a heart. **${maxHp} hits** to win, **${HEARTS} hearts** to lose.`,
      ),
    );
    advance = fight;
    d.setActions(btn("◀ MAP", () => go(""), "btn btn-ghost"), btn("FIGHT ▶", fight));
  }

  function fight(): void {
    arena.reset();
    d.el.classList.remove("cleared");
    order = shuffle(pool);
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
      if (correct) arena.hitBoss(after);
      else arena.hitPlayer(after);
    });
  }

  function victory(): void {
    markCleared(id);
    d.el.classList.add("cleared");
    if (!reducedMotion()) d.el.append(confetti());
    d.setName("BOSS DEFEATED!");
    d.say(
      md(
        last
          ? `You beat the **${name}** and finished Agentica! You know where agents came from, how they work, why they're hard to secure, and how to keep them in check. **Quest complete!**`
          : `You beat the **${name}**! ${world!.name} is clear. Head back to the map: the road to World ${worldNum + 1} is open.`,
      ),
    );
    const toMap = () => go("");
    advance = toMap;
    d.setActions(btn("TO THE MAP ▶", toMap));
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

  intro();

  return () => {
    arena.stop();
    resize.disconnect();
    d.destroy();
    window.removeEventListener("keydown", onKey);
  };
}
