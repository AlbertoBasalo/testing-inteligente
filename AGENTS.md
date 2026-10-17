# Project instructions

- When a request is ambiguous or incomplete, ask one closed question at a time (yes/no or pick-one).
- Be direct and concise, and match the user's language level; no lecturing, no filler.
- Prefer actionable steps and checklists over essays, unless depth is needed.
- Write specs, `AGENTS.md` files and other records in the style of ASD-STE100.

## Environment

- OS: `Windows` 
- Shell: `Git Bash`

### Git

- Git remote: `https://github.com/AlbertoBasaloAcademy/testing-inteligente.git`
- Default branch: `master`
- MANDATORY: Preserve work; no secrets; no destructive commands.
- Group related changes; keep commits small and focused.
- Conventional commit `{feat|refactor|fix|chore|docs|test}(scope): {description}`

## System

Based on two projects, a backend REST API in `projects/back` and a frontend web application in `projects/front`.

### Back API
- `projects/back` owns the data. Only it connects to persistence. 
- REST API: paths start with `/api`; a resource is a plural noun. JSON bodies, ISO 8601 dates, `Authorization: Bearer <token>`. Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 413, 500. Every error has the body `{ "error": "<message>" }`; an input error adds `fields`. An error never shows a stack, SQL or a path.
- Security: no secrets in the code or the repository; a password only as a salted hash; check each input at the edge.

### Front Web
- `projects/front` get data only through `projects/back`.
- Is a single-page application based on modern HTML, CSS and JavaScript. It uses the browser's native Web Components, and a minimal CSS framework. Vite serves it. No UI framework, no UI library.

## Tooling (Vite+)

- The root, `projects/back`, `projects/front` and `e2e/` use Vite+ (`vp`). The root `package.json` has `"type": "module"`.
- The root `vite.config.ts` holds the shared configuration: `lint` (Oxlint, typeAware, typeCheck), `fmt` (Oxfmt), `staged` and `test.projects`.
- Each project has a local `vite.config.ts` with a unique `test.name` (`back`, `front`) and `test.include`.
- To format, lint and check the types, use `vp check` (`vp check --fix` to fix). Do not add a separate `tsc` check, except `npm run typecheck` in `e2e/`.
- To run all the unit tests, use `npm test` (`vp test --run`) in the root folder. It runs `projects/*` only, not the e2e tests.
- The pre-commit hook (`.vite-hooks/pre-commit`) runs `vp staged`: `vp check --fix` on all staged files and `vp test related --run` on staged `.ts` files. A failure stops the commit.

## Tests

### Unit tests
- Unit tests prove `logic`, at least one for each business rule, with a fake `data`. They also prove `shared` and `core`. They are fast and independent.
- Written in TypeScript, and collocated near the code they test. They use Vitest through `vite-plus/test` (`expect`, `test`, `vi`) and no other framework or library. To run them, use `npm test` in the root folder or in the project folder.

### E2E tests

- The e2e tests are in `e2e/`. They use Playwright with TypeScript and the `chromium` project only.
- To run the tests, use `npm run test:e2e` in the root folder, or `npm test` in `e2e/`. To check the types, use `npm run typecheck` in `e2e/`.
- `npm run test:e2e` starts the back and the front. Before it starts the back, it empties the database.
- Do not use `vp test` for the e2e tests. Vitest cannot run Playwright specs.
- If the back and the front run already (`npm start` in the root folder), the tests use them. Then the database is not emptied. To empty it, stop the servers and use `npm run reset` in the root folder.
- Put each test in `e2e/tests/<name>.spec.ts`.
- The front URL is `http://localhost:4000`. Use `BASE_URL` to change it. Use relative paths in `page.goto()`, for example `page.goto('/')`.
- The back URL is `http://localhost:3000`. Use `API_URL` to change it. It must be equal to `API_BASE_URL` of the front.
- `e2e/core/` holds the shared setup: `env.ts` (URLs), `global-setup.ts` (checks and seed) and `seed-data.ts`.
- For data that a scenario must find before it starts (a `setup` in the spec), add it to `e2e/core/seed-data.ts`. For all other data, use unique values.
- Find elements by role and accessible name, for example `getByRole('button', { name: 'Register' })`.
- When a test comes from a spec in `specs/`, do these steps:
  - Write the spec path in a comment: `// Spec: specs/<name>.spec.yaml`.
  - Use the requirement ID and title in `test.describe()`, for example `R0001 Register a user with valid data`.
  - Use the scenario ID and name in `test()`, for example `S001 Successful registration`.
  - Write `// GIVEN`, `// WHEN` and `// THEN` comments for the steps.
- Make each test independent. Use unique data, for example an email with `Date.now()`.

### Code complexity limits

No tool checks these limits. Review them manually.

| Limit | Code | Tests (all `e2e` files) |
| --- | --- | --- |
| Cyclomatic complexity of a function | 8 | 8 |
| Statements in a function | 16 | 64 |
| Nesting depth | 2 | 4 |
| Parameters of a function | 2 | 4 |
| Lines in a file | 128 | 256 |
| Entries in a folder | 16 | — |

---

> last updated: 2026-10-17
