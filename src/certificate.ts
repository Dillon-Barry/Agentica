import { ART, PAL, sprite } from "./map/pixels";
import { halo } from "./map/props";
import { MAIN_WORLDS, WORLDS } from "./worlds";

/**
 * Pixel-art cards drawn on a 1200x630 canvas: the completion certificate
 * (with the player's name) and the link-preview image. 1200x630 is the size
 * LinkedIn and most sites use for shared images.
 */

export const CARD_W = 1200;
export const CARD_H = 630;

const NAVY = "#10102a";
const SITE = "dillon-barry.github.io/Agentica";

export interface CardOptions {
  /** Certificate holder. Omit for the link-preview card. */
  name?: string;
  date?: Date;
  /** Whether the bonus Star Road was conquered too. */
  bonus?: boolean;
}

async function fontsReady(): Promise<void> {
  try {
    await Promise.all([
      document.fonts.load('40px "Press Start 2P"'),
      document.fonts.load('600 40px "Atkinson Hyperlegible Next"'),
    ]);
  } catch {
    /* fall back to system fonts */
  }
}

function frame(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = PAL.k;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.fillStyle = PAL.w;
  ctx.fillRect(16, 16, CARD_W - 32, CARD_H - 32);
  ctx.fillStyle = PAL.k;
  ctx.fillRect(28, 28, CARD_W - 56, CARD_H - 56);
  ctx.fillStyle = NAVY;
  ctx.fillRect(36, 36, CARD_W - 72, CARD_H - 72);
  // Pixel stars scattered in the background.
  ctx.fillStyle = "#2c3a78";
  for (let i = 0; i < 70; i++) {
    const x = 50 + ((i * 397) % (CARD_W - 100));
    const y = 50 + ((i * 211) % (CARD_H - 100));
    ctx.fillRect(x, y, 6, 6);
  }
}

function title(ctx: CanvasRenderingContext2D, text: string, y: number, size: number, color: string) {
  ctx.font = `${size}px "Press Start 2P", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = PAL.k;
  ctx.fillText(text, CARD_W / 2 + size / 8, y + size / 8);
  ctx.fillStyle = color;
  ctx.fillText(text, CARD_W / 2, y);
}

function body(ctx: CanvasRenderingContext2D, text: string, y: number, size: number, color: string, weight = 400) {
  ctx.font = `${weight} ${size}px "Atkinson Hyperlegible Next", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.fillText(text, CARD_W / 2, y);
}

function bit(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  const s = halo(sprite([...ART.player, ...ART.feetA]));
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(s, x, y, s.width * scale, s.height * scale);
}

/** Draw the certificate (or, without a name, the link-preview card). */
export async function drawCard(ctx: CanvasRenderingContext2D, opts: CardOptions = {}): Promise<void> {
  await fontsReady();
  frame(ctx);

  if (opts.name === undefined) {
    title(ctx, "AGENTICA", 210, 96, PAL.y);
    body(ctx, "A retro quest from zero to expert in AI agents", 300, 40, PAL.w, 600);
    body(ctx, "Agents · tools & MCP · teams · security · kagent · agentregistry · agentgateway", 360, 26, "#c8c8e0");
    bit(ctx, CARD_W / 2 - 54, 400, 6);
    ctx.font = '18px "Press Start 2P", monospace';
    ctx.fillStyle = PAL.y;
    ctx.fillText(SITE, CARD_W / 2, 570);
    return;
  }

  title(ctx, "AGENTICA", 140, 72, PAL.y);
  title(ctx, "CERTIFICATE OF COMPLETION", 200, 22, PAL.w);
  body(ctx, "This certifies that", 262, 26, "#c8c8e0");
  body(ctx, opts.name.trim() || "A brave adventurer", 338, 58, PAL.w, 700);
  body(ctx, "completed Agentica, a quest from zero to expert in AI agents,", 398, 26, "#e8e8f8");
  body(ctx, "covering agent design, tools and MCP, multi-agent systems, security,", 434, 26, "#e8e8f8");
  body(ctx, "and the kagent, agentregistry and agentgateway platform.", 470, 26, "#e8e8f8");

  const worlds = WORLDS.filter((w) => w.num <= MAIN_WORLDS || opts.bonus).map((w) => (w.num > MAIN_WORLDS ? `★ ${w.name.toUpperCase()}` : w.name.toUpperCase()));
  // Shrink the pixel font a step at a time until the list fits inside the frame.
  const line = worlds.join(" · ");
  for (let size = 13; size >= 8; size--) {
    ctx.font = `${size}px "Press Start 2P", monospace`;
    if (ctx.measureText(line).width <= CARD_W - 120) break;
  }
  ctx.fillStyle = PAL.y;
  ctx.fillText(line, CARD_W / 2, 516);

  const date = (opts.date ?? new Date()).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  ctx.textAlign = "left";
  ctx.font = '400 22px "Atkinson Hyperlegible Next", system-ui, sans-serif';
  ctx.fillStyle = "#c8c8e0";
  ctx.fillText(date, 72, 574);
  ctx.textAlign = "right";
  ctx.fillText(SITE, CARD_W - 72, 574);
  bit(ctx, 76, 64, 5);
}
