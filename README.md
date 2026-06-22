# ProductPulse Fullstack

[简体中文](#简体中文) | [English](#english)

ProductPulse is a portfolio-ready full-stack product feedback intelligence app. It combines a React dashboard, Express REST API, local JSON persistence, roadmap scoring, runtime observability, and automated tests.

> Resume and interview brief: [PORTFOLIO.md](PORTFOLIO.md)
> Enterprise architecture: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)

---

## 简体中文

### 项目亮点

- **完整产品反馈闭环**：新增反馈、搜索筛选、状态流转、负责人过滤、CSV 导出都可以在 UI 内完成。
- **真实全栈结构**：React 19 + Vite 前端，Express REST API 后端，文件型 JSON 数据层。
- **可解释 roadmap 评分**：机会分 = `impact * 12 / effort`，高影响、低成本事项自然排在前面。
- **工程化 API 层**：统一异步路由包装、结构化错误响应、404 处理、请求 ID 追踪和安全响应头。
- **运行时观测**：`/api/metrics/runtime` 暴露请求数、状态码分布、错误数和服务启动时间。
- **无需数据库即可演示**：本地自动生成 `data/productpulse.json`，克隆后可以直接运行。
- **自动化验证**：Node test 覆盖评分、创建、筛选、更新、指标统计和 API 错误响应，GitHub Actions 会跑测试与构建。

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
| `GET` | `/api/metrics/runtime` | 请求量、状态码、错误数和启动时间 |
| `GET` | `/api/feedback?status=Planned` | 按状态或负责人过滤反馈 |
| `POST` | `/api/feedback` | 创建新反馈 |
| `PATCH` | `/api/feedback/:id` | 更新状态、负责人、影响力或工作量 |

### 环境变量

复制 `.env.example` 为 `.env`，只在需要覆盖默认值时使用。

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4310` | Express 服务端口 |
| `DATA_FILE` | `./data/productpulse.json` | 本地 JSON 数据文件 |

### 作品集价值

这个项目展示了前后端分层、REST API 设计、本地持久化抽象、输入校验、结构化错误、可观测性、响应式 dashboard UI、自动化测试和 CI。

---

## English

### Highlights

- **End-to-end product workflow**: create feedback, search, filter, move items through statuses, and inspect roadmap signals.
- **Real full-stack shape**: React 19 + Vite frontend, Express REST API, and a file-backed JSON store.
- **Explainable scoring**: opportunity score = `impact * 12 / effort`, promoting high-impact, low-effort work.
- **Hardened API layer**: async route wrapper, structured errors, API 404 handling, request correlation, and security headers.
- **Runtime observability**: `/api/metrics/runtime` exposes request counts, status distribution, error counts, and service start time.
- **Database-free demo**: the app auto-seeds `data/productpulse.json`, so reviewers can run it immediately.
- **Focused verification**: tests cover scoring, create, filter, update, metrics, and API error behavior.

### Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4310`.

### Scripts

```bash
npm run dev
npm run build
npm run start
npm test
```

### Repository Topics

`fullstack`, `react`, `express`, `vite`, `dashboard`, `product-management`, `roadmap`
