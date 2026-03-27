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

  return stats;
}

module.exports = backfillCalendarDates;
