# Lessons

- "Interactive, retro-game inspired" did not mean a playable game. User wanted a learning site
  that looks like a game. Rule: when a request says "inspired by", confirm whether the thing
  should *be* that or just *look like* it before planning mechanics.
- Pixel fonts (Press Start 2P, VT323) for body text were hard to read, and the PICO-8 palette
  clashed. Rule: retro feel comes from layout, sprites, outlines and the map, never from body
  text. Body text uses a highly legible font (Nunito), dark on light, 18px+. Novelty fonts only
  for short titles. Pick a coherent reference palette (Super Mario World) instead of mixing
  saturated colours.
- The rounded cartoon redesign was called "sloppy". When the user names a specific retro game's
  style, go authentic: real pixel art on a canvas, integer scaling, hard square edges, no
  rounded corners, no gradients, small fixed palette, simple layout. Legibility comes from size
  and contrast (20px pixel font, white on black), plus a plain-font toggle as a fallback.
- A quiz after every short lesson felt like homework. Tests belong at the end of a world, framed
  as a game boss (HP, hearts, retry). Lessons themselves just clear when read.
- Map at 2x zoom with rectangle islands was "far too large and basic". Show the whole overworld
  at once (fit to screen, integer device-pixel scaling), organic island shapes with cliffs and
  shoreline, continuous roads, dense small scenery. Clean > big.
- "Fit the whole map" overshot: user wants it big (camera can pan) and each world visually
  distinct with animated landmarks (smoke, flags, windmills, ghosts), and the player sprite must
  pop (outline halo, marker). Generic scatter on flat colour reads as "basic".
- Animations ran way too fast: frame counters advanced once per screen refresh (144 Hz runs
  2.4x faster than 60 Hz) and base rates were too quick. Rule: drive all animation from real
  time (performance.now), never from rAF call counts; keep ambient motion slow (seconds per cycle).
- Shipped a blank page: the real-time clock read the rAF timestamp, which can be slightly earlier
  than the start time, giving tick -1 and a negative frame index. Unit tests + build passed, but I
  never loaded the page. Rule: after any change to rendering or timing, load the built file in a
  real browser (scripted Edge) and check for page errors before saying it works.
- "Interactive" means something to *do*, not just read: user wanted a walkable overworld map.
- User wants high-level, short content first. Rule: lesson boxes are 2-4 sentences (cap 70 words,
  enforced by test). Detail goes in the optional "Go deeper" section, never in the main path.
