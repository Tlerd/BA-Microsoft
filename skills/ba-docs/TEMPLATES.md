# Outlines

One outline per document. Headings are the document's headings, in this order. The text after each heading says what the section must answer. Every document starts with a title block (product, version, author, date) and a revision history table (Name | Date | Reason for changes | Version).

## Vision and scope (`vision-scope`)

1. **Business Requirements**
   - **Background**: the situation that led to the project.
   - **Business Opportunity**: the problem or the market gap, and who has it.
   - **Business Objectives**: `BO-n`, each measurable, with a target value and a date.
   - **Success Metrics**: `SM-n`, how stakeholders will judge the result.
   - **Vision Statement**: one paragraph. For whom, what need, what product, what key benefit, unlike what alternative.
   - **Business Risks**: what can reduce the value, with probability and impact.
   - **Business Assumptions and Dependencies**: what must be true for the objectives to hold.
2. **Scope and Limitations**
   - **Major Features**: `FE-n`, one line each.
   - **Scope of Initial Release**: the features in release 1.
   - **Scope of Subsequent Releases**: the features that wait, by release.
   - **Limitations and Exclusions**: what a stakeholder could expect and will not get.
3. **Business Context**
   - **Stakeholder Profiles**: table of stakeholder, major value, attitude, major interests, constraints.
   - **Project Priorities**: for scope, schedule, cost, quality, staff, say which is a constraint, a driver, or a degree of freedom.
   - **Deployment Considerations**: what users and operations need before the product can go live.

Include a context diagram in section 2.

## Use cases (`use-cases`)

Start with a **Use Case List**: table of primary actor and the use cases of that actor. Then one table per use case with these rows:

| Row | Content |
|---|---|
| ID and Name | `UC-n`, then verb and object: "Book a Court" |
| Created By, Date Created | |
| Primary Actor, Secondary Actors | by user class or system name |
| Trigger | the event that starts the use case |
| Description | two or three sentences: who, what, with what outcome |
| Preconditions | `PRE-n`, each one testable by the system |
| Postconditions | `POST-n`, the state after success |
| Normal Flow | `n.0`, numbered steps, actor action then system response |
| Alternative Flows | `n.m`, where it leaves the normal flow and where it returns |
| Exceptions | `n.m.Ek`, the error condition and the system response |
| Priority | same scale as the functional requirements |
| Frequency of Use | a number per unit of time |
| Business Rules | labels only: `BR-n` |
| Other Information | quality needs, and what happens to data when the use case fails halfway |
| Assumptions | what you took as true |

## Software requirements specification (`srs`)

1. **Introduction**: Purpose · Document Conventions · Project Scope · References
2. **Overall Description**: Product Perspective · User Classes and Characteristics · Operating Environment (`OE-n`) · Design and Implementation Constraints (`CO-n`) · Assumptions and Dependencies (`DE-n`)
3. **System Features**: one subsection per feature, each with Description (and priority), Stimulus/Response Sequences (or the use case label), and Functional Requirements (hierarchical tags)
4. **Data Requirements**: Logical Data Model (ERD) · Data Dictionary (or a pointer to it) · Reports · Data Acquisition, Integrity, Retention, and Disposal (`DI-n`)
5. **External Interface Requirements**: User Interfaces (`UI-n`) · Software Interfaces (`SI-n`) · Hardware Interfaces · Communications Interfaces (`CI-n`)
6. **Quality Attributes**: Usability (`USE-n`) · Performance (`PER-n`) · Security (`SEC-n`) · Safety (`SAF-n`) · others as relevant (`AVL-n`, `ROB-n`). Each one measurable.
7. **Internationalization and Localization Requirements**
8. **Other Requirements**
9. **Appendix**: Glossary pointer · Analysis Models

## Business rules (`business-rules`)

One table:

| ID | Rule Definition | Type of Rule | Static or Dynamic | Source |
|---|---|---|---|---|

Type is one of: fact, constraint, action enabler, inference, computation. One rule per row. A rule states policy, not system behaviour: "A Player can hold at most 2 future Bookings", and the SRS says what the system does about it.

## Acceptance criteria (`acceptance`)

One section for each use case or feature. The heading names it with its label: "Book a Court (UC-1)". Under it, one table with one row for each criterion:

| AC-n | Given | When | Then | Origin |
|---|---|---|---|---|

- **AC-n**: the label. A test takes the label as the start of its name.
- **Given**: the state before the action, with real values.
- **When**: one action or event.
- **Then**: the result that a test can observe, with real values.
- **Origin**: the flow label (`UC-1`, `UC-1 1.0.E3`), the business rule (`BR-4`), or the requirement tag that the criterion checks.

Write the header cell as plain `AC-n`, without backticks. `doc-lint` finds the label column by that text.

## Backlog (`backlog`)

One table with one row for each story. Sort the rows by priority.

| US-n | Story | Origin | Priority | Estimate | Sprint | Status | AC-n labels |
|---|---|---|---|---|---|---|---|

- **US-n**: the label.
- **Story**: "As a <user class>, I want <action>, so that <result>." The user class is a name from the glossary. The story points to its use case and does not repeat the steps.
- **Origin**: the feature (`FE-n`) or use case (`UC-n`) that the story comes from.
- **Priority**: the scale of the use cases.
- **Estimate**: in the unit of the team, or `TBD` with an owner.
- **Sprint**: the name of the sprint, or `none`.
- **Status**: `planned`, `in sprint`, or `done`. A story is `done` only when the test of each of its criteria passes.
- **AC-n labels**: the criteria in the acceptance document. A story with no criterion is not ready for a sprint.

Write the header cells as plain text, without backticks. `doc-lint` finds the label column by the text `US-n`.

## Test plan (`test-plan`)

A test plan defines no labels. It only cites them, so it needs the use cases and the `AC-n` labels, not the design or the code. Sections in this order:

1. **Scope**: the features and use cases under test, by `FE-n` and `UC-n`, and what the plan does not test.
2. **Approach**: the test levels and the test types. Levels are, for example, unit, API, and end to end. Types are, for example, functional and performance.
3. **Entry and exit criteria**: when testing starts, and when it can stop.
4. **Environment and test data**: what each level needs. Give real values for each `AC-n`: names, dates, amounts.
5. **Risks**: what can stop or weaken the testing. Each risk has an owner.
6. **Coverage**: one table, with one row for each test.

| AC-n | Test name | Level | Status |
|---|---|---|---|

- **AC-n**: the criterion in the acceptance document that the test checks. A criterion with two tests has two rows.
- **Test name**: starts with the label, as in `AC-3: a booking that overlaps another is refused`.
- **Level**: one of the levels in Approach.
- **Status**: `planned`, `written`, `passing`, or `failing`.

A criterion with no row is a gap in the plan.

## Data dictionary (`data-dictionary`)

One table, entries in alphabetical order:

| Data Element | Description | Composition or Data Type | Length | Values |
|---|---|---|---|---|

- A primitive element gives its data type, length, and allowed values.
- A structure lists its parts joined with `+`. Optional parts go in parentheses. A repeating part is `min:max{part}`.
- Every part of a structure has its own entry.

## Glossary (`glossary`)

| Term | Definition | Synonyms to avoid |
|---|---|---|

## Risk list (`risks`)

| ID | Risk (condition, then consequence) | Probability | Impact | Exposure | Mitigation | Owner | Due |
|---|---|---|---|---|---|---|---|

Write each risk as "If <condition>, then <consequence>". Exposure is probability times impact. Sort by exposure.
