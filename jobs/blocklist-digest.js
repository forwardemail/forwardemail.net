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
const dayjs = require('dayjs-with-plugins');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');

const config = require('#config');
const emailHelper = require('#helpers/email');
const setupMongoose = require('#helpers/setup-mongoose');
const logger = require('#helpers/logger');
const Logs = require('#models/logs');
const {
  getIpRemovalForm,
  parseIpFromError
} = require('#helpers/get-ip-removal-forms');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

//
// MongoDB query timeout and index hints to prevent multiplanner timeout errors
//
const MAX_TIME_MS = ms('10s');

// Index hint for bounce_category + created_at queries
const BLOCKLIST_INDEX_HINT = { bounce_category: 1, domains: 1, created_at: 1 };

/**
 * Generate HTML table row for a blocklist error
 * @param {object} options - Options object
 * @param {object} options.log - Log document
 * @param {string} options.truthSource - Truth source domain
 * @param {string} options.errorMessage - Error message
 * @param {string|null} options.parsedIp - Parsed IP address from error message
 * @param {object|null} options.removalInfo - IP removal form info
 * @returns {string} - HTML table row
 */
function generateTableRow(options) {
  const { log, truthSource, errorMessage, parsedIp, removalInfo } = options;
  const logUrl = `${config.urls.web}/admin/logs/${log.id}`;
  const truncatedError =
    errorMessage.length > 200
      ? errorMessage.slice(0, 200) + '...'
      : errorMessage;

  // Get affected hostname and IP from log metadata
  const affectedHostname = log.meta?.app?.hostname || 'N/A';
  const affectedIp = log.meta?.app?.ip || 'N/A';

  let removalLink = 'N/A';
  if (removalInfo) {
    if (removalInfo.url) {
      removalLink = `<a href="${removalInfo.url}" target="_blank">${removalInfo.name}</a>`;
      if (removalInfo.contact) {
        removalLink += ` (<a href="mailto:${removalInfo.contact}">${removalInfo.contact}</a>)`;
      }
    } else if (removalInfo.contact) {
      removalLink = `<a href="mailto:${removalInfo.contact}">${removalInfo.contact}</a>`;
    } else if (removalInfo.notes) {
      removalLink = removalInfo.notes;
    }
  }

  return `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${truthSource}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${affectedHostname}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${affectedIp}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${
        parsedIp || 'N/A'
      }</td>
      <td style="padding: 8px; border: 1px solid #ddd; max-width: 300px; word-wrap: break-word;">${truncatedError}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${removalLink}</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><a href="${logUrl}" target="_blank">View Log</a></td>
    </tr>
  `;
}

(async () => {
  await setupMongoose(logger);

  try {
    const now = new Date();
    const oneHourAgo = dayjs(now).subtract(1, 'hour').toDate();

    //
    // Query for blocklist bounces with truthSource set in the past hour
    //
    const filterQuery = {
      bounce_category: 'blocklist',
      'err.truthSource': { $exists: true, $ne: null },
      created_at: {
        $gte: oneHourAgo,
        $lte: now
      }
    };

    //
    // Group by truth source and deduplicate error messages
    // Key: truthSource, Value: Map of errorMessage -> log
    // We use a composite key of truthSource + affectedHostname + affectedIp + errorMessage
    // to ensure we capture distinct errors per server
    //
    const groupedByTruthSource = new Map();
    const uniqueErrors = new Map();
    let totalLogs = 0;

    //
    // Use cursor with noCursorTimeout for better handling of large result sets
    // Added maxTimeMS and hint to prevent multiplanner timeout
    //
    // eslint-disable-next-line unicorn/no-array-callback-reference
    for await (const log of Logs.find(filterQuery)
      .hint(BLOCKLIST_INDEX_HINT)
      .maxTimeMS(MAX_TIME_MS)
      .sort({ created_at: -1 })
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      totalLogs++;

      const truthSource = log.err?.truthSource;
      if (!truthSource) continue;

      const errorMessage = log.err?.response || log.err?.message || log.message;
      if (!errorMessage) continue;

      const affectedHostname = log.meta?.app?.hostname || 'unknown';
      const affectedIp = log.meta?.app?.ip || 'unknown';

      // Create composite key for deduplication
      const compositeKey = `${truthSource}|${affectedHostname}|${affectedIp}|${errorMessage}`;

      if (!groupedByTruthSource.has(truthSource)) {
        groupedByTruthSource.set(truthSource, new Map());
      }

      // Only keep first occurrence of each distinct error per truth source + server
      if (!uniqueErrors.has(compositeKey)) {
        uniqueErrors.set(compositeKey, log);
        const errorMap = groupedByTruthSource.get(truthSource);
        errorMap.set(compositeKey, log);
      }
    }

    if (totalLogs === 0) {
      logger.info('No blocklist bounces with truthSource in the past hour');
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    //
    // Build HTML table
    //
    const tableRows = [];
    let totalDistinctErrors = 0;

    for (const [truthSource, errorMap] of groupedByTruthSource.entries()) {
      for (const [, log] of errorMap.entries()) {
        totalDistinctErrors++;
        const errorMessage =
          log.err?.response || log.err?.message || log.message;
        const parsedIp = parseIpFromError(errorMessage);
        const removalInfo = getIpRemovalForm(truthSource);
        tableRows.push(
          generateTableRow({
            log,
            truthSource,
            errorMessage,
            parsedIp,
            removalInfo
          })
        );
      }
    }

    // Skip sending email if no distinct errors after deduplication
    if (totalDistinctErrors === 0) {
      logger.info('No distinct blocklist errors after deduplication');
      if (parentPort) parentPort.postMessage('done');
      else process.exit(0);
      return;
    }

    const htmlTable = `
      <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 13px;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">Truth Source</th>
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">Affected Hostname</th>
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">Affected IP</th>
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">Blocked IP (parsed)</th>
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">Error Message</th>
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">IP Removal Form</th>
            <th style="padding: 10px 6px; border: 1px solid #ddd; text-align: left;">Log Link</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.join('')}
        </tbody>
      </table>
    `;

    //
    // Build summary with affected servers
    //
    const truthSourceCounts = [];
    const affectedServers = new Set();

    for (const [truthSource, errorMap] of groupedByTruthSource.entries()) {
      truthSourceCounts.push(
        `<li><strong>${truthSource}:</strong> ${errorMap.size} distinct error(s)</li>`
      );
      for (const [, log] of errorMap.entries()) {
        const hostname = log.meta?.app?.hostname;
        const ip = log.meta?.app?.ip;
        if (hostname && ip) {
          affectedServers.add(`${hostname} (${ip})`);
        } else if (hostname) {
          affectedServers.add(hostname);
        } else if (ip) {
          affectedServers.add(ip);
        }
      }
    }

    const affectedServersList = [...affectedServers]
      .sort()
      .map((s) => `<li><code>${s}</code></li>`)
      .join('');

    const summary = `
      <h2>Blocklist Bounce Digest</h2>
      <p><strong>Time period:</strong> ${dayjs(oneHourAgo).format(
        'M/D/YY h:mm A z'
      )} to ${dayjs(now).format('M/D/YY h:mm A z')}</p>
      <p><strong>Total logs found:</strong> ${totalLogs}</p>
      <p><strong>Distinct errors:</strong> ${totalDistinctErrors}</p>
      <p><strong>Truth sources affected:</strong> ${
        groupedByTruthSource.size
      }</p>
      <p><strong>Servers affected:</strong> ${affectedServers.size}</p>

      <h3>Affected Servers:</h3>
      <ul>${affectedServersList}</ul>

      <h3>Summary by Truth Source:</h3>
      <ul>${truthSourceCounts.join('')}</ul>

      <h3>Distinct Blocklist Errors:</h3>
    `;

    const message = summary + htmlTable;

    const subject = `(${totalDistinctErrors}) Blocklist Bounce Digest - ${dayjs(
      now
    ).format('M/D/YY h:mm A z')} (${groupedByTruthSource.size} truth sources, ${
      affectedServers.size
    } servers)`;

    //
    // Send email to security team
    //
    await emailHelper({
      template: 'alert',
      message: {
        to: config.securityEmail,
        subject
      },
      locals: {
        message
      }
    });

    logger.info(
      `Blocklist digest sent: ${totalDistinctErrors} distinct errors from ${groupedByTruthSource.size} truth sources affecting ${affectedServers.size} servers`
    );
  } catch (err) {
    await logger.error(err);
    // Send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Blocklist Digest Job Error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
