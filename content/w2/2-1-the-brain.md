---
id: 2-1
title: The brain
diagram: brain
focus:
  - []
  - [model]
  - [context]
  - [system]
  - [context]
  - [model]
terms:
  - term: Token
    def: A chunk of text, roughly three-quarters of a word. Models read and write in tokens, and usage is billed by them.
  - term: Context window
    def: All the text a model can see in one go, including instructions, chat history and tool results. If it isn't in the window, the model can't see it.
  - term: System prompt
    def: Standing instructions written by the agent's builder, read before every task. It guides behavior but can't enforce it.
sources:
  - label: Wikipedia — Large language model
    url: https://en.wikipedia.org/wiki/Large_language_model
  - label: OpenAI — Tokenizer
    url: https://platform.openai.com/tokenizer
quiz:
  - q: What does an LLM fundamentally do?
    options:
      - Searches a database of ready-made answers
      - Predicts the next token, over and over
      - Runs code on your computer
      - Remembers every conversation forever
    answer: 1
    why: Everything an LLM does, from chatting to planning, comes from predicting the next token again and again.
    explain:
      - "It generates text; it doesn't look up stored answers."
      - ""
      - "It only produces text. Other code runs tools."
      - "Each request starts fresh unless memory is added."
  - q: What is the context window?
    options:
      - The browser window the agent opens
      - A list of approved tools
      - All the text the model can see right now
      - The data the model was trained on
    answer: 2
    why: The context window holds the instructions, conversation and tool results the model reads this turn.
    explain:
      - "It's not a browser. It's the text the model can see."
      - "Tool lists can sit inside the window, but the window is everything it sees."
      - ""
      - "Training data shaped the model. The window is what it sees right now."
  - q: Is the system prompt a security boundary?
    options:
      - No. It is just text, and other text in the window can push against it
      - Yes. The model can never break it
      - Yes, if it is written in capitals
      - Only for small models
    answer: 0
    why: The system prompt guides the model, but it sits in the same window as everything else, so it can be argued with.
    explain:
      - ""
      - "Other text in the window can argue against it."
      - "Capital letters change nothing about how models weigh text."
      - "No model treats a prompt as unbreakable."
---
Bit wants to do more than chat. Welcome to The Forge, where we open Bit up and see what an agent is made of, starting with its brain.
===
The brain of an agent is a **large language model** (LLM). At heart it does one thing: given some text, it predicts the most likely next word. Then the next. Then the next.
===
Everything the model knows *right now* sits in its **context window**: your message, its instructions, the chat so far and any tool results. If it isn't in the window, the model can't see it.
===
The **system prompt** is the agent's standing orders, written by whoever built it: "You are a travel assistant. Never book without asking." It guides the model, but it can't force it.
===
Text is read in **tokens**, chunks of about three-quarters of a word. Windows hold thousands to millions of tokens. Bigger windows cost more, and models can still lose track of details in them.
===
Key point: the model has no secret link to your systems. It only *reads text* and *writes text*. The tools and code around it turn that text into action.
=== deeper
LLMs learn by predicting the next token across huge amounts of text, then get tuned to follow instructions. Their knowledge stops at a training cutoff, which is one reason agents look things up with tools. Remember: the system prompt is not a security wall. It is just more text in the window, and other text can argue with it. That matters a lot in World 5.
