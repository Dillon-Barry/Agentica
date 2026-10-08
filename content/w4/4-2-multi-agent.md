---
id: 4-2
title: Multi-agent teams
diagram: team
terms:
  - term: Orchestrator
    def: An agent that splits a goal into parts, hands them to other agents and combines their results.
  - term: Specialist agent
    def: An agent with a narrow job, a focused prompt and only the tools that job needs.
  - term: Handoff
    def: One agent passing the conversation or task to another agent to continue.
sources:
  - label: Anthropic — How we built our multi-agent research system
    url: https://www.anthropic.com/engineering/multi-agent-research-system
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: What does an orchestrator agent do?
    options:
      - Plays background music
      - Stores files
      - Blocks bad traffic
      - Breaks a goal into parts and delegates them to other agents
    answer: 3
    why: The orchestrator plans and delegates, then pulls the specialists' results together.
  - q: What's a downside of multi-agent systems?
    options:
      - They can't use tools
      - More calls and cost, and one agent's mistake flows into the next
      - They only work offline
      - They don't need prompts
    answer: 1
    why: Each agent adds cost and another place for errors, and outputs become the next agent's inputs.
  - q: Why should each agent have its own permissions?
    options:
      - So a problem in one agent doesn't hand the others' power to an attacker
      - To make them faster
      - Because MCP requires it
      - So they can share passwords
    answer: 0
    why: Separate permissions contain the damage when one agent is fooled.
---
One agent doing everything gets overloaded: too many tools, too much context. So teams split the work across **specialist agents**.
===
An **orchestrator** breaks the goal into parts and **delegates**. A researcher gathers facts, a coder writes code, a reviewer checks it. Then the orchestrator combines the results.
===
The upside: each agent gets a focused prompt and fewer tools, and parts of the work can run in parallel.
===
The cost: more model calls, more tokens, and more places to go wrong. One agent's mistake becomes the next agent's input.
===
Trust gets tricky too. If the researcher reads a poisoned web page, its summary can carry the attack straight to the coder, which has more power.
=== deeper
Common patterns include orchestrator and workers, pipelines where each agent's output feeds the next, and handoffs where one agent passes the conversation on. For simple tasks, one well-equipped agent often beats a crowd. Multi-agent setups shine when work is broad and parallel, like research across many sources. Whatever the pattern, give each agent its own identity and permissions.
