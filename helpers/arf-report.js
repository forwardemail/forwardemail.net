/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Abuse reports (ARF, RFC 5965) from mailbox providers' feedback loops, sent
// to our abuse address (`config.abuseEmail`), are read here by the MX server
// and not delivered (see `onDataMX` in `helpers/on-data-mx.js`).
//
// Only a report about abuse (`Feedback-Type` abuse, fraud or virus) that
// comes from a feedback loop is read: to the abuse address alone, From an
// address in `config.arf.reporters` (feedback loop addresses, which a mailbox
// provider's users cannot have) that passed DMARC with a DKIM signature of
// its own domain (not SPF alone, which a provider's shared sending servers
// may pass for others), whose root domain is a truth source
// (`config.truthSources`).  Anything else (a report by a person,
// of another type, over the day's limit, one that cannot be read, or one that
// could not be handled) is delivered to the abuse address as before, so
// nothing is lost.
//
//  - a message a user sent through our SMTP servers counts against their
//    outbound reputation, as a truth source's spam or virus rejection does
//    (`helpers/record-smtp-reputation-report.js`, which resets a sender only
//    once enough recipients reported them, as a rate of their sending); it
//    is one we sent when its one X-Forward-Email-Sender field (which our
//    servers replace with their own, so a sender cannot set it) names one of
//    our hosts, and its X-Forward-Email-ID (which our MX servers remove from
//    mail not from our servers, see `updateMXHeaders`) names a message of the
//    last `config.arf.maxAge` whose Message-ID is the one reported; the
//    recipient counted is the one reported, or the message's only one, or
//    else one for the reporting domain (see `getRecipient`)
//  - a message reported as spam is learned by Spam Scanner's classifier on
//    every server (`helpers/spam-scanner-learned.js`), mail we forwarded too,
//    but not its features that name a party, e.g. its From or link domains
//    (see `PARTY_FEATURE` in the worker); whoever sent mail we forwarded is
//    not blocked for everyone: a report names no one but the recipient who
//    reported it, and a feedback loop hides even them, so one recipient
//    could otherwise have any sender blocked; instead it is blocked for the
//    destination that reported it alone (`helpers/arf-recipient-block.js`)
//
// A report sent again is read once; a message we sent counts once for each
// copy reported (by its X-Forward-Email-ID, not its Message-ID, which a sender
// may give many messages), a block is made once however often it is
// reported, and a message is learned once; at most `config.arf.maxPerDay` are
// read a day from each reporting domain.
//

const crypto = require('node:crypto');
const { Buffer } = require('node:buffer');
const { isIP } = require('node:net');

const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const recordSmtpReputationReport = require('#helpers/record-smtp-reputation-report');
const spamScanner = require('#helpers/spam-scanner');
const { learnSpam } = require('#helpers/spam-scanner-learned');
const {
  blockFromReport,
  findAlias,
  isReportedCopy,
  parseHeader
} = require('#helpers/arf-recipient-block');

const ONE_DAY = ms('1d');

// feedback types about a message that count against its sender, by category
// (as a truth source's rejection, see `isSenderVerdict`)
const CATEGORIES = new Map([
  ['abuse', 'spam'],
  ['fraud', 'spam'],
  ['virus', 'virus']
]);

// (what is read is written to the console, as Spam Scanner's verdicts are:
//  the logger prints only errors in production; the daily limit once a day
//  for each reporting domain)
const overLimitSaid = new Map();
function say(message, fields, warning = false) {
  (warning ? console.warn : console.log)(
    `[ARF] ${message}`,
    JSON.stringify(fields)
  );
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function getAddresses(session) {
  return Array.isArray(session?.envelope?.rcptTo)
    ? session.envelope.rcptTo.map((rcpt) =>
        typeof rcpt?.address === 'string' ? rcpt.address.toLowerCase() : ''
      )
    : [];
}

//
// Whether a message is to the abuse address alone (so a report is never
// read instead of delivering it to anyone else)
//
function isToAbuseOnly(session) {
  if (!isSANB(config.abuseEmail)) return false;
  const abuse = config.abuseEmail.toLowerCase();
  const addresses = getAddresses(session);
  return (
    addresses.length > 0 && addresses.every((address) => address === abuse)
  );
}

//
// Whether a header says the message is an ARF report
// (multipart/report; report-type=feedback-report)
//
function isReportType(headers) {
  const value = headers.getFirst('content-type');
  if (typeof value !== 'string') return false;
  return (
    /^\s*multipart\/report\s*;/i.test(value) &&
    /;\s*report-type\s*=\s*"?feedback-report"?\s*(?:;|$)/i.test(value)
  );
}

//
// The reporting domain (the root domain of a feedback loop address, see
// `config.arf.reporters`) of a message whose From address is one, that passed
// DMARC with an aligned DKIM signature of that domain, and whose root domain
// is a truth source; otherwise null
//
function getReporter(session) {
  const from =
    typeof session?.originalFromAddress === 'string'
      ? session.originalFromAddress.toLowerCase()
      : '';
  const at = from.lastIndexOf('@');
  if (at < 1) return null;
  const domain = from.slice(at + 1);
  if (
    !config.arf.reporters.has(from) &&
    !config.arf.reporters.has(`@${domain}`)
  )
    return null;
  if (session?.dmarc?.status?.result !== 'pass') return null;
  const root = parseRootDomain(domain);
  if (!root || !config.truthSources.has(root)) return null;
  // (DMARC passed for the From domain's organizational domain)
  if (
    typeof session.dmarc.domain !== 'string' ||
    parseRootDomain(session.dmarc.domain.toLowerCase()) !== root
  )
    return null;
  // (signed by it: a passing DKIM signature aligned with the From domain,
  //  of the reporting domain)
  const signed =
    Array.isArray(session.alignedDKIMResults) &&
    session.alignedDKIMResults.some(
      (result) =>
        result?.status?.result === 'pass' &&
        typeof result.signingDomain === 'string' &&
        parseRootDomain(result.signingDomain.toLowerCase()) === root
    );
  return signed ? root : null;
}

// the one value of a header field read from the message reported (null for
// none, or more than one)
function first(values) {
  return Array.isArray(values) && typeof values[0] === 'string'
    ? values[0]
    : null;
}

function one(values) {
  return Array.isArray(values) &&
    values.length === 1 &&
    typeof values[0] === 'string' &&
    values[0] !== ''
    ? values[0]
    : null;
}

function normalizeMessageId(value) {
  if (typeof value !== 'string') return null;
  const id = value.trim().replace(/^<|>$/g, '').trim();
  return id === '' ? null : id;
}

//
// The host our X-Forward-Email-Sender field names ("rfc822; <envelope
// sender>, <host>, <IP address>"), when it is one of ours (WEB_HOST or a
// subdomain): the message was sent by our SMTP servers (or relayed by our MX
// servers from them)
//
function isOurSender(value) {
  if (typeof value !== 'string') return false;
  const fields = value
    .replace(/^\s*rfc822\s*;/i, '')
    .split(',')
    .map((field) => field.trim().toLowerCase());
  const host = fields.find(
    (field) => field !== '' && !field.includes('@') && !isIP(field)
  );
  if (!host || !isFQDN(host)) return false;
  const ours = String(env.WEB_HOST).toLowerCase();
  return host === ours || host.endsWith(`.${ours}`);
}

//
// The recipient a report is about, for the sender's reputation: the
// recipient reported (Original-Rcpt-To) when it is one of the message's, or
// the message's only recipient; otherwise (a feedback loop hides who
// reported it) one for the reporting domain, so such reports count once a
// day for each reporting domain (as a report counts once a day for each
// recipient, see `recordForUser`): one recipient reporting many messages
// never counts as many
//
function getRecipient(email, analysis, reporter) {
  const recipients = Array.isArray(email.envelope?.to)
    ? email.envelope.to
        .filter((address) => typeof address === 'string')
        .map((address) => address.toLowerCase())
    : [];
  const reported = analysis.originalRcptTo.find((address) =>
    recipients.includes(address)
  );
  if (reported) return reported;
  if (recipients.length === 1) return recipients[0];
  return `postmaster@${reporter}`;
}

//
// A mailbox as a party that learns (see `learnSpam`): lowercased, without a
// "+" tag, which reaches the same mailbox at most providers
//
function partyAddress(address) {
  const value = String(address ?? '').toLowerCase();
  const at = value.lastIndexOf('@');
  if (at < 1) return value;
  const local = value.slice(0, at);
  const plus = local.indexOf('+');
  return plus > 0 ? `${local.slice(0, plus)}${value.slice(at)}` : value;
}

//
// Claim a report before it is read (KEYS the day's count of the reporter's
// reports and the report's key; ARGV the day's limit, how long a report
// being read is claimed for, how long the count is kept and the claim's
// token, "reading:" and something unique): -1 past the
// limit, 0 one read already, -2 one being read now, 1 claimed (and counted)
//
const CLAIM = `
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count >= tonumber(ARGV[1]) then return -1 end
local seen = redis.call('GET', KEYS[2])
if seen and string.sub(seen, 1, 7) == 'reading' then return -2 end
if seen then return 0 end
redis.call('SET', KEYS[2], ARGV[4], 'PX', ARGV[2])
if redis.call('INCR', KEYS[1]) == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[3]) end
return 1
`;

// (a claim given up, by its token: not counted, and the report may be read
//  again; not another's claim made since this one expired)
const RELEASE = `
if redis.call('GET', KEYS[2]) ~= ARGV[1] then return 0 end
redis.call('DEL', KEYS[2])
if tonumber(redis.call('GET', KEYS[1]) or '0') > 0 then redis.call('DECR', KEYS[1]) end
return 1
`;

// (a report read, by its claim's token, kept in what marks it read, so
//  it may still be let go, see `FORGET`)
const FINISH = `
if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], 'read:' .. ARGV[1], 'PX', ARGV[2])
return 1
`;

// (a claim given up, by its token, so the report is read again if it is
//  sent again: still counted, as it was read)
const FORGET = `
local value = redis.call('GET', KEYS[1])
if value ~= ARGV[1] and value ~= 'read:' .. ARGV[1] then return 0 end
return redis.call('DEL', KEYS[1])
`;

// (longer than a report takes to read: `config.arf.timeout` in a worker,
//  then the database)
const READING_TTL = 5 * 60 * 1000;

//
// A report about a message one of our users sent: counted against their
// outbound reputation (as `processEmail` counts a truth source's rejection,
// and for the same senders)
//
// (`bound.party` and `bound.group`: the recipient of the message and the
//  domain it was sent from, when it is one a user sent, for learning, see
//  `learnSpam`)
async function recordAgainstSender({
  analysis,
  reporter,
  category,
  client,
  bound = {}
}) {
  const { fields } = analysis;
  const sender = one(fields['x-forward-email-sender']);
  const id = one(fields['x-forward-email-id']);
  const messageId = normalizeMessageId(one(fields['message-id']));
  if (!isOurSender(sender) || !id || !messageId) return 'unknown';
  if (!mongoose.isObjectIdOrHexString(id)) return 'unknown';

  // (required here, since the models require helpers that require this)
  const { Emails, Users, Domains } = require('#models');
  const email = await Emails.findById(id)
    .select('user domain envelope messageId is_bounce is_dsn created_at')
    .lean()
    .exec();
  if (
    !email ||
    email.messageId !== messageId ||
    !email.created_at ||
    Date.now() - new Date(email.created_at).getTime() > config.arf.maxAge
  )
    return 'unknown';

  // (not bounces and auto-replies we sent in response to other mail, whose
  //  recipients whoever sent that mail chose, see `isInboundTriggered`)
  if (email.is_bounce && !email.is_dsn) return 'inbound_triggered';

  const [user, domain] = await Promise.all([
    Users.findById(email.user).select('_id group email').lean().exec(),
    Domains.findById(email.domain).select('name plan members').lean().exec()
  ]);
  if (!user || !domain) return 'unknown';
  if (user.group === 'admin' || domain.name === env.WEB_HOST) return 'ours';

  // (not for domains an internal admin owns)
  const admins = (Array.isArray(domain.members) ? domain.members : [])
    .filter((member) => member?.user && member.group === 'admin')
    .map((member) =>
      typeof member.user === 'object' && member.user._id
        ? member.user._id
        : member.user
    );
  if (
    admins.length > 0 &&
    (await Users.exists({ _id: { $in: admins }, group: 'admin' }))
  )
    return 'ours';

  // (once for each copy reported, however often it is reported)
  const recipient = getRecipient(email, analysis, reporter);
  bound.party = `recipient:${partyAddress(recipient)}`;
  bound.group = `user:${email.user}`;
  const key = `arf_report:${sha256(
    `${reporter}\0${id}\0${category}\0${recipient}`
  )}`;
  const isNew = await client.set(key, '1', 'PX', 30 * ONE_DAY, 'NX');
  if (!isNew) return 'already_read';

  try {
    await recordSmtpReputationReport({
      Users,
      client,
      user,
      domain,
      email,
      recipient,
      truthSource: reporter,
      category
    });
  } catch (err) {
    // (counted when it is sent again)
    await client.del(key).catch(() => {});
    throw err;
  }

  return 'recorded';
}

//
// Read an abuse report to the abuse address, and act on it.  Returns true
// when it was read (so it is not delivered), false when it is delivered as
// other mail is.
//
async function handleArfReport(session, headers, raw) {
  if (!config.arf.enabled) return false;
  if (!isToAbuseOnly(session) || !isReportType(headers)) return false;
  if (!Buffer.isBuffer(raw) || raw.length > config.arf.maxSize) return false;
  const reporter = getReporter(session);
  if (!reporter) return false;

  const meta = { arf: true, reporter, ignore_hook: true };
  const day = new Date().toISOString().slice(0, 10);
  const countKey = `arf_reports:${reporter}:${day}`;
  const rawKey = `arf_report_raw:${sha256(raw)}`;
  // (this reading's claim, see `CLAIM`)
  const token = `reading:${crypto.randomUUID()}`;
  try {
    // (before it is read, as one step, so reports read at once on several
    //  MX servers cannot pass the day's limit: over it, it is delivered as
    //  before; one sent again is read once, and one being read now is
    //  delivered rather than lost, should that reading fail)
    const claimed = Number(
      await this.client.eval(
        CLAIM,
        2,
        countKey,
        rawKey,
        config.arf.maxPerDay,
        READING_TTL,
        2 * ONE_DAY,
        token
      )
    );
    if (claimed === -1) {
      if (overLimitSaid.get(reporter) !== day) {
        overLimitSaid.set(reporter, day);
        say(
          'reports over the daily limit (delivered)',
          { reporter, day },
          true
        );
      }

      return false;
    }

    if (claimed === 0) return true;
    if (claimed !== 1) return false;
  } catch (err) {
    logger.fatal(err, meta);
    return false;
  }

  // (one not read after all is not counted, and may be read if sent again)
  const release = () =>
    this.client
      .eval(RELEASE, 2, countKey, rawKey, token)
      .catch((err) => logger.fatal(err, meta));
  const analysis = await spamScanner.analyzeArf(raw, {
    learn: config.arf.learn
  });
  if (!analysis || !analysis.hasOriginal) {
    await release();
    return false;
  }

  meta.feedback_type = analysis.feedbackType;

  // (only reports about abuse are read: others, e.g. of authentication
  //  failures, are delivered)
  const category = CATEGORIES.get(analysis.feedbackType);
  if (!category) {
    await release();
    return false;
  }

  try {
    // (read, by this claim: not one another server made since it expired)
    await this.client.eval(FINISH, 1, rawKey, token, 30 * ONE_DAY);

    const bound = {};
    const outcome = await recordAgainstSender({
      analysis,
      reporter,
      category,
      client: this.client,
      bound
    });
    // (the first, as the MX server reads it from the copy it forwarded)
    const reportedMessageId = first(analysis.fields['message-id']) || '';

    // (its sender blocked for the destination it was forwarded to, which
    //  reported it, see `helpers/arf-recipient-block.js`; a block that
    //  could not be made, e.g. without the database, is not lost: the report
    //  is delivered, and read again if it is sent again)
    let blocked = false;
    const block = one(analysis.fields['x-forward-email-report']);
    if (config.arf.recipientBlock && block) {
      try {
        blocked = await blockFromReport(this.client, this.resolver, block, {
          messageId: reportedMessageId
        });
      } catch (err) {
        logger.fatal(err, meta);
        await this.client.eval(FORGET, 1, rawKey, token);
        return false;
      }
    }

    //
    // learned only from a report of mail we handled for someone else, by
    // the party that reported it (so one reporter can learn only so much a
    // day, see `learnSpam`): a copy of one of our users' messages (by its
    // recipient), or a copy we forwarded (by its forwarding address, from
    // the X-Forward-Email-Report field made for it, of an alias of a paid
    // domain, as blocks are); not a report of mail the reporter could have
    // sent itself, which would let anyone teach the classifier what they
    // like
    //
    let party = null;
    let group = null;
    if (outcome === 'recorded' || outcome === 'already_read') {
      party = bound.party || null;
      group = bound.group || null;
    } else if (block && config.arf.learn && category === 'spam') {
      const parsed = parseHeader(block);
      const alias = isReportedCopy(parsed, reportedMessageId)
        ? await findAlias(this.resolver, parsed.recipient, parsed.destination)
        : null;
      if (alias) {
        party = `destination:${partyAddress(parsed.destination)}`;
        group = alias.user ? `user:${alias.user}` : `domain:${alias.domain}`;
      }
    }

    let learned = false;
    if (config.arf.learn && category === 'spam' && analysis.features && party) {
      try {
        learned = await learnSpam(this.client, {
          id: normalizeMessageId(reportedMessageId) || sha256(raw),
          party,
          group,
          features: analysis.features
        });
      } catch (err) {
        logger.fatal(err, meta);
      }
    }

    // (one nothing came of, e.g. about mail we forwarded whose sender did not
    //  pass DMARC, or about our own mail, is delivered to the abuse address
    //  as before, and read again if it is sent again)
    if (
      outcome !== 'recorded' &&
      outcome !== 'already_read' &&
      !blocked &&
      !learned
    ) {
      await this.client.eval(FORGET, 1, rawKey, token);
      say('report delivered', {
        reporter,
        feedback_type: analysis.feedbackType,
        outcome
      });
      return false;
    }

    say('report read', {
      reporter,
      feedback_type: analysis.feedbackType,
      outcome,
      blocked,
      learned
    });
    return true;
  } catch (err) {
    // (delivered to the abuse address instead, and read again if it is
    //  sent again)
    logger.fatal(err, meta);
    await this.client.eval(FORGET, 1, rawKey, token).catch(() => {});
    return false;
  }
}

module.exports = handleArfReport;
module.exports.getReporter = getReporter;
module.exports.isOurSender = isOurSender;
module.exports.isReportType = isReportType;
module.exports.isToAbuseOnly = isToAbuseOnly;
module.exports.CLAIM = CLAIM;
module.exports.RELEASE = RELEASE;
module.exports.FINISH = FINISH;
module.exports.FORGET = FORGET;
