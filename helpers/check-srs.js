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

const srs = new SRS(config.srs);

// <https://srs-discuss.v2.listbox.narkive.com/Mh6X2B2w/help-how-to-unwind-an-srs-address#post17>
// note we can't use `/^SRS=/i` because it would match `srs@example.com`
const REGEX_SRS0 = new RE2(/^srs0[-+=]\S+=\S{2}=(\S+)=(.+)@\S+$/i);
const REGEX_SRS1 = new RE2(/^srs1[+-=]\S+=\S+==\S+=\S{2}=\S+@\S+$/i);

function checkSRS(address, shouldThrow = false, ignoreHook = false) {
  if (!REGEX_SRS0.test(address) && !REGEX_SRS1.test(address)) return address;

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
    if (local[0]) local[0] = local[0].toUpperCase(); // SRS0
    if (local[2]) local[2] = local[2].toUpperCase(); // T7
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

module.exports = checkSRS;
