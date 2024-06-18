/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const revHash = require('rev-hash');
const safeStringify = require('safe-stable-stringify');

//
// generate a fingerprint for the email (returns a short md5 hash)
//
// <https://metacpan.org/pod/Email::Fingerprint>
// <https://dl.acm.org/doi/fullHtml/10.1145/1105664.1105677>
//
function getFingerprint(session, headers, body, useSender = true) {
  const arr = [];

  const sender =
    session.allowlistValue ||
    session.resolvedClientHostname ||
    session.remoteAddress;

  //
  // NOTE: `headers` can either be Headers instance
  //       or an array that looks like this:
  //       headers [
  //         { key: 'to', value: 'foo-1@example-1.com' },
  //         { key: 'from', value: 'foo-1@example-1.com' },
  //         { key: 'subject', value: 'test' }
  //       ]
  let hasHeader = false;
  for (const key of ['message-id', 'date', 'from', 'to', 'cc', 'subject']) {
    let value;
    if (Array.isArray(headers)) {
      const header = headers.find((h) => h.key === key);
      if (header && typeof header?.value === 'string') value = header.value;
    } else if (typeof headers?.getFirst === 'function') {
      value = headers.getFirst(key);
    }

    if (isSANB(value)) {
      arr.push(value);
      hasHeader = true;
    }
  }

  // this should pretty much never occur
  // and if it did, it's hard on CPU
  // (e.g. since we enforce "From" header)
  if (!hasHeader && body) arr.push(body);

  if (useSender && sender) {
    return [revHash(sender), revHash(safeStringify(arr))].join(':');
  }

  return revHash(safeStringify(arr));
}

module.exports = getFingerprint;
