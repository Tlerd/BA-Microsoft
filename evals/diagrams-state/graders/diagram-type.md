---
type: regex
target: last_message
pattern: '```mermaid\r?\n\s*(?:%%[^\n]*\n\s*)*stateDiagram(?:-v2)?\b'
---

The Mermaid block starts with the diagram type stateDiagram or stateDiagram-v2.
