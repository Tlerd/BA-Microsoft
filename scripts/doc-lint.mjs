#!/usr/bin/env node
// Checks a Markdown document against the countable rules of "80% of the way to
// ASD-STE100", and a requirements document against common requirement-writing rules.
// No model call, no network.
//
//   node doc-lint.mjs <file.md> [...]      report on the given files
//   node doc-lint.mjs --hook               PostToolUse hook: reads the event on stdin
//
// A file is checked when it is marked with `style: ste80` or a `ba_doc:` key, in
// YAML front matter or in a comment such as <!-- style: ste80 --> in its first five lines:
//
//   ---
//   style: ste80           # ste80 | plain (plain switches the checks off)
//   ba_doc: srs            # marks a requirements document and adds the REQ checks
//   lang: en               # en (default) | vi
//   req_keyword: shall     # the one verb that marks a requirement (default: shall)
//   ---
//
// CLI only: `--as ste80` checks a file that has no front matter, `--as req` adds
// the REQ checks. End a line with <!-- lint-ok --> to accept what is reported on it.

import { readFileSync, existsSync, appendFileSync } from 'node:fs';

const MAX_REPORTED = Number(process.env.DOC_LINT_MAX || 25);

// Words that leave the reader to guess.
const VAGUE_EN = [
  'acceptable', 'adequate', 'as much as practicable', 'as applicable', 'as appropriate', 'best',
  'efficient', 'fast', 'quick', 'quickly', 'rapid', 'flexible', 'versatile', 'improved', 'better',
  'faster', 'superior', 'including but not limited to', 'and so on', 'etc', 'such as',
  'in most cases', 'generally', 'usually', 'almost always', 'normally', 'ideally', 'optionally',
  'probably', 'ought to', 'reasonable', 'reasonably', 'when necessary', 'where appropriate',
  'if possible', 'robust', 'seamless', 'state-of-the-art', 'sufficient', 'timely',
  'user-friendly', 'intuitive', 'optimize', 'e\\.g\\.', 'i\\.e\\.',
];
const VAGUE_VI = [
  'v\\.v', 'vân vân', 'và/hoặc', 'nhanh chóng', 'thân thiện', 'phù hợp', 'hợp lý', 'nếu có thể',
  'khi cần', 'linh hoạt', 'tối ưu', 'dễ dàng', 'dễ sử dụng', 'kịp thời', 'tương đối',
];
const WEAK_MODALS = ['should', 'might', 'could', 'ought to', 'needs to', 'need to', 'has to', 'have to'];
const DIAGRAM_TYPES =
  /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|quadrantChart|requirementDiagram|C4Context|C4Container|block-beta|architecture-beta)\b/;

const LIMITS = {
  en: { step: 20, prose: 25, paragraph: 6 },
  // Vietnamese words are counted by syllable, so the same idea takes more tokens.
  // 28/35 is this tool's own scale, not a figure from ASD-STE100.
  vi: { step: 28, prose: 35, paragraph: 6 },
};

function parseFrontMatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  const meta = {};
  if (!m) {
    // A README has no front matter. A comment in its first five lines marks it:
    // <!-- style: ste80 -->   or   <!-- ba_doc: srs; lang: vi -->
    const c = /<!--\s*((?:[A-Za-z_]+\s*:\s*[\w-]+\s*;?\s*)+)-->/.exec(text.split(/\r?\n/).slice(0, 5).join('\n'));
    for (const kv of c ? c[1].matchAll(/([A-Za-z_]+)\s*:\s*([\w-]+)/g) : []) meta[kv[1]] = kv[2];
    return { meta, bodyStart: 0 };
  }
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_]+)\s*:\s*(.*?)\s*(#.*)?$/.exec(line);
    if (kv) meta[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return { meta, bodyStart: m[0].split(/\r?\n/).length - 1 };
}

// STE rules 8.5-8.7: text in parentheses is one word, and so is a hyphenated word.
function countWords(s) {
  return s
    .replace(/\([^)]*\)/g, ' PAREN ')
    .split(/\s+/)
    .filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
}

function splitSentences(s) {
  // Keep decimals, version numbers and one-letter list markers together.
  // A colon that ends the text closes a sentence too (STE rule 8.4).
  return s
    .split(/(?<=[.!?])(?<!\b[A-Za-z]\.)(?<!\d\.(?=\d))\s+(?=["“(\p{Lu}\p{N}])|:\s*$/u)
    .map((x) => x.trim())
    .filter((x) => countWords(x) > 0);
}

const stripInline = (s) =>
  s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`[^`]*`/g, ' CODE ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_~]+/g, '');

// forced: null (use the front matter), 'ste80', or 'req'.
function lint(text, forced) {
  const { meta, bodyStart } = parseFrontMatter(text);
  const style = (meta.style || '').toLowerCase();
  const marked = meta.ba_doc || style;
  if (!marked && !forced) return null;
  const lang = meta.lang === 'vi' ? 'vi' : 'en';
  const findings = [];
  if (style === 'plain' && !forced) return { findings, info: [], lang, req: false };

  const req = forced ? forced === 'req' : Boolean(meta.ba_doc);
  const docType = meta.ba_doc || '';
  const keyword = (meta.req_keyword || 'shall').toLowerCase();
  const limits = LIMITS[lang];
  const add = (line, rule, msg) => findings.push({ line, rule, msg });

  const lines = text.split(/\r?\n/);
  const ids = new Map();
  let tbd = 0;
  let inCode = false;
  let codeLang = '';
  let codeStart = 0;
  let codeFirst = '';
  let para = { sentences: 0, line: 0 };
  const closePara = () => {
    if (para.sentences > limits.paragraph)
      add(para.line, 'STE-6.6', `Paragraph has ${para.sentences} sentences. Maximum is ${limits.paragraph}.`);
    para = { sentences: 0, line: 0 };
  };

  for (let i = bodyStart; i < lines.length; i++) {
    const raw = lines[i];
    const n = i + 1;
    const fence = /^\s*(```|~~~)\s*([\w-]*)/.exec(raw);
    if (fence) {
      if (!inCode) {
        inCode = true;
        codeLang = fence[2];
        codeStart = n;
        codeFirst = '';
        closePara();
      } else {
        if (codeLang === 'mermaid') {
          if (!DIAGRAM_TYPES.test(codeFirst.trim()))
            add(codeStart, 'DIAG-TYPE', `Mermaid block does not start with a diagram type (found "${codeFirst.trim().slice(0, 30)}").`);
          const after = lines.slice(i + 1, i + 4).join(' ');
          if (!/(Figure|Hình)\s+\d+/i.test(after))
            add(codeStart, 'DIAG-CAPTION', 'Diagram has no caption. Add "Figure N. <title>" on the line after the block.');
        }
        inCode = false;
      }
      continue;
    }
    if (inCode) {
      if (!codeFirst && raw.trim() && !/^\s*(%%|---)/.test(raw) && !/^\s*\w+:/.test(raw)) codeFirst = raw;
      continue;
    }
    if (/<!--\s*lint-ok\s*-->/.test(raw)) continue;
    if (/^\s*$/.test(raw)) {
      closePara();
      continue;
    }
    if (/^\s*#{1,6}\s/.test(raw) || /^\s*\|?\s*:?-{3,}/.test(raw)) {
      closePara();
      continue;
    }

    tbd += (raw.match(/\bTBD\b/g) || []).length;

    const isStep = /^\s*(\d+[.)]|[-*+])\s+/.test(raw);
    const isTable = raw.includes('|');
    const cells = (isTable ? raw.split('|') : [raw]).map((c) =>
      stripInline(c).replace(/^\s*(\d+[.)]|[-*+]|>)\s+/, '').trim(),
    );

    // A label at the start of a line or table cell defines that item.
    let labelled = false;
    if (req)
      for (const c of cells) {
        const id = /^((?:[A-Z]{2,5}-\d+(?:\.\d+)*)|(?:[A-Z][A-Za-z]+(?:\.[A-Z][A-Za-z0-9]+)+))\s*[:.]?(\s|$)/.exec(c);
        if (!id) continue;
        labelled = true;
        if (ids.has(id[1])) add(n, 'REQ-ID', `Label ${id[1]} is already defined on line ${ids.get(id[1])}.`);
        else ids.set(id[1], n);
      }

    for (const cell of cells) {
      if (!cell) continue;
      const sentences = splitSentences(cell);
      if (!isStep && !isTable) {
        if (!para.line) para.line = n;
        para.sentences += sentences.length;
      }
      for (const s of sentences) {
        const wc = countWords(s);
        const max = isStep ? limits.step : limits.prose;
        if (wc > max) add(n, isStep ? 'STE-5.1' : 'STE-6.3', `Sentence has ${wc} words. Maximum is ${max}: "${s.slice(0, 60)}..."`);
        if (lang !== 'en' || !req) continue;

        const low = ` ${s.toLowerCase()} `;
        if (new RegExp(`\\b(${keyword}|must)\\b`).test(low)) {
          if (/\b(is|are|be|been|being|was|were)\s+(\w+ed|shown|given|sent|made|done|taken|written|chosen|kept|held|paid|sold|built|found|set)\b/.test(low))
            add(n, 'REQ-ACTIVE', `Requirement is in the passive voice. Name the actor: "${s.slice(0, 60)}..."`);
          if (/\b(unless|except|but)\b/.test(low))
            add(n, 'REQ-SPLIT', `"unless/except/but" joins two requirements. Write one requirement for each condition: "${s.slice(0, 60)}..."`);
          const other = keyword === 'must' ? 'shall' : 'must';
          if (docType === 'srs' && labelled && new RegExp(`\\b${other}\\b`).test(low) && !new RegExp(`\\b${keyword}\\b`).test(low))
            add(n, 'REQ-KEYWORD', `Document keyword is "${keyword}". This requirement uses "${other}".`);
        }
        // Outside a labelled requirement these verbs are ordinary prose.
        for (const m of labelled ? WEAK_MODALS : [])
          if (new RegExp(`\\b${m}\\b`).test(low)) add(n, 'REQ-KEYWORD', `"${m}" does not tell the reader if this is a requirement. Use "${keyword}", or state a fact.`);
      }
    }

    const flat = stripInline(raw);
    if (/;/.test(flat.replace(/&\w+;/g, ''))) add(n, 'STE-8.1', 'Semicolon. Write two sentences or a vertical list.');
    if (lang === 'en' && /\b(\w+n['’]t|it['’]s|\w+['’](re|ll|ve|d))\b/i.test(flat)) add(n, 'STE-4.2', 'Contraction. Write the words in full.');
    if (!req) continue;
    if (lang === 'en' && /\band\/or\b/i.test(flat)) add(n, 'REQ-ANDOR', '"and/or": say "and", "or", or "any combination of".');
    const vague = lang === 'vi' ? VAGUE_VI : VAGUE_EN;
    const hit = vague.filter((t) => new RegExp(`(^|[^\\p{L}])${t}([^\\p{L}]|$)`, 'iu').test(flat));
    if (hit.length) add(n, 'REQ-VAGUE', `Vague: ${hit.map((h) => h.replace(/\\/g, '')).join(', ')}. Give a value, a full list, or the condition.`);
  }
  closePara();

  const info = [];
  if (tbd) info.push(`${tbd} TBD still open.`);
  if (ids.size) info.push(`${ids.size} labelled items.`);
  return { findings, info, lang, req };
}

function format(file, result) {
  const { findings, info, lang, req } = result;
  const byRule = {};
  for (const f of findings) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
  const head = `${file} [${req ? 'requirements' : 'document'}, lang: ${lang}] ${findings.length} findings` +
    (findings.length ? ` (${Object.entries(byRule).map(([r, c]) => `${r}: ${c}`).join(', ')})` : '');
  const body = findings.slice(0, MAX_REPORTED).map((f) => `  line ${f.line}  ${f.rule}  ${f.msg}`);
  if (findings.length > MAX_REPORTED) body.push(`  ... ${findings.length - MAX_REPORTED} more. Fix these, then save again.`);
  return [head, ...body, ...info.map((x) => `  note: ${x}`)].join('\n');
}

async function readStdin() {
  let data = '';
  for await (const chunk of process.stdin) data += chunk;
  return data;
}

const args = process.argv.slice(2);
if (args[0] === '--hook') {
  let event = {};
  try {
    event = JSON.parse(await readStdin());
  } catch {
    process.exit(0);
  }
  const file = event?.tool_input?.file_path;
  // Set DOC_LINT_TRACE to a file path to record each hook call.
  if (process.env.DOC_LINT_TRACE)
    appendFileSync(process.env.DOC_LINT_TRACE, `${new Date().toISOString()} ${event?.tool_name || '?'} ${file}\n`);
  if (!file || !/\.(md|markdown)$/i.test(file) || !existsSync(file)) process.exit(0);
  const result = lint(readFileSync(file, 'utf8'), null);
  if (!result || result.findings.length === 0) process.exit(0);
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext:
          'doc-lint checked the document you saved.\n' + format(file, result) +
          '\nFix each finding in the file. To keep a line as it is, end it with <!-- lint-ok --> and tell the user why.',
      },
    }),
  );
  process.exit(0);
}

let forced = null;
const files = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--as') forced = args[++i] === 'req' ? 'req' : 'ste80';
  else files.push(args[i]);
}
if (!files.length) {
  console.error('Usage: node doc-lint.mjs [--as ste80|req] <file.md> [...]');
  process.exit(1);
}
let total = 0;
for (const f of files) {
  const result = lint(readFileSync(f, 'utf8'), forced);
  if (!result) {
    console.log(`${f}: skipped, front matter has no style or ba_doc key (use --as ste80 or --as req to check it anyway)`);
    continue;
  }
  total += result.findings.length;
  console.log(format(f, result));
}
process.exit(total ? 1 : 0);
