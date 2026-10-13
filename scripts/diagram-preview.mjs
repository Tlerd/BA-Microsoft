#!/usr/bin/env node
// Writes <file>.diagrams.html: every Mermaid block of a Markdown file, drawn,
// with its caption. A block that does not parse shows as a red box.
//
// Usage: node diagram-preview.mjs <file.md> [...]
// The page loads Mermaid from cdn.jsdelivr.net, so the browser needs a connection.

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';

const MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.esm.min.mjs';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node diagram-preview.mjs <file.md> [...]');
  process.exit(1);
}

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  const figures = [];
  for (let i = 0; i < lines.length; i++) {
    if (!/^\s*```\s*mermaid\s*$/.test(lines[i])) continue;
    const start = i + 1;
    let end = start;
    while (end < lines.length && !/^\s*```\s*$/.test(lines[end])) end++;
    const caption = lines.slice(end + 1, end + 4).find((l) => /(Figure|Hình)\s+\d+/i.test(l)) || '';
    figures.push({ line: start, code: lines.slice(start, end).join('\n'), caption: caption.trim() });
    i = end;
  }

  const html = `<!doctype html>
<meta charset="utf-8">
<title>${esc(basename(file))}: diagrams</title>
<style>
  body { font: 15px/1.5 system-ui, sans-serif; margin: 2rem auto; max-width: 1000px; padding: 0 1rem; color: #1a1a1a; background: #fff; }
  figure { margin: 0 0 2.5rem; padding: 1rem; border: 1px solid #ddd; border-radius: 6px; }
  figcaption { margin-top: .75rem; font-weight: 600; }
  .src { color: #666; font-size: 12px; }
  .error { background: #fde8e8; border: 2px solid #c00; color: #900; padding: .75rem; white-space: pre-wrap; font-family: monospace; }
  #summary { padding: .5rem .75rem; border-radius: 6px; background: #eef; margin-bottom: 1.5rem; }
</style>
<h1>${esc(basename(file))}</h1>
<div id="summary">Rendering ${figures.length} diagrams...</div>
${figures
  .map(
    (f, n) => `<figure>
  <div class="src">line ${f.line}</div>
  <div class="out" id="out${n}"></div>
  <figcaption>${esc(f.caption) || '(no caption)'}</figcaption>
</figure>`,
  )
  .join('\n')}
<script type="module">
  import mermaid from '${MERMAID}';
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict' });
  let failed = 0;
  // "<" is escaped so that diagram text cannot close this script element.
  const sources = ${JSON.stringify(figures.map((f) => f.code)).replace(/</g, '\\u003c')};
  const total = sources.length;
  for (let n = 0; n < total; n++) {
    const code = sources[n];
    const out = document.getElementById('out' + n);
    try {
      const { svg } = await mermaid.render('fig' + n, code);
      out.innerHTML = svg;
    } catch (e) {
      failed++;
      out.className = 'error';
      out.textContent = 'Does not render: ' + (e.message || e);
    }
  }
  const s = document.getElementById('summary');
  s.textContent = total + ' diagrams, ' + failed + ' failed';
  s.dataset.failed = failed;
  if (failed) s.style.background = '#fde8e8';
</script>
`;
  const target = file.replace(/\.(md|markdown)$/i, '') + '.diagrams.html';
  writeFileSync(target, html);
  console.log(`${figures.length} diagrams -> ${target}`);
}
