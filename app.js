/* =============================================================================
   STAI RELEVANT — app engine
   Vanilla JS. No dependencies. Renders CURRICULUM (see curriculum.js).
   Views: home (#/), module (#/m/1), lesson (#/m/1/l/0), drill (#/m/1/drill).
============================================================================= */
(function () {
  'use strict';

  var CUR = window.CURRICULUM || [];
  var STORE_KEY = 'ai-stewardship-progress-v1';
  var I18N = window.I18N;
  function t(key, vars) { return I18N ? I18N.t(key, vars) : key; }

  var TOTAL_LESSONS = CUR.reduce(function (n, m) { return n + m.lessons.length; }, 0);
  var TOTAL_DRILLS = CUR.length;

  /* ------------------------------------------------------------ progress -- */

  var progress = loadProgress();

  function loadProgress() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var p = JSON.parse(raw);
        if (p && typeof p === 'object') {
          if (!p.lessons || typeof p.lessons !== 'object') p.lessons = {};
          if (!p.drills || typeof p.drills !== 'object') p.drills = {};
          return p;
        }
      }
    } catch (e) { /* private mode etc. */ }
    return { lessons: {}, drills: {} };
  }

  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {}
  }

  function lessonKey(mid, i) { return mid + 'l' + i; }
  function isLessonRead(mid, i) { return !!progress.lessons[lessonKey(mid, i)]; }
  function markLessonRead(mid, i) {
    if (!progress.lessons[lessonKey(mid, i)]) {
      progress.lessons[lessonKey(mid, i)] = 1;
      saveProgress();
    }
  }
  function readCount(m) {
    var n = 0;
    for (var i = 0; i < m.lessons.length; i++) if (isLessonRead(m.id, i)) n++;
    return n;
  }
  function drillState(mid) { return progress.drills[mid] || null; }
  function recordDrill(mid, score, total, passed) {
    var prev = progress.drills[mid] || { best: 0, total: total, passed: false, attempts: 0 };
    progress.drills[mid] = {
      best: Math.max(prev.best, score),
      total: total,
      passed: prev.passed || passed,
      attempts: prev.attempts + 1
    };
    saveProgress();
  }

  function overallPct() {
    var done = 0;
    CUR.forEach(function (m) { done += readCount(m); });
    CUR.forEach(function (m) { if (drillState(m.id) && drillState(m.id).passed) done++; });
    var denom = TOTAL_LESSONS + TOTAL_DRILLS;
    return denom ? Math.round((done / denom) * 100) : 0;
  }

  function updateProgressRing() {
    var pct = overallPct();
    var ring = document.getElementById('progress-ring');
    var text = document.getElementById('progress-pct');
    var C = 69.115; // 2 * pi * 11
    if (ring) {
      ring.style.strokeDasharray = String(C);
      ring.style.strokeDashoffset = String(C * (1 - pct / 100));
    }
    if (text) text.textContent = pct + '%';
  }

  /* -------------------------------------------------------------- helpers -- */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------- glossary -- */

  var GLOSS = window.GLOSSARY || [];
  var glossById = {};
  var glossMatchers = [];
  function buildGlossMatchers() {
    glossMatchers = [];
    GLOSS.forEach(function (e) {
      glossById[e.id] = e;
      var m = I18N ? I18N.glossaryMatch(e) : { source: e.match, flags: e.cs ? '' : 'i' };
      try {
        glossMatchers.push({ entry: e, re: new RegExp(m.source, m.flags) });
      } catch (err) { /* invalid matcher: skip */ }
    });
    glossMatchers.sort(function (a, b) {
      return (b.entry.prio || 0) - (a.entry.prio || 0) || b.entry.match.length - a.entry.match.length;
    });
  }
  buildGlossMatchers();

  var GLOSS_SKIP = { PRE: 1, CODE: 1, BUTTON: 1, A: 1, INPUT: 1, TEXTAREA: 1, SELECT: 1, SCRIPT: 1, STYLE: 1, H1: 1 };

  function collectGlossNodes(root) {
    var doc = root.ownerDocument || document;
    var walker = doc.createTreeWalker(root, 4 /* SHOW_TEXT */, {
      acceptNode: function (node) {
        var p = node.parentNode;
        while (p && p !== root) {
          if (p.nodeType === 1) {
            if (GLOSS_SKIP[p.tagName]) return 2; /* REJECT */
            if (p.classList && (p.classList.contains('gloss') || p.classList.contains('no-gloss'))) return 2;
          }
          p = p.parentNode;
        }
        return 1; /* ACCEPT */
      },
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    return nodes;
  }

  /* First occurrence of each term PER BLOCK gets a dotted-underline tooltip span.
     Per page would leave later readers stranded; per occurrence would be noise. */
  var GLOSS_SCOPE_SEL = 'p, li, dt, dd, blockquote, h2, h3, h4, summary, td, th, ' +
    '.note, .lens-callout, .feedback-body, .module-tagline, .hero-sub, .deeper-body';

  function annotateGlossary(root) {
    if (!root || !glossMatchers.length) return;
    var nodes = collectGlossNodes(root);
    var scopeIds = new Map();
    function scopeKey(node) {
      var p = node.parentNode;
      while (p && p !== root) {
        if (p.nodeType === 1 && p.matches && p.matches(GLOSS_SCOPE_SEL)) {
          var k = scopeIds.get(p);
          if (k === undefined) { k = scopeIds.size; scopeIds.set(p, k); }
          return k;
        }
        p = p.parentNode;
      }
      return -1;
    }
    var used = {};
    glossMatchers.forEach(function (m) {
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        if (!node || !node.parentNode) { nodes.splice(i, 1); i--; continue; }
        var text = node.nodeValue;
        if (!text) continue;
        var hit = m.re.exec(text);
        if (!hit) continue;
        var key = scopeKey(node) + ':' + m.entry.id;
        if (used[key]) continue;
        var start = hit.index, end = start + hit[0].length;
        var doc = node.ownerDocument;
        var frag = doc.createDocumentFragment();
        var beforeNode = null, afterNode = null;
        if (start > 0) { beforeNode = doc.createTextNode(text.slice(0, start)); frag.appendChild(beforeNode); }
        var span = doc.createElement('span');
        span.className = 'gloss';
        span.setAttribute('tabindex', '0');
        span.setAttribute('role', 'button');
        span.setAttribute('data-gloss', m.entry.id);
        span.setAttribute('aria-label', t('ui.glossaryAria', { term: m.entry.term }));
        span.textContent = text.slice(start, end);
        frag.appendChild(span);
        if (end < text.length) { afterNode = doc.createTextNode(text.slice(end)); frag.appendChild(afterNode); }
        node.parentNode.replaceChild(frag, node);
        if (beforeNode) nodes[i] = beforeNode; else { nodes.splice(i, 1); i--; }
        if (afterNode) nodes.push(afterNode);
        used[key] = true;
        /* keep scanning — other blocks may get their own first occurrence */
      }
    });
  }

  var tipEl = null, tipAnchor = null, tipTimer = null;

  function ensureTip() {
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'gloss-tip';
      tipEl.id = 'gloss-tip';
      tipEl.setAttribute('role', 'dialog');
      tipEl.hidden = true;
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }

  function buildTipHtml(e) {
    return '<p class="gt-term">' + esc(e.term) + '</p>' +
      '<p class="gt-def">' + esc(e.def) + '</p>' +
      (e.steward ? '<p class="gt-steward"><span>' + t('ui.stewardAngle') + '</span>' + esc(e.steward) + '</p>' : '') +
      (e.links && e.links.length
        ? '<p class="gt-links">' + e.links.map(function (l) {
            return '<a href="' + esc(l.u) + '" target="_blank" rel="noopener noreferrer">' + esc(l.t) + '</a>';
          }).join('') + '</p>'
        : '');
  }

  function positionTip(anchor) {
    var tip = ensureTip();
    var r = anchor.getBoundingClientRect();
    tip.style.left = '0px';
    tip.style.top = '0px';
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    var top = r.bottom + 8;
    if (top + h > window.innerHeight - 8 && r.top - h - 8 > 8) top = r.top - h - 8;
    tip.style.left = Math.round(left) + 'px';
    tip.style.top = Math.round(top) + 'px';
  }

  function openTip(anchor) {
    var e = glossById[anchor.getAttribute('data-gloss')];
    if (!e) return;
    if (tipTimer) { clearTimeout(tipTimer); tipTimer = null; }
    var tip = ensureTip();
    tip.innerHTML = buildTipHtml(e);
    tip.hidden = false;
    if (tipAnchor && tipAnchor !== anchor) tipAnchor.removeAttribute('aria-describedby');
    tipAnchor = anchor;
    anchor.setAttribute('aria-describedby', 'gloss-tip');
    positionTip(anchor);
  }

  function closeTip() {
    if (tipTimer) { clearTimeout(tipTimer); tipTimer = null; }
    if (tipAnchor) { tipAnchor.removeAttribute('aria-describedby'); tipAnchor = null; }
    if (tipEl) tipEl.hidden = true;
  }

  function scheduleCloseTip() {
    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(closeTip, 220);
  }

  document.addEventListener('mouseover', function (ev) {
    if (!ev.target || !ev.target.closest) return;
    if (ev.target.closest('.gloss-tip')) {
      if (tipTimer) { clearTimeout(tipTimer); tipTimer = null; }
      return;
    }
    var g = ev.target.closest('.gloss');
    if (g) openTip(g);
  });
  document.addEventListener('mouseout', function (ev) {
    if (!ev.target || !ev.target.closest) return;
    if (ev.target.closest('.gloss-tip')) {
      var toTerm = ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('.gloss');
      if (!toTerm) scheduleCloseTip();
      return;
    }
    var g = ev.target.closest('.gloss');
    var intoTip = tipEl && ev.relatedTarget && tipEl.contains(ev.relatedTarget);
    if (g && !intoTip) scheduleCloseTip();
  });
  document.addEventListener('focusin', function (ev) {
    var g = ev.target && ev.target.closest ? ev.target.closest('.gloss') : null;
    if (g) openTip(g);
  });
  document.addEventListener('keydown', function (ev) {
    var g = ev.target && ev.target.closest ? ev.target.closest('.gloss') : null;
    if (g && (ev.key === 'Enter' || ev.key === ' ')) {
      ev.preventDefault();
      if (tipAnchor === g) closeTip(); else openTip(g);
      return;
    }
    if (ev.key === 'Escape') closeTip();
  });
  document.addEventListener('click', function (ev) {
    var g = ev.target && ev.target.closest ? ev.target.closest('.gloss') : null;
    if (g) {
      ev.preventDefault();
      if (tipAnchor === g) closeTip(); else openTip(g);
      return;
    }
    if (tipEl && !tipEl.hidden && !tipEl.contains(ev.target)) closeTip();
  });
  window.addEventListener('scroll', closeTip, true);
  window.addEventListener('resize', closeTip);

  function moduleByNumber(n) {
    for (var i = 0; i < CUR.length; i++) if (CUR[i].number === n) return CUR[i];
    return null;
  }

  function moduleHref(m) { return '#/m/' + m.number; }
  function lessonHref(m, i) { return '#/m/' + m.number + '/l/' + i; }
  function drillHref(m) { return '#/m/' + m.number + '/drill'; }

  function statusChipHtml(m) {
    var st = drillState(m.id);
    var read = readCount(m), total = m.lessons.length;
    if (st && st.passed) return '<span class="chip chip-passed">&#10003; ' + t('ui.chipPassed') + '</span>';
    if (read > 0) return '<span class="chip chip-progress">' + t('ui.chipLessons', { read: read, total: total }) + '</span>';
    return '<span class="chip chip-idle">' + t('ui.chipIdle') + '</span>';
  }

  function verdictHtml(ok, label) {
    return ok
      ? '<span class="verdict verdict-ok">&#10003;&nbsp;' + t('ui.correct') + '</span>'
      : '<span class="verdict verdict-no">&#10007;&nbsp;' + t('ui.notQuite') + '</span>';
  }

  /* ---------------------------------------------------------------- router -- */

  var main = $('#main');
  var lessonNav = null; // {prev, next} set while a lesson is open

  function route() {
    lessonNav = null;
    closeTip();
    var hash = location.hash || '#/';
    if (hash === '#/glossary') return renderGlossaryPage();
    var mLesson = hash.match(/^#\/m\/(\d+)\/l\/(\d+)$/);
    var mDrill = hash.match(/^#\/m\/(\d+)\/drill$/);
    var mMod = hash.match(/^#\/m\/(\d+)$/);
    if (mLesson) {
      var modL = moduleByNumber(+mLesson[1]);
      if (modL) {
        var li = +mLesson[2];
        if (li < modL.lessons.length) return renderLesson(modL, li);
        return renderModule(modL);
      }
    } else if (mDrill) {
      var modD = moduleByNumber(+mDrill[1]);
      if (modD) return renderDrill(modD);
    } else if (mMod) {
      var modM = moduleByNumber(+mMod[1]);
      if (modM) return renderModule(modM);
    }
    renderHome();
  }

  window.addEventListener('hashchange', function () {
    route();
    updateProgressRing();
    window.scrollTo(0, 0);
  });

  /* ------------------------------------------------------------------ home -- */

  function loopStepHtml(i, verb, text) {
    return '<li class="loop-step"><span class="loop-num">' + (i + 1) + '</span>' +
      '<div><strong>' + verb + '</strong><span>' + text + '</span></div></li>';
  }

  function renderHome() {
    var readDone = 0;
    CUR.forEach(function (m) { readDone += readCount(m); });
    var drillsPassed = 0;
    CUR.forEach(function (m) { if (drillState(m.id) && drillState(m.id).passed) drillsPassed++; });

    var cards = CUR.map(function (m) {
      var st = drillState(m.id);
      var best = st ? ' &middot; ' + t('ui.bestMeta', { best: st.best, total: st.total }) : '';
      var cap = m.capstone ? ' module-card-capstone' : '';
      return '<a class="module-card' + cap + '" href="' + moduleHref(m) + '">' +
        '<div class="module-card-top"><span class="module-num">' +
        (m.capstone ? '&#9733;' : String(m.number).padStart(2, '0')) + '</span>' + statusChipHtml(m) + '</div>' +
        '<h3>' + esc(m.title) + '</h3>' +
        '<p>' + esc(m.tagline) + '</p>' +
        '<div class="module-card-meta">' + t(m.lessons.length === 1 ? 'ui.lessonsCountOne' : 'ui.lessonsCountMany', { n: m.lessons.length }) +
        ' &middot; ' + (m.capstone ? t('ui.theGauntlet') : t('ui.drillShort', { n: m.number })) + best + '</div>' +
        '</a>';
    }).join('');

    main.innerHTML =
      '<section class="hero wrap">' +
      '  <p class="hero-kicker">' + t('ui.homeKicker') + '</p>' +
      '  <h1>' + t('ui.homeTitle') + '</h1>' +
      '  <p class="hero-sub">' + t('ui.homeSub') + '</p>' +
      '  <div class="hero-actions">' +
      '    <a class="btn btn-primary" href="#/m/1">' + t('ui.startModule1') + '</a>' +
      '    <a class="btn btn-ghost" href="#/m/9">' + t('ui.skipGauntlet') + '</a>' +
      '  </div>' +
      '  <div class="hero-stats">' +
      '    <div><strong>' + readDone + '/' + TOTAL_LESSONS + '</strong><span>' + t('ui.statLessons') + '</span></div>' +
      '    <div><strong>' + drillsPassed + '/' + TOTAL_DRILLS + '</strong><span>' + t('ui.statDrills') + '</span></div>' +
      '  </div>' +
      '</section>' +

      '<section class="wrap section-tight">' +
      '  <h2 class="section-title">' + t('ui.sectionLoop') + '</h2>' +
      '  <p class="section-sub">' + t('ui.sectionLoopSub') + '</p>' +
      '  <ol class="loop">' +
      loopStepHtml(0, t('ui.verbUnderstand'), t('ui.loopUnderstand')) +
      loopStepHtml(1, t('ui.verbSpecify'), t('ui.loopSpecify')) +
      loopStepHtml(2, t('ui.verbDirect'), t('ui.loopDirect')) +
      loopStepHtml(3, t('ui.verbVerify'), t('ui.loopVerify')) +
      loopStepHtml(4, t('ui.verbContain'), t('ui.loopContain')) +
      '  </ol>' +
      '</section>' +

      '<section class="wrap section-tight">' +
      '  <h2 class="section-title">' + t('ui.sectionCurriculum') + '</h2>' +
      '  <p class="section-sub">' + t('ui.sectionCurriculumSub') + '</p>' +
      '  <div class="module-grid">' + cards + '</div>' +
      '</section>' +

      '<section class="wrap section-tight">' +
      '  <h2 class="section-title">' + t('ui.sectionHow') + '</h2>' +
      '  <ul class="howlist">' +
      '    <li>' + t('ui.howLessons') + '</li>' +
      '    <li>' + t('ui.howDrills') + '</li>' +
      '    <li>' + t('ui.howGlossary') + '</li>' +
      '    <li>' + t('ui.howProgress') + '</li>' +
      '  </ul>' +
      '</section>' +

      '<section class="wrap section-tight">' +
      '  <div class="contact-box">' +
      '    <h2 class="section-title">' + t('ui.contactTitle') + '</h2>' +
      '    <p class="section-sub">' + t('ui.contactBody') + ' <a class="contact-link" href="mailto:stairelevant@gmail.com">stairelevant@gmail.com</a></p>' +
      '  </div>' +
      '</section>';
    annotateGlossary(main);
  }

  /* ---------------------------------------------------------------- glossary -- */

  function renderGlossaryPage() {
    var entries = GLOSS.slice().sort(function (a, b) { return a.term.localeCompare(b.term); });
    main.innerHTML =
      '<div class="wrap">' +
      '  <nav class="crumbs"><a href="#/">' + t('ui.crumbCurriculum') + '</a> <span>/</span> <em>' + t('ui.crumbGlossary') + '</em></nav>' +
      '  <header class="module-head">' +
      '    <p class="module-eyebrow">' + t('ui.reference') + '</p>' +
      '    <h1>' + t('ui.glossaryTitle') + '</h1>' +
      '    <p class="module-tagline">' + t('ui.glossaryTagline') + '</p>' +
      '  </header>' +
      '  <input type="search" id="gloss-search" class="gloss-search" placeholder="' + t('ui.glossaryFilter') + '" aria-label="' + t('ui.glossaryFilter') + '">' +
      '  <div class="gloss-list" id="gloss-list">' +
      entries.map(function (e) {
        return '<article class="gloss-entry" data-text="' + esc((e.term + ' ' + e.def).toLowerCase()) + '">' +
          '<h3>' + esc(e.term) + '</h3>' +
          '<p>' + esc(e.def) + '</p>' +
          (e.steward ? '<p class="gt-steward"><span>' + t('ui.stewardAngle') + '</span>' + esc(e.steward) + '</p>' : '') +
          (e.links && e.links.length
            ? '<p class="gt-links">' + e.links.map(function (l) {
                return '<a href="' + esc(l.u) + '" target="_blank" rel="noopener noreferrer">' + esc(l.t) + '</a>';
              }).join('') + '</p>'
            : '') +
          '</article>';
      }).join('') +
      '  </div>' +
      '  <p class="gloss-empty" id="gloss-empty" hidden>' + t('ui.glossaryEmpty') + '</p>' +
      '</div>';
    var search = $('#gloss-search');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      $$('.gloss-entry').forEach(function (el) {
        var match = !q || el.getAttribute('data-text').indexOf(q) !== -1;
        el.hidden = !match;
        if (match) shown++;
      });
      $('#gloss-empty').hidden = shown !== 0;
    });
  }

  /* ---------------------------------------------------------------- module -- */

  function renderModule(m) {
    var st = drillState(m.id);

    var lessonRows = m.lessons.map(function (ls, i) {
      var read = isLessonRead(m.id, i);
      return '<a class="lesson-row' + (read ? ' lesson-row-read' : '') + '" href="' + lessonHref(m, i) + '">' +
        '<span class="lesson-row-check">' + (read ? '&#10003;' : (i + 1)) + '</span>' +
        '<span class="lesson-row-title">' + esc(ls.title) + '</span>' +
        '<span class="lesson-row-go">&rarr;</span></a>';
    }).join('');

    var drillLabel = m.drill.title;
    var drillDesc = m.capstone ? t('ui.capstoneDrillDesc') : m.drill.intro;

    var drillBtn;
    if (st && st.passed) {
      drillBtn = '<a class="btn btn-primary" href="' + drillHref(m) + '">' + t('ui.retakeDrill') + '</a>';
    } else {
      drillBtn = '<a class="btn btn-primary" href="' + drillHref(m) + '">' + t('ui.beginDrill') + '</a>';
    }

    var next = moduleByNumber(m.number + 1);
    var nextHtml = next
      ? '<a class="btn btn-ghost" href="' + moduleHref(next) + '">' + t('ui.nextShort', { title: esc(next.title) }) + '</a>'
      : '';

    main.innerHTML =
      '<div class="wrap">' +
      '  <nav class="crumbs"><a href="#/">' + t('ui.crumbCurriculum') + '</a> <span>/</span> <em>' + esc(m.title) + '</em></nav>' +
      '  <header class="module-head' + (m.capstone ? ' module-head-capstone' : '') + '">' +
      '    <p class="module-eyebrow">' + (m.capstone ? t('ui.eyebrowCapstone') : t('ui.eyebrowModule', { n: String(m.number).padStart(2, '0') })) + '</p>' +
      '    <h1>' + esc(m.title) + '</h1>' +
      '    <p class="module-tagline">' + esc(m.tagline) + '</p>' +
      '  </header>' +
      '  <h2 class="section-title section-title-small">' + t('ui.lessonsHeading') + '</h2>' +
      '  <div class="lesson-list">' + lessonRows + '</div>' +
      '  <div class="drill-card' + (m.capstone ? ' drill-card-capstone' : '') + '">' +
      '    <div class="drill-card-head"><h3>' + esc(drillLabel) + '</h3>' + statusChipHtml(m) + '</div>' +
      '    <p>' + drillDesc + '</p>' +
      '    <div class="drill-card-actions">' + drillBtn +
      (st ? ' <span class="drill-best">' + t(st.attempts === 1 ? 'ui.drillBestOne' : 'ui.drillBestMany', { best: st.best, total: st.total, attempts: st.attempts }) + '</span>' : '') +
      '    </div>' +
      '  </div>' +
      deeperHtml(m.deeper) +
      '  <div class="lesson-nav">' + nextHtml + '</div>' +
      '</div>';
    annotateGlossary(main);
  }

  /* ---------------------------------------------------------------- lesson -- */

  function blockHtml(b) {
    switch (b.t) {
      case 'p':
        return '<p>' + b.html + '</p>';
      case 'h':
        return '<h3 class="lesson-h">' + b.html + '</h3>';
      case 'ul':
        return '<ul class="lesson-ul">' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</ul>';
      case 'code':
        return '<figure class="codeblock"><figcaption>' + esc(b.lang || 'code') + '</figcaption>' +
          '<pre><code>' + esc(b.text) + '</code></pre></figure>';
      case 'note':
        return '<div class="note note-' + (b.kind === 'warn' ? 'warn' : 'tip') + '">' + b.html + '</div>';
      case 'terms':
        return '<dl class="terms">' + b.items.map(function (kv) {
          return '<div class="term"><dt>' + kv[0] + '</dt><dd>' + kv[1] + '</dd></div>';
        }).join('') + '</dl>';
      case 'steps':
        return '<ol class="steps">' + b.items.map(function (kv) {
          return '<li><span class="step-k">' + esc(kv[0]) + '</span><span class="step-v">' + kv[1] + '</span></li>';
        }).join('') + '</ol>';
      case 'lens':
        return '<div class="lens-callout"><span class="lens-label">' + t('ui.lensLabel') + '</span>' + b.html + '</div>';
      case 'links':
        return '<div class="links-block"><p class="links-title">' + t('ui.sourcesTitle') + '</p><ul>' +
          b.items.map(function (it) {
            return '<li><a href="' + esc(it[1]) + '" target="_blank" rel="noopener noreferrer">' + esc(it[0]) + '</a></li>';
          }).join('') + '</ul></div>';
      default:
        return '';
    }
  }

  /* “Want to learn more?” deep-dive panels: titled groups of the same blocks. */
  function deeperHtml(items) {
    if (!items || !items.length) return '';
    return '<section class="deeper-wrap">' +
      '<h2 class="section-title section-title-small">' + t('ui.wantMore') + '</h2>' +
      items.map(function (d) {
        return '<details class="deeper">' +
          '<summary>' + esc(d.title) + '</summary>' +
          '<div class="deeper-body">' + (d.blocks || []).map(blockHtml).join('') + '</div>' +
          '</details>';
      }).join('') +
      '</section>';
  }

  function renderLesson(m, i) {
    var ls = m.lessons[i];
    markLessonRead(m.id, i);

    var last = i === m.lessons.length - 1;
    var nextHref = last ? drillHref(m) : lessonHref(m, i + 1);
    var nextLabel = last ? t('ui.startDrill') : t('ui.nextLesson', { title: esc(m.lessons[i + 1].title) });
    var prevHref = i > 0 ? lessonHref(m, i - 1) : moduleHref(m);

    lessonNav = { prev: prevHref, next: nextHref };

    main.innerHTML =
      '<div class="wrap wrap-narrow">' +
      '  <nav class="crumbs"><a href="#/">' + t('ui.crumbCurriculum') + '</a> <span>/</span> <a href="' + moduleHref(m) + '">' + esc(m.title) + '</a> <span>/</span> <em>' + t('ui.lessonOf', { i: i + 1, n: m.lessons.length }) + '</em></nav>' +
      '  <article class="lesson">' +
      '    <header><h1>' + esc(ls.title) + '</h1>' +
      '    <p class="lesson-meta"><span class="chip chip-progress">&#10003; ' + t('ui.markedRead') + '</span></p></header>' +
      '    <div class="lesson-body">' + ls.blocks.map(blockHtml).join('') + '</div>' +
      deeperHtml(ls.deeper) +
      '    <footer class="lesson-footer">' +
      '      <div class="lesson-nav"><a class="btn btn-ghost" href="' + prevHref + '">&larr; ' + t('ui.back') + '</a></div>' +
      '      <a class="btn btn-primary lesson-continue" href="' + nextHref + '">' + nextLabel + '</a>' +
      '    </footer>' +
      '  </article>' +
      '</div>';
    annotateGlossary(main);
  }

  /* ----------------------------------------------------------------- drill -- */

  var sessions = {}; // mid -> session state

  function freshSession() {
    return { started: false, idx: 0, answers: [], finished: false, score: 0, recorded: false };
  }
  function sessionFor(m) {
    if (!sessions[m.id]) sessions[m.id] = freshSession();
    return sessions[m.id];
  }

  function passThreshold(d) {
    var pct = typeof d.passPct === 'number' ? d.passPct : 0.7;
    return Math.ceil(d.exercises.length * pct);
  }

  function renderDrill(m) {
    var s = sessionFor(m);
    if (!s.started) return renderDrillIntro(m);
    if (s.finished) return renderDrillResult(m);
    renderExercise(m, s);
  }

  function renderDrillIntro(m) {
    var d = m.drill;
    var need = passThreshold(d);
    main.innerHTML =
      '<div class="wrap wrap-narrow">' +
      '  <nav class="crumbs"><a href="#/">' + t('ui.crumbCurriculum') + '</a> <span>/</span> <a href="' + moduleHref(m) + '">' + esc(m.title) + '</a> <span>/</span> <em>' + t('ui.crumbDrill') + '</em></nav>' +
      '  <div class="drill-intro' + (m.capstone ? ' drill-intro-capstone' : '') + '">' +
      '    <h1>' + esc(d.title) + '</h1>' +
      '    <p>' + d.intro + '</p>' +
      '    <ul class="drill-intro-meta">' +
      '      <li>' + t('ui.exercisesCount', { n: d.exercises.length }) + '</li>' +
      '      <li>' + t('ui.passMark', { need: need, pct: Math.round((d.passPct || 0.7) * 100) }) + '</li>' +
      '      <li>' + t('ui.gradingNote') + '</li>' +
      '    </ul>' +
      '    <button class="btn btn-primary" id="drill-begin" type="button">' + t('ui.begin') + '</button>' +
      '  </div>' +
      '</div>';
    annotateGlossary(main);
    $('#drill-begin').addEventListener('click', function () {
      sessions[m.id] = freshSession();
      sessions[m.id].started = true;
      renderExercise(m, sessions[m.id]);
    });
  }

  function renderDrillResult(m) {
    var s = sessionFor(m);
    var d = m.drill;
    var need = passThreshold(d);
    var total = d.exercises.length;
    var passed = s.score >= need;
    // Record once per play session, not on every render of this screen.
    if (!s.recorded) {
      recordDrill(m.id, s.score, total, passed);
      s.recorded = true;
    }

    var st = drillState(m.id);
    var next = moduleByNumber(m.number + 1);
    var verdict = passed
      ? (m.capstone ? t('ui.drillCertified') : t('ui.drillPassed'))
      : t('ui.drillFailed');

    main.innerHTML =
      '<div class="wrap wrap-narrow">' +
      '  <div class="drill-result' + (passed ? ' drill-result-pass' : ' drill-result-fail') + '">' +
      '    <p class="drill-result-eyebrow">' + esc(d.title) + '</p>' +
      '    <h1>' + verdict + '</h1>' +
      '    <p class="drill-result-score">' + t('ui.drillScore', { score: s.score, total: total, need: need }) + '</p>' +
      (passed && m.capstone
        ? '<p>' + t('ui.drillCapstoneBody') + '</p>'
        : (passed
          ? '<p>' + t('ui.drillPassBody') + '</p>'
          : '<p>' + t('ui.drillFailBody') + '</p>')) +
      '    <p class="drill-result-meta">' + t('ui.attemptsMeta', { attempts: st.attempts, best: st.best, total: st.total }) + '</p>' +
      '    <div class="drill-result-actions">' +
      '      <button class="btn btn-primary" id="drill-retry" type="button">' + t('ui.retryDrill') + '</button>' +
      '      <a class="btn btn-ghost" href="' + moduleHref(m) + '">' + t('ui.backToModule') + '</a>' +
      (next ? '<a class="btn btn-ghost" href="' + moduleHref(next) + '">' + t('ui.nextModule') + '</a>' : '') +
      '    </div>' +
      '  </div>' +
      '</div>';

    $('#drill-retry').addEventListener('click', function () {
      sessions[m.id] = freshSession();
      sessions[m.id].started = true;
      renderExercise(m, sessions[m.id]);
    });
    annotateGlossary(main);
    updateProgressRing();
  }

  /* -------- exercise rendering -------- */

  function dotsHtml(s, total) {
    var html = '';
    for (var i = 0; i < total; i++) {
      var cls = 'dot';
      if (i < s.answers.length) cls += s.answers[i].correct ? ' dot-ok' : ' dot-no';
      if (i === s.idx && !s.finished) cls += ' dot-current';
      html += '<span class="' + cls + '"></span>';
    }
    return html;
  }

  function renderExercise(m, s) {
    var d = m.drill;
    var ex = d.exercises[s.idx];
    var answered = s.answers[s.idx] !== undefined;

    var controls = '';
    if (ex.type === 'quiz') {
      controls = '<div class="options" id="options">' +
        ex.options.map(function (o, i) {
          return '<button class="option" type="button" data-i="' + i + '">' + esc(o.text) + '</button>';
        }).join('') + '</div>';
    } else if (ex.type === 'multi') {
      controls = '<div class="options" id="options">' +
        ex.options.map(function (o, i) {
          return '<label class="option option-check"><input type="checkbox" data-i="' + i + '"><span>' + esc(o.text) + '</span></label>';
        }).join('') + '</div>' +
        '<div class="drill-actions"><button class="btn btn-primary" id="order-check" type="button" disabled>' + t('ui.checkAnswers') + '</button></div>';
    } else if (ex.type === 'order') {
      var pool = shuffledPool(ex.items);
      controls =
        '<div class="order-cols">' +
        '  <div class="order-col"><p class="order-col-title">' + t('ui.pieces') + '</p><div id="order-pool">' +
        pool.map(function (t, i) { return '<button class="order-item" type="button" data-t="' + esc(t) + '">' + esc(t) + '</button>'; }).join('') +
        '  </div></div>' +
        '  <div class="order-col"><p class="order-col-title">' + t('ui.yourOrder') + '</p><div id="order-chosen"><p class="order-hint">' + t('ui.orderHint') + '</p></div></div>' +
        '</div>' +
        '<div class="drill-actions"><button class="btn btn-primary" id="order-check" type="button" disabled>' + t('ui.checkOrder') + '</button>' +
        '<button class="btn btn-ghost" id="order-reset" type="button">' + t('ui.resetOrder') + '</button></div>';
    }

    main.innerHTML =
      '<div class="wrap wrap-narrow">' +
      '  <nav class="crumbs"><a href="#/">' + t('ui.crumbCurriculum') + '</a> <span>/</span> <a href="' + moduleHref(m) + '">' + esc(m.title) + '</a> <span>/</span> <em>' + esc(d.title) + '</em></nav>' +
      '  <div class="drill-ex">' +
      '    <header class="drill-ex-head">' +
      '      <p class="drill-ex-count">' + t('ui.exerciseOf', { i: s.idx + 1, n: d.exercises.length }) + '</p>' +
      '      <div class="dots">' + dotsHtml(s, d.exercises.length) + '</div>' +
      '    </header>' +
      (ex.code ? '<figure class="codeblock"><figcaption>' + esc(ex.code.lang || 'code') + '</figcaption><pre><code>' + esc(ex.code.text) + '</code></pre></figure>' : '') +
      '    <h2 class="drill-ex-prompt">' + ex.prompt + '</h2>' +
      '    <div id="ex-controls">' + controls + '</div>' +
      '    <div id="ex-feedback" class="ex-feedback" role="status" aria-live="polite"' + (answered ? '' : ' hidden') + '></div>' +
      '    <div class="drill-actions drill-actions-next"' + (answered ? '' : ' hidden') + '>' +
      '      <button class="btn btn-primary" id="btn-next" type="button">' +
      (s.idx + 1 === d.exercises.length ? t('ui.seeResults') : t('ui.next')) +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '</div>';

    bindExercise(m, s, ex);
    if (answered) showFeedback(m, s, ex, true);
    annotateGlossary(main);
  }

  function shuffledPool(items) {
    var pool = items.slice();
    // Bounded retries: with duplicate item texts the old do/while could spin forever.
    for (var tries = 0; tries < 20; tries++) {
      for (var i = pool.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
      }
      if (pool.length < 2 || pool.join('|') !== items.join('|')) break;
    }
    return pool;
  }

  function bindExercise(m, s, ex) {
    var controls = $('#ex-controls');
    var feedback = $('#ex-feedback');
    var nextWrap = $('.drill-actions-next');
    var nextBtn = $('#btn-next');

    function finish(ok, picked) {
      s.answers[s.idx] = { correct: ok, picked: picked };
      if (ok) s.score++;
      showFeedback(m, s, ex, false);
      nextWrap.hidden = false;
      annotateGlossary(feedback);
      // Focus stays on the feedback (screen readers announce it via aria-live).
    }

    if (ex.type === 'quiz') {
      $$('.option', controls).forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (s.answers[s.idx] !== undefined) return;
          var i = +btn.getAttribute('data-i');
          gradeQuiz(ex, i);
          finish(!!ex.options[i].ok, i);
        });
      });
      // Replay: restore the graded state of an already-answered question.
      if (s.answers[s.idx] !== undefined) gradeQuiz(ex, s.answers[s.idx].picked);
    } else if (ex.type === 'multi') {
      var checkBtn = $('#order-check', controls);
      var boxs = $$('input[type="checkbox"]', controls);
      boxs.forEach(function (b) {
        b.addEventListener('change', function () {
          var picked = boxs.filter(function (x) { return x.checked; }).length;
          checkBtn.disabled = picked === 0;
        });
      });
      checkBtn.addEventListener('click', function () {
        if (s.answers[s.idx] !== undefined) return;
        var picked = boxs.filter(function (x) { return x.checked; }).map(function (x) { return +x.getAttribute('data-i'); });
        gradeMulti(ex, picked);
        var ok = picked.length === ex.options.filter(function (o) { return o.ok; }).length &&
          picked.every(function (i) { return ex.options[i].ok; });
        finish(ok, picked);
      });
      // Replay: restore checked boxes and marks.
      if (s.answers[s.idx] !== undefined) {
        var replayPicked = s.answers[s.idx].picked || [];
        replayPicked.forEach(function (i) { if (boxs[i]) boxs[i].checked = true; });
        gradeMulti(ex, replayPicked);
      }
    } else if (ex.type === 'order') {
      var poolEl = $('#order-pool', controls);
      var chosenEl = $('#order-chosen', controls);
      var orderCheck = $('#order-check', controls);
      var orderReset = $('#order-reset', controls);

      function updateCheck() {
        var n = $$('.order-item', chosenEl).length;
        orderCheck.disabled = n !== ex.items.length;
      }
      function move(item, toChosen) {
        if (toChosen) {
          var hint = $('.order-hint', chosenEl); if (hint) hint.remove();
          chosenEl.appendChild(item);
        } else {
          poolEl.appendChild(item);
          if (!$$('.order-item', chosenEl).length) {
            chosenEl.insertAdjacentHTML('afterbegin', '<p class="order-hint">Click pieces in the order you think is right.</p>');
          }
        }
        var n = $$('.order-item', chosenEl).length;
        $$('.order-item', chosenEl).forEach(function (el, i) {
          el.classList.add('order-chosen-item');
          var badge = el.querySelector('.order-badge');
          if (!badge) { badge = document.createElement('span'); badge.className = 'order-badge'; el.insertBefore(badge, el.firstChild); }
          badge.textContent = String(i + 1);
        });
        updateCheck();
      }
      controls.addEventListener('click', function (ev) {
        var item = ev.target.closest ? ev.target.closest('.order-item') : null;
        if (!item || s.answers[s.idx] !== undefined) return;
        if (item.disabled) return;
        move(item, item.parentElement === poolEl);
      });
      orderReset.addEventListener('click', function () {
        if (s.answers[s.idx] !== undefined) return;
        $$('.order-item', controls).forEach(function (el) {
          el.classList.remove('order-chosen-item');
          var b = el.querySelector('.order-badge'); if (b) b.remove();
          poolEl.appendChild(el);
        });
        if (!$('.order-hint', chosenEl)) {
          chosenEl.insertAdjacentHTML('afterbegin', '<p class="order-hint">Click pieces in the order you think is right.</p>');
        }
        updateCheck();
      });
      orderCheck.addEventListener('click', function () {
        if (s.answers[s.idx] !== undefined) return;
        var chosen = $$('.order-item', chosenEl).map(function (el) { return el.getAttribute('data-t'); });
        var ok = chosen.join('|') === ex.items.join('|');
        finish(ok, chosen);
      });
      // Replay: rebuild the chosen column in the recorded order.
      if (s.answers[s.idx] !== undefined) {
        var replayOrder = s.answers[s.idx].picked || [];
        replayOrder.forEach(function (txt) {
          $$('.order-item', controls).forEach(function (el) {
            if (el.getAttribute('data-t') === txt && el.parentElement === poolEl) move(el, true);
          });
        });
        orderCheck.disabled = true;
        orderReset.disabled = true;
      }
    }

    nextBtn.addEventListener('click', function () {
      s.idx++;
      if (s.idx >= ex_total(m)) {
        s.finished = true;
        renderDrillResult(m);
      } else {
        renderExercise(m, s);
      }
    });
  }

  function ex_total(m) { return m.drill.exercises.length; }

  function gradeQuiz(ex, pickedI) {
    $$('#options .option').forEach(function (el, i) {
      el.disabled = true;
      if (i === pickedI && !ex.options[i].ok) el.classList.add('option-wrong');
      if (ex.options[i].ok) el.classList.add('option-right');
    });
  }

  function gradeMulti(ex, picked) {
    $$('#options .option-check').forEach(function (el, i) {
      el.classList.add('option-locked');
      var pickedFlag = picked.indexOf(i) !== -1;
      var right = ex.options[i].ok;
      var mark;
      if (pickedFlag && right) mark = '<span class="mk mk-ok">&#10003; picked &middot; correct</span>';
      else if (pickedFlag && !right) mark = '<span class="mk mk-no">&#10007; picked &middot; wrong</span>';
      else if (!pickedFlag && right) mark = '<span class="mk mk-miss">&#9711; missed &middot; correct</span>';
      else mark = '<span class="mk mk-skip">&middot; correctly skipped</span>';
      el.insertAdjacentHTML('beforeend', mark);
      var box = el.querySelector('input'); if (box) box.disabled = true;
    });
    var cb = $('#order-check'); if (cb) cb.disabled = true;
  }

  function showFeedback(m, s, ex, replay) {
    var a = s.answers[s.idx];
    var fb = $('#ex-feedback');
    var correct = a && a.correct;
    var correctOrder = '';
    if (ex.type === 'order' && !correct) {
      correctOrder = '<div class="order-answer"><p class="order-answer-title">' + t('ui.correctOrder') + '</p><ol>' +
        ex.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') +
        '</ol></div>';
    }
    fb.innerHTML =
      '<div class="feedback ' + (correct ? 'feedback-ok' : 'feedback-no') + '">' +
      '  <p class="feedback-verdict">' + verdictHtml(correct) + '</p>' +
      correctOrder +
      '  <div class="feedback-body">' + ex.explain + '</div>' +
      (ex.lens ? '<div class="feedback-lens"><span class="lens-label">' + t('ui.lensLabel') + '</span>' + ex.lens + '</div>' : '') +
      '</div>';
    fb.hidden = false;
    if (!replay) {
      fb.setAttribute('tabindex', '-1');
      fb.focus();
    }
  }

  /* --------------------------------------------------------------- footer -- */

  $('#reset-progress').addEventListener('click', function () {
    if (window.confirm(t('ui.resetConfirm'))) {
      try { localStorage.removeItem(STORE_KEY); } catch (e) {}
      progress = loadProgress();
      sessions = {};
      updateProgressRing();
      route();
      window.scrollTo(0, 0);
    }
  });

  /* ------------------------------------------------------------- keyboard -- */

  document.addEventListener('keydown', function (ev) {
    if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey) return;
    var tag = (ev.target && ev.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (ev.target && ev.target.closest && ev.target.closest('.gloss')) return;
    if (ev.key === 'Enter') {
      var nb = $('#btn-next');
      if (nb && !nb.closest('[hidden]')) { ev.preventDefault(); nb.click(); return; }
    }
    if (lessonNav) {
      if (ev.key === 'ArrowRight' && lessonNav.next) { location.hash = lessonNav.next; }
      if (ev.key === 'ArrowLeft' && lessonNav.prev) { location.hash = lessonNav.prev; }
    }
  });

  /* ------------------------------------------------------------------ boot -- */

  function wireLanguagePicker() {
    var sel = $('#lang-select');
    if (!sel || !I18N) return;
    sel.innerHTML = I18N.supported().map(function (l) {
      return '<option value="' + l.code + '">' + esc(l.name) + '</option>';
    }).join('');
    sel.value = I18N.lang();
    sel.addEventListener('change', function () { I18N.setLang(sel.value); });
  }

  if (I18N) {
    I18N.onChange(function () {
      closeTip();
      buildGlossMatchers();
      var sel = $('#lang-select');
      if (sel) sel.value = I18N.lang();
      route();
      updateProgressRing();
    });
    I18N.init(function () {
      wireLanguagePicker();
      route();
      updateProgressRing();
    });
  } else {
    route();
    updateProgressRing();
  }
})();
