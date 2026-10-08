# Agentica

A retro-game-styled course on AI agents. Start with zero knowledge, finish understanding
how agents work, why they're hard to secure, and how Solo.io's **kagent**, **agentregistry**
and **agentgateway** help.

**Play it:** https://dillon-barry.github.io/Agentica/

Walk Bit, a little robot, across a pixel-art overworld. Bit's story is the course: it starts
as a chatbot, becomes an agent, gets attacked, and gets secured. Each world has:

- **Lessons**: short dialog pages with a diagram, clickable key terms, and an optional
  "Go deeper" page (some with a read-only "What it looks like" code example).
- **A hands-on challenge** before the boss: sort systems, be the agent loop, spot poisoned
  tools, assign a team, break the lethal trifecta, write a gateway policy.
- **A boss fight**: a recap card, then a quiz battle with hearts and an HP bar. About half
  the questions are scenarios ("what would you do?"), the rest check the basics.

## Worlds

| World | Topic |
| --- | --- |
| 1. Origins Village | What agents are and where they came from |
| 2. The Forge | The model, the loop, planning, memory, unpredictability |
| 3. Cartridge Caves | Tools, MCP, skills, and why the model trusts the label |
| 4. Guild Hall | Workflow patterns, multi-agent teams, A2A, evals, production |
| 5. Shadow Dungeon | Prompt injection, poisoned tools, excessive agency, the lethal trifecta, sprawl, identity |
| 6. Solo Citadel | kagent, agentregistry, agentgateway, and a final incident |

## Run locally

```bash
npm install
npm run dev
```

`npm test` checks every lesson, world file and the map (word limits, quiz shape, diagrams,
roads, islands, boss question pools). `npm run build` outputs the whole site as one
self-contained file, `dist/index.html`. Double-click it to open it, no server needed.

## Writing a lesson

Add a Markdown file under `content/w<world>/`. The id must match a stop planned in
`src/worlds.ts`. Content is parsed at build time, so nothing extra ships to the browser.

````md
---
id: 2-1
title: The brain
diagram: brain             # key in src/diagrams/
terms:                     # bold these in the text; they become clickable
  - term: System prompt
    def: Standing instructions the model reads before every task.
sources:
  - label: Some source
    url: https://example.com
quiz:                      # these questions feed the world's boss fight
  - q: Question?
    options: [Wrong, Right, Wrong]
    answer: 1              # index of the correct option
    why: Shown after answering.
---
First dialog box. Keep it to 2-4 sentences (70 words max).
===
Second dialog box, with a **System prompt** term.
=== deeper
Optional "Go deeper" text, 100 words max.
=== peek
Optional read-only example:
```yaml
key: value
```
````

Each world also has `content/worlds/w<world>.yaml` with the boss's `recap` bullets and
`scenarios` (the judgement questions). Challenges live in `src/challenges/`.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests, builds and publishes to
GitHub Pages.
