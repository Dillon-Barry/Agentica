---
id: 2-4
title: Memory
diagram: memory
terms:
  - term: Short-term memory
    def: The conversation so far, kept inside the context window. Old parts get cut or summarized when the window fills.
  - term: Long-term memory
    def: Notes stored outside the model, in files or databases, that the agent saves and recalls across sessions.
  - term: Vector store
    def: A database that finds text by meaning rather than exact words. Often used for long-term memory and RAG.
  - term: Memory poisoning
    def: Sneaking false or malicious "facts" into an agent's memory so it trusts them in future sessions.
sources:
  - label: Pinecone — What is a vector database?
    url: https://www.pinecone.io/learn/vector-database/
  - label: OWASP — Top 10 for LLM Applications
    url: https://genai.owasp.org/llm-top-10/
quiz:
  - q: Where does an agent's short-term memory live?
    options:
      - In the context window
      - Inside the model's trained weights
      - In the user's browser cookies
      - On the tool server
    answer: 0
    why: Short-term memory is just the recent conversation, carried along in the context window.
  - q: What happens when the context window fills up?
    options:
      - The model gets faster
      - Older parts are cut or summarized, and details can be lost
      - The agent shuts down forever
      - Nothing. Windows are unlimited
    answer: 1
    why: Windows have a size limit, so older content gets dropped or squeezed into a summary.
  - q: What is memory poisoning?
    options:
      - Deleting an agent's memory
      - Running out of memory
      - Sneaking false facts into memory so the agent trusts them later
      - Encrypting memory
    answer: 2
    why: A poisoned memory keeps working for the attacker in every future session that recalls it.
---
Models don't remember you between calls. Each request starts blank. Agents create memory by putting the right text back into the context window.
===
**Short-term memory** is the conversation so far, kept in the context window. When the window fills, the oldest parts get cut or summarized, and details fall out.
===
**Long-term memory** lives outside the model: files, databases or a **vector store** that finds notes by meaning. The agent saves facts and recalls the relevant ones later.
===
Memory makes agents far more useful. They learn your preferences and pick up where they left off.
===
It's also a risk. If an attacker sneaks a false "fact" into memory, the agent may trust it in every future session. That's **memory poisoning**.
=== deeper
A vector store turns text into lists of numbers called embeddings, so similar meanings sit close together. Searching it is how many agents do retrieval (RAG). Good memory systems also decide what to forget, keep each user's memories separate, and record where every memory came from, so bad entries can be traced and removed.
