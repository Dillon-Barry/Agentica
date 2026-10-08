# Agentica — Spec & Plan

Retro-game-styled learning site. Teaches AI agents from zero to expert, ending with how
Solo.io tools (kagent, agentregistry, agentgateway) help. Not a playable game — a guided
course that *looks* like one. Concepts only, no hands-on labs.

## Spec

### Experience
- Overworld map screen (level select). 6 worlds, nodes per level.
- Levels unlock linearly. Pass level's test to clear it and unlock next. Progress in localStorage.
- Level = sequence of dialog boxes (typewriter text, click / Space / Enter to advance).
  - One idea per box, 2-4 sentences, hard cap 70 words per box (enforced by test).
  - 3-8 boxes per level (~3 min).
- One animated pixel-style SVG diagram per level, shown above the dialog box.
- Optional "Go deeper" chest at end of level: one extra paragraph + sources.
- End-of-level test: 3 multiple-choice questions, pass = 2/3 correct. Each answer shows "why".
  Fail = retry. Pass = level cleared.
- Agentdex page: glossary of terms from cleared levels.
- One fixed visual style: 16-bit palette (PICO-8 based), pixel fonts, dark navy background.
- Mobile friendly, keyboard friendly, respects prefers-reduced-motion.

### Tech
- Vite + vanilla TypeScript, no framework, no game engine.
- Lessons = Markdown files with YAML frontmatter in `content/`. Boxes separated by `===`,
  optional `=== deeper` section. Adding a lesson needs no code.
- Diagrams = SVG strings in `src/diagrams/`, keyed by lesson frontmatter `diagram`.
- Hash routing (`#/`, `#/level/1-1`, `#/agentdex`) so GitHub Pages works without server config.
- Vitest: parser tests + content validation (ids, quiz shape, word caps, diagram exists).
- GitHub Actions: test, build, deploy to GitHub Pages.

### Curriculum
World 1 — Origins Village
- [x] 1-1 What is an AI agent?
- [x] 1-2 Timeline: ELIZA to MCP
- [x] 1-3 Chatbot vs agent

World 2 — The Forge
- [x] 2-1 The brain: LLM + system prompt
- [x] 2-2 The loop: think, act, observe
- [x] 2-3 Memory
- [x] 2-4 Why agents are unpredictable

World 3 — Cartridge Caves
- [x] 3-1 Tools / function calling
- [x] 3-2 MCP
- [x] 3-3 Tool descriptions: the LLM trusts the label

World 4 — Guild Hall
- [x] 4-1 Multi-agent: delegation, handoffs
- [x] 4-2 A2A
- [x] 4-3 Agents in production

World 5 — Shadow Dungeon
- [x] 5-1 Prompt injection
- [x] 5-2 Tool poisoning + MCP rug pulls
- [x] 5-3 Excessive agency + confused deputy
- [x] 5-4 The lethal trifecta
- [x] 5-5 Sprawl: unknown agents, tools, credentials
- [x] 5-6 Prompts can't fix this

World 6 — Solo Citadel
- [x] 6-1 kagent
- [x] 6-2 agentregistry
- [x] 6-3 agentgateway
- [x] 6-4 All three together
- [x] 6-5 Final: rogue agent incident

## Milestones
- [x] M1 Shell: map, dialog box, quiz, progress, Agentdex, Pages workflow, tests
- [x] M2 World 1 content + diagrams (check feel with user)
- [x] M3 Worlds 2-4
- [x] M4 World 5
- [x] M5 World 6, polish, README screenshots
- [ ] Create GitHub repo + push (needs user go-ahead)

## Review
### M1 + M2 (2026-10-08)
- Shell: map, typewriter dialog, "Go deeper" chest, 3-question test (pass 2/3), Agentdex,
  localStorage progress (in-memory fallback), reset.
- World 1: 3 lessons, 3 animated SVG diagrams, 14 Agentdex terms.
- Verified: 33 Vitest tests pass (parser + content rules); tsc + vite build clean; browser
  walkthrough of 1-1 (boxes, deeper, test with one wrong answer, pass saved, 1-2 unlocked);
  map + level at 375px with no horizontal scroll; no console errors.
### Redesign (2026-10-08, after user feedback)
- Fonts: Nunito body (dark on cream, 18-20px), Luckiest Guy for titles only. Pixel fonts gone.
- Palette: Super Mario World style (sky, grass, sand path, yellow/red, thick dark outlines).
- Overworld map: 6 themed islands, dotted route with bridges, walkable robot "Bit"
  (arrow keys / tap), camera follows, drag to pan, path draws itself after a clear.
- Level: "?" block for Go deeper, star confetti on clear, diagram hidden during test.
- Verified: 40 tests pass; build clean; browser check of map, reveal, walk, level, test, clear,
  phone width with no horizontal scroll.
### 8-bit redesign (2026-10-08, "too sloppy, more like Super Mario World")
- Overworld is now a 48x30-tile pixel-art canvas at whole-number zoom: hand-drawn sprites,
  right-angle dotted paths, plank bridges, dot-by-dot path reveal, robot walk cycle.
- Message-box UI (black panels, white borders, hard shadows), Press Start 2P headings,
  Pixelify Sans body at 20px, "Aa" plain-font toggle.
- Verified: 44 tests pass (incl. map geometry + sprite shapes); build clean; browser check of
  map, reveal, walking, level, test, font toggle, phone width.
  could move parsing to build time later.

### Worlds 2-6 (2026-10-08)
- 19 lessons written (worlds 2-6), 21 new pixel diagrams. World 6 facts checked against kagent,
  agentgateway and agentregistry docs, plus the AAIF announcement (agentgateway joined June 2026).
- UX: text boxes advance only via NEXT (clicking the box does nothing); picking an answer marks it
  RIGHT/WRONG at once, lights up the correct option and shows the explanation.
- Tests: 214 pass. New guards: map and lesson titles match, no duplicate Agentdex terms.
- Verified in browser: all diagrams render, box click doesn't advance, instant answer feedback,
  full map with every world.
- Open: no commit or GitHub remote yet.

### Bosses + map redraw (2026-10-08)
- Lessons no longer have tests; finishing a lesson clears it. Each world ends in a boss fortress:
  pixel arena, boss HP (lessons + 2, max 6), 3 hearts, shuffled questions from that world's lessons,
  instant right/wrong, projectile + hit-flash animations, victory/knocked-out screens.
- Map redrawn as one fit-to-screen overworld (960x560 map px, whole device-pixel scaling):
  organic islands grown from the route, cliffs, shoreline foam, continuous roads with plank
  bridges, auto-placed scenery, fortresses (final castle at 2x), status bar under the map.
- NEXT and other buttons now act on the first click (no "finish typing" click first).
- Verified: 217 unit tests (new: no road crosses a stop or another road, islands stay separate,
  every boss has enough questions); scripted Edge run: box click doesn't advance, lesson clears
  without quiz, boss knock-out and victory both reachable and saved, locked boss blocked, no page
  errors; screenshots of fresh map, mid-game map and boss arena.
- Progress save key bumped to agentica.v2 (old progress resets once).
- Open: no commit or GitHub remote yet.

### Full-window map (2026-10-08, "map is tiny on a big screen")
- Map view is now edge to edge: slim black HUD, overworld fills the rest of the window above the
  status bar, sea runs to the screen edges. Scale = largest that fits (snapped to whole device
  pixels when within 6%); phones keep a 1.5x minimum and pan with the camera.
- Verified with headless Edge screenshots at 2560x1440, 1280x800 and 390x844.

### Distinct worlds + animation (2026-10-08)
- Map zoom = cover x1.2 (camera follows, drag to look); phones 2x minimum.
- Per-world ground textures: grass tufts, sand ripples, rock cobbles (Voronoi), forest canopy,
  swamp puddles, stone paving.
- New procedural pixel props with auto outlines (src/map/props.ts). Landmarks placed in the
  roomiest spot per island: windmill (turning), volcano (lava glow + smoke), crystal cave
  mountain, guild hall (waving banner), ghost house (flickering windows), watchtower (flag).
- Animated scenery: chimney smoke, swaying trees/pines/flowers, twinkling crystals, bobbing
  ghosts, bubbling swamps, waving fortress/castle flags, castle torches, drifting clouds,
  sea sparkles.
- Player: bigger 16x18 robot, white halo outline, bouncing "you are here" arrow, walk hop.
- Bug fixed: odd-width sprites never passed the on-land check (fractional lookups); the land
  lookup now floors its inputs. Scenery went from 108 to 257 props.
- Verified: 217 tests; headless Edge screenshots of all six worlds at 1920x1080.

### Animation speed fix (2026-10-08)
- Map and boss arena clocks now use real time (60 ticks/s) instead of counting frames, so
  speed is identical on 60/120/144 Hz screens; camera easing is time-based too.
- Ambient rates roughly halved: windmill ~2s per half turn, flags, smoke, blinking stops,
  swaying trees, ghosts, crystals, ripples and clouds all slower.
- Regression fixed same day: first frame computed tick -1 (rAF timestamp earlier than start
  time), crashing the map draw. Clock now uses performance.now() and clamps at 0; frame index
  is always wrapped positive. Verified by loading the built file in Edge: map, lesson, walk and
  boss fight all run with zero page errors.
