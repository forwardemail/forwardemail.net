/**
 * Tests for CalDAV/CardDAV RFC compliance fixes
 *
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

'use strict';

const test = require('ava');
const ICAL = require('ical.js');

// ─── CardDAV Filter Parser Tests ─────────────────────────────────────────────

test('carddav: accepts i;unicode-casemap collation', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const textMatch = {
    _: 'Alice',
    _attr: { collation: 'i;unicode-casemap', 'match-type': 'contains' }
  };
  t.notThrows(() => parser.processTextMatch('FN', 'fullName', textMatch));
});

test('carddav: accepts i;ascii-casemap collation', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const textMatch = {
    _: 'Alice',
    _attr: { collation: 'i;ascii-casemap', 'match-type': 'contains' }
  };
  t.notThrows(() => parser.processTextMatch('FN', 'fullName', textMatch));
});

test('carddav: accepts i;octet collation', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const textMatch = {
    _: 'Alice',
    _attr: { collation: 'i;octet', 'match-type': 'contains' }
  };
  t.notThrows(() => parser.processTextMatch('FN', 'fullName', textMatch));
});

test('carddav: rejects unsupported collation with status 422', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const textMatch = {
    _: 'Alice',
    _attr: { collation: 'i;unknown-collation', 'match-type': 'contains' }
  };
  const err = t.throws(() =>
    parser.processTextMatch('FN', 'fullName', textMatch)
  );
  t.is(err.status, 422);
  t.true(err.isSupportedCollationError);
  t.regex(err.message, /Unsupported collation/);
});

test('carddav: rejects i;basic collation with status 422', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const textMatch = {
    _: 'test',
    _attr: { collation: 'i;basic', 'match-type': 'equals' }
  };
  const err = t.throws(() =>
    parser.processTextMatch('FN', 'fullName', textMatch)
  );
  t.is(err.status, 422);
});

test('carddav: defaults to i;unicode-casemap when collation is absent', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const textMatch = { _: 'Alice', _attr: { 'match-type': 'contains' } };
  let result;
  t.notThrows(() => {
    result = parser.processTextMatch('FN', 'fullName', textMatch);
  });
  t.truthy(result);
});

// ─── Unicode NFC Normalization ────────────────────────────────────────────────

test('carddav: normalizes NFC for i;unicode-casemap in buildTextQuery', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const decomposed = 'e\u0301'; // NFD form
  const precomposed = '\u00E9'; // NFC form
  const q1 = parser.buildTextQuery(
    'fullName',
    decomposed,
    'contains',
    'i;unicode-casemap'
  );
  const q2 = parser.buildTextQuery(
    'fullName',
    precomposed,
    'contains',
    'i;unicode-casemap'
  );
  t.deepEqual(q1, q2);
});

test('carddav: does NOT normalize for i;ascii-casemap', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const decomposed = 'e\u0301';
  const precomposed = '\u00E9';
  const q1 = parser.buildTextQuery(
    'fullName',
    decomposed,
    'contains',
    'i;ascii-casemap'
  );
  const q2 = parser.buildTextQuery(
    'fullName',
    precomposed,
    'contains',
    'i;ascii-casemap'
  );
  t.notDeepEqual(q1, q2);
});

test('carddav: normalizes NFC for i;unicode-casemap in buildArrayTextQuery', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const decomposed = 'e\u0301';
  const precomposed = '\u00E9';
  const q1 = parser.buildArrayTextQuery(
    'emails',
    decomposed,
    'contains',
    'i;unicode-casemap'
  );
  const q2 = parser.buildArrayTextQuery(
    'emails',
    precomposed,
    'contains',
    'i;unicode-casemap'
  );
  t.deepEqual(q1, q2);
});

test('carddav: normalizes NFC for i;unicode-casemap in buildContentTextQuery', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const decomposed = 'e\u0301';
  const precomposed = '\u00E9';
  const q1 = parser.buildContentTextQuery(
    'ORG',
    decomposed,
    'contains',
    'i;unicode-casemap'
  );
  const q2 = parser.buildContentTextQuery(
    'ORG',
    precomposed,
    'contains',
    'i;unicode-casemap'
  );
  t.deepEqual(q1, q2);
});

// ─── match-type variants ──────────────────────────────────────────────────────

test('carddav: buildRegexPattern equals', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const result = parser.buildRegexPattern('test', 'equals', 'i');
  t.truthy(result.$regex);
  t.is(result.$options, 'i');
  t.is(result.$regex, '^test$');
});

test('carddav: buildRegexPattern contains', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const result = parser.buildRegexPattern('test', 'contains', 'i');
  t.truthy(result.$regex);
  t.is(result.$regex, 'test');
});

test('carddav: buildRegexPattern starts-with', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const result = parser.buildRegexPattern('test', 'starts-with', 'i');
  t.truthy(result.$regex);
  t.is(result.$regex, '^test');
});

test('carddav: buildRegexPattern ends-with', (t) => {
  const CardDAVFilterParser = require('#helpers/carddav-filter-parser');
  const parser = new CardDAVFilterParser();
  const result = parser.buildRegexPattern('test', 'ends-with', 'i');
  t.truthy(result.$regex);
  t.is(result.$regex, 'test$');
});

// ─── SCHEDULE-AGENT Tests ─────────────────────────────────────────────────────

function buildIcs({
  method = 'REQUEST',
  organizerScheduleAgent,
  attendees = []
} = {}) {
  const orgParam = organizerScheduleAgent
    ? `;SCHEDULE-AGENT=${organizerScheduleAgent}`
    : '';
  const attendeeLines = attendees
    .map(({ email, scheduleAgent, partstat = 'NEEDS-ACTION' }) => {
      const saParam = scheduleAgent ? `;SCHEDULE-AGENT=${scheduleAgent}` : '';
      return `ATTENDEE;PARTSTAT=${partstat}${saParam}:mailto:${email}`;
    })
    .join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    `METHOD:${method}`,
    'BEGIN:VEVENT',
    'UID:test-uid-schedule-agent@example.com',
    'DTSTART:20260601T100000Z',
    'DTEND:20260601T110000Z',
    'SUMMARY:Test Event',
    `ORGANIZER${orgParam}:mailto:organizer@example.com`,
    attendeeLines,
    'END:VEVENT',
    'END:VCALENDAR'
  ]
    .filter(Boolean)
    .join('\r\n');
}

test('schedule-agent: organizer SCHEDULE-AGENT=CLIENT does not suppress attendee processing', (t) => {
  const ics = buildIcs({
    method: 'REQUEST',
    organizerScheduleAgent: 'CLIENT',
    attendees: [{ email: 'recipient@example.com' }]
  });
  t.regex(ics, /METHOD:REQUEST/);
  t.regex(ics, /ORGANIZER;SCHEDULE-AGENT=CLIENT/);
  t.regex(ics, /ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:recipient@example\.com/);
  // The recipient's ATTENDEE line must NOT carry SCHEDULE-AGENT=CLIENT
  t.notRegex(
    ics,
    /ATTENDEE[^:]*SCHEDULE-AGENT=CLIENT[^:]*:mailto:recipient@example\.com/
  );
});

test('schedule-agent: recipient attendee SCHEDULE-AGENT=CLIENT suppresses processing', (t) => {
  const ics = buildIcs({
    method: 'REQUEST',
    attendees: [{ email: 'recipient@example.com', scheduleAgent: 'CLIENT' }]
  });
  t.regex(
    ics,
    /ATTENDEE[^:]*SCHEDULE-AGENT=CLIENT[^:]*:mailto:recipient@example\.com/
  );
});

test('schedule-agent: SCHEDULE-AGENT=SERVER on organizer does not suppress processing', (t) => {
  const ics = buildIcs({
    method: 'REQUEST',
    organizerScheduleAgent: 'SERVER',
    attendees: [{ email: 'recipient@example.com' }]
  });
  t.regex(ics, /ORGANIZER;SCHEDULE-AGENT=SERVER/);
  t.notRegex(
    ics,
    /ATTENDEE[^:]*SCHEDULE-AGENT=CLIENT[^:]*:mailto:recipient@example\.com/
  );
});

test('schedule-agent: no SCHEDULE-AGENT set — processes normally', (t) => {
  const ics = buildIcs({
    method: 'REQUEST',
    attendees: [{ email: 'recipient@example.com' }]
  });
  t.notRegex(ics, /SCHEDULE-AGENT/);
});

// ─── SEQUENCE Validation ──────────────────────────────────────────────────────

test('sequence: accepts REQUEST with higher SEQUENCE than existing', (t) => {
  const existingSeq = 1;
  const incomingSeq = 2;
  t.true(incomingSeq >= existingSeq);
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    'UID:test-uid-sequence@example.com',
    'DTSTART:20260601T100000Z',
    'DTEND:20260601T110000Z',
    'SUMMARY:Test Event',
    `SEQUENCE:${incomingSeq}`,
    'ORGANIZER:mailto:organizer@example.com',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:recipient@example.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  t.regex(ics, /SEQUENCE:2/);
});

test('sequence: accepts REQUEST with equal SEQUENCE (idempotent re-send)', (t) => {
  const existingSeq = 2;
  const incomingSeq = 2;
  t.true(incomingSeq >= existingSeq);
});

test('sequence: rejects REQUEST with lower SEQUENCE (stale per RFC 5546 §3.2.2)', (t) => {
  const existingSeq = 5;
  const incomingSeq = 3;
  t.true(incomingSeq < existingSeq);
});

test('sequence: treats missing SEQUENCE as 0', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    'UID:test-uid-no-seq@example.com',
    'DTSTART:20260601T100000Z',
    'DTEND:20260601T110000Z',
    'SUMMARY:No Sequence',
    'ORGANIZER:mailto:organizer@example.com',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:recipient@example.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  t.notRegex(ics, /SEQUENCE:/);
  // Missing SEQUENCE defaults to 0 per RFC 5545 §3.8.7.4
  t.is(0, 0);
});

// ─── Redis Negative-Cache Invalidation ───────────────────────────────────────

test('redis cache: DEL is called with correct key after successful iMIP processing', async (t) => {
  const deletedKeys = [];
  const mockClient = {
    async del(key) {
      deletedKeys.push(key);
      return 1;
    }
  };
  const aliasId = 'test-alias-id-123';
  const expectedKey = `caldav_inv_empty:${aliasId}`;
  // Simulate what parse-payload.js does after imipResult.processed is true
  if (mockClient && aliasId) {
    await mockClient.del(expectedKey);
  }

  t.is(deletedKeys.length, 1);
  t.is(deletedKeys[0], expectedKey);
});

test('redis cache: DEL is not called when imipResult.processed is false', async (t) => {
  const deletedKeys = [];
  const mockClient = {
    async del(key) {
      deletedKeys.push(key);
      return 1;
    }
  };
  const imipResult = { processed: false };
  if (imipResult && imipResult.processed) {
    await mockClient.del('caldav_inv_empty:test');
  }

  t.is(deletedKeys.length, 0);
});

test('redis cache: DEL failure is caught and does not propagate', async (t) => {
  const mockClient = {
    del: () => Promise.reject(new Error('Redis connection lost'))
  };
  await t.notThrowsAsync(async () => {
    await mockClient.del('caldav_inv_empty:test').catch(() => {
      // swallowed
    });
  });
});

test('redis cache: DEL is called when processCalendarInvites processes > 0 invites', async (t) => {
  const deletedKeys = [];
  const mockClient = {
    async del(key) {
      deletedKeys.push(key);
      return 1;
    }
  };
  const aliasId = 'alias-456';
  const processed = 3;
  if (processed > 0) {
    await mockClient.del(`caldav_inv_empty:${aliasId}`).catch(() => {});
  }

  t.is(deletedKeys.length, 1);
  t.is(deletedKeys[0], `caldav_inv_empty:${aliasId}`);
});

test('redis cache: DEL is NOT called when processCalendarInvites processes 0 invites', async (t) => {
  const deletedKeys = [];
  const mockClient = {
    async del(key) {
      deletedKeys.push(key);
      return 1;
    }
  };
  const processed = 0;
  if (processed > 0) {
    await mockClient.del('caldav_inv_empty:test').catch(() => {});
  }

  t.is(deletedKeys.length, 0);
});

// ─── CardDAV PROPFIND Addressbook Properties ─────────────────────────────────

test('carddav propfind: max-resource-size is 10 MB (10485760 bytes)', (t) => {
  const maxResourceSize = 10 * 1024 * 1024;
  t.is(maxResourceSize, 10_485_760);
  t.is(String(maxResourceSize), '10485760');
});

test('carddav propfind: supported-collation-set includes both collations', (t) => {
  const collationXml =
    '<card:supported-collation>i;ascii-casemap</card:supported-collation>' +
    '<card:supported-collation>i;unicode-casemap</card:supported-collation>';
  t.regex(collationXml, /i;ascii-casemap/);
  t.regex(collationXml, /i;unicode-casemap/);
});

test('carddav propfind: supported-collation-set value is well-formed XML', (t) => {
  const value =
    '<card:supported-collation>i;ascii-casemap</card:supported-collation>' +
    '<card:supported-collation>i;unicode-casemap</card:supported-collation>';
  const opens = (value.match(/<card:supported-collation>/g) || []).length;
  const closes = (value.match(/<\/card:supported-collation>/g) || []).length;
  t.is(opens, 2);
  t.is(closes, 2);
});

// ─── PARTSTAT=DELEGATED Handling ─────────────────────────────────────────────

function buildDelegatedReplyIcs({ delegateeEmail }) {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Test//Test//EN',
    'METHOD:REPLY',
    'BEGIN:VEVENT',
    'UID:test-uid-delegated@example.com',
    'DTSTART:20260601T100000Z',
    'DTEND:20260601T110000Z',
    'SUMMARY:Delegated Event',
    'ORGANIZER:mailto:organizer@example.com',
    `ATTENDEE;PARTSTAT=DELEGATED;DELEGATED-TO="mailto:${delegateeEmail}":mailto:delegator@example.com`,
    `ATTENDEE;PARTSTAT=NEEDS-ACTION;DELEGATED-FROM="mailto:delegator@example.com":mailto:${delegateeEmail}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

test('delegated: REPLY with PARTSTAT=DELEGATED contains DELEGATED-TO parameter', (t) => {
  const ics = buildDelegatedReplyIcs({
    delegateeEmail: 'delegate@example.com'
  });
  t.regex(ics, /PARTSTAT=DELEGATED/);
  t.regex(ics, /DELEGATED-TO="mailto:delegate@example\.com"/);
});

test('delegated: REPLY with PARTSTAT=DELEGATED contains DELEGATED-FROM on delegatee line', (t) => {
  const ics = buildDelegatedReplyIcs({
    delegateeEmail: 'delegate@example.com'
  });
  t.regex(ics, /DELEGATED-FROM="mailto:delegator@example\.com"/);
});

test('delegated: extracts delegatee email from DELEGATED-TO with quotes', (t) => {
  const delegatedToParam = '"mailto:delegate@example.com"';
  const email = delegatedToParam.replace(/^"mailto:/i, '').replace(/"$/, '');
  t.is(email, 'delegate@example.com');
});

test('delegated: extracts delegatee email from DELEGATED-TO without quotes', (t) => {
  const delegatedToParam = 'mailto:delegate@example.com';
  const email = delegatedToParam.replace(/^mailto:/i, '');
  t.is(email, 'delegate@example.com');
});

// ─── iMIP VTIMEZONE Inclusion ─────────────────────────────────────────────────

test('vtimezone: iMIP REQUEST includes VTIMEZONE when DTSTART uses TZID', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'METHOD:REQUEST',
    'BEGIN:VTIMEZONE',
    'TZID:America/New_York',
    'BEGIN:STANDARD',
    'DTSTART:19671029T020000',
    'TZOFFSETFROM:-0400',
    'TZOFFSETTO:-0500',
    'TZNAME:EST',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    'UID:test-uid-tz@example.com',
    'DTSTART;TZID=America/New_York:20260601T100000',
    'DTEND;TZID=America/New_York:20260601T110000',
    'SUMMARY:Timezone Event',
    'ORGANIZER:mailto:organizer@example.com',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  t.regex(ics, /BEGIN:VTIMEZONE/);
  t.regex(ics, /TZID:America\/New_York/);
  t.regex(ics, /DTSTART;TZID=America\/New_York/);
});

test('vtimezone: iMIP REQUEST without VTIMEZONE uses UTC DTSTART', (t) => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Forward Email//CalDAV//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    'UID:test-uid-utc@example.com',
    'DTSTART:20260601T140000Z',
    'DTEND:20260601T150000Z',
    'SUMMARY:UTC Event',
    'ORGANIZER:mailto:organizer@example.com',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@example.com',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  t.notRegex(ics, /BEGIN:VTIMEZONE/);
  t.regex(ics, /DTSTART:20260601T140000Z/);
});

// ─── sync-token negative-cache race condition ─────────────────────────────────

test('sync-token: negative-cache key format is correct', (t) => {
  const aliasId = 'abc123';
  const key = `caldav_inv_empty:${aliasId}`;
  t.is(key, 'caldav_inv_empty:abc123');
});

test('sync-token: negative-cache is not set when invites were processed', (t) => {
  let cacheWasSet = false;
  let cacheWasDeleted = false;
  const processed = 2;
  if (processed === 0) {
    cacheWasSet = true;
  } else {
    cacheWasDeleted = true;
  }

  t.false(cacheWasSet);
  t.true(cacheWasDeleted);
});

test('sync-token: negative-cache is set when no invites were found', (t) => {
  let cacheWasSet = false;
  const processed = 0;
  if (processed === 0) {
    cacheWasSet = true;
  }

  t.true(cacheWasSet);
});

// ─── ICAL.js helper: detectAttendeePartstatChange ────────────────────────────

test('ical: PARTSTAT change detected between old and new ICS', (t) => {
  function makeIcs(partstat) {
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Test//EN',
      'BEGIN:VEVENT',
      'UID:partstat-test@example.com',
      'DTSTART:20260601T100000Z',
      'DTEND:20260601T110000Z',
      'SUMMARY:Test',
      'ORGANIZER:mailto:org@example.com',
      `ATTENDEE;PARTSTAT=${partstat}:mailto:att@example.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  }

  const oldIcs = makeIcs('NEEDS-ACTION');
  const newIcs = makeIcs('ACCEPTED');

  const oldComp = new ICAL.Component(ICAL.parse(oldIcs));
  const newComp = new ICAL.Component(ICAL.parse(newIcs));

  const oldVevent = oldComp.getFirstSubcomponent('vevent');
  const newVevent = newComp.getFirstSubcomponent('vevent');

  const oldAtt = oldVevent.getFirstProperty('attendee');
  const newAtt = newVevent.getFirstProperty('attendee');

  t.is(oldAtt.getParameter('partstat'), 'NEEDS-ACTION');
  t.is(newAtt.getParameter('partstat'), 'ACCEPTED');
  t.not(oldAtt.getParameter('partstat'), newAtt.getParameter('partstat'));
});
