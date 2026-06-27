import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createApp } from "../server/index.js";

async function startServer(dataFile) {
  const app = await createApp({ dataFile });
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

test("creates feedback and returns scored roadmap data", async (t) => {
  const tempDir = await mkdtemp(join(tmpdir(), "productpulse-"));
  t.after(() => rm(tempDir, { recursive: true, force: true }));

  const { server, baseUrl } = await startServer(join(tempDir, "data.json"));
  t.after(() => server.close());

  const created = await fetch(`${baseUrl}/api/feedback`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: "Enterprise SSO audit logging",
      segment: "Enterprise",
      owner: "Platform",
      impact: 9,
      effort: 3
    })
  });
  assert.equal(created.status, 201);
  const item = await created.json();
  assert.equal(item.priority, "Strategic");

  const metrics = await fetch(`${baseUrl}/api/metrics`);
  assert.equal(metrics.status, 200);
  assert.ok((await metrics.json()).total >= 1);

  const filtered = await fetch(`${baseUrl}/api/feedback?q=sso`);
  assert.equal(filtered.status, 200);
  const results = await filtered.json();
  assert.equal(results.length, 1);
  assert.match(results[0].title, /SSO/);
});
