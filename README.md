# DataDemolisher

A production-grade **FRC scouting platform scaffold** with real code for:
- API ingestion from **The Blue Alliance** and **Statbotics**
- Canonical scouting data model
- Match/pit scouting write APIs
- Match preview analytics endpoint
- Next.js web shell for dashboard, team, match, scouting, and alliance pages
- Docker Compose local stack with Postgres + Redis + API + Web

## Monorepo structure

```text
apps/
  api/       FastAPI backend
  web/       Next.js frontend
  worker/    background task stubs
infra/
  sql/       starter SQL schema
packages/
  data-contracts/ JSON schema contracts
```

## Quick start

1. Copy env values if needed and set your TBA API key:

```bash
cp .env.example .env
```

2. Start everything:

```bash
docker compose up --build
```

3. Open:
- API docs: `http://localhost:8000/docs`
- Web app: `http://localhost:3000`

## Implemented API endpoints

- `GET /health`
- `GET /events`
- `GET /events/{event_key}`
- `GET /events/{event_key}/matches`
- `POST /events/{event_key}/refresh`
- `GET /teams/{team_number}`
- `GET /teams/{team_number}/event/{event_key}`
- `POST /scouting/pit`
- `POST /scouting/match`
- `GET /analytics/match/{match_key}/preview`
- `GET /analytics/event/{event_key}/predictions`
- `POST /pipelines/run/{pipeline_key}`
- `GET /picklists/active?eventKey=...`

## Notes

- This is a substantial foundation and runnable scaffold.
- Next steps to reach full production parity:
  - offline-first client sync queue + conflict UX,
  - robust auth/RBAC integration,
  - full Alteryx run orchestration callbacks,
  - model training pipeline and calibration jobs,
  - comprehensive test suite + migration automation.
