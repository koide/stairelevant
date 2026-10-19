/* =============================================================================
   STAI RELEVANT — i18n content schema
   -----------------------------------------------------------------------------
   Single source of truth for *which* curriculum/glossary fields are
   translatable and how their flat translation keys are built.

   Used by:
     - i18n.js                (browser): applies a dictionary onto CURRICULUM/GLOSSARY
     - tools/i18n-extract.js  (node):    extracts the English source keys

   Key scheme
     ui.<name>                          app chrome (see i18n/ui.js)
     m<N>.title | .tagline              module number, stable across reordering
     m<N>.lessons.<i>.title
     m<N>.lessons.<i>.blocks.<j>.html             p / h / note / lens
     m<N>.lessons.<i>.blocks.<j>.items.<k>        ul item, links title, order/multi item
     m<N>.lessons.<i>.blocks.<j>.items.<k>.<l>    terms/steps [key, value]
     m<N>.deeper.<i>.*                            same block rules
     m<N>.drill.title | .intro
     m<N>.drill.exercises.<k>.prompt | .explain | .lens
     m<N>.drill.exercises.<k>.options.<l>.text
     m<N>.drill.exercises.<k>.items.<l>
     g.<id>.term | .def | .steward

   Code blocks and URLs are intentionally NOT translatable.
============================================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.I18N_SCHEMA = factory();
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function isUrl(s) { return /^https?:\/\//.test(s); }

  /* Collect every translatable string of one block into `out`. */
  function blockCollect(out, prefix, b) {
    if (!b) return;
    if (typeof b.html === 'string') out[prefix + '.html'] = b.html;
    if (Array.isArray(b.items)) {
      b.items.forEach(function (item, i) {
        if (typeof item === 'string') out[prefix + '.items.' + i] = item;
        else if (Array.isArray(item)) {
          item.forEach(function (s, j) {
            if (typeof s === 'string' && !isUrl(s)) out[prefix + '.items.' + i + '.' + j] = s;
          });
        }
      });
    }
  }

  function collect(C, G) {
    var out = {};
    (C || []).forEach(function (m) {
      var p = 'm' + m.number;
      if (typeof m.title === 'string') out[p + '.title'] = m.title;
      if (typeof m.tagline === 'string') out[p + '.tagline'] = m.tagline;
      (m.deeper || []).forEach(function (d, i) {
        var dp = p + '.deeper.' + i;
        if (typeof d.title === 'string') out[dp + '.title'] = d.title;
        (d.blocks || []).forEach(function (b, j) { blockCollect(out, dp + '.blocks.' + j, b); });
      });
      (m.lessons || []).forEach(function (l, i) {
        var lp = p + '.lessons.' + i;
        if (typeof l.title === 'string') out[lp + '.title'] = l.title;
        (l.blocks || []).forEach(function (b, j) { blockCollect(out, lp + '.blocks.' + j, b); });
      });
      if (m.drill) {
        if (typeof m.drill.title === 'string') out[p + '.drill.title'] = m.drill.title;
        if (typeof m.drill.intro === 'string') out[p + '.drill.intro'] = m.drill.intro;
        (m.drill.exercises || []).forEach(function (e, k) {
          var ep = p + '.drill.exercises.' + k;
          if (typeof e.prompt === 'string') out[ep + '.prompt'] = e.prompt;
          if (typeof e.explain === 'string') out[ep + '.explain'] = e.explain;
          if (typeof e.lens === 'string') out[ep + '.lens'] = e.lens;
          (e.options || []).forEach(function (o, l) {
            if (o && typeof o.text === 'string') out[ep + '.options.' + l + '.text'] = o.text;
          });
          if (Array.isArray(e.items)) {
            e.items.forEach(function (it, l) { if (typeof it === 'string') out[ep + '.items.' + l] = it; });
          }
        });
      }
    });
    (G || []).forEach(function (e) {
      out['g.' + e.id + '.term'] = e.term;
      out['g.' + e.id + '.def'] = e.def;
      if (typeof e.steward === 'string') out['g.' + e.id + '.steward'] = e.steward;
    });
    return out;
  }

  /* Apply a dictionary onto the live CURRICULUM/GLOSSARY objects in place.
     The caller is responsible for restoring the English content first. */
  function apply(C, G, dict) {
    if (!dict) return;
    function put(obj, prop, key) {
      if (obj && typeof dict[key] === 'string') obj[prop] = dict[key];
    }
    function blockApply(prefix, b) {
      if (!b) return;
      put(b, 'html', prefix + '.html');
      if (Array.isArray(b.items)) {
        b.items.forEach(function (item, i) {
          var k = prefix + '.items.' + i;
          if (typeof item === 'string') {
            if (typeof dict[k] === 'string') b.items[i] = dict[k];
          } else if (Array.isArray(item)) {
            item.forEach(function (s, j) {
              if (typeof s === 'string' && typeof dict[k + '.' + j] === 'string') item[j] = dict[k + '.' + j];
            });
          }
        });
      }
    }
    (C || []).forEach(function (m) {
      var p = 'm' + m.number;
      put(m, 'title', p + '.title');
      put(m, 'tagline', p + '.tagline');
      (m.deeper || []).forEach(function (d, i) {
        var dp = p + '.deeper.' + i;
        put(d, 'title', dp + '.title');
        (d.blocks || []).forEach(function (b, j) { blockApply(dp + '.blocks.' + j, b); });
      });
      (m.lessons || []).forEach(function (l, i) {
        var lp = p + '.lessons.' + i;
        put(l, 'title', lp + '.title');
        (l.blocks || []).forEach(function (b, j) { blockApply(lp + '.blocks.' + j, b); });
      });
      if (m.drill) {
        put(m.drill, 'title', p + '.drill.title');
        put(m.drill, 'intro', p + '.drill.intro');
        (m.drill.exercises || []).forEach(function (e, k) {
          var ep = p + '.drill.exercises.' + k;
          put(e, 'prompt', ep + '.prompt');
          put(e, 'explain', ep + '.explain');
          put(e, 'lens', ep + '.lens');
          (e.options || []).forEach(function (o, l) { if (o) put(o, 'text', ep + '.options.' + l + '.text'); });
          if (Array.isArray(e.items)) {
            e.items.forEach(function (it, l) {
              if (typeof it === 'string' && typeof dict[ep + '.items.' + l] === 'string') e.items[l] = dict[ep + '.items.' + l];
            });
          }
        });
      }
    });
    (G || []).forEach(function (e) {
      put(e, 'term', 'g.' + e.id + '.term');
      put(e, 'def', 'g.' + e.id + '.def');
      put(e, 'steward', 'g.' + e.id + '.steward');
    });
  }

  return { collect: collect, apply: apply };
}));
