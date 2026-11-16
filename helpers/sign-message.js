/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const isSANB = require('is-string-and-not-blank');
const { dkimSign } = require('mailauth/lib/dkim/sign');

const combineErrors = require('./combine-errors');
const { decrypt } = require('./encrypt-decrypt');

const config = require('#config');

//
// A dot between a bare CR and a line end (or the end of the message) is
// doubled when the message is sent, so that a receiver that ends a line at a
// bare CR does not take it for the end of the data (see
// `patches/nodemailer@10.1.7.patch`). A message sent over SMTP has it doubled
// before it is signed or sealed, so the bytes signed are the bytes sent; a
// message that is not sent over SMTP (e.g. to a webhook) is left as it is.
//
const BARE_CR_DOT = Buffer.from('\r.');
function stuffBareCrDots(raw) {
  if (!raw.includes(BARE_CR_DOT)) return raw;
  return Buffer.from(
    raw.toString('binary').replace(/\r\.(?=[\r\n]|$)/g, '\r..'),
    'binary'
  );
}

//
// Our own signature too (after the domain's) on mail a domain sends through
// our SMTP servers: a CFBL-Address at our domain on mail From another one
// counts only with a valid signature of each (RFC 9477 Section 3.1.3), and
// mailbox providers find our DKIM-FBL record by it (see `addFeedbackFields`
// in `helpers/arf-report.js`); not on mail our own domain sends, which its
// one signature is ours already
//
function getOurSignatureData(domain) {
  const { signingDomain, selector, privateKey } = config.signatureData;
  return config.arf.cfbl &&
    isSANB(signingDomain) &&
    isSANB(selector) &&
    isSANB(privateKey) &&
    String(domain.name).toLowerCase() !== signingDomain.toLowerCase()
    ? [config.signatureData]
    : [];
}

async function signMessage(raw, domain) {
  const signResult = await dkimSign(raw, {
    canonicalization: 'relaxed/relaxed',
    algorithm: 'rsa-sha256',
    signTime: new Date(),
    headerList: config.dkimHeaderList,
    signatureData: domain
      ? [
          {
            signingDomain: domain.name,
            selector: domain.dkim_key_selector,
            privateKey: decrypt(domain.dkim_private_key),
            algorithm: 'rsa-sha256',
            canonicalization: 'relaxed/relaxed'
          },
          ...getOurSignatureData(domain)
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
module.exports.getOurSignatureData = getOurSignatureData;
module.exports.stuffBareCrDots = stuffBareCrDots;
