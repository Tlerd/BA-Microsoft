---
style: ste80
lang: vi
---

# <ID>: <slice name>

Status: draft | accepted | built
Source: <specification section, requirement labels, or user decision with date>

## Goal

One sentence: <actor> can <result>, and checks it by <observable outcome>.

## Non-goals

| Non-goal | Why it is out | When it comes back |
|---|---|---|
| <a thing a reader could expect in this slice> | <reason> | <version, milestone, or "not planned"> |

## Acceptance criteria

Each criterion has one test. The test name starts with the label, for example `AC-1`.

| Label | Given | When | Then |
|---|---|---|---|
| AC-1 | <state with real values> | <one action> | <observable result with real values> |

## Contract

The single source of the API contract, and the change it gets.

| Endpoint or schema | Change | Request | Response and errors |
|---|---|---|---|
| `POST /api/...` | new | <fields> | 201 <fields> · 409 <message> |

## Data

| Table | Change | Migration step |
|---|---|---|
| `<Table>` | <columns, constraints, indexes> | expand / migrate / contract |

## Build order

One pull request for each row. Each pull request passes the check command on its own.

| # | Pull request | Paths | Tests |
|---|---|---|---|
| 1 | Contract and schema | `<paths>` | contract tests |
| 2 | Server | `<paths>` | AC-n server tests |
| 3 | Screen | `<paths>` | AC-n screen tests |

## Edit boundaries

- May edit: `<paths>`
- Leave unchanged without approval: `<paths>`

## Risks and reviews

| Risk | Where | Control |
|---|---|---|
| <money, concurrency, schema, personal data, security> | <file or step> | <test, constraint, review in a fresh session> |

## Open questions

| Question | Owner | Blocks |
|---|---|---|
| <question> | <person> | <AC labels, or none> |

## Done when

- Every AC has a passing test with its label in the name.
- The check command passes on the last pull request.
- The reviews in "Risks and reviews" are complete.
