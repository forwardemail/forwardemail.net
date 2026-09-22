/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');
const isFQDN = require('is-fqdn');

const { DomainFactory } = require('../utils');

test('DomainFactory creates unique RFC-reserved example domains', async (t) => {
  const factory = new DomainFactory();
  const [first, second] = await Promise.all([
    factory.definition(),
    factory.definition()
  ]);

  t.true(isFQDN(first.name));
  t.true(isFQDN(second.name));
  t.true(first.name.endsWith('.example.com'));
  t.true(second.name.endsWith('.example.com'));
  t.not(first.name, second.name);
});
