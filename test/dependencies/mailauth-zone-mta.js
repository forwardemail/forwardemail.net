/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { createRequire } = require('node:module');

const test = require('ava');

const zoneMtaRequire = createRequire(require.resolve('@zone-eu/zone-mta'));
const parseDkimHeaders = zoneMtaRequire('mailauth/lib/parse-dkim-headers');

test('Zone MTA mailauth parser blocks dangerous DKIM property paths', (t) => {
  const prototype = Object.getPrototypeOf({});
  delete prototype.fwd02Polluted;

  parseDkimHeaders(
    'Authentication-Results: forwardemail.net; dkim=pass __proto__.fwd02Polluted=yes'
  );

  t.is(prototype.fwd02Polluted, undefined);
});
