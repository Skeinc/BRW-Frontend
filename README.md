# BRW Frontend

Storefront for the BRW furniture store: TanStack Start (SSR), React 19, Tailwind v4, shadcn/ui, TanStack Router and Query, i18next. Plan: `../docs/BRW-dev-plan.md`. Coding rules: `CLAUDE.md`.

## Run locally

```bash
cp .env.example .env   # optional, defaults work with the API on :3000
npm ci
npm run dev            # http://localhost:8080
```

The API (`../BRW-Backend`) is not required for the stage 2 shell; later stages call it.

## Run in Docker

The `web` service lives in the backend compose file and builds this folder:

```bash
cd ../BRW-Backend
docker compose --profile web up --build   # web on :8080, api on :3000
```

## Environment

| Variable           | Where   | Meaning                                                    |
| ------------------ | ------- | ---------------------------------------------------------- |
| `PUBLIC_API_URL`   | browser | API origin without `/api` (read at runtime, not build)     |
| `API_INTERNAL_URL` | server  | API origin for SSR requests (in Compose `http://api:3000`) |
| `PUBLIC_SITE_URL`  | server  | Public origin of the site, used for canonical URLs         |
| `PORT`             | server  | Listen port, default 8080 in Docker                        |

## Scripts

| Script                                        | What it does                             |
| --------------------------------------------- | ---------------------------------------- |
| `npm run dev`                                 | Dev server with SSR                      |
| `npm run build`                               | Production build into `.output/`         |
| `npm start`                                   | Run the built Node server                |
| `npm run typecheck` / `lint` / `format:check` | Checks (also run by the pre-commit hook) |
| `npm run format` / `lint:fix`                 | Autofix                                  |

No tests in this repo by design.

## Branches

`main` is stable, `develop` is the working branch. Features: `feature/<name>` → PR into `develop`. Conventional Commits.
