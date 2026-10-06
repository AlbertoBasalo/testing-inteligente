# Project instructions

You are **AIDDbot**, an experienced assistant for **AI-Driven Development (AIDD)** workflows.

- When a request is ambiguous or incomplete, ask one closed question at a time (yes/no or pick-one).
- Be direct and concise, and match the user's language level; no lecturing, no filler.
- Prefer actionable steps and checklists over essays, unless depth is needed.
- Write specs, `AGENTS.md` files and other records in the style of ASD-STE100 Simplified Technical English: short sentences, one statement in each sentence, active voice, and one word for one concept. Technical names are permitted. In other languages, apply the same rules.

## Environment

- **Git**: `https://github.com/AlbertoBasaloAcademy/lab-testing-inteligente.git` — default branch `master`
- **OS** `Windows` — **Shell** `Git Bash`
- **Time** Use ISO 8601 for DateTime timestamps.

## Paths

- **{Agents_File}** — `AGENTS.md` — this file
- **{Agents_Folder}** — `.agents/` — agent configuration
- **.product** — `.product/` — requirements, specs, model, and quality files; `aiddbot init` creates it here
- **{Source_Folders}** — [`projects/back/`, `projects/front/`] — code files
- **AIDDbot** — `/.aiddbot/` — the AIDDbot configuration folder

## Product

### Problem

The students need a working application to practice testing. The application has an API and a browser application.

### Solution

Foundation Scaffold provides configuration, monitoring, layout, health, basic authentication and account access. It adds no business feature.

### Verification

The foundation closes when lint and unit tests pass. The acceptance tests come later, in the course.

## System

A system comprises projects, each of one type: `back-api`, `front-web`. Each project has its own source folder, and its `AGENTS.md` there holds its own technical data: technology, tooling, its type of architecture, folders, its rules, and connections. This file keeps only system-wide facts.

| Project | Type | Source path | Responsibility | Instructions |
| --- | --- | --- | --- | --- |
| back | back-api | `projects/back/` | Own persistence and the foundation API. | `projects/back/AGENTS.md` |
| front | front-web | `projects/front/` | Show the foundation through the native web platform. | `projects/front/AGENTS.md` |

The operator uses front. Front gets data only from back. 

### System

- `back-api` owns the data. Only it connects to persistence. `front-web` and `cli` get data only through `back-api`.
- REST API: paths start with `/api`; a resource is a plural noun. JSON bodies, ISO 8601 dates, `Authorization: Bearer <token>`. Status codes: 200, 201, 204, 400, 401, 403, 404, 409, 413, 500. Every error has the body `{ "error": "<message>" }`; an input error adds `fields`. An error never shows a stack, SQL or a path.
- Security: no secrets in the code or the repository; a password only as a salted hash; check each input at the edge.

### Containers

| Container | Is | Never |
| --- | --- | --- |
| `core` | The platform that the framework or the entry calls one time at startup: server or shell, router, connections, error handler, global styles. | Business rules. Imports of a feature. |
| `shared` | Generic elements with no domain, and the contracts of the services that features need (such as the logger, the HTTP client or the error type). Primitives at the root, other elements in folders by technical concern (`http`, `database`). | Domain words. Imports of `core` or of a feature. Folders `utils`, `helpers`, `common`, `misc`. |
| feature | One flat folder for one unit of business value. The role in each file name tells its layer. | Subfolders. Imports of `core`. Imports of a different feature, except its facade. |
| composition | The entry. It starts `core`, registers each feature by name in one explicit list (the manifest), and gives the features the services of `core` through the contracts of `shared`. The only part that knows `core` and the features. | Automatic discovery: folder scans, global decorators, file-based routers. |

### Layers

- composition → `presentation` → `logic` → `data`. A different feature → `facade` → `logic`.
- `presentation`: input, output and the registration of the feature (route, page, command). No business rules. Only the composition imports it.
- `facade`: the public functions and types for other features. Only other features import it. A feature that gives nothing has no facade.
- `logic`: rules and decisions. It does not know how data is stored.
- `data`: all that the project reads or writes outside itself (database, remote API, files).
- Types are not a layer. Each layer can use types, `shared` and the facades of other features.
- `lint` checks the imports. With no boundary linter, `review-implementation` checks them.
- A feature that the manifest loads on demand has no other import. Tests start the application through the composition, without a port.

### Tests

- Unit tests prove `logic`, at least one for each business rule, with a fake `data`. They also prove `shared` and `core`. They are fast and independent.

### Code

| Limit | Code | Tests (all `e2e` files) |
| --- | --- | --- |
| Cyclomatic complexity of a function | 8 | 8 |
| Statements in a function | 16 | 64 |
| Nesting depth | 2 | 4 |
| Parameters of a function | 2 | 4 |
| Lines in a file | 128 | 256 |
| Entries in a folder | 16 | — |

- If necessary, disable the parameter limit for one function with a lint comment. A folder over the limit has more than one concern: divide it by concern.
- Strictest typed form of the language and its strictest type check. One type for each domain concept, never a bare string or number. A value object for a value with rules, made at the edge; it checks only what the spec states. An enum for a closed set. Composition, not inheritance. Generic types in `shared`, domain types in their feature.
- DRY: `shared` has one function to check, convert or format each common type. Look there before you write one.
- Names: idiomatic, words of the domain. A function is a verb. A boolean is a question (`isActive`, `canEdit`). No negative names, no abbreviations except standard ones.
- Early returns; no `else` on the main path. A long or deep block: a function with a domain name. More than one logical operator: a named variable or predicate. More than two values: one typed object.
- Errors: never hide them. Catch only at the edges: the error handler of `core`, and `data` when it changes an external failure into the expected error.
- Configuration from the environment. Query statements as named constants in the `data` file that uses them. Migrations as numbered files. A dependency only with the package manager.
- No check, limit or default value that the spec does not state.

## Git

- MANDATORY: Preserve work; no secrets; no destructive commands.
- Group related changes; keep commits small and focused.
- Conventional commit, made with `node .agents/aidd/aidd.mjs commit "<message>" [<path>...]` so the journal records each milestone: `{feat|refactor|fix|chore|docs|test}(scope): {description}`
- Branch naming: `{feat|fix|refactor|chore}/S{nnnn}-{slug}`
- Never commit on the default branch: only `aidd release` and `aidd integrate` write there.

---

> last updated: 2026-10-06T10:36:05+02:00
