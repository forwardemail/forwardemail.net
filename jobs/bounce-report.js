// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const zlib = require('node:zlib');
const { Buffer } = require('node:buffer');
const { parentPort } = require('node:worker_threads');

// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const mongoose = require('mongoose');
const parseErr = require('parse-err');
const titleize = require('titleize');

const config = require('#config');
const Logs = require('#models/logs');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

function makeDelimitedString(arr) {
  // <https://stackoverflow.com/a/17808731>
  return `"${arr
    .map((a) => (a || '').toString().trim().replaceAll('"', '""'))
    .join('","')}"`;
}

// eslint-disable-next-line complexity
(async () => {
  await setupMongoose(logger);

  try {
    //
    // NOTE: we use async iterator (cursor) for performance
    // <https://mongoosejs.com/docs/api/querycursor.html#querycursor_QueryCursor-Symbol.asyncIterator>
    // <https://thecodebarbarian.com/whats-new-in-mongoose-53-async-iterators.html
    //
    const now = new Date();

    //
    // spreadsheet looks like this:
    //
    const csv = [];

    csv.push(
      makeDelimitedString([
        'Log ID',
        'Session ID',
        'Date',
        'Level',
        'Bounce Category',
        'Bounce Action',
        'Truth Source',
        'SMTP Response',
        'SMTP Code',
        'From',
        'From Allowlisted',
        'To',
        'Subject',
        'Message-ID',
        'MAIL FROM',
        'RCPT TO',
        'Client IP',
        'Client Hostname',
        'Client Allowlisted',
        'Target Host',
        'Target MX Hostname',
        'Target MX IP',
        'Target Type',
        'Opportunistic TLS',
        'Require TLS',
        'MX Hostname',
        'MX IP',
        'SPF',
        'DKIM'
      ])
    );

    const categories = [];

    const set = new Set();

    //
    // bounces for both MX servers and SMTP servers are stored in logs
    // (e.g. since we use `createSession` approach to mirror MX behavior)
    //
    for await (const log of Logs.find({
      created_at: {
        $gte: dayjs(now).subtract(4, 'hour').toDate(),
        $lte: now
      }
    })
      .sort({ created_at: 1 })
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      if (!log?.meta?.session?.id) continue;
      // add new row to spreadsheet
      csv.push(
        makeDelimitedString([
          // ID
          log.id,
          // Session ID
          log.meta.session.id,
          // Date
          dayjs(log.created_at).toISOString(),
          // Level
          log?.meta?.level,
          // Bounce Category
          log.bounce_category || 'none',
          // Bounce Action
          log?.err?.bounceInfo?.action || 'none',
          // Truth Source
          log?.err?.truthSource && log?.err?.truthSource
            ? log.err.truthSource
            : '',
          // SMTP Response
          log?.err?.response || log?.err?.message || log.message,
          // SMTP Code
          log?.err?.responseCode,
          // From
          log?.meta?.session?.originalFromAddress || '',
          // From Allowlisted
          log?.meta?.session?.isOriginalFromAddressAllowlisted
            ? 'true'
            : 'false',
          // To
          log?.err?.envelope?.to || log?.meta?.session?.headers?.To || '',
          // Subject
          log?.meta?.session?.headers && log.meta.session.headers.Subject
            ? log.meta.session.headers.Subject
            : '',
          // Message-ID
          log?.meta?.session?.headers && log.meta.session.headers['Message-ID']
            ? log.meta.session.headers['Message-ID']
            : '',
          // MAIL FROM
          log?.meta?.session?.envelope?.mailFrom?.address || '',
          // RCPT TO
          log?.meta?.session?.envelope?.rcptTo
            ? log.meta.session.envelope.rcptTo.map((to) => to.address).join(' ')
            : '',
          // Client IP
          log?.meta?.session?.remoteAddress,
          // Client Hostname
          log?.meta?.session?.resolvedClientHostname || '',
          // Client Allowlisted
          log?.meta?.session?.isAllowlisted ? 'true' : 'false',
          // Target Host
          log?.err?.target || '',
          // Target MX Hostname
          log?.err?.mx?.hostname || '',
          // Target MX IP
          log?.err?.mx?.host || '',
          // Target Type
          typeof log?.err?.mx?.ipv4 === 'boolean'
            ? log.err.mx.ipv4
              ? 'IPv4'
              : 'IPv6'
            : '',
          // Opportunistic TLS
          typeof log?.err?.opportunisticTLS === 'boolean'
            ? log.err.opportunisticTLS
              ? 'true'
              : 'false'
            : '',
          // Require TLS
          typeof log?.err?.requireTLS === 'boolean'
            ? log.err.requireTLS
              ? 'true'
              : 'false'
            : '',
          // MX Hostname
          log?.meta?.app?.hostname || '',
          // MX IP
          log?.meta?.app?.ip || '',
          // SPF
          log?.meta?.session?.spf?.status?.result || '',
          // DKIM
          log?.meta?.session?.hadAlignedAndPassingDKIM ? 'true' : 'false'
        ])
      );

      if (!Number.isFinite(categories[log.bounce_category]))
        categories[log.bounce_category] = 0;

      // generic category counter
      categories[log.bounce_category]++;

      // truth source blocklist category counter
      if (log.bounce_category === 'blocklist' && log?.err?.truthSource)
        set.add(log.err.truthSource);
    }

    // super rudimentary and simple string concatenation
    const list = [];
    for (const key of Object.keys(categories).sort()) {
      list.push(
        `<li><strong>${titleize(humanize(key))}:</strong> ${
          categories[key]
        }</li>`
      );
    }

    const message = [
      `<p>Logs from ${dayjs(now)
        .subtract(4, 'hour')
        .format('M/D/YY h:mm A')} to ${dayjs(now).format(
        'M/D/YY h:mm A z'
      )}:</p>`,
      `<ul>`,
      ...list,
      `</ul>`,
      `<p>Trusted hosts that were blocked:</p>`,
      `<ul><li>${[...set]
        .sort()
        .map((h) => `<code>${h}</code>`)
        .join('</li><li>')}</li></ul>`
    ].join('\n');

    // email the spreadsheet to admins
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `(${csv.length - 1}) Email Deliverability Logs for ${dayjs(
          now
        ).format('M/D/YY h:mm A z')} (${set.size} trusted hosts blocked)`,
        attachments: [
          {
            filename: `email-deliverability-logs-${dayjs(now).format(
              'YYYY-MM-DD-h-mm-A-z'
            )}.csv.gz`.toLowerCase(),
            content: zlib.gzipSync(Buffer.from(csv.join('\n', 'utf8')), {
              level: 9
            })
          }
        ]
      },
      locals: {
        message
      }
    });
  } catch (err) {
    await logger.error(err);
    // send an email to admins of the error
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Email Deliverability Report Issue'
      },
      locals: {
        message: `<pre><code>${JSON.stringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
