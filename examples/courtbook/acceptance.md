---
ba_doc: acceptance
style: ste80
lang: en
req_keyword: shall
---

# Acceptance Criteria: CourtBook

| Item | Value |
|---|---|
| Product | CourtBook |
| Version | 0.1 |
| Author | BA Team |
| Date | 2026-10-14 |

## Revision History

| Name | Date | Reason for changes | Version |
|---|---|---|---|
| BA Team | 2026-10-14 | First draft from use-cases.md and business-rules.md | 0.1 |

## Book a Court (UC-1)

Each test takes the label of its criterion as the start of its name, for example `AC-9: a blocked Slot cannot be booked`. All times are club time.

| AC-n | Given | When | Then | Origin |
|---|---|---|---|---|
| AC-1 | A Player is logged in. Court 3 is free on 2026-11-02 from 18:00 to 19:00. | The Player selects Court 3, the start time 18:00, and a duration of 1 hour. | The system creates a Booking with the status Pending payment. The system holds the 18:00 Slot of Court 3. | UC-1 step 4 |
| AC-2 | The system has created a Booking for Court 3 on 2026-11-02 at 18:00 with the status Pending payment. | The system shows the payment page. | The page shows the Booking summary, the QR code, and a countdown that starts at 10 minutes. | UC-1 step 5 |
| AC-3 | A Booking is Pending payment. The Payment Provider has not yet notified the system. | The Payment Provider notifies the system that the payment arrived. | The system sets the Booking to Confirmed. The system shows the Player a Booking code. | UC-1 steps 7 and 8, POST-1 |
| AC-4 | A Booking is Confirmed with a Booking code. | The system reaches step 9. | The system sends one email with the Booking code to the Player through the Email Service. | UC-1 step 9, POST-3 |
| AC-5 | Court 3 is free on 2026-11-02 from 18:00 to 20:00. | The Player selects Court 3, the start time 18:00, and a duration of 2 hours. | The system holds the 18:00 Slot and the 19:00 Slot of Court 3 in one Booking. | BR-2 |
| AC-6 | The Player is at step 3. | The Player opens the choice of duration. | The system offers 1 hour and 2 hours. The system offers no other duration. | BR-2 |
| AC-7 | A Booking for Court 3 on 2026-11-02 at 18:00 is Pending payment. | The Player cancels the Booking at step 6. | The system releases the 18:00 Slot and sets the Booking to Cancelled. The use case returns to step 1. | UC-1 1.1 |
| AC-8 | Player A holds a Booking that is Pending payment for Court 3 on 2026-11-02 at 18:00. Player B sees that Slot as free. | Player B selects that Slot and confirms. | The system shows Player B a message that the Slot is no longer free. The system shows the current availability and returns to step 3. | UC-1 1.0.E1 |
| AC-9 | The Club Manager has blocked Court 3 on 2026-11-02 at 18:00. | The Player selects that Slot and confirms. | The system shows a message that the Slot is not available. The use case returns to step 3. | UC-1 1.0.E2, BR-5 |
| AC-10 | The Player holds 2 future Bookings. | The Player confirms a third Booking. | The system shows a message that the limit is reached. The system creates no Booking. | UC-1 1.0.E3, BR-3 |
| AC-11 | The Player holds 1 future Booking. | The Player confirms a second Booking for a free Slot. | The system creates the second Booking with the status Pending payment. | BR-3 |
| AC-12 | The Player has chosen Court 3 on 2026-11-02, the start time 21:00, and a duration of 2 hours. | The Player moves on from step 3. | The system shows a message about the opening hours. The use case returns to step 3. | UC-1 1.0.E4, BR-1 |
| AC-13 | The Player has chosen Court 3 on 2026-11-02, the start time 21:00, and a duration of 1 hour. Court 3 is free then. | The Player confirms the Booking. | The system creates the Booking. The Booking ends at 22:00. | BR-1 |
| AC-14 | A Booking is Pending payment. The countdown started 10 minutes ago. The system has no payment. | The 10 minutes pass. | The system releases the held Slots and sets the Booking to Expired. The system tells the Player. | UC-1 1.0.E5, BR-4 |
| AC-15 | A Booking is Pending payment. The countdown started 9 minutes ago. | The Payment Provider notifies the system that the payment arrived. | The system sets the Booking to Confirmed. | BR-4 |
| AC-16 | A Booking is Confirmed. The Email Service is not available. | The system tries to send the confirmation email. | The Booking stays Confirmed. The Booking code stays on the screen of the Player. | UC-1 1.0.E6 |

## Open Items

| ID | Item | Owner |
|---|---|---|
| TBD-5 | Retry interval and maximum number of retries for the confirmation email after 1.0.E6 | Club Manager |
