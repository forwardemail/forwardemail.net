/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Process Calendar Invites Helper
 *
 * This helper processes pending calendar invite responses from the MongoDB
 * CalendarInvites queue. It is called during CalDAV authentication (after
 * the session is established) to merge invite responses into the user's
 * SQLite calendar database.
 *
 * Architecture:
 * 1. Web routes write invite responses to MongoDB (CalendarInvites model)
 * 2. When organizer authenticates to CalDAV, this helper is called
 * 3. Helper finds pending invites for the organizer's email
 * 4. For each invite, updates the attendee's PARTSTAT in the SQLite event
 * 5. Marks the invite as processed (or records error)
 * 6. Optionally sends iTIP REPLY email back to attendee
 *
 * This ensures:
 * - Web routes never access SQLite directly
 * - All SQLite operations happen in authenticated CalDAV context
 * - Proper session/instance pattern is followed
 */

const ICAL = require('ical.js');
const isEmail = require('#helpers/is-email');

const CalendarInvites = require('#models/calendar-invites');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');

// Maximum invites to process per CalDAV interaction
const MAX_INVITES_PER_BATCH = 10;

// Maximum processing attempts before giving up
const MAX_PROCESS_ATTEMPTS = 3;

/**
 * Get UID variants for flexible matching.
 * Handles .ics suffix and case variations.
 *
 * @param {string} uid - The UID to get variants for
 * @returns {string[]} Array of UID variants to try
 */
function getUidVariants(uid) {
  if (typeof uid !== 'string') return [uid];
  const variants = new Set();

  // Add original
  variants.add(uid);

  // Add lowercase version
  variants.add(uid.toLowerCase());

  // Handle .ics suffix
  if (uid.endsWith('.ics')) {
    const withoutIcs = uid.slice(0, -4);
    variants.add(withoutIcs);
    variants.add(withoutIcs.toLowerCase());
  } else {
    variants.add(`${uid}.ics`);
    variants.add(`${uid}.ics`.toLowerCase());
  }

  return [...variants];
}

/**
 * Process pending calendar invite responses for the authenticated user
 *
 * @param {Object} instance - The CalDAV server instance (this)
 * @param {Object} ctx - Koa context with session and user
 * @returns {Promise<Object>} Processing results { processed, failed, skipped }
 */
async function processCalendarInvites(instance, ctx) {
  const results = {
    processed: 0,
    failed: 0,
    skipped: 0
  };

  // Get the user's email addresses (could be alias or domain-based)
  const userEmails = getUserEmails(ctx);
  if (userEmails.length === 0) {
    ctx.logger.debug('No user emails found for calendar invite processing');
    return results;
  }

  ctx.logger.debug('Processing calendar invites for emails', { userEmails });

  // Find pending invites where this user is the organizer
  const pendingInvites = await CalendarInvites.find({
    organizerEmail: { $in: userEmails },
    processed: false,
    processAttempts: { $lt: MAX_PROCESS_ATTEMPTS }
  })
    .sort({ createdAt: 1 }) // Process oldest first
    .limit(MAX_INVITES_PER_BATCH)
    .lean()
    .exec();

  if (pendingInvites.length === 0) {
    ctx.logger.debug('No pending calendar invites to process');
    return results;
  }

  ctx.logger.info(
    `Processing ${pendingInvites.length} pending calendar invites`
  );

  // Process each invite
  for (const invite of pendingInvites) {
    try {
      await processInvite(instance, ctx, invite);
      results.processed++;
    } catch (err) {
      ctx.logger.error(err, 'Failed to process calendar invite', {
        inviteId: invite._id,
        eventUid: invite.eventUid
      });
      results.failed++;

      // Update invite with error
      await CalendarInvites.updateOne(
        { _id: invite._id },
        {
          $inc: { processAttempts: 1 },
          $set: { processError: err.message }
        }
      );
    }
  }

  return results;
}

/**
 * Get all email addresses associated with the authenticated user
 */
function getUserEmails(ctx) {
  const emails = [];

  // Primary username (usually alias@domain)
  if (ctx.state.user?.username) {
    emails.push(ctx.state.user.username.toLowerCase());
  }

  // Alias name with domain
  if (ctx.state.user?.alias_name && ctx.state.user?.domain_name) {
    emails.push(
      `${ctx.state.user.alias_name}@${ctx.state.user.domain_name}`.toLowerCase()
    );
  }

  return [...new Set(emails)]; // Remove duplicates
}

/**
 * Process a single invite response
 */
async function processInvite(instance, ctx, invite) {
  ctx.logger.debug('Processing invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail,
    response: invite.response
  });

  // Find the calendar event by UID
  // We need to search across all calendars for this user
  const calendars = await Calendars.find(instance, ctx.state.session, {});

  let calendarEvent = null;
  const uidVariants = getUidVariants(invite.eventUid);

  ctx.logger.debug('Searching for event with UID variants', { uidVariants });

  for (const cal of calendars) {
    // Search for event with matching UID in the iCal data
    const events = await CalendarEvents.find(instance, ctx.state.session, {
      calendar: cal._id,
      deleted_at: null
    });

    for (const event of events) {
      if (event.ical && eventHasUid(event.ical, uidVariants)) {
        calendarEvent = event;
        ctx.logger.debug('Found matching event', {
          eventId: event.eventId,
          calendarId: cal._id
        });
        break;
      }
    }

    if (calendarEvent) break;
  }

  if (!calendarEvent) {
    // Event not found - maybe deleted or UID mismatch
    // Mark as processed to avoid retrying
    await CalendarInvites.updateOne(
      { _id: invite._id },
      {
        $set: {
          processed: true,
          processedAt: new Date(),
          processError: 'Event not found'
        }
      }
    );
    ctx.logger.warn('Calendar event not found for invite', {
      inviteId: invite._id,
      eventUid: invite.eventUid,
      uidVariants
    });
    return;
  }

  // Update the attendee's PARTSTAT in the iCal data
  const updatedIcal = updateAttendeePartstat(
    calendarEvent.ical,
    invite.attendeeEmail,
    invite.response
  );

  if (!updatedIcal) {
    // Attendee not found in event
    await CalendarInvites.updateOne(
      { _id: invite._id },
      {
        $set: {
          processed: true,
          processedAt: new Date(),
          processError: 'Attendee not found in event'
        }
      }
    );
    ctx.logger.warn('Attendee not found in calendar event', {
      inviteId: invite._id,
      eventUid: invite.eventUid,
      attendeeEmail: invite.attendeeEmail
    });
    return;
  }

  // Update the calendar event in SQLite
  await CalendarEvents.findOneAndUpdate(
    instance,
    ctx.state.session,
    { _id: calendarEvent._id },
    { $set: { ical: updatedIcal } }
  );

  // Mark invite as processed
  await CalendarInvites.updateOne(
    { _id: invite._id },
    {
      $set: {
        processed: true,
        processedAt: new Date()
      }
    }
  );

  ctx.logger.info('Calendar invite processed successfully', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail,
    response: invite.response
  });

  // TODO: Optionally send iTIP REPLY email to attendee
  // This would use the existing sendEmailWithICS infrastructure
}

/**
 * Check if an iCal string contains an event with any of the given UID variants
 *
 * @param {string} icalStr - The iCal string to check
 * @param {string[]} uidVariants - Array of UID variants to match against
 * @returns {boolean} True if any variant matches
 */
function eventHasUid(icalStr, uidVariants) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return false;

    const eventUid = vevent.getFirstPropertyValue('uid');
    if (!eventUid) return false;

    // Check against all variants (handles case sensitivity and .ics suffix)
    for (const variant of uidVariants) {
      if (eventUid === variant) return true;
      // Also check case-insensitive
      if (eventUid.toLowerCase() === variant.toLowerCase()) return true;
    }

    // Handle email UIDs with @ to _ conversion (Google Calendar does this)
    if (isEmail(eventUid)) {
      const emailAsUnderscore = eventUid.replace('@', '_');
      for (const variant of uidVariants) {
        if (emailAsUnderscore === variant) return true;
        if (emailAsUnderscore.toLowerCase() === variant.toLowerCase())
          return true;
      }
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Update an attendee's PARTSTAT in the iCal data
 *
 * @param {string} icalStr - The iCal string
 * @param {string} attendeeEmail - The attendee's email
 * @param {string} partstat - The new PARTSTAT value (ACCEPTED, DECLINED, TENTATIVE)
 * @returns {string|null} Updated iCal string, or null if attendee not found
 */
function updateAttendeePartstat(icalStr, attendeeEmail, partstat) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return null;

    // Find the attendee property
    const attendees = vevent.getAllProperties('attendee');
    let found = false;

    for (const attendee of attendees) {
      const value = attendee.getFirstValue();
      // Value is typically "mailto:email@example.com"
      const email = value?.replace(/^mailto:/i, '').toLowerCase();

      if (email === attendeeEmail.toLowerCase()) {
        // Update PARTSTAT parameter
        attendee.setParameter('partstat', partstat);
        found = true;
        break;
      }
    }

    if (!found) return null;

    // Update DTSTAMP to indicate modification
    const dtstamp = vevent.getFirstProperty('dtstamp');
    if (dtstamp) {
      dtstamp.setValue(ICAL.Time.now());
    }

    return comp.toString();
  } catch {
    // Return null for invalid iCal data
    return null;
  }
}

module.exports = {
  processCalendarInvites,
  updateAttendeePartstat,
  eventHasUid,
  getUidVariants,
  MAX_INVITES_PER_BATCH,
  MAX_PROCESS_ATTEMPTS
};
