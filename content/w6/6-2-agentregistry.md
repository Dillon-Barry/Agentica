---
id: 6-2
title: agentregistry
diagram: registry
terms:
  - term: agentregistry
    def: An open source registry from Solo.io that catalogs MCP servers, agents, skills, prompts and models in one versioned, searchable place.
  - term: Artifact catalog
    def: A central inventory of every AI building block an organization uses, with owners and versions.
  - term: arctl
    def: agentregistry's command-line tool for scaffolding, running, building, publishing and deploying artifacts.
sources:
  - label: agentregistry
    url: https://aregistry.ai/
  - label: Solo.io — The problems agentregistry solves
    url: https://www.solo.io/blog/understanding-the-agentregistry-project-and-the-problems-it-solves
quiz:
  - q: What does agentregistry catalog?
    options:
      - Only container images
      - Only user accounts
      - Website analytics
      - MCP servers, agents, skills, prompts and models
    answer: 3
    why: It treats every AI building block as a first-class, versioned artifact.
  - q: Which risks does a curated registry most directly reduce?
    options:
      - Supply chain attacks and sprawl
      - Slow typing
      - Model hallucination
      - Network latency
    answer: 0
    why: Only vetted, versioned items get deployed, and the catalog doubles as the inventory.
  - q: What is arctl?
    options:
      - A language model
      - agentregistry's CLI for building, publishing and deploying artifacts
      - A Kubernetes cluster
      - A firewall
    answer: 1
    why: arctl covers the whole path from a new project to a published, deployable artifact.
---
Second tool: **agentregistry**, an open source project from Solo.io. Think of it as a trusted app store for AI building blocks.
===
It catalogs **MCP servers, agents, skills, prompts and models** in one searchable, versioned place, instead of scattered across npm, PyPI, Docker Hub and GitHub.
===
Teams publish artifacts to the registry. Others discover them and pull approved versions. Every item has an owner, a version and a history.
===
That hits sprawl and supply chain risk directly. If it isn't in the registry, it doesn't get deployed. A changed tool shows up as a new version someone can review.
===
Its CLI, **arctl**, scaffolds, runs, builds and publishes artifacts, and the registry can deploy them straight to kagent.
=== deeper
agentregistry describes each kind of artifact with Kubernetes-style resource specs. Solo's enterprise edition adds approval workflows, where changes wait for an admin, role-based rules for who can publish or deploy, and discovery of agents already running elsewhere, so shadow AI can be found and brought under control. Deployed MCP servers can then sit behind agentgateway for runtime policy.
