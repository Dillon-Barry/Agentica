---
id: 7-6
title: Computer-use and browser agents
diagram: browser
focus:
  - [agent, browser]
  - [browser, buy]
  - [injection]
  - [buy]
  - [human]
terms:
  - term: Computer use
    def: An agent operating a computer like a person, by looking at the screen and moving the mouse and keyboard.
  - term: Browser agent
    def: An agent that browses the web for you, reading pages and clicking, typing and submitting.
  - term: Allowlist
    def: A list of the only sites or destinations an agent may use. Everything else is blocked.
sources:
  - label: Anthropic (2024) — Introducing computer use
    url: https://www.anthropic.com/news/3-5-models-and-computer-use
  - label: OWASP — LLM01 Prompt Injection
    url: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
quiz:
  - q: What makes browser agents especially risky?
    options:
      - They're slow
      - Every page they read is untrusted, and their clicks can be irreversible
      - They can't read text
      - They only work offline
    answer: 1
    why: They combine untrusted input with real actions on real accounts.
    explain:
      - Speed isn't the danger.
      - ""
      - Reading pages is exactly what they do, and that's the risk.
      - They work on the live web.
  - q: Which setup fits a browser agent best?
    options:
      - Save all your passwords in it
      - Let it browse anywhere, on auto-pilot
      - A sandboxed browser, a site allowlist, and a human confirming payments
      - Give it admin rights to your computer
    answer: 2
    why: Contain it, limit where it can go, and keep a person on irreversible actions.
    explain:
      - Stored passwords put every account within reach of a hijacked agent.
      - Unlimited browsing means unlimited untrusted input.
      - ""
      - Admin rights turn one bad page into a full compromise.
  - q: Why can computer use reach systems that ordinary tools can't?
    options:
      - It uses the screen, mouse and keyboard like a person, so no API is needed
      - It hacks into them
      - It has special licences
      - It can't
    answer: 0
    why: Anything a person can operate, it can operate, which is why it needs tight limits.
    explain:
      - ""
      - It uses the normal interface, not exploits.
      - No licence is involved. It just uses the screen.
      - It can, and that reach is what makes it powerful and risky.
---
Some agents don't call tools at all. They look at the screen and click and type like a person. That's **computer use**, and a **browser agent** does it on the web.
===
It's hugely capable: any website or app becomes a tool, even ones with no API.
===
It's also the riskiest kind of agent. Every page Bit sees is untrusted content, so one hidden line on a page can try to hijack it mid-task.
===
And clicks have consequences: buying, sending, deleting. Some can't be undone, and logged-in sessions put real accounts within reach.
===
Protections: a sandboxed browser or VM, an **allowlist** of sites, no saved passwords, and a human confirming payments, sends and deletes.
=== deeper
Anthropic released computer use in October 2024 and OpenAI launched Operator in January 2025; browser agents are now common. Screens are also a privacy risk, because screenshots capture whatever is visible. Good designs keep the agent's browser separate from your personal one, hand sign-ins to the user, and log every action for review.
