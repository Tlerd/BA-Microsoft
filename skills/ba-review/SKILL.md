---
name: ba-review
description: Review of a requirements document for defects. Use when the user asks to review, check, or inspect an SRS, use cases, business rules, or a vision and scope document. Pass the file path as the argument. When the user pasted the document, pass its full text as the argument, because the reviewer cannot see the chat. Reply with the returned report as your final answer. Do not summarize or rewrite it.
argument-hint: "[file path, or the full text of the document]"
context: fork
agent: ba-kit:requirements-reviewer
background: false
---

This skill runs in a separate reviewer agent. The agent does not see the conversation, so this text is the whole task.

Review this requirements document: $ARGUMENTS

The argument is the path of a file, or the text of the document. A path can be relative to the project folder. If the argument is empty or names a file that does not exist, say so in one line and stop.

A review finds defects and reports them. You have read-only tools, so you cannot change a file. The main conversation changes the document when the user asks for the fixes. Your last message goes to the main conversation as the result, and the main conversation shows it to the user as it is. So make it the complete report in the form of step 6. Do not repeat the text of the document.

## Steps

1. **Read the document** and find the style defects that the linter would report: sentences over 20 words in an instruction or 25 in a description, passive requirements, vague words, weak verbs (`should`, `might`, `could`), duplicate labels, and diagram blocks without a caption. Report them as type `style`, grouped by rule, with the line numbers. The linter does not run here, because the reviewer has no shell.

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

4. **Check the set** for the four qualities of a collection, and for coverage:

   - **Complete**: every use case has functional requirements. Every exception flow has a system response. Every entity has a use case that creates it and one that reads it.
   - **Consistent**: no two requirements conflict. One term names one thing. Values agree between documents and with simple arithmetic.
   - **Modifiable**: each requirement is stated once and carries a unique label.
   - **Traceable**: every `BR-n`, `UC-n`, and requirement label that a document cites exists in the set.
   - **Covered**: when the set holds `acceptance.md`, every `AC-n` has a row in the coverage table of the test plan. An `AC-n` with no row is a defect of type missing.

5. **Apply the project's review checklist** if `AGENTS.md` names one or `docs/requirements/templates/` holds one. Answer every question in it. Report only the questions answered "no".

6. **Report** in this form, most severe first:

   | # | Location | Defect | Type | Severity | Proposed fix |
   |---|---|---|---|---|---|

   Type is one of: missing, wrong, ambiguous, conflict, not verifiable, not traceable, style. Severity is major (a developer would build the wrong thing) or minor. Location is a file and a label or line.

   The review is done when every requirement label in the document has been checked against step 3 and every cited label has been looked up. End the report with one counts line in this form, with a number in each place (write 0 when none): `Counts: N requirements checked, N major defects, N minor defects, N open TBD items.`
