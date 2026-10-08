import { h } from "../dom";
import { LESSONS, worldContent } from "../content";
import { isCleared } from "../progress";
import { href } from "../nav";
import { reducedMotion } from "../typewriter";
import { MAIN_WORLDS, ROUTE, WORLDS, bossId } from "../worlds";
import { CARD_H, CARD_W, drawCard } from "../certificate";
import { fontToggle } from "./font-toggle";
import { searchButton } from "./search";
import { blocked, btn, confetti } from "./dialog";

const NAME_KEY = "agentica.certName";

/** The end of the quest: certificate, what you learned in every world, and a link to share. */
export function renderFinish(root: HTMLElement): () => void {
  if (!isCleared(bossId(MAIN_WORLDS))) return blocked(root, "Beat the final boss in the Solo Citadel to see your results.");

  const bonus = isCleared(bossId(MAIN_WORLDS + 1));
  const mainRoute = ROUTE.filter((l) => Number(l.id.split("-")[0]) <= MAIN_WORLDS);
  const mainStops = mainRoute.length;
  const terms = LESSONS.reduce((n, l) => n + l.terms.length, 0);
  const site = `${location.origin}${location.pathname}`;
  const shareStatus = h("p", { class: "bar-status", "aria-live": "polite" });

  const share = async () => {
    const text = "I finished Agentica: a retro quest from zero to expert in AI agents.";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Agentica", text, url: site });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${site}`);
      shareStatus.textContent = "Link copied. Paste it anywhere.";
    } catch {
      shareStatus.textContent = `Share this link: ${site}`;
    }
  };

  // ---- Certificate: your name stays in this browser -------------------------
  let saved = "";
  try {
    saved = localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    /* ignore */
  }
  const canvas = h("canvas", { class: "cert-canvas", width: String(CARD_W), height: String(CARD_H), role: "img", "aria-label": "Your Agentica certificate" });
  const ctx = canvas.getContext("2d")!;
  const nameInput = h("input", { type: "text", class: "cert-name", maxlength: "48", placeholder: "Your name", value: saved, "aria-label": "Name on the certificate" });
  const redraw = () => drawCard(ctx, { name: nameInput.value, bonus });
  nameInput.addEventListener("input", () => {
    try {
      localStorage.setItem(NAME_KEY, nameInput.value);
    } catch {
      /* ignore */
    }
    void redraw();
  });
  const download = () =>
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = h("a", { href: url, download: "agentica-certificate.png" });
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");

  const hero = h(
    "section",
    { class: "dialog cleared finish-hero" },
    h("div", { class: "nametag" }, "QUEST COMPLETE!"),
    h(
      "div",
      { class: "dialog-text" },
      h("p", {}, "Bit started as a chatbot. It learned to think, plan and remember, picked up tools and skills, joined a team, survived the Shadow Dungeon, and now runs safely in the Citadel. So do you: you went from zero to the ideas experts use every day."),
      h(
        "p",
        { class: "finish-stats" },
        `★ ${mainRoute.filter((l) => isCleared(l.id)).length}/${mainStops} STOPS · ${MAIN_WORLDS} BOSSES BEATEN · ${terms} AGENTDEX TERMS${bonus ? " · ★ STAR ROAD" : ""}`,
      ),
    ),
    h(
      "div",
      { class: "dialog-actions" },
      h("a", { class: "btn btn-ghost", href: href("agentdex") }, "AGENTDEX"),
      h("a", { class: "btn btn-ghost", href: href("") }, "◀ MAP"),
      btn("SHARE AGENTICA ▶", () => void share()),
    ),
    shareStatus,
  );
  if (!reducedMotion()) hero.append(confetti());

  const cert = h(
    "section",
    { class: "box cert" },
    h("h2", { class: "finish-heading" }, "YOUR CERTIFICATE"),
    h("p", {}, "Type your name, download the image, and add it to a LinkedIn post. Your name never leaves this browser."),
    h("label", { class: "cert-label" }, "NAME ", nameInput),
    canvas,
    h("div", { class: "dialog-actions" }, btn("DOWNLOAD PNG ▶", download)),
  );

  const starRoad = WORLDS.find((w) => w.num > MAIN_WORLDS);
  root.append(
    h(
      "header",
      { class: "level-bar" },
      h("a", { class: "btn btn-small", href: href("") }, "◀ MAP"),
      h("span", { class: "chip" }, "YOUR RESULTS"),
      searchButton(),
      fontToggle(),
    ),
    h(
      "main",
      { class: "level" },
      h("h1", { class: "level-title" }, "You did it!"),
      hero,
      cert,
      h("p", { class: "dex-intro" }, "Keep it handy: ", h("a", { href: href("cheatsheet") }, "the Agentica cheat sheet"), " has every key idea and term on one printable page."),
      h(
        "ol",
        { class: "finish-worlds" },
        ...WORLDS.filter((w) => w.num <= MAIN_WORLDS).map((w) =>
          h(
            "li",
            { class: "box finish-world" },
            h("h2", {}, `WORLD ${w.num} · ${w.name.toUpperCase()}`),
            h("ul", {}, ...worldContent(w.num).recap.map((r) => h("li", {}, r))),
          ),
        ),
        starRoad
          ? h(
              "li",
              { class: "box finish-world" },
              h("h2", {}, `★ BONUS · ${starRoad.name.toUpperCase()}`),
              bonus
                ? h("ul", {}, ...worldContent(starRoad.num).recap.map((r) => h("li", {}, r)))
                : h("p", {}, "Expert topics are waiting on the map: sandboxes, guardrails, MCP sign-in, cost, evals and browser agents."),
            )
          : null,
      ),
    ),
  );
  void redraw();
  return () => {};
}

/** The link-preview card on its own, at full size (used to make og-image.png). */
export function renderPreviewCard(root: HTMLElement): () => void {
  const canvas = h("canvas", { id: "og-card", width: String(CARD_W), height: String(CARD_H) });
  root.append(canvas);
  void drawCard(canvas.getContext("2d")!, {}).then(() => canvas.setAttribute("data-ready", "true"));
  return () => {};
}
