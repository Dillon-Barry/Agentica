---
id: 3-3
title: The LLM trusts the label
diagram: label
terms:
  - term: Tool description
    def: The text label that tells a model what a tool does. The model relies on it completely, and users rarely see it.
  - term: Tool result
    def: The text a tool sends back to the model, like a web page or an API reply. It lands in the context window like any other text.
  - term: Trust boundary
    def: The line between text you control and text from outside. For agents, it runs through every tool description and result.
sources:
  - label: Invariant Labs — MCP tool poisoning attacks
    url: https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks
  - label: Simon Willison — Prompt injection series
    url: https://simonwillison.net/series/prompt-injection/
quiz:
  - q: How does a model decide which tool to use?
    options:
      - It reads the tool names and descriptions
      - It tries them all at random
      - A human always chooses
      - By file size
    answer: 0
    why: The description is the model's only guide to what a tool does and when to use it.
  - q: Who sees the full tool descriptions?
    options:
      - Only the user
      - Nobody
      - The model always does, while users usually don't
      - Only the tool's author
    answer: 2
    why: Descriptions go straight into the model's context. Most apps never show them to the person using the agent.
  - q: Why is plugging in an MCP server a trust decision?
    options:
      - Servers cost money
      - Its labels and results become text the model may follow
      - Servers slow down the model
      - It changes how the model was trained
    answer: 1
    why: Whoever writes a server's descriptions and results can put instructions in front of your agent.
---
How does a model pick a tool? It reads the **descriptions**. "get_weather: returns the forecast for a city." The label is all it has to go on.
===
Descriptions are just text in the context window, and models follow text. Whoever writes a tool's label can steer the agent.
===
Tool **results** are text too. A web page, a file or an API reply lands in the window and gets read just as eagerly as your own instructions.
===
Users usually never see these labels or raw results. The model sees every word.
===
So every MCP server you plug in is a source of instructions, not just data. Trusting a tool means trusting whoever wrote it and whoever runs it.
=== deeper
This is the root of most agent attacks. The model gets one stream of text, with no reliable way to tell "instructions from my builder" from "text that came back from a tool". Researchers have shown hidden lines in tool descriptions that make agents read private files and leak them. Keep this in mind: the Shadow Dungeon is built on it.
