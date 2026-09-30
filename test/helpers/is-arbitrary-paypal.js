/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const test = require('ava');
const { Headers } = require('mailsplit');

const isArbitrary = require('#helpers/is-arbitrary');

const PAYPAL_SPAM = /ongoing PayPal invoice spam/;

function parse(lines) {
  return new Headers(Buffer.from(lines.join('\r\n') + '\r\n\r\n'));
}

function paypalSession(fromAddress) {
  const domain = fromAddress.split('@')[1];
  return {
    originalFromAddress: fromAddress,
    originalFromAddressDomain: domain,
    originalFromAddressRootDomain: domain,
    resolvedClientHostname: 'mx9.slc.paypal.com',
    resolvedRootClientHostname: 'paypal.com',
    hadAlignedAndPassingDKIM: true,
    hasSameHostnameAsFrom: false,
    isAllowlisted: true,
    spfFromHeader: { status: { result: 'pass' } },
    spf: { domain },
    envelope: {
      mailFrom: { address: fromAddress },
      rcptTo: [{ address: 'fwd-b1dec6b10531@example.com' }]
    }
  };
}

test('blocks the invoice from paypal.com.au with a new template ID', (t) => {
  // as received: mx9.slc.paypal.com, DKIM d=paypal.com.au
  const headers = parse([
    'From: Billing Department <service@paypal.com.au>',
    'To: fwd-b1dec6b10531@example.com',
    'Subject: Invoice from Billing Department (2026-2755)',
    'X-Email-Type-Id: RTI003384',
    'X-MaxCode-Template: RTI003384'
  ]);
  t.throws(() => isArbitrary(paypalSession('service@paypal.com.au'), headers), {
    message: PAYPAL_SPAM
  });
});

test('blocks an invoice or money request by subject when the template ID is new', (t) => {
  for (const [from, subject] of [
    ['service@paypal.com', 'Invoice from Acme Billing (0042)'],
    ['service@paypal.co.uk', 'Acme Billing sent you an invoice'],
    ['service@paypal.de', 'Rechnung von Acme Billing (0042)'],
    ['service@paypal.fr', "Vous avez reçu une demande d'argent"],
    ['service@paypal.com', 'Acme requested $499.99 USD'],
    ['service@paypal.com', "You've got a money request"]
  ]) {
    const headers = parse([
      `From: ${from}`,
      `Subject: ${subject}`,
      'X-Email-Type-Id: ZZ999999'
    ]);
    t.throws(
      () => isArbitrary(paypalSession(from), headers),
      { message: PAYPAL_SPAM },
      `${from}: ${subject}`
    );
  }
});

test('still blocks the known template IDs from paypal.com', (t) => {
  for (const id of ['PPC001017', 'RT000238', 'RT000542', 'RT002947']) {
    const headers = parse([
      'From: service@paypal.com',
      'Subject: Notification of payment received',
      `X-Email-Type-Id: ${id}`
    ]);
    t.throws(
      () => isArbitrary(paypalSession('service@paypal.com'), headers),
      { message: PAYPAL_SPAM },
      `${id}`
    );
  }
});

test('allows receipts and other PayPal mail', (t) => {
  for (const [from, subject] of [
    ['service@paypal.com', 'Receipt for your payment to Acme'],
    ['service@paypal.com.au', "You've got money"],
    ['service@paypal.co.uk', 'Invoice 0042 has been paid'],
    ['service@paypal.com', 'Your PayPal account has been updated']
  ]) {
    const headers = parse([
      `From: ${from}`,
      `Subject: ${subject}`,
      'X-Email-Type-Id: PPX000123'
    ]);
    t.notThrows(() => isArbitrary(paypalSession(from), headers), `${subject}`);
  }
});

test('does not treat other senders as PayPal', (t) => {
  for (const [from, rootDomain] of [
    ['billing@notpaypal.com', 'notpaypal.com'],
    ['billing@paypal.example.com', 'example.com']
  ]) {
    const headers = parse([
      `From: ${from}`,
      'Subject: Invoice from Acme Billing (0042)'
    ]);
    const session = paypalSession(from);
    session.originalFromAddressRootDomain = rootDomain;
    t.notThrows(() => isArbitrary(session, headers), `${from}`);
  }
});
