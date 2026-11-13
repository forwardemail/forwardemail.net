/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A sender blocked for one alias's forwarding address after its recipient
// reported their mail as spam (see `helpers/arf-report.js`).
//
// Each copy of a message the MX server forwards carries an
// X-Forward-Email-Report field (`createHeader`) when its sender passed DMARC:
// the address it was sent to (ours), the forwarding address, the sender's
// address and the time, encrypted with a key of its own (so it says nothing,
// and no one can make one).  A feedback loop's report of that copy brings the
// field back, which blocks that sender for that alias's forwarding address
// alone (`blockFromReport`), when the address it was sent to is an alias
// (not a catch-all or regular expression) of the domain the MX server
// forwards for (by the verification record in its DNS, not any domain of
// that name someone added to their account) that forwards to it, so its owner
// can see and lift the block on the alias's page (`listBlocks`, `unblock`).
// Mail from that sender sent to that alias then gets a temporary error for
// that forwarding address (`isBlocked`, see `forward` in
// `helpers/on-data-mx.js`), and every other recipient still gets it; only
// while the block is one its owner can see and lift: the alias still has that
// name and forwarding address, and its domain a paid plan.  So whatever a
// recipient reports, they only stop mail to themselves, and one alias's owner
// never sees or lifts another's blocks.
//
// Addresses are compared as the MX server finds an alias: the part of the
// address it was sent to before "+" (`parseUsername`), and domains in their
// ASCII form, so a block of "bob+news@bücher.example" is one of
// "bob@xn--bcher-kva.example".  The field's key is derived anew every
// `EPOCH` (its period is written before it), so no one key encrypts more
// than a period's copies.
//
// Only a sender who passed DMARC is blocked, by their From address (one
// spoofing an address that does not pass is never one, so it cannot get that
// address blocked; a sender can evade a block with another address, which a
// recipient then reports again), for `config.arf.blockDuration`, by a report
// of a copy forwarded in the last `config.arf.maxAge`; an alias has at most
// `config.arf.maxBlocksPerAlias`, and gets at most
// `config.arf.maxBlocksPerAliasPerDay` a day, for each of its forwarding
// addresses (so one does not use up another's).  (A forwarding address
// several people read, e.g. a group, is blocked for all of them by one's
// report.)
//

const crypto = require('node:crypto');
const punycode = require('node:punycode');

const mongoose = require('mongoose');

const isEmail = require('#helpers/is-email');
const logger = require('#helpers/logger');
const printable = require('#helpers/printable');
const config = require('#config');
const env = require('#config/env');
const { encrypt, decryptStrict } = require('#helpers/encrypt-decrypt');

const HEADER = 'X-Forward-Email-Report';
const ONE_DAY = 24 * 60 * 60 * 1000;
// (a report of a copy dated later than this is none)
const CLOCK_SKEW = 60 * 60 * 1000;
// (the field's key is derived for each period this long)
const EPOCH = 30 * ONE_DAY;
// (a longer field is not added: it could not be folded within a line of 998
//  characters, and is not read back)
const MAX_FIELD = 900;
const PERIOD = /^[\da-z]{1,8}$/;
const MAX_ADDRESS = 320;

const keys = new Map();
function getKey(epoch) {
  if (!keys.has(epoch)) {
    if (!env.HELPER_ENCRYPTION_KEY)
      throw new TypeError('HELPER_ENCRYPTION_KEY missing');
    // (a key of its own: nothing else encrypted is ever read as one)
    keys.set(
      epoch,
      crypto
        .createHmac('sha256', String(env.HELPER_ENCRYPTION_KEY))
        .update(`forward-email-report:${epoch}`)
        .digest()
    );
    // (only those of the last few periods are kept)
    for (const old of keys.keys()) if (keys.size > 4) keys.delete(old);
  }

  return keys.get(epoch);
}

function normalize(address) {
  return typeof address === 'string' ? address.trim().toLowerCase() : '';
}

//
// An address as it is compared: lowercased, its domain in ASCII, and, for the
// address mail was sent to (`recipient`), the part before "+" as the MX
// server finds an alias by (see `helpers/parse-username`)
//
function canonical(address, recipient = false) {
  const value = normalize(address);
  // (no address is longer: one is not converted, which takes time in the
  //  square of a label's length)
  if (value.length > MAX_ADDRESS) return value;
  const at = value.lastIndexOf('@');
  if (at < 1 || at === value.length - 1) return value;
  let local = value.slice(0, at);
  let domain = value.slice(at + 1);
  try {
    domain = punycode.toASCII(domain).toLowerCase();
  } catch {}

  if (recipient) {
    if (local.includes('+')) local = local.split('+')[0];
    try {
      local = punycode.toASCII(local).toLowerCase();
    } catch {}
  }

  return `${local}@${domain}`;
}

function sha256(...values) {
  return crypto.createHash('sha256').update(values.join('\0')).digest('hex');
}

//
// The sender a message can be blocked by: its From address when it passed
// DMARC, on the domain DMARC passed for (or a subdomain of it, as relaxed
// alignment allows), else null
//
function getAuthenticatedSender(session) {
  if (session?.dmarc?.status?.result !== 'pass') return null;
  const sender = normalize(session.originalFromAddress);
  if (!sender || sender.length > 320 || !isEmail(sender)) return null;
  let authenticated = String(
    session.dmarc.status.header?.from || session.dmarc.domain || ''
  ).toLowerCase();
  let domain = sender.slice(sender.lastIndexOf('@') + 1);
  try {
    authenticated = punycode.toASCII(authenticated.slice(0, 255));
    domain = punycode.toASCII(domain).toLowerCase();
  } catch {
    return null;
  }

  if (
    !authenticated ||
    (domain !== authenticated && !domain.endsWith(`.${authenticated}`))
  )
    return null;
  return sender;
}

//
// The X-Forward-Email-Report field of a copy of mail to `recipient` (ours)
// forwarded to `destination` (null when it cannot be made)
//
function createHeader({
  recipient,
  destination,
  sender,
  messageId,
  now = Date.now()
}) {
  try {
    const value = JSON.stringify({
      r: canonical(recipient, true),
      d: canonical(destination),
      s: normalize(sender),
      // (the copy's Message-ID, hashed: a field taken from one message does
      //  not block for a report of another, see `blockFromReport`)
      m: hashMessageId(messageId),
      t: now
    });
    const epoch = Math.floor(now / EPOCH);
    const field = `${epoch.toString(36)}.${encrypt(value, 16, getKey(epoch))}`;
    return field.length > MAX_FIELD ? null : field;
  } catch (err) {
    logger.fatal(err, { arf: true });
    return null;
  }
}

//
// What an X-Forward-Email-Report field we made says (null for anything else,
// and for one older than `config.arf.maxAge`)
//
function parseHeader(value, now = Date.now()) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  const field = value.replace(/\s+/g, '');
  const dot = field.indexOf('.');
  if (dot === -1 || !PERIOD.test(field.slice(0, dot))) return null;
  const epoch = Number.parseInt(field.slice(0, dot), 36);
  // (only a period a copy of the last `config.arf.maxAge` can be of)
  if (
    epoch < Math.floor((now - config.arf.maxAge) / EPOCH) ||
    epoch > Math.floor((now + CLOCK_SKEW) / EPOCH)
  )
    return null;
  let data;
  try {
    data = JSON.parse(decryptStrict(field.slice(dot + 1), getKey(epoch)));
  } catch {
    return null;
  }

  if (!data || typeof data !== 'object') return null;
  const recipient = canonical(data.r, true);
  const destination = canonical(data.d);
  const sender = normalize(data.s);
  if (![recipient, destination, sender].every((v) => v && isEmail(v)))
    return null;
  if (typeof data.m !== 'string' || !/^[\da-f]{32}$/.test(data.m)) return null;
  if (
    !Number.isFinite(data.t) ||
    Math.floor(data.t / EPOCH) !== epoch ||
    data.t > now + CLOCK_SKEW ||
    now - data.t > config.arf.maxAge
  )
    return null;
  return { recipient, destination, sender, message: data.m };
}

//
// A Message-ID as a report field names it (with or without angle brackets,
// case kept), hashed: an empty one for a message without one
//
//
// (as the MX server reads it from the copy and the report's reader from the
//  report, which reads at most its first 998 characters, the most a line
//  holds: only its visible ASCII characters, so white space, control
//  characters and one read in another encoding do not tell them apart; none
//  is the same as an empty one, so a copy without one can be reported too)
//
function hashMessageId(value) {
  const id =
    typeof value === 'string'
      ? value
          .slice(0, 998)
          .replace(/[^\u0021-\u007E]/g, '')
          .replace(/^<|>$/g, '')
      : '';
  return crypto.createHash('sha256').update(id).digest('hex').slice(0, 32);
}

// Whether a field (parsed) was made for the copy a report names by its
// Message-ID: a copy forwarded without one is named by any (a receiving
// server, e.g. Outlook.com, adds one of its own, which the report then
// names), as the field cannot be added to another message (the MX and SMTP
// servers remove it from mail they receive and send)
const NO_MESSAGE_ID = hashMessageId('');
function isReportedCopy(parsed, messageId) {
  return Boolean(
    parsed &&
      (parsed.message === NO_MESSAGE_ID ||
        parsed.message === hashMessageId(messageId))
  );
}

// (the key enforced as mail is forwarded)
function getBlockKey(recipient, destination, sender) {
  return `arf_block:${sha256(
    canonical(recipient, true),
    canonical(destination),
    normalize(sender)
  )}`;
}

// (the blocks of an alias, for its page)
function getAliasKey(aliasId) {
  return `arf_blocks:${aliasId}`;
}

function getField(destination, sender) {
  return sha256(canonical(destination), normalize(sender));
}

//
// Whether a block is one its alias's owner can see and lift: the alias still
// has the name it was blocked for and forwards to that address, its domain
// is on a paid plan, and the alias's page lists the block
//
async function isListed(client, aliasId, { recipient, destination, sender }) {
  if (!mongoose.isObjectIdOrHexString(aliasId)) return false;
  // (the alias's record of it, for this address: one for the same
  //  forwarding address and sender made while the alias had another name
  //  replaces it, and is listed instead)
  const stored = await client.hget(
    getAliasKey(aliasId),
    getField(destination, sender)
  );
  if (!stored) return false;
  try {
    if (
      canonical(JSON.parse(stored).recipient, true) !==
      canonical(recipient, true)
    )
      return false;
  } catch {
    return false;
  }

  // (required here, since the models require helpers that require this)
  const { Aliases, Domains } = require('#models');
  const alias = await Aliases.findById(aliasId)
    .select('name domain recipients is_enabled')
    .lean()
    .exec();
  // (not a disabled alias's: mail to its name goes elsewhere, e.g. to a
  //  catch-all)
  if (!alias || alias.is_enabled === false || !Array.isArray(alias.recipients))
    return false;
  const domain = await Domains.findById(alias.domain)
    .select('name plan')
    .lean()
    .exec();
  // (the alias, when it is listed)
  return domain &&
    domain.plan !== 'free' &&
    canonical(`${alias.name}@${domain.name}`, true) ===
      canonical(recipient, true) &&
    alias.recipients.some(
      (value) => canonical(value) === canonical(destination)
    )
    ? alias
    : false;
}

// (a block that could not be read, written to the console once a minute at
//  most with how many there were: the logger prints only errors in
//  production, and this may fail for every message while Redis is down)
let readErrorAt = 0;
let readErrors = 0;
function readError(err) {
  readErrors++;
  const now = Date.now();
  if (now - readErrorAt < 60_000) return;
  console.error(
    '[ARF] could not read a block (mail went on as not blocked)',
    JSON.stringify({
      // (without codes, addresses or links, as Spam Scanner's are)
      error: require('#helpers/spam-scanner').redactSecrets(
        printable(err?.message, 300)
      ),
      count: readErrors
    })
  );
  readErrorAt = now;
  readErrors = 0;
}

//
// Whether `sender` is blocked for mail to `recipient` forwarded to
// `destination` (never throws: a block that cannot be read is no block)
//
// (`resolver`, as the MX server passes it: also only while the alias's
//  domain is the one the MX server forwards that domain's mail for, see
//  `findForwardingDomain`, not one of the same name whose verification
//  record another account now has)
async function isBlocked(
  client,
  { recipient, destination, sender },
  resolver = null
) {
  if (!client || !recipient || !destination || !sender) return false;
  try {
    // (the key holds the alias it is for)
    const aliasId = await client.get(
      getBlockKey(recipient, destination, sender)
    );
    if (!aliasId) return false;
    const listed = await isListed(client, aliasId, {
      recipient,
      destination,
      sender
    });
    if (!listed || !resolver) return Boolean(listed);
    const at = canonical(recipient, true).lastIndexOf('@');
    const domain = await findForwardingDomain(
      resolver,
      canonical(recipient, true).slice(at + 1)
    );
    return Boolean(domain && String(domain._id) === String(listed.domain));
  } catch (err) {
    readError(err);
    return false;
  }
}

//
// The domain the MX server forwards `domainName`'s mail for: the one whose
// verification record its DNS holds (one, as the MX server requires), on a
// paid plan, by that domain's name (as `getForwardingConfiguration` finds
// it).  Not one of the same name someone else added to their account, whose
// verification record its DNS does not hold.
//
async function findForwardingDomain(resolver, domainName) {
  if (!resolver) return null;
  let records;
  try {
    records = await resolver.resolveTxt(punycode.toASCII(domainName));
  } catch {
    return null;
  }

  const verifications = [];
  for (const record of Array.isArray(records) ? records : []) {
    const value = (
      Array.isArray(record) ? record.join('') : String(record)
    ).trim();
    if (value.startsWith(config.paidPrefix))
      verifications.push(value.slice(config.paidPrefix.length).trim());
  }

  if (verifications.length !== 1 || !verifications[0]) return null;
  // (required here, since the models require helpers that require this)
  const { Domains } = require('#models');
  const domain = await Domains.findOne({
    verification_record: verifications[0]
  })
    .select('_id name plan')
    .lean()
    .exec();
  if (
    !domain ||
    domain.plan === 'free' ||
    punycode.toUnicode(normalize(domain.name)) !==
      punycode.toUnicode(domainName)
  )
    return null;
  return domain;
}

//
// The alias mail to `recipient` was sent to, when it is one (not a catch-all
// or regular expression) of the domain the MX server forwards for, that
// forwards to `destination` (else null)
//
async function findAlias(resolver, recipient, destination) {
  const at = recipient.lastIndexOf('@');
  const name = recipient.slice(0, at);
  const domainName = recipient.slice(at + 1);
  if (!name || name === '*' || name.startsWith('/')) return null;
  const domain = await findForwardingDomain(resolver, domainName);
  if (!domain) return null;
  const { Aliases } = require('#models');
  // (by its name as written: one beyond ASCII, which `canonical` read in
  //  punycode, as it was made)
  let unicode = name;
  try {
    unicode = punycode.toUnicode(name);
  } catch {}

  const alias = await Aliases.findOne({
    domain: domain._id,
    name: { $in: [...new Set([name, unicode])] }
  })
    .select('_id user domain recipients is_enabled')
    .lean()
    .exec();
  if (
    !alias ||
    alias.is_enabled === false ||
    !Array.isArray(alias.recipients) ||
    !alias.recipients.some((value) => canonical(value) === destination)
  )
    return null;
  return alias;
}

//
// Block the sender of an X-Forward-Email-Report field for its alias's
// forwarding address (returns whether it was blocked now)
//
// (`messageId`: the reported message's Message-ID, which must be the one of
//  the copy the field was made for)
async function blockFromReport(
  client,
  resolver,
  value,
  { now = Date.now(), messageId = '' } = {}
) {
  const parsed = parseHeader(value, now);
  if (!isReportedCopy(parsed, messageId)) return false;
  const { recipient, destination, sender } = parsed;
  const alias = await findAlias(resolver, recipient, destination);
  if (!alias) return false;

  const aliasKey = getAliasKey(alias._id);
  const field = getField(destination, sender);
  const until = now + config.arf.blockDuration;
  const dayKey = `${aliasKey}:${sha256(destination).slice(0, 16)}:${new Date(
    now
  )
    .toISOString()
    .slice(0, 10)}`;
  // (blocks that have ended are removed first, so they never count; then at
  //  most so many a day, and so many in all, for each of an alias's
  //  forwarding addresses: as one step, so reports read at once cannot pass
  //  them, nor remove a block another one made meanwhile)
  const blocked = await client.eval(
    BLOCK,
    3,
    aliasKey,
    dayKey,
    getBlockKey(recipient, destination, sender),
    now,
    field,
    JSON.stringify({ recipient, destination, sender, until }),
    // (its forwarding address as a block's value holds it, JSON written by
    //  JSON.stringify, read as text)
    `"destination":${JSON.stringify(destination)},"sender":`,
    config.arf.maxBlocksPerAlias,
    config.arf.maxBlocksPerAliasPerDay,
    config.arf.blockDuration,
    String(alias._id),
    2 * ONE_DAY
  );
  return Number(blocked) === 1;
}

//
// Make a block (KEYS the alias's list of blocks, the count of blocks made
// today for the forwarding address, and the block's enforced key; ARGV the
// time, the block's field and value, its forwarding address as its value
// holds it, the limits in all and a day, how long a block lasts, the
// alias's ID and how long the day's count is kept): 1 when it was made (or
// made again); a value is read as text ("until" is its last member), which
// every Redis runs
//
const BLOCK = `
local now = tonumber(ARGV[1])
local entries = redis.call('HGETALL', KEYS[1])
local current = 0
for i = 1, #entries, 2 do
  local value = entries[i + 1]
  local ending = tonumber(string.match(value, '"until":(%d+)}$'))
  if not ending or ending <= now then
    redis.call('HDEL', KEYS[1], entries[i])
  elseif entries[i] ~= ARGV[2] and string.find(value, ARGV[4], 1, true) then
    current = current + 1
  end
end
if redis.call('HEXISTS', KEYS[1], ARGV[2]) == 0 then
  if current >= tonumber(ARGV[5]) then return 0 end
  local today = redis.call('INCR', KEYS[2])
  if today == 1 then redis.call('PEXPIRE', KEYS[2], ARGV[9]) end
  if today > tonumber(ARGV[6]) then return 0 end
end
redis.call('HSET', KEYS[1], ARGV[2], ARGV[3])
redis.call('PEXPIRE', KEYS[1], ARGV[7])
redis.call('SET', KEYS[3], ARGV[8], 'PX', ARGV[7])
return 1
`;

//
// The senders blocked for an alias (`recipient` is its address), latest
// first
//
async function listBlocks(client, aliasId, recipient, now = Date.now()) {
  const address = canonical(recipient, true);
  const all = (await client.hgetall(getAliasKey(aliasId))) || {};
  const blocks = [];
  for (const stored of Object.values(all)) {
    try {
      const block = JSON.parse(stored);
      if (canonical(block.recipient, true) === address && block.until > now)
        blocks.push({
          destination: block.destination,
          sender: block.sender,
          until: block.until
        });
    } catch {}
  }

  return blocks.sort((a, b) => b.until - a.until);
}

//
// Lift an alias's block (returns whether there was one)
//
async function unblock(client, aliasId, destination, sender) {
  const aliasKey = getAliasKey(aliasId);
  const field = getField(destination, sender);
  const stored = await client.hget(aliasKey, field);
  if (!stored) return false;
  let block;
  try {
    block = JSON.parse(stored);
  } catch {}

  // (its enforced key only while it is this alias's: one an alias of the same
  //  name made since, e.g. after this one was renamed, is that alias's own;
  //  lifted with it, as one step, so a block never stays in force off the
  //  list; and only the block read: one a report made again meanwhile
  //  stays, with its enforced key, and none is lifted)
  const lifted = await client.eval(
    UNBLOCK,
    2,
    aliasKey,
    block && typeof block.recipient === 'string'
      ? getBlockKey(block.recipient, destination, sender)
      : `${aliasKey}:none`,
    field,
    stored,
    String(aliasId)
  );
  return Number(lifted) > 0;
}

//
// (KEYS the alias's list of blocks and the block's enforced key; ARGV its
//  field, its value as read and the alias's ID)
//
const UNBLOCK = `
if redis.call('HGET', KEYS[1], ARGV[1]) ~= ARGV[2] then return 0 end
if redis.call('GET', KEYS[2]) == ARGV[3] then redis.call('DEL', KEYS[2]) end
return redis.call('HDEL', KEYS[1], ARGV[1])
`;

module.exports = {
  HEADER,
  blockFromReport,
  canonical,
  createHeader,
  findAlias,
  getAuthenticatedSender,
  hashMessageId,
  isBlocked,
  isReportedCopy,
  listBlocks,
  parseHeader,
  unblock
};
