#!/usr/bin/env node
// Installs the ba-kit skills for agents other than Claude Code (Codex, Antigravity,
// and other tools that read Agent Skills from a folder). The Claude Code plugin does
// not use this script and does not change.
//
//   node install-agents.mjs                    install into ./.agents (project)
//   node install-agents.mjs --to <dir>         install into <dir>, for example ~/.agents
//   node install-agents.mjs --check            apply the edits in memory and write nothing
//
// <dir>/skills/<skill>/  the five skills
// <dir>/scripts/         doc-lint, doc-text, diagram-preview
//
// The skills find the scripts at "<this skill's folder>/../../scripts", so the two
// folders stay side by side. Other skills in <dir>/skills are left as they are.

import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTS = ['doc-lint.mjs', 'doc-text.mjs', 'diagram-preview.mjs'];

// Without the plugin hook, the agent runs the linter itself.
const EDITS = [
  {
    file: 'ba-docs/SKILL.md',
    from: '`doc-lint` reports 0 findings. The plugin hook runs it on each save and returns the findings. Fix them in the file.',
    to: '`doc-lint` reports 0 findings. Run `node "<this skill\'s folder>/../../scripts/doc-lint.mjs" <file.md>` after each save. Fix each finding in the file.',
  },
  {
    file: 'ste/SKILL.md',
    from: 'Mark a document so that the plugin hook checks it on every save.',
    to: 'Mark a document so that `doc-lint` checks it.',
  },
  {
    file: 'ste/SKILL.md',
    from: 'To check a file by hand, run the script two levels above this skill\'s folder:',
    to: 'After each save, run the script two levels above this skill\'s folder:',
  },
];

const args = process.argv.slice(2);
const check = args.includes('--check');
const toIndex = args.indexOf('--to');
let to = toIndex >= 0 ? args[toIndex + 1] : '.agents';
if (!to) {
  console.error('--to needs a folder');
  process.exit(2);
}
if (to === '~' || to.startsWith('~/') || to.startsWith('~\\')) to = join(homedir(), to.slice(1));
to = resolve(to);

const skills = readdirSync(join(root, 'skills'));
const edited = new Map();
for (const { file, from, to: text } of EDITS) {
  const source = edited.get(file) ?? readFileSync(join(root, 'skills', file), 'utf8');
  if (!source.includes(from)) {
    console.error(`skills/${file}: the text to edit is not there. Update EDITS in install-agents.mjs.`);
    process.exit(1);
  }
  edited.set(file, source.replace(from, text));
}

if (check) {
  console.log(`ok: ${skills.length} skills, ${EDITS.length} edits apply`);
  process.exit(0);
}

for (const skill of skills) {
  const target = join(to, 'skills', skill);
  rmSync(target, { recursive: true, force: true });
  cpSync(join(root, 'skills', skill), target, { recursive: true });
}
for (const [file, text] of edited) writeFileSync(join(to, 'skills', file), text);

mkdirSync(join(to, 'scripts'), { recursive: true });
for (const script of SCRIPTS) cpSync(join(root, 'scripts', script), join(to, 'scripts', script));

console.log(`Installed ${skills.length} skills in ${join(to, 'skills')}`);
console.log(`Installed ${SCRIPTS.length} scripts in ${join(to, 'scripts')}`);
