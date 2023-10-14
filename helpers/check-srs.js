/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const RE2 = require('re2');
const _ = require('lodash');
const parseErr = require('parse-err');
const { SRS } = require('sender-rewriting-scheme');

const config = require('#config');

const srs = new SRS(config.srs);

// <https://srs-discuss.v2.listbox.narkive.com/Mh6X2B2w/help-how-to-unwind-an-srs-address#post17>
// note we can't use `/^SRS=/i` because it would match `srs@example.com`
const REGEX_SRS0 = new RE2(/^srs0[-+=]\S+=\S{2}=(\S+)=(.+)@\S+$/i);
const REGEX_SRS1 = new RE2(/^srs1[+-=]\S+=\S+==\S+=\S{2}=\S+@\S+$/i);

function checkSRS(address, shouldThrow = false, ignoreHook = false) {
  if (!REGEX_SRS0.test(address) && !REGEX_SRS1.test(address)) return address;

  try {
    const reversed = srs.reverse(address);
    if (_.isNull(reversed)) throw new Error('Bad signature');
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
