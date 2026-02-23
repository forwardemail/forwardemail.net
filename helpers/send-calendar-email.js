/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ICAL = require('ical.js');
const sanitizeHtml = require('sanitize-html');
const uuid = require('uuid');
const { boolean } = require('boolean');

const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const config = require('#config');
const i18n = require('#helpers/i18n');
const isEmail = require('#helpers/is-email');
const { generateResponseLinks } = require('#helpers/calendar-response');

//
// Helper to extract the RECURRENCE-ID from a VEVENT as a string (or null).
//
function getRecurrenceId(vevent) {
  const rid = vevent.getFirstPropertyValue('recurrence-id');
  return rid ? rid.toString() : null;
}

//
// Helper to extract an attendee email from an ICAL attendee property.
// Handles both mailto: values and fallback to EMAIL parameter.
//
function getAttendeeEmail(attendeeProp) {
  let email = attendeeProp.getFirstValue();
  if (!email || !/^mailto:/i.test(email)) {
    email = attendeeProp.getParameter('email');
  }

  if (!email) return null;
  return email
    .replace(/^mailto:/i, '')
    .toLowerCase()
    .trim();
}

//
// Helper to match a VEVENT from a list by its RECURRENCE-ID.
// If recurrenceId is null (master), returns the VEVENT with no RECURRENCE-ID.
//
function findMatchingVevent(vevents, recurrenceId) {
  for (const v of vevents) {
    const rid = getRecurrenceId(v);
    if (recurrenceId === null && rid === null) return v;
    if (recurrenceId !== null && rid !== null && rid === recurrenceId) return v;
  }

  return null;
}

/**
 * Detect whether an attendee's PARTSTAT changed between old and new ICS.
 * Checks ALL VEVENTs (master + overrides with RECURRENCE-ID) so that
 * a PARTSTAT change on a single occurrence override is also detected.
 *
 * @param {string} newIcal - New ICS string
 * @param {string} oldIcal - Previous ICS string
 * @param {string} userEmail - Email address of the attendee to check
 * @returns {{ changed: boolean, scheduleAgent: string|null }}
 *   changed = true if the attendee's PARTSTAT differs in any VEVENT
 *   scheduleAgent = value of SCHEDULE-AGENT on the attendee (from the master VEVENT)
 */
function detectAttendeePartstatChange(newIcal, oldIcal, userEmail) {
  const result = { changed: false, scheduleAgent: null };
  if (!newIcal || !oldIcal || !userEmail) return result;

  let newComp;
  let oldComp;
  try {
    newComp = new ICAL.Component(ICAL.parse(newIcal));
    oldComp = new ICAL.Component(ICAL.parse(oldIcal));
  } catch {
    // Malformed ICAL data — cannot compare, treat as no change
    return result;
  }

  const newVevents = newComp.getAllSubcomponents('vevent');
  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const email = userEmail.toLowerCase().trim();

  for (const nv of newVevents) {
    const rid = getRecurrenceId(nv);
    const ov = findMatchingVevent(oldVevents, rid);
    if (!ov) continue;

    let oldPartstat = null;
    let newPartstat = null;

    for (const att of ov.getAllProperties('attendee')) {
      if (getAttendeeEmail(att) === email) {
        oldPartstat = (
          att.getParameter('partstat') || 'NEEDS-ACTION'
        ).toUpperCase();
        break;
      }
    }

    for (const att of nv.getAllProperties('attendee')) {
      if (getAttendeeEmail(att) === email) {
        newPartstat = (
          att.getParameter('partstat') || 'NEEDS-ACTION'
        ).toUpperCase();
        break;
      }
    }

    if (oldPartstat && newPartstat && oldPartstat !== newPartstat) {
      result.changed = true;
      break;
    }
  }

  // Read SCHEDULE-AGENT from the master VEVENT (first one without RECURRENCE-ID)
  if (result.changed) {
    const masterVevent = newComp.getFirstSubcomponent('vevent');
    if (masterVevent) {
      for (const att of masterVevent.getAllProperties('attendee')) {
        if (getAttendeeEmail(att) === email) {
          result.scheduleAgent = att.getParameter('schedule-agent');
          break;
        }
      }
    }
  }

  return result;
}

/**
 * When the organizer makes a significant change (time, recurrence rule),
 * reset all non-organizer attendee PARTSTATs to NEEDS-ACTION and
 * auto-increment SEQUENCE per RFC 5546 Section 3.2.2.
 *
 * Iterates ALL VEVENTs (master + overrides) so that time changes
 * on a single occurrence override are also detected.
 *
 * @param {string} newIcal - New ICS string (will be mutated)
 * @param {string} oldIcal - Previous ICS string
 * @param {string} organizerEmail - Email address of the organizer
 * @returns {{ updatedIcal: string, resetCount: number }}
 *   updatedIcal = the (possibly modified) ICS string
 *   resetCount = number of attendee PARTSTATs that were reset
 */
function resetPartstatsOnSignificantChange(newIcal, oldIcal, organizerEmail) {
  const result = { updatedIcal: newIcal, resetCount: 0 };
  if (!newIcal || !oldIcal || !organizerEmail) return result;

  let newComp;
  let oldComp;
  try {
    newComp = new ICAL.Component(ICAL.parse(newIcal));
    oldComp = new ICAL.Component(ICAL.parse(oldIcal));
  } catch {
    // Malformed ICAL data — cannot compare, return unchanged
    return result;
  }

  const newVevents = newComp.getAllSubcomponents('vevent');
  const oldVevents = oldComp.getAllSubcomponents('vevent');
  const orgEmail = organizerEmail.toLowerCase().trim();

  for (const nv of newVevents) {
    const rid = getRecurrenceId(nv);
    const ov = findMatchingVevent(oldVevents, rid);
    if (!ov) continue;

    const oldDtstart = ov.getFirstPropertyValue('dtstart');
    const newDtstart = nv.getFirstPropertyValue('dtstart');
    const oldDtend = ov.getFirstPropertyValue('dtend');
    const newDtend = nv.getFirstPropertyValue('dtend');
    const oldRrule = ov.getFirstPropertyValue('rrule');
    const newRrule = nv.getFirstPropertyValue('rrule');

    const timeChanged =
      (oldDtstart &&
        newDtstart &&
        oldDtstart.toString() !== newDtstart.toString()) ||
      (oldDtend && newDtend && oldDtend.toString() !== newDtend.toString()) ||
      String(oldRrule || '') !== String(newRrule || '');

    if (timeChanged) {
      // Reset all attendee PARTSTATs to NEEDS-ACTION (RFC 5546 Section 3.2.2.1)
      for (const att of nv.getAllProperties('attendee')) {
        const email = getAttendeeEmail(att);
        // Don't reset the organizer's own PARTSTAT
        if (email === orgEmail) continue;
        const currentPartstat = (
          att.getParameter('partstat') || ''
        ).toUpperCase();
        if (currentPartstat !== 'NEEDS-ACTION') {
          att.setParameter('partstat', 'NEEDS-ACTION');
          result.resetCount++;
        }
      }

      // Auto-increment SEQUENCE (RFC 5546 Section 3.2.2)
      const currentSeq = nv.getFirstPropertyValue('sequence') || 0;
      const oldSeq = ov.getFirstPropertyValue('sequence') || 0;
      if (currentSeq <= oldSeq) {
        nv.updatePropertyWithValue('sequence', oldSeq + 1);
      }
    }
  }

  if (result.resetCount > 0) {
    result.updatedIcal = newComp.toString();
  }

  return result;
}

/**
 * Build HTML email body for calendar invitations with response links
 * @param {Object} ctx - Koa context (needs ctx.locale)
 * @param {Object} event - ICAL.Event object
 * @param {Object} links - Response links { accept, decline, tentative }
 * @returns {string} HTML string
 */
function buildInviteHtml(ctx, event, links) {
  const sanitize = (str) =>
    sanitizeHtml(str, { allowedTags: [], allowedAttributes: {} });
  const summary = sanitize(event.summary || 'Calendar Event');
  const description = sanitize(event.description || '');
  const location = sanitize(event.location || '');

  // Format start/end times
  let startTime = '';
  let endTime = '';
  try {
    if (event.startDate) {
      const start = event.startDate.toJSDate();
      startTime = start.toLocaleString(ctx.locale || 'en', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    }

    if (event.endDate) {
      const end = event.endDate.toJSDate();
      endTime = end.toLocaleString(ctx.locale || 'en', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    }
  } catch {
    // Ignore date formatting errors
  }

  // Build HTML with response buttons
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${i18n.translate('INVITATION', ctx.locale)}: ${summary}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
    <h1 style="margin: 0 0 16px 0; font-size: 24px; color: #1a1a1a;">${summary}</h1>
    ${
      startTime
        ? `<p style="margin: 8px 0;"><strong>When:</strong> ${startTime}${
            endTime && endTime !== startTime ? ` - ${endTime}` : ''
          }</p>`
        : ''
    }
    ${
      location
        ? `<p style="margin: 8px 0;"><strong>Where:</strong> ${location}</p>`
        : ''
    }
    ${
      description
        ? `<p style="margin: 16px 0 0 0; color: #666;">${description}</p>`
        : ''
    }
  </div>

  <div style="text-align: center; margin: 32px 0;">
    <p style="margin-bottom: 16px; font-size: 16px;">Will you attend this event?</p>
    <div style="display: inline-block;">
      <a href="${
        links.accept
      }" style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 4px; font-weight: 500;">Accept</a>
      <a href="${
        links.tentative
      }" style="display: inline-block; background: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 4px; font-weight: 500;">Tentative</a>
      <a href="${
        links.decline
      }" style="display: inline-block; background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 4px; font-weight: 500;">Decline</a>
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid #e9ecef; margin: 24px 0;">

  <p style="font-size: 12px; color: #6c757d; text-align: center;">
    This invitation was sent via <a href="https://forwardemail.net" style="color: #6c757d;">Forward Email</a>, a privacy-focused email service.
  </p>
</body>
</html>
  `.trim();
}

/**
 * Build a complete ICS string from calendar events.
 * This is a standalone version of CalDAV.buildICS().
 *
 * @param {Object} ctx - Koa context (needs ctx.logger)
 * @param {Array|Object} events - Event objects with { eventId, calendar, ical }
 * @param {Object} calendar - Calendar object with calendarId, name, prodId, etc.
 * @param {string|false} [method=false] - iTIP method (REQUEST, REPLY, CANCEL, etc.)
 * @returns {string} ICS string
 */
function buildICS(ctx, events, calendar, method = false) {
  const startTime = Date.now();
  ctx.logger.debug('buildICS', { events, calendar });

  // Always normalize events to an array to ensure consistent VCALENDAR output
  const eventArray = events ? (Array.isArray(events) ? events : [events]) : [];

  // <https://github.com/kewisch/ical.js/wiki/Creating-basic-iCalendar>
  const comp = new ICAL.Component(['vcalendar', [], []]);

  comp.updatePropertyWithValue('version', '2.0');

  // used for invites, cancelled events, replies, and other iTIP methods
  if (method) {
    const validMethods = [
      'REQUEST',
      'REPLY',
      'CANCEL',
      'ADD',
      'REFRESH',
      'COUNTER',
      'DECLINECOUNTER',
      'PUBLISH'
    ];
    if (!validMethods.includes(method))
      throw new TypeError(`Method must be one of: ${validMethods.join(', ')}`);
    comp.updatePropertyWithValue('method', method);
  }

  // uid -> calendar.calendarId
  if (uuid.validate(calendar.calendarId))
    comp.updatePropertyWithValue('uid', calendar.calendarId);
  else comp.updatePropertyWithValue('uid', calendar._id.toString());

  // name -> calendar.name
  comp.updatePropertyWithValue('name', calendar.name);

  // prodid
  if (calendar.prodId) comp.updatePropertyWithValue('prodid', calendar.prodId);

  // description
  if (calendar.description)
    comp.updatePropertyWithValue('description', calendar.description);

  // calscale -> calendar.scale
  if (calendar.scale) comp.updatePropertyWithValue('calscale', calendar.scale);

  // url
  if (calendar.url) comp.updatePropertyWithValue('url', calendar.url);

  // source
  if (calendar.source) comp.updatePropertyWithValue('source', calendar.source);

  // X-Meta-Data
  if (Array.isArray(calendar.x) && calendar.x.length > 0) {
    for (const xData of calendar.x) {
      comp.updatePropertyWithValue(xData.key.toUpperCase(), xData.value);
    }
  }

  // add all VEVENTS and VTODOS
  for (const event of eventArray) {
    const eventComp = new ICAL.Component(ICAL.parse(event.ical));
    const vevents = eventComp.getAllSubcomponents('vevent');
    const vtodos = eventComp.getAllSubcomponents('vtodo');

    // Process VEVENT components
    for (const vevent of vevents) {
      vevent.removeAllProperties('X-MOZ-LASTACK');
      vevent.removeAllProperties('X-MOZ-GENERATION');
      comp.addSubcomponent(vevent);
    }

    // Process VTODO components
    for (const vtodo of vtodos) {
      vtodo.removeAllProperties('X-MOZ-LASTACK');
      vtodo.removeAllProperties('X-MOZ-GENERATION');
      comp.addSubcomponent(vtodo);
    }
  }

  const duration = Date.now() - startTime;
  if (duration > 5000) {
    ctx.logger.warn('buildICS slow', {
      duration,
      eventCount: eventArray.length,
      calendarId: calendar.calendarId || calendar._id
    });
  }

  return comp.toString();
}

/**
 * Send calendar invitation/update/cancellation emails to attendees.
 * Extracted from CalDAV.sendEmailWithICS() so it can be shared
 * between the CalDAV server and the REST API.
 *
 * @param {Object} ctx - Koa context (needs ctx.state.user, ctx.logger, ctx.locale)
 * @param {Object} calendar - Calendar object from SQLite
 * @param {Object} calendarEvent - CalendarEvent object from SQLite (needs eventId, ical)
 * @param {string} method - iTIP method: 'REQUEST', 'CANCEL', or 'REPLY'
 * @param {string} [oldCalStr] - Previous ICS string (for detecting removed attendees on updates)
 * @param {Object} [instance] - SQLite/WSP instance for SCHEDULE-STATUS write-back (optional)
 */
// eslint-disable-next-line max-params
async function sendCalendarEmail(
  ctx,
  calendar,
  calendarEvent,
  method,
  oldCalStr,
  instance
) {
  try {
    let alias;
    let domain;
    try {
      [alias, domain] = await Promise.all([
        // get alias (and populate user, which is required for Emails.queue method)
        Aliases.findOne({ id: ctx.state.user.alias_id })
          .populate('user')
          .lean()
          .exec(),

        // get domain (and populate members, which is required for Emails.queue method)
        Domains.findOne({ id: ctx.state.user.domain_id })
          .populate(
            'members.user',
            `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
          )
          .lean()
          .exec()
      ]);
    } catch (err) {
      // If we can't fetch alias/domain (e.g. MongoDB not available in test environment), skip sending email
      ctx.logger.debug(
        err,
        'Could not fetch alias/domain for calendar email, skipping email send'
      );
      return;
    }

    if (!alias || !domain) {
      ctx.logger.debug(
        'Alias or domain not found for calendar email, skipping email send'
      );
      return;
    }

    //
    // build ICS string so we can parse and re-render with REQUEST method
    //
    const comp = new ICAL.Component(ICAL.parse(calendarEvent.ical));
    if (!comp) throw new TypeError('Component not parsed');

    // Check if this is a VTODO (task) - tasks don't typically send email invitations
    const vtodos = comp.getAllSubcomponents('vtodo');
    if (vtodos.length > 0 && comp.getAllSubcomponents('vevent').length === 0) {
      // This is a task-only component, skip email sending
      ctx.logger.debug(
        'Skipping email for VTODO component - tasks do not send invitations'
      );
      return;
    }

    // Handle VEVENT components (calendar events)
    // For recurring events with overrides, the ICS contains multiple VEVENTs
    // sharing the same UID (master + overrides with RECURRENCE-ID).
    // We select the master VEVENT (no RECURRENCE-ID) as the primary vevent
    // for organizer/validity checks, but process ALL VEVENTs for email sending.
    const vevents = comp.getAllSubcomponents('vevent');
    let vevent = null;

    // First try to find the master VEVENT (no RECURRENCE-ID) matching the eventId
    for (const v of vevents) {
      const uid = v.getFirstPropertyValue('uid');
      const uidMatch =
        uid === calendarEvent.eventId ||
        (isEmail(uid) && uid.replace('@', '_') === calendarEvent.eventId);
      if (uidMatch && !getRecurrenceId(v)) {
        vevent = v;
        break;
      }
    }

    // If no master found, fall back to any matching VEVENT
    if (!vevent) {
      vevent = vevents.find((v) => {
        const uid = v.getFirstPropertyValue('uid');
        return (
          uid === calendarEvent.eventId ||
          (isEmail(uid) && uid.replace('@', '_') === calendarEvent.eventId)
        );
      });
    }

    // Final fallback
    if (!vevent && vevents.length > 0) vevent = vevents[0];
    if (!vevent) throw new TypeError('vevent missing');

    // if method was CANCEL then STATUS on vevent needs to be CANCELLED
    if (method === 'CANCEL')
      vevent.updatePropertyWithValue('status', 'CANCELLED');

    const event = new ICAL.Event(vevent);

    let isValid = true;
    //
    // RFC 6638 §7.1 — SCHEDULE-AGENT on the ORGANIZER property.
    // When an Attendee creates/modifies/removes a scheduling object resource,
    // the server checks the ORGANIZER's SCHEDULE-AGENT parameter to decide
    // whether to send scheduling messages.  Values CLIENT and NONE both mean
    // "the server must not send any scheduling message".
    //
    {
      const orgProp = vevent.getFirstProperty('organizer');
      if (orgProp) {
        const orgScheduleAgent = orgProp.getParameter('schedule-agent');
        if (
          orgScheduleAgent &&
          ['CLIENT', 'NONE'].includes(orgScheduleAgent.toUpperCase())
        ) {
          ctx.logger.debug(
            'Skipping calendar email — ORGANIZER;SCHEDULE-AGENT=' +
              orgScheduleAgent.toUpperCase(),
            { eventId: calendarEvent.eventId, method }
          );
          return;
        }
      }
    }

    //
    // RFC 6638 §8.1 — Schedule-Reply request header.
    // When an Attendee sends Schedule-Reply: F the server MUST NOT send
    // a scheduling message as part of its normal scheduling operation.
    //
    if (method === 'REPLY' && ctx.get && ctx.get('schedule-reply') === 'F') {
      ctx.logger.debug('Skipping REPLY — Schedule-Reply: F header present', {
        eventId: calendarEvent.eventId
      });
      return;
    }

    // Thunderbird sets X-MOZ-SEND-INVITATIONS to the string "TRUE" or "FALSE"
    // based on the "Send invitations to attendees" checkbox.
    if (
      vevent.getFirstPropertyValue('x-moz-send-invitations') !== null &&
      vevent
        .getFirstPropertyValue('x-moz-send-invitations')
        .toString()
        .toUpperCase() !== 'TRUE'
    )
      isValid = false;
    //
    // For REPLY method: the user is an attendee, not the organizer.
    // Send the REPLY to the organizer (RFC 5546 Section 3.2.3).
    //
    else if (method === 'REPLY') {
      if (event.organizer) {
        const organizerEmail = event.organizer
          .replace('mailto:', '')
          .trim()
          .toLowerCase();

        // Don't send REPLY if organizer is the current user
        // (defense-in-depth safeguard against organizer receiving their own acceptance emails)
        if (organizerEmail === ctx.state.user.username) {
          ctx.logger.debug('Skipping REPLY - organizer is the current user', {
            organizerEmail,
            username: ctx.state.user.username,
            eventId: calendarEvent.eventId
          });
          return;
        }

        if (organizerEmail && isEmail(organizerEmail)) {
          //
          // RFC 5546 §3.2.2 — RSVP=FALSE means the attendee does not want a
          // reply to be sent to the organizer.  Skip the REPLY in that case.
          //
          let attendeeRsvp = true; // default per RFC is to send
          if (event.attendees) {
            for (const att of event.attendees) {
              let attEmail = att.getFirstValue();
              if (attEmail)
                attEmail = attEmail.replace('mailto:', '').toLowerCase().trim();
              if (attEmail === ctx.state.user.username) {
                const rsvpParam = att.getParameter('rsvp');
                if (rsvpParam && rsvpParam.toUpperCase() === 'FALSE')
                  attendeeRsvp = false;
                break;
              }
            }
          }

          if (!attendeeRsvp) {
            ctx.logger.debug('Skipping REPLY — attendee RSVP=FALSE', {
              eventId: calendarEvent.eventId
            });
            return;
          }

          // Build a REPLY ICS containing only the attendee's VEVENT
          const vc = new ICAL.Component(['vcalendar', [], []]);
          vc.addSubcomponent(vevent);
          const ics = buildICS(
            ctx,
            [
              {
                eventId: calendarEvent.eventId,
                calendar: calendar._id,
                ical: vc.toString()
              }
            ],
            calendar,
            'REPLY'
          );
          // Get the attendee's current PARTSTAT for the subject line
          let partstat = 'NEEDS-ACTION';
          if (event.attendees) {
            for (const att of event.attendees) {
              let attEmail = att.getFirstValue();
              if (attEmail)
                attEmail = attEmail.replace('mailto:', '').toLowerCase().trim();
              if (attEmail === ctx.state.user.username) {
                partstat = (
                  att.getParameter('partstat') || 'NEEDS-ACTION'
                ).toUpperCase();
                break;
              }
            }
          }

          const summary =
            event.summary ||
            (event.getFirstPropertyValue &&
              event.getFirstPropertyValue('summary')) ||
            'Event';

          const subjectPrefix =
            partstat === 'DECLINED'
              ? i18n.translate('DECLINED', ctx.locale)
              : partstat === 'TENTATIVE'
              ? i18n.translate('TENTATIVE', ctx.locale)
              : i18n.translate('ACCEPTED', ctx.locale);

          await Emails.queue({
            message: {
              from: ctx.state.user.username,
              to: organizerEmail,
              subject: `${subjectPrefix}: ${summary}`,
              icalEvent: {
                method: 'REPLY',
                filename: 'invite.ics',
                content: ics
              }
            },
            alias,
            domain,
            user: alias ? alias.user : undefined,
            date: new Date()
          });

          // Already handled, skip the normal attendee iteration
          return;
        }
      }
    }
    // mirror sabre/dav behavior
    //
    // must have organizer matching alias
    // and at least one attendee
    //
    else if (!event.organizer) isValid = false;
    // event.organizer = 'mailto:foo@bar.com'
    else if (
      event.organizer.replace('mailto:', '').trim().toLowerCase() !==
      ctx.state.user.username
    )
      isValid = false;

    //
    // Detect removed attendees and send CANCEL emails.
    // For recurring events with overrides, we must compare each VEVENT
    // (master + overrides) by RECURRENCE-ID to detect per-occurrence removals.
    //
    if (oldCalStr) {
      const oldComp = new ICAL.Component(ICAL.parse(oldCalStr));
      if (!oldComp) throw new TypeError('Old component not parsed');

      const oldVevents = oldComp.getAllSubcomponents('vevent');
      const newVevents = comp.getAllSubcomponents('vevent');

      for (const oldV of oldVevents) {
        const rid = getRecurrenceId(oldV);
        const newV = findMatchingVevent(newVevents, rid);

        const oldAttendees = oldV.getAllProperties('attendee');
        if (oldAttendees.length === 0) continue;

        // Get the new VEVENT's attendees (if the override was removed entirely,
        // all old attendees are considered removed)
        const newAttendees = newV ? newV.getAllProperties('attendee') : [];

        for (const attendee of oldAttendees) {
          const oldEmail = getAttendeeEmail(attendee);
          if (!oldEmail) continue;

          // Check if this attendee still exists in the new version;
          // if a match is found then the user wasn't removed
          const match = newAttendees.find((a) => {
            const addr = getAttendeeEmail(a);
            return addr === oldEmail;
          });

          if (match) continue;

          //
          // Send CANCEL to this user (with the old event object)
          // since they were not a part of the updated event.
          // (note they won't get a duplicate REQUEST email below
          //  because they're not in the new event's attendees)
          //
          const commonName = attendee.getParameter('cn');
          const to = commonName ? `"${commonName}" ${oldEmail}` : oldEmail;

          try {
            const vc = new ICAL.Component(['vcalendar', [], []]);
            vc.addSubcomponent(oldV);

            const ics = buildICS(
              ctx,
              [
                {
                  eventId: calendarEvent.eventId,
                  calendar: calendar._id,
                  ical: vc.toString()
                }
              ],
              calendar,
              method
            );

            const summary = oldV.getFirstPropertyValue('summary') || 'Event';
            await Emails.queue({
              message: {
                from: ctx.state.user.username,
                to,
                bcc: ctx.state.user.username,
                subject: `${i18n.translate(
                  'CANCELLED',
                  ctx.locale
                )}: ${summary}`,
                icalEvent: {
                  method,
                  filename: 'invite.ics',
                  content: ics
                }
              },
              alias,
              domain,
              user: alias ? alias.user : undefined,
              date: new Date()
            });
          } catch (err) {
            ctx.logger.fatal(err);
          }
        }
      }
    }

    if (isValid) {
      //
      // Collect attendees from ALL VEVENTs (master + overrides).
      // For recurring events, an attendee may only exist on an override
      // (e.g. added back to a single occurrence after being removed from the series).
      // We deduplicate by email so each attendee gets exactly one invite.
      //
      const to = [];
      const attendeeInfo = [];
      const seenEmails = new Set();
      const organizerEmail = event.organizer
        .replace('mailto:', '')
        .trim()
        .toLowerCase();
      const eventUid = vevent.getFirstPropertyValue('uid');

      // Parse old VEVENTs for comparison (to detect newly added attendees on overrides)
      let oldVeventsForReq = [];
      if (oldCalStr) {
        try {
          const oldCompReq = new ICAL.Component(ICAL.parse(oldCalStr));
          oldVeventsForReq = oldCompReq.getAllSubcomponents('vevent');
        } catch {
          // ignore parse errors
        }
      }

      for (const v of vevents) {
        const rid = getRecurrenceId(v);
        const attendees = v.getAllProperties('attendee');

        // Find the matching old VEVENT to check if attendee is newly added
        const oldV =
          oldVeventsForReq.length > 0
            ? findMatchingVevent(oldVeventsForReq, rid)
            : null;
        const oldAttendeeEmails = new Set();
        if (oldV) {
          for (const oa of oldV.getAllProperties('attendee')) {
            const oaEmail = getAttendeeEmail(oa);
            if (oaEmail) oldAttendeeEmails.add(oaEmail);
          }
        }

        for (const attendee of attendees) {
          // RFC 6638 §7.1: SCHEDULE-AGENT=CLIENT means the client handles
          // scheduling itself; SCHEDULE-AGENT=NONE means no scheduling messages
          // at all.  Both values mean the server must not send invites.
          const scheduleAgent = attendee.getParameter('schedule-agent');
          if (
            scheduleAgent &&
            ['CLIENT', 'NONE'].includes(scheduleAgent.toUpperCase())
          )
            continue;

          // Skip attendees that were already DECLINED
          const partStat = attendee.getParameter('partstat');
          if (partStat && partStat.toLowerCase() === 'declined') continue;

          const email = getAttendeeEmail(attendee);
          if (!email || !isEmail(email)) continue;
          if (email === organizerEmail) continue;
          if (seenEmails.has(email)) continue;

          //
          // For updates (oldCalStr present): only send to attendees who are
          // either in the master VEVENT or newly added to an override.
          // This prevents re-sending invites to attendees who were already
          // on the event and haven't changed.
          // For new events (no oldCalStr): send to all attendees.
          //
          if (rid !== null && oldV && oldAttendeeEmails.has(email)) {
            // Attendee already existed on this override — skip
            // (they'll get the update from the master VEVENT processing)
            seenEmails.add(email);
            continue;
          }

          seenEmails.add(email);
          const commonName = attendee.getParameter('cn');
          if (commonName) {
            to.push(`"${commonName}" <${email}>`);
          } else {
            to.push(email);
          }

          // Store attendee info for response links (only for REQUEST method)
          if (method === 'REQUEST' && eventUid) {
            attendeeInfo.push({
              email,
              commonName,
              formatted: commonName ? `"${commonName}" <${email}>` : email
            });
          }
        }
      }

      if (to.length > 0) {
        //
        // Build the ICS for the email.
        // Include ALL VEVENTs (master + overrides) so the recipient gets
        // the complete recurring event with the override they were added to.
        //
        const vc = new ICAL.Component(['vcalendar', [], []]);
        for (const v of vevents) {
          vc.addSubcomponent(v);
        }

        const ics = buildICS(
          ctx,
          [
            {
              eventId: calendarEvent.eventId,
              calendar: calendar._id,
              ical: vc.toString()
            }
          ],
          calendar,
          method
        );

        ctx.logger.debug('ics output', ics);

        let subject =
          event.summary ||
          (event.getFirstPropertyValue &&
            event.getFirstPropertyValue('summary'));

        subject =
          method === 'CANCEL'
            ? `${i18n.translate('CANCELLED', ctx.locale)}: ${subject}`
            : `${i18n.translate('INVITATION', ctx.locale)}: ${subject}`;

        //
        // if "X-MOZ-SEND-INVITATIONS-UNDISCLOSED:TRUE" then
        // the Thunderbird checkbox was checked for
        // "Separate invitation per attendee"
        //
        if (
          vevent.getFirstPropertyValue('x-moz-send-invitations-undisclosed') &&
          boolean(
            vevent.getFirstPropertyValue('x-moz-send-invitations-undisclosed')
          )
        ) {
          // Send separate invitations per attendee with personalized response links
          for (const rcpt of to) {
            try {
              // Find attendee info for this recipient
              const attendee = attendeeInfo.find(
                (a) => a.formatted === rcpt || a.email === rcpt
              );

              // Generate response links for this attendee (REQUEST method only)
              let html;
              if (method === 'REQUEST' && eventUid && attendee) {
                const links = generateResponseLinks({
                  eventUid,
                  organizerEmail,
                  attendeeEmail: attendee.email
                });
                html = buildInviteHtml(ctx, event, links);
              }

              await Emails.queue({
                message: {
                  from: ctx.state.user.username,
                  to: rcpt,
                  subject,
                  ...(html ? { html } : {}),
                  icalEvent: {
                    method,
                    filename: 'invite.ics',
                    content: ics
                  }
                },
                alias,
                domain,
                user: alias ? alias.user : undefined,
                date: new Date()
              });
            } catch (err) {
              ctx.logger.fatal(err);
            }
          }
        } else if (
          method === 'REQUEST' &&
          eventUid &&
          attendeeInfo.length > 0
        ) {
          // Send individual emails with personalized Accept/Decline/Tentative links
          for (const attendee of attendeeInfo) {
            try {
              const links = generateResponseLinks({
                eventUid,
                organizerEmail,
                attendeeEmail: attendee.email
              });
              const html = buildInviteHtml(ctx, event, links);

              await Emails.queue({
                message: {
                  from: ctx.state.user.username,
                  to: attendee.formatted,
                  subject,
                  html,
                  icalEvent: {
                    method,
                    filename: 'invite.ics',
                    content: ics
                  }
                },
                alias,
                domain,
                user: alias ? alias.user : undefined,
                date: new Date()
              });
            } catch (err) {
              ctx.logger.fatal(err);
            }
          }
        } else {
          // For CANCEL or other methods, send to all at once without personalized links
          await Emails.queue({
            message: {
              from: ctx.state.user.username,
              to,
              subject,
              icalEvent: {
                method,
                filename: 'invite.ics',
                content: ics
              }
            },
            alias,
            domain,
            user: alias ? alias.user : undefined,
            date: new Date()
          });
        }

        //
        // RFC 6638 §7.3 — SCHEDULE-STATUS write-back.
        // After successfully queuing scheduling messages the server SHOULD
        // write the delivery status back onto each ATTENDEE property as
        // SCHEDULE-STATUS="1.1" (pending) so CalDAV clients can read it.
        // We only do this for REQUEST (organizer → attendees) and only when
        // an SQLite instance is available (i.e. not in unit-test stubs).
        //
        if (method === 'REQUEST' && instance && ctx.state.session) {
          try {
            // Read the freshest version of the event from the DB first so we
            // do not overwrite any concurrent PARTSTAT updates (e.g. from
            // processCalendarInvites) with a stale copy of calendarEvent.ical.
            const freshEvent = await CalendarEvents.findOne(
              instance,
              ctx.state.session,
              { eventId: calendarEvent.eventId }
            );
            if (freshEvent) {
              const updatedComp = new ICAL.Component(
                ICAL.parse(freshEvent.ical)
              );
              let statusWritten = false;
              for (const uv of updatedComp.getAllSubcomponents('vevent')) {
                for (const att of uv.getAllProperties('attendee')) {
                  const attEmail = getAttendeeEmail(att);
                  if (!attEmail || attEmail === organizerEmail) continue;
                  const sa = att.getParameter('schedule-agent');
                  if (sa && ['CLIENT', 'NONE'].includes(sa.toUpperCase()))
                    continue;
                  // 1.1 = "The scheduling message has been sent" (pending delivery)
                  att.setParameter('schedule-status', '1.1');
                  statusWritten = true;
                }
              }

              if (statusWritten) {
                freshEvent.ical = updatedComp.toString();
                freshEvent.instance = instance;
                freshEvent.session = ctx.state.session;
                freshEvent.isNew = false;
                await freshEvent.save();
              }
            }
          } catch (scheduleStatusErr) {
            ctx.logger.debug(
              scheduleStatusErr,
              'SCHEDULE-STATUS write-back failed (non-fatal)'
            );
          }
        }
      } // end if (to.length > 0)
    } // end isValid
  } catch (err) {
    // temp debugging
    err.isCodeBug = true;
    err.calendar = calendar;
    err.oldCalStr = oldCalStr;
    err.calendarEvent = calendarEvent;
    ctx.logger.fatal(err);
  }
}

module.exports = {
  buildICS,
  buildInviteHtml,
  detectAttendeePartstatChange,
  findMatchingVevent,
  getAttendeeEmail,
  getRecurrenceId,
  resetPartstatsOnSignificantChange,
  sendCalendarEmail
};
