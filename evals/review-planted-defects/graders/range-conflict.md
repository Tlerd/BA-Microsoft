---
type: regex
target: last_message
flags: i
pattern: '(?:\bFR-2\b(?:(?!\n[ \t]*\n)[\s\S]){0,250}\b(?:10|ten)\b(?!\s*(?:seconds?|sec))|\b(?:10|ten)\b(?!\s*(?:seconds?|sec))(?:(?!\n[ \t]*\n)[\s\S]){0,250}\bFR-2\b)'
---

The review names FR-2 together with its 10 days, which is longer than the 7 days of BR-2.
