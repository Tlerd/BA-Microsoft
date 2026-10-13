---
name: ba-intake
description: Requirements interview that starts from an outcome. Use when the user names a product, feature, or result to build and no requirements document covers it, or asks you to act as the business analyst.
---

The user gives an outcome. You run an **interview** until you can write the requirements with zero guesses. Then you record the answers in an intake brief.

## Steps

1. **Read before you ask.** Read `AGENTS.md`, the requirements folder, any specification the project names, and the code that the outcome touches. Fill the coverage table from these sources. Only an empty row becomes a question. Done when each row is marked `known`, with its source, or `open`.

2. **Restate the outcome** in one sentence: who gets which result, and how they can tell that it is right. Ask the user to correct it. Done when the user accepts the sentence.

3. **Interview in rounds.** A round holds the open questions that depend on no other open question. Ask 7 at most, in the order of the table. Number each question, give your recommended answer, and give the reason in one line. Wait for the answers, update the table, then build the next round. When the user answers with a solution, ask which result that solution must produce. Done when every row holds an answer, `Not needed` with the reason, or `TBD` with its owner.

4. **Write the intake brief** to `intake-<slug>.md` in the requirements folder (default `docs/requirements/`). Write it in the language of the interview, with `style: ste80` and `lang` in the front matter. Use one heading for each row of the table, then `Assumptions` and `Open items`. Done when each sentence traces to an answer or to a source you read, and each guess is under `Assumptions`.

5. **Confirm.** Show the path, the assumptions, and the open items. Ask the user to accept the brief. After acceptance, the brief is the source for the `ba-docs` skill.

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
