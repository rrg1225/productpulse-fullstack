# Enterprise Architecture

## Enterprise Positioning

ProductPulse is structured as a product feedback intelligence platform. The current repository is intentionally zero-infrastructure for portfolio review, but the domain boundaries map cleanly to an enterprise deployment with an API service, durable database, analytics jobs, and identity-aware product workflows.

## Architecture Boundaries

- **Frontend**: React dashboard for feedback intake, prioritization, filtering, status movement, and CSV export.
- **API layer**: Express REST API for feedback CRUD, metrics, health, and runtime metrics.
- **Domain layer**: scoring, validation, status workflow, and product prioritization rules.
- **Persistence layer**: file-backed JSON store for local demo; replaceable with PostgreSQL.
- **Reporting layer**: aggregate metrics and export-ready opportunity queues.

## Production Hardening Added

- Request correlation through `x-request-id`.
- Security headers for common browser hardening.
- Runtime metrics endpoint at `/api/metrics/runtime`.
- CI gates for tests and production build.

## Enterprise Extension Path

1. Replace JSON persistence with PostgreSQL tables for feedback, customers, segments, owners, and audit logs.
2. Add authentication and RBAC for product managers, support, executives, and read-only reviewers.
3. Add event sourcing or append-only audit history for status and scoring changes.
4. Add async ingestion from support tickets, CRM, Slack, and customer success notes.
5. Add weighted scoring models with configurable segment value, ARR impact, confidence, and effort.

## SLO and Observability

- **Availability target**: 99.9% for product and support workflows.
- **Latency target**: p95 API response under 300ms for list and metrics endpoints.
- **Data integrity target**: zero silent data loss on feedback create/update.
- **Core dashboards**: request rate, error rate, feedback creation rate, status transition rate, export usage, top segment demand.

## Security and Compliance

- Validate all mutable input at the API boundary.
- Protect customer notes as potentially sensitive business data.
- Add tenant and role checks before enterprise multi-team rollout.
- Keep export actions auditable because CSV output can leave the system boundary.

## Interview-Level Design Rationale

The important design choice is keeping product scoring in a domain layer instead of burying it in the UI. That makes prioritization explainable, testable, and replaceable when the scoring model becomes more sophisticated.
