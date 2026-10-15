---
name: ste
description: Plain technical English, 80% of the way to ASD-STE100. Use when writing or rewriting an English document for people to read (README, guide, report, specification, requirements), or when the user asks for STE or "simplified technical English".
effort: low
---

ASD-STE100 Simplified Technical English is a controlled language from aerospace maintenance manuals. This skill applies the part that makes any technical text easier to read: its sentence and structure rules. Word choice is by judgement, so the full dictionary of the standard is not needed. That level is "80% of the way to ASD-STE100".

Rule numbers refer to ASD-STE100 Issue 9. The standard is free on request from asd-ste100.org. This skill is an independent aid and does not certify compliance.

## Rules

- **One topic per sentence.** Instructions: 20 words maximum. Description: 25 words maximum. (5.1, 6.3)
- **One instruction per sentence**, in the imperative: "Select the delivery time." (5.2, 5.3)
- **Condition first**, then a comma, then the instruction: "If the menu is empty, show message MSG-4." (5.4)
- **Active voice.** Name who or what does the action. (3.6)
- **Simple tenses**: present, past, future, imperative, infinitive. Write "The system sends", where a draft says "is sending" or "has sent". (3.2, 3.4)
- **A verb for an action**: "Calculate the price", where a draft says "Do the calculation of the price". (3.7)
- **Full words**: keep articles (the, a, an) and write "do not", "it is". (4.2, 4.5)
- **A vertical list** for complex text: several parallel items, steps, or conditions. (4.3)
- **Paragraphs**: one topic, six sentences maximum, the topic in the first sentence. (6.4 to 6.6)
- **One name for one thing** in the whole document set. (1.11)
- **Noun groups of three words maximum.** Longer: write it in full once, then use a short form. (2.1, 2.2)
- **Punctuation**: a period where a draft has a semicolon. (8.1)
- **Notes inform.** A step that the reader must do is an instruction, written as a step. (5.5)
- **Warnings**: the command or condition first, then the risk. (7.2, 7.3)

Word count: each of these counts as one word: text in parentheses, a hyphenated word, a number with its unit, an abbreviation, a label such as `FR-12`, quoted text, and a proper noun. (8.5 to 8.7)

## Words

Prefer the short common word with one meaning. Frequent replacements:

| Draft | Write |
|---|---|
| ensure | make sure |
| provide | give |
| allow, permit, enable (a person) | let |
| perform, carry out | do |
| utilize | use |
| modify | change |
| whether | if |
| within | in |
| in order to | to |
| prior to | before |

Technical terms of the subject stay as they are: `database`, `endpoint`, `commit`, `click`, `upload`.

Keep every fact, number, condition, and hedge of the source. When a shorter word would change the meaning, change the sentence construction and keep the meaning.

## Other languages

Text in another language takes the rules for sentence length, one topic per sentence, active voice, vertical lists, paragraphs, and one name for one thing. The verb and word rules are English grammar.

## More than text

When the subject has several parts, steps, or states, a diagram explains it better than a paragraph. Add one with the `ba-diagrams` skill.

## Check

Mark a document so that the plugin hook checks it on every save. Use YAML front matter, or a comment in the first five lines where front matter does not fit (a README):

```
---
style: ste80
---
```

```
<!-- style: ste80 -->
```

To check a file by hand, run the script two levels above this skill's folder:

```
node "<this skill's folder>/../../scripts/doc-lint.mjs" --as ste80 <file.md>
```

The text is done when the script reports 0 findings and you have read each sentence once against the rules. The script counts words, sentences, and punctuation. It does not see tenses, voice outside requirements, or meaning.
