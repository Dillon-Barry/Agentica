/**
 * Building blocks for the lesson diagrams. Every diagram uses a 320x160
 * viewBox; colours come from the d-* classes in style.css.
 */

const arrowDefs = `
  <defs>
    <marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L6,3 L0,6 Z" class="d-head"/>
    </marker>
  </defs>`;

/** Lower-case, dash-separated name for a diagram part, e.g. "AGENT CARD" -> "agent-card". */
export const partName = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * Wrap a piece of a diagram as a named part. Lessons can light up parts page
 * by page (frontmatter `focus:`), dimming the rest.
 */
export const part = (name: string, body: string) => `<g data-part="${name}">${body}</g>`;

/** Box with a centred label and optional small second line. Named after its label. */
export const box = (x: number, y: number, w: number, hgt: number, label: string, cls = "d-box", sub?: string, name = partName(label)) =>
  part(
    name,
    `
  <rect x="${x}" y="${y}" width="${w}" height="${hgt}" class="${cls}"/>
  <text x="${x + w / 2}" y="${y + hgt / 2 + (sub ? -2 : 3)}" class="d-txt" text-anchor="middle">${label}</text>
  ${sub ? `<text x="${x + w / 2}" y="${y + hgt / 2 + 10}" class="d-sub" text-anchor="middle">${sub}</text>` : ""}`,
  );

/** Line with an arrowhead at the end (and optionally the start). */
export const ln = (x1: number, y1: number, x2: number, y2: number, both = false, cls = "d-line") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}" marker-end="url(#arrow)"${both ? ' marker-start="url(#arrow)"' : ""}/>`;

/** Plain line, no arrowheads. */
export const seg = (x1: number, y1: number, x2: number, y2: number, cls = "d-line") =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;

export const txt = (x: number, y: number, s: string, cls = "d-sub", anchor: "start" | "middle" | "end" = "middle") =>
  `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${s}</text>`;

/** A square "packet" that travels along a path, forever. */
export const mover = (path: string, dur: number, cls = "d-dot", begin = 0) => `
  <rect width="6" height="6" x="-3" y="-3" class="${cls}">
    <animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/>
  </rect>`;

export const svg = (title: string, body: string) =>
  `<svg viewBox="0 0 320 160" class="diagram" role="img" aria-label="${title}" shape-rendering="crispEdges">
    <title>${title}</title>${arrowDefs}${body}</svg>`;
