---
id: 6-4
title: All three together
diagram: together
terms:
  - term: Control plane
    def: The shared layer that decides what is allowed and how things run, separate from the agents doing the work.
  - term: Containment
    def: Limiting how far a problem can spread once something goes wrong.
  - term: Audit trail
    def: A tamper-resistant record of who did what, when and with which permissions.
sources:
  - label: Solo.io — The problems agentregistry solves
    url: https://www.solo.io/blog/understanding-the-agentregistry-project-and-the-problems-it-solves
  - label: agentgateway
    url: https://agentgateway.dev/
  - label: kagent
    url: https://kagent.dev/
quiz:
  - q: Which pairing is correct?
    options:
      - agentregistry runs agents on Kubernetes
      - kagent proxies all LLM traffic
      - agentgateway approves catalog entries
      - "agentregistry: what's allowed. kagent: where it runs. agentgateway: what it can do"
    answer: 3
    why: Catalog, runtime and checkpoint. Each covers a different stage of an agent's life.
  - q: How does the stack help against a rug pull?
    options:
      - Only vetted, versioned servers from the registry get deployed
      - The model spots it
      - A prompt forbids it
      - It can't
    answer: 0
    why: A changed server is a new version that has to go through the registry before it's used.
  - q: Do these controls rely on the model behaving?
    options:
      - Yes, completely
      - No. They are enforced outside the model
      - Only on weekends
      - Only for small models
    answer: 1
    why: That's the whole point. They hold even when the model is fooled.
---
Each tool covers a different stage of an agent's life. **agentregistry**: what is *allowed* to exist. **kagent**: where it *runs*. **agentgateway**: what it can *do*.
===
Replay the dungeon. **Prompt injection**: the gateway limits which tools and destinations each agent can reach, so a hijacked agent can't do much.
===
**Poisoned tools and rug pulls**: only vetted, versioned servers from the registry get deployed. **Sprawl**: the registry is the inventory, and kagent runs everything as managed workloads.
===
**Excessive agency and the trifecta**: gateway policies give each agent only the tools and outbound routes it needs, cutting a leg of the trifecta.
===
Through it all, gateway logs and traces answer who did what. None of this needs the model to behave. That's the point.
=== deeper
No stack makes agents perfectly safe. Models will still be fooled and bugs will still ship. The goal is failures that are small, visible and reversible. Prevention (registry curation, least-privilege policies), containment (gateway enforcement, isolated workloads) and recovery (versioned rollbacks, audit trails) together turn agent risk into something a platform team can actually manage.
