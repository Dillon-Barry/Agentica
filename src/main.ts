import "./style.css";
import { renderMap } from "./views/map";
import { renderLevel } from "./views/level";
import { renderAgentdex } from "./views/agentdex";
import { renderBoss } from "./views/boss";
import { applyFontPref } from "./views/font-toggle";

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

  if (level) cleanup = renderLevel(app, level[1]);
  else if (boss) cleanup = renderBoss(app, Number(boss[1]));
  else if (hash === "agentdex") cleanup = renderAgentdex(app);
  else cleanup = renderMap(app);

  app.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
}

window.addEventListener("hashchange", route);
route();
