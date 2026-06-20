import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createStore, scoreFeedback } from "../server/store.js";

test("scores high-impact low-effort feedback above low-impact items", () => {
  assert.ok(scoreFeedback({ impact: 9, effort: 3 }) > scoreFeedback({ impact: 4, effort: 8 }));
});

test("creates and filters feedback", async () => {
  const dir = await mkdtemp(join(tmpdir(), "productpulse-"));
  try {
    const store = await createStore(join(dir, "db.json"));
    const created = await store.createFeedback({
      title: "Add audit log export",
      segment: "Enterprise",
      owner: "Security",
      status: "Planned",
      impact: 8,
      effort: 4
    });

    assert.equal(created.status, "Planned");
    const planned = await store.listFeedback({ status: "Planned" });
    assert.ok(planned.some((item) => item.title === "Add audit log export"));

    const metrics = await store.metrics();
    assert.ok(metrics.total >= 5);
    assert.ok(metrics.averageScore > 0);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
