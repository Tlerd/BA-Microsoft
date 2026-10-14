---
description: A user asks for a state diagram of an order. The reply must hold one Mermaid block that starts with a state diagram type.
max_turns: 10
allowed_tools: [Read, Glob, Grep, Skill]
---

Can you draw a state diagram of an order in our online shop? An order starts as new, the customer pays for it, we pack it, we ship it, and it ends as delivered. The customer can cancel until we ship it. After delivery the customer can return it.
