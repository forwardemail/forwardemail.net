/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Spam Scanner (https://spamscanner.net) for inbound (MX) and outbound (SMTP
// and API) mail.
//
// It runs in monitor mode (SPAM_SCANNER_MONITOR_ONLY, on unless explicitly
// false): nothing it or the language model finds rejects, blocks, defers or
// files a message as spam, inbound or outbound, nor does a scan that fails.
// A message it would mark as spam or block is written to the console
// ("[SPAM_SCANNER]") with the results, envelope sender, From address and
// subject, and inbound mail gets X-Spam-Scanner-* headers with the result.
// Out of monitor mode, outbound mail is blocked for a virus, the
// GTUBE test string or a phishing or malware link, and by the domain's Spam
// Scanner settings (`protectionOf`) for a program attachment (on by
// default) or an adult link (off by default)
// (`getOutboundBlockingMessages`), and outbound spam
// is rejected only with SPAM_SCANNER_OUTBOUND_MONITOR_ONLY=false as well.
//
// A scan can never break or hold up delivery:
//
//  - scans run in worker threads (`helpers/spam-scanner-worker.js`): parsing
//    and the classifier are CPU work, which would otherwise hold up every
//    SMTP session of the process
//  - the message goes on without a result once a scan takes longer than its
//    time limit: a scan that decides something (outbound, out of monitor
//    mode) is stopped by terminating its worker (a new one takes its place);
//    one that only logs is not waited for, and is stopped only after
//    `HARD_LIMIT` time limits (a new worker would only hold up the next)
//  - `scan()` never throws: an error, a timeout or a skipped scan resolve to
//    `null` (out of monitor mode, an outbound message without a result is
//    held back, see `holdUnchecked`)
//  - messages over `maxSize` that only log, and any that arrive while
//    `maxQueue` scans are waiting, are not scanned (so a burst of outbound
//    mail is answered at once, with a temporary error out of monitor mode,
//    or queued unchecked in it, rather than after waiting a time limit);
//    nor are those that only log and would wait longer for a worker than
//    they could finish in (`isOverloaded`), or whose time limit passes
//    before a worker starts them (no worker is stopped for one)
//  - each worker has a memory limit, and runs one scan at a time
//
// Link hosts are looked up on the main thread through Tangerine (cached in
// Redis like every other lookup) instead of the system resolver.
//

const path = require('node:path');
const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');
const { setImmediate } = require('node:timers/promises');
const { MessageChannel } = require('node:worker_threads');

const ipaddr = require('ipaddr.js');
const ms = require('ms');

const config = require('#config');
const createFamilyResolver = require('#helpers/create-family-resolver');
const createTangerine = require('#helpers/create-tangerine');
const logger = require('#helpers/logger');
const lookupName = require('#helpers/lookup-name');
const parseRootDomain = require('#helpers/parse-root-domain');
const printable = require('#helpers/printable');
const createStats = require('#helpers/spam-scanner-stats');
const withDeadline = require('#helpers/with-deadline');
const {
  getLearnedVersion,
  loadLearned
} = require('#helpers/spam-scanner-learned');

const { createSecurityResolver, FAMILY_SERVERS, SECURITY_SERVERS } =
  createFamilyResolver;

// Cloudflare's resolvers that answer 0.0.0.0 for blocked names, which
// Spam Scanner asks (its `CLOUDFLARE_MALWARE` and `CLOUDFLARE_FAMILY`)
const CLOUDFLARE_MALWARE = new Set(SECURITY_SERVERS);
const CLOUDFLARE_FAMILY = new Set(FAMILY_SERVERS);

// the link hosts of an outbound message that are looked up: a message
// linking to more is blocked, so none can be put out of reach of the check
// (each host is two lookups, cached in Redis; ordinary mail links to far fewer)
const OUTBOUND_MAX_HOSTS = 250;

// a scan that only logs is stopped once it has run this many of its time
// limits (the caller stops waiting for it after one), or as soon as another
// scan waits for a worker once it has itself run one time limit since it
// started (not counting its wait for a worker), on a worker that had
// scanned before (not one loading the classifier with its first scan, which
// a worker started again would only have to do again): a message that takes
// Spam Scanner far longer than any other, e.g. HTML nested many thousands
// deep, would otherwise hold up every scan behind it until then
const HARD_LIMIT = 3;

// how often a scan past its time limit checks whether another waits for it
const CROWD_CHECK = 100;

// how long after its time limit a scan that only logs and has not started
// is taken out of the queue (its worker may have just got it); one a worker
// has got by then is left to it, which skips it, see `deadline`
const QUEUE_GRACE = 100;

// lookup errors that are answers: the name or its A record does not exist,
// or the resolver could not get an answer for it upstream (SERVFAIL: a lame
// delegation, broken DNSSEC, which fails the same way every time);
// Cloudflare's resolvers say a name is blocked with 0.0.0.0, and do so by the
// name before asking upstream, so none of these is a block (a resolver that
// refuses to answer, or cannot read the question, has not said whether the
// name is blocked: that lookup failed)
const DNS_ANSWERS = new Set(['ENOTFOUND', 'ENODATA', 'ESERVFAIL']);

// SERVFAIL answers are logged, with how many there were, once an hour at
// most (many at once may be an outage of the resolvers themselves)
const SERVFAIL_WARN_INTERVAL = ms('1h');
let servfailWarnAt = 0;
let servfailsSinceWarn = 0;

// a link lookup that failed (a timeout, a refused or failed connection,
// REFUSED...) is not asked again for this long: each message linking to it
// would otherwise wait for it to time out again (the host is not looked up,
// so its links are not all checked, as when a lookup fails; nothing of it is
// kept in Redis); by name only, never for a whole resolver, as a sender can
// make lookups of names of their own time out, which must not leave the
// links of other messages unchecked
const LOOKUP_RETRY = ms('1m');
// (by resolver and name)
const failedLookups = new Map();

// the language model is not asked for this long once it could not be
// reached (no answer in time, a refused or failed connection, busy, a
// missing model or a server error), twice as long each time it still cannot
// be after that, up to `LLM_BACKOFF_MAX`, and again as soon as it answers
// (e.g. before Ollama is installed, each scan would otherwise wait for it)
const LLM_BACKOFF = ms('30s');
const LLM_BACKOFF_MAX = ms('5m');
// (said once every this long at most, with how many times it failed; a
//  refused connection, i.e. nothing listening, e.g. before Ollama is
//  installed, is said once until it answers)
const LLM_WARN_INTERVAL = ms('10m');
const LLM_REFUSED = /\beconnrefused\b/i;
const LLM_UNREACHABLE =
  /\b(?:econnrefused|econnreset|econnaborted|ehostunreach|enetunreach|ehostdown|etimedout|epipe|eai_again|enotfound)\b|socket hang up|timed? ?out|busy|overloaded|^http (?:404|5\d\d)\b/i;
let llmPausedUntil = 0;
let llmBackoff = LLM_BACKOFF;
let llmFailures = 0;
let llmWarnAt = 0;
let llmRefusedSaid = false;

// whether Ollama on this server is ready to be asked: running, with the
// model loaded (as GET /api/ps says, within `LLM_CHECK_TIMEOUT`), asked in
// the background every `LLM_CHECK_INTERVAL` (and once a minute while it has
// not been, so a server without it is not asked often); a scan never waits
// for it, and goes on without the language model until it is (e.g. before
// Ollama is installed, while it starts or loads the model, or when it
// stops), so a server without it scans as fast as with it off; one on
// another machine, or a provider other than Ollama, is taken as ready, and
// asked as `LLM_BACKOFF` says
const LLM_CHECK_INTERVAL = ms('15s');
const LLM_CHECK_RETRY = ms('1m');
const LLM_CHECK_TIMEOUT = ms('2s');
let llmCheck = { key: '', ready: false, at: 0, pending: null, every: 0 };
// (each reason it is not ready is said once until it is, and no more often
//  than `LLM_WARN_INTERVAL`)
let llmNotReadySaid = '';
let llmNotReadyWarnAt = 0;

// the warnings logged for a message (not scanned, not finished in time,
// timed out) are logged once a minute at most each, with how many there
// were since (under load there is one for nearly every message)
const WARN_INTERVAL = ms('1m');
const warnings = new Map();
// (an error is counted apart for each of its messages, see `warnOften`, but
//  for no more than so many at once: past it, by its own message alone)
const MAX_WARNINGS = 500;
let warningsPrunedAt = 0;

// counts and timings of scans, written once a period, see `flushStats`
let stats = createStats();
let statsTimer = null;

const WORKER = path.join(__dirname, 'spam-scanner-worker.js');

// the headers this helper adds (any of these in a received message is
// removed first, so a sender cannot pass off a result of its own)
const HEADER_PREFIX = 'x-spam-scanner-';
const HEADER_NAMES = [
  'X-Spam-Scanner-Version',
  'X-Spam-Scanner-Flag',
  'X-Spam-Scanner-Score',
  'X-Spam-Scanner-Action',
  'X-Spam-Scanner-Status',
  'X-Spam-Scanner-Language',
  'X-Spam-Scanner-LLM'
];

// the standard SpamAssassin headers (added only out of monitor mode)
const STANDARD_HEADER_NAMES = [
  'X-Spam-Flag',
  'X-Spam-Score',
  'X-Spam-Level',
  'X-Spam-Status',
  'X-Spam-Action',
  // (a virus scan that failed, in some versions of Spam Scanner)
  'X-Spam-Virus-Scan'
];

let pool;
// (the pool's queue, see `fairQueue`)
let taskQueue;
// scans waiting for a worker: the pool's `queueSize` leaves out as many as
// the workers starting could take, so it is low while one starts (at first,
// and after one is stopped); its queue's own size never is
function waiting(workers) {
  return Math.max(workers.queueSize, taskQueue?.size ?? 0);
}

let resolvers;
let version;
// how long a scan takes once it starts on a worker that had scanned before
// (a moving average of the scans that finished), see `isOverloaded`
let runTime = 0;
// how much longer the first scan of a worker takes (a moving average; it
// loads what it needs before it starts, see the worker, so little)
let loadTime = 0;
// the tasks in the pool's queue: one not in it a worker has got (also one
// the pool gave an idle worker at once, without queueing it), which is not
// stopped before it starts, as stopping it stops that worker (see
// `QUEUE_GRACE`)
let queued = new WeakSet();

//
// What was learned from abuse reports (see `helpers/spam-scanner-learned.js`):
// the version read last and its counts, which a worker asks for when it has
// not applied that version (see `updateLearned` in the worker); Redis is read
// at most once every `LEARNED_CHECK`, without holding up a scan, and the
// counts only when the version changed
//
const LEARNED_CHECK = ms('1m');
let learned = null;
let learnedCheckedAt = 0;
let learnedLoading = null;
// (a read that ends after `reset()` is not used)
let learnedGeneration = 0;

// (resolves once read, and never rejects)
function refreshLearned(client) {
  if (learnedLoading) return learnedLoading;
  if (!client || !config.arf.learn) return Promise.resolve();
  if (Date.now() - learnedCheckedAt < LEARNED_CHECK) return Promise.resolve();
  learnedCheckedAt = Date.now();
  const generation = learnedGeneration;
  learnedLoading = (async () => {
    const version = await getLearnedVersion(client);
    if (generation !== learnedGeneration) return;
    if (version === null) {
      learned = null;
      return;
    }

    if (learned?.version === version) return;
    const loaded = await loadLearned(client, version);
    if (generation === learnedGeneration) learned = loaded;
  })()
    .catch((err) =>
      errorOften('spam scanner could not read what was learned', {
        err,
        ignore_hook: true
      })
    )
    .finally(() => {
      if (generation === learnedGeneration) learnedLoading = null;
    });
  return learnedLoading;
}

function getVersion() {
  if (!version) version = require('spamscanner/package.json').version;
  return version;
}

// (also 127.0.0.0/8 and ::1 in any form, e.g. an IPv4-mapped IPv6 address)
function isLoopback(url) {
  try {
    const host = new URL(url).hostname
      .replace(/^\[|]$/g, '')
      .replace(/\.$/, '');
    if (host === 'localhost') return true;
    return ipaddr.isValid(host) && ipaddr.process(host).range() === 'loopback';
  } catch {
    return false;
  }
}

// a URL at "localhost" at 127.0.0.1 instead: Ollama on this server listens
// there only, and "localhost" may be ::1 first, which nothing answers
function loopbackAsIpv4(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.toLowerCase() !== 'localhost') return url;
    parsed.hostname = '127.0.0.1';
    return parsed.href.replace(/\/$/, url.endsWith('/') ? '/' : '');
  } catch {
    return url;
  }
}

//
// The language model settings, or null without a URL or with the mode "off"
// (see SPAM_SCANNER_LLM_* in .env.defaults; Ollama on each MX server is set
// up by ansible/playbooks/spamscanner-llm.yml)
//
function getLlmConfig() {
  const { llm } = config.spamScanner;
  const url = loopbackAsIpv4(typeof llm.url === 'string' ? llm.url.trim() : '');
  const apiKey = typeof llm.apiKey === 'string' ? llm.apiKey.trim() : '';
  const setting = String(llm.mode || 'auto')
    .trim()
    .toLowerCase();
  if (!url || ['off', 'false', '0', 'no'].includes(setting)) return null;
  // (anything but "always" is "auto", see `config.spamScanner.llm.mode`)
  const mode = setting === 'always' ? 'always' : 'auto';
  return {
    provider: llm.provider || 'ollama',
    baseUrl: url,
    ...(llm.model ? { model: llm.model } : {}),
    // (only for a server that requires one)
    ...(apiKey ? { apiKey } : {}),
    mode,
    timeout: llm.timeout,
    // (the start of a message is enough for a verdict, and a model on a CPU
    //  reads about a thousand characters a second)
    maxInputChars: llm.maxInputChars,
    // (one scan at a time per worker)
    concurrency: 1,
    // personal data (address local parts, long numbers, link parameters) is
    // removed before a message leaves this machine, unless set otherwise
    redact: typeof llm.redact === 'boolean' ? llm.redact : !isLoopback(url),
    // (Ollama unloads an idle model after 5 minutes, and loading it again
    //  takes far longer than a scan may: -1m keeps it loaded)
    keepAlive: llm.keepAlive || '-1m'
  };
}

function getSettings() {
  return {
    clamav: config.spamScanner.clamav,
    cloudflare: config.spamScanner.cloudflare,
    networkTimeout: config.spamScanner.networkTimeout,
    lookupTimeout: Math.max(
      config.spamScanner.networkTimeout,
      config.spamScanner.outboundNetworkTimeout
    ),
    llm: getLlmConfig()
  };
}

// the sender of a scan that can refuse a message, by task (see `scansByOwner`)
const ownerOfTask = new WeakMap();

// a queue of the pool's tasks where senders take turns: a sender's scans
// that can refuse a message wait in turn with every other scan, each of
// which (inbound mail, of no sender) takes a turn of its own, so the scans
// one sender queued at once, before others came, cannot keep every other
// sender's waiting past their time limit, as in a queue in order of arrival
// (with one worker, its default, five of one account's took it for theirs)
function fairQueue() {
  // (by sender, or task for one of none, in the order they take turns)
  const turns = new Map();
  let size = 0;
  const keyOf = (info) => (info?.task && ownerOfTask.get(info.task)) ?? info;
  return {
    get size() {
      return size;
    },
    // (how many of a sender's wait)
    waitingOf(owner) {
      return turns.get(owner)?.length || 0;
    },
    // (how many turns are taken before one pushed now: one for each sender
    //  and each scan of no sender waiting)
    get turns() {
      return turns.size;
    },
    push(info) {
      const key = keyOf(info);
      const waiting = turns.get(key);
      if (waiting) waiting.push(info);
      else turns.set(key, [info]);
      size++;
    },
    remove(info) {
      const key = keyOf(info);
      const waiting = turns.get(key);
      const index = waiting ? waiting.indexOf(info) : -1;
      if (index === -1) return;
      waiting.splice(index, 1);
      size--;
      if (waiting.length === 0) turns.delete(key);
    },
    shift() {
      // (the first, in turn, of the senders with the fewest scans running: a
      //  sender whose scan a worker got at once, never queued, takes its
      //  turn after one with none running, who came after it)
      let key;
      let waiting;
      let least = Number.POSITIVE_INFINITY;
      for (const [candidate, list] of turns) {
        const running =
          typeof candidate === 'string'
            ? (scansByOwner.get(candidate) || 0) - list.length
            : 0;
        if (running < least) {
          least = running;
          key = candidate;
          waiting = list;
          if (running <= 0) break;
        }
      }

      if (!waiting) return null;
      const info = waiting.shift();
      size--;
      // (its next scan, if any, after every other waiting now)
      turns.delete(key);
      if (waiting.length > 0) turns.set(key, waiting);
      return info;
    }
  };
}

// a queue of the pool's tasks that knows which are in it: stopping a task a
// worker has got stops that worker, while one still queued is only taken out
// of the queue
function trackedQueue(queue) {
  const task = (info) =>
    info?.task && typeof info.task === 'object' ? info.task : null;
  return {
    get size() {
      return queue.size;
    },
    waitingOf(owner) {
      return queue.waitingOf ? queue.waitingOf(owner) : 0;
    },
    push(info) {
      if (task(info)) queued.add(task(info));
      queue.push(info);
    },
    remove(info) {
      if (task(info)) queued.delete(task(info));
      queue.remove(info);
    },
    shift() {
      const info = queue.shift();
      if (task(info)) queued.delete(task(info));
      return info;
    }
  };
}

function getPool() {
  if (pool) return pool;
  const Piscina = require('piscina');
  const threads = Math.max(1, config.spamScanner.threads || 1);
  taskQueue = fairQueue();
  pool = new Piscina({
    filename: WORKER,
    minThreads: threads,
    maxThreads: threads,
    // (each worker loads the classifier, so it is kept)
    idleTimeout: ms('1h'),
    // (one task at a time: piscina runs a task it can abort, which each
    //  is, on a worker of its own)
    concurrentTasksPerWorker: 1,
    // (which tasks a worker got, see `QUEUE_GRACE`)
    taskQueue: trackedQueue(taskQueue),
    workerData: { settings: getSettings() },
    resourceLimits: {
      maxOldGenerationSizeMb: config.spamScanner.maxMemory
    }
  });
  pool.on('error', (err) =>
    errorOften('spam scanner worker failed', { error: err })
  );
  return pool;
}

//
// Resolvers for the link checks: Cloudflare's malware (1.1.1.2) and family
// (1.1.1.3) resolvers and the default one, all cached in Redis (the first
// two as the domain check caches them, see `helpers/create-family-resolver`)
//
function getResolvers(client, resolver) {
  if (resolvers || !client) return resolvers;
  // (a lookup is waited for no longer than a scan's network checks, see
  //  `withDeadline` below, so it is tried twice in that time, as one lost
  //  answer would leave a host unchecked: one cut off would otherwise go on,
  //  tried again, long after)
  const overrides = {
    timeout: Math.ceil(
      Math.max(
        config.spamScanner.networkTimeout,
        config.spamScanner.outboundNetworkTimeout
      ) / 2
    ),
    tries: 2
  };
  resolvers = {
    default: resolver || createTangerine(client, logger),
    family: createFamilyResolver(client, logger, overrides),
    malware: createSecurityResolver(client, logger, overrides)
  };
  return resolvers;
}

// scans that can refuse a message waiting or running, by sender (e.g. an
// account, see `Emails.queue`), at most a tenth of the queue each (and two)
const scansByOwner = new Map();
function maxScansPerOwner() {
  return Math.max(2, Math.floor(config.spamScanner.maxQueue / 10));
}

// lookups in flight, by resolver and name: scans running at the same time
// (e.g. of one campaign, in several workers) share a lookup rather than each
// making it (a name already answered comes from the Redis cache)
const inFlight = new Map();

// (`owner`: the scan asking, whose lookups take their turn with other
//  scans', see `lookup`)
function resolve4(name, servers, owner = null) {
  // (without resolvers, a failed lookup, which is not cached)
  if (!resolvers || typeof name !== 'string') return Promise.resolve(null);
  // (a name with a label no lookup could answer, e.g. "x!y.evil.example",
  //  is looked up as the longest suffix of it that can be, "evil.example",
  //  which Cloudflare's resolvers block it by, see `helpers/lookup-name`;
  //  an address, e.g. "[2001:db8::1]" from a link, or a name that leaves no
  //  domain to look up, e.g. "foo.com,bar.com", is no such name, rather than
  //  a lookup that fails, so it does not leave the message's links unchecked)
  const host = name.replace(/^\[|]$/g, '');
  const lookupAs = host === '' || isIP(host) ? null : lookupName(host);
  if (!lookupAs) return Promise.resolve([]);
  const first = Array.isArray(servers) ? servers[0] : null;
  const kind = CLOUDFLARE_MALWARE.has(first)
    ? 'malware'
    : CLOUDFLARE_FAMILY.has(first)
    ? 'family'
    : 'default';
  const key = `${kind}:${lookupAs}`;
  // (shared once it is being made, or when this scan would wait its turn
  //  anyway: one still waiting for another scan's turn is made at once by a
  //  scan with room, see `lookup`)
  const shared = inFlight.get(key);
  if (shared && (shared.started || !canRun(owner) || waitingLookups.has(owner)))
    return shared.promise;
  // (not asked again while it failed, see `LOOKUP_RETRY`)
  if ((failedLookups.get(key) || 0) > Date.now()) return Promise.resolve(null);
  const entry = { started: false, promise: null, superseded: null };
  // (one waiting for its turn that another scan made at once since is not
  //  made: it answers as that one does, see `shared` above)
  if (shared) shared.superseded = entry;
  entry.promise = lookup(resolvers[kind], lookupAs, owner, () => {
    entry.started = true;
    return !entry.superseded;
  })
    .then((addresses) => {
      if (entry.superseded) return entry.superseded.promise;
      // (one never made, past its turn, is not remembered as failed)
      if (addresses === NOT_MADE) return null;
      noteLookup(key, addresses);
      return addresses;
    })
    .finally(() => {
      if (inFlight.get(key) === entry) inFlight.delete(key);
    });
  inFlight.set(key, entry);
  return entry.promise;
}

// (remember a lookup that failed)
function noteLookup(key, addresses) {
  if (addresses !== null) {
    failedLookups.delete(key);
    return;
  }

  failedLookups.delete(key);
  failedLookups.set(key, Date.now() + LOOKUP_RETRY);
  // (kept small: the oldest go first)
  if (failedLookups.size > 10_000)
    failedLookups.delete(failedLookups.keys().next().value);
}

//
// Lookups made at once in this process, at most `MAX_LOOKUPS`, and at most
// `MAX_LOOKUPS_PER_OWNER` of one scan's (a message may link to hundreds of
// names, e.g. random subdomains of a domain whose name server never
// answers, which no cache answers): the rest wait, each scan's in turn with
// the others', at most `MAX_WAITING_LOOKUPS` in all, each no longer than a
// scan waits for a lookup (`NOT_MADE` past it, or past the queue: not made,
// and not remembered as failed); a lookup takes its slot no longer than it
// may take, so a resolver that never answers cannot hold slots
//
const MAX_LOOKUPS = 64;
const MAX_LOOKUPS_PER_OWNER = 16;
const MAX_WAITING_LOOKUPS = 5000;
const NOT_MADE = Symbol('not made');
let lookupsRunning = 0;
let lookupsWaiting = 0;
// (by owner, in turn: each owner's waiting lookups, oldest first)
const waitingLookups = new Map();
const runningByOwner = new Map();

// (the longest a lookup is waited for, see `getResolvers` and `withDeadline`)
function lookupWait() {
  return Math.max(
    config.spamScanner.networkTimeout,
    config.spamScanner.outboundNetworkTimeout
  );
}

function canRun(owner) {
  return (
    lookupsRunning < MAX_LOOKUPS &&
    (runningByOwner.get(owner) || 0) < MAX_LOOKUPS_PER_OWNER
  );
}

function take(owner) {
  lookupsRunning++;
  runningByOwner.set(owner, (runningByOwner.get(owner) || 0) + 1);
}

function release(owner) {
  lookupsRunning--;
  const left = (runningByOwner.get(owner) || 1) - 1;
  if (left > 0) runningByOwner.set(owner, left);
  else runningByOwner.delete(owner);
  nextLookup();
}

// (the next lookups to make: one of each owner's in turn, an owner moved to
//  the end once it has had its turn)
function nextLookup() {
  let progressed = true;
  while (progressed && lookupsRunning < MAX_LOOKUPS && lookupsWaiting > 0) {
    progressed = false;
    for (const [owner, queue] of waitingLookups) {
      if (lookupsRunning >= MAX_LOOKUPS) return;
      if (!canRun(owner)) continue;
      const waiting = queue.shift();
      if (queue.length === 0) waitingLookups.delete(owner);
      else {
        waitingLookups.delete(owner);
        waitingLookups.set(owner, queue);
      }

      lookupsWaiting--;
      clearTimeout(waiting.timer);
      take(owner);
      waiting.resolve(true);
      progressed = true;
      break;
    }
  }
}

function lookupSlot(owner) {
  if (lookupsWaiting >= MAX_WAITING_LOOKUPS) return Promise.resolve(false);
  return new Promise((resolve) => {
    const waiting = { resolve };
    // (taken out at its time, wherever it is in the queue)
    waiting.timer = setTimeout(() => {
      const queue = waitingLookups.get(owner);
      const index = queue ? queue.indexOf(waiting) : -1;
      if (index === -1) return;
      queue.splice(index, 1);
      if (queue.length === 0) waitingLookups.delete(owner);
      lookupsWaiting--;
      resolve(false);
    }, lookupWait());
    waiting.timer.unref?.();
    const queue = waitingLookups.get(owner);
    if (queue) queue.push(waiting);
    else waitingLookups.set(owner, [waiting]);
    lookupsWaiting++;
  });
}

// (a lookup with a slot free is asked at once, not a turn of the event loop
//  later)
function lookup(resolver, name, owner = null, onStart = () => {}) {
  const run = async () => {
    // (one no longer to be made gives its slot to the next at once)
    if (onStart() === false) {
      release(owner);
      return NOT_MADE;
    }

    let timer;
    try {
      return await Promise.race([
        lookupNow(resolver, name),
        new Promise((resolve) => {
          timer = setTimeout(() => resolve(null), lookupWait() + 1000);
          timer.unref?.();
        })
      ]);
    } finally {
      clearTimeout(timer);
      release(owner);
    }
  };

  // (with room for it, and none of its own waiting before it: others that
  //  wait do so for their owner's room only, as a slot free goes to them)
  if (canRun(owner) && !waitingLookups.has(owner)) {
    take(owner);
    return run();
  }

  return lookupSlot(owner).then((slot) => (slot ? run() : NOT_MADE));
}

async function lookupNow(resolver, name) {
  try {
    const addresses = await resolver.resolve4(name);
    return Array.isArray(addresses)
      ? addresses.filter((address) => typeof address === 'string')
      : [];
  } catch (err) {
    // a name that does not exist (or has no A record), or one the resolver
    // answers SERVFAIL for, is not blocked, an answer which Spam Scanner
    // caches (a SERVFAIL would fail the same way on every retry, holding the
    // message until it expires); a timeout, REFUSED, FORMERR, a refused
    // connection or another network error answers `null`, which it does not
    // cache, so a short outage cannot hide a malicious link for minutes
    // afterwards (and leaves the message's links unchecked)
    if (err?.code === 'ESERVFAIL') warnServfail();
    return DNS_ANSWERS.has(err?.code) ? [] : null;
  }
}

//
// A warning, written to the console as verdicts are (`logResult`): the
// logger prints only errors in production, and nothing it is told not to
// store; its callers say how often (an error by its message alone)
//
// an error's stack after its name and message (which V8 puts first, and
// which may run over many lines)
function stackAfter(error) {
  const { stack } = error;
  const head = `${error.name}: ${error.message}`;
  if (stack.startsWith(head)) return stack.slice(head.length);
  // (one whose message cannot be found there: its frames only, from the
  //  first line that is one, in the first 8 KB; spaces, not \s, which
  //  matches line breaks too and took time in the square of a run of them)
  const head8k = stack.slice(0, 8192);
  const first = head8k.search(
    /\n[ \t]+at (?:[^\n]* \()?[^\s()]+:\d+:\d+\)?[ \t]*(?:\n|$)/
  );
  return first === -1 ? '' : stack.slice(first);
}

// (`level` "error": an error, written with console.error, with where it was
//  thrown; otherwise console.warn)
function warn(message, meta = {}, level = 'warn') {
  const fields = {};
  for (const [key, value] of Object.entries(meta)) {
    if (key === 'ignore_hook' || key === 'spam_scanner') continue;
    if (value instanceof Error) {
      // (without codes, addresses or links, as a subject is logged: an
      //  error may quote what it read)
      fields[key] = redactSecrets(printable(value.message, 300));
      if (typeof value.code === 'string')
        fields[`${key}_code`] = printable(value.code, 50);
      // (its first frames: file names and lines, not what it read, which a
      //  message of more than one line would put before them)
      if (level === 'error' && typeof value.stack === 'string')
        fields[`${key}_stack`] = stackAfter(value)
          .split('\n')
          .filter((line) => /^\s*at /.test(line))
          .slice(0, 5)
          .map((frame) => printable(frame.trim(), 200));
    } else fields[key] = value;
  }

  (level === 'error' ? console.error : console.warn)(
    `[SPAM_SCANNER] ${message}`,
    JSON.stringify(fields)
  );
}

// (see `SERVFAIL_WARN_INTERVAL`; it names no link host: a host is of a
//  message's content)
function warnServfail() {
  servfailsSinceWarn++;
  const now = Date.now();
  if (now - servfailWarnAt < SERVFAIL_WARN_INTERVAL) return;
  warn('spam scanner link lookups answered SERVFAIL', {
    servfails: servfailsSinceWarn
  });
  servfailWarnAt = now;
  servfailsSinceWarn = 0;
}

// (a warning about a message, once a minute at most, see `WARN_INTERVAL`:
// `count` is how many there were since the last one logged, this one too)
// (an error is written with console.error, see `warn`, once a minute at most
//  for each of its messages: one error does not hide another)
function warnOften(message, meta = {}, level = 'warn') {
  stats.count(level);
  startStatsTimer();
  const now = Date.now();
  // (those written over a minute ago are let go, at most once a minute, so
  //  a new error is counted apart again)
  if (
    warnings.size >= MAX_WARNINGS &&
    now - warningsPrunedAt >= WARN_INTERVAL
  ) {
    warningsPrunedAt = now;
    // (a count left out since is in the stats, see `flushStats`)
    for (const [old, value] of warnings)
      if (now - value.at >= WARN_INTERVAL) warnings.delete(old);
  }

  const error = level === 'error' ? meta.error || meta.err : null;
  const detail =
    error instanceof Error ? printable(error.message, 100) : undefined;
  let key = level === 'error' ? `error\0${message}` : message;
  if (detail !== undefined) {
    const detailed = `${key}\0${detail}`;
    if (warnings.has(detailed) || warnings.size < MAX_WARNINGS) key = detailed;
  }

  const warning = warnings.get(key) || { at: 0, count: 0 };
  warning.count++;
  warnings.set(key, warning);
  if (now - warning.at < WARN_INTERVAL) return;
  warn(message, { ...meta, count: warning.count }, level);
  warning.at = now;
  warning.count = 0;
}

// an error of Spam Scanner's (a scan, a worker, its headers, what was
// learned, an abuse report), written with console.error, see `warnOften`
function errorOften(message, meta = {}) {
  warnOften(message, meta, 'error');
}

//
// The counts and timings of scans since the last line (see
// `helpers/spam-scanner-stats.js`), written as one "[SPAM_SCANNER] stats"
// line each `SPAM_SCANNER_STATS_INTERVAL` while there are any, with the
// workers' state; the timer starts with the first one counted, and does not
// keep the process alive
//
function flushStats() {
  if (stats.isEmpty()) return;
  const line = stats.take({
    threads: pool ? pool.threads.length : 0,
    queue: pool ? waiting(pool) : 0,
    // (how long a scan takes on a warm worker, and how much longer its
    //  first, see `isOverloaded`; moving averages)
    run_avg_ms: Math.round(runTime),
    load_avg_ms: Math.round(loadTime),
    mx_percent: config.spamScanner.mxPercent,
    monitor_only: config.spamScanner.monitorOnly,
    llm_paused: isLlmPaused({ check: false })
  });
  console.log(`[SPAM_SCANNER] stats ${JSON.stringify(line)}`);
}

function startStatsTimer() {
  if (statsTimer || !(config.spamScanner.statsInterval > 0)) return;
  statsTimer = setInterval(flushStats, config.spamScanner.statsInterval);
  statsTimer.unref();
}

function record(stage, outcome, details) {
  stats.record(stage, outcome, details);
  startStatsTimer();
}

// a message not scanned for being too large (`skipped_size`), or as the MX
// server delivered it before its scan was done (`over_mx_wait`: delivered
// without the X-Spam-Scanner-* headers), see `flushStats`
function countSkipped(stage, what) {
  if (what === 'over_mx_wait') {
    stats.note(stage, what);
    startStatsTimer();
  } else if (what === 'skipped_size') record(stage, what);
}

//
// Whether a message received by the MX server is scanned:
// `SPAM_SCANNER_MX_PERCENT` of them, each picked at random (0: none, 100:
// all); one left out is counted, see `flushStats`
//
// (`random`: a number from 0 up to 1)
function isSampledInbound(random = Math.random) {
  const percent = config.spamScanner.mxPercent;
  const sampled =
    percent >= 100 ? true : percent > 0 && random() * 100 < percent;
  if (!sampled && config.spamScanner.enabled) record('received', 'not_sampled');
  return sampled;
}

// what kind of failure a language model error is (not its text, which may
// hold what the server answered)
function llmErrorKind(error) {
  const text = String(error || '');
  const match =
    LLM_UNREACHABLE.exec(text) || /\b(?:http \d{3}|invalid json)\b/i.exec(text);
  return match ? match[0].toLowerCase() : 'error';
}

// (the URL of Ollama's list of models it has loaded)
function psUrl(baseUrl) {
  return new URL('api/ps', baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);
}

// (whether a model Ollama has loaded is the one set: "spamscanner" is
//  loaded as "spamscanner:latest")
function isModelLoaded(models, model) {
  if (!Array.isArray(models)) return false;
  const wanted = String(model || '').toLowerCase();
  return models.some((loaded) =>
    [loaded?.name, loaded?.model].some((name) => {
      if (typeof name !== 'string') return false;
      const value = name.toLowerCase();
      return (
        !wanted ||
        value === wanted ||
        (!wanted.includes(':') && value === `${wanted}:latest`)
      );
    })
  );
}

//
// Ask Ollama whether it is ready, see `LLM_CHECK_INTERVAL` (at most one
// check at a time); resolves to whether it is
//
// (the key of the language model whose readiness is checked: Ollama on this
//  server; or none)
function llmCheckKey(llm) {
  return llm && llm.provider === 'ollama' && isLoopback(llm.baseUrl)
    ? `${llm.baseUrl}\n${llm.model || ''}`
    : '';
}

function checkLanguageModel() {
  const llm = getLlmConfig();
  if (!llm) return Promise.resolve(false);
  const key = llmCheckKey(llm);
  if (!key) return Promise.resolve(true);
  if (llmCheck.key !== key)
    llmCheck = { key, ready: false, at: 0, pending: null, every: 0 };
  if (llmCheck.pending) return llmCheck.pending;
  const check = llmCheck;
  check.pending = (async () => {
    let reason = '';
    try {
      const response = await fetch(psUrl(llm.baseUrl), {
        headers: llm.apiKey ? { authorization: `Bearer ${llm.apiKey}` } : {},
        signal: AbortSignal.timeout(Math.min(LLM_CHECK_TIMEOUT, llm.timeout))
      });
      if (response.ok) {
        // (a body it stopped sending in time is no answer)
        const body = await response.json().catch((err) => {
          if (err?.name === 'TimeoutError' || err?.name === 'AbortError')
            throw err;
          return null;
        });
        if (!isModelLoaded(body?.models, llm.model))
          reason = 'model not loaded';
      } else {
        await response.body?.cancel().catch(() => {});
        reason = `http ${response.status}`;
      }
    } catch (err) {
      const code = err?.cause?.code || err?.code;
      reason =
        err?.name === 'TimeoutError' || err?.name === 'AbortError'
          ? 'timed out'
          : typeof code === 'string'
          ? code.toLowerCase()
          : 'error';
    }

    // (checked again soon once it was ready, as one check that fails, e.g.
    //  under load, would otherwise leave it unasked for a minute)
    check.every = check.ready || !reason ? LLM_CHECK_INTERVAL : LLM_CHECK_RETRY;
    check.ready = !reason;
    check.at = Date.now();
    check.pending = null;
    if (check.ready) {
      llmNotReadySaid = '';
    } else if (
      llmCheck === check &&
      llmNotReadySaid !== reason &&
      check.at - llmNotReadyWarnAt >= LLM_WARN_INTERVAL
    ) {
      llmNotReadySaid = reason;
      llmNotReadyWarnAt = check.at;
      warn(
        'spam scanner language model is not ready (scans go on without it until it is)',
        { reason }
      );
    }

    return check.ready;
  })();
  return check.pending;
}

// whether the language model is not asked now: Ollama not ready, see
// `LLM_CHECK_INTERVAL` (checked again in the background when it is time),
// or not answering scans, see `LLM_BACKOFF`
// (`check`: false for whether it is, as last seen, without checking it)
function isLlmPaused({ check = true } = {}) {
  const llm = getLlmConfig();
  if (!llm) return false;
  const key = llmCheckKey(llm);
  // (not checked yet where it is not checked for itself, e.g. the stats of
  //  a server that does not ask it, is not said to be paused)
  if (key && (check || (llmCheck.key === key && llmCheck.at > 0))) {
    const fresh =
      llmCheck.key === key && Date.now() - llmCheck.at < llmCheck.every;
    if (check && !fresh && !llmCheck.pending)
      checkLanguageModel().catch(() => {});
    if (llmCheck.key !== key || !llmCheck.ready) return true;
  }

  return Date.now() < llmPausedUntil;
}

// (what a scan says of the language model: one it could not reach pauses
//  it, an answer ends the pause)
function noteLlm(summary) {
  const llm = summary?.llm;
  if (!llm || typeof llm !== 'object') return;
  if (!llm.error) {
    if (llm.verdict) {
      llmBackoff = LLM_BACKOFF;
      llmPausedUntil = 0;
      llmRefusedSaid = false;
    }

    return;
  }

  if (!LLM_UNREACHABLE.test(String(llm.error))) return;
  llmFailures++;
  const now = Date.now();
  // (and is asked again only once Ollama is ready again)
  llmCheck.at = 0;
  // (scans that asked it before it was paused are not counted twice)
  if (now >= llmPausedUntil) {
    llmPausedUntil = now + llmBackoff;
    llmBackoff = Math.min(llmBackoff * 2, LLM_BACKOFF_MAX);
  }

  const refused = LLM_REFUSED.test(String(llm.error));
  if (now - llmWarnAt < LLM_WARN_INTERVAL || (refused && llmRefusedSaid))
    return;
  llmRefusedSaid = refused;
  warn(
    refused
      ? 'spam scanner language model is not running (not asked for a while, and not said again until it answers)'
      : 'spam scanner could not reach the language model (not asked for a while)',
    {
      failures: llmFailures,
      // (what kind of failure only: an error may hold the server's answer)
      error: llmErrorKind(llm.error),
      paused_for: llmPausedUntil - now
    }
  );
  llmWarnAt = now;
  llmFailures = 0;
}

//
// Start the workers and load the classifier now rather than on the first
// message (the MX and SMTP servers call this when they start)
//
// (`llm`: the scanner with the language model, by default for inbound)
function warm(direction = 'inbound', { llm } = {}) {
  // (with Spam Scanner off, outbound mail is still scanned for what blocks
  //  it, see `blocksOutbound`)
  if (
    !config.spamScanner.enabled &&
    (direction !== 'outbound' || !blocksOutbound())
  )
    return;
  // (whether the language model is ready, before the first message, for a
  //  scanner that asks it)
  const asks = typeof llm === 'boolean' ? llm : direction !== 'outbound';
  if (asks) checkLanguageModel().catch(() => {});
  try {
    const workers = getPool();
    // (one for each worker)
    for (let i = 0; i < workers.options.maxThreads; i++)
      workers
        .run({
          raw: Buffer.from('From: warm@localhost\r\n\r\nwarm'),
          session: {},
          // (the scanner with the language model is made, but the model is
          //  not asked: a server starting before it is up would otherwise
          //  wait its whole time limit, in each worker, before any message)
          options: { llm: false },
          outbound: direction === 'outbound',
          llm: asks
        })
        .then()
        .catch((err) =>
          errorOften('spam scanner could not start a worker', { error: err })
        );
  } catch (err) {
    errorOften('spam scanner could not start a worker', { error: err });
  }
}

// (the domain of an address for the console, as `toDomain` reads it)
function getDomain(address) {
  if (typeof address !== 'string' || !address.includes('@')) return null;
  return toDomain(address.slice(address.lastIndexOf('@') + 1)) || null;
}

// digits in groups ("48 29 13", "123-456"), and words (a group starts only
// where a run of digits starts: from every digit of a long run without a
// separator, the match would read the rest of the run again)
const DIGIT_GROUPS = /(?<!\p{Nd})\p{Nd}+(?:[ .,/-]\p{Nd}+)+/gu;
// words joined by hyphens ("QXW-B7K"), from where a word starts
const HYPHENATED = /(?<![\p{L}\p{N}])[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu;
const WORD = /[\p{L}\p{N}]+/gu;
const DIGIT = /\p{Nd}/gu;
const HAS_DIGIT = /\p{Nd}/u;

// a link ("https://host/path?token=..." or "www.host/path"): its host, and
// the rest of it up to a space, or a ")" it is in, e.g. "(see
// https://example.com/x)" (each part bounded or unambiguous, so a long text
// is read in linear time)
const LINK =
  /\b(?:[a-z][a-z\d+.-]{0,20}:\/\/(?:[^\s/?#<>"'@()]{0,256}@)?|(?=www\.))([^\s/?#<>"':@()]{1,253})(?:[^\s<>"'()]|\([^\s<>"'()]*\))*/gi;
// a link without a scheme ("host.example/path?token=..."): its host, and
// the rest of it up to a space (each part bounded)
const BARE_LINK =
  /(?<![\p{L}\p{N}.@-])([a-z\d][a-z\d-]{0,62}(?:\.[a-z\d-]{1,63}){0,10}\.[a-z]{2,24})[/?#][^\s<>"'()]*/giu;
// a code written in groups of letters and digits, each with a digit ("XK9
// P2Q"), of at most eight characters each
const SPACED_CODE =
  /(?<![\p{L}\p{N}])(?=[\p{L}]*\p{Nd})[\p{L}\p{N}]{2,8}(?: (?=[\p{L}]*\p{Nd})[\p{L}\p{N}]{2,8})+(?![\p{L}\p{N}])/gu;
// a quoted local part of an address ('"john doe"@example.com')
const QUOTED_LOCAL = /"[^"\n]{0,64}"@/g;
// the characters between which an address is read (a space, quotes,
// brackets, and the punctuation of address lists)
const ADDRESS_RUN = /[^\s<>"',;:]+/g;
// an address in such a run: "(" before it, its local part, its domain (a
// name, or an address in brackets), and what follows it
const ADDRESS = /^(\(*)[^@]+@(\[[^\]]{1,64}]|[^@()[\]]{1,253})(.*)$/s;

//
// Text without one-time codes and other secrets: links become their host,
// email addresses "[address]@" and their domain (any local part, and a
// domain in any script, or an address in brackets); digits in groups with four
// or more in all ("48 29 13", "12/34"), words joined by hyphens with a digit
// and six or more letters and digits in all ("QXW-B7K", "G-482913"), and any
// word with three or more digits ("482913") or with a digit and six or more
// characters ("A1B2C3"), become "[redacted]".  (Also order numbers, dates and
// years, which is fine for a log.)
//
function redactSecrets(text) {
  if (typeof text !== 'string') return null;
  return printable(text)
    .replace(LINK, (_, host) => host.toLowerCase())
    .replace(BARE_LINK, (_, host) => host.toLowerCase())
    .replace(QUOTED_LOCAL, '[address]@')
    .replace(ADDRESS_RUN, (run) => {
      // (an address with a space after its "@": its local part)
      if (/[^(@]@$/.test(run) && !run.startsWith('[address]'))
        return run.replace(/^(\(*).*@$/s, '$1[address]@');
      const match = run.includes('@') ? ADDRESS.exec(run) : null;
      return match
        ? `${match[1]}[address]@${match[2].toLowerCase()}${match[3]}`
        : run;
    })
    .replace(SPACED_CODE, (group) =>
      group.replaceAll(' ', '').length >= 6 ? '[redacted]' : group
    )
    .replace(DIGIT_GROUPS, (group) =>
      (group.match(DIGIT)?.length || 0) >= 4 ? '[redacted]' : group
    )
    .replace(HYPHENATED, (group) =>
      HAS_DIGIT.test(group) && group.replaceAll('-', '').length >= 6
        ? '[redacted]'
        : group
    )
    .replace(WORD, (word) => {
      const digits = word.match(DIGIT)?.length || 0;
      return digits >= 3 || (digits > 0 && word.length >= 6)
        ? '[redacted]'
        : word;
    });
}

// what is logged of an SMTP session: the client, the envelope sender and
// the recipients' domains (not their addresses)
function sessionFields(session = {}) {
  return {
    session_id: printable(session.id, 100),
    remote_address: printable(session.remoteAddress, 100),
    client_hostname: printable(session.resolvedClientHostname, 200),
    mail_from: printable(session.envelope?.mailFrom?.address, 200),
    rcpt_to_domains: recipientDomains(session.envelope?.rcptTo)
  };
}

// (each domain converted once, not once for each recipient: a message may
//  have a thousand)
function recipientDomains(rcptTo) {
  if (!Array.isArray(rcptTo)) return [];
  const names = new Set();
  for (const rcpt of rcptTo) {
    const address = rcpt?.address;
    if (typeof address !== 'string') continue;
    const at = address.lastIndexOf('@');
    if (at !== -1) names.add(address.slice(at + 1).toLowerCase());
  }

  const domains = new Set();
  for (const name of names) {
    const domain = getDomain(`@${name}`);
    if (domain) domains.add(domain);
  }

  return [...domains];
}

//
// What is written to the console for a message the scanner would mark as
// spam: the verdict and its tests, the client, the sender (envelope and From
// header), the subject without one-time codes, and the recipients' domains;
// never the body
//
// (`blocked`: refused for `blocking` as it was submitted)
function logResult(summary, session = {}, blocking = [], options = {}) {
  const { stage = null, blocked = false } = options;
  const line = {
    direction: summary.direction,
    // (nothing is rejected, blocked or filed in monitor mode, but for
    //  outbound mail refused as it is submitted, see `blocksOutbound`)
    monitor_only: config.spamScanner.monitorOnly,
    blocked,
    version: summary.version,
    is_spam: Boolean(summary.isSpam),
    score: summary.score,
    threshold: summary.threshold,
    reject_threshold: summary.rejectThreshold,
    action: summary.action,
    // (what blocks an outbound message out of monitor mode)
    // (what they quote, e.g. a file name, without codes, addresses or links)
    blocking: blocking.map((message) =>
      message.replaceAll(
        /"([^"]{0,255})"/g,
        (_, name) => `"${redactSecrets(name)}"`
      )
    ),
    tests: summary.tests
      .filter((test) => test.score !== 0)
      .map((test) => `${test.name}=${test.score}`),
    language: summary.language,
    llm: summary.llm
      ? {
          verdict: summary.llm.verdict,
          confidence: summary.llm.confidence,
          model: printable(summary.llm.model, 100),
          time: summary.llm.time,
          ...(summary.llm.error
            ? { error: llmErrorKind(summary.llm.error) }
            : {})
        }
      : null,
    // (how long it took in all, waiting for a worker and on it, in ms)
    time: summary.time,
    wait: summary.wait ?? null,
    run: summary.run ?? null,
    // (where it was scanned: as it was received, submitted or sent)
    stage,
    ...sessionFields(session),
    from: printable(summary.message?.from, 200),
    subject: redactSecrets(summary.message?.subject)?.slice(0, 200)
  };
  const outbound = summary.direction === 'outbound';
  // (outbound spam is rejected at the reject threshold, not at the one
  //  inbound spam is filed as spam at)
  const wouldReject =
    outbound &&
    typeof summary.score === 'number' &&
    typeof summary.rejectThreshold === 'number' &&
    summary.score >= summary.rejectThreshold;
  line.would_reject = wouldReject;
  const verdicts = [
    ...(wouldReject
      ? ['would reject as spam']
      : summary.isSpam
      ? ['would mark as spam']
      : []),
    ...(blocking.length > 0
      ? [
          summary.direction === 'outbound'
            ? blocked
              ? 'blocked'
              : 'would block'
            : 'found a virus, program or malware link'
        ]
      : [])
  ];
  console.log(
    `[SPAM_SCANNER] ${verdicts.join(' and ')} ${JSON.stringify(line)}`
  );
}

//
// The SPF, DKIM, DMARC and ARC results the MX server got for a message
// (`session.spf` etc, see `helpers/is-authenticated-message.js`), in the
// shape mailauth gives them, with only what Spam Scanner reads, so it scores
// them without checking again; or null when there are none (outbound mail)
//
function getAuthenticationResults(session = {}) {
  const status = (value) =>
    typeof value?.status?.result === 'string'
      ? { result: value.status.result }
      : null;
  const string = (value) => (typeof value === 'string' ? value : undefined);
  if (
    !status(session.spf) &&
    !status(session.dmarc) &&
    !Array.isArray(session.dkim?.results)
  )
    return null;
  return {
    spf: {
      status: status(session.spf) || { result: 'none' },
      domain: string(session.spf?.domain)
    },
    dkim: {
      results: (Array.isArray(session.dkim?.results)
        ? session.dkim.results
        : []
      )
        .filter((entry) => typeof entry?.status?.result === 'string')
        .map((entry) => ({
          status: {
            result: entry.status.result,
            aligned: string(entry.status.aligned)
          },
          signingDomain: string(entry.signingDomain)
        }))
    },
    dmarc: {
      status: status(session.dmarc) || { result: 'none' },
      domain: string(session.dmarc?.domain),
      p: string(session.dmarc?.p)
    },
    arc: { status: status(session.arc) || { result: 'none' } }
  };
}

// what is logged of an SMTP session, as it is when a scan starts (a scan
// may be logged after the session went on to its next message)
function snapshot(session) {
  if (!session || typeof session !== 'object') return {};
  return {
    id: session.id,
    remoteAddress: session.remoteAddress,
    resolvedClientHostname: session.resolvedClientHostname,
    hostNameAppearsAs: session.hostNameAppearsAs,
    envelope: {
      mailFrom: { address: session.envelope?.mailFrom?.address },
      rcptTo: (Array.isArray(session.envelope?.rcptTo)
        ? session.envelope.rcptTo
        : []
      ).map((rcpt) => ({ address: rcpt?.address }))
    },
    ...(session.spf ? { spf: session.spf } : {}),
    ...(session.dkim ? { dkim: session.dkim } : {}),
    ...(session.dmarc ? { dmarc: session.dmarc } : {}),
    ...(session.arc ? { arc: session.arc } : {})
  };
}

//
// Whether a scan would wait so long for a worker that it could not finish
// within its time limit (that of one that only logs, or the outbound one): once more scans wait than the
// workers can get through in one, each scan that waits gives up at its limit
// before it starts, or starts too late to finish in time and only holds up
// the ones behind it; a scan skipped at once instead keeps the queue to
// what the workers can finish in time (one waiting scan is always let wait,
// and none is skipped before scans took a known time)
//
function addRunTime(took) {
  runTime = runTime ? runTime * 0.8 + took * 0.2 : took;
}

function isOverloaded(workers, timeout) {
  if (!runTime || waiting(workers) === 0) return false;
  const threads = Math.max(1, workers.threads.length);
  // (the scans ahead of it, then its own: senders take turns, see
  //  `fairQueue`, so one turn of each sender waiting, however many of its
  //  scans wait)
  const ahead =
    taskQueue?.size > 0
      ? Math.min(waiting(workers), taskQueue.turns)
      : waiting(workers);
  return (ahead / threads + 1) * runTime > timeout;
}

//
// Scan a raw message.  Resolves with a summary (see `summarize` in the
// worker, plus `direction`), or `null` when it was not scanned (disabled,
// too large, too busy, timed out, or an error), and never rejects.
//
// - `session`: the SMTP session (remoteAddress, resolvedClientHostname,
//   hostNameAppearsAs, envelope)
// - `direction`: "inbound" or "outbound"
// - `client`, `resolver`: Redis and Tangerine, for the link lookups
// - `enforce`: the result decides something (outbound blocking, out of
//   monitor mode), so the message is scanned however large it is, and even
//   with Spam Scanner turned off, with the outbound time limits (from when
//   the scan starts), and stopped when it takes longer
// - `blocks`: the caller refuses an outbound message for what blocks it
//   (`blocksOutbound`), so it is logged as blocked rather than as what
//   would be
//
async function scan(raw, options = {}) {
  const started = Date.now();
  // (see `scansByOwner`, below)
  let releaseOwner = () => {};
  let session = {};
  let direction = 'inbound';
  // (where it was scanned, see `flushStats`)
  let stage = options.stage || options.direction || 'inbound';
  // (what to undo when it fails before a worker has it: after, the scan's
  //  own `finally` does)
  let undo = () => {};
  try {
    const { client, resolver, enforce = false } = options;
    // (the Spam Scanner settings to scan by, see `protectionOf`: the
    //  sender's domain's outbound; the defaults inbound, see
    //  `helpers/on-data-mx.js`)
    const protection = normalProtection(options.protection);
    session = snapshot(options.session);
    direction = options.direction || 'inbound';
    stage = options.stage || direction;

    // (a scan whose result can refuse a message, see `blocksOutbound`, is
    //  made whatever its size, as origin's always was, with the outbound time
    //  limit, and is not left out for having waited; otherwise in monitor mode
    //  it is one that only logs)
    const refuses = enforce || Boolean(options.blocks);

    // (with Spam Scanner off, only one for what blocks a message, as origin
    //  always scanned outbound mail for it)
    if (!config.spamScanner.enabled && !(refuses && blocksOutbound()))
      return null;

    if (!Buffer.isBuffer(raw) || raw.length === 0) return null;

    if (
      !refuses &&
      config.spamScanner.maxSize > 0 &&
      raw.length > config.spamScanner.maxSize
    ) {
      warnOften('spam scanner skipped a large message', {
        size: raw.length,
        ...sessionFields(session)
      });
      record(stage, 'skipped_size');
      return null;
    }

    getResolvers(client, resolver);
    // (what was learned is sent only with a scan that cannot refuse a
    //  message, see `learned` below: a process making only scans that can,
    //  e.g. the SMTP and API servers, never reads it)
    if (!refuses) refreshLearned(client);

    const workers = getPool();

    // (one that can refuse a message has the outbound time limit, which
    //  still answers an API request within 30 seconds: its caller does not
    //  send a message it has no result for, see `Emails.queue`)
    const timeout = refuses
      ? config.spamScanner.outboundTimeout
      : config.spamScanner.timeout;

    // (one that can refuse a message too, by the outbound time limit: it
    //  would wait longer, or hold a message in memory in an unbounded queue,
    //  and its caller answers a temporary error at once rather than after
    //  its whole time limit, see `Emails.queue`)
    // (one that can refuse a message waits for a worker up to its time
    //  limit rather than being left out because others wait: its caller
    //  answers a temporary error for a message it has no result for)
    if (
      waiting(workers) >= config.spamScanner.maxQueue ||
      (!refuses && isOverloaded(workers, timeout))
    ) {
      warnOften('spam scanner skipped a message (busy)', {
        queue: waiting(workers),
        ...sessionFields(session),
        ignore_hook: true
      });
      record(stage, 'skipped_busy');
      // (after what else is waiting to run: a caller that tries again at
      //  once, or many at once, cannot hold up everything else, e.g. the
      //  workers' answers, which would only keep the queue full)
      await setImmediate();
      return null;
    }

    // (one that can refuse a message, of a sender, e.g. an account, with
    //  so many waiting or running already while another sender's, or
    //  inbound mail, waits for a worker, or the queue is half full: so one
    //  sender's messages, e.g. many large ones at once, cannot take the
    //  queue, which others would then be left out of, each held back with a
    //  temporary error; otherwise all are scanned, in turn with others',
    //  see `fairQueue`)
    const owner =
      refuses && typeof options.owner === 'string' && options.owner !== ''
        ? options.owner
        : null;
    const ownerScans = owner ? scansByOwner.get(owner) || 0 : 0;
    if (
      owner &&
      ownerScans >= maxScansPerOwner() &&
      ((taskQueue && taskQueue.size > taskQueue.waitingOf(owner)) ||
        waiting(workers) >= config.spamScanner.maxQueue / 2)
    ) {
      warnOften('spam scanner skipped a message (busy for its sender)', {
        ...sessionFields(session),
        ignore_hook: true
      });
      record(stage, 'skipped_busy');
      await setImmediate();
      return null;
    }

    if (owner) scansByOwner.set(owner, (scansByOwner.get(owner) || 0) + 1);
    let ownerReleased = false;
    releaseOwner = () => {
      if (!owner || ownerReleased) return;
      ownerReleased = true;
      const left = (scansByOwner.get(owner) || 1) - 1;
      if (left > 0) scansByOwner.set(owner, left);
      else scansByOwner.delete(owner);
    };

    const controller = new AbortController();
    // (the caller stops waiting for the scan; a scan that only logs and is
    //  already running is left to finish, and is logged when it does: stopping
    //  it would stop its worker, and loading another takes longer than most
    //  scans, which would only hold up the ones waiting; one that runs past
    //  `HARD_LIMIT` time limits is stopped all the same)
    let giveUp;
    // (no longer waited for: one that ends with a result after it is late)
    let late = false;
    const givenUp = new Promise((resolve) => {
      giveUp = () => {
        late = true;
        resolve(null);
      };
    });
    let begun = false;
    // (when it started, and whether on a worker that had scanned before)
    let begunAt = 0;
    let warmWorker = false;
    let done = false;
    let hardTimer;
    let crowdTimer;
    // (another scan waits for a worker, or for a send slot)
    const crowded = () => waiting(workers) > 0 || waitingToSend.size > 0;
    // (stopped at its time limit, and not waited for after it either: a
    //  worker that does not answer being stopped cannot hold the caller up)
    const stop = () => {
      controller.abort();
      giveUp();
    };

    // (declared before the timer that reads it, so it can never read it
    //  before it is made, e.g. when what comes between throws)
    let task = null;
    let timer = setTimeout(() => {
      // (one whose result can refuse a message, also in monitor mode, is
      //  stopped at its time limit: its caller does not wait for it longer,
      //  e.g. a send job waiting for one before it sends)
      // (one a worker has got but not started, e.g. loading what it needs, is
      //  given up but not stopped, which would stop that worker: it skips it,
      //  see `deadline`, or it is stopped later, see below)
      if (refuses && (begun || queued.has(task))) {
        stop();
        return;
      }

      if (!begun) {
        // (one that only logs and has not started is not scanned: a worker
        //  that gets it now skips it, see `deadline`, and it is taken out of
        //  the queue a moment later; not at once, as a worker may have just
        //  got it, and stopping one for it would only load another, see
        //  `HARD_LIMIT`)
        giveUp();
        timer = setTimeout(() => {
          if (done) return;
          if (begun) runningLate();
          else if (queued.has(task)) controller.abort();
          // (a worker has it, and is loading what it needs or skips it, see
          //  `deadline`: stopped after as long as a scan may run at most)
          else
            hardTimer = setTimeout(
              () => controller.abort(),
              timeout * HARD_LIMIT
            );
        }, QUEUE_GRACE);
        return;
      }

      runningLate();
    }, timeout);
    // (a scan that only logs, running past its time limit)
    // (once: a start that came late may find it given up already, see
    //  the `started` message below)
    let ranLate = false;
    const runningLate = () => {
      if (ranLate) return;
      ranLate = true;
      warnOften('spam scanner did not finish in time (not waited for)', {
        timeout,
        time: Date.now() - started,
        direction,
        ...sessionFields(session),
        ignore_hook: true
      });
      giveUp();
      // (left to finish only while no other scan waits, see `HARD_LIMIT`)
      // (a worker's first scan, which may take longer, a little longer)
      const allowed = timeout + (warmWorker ? 0 : Math.min(loadTime, timeout));
      const stopWhenCrowded = () => {
        if (done || Date.now() - begunAt < allowed || !crowded()) return false;
        clearInterval(crowdTimer);
        controller.abort();
        return true;
      };

      if (!stopWhenCrowded())
        crowdTimer = setInterval(stopWhenCrowded, CROWD_CHECK);
    };

    const onAbort = () => {
      giveUp();
      if (done) return;
      // (one still queued is taken out of the queue; one a worker has got
      //  is stopped at its time limit, not at once, see below)
      if (!begun && queued.has(task)) {
        controller.abort();
        return;
      }

      // (its result is not used: not let run past its time limit, and not
      //  reported as not finished in time; one its worker has got but not
      //  begun is skipped by the worker, see `deadline`, so its worker is not
      //  stopped for it)
      if (!enforce && begun) {
        clearTimeout(timer);
        clearTimeout(hardTimer);
        hardTimer = setTimeout(
          () => controller.abort(),
          Math.max(0, started + timeout - Date.now())
        );
      }
    };

    // (the caller may stop the scan, e.g. for a message it rejected)
    if (options.signal) {
      if (options.signal.aborted) {
        clearTimeout(timer);
        releaseOwner();
        record(stage, 'stopped');
        return null;
      }

      options.signal.addEventListener('abort', onAbort, { once: true });
    }

    // the worker says when it starts the scan, and asks for link lookups,
    // over this port (open until the scan ends)
    const channel = new MessageChannel();
    const port = channel.port1;
    undo = () => {
      options.signal?.removeEventListener('abort', onAbort);
      clearTimeout(timer);
      clearTimeout(hardTimer);
      port.close();
    };

    // (the link lookups asked for, answered and failed)
    const lookups = { asked: 0, answered: 0, failed: 0 };
    // (whose lookups take their turn with other scans', see `lookup`)
    const lookupOwner = Symbol('scan');
    // (one that can refuse a message, also in monitor mode, with the outbound
    //  network time limit: a link host it could not look up in time is not
    //  checked, and one that only blocks in monitor mode is not checked
    //  again as it is sent)
    const lookupDeadline = refuses
      ? config.spamScanner.outboundNetworkTimeout
      : config.spamScanner.networkTimeout;
    port.on('message', async (message) => {
      // (a worker asks for what was learned, see `refreshLearned`)
      if (message && typeof message === 'object' && 'learned' in message) {
        try {
          port.postMessage({
            learned:
              learned && learned.version === message.learned ? learned : null
          });
        } catch {}

        return;
      }

      if (message?.started) {
        begun = true;
        begunAt = Date.now();
        warmWorker = message.warm === true;
        if (controller.signal.aborted) return;
        if (refuses) {
          // an outbound scan's time limit starts again once it starts (a
          // burst of outbound mail waits in the queue for a time limit at
          // most, and then resolves to null), but it ends no later than a
          // quarter of a time limit after the first one would have, so a
          // scan that waited for a worker gets less than its whole limit: an
          // API request is answered within 30 seconds, and a scan must not
          // go on to send a message after its client was told it failed (and
          // retries it)
          clearTimeout(timer);
          const remaining = Math.min(
            timeout,
            started + timeout * 1.25 - Date.now()
          );
          timer = setTimeout(stop, Math.max(0, remaining));
        } else if (options.signal?.aborted) {
          // (stopped by its caller before it began: not let run past its
          //  time limit, nor reported as not finished in time, as `onAbort`
          //  does for one begun)
          clearTimeout(timer);
          clearTimeout(hardTimer);
          hardTimer = setTimeout(
            () => controller.abort(),
            Math.max(0, started + timeout - Date.now())
          );
        } else {
          clearTimeout(hardTimer);
          hardTimer = setTimeout(
            () => controller.abort(),
            // (the first scan of a worker also loads what it needs: stopped
            //  before it could, the next worker would only load it again;
            //  but at most three time limits more, so a first scan that took
            //  far longer than any other does not stretch every one after it)
            timeout * HARD_LIMIT +
              (warmWorker ? 0 : Math.min(loadTime, timeout * HARD_LIMIT))
          );
          // (one past its time limit already, whose start came late: left
          //  to finish only while no other scan waits, as one begun in time)
          if (late) runningLate();
        }

        return;
      }

      lookups.asked++;
      // (no longer than Spam Scanner waits for it: an answer it no longer
      //  waits for leaves the host unchecked too)
      const addresses = await withDeadline(
        resolve4(message?.name, message?.servers, lookupOwner),
        lookupDeadline,
        null
      );
      // (a lookup that failed leaves its host unchecked)
      if (addresses === null) lookups.failed++;
      lookups.answered++;
      try {
        port.postMessage({ id: message?.id, addresses });
      } catch {}
    });

    const authenticationResults =
      direction === 'outbound' ? null : getAuthenticationResults(session);
    task = {
      raw,
      session: {
        ...(typeof session.remoteAddress === 'string'
          ? { remoteAddress: session.remoteAddress }
          : {}),
        ...(typeof session.resolvedClientHostname === 'string'
          ? { resolvedClientHostname: session.resolvedClientHostname }
          : {}),
        ...(typeof session.hostNameAppearsAs === 'string'
          ? { helo: session.hostNameAppearsAs }
          : {}),
        envelope: {
          mailFrom: {
            address:
              typeof session.envelope?.mailFrom?.address === 'string'
                ? session.envelope.mailFrom.address
                : ''
          },
          rcptTo: Array.isArray(session.envelope?.rcptTo)
            ? session.envelope.rcptTo
                .filter((rcpt) => typeof rcpt?.address === 'string')
                .map((rcpt) => ({ address: rcpt.address }))
            : []
        }
      },
      // outbound: every link host Spam Scanner reads in the whole message
      // and in what it carries, up to `OUTBOUND_MAX_HOSTS`, and longer for
      // link checks out of monitor mode; inbound: the MX server's
      // authentication results
      options:
        direction === 'outbound'
          ? {
              ...(refuses
                ? { timeout: config.spamScanner.outboundNetworkTimeout }
                : {}),
              phishing: { maxHosts: OUTBOUND_MAX_HOSTS }
            }
          : authenticationResults
          ? { authenticationResults }
          : {},
      outbound: direction === 'outbound',
      // (the language model: for inbound mail, and for outbound mail as it is
      //  sent, see `checkOutbound`)
      llm:
        typeof options.llm === 'boolean'
          ? options.llm
          : direction !== 'outbound',
      // (which link hosts are looked up, none with both link settings off;
      //  and whether program attachments count, see the worker)
      protection,
      // (what was learned from abuse reports to scan with: not for a scan
      //  that can refuse a message, whose time limit the worker would spend
      //  on it, which scans with what its worker has)
      ...(config.arf.learn && learned && !refuses
        ? { learned: learned.version }
        : {}),
      port: channel.port2,
      // (none is scanned once its time limit has passed before it starts: no
      //  longer waited for, it would only hold up the scans behind it)
      deadline: started + timeout
    };
    // (waiting in turn with other senders', see `fairQueue`)
    if (owner) ownerOfTask.set(task, owner);
    // (the language model is not asked while it cannot be reached, see
    //  `LLM_BACKOFF`: the worker's scanner with it scans without it)
    if (task.llm && isLlmPaused())
      task.options = { ...task.options, llm: false };

    const running = workers
      .run(task, {
        transferList: [channel.port2],
        signal: controller.signal
      })
      .then(
        (summary) => {
          // (a message the caller rejected is not logged)
          if (options.signal?.aborted) {
            record(stage, 'stopped');
            return null;
          }

          // (none when a worker got it past its time limit, see `deadline`)
          if (!summary || typeof summary !== 'object') {
            record(stage, 'expired');
            return null;
          }

          summary.direction = direction;
          summary.protection = protection;
          const links = protection.adult || protection.phishing;
          // (whether it was made to decide something, out of monitor mode,
          //  and whether every link host it asked about was looked up: a
          //  lookup that failed, or that Spam Scanner stopped waiting for,
          //  leaves a host unchecked)
          summary.enforced = Boolean(enforce && isEnforcing());
          summary.linksComplete =
            !summary.linksTimedOut &&
            lookups.failed === 0 &&
            lookups.answered === lookups.asked;
          // (and whether every attachment was scanned: not one with an
          //  attachment ClamAV could not scan; one beyond what the MIME
          //  parser reads is blocked out of monitor mode, see `toStored`)
          summary.scanComplete = !(Number(summary.virusScanErrors) > 0);
          // (outbound, with link hosts looked up, more link hosts than are
          //  looked up block it)
          summary.tooManyLinkHosts =
            direction === 'outbound' && links && summary.uncheckedHosts > 0;
          // (outbound, a message beyond what the MIME parser reads, or whose
          //  attached messages and HTML files are past what is read, or, with
          //  link hosts looked up, with a link whose host is past what is
          //  read, is never checked in full: it blocks it, as what it hides
          //  could, also in monitor mode, see `getOutboundBlockingMessages`)
          // (attached messages left unopened only out of monitor mode, which
          //  refuses only what was refused before, as origin sent them, and
          //  only where something would be looked for in them: links,
          //  programs, or viruses with ClamAV; otherwise a forward of
          //  forwards nested deep is not refused for what nothing would
          //  check)
          summary.tooComplex =
            direction === 'outbound' &&
            Boolean(
              summary.parseError ||
                (summary.contentTooComplex &&
                  isEnforcing() &&
                  (links ||
                    protection.executable ||
                    config.spamScanner.clamav)) ||
                (links && summary.linksTooComplex)
            );
          summary.time = Date.now() - started;
          // (how long it waited for a worker, and took on it; and see
          //  `isOverloaded`, or, the first scan of a worker, how much longer
          //  it took, see `loadTime`)
          if (begun) {
            const took = Date.now() - begunAt;
            summary.wait = begunAt - started;
            summary.run = took;
            if (warmWorker) addRunTime(took);
            else {
              const extra = Math.max(0, took - runTime);
              loadTime = loadTime ? loadTime * 0.8 + extra * 0.2 : extra;
            }
          }

          noteLlm(summary);
          // (each message it would mark as spam or block is logged, in
          //  monitor mode instead of being rejected, blocked or filed as spam,
          //  but for what is refused as it is submitted, see `blocksOutbound`)
          const blocking = getOutboundBlockingMessages(summary);
          // (one that ran past its time limit, no longer waited for, is
          //  late, and its result still counted; the MX wait is the MX
          //  server's own, and does not make it late)
          record(stage, 'scanned', {
            time: summary.time,
            wait: summary.wait,
            run: summary.run,
            llm:
              typeof summary.llm?.time === 'number' ? summary.llm.time : null,
            late,
            spam: Boolean(summary.isSpam),
            blocking: blocking.length > 0
          });
          // (a line that cannot be written does not lose the result, nor
          //  count it again as failed)
          if (summary.isSpam || blocking.length > 0) {
            try {
              logResult(summary, session, blocking, {
                stage: options.stage || direction,
                // (not one its caller no longer waited for, which did not
                //  block the message)
                blocked:
                  Boolean(options.blocks) &&
                  !late &&
                  getOutboundBlockingMessages(summary).length > 0
              });
            } catch (err) {
              errorOften('spam scanner could not log a result', {
                error: err
              });
            }
          }

          return summary;
        },
        (err) => {
          if (!controller.signal.aborted) throw err;
          // (one stopped once it started took a time limit at least, see
          //  `isOverloaded`: the slowest scans count too, though one that
          //  took far longer than any other no more than a time limit)
          if (begun && warmWorker)
            addRunTime(Math.min(Date.now() - begunAt, timeout));
          // (one that never started waited for a worker past its time
          //  limit, see `deadline`)
          record(
            stage,
            options.signal?.aborted
              ? 'stopped'
              : begun
              ? 'timed_out'
              : 'expired'
          );
          if (!options.signal?.aborted)
            warnOften('spam scanner timed out', {
              timeout,
              time: Date.now() - started,
              // (whether it had started on a worker: one that had not waited
              //  for one past its time limit)
              started: begun,
              direction,
              ...sessionFields(session),
              ignore_hook: true
            });
          return null;
        }
      )
      .catch((err) => {
        record(stage, 'failed');
        errorOften('spam scanner failed', {
          error: err,
          time: Date.now() - started,
          direction,
          ...sessionFields(session)
        });
        return null;
      })
      .finally(() => {
        done = true;
        options.signal?.removeEventListener('abort', onAbort);
        clearTimeout(timer);
        clearTimeout(hardTimer);
        clearInterval(crowdTimer);
        try {
          port.close();
        } catch {}
      });

    undo = () => {};
    // (its sender's count, once the worker is done with it)
    running.then(releaseOwner, releaseOwner);
    // (the caller may wait for a scan it no longer waits for, see
    //  `withSendSlot`)
    if (typeof options.settled === 'function') options.settled(running);
    return await Promise.race([running, givenUp]);
  } catch (err) {
    try {
      undo();
    } catch {}

    releaseOwner();
    record(stage, 'failed');
    errorOften('spam scanner failed', {
      error: err,
      time: Date.now() - started,
      direction,
      ...sessionFields(session)
    });
  }

  return null;
}

function sanitize(value, max = 100) {
  return String(value)
    .replace(/[^ -~]/g, '')
    .replace(/[;\\]/g, '')
    .trim()
    .slice(0, max);
}

//
// The headers for a summary, as [name, value] pairs.  In monitor mode only
// X-Spam-Scanner-* headers, which no mail client or filter acts on; out of
// monitor mode the SpamAssassin headers too (X-Spam-Flag and so on), which
// many clients, Sieve scripts and filters do act on.
//
function getHeaders(summary) {
  if (!summary || !config.spamScanner.headers) return [];
  const headers = [
    ['X-Spam-Scanner-Version', sanitize(summary.version)],
    ['X-Spam-Scanner-Flag', summary.isSpam ? 'YES' : 'NO'],
    ...(typeof summary.score === 'number'
      ? [['X-Spam-Scanner-Score', String(summary.score)]]
      : []),
    ['X-Spam-Scanner-Action', sanitize(summary.action)]
  ];
  if (summary.status)
    headers.push([
      'X-Spam-Scanner-Status',
      // (a space after each comma of the tests list, where a long header
      //  line can be folded)
      sanitize(summary.status.replace(/,(?=\S)/g, ', '), 2000)
    ]);
  if (summary.language)
    headers.push(['X-Spam-Scanner-Language', sanitize(summary.language, 20)]);
  if (summary.llm) {
    const parts = [];
    if (summary.llm.verdict)
      parts.push(`verdict=${sanitize(summary.llm.verdict, 20)}`);
    if (typeof summary.llm.confidence === 'number')
      parts.push(`confidence=${summary.llm.confidence}`);
    if (summary.llm.model) parts.push(`model=${sanitize(summary.llm.model)}`);
    if (typeof summary.llm.time === 'number')
      parts.push(`time=${summary.llm.time}ms`);
    if (summary.llm.error) parts.push('error=yes');
    if (parts.length > 0)
      headers.push(['X-Spam-Scanner-LLM', parts.join('; ')]);
  }

  if (!config.spamScanner.monitorOnly)
    for (const [name, value] of summary.standardHeaders || [])
      headers.push([
        sanitize(name),
        sanitize(String(value).replace(/,(?=\S)/g, ', '), 2000)
      ]);

  return headers;
}

// (whether the standard X-Spam-* headers are ours to add, out of monitor
//  mode)
function hasStandardHeaders() {
  return !config.spamScanner.monitorOnly && config.spamScanner.headers;
}

// whether a header (by its name) is one a scan adds, so a sender's own is
// removed (its X-Spam-* ones only with `standard`: once ours replace them)
function isScanHeader(name, standard = hasStandardHeaders()) {
  // (by its name as mail parsers read it, without white space around it:
  //  "\vX-Spam-Scanner-Flag" too)
  const key = String(name).trim().toLowerCase();
  return (
    key.startsWith(HEADER_PREFIX) ||
    (Boolean(standard) &&
      STANDARD_HEADER_NAMES.some((standard) => standard.toLowerCase() === key))
  );
}

// (whether a summary's headers replace the standard X-Spam-* ones: not for
//  a message that was not scanned, whose others' verdict is kept)
function replacesStandard(added) {
  const names = new Set(
    STANDARD_HEADER_NAMES.map((name) => name.toLowerCase())
  );
  return added.some(([name]) => names.has(String(name).toLowerCase()));
}

//
// Remove the headers a scan adds from a received message (mailsplit
// headers)
//
function removeHeaders(headers, standard = hasStandardHeaders()) {
  // (in one pass over the lines: `remove` walks them all for each name, so
  //  thousands of names a sender made up would take time in their square)
  if (typeof headers.getList === 'function') {
    const lines = headers.getList();
    const kept = lines.filter(
      (line) =>
        !(typeof line?.key === 'string' && isScanHeader(line.key, standard))
    );
    if (kept.length !== lines.length) {
      headers.lines = kept;
      headers.changed = true;
    }

    return;
  }

  for (const name of [...HEADER_NAMES, ...STANDARD_HEADER_NAMES])
    if (isScanHeader(name, standard)) headers.remove(name.toLowerCase());
}

//
// The same for the headers of a message as an object of names and values
// (`helpers/get-headers`, which webhooks get), so that it shows ours; and
// for `repeated`, the fields given more than once (`session.repeatedHeaders`)
//
function updateHeaderObject(object, summary, repeated) {
  if (!object || typeof object !== 'object') return;
  try {
    const added = getHeaders(summary);
    const standard = replacesStandard(added);
    for (const fields of [object, repeated])
      if (fields && typeof fields === 'object')
        for (const name of Object.keys(fields))
          if (isScanHeader(name, standard)) delete fields[name];
    for (const [name, value] of added) object[name] = value;
  } catch (err) {
    errorOften('spam scanner could not add its headers', { error: err });
  }
}

//
// Add a summary's headers to a message (mailsplit headers), after removing
// any a sender added (also without a summary)
//
function addHeaders(headers, summary) {
  try {
    const added = getHeaders(summary);
    removeHeaders(headers, replacesStandard(added));
    for (const [name, value] of added) headers.add(name, value);
  } catch (err) {
    errorOften('spam scanner could not add its headers', { error: err });
  }
}

//
// Program attachments outbound mail is blocked for: the file types Gmail
// blocks (https://support.google.com/mail/answer/6590), so a message with one
// would be refused there anyway; inside an archive, those of them Spam
// Scanner looks for there.  Scripts and certificates people send each other
// (.py, .sh, .pl, .cer and so on) are not among them, unless they are programs
// (Spam Scanner reads programs by their content, whatever their name).
//
const ARCHIVE_BLOCKED_EXTENSIONS = new Set([
  'ade',
  'adp',
  'apk',
  'appx',
  'appxbundle',
  'bat',
  'cab',
  'chm',
  'cmd',
  'com',
  'cpl',
  'diagcab',
  'diagcfg',
  'diagpack',
  'dll',
  'dmg',
  'ex',
  'ex_',
  'exe',
  'hta',
  'img',
  'ins',
  'iso',
  'isp',
  'jar',
  'jnlp',
  'js',
  'jse',
  'lib',
  'lnk',
  'mde',
  'mjs',
  'msc',
  'msi',
  'msix',
  'msixbundle',
  'msp',
  'mst',
  'nsh',
  'pif',
  'ps1',
  'scr',
  'sct',
  'shb',
  'sys',
  'vb',
  'vbe',
  'vbs',
  'vhd',
  'vxd',
  'wsc',
  'wsf',
  'wsh',
  'xll'
]);

// As attachments, also the program and script types outbound mail was
// blocked for before (spamscanner's former executables.json); not its
// certificates (.crt), databases (.mdb, .ldb) and source files (.php),
// which people send each other (a Java .class file reads as a program)
const BLOCKED_EXTENSIONS = new Set([
  ...ARCHIVE_BLOCKED_EXTENSIONS,
  'asp',
  'bas',
  'drv',
  'grp',
  'hlp',
  'htx',
  'mad',
  'mda',
  'mdz',
  'msh',
  'msh1',
  'msh1xml',
  'msh2',
  'msh2xml',
  'mshxml',
  'ocx',
  'ovl',
  'ps1xml',
  'ps2',
  'ps2xml',
  'psc1',
  'psc2',
  'reg',
  'scf',
  'shs',
  'vba',
  'ws',
  'wst'
]);

// Content types of programs, which block an attachment whatever its name
// (as before, but only these: mapped to an extension, ordinary
// types such as audio/adpcm or model/mesh would match one)
const BLOCKED_CONTENT_TYPES = new Set([
  'application/hta',
  'application/java-archive',
  'application/vnd.android.package-archive',
  'application/vnd.microsoft.portable-executable',
  'application/vnd.ms-cab-compressed',
  'application/vnd.ms-htmlhelp',
  'application/x-apple-diskimage',
  'application/x-bat',
  'application/x-dosexec',
  'application/x-elf',
  'application/x-executable',
  'application/x-iso9660-image',
  'application/x-java-jnlp-file',
  'application/x-mach-binary',
  'application/x-ms-application',
  'application/x-ms-installer',
  'application/x-ms-shortcut',
  'application/x-msdos-program',
  'application/x-msdownload',
  'application/x-msi',
  'application/x-ole-storage-msi',
  'application/x-sharedlib',
  'application/x-vbscript'
]);

// programs found by their content (Spam Scanner names them by their format)
const PROGRAMS = new Set(['apk', 'elf', 'exe', 'jar', 'lnk', 'macho', 'vhd']);

function isBlockedAttachment(item) {
  const extension =
    typeof item?.extension === 'string' ? item.extension.toLowerCase() : '';
  switch (item?.type) {
    // a file name that hides its real extension
    case 'rtl_override': {
      return (
        item.override !== false ||
        BLOCKED_EXTENSIONS.has(extension) ||
        PROGRAMS.has(extension)
      );
    }

    // a program named as something else (a script named .txt is not)
    case 'disguised_executable': {
      return PROGRAMS.has(extension);
    }

    // "invoice.pdf.exe", "report.exe", and "report" holding a program
    case 'double_extension':
    case 'executable': {
      return BLOCKED_EXTENSIONS.has(extension) || PROGRAMS.has(extension);
    }

    // an archive holding a program (any of them)
    case 'executable_in_archive': {
      const extensions = Array.isArray(item.extensions)
        ? item.extensions
        : [extension];
      return extensions.some(
        (value) =>
          typeof value === 'string' &&
          ARCHIVE_BLOCKED_EXTENSIONS.has(value.toLowerCase())
      );
    }

    default: {
      return false;
    }
  }
}

//
// The Spam Scanner settings of a domain (see `app/models/domains.js`): a link
// to a host Cloudflare's family resolvers block (adult content, and malware
// as well) blocks mail only when turned on, and a program attachment unless
// turned off; a domain on the free plan, or none, has the defaults.  A link
// to a host its malware resolvers block (phishing or malware), viruses and
// spam are always checked for (`has_phishing_protection` is no longer a
// setting, as origin blocked such links for every domain).
//
const PROTECTION = Object.freeze({
  adult: false,
  phishing: true,
  executable: true
});

function normalProtection(protection) {
  if (!protection || typeof protection !== 'object') return { ...PROTECTION };
  return {
    adult: protection.adult === true,
    phishing: protection.phishing !== false,
    executable: protection.executable !== false
  };
}

function sameProtection(a, b) {
  if (!a || typeof a !== 'object') return false;
  const left = normalProtection(a);
  const right = normalProtection(b);
  return (
    left.adult === right.adult &&
    left.phishing === right.phishing &&
    left.executable === right.executable
  );
}

function protectionOf(domain) {
  if (!domain || typeof domain !== 'object' || domain.plan === 'free')
    return { ...PROTECTION };
  return normalProtection({
    adult: domain.has_adult_content_protection,
    phishing: true,
    executable: domain.has_executable_protection
  });
}

//
// What blocks an outbound message: a virus (when ClamAV is turned on), the
// GTUBE test string, a message too complex to check in full, and, by the
// domain's settings (`protectionOf`, which the summary has), a program
// attachment (`isBlockedAttachment`), a link to a host Cloudflare's family
// or malware resolvers block, or more link hosts than are looked up
// (outbound, see `OUTBOUND_MAX_HOSTS`).  Everything else only counts toward
// the score (monitor mode).  (At most the first ten, which make the error
// response.)
//
function getOutboundBlockingMessages(summary) {
  if (!summary || typeof summary !== 'object' || !summary.findings) return [];
  const { findings } = summary;
  const protection = normalProtection(summary.protection);
  const links = protection.adult || protection.phishing;
  return [
    ...new Set([
      ...(findings.viruses || []).map((item) => item.message),
      ...(protection.executable ? getProgramMessages(summary) : []),
      ...(findings.phishing || [])
        .filter(
          (item) =>
            (item.type === 'malicious_domain' && links) ||
            (item.type === 'adult_domain' && protection.adult)
        )
        .map((item) => item.message),
      ...(findings.arbitrary || [])
        .filter((item) => item.name === 'GTUBE')
        .map((item) => item.message),
      ...(summary.tooManyLinkHosts && links
        ? [
            `Message links to more than ${OUTBOUND_MAX_HOSTS} different hosts, too many to check`
          ]
        : []),
      ...(summary.tooComplex
        ? ['Message is too complex to be checked in full']
        : [])
    ])
  ].slice(0, 10);
}

// (program attachments, see `isBlockedAttachment`)
function getProgramMessages(summary) {
  const executables = (summary.findings.executables || []).filter((item) =>
    isBlockedAttachment(item)
  );
  // (by name also the types Spam Scanner does not count as programs, such
  //  as .mjs and .lib)
  const named = new Set(executables.map((item) => item.filename));
  const blockedByName = (summary.attachments || []).filter((attachment) =>
    BLOCKED_EXTENSIONS.has(attachment.extension)
  );
  const byName = blockedByName
    .filter((attachment) => !named.has(attachment.filename))
    .map(
      (attachment) =>
        `Attachment "${attachment.filename}" is a file type that is not allowed (.${attachment.extension})`
    );
  for (const attachment of blockedByName) named.add(attachment.filename);
  // (and by content type, e.g. "application/x-msdownload" for a program)
  const byType = (summary.contentTypes || [])
    .filter(
      (attachment) =>
        BLOCKED_CONTENT_TYPES.has(attachment?.contentType) &&
        !named.has(attachment.filename)
    )
    .map(
      (attachment) =>
        `Attachment "${attachment.filename}" has a content type that is not allowed (${attachment.contentType})`
    );
  return [...executables.map((item) => item.message), ...byName, ...byType];
}

// the most of a response for a blocked message, in octets (UTF-8): an SMTP
// reply line is at most 512 octets with its code (RFC 5321)
const MAX_RESPONSE = 400;

// the error response for a blocked outbound message (bounces read "virus"
// in it as the category, see `helpers/get-bounce-info`)
function getBlockedResponse(messages) {
  const response = `Message blocked by Spam Scanner as a virus, malware, phishing or a program attachment: ${messages.join(
    '; '
  )}`;
  if (Buffer.byteLength(response) <= MAX_RESPONSE) return response;
  // (cut by whole characters, e.g. not within a name in another script)
  let cut = '';
  let octets = 0;
  for (const char of response) {
    const size = Buffer.byteLength(char);
    if (octets + size > MAX_RESPONSE - 3) break;
    cut += char;
    octets += size;
  }

  return `${cut}...`;
}

//
// Report an outbound message that could not be checked (deferred, or sent
// unchecked): an error, for an alert, once an hour at most (across every
// SMTP, API and smtp-bree process with Redis, else for each), and otherwise
// a warning that is not stored (a scanner that keeps failing would otherwise
// raise an alert for every message)
//
const UNCHECKED_ALERT_INTERVAL = ms('1h');
const UNCHECKED_ALERT_KEY = 'spam_scanner_unchecked_alert';
let uncheckedAlertAt = 0;
let uncheckedSinceAlert = 0;

async function reportUnchecked(deferred, meta = {}, client) {
  const message = meta.links_incomplete
    ? deferred
      ? 'Outbound message deferred: not every link host or attachment, or not all of it, could be checked by Spam Scanner'
      : 'Outbound message sent without every link host checked by Spam Scanner (or every attachment, or all of it)'
    : deferred
    ? 'Outbound message deferred: it could not be checked by Spam Scanner'
    : 'Outbound message sent without a spam scan';
  const now = Date.now();
  let alert = now - uncheckedAlertAt >= UNCHECKED_ALERT_INTERVAL;
  if (typeof client?.set === 'function') {
    try {
      alert =
        (await client.set(
          UNCHECKED_ALERT_KEY,
          String(now),
          'PX',
          UNCHECKED_ALERT_INTERVAL,
          'NX'
        )) === 'OK';
    } catch {}
  }

  if (alert) {
    logger.error(new Error(message), {
      ...meta,
      // (how many more this process had since its last alert)
      unchecked_since_last_alert: uncheckedSinceAlert,
      spam_scanner: true
    });
    uncheckedAlertAt = now;
    uncheckedSinceAlert = 0;
    return;
  }

  uncheckedSinceAlert++;
  warnOften(message, meta);
}

//
// Whether an outbound message that could not be checked is held back (a
// temporary error, so it is tried again) rather than sent: only out of
// monitor mode, with SPAM_SCANNER_OUTBOUND_FAIL_CLOSED, and for a message a
// client submitted or one being sent (not one this server made, which has no
// client to try again); reported out of monitor mode (in it, a message too
// large or arriving while the workers are busy is not scanned, and a scan
// that fails is logged as it fails)
//
// (in monitor mode one queued unchecked is held back only for
// `UNCHECKED_HOLD` after it was first to be sent, `since`, e.g. the later of
// when it was queued and the date it was scheduled for: one whose scan always
// fails or takes too long is then sent unchecked, and reported, as origin
// sent it, rather than tried again until it bounces; one without a valid
// `since` is held back)
const UNCHECKED_HOLD = ms('1h');

async function holdUnchecked({
  client,
  submitted = true,
  failed = false,
  since,
  meta = {}
} = {}) {
  // (in monitor mode, only one being sent that was queued unchecked, see
  //  `blocksAsSent`, whose scan failed, took too long or was not made, while
  //  what blocks a message refuses it, see `blocksOutbound`: it could carry
  //  what is refused, and origin never sent a message it had not scanned; a
  //  submission is queued unchecked instead, see `Emails.queue`)
  const due = new Date(since ?? Number.NaN).getTime();
  const held =
    !isEnforcing() && submitted && failed && config.spamScanner.outboundBlock;
  const released = held && due > 0 && Date.now() - due >= UNCHECKED_HOLD;
  const hold = isEnforcing()
    ? Boolean(submitted && config.spamScanner.outboundFailClosed)
    : held && !released;
  if (!isEnforcing() && !hold && !released) return false;
  // (not waited for: a slow Redis must not hold up the message)
  reportUnchecked(hold, meta, client).catch((err) =>
    errorOften('spam scanner could not report unchecked mail', { error: err })
  );
  return hold;
}

//
// Our own domain (WEB_HOST, e.g. forwardemail.net), in ASCII and lowercase
//
function getOurDomain() {
  return toDomain(config.webHost);
}

function toDomain(name) {
  if (typeof name !== 'string') return '';
  let domain = name.trim().toLowerCase().replace(/\.$/, '');
  try {
    domain = punycode.toASCII(domain);
  } catch {}

  return domain;
}

//
// Whether an address is one of ours: any address on our own domain (exactly,
// not a subdomain), such as support@ and abuse@ there (not on any other
// domain, whatever EMAIL_DEFAULT_FROM_EMAIL or EMAIL_ABUSE say), but not an
// SRS address there, which relays mail back to an outside sender (see
// `helpers/check-srs.js`)
//
const SRS_LOCAL_PART = /^srs[01][-+=]/i;

function isOurAddress(address) {
  if (typeof address !== 'string') return false;
  const value = address.trim().toLowerCase();
  // (one "@" only: routing reads the domain after the first)
  const parts = value.split('@');
  const ours = getOurDomain();
  return (
    parts.length === 2 &&
    parts[0] !== '' &&
    !SRS_LOCAL_PART.test(parts[0]) &&
    ours !== '' &&
    toDomain(parts[1]) === ours
  );
}

//
// Whether an outbound message is scanned (and can be blocked): all but mail
// sent from our own domain (our system mail and our admins' mail; the domain
// is the one the sender authenticated as, unlike the envelope sender, which
// the client sets) and mail only to our own addresses (`isOurAddress`:
// people reporting spam or phishing to us must not be blocked or banned for
// it; with any other recipient it is scanned, or adding one of ours as a
// recipient would get anything past the scan)
//
function shouldScanOutbound(envelope, domainName) {
  // (with Spam Scanner turned off, only for what blocks a message, see
  //  `blocksOutbound`)
  if (!config.spamScanner.enabled && !blocksOutbound()) return false;
  if (getOurDomain() !== '' && toDomain(domainName) === getOurDomain())
    return false;
  const to = Array.isArray(envelope?.to) ? envelope.to : [];
  if (to.length === 0) return false;
  // (an address that is not one of ours, valid or not, is scanned for)
  return !to.every((address) => isOurAddress(address));
}

//
// Whether an inbound message is scanned: all but mail only to our own
// addresses (`isOurAddress`), and mail from our own domain that proves it
// (a passing DKIM signature of our domain aligned with the From address, as
// our system mail has; a From address alone can be forged), so that neither
// is ever deferred or filed as spam; not mail forwarded with its From
// rewritten to our no-reply address, whose content is someone else's
// (by root domain: were WEB_HOST a subdomain, as for a staging server, its
// parent domain's mail would count too)
//
function shouldScanInbound(session = {}) {
  const ours = getOurDomain();
  if (ours === '') return true;
  const rcptTo = Array.isArray(session?.envelope?.rcptTo)
    ? session.envelope.rcptTo
    : [];
  if (rcptTo.length > 0 && rcptTo.every((rcpt) => isOurAddress(rcpt?.address)))
    return false;
  // (by root domain, as the From address and signature are read)
  const root = toDomain(parseRootDomain(ours));
  const from =
    typeof session?.originalFromAddress === 'string'
      ? session.originalFromAddress.toLowerCase()
      : '';
  const signedByUs =
    toDomain(session?.originalFromAddressRootDomain) === root &&
    !(
      typeof config.friendlyFromEmail === 'string' &&
      from === config.friendlyFromEmail.toLowerCase()
    ) &&
    Array.isArray(session?.alignedDKIMResults) &&
    session.alignedDKIMResults.some(
      (result) =>
        result?.status?.result === 'pass' &&
        typeof result.signingDomain === 'string' &&
        toDomain(parseRootDomain(result.signingDomain)) === root
    );
  return !signedByUs;
}

//
// What is kept of an outbound scan with the email (`spam_scan`), to decide
// again whether to send it without scanning it again: once submitted, then
// as it is sent (and on each retry)
//
function toStored(summary) {
  if (!summary || typeof summary !== 'object') return null;
  return {
    version: summary.version || getVersion(),
    score: typeof summary.score === 'number' ? summary.score : null,
    threshold: summary.threshold,
    reject_threshold: summary.rejectThreshold,
    is_spam: Boolean(summary.isSpam),
    action: summary.action || null,
    tests: (summary.tests || []).slice(0, 50).map((test) => ({
      name: String(test.name).slice(0, 100),
      score: test.score
    })),
    classification: summary.classification?.category || null,
    // (asked: its verdict, or that it could not answer)
    llm: summary.llm
      ? {
          verdict: summary.llm.verdict || null,
          confidence: summary.llm.confidence ?? null,
          model: summary.llm.model || null,
          error: Boolean(summary.llm.error)
        }
      : null,
    // (also a message too complex to check in full, see `tooComplex`:
    //  blocked rather than held back, as it would only be tried again until
    //  it bounced, the same message never read in full)
    blocking: getOutboundBlockingMessages(summary),
    // (made to decide something, out of monitor mode, and with every link
    //  host looked up and every attachment scanned: see `isCurrent`; a scan
    //  whose attachments ClamAV could not all scan is held back as one whose
    //  links were not all checked is, out of monitor mode, as both may
    //  succeed when it is tried again)
    enforced: Boolean(summary.enforced),
    // (the domain's settings it was decided by, see `isCurrent`)
    protection: normalProtection(summary.protection),
    links_complete:
      summary.linksComplete !== false && summary.scanComplete !== false,
    ...(summary.parseError ? { parse_error: true } : {}),
    ...(Number(summary.virusScanErrors) > 0
      ? { virus_scan_errors: Number(summary.virusScanErrors) }
      : {}),
    scanned_at: new Date()
  };
}

// a kept scan with what deciding by it needs (of any version)
function isKept(stored) {
  return Boolean(
    stored &&
      typeof stored === 'object' &&
      typeof stored.score === 'number' &&
      typeof stored.reject_threshold === 'number' &&
      Array.isArray(stored.blocking)
  );
}

// how long a kept scan decides out of monitor mode (a link host may be
// listed as malware after it was scanned; its lookups are cached in Redis,
// so scanning again is cheap)
const KEPT_FOR = ms('6h');

//
// A kept scan that can be decided by without scanning again (of any
// version: what blocks a message was checked when it was submitted, so a new
// version does not scan all queued mail again); out of monitor mode only one
// made out of it (not one made in monitor mode, with an inbound scan's time
// limits), with every link host looked up, within `KEPT_FOR`
//
function isCurrent(stored, protection) {
  if (!isKept(stored)) return false;
  // (not one decided by other settings of the domain than it has now, e.g.
  //  one kept before they were changed, or before there were any)
  if (protection && !sameProtection(stored.protection, protection))
    return false;
  if (!isEnforcing()) return true;
  const at = new Date(stored.scanned_at).getTime();
  return (
    stored.enforced === true &&
    stored.links_complete !== false &&
    Number.isFinite(at) &&
    Date.now() - at < KEPT_FOR
  );
}

//
// Whether Spam Scanner may reject, block, defer or file anything: only out of
// monitor mode (SPAM_SCANNER_MONITOR_ONLY=false); in monitor mode it only
// logs (see `logResult`)
//
function isEnforcing() {
  return !config.spamScanner.monitorOnly;
}

// Whether outbound mail with what `getOutboundBlockingMessages` finds is
// refused as it is submitted: out of monitor mode, and in it too unless
// SPAM_SCANNER_OUTBOUND_BLOCK=false, as before Spam Scanner 7 (nothing else
// is refused or held back in monitor mode, nor anything as it is sent)
function blocksOutbound() {
  return isEnforcing() || config.spamScanner.outboundBlock;
}

// Whether, in monitor mode, an outbound message is refused as it is sent for
// what blocks it (`blocksOutbound`): one this server made that was queued
// unchecked (its scan failed or took too long, and with no client to try
// again it was queued, marked `UNCHECKED`), as it would have been refused
// then; not one queued before Spam Scanner 7 (nothing kept), which is sent
// as it was
function blocksAsSent(stored) {
  return (
    !isEnforcing() &&
    config.spamScanner.outboundBlock &&
    stored?.unchecked === true
  );
}

// (the scan kept for a message queued unchecked, see `blocksAsSent`)
const UNCHECKED = Object.freeze({ unchecked: true });

// Whether outbound mail is spam to reject as it is sent: at the reject
// threshold, not the one inbound spam is only filed at (rejected only out of
// both monitor modes, see `checkOutbound`)
function isOutboundSpam(stored) {
  return stored.score >= stored.reject_threshold;
}

// the most the language model's verdict of spam adds to a score, as Spam
// Scanner weighs it
const LLM_SPAM_WEIGHT = 6;

//
// Whether the language model is to be asked about a kept scan made without
// it, so it is scanned again with it: only when its verdict could lift the
// score to the reject threshold, which decides what is rejected (and in
// monitor mode, what is logged as what would be), so that close calls far
// from it do not all go to the language model again (and only below it,
// where Spam Scanner asks it at all)
//
function needsLanguageModel(stored) {
  if (!config.spamScanner.enabled) return false;
  const llm = getLlmConfig();
  // (nor while it cannot be reached, see `LLM_BACKOFF`)
  if (!llm || !isKept(stored) || stored.llm || isLlmPaused()) return false;
  return (
    stored.score >= stored.reject_threshold - LLM_SPAM_WEIGHT &&
    stored.score < stored.reject_threshold
  );
}

//
// Scans as smtp-bree sends mail, at most one for each worker at a time: the
// rest wait here, before their time limit starts, rather than in the
// worker queue where they would time out (e.g. a backlog of mail without a
// kept scan); one that waits longer than it may (`wait`) gets none
// (null, so the message is tried again later: waiting and at most two scans
// stay well within the send job's two minutes for a message, which also
// sends it)
//
let sending = 0;
let sendGeneration = 0;
const waitingToSend = new Set();

async function withSendSlot(fn, wait = config.spamScanner.timeout) {
  const slots = Math.max(1, config.spamScanner.threads || 1);
  if (sending >= slots) {
    // (no more wait than the workers' queue holds: in monitor mode the send
    //  job does not wait for a scan, and each waiting holds its message)
    if (waitingToSend.size >= config.spamScanner.maxQueue) {
      record('sending', 'skipped_busy');
      return null;
    }

    const slot = await new Promise((resolve) => {
      const waiter = (value) => {
        clearTimeout(timer);
        waitingToSend.delete(waiter);
        resolve(value);
      };

      const timer = setTimeout(() => waiter(false), wait);
      waitingToSend.add(waiter);
    });
    if (!slot) {
      // (waited past a scan's time limit for a slot)
      record('sending', 'skipped_busy');
      return null;
    }
  } else {
    sending++;
  }

  const generation = sendGeneration;
  try {
    return await fn();
  } finally {
    // (hand the slot to the next waiting, or free it; not after a reset)
    if (generation === sendGeneration) {
      const [next] = waitingToSend;
      if (next) next(true);
      else sending--;
    }
  }
}

// an outbound message's envelope ({ from, to }) as an SMTP session's
function toSession(envelope, session = {}) {
  return {
    ...session,
    envelope: {
      mailFrom: { address: envelope?.from },
      rcptTo: (Array.isArray(envelope?.to) ? envelope.to : []).map(
        (address) => ({ address })
      )
    }
  };
}

//
// The verdict on an outbound message as it is sent (smtp-bree, see
// `helpers/process-email.js`), from the scan kept with it when it was
// submitted, or a scan now when none can be decided by (`isCurrent`: none
// was kept, e.g. mail this server made and could not check then, or mail
// queued before Spam Scanner; out of monitor mode also one made in monitor
// mode, over 6 hours ago, or without every link host looked up, which still
// decides when scanning again fails); either is scanned again with the
// language model only where its verdict could lift the score to the reject
// threshold (`needsLanguageModel`), so most mail never waits on it:
//
// - "block": a virus, GTUBE, and by the domain's settings a program
//   attachment or a malware or adult link
// - "spam": at the reject threshold
// - "send"
// - "unchecked": no scan (it failed or took too long)
//
// With `enforced` when the verdict is to be acted on: "block" only out of
// monitor mode, "spam" only out of both monitor modes (otherwise it was
// logged when it was scanned, see `logResult`), `scanned` when it was
// scanned now, and `stored` to keep.
//
async function checkOutbound({
  message,
  stored,
  envelope,
  session = {},
  client,
  resolver,
  // (the domain's settings, see `protectionOf`: a kept scan decided by
  //  others is not current)
  protection
}) {
  let current = isCurrent(stored, protection) ? stored : null;
  let scanned = false;
  // (in monitor mode, what blocks one with no scan kept refuses it, see
  //  `blocksAsSent`: what of it, as it is refused as it is submitted)
  const refusing = blocksAsSent(stored);
  let refused = [];
  // (what blocks a message needs no language model)
  const ask = (value) =>
    value.blocking.length === 0 && needsLanguageModel(value);
  if (!current || ask(current)) {
    const options = {
      direction: 'outbound',
      // (out of monitor mode its result decides whether it is sent; in it,
      //  it is only logged, with the time limits of an inbound scan)
      enforce: isEnforcing(),
      blocks: refusing,
      session: toSession(envelope, session),
      client,
      resolver,
      protection,
      stage: 'sending'
    };
    const checkStarted = Date.now();
    const checkWithSlot = async () => {
      if (!current) {
        const summary = await scan(message, { ...options, llm: false });
        if (!summary) return;
        current = toStored(summary);
        // (also one linking to more hosts than are looked up: a link past
        //  them would otherwise get out unchecked)
        if (refusing) refused = getOutboundBlockingMessages(summary);
        scanned = true;
        if (!ask(current)) return;
      }

      // (a scan again that failed keeps the verdict from before, which is
      //  below the reject threshold: the language model is only asked to
      //  lift a score to it; and it is not asked once waiting and the first
      //  scan took a time limit, so the check stays well within the send
      //  job's two minutes for a message, which also sends it)
      if (
        isEnforcing() &&
        Date.now() - checkStarted >= config.spamScanner.outboundTimeout
      )
        return;
      // (its link hosts were all looked up when one of the two scans did)
      const summary = await scan(message, { ...options, llm: true });
      if (summary) {
        const fresh = toStored(summary);
        current = {
          ...fresh,
          links_complete:
            fresh.links_complete || current.links_complete !== false
        };
        scanned = true;
      }
    };

    // (the slot is kept until each scan is done, also one no longer waited
    //  for, so that the next waits here, before its time limit starts)
    const settling = [];
    options.settled = (promise) => settling.push(promise);
    // (one the message waits for, out of monitor mode or refusing it in it,
    //  waits for a slot as long as an outbound scan may: in monitor mode
    //  mail queued unchecked in a burst is deferred when it cannot get one)
    await withSendSlot(
      async () => {
        try {
          await checkWithSlot();
        } finally {
          await Promise.all(settling);
        }
      },
      isEnforcing() || refusing
        ? config.spamScanner.outboundTimeout
        : config.spamScanner.timeout
    );
  }

  // (a kept scan that could not be made again, e.g. one made in monitor
  //  mode or a while ago, is still decided by: it was checked once; not one
  //  made with other settings of the domain, which may block what is no
  //  longer blocked, or not have checked links that now are)
  if (
    !current &&
    isKept(stored) &&
    (!protection || sameProtection(stored.protection, protection))
  )
    current = stored;

  if (!current)
    return { verdict: 'unchecked', enforced: false, stored: null, scanned };

  if (refused.length > 0)
    return {
      verdict: 'block',
      enforced: true,
      response: getBlockedResponse(refused),
      stored: current,
      scanned
    };

  if (current.blocking.length > 0)
    return {
      verdict: 'block',
      enforced: isEnforcing(),
      response: getBlockedResponse(current.blocking),
      stored: current,
      scanned
    };

  if (isOutboundSpam(current)) {
    // (no score in the response: it reaches the sender, and would help tune
    //  spam to pass)
    return {
      verdict: 'spam',
      enforced: isEnforcing() && !config.spamScanner.outboundMonitorOnly,
      response: 'Message rejected as spam by Spam Scanner',
      stored: current,
      scanned
    };
  }

  // (one whose link hosts were not all looked up is not sent when a message
  //  that cannot be checked is held back, see `holdUnchecked`)
  if (
    current.links_complete === false &&
    isEnforcing() &&
    config.spamScanner.outboundFailClosed
  )
    return { verdict: 'unchecked', enforced: false, stored: current, scanned };

  return { verdict: 'send', enforced: false, stored: current, scanned };
}

//
// The error for each recipient of an outbound message Spam Scanner blocked
// or rejected as it was sent: permanent ("5.7.1"; 554 for a virus and the
// like, 550 for spam, as `getErrorCode` gives them), so the sender gets a
// bounce (headers only) and bounce webhooks are sent as for any other
// rejection, and `getBounceInfo` reads it as a virus or spam (without a
// `response`, as no server answered: the email is "rejected" by us, not
// "bounced", see the Emails model)
//
function createRejection(check, recipient) {
  const err = new Error(check.response);
  err.responseCode = check.verdict === 'spam' ? 550 : 554;
  err.recipient = recipient;
  err.date = new Date();
  err.is_spam_scanner = true;
  // (logged once for the message, not for each recipient)
  err.ignoreHook = true;
  err.isCodeBug = false;
  return err;
}

//
// An abuse report (ARF) read in a worker (see `analyzeArf` in the worker):
// null when it is not one, it could not be read in `config.arf.timeout`, or
// scans are waiting for a worker (it is then delivered as other mail is, and
// never holds up a scan)
//
async function analyzeArf(raw, { learn = false } = {}) {
  try {
    if (!Buffer.isBuffer(raw) || raw.length === 0) return null;
    const workers = getPool();
    if (waiting(workers) > 0) return null;
    const result = await workers.run(
      {
        raw,
        arf: {
          learn: Boolean(learn),
          maxFeatures: config.arf.maxFeaturesPerMessage
        }
      },
      { signal: AbortSignal.timeout(config.arf.timeout) }
    );
    return result && typeof result === 'object' ? result : null;
  } catch (err) {
    errorOften('spam scanner could not read an abuse report', { error: err });
    return null;
  }
}

// (for tests)
async function reset() {
  const workers = pool;
  learned = null;
  learnedCheckedAt = 0;
  learnedLoading = null;
  learnedGeneration++;
  pool = null;
  resolvers = null;
  runTime = 0;
  loadTime = 0;
  queued = new WeakSet();
  sending = 0;
  sendGeneration++;
  // (those waiting go on, each with a slot, with the new pool)
  for (const waiter of waitingToSend) {
    sending++;
    waiter(true);
  }

  uncheckedAlertAt = 0;
  uncheckedSinceAlert = 0;
  servfailWarnAt = 0;
  servfailsSinceWarn = 0;
  failedLookups.clear();
  llmPausedUntil = 0;
  llmBackoff = LLM_BACKOFF;
  llmFailures = 0;
  llmWarnAt = 0;
  llmRefusedSaid = false;
  llmCheck = { key: '', ready: false, at: 0, pending: null, every: 0 };
  llmNotReadySaid = '';
  llmNotReadyWarnAt = 0;
  if (workers) await workers.destroy().catch(() => {});
  // (after the workers stopped: a scan they stopped is not counted anew)
  clearInterval(statsTimer);
  statsTimer = null;
  stats = createStats();
  warnings.clear();
  warningsPrunedAt = 0;
}

module.exports = {
  UNCHECKED,
  addHeaders,
  analyzeArf,
  blocksAsSent,
  blocksOutbound,
  checkLanguageModel,
  checkOutbound,
  createRejection,
  countSkipped,
  errorOften,
  flushStats,
  holdUnchecked,
  isCurrent,
  isEnforcing,
  isLlmPaused,
  isOurAddress,
  isSampledInbound,
  needsLanguageModel,
  shouldScanInbound,
  shouldScanOutbound,
  toSession,
  toStored,
  updateHeaderObject,
  getHeaders,
  getLlmConfig,
  getOutboundBlockingMessages,
  protectionOf,
  getPool,
  getResolvers,
  getAuthenticationResults,
  getBlockedResponse,
  getVersion,
  redactSecrets,
  refreshLearned,
  removeHeaders,
  reportUnchecked,
  reset,
  resolve4,
  scan,
  warm
};
