---
id: 7-5
title: Designing good evals
diagram: evaldesign
focus:
  - [criteria]
  - [test-set]
  - [graders]
  - [path]
  - [runs]
terms:
  - term: Success criteria
    def: A precise, written definition of what "done well" means for a task, so results can be scored consistently.
  - term: Trajectory eval
    def: A test that checks the steps an agent took, such as which tools it used and in what order, not just its final answer.
  - term: pass@k
    def: The chance that at least one of k attempts succeeds. For reliability, also check how often all k succeed.
sources:
  - label: Chen et al. (2021) — Evaluating LLMs trained on code (pass@k)
    url: https://arxiv.org/abs/2107.03374
  - label: Anthropic — Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
quiz:
  - q: What should you define before building an eval?
    options:
      - The logo
      - Clear success criteria
      - The model's size
      - The number of servers
    answer: 1
    why: Without a precise definition of "done well", scores mean nothing.
    explain:
      - Branding doesn't affect quality.
      - ""
      - Size is a design choice, not a definition of success.
      - Infrastructure isn't what you're measuring.
  - q: What does a trajectory eval check?
    options:
      - Only the final answer
      - The steps and tools the agent used along the way
      - Network speed
      - The user's password
    answer: 1
    why: An agent can reach a right answer by a risky or wasteful path. Trajectory evals catch that.
    explain:
      - Checking only the answer misses risky or wasteful paths.
      - ""
      - Speed is a different measurement.
      - Evals never need user passwords.
  - q: Where should new eval cases come from?
    options:
      - Real tasks, edge cases, known attacks and production bugs
      - Only made-up easy examples
      - Nowhere. One test is enough
      - Whatever the model writes, unchecked
    answer: 0
    why: Realistic, varied cases find real problems. Every production bug becomes a test.
    explain:
      - ""
      - Easy examples hide the cases where agents actually fail.
      - Agents vary run to run. One test proves almost nothing.
      - Unchecked, model-written tests can share the model's blind spots.
---
You met evals in the Guild Hall. Designing good ones is a skill of its own, and it starts with **success criteria**: what does "done well" mean, exactly?
===
Build the test set from real tasks, plus edge cases and known attacks. Add every bug you find in production, so it can never return unnoticed.
===
Grade with code where you can (exact answers, valid JSON), with a model judge where you need judgement, and with people to check the judge.
===
Check the path, not just the answer. A **trajectory eval** asks: did Bit use the right tools, in a sensible order, without risky detours?
===
Run each case several times, because agents vary. Measure how often they succeed, such as **pass@k**, and for reliability, whether all k tries pass.
=== deeper
Watch out for evals that only test the happy path, or that leak into prompts until the agent "learns the test". Model judges have biases, such as preferring longer answers, so compare them with human ratings. Keep a small, fast suite that runs on every change, and a bigger one before each release.
