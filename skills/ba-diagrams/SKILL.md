---
name: ba-diagrams
description: Diagrams and models as Mermaid in Markdown. Use when the user asks for a diagram, or when a requirement, design, or explanation needs a context diagram, use case diagram, swimlane, state diagram, ERD, data flow diagram, dialog map, sequence diagram, decision table, or feature tree.
effort: medium
---

A model shows what prose hides: a missing flow, a state with no exit, an entity nobody creates. Draw the risky and the complex parts. A full set of models for the whole system is seldom needed.

## Choose the model

| What the reader must see | Model | Written as |
|---|---|---|
| The system boundary and what crosses it | Context diagram | Mermaid `flowchart` |
| Which user class does which task | Use case diagram | Mermaid `flowchart` |
| Steps of a business process and who does each | Swimlane diagram | Mermaid `flowchart` with one `subgraph` per role |
| How data moves between processes and stores | Data flow diagram (level 0, then level 1) | Mermaid `flowchart` |
| The states of one object and what changes them | State-transition diagram, plus state table | Mermaid `stateDiagram-v2`, Markdown table |
| Data objects and their relationships | Entity-relationship diagram | Mermaid `erDiagram` |
| Screens and the navigation between them | Dialog map | Mermaid `stateDiagram-v2` |
| The order of messages between systems | Sequence diagram | Mermaid `sequenceDiagram` |
| Logic with several conditions | Decision table, or decision tree | Markdown table, Mermaid `flowchart` |
| Features and sub-features | Feature tree | Mermaid `mindmap` |
| Events the system must answer | Event-response table | Markdown table |
| Which use case creates, reads, updates, deletes which entity | CRUD matrix | Markdown table |

Listen to the source text: nouns become actors, entities, stores, or lanes. Verbs become processes, use cases, or transitions. "If" becomes a decision.

Notation and a working snippet for each model are in [`NOTATION.md`](NOTATION.md). Read the snippet for the model you chose before you write it.

## Rules for every diagram

- One question per diagram, 15 nodes maximum. A larger subject becomes a level 0 diagram plus one diagram per part.
- Names come from the project's glossary and from the labels in its documents: a use case node reads `UC-1 Book a Court`, a state reads as the specification names it.
- Every arrow has a label, except in a use case diagram.
- Put this after the block: `Figure N. <title>` on its own line, then one line that tells the reader what the shapes mean.
- Put the diagram in the document section it explains, and refer to it from the text ("see Figure 3").
- When the user asks for motion or animation, animate the arrows of one path: see `Animated arrow` in `NOTATION.md`.

## Steps

1. Name the question the diagram answers and choose the model from the table.
2. List the elements from the source documents or the code, each with its label. An element with no source is a question for the user.
3. Write the diagram from the snippet in `NOTATION.md`.
4. Cross-check it against a second model: every data store in a DFD is an entity in the ERD. Every state change is caused by some use case. Every actor in the context diagram appears in a use case. Every screen in a dialog map has a table in `screens.md`, and every table there names a screen in the map.
5. Render it:

   ```
   node "<this skill's folder>/../../scripts/diagram-preview.mjs" <file.md>
   ```

   The script writes `<file>.diagrams.html` next to the document. Open it in a browser. The work is done when every figure draws, the page shows no red error box, and each gap found in step 4 is fixed or reported to the user.
