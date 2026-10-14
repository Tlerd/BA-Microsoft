---
type: regex
target: last_message
match: not_contains
pattern: '(?:[^\s.!?]+[ \t]+){25}[^\s.!?]+'
---

No run of 26 or more words exists without a sentence end (period, question mark, exclamation mark) or a line break. So no sentence is longer than 25 words.
