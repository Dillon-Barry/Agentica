import { MAP_H, MAP_W, WORLDS } from "../worlds";
import type { Theme } from "../types";
import { islandBlobs } from "./route";

/**
 * Pixel terrain for the overworld: raised islands with an outline, a lit top
 * edge and a cliff face, sitting in water with a foam line along the shore.
 * Built once into an ImageData-backed canvas.
 */

export const THEMES: Record<Theme, { base: string; light: string; dark: string; cliff: string; cliffDark: string }> = {
  grass: { base: "#58c038", light: "#a0e068", dark: "#38902a", cliff: "#c88040", cliffDark: "#885020" },
  forge: { base: "#e8a048", light: "#f8d090", dark: "#b86820", cliff: "#985028", cliffDark: "#603010" },
  cave: { base: "#a088d0", light: "#c8b8f0", dark: "#6850a8", cliff: "#584090", cliffDark: "#382868" },
  forest: { base: "#38a040", light: "#70d060", dark: "#206828", cliff: "#a86830", cliffDark: "#704018" },
  shadow: { base: "#705098", light: "#9878c0", dark: "#4c3070", cliff: "#403060", cliffDark: "#281a40" },
  castle: { base: "#b0b0c0", light: "#d8d8e8", dark: "#808090", cliff: "#686878", cliffDark: "#484858" },
};

export const WATER = "#3878e0";
const FOAM = "#a8d8f8";
const FOAM2 = "#78b0f0";
const OUTLINE = "#101018";
const CLIFF = 5;

export interface Terrain {
  canvas: HTMLCanvasElement;
  /** World number of the land at each pixel, 0 = water. */
  land: Uint8Array;
  /** True if the pixel is island top (roads there are dirt; elsewhere, bridges). */
  solid: (x: number, y: number) => boolean;
  worldAt: (x: number, y: number) => number;
}

const cellHash = (a: number, b: number) => (((a * 73856093) ^ (b * 19349663)) >>> 0) % 997;

/**
 * Ground pattern for each kind of world: 0 = base, 1 = light, 2 = dark.
 * This is what makes the worlds read as different places at a glance.
 */
function texture(theme: Theme, x: number, y: number): 0 | 1 | 2 {
  switch (theme) {
    case "grass": {
      // Little grass tufts on a loose grid.
      const cell = cellHash(x >> 3, y >> 3) % 5;
      const tx = (x & 7) - cell;
      const ty = (y & 7) - ((cell * 3) & 7);
      if ((ty === 0 && (tx === 0 || tx === 2)) || (ty === -1 && tx === 1)) return 1;
      return 0;
    }
    case "forge": {
      // Wind-blown sand ripples.
      const wave = (x + Math.round(Math.sin(y * 0.35) * 3) + y * 2) % 16;
      if (wave === 0) return 2;
      if (wave === 1) return 1;
      return cellHash(x, y) < 6 ? 2 : 0;
    }
    case "cave": {
      // Irregular rocks: each pixel belongs to its nearest jittered cell
      // centre; cracks run where two rocks meet, lit on their upper-left.
      const S = 11;
      const gx = Math.floor(x / S);
      const gy = Math.floor(y / S);
      let d1 = Infinity;
      let d2 = Infinity;
      let ox = 0;
      let oy = 0;
      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const h = cellHash(gx + i, gy + j);
          const px = (gx + i) * S + (h % S);
          const py = (gy + j) * S + ((h >> 4) % S);
          const d = Math.hypot(x - px, y - py);
          if (d < d1) {
            d2 = d1;
            d1 = d;
            ox = x - px;
            oy = y - py;
          } else if (d < d2) d2 = d;
        }
      }
      if (d2 - d1 < 1.3) return 2;
      if (d2 - d1 < 2.6 && ox + oy < 0) return 1;
      return 0;
    }
    case "forest": {
      // A dense canopy of round treetops.
      const row = Math.floor(y / 7);
      const cx = x - ((row % 2) * 4 + Math.floor((x - (row % 2) * 4) / 8) * 8 + 4);
      const cy = y - (row * 7 + 3.5);
      const d = cx * cx + cy * cy;
      if (d > 15) return 2;
      if (cx + cy < -2) return 1;
      return cx + cy > 2 ? 2 : 0;
    }
    case "shadow": {
      // Murky ground with dark puddles.
      // Puddles: blocks of 6x4 offset per row, so they read as patches, not noise.
      const row = Math.floor(y / 4);
      const h = cellHash(Math.floor((x + (row % 3) * 2) / 6), row);
      if (h < 70) return 2;
      return cellHash(x, y) < 5 ? 1 : 0;
    }
    case "castle": {
      // Stone paving: offset bricks with mortar lines.
      const row = Math.floor(y / 5);
      const bx = (x + (row % 2) * 5) % 10;
      if (y % 5 === 0 || bx === 0) return 2;
      if (y % 5 === 1 && bx > 1) return 1;
      return 0;
    }
  }
}

const hex = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];

export function buildTerrain(): Terrain {
  const W = MAP_W;
  const H = MAP_H;

  // 1. Land mask: draw each world's blobs and read the pixels back.
  const land = new Uint8Array(W * H);
  const scratch = document.createElement("canvas");
  scratch.width = W;
  scratch.height = H;
  const sx = scratch.getContext("2d", { willReadFrequently: true })!;
  for (const w of WORLDS) {
    sx.clearRect(0, 0, W, H);
    sx.fillStyle = "#fff";
    for (const b of islandBlobs(w.num)) {
      sx.beginPath();
      sx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      sx.fill();
    }
    const px = sx.getImageData(0, 0, W, H).data;
    for (let i = 0; i < W * H; i++) if (px[i * 4 + 3] > 127) land[i] = w.num;
  }

  const L = (x: number, y: number) => {
    x = Math.floor(x);
    y = Math.floor(y);
    return x < 0 || y < 0 || x >= W || y >= H ? 0 : land[y * W + x];
  };

  // 2. Classify every pixel: land, land edge, cliff, cliff edge, water.
  const T = { Water: 0, Land: 1, Outline: 2, Cliff: 3, CliffDark: 4 } as const;
  const type = new Uint8Array(W * H);
  const owner = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const w = L(x, y);
      if (w) {
        owner[i] = w;
        type[i] = !L(x - 1, y) || !L(x + 1, y) || !L(x, y - 1) || !L(x, y + 1) ? T.Outline : T.Land;
        continue;
      }
      for (let k = 1; k <= CLIFF + 1; k++) {
        const above = L(x, y - k);
        if (above) {
          owner[i] = above;
          type[i] = k === CLIFF + 1 ? T.Outline : k >= CLIFF - 1 ? T.CliffDark : T.Cliff;
          break;
        }
      }
    }
  }
  // Cliff faces get a dark outline where they meet open water at the sides.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      if (type[i] !== T.Cliff && type[i] !== T.CliffDark) continue;
      const open = (xx: number) => xx < 0 || xx >= W || type[y * W + xx] === T.Water;
      if (open(x - 1) || open(x + 1)) type[i] = T.Outline;
    }
  }

  // 3. Paint.
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const out = img.data;
  const palettes = new Map(
    WORLDS.map((w) => {
      const t = THEMES[w.theme];
      return [w.num, { base: hex(t.base), light: hex(t.light), dark: hex(t.dark), cliff: hex(t.cliff), cliffDark: hex(t.cliffDark) }];
    }),
  );
  const outline = hex(OUTLINE);
  const foam = hex(FOAM);
  const foam2 = hex(FOAM2);
  const isWater = (x: number, y: number) => x >= 0 && y >= 0 && x < W && y < H && type[y * W + x] === T.Water;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const p = palettes.get(owner[i]);
      let c: number[] | undefined;
      switch (type[i]) {
        case T.Outline:
          c = outline;
          break;
        case T.Cliff:
          c = x % 6 === 0 || (x + y) % 11 === 0 ? p!.cliffDark : p!.cliff;
          break;
        case T.CliffDark:
          c = p!.cliffDark;
          break;
        case T.Land: {
          // Lit rim along the top edge, then base with small tufts.
          if (!L(x, y - 2) || !L(x, y - 3)) c = p!.light;
          else if (!L(x, y + 2) || !L(x - 2, y) || !L(x + 2, y)) c = p!.dark;
          else c = [p!.base, p!.light, p!.dark][texture(WORLDS[owner[i] - 1].theme, x, y)];
          break;
        }
        default: {
          // Foam hugs the shore: solid 1px out, dithered 2px out.
          let near = 3;
          for (let dy = -2; dy <= 2 && near > 1; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (!isWater(x + dx, y + dy) && x + dx >= 0 && y + dy >= 0 && x + dx < W && y + dy < H) {
                near = Math.min(near, Math.max(Math.abs(dx), Math.abs(dy)));
              }
            }
          }
          if (near === 1) c = foam;
          else if (near === 2 && (x + y) % 2 === 0) c = foam2;
        }
      }
      if (!c) continue; // open water stays transparent: drawn live with ripples
      out[i * 4] = c[0];
      out[i * 4 + 1] = c[1];
      out[i * 4 + 2] = c[2];
      out[i * 4 + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  return {
    canvas,
    land,
    worldAt: L,
    solid: (x, y) => L(x, y) > 0,
  };
}
