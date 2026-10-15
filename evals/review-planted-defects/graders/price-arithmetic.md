---
type: regex
target: last_message
flags: i
pattern: '(?:\b24\b(?:(?!\n[ \t]*\n)[\s\S]){0,250}\b20\b|\b20\b(?:(?!\n[ \t]*\n)[\s\S]){0,250}\b24\b)'
---

The review shows that 5 days at 4 EUR is 20 EUR and that UC-1 states 24 EUR. Both figures must appear together.
