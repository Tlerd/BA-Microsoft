# Review Report: docs/requirements/use-cases.md (UC-1 Book a Court, v0.1)

## Scope and method

- **Linter:** `doc-lint.mjs` found 0 findings (0 for sentence length, passive voice, vague words, weak verbs, duplicate labels). Its notes: 6 TBD mentions open, 7 labelled items.
- **Documents read:** use-cases, business-rules, glossary, models. No `AGENTS.md` and no checklist template exist.
- **Labels checked against the seven qualities:** 22. These are UC-1, PRE-1..2, POST-1..3, steps 1..9, alternative 1.1, and exceptions 1.0.E1..E6.
- **Cited labels looked up:** BR-1..BR-6 and BR-8 exist. TBD-1..4 exist. UC-1 exists. No citation is dangling.

## Defects

| # | Location | Defect | Type | Severity | Proposed fix |
|---|---|---|---|---|---|
| 1 | use-cases UC-1 step 5; business-rules | The QR code needs an amount. No price, price rule, or currency exists in any document. | missing | major | Add a pricing business rule (price per Slot, peak and off-peak). Show the amount in step 5. |
| 2 | use-cases UC-1 Use Case List; business-rules BR-7; models Q-3, Q-5 | No use case covers "Cancel a Booking" or "Block a Court". BR-7 traces to no use case. Figures 1 and 2 assume both exist. UC-1 has no exception for a block that arrives while a Booking is Pending payment or Confirmed. | missing | major | Write UC-2 Cancel a Booking and UC-3 Block a Court. Add an exception to UC-1 for a block during step 5 or 6. Close Q-3. |
| 3 | use-cases 1.0.E3, Assumptions, TBD-3; business-rules BR-3 | The Assumptions row says a Pending payment Booking counts toward the limit of 2. TBD-3 asks the same question as open. E3 and BR-3 say only "future Bookings". "Future" is undefined. Two developers would build two limits. | ambiguous | major | Get the answer for TBD-3. State it in BR-3. Define "future" (start time after now) and the statuses that count. Remove it from Assumptions. |
| 4 | use-cases steps 6–8, 1.0.E5, TBD-4 | Payment edge cases have no system response: wrong amount, duplicate payment, a payment that matches no Booking, a lost notification, and a payment after expiry (only the refund is TBD). The Assumptions row says the Payment Provider notifies each payment while TBD-4 is open. | missing | major | Add exceptions for each case at step 7. Define how a payment links to a Booking (reference code). Define what happens to the Slot after Expired. |
| 5 | use-cases 1.0.E3, 1.0.E5, Other Information vs models Figure 2 | E3 and E5 say "ends without a Booking", and Other Information says "keeps no Booking". Yet E5 sets the Booking to Expired, and 1.1 sets Cancelled. Figure 2 treats both as stored states. A developer can delete the record or keep it. | conflict | major | Say "ends with the Booking Expired" or "creates no Booking" (E3 creates none). Say whether Expired and Cancelled Bookings are kept. |
| 6 | use-cases 1.0.E2, E3, E4 vs step 4 | Step 4 says only "Checks that the slots are free". E2 (block), E3 (limit) and E4 (hours) also attach to step 4, but those checks are not in the step. E4 attaches to step 3, which is a Player step with no system action. | ambiguous | minor | Move all checks into step 4: free, not blocked, limit, hours. Attach E4 to step 4. |
| 7 | business-rules BR-4 vs use-cases step 4, 5, E5 | The timer start is unclear. BR-4 says "10 minutes to pay". E5 counts from step 5. Step 4 creates the Booking and holds the slots first. | ambiguous | minor | Define one start event. Use the same words in BR-4, step 5 and E5. |
| 8 | use-cases POST-3 vs 1.0.E6 | POST-3 says the Player has received the code by email. E6 ends with a failed email, so POST-3 is false. | conflict | minor | Reword POST-3 as "The system has sent the email, or queued it for retry". |
| 9 | use-cases 1.0.E6 | "Sends the email again later" has no interval and no retry limit. No test can prove it. | not verifiable | minor | State the retry interval, the maximum attempts, and the final state. |
| 10 | use-cases Alternative 1.1 | The Player can cancel only at step 6. The Player can also cancel at step 5 while the countdown runs. | missing | minor | Change the condition to "At step 5 or 6". |
| 11 | use-cases Frequency of Use | The system has 6 courts × 16 hours = 96 Slots per day. 120 Bookings per day cannot be Confirmed Bookings. | conflict | minor | Clarify what the 120 counts (attempts, or Pending Bookings). Correct the figure to ≤ 96 if it counts Confirmed Bookings. |
| 12 | use-cases Priority, TBD-2 | The priority is assumed, and the scale is TBD. | not verifiable | minor | Get the scale from the Club Manager. Record the priority. |
| 13 | use-cases Business Rules row | The row lists BR-1..BR-6 but the text cites BR-8. No step or exception cites BR-2, BR-4, BR-5, or BR-6. BR-7 is cited nowhere (see #2). | not traceable | minor | Cite the BR in the step it governs: BR-2 in step 3, BR-5 in E2, BR-4 in step 5 and E5, BR-6 in PRE-2. Add BR-8 to the row. |
| 14 | glossary vs use-cases | "Email Service" is a Secondary Actor but is not in the glossary. The terms Pending payment, Confirmed, Expired, Cancelled, QR code, hold, and blocked are used but undefined. The glossary says the Club Manager blocks Courts. UC-1 and BR-5 say Slots. | ambiguous | minor | Add the missing terms. Use "Slot" in the glossary entry for Club Manager. |
| 15 | use-cases step 1 | No limit exists on the dates a Player can select: no past dates, no advance window. | missing | minor | Add a business rule for the booking horizon. Add an exception for a date outside it. |
| 16 | use-cases Open Items; business-rules BR-8; models Open Questions | Open items sit in three places with overlaps: TBD-1 and BR-8, TBD-1 and Q-4, TBD-3 and the Assumptions row. | not traceable | minor | Keep one register. Use one ID per question. Refer to it from the other documents. |

## Counts

| Measure | Count |
|---|---|
| Requirement labels checked | 22 |
| Defects | 16 |
| Major | 5 (#1–#5) |
| Minor | 11 (#6–#16) |
| Linter findings | 0 |
| Open items in this document | 4 (TBD-1..4; 6 mentions) |
| Open questions in models.md | 5 (Q-1..Q-5) |
| BR-8 | still TBD, same question as TBD-1 |

## Overall

The structure and the exception coverage are good. Every exception has a system response. The five major defects all come from missing pieces: a price, the Cancel and Block use cases, the payment edge cases, and the TBD-3 limit rule. Fix these before the SRS starts. Four of them need an answer from the Club Manager (#1, #3, #4, #12).

Do you want me to apply fixes for the minor items that need no decision, such as #6–#10, #13, and #14?
