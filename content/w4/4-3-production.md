---
id: 4-3
title: Agents in production
diagram: production
terms:
  - term: Platform team
    def: The engineers who run shared infrastructure, like clusters, gateways and registries, that other teams build on.
  - term: Observability
    def: Being able to see what a system is doing from its logs, metrics and traces.
  - term: Least privilege
    def: Giving every user, service or agent only the access its job needs, and nothing more.
sources:
  - label: OpenTelemetry
    url: https://opentelemetry.io/
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: Which question becomes urgent once agents reach production?
    options:
      - Which font to use
      - Who the agent acts for, and what it's allowed to call
      - How to write longer prompts
      - Whether to use dark mode
    answer: 1
    why: At scale, identity and permissions matter far more than prompt wording.
  - q: Which earlier tech era faced a similar sprawl problem?
    options:
      - Floppy disks
      - Fax machines
      - Microservices
      - Arcade games
    answer: 2
    why: Microservices multiplied services and connections, and teams answered with registries, gateways and orchestration.
  - q: What three things do agents in production need?
    options:
      - A trusted catalog, a place to run them, and a checkpoint for their traffic
      - More GPUs, more prompts and more tokens
      - A logo, a slogan and a mascot
      - Nothing extra
    answer: 0
    why: Catalog, runtime and gateway. Those map to agentregistry, kagent and agentgateway in World 6.
---
A demo has one agent and two tools. A real company has hundreds of agents, thousands of MCP servers, several model providers and many teams.
===
Suddenly the hard questions aren't about prompts. **Who** is this agent acting for? **What** is it allowed to call? **Which** version is running?
===
And afterwards: **what did it do**, how much did it cost, and can we prove it to an auditor?
===
We've been here before. Microservices brought the same mess, and teams answered with registries, gateways and orchestration platforms.
===
Agents need the same three things: a trusted catalog, a place to run them, and a checkpoint for their traffic. Hold that thought until World 6.
=== deeper
In production, agents become a platform problem as much as a model problem. Platform teams care about identity (every agent and user gets a verifiable ID), **least privilege**, quotas and cost control, versioned rollouts with rollback, and **observability** through logs, metrics and traces. Standards like OpenTelemetry let agent activity show up next to everything else the company runs.
