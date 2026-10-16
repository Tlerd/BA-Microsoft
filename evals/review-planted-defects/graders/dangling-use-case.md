---
type: regex
target: last_message
flags: i
pattern: '(?:\bUC-3\b(?:(?!\n[ \t]*\n)[\s\S]){0,250}(?:not\s+(?:exist|defin|describ|appear|listed|present)|n.t\s+exist|no\s+(?:such\s+)?(?:UC|use case)|missing|undefined|unknown|only\s+UC-1|nowhere|dangling|never\s+defined|no UC-3)|(?:not\s+(?:exist|defin|describ|appear|listed|present)|n.t\s+exist|no\s+(?:such\s+)?(?:UC|use case)|missing|undefined|unknown|only\s+UC-1|nowhere|dangling|never\s+defined)(?:(?!\n[ \t]*\n)[\s\S]){0,250}\bUC-3\b)'
---

The review says that FR-6 cites UC-3 and that the document defines no UC-3. A bare mention of the label does not pass.
