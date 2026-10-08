---
id: 5-5
title: Sprawl
diagram: sprawl
focus:
  - []
  - [agent, mcp]
  - [key]
  - []
  - []
terms:
  - term: Shadow AI
    def: Agents, MCP servers and AI tools running in an organization without anyone tracking or approving them.
  - term: Agent sprawl
    def: Agents and tools multiplying across teams, laptops and clouds faster than anyone can keep a list.
  - term: Long-lived credentials
    def: API keys or tokens that never expire. If leaked, they keep working until someone notices.
sources:
  - label: OWASP — GenAI Security Project
    url: https://genai.owasp.org/
  - label: Solo.io — The problems agentregistry solves
    url: https://www.solo.io/blog/understanding-the-agentregistry-project-and-the-problems-it-solves
quiz:
  - q: What is shadow AI?
    options:
      - AI that only runs at night
      - Agents and tools running without anyone tracking them
      - A dark mode setting
      - An AI that copies users
    answer: 1
    why: If nobody knows an agent exists, nobody is checking what it can reach or do.
    explain:
      - "It's about being untracked, not timing."
      - ""
      - "It's an organizational risk, not a theme."
      - "Copying isn't the issue. Visibility is."
  - q: Why are long-lived shared API keys risky?
    options:
      - They're hard to type
      - They slow agents down
      - A leaked key keeps working, and you can't tell which agent used it
      - They expire too quickly
    answer: 2
    why: Shared keys blur identity, and keys that never expire stay useful to an attacker indefinitely.
    explain:
      - "Typing isn't the risk."
      - "Speed isn't the problem."
      - ""
      - "The danger is that they don't expire."
  - q: Where does fixing sprawl start?
    options:
      - An inventory, real agent identities and trustworthy logs
      - Buying more laptops
      - Deleting every agent
      - Writing a longer system prompt
    answer: 0
    why: You can't secure what you can't see. Visibility comes first.
    explain:
      - ""
      - "Hardware doesn't fix visibility."
      - "That throws away the value too."
      - "Prompts don't give you an inventory."
---
Fifth monster: **sprawl**. It isn't one attack. It's the fog that lets every other attack hide.
===
Developers install MCP servers on their laptops. Teams spin up agents in different clouds. Nobody has one list of what exists. Security teams call this **shadow AI**.
===
Credentials spread too: long-lived API keys pasted into config files, shared between agents, never rotated.
===
When something goes wrong, nobody can answer: which agent did this, for whom, using which tool and which version?
===
You can't secure what you can't see. The fix starts with an inventory, real identities for agents, and logs you can trust.
=== deeper
Sprawl multiplies every earlier risk. An unvetted MCP server might be poisoned. An agent nobody owns might hold excessive permissions. A leaked key works until someone notices. Mature teams treat agents like any other workload: registered before use, given short-lived credentials of their own, and routed through points where traffic can be logged and controlled.
