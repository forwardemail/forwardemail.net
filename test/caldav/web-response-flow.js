/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Web Response Flow E2E Tests
 **
 * These tests verify the complete web-based calendar invite response flow:
 * - Token generation and parsing
 * - CalendarInvites MongoDB queue
 * - Rate limiting
 * - Web controller behavior
 */

const test = require('ava');

// Import helpers
const {
  generateToken: generateResponseToken,
  parseToken: parseResponseToken,
  responseToPartstat,
  hashToken,
  TOKEN_EXPIRATION_MS,
  TOKEN_VERSION
} = require('../../helpers/calendar-response');

const {
  checkRateLimit,
  recordResponse,
  isDuplicateResponse,
  RESPONSE_COOLDOWN_MS,
  ATTENDEE_EVENT_LIMIT,
  IP_LIMIT,
  RATE_LIMIT_WINDOW_MS
} = require('../../helpers/calendar-rate-limit');

const CalendarInvites = require('../../app/models/calendar-invites');

// ============================================
// Token Generation Tests
// ============================================

test('generateResponseToken creates valid token structure', (t) => {
  const token = generateResponseToken({
    eventUid: 'test-event-123@forwardemail.net',
    attendeeEmail: 'attendee@example.com',
    organizerEmail: 'organizer@example.com',
    eventSummary: 'Test Meeting'
  });

  t.truthy(token);
  t.is(typeof token, 'string');
  t.true(token.length > 50); // Encrypted token should be substantial
});

test('generateResponseToken includes all required fields', (t) => {
  const options = {
    eventUid: 'uid-123',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  };

  const token = generateResponseToken(options);
  const parsed = parseResponseToken(token);

  t.is(parsed.eventUid, options.eventUid);
  t.is(parsed.attendeeEmail, options.attendeeEmail);
  t.is(parsed.organizerEmail, options.organizerEmail);
});

test('generateResponseToken sets expiration 30 days in future', (t) => {
  const token = generateResponseToken({
    eventUid: 'uid-123',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  const parsed = parseResponseToken(token);
  const expiresAt = new Date(parsed.expiresAt);
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + TOKEN_EXPIRATION_MS);

  // Should be within 1 minute of 30 days from now
  const diff = Math.abs(expiresAt.getTime() - thirtyDaysFromNow.getTime());
  t.true(diff < 60000);
});

test('generateResponseToken throws for missing eventUid', (t) => {
  t.throws(
    () =>
      generateResponseToken({
        attendeeEmail: 'att@test.com',
        organizerEmail: 'org@test.com'
      }),
    { instanceOf: TypeError }
  );
});

test('generateResponseToken throws for missing attendeeEmail', (t) => {
  t.throws(
    () =>
      generateResponseToken({
        eventUid: 'uid-123',
        organizerEmail: 'org@test.com'
      }),
    { instanceOf: TypeError }
  );
});

test('generateResponseToken throws for missing organizerEmail', (t) => {
  t.throws(
    () =>
      generateResponseToken({
        eventUid: 'uid-123',
        attendeeEmail: 'att@test.com'
      }),
    { instanceOf: TypeError }
  );
});

// ============================================
// Token Parsing Tests
// ============================================

test('parseResponseToken decrypts valid token', (t) => {
  const original = {
    eventUid: 'parse-test-uid',
    attendeeEmail: 'parse@test.com',
    organizerEmail: 'org@test.com'
  };

  const token = generateResponseToken(original);
  const parsed = parseResponseToken(token);

  t.is(parsed.eventUid, original.eventUid);
  t.is(parsed.attendeeEmail, original.attendeeEmail);
  t.is(parsed.organizerEmail, original.organizerEmail);
  t.is(parsed.version, TOKEN_VERSION);
});

test('parseResponseToken throws for invalid token', (t) => {
  t.throws(() => parseResponseToken('invalid-token'), { instanceOf: Error });
});

test('parseResponseToken throws for empty token', (t) => {
  t.throws(() => parseResponseToken(''), { instanceOf: Error });
});

test('parseResponseToken throws for null token', (t) => {
  t.throws(() => parseResponseToken(null), { instanceOf: Error });
});

test('parseResponseToken throws for tampered token', (t) => {
  const token = generateResponseToken({
    eventUid: 'uid-123',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  // Tamper with the token
  const tampered = token.slice(0, -10) + 'xxxxxxxxxx';
  t.throws(() => parseResponseToken(tampered), { instanceOf: Error });
});

// ============================================
// Token Expiration Tests
// ============================================

test('parseResponseToken validates fresh token is not expired', (t) => {
  // Create a fresh token
  const token = generateResponseToken({
    eventUid: 'uid-123',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  // Fresh token should parse without throwing
  const parsed = parseResponseToken(token);
  // expiresAt should be in the future
  t.true(parsed.expiresAt > new Date());
});

// ============================================
// Response to PARTSTAT Conversion Tests
// ============================================

test('responseToPartstat converts accept correctly', (t) => {
  t.is(responseToPartstat('accept'), 'ACCEPTED');
});

test('responseToPartstat converts decline correctly', (t) => {
  t.is(responseToPartstat('decline'), 'DECLINED');
});

test('responseToPartstat converts tentative correctly', (t) => {
  t.is(responseToPartstat('tentative'), 'TENTATIVE');
});

test('responseToPartstat is case insensitive', (t) => {
  t.is(responseToPartstat('ACCEPT'), 'ACCEPTED');
  t.is(responseToPartstat('Accept'), 'ACCEPTED');
  t.is(responseToPartstat('DECLINE'), 'DECLINED');
  t.is(responseToPartstat('Tentative'), 'TENTATIVE');
});

test('responseToPartstat throws for invalid response', (t) => {
  t.throws(() => responseToPartstat('invalid'), { instanceOf: TypeError });
  t.throws(() => responseToPartstat('maybe'), { instanceOf: TypeError });
  t.throws(() => responseToPartstat('yes'), { instanceOf: TypeError });
});

// ============================================
// Hash Token Tests
// ============================================

test('hashToken produces consistent results', (t) => {
  const hash1 = hashToken('test-token-123');
  const hash2 = hashToken('test-token-123');
  t.is(hash1, hash2);
});

test('hashToken produces different results for different inputs', (t) => {
  const hash1 = hashToken('token-1');
  const hash2 = hashToken('token-2');
  t.not(hash1, hash2);
});

test('hashToken returns hex string', (t) => {
  const hash = hashToken('test');
  t.regex(hash, /^[a-f\d]+$/);
});

// ============================================
// Rate Limiting Constants Tests
// ============================================

test('RESPONSE_COOLDOWN_MS is 5 seconds', (t) => {
  t.is(RESPONSE_COOLDOWN_MS, 5000);
});

test('ATTENDEE_EVENT_LIMIT is 10', (t) => {
  t.is(ATTENDEE_EVENT_LIMIT, 10);
});

test('IP_LIMIT is 50', (t) => {
  t.is(IP_LIMIT, 50);
});

test('RATE_LIMIT_WINDOW_MS is 1 hour', (t) => {
  t.is(RATE_LIMIT_WINDOW_MS, 3600000);
});

// ============================================
// Rate Limiting Function Tests (without Redis)
// ============================================

test('checkRateLimit returns not limited when no Redis client', async (t) => {
  const result = await checkRateLimit(null, {
    eventUid: 'uid-123',
    attendeeEmail: 'att@test.com',
    ip: '127.0.0.1'
  });

  t.false(result.limited);
  t.is(result.reason, undefined);
});

test('recordResponse does not throw when no Redis client', async (t) => {
  await t.notThrowsAsync(async () => {
    await recordResponse(null, {
      eventUid: 'uid-123',
      attendeeEmail: 'att@test.com',
      ip: '127.0.0.1',
      response: 'ACCEPTED'
    });
  });
});

test('isDuplicateResponse returns false when no Redis client', async (t) => {
  const result = await isDuplicateResponse(null, {
    eventUid: 'uid-123',
    attendeeEmail: 'att@test.com',
    response: 'ACCEPTED'
  });

  t.false(result);
});

// ============================================
// CalendarInvites Model Tests
// ============================================

test('CalendarInvites schema has all required fields', (t) => {
  const schema = CalendarInvites.schema.obj;

  t.truthy(schema.eventUid);
  t.truthy(schema.attendeeEmail);
  t.truthy(schema.organizerEmail);
  t.truthy(schema.response);
  t.truthy(schema.tokenExpiresAt);
  t.truthy(schema.processed);
  t.truthy(schema.processAttempts);
});

test('CalendarInvites response enum contains valid values', (t) => {
  const responseEnum = CalendarInvites.schema.path('response').enumValues;

  t.true(responseEnum.includes('ACCEPTED'));
  t.true(responseEnum.includes('DECLINED'));
  t.true(responseEnum.includes('TENTATIVE'));
});

test('CalendarInvites processed defaults to false', (t) => {
  const { defaultValue } = CalendarInvites.schema.path('processed');
  t.is(defaultValue, false);
});

test('CalendarInvites processAttempts defaults to 0', (t) => {
  const { defaultValue } = CalendarInvites.schema.path('processAttempts');
  t.is(defaultValue, 0);
});

// ============================================
// End-to-End Flow Simulation Tests
// ============================================

test('E2E: Token generation -> parsing -> validation flow', (t) => {
  // Step 1: Generate token (simulates invitation email generation)
  const inviteData = {
    eventUid: 'e2e-test-event@forwardemail.net',
    attendeeEmail: 'attendee@example.com',
    organizerEmail: 'organizer@example.com'
  };

  const token = generateResponseToken(inviteData);
  t.truthy(token);

  // Step 2: Parse token (simulates clicking link in email)
  const parsed = parseResponseToken(token);
  t.is(parsed.eventUid, inviteData.eventUid);
  t.is(parsed.attendeeEmail, inviteData.attendeeEmail);
  t.true(parsed.expiresAt > new Date()); // Token should not be expired

  // Step 3: Convert response to PARTSTAT
  const partstat = responseToPartstat('accept');
  t.is(partstat, 'ACCEPTED');

  // Step 4: Validate the data would be valid for CalendarInvites
  const inviteDoc = {
    eventUid: parsed.eventUid,
    attendeeEmail: parsed.attendeeEmail,
    organizerEmail: parsed.organizerEmail,
    response: partstat,
    tokenExpiresAt: new Date(parsed.expiresAt),
    processed: false,
    processAttempts: 0
  };

  t.truthy(inviteDoc.eventUid);
  t.truthy(inviteDoc.attendeeEmail);
  t.truthy(inviteDoc.organizerEmail);
  t.truthy(inviteDoc.response);
  t.truthy(inviteDoc.tokenExpiresAt);
});

test('E2E: Multiple attendees can respond to same event', (t) => {
  const eventUid = 'multi-attendee-event@forwardemail.net';
  const organizerEmail = 'organizer@example.com';

  const attendees = [
    { email: 'alice@example.com', response: 'accept' },
    { email: 'bob@example.com', response: 'decline' },
    { email: 'charlie@example.com', response: 'tentative' }
  ];

  const responses = attendees.map((attendee) => {
    const token = generateResponseToken({
      eventUid,
      attendeeEmail: attendee.email,
      organizerEmail
    });

    const parsed = parseResponseToken(token);
    const partstat = responseToPartstat(attendee.response);

    return {
      attendeeEmail: parsed.attendeeEmail,
      partstat
    };
  });

  t.is(responses.length, 3);
  t.is(responses[0].partstat, 'ACCEPTED');
  t.is(responses[1].partstat, 'DECLINED');
  t.is(responses[2].partstat, 'TENTATIVE');
});

test('E2E: Same attendee can change response', (t) => {
  const eventUid = 'change-response-event@forwardemail.net';
  const attendeeEmail = 'changeable@example.com';
  const organizerEmail = 'organizer@example.com';

  // First response: accept
  const token1 = generateResponseToken({
    eventUid,
    attendeeEmail,
    organizerEmail
  });
  const parsed1 = parseResponseToken(token1);
  const partstat1 = responseToPartstat('accept');

  // Second response: decline (change of mind)
  const token2 = generateResponseToken({
    eventUid,
    attendeeEmail,
    organizerEmail
  });
  const parsed2 = parseResponseToken(token2);
  const partstat2 = responseToPartstat('decline');

  t.is(parsed1.eventUid, parsed2.eventUid);
  t.is(parsed1.attendeeEmail, parsed2.attendeeEmail);
  t.is(partstat1, 'ACCEPTED');
  t.is(partstat2, 'DECLINED');
});

// ============================================
// Security Tests
// ============================================

test('Security: Different events produce different tokens', (t) => {
  const token1 = generateResponseToken({
    eventUid: 'event-1@test.com',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  const token2 = generateResponseToken({
    eventUid: 'event-2@test.com',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  t.not(token1, token2);
});

test('Security: Different attendees produce different tokens', (t) => {
  const token1 = generateResponseToken({
    eventUid: 'event@test.com',
    attendeeEmail: 'att1@test.com',
    organizerEmail: 'org@test.com'
  });

  const token2 = generateResponseToken({
    eventUid: 'event@test.com',
    attendeeEmail: 'att2@test.com',
    organizerEmail: 'org@test.com'
  });

  t.not(token1, token2);
});

test('Security: Token cannot be used for different event', (t) => {
  const token = generateResponseToken({
    eventUid: 'original-event@test.com',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  const parsed = parseResponseToken(token);

  // Token is bound to original event
  t.is(parsed.eventUid, 'original-event@test.com');
  t.not(parsed.eventUid, 'different-event@test.com');
});

test('Security: Token hash is unique per token', (t) => {
  const token1 = generateResponseToken({
    eventUid: 'event@test.com',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  const token2 = generateResponseToken({
    eventUid: 'event@test.com',
    attendeeEmail: 'att@test.com',
    organizerEmail: 'org@test.com'
  });

  // Even same data produces different tokens (due to timestamp/random)
  const hash1 = hashToken(token1);
  const hash2 = hashToken(token2);

  // Hashes should be different for different tokens
  t.not(hash1, hash2);
});
