/* =============================================================================
   STAI RELEVANT — glossary
   -----------------------------------------------------------------------------
   Terms auto-tooltip on their first occurrence in any rendered view (lessons,
   drills, module pages) and appear on the #/glossary page.

   Entry shape:
     { id,                 // unique; used by data-gloss and the glossary page
       term,               // display name
       match,              // regex SOURCE (escaped string) used to find it
       cs,                 // optional: true = case-sensitive (for words like
                           //   GET/PUT that collide with English)
       def,                // one-or-two-sentence definition (plain text)
       steward,            // optional: the supervision takeaway
       links: [{ t, u }] } // authoritative sources, https only
============================================================================= */

window.GLOSSARY = [

/* ---------------------------------------------------------------- web ---- */
{
  id: 'api', term: 'API', match: '\\bAPIs?\\b',
  def: 'Application Programming Interface \u2014 a defined way for one piece of software to ask another for data or actions: endpoints, methods, inputs, outputs. It is a contract you can check, not a description you trust.',
  steward: 'Every API call an agent writes is a claim. Verify the method, the status codes, and what happens on retry against the real contract.',
  links: [
    { t: 'MDN \u2014 API', u: 'https://developer.mozilla.org/en-US/docs/Glossary/API' },
    { t: 'MDN \u2014 Web APIs', u: 'https://developer.mozilla.org/en-US/docs/Web/API' },
  ],
},
{
  id: 'sdk', term: 'SDK', match: '\\bSDKs?\\b',
  def: 'Software Development Kit \u2014 a packaged library plus tooling for a specific platform or service. The installed SDK and its type definitions are ground truth; the model\u2019s memory of it is not.',
  links: [
    { t: 'Wikipedia \u2014 SDK', u: 'https://en.wikipedia.org/wiki/Software_development_kit' },
  ],
},
{
  id: 'json', term: 'JSON', match: '\\bJSON\\b',
  def: 'JavaScript Object Notation \u2014 a text format for structured data: objects, arrays, strings, numbers, booleans, and null. The lingua franca of APIs.',
  links: [
    { t: 'json.org', u: 'https://www.json.org/json-en.html' },
    { t: 'RFC 8259', u: 'https://www.rfc-editor.org/rfc/rfc8259' },
  ],
},
{
  id: 'cors', term: 'CORS', match: '\\bCORS\\b',
  def: 'Cross-Origin Resource Sharing \u2014 the browser rules that decide whether a page may read a response from another origin. It is configured by the server; the client cannot fix it.',
  steward: 'The dangerous \u201cfix\u201d is reflecting any Origin with credentials allowed. The correct fix is an allowlist of trusted origins.',
  links: [
    { t: 'MDN \u2014 CORS', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS' },
    { t: 'Fetch spec \u2014 CORS protocol', u: 'https://fetch.spec.whatwg.org/#http-cors-protocol' },
  ],
},
{
  id: 'http', term: 'HTTP', match: '\\bHTTP\\b(?!\\/\\d)',
  def: 'The request/response protocol of the web: a method, URL, headers, and optional body go out; a status, headers, and optional body come back.',
  links: [
    { t: 'MDN \u2014 HTTP', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
    { t: 'RFC 9110', u: 'https://www.rfc-editor.org/rfc/rfc9110' },
  ],
},
{
  id: 'https', term: 'HTTPS', match: '\\bHTTPS\\b',
  def: 'HTTP over TLS \u2014 the same protocol, wrapped in encryption and server identity checks.',
  links: [
    { t: 'MDN \u2014 HTTPS', u: 'https://developer.mozilla.org/en-US/docs/Glossary/HTTPS' },
    { t: 'RFC 8446 \u2014 TLS 1.3', u: 'https://www.rfc-editor.org/rfc/rfc8446' },
  ],
},
{
  id: 'dns', term: 'DNS', match: '\\bDNS\\b',
  def: 'The internet\u2019s phone book: turns hostnames into IP addresses through a hierarchy of resolvers and caches.',
  links: [
    { t: 'MDN \u2014 DNS', u: 'https://developer.mozilla.org/en-US/docs/Glossary/DNS' },
    { t: 'Cloudflare \u2014 What is DNS?', u: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
  ],
},
{
  id: 'url', term: 'URL', match: '\\bURLs?\\b',
  def: 'Uniform Resource Locator \u2014 scheme, host, port, path, query, fragment. Each part can be a bug surface (wrong host, dropped query, leaked secret in a query string).',
  links: [
    { t: 'MDN \u2014 URL', u: 'https://developer.mozilla.org/en-US/docs/Glossary/URL' },
    { t: 'WHATWG URL standard', u: 'https://url.spec.whatwg.org/' },
  ],
},
{
  id: 'tcp', term: 'TCP', match: '\\bTCP\\b',
  def: 'The transport protocol that provides an ordered, reliable byte stream; HTTP rides on top of it. Connection setup costs a round trip before any data is sent.',
  links: [
    { t: 'MDN \u2014 TCP', u: 'https://developer.mozilla.org/en-US/docs/Glossary/TCP' },
    { t: 'RFC 9293', u: 'https://www.rfc-editor.org/rfc/rfc9293' },
  ],
},
{
  id: 'cookie', term: 'cookie', match: '\\bcookies?\\b',
  def: 'A small piece of data the server asks the browser to store and send back on later requests \u2014 the basis of sessions, and the reason CSRF matters.',
  links: [
    { t: 'MDN \u2014 Cookies', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies' },
    { t: 'RFC 6265', u: 'https://www.rfc-editor.org/rfc/rfc6265' },
  ],
},
{
  id: 'header', term: 'header', match: '\\bheaders?\\b',
  def: 'Key\u2013value metadata attached to a request or response: content type, caching, authentication, cookies.',
  links: [
    { t: 'MDN \u2014 HTTP headers', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers' },
  ],
},
{
  id: 'status', term: 'status code', match: '\\b[2-5]xx\\b|\\bstatus codes?\\b',
  def: 'A three-digit result class: 2xx success, 3xx redirect, 4xx client error, 5xx server error (5xx means the server broke, not you). A timeout is not a status code — the request\u2019s fate is unknown.',
  links: [
    { t: 'MDN \u2014 HTTP status', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status' },
    { t: 'RFC 9110 \u00a715', u: 'https://www.rfc-editor.org/rfc/rfc9110#name-status-codes' },
  ],
},
{
  id: 'get', term: 'GET', match: '\\bGET\\b', cs: true,
  def: 'The read method: no side effects, safe to repeat.',
  links: [{ t: 'MDN \u2014 GET', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET' }],
},
{
  id: 'post', term: 'POST', match: '\\bPOST\\b', cs: true,
  def: 'The create/trigger method: typically has side effects and is not idempotent. Two POSTs can mean two orders.',
  links: [{ t: 'MDN \u2014 POST', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/POST' }],
},
{
  id: 'put', term: 'PUT', match: '\\bPUT\\b', cs: true,
  def: 'Replace the resource at a URL with the payload. Repeating it lands in the same state, which makes it idempotent.',
  links: [{ t: 'MDN \u2014 PUT', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/PUT' }],
},
{
  id: 'delete', term: 'DELETE', match: '\\bDELETE\\b', cs: true,
  def: 'Remove the resource. Repeating is safe in effect, which is what idempotent means in practice.',
  links: [{ t: 'MDN \u2014 DELETE', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/DELETE' }],
},
{
  id: 'idempotent', term: 'idempotent', match: '\\bidempoten(t|cy)\\b',
  def: 'An operation that leaves the world in the same state whether it runs once or several times. GET, PUT, and DELETE usually are; POST usually is not unless designed to be.',
  links: [
    { t: 'MDN \u2014 Idempotent', u: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent' },
  ],
},
{
  id: 'idempotency-key', term: 'idempotency key', match: '\\bidempotency keys?\\b', prio: 1,
  def: 'A unique value attached to a request so the server can recognize a retry and ignore it. The standard fix for \u201ctimeout on a POST\u201d.',
  links: [
    { t: 'Stripe \u2014 Idempotent requests', u: 'https://docs.stripe.com/api/idempotent_requests' },
  ],
},
{
  id: 'same-origin', term: 'same-origin policy', match: '\\bsame-origin polic(y|ies)\\b', prio: 1,
  def: 'The browser\u2019s default rule: a page on one origin cannot read responses from another. CORS is a deliberate, server-controlled hole in this wall.',
  links: [
    { t: 'MDN \u2014 Same-origin policy', u: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy' },
  ],
},
{
  id: 'origin', term: 'origin', match: '\\borigins?\\b',
  def: 'Scheme + host + port \u2014 the browser\u2019s notion of \u201cwhere code came from\u201d. http://a.com and https://a.com are different origins.',
  links: [
    { t: 'MDN \u2014 Same-origin policy', u: 'https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy' },
  ],
},
{
  id: 'exponential-backoff', term: 'exponential backoff', match: '\\bexponential backoff\\b',
  def: 'Retrying with a delay that grows each attempt (plus jitter to avoid synchronized retry storms). Mandatory for retries \u2014 and still wrong around a non-idempotent POST.',
  links: [
    { t: 'AWS \u2014 Exponential backoff and jitter', u: 'https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/' },
  ],
},
{
  id: 'rate-limit', term: 'rate limit', match: '\\brate limits?\\b',
  def: 'A cap on requests per time window. It is why retries need backoff and jitter, and why batch endpoints exist.',
  links: [
    { t: 'Cloudflare \u2014 Rate limiting', u: 'https://developers.cloudflare.com/waf/rate-limiting-rules/' },
  ],
},
{
  id: 'policy', term: 'policy', match: '\\bpolic(y|ies)\\b',
  def: 'Rules a system enforces on requests or actors \u2014 IAM policies, content security policies, retention policies. A policy in code is enforceable; a policy in a document is a hope.',
  steward: 'Agents obey permissions, not intentions. If a rule must hold, encode it as a policy the system checks.',
  links: [
    { t: 'AWS \u2014 IAM policies', u: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html' },
    { t: 'MDN \u2014 Content Security Policy', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
  ],
},
{
  id: 'csp', term: 'Content Security Policy', match: '\\bContent Security Polic(y|ies)\\b', prio: 1,
  def: 'A response header that lists what a page may load and execute \u2014 a strong defense-in-depth guard against injected scripts.',
  links: [
    { t: 'MDN \u2014 CSP', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP' },
  ],
},
{
  id: 'environment-variable', term: 'environment variable', match: '\\benvironment variables?\\b',
  def: 'Named configuration passed to a process at launch. Server-side secrets belong here \u2014 and never in a bundle the browser downloads.',
  links: [
    { t: 'Wikipedia \u2014 Environment variable', u: 'https://en.wikipedia.org/wiki/Environment_variable' },
  ],
},

/* ------------------------------------------------------- language & code --- */
{
  id: 'typescript', term: 'TypeScript', match: '\\bTypeScript\\b',
  def: 'JavaScript plus a static type system checked before the code runs. It eliminates whole classes of errors \u2014 and proves nothing about intent.',
  links: [
    { t: 'TypeScript handbook', u: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
  ],
},
{
  id: 'type', term: 'type', match: '\\btypes?\\b',
  def: 'A classification of values \u2014 string, number, object \u2014 enforced by a compiler (static) or checked while running (dynamic).',
  links: [
    { t: 'TypeScript \u2014 Everyday types', u: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
    { t: 'MDN \u2014 JavaScript data types', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures' },
  ],
},
{
  id: 'value', term: 'value', match: '\\bvalues?\\b',
  def: 'A concrete piece of data. Primitive values (numbers, strings, booleans) are copied on assignment; objects are not.',
  links: [
    { t: 'MDN \u2014 JavaScript data types', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures' },
  ],
},
{
  id: 'reference', term: 'reference', match: '\\breferences?\\b',
  def: 'A pointer to an object or array. Assigning copies the pointer, not the object \u2014 the root of a whole family of mutation bugs.',
  links: [
    { t: 'MDN \u2014 Working with objects', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects' },
  ],
},
{
  id: 'strict-equality', term: '===', match: '===',
  def: 'Strict equality: compares value and type with no conversion. Prefer it to ==, which converts and produces haunted results.',
  links: [
    { t: 'MDN \u2014 Strict equality', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality' },
  ],
},
{
  id: 'field', term: 'field', match: '\\bfields?\\b',
  def: 'A named piece of data inside an object, a database row, or a form. Field-name mismatches (user_name vs userName) are a classic integration failure.',
  links: [
    { t: 'MDN \u2014 Working with objects', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects' },
  ],
},
{
  id: 'compiler', term: 'compiler', match: '\\bcompilers?\\b',
  def: 'A program that checks and translates source before it runs. It verifies that code is well-formed, not that it is correct.',
  links: [
    { t: 'MDN \u2014 Compile', u: 'https://developer.mozilla.org/en-US/docs/Glossary/Compile' },
  ],
},
{
  id: 'event-loop', term: 'event loop', match: '\\bevent loops?\\b',
  def: 'The scheduler behind JavaScript\u2019s concurrency: one thread, a queue of tasks, and microtasks (promises) that run between them. await yields control \u2014 which is where races live.',
  links: [
    { t: 'MDN \u2014 Event loop', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop' },
    { t: 'Node.js \u2014 Event loop guide', u: 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick' },
  ],
},
{
  id: 'promise', term: 'promise', match: '\\bpromises?\\b',
  def: 'An object representing a value that will exist later. It can be awaited, chained, or (unfortunately) ignored.',
  links: [
    { t: 'MDN \u2014 Promise', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise' },
  ],
},
{
  id: 'race-condition', term: 'race condition', match: '\\brace conditions?\\b',
  def: 'A bug whose result depends on timing: two operations interleave in a gap between read and write, and one result is silently lost.',
  steward: 'Ask of any concurrent agent code: what happens if two of these run at once? Prefer atomic operations and constraints over hopeful sequencing.',
  links: [
    { t: 'Wikipedia \u2014 Race condition', u: 'https://en.wikipedia.org/wiki/Race_condition' },
  ],
},
{
  id: 'concurrency', term: 'concurrency', match: '\\bconcurren(t|tly|cy)\\b',
  def: 'Making progress on multiple tasks by interleaving them \u2014 not the same as parallelism (executing at the same instant).',
  links: [
    { t: 'Wikipedia \u2014 Concurrency', u: 'https://en.wikipedia.org/wiki/Concurrency_(computer_science)' },
  ],
},

/* ------------------------------------------------------------- data ------ */
{
  id: 'sql', term: 'SQL', match: '\\bSQL\\b',
  def: 'Structured Query Language \u2014 the standard language for querying and changing relational data.',
  links: [
    { t: 'MDN \u2014 SQL', u: 'https://developer.mozilla.org/en-US/docs/Glossary/SQL' },
  ],
},
{
  id: 'relational-database', term: 'relational database', match: '\\brelational databases?\\b',
  def: 'A database organized as tables of rows and columns, with relationships enforced by keys.',
  links: [
    { t: 'Wikipedia \u2014 Relational database', u: 'https://en.wikipedia.org/wiki/Relational_database' },
  ],
},
{
  id: 'primary-key', term: 'primary key', match: '\\bprimary keys?\\b',
  def: 'The column or columns that uniquely identify each row in a table.',
  links: [
    { t: 'PostgreSQL \u2014 Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
  ],
},
{
  id: 'foreign-key', term: 'foreign key', match: '\\bforeign keys?\\b',
  def: 'A column that references another table\u2019s primary key, making it impossible (if enforced) to point at a row that does not exist.',
  links: [
    { t: 'PostgreSQL \u2014 Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
  ],
},
{
  id: 'index', term: 'index', match: '\\bind(ex|exes|exing|exed)\\b',
  def: 'A lookup structure \u2014 usually a B-tree \u2014 that turns a full-table scan into a direct lookup. It costs a little on writes and can be the difference between 5 ms and 5 seconds.',
  steward: 'For any new column a query filters on, ask: where is the index? Agents almost never add one unprompted.',
  links: [
    { t: 'Use The Index, Luke!', u: 'https://use-the-index-luke.com/' },
    { t: 'PostgreSQL \u2014 Indexes', u: 'https://www.postgresql.org/docs/current/indexes.html' },
  ],
},
{
  id: 'transaction', term: 'transaction', match: '\\btransactions?\\b',
  def: 'A group of statements that either all commit or all roll back. The unit that keeps half-finished multi-step writes out of your database.',
  links: [
    { t: 'PostgreSQL \u2014 Transactions', u: 'https://www.postgresql.org/docs/current/tutorial-transactions.html' },
  ],
},
{
  id: 'acid', term: 'ACID', match: '\\bACID\\b',
  def: 'Atomicity, Consistency, Isolation, Durability \u2014 the guarantees transactions are designed to provide.',
  links: [
    { t: 'Wikipedia \u2014 ACID', u: 'https://en.wikipedia.org/wiki/ACID' },
  ],
},
{
  id: 'wal', term: 'WAL', match: '\\bWAL\\b',
  def: 'Write-ahead log: changes are appended and flushed to disk before a commit is acknowledged, which is what makes crash recovery and durability possible.',
  links: [
    { t: 'PostgreSQL \u2014 WAL', u: 'https://www.postgresql.org/docs/current/wal-intro.html' },
  ],
},
{
  id: 'mvcc', term: 'MVCC', match: '\\bMVCC\\b',
  def: 'Multi-version concurrency control: readers see a consistent snapshot while writers keep writing, instead of blocking each other.',
  links: [
    { t: 'PostgreSQL \u2014 MVCC', u: 'https://www.postgresql.org/docs/current/mvcc-intro.html' },
  ],
},
{
  id: 'explain', term: 'EXPLAIN', match: '\\bEXPLAIN\\b', cs: true,
  def: 'Ask the database how it plans to run a query: scan type, index use, estimated cost. The fastest way to turn \u201cit works\u201d into \u201cit works at scale\u201d.',
  links: [
    { t: 'PostgreSQL \u2014 EXPLAIN', u: 'https://www.postgresql.org/docs/current/sql-explain.html' },
  ],
},
{
  id: 'n-plus-one', term: 'N+1', match: 'N\\+1',
  def: 'One query for a list, then one (or more) queries per row. A hundred-item page quietly becomes hundreds of round trips. The classic loop that looks like clean code.',
  links: [
    { t: 'Use The Index, Luke!', u: 'https://use-the-index-luke.com/' },
  ],
},
{
  id: 'orm', term: 'ORM', match: '\\bORMs?\\b',
  def: 'Object\u2013Relational Mapping \u2014 a library that turns rows into objects. Convenient, and it hides the SQL and the query count doing the damage.',
  links: [
    { t: 'Wikipedia \u2014 ORM', u: 'https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping' },
  ],
},
{
  id: 'migration', term: 'migration', match: '\\bmigrations?\\b',
  def: 'A versioned schema change applied to a database. Often irreversible, sometimes table-locking, and always worth reviewing before it runs \u2014 not after.',
  links: [
    { t: 'Prisma \u2014 Migrate', u: 'https://www.prisma.io/docs/orm/prisma-migrate' },
  ],
},
{
  id: 'caching', term: 'cache', match: '\\bcach(e|es|ed|ing)\\b',
  def: 'Storing a computed result for faster reuse \u2014 gaining speed at the risk of serving stale data. Cache invalidation is the part agents decide silently.',
  steward: '\u201cI added caching for performance\u201d is a trade you did not approve. Ask for the invalidation policy and who pays for stale data.',
  links: [
    { t: 'MDN \u2014 HTTP caching', u: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching' },
  ],
},

/* --------------------------------------------- architecture & process --- */
{
  id: 'feature-flag', term: 'feature flag', match: '\\bfeature flags?\\b',
  def: 'A switch that turns code on or off without redeploying. Great for staged rollout; a combinatorial testing liability when flags rot.',
  links: [
    { t: 'Martin Fowler \u2014 Feature toggles', u: 'https://martinfowler.com/articles/feature-toggles.html' },
  ],
},
{
  id: 'lockfile', term: 'lockfile', match: '\\blockfiles?\\b',
  def: 'A generated file pinning exact dependency versions so every install is reproducible. Treat changes to it as code, not noise.',
  links: [
    { t: 'npm \u2014 package-lock.json', u: 'https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json' },
  ],
},
{
  id: 'ci', term: 'CI', match: '\\bCI\\b', cs: true,
  def: 'Continuous Integration \u2014 automatically building and testing every change. The machine checking the machine, with no opinions and no mercy.',
  links: [
    { t: 'Martin Fowler \u2014 Continuous Integration', u: 'https://martinfowler.com/articles/continuousIntegration.html' },
    { t: 'GitHub Actions', u: 'https://docs.github.com/en/actions' },
  ],
},
{
  id: 'test', term: 'test', match: '\\btest(s|ed|ing)?\\b',
  def: 'An executable expectation. A test\u2019s value equals what it would catch if the code were wrong \u2014 not how green the suite looks.',
  links: [
    { t: 'Martin Fowler \u2014 Test pyramid', u: 'https://martinfowler.com/bliki/TestPyramid.html' },
  ],
},
{
  id: 'coverage', term: 'coverage', match: '\\bcoverage\\b',
  def: 'Which lines of code ran during tests. Useful as a map of what was never executed \u2014 not as evidence of correctness.',
  links: [
    { t: 'Martin Fowler \u2014 Test coverage', u: 'https://martinfowler.com/bliki/TestCoverage.html' },
  ],
},
{
  id: 'mutation-testing', term: 'mutation testing', match: '\\bmutation testing\\b', prio: 1,
  def: 'Deliberately mutating code and checking that tests fail. Measures whether tests detect change, not just whether they run.',
  links: [
    { t: 'Stryker Mutator', u: 'https://stryker-mutator.io/' },
  ],
},
{
  id: 'code-review', term: 'code review', match: '\\bcode reviews?\\b',
  def: 'Reading a change for correctness and risk before it merges. The human gate that makes agent-speed development survivable.',
  links: [
    { t: 'Google \u2014 Code review', u: 'https://google.github.io/eng-practices/review/' },
  ],
},
{
  id: 'coupling', term: 'coupling', match: '\\bcoupl(ed|ing|es)\\b',
  def: 'How much one module depends on another\u2019s internals. Lower coupling means changes stay local instead of rippling.',
  links: [
    { t: 'Wikipedia \u2014 Coupling', u: 'https://en.wikipedia.org/wiki/Coupling_(computer_programming)' },
  ],
},
{
  id: 'cohesion', term: 'cohesion', match: '\\bcohesion\\b',
  def: 'How focused a module\u2019s responsibilities are. High cohesion means the refund rule lives in one place you can find.',
  links: [
    { t: 'Wikipedia \u2014 Cohesion', u: 'https://en.wikipedia.org/wiki/Cohesion_(computer_science)' },
  ],
},
{
  id: 'layering', term: 'layering', match: '\\blayers?\\b|\\blayering\\b',
  def: 'Organizing code into UI, service, and data layers with dependencies pointing inward. The direction is what keeps change cheap.',
  links: [
    { t: 'Martin Fowler \u2014 Layering', u: 'https://martinfowler.com/bliki/PresentationDomainDataLayering.html' },
  ],
},
{
  id: 'module', term: 'module', match: '\\bmodules?\\b',
  def: 'A unit of code with its own imports and exports. The edges between modules form the dependency graph your architecture lives in.',
  links: [
    { t: 'MDN \u2014 JavaScript modules', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' },
    { t: 'Node.js \u2014 Modules', u: 'https://nodejs.org/api/modules.html' },
  ],
},
{
  id: 'least-privilege', term: 'least privilege', match: '\\bleast privilege\\b',
  def: 'Give every actor only the access it needs, for only as long as it needs it. The first containment principle for working with agents.',
  steward: 'Before delegating, answer: what is the worst thing this actor could do with its current credentials? Then shrink that answer.',
  links: [
    { t: 'Wikipedia \u2014 Principle of least privilege', u: 'https://en.wikipedia.org/wiki/Principle_of_least_privilege' },
    { t: 'AWS \u2014 IAM policies', u: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html' },
  ],
},
{
  id: 'sandbox', term: 'sandbox', match: '\\bsandbox(es|ed|ing)?\\b',
  def: 'An isolated environment that limits what code can see and do: namespaces for visibility, cgroups for resources, seccomp for syscalls, mounts and network rules for reach.',
  links: [
    { t: 'man7 \u2014 namespaces', u: 'https://man7.org/linux/man-pages/man7/namespaces.7.html' },
    { t: 'Docker \u2014 Engine security', u: 'https://docs.docker.com/engine/security/' },
  ],
},

/* ------------------------------------------------------- UX & product ---- */
{
  id: 'ux', term: 'UX', match: '\\bUX\\b', cs: true,
  def: 'User Experience \u2014 how it actually feels to use the product: flow, clarity, friction, and error recovery. The part no diff shows.',
  links: [
    { t: 'NN/g \u2014 Definition of UX', u: 'https://www.nngroup.com/articles/definition-user-experience/' },
  ],
},
{
  id: 'ui', term: 'UI', match: '\\bUI\\b', cs: true,
  def: 'User Interface \u2014 the visible surface: layout, components, and every state they can be in (loading, empty, error, overflowing).',
  links: [
    { t: 'Wikipedia \u2014 User interface', u: 'https://en.wikipedia.org/wiki/User_interface' },
  ],
},
{
  id: 'accessibility', term: 'accessibility', match: '\\baccessibilit(y|ies)\\b|\\ba11y\\b',
  def: 'Building so people with disabilities can use the product: semantics, contrast, keyboard, screen readers. WCAG is the standard.',
  links: [
    { t: 'MDN \u2014 Accessibility', u: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility' },
    { t: 'W3C \u2014 WCAG', u: 'https://www.w3.org/WAI/standards-guidelines/wcag/' },
  ],
},

/* ------------------------------------------------------- numbers & time -- */
{
  id: 'utf8', term: 'UTF-8', match: '\\bUTF-8\\b|\\butf8\\b',
  def: 'The dominant Unicode encoding: characters are one to four bytes. \u201cCharacter count\u201d and \u201cbyte length\u201d are different lengths.',
  links: [
    { t: 'RFC 3629', u: 'https://www.rfc-editor.org/rfc/rfc3629' },
  ],
},
{
  id: 'floating-point', term: 'floating point', match: '\\bfloating[- ]points?\\b|\\bfloats?\\b',
  def: 'Binary approximation of decimals \u2014 0.1 + 0.2 is famously not 0.3. Never store money in floating point; use integers of minor units or decimal types.',
  links: [
    { t: 'Goldberg \u2014 What every computer scientist should know', u: 'https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html' },
    { t: 'Wikipedia \u2014 Double precision', u: 'https://en.wikipedia.org/wiki/Double-precision_floating-point_format' },
  ],
},
{
  id: 'utc', term: 'UTC', match: '\\bUTC\\b',
  def: 'Coordinated Universal Time \u2014 the reference clock. Store timestamps in UTC, convert to local time only at the edges.',
  links: [
    { t: 'Wikipedia \u2014 Coordinated Universal Time', u: 'https://en.wikipedia.org/wiki/Coordinated_Universal_Time' },
  ],
},

/* --------------------------------------------------------------- LLMs ---- */
{
  id: 'llm', term: 'LLM', match: '\\bLLMs?\\b',
  def: 'Large Language Model \u2014 a neural network trained to predict the next token. It generates fluent continuations; it does not verify them.',
  steward: 'Fluency is not evidence. Anything the model states about your system is a claim until you check it against docs, code, or a running system.',
  links: [
    { t: 'Wikipedia \u2014 Large language model', u: 'https://en.wikipedia.org/wiki/Large_language_model' },
    { t: 'Attention Is All You Need (2017)', u: 'https://arxiv.org/abs/1706.03762' },
  ],
},
{
  id: 'token', term: 'token', match: '\\btokens?\\b',
  def: 'The unit a model reads and writes: roughly three quarters of an English word, with code often split into several tokens per identifier. (An auth \u201ctoken\u201d is an unrelated concept.)',
  links: [
    { t: 'OpenAI \u2014 Tokenizer', u: 'https://platform.openai.com/tokenizer' },
  ],
},
{
  id: 'context-window', term: 'context window', match: '\\bcontext windows?\\b|\\bcontexts?\\b',
  def: 'The fixed token budget a model can attend to in one call: prompt, rules, open files, tool output, and its own answer all compete for it. When it fills, instructions decay \u2014 studies find models lose material in the middle.',
  steward: 'Short, fresh sessions with a written spec beat one long conversation. Context is a resource you spend, not a container that remembers.',
  links: [
    { t: 'Lost in the Middle (Liu et al.)', u: 'https://arxiv.org/abs/2307.03172' },
    { t: 'OpenAI \u2014 Prompt engineering guide', u: 'https://platform.openai.com/docs/guides/prompt-engineering' },
  ],
},
{
  id: 'hallucination', term: 'hallucination', match: '\\bhallucinat(e|es|ed|ion|ions|ing)\\b',
  def: 'Confident, fluent output that is not true \u2014 the predictable result of optimizing for plausible continuation rather than verification.',
  links: [
    { t: 'Wikipedia \u2014 Hallucination (AI)', u: 'https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)' },
  ],
},
{
  id: 'temperature', term: 'temperature', match: '\\btemperature\\b',
  def: 'A sampling parameter trading repeatability for variety. Higher means more random; low is more focused but never fully deterministic across runs and versions.',
  links: [
    { t: 'Hugging Face \u2014 How to generate text', u: 'https://huggingface.co/blog/how-to-generate' },
  ],
},
{
  id: 'transformer', term: 'transformer', match: '\\btransformers?\\b',
  def: 'The 2017 architecture behind modern LLMs: attention over sequences, trained at massive scale. The paper is surprisingly readable.',
  links: [
    { t: 'Attention Is All You Need (2017)', u: 'https://arxiv.org/abs/1706.03762' },
  ],
},
{
  id: 'rlhf', term: 'RLHF', match: '\\bRLHF\\b',
  def: 'Reinforcement Learning from Human Feedback \u2014 tuning a model toward answers humans rate highly. Part of why models sound agreeable, and part of how they became useful.',
  links: [
    { t: 'InstructGPT (2022)', u: 'https://arxiv.org/abs/2203.02155' },
    { t: 'Wikipedia \u2014 RLHF', u: 'https://en.wikipedia.org/wiki/Reinforcement_learning_from_human_feedback' },
  ],
},
{
  id: 'agent', term: 'agent', match: '\\bagents?\\b',
  def: 'A model plus a loop plus tools: it observes, plans, acts (reads files, runs commands, calls APIs), and repeats until it decides it is done. Agency multiplies both leverage and blast radius.',
  steward: 'The loop is what makes an agent useful and what makes containment non-optional. Permissions are the difference between a tool and a hazard.',
  links: [
    { t: 'Anthropic \u2014 Building effective agents', u: 'https://www.anthropic.com/research/building-effective-agents' },
  ],
},
{
  id: 'tool-use', term: 'tool use', match: '\\btool use\\b|\\btool calls?\\b|\\bfunction calling\\b',
  def: 'Letting a model call real functions \u2014 read a file, run a command, hit an API \u2014 with real side effects. The permission model around tools is the guardrail.',
  links: [
    { t: 'OpenAI \u2014 Function calling', u: 'https://platform.openai.com/docs/guides/function-calling' },
  ],
},
{
  id: 'prompt-injection', term: 'prompt injection', match: '\\bprompt injections?\\b',
  def: 'Untrusted text \u2014 a web page, an issue, a dependency README \u2014 containing instructions the agent may follow. The defining security risk of tool-using agents, and it is not solved.',
  steward: 'Treat every input an agent reads as potentially hostile: least privilege, human gates on irreversible actions, and never let untrusted content hold authority.',
  links: [
    { t: 'OWASP \u2014 LLM01 Prompt injection', u: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
    { t: 'Simon Willison \u2014 Prompt injection', u: 'https://simonwillison.net/tags/prompt-injection/' },
  ],
},

/* ------------------------------------------------------------ misc ------ */
{
  id: 'diff', term: 'diff', match: '\\bdiffs?\\b',
  def: 'A line-by-line comparison of before and after. In the agent era, the diff is the primary artifact of review \u2014 what changed is the contract.',
  links: [
    { t: 'Google \u2014 Code review', u: 'https://google.github.io/eng-practices/review/' },
  ],
},
{
  id: 'deployment', term: 'deploy', match: '\\bdeploys?\\b|\\bdeploy(s|ed|ing|ment)\\b',
  def: 'Shipping code to an environment users can reach. The moment every earlier verification claim meets reality.',
  links: [
    { t: 'GitHub Actions \u2014 Deployments', u: 'https://docs.github.com/en/actions' },
  ],
},
{
  id: 'staging', term: 'staging', match: '\\bstaging\\b',
  def: 'An environment that mirrors production closely enough to rehearse risky changes. \u201cIt worked on my machine\u201d is not staging.',
  links: [
    { t: 'Martin Fowler \u2014 Continuous Integration', u: 'https://martinfowler.com/articles/continuousIntegration.html' },
  ],
},
{
  id: 'rollback', term: 'rollback', match: '\\brollback\\b',
  def: 'Undoing a change safely. The question to answer before shipping: what exactly do we run, and how long does it take?',
  links: [
    { t: 'Martin Fowler \u2014 Blue-green deployment', u: 'https://martinfowler.com/bliki/BlueGreenDeployment.html' },
  ],
},
{
  id: 'monitoring', term: 'monitoring', match: '\\bmonitor(ing|ed|s)?\\b|\\bobservability\\b',
  def: 'Logs, metrics, and traces \u2014 the product\u2019s vital signs. Observability is how \u201cit deployed fine\u201d becomes evidence.',
  links: [
    { t: 'Google SRE \u2014 Monitoring', u: 'https://sre.google/sre-book/monitoring-distributed-systems/' },
  ],
},
{
  id: 'regression', term: 'regression', match: '\\bregressions?\\b',
  def: 'A behavior that used to work and no longer does. Regression tests exist to make sure fixes stay fixed.',
  links: [
    { t: 'Wikipedia \u2014 Regression testing', u: 'https://en.wikipedia.org/wiki/Regression_testing' },
  ],
},

/* ------------------------------------------- deep-dive vocabulary (v1.1) -- */
{
  id: 'database', term: 'database', match: '\\bdatabases?\\b',
  def: 'An organized store of data managed by a database engine. Relational databases keep data in tables with rows, columns, keys, and constraints — and answer queries fast because of indexes and a query planner.',
  links: [
    { t: 'PostgreSQL — Tutorial', u: 'https://www.postgresql.org/docs/current/tutorial.html' },
    { t: 'Wikipedia — Database', u: 'https://en.wikipedia.org/wiki/Database' },
  ],
},
{
  id: 'middleware', term: 'middleware', match: '\\bmiddleware\\b',
  def: 'Code that sits between the request and your handler and runs on every request: authentication, logging, CORS headers, rate limiting. The place where cross-cutting rules live — and where security bugs hide.',
  links: [
    { t: 'Wikipedia — Middleware', u: 'https://en.wikipedia.org/wiki/Middleware' },
  ],
},
{
  id: 'load-balancer', term: 'load balancer', match: '\\bload balancers?\\b',
  def: 'The component in front of your servers that spreads requests across them, health-checks them, and terminates connections. To a client, it looks like one server.',
  links: [
    { t: 'Cloudflare — What is load balancing?', u: 'https://www.cloudflare.com/learning/performance/what-is-load-balancing/' },
  ],
},
{
  id: 'ttl', term: 'TTL', match: '\\bTTLs?\\b',
  def: 'Time to live — how long a cached answer (DNS record, CDN object, cache entry) may be reused before it must be refreshed. The knob that decides how stale “real-time” data can be.',
  links: [
    { t: 'Cloudflare — Time to live', u: 'https://www.cloudflare.com/learning/cdn/glossary/time-to-live-ttl/' },
  ],
},
{
  id: 'whatwg', term: 'WHATWG', match: '\\bWHATWG\\b',
  def: 'The Web Hypertext Application Technology Working Group — the standards body that maintains the HTML and URL specifications. Because of it, “what a URL is” is precise and testable.',
  links: [
    { t: 'WHATWG', u: 'https://whatwg.org/' },
    { t: 'WHATWG — URL standard', u: 'https://url.spec.whatwg.org/' },
  ],
},
{
  id: 'parse', term: 'parse', match: '\\bpars(e|es|ed|ing|er|ers)\\b',
  def: 'To read raw text and turn it into structured data — JSON into objects, HTML into a DOM, source code into a syntax tree. Parsing checks form, not meaning.',
  links: [
    { t: 'Wikipedia — Parsing', u: 'https://en.wikipedia.org/wiki/Parsing' },
  ],
},
{
  id: 'subresource', term: 'subresource', match: '\\bsubresources?\\b',
  def: 'Everything a page needs beyond the HTML itself: scripts, styles, images, fonts, API calls. Each one is another request, another failure point, and another thing that can be cached or stale.',
  links: [
    { t: 'MDN — How browsers work', u: 'https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work' },
  ],
},
{
  id: 'render', term: 'render', match: '\\brenders?\\b|\\brendering\\b|\\brendered\\b',
  def: 'To turn data into what a person sees: the browser lays out and paints HTML/CSS; a framework renders components into the DOM. It happens after all the parsing and fetching — and it is where wrong data becomes visible.',
  links: [
    { t: 'MDN — How browsers work', u: 'https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work' },
  ],
},
{
  id: 'latency', term: 'latency', match: '\\blatenc(y|ies)\\b',
  def: 'The time for one round trip: from asking to hearing back. Dominated by distance and queues, not by how fast your code is — the reason N+1 loops hurt even on fast machines.',
  links: [
    { t: 'Cloudflare — What is latency?', u: 'https://www.cloudflare.com/learning/performance/glossary/what-is-latency/' },
  ],
},
{
  id: 'bandwidth', term: 'bandwidth', match: '\\bbandwidth\\b',
  def: 'How much data can flow per second — as opposed to how long one exchange takes (latency). A big pipe with a long way to travel is still slow for interactive work.',
  links: [
    { t: 'Cloudflare — What is bandwidth?', u: 'https://www.cloudflare.com/learning/performance/glossary/what-is-bandwidth/' },
  ],
},
{
  id: 'pretraining', term: 'pretraining', match: '\\bpre-?training\\b',
  def: 'The first, largest phase of training a language model: predict the next token across enormous amounts of text. It is where general fluency comes from — and why the model knows syntax better than it knows your system.',
  links: [
    { t: 'Wikipedia — Large language model', u: 'https://en.wikipedia.org/wiki/Large_language_model' },
    { t: 'Attention Is All You Need (2017)', u: 'https://arxiv.org/abs/1706.03762' },
  ],
},
{
  id: 'shape', term: 'shape', match: '\\bshapes?\\b',
  def: 'The structural properties a type checker verifies: names, types, argument counts. A program can be perfectly shaped and still do the wrong thing — shape is not meaning.',
  links: [
    { t: 'MDN — Grammar and types', u: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types' },
    { t: 'TypeScript — Everyday types', u: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html' },
  ],
},
{
  id: 'atomic', term: 'atomic', match: '\\batomic(ity|ally)?\\b',
  def: 'Indivisible: it happens completely or not at all, with no gap for anything else to run. The property that makes read-modify-write safe and races impossible.',
  links: [
    { t: 'Wikipedia — ACID', u: 'https://en.wikipedia.org/wiki/ACID' },
  ],
},
{
  id: 'constraint', term: 'constraint', match: '\\bconstraints?\\b',
  def: 'A rule the system enforces by itself: NOT NULL, UNIQUE, FOREIGN KEY, and CHECK in a database; bounds and types in code. Constraints make invalid states impossible instead of relying on everyone to remember.',
  links: [
    { t: 'PostgreSQL — Constraints', u: 'https://www.postgresql.org/docs/current/ddl-constraints.html' },
  ],
},
{
  id: 'acceptance-criteria', term: 'acceptance criteria', match: '\\bacceptance criter(ia|ion)\\b',
  def: 'The checkable statements that define done — each one passes or fails. The bridge between a human’s intent and a machine’s instructions, and the test list written first.',
  links: [
    { t: 'Wikipedia — Acceptance testing', u: 'https://en.wikipedia.org/wiki/Acceptance_testing' },
    { t: 'Cucumber — Gherkin reference', u: 'https://cucumber.io/docs/gherkin/reference/' },
  ],
},
{
  id: 'schema', term: 'schema', match: '\\bschemas?\\b',
  def: 'The structure of stored data: which tables exist, which columns, which types, which relationships. Changing it is a migration; breaking it silently breaks everything that reads it.',
  links: [
    { t: 'PostgreSQL — Data definition', u: 'https://www.postgresql.org/docs/current/ddl.html' },
  ],
},
{
  id: 'artifact', term: 'artifact', match: '\\b(verifiable )?artifacts?\\b',
  def: 'A concrete byproduct you can inspect: a diff, a test run, a log line, a screenshot, a database row. A “verifiable artifact” is one anyone can check independently — “it works” is an adjective, not an artifact.',
  links: [
    { t: 'Wikipedia — Artifact (software development)', u: 'https://en.wikipedia.org/wiki/Artifact_(software_development)' },
  ],
},
];
