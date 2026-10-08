# Agentica

A retro-game-styled course on AI agents. Start with zero knowledge, finish understanding
how agents work, why they're hard to secure, and how Solo.io's **kagent**, **agentregistry**
and **agentgateway** help.

**Play it:** https://dillon-barry.github.io/Agentica/

Walk Bit, a little robot, across a pixel-art overworld. Bit's story is the course: it starts
as a chatbot, becomes an agent, gets attacked, and gets secured. Each world has:

- **Lessons**: short dialog pages with a diagram that lights up the part each page talks
  about, clickable key terms, and an optional "Go deeper" page (some with a read-only
  "What it looks like" code example).
- **A hands-on challenge** before the boss: sort systems, be the agent loop, spot poisoned
  tools, assign a team, break the lethal trifecta, write a gateway policy, lock a sandbox.
- **A boss fight**: a recap card, then a quiz battle with hearts and an HP bar. About half
  the questions are scenarios ("what would you do?"), the rest check the basics. A wrong
  answer explains why that option is wrong, then why the right one is right.

Questions you miss land in the Agentdex **review pile** to practise later. Finish the main
quest to unlock the bonus **Star Road** and a certificate PNG with your name, ready for
LinkedIn. Your name never leaves your browser.

### Use it as a reference

- **Search**: press `/` (or SEARCH) to find any lesson, Agentdex term, challenge or boss.
- **Study mode**: STUDY opens every stop, for looking things up. Lessons you finish still count.
- **Skip ahead**: already know a world? Fight its boss from the PLAY card. Win, and the whole
  world counts as cleared.
- **Cheat sheets**: one printable page with every world's key ideas and terms
  (`#/cheatsheet`), or one world with its diagrams (`#/cheatsheet/3`).
- **Links**: COPY LINK on lessons, and LINK on Agentdex terms (`#/agentdex/prompt-injection`).
  A shared term shows its definition even to someone who hasn't collected it yet.
- **Bigger diagrams**: ENLARGE opens a diagram full screen, and REPLAY steps through the parts
  each page highlights.
- Each world shows a rough time to finish (~10-14 minutes).

## Worlds

| World | Topic |
| --- | --- |
| 1. Origins Village | What agents are and where they came from |
| 2. The Forge | The model, the loop, planning, memory, unpredictability |
| 3. Cartridge Caves | Tools, MCP, skills, and why the model trusts the label |
| 4. Guild Hall | Workflow patterns, multi-agent teams, A2A, evals, production |
| 5. Shadow Dungeon | Prompt injection, poisoned tools, excessive agency, the lethal trifecta, sprawl, identity |
| 6. Solo Citadel | kagent, agentregistry, agentgateway, and a final incident |
| ★ Star Road (bonus) | Sandboxing, guardrails, MCP sign-in (OAuth), cost and token budgets, eval design, computer-use agents |

## Run locally

```bash
npm install
npm run dev
```

`npm test` checks every lesson, world file and the map (word limits, quiz shape, explanations,
diagram focus parts, roads, islands, boss question pools). `npm run build` outputs the whole
site as one self-contained file, `dist/index.html`, fonts included. Double-click it to open
it, no server needed.

`npm run e2e` runs the Playwright suite against `dist/index.html` (build first): the map,
auto-walk, lessons, every challenge, a boss fight, the review pile, the certificate, study
mode, skip ahead, search, links, cheat sheets, diagram zoom, phone layouts, and
[axe](https://github.com/dequelabs/axe-core) accessibility scans of each screen. Locally it
runs two browsers at a time. Locally
it uses the installed Microsoft Edge; CI uses Playwright's Chromium.
`npm run og-image` redraws the link-preview image, `public/og-image.png`.

### Accessibility

Text meets WCAG AA contrast, everything works by keyboard (arrow keys walk the map, 1-4 or
A-D answer), answers are announced in a live region, and a skip link jumps past the map
to a plain list of every level. These are checked automatically; no one has yet tested
the site with a real screen reader, so reports are welcome.

### Fonts

Atkinson Hyperlegible Next, Pixelify Sans and Press Start 2P are bundled from
`src/fonts/` under the SIL Open Font License (see `src/fonts/LICENSES.md`). The site makes
no third-party requests.

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
    explain:               # one per option: why each wrong one is wrong ("" for the right one)
      - Why the first option is wrong.
      - ""
      - Why the third option is wrong.
focus:                     # optional, one per dialog box: diagram parts to light up
  - []                     # [] shows the whole diagram
  - [system]               # part names: box labels in kebab case, or part("name") in src/diagrams/
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

Pushing to `main` runs `.github/workflows/deploy.yml`, which tests (unit and e2e), builds and
publishes to GitHub Pages.
