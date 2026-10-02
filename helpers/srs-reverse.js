/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');

const config = require('#config');
const logger = require('#helpers/logger');

//
// An SRS address (`SRS0=HHH=TT=example.com=user@WEB_HOST`) reverses to its
// original sender for up to `config.srs.maxAge` days, and a message sent to
// it is relayed there (e.g. a bounce of a message we forwarded).  The hash
// only covers the address and the day, so on its own one SRS address would
// relay any number of messages to that sender from our servers.
//
// Each destination that accepted a message we forward with an SRS envelope
// sender (or each recipient of a message we send with one) grants a few
// reverse deliveries to that SRS address (a delay notice and the final
// bounce from its server, and an auto-reply), once however often the message
// is retried, so mail to an SRS address is only relayed in reply to mail we
// forwarded or sent, at most a few times per destination.
//
// A reverse delivery is used when the reply is resolved (`getRecipients`)
// and recorded on the session, and a reply is only relayed with one.  It is
// spent once the reply is relayed, and given back when it was not (see
// `helpers/on-data`): e.g. when the reply is refused for now (as its sender
// retries it), refused for good, or skipped because an earlier attempt of it
// already relayed it (a retry that is not refused even without a reverse
// delivery left, see `getRecipients`).
//
const TTL = ms(`${config.srs.maxAge}d`);

function getKey(srsAddress) {
  return `srs_reverse:${srsAddress.toLowerCase()}`;
}

async function grantSrsReverse(client, srsAddress, count = 1) {
  try {
    const key = getKey(srsAddress);
    await client.pipeline().incrby(key, count).pexpire(key, TTL).exec();
  } catch (err) {
    logger.fatal(err);
  }
}

//
// Grant reverse deliveries for a message (or a destination of it) only once
// per SRS address, as it is sent again on every attempt (`id` names the
// message, or the message and the destination).  A retry on a later day has
// a new SRS address (its timestamp), and is granted its own.
//
async function grantSrsReverseOnce(client, srsAddress, id, count = 1) {
  try {
    const added = await client.set(
      `srs_reverse_granted:${id}:${srsAddress.toLowerCase()}`,
      '1',
      'PX',
      TTL,
      'NX'
    );
    if (added) await grantSrsReverse(client, srsAddress, count);
  } catch (err) {
    logger.fatal(err);
  }
}

// (atomic, so a grant made at the same time is never lost)
const USE_SCRIPT = `
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count <= 0 then return 0 end
redis.call('DECR', KEYS[1])
return 1
`;

//
// Use a reverse delivery to an SRS address for the message of `session`
// (recorded on it, see `spendSrsReverse` and `restoreSrsReverses`)
//
async function useSrsReverse(client, srsAddress, session) {
  const used = (await client.eval(USE_SCRIPT, 1, getKey(srsAddress))) === 1;
  if (used && session) {
    session.srsReversesUsed ||= [];
    session.srsReversesUsed.push({ srsAddress, settled: false });
  }

  return used;
}

// the reverse delivery the message of `session` used for an SRS address and
// that it has not relayed (or given back) yet
function findSrsReverse(session, srsAddress) {
  if (!isSANB(srsAddress) || !Array.isArray(session?.srsReversesUsed)) return;
  return session.srsReversesUsed.find(
    (use) =>
      !use.settled && use.srsAddress.toLowerCase() === srsAddress.toLowerCase()
  );
}

//
// Whether the message of `session` holds a reverse delivery to an SRS
// address (only then is it relayed there)
//
function hasSrsReverse(session, srsAddress) {
  return Boolean(findSrsReverse(session, srsAddress));
}

//
// A reverse delivery of the message was relayed (so it is spent)
//
function spendSrsReverse(session, srsAddress) {
  const use = findSrsReverse(session, srsAddress);
  if (use) use.settled = true;
}

//
// Give back the reverse deliveries of a message that were not relayed
// (`session.srsReversesUsed`)
//
async function restoreSrsReverses(client, uses) {
  if (!Array.isArray(uses)) return;
  for (const use of uses) {
    if (use.settled || !isSANB(use.srsAddress)) continue;
    use.settled = true;
    await grantSrsReverse(client, use.srsAddress);
  }
}

module.exports = {
  grantSrsReverse,
  grantSrsReverseOnce,
  hasSrsReverse,
  restoreSrsReverses,
  spendSrsReverse,
  useSrsReverse
};
