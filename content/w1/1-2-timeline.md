---
id: 1-2
title: Sixty years of agents
diagram: timeline
focus:
  - []
  - [eliza]
  - [expert]
  - [bdi]
  - [alphago]
  - [react]
  - [autogpt, mcp, a2a]
terms:
  - term: ELIZA
    def: A 1966 MIT chatbot that matched patterns in your words to mimic a therapist. No real understanding.
  - term: Expert system
    def: A 1970s-80s program that followed many hand-written if-then rules. Smart in a narrow area, lost outside it.
  - term: BDI model
    def: A 1990s design for agents built on Beliefs, Desires and Intentions, so they can plan toward goals.
  - term: Reinforcement learning
    def: Learning by trial and error, rewarded for good outcomes. How AlphaGo learned to play Go.
  - term: LLM
    def: Large language model. A model trained on huge amounts of text that can understand and write language on almost any topic.
  - term: ReAct
    def: A 2022 technique where a model alternates between reasoning about a task and acting with a tool.
sources:
  - label: Weizenbaum (1966) — ELIZA
    url: https://dl.acm.org/doi/10.1145/365153.365168
  - label: Vaswani et al. (2017) — Attention Is All You Need
    url: https://arxiv.org/abs/1706.03762
  - label: Yao et al. (2022) — ReAct
    url: https://arxiv.org/abs/2210.03629
  - label: Anthropic (2024) — Introducing the Model Context Protocol
    url: https://www.anthropic.com/news/model-context-protocol
quiz:
  - q: What did ELIZA (1966) actually do?
    options:
      - Understood human emotions deeply
      - Matched patterns in your words and reflected them back
      - Searched the internet for answers
      - Played board games against people
    answer: 1
    why: ELIZA had no understanding. It rearranged your own words using simple patterns.
    explain:
      - "ELIZA understood nothing. It only rearranged your words."
      - ""
      - "It had no internet access. It worked from simple patterns."
      - "That was game-playing AI, decades later."
  - q: What was the main weakness of expert systems?
    options:
      - They were too creative
      - They needed the internet to work
      - They could only speak English
      - Humans had to hand-write every rule, and they broke outside their narrow area
    answer: 3
    why: Every piece of knowledge was a hand-written rule, so they couldn't cope with anything their authors didn't predict.
    explain:
      - "The opposite: they only did exactly what their rules said."
      - "They ran on their own, with no internet needed."
      - "Language wasn't the issue. Rigid hand-written rules were."
      - ""
  - q: What did the ReAct paper show in 2022?
    options:
      - A model can alternate between reasoning and taking actions with tools
      - Models can be trained without any data
      - Agents should never use tools
      - Chatbots are better than agents
    answer: 0
    why: Reason, act, observe, repeat. That pattern is the core loop of most agents today.
    explain:
      - ""
      - "Models still learn from huge amounts of data."
      - "ReAct showed tools make models more capable, not less."
      - "It was about agents doing more, not chatbots winning."
---
Agents feel brand new, but the idea is about 60 years old. Each era added one missing piece. Let's walk the timeline.
===
**1966: ELIZA.** An MIT program that mimicked a therapist by matching patterns in your sentences and reflecting them back. It understood nothing, yet people confided in it. Lesson one: talking isn't thinking.
===
**1970s-80s: Expert systems.** Programs like MYCIN followed hundreds of hand-written if-then rules to diagnose infections. Smart inside their box, helpless outside it. Every rule had to be written by a human.
===
**1990s: Intelligent agents.** Researchers designed agents with *beliefs*, *desires* and *intentions* (the BDI model) that plan toward goals. Great theory, but they still couldn't understand messy human language.
===
**2016: AlphaGo.** DeepMind's agent beat a world champion at Go, largely by playing itself millions of times and learning from wins and losses (reinforcement learning). Superhuman, but only at one game.
===
**2022: LLMs and ReAct.** Large language models could finally understand language about almost anything. The **ReAct** paper showed a model could *reason*, *act* with a tool, then reason again. The modern agent was born.
===
**2023-2025: The agent boom.** AutoGPT showed agents running on their own. **MCP** (2024) gave agents a standard plug for tools. **A2A** (2025) let agents talk to each other. Now the hard part is running them safely.
=== deeper
Why did LLMs change everything? Older agents needed humans to hand-code their knowledge, or a narrow simulated world to learn in. LLMs arrived pre-trained on a huge slice of human writing, so one model can read a web page, write code and pick the next tool. The 2017 *Transformer* design made that scale possible. ReAct, and later built-in *function calling* in model APIs, turned that language skill into action.
