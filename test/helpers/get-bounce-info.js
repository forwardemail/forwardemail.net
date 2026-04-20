/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
