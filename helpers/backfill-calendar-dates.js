/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const ICAL = require('ical.js');
const { Builder } = require('json-sql-enhanced');
const logger = require('#helpers/logger');

const builder = new Builder({ bufferAsNative: true });

/**
 * Backfill dtstart, dtend, and is_recurring columns for CalendarEvents
 * that were created before these columns were added to the schema.
 *
 * This migration loads events that have ical data but no dtstart value,
 * parses the ICS to extract date fields and recurrence info, then
 * updates each row in place.  It runs once per alias (gated by a Redis
 * key in getDatabase) and is idempotent.
 *
 * @param {Object} instance - The server instance (IMAP, SQLite, CalDAV, etc.)
 * @param {Object} session  - The user session with db connection
 * @returns {Object} Stats about the migration { updated, skipped, errors }
 */
async function backfillCalendarDates(instance, session) {
  const stats = {
    updated: 0,
    skipped: 0,
    errors: 0
  };

  try {
    //
    // Find all CalendarEvents rows where dtstart IS NULL and ical IS NOT NULL.
    // These are legacy rows created before the schema migration.
    //
    const selectSql = builder.build({
      type: 'select',
      table: 'CalendarEvents',
      condition: {
        dtstart: null,
        ical: { $ne: null }
      },
      fields: ['_id', 'ical']
    });

    let rows;
    if (session.db.wsp) {
      rows = await instance.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', selectSql.query],
          ['all', selectSql.values]
        ]
      });
      if (!Array.isArray(rows)) rows = [];
    } else {
      rows = session.db.prepare(selectSql.query).all(selectSql.values);
    }

    if (rows.length === 0) return stats;

    for (const row of rows) {
      try {
        if (!row.ical) {
          stats.skipped++;
          continue;
        }

        const parsed = ICAL.parse(row.ical);
        if (!parsed || parsed.length === 0) {
          stats.skipped++;
          continue;
        }

        const comp = new ICAL.Component(parsed);
        const primary =
          comp.getFirstSubcomponent('vevent') ||
          comp.getFirstSubcomponent('vtodo');

        if (!primary) {
          stats.skipped++;
          continue;
        }

        // Extract dtstart
        const dtstartProp = primary.getFirstPropertyValue('dtstart');
        const dtstart =
          dtstartProp && dtstartProp instanceof ICAL.Time
            ? dtstartProp.toJSDate().toISOString()
            : null;

        // Extract dtend (VEVENT) or due (VTODO)
        const dtendProp =
          primary.getFirstPropertyValue('dtend') ||
          primary.getFirstPropertyValue('due');
        const dtend =
          dtendProp && dtendProp instanceof ICAL.Time
            ? dtendProp.toJSDate().toISOString()
            : null;

        // Check for recurrence
        const hasRrule = primary.getFirstProperty('rrule');
        const hasRdate = primary.getFirstProperty('rdate');
        const isRecurring = hasRrule || hasRdate ? 1 : 0;

        // Also detect componentType if missing
        const hasVevent = Boolean(comp.getFirstSubcomponent('vevent'));
        const hasVtodo = Boolean(comp.getFirstSubcomponent('vtodo'));
        let componentType = 'VEVENT';
        if (hasVtodo && !hasVevent) componentType = 'VTODO';

        // Build the update — only set fields that we extracted
        const modifier = { is_recurring: isRecurring };
        if (dtstart) modifier.dtstart = dtstart;
        if (dtend) modifier.dtend = dtend;
        // Also backfill componentType if it was never set
        modifier.componentType = componentType;

        const updateSql = builder.build({
          type: 'update',
          table: 'CalendarEvents',
          condition: { _id: row._id },
          modifier
        });

        if (session.db.wsp) {
          await instance.wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', updateSql.query],
              ['run', updateSql.values]
            ]
          });
        } else {
          session.db.prepare(updateSql.query).run(updateSql.values);
        }

        stats.updated++;
      } catch (err) {
        stats.errors++;
        logger.warn(err, {
          eventId: row._id,
          session
        });
      }
    }
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err, { session });
  }

  //
  // Phase 2: Normalize ICS line endings to CRLF (RFC 5545 Section 3.1).
  // Some events were stored with bare LF which causes parsing failures
  // in strict CalDAV clients like iOS Calendar.
  //
  try {
    const lfSql = builder.build({
      type: 'select',
      table: 'CalendarEvents',
      condition: { ical: { $ne: null } },
      fields: ['_id', 'ical']
    });

    let lfRows;
    if (session.db.wsp) {
      lfRows = await instance.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', lfSql.query],
          ['all', lfSql.values]
        ]
      });
      if (!Array.isArray(lfRows)) lfRows = [];
    } else {
      lfRows = session.db.prepare(lfSql.query).all(lfSql.values);
    }

    for (const row of lfRows) {
      try {
        if (!row.ical || typeof row.ical !== 'string') continue;
        // Check if the ICS contains bare LF (not preceded by CR)
        if (!/(?<!\r)\n/.test(row.ical)) continue;
        // Normalize: first collapse any existing CRLF to LF, then convert all LF to CRLF
        const normalized = row.ical
          .replace(/\r\n/g, '\n')
          .replace(/\n/g, '\r\n');
        if (normalized === row.ical) continue;
        const updateSql = builder.build({
          type: 'update',
          table: 'CalendarEvents',
          condition: { _id: row._id },
          modifier: { ical: normalized }
        });

        if (session.db.wsp) {
          await instance.wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', updateSql.query],
              ['run', updateSql.values]
            ]
          });
        } else {
          session.db.prepare(updateSql.query).run(updateSql.values);
        }

        stats.updated++;
      } catch (err) {
        stats.errors++;
        logger.warn(err, { eventId: row._id, phase: 'ics-crlf-normalize' });
      }
    }
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err, { session, phase: 'ics-crlf-normalize' });
  }

  //
  // Phase 3: Remove duplicate events (same eventId + calendar).
  // Duplicates can occur when concurrent PUT requests race past the
  // findOne check in createEvent.  Keep the most recently updated row.
  //
  try {
    const dupSql = `
      SELECT "eventId", "calendar", COUNT(*) as cnt
      FROM "CalendarEvents"
      GROUP BY "eventId", "calendar"
      HAVING COUNT(*) > 1
    `;

    let dupRows;
    if (session.db.wsp) {
      dupRows = await instance.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', dupSql],
          ['all', []]
        ]
      });
      if (!Array.isArray(dupRows)) dupRows = [];
    } else {
      dupRows = session.db.prepare(dupSql).all();
    }

    for (const dup of dupRows) {
      try {
        // Find all rows for this eventId + calendar, ordered by updated_at DESC
        const findSql = builder.build({
          type: 'select',
          table: 'CalendarEvents',
          condition: {
            eventId: dup.eventId,
            calendar: dup.calendar
          },
          sort: { updated_at: -1 }
        });

        let allDups;
        if (session.db.wsp) {
          allDups = await instance.wsp.request({
            action: 'stmt',
            session: { user: session.user },
            stmt: [
              ['prepare', findSql.query],
              ['all', findSql.values]
            ]
          });
          if (!Array.isArray(allDups)) allDups = [];
        } else {
          allDups = session.db.prepare(findSql.query).all(findSql.values);
        }

        // Keep the first (most recently updated), delete the rest
        if (allDups.length <= 1) continue;
        const idsToDelete = allDups.slice(1).map((r) => r._id);
        for (const id of idsToDelete) {
          const delSql = builder.build({
            type: 'remove',
            table: 'CalendarEvents',
            condition: { _id: id }
          });

          if (session.db.wsp) {
            await instance.wsp.request({
              action: 'stmt',
              session: { user: session.user },
              stmt: [
                ['prepare', delSql.query],
                ['run', delSql.values]
              ]
            });
          } else {
            session.db.prepare(delSql.query).run(delSql.values);
          }
        }

        stats.updated += idsToDelete.length;
        logger.info('Removed duplicate calendar events', {
          eventId: dup.eventId,
          calendar: dup.calendar,
          removed: idsToDelete.length
        });
      } catch (err) {
        stats.errors++;
        logger.warn(err, {
          eventId: dup.eventId,
          calendar: dup.calendar,
          phase: 'dedup'
        });
      }
    }
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err, { session, phase: 'dedup' });
  }

  //
  // Phase 4: Create a unique index on (eventId, calendar) to prevent
  // future duplicates at the database level.  This must run AFTER
  // deduplication (Phase 3) or it will fail if duplicates still exist.
  //
  try {
    const createIdxSql =
      'CREATE UNIQUE INDEX IF NOT EXISTS "CalendarEvents_eventId_calendar" ' +
      'ON "CalendarEvents" ("eventId", "calendar")';

    if (session.db.wsp) {
      await instance.wsp.request({
        action: 'stmt',
        session: { user: session.user },
        stmt: [
          ['prepare', createIdxSql],
          ['run', []]
        ]
      });
    } else {
      session.db.prepare(createIdxSql).run();
    }
  } catch (err) {
    // Index may already exist — that's fine
    if (!err.message.includes('already exists')) {
      err.isCodeBug = true;
      logger.fatal(err, { session, phase: 'unique-index' });
    }
  }

  return stats;
}

module.exports = backfillCalendarDates;
