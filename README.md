# ProductPulse Fullstack

ProductPulse is a full-stack product feedback intelligence dashboard. It turns customer requests into scored roadmap opportunities with a React UI, Express REST API, JSON persistence, and automated tests.

## Highlights

- React 19 + Vite dashboard with responsive product analytics UI.
- Express API for feedback creation, filtering, scoring, and metrics.
- File-backed JSON persistence for zero-database local demos.
- Opportunity score based on impact versus effort.
- Smoke tests for scoring and storage behavior.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4310`.

## Scripts

```bash
npm run dev      # start API and Vite together
npm run build    # build the frontend
npm run start    # serve the API and built frontend
npm test         # run Node test suite
```

## Environment

Copy `.env.example` to `.env` only if you want to override defaults.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4310` | Express server port |
| `DATA_FILE` | `./data/productpulse.json` | Local JSON database path |

## Repository Topics

`fullstack`, `react`, `express`, `vite`, `dashboard`, `product-management`, `roadmap`
