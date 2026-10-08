import type { PlannedLevel, World } from "./types";

/** Overworld size in map pixels. Positions below are map pixels too. */
export const MAP_W = 960;
export const MAP_H = 560;

/**
 * The full curriculum and where each stop sits on the map. The route snakes
 * left to right across the top row of worlds, then right to left along the
 * bottom. Each world ends in a boss fortress. Islands grow around the route
 * automatically (see map/terrain.ts).
 */
export const WORLDS: World[] = [
  {
    num: 1,
    name: "Origins Village",
    blurb: "What agents are and where they came from.",
    theme: "grass",
    levels: [
      { id: "1-1", title: "What is an AI agent?", x: 70, y: 190 },
      { id: "1-2", title: "Sixty years of agents", x: 120, y: 110 },
      { id: "1-3", title: "Chatbot vs agent", x: 190, y: 170 },
    ],
    boss: { name: "Rule Golem", x: 250, y: 100, body: "#b8b8b8", shade: "#707070" },
  },
  {
    num: 2,
    name: "The Forge",
    blurb: "What an agent is made of and how it thinks.",
    theme: "forge",
    levels: [
      { id: "2-1", title: "The brain", x: 360, y: 160 },
      { id: "2-2", title: "The loop", x: 420, y: 90 },
      { id: "2-3", title: "Memory", x: 480, y: 170 },
      { id: "2-4", title: "Why agents are unpredictable", x: 550, y: 100 },
    ],
    boss: { name: "Loop Wyrm", x: 610, y: 170, body: "#f88800", shade: "#a85810" },
  },
  {
    num: 3,
    name: "Cartridge Caves",
    blurb: "Tools, and MCP: the universal tool plug.",
    theme: "cave",
    levels: [
      { id: "3-1", title: "Tools", x: 720, y: 110 },
      { id: "3-2", title: "MCP", x: 780, y: 180 },
      { id: "3-3", title: "The LLM trusts the label", x: 840, y: 110 },
    ],
    boss: { name: "Cartridge Mimic", x: 900, y: 180, body: "#b878f8", shade: "#6838a8" },
  },
  {
    num: 4,
    name: "Guild Hall",
    blurb: "Agents working in teams.",
    theme: "forest",
    levels: [
      { id: "4-1", title: "Multi-agent teams", x: 900, y: 330 },
      { id: "4-2", title: "A2A", x: 850, y: 410 },
      { id: "4-3", title: "Agents in production", x: 790, y: 330 },
    ],
    boss: { name: "Rogue Delegate", x: 740, y: 410, body: "#58c838", shade: "#207818" },
  },
  {
    num: 5,
    name: "Shadow Dungeon",
    blurb: "Why agents are hard to secure.",
    theme: "shadow",
    levels: [
      { id: "5-1", title: "Prompt injection", x: 610, y: 450 },
      { id: "5-2", title: "Poisoned tools and rug pulls", x: 560, y: 370 },
      { id: "5-3", title: "Excessive agency", x: 510, y: 450 },
      { id: "5-4", title: "The lethal trifecta", x: 460, y: 370 },
      { id: "5-5", title: "Sprawl", x: 410, y: 450 },
      { id: "5-6", title: "Prompts can't fix this", x: 360, y: 370 },
    ],
    boss: { name: "Prompt Phantom", x: 310, y: 450, body: "#8868b8", shade: "#402868" },
  },
  {
    num: 6,
    name: "Solo Citadel",
    blurb: "How kagent, agentregistry and agentgateway help.",
    theme: "castle",
    levels: [
      { id: "6-1", title: "kagent", x: 210, y: 380 },
      { id: "6-2", title: "agentregistry", x: 150, y: 320 },
      { id: "6-3", title: "agentgateway", x: 90, y: 380 },
      { id: "6-4", title: "All three together", x: 60, y: 460 },
      { id: "6-5", title: "Final: rogue agent", x: 130, y: 500 },
    ],
    boss: { name: "Rogue Agent", x: 220, y: 500, body: "#e83800", shade: "#a82000" },
  },
];

export const bossId = (world: number) => `${world}-B`;

/** Every stop in route order: each world's lessons, then its boss. */
export const ROUTE: PlannedLevel[] = WORLDS.flatMap((w) => [
  ...w.levels,
  { id: bossId(w.num), title: `Boss: ${w.boss.name}`, x: w.boss.x, y: w.boss.y, boss: true },
]);

export function worldOf(id: string): World {
  return WORLDS.find((w) => id.startsWith(`${w.num}-`))!;
}
