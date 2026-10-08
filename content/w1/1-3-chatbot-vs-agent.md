---
id: 1-3
title: Chatbot vs agent
diagram: chat-vs-agent
terms:
  - term: Chatbot
    def: An AI that replies to messages with text. It answers, but doesn't take actions.
  - term: RAG
    def: Retrieval-augmented generation. The AI looks up relevant documents first, then answers using them.
  - term: Workflow
    def: A fixed sequence of steps written in code, where the AI model is called at set points. The code, not the model, decides the path.
sources:
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: What is the key difference between a chatbot and an agent?
    options:
      - Agents use a completely different kind of AI model
      - Agents take actions with tools in a loop, while chatbots only reply with text
      - Chatbots are always faster
      - There is no real difference
    answer: 1
    why: Often the very same model sits inside both. The loop and the tools are what turn it into an agent.
  - q: Why is a mistake by an agent more serious than a mistake by a chatbot?
    options:
      - Agents are more expensive to run
      - Agent mistakes are harder to read
      - An agent can make real changes, like deleting files or sending messages
      - Chatbots never make mistakes
    answer: 2
    why: A chatbot's mistake is a wrong sentence. An agent's mistake can be a wrong action with real consequences.
  - q: In a workflow, who decides the order of steps?
    options:
      - Code written in advance by a developer
      - The AI model, on the fly
      - The end user, step by step
      - Another agent
    answer: 0
    why: Workflows follow a predefined path. In a true agent, the model chooses its own path.
---
A **chatbot** answers. You ask, it replies with text, and that's the end of it. If it's wrong, you get a wrong sentence. Annoying, but you're still in control.
===
An **agent** acts. You give it a goal, and it plans steps, calls tools, checks the results and keeps going until it's done. It can read files, run code, send messages or change systems.
===
Often it's the same model inside both. The upgrade from chatbot to agent is the **loop** plus **tools**: the model's words become real actions.
===
That's also where the risk jumps. A wrong agent doesn't just *say* the wrong thing. It might *do* it: delete a file, email the wrong person, or leak private data.
===
That's the road ahead. Worlds 2-4: how agents work. World 5: why they're hard to secure. World 6: how **kagent**, **agentregistry** and **agentgateway** help keep them in check.
=== deeper
There's a spectrum between the two. **Chatbot**: text in, text out. **RAG**: the chatbot looks up documents before answering. **Workflow**: code calls the model at fixed steps. **Agent**: the model picks its own steps and tools. Good engineers choose the simplest option that solves the problem. More autonomy is not automatically better.
