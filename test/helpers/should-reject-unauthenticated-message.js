/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const {
  shouldRejectDmarcReject,
  shouldRejectDmarcQuarantine,
  shouldRejectUnauthenticatedMessage
} = require('#helpers/should-reject-unauthenticated-message');

function createSession(overrides = {}) {
  return {
    isAllowlisted: true,
    hadAlignedAndPassingDKIM: false,
    dkim: { results: [] },
    spf: { status: { result: 'fail' } },
    spfFromHeader: { status: { result: 'fail' } },
    dmarc: { status: { result: 'fail' }, policy: 'none' },
    ...overrides
  };
}

test('rejects unauthenticated mail even when the connection is allowlisted', (t) => {
  const session = createSession();

  t.true(session.isAllowlisted);
  t.true(shouldRejectUnauthenticatedMessage(session, false, false));
});

test('rejects unauthenticated DMARC reject and quarantine failures even when allowlisted', (t) => {
  const quarantineSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' }
  });
  const rejectSession = createSession({
    dmarc: { status: { result: 'fail' }, policy: 'reject' }
  });

  const envelopeOnlySpfSession = createSession({
    spf: { status: { result: 'pass' } },
    dmarc: { status: { result: 'fail' }, policy: 'quarantine' }
  });

  t.true(quarantineSession.isAllowlisted);
  t.true(rejectSession.isAllowlisted);
  t.true(envelopeOnlySpfSession.isAllowlisted);
  t.true(shouldRejectDmarcQuarantine(quarantineSession, false, false));
  t.true(shouldRejectDmarcReject(rejectSession, false, false));
  t.true(shouldRejectDmarcQuarantine(envelopeOnlySpfSession, false, false));
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
  t.false(shouldRejectUnauthenticatedMessage(rejectSession, true, false));
  t.false(shouldRejectUnauthenticatedMessage(rejectSession, false, true));
});

test('rejects an otherwise unauthenticated message with unaligned DKIM or envelope-only SPF', (t) => {
  const unalignedDkimSession = createSession({
    dkim: { results: [{ status: { result: 'pass', aligned: false } }] }
  });
  const envelopeOnlySpfSession = createSession({
    spf: { status: { result: 'pass' } }
  });

  t.true(
    shouldRejectUnauthenticatedMessage(unalignedDkimSession, false, false)
  );
  t.true(
    shouldRejectUnauthenticatedMessage(envelopeOnlySpfSession, false, false)
  );
});

test('permits mail with a passing aligned authentication mechanism', (t) => {
  t.false(
    shouldRejectUnauthenticatedMessage(
      createSession({
        spfFromHeader: { status: { result: 'pass' } }
      }),
      false,
      false
    )
  );

  t.false(
    shouldRejectUnauthenticatedMessage(
      createSession({ hadAlignedAndPassingDKIM: true }),
      false,
      false
    )
  );

  t.false(
    shouldRejectUnauthenticatedMessage(
      createSession({ dmarc: { status: { result: 'pass' } } }),
      false,
      false
    )
  );
});
