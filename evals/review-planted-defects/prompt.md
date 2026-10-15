---
description: A user asks for a review of a short requirements document with six subtle defects. FR-6 cites UC-3, which does not exist. Use case UC-1 states a price that is wrong by arithmetic. Exception flow 3a has no response. FR-2 gives a longer rental than rule BR-2 allows. FR-7 says "shortly before", which no test can verify. FR-9 traces to nothing. The graders also check the report form of the ba-review skill (the table, the counts, and the priority gap).
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill]
---

Can you review this requirements document before I send it to the developers? Tell me what is wrong with it.

<document>
# Locker Rental, requirements, v0.3

## Business rules

| ID | Rule |
|---|---|
| BR-1 | A Customer can rent one Locker at a time. |
| BR-2 | A rental lasts 1 to 7 days. |
| BR-3 | A Locker costs 4 EUR for each day. |
| BR-4 | A Customer pays before the system gives the door code. |

## Use cases

UC-1 Rent a Locker. Priority: high.

Normal flow 1.0:

1. The Customer selects a station, a size, and a rental length.
2. The system shows the price. For a rental of 5 days, the price is 24 EUR.
3. The Customer pays.
4. The system gives the Customer a door code.

Exception flows:

- 1a. No Locker of the selected size is free. The system shows message MSG-1.
- 3a. The payment is declined.

UC-2 Extend a rental. Priority: medium. The Customer asks for more days on an active rental. The system adds the days if the Locker is still free and the new total is within the limit.

## Requirements

- FR-1 (UC-1, BR-1): When a Customer who holds an active rental asks for a second Locker, the system shall refuse the request and show message MSG-2.
- FR-2 (UC-1, BR-2): The Customer shall be able to select a rental length from 1 to 10 days, both included.
- FR-3 (UC-1): When no Locker of the selected size is free, the system shall show message MSG-1 and list the sizes that have a free Locker.
- FR-4 (UC-1, BR-3): The system shall show the price as 4 EUR multiplied by the number of days.
- FR-5 (UC-1, BR-4): When the payment succeeds, the system shall send a door code of 6 digits to the Customer by SMS within 10 seconds.
- FR-6 (UC-3, BR-2): When a Customer asks to extend a rental, the system shall refuse the extension if the new total is longer than 7 days.
- FR-7 (UC-1): The system shall send a reminder SMS to the Customer shortly before the rental ends.
- FR-8 (UC-2, BR-3): When a rental is extended, the system shall add 4 EUR for each extra day to the price paid.
- FR-9: The system shall store the date of birth of each Customer.
</document>
