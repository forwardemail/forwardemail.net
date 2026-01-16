/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Builder } = require('json-sql-enhanced');

const logger = require('#helpers/logger');

const builder = new Builder({ bufferAsNative: true });

//
// Add buffer time to be safe (extended to catch any delayed syncs):
//
const BAD_WINDOW_START = new Date('2026-01-07T10:00:00.000Z');
const BAD_WINDOW_END = new Date('2026-01-08T23:00:00.000Z');

/**
 * Fix CalDAV href values and restore soft-deleted events from the bad patch window.
 *
 * The bad patch caused two issues:
 * 1. Set href to constructed values that don't match original URLs Apple cached
 * 2. Caused Apple to delete events due to URL mismatch during sync
 *
 * This migration:
 * 1. Clears href for events modified during the bad window
 * 2. Restores events that were soft-deleted during the bad window
 *
 * @param {Object} instance - The server instance (IMAP, SQLite, etc.)
 * @param {Object} session - The user session with db connection
 * @returns {Object} Stats about the migration
 */
async function fixCalDAVHref(instance, session) {
  const stats = {
    hrefCleared: 0,
    eventsRestored: 0
  };

  try {
    //
    // Part 1: Clear bad href values
    //
    // Find events that have href set and were updated during the bad window.
    // We use updated_at because the bad patch updated events when they were
    // accessed (getEventsForCalendar, getEvent, updateEvent, deleteEvent).
    //
    const clearHrefSql = builder.build({
      type: 'update',
      table: 'CalendarEvents',
      condition: {
        href: { $ne: null },
        updated_at: {
          $gte: BAD_WINDOW_START.toISOString(),
          $lte: BAD_WINDOW_END.toISOString()
        }
      },
      modifier: {
        href: null
      }
    });

    let hrefResult;
    if (session.db.wsp) {
      hrefResult = await instance.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', clearHrefSql.query],
          ['run', clearHrefSql.values]
        ]
      });
      stats.hrefCleared = hrefResult?.changes || 0;
    } else {
      hrefResult = session.db
        .prepare(clearHrefSql.query)
        .run(clearHrefSql.values);
      stats.hrefCleared = hrefResult?.changes || 0;
    }

    //
    // Part 2: Restore soft-deleted events
    //
    // Events that were soft-deleted during the bad window were likely
    // deleted due to the sync issue, not intentionally by the user.
    // Restore them by clearing deleted_at.
    //
    const restoreEventsSql = builder.build({
      type: 'update',
      table: 'CalendarEvents',
      condition: {
        deleted_at: {
          $gte: BAD_WINDOW_START.toISOString(),
          $lte: BAD_WINDOW_END.toISOString()
        }
      },
      modifier: {
        deleted_at: null
      }
    });

    let restoreResult;
    if (session.db.wsp) {
      restoreResult = await instance.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', restoreEventsSql.query],
          ['run', restoreEventsSql.values]
        ]
      });
      stats.eventsRestored = restoreResult?.changes || 0;
    } else {
      restoreResult = session.db
        .prepare(restoreEventsSql.query)
        .run(restoreEventsSql.values);
      stats.eventsRestored = restoreResult?.changes || 0;
    }

    console.log('restored events', session.user.username, stats.eventsRestored);
  } catch (err) {
    err.isCodeBug = true;
    logger.error(err, { session });
  }

  return stats;
}

module.exports = { fixCalDAVHref, BAD_WINDOW_START, BAD_WINDOW_END };
