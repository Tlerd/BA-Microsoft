---
description: A user asks for a rewrite of a dense procedure in plain technical English. The reply must keep the facts (40 GB, 2 hours, 7 days) and follow the sentence rules of the ste skill (sentence length with the STE word count, condition first, active voice, one name for one thing, a vertical list for the steps).
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

Can you rewrite this text in plain technical English for our operations handbook? Reply with only the rewritten text.

Before the nightly backup job starts, the operator has to make sure that the target volume (the one set in the job settings) has 40 GB or more of free space, since the job writes a temporary working area (which is not freed until the whole archive has been written and verified) and the scheduler will cancel the job if the drive has less space than this. When a job is cancelled, a message is sent to the administrator, who then has 2 hours to free space on the disk or to move the task to the next night. A backup that is older than 7 days is deleted by the system automatically, unless the administrator has marked it to be kept, and the operator is advised to confirm that the verification of the previous archive has finished before anything is removed from the drive.
