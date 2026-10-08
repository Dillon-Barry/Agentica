---
id: 5-3
title: Excessive agency
diagram: deputy
focus:
  - [agent]
  - [agent, db]
  - [user, agent]
  - [user, agent, db]
  - [agent]
terms:
  - term: Excessive agency
    def: An agent having more tools, permissions or autonomy than its job needs. An OWASP top LLM risk.
  - term: Confused deputy
    def: A trusted program tricked into using its own privileges on behalf of someone who shouldn't have them.
  - term: Delegated identity
    def: An agent acting with the identity and permissions of the user it serves, rather than one shared all-powerful key.
sources:
  - label: OWASP — LLM06 Excessive Agency
    url: https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
  - label: Wikipedia — Confused deputy problem
    url: https://en.wikipedia.org/wiki/Confused_deputy_problem
quiz:
  - q: What is excessive agency?
    options:
      - An agent that is too slow
      - An agent with more permissions or tools than its job needs
      - An agent with too little memory
      - Having too many users
    answer: 1
    why: Extra power sits unused until the agent is fooled. Then the attacker gets all of it.
    explain:
      - "Speed isn't agency."
      - ""
      - "Memory size is a different issue."
      - "Agency is about the agent's power, not user numbers."
  - q: In a confused deputy attack, what happens?
    options:
      - The agent forgets its prompt
      - Two agents argue
      - The agent uses its own broad privileges for someone who shouldn't have them
      - The model crashes
    answer: 2
    why: The attacker has no access, but the agent does, and the agent can be talked into lending it.
    explain:
      - "The prompt is fine. The power is misused."
      - "This is about lent privileges, not conflict."
      - ""
      - "Nothing crashes. It works too well, for the wrong person."
  - q: Which fix helps most?
    options:
      - Least privilege, and acting with the user's own identity
      - Give every agent admin rights to be safe
      - Hide the system prompt
      - Use a bigger model
    answer: 0
    why: If the agent only holds what the current user is allowed, there's nothing extra to lend.
    explain:
      - ""
      - "That gives an attacker more to borrow."
      - "Hiding the prompt doesn't remove the agent's power."
      - "Model size doesn't limit permissions."
---
Third monster: **excessive agency**. The agent has more power than its job needs: write access when it only reads, admin keys when it only searches.
===
Most days nobody notices. But the day it gets confused or hijacked, all that extra power is available to the attacker.
===
Its cousin is the **confused deputy**. The agent holds broad privileges and acts on behalf of someone who shouldn't have them.
===
Example: a support agent with an admin database key. Any customer chatting with it can try to talk it into reading other customers' data. The agent lends its power.
===
Fixes: **least privilege**, meaning only what the task needs. Act with the *user's* identity, not one shared super-key. And require approval for risky actions.
=== deeper
OWASP splits excessive agency into three parts: too many tools, too many permissions, and too much autonomy without human checks. The confused deputy problem was named back in 1988, long before AI. The modern fix is the same as ever: carry the real caller's identity through every hop, and check each action against it.
