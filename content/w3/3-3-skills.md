---
id: 3-3
title: Skills
diagram: skills
terms:
  - term: Skill
    def: A packaged set of instructions, and sometimes scripts and files, that teaches an agent how to do a specific kind of task. Loaded only when needed.
  - term: Progressive disclosure
    def: Showing the model only a short summary of each skill up front, and loading the full details only when a task needs them.
sources:
  - label: Agent Skills specification
    url: https://agentskills.io/
  - label: The New Stack — Agent Skills as an open standard
    url: https://thenewstack.io/agent-skills-anthropics-next-bid-to-define-ai-standards/
quiz:
  - q: What is a skill?
    options:
      - A faster model
      - A packaged set of instructions that teaches an agent how to do a kind of task
      - A password for a tool
      - Another word for an MCP server
    answer: 1
    why: A tool gives an agent a new action. A skill gives it know-how about doing a job well.
  - q: Why does an agent only see each skill's name and description at first?
    options:
      - To keep the context window small until a skill is actually needed
      - Because the rest is secret
      - Skills have no other content
      - To make the agent slower
    answer: 0
    why: Loading every skill in full would waste context. Progressive disclosure keeps it lean.
  - q: What's the security catch with skills?
    options:
      - There isn't one
      - Skills can't contain text
      - A skill is instructions the agent will follow, so it should come from a source you trust
      - Skills only run on weekends
    answer: 2
    why: Like a tool description, a skill is text the model treats as guidance. An untrusted skill is an injection waiting to happen.
---
Tools give Bit new actions. But knowing *how* to do a job well is different. That's where **skills** come in.
===
A skill is a small package of know-how: a SKILL.md file of instructions, sometimes with scripts or reference files. "How we write release notes." "How to fill in this expense form."
===
Skills use **progressive disclosure**. The agent sees only each skill's name and description at first, then loads the full instructions when a task needs them.
===
Skills, tools and MCP fit together. MCP connects Bit to systems. Tools are the actions. Skills are the playbooks for using them well.
===
Agent Skills became an open standard in December 2025, used by many agent apps. And like tool labels, skills are instructions the model follows, so where they come from matters.
=== deeper
Because skills are just folders of text and scripts, they're easy to write, share and version, which is exactly why they need the same care as any other dependency. A skill that runs a script is running code on your behalf. That's one reason agentregistry, in World 6, catalogs skills alongside MCP servers and agents.
=== peek
A minimal SKILL.md. The frontmatter is what the agent sees up front; the rest loads only when the skill is used.

```markdown
---
name: release-notes
description: Write release notes in our house style. Use when asked to summarise a release.
---
# Release notes

1. List user-facing changes first, grouped by feature.
2. One line per change, starting with a verb.
3. Link each change to its pull request.
```
