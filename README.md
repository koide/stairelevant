# StAI Relevant

**Engineering judgment in the AI era** — an interactive field manual for early-career developers. Learn to solve the right problem, understand what you build, communicate clearly, and take responsibility for outcomes while working with AI.

Questions, feedback, or want to build on this? **stairelevant@gmail.com**

## The premise

AI can help write code; useful software also requires choosing a worthwhile problem, following through, understanding systems, and writing clearly enough for people to decide and act. Technical fundamentals support each of those responsibilities, not just code review. Every lesson closes with **what decision this helps you make, what could go wrong, and how to check the result**.

The course keeps concrete AI failure modes, verification, and containment. It places them inside a larger loop: **understand the problem → deliver a change → learn from the outcome**. Correct behavior and customer value require different evidence. Passing the course is practice in judgment, not a senior title or professional certification.

- No build step, no runtime dependencies, no tracking. Pure HTML/CSS/JS (tests use jsdom as a devDependency).
- Progress is stored in `localStorage`. No accounts, no server needed.
- Open `index.html` directly, or serve it: `python -m http.server` / `npx serve`.

## The curriculum

| # | Module | Decisions and evidence |
|---|--------|-------------------------------|
| 1 | From Problem to Outcome | clarify the need, compare solutions, delegate with evidence, plan follow-up |
| 2 | How the Web Works | reliable requests, safe retries, credential boundaries, actual API contracts |
| 3 | How Code Actually Runs | state ownership, observable behavior, concurrency and business rules |
| 4 | Data & Databases | query costs, transaction boundaries, safe migrations and recovery |
| 5 | Architecture & Boundaries | dependency direction, maintainability, explicit tradeoffs |
| 6 | Verification & Review | meaningful tests, reviewable changes, evidence and its limits |
| 7 | Communication, Specs & Follow-through | shared intent, decision notes, specifications, handoffs and outcome checks |
| 8 | Guardrails & Containment | least privilege, release safeguards, evidence-based trust |
| 9 | The Gauntlet (capstone) | clarify a customer problem, deliver safely, communicate uncertainty and arrange follow-up |

**Structure:** each module has ~3 lessons (every one ends with *Judgment in practice*) and a pass/fail drill (70% to pass, 75% for the capstone). Lesson writing prompts practise problem statements, recommendations, and handoffs; these prompts are not automatically graded.

**Exercise types:** quizzes (with code to inspect), multi-select spec surgery, click-to-order workflow assembly.

**Go deeper:** every module ends with *Want to learn more?* panels on the real mechanics behind the lesson — the full life of an HTTP request (URL → DNS → TCP/TLS → server → response → render), what a database does on `COMMIT`, how an LLM actually generates code, why models write tests that cannot fail, prompt injection — each closing with sources you can read.

**Glossary:** 102 terms auto-tooltip on their first use in every block of lessons, drills, and feedback (definition + steward angle + authoritative links), and there is a filterable index at `#/glossary`.

## Files

```
index.html       — shell, top bar, footer
styles.css       — field-manual aesthetic, zero dependencies
curriculum.js    — ALL course content (the single source of truth)
glossary.js      — glossary terms + definitions + authoritative links
app.js           — router, lesson/drill/deep-dive renderers, glossary tooltips, progress tracking
i18n.js          — i18n runtime: language resolution, dictionary loading, content overlays
i18n/schema.js   — which fields are translatable + the flat key scheme (shared with tooling)
i18n/ui.js       — English UI source strings (the canonical fallback)
i18n/es.js, zh.js, ja.js — translation dictionaries (loaded on demand)
package.json     — dev scripts only (test + validate + i18n)
tools/validate-content.js — zero-dependency content integrity checks
                             (`node tools/validate-content.js`)
tools/i18n-extract.js     — translation source extraction + coverage (`npm run i18n`)
tools/smoke-test.js       — jsdom behavioral tests (`npm test`)
```

## Checks

```bash
npm install          # one-time: installs jsdom (devDependency)
npm run validate     # content structure + house-style rules (no deps needed)
npm test             # behavioral smoke tests against the real app
```

`validate-content.js` enforces: unique module numbering, block/exercise shapes, all lessons ending with a lens, quizzes having exactly one correct answer, multi-selects having wrong answers, order items being unique, option texts containing no raw markup, deep-dive blocks being well-formed with https source links, and glossary entries having unique ids, compilable matchers, and https links.

## Extending the course

Everything lives in `curriculum.js`. To add a module:

1. Append an object to the `CURRICULUM` array (`number` must be unique and sequential).
2. Add lessons (blocks: `p`, `h`, `ul`, `code`, `note`, `terms`, `steps`, `lens`, `links` — see the comment header of the file).
3. Add a `drill` with `exercises` (`quiz`, `multi`, or `order` types; optional `code` block and `lens` feedback).
4. Add `deeper: [{ title, blocks }]` to a module (or a lesson) for a *Want to learn more?* panel; end each with a `links` block citing https sources.
5. Add glossary terms in `glossary.js`: `{ id, term, match, cs?, def, steward?, links: [{t, u}] }`. `match` is a regex source string (`\\bAPIs?\\b`); set `cs: true` for words that collide with English (GET, PUT, UX). Links must be https.
6. Progress keys are derived from module `id`, so existing student progress is untouched.

House style for content: every lesson ends with a **lens** block; every exercise's feedback names the module it draws from ("Module 4: what does the world look like if it dies between step 2 and 3?"); wrong answers get the full story, not just "incorrect." Option texts are plain text — use the prompt and feedback for markup. When a lens or note claims something about agent behavior, phrase it as a condition with a model-independent fallback — "if your model no longer does this, the invariant still tells you how to review it." Run `npm run validate && npm test` after any edit; the validator enforces all of the house-style rules above.

## Translations (i18n)

The site ships with a language selector in the top bar and dictionaries for **Spanish, Simplified Chinese, and Japanese**. English is the source of truth and the fallback: any key a translation does not define renders in English, so partial translations degrade gracefully instead of breaking.

**How it works**

- `i18n.js` resolves the active language from `?lang=<code>` → `localStorage` → `navigator.language` → `en`, then loads `i18n/<code>.js` on demand (a plain script — no build step, works from `file://`).
- `i18n/schema.js` defines which curriculum/glossary fields are translatable and builds flat keys: `ui.navStart`, `m3.lessons.1.blocks.0.html`, `m3.drill.exercises.2.options.0.text`, `g.api.def`. Code blocks and URLs are never translated.
- Dictionaries overlay the English content in place; switching languages restores the pristine source first, so nothing is ever lost.
- Shareable links: `index.html?lang=ja#/m/3/l/0`. The selector persists the choice in `localStorage` and rewrites `?lang`.

**Working on translations**

```bash
npm run i18n         # regenerate i18n/source.json (English keys, for translators)
npm run i18n:check   # coverage per language + unknown-key detection
```

Current coverage is **100% of keys in all three languages**: UI chrome, all nine modules (lessons, deep dives, drills, the Gauntlet), and all 102 glossary entries — `npm run i18n:check` confirms it.

House style for translations: preserve HTML tags and `{placeholders}` exactly; keep code, identifiers, URLs, and article titles in their original form; keep the course's vocabulary consistent (the glossary is the canonical list).

## Deployment

The site is static: no build step, no server, no runtime dependencies. Deploying is copying files.

**Cloudflare Pages** — two options:

1. **Git integration (recommended):** Pages dashboard → *Create application → Connect to Git* → select the repo. Build command: **empty**. Build output directory: **`/`**. Every push to `main` deploys; PRs get preview URLs.
2. **CI with secrets:** `.github/workflows/deploy-cloudflare.yml` stages the site and deploys with `cloudflare/wrangler-action`. Add `CLOUDFLARE_API_TOKEN` (permission: *Cloudflare Pages — Edit*) and `CLOUDFLARE_ACCOUNT_ID` as repository secrets.
3. **From your machine:** `npm run deploy:cf` (runs `wrangler pages deploy dist`; `npx wrangler login` once, or set `CLOUDFLARE_API_TOKEN`).

The repo ships a `_headers` file that gives `i18n/*.js` a one-hour cache on Cloudflare Pages.

**GitHub Pages** — `.github/workflows/deploy.yml` stages the site and deploys on every push to `main`. Enable it once in the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

**Anywhere else** — point the host at the repository root with no build command:

| Host | Setup |
|------|-------|
| Netlify | publish directory `.`, build command empty |
| Vercel | framework preset “Other”, build command empty, output `.` |
| Cloudflare Pages | build command empty, output directory `.` |
| S3 / nginx / any static host | upload the repo (or the staged `dist/`), serve `index.html` |

**Language files and caching.** `i18n/<code>.js` is fetched only when that language is selected, so most visitors download only English. Set a moderate cache (`Cache-Control: public, max-age=3600`) for `i18n/*.js` if your host supports headers; translations deploy atomically with the rest of the site. `?lang=<code>` URLs are shareable and safe to link.

**Custom domain.** Nothing in the app depends on the hostname; add a `CNAME` file (GitHub Pages) or the host's DNS settings and everything keeps working.

## Roadmap ideas

- Spaced-repetition review of missed exercises (requires persisting per-exercise misses — not tracked yet).
- Optional dark mode (CSS variables are already namespaced in `:root`).
- Export/import progress (a single JSON blob — useful for classroom use).
- A "free play" sandbox: a deliberately misbehaving agent transcript that students annotate.

## A note on the philosophy

The course deliberately does **not** teach "prompt engineering tricks." Prompts are transient; the mental model is durable. The bet: the fundamentals (HTTP, idempotency, transactions, indexes, layers, test semantics) are *exactly* the skills that catch agents misbehaving — and they are the same skills seniors built by hand. The drills are written so that the wrong answer is always *plausible*, because that's what misbehavior looks like. Model capability moves the odds, never the obligation: a check is priced by the cost of the error, not by confidence in the author.
