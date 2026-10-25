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
    'ui.htmlTitle': 'StAI Relevant · Engineering judgment in the AI era',
    'ui.metaDescription': 'Build engineering judgment through technical fundamentals and practical exercises: solve the right problem, understand systems, communicate clearly, and work responsibly with AI.',

    /* topbar / footer */
    'ui.navCurriculum': 'Curriculum',
    'ui.navGlossary': 'Glossary',
    'ui.navStart': 'Start',
    'ui.wordmarkSub': 'Engineering judgment in the AI era',
    'ui.progressTitle': 'Overall progress',
    'ui.langLabel': 'Language',
    'ui.footerTagline': 'engineering judgment in the AI era.',
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
    'ui.homeKicker': 'Engineering judgment in the AI era',
    'ui.homeTitle': 'Solve the right problem.<br>Understand what you build.',
    'ui.homeSub': 'AI can help you write code. Building something useful also takes judgment: understanding people’s needs, choosing tradeoffs, seeing how systems fit together, and communicating clearly. This course helps early-career developers build that judgment through technical fundamentals and practical exercises—so you can work effectively with AI, check the results, and take responsibility for what you deliver.',
    'ui.startModule1': 'Start Module 1',
    'ui.skipGauntlet': 'Skip to the Gauntlet',
    'ui.statLessons': 'lessons read',
    'ui.statDrills': 'drills passed',
    'ui.sectionPriorities': 'What you’ll practise',
    'ui.priorityProblem': 'Decide what to build—and why.',
    'ui.priorityOwnership': 'Follow through from problem to outcome.',
    'ui.prioritySystems': 'Understand how systems interact.',
    'ui.priorityCommunication': 'Write clearly so people can decide and act.',
    'ui.sectionLoop': 'The steward\u2019s loop',
    'ui.sectionLoopSub': 'Understand the problem, deliver a change, learn from the outcome. These five practices help you work safely with an agent along the way; responsibility continues after deployment.',
    'ui.verbUnderstand': 'Understand',
    'ui.verbSpecify': 'Specify',
    'ui.verbDirect': 'Direct',
    'ui.verbVerify': 'Verify',
    'ui.verbContain': 'Contain',
    'ui.loopUnderstand': 'The problem, the people, the desired outcome.',
    'ui.loopSpecify': 'Shared intent, constraints, and success criteria.',
    'ui.loopDirect': 'Reviewable steps with clear responsibility.',
    'ui.loopVerify': 'Evidence that it works—and helps.',
    'ui.loopContain': 'Limit harm, plan recovery, keep watching.',
    'ui.sectionCurriculum': 'The curriculum',
    'ui.sectionCurriculumSub': 'Module 1 starts with the problem and your responsibility for the result. Modules 2–5 explain the systems behind your decisions. Modules 6–8 develop verification, communication, and safe delivery. The Gauntlet brings them together in a simulated working day.',
    'ui.sectionHow': 'How it works',
    'ui.howLessons': '<strong>Lessons</strong> teach one layer at a time and end with <em>Judgment in practice</em>: what decision does this help you make, what could go wrong, and how would you check the result?',
    'ui.howDrills': '<strong>Drills</strong> ask you to clarify a problem, inspect code, explain a tradeoff, and choose a safe next step. 70% to pass (75% for the Gauntlet). Writing prompts in the lessons give you additional practice; they are not automatically graded.',
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
    'ui.lensLabel': 'Judgment in practice',
    'ui.sourcesTitle': 'Sources & further reading',

    /* drill intro */
    'ui.exercisesCount': '<strong>{n}</strong> exercises',
    'ui.passMark': '<strong>{need}</strong> correct to pass ({pct}%)',
    'ui.gradingNote': 'Answers are graded <strong>instantly</strong> \u2014 wrong ones come with the full story',
    'ui.begin': 'Begin \u2192',

    /* drill result */
    'ui.drillPassed': 'Drill passed.',
    'ui.drillCertified': 'Capstone passed. Keep building your judgment.',
    'ui.drillFailed': 'Not passed \u2014 yet.',
    'ui.drillScore': '<strong>{score} / {total}</strong> correct \u00b7 pass mark {need}',
    'ui.drillCapstoneBody': 'You practised turning an ambiguous request into a verified change, communicating the tradeoffs, and planning how to find out whether it helped. Passing this simulation is practice, not proof of seniority. Take the same questions into real work: what changed for the user, what evidence do you have, and what still needs attention?',
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
    'ui.pickedCorrect': 'picked \u00b7 correct',
    'ui.pickedWrong': 'picked \u00b7 wrong',
    'ui.missedCorrect': 'missed \u00b7 correct',
    'ui.correctlySkipped': 'correctly skipped',

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
