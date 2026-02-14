/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Integration tests for iMIP processing in CalDAV
 *
 * These tests verify the end-to-end flow of processing incoming iMIP
 * messages through the public checkAndProcessImipMessage entry point
 * and verifying CalendarInvites records are created correctly in MongoDB.
 *
 * All tests exercise the real production code path:
 *   parsedEmail → checkAndProcessImipMessage → CalendarInvites (MongoDB)
 *
 * No private/internal functions are imported or tested directly.
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const utils = require('../utils');
const CalendarInvites = require('#models/calendar-invites');
const { checkAndProcessImipMessage } = require('#helpers/process-imip-reply');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

// O365-style REPLY (ACCEPTED)
const O365_REPLY_ACCEPTED = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Microsoft Corporation//Outlook 16.0 MIMEDIR//EN
METHOD:REPLY
BEGIN:VEVENT
ATTENDEE;PARTSTAT=ACCEPTED;CN=External User:mailto:attendee1@external.com
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
DTSTAMP:20260203T120000Z
ORGANIZER;CN=Organizer:mailto:organizer@forwardemail.net
UID:integration-test-event@forwardemail.net
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

// Gmail-style REPLY (DECLINED)
const GMAIL_REPLY_DECLINED = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Google Inc//Google Calendar 70.9054//EN
METHOD:REPLY
BEGIN:VEVENT
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
DTSTAMP:20260203T130000Z
ORGANIZER:mailto:organizer@forwardemail.net
UID:integration-test-event@forwardemail.net
ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=DECLINED;X-NUM-GUESTS=0:mailto:attendee2@gmail.com
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

// Apple Mail-style REPLY (TENTATIVE)
const APPLE_REPLY_TENTATIVE = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Apple Inc.//Mac OS X 14.0//EN
METHOD:REPLY
BEGIN:VEVENT
UID:apple-test-event@forwardemail.net
DTSTAMP:20260203T140000Z
DTSTART:20260215T100000Z
ORGANIZER;CN=Organizer:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=TENTATIVE;CN=Apple User:mailto:appleuser@icloud.com
END:VEVENT
END:VCALENDAR`;

// REQUEST from external organizer
const SAMPLE_REQUEST = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:REQUEST
BEGIN:VEVENT
UID:request-test-msg@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
SUMMARY:Team Standup
SEQUENCE:2
ORGANIZER;CN=Boss:mailto:boss@external.com
ATTENDEE;PARTSTAT=NEEDS-ACTION;CN=Worker:mailto:attendee@forwardemail.net
END:VEVENT
END:VCALENDAR`;

// CANCEL from external organizer
const SAMPLE_CANCEL = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:CANCEL
BEGIN:VEVENT
UID:cancel-test-msg@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
SUMMARY:Cancelled Meeting
STATUS:CANCELLED
ORGANIZER:mailto:boss@external.com
ATTENDEE:mailto:attendee@forwardemail.net
END:VEVENT
END:VCALENDAR`;

// PUBLISH (informational only)
const SAMPLE_PUBLISH = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:PUBLISH
BEGIN:VEVENT
UID:publish-test@example.com
DTSTAMP:20260203T100000Z
SUMMARY:Published Event
END:VEVENT
END:VCALENDAR`;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// ─── Helper to build a parsed email with ICS attachment ──────────────────────

function buildParsedEmail(icsContent, contentType = 'text/calendar') {
  return {
    messageId: `<test-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@example.com>`,
    attachments: [
      {
        contentType,
        filename: 'invite.ics',
        content: Buffer.from(icsContent)
      }
    ]
  };
}

// ─── O365 REPLY Integration ────────────────────────────────────────────────

test('O365 REPLY ACCEPTED - full E2E creates CalendarInvites record', async (t) => {
  const parsedEmail = buildParsedEmail(O365_REPLY_ACCEPTED);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'attendee1@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REPLY');
  t.is(result.imipData.partstat, 'ACCEPTED');
  t.is(result.imipData.uid, 'integration-test-event@forwardemail.net');
  t.is(result.imipData.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.imipData.attendeeEmail, 'attendee1@external.com');

  // Verify the CalendarInvites record was created in MongoDB
  const invite = await CalendarInvites.findById(result.invite._id);
  t.truthy(invite);
  t.is(invite.response, 'ACCEPTED');
  t.is(invite.method, 'REPLY');
  t.is(invite.source, 'imip');
  t.false(invite.processed);

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

// ─── Gmail REPLY Integration ───────────────────────────────────────────────

test('Gmail REPLY DECLINED - full E2E with Gmail-style formatting', async (t) => {
  // Gmail sends calendar data in alternatives array
  const parsedEmail = {
    messageId: '<gmail-full-test@google.com>',
    alternatives: [
      {
        contentType: 'text/calendar; method=REPLY; charset=UTF-8',
        content: Buffer.from(GMAIL_REPLY_DECLINED)
      }
    ]
  };

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'attendee2@gmail.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.partstat, 'DECLINED');
  t.is(result.imipData.attendeeEmail, 'attendee2@gmail.com');

  const invite = await CalendarInvites.findById(result.invite._id);
  t.truthy(invite);
  t.is(invite.response, 'DECLINED');

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

// ─── Apple Mail REPLY Integration ──────────────────────────────────────────

test('Apple Mail REPLY TENTATIVE - full E2E', async (t) => {
  const parsedEmail = buildParsedEmail(APPLE_REPLY_TENTATIVE);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'appleuser@icloud.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.partstat, 'TENTATIVE');
  t.is(result.imipData.uid, 'apple-test-event@forwardemail.net');

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

// ─── REQUEST Integration ───────────────────────────────────────────────────

test('REQUEST - creates CalendarInvites with rawIcs and sequence', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REQUEST);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'boss@external.com',
    toEmail: 'attendee@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REQUEST');
  t.truthy(result.invite);
  t.is(result.invite.method, 'REQUEST');
  t.truthy(result.invite.rawIcs);
  t.is(result.imipData.sequence, 2);

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

// ─── CANCEL Integration ────────────────────────────────────────────────────

test('CANCEL - creates CalendarInvites record', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_CANCEL);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'boss@external.com',
    toEmail: 'attendee@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'CANCEL');

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

// ─── Google Calendar Sender Mismatch ──────────────────────────────────────

test('REQUEST from Google Calendar infrastructure sender - accepted', async (t) => {
  // Google Calendar sends from calendar-notification@google.com,
  // not from the organizer's gmail.com address.
  // Per RFC 6047 Section 2.4, DKIM/DMARC validates transport authenticity.
  const parsedEmail = buildParsedEmail(SAMPLE_REQUEST);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'calendar-notification@google.com',
    toEmail: 'attendee@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REQUEST');

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

test('CANCEL from Microsoft infrastructure sender - accepted', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_CANCEL);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'noreply@microsoft.com',
    toEmail: 'attendee@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'CANCEL');

  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

// ─── PUBLISH - informational only ──────────────────────────────────────────

test('PUBLISH - returns null (informational only)', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_PUBLISH);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'publisher@example.com',
    toEmail: 'subscriber@example.com'
  });

  t.is(result, null);
});

// ─── Duplicate/Idempotent Handling ─────────────────────────────────────────

test('duplicate REPLY - updates existing CalendarInvites record', async (t) => {
  const parsedEmail1 = buildParsedEmail(O365_REPLY_ACCEPTED);
  const parsedEmail2 = buildParsedEmail(O365_REPLY_ACCEPTED);

  const result1 = await checkAndProcessImipMessage(parsedEmail1, {
    messageId: '<first@example.com>',
    fromEmail: 'attendee1@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result1);
  t.true(result1.processed);

  // Second call with same event/attendee should update existing
  const result2 = await checkAndProcessImipMessage(parsedEmail2, {
    messageId: '<second@example.com>',
    fromEmail: 'attendee1@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result2);
  t.true(result2.processed);
  t.is(result1.invite._id.toString(), result2.invite._id.toString());

  await CalendarInvites.deleteOne({ _id: result1.invite._id });
});

test('attendee changes mind - TENTATIVE then ACCEPTED updates record', async (t) => {
  const tentativeIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:change-mind-integration@example.com
DTSTAMP:20260203T120000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=TENTATIVE:mailto:changeable@example.com
END:VEVENT
END:VCALENDAR`;

  const acceptedIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:change-mind-integration@example.com
DTSTAMP:20260203T130000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=ACCEPTED:mailto:changeable@example.com
END:VEVENT
END:VCALENDAR`;

  const result1 = await checkAndProcessImipMessage(
    buildParsedEmail(tentativeIcs),
    {
      fromEmail: 'changeable@example.com',
      toEmail: 'organizer@forwardemail.net'
    }
  );

  t.truthy(result1);
  t.is(result1.imipData.partstat, 'TENTATIVE');

  const result2 = await checkAndProcessImipMessage(
    buildParsedEmail(acceptedIcs),
    {
      fromEmail: 'changeable@example.com',
      toEmail: 'organizer@forwardemail.net'
    }
  );

  t.truthy(result2);
  t.is(result2.imipData.partstat, 'ACCEPTED');

  // Verify the DB record was updated
  const invite = await CalendarInvites.findById(result1.invite._id);
  t.is(invite.response, 'ACCEPTED');

  await CalendarInvites.deleteOne({ _id: result1.invite._id });
});

// ─── Non-iMIP Emails ──────────────────────────────────────────────────────

test('non-calendar email - returns null', async (t) => {
  const result = await checkAndProcessImipMessage(
    { text: 'Just a regular email' },
    {
      fromEmail: 'sender@example.com',
      toEmail: 'recipient@example.com'
    }
  );

  t.is(result, null);
});

test('email with non-ICS attachment - returns null', async (t) => {
  const parsedEmail = {
    attachments: [
      {
        contentType: 'application/pdf',
        filename: 'document.pdf',
        content: Buffer.from('PDF content')
      }
    ]
  };

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'sender@example.com',
    toEmail: 'recipient@example.com'
  });

  t.is(result, null);
});

// ─── CalendarInvites Query Tests ───────────────────────────────────────────

test('pending iMIP invites can be queried by organizer email', async (t) => {
  // Create invites via the real pipeline
  const ics1 = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:query-test-1-integ@example.com
DTSTAMP:20260203T120000Z
ORGANIZER:mailto:query-organizer@forwardemail.net
ATTENDEE;PARTSTAT=ACCEPTED:mailto:att1@external.com
END:VEVENT
END:VCALENDAR`;

  const ics2 = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:query-test-2-integ@example.com
DTSTAMP:20260203T120000Z
ORGANIZER:mailto:query-organizer@forwardemail.net
ATTENDEE;PARTSTAT=DECLINED:mailto:att2@external.com
END:VEVENT
END:VCALENDAR`;

  const r1 = await checkAndProcessImipMessage(buildParsedEmail(ics1), {
    fromEmail: 'att1@external.com',
    toEmail: 'query-organizer@forwardemail.net'
  });

  const r2 = await checkAndProcessImipMessage(buildParsedEmail(ics2), {
    fromEmail: 'att2@external.com',
    toEmail: 'query-organizer@forwardemail.net'
  });

  // Query pending invites for the organizer
  const pending = await CalendarInvites.find({
    organizerEmail: 'query-organizer@forwardemail.net',
    processed: false
  });

  t.true(pending.length >= 2);
  t.true(pending.some((i) => i.eventUid === 'query-test-1-integ@example.com'));
  t.true(pending.some((i) => i.eventUid === 'query-test-2-integ@example.com'));

  // Cleanup
  if (r1?.invite?._id) await CalendarInvites.deleteOne({ _id: r1.invite._id });
  if (r2?.invite?._id) await CalendarInvites.deleteOne({ _id: r2.invite._id });
});

// ─── CalendarInvites Model Direct Tests ────────────────────────────────────

test('CalendarInvites - creates record with imip source', async (t) => {
  const invite = await CalendarInvites.create({
    eventUid: 'imip-source-integ@example.com',
    organizerEmail: 'organizer@forwardemail.net',
    attendeeEmail: 'attendee@external.com',
    response: 'ACCEPTED',
    source: 'imip',
    sourceMessageId: '<test-message-id@external.com>',
    processed: false
  });

  t.truthy(invite._id);
  t.is(invite.source, 'imip');
  t.is(invite.sourceMessageId, '<test-message-id@external.com>');
  t.false(invite.processed);

  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('CalendarInvites - tokenExpiresAt is optional for imip source', async (t) => {
  const invite = await CalendarInvites.create({
    eventUid: 'imip-no-token-integ@example.com',
    organizerEmail: 'organizer@forwardemail.net',
    attendeeEmail: 'attendee@external.com',
    response: 'DECLINED',
    source: 'imip',
    processed: false
  });

  t.truthy(invite._id);
  t.is(invite.source, 'imip');
  t.is(invite.tokenExpiresAt, undefined);

  await CalendarInvites.deleteOne({ _id: invite._id });
});
