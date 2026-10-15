# Project instructions

- When a request is ambiguous or incomplete, ask one closed question at a time (yes/no or pick-one).
- Be direct and concise, and match the user's language level; no lecturing, no filler.
- Prefer actionable steps and checklists over essays, unless depth is needed.
- Write specs, `AGENTS.md` files and other records in the style of ASD-STE100.

## Environment

- OS: `Windows` 
- Shell: `Git Bash`

### Git

- Git remote: `https://github.com/AlbertoBasaloAcademy/testing-inteligente.git.` 
— branch default: `master`
- MANDATORY: Preserve work; no secrets; no destructive commands.
- Group related changes; keep commits small and focused.
- Conventional commit `{feat|refactor|fix|chore|docs|test}(scope): {description}`

## System

Based on two projects, `back-api` and `front-web`.

### Back API
- `back-api` owns the data. Only it connects to persistence. 
- REST API: paths start with `/api`; a resource is a plural noun. JSON bodies, ISO 8601 dates, `Authorization: Bearer <token>`. Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 413, 500. Every error has the body `{ "error": "<message>" }`; an input error adds `fields`. An error never shows a stack, SQL or a path.
- Security: no secrets in the code or the repository; a password only as a salted hash; check each input at the edge.

### Front Web
- `front-web` get data only through `back-api`.
- Is a single-page application based on modern HTML, CSS and JavaScript. It uses the browser's native Web Components, and a minimal CSS framework. No framework, no library, no build step. 

## Containers
Each project has its own set of containers to group code by concern. 

### Core

- For starting the application, can not be used by any other container. 

### Features

- Can be api routes or web pages. Each solves a single business problem. 

#### Layers

Each feature follows a layered architecture, with the following layers:
- `presentation`: the user interface, either a web page or an API route. It only calls `logic`.
- `logic`: the business rules. It only calls `shared` and `data`.
- `data`: the persistence layer. It only calls `shared`.

### Shared

- Utilities shared by any feature or core.

## Tests

### Unit tests
- Unit tests prove `logic`, at least one for each business rule, with a fake `data`. They also prove `shared` and `core`. They are fast and independent.
- Written in typescript, and collocated near the code they test. They use `node:test` and no other framework or library. 

### E2E tests



### Code complexity limits

| Limit | Code | Tests (all `e2e` files) |
| --- | --- | --- |
| Cyclomatic complexity of a function | 8 | 8 |
| Statements in a function | 16 | 64 |
| Nesting depth | 2 | 4 |
| Parameters of a function | 2 | 4 |
| Lines in a file | 128 | 256 |
| Entries in a folder | 16 | — |



---

> last updated: 2026-10-06T10:36:05+02:00
