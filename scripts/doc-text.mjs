#!/usr/bin/env node
// Prints a Markdown file with each inline base64 image replaced by "[image: <alt>]".
// Word exports embed pictures as data URIs; in COS SRS.md they are 87% of the file.
//
// Usage: node doc-text.mjs <file.md>

import { readFileSync } from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node doc-text.mjs <file.md>');
  process.exit(1);
}
process.stdout.write(
  readFileSync(file, 'utf8').replace(/!\[([^\]]*)\]\(data:image[^)]*\)/g, (_, alt) => `[image: ${alt || 'no caption'}]`),
);
