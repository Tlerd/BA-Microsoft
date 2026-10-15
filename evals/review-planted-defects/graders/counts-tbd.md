---
type: regex
target: last_message
flags: i
pattern: '(?:\b\d+\s+(?:open\s+)?TBD|\bTBD\b[^\n]{0,40}\b\d+\b|\b(?:no|zero)\s+(?:open\s+)?TBD)'
---

The report states how many TBD items are open, including zero. The ba-review skill asks for this count.
