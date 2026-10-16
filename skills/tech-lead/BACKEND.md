# Backend review

The checks that keep a backend correct under real users: retries, parallel requests, bad input, and failed deploys. Apply every check to the diff or endpoint under review. Answer each with "pass", "fail" with file and line, or "not applicable" with the reason.

## Data and concurrency

1. **Constraints in the database.** Uniqueness, foreign keys, value ranges, and non-overlap are database constraints, not only code checks. Two parallel requests cannot break them.
2. **One transaction for one business change.** Writes that must succeed together run in one transaction. The transaction holds no network call to another service.
3. **Conditional updates for shared counters.** A last-seat or stock update is one statement with the condition in `WHERE`, and the code checks the row count.
4. **A parallel test** sends at least 20 identical requests at once and asserts the exact number of successes.
5. **Idempotency.** A create or payment request that a client can retry carries an idempotency key. A repeated key returns the first response and writes nothing.
6. **No N+1 queries.** A list endpoint runs a fixed number of queries, whatever the list size.

## Access and input

7. **Authorization on the server, per object.** Every read and write checks that the caller may use that object. Changing an ID in the URL or body must not open another user's data (IDOR).
8. **Validation at the edge.** The shared schema validates every request body, query, and parameter before the handler runs.
9. **Errors.** Expected errors map to clear status codes and user messages, for example 409 for a conflict. Unexpected errors return 500 without internals, and the log keeps the details.
10. **Secrets and personal data.** No secret is in code, logs, or test data. Logs hold IDs, not names, phone numbers, or tokens.

## Change and operations

11. **Migrations in steps.** A schema change on a table with data uses expand, migrate, contract. A rename or drop waits for a later pull request. Each migration was run on a copy of real-sized data.
12. **Time.** Timestamps are stored with a time zone, and the screen converts them.
13. **Observability.** Each request has a correlation ID in the logs. Errors reach the error tracker. The endpoint has a latency and error-rate signal.
14. **Rollback.** A new behavior sits behind a flag, or the pull request states how to revert it without data loss.
15. **Backups.** The last backup succeeded, and a restore was tested.

Done when all 15 checks have an answer. Report the failures first, ordered by the damage they can cause.
