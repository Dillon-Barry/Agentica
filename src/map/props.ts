import { PAL, type Sprite } from "./pixels";

/**
 * Procedural pixel props for the overworld. Each prop is painted from simple
 * shapes into a colour grid; outlines are added automatically, so every
 * sprite gets the same clean 1px border. Animated props return frames.
 */

class Pix {
  private px: (string | undefined)[];
  constructor(
    readonly w: number,
    readonly h: number,
  ) {
    this.px = new Array(w * h);
  }
  set(x: number, y: number, c: string) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c;
  }
  get(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.px[y * this.w + x] : undefined;
  }
  rect(x: number, y: number, w: number, h: number, c: string) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }
  /** Filled ellipse, shaded: light top-left, dark bottom-right. */
  blob(cx: number, cy: number, rx: number, ry: number, base: string, light?: string, dark?: string) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const nx = (x + 0.5 - cx) / rx;
        const ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny > 1) continue;
        const c = light && nx + ny < -0.75 ? light : dark && nx + ny > 0.55 ? dark : base;
        this.set(x, y, c);
      }
    }
  }
  /** Triangle from an apex down to a base row, filled. */
  tri(cx: number, top: number, bottom: number, halfBase: number, base: string, dark?: string) {
    for (let y = top; y <= bottom; y++) {
      const half = ((y - top) / Math.max(1, bottom - top)) * halfBase;
      for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) this.set(x, y, dark && x > cx + half / 3 ? dark : base);
    }
  }
  /** Render with a 1px outline around everything painted. */
  sprite(outline = PAL.k): Sprite {
    const c = document.createElement("canvas");
    c.width = this.w + 2;
    c.height = this.h + 2;
    const ctx = c.getContext("2d")!;
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        const v = this.get(x, y);
        let col = v;
        if (!v && outline && (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1))) col = outline;
        if (!col || col === "x") continue; // "x" = painted hole, never drawn
        ctx.fillStyle = col;
        ctx.fillRect(x + 1, y + 1, 1, 1);
      }
    }
    return c;
  }
}

const C = {
  leaf: "#40b030",
  leafLight: "#90e050",
  leafDark: "#207818",
  pine: "#208838",
  pineLight: "#50b850",
  pineDark: "#105828",
  trunk: "#985018",
  wall: "#f8e8c0",
  wallDark: "#c8a878",
  stone: "#c8c8d8",
  stoneLight: "#e8e8f0",
  stoneDark: "#8888a0",
  window: "#f8e048",
  door: "#603818",
  red: "#e83800",
  redDark: "#a02000",
  blue: "#3870e8",
  blueDark: "#1840a0",
  wood: "#c87830",
  woodDark: "#7a4418",
  sand: "#e0b060",
  lava: "#f85800",
  lavaHot: "#f8d000",
  rock: "#a87850",
  rockLight: "#d0a070",
  rockDark: "#6a4428",
  purple: "#6848a8",
  purpleLight: "#9878d0",
  purpleDark: "#382070",
  crystal: "#58e0f8",
  ghost: "#f0f4ff",
  ghostShade: "#b8c8e8",
  gray: "#a0a0b0",
  grayDark: "#606070",
  cream: "#fff0d0",
};

// ---- Small scenery ------------------------------------------------------------

export function tree(): Sprite[] {
  return [0, 1].map((f) => {
    const p = new Pix(12, 14);
    p.rect(5, 9, 2, 5, C.trunk);
    p.blob(6 + f * 0.6, 5, 5.5, 5, C.leaf, C.leafLight, C.leafDark);
    return p.sprite();
  });
}

export function pine(): Sprite[] {
  return [0, 1].map((f) => {
    const p = new Pix(10, 15);
    p.rect(4, 12, 2, 3, C.trunk);
    p.tri(5 + f * 0.5, 0, 6, 3, C.pine, C.pineDark);
    p.tri(5 + f * 0.5, 3, 9, 4, C.pine, C.pineDark);
    p.tri(5, 6, 12, 5, C.pine, C.pineDark);
    p.set(4, 2, C.pineLight);
    p.set(3, 6, C.pineLight);
    p.set(2, 9, C.pineLight);
    return p.sprite();
  });
}

export function bush(base: string, light: string, dark: string): Sprite {
  const p = new Pix(10, 6);
  p.blob(5, 5, 5, 4.5, base, light, dark);
  return p.sprite();
}

export function hill(base: string, light: string, dark: string): Sprite {
  const p = new Pix(22, 12);
  p.blob(11, 12, 11, 11.5, base, light, dark);
  p.rect(7, 4, 2, 1, light);
  return p.sprite();
}

export function flower(color: string): Sprite[] {
  return [0, 1].map((f) => {
    const p = new Pix(5, 6);
    p.rect(2, 3, 1, 3, C.leafDark);
    const cx = 2 + (f ? 1 : 0) * 0.6;
    p.set(cx, 0, color);
    p.set(cx - 1, 1, color);
    p.set(cx + 1, 1, color);
    p.set(cx, 2, color);
    p.set(cx, 1, C.window);
    return p.sprite();
  });
}

export function rock(): Sprite {
  const p = new Pix(9, 6);
  p.blob(4.5, 4, 4.5, 3.5, C.rock, C.rockLight, C.rockDark);
  return p.sprite();
}

export function cactus(): Sprite {
  const p = new Pix(9, 12);
  p.rect(3, 0, 3, 12, C.leaf);
  p.rect(0, 4, 2, 3, C.leaf);
  p.rect(0, 6, 3, 2, C.leaf);
  p.rect(7, 2, 2, 3, C.leaf);
  p.rect(6, 4, 3, 2, C.leaf);
  p.rect(5, 0, 1, 12, C.leafDark);
  p.set(4, 2, C.leafLight);
  p.set(4, 6, C.leafLight);
  return p.sprite();
}

export function mushroom(): Sprite {
  const p = new Pix(10, 9);
  p.rect(3, 5, 4, 4, C.cream);
  p.blob(5, 4, 5, 4, C.red, "#f87858", C.redDark);
  p.rect(0, 4, 10, 1, "x");
  p.set(3, 2, "#ffffff");
  p.set(6, 1, "#ffffff");
  p.set(7, 3, "#ffffff");
  return p.sprite();
}

export function tombstone(): Sprite {
  const p = new Pix(7, 8);
  p.rect(0, 3, 7, 5, C.gray);
  p.blob(3.5, 3, 3.5, 3, C.gray, C.stoneLight);
  p.rect(3, 2, 1, 4, C.grayDark);
  p.rect(2, 3, 3, 1, C.grayDark);
  return p.sprite();
}

export function deadTree(): Sprite {
  const p = new Pix(11, 13);
  const bark = "#4a3048";
  p.rect(5, 4, 2, 9, bark);
  p.rect(2, 3, 1, 3, bark);
  p.rect(3, 5, 2, 1, bark);
  p.rect(8, 1, 1, 4, bark);
  p.rect(7, 4, 1, 2, bark);
  p.rect(9, 0, 1, 2, bark);
  p.rect(1, 2, 1, 1, bark);
  return p.sprite();
}

export function crystal(): Sprite[] {
  return [0, 1, 2].map((f) => {
    const p = new Pix(7, 11);
    p.tri(3, 0, 5, 3, C.crystal, "#2898c0");
    p.rect(1, 5, 5, 3, C.crystal);
    p.rect(4, 5, 2, 3, "#2898c0");
    p.tri(3, 8, 10, 0, C.crystal);
    p.rect(2, 8, 3, 2, C.crystal);
    p.set(2, 3, "#ffffff");
    if (f === 1) p.set(2, 2, "#ffffff"), p.set(1, 3, "#ffffff"), p.set(3, 3, "#ffffff"), p.set(2, 4, "#ffffff");
    return p.sprite();
  });
}

export function stalagmite(): Sprite {
  const p = new Pix(7, 10);
  p.tri(3, 0, 9, 3, C.purpleLight, C.purpleDark);
  return p.sprite();
}

export function ghost(): Sprite[] {
  return [0, 1].map((f) => {
    const p = new Pix(10, 11);
    p.blob(5, 5, 5, 5, C.ghost, undefined, C.ghostShade);
    p.rect(0, 5, 10, 4, C.ghost);
    for (let i = 0; i < 10; i += 2) p.rect(i + f, 9, 1, 2, C.ghost);
    p.rect(2, 4, 2, 2, PAL.k);
    p.rect(6, 4, 2, 2, PAL.k);
    p.rect(4, 7, 2, 1, PAL.k);
    return p.sprite();
  });
}

export function swamp(): Sprite[] {
  return [0, 1, 2, 3].map((f) => {
    const p = new Pix(16, 7);
    p.blob(8, 4, 8, 3, "#3a2858", undefined, "#281a40");
    p.rect(4, 3, 3, 1, "#5a4878");
    if (f < 3) p.set(10, 3 - f, "#8878b0");
    return p.sprite();
  });
}

// ---- Buildings and landmarks ------------------------------------------------------

/** Cottage with a chimney; smoke is drawn live above (chimneyX, top). */
export function house(roof: string, roofDark: string): Sprite {
  const p = new Pix(14, 14);
  p.rect(10, 1, 2, 4, "#a05030");
  p.rect(2, 7, 10, 7, C.wall);
  p.rect(9, 7, 3, 7, C.wallDark);
  p.tri(7, 1, 7, 7, roof, roofDark);
  p.rect(6, 10, 2, 4, C.door);
  p.rect(3, 9, 2, 2, C.window);
  return p.sprite();
}

export function windmill(): Sprite[] {
  return [0, 1, 2, 3].map((f) => {
    const p = new Pix(22, 26);
    // Tower
    for (let y = 9; y < 26; y++) {
      const half = 3 + Math.floor((y - 9) / 4);
      p.rect(11 - half, y, half * 2, 1, C.wall);
      p.rect(11 + half - 2, y, 2, 1, C.wallDark);
    }
    p.tri(11, 5, 10, 5, C.red, C.redDark);
    p.rect(9, 21, 4, 5, C.door);
    p.rect(10, 14, 2, 2, C.window);
    // Blades rotate through four angles around the hub.
    const hubX = 11;
    const hubY = 9;
    const angle = (f * Math.PI) / 4;
    for (let b = 0; b < 4; b++) {
      const a = angle + (b * Math.PI) / 2;
      for (let r = 2; r <= 10; r++) {
        const x = hubX + Math.cos(a) * r;
        const y = hubY + Math.sin(a) * r;
        p.set(x, y, C.woodDark);
        if (r > 4) p.set(x + Math.cos(a + Math.PI / 2) * 1.5, y + Math.sin(a + Math.PI / 2) * 1.5, C.cream);
      }
    }
    p.rect(hubX - 1, hubY - 1, 2, 2, C.woodDark);
    return p.sprite();
  });
}

export function volcano(): Sprite[] {
  return [0, 1, 2].map((f) => {
    const p = new Pix(34, 22);
    for (let y = 0; y < 22; y++) {
      const half = 5 + y * 0.6;
      p.rect(17 - half, y, half * 2, 1, y % 5 === 0 ? C.rockDark : C.rock);
      p.rect(17 + half - 4, y, 4, 1, C.rockDark);
      p.rect(17 - half, y, 2, 1, C.rockLight);
    }
    const glow = [C.lava, C.lavaHot, "#f88800"][f];
    p.rect(12, 0, 10, 2, glow);
    p.rect(13, 2, 2, 4 + f, C.lava);
    p.rect(19, 2, 2, 7 - f, C.lava);
    p.set(14, 2 + 4 + f, C.lavaHot);
    return p.sprite();
  });
}

export function caveMountain(): Sprite {
  const p = new Pix(36, 22);
  for (let y = 0; y < 22; y++) {
    const half = 3 + y * 0.8;
    p.rect(14 - half, y, half * 2, 1, C.purple);
    p.rect(14 - half, y, 2, 1, C.purpleLight);
    p.rect(14 + half - 3, y, 3, 1, C.purpleDark);
  }
  for (let y = 6; y < 22; y++) {
    const half = 2 + (y - 6) * 0.7;
    p.rect(26 - half, y, half * 2, 1, C.purple);
    p.rect(26 + half - 3, y, 3, 1, C.purpleDark);
  }
  p.rect(12, 0, 4, 2, "#ffffff");
  p.blob(16, 21, 5, 7, "x");
  for (let y = 15; y < 22; y++) for (let x = 11; x < 22; x++) if (((x - 16) / 5) ** 2 + ((y - 21) / 7) ** 2 <= 1) p.set(x, y, "#100818");
  return p.sprite();
}

export function guildHall(): Sprite[] {
  return [0, 1].map((f) => {
    const p = new Pix(28, 24);
    p.rect(2, 11, 24, 13, C.wood);
    p.rect(2, 11, 24, 1, C.woodDark);
    p.rect(2, 17, 24, 1, C.woodDark);
    for (let x = 2; x < 26; x += 6) p.rect(x, 11, 1, 13, C.woodDark);
    p.tri(14, 2, 11, 14, C.blue, C.blueDark);
    p.rect(11, 18, 6, 6, C.door);
    p.rect(5, 13, 3, 3, C.window);
    p.rect(20, 13, 3, 3, C.window);
    // Flag pole and waving banner
    p.rect(14, 0, 1, 4, PAL.k);
    p.rect(15, 0, 5, 3, C.window);
    p.set(20, f ? 0 : 2, C.window);
    p.rect(19, f ? 2 : 0, 1, 1, "x");
    return p.sprite();
  });
}

export function ghostHouse(): Sprite[] {
  return [0, 1, 2].map((f) => {
    const p = new Pix(24, 24);
    p.rect(2, 10, 20, 14, "#584070");
    p.rect(17, 10, 5, 14, "#3a2858");
    p.tri(12, 1, 10, 12, "#382048", "#281838");
    p.rect(16, 3, 2, 5, "#382048");
    p.rect(9, 17, 6, 7, "#181020");
    const lit = (n: number) => (f + n) % 3 !== 0;
    p.rect(4, 12, 3, 3, lit(0) ? C.window : "#281838");
    p.rect(17, 12, 3, 3, lit(1) ? C.window : "#281838");
    p.rect(11, 6, 2, 2, lit(2) ? C.window : "#281838");
    // Broken fence posts
    p.rect(0, 20, 1, 4, "#4a3048");
    p.rect(23, 19, 1, 5, "#4a3048");
    return p.sprite();
  });
}

export function tower(): Sprite[] {
  return [0, 1].map((f) => {
    const p = new Pix(14, 26);
    p.rect(2, 8, 10, 18, C.stone);
    p.rect(9, 8, 3, 18, C.stoneDark);
    p.rect(2, 8, 2, 18, C.stoneLight);
    for (let x = 1; x < 13; x += 3) p.rect(x, 5, 2, 3, C.stone);
    p.rect(1, 7, 12, 2, C.stone);
    p.rect(6, 13, 2, 3, PAL.k);
    p.rect(5, 21, 4, 5, C.door);
    p.rect(7, 0, 1, 6, PAL.k);
    p.rect(8, 0, 4, 3, C.red);
    p.set(12, f ? 0 : 2, C.red);
    return p.sprite();
  });
}

/** Boss fortress; `state` picks colours, frames wave the flag. */
export function fortress(state: "open" | "cleared" | "locked"): Sprite[] {
  const stone = state === "locked" ? "#9090a0" : C.stone;
  const dark = state === "locked" ? "#606070" : C.stoneDark;
  const flag = state === "cleared" ? C.window : state === "open" ? C.red : "#c0c0c8";
  return [0, 1].map((f) => {
    const p = new Pix(20, 24);
    p.rect(1, 10, 18, 14, stone);
    p.rect(14, 10, 5, 14, dark);
    for (let x = 1; x < 19; x += 4) p.rect(x, 7, 2, 3, stone);
    p.rect(7, 4, 6, 6, stone);
    p.rect(11, 4, 2, 6, dark);
    p.rect(7, 2, 2, 2, stone);
    p.rect(11, 2, 2, 2, stone);
    p.rect(7, 16, 6, 8, "#181020");
    p.rect(3, 13, 2, 3, "#181020");
    p.rect(15, 13, 2, 3, "#181020");
    p.rect(10, 0, 1, 4, PAL.k);
    p.rect(11, 0, 1, 1, "x");
    p.rect(11, f ? 0 : 1, 5, 2, flag);
    p.rect(16, f ? 1 : 0, 1, 2, flag);
    return p.sprite();
  });
}

/** The final castle, twice the size of a fortress, with torches. */
export function castle(state: "open" | "cleared" | "locked"): Sprite[] {
  const stone = state === "locked" ? "#9090a0" : C.stone;
  const dark = state === "locked" ? "#606070" : C.stoneDark;
  const flag = state === "cleared" ? C.window : C.red;
  return [0, 1].map((f) => {
    const p = new Pix(40, 38);
    p.rect(6, 16, 28, 22, stone);
    p.rect(27, 16, 7, 22, dark);
    for (const tx of [0, 30]) {
      p.rect(tx, 8, 10, 30, stone);
      p.rect(tx + 7, 8, 3, 30, dark);
      p.tri(tx + 5, 0, 8, 6, C.red, C.redDark);
      p.rect(tx + 3, 14, 3, 4, "#181020");
    }
    for (let x = 10; x < 30; x += 4) p.rect(x, 13, 2, 3, stone);
    p.rect(15, 24, 10, 14, "#181020");
    p.rect(19, 4, 1, 12, PAL.k);
    p.rect(20, 4, 7, 4, flag);
    p.set(27, f ? 4 : 7, flag);
    // Torches either side of the gate
    p.rect(12, 26, 1, 4, C.woodDark);
    p.rect(27, 26, 1, 4, C.woodDark);
    p.rect(12, 24 + (f ? 0 : 1), 1, 2, C.lavaHot);
    p.rect(27, 24 + (f ? 1 : 0), 1, 2, C.lavaHot);
    return p.sprite();
  });
}

/** Challenge stop: a "!" block, shiny when open, dull when locked, starred when cleared. */
export function block(state: "open" | "cleared" | "locked"): Sprite[] {
  const face = state === "locked" ? "#a8a8b0" : state === "cleared" ? "#58c838" : "#f8d000";
  const dark = state === "locked" ? "#707078" : state === "cleared" ? "#207818" : "#c07000";
  return [0, 1].map((f) => {
    const p = new Pix(14, 14);
    p.rect(0, 0, 14, 14, face);
    p.rect(0, 12, 14, 2, dark);
    p.rect(12, 0, 2, 14, dark);
    p.rect(1, 1, 11, 1, "#fff8c0");
    for (const [x, y] of [[1, 1], [11, 1], [1, 11], [11, 11]]) p.set(x, y, dark);
    const mark = state === "cleared" ? "#ffffff" : f && state === "open" ? "#ffffff" : "#5a3010";
    if (state === "cleared") {
      // A small star
      p.rect(6, 3, 2, 8, mark);
      p.rect(3, 6, 8, 2, mark);
      p.rect(5, 5, 4, 4, mark);
    } else {
      p.rect(6, 3, 2, 6, mark);
      p.rect(6, 10, 2, 2, mark);
    }
    return p.sprite();
  });
}

/** A small twinkling star for the Star Road. */
export function starlet(): Sprite[] {
  return [0, 1, 2].map((f) => {
    const p = new Pix(7, 7);
    const c = f === 1 ? "#ffffff" : "#f8e070";
    p.rect(3, 0, 1, 7, c);
    p.rect(0, 3, 7, 1, c);
    p.rect(2, 2, 3, 3, c);
    if (f === 1) p.set(3, 3, "#fff8c0");
    if (f === 2) {
      p.set(3, 0, "x");
      p.set(3, 6, "x");
      p.set(0, 3, "x");
      p.set(6, 3, "x");
    }
    return p.sprite();
  });
}

/** Star Road landmark: a big star on a stone plinth, glowing in a slow pulse. */
export function starGate(): Sprite[] {
  return [0, 1, 2].map((f) => {
    const p = new Pix(28, 32);
    const glow = ["#f8d800", "#fff070", "#f8b800"][f];
    p.rect(8, 24, 12, 8, C.stone);
    p.rect(16, 24, 4, 8, C.stoneDark);
    p.rect(6, 22, 16, 3, C.stoneLight);
    // Five-point star: two triangles and a body, with a lit core.
    p.tri(14, 0, 9, 4, glow);
    p.rect(2, 8, 24, 4, glow);
    p.tri(14, 8, 20, 9, glow);
    for (let y = 16; y < 22; y++) {
      p.rect(5 + (y - 16), y, 4, 1, glow);
      p.rect(19 - (y - 16), y, 4, 1, glow);
    }
    p.rect(11, 9, 6, 5, "#fffbe0");
    p.rect(12, 10, 1, 2, PAL.k);
    p.rect(15, 10, 1, 2, PAL.k);
    return p.sprite();
  });
}

/** Soft pixel cloud with a pale outline. */
export function cloud(w: number): Sprite {
  const p = new Pix(w, 14);
  p.blob(w * 0.3, 9, w * 0.25, 5, "#ffffff", undefined, "#d8ecf8");
  p.blob(w * 0.55, 6, w * 0.28, 6, "#ffffff", undefined, "#d8ecf8");
  p.blob(w * 0.78, 9, w * 0.2, 4.5, "#ffffff", undefined, "#d8ecf8");
  p.rect(Math.round(w * 0.12), 10, Math.round(w * 0.76), 4, "#ffffff");
  p.rect(Math.round(w * 0.12), 13, Math.round(w * 0.76), 1, "#d8ecf8");
  return p.sprite("#a8c8e8");
}

/** Bouncing "you are here" arrow over the player. */
export function arrow(): Sprite {
  const p = new Pix(7, 5);
  p.rect(0, 0, 7, 1, C.window);
  p.rect(1, 1, 5, 1, C.window);
  p.rect(2, 2, 3, 1, C.window);
  p.rect(3, 3, 1, 1, C.window);
  return p.sprite();
}

/** White halo around a sprite so it stands out on any ground. */
export function halo(src: Sprite, color = "#ffffff"): Sprite {
  const c = document.createElement("canvas");
  c.width = src.width + 2;
  c.height = src.height + 2;
  const ctx = c.getContext("2d")!;
  for (const [dx, dy] of [[0, 1], [2, 1], [1, 0], [1, 2], [0, 0], [2, 0], [0, 2], [2, 2]]) ctx.drawImage(src, dx, dy);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(src, 1, 1);
  return c;
}
