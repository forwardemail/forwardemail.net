/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for iMIP REPLY processing in MX server
 *
 * These tests verify that incoming emails with METHOD:REPLY ICS attachments
 * are properly detected, security validated, and processed to update calendar invite responses.
 *
 * NOTE: DKIM/DMARC validation is handled by the MX server (is-authenticated-message.js)
 * before messages reach the iMIP processing code. These tests focus on:
 * - ICS parsing and extraction
 * - Sender/attendee match validation
 * - Rate limiting
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const utils = require('../utils');
const {
  extractImipReply,
  parseImipReply,
  checkAndProcessImipReply,
  validateSenderAttendeeMatch,
  RESPONSE_PARTSTAT,
  SECURITY_CODES
} = require('#helpers/process-imip-reply');

// Sample iMIP REPLY ICS content (ACCEPTED)
const SAMPLE_REPLY_ACCEPTED = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Microsoft Corporation//Outlook 16.0//EN
METHOD:REPLY
BEGIN:VEVENT
UID:test-event-12345@example.com
DTSTAMP:20260203T120000Z
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
SUMMARY:Test Meeting
ORGANIZER;CN=Organizer:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=ACCEPTED;CN=Attendee:mailto:attendee@external.com
END:VEVENT
END:VCALENDAR`;

// Sample iMIP REPLY ICS content (DECLINED)
const SAMPLE_REPLY_DECLINED = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Google Inc//Google Calendar//EN
METHOD:REPLY
BEGIN:VEVENT
UID:test-event-67890@example.com
DTSTAMP:20260203T130000Z
DTSTART:20260215T100000Z
SUMMARY:Another Meeting
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=DECLINED:mailto:attendee@gmail.com
END:VEVENT
END:VCALENDAR`;

// Sample iMIP REPLY ICS content (TENTATIVE)
const SAMPLE_REPLY_TENTATIVE = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//Mac OS X 10.15//EN
METHOD:REPLY
BEGIN:VEVENT
UID:test-event-tentative@example.com
DTSTAMP:20260203T140000Z
DTSTART:20260220T090000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=TENTATIVE:mailto:attendee@icloud.com
END:VEVENT
END:VCALENDAR`;

// Sample REQUEST (not a REPLY - should be ignored)
const SAMPLE_REQUEST = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:test-request@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@external.com
END:VEVENT
END:VCALENDAR`;

// Sample REPLY with urn:uuid format (iOS style)
const SAMPLE_REPLY_URN_UUID = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//iOS 17.0//EN
METHOD:REPLY
BEGIN:VEVENT
UID:ios-event-uuid@example.com
DTSTAMP:20260203T150000Z
DTSTART:20260225T110000Z
ORGANIZER;CN=Organizer;EMAIL=organizer@forwardemail.net:urn:uuid:12345-abcde
ATTENDEE;PARTSTAT=ACCEPTED;CN=iOS User;EMAIL=iosuser@icloud.com:urn:uuid:67890-fghij
END:VEVENT
END:VCALENDAR`;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

//
// parseImipReply tests
//

test('parseImipReply - parses ACCEPTED reply correctly', (t) => {
  const result = parseImipReply(SAMPLE_REPLY_ACCEPTED);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'test-event-12345@example.com');
  t.is(result.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.attendeeEmail, 'attendee@external.com');
  t.is(result.partstat, 'ACCEPTED');
  t.is(result.summary, 'Test Meeting');
});

test('parseImipReply - parses DECLINED reply correctly', (t) => {
  const result = parseImipReply(SAMPLE_REPLY_DECLINED);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'test-event-67890@example.com');
  t.is(result.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.attendeeEmail, 'attendee@gmail.com');
  t.is(result.partstat, 'DECLINED');
});

test('parseImipReply - parses TENTATIVE reply correctly', (t) => {
  const result = parseImipReply(SAMPLE_REPLY_TENTATIVE);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'test-event-tentative@example.com');
  t.is(result.attendeeEmail, 'attendee@icloud.com');
  t.is(result.partstat, 'TENTATIVE');
});

test('parseImipReply - handles urn:uuid format with EMAIL parameter', (t) => {
  const result = parseImipReply(SAMPLE_REPLY_URN_UUID);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'ios-event-uuid@example.com');
  t.is(result.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.attendeeEmail, 'iosuser@icloud.com');
  t.is(result.partstat, 'ACCEPTED');
});

test('parseImipReply - returns null for non-REPLY method', (t) => {
  const result = parseImipReply(SAMPLE_REQUEST);
  t.is(result, null);
});

test('parseImipReply - returns null for invalid iCalendar data', (t) => {
  t.is(parseImipReply('not valid icalendar'), null);
  t.is(parseImipReply(null), null);
  t.is(parseImipReply(''), null);
});

test('parseImipReply - returns null for missing UID', (t) => {
  const noUid = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
DTSTAMP:20260203T120000Z
ATTENDEE;PARTSTAT=ACCEPTED:mailto:test@example.com
END:VEVENT
END:VCALENDAR`;

  const result = parseImipReply(noUid);
  t.is(result, null);
});

test('parseImipReply - returns null for missing ATTENDEE', (t) => {
  const noAttendee = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:test@example.com
DTSTAMP:20260203T120000Z
END:VEVENT
END:VCALENDAR`;

  const result = parseImipReply(noAttendee);
  t.is(result, null);
});

test('parseImipReply - returns null for missing PARTSTAT', (t) => {
  const noPartstat = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:test@example.com
DTSTAMP:20260203T120000Z
ATTENDEE:mailto:test@example.com
END:VEVENT
END:VCALENDAR`;

  const result = parseImipReply(noPartstat);
  t.is(result, null);
});

test('parseImipReply - rejects oversized ICS data', (t) => {
  // Create ICS data larger than 100KB limit
  const largeData = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:test@example.com
DESCRIPTION:${'x'.repeat(150000)}
ATTENDEE;PARTSTAT=ACCEPTED:mailto:test@example.com
END:VEVENT
END:VCALENDAR`;

  const result = parseImipReply(largeData);
  t.is(result, null);
});

//
// extractImipReply tests
//

test('extractImipReply - extracts from text/calendar attachment', (t) => {
  const parsedEmail = {
    attachments: [
      {
        contentType: 'text/calendar; method=REPLY',
        filename: 'invite.ics',
        content: Buffer.from(SAMPLE_REPLY_ACCEPTED)
      }
    ]
  };

  const result = extractImipReply(parsedEmail);

  t.truthy(result);
  t.is(result.method, 'REPLY');
  t.is(result.partstat, 'ACCEPTED');
});

test('extractImipReply - extracts from application/ics attachment', (t) => {
  const parsedEmail = {
    attachments: [
      {
        contentType: 'application/ics',
        filename: 'response.ics',
        content: Buffer.from(SAMPLE_REPLY_DECLINED)
      }
    ]
  };

  const result = extractImipReply(parsedEmail);

  t.truthy(result);
  t.is(result.partstat, 'DECLINED');
});

test('extractImipReply - returns null for non-REPLY ICS', (t) => {
  const parsedEmail = {
    attachments: [
      {
        contentType: 'text/calendar',
        filename: 'invite.ics',
        content: Buffer.from(SAMPLE_REQUEST)
      }
    ]
  };

  const result = extractImipReply(parsedEmail);

  t.is(result, null);
});

test('extractImipReply - returns null for email without ICS', (t) => {
  const parsedEmail = {
    text: 'Just a regular email',
    attachments: [
      {
        contentType: 'application/pdf',
        filename: 'document.pdf',
        content: Buffer.from('PDF content')
      }
    ]
  };

  const result = extractImipReply(parsedEmail);

  t.is(result, null);
});

test('extractImipReply - returns null for null/undefined input', (t) => {
  t.is(extractImipReply(null), null);
  t.is(extractImipReply(undefined), null);
  t.is(extractImipReply({}), null);
});

test('extractImipReply - extracts from embedded text content', (t) => {
  const parsedEmail = {
    text: SAMPLE_REPLY_ACCEPTED
  };

  const result = extractImipReply(parsedEmail);

  t.truthy(result);
  t.is(result.method, 'REPLY');
  t.is(result.partstat, 'ACCEPTED');
});

//
// SECURITY TESTS: validateSenderAttendeeMatch
//

test('validateSenderAttendeeMatch - passes with exact match', (t) => {
  const result = validateSenderAttendeeMatch(
    'user@example.com',
    'user@example.com'
  );

  t.true(result.valid);
  t.is(result.code, SECURITY_CODES.VALID);
});

test('validateSenderAttendeeMatch - passes with case-insensitive match', (t) => {
  const result = validateSenderAttendeeMatch(
    'User@Example.COM',
    'user@example.com'
  );

  t.true(result.valid);
});

test('validateSenderAttendeeMatch - fails with different email', (t) => {
  const result = validateSenderAttendeeMatch(
    'attacker@evil.com',
    'victim@example.com'
  );

  t.false(result.valid);
  t.is(result.code, SECURITY_CODES.SENDER_MISMATCH);
});

test('validateSenderAttendeeMatch - passes with same user, related domain', (t) => {
  // Same user at subdomain
  const result = validateSenderAttendeeMatch(
    'user@mail.company.com',
    'user@company.com'
  );

  t.true(result.valid);
  t.is(result.reason, 'Same user, related domain');
});

test('validateSenderAttendeeMatch - fails with different user, same domain', (t) => {
  const result = validateSenderAttendeeMatch(
    'alice@company.com',
    'bob@company.com'
  );

  t.false(result.valid);
});

test('validateSenderAttendeeMatch - fails with missing sender', (t) => {
  const result = validateSenderAttendeeMatch(null, 'user@example.com');

  t.false(result.valid);
  t.is(result.code, SECURITY_CODES.SENDER_MISMATCH);
});

test('validateSenderAttendeeMatch - fails with missing attendee', (t) => {
  const result = validateSenderAttendeeMatch('user@example.com', null);

  t.false(result.valid);
});

//
// checkAndProcessImipReply integration tests
//

test('checkAndProcessImipReply - returns null for non-iMIP email', async (t) => {
  const parsedEmail = {
    text: 'Just a regular email without calendar content'
  };

  const result = await checkAndProcessImipReply(parsedEmail, {
    fromEmail: 'sender@example.com',
    toEmail: 'recipient@example.com'
  });

  t.is(result, null);
});

test('checkAndProcessImipReply - rejects sender mismatch', async (t) => {
  const parsedEmail = {
    attachments: [
      {
        contentType: 'text/calendar',
        filename: 'invite.ics',
        content: Buffer.from(SAMPLE_REPLY_ACCEPTED)
      }
    ]
  };

  const result = await checkAndProcessImipReply(parsedEmail, {
    fromEmail: 'attacker@evil.com', // Different from attendee@external.com
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.false(result.processed);
  t.true(result.rejected);
  t.is(result.code, SECURITY_CODES.SENDER_MISMATCH);
});

test('checkAndProcessImipReply - processes valid reply', async (t) => {
  const CalendarInvites = require('#models/calendar-invites');

  const parsedEmail = {
    messageId: '<test-message-id@example.com>',
    attachments: [
      {
        contentType: 'text/calendar',
        filename: 'invite.ics',
        content: Buffer.from(SAMPLE_REPLY_ACCEPTED)
      }
    ]
  };

  const result = await checkAndProcessImipReply(parsedEmail, {
    fromEmail: 'attendee@external.com', // Matches attendee in ICS
    toEmail: 'organizer@forwardemail.net',
    remoteAddress: '192.168.1.1'
  });

  t.truthy(result);
  t.true(result.processed);
  t.truthy(result.invite);
  t.is(result.imipData.partstat, 'ACCEPTED');

  // Cleanup
  if (result.invite && result.invite._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

//
// RESPONSE_PARTSTAT constant tests
//

test('RESPONSE_PARTSTAT contains valid values', (t) => {
  t.true(RESPONSE_PARTSTAT.includes('ACCEPTED'));
  t.true(RESPONSE_PARTSTAT.includes('DECLINED'));
  t.true(RESPONSE_PARTSTAT.includes('TENTATIVE'));
  t.false(RESPONSE_PARTSTAT.includes('NEEDS-ACTION'));
});
