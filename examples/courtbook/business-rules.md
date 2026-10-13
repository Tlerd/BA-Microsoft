---
ba_doc: business-rules
style: ste80
lang: en
req_keyword: shall
---

# Business Rules: CourtBook

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

| ID | Rule Definition | Type of Rule | Static or Dynamic | Source |
|---|---|---|---|---|
| BR-1 | The club is open from 06:00 to 22:00. A Booking must end at or before 22:00. | Constraint | Static | Club Manager, 2026-10-10 |
| BR-2 | A Booking is for 1 hour or 2 hours. | Constraint | Static | Club Manager, 2026-10-10 |
| BR-3 | A Player can hold at most 2 future Bookings. | Constraint | Static | Club Manager, 2026-10-10 |
| BR-4 | A Player has 10 minutes to pay a Booking. After that, the club releases the slot. | Constraint | Static | Club Manager, 2026-10-10 |
| BR-5 | A blocked slot cannot be booked. | Constraint | Dynamic | Club Manager, 2026-10-10 |
| BR-6 | A Player books only with an account and after login. | Constraint | Static | Club Manager, 2026-10-10 |
| BR-7 | A Player can cancel a Booking free of charge up to 4 hours before its start. | Action enabler | Static | Club Manager, 2026-10-10 |
| BR-8 | The refund policy is TBD, owner: Club Manager. | Constraint | Static | Club Manager, 2026-10-10 |
