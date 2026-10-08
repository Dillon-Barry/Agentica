---
id: 2-2
title: The loop
diagram: loop
focus:
  - [think, act, observe]
  - [think, act, observe]
  - [think]
  - []
  - []
terms:
  - term: Stop condition
    def: The rule that ends an agent's loop, such as the goal being met or a limit being hit.
  - term: Step limit
    def: A cap on how many think-act-observe rounds an agent may run, so it can't loop forever.
  - term: Human in the loop
    def: A checkpoint where a person must approve before the agent continues, usually before risky actions.
sources:
  - label: Yao et al. (2022) — ReAct
    url: https://arxiv.org/abs/2210.03629
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: What are the three steps of the agent loop?
    options:
      - Plan, code, ship
      - Read, write, delete
      - Ask, wait, guess
      - Think, act, observe
    answer: 3
    why: The agent thinks about the next step, acts with a tool, observes the result, then repeats.
    explain:
      - "That's a software release, not the agent loop."
      - "Those are file actions, not the loop."
      - "Agents act and look at results; they don't just guess."
      - ""
  - q: Who decides when the loop is finished?
    options:
      - The model, so builders add limits in case it gets that wrong
      - The tool server
      - The internet
      - It always runs exactly ten times
    answer: 0
    why: The model chooses when it's done. Step limits and budgets catch the times it stops too early or never stops.
    explain:
      - ""
      - "The tool server just answers calls."
      - "The internet has no say in when the agent stops."
      - "Loops stop when the goal is met or a limit is hit."
  - q: Why add a human approval checkpoint?
    options:
      - To make the model smarter
      - To pause risky actions until a person agrees
      - To save tokens
      - Because loops can't call tools
    answer: 1
    why: A human checkpoint means the riskiest actions can't happen on the model's say-so alone.
    explain:
      - "Approval doesn't change the model's ability."
      - ""
      - "Checkpoints are about safety, not saving tokens."
      - "Loops call tools all the time. Checkpoints decide which actions need a yes."
---
An agent is a model in a **loop**. Each round it *thinks* about what to do, *acts* by calling a tool, then *observes* the result. Then it goes round again.
===
Goal: "Is my website down?" Think: check the homepage. Act: fetch it. Observe: error 500. Think: check the logs. Act: read them. Observe: database timeout. Report back.
===
The model decides when it's finished. That's powerful, but it can also stop too early, or never stop at all and go round in circles.
===
So builders add guard rails: a **step limit**, a time or cost budget, and checkpoints where a **human** must approve before the agent carries on.
===
Every round re-reads the whole context, so long loops get slow and expensive. And every step is one more chance to make a mistake.
=== deeper
This pattern is called **ReAct**, short for reason and act. Model APIs support it directly: the model replies with either plain text (it's done) or a structured tool call (keep going). Your code runs the tool, adds the result to the conversation and calls the model again. That loop, plus a stop condition, is the core of almost every agent framework.
