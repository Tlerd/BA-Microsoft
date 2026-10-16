---
type: regex
target: last_message
match: not_contains
pattern: '```(?:js|javascript|ts|typescript|tsx|jsx|python|py|sql|html|css|java|csharp|cs|go|rust|php|ruby|bash|sh)\b|(?:^|\n)\s*(?:const|let|def|function|import|CREATE TABLE|SELECT)\s'
---

The reply holds no fenced code block in a programming language and no line that starts like code.
