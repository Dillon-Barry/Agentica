---
id: 7-4
title: Cost and token budgets
diagram: cost
focus:
  - [context]
  - [context]
  - [cache]
  - []
  - [budget]
terms:
  - term: Prompt caching
    def: Reusing an unchanged start of the context between calls, so it costs far less than sending it fresh.
  - term: Model routing
    def: Sending easy steps to a small, cheap model and hard ones to a bigger model.
  - term: Token budget
    def: A cap on how many tokens (and so how much money) a run, user or day may use.
sources:
  - label: Anthropic — Prompt caching
    url: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
  - label: agentgateway
    url: https://agentgateway.dev/
quiz:
  - q: Why do agent loops cost more than the number of steps suggests?
    options:
      - Each step re-sends the growing conversation
      - Loops are taxed
      - Models charge per minute
      - They don't
    answer: 0
    why: The context grows every turn, so each step costs more than the one before.
    explain:
      - ""
      - There's no special fee for loops.
      - Pricing is per token, not per minute.
      - Growing context makes later steps more expensive.
  - q: What does prompt caching do?
    options:
      - Deletes old prompts
      - Reuses an unchanged start of the context at a lower price
      - Makes the model smarter
      - Stores the user's password
    answer: 1
    why: Keep stable instructions at the start of the context and they can be reused cheaply.
    explain:
      - Nothing is deleted. The repeated part is reused.
      - ""
      - Caching changes cost and speed, not intelligence.
      - Passwords should never be in prompts at all.
  - q: Which number best shows whether a cheaper model really saves money?
    options:
      - Cost per call
      - Tokens per second
      - Cost per successful task
      - Model size
    answer: 2
    why: A cheap model that fails more often can cost more overall once retries are counted.
    explain:
      - Cheap calls can still add up to an expensive failure.
      - Speed isn't cost.
      - ""
      - Size alone tells you nothing about cost per result.
---
Every step Bit takes costs money. Models charge per token, for what you send in and what comes back out.
===
Loops make it add up fast. Each turn re-sends the whole conversation, which keeps growing, so a 20-step task can cost far more than 20 single answers.
===
**Prompt caching** helps. When the start of the context stays the same, providers can reuse it for a fraction of the price. Keep stable instructions first.
===
**Model routing** helps too: send easy steps to a small, cheap model, and save the big one for hard reasoning.
===
And set a **token budget**: limits per run, per user and per day, enforced at the gateway, with cost tracked per task so surprises show up early.
=== deeper
Measure cost per successful task, not per call: a cheaper model that fails twice as often may cost more overall. Watch for runaway loops, oversized tool results stuffed into the context, and silent retries. Token quotas and rate limits at a gateway like agentgateway turn a surprise bill into a blocked request and an alert.
