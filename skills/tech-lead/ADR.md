# Architecture decision record

Format from Michael Nygard (2011). The Azure Well-Architected Framework treats the set of records as an append-only log.

## Steps

1. **Check the need.** Write an ADR when the choice has two or more realistic options with different trade-offs and is costly to reverse. A choice with one obvious option needs no ADR.
2. **Find the next number** in `docs/adr/` (or the folder that `AGENTS.md` names). The file name is `NNNN-<slug>.md`.
3. **Write the record** with the outline below. List at least two options, the rejected ones included.
4. **Supersede, do not edit.** When a decision changes, write a new ADR and set the old one to `Superseded by NNNN`. Only the status line of an accepted ADR changes.

Done when every option has its consequences, good and bad, and the status is `Proposed` until the user accepts it.

## Outline

```markdown
# NNNN: <decision as a short phrase>

Status: Proposed | Accepted | Superseded by NNNN
Date: YYYY-MM-DD

## Context
The forces: requirements, constraints, numbers, and what makes the choice hard.

## Options
1. <option>: how it works, cost, risk.
2. <option>: how it works, cost, risk.

## Decision
The option we take, and the deciding reason.

## Consequences
What becomes easier, what becomes harder, and what we must now do.
```
