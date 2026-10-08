import { describe, expect, it } from "vitest";
import { HEARTS, LESSONS, bossHp, bossPool, fightOrder, lessonQuestions, worldContent } from "../src/content";
import { DIAGRAMS } from "../src/diagrams";
import { CHALLENGES } from "../src/challenges";
import { wordCount } from "../src/parse";
import type { QuizQuestion } from "../src/types";
import { MAP_H, MAP_W, ROUTE, WORLDS } from "../src/worlds";
import { SEGMENTS, islandBlobs, pointAt } from "../src/map/route";
import { ART } from "../src/map/pixels";

// Keep lessons short and high level. Detail belongs in "Go deeper".
const MAX_BOX_WORDS = 70;
const MAX_DEEPER_WORDS = 100;

const planned = new Set(WORLDS.flatMap((w) => w.levels.map((l) => l.id)));

describe("curriculum", () => {
  it("has world 1 content", () => {
    expect(LESSONS.some((l) => l.world === 1)).toBe(true);
  });

  it("has unique planned level ids", () => {
    const ids = WORLDS.flatMap((w) => w.levels.map((l) => l.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses the same title on the map and in the lesson", () => {
    for (const l of LESSONS) expect(l.title, l.id).toBe(ROUTE.find((r) => r.id === l.id)!.title);
  });

  it("never defines the same Agentdex term twice", () => {
    const terms = LESSONS.flatMap((l) => l.terms.map((t) => t.term.toLowerCase()));
    expect(terms.filter((t, i) => terms.indexOf(t) !== i)).toEqual([]);
  });

  it("writes lessons in route order, so the map path never skips a gap", () => {
    const lessonStops = ROUTE.filter((l) => !l.boss && !l.challenge);
    expect(LESSONS.map((l) => l.id)).toEqual(lessonStops.slice(0, LESSONS.length).map((l) => l.id));
  });
});

describe("overworld map", () => {
  const near = (a: { x: number; y: number }, b: { x: number; y: number }, d: number) =>
    Math.abs(a.x - b.x) < d && Math.abs(a.y - b.y) < d;
  const roadPoints = SEGMENTS.map((s) => Array.from({ length: s.length + 1 }, (_, d) => pointAt(s.points, d)));

  it("keeps every stop well inside the map", () => {
    for (const l of ROUTE) {
      expect(l.x, l.id).toBeGreaterThanOrEqual(40);
      expect(l.x, l.id).toBeLessThanOrEqual(MAP_W - 40);
      expect(l.y, l.id).toBeGreaterThanOrEqual(60);
      expect(l.y, l.id).toBeLessThanOrEqual(MAP_H - 40);
    }
  });

  it("spaces stops apart", () => {
    ROUTE.forEach((a, i) => ROUTE.slice(i + 1).forEach((b) => expect(near(a, b, 40), `${a.id} vs ${b.id}`).toBe(false)));
  });

  it("joins every pair of stops with a road that turns at most once", () => {
    expect(SEGMENTS).toHaveLength(ROUTE.length - 1);
    for (const s of SEGMENTS) {
      const [a, c, b] = s.points;
      expect(a.x === c.x || a.y === c.y).toBe(true);
      expect(c.x === b.x || c.y === b.y).toBe(true);
    }
  });

  it("never runs a road through another stop", () => {
    roadPoints.forEach((pts, i) => {
      ROUTE.forEach((l, j) => {
        if (j === i || j === i + 1) return;
        expect(pts.some((p) => near(p, l, 12)), `road ${i} vs ${l.id}`).toBe(false);
      });
    });
  });

  it("never lets two roads overlap", () => {
    roadPoints.forEach((a, i) =>
      roadPoints.slice(i + 2).forEach((b, k) => {
        const hit = a.some((p) => b.some((q) => near(p, q, 6)));
        expect(hit, `road ${i} vs road ${i + 2 + k}`).toBe(false);
      }),
    );
  });

  it("keeps each world's island separate from the others", () => {
    const blobs = WORLDS.map((w) => islandBlobs(w.num));
    blobs.forEach((a, i) =>
      blobs.slice(i + 1).forEach((b, k) => {
        let gap = Infinity;
        for (const p of a) for (const q of b) gap = Math.min(gap, Math.hypot(p.x - q.x, p.y - q.y) - p.r - q.r);
        expect(gap, `world ${i + 1} vs ${i + 2 + k}`).toBeGreaterThan(10);
      }),
    );
  });

  it("draws sprites as clean rectangles", () => {
    for (const [name, rows] of Object.entries(ART)) {
      for (const row of rows) expect(row.length, name).toBe(rows[0].length);
    }
  });
});

const validQuestion = (q: QuizQuestion) => {
  expect(q.q).toBeTruthy();
  expect(q.why).toBeTruthy();
  expect(q.options.length).toBeGreaterThanOrEqual(3);
  expect(q.options.length).toBeLessThanOrEqual(4);
  expect(new Set(q.options).size).toBe(q.options.length);
  expect(Number.isInteger(q.answer)).toBe(true);
  expect(q.answer).toBeGreaterThanOrEqual(0);
  expect(q.answer).toBeLessThan(q.options.length);
};

describe("each world", () => {
  describe.each(WORLDS.map((w) => [w.name, w.num] as const))("%s", (_n, num) => {
    it("ends with a challenge stop, then a boss stop", () => {
      const stops = ROUTE.filter((l) => l.id.startsWith(`${num}-`));
      expect(stops.at(-2)?.challenge).toBe(true);
      expect(stops.at(-1)?.boss).toBe(true);
    });

    it("has a hands-on challenge", () => {
      const c = CHALLENGES[num];
      expect(c, `challenge for world ${num}`).toBeDefined();
      expect(c.intro).toBeTruthy();
      expect(c.takeaway).toBeTruthy();
    });

    it("has a short recap card for the boss", () => {
      const { recap } = worldContent(num);
      expect(recap.length).toBeGreaterThanOrEqual(3);
      expect(recap.length).toBeLessThanOrEqual(6);
      for (const r of recap) expect(wordCount(r), r).toBeLessThanOrEqual(25);
    });

    it("has well-formed scenario questions with varied answers", () => {
      const { scenarios } = worldContent(num);
      scenarios.forEach(validQuestion);
      expect(new Set(scenarios.map((q) => q.answer)).size).toBeGreaterThan(1);
    });

    it("has enough questions for a full fight, at least half of them scenarios", () => {
      // Worst case: every hit lands after HEARTS - 1 misses.
      const worst = bossHp(num) + HEARTS - 1;
      expect(bossPool(num).length).toBeGreaterThanOrEqual(worst);
      expect(worldContent(num).scenarios.length).toBeGreaterThanOrEqual(Math.ceil(worst / 2));
    });

    it("alternates scenario and recall questions in a fight", () => {
      const { scenarios } = worldContent(num);
      const order = fightOrder(scenarios, lessonQuestions(num));
      const firstHalf = order.slice(0, bossHp(num) + HEARTS - 1);
      const asScenario = firstHalf.filter((q) => scenarios.includes(q)).length;
      expect(asScenario).toBeGreaterThanOrEqual(Math.ceil(firstHalf.length / 2));
    });
  });
});

describe.each(LESSONS.map((l) => [l.id, l] as const))("lesson %s", (_id, l) => {
  it("is in the curriculum plan", () => {
    expect(planned.has(l.id)).toBe(true);
  });

  it("has a title and a known diagram", () => {
    expect(l.title).not.toBe("");
    expect(DIAGRAMS[l.diagram], `diagram "${l.diagram}"`).toBeDefined();
  });

  it("has 3-8 short dialog boxes", () => {
    expect(l.boxes.length).toBeGreaterThanOrEqual(3);
    expect(l.boxes.length).toBeLessThanOrEqual(8);
    for (const box of l.boxes) {
      expect(wordCount(box), box.slice(0, 40)).toBeLessThanOrEqual(MAX_BOX_WORDS);
    }
  });

  it("keeps the deeper section short", () => {
    if (l.deeper) expect(wordCount(l.deeper)).toBeLessThanOrEqual(MAX_DEEPER_WORDS);
  });

  it("adds 3 multiple-choice questions to its world's boss", () => {
    expect(l.quiz).toHaveLength(3);
    l.quiz.forEach(validQuestion);
  });

  it("keeps any peek to a short intro plus a code example", () => {
    if (!l.peek) return;
    expect(l.peek).toMatch(/```\w+\n[\s\S]+\n```/);
    expect(l.deeper, "a peek is shown on the Go deeper page").toBeTruthy();
  });

  it("bolds at least one of its own Agentdex terms, so it can be clicked", () => {
    const text = l.boxes.join("\n").toLowerCase();
    const bolded = l.terms.some((t) => {
      const k = t.term.toLowerCase();
      return text.includes(`**${k}**`) || text.includes(`**${k}s**`);
    });
    expect(bolded, l.terms.map((t) => t.term).join(", ")).toBe(true);
  });

  it("doesn't put every correct answer in the same slot", () => {
    expect(new Set(l.quiz.map((q) => q.answer)).size).toBeGreaterThan(1);
  });

  it("defines its Agentdex terms", () => {
    expect(l.terms.length).toBeGreaterThan(0);
    for (const t of l.terms) {
      expect(t.term).toBeTruthy();
      expect(t.def).toBeTruthy();
    }
  });

  it("links sources over https", () => {
    for (const s of l.sources) {
      expect(s.label).toBeTruthy();
      expect(s.url).toMatch(/^https:\/\//);
    }
  });
});
