---
ba_doc: test-plan
style: ste80
lang: en
req_keyword: shall
---

# Test Plan: CourtBook

| Item | Value |
|---|---|
| Product | CourtBook |
| Version | 0.1 |
| Author | BA Team |
| Date | 2026-10-14 |

## Revision History

| Name | Date | Reason for changes | Version |
|---|---|---|---|
| BA Team | 2026-10-14 | First draft from use-cases.md and acceptance.md | 0.1 |

## Scope

The plan tests UC-1 Book a Court and its 16 criteria, AC-1 to AC-16 in `acceptance.md`. The set has no feature list yet, so the plan cites no FE-n label.

The plan does not test these items:

- The text and layout of the confirmation email. The criteria check only that one email with the Booking code leaves.
- The refund policy (TBD-1). No criterion exists for it.
- The cancellation of a Confirmed Booking and the blocking of a Court by the Club Manager. No use case covers them yet.
- The speed of the system. No performance target exists, so the plan holds no performance test. When the SRS sets a target, the plan gets a performance level.

## Approach

| Level | What it checks | Why |
|---|---|---|
| Unit | The rules on their own: opening hours, duration, limit of 2 Bookings, the 10 minute timer | A fake clock makes the timer tests take no real time. |
| API | The system with a test database, the Payment Provider stub, and the Email Service stub | Most criteria are about state changes, and the API shows them without a browser. |
| End to end | The screens in a browser | The criteria about what the Player sees need a browser. |

All tests are functional. Each test follows the Given, When, and Then of its criterion.

## Entry and Exit Criteria

Testing starts when all of these are true:

- `acceptance.md` holds AC-1 to AC-16 and has no change that waits for review.
- The test server runs with the stubs of the Payment Provider and the Email Service.
- The test accounts in the next section exist.

Testing can stop when all of these are true:

- Each criterion has at least one test with the status `passing`.
- No defect of major severity is open.
- The Club Manager has accepted the open item TBD-5, or has answered it.

## Environment and Test Data

| Level | Environment |
|---|---|
| Unit | A developer machine. A fake clock. No database. |
| API | A test server with an empty test database. The Payment Provider stub sends a payment notification on request. The Email Service stub can be set to fail. |
| End to end | The same test server, and one current browser. |

The test data uses real values. All times are club time.

| Data set | Values | Used by |
|---|---|---|
| Free evening | Court 3 is free on 2026-11-02 from 18:00 to 20:00. One Player with an account is logged in. | AC-1, AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-14, AC-15 |
| Two Players | Player A and Player B have accounts. Player A holds a Pending payment Booking for Court 3 on 2026-11-02 at 18:00. | AC-8 |
| Blocked Slot | The Club Manager has blocked Court 3 on 2026-11-02 at 18:00. | AC-9 |
| Booking limit | One Player holds 2 future Bookings. A second Player holds 1 future Booking. Court 3 is free on 2026-11-03 at 18:00. | AC-10, AC-11 |
| Late evening | Court 3 is free on 2026-11-02 at 21:00. The test chooses a duration of 2 hours and then of 1 hour. | AC-12, AC-13 |
| Failing email | The Email Service stub returns an error. A Booking is Confirmed. | AC-16 |

## Risks

| Risk | Owner |
|---|---|
| If the Payment Provider is not named (TBD-4), then the stub can differ from the real notification. | Club Manager |
| If the retry rule for the confirmation email stays open (TBD-5), then the tests cannot check the retry after AC-16. | Club Manager |
| If the test server has no fake clock, then AC-14 and AC-15 need 10 real minutes each. | Development team |

## Coverage

Each row is one test. A criterion with two tests has two rows. The status values are `planned`, `written`, `passing`, and `failing`.

| AC-n | Test name | Level | Status |
|---|---|---|---|
| AC-1 | AC-1: a free Slot becomes a Booking with the status Pending payment | API | planned |
| AC-2 | AC-2: the payment page shows the Booking summary, the QR code, and a countdown of 10 minutes | End to end | planned |
| AC-3 | AC-3: a payment notification sets the Booking to Confirmed and shows the Booking code | API | planned |
| AC-4 | AC-4: a Confirmed Booking sends one email with the Booking code | API | planned |
| AC-5 | AC-5: a choice of 2 hours holds two Slots of one Court in one Booking | API | planned |
| AC-6 | AC-6: the choice of duration offers 1 hour and 2 hours only | End to end | planned |
| AC-7 | AC-7: cancelling a Pending payment Booking releases the Slot | API | planned |
| AC-8 | AC-8: a second Booking for a held Slot is refused | API | planned |
| AC-8 | AC-8: Player B sees the message and the current availability | End to end | planned |
| AC-9 | AC-9: a blocked Slot cannot be booked | API | planned |
| AC-10 | AC-10: a third future Booking is refused with the limit message | API | planned |
| AC-11 | AC-11: a second future Booking for a free Slot is accepted | API | planned |
| AC-12 | AC-12: a Booking of 2 hours from 21:00 is refused | Unit | planned |
| AC-13 | AC-13: a Booking of 1 hour from 21:00 is accepted and ends at 22:00 | Unit | planned |
| AC-14 | AC-14: a Booking unpaid after 10 minutes becomes Expired and releases its Slots | Unit | planned |
| AC-14 | AC-14: the Player sees that the Booking expired | End to end | planned |
| AC-15 | AC-15: a payment at 9 minutes confirms the Booking | Unit | planned |
| AC-16 | AC-16: a failing Email Service leaves the Booking Confirmed and the code on screen | API | planned |
