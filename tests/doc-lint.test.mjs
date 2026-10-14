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
  for (const f of ['use-cases', 'business-rules', 'glossary', 'models', 'acceptance', 'test-plan']) {
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

test('backlog: stories that share an origin give 0 findings', () => {
  const r = lint('tests/fixtures/backlog-ok.md');
  assert.deepEqual(r.findings, []);
  assert.equal(r.status, 0);
});

test('backlog: a repeated US-n gives REQ-ID on the repeated line', () => {
  const r = lint('tests/fixtures/backlog-dup.md');
  assert.deepEqual(rules(r), ['REQ-ID']);
  assert.equal(r.findings[0].line, 12);
  assert.match(r.findings[0].msg, /US-1/);
});

test('example set: backlog.md gives 0 findings', () => {
  const r = lint('examples/courtbook/backlog.md');
  assert.deepEqual(r.findings, []);
  assert.equal(r.status, 0);
});

test('example set: every use case has a story, and every cited label exists', () => {
  const dir = join(root, 'examples', 'courtbook');
  const read = (f) => readFileSync(join(dir, f), 'utf8');
  const rows = read('backlog.md')
    .split(/\r?\n/)
    .filter((l) => /^\| US-\d+ /.test(l))
    .map((l) => l.split('|').map((c) => c.trim()));
  assert.ok(rows.length >= 1);
  const useCases = [...read('use-cases.md').matchAll(/^\| ID and Name \| (UC-\d+) /gm)].map((m) => m[1]);
  assert.ok(useCases.length >= 1);
  // Cells: 0 is empty, 1 US-n, 2 story, 3 origin, 4 priority, 5 estimate, 6 sprint, 7 status, 8 AC labels.
  const origins = new Set(rows.map((c) => c[3]));
  for (const uc of useCases) assert.ok(origins.has(uc), `${uc} has no story`);
  for (const o of origins) assert.ok(useCases.includes(o), `origin ${o} is not a use case`);
  const criteria = new Set([...read('acceptance.md').matchAll(/^\| (AC-\d+) /gm)].map((m) => m[1]));
  for (const c of rows) {
    assert.match(c[7], /^(planned|in sprint|done)$/, c[1]);
    const cited = c[8].match(/AC-\d+/g) || [];
    assert.ok(cited.length >= 1, `${c[1]} cites no criterion`);
    for (const ac of cited) assert.ok(criteria.has(ac), `${ac} does not exist`);
    assert.match(c[2], /^As an? [A-Z][\w ]+, I want .+, so that .+\.$/, c[1]);
    assert.doesNotMatch(c[2], /\bstep\b/i, `${c[1]} repeats use case steps`);
  }
});

test('test plan: an AC-n with two tests gives 0 findings', () => {
  const r = lint('tests/fixtures/test-plan-ok.md');
  assert.deepEqual(r.findings, []);
  assert.equal(r.status, 0);
});

test('example set: test-plan.md gives 0 findings', () => {
  const r = lint('examples/courtbook/test-plan.md');
  assert.deepEqual(r.findings, []);
  assert.equal(r.status, 0);
});

test('example set: every AC-n has a coverage row, and a test name starts with its label', () => {
  const dir = join(root, 'examples', 'courtbook');
  const read = (f) => readFileSync(join(dir, f), 'utf8');
  const criteria = [...read('acceptance.md').matchAll(/^\| (AC-\d+) /gm)].map((m) => m[1]);
  assert.ok(criteria.length >= 1);
  const plan = read('test-plan.md');
  const rows = plan
    .split(/\r?\n/)
    .filter((l) => /^\| AC-\d+ \|/.test(l))
    .map((l) => l.split('|').map((c) => c.trim()));
  // Cells: 0 is empty, 1 AC-n, 2 test name, 3 level, 4 status.
  for (const c of rows) {
    assert.ok(c[2].startsWith(`${c[1]}: `), `${c[2]} does not start with ${c[1]}`);
    assert.match(c[4], /^(planned|written|passing|failing)$/, c[2]);
  }
  for (const ac of criteria) assert.ok(rows.some((c) => c[1] === ac), `${ac} has no coverage row`);
  // The example shows a criterion with two tests.
  assert.ok(criteria.some((ac) => rows.filter((c) => c[1] === ac).length === 2));
  // Every label that the plan cites exists in the set.
  const known = ['use-cases.md', 'business-rules.md', 'acceptance.md'].map(read).join('\n');
  for (const label of new Set(plan.match(/\b(UC|BR|AC)-\d+\b/g))) assert.ok(known.includes(label), `${label} is not defined`);
});
