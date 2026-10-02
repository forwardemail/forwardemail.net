/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
// Each message we forward with an SRS envelope sender grants one reverse
// delivery to that SRS address, so mail to an SRS address is only relayed
// in reply to (at most as often as) mail we forwarded.
//
const TTL = ms(`${config.srs.maxAge}d`);

function getKey(srsAddress) {
  return `srs_reverse:${srsAddress.toLowerCase()}`;
}

async function grantSrsReverse(client, srsAddress) {
  try {
    const key = getKey(srsAddress);
    await client.pipeline().incr(key).pexpire(key, TTL).exec();
  } catch (err) {
    logger.fatal(err);
  }
}

async function useSrsReverse(client, srsAddress) {
  const key = getKey(srsAddress);
  const count = await client.decr(key);
  if (count >= 0) return true;
  // nothing was granted (or it was used up), so undo the decrement
  await (count === -1 ? client.del(key) : client.incr(key));
  return false;
}

module.exports = { grantSrsReverse, useSrsReverse };
