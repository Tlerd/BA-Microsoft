---
type: regex
target: last_message
flags: i
pattern: '(?:(?:declin\w*|refus\w*|\b3a\b)(?:(?!\n[ \t]*\n)[\s\S]){0,250}(?:no\s+(?:system\s+)?(?:response|requirement|FR\b|step|reaction|handling|action|outcome|behaviou?r)|without|missing|not\s+(?:say|state|specif|defin|describ|cover|handl|address)|lacks?|undefined|unspecified|nothing|silent|gap)|(?:no\s+(?:system\s+)?(?:response|requirement|reaction|handling|action|outcome|behaviou?r)|missing|not\s+(?:specif|defin|cover|handl|address)|lacks?|unspecified|gap)(?:(?!\n[ \t]*\n)[\s\S]){0,250}(?:declin\w*|\b3a\b))'
---

The review says that exception flow 3a (payment declined) gives no system response and that no requirement covers it.
