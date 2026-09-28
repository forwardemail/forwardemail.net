/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const vm = require('node:vm');
const { performance } = require('node:perf_hooks');

//
// rrule expands a recurrence one candidate at a time from DTSTART and cannot
// be interrupted, and how long that takes cannot be told from the rule:
//
//  - `DTSTART:19700101T000000Z` + `RRULE:FREQ=SECONDLY` walks every second
//    since 1970 before it reaches the queried range
//  - a rule whose BY* parts never match (`FREQ=DAILY;BYMONTH=2;
//    BYMONTHDAY=30`) walks every day up to the year 9999 (~8 s), whatever
//    range was asked for, because rrule only checks the range (and UNTIL)
//    against occurrences it finds
//
// Such an event can be stored by PUT or arrive by email as an invite, and
// then blocked the process on every time-range query that read it.
//
// Recurrences are therefore expanded in a separate V8 context (the same
// rrule code, loaded once) with a time limit per event and per request.
// A recurrence that runs out of time counts as matching the range:
// returning an event the client then expands itself is harmless, hiding
// one would lose it.
//

// time one event's recurrence may take (legitimate rules with a TZID take
// tens of milliseconds, since every candidate is converted through Intl)
const MAX_EVENT_MS = 250;

// and all events of one request together
const MAX_REQUEST_MS = 2000;

const TIMEOUT_CODE = 'ERR_SCRIPT_EXECUTION_TIMEOUT';

let sandbox;

function getSandbox() {
  if (sandbox) return sandbox;

  const context = vm.createContext({});
  // rrule's browser build (UMD, no dependencies) defines `rrule` globally
  new vm.Script(fs.readFileSync(require.resolve('rrule'), 'utf8'), {
    filename: 'rrule.js'
  }).runInContext(context);
  new vm.Script(`
    globalThis.matchRange = function (text, start, end) {
      const set = rrule.rrulestr(text);
      if (start !== null && end !== null) {
        let found = false;
        // stop at the first occurrence
        set.between(new Date(start), new Date(end), true, () => {
          found = true;
          return false;
        });
        return found;
      }

      if (start !== null) return set.after(new Date(start), true) !== null;
      return set.before(new Date(end), true) !== null;
    };
  `).runInContext(context);

  sandbox = {
    context,
    script: new vm.Script('matchRange(args.text, args.start, args.end)')
  };
  return sandbox;
}

function toTime(date) {
  if (date instanceof Date && !Number.isNaN(date.getTime()))
    return date.getTime();
  return null;
}

/**
 * A budget of recurrence expansion for one request.
 *
 * `matches(text, { start, end })` takes the recurrence lines (DTSTART,
 * RRULE, EXRULE, RDATE, EXDATE) as parsed by `rrulestr` and returns whether
 * an occurrence falls in the range (`start` and/or `end`, inclusive), or
 * `null` when that could not be told in the time left.
 *
 * @param {Object} [options]
 * @param {number} [options.maxEventMs]
 * @param {number} [options.maxRequestMs]
 * @returns {{ matches: Function, spent: number }}
 */
function createRecurrenceBudget({
  maxEventMs = MAX_EVENT_MS,
  maxRequestMs = MAX_REQUEST_MS
} = {}) {
  const budget = {
    spent: 0,
    matches(text, { start, end } = {}) {
      const startTime = toTime(start);
      const endTime = toTime(end);
      // (no valid range to test against)
      if (startTime === null && endTime === null) return null;

      const remaining = maxRequestMs - budget.spent;
      if (remaining < 1) return null;

      const { context, script } = getSandbox();
      context.args = { text, start: startTime, end: endTime };
      const began = performance.now();
      try {
        return (
          script.runInContext(context, {
            timeout: Math.max(1, Math.floor(Math.min(maxEventMs, remaining)))
          }) === true
        );
      } catch (err) {
        if (err?.code === TIMEOUT_CODE) return null;
        throw err;
      } finally {
        context.args = null;
        budget.spent += performance.now() - began;
      }
    }
  };
  return budget;
}

module.exports = {
  createRecurrenceBudget,
  MAX_EVENT_MS,
  MAX_REQUEST_MS
};
