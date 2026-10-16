#!/usr/bin/env node
// Builds one self-contained interactive HTML page from a handbook data file.
// No network: the page has no CDN links, so it opens offline and from a file share.
//
// Usage: node handbook-build.mjs <name.handbook.json> [-o <out.html>]
// Default output: <name>.html next to the data file.
//
// The data file is checked before the page is written. Each item must cite at
// least one source id from `sources`, or carry "basis": "proposal" so the page
// labels it as the author's own proposal. A check failure prints one line for each
// problem and exits with code 1.

import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const KINDS = new Set(['catalog', 'pipeline']);
const LABELS = {
  vi: { all: 'Tất cả', search: 'Tìm', prev: 'Bước trước', next: 'Bước tiếp', sources: 'Nguồn', proposal: 'Đề xuất của tác giả, chưa có nguồn', empty: 'Không có mục nào khớp. Xóa ô tìm hoặc chọn nhóm khác.', step: 'Bước', updated: 'Cập nhật', list: 'Danh sách', allSources: 'Tất cả nguồn' },
  en: { all: 'All', search: 'Search', prev: 'Previous step', next: 'Next step', sources: 'Sources', proposal: "Author's proposal, no source yet", empty: 'No item matches. Clear the search or pick another group.', step: 'Step', updated: 'Updated', list: 'List', allSources: 'All sources' },
};

export function check(data) {
  const errors = [];
  if (!data || typeof data !== 'object') return ['The file is not a JSON object.'];
  if (!data.title) errors.push('"title" is missing.');
  if (!Array.isArray(data.sections) || !data.sections.length) errors.push('"sections" must be a non-empty array.');
  const sourceIds = new Set();
  for (const [i, s] of (data.sources || []).entries()) {
    if (!s.id || !s.title) errors.push(`sources[${i}] needs "id" and "title".`);
    if (sourceIds.has(s.id)) errors.push(`Source id "${s.id}" is used two times.`);
    sourceIds.add(s.id);
    if (s.url && !/^https?:\/\//.test(s.url)) errors.push(`Source "${s.id}" has a URL that does not start with http: ${s.url}`);
  }
  const ids = new Set();
  for (const [si, sec] of (data.sections || []).entries()) {
    const where = `sections[${si}]`;
    if (!sec.id || !sec.title) errors.push(`${where} needs "id" and "title".`);
    if (ids.has(sec.id)) errors.push(`Id "${sec.id}" is used two times.`);
    ids.add(sec.id);
    if (!KINDS.has(sec.kind)) errors.push(`${where} "kind" must be "catalog" or "pipeline", not "${sec.kind}".`);
    if (!Array.isArray(sec.items) || !sec.items.length) {
      errors.push(`${where} needs a non-empty "items" array.`);
      continue;
    }
    for (const [ii, it] of sec.items.entries()) {
      const w = `${sec.id || where} item ${ii + 1}`;
      if (!it.id || !it.title) errors.push(`${w} needs "id" and "title".`);
      const key = `${sec.id}/${it.id}`;
      if (ids.has(key)) errors.push(`Item id "${it.id}" is used two times in section "${sec.id}".`);
      ids.add(key);
      const cited = it.sources || [];
      if (!cited.length && it.basis !== 'proposal')
        errors.push(`${w} ("${it.title}") cites no source. Add a source id, or set "basis": "proposal".`);
      for (const c of cited) if (!sourceIds.has(c)) errors.push(`${w} cites "${c}", which is not in "sources".`);
      for (const [fi, f] of (it.fields || []).entries())
        if (!f.label || (typeof f.value !== 'string' && !Array.isArray(f.value)))
          errors.push(`${w} field ${fi + 1} needs "label" and a "value" that is a string or a list of strings.`);
    }
  }
  return errors;
}

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// JSON inside <script> must not close the tag or start a comment.
const safeJson = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

export function render(data) {
  const lang = data.lang === 'en' ? 'en' : 'vi';
  const L = LABELS[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(data.title)}</title>
<style>
:root {
  --bg: #f4f7f5; --surface: #ffffff; --ink: #13201b; --muted: #55665e; --line: #c9d6cf;
  --court: #1d6a50; --court-soft: #e3efe9; --ball: #c9d32a; --ball-ink: #2b2f05; --focus: #0b5cad;
  --display: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Arial Narrow", system-ui, sans-serif;
  --body: "Segoe UI Variable Text", "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0e1814; --surface: #15231d; --ink: #e4ede8; --muted: #9db0a6; --line: #2c3f36;
    --court: #5fbf98; --court-soft: #1b3229; --ball: #d6df3c; --ball-ink: #1b1e02; --focus: #8cc4ff;
  }
}
* { box-sizing: border-box; }
html, body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.6 var(--body); }
a { color: var(--court); }
:focus-visible { outline: 3px solid var(--focus); outline-offset: 2px; }
header { padding: 2.5rem 16px 1.5rem; max-width: 1180px; margin: 0 auto; }
h1 { font: 600 clamp(1.9rem, 4vw, 2.9rem)/1.1 var(--display); margin: 0 0 .5rem; letter-spacing: .01em; }
.sub { color: var(--muted); max-width: 70ch; margin: 0; }
.meta { color: var(--muted); font-size: .85rem; margin-top: .75rem; }
nav.tabs { display: flex; gap: .25rem; overflow-x: auto; padding: 0 16px; max-width: 1180px; margin: 0 auto; border-bottom: 2px solid var(--line); }
nav.tabs button { font: 600 1rem var(--display); background: none; border: 0; color: var(--muted); padding: .7rem .9rem; cursor: pointer; white-space: nowrap; border-bottom: 4px solid transparent; margin-bottom: -2px; }
nav.tabs button[aria-selected="true"] { color: var(--ink); border-bottom-color: var(--court); }
main { max-width: 1180px; margin: 0 auto; padding: 1.5rem 16px 4rem; }
section[hidden] { display: none; }
.intro { max-width: 75ch; margin: 0 0 1.25rem; }
/* Pipeline: the stage markers sit on one court line. */
.lane { position: relative; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(7.5rem, 1fr); gap: .5rem; overflow-x: auto; padding: 1.25rem 0 .5rem; }
.lane::before { content: ""; position: absolute; left: 1.1rem; right: 1.1rem; top: 2.35rem; height: 3px; background: var(--court); opacity: .55; }
.stop { position: relative; background: none; border: 0; text-align: left; padding: 0 .25rem; cursor: pointer; color: var(--ink); font: inherit; }
.stop .dot { display: grid; place-items: center; width: 2.3rem; height: 2.3rem; border-radius: 50%; background: var(--surface); border: 3px solid var(--court); font: 700 1rem var(--display); color: var(--court); position: relative; }
.stop .t { display: block; margin-top: .45rem; font: 600 .95rem/1.25 var(--display); }
.stop .g { display: block; color: var(--muted); font-size: .8rem; }
.stop[aria-current="step"] .dot { background: var(--ball); color: var(--ball-ink); border-color: var(--ball); transform: scale(1.12); transition: transform .15s; }
.steps-nav { display: flex; gap: .5rem; margin: 1rem 0; }
.btn { font: 600 .9rem var(--body); padding: .5rem .9rem; border-radius: 6px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
.btn:hover { border-color: var(--court); }
/* Catalog: list on the left, detail on the right. */
.cat { display: grid; grid-template-columns: minmax(16rem, 22rem) 1fr; gap: 1.5rem; align-items: start; }
.tools { display: flex; flex-direction: column; gap: .6rem; margin-bottom: .75rem; }
.chips { display: flex; flex-wrap: wrap; gap: .35rem; }
.chip { font: 500 .85rem var(--body); padding: .25rem .65rem; border-radius: 999px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--court); border-color: var(--court); color: var(--bg); }
input[type=search] { font: inherit; padding: .5rem .7rem; border-radius: 6px; border: 1.5px solid var(--line); background: var(--surface); color: var(--ink); width: 100%; }
ul.items { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
ul.items button { display: block; width: 100%; text-align: left; background: none; border: 0; border-bottom: 1px solid var(--line); padding: .6rem .5rem; cursor: pointer; color: var(--ink); font: inherit; }
ul.items button[aria-current="true"] { background: var(--court-soft); box-shadow: inset 4px 0 0 var(--court); }
ul.items .t { font-weight: 600; display: block; }
ul.items .g { color: var(--muted); font-size: .82rem; }
.empty { color: var(--muted); padding: 1rem .5rem; }
article.detail { background: var(--surface); border: 1.5px solid var(--line); border-radius: 10px; padding: 1.25rem 1.4rem 1.4rem; position: sticky; top: 1rem; }
article.detail h2 { font: 600 1.6rem/1.2 var(--display); margin: 0 0 .2rem; }
article.detail .group { color: var(--court); font-weight: 600; font-size: .9rem; margin: 0 0 .8rem; }
article.detail .summary { margin: 0 0 1rem; max-width: 70ch; }
dl { margin: 0; display: grid; grid-template-columns: minmax(8rem, 12rem) 1fr; gap: .55rem 1.2rem; }
dt { font-weight: 600; color: var(--muted); }
dd { margin: 0; }
dd ul { margin: 0; padding-left: 1.1rem; }
.cite { margin-top: 1.1rem; padding-top: .8rem; border-top: 1px dashed var(--line); font-size: .85rem; color: var(--muted); }
.proposal { display: inline-block; background: var(--ball); color: var(--ball-ink); font-weight: 600; padding: .05rem .5rem; border-radius: 4px; }
footer { max-width: 1180px; margin: 0 auto; padding: 0 16px 3rem; font-size: .88rem; color: var(--muted); }
footer ol { padding-left: 1.4rem; }
@media (max-width: 760px) {
  .cat { grid-template-columns: 1fr; }
  article.detail { position: static; }
  dl { grid-template-columns: 1fr; gap: .15rem; }
  dd { margin-bottom: .5rem; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
</head>
<body>
<header>
  <h1>${esc(data.title)}</h1>
  ${data.subtitle ? `<p class="sub">${esc(data.subtitle)}</p>` : ''}
  ${data.updated ? `<p class="meta">${L.updated}: ${esc(data.updated)}</p>` : ''}
</header>
<nav class="tabs" role="tablist"></nav>
<main></main>
<footer></footer>
<script id="data" type="application/json">${safeJson(data)}</script>
<script>
const D = JSON.parse(document.getElementById('data').textContent);
const L = ${JSON.stringify(L)};
const SRC = Object.fromEntries((D.sources || []).map((s) => [s.id, s]));
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat(Infinity)) if (c != null && c !== false) el.append(c);
  return el;
};
const nav = document.querySelector('nav.tabs');
const main = document.querySelector('main');
const state = {};

function detail(it) {
  const fields = (it.fields || []).map((f) => [
    h('dt', { text: f.label }),
    h('dd', {}, Array.isArray(f.value) ? h('ul', {}, f.value.map((v) => h('li', { text: v }))) : f.value),
  ]);
  const cites = (it.sources || []).map((id) => SRC[id]);
  return h('article', { class: 'detail', 'aria-live': 'polite' },
    h('h2', { text: it.title }),
    it.group ? h('p', { class: 'group', text: it.group }) : null,
    it.summary ? h('p', { class: 'summary', text: it.summary }) : null,
    fields.length ? h('dl', {}, fields) : null,
    h('div', { class: 'cite' },
      it.basis === 'proposal' && !cites.length ? h('span', { class: 'proposal', text: L.proposal }) :
      [L.sources + ': ', cites.map((s, i) => [i ? ', ' : '', s.url ? h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title) : s.title]),
       it.basis === 'proposal' ? [' · ', h('span', { class: 'proposal', text: L.proposal })] : null]));
}

function renderPipeline(sec, root) {
  const st = state[sec.id] ??= { i: 0 };
  root.replaceChildren(
    sec.intro ? h('p', { class: 'intro', text: sec.intro }) : null,
    h('div', { class: 'lane', role: 'list' }, sec.items.map((it, i) =>
      h('button', { class: 'stop', role: 'listitem', 'aria-current': i === st.i ? 'step' : false, onclick: () => { st.i = i; renderPipeline(sec, root); } },
        h('span', { class: 'dot', text: String(i + 1) }),
        h('span', { class: 't', text: it.title }),
        it.group ? h('span', { class: 'g', text: it.group }) : null))),
    h('div', { class: 'steps-nav' },
      h('button', { class: 'btn', onclick: () => { st.i = (st.i - 1 + sec.items.length) % sec.items.length; renderPipeline(sec, root); } }, L.prev),
      h('button', { class: 'btn', onclick: () => { st.i = (st.i + 1) % sec.items.length; renderPipeline(sec, root); } }, L.next),
      h('span', { class: 'g', style: 'align-self:center;color:var(--muted)', text: L.step + ' ' + (st.i + 1) + '/' + sec.items.length })),
    detail(sec.items[st.i]));
}

function renderCatalog(sec, root) {
  const st = state[sec.id] ??= { group: null, q: '', id: sec.items[0].id };
  const groups = [...new Set(sec.items.map((it) => it.group).filter(Boolean))];
  const text = (it) => [it.title, it.group, it.summary, ...(it.fields || []).flatMap((f) => [f.label, ...[].concat(f.value)])].join(' ').toLowerCase();
  const shown = sec.items.filter((it) => (!st.group || it.group === st.group) && (!st.q || text(it).includes(st.q.toLowerCase())));
  const current = shown.find((it) => it.id === st.id) || shown[0];
  const list = h('ul', { class: 'items', 'aria-label': L.list }, shown.map((it) =>
    h('li', {}, h('button', { 'aria-current': it === current ? 'true' : false, onclick: () => { st.id = it.id; renderCatalog(sec, root); } },
      h('span', { class: 't', text: it.title }), it.group ? h('span', { class: 'g', text: it.group }) : null))));
  const search = h('input', { type: 'search', placeholder: L.search, 'aria-label': L.search, value: st.q,
    oninput: (e) => { st.q = e.target.value; renderCatalog(sec, root); root.querySelector('input').focus(); } });
  root.replaceChildren(
    sec.intro ? h('p', { class: 'intro', text: sec.intro }) : null,
    h('div', { class: 'cat' },
      h('div', {},
        h('div', { class: 'tools' },
          groups.length > 1 ? h('div', { class: 'chips' },
            h('button', { class: 'chip', 'aria-pressed': String(!st.group), onclick: () => { st.group = null; renderCatalog(sec, root); } }, L.all + ' (' + sec.items.length + ')'),
            groups.map((g) => h('button', { class: 'chip', 'aria-pressed': String(st.group === g), onclick: () => { st.group = g; renderCatalog(sec, root); } }, g))) : null,
          search),
        shown.length ? list : h('p', { class: 'empty', text: L.empty })),
      current ? detail(current) : h('div')));
  const inp = root.querySelector('input');
  inp.setSelectionRange(inp.value.length, inp.value.length);
}

const panels = D.sections.map((sec, i) => {
  const panel = h('section', { id: 'p-' + sec.id, role: 'tabpanel', hidden: i !== 0 });
  main.append(panel);
  (sec.kind === 'pipeline' ? renderPipeline : renderCatalog)(sec, panel);
  return panel;
});
const tabs = D.sections.map((sec, i) => h('button', { role: 'tab', 'aria-selected': String(i === 0), 'aria-controls': 'p-' + sec.id,
  onclick: () => { tabs.forEach((t, j) => t.setAttribute('aria-selected', String(j === i))); panels.forEach((p, j) => (p.hidden = j !== i)); } }, sec.title));
if (tabs.length > 1) nav.append(...tabs); else nav.remove();
if (D.sources && D.sources.length)
  document.querySelector('footer').append(h('h2', { style: 'font: 600 1.1rem var(--display)', text: L.allSources }),
    h('ol', {}, D.sources.map((s) => h('li', {}, '[' + s.id + '] ', s.url ? h('a', { href: s.url, target: '_blank', rel: 'noopener' }, s.title) : s.title))));
</script>
</body>
</html>
`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const oi = args.indexOf('-o');
  const out = oi >= 0 ? args.splice(oi, 2)[1] : null;
  const file = args[0];
  if (!file) {
    console.error('Usage: node handbook-build.mjs <name.handbook.json> [-o <out.html>]');
    process.exit(1);
  }
  let data;
  try {
    data = JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
  } catch (e) {
    console.error(`${file}: cannot read the JSON: ${e.message}`);
    process.exit(1);
  }
  const errors = check(data);
  if (errors.length) {
    console.error(`${file}: ${errors.length} problems`);
    for (const e of errors) console.error('  ' + e);
    process.exit(1);
  }
  const target = out || file.replace(/(\.handbook)?\.json$/i, '') + '.html';
  writeFileSync(target, render(data));
  const items = data.sections.reduce((n, s) => n + s.items.length, 0);
  console.log(`${target}: ${data.sections.length} sections, ${items} items, ${(data.sources || []).length} sources`);
}
