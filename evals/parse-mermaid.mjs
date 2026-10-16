#!/usr/bin/env node
// Parses the Mermaid blocks in the replies of an eval run and counts the failures.
// The eval tool has no custom-code grader, so this check runs after the eval.
//
//   claude plugin eval . --case diagrams-state --runs 10 --ablation none --keep-temp --json out.json
//   node evals/parse-mermaid.mjs out.json
//
// --keep-temp keeps the trace files that this script reads.
// The script needs the packages `mermaid` and `jsdom`. They are not part of the plugin.
// Install them one time in a folder outside the repository, then name the folder:
//
//   npm install --prefix ~/mermaid-check mermaid@11.5.0 jsdom
//   MERMAID_DIR=~/mermaid-check node evals/parse-mermaid.mjs out.json

import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const resultFile = process.argv[2];
const dir = process.env.MERMAID_DIR;
if (!resultFile || !dir) {
  console.error('usage: MERMAID_DIR=<folder with mermaid and jsdom> node evals/parse-mermaid.mjs <result.json>');
  process.exit(2);
}

const require = createRequire(path.join(path.resolve(dir), 'x.js'));
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><body></body></html>');
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
const entry = path.join(path.resolve(dir), 'node_modules', 'mermaid', 'dist', 'mermaid.core.mjs');
const mermaid = (await import(pathToFileURL(entry).href)).default;

function finalText(tracePath) {
  const lines = readFileSync(tracePath, 'utf8').trim().split('\n');
  let text = '';
  for (const line of lines) {
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.type === 'result' && typeof msg.result === 'string') text = msg.result;
  }
  return text;
}

const result = JSON.parse(readFileSync(resultFile, 'utf8'));
let blocks = 0;
let failures = 0;
let runs = 0;
for (const c of result.cases) {
  for (const arm of ['with', 'without']) {
    for (const [i, run] of (c.arms[arm] || []).entries()) {
      if (!run.tracePath || !existsSync(run.tracePath)) {
        console.log(`${c.name} ${arm} #${i + 1}: no trace file (run with --keep-temp)`);
        continue;
      }
      runs += 1;
      const found = [...finalText(run.tracePath).matchAll(/```mermaid\r?\n([\s\S]*?)```/g)];
      if (found.length === 0) console.log(`${c.name} ${arm} #${i + 1}: no Mermaid block`);
      for (const m of found) {
        blocks += 1;
        try {
          await mermaid.parse(m[1]);
          console.log(`${c.name} ${arm} #${i + 1}: parses`);
        } catch (e) {
          failures += 1;
          console.log(`${c.name} ${arm} #${i + 1}: PARSE ERROR ${String(e.message || e).split('\n')[0]}`);
        }
      }
    }
  }
}
console.log(`${runs} runs, ${blocks} Mermaid blocks, ${failures} do not parse.`);
process.exit(failures ? 1 : 0);
