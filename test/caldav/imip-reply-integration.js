/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Integration tests for iMIP REPLY processing in CalDAV
 *
 * These tests verify the end-to-end flow of processing incoming iMIP REPLY
 * messages and updating calendar events via the CalDAV sync mechanism.
 */

const { Buffer } = require('node:buffer');

const test = require('ava');

const utils = require('../utils');
const CalendarInvites = require('#models/calendar-invites');
const {
  updateAttendeePartstat,
  eventHasUid
} = require('#helpers/process-calendar-invites');
const {
  parseImipReply,
  parseImipMessage,
  processImipReply,
  checkAndProcessImipReply,
  checkAndProcessImipMessage
} = require('#helpers/process-imip-reply');

// Sample event ICS that would be stored in the organizer's calendar
const ORGANIZER_EVENT_ICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Forward Email//CalDAV//EN
BEGIN:VEVENT
UID:integration-test-event@forwardemail.net
DTSTAMP:20260201T100000Z
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
SUMMARY:Integration Test Meeting
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:attendee1@external.com
ATTENDEE;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:attendee2@gmail.com
END:VEVENT
END:VCALENDAR`;

// Sample iMIP REPLY from external attendee (O365 style)
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

// Sample iMIP REPLY from Gmail
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

// Sample iMIP REPLY from Apple Mail
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

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

//
// iMIP REPLY parsing tests for various email clients
//

test('parseImipReply - parses O365 REPLY correctly', (t) => {
  const result = parseImipReply(O365_REPLY_ACCEPTED);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'integration-test-event@forwardemail.net');
  t.is(result.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.attendeeEmail, 'attendee1@external.com');
  t.is(result.partstat, 'ACCEPTED');
});

test('parseImipReply - parses Gmail REPLY correctly', (t) => {
  const result = parseImipReply(GMAIL_REPLY_DECLINED);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'integration-test-event@forwardemail.net');
  t.is(result.organizerEmail, 'organizer@forwardemail.net');
  t.is(result.attendeeEmail, 'attendee2@gmail.com');
  t.is(result.partstat, 'DECLINED');
});

test('parseImipReply - parses Apple Mail REPLY correctly', (t) => {
  const result = parseImipReply(APPLE_REPLY_TENTATIVE);

  t.is(result.method, 'REPLY');
  t.is(result.uid, 'apple-test-event@forwardemail.net');
  t.is(result.attendeeEmail, 'appleuser@icloud.com');
  t.is(result.partstat, 'TENTATIVE');
});

//
// CalendarInvites model tests for iMIP source
//

test('CalendarInvites - creates record with imip source', async (t) => {
  const invite = await CalendarInvites.create({
    eventUid: 'imip-source-test@example.com',
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

  // Cleanup
  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('CalendarInvites - tokenExpiresAt is optional for imip source', async (t) => {
  // For iMIP responses, tokenExpiresAt should be optional
  const invite = await CalendarInvites.create({
    eventUid: 'imip-no-token-test@example.com',
    organizerEmail: 'organizer@forwardemail.net',
    attendeeEmail: 'attendee@external.com',
    response: 'DECLINED',
    source: 'imip',
    processed: false
    // Note: no tokenExpiresAt
  });

  t.truthy(invite._id);
  t.is(invite.source, 'imip');
  t.is(invite.tokenExpiresAt, undefined);

  // Cleanup
  await CalendarInvites.deleteOne({ _id: invite._id });
});

//
// processImipReply integration tests
//

test('processImipReply - creates CalendarInvites from parsed iMIP', async (t) => {
  const imipData = parseImipReply(O365_REPLY_ACCEPTED);

  const invite = await processImipReply(imipData, {
    messageId: '<o365-test@microsoft.com>'
  });

  t.truthy(invite._id);
  t.is(invite.eventUid, 'integration-test-event@forwardemail.net');
  t.is(invite.organizerEmail, 'organizer@forwardemail.net');
  t.is(invite.attendeeEmail, 'attendee1@external.com');
  t.is(invite.response, 'ACCEPTED');
  t.is(invite.source, 'imip');
  t.is(invite.sourceMessageId, '<o365-test@microsoft.com>');
  t.false(invite.processed);

  // Cleanup
  await CalendarInvites.deleteOne({ _id: invite._id });
});

test('processImipReply - handles duplicate responses idempotently', async (t) => {
  const imipData = parseImipReply(GMAIL_REPLY_DECLINED);

  // First call creates the invite
  const invite1 = await processImipReply(imipData, {
    messageId: '<gmail-test-1@google.com>'
  });

  // Second call with same response should return existing
  const invite2 = await processImipReply(imipData, {
    messageId: '<gmail-test-2@google.com>'
  });

  t.is(invite1._id.toString(), invite2._id.toString());
  t.is(invite2.response, 'DECLINED');

  // Cleanup
  await CalendarInvites.deleteOne({ _id: invite1._id });
});

test('processImipReply - updates response when attendee changes mind', async (t) => {
  // First create a TENTATIVE response
  const tentativeData = {
    method: 'REPLY',
    uid: 'change-mind-test@example.com',
    organizerEmail: 'organizer@forwardemail.net',
    attendeeEmail: 'changeable@example.com',
    partstat: 'TENTATIVE'
  };

  const invite1 = await processImipReply(tentativeData, {
    messageId: '<first-response@example.com>'
  });
  t.is(invite1.response, 'TENTATIVE');

  // Now send ACCEPTED for the same event/attendee
  const acceptedData = {
    method: 'REPLY',
    uid: 'change-mind-test@example.com',
    organizerEmail: 'organizer@forwardemail.net',
    attendeeEmail: 'changeable@example.com',
    partstat: 'ACCEPTED'
  };

  const invite2 = await processImipReply(acceptedData, {
    messageId: '<second-response@example.com>'
  });

  // Should update the existing record
  t.is(invite1._id.toString(), invite2._id.toString());
  t.is(invite2.response, 'ACCEPTED');

  // Verify in database
  const dbInvite = await CalendarInvites.findById(invite1._id);
  t.is(dbInvite.response, 'ACCEPTED');

  // Cleanup
  await CalendarInvites.deleteOne({ _id: invite1._id });
});

//
// updateAttendeePartstat tests for iMIP integration
//

test('updateAttendeePartstat - updates event from iMIP REPLY data', (t) => {
  const imipData = parseImipReply(O365_REPLY_ACCEPTED);

  const updatedIcs = updateAttendeePartstat(
    ORGANIZER_EVENT_ICS,
    imipData.attendeeEmail,
    imipData.partstat
  );

  t.truthy(updatedIcs);
  t.true(updatedIcs.includes('PARTSTAT=ACCEPTED'));
  // Verify the UID is preserved
  t.true(eventHasUid(updatedIcs, ['integration-test-event@forwardemail.net']));
});

test('updateAttendeePartstat - handles Gmail DECLINED response', (t) => {
  const imipData = parseImipReply(GMAIL_REPLY_DECLINED);

  const updatedIcs = updateAttendeePartstat(
    ORGANIZER_EVENT_ICS,
    imipData.attendeeEmail,
    imipData.partstat
  );

  t.truthy(updatedIcs);
  t.true(updatedIcs.includes('PARTSTAT=DECLINED'));
});

//
// Full email parsing integration tests
//

test('checkAndProcessImipReply - processes email with O365 REPLY attachment', async (t) => {
  const parsedEmail = {
    messageId: '<o365-full-test@microsoft.com>',
    from: { value: [{ address: 'attendee1@external.com' }] },
    to: { value: [{ address: 'organizer@forwardemail.net' }] },
    subject: 'Accepted: Integration Test Meeting',
    attachments: [
      {
        contentType: 'text/calendar; method=REPLY',
        filename: 'invite.ics',
        content: Buffer.from(O365_REPLY_ACCEPTED)
      }
    ]
  };

  const result = await checkAndProcessImipReply(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'attendee1@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.partstat, 'ACCEPTED');
  t.truthy(result.invite);

  // Cleanup
  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

test('checkAndProcessImipReply - processes email with Gmail REPLY in alternatives', async (t) => {
  const parsedEmail = {
    messageId: '<gmail-full-test@google.com>',
    alternatives: [
      {
        contentType: 'text/calendar; method=REPLY; charset=UTF-8',
        content: Buffer.from(GMAIL_REPLY_DECLINED)
      }
    ]
  };

  const result = await checkAndProcessImipReply(parsedEmail, {
    messageId: parsedEmail.messageId,
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.imipData.partstat, 'DECLINED');

  // Cleanup
  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

//
// Edge case tests
//

test('checkAndProcessImipReply - ignores non-calendar emails', async (t) => {
  const parsedEmail = {
    messageId: '<regular-email@example.com>',
    text: 'This is just a regular email',
    html: '<p>This is just a regular email</p>'
  };

  const result = await checkAndProcessImipReply(parsedEmail, {
    toEmail: 'organizer@forwardemail.net'
  });

  t.is(result, null);
});

test('checkAndProcessImipReply - ignores REQUEST method (REPLY-only handler)', async (t) => {
  const requestIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REQUEST
BEGIN:VEVENT
UID:request-not-reply@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
ORGANIZER:mailto:organizer@forwardemail.net
ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@external.com
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = {
    attachments: [
      {
        contentType: 'text/calendar',
        content: Buffer.from(requestIcs)
      }
    ]
  };

  // The REPLY-only handler should return null for REQUEST
  const result = await checkAndProcessImipReply(parsedEmail, {
    toEmail: 'organizer@forwardemail.net'
  });

  t.is(result, null);
});

test('checkAndProcessImipReply - ignores CANCEL method (REPLY-only handler)', async (t) => {
  const cancelIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:CANCEL
BEGIN:VEVENT
UID:cancel-event@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
ORGANIZER:mailto:organizer@forwardemail.net
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = {
    attachments: [
      {
        contentType: 'text/calendar',
        content: Buffer.from(cancelIcs)
      }
    ]
  };

  // The REPLY-only handler should return null for CANCEL
  const result = await checkAndProcessImipReply(parsedEmail, {
    toEmail: 'organizer@forwardemail.net'
  });

  t.is(result, null);
});

//
// checkAndProcessImipMessage tests (comprehensive handler for all methods)
//

test('checkAndProcessImipMessage - processes REQUEST method', async (t) => {
  const requestIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REQUEST
BEGIN:VEVENT
UID:request-test-msg@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
SUMMARY:Team Standup
ORGANIZER:mailto:boss@external.com
ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee@forwardemail.net
END:VEVENT
END:VCALENDAR`;

  const parsedEmail = {
    messageId: '<request-test@external.com>',
    attachments: [
      {
        contentType: 'text/calendar; method=REQUEST',
        content: Buffer.from(requestIcs)
      }
    ]
  };

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

  // Cleanup
  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

test('checkAndProcessImipMessage - processes CANCEL method', async (t) => {
  const cancelIcs = `BEGIN:VCALENDAR
VERSION:2.0
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

  const parsedEmail = {
    messageId: '<cancel-test@external.com>',
    attachments: [
      {
        contentType: 'text/calendar; method=CANCEL',
        content: Buffer.from(cancelIcs)
      }
    ]
  };

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'boss@external.com',
    toEmail: 'attendee@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'CANCEL');

  // Cleanup
  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

test('checkAndProcessImipMessage - processes REPLY method (backwards compat)', async (t) => {
  const parsedEmail = {
    messageId: '<reply-compat-test@external.com>',
    attachments: [
      {
        contentType: 'text/calendar; method=REPLY',
        content: Buffer.from(O365_REPLY_ACCEPTED)
      }
    ]
  };

  const result = await checkAndProcessImipMessage(parsedEmail, {
    messageId: parsedEmail.messageId,
    fromEmail: 'attendee1@external.com',
    toEmail: 'organizer@forwardemail.net'
  });

  t.truthy(result);
  t.true(result.processed);
  t.is(result.method, 'REPLY');

  // Cleanup
  await CalendarInvites.deleteOne({ _id: result.invite._id });
});

test('parseImipMessage - parses REQUEST with all fields', (t) => {
  const requestIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:REQUEST
BEGIN:VEVENT
UID:parse-request-test@example.com
DTSTAMP:20260203T100000Z
DTSTART:20260210T140000Z
DTEND:20260210T150000Z
SUMMARY:Parse Test
SEQUENCE:2
ORGANIZER;CN=Boss:mailto:boss@external.com
ATTENDEE;PARTSTAT=NEEDS-ACTION;CN=Worker:mailto:worker@forwardemail.net
END:VEVENT
END:VCALENDAR`;

  const result = parseImipMessage(requestIcs);
  t.is(result.method, 'REQUEST');
  t.is(result.uid, 'parse-request-test@example.com');
  t.is(result.organizerEmail, 'boss@external.com');
  t.is(result.sequence, 2);
  t.truthy(result.raw);
});

test('parseImipMessage - parses CANCEL correctly', (t) => {
  const cancelIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:CANCEL
BEGIN:VEVENT
UID:parse-cancel-test@example.com
DTSTAMP:20260203T100000Z
STATUS:CANCELLED
ORGANIZER:mailto:boss@external.com
END:VEVENT
END:VCALENDAR`;

  const result = parseImipMessage(cancelIcs);
  t.is(result.method, 'CANCEL');
  t.is(result.uid, 'parse-cancel-test@example.com');
  t.is(result.organizerEmail, 'boss@external.com');
});

test('parseImipMessage - parses PUBLISH (informational, no scheduling action)', (t) => {
  const publishIcs = `BEGIN:VCALENDAR
VERSION:2.0
METHOD:PUBLISH
BEGIN:VEVENT
UID:publish-test@example.com
DTSTAMP:20260203T100000Z
SUMMARY:Published Event
END:VEVENT
END:VCALENDAR`;

  // parseImipMessage returns data for all supported methods including PUBLISH
  // (checkAndProcessImipMessage is what skips PUBLISH for scheduling)
  const result = parseImipMessage(publishIcs);
  t.truthy(result);
  t.is(result.method, 'PUBLISH');
  t.is(result.uid, 'publish-test@example.com');
});

//
// Query tests for finding pending iMIP invites
//

test('CalendarInvites - can query pending iMIP invites by organizer', async (t) => {
  // Create several invites
  await CalendarInvites.create({
    eventUid: 'query-test-1@example.com',
    organizerEmail: 'query-organizer@forwardemail.net',
    attendeeEmail: 'attendee1@external.com',
    response: 'ACCEPTED',
    source: 'imip',
    processed: false
  });

  await CalendarInvites.create({
    eventUid: 'query-test-2@example.com',
    organizerEmail: 'query-organizer@forwardemail.net',
    attendeeEmail: 'attendee2@external.com',
    response: 'DECLINED',
    source: 'imip',
    processed: false
  });

  await CalendarInvites.create({
    eventUid: 'query-test-3@example.com',
    organizerEmail: 'other-organizer@forwardemail.net',
    attendeeEmail: 'attendee3@external.com',
    response: 'TENTATIVE',
    source: 'imip',
    processed: false
  });

  // Query for pending invites for specific organizer
  const pendingInvites = await CalendarInvites.find({
    organizerEmail: 'query-organizer@forwardemail.net',
    processed: false,
    source: 'imip'
  });

  t.is(pendingInvites.length, 2);
  t.true(pendingInvites.some((i) => i.eventUid === 'query-test-1@example.com'));
  t.true(pendingInvites.some((i) => i.eventUid === 'query-test-2@example.com'));

  // Cleanup
  await CalendarInvites.deleteMany({
    eventUid: {
      $in: [
        'query-test-1@example.com',
        'query-test-2@example.com',
        'query-test-3@example.com'
      ]
    }
  });
});
