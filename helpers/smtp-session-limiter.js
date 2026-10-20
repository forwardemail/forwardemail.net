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

function isSessionLimitError(err) {
  if (!err || typeof err !== 'object') return false;
  if (err.isSessionLimit === true) return true;
  if (
    !Number.isFinite(err.responseCode) ||
    err.responseCode < 400 ||
    err.responseCode >= 500
  )
    return false;
  const response = isSANB(err.response)
    ? err.response
    : isSANB(err.message)
    ? err.message
    : '';
  return REGEX_SESSION_LIMIT.test(response);
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

const getKey = (group) => `smtp_sessions:${IP_ADDRESS}:${group}`;
const getBackoffKey = (group) => `smtp_session_limit:${IP_ADDRESS}:${group}`;

async function getSessionLimit(client, group) {
  const limit = config.smtpSessionLimits.get(group);
  if (!Number.isFinite(limit)) return;
  if (await client.exists(getBackoffKey(group)))
    return Math.min(limit, config.smtpSessionLimitBackoffMax);
  return limit;
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
        // (the provider is not named, since this reply can reach the sender)
        const err = new Error(
          '421 Too many sessions are open to the destination from this server, try again later'
        );
        err.responseCode = 421;
        err.isSessionLimit = true;
        err.isCodeBug = false;
        err.sessionGroup = group;
        err.target = target;
        throw err;
      }

      await delay(100 + Math.round(Math.random() * 150));
      // (the limit drops while backing off, and rises again after)

      limit = await getSessionLimit(client, group);
      if (!Number.isFinite(limit)) break;
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
// throttled), so allow fewer sessions to its provider for a while.
// (only for providers with a limit, so a reply from one server does not slow
// down every domain hosted by a large provider)
//
async function backOffSmtpSessions({ client, resolver, target }) {
  if (!client || !resolver) return;
  try {
    const group = await getSessionGroup({ target, resolver });
    if (group && config.smtpSessionLimits.has(group))
      await client.set(
        getBackoffKey(group),
        true,
        'PX',
        config.smtpSessionLimitBackoff
      );
  } catch (err) {
    logger.error(err);
  }
}

module.exports = {
  acquireSmtpSession,
  backOffSmtpSessions,
  getSessionGroup,
  isSessionLimitError
};
