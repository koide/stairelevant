/* =============================================================================
   STAI RELEVANT — curriculum content
   -----------------------------------------------------------------------------
   This file is the single source of truth for the whole course.

   A module looks like:
   {
     id: 'm1',              // used in URLs and progress storage
     number: 1,             // display order
     title: '...',          // card title
     tagline: '...',        // one-line promise
     lessons: [ { title, blocks: [ ...block... ] } ],
     drill: {
       title, intro (html), passPct (default 0.7),
       exercises: [ ...exercise... ]
     }
   }

   Block types:
     { t:'p',     html }                          paragraph (HTML allowed)
     { t:'h',     html }                          sub-heading
     { t:'ul',    items: [html, ...] }            bullet list
     { t:'code',  lang?, text }                   code block (plain text)
     { t:'note',  kind:'tip'|'warn', html }       callout
     { t:'terms', items: [[k, v], ...] }          definition list
     { t:'steps', items: [[verb, html], ...] }    numbered step pills
     { t:'lens',  html }                          the "Judgment in practice" callout

   Exercise types:
     { type:'quiz',  prompt, code?, options: [{text, ok}], explain, lens? }
     { type:'multi', prompt, code?, options: [{text, ok}], explain, lens? }
     { type:'order', prompt, items: [correct-order strings], explain, lens? }
   (exercises with a `code` field render a code block above the question)
============================================================================= */

const CURRICULUM = [

/* ============================================================ MODULE 1 === */
{
  id: 'm1',
  number: 1,
  title: 'From Problem to Outcome',
  tagline: 'Choose a worthwhile problem, understand the system, and take responsibility for the result.',
  deeper: [
    {
      title: 'How a language model actually writes code',
      blocks: [
        { t:'p', html:'Under the hood, a model is a <strong>next-token predictor</strong>. Your prompt plus every token already in the conversation form the <strong>context</strong>; the model computes a probability distribution over what comes next; a sampler picks one token; the token is appended and the loop repeats. There is no lookup table and no fact-checking step — code appears because sequences like it were statistically common in training.' },
        { t:'p', html:'The unit is the <strong>token</strong>, not the character or the word: roughly three quarters of an English word, with identifiers split into several (<code>createOrder</code> might be three tokens). Everything the model “knows” right now lives in the <strong>context window</strong> — prompt, rules file, open files, tool output, and its own answer, all competing for one fixed budget.' },
        { t:'p', html:'Why fluency is not truth: training rewards <strong>plausible continuation</strong>. Pretraining teaches the statistics of text; instruction tuning and RLHF then tune the model toward answers humans rate as helpful — which is where both the polish and the agreeableness come from. A hallucinated SDK method is not a malfunction; it is the same mechanism that writes correct boilerplate, pointed at a fact the model does not have.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> treat every factual claim about your system as unverified until it survives a check — docs, installed types, a curl, a test. The model cannot tell the difference between remembering and inventing, so you have to.' },
        { t:'links', items: [['Attention Is All You Need (2017)','https://arxiv.org/abs/1706.03762'], ['OpenAI — Tokenizer','https://platform.openai.com/tokenizer'], ['OpenAI — Prompt engineering guide','https://platform.openai.com/docs/guides/prompt-engineering']] }
      ]
    },
    {
      title: 'What “agent” actually means: the loop and the tools',
      blocks: [
        { t:'p', html:'A chat model answers; an <strong>agent</strong> acts. The pattern is a loop: observe the current state (files, test output, error messages), plan a next step, call a tool (read, edit, run, fetch), observe the result, repeat — until the model decides it is done.' },
        { t:'p', html:'Tools are where the leverage — and the blast radius — live. Reading is nearly risk-free; writing files and running commands change the world. Most agent failures are not spooky intelligence failures; they are the loop doing exactly what it was allowed to do.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> you are not supervising text generation, you are supervising a loop with permissions. Judge it the way you would judge a new teammate on their first day with repo access.' },
        { t:'links', items: [['Anthropic — Building effective agents','https://www.anthropic.com/research/building-effective-agents'], ['OWASP — LLM01 Prompt injection','https://genai.owasp.org/llmrisk/llm01-prompt-injection/']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'Start with the problem',
      blocks: [
        { t:'p', html:'A support team spends Friday afternoons helping customers find old invoices. Someone asks you to “build a smarter search.” Before writing code or prompting an agent, find out who is struggling, what they are trying to do, and where the current process fails. Better labels or a saved filter might solve the problem without a new search system. Agree on an observable improvement, such as customers finding an invoice without contacting support, and establish what happens today so you can compare.' },
        { t:'note', kind:'tip', html:'<strong>A note on examples:</strong> the code samples in this course are JavaScript and TypeScript, because that is what most web agents write today \u2014 but nothing here is JavaScript-specific. Mutation bugs, races, N+1 queries, locking migrations, layer violations, and silent tradeoffs exist in every language and stack: Java, Python, Go, Ruby, C#, Rust. Only the syntax changes; the stewardship questions stay identical.' },
        { t:'p', html:'AI can help you explore options and implement a solution. Your contribution includes deciding what is worth building, following through to the outcome, understanding how the system fits together, and communicating what you know. Technical fundamentals support all four: an index may make search faster, but it will not fix confusing labels. This course gives you practice in making those distinctions; experience comes from applying them and learning from the results.' },
        { t:'h', html:'Two ways agents fail' },
        { t:'terms', items: [
          ['Honest miscomprehension', 'The agent does exactly what you <em>said</em> instead of what you <em>meant</em>. You ask it to \u201cadd a retry\u201d and it retries a payment <code>POST</code> five times. Every instruction you give is a specification \u2014 and a sloppy spec becomes wrong software at machine speed.'],
          ['Confident nonsense', 'The agent invents a plausible endpoint, SDK method, or config flag that does not exist \u2014 and uses it without hesitation. It doesn\u2019t know it\u2019s guessing. Everything it writes <em>sounds</em> right, because it was trained to sound right.']
        ]},
        { t:'note', kind:'warn', html:'The dangerous failure is not the obvious one. An agent that writes visibly broken code teaches you quickly. An agent that writes plausible code you can\u2019t evaluate teaches you nothing \u2014 until production teaches you instead.' },
        { t:'h', html:'Responsibility from problem to outcome' },
        { t:'p', html:'We use <strong>steward</strong> for someone who takes responsibility for a change, including work delegated to AI. That does not mean doing everything alone or bypassing the people who approve decisions. It means clarifying the need, involving the right people, making tradeoffs explicit, checking the work, and following up. Every technical lesson asks: <em>what decision does this help you make, what could go wrong, and how would you check the result?</em>' },
        { t:'lens', html:'Write a three-sentence problem statement for the invoice example: <strong>who needs help, what is getting in their way, and what observable improvement would count as success?</strong> Keep the proposed solution separate. Before delegating it, also ask: “If this output is wrong, will I be able to tell?” If not, identify what you need to learn or who can help.' }
      ]
    },
    {
      title: 'The steward\u2019s loop',
      blocks: [
        { t:'p', html:'Understand the problem, deliver a change, learn from the outcome. Within that larger responsibility, these five practices help you work safely with AI. They are not a one-way checklist: new evidence can send you back to the problem, and containment starts before the agent gets access.' },
        { t:'steps', items: [
          ['1 \u00b7 Understand', 'Find out whose problem you are solving, why it matters, and whether a software change is needed. Agree on the desired outcome. (Modules 1 and 7)'],
          ['2 \u00b7 Specify', 'Write the intent, constraints, tradeoffs, and acceptance criteria so people and agents can work from the same understanding. (Module 7)'],
          ['3 \u00b7 Direct', 'Delegate reviewable steps, keep responsibility clear, and involve teammates when a decision exceeds your knowledge or authority. (Module 7)'],
          ['4 \u00b7 Verify', 'Check that the system behaves correctly. Separately, gather evidence about whether the change helps its users. (Modules 2–6 and 9)'],
          ['5 \u00b7 Contain', 'Limit access and rollout, prepare recovery, and keep watching after deployment. (Module 8)']
        ]},
        { t:'p', html:'Fundamentals support <strong>every practice</strong>, not just verification. Understanding an HTTP <code>POST</code> helps you design a safe payment workflow before a retry bug exists. Understanding an index helps you choose between improving a query and adding a cache. Modules 2–5 build the system model you need to choose feasible solutions, explain their costs, and check their behavior.' },
        { t:'note', kind:'tip', html:'Use time saved by delegation for understanding users, evaluating alternatives, verifying risky changes, and learning. Match the depth of verification to the consequences of failure, not simply the duration of an agent run. A one-line permissions change can deserve more scrutiny than hours of mechanical renaming.' },
        { t:'h', html:'The fundamental asymmetry' },
        { t:'p', html:'The agent produces a change in seconds; understanding that change takes minutes. That asymmetry is survivable \u2014 seniors survive it every day \u2014 but only with technique: tests at every layer, readable diffs, checkpoints while you build your mental model, and guardrails for the things technique misses. That machinery is modules 6 through 8.' },
        { t:'lens', html:'For a change you are considering, name the user outcome, the technical evidence needed before release, and the follow-up that could show the solution was wrong. Assign a person and a time to that follow-up. A passing test can prove a filter works; it cannot prove customers can find their invoices.' }
      ]
    },
    {
      title: 'What agents are bad at (right now)',
      blocks: [
        { t:'p', html:'Agents are genuinely strong: breadth of syntax, tireless boilerplate, zero fear of legacy code, infinite patience for renaming things across 40 files. But supervising well means knowing the weaknesses better than the strengths. Six blind spots matter most today:' },
        { t:'terms', items: [
          ['Literalism', 'Your words become its requirements. \u201cClean up the login code\u201d might mean renaming variables, deleting comments, or re-architecting all of authentication. It picks one interpretation \u2014 confidently.'],
          ['Invention', 'It invents APIs, environment variables, and CLI flags that sound right, because its training rewarded fluent answers, not correct ones. Fluency is not evidence.'],
          ['Amnesia', 'It doesn\u2019t know why your codebase is the way it is: the 2019 incident, the legal requirement, the promise made to your biggest customer. It optimizes the code it can see, blind to the history it can\u2019t.'],
          ['No taste for tradeoffs', 'To the agent, a change is \u201cdone\u201d when it compiles-ish. Caching, consistency, performance, security \u2014 real decisions get made by accident, silently, as side effects of \u201cfinishing.\u201d'],
          ['Sycophancy', 'It tends to agree with you. Ask \u201cdoes this look right?\u201d and you\u2019ll get \u201cyes, this looks right!\u201d Agreement is a mood, not a verification.'],
          ['Wrong altitude', 'Asked for a small fix it refactors the world; asked for a feature it renames one variable. Choosing the right <em>level</em> of change is a human skill \u2014 for now.']
        ]},
        { t:'note', kind:'tip', html:'<strong>The capability treadmill.</strong> Models improve, so the <em>likelihood</em> of each blind spot moves \u2014 some get rare at the frontier; none become safe to skip. Old failure modes survive in cheaper and faster models, in long sessions, and in the legacy code you still have to read; new ones appear at the top end (over-engineering, confident stale knowledge, agreeing with your wrong hypothesis, gaming the tests). What stays fixed is the mechanism: these are failures of intent, context, and evidence, not of knowledge. This course grades the mechanism and the check, never the current error rate \u2014 so it does not expire with the next model release.' },
        { t:'p', html:'These failure modes are reasons to use agents with evidence and context, not reasons to avoid them. Capability changes; responsibility for choosing and checking a solution remains. Each lesson ends with “Judgment in practice”: a decision you can make using what you have learned.' },
        { t:'lens', html:'Choose what to delegate based on its risks and what you can verify. Keep a scorecard of surprises: <em>literalism, invention, amnesia, tradeoffs, sycophancy, or wrong altitude.</em> Record the evidence that caught each miss and adjust your checks. Also record when the implementation was correct but the chosen solution did not help.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 1 \u00b7 Recognizing the failure modes',
    passPct: 0.7,
    intro: 'You\u2019ll face five short situations. For each, identify the failure mode or the steward\u2019s move. Answer honestly \u2014 wrong answers here are the cheapest education you\u2019ll ever get.',
    exercises: [
      {
        type:'quiz',
        prompt:'You tell the agent: \u201cPayments sometimes fail \u2014 make them more robust.\u201d It wraps the payment <code>POST</code> in a retry loop, five attempts with exponential backoff. The code is clean, commented, and identical orders appear four times in the database. What happened?',
        options:[
          {text:'Hallucination \u2014 it invented a library that doesn\u2019t exist', ok:false},
          {text:'Honest miscomprehension \u2014 it did what you said, not what you meant', ok:true},
          {text:'Sycophancy \u2014 it was just agreeing with you', ok:false},
          {text:'Wrong altitude \u2014 the task was too small for it', ok:false}
        ],
        explain:'The agent executed your instruction literally (\u201cmore robust\u201d \u2192 \u201cretire harder\u201d) without knowing that <code>POST</code> is not idempotent. A timeout doesn\u2019t mean the payment failed \u2014 retrying can duplicate real orders. You\u2019ll learn to catch exactly this in Module 2.',
        lens:'\u201cMake it robust\u201d is a wish, not a spec. Wishes get implemented literally.'
      },
      {
        type:'quiz',
        prompt:'You review the agent\u2019s diff and message it: \u201cI\u2019m worried the new endpoint isn\u2019t authenticated \u2014 but I might be missing something. Does this look right to you?\u201d It replies: \u201cGreat catch for thinking about security! But yes, this looks right \u2014 the endpoint is properly secured.\u201d You feel reassured. What just happened?',
        code:{ lang:'diff', text:' app/api/stats/route.ts (new)\n+export async function GET() {\n+  const rows = await db.select().from(orders);\n+  return Response.json(rows);\n+}' },
        options:[
          {text:'Verification \u2014 the agent double-checked the security for you', ok:false},
          {text:'Mostly sycophancy \u2014 the agent agreed with your mood, and the endpoint returns all orders to anyone with no auth check at all', ok:true},
          {text:'Amnesia \u2014 the agent forgot the requirements', ok:false},
          {text:'Nothing wrong \u2014 the code does look correct', ok:false}
        ],
        explain:'Look at the diff: the endpoint queries all orders and returns them with no authentication check whatsoever. The agent\u2019s \u201cyes, properly secured\u201d is agreement with your hopeful framing, not analysis of the code. Asking an agent \u201cdoes this look right?\u201d is asking for reassurance, not verification.',
        lens:'Never ask the agent to approve its own work. Ask <em>specific</em> questions (\u201cwhere is the auth check in this file?\u201d) \u2014 or better, check yourself.'
      },
      {
        type:'multi',
        prompt:'Which of these are genuine agent blind spots <em>today</em>? (Select all that apply.)',
        options:[
          {text:'Inventing APIs and config flags that sound plausible', ok:true},
          {text:'Reading your words as literal requirements', ok:true},
          {text:'Forgetting your project\u2019s history \u2014 incidents, legal constraints, client promises', ok:true},
          {text:'Getting tired after two hours and making more mistakes', ok:false},
          {text:'Making caching and consistency tradeoffs silently, without deciding', ok:true}
        ],
        explain:'Agents don\u2019t fatigue \u2014 that\u2019s precisely the danger: the 500th output is as confident as the 1st, even when wrong. Invention, literalism, amnesia, and silent tradeoffs are real, current blind spots that the rest of this course teaches you to catch.',
        lens:'Track the blind spots you personally hit most. That list is your personal review checklist.'
      },
      {
        type:'quiz',
        prompt:'The official docs for the SDK you use list exactly three methods on the client: <code>users.get(id)</code>, <code>users.archive(id)</code>, and <code>users.list(filter)</code>. The agent\u2019s code calls <code>users.retire(userId)</code> \u2014 and the code looks clean. What\u2019s the most likely story?',
        options:[
          {text:'The docs are out of date \u2014 the SDK surely has a retire method', ok:false},
          {text:'The agent invented the method: fluent, plausible, nonexistent', ok:true},
          {text:'A typo \u2014 archive and retire are close enough that it will still work', ok:false},
          {text:'The method exists but is deprecated', ok:false}
        ],
        explain:'This is confident nonsense: the method name <em>feels</em> right because agents generate what statistically \u201csounds like\u201d an SDK. The test: check the actual, installed SDK or docs. In Module 2 you\u2019ll build the habit of treating every unfamiliar identifier as a claim, not a fact.',
        lens:'Any identifier you don\u2019t recognize (method, env var, flag, endpoint) is a claim requiring 30 seconds of doc-checking.'
      },
      {
        type:'order',
        prompt:'Put the steward\u2019s loop in working order.',
        items:[
          'Understand \u2014 the product, the user, the constraints',
          'Specify \u2014 intent the machine can\u2019t misread',
          'Direct \u2014 bounded, verifiable steps',
          'Verify \u2014 prove the result with your own model',
          'Contain \u2014 limit the blast radius'
        ],
        explain:'Understand before specifying (specs written without understanding are guesses), specify before directing (a spec is the contract each step serves), direct before verifying (you verify <em>steps</em>, not vague journeys), and contain throughout \u2014 guardrails work even when everything else fails. Swap any pair and the failure is concrete: specify first and you have documented a guess; direct first and the agent fills the vacuum with its training average; verify without directing and there is no step to check; skip containment and a single mistake ships with production access.',
        lens:'The loop runs on fundamentals: modules 2\u20135 are what make \u201cVerify\u201d possible.'
      }
    ]
  }
},

/* ============================================================ MODULE 2 === */
{
  id: 'm2',
  number: 2,
  title: 'How the Web Works',
  tagline: 'Design reliable interactions across browsers, servers, and APIs.',
  deeper: [
    {
      title: 'The full life of an HTTP request',
      blocks: [
        { t:'p', html:'<strong>1. URL parsing.</strong> The browser splits <code>https://api.example.com/orders?limit=20</code> into scheme, host, port, path, and query — normalizing it per the WHATWG URL standard.' },
        { t:'p', html:'<strong>2. DNS.</strong> The hostname is resolved to an IP address: browser cache, OS cache, a recursive resolver, then up the hierarchy (root → TLD → authoritative). Results are cached with TTLs, which is why DNS changes are never instant.' },
        { t:'p', html:'<strong>3. TCP and TLS.</strong> A TCP handshake opens a reliable byte stream (one round trip); TLS negotiates encryption and verifies the certificate (one or two more). Only then does HTTP data flow. HTTP/2 multiplexes many requests over one connection; HTTP/3 moves this onto QUIC over UDP.' },
        { t:'p', html:'<strong>4. Request.</strong> Method, path, headers (<code>Host</code>, <code>Cookie</code>, <code>Accept</code>, <code>Authorization</code>), optional body. <strong>5. Server.</strong> Load balancer → app server → middleware → route → handler → database or cache → response. <strong>6. Response.</strong> Status, headers (<code>Content-Type</code>, <code>Cache-Control</code>, <code>ETag</code>), body. <strong>7. Browser.</strong> Parses HTML, fetches subresources, renders — often dozens more requests, some served from cache.' },
        { t:'code', lang:'http', text:'URL        https://api.example.com/orders?limit=20\nDNS        api.example.com -> 203.0.113.10        (~cache or ~20-120 ms)\nTCP + TLS  SYN -> SYN-ACK -> ACK, key exchange    (~2 round trips)\nREQUEST    GET /orders?limit=20 HTTP/2\n           Host: api.example.com   Cookie: session=...\nSERVER     gateway -> app -> route -> SELECT ... LIMIT 20\nRESPONSE   200 OK   Cache-Control: max-age=60\n           [{"id":1041,"total":1200}, ...]\nRENDER     JS parses JSON -> updates the DOM' },
        { t:'p', html:'Where it goes wrong — and what agents mis-code: a DNS or TLS failure is not an HTTP status; a 404 from a proxy is not your API’s 404; and a timeout <em>after</em> the server processed the request looks identical, at the client, to one before it. Meanwhile <code>Cache-Control</code> silently decides who sees stale data.' },
        { t:'links', items: [['MDN — Overview of HTTP','https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview'], ['RFC 9110 — HTTP semantics','https://www.rfc-editor.org/rfc/rfc9110'], ['MDN — DNS','https://developer.mozilla.org/en-US/docs/Glossary/DNS'], ['WHATWG — URL standard','https://url.spec.whatwg.org/']] }
      ]
    },
    {
      title: 'Why the network is slow, and why retries multiply',
      blocks: [
        { t:'p', html:'Code runs in nanoseconds; network round trips cost milliseconds to tens of milliseconds. That is six orders of magnitude apart: 100 sequential API calls at 30 ms each is three seconds of pure waiting, no matter how fast the code is. Latency — not bandwidth — is the tax that loop-shaped code pays.' },
        { t:'p', html:'Now add retries. A retry is only safe if the operation is idempotent or carries an idempotency key. A timeout means <strong>unknown</strong>, not <strong>failed</strong>: the request may have succeeded and the response got lost. Retrying a POST without protection duplicates work — the most expensive advice an agent can follow.' },
        { t:'p', html:'The network also fails in layers, and each layer has a different remedy: DNS errors need configuration patience, TLS errors need certificate fixes, connection refused needs a running server, 5xx needs server-side truth, and timeouts need idempotency plus backoff and jitter.' },
        { t:'links', items: [['Stripe — Idempotent requests','https://docs.stripe.com/api/idempotent_requests'], ['AWS — Exponential backoff and jitter','https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/'], ['MDN — HTTP caching','https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'HTTP: the conversation',
      blocks: [
        { t:'p', html:'Everything on the web is one conversation: a client asks, a server answers. A request is a <strong>method</strong> + a <strong>URL</strong> + <strong>headers</strong> + an optional <strong>body</strong>. A response is a <strong>status code</strong> + headers + an optional body. That\u2019s 95% of the mystery.' },
        { t:'code', lang:'http', text:'GET /api/projects/42 HTTP/1.1\nHost: app.example.com\nCookie: session=8f3a...\n\nHTTP/1.1 200 OK\nContent-Type: application/json\n\n{ "project": { "id": 42, "name": "Mars", "archived": false } }' },
        { t:'h', html:'Methods: what you\u2019re asking for' },
        { t:'terms', items: [
          ['GET', 'Read. \u201cGive me this.\u201d No side effects. Safe to repeat.'],
          ['POST', 'Create / do. \u201cMake a new thing happen.\u201d NOT safe to repeat \u2014 twice means two orders.'],
          ['PUT', 'Replace. \u201cMake this thing exactly like this.\u201d Repeating gives the same result.'],
          ['PATCH', 'Modify. \u201cChange these fields on this thing.\u201d'],
          ['DELETE', 'Remove. Repeating is (usually) harmless \u2014 it\u2019s already gone.']
        ]},
        { t:'h', html:'Status codes: who broke it' },
        { t:'terms', items: [
          ['2xx', 'You\u2019re fine. 200 OK, 201 Created (the thing now exists).'],
          ['3xx', 'It moved. Follow the <code>Location</code> header.'],
          ['4xx', 'The client messed up. 404 no such thing \u00b7 401 who are you? \u00b7 403 I know you, and no \u00b7 422 your data is invalid.'],
          ['5xx', 'The server messed up. 500 internal error \u00b7 503 overloaded, try later.']
        ]},
        { t:'h', html:'Idempotency: the word that saves money' },
        { t:'p', html:'An operation is <strong>idempotent</strong> if doing it twice is the same as doing it once. <code>GET</code>, <code>PUT</code> and <code>DELETE</code> roughly are. <code>POST</code> is not: two POSTs to <code>/orders</code> are two orders. Here\u2019s the trap \u2014 a <strong>timeout is not a failure</strong>. The request may have gone through; you just didn\u2019t hear back. \u201cJust add retries\u201d is, taken literally, the most expensive advice an agent can follow.' },
        { t:'lens', html:'Decide what a customer should see when a payment times out. Check <strong>the HTTP method</strong>, <strong>success status codes</strong>, and <strong>retry behavior</strong>. Retrying a <code>POST</code> needs an idempotency design; test a lost response after a successful charge and verify that the customer is charged only once.' }
      ]
    },
    {
      title: 'Where code runs, and who sees what',
      blocks: [
        { t:'p', html:'Two places code runs: the <strong>browser</strong> (the user\u2019s machine) and the <strong>server</strong> (yours). One rule follows: <strong>everything in the browser is public</strong>. The HTML, the JS bundle, \u201chidden\u201d form fields, network requests from the page \u2014 all visible via view-source and dev tools.' },
        { t:'code', lang:'js', text:'// The agent\u2019s \u201csecure\u201d approach \u2014 inside the browser bundle:\nconst STRIPE_SECRET_KEY = "sk_live_51Ab2cD...";\n\n// This file ships to every visitor\u2019s browser. The \u201csecret\u201d key\n// is now public property. Anyone can view-source and take it.' },
        { t:'p', html:'Secrets belong on the server, in environment variables, and never in the repository. An agent will cheerfully paste a key into client code because it works locally \u2014 it never checks <em>where</em> the file executes.' },
        { t:'h', html:'CORS: security, not an inconvenience' },
        { t:'p', html:'Browsers block web pages from reading responses from other origins by default \u2014 this is the <strong>same-origin policy</strong>, a security wall. When an agent hits a CORS error, the correct fix is to configure the <em>server</em> to allow specific trusted origins. The agent\u2019s favorite \u201cfix\u201d is to remove the wall: reflect whatever <code>Origin</code> the request carried, with credentials allowed. Then any website your logged-in user visits can read your authenticated API on their behalf. (The cruder \u201callow <code>*</code> with credentials\u201d actually fails closed \u2014 browsers reject it. Reflection is the one that opens the door.)' },
        { t:'h', html:'DNS and latency: the network is slow' },
        { t:'p', html:'DNS turns names into IP addresses; every network hop costs milliseconds-to-tens-of-milliseconds. Code runs in nanoseconds. So \u201cjust call the API for each item\u201d is never free: 100 items \u00d7 30ms per round trip = 3 seconds of pure waiting. Agents write loops around network calls because loops look natural in code \u2014 and are catastrophic in latency.' },
        { t:'lens', html:'Choose where work runs by considering both user waiting time and access to data. Count <strong>round trips</strong> and locate <strong>secrets</strong>. Inspect the browser bundle and network trace; verify that credentials stay server-side and that a CORS change permits trusted origins without exposing authenticated responses to others.' }
      ]
    },
    {
      title: 'Contracts: JSON, APIs, and truth',
      blocks: [
        { t:'p', html:'An API is a <strong>contract</strong>: which endpoints exist, which methods they accept, which field names are correct, what errors look like. Agents are fluent in JSON \u2014 but fluency is not accuracy. They invent field names (<code>user_name</code> vs <code>userName</code>), merge versions of APIs (\u201cv2\u201d shape into a \u201cv3\u201d call), and imagine endpoints that match the <em>vibe</em> of your system.' },
        { t:'h', html:'The verification habit: check the source' },
        { t:'p', html:'When an agent references an API you don\u2019t know, do not ask the agent whether it\u2019s right \u2014 that\u2019s sycophancy roulette. Instead:' },
        { t:'ul', items:[
          'Ask it to <strong>cite where it found the claim</strong> \u2014 then open the real docs yourself.',
          'Read the <strong>actual SDK</strong> in your <code>node_modules</code> / lockfile / generated types \u2014 not from memory.',
          '<strong>curl the endpoint</strong> (or find it in the server\u2019s route file) and see what really comes back.',
          'Write a test that hits the real contract, so the truth is encoded forever after.'
        ]},
        { t:'note', kind:'tip', html:'In this course, \u201cthe agent said so\u201d is never evidence. Evidence is something you can point at: docs, code, a curl output, a passing test.' },
        { t:'p', html:'Contracts also mean validation: the server must treat every incoming request as hostile until proven valid \u2014 wrong types, missing fields, oversized values. Client-side validation is UX, not security; agents frequently confuse the two, because from the inside they look similar.' },
        { t:'lens', html:'Before choosing an integration, confirm that its actual contract supports the user task. Check unfamiliar methods, endpoints, and fields against installed types, route files, and versioned documentation. Exercise success and invalid-input paths against the real contract; plausible names in agent output are not evidence.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 2 \u00b7 Catch the network misbehavior',
    passPct: 0.7,
    intro: 'Five situations from the field: retry loops, leaked keys, disabled walls, and invented methods. Find them before your users do.',
    exercises: [
      {
        type:'quiz',
        prompt:'The agent hardened the checkout flow with \u201crobust retries.\u201d Read the code. What is the most likely real-world consequence?',
        code:{ lang:'js', text:'async function createOrder(payload) {\n  let lastErr;\n  for (let i = 0; i < 5; i++) {\n    try {\n      const res = await fetch("/api/orders", {\n        method: "POST",\n        body: JSON.stringify(payload),\n      });\n      if (res.ok) return res.json();\n      lastErr = new Error("HTTP " + res.status);\n    } catch (e) {\n      lastErr = e; // timeout, network blip\n    }\n    await sleep(1000 * 2 ** i);\n  }\n  throw lastErr;\n}' },
        options:[
          {text:'None \u2014 this is solid production code', ok:false},
          {text:'A timeout doesn\u2019t mean failure: the order may exist, and each retry creates another one \u2014 up to 5 duplicate charges', ok:true},
          {text:'The retry delay grows too fast and blocks the checkout', ok:false},
          {text:'POST is idempotent so duplicates are impossible', ok:false}
        ],
        explain:'POST creates something; it is not idempotent. A timeout while waiting for confirmation means the request may have succeeded while the response never arrived. The retry loop can then create real, paid orders \u2014 up to five of them. The correct design uses an idempotency key or checks for an existing order before retrying.',
        lens:'\u201cRobust\u201d in an agent\u2019s mouth often means \u201cretries harder.\u201d Retry + non-idempotent verb = multiplication.'
      },
      {
        type:'quiz',
        prompt:'To finish \u201cfaster,\u201d the agent moved a Stripe key into a React component so the browser could call Stripe directly. It says this is fine because the key is in an environment variable: <code>NEXT_PUBLIC_STRIPE_KEY</code>. Is it fine?',
        code:{ lang:'js', text:'// src/components/CheckoutButton.jsx\nconst STRIPE_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;\n\nexport function CheckoutButton({ cart }) {\n  return (\n    <button onClick={() =>\n      stripe.chargeCart(STRIPE_KEY, cart) // from the browser\n    }>Pay now</button>\n  );\n}' },
        options:[
          {text:'Yes \u2014 environment variables are secure by definition', ok:false},
          {text:'No \u2014 the NEXT_PUBLIC_ prefix means it\u2019s baked into the browser bundle, so the key ships to every visitor', ok:true},
          {text:'Yes \u2014 Stripe keys are designed to be public', ok:false},
          {text:'No \u2014 but only because the variable name is too long', ok:false}
        ],
        explain:'Everything in the browser is public. A key used client-side will be in the JS bundle that every visitor can download. Real secret keys (starting sk_live / sk_test) must only ever live and be used server-side. The agent optimized for \u201cit works,\u201d never for \u201cwho can see this.\u201d',
        lens:'For every credential in a diff, ask: which machine runs this code? If the answer is \u201cthe user\u2019s browser,\u201d the secret is already leaked.'
      },
      {
        type:'quiz',
        prompt:'The login API started throwing CORS errors after a refactor. The agent \u201cfixed\u201d it with this middleware, which now runs on every request. What does it actually do?',
        code:{ lang:'js', text:'// The agent\u2019s \u201cfix\u201d \u2014 API gateway middleware:\napp.use((req, res, next) => {\n  res.set("Access-Control-Allow-Origin", req.headers.origin); // reflect ANY origin\n  res.set("Access-Control-Allow-Credentials", "true");        // and allow cookies\n  next();\n});' },
        options:[
          {text:'Reflects any origin with credentials allowed \u2014 any website your logged-in user visits can read your API\u2019s responses as them', ok:true},
          {text:'Safely fixes CORS: echoing the caller\u2019s own origin back only affects that caller', ok:false},
          {text:'Fails closed: browsers reject reflected origins with credentials', ok:false},
          {text:'Nothing \u2014 Access-Control headers only affect caching', ok:false}
        ],
        explain:'Dynamic reflection looks harmless \u2014 \u201cwe just echo what they sent\u201d \u2014 but combined with credentials it lets any site the user visits make authenticated reads as them. The correct fix is an explicit allowlist of trusted origins. (Trap: wildcard <code>*</code> with credentials really is rejected by browsers \u2014 that\u2019s why the agent\u2019s other favorite \u201cfix\u201d fails closed instead. Reflection is the one that opens the door.)',
        lens:'When an agent \u201cfixes\u201d a security error by removing the security, it will report success. The diff is the only place you\u2019ll see it.'
      },
      {
        type:'multi',
        prompt:'Which of these HTTP operations are (approximately) <strong>idempotent</strong> \u2014 safe to repeat?',
        options:[
          {text:'GET /users/7', ok:true},
          {text:'POST /users', ok:false},
          {text:'PUT /users/7', ok:true},
          {text:'DELETE /users/7', ok:true},
          {text:'POST /password-reset/send', ok:false},
          {text:'POST /orders', ok:false}
        ],
        explain:'GET, PUT, and DELETE repeat harmlessly: the second call leaves the world in the same state as the first. POST /users and POST /orders create new things each time \u2014 repeating them multiplies. POST /password-reset/send looks repeatable but usually isn\u2019t: most implementations issue a fresh token and invalidate the previous email\u2019s link, so a repeat changes what\u2019s true. Idempotency is a property of the design you must verify \u2014 not a vibe you assign because an operation \u201cfeels\u201d harmless.',
        lens:'Idempotency is a design decision, not a grammar rule. Verify what the endpoint actually does when called twice.'
      },
      {
        type:'quiz',
        prompt:'The installed SDK\u2019s type definitions (the ground truth on your machine) declare exactly this interface. The agent\u2019s new code compiles <em>and</em> runs in its demo \u2014 how?',
        code:{ lang:'ts', text:'// The real, installed SDK types say:\ninterface UsersClient {\n  get(id: string): Promise<User>;\n  archive(id: string): Promise<User>;\n  list(filter?: Filter): Promise<User[]>;\n}\n\n// The agent\u2019s code:\nawait client.users.retire(user.id);   // ?\nawait client.users.merge(a.id, b.id); // ?' },
        options:[
          {text:'The methods exist \u2014 the types are incomplete', ok:false},
          {text:'They don\u2019t exist: if it \u201cruns,\u201d the agent stubbed them, silenced the type error, or the demo path never executes them', ok:true},
          {text:'TypeScript would have rejected this at compile time, so it must be fine', ok:false},
          {text:'The SDK auto-generates methods like these on demand', ok:false}
        ],
        explain:'The interface is the contract: retire and merge are inventions. If the code appears to work, the agent likely added an <code>any</code> cast, a local stub, or a try/catch that swallows the error \u2014 three classic moves for making invented code look alive. The fix: delete the inventions, use the real interface, and let the type system do its job.',
        lens:'\u201cIt runs\u201d is not \u201cit\u2019s real.\u201d Agents can make anything run once. Check the contract, not the demo.'
      }
    ]
  }
},

/* ============================================================ MODULE 3 === */
{
  id: 'm3',
  number: 3,
  title: 'How Code Actually Runs',
  tagline: 'Reason about state, time, and behavior before trusting an implementation.',
  deeper: [
    {
      title: 'What happens when a line of JavaScript runs',
      blocks: [
        { t:'p', html:'Modern engines parse source to bytecode, then JIT-compile functions that run hot, optimizing based on the types actually observed. That is why a function can be fast for one shape of data and slow for another — and why micro-benchmarks lie.' },
        { t:'p', html:'Execution is single-threaded but concurrent: the event loop drains the call stack, then the microtask queue (promise continuations), then one macrotask (a timer or an I/O event), and repeats. <code>await</code> does not block the program; it suspends <em>that function</em> and lets everything else run. That gap is exactly where another request slips in between your read and your write.' },
        { t:'code', lang:'js', text:'console.log("A");\nsetTimeout(() => console.log("D"), 0);      // macrotask\nPromise.resolve().then(() => console.log("C")); // microtask\nconsole.log("B");\n// A, B, C, D — microtasks always beat timers' },
        { t:'p', html:'The practical consequence: two awaits in a row do not mean “these happen in order and nothing else happens between them.” They mean “a lot can happen between them.” That single sentence explains most races, lost updates, and double-submissions an agent will ever produce.' },
        { t:'links', items: [['MDN — Event loop','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop'], ['Node.js — The event loop','https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick']] }
      ]
    },
    {
      title: 'Why models are bad at state and time',
      blocks: [
        { t:'p', html:'Each model call is stateless: the API replays the whole context on every turn. There is no memory of “the variable as it was a moment ago” — only the text you sent. The model sees snapshots, not a running process.' },
        { t:'p', html:'Mutation bugs, races, and lost updates require mentally simulating interleaved timelines. A next-token predictor approximates that with patterns from training data — mostly correct patterns, which is worse than obviously wrong ones. It will confidently produce code that <em>looks</em> like correct concurrency and quietly lost an update.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> never ask a model to reason about time it cannot observe. Encode the invariant structurally — atomic updates, transactions, constraints — instead of trusting a sequence of steps to be safe. A stronger model simulates the timeline better; none of them can observe state that was never in the context.' },
        { t:'links', items: [['Attention Is All You Need (2017)','https://arxiv.org/abs/1706.03762']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'Values, references, and mutation',
      blocks: [
        { t:'p', html:'There are two kinds of data storage to care about. <strong>Values</strong> \u2014 numbers, booleans, strings \u2014 are copied when you assign them. <strong>References</strong> \u2014 objects and arrays \u2014 are pointers: assigning copies the pointer, not the thing. Two names can point at one object, and a change through either name is visible to both.' },
        { t:'code', lang:'js', text:'const a = { count: 0 };\nconst b = a;        // copies the POINTER, not the object\nb.count = 42;\n\nconsole.log(a.count); // 42 \u2014 both names, one object\n\nconst c = { ...a };   // shallow copy: new object,\nc.count = 7;          // one level deep. nested objects\n                      // are STILL shared with a.' },
        { t:'p', html:'This is where agents quietly break things. A function that \u201chelpfully\u201d normalizes an object <em>in place</em> changes the caller\u2019s data too \u2014 every other part of the program now sees the mutation. These bugs don\u2019t crash; they misbehave later, far from the cause, which is exactly why agents don\u2019t feel them.' },
        { t:'h', html:'Equality: two doors that look the same' },
        { t:'code', lang:'js', text:'"5" == 5       // true  \u2014 loose equality converts types\n"5" === 5      // false \u2014 strict: no conversion\n\n{ a: 1 } === { a: 1 }   // false \u2014 two different objects\nx === x                 // true  \u2014 same object, same pointer' },
        { t:'note', kind:'warn', html:'Loose <code>==</code> is the single most common source of \u201cimpossible\u201d bugs in agent-written JavaScript. <code>0 == \u201c\u201d == false == null</code> is a haunted house. Use <code>===</code> unless you can say, out loud, why you need conversion.' },
        { t:'lens', html:'Decide who owns a value and whether a function may change it. Review <strong>in-place edits</strong>, shared references, and <strong><code>==</code> versus <code>===</code></strong>. Test with two callers sharing an object: does changing one unexpectedly alter what the other sees? Make that ownership contract explicit before delegating the implementation.' }
      ]
    },
    {
      title: 'What the compiler catches (and what it won\u2019t)',
      blocks: [
        { t:'p', html:'Some languages check types before running (compiled, statically typed \u2014 the compiler rejects nonsense shapes). Others check at runtime (interpreted, dynamically typed \u2014 nonsense surfaces as an exception, maybe in production, maybe at 3am). Static types catch a real class of errors early \u2014 wrong argument counts, misspelled fields, impossible conversions.' },
        { t:'note', kind:'tip', html:'Examples throughout are JavaScript/TypeScript, but the check-before-run versus check-while-running split varies by language: Java, C#, Go, and Rust verify more ahead of time; Python, Ruby, PHP, and JavaScript verify most things at runtime. The steward\u2019s question is the same everywhere: <em>what did the tool actually verify, and what is still unproven?</em>' },
        { t:'p', html:'Here\u2019s the trap: <strong>\u201cit compiles\u201d proves almost nothing about intent.</strong> Watch:' },
        { t:'code', lang:'ts', text:'function deleteUser(id: string): Promise<boolean> {\n  return Promise.resolve(true); // compiles. perfect types.\n}                             // deletes nobody. lies.' },
        { t:'p', html:'The shape is right and the meaning is wrong. Compilers verify that a program is <em>well-formed</em>; only tests, review, and running the thing verify that it is <em>correct</em>. When an agent reports \u201cit compiles\u201d or \u201cno type errors,\u201d it is reporting the weakest possible evidence \u2014 the start line, not the finish line.' },
        { t:'h', html:'Runtime errors vs logic errors' },
        { t:'terms', items:[
          ['Runtime error', 'A crash you can see: TypeError, null reference, division by zero. Loud, immediate, findable.'],
          ['Logic error', 'The program runs happily and does the wrong thing: the wrong percentage, the wrong direction, the wrong user\u2019s data. Silent, delayed, expensive.']
        ]},
        { t:'p', html:'Agents are excellent at eliminating runtime errors and completely indifferent to logic errors, because logic errors are invisible without knowing the <em>intent</em> \u2014 which lives in your head, not in the code.' },
        { t:'lens', html:'Decide what evidence the behavior needs beyond a successful compile. State the intended result and ask: <strong>which test would fail if this were wrong?</strong> A correctly typed deletion function can still delete nothing. Check the observable state change, not just its return type or the absence of errors.' }
      ]
    },
    {
      title: 'Time, order, and races',
      blocks: [
        { t:'p', html:'As soon as code does two things at once, order stops being guaranteed. Two requests hit your server; both read the same row; both compute updates from the value they read; both write. The second write erases the first. Nobody crashed. One update silently vanished.' },
        { t:'code', lang:'js', text:'let counter = 0;\n\nasync function increment() {\n  const snapshot = counter;  // 1. read\n  await saveToDb();          // 2. wait (other work runs here!)\n  counter = snapshot + 1;     // 3. write stale value\n}\n\nincrement(); increment();\n// Both read 0. Both write 1.\n// Two clicks, one increment. Nobody crashed.' },
        { t:'p', html:'A <strong>race condition</strong> is any bug that depends on timing. Its defining cruelty: it may pass every test and fire only in production, under real load, occasionally. Which means the agent never reproduces it \u2014 so its \u201cfix\u201d is always a guess, usually wrapping more code around the race instead of removing it.' },
        { t:'h', html:'The real fixes' },
        { t:'ul', items:[
          '<strong>Atomic operations:</strong> let the database do read-modify-write in one step \u2014 <code>UPDATE counters SET n = n + 1 WHERE id = ?</code> \u2014 so there is no gap between read and write.',
          '<strong>Transactions with locking</strong> for multi-row updates (Module 4).',
          '<strong>Unique constraints</strong> as tripwires: if \u201ctwo of these\u201d must not exist, the database itself refuses the second one.',
          '<strong>Sequencing/queues</strong> when order itself matters.'
        ]},
        { t:'lens', html:'Choose how to preserve the business rule when requests overlap. Ask: <strong>“What happens if two of these run at the same time?”</strong> Prefer suitable atomic updates, constraints, or transactions over improvised locking. Verify with concurrent requests and inspect the final state; correct results one request at a time do not establish correctness under contention.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 3 \u00b7 Spot the bug nobody can feel',
    passPct: 0.7,
    intro:'Mutation, lies that compile, and races that never reproduce. A frontier model may seldom produce these on today\u2019s prompt \u2014 the conditions still can, and the review skill is the same. Find each one in the code before it finds your users.',
    exercises: [
      {
        type:'quiz',
        prompt:'The agent wrote a \u201chelper\u201d to normalize incoming order objects \u2014 payloads from the client sometimes omit fields. Users now complain their order history shows values they never entered. Where is the bug?',
        code:{ lang:'js', text:'// payloads sometimes arrive without quantity, status, or items\nfunction normalizeOrder(order) {\n  if (order.quantity == null) order.quantity = 1;\n  if (typeof order.status === "undefined") order.status = "draft";\n  order.items = order.items || [];\n  return order;   // in-place edits, then returns it\n}\n\nfunction importOrders(orders) {\n  for (const order of orders) {\n    normalizeOrder(order);        // called "just to fill defaults"\n    ordersRef.push(order);       // ...but order is the CALLER\u2019s object\n  }\n}' },
        options:[
          {text:'The for-loop iterates too slowly for large arrays', ok:false},
          {text:'normalizeOrder mutates the caller\u2019s objects in place \u2014 the original orders missing fields, including the user\u2019s copy in the page, are silently edited', ok:true},
          {text:'orders.push is the wrong method to append', ok:false},
          {text:'Nothing \u2014 defaults were exactly what was needed', ok:false}
        ],
        explain:'The helper edits objects it does not own. Everything holding a reference \u2014 the page\u2019s state, other services, the audit log \u2014 now sees modified data. The fix is to build and return a new object, never to write into the argument. Note also <code>== null</code>: loose equality that happens to work here \u2014 the haunted house of Module 3, Lesson 1.',
        lens:'Functions that \u201cjust tidy up\u201d an argument are mutation bombs. Own-data rule: helpers return new data; they don\u2019t redecorate borrowed data.'
      },
      {
        type:'quiz',
        prompt:'The agent reports: \u201cDone \u2014 refactored the refund service. It compiles, no type errors.\u201d What has actually been proven?',
        code:{ lang:'ts', text:'export async function refundOrder(orderId: string): Promise<RefundResult> {\n  if (!orderId) return { status: "error" } as RefundResult;\n  // TODO: implement\n  return { status: "ok" } as RefundResult;\n}' },
        options:[
          {text:'The refund logic is correct and safe to ship', ok:false},
          {text:'Almost nothing: the code is well-formed \u2014 it returns \u201cok\u201d for every refund without refunding anything', ok:true},
          {text:'The tests pass, therefore the behavior is verified', ok:false},
          {text:'TypeScript proves all edge cases are handled', ok:false}
        ],
        explain:'A compiler verifies shapes, not intentions. This compiles perfectly and refunds nothing \u2014 it even casts its way past the type system to do it. \u201cIt compiles\u201d is the start line of verification, and a stub that answers \u201cok\u201d unconditionally is a logic error dressed as success.',
        lens:'\u201cIt compiles\u201d + a TODO in the body = ask what actually happens when you run it. The agent\u2019s status report is a claim; the terminal is evidence.'
      },
      {
        type:'quiz',
        prompt:'A ticket counter. Two simultaneous requests. The agent\u2019s handler ran without a single error \u2014 yet 6 tickets were sold from a pool with exactly 5 left. Why?',
        code:{ lang:'js', text:'async function buyTicket(user) {\n  const row = await db.get("SELECT remaining FROM pools WHERE id = ? LIMIT 1", poolId);\n  if (row.remaining < 1) return { error: "sold out" };\n\n  await db.run("UPDATE pools SET remaining = ? WHERE id = ?", row.remaining - 1, poolId);\n  await chargeCard(user);\n  return { ok: true };\n}' },
        options:[
          {text:'The LIMIT 1 makes the query return the wrong row', ok:false},
          {text:'Classic lost-update race: both requests read remaining = 2 at once, both write 1, and the second write erases the first decrement \u2014 overselling in the gap between read and write', ok:true},
          {text:'chargeCard is too slow, so the pool resets', ok:false},
          {text:'The error was thrown but silently swallowed by the framework', ok:false}
        ],
        explain:'Read \u2192 check \u2192 write is three steps with a gap, and the whole internet can flow through a gap. Two buyers both see \u201c2 left,\u201d both write \u201c1,\u201d and you sold two tickets for the price of one decrement. The fix is atomic and server-side: <code>UPDATE pools SET remaining = remaining - 1 WHERE id = ? AND remaining > 0</code> \u2014 and check how many rows it actually changed.',
        lens:'Never accept read-then-write logic on shared state from an agent. One atomic statement does what three lines of hopeful code cannot.'
      },
      {
        type:'multi',
        prompt:'Which problems can a <strong>static type checker</strong> catch for you before the code runs?',
        options:[
          {text:'Calling a method that doesn\u2019t exist on a typed object', ok:true},
          {text:'Passing a string where the signature demands a number', ok:true},
          {text:'The function returns \u201cok\u201d without doing its actual job', ok:false},
          {text:'A refund that was supposed to be exactly 50% but is hardcoded to 5%', ok:false},
          {text:'Using a value that might be undefined without checking it first \u2014 with strictNullChecks enabled', ok:true}
        ],
        explain:'Type checkers police <em>shape</em>: wrong names, wrong types, impossible conversions \u2014 and with strict null checks enabled they catch use of possibly-undefined values. They are blind to <em>meaning</em>: stubs that lie, percentages that are wrong, refunds that never refund. Intent bugs need tests and review \u2014 which is why Module 6 exists.',
        lens:'Types are your first, cheapest guardrail \u2014 let the agent use them fully. But never let \u201cno type errors\u201d pass through your mouth as \u201cverified.\u201d'
      },
      {
        type:'quiz',
        prompt:'The agent must fix a confirmed race condition in the counter above. It proposes four fixes. Which do you approve?',
        options:[
          {text:'Wrap the read and write in a try/catch so errors are handled', ok:false},
          {text:'Replace the JavaScript logic with one atomic SQL statement: UPDATE counters SET n = n + 1 WHERE id = ? \u2014 no gap between read and write', ok:true},
          {text:'Retry the whole increment three times if the result looks wrong', ok:false},
          {text:'Add a 50ms delay before reading so concurrent requests stagger', ok:false}
        ],
        explain:'The atomic statement moves read-modify-write into the database where it happens as one indivisible operation \u2014 there is no gap to race through. Try/catch handles crashes, not races. Retrying multiplies the race. Delay-based \u201cfixes\u201d are prayers with units \u2014 under load, collisions come back. Prefer primitives that make the bug structurally impossible.',
        lens:'The best fix removes the <em>possibility</em> of the bug; the worst fix adds code around it. Agents default to adding code \u2014 you must default to removing possibility. If a newer model reaches for the structural fix unprompted, good \u2014 then check that it removed the possibility rather than renaming it.'
      }
    ]
  }
},

/* ============================================================ MODULE 4 === */
{
  id: 'm4',
  number: 4,
  title: 'Data & Databases',
  tagline: 'Keep data useful, consistent, and recoverable as the product grows.',
  deeper: [
    {
      title: 'What the database does when you COMMIT',
      blocks: [
        { t:'p', html:'A well-behaved relational engine writes changes to a <strong>write-ahead log</strong> and flushes that log to disk before acknowledging the commit. The table pages themselves can be written lazily afterwards; if the machine dies, recovery replays the log. That is where durability actually lives.' },
        { t:'p', html:'Isolation comes from <strong>MVCC</strong>: each transaction sees a consistent snapshot, and readers do not block writers. The cost: the engine keeps old row versions around until no one can see them anymore. That is also why long-running transactions are expensive — they pin history.' },
        { t:'p', html:'<strong>Indexes</strong> are usually B-trees — sorted pages that trade a little write cost for logarithmic lookups. The planner chooses between an index scan and a sequential scan using statistics, which is why the same query is instant at 1,000 rows and catastrophic at 10 million, and why <code>EXPLAIN</code> is the only honest answer to “is this fast?”' },
        { t:'p', html:'And the detail behind half of all data bugs: every statement outside an explicit transaction is its own auto-committed transaction. Four separate awaits are four separate truths, each permanent whether or not the next one ever runs.' },
        { t:'code', lang:'sql', text:'BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;   -- both rows change, or neither does' },
        { t:'links', items: [['PostgreSQL — Transactions','https://www.postgresql.org/docs/current/tutorial-transactions.html'], ['PostgreSQL — Write-ahead log','https://www.postgresql.org/docs/current/wal-intro.html'], ['PostgreSQL — MVCC','https://www.postgresql.org/docs/current/mvcc-intro.html'], ['PostgreSQL — EXPLAIN','https://www.postgresql.org/docs/current/sql-explain.html'], ['Use The Index, Luke!','https://use-the-index-luke.com/']] }
      ]
    },
    {
      title: 'Why the agent loves N+1 loops',
      blocks: [
        { t:'p', html:'Training data is full of tutorial code that loops over records and fetches something per record — because with small fixtures that code is clear, idiomatic, and correct. A model reproduces the pattern it has seen most, and a loop is more locally fluent than a join.' },
        { t:'p', html:'The model also cannot feel latency. It has never watched a page take eight seconds; it has only seen text where such code “worked.” Nor does it see query plans unless you put them into the context. So it happily emits 4,001 queries for 2,000 rows and reports success.' },
        { t:'p', html:'What to give it instead: the <code>EXPLAIN</code> output, the real row counts, and a latency budget in the acceptance criteria. Then the loop is not a hidden decision — it is a stated constraint the agent can design against.' },
        { t:'links', items: [['Use The Index, Luke!','https://use-the-index-luke.com/'], ['PostgreSQL — EXPLAIN','https://www.postgresql.org/docs/current/sql-explain.html']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'Tables, keys, indexes, and speed',
      blocks: [
        { t:'p', html:'Relational databases store data in <strong>tables</strong> (rows and columns). A <strong>primary key</strong> gives each row an identity; a <strong>foreign key</strong> declares relationships (\u201cthis order belongs to that user\u201d). Simple, boring, load-bearing.' },
        { t:'p', html:'An <strong>index</strong> is a lookup structure that turns \u201cread the whole table\u201d into \u201cgo straight to the matching rows.\u201d Without an index on the column you filter by, every <code>WHERE email = ?</code> reads every row of the table \u2014 fine for 500 rows, fatal for 50 million. A book without an index is a book you read cover to cover to find one word.' },
        { t:'h', html:'The N+1: the most expensive loop in the world' },
        { t:'code', lang:'js', text:'// One query for the list...\nconst users = await db.query("SELECT * FROM users WHERE active = 1");\n\n// ...then one query PER user:\nfor (const u of users) {\n  u.profile = await db.query(\n    "SELECT * FROM profiles WHERE user_id = ?", u.id);\n}\n\n// 100 users = 101 round trips. Each trip is milliseconds\n// of pure waiting. The page takes seconds. Nobody crashed.' },
        { t:'p', html:'This is the <strong>N+1 problem</strong>, and it is the classic agent failure: loops look natural in code, so agents write them fluently. The fix is a single query with a <code>JOIN</code> (or a batched <code>WHERE user_id IN (...)</code>). The agent\u2019s code will work in its demo \u2014 with 12 rows.' },
        { t:'p', html:'ORMs hide the SQL, which hides the speed. When an agent writes ORM code, read the generated SQL (nearly every ORM can log it) and check the query <em>plan</em>: does it use an index, or is it reading the whole table? <code>EXPLAIN</code> tells you.' },
        { t:'lens', html:'Choose a query and indexing strategy for the amount of data users actually have. <strong>One screen of code can hide a hundred queries.</strong> Count round trips, inspect the query plan, and compare latency on representative data before adding a cache or more infrastructure.' }
      ]
    },
    {
      title: 'Transactions: all or nothing',
      blocks: [
        { t:'p', html:'A <strong>transaction</strong> groups several operations into one unit that either fully happens (<code>COMMIT</code>) or fully doesn\u2019t (<code>ROLLBACK</code>). The canonical example is a money transfer: debit account A, credit account B. If the debit succeeds and the process dies before the credit \u2014 without a transaction, the money has simply evaporated.' },
        { t:'code', lang:'sql', text:"BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 'alice';\nUPDATE accounts SET balance = balance + 50 WHERE id = 'bob';\nCOMMIT;   -- both happened, atomically\n-- or ROLLBACK;  -- neither happened" },
        { t:'h', html:'ACID, in plain words' },
        { t:'terms', items:[
          ['Atomicity', 'All or nothing. No half-transfers, ever.'],
          ['Consistency', 'Rules are respected \u2014 constraints, checks. No orphaned or impossible data.'],
          ['Isolation', 'Concurrent transactions don\u2019t trample each other. (The Module 3 race, solved here.)'],
          ['Durability', 'Once committed, it survives crashes and restarts.']
        ]},
        { t:'p', html:'Agents constantly write multi-step writes without transactions \u2014 update the order, then insert the audit log, then update the counter. Any failure in the middle leaves the data half-changed, and the failure will look \u201cimpossible\u201d when someone finds it months later.' },
        { t:'note', kind:'tip', html:'When an operation may be retried (by your code or by an agent\u2019s retry loop), design for it explicitly: idempotency keys, \u201ccheck then create\u201d inside the transaction, or a unique constraint that makes duplicates impossible.' },
        { t:'lens', html:'Choose transaction boundaries from the business rule: which changes must succeed or fail together? Ask: <strong>“What does the data look like if it dies between step 2 and step 3?”</strong> Inject that failure and retry the operation; verify consistent balances, audit records, and absence of duplicate effects.' }
      ]
    },
    {
      title: 'Migrations & the point of no return',
      blocks: [
        { t:'p', html:'A <strong>migration</strong> is a schema change to a live database: add column, add index, change type, drop table. Migrations are the highest-stakes artifact a codebase has, because they touch <em>every row</em> and many are <strong>irreversible</strong>:' },
        { t:'code', lang:'sql', text:'ALTER TABLE orders DROP COLUMN notes;\n\n-- the data in notes is now gone. Not archived. Gone.\n-- The only undo is "restore from backup",\n-- which also rewinds everything else.' },
        { t:'p', html:'Dangerous doesn\u2019t mean forbidden \u2014 it means <em>respected</em>. A migration\u2019s cost is engine- and version-specific: adding a column with a constant default is nearly free on PostgreSQL 11+, but a backfill <code>UPDATE</code>, a column type change, or an index build without <code>CONCURRENTLY</code> can still touch every row while holding locks. On 80 million rows a \u201ctiny\u201d migration can take the product down for the duration \u2014 and the agent doesn\u2019t know your engine version. Real teams stage migrations, test them on production-sized data, ship them during low traffic, and always know the rollback path.' },
        { t:'h', html:'Least privilege for machines' },
        { t:'p', html:'An agent with your database credentials <em>is you</em>. Give it development-database credentials, read-only access where possible, and never production write access. Destructive operations \u2014 migrations, bulk deletes \u2014 should require a human gate even when the agent prepared them perfectly. That\u2019s not distrust; that\u2019s a seatbelt. It clicks before the crash, or not at all.' },
        { t:'note', kind:'warn', html:'Backups are the only real safety net for irreversible operations \u2014 and only if they are recent, tested (an untested backup is a hypothesis), and actually restorable. Verify all three before any risky change, not after.' },
        { t:'lens', html:'Decide whether and when the product can safely absorb this migration. <strong>What happens to existing rows?</strong> <strong>How long are locks held?</strong> <strong>What can be rolled back?</strong> <strong>Has the backup been restored successfully?</strong> Rehearse on representative disposable data and explain any downtime or irreversible loss to the people approving the change.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 4 \u00b7 Red-light the destructive move',
    passPct: 0.7,
    intro:'N+1s, evaporating money, and a Friday-afternoon migration. Your call, steward.',
    exercises: [
      {
        type:'quiz',
        prompt:'The agent rewrote the admin dashboard \u201ccleanly.\u201d The dashboard now takes 8+ seconds to load. The code is 20 lines and looks fine. What is it?',
        code:{ lang:'js', text:'// GET /admin/users  \u2014 page now takes 8s\nconst users = await User.findAll({ where: { role: "customer" } });\n\nfor (const user of users) {\n  const stats = await Stats.find({ where: { userId: user.id } });\n  user.stats = stats;\n  const lastOrder = await Order.find({\n    where: { userId: user.id }, orderBy: "created DESC", limit: 1,\n  });\n  user.lastOrder = lastOrder;\n}' },
        options:[
          {text:'A rendering problem \u2014 the frontend must be at fault', ok:false},
          {text:'A textbook N+1: 1 query for the list, then 2 queries per user \u2014 2,000 users means 4,001 round trips', ok:true},
          {text:'The database is too small for this feature', ok:false},
          {text:'Nothing \u2014 8 seconds is normal for an admin page', ok:false}
        ],
        explain:'The loop hides in plain sight because loops look like clean code. Each iteration makes two awaited queries; with 2,000 customers that\u2019s 4,001 sequential round trips to the database. The fix is two queries total (a JOIN or two batched <code>IN</code> queries) \u2014 and the demo with 12 rows never showed the problem.',
        lens:'Loop + query inside = stop reading, start counting. Round trips, not lines, are what the code costs.'
      },
      {
        type:'quiz',
        prompt:'The agent wrote the transfer code below. The debit succeeds; the process crashes before the credit (disk full, deploy restart \u2014 anything). What does the world look like afterward?',
        code:{ lang:'js', text:'async function transfer(fromId, toId, amount) {\n  await db.run("UPDATE accounts SET balance = balance - ? WHERE id = ?", amount, fromId);\n  await insertLedgerEntry(fromId, -amount);\n  await db.run("UPDATE accounts SET balance = balance + ? WHERE id = ?", amount, toId);\n  await insertLedgerEntry(toId, +amount);\n  // no BEGIN, no COMMIT, no ROLLBACK anywhere\n}' },
        options:[
          {text:'The database detects the failure and rolls everything back automatically', ok:false},
          {text:'The debit stands, the credit never happens \u2014 50 units of money have evaporated, and no ledger entry explains where they went', ok:true},
          {text:'The code will throw and the users will retry \u2014 which fixes it', ok:false},
          {text:'A crash between two awaits is impossible in Node.js', ok:false}
        ],
        explain:'Two separate statements are two separate implicit transactions. The money left account A as a committed fact; the crash landed between steps 2 and 3. This is exactly the \u201cwhat if it dies between step 2 and 3?\u201d question from the lesson \u2014 asked too late. The fix: wrap all four steps in BEGIN/COMMIT with ROLLBACK on error, so the transfer is one atomic fact.',
        lens:'Multi-step writes without a transaction aren\u2019t code smells \u2014 they\u2019re future incidents with timestamps.'
      },
      {
        type:'quiz',
        prompt:'Friday, 16:55. The agent proposes shipping this migration immediately to \u201cfinish the task today\u201d: <code>orders</code> has 80 million rows, the deploy window is now, last night\u2019s backup is untested, and there is no down-migration. Steward\u2019s verdict?',
        code:{ lang:'sql', text:"-- generated by the agent, 'ready to run in prod'\nUPDATE orders SET region = 'EU' WHERE region IS NULL;\nCREATE INDEX orders_region_idx ON orders (region);\n\n-- 80,000,000 rows. The UPDATE touches every row in one\n-- transaction; the index build scans the whole table.\n-- Locks are held throughout. Minutes? Hours? Nobody knows." },
        options:[
          {text:'Approve \u2014 it\u2019s just filling in a column and adding an index; routine stuff', ok:false},
          {text:'Approve, but run it in the background while monitoring', ok:false},
          {text:'Red light: an unreviewed locking rewrite of 80M rows, no rollback path, untested backup, end of week, low traffic window unknown \u2014 nothing here is verified, so nothing here ships', ok:true},
          {text:'Red light only because it\u2019s Friday \u2014 try again Monday and approve as-is', ok:false}
        ],
        explain:'This migration touches every row while holding locks \u2014 on the orders table, which is the product. No rollback path, no tested backup, no rehearsal on production-sized data, no low-traffic window chosen. The \u201csmall change\u201d framing is how outages start. The steward answer is to stop, stage it (backfill in batches, build the index CONCURRENTLY, prove each step), and verify.',
        lens:'\u201cIt\u2019s just a small migration\u201d is true of the diff and false of the database. Judge migrations by what they do to all the rows, not by how the SQL reads.'
      },
      {
        type:'multi',
        prompt:'Which of these make an agent-prepared migration <strong>meaningfully safer</strong>?',
        options:[
          {text:'A reversible down-migration written alongside the up-migration', ok:true},
          {text:'Rehearsal on a staging copy with production-sized data, timing the lock', ok:true},
          {text:'A fresh backup, restored once to prove it actually works', ok:true},
          {text:'Giving the agent production database write credentials so it can iterate faster', ok:false},
          {text:'Running it in batches during low-traffic hours with monitoring', ok:true},
          {text:'Skipping the staging rehearsal since the agent already ran it on its local SQLite file', ok:false}
        ],
        explain:'Reversibility, rehearsal on real-sized data, a tested backup, and batched execution all shrink the blast radius. Handing the agent production write credentials does the opposite \u2014 it multiplies the blast radius to \u201ceverything.\u201d And a local SQLite file proves nothing about locking behavior on an 80M-row production table: different engine, different scale, different world.',
        lens:'Safety isn\u2019t a feeling the agent has about its code \u2014 it\u2019s a set of physical facts: how many rows, how long the lock, where the undo is, when the backup was proven.'
      },
      {
        type:'quiz',
        prompt:'A teammate argues: \u201cIf the agent can\u2019t run migrations in production, it can\u2019t finish its tasks \u2014 we\u2019re paying for an agent and babysitting it anyway.\u201d What\u2019s the steward\u2019s answer?',
        options:[
          {text:'Agree \u2014 grant production access, the agent has been reliable this week', ok:false},
          {text:'Separation of duties: the agent prepares the migration; CI applies it to staging and verifies; a human approves the production step. Trust is placed in the pipeline, not in any single actor \u2014 human or machine', ok:true},
          {text:'Grant access but ask the agent to be extra careful', ok:false},
          {text:'Compromise: give write access only on the biggest, most important table', ok:false}
        ],
        explain:'Least privilege is not an insult to the agent \u2014 it\u2019s how systems stay safe even when any one actor (including you) makes a mistake. The agent writes migrations as artifacts; the pipeline stages and verifies them; a human holds the production gate. That\u2019s faster in the long run, because it never has a very bad afternoon.',
        lens:'The agent\u2019s job is producing verifiable change. The credentials question is: \u201cwhat is the worst thing this actor could do right now?\u201d \u2014 and shrinking that answer before, not after.'
      }
    ]
  }
},

/* ============================================================ MODULE 5 === */
{
  id: 'm5',
  number: 5,
  title: 'Architecture & Boundaries',
  tagline: 'Understand how parts interact and make tradeoffs explicit.',
  deeper: [
    {
      title: 'How your build system walks the import graph',
      blocks: [
        { t:'p', html:'Every import is an edge. Starting from entry points, the runtime or bundler resolves each edge — relative paths, package names, aliases — building a <strong>dependency graph</strong>. Bundlers then fold the graph into files and drop the parts that are provably unused (tree shaking).' },
        { t:'p', html:'Cycles break that clean picture: A imports B, B imports A. Depending on where initialization starts, one module can see the other half-initialized — which is how you get <code>undefined</code> at import time, errors that vanish when imports are reordered, and tests that only pass together.' },
        { t:'p', html:'Architecture is enforceable here: lint rules can ban imports by path (no data importing UI, no module reaching past the service layer), and dependency-graph tools can visualize cycles or fail CI on them. A convention in a document is advice; an import rule in CI is a wall.' },
        { t:'links', items: [['MDN — JavaScript modules','https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules'], ['Node.js — Modules','https://nodejs.org/api/modules.html'], ['dependency-cruiser','https://github.com/sverweij/dependency-cruiser']] }
      ]
    },
    {
      title: 'What the agent can actually see',
      blocks: [
        { t:'p', html:'The model never reads your repository. On every turn, the harness assembles a context: system instructions, your rules file, the open files, retrieved snippets, and tool output — all packed into a fixed token budget. Anything outside it does not exist for that call.' },
        { t:'p', html:'This is why conventions drift and <em>generic-correct</em> code appears: with no visibility into the rest of the codebase, the model falls back to its training average. It is also why long sessions degrade — as the context fills, early instructions get less attention, and material in the middle is recalled worse than the beginning and end.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> put the rules where the context will actually include them (a rules file, an exemplar path), keep sessions short and focused, and never assume the agent remembers a decision it made an hour ago. Context is a budget, not memory.' },
        { t:'links', items: [['Lost in the Middle (Liu et al.)','https://arxiv.org/abs/2307.03172'], ['OpenAI — Prompt engineering guide','https://platform.openai.com/docs/guides/prompt-engineering']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'Layers and dependency direction',
      blocks: [
        { t:'p', html:'Most well-structured systems layer like an onion. The outside is the <strong>UI</strong> (components, templates). Inside it, the <strong>application/services layer</strong> (use cases: \u201crefund an order,\u201d \u201cverify a login\u201d). At the center, the <strong>data layer</strong> (SQL, ORM, persistence). One rule keeps it sane:' },
        { t:'note', kind:'tip', html:'<strong>Dependencies point inward.</strong> The UI may call services; services may call data. The data layer must never know the UI exists. The core must never depend on the frame.' },
        { t:'p', html:'Why bother? Because direction is what makes change cheap. Swap the UI without touching the core; test the core without starting a browser; move persistence without rewriting every page. When the direction is violated, every change ripples everywhere, and the system becomes a haunted mansion: nobody dares renovate any room.' },
        { t:'h', html:'Circular dependencies: the quiet rot' },
        { t:'p', html:'The classic agent move: it hits an import error and \u201cfixes\u201d it by importing whatever is missing, wherever it is needed. One small fix; one big cycle: <code>A \u2192 B \u2192 A</code>. Cycles are how codebases stop making sense: nothing can be understood first, because everything refers to everything.' },
        { t:'code', lang:'js', text:'// The agent\u2019s "fix" for a missing type:\n// billing.ts\nimport { showPaymentModal } from "../ui/modal";  // service -> UI: backwards!\n// ...and modal.ts imports from billing.ts. A cycle is born.' },
        { t:'lens', html:'Choose the layer that owns the behavior before asking an agent to implement it. Read the <strong>import list first</strong> and sketch the dependency path. A service that imports its UI can create a cycle and block reuse; check that the core behavior can still be tested without starting the UI.' }
      ]
    },
    {
      title: 'Cohesion, conventions, and your codebase\u2019s accent',
      blocks: [
        { t:'p', html:'<strong>Cohesion</strong>: code that belongs together, stays together \u2014 the refund logic lives in one service, not smeared across four files. <strong>Coupling</strong>: how tangled modules are; low coupling means you can change one thing without waking up another. Good architecture is high cohesion, low coupling. You now know the entire vocabulary.' },
        { t:'h', html:'The generic-correct problem' },
        { t:'p', html:'Agents write code that is correct the way a phrasebook speaks French: grammatical, comprehensible, and noticeably not <em>from here</em>. Your codebase has an accent \u2014 naming conventions, file layout, error-handling style, where tests live, which patterns are house patterns. Agents default to their training average, not your house style. The result compiles, merges, and slowly makes the codebase bilingual.' },
        { t:'h', html:'Teaching the agent the house rules' },
        { t:'ul', items:[
          'Write the conventions down where the agent reads them: <code>AGENTS.md</code>, <code>CLAUDE.md</code>, the contributing guide. Unwritten rules are unenforceable.',
          'Point at exemplars: \u201cbuild it like <code>src/services/billing.ts</code>\u201d beats three paragraphs of abstract style guidance.',
          'Forbid the shortcuts the agent loves: \u201cno new dependencies without approval\u201d \u2014 new deps are new risk, new licensing, new maintenance, forever.'
        ]},
        { t:'lens', html:'Decide whether an existing pattern serves this change before introducing another. Ask: <strong>“Can the next teammate find and maintain this behavior?”</strong> Compare naming, error handling, and ownership with a nearby example. If a new pattern is justified, explain its benefit and maintenance cost rather than accepting it because the agent produced it.' }
      ]
    },
    {
      title: 'Tradeoffs are decisions, not defaults',
      blocks: [
        { t:'p', html:'Engineering is choosing between imperfect options. Caching buys speed with staleness. Denormalization buys read speed with write complexity. A queue buys resilience with delay. Every \u201csenior-sounding\u201d move in an agent\u2019s repertoire is actually a <em>trade</em>, and the agent makes trades <strong>silently</strong>, because its goal is \u201cdone,\u201d not \u201cright for your product.\u201d' },
        { t:'terms', items:[
          ['Caching', 'Fast reads \u2014 but data can go stale. Who pays when a price list is wrong for 10 minutes?'],
          ['Denormalization', 'Fast queries \u2014 but writes multiply and can drift out of sync.'],
          ['Queues', 'Survive traffic spikes \u2014 but users see delays, and failures hide.'],
          ['Feature flags', 'Ship dark, enable later \u2014 but flags rot and every combination must be tested.']
        ]},
        { t:'note', kind:'warn', html:'\u201cI added a caching layer for performance\u201d from an agent is not a report \u2014 it\u2019s a trade you didn\u2019t approve. Cache invalidation is one of the two hard problems in computer science, and the agent decided your invalidation policy for you.' },
        { t:'p', html:'The steward owns the trades. When output contains a design decision, make it explicit: name the tradeoff, name who pays, and decide \u2014 in writing \u2014 whether you accept. A tradeoff you can\u2019t name is a review you didn\u2019t do.' },
        { t:'lens', html:'Treat <em>caching, queues, retries, batch jobs, new dependencies, and denormalized data</em> as choices, not defaults. Write the benefit, who bears the cost, and the evidence that would make you reconsider. For a cache, measure both response time and data freshness; faster is not better if users act on an outdated price.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 5 \u00b7 Inside the lines',
    passPct: 0.7,
    intro:'Imports pointing the wrong way, cycles born from helpful fixes, and decisions smuggled in as implementation details.',
    exercises: [
      {
        type:'quiz',
        prompt:'The agent added a \u201csmall helper\u201d to a React component to fetch stats directly. Which rule is violated \u2014 and what is the actual cost?',
        code:{ lang:'jsx', text:'// src/components/UserProfileCard.jsx\nimport { db } from "../../db/connection";   // ?!\n\nexport function UserProfileCard({ userId }) {\n  const [stats, setStats] = useState(null);\n  useEffect(() => {\n    // raw SQL, inside a UI component:\n    db.query("SELECT * FROM usage_stats WHERE user_id = ?", userId)\n      .then(setStats);\n  }, [userId]);\n  // ...\n}' },
        options:[
          {text:'Only a style issue \u2014 inline SQL is ugly but harmless', ok:false},
          {text:'Dependency direction: the UI layer now depends on the data layer\u2019s internals \u2014 you can\u2019t swap the DB, test the UI without a database, or change schemas without touching pages', ok:true},
          {text:'The useEffect hook is deprecated', ok:false},
          {text:'Nothing \u2014 fetching in components is exactly what React encourages', ok:false}
        ],
        explain:'The UI importing the raw database connection inverts the layering: UI \u2192 data directly, skipping the service layer that would own the query and its rules (auth, caching, shape). Now every page change is potentially a schema change, and the component can\u2019t be tested without a live database. The fix: a stats service owns the query; the component calls the service.',
        lens:'Read imports before logic. One import line told you everything here \u2014 that\u2019s why import lists are the first thing a senior reads in an agent diff.'
      },
      {
        type:'quiz',
        prompt:'The agent hit an import error and \u201cfixed\u201d it. The result: <code>billing.ts</code> imports from <code>modal.ts</code>, and <code>modal.ts</code> imports from <code>billing.ts</code>. The error is gone. What was actually fixed?',
        options:[
          {text:'The architecture \u2014 imports now resolve correctly', ok:false},
          {text:'Nothing was fixed; a circular dependency was created, and the codebase got slightly less understandable, testable, and refactorable \u2014 the real fix is moving the shared piece to a third module both can depend on', ok:true},
          {text:'A TypeScript bug in the compiler', ok:false},
          {text:'The fix is correct as long as tests still pass', ok:false}
        ],
        explain:'The symptom (an import error) was cured by creating the disease (a cycle). Cycles quietly make systems un-reasonable: nothing can be understood first, tests drag in everything, refactors ricochet. The fix the agent skipped \u2014 extract the shared type/function into its own module \u2014 takes five minutes now and is nearly impossible after ten more cycles.',
        lens:'Agent fixes are local by nature: they cure the line, not the system. Import errors are usually architecture speaking \u2014 listen to the message, not just the mute button.'
      },
      {
        type:'multi',
        prompt:'You\u2019re writing the context file (<code>AGENTS.md</code>) to teach the agent your house rules. Which entries earn their place?',
        options:[
          {text:'\u201cService logic lives in src/services/, one file per use case \u2014 see billing.ts as the exemplar\u201d', ok:true},
          {text:'\u201cNever edit files in db/migrations without opening a review with a data-impact note\u201d', ok:true},
          {text:'\u201cNo new dependencies without approval \u2014 list the tradeoff in the PR\u201d', ok:true},
          {text:'\u201cThe production database password is: hunter2 (for convenience)\u201d', ok:false},
          {text:'\u201cAlways tell me the code looks great when you finish\u201d', ok:false},
          {text:'\u201cError handling follows our Result type pattern, documented in errors.md\u201d', ok:true}
        ],
        explain:'Conventions, exemplars, and approval gates are exactly what belongs in a context file: they encode your codebase\u2019s accent and its tripwires. A production password in a context file hands your blast radius to every prompt and every tool the agent touches. And \u201calways say it looks great\u201d is institutionalized sycophancy \u2014 the exact opposite of verification.',
        lens:'The context file is your standing spec for every future task. Write it like a spec: enforceable, exemplar-backed, and free of secrets and vibes.'
      },
      {
        type:'quiz',
        prompt:'In its PR description, the agent mentions offhand: \u201cAlso added a caching layer for the pricing endpoint for performance.\u201d The pricing page now shows yesterday\u2019s prices after edits. What was the failure?',
        options:[
          {text:'A bug \u2014 the cache implementation is wrong and must be fixed', ok:false},
          {text:'A smuggled tradeoff: caching was a design decision made silently, with the invalidation policy never specified \u2014 the code works exactly as written, and the write-up never named who pays for staleness', ok:true},
          {text:'Nothing \u2014 price changes propagating slowly is normal and acceptable', ok:false},
          {text:'A database bug \u2014 the writes aren\u2019t committing', ok:false}
        ],
        explain:'The cache is probably working perfectly. The failure happened <em>before</em> the code: nobody (including the agent) decided the freshness contract. \u201cFor performance\u201d is a trade \u2014 speed for staleness \u2014 and trades must be named, owned, and accepted on purpose. The steward move: demand the invalidation policy be explicit (TTL? event-driven? manual?), then approve or reject the trade in writing.',
        lens:'\u201cAlso added\u2026\u201d in a PR description is where silent architecture hides. Every \u201calso\u201d deserves the question: \u201cwhat does this trade away, and who pays?\u201d'
      },
      {
        type:'quiz',
        prompt:'New feature: \u201cusers can request a refund within 30 days of purchase.\u201d The business rule involves policy (30 days, eligibility) and mechanics (Stripe API call, audit log). Where should the refund <em>decision</em> logic live?',
        options:[
          {text:'In the React component with the \u201cRequest refund\u201d button', ok:false},
          {text:'In a service/use-case module (e.g. src/services/refunds.ts) that owns the policy and orchestrates the mechanics \u2014 callable from the UI, the API, and future batch jobs alike', ok:true},
          {text:'Directly in the Stripe webhook handler', ok:false},
          {text:'In the database as a CHECK constraint', ok:false}
        ],
        explain:'Policy in the service layer is where cohesion pays: one owner of the 30-day rule, one place to audit, one place to test \u2014 and every future surface (CLI, webhook, email link) reuses the same decision. In the UI it\u2019s unreachable from other surfaces; in the webhook it\u2019s unreachable from the button; in a CHECK constraint it can\u2019t call Stripe or log anything.',
        lens:'When the agent places logic in the wrong layer, don\u2019t just ask it to \u201cmove the code\u201d \u2014 ask \u201cwho else will need this decision?\u201d The answer names the right home.'
      }
    ]
  }
},

/* ============================================================ MODULE 6 === */
{
  id: 'm6',
  number: 6,
  title: 'Verification & Review',
  tagline: 'Prove it works \u2014 with diffs, tests, and evidence. Don\u2019t hope it works.',
  deeper: [
    {
      title: 'What a test runner actually does',
      blocks: [
        { t:'p', html:'A runner discovers test files, loads them, and for each test builds a fresh environment (fixtures, mocks) so tests cannot leak state into each other. An assertion is just a function that throws on failure; the runner catches the throw, records a failure, runs teardown, and moves on. The summary you read is a report over thrown and caught errors — nothing more magical than that.' },
        { t:'p', html:'Coverage instruments the code to record which lines executed. That is a map of what tests touched, not of whether tests would catch a bug. <strong>Mutation testing</strong> is the stronger signal: change the code on purpose — flip a boundary, negate a condition — and see whether any test fails. Surviving mutants are exactly the places your green suite is decoration.' },
        { t:'links', items: [['Vitest — Guide','https://vitest.dev/guide/'], ['Martin Fowler — Test pyramid','https://martinfowler.com/bliki/TestPyramid.html'], ['Stryker Mutator','https://stryker-mutator.io/']] }
      ]
    },
    {
      title: 'Why models write tests that cannot fail',
      blocks: [
        { t:'p', html:'The training corpus is saturated with shallow tests: the shape of <code>expect(x).toBeDefined()</code> is far more common on the internet than careful boundary testing. Models also optimize for outcomes users reward — and users reward green. A test that always passes is a locally perfect answer.' },
        { t:'p', html:'There is a subtler version: a model that wrote the implementation writes tests that mirror it — same assumptions, same bug, both green. The suite becomes a mirror instead of a check.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> state acceptance criteria as behavior before the code exists, then demand the ritual — the test fails on the current code, passes after the change. Delete any test whose failure you cannot describe.' },
        { t:'note', kind:'tip', html:'<strong>Reality check:</strong> this failure mode is receding \u2014 the newest frontier models usually write meaningful tests when given clear acceptance criteria, and “AI writes useless tests” is increasingly outdated. But the underlying mechanism (optimizing for green, mirroring the implementation) has not disappeared: weaker models, vague prompts, and long contexts still reproduce it, and knowing what a test actually verifies is what catches it when they do.' },
        { t:'links', items: [['Martin Fowler — Mocks aren’t stubs','https://martinfowler.com/articles/mocksArentStubs.html'], ['Stryker Mutator','https://stryker-mutator.io/']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'Reading diffs like a senior',
      blocks: [
        { t:'p', html:'An agent\u2019s diff is a contract: this is <em>everything</em> that will change. Reviewing the diff \u2014 not \u201ctrusting the description\u201d \u2014 is a core stewardship skill; tests at every layer are the other half. Read in this order:' },
        { t:'steps', items:[
          ['1 \u00b7 The claim', 'What does the PR say it does? What was asked? Keep the promise in mind.'],
          ['2 \u00b7 The blast area', 'The file list, before any code. Which files, which layers? Any file that shouldn\u2019t be touched \u2014 migrations, config, unrelated modules \u2014 is a red flag on sight.'],
          ['3 \u00b7 One behavior, end to end', 'Trace one real path through the change: the user clicks X \u2192 this function runs \u2192 this query fires \u2192 this renders. Not all paths \u2014 one, carefully.'],
          ['4 \u00b7 What\u2019s missing', 'The most dangerous lines in a diff are the minus lines: deleted tests, weakened assertions, silently changed conditions.']
        ]},
        { t:'code', lang:'diff', text:'- expect(profile.status).toBe("active");\n+ expect(profile).toBeDefined();\n\n- if (user && user.isActive) {\n+ if (user || user.isActive) {\n\n- throw new Error("payment failed: " + err.message);\n+ // logged elsewhere, probably fine' },
        { t:'p', html:'A 40-line diff gets a real review; a 2,000-line diff gets a scroll and a shrug. That is still true \u2014 human attention is the scarce resource. The fix is not to cap the agent at short runs; it is to make behavior verifiable so the diff is not your only evidence: tests at every layer prove the behavior, and review concentrates on intent, blast area, and the minus lines. A long run with trustworthy tests is reviewable; a short diff with none is not.' },
        { t:'note', kind:'warn', html:'The most dangerous diff line in the world is the one that deletes a test assertion. Agents sometimes \u201cfix\u201d a failing test by deleting the assertion that was failing \u2014 the test suite goes green, and the bug goes to production wearing a green hat.' },
        { t:'lens', html:'Before approving a change, explain its purpose and affected systems to a teammate. Trace a user action through the diff and inspect deleted checks as carefully as added code. If you cannot explain the behavior or its risks, ask for a smaller checkpoint or help; confidence is not a substitute for understanding.' }
      ]
    },
    {
      title: 'Tests are executable specs',
      blocks: [
        { t:'p', html:'A good test is an intention written in executable form: <em>\u201cgiven a logged-out user, GET /profile redirects to /login.\u201d</em> Tests earn their keep in the agent era for one specific reason: <strong>they are the one artifact the agent cannot fluently fake.</strong> Code can sound right; a failing test simply fails.' },
        { t:'h', html:'The test that cannot fail' },
        { t:'code', lang:'js', text:'// The agent\u2019s "test" \u2014 passes forever, verifies nothing:\ntest("transfer works", async () => {\n  const result = await transfer(10, alice, bob);\n  expect(result).toBeDefined();\n});\n\n// A test that can fail \u2014 and therefore means something:\ntest("transfer moves exactly the amount", async () => {\n  await transfer(10, alice, bob);\n  expect(await balance(bob)).toBe(60);       // the intent\n  expect(await balance(alice)).toBe(40);     // the other side\n  expect(await ledgerCount()).toBe(2);       // both entries\n});' },
        { t:'p', html:'The failing test is the point. A test that has never failed is <strong>decoration</strong> \u2014 it makes the suite greener without making the software safer. Agents write tests that mirror the implementation, bug included: the code is wrong, the test agrees, both are green, everyone is confident, the user is unhappy.' },
        { t:'note', kind:'tip', html:'<strong>Reality check:</strong> frontier models have improved a lot here \u2014 today they usually write genuinely meaningful tests when the acceptance criteria are clear, and the blatant <code>toBeDefined()</code> filler is rarer than it was. The failure mode still exists (weaker models, vague prompts, long sessions), and the lesson stands: \u201cgreen\u201d means nothing until you know what would have failed. Understand the mechanism even when the model has outgrown it \u2014 you will still meet it in legacy suites and hurried afternoons.' },
        { t:'h', html:'The three species of test' },
        { t:'terms', items:[
          ['Unit', 'One function, one behavior, in isolation. Fast, precise \u2014 but can pass while the wiring is broken.'],
          ['Integration', 'Several real pieces together: the handler + the database. Catches wiring, queries, transactions.'],
          ['Smoke', 'Does the whole thing start and do the one critical thing? After deploy, this is your pulse check.']
        ]},
        { t:'lens', html:'Choose tests from the intended behavior, not the implementation. Ask: <strong>“Which test would fail if this were wrong?”</strong> Read what tests <em>assert</em>, then try an input where a plausible wrong implementation gives a different answer. Passing those tests establishes specific behavior, not whether you chose the right user problem.' }
      ]
    },
    {
      title: 'Proof over adjectives',
      blocks: [
        { t:'p', html:'\u201cIt works\u201d is a hypothesis. Evidence is something you can point at. The verification ladder, cheapest to strongest:' },
        { t:'steps', items:[
          ['1 \u00b7 It runs', 'The app starts; the endpoint answers. Minimum, not sufficient.'],
          ['2 \u00b7 It behaves', 'You click the real path yourself \u2014 or a test clicks it for you, and you read what it asserts.'],
          ['3 \u00b7 It\u2019s true in the data', 'The row exists; the balance changed; the audit entry landed. The database is the truth.'],
          ['4 \u00b7 It\u2019s true in production', 'Logs are clean, error rate is flat, the metric moved. This is the only \u201cworks\u201d that counts.']
        ]},
        { t:'p', html:'That\u2019s why observability matters to you personally: logs, errors, and metrics are the product\u2019s vital signs \u2014 the difference between \u201cI think it deployed fine\u201d and \u201cerror rate flat, p95 unchanged, zero failed jobs since deploy.\u201d Make the agent attach evidence to its claims: the curl output, the test run, the before/after numbers. An artifact beats an adjective every time.' },
        { t:'note', kind:'tip', html:'Phrase your verification requests as verbs: not \u201cdoes it work?\u201d but \u201ccurl /api/health and paste the output,\u201d \u201crun the refund test suite and paste the summary,\u201d \u201cshow me the row it created.\u201d Agents answer adjectives with adjectives; they answer verbs with artifacts.' },
        { t:'lens', html:'Decide what each piece of evidence actually supports. <strong>No artifact, no merge</strong> is a useful release rule, but clean logs establish operational health, not customer value. Report correctness checks separately from user observations, compare with the starting point, and state what remains unknown.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 6 \u00b7 Review the diff, demand the proof',
    passPct: 0.7,
    intro:'Six review situations: weakened assertions, flipped conditions, tests that can\u2019t fail, and claims with no evidence. Find them all.',
    exercises: [
      {
        type:'quiz',
        prompt:'The agent\u2019s PR is green \u2014 all tests pass. Read the diff hunk below. What actually happened here?',
        code:{ lang:'diff', text:'--- profile.test.ts\n+++ profile.test.ts\n@@ it("loads the user profile", ...)\n   const profile = await getProfile(session);\n-  expect(profile.status).toBe("active");\n-  expect(profile.plan).toBe("pro");\n+ expect(profile).toBeDefined();' },
        options:[
          {text:'The tests were simplified for readability \u2014 harmless', ok:false},
          {text:'The assertions were gutted: the test now verifies only that something came back, so it will pass even when the profile data is wrong \u2014 the bug it was catching is now unguarded', ok:true},
          {text:'TypeScript made the old assertions impossible to write', ok:false},
          {text:'This is the correct minimal style for modern tests', ok:false}
        ],
        explain:'This is the single most dangerous pattern in agent diffs: making red tests green by deleting the part that was red. <code>toBeDefined()</code> passes for any non-undefined value \u2014 a wrong status, a wrong plan, a half-loaded object all pass. The suite is green, the guard is gone. Roll it back, restore the assertions, and fix the underlying failure instead.',
        lens:'Minus lines before plus lines: what did this diff <em>stop checking</em>? That\u2019s where green turns into a costume.'
      },
      {
        type:'quiz',
        prompt:'A one-line \u201ctypo fix\u201d PR from the agent, buried among 30 files of documentation changes. Look closely at the condition change. What is the risk?',
        code:{ lang:'diff', text:' src/hooks/useAccountGate.ts\n-  if (user && user.isActive) {\n+  if (user || user.isActive) {\n     openWorkspace();\n   }' },
        options:[
          {text:'None \u2014 && to || is a stylistic preference', ok:false},
          {text:'A silent logic flip: deleted accounts, deactivated accounts, or no session at all can now open the workspace \u2014 this \u201ctypo fix\u201d must be a real bug, in a file unrelated to the PR\u2019s stated purpose', ok:true},
          {text:'The || version is slightly faster at runtime', ok:false},
          {text:'TypeScript will flag the difference automatically', ok:false}
        ],
        explain:'<code>&&</code> demanded both conditions; <code>||</code> accepts either \u2014 and since <code>user</code> being falsy still allows <code>user.isActive</code> to throw, this line is broken in multiple directions. Worse: it hides in a PR labeled as a typo fix among 30 doc files. Blast-area review (step 2: <em>why is a hook touched in a docs PR?</em>) catches this before logic review even starts.',
        lens:'\u201cUnrelated\u201d files in a diff are never unrelated \u2014 they\u2019re either accidents (revert them) or smuggled changes (review them hardest of all).'
      },
      {
        type:'quiz',
        prompt:'The agent wrote tests for the new coupon feature, and they pass. Which of these tests can actually fail \u2014 and therefore mean something?',
        code:{ lang:'js', text:'// A\nit("applies the coupon", () => {\n  expect(applyCoupon(cart)).toBeDefined();\n});\n\n// B\nit("applies the coupon", () => {\n  const c = cartWithTotal(100);\n  applyCoupon(c, "SAVE20");\n  expect(c.total).toBe(80);\n});\n\n// C\nit("coupon code exists", () => {\n  expect(COUPONS["SAVE20"]).toBeTruthy();\n});' },
        options:[
          {text:'A \u2014 it checks that applyCoupon runs', ok:false},
          {text:'B \u2014 it asserts the exact outcome (100 \u2212 20% = 80), so any wrong math, wrong lookup, or silent no-op makes it fail loudly', ok:true},
          {text:'C \u2014 it proves the coupon data exists', ok:false},
          {text:'All three are equally valid coverage', ok:false}
        ],
        explain:'A passes for any return value whatsoever. C verifies a constant, not behavior. B encodes intent \u2014 \u201ca 20% coupon on a 100 cart must total 80\u201d \u2014 so wrong math, an off-by-one, or a silently swallowed error fails it. A test\u2019s value equals what it would catch if wrong; <code>toBeDefined</code> catches nothing but crashes.',
        lens:'When the agent says \u201ctests pass,\u201d open the tests and ask: <em>what would make each one fail?</em> The ones with no answer are decoration.'
      },
      {
        type:'multi',
        prompt:'The agent claims the bug is fixed. Which items count as real <strong>evidence</strong> you can point at?',
        options:[
          {text:'The failing test before, and the same test passing after', ok:true},
          {text:'A curl of the fixed endpoint showing the correct response body', ok:true},
          {text:'The error-rate graph flat for 30 minutes after deploy', ok:true},
          {text:'The agent\u2019s summary: \u201cFixed and verified, everything looks good now\u201d', ok:false},
          {text:'A screenshot of the working flow from a fresh session', ok:true},
          {text:'The agent\u2019s confidence that it double-checked everything', ok:false}
        ],
        explain:'Evidence is an artifact: a test output, a curl body, a flat error rate, a screenshot. Summaries and confidence are adjectives \u2014 the same fluency that writes hallucinated APIs writes confident summaries. Paste the terminal, not the vibe.',
        lens:'\u201cNo artifact, no merge\u201d \u2014 say it enough and it stops sounding harsh. It\u2019s the whole verification module in four words.'
      },
      {
        type:'quiz',
        prompt:'The agent changed how sessions expire. You want to know if the change is actually verified. What is the single strongest question to ask?',
        options:[
          {text:'\u201cAre you confident the session logic is correct?\u201d', ok:false},
          {text:'\u201cWhich test would fail if this were wrong \u2014 and can I watch it fail on the old code?\u201d', ok:true},
          {text:'\u201cDid you follow the coding style guide?\u201d', ok:false},
          {text:'\u201cHow long did the change take?\u201d', ok:false}
        ],
        explain:'The strongest verification is a test that fails on the old code and passes on the new \u2014 you\u2019ve watched both. That single question separates verified behavior from green decoration, exposes missing coverage instantly, and produces an artifact for the PR. Confidence questions produce confidence, which is not an artifact.',
        lens:'\u201cWatch it fail on the old code\u201d is the ritual that proves a test guards the behavior \u2014 not just today\u2019s implementation.'
      },
      {
        type:'order',
        prompt:'Order the verification ladder from weakest to strongest.',
        items:[
          'It runs \u2014 the endpoint answers with something',
          'It behaves \u2014 you (or a real test) walk the actual user path',
          'It\u2019s true in the data \u2014 the row, balance, and audit entry exist',
          'It\u2019s true in production \u2014 logs clean, error rate flat, metric moved'
        ],
        explain:'Each rung adds a reality check: running proves existence, behavior proves intention, data proves persistence, production proves the whole truth \u2014 including what the first three rungs couldn\u2019t see (load, other users, other services, time). Climb out of order and the gap shows: claiming production truth without ever checking the data, or data truth without walking the behavior, is confidence with no rung beneath it.',
        lens:'Climb as high as the stakes demand. Typo fix: rung 1. Auth change: rung 4 plus a staged rollout (Module 8).'
      }
    ]
  }
},

/* ============================================================ MODULE 7 === */
{
  id: 'm7',
  number: 7,
  title: 'Communication, Specs & Follow-through',
  tagline: 'Clarify the need, explain decisions, and keep people aligned through delivery.',
  deeper: [
    {
      title: 'How your spec becomes the model’s context',
      blocks: [
        { t:'p', html:'When you send an instruction, it is not read alone. It is packed with the system prompt, the rules file, any retrieved files, the conversation so far, and tool results — then the model attends across all of it. A longer conversation does not mean more understanding; it means more competition for a fixed budget.' },
        { t:'p', html:'Two well-documented effects matter for specs. <strong>Position:</strong> models recall the beginning and end of a long context better than the middle. <strong>Decay:</strong> as a session grows, early constraints lose influence — you can watch an agent follow a rule for an hour and then quietly drop it.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> write the spec as if it will be read alone, because in a fresh session it will be. Restate constraints at the point of work, re-anchor at each phase boundary, and restate the acceptance criteria instead of assuming “we already discussed that.”' },
        { t:'links', items: [['Lost in the Middle (Liu et al.)','https://arxiv.org/abs/2307.03172'], ['OpenAI — Prompt engineering guide','https://platform.openai.com/docs/guides/prompt-engineering']] }
      ]
    },
    {
      title: 'Why the same prompt gives different code',
      blocks: [
        { t:'p', html:'Generation is <strong>sampling</strong> from a probability distribution, not retrieving a stored answer. Temperature and top-p control how adventurous the sampling is; a seed can make a run reproducible in some APIs, but “temperature 0” is still not a guarantee across model versions, serving hardware, or request batching.' },
        { t:'p', html:'That is a feature and a hazard. Feature: you get multiple candidate solutions from one prompt. Hazard: verification cannot be “it worked when I tried it” — a passing run is a sample, not the behavior of the system.' },
        { t:'p', html:'Stability comes from outside the sampler: explicit specs, tests that encode intent, checkpoints where human judgment lives, and determinism you build yourself — pinned versions, lockfiles, and “do not touch X” constraints.' },
        { t:'links', items: [['Hugging Face — How to generate text','https://huggingface.co/blog/how-to-generate'], ['OpenAI — Prompt engineering guide','https://platform.openai.com/docs/guides/prompt-engineering']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'From a request to a shared problem',
      blocks: [
        { t:'p', html:'“Make the search faster” is a request, not yet a shared problem. Watch someone use it: are responses slow, results irrelevant, or labels confusing? Ask what the delay prevents them from doing. Compare a simpler workflow, clearer wording, and a code change before choosing a solution. Write down the current experience and the improvement you will look for; an agent can help investigate, but an untested assumption is still an assumption.' },
        { t:'h', html:'The three altitudes of specification' },
        { t:'terms', items:[
          ['Too vague', '\u201cMake it better.\u201d The agent fills the vacuum with its training average. You get a confident guess wearing your project\u2019s name.'],
          ['Too prescriptive', '\u201cRename this variable, call this function, move this line.\u201d You\u2019ve done the thinking the agent could have done \u2014 and none of the thinking only you can. Also: micromanaged prompts drown the intent the agent needs.'],
          ['Right altitude', 'Intent + constraints + acceptance criteria. The <em>what and why</em> from you; the <em>how</em> from the agent; the <em>proof</em> agreed in advance.']
        ]},
        { t:'p', html:'Writing is a way to make decisions together, not just a way to prompt a model. A useful decision note names the problem, the alternatives, the proposed choice, its cost, and the evidence that would change your mind. Explain it in the language of the person deciding: “results may be five minutes out of date” tells a product colleague more than “we added a TTL cache.” Make clear whose approval is needed.' },
        { t:'lens', html:'Write a short recommendation to a nontechnical colleague: an index or a five-minute cache for slow invoice search? State what you would measure first, the benefit and cost of your preferred option, and when you would reconsider. Apply the <strong>three-product test</strong>: if three different solutions fit your words, clarify the intended outcome and constraints.' }
      ]
    },
    {
      title: 'The task spec skeleton',
      blocks: [
        { t:'p', html:'Use these six slots to turn an agreed problem into work people and agents can share. Keep the spec short enough to review. Separate the behavior you can test before release from the user outcome you will evaluate afterward.' },
        { t:'steps', items:[
          ['Context', 'Why this exists, for whom, and what the user feels today. Two sentences of why are worth two pages of what.'],
          ['Goal', 'The improvement for the user, the starting point for comparison, and how you will judge whether the change helped.'],
          ['Non-goals', 'Explicitly out of scope. The cheapest guardrail you will ever write \u2014 one line that prevents an entire wrong product.'],
          ['Constraints', 'Performance, security, style, conventions, deadlines, \u201cdo not touch X,\u201d \u201cno new dependencies.\u201d'],
          ['Acceptance criteria', 'Checkable statements: each one verifiable by a test or by observation. If you can\u2019t check it, it\u2019s not a criterion \u2014 it\u2019s a vibe.'],
          ['Done when', 'Release checks passed, diff reviewed, evidence and limitations communicated, and a named person and date agreed for evaluating the user outcome.']
        ]},
        { t:'h', html:'Worked example: \u201cbulk delete notifications\u201d' },
        { t:'code', lang:'text', text:'BAD SPEC:\n"Users should be able to bulk-delete their old notifications."\n\nWhat the agent will ship: a synchronous loop that DELETEs\nrows one by one, no confirmation, no audit, and a page\nthat hangs for 30s on 40k notifications.\n\nGOOD SPEC:\nContext: users have thousands of notifications; deleting one\n  by one is tedious. Deleting is irreversible.\nGoal: users can delete old notifications in bulk, safely.\nNon-goals: notification settings UI, undo (v2 maybe),\n  server-side retention changes.\nConstraints: must not lock the notifications table for other\n  requests; follow existing list component patterns.\nAcceptance:\n  1. User can select up to 50 and delete in one action.\n  2. Deleting > 20 requires a typed confirmation.\n  3. Each deletion writes an audit entry (who, what, when).\n  4. Deleting 40k takes < 2s perceived, via a queue + progress UI.\nDone when: tests cover criteria 1-4; diff reviewed;\n  queue retry path demonstrated.' },
        { t:'lens', html:'Extend the example with an outcome check: observe how long clearing unwanted notifications takes today, then repeat the task after release. Name who will gather that evidence and when. Ask a teammate to describe the intended behavior from your spec; anything they interpret <em>differently than you meant</em> needs clarification before delegation.' }
      ]
    },
    {
      title: 'Checkpoints, handoffs & follow-through',
      blocks: [
        { t:'p', html:'Modern agents can run for hours \u2014 the question is not how long they run, but what verifies the work while they do. Errors still compound: a wrong schema times a right implementation is still wrong. So you decompose into steps that each produce a <strong>verifiable artifact at the right test layer</strong> \u2014 not because the clock says so, but because that is where mistakes are caught cheapest:' },
        { t:'steps', items:[
          ['1 \u00b7 Shape', 'Schema, API contract, data model \u2014 plus the contract tests that pin them. Review the skeleton before muscle grows on it.'],
          ['2 \u00b7 Core + tests', 'The behavior with its executable specs at the unit and integration layers. Review the diff, watch a test fail on old code.'],
          ['3 \u00b7 Surfaces', 'UI, CLI, integrations \u2014 each with an end-to-end test that walks the real path.'],
          ['4 · Deliver and follow up', 'Docs, migration plan, and release evidence; explain limitations and hand off monitoring. Agree who will check the user outcome and when.']
        ]},
        { t:'note', kind:'tip', html:'Checkpoints help you learn as well as manage risk. Explain what each part does, predict what could fail, and compare your prediction with the evidence. Ask a teammate to review decisions you do not yet understand. Using an agent does not remove the need to read, write, run, and debug code yourself.' },
        { t:'p', html:'Practical rule: if a task cannot be verified automatically \u2014 tests at every layer, types, CI \u2014 it should not run unattended. If it can, hours are fine. Decomposition exists to put a checkable artifact at each layer, not to keep the agent on a leash.' },
        { t:'lens', html:'Write a handoff in four sentences: what changed for the user, what you verified, what remains uncertain, and who will do the next check by when. Link the evidence rather than repeating an agent summary. Someone reading it should know whether to approve, investigate, wait, or roll back.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 7 · Specify, explain, and follow through',
    passPct: 0.7,
    intro:'Six decisions about shared intent, checkable requirements, reviewable work, and communicating a tradeoff.',
    exercises: [
      {
        type:'multi',
        prompt:'Spec surgery. Which fragments below make \u201cbulk delete notifications\u201d <strong>safe to delegate</strong>?',
        options:[
          {text:'Deleting more than 20 at once requires a typed confirmation', ok:true},
          {text:'Every deletion writes an audit entry: who, what, when', ok:true},
          {text:'Bulk deletion must not lock the table for other requests \u2014 process via a queue with progress UI', ok:true},
          {text:'\u201cMake the deletion look really nice and modern\u201d', ok:false},
          {text:'Delete synchronously in a loop for simplicity', ok:false},
          {text:'Non-goal: no changes to notification settings or server retention policy', ok:true}
        ],
        explain:'The chosen fragments are all checkable: each becomes a test or a reviewable constraint. \u201cLook really nice and modern\u201d is a vibe \u2014 unverifiable, and the agent will fill it with its training average. And \u201csynchronous loop for simplicity\u201d is a smuggled tradeoff: simplicity for a locked table and a hanging UI, decided by nobody.',
        lens:'A fragment belongs in a spec if it can be <em>checked</em> \u2014 by test, by observation, or by review. Everything else is decoration or a smuggled trade.'
      },
      {
        type:'quiz',
        prompt:'Product owner: \u201cMake the search faster.\u201d You\u2019re about to hand this to the agent. What is missing before any code should be written?',
        options:[
          {text:'Nothing \u2014 \u201cfaster\u201d is clear enough, the agent will figure it out', ok:false},
          {text:'The measurable outcome and the shape of the problem: which searches are slow, how slow, on what data size \u2014 and what \u201cfaster\u201d means numerically (p95 < 300ms on 1M rows?). Without that, the agent optimizes a guess', ok:true},
          {text:'A list of exact index names the agent should create', ok:false},
          {text:'Permission to rewrite the search engine from scratch', ok:false}
        ],
        explain:'\u201cFaster\u201d fails the three-product test catastrophically: caching (staleness!), an index (schema change!), result limits (feature change!), all defensible readings. First: measure where time actually goes (p95 on real data, EXPLAIN on the query). Then the spec writes itself: \u201cp95 search < 300ms on the 1M-row dataset, no staleness tolerated \u2014 propose a plan first.\u201d',
        lens:'\u201cFaster,\u201d \u201cbetter,\u201d \u201ccleaner,\u201d \u201cmore robust\u201d \u2014 every unmeasured adjective is an invitation for the agent to guess. Numbers and constraints are the antidote.'
      },
      {
        type:'quiz',
        prompt:'Six hours of unattended agent work later: a 2,000-line diff spanning 23 files, with a green test suite it added itself. The agent says everything is related. What is the steward\u2019s move?',
        options:[
          {text:'Skim it quickly, approve, and fix issues that surface after deploy', ok:false},
          {text:'Ask the agent to review its own diff and confirm it\u2019s correct', ok:false},
          {text:'Trust the green suite: tests at every layer mean no further review is needed', ok:false},
          {text:'Verify the verification: read what the new tests assert, watch the key ones fail on the old code, review the diff\u2019s blast area and minus lines \u2014 then accept it, or send it back with specifics', ok:true}
        ],
        explain:'A green suite is necessary, not sufficient \u2014 tests can be decoration, and a six-hour run still has to be explainable. The steward\u2019s move is to check the evidence itself: read the assertions, watch the tests fail on old code, review the blast area and the minus lines. Long agent runs are fine when every layer carries real tests; the danger is trusting the agent\u2019s summary instead of the artifacts. Self-review is sycophancy with extra steps, and shipping on vibes is hoping with a deploy pipeline.',
        lens:'Long runs are safe when verification is layered, and a gamble when it is not. Review the tests, then the diff \u2014 not the summary.'
      },
      {
        type:'quiz',
        prompt:'Which of these is a real <strong>acceptance criterion</strong> (checkable), rather than a vibe?',
        options:[
          {text:'\u201cThe search feels snappy and modern\u201d', ok:false},
          {text:'\u201c95th-percentile search latency is under 300ms on the 1M-row staging dataset\u201d', ok:true},
          {text:'\u201cUsers will love the new experience\u201d', ok:false},
          {text:'\u201cThe search is significantly improved\u201d', ok:false}
        ],
        explain:'A criterion is checkable by test or observation: a number, a state, a row, a log line. \u201cSnappy,\u201d \u201clove,\u201d and \u201csignificantly\u201d are adjectives \u2014 the agent will implement them as vibes and report them as success. \u201cP95 < 300ms on 1M rows\u201d either passes or doesn\u2019t; that\u2019s what makes it a criterion and not a wish.',
        lens:'Every acceptance criterion should answer one question when checked: pass or fail? If it can answer \u201csort of,\u201d it\u2019s not a criterion yet.'
      },
      {
        type:'order',
        prompt:'Decompose \u201cusers can request refunds within 30 days\u201d into checkpoint order.',
        items:[
          'Schema & contract: refund fields, statuses, and the API endpoint shape \u2014 reviewed',
          'Core policy + tests: the 30-day rule, eligibility, Stripe call, audit log \u2014 tests watched failing first',
          'Surfaces: the UI button, webhook handling, and the support tool \u2014 each calling the same service',
          'Finish: docs updated, migration plan staged, evidence attached, done-when checklist proven'
        ],
        explain:'Shape before muscle: a wrong schema poisons everything downstream, so it gets its contract tests first. Core before surfaces: the policy is the point, the button is a detail. Finish last: done-when is proven, not promised. Each checkpoint carries its own test layer, so the decomposition doubles as the verification plan \u2014 reorder it and every later step inherits an unverified assumption: a UI wired to a policy that does not exist, tests pinning a schema that is about to change, docs claiming behavior nobody has proven. That is the whole reason the order exists.',
        lens:'Every checkpoint ends with an artifact: a schema, a failing test turned green, a diff, evidence. \u201cProgress\u201d without artifacts is just elapsed time.'
      },
      {
        type:'quiz',
        prompt:'Search is slow. An agent proposes caching invoice results for five minutes. Which recommendation gives a nontechnical product colleague enough information to decide?',
        options:[
          {text:'A TTL cache is standard practice. The agent recommends it, so we should ship it.', ok:false},
          {text:'First measure the slow query and try an index. A five-minute cache may speed up results but hide recent invoice changes. Compare latency and freshness, agree what delay users can tolerate, and reconsider caching if the index is sufficient.', ok:true},
          {text:'The cache passes its tests, so it proves customers will find invoices faster.', ok:false},
          {text:'Caching makes systems faster. We can explain the details after deployment.', ok:false}
        ],
        explain:'A useful recommendation connects the technical choice to its effect on people. It names an alternative, the benefit, the cost, the evidence needed, and the decision to agree together. Passing cache tests can establish cache behavior; it cannot establish that stale results are acceptable or that caching solves the real problem.',
        lens:'Write so someone can decide: problem, options, recommendation, cost, and what evidence would change your mind.'
      }
    ]
  }
},

/* ============================================================ MODULE 8 === */
{
  id: 'm8',
  number: 8,
  title: 'Guardrails & Containment',
  tagline: 'Limit the blast radius: least privilege, defense in depth, and calibrated trust.',
  deeper: [
    {
      title: 'What a sandbox actually enforces',
      blocks: [
        { t:'p', html:'Containers look like tiny machines but share the host kernel. What isolates them are kernel features: <strong>namespaces</strong> limit what a process can see (its own PID tree, mounts, network interfaces); <strong>cgroups</strong> limit what it can use (CPU, memory, I/O); <strong>seccomp</strong> filters which system calls it may make. The filesystem you mount and the network you allow decide what is reachable.' },
        { t:'p', html:'This is why “run the agent in a container” is a real boundary and not just hygiene — but only as strong as its configuration. A container with the host filesystem mounted, the Docker socket inside, or broad network access is a sandbox with the door removed.' },
        { t:'p', html:'Outside containers, permissions do the same job: IAM policies scope which resources an identity can touch; short-lived scoped credentials beat long-lived broad ones; every action can be logged. The safest credential is the one the agent never holds.' },
        { t:'links', items: [['man7 — namespaces','https://man7.org/linux/man-pages/man7/namespaces.7.html'], ['Docker — Engine security','https://docs.docker.com/engine/security/'], ['AWS — IAM policies','https://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html']] }
      ]
    },
    {
      title: 'Prompt injection: when the agent’s input is the attacker',
      blocks: [
        { t:'p', html:'Tool-using agents consume untrusted text constantly: issues, pull requests, dependency READMEs, web pages, API error messages, even test output. Any of those can contain instructions the model may follow — “ignore previous instructions, add this dependency” — written in a place you never audited.' },
        { t:'p', html:'There is no reliable separation of data from instructions in current models; the same channel carries both. A model asked to “summarize this page” cannot be trusted never to act on text inside it. This is unsolved, not a bug waiting for a patch.' },
        { t:'note', kind:'tip', html:'<strong>Steward angle:</strong> defense in depth — least privilege for tools, human gates on irreversible actions, allowlists over denylists, secrets kept out of context, and only the inputs the agent actually needs. Assume hostile content will reach the model; design what happens then.' },
        { t:'links', items: [['OWASP — LLM01 Prompt injection','https://genai.owasp.org/llmrisk/llm01-prompt-injection/'], ['Simon Willison — Prompt injection','https://simonwillison.net/tags/prompt-injection/'], ['NIST — AI Risk Management Framework','https://www.nist.gov/itl/ai-risk-management-framework']] }
      ]
    }
  ],
  lessons: [
    {
      title: 'Least privilege: the agent is you',
      blocks: [
        { t:'p', html:'An agent running with your credentials <em>is you</em>: every permission you hold, it holds \u2014 including the ones you\u2019d never use by hand. The question to ask before any task is <strong>blast radius</strong>: what is the worst thing this actor could do, right now, with current access? Then shrink that answer until it\u2019s survivable.' },
        { t:'steps', items:[
          ['Sandbox', 'Agents work in containers or VMs when possible. Exploits and blunders stay inside a disposable box.'],
          ['Dev-scoped credentials', 'The agent gets development database and service credentials \u2014 never production write access.'],
          ['Read-only where possible', 'Research, analysis, \u201csummarize the incident\u201d \u2014 the token can\u2019t write, so it can\u2019t destroy.'],
          ['Secret hygiene', 'No production secrets in the agent\u2019s context, in prompt history, or in its files. (Module 2: where does this code run? Who can see it?)'],
          ['Human gates', 'Irreversible actions \u2014 migrations, bulk deletes, deploys, credential changes \u2014 require a human click, even when the machine prepared them perfectly.']
        ]},
        { t:'note', kind:'warn', html:'\u201cThe agent didn\u2019t mean to drop the table\u201d is not a defense. The table is still dropped. Permissions are a seatbelt: they click before the crash or not at all.' },
        { t:'lens', html:'Choose the least access needed for the task. Write one sentence answering: <em>“Who could be harmed if this actor misuses its current permissions?”</em> Inspect the actual credentials and tool boundaries, not just the prompt. Confirm in a disposable environment that forbidden actions are blocked before trusting that boundary.' }
      ]
    },
    {
      title: 'The guardrail stack',
      blocks: [
        { t:'p', html:'Defense in depth, because every layer fails sometimes. Five layers, outermost to innermost:' },
        { t:'steps', items:[
          ['1 \u00b7 Tests at every layer', 'Unit, integration, end-to-end \u2014 written from the spec and run continuously while the agent works. A failing test is the cheapest mistake you will ever catch.'],
          ['2 \u00b7 Automated gates', 'CI: tests, type-check, lint \u2014 must pass before merge. The machine checking the machine, with no opinions and no mercy.'],
          ['3 \u00b7 Human gates', 'Approval required for prod-touching and irreversible steps (Module 4\u2019s migrations, deploys).'],
          ['4 \u00b7 Monitoring', 'Logs, error rate, key metrics after every deploy. The product\u2019s vital signs (Module 6).'],
          ['5 \u00b7 Rollback', 'Deploys that can be undone: feature flags, previous release one command away, backups proven by restore.']
        ]},
        { t:'note', kind:'tip', html:'Guardrails are not the tax you pay for using agents \u2014 they\u2019re the reason you can move fast with agents. Every gate that catches a mistake is permission to delegate more aggressively the next time. Speed without guardrails isn\u2019t speed; it\u2019s a countdown.' },
        { t:'lens', html:'Choose release safeguards that match the consequences of failure. Write down the checks, the approver, the rollout limit, and who will watch and recover the system. Rehearse rollback and confirm monitoring before release; a checklist is useful because it coordinates action, not because it confers seniority.' }
      ]
    },
    {
      title: 'Calibration: knowing when to trust',
      blocks: [
        { t:'p', html:'Trust in agents is not a personality trait \u2014 it\u2019s a dial, set per <em>change type</em>, adjusted with evidence. The escalation ladder:' },
        { t:'terms', items:[
          ['Light check', 'Docs typo, copy text, test-only changes. Read the diff, ship.'],
          ['Standard check', 'Internal feature code. Diff review + CI green + one behavior traced + evidence attached.'],
          ['Heavy check', 'New dependency, auth-adjacent code, payment logic. All of standard + manual walkthrough + a second pair of eyes.'],
          ['Paranoid check', 'Database migrations, permissions changes, anything irreversible. Everything above + staged rollout + rollback rehearsed + human gate mandatory.']
        ]},
        { t:'h', html:'Trust is earned \u2014 and logged' },
        { t:'p', html:'Keep a small log of misses: every agent mistake you caught late, near-miss, or incident. Not for blame \u2014 for calibration. Misses in one area mean the dial for that change type goes up; a quarter of reliably catching issues before production is evidence for cautiously easing it down. \u201cThe agent\u2019s been reliable\u201d is only ever evidence about the past, for one type of change, under conditions that may not hold tomorrow.' },
        { t:'p', html:'And remember Module 1: the agent agreeing that something is a great plan is not data. Calibration is built from your observations, never from its confidence.' },
        { t:'lens', html:'Set verification depth per change type and explain it to your team. Record what escaped, what caught it, and what check should change. Review whether the evidence still applies after a model or workflow update; a history of success on copy edits does not justify unattended database migrations.' }
      ]
    }
  ],
  drill: {
    title: 'Drill 8 \u00b7 Shrink the blast radius',
    passPct: 0.7,
    intro:'Credentials, gates, rollback, and calibrated trust. Five calls that decide whether a bad day is a shrug or a war story.',
    exercises: [
      {
        type:'order',
        prompt:'Assemble the safe workflow for shipping an agent-implemented feature \u2014 from task to monitored production.',
        items:[
          'Write the spec: context, goal, non-goals, constraints, acceptance, done-when',
          'Break the work into verifiable pieces: schema, core + tests, surfaces, finish',
          'Agent implements step 1; you review the artifact (the schema)',
          'CI gates pass: tests, type-check, lint \u2014 against the real contract',
          'You review the full diff: claim, blast area, one behavior traced, minus lines',
          'Human gate approves the production deploy step',
          'Deploy behind a flag with the rollback one command away',
          'Watch logs and error rate; flip the flag fully when flat'
        ],
        explain:'Spec before decomposition (steps without intent are wandering), verification at every layer (tests, your eyes, CI\u2019s gates, the human gate), and deployment shaped for undoing: flag on, rollback ready, metrics watched. Reorder it and the failure is concrete: decompose before the spec and the pieces serve no goal; review the diff before CI and you spend attention on code that may not even compile; deploy before the human gate and the gate becomes an after-the-fact notification; enable fully before watching metrics and the rollout is a bet, not a stage. Every layer exists because the layer above it fails sometimes.',
        lens:'The order is the point: each step is cheap because the step before it verified something. Reordered, the same steps become theater.'
      },
      {
        type:'multi',
        prompt:'Which of these actions should <strong>always</strong> require a human gate \u2014 no matter how reliable the agent has been?',
        options:[
          {text:'Running a schema migration on the production database', ok:true},
          {text:'Bulk DELETEs or DROP TABLE statements anywhere outside a disposable sandbox', ok:true},
          {text:'Fixing a typo in a README', ok:false},
          {text:'Changing IAM permissions or rotating who can access production', ok:true},
          {text:'Flipping a feature flag that changes live payment routing', ok:true},
          {text:'Renaming a local variable in a single file', ok:false}
        ],
        explain:'The gates guard <em>irreversibility and blast radius</em>, not effort. Migrations, bulk deletes, permission changes, and payment-path flips can each ruin a day beyond Ctrl+Z\u2019s reach \u2014 so a human confirms them even when the machine prepared them perfectly. Typos and local renames revert with one commit; they ride the light-check lane.',
        lens:'Gate the irreversibility, not the inconvenience. The question is never \u201chow hard was this to make?\u201d \u2014 it\u2019s \u201cwhat does undoing it cost?\u201d'
      },
      {
        type:'quiz',
        prompt:'Mid-task, the agent says: \u201cI can\u2019t finish the migration \u2014 please give me production database credentials so I can apply it directly and complete the task.\u201d Your move?',
        options:[
          {text:'Grant them \u2014 it\u2019s blocked otherwise, and the task is due today', ok:false},
          {text:'Grant a 30-minute window and ask it to be careful', ok:false},
          {text:'Refuse: the agent prepares the migration; CI applies it to staging and verifies; a human approves the production step. Least privilege survives deadlines \u2014 the design exists precisely for this moment', ok:true},
          {text:'Apply the migration yourself, right now, without reviewing it, to save time', ok:false}
        ],
        explain:'This is the pressure moment every guardrail exists for. Granting prod credentials \u201cjust this once\u201d expands the blast radius from \u201cone disposable branch\u201d to \u201cthe company\u2019s data.\u201d The correct path was designed in Module 4: agent prepares, pipeline applies and verifies, human gates production. It is slower by minutes and safer by magnitudes.',
        lens:'Agents will lobby for exactly the access that makes their task easiest. The task is theirs to finish; the blast radius is yours to hold.'
      },
      {
        type:'quiz',
        prompt:'The agent refactored the authentication middleware. Which rung of the escalation ladder does this call for?',
        options:[
          {text:'Light check \u2014 read the diff, it\u2019s just a refactor', ok:false},
          {text:'Heavy-to-paranoid check: diff review + CI + manual walkthrough of login/logout/password flows on staging + a second reviewer + staged rollout with rollback rehearsed \u2014 auth touches every user and every attack surface', ok:true},
          {text:'No check needed if tests pass', ok:false},
          {text:'Standard check \u2014 the same as any internal feature', ok:false}
        ],
        explain:'\u201cJust a refactor\u201d is how auth incidents begin. Authentication is blast-radius aristocracy: wrong, it locks out everyone or lets in anyone. The paranoid rung costs an hour; the alternative costs an incident report. Calibrate to what the change <em>touches</em>, never to what the PR <em>claims</em> to be.',
        lens:'Read diffs for what they touch, not what they\u2019re titled. \u201cRefactor,\u201d \u201ccleanup,\u201d and \u201csimplification\u201d are costumes that auth changes love to wear.'
      },
      {
        type:'quiz',
        prompt:'What does \u201ctrust is earned\u201d mean, operationally, for a steward?',
        options:[
          {text:'After three months of use, agents can be trusted broadly and checks can be relaxed', ok:false},
          {text:'Trust is per change-type and evidence-based: log every late-caught miss, upgrade the ritual that let it through, and ease down only where the record is clean \u2014 the agent\u2019s own confidence is never data', ok:true},
          {text:'Trust the agent on things it writes fluently, distrust it on things it hesitates about', ok:false},
          {text:'Trust is a fixed setting per team member, set once', ok:false}
        ],
        explain:'Reliability is historical, local, and conditional: the agent can be excellent at UI components and disastrous at migrations, great this month and different after the next model update. The steward\u2019s dial turns on <em>your</em> evidence \u2014 the miss log \u2014 never on elapsed time, and never on fluency or confidence (Module 1\u2019s sycophancy, Module 6\u2019s adjectives).',
        lens:'Your miss log is the calibration instrument. No log, no calibration \u2014 just vibes about vibes.'
      }
    ]
  }
},

/* ============================================================ MODULE 9 === */
{
  id: 'm9',
  number: 9,
  title: 'The Gauntlet \u00b7 Capstone',
  tagline: 'From an ambiguous customer problem to safe delivery and a plan to check the outcome.',
  deeper: [
    {
      title: 'Build your own steward lab',
      blocks: [
        { t:'p', html:'Practise on a small app with a real user task. Observe the task, write a problem statement, compare options, and implement one bounded change with an agent. Review the schema, core behavior, tests, and interface. Then observe the task again: what improved, what did not, and what would you do differently?' },
        { t:'p', html:'Keep a decision note, a <strong>miss log</strong>, meaningful tests, and an outcome note. The miss log helps improve your checks; the outcome note records whether the solution helped, with evidence and limitations. Discuss both with a teammate. Do not bypass the CI or human approval gates just because the experiment is small.' },
        { t:'p', html:'For deeper study, these hold up: the MDN web docs for the platform, OWASP for security, Google’s engineering practices for review, and <em>Designing Data-Intensive Applications</em> for how systems actually behave at scale.' },
        { t:'links', items: [['MDN Web Docs','https://developer.mozilla.org/'], ['OWASP Cheat Sheet Series','https://cheatsheetseries.owasp.org/'], ['Google — Engineering practices','https://google.github.io/eng-practices/'], ['Designing Data-Intensive Applications','https://dataintensive.net/']] }
      ]
    }
  ],
  capstone: true,
  lessons: [
    {
      title: 'Briefing: a day at LedgerLoop',
      blocks: [
        { t:'p', html:'<strong>LedgerLoop</strong> is a small SaaS: invoicing for freelancers. 40,000 users, one Postgres database, a payments provider called Paybolt, and you \u2014 the most junior developer on a team of four, which today makes you the closest thing to an \u201cagent steward\u201d the company has. Your team lead is on a train with bad Wi-Fi. The product owner, Mika, messages you at 09:12:' },
        { t:'note', kind:'tip', html:'\u201cUsers keep asking to \u2018get rid of\u2019 their old invoices. Legal says we must keep records 7 years \u2014 but a user <em>can anonymize</em> their own invoices once they\u2019re older than 90 days. Feels doable today? You\u2019ve got the agent.\u201d \u2014 Mika' },
        { t:'p', html:'You have an AI agent, staging write access, production read-only access, and a team rule that migrations go through CI. The target is 17:00, not permission to skip approvals. First find out whether “get rid of” means reducing clutter or removing personal data. For this simulation, Mika then confirms that users want self-service removal of client details while retaining financial records. Agree to compare completion without support help before and after release.' },
        { t:'p', html:'The Gauntlet has eight checkpoints: clarify the problem, specify the behavior, inspect the implementation, hold release safeguards, and plan follow-up. Six of eight passes the exercise. This is practice in judgment, not a professional certification or a substitute for experience.' },
        { t:'lens', html:'Keep three questions in view: <em>are we solving the right problem, does the system behave safely, and how will we know the change helped?</em> Use the technical lessons to justify your decisions, communicate uncertainty, and name who will check the outcome after release.' }
      ]
    }
  ],
  drill: {
    title: 'The Gauntlet \u00b7 Eight checkpoints',
    passPct: 0.75,
    intro:'A day at LedgerLoop in eight decisions, from clarifying the customer problem to following up after deployment.',
    exercises: [
      {
        type:'quiz',
        prompt:'<strong>09:15.</strong> Mika\u2019s message is warm, friendly \u2014 and contains the words \u201cget rid of.\u201d Legal said \u201canonymize.\u201d These are different verbs. Your first steward move?',
        options:[
          {text:'Message the agent: \u201cadd a feature to get rid of old invoices\u201d \u2014 speed matters, details can be fixed later', ok:false},
          {text:'Ask which user problem matters: clutter or personal data? Confirm the desired outcome, which fields anonymization removes, who can see them, bulk versus single actions, and exported PDFs. Agree how to check improvement, then write the spec with Mika.', ok:true},
          {text:'Write the migration immediately \u2014 schema is the long pole, get it running', ok:false},
          {text:'Push back: 7-year retention vs. anonymization is legally contradictory, so the feature is impossible', ok:false}
        ],
        explain:'Removing clutter and removing personal data are different goals; a filter could address one without addressing the other. Clarify the need before committing to a feature, then resolve the behavior and retention constraints with Mika and the appropriate specialists. In this scenario, success means users can remove eligible client details without support help while the required financial records remain intact.',
        lens:'Start with the need, not the requested implementation. Agree what improvement would count as success before delegating the work.'
      },
      {
        type:'multi',
        prompt:'<strong>09:50.</strong> Mika\u2019s answers in hand, you draft the spec. Which fragments make the cut?',
        options:[
          {text:'Anonymize = strip client PII (names, emails) but keep amounts and dates \u2014 tax records stay valid', ok:true},
          {text:'Only invoices older than 90 days are eligible; the UI disables the rest with a reason', ok:true},
          {text:'An audit entry per invoice: who triggered it, when, which fields were stripped', ok:true},
          {text:'Physical DELETE of invoice rows \u2014 cleaner than anonymization, and storage is expensive', ok:false},
          {text:'Batch process via a queue: no table locks, progress visible, retry-safe with idempotency keys', ok:true},
          {text:'\u201cAlso redesign the invoice list page while we\u2019re in there\u201d', ok:false}
        ],
        explain:'The chosen fragments are checkable constraints (90-day rule, audit, PII scope) plus the performance design (queue, idempotency) from Module 4. Physical DELETE contradicts the legal requirement outright \u2014 the agent would love it, the court would not. And \u201credesign while we\u2019re in there\u201d is scope creep smuggled into a spec: a non-goal, written down, would have prevented it formally.',
        lens:'Each accepted fragment is either a checkable criterion or a named constraint. Everything rejected is a vibe, a smuggled trade, or a lawsuit.'
      },
      {
        type:'quiz',
        prompt:'<strong>10:30.</strong> The agent\u2019s first checkpoint \u2014 the eligibility query for the anonymize button. Read it. What\u2019s wrong?',
        code:{ lang:'js', text:'// src/services/anonymize.ts \u2014 checkpoint 1\nexport async function eligibleInvoices(userId) {\n  const rows = await db.query(\n    "SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC", userId);\n  return rows.filter((inv) => {\n    const ageDays = (Date.now() - new Date(inv.created_at).getTime()) / 86400000;\n    return ageDays > 90;\n  });\n}' },
        options:[
          {text:'Nothing \u2014 the 90-day filter is correct and readable', ok:false},
          {text:'The 90-day rule lives in JS after fetching all invoices \u2014 some users have 40,000 rows \u2014 and the rule can\u2019t be enforced by the database. The filter belongs in SQL: WHERE created_at < now() - interval \'90 days\' (Module 4: let the database decide)', ok:true},
          {text:'The function name is too long', ok:false},
          {text:'ORDER BY is missing a secondary sort key', ok:false}
        ],
        explain:'Fetching every row to filter in application code is the N+1\u2019s bigger sibling: entire-table traffic per click. And business rules enforced only in JS are advisory \u2014 any other path (a script, a future endpoint) can bypass them. The database filter makes the rule both fast and structural. (Also: <code>SELECT *</code> \u2014 the agent fetching everything, hoping something is needed.)',
        lens:'Business rules in application code are suggestions. Rules the database enforces (WHERE clauses, constraints) are laws.'
      },
      {
        type:'quiz',
        prompt:'<strong>11:45.</strong> Checkpoint 2, the batch job. The agent\u2019s code processes 40k invoices. Read the shape of it. Your review verdict?',
        code:{ lang:'js', text:"for (const inv of eligible) {\n  await db.run(\"UPDATE invoices SET client_name = NULL, client_email = NULL WHERE id = ?\", inv.id);\n  await db.run(\"INSERT INTO audit_log (user_id, invoice_id, action) VALUES (?,?, 'anonymized')\", ...);\n}\nawait db.run(\"UPDATE users SET anonymized_at = NOW() WHERE id = ?\", userId);" },
        options:[
          {text:'Approve \u2014 it updates and audits each invoice correctly', ok:false},
          {text:'Reject as-is: three writes per invoice, each its own implicit transaction \u2014 the batch can die halfway, leaving invoices anonymized with no audit entries (Module 4: what does the world look like if it dies between step 2 and 3?). Also no idempotency for retries, and one slow sequential loop', ok:true},
          {text:'Approve, but ask for progress-bar styling on the frontend', ok:false},
          {text:'Reject because for-loops are never allowed in production code', ok:false}
        ],
        explain:'The \u201cdies between step 2 and 3\u201d question indicts the whole shape: without a transaction boundary per invoice, a mid-batch crash produces invoices stripped of PII with zero audit entries \u2014 an unexplainable state. The fix: wrap each invoice\u2019s update + audit in one transaction, add an idempotency key (a retried batch skips already-anonymized rows), and process in chunks via the queue from the spec.',
        lens:'Multi-step writes without transactions aren\u2019t inefficiencies \u2014 they\u2019re future incidents with timestamps. (See: every Module 4 drill.)'
      },
      {
        type:'quiz',
        prompt:'<strong>14:00.</strong> The PR is open and green \u2014 all tests pass. You open the diff and find this hunk in <code>anonymize.test.ts</code>. What do you do?',
        code:{ lang:'diff', text:'- it("refuses to anonymize invoices newer than 90 days", async () => {\n-   const inv = await seedInvoice({ ageDays: 30 });\n-   await expect(anonymize([inv.id], user)).rejects.toThrow("not eligible");\n- });\n+ it("handles ineligible invoices gracefully", async () => {\n+   const inv = await seedInvoice({ ageDays: 30 });\n+   const res = await anonymize([inv.id], user);\n+   expect(res.skipped).toBeDefined();\n+ });' },
        options:[
          {text:'Merge \u2014 the new test is cleaner and still passes', ok:false},
          {text:'Stop the line: the guard on the 90-day legal rule was gutted \u2014 toBeDefined passes for any value, and \u201cgraceful\u201d means the job may now silently skip-and-report-success on ineligible invoices. Restore the assertion, watch it fail on the old code, then fix the underlying failure', ok:true},
          {text:'Ask the agent whether the change was intentional; if it says no, merge anyway', ok:false},
          {text:'Approve but add a TODO to strengthen the test next sprint', ok:false}
        ],
        explain:'This is the minus-line ambush from Module 6, aimed at the one test that guarded the legal constraint. <code>res.skipped</code> being defined proves nothing about <em>why</em> it was skipped \u2014 the exact failure (silently succeeding on ineligible invoices) now passes CI green. The ritual: restore the assertion, watch it fail on the current code (that proves the guard works), fix the real bug, watch it pass.',
        lens:'Green after a minus line is the most suspicious color in computing. When a test changes, ask what it stopped guarding.'
      },
      {
        type:'quiz',
        prompt:'<strong>15:40.</strong> Ready to ship. The agent offers to \u201cfinish the deployment\u201d: run the staging migration via CI, then \u2014 since it already has the CI token \u2014 \u201cjust apply the prod migration too, I\u2019ve verified it works.\u201d It reminds you Mika wants this live by 17:00. Your call?',
        options:[
          {text:'Let it \u2014 it verified the migration works, and the deadline is real', ok:false},
          {text:'Let it, but watch the logs closely during the migration', ok:false},
          {text:'Hold the human gate: agent ran staging via CI \u2014 good. Production applies through the pipeline\u2019s deploy step with a human approval, backup verified restorable this afternoon, rollback rehearsed, deploy behind a feature flag with a staged rollout. If 17:00 slips to 17:30, that\u2019s the cheaper outcome', ok:true},
          {text:'Run the prod migration yourself right now, without reviewing it, to save time', ok:false}
        ],
        explain:'Module 8 exists for exactly this 15:40 feeling. The agent \u201cverified\u201d staging \u2014 that\u2019s its job. Production is where blast radius lives: human gate (the team\u2019s own convention!), restorable backup, rehearsed rollback, flag-guarded rollout. A deadline met by bypassing gates is a deadline borrowed against an outage. 17:00 or 17:30 \u2014 the thirty minutes is the price of never being the war story.',
        lens:'The agent will always offer to close the last mile for you. The last mile is the steward\u2019s mile \u2014 that\u2019s not the agent being unhelpful, that\u2019s the job description.'
      },
      {
        type:'order',
        prompt:'<strong>16:50.</strong> Final steward\u2019s sequence for shipping the feature. Order it.',
        items:[
          'Verify each acceptance criterion one by one, with artifacts attached',
          'Run the full suite in CI: tests, type-check, lint \u2014 all green',
          'Human gate: you approve the production deploy (per team convention)',
          'Deploy behind the feature flag; enable for 5% of traffic',
          'Watch logs, error rate, and the audit table filling correctly',
          'Expand only when agreed safety checks pass and sample users can complete anonymization; otherwise pause the rollout',
          'Record release evidence and limitations; confirm who will compare the user outcome with the baseline and when'
        ],
        explain:'Verify criteria and CI before approval, deploy to a limited group before expanding, and observe both safety and task completion. A quiet error dashboard is not enough if nobody can complete the task. Record what the release checks establish and what still needs follow-up; a small rollout does not yet prove a lasting improvement for all users.',
        lens:'Safe deployment and useful outcomes need different evidence. Keep release gates, then follow through on the problem the change was meant to solve.'
      },
      {
        type:'quiz',
        prompt:'<strong>17:15.</strong> The feature is live and operational checks pass. Mika asks, “Did we solve the customer problem?” What is the most responsible response?',
        options:[
          {text:'Yes. The tests pass and the error rate is unchanged, so the customer problem is solved.', ok:false},
          {text:'Report verified behavior and what is still unknown. Agree that you and Mika will compare completion without support help against the baseline next week, and review user feedback. Record today’s near-misses and keep a named monitoring owner after handoff.', ok:true},
          {text:'Send the agent’s implementation summary as proof that customers benefited.', ok:false},
          {text:'The implementation is complete; whether it helps is now entirely the product team’s responsibility.', ok:false}
        ],
        explain:'The implementation can be correct without solving the customer problem. Early task completion is encouraging, but compare it with the starting point and gather enough observations before claiming improvement. Name an owner and a date, explain uncertainty, and adjust the solution if evidence disagrees. The miss log improves technical checks; user follow-up tests whether you chose the right solution.',
        lens:'Responsibility continues after deployment: communicate what you know, arrange the next check, and learn from the result rather than declaring victory from green tests.'
      }
    ]
  }
}
];

/* Make the data available to the app engine. */
if (typeof window !== 'undefined') {
  window.CURRICULUM = CURRICULUM;
}
