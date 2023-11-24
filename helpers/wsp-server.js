/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const isSANB = require('is-string-and-not-blank');
const revHash = require('rev-hash');

const parsePayload = require('#helpers/parse-payload');
const logger = require('#helpers/logger');

// instead of having a websocket we're focusing on performance since we're local to the fs
// <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof#instanceof_and_hasinstance>
const wsp = {
  [Symbol.for('isWSP')]: true
};
wsp.request = async function (data) {
  try {
    if (typeof data?.action !== 'string') throw new TypeError('Action missing');

    // generate request id
    data.id = isSANB(data?.session?.user?.alias_id)
      ? `${revHash(data.session.user.alias_id)}:${revHash(randomUUID())}`
      : `${data.action}:${randomUUID()}`;

    const response = await parsePayload.call(this, data);
    return response.data;
  } catch (err) {
    logger.fatal(err);
    err.isCodeBug = true;
    throw err;
  }
};

module.exports = wsp;
