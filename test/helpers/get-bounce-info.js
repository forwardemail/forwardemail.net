/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ip = require('ip');
const test = require('ava');

const getBounceInfo = require('#helpers/get-bounce-info');

test('categorizes Orange Abusix IP blocked response as blocklist', (t) => {
  const err = {
    truthSource: 'orange.fr',
    response:
      "<jean.deregnaucourt@orange.fr> (host 'orange.fr' [80.12.24.83]:25: 550 opmta1mti07aub smtp.orange.fr EnJyw4MoQfspR Adresse IP source bloquee par Abusix. IP blocked by Abusix, OFR006_100 please visit https://lookup.abusix.com/search?q=121.127.44.66 [100])"
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'blocklist');
  t.is(bounceInfo.action, 'defer');
});

test('categorizes generic Abusix lookup blocked response as blocklist', (t) => {
  const err = {
    response:
      '550 5.7.1 IP blocked by Abusix, please visit https://lookup.abusix.com/search?q=203.0.113.10'
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'blocklist');
  t.is(bounceInfo.action, 'defer');
});

test('categorizes DMARC policy rejection as permanent reject', (t) => {
  const err = {
    message:
      "The email sent has failed DMARC validation and is rejected due to the domain's DMARC policy",
    responseCode: 550
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'dmarc');
  t.is(bounceInfo.action, 'reject');
});

test('categorizes remote DMARC rejection response as permanent reject', (t) => {
  const err = {
    response:
      '550 5.7.26 Unauthenticated email from example.com is not accepted due to domain DMARC policy'
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'dmarc');
  t.is(bounceInfo.action, 'reject');
});

test('categorizes Apple [HM08] local policy rejection as policy, not spam', (t) => {
  const err = {
    truthSource: 'icloud.com',
    response:
      '554 5.7.1 [HM08] Message rejected due to local policy. Please visit https://support.apple.com/en-us/HT204137. Txn ID 00000000-0000-4000-8000-000000000000'
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'policy');
  t.is(bounceInfo.action, 'reject');
});

test('categorizes Apple [HM08] naming our IP address as blocklist', (t) => {
  const err = {
    truthSource: 'icloud.com',
    response: `554 5.7.1 [HM08] Message rejected due to local policy. Please visit https://support.apple.com/en-us/HT204137. IP ${ip.address()}`
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'blocklist');
});

test('categorizes Apple [CS01] local policy rejection as spam', (t) => {
  const err = {
    truthSource: 'icloud.com',
    response:
      '554 5.7.1 [CS01] Message rejected due to local policy. Please visit https://support.apple.com/en-us/HT204137'
  };

  const bounceInfo = getBounceInfo(err);

  t.is(bounceInfo.category, 'spam');
});
