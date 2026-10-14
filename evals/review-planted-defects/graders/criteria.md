---
type: llm
focus: last_message
---

The document under review has exactly three planted defects:

1. FR-5 cites business rule BR-9, but the document defines only BR-1 to BR-3.
2. FR-3 and FR-8 conflict: one holds a Locker for 15 minutes and the other for 30 minutes.
3. PER-1 says "respond quickly", which no test can verify, and it uses "should" instead of "shall".

PASS if the review reports all three defects and describes each one correctly: the missing BR-9, the 15 against 30 minute conflict, and the unverifiable PER-1.
FAIL if the review misses any of the three, or if it describes one of them wrongly.
