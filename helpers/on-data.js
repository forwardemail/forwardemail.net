/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const bytes = require('@forwardemail/bytes');
const getStream = require('get-stream');
const pFilter = require('p-filter');
const safeStringify = require('fast-safe-stringify');
const _ = require('#helpers/lodash');

const MessageSplitter = require('#helpers/message-splitter');
const SMTPError = require('#helpers/smtp-error');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const checkSRS = require('#helpers/check-srs');
const config = require('#config');
const env = require('#config/env');
const isSilentBanned = require('#helpers/is-silent-banned');
const onDataMX = require('#helpers/on-data-mx');
const onDataSMTP = require('#helpers/on-data-smtp');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const refineAndLogError = require('#helpers/refine-and-log-error');
const updateSession = require('#helpers/update-session');

const ONE_SECOND_AFTER_UNIX_EPOCH = new Date(1000);
const MAX_BYTES = bytes(env.SMTP_MESSAGE_MAX_SIZE);

// TODO: check for `this.isClosing` before heavy/slow operations in onDataMX

async function onData(stream, _session, fn) {
  if (this.isClosing) return setImmediate(() => fn(new ServerShutdownError()));

  // store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  this.logger.debug('DATA', { session });

  try {
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });

    stream.pipe(messageSplitter);

    const body = await getStream.buffer(messageSplitter);

    if (messageSplitter.sizeExceeded)
      throw new SMTPError('Size exceeded', { responseCode: 552 });

    if (!messageSplitter.headersParsed)
      throw new SMTPError('Headers unable to be parsed');

    const { headers } = messageSplitter;

    // update session object with useful debug info for error logs
    // (also subsequently throws an error if "From" header was not valid per RFC 5322)
    await updateSession.call(this, body, headers, session);

    // prevent messages from being stuck in a redirect loop
    // <https://github.com/zone-eu/zone-mta/blob/2557a975ee35ed86e4d95d6cfe78d1b249dec1a0/plugins/core/email-bounce.js#L97>
    if (headers.get('received').length > 25)
      throw new SMTPError('Message was stuck in a redirect loop');

    // check against silent ban list
    const silentBanned = await isSilentBanned(
      session.attributes,
      this.client,
      this.resolver
    );
    if (silentBanned) return setImmediate(fn);

    //
    // filter out RCPT TO for silent banned users
    //
    const rcptTo =
      Array.isArray(session.envelope.rcptTo) &&
      session.envelope.rcptTo.length > 0
        ? await pFilter(
            //
            // NOTE: if an invalid SRS signature was specified in RCPT TO
            //       then the RCPT TO command will already throw an error (see `helpers/on-rcpt-to.js`)
            //       however there could be a delay long enough to cause invalidation of SRS
            //       in between when the RCPT TO command and the DATA command is received
            //       so we similarly thrown an error here
            //       (and also rewrite the RCPT TO as needed; since this is not possible in RCPT TO command handler in `smtp-server`)
            //
            session.envelope.rcptTo.map((to) => {
              const shouldThrow =
                parseRootDomain(parseHostFromDomainOrAddress(to.address)) ===
                env.WEB_HOST;
              //
              // TODO: we may want to take into account that MAIL FROM is rewritten to lowercase
              //       and therefore the reverse of an address like this wouldn't work (it'd return `null`)
              //       (e.g. `srs0=34cf=tv=example.com=foo@fe-bounces.example.com`)
              //       as it should get rewritten to foo@fe-bounces.example.com
              //       however because srs0 was rewritten from SRS0
              //       and because tv was rewritten from TV it is not being delivered correctly
              //
              const original = to.address;
              to.address = checkSRS(to.address, shouldThrow);
              if (original !== to.address) to.srs = true;
              return to;
            }),
            async (to) => {
              const arr = _.uniq(
                _.compact([
                  // check the TO
                  to.address,
                  // check the TO hostname
                  parseHostFromDomainOrAddress(to.address),
                  // check the TO hostname root
                  // (but only if it was not equal to the hostname)
                  parseRootDomain(parseHostFromDomainOrAddress(to.address)) ===
                  parseHostFromDomainOrAddress(to.address)
                    ? null
                    : parseRootDomain(parseHostFromDomainOrAddress(to.address))
                ]).map((str) => str.toLowerCase().trim())
              );
              if (arr.length === 0) return false;
              const silentBanned = await isSilentBanned(
                arr,
                this.client,
                this.resolver
              );
              if (!silentBanned) {
                for (const v of arr) {
                  if (!session.attributes.includes(v))
                    session.attributes.push(v);
                }
              }

              return !silentBanned;
            },
            { concurrency: config.concurrency }
          )
        : [];

    // if no RCPT TO remaining after filtering then return early
    if (rcptTo.length === 0) return setImmediate(fn);

    // rudimentary debugging for silent banned users
    // (in case someone ever reaches out that a message not delivered)
    if (rcptTo.length !== session.envelope.rcptTo.length) {
      session.hasSilentBanned = true;
      session.originalRcptTo = [...session.envelope.rcptTo];
    }

    //
    // re-assign RCPT TO with values that were not silent banned and also with SRS rewritten addresses
    // (because sometimes improperly configured servers will send a response to the MAIL FROM)
    // (which could be an SRS forwarded address, which we need to rewrite so it goes to its actual destination)
    //
    session.envelope.rcptTo = rcptTo;

    //
    // in addition to RCPT TO being incorrect due to improperly configured server sending to SRS forwarded address
    // we also need to rewrite the "To" header an rewrite any SRS forwarded addresses with their actual ones
    //
    // TODO: rewrite this later (needs DKIM/DMARC check)
    /*
    const originalToAddresses = parseAddresses(getHeaders(headers, 'to'));
    for (const obj of originalToAddresses) {
      const shouldThrow =
        parseRootDomain(parseHostFromDomainOrAddress(obj)) === env.WEB_HOST;
      // rewrite the to line
      if (checkSRS(obj, shouldThrow) !== obj)
        headers.update(
          'to',
          headers.getFirst('to').replaceAll(obj, checkSRS(obj, shouldThrow))
        );
    }
    */

    //
    // TODO: add Feedback-ID header if not exists for Google recipients to `sendEmail` function
    //       and add automated job to scrape Google Postmaster API (they have an API) for detection
    //       and abuse/spam complaint automation
    //

    if (this.constructor.name === 'SMTP') {
      // parse the date for SMTP queuing
      let date = new Date(headers.getFirst('date'));
      if (
        !date ||
        date.toString() === 'Invalid Date' ||
        date < ONE_SECOND_AFTER_UNIX_EPOCH ||
        !_.isDate(date)
      ) {
        date = new Date(session.arrivalDate);
      }

      await onDataSMTP.call(this, session, date, headers, body);
      return setImmediate(fn);
    }

    if (this.constructor.name === 'MX') {
      await onDataMX.call(this, session, headers, body);
      return setImmediate(fn);
    }

    // safeguard in case unknown constructor
    throw new TypeError('Unknown constructor');
  } catch (err) {
    // TODO: store counter here
    setImmediate(() => fn(refineAndLogError(err, session, false, this)));
  }
}

module.exports = onData;
