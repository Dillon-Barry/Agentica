import { ROUTE } from "../worlds";

/** Pixel position on the map. */
export interface Pt {
  x: number;
  y: number;
}

export const nodePx = (i: number): Pt => ({ x: ROUTE[i].x, y: ROUTE[i].y });

const worldNum = (i: number) => Number(ROUTE[i].id.split("-")[0]);

export interface Segment {
  /** Right-angle polyline from stop i to stop i+1: start, corner, end. */
  points: Pt[];
  length: number;
  /** Joins two worlds, so its middle is a bridge over water. */
  crossWorld: boolean;
}

/** Point `dist` pixels along a right-angle polyline. */
export function pointAt(points: Pt[], dist: number): Pt {
  let left = dist;
  for (let k = 0; k < points.length - 1; k++) {
    const p = points[k];
    const q = points[k + 1];
    const len = Math.abs(q.x - p.x) + Math.abs(q.y - p.y);
    if (left <= len || k === points.length - 2) {
      const t = len === 0 ? 0 : Math.min(1, left / len);
      return { x: Math.round(p.x + (q.x - p.x) * t), y: Math.round(p.y + (q.y - p.y) * t) };
    }
    left -= len;
  }
  return points[points.length - 1];
}

/**
 * Roads turn once, like a tile map. Each road leaves its stop along the
 * other axis from the one it arrived on, so roads never retrace each other.
 */
function buildSegments(): Segment[] {
  const out: Segment[] = [];
  let arrivedHorizontally: boolean | undefined;
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const a = nodePx(i);
    const b = nodePx(i + 1);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let verticalFirst = arrivedHorizontally ?? Math.abs(dy) > Math.abs(dx);
    if (dx === 0) verticalFirst = true;
    if (dy === 0) verticalFirst = false;
    const corner = verticalFirst ? { x: a.x, y: b.y } : { x: b.x, y: a.y };
    // Which way did we arrive at b? Along the second leg, unless it was empty.
    const secondLegEmpty = verticalFirst ? dx === 0 : dy === 0;
    arrivedHorizontally = secondLegEmpty ? !verticalFirst : verticalFirst;
    out.push({
      points: [a, corner, b],
      length: Math.abs(dx) + Math.abs(dy),
      crossWorld: worldNum(i) !== worldNum(i + 1),
    });
  }
  return out;
}

export const SEGMENTS: Segment[] = buildSegments();

/** Land on each side of a bridge, so only the middle of a crossing is water. */
const SHORE = 30;

export interface Blob extends Pt {
  r: number;
}

/** Circles whose union forms a world's island: around its stops and roads. */
export function islandBlobs(world: number): Blob[] {
  const blobs: Blob[] = [];
  const wobble = (x: number, y: number) => 3 * Math.sin(x * 0.11 + world) + 3 * Math.cos(y * 0.13 + world * 2);
  ROUTE.forEach((l, i) => {
    if (worldNum(i) === world) blobs.push({ x: l.x, y: l.y, r: 34 + wobble(l.x, l.y) });
  });
  // Fill the space between a world's stops so islands read as solid land.
  const own = ROUTE.filter((_, i) => worldNum(i) === world);
  const xs = own.map((l) => l.x);
  const ys = own.map((l) => l.y);
  for (let y = Math.min(...ys); y <= Math.max(...ys); y += 12) {
    for (let x = Math.min(...xs); x <= Math.max(...xs); x += 12) {
      if (own.some((l) => Math.hypot(l.x - x, l.y - y) < 60)) blobs.push({ x, y, r: 22 + wobble(x, y) });
    }
  }
  SEGMENTS.forEach((s, i) => {
    for (let d = 0; d <= s.length; d += 6) {
      const p = pointAt(s.points, d);
      const owner = !s.crossWorld ? worldNum(i) : d <= SHORE ? worldNum(i) : d >= s.length - SHORE ? worldNum(i + 1) : 0;
      if (owner === world) blobs.push({ ...p, r: 24 + wobble(p.x, p.y) });
    }
  });
  return blobs;
}
