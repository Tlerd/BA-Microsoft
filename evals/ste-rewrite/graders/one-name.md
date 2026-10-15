---
type: regex
target: last_message
match: not_contains
flags: i
pattern: '^(?=[\s\S]*\bvolume\b)(?=[\s\S]*\b(?:disk|drive)\b)|^(?=[\s\S]*\bjob\b)(?=[\s\S]*\btask\b)'
---

The rewrite uses one name for one thing. The source says volume, disk, and drive for the same thing, and job and task for the same thing. The rewrite keeps one word of each group (STE rule 1.11).
