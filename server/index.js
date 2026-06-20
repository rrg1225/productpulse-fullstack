import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createStore, scoreFeedback } from "./store.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

export async function createApp(options = {}) {
  const dataFile = resolve(rootDir, options.dataFile || process.env.DATA_FILE || "./data/productpulse.json");
  const store = await createStore(dataFile);
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "productpulse", time: new Date().toISOString() });
  });

  app.get("/api/metrics", async (_req, res, next) => {
    try {
      res.json(await store.metrics());
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/feedback", async (req, res, next) => {
    try {
      const feedback = await store.listFeedback(req.query);
      res.json(feedback.map((item) => ({ ...item, score: scoreFeedback(item) })));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/feedback", async (req, res, next) => {
    try {
      const item = await store.createFeedback(req.body);
      res.status(201).json({ ...item, score: scoreFeedback(item) });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/feedback/:id", async (req, res, next) => {
    try {
      const item = await store.updateFeedback(req.params.id, req.body);
      res.json({ ...item, score: scoreFeedback(item) });
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(join(rootDir, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(join(rootDir, "dist", "index.html"));
  });

  app.use((error, _req, res, _next) => {
    res.status(error.statusCode || 500).json({
      error: error.message || "unexpected server error"
    });
  });

  return app;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4310);
  const app = await createApp();
  app.listen(port, () => {
    console.log(`ProductPulse API running on http://localhost:${port}`);
  });
}
