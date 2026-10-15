---
type: regex
target: last_message
match: not_contains
flags: m
pattern: '^[ \t]*(?:\[\*\]|\w+)[ \t]+->[ \t]|-->[ \t]*(?::|$)'
---

The block has none of the common state diagram slips: a single-dash arrow (`->`), or an arrow with no target state. This is an approximation. A regular expression cannot parse Mermaid. The real parse check is the script `evals/parse-mermaid.mjs`.
