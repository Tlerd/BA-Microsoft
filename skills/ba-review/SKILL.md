---
name: ba-review
description: Review of a requirements document for defects. Use when the user asks to review, check, or inspect an SRS, use cases, business rules, or a vision and scope document.
---

A review finds defects and reports them. It changes the document only when the user asks for the fixes.

## Steps

1. **Run the linter** on each document under review and keep its output:

   ```
   node "<this skill's folder>/../../scripts/doc-lint.mjs" <file.md>
   ```

   For a document without a `ba_doc` key add `--as req`. The linter covers sentence length, passive requirements, vague words, weak verbs, duplicate labels, and diagram captions. Report its findings as counts by rule, with the line numbers.

2. **Read the whole document set**, not only the file under review: vision and scope, use cases, business rules, SRS, data dictionary, glossary, models. Most serious defects sit between two documents.

3. **Check each requirement** against these seven questions. A "no" is a defect.

   | Quality | Question |
   |---|---|
   | Complete | Does it give the developer everything needed to build it, or mark the gap `TBD`? |
   | Correct | Does it agree with its source (use case, business rule, stakeholder)? |
   | Feasible | Can it be built within the stated constraints? |
   | Necessary | Does it trace to a business objective, a use case, or a rule? |
   | Prioritized | Does it carry a priority? |
   | Unambiguous | Would two readers build the same thing? |
   | Verifiable | Can you name the test that proves it? |

4. **Check the set** for the four qualities of a collection:

   - **Complete**: every use case has functional requirements. Every exception flow has a system response. Every entity has a use case that creates it and one that reads it.
   - **Consistent**: no two requirements conflict. One term names one thing. Values agree between documents and with simple arithmetic.
   - **Modifiable**: each requirement is stated once and carries a unique label.
   - **Traceable**: every `BR-n`, `UC-n`, and requirement label that a document cites exists in the set.

5. **Apply the project's review checklist** if `AGENTS.md` names one or `docs/requirements/templates/` holds one. Answer every question in it. Report only the questions answered "no".

6. **Report** in this form, most severe first:

   | # | Location | Defect | Type | Severity | Proposed fix |
   |---|---|---|---|---|---|

   Type is one of: missing, wrong, ambiguous, conflict, not verifiable, not traceable, style. Severity is major (a developer would build the wrong thing) or minor. Location is a file and a label or line.

   The review is done when every requirement label in the document has been checked against step 3, every cited label has been looked up, and the report states the counts: requirements checked, defects by severity, `TBD` items open.
