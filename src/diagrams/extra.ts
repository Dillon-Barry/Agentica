import { box, ln, mover, seg, svg, txt } from "./kit";

/** Diagrams for the round-2 lessons: planning, skills, patterns, evals, identity. */

const steps = ["1 DATES", "2 CALENDAR", "3 VENUES", "4 PRICES", "5 BOOK"];
const plan = svg(
  "Diagram: a goal broken into five steps, with a reflection check at the end that can send the agent back to re-plan",
  `
  ${box(110, 6, 100, 26, "GOAL", "d-box d-hl")}
  ${steps
    .map((s, i) => {
      const x = 2 + i * 64;
      return `${seg(160, 32, x + 30, 60)}<rect x="${x}" y="60" width="60" height="22" class="d-box"/>${txt(x + 30, 74, s)}`;
    })
    .join("")}
  ${box(96, 116, 128, 28, "REFLECT", "d-box", "DID IT WORK?")}
  ${ln(288, 82, 224, 120)}
  ${ln(96, 126, 160, 84, false, "d-line d-dash")}
  ${txt(70, 112, "RE-PLAN", "d-sub d-acc")}
  ${mover("M160,32 L32,60 M160,32 L288,60 L288,82 L224,120", 4)}`,
);

const skills = svg(
  "Diagram: the agent's context holds only short skill summaries; the full release-notes skill folder loads when a task needs it",
  `
  <rect x="8" y="16" width="134" height="128" class="d-box"/>
  ${txt(75, 32, "CONTEXT", "d-txt")}
  <rect x="18" y="44" width="114" height="20" class="d-bar"/>
  ${txt(75, 57, "expense-forms")}
  <rect x="18" y="72" width="114" height="20" class="d-box d-hl"/>
  ${txt(75, 85, "release-notes", "d-sub d-acc")}
  <rect x="18" y="100" width="114" height="20" class="d-bar"/>
  ${txt(75, 113, "brand-voice")}
  <rect x="196" y="30" width="116" height="100" class="d-box d-hl"/>
  ${txt(254, 48, "SKILL", "d-txt")}
  ${txt(206, 72, "SKILL.md", "d-sub", "start")}
  ${txt(206, 90, "scripts/", "d-sub", "start")}
  ${txt(206, 108, "examples/", "d-sub", "start")}
  ${ln(194, 82, 136, 82)}
  ${txt(166, 74, "LOAD")}
  ${txt(160, 156, "NAMES FIRST, DETAILS ON DEMAND", "d-sub d-acc")}
  ${mover("M194,82 L136,82", 1.6)}`,
);

const panel = (x: number, y: number, title: string) =>
  `<rect x="${x}" y="${y}" width="150" height="72" class="d-box"/>${txt(x + 75, y + 14, title, "d-sub d-acc")}`;
const sq = (x: number, y: number, w = 22, h = 14, cls = "d-box d-hl") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/>`;
const patterns = svg(
  "Diagram: four workflow patterns. Chain: steps in a row. Route: one input sent to one of several paths. Parallel: split, run at once, merge. Evaluate: make and check in a loop",
  `
  ${panel(6, 4, "CHAIN")}
  ${sq(20, 34)}${sq(70, 34)}${sq(120, 34)}
  ${ln(42, 41, 68, 41)}${ln(92, 41, 118, 41)}
  ${panel(164, 4, "ROUTE")}
  ${sq(176, 38)}
  ${sq(262, 24, 26, 10, "d-box")}${sq(262, 40, 26, 10, "d-box")}${sq(262, 56, 26, 10, "d-box")}
  ${ln(198, 45, 260, 29)}${ln(198, 45, 260, 45, false, "d-line")}${ln(198, 45, 260, 61)}
  ${panel(6, 84, "PARALLEL")}
  ${sq(16, 118, 18, 12)}
  ${sq(64, 102, 22, 10, "d-box")}${sq(64, 118, 22, 10, "d-box")}${sq(64, 134, 22, 10, "d-box")}
  ${sq(120, 118, 18, 12)}
  ${seg(34, 124, 62, 107)}${seg(34, 124, 62, 123)}${seg(34, 124, 62, 139)}
  ${seg(86, 107, 118, 124)}${seg(86, 123, 118, 124)}${seg(86, 139, 118, 124)}
  ${panel(164, 84, "EVALUATE")}
  ${box(176, 112, 50, 22, "MAKE", "d-box d-hl")}
  ${box(250, 112, 56, 22, "CHECK")}
  ${ln(226, 116, 248, 116)}
  ${ln(250, 130, 228, 130)}
  ${mover("M42,41 L68,41 M92,41 L118,41", 1.6)}
  ${mover("M226,116 L248,116 M250,130 L228,130", 1.6, "d-dot", 0.8)}`,
);

const runs = [1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1];
const bars: [string, number, number][] = [
  ["MODEL", 0, 40],
  ["TOOL search", 40, 70],
  ["MODEL", 110, 30],
  ["TOOL email", 140, 24],
];
const evals = svg(
  "Diagram: an eval suite of fifteen runs with three failures, and a trace showing each step of one run over time",
  `
  ${txt(68, 16, "EVAL SUITE", "d-txt")}
  ${runs.map((r, i) => sq(14 + (i % 5) * 22, 26 + Math.floor(i / 5) * 22, 16, 16, r ? "d-box d-good" : "d-box d-bad")).join("")}
  ${txt(68, 108, "12/15 PASS", "d-sub d-acc")}
  ${txt(68, 122, "RUN AGAIN AFTER")}
  ${txt(68, 134, "EVERY CHANGE")}
  ${txt(232, 16, "TRACE", "d-txt")}
  ${seg(150, 28, 150, 130, "d-tick")}
  ${bars
    .map(([label, start, w], i) => {
      const y = 30 + i * 24;
      return `<rect x="${150 + start}" y="${y}" width="${w}" height="14" class="${label.startsWith("TOOL") ? "d-box d-hl" : "d-bar"}"/>${txt(150 + start + 2, y + 24, label, "d-sub", "start")}`;
    })
    .join("")}
  ${txt(232, 150, "EVERY STEP, TIME, COST", "d-sub d-acc")}
  ${mover("M150,140 L318,140", 3)}`,
);

const identity = svg(
  "Diagram: Alex's request becomes a short-lived token naming Alex as the user and Bit as the actor, with a narrow scope, which the tool checks",
  `
  ${box(4, 62, 56, 36, "ALEX", "d-box", "USER")}
  <rect x="78" y="46" width="98" height="68" class="d-box d-hl"/>
  ${txt(127, 62, "TOKEN", "d-txt")}
  ${txt(86, 78, "sub: alex", "d-sub", "start")}
  ${txt(86, 90, "act: bit", "d-sub", "start")}
  ${txt(86, 102, "scope: read", "d-sub", "start")}
  ${box(194, 62, 54, 36, "BIT", "d-box d-hl", "AGENT")}
  ${box(264, 62, 52, 36, "TOOL", "d-box", "CHECKS")}
  ${ln(60, 80, 76, 80)}
  ${ln(176, 80, 192, 80)}
  ${ln(248, 80, 262, 80)}
  ${txt(127, 36, "SHORT-LIVED, NARROW", "d-sub d-acc")}
  ${txt(160, 140, "WHO IS ACTING? FOR WHOM?", "d-sub")}
  ${txt(160, 152, "ALLOWED TO DO WHAT?", "d-sub d-acc")}
  ${mover("M60,80 L76,80 M176,80 L192,80 M248,80 L262,80", 2)}`,
);

export const EXTRA_DIAGRAMS: Record<string, string> = { plan, skills, patterns, evals, identity };
