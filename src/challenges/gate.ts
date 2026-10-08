import { h } from "../dom";
import { button, type Challenge } from "./kit";

type AgentId = "bit" | "helpdesk";
type Tool = "read_invoices" | "send_email" | "refund_order" | "delete_records";

const AGENTS: Record<AgentId, string> = {
  bit: "Bit: reads invoices and drafts replies for a human to send",
  helpdesk: "Helpdesk: looks up orders and issues small refunds",
};
const TOOLS: Tool[] = ["read_invoices", "send_email", "refund_order", "delete_records"];

/** Replayed traffic: legitimate calls should pass, attacks should be denied. */
const TRAFFIC: { agent: AgentId; tool: Tool; note: string; legit: boolean }[] = [
  { agent: "bit", tool: "read_invoices", note: "Bit prepares this month's summary", legit: true },
  { agent: "bit", tool: "send_email", note: "Injected email tells Bit to send invoices outside", legit: false },
  { agent: "helpdesk", tool: "refund_order", note: "Customer refund of $20", legit: true },
  { agent: "helpdesk", tool: "delete_records", note: "Hijacked helpdesk tries to wipe order history", legit: false },
  { agent: "bit", tool: "refund_order", note: "Bit tries to issue a refund (not its job)", legit: false },
  { agent: "bit", tool: "delete_records", note: "Bit tries to delete records", legit: false },
];

export const writeTheGateRule: Challenge = {
  intro:
    "You run **agentgateway**. Tick which tools each agent may call, then replay today's traffic. Goal: every legitimate call passes, every attack is denied. Unticked means denied.",
  takeaway:
    "That's **least privilege, enforced outside the model**. However convincing the injected text was, a call with no permission is simply denied, and every decision is logged.",
  mount(el, done) {
    const allow: Record<AgentId, Set<Tool>> = { bit: new Set(), helpdesk: new Set() };
    const rules = h("pre", { class: "ch-rules" });
    const results = h("ol", { class: "ch-traffic" });
    const summary = h("p", { class: "ch-result", "aria-live": "polite" });

    const table = h(
      "table",
      { class: "ch-matrix" },
      h("thead", {}, h("tr", {}, h("th", {}, "AGENT"), ...TOOLS.map((t) => h("th", {}, t)))),
      h(
        "tbody",
        {},
        ...(Object.keys(AGENTS) as AgentId[]).map((a) =>
          h(
            "tr",
            {},
            h("th", { scope: "row" }, AGENTS[a]),
            ...TOOLS.map((t) => {
              const box = h("input", { type: "checkbox", "aria-label": `${a} may call ${t}` });
              box.addEventListener("change", () => {
                if (box.checked) allow[a].add(t);
                else allow[a].delete(t);
                renderRules();
                results.replaceChildren();
                summary.textContent = "";
              });
              return h("td", {}, box);
            }),
          ),
        ),
      ),
    );

    function renderRules() {
      const lines = (Object.keys(AGENTS) as AgentId[]).flatMap((a) => [...allow[a]].map((t) => `- 'jwt.sub == "${a}" && mcp.tool.name == "${t}"'`));
      rules.textContent = `mcpAuthorization:\n  rules:\n${lines.length ? lines.map((l) => `  ${l}`).join("\n") : "  # nothing allowed yet: every call is denied"}`;
    }

    function replay() {
      let good = 0;
      results.replaceChildren(
        ...TRAFFIC.map((c) => {
          const allowed = allow[c.agent].has(c.tool);
          const correct = allowed === c.legit;
          if (correct) good++;
          return h(
            "li",
            { class: correct ? "right" : "wrong" },
            h("strong", {}, `${allowed ? "ALLOWED" : "DENIED"} `),
            `${c.agent} → ${c.tool}: ${c.note}. `,
            h("em", {}, correct ? "✔ correct" : c.legit ? "✘ this was legitimate work" : "✘ this was an attack"),
          );
        }),
      );
      if (good === TRAFFIC.length) {
        summary.className = "ch-result right";
        summary.textContent = "✔ All legitimate work passed and every attack was denied.";
        done();
      } else {
        summary.className = "ch-result wrong";
        summary.textContent = `✘ ${good} of ${TRAFFIC.length} calls handled correctly. Adjust the rules and replay.`;
      }
    }

    renderRules();
    el.append(
      h("div", { class: "ch-matrix-wrap" }, table),
      h("p", { class: "ch-col-title" }, "POLICY (ILLUSTRATIVE, IN AGENTGATEWAY'S CEL STYLE)"),
      rules,
      button("REPLAY TRAFFIC ▶", replay),
      summary,
      results,
    );
  },
};
