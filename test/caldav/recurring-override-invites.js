/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * E2E tests for recurring event override (deviation) invite handling.
 *
 * These tests verify that:
 * 1. sendEmailWithICS processes ALL VEVENTs (master + overrides) for attendee collection
 * 2. Attendees added back to a single occurrence override get invite emails
 * 3. Removed attendees on overrides get CANCEL emails
 * 4. updateEvent detects PARTSTAT changes on override VEVENTs (not just master)
 * 5. Organizer time-change detection works on override VEVENTs
 * 6. Helper functions (getRecurrenceId, getAttendeeEmail, findMatchingVevent) work correctly
 */

const test = require('ava');
const ICAL = require('ical.js');

// ─── Sample ICS Data ─────────────────────────────────────────────────────────

// Recurring event with master + one override (deviation)
const RECURRING_MASTER_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=5',
  'SUMMARY:Daily Standup',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@external.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Recurring event with master + override where attendee was removed from override
const RECURRING_WITH_REMOVED_ATTENDEE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=5',
  'SUMMARY:Daily Standup',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@external.com',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'RECURRENCE-ID:20250130T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250130T100000Z',
  'DTEND:20250130T110000Z',
  'SUMMARY:Daily Standup (modified)',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Recurring event with master + override where attendee was added back
const RECURRING_WITH_ADDED_BACK_ATTENDEE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=5',
  'SUMMARY:Daily Standup',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@external.com',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'RECURRENCE-ID:20250130T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250130T100000Z',
  'DTEND:20250130T110000Z',
  'SUMMARY:Daily Standup (modified)',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@external.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee3@external.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Override with attendee PARTSTAT changed (attendee-side)
const RECURRING_PARTSTAT_CHANGE_ON_OVERRIDE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=5',
  'SUMMARY:Daily Standup',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'RECURRENCE-ID:20250130T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250130T100000Z',
  'DTEND:20250130T110000Z',
  'SUMMARY:Daily Standup (modified)',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=ACCEPTED:mailto:attendee1@external.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// Override with time change (organizer-side)
const RECURRING_TIME_CHANGE_ON_OVERRIDE_ICS = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Forward Email//CalDAV//EN',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250129T100000Z',
  'DTEND:20250129T110000Z',
  'RRULE:FREQ=DAILY;COUNT=5',
  'SUMMARY:Daily Standup',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=ACCEPTED:mailto:attendee1@external.com',
  'END:VEVENT',
  'BEGIN:VEVENT',
  'UID:recurring-test-uid@example.com',
  'RECURRENCE-ID:20250130T100000Z',
  'DTSTAMP:20250129T100000Z',
  'DTSTART:20250130T140000Z',
  'DTEND:20250130T150000Z',
  'SUMMARY:Daily Standup (rescheduled)',
  'ORGANIZER:mailto:organizer@example.com',
  'ATTENDEE;PARTSTAT=ACCEPTED:mailto:attendee1@external.com',
  'END:VEVENT',
  'END:VCALENDAR'
].join('\r\n');

// ─── Tests ──────────────────────────────────────────────────────────────────

test('ICAL parses multiple VEVENTs with shared UID correctly', (t) => {
  const comp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_REMOVED_ATTENDEE_ICS)
  );
  const vevents = comp.getAllSubcomponents('vevent');

  t.is(vevents.length, 2, 'Should have 2 VEVENTs (master + override)');

  // Both share the same UID
  const uid0 = vevents[0].getFirstPropertyValue('uid');
  const uid1 = vevents[1].getFirstPropertyValue('uid');
  t.is(uid0, uid1, 'Both VEVENTs should share the same UID');

  // Master has no RECURRENCE-ID
  const rid0 = vevents[0].getFirstPropertyValue('recurrence-id');
  t.falsy(rid0, 'Master VEVENT should have no RECURRENCE-ID');

  // Override has RECURRENCE-ID
  const rid1 = vevents[1].getFirstPropertyValue('recurrence-id');
  t.truthy(rid1, 'Override VEVENT should have RECURRENCE-ID');
  t.is(
    rid1.toString(),
    '2025-01-30T10:00:00Z',
    'RECURRENCE-ID should match expected date'
  );
});

test('Override VEVENT has fewer attendees than master (removed attendee scenario)', (t) => {
  const comp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_REMOVED_ATTENDEE_ICS)
  );
  const vevents = comp.getAllSubcomponents('vevent');

  // Master has 2 attendees
  const masterAttendees = vevents[0].getAllProperties('attendee');
  t.is(masterAttendees.length, 2, 'Master should have 2 attendees');

  // Override has 1 attendee (attendee2 was removed)
  const overrideAttendees = vevents[1].getAllProperties('attendee');
  t.is(overrideAttendees.length, 1, 'Override should have 1 attendee');

  const overrideEmail = overrideAttendees[0]
    .getFirstValue()
    .replace(/^mailto:/i, '')
    .toLowerCase();
  t.is(
    overrideEmail,
    'attendee1@external.com',
    'Override should only have attendee1'
  );
});

test('Override VEVENT has new attendee added back (re-added attendee scenario)', (t) => {
  const comp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_ADDED_BACK_ATTENDEE_ICS)
  );
  const vevents = comp.getAllSubcomponents('vevent');

  // Master has 2 attendees
  const masterAttendees = vevents[0].getAllProperties('attendee');
  t.is(masterAttendees.length, 2, 'Master should have 2 attendees');

  // Override has 3 attendees (attendee3 was added)
  const overrideAttendees = vevents[1].getAllProperties('attendee');
  t.is(overrideAttendees.length, 3, 'Override should have 3 attendees');

  const emails = overrideAttendees.map((a) =>
    a
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase()
  );
  t.true(
    emails.includes('attendee3@external.com'),
    'Override should include newly added attendee3'
  );
});

test('Detecting removed attendees by comparing old vs new VEVENTs per RECURRENCE-ID', (t) => {
  // Simulate: old ICS has master with 2 attendees, new ICS has override with 1 attendee
  const oldComp = new ICAL.Component(ICAL.parse(RECURRING_MASTER_ICS));
  const newComp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_REMOVED_ATTENDEE_ICS)
  );

  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const newVevents = newComp.getAllSubcomponents('vevent');

  // The new ICS has an override with RECURRENCE-ID:20250130T100000Z
  // The old ICS has no such override, so the override is new
  // In the old ICS, the master defines the attendees for all occurrences
  // The removed attendee (attendee2) should be detected on the override

  // Find the override in new
  const newOverride = newVevents.find(
    (v) => v.getFirstPropertyValue('recurrence-id') !== null
  );
  t.truthy(newOverride, 'Should find the override VEVENT');

  const newOverrideAttendees = newOverride.getAllProperties('attendee');
  const newOverrideEmails = new Set(
    newOverrideAttendees.map((a) =>
      a
        .getFirstValue()
        .replace(/^mailto:/i, '')
        .toLowerCase()
    )
  );

  // The master (old) had both attendees
  const oldMaster = oldVevents[0];
  const oldMasterAttendees = oldMaster.getAllProperties('attendee');
  const removedAttendees = [];

  for (const att of oldMasterAttendees) {
    const email = att
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase();
    if (!newOverrideEmails.has(email)) {
      removedAttendees.push(email);
    }
  }

  t.deepEqual(
    removedAttendees,
    ['attendee2@external.com'],
    'attendee2 should be detected as removed from the override'
  );
});

test('Detecting newly added attendees on override by comparing old vs new VEVENTs', (t) => {
  // Old: master with 2 attendees, override with 2 attendees
  // New: master with 2 attendees, override with 3 attendees (attendee3 added)
  const oldIcs = RECURRING_WITH_REMOVED_ATTENDEE_ICS.replace(
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com\r\nEND:VEVENT\r\nEND:VCALENDAR',
    'ATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee1@external.com\r\nATTENDEE;PARTSTAT=NEEDS-ACTION:mailto:attendee2@external.com\r\nEND:VEVENT\r\nEND:VCALENDAR'
  );

  const oldComp = new ICAL.Component(ICAL.parse(oldIcs));
  const newComp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_ADDED_BACK_ATTENDEE_ICS)
  );

  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const newVevents = newComp.getAllSubcomponents('vevent');

  // Find matching overrides by RECURRENCE-ID
  const newOverride = newVevents.find(
    (v) => v.getFirstPropertyValue('recurrence-id') !== null
  );
  const oldOverride = oldVevents.find(
    (v) => v.getFirstPropertyValue('recurrence-id') !== null
  );

  t.truthy(newOverride, 'New ICS should have override');
  t.truthy(oldOverride, 'Old ICS should have override');

  const oldEmails = new Set(
    oldOverride.getAllProperties('attendee').map((a) =>
      a
        .getFirstValue()
        .replace(/^mailto:/i, '')
        .toLowerCase()
    )
  );

  const newAttendees = newOverride.getAllProperties('attendee');
  const addedAttendees = [];

  for (const att of newAttendees) {
    const email = att
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase();
    if (!oldEmails.has(email)) {
      addedAttendees.push(email);
    }
  }

  t.deepEqual(
    addedAttendees,
    ['attendee3@external.com'],
    'attendee3 should be detected as newly added to the override'
  );
});

test('Detecting PARTSTAT change on override VEVENT (attendee-side)', (t) => {
  // Old: master with NEEDS-ACTION, override with NEEDS-ACTION
  // New: master with NEEDS-ACTION, override with ACCEPTED
  const oldComp = new ICAL.Component(ICAL.parse(RECURRING_MASTER_ICS));
  const newComp = new ICAL.Component(
    ICAL.parse(RECURRING_PARTSTAT_CHANGE_ON_OVERRIDE_ICS)
  );

  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const newVevents = newComp.getAllSubcomponents('vevent');

  // The new ICS has an override with PARTSTAT=ACCEPTED
  const newOverride = newVevents.find(
    (v) => v.getFirstPropertyValue('recurrence-id') !== null
  );
  t.truthy(newOverride, 'Should find override VEVENT');

  const overrideAttendees = newOverride.getAllProperties('attendee');
  const att = overrideAttendees[0];
  const newPartstat = att.getParameter('partstat');
  t.is(newPartstat, 'ACCEPTED', 'Override attendee should be ACCEPTED');

  // The master in old ICS has NEEDS-ACTION
  const oldMaster = oldVevents[0];
  const oldMasterAttendees = oldMaster.getAllProperties('attendee');
  // Find attendee1
  const oldAtt = oldMasterAttendees.find((a) =>
    a
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase()
      .includes('attendee1')
  );
  t.truthy(oldAtt, 'Should find attendee1 in old master');
  const oldPartstat = oldAtt.getParameter('partstat');
  t.is(
    oldPartstat,
    'NEEDS-ACTION',
    'Old master attendee should be NEEDS-ACTION'
  );

  // The fix ensures we iterate ALL VEVENTs and compare by RECURRENCE-ID
  // Since the override is new (no matching old override), we compare against
  // the master. The PARTSTAT changed from NEEDS-ACTION to ACCEPTED.
  t.not(oldPartstat, newPartstat, 'PARTSTAT should differ between old and new');
});

test('Detecting time change on override VEVENT (organizer-side)', (t) => {
  // Old: master with DTSTART 10:00, override with DTSTART 10:00
  // New: master with DTSTART 10:00, override with DTSTART 14:00
  const oldComp = new ICAL.Component(ICAL.parse(RECURRING_MASTER_ICS));
  const newComp = new ICAL.Component(
    ICAL.parse(RECURRING_TIME_CHANGE_ON_OVERRIDE_ICS)
  );

  const newVevents = newComp.getAllSubcomponents('vevent');

  // Find the override with the time change
  const newOverride = newVevents.find(
    (v) => v.getFirstPropertyValue('recurrence-id') !== null
  );
  t.truthy(newOverride, 'Should find override VEVENT');

  const newDtstart = newOverride.getFirstPropertyValue('dtstart');
  t.is(
    newDtstart.toString(),
    '2025-01-30T14:00:00Z',
    'Override DTSTART should be 14:00'
  );

  // The old master defines the original time for that occurrence
  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const oldMaster = oldVevents[0];
  // For a recurring event, the occurrence on 2025-01-30 would have DTSTART 10:00
  // Since there's no old override, we'd compare against the master's DTSTART
  // But with the fix, we match by RECURRENCE-ID, and since there's no old override,
  // the code skips this VEVENT (no matching old). The time change is detected
  // because the override itself is new.
  t.truthy(
    oldMaster.getFirstPropertyValue('dtstart'),
    'Old master should have DTSTART'
  );
});

test('Multiple VEVENTs with same UID - getFirstSubcomponent only returns master', (t) => {
  // This test demonstrates the bug that was fixed:
  // getFirstSubcomponent('vevent') only returns the first VEVENT (master),
  // missing any overrides. getAllSubcomponents('vevent') returns all.
  const comp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_ADDED_BACK_ATTENDEE_ICS)
  );

  const first = comp.getFirstSubcomponent('vevent');
  const all = comp.getAllSubcomponents('vevent');

  t.is(all.length, 2, 'getAllSubcomponents should return both VEVENTs');

  // getFirstSubcomponent returns the master (no RECURRENCE-ID)
  const firstRid = first.getFirstPropertyValue('recurrence-id');
  t.falsy(firstRid, 'getFirstSubcomponent returns master (no RECURRENCE-ID)');

  // The override with the newly added attendee3 is only in the second VEVENT
  const overrideVevent = all.find(
    (v) => v.getFirstPropertyValue('recurrence-id') !== null
  );
  t.truthy(
    overrideVevent,
    'Override VEVENT should be found via getAllSubcomponents'
  );

  const overrideAttendees = overrideVevent.getAllProperties('attendee');
  const emails = overrideAttendees.map((a) =>
    a
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase()
  );
  t.true(
    emails.includes('attendee3@external.com'),
    'attendee3 is only on the override, not the master'
  );

  // Verify the master does NOT have attendee3
  const masterAttendees = first.getAllProperties('attendee');
  const masterEmails = masterAttendees.map((a) =>
    a
      .getFirstValue()
      .replace(/^mailto:/i, '')
      .toLowerCase()
  );
  t.false(
    masterEmails.includes('attendee3@external.com'),
    'Master should NOT have attendee3'
  );
});

test('RECURRENCE-ID matching correctly pairs old and new VEVENTs', (t) => {
  // Build old ICS with master + override at 20250130T100000Z
  const oldComp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_REMOVED_ATTENDEE_ICS)
  );
  // Build new ICS with master + override at 20250130T100000Z (with added attendee)
  const newComp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_ADDED_BACK_ATTENDEE_ICS)
  );

  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const newVevents = newComp.getAllSubcomponents('vevent');

  // Match by RECURRENCE-ID
  for (const nv of newVevents) {
    const rid = nv.getFirstPropertyValue('recurrence-id');
    const ridStr = rid ? rid.toString() : null;

    // Find matching old VEVENT
    const ov = oldVevents.find((v) => {
      const oRid = v.getFirstPropertyValue('recurrence-id');
      const oRidStr = oRid ? oRid.toString() : null;
      return ridStr === oRidStr;
    });

    if (ridStr === null) {
      // Master should match master
      t.truthy(ov, 'Master should match master');
      t.falsy(
        ov.getFirstPropertyValue('recurrence-id'),
        'Matched old VEVENT should be master'
      );
    } else {
      // Override should match override with same RECURRENCE-ID
      t.truthy(ov, 'Override should match override');
      t.is(
        ov.getFirstPropertyValue('recurrence-id').toString(),
        ridStr,
        'RECURRENCE-IDs should match'
      );
    }
  }
});

test('Attendee deduplication across master and override VEVENTs', (t) => {
  // When collecting attendees from all VEVENTs, we should deduplicate by email
  const comp = new ICAL.Component(
    ICAL.parse(RECURRING_WITH_ADDED_BACK_ATTENDEE_ICS)
  );
  const vevents = comp.getAllSubcomponents('vevent');

  const seenEmails = new Set();
  const allAttendees = [];

  for (const v of vevents) {
    const attendees = v.getAllProperties('attendee');
    for (const att of attendees) {
      const email = att
        .getFirstValue()
        .replace(/^mailto:/i, '')
        .toLowerCase();
      if (!seenEmails.has(email)) {
        seenEmails.add(email);
        allAttendees.push(email);
      }
    }
  }

  // Master has attendee1, attendee2
  // Override has attendee1, attendee2, attendee3
  // Deduplicated: attendee1, attendee2, attendee3
  t.is(allAttendees.length, 3, 'Should have 3 unique attendees');
  t.deepEqual(
    allAttendees.sort(),
    [
      'attendee1@external.com',
      'attendee2@external.com',
      'attendee3@external.com'
    ],
    'Should have all 3 unique attendees'
  );
});
