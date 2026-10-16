---
ba_doc: screens
style: ste80
lang: en
req_keyword: shall
---

# Screens: CourtBook

| Item | Value |
|---|---|
| Product | CourtBook |
| Version | 0.1 |
| Author | BA Team |
| Date | 2026-10-14 |

## Revision History

| Name | Date | Reason for changes | Version |
|---|---|---|---|
| BA Team | 2026-10-14 | First draft from use-cases.md and the dialog map in models.md | 0.1 |

## Reading Notes

There is one section for each screen of the dialog map (Figure 3 in `models.md`). A table says what its screen must hold. It does not say how the screen looks. The wording of each message is a draft, and the designer decides the final words.

## Court Availability

| Row | Content |
|---|---|
| Name | Court Availability |
| Purpose | The Player sees which Slots are free and picks a Court, a start time, and a duration. |
| Fields | Date: a date, not in the past. The latest date is TBD-6.<br>Court: one of the 6 Courts.<br>Start time: a full hour. The Booking must end at or before 22:00 (BR-1).<br>Duration: 1 hour or 2 hours (BR-2).<br>Slot grid: read only. It shows the free Slots and the unavailable Slots of each Court on the chosen date. |
| Actions | Select a date: shows the Slot grid of that date.<br>Confirm: if the Slots are free, creates the Booking with the status Pending payment, holds the Slots, and opens Payment. If not, shows a message and stays on this screen. |
| Messages | The Slot is no longer free. It shows when another Player took a chosen Slot. The screen then shows the current availability.<br>The Slot is not available. It shows when the Club Manager blocked a chosen Slot (BR-5).<br>The limit of 2 future Bookings is reached. It shows when the Player already holds 2 (BR-3).<br>The Booking must end by 22:00. It shows when the chosen Slots end after 22:00. |
| Labels | UC-1 steps 1 to 4, UC-1 1.0.E1 to 1.0.E4 |

## Payment

| Row | Content |
|---|---|
| Name | Payment |
| Purpose | The Player pays the Booking by QR bank transfer in 10 minutes. |
| Fields | Booking summary: read only. It shows the Court, the date, the start time, and the duration.<br>QR code: read only. It holds the data for the bank transfer.<br>Countdown: read only. Minutes and seconds, from 10:00 down to 0:00 (BR-4). |
| Actions | Cancel the Booking: releases the held Slots, sets the Booking to Cancelled, and opens Court Availability.<br>Payment arrives: no Player action. The system sets the Booking to Confirmed and opens Booking Confirmed.<br>Countdown reaches 0:00: no Player action. The system releases the held Slots, sets the Booking to Expired, shows a message, and opens Court Availability. |
| Messages | The Booking expired. It shows when 10 minutes pass without a payment. |
| Labels | UC-1 steps 5 to 8, UC-1 1.1, UC-1 1.0.E5 |

## Booking Confirmed

| Row | Content |
|---|---|
| Name | Booking Confirmed |
| Purpose | The Player sees the Booking code that the club needs at the court. |
| Fields | Booking code: read only text.<br>Booking summary: read only. It shows the Court, the date, the start time, and the duration.<br>Status: read only. The value is Confirmed. |
| Actions | Close: leaves the screen. The use case ends. |
| Messages | None. When the Email Service fails, the Booking code stays on this screen. |
| Labels | UC-1 steps 8 and 9, UC-1 1.0.E6, UC-1 POST-1 |

## Open Items

| ID | Item | Owner |
|---|---|---|
| TBD-6 | The latest date that a Player can select on Court Availability | Club Manager |
