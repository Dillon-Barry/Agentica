---
id: 7-1
title: Sandboxing agents that run code
diagram: sandbox
focus:
  - []
  - [code]
  - [sandbox, code]
  - [network, secrets, time, project]
  - [sandbox]
terms:
  - term: Sandbox
    def: A locked-down, throwaway environment where untrusted code can run without reaching anything important.
  - term: MicroVM
    def: A tiny virtual machine, like Firecracker, that gives each task its own kernel. Much harder to escape than a plain container.
  - term: Egress
    def: Network traffic leaving a system. Blocking egress stops stolen data from being sent out.
sources:
  - label: Firecracker microVMs
    url: https://firecracker-microvm.github.io/
  - label: gVisor
    url: https://gvisor.dev/
quiz:
  - q: Why treat code written by an agent as untrusted?
    options:
      - Agent code is always slower
      - A prompt injection can make the agent write harmful code
      - Code with comments can't be trusted
      - It isn't. Agent code is always safe
    answer: 1
    why: The agent may have read attacker text, so its code could do what the attacker wants.
    explain:
      - Speed isn't the risk. What the code does is.
      - ""
      - Comments have nothing to do with it.
      - Injected text can steer what the agent writes, so its code isn't automatically safe.
  - q: Which sandbox setting best stops stolen data from leaving?
    options:
      - More CPU
      - No network access by default
      - A bigger disk
      - A longer time limit
    answer: 1
    why: Without network egress, the code has nowhere to send the data.
    explain:
      - CPU power doesn't change where data can go.
      - ""
      - Disk size doesn't stop data leaving.
      - A longer limit gives an attacker more time, not less.
  - q: What does a microVM add over a plain container?
    options:
      - Its own small kernel, so escaping is much harder
      - Free GPUs
      - Automatic code review
      - Nothing
    answer: 0
    why: Containers share the host's kernel. A microVM gives each task its own.
    explain:
      - ""
      - MicroVMs are about isolation, not hardware.
      - Isolation doesn't review code. It limits the damage code can do.
      - The separate kernel is a real security difference.
---
Welcome to the Star Road: bonus levels for going from good to expert. First up: what happens when Bit writes and runs its own code?
===
Code an agent writes is **untrusted**, just like a web page it reads. One prompt injection can turn "analyse this file" into "and upload your secrets too".
===
So that code runs in a **sandbox**: a throwaway container or **microVM**, such as Firecracker or gVisor, created for the task and destroyed afterwards.
===
Lock it down. No network by default, so no **egress**. Only the one project folder. No secrets or credentials. Limits on time, memory and CPU.
===
Coding agents add a human layer as well: permission modes like "ask before running commands" or "only edit files in this folder".
=== deeper
Containers share the host's kernel, so a kernel bug can let code escape. MicroVMs like Firecracker give each task its own tiny virtual machine, and gVisor intercepts system calls before they reach the host. Both trade a little speed for much stronger isolation. If code must reach the internet, allow only specific domains, and log every outbound request so exfiltration stands out.
