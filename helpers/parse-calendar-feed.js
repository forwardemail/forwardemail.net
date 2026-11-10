/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');

const ICAL = require('ical.js');

const { prepareICSForStorage } = require('#helpers/prepare-ics');
const { sanitizeRruleLines } = require('#helpers/sanitize-rrule-lines');

//
// Split an iCalendar feed (see helpers/fetch-calendar-feed.js) into one
// calendar object resource per UID, the way a CalDAV collection holds them:
// an event and its RECURRENCE-ID overrides together, with the time zones
// they refer to.
//
// A feed is read line by line rather than parsed whole, so that one event a
// host wrote badly is left out instead of the whole feed being refused, and
// each resource is then checked with ical.js on its own.
//
const DEFAULTS = {
  maxEvents: 5000,
  // (of one event with its overrides)
  maxResourceBytes: 1024 * 1024
};

const COMPONENTS = new Set(['VEVENT', 'VTODO']);
const SAFE_EVENT_ID = /^[\w.-]{1,128}$/;
const PRODID = '-//forwardemail.net//caldav//EN';

function feedError(code, message) {
  return Object.assign(new Error(message), { code, isFeedError: true });
}

function sha1(value) {
  return crypto.createHash('sha1').update(value).digest('hex');
}

// (`\n`, `\,`, `\;` and `\\` of a TEXT value, RFC 5545 Section 3.3.11)
function unescapeText(value) {
  return value
    .replace(/\\([\\;,nN])/g, (_, c) => (c === 'n' || c === 'N' ? '\n' : c))
    .trim();
}

// `NAME;PARAM=x:value` of an unfolded line (a parameter value in quotes may
// hold a colon)
function splitLine(text) {
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') quoted = !quoted;
    else if (c === ':' && !quoted) {
      const head = text.slice(0, i);
      const semi = head.indexOf(';');
      return {
        name: (semi === -1 ? head : head.slice(0, semi)).trim().toUpperCase(),
        value: text.slice(i + 1)
      };
    }
  }

  return { name: text.trim().toUpperCase(), value: '' };
}

//
// The content lines of a feed, each with the physical lines it was folded
// over (`raw`, kept as they were) and its unfolded text.
//
function contentLines(text) {
  const lines = [];
  for (const physical of text.split(/\r\n|\n|\r/)) {
    if (
      (physical.startsWith(' ') || physical.startsWith('\t')) &&
      lines.length > 0
    ) {
      const last = lines[lines.length - 1];
      last.raw.push(physical);
      last.text += physical.slice(1);
    } else if (physical.trim() !== '') {
      lines.push({ raw: [physical], text: physical });
    }
  }

  return lines;
}

function durationToMs(value) {
  try {
    const seconds = ICAL.Duration.fromString(value.trim()).toSeconds();
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
  } catch {}
}

function isValidTime(value) {
  return (
    value instanceof ICAL.Time && !Number.isNaN(value.toJSDate().getTime())
  );
}

// (what the `CalendarEvents` model reads of a resource must be readable)
function isValid(ics) {
  try {
    const calendar = new ICAL.Component(ICAL.parse(ics));
    const components = [
      ...calendar.getAllSubcomponents('vevent'),
      ...calendar.getAllSubcomponents('vtodo')
    ];
    if (components.length === 0) return false;
    for (const component of components) {
      const start = component.getFirstPropertyValue('dtstart');
      // (a task may have no start; an event must)
      if (start ? !isValidTime(start) : component.name === 'vevent')
        return false;
      for (const name of ['dtend', 'due', 'recurrence-id']) {
        const value = component.getFirstPropertyValue(name);
        if (value && !isValidTime(value)) return false;
      }

      for (const rrule of component.getAllProperties('rrule'))
        if (!(rrule.getFirstValue() instanceof ICAL.Recur)) return false;
    }

    return true;
  } catch {
    return false;
  }
}

function build(prodId, timezones, blocks) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:${prodId}`,
    'CALSCALE:GREGORIAN',
    ...timezones.flat(),
    ...blocks.flatMap((block) => block.lines),
    'END:VCALENDAR',
    ''
  ].join('\r\n');
}

//
// Resolves nothing asynchronously; returns
// `{ name, description, color, timezone, refreshInterval, resources, skipped }`
// where `refreshInterval` is in ms (from REFRESH-INTERVAL, else
// X-PUBLISHED-TTL), each of `resources` is `{ uid, eventId, ical }`, and
// `skipped` counts the events left out for being malformed.
//
// Throws with `code` `FEED_INVALID` (not a calendar, or nothing in it could
// be read) or `FEED_TOO_MANY_EVENTS`.
//
function parseCalendarFeed(text, options = {}) {
  const maxEvents = options.maxEvents ?? DEFAULTS.maxEvents;
  const maxResourceBytes =
    options.maxResourceBytes ?? DEFAULTS.maxResourceBytes;

  if (typeof text !== 'string' || !/^\s*begin:vcalendar/i.test(text))
    throw feedError('FEED_INVALID', 'Feed is not an iCalendar file');

  const properties = {};
  // TZID -> raw lines of its VTIMEZONE
  const timezones = new Map();
  // UID -> blocks (`{ name, lines, recurrenceId, bytes }`)
  const groups = new Map();
  let skipped = 0;

  let depth = 0;
  let block = null;
  for (const line of contentLines(text)) {
    const { name, value } = splitLine(line.text);
    const isBegin = name === 'BEGIN';
    const isEnd = name === 'END';

    if (block) {
      block.lines.push(...line.raw);
      block.bytes += line.text.length;
      if (isBegin) depth++;
      else if (isEnd) depth--;
      else if (depth === 2) {
        if (name === 'UID' && block.uid === undefined) block.uid = value.trim();
        else if (name === 'RECURRENCE-ID') block.recurrenceId = value.trim();
        else if (name === 'TZID' && block.tzid === undefined)
          block.tzid = value.trim();
      }

      // (the component closed)
      if (depth === 1) {
        const closed = block;
        block = null;
        if (closed.name === 'VTIMEZONE') {
          if (closed.tzid && !timezones.has(closed.tzid))
            timezones.set(closed.tzid, closed.lines);
        } else if (COMPONENTS.has(closed.name)) {
          if (closed.bytes > maxResourceBytes) {
            skipped++;
            continue;
          }

          // (an event without a UID keeps the same one for as long as the
          // feed sends it unchanged)
          if (!closed.uid) {
            closed.uid = sha1(closed.lines.join('\n'));
            closed.lines.splice(1, 0, `UID:${closed.uid}`);
          }

          if (!groups.has(closed.uid)) {
            if (groups.size >= maxEvents)
              throw feedError(
                'FEED_TOO_MANY_EVENTS',
                'Feed has too many events'
              );
            groups.set(closed.uid, []);
          }

          groups.get(closed.uid).push(closed);
        }
      }

      continue;
    }

    if (isBegin) {
      const component = value.trim().toUpperCase();
      if (depth === 0) {
        if (component === 'VCALENDAR') depth = 1;
        continue;
      }

      // (depth is 1: a component of the calendar)
      depth = 2;
      block = { name: component, lines: [...line.raw], bytes: 0 };
      continue;
    }

    if (isEnd) {
      // (a file may hold several calendars one after the other)
      if (depth === 1) depth = 0;
      continue;
    }

    // a property of the calendar itself (the first of each is kept)
    if (depth === 1 && !(name in properties)) properties[name] = value;
  }

  // (a component cut off by the end of the file)
  if (block && COMPONENTS.has(block.name)) skipped++;

  const prodId =
    typeof properties.PRODID === 'string' &&
    /^[\w\-/. ]{1,128}$/.test(properties.PRODID.trim())
      ? properties.PRODID.trim()
      : PRODID;

  const resources = [];
  for (const [uid, blocks] of groups) {
    // the event itself first, then its overrides in a set order, so that a
    // feed sent in another order is the same resource
    blocks.sort((a, b) => {
      if (!a.recurrenceId !== !b.recurrenceId) return a.recurrenceId ? 1 : -1;
      return (a.recurrenceId || '').localeCompare(b.recurrenceId || '');
    });

    if (blocks.reduce((size, b) => size + b.bytes, 0) > maxResourceBytes) {
      skipped++;
      continue;
    }

    const body = blocks.map((b) => b.lines.join('\n')).join('\n');
    const referenced = [...timezones]
      .filter(
        ([tzid]) =>
          body.includes(`TZID=${tzid}`) || body.includes(`TZID="${tzid}"`)
      )
      .map(([, lines]) => lines);

    let ical = build(prodId, referenced, blocks);
    if (!isValid(ical)) {
      // (the usual fault is a recurrence rule ical.js will not take)
      const repaired = build(
        prodId,
        referenced,
        blocks.map((b) => ({ ...b, lines: sanitizeRruleLines(b.lines) }))
      );
      if (!isValid(repaired)) {
        skipped++;
        continue;
      }

      ical = repaired;
    }

    try {
      // (not stamped: a refresh must leave an unchanged event as it was)
      ical = prepareICSForStorage(ical);
    } catch {
      skipped++;
      continue;
    }

    resources.push({
      uid,
      eventId: SAFE_EVENT_ID.test(uid) ? uid : sha1(uid),
      ical
    });
  }

  if (resources.length === 0 && skipped > 0)
    throw feedError('FEED_INVALID', 'No event of the feed could be read');

  const text_ = (...names) => {
    for (const name of names) {
      if (typeof properties[name] === 'string') {
        const value = unescapeText(properties[name]);
        if (value) return value.slice(0, 1024);
      }
    }
  };

  let refreshInterval;
  for (const name of ['REFRESH-INTERVAL', 'X-PUBLISHED-TTL']) {
    if (typeof properties[name] === 'string') {
      refreshInterval = durationToMs(properties[name]);
      if (refreshInterval) break;
    }
  }

  const color = text_('COLOR', 'X-APPLE-CALENDAR-COLOR');

  return {
    name: text_('X-WR-CALNAME', 'NAME'),
    description: text_('X-WR-CALDESC', 'DESCRIPTION'),
    // (only a hex colour is one a calendar here can hold)
    color: color && /^#[\da-f]{6}/i.test(color) ? color.slice(0, 7) : undefined,
    timezone: text_('X-WR-TIMEZONE'),
    refreshInterval,
    resources,
    skipped
  };
}

//
// What two copies of a resource are compared by: hosts such as Google write
// a new DTSTAMP into every event each time a feed is fetched.
//
function signature(ical) {
  return String(ical)
    .replace(/\r\n[ \t]/g, '')
    .replace(/^dtstamp[;:].*\r?\n/gim, '');
}

module.exports = parseCalendarFeed;
module.exports.signature = signature;
module.exports.DEFAULTS = DEFAULTS;
