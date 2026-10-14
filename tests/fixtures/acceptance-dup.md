---
ba_doc: acceptance
style: ste80
lang: en
---

# Acceptance Criteria: Fixture

## Book a Court (UC-1)

| AC-n | Given | When | Then | Origin |
|---|---|---|---|---|
| AC-1 | Court 3 is free on 2026-11-02 from 18:00 to 19:00. | The Player confirms that slot for 1 hour. | The system creates a Booking with the status Pending payment. | UC-1 |
| AC-2 | Court 3 is free on 2026-11-02 from 18:00 to 20:00. | The Player confirms that slot for 2 hours. | The system holds 2 Slots on Court 3. | UC-1 |
| AC-1 | The Player holds 2 future Bookings. | The Player confirms a third Booking. | The system refuses it and shows the limit message. | UC-1 1.0.E3 |
