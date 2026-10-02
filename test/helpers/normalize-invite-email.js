/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const normalizeInviteEmail = require('#helpers/normalize-invite-email');

test('an invite address and an account address compare in one form', (t) => {
  t.is(normalizeInviteEmail('  Jane@Example.COM '), 'jane@example.com');
  // an international domain in Unicode or ASCII (xn--) form
  t.is(
    normalizeInviteEmail('jane@Bücher.example'),
    normalizeInviteEmail('jane@xn--bcher-kva.example')
  );
  t.is(
    normalizeInviteEmail('jane@bücher.example'),
    'jane@xn--bcher-kva.example'
  );
  // the local part is kept as it is (plus addressing is another address)
  t.not(
    normalizeInviteEmail('jane+team@example.com'),
    normalizeInviteEmail('jane@example.com')
  );
  t.is(normalizeInviteEmail(undefined), '');
});
