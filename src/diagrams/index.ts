/** Lesson diagrams, keyed by the lesson frontmatter `diagram:` value. World 1 lives here. */

import { box, ln, mover, part, partName, svg, txt } from "./kit";
import { MORE_DIAGRAMS } from "./worlds";
import { EXTRA_DIAGRAMS } from "./extra";
import { STAR_DIAGRAMS } from "./star";

const agentCore = svg(
  "Diagram: you give the agent a goal; the model loops, using tools and memory, until the goal is met and it reports back",
  `
  ${box(4, 62, 52, 32, "GOAL", "d-box", "YOUR TASK")}
  ${box(90, 50, 80, 56, "MODEL", "d-box d-hl", "the brain")}
  ${box(196, 8, 60, 28, "TOOLS")}
  ${box(196, 124, 60, 28, "MEMORY")}
  ${box(264, 62, 52, 32, "DONE", "d-box", "GOAL MET")}
  ${ln(56, 78, 88, 78)}
  ${ln(166, 50, 204, 38, true)}
  ${ln(166, 106, 204, 124, true)}
  ${ln(170, 78, 262, 78)}
  ${part("loop", `<path d="M104,50 V38 H156 V46" class="d-line d-fill-none" marker-end="url(#arrow)"/>${txt(130, 32, "LOOP", "d-sub d-acc")}`)}
  ${txt(4, 150, "THINK > ACT > OBSERVE", "d-sub", "start")}
  ${mover("M104,50 V38 H156 V50", 2)}
  ${mover("M166,50 L204,38 L166,50 M166,106 L204,124 L166,106", 4, "d-dot", 1)}`,
);

const eras: [string, string][] = [
  ["1966", "ELIZA"],
  ["1970s", "EXPERT"],
  ["1990s", "BDI"],
  ["2016", "ALPHAGO"],
  ["2022", "REACT"],
  ["2023", "AUTOGPT"],
  ["2024", "MCP"],
  ["2025", "A2A"],
];

const timeline = svg(
  "Diagram: timeline of agents from ELIZA in 1966 to A2A in 2025. Eras are evenly spaced, not to scale",
  `
  <line x1="10" y1="80" x2="310" y2="80" class="d-line"/>
  ${eras
    .map(([year, name], i) => {
      const x = 25 + i * 38;
      const nameY = i % 2 === 0 ? 100 : 114;
      const cls = i >= 4 ? "d-mark d-hl" : "d-mark";
      return part(partName(name), `
      <rect x="${x - 4}" y="76" width="8" height="8" class="${cls}"/>
      <text x="${x}" y="66" class="d-sub" text-anchor="middle">${year}</text>
      <line x1="${x}" y1="84" x2="${x}" y2="${nameY - 8}" class="d-tick"/>
      <text x="${x}" y="${nameY}" class="d-sub" text-anchor="middle">${name}</text>`);
    })
    .join("")}
  <rect width="6" height="6" y="-3" x="-3" class="d-dot">
    <animateMotion dur="6s" repeatCount="indefinite" path="M10,80 L310,80"/>
  </rect>
  <text x="160" y="30" class="d-txt" text-anchor="middle">60 YEARS OF AGENTS</text>
  <text x="235" y="140" class="d-sub d-acc" text-anchor="middle">THE LLM ERA</text>
  <text x="160" y="152" class="d-sub" text-anchor="middle">NOT TO SCALE</text>`,
);

const chatVsAgent = svg(
  "Diagram: a chatbot turns a question into text; an agent loops through tools until the job is done",
  `
  <text x="8" y="24" class="d-sub d-acc">CHATBOT</text>
  ${box(8, 32, 56, 28, "YOU")}
  ${box(132, 32, 56, 28, "BOT")}
  ${box(256, 32, 56, 28, "TEXT")}
  <line x1="64" y1="46" x2="128" y2="46" class="d-line" marker-end="url(#arrow)"/>
  <line x1="188" y1="46" x2="252" y2="46" class="d-line" marker-end="url(#arrow)"/>

  <text x="8" y="90" class="d-sub d-acc">AGENT</text>
  ${box(8, 98, 56, 28, "YOU")}
  ${box(100, 98, 64, 28, "AGENT", "d-box d-hl")}
  ${box(100, 132, 64, 22, "TOOLS")}
  ${box(256, 98, 56, 28, "DONE")}
  <line x1="64" y1="112" x2="96" y2="112" class="d-line" marker-end="url(#arrow)"/>
  <line x1="164" y1="112" x2="252" y2="112" class="d-line" marker-end="url(#arrow)"/>
  <path d="M164,120 H182 V143 H164" class="d-line d-fill-none" marker-end="url(#arrow)"/>
  <path d="M100,143 H84 V120 H100" class="d-line d-fill-none" marker-end="url(#arrow)"/>
  <rect width="6" height="6" x="-3" y="-3" class="d-dot">
    <animateMotion dur="3s" repeatCount="indefinite" path="M164,120 H182 V143 H164 M100,143 H84 V120 H100"/>
  </rect>
  <text x="210" y="140" class="d-sub">LOOPS UNTIL</text>
  <text x="210" y="150" class="d-sub">GOAL IS MET</text>`,
);

export const DIAGRAMS: Record<string, string> = {
  ...MORE_DIAGRAMS,
  ...EXTRA_DIAGRAMS,
  ...STAR_DIAGRAMS,
  "agent-core": agentCore,
  timeline,
  "chat-vs-agent": chatVsAgent,
};
