/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const isSANB = require('is-string-and-not-blank');

const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const i18n = require('#helpers/i18n');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const updateStorageUsed = require('#helpers/update-storage-used');

function json(event) {
  // Transform calendar event data for API response
  const object = {
    //
    // NOTE: we use `eventId` vs `_id` since
    //       CalDAV spec allows arbitrary ID's from clients
    //
    id: event.eventId,
    calendar_id: event.calendar.calendarId || event.calendar.toString(),
    component_type: event.componentType,
    ical: event.ical,
    deleted_at: event.deleted_at,
    created_at: event.created_at,
    updated_at: event.updated_at,
    object: event.componentType === 'VTODO' ? 'calendar_task' : 'calendar_event'
  };

  return object;
}

async function list(ctx) {
  // Validate calendar ID
  if (!isSANB(ctx.params.calendar_id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));

  // Get the calendar first to ensure it exists and user has access
  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.calendar_id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  const query = {
    calendar: calendar._id,
    deleted_at: { $exists: false }
  };

  // Filter by component type if specified
  if (ctx.query.component_type) {
    if (!['VEVENT', 'VTODO'].includes(ctx.query.component_type.toUpperCase())) {
      throw Boom.badRequest(
        ctx.translateError('CALENDAR_EVENT_INVALID_COMPONENT_TYPE')
      );
    }

    query.componentType = ctx.query.component_type.toUpperCase();
  }

  // Get calendar events with pagination
  const { results: events, count: itemCount } =
    await CalendarEvents.findAndCount(
      ctx.instance,
      ctx.state.session,
      query,
      {},
      {
        limit: ctx.query.limit,
        offset: ctx.paginate.skip,
        sort: { created_at: -1 }
      }
    );

  // Populate calendar info for each event
  for (const event of events) {
    if (event.calendar && typeof event.calendar !== 'object') {
      event.calendar = calendar;
    }
  }

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Set pagination headers
  setPaginationHeaders(
    ctx,
    pageCount,
    ctx.query.page,
    events.length,
    itemCount
  );

  ctx.body = Array.isArray(events) ? events.map((event) => json(event)) : [];
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate calendar ID
  if (!isSANB(ctx.params.calendar_id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));

  // Validate required fields
  if (!body.ical) {
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_ICAL_REQUIRED'));
  }

  // Get the calendar first to ensure it exists and user has access
  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.calendar_id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  const eventId = body.event_id || new ObjectID().toString();

  // Check if event already exists
  const existingEvent = await CalendarEvents.findOne(
    ctx.instance,
    ctx.state.session,
    { eventId, calendar: calendar._id }
  );

  if (existingEvent)
    throw Boom.conflict(ctx.translateError('CALENDAR_EVENT_ALREADY_EXISTS'));

  // check if over quota
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

  const event = await CalendarEvents.create({
    // db virtual helper
    instance: ctx.instance,
    session: ctx.state.session,

    // eventId
    eventId,

    // calendar reference
    calendar: calendar._id,

    // ical data (validation happens in model)
    ical: body.ical
  });

  // Populate calendar info
  event.calendar = calendar;

  ctx.body = json(event);

  // Update storage in background (events contribute to storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { event, session: ctx.state.session })
    );
}

async function retrieve(ctx) {
  // Validate calendar ID
  if (!isSANB(ctx.params.calendar_id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));

  // Validate event ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_INVALID_ID'));

  // Get the calendar first to ensure it exists and user has access
  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.calendar_id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  const event = await CalendarEvents.findOne(ctx.instance, ctx.state.session, {
    eventId: ctx.params.id,
    calendar: calendar._id,
    deleted_at: { $exists: false }
  });

  if (!event) {
    throw Boom.notFound(ctx.translateError('CALENDAR_EVENT_DOES_NOT_EXIST'));
  }

  // Populate calendar info
  event.calendar = calendar;

  ctx.body = json(event);
}

async function update(ctx) {
  const { body } = ctx.request;

  // Validate calendar ID
  if (!isSANB(ctx.params.calendar_id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));

  // Validate event ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_INVALID_ID'));

  // Get the calendar first to ensure it exists and user has access
  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.calendar_id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  const event = await CalendarEvents.findOne(ctx.instance, ctx.state.session, {
    eventId: ctx.params.id,
    calendar: calendar._id,
    deleted_at: { $exists: false }
  });

  if (!event) {
    throw Boom.notFound(ctx.translateError('CALENDAR_EVENT_DOES_NOT_EXIST'));
  }

  // check if over quota
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

  // Update event field
  if (body.ical !== undefined) {
    event.ical = body.ical;
  }

  // Set db virtual helpers
  event.instance = ctx.instance;
  event.session = ctx.state.session;
  event.isNew = false;

  await event.save();

  // Populate calendar info
  event.calendar = calendar;

  ctx.body = json(event);

  // Update storage in background (event size may have changed)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { event, session: ctx.state.session })
    );
}

async function remove(ctx) {
  // Validate calendar ID
  if (!isSANB(ctx.params.calendar_id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));

  // Validate event ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_EVENT_INVALID_ID'));

  // Get the calendar first to ensure it exists and user has access
  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.calendar_id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  const event = await CalendarEvents.findOne(ctx.instance, ctx.state.session, {
    eventId: ctx.params.id,
    calendar: calendar._id,
    deleted_at: { $exists: false }
  });

  if (!event) {
    throw Boom.notFound(ctx.translateError('CALENDAR_EVENT_DOES_NOT_EXIST'));
  }

  await CalendarEvents.deleteOne(ctx.instance, ctx.state.session, {
    _id: event._id
  });

  // Populate calendar info
  event.calendar = calendar;

  ctx.body = json(event);

  // Update storage in background (event was deleted, reducing storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { event, session: ctx.state.session })
    );
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
