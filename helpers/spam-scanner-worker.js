/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The Spam Scanner worker thread (see `helpers/spam-scanner.js`).
//
// Scans run here, off the main thread: parsing a message and the
// classifier are CPU work.  A scan that takes too long is stopped by
// terminating its worker, so the MX and SMTP servers never stall.
//
// This file only loads Spam Scanner, Node's own modules, tldts (a small
// library this project depends on already) and `helpers/printable` (which
// has no dependencies): the settings come in `workerData`, and the link
// lookups Spam Scanner makes go through the main thread (Tangerine and
// Redis) over a message port.  Every link of a message, and of what it
// carries, is read and checked by Spam Scanner alone, by the domain's
// settings (see `protectionOf` in `helpers/spam-scanner.js`).
//

const dns = require('node:dns');
const { AsyncLocalStorage } = require('node:async_hooks');
const { Buffer } = require('node:buffer');
const { workerData } = require('node:worker_threads');

const { parse: parseDomain } = require('tldts');

const printable = require('./printable');

// the language model server is reached over IPv4 (Ollama on the MX server
// listens on 127.0.0.1 only, so "localhost" must not be ::1, see
// ansible/playbooks/spamscanner-llm.yml); this worker makes no other lookups
// of its own (link lookups go through the main thread)
dns.setDefaultResultOrder('ipv4first');

let SpamScanner;
let spamHeaders;
let VERSION;
let llmError;
let spamscanner;

// what was learned from abuse reports (shared by every server through Redis,
// see `helpers/arf-report.js`): the version applied, and the classifier with
// it (null: the default one)
let learnedVersion = null;
let learnedClassifier = null;

// (one with the language model, for inbound mail and for outbound mail as
// it is sent, and one without it, for outbound mail as it is submitted,
// which its client waits for)
const scanners = new Map();
// (Spam Scanner's cache of link lookups, bounded by it)
const dnsCache = new Map();
// (the scanners that have scanned a message: the first scan of each loads
// what it needs, e.g. the classifier, see `HARD_LIMIT` in
// `helpers/spam-scanner.js`)
const warmed = new Set();

//
// The running task's port and lookups, for link lookups: each lookup goes
// over the port of the task that asked for it (a lookup of a task that
// ended gets no answer, and never reaches the next task's port)
//
const tasks = new AsyncLocalStorage();

// how long a lookup is waited for: as long as an outbound scan's link checks,
// and half a second more, which is before Spam Scanner stops waiting for it
// (see `dns.timeout` below); a lookup not answered by then fails, and its
// task says its links were not all looked up (`linksTimedOut`), so an answer
// that comes too late is never lost unnoticed, however late the main thread
// sends it
function lookupWait() {
  return (Number(workerData?.settings?.lookupTimeout) || 5000) + 500;
}

function resolve4(name, servers) {
  const task = tasks.getStore();
  if (!task?.port) return Promise.resolve(null);
  const id = ++task.lookups;
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      if (!task.pending.has(id)) return;
      task.pending.delete(id);
      task.timedOut = true;
      resolve(null);
    }, lookupWait());
    task.pending.set(id, (addresses) => {
      clearTimeout(timer);
      resolve(addresses);
    });
    task.port.postMessage({ id, name, servers });
  });
}

function onLookup(task, message) {
  // (what was learned from abuse reports, see `requestLearned`)
  if (message && typeof message === 'object' && 'learned' in message) {
    if (task.onLearned) task.onLearned(message.learned);
    return;
  }

  const { id, addresses } = message || {};
  const resolve = task.pending.get(id);
  if (!resolve) return;
  task.pending.delete(id);
  // (`null` is a failed lookup, which Spam Scanner does not cache)
  resolve(Array.isArray(addresses) ? addresses : null);
}

//
// ClamAV's settings for a scan: with a time limit of the scan's network
// checks (`timeout`), which Spam Scanner gives ClamAV by default too in
// some versions, while others give it a limit of its own (a minute) that
// would hold a scan past its own time limit; `clamav` is replaced whole by
// a scan's options, so its default socket is kept by giving no other
//
function clamavFor(settings, options = {}) {
  if (!settings.clamav) return false;
  const timeout =
    Number(options.timeout) || Number(settings.networkTimeout) || 5000;
  return { timeout };
}

function loadSpamScanner() {
  if (SpamScanner) return;
  spamscanner = require('spamscanner');
  SpamScanner = spamscanner.SpamScanner || spamscanner.default || spamscanner;
  spamHeaders = spamscanner.spamHeaders;
  VERSION = spamscanner.VERSION || require('spamscanner/package.json').version;
}

function getScanner(withLlm) {
  const key = withLlm ? 'llm' : 'default';
  if (scanners.has(key)) return scanners.get(key);
  loadSpamScanner();

  const settings = workerData?.settings || {};
  const options = {
    // (with what was learned from abuse reports, see `applyLearned`)
    ...(learnedClassifier ? { classifier: learnedClassifier } : {}),
    // SPF, DKIM, DMARC and ARC are checked (and enforced) by the MX server
    // already, and outbound mail is authenticated by its sender
    authentication: false,
    // IP and domain blocklists are checked by the MX server already
    dnsbl: { ip: [], domain: [] },
    reputation: false,
    // (ClamAV, at its default socket, with the time limit of a network check:
    //  see `clamavFor`)
    clamav: clamavFor(settings),
    phishing: {
      cloudflare: Boolean(settings.cloudflare),
      adult: Boolean(settings.cloudflare)
    },
    dns: {
      // (each lookup may take as long as an outbound scan's link checks,
      //  and a second more: `resolve4` gives up on it before then, see
      //  `lookupWait`, so an answer Spam Scanner no longer waits for is never
      //  counted as answered; link checks as a whole are cut off by
      //  `phishing.timeout`, below, which Spam Scanner takes over `timeout`
      //  for them)
      timeout: (Number(settings.lookupTimeout) || 5000) + 1000,
      // (answered by the main thread, see `helpers/spam-scanner.js`)
      resolve4
    },
    timeout: settings.networkTimeout
  };

  let scanner;
  if (withLlm && settings.llm) {
    try {
      scanner = new SpamScanner({ ...options, llm: settings.llm });
    } catch (err) {
      // a language model misconfigured (e.g. an unknown provider) must not
      // turn scanning off: scan without it, and say why in every result
      llmError = err.message;
    }
  }

  if (!scanner) scanner = new SpamScanner({ ...options, llm: null });
  // (one cache of link lookups for both scanners, kept when they are made
  //  again with what was learned, see `applyLearned`)
  if (scanner.dns && scanner.dns.cache instanceof Map)
    scanner.dns.cache = dnsCache;
  scanners.set(key, scanner);
  return scanner;
}

function round(number) {
  return typeof number === 'number' && Number.isFinite(number)
    ? Math.round(number * 100) / 100
    : null;
}

// the extension of a file name, lowercased ("report.EXE" gives "exe"), after
// any dots and spaces at the end (Windows drops them: "run.js." runs)
// (of its last part: Spam Scanner names an attached message's attachments
//  after it, "fw.eml/report", which has none)
function extensionOf(filename) {
  if (typeof filename !== 'string') return null;
  let name = filename
    .slice(Math.max(filename.lastIndexOf('/'), filename.lastIndexOf('\\')) + 1)
    .toLowerCase();
  let end = name.length;
  while (end > 0 && (name[end - 1] === '.' || name[end - 1] === ' ')) end--;
  name = name.slice(0, end).trim();
  const index = name.lastIndexOf('.');
  // (".ocx" is a name of an extension alone)
  return index >= 0 && index < name.length - 1 ? name.slice(index + 1) : null;
}

// a string from the message (a file name, or a finding naming one) at most
// `max` characters long and on one line (see `helpers/printable`), for the
// main thread, logs and error responses
function clip(value, max) {
  return printable(value, max) ?? '';
}

const MAX_NAME = 255;

// the bidirectional controls, and those that reverse the text after them
// (left-to-right and right-to-left override), which hide an extension; the
// others (embeddings and isolates) are written by mail clients around names
// in right-to-left scripts
const BIDI = /[\u202A-\u202E\u2066-\u2069]/gu;
const OVERRIDES = /[\u202D\u202E]/u;
const MAX_MESSAGE = 500;

//
// The extensions of the attachments, each with the name of its first
// attachment (for outbound blocking by file type): one entry per extension,
// so a message of many attachments makes a short list, and none is left out
//
// (the attachments of messages, see `attachedOf`)
function* attachmentsIn(mails) {
  for (const mail of mails)
    if (Array.isArray(mail?.attachments)) yield* mail.attachments;
}

function attachmentsOf(mails) {
  const byExtension = new Map();
  for (const attachment of attachmentsIn(mails))
    for (const filename of namesOf(attachment)) {
      const extension = extensionOf(filename);
      if (extension && !byExtension.has(extension))
        byExtension.set(extension, {
          filename: clip(filename, MAX_NAME),
          extension: clip(extension, MAX_NAME)
        });
    }

  return [...byExtension.values()];
}

//
// The names an attachment goes by: the one mailparser chose, and those of
// its Content-Type "name" and Content-Disposition "filename" parameters,
// which a mail client may show instead (e.g. "notes.txt" with name="x.vbs")
//
function namesOf(attachment) {
  const names = new Set();
  if (typeof attachment?.filename === 'string') names.add(attachment.filename);
  const headers = attachment?.headers;
  if (headers && typeof headers.get === 'function') {
    for (const [field, param] of [
      ['content-type', 'name'],
      ['content-disposition', 'filename']
    ]) {
      const value = headers.get(field)?.params?.[param];
      if (typeof value === 'string' && value !== '') names.add(value);
    }
  }

  // (and each as Windows saves it, see `savedName`)
  for (const name of names) names.add(savedName(name));
  return names;
}

//
// The name Windows saves a file as: without the direction controls that hide
// its extension; and, for the stream name of a file's own content, after its
// folder, without a drive, without the dots and spaces it drops at the end,
// before the stream name: "macro.vbs::$DATA ", "run.bat:" are "macro.vbs"
// and "run.bat"; another stream name, "Amazon.com:Order.pdf", is a stream of
// an empty file, nothing to run, so the name as it is
//
function savedName(name) {
  const bare = name.replace(BIDI, '');
  const base = bare
    .slice(Math.max(bare.lastIndexOf('/'), bare.lastIndexOf('\\')) + 1)
    .replace(/^[a-z]:/i, '');
  let end = base.length;
  while (end > 0 && (base[end - 1] === '.' || base[end - 1] === ' ')) end--;
  const colon = base.indexOf(':');
  if (
    colon === -1 ||
    colon >= end ||
    !/^(?::?\$data)?$/i.test(base.slice(colon + 1, end))
  )
    return bare;
  const file = base.slice(0, colon);
  return file.trim() === '' ? bare : file;
}

//
// The attachments' content types, each with the name of its first attachment
// (outbound mail is also blocked for a program's content type, as before):
// one entry per type
//
function contentTypesOf(mails) {
  const byType = new Map();
  for (const attachment of attachmentsIn(mails)) {
    const type =
      typeof attachment?.contentType === 'string'
        ? clip(attachment.contentType.toLowerCase(), MAX_NAME)
        : '';
    if (type && !byType.has(type))
      byType.set(type, {
        filename: clip(attachment.filename || 'unnamed attachment', MAX_NAME),
        contentType: type
      });
  }

  return [...byType.values()];
}

// the attachments of a message and of its attached messages, as Spam Scanner
// read them (`attached`), as one message's
function attachedOf(result) {
  return [
    {
      attachments: Array.isArray(result?.attached)
        ? result.attached
        : result?.mail?.attachments
    }
  ];
}

// the first address of a parsed address header (mailparser)
function firstAddress(field) {
  const list = Array.isArray(field?.value) ? field.value : [];
  const entry = list.find((item) => typeof item?.address === 'string');
  return entry ? entry.address : null;
}

//
// A summary of a result for the main thread: no parsed message, no words and
// no body (only finding messages, which name file names and link hosts, and
// the sender and subject, for the console)
//
function summarize(result, { started, withLlm, timedOut }) {
  const { results = {} } = result;
  const version = result.version || VERSION;

  let llm = null;
  if (results.llm)
    llm = {
      verdict: results.llm.verdict || null,
      confidence: round(results.llm.confidence),
      model: results.llm.model || null,
      time: typeof results.llm.time === 'number' ? results.llm.time : null,
      error: results.llm.error || null
    };
  else if (withLlm && llmError) llm = { verdict: null, error: llmError };

  const finding = (item) => ({
    type: item.type || null,
    // (not a deceptive link's, which quotes the text it shows, from the
    //  message's body)
    message:
      item.type === 'deceptive_link'
        ? 'A link shows one address but goes to another'
        : clip(item.message || item, MAX_MESSAGE),
    ...(item.name ? { name: clip(item.name, MAX_NAME) } : {}),
    ...(item.filename ? { filename: clip(item.filename, MAX_NAME) } : {}),
    ...(item.extension ? { extension: clip(item.extension, MAX_NAME) } : {}),
    ...(Array.isArray(item.extensions)
      ? { extensions: item.extensions.map((value) => clip(value, MAX_NAME)) }
      : {}),
    ...(item.domain ? { domain: clip(item.domain, MAX_NAME) } : {}),
    // (a file name with bidirectional controls: whether one reverses what
    //  follows, and its extension without them)
    ...(item.type === 'rtl_override' && typeof item.filename === 'string'
      ? {
          override: OVERRIDES.test(item.filename),
          extension: clip(extensionOf(savedName(item.filename)), MAX_NAME)
        }
      : {})
  });

  const headers =
    typeof spamHeaders === 'function' ? spamHeaders(result, { version }) : [];

  return {
    version,
    isSpam: Boolean(result.isSpam),
    score: round(result.score),
    threshold: result.threshold,
    rejectThreshold: result.rejectThreshold,
    action: result.action,
    tests: (result.tests || []).map((test) => ({
      name: String(test.name),
      score: round(test.score)
    })),
    language: result.language || null,
    classification: results.classification
      ? { category: results.classification.category || null }
      : null,
    llm,
    findings: {
      phishing: (results.phishing || []).map((item) => finding(item)),
      executables: (results.executables || []).map((item) => finding(item)),
      viruses: (results.viruses || []).map((item) => finding(item)),
      arbitrary: (results.arbitrary || []).map((item) => finding(item))
    },
    // (of attached messages too, as Spam Scanner read them)
    attachments: attachmentsOf(attachedOf(result)),
    contentTypes: contentTypesOf(attachedOf(result)),
    // (link hosts beyond `phishing.maxHosts`, not looked up)
    uncheckedHosts: Number(results.uncheckedHosts) || 0,
    // (a message beyond what the MIME parser reads, which Spam Scanner
    //  scanned only in part, rather than throwing, in some versions; and how
    //  many attachments ClamAV could not scan)
    parseError:
      typeof results.parseError === 'string' && results.parseError
        ? clip(results.parseError, MAX_MESSAGE)
        : null,
    virusScanErrors: Array.isArray(results.virusScanErrors)
      ? results.virusScanErrors.length
      : 0,
    // (link hosts not all looked up in time, see `lookupWait`, or an
    //  attachment Spam Scanner left unread for its links for time)
    linksTimedOut: Boolean(
      timedOut ||
        Number(results.timedOutHosts) > 0 ||
        results.linksIncomplete === true
    ),
    // (attached messages Spam Scanner left unopened past its limits, whose
    //  attachments it did not inspect: too complex to check)
    contentTooComplex:
      Array.isArray(results.unopenedAttachments) &&
      results.unopenedAttachments.length > 0,
    // (a link host Spam Scanner never read whole)
    linksTooComplex: results.linksTooComplex === true,
    message: {
      from: firstAddress(result.mail?.from),
      subject:
        typeof result.mail?.subject === 'string'
          ? clip(result.mail.subject, 1000)
          : null
    },
    status:
      (headers.find(([name]) => name === 'X-Spam-Status') || [])[1] || null,
    standardHeaders: headers,
    time: Date.now() - started
  };
}

//
// What was learned from abuse reports (see `helpers/arf-report.js`): feature
// hashes and the times each was reported as spam, which the main thread reads
// from Redis and sends a worker that asks for a version it has not applied
//

// how long a worker waits for the main thread to send what was learned
// before it scans with what it has (asked for again with the next scan)
const LEARNED_WAIT = 2000;

function requestLearned(task, version) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      task.onLearned = null;
      resolve(null);
    }, LEARNED_WAIT);
    task.onLearned = (learned) => {
      clearTimeout(timer);
      task.onLearned = null;
      resolve(learned);
    };

    try {
      task.port.postMessage({ learned: version });
    } catch {
      task.onLearned(null);
    }
  });
}

function isLearned(learned, version) {
  return (
    learned !== null &&
    typeof learned === 'object' &&
    learned.version === version &&
    Number.isSafeInteger(learned.nspam) &&
    learned.nspam >= 0 &&
    learned.keys instanceof Uint32Array &&
    learned.spam instanceof Uint32Array &&
    learned.keys.length === learned.spam.length
  );
}

function encodeArray(array) {
  return Buffer.from(array.buffer, array.byteOffset, array.byteLength).toString(
    'base64'
  );
}

//
// The default classifier with what was learned added (as the counts of a
// classifier merged into it), for every scanner made from now on; nothing
// learned is the default classifier
//
function applyLearned(learned) {
  loadSpamScanner();
  let classifier = null;
  if (learned.keys.length > 0) {
    const { Classifier, loadDefaultModel } = spamscanner;
    // (read as a model is: checked, with its hashes in increasing order)
    const counts = Classifier.fromJSON({
      ...new Classifier().toJSON(),
      nspam: learned.nspam,
      nham: 0,
      features: learned.keys.length,
      keys: encodeArray(learned.keys),
      spam: encodeArray(learned.spam),
      ham: encodeArray(new Uint32Array(learned.keys.length))
    });
    classifier = loadDefaultModel();
    classifier.merge(counts);
  }

  learnedClassifier = classifier;
  scanners.clear();
}

async function updateLearned(task, version) {
  if (typeof version !== 'string' || version === learnedVersion || !task.port)
    return;
  const learned = await requestLearned(task, version);
  // (not sent in time, or a newer version came meanwhile: asked for again
  //  with the next scan)
  if (!isLearned(learned, version)) return;
  try {
    applyLearned(learned);
  } catch {
    // (a version that cannot be applied is not asked for again; scans go on
    //  with what was applied before)
  }

  learnedVersion = version;
}

//
// An abuse report (ARF, RFC 5965): its fields, and of the message reported
// the header fields that say who sent it and, for a message with a body, its
// classifier features (hashed, as a model holds them), to learn it as spam
//

// header fields of the message reported that are read (each at most
// `MAX_ARF_VALUES` times, of at most `MAX_ARF_VALUE` characters)
const ARF_FIELDS = new Set([
  'message-id',
  'x-forward-email-id',
  'x-forward-email-report',
  'x-forward-email-sender'
]);
const MAX_ARF_VALUES = 5;
const MAX_ARF_VALUE = 998;
// (of the header of the message reported, read up to this far)
const MAX_ARF_HEADER = 256 * 1024;
const MAX_ARF_RCPT = 10;

// features of a message reported that name who sent it or whom it links to
// (its From domain and display name, link domains, mailer), which are not
// learned: whoever sends a message we forward chooses them, so reports of
// such messages could otherwise mark someone else's domain as spam
const PARTY_FEATURE =
  /^(?:from:(?!tld:|freemail$|none$|name_has_other_address$)|url:(?!ip$|tld:|shortener$|punycode$|userinfo$|deceptive$|count:|domains:)|fn:|hdr:mailer:)/;
const MAX_ADDRESS = 320;
// (a word of a feature that is a domain name: "victimcorp.com")
const DOMAIN_WORD = /[\p{L}\p{N}-]\.[\p{L}]{2,}/u;

//
// The names of the parties of a message reported, from the features that
// name them (its From and link domains, display name and mailer) and its
// Reply-To domain: each domain, and the name it is registered under
// ("victimcorp" of "mail.victimcorp.com"), and each word of the display name
// and mailer
//
function partyNames(features, mail) {
  const names = new Set();
  const addDomain = (domain) => {
    if (typeof domain !== 'string' || domain === '') return;
    const host = domain.toLowerCase();
    names.add(host);
    const parsed = parseDomain(host);
    if (parsed.domainWithoutSuffix) {
      names.add(parsed.domainWithoutSuffix);
      // (and its words: "contoso" and "billing" of "contoso-billing")
      for (const word of parsed.domainWithoutSuffix.split(/[-.]/))
        if (word.length >= 3) names.add(word);
    }
  };

  for (const feature of features) {
    if (typeof feature !== 'string' || !PARTY_FEATURE.test(feature)) continue;
    const value = feature.slice(feature.indexOf(':') + 1);
    if (feature.startsWith('from:') || feature.startsWith('url:'))
      addDomain(value);
    else
      for (const word of value.replace(/^mailer:/, '').split(/[\s:]+/))
        if (word) names.add(word);
  }

  for (const field of [mail?.replyTo, mail?.from, mail?.sender])
    for (const entry of Array.isArray(field?.value) ? field.value : [])
      if (typeof entry?.address === 'string')
        addDomain(entry.address.slice(entry.address.lastIndexOf('@') + 1));
  return names;
}

// (whether a feature names a party: a word of it is a domain, or one of
// `names`; "s:victimcorp", "victimcorp team")
function namesParty(feature, names) {
  if (PARTY_FEATURE.test(feature)) return true;
  const value = feature.startsWith('s:') ? feature.slice(2) : feature;
  for (const word of value.split(' '))
    if (names.has(word) || DOMAIN_WORD.test(word)) return true;
  return false;
}

function readArfOriginal(original) {
  const fields = {};
  for (const name of ARF_FIELDS) fields[name] = [];
  if (typeof original !== 'string' || original === '')
    return { fields, hasBody: false };
  const end = original.slice(0, MAX_ARF_HEADER).search(/\r?\n\r?\n/);
  const header =
    end === -1 ? original.slice(0, MAX_ARF_HEADER) : original.slice(0, end);
  // (a field folded on several lines reads as one)
  for (const line of header.replace(/\r?\n[ \t]+/g, ' ').split(/\r?\n/)) {
    const colon = line.indexOf(':');
    if (colon < 1) continue;
    const name = line.slice(0, colon).trim().toLowerCase();
    if (!ARF_FIELDS.has(name)) continue;
    // (more than the most read: none can be trusted to be the one)
    if (fields[name].length >= MAX_ARF_VALUES) {
      fields[name].push(null);
      continue;
    }

    fields[name].push(printable(line.slice(colon + 1).trim(), MAX_ARF_VALUE));
  }

  const hasBody =
    end !== -1 && /\S/.test(original.slice(end, end + MAX_ARF_HEADER));
  return { fields, hasBody };
}

async function analyzeArf(message, { learn = false, maxFeatures = 0 } = {}) {
  loadSpamScanner();
  const { tryParse } = require('spamscanner/arf');
  const report = await tryParse(message);
  if (!report) return null;
  const original =
    typeof report.originalMessage === 'string' ? report.originalMessage : '';
  const { fields, hasBody } = readArfOriginal(original);

  // the message reported, learned as spam: its features hashed as a model
  // holds them (in increasing order, each once), at most `maxFeatures`
  let features = null;
  if (learn && hasBody && maxFeatures > 0) {
    const scanner = getScanner(false);
    const { features: list, mail } = await scanner.getTokensAndMailFromSource(
      Buffer.from(original, 'utf8')
    );
    // (not what names a party, even as words of its text or subject: a
    //  recipient could otherwise teach every server that mail naming a
    //  company is spam)
    const names = Array.isArray(list) ? partyNames(list, mail) : new Set();
    const learnable = Array.isArray(list)
      ? list.filter(
          (feature) =>
            typeof feature === 'string' && !namesParty(feature, names)
        )
      : [];
    if (learnable.length > 0) {
      const counts = new spamscanner.Classifier();
      counts.learn(learnable, 'spam');
      const { keys } = counts.toJSON();
      const bytes = Buffer.from(keys, 'base64');
      const all = new Uint32Array(
        bytes.buffer,
        bytes.byteOffset,
        bytes.byteLength / 4
      );
      // (a copy, so only these are sent to the main thread)
      features = all.slice(0, maxFeatures);
    }
  }

  const rcptTo = Array.isArray(report.originalRcptTo)
    ? report.originalRcptTo
        .filter(
          (address) =>
            typeof address === 'string' &&
            address.length > 0 &&
            address.length <= MAX_ADDRESS
        )
        .slice(0, MAX_ARF_RCPT)
        .map((address) => address.toLowerCase())
    : [];

  return {
    feedbackType:
      typeof report.feedbackType === 'string' ? report.feedbackType : 'other',
    originalRcptTo: rcptTo,
    hasOriginal: original !== '',
    hasBody,
    fields,
    features
  };
}

//
// `llm`: with the language model (by default for inbound mail only);
// `outbound`: outbound mail; `learned`: the version of what was learned from
// abuse reports to scan with (see `updateLearned`); `arf`: an abuse report
// to read rather than a message to scan (see `analyzeArf`)
//
// (the points of program attachments, none without executable protection:
//  see Spam Scanner's DEFAULT_SCORES)
const NO_PROGRAMS = {
  executable: 0,
  disguisedExecutable: 0,
  doubleExtension: 0,
  rtlOverride: 0,
  executableInArchive: 0,
  scriptInArchive: 0
};

module.exports = async function ({
  raw,
  session,
  options,
  outbound = false,
  llm,
  port,
  deadline,
  protection,
  learned,
  arf
}) {
  const started = Date.now();
  if (arf) {
    const message = ArrayBuffer.isView(raw)
      ? Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength)
      : Buffer.from(raw);
    return analyzeArf(message, arf);
  }

  // (a scan its caller no longer waits for, which got here only after its
  //  time limit, is not made, see `deadline` in `helpers/spam-scanner.js`)
  if (typeof deadline === 'number' && started > deadline) {
    try {
      port?.close();
    } catch {}

    return null;
  }

  const task = {
    port: port || null,
    lookups: 0,
    pending: new Map(),
    timedOut: false
  };
  const listener = (message) => onLookup(task, message);
  const withLlm = typeof llm === 'boolean' ? llm : !outbound;
  const key = withLlm ? 'llm' : 'default';
  if (task.port) task.port.on('message', listener);

  try {
    // (what was learned, the scanner and its classifier, loaded before the
    //  scan says it started: its time limit is for scanning, see `scan()`,
    //  so a worker that was started again, e.g. after one was stopped, does
    //  not give its first scan longer)
    await updateLearned(task, learned);
    const scanner = getScanner(withLlm);
    if (typeof scanner.getClassifier === 'function') scanner.getClassifier();
    if (typeof deadline === 'number' && Date.now() > deadline) return null;
    // (the time limit of a scan starts now; and whether this scanner has
    //  scanned a message before)
    task.port?.postMessage({ started: true, warm: warmed.has(key) });

    // (the message as it arrived: a Buffer's bytes come over as a Uint8Array,
    //  which is wrapped rather than copied)
    const message = ArrayBuffer.isView(raw)
      ? Buffer.from(raw.buffer, raw.byteOffset, raw.byteLength)
      : Buffer.from(raw);
    // (link hosts are looked up with Cloudflare's resolvers only by the
    //  domain's settings: its family resolvers, which block malware too, for
    //  adult content, else its malware resolvers for phishing; with neither,
    //  none is, and none counts toward the score)
    const adult = protection?.adult === true;
    const links = adult || protection?.phishing === true;
    // (and program attachments count toward the score, as they block it,
    //  only with executable protection, which is on unless turned off)
    const programs = protection?.executable !== false;
    const result = await tasks.run(task, async () => {
      const settings = workerData?.settings || {};
      const cloudflare = Boolean(settings.cloudflare) && links;
      const scanned = await scanner.scan(message, {
        ...options,
        // (with link hosts looked up, Spam Scanner reads every link of the
        //  message and of what it carries, up to `phishing.maxHosts` hosts,
        //  outbound also host names written without a link, as mail clients
        //  make links of them, and waits for its lookups two lookups' time,
        //  a malware lookup and then a family one, see `lookupWait`; with
        //  Cloudflare's resolvers not used at all, SPAM_SCANNER_CLOUDFLARE
        //  off, none is read)
        phishing: {
          ...options?.phishing,
          cloudflare,
          adult,
          attachments: cloudflare,
          hostsInText: outbound && cloudflare,
          ...(cloudflare ? { timeout: 2 * lookupWait() + 500 } : {})
        },
        ...(programs ? {} : { scores: { ...options?.scores, ...NO_PROGRAMS } }),
        // (a scan with a time limit of its own, see `clamavFor`)
        ...(settings.clamav && options?.timeout
          ? { clamav: clamavFor(settings, options) }
          : {}),
        session
      });
      return scanned;
    });
    return summarize(result, { started, withLlm, timedOut: task.timedOut });
  } finally {
    if (task.port) {
      task.port.off('message', listener);
      task.port.close();
    }

    task.port = null;
    warmed.add(key);
    // (lookups still waiting get no answer)
    for (const resolve of task.pending.values()) resolve(null);
    task.pending.clear();
  }
};
