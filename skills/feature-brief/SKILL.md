---
name: feature-brief
description: Goal and non-goal brief for one feature slice, from the database to the screen. Use when the user picks the next feature to build, asks for a brief, ticket, or issue for a coding agent, or before an agent codes a slice end to end.
---

A feature brief is the contract for one **vertical slice**: one user-visible result that crosses every layer (data, API, screen) and ships behind its own tests. An agent codes from the brief alone, so the brief must leave zero guesses.

## Steps

1. **Read the sources.** Read `AGENTS.md` and the specification that the project names. Read the shared contract, the data model, and the code that the slice touches. Done when you can name each table, endpoint, and screen that the slice changes. Give each one its file, or mark it `new`.

2. **Cut the slice.** The slice delivers one result that a user can see and check. It fits in 1 to 3 pull requests of about 400 changed lines or fewer. When the result is larger, split it, and give each part its own brief. Done when the goal fits in one sentence with one actor and one result.

3. **Write the brief** from [TEMPLATE.md](TEMPLATE.md) to `docs/briefs/<id>-<slug>.md` (or the folder that `AGENTS.md` names), in the language of the user, with `style: ste80` in the front matter. Every non-goal states why it is out. Every acceptance criterion has real values and a number `AC-n`. Done when every section of the template is filled, or holds `TBD` with the person who decides.

4. **Check the brief** against these questions. A "no" means the brief is not ready:

   - Does each acceptance criterion name one test that proves it?
   - Does each field and table name come from the data model, spelled the same way?
   - Does the contract change come before the server code and the screen code in the build order?
   - Does the brief name every path the agent may edit, and the paths it must leave alone?
   - Is each change to money, concurrency, the schema, or personal data flagged for a review in a fresh session?
   - Is every open decision listed under `Open questions`, with an owner?

   Done when each answer is "yes" or the gap is an open question.

5. **Confirm.** Show the goal, the non-goals, the acceptance criteria, and the open questions. Ask the user to accept the brief. A brief with an open question that blocks an acceptance criterion is not ready to code.

After acceptance, the brief can become a GitHub issue body. The build order in the brief gives one pull request for each step, each with `Closes #<issue>` only on the last one.
