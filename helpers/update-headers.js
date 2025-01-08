/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

//
// NOTE: we pass `headers` here because we don't want to update header values
//       for those that were signed with someone's DKIM signature
//       (e.g. algolia.com signs via mailjet with X-Report-Abuse-To as a key)
//       and if we modify it then the header chain will break of course
//
function updateHeaders(headers, session) {
  const keys = new Set();

  if (
    Array.isArray(session?.dkim?.results) &&
    session.dkim.results.length > 0
  ) {
    for (const result of session.dkim.results) {
      if (typeof result?.signingHeaders?.keys !== 'string') continue;
      for (const key of result.signingHeaders.keys.split(':')) {
        keys.add(key.toLowerCase().trim());
      }
    }
  }

  if (!keys.has('x-report-abuse-to'))
    headers.add('X-Report-Abuse-To', config.abuseEmail); // , headers.lines.length);

  if (!keys.has('x-report-abuse'))
    headers.add('X-Report-Abuse', config.abuseEmail); // , headers.lines.length);

  if (!keys.has('x-complaints-to'))
    headers.add('X-Complaints-To', config.abuseEmail); // , headers.lines.length);

  headers.add('X-Forward-Email-Website', config.urls.web);

  headers.add(
    'X-Forward-Email-Version',
    config.pkg.version
    // headers.lines.length
  );
}

module.exports = updateHeaders;
