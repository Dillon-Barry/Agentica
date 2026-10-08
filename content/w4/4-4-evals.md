---
id: 4-4
title: Evals and observability
diagram: evals
focus:
  - []
  - [suite]
  - [suite]
  - [trace]
  - [trace]
terms:
  - term: Trace
    def: A step-by-step record of one agent run, showing each model call, tool call, input, output, time and cost.
  - term: Observability
    def: Being able to see what a system is doing from its logs, metrics and traces.
  - term: LLM-as-judge
    def: Using a model to grade another model's output against written criteria, when exact answers can't be checked by code.
sources:
  - label: OpenTelemetry — Semantic conventions for generative AI
    url: https://opentelemetry.io/docs/specs/semconv/gen-ai/
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: Why isn't one successful demo enough to trust an agent?
    options:
      - Demos are always faked
      - Agents vary run to run, so you need many test cases scored over many runs
      - Demos use more electricity
      - Users never watch demos
    answer: 1
    why: Non-determinism means one good run proves little. Evals measure reliability across many runs.
    explain:
      - "Demos can be real. They just don't show reliability."
      - ""
      - "Energy use isn't the issue."
      - "Watching doesn't prove reliability either."
  - q: What does a trace show?
    options:
      - The agent's password
      - A drawing of the model
      - Every step of one run, including model calls, tool calls, timing and cost
      - Only the final answer
    answer: 2
    why: Traces turn "the agent did something weird" into "step 4 called the wrong tool with this input".
    explain:
      - "Traces record actions, never passwords."
      - "A trace is a step-by-step log, not a picture."
      - ""
      - "That's just the end. A trace shows every step."
  - q: When is LLM-as-judge useful?
    options:
      - When quality can't be checked by code, like the tone of a reply
      - When you want to skip testing
      - When the answer is a single number
      - Never
    answer: 0
    why: Some qualities need judgement. A model grader, checked against human ratings, scales that judgement.
    explain:
      - ""
      - "It's a way to test, not to skip testing."
      - "Simple answers can be checked by code."
      - "It's widely used, carefully checked against people."
---
How do you know Bit is any good? One great demo proves very little, because agents don't behave the same way every run.
===
**Evals** are test suites for agents: many realistic tasks, each scored automatically, run again after every change to the prompt, tools or model.
===
Some answers can be checked by code. Others need judgement, like "was the reply polite and correct?" There, teams use **LLM-as-judge**: a model grades the output against clear criteria.
===
In production, you need **observability**. A **trace** records each run step by step: every model call, tool call, input, output, time taken and cost.
===
When something goes wrong, traces show exactly where. And they're your audit trail when someone asks, "Why did the agent do that?"
=== deeper
Good eval sets mix normal tasks, edge cases and known attacks, and they grow every time a real bug slips through. OpenTelemetry now has shared conventions for recording model and agent activity, so traces from different tools can land in the same dashboards as the rest of your systems. In World 6, agentgateway emits exactly this kind of data.
