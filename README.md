<!-- style: ste80 -->
# ba-kit

A Claude Code plugin for requirements documents, diagrams, and plain technical English.

- **Requirements documents**: vision and scope, use cases, SRS, business rules, data dictionary.
- **Diagrams**: ten models as Mermaid, and three as tables.
- **Writing style**: 80% of the way to ASD-STE100 Simplified Technical English.
- **Checks**: a hook runs a linter each time a marked document is saved.

The plugin has no paths that point to one machine. It works in any project.

## Parts

| Part | File | Purpose |
|---|---|---|
| Skill `ste` | `skills/ste/SKILL.md` | Sentence and structure rules for English documents |
| Skill `ba-docs` | `skills/ba-docs/` | Writes requirements documents from outlines or from your templates |
| Skill `ba-diagrams` | `skills/ba-diagrams/` | Chooses the model and writes it in Mermaid |
| Skill `ba-review` | `skills/ba-review/SKILL.md` | Finds defects in a requirements document and reports them |
| Hook | `hooks/hooks.json` | Runs `doc-lint` after each `Write` or `Edit` of a marked file |
| `doc-lint` | `scripts/doc-lint.mjs` | Checks the countable rules. No model call, no network |
| `diagram-preview` | `scripts/diagram-preview.mjs` | Writes `<file>.diagrams.html` to show each Mermaid block |
| `doc-text` | `scripts/doc-text.mjs` | Prints a Markdown file without inline base64 images |

Claude starts each skill by itself when the task matches. You do not type a command.

## Install

The plugin needs Claude Code and Node.js 18 or later.

Add the marketplace one time:

```bash
claude plugin marketplace add Tlerd/BA-Mircosoft
```

Install the plugin in the project that holds your documents:

```bash
claude plugin install ba-kit@ba-kit --scope project
```

To try it for one session without an installation, clone the repository and start Claude Code with the folder:

```bash
claude --plugin-dir /path/to/BA-Mircosoft
```

## Use

Give the task in normal words:

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
| `REQ-ID` | A label is defined two times | Files with `ba_doc` |

With `lang: vi` the script checks sentence length, paragraph length, semicolons, and a short list of vague Vietnamese words.

Run the script by hand:

```bash
node scripts/doc-lint.mjs docs/requirements/srs.md
```

```bash
node scripts/doc-lint.mjs --as ste80 README.md
```

## Your own templates

The skill `ba-docs` uses the outlines in `skills/ba-docs/TEMPLATES.md`. To use your own templates, put them in `docs/requirements/templates/`, or name their folder in the `AGENTS.md` file of the project. Your templates then decide the headings and their order.

## Other agents

Codex and other agents do not load Claude Code plugins. They can read the skill files and run the scripts. Add these lines to the `AGENTS.md` file of the project, with the path of your clone:

```markdown
## Requirements documents

- Requirements documents are in `docs/requirements/`. Before you write one, read `<clone>/skills/ba-docs/SKILL.md` and follow it.
- After each change to a document, run `node <clone>/scripts/doc-lint.mjs <file>` and fix each finding.
```

## Limits

- The linter counts words, sentences, and punctuation. It does not see tenses or meaning. A document with 0 findings can still contain wrong requirements. The skill `ba-review` finds those.
- The limits for Vietnamese (28 and 35 syllables) are a choice of this tool. ASD-STE100 gives no figures for Vietnamese.
- The preview page loads Mermaid from `cdn.jsdelivr.net`, so the browser needs a connection.
- This plugin is an independent aid. It does not include the ASD-STE100 dictionary and it does not certify compliance. ASD-STE100 is a trademark of ASD. The standard is free on request from asd-ste100.org.

## Examples

`examples/courtbook/` holds the input (`notes.md`) and the output of three runs with Claude Sonnet: a use case, a glossary, two diagrams, and a review.
