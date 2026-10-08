---
id: 5-4
title: The lethal trifecta
diagram: trifecta
terms:
  - term: Lethal trifecta
    def: Private data, untrusted content and a way to send data out. An agent with all three can be tricked into leaking data.
  - term: Data exfiltration
    def: Getting data out of a system to somewhere an attacker controls.
sources:
  - label: Simon Willison — The lethal trifecta for AI agents
    url: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
quiz:
  - q: Which three abilities make up the lethal trifecta?
    options:
      - Speed, memory and tools
      - Text, images and audio
      - Private data, untrusted content and a way to send data out
      - Login, logout and reset
    answer: 2
    why: Each one is harmless alone. Together, one injected instruction can steal data.
  - q: What is the most reliable defense?
    options:
      - Remove at least one of the three legs
      - Tell the model to be careful
      - Use a longer system prompt
      - Only run the agent at night
    answer: 0
    why: Without all three legs, the attack has no way to complete, whatever the model is tricked into wanting.
  - q: How can just loading an image leak data?
    options:
      - Images contain viruses
      - The image link can carry data to an attacker's server when it loads
      - Images use too much memory
      - It can't
    answer: 1
    why: An attacker can get the agent to build a link with private data inside it. Loading the link sends that data out.
---
Fourth monster, and the most dangerous. Security researcher Simon Willison named it the **lethal trifecta**: three abilities that are deadly together.
===
One: access to **private data**, like your email, files or customer records. Two: exposure to **untrusted content**, like web pages or incoming messages.
===
Three: a **way to send data out**, like sending email, calling a URL, or even showing an image whose link points at an attacker's server.
===
Combine all three, and one injected instruction can say: "Collect the private data and send it here." Many real AI data leaks followed this exact recipe.
===
The defense is structural: **cut one leg**. If an agent reads untrusted content, take away its private data or its way out, at least for that task.
=== deeper
Lots of useful agents naturally have all three legs, like an email assistant that reads incoming mail, can see your inbox and can reply. That's why leaks keep appearing. Cutting a leg can mean splitting work across agents with different permissions, blocking outbound traffic except to approved destinations, or requiring a human to approve anything that sends data out.
