---
id: 6-1
title: kagent
diagram: kagent
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
  - q: How do you define an agent in kagent?
    options:
      - As a Kubernetes resource in YAML, with its prompt, model and tools
      - By emailing Solo.io
      - Inside the model's weights
      - In a spreadsheet
    answer: 0
    why: The Agent resource declares everything the agent is, so it can be reviewed and versioned like code.
  - q: Why does treating agents as Kubernetes resources help?
    options:
      - It makes the model smarter
      - It removes the need for tools
      - Agents get versioning, reviews, rollouts and rollbacks like any other app
      - It hides agents from security teams
    answer: 2
    why: Agents stop being one-off scripts and become managed, visible workloads.
---
Welcome to the Solo Citadel. First tool: **kagent**, an open source framework from Solo.io for running AI agents on **Kubernetes**. It's now a CNCF Sandbox project.
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
