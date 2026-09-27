# Habit Tracker API

A REST API for tracking daily habits and streaks, built in TypeScript on Node.js and Express 5.

**Status: in progress.** The server, middleware, and route scaffolding are wired up and running. The database layer, authentication, and test suite are what I'm building next — see [Progress](#progress) for exactly where things stand.

## About

I'm building this while working through [API Design with Node.js, v5](https://master.dev/courses/api-design-nodejs-v5/) by Scott Moss. Rather than keep it local, I'm committing the work here as it happens, so the history shows how the API came together one piece at a time.

[`API_DOCS.md`](./API_DOCS.md) is the API this is being built toward — the full endpoint set, request and response shapes, and error contracts. The [Endpoints](#endpoints) section below is what actually responds today.

## Stack

| Concern | Choice |
| --- | --- |
| Runtime | Node.js 26 (pinned via [mise](https://mise.jdx.dev/)), running TypeScript directly — no build step |
| Framework | Express 5 |
| Validation | Zod 4, at the request boundary and on environment variables |
| Database | PostgreSQL with Drizzle ORM + Drizzle Kit *(configured, schema not yet written)* |
| Auth | `jose` for JWTs, `bcrypt` for password hashing *(dependencies in place, not yet implemented)* |
| Testing | Vitest + Supertest *(configured, no tests written yet)* |
| Hardening | Helmet, CORS, Morgan request logging |

## Getting started

**Prerequisites:** Node.js 26 (`mise install` picks it up from `mise.toml`) and a PostgreSQL database.

```bash
git clone git@github.com:pcfields/habit-tracker-api.git
cd habit-tracker-api
npm install
cp .env.example .env   # then fill in the values below
npm run dev
```

The server listens on port `4000` by default. Confirm it's up:

```bash
curl http://localhost:4000/health
# {"message":"hello"}
```

### Environment variables

Validated by Zod in [`env.ts`](./env.ts) at startup — the process exits with a readable error if anything is missing or malformed, rather than failing later at the point of use.

| Variable | Required | Default | Notes |
| --- | --- | --- | --- |
| `DATABASE_URL` | yes | — | Must start with `postgresql://` |
| `JWT_SECRET` | yes | — | Minimum 32 characters |
| `APP_STAGE` | no | `dev` | `dev`, `test`, or `production`; selects which env file loads |
| `NODE_ENV` | no | `development` | `development`, `test`, or `production` |
| `PORT` | no | `4000` | |
| `JWT_EXPIRES_IN` | no | `7d` | |
| `BCRYPT_ROUNDS` | no | `12` | Must be between 10 and 20 |

`APP_STAGE=dev` loads `.env`; `APP_STAGE=test` loads `.env.test`. In production, variables are read straight from the environment.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start with `node --watch`, restarting on file changes |
| `npm start` | Start once, no watcher |
| `npm test` | Run the Vitest suite |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Run with a coverage report |

## Endpoints

What responds right now. Handlers return placeholder payloads until the database layer lands.

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/health` | Liveness check |
| `POST` | `/api/auth` | Stub |
| `POST` | `/api/user` | Stub |
| `GET` | `/api/habits` | Stub |
| `GET` | `/api/habits/:id` | Stub |
| `POST` | `/api/habits` | Validates `{ name: string }` via Zod middleware |
| `DELETE` | `/api/habits/:id` | Stub |

## Progress

- [x] Typed, fail-fast environment config with Zod
- [x] Express 5 app with Helmet, CORS, JSON/urlencoded parsing, and request logging
- [x] Route modules for auth, users, and habits, mounted under `/api`
- [x] Reusable `validateBody` middleware that turns a Zod schema into an Express handler
- [ ] Drizzle schema for users, habits, and completion entries
- [ ] Migrations and a database client
- [ ] Registration, login, and JWT-protected routes
- [ ] Habit CRUD backed by the database
- [ ] Habit completion endpoint, with one-per-day enforcement
- [ ] Streak and completion-rate statistics
- [ ] Centralized error handling
- [ ] Integration tests with Vitest and Supertest

## Notes on the approach

A few decisions worth calling out, since they're the parts I'd defend in a code review:

- **Configuration is validated once, at the boundary.** `env.ts` parses `process.env` through a Zod schema at startup and exports a typed object. Nothing downstream reads `process.env` or guards against a missing variable, and a bad value fails loudly at boot instead of quietly at 2am.
- **Validation is a factory, not a per-route chore.** `validateBody(schema)` takes a Zod schema and returns Express middleware, so each route declares its contract in one line and the 400 response shape stays identical across the API.
- **Validated data replaces the raw body.** The middleware assigns Zod's parsed output back to `req.body`, so handlers receive coerced, trusted values rather than re-checking what arrived.
- **No build step.** Node 26 executes the TypeScript directly, and `tsconfig.json` is `noEmit` — TypeScript is the type checker here, not a compiler in the runtime path.

## Credit

Built following [API Design with Node.js, v5](https://master.dev/courses/api-design-nodejs-v5/) by Scott Moss. The starter project and the target API spec come from the [course repository](https://github.com/Hendrixer/api-design-node-v5); the implementation, commit history, and notes here are my own.
