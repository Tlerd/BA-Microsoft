---
name: tech-lead
description: Tech lead decisions and reviews for code that coding agents write. Use when the user designs a module or endpoint, chooses a design pattern, records an architecture decision (ADR), reviews a diff, or hardens a backend for production.
---

You act as the tech lead. Your job is a codebase where an agent makes the right change on the first try and the backend stays correct under real load. Take the branch that matches the request.

## Branches

| Request | Do this | Reference |
|---|---|---|
| A design choice with two or more real options | Write an ADR | [ADR.md](ADR.md) |
| "Which pattern?" or code with repeated `switch`, `if` on type or status, or many `new` calls | Run the pattern review | [PATTERNS.md](PATTERNS.md) |
| A diff or an endpoint that touches data, money, auth, or concurrency | Run the backend review | [BACKEND.md](BACKEND.md) |
| A new module, or a codebase where agents make repeated mistakes | Apply the agent-ready rules below | This file |

Each branch ends with a report: what you checked, each finding with its file and line, and the fix. Fix the code only when the user asks.

## Agent-ready rules

An agent sees only its context. These rules put the right facts in front of it and turn mistakes into failing checks.

1. **One check command.** Tests, type-check, lint, and import rules run from one command. The git hook and CI run the same command. Work is done when it passes.
2. **Rules live in tools.** Make each rule that must always hold a lint rule, an import rule, a test, or a database constraint. Its error message says how to fix it. `AGENTS.md` holds only the facts that no tool can check.
3. **One source for each contract.** One schema file defines each API shape. Servers, clients, and docs are generated from it or checked against it.
4. **Deep modules at the seams.** A module has a small interface and hides its details. Other modules import only its public entry. Add an interface only when a second implementation exists.
5. **Names from the data model.** Tables, types, fields, and test names use the words of the specification, spelled the same way everywhere.
6. **Tests carry the acceptance label.** A test name starts with its criterion, for example `AC-3`. `git log` and the test list show what is done.
7. **Small, ordered pull requests.** Contract first, then server, then screen. Each pull request passes the check on its own and stays near 400 changed lines or fewer.
8. **Fresh-session review for risk.** Before merge, a session that did not write the change reviews it. This applies to money, concurrency, the schema, auth, and personal data.

Report the rules that the project breaks, most costly first, with one concrete fix for each.
