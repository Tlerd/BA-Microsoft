---
name: ba-intake
description: Requirements interview that starts from an outcome. Use when the user names a product, feature, or result to build and no requirements document covers it, asks you to act as the business analyst, to write questions for someone else, or to list the open items.
---

The user gives an outcome. You run an **interview** until you can write the requirements with zero guesses. Then you record the answers in an intake brief.

## Steps

1. **Read before you ask.** Read `AGENTS.md`, the requirements folder, any specification the project names, and the code that the outcome touches. Fill the coverage table from these sources. Only an empty row becomes a question. Done when each row is marked `known`, with its source, or `open`.

2. **Restate the outcome** in one sentence: who gets which result, and how they can tell that it is right. Ask the user to correct it. Done when the user accepts the sentence.

3. **Interview in rounds.** A round holds the open questions that depend on no other open question. Ask 7 at most, in the order of the table. Number each question. Under it, write a `Recommended:` line with your answer and a `Reason:` line of one sentence. Wait for the answers, update the table, then build the next round. When the user answers with a solution, ask which result that solution must produce. Done when every row holds an answer, `Not needed` with the reason, or `TBD` with its owner.

   If the user says that someone else answers, write the round to the questionnaire file and ask nothing more in the chat for that round.

4. **Propose.** After the answers to the first round, and before the next question round, give one short round of proposals. Send it alone, with no questions in it. It holds 3 expansions and 3 cuts at most. For each, give the value to the user and the cost, for example build time or a new dependency. This round has its own limit, apart from the 7 of a question round. The user accepts or rejects each one. An accepted expansion becomes a use case or a feature in the table. An accepted cut goes to `Out of scope` with the reason. Done when the user has answered every proposal.

5. **Write the intake brief** to `intake-<slug>.md` in the requirements folder (default `docs/requirements/`). Write it in the language of the interview, with `style: ste80` and `lang` in the front matter. Use one heading for each row of the table, then `Assumptions` and `Open items`. Done when each sentence traces to an answer or to a source you read. Each guess is under `Assumptions`. Each accepted proposal is a use case, a feature, or an `Out of scope` item.

6. **Confirm.** Show the path, the assumptions, and the open items. Ask the user to accept the brief. After acceptance, the brief is the source for the `ba-docs` skill.

## Questionnaire file

Use it when someone else answers, and when the user asks for the open items. Write `questions-<slug>.md` in the requirements folder, with `style: ste80` and `lang` in the front matter.

- One heading for each person who answers.
- Each question has the lines of a chat question, then an empty `Answer:` line.
- A number is never reused.

**Open items.** Collect every `TBD` in the requirements folder. Group them by owner in the same format, each with its file and label. A `TBD` with no owner goes under `No owner`. In the reply, list each one with its file and owner.

**Close the loop.** The user brings back the answers. Put each answer in the document that holds its `TBD` or open row, and remove that `TBD`. Add a revision row that names the question number, for example `Q3`. A question with no answer stays open.

## Coverage

| Row | The brief must state |
|---|---|
| Users | Each user class, and who decides or pays |
| Use cases | What each user class does, in order of value, and which one ships first |
| Out of scope | What this version leaves out |
| Inputs and outputs | What goes in and what comes out, and in which form: screen, file, API, message |
| Data | The things the system stores, which of them are money or personal data, and how long they stay |
| Rules | Business rules, permissions, and the states of each main object |
| Volume | Users, records, and requests in a period, and the read to write ratio, today and at the next milestone |
| Quality | Response time, availability, security, devices, and languages, each with a number and a unit |
| Constraints | Stack, budget, deadline, team, law |
| Acceptance | One worked example for each use case, with real values, that the user will check |

Convert volume to requests in a second before you discuss the design: 2.5 million requests in a month is about 1 in a second.

The volume questions follow step 1 of *The System Design Primer* (Donne Martin, CC BY 4.0).
