/* =============================================================================
   STAI RELEVANT — i18n runtime
   -----------------------------------------------------------------------------
   Resolution order for the active language:
     1. ?lang=<code> in the URL      (shareable links win)
     2. localStorage 'ai-stewardship-lang'
     3. navigator.language prefix match
     4. 'en'

   Dictionaries are plain JS files loaded on demand:
     i18n/<code>.js  ->  window.I18N_DICTS[code] = { 'ui.x': '...', 'm1.title': '...' }
   Missing keys fall back to English (i18n/ui.js + the source content), so a
   partial translation degrades gracefully instead of breaking the app.

   Content is translated by overlaying the dictionary onto CURRICULUM and
   GLOSSARY in place (see i18n/schema.js); the English source is captured once
   at load so switching languages is lossless.
============================================================================= */
(function (root) {
  'use strict';

  var SUPPORTED = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Espa\u00f1ol' },
    { code: 'zh', name: '\u4e2d\u6587' },
    { code: 'ja', name: '\u65e5\u672c\u8a9e' }
  ];
  var CODES = SUPPORTED.map(function (l) { return l.code; });
  var STORE_KEY = 'ai-stewardship-lang';

  var dicts = (root.I18N_DICTS = root.I18N_DICTS || {});
  var uiEn = root.I18N_UI_EN || {};
  var schema = root.I18N_SCHEMA;
  var lang = 'en';
  var dict = {};
  var listeners = [];
  var loading = {};

  /* --------------------------------------------------------------- content -- */

  var EN = null;
  function captureEn() {
    if (EN) return;
    try {
      EN = {
        cur: JSON.parse(JSON.stringify(root.CURRICULUM || [])),
        glo: JSON.parse(JSON.stringify(root.GLOSSARY || []))
      };
    } catch (e) { EN = { cur: [], glo: [] }; }
  }
  function replaceArray(target, source) {
    var fresh = JSON.parse(JSON.stringify(source));
    target.length = 0;
    fresh.forEach(function (o) { target.push(o); });
  }
  function applyContent() {
    captureEn();
    var CUR = root.CURRICULUM || [];
    var GLO = root.GLOSSARY || [];
    replaceArray(CUR, EN.cur);
    replaceArray(GLO, EN.glo);
    if (schema && dict) schema.apply(CUR, GLO, dict);
  }

  /* ---------------------------------------------------------------- lookup -- */

  function t(key, vars) {
    var value = dict[key];
    if (typeof value !== 'string') value = uiEn[key];
    if (typeof value !== 'string') value = key;
    if (vars) {
      value = value.replace(/\{(\w+)\}/g, function (m, name) {
        return vars[name] !== undefined && vars[name] !== null ? String(vars[name]) : m;
      });
    }
    return value;
  }

  function lookup(key) {
    var value = dict[key];
    if (typeof value !== 'string') value = uiEn[key];
    return typeof value === 'string' ? value : null;
  }

  /* ----------------------------------------------------------- static DOM -- */

  function applyStatic(node) {
    var scope = node || document;
    var all = scope.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-aria-label], [data-i18n-title], [data-i18n-content]');
    Array.prototype.forEach.call(all, function (el) {
      var v;
      if ((v = el.getAttribute('data-i18n')) !== null) el.textContent = t(v);
      if ((v = el.getAttribute('data-i18n-html')) !== null) el.innerHTML = t(v);
      if ((v = el.getAttribute('data-i18n-placeholder')) !== null) el.setAttribute('placeholder', t(v));
      if ((v = el.getAttribute('data-i18n-aria-label')) !== null) el.setAttribute('aria-label', t(v));
      if ((v = el.getAttribute('data-i18n-title')) !== null) el.setAttribute('title', t(v));
      if ((v = el.getAttribute('data-i18n-content')) !== null) el.setAttribute('content', t(v));
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
    var title = lookup('ui.htmlTitle');
    if (title) document.title = title;
  }

  /* -------------------------------------------------------------- loading -- */

  function loadDict(code, done) {
    if (code === 'en' || dicts[code]) return done();
    if (loading[code]) { loading[code].push(done); return; }
    loading[code] = [done];
    var s = document.createElement('script');
    s.src = 'i18n/' + code + '.js';
    s.onload = function () { flush(code); };
    s.onerror = function () { flush(code); };
    document.head.appendChild(s);
  }
  function flush(code) {
    var queue = loading[code] || [];
    delete loading[code];
    queue.forEach(function (fn) { fn(); });
  }

  /* ----------------------------------------------------------- resolution -- */

  function fromQuery() {
    try {
      var m = /[?&]lang=([a-zA-Z-]+)/.exec(location.search);
      if (!m) return null;
      var code = m[1].toLowerCase().split('-')[0];
      return CODES.indexOf(code) !== -1 ? code : null;
    } catch (e) { return null; }
  }
  function fromStore() {
    try {
      var code = localStorage.getItem(STORE_KEY);
      return code && CODES.indexOf(code) !== -1 ? code : null;
    } catch (e) { return null; }
  }
  function fromNavigator() {
    try {
      var code = (navigator.language || '').toLowerCase().split('-')[0];
      return CODES.indexOf(code) !== -1 ? code : null;
    } catch (e) { return null; }
  }
  function resolve() {
    return fromQuery() || fromStore() || fromNavigator() || 'en';
  }

  function persist(code) {
    try { localStorage.setItem(STORE_KEY, code); } catch (e) {}
  }
  function syncUrl(code) {
    try {
      var search = location.search.replace(/([?&])lang=[^&]*&?/, '$1').replace(/[?&]$/, '');
      var next = '?lang=' + code + (search ? '&' + search.replace(/^\?/, '') : '') + location.hash;
      history.replaceState(null, '', location.pathname + next);
    } catch (e) { /* file:// or sandbox */ }
  }

  /* -------------------------------------------------------------- public -- */

  function setLang(code, opts) {
    opts = opts || {};
    if (CODES.indexOf(code) === -1) code = 'en';
    if (code === lang && !opts.force) return;
    persist(code);
    if (opts.updateUrl !== false) syncUrl(code);
    loadDict(code, function () {
      lang = code;
      dict = code === 'en' ? {} : (dicts[code] || {});
      applyContent();
      applyStatic(document);
      listeners.forEach(function (fn) { try { fn(lang); } catch (e) {} });
      try {
        root.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: lang } }));
      } catch (e) { /* older engines */ }
    });
  }

  function init(cb) {
    var code = resolve();
    lang = 'en';
    dict = {};
    captureEn();
    loadDict(code, function () {
      lang = code;
      dict = code === 'en' ? {} : (dicts[code] || {});
      applyContent();
      applyStatic(document);
      if (cb) cb(lang);
    });
  }

  function glossaryMatch(entry) {
    if (lang === 'en' || !entry || !entry.term) {
      return { source: entry ? entry.match : '', flags: entry && entry.cs ? '' : 'i' };
    }
    var escaped = String(entry.term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return { source: escaped, flags: lang === 'es' ? 'i' : '' };
  }

  root.I18N = {
    init: init,
    setLang: setLang,
    onChange: function (fn) { listeners.push(fn); },
    t: t,
    lookup: lookup,
    lang: function () { return lang; },
    supported: function () { return SUPPORTED.slice(); },
    applyStatic: applyStatic,
    glossaryMatch: glossaryMatch
  };
}(typeof window !== 'undefined' ? window : globalThis));
