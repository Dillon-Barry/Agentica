import { describe, expect, it } from "vitest";
import { LESSONS, lessonMinutes, worldMinutes } from "../src/content";
import { INDEX, plain, search, termSlug } from "../src/search";
import { canSkipTo, clearWorld, isCleared, isOnPath, isUnlocked, markCleared, resetProgress, setStudyMode } from "../src/progress";
import { ROUTE, WORLDS, bossId } from "../src/worlds";

describe("search", () => {
  it("indexes every lesson, term, challenge and boss", () => {
    const terms = LESSONS.reduce((n, l) => n + l.terms.length, 0);
    expect(INDEX.length).toBe(LESSONS.length + terms + WORLDS.length * 2);
  });

  it("puts a term's own entry first for a term lookup", () => {
    expect(search("lethal trifecta")[0]).toMatchObject({ kind: "term", title: "Lethal trifecta" });
  });

  it("needs every word to match", () => {
    expect(search("mcp zzzz")).toEqual([]);
    expect(search("   ")).toEqual([]);
  });

  it("links terms to their Agentdex entry", () => {
    expect(termSlug("MCP server")).toBe("mcp-server");
    expect(search("mcp server").find((r) => r.kind === "term")?.path).toBe("agentdex/mcp-server");
  });

  it("makes plain text from markdown", () => {
    expect(plain("A **bold** [link](https://x.y) and `code`")).toBe("A bold link and code");
  });

  it("keeps snippets short and starting on a word", () => {
    for (const r of search("agent", 50)) {
      expect(r.snippet.length).toBeLessThanOrEqual(162);
      expect(r.snippet).not.toMatch(/^…\S*[a-z]…?$/);
    }
  });
});

describe("time estimates", () => {
  it("keeps lessons around two minutes", () => {
    for (const l of LESSONS) {
      expect(lessonMinutes(l), l.id).toBeGreaterThan(0.5);
      expect(lessonMinutes(l), l.id).toBeLessThan(3);
    }
  });

  it("gives every world a plausible total", () => {
    for (const w of WORLDS) {
      expect(worldMinutes(w.num)).toBeGreaterThanOrEqual(5);
      expect(worldMinutes(w.num)).toBeLessThanOrEqual(25);
    }
  });
});

describe("study mode and skip ahead", () => {
  const clearUpTo = (id: string) => {
    resetProgress();
    for (const l of ROUTE) {
      if (l.id === id) break;
      markCleared(l.id);
    }
  };

  it("lets you skip to the boss of the world you're in, and no further", () => {
    setStudyMode(false);
    clearUpTo("2-1");
    expect(isOnPath(bossId(2))).toBe(false);
    expect(canSkipTo(bossId(2))).toBe(true);
    expect(canSkipTo(bossId(3))).toBe(false);
    expect(canSkipTo(bossId(1))).toBe(false);
  });

  it("clears the whole world when its boss is beaten", () => {
    clearUpTo("2-1");
    clearWorld(2);
    for (const l of ROUTE.filter((r) => r.id.startsWith("2-"))) expect(isCleared(l.id), l.id).toBe(true);
    expect(isOnPath("3-1")).toBe(true);
    expect(isCleared("3-1")).toBe(false);
  });

  it("opens every stop in study mode, without clearing anything", () => {
    clearUpTo("1-1");
    expect(isUnlocked("5-1")).toBe(false);
    setStudyMode(true);
    expect(isUnlocked("5-1")).toBe(true);
    expect(isCleared("5-1")).toBe(false);
    setStudyMode(false);
  });
});
