/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const isGoogleMX = require('#helpers/is-google-mx');

function resolverFor(records) {
  return {
    async resolveMx(host) {
      if (!records[host]) {
        const err = new Error(`queryMx ENOTFOUND ${host}`);
        err.code = 'ENOTFOUND';
        throw err;
      }

      return records[host];
    }
  };
}

const resolver = resolverFor({
  'gmail.com': [
    { exchange: 'alt1.gmail-smtp-in.l.google.com', priority: 10 },
    { exchange: 'gmail-smtp-in.l.google.com', priority: 5 }
  ],
  'workspace.example': [{ exchange: 'smtp.google.com.', priority: 1 }],
  'legacy.example': [{ exchange: 'aspmx2.googlemail.com', priority: 5 }],
  'outlook.example': [
    { exchange: 'outlook-example.mail.protection.outlook.com', priority: 0 }
  ],
  'backup.example': [
    { exchange: 'mx.backup.example', priority: 0 },
    { exchange: 'aspmx.l.google.com', priority: 10 }
  ],
  'lookalike.example': [{ exchange: 'google.com.evil.example', priority: 0 }]
});

test('detects gmail.com and Google Workspace destinations', async (t) => {
  t.true(await isGoogleMX(resolver, 'gmail.com'));
  t.true(await isGoogleMX(resolver, 'workspace.example'));
  t.true(await isGoogleMX(resolver, 'legacy.example'));
});

test('uses the most preferred MX record', async (t) => {
  t.false(await isGoogleMX(resolver, 'backup.example'));
});

test('does not match other or look-alike destinations', async (t) => {
  t.false(await isGoogleMX(resolver, 'outlook.example'));
  t.false(await isGoogleMX(resolver, 'lookalike.example'));
});

test('does not match IP, invalid, or unresolvable hosts', async (t) => {
  t.false(await isGoogleMX(resolver, '127.0.0.1'));
  t.false(await isGoogleMX(resolver, ''));
  t.false(await isGoogleMX(resolver, undefined));
  t.false(await isGoogleMX(resolver, 'missing.example'));
});
