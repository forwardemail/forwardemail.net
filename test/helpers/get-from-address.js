/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The From address used by every check after DMARC must be the address
// DMARC authenticated: the one in the angle brackets, also when the display
// name is itself (or contains) another address.
//

const { SRS } = require('sender-rewriting-scheme');
const test = require('ava');

const config = require('#config');
const env = require('#config/env');
const getFromAddress = require('#helpers/get-from-address');

const srs = new SRS(config.srs);

test('the From address is the one in the angle brackets', (t) => {
  for (const [from, expected] of [
    // display name that is (or starts with) another address
    ['support@example.com <attacker@evil.com>', 'attacker@evil.com'],
    ['support@example.com<attacker@evil.com>', 'attacker@evil.com'],
    ['alice@example.org via Group <group@example.net>', 'group@example.net'],
    ['sales@company.com [via CRM] <noreply@crm.com>', 'noreply@crm.com'],
    ['JOHN@EXAMPLE.COM <john@example.com>', 'john@example.com'],
    // ordinary headers are read as before
    ['john@example.com', 'john@example.com'],
    ['<john@example.com>', 'john@example.com'],
    ['John Doe <john@example.com>', 'john@example.com'],
    ['"Doe, John" <john@example.com>', 'john@example.com'],
    ['john@example.com (John Doe)', 'john@example.com'],
    ['"support@paypal.com" <x@evil.com>', 'x@evil.com'],
    ["'alice@example.org' via Group <group@example.net>", 'group@example.net'],
    [
      'Alice (alice@example.org) via Group <group@example.net>',
      'group@example.net'
    ],
    ['=?UTF-8?B?Sm9obiBEb2U=?= <john@example.com>', 'john@example.com'],
    ['User <user+tag@sub.example.co.uk>', 'user+tag@sub.example.co.uk'],
    ['José <josé@exämple.com>', 'josé@xn--exmple-cua.com'],
    ['Group: John <john@example.com>;', 'john@example.com'],
    ['Name <john@example.com>, ', 'john@example.com']
  ])
    t.is(getFromAddress(from), expected, `${from}`);
});

test('headers without exactly one address are still refused', (t) => {
  for (const from of [
    '"MAILER-DAEMON" <>',
    'undisclosed-recipients:;',
    'a@example.com, b@example.com'
  ]) {
    const err = t.throws(() => getFromAddress(from));
    t.regex(err.message, /one valid email address/);
  }
});

test('an SRS From address is reversed only on our own domain', (t) => {
  const ours = srs.forward('support@example.com', env.WEB_HOST);
  t.is(getFromAddress(`Support <${ours}>`), 'support@example.com');
  // (its signature does not cover its domain: one we made, put on a domain
  //  someone else controls, is not reversed, so it cannot pass as the
  //  address it reverses to, e.g. one on our own domain)
  const local = ours.slice(0, ours.lastIndexOf('@'));
  const forged = `${local}@attacker.example`;
  t.is(getFromAddress(`Support <${forged}>`), forged.toLowerCase());
});
