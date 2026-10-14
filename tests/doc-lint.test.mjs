// Tests for scripts/doc-lint.mjs. Run: node --test tests/doc-lint.test.mjs
// Each test runs the script on a fixture file and reads the report it prints.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts', 'doc-lint.mjs');

// Returns the finding lines as { line, rule } and the exit code.
function lint(file) {
  const run = spawnSync(process.execPath, [script, join(root, file)], { encoding: 'utf8' });
  const findings = [...run.stdout.matchAll(/^ {2}line (\d+) {2}(\S+) {2}(.*)$/gm)].map((m) => ({
    line: Number(m[1]),
    rule: m[2],
    msg: m[3],
  }));
  assert.match(run.stdout, / \d+ findings/, `no report for ${file}: ${run.stderr}`);
  return { findings, status: run.status, out: run.stdout };
}

const rules = (r) => r.findings.map((f) => f.rule);

test('acceptance: a repeated AC-n gives AC-DUP', () => {
  const r = lint('tests/fixtures/acceptance-dup.md');
  assert.deepEqual(rules(r), ['AC-DUP']);
  assert.equal(r.findings[0].line, 15);
  assert.match(r.findings[0].msg, /AC-1/);
  assert.equal(r.status, 1);
});

test('acceptance: the same line is not also reported as REQ-ID', () => {
  const r = lint('tests/fixtures/acceptance-dup.md');
  assert.equal(rules(r).includes('REQ-ID'), false);
});

test('acceptance: criteria that share an origin give 0 findings', () => {
  const r = lint('tests/fixtures/acceptance-ok.md');
  assert.deepEqual(r.findings, []);
  assert.equal(r.status, 0);
});

test('business rules: a repeated BR-n still gives REQ-ID', () => {
  const r = lint('tests/fixtures/business-rules-dup.md');
  assert.deepEqual(rules(r), ['REQ-ID']);
});

test('example set: courtbook documents give 0 findings', () => {
  for (const f of ['use-cases', 'business-rules', 'glossary', 'models', 'acceptance']) {
    const r = lint(`examples/courtbook/${f}.md`);
    assert.deepEqual(r.findings, [], `${f}.md`);
  }
});

test('example set: each origin in acceptance.md exists in the other documents', () => {
  const dir = join(root, 'examples', 'courtbook');
  const known = readFileSync(join(dir, 'use-cases.md'), 'utf8') + readFileSync(join(dir, 'business-rules.md'), 'utf8');
  const rows = readFileSync(join(dir, 'acceptance.md'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => /^\| AC-\d+ /.test(l));
  assert.ok(rows.length >= 1);
  for (const row of rows) {
    const origin = row.split('|').slice(-2)[0];
    const labels = origin.match(/\b(UC-\d+|BR-\d+|PRE-\d+|POST-\d+|\d+\.\d+(\.E\d+)?)\b/g) || [];
    assert.ok(labels.length >= 1, `no origin in "${row.slice(0, 8)}"`);
    for (const label of labels) assert.ok(known.includes(label), `${label} is not defined`);
  }
});
