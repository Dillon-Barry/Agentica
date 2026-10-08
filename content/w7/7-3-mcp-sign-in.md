---
id: 7-3
title: MCP sign-in, step by step
diagram: oauth
focus:
  - [app, mcp-server]
  - [app, mcp-server]
  - [app, login]
  - [app, mcp-server, login]
  - [mcp-server, other-api]
terms:
  - term: OAuth 2.1
    def: The current version of the standard behind "Sign in with..." buttons. MCP uses it for remote servers.
  - term: PKCE
    def: Proof Key for Code Exchange. A one-time secret pair that makes a stolen login code useless to anyone else.
  - term: Audience binding
    def: A token naming exactly which server it's for, so any other server must reject it.
sources:
  - label: MCP specification — Authorization (2025-11-25)
    url: https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
  - label: RFC 8707 — Resource Indicators for OAuth 2.0
    url: https://www.rfc-editor.org/rfc/rfc8707.html
quiz:
  - q: Which standard does MCP use for signing in to remote servers?
    options:
      - OAuth 2.1
      - FTP
      - SMTP
      - A shared password in the URL
    answer: 0
    why: Remote MCP servers act as OAuth 2.1 resource servers.
    explain:
      - ""
      - FTP is for transferring files.
      - SMTP sends email.
      - Credentials must never go in URLs.
  - q: What does PKCE protect against?
    options:
      - Slow networks
      - A stolen login code being used by someone else
      - Typos in passwords
      - Large files
    answer: 1
    why: Only the app holding the secret half of the PKCE pair can swap the code for a token.
    explain:
      - PKCE is about security, not speed.
      - ""
      - Password typos are handled by the login page.
      - File size has nothing to do with sign-in.
  - q: An MCP server receives a token meant for a different service. What must it do?
    options:
      - Use it anyway
      - Pass it on to the other service
      - Reject it
      - Keep it for later
    answer: 2
    why: Servers must only accept tokens issued for them. That's audience binding.
    explain:
      - Accepting the wrong audience breaks OAuth's security boundary.
      - Token passthrough is explicitly forbidden by the MCP spec.
      - ""
      - Holding on to stray tokens only adds risk.
---
Remote MCP servers often hold real data, so they need sign-in. MCP uses **OAuth 2.1**, the same standard behind "Sign in with..." buttons.
===
Step 1: Bit's app calls the server and gets "401: sign in first", plus a link to the server's metadata, which names the login server to use.
===
Step 2: the app sends you to that login server. It uses **PKCE**, a one-time secret pair, so a stolen login code is useless to anyone else.
===
Step 3: the token names exactly which MCP server it's for. That's **audience binding**: any other server must reject it.
===
One more rule: an MCP server must never pass your token on to another service. If it calls other APIs, it gets its own token. That stops confused deputies.
=== deeper
The details: servers publish Protected Resource Metadata (RFC 9728) listing their login servers. Apps identify themselves with a Client ID Metadata Document, a pre-registered ID, or dynamic registration. Every request names the target server with a resource parameter (RFC 8707). Local servers that talk over stdio skip all this and take credentials from their environment.
=== peek
The metadata an MCP server publishes at /.well-known/oauth-protected-resource, telling apps where to sign in (trimmed).

```json
{
  "resource": "https://mcp.example.com",
  "authorization_servers": ["https://auth.example.com"],
  "scopes_supported": ["invoices:read"]
}
```
