import { h } from "../dom";
import { button, feedback, shuffle, type Challenge } from "./kit";

interface Option {
  text: string;
  /** For the right option: the action Bit takes and what it observes. */
  act?: string;
  obs?: string;
  /** For wrong options: why it's a bad move. */
  why?: string;
}

const STEPS: { prompt: string; options: Option[] }[] = [
  {
    prompt: "Goal: \"Is our shop website down? Find out why.\" What should Bit do first?",
    options: [
      { text: "Fetch the homepage and look", act: "fetch(\"https://shop.example\")", obs: "Error 500 (server error)" },
      { text: "Tell the user everything is fine", why: "That's answering without looking. A hallucination waiting to happen." },
      { text: "Restart all the servers", why: "A risky action with no evidence. Look before you leap." },
    ],
  },
  {
    prompt: "The homepage returns error 500. Next?",
    options: [
      { text: "Read the web server's error logs", act: "read_logs(\"web\")", obs: "Database connection timed out" },
      { text: "Fetch the homepage again", why: "Same action, same result. This is how agents get stuck in loops." },
      { text: "Report \"down, cause unknown\" and stop", why: "Stopping too early. Bit can still find the cause." },
    ],
  },
  {
    prompt: "The logs say the database timed out. Next?",
    options: [
      { text: "Check the database's status", act: "db_status()", obs: "Disk 100% full" },
      { text: "Read the same logs again", why: "Looping again. Every repeat burns a step and tokens." },
      { text: "Delete the logs to tidy up", why: "Destructive and pointless. A good agent never does this unasked." },
    ],
  },
  {
    prompt: "The database disk is full. What now?",
    options: [
      { text: "Report the cause and ask before fixing anything", act: "report_to_user()", obs: "User: \"Thanks! Approved: clear old backups.\"" },
      { text: "Wipe the database to free space", why: "A huge, irreversible action with no approval. This is why human checkpoints exist." },
      { text: "Keep investigating forever", why: "No stop condition. The goal is met, so the loop should end." },
    ],
  },
];

const BUDGET = 8;

export const beTheLoop: Challenge = {
  intro:
    "You are Bit's brain. Each turn, **think** about the best next move. Bit will **act** and you'll **observe** the result. You have a **step limit of 8**, so wasted moves count.",
  takeaway:
    "That trace is the agent loop: think, act, observe, repeat. The **step limit** stopped wasted loops, and the **human checkpoint** kept the big fix safe. Real agents need both.",
  mount(el, done) {
    let step = 0;
    let used = 0;
    const meter = h("p", { class: "ch-count" });
    const prompt = h("p", { class: "ch-prompt" });
    const choices = h("div", { class: "ch-choices" });
    const fb = feedback();
    const log = h("ol", { class: "ch-log", "aria-label": "Trace" });
    const logLine = (kind: string, text: string, cls = "") => {
      log.append(h("li", { class: cls }, h("span", { class: "ch-log-kind" }, kind), text));
      log.scrollTop = log.scrollHeight;
    };

    const render = () => {
      meter.textContent = `STEP ${used} OF ${BUDGET} USED`;
      const s = STEPS[step];
      prompt.textContent = s.prompt;
      choices.replaceChildren(...shuffle(s.options).map((o) => button(o.text, () => choose(o), "option")));
    };

    function choose(o: Option) {
      used++;
      logLine("THINK", o.text);
      if (o.act) {
        logLine("ACT", o.act, "ok");
        logLine("OBSERVE", o.obs!, "ok");
        fb.show(true, "Good move.");
        step++;
        if (step === STEPS.length) {
          meter.textContent = `SOLVED IN ${used} STEPS`;
          prompt.textContent = "Bit found the cause and asked before acting.";
          choices.replaceChildren();
          done();
          return;
        }
      } else {
        logLine("✘", o.why!, "bad");
        fb.show(false, o.why!);
      }
      if (used >= BUDGET) {
        meter.textContent = "STEP LIMIT HIT";
        prompt.textContent = "The guard rail stopped Bit before it wasted more time and money. That's what step limits are for. Try again.";
        choices.replaceChildren(button("TRY AGAIN ▶", reset));
        return;
      }
      render();
    }

    function reset() {
      step = 0;
      used = 0;
      log.replaceChildren();
      fb.clear();
      render();
    }

    el.append(meter, prompt, choices, fb.el, h("p", { class: "ch-col-title" }, "TRACE"), log);
    render();
  },
};
