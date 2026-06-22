import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createStore, enrichFeedback } from "./store.js";
import { createRuntimeState, installRuntimeControls, runtimeMetrics } from "./runtime.js";
import { asyncRoute, errorHandler, notFound, requireObjectBody } from "./http.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

export async function createApp(options = {}) {
  const dataFile = resolve(rootDir, options.dataFile || process.env.DATA_FILE || "./data/productpulse.json");
  const store = await createStore(dataFile);
  const app = express();
  const runtime = createRuntimeState("productpulse");

  installRuntimeControls(app, runtime);
  app.use(cors());
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "productpulse", time: new Date().toISOString() });
  });

  app.get("/api/metrics", asyncRoute(async (_req, res) => {
    res.json(await store.metrics());
  }));

  app.get("/api/metrics/runtime", (_req, res) => {
    res.json(runtimeMetrics(runtime));
  });

  app.get("/api/feedback", asyncRoute(async (req, res) => {
    const feedback = await store.listFeedback(req.query);
    res.json(feedback.map(enrichFeedback));
  }));

  app.post("/api/feedback", asyncRoute(async (req, res) => {
    const item = await store.createFeedback(requireObjectBody(req.body));
    res.status(201).json(enrichFeedback(item));
  }));

  app.patch("/api/feedback/:id", asyncRoute(async (req, res) => {
    const item = await store.updateFeedback(req.params.id, requireObjectBody(req.body));
    res.json(enrichFeedback(item));
  }));

  app.use("/api", notFound);

  app.use(express.static(join(rootDir, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(join(rootDir, "dist", "index.html"));
  });

  app.use(errorHandler("productpulse"));

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4310);
  const app = await createApp();
  app.listen(port, () => {
    console.log(`ProductPulse API running on http://localhost:${port}`);
  });
}
