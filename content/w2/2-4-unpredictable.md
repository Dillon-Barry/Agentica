---
id: 2-4
title: Why agents are unpredictable
diagram: branches
terms:
  - term: Non-determinism
    def: Getting different outputs from the same input. LLMs pick words with some randomness, so runs differ.
  - term: Compounding errors
    def: Small per-step failure rates multiplying over many steps. 95% reliable steps, ten in a row, succeed only about 60% of the time.
  - term: Hallucination
    def: A model confidently stating something false, like an invented fact, file name or tool argument.
  - term: Evals
    def: Evaluations. Many automated test runs, scored to measure how reliably an agent does its job.
sources:
  - label: Wikipedia — Hallucination (AI)
    url: https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: Each step is 95% reliable. Roughly how often does a 10-step task fully succeed?
    options:
      - 95%
      - 100%
      - About 60%
      - About 10%
    answer: 2
    why: 0.95 multiplied by itself ten times is about 0.6. Small slips add up over long tasks.
  - q: What is a hallucination?
    options:
      - The model confidently stating something false
      - A tool that crashes
      - A slow network
      - An approved answer
    answer: 0
    why: Hallucinations sound just as confident as correct answers, which makes them hard to spot.
  - q: Agents are unpredictable. What's the sensible response?
    options:
      - Test once, then ship
      - Ask the model to promise to behave
      - Never let agents use tools
      - Add limits, monitoring and controls that hold whatever the model decides
    answer: 3
    why: You can't test every path, so you build controls that stay in force no matter which path the model takes.
---
Run the same agent twice on the same task and you may get two different plans. Models pick each next word with some randomness, and small differences snowball.
===
Errors **compound**. If each step is 95% reliable, ten steps in a row all succeed only about 60% of the time. Long tasks magnify small slips.
===
Models can **hallucinate**: state false things confidently, invent a file name, or call a tool with made-up arguments. They sound just as sure either way.
===
Tiny input changes can flip behavior. A reworded request, a new tool, or one odd line on a web page can send the agent down a different path.
===
So you can't test every path in advance. You need limits, monitoring and controls that hold *whatever* the model decides.
=== deeper
The randomness comes from sampling. The model scores every possible next token, and the system picks among the likely ones. Lowering the "temperature" setting reduces variety but doesn't make the model correct. Teams measure agents with **evals**, many test runs scored automatically, and watch real runs with tracing, because one good demo proves very little.
