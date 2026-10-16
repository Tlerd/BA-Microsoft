// Tests for scripts/handbook-build.mjs. Run: node --test tests/handbook-build.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { check, render } from '../scripts/handbook-build.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const script = join(root, 'scripts', 'handbook-build.mjs');

const good = () => ({
  title: 'Handbook',
  lang: 'en',
  sources: [{ id: 'S1', title: 'Source one', url: 'https://example.com/a' }],
  sections: [
    { id: 'flow', title: 'Flow', kind: 'pipeline', items: [{ id: 'a', title: 'Step A', sources: ['S1'] }] },
    {
      id: 'cat',
      title: 'Catalog',
      kind: 'catalog',
      items: [
        { id: 'x', title: 'Item X', group: 'G1', sources: ['S1'], fields: [{ label: 'When', value: ['one', 'two'] }] },
        { id: 'y', title: 'Item Y', group: 'G2', basis: 'proposal' },
      ],
    },
  ],
});

test('a valid file has no problems', () => {
  assert.deepEqual(check(good()), []);
});

test('an item without a source or a proposal basis is a problem', () => {
  const d = good();
  delete d.sections[1].items[1].basis;
  assert.match(check(d).join('\n'), /"Item Y"\) cites no source/);
});

test('a cited source id must exist', () => {
  const d = good();
  d.sections[0].items[0].sources = ['S9'];
  assert.match(check(d).join('\n'), /cites "S9", which is not in "sources"/);
});

test('a duplicate item id in one section is a problem', () => {
  const d = good();
  d.sections[1].items[1].id = 'x';
  assert.match(check(d).join('\n'), /Item id "x" is used two times/);
});

test('an unknown section kind is a problem', () => {
  const d = good();
  d.sections[0].kind = 'tree';
  assert.match(check(d).join('\n'), /must be "catalog" or "pipeline"/);
});

test('the page has no network links except the cited sources', () => {
  const html = render(good());
  const urls = [...html.matchAll(/https?:\/\/[^\s"'<)]+/g)].map((m) => m[0]);
  assert.deepEqual([...new Set(urls)], ['https://example.com/a']);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.doesNotMatch(html, /<link[^>]+href=/);
});

test('text from the data cannot close the script tag', () => {
  const d = good();
  d.sections[0].items[0].title = '</script><b>x</b>';
  const html = render(d);
  assert.equal(html.split('</script>').length - 1, 2, 'only the two real script tags close');
  assert.match(html, /\\u003c\/script\\u003e/);
});

test('the CLI writes the page next to the data file', () => {
  const dir = mkdtempSync(join(tmpdir(), 'handbook-'));
  const file = join(dir, 'demo.handbook.json');
  writeFileSync(file, JSON.stringify(good()));
  const run = spawnSync(process.execPath, [script, file], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.ok(existsSync(join(dir, 'demo.html')));
  assert.match(readFileSync(join(dir, 'demo.html'), 'utf8'), /<title>Handbook<\/title>/);
});

test('the CLI exits with code 1 and lists each problem', () => {
  const dir = mkdtempSync(join(tmpdir(), 'handbook-'));
  const file = join(dir, 'bad.handbook.json');
  const d = good();
  d.sections[0].items[0].sources = [];
  writeFileSync(file, JSON.stringify(d));
  const run = spawnSync(process.execPath, [script, file], { encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /1 problems/);
  assert.ok(!existsSync(join(dir, 'bad.html')));
});
