/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const { isIP } = require('node:net');
const { setTimeout: delay } = require('node:timers/promises');

const RE2 = require('re2');
const ip = require('ip');
const isSANB = require('is-string-and-not-blank');

const logger = require('./logger');
const parseRootDomain = require('./parse-root-domain');

const config = require('#config');

const IP_ADDRESS = ip.address();

//
// Replies from receiving servers that limit how many sessions one sending IP
// may have at a time, or that throttle the IP itself, e.g. from Comcast:
//
// - 421 resimta-h2p-000000.sys.comcast.net Too many sessions opened
// - 421 4.2.0 x.x.x.x Throttled - try again later. Please see
//   https://postmaster.comcast.net/smtp-error-codes.php#RL000003
//
// Opening another session right away (e.g. to the next MX host, which is the
// same provider) only adds to the count, so these are deferred instead.
//
// (a "throttled" reply about a single mailbox is not about our IP, so only
// Comcast's own rate limit codes are matched for throttling)
//
const REGEX_SESSION_LIMIT = new RE2(
  /too many (?:sessions|connections|concurrent|simultaneous)|maximum number of (?:sessions|connections)|\brl\d{6}\b/i
);

//
// Comcast's rate limit of the sending domain rather than the IP (RL000010;
// RL000001 to RL000003 are about the IP): every one of our servers sends
// forwarded mail from the same domain, so they all back off
// <https://www.suped.com/knowledge/email-deliverability/troubleshooting/what-should-i-do-about-comcast-throttling-and-deferral-errors>
//
const REGEX_DOMAIN_THROTTLE = new RE2(/\brl0{4}10\b/i);

function getResponse(err) {
  return isSANB(err?.response)
    ? err.response
    : isSANB(err?.message)
    ? err.message
    : '';
}

function isSessionLimitError(err) {
  if (!err || typeof err !== 'object') return false;
  if (err.isSessionLimit === true) return true;
  if (
    !Number.isFinite(err.responseCode) ||
    err.responseCode < 400 ||
    err.responseCode >= 500
  )
    return false;
  return REGEX_SESSION_LIMIT.test(getResponse(err));
}

//
// Sessions are counted per provider (the root domain of the primary MX host,
// e.g. "comcast.net" for mx1.mxge.comcast.net), since a provider's MX hosts
// share one limit and hosted domains (not only comcast.net addresses) use them.
//
async function getSessionGroup({ target, resolver }) {
  if (!isSANB(target)) return;
  if (isIP(target)) return target;
  try {
    const records = await resolver.resolveMx(target);
    if (Array.isArray(records) && records.length > 0) {
      const [record] = [...records].sort((a, b) => a.priority - b.priority);
      if (isSANB(record?.exchange)) {
        const exchange = record.exchange.replace(/\.$/, '');
        return isIP(exchange) ? exchange : parseRootDomain(exchange);
      }
    }
  } catch (err) {
    // (mx-connect looks this up again and reports any real DNS issue)
    logger.debug(err);
  }

  return parseRootDomain(target);
}

const GLOBAL = 'global';

const getKey = (group) => `smtp_sessions:${IP_ADDRESS}:${group}`;
// (a back-off of this IP, or of all servers)
const getBackoffKey = (group, scope = IP_ADDRESS) =>
  `smtp_session_limit:${scope}:${group}`;
const getStartsKey = (group, scope, minute) =>
  `smtp_session_starts:${scope}:${group}:${minute}`;

async function getBackoffs(client, group) {
  const [ip, global] = await client.mget(
    getBackoffKey(group),
    getBackoffKey(group, GLOBAL)
  );
  return { ip: Boolean(ip), global: Boolean(global) };
}

async function getSessionLimit(client, group) {
  const limit = config.smtpSessionLimits.get(group);
  if (!Number.isFinite(limit)) return;
  const backoffs = await getBackoffs(client, group);
  if (backoffs.ip || backoffs.global)
    return Math.min(limit, config.smtpSessionLimitBackoffMax);
  return limit;
}

function createDeferral(group, target) {
  // (the provider is not named, since this reply can reach the sender)
  const err = new Error(
    '421 Too many sessions are open to the destination from this server, try again later'
  );
  err.responseCode = 421;
  err.isSessionLimit = true;
  err.isCodeBug = false;
  err.sessionGroup = group;
  err.target = target;
  return err;
}

//
// Count a new session against the limits on new sessions per minute (from
// this IP, and from all servers during a back-off of the sending domain), or
// return false if one of them is used up for this minute.
//
async function getStartLimits(client, group) {
  const backoffs = await getBackoffs(client, group);
  const limits = [
    [
      IP_ADDRESS,
      backoffs.ip || backoffs.global
        ? config.smtpSessionLimitBackoffStartsPerMinute
        : config.smtpSessionStartsPerMinute
    ]
  ];
  if (backoffs.global)
    limits.push([GLOBAL, config.smtpSessionLimitGlobalStartsPerMinute]);
  // (a limit that is not set does not limit)
  return limits.filter(([, limit]) => Number.isFinite(limit));
}

// whether a new session could start this minute (without taking one)
async function canStart(client, group) {
  const limits = await getStartLimits(client, group);
  if (limits.length === 0) return true;
  const minute = Math.floor(Date.now() / 60_000);
  const counts = await client.mget(
    limits.map(([scope]) => getStartsKey(group, scope, minute))
  );
  return counts.every(
    (count, index) => (Number.parseInt(count, 10) || 0) < limits[index][1]
  );
}

async function takeStart(client, group) {
  const limits = await getStartLimits(client, group);
  if (limits.length === 0) return true;
  const minute = Math.floor(Date.now() / 60_000);
  const multi = client.multi();
  for (const [scope] of limits) {
    const key = getStartsKey(group, scope, minute);
    multi.incr(key).pexpire(key, 120_000);
  }

  const results = await exec(multi);
  const counts = results.filter((_, index) => index % 2 === 0);
  if (counts.every((count, index) => count <= limits[index][1])) return true;

  // (give back the ones taken, so an unused limit is not used up)
  const undo = client.multi();
  for (const [scope] of limits) undo.decr(getStartsKey(group, scope, minute));
  await exec(undo);
  return false;
}

async function exec(multi) {
  const results = await multi.exec();
  for (const [err] of results) {
    if (err) throw err;
  }

  return results.map(([, value]) => value);
}

//
// Wait for one of this IP's sessions to the target's provider (if it limits
// them), and return a function that frees it again once the session is over.
// Sessions are handed out in the order they were asked for (by rank in a
// sorted set scored by expiry), and stale ones expire on their own.
// Errors with Redis never stop delivery (the session is just not counted).
//
async function acquireSmtpSession({ client, resolver, target }) {
  const noop = () => {};
  if (!client || !resolver) return noop;

  let group;
  let key;
  let token;
  try {
    group = await getSessionGroup({ target, resolver });
    if (!group) return noop;

    let limit = await getSessionLimit(client, group);
    if (!Number.isFinite(limit)) return noop;

    key = getKey(group);
    token = randomUUID();
    const now = Date.now();
    await exec(
      client
        .multi()
        .zremrangebyscore(key, '-inf', now)
        .zadd(key, now + config.smtpSessionTTL, token)
        .pexpire(key, config.smtpSessionTTL)
    );

    // (no use waiting for a session that could not start this minute)
    if (!(await canStart(client, group))) {
      await client.zrem(key, token);
      throw createDeferral(group, target);
    }

    const expiresAt = now + config.smtpSessionLimitWait;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const [, rank] = await exec(
        client
          .multi()
          .zremrangebyscore(key, '-inf', Date.now())
          .zrank(key, token)
      );
      if (Number.isFinite(rank) && rank < limit) break;

      if (Date.now() >= expiresAt) {
        await client.zrem(key, token);
        throw createDeferral(group, target);
      }

      await delay(100 + Math.round(Math.random() * 150));
      // (the limit drops while backing off, and rises again after)

      limit = await getSessionLimit(client, group);
      if (!Number.isFinite(limit)) break;
    }

    // (a delivery past the limit on new sessions this minute is deferred
    // without connecting, instead of waiting a minute)
    if (Number.isFinite(limit) && !(await takeStart(client, group))) {
      await client.zrem(key, token);
      throw createDeferral(group, target);
    }
  } catch (err) {
    if (err.isSessionLimit) throw err;
    logger.error(err);
    if (key && token)
      client
        .zrem(key, token)
        .then()
        .catch(() => {});
    return noop;
  }

  let released = false;
  return () => {
    if (released) return;
    released = true;
    client
      .zrem(key, token)
      .then()
      .catch((err) => logger.error(err));
  };
}

//
// The receiving server said this IP has too many sessions open (or is
// throttled), so allow fewer sessions to its provider for a while: from this
// IP, or from all servers when the throttle is about the sending domain. A
// back-off that still gets such replies after the first half of it doubles in
// length (replies to deliveries already under way when it began do not
// count), up to the maximum.
// (only for providers with a limit, so a reply from one server does not slow
// down every domain hosted by a large provider)
//
async function backOffSmtpSessions({ client, resolver, target, err }) {
  if (!client || !resolver) return;
  try {
    const group = await getSessionGroup({ target, resolver });
    if (!group || !config.smtpSessionLimits.has(group)) return;
    const key = getBackoffKey(
      group,
      REGEX_DOMAIN_THROTTLE.test(getResponse(err)) ? GLOBAL : IP_ADDRESS
    );

    const getDuration = (level) =>
      Math.min(
        config.smtpSessionLimitBackoff * 2 ** Math.min(level, 20),
        config.smtpSessionLimitBackoffMaxDuration
      );

    const now = Date.now();
    const value = await client.get(key);
    let level = 0;
    if (value) {
      const [previous, since] = String(value).split(':').map(Number);
      const current = Number.isFinite(previous) ? previous : 0;
      level =
        Number.isFinite(since) && now - since < getDuration(current) / 2
          ? current
          : current + 1;
      // (the same back-off: keep it, unless it is to get longer)
      if (level === current) return;
    }

    const duration = getDuration(level);
    await client.set(key, `${level}:${now}`, 'PX', duration);
    logger.warn('smtp session back-off', {
      group,
      scope: key,
      level,
      duration
    });
  } catch (err_) {
    logger.error(err_);
  }
}

module.exports = {
  acquireSmtpSession,
  backOffSmtpSessions,
  getSessionGroup,
  isSessionLimitError
};
