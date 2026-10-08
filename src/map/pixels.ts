/**
 * Pixel art: one fixed palette and hand-drawn sprites. Each sprite is rows of
 * palette characters ("." = transparent), pre-rendered to a small canvas.
 */

export const PAL: Record<string, string> = {
  k: "#101018", // outline
  w: "#f8f8f8",
  g: "#b8b8b8",
  G: "#707070",
  r: "#e83800",
  R: "#a82000",
  y: "#f8d800",
  o: "#f88800",
  t: "#a85810",
  T: "#683000",
  e: "#40a830",
  E: "#206818",
  l: "#88d850",
  b: "#182868",
  c: "#58f8f8",
  p: "#b878f8",
  P: "#6838a8",
  s: "#f0d090", // road
  S: "#a06830", // road edge
};

export type Sprite = HTMLCanvasElement;

export function sprite(rows: string[], swap: Record<string, string> = {}): Sprite {
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const ctx = c.getContext("2d")!;
  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const key = swap[ch] ?? ch;
      if (key === ".") return;
      ctx.fillStyle = PAL[key] ?? key;
      ctx.fillRect(x, y, 1, 1);
    });
  });
  return c;
}

/** All-white copy of a sprite, for hit flashes. */
export function silhouette(src: Sprite, color = "#ffffff"): Sprite {
  const c = document.createElement("canvas");
  c.width = src.width;
  c.height = src.height;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(src, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

/** Round level dot with outline, highlight and shade. */
export function dot(fill: string, shade: string, size = 10): Sprite {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const r = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x + 0.5 - r;
      const dy = y + 0.5 - r;
      const d = Math.hypot(dx, dy);
      if (d > r) continue;
      let col = d > r - 1.2 ? PAL.k : dy > r * 0.25 ? shade : fill;
      if (col === fill && dx < -0.5 && dy < -0.5 && d > r * 0.35 && d < r * 0.75) col = PAL.w;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

/** Rounded mound, lit from the top left. */
export function mound(w: number, h: number, base: string, light: string, dark: string): Sprite {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const rx = w / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = (x + 0.5 - rx) / rx;
      const ny = (y + 0.5 - h) / h;
      const d = nx * nx + ny * ny;
      if (d > 1) continue;
      const edge = (x + 1.5 - rx) ** 2 / rx ** 2 + ny * ny > 1 || (x - 0.5 - rx) ** 2 / rx ** 2 + ny * ny > 1 || nx * nx + ((y - 0.5 - h) / h) ** 2 > 1;
      ctx.fillStyle = edge ? PAL.k : nx < -0.25 && ny < -0.45 ? light : nx > 0.35 ? dark : base;
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return c;
}

// Bit's faces: rows 7 and 8 of the player sprite are the eyes.
export type BitFace = "idle" | "blink" | "happy" | "sad";
const EYES: Record<BitFace, [string, string]> = {
  idle: [".kwbccbbbbccbwk.", ".kwbccbbbbccbwk."],
  blink: [".kwbbbbbbbbbbwk.", ".kwbccbbbbccbwk."],
  happy: [".kwbbcbbbbcbbwk.", ".kwbcbcbbcbcbwk."],
  sad: [".kwbbbbbbbbbbwk.", ".kwbccbbbbccbwk."],
};

/** Bit with a given face and standing feet. Sad Bit's antenna light goes out. */
export function bitSprite(face: BitFace, feet: string[] = ART.feetA): Sprite {
  const rows = [...ART.player];
  [rows[7], rows[8]] = EYES[face];
  if (face === "sad") rows[1] = "......kGGk......";
  return sprite([...rows, ...feet]);
}

// Sprite sheets ------------------------------------------------------------

export const ART = {
  player: [
    "......kkkk......",
    "......kyyk......",
    "......kkkk......",
    ".......kk.......",
    "..kkkkkkkkkkkk..",
    ".kwwwwwwwwwwwwk.",
    ".kwbbbbbbbbbbwk.",
    ".kwbccbbbbccbwk.",
    ".kwbccbbbbccbwk.",
    ".kwbbbbbbbbbbwk.",
    ".kwwwwwwwwwwwwk.",
    "..kkkkkkkkkkkk..",
    "...krrrrrrrrk...",
    "..krrrryyrrrrk..",
    "..krrrrrrrrrrk..",
    "...kkkkkkkkkk...",
  ],
  feetA: ["...kGGk..kGGk...", "...kkkk..kkkk..."],
  feetB: ["....kGGkkGGk....", "....kkkkkkkk...."],
  tree: [
    "..kkkkk..",
    ".kllleek.",
    "kllleeeEk",
    "kleeeeeEk",
    "keeeeeEEk",
    ".keeeEEk.",
    "..kkkkk..",
    "...ktk...",
    "...ktk...",
    "...kkk...",
  ],
  pine: [
    "...k...",
    "..kek..",
    "..kek..",
    ".keeek.",
    ".keEek.",
    "keeeEek",
    "keeeeEk",
    "kkkkkkk",
    "..ktk..",
    "..kkk..",
  ],
  house: [
    "....k....",
    "...krk...",
    "..krrrk..",
    ".krrrrrk.",
    "kkkkkkkkk",
    ".kwwwwwk.",
    ".kwbwtwk.",
    ".kwwwtwk.",
    ".kkkkkkk.",
  ],
  ghost: [
    "..kkkk..",
    ".kwwwwk.",
    "kwkwwkwk",
    "kwkwwkwk",
    "kwwwwwwk",
    "kwwwwwwk",
    "kwwwwwwk",
    "kk.kk.kk",
  ],
  rock: [
    ".kkkk.",
    "kwgggk",
    "kgggGk",
    "kgGGGk",
    ".kkkk.",
  ],
  crystal: [
    "..k..",
    ".kck.",
    ".kwk.",
    "kcwck",
    "kccck",
    "kccck",
    ".kck.",
    "..k..",
  ],
  deadTree: [
    "k.....k",
    ".k...k.",
    "..k.k..",
    "...k...",
    "...k...",
    "...k...",
    "..kkk..",
  ],
  fortress: [
    "......kkkk....",
    "......kyyyk...",
    "......kyyk....",
    "......kk......",
    "......k.......",
    "kkk.kkkkkk.kkk",
    "kgk.kgggGk.kgk",
    "kgkkkgggGkkkgk",
    "kgggggggggggGk",
    "kgwgggggggggGk",
    "kgggkkkkkgggGk",
    "kgggkbbbkgggGk",
    "kgggkbbbkgggGk",
    "kgggkbbbkgggGk",
    "kkkkkkkkkkkkkk",
  ],
  heart: [
    ".kk.kk.",
    "krrkrrk",
    "krrrrrk",
    ".krrrk.",
    "..krk..",
    "...k...",
  ],
  monster: [
    "..kk............kk..",
    "..kok..........kok..",
    "...kok.kkkkkk.kok...",
    "....kkkrrrrrrkkk....",
    "...krrrrrrrrrrrrk...",
    "..krrrrrrrrrrrrrrk..",
    ".krrwwwrrrrrrwwwrrk.",
    ".krrwkkwrrrrwkkwrrk.",
    "krrrwkkwrrrrwkkwrrrk",
    "krrrrwwrrrrrrwwrrrrk",
    "krrrrrrrrrrrrrrrrrrk",
    "krrrkwkwkwkwkwkrrrrk",
    "krrrkkkkkkkkkkkrrrRk",
    ".krrrrrrrrrrrrrrrRk.",
    ".kRrrrrrrrrrrrrrRRk.",
    "..kRRrrrrrrrrrRRk...",
    "...kkkkk....kkkkk...",
    "...kRRRk....kRRRk...",
    "...kkkkk....kkkkk...",
  ],
};
