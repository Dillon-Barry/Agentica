import { ART, PAL, bitSprite, silhouette, sprite, type Sprite } from "./pixels";
import { reducedMotion } from "../typewriter";
import type { World } from "../types";

/** Pixel boss arena: Bit on the left, the boss on the right, HUD on top. */

export const ARENA_W = 160;
export const ARENA_H = 76;
const FLOOR = 62;

interface Shot {
  from: number;
  to: number;
  t0: number;
  color: string;
  onHit: () => void;
}

export class Arena {
  private ctx: CanvasRenderingContext2D;
  private boss: Sprite;
  private bossFlash: Sprite;
  private player: Sprite[];
  private playerFlash: Sprite;
  private playerHappy: Sprite;
  private playerSad: Sprite;
  /** Bit cheers after landing a hit and slumps after taking one. */
  private mood?: { happy: boolean; until: number };
  private heart: Sprite;
  private heartEmpty: Sprite;
  private raf = 0;
  private tick = 0;
  private t0 = performance.now();
  private shot?: Shot;
  private bossHitUntil = 0;
  private playerHitUntil = 0;
  private defeatedAt = 0;

  hp: number;
  hearts: number;

  constructor(
    readonly canvas: HTMLCanvasElement,
    private world: World,
    readonly maxHp: number,
    readonly maxHearts: number,
  ) {
    canvas.width = ARENA_W;
    canvas.height = ARENA_H;
    this.ctx = canvas.getContext("2d")!;
    this.boss = sprite(ART.monster, { r: world.boss.body, R: world.boss.shade, o: "w" });
    this.bossFlash = silhouette(this.boss);
    this.player = [bitSprite("idle", ART.feetA), bitSprite("idle", ART.feetB)];
    this.playerHappy = bitSprite("happy");
    this.playerSad = bitSprite("sad");
    this.playerFlash = silhouette(this.player[0], PAL.r);
    this.heart = sprite(ART.heart);
    this.heartEmpty = sprite(ART.heart, { r: "#404050" });
    this.hp = maxHp;
    this.hearts = maxHearts;
  }

  start(): void {
    const loop = () => {
      // Real-time clock: same speed on any refresh rate.
      this.tick = Math.max(0, Math.floor((performance.now() - this.t0) / (1000 / 60)));
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  stop(): void {
    cancelAnimationFrame(this.raf);
  }

  reset(): void {
    this.hp = this.maxHp;
    this.hearts = this.maxHearts;
    this.defeatedAt = 0;
    this.shot = undefined;
    this.mood = undefined;
  }

  /** Bit fires at the boss; it loses one HP when the shot lands. */
  hitBoss(done: () => void): void {
    this.fire(40, 112, PAL.y, () => {
      this.hp = Math.max(0, this.hp - 1);
      this.bossHitUntil = performance.now() + 350;
      this.mood = { happy: true, until: performance.now() + 900 };
      if (this.hp === 0) this.defeatedAt = performance.now();
      done();
    });
  }

  /** The boss fires back; Bit loses a heart. */
  hitPlayer(done: () => void): void {
    this.fire(104, 34, this.world.boss.body, () => {
      this.hearts = Math.max(0, this.hearts - 1);
      this.playerHitUntil = performance.now() + 350;
      this.mood = { happy: false, until: performance.now() + 1100 };
      done();
    });
  }

  private fire(from: number, to: number, color: string, onHit: () => void) {
    if (reducedMotion()) {
      onHit();
      return;
    }
    this.shot = { from, to, t0: performance.now(), color, onHit };
  }

  private draw(): void {
    const ctx = this.ctx;
    const now = performance.now();
    ctx.imageSmoothingEnabled = false;

    // Fortress wall and floor.
    ctx.fillStyle = "#282838";
    ctx.fillRect(0, 0, ARENA_W, ARENA_H);
    ctx.fillStyle = "#34344a";
    for (let y = 0; y < FLOOR; y += 8) {
      const off = (y / 8) % 2 ? 8 : 0;
      for (let x = -off; x < ARENA_W; x += 16) ctx.fillRect(x + 1, y + 1, 14, 6);
    }
    ctx.fillStyle = PAL.k;
    ctx.fillRect(0, FLOOR, ARENA_W, 1);
    ctx.fillStyle = "#6a6a80";
    ctx.fillRect(0, FLOOR + 1, ARENA_W, ARENA_H - FLOOR - 1);
    ctx.fillStyle = "#4a4a60";
    for (let x = 0; x < ARENA_W; x += 12) ctx.fillRect(x, FLOOR + 1, 1, ARENA_H - FLOOR - 1);

    // Bit.
    const mood = this.mood && now < this.mood.until ? this.mood : undefined;
    const pFrame = mood ? (mood.happy ? this.playerHappy : this.playerSad) : this.player[(this.tick >> 4) & 1];
    const pImg = now < this.playerHitUntil && (this.tick >> 1) & 1 ? this.playerFlash : pFrame;
    const pShake = now < this.playerHitUntil ? ((this.tick >> 1) & 1 ? 1 : -1) : 0;
    // A happy Bit hops; a hurt one sags a pixel.
    const left = mood ? mood.until - now : 0;
    const hop = mood?.happy && !reducedMotion() ? Math.round(Math.abs(Math.sin((left / 900) * Math.PI * 2)) * 6) : 0;
    const sag = mood && !mood.happy && now >= this.playerHitUntil ? 2 : 0;
    ctx.drawImage(pImg, 20 + pShake, FLOOR - pImg.height * 2 + 2 - hop + sag, pImg.width * 2, pImg.height * 2);

    // Boss: bobs, flashes when hit, sinks away when beaten.
    const fall = this.defeatedAt ? Math.min(40, (now - this.defeatedAt) / 25) : 0;
    if (fall < 40) {
      const bob = this.defeatedAt ? 0 : (this.tick >> 5) & 1;
      const bShake = now < this.bossHitUntil ? ((this.tick >> 1) & 1 ? 2 : -2) : 0;
      const bImg = now < this.bossHitUntil && (this.tick >> 1) & 1 ? this.bossFlash : this.boss;
      ctx.globalAlpha = 1 - fall / 40;
      ctx.drawImage(bImg, 100 + bShake, FLOOR - this.boss.height * 2 + 2 - bob + fall, this.boss.width * 2, this.boss.height * 2);
      ctx.globalAlpha = 1;
    }

    // Projectile.
    if (this.shot) {
      const s = this.shot;
      const t = Math.min(1, (now - s.t0) / 320);
      const x = Math.round(s.from + (s.to - s.from) * t);
      const y = Math.round(FLOOR - 22 - Math.sin(t * Math.PI) * 10);
      ctx.fillStyle = PAL.k;
      ctx.fillRect(x - 3, y - 3, 6, 6);
      ctx.fillStyle = s.color;
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillStyle = PAL.w;
      ctx.fillRect(x - 1, y - 2, 1, 1);
      if (t >= 1) {
        this.shot = undefined;
        s.onHit();
      }
    }

    // HUD: hearts left, boss HP right.
    for (let i = 0; i < this.maxHearts; i++) ctx.drawImage(i < this.hearts ? this.heart : this.heartEmpty, 4 + i * 9, 4);
    const barX = ARENA_W - 4 - this.maxHp * 7;
    ctx.fillStyle = PAL.k;
    ctx.fillRect(barX - 1, 3, this.maxHp * 7 + 1, 8);
    for (let i = 0; i < this.maxHp; i++) {
      ctx.fillStyle = i < this.hp ? PAL.r : "#404050";
      ctx.fillRect(barX + i * 7, 4, 6, 6);
      if (i < this.hp) {
        ctx.fillStyle = "#f87858";
        ctx.fillRect(barX + i * 7, 4, 6, 1);
      }
    }
  }
}
