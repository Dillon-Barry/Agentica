# Agentica

A retro-game-styled course on AI agents. Start with zero knowledge, finish understanding
how agents work, why they're hard to secure, and how Solo.io's **kagent**, **agentregistry**
and **agentgateway** help.

It looks like a retro overworld game. Walk a little robot across six islands, read short
lessons at each stop, then beat the boss fortress at the end of every world: a quiz fight with
hearts and an HP bar, using questions from that world's lessons.

## Worlds

| World | Topic |
| --- | --- |
| 1. Origins Village | What agents are and where they came from |
| 2. The Forge | What an agent is made of and how it thinks |
| 3. Cartridge Caves | Tools, and MCP |
| 4. Guild Hall | Agents working in teams, A2A |
| 5. Shadow Dungeon | Why agents are hard to secure |
| 6. Solo Citadel | kagent, agentregistry, agentgateway |

## Run locally

```bash
npm install
npm run dev
```

`npm test` validates every lesson (word limits, quiz shape, diagrams). `npm run build`
outputs the whole site as one self-contained file, `dist/index.html`. Double-click it to
open it in a browser, no server needed.

## Writing a lesson

Add a Markdown file under `content/w<world>/`. The id must match a level planned in
`src/worlds.ts`.

```md
---
id: 2-1
title: The brain
diagram: agent-core        # key in src/diagrams/index.ts
terms:
  - term: System prompt
    def: Standing instructions the model reads before every task.
sources:
  - label: Some source
    url: https://example.com
quiz:                     # these questions feed the world's boss fight
  - q: Question?
    options: [Wrong, Right, Wrong]
    answer: 1              # index of the correct option
    why: Shown after answering.
---
First dialog box. Keep it to 2-4 sentences (70 words max).
===
Second dialog box.
=== deeper
Optional "Go deeper" text, 100 words max.
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to
GitHub Pages. In the repo settings, set **Pages > Source** to **GitHub Actions**.
