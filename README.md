<!-- style: ste80 -->
# ba-kit

[![CI](https://github.com/Tlerd/BA-Microsoft/actions/workflows/ci.yml/badge.svg)](https://github.com/Tlerd/BA-Microsoft/actions/workflows/ci.yml)

A Claude Code plugin for requirements documents, diagrams, and plain technical English.

- **Requirements documents**: vision and scope, use cases, SRS, business rules, acceptance criteria, backlog of user stories, test plan, data dictionary.
- **Diagrams**: ten models as Mermaid, and three as tables.
- **Writing style**: 80% of the way to ASD-STE100 Simplified Technical English.
- **Checks**: a hook runs a linter each time a marked document is saved.

The plugin has no paths that point to one machine. It works in any project.

## Parts

| Part | File | Purpose |
|---|---|---|
| Skill `ste` | `skills/ste/SKILL.md` | Sentence and structure rules for English documents |
| Skill `ba-intake` | `skills/ba-intake/SKILL.md` | Interviews you about an outcome and writes an intake brief |
| Skill `ba-docs` | `skills/ba-docs/` | Writes requirements documents from outlines or from your templates |
| Skill `ba-diagrams` | `skills/ba-diagrams/` | Chooses the model and writes it in Mermaid |
| Skill `ba-review` | `skills/ba-review/SKILL.md` | Finds defects in a requirements document and reports them |
| Hook | `hooks/hooks.json` | Runs `doc-lint` after each `Write` or `Edit` of a marked file |
| `doc-lint` | `scripts/doc-lint.mjs` | Checks the countable rules. No model call, no network |
| `diagram-preview` | `scripts/diagram-preview.mjs` | Writes `<file>.diagrams.html` to show each Mermaid block, in the light or dark theme of the browser |
| `doc-text` | `scripts/doc-text.mjs` | Prints a Markdown file without inline base64 images |
| `install-agents` | `scripts/install-agents.mjs` | Installs the skills for Codex, Antigravity, and other agents. See [Other agents](#other-agents) |

Claude starts each skill by itself when the task matches. You do not type a command.

## Install

The plugin needs Claude Code and Node.js 18 or later.

Add the marketplace one time:

```bash
claude plugin marketplace add Tlerd/BA-Microsoft
```

Install the plugin in the project that holds your documents:

```bash
claude plugin install ba-kit@ba-kit --scope project
```

To try it for one session without an installation, clone the repository and start Claude Code with the folder:

```bash
claude --plugin-dir /path/to/BA-Microsoft
```

## Use

Give the task in normal words:

- "I want a page where a club member books a court. Be the business analyst."
- "Write the vision and scope document from `notes.md`."
- "Write the use case Book a Court."
- "Draw the ERD and the state diagram of a Booking."
- "Review `docs/requirements/srs.md`."
- "Rewrite this README in STE."

## Mark a document

The hook checks a Markdown file only when the file is marked. Use YAML front matter:

```
---
ba_doc: srs          # adds the requirement checks
style: ste80         # ste80 | plain
lang: en             # en | vi
req_keyword: shall   # the verb that marks a requirement
---
```

For a file where front matter does not fit, put a comment in the first five lines:

```
<!-- style: ste80 -->
```

To accept one line as it is, end that line with `<!-- lint-ok -->`.

## Checks

| Code | Check | Applies to |
|---|---|---|
| `STE-5.1`, `STE-6.3` | An instruction has more than 20 words. A descriptive sentence has more than 25 | All marked files |
| `STE-6.6` | A paragraph has more than 6 sentences | All marked files |
| `STE-8.1` | Semicolon | All marked files |
| `STE-4.2` | Contraction | All marked files |
| `DIAG-TYPE`, `DIAG-CAPTION` | A Mermaid block has no diagram type or no `Figure N.` caption | All marked files |
| `REQ-ACTIVE` | A requirement is in the passive voice | Files with `ba_doc` |
| `REQ-KEYWORD` | A labelled requirement uses `should`, `might`, `could`, `needs to` | Files with `ba_doc` |
| `REQ-SPLIT` | A requirement contains `unless`, `except`, `but` | Files with `ba_doc` |
| `REQ-ANDOR` | `and/or` | Files with `ba_doc` |
| `REQ-VAGUE` | A vague word, for example `fast` or `user-friendly` | Files with `ba_doc` |
| `REQ-ID` | A label is defined two times. In `acceptance` and `backlog` tables, only the `AC-n` or `US-n` column defines a label. A `test-plan` defines none | Files with `ba_doc` |
| `AC-DUP` | An `AC-n` label is defined two times | Files with `ba_doc: acceptance` |

With `lang: vi` the script checks sentence length, paragraph length, semicolons, and a short list of vague Vietnamese words.

Run the script by hand:

```bash
node scripts/doc-lint.mjs docs/requirements/srs.md
```

```bash
node scripts/doc-lint.mjs --as ste80 README.md
```

Test the linter itself. The tests run the script on the fixture files in `tests/fixtures`:

```bash
node --test tests/doc-lint.test.mjs
```

## Your own templates

The skill `ba-docs` uses the outlines in `skills/ba-docs/TEMPLATES.md`. To use your own templates, put them in `docs/requirements/templates/`, or name their folder in the `AGENTS.md` file of the project. Your templates then decide the headings and their order.

## Other agents

The skills follow the [Agent Skills](https://agentskills.io) format, so other agents can load them too. Those agents do not run the plugin hook. The installer gives them a copy of the skills that tells the agent to run `doc-lint` after each save. The Claude Code plugin does not change.

Clone the repository, then run the installer from the folder that must get the skills:

| Agent | Scope | Command |
|---|---|---|
| Codex, Antigravity | One project | `node <clone>/scripts/install-agents.mjs` |
| Codex | All projects | `node <clone>/scripts/install-agents.mjs --to ~/.agents` |
| Antigravity | All projects | `node <clone>/scripts/install-agents.mjs --to ~/.gemini/config` |

The installer writes the skills to `<folder>/skills/` and the scripts to `<folder>/scripts/`. The default folder is `.agents` in the current folder. Run the command again after you pull a new version.

Do not install this copy for Claude Code. Claude Code uses the plugin, and the plugin hook runs the linter for it.

## Limits

- The linter counts words, sentences, and punctuation. It does not see tenses or meaning. A document with 0 findings can still contain wrong requirements. The skill `ba-review` finds those.
- The limits for Vietnamese (28 and 35 syllables) are a choice of this tool. ASD-STE100 gives no figures for Vietnamese.
- The preview page loads Mermaid from `cdn.jsdelivr.net`, so the browser needs a connection.
- An animated arrow needs Mermaid 11.5.0 or later. The preview page has it. An older Markdown viewer shows a parse error in place of that diagram.
- This plugin is an independent aid. It does not include the ASD-STE100 dictionary and it does not certify compliance. ASD-STE100 is a trademark of ASD. The standard is free on request from asd-ste100.org.

## Decisions

### Mermaid parse check

The rule `DIAG-TYPE` only confirms that a Mermaid block starts with a diagram type. It does not parse the block. A syntax error shows only when a person opens the preview.

On 2026-10-14 the eval case `diagrams-state` ran 10 times with the plugin. Mermaid 11.17.2, the version of the preview page, parsed each diagram. 0 of 10 diagrams failed to parse.

So `doc-lint` has no parse check. It would need a package install, and the measure gives no reason for it. A sample of 10 cannot rule out a failure rate below about 26%. The script `evals/parse-mermaid.mjs` repeats the measure. Run it again after a model update or a new Mermaid version. Build the check when one diagram fails.

### MCP server

Decision on 2026-10-14: **no MCP server**. A server adds a process and its tool definitions to each session, so it must earn its place. It would earn it in only two cases:

- A tool must work where hooks and Bash are not available, such as claude.ai or Cowork.
- The plugin must keep state between sessions, such as requirement IDs and their trace to tests.

Neither case is true today:

- The skills are plain instructions and need no script. Only the `doc-lint` hook and the preview need Node. A server could add only the linter. It would not make the skills write better documents.
- Every state lives in the project documents. Labels such as `FR-12` sit in the Markdown files, and the skills read them from there.

Look at this decision again when a user needs the linter on claude.ai, or needs a trace table that is not in the documents.

## Examples

`examples/courtbook/` holds the input (`notes.md`) and the output of runs with Claude Sonnet. The output is a use case, a glossary, two diagrams, a review, acceptance criteria, a backlog, and a test plan.

## Evals

The folder `evals/` holds one case for each skill. The command `claude plugin eval` runs each case with the plugin and without it. `Δ` is the score with the plugin minus the score without it.

| Case | Skill | WITH | W/OUT | Δ |
|---|---|---|---|---|
| `intake-undecided-feature` | `ba-intake` | 1.00 | 0.67 | +0.33 |
| `docs-use-case` | `ba-docs` | 1.00 | 0.00 | +1.00 |
| `diagrams-state` | `ba-diagrams` | 1.00 | 0.75 | +0.25 |
| `review-planted-defects` | `ba-review` | 1.00 | 0.58 | +0.42 |
| `ste-rewrite` | `ste` | 1.00 | 0.75 | +0.25 |

Run date: 2026-10-14. Claude Code 2.1.296. The first three rows come from one run for each case and arm, at a list-price cost of $0.98.

In that first round the no-plugin baseline scored 1.00 on `review-planted-defects` and `ste-rewrite`, so the cases were too easy. Both cases got harder input and stricter graders. Their rows come from two runs for each arm. The harder runs cost $1.52 in all, with two earlier runs that I threw away because a grader was wrong. One or two runs are noisy, so read a small `Δ` as a hint and not as a measurement.

The no-plugin arm found all six planted defects in `review-planted-defects`. Its lower score comes from the report form that the skill `ba-review` defines: the table, the counts, and the check for a missing priority.

The case `diagrams-state` has a regular expression for common syntax slips. A regular expression cannot parse Mermaid, so [Decisions](#mermaid-parse-check) describes a real parse with `evals/parse-mermaid.mjs`.

Each case has a grader that checks if the skill started. That grader is not part of the score. Most graders are regular expressions, so they cost nothing. Only `review-planted-defects` uses a judge model.

To run the suite:

```bash
claude plugin eval . --runs 1 --no-publish --judge-model sonnet
```

Each run and each judge grader is a paid model call. Run the suite by hand and not on each push. Results go to `evals/results/`, which Git ignores.

## License

MIT. See `LICENSE`.
