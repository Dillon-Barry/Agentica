import type { PlannedLevel, World } from "./types";

/** Overworld size in map pixels. Positions below are map pixels too. */
export const MAP_W = 1240;
export const MAP_H = 740;

/**
 * The full curriculum and where each stop sits on the map. The route snakes
 * across three rows: worlds 1-2 left to right, 3-4 right to left, 5-6 left
 * to right. Each world is a comb of stops on two lines 70px apart, then a
 * challenge, then a boss fortress (always on the upper line, so roads reach
 * it from the side or from below). Islands grow around the route; `extraLand`
 * adds a meadow for the world's landmark. World 7, Star Road, is a bonus
 * island reached from the final castle, climbing a staircase up the right.
 */
export const WORLDS: World[] = [
  {
    num: 1,
    name: "Origins Village",
    blurb: "What agents are and where they came from.",
    theme: "grass",
    levels: [
      { id: "1-1", title: "What is an AI agent?", x: 80, y: 110 },
      { id: "1-2", title: "Sixty years of agents", x: 130, y: 180 },
      { id: "1-3", title: "Chatbot vs agent", x: 180, y: 110 },
    ],
    challenge: { title: "Sort it", x: 230, y: 180 },
    boss: { name: "Rule Golem", x: 280, y: 110, body: "#b8b8b8", shade: "#707070" },
    extraLand: [{ x: 150, y: 62, r: 30 }],
  },
  {
    num: 2,
    name: "The Forge",
    blurb: "What an agent is made of and how it thinks.",
    theme: "forge",
    levels: [
      { id: "2-1", title: "The brain", x: 410, y: 110 },
      { id: "2-2", title: "The loop", x: 470, y: 180 },
      { id: "2-3", title: "Planning", x: 530, y: 110 },
      { id: "2-4", title: "Memory", x: 590, y: 180 },
      { id: "2-5", title: "Why agents are unpredictable", x: 650, y: 110 },
    ],
    challenge: { title: "Be the loop", x: 710, y: 180 },
    boss: { name: "Loop Wyrm", x: 770, y: 110, body: "#f88800", shade: "#a85810" },
    extraLand: [{ x: 590, y: 62, r: 30 }],
  },
  {
    num: 3,
    name: "Cartridge Caves",
    blurb: "Tools, MCP and skills.",
    theme: "cave",
    levels: [
      { id: "3-1", title: "Tools", x: 770, y: 410 },
      { id: "3-2", title: "MCP", x: 720, y: 340 },
      { id: "3-3", title: "Skills", x: 670, y: 410 },
      { id: "3-4", title: "The LLM trusts the label", x: 620, y: 340 },
    ],
    challenge: { title: "Read the label", x: 570, y: 410 },
    boss: { name: "Cartridge Mimic", x: 520, y: 340, body: "#b878f8", shade: "#6838a8" },
    extraLand: [{ x: 645, y: 462, r: 28 }],
  },
  {
    num: 4,
    name: "Guild Hall",
    blurb: "Patterns, teams and running agents for real.",
    theme: "forest",
    levels: [
      { id: "4-1", title: "Workflow patterns", x: 390, y: 340 },
      { id: "4-2", title: "Multi-agent teams", x: 340, y: 410 },
      { id: "4-3", title: "A2A", x: 290, y: 340 },
      { id: "4-4", title: "Evals and observability", x: 240, y: 410 },
      { id: "4-5", title: "Agents in production", x: 190, y: 340 },
    ],
    challenge: { title: "Assign the party", x: 140, y: 410 },
    boss: { name: "Rogue Delegate", x: 90, y: 340, body: "#58c838", shade: "#207818" },
    extraLand: [{ x: 265, y: 462, r: 28 }],
  },
  {
    num: 5,
    name: "Shadow Dungeon",
    blurb: "Why agents are hard to secure.",
    theme: "shadow",
    levels: [
      { id: "5-1", title: "Prompt injection", x: 90, y: 570 },
      { id: "5-2", title: "Poisoned tools and rug pulls", x: 140, y: 640 },
      { id: "5-3", title: "Excessive agency", x: 190, y: 570 },
      { id: "5-4", title: "The lethal trifecta", x: 240, y: 640 },
      { id: "5-5", title: "Sprawl", x: 290, y: 570 },
      { id: "5-6", title: "Agent identity", x: 340, y: 640 },
      { id: "5-7", title: "Prompts can't fix this", x: 390, y: 570 },
    ],
    challenge: { title: "Break the trifecta", x: 440, y: 640 },
    boss: { name: "Prompt Phantom", x: 490, y: 570, body: "#8868b8", shade: "#402868" },
    extraLand: [{ x: 290, y: 692, r: 28 }],
  },
  {
    num: 6,
    name: "Solo Citadel",
    blurb: "How kagent, agentregistry and agentgateway help.",
    theme: "castle",
    levels: [
      { id: "6-1", title: "kagent", x: 620, y: 570 },
      { id: "6-2", title: "agentregistry", x: 670, y: 640 },
      { id: "6-3", title: "agentgateway", x: 720, y: 570 },
      { id: "6-4", title: "All three together", x: 770, y: 640 },
      { id: "6-5", title: "Final: Bit goes rogue", x: 820, y: 570 },
    ],
    challenge: { title: "Write the gate rule", x: 870, y: 640 },
    boss: { name: "Rogue Agent", x: 920, y: 570, body: "#e83800", shade: "#a82000" },
    extraLand: [{ x: 770, y: 692, r: 28 }],
  },
  {
    num: 7,
    name: "Star Road",
    blurb: "Bonus: expert topics, open after the quest.",
    theme: "star",
    levels: [
      { id: "7-1", title: "Sandboxing agents that run code", x: 1060, y: 640 },
      { id: "7-2", title: "Guardrail models", x: 1130, y: 570 },
      { id: "7-3", title: "MCP sign-in, step by step", x: 1060, y: 500 },
      { id: "7-4", title: "Cost and token budgets", x: 1130, y: 430 },
      { id: "7-5", title: "Designing good evals", x: 1060, y: 360 },
      { id: "7-6", title: "Computer-use and browser agents", x: 1130, y: 290 },
    ],
    challenge: { title: "Lock the sandbox", x: 1060, y: 220 },
    boss: { name: "Star Guardian", x: 1130, y: 150, body: "#f8d800", shade: "#c08800" },
    extraLand: [{ x: 1190, y: 400, r: 30 }],
  },
];

/** The main quest ends with world 6; world 7 is the bonus Star Road. */
export const MAIN_WORLDS = 6;

export const bossId = (world: number) => `${world}-B`;
export const challengeId = (world: number) => `${world}-C`;

/** Every stop in route order: a world's lessons, its challenge, then its boss. */
export const ROUTE: PlannedLevel[] = WORLDS.flatMap((w) => [
  ...w.levels,
  { id: challengeId(w.num), title: `Challenge: ${w.challenge.title}`, x: w.challenge.x, y: w.challenge.y, challenge: true },
  { id: bossId(w.num), title: `Boss: ${w.boss.name}`, x: w.boss.x, y: w.boss.y, boss: true },
]);

export function worldOf(id: string): World {
  return WORLDS.find((w) => id.startsWith(`${w.num}-`))!;
}
