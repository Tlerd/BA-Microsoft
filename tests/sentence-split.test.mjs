// Tests for the sentence split in scripts/doc-lint.mjs. Run: node --test tests/sentence-split.test.mjs
// Each fixture paragraph has 7 sentences, one more than the paragraph limit.
// So the STE-6.6 finding on that line shows how many sentences the script found.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts', 'doc-lint.mjs');

// Returns the finding lines as { line, rule, msg }.
function lint(file) {
  const run = spawnSync(process.execPath, [script, join(root, file)], { encoding: 'utf8' });
  assert.match(run.stdout, / \d+ findings/, `no report for ${file}: ${run.stderr}`);
  return [...run.stdout.matchAll(/^ {2}line (\d+) {2}(\S+) {2}(.*)$/gm)].map((m) => ({
    line: Number(m[1]),
    rule: m[2],
    msg: m[3],
  }));
}

// The sentence count that STE-6.6 reports for the paragraph on this line.
function sentencesOn(findings, line) {
  const f = findings.find((x) => x.line === line && x.rule === 'STE-6.6');
  return f ? Number(/has (\d+) sentences/.exec(f.msg)[1]) : null;
}

const vi = 'tests/fixtures/sentences-vi.md';
const en = 'tests/fixtures/sentences-en.md';

test('vi: a word that ends in "tắc." closes the sentence', () => {
  assert.equal(sentencesOn(lint(vi), 10), 7);
});

test('vi: a word that ends in "người." closes the sentence', () => {
  assert.equal(sentencesOn(lint(vi), 12), 7);
});

test('vi: decomposed (NFD) text splits the same way', () => {
  assert.equal(sentencesOn(lint(vi), 14), 7);
});

test('vi: "chính." closes the sentence (the case that worked before)', () => {
  assert.equal(sentencesOn(lint(vi), 16), 7);
});

test('vi: two short sentences do not give a length finding', () => {
  assert.deepEqual(lint(vi).filter((f) => f.rule === 'STE-6.3'), []);
});

test('en: "e.g." does not close the sentence', () => {
  assert.equal(sentencesOn(lint(en), 9), 7);
});

test('en: "i.e." does not close the sentence', () => {
  assert.equal(sentencesOn(lint(en), 11), 7);
});

test('en: a one-letter list marker stays with its item', () => {
  assert.equal(sentencesOn(lint(en), 13), 7);
});

test('en: decimals and version numbers stay in one sentence', () => {
  assert.equal(sentencesOn(lint(en), 15), 7);
});

test('en: a colon that ends the text closes the last sentence', () => {
  assert.equal(sentencesOn(lint(en), 17), 7);
});
