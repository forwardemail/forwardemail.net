/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const ObjectID = require('bson-objectid');
const falso = require('@ngneat/falso');
const isSANB = require('is-string-and-not-blank');

const Calendars = require('#models/calendars');
const config = require('#config');
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
    created_at: calendar.created_at || calendar.createdAt,
    updated_at: calendar.updated_at || calendar.updatedAt,
    object: 'calendar'
  };

  return object;
}

async function list(ctx) {
  try {
    const query = {};

    // Get calendars with pagination
    const [calendars, itemCount] = await Promise.all([
      Calendars.find(
        ctx.instance,
        ctx.state.session,
        query,
        {},
        {
          limit: ctx.query.limit,
          offset: ctx.paginate.skip,
          sort: { created_at: -1 }
        }
      ),
      Calendars.countDocuments(ctx.instance, ctx.state.session, query)
    ]);

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
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function create(ctx) {
  try {
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
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function retrieve(ctx) {
  try {
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
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function update(ctx) {
  try {
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

    await calendar.save();

    ctx.body = json(calendar);

    // Update storage in background (calendar size may have changed)
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { calendar, session: ctx.state.session })
      );
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

async function remove(ctx) {
  try {
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

    await Calendars.deleteOne(ctx.instance, ctx.state.session, {
      _id: calendar._id
    });

    ctx.body = { message: 'Calendar deleted successfully' };

    // Update storage in background (calendar was deleted, reducing storage usage)
    updateStorageUsed(ctx.state.session.user.alias_id, ctx.client)
      .then()
      .catch((err) =>
        ctx.logger.fatal(err, { calendar, session: ctx.state.session })
      );
  } catch (err) {
    ctx.logger.error(err);
    if (err.isBoom) throw err;
    throw Boom.badImplementation(err.message);
  }
}

module.exports = {
  list,
  create,
  retrieve,
  update,
  remove
};
