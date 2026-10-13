---
ba_doc: use-cases
style: ste80
lang: en
req_keyword: shall
---

# Use Cases: CourtBook

| Item | Value |
|---|---|
| Product | CourtBook |
| Version | 0.1 |
| Author | BA Team |
| Date | 2026-10-13 |

## Revision History

| Name | Date | Reason for changes | Version |
|---|---|---|---|
| BA Team | 2026-10-13 | First draft from the interview notes of 2026-10-10 | 0.1 |

## Use Case List

| Primary actor | Use cases |
|---|---|
| Player | Book a Court (UC-1 below) |

## Book a Court

| Row | Content |
|---|---|
| ID and Name | UC-1 Book a Court |
| Created By, Date Created | BA Team, 2026-10-13 |
| Primary Actor | Player |
| Secondary Actors | Payment Provider, Email Service |
| Trigger | The Player selects "Book a court". |
| Description | A Player picks a court, a start time, and a duration of 1 or 2 hours. The Player pays by QR bank transfer. The system confirms the Booking and sends a booking code by email. |
| Preconditions | PRE-1: The Player has an account. PRE-2: The Player is logged in. |
| Postconditions | POST-1: The Booking has the status Confirmed. POST-2: The booked slots are not available to other Players. POST-3: The Player has received a booking code by email. |

### Normal Flow (1.0)

| Step | Actor | Action or response |
|---|---|---|
| 1 | Player | Selects a date. |
| 2 | System | Shows, for each of the 6 courts, the free slots and the unavailable slots of that date. |
| 3 | Player | Selects a court, a start time, and a duration of 1 or 2 hours. |
| 4 | System | Checks that the slots are free. Holds the slots. Creates the Booking with the status Pending payment. |
| 5 | System | Shows the Booking summary, the QR code, and a countdown of 10 minutes. |
| 6 | Player | Pays by QR bank transfer. |
| 7 | Payment Provider | Tells the system that the payment arrived. |
| 8 | System | Sets the Booking to Confirmed. Creates the booking code. Shows the booking code to the Player. |
| 9 | System | Sends the confirmation email with the booking code through the Email Service. |

### Alternative Flows

| ID | Condition | Flow |
|---|---|---|
| 1.1 | At step 6, the Player cancels the pending Booking. | The system releases the held slots and sets the Booking to Cancelled. The use case returns to step 1. |

### Exceptions

| ID | Error condition | System response |
|---|---|---|
| 1.0.E1 | At step 4, another Player has taken one of the slots. | The system shows a message that the slot is no longer free. The system shows the current availability. The use case returns to step 3. |
| 1.0.E2 | At step 4, the Club Manager has blocked one of the slots. | The system shows a message that the slot is not available. The use case returns to step 3. |
| 1.0.E3 | At step 4, the Player already holds 2 future Bookings. | The system shows a message that the limit is reached (BR-3). The use case ends without a Booking. |
| 1.0.E4 | At step 3, the selected slots end after 22:00. | The system shows a message about the opening hours (BR-1). The use case returns to step 3. |
| 1.0.E5 | At step 7, the system has not received the payment 10 minutes after step 5. | The system releases the held slots and sets the Booking to Expired. The system tells the Player. The use case ends without a Booking. |
| 1.0.E6 | At step 9, the Email Service fails. | The system keeps the Booking Confirmed and keeps the booking code on screen. The system sends the email again later. |

| Row | Content |
|---|---|
| Priority | High (assumed). The scale is TBD, owner: Club Manager. |
| Frequency of Use | About 120 Bookings per day at peak. |
| Business Rules | BR-1, BR-2, BR-3, BR-4, BR-5, BR-6 |
| Other Information | While a Booking is Pending payment, the held slots are not available to other Players. If the use case fails halfway, the system releases all held slots and keeps no Booking. The refund policy for a payment that arrives after step 1.0.E5 is TBD, owner: Club Manager (BR-8). |
| Assumptions | A slot is one hour on one court. A 2-hour Booking uses two consecutive slots on one court. A Pending payment Booking counts toward the limit of 2 future Bookings. The Payment Provider tells the system about each payment. |

## Open Items

| ID | Item | Owner |
|---|---|---|
| TBD-1 | Refund policy for Cancellation and for late payment | Club Manager |
| TBD-2 | Priority scale | Club Manager |
| TBD-3 | Does a Pending payment Booking count toward the limit of 2 future Bookings? | Club Manager |
| TBD-4 | Name of the Payment Provider and the way it notifies the system | Club Manager |
