---
description: A user asks for a paragraph in plain technical English. No sentence in the reply may be longer than 25 words, and the facts (40 GB, 2 hours, 7 days) must stay.
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

Can you rewrite this paragraph in plain technical English for our operations handbook? Reply with only the rewritten paragraph.

In order to ensure that the nightly backup completes successfully, the operator must verify, prior to the start of the job, that at least 40 GB of free space is available on the target volume, because the job utilizes a temporary working area that is not released until the whole archive has been written and checked; if the free space is lower than this figure, the job is cancelled by the scheduler and a message is sent to the administrator, who then has 2 hours to free the space or to move the job to the next night. Backups that are older than 7 days are deleted automatically, unless the administrator has marked them to be kept.
