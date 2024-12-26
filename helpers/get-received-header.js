/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   ZoneMTA is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/zone-eu/zone-mta
 */

const os = require('node:os');

const isEmail = require('#helpers/is-email');

const HOSTNAME = os.hostname();

function getReceivedHeader(delivery) {
  let origin = delivery.origin ? '[' + delivery.origin + ']' : '';
  const originhost =
    delivery.originhost && delivery.originhost.charAt(0) !== '['
      ? delivery.originhost
      : false;
  // eslint-disable-next-line unicorn/prefer-spread
  origin = [origin || []].flat().concat(originhost || []);

  origin =
    origin.length > 1
      ? '(' + origin.join(' ') + ')'
      : origin.join(' ').trim() || 'localhost';

  // safeguard
  if (delivery.recipient && !isEmail(delivery.recipient)) {
    const err = new TypeError('Recipient must be a valid email address');
    err.isCodeBug = true;
    throw err;
  }

  const value =
    '' +
    // from ehlokeyword
    'from' +
    (delivery.transhost ? ' ' + delivery.transhost : '') +
    // [1.2.3.4]
    ' ' +
    origin +
    (originhost ? '\r\n' : '') +
    // by smtphost
    ' by ' +
    HOSTNAME +
    ' (Forward Email)' +
    // with ESMTP
    ' with ' +
    delivery.transtype +
    // id 12345678
    // ' id ' +
    // delivery.id +
    // '.' +
    // delivery.seq +
    '\r\n' +
    //
    // NOTE: according to RFC 5321 Section 4.4 and 7.2 a FOR clause in the Received header
    //       (which is used for "Trace Information" can only contain exactly ONE entry even when multiple RCPT TO appears
    //
    //       > 'Multiple <path>s raise some security issues and have been deprecated'
    //
    //       <https://www.rfc-editor.org/rfc/rfc5321#section-4.4:~:text=If%20the%20FOR%20clause%20appears%2C%20it%20MUST%20contain%20exactly%20one%20%3Cpath%3E%0A%20%20%20%20%20%20entry%2C%20even%20when%20multiple%20RCPT%20commands%20have%20been%20given.%20%20Multiple%0A%20%20%20%20%20%20%3Cpath%3Es%20raise%20some%20security%20issues%20and%20have%20been%20deprecated%2C%20see%0A%20%20%20%20%20%20Section%207.2.>
    //
    // for <receiver@example.com>
    (delivery.recipient ? ` for <${delivery.recipient}>` : '') +
    // (version=TLSv1/SSLv3 cipher=ECDHE-RSA-AES128-GCM-SHA256)
    (delivery.tls
      ? '\r\n (version=' +
        delivery.tls.version +
        ' cipher=' +
        delivery.tls.name +
        ')'
      : '') +
    ';' +
    '\r\n' +
    // Wed, 03 Aug 2016 11:32:07 +0000
    ' ' +
    new Date(delivery.time).toUTCString().replace(/GMT/, '+0000');
  return value;
}

module.exports = getReceivedHeader;
