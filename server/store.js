import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { seedData } from "./seed.js";

const VALID_STATUSES = new Set(["Backlog", "Planned", "In Progress", "Done"]);

export function scoreFeedback(item) {
  const impact = Number(item.impact) || 0;
  const effort = Math.max(Number(item.effort) || 1, 1);
  return Math.round((impact * 12) / effort);
}

export async function createStore(filePath) {
  async function ensureFile() {
    await mkdir(dirname(filePath), { recursive: true });
    try {
      await readFile(filePath, "utf8");
    } catch {
      await writeFile(filePath, JSON.stringify(seedData, null, 2));
    }
  }

  async function read() {
    await ensureFile();
    return JSON.parse(await readFile(filePath, "utf8"));
  }

  async function write(data) {
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(data, null, 2));
    return data;
  }

  return {
    async listFeedback(filters = {}) {
      const data = await read();
      return data.feedback
        .filter((item) => !filters.status || item.status === filters.status)
        .filter((item) => !filters.owner || item.owner === filters.owner)
        .sort((a, b) => scoreFeedback(b) - scoreFeedback(a));
    },

    async createFeedback(input) {
      const title = String(input.title || "").trim();
      if (title.length < 4) {
        const error = new Error("title must be at least 4 characters");
        error.statusCode = 400;
        throw error;
      }

      const item = {
        id: randomUUID(),
        title,
        segment: String(input.segment || "Self Serve").trim(),
        owner: String(input.owner || "Product").trim(),
        impact: clampNumber(input.impact, 1, 10, 5),
        effort: clampNumber(input.effort, 1, 10, 3),
        status: VALID_STATUSES.has(input.status) ? input.status : "Backlog",
        createdAt: new Date().toISOString(),
        notes: String(input.notes || "").trim()
      };

      const data = await read();
      data.feedback.push(item);
      await write(data);
      return item;
    },

    async updateFeedback(id, patch) {
      const data = await read();
      const item = data.feedback.find((entry) => entry.id === id);
      if (!item) {
        const error = new Error("feedback item not found");
        error.statusCode = 404;
        throw error;
      }

      if (patch.status && VALID_STATUSES.has(patch.status)) item.status = patch.status;
      if (patch.owner) item.owner = String(patch.owner).trim();
      if (patch.impact) item.impact = clampNumber(patch.impact, 1, 10, item.impact);
      if (patch.effort) item.effort = clampNumber(patch.effort, 1, 10, item.effort);

      await write(data);
      return item;
    },

    async metrics() {
      const data = await read();
      const feedback = data.feedback;
      const scoreTotal = feedback.reduce((sum, item) => sum + scoreFeedback(item), 0);
      return {
        total: feedback.length,
        averageScore: feedback.length ? Math.round(scoreTotal / feedback.length) : 0,
        byStatus: groupCount(feedback, "status"),
        bySegment: groupCount(feedback, "segment"),
        topOpportunities: feedback
          .slice()
          .sort((a, b) => scoreFeedback(b) - scoreFeedback(a))
          .slice(0, 3)
          .map((item) => ({ ...item, score: scoreFeedback(item) }))
      };
    }
  };
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(Math.max(Math.round(number), min), max);
}

function groupCount(items, field) {
  return items.reduce((result, item) => {
    result[item[field]] = (result[item[field]] || 0) + 1;
    return result;
  }, {});
}
