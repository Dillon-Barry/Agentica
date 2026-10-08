---
id: 6-3
title: agentgateway
diagram: gateway
terms:
  - term: agentgateway
    def: An open source proxy for agent traffic to LLMs, MCP servers and other agents. Created by Solo.io, now hosted by the Linux Foundation's Agentic AI Foundation.
  - term: Authorization policy
    def: A rule that decides whether a caller may perform an action, like which tools a given agent may call.
  - term: Rate limiting
    def: Capping how many requests or tokens a caller can use in a period, to control cost and abuse.
  - term: MCP federation
    def: Offering many MCP servers behind one endpoint, so agents connect once and policy applies everywhere.
sources:
  - label: agentgateway
    url: https://agentgateway.dev/
  - label: AAIF (2026) — agentgateway joins the Agentic AI Foundation
    url: https://aaif.io/blog/agentgateway-joins-aaif-as-an-open-gateway-for-agentic-ai-infrastructure
quiz:
  - q: Where does agentgateway sit?
    options:
      - Inside the model
      - Between agents and the LLMs, MCP servers and agents they call
      - On the user's keyboard
      - Inside the registry
    answer: 1
    why: It's a proxy on the path of every request, which is what lets it enforce policy.
  - q: Why is a gateway policy stronger than a prompt rule?
    options:
      - It's checked outside the model, so a fooled agent still gets denied
      - It makes prompts longer
      - It retrains the model
      - It uses less electricity
    answer: 0
    why: The gateway doesn't care how convincing the injected text was. No permission, no call.
  - q: What does MCP federation mean here?
    options:
      - Deleting old servers
      - Translating between languages
      - Many MCP servers offered behind one endpoint
      - Running servers on phones
    answer: 2
    why: One endpoint means one place to authenticate, authorize and log every tool call.
---
Third tool: **agentgateway**, an open source proxy built for agent traffic. Solo.io created it, and it's now hosted by the Linux Foundation's Agentic AI Foundation, alongside MCP.
===
It sits between agents and everything they call: **LLMs**, **MCP servers** and other agents over **A2A**. One checkpoint for all of it.
===
Every request is checked for **identity**, using JWTs, OAuth or API keys, and for **authorization** with fine-grained rules, down to which tools a given agent may call.
===
It applies **rate limits** and tracks LLM cost, and it logs, measures and traces every call with OpenTelemetry. "What did the agent do?" finally has an answer.
===
It can also **federate** many MCP servers behind one endpoint and turn existing REST APIs into MCP tools. It's written in Rust for speed and safety.
=== deeper
Because the gateway enforces policy outside the model, a hijacked agent hits the same wall as any unauthorized caller: no permission, no call. Policies are written in CEL, a small expression language, so rules like "only the billing agent may call refund_order" are explicit and reviewable. It runs standalone or on Kubernetes.
