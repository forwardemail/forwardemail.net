/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const humanize = require('humanize-string');
const titleize = require('titleize');
const mongoose = require('mongoose');

const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const Domains = require('#models/domains');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

async function mapper(domain) {
  // safeguard
  if (!domain) return;

  // ensure it still had a non-empty array
  if (
    !Array.isArray(domain.domain_updates) ||
    domain.domain_updates.length === 0
  ) {
    logger.warn('domain had empty domain updates', { domain: domain.name });
    return;
  }

  // Use the same helper as other domain-related emails
  // This returns unique admin emails and the majority locale
  let to;
  let locale;
  try {
    const obj = await Domains.getToAndMajorityLocaleByDomain(domain);
    to = obj.to;
    locale = obj.locale;
  } catch (err) {
    logger.warn(err, { domain: domain.name });
    return;
  }

  // Build set of redacted field names for quick lookup
  const redactedFieldNames = new Set(config.domainUpdateRedactedFields);

  // Merge and map to actionable email format with localized field names
  // Include audit metadata (who made the change, IP, user-agent, timestamp)
  const domainUpdates = domain.domain_updates.map((update) => {
    const {
      fieldName,
      current,
      previous,
      redacted,
      changedAt,
      changedBy,
      changedByEmail,
      ip,
      userAgent
    } = update;
    return {
      name: fieldName,
      text: i18n.api.t({
        phrase: titleize(humanize(fieldName)),
        locale
      }),
      current: redacted ? '[REDACTED]' : current,
      previous: redacted ? '[REDACTED]' : previous,
      redacted: redacted || redactedFieldNames.has(fieldName),
      changedAt,
      changedBy,
      changedByEmail,
      ip,
      userAgent
    };
  });

  // Send single email to all admins (prevents duplicates)
  try {
    await email({
      template: 'domain-update',
      message: {
        to
      },
      locals: {
        domainUpdates,
        domain,
        locale
      }
    });

    // Clear domain updates after sending
    await Domains.findByIdAndUpdate(domain._id, {
      $set: {
        domain_updates: [],
        domain_updates_sent_at: new Date()
      }
    });
  } catch (err) {
    await logger.error(err, { domain: domain.name });
  }
}

(async () => {
  await setupMongoose(logger);

  try {
    for await (const domain of Domains.find({
      domain_updates: {
        $exists: true,
        $ne: []
      }
    })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      try {
        await mapper(domain);
      } catch (err) {
        logger.error(err);
      }
    }
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
