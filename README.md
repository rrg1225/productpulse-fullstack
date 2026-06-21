# ProductPulse Fullstack

[简体中文](#简体中文) | [English](#english)

ProductPulse is a polished full-stack demo for product feedback triage. It turns scattered customer requests into scored roadmap opportunities with a React dashboard, Express REST API, JSON persistence, and automated tests.

> Resume and interview brief: [PORTFOLIO.md](PORTFOLIO.md)
> Enterprise architecture: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)

---

## 简体中文

### 项目亮点

- **完整产品闭环**：新增反馈、搜索筛选、状态推进、Roadmap 信号分析都可在 UI 中完成。
- **可交付数据流**：支持负责人筛选与 CSV 导出，方便把 demo 结果带入评审或产品会议。
- **真实全栈结构**：React 19 + Vite 前端，Express REST API 后端，文件型 JSON 数据层。
- **可解释评分模型**：机会分 = `impact * 12 / effort`，让高影响、低成本事项自然排到前面。
- **零数据库演示**：本地自动生成 `data/productpulse.json`，克隆后无需 MySQL/Postgres 即可体验。
- **测试覆盖核心逻辑**：覆盖评分、创建、过滤、更新和指标统计，适合作品集展示。

### 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:5173`。API 默认运行在 `http://localhost:4310`。

### 常用命令

```bash
npm run dev      # 同时启动 API 和 Vite
npm run build    # 构建前端
npm run start    # 启动 Express 并托管 dist
npm test         # 运行 Node 测试
```

### API 一览

| Method | Endpoint | 说明 |
| --- | --- | --- |
| `GET` | `/api/health` | 服务健康检查 |
| `GET` | `/api/metrics` | 总量、平均分、状态/客群拆解、Top 机会 |
| `GET` | `/api/feedback?status=Planned` | 按状态过滤反馈 |
| `POST` | `/api/feedback` | 创建新反馈 |
| `PATCH` | `/api/feedback/:id` | 更新状态、负责人、影响力或工作量 |

### 环境变量

复制 `.env.example` 为 `.env` 仅在需要覆盖默认值时使用。

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4310` | Express 服务端口 |
| `DATA_FILE` | `./data/productpulse.json` | 本地 JSON 数据文件 |

### 适合展示的能力

- 前后端分层与 REST API 设计
- 可维护的本地持久化抽象
- 用户输入校验与错误处理
- 响应式 dashboard UI
- 可跑通的测试与构建脚本

---

## English

### Highlights

- **End-to-end product workflow**: create feedback, search, filter, move items through statuses, and inspect roadmap signals.
- **Exportable workflow**: owner filtering and CSV export make the demo useful for review and handoff scenarios.
- **Real full-stack shape**: React 19 + Vite frontend, Express REST API, and a file-backed JSON store.
- **Explainable scoring**: opportunity score = `impact * 12 / effort`, promoting high-impact, low-effort work.
- **Database-free demo**: the app auto-seeds `data/productpulse.json`, so reviewers can run it immediately.
- **Focused tests**: scoring, create, filter, update, and metrics behavior are covered with Node tests.

### Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4310`.

### Scripts

```bash
npm run dev      # start API and Vite together
npm run build    # build the frontend
npm run start    # serve Express and built frontend
npm test         # run Node tests
```

### API Surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/metrics` | Totals, average score, breakdowns, top opportunities |
| `GET` | `/api/feedback?status=Planned` | List and filter feedback |
| `POST` | `/api/feedback` | Create feedback |
| `PATCH` | `/api/feedback/:id` | Update status, owner, impact, or effort |

### Environment

Copy `.env.example` to `.env` only when you want to override defaults.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4310` | Express server port |
| `DATA_FILE` | `./data/productpulse.json` | Local JSON database path |

### Portfolio Value

This repository demonstrates API design, local persistence, scoring logic, stateful UI workflows, validation, responsive layout, and automated verification in a compact but complete demo.

## Repository Topics

`fullstack`, `react`, `express`, `vite`, `dashboard`, `product-management`, `roadmap`
