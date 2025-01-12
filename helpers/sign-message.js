/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const { dkimSign } = require('mailauth/lib/dkim/sign');

const combineErrors = require('./combine-errors');
const { decrypt } = require('./encrypt-decrypt');

const config = require('#config');

async function signMessage(raw, domain) {
  const signResult = await dkimSign(raw, {
    canonicalization: 'relaxed/relaxed',
    algorithm: 'rsa-sha256',
    signTime: new Date(),
    signatureData: domain
      ? [
          {
            signingDomain: domain.name,
            selector: domain.dkim_key_selector,
            privateKey: decrypt(domain.dkim_private_key),
            algorithm: 'rsa-sha256',
            canonicalization: 'relaxed/relaxed'
          }
        ]
      : [config.signatureData]
  });

  if (signResult.errors.length > 0) {
    const err = combineErrors(signResult.errors.map((error) => error.err));
    // we may want to remove cyclical reference
    // for (const error of signResult.errors) {
    //   delete error.err;
    // }
    err.signResult = signResult;
    throw err;
  }

  const signatures = Buffer.from(signResult.signatures, 'utf8');
  return Buffer.concat([signatures, raw], signatures.length + raw.length);
}

module.exports = signMessage;
