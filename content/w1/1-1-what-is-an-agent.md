---
id: 1-1
title: What is an AI agent?
diagram: agent-core
terms:
  - term: AI agent
    def: A program that uses an AI model to reach a goal by deciding its own next steps and taking actions.
  - term: Model
    def: The agent's "brain". Usually a large language model (LLM) that reads the situation and decides what to do.
  - term: Tool
    def: Anything the agent can use to act on the world, like a web search, a database query or sending an email.
  - term: Agent loop
    def: The repeating cycle of think, act, observe that an agent runs until its goal is met.
  - term: Autonomy
    def: How much an agent may do without asking a human first. A dial, not a switch.
sources:
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
  - label: Russell & Norvig — Artificial Intelligence, A Modern Approach
    url: https://aima.cs.berkeley.edu/
quiz:
  - q: Which best describes an AI agent?
    options:
      - A chatbot that answers questions about AI
      - A program that uses an AI model to decide and take actions toward a goal
      - A database of trained AI models
      - A person who sells AI software
    answer: 1
    why: An agent pursues a goal. The model picks each next step, and tools carry it out.
  - q: In the four-part picture of an agent, what do tools do?
    options:
      - Store past conversations
      - Train the model on new data
      - Let the agent act on the world, like searching or sending email
      - Decide what the goal should be
    answer: 2
    why: Tools are the agent's hands. Memory stores history, and the goal comes from you.
  - q: What happens when you give an agent more autonomy?
    options:
      - It becomes more useful and more risky
      - It becomes slower but safer
      - Nothing changes
      - It no longer needs tools
    answer: 0
    why: More freedom means it can do more on its own, including more damage when it gets something wrong.
---
Welcome to **Agentica**, traveler! Over six worlds you'll go from knowing nothing about AI agents to understanding how they work, why they're risky, and how teams keep them in check.
===
An **AI agent** is a program that uses an AI model to reach a goal. It decides what to do next, then does it. You give it the *what*. It works out the *how*.
===
Most agents have four parts. A **model**, the brain that reasons. **Tools**, the hands that act. **Memory**, to track what happened. And a **loop** that repeats until the goal is met.
===
Example: "Find me a cheap flight to Lisbon next Friday." An agent searches flight sites, compares prices, checks your calendar, then reports back. The model chooses each step. Nobody scripted them in advance.
===
**Autonomy** is a dial, not a switch. Some agents ask before every action. Others run for hours alone. The more freedom an agent has, the more useful it gets, and the more dangerous.
=== deeper
Classic AI textbooks define an agent as anything that *perceives* its environment and *acts* on it. Modern AI agents fit: their senses are text, files and API results, and their actions are tool calls. Anthropic draws a useful line between a **workflow**, where your code decides the steps, and an **agent**, where the model decides them.
