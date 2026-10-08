---
id: 6-1
title: kagent
diagram: kagent
focus:
  - []
  - [cluster]
  - [cluster]
  - [agent-yaml]
  - [agent]
  - [agent, model, tools]
terms:
  - term: kagent
    def: An open source framework, created by Solo.io and now a CNCF Sandbox project, for building and running AI agents on Kubernetes.
  - term: Kubernetes
    def: The standard platform for running and managing cloud software. You describe what you want in YAML and it keeps it running.
  - term: Custom resource
    def: A new kind of Kubernetes object. kagent adds kinds like Agent and ModelConfig so agents can be managed like any other app.
  - term: CNCF
    def: Cloud Native Computing Foundation. The Linux Foundation home of Kubernetes and many related open source projects.
sources:
  - label: kagent
    url: https://kagent.dev/
  - label: kagent on GitHub
    url: https://github.com/kagent-dev/kagent
quiz:
  - q: What is kagent?
    options:
      - A model provider
      - An open source framework for running AI agents on Kubernetes
      - A browser plugin
      - A password manager
    answer: 1
    why: kagent makes agents first-class Kubernetes workloads.
    explain:
      - "kagent runs agents. Models come from providers."
      - ""
      - "It runs on Kubernetes, not in a browser."
      - "It isn't for passwords."
  - q: How do you define an agent in kagent?
    options:
      - As a Kubernetes resource in YAML, with its prompt, model and tools
      - By emailing Solo.io
      - Inside the model's weights
      - In a spreadsheet
    answer: 0
    why: The Agent resource declares everything the agent is, so it can be reviewed and versioned like code.
    explain:
      - ""
      - "It's declarative YAML, no email involved."
      - "Weights don't hold agent configuration."
      - "Agents are Kubernetes resources, not spreadsheet rows."
  - q: Why does treating agents as Kubernetes resources help?
    options:
      - It makes the model smarter
      - It removes the need for tools
      - Agents get versioning, reviews, rollouts and rollbacks like any other app
      - It hides agents from security teams
    answer: 2
    why: Agents stop being one-off scripts and become managed, visible workloads.
    explain:
      - "Kubernetes manages the agent, not the model's ability."
      - "Agents still use tools."
      - ""
      - "It makes agents more visible, not less."
---
Bit survived the Dungeon, but only just. In the Solo Citadel, Bit moves onto a platform built to keep agents in check.
===
First tool: **kagent**, an open source framework from Solo.io for running AI agents on **Kubernetes**. It's now a CNCF Sandbox project.
===
Kubernetes already runs much of the world's cloud software. kagent makes agents first-class citizens there, described in YAML like any other app.
===
You declare an **Agent** resource: its system prompt, which model it uses (a **ModelConfig**) and which MCP tools it may access. Apply it, and kagent runs it.
===
Because agents are just resources, teams get the usual benefits: keep them in Git, review changes, roll out with standard tools, and roll back fast.
===
kagent agents use MCP for tools and A2A to talk to other agents. Agents stop being scripts on someone's laptop and become managed workloads.
=== deeper
kagent ships with ready-made agents and MCP tools for cloud native work, covering Kubernetes, Istio, Helm, Argo, Prometheus and more, plus a web UI and CLI. It also runs agents built with frameworks like Google's ADK, LangChain and CrewAI. Running agents as Kubernetes workloads means they can use the cluster's existing identity, access control and network policies.
=== peek
A kagent Agent resource (simplified). Apply it with kubectl and kagent runs the agent, with only the tools listed.

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: bit
spec:
  type: Declarative
  description: Answers questions about invoices
  declarative:
    modelConfig: default-model-config
    systemMessage: |
      You help the finance team with invoices.
      Never send data outside the company.
  tools:
    - type: McpServer
      mcpServer:
        apiGroup: kagent.dev
        kind: RemoteMCPServer
        name: billing-tools
        toolNames: [read_invoices]
```
