/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { readFile } = require('node:fs/promises');
const path = require('node:path');

const test = require('ava');

const {
  shouldRejectDmarcReject,
  shouldRejectDmarcQuarantine
} = require('#helpers/should-reject-unauthenticated-message');

function createSession(overrides = {}) {
  return {
    isAllowlisted: true,
    hadAlignedAndPassingDKIM: false,
    spf: { status: { result: 'fail' } },
    spfFromHeader: { status: { result: 'fail' } },
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    ...overrides
  };
}

test('preserves DMARC reject enforcement regardless of connection allowlisting', (t) => {
  const session = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'reject' }
  });

  t.true(session.isAllowlisted);
  t.true(shouldRejectDmarcReject(session, false, false));
});

test('preserves DMARC quarantine enforcement when From-aligned authentication fails', (t) => {
  const session = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' }
  });
  const alignedSpfSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' },
    spfFromHeader: { status: { result: 'pass' } }
  });

  t.true(shouldRejectDmarcQuarantine(session, false, false));
  t.false(shouldRejectDmarcQuarantine(alignedSpfSession, false, false));
});

test('retains validated truth-source ARC and legitimate DSN exceptions', (t) => {
  const quarantineSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' }
  });
  const rejectSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'reject' }
  });

  t.false(shouldRejectDmarcQuarantine(quarantineSession, true, false));
  t.false(shouldRejectDmarcQuarantine(quarantineSession, false, true));
  t.false(shouldRejectDmarcReject(rejectSession, true, false));
  t.false(shouldRejectDmarcReject(rejectSession, false, true));
});

test('allows non-enforcing unauthenticated mail to reach normal filtering', async (t) => {
  const source = await readFile(
    path.join(__dirname, '../../helpers/is-authenticated-message.js'),
    'utf8'
  );

  t.false(source.includes('shouldRejectUnauthenticatedMessage'));
  t.true(source.includes('normal arbitrary, denylist, greylist'));
});
