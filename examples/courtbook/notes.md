# Interview notes: court booking (stakeholder: club manager, 2026-10-10)

- Product: CourtBook, a web app for one badminton club with 6 courts.
- Players book a court by the hour. Opening hours are 06:00 to 22:00.
- A player must have an account and must be logged in to book.
- A booking is for 1 or 2 hours. A player can hold at most 2 future bookings.
- Payment is online by QR bank transfer. The player has 10 minutes to pay, otherwise the system releases the slot.
- If the chosen slot was taken by someone else in the meantime, the player sees a message and picks another slot.
- The club manager can block a court for maintenance; blocked slots cannot be booked.
- After payment the player gets a confirmation email with a booking code.
- Cancellation is free up to 4 hours before start; the refund policy is not decided yet (manager will decide).
- About 120 bookings per day at peak.
