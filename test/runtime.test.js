import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createApp } from "../server/index.js";

test("exposes runtime metrics and request correlation headers", async () => {
  const dir = await mkdtemp(join(tmpdir(), "productpulse-runtime-"));
  const app = await createApp({ dataFile: join(dir, "db.json") });
  const server = app.listen(0);

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${baseUrl}/api/health`, {
      headers: { "x-request-id": "productpulse-test" }
    });

    assert.equal(health.headers.get("x-request-id"), "productpulse-test");
    assert.equal(health.headers.get("x-frame-options"), "DENY");

    const metrics = await fetch(`${baseUrl}/api/metrics/runtime`).then((response) => response.json());
    assert.equal(metrics.service, "productpulse");
    assert.ok(metrics.requests >= 2);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
});

test("returns structured API errors with request ids", async () => {
  const dir = await mkdtemp(join(tmpdir(), "productpulse-api-errors-"));
  const app = await createApp({ dataFile: join(dir, "db.json") });
  const server = app.listen(0);

  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(`${baseUrl}/api/feedback`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "bad-feedback"
      },
      body: JSON.stringify({ title: "no" })
    });
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.error.code, "invalid_feedback");
    assert.equal(payload.error.requestId, "bad-feedback");
    assert.equal(payload.service, "productpulse");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(dir, { recursive: true, force: true });
  }
});
