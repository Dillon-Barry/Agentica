import { h } from "../dom";
import { getLesson } from "../content";
import {
  clearedCount,
  getPosition,
  getRevealed,
  introSeen,
  isCleared,
  isUnlocked,
  resetProgress,
  setPosition,
  setRevealed,
  setIntroSeen,
} from "../progress";
import { go, href } from "../nav";
import { reducedMotion } from "../typewriter";
import { MAIN_WORLDS, MAP_H, MAP_W, ROUTE, WORLDS, worldOf } from "../worlds";
import { OverworldRenderer, type NodeState } from "../map/render";
import { SEGMENTS, nodePx, pointAt } from "../map/route";
import { fontToggle } from "./font-toggle";

const SPEED = 0.09; // map pixels per ms
const DRAW_SPEED = 0.12; // road reveal, map pixels per ms

let renderer: OverworldRenderer | undefined;

function stateOf(i: number): NodeState {
  const l = ROUTE[i];
  if (!l.boss && !l.challenge && !getLesson(l.id)) return "soon";
  if (isCleared(l.id)) return "cleared";
  return isUnlocked(l.id) ? "open" : "locked";
}

const STATUS: Record<NodeState, string> = {
  cleared: "Cleared! Replay any time.",
  open: "Ready. Press PLAY.",
  locked: "Locked. Clear the stops before it first.",
  soon: "Coming soon.",
};

const CHALLENGE_STATUS: Record<NodeState, string> = {
  cleared: "Challenge beaten! Try it again any time.",
  open: "Hands-on challenge. Press PLAY.",
  locked: "Clear the levels before it first.",
  soon: "Coming soon.",
};

const BOSS_STATUS: Record<NodeState, string> = {
  cleared: "Defeated! Fight again any time.",
  open: "The boss awaits. Press FIGHT.",
  locked: "Clear every level in this world to reach the boss.",
  soon: "Coming soon.",
};

export function renderMap(root: HTMLElement): () => void {
  renderer ??= new OverworldRenderer();
  const draw = renderer;

  const states = ROUTE.map((_, i) => stateOf(i));
  const playable = (i: number) => states[i] === "cleared" || states[i] === "open";
  // Stops unlock in order, so playable stops are always a prefix of the route.
  const firstBlocked = states.findIndex((_, i) => !playable(i));
  const maxPlayable = firstBlocked === -1 ? ROUTE.length - 1 : Math.max(0, firstBlocked - 1);
  const revealedBefore = Math.min(getRevealed(), maxPlayable + 1);

  const saved = ROUTE.findIndex((l) => l.id === getPosition());
  let pos = saved >= 0 && playable(saved) ? saved : maxPlayable;
  // Just cleared something? Start on it so the new road opens in front of you.
  if (revealedBefore <= maxPlayable) pos = Math.min(pos, revealedBefore - 1);

  // ---- Road reveal schedule ---------------------------------------------------
  const revealStart = performance.now() + 450;
  const segStart = new Map<number, number>();
  let offset = 0;
  for (let s = revealedBefore - 1; s < maxPlayable; s++) {
    segStart.set(s, offset);
    offset += SEGMENTS[s].length / DRAW_SPEED + 200;
  }
  if (revealedBefore <= maxPlayable) setRevealed(maxPlayable + 1);
  const skipReveal = reducedMotion();

  const roadShown = (seg: number): number => {
    if (seg < revealedBefore - 1) return SEGMENTS[seg].length;
    const start = segStart.get(seg);
    if (start === undefined) return -1;
    if (skipReveal) return SEGMENTS[seg].length;
    return Math.min(SEGMENTS[seg].length, (performance.now() - revealStart - start) * DRAW_SPEED);
  };
  const nodeHidden = (i: number): boolean =>
    i > 0 && i >= revealedBefore && i <= maxPlayable && roadShown(i - 1) < SEGMENTS[i - 1].length;

  // ---- DOM --------------------------------------------------------------------
  const canvas = h("canvas", { class: "map-canvas" });
  const viewport = h(
    "div",
    {
      class: "viewport",
      role: "application",
      "aria-label": "Overworld map. Left and right arrow keys walk between stops, Enter plays.",
    },
    canvas,
  );
  const ctx = canvas.getContext("2d")!;

  const barWorld = h("span", { class: "bar-world" });
  const barTitle = h("h2", { class: "bar-title" });
  const barStatus = h("p", { class: "bar-status", "aria-live": "polite" });
  const bar = h(
    "section",
    { class: "map-bar" },
    h("div", { class: "bar-text" }, barWorld, barTitle, barStatus),
    h("p", { class: "bar-hint" }, "ARROWS WALK · ENTER PLAYS · CLICK A STOP"),
  );

  // The PLAY card floats just under the stop Bit is standing on.
  const cardKind = h("span", { class: "stop-kind" });
  const cardTitle = h("span", { class: "stop-title" });
  const playBtn = h("button", { class: "btn btn-go", type: "button", onclick: () => enter() }, "PLAY");
  const card = h("div", { class: "stop-card", hidden: true }, cardKind, cardTitle, playBtn);
  viewport.append(card);

  const reset = h(
    "button",
    {
      class: "btn btn-small btn-ghost",
      type: "button",
      onclick: () => {
        if (!confirm("Erase all progress and start over?")) return;
        resetProgress();
        cleanup();
        root.replaceChildren();
        cleanup = renderMap(root);
      },
    },
    "RESET",
  );

  // Keyboard and screen-reader users can skip the canvas and use the plain list.
  const list = levelList(states);
  const skip = h(
    "button",
    {
      class: "skip-link",
      type: "button",
      onclick: () => {
        list.open = true;
        list.querySelector("summary")!.focus();
      },
    },
    "Skip to the list of all levels",
  );

  root.append(
    skip,
    h(
      "header",
      { class: "hud" },
      h("h1", { class: "logo" }, "AGENTICA"),
      h(
        "div",
        { class: "hud-right" },
        h("span", { class: "counter", title: "Stops cleared" }, `★ ${String(clearedCount()).padStart(2, "0")}/${ROUTE.length}`),
        h("a", { class: "btn btn-small", href: href("agentdex") }, "AGENTDEX"),
        h("button", { class: "btn btn-small btn-ghost", type: "button", title: "How to play", onclick: () => showIntro() }, "?"),
        fontToggle(),
        reset,
      ),
    ),
    h("main", { class: "map-frame" }, viewport, bar),
    list,
  );
  // The overworld takes the whole window, edge to edge.
  document.body.classList.add("map-mode");

  // ---- Scale + camera -----------------------------------------------------------
  // The map is drawn 1:1 in map pixels, then scaled up to fill the window. On
  // small screens it stays readable and the camera follows the player.
  let cssPerPx = 1;
  const cam = { x: 0, y: 0 };
  const camTarget = { x: 0, y: 0 };

  const clamp = (v: number, size: number, view: number) => {
    const max = size - view;
    return max < 0 ? max / 2 : Math.min(Math.max(v, 0), max);
  };

  const aim = (x: number, y: number, snap = false) => {
    camTarget.x = clamp(x - canvas.width / 2, MAP_W, canvas.width);
    camTarget.y = clamp(y - canvas.height / 2, MAP_H, canvas.height);
    if (snap) Object.assign(cam, camTarget);
  };

  const layout = () => {
    const dpr = window.devicePixelRatio || 1;
    const vw = viewport.clientWidth;
    // Fill the window below the HUD, leaving room for the status bar.
    const top = viewport.getBoundingClientRect().top + window.scrollY;
    const vh = Math.max(280, Math.floor(window.innerHeight - top - bar.offsetHeight));
    viewport.style.height = `${vh}px`;
    // Zoomed in like a Super Mario World map: cover the whole frame and a bit
    // more, with the camera following the player. Phones keep tappable stops.
    let scale = Math.max(Math.max(vw / MAP_W, vh / MAP_H) * 1.2, vw < 700 ? 2 : 1);
    // Snap to whole device pixels (perfectly square pixels) when that's close.
    const k = Math.round(scale * dpr);
    if (k >= 1 && Math.abs(k / dpr - scale) <= scale * 0.08) scale = k / dpr;
    cssPerPx = scale;
    canvas.width = Math.ceil(vw / cssPerPx);
    canvas.height = Math.ceil(vh / cssPerPx);
    canvas.style.width = `${canvas.width * cssPerPx}px`;
    canvas.style.height = `${canvas.height * cssPerPx}px`;
    aim(player.x, player.y, true);
  };

  // ---- Player -------------------------------------------------------------------
  const start = nodePx(pos);
  const player = { x: start.x, y: start.y, facing: 1 as 1 | -1, walking: false };
  /** True while a new road draws itself, before Bit walks on automatically. */
  let pendingWalk = false;

  function walkSegment(seg: number, forward: boolean): Promise<void> {
    const { points, length } = SEGMENTS[seg];
    const dur = reducedMotion() ? 0 : length / SPEED;
    const t0 = performance.now();
    return new Promise((resolve) => {
      const step = (now: number) => {
        const t = dur === 0 ? 1 : Math.min(1, (now - t0) / dur);
        const d = (forward ? t : 1 - t) * length;
        const p = pointAt(points, d);
        const ahead = pointAt(points, Math.min(length, Math.max(0, d + (forward ? 2 : -2))));
        if (ahead.x !== p.x) player.facing = ahead.x > p.x ? 1 : -1;
        player.x = p.x;
        player.y = p.y;
        aim(p.x, p.y);
        if (t < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });
  }

  async function walkTo(target: number): Promise<void> {
    if (player.walking || target === pos || target < 0 || target >= ROUTE.length) return;
    if (!playable(target) || nodeHidden(target)) {
      show(target);
      return;
    }
    player.walking = true;
    card.hidden = true;
    const dir = Math.sign(target - pos);
    while (pos !== target) {
      await walkSegment(dir > 0 ? pos : pos - 1, dir > 0);
      pos += dir;
      show(pos);
    }
    player.walking = false;
    setPosition(ROUTE[pos].id);
    show(pos);
  }

  function enter(): void {
    if (player.walking || !playable(pos)) return;
    const l = ROUTE[pos];
    setPosition(l.id);
    go(stopLink(l));
  }

  // ---- Status bar ---------------------------------------------------------------
  function show(i: number, status?: string): void {
    const l = ROUTE[i];
    const w = worldOf(l.id);
    barWorld.textContent = `WORLD ${w.num} · ${w.name.toUpperCase()}`;
    barTitle.textContent = l.boss ? `★ ${w.boss.name}` : l.challenge ? `! ${w.challenge.title}` : `${l.id} ${l.title}`;
    barStatus.textContent = status ?? (l.boss ? BOSS_STATUS : l.challenge ? CHALLENGE_STATUS : STATUS)[states[i]];
    bar.classList.toggle("boss", !!l.boss);

    // The card describes the stop Bit is standing on.
    if (i !== pos) return;
    const here = ROUTE[pos];
    cardKind.textContent = here.boss ? `WORLD ${w.num} BOSS` : here.challenge ? `WORLD ${w.num} CHALLENGE` : `LEVEL ${here.id}`;
    cardTitle.textContent = here.boss ? w.boss.name : here.challenge ? w.challenge.title : here.title;
    playBtn.textContent = here.boss ? "FIGHT ▶" : states[pos] === "cleared" ? "REPLAY ▶" : "PLAY ▶";
    card.classList.toggle("boss", !!here.boss);
    card.hidden = player.walking || pendingWalk || !playable(pos);
  }

  /** Keep the PLAY card just below Bit's stop (or above it near the bottom edge). */
  let cardPos = "";
  function placeCard(): void {
    if (card.hidden) return;
    const n = nodePx(pos);
    const vw = viewport.clientWidth;
    const vh = viewport.clientHeight;
    const w = card.offsetWidth;
    const hgt = card.offsetHeight;
    const sx = (n.x - cam.x) * cssPerPx;
    let top = (n.y - cam.y + 12) * cssPerPx;
    if (top + hgt > vh - 6) top = (n.y - cam.y - (ROUTE[pos].boss ? 30 : 24)) * cssPerPx - hgt;
    const left = Math.min(vw - w / 2 - 6, Math.max(w / 2 + 6, sx));
    const key = `${Math.round(left)},${Math.round(top)}`;
    if (key === cardPos) return;
    cardPos = key;
    card.style.left = `${Math.round(left)}px`;
    card.style.top = `${Math.round(top)}px`;
  }

  // ---- Input --------------------------------------------------------------------
  const onKey = (e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const onControl = (e.target as HTMLElement).closest("button, a, summary");
    if (["ArrowRight", "d", "D"].includes(e.key)) {
      e.preventDefault();
      void walkTo(pos + 1);
    } else if (["ArrowLeft", "a", "A"].includes(e.key)) {
      e.preventDefault();
      void walkTo(pos - 1);
    } else if ((e.key === "Enter" || e.key === " ") && !onControl) {
      e.preventDefault();
      enter();
    }
  };

  const toMap = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / cssPerPx + cam.x, y: (e.clientY - r.top) / cssPerPx + cam.y };
  };
  const nodeAt = (p: { x: number; y: number }) =>
    ROUTE.findIndex((l, i) => {
      const n = nodePx(i);
      // Fortresses stand above their stop, so their hit box reaches higher.
      return Math.abs(n.x - p.x) <= 9 && p.y - n.y <= 8 && n.y - p.y <= (l.boss ? 22 : 8);
    });

  // Drag to look around (when the map is bigger than the frame); tap selects.
  let drag: { x: number; y: number; cx: number; cy: number; moved: boolean; node: number } | undefined;
  const onDown = (e: PointerEvent) => {
    // Let clicks on the PLAY card reach its button.
    if (e.button !== 0 || (e.target as Element).closest(".stop-card")) return;
    drag = { x: e.clientX, y: e.clientY, cx: cam.x, cy: cam.y, moved: false, node: nodeAt(toMap(e)) };
    viewport.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!drag) {
      viewport.classList.toggle("pointing", nodeAt(toMap(e)) >= 0);
      return;
    }
    const dx = (e.clientX - drag.x) / cssPerPx;
    const dy = (e.clientY - drag.y) / cssPerPx;
    if (!drag.moved && Math.hypot(dx, dy) * cssPerPx < 6) return;
    drag.moved = true;
    camTarget.x = clamp(drag.cx - dx, MAP_W, canvas.width);
    camTarget.y = clamp(drag.cy - dy, MAP_H, canvas.height);
    Object.assign(cam, camTarget);
  };
  const onUp = () => {
    if (!drag) return;
    const { moved, node } = drag;
    drag = undefined;
    if (moved || node < 0) return;
    if (node === pos) enter();
    else void walkTo(node);
  };

  viewport.addEventListener("pointerdown", onDown);
  viewport.addEventListener("pointermove", onMove);
  viewport.addEventListener("pointerup", onUp);
  viewport.addEventListener("pointercancel", () => (drag = undefined));
  window.addEventListener("keydown", onKey);

  // ---- Loop ---------------------------------------------------------------------
  // Animation runs on real time, so it's the same speed on 60 Hz and 144 Hz screens.
  let raf = 0;
  const t0 = performance.now();
  let last = t0;
  const loop = () => {
    // performance.now(), not the rAF timestamp: that can be slightly before t0.
    const now = performance.now();
    const dt = Math.max(0, Math.min(100, now - last));
    last = now;
    const tick = Math.max(0, Math.floor((now - t0) / (1000 / 60)));
    const k = reducedMotion() ? 1 : 1 - Math.pow(0.85, dt / (1000 / 60));
    cam.x += (camTarget.x - cam.x) * k;
    cam.y += (camTarget.y - cam.y) * k;
    draw.draw(ctx, { cam, tick: reducedMotion() ? 0 : tick, states, roadShown, nodeHidden, player });
    placeCard();
    raf = requestAnimationFrame(loop);
  };

  // Just cleared a stop? Once the new road has drawn itself, Bit walks on to
  // the next stop by itself, ready to play.
  const newRoad = revealedBefore <= maxPlayable && pos < maxPlayable;
  pendingWalk = newRoad;
  let autoWalk = 0;
  if (newRoad) {
    autoWalk = window.setTimeout(
      async () => {
        pendingWalk = false;
        await walkTo(maxPlayable);
        if (document.activeElement === document.body || !document.activeElement) playBtn.focus({ preventScroll: true });
      },
      skipReveal ? 0 : 450 + offset,
    );
  }

  if (!introSeen()) showIntro();
  show(pos, newRoad ? "New road open! Bit is on the way." : undefined);
  layout();
  const resize = new ResizeObserver(layout);
  resize.observe(viewport);
  window.addEventListener("resize", layout);
  loop();

  let cleanup = () => {
    window.clearTimeout(autoWalk);
    cancelAnimationFrame(raf);
    resize.disconnect();
    document.body.classList.remove("map-mode");
    window.removeEventListener("resize", layout);
    window.removeEventListener("keydown", onKey);
  };
  return () => cleanup();
}

/** Where a stop's PLAY button goes. */
function stopLink(l: (typeof ROUTE)[number]): string {
  const n = worldOf(l.id).num;
  return l.boss ? `boss/${n}` : l.challenge ? `challenge/${n}` : `level/${l.id}`;
}

/** First-visit welcome: what Agentica is, what you'll learn, how to play. */
function showIntro(): void {
  document.querySelector(".intro")?.remove();
  const close = () => {
    setIntroSeen();
    overlay.remove();
    window.removeEventListener("keydown", onKey, true);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };
  const start = h("button", { class: "btn btn-go", type: "button", onclick: close }, "START ▶");
  const overlay = h(
    "div",
    { class: "intro", role: "dialog", "aria-modal": "true", "aria-label": "Welcome to Agentica" },
    h(
      "section",
      { class: "box intro-card" },
      h("h2", { class: "intro-title" }, "WELCOME TO AGENTICA"),
      h("p", {}, "A short quest from zero to expert in AI agents. Walk Bit, the robot, across six worlds, plus a bonus Star Road for experts. Each stop is a 2-minute lesson. Each world ends with a hands-on challenge and a boss."),
      h(
        "ol",
        { class: "intro-worlds" },
        ...WORLDS.map((w) => h("li", {}, h("strong", {}, `${w.num > MAIN_WORLDS ? "★ BONUS" : w.num} ${w.name}`), ` · ${w.blurb}`)),
      ),
      h(
        "p",
        { class: "intro-keys" },
        "ARROW KEYS or click a stop to walk · ENTER or PLAY to start a level · bold words in lessons can be clicked for a definition",
      ),
      h("div", { class: "dialog-actions" }, start),
    ),
  );
  document.body.append(overlay);
  window.addEventListener("keydown", onKey, true);
  start.focus();
}

/** Plain list of every stop: an overview, and a non-map way to navigate. */
function levelList(states: NodeState[]): HTMLDetailsElement {
  return h(
    "details",
    { class: "box level-list" },
    h("summary", {}, "ALL LEVELS"),
    h(
      "ol",
      {},
      ...ROUTE.map((l, i) => {
        const s = states[i];
        const w = worldOf(l.id);
        const label = l.boss ? `${w.num}-★ ${w.boss.name} (boss)` : l.challenge ? `${w.num}-! ${w.challenge.title} (challenge)` : `${l.id} ${l.title}`;
        const link = stopLink(l);
        return h(
          "li",
          { class: `ll-${s}` },
          s === "cleared" || s === "open"
            ? h("a", { href: href(link) }, `${s === "cleared" ? "★" : "▶"} ${label}`)
            : h("span", {}, `${s === "soon" ? "?" : "■"} ${label} (${s === "soon" ? "coming soon" : "locked"})`),
        );
      }),
    ),
  );
}
