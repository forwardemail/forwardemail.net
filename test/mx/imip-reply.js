/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Tests for iMIP processing in MX server
 *
 * These tests verify the end-to-end flow of incoming emails with iTIP ICS
 * attachments through the public checkAndProcessImipMessage entry point.
 *
 * NOTE: DKIM/DMARC validation is handled by the MX server (is-authenticated-message.js)
 * before messages reach the iMIP processing code. These tests focus on:
 * - Full E2E: email in → CalendarInvites record out
 * - Sender validation (spoofing prevention)
 * - Method routing (REPLY/REQUEST/CANCEL/etc.)
 * - Edge cases (urn:uuid, missing fields, oversized data)
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const utils = require('../utils');
const CalendarInvites = require('#models/calendar-invites');
const { checkAndProcessImipMessage } = require('#helpers/process-imip-reply');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

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

const SAMPLE_CANCEL = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:CANCEL
BEGIN:VEVENT
UID:test-cancel@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE:mailto:attendee@external.com
STATUS:CANCELLED
END:VEVENT
END:VCALENDAR`;

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

const SAMPLE_PUBLISH = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
METHOD:PUBLISH
BEGIN:VEVENT
UID:test-publish@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
SUMMARY:Published Event
END:VEVENT
END:VCALENDAR`;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

// ─── Helper to build a parsed email with ICS attachment ──────────────────────

function buildParsedEmail(icsContent, contentType = 'text/calendar') {
  return {
    messageId: `<test-${Date.now()}@example.com>`,
    attachments: [
      {
        contentType,
        filename: 'invite.ics',
        content: Buffer.from(icsContent)
      }
    ]
  };
}

// ─── REPLY Processing (E2E) ─────────────────────────────────────────────────

test('REPLY ACCEPTED - creates CalendarInvites record with correct data', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REPLY_ACCEPTED);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attendee@external.com',
    toEmail: 'organizer@forwardemail.net',
    messageId: parsedEmail.messageId,
    remoteAddress: '192.168.1.1'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REPLY');
  t.truthy(result.invite);
  t.is(result.imipData.partstat, 'ACCEPTED');
  t.is(result.imipData.uid, 'test-event-12345@example.com');
  t.is(result.imipData.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.imipData.attendeeEmail, 'attendee@external.com');
  t.is(result.imipData.summary, 'Test Meeting');

  // Verify the CalendarInvites record was actually created in MongoDB
  const invite = await CalendarInvites.findById(result.invite._id);
  t.truthy(invite);
  t.is(invite.response, 'ACCEPTED');
  t.is(invite.method, 'REPLY');

  // Cleanup
  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

test('REPLY DECLINED - processes correctly', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REPLY_DECLINED);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attendee@gmail.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.partstat, 'DECLINED');

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

test('REPLY TENTATIVE - processes correctly', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REPLY_TENTATIVE);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attendee@icloud.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.partstat, 'TENTATIVE');

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

test('REPLY with urn:uuid format (iOS) - extracts EMAIL param correctly', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REPLY_URN_UUID);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'iosuser@icloud.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.imipData.attendeeEmail, 'iosuser@icloud.com');
  t.is(result.imipData.partstat, 'ACCEPTED');

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

test('REPLY with missing PARTSTAT - returns null (no valid response)', async (t) => {
  const noPartstat = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:test@example.com
DTSTAMP:20260203T120000Z
ATTENDEE:mailto:test@example.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(noPartstat);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'test@example.com',
    toEmail: 'organizer@example.com'
  });

  // Missing PARTSTAT in REPLY means no valid response - should be null
  t.is(result, null);
});

// ─── REQUEST Processing (E2E) ───────────────────────────────────────────────

test('REQUEST - creates CalendarInvites record for attendee', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REQUEST);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'organizer@forwardemail.net',
    toEmail: 'attendee@external.com'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REQUEST');
  t.truthy(result.invite);
  t.truthy(result.invite.rawIcs);

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

// ─── CANCEL Processing (E2E) ────────────────────────────────────────────────

test('CANCEL - creates CalendarInvites record', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_CANCEL);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'organizer@forwardemail.net',
    toEmail: 'attendee@external.com'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'CANCEL');

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

// ─── PUBLISH - informational only ───────────────────────────────────────────

test('PUBLISH - returns null (informational only, no processing)', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_PUBLISH);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'publisher@example.com',
    toEmail: 'subscriber@example.com'
  });

  t.is(result, null);
});

// ─── Non-iMIP emails ────────────────────────────────────────────────────────

test('non-iMIP email - returns null', async (t) => {
  const parsedEmail = {
    text: 'Just a regular email without calendar content'
  };

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'sender@example.com',
    toEmail: 'recipient@example.com'
  });

  t.is(result, null);
});

test('email without attachments - returns null', async (t) => {
  const result = await checkAndProcessImipMessage(
    { text: 'no attachments' },
    { fromEmail: 'a@b.com', toEmail: 'c@d.com' }
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

// ─── ICS embedded in email text body ────────────────────────────────────────

test('REPLY embedded in text body - processes correctly', async (t) => {
  const parsedEmail = {
    text: SAMPLE_REPLY_ACCEPTED,
    messageId: '<text-body-test@example.com>'
  };

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attendee@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REPLY');

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

// ─── Security: Sender Mismatch ──────────────────────────────────────────────

test('REPLY from spoofed sender - rejected', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REPLY_ACCEPTED);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attacker@evil.com', // Does NOT match attendee@external.com
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.false(result.processed);
  t.true(result.rejected);
});

test('REQUEST from spoofed sender - rejected', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REQUEST);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attacker@evil.com', // Does NOT match organizer@forwardemail.net
    toEmail: 'attendee@external.com'
  });

  t.truthy(result);
  t.false(result.processed);
  t.true(result.rejected);
});

test('REPLY sender case-insensitive match - accepted', async (t) => {
  const parsedEmail = buildParsedEmail(SAMPLE_REPLY_ACCEPTED);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'Attendee@External.COM', // Case differs but same email
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

test('REPLY sender subdomain match - accepted', async (t) => {
  // Same user at subdomain should be allowed
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:subdomain-test@example.com
DTSTAMP:20260203T120000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=ACCEPTED:mailto:user@company.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(ics);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'user@mail.company.com', // Subdomain of company.com
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});

test('REPLY different user same domain - rejected', async (t) => {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:diff-user-test@example.com
DTSTAMP:20260203T120000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=ACCEPTED:mailto:bob@company.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(ics);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'alice@company.com', // Different user, same domain
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.false(result.processed);
  t.true(result.rejected);
});

// ─── Edge Cases ─────────────────────────────────────────────────────────────

test('oversized ICS data - returns null', async (t) => {
  const largeIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:large-test@example.com
DESCRIPTION:${'x'.repeat(150_000)}
ATTENDEE;PARTSTAT=ACCEPTED:mailto:test@example.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(largeIcs);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'test@example.com',
    toEmail: 'organizer@example.com'
  });

  // Oversized data should be rejected at parse level → null
  t.is(result, null);
});

test('ICS with missing UID - returns null', async (t) => {
  const noUid = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
DTSTAMP:20260203T120000Z
ATTENDEE;PARTSTAT=ACCEPTED:mailto:test@example.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(noUid);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'test@example.com',
    toEmail: 'organizer@example.com'
  });

  t.is(result, null);
});

test('ICS with missing ATTENDEE in REPLY - returns null', async (t) => {
  const noAttendee = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:no-attendee@example.com
DTSTAMP:20260203T120000Z
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(noAttendee);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'test@example.com',
    toEmail: 'organizer@example.com'
  });

  t.is(result, null);
});

test('SCHEDULE-AGENT=CLIENT - skipped (client handles scheduling)', async (t) => {
  const clientScheduled = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REPLY
BEGIN:VEVENT
UID:client-scheduled@example.com
DTSTAMP:20260203T120000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=ACCEPTED;SCHEDULE-AGENT=CLIENT:mailto:attendee@external.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = buildParsedEmail(clientScheduled);

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attendee@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.is(result, null);
});

test('invalid iCalendar data - returns null', async (t) => {
  const parsedEmail = buildParsedEmail('not valid icalendar data at all');

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'sender@example.com',
    toEmail: 'recipient@example.com'
  });

  t.is(result, null);
});

test('application/ics content type - processes correctly', async (t) => {
  const parsedEmail = buildParsedEmail(
    SAMPLE_REPLY_ACCEPTED,
    'application/ics'
  );

  const result = await checkAndProcessImipMessage(parsedEmail, {
    fromEmail: 'attendee@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);

  if (result.invite?._id) {
    await CalendarInvites.deleteOne({ _id: result.invite._id });
  }
});
