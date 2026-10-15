---
type: regex
target: last_message
flags: i
pattern: '(?:\bFR-9\b(?:(?!\n[ \t]*\n)[\s\S]){0,250}(?:trace|source|justif|necessary|need for|no\s+(?:UC|use case|BR|link|reference|parent|origin|rationale|reason|business)|not\s+(?:linked|tied|traced|justif)|unlinked|orphan|privacy|GDPR|personal data|rationale)|(?:trace|source|justif|necessary|orphan|unlinked|rationale|privacy|GDPR|personal data)\w*(?:(?!\n[ \t]*\n)[\s\S]){0,250}\bFR-9\b)'
---

The review says that FR-9 (date of birth) has no source or use case and no stated need.
