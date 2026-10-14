---
type: regex
target: last_message
flags: i
pattern: '(?:\b\d+\s+(?:FR|functional\s+requirements?|requirements?)\b[^\n]{0,40}\bchecked|\bchecked\b[^\n]{0,40}\b\d+\s+(?:FR|functional\s+requirements?|requirements?)|requirements?\s+checked\W{0,6}\d+)'
---

The report states how many requirements it checked. The ba-review skill asks for this count.
