import { MAP_H, MAP_W, ROUTE, WORLDS } from "../worlds";
import type { Theme } from "../types";
import { ART, PAL, dot, sprite, type Sprite } from "./pixels";
import * as P from "./props";
import { SEGMENTS, nodePx, pointAt, type Pt } from "./route";
import { THEMES, WATER, buildTerrain, type Terrain } from "./terrain";

/**
 * Draws the overworld at 1 canvas pixel = 1 map pixel; the caller scales the
 * canvas up. Scenery is animated: windmills turn, chimneys and the volcano
 * smoke, flags wave, crystals twinkle, ghosts bob, clouds drift.
 */

export type NodeState = "cleared" | "open" | "locked" | "soon";

export interface Frame {
  cam: Pt;
  /** Animation clock: 60 ticks per second of real time, whatever the screen refresh rate. */
  tick: number;
  states: NodeState[];
  /** Pixels of road drawn on each segment (reveal animation). */
  roadShown: (seg: number) => number;
  nodeHidden: (i: number) => boolean;
  player: Pt & { facing: 1 | -1; walking: boolean };
}

/** A placed piece of scenery. (x, y) is its bottom centre. */
interface Prop {
  frames: Sprite[];
  x: number;
  y: number;
  /** Ticks per animation frame (0 = still). */
  rate: number;
  phase: number;
  /** Pixels of vertical bob (ghosts). */
  bob?: number;
  /** Smoke rising from this offset above the prop's top-left. */
  smoke?: Pt;
}

type Kind =
  | "tree" | "pine" | "bush" | "hill" | "flower" | "rock" | "cactus" | "mushroom"
  | "tombstone" | "deadTree" | "crystal" | "stalagmite" | "ghost" | "swamp" | "house";

/** What grows on each kind of island, most common first. */
const FLORA: Record<Theme, Kind[]> = {
  grass: ["tree", "flower", "tree", "bush", "flower", "hill", "house", "tree", "flower"],
  forge: ["cactus", "rock", "hill", "cactus", "rock", "bush"],
  cave: ["crystal", "stalagmite", "rock", "crystal", "stalagmite"],
  forest: ["pine", "mushroom", "pine", "tree", "pine", "mushroom"],
  shadow: ["deadTree", "tombstone", "swamp", "deadTree", "tombstone", "deadTree", "ghost", "swamp", "tombstone"],
  castle: ["pine", "rock", "flower", "bush", "pine"],
};

const LANDMARK: Record<Theme, () => { frames: Sprite[]; rate: number; smoke?: Pt }> = {
  grass: () => ({ frames: P.windmill(), rate: 30 }),
  forge: () => ({ frames: P.volcano(), rate: 28, smoke: { x: 17, y: 0 } }),
  cave: () => ({ frames: [P.caveMountain()], rate: 0 }),
  forest: () => ({ frames: P.guildHall(), rate: 36 }),
  shadow: () => ({ frames: P.ghostHouse(), rate: 50 }),
  castle: () => ({ frames: P.tower(), rate: 36 }),
};

const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) >>> 0;
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export class OverworldRenderer {
  private terrain: Terrain;
  private props: Prop[] = [];
  private sp: Record<string, Sprite>;
  private anim: Record<string, Sprite[]>;
  private clouds: { s: Sprite; x: number; y: number; speed: number }[];
  private smoke: Sprite[];

  constructor() {
    this.terrain = buildTerrain();
    const playerA = sprite([...ART.player, ...ART.feetA]);
    const playerB = sprite([...ART.player, ...ART.feetB]);
    this.sp = {
      playerA: P.halo(playerA),
      playerB: P.halo(playerB),
      arrow: P.arrow(),
      dotOpen: dot(PAL.r, PAL.R),
      dotOpen2: dot("#f87858", PAL.r),
      dotCleared: dot(PAL.y, PAL.o),
      dotLocked: dot("#d0d0d8", "#8a8a98"),
    };
    this.anim = {
      fortressOpen: P.fortress("open"),
      fortressCleared: P.fortress("cleared"),
      fortressLocked: P.fortress("locked"),
      castleOpen: P.castle("open"),
      castleCleared: P.castle("cleared"),
      castleLocked: P.castle("locked"),
    };
    this.smoke = [3, 4, 5].map((n) => dot("#e8e8f0", "#b8b8c8", n));
    this.clouds = [
      { s: P.cloud(40), x: 120, y: 40, speed: 0.05 },
      { s: P.cloud(30), x: 560, y: 250, speed: 0.035 },
      { s: P.cloud(46), x: 820, y: 470, speed: 0.045 },
    ];
    this.placeScenery();
  }

  /** One landmark per world, then scenery scattered clear of roads and stops. */
  private placeScenery(): void {
    const road: Pt[] = SEGMENTS.flatMap((s) => Array.from({ length: Math.ceil(s.length / 4) + 1 }, (_, k) => pointAt(s.points, k * 4)));
    const stops = ROUTE.map((_, i) => nodePx(i));
    const taken: { x: number; y: number; r: number }[] = [];
    const clear = (p: Pt, r: number) =>
      !road.some((q) => Math.abs(q.x - p.x) < r * 0.7 + 6 && q.y > p.y - r * 1.4 - 6 && q.y < p.y + 6) &&
      !stops.some((q) => Math.abs(q.x - p.x) < r * 0.7 + 12 && q.y > p.y - r * 1.4 - 20 && q.y < p.y + 12) &&
      !taken.some((t) => Math.abs(t.x - p.x) < (t.r + r) * 0.6 && Math.abs(t.y - p.y) < (t.r + r) * 0.6);
    const onLand = (p: Pt, w: number, half: number, up: number) =>
      [[-half, 0], [half, 0], [0, -up], [-half, -up], [half, -up], [0, 3]].every(([dx, dy]) => this.terrain.worldAt(Math.round(p.x + dx), Math.round(p.y + dy)) === w);

    // Landmarks: the free spot on each island with the most room around it.
    for (const w of WORLDS) {
      const lm = LANDMARK[w.theme]();
      const s = lm.frames[0];
      let best: { p: Pt; score: number } | undefined;
      for (let y = 20; y < MAP_H; y += 6) {
        for (let x = 20; x < MAP_W; x += 6) {
          const p = { x, y };
          if (!onLand(p, w.num, s.width / 2 + 2, s.height + 2) || !clear(p, Math.max(s.width, s.height) / 2 + 2)) continue;
          const score = Math.min(
            ...road.map((q) => Math.hypot(q.x - p.x, q.y - (p.y - s.height / 2))),
            ...stops.map((q) => Math.hypot(q.x - p.x, q.y - (p.y - s.height / 2))),
          );
          if (!best || score > best.score) best = { p, score };
        }
      }
      if (!best) continue;
      taken.push({ ...best.p, r: Math.max(s.width, s.height) });
      this.props.push({ frames: lm.frames, x: best.p.x, y: best.p.y, rate: lm.rate, phase: w.num * 7, smoke: lm.smoke });
    }

    // Scatter.
    const cache = new Map<string, Prop["frames"]>();
    const framesFor = (kind: Kind, theme: Theme): { frames: Sprite[]; rate: number; bob?: number; smoke?: Pt } => {
      const t = THEMES[theme];
      const key = `${kind}-${theme}`;
      const get = (make: () => Sprite[]) => {
        if (!cache.has(key)) cache.set(key, make());
        return cache.get(key)!;
      };
      switch (kind) {
        case "tree": return { frames: get(P.tree), rate: 80 };
        case "pine": return { frames: get(P.pine), rate: 90 };
        case "flower": return { frames: get(() => P.flower(theme === "castle" ? "#f8d800" : "#f878b8")), rate: 60 };
        case "crystal": return { frames: get(P.crystal), rate: 40 };
        case "ghost": return { frames: get(P.ghost), rate: 32, bob: 2 };
        case "swamp": return { frames: get(P.swamp), rate: 32 };
        case "bush": return { frames: get(() => [P.bush(t.dark, t.base, t.dark)]), rate: 0 };
        case "hill": return { frames: get(() => [P.hill(t.base, t.light, t.dark)]), rate: 0 };
        case "house": return { frames: get(() => [P.house("#e83800", "#a02000")]), rate: 0, smoke: { x: 12, y: 0 } };
        case "rock": return { frames: get(() => [P.rock()]), rate: 0 };
        case "cactus": return { frames: get(() => [P.cactus()]), rate: 0 };
        case "mushroom": return { frames: get(() => [P.mushroom()]), rate: 0 };
        case "tombstone": return { frames: get(() => [P.tombstone()]), rate: 0 };
        case "deadTree": return { frames: get(() => [P.deadTree()]), rate: 0 };
        case "stalagmite": return { frames: get(() => [P.stalagmite()]), rate: 0 };
      }
    };

    for (let y = 10; y < MAP_H; y += 9) {
      for (let x = 10; x < MAP_W; x += 9) {
        const p = { x: x + Math.floor(hash(x, y) * 6) - 3, y: y + Math.floor(hash(y, x) * 6) - 3 };
        const w = this.terrain.worldAt(p.x, p.y);
        if (!w || hash(p.x * 3, p.y * 7) > 0.34) continue;
        const theme = WORLDS[w - 1].theme;
        const list = FLORA[theme];
        const kind = list[Math.floor(hash(p.y, p.x * 5) * list.length)];
        const f = framesFor(kind, theme);
        const s = f.frames[0];
        if (!onLand(p, w, s.width / 2, s.height) || !clear(p, Math.max(s.width, s.height) / 2)) continue;
        taken.push({ ...p, r: Math.max(s.width, s.height) / 2 + 2 });
        this.props.push({ ...f, x: p.x, y: p.y, phase: Math.floor(hash(p.x, p.y * 3) * 100) });
      }
    }
    this.props.sort((a, b) => a.y - b.y);
  }

  draw(ctx: CanvasRenderingContext2D, f: Frame): void {
    const { width: cw, height: ch } = ctx.canvas;
    const cx = Math.round(f.cam.x);
    const cy = Math.round(f.cam.y);
    ctx.imageSmoothingEnabled = false;

    // Sea with drifting ripples and the odd sparkle.
    ctx.fillStyle = WATER;
    ctx.fillRect(0, 0, cw, ch);
    const shift = (f.tick >> 5) % 24;
    for (let gy = Math.floor(cy / 12) * 12; gy < cy + ch + 12; gy += 12) {
      const row = gy / 12;
      for (let gx = Math.floor(cx / 48) * 48 - 48; gx < cx + cw + 48; gx += 48) {
        const x = gx + (row % 2) * 24 + shift - cx;
        ctx.fillStyle = "#68a0f0";
        ctx.fillRect(x, gy - cy, 4, 1);
        ctx.fillRect(x + 4, gy - cy - 1, 2, 1);
        if (hash(gx, gy) < 0.08 && ((f.tick >> 4) + gx) % 20 < 3) {
          ctx.fillStyle = "#e0f0ff";
          ctx.fillRect(x + 14, gy - cy + 5, 1, 1);
        }
      }
    }

    ctx.save();
    ctx.translate(-cx, -cy);
    ctx.drawImage(this.terrain.canvas, 0, 0);
    this.roads(ctx, f);
    this.scenery(ctx, f);
    this.stops(ctx, f);
    this.drawPlayer(ctx, f);
    this.drawClouds(ctx, f);
    ctx.restore();
  }

  private scenery(ctx: CanvasRenderingContext2D, f: Frame) {
    for (const p of this.props) {
      const n = p.frames.length;
      const i = p.rate ? ((Math.floor((f.tick + p.phase) / p.rate) % n) + n) % n : 0;
      const s = p.frames[i];
      const bob = p.bob ? Math.round(Math.sin((f.tick + p.phase) / 40) * p.bob) : 0;
      const left = Math.round(p.x - s.width / 2);
      const top = p.y - s.height + 2 + bob;
      ctx.drawImage(s, left, top);
      if (p.smoke) this.puffs(ctx, left + p.smoke.x, top + p.smoke.y, f.tick + p.phase);
    }
  }

  /** Three puffs rising, drifting and fading in a loop. */
  private puffs(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
    for (let k = 0; k < 3; k++) {
      const life = ((t + k * 70) % 210) / 210;
      const s = this.smoke[Math.min(2, Math.floor(life * 3))];
      ctx.globalAlpha = 1 - life;
      ctx.drawImage(s, Math.round(x + Math.sin(life * 5) * 2 + life * 4 - s.width / 2), Math.round(y - life * 18 - s.height));
    }
    ctx.globalAlpha = 1;
  }

  private drawClouds(ctx: CanvasRenderingContext2D, f: Frame) {
    ctx.globalAlpha = 0.9;
    for (const c of this.clouds) {
      const span = MAP_W + c.s.width * 2;
      const x = Math.round(((c.x + f.tick * c.speed * 0.6) % span) - c.s.width);
      ctx.drawImage(c.s, x, c.y);
    }
    ctx.globalAlpha = 1;
  }

  /** Tan roads with a darker edge; plank bridges where they cross water. */
  private roads(ctx: CanvasRenderingContext2D, f: Frame) {
    const shown = SEGMENTS.map((s, i) => Math.min(s.length, f.roadShown(i)));

    // Roads not opened yet: a dotted guide, so the route always reads.
    ctx.fillStyle = "rgba(16,16,24,0.45)";
    SEGMENTS.forEach((s, i) => {
      for (let d = Math.max(0, shown[i]) + 6; d < s.length - 5; d += 5) {
        const p = pointAt(s.points, d);
        ctx.fillRect(p.x, p.y, 2, 2);
      }
    });

    const pts = (draw: (p: Pt, water: boolean, horizontal: boolean) => void) =>
      SEGMENTS.forEach((s, i) => {
        for (let d = 0; d <= shown[i]; d++) {
          const p = pointAt(s.points, d);
          const q = pointAt(s.points, Math.min(s.length, d + 1));
          draw(p, !this.terrain.solid(p.x, p.y), q.y === p.y);
        }
      });

    pts((p, water) => {
      ctx.fillStyle = water ? PAL.k : PAL.S;
      ctx.fillRect(p.x - (water ? 4 : 2), p.y - (water ? 4 : 2), water ? 9 : 5, water ? 9 : 5);
    });
    pts((p, water, horizontal) => {
      if (water) {
        ctx.fillStyle = (horizontal ? p.x : p.y) % 3 === 0 ? PAL.T : PAL.t;
        ctx.fillRect(p.x - 3, p.y - 3, 7, 7);
      } else {
        ctx.fillStyle = PAL.s;
        ctx.fillRect(p.x - 1, p.y - 1, 3, 3);
      }
    });
  }

  private stops(ctx: CanvasRenderingContext2D, f: Frame) {
    ROUTE.forEach((l, i) => {
      if (f.nodeHidden(i)) return;
      const p = nodePx(i);
      const s = f.states[i];
      if (l.boss) {
        const big = i === ROUTE.length - 1;
        const kind = s === "cleared" ? "Cleared" : s === "open" ? "Open" : "Locked";
        const frames = this.anim[`${big ? "castle" : "fortress"}${kind}`];
        const img = frames[(f.tick >> 5) % frames.length];
        ctx.drawImage(img, p.x - Math.floor(img.width / 2), p.y + 4 - img.height);
        return;
      }
      const img =
        s === "open" ? ((f.tick >> 5) & 1 ? this.sp.dotOpen2 : this.sp.dotOpen) : s === "cleared" ? this.sp.dotCleared : this.sp.dotLocked;
      if (s === "soon") ctx.globalAlpha = 0.5;
      ctx.drawImage(img, p.x - (img.width >> 1), p.y - (img.height >> 1));
      ctx.globalAlpha = 1;
    });
  }

  private drawPlayer(ctx: CanvasRenderingContext2D, f: Frame) {
    const pl = f.player;
    const frameB = pl.walking ? (f.tick >> 3) & 1 : (f.tick >> 6) & 1;
    const img = frameB ? this.sp.playerB : this.sp.playerA;
    const px = Math.round(pl.x);
    const hop = pl.walking ? ((f.tick >> 3) & 1) : 0;
    const top = Math.round(pl.y) + 4 - img.height - hop;
    ctx.fillStyle = "rgba(16,16,24,0.4)";
    ctx.fillRect(px - 6, Math.round(pl.y) + 2, 12, 3);
    ctx.save();
    if (pl.facing < 0) {
      ctx.translate(px * 2, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(img, px - Math.floor(img.width / 2), top);
    ctx.restore();
    if (!pl.walking) {
      // "You are here": a bouncing arrow over the player.
      const bounce = Math.round(Math.abs(Math.sin(f.tick / 20)) * 3);
      ctx.drawImage(this.sp.arrow, px - Math.floor(this.sp.arrow.width / 2), top - this.sp.arrow.height - 2 - bounce);
    }
  }
}
