---
description: A user asks for a review of a short requirements document with three planted defects. FR-5 cites BR-9, which does not exist. FR-3 and FR-8 give two different hold times. PER-1 cannot be verified.
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill]
---

Can you review this requirements document before I send it to the developers? Tell me what is wrong with it.

<document>
# Locker Rental, requirements, v0.2

## Business rules

| ID | Rule |
|---|---|
| BR-1 | A Customer can rent one Locker at a time. |
| BR-2 | A rental lasts 1 to 7 days. |
| BR-3 | A Locker costs 4 EUR for each day. |

## Use case

UC-1 Rent a Locker. Priority: high. Normal flow 1.0: the Customer selects a station, a size, and a rental length, and pays. The system gives the Customer a door code.

## Requirements

- FR-1 (UC-1, BR-1): When a Customer who holds an active rental asks for a second Locker, the system shall refuse the request and show message MSG-2.
- FR-2 (UC-1, BR-2): The Customer shall be able to select a rental length from 1 to 7 days, both included.
- FR-3 (UC-1): When a Customer selects a Locker, the system shall hold it for 15 minutes.
- FR-4 (BR-3): The system shall calculate the price as 4 EUR multiplied by the number of days.
- FR-5 (UC-1, BR-9): When the payment succeeds, the system shall send a door code of 6 digits to the Customer by SMS within 10 seconds.
- FR-6 (UC-1): When the hold ends before the payment, the system shall make the Locker free again.
- FR-7 (UC-1): When the rental ends, the system shall send a reminder SMS to the Customer.
- FR-8 (UC-1): While a Customer has not paid, the system shall keep the selected Locker held for 30 minutes.
- PER-1: The system should respond quickly to every request.
</document>
