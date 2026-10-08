---
id: 3-2
title: MCP
diagram: mcp
terms:
  - term: MCP
    def: Model Context Protocol. An open standard for connecting AI agents to tools and data, introduced by Anthropic in 2024.
  - term: MCP server
    def: A program that wraps a system, like GitHub or a database, and offers its tools, resources and prompts over MCP.
  - term: MCP client
    def: The part of an agent's app that connects to MCP servers and passes their tools to the model.
sources:
  - label: Model Context Protocol
    url: https://modelcontextprotocol.io/
  - label: Anthropic (2024) — Introducing the Model Context Protocol
    url: https://www.anthropic.com/news/model-context-protocol
quiz:
  - q: What problem does MCP solve?
    options:
      - Models being too slow
      - Every agent needing custom wiring for every tool
      - The cost of training models
      - Low screen resolution
    answer: 1
    why: With a shared standard, a tool is built once and works with any MCP-compatible agent.
  - q: What does an MCP server do?
    options:
      - Trains the model
      - Stores chat history
      - Wraps a system and offers its tools in a standard format
      - Blocks attacks
    answer: 2
    why: An MCP server is the adapter between a real system and any agent that speaks MCP.
  - q: Does MCP decide which servers are safe to trust?
    options:
      - No. That job falls to the controls around it
      - Yes. Every server is verified
      - Only for remote servers
      - Yes, through the model
    answer: 0
    why: MCP is a protocol for connecting. Trust, vetting and permissions have to come from elsewhere.
---
Before MCP, every app wired up every tool its own way. Ten agents and ten tools could mean a hundred custom connections.
===
The **Model Context Protocol** (MCP), released by Anthropic in late 2024, is an open standard for connecting agents to tools. Think of it as a universal cartridge slot.
===
An **MCP server** wraps a system, like GitHub or a database, and offers its tools in a standard format. An **MCP client** inside the agent's app connects to it.
===
Servers can offer **tools** (actions), **resources** (data to read) and **prompts** (templates). They run locally on your machine or remotely over the network.
===
Build a server once and any MCP-compatible agent can use it. By late 2025 there were over 10,000 public MCP servers, which is great for choice and hard for keeping track.
=== deeper
MCP messages use JSON-RPC. Local servers usually talk over stdio, started by the agent's app as a process; remote ones use Streamable HTTP, with OAuth for authorization. MCP doesn't decide whether a server is trustworthy or what each user may call. That job falls to the tools around it, which is where World 6 comes in. In December 2025 Anthropic gave MCP to the new Agentic AI Foundation, under the Linux Foundation.
