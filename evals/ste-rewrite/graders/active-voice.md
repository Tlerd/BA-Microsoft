---
type: regex
target: last_message
match: not_contains
flags: i
pattern: '\b(?:is|are|was|were|be|been|being)\s+(?:not\s+|also\s+|then\s+|automatically\s+|already\s+)?(?:\w{2,}ed|sent|written|made|given|kept|held|done|shown|taken|known|run)\b'
---

The rewrite has no passive verb. Each sentence names who or what does the action (STE rule 3.6).
