---
id: 5-6
title: Agent identity
diagram: identity
terms:
  - term: Agent identity
    def: A verifiable ID for an agent itself, separate from the users it serves, so every action can be traced to a specific agent.
  - term: Short-lived token
    def: A credential that expires in minutes or hours and allows only specific actions, limiting the damage if it leaks.
  - term: Token exchange
    def: Swapping a user's token for a new one that names both the user and the agent acting for them, with narrower permissions.
sources:
  - label: RFC 8693 — OAuth 2.0 Token Exchange
    url: https://datatracker.ietf.org/doc/html/rfc8693
  - label: MCP specification — Authorization
    url: https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
quiz:
  - q: Why should an agent have its own identity?
    options:
      - So it can log in to social media
      - So every action can be traced to that agent and controlled separately
      - Identities make agents faster
      - Because users don't have identities
    answer: 1
    why: Without its own identity, an agent's actions blur into a shared key or a user's account.
  - q: Bit acts for Alex. What should Bit's token say?
    options:
      - Nothing. Tokens should be blank
      - Only "admin"
      - Who Bit is acting for, that Bit is the one acting, and what it may do
      - Alex's password
    answer: 2
    why: Naming both the user and the agent, with narrow scopes, lets every check ask the right question.
  - q: Why are short-lived, narrow tokens safer?
    options:
      - A leaked token stops working soon and only unlocks a few actions
      - They are easier to remember
      - They never need checking
      - They let agents skip approval
    answer: 0
    why: Expiry limits how long a leak hurts. Narrow scopes limit how much.
---
In the dungeon so far, one question keeps coming up: who is actually doing this? For agents, that's **identity**.
===
Many agents still run on one shared API key. Every action looks the same, so you can't tell which agent did what, or for whom. That's the confused deputy waiting to happen.
===
Better: Bit gets its own **agent identity**. When Bit acts for Alex, its token says both: "this is Bit, acting for Alex". That's **token exchange**.
===
Tokens should be **short-lived** and narrow: valid for minutes, allowing only "read invoices", not "do anything". A leaked token then stops working fast and unlocks little.
===
With real identities, every tool can check "is *this* agent, acting for *this* user, allowed to do *this*?" That check is what World 6's gateway enforces.
=== deeper
Standards are catching up. OAuth 2.0 token exchange (RFC 8693) defines an "act" claim for exactly this case: the subject is the user, the actor is the agent. The MCP specification uses OAuth for remote servers, so an MCP server can know which user and which client is calling. The hard part is plumbing identity through every hop, including agent-to-agent calls.
=== peek
The claims inside an exchanged token (simplified). The user is the subject, Bit is the actor, and the scope is narrow.

```json
{
  "sub": "user:alex",
  "act": { "sub": "agent:bit" },
  "scope": "invoices:read",
  "exp": 1767225600
}
```
