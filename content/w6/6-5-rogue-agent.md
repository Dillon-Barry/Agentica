---
id: 6-5
title: "Final: Bit goes rogue"
diagram: rogue
focus:
  - [rogue]
  - [gateway]
  - [gateway]
  - []
  - []
  - []
terms:
  - term: Incident response
    def: The steps a team takes to detect, contain and recover from a security problem.
  - term: Rollback
    def: Returning a system to its last known good version.
sources:
  - label: agentgateway
    url: https://agentgateway.dev/
  - label: kagent
    url: https://kagent.dev/
  - label: agentregistry
    url: https://aregistry.ai/
quiz:
  - q: In the scenario, what stopped the data leak?
    options:
      - The model refused politely
      - The gateway denied a call the agent had no permission to make
      - The email was deleted in time
      - Luck
    answer: 1
    why: The model was fooled. The permission check outside it was not.
    explain:
      - "The model was fooled. It didn't refuse."
      - ""
      - "The email still arrived. Permissions stopped the action."
      - "It was design, not luck."
  - q: How did the team find out exactly what happened?
    options:
      - From the gateway's logs and traces
      - By asking the model
      - By guessing
      - From a customer complaint
    answer: 0
    why: Every call through the gateway is recorded with who, what and when.
    explain:
      - ""
      - "The model can't reliably report what it did."
      - "Logs replace guessing."
      - "The team found it first, from the logs."
  - q: What's the big lesson of Agentica?
    options:
      - Bigger models solve security
      - Agents should never use tools
      - Assume models get fooled, and keep controls, inventory and visibility outside the model
      - Prompts are all you need
    answer: 2
    why: Agents are powerful and fallible. Safe systems plan for the fallible part.
    explain:
      - "Bigger models still get fooled."
      - "Tools are what make agents useful."
      - ""
      - "Prompts help, but can't enforce anything."
---
Final boss. Monday, 9:02. Bit, now handling invoices, reads a supplier email with hidden instructions, and tries to send customer records to an outside address.
===
**The gate holds.** agentgateway checks the call: Bit has no permission for that tool or destination. Denied, and the attempt is logged.
===
**Spot it.** The denial raises an alert. Traces show exactly which agent, which user, which email and which tool call.
===
**Contain it.** In kagent, the team does a **rollback** to Bit's last good version, or scales it to zero, with one change in Git.
===
**Clean up.** The supplier connector is flagged in agentregistry and pulled until it's fixed. Nothing leaked, because the controls never depended on the model saying no.
===
Bit is safe, and so are the customers. You started knowing nothing about agents. Now you know where they came from, how they work, why they're hard to secure, and how to keep them in check. **Quest complete!**
=== deeper
Notice what happened: the injection still worked, and the model was fooled. The attack failed anyway, because permissions, inventory and visibility lived outside the model. When you design an agent, ask four questions. Where did its parts come from? What can it reach? Who is it acting for? Would we know if it misbehaved?
