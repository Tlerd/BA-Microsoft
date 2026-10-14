---
name: ba-docs
description: Requirements documents for a software product. Use when writing or extending a vision and scope document, use cases, an SRS, business rules, acceptance criteria, a backlog of user stories, a test plan, screen specifications, a data dictionary, a glossary, or a risk list.
---

The method follows mainstream requirements engineering practice (Wiegers and Beatty, *Software Requirements*, 3rd edition): business requirements first, then user requirements, then functional requirements, each traced to the one before.

## Format authority

1. **The project's own templates.** If `AGENTS.md` names a template folder, or `docs/requirements/templates/` exists, those templates decide headings and order. Read the template and any worked example beside it in full.
2. **Otherwise** the outlines in [`TEMPLATES.md`](TEMPLATES.md). Read the outline for the document you write.

A template exported from Word can carry inline base64 images. Read such a file through the script, which prints the text only:

```
node "<this skill's folder>/../../scripts/doc-text.mjs" "<file.md>"
```

## Steps

1. **Read the format authority** for the document type.

2. **Collect the facts.** Read the requirements folder first: each document builds on the one before it (vision and scope → use cases and business rules → SRS → data dictionary → acceptance criteria → backlog → test plan). List every section that the sources cannot fill. Ask the user for those facts in one message. A fact that nobody has yet is written as `TBD` with the name of the person who can decide it.

3. **Write the file** in the project's requirements folder (default `docs/requirements/`) with this front matter:

   ```
   ---
   ba_doc: srs
   style: ste80
   lang: en
   req_keyword: shall
   ---
   ```

   `ba_doc` is one of `vision-scope`, `use-cases`, `srs`, `business-rules`, `acceptance`, `backlog`, `test-plan`, `screens`, `data-dictionary`, `glossary`, `risks`, `models`. Documents are in English unless the user asks for another language. Load the `ste` skill before you write.

4. **Label every item** so that other documents can point at it. A label is never reused.

   | Item | Label | Example |
   |---|---|---|
   | Business objective, success metric | `BO-n`, `SM-n` | BO-1 |
   | Feature (vision and scope) | `FE-n` | FE-3 |
   | Use case; its flows | `UC-n`; `n.0` normal, `n.m` alternative, `n.m.Ek` exception | UC-1, 1.2, 1.0.E1 |
   | Pre- and postcondition | `PRE-n`, `POST-n` | PRE-1 |
   | Business rule | `BR-n` | BR-4 |
   | Acceptance criterion | `AC-n` | AC-3 |
   | User story | `US-n` | US-2 |
   | Functional requirement | hierarchical tag under its feature | `Booking.Pay.Timeout` |
   | Other SRS requirements | section code and number: `OE` `CO` `DE` `UI` `SI` `CI` `DI` `USE` `PER` `SEC` `SAF` `AVL` `ROB` | PER-2 |

5. **Write each functional requirement** as one sentence that one test can verify:

   - From the system's side: `[condition or trigger], the <system> shall <response>.`
   - From the user's side: `The <user class> shall be able to <action> <object> [limit or quality].`

   Use the user class by name (Player, Club Manager). Give values with units and say if the end points of a range are included. Two conditions make two requirements. Put the origin after the requirement when it is not the enclosing use case: `(BR-4)`.

   Write each acceptance criterion as Given / When / Then with real values: a date, a time, an amount, a name from the glossary. One criterion maps to one test, so it holds one When and one observable Then. Cover the normal flow and each exception of the use case. Cover both sides of a limit in a business rule. In the Origin column, name the use case flow, business rule, or requirement tag that the criterion checks.

   Write each user story as `As a <user class>, I want <action>, so that <result>.` Use the user class name from the glossary. A story is the unit of planning. It names its use case or feature in the Origin column and does not repeat the steps of the use case. Its status is `planned`, `in sprint`, or `done`. A story is `done` only when the test of each of its `AC-n` labels passes.

   Write the test plan from the use cases and the `AC-n` labels. It defines no labels and only cites them. Give each `AC-n` one row in the coverage table, or two rows when it needs two tests. Start each test name with its label.

   Write the screen specification from the dialog map and the use cases. Make one table for each screen of the map, under the name that the map uses. Cite only labels that exist. It defines no labels.

6. **Keep one name for one thing.** Before a new domain term goes into a document, add it to `glossary.md` in the requirements folder (table: Term | Definition | Synonyms to avoid). Use the glossary term everywhere.

7. **Add the models.** A context diagram belongs in vision and scope. A state or process model belongs where prose would need a paragraph of conditions. A dialog map belongs in `models.md`, before the screen specification. Build them with the `ba-diagrams` skill.

8. **Finish.** The document is done when all of these are true:

   - Every section of the format authority holds content, `TBD` with an owner, or "Not applicable" with the reason.
   - Every functional requirement traces to a use case or business rule that exists, and every use case has requirements in the SRS once the SRS exists.
   - Every `AC-n` has an origin that exists. The test for it has a name that starts with the label, for example `AC-3: a booking that overlaps another is refused`.
   - Every `US-n` has an origin that exists, and every use case has at least one story.
   - Every `AC-n` in `acceptance.md` has a row in the coverage table of the test plan.
   - `README.md` in the requirements folder is up to date: one table with a row for each role, and only documents that exist. Update it each time you write or change a document.
   - `doc-lint` reports 0 findings. The plugin hook runs it on each save and returns the findings. Fix them in the file.
   - Your closing message lists the open `TBD` items and the facts you assumed.
