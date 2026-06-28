# ProductPulse Fullstack

[![CI](https://github.com/rrg1225/productpulse-fullstack/actions/workflows/ci.yml/badge.svg)](https://github.com/rrg1225/productpulse-fullstack/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-REST%20API-111827?logo=express)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

ProductPulse is a full-stack product feedback intelligence dashboard. It turns customer requests into scored roadmap opportunities with a React UI, Express API, local JSON persistence, structured errors, and runtime observability.

> Resume and interview brief: [PORTFOLIO.md](PORTFOLIO.md)
> Enterprise architecture: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)

## Product Story

Product teams often receive feedback from sales, support, and enterprise customers in different formats. ProductPulse centralizes that signal, scores it by impact and effort, and helps reviewers inspect the strongest roadmap opportunities.

## Features

- Create, filter, search, and advance product feedback items.
- Opportunity score: `impact * 12 / effort`.
- Priority tiers: Strategic, High, Medium, and Low.
- Owner and status filters plus CSV export.
- File-backed JSON store that auto-seeds local demo data.
- Structured API errors with request IDs.
- Runtime metrics and scorecard endpoints for operational visibility.
- Responsive dashboard with roadmap signal breakdowns.

## Architecture

```text
React dashboard
  -> Express REST API
  -> Store abstraction
  -> JSON persistence
```

Key modules:

| Path | Purpose |
| --- | --- |
| `src/App.jsx` | Dashboard workflow and CSV export |
| `server/index.js` | API routes and static production serving |
| `server/store.js` | Scoring, filtering, persistence, and metrics |
| `server/http.js` | Structured errors and async route handling |
| `server/runtime.js` | Request correlation and runtime metrics |

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API defaults to `http://localhost:4310`.

## Scripts

```bash
npm run dev      # start API and Vite together
npm run build    # build the React app
npm run start    # serve Express and built frontend
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health |
| `GET` | `/api/metrics` | Product feedback metrics and top opportunities |
| `GET` | `/api/metrics/runtime` | Runtime request and status metrics |
| `GET` | `/api/metrics/scorecard` | Operational readiness score and checks |
| `GET` | `/api/feedback` | List feedback with optional filters |
| `POST` | `/api/feedback` | Create feedback |
| `PATCH` | `/api/feedback/:id` | Update owner, status, impact, or effort |

## Environment

Copy `.env.example` to `.env` only when overriding defaults.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4310` | Express API port |
| `DATA_FILE` | `./data/productpulse.json` | Local JSON database path |

## Quality Gates

- `npm test` covers the feedback API with an isolated temporary data store.
- `npm run build` validates the production React bundle.
- GitHub Actions runs tests and build for pull requests and `main`.
- Local JSON data is ignored by Git, while the seed path stays reproducible.

## GitHub Readiness

This repository is built to read well in a portfolio: clear product narrative, real API boundaries, local persistence, observable runtime behavior, and a runnable demo without external services.

## Roadmap

- Add authenticated reviewer roles and approval history.
- Add database adapters for Postgres or SQLite.
- Add CSV import with validation reports for customer-success handoff.

## License

MIT

## Enterprise Readiness

This repository now includes contribution guidelines, a security policy, operational runbook notes, PR review gates, and automated readiness checks. See [docs/ENTERPRISE_READINESS.md](docs/ENTERPRISE_READINESS.md) and [docs/OPERATIONS.md](docs/OPERATIONS.md).
