/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const config = require('#config');

function updateHeaders(headers) {
  for (const key of [
    'x-report-abuse-to',
    'x-report-abuse',
    'x-complaints-to',
    'x-forwardemail-version'
  ]) {
    headers.remove(key);
  }

  headers.add('X-Report-Abuse-To', config.abuseEmail, headers.lines.length);
  headers.add('X-Report-Abuse', config.abuseEmail, headers.lines.length);
  headers.add('X-Complaints-To', config.abuseEmail, headers.lines.length);
  headers.add(
    'X-ForwardEmail-Version',
    config.pkg.version,
    headers.lines.length
  );
}

module.exports = updateHeaders;
