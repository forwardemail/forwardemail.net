/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const test = require('ava');

// Import the model
const CalendarInvites = require('#models/calendar-invites');

test('CalendarInvites model has correct schema fields', (t) => {
  const { schema } = CalendarInvites;

  // Check required fields exist
  t.truthy(schema.path('eventUid'));
  t.truthy(schema.path('organizerEmail'));
  t.truthy(schema.path('attendeeEmail'));
  t.truthy(schema.path('response'));
  t.truthy(schema.path('tokenExpiresAt'));

  // Check optional fields exist
  t.truthy(schema.path('comment'));
  t.truthy(schema.path('processed'));
  t.truthy(schema.path('processedAt'));
  t.truthy(schema.path('processError'));
  t.truthy(schema.path('processAttempts'));
  t.truthy(schema.path('ip'));
  t.truthy(schema.path('userAgent'));
  t.truthy(schema.path('tokenHash'));
});

test('CalendarInvites response enum is correct', (t) => {
  const { schema } = CalendarInvites;
  const responseField = schema.path('response');

  // Extended enum includes NEEDS-ACTION, DELEGATED, CANCELLED per RFC 5546
  t.deepEqual(responseField.enumValues, [
    'ACCEPTED',
    'DECLINED',
    'TENTATIVE',
    'NEEDS-ACTION',
    'DELEGATED',
    'CANCELLED'
  ]);
});

test('CalendarInvites has method field', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('method');

  t.truthy(field);
  t.is(field.defaultValue, 'REPLY');
  t.deepEqual(field.enumValues, [
    'REPLY',
    'REQUEST',
    'CANCEL',
    'ADD',
    'REFRESH',
    'COUNTER',
    'DECLINECOUNTER',
    'PUBLISH'
  ]);
});

test('CalendarInvites has rawIcs field', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('rawIcs');

  t.truthy(field);
});

test('CalendarInvites has sequence field', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('sequence');

  t.truthy(field);
  t.is(field.defaultValue, 0);
});

test('CalendarInvites has timestamps enabled', (t) => {
  const { schema } = CalendarInvites;

  // Check that timestamps option is enabled
  t.truthy(schema.options.timestamps);
});

test('CalendarInvites eventUid is required', (t) => {
  const { schema } = CalendarInvites;
  const eventUidField = schema.path('eventUid');

  t.true(eventUidField.isRequired);
});

test('CalendarInvites organizerEmail is required', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('organizerEmail');

  t.true(field.isRequired);
});

test('CalendarInvites attendeeEmail is required', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('attendeeEmail');

  t.true(field.isRequired);
});

test('CalendarInvites response is required', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('response');

  t.true(field.isRequired);
});

test('CalendarInvites tokenExpiresAt is optional (for iMIP sources)', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('tokenExpiresAt');

  // tokenExpiresAt is optional because iMIP responses don't have tokens
  // (authentication is done via DKIM/DMARC at the MX level)
  t.false(field.isRequired);
});

test('CalendarInvites processed defaults to false', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('processed');

  t.is(field.defaultValue, false);
});

test('CalendarInvites processAttempts defaults to 0', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('processAttempts');

  t.is(field.defaultValue, 0);
});

test('CalendarInvites comment has maxlength of 1000', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('comment');

  // Find the maxlength validator
  const maxlengthValidator = field.validators.find(
    (v) => v.type === 'maxlength'
  );
  t.truthy(maxlengthValidator);
  t.is(maxlengthValidator.maxlength, 1000);
});

test('CalendarInvites source defaults to web', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('source');

  t.is(field.defaultValue, 'web');
});

test('CalendarInvites source enum is correct', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('source');

  t.deepEqual(field.enumValues, ['web', 'imip']);
});

test('CalendarInvites sourceMessageId field exists', (t) => {
  const { schema } = CalendarInvites;
  const field = schema.path('sourceMessageId');

  t.truthy(field);
});

test('CalendarInvites has indexes on key fields', (t) => {
  const { schema } = CalendarInvites;

  // Check that indexes are defined
  const indexes = schema.indexes();
  t.true(indexes.length > 0);

  // Check for specific indexes
  const indexFields = indexes.map((idx) => Object.keys(idx[0]));

  // Should have index on eventUid
  t.true(indexFields.some((fields) => fields.includes('eventUid')));

  // Should have index on organizerEmail
  t.true(indexFields.some((fields) => fields.includes('organizerEmail')));

  // Should have index on processed
  t.true(indexFields.some((fields) => fields.includes('processed')));
});
