---
type: regex
target: last_message
flags: i
pattern: '(?:\b\d+\s+major\b|\bmajor\W{0,6}\d+\b)'
---

The report states the number of major defects, as a count. The ba-review skill asks for the counts by severity.
