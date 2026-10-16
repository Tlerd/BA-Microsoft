---
name: ba-handbook
description: Interactive HTML handbook built from checked content. Use when the user asks for an interactive page, catalog, lookup table, or step-by-step process map, or asks to turn a document or a conversation into something the team can browse.
---

A handbook is one offline HTML page with tabs. Each tab is a **catalog** (filter, search, list with a detail panel) or a **pipeline** (numbered stages with a detail panel). You write the content as a data file. The script `handbook-build.mjs` checks the data and writes the page.

## Steps

1. **Collect the content.** List each item the page must show. For each fact, find its source: a document you read, a URL, or the user. A fact without a source is your proposal. Done when each item has a source id, or is marked as a proposal.

2. **Write the data file** `<name>.handbook.json` next to the documents it describes. Use the schema below. Write it in the language of the user. Use real values, not placeholders. Done when every item from step 1 is in the file.

3. **Build the page:**

   ```
   node "<this skill's folder>/../../scripts/handbook-build.mjs" <name>.handbook.json
   ```

   The script prints each problem and writes nothing when the data fails its check. Fix every problem and run it again. Done when the script prints the path of `<name>.html`.

4. **Look at the page** in a browser at 1280 px and at 390 px wide, in light and dark mode. Click each tab, each group chip, and each stage. Done when no text overflows and each detail panel shows its sources.

5. **Report** the path of the page, the item count, and the items marked as proposals.

## Schema

```json
{
  "title": "Page title",
  "subtitle": "One sentence: who uses the page, and for what",
  "lang": "vi",
  "updated": "2026-10-16",
  "sources": [{ "id": "G2", "title": "Design Docs at Google", "url": "https://..." }],
  "sections": [
    {
      "id": "flow", "title": "Tab name", "kind": "pipeline",
      "intro": "One or two sentences above the content",
      "items": [
        {
          "id": "plan", "title": "Stage name", "group": "Who does it",
          "summary": "What happens in this stage",
          "fields": [
            { "label": "Output", "value": ["PRD", "Feature brief"] },
            { "label": "Done when", "value": "The user accepts the brief" }
          ],
          "sources": ["G2"]
        }
      ]
    }
  ]
}
```

| Rule | Detail |
|---|---|
| `kind` | `pipeline` for an ordered process. `catalog` for a set without order. Numbers appear only on a pipeline |
| `group` | In a catalog, the value of `group` makes the filter chips. Use 2 to 6 groups |
| `fields` | A `value` is a string or a list of strings. Use the same labels in the same order for every item of a section |
| `sources` | Each item cites at least one source id, or sets `"basis": "proposal"`. The page labels a proposal in yellow |
| `lang` | `vi` or `en`. It sets the words of the buttons |

The page has no external scripts, fonts, or styles, so it opens without a network connection.
