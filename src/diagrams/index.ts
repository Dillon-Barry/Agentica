/** Lesson diagrams, keyed by the lesson frontmatter `diagram:` value. World 1 lives here. */

import { box, svg } from "./kit";
import { MORE_DIAGRAMS } from "./worlds";

const agentCore = svg(
  "Diagram: a goal feeds the model, which loops through tools and memory",
  `
  ${box(8, 62, 60, 32, "GOAL")}
  ${box(118, 50, 84, 56, "MODEL", "d-box d-hl", "the brain")}
  ${box(250, 18, 62, 32, "TOOLS")}
  ${box(250, 106, 62, 32, "MEMORY")}
  <line x1="68" y1="78" x2="114" y2="78" class="d-line" marker-end="url(#arrow)"/>
  <line x1="202" y1="62" x2="246" y2="38" class="d-line" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <line x1="202" y1="94" x2="246" y2="118" class="d-line" marker-start="url(#arrow)" marker-end="url(#arrow)"/>
  <rect width="6" height="6" x="-3" y="-3" class="d-dot">
    <animateMotion dur="4s" repeatCount="indefinite" path="M202,62 L246,38 L202,62 L202,94 L246,118 L202,94 Z"/>
  </rect>
  <text x="160" y="152" class="d-sub" text-anchor="middle">LOOP: THINK &gt; ACT &gt; OBSERVE &gt; REPEAT</text>`,
);

const eras: [string, string][] = [
  ["1966", "ELIZA"],
  ["1980", "EXPERT"],
  ["1995", "BDI"],
  ["2016", "ALPHAGO"],
  ["2022", "REACT"],
  ["2023", "AUTOGPT"],
  ["2024", "MCP"],
  ["2025", "A2A"],
];

const timeline = svg(
  "Diagram: timeline of agents from ELIZA in 1966 to A2A in 2025",
  `
  <line x1="10" y1="80" x2="310" y2="80" class="d-line"/>
  ${eras
    .map(([year, name], i) => {
      const x = 25 + i * 38;
      const nameY = i % 2 === 0 ? 100 : 114;
      const cls = i >= 4 ? "d-mark d-hl" : "d-mark";
      return `
      <rect x="${x - 4}" y="76" width="8" height="8" class="${cls}"/>
      <text x="${x}" y="66" class="d-sub" text-anchor="middle">${year}</text>
      <line x1="${x}" y1="84" x2="${x}" y2="${nameY - 8}" class="d-tick"/>
      <text x="${x}" y="${nameY}" class="d-sub" text-anchor="middle">${name}</text>`;
    })
    .join("")}
  <rect width="6" height="6" y="-3" x="-3" class="d-dot">
    <animateMotion dur="6s" repeatCount="indefinite" path="M10,80 L310,80"/>
  </rect>
  <text x="160" y="30" class="d-txt" text-anchor="middle">60 YEARS OF AGENTS</text>
  <text x="235" y="140" class="d-sub d-acc" text-anchor="middle">THE LLM ERA</text>`,
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
  "agent-core": agentCore,
  timeline,
  "chat-vs-agent": chatVsAgent,
};
