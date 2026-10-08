import { h } from "../dom";
import { button, feedback, shuffle, type Challenge } from "./kit";

type Kind = "chatbot" | "workflow" | "agent";

const ITEMS: { text: string; kind: Kind; why: string }[] = [
  { text: "Answers \"What's a token?\" with a short explanation.", kind: "chatbot", why: "Text in, text out. It takes no actions and picks no steps." },
  { text: "Every night, code sends each new support ticket to a model to tag it, then files it.", kind: "workflow", why: "The model helps at one fixed step. Code decides the path." },
  { text: "Told \"fix the failing test\", it reads code, runs the tests and edits files until they pass.", kind: "agent", why: "It chooses its own next steps in a loop until the goal is met." },
  { text: "Summarizes an article you paste in.", kind: "chatbot", why: "One answer from one input. No tools, no loop." },
  { text: "Translate, then summarize, then email the result: the same three steps every time.", kind: "workflow", why: "A fixed chain of steps, written in advance." },
  { text: "Plans a team offsite: checks calendars, finds venues and books once you approve.", kind: "agent", why: "It plans, uses tools and adapts as it goes, with a human approving the booking." },
];

const LABEL: Record<Kind, string> = { chatbot: "CHATBOT", workflow: "WORKFLOW", agent: "AGENT" };

export const sortIt: Challenge = {
  intro:
    "Bit is learning to tell AI systems apart. For each card, decide: is it a **chatbot** (just answers), a **workflow** (code decides fixed steps), or an **agent** (the model picks its own steps)?",
  takeaway:
    "The difference isn't the model, it's **who decides the steps**. Chatbots answer, workflows follow a script, agents choose. Pick the simplest one that does the job.",
  mount(el, done) {
    let queue = shuffle(ITEMS);
    let solved = 0;
    const card = h("div", { class: "ch-card big" });
    const count = h("p", { class: "ch-count" });
    const fb = feedback();
    const columns: Record<Kind, HTMLElement> = {
      chatbot: h("ul", { class: "ch-col-list" }),
      workflow: h("ul", { class: "ch-col-list" }),
      agent: h("ul", { class: "ch-col-list" }),
    };
    const bins = h(
      "div",
      { class: "ch-bins" },
      ...(Object.keys(LABEL) as Kind[]).map((k) => button(LABEL[k], () => pick(k), "btn ch-bin")),
    );
    const sorted = h(
      "div",
      { class: "ch-columns" },
      ...(Object.keys(LABEL) as Kind[]).map((k) => h("div", { class: "ch-col" }, h("p", { class: "ch-col-title" }, LABEL[k]), columns[k])),
    );

    const render = () => {
      count.textContent = `CARD ${solved + 1} OF ${ITEMS.length}`;
      card.textContent = queue[0].text;
    };

    function pick(kind: Kind) {
      const item = queue[0];
      if (!item) return;
      if (kind === item.kind) {
        fb.show(true, item.why);
        columns[kind].append(h("li", {}, item.text));
        queue = queue.slice(1);
        solved++;
        if (!queue.length) {
          card.textContent = "All sorted!";
          bins.remove();
          count.textContent = "";
          done();
          return;
        }
      } else {
        fb.show(false, `${item.why} It goes back in the pile.`);
        queue = [...queue.slice(1), item];
      }
      render();
    }

    el.append(count, card, bins, fb.el, sorted);
    render();
  },
};
