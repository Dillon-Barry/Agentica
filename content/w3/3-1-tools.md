---
id: 3-1
title: Tools
diagram: tool-call
focus:
  - []
  - [model, app]
  - [request]
  - [model, request]
  - [app, result]
  - [model, app]
terms:
  - term: Function calling
    def: The model writing a structured request to use a tool, which your code then runs. The model never runs anything itself.
  - term: Tool definition
    def: The name, description and inputs that tell a model what a tool does and how to call it.
  - term: JSON Schema
    def: A standard way to describe the shape of data, used to define a tool's inputs so requests can be checked before running.
sources:
  - label: Anthropic — Tool use overview
    url: https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview
  - label: JSON Schema
    url: https://json-schema.org/
quiz:
  - q: When a model "calls" a tool, what actually happens?
    options:
      - The model runs the code itself
      - The model writes a structured request and your app runs it
      - The tool calls the model
      - Nothing happens until a human types it
    answer: 1
    why: The model only produces text. Your application reads the request and does the real work.
    explain:
      - "The model only writes text. It never runs code."
      - ""
      - "It's the other way round: the model asks, your app calls."
      - "The app runs the request automatically."
  - q: Which three things describe a tool to the model?
    options:
      - Name, description and inputs
      - Price, owner and date
      - Color, size and icon
      - Password, URL and port
    answer: 0
    why: The model chooses and fills in tools based purely on their name, description and input schema.
    explain:
      - ""
      - "Business details aren't in a tool definition."
      - "Looks don't matter to a model reading text."
      - "Secrets should never go in a tool description."
  - q: Why is a narrow tool like refund_order safer than run_sql?
    options:
      - It runs faster
      - It's newer
      - Models can't write SQL
      - It limits the agent to exactly what the job needs
    answer: 3
    why: A broad tool lets a confused or hijacked agent do almost anything. A narrow one caps the damage.
    explain:
      - "Speed isn't the safety benefit."
      - "Age doesn't make a tool safer."
      - "Models write SQL easily. That's exactly the risk."
      - ""
---
Bit can think and plan, but has no hands. In Cartridge Caves, Bit gets tools: cartridges that let it act on the world.
===
On its own, a model can only produce text. **Tools** let it act: search the web, query a database, send an email, run code.
===
Each tool is described to the model with a **name**, a **description** and the **inputs** it takes, like get_weather(city). That list goes into the context window.
===
When the model wants a tool, it doesn't run anything. It writes a structured request, like get_weather("Lisbon"). This is called **function calling**.
===
Your application reads that request, runs the real code, and hands the result back to the model as text. Then the loop continues.
===
So the model *chooses* actions and your code *performs* them. That gap is exactly where you can check, limit and log every action.
=== deeper
Tool inputs are usually defined with JSON Schema, so a request can be validated before anything runs. Good tools are small and specific: refund_order is far safer than run_sql. Every tool you add widens what the agent can do, for better or worse, so give each agent only the tools its job needs.
=== peek
A tool definition, as the model sees it (simplified). The model fills in the input; your code checks it against the schema, then runs it.

```json
{
  "name": "get_weather",
  "description": "Get the forecast for a city.",
  "input_schema": {
    "type": "object",
    "properties": { "city": { "type": "string" } },
    "required": ["city"]
  }
}
```
