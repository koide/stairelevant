#!/usr/bin/env node
/* =============================================================================
   Behavioral smoke tests for StAI Relevant.
   Requires jsdom (devDependency):  npm install  &&  npm test

   Covers: routing, lesson read-marking, drill grading (quiz/multi/order),
   pass/fail/retry accounting, replay reconstruction, progress ring,
   accessibility wiring, corrected content, and reset.
============================================================================= */
'use strict';

const { JSDOM, VirtualConsole } = require('jsdom');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')
  .replace(/<script src="[^"]*"><\/script>/g, ''); // inject scripts manually

let failures = 0;
const pageErrors = [];

function ok(cond, msg) {
  console.log((cond ? '  ok  ' : '  FAIL') + ' ' + msg);
  if (!cond) failures++;
}

function fresh(lang) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => pageErrors.push(String(e)));
  const dom = new JSDOM(html, {
    url: 'http://localhost/index.html' + (lang && lang !== 'en' ? '?lang=' + lang : ''),
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: vc,
  });
  const { window } = dom;
  window.scrollTo = () => {};
  window.confirm = () => true;
  window.addEventListener('error', (e) => pageErrors.push('window.error: ' + e.message));
  const files = ['curriculum.js', 'glossary.js', 'i18n/schema.js', 'i18n/ui.js', 'i18n.js'];
  if (lang && lang !== 'en') files.push('i18n/' + lang + '.js');
  files.push('app.js');
  for (const f of files) {
    window.eval(fs.readFileSync(path.join(ROOT, f), 'utf8'));
  }
  return window;
}

const go = (w, h) => { w.location.hash = h; w.dispatchEvent(new w.HashChangeEvent('hashchange')); };
const syncHash = (w) => w.dispatchEvent(new w.HashChangeEvent('hashchange'));
const click = (el) => el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true, cancelable: true }));
const $ = (w, s) => w.document.querySelector(s);
const $$ = (w, s) => Array.from(w.document.querySelectorAll(s));
const txt = (w, s) => (($(w, s) || {}).textContent || '');
const saved = (w) => JSON.parse(w.localStorage.getItem('ai-stewardship-progress-v1'));

function checkMulti(w, labels) {
  labels.forEach((c) => {
    const l = $$(w, '.option-check').find((o) => o.textContent.includes(c));
    l.querySelector('input').checked = true;
    l.querySelector('input').dispatchEvent(new w.Event('change', { bubbles: true }));
  });
}
function clickOption(w, fragment) { click($$(w, '.option').find((o) => o.textContent.includes(fragment))); }
function clickOrder(w, prefix) { click($$(w, '#order-pool .order-item').find((o) => o.textContent.startsWith(prefix))); }

/* Play drill 1 to completion, all answers correct. */
function playDrill1Correct(w) {
  go(w, '#/m/1/drill');
  click($(w, '#drill-begin'));
  clickOption(w, 'Honest miscomprehension');
  click($(w, '#btn-next'));
  clickOption(w, 'Mostly sycophancy');
  click($(w, '#btn-next'));
  checkMulti(w, ['Inventing APIs', 'Reading your words', 'Forgetting your project', 'Making caching']);
  click($(w, '#order-check'));
  click($(w, '#btn-next'));
  clickOption(w, 'invented the method');
  click($(w, '#btn-next'));
  ['Understand', 'Specify', 'Direct', 'Verify', 'Contain'].forEach((p) => clickOrder(w, p));
  click($(w, '#order-check'));
  click($(w, '#btn-next'));
}

console.log('[home + routing]');
{
  const w = fresh();
  ok($(w, '.hero h1') !== null, 'hero renders');
  ok($$(w, '.module-card').length === 9, '9 module cards');
  ok($$(w, '.loop-step').length === 5, '5 loop steps');
  go(w, '#/m/1');
  ok($$(w, '.lesson-row').length === 3, 'module 1 lists 3 lessons');
  go(w, '#/m/1/l/0');
  ok(/marked read/.test(txt(w, '.lesson-meta')), 'lesson marked read');
  ok($$(w, '.lens-callout').length === 1, 'lesson ends with lens callout');
  go(w, '#/m/1/l/99');
  ok($(w, '.module-head') !== null, 'out-of-range lesson falls back to module page');
  go(w, '#/garbage');
  ok($(w, '.hero') !== null, 'unknown hash falls back to home');
}

console.log('[keyboard navigation + ring]');
{
  const w = fresh();
  ok(txt(w, '#progress-pct') === '0%', 'boot ring at 0%');
  go(w, '#/m/1/l/1');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  syncHash(w);
  ok(w.location.hash === '#/m/1/l/2', 'ArrowRight advances lesson');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
  syncHash(w);
  ok(w.location.hash === '#/m/1/l/1', 'ArrowLeft goes back');
  ok(txt(w, '#progress-pct') !== '0%', 'ring updates after reading lessons (got ' + txt(w, '#progress-pct') + ')');
}

console.log('[drill: full pass]');
{
  const w = fresh();
  playDrill1Correct(w);
  ok(/Drill passed/.test(txt(w, '.drill-result h1')), 'passed screen shown');
  ok(/5 \/ 5/.test(txt(w, '.drill-result-score')), 'score 5/5');
  const s = saved(w);
  ok(s.drills.m1.passed && s.drills.m1.best === 5, 'progress persisted, best 5');
  ok(s.drills.m1.attempts === 1, 'attempts recorded once (got ' + s.drills.m1.attempts + ')');
}

console.log('[drill: attempts stable on revisit]');
{
  const w = fresh();
  playDrill1Correct(w);
  go(w, '#/');
  go(w, '#/m/1/drill');
  ok(saved(w).drills.m1.attempts === 1, 'revisiting results does not inflate attempts');
  ok(/Attempts: 1/.test(txt(w, '.drill-result-meta')), 'result screen shows Attempts: 1');
  go(w, '#/');
  ok($$(w, '.chip-passed').length >= 1, 'module card shows passed chip');
}

console.log('[drill: focus + aria-live]');
{
  const w = fresh();
  go(w, '#/m/1/drill');
  click($(w, '#drill-begin'));
  click($$(w, '.option')[0]);
  ok(w.document.activeElement.id === 'ex-feedback', 'focus lands on feedback');
  ok($(w, '#ex-feedback').getAttribute('aria-live') === 'polite', 'feedback has aria-live');
  ok($(w, '#ex-feedback').getAttribute('role') === 'status', 'feedback has role=status');
}

console.log('[drill: replay reconstruction]');
{
  const w = fresh();
  go(w, '#/m/1/drill');
  click($(w, '#drill-begin'));
  clickOption(w, 'Honest miscomprehension'); // answered, no Next
  go(w, '#/');
  go(w, '#/m/1/drill');
  ok($$(w, '.option-right').length === 1, 'quiz replay re-highlights the correct option');
  ok(!$(w, '#ex-feedback').hidden, 'quiz replay shows feedback again');
  // play to the order exercise, answer it, navigate away, return
  click($(w, '#btn-next'));
  clickOption(w, 'Mostly sycophancy');
  click($(w, '#btn-next'));
  checkMulti(w, ['Inventing APIs', 'Reading your words', 'Forgetting your project', 'Making caching']);
  click($(w, '#order-check'));
  click($(w, '#btn-next'));
  clickOption(w, 'invented the method');
  click($(w, '#btn-next'));
  ['Understand', 'Specify', 'Direct', 'Verify', 'Contain'].forEach((p) => clickOrder(w, p));
  click($(w, '#order-check'));
  go(w, '#/');
  go(w, '#/m/1/drill');
  ok($$(w, '#order-chosen .order-item').length === 5, 'order replay rebuilds the chosen column');
  ok($(w, '#order-check').disabled, 'order replay disables the check button');
}

console.log('[drill: fail path + retry accounting]');
{
  const w = fresh();
  playDrill1Correct(w); // 5/5, attempt 1
  click($(w, '#drill-retry'));
  clickOption(w, 'Hallucination'); // wrong
  click($(w, '#btn-next'));
  clickOption(w, 'Verification'); // wrong
  click($(w, '#btn-next'));
  checkMulti(w, ['Inventing APIs']); // incomplete
  click($(w, '#order-check'));
  click($(w, '#btn-next'));
  clickOption(w, 'invented the method'); // right
  click($(w, '#btn-next'));
  ['Direct', 'Understand', 'Specify', 'Contain', 'Verify'].forEach((p) => clickOrder(w, p)); // wrong order
  click($(w, '#order-check'));
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  ok(/Not passed/.test(txt(w, '.drill-result h1')), 'failed retry shows Not passed');
  const s = saved(w);
  ok(s.drills.m1.attempts === 2, 'retry is a real second attempt (got ' + s.drills.m1.attempts + ')');
  ok(s.drills.m1.best === 5, 'best score preserved at 5');
}

console.log('[content: corrected exercises render and grade right]');
{
  const w = fresh();
  // CORS exercise (module 2, ex 3)
  go(w, '#/m/2/drill');
  click($(w, '#drill-begin'));
  clickOption(w, 'A timeout doesn'); // ex1: retry loop
  click($(w, '#btn-next'));
  clickOption(w, 'NEXT_PUBLIC_ prefix'); // ex2: leaked key
  click($(w, '#btn-next'));
  ok(txt(w, '.codeblock').includes('req.headers.origin'), 'CORS exercise shows origin reflection');
  clickOption(w, 'Reflects any origin with credentials allowed');
  ok(/Correct/.test(txt(w, '.verdict')), 'reflection answer graded correct');

  // No rendered option anywhere should contain literal tags (spot-check the ex-offenders)
  const w2 = fresh();
  go(w2, '#/m/4/drill');
  click($(w2, '#drill-begin'));
  ['textbook N+1', 'evaporated', 'Red light'].forEach((s) => { clickOption(w2, s); click($(w2, '#btn-next')); });
  checkMulti(w2, ['reversible down-migration', 'Rehearsal on a staging', 'backup, restored', 'Running it in batches']);
  click($(w2, '#order-check'));
  click($(w2, '#btn-next'));
  ok($$(w2, '.option').every((o) => !/<\/?[a-zA-Z][^>]*>/.test(o.textContent)), 'no option renders literal markup');

  // Gauntlet counts
  const w3 = fresh();
  const m9 = w3.CURRICULUM[w3.CURRICULUM.length - 1];
  ok(m9.drill.exercises.length === 8 && /Eight checkpoints/.test(m9.drill.title), 'Gauntlet: 8 exercises, title matches');
  go(w3, '#/m/9/drill');
  ok(/8 exercises/.test(txt(w3, '.drill-intro-meta')) && /6/.test(txt(w3, '.drill-intro-meta')), 'Gauntlet intro: 8 exercises, pass mark 6');
}

console.log('[deep dives]');
{
  const w = fresh();
  go(w, '#/m/2');
  const dives = $$(w, '.deeper');
  ok(dives.length === 2, 'module 2 shows 2 deep dives (got ' + dives.length + ')');
  const http = dives.find((d) => /full life of an HTTP request/.test(d.querySelector('summary').textContent));
  ok(!!http, 'HTTP lifecycle deep dive present');
  http.open = true;
  ok(http.open, 'details element can be opened');
  ok(/TCP \+ TLS/.test(http.textContent), 'deep dive includes the request lifecycle trace');
  const link = http.querySelector('.links-block a');
  ok(link && /^https:\/\//.test(link.href) && link.target === '_blank', 'deep dive cites https sources in a new tab');
}

console.log('[glossary tooltips]');
{
  const w = fresh();
  go(w, '#/m/2/l/0');
  const glosses = $$(w, '.gloss');
  ok(glosses.length > 0, 'lesson prose gets glossary spans (got ' + glosses.length + ')');
  const g = glosses[0];
  click(g);
  const tip = $(w, '.gloss-tip');
  ok(tip && !tip.hidden, 'clicking a term opens the tooltip');
  const a = tip.querySelector('a');
  ok(a && /^https:\/\//.test(a.href) && a.target === '_blank', 'tooltip links to an authoritative https source');
  ok(g.getAttribute('aria-describedby') === 'gloss-tip', 'term is described by the tooltip');
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  ok(tip.hidden, 'Escape closes the tooltip');
  ok(!g.getAttribute('aria-describedby'), 'aria-describedby cleaned up on close');
  click(g);
  ok(!tip.hidden, 'reopened');
  go(w, '#/');
  ok($(w, '.gloss-tip').hidden, 'route change closes the tooltip');
}

console.log('[glossary page]');
{
  const w = fresh();
  go(w, '#/glossary');
  ok($$(w, '.gloss-entry').length >= 100, 'glossary page lists terms (got ' + $$(w, '.gloss-entry').length + ')');
  const search = $(w, '#gloss-search');
  search.value = 'prompt injection';
  search.dispatchEvent(new w.Event('input', { bubbles: true }));
  const visible = $$(w, '.gloss-entry').filter((e) => !e.hidden);
  ok(visible.length >= 1 && visible.length < 10, 'filter narrows the list (got ' + visible.length + ')');
  ok(/Prompt injection/i.test(visible[0].textContent), 'the match is the prompt injection entry');
  search.value = 'zzzz-no-term';
  search.dispatchEvent(new w.Event('input', { bubbles: true }));
  ok(!$(w, '#gloss-empty').hidden, 'empty-state message shows when nothing matches');
}

console.log('[glossary reach + consistency]');
{
  const w = fresh();
  go(w, '#/m/6/l/2');
  const testSpans = $$(w, '.gloss[data-gloss="test"]').length;
  ok(testSpans >= 2, 'the same term is annotated in multiple blocks of one page (got ' + testSpans + ')');
  go(w, '#/m/2/l/0');
  ok($$(w, '.gloss[data-gloss="status"]').length >= 1, 'HTTP status shorthand (2xx/5xx) opens the status-code entry');
  go(w, '#/m/2');
  ok($$(w, '.gloss[data-gloss="latency"]').length >= 1, 'deep-dive prose is annotated (latency)');
  ok($$(w, '.gloss[data-gloss="whatwg"]').length >= 1, 'WHATWG is annotated in the HTTP deep dive');
  go(w, '#/m/1/l/0');
  ok(/(language|stack|JavaScript)/i.test(w.document.body.textContent) && !!$(w, '.note'), 'the language-examples note renders on the first lesson');
}

console.log('[i18n]');
{
  const es = fresh('es');
  ok(es.I18N.lang() === 'es', 'resolves ?lang=es');
  ok($(es, '.topnav a').textContent === 'Curr\u00edculo', 'UI chrome translates (es nav)');
  ok(/La mentalidad del steward/.test(es.document.body.textContent), 'module 1 title translates (es)');
  go(es, '#/m/1/l/0');
  ok(/En 2010, un desarrollador junior/.test($(es, '.lesson-body').textContent), 'module 1 lesson body translates (es)');
  // Fallback: a content key the dictionary lacks leaves the English source in place.
  const esDict = es.I18N_DICTS.es || {};
  const source = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n/source.json'), 'utf8'));
  const contentKey = Object.keys(source).find((k) => /^m\d+\.lessons\.\d+\.blocks\.\d+\.html$/.test(k) && !(k in esDict));
  if (contentKey) {
    const parts = contentKey.match(/^m(\d+)\.lessons\.(\d+)\.blocks\.(\d+)\.html$/);
    go(es, '#/m/' + parts[1] + '/l/' + parts[2]);
    const blockEl = $(es, '.lesson-body').children[+parts[3]];
    const english = String(source[contentKey])
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
      .slice(0, 40);
    ok(blockEl && blockEl.textContent.indexOf(english) !== -1, 'untranslated content falls back to English (' + contentKey + ')');
  } else {
    ok(true, 'every lesson block translated — no fallback case to probe');
  }
  es.I18N.setLang('en');
  ok($(es, '.topnav a').textContent === 'Curriculum', 'switching back to English re-renders the chrome');

  const zh = fresh('zh');
  ok(zh.I18N.lang() === 'zh' && $(zh, '.topnav a').textContent === '\u8bfe\u7a0b', 'zh resolves and translates');
  ok(zh.document.documentElement.lang === 'zh-Hans', 'zh sets html lang to zh-Hans');

  const ja = fresh('ja');
  ok(ja.I18N.lang() === 'ja' && $(ja, '.topnav a').textContent === '\u30ab\u30ea\u30ad\u30e5\u30e9\u30e0', 'ja resolves and translates');
}

console.log('[reset]');
{
  const w = fresh();
  playDrill1Correct(w);
  go(w, '#/');
  click($(w, '#reset-progress'));
  ok(saved(w) === null, 'progress cleared');
  ok($$(w, '.chip-passed').length === 0, 'no passed chips after reset');
}

console.log('[runtime errors]');
ok(pageErrors.length === 0, 'no page errors across all flows' + (pageErrors.length ? ' :: ' + pageErrors[0] : ''));

console.log(failures === 0 ? '\nSMOKE TESTS PASSED' : '\n' + failures + ' FAILURES');
process.exit(failures ? 1 : 0);
