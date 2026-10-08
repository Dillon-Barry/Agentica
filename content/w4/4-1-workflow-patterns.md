---
id: 4-1
title: Workflow patterns
diagram: patterns
focus:
  - []
  - [chain, route]
  - [parallel]
  - [evaluate]
  - [chain]
terms:
  - term: Prompt chaining
    def: Splitting a job into fixed steps, where each model call works on the output of the one before.
  - term: Routing
    def: Sorting each request to the right specialised prompt, model or agent.
  - term: Evaluator-optimizer
    def: One model produces work, another critiques it, and they loop until it's good enough.
sources:
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: Support emails need sorting into billing, bugs and sales, each handled differently. Which pattern fits?
    options:
      - Routing
      - Evaluator-optimizer
      - A fully autonomous agent
      - No AI at all
    answer: 0
    why: Routing sends each request down the path built for it.
    explain:
      - ""
      - "That's for improving quality in a loop, not sorting."
      - "Overkill when the categories are known."
      - "A model is good at sorting text like this."
  - q: When should you choose a simple workflow over a full agent?
    options:
      - Never. Agents are always better
      - When the steps are known in advance
      - Only when the model is small
      - When you want the result to be less predictable
    answer: 1
    why: If you know the steps, a workflow is cheaper, faster and easier to test than an agent deciding for itself.
    explain:
      - "Agents cost more and are harder to test."
      - ""
      - "Model size has nothing to do with it."
      - "Predictable results are a reason to use a workflow."
  - q: What does the evaluator-optimizer pattern do?
    options:
      - Measures electricity use
      - Runs everything in parallel
      - Has one model critique another's work, looping until it's good enough
      - Deletes failed attempts
    answer: 2
    why: A second pair of eyes, even a model's, catches problems the first pass missed.
    explain:
      - "It evaluates work, not electricity."
      - "That's the parallelization pattern."
      - ""
      - "It improves attempts rather than deleting them."
---
Bit joins the Guild Hall, where AI gets organised. Not every job needs a free-roaming agent. Builders reuse a handful of proven **patterns**.
===
**Prompt chaining**: fixed steps in a row. Draft, then translate, then format. **Routing**: send each request to the right specialist path.
===
**Parallelization**: split the work, run the parts at once, combine the results. **Orchestrator-workers**: a lead model decides the subtasks on the fly and hands them out.
===
**Evaluator-optimizer**: one model writes, another critiques, and they loop until the work passes.
===
The big lesson: start simple. If you know the steps, use a workflow. Reach for a full agent only when the path truly can't be planned in advance.
=== deeper
These patterns come from Anthropic's guide to building effective agents, and they combine freely. A router might send hard cases to an orchestrator, whose workers each run a short chain. Simpler systems are cheaper, faster and far easier to test and secure, because every possible path is one you designed.
