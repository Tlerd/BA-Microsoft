---
type: regex
target: last_message
flags: i
pattern: '^(?=[\s\S]*\b40\s*GB\b)(?=[\s\S]*\b2[\s-]*hours?\b)(?=[\s\S]*\b7[\s-]*days?\b)'
---

The rewrite keeps the three figures of the source: 40 GB, 2 hours, 7 days.
