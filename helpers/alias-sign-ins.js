/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { isIP } = require('node:net');

const ipaddr = require('ipaddr.js');
const ms = require('ms');

const logger = require('#helpers/logger');

//
// Recent successful sign-ins to an alias (the service and the IP address it
// was signed in from), so its owner can spot one they do not recognize (see
// #531).
//
// They are kept in Redis only: one entry for each service and IP address,
// with the time of the latest sign-in, for 7 days and at most 50 of them.
//
const MAX_AGE = ms('7d');
const MAX_COUNT = 50;
// (a sign-in from the same service and address within this is not recorded
// again, since mail apps and webmail sign in for every connection or request)
const THROTTLE = ms('1m');
const SERVICES = new Set([
  'smtp',
  'imap',
  'pop3',
  'caldav',
  'carddav',
  'api',
  'managesieve'
]);

function getKey(aliasId) {
  return `alias_sign_ins:${aliasId}`;
}

// (e.g. an IPv4 address that a socket reports as IPv4-mapped IPv6, such as
// "::ffff:192.0.2.1", is the IPv4 address)
function normalizeAddress(address) {
  if (typeof address !== 'string' || isIP(address.trim()) === 0) return;
  try {
    return ipaddr.process(address.trim()).toString();
  } catch {}
}

//
// Never throws (a sign-in must never fail because it could not be recorded)
//
async function recordSignIn(client, aliasId, service, remoteAddress) {
  try {
    const address = normalizeAddress(remoteAddress);
    if (
      !client ||
      typeof aliasId !== 'string' ||
      aliasId.length === 0 ||
      !SERVICES.has(service) ||
      !address
    )
      return;

    const member = JSON.stringify([service, address]);
    const isNew = await client.set(
      `${getKey(aliasId)}:${member}`,
      '1',
      'PX',
      THROTTLE,
      'NX'
    );
    if (isNew !== 'OK') return;

    const key = getKey(aliasId);
    const now = Date.now();
    await client
      .pipeline()
      .zadd(key, now, member)
      .zremrangebyscore(key, '-inf', now - MAX_AGE)
      .zremrangebyrank(key, 0, -(MAX_COUNT + 1))
      .pexpire(key, MAX_AGE)
      .exec();
  } catch (err) {
    logger.debug(err);
  }
}

// newest first, as `{ service, remote_address, date }`
async function getSignIns(client, aliasId) {
  if (!client || typeof aliasId !== 'string' || aliasId.length === 0) return [];

  const results = await client.zrevrangebyscore(
    getKey(aliasId),
    '+inf',
    Date.now() - MAX_AGE,
    'WITHSCORES',
    'LIMIT',
    0,
    MAX_COUNT
  );

  const signIns = [];
  for (let i = 0; i < results.length; i += 2) {
    let parsed;
    try {
      parsed = JSON.parse(results[i]);
    } catch {
      continue;
    }

    if (!Array.isArray(parsed) || parsed.length !== 2) continue;
    const [service, address] = parsed;
    const date = new Date(Number(results[i + 1]));
    if (!SERVICES.has(service) || !normalizeAddress(address)) continue;
    if (Number.isNaN(date.getTime())) continue;
    signIns.push({ service, remote_address: address, date });
  }

  return signIns;
}

module.exports = { recordSignIn, getSignIns, MAX_AGE, MAX_COUNT };
