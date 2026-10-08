import "./fonts/fonts.css";
import "./style.css";
import { renderMap } from "./views/map";
import { renderLevel } from "./views/level";
import { renderAgentdex } from "./views/agentdex";
import { renderBoss } from "./views/boss";
import { renderChallenge } from "./views/challenge";
import { renderFinish, renderPreviewCard } from "./views/finish";
import { applyFontPref } from "./views/font-toggle";
import { openSearch } from "./views/search";
import { renderCheatsheet } from "./views/cheatsheet";
import { wipe } from "./views/wipe";

applyFontPref();

const app = document.getElementById("app")!;

// Each view returns a cleanup function (timers, key listeners).
let cleanup: () => void = () => {};

function route(): void {
  cleanup();
  app.replaceChildren();
  window.scrollTo(0, 0);

  const hash = location.hash.replace(/^#\/?/, "");
  const level = /^level\/([\w-]+)$/.exec(hash);
  const boss = /^boss\/(\d+)$/.exec(hash);
  const challenge = /^challenge\/(\d+)$/.exec(hash);
  const term = /^agentdex\/([\w-]+)$/.exec(hash);
  const sheet = /^cheatsheet(?:\/(\d+))?$/.exec(hash);

  if (level) cleanup = renderLevel(app, level[1]);
  else if (boss) cleanup = renderBoss(app, Number(boss[1]));
  else if (challenge) cleanup = renderChallenge(app, Number(challenge[1]));
  else if (hash === "agentdex") cleanup = renderAgentdex(app);
  else if (term) cleanup = renderAgentdex(app, term[1]);
  else if (sheet) cleanup = renderCheatsheet(app, sheet[1] ? Number(sheet[1]) : undefined);
  else if (hash === "finish") cleanup = renderFinish(app);
  else if (hash === "og-card") cleanup = renderPreviewCard(app);
  else cleanup = renderMap(app);

  app.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
}

// "/" opens search from anywhere, unless you're typing in a field.
window.addEventListener("keydown", (e) => {
  if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return;
  if ((e.target as HTMLElement).closest("input, textarea, [contenteditable]")) return;
  e.preventDefault();
  openSearch();
});

// Going between the map and a stop irises shut and open, like Super Mario World.
const isMapRoute = (hash: string) => !/^#\/?(level|boss|challenge|agentdex|finish|og-card|cheatsheet)\b/.test(hash);
let shown = location.hash;
window.addEventListener("hashchange", () => {
  const crossing = isMapRoute(shown) !== isMapRoute(location.hash);
  shown = location.hash;
  if (crossing) void wipe(route);
  else route();
});
route();
