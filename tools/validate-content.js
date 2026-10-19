#!/usr/bin/env node
/* =============================================================================
   Content integrity checks for the StAI Relevant curriculum + glossary.
   Zero dependencies:  node tools/validate-content.js
   Exit code 0 = OK, 1 = errors (printed). Warnings never fail the build.
============================================================================= */
'use strict';

const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const window = {}; // shim: curriculum.js / glossary.js assign to window
eval(fs.readFileSync(path.join(dir, 'curriculum.js'), 'utf8'));
eval(fs.readFileSync(path.join(dir, 'glossary.js'), 'utf8'));
const CUR = window.CURRICULUM;
const GLOSS = window.GLOSSARY;

const errors = [];
const warnings = [];
const BLOCK_TYPES = new Set(['p', 'h', 'ul', 'code', 'note', 'steps', 'terms', 'lens', 'links']);
const EX_TYPES = new Set(['quiz', 'multi', 'order']);
const TAG_RE = /<\/?[a-zA-Z][^>]*>/; // real markup, not a literal "<"
const HTTPS_RE = /^https:\/\//;

if (!Array.isArray(CUR) || !CUR.length) {
  console.error('curriculum.js did not expose a CURRICULUM array');
  process.exit(1);
}
if (!Array.isArray(GLOSS) || !GLOSS.length) {
  errors.push('glossary.js did not expose a GLOSSARY array');
}

/* ------------------------------------------------------------- blocks ---- */

function validateBlocks(blocks, where) {
  if (!Array.isArray(blocks) || !blocks.length) { errors.push(`${where}: missing blocks`); return; }
  blocks.forEach((b, bi) => {
    const bw = `${where} block ${bi + 1}`;
    if (!BLOCK_TYPES.has(b.t)) errors.push(`${bw}: unknown type '${b.t}'`);
    if (b.t === 'code' && !b.text) errors.push(`${bw}: empty code block`);
    if ((b.t === 'ul' || b.t === 'terms' || b.t === 'steps') && !(b.items || []).length) {
      errors.push(`${bw}: missing items`);
    }
    if ((b.t === 'p' || b.t === 'h' || b.t === 'note' || b.t === 'lens') && !b.html) {
      errors.push(`${bw}: empty html`);
    }
    if (b.t === 'links') {
      const items = b.items || [];
      if (!items.length) errors.push(`${bw}: links needs items`);
      items.forEach((it, ii) => {
        if (!Array.isArray(it) || it.length !== 2 || !it[0] || !it[1]) {
          errors.push(`${bw} link ${ii + 1}: expected [label, url]`);
        } else if (!HTTPS_RE.test(it[1])) {
          errors.push(`${bw} link ${ii + 1}: url must be https (${it[1]})`);
        }
      });
    }
  });
}

function validateDeeper(items, where) {
  if (items === undefined) return;
  if (!Array.isArray(items)) { errors.push(`${where}: deeper must be an array`); return; }
  items.forEach((d, di) => {
    const dw = `${where} deeper #${di + 1}`;
    if (!d.title) errors.push(`${dw}: missing title`);
    validateBlocks(d.blocks, dw);
    const hasLinks = (d.blocks || []).some((b) => b.t === 'links');
    if (!hasLinks) warnings.push(`${dw}: no links block (deep dives should cite sources)`);
  });
}

/* ----------------------------------------------------------- curriculum -- */

const ids = new Set();
CUR.forEach((m, idx) => {
  const where = `module #${idx + 1} (${m.id})`;

  if (!m.id || ids.has(m.id)) errors.push(`${where}: duplicate or missing id`);
  ids.add(m.id);
  if (m.number !== idx + 1) errors.push(`${where}: number is ${m.number}, expected ${idx + 1}`);
  ['title', 'tagline', 'drill'].forEach(k => { if (!m[k]) errors.push(`${where}: missing ${k}`); });
  if (m.number === CUR.length && !m.capstone) warnings.push(`${where}: last module is not marked capstone`);
  if (!m.lessons || !m.lessons.length) errors.push(`${where}: no lessons`);

  validateDeeper(m.deeper, where);

  (m.lessons || []).forEach((lesson, li) => {
    const lw = `${where} lesson ${li + 1}`;
    if (!lesson.title) errors.push(`${lw}: missing title`);
    const blocks = lesson.blocks || [];
    validateBlocks(blocks, lw);
    const last = blocks[blocks.length - 1];
    if (!last || last.t !== 'lens') errors.push(`${lw}: does not end with a lens block`);
    validateDeeper(lesson.deeper, lw);
  });

  const d = m.drill || {};
  if (!d.exercises || !d.exercises.length) errors.push(`${where}: drill has no exercises`);
  const passPct = typeof d.passPct === 'number' ? d.passPct : 0.7;
  if (passPct <= 0.5 || passPct > 1) errors.push(`${where}: suspicious passPct ${passPct}`);
  if (d.exercises && Math.ceil(d.exercises.length * passPct) === d.exercises.length) {
    errors.push(`${where}: passPct requires a perfect score`);
  }

  (d.exercises || []).forEach((ex, xi) => {
    const ew = `${where} drill ex ${xi + 1}`;
    if (!EX_TYPES.has(ex.type)) errors.push(`${ew}: unknown type '${ex.type}'`);
    if (!ex.prompt) errors.push(`${ew}: missing prompt`);
    if (!ex.explain) errors.push(`${ew}: missing explain`);
    if (!ex.lens) errors.push(`${ew}: missing lens takeaway`);
    if (ex.code && !ex.code.text) errors.push(`${ew}: empty code block`);

    (ex.options || []).forEach(o => {
      if (!o.text) errors.push(`${ew}: option missing text`);
      if (o.text && TAG_RE.test(o.text)) errors.push(`${ew}: option contains markup (options are escaped when rendered): ${o.text.slice(0, 60)}...`);
    });

    if (ex.type === 'quiz') {
      const ok = (ex.options || []).filter(o => o.ok);
      if (ok.length !== 1) errors.push(`${ew}: quiz needs exactly 1 correct option, has ${ok.length}`);
      if ((ex.options || []).length < 3) errors.push(`${ew}: quiz has fewer than 3 options`);
    }
    if (ex.type === 'multi') {
      const ok = (ex.options || []).filter(o => o.ok);
      if (ok.length < 2) errors.push(`${ew}: multi needs at least 2 correct options`);
      if (ex.options && ok.length === ex.options.length) errors.push(`${ew}: multi has no wrong options`);
    }
    if (ex.type === 'order') {
      const items = ex.items || [];
      if (items.length < 3) errors.push(`${ew}: order needs at least 3 items`);
      if (new Set(items).size !== items.length) errors.push(`${ew}: order items are not unique (shuffle and grading break)`);
    }
  });
});

/* -------------------------------------------------------------- glossary -- */

const gids = new Set();
(GLOSS || []).forEach((e, i) => {
  const gw = `glossary #${i + 1} (${e.id})`;
  if (!e.id || gids.has(e.id)) errors.push(`${gw}: duplicate or missing id`);
  gids.add(e.id);
  if (!e.term) errors.push(`${gw}: missing term`);
  if (!e.def) errors.push(`${gw}: missing def`);
  if (!e.match) {
    errors.push(`${gw}: missing match`);
  } else {
    try { new RegExp(e.match, e.cs ? '' : 'i'); }
    catch (err) { errors.push(`${gw}: invalid regex source '${e.match}'`); }
  }
  (e.links || []).forEach((l, li) => {
    if (!l.t || !HTTPS_RE.test(l.u || '')) errors.push(`${gw} link ${li + 1}: needs a label and an https url`);
  });
  if (!(e.links || []).length) warnings.push(`${gw}: no links`);
});

/* ---------------------------------------------------------------- report -- */

const lessonTotal = CUR.reduce((n, m) => n + m.lessons.length, 0);
const exTotal = CUR.reduce((n, m) => n + m.drill.exercises.length, 0);
const deepTotal = CUR.reduce((n, m) => n + (m.deeper || []).length + m.lessons.reduce((k, l) => k + (l.deeper || []).length, 0), 0);

warnings.forEach(w => console.log('WARN  ' + w));
if (errors.length) {
  console.log('FAIL  ' + errors.length + ' content error(s):');
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
console.log(`OK    ${CUR.length} modules, ${lessonTotal} lessons, ${exTotal} exercises, ${deepTotal} deep dives, ${(GLOSS || []).length} glossary terms validated.`);
