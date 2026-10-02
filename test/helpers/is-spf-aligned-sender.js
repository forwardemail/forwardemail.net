/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const { isSpfAlignedSender } = require('#helpers/reserve-auto-reply');

function session({
  from = 'alice@company.com',
  mailFrom = 'bounces@company.com',
  spf = 'pass',
  dmarc = 'none'
} = {}) {
  return {
    originalFromAddress: from,
    envelope: { mailFrom: { address: mailFrom } },
    spf: { status: { result: spf } },
    dmarc: { status: { result: dmarc } }
  };
}

test('an envelope sender on the From domain that passed SPF is aligned', (t) => {
  t.true(isSpfAlignedSender(session()));
  t.true(isSpfAlignedSender(session({ dmarc: 'pass' })));
  // (relaxed: the same organizational domain)
  t.true(isSpfAlignedSender(session({ mailFrom: 'bounces@mail.company.com' })));
  t.true(isSpfAlignedSender(session({ from: 'alice@eu.company.com' })));
  t.true(isSpfAlignedSender(session({ from: 'Alice@Company.COM' })));
  t.true(
    isSpfAlignedSender(
      session({ from: 'anna@münchen.de', mailFrom: 'bounce@xn--mnchen-3ya.de' })
    )
  );
});

test('a sender on another domain, or without SPF pass, is not aligned', (t) => {
  // e.g. a shared mail service's own envelope sender
  t.false(isSpfAlignedSender(session({ mailFrom: 'bounce@mailer.example' })));
  // (an organizational domain is not shared with a sibling registrant)
  t.false(
    isSpfAlignedSender(
      session({ from: 'alice@victim.co.uk', mailFrom: 'x@evil.co.uk' })
    )
  );
  // (nor one under a private suffix of the public suffix list)
  t.false(
    isSpfAlignedSender(
      session({ from: 'alice@victim.eu.org', mailFrom: 'x@evil.eu.org' })
    )
  );
  t.false(
    isSpfAlignedSender(
      session({ from: 'alice@victim.github.io', mailFrom: 'x@evil.github.io' })
    )
  );
  t.true(
    isSpfAlignedSender(
      session({ from: 'alice@victim.eu.org', mailFrom: 'x@mail.victim.eu.org' })
    )
  );
  // (nor an IP address literal with anything but itself)
  t.false(
    isSpfAlignedSender(
      session({ from: 'alice@[192.0.2.1]', mailFrom: 'x@[192.0.2.2]' })
    )
  );
  for (const spf of ['fail', 'softfail', 'neutral', 'none', 'temperror'])
    t.false(isSpfAlignedSender(session({ spf })), `spf: ${spf}`);
  // a null reverse-path
  t.false(isSpfAlignedSender(session({ mailFrom: '' })));
  // a DMARC check that failed (e.g. strict alignment), or that could not be
  // completed, has the last word
  for (const dmarc of ['fail', 'temperror', 'permerror'])
    t.false(isSpfAlignedSender(session({ dmarc })), `dmarc: ${dmarc}`);
  t.false(
    isSpfAlignedSender({ ...session(), dmarc: undefined }),
    'no DMARC check'
  );
  t.false(isSpfAlignedSender({}));
  t.false(isSpfAlignedSender(null));
});
