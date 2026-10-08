---
id: 7-2
title: Guardrail models
diagram: guards
focus:
  - [in-filter, out-filter]
  - [input, in-filter, out-filter, output]
  - [in-filter, out-filter]
  - [in-filter]
  - []
terms:
  - term: Input filter
    def: A check on what reaches an agent, looking for prompt injection, jailbreaks or malicious files.
  - term: Output filter
    def: A check on what leaves an agent, looking for secrets, personal data or harmful content.
  - term: False positive
    def: A guardrail wrongly blocking something legitimate.
sources:
  - label: Inan et al. (2023) — Llama Guard
    url: https://arxiv.org/abs/2312.06674
  - label: OWASP — LLM01 Prompt Injection
    url: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
quiz:
  - q: What is a guardrail model?
    options:
      - A small model that screens what goes in and out of an agent
      - The agent's main model
      - A firewall rule written in CEL
      - A backup copy of the model
    answer: 0
    why: Guardrails classify inputs and outputs, flagging attacks and leaks.
    explain:
      - ""
      - The main model does the work. A guardrail checks around it.
      - CEL rules are deterministic policies, not models.
      - It's a separate checker, not a backup.
  - q: Why aren't guardrails a security boundary on their own?
    options:
      - They're too expensive to run
      - They're probabilistic, so some attacks slip past
      - They only work in English
      - They can't read text
    answer: 1
    why: A guardrail gives a likelihood, not a guarantee. Permissions must still back it up.
    explain:
      - Cost matters, but the core problem is that they can be fooled.
      - ""
      - Many work across languages. The issue is reliability.
      - Reading text is exactly what they do.
  - q: A guardrail blocks a perfectly legitimate refund request. What is that called?
    options:
      - A rug pull
      - A hallucination
      - A false positive
      - Token exchange
    answer: 2
    why: Blocking good requests is the cost of a strict guardrail. Teams measure it and tune for it.
    explain:
      - A rug pull is a tool changing after approval.
      - A hallucination is a model inventing things.
      - ""
      - Token exchange is about identity, not filtering.
---
You met guardrails in the Shadow Dungeon. Now the detail: a **guardrail model** is a small, fast model that screens text going in and out of an agent.
===
An **input filter** checks what reaches Bit: prompt injection, jailbreak attempts, malicious files. An **output filter** checks what leaves: secrets, personal data, harmful content.
===
Examples include Meta's Llama Guard and dedicated prompt-injection classifiers. They often sit in the gateway, so every agent gets them without code changes.
===
But they're models too. They give probabilities, not proofs. Clever wording slips past, and a **false positive** blocks legitimate work.
===
So guardrails are one layer of defense in depth. Permissions, sandboxes and the lethal-trifecta rule still do the real enforcement.
=== deeper
Tuning is a trade-off. A strict threshold blocks more attacks and more good requests; a loose one lets more through. Teams measure both rates on their own data, log what gets blocked, and review it regularly. Guardrails also add delay and cost to every call, which adds up in long agent loops.
