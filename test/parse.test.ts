import { describe, expect, it } from "vitest";
import { parseLesson, wordCount } from "../src/parse";

const lesson = (body: string, meta = "id: 2-3\ntitle: Memory\ndiagram: mem") =>
  `---\n${meta}\n---\n${body}`;

describe("parseLesson", () => {
  it("splits boxes on === and reads the deeper section", () => {
    const l = parseLesson(lesson("One.\n===\nTwo **bold**.\n=== deeper\nMore."));
    expect(l.id).toBe("2-3");
    expect(l.world).toBe(2);
    expect(l.order).toBe(3);
    expect(l.title).toBe("Memory");
    expect(l.boxes).toEqual(["One.", "Two **bold**."]);
    expect(l.deeper).toBe("More.");
  });

  it("handles Windows line endings", () => {
    const l = parseLesson(lesson("A\n===\nB").replace(/\n/g, "\r\n"));
    expect(l.boxes).toEqual(["A", "B"]);
  });

  it("works without a deeper section and defaults lists", () => {
    const l = parseLesson(lesson("Only box."));
    expect(l.boxes).toEqual(["Only box."]);
    expect(l.deeper).toBeUndefined();
    expect(l.quiz).toEqual([]);
    expect(l.terms).toEqual([]);
  });

  it("rejects missing frontmatter", () => {
    expect(() => parseLesson("no frontmatter", "x.md")).toThrow(/frontmatter/);
  });

  it("rejects malformed ids", () => {
    expect(() => parseLesson(lesson("A", "id: one"))).toThrow(/id/);
  });

  it("requires deeper to be last", () => {
    expect(() => parseLesson(lesson("A\n=== deeper\nB\n===\nC"))).toThrow(/last/);
  });
});

describe("wordCount", () => {
  it("ignores markdown symbols", () => {
    expect(wordCount("**Bold** and *em* [link](x)")).toBe(5);
  });
});
