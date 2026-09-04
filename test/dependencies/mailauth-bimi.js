/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

const { bimi } = require('mailauth/lib/bimi');

const dmarc = {
  alignment: { dkim: { result: true } },
  domain: 'example.com',
  policy: 'reject',
  status: { header: { from: 'example.com' }, result: 'pass' }
};

test('malformed BIMI version values fail validation without throwing', async (t) => {
  const resolver = async () => [['v=1; l=https://example.com/logo.svg']];

  let result;
  await t.notThrowsAsync(async () => {
    result = await bimi({ dmarc, resolver });
  });
  t.is(result.status.result, 'fail');
  t.is(result.status.comment, 'missing bimi version in dns record');
});
