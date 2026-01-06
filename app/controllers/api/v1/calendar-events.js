/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ICAL = require('ical.js');
const ObjectID = require('bson-objectid');
const dayjs = require('dayjs-with-plugins');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');
const { rrulestr } = require('rrule');

const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const i18n = require('#helpers/i18n');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const updateStorageUsed = require('#helpers/update-storage-used');
const _ = require('#helpers/lodash');

const exdateRegex =
  /^EXDATE(?:;TZID=[\w/+=-]+|;VALUE=DATE)?:\d{8}(?:T\d{6}(?:\.\d{1,3})?Z?)?$/;

function isValidExdate(str) {
  return exdateRegex.test(str);
}

function json(calendarEvent, calendar) {
  // Transform calendar event data for API response
  const object = {
    //
    // NOTE: we use `eventId` vs `_id` since
    //       CalDAV spec allows arbitrary ID's from clients
    //
    id: calendarEvent.eventId,
    calendar_id: calendar.calendarId,
    ical: calendarEvent.ical,
    deleted_at: calendarEvent.deleted_at,
    created_at: calendarEvent.created_at,
    updated_at: calendarEvent.updated_at,
    object: 'calendar_event'
  };

  // Parse iCal data to extract common properties
  if (calendarEvent.ical) {
    try {
      const parsed = ICAL.parse(calendarEvent.ical);
      const comp = new ICAL.Component(parsed);
      const vevent = comp.getFirstSubcomponent('vevent');

      if (vevent) {
        const event = new ICAL.Event(vevent);
        object.summary = event.summary;
        object.description = event.description;
        object.location = event.location;
        object.start_date = event.startDate ? event.startDate.toJSDate() : null;
        object.end_date = event.endDate ? event.endDate.toJSDate() : null;
        object.uid = event.uid;
        object.status = vevent.getFirstPropertyValue('status');
        object.organizer = vevent.getFirstPropertyValue('organizer');
      }
    } catch {
      // If parsing fails, just return the basic object
    }
  }

  return object;
}

async function list(ctx) {
  const query = {};

  // Filter by calendar if specified
  let calendar;
  const calendarMap = new Map();
  if (isSANB(ctx.query.calendar_id)) {
    // Validate calendar exists and user has access
    calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
      calendarId: ctx.query.calendar_id
    });

    if (!calendar)
      throw Boom.badRequest(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));

    calendarMap.set(calendar._id.toString(), calendar);

    query.calendar = calendar._id;
  }

  // Exclude deleted events by default
  if (!boolean(ctx.query.include_deleted)) {
    query.deleted_at = { $exists: false };
  }

  // Parse sort parameter
  // Supports: ?sort=created_at, ?sort=-created_at, ?sort=updated_at,-created_at
  // Valid fields: created_at, updated_at, eventId
  let sort = { created_at: -1 }; // default sort
  if (isSANB(ctx.query.sort)) {
    const sortFields = ctx.query.sort.split(',').map((s) => s.trim());
    const sortObj = {};
    for (const field of sortFields) {
      if (field.startsWith('-')) {
        // Descending order
        sortObj[field.slice(1)] = -1;
      } else {
        // Ascending order
        sortObj[field] = 1;
      }
    }

    sort = sortObj;
  }

  // Filter by date range if specified
  if (isSANB(ctx.query.start_date) || isSANB(ctx.query.end_date)) {
    let start;
    let end;

    if (isSANB(ctx.query.start_date)) {
      if (!dayjs(ctx.query.start_date).isValid())
        throw Boom.badRequest(ctx.translateError('START_DATE_INVALID'));
      start = new Date(ctx.query.start_date);
    }

    if (isSANB(ctx.query.end_date)) {
      if (!dayjs(ctx.query.end_date).isValid())
        throw Boom.badRequest(ctx.translateError('END_DATE_INVALID'));
      end = new Date(ctx.query.end_date);
    }

    if (start && end && start.getTime() > end.getTime())
      throw Boom.badRequest(ctx.translateError('END_BEFORE_START'));

    // This requires more complex querying of the ical field
    const events = await CalendarEvents.find(
      ctx.instance,
      ctx.state.session,
      query
    );

    const filteredEventIds = [];

    //
    // NOTE: an event can have multiple RRULE, RDATE, EXDATE values
    // NOTE: if you update this, also update the logic in caldav-server.js
    //
    for (const event of events) {
      try {
        const comp = new ICAL.Component(ICAL.parse(event.ical));
        const vevents = comp.getAllSubcomponents('vevent');
        const vtodos = comp.getAllSubcomponents('vtodo');

        if (vevents.length === 0 && vtodos.length === 0) {
          const err = new TypeError('Event missing VEVENT or VTODO component');
          ctx.logger.error(err, { event, calendar });
          continue;
        }

        let match = false;

        // Process VEVENT components
        for (const vevent of vevents) {
          let lines = [];
          // start = dtstart
          // end = dtend
          let dtstart = vevent.getFirstPropertyValue('dtstart');
          if (!dtstart || !(dtstart instanceof ICAL.Time)) {
            const err = new TypeError('DTSTART missing on event');
            ctx.logger.error(err, { event, calendar });
            continue;
          }

          dtstart = dtstart.toJSDate();

          let dtend = vevent.getFirstPropertyValue('dtend');
          dtend = dtend && dtend instanceof ICAL.Time ? dtend.toJSDate() : null;

          // If no dtend, use dtstart as both start and end (point-in-time event)
          if (!dtend) {
            dtend = dtstart;
          }

          for (const key of ['rrule', 'exrule', 'exdate', 'rdate']) {
            const properties = vevent.getAllProperties(key);
            for (const prop of properties) {
              lines.push(prop.toICALString());
            }
          }

          if (lines.length === 0) {
            // Non-recurring event - check if event overlaps with query range
            // Event overlaps if: event_start <= query_end && event_end >= query_start
            const eventOverlaps =
              (!end || dtstart <= end) && (!start || dtend >= start);

            if (eventOverlaps) {
              match = true;
              break;
            }

            continue;
          }

          // Handle recurring events
          let rruleSet;
          try {
            rruleSet = rrulestr(lines.join('\n'));
          } catch (err) {
            if (err.message.includes('Unsupported RFC prop EXDATE in EXDATE')) {
              try {
                lines = _.compact(
                  lines.map((line) => {
                    if (line.includes('EXDATE')) {
                      return isValidExdate(line) ? line : null;
                    }

                    return line;
                  })
                );
                rruleSet = rrulestr(lines.join('\n'));
              } catch (err) {
                err.isCodeBug = true;
                ctx.logger.fatal(err);
                throw err;
              }
            } else {
              err.isCodeBug = true;
              ctx.logger.fatal(err);
              throw err;
            }
          }

          // Check queried date range (if both start and end specified)
          if (start && end) {
            const dates = rruleSet.between(start, end, true);
            if (dates.length > 0) {
              match = true;
              break;
            }

            continue;
          }

          // if only start specified
          if (start) {
            const date = rruleSet.after(start, true);
            if (date) {
              match = true;
              break;
            }

            continue;
          }

          // if only end specified
          if (end) {
            const date = rruleSet.before(end, true);
            if (date) {
              match = true;
              break;
            }
          }
        }

        // Process VTODO components (tasks)
        if (!match) {
          for (const vtodo of vtodos) {
            let lines = [];
            // For tasks, we use DUE instead of DTEND, and DTSTART might not exist
            let dtstart = vtodo.getFirstPropertyValue('dtstart');
            let due = vtodo.getFirstPropertyValue('due');

            // Convert to JS dates if they exist
            dtstart =
              dtstart && dtstart instanceof ICAL.Time
                ? dtstart.toJSDate()
                : null;
            due = due && due instanceof ICAL.Time ? due.toJSDate() : null;

            // Collect recurrence rules for tasks (if any)
            for (const key of ['rrule', 'exrule', 'exdate', 'rdate']) {
              const properties = vtodo.getAllProperties(key);
              for (const prop of properties) {
                lines.push(prop.toICALString());
              }
            }

            if (lines.length === 0) {
              // Non-recurring task - check date ranges
              // For tasks, we need to be more flexible with date matching
              const taskStart = dtstart;
              const taskEnd = due || dtstart; // Use due date or start date

              if (taskStart || taskEnd) {
                // If we have any date for the task, check overlap
                const taskOverlaps =
                  (!end || (taskStart && taskStart <= end)) &&
                  (!start || (taskEnd && taskEnd >= start));

                if (taskOverlaps) {
                  match = true;
                  break;
                }
              }

              continue;
            }

            // Handle recurring tasks (similar to events)
            let rruleSet;
            try {
              rruleSet = rrulestr(lines.join('\n'));
            } catch (err) {
              if (
                err.message.includes('Unsupported RFC prop EXDATE in EXDATE')
              ) {
                try {
                  lines = _.compact(
                    lines.map((line) => {
                      if (line.includes('EXDATE')) {
                        return isValidExdate(line) ? line : null;
                      }

                      return line;
                    })
                  );
                  rruleSet = rrulestr(lines.join('\n'));
                } catch (err) {
                  err.isCodeBug = true;
                  ctx.logger.fatal(err);
                  throw err;
                }
              } else {
                err.isCodeBug = true;
                ctx.logger.fatal(err);
                throw err;
              }
            }

            // Check queried date range for recurring tasks
            if (start && end) {
              const dates = rruleSet.between(start, end, true);
              if (dates.length > 0) {
                match = true;
                break;
              }

              continue;
            }

            if (start) {
              const date = rruleSet.after(start, true);
              if (date) {
                match = true;
                break;
              }

              continue;
            }

            if (end) {
              const date = rruleSet.before(end, true);
              if (date) {
                match = true;
                break;
              }
            }
          }
        }

        if (match) filteredEventIds.push(event._id);
      } catch (err) {
        ctx.logger.error(err, { event });
        // Continue processing other events even if one fails
        continue;
      }
    }

    // Update query to only include filtered events
    query._id = { $in: filteredEventIds };
  }

  // Get calendar events with pagination
  const [calendarEvents, itemCount] = await Promise.all([
    CalendarEvents.find(
      ctx.instance,
      ctx.state.session,
      query,
      {},
      {
        limit: ctx.query.limit,
        offset: ctx.paginate.skip,
        sort
      }
    ),
    CalendarEvents.countDocuments(ctx.instance, ctx.state.session, query)
  ]);

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Set pagination headers
  setPaginationHeaders(
    ctx,
    pageCount,
    ctx.query.page,
    calendarEvents.length,
    itemCount
  );

  // Load calendars for events that don't have them cached
  const calendarIds = new Set();
  for (const event of calendarEvents) {
    if (!calendarMap.has(event.calendar.toString())) {
      calendarIds.add(event.calendar);
    }
  }

  if (calendarIds.size > 0) {
    const calendars = await Calendars.find(ctx.instance, ctx.state.session, {
      _id: { $in: [...calendarIds] }
    });

    for (const cal of calendars) {
      calendarMap.set(cal._id.toString(), cal);
    }
  }

  ctx.body = Array.isArray(calendarEvents)
    ? calendarEvents.map((calendarEvent) => {
        const cal = calendarMap.get(calendarEvent.calendar.toString());
        return json(calendarEvent, cal);
      })
    : [];
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate required fields
  if (!body.calendar_id) {
    throw Boom.badRequest(ctx.translateError('CALENDAR_ID_REQUIRED'));
  }

  if (!body.ical) {
    throw Boom.badRequest(ctx.translateError('ICAL_DATA_REQUIRED'));
  }

  // Validate calendar exists and user has access
  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: body.calendar_id
  });

  if (!calendar) {
    throw Boom.badRequest(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  const eventId = body.event_id || new ObjectID().toString();

  // Check if calendar event already exists
  const existingEvent = await CalendarEvents.findOne(
    ctx.instance,
    ctx.state.session,
    { eventId }
  );

  if (existingEvent) {
    throw Boom.conflict(ctx.translateError('CALENDAR_EVENT_ALREADY_EXISTS'));
  }

  // Check if over quota
  const { isOverQuota } = await Aliases.isOverQuota(
    {
      id: ctx.state.session.user.alias_id,
      domain: ctx.state.session.user.domain_id,
      locale: ctx.locale
    },
    0,
    ctx.client
  );
  if (isOverQuota)
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  const calendarEvent = await CalendarEvents.create({
    // db virtual helper
    instance: ctx.instance,
    session: ctx.state.session,

    // eventId
    eventId,

    // calendar reference
    calendar: calendar._id,

    // iCal data
    ical: body.ical,

    // Construct href for CalDAV sync-collection responses
    // This matches the CalDAV URL format: /cal/{principalId}/{calendarId}/{eventId}.ics
    href: `/cal/${ctx.state.session.user.username}/${calendar.calendarId}/${eventId}.ics`
  });

  ctx.body = json(calendarEvent, calendar);

  // Update storage in background (calendar events contribute to storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { calendarEvent, session: ctx.state.session })
    );
}

async function retrieve(ctx) {
  // Validate calendar event ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_INVALID_ID'));

  const calendarEvent = await CalendarEvents.findOne(
    ctx.instance,
    ctx.state.session,
    {
      eventId: ctx.params.id,
      deleted_at: { $exists: false }
    }
  );

  if (!calendarEvent)
    throw Boom.notFound(ctx.translateError('CALENDAR_EVENT_DOES_NOT_EXIST'));

  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    _id: calendarEvent.calendar
  });

  if (!calendar)
    throw Boom.badRequest(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));

  ctx.body = json(calendarEvent, calendar);
}

async function update(ctx) {
  const { body } = ctx.request;

  // Validate calendar event ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_INVALID_ID'));

  const calendarEvent = await CalendarEvents.findOne(
    ctx.instance,
    ctx.state.session,
    {
      eventId: ctx.params.id,
      deleted_at: { $exists: false }
    }
  );

  if (!calendarEvent) {
    throw Boom.notFound(ctx.translateError('CALENDAR_EVENT_DOES_NOT_EXIST'));
  }

  // Check if over quota
  const { isOverQuota } = await Aliases.isOverQuota(
    {
      id: ctx.state.session.user.alias_id,
      domain: ctx.state.session.user.domain_id,
      locale: ctx.locale
    },
    0,
    ctx.client
  );
  if (isOverQuota)
    throw Boom.forbidden(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale));

  // Update calendar if specified
  if (body.calendar_id !== undefined) {
    const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
      calendarId: body.calendar_id
    });

    if (!calendar) {
      throw Boom.badRequest(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
    }

    calendarEvent.calendar = calendar._id;
  }

  // Update iCal data if specified
  if (body.ical !== undefined) {
    calendarEvent.ical = body.ical;
  }

  // Set db virtual helpers
  calendarEvent.instance = ctx.instance;
  calendarEvent.session = ctx.state.session;
  calendarEvent.isNew = false;

  await calendarEvent.save();

  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    _id: calendarEvent.calendar
  });

  if (!calendar)
    throw Boom.badRequest(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));

  ctx.body = json(calendarEvent, calendar);

  // Update storage in background (calendar event size may have changed)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { calendarEvent, session: ctx.state.session })
    );
}

async function remove(ctx) {
  // Validate calendar event ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_INVALID_ID'));

  const calendarEvent = await CalendarEvents.findOne(
    ctx.instance,
    ctx.state.session,
    {
      eventId: ctx.params.id,
      deleted_at: { $exists: false }
    }
  );

  if (!calendarEvent) {
    throw Boom.notFound(ctx.translateError('CALENDAR_EVENT_DOES_NOT_EXIST'));
  }

  // Soft delete by setting deleted_at timestamp
  calendarEvent.deleted_at = new Date();

  // Set db virtual helpers
  calendarEvent.instance = ctx.instance;
  calendarEvent.session = ctx.state.session;
  calendarEvent.isNew = false;

  await calendarEvent.save();

  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    _id: calendarEvent.calendar
  });

  if (!calendar)
    throw Boom.badRequest(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));

  ctx.body = json(calendarEvent, calendar);

  // Update storage in background (calendar event was deleted, reducing storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { calendarEvent, session: ctx.state.session })
    );
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
