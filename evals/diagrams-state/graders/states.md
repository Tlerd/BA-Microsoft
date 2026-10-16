---
type: regex
target: last_message
flags: i
pattern: '^(?=[\s\S]*\bnew\b)(?=[\s\S]*\bpaid\b)(?=[\s\S]*\bpack)(?=[\s\S]*\bshipped\b)(?=[\s\S]*\bdelivered\b)(?=[\s\S]*\bcancel)(?=[\s\S]*\breturn)'
---

The reply names every state from the request: new, paid, packed, shipped, delivered, cancelled, returned.
