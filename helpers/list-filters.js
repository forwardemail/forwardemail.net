/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');

//
// Query string filters shared by My Account > Emails and My Account > Logs
//

//
// Whether a query string key is `key` itself or `key[0]`, `key[]`, ...
// (a table form writes a repeated parameter that way, with `qs`)
//
function isKey(name, key) {
  return name === key || (name.startsWith(`${key}[`) && name.endsWith(']'));
}

//
// The values of query string parameters as strings, whether each is given
// once, repeated or as `key[0]=...`, and comma separated or not
//
function getQueryValues(query, ...keys) {
  const values = [];
  for (const [name, value] of Object.entries(query || {})) {
    if (!keys.some((key) => isKey(name, key))) continue;
    for (const v of [value].flat()) {
      if (typeof v !== 'string') continue;
      for (const s of v.split(',')) if (isSANB(s)) values.push(s.trim());
    }
  }

  return values;
}

//
// The response codes in `?response_codes=421,550` (or `?response_code=421`)
// as unique numbers from 200 to 599, in the order given (others are ignored)
//
function parseResponseCodes(query) {
  const codes = [];
  for (const value of getQueryValues(
    query,
    'response_codes',
    'response_code'
  )) {
    if (!/^\d{3}$/.test(value)) continue;
    const code = Number.parseInt(value, 10);
    if (isResponseCode(code) && !codes.includes(code)) codes.push(code);
  }

  return codes;
}

// (a code that a list can be filtered by)
function isResponseCode(code) {
  return Number.isInteger(code) && code >= 200 && code < 600;
}

//
// A MongoDB condition for a date field from `?start_date` and `?end_date`
// (from the start of the one day to the end of the other, either optional)
// in the time zone of the user, as the dates in the list are shown,
// or `undefined` if neither is a valid date
//
function parseDateRange(startDate, endDate, timezone) {
  const tz = isSANB(timezone) && timezone !== 'Etc/Unknown' ? timezone : 'UTC';
  const parse = (value) => {
    if (!isSANB(value) || !dayjs(value).isValid()) return;
    try {
      const date = dayjs.tz(dayjs(value).format('YYYY-MM-DD'), tz);
      return date.isValid() ? date : undefined;
    } catch {
      // (a time zone that is not known)
      return dayjs.tz(dayjs(value).format('YYYY-MM-DD'), 'UTC');
    }
  };

  const range = {};
  const start = parse(startDate);
  const end = parse(endDate);
  if (start) range.$gte = start.startOf('day').toDate();
  if (end) range.$lte = end.endOf('day').toDate();
  return Object.keys(range).length > 0 ? range : undefined;
}

//
// The URL of the list the request is for with its query string changed
// (a key set to `undefined` is removed), back on its first page
// (e.g. a status code in a row that filters the list for that code)
//
function getFilterUrl(ctx, changes = {}) {
  const params = new URLSearchParams(ctx.querystring);
  const keys = ['page', ...Object.keys(changes)];
  for (const name of new Set(params.keys())) {
    if (keys.some((key) => isKey(name, key))) params.delete(name);
  }

  for (const [key, value] of Object.entries(changes)) {
    if (value !== undefined && value !== null && value !== '')
      params.set(key, String(value));
  }

  const search = params.toString();
  return search ? `${ctx.path}?${search}` : ctx.path;
}

module.exports = {
  getFilterUrl,
  getQueryValues,
  isKey,
  isResponseCode,
  parseDateRange,
  parseResponseCodes
};
