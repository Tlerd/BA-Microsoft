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
