/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const _ = require('lodash');
const addressParser = require('nodemailer/lib/addressparser');
const addrs = require('email-addresses');
const bytes = require('bytes');
const getStream = require('get-stream');
const isSANB = require('is-string-and-not-blank');
const pFilter = require('p-filter');
const safeStringify = require('fast-safe-stringify');
const { isEmail } = require('validator');

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

const MAX_BYTES = bytes(env.SMTP_MESSAGE_MAX_SIZE);

// TODO: check for `this.isClosing` before heavy/slow operations in onDataMX

// eslint-disable-next-line complexity
async function onData(stream, _session, fn) {
  if (this.isClosing) return setImmediate(() => fn(new ServerShutdownError()));

  // store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  this.logger.debug('DATA', { session });

  try {
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });

    const body = await getStream.buffer(stream.pipe(messageSplitter));

    if (messageSplitter.sizeExceeded)
      throw new SMTPError('Size exceeded', { responseCode: 552 });

    if (!messageSplitter.headersParsed)
      throw new SMTPError('Headers unable to be parsed');

    const { headers } = messageSplitter;
    const raw = Buffer.concat([headers.build(), body]);

    // update session object with useful debug info for error logs
    // (also subsequently throws an error if "From" header was not valid per RFC 5322)
    await updateSession.call(this, raw, headers, session);

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
              to.address = checkSRS(to.address, shouldThrow);
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
    let to = headers.getFirst('to');
    if (isSANB(to)) {
      let originalToAddresses =
        addrs.parseAddressList({ input: to, partial: true }) || [];
      if (originalToAddresses.length === 0)
        originalToAddresses = addrs.parseAddressList({ input: to }) || [];
      // safeguard
      if (originalToAddresses.length === 0)
        originalToAddresses = addressParser(to);
      originalToAddresses = originalToAddresses.filter(
        (addr) =>
          _.isObject(addr) &&
          isSANB(addr.address) &&
          isEmail(addr.address, { ignore_max_length: true })
      );
      for (const obj of originalToAddresses) {
        const shouldThrow =
          parseRootDomain(parseHostFromDomainOrAddress(obj.address)) ===
          env.WEB_HOST;
        // rewrite the to line
        let isModified = false;
        if (checkSRS(obj.address, shouldThrow) !== obj.address) {
          isModified = true;
          to = to.replaceAll(obj.address, checkSRS(obj.address, shouldThrow));
        }

        if (isModified) headers.update('to', to);
      }
    }

    if (this.constructor.name === 'SMTP') {
      await onDataSMTP.call(this, raw, session);
      return setImmediate(fn);
    }

    if (this.constructor.name === 'MX') {
      await onDataMX.call(this, raw, session, headers, body);
      return setImmediate(fn);
    }

    // safeguard in case unknown constructor
    throw new TypeError('Unknown constructor');
  } catch (err) {
    setImmediate(() => fn(refineAndLogError(err, session, false, this)));
  }
}

module.exports = onData;
