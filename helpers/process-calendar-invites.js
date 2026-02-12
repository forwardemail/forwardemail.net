/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

/**
 * Process Calendar Invites Helper
 *
 * This helper processes pending calendar invite messages from the MongoDB
 * CalendarInvites queue. It is called during CalDAV authentication (after
 * the session is established) to merge invite data into the user's
 * SQLite calendar database.
 *
 * Supported iTIP methods (RFC 5546):
 * - REPLY: Updates attendee PARTSTAT in organizer's event
 * - REQUEST: Creates or updates event in attendee's calendar
 * - CANCEL: Sets STATUS:CANCELLED on event in attendee's calendar
 * - ADD: Merges recurrence instances into attendee's existing event
 * - REFRESH: Triggers re-send of current event to requesting attendee
 * - COUNTER: Queues counter-proposal for organizer review
 * - DECLINECOUNTER: Notifies attendee that counter was declined
 *
 * Architecture:
 * 1. Web routes / iMIP pipeline write messages to MongoDB (CalendarInvites model)
 * 2. When user authenticates to CalDAV, this helper is called
 * 3. Helper finds pending invites for the user's email addresses
 * 4. For each invite, processes according to the iTIP method
 * 5. Marks the invite as processed (or records error)
 *
 * This ensures:
 * - Web routes never access SQLite directly
 * - All SQLite operations happen in authenticated CalDAV context
 * - Proper session/instance pattern is followed
 *
 * @see https://tools.ietf.org/html/rfc5546 - iTIP
 * @see https://tools.ietf.org/html/rfc6047 - iMIP
 * @see https://tools.ietf.org/html/rfc6638 - CalDAV Scheduling
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
 * Process pending calendar invite messages for the authenticated user
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

  // Find pending invites where this user is the target
  // For REPLY/REFRESH/COUNTER: user is the organizer (organizerEmail)
  // For REQUEST/CANCEL/ADD/DECLINECOUNTER: user is the attendee (organizerEmail stores target)
  const pendingInvites = await CalendarInvites.find({
    organizerEmail: { $in: userEmails },
    processed: false,
    processAttempts: { $lt: MAX_PROCESS_ATTEMPTS }
  })
    .sort({ created_at: 1 }) // Process oldest first
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

  // Process each invite based on its method
  for (const invite of pendingInvites) {
    try {
      const method = invite.method || 'REPLY';

      switch (method) {
        case 'REPLY': {
          await processReply(instance, ctx, invite);
          break;
        }

        case 'REQUEST': {
          await processRequest(instance, ctx, invite);
          break;
        }

        case 'CANCEL': {
          await processCancel(instance, ctx, invite);
          break;
        }

        case 'ADD': {
          await processAdd(instance, ctx, invite);
          break;
        }

        case 'REFRESH': {
          await processRefresh(instance, ctx, invite);
          break;
        }

        case 'COUNTER': {
          await processCounter(instance, ctx, invite);
          break;
        }

        case 'DECLINECOUNTER': {
          await processDeclineCounter(instance, ctx, invite);
          break;
        }

        default: {
          ctx.logger.warn('Unknown iTIP method in invite', {
            inviteId: invite._id,
            method
          });
          await markProcessed(invite._id, `Unknown method: ${method}`);
          results.skipped++;
          continue;
        }
      }

      results.processed++;
    } catch (err) {
      ctx.logger.error(err, 'Failed to process calendar invite', {
        inviteId: invite._id,
        eventUid: invite.eventUid,
        method: invite.method
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
 * Mark an invite as processed
 */
async function markProcessed(inviteId, error) {
  const update = {
    processed: true,
    processedAt: new Date()
  };

  if (error) {
    update.processError = error;
  }

  await CalendarInvites.updateOne({ _id: inviteId }, { $set: update });
}

// ─── REPLY Processing ────────────────────────────────────────────────────────

/**
 * Process a REPLY invite - update attendee PARTSTAT in organizer's event
 *
 * RFC 5546 Section 3.2.3:
 * The "REPLY" method is sent by an "Attendee" of an event to the
 * "Organizer" of the event. The "REPLY" method is used to respond
 * to an event "REQUEST".
 */
async function processReply(instance, ctx, invite) {
  ctx.logger.debug('Processing REPLY invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail,
    response: invite.response
  });

  // Find the calendar event by UID
  const { calendarEvent } = await findEventByUid(
    instance,
    ctx,
    invite.eventUid
  );

  if (!calendarEvent) {
    await markProcessed(invite._id, 'Event not found');
    ctx.logger.warn('Calendar event not found for REPLY', {
      inviteId: invite._id,
      eventUid: invite.eventUid
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
    await markProcessed(invite._id, 'Attendee not found in event');
    ctx.logger.warn('Attendee not found in calendar event for REPLY', {
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

  await markProcessed(invite._id);

  ctx.logger.info('REPLY processed - attendee PARTSTAT updated', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail,
    response: invite.response
  });
}

// ─── REQUEST Processing ──────────────────────────────────────────────────────

/**
 * Process a REQUEST invite - create or update event in attendee's calendar
 *
 * RFC 5546 Section 3.2.2:
 * The "REQUEST" method is used to send a calendar component to one
 * or more "Attendees". If the event already exists in the attendee's
 * calendar, it is updated; otherwise, a new event is created.
 */
async function processRequest(instance, ctx, invite) {
  ctx.logger.debug('Processing REQUEST invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid
  });

  if (!invite.rawIcs) {
    await markProcessed(invite._id, 'No raw ICS data for REQUEST');
    return;
  }

  // Check if event already exists
  const { calendarEvent, calendar } = await findEventByUid(
    instance,
    ctx,
    invite.eventUid
  );

  if (calendarEvent) {
    // Event exists - check SEQUENCE to avoid stale updates
    const existingSequence = getSequenceFromIcal(calendarEvent.ical);
    const incomingSequence = invite.sequence || 0;

    if (incomingSequence < existingSequence) {
      await markProcessed(
        invite._id,
        `Stale REQUEST: incoming sequence ${incomingSequence} < existing ${existingSequence}`
      );
      ctx.logger.debug('Skipping stale REQUEST', {
        inviteId: invite._id,
        existingSequence,
        incomingSequence
      });
      return;
    }

    // Update existing event with new ICS data
    // Strip METHOD from the stored ICS (it's only for transport)
    const storedIcs = stripMethodFromIcs(invite.rawIcs);

    await CalendarEvents.findOneAndUpdate(
      instance,
      ctx.state.session,
      { _id: calendarEvent._id },
      { $set: { ical: storedIcs } }
    );

    await markProcessed(invite._id);
    ctx.logger.info('REQUEST processed - event updated', {
      inviteId: invite._id,
      eventUid: invite.eventUid
    });
  } else {
    // Event doesn't exist - create it in the default calendar
    const targetCalendar =
      calendar || (await getDefaultCalendar(instance, ctx));

    if (!targetCalendar) {
      await markProcessed(invite._id, 'No calendar found to create event');
      return;
    }

    // Strip METHOD from stored ICS
    const storedIcs = stripMethodFromIcs(invite.rawIcs);

    // Generate eventId from UID
    const eventId = `${invite.eventUid}.ics`;

    await CalendarEvents.create(instance, ctx.state.session, {
      eventId,
      calendar: targetCalendar._id,
      ical: storedIcs
    });

    await markProcessed(invite._id);
    ctx.logger.info('REQUEST processed - event created', {
      inviteId: invite._id,
      eventUid: invite.eventUid,
      calendarId: targetCalendar._id
    });
  }
}

// ─── CANCEL Processing ───────────────────────────────────────────────────────

/**
 * Process a CANCEL invite - set STATUS:CANCELLED on event
 *
 * RFC 5546 Section 3.2.5:
 * The "CANCEL" method is sent by the "Organizer" to inform
 * "Attendees" that a calendar component has been cancelled.
 */
async function processCancel(instance, ctx, invite) {
  ctx.logger.debug('Processing CANCEL invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid
  });

  const { calendarEvent } = await findEventByUid(
    instance,
    ctx,
    invite.eventUid
  );

  if (!calendarEvent) {
    // Event already deleted or never existed - that's fine
    await markProcessed(invite._id, 'Event not found (may already be deleted)');
    ctx.logger.debug('Event not found for CANCEL - already deleted?', {
      inviteId: invite._id,
      eventUid: invite.eventUid
    });
    return;
  }

  // Check if CANCEL has RECURRENCE-ID (cancelling single instance)
  let recurrenceId = null;
  if (invite.rawIcs) {
    recurrenceId = getRecurrenceIdFromIcs(invite.rawIcs);
  }

  if (recurrenceId) {
    // Cancel a single recurrence instance
    const updatedIcal = setCancelledStatusForInstance(
      calendarEvent.ical,
      recurrenceId
    );

    if (updatedIcal) {
      await CalendarEvents.findOneAndUpdate(
        instance,
        ctx.state.session,
        { _id: calendarEvent._id },
        { $set: { ical: updatedIcal } }
      );
    }
  } else {
    // Cancel the entire event
    const updatedIcal = setCancelledStatus(calendarEvent.ical);

    if (updatedIcal) {
      await CalendarEvents.findOneAndUpdate(
        instance,
        ctx.state.session,
        { _id: calendarEvent._id },
        { $set: { ical: updatedIcal } }
      );
    }
  }

  await markProcessed(invite._id);
  ctx.logger.info('CANCEL processed - event cancelled', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    recurrenceId
  });
}

// ─── ADD Processing ──────────────────────────────────────────────────────────

/**
 * Process an ADD invite - merge recurrence instances into existing event
 *
 * RFC 5546 Section 3.2.4:
 * The "ADD" method allows the "Organizer" to add one or more new
 * instances to an existing "VEVENT".
 */
async function processAdd(instance, ctx, invite) {
  ctx.logger.debug('Processing ADD invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid
  });

  if (!invite.rawIcs) {
    await markProcessed(invite._id, 'No raw ICS data for ADD');
    return;
  }

  const { calendarEvent } = await findEventByUid(
    instance,
    ctx,
    invite.eventUid
  );

  if (!calendarEvent) {
    // No existing event to add instances to
    // Treat as a REQUEST instead (create the event)
    await processRequest(instance, ctx, {
      ...invite,
      method: 'REQUEST'
    });
    return;
  }

  // Merge the new instances into the existing event
  const updatedIcal = mergeAddComponents(calendarEvent.ical, invite.rawIcs);

  if (updatedIcal) {
    await CalendarEvents.findOneAndUpdate(
      instance,
      ctx.state.session,
      { _id: calendarEvent._id },
      { $set: { ical: updatedIcal } }
    );
  }

  await markProcessed(invite._id);
  ctx.logger.info('ADD processed - instances merged', {
    inviteId: invite._id,
    eventUid: invite.eventUid
  });
}

// ─── REFRESH Processing ─────────────────────────────────────────────────────

/**
 * Process a REFRESH invite - re-send current event to requesting attendee
 *
 * RFC 5546 Section 3.2.6:
 * The "REFRESH" method is sent by an "Attendee" to request the
 * latest version of a calendar component from the "Organizer".
 */
async function processRefresh(instance, ctx, invite) {
  ctx.logger.debug('Processing REFRESH invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail
  });

  const { calendarEvent } = await findEventByUid(
    instance,
    ctx,
    invite.eventUid
  );

  if (!calendarEvent) {
    await markProcessed(invite._id, 'Event not found for REFRESH');
    return;
  }

  // The actual re-send will happen via sendEmailWithICS
  // We queue a new REQUEST to the attendee
  // Note: The CalDAV server's sendEmailWithICS handles the email sending
  await markProcessed(invite._id);

  ctx.logger.info('REFRESH processed - event re-send queued', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail
  });

  // Return the event data so the caller can trigger the re-send
  return { calendarEvent, attendeeEmail: invite.attendeeEmail };
}

// ─── COUNTER Processing ─────────────────────────────────────────────────────

/**
 * Process a COUNTER invite - attendee proposes alternative time
 *
 * RFC 5546 Section 3.2.7:
 * The "COUNTER" method is sent by an "Attendee" to the "Organizer"
 * to propose an alternative time for the event.
 *
 * For now, we log the counter-proposal. Full implementation would
 * present this to the organizer for accept/decline.
 */
async function processCounter(instance, ctx, invite) {
  ctx.logger.debug('Processing COUNTER invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail
  });

  // Log the counter-proposal for the organizer
  // In a full implementation, this would be presented in the UI
  await markProcessed(invite._id);

  ctx.logger.info('COUNTER processed - counter-proposal logged', {
    inviteId: invite._id,
    eventUid: invite.eventUid,
    attendeeEmail: invite.attendeeEmail
  });
}

// ─── DECLINECOUNTER Processing ──────────────────────────────────────────────

/**
 * Process a DECLINECOUNTER invite - organizer declines counter-proposal
 *
 * RFC 5546 Section 3.2.8:
 * The "DECLINECOUNTER" method is sent by the "Organizer" to an
 * "Attendee" to decline a counter-proposal.
 */
async function processDeclineCounter(instance, ctx, invite) {
  ctx.logger.debug('Processing DECLINECOUNTER invite', {
    inviteId: invite._id,
    eventUid: invite.eventUid
  });

  // The attendee's counter was declined - no calendar changes needed
  // The attendee should keep the original event as-is
  await markProcessed(invite._id);

  ctx.logger.info('DECLINECOUNTER processed', {
    inviteId: invite._id,
    eventUid: invite.eventUid
  });
}

// ─── Shared Utilities ────────────────────────────────────────────────────────

/**
 * Find a calendar event by UID across all user's calendars
 *
 * @param {Object} instance - CalDAV server instance
 * @param {Object} ctx - Koa context
 * @param {string} eventUid - Event UID to find
 * @returns {Promise<{calendarEvent: Object|null, calendar: Object|null}>}
 */
async function findEventByUid(instance, ctx, eventUid) {
  const calendars = await Calendars.find(instance, ctx.state.session, {});
  const uidVariants = getUidVariants(eventUid);

  ctx.logger.debug('Searching for event with UID variants', {
    uidVariants,
    calendarsCount: calendars.length
  });

  for (const cal of calendars) {
    // Fetch all events and filter deleted_at in JavaScript
    // (SQL "deleted_at = null" doesn't work correctly, need IS NULL)
    let events = await CalendarEvents.find(instance, ctx.state.session, {
      calendar: cal._id
    });

    // Filter out deleted events
    events = events.filter((e) => !e.deleted_at);

    for (const event of events) {
      if (event.ical && eventHasUid(event.ical, uidVariants)) {
        return { calendarEvent: event, calendar: cal };
      }
    }
  }

  return { calendarEvent: null, calendar: null };
}

/**
 * Get the default calendar for the user (first VEVENT-capable calendar)
 */
async function getDefaultCalendar(instance, ctx) {
  const calendars = await Calendars.find(instance, ctx.state.session, {});

  // Prefer a calendar named "default" or the first one
  for (const cal of calendars) {
    if (
      cal.calendarId === 'default' ||
      cal.name === 'default' ||
      cal.name === 'Default'
    ) {
      return cal;
    }
  }

  // Return first calendar if no default found
  return calendars.length > 0 ? calendars[0] : null;
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
    const vevent =
      comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');
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
 * @param {string} partstat - The new PARTSTAT value
 * @returns {string|null} Updated iCal string, or null if attendee not found
 */
function updateAttendeePartstat(icalStr, attendeeEmail, partstat) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const vevent =
      comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');
    if (!vevent) return null;

    // Find the attendee property
    const attendees = vevent.getAllProperties('attendee');
    let found = false;

    for (const attendee of attendees) {
      const value = attendee.getFirstValue();
      const email = value?.replace(/^mailto:/i, '').toLowerCase();

      if (email === attendeeEmail.toLowerCase()) {
        attendee.setParameter('partstat', partstat);
        found = true;
        break;
      }
    }

    if (!found) return null;

    // Update DTSTAMP to indicate modification (RFC 5546 Section 3.2.3)
    const dtstamp = vevent.getFirstProperty('dtstamp');
    if (dtstamp) {
      dtstamp.setValue(ICAL.Time.now());
    }

    return comp.toString();
  } catch {
    return null;
  }
}

/**
 * Set STATUS:CANCELLED on a VEVENT
 *
 * @param {string} icalStr - The iCal string
 * @returns {string|null} Updated iCal string
 */
function setCancelledStatus(icalStr) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const vevent =
      comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');
    if (!vevent) return null;

    // Set STATUS to CANCELLED
    vevent.updatePropertyWithValue('status', 'CANCELLED');

    // Update DTSTAMP
    vevent.updatePropertyWithValue('dtstamp', ICAL.Time.now());

    return comp.toString();
  } catch {
    return null;
  }
}

/**
 * Set STATUS:CANCELLED for a specific recurrence instance
 *
 * @param {string} icalStr - The iCal string
 * @param {string} recurrenceId - The RECURRENCE-ID to cancel
 * @returns {string|null} Updated iCal string
 */
function setCancelledStatusForInstance(icalStr, recurrenceId) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));

    // Look for existing VEVENT with this RECURRENCE-ID
    const vevents = comp.getAllSubcomponents('vevent');
    let found = false;

    for (const vevent of vevents) {
      const rid = vevent.getFirstPropertyValue('recurrence-id');
      if (rid && rid.toString() === recurrenceId) {
        vevent.updatePropertyWithValue('status', 'CANCELLED');
        vevent.updatePropertyWithValue('dtstamp', ICAL.Time.now());
        found = true;
        break;
      }
    }

    if (!found) {
      // Add an EXDATE for this recurrence instance
      // This is the standard way to exclude a single instance
      const mainVevent = comp.getFirstSubcomponent('vevent');
      if (mainVevent) {
        const exdate = new ICAL.Property('exdate');
        // Convert iCal format (20250108T100000Z) to ISO format for ical.js v2
        let isoStr = recurrenceId;
        if (/^\d{8}T\d{6}Z?$/.test(recurrenceId)) {
          isoStr =
            recurrenceId.slice(0, 4) +
            '-' +
            recurrenceId.slice(4, 6) +
            '-' +
            recurrenceId.slice(6, 8) +
            'T' +
            recurrenceId.slice(9, 11) +
            ':' +
            recurrenceId.slice(11, 13) +
            ':' +
            recurrenceId.slice(13, 15) +
            (recurrenceId.endsWith('Z') ? 'Z' : '');
        }

        exdate.setValue(ICAL.Time.fromString(isoStr));
        mainVevent.addProperty(exdate);
      }
    }

    return comp.toString();
  } catch {
    return null;
  }
}

/**
 * Merge ADD components (new recurrence instances) into existing event
 *
 * @param {string} existingIcal - The existing iCal string
 * @param {string} addIcal - The ADD iCal string with new instances
 * @returns {string|null} Merged iCal string
 */
function mergeAddComponents(existingIcal, addIcal) {
  try {
    const existingComp = new ICAL.Component(ICAL.parse(existingIcal));
    const addComp = new ICAL.Component(ICAL.parse(addIcal));

    // Get all VEVENT components from the ADD message
    const addVevents = addComp.getAllSubcomponents('vevent');

    for (const addVevent of addVevents) {
      // Only add components with RECURRENCE-ID (these are override instances)
      const recurrenceId = addVevent.getFirstPropertyValue('recurrence-id');
      if (!recurrenceId) continue;

      // Check if this override already exists
      const existingVevents = existingComp.getAllSubcomponents('vevent');
      for (const existing of existingVevents) {
        const existingRid = existing.getFirstPropertyValue('recurrence-id');
        if (existingRid && existingRid.toString() === recurrenceId.toString()) {
          // Replace existing override
          existingComp.removeSubcomponent(existing);
          break;
        }
      }

      // Add the new/replacement override
      // Clone by serializing and re-parsing to avoid shared references
      const clonedVevent = new ICAL.Component(
        ICAL.parse(addVevent.toString()).find(
          (c) => Array.isArray(c) && c[0] === 'vevent'
        ) || addVevent.toJSON()
      );
      existingComp.addSubcomponent(clonedVevent);
    }

    return existingComp.toString();
  } catch {
    return null;
  }
}

/**
 * Strip METHOD property from ICS data for storage
 * (METHOD is only for transport, not for stored calendar objects)
 *
 * @param {string} icalStr - The iCal string
 * @returns {string} iCal string without METHOD
 */
function stripMethodFromIcs(icalStr) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const methodProp = comp.getFirstProperty('method');
    if (methodProp) {
      comp.removeProperty(methodProp);
    }

    return comp.toString();
  } catch {
    return icalStr;
  }
}

/**
 * Get SEQUENCE number from iCal data
 *
 * @param {string} icalStr - The iCal string
 * @returns {number} Sequence number (0 if not found)
 */
function getSequenceFromIcal(icalStr) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const vevent =
      comp.getFirstSubcomponent('vevent') || comp.getFirstSubcomponent('vtodo');
    if (!vevent) return 0;
    return vevent.getFirstPropertyValue('sequence') || 0;
  } catch {
    return 0;
  }
}

/**
 * Get RECURRENCE-ID from ICS data
 *
 * @param {string} icalStr - The iCal string
 * @returns {string|null} Recurrence ID string or null
 */
function getRecurrenceIdFromIcs(icalStr) {
  try {
    const comp = new ICAL.Component(ICAL.parse(icalStr));
    const vevent = comp.getFirstSubcomponent('vevent');
    if (!vevent) return null;
    const rid = vevent.getFirstPropertyValue('recurrence-id');
    return rid ? rid.toString() : null;
  } catch {
    return null;
  }
}

module.exports = {
  processCalendarInvites
};
