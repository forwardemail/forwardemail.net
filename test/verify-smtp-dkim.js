/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Outbound SMTP verification of the DKIM record: a selector with more than
// one TXT record does not verify, since receivers may use any one of them
// (see #316 and #394).
//

const { Buffer } = require('node:buffer');

const test = require('ava');

const utils = require('./utils');

const Domains = require('#models/domains');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

function getDomain() {
  return {
    name: 'example.com',
    locale: 'en',
    dkim_key_selector: 'fe-test',
    dkim_public_key: Buffer.from('test-public-key'),
    return_path: 'fe-bounces'
  };
}

function getResolver(dkimRecords) {
  const notFound = async () => {
    const err = new Error('not found');
    err.code = 'ENOTFOUND';
    throw err;
  };

  return {
    async resolveTxt(name) {
      if (name === 'fe-test._domainkey.example.com') return dkimRecords;
      return notFound();
    },
    resolveNs: notFound,
    resolve4: notFound,
    resolve6: notFound,
    resolveCname: notFound,
    resolve: notFound
  };
}

const record = [
  'v=DKIM1; k=rsa; p=' + Buffer.from('test-public-key').toString('base64') + ';'
];

test('one DKIM record verifies', async (t) => {
  const result = await Domains.verifySMTP(
    getDomain(),
    getResolver([record]),
    false
  );
  t.true(result.dkim);
  t.false(
    result.errors.some((err) => err.message.includes('more than one DNS'))
  );
});

test('a matching DKIM record next to another one does not verify', async (t) => {
  const result = await Domains.verifySMTP(
    getDomain(),
    getResolver([record, ['p=old-partial-key']]),
    false
  );
  t.false(result.dkim);
  t.true(
    result.errors.some(
      (err) =>
        err.message.includes('more than one DNS') &&
        err.message.includes('fe-test._domainkey.example.com')
    )
  );
});
