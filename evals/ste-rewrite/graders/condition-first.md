---
type: regex
target: last_message
match: not_contains
pattern: '[A-Za-z0-9,)][ \t]+(?:if|unless)\b'
---

No sentence puts a condition after the instruction. The condition comes first: "If the space is low, cancel the job." The words "if" and "unless" appear only at the start of a sentence (STE rule 5.4).
