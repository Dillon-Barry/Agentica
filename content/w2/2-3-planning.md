---
id: 2-3
title: Planning
diagram: plan
focus:
  - [goal]
  - [steps]
  - [steps]
  - [reflect]
  - [reflect]
terms:
  - term: Task decomposition
    def: Breaking a big goal into smaller steps an agent can tackle one at a time.
  - term: Chain of thought
    def: A model writing out its reasoning step by step before answering, which tends to improve results on harder problems.
  - term: Reflection
    def: An agent checking its own work, spotting mistakes and trying again before it reports back.
sources:
  - label: Wei et al. (2022) — Chain-of-thought prompting
    url: https://arxiv.org/abs/2201.11903
  - label: Shinn et al. (2023) — Reflexion
    url: https://arxiv.org/abs/2303.11366
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: What is task decomposition?
    options:
      - Deleting tasks the agent doesn't like
      - Breaking a big goal into smaller steps
      - Running every task at once
      - Translating a task into another language
    answer: 1
    why: Small steps are easier to do, check and fix than one giant leap.
    explain:
      - "Decomposing means breaking down, not throwing away."
      - ""
      - "Decomposed steps usually run one at a time."
      - "It's about splitting work, not translating it."
  - q: Why do agents often re-plan partway through?
    options:
      - Because plans are illegal
      - To use more tokens
      - Because a tool result showed the first plan was wrong
      - Models can't remember plans
    answer: 2
    why: Real results often differ from expectations. Good agents update the plan instead of charging ahead.
    explain:
      - "Plans are perfectly fine. Reality just changes them."
      - "Re-planning saves wasted steps."
      - ""
      - "The plan sits in the context. New facts change it."
  - q: What does reflection add to an agent?
    options:
      - A step where it checks its own work and fixes mistakes
      - A mirror for the user interface
      - Faster typing
      - A second, larger model that replaces it
    answer: 0
    why: A quick self-check catches many errors before they reach you, though it can't catch everything.
    explain:
      - ""
      - "It's a self-check, not a screen feature."
      - "Speed isn't the point. Catching mistakes is."
      - "The same agent checks its own work."
---
Before Bit can do anything big, it needs a plan. "Book a team offsite" is too vague to act on directly.
===
**Task decomposition** breaks the goal into steps: pick dates, check calendars, find venues, compare prices, ask for approval, book.
===
Models plan better when they reason out loud first. This is called **chain of thought**: write the steps of the thinking, then answer. Many newer models do it automatically.
===
Plans meet reality. If no venue is free on the chosen date, a good agent **re-plans** instead of ploughing on or making something up.
===
**Reflection** closes the loop: before reporting back, the agent checks its own work. "Did I actually confirm the booking?" It catches many mistakes, but not all.
=== deeper
Longer plans mean more steps that can go wrong, which is why planning and the step limits from the last level go together. Some systems use a separate planner and executor, or let one model propose a plan and another critique it. Visible plans are also useful to humans: you can approve or edit the plan before the agent starts spending money or touching real systems.
