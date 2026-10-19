/* =============================================================================
   STAI RELEVANT — English UI source strings
   -----------------------------------------------------------------------------
   Canonical keys for everything in the app chrome. i18n.js falls back to this
   dictionary whenever the active language file lacks a key, so the app works
   with no dictionary loaded at all.

   Keys are flat; values may contain inline HTML and {placeholders}.
============================================================================= */
(function (root) {
  'use strict';
  root.I18N_UI_EN = {
    /* document */
    'ui.htmlTitle': 'StAI Relevant \u00b7 Become a Senior Developer in the AI times',
    'ui.metaDescription': 'StAI Relevant \u2014 an interactive field manual that teaches junior developers the fundamentals needed to supervise AI coding agents: catch misbehavior, specify tasks, think at the product level. Become a senior developer in the AI times.',

    /* topbar / footer */
    'ui.navCurriculum': 'Curriculum',
    'ui.navGlossary': 'Glossary',
    'ui.navStart': 'Start',
    'ui.wordmarkSub': 'Become a Senior Developer in the AI times',
    'ui.progressTitle': 'Overall progress',
    'ui.langLabel': 'Language',
    'ui.footerTagline': 'become a senior developer in the AI times.',
    'ui.footerContact': 'Questions or ideas? Write to',
    'ui.contactTitle': 'Questions, or want to build on this?',
    'ui.contactBody': 'Want advice on applying AI stewardship in your team, a private workshop, or help extending the course? Write to',
    'ui.footerPrivacy': 'No accounts. No tracking. Your progress lives in this browser (localStorage) and nowhere else.',
    'ui.reset': 'Reset progress',
    'ui.resetConfirm': 'Reset all progress? Lessons read and drill results will be cleared. This cannot be undone.',
    'ui.noscriptTitle': 'This course is interactive.',
    'ui.noscriptBody': 'Please enable JavaScript to use it.',

    /* status chips / verdicts */
    'ui.chipPassed': 'Drill passed',
    'ui.chipLessons': '{read}/{total} lessons',
    'ui.chipIdle': 'Not started',
    'ui.correct': 'Correct',
    'ui.notQuite': 'Not quite',

    /* home */
    'ui.homeKicker': 'Become a Senior Developer in the AI times',
    'ui.homeTitle': 'Learn the machine.<br>Keep the agent honest.',
    'ui.homeSub': 'AI agents write code in seconds \u2014 but they don\u2019t know your product, your users, or your history. This course teaches you the fundamentals seniors learned by hand: the web, languages, databases, architecture \u2014 each one through a single question: <em>how do agents get this wrong, and how do I catch it?</em>',
    'ui.startModule1': 'Start Module 1',
    'ui.skipGauntlet': 'Skip to the Gauntlet',
    'ui.statLessons': 'lessons read',
    'ui.statDrills': 'drills passed',
    'ui.sectionLoop': 'The steward\u2019s loop',
    'ui.sectionLoopSub': 'Every safe interaction with an agent runs the same five verbs. The course hangs on them.',
    'ui.verbUnderstand': 'Understand',
    'ui.verbSpecify': 'Specify',
    'ui.verbDirect': 'Direct',
    'ui.verbVerify': 'Verify',
    'ui.verbContain': 'Contain',
    'ui.loopUnderstand': 'The product, the user, the constraints.',
    'ui.loopSpecify': 'Intent the machine can\u2019t misread.',
    'ui.loopDirect': 'Bounded, verifiable steps.',
    'ui.loopVerify': 'Proof, using your own mental model.',
    'ui.loopContain': 'A blast radius you can survive.',
    'ui.sectionCurriculum': 'The curriculum',
    'ui.sectionCurriculumSub': 'Modules 1 and 2\u20135 build the mindset and the machine model. 6\u20138 build the steward\u2019s craft. The Gauntlet is the final exam \u2014 a full simulated day.',
    'ui.sectionHow': 'How it works',
    'ui.howLessons': '<strong>Lessons</strong> teach one layer at a time, and every one ends with an <em>AI Steward Lens</em> \u2014 the concrete way that concept changes how you supervise agents.',
    'ui.howDrills': '<strong>Drills</strong> are pass/fail exercises: spot the misbehaving code, red-light the destructive move, assemble the safe workflow. 70% to pass (75% for the Gauntlet).',
    'ui.howGlossary': '<strong>Glossary</strong> \u2014 dotted underlines open definitions with a steward angle and authoritative sources; the full index is in the top nav.',
    'ui.howProgress': '<strong>Progress</strong> is saved in your browser. No account, no tracking, no server \u2014 this site is a folder you could own.',
    'ui.theGauntlet': 'the gauntlet',
    'ui.lessonsCountOne': '{n} lesson',
    'ui.lessonsCountMany': '{n} lessons',
    'ui.drillShort': 'drill {n}',
    'ui.bestMeta': 'best {best}/{total}',

    /* module page */
    'ui.crumbCurriculum': 'Curriculum',
    'ui.crumbGlossary': 'Glossary',
    'ui.crumbDrill': 'Drill',
    'ui.eyebrowCapstone': 'Capstone',
    'ui.eyebrowModule': 'Module {n}',
    'ui.lessonsHeading': 'Lessons',
    'ui.beginDrill': 'Begin the drill',
    'ui.retakeDrill': 'Retake the drill',
    'ui.nextShort': 'Next: {title} \u2192',
    'ui.drillBestOne': 'best {best}/{total} \u00b7 {attempts} attempt',
    'ui.drillBestMany': 'best {best}/{total} \u00b7 {attempts} attempts',
    'ui.capstoneDrillDesc': 'Eight checkpoints, one simulated day. Everything from modules 1\u20138, with honest consequences.',

    /* lesson page */
    'ui.lessonOf': 'Lesson {i} of {n}',
    'ui.markedRead': 'marked read',
    'ui.back': 'Back',
    'ui.nextLesson': 'Next lesson: {title} \u2192',
    'ui.startDrill': 'Start the drill \u2192',
    'ui.wantMore': 'Want to learn more?',
    'ui.lensLabel': 'AI Steward Lens',
    'ui.sourcesTitle': 'Sources & further reading',

    /* drill intro */
    'ui.exercisesCount': '<strong>{n}</strong> exercises',
    'ui.passMark': '<strong>{need}</strong> correct to pass ({pct}%)',
    'ui.gradingNote': 'Answers are graded <strong>instantly</strong> \u2014 wrong ones come with the full story',
    'ui.begin': 'Begin \u2192',

    /* drill result */
    'ui.drillPassed': 'Drill passed.',
    'ui.drillCertified': 'Certified. Provisionally, gloriously, a steward.',
    'ui.drillFailed': 'Not passed \u2014 yet.',
    'ui.drillScore': '<strong>{score} / {total}</strong> correct \u00b7 pass mark {need}',
    'ui.drillCapstoneBody': 'You took an ambiguous request from a warm product owner and turned it into a shipped, verified, gated feature \u2014 while an agent did the typing and you did the thinking. That\u2019s the whole job. Log your misses, keep your guardrails, and go build the judgment.',
    'ui.drillPassBody': 'The lens is taking. Take the next module, or replay this drill any time \u2014 the questions you missed are the curriculum\u2019s way of pointing at your next review checklist item.',
    'ui.drillFailBody': 'Read the feedback again: every miss above maps to a lesson in this module. Re-lesson, then retry \u2014 wrong answers here are the cheapest education you\u2019ll ever get.',
    'ui.attemptsMeta': 'Attempts: {attempts} \u00b7 best {best}/{total}',
    'ui.retryDrill': 'Retry the drill',
    'ui.backToModule': 'Back to module',
    'ui.nextModule': 'Next module \u2192',

    /* exercise chrome */
    'ui.pieces': 'Pieces',
    'ui.yourOrder': 'Your order',
    'ui.orderHint': 'Click pieces in the order you think is right.',
    'ui.checkAnswers': 'Check answers',
    'ui.checkOrder': 'Check order',
    'ui.resetOrder': 'Reset',
    'ui.exerciseOf': 'Exercise {i} of {n}',
    'ui.next': 'Next \u2192',
    'ui.seeResults': 'See results \u2192',
    'ui.correctOrder': 'Correct order',

    /* glossary page */
    'ui.reference': 'Reference',
    'ui.glossaryTitle': 'Glossary',
    'ui.glossaryTagline': 'Every term the course leans on, with authoritative sources. Terms with a dotted underline in lessons and drills open this same entry as a tooltip.',
    'ui.glossaryFilter': 'Filter terms\u2026',
    'ui.glossaryEmpty': 'No terms match that filter.',
    'ui.stewardAngle': 'Steward angle',
    'ui.glossaryAria': 'Glossary: {term}'
  };
}(typeof window !== 'undefined' ? window : globalThis));
