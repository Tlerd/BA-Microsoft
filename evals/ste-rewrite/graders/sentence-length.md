---
type: regex
target: last_message
match: not_contains
pattern: '(?:(?:\([^)]*\)[,:]?|\d[\d.,]*[ \t]+(?:GB|MB|KB|TB|ms|min|hours?|minutes?|seconds?|days?|weeks?)\b[,:]?|(?!\d[\d.,]*[ \t]+(?:GB|MB|KB|TB|ms|min|hours?|minutes?|seconds?|days?|weeks?)\b)[^\s()]*[^\s().!?])[ \t]+){25}(?:\([^)]*\)[,:]?|\d[\d.,]*[ \t]+(?:GB|MB|KB|TB|ms|min|hours?|minutes?|seconds?|days?|weeks?)\b[,:]?|(?!\d[\d.,]*[ \t]+(?:GB|MB|KB|TB|ms|min|hours?|minutes?|seconds?|days?|weeks?)\b)[^\s()]*[^\s().!?])'
---

No sentence has more than 25 words. The count follows the STE rule: a parenthesized expression is one word, a number with its unit is one word, and a hyphenated word is one word. A sentence ends at a period, a question mark, an exclamation mark, or a line break.
