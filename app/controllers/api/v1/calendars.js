/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const falso = require('@ngneat/falso');
const isSANB = require('is-string-and-not-blank');

const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const config = require('#config');
const i18n = require('#helpers/i18n');
const { buildICS } = require('#helpers/send-calendar-email');
const setPaginationHeaders = require('#helpers/set-pagination-headers');
const updateStorageUsed = require('#helpers/update-storage-used');

function json(calendar) {
  // Transform calendar data for API response
  const object = {
    //
    // NOTE: we use `calendarId` vs `_id` since
    //       CalDAV spec allows arbitrary ID's from clients
    //
    id: calendar.calendarId,
    name: calendar.name,
    description: calendar.description,
    color: calendar.color,
    timezone: calendar.timezone,
    order: calendar.order,
    created_at: calendar.created_at,
    updated_at: calendar.updated_at,
    object: 'calendar'
  };

  return object;
}

async function list(ctx) {
  const query = {};

  // Get calendars with pagination
  const { results: calendars, count: itemCount } = await Calendars.findAndCount(
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

  const pageCount = Math.ceil(itemCount / ctx.query.limit);

  // Set pagination headers
  setPaginationHeaders(
    ctx,
    pageCount,
    ctx.query.page,
    calendars.length,
    itemCount
  );

  ctx.body = Array.isArray(calendars)
    ? calendars.map((calendar) => json(calendar))
    : [];
}

async function create(ctx) {
  const { body } = ctx.request;

  // Validate required fields
  if (!body.name) {
    throw Boom.badRequest(ctx.translateError('CALENDAR_NAME_REQUIRED'));
  }

  const calendarId = body.calendar_id || new ObjectID().toString();

  // Check if calendar already exists
  let existingCalendar = await Calendars.findOne(
    ctx.instance,
    ctx.state.session,
    { calendarId }
  );

  //
  // TODO: should we be preventing two calendars with same name?
  //       (this is against the spec but I feel like most users using the API would expect no duplicate names)
  //
  if (!existingCalendar)
    existingCalendar = await Calendars.findOne(
      ctx.instance,
      ctx.state.session,
      { name: body.name }
    );

  if (existingCalendar)
    throw Boom.conflict(ctx.translateError('CALENDAR_ALREADY_EXISTS'));

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

  const calendar = await Calendars.create({
    // db virtual helper
    instance: ctx.instance,
    session: ctx.state.session,

    // calendarId
    calendarId,

    // calendar obj
    name: body.name,
    description: body.description || config.urls.web,
    color: body.color || falso.randHex(),
    order: body.order || 0,
    prodId: `//forwardemail.net//caldav//${ctx.locale.toUpperCase()}`,
    timezone: body.timezone || ctx.state.session.user.timezone || 'UTC',
    url: config.urls.web,
    readonly: false,
    synctoken: `${config.urls.web}/ns/sync-token/1`
  });

  ctx.body = json(calendar);

  // Update storage in background (calendars contribute to storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { calendar, session: ctx.state.session })
    );
}

async function retrieve(ctx) {
  // Validate calendar ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));
  // if (!ObjectID.isValid(ctx.params.id)) {
  //   throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));
  // }

  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  ctx.body = json(calendar);
}

async function update(ctx) {
  const { body } = ctx.request;

  // Validate calendar ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));
  // if (!ObjectID.isValid(ctx.params.id)) {
  //   throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));
  // }

  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
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

  // Update calendar fields
  if (body.name !== undefined) {
    // Check if new name conflicts with existing calendar
    if (body.name !== calendar.name) {
      const existingCalendar = await Calendars.findOne(
        ctx.instance,
        ctx.state.session,
        { name: body.name, _id: { $ne: calendar._id } }
      );

      if (existingCalendar) {
        throw Boom.conflict(ctx.translateError('CALENDAR_ALREADY_EXISTS'));
      }
    }

    calendar.name = body.name;
  }

  if (body.description !== undefined) {
    calendar.description = body.description;
  }

  if (body.color !== undefined) {
    calendar.color = body.color;
  }

  if (body.timezone !== undefined) {
    calendar.timezone = body.timezone;
  }

  if (body.order !== undefined) {
    calendar.order = body.order;
  }

  // Set db virtual helpers
  calendar.instance = ctx.instance;
  calendar.session = ctx.state.session;
  calendar.isNew = false;

  //
  // Fix corrupted synctokens before saving.
  // Production calendars may have corrupted synctokens (e.g. "/7" instead
  // of "https://forwardemail.net/ns/sync-token/7") from a prior bug in
  // bumpSyncToken. The isURL() validator on the synctoken field rejects
  // these, causing "Sync token was invalid" errors on any save() call.
  // Repair the synctoken to a valid URL format before saving.
  //
  if (
    typeof calendar.synctoken !== 'string' ||
    calendar.synctoken.trim() === '' ||
    !calendar.synctoken.startsWith('http')
  ) {
    const DEFAULT_SYNC_BASE = `${config.urls.web}/ns/sync-token`;
    const parts =
      typeof calendar.synctoken === 'string'
        ? calendar.synctoken.split('/')
        : [];
    const lastPart = parts[parts.length - 1];
    const num = Number.parseInt(lastPart, 10);
    calendar.synctoken = Number.isNaN(num)
      ? `${DEFAULT_SYNC_BASE}/1`
      : `${DEFAULT_SYNC_BASE}/${num}`;
  }

  await calendar.save();

  ctx.body = json(calendar);

  // Update storage in background (calendar size may have changed)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { calendar, session: ctx.state.session })
    );
}

async function sendCalendarDeletedBackup(ctx, calendar, calendarEvents) {
  if (!Array.isArray(calendarEvents) || calendarEvents.length === 0) return;

  const sessionUser = ctx.state.session?.user;
  if (
    !sessionUser?.username ||
    !sessionUser?.alias_id ||
    !sessionUser?.domain_id
  ) {
    ctx.logger.debug(
      'Calendar delete backup skipped due to missing user context',
      {
        calendar,
        session: ctx.state.session
      }
    );
    return;
  }

  try {
    const ics = await buildICS(ctx, calendarEvents, calendar);

    let alias;
    let domain;
    try {
      [alias, domain] = await Promise.all([
        Aliases.findOne({ id: sessionUser.alias_id })
          .populate('user')
          .lean()
          .exec(),
        Domains.findOne({ id: sessionUser.domain_id })
          .populate(
            'members.user',
            `id plan ${config.userFields.isBanned} ${config.userFields.hasVerifiedEmail} ${config.userFields.planExpiresAt} ${config.userFields.stripeSubscriptionID} ${config.userFields.paypalSubscriptionID}`
          )
          .lean()
          .exec()
      ]);
    } catch (err) {
      ctx.logger.debug(
        err,
        'Could not fetch alias/domain for calendar delete backup email, skipping send'
      );
      return;
    }

    if (!alias || !domain) {
      ctx.logger.debug(
        'Alias or domain not found for calendar delete backup email, skipping send'
      );
      return;
    }

    await Emails.queue({
      message: {
        from: sessionUser.username,
        to: sessionUser.username,
        subject: i18n.translate(
          'CALENDAR_DELETED_BACKUP',
          ctx.locale,
          calendar.name,
          calendarEvents.length
        ),
        icalEvent: {
          filename: 'calendar.ics',
          content: ics
        }
      },
      alias,
      domain,
      user: alias ? alias.user : undefined,
      date: new Date()
    });
  } catch (err) {
    ctx.logger.fatal(err, {
      calendar,
      session: ctx.state.session
    });
  }
}

async function remove(ctx) {
  // Validate calendar ID
  if (!isSANB(ctx.params.id))
    throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));
  // if (!ObjectID.isValid(ctx.params.id)) {
  //   throw Boom.badRequest(ctx.translateError('CALENDAR_INVALID_ID'));
  // }

  const calendar = await Calendars.findOne(ctx.instance, ctx.state.session, {
    calendarId: ctx.params.id
  });

  if (!calendar) {
    throw Boom.notFound(ctx.translateError('CALENDAR_DOES_NOT_EXIST'));
  }

  //
  // email the user a backup of the calendar and its events
  // (e.g. in case user accidentally deleted it)
  //
  const calendarEvents = await CalendarEvents.find(
    ctx.instance,
    ctx.state.session,
    {
      calendar: calendar._id
    }
  );

  await sendCalendarDeletedBackup(ctx, calendar, calendarEvents);

  //
  // Delete all events for this calendar BEFORE deleting the calendar itself.
  // CalendarEvents.calendar has a FOREIGN KEY referencing Calendars._id,
  // and PRAGMA foreign_keys=ON is set, so deleting the calendar first
  // would violate the FK constraint and throw a 500 error.
  //
  await CalendarEvents.deleteMany(ctx.instance, ctx.state.session, {
    calendar: calendar._id
  });

  await Calendars.deleteOne(ctx.instance, ctx.state.session, {
    _id: calendar._id
  });

  ctx.body = json(calendar);

  // Update storage in background (calendar was deleted, reducing storage usage)
  updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
    .then()
    .catch((err) =>
      ctx.logger.fatal(err, { calendar, session: ctx.state.session })
    );
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
