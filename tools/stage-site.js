#!/usr/bin/env node
/* =============================================================================
   Stage the static site into dist/ (no build step — just a filtered copy).
   Cross-platform: works on Windows, macOS, and Linux without rsync.
   Used by both deploy workflows and by `npm run stage`.
============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const EXCLUDE = new Set(['.git', '.github', '.amp', 'node_modules', 'dist', 'tools']);

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (EXCLUDE.has(entry.name)) continue;
  fs.cpSync(path.join(ROOT, entry.name), path.join(DIST, entry.name), { recursive: true });
}

let files = 0;
(function count(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) count(path.join(dir, entry.name));
    else files++;
  }
}(DIST));

console.log('Staged ' + files + ' files into dist/');
