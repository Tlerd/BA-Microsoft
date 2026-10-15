---
ba_doc: screens
style: ste80
lang: en
---

# Screens: Fixture

## Court Availability

| Row | Content |
|---|---|
| Name | Court Availability |
| Purpose | The Player picks a Court, a start time, and a duration. |
| Fields | Date: a date from today. Duration: 1 or 2 hours (BR-2). |
| Actions | Confirm: creates the Booking and opens Payment. |
| Messages | The Slot is not available. It shows when the Club Manager blocked the Slot. |
| Labels | UC-1 steps 1 to 4, UC-1 1.0.E2 |

## Payment

| Row | Content |
|---|---|
| Name | Payment |
| Purpose | The Player pays the Booking by QR bank transfer. |
| Fields | Countdown: minutes and seconds, from 10 minutes (BR-4). |
| Actions | Cancel: releases the Slots and opens Court Availability. |
| Messages | The Booking expired. It shows when the 10 minutes pass. |
| Labels | UC-1 steps 5 and 6, UC-1 1.1 |
