#!/usr/bin/env node
/* =============================================================================
   i18n tooling
   -----------------------------------------------------------------------------
   Usage:
     node tools/i18n-extract.js                 write i18n/source.json (English)
     node tools/i18n-extract.js --coverage all  coverage report per language
     node tools/i18n-extract.js --missing es    list untranslated keys for es
     node tools/i18n-extract.js --missing all   list untranslated keys per lang
============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const schema = require(path.join(ROOT, 'i18n', 'schema.js'));
require(path.join(ROOT, 'i18n', 'ui.js'));
const UI_EN = globalThis.I18N_UI_EN || {};

const LANGS = ['es', 'zh', 'ja'];

function loadContent() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'curriculum.js'), 'utf8'), sandbox, { filename: 'curriculum.js' });
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'glossary.js'), 'utf8'), sandbox, { filename: 'glossary.js' });
  return { C: sandbox.window.CURRICULUM, G: sandbox.window.GLOSSARY };
}

function loadDict(lang) {
  const file = path.join(ROOT, 'i18n', lang + '.js');
  if (!fs.existsSync(file)) return null;
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: 'i18n/' + lang + '.js' });
  return (sandbox.window.I18N_DICTS || {})[lang] || {};
}

function sourceKeys() {
  const { C, G } = loadContent();
  return Object.assign({}, UI_EN, schema.collect(C, G));
}

const args = process.argv.slice(2);
const source = sourceKeys();
const sourceKeysList = Object.keys(source).sort();

if (args[0] === '--coverage' || args[0] === '--missing') {
  const langs = args[1] === 'all' ? LANGS : [args[1] || 'es'];
  let failed = false;
  langs.forEach((lang) => {
    const dict = loadDict(lang);
    if (!dict) { console.log(lang.padEnd(4), 'no i18n/' + lang + '.js'); failed = true; return; }
    const missing = sourceKeysList.filter((k) => typeof dict[k] !== 'string' || !dict[k]);
    const extra = Object.keys(dict).filter((k) => !(k in source));
    const pct = sourceKeysList.length ? Math.round(((sourceKeysList.length - missing.length) / sourceKeysList.length) * 100) : 0;
    console.log(lang.padEnd(4), pct + '%', '(' + (sourceKeysList.length - missing.length) + '/' + sourceKeysList.length + ' keys)',
      extra.length ? '| ' + extra.length + ' unknown key(s): ' + extra.slice(0, 5).join(', ') : '');
    if (args[0] === '--missing' && missing.length) {
      console.log('  missing:', missing.slice(0, 40).join(', '), missing.length > 40 ? '... (+' + (missing.length - 40) + ')' : '');
    }
    if (extra.length) failed = true;
  });
  process.exit(failed ? 1 : 0);
}

const out = {};
sourceKeysList.forEach((k) => { out[k] = source[k]; });
fs.writeFileSync(path.join(ROOT, 'i18n', 'source.json'), JSON.stringify(out, null, 2) + '\n');
console.log('Wrote i18n/source.json —', sourceKeysList.length, 'keys (' + Object.keys(UI_EN).length + ' ui +',
  (sourceKeysList.length - Object.keys(UI_EN).length) + ' content)');
