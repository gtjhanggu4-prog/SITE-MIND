# K-COMOS Stage 1 Starter

Production-minded Stage 1 scaffold for Korean Commercial Development OS.

## Included
- PostgreSQL/PostGIS migrations (`db/migrations`)
- OpenAPI v1 contract (`openapi/stage1-v1.yaml`)
- FastAPI scaffold (`apps/api`)
- Next.js + Tailwind scaffold (`apps/web`)
- Shared schema contracts (`packages/schemas`)
- Contract docs + QA matrix (`docs/contracts`, `docs/qa`)
- Docker local stack (`infrastructure/docker/docker-compose.yml`)
- Demo seed SQL (`data/seed/seed_stage1.sql`)

## Local run (Docker)
```bash
cp .env.example .env
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

- API: http://localhost:8000
- API docs: http://localhost:8000/docs
- Web: http://localhost:3000

## Apply seed data
```bash
docker exec -i komos-db psql -U komos -d komos < data/seed/seed_stage1.sql
```

## Notes
- Business logic currently uses modular service stubs in `apps/api/app/services/stub_service.py`.
- Contracts and migrations are aligned with Stage 1 hardening specification.
