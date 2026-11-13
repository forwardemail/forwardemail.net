/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// What Spam Scanner's classifier learned from abuse reports, shared by every
// server and process through Redis (see `helpers/arf-report.js`).
//
// A message reported as spam is kept as its classifier features, hashed as a
// model holds them (32-bit numbers), each counted once more as spam in a hash
// of the day it was learned on, with the number of messages that day.  A day
// expires as a whole after `config.arf.learnDays`, so what was learned ages
// out; a version counter goes up with each message learned, so each process
// reads the days again only when something was learned (see
// `helpers/spam-scanner.js`), and hands the counts to its workers, which add
// them to the default classifier (see `helpers/spam-scanner-worker.js`).
//

const crypto = require('node:crypto');
const { setImmediate } = require('node:timers/promises');

const config = require('#config');

const PREFIX = 'spam_scanner_learned';
const VERSION_KEY = `${PREFIX}:version`;
// (the field of a day's hash with the number of messages learned that day;
//  every other field is a feature hash, a number)
const MESSAGES_FIELD = 'n';
const ONE_DAY = 24 * 60 * 60 * 1000;

function getDayKey(time) {
  return `${PREFIX}:${new Date(time).toISOString().slice(0, 10)}`;
}

//
// Check a day's limits and learn a message, as one step, so reports read at
// the same time (e.g. by each MX server) cannot each pass the limits:
// KEYS the day's hash, the message's key, the version counter, the counts
// of the day's messages from the party that reported it and from its group
// (the account that sent it or owns the alias it was forwarded for), and of
// the new features its group added that day; ARGV the limits (messages a
// day, features a day, times a feature a day), how long the message's key
// and the day are kept, the limits of messages a day from one party and one
// group and of new features a day from one group, then its features.  Past
// the features a day, or its group's, only those learned already that day
// are counted (in the order given), so no group stops the others learning.
// Returns 1 when it was learned.
//
const LEARN = `
local day, seen, version, party, group, groupFeatures = KEYS[1], KEYS[2], KEYS[3], KEYS[4], KEYS[5], KEYS[6]
local maxMessages = tonumber(ARGV[1])
local maxFeatures = tonumber(ARGV[2])
local maxPerFeature = tonumber(ARGV[3])
local maxPerParty = tonumber(ARGV[6])
local maxPerGroup = tonumber(ARGV[7])
local maxPerGroupFeatures = tonumber(ARGV[8])
if redis.call('EXISTS', seen) == 1 then return 0 end
if tonumber(redis.call('GET', party) or '0') >= maxPerParty then return 0 end
if tonumber(redis.call('GET', group) or '0') >= maxPerGroup then return 0 end
local messages = tonumber(redis.call('HGET', day, '${MESSAGES_FIELD}') or '0')
if messages >= maxMessages then return 0 end
local size = redis.call('HLEN', day)
if redis.call('HEXISTS', day, '${MESSAGES_FIELD}') == 1 then size = size - 1 end
local groupAdded = tonumber(redis.call('GET', groupFeatures) or '0')
local room = math.min(maxFeatures - size, maxPerGroupFeatures - groupAdded)
local learned = {}
local added = 0
for i = 9, #ARGV do
  local count = tonumber(redis.call('HGET', day, ARGV[i]) or '0')
  if count == 0 then
    if added < room then
      added = added + 1
      learned[#learned + 1] = ARGV[i]
    end
  elseif count < maxPerFeature then
    learned[#learned + 1] = ARGV[i]
  end
end
if #learned == 0 then return 0 end
redis.call('SET', seen, '1', 'PX', ARGV[4])
for _, field in ipairs(learned) do redis.call('HINCRBY', day, field, 1) end
redis.call('HINCRBY', day, '${MESSAGES_FIELD}', 1)
redis.call('PEXPIRE', day, ARGV[5])
redis.call('INCR', party)
redis.call('PEXPIRE', party, 2 * 86400000)
redis.call('INCR', group)
redis.call('PEXPIRE', group, 2 * 86400000)
if added > 0 then
  redis.call('INCRBY', groupFeatures, added)
  redis.call('PEXPIRE', groupFeatures, 2 * 86400000)
end
redis.call('INCR', version)
return 1
`;

//
// Learn one message as spam: `features` are its feature hashes (see
// `analyzeArf` in `helpers/spam-scanner-worker.js`), learned once however
// often it is reported (by its `id`, e.g. its Message-ID, with its
// features: a reporter cannot keep another message from being learned by
// giving its Message-ID to one of its own first), and `party` who reported
// it (the mailbox it was sent or forwarded to), of whom at most
// `config.arf.maxLearnedPerPartyPerDay` messages are learned a day, and
// `group` (the domain it was sent from or forwarded for), of which at most
// `config.arf.maxLearnedPerGroupPerDay`.  Each feature is learned at most
// `config.arf.maxLearnedPerFeaturePerDay` times a day (so reports of many
// copies of one message move it only so far), and only features the day does
// not have yet count toward its limit.  Returns whether it was learned (not
// when it was learned before, or a day's limits were reached).
//
async function learnSpam(
  client,
  { id, features, party, group, now = Date.now() }
) {
  if (
    !client ||
    !(features instanceof Uint32Array) ||
    features.length === 0 ||
    typeof party !== 'string' ||
    party === '' ||
    typeof group !== 'string' ||
    group === ''
  )
    return false;
  // (each once, in order, so the same features are the same message)
  const unique = [...new Set(features)].sort((a, b) => a - b);
  const fields = unique.map(String);
  const sha = (value) =>
    crypto.createHash('sha256').update(value).digest('hex');
  const seen = `${PREFIX}_message:${sha(
    `${String(id ?? '')}\0${fields.join(',')}`
  )}`;
  const date = new Date(now).toISOString().slice(0, 10);
  const learned = await client.eval(
    LEARN,
    6,
    getDayKey(now),
    seen,
    VERSION_KEY,
    `${PREFIX}_party:${sha(party)}:${date}`,
    `${PREFIX}_group:${sha(group)}:${date}`,
    `${PREFIX}_group_features:${sha(group)}:${date}`,
    config.arf.maxLearnedPerDay,
    config.arf.maxLearnedFeaturesPerDay,
    config.arf.maxLearnedPerFeaturePerDay,
    config.arf.learnDays * ONE_DAY,
    (config.arf.learnDays + 1) * ONE_DAY,
    config.arf.maxLearnedPerPartyPerDay,
    config.arf.maxLearnedPerGroupPerDay,
    config.arf.maxLearnedFeaturesPerGroupPerDay,
    ...fields
  );
  return Number(learned) === 1;
}

//
// The version of what was learned (null: nothing was), with the day, so what
// is learned is read again each day (the oldest day has expired) even when
// nothing new was learned
//
async function getLearnedVersion(client, now = Date.now()) {
  const version = await client.get(VERSION_KEY);
  return typeof version === 'string' && version !== ''
    ? `${version}:${new Date(now).toISOString().slice(0, 10)}`
    : null;
}

//
// Everything learned in the last `config.arf.learnDays` days, as a worker
// adds it to the default classifier: the messages learned (`nspam`), and the
// feature hashes in increasing order with the times each was learned as spam
//
async function loadLearned(client, version, now = Date.now()) {
  const keys = [];
  for (let i = 0; i < config.arf.learnDays; i++)
    keys.push(getDayKey(now - i * ONE_DAY));
  // (a day before yesterday is learned to no longer, so it is read once and
  //  kept, as sorted arrays; today and yesterday are read again each time,
  //  yesterday for reports learned on servers whose day had not ended yet)
  let days = dayCaches.get(client);
  if (!days) {
    days = new Map();
    dayCaches.set(client, days);
  }

  for (const key of days.keys()) if (!keys.includes(key)) days.delete(key);
  // (a day kept is read again when its count of messages is no longer the
  //  one read, e.g. after what was learned was deleted)
  const kept = keys.filter((key, i) => i >= 2 && days.has(key));
  if (kept.length > 0) {
    const checking = client.pipeline();
    for (const key of kept) checking.hget(key, MESSAGES_FIELD);
    const checked = await checking.exec();
    for (const [i, [err, messages]] of checked.entries()) {
      if (err) throw err;
      if ((messages ?? null) !== days.get(kept[i]).messages)
        days.delete(kept[i]);
    }
  }

  const read = keys.filter((key, i) => i < 2 || !days.has(key));
  const pipeline = client.pipeline();
  for (const key of read) pipeline.hgetall(key);
  const results = await pipeline.exec();
  for (const [i, [err, day]] of results.entries()) {
    if (err) throw err;
    days.set(read[i], toDay(day));
    // (a day at a time, letting the server's other work go on between them)
    await setImmediate();
  }

  let nspam = 0;
  let merged = { keys: new Uint32Array(0), spam: new Uint32Array(0) };
  for (const key of keys) {
    const day = days.get(key);
    nspam += day.nspam;
    merged = mergeDays(merged, day);
    await setImmediate();
  }

  return { version, nspam, keys: merged.keys, spam: merged.spam };
}

// (the days read, by Redis client and day's key)
const dayCaches = new WeakMap();

// a day's hash as the messages learned and its feature hashes in increasing
// order, with the times each was learned that day
function toDay(day) {
  const counts = new Map();
  let nspam = 0;
  if (day && typeof day === 'object')
    for (const [field, value] of Object.entries(day)) {
      const count = Number.parseInt(value, 10);
      if (!Number.isSafeInteger(count) || count <= 0) continue;
      if (field === MESSAGES_FIELD) {
        nspam += count;
        continue;
      }

      // (only 32-bit feature hashes, as a model holds them)
      if (!/^\d{1,10}$/.test(field)) continue;
      const hash = Number(field);
      if (hash > 0xff_ff_ff_ff) continue;
      counts.set(hash, (counts.get(hash) || 0) + count);
    }

  const keys = Uint32Array.from(counts.keys()).sort();
  const spam = new Uint32Array(keys.length);
  for (const [i, hash] of keys.entries())
    spam[i] = Math.min(counts.get(hash), 0xff_ff_ff_ff);
  // (its count of messages as stored, to tell it changed, see `loadLearned`)
  const messages =
    day && typeof day === 'object' && typeof day[MESSAGES_FIELD] === 'string'
      ? day[MESSAGES_FIELD]
      : null;
  return { nspam, keys, spam, messages };
}

// two days' sorted feature hashes as one, their times added
function mergeDays(a, b) {
  const keys = new Uint32Array(a.keys.length + b.keys.length);
  const spam = new Uint32Array(keys.length);
  let i = 0;
  let j = 0;
  let n = 0;
  while (i < a.keys.length || j < b.keys.length) {
    if (j >= b.keys.length || (i < a.keys.length && a.keys[i] < b.keys[j])) {
      keys[n] = a.keys[i];
      spam[n++] = a.spam[i++];
    } else if (i >= a.keys.length || b.keys[j] < a.keys[i]) {
      keys[n] = b.keys[j];
      spam[n++] = b.spam[j++];
    } else {
      keys[n] = a.keys[i];
      spam[n++] = Math.min(a.spam[i++] + b.spam[j++], 0xff_ff_ff_ff);
    }
  }

  return { keys: keys.slice(0, n), spam: spam.slice(0, n) };
}

module.exports = {
  learnSpam,
  getLearnedVersion,
  loadLearned,
  getDayKey,
  VERSION_KEY
};
