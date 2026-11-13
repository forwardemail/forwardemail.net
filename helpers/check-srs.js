/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');
const parseErr = require('parse-err');
const { SRS } = require('sender-rewriting-scheme');
const _ = require('#helpers/lodash');

const logger = require('#helpers/logger');
const config = require('#config');
const env = require('#config/env');

const srs = new SRS(config.srs);

// <https://srs-discuss.v2.listbox.narkive.com/Mh6X2B2w/help-how-to-unwind-an-srs-address#post17>
// note we can't use `/^SRS=/i` because it would match `srs@example.com`
const REGEX_SRS0 = new RE2(/^srs0[-+=]\S+=\S{2}=(\S+)=(.+)@\S+$/i);
const REGEX_SRS1 = new RE2(/^srs1[+-=]\S+=\S+==\S+=\S{2}=\S+@\S+$/i);

function checkSRS(address, shouldThrow = false, ignoreHook = false) {
  if (!REGEX_SRS0.test(address) && !REGEX_SRS1.test(address)) return address;

  //
  // the address as received is tried first, since changing the case of an
  // address that was not lowercased could break its signature
  // (e.g. a first hop that uses a lowercase timestamp or "+" separator)
  //
  try {
    const reversed = srs.reverse(address);
    if (typeof reversed === 'string') return reversed;
  } catch {
    // (tried again below with the case normalized)
  }

  try {
    //
    // sometimes senders send to a lowercase version of the MAIL FROM
    // which is going to mess things up here because case sensitivity is needed
    // therefore we will do a rewrite here if necessary
    //
    const index = address.indexOf('@');
    const local = address.slice(0, index).split('=');
    const domain = address.slice(index + 1);

    //
    // > local.split('=')
    // [ 'srs0', '4f4d', 't7', 'example.com', 'john' ]
    // and we need
    // SRS0=4f4d=T7=example.com=john
    // therefore keys 0 and 2 need capitalized
    //
    // (for SRS1=4f4d=first.com==4f4d=T7=example.com=john the timestamp
    // is key 5, or key 4 for SRS1=4f4d=first.com=+4f4d=T7=example.com=john
    // and key 2 is the first hop domain which must not change)
    //
    if (local[0]) local[0] = local[0].toUpperCase(); // SRS0 or SRS1
    let timestampIndex = 2;
    if (local[0] === 'SRS1') timestampIndex = local[3] === '' ? 5 : 4;
    if (local[timestampIndex])
      local[timestampIndex] = local[timestampIndex].toUpperCase(); // T7
    const srsAddress = `${local.join('=')}@${domain}`;
    const reversed = srs.reverse(srsAddress);
    if (_.isNull(reversed)) {
      if (REGEX_SRS1.test(address)) {
        const err2 = new TypeError('SRS1 reverse failed');
        err2.address = address;
        err2.isCodeBug = true;
        logger.fatal(err2, { ignore_hook: false });
      }

      throw new Error('Bad signature');
    }

    return reversed;
  } catch (_err) {
    let err = _err;
    // sender rewriting scheme library uses TypeError internally
    // (and if we didn't have this then it would cause continuous 421 retry)
    if (err instanceof TypeError) {
      const obj = parseErr(err);
      const error = new Error(err.message);
      for (const key of Object.keys(obj)) {
        if (key === 'message' || key === 'name') continue;
        error[key] = obj[key];
      }

      err = error;
    }

    if (!err.responseCode) err.responseCode = 553;
    if (ignoreHook) err.ignoreHook = true;

    if (shouldThrow) throw err;
    return address;
  }
}

//
// An SRS address in a header (From, Reply-To) reversed only when it is on our
// own domain (WEB_HOST, or a host of it): its signature does not cover its
// domain, so anyone could put one we made for a sender of theirs on a domain
// they control (where DMARC passes) and pass as the address it reverses to,
// e.g. one on our own domain, past checks that trust it
//
function checkHeaderSRS(address) {
  const domain = String(address)
    .slice(String(address).lastIndexOf('@') + 1)
    .toLowerCase();
  const ours = env.WEB_HOST.toLowerCase();
  if (domain !== ours && !domain.endsWith(`.${ours}`)) return address;
  return checkSRS(address);
}

module.exports = checkSRS;
module.exports.checkHeaderSRS = checkHeaderSRS;
