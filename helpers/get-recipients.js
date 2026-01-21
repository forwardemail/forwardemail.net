/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pMap = require('p-map');
const safeStringify = require('fast-safe-stringify');
const { getPublicSuffix } = require('tldts');
const { isPort, isURL, isIP, isFQDN } = require('@forwardemail/validator');

const DenylistError = require('#helpers/denylist-error');
const SMTPError = require('#helpers/smtp-error');
const _ = require('#helpers/lodash');
const combineErrors = require('#helpers/combine-errors');
const config = require('#config');
const env = require('#config/env');
const getErrorCode = require('#helpers/get-error-code');
const getForwardingAddresses = require('#helpers/get-forwarding-addresses');
const getSettings = require('#helpers/get-settings');
const isDenylisted = require('#helpers/is-denylisted');
const isSilentBanned = require('#helpers/is-silent-banned');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const parseUsername = require('#helpers/parse-username');
const { encrypt } = require('#helpers/encrypt-decrypt');

async function getRecipients(session, scan) {
  const bounces = [];
  const normalized = [];
  const imap = [];

  // lookup forwarding recipients recursively
  let recipients = await pMap(
    session.envelope.rcptTo,

    async (to) => {
      let port = 25;
      try {
        let hasAdultContentProtection = true;
        let hasPhishingProtection = true;
        let hasExecutableProtection = true;
        let hasVirusProtection = true;
        let customAllowlist = [];
        let customDenylist = [];
        let webhookKey;
        // lookup the port (e.g. if `forward-email-port=` or custom set on the domain)
        const domain = parseHostFromDomainOrAddress(to.address);

        // attempt to get cached value for domain
        let value = false;
        try {
          value = await this.client.get(`v1_settings:${domain}`);
          if (value) value = JSON.parse(value);
        } catch (err) {
          value = false;
          logger.fatal(err);
        }

        let body;
        if (value) {
          body = value;
        } else {
          try {
            body = await getSettings(domain, this.resolver);

            this.client
              .set(`v1_settings:${domain}`, safeStringify(body), 'PX', ms('1h'))
              .then()
              .catch((err) => logger.fatal(err));
          } catch (err) {
            logger.debug(err);
          }
        }

        // body is an Object
        if (_.isObject(body)) {
          // `port` (String) - a valid port number, defaults to 25
          if (isSANB(body.port) && isPort(body.port) && body.port !== '25') {
            port = Number.parseInt(body.port, 10);
            logger.debug(`Custom port for ${to.address} detected`, {
              port,
              session
            });
          }

          // Spam Scanner boolean values adjusted by user in Advanced Settings page
          if (_.isBoolean(body.has_adult_content_protection))
            hasAdultContentProtection = body.has_adult_content_protection;

          if (_.isBoolean(body.has_phishing_protection))
            hasPhishingProtection = body.has_phishing_protection;

          if (_.isBoolean(body.has_executable_protection))
            hasExecutableProtection = body.has_executable_protection;

          if (_.isBoolean(body.has_virus_protection))
            hasVirusProtection = body.has_virus_protection;

          if (Array.isArray(body.allowlist)) customAllowlist = body.allowlist;

          if (Array.isArray(body.denylist)) customDenylist = body.denylist;

          if (isSANB(body.webhook_key)) webhookKey = body.webhook_key;

          //
          // Check if domain requires TLS for inbound connections
          // If require_tls_inbound is enabled and connection is not secure, reject
          //
          if (body.require_tls_inbound === true && !session.secure) {
            throw new SMTPError(
              `Domain ${domain} requires TLS for inbound connections. Please use STARTTLS or connect to port 465.`,
              {
                responseCode: 530,
                ignoreHook: true
              }
            );
          }
        }

        //
        // NOTE: here is where we check if Spam Scanner settings
        // were either enabled or disabled, and if they were enabled
        // and the respective policy did not pass, then throw that error as a bounce
        //
        if (_.isObject(scan)) {
          //
          // NOTE: until we are confident with the accuracy
          // we are not utilizing classification right now
          // however we still want to use other detections
          //
          const messages = [];

          if (
            hasPhishingProtection &&
            _.isArray(scan?.results?.phishing) &&
            !_.isEmpty(scan.results.phishing)
          ) {
            for (const message of scan.results.phishing) {
              // if we're not filtering for adult-related content then continue early

              if (
                !hasAdultContentProtection &&
                message.includes('adult-related content')
              )
                continue;

              if (message.includes('adult-related content'))
                messages.push(
                  'Links were detected that may contain adult-related content'
                );
              else
                messages.push(
                  'Links were detected that may contain phishing and/or malware'
                );
              //
              // NOTE: we do not want to push the link in the response
              //       (otherwise bounce emails may never arrive to sender)
              //
              // messages.push(message);
            }
          }

          if (
            hasExecutableProtection &&
            _.isArray(scan?.results?.executables) &&
            !_.isEmpty(scan.results.executables)
          ) {
            for (const message of scan.results.executables.slice(0, 2)) {
              messages.push(message);
            }

            messages.push(
              `You may want to re-send your attachment in a compressed archive format (e.g. a ZIP file)`
            );
          }

          if (
            hasVirusProtection &&
            _.isArray(scan?.results?.viruses) &&
            !_.isEmpty(scan.results.viruses)
          ) {
            for (const message of scan.results.viruses.slice(0, 2)) {
              messages.push(message);
            }
          }

          if (messages.length > 0) {
            messages.push(
              'For more information on Spam Scanner visit https://spamscanner.net'
            );
            const err = new SMTPError(_.uniq(messages).join(' '), {
              responseCode: 554
            });

            //
            // NOTE: we don't scan messages going to abuse@forwardemail.net
            //
            if (to.address.toLowerCase() === config.abuseEmail) {
              err.isCodeBug = true;
              logger.fatal(err, { session, resolver: this.resolver });
            } else {
              throw err;
            }
          }
        }

        //
        // NOTE: section is for a domain's specific allowlist and denylist
        //
        // has to match at least one of the following for allowlist to pass:
        // - session.remoteAddress
        // - session.resolvedClientHostname
        // - session.resolvedRootClientHostname
        // - session.originalFromAddress
        //
        if (customAllowlist.length > 0) {
          let pass = false;
          if (customAllowlist.includes(session.remoteAddress)) pass = true;
          else if (
            session.resolvedClientHostname &&
            customAllowlist.includes(session.resolvedClientHostname)
          )
            pass = true;
          else if (session.resolvedRootClientHostname) {
            if (
              customAllowlist.includes(session.resolvedRootClientHostname) ||
              session.resolvedRootClientHostname === env.WEB_HOST
            ) {
              pass = true;
            } else {
              // Check wildcard TLD
              const tld = getPublicSuffix(session.resolvedRootClientHostname);
              if (tld && customAllowlist.includes(`*.${tld}`)) pass = true;
            }
          } else if (
            session.originalFromAddress &&
            customAllowlist.includes(session.originalFromAddress)
          )
            pass = true;
          if (!pass && session.originalFromAddress) {
            // check if the domain or root portion of the `session.originalFromAddress` matches
            const domain = session.originalFromAddress.split('@')[1];
            const root = parseRootDomain(domain);
            if (customAllowlist.includes(domain)) pass = true;
            else if (customAllowlist.includes(root)) pass = true;
            else {
              // Check wildcard TLD
              const tld = getPublicSuffix(domain);
              if (tld && customAllowlist.includes(`*.${tld}`)) pass = true;
            }
          }

          if (!pass)
            throw new SMTPError(
              `Your IP address, client hostname, or From header is not yet allowlisted by admins of ${domain}`,
              { ignore_hook: true }
            );
        }

        if (customDenylist.length > 0) {
          let pass = true;

          // Check IP address
          if (customDenylist.includes(session.remoteAddress)) pass = false;

          // Check resolved client hostname
          if (
            pass &&
            session.resolvedClientHostname &&
            customDenylist.includes(session.resolvedClientHostname)
          )
            pass = false;

          // Check resolved root client hostname
          if (pass && session.resolvedRootClientHostname) {
            if (customDenylist.includes(session.resolvedRootClientHostname)) {
              pass = false;
            } else {
              // Check wildcard TLD
              const tld = getPublicSuffix(session.resolvedRootClientHostname);
              if (tld && customDenylist.includes(`*.${tld}`)) pass = false;
            }
          }

          // Check original From address (email)
          if (
            pass &&
            session.originalFromAddress &&
            customDenylist.includes(session.originalFromAddress)
          )
            pass = false;

          // Check domain and root domain of From address
          if (pass && session.originalFromAddress) {
            const domain = session.originalFromAddress.split('@')[1];
            const root = parseRootDomain(domain);
            if (customDenylist.includes(domain)) pass = false;
            else if (customDenylist.includes(root)) pass = false;
            else {
              // Check wildcard TLD
              const tld = getPublicSuffix(domain);
              if (tld && customDenylist.includes(`*.${tld}`)) pass = false;
            }
          }

          if (!pass)
            throw new SMTPError(
              `Your IP address, client hostname, or From header was denylisted by admins of ${domain}`,
              { ignore_hook: true }
            );
        }

        // get all forwarding addresses for individual address
        const {
          aliasIds,
          addresses,
          hasIMAP,
          aliasPublicKey,
          aliasSmimeCertificate,
          vacationResponder,
          ignored,
          softRejected,
          hardRejected
        } = await getForwardingAddresses.call(
          this,
          to.address,
          [],
          session.originalFromAddressRootDomain === env.WEB_HOST,
          session
        );

        if (ignored)
          return {
            address: to.address,
            addresses: [],
            ignored: true,
            hasIMAP: false,
            aliasPublicKey: false,
            aliasSmimeCertificate: false,
            vacationResponder: false
          };

        if (softRejected)
          return {
            address: to.address,
            addresses: [],
            ignored: false,
            hasIMAP: false,
            aliasPublicKey: false,
            aliasSmimeCertificate: false,
            vacationResponder: false,
            softRejected: true
          };

        if (hardRejected)
          return {
            address: to.address,
            addresses: [],
            ignored: false,
            hasIMAP: false,
            aliasPublicKey: false,
            aliasSmimeCertificate: false,
            vacationResponder: false,
            hardRejected: true
          };

        return {
          address: to.address,
          addresses,
          port,
          hasIMAP,
          aliasPublicKey,
          aliasSmimeCertificate,
          vacationResponder,
          aliasIds,
          webhookKey
        };
      } catch (err) {
        if (err.notConfigured && to.srs) {
          return {
            address: to.address,
            addresses: [to.address],
            port: 25,
            hasIMAP: false,
            aliasPublicKey: false,
            aliasSmimeCertificate: false,
            vacationResponder: false,
            // TODO: only do this if MX server of sender used our service
            srs: true
          };
        }

        logger.warn(err, { session, resolver: this.resolver });
        err.responseCode = getErrorCode(err);
        bounces.push({
          address: to.address,
          err
        });
      }
    },
    { concurrency: config.concurrency }
  );

  //
  // TODO: look into this note below (?)
  //
  // NOTE: if user has both plain TXT and encrypted
  //       then only the first match will be used
  //       (probably unwanted, we should just merge)
  //
  // flatten the recipients and make them unique
  recipients = _.uniqBy(_.compact(recipients.flat()), 'address');

  // TODO: we can probably remove now
  // go through recipients and if we have a user+xyz@domain
  // AND we also have user@domain then honor the user@domain only
  // (helps to alleviate bulk spam with services like Gmail)
  for (const recipient of recipients) {
    const filtered = [];
    for (const address of recipient.addresses) {
      if (!address.includes('+')) {
        filtered.push(address);
        continue;
      }

      if (
        !recipient.addresses.includes(
          `${parseUsername(address)}@${parseHostFromDomainOrAddress(address)}`
        )
      )
        filtered.push(address);
    }

    recipient.addresses = filtered;
  }

  let hasSilentBannedRecipients = false;

  recipients = await pMap(
    recipients,
    async (recipient) => {
      const errors = [];
      const addresses = [];
      await pMap(
        recipient.addresses,
        async (address) => {
          try {
            let denylistErr;

            const [silentBanned] = await Promise.all([
              // check if the recipient was silent banned
              isSilentBanned(address, this.client, this.resolver),
              // check if the address was denylisted
              (async () => {
                try {
                  await isDenylisted(address, this.client, this.resolver);
                } catch (err) {
                  if (err.name !== 'DenylistError') throw err;
                  err.message = `The address ${
                    recipient.address
                  } is denylisted by ${
                    config.urls.web
                  } ; To request removal, you must visit ${
                    config.urls.web
                  }/denylist?q=${encrypt(err.denylistValue)} ;`;
                  err.address = address;
                  denylistErr = err;
                }
              })()
            ]);

            if (silentBanned) {
              hasSilentBannedRecipients = true;
              // logger.debug('silent banned', {
              //   session,
              //   value: address.toLowerCase()
              // });
              return;
            }

            if (denylistErr) throw denylistErr;

            // if it was a URL webhook then return early
            if (isURL(address, config.isURLOptions)) {
              addresses.push({ to: address, is_webhook: true });
            } else if (isIP(address)) {
              // if it was an IP or FQDN then rewrite it (since it's a catch-all)
              addresses.push({
                to: `${parseUsername(recipient.address)}@[${address}]`,
                host: address
              });
            } else if (isFQDN(address)) {
              // if it was an IP or FQDN then rewrite it (since it's a catch-all)
              addresses.push({
                to: `${parseUsername(recipient.address)}@${address}`,
                host: address
              });
            } else {
              addresses.push({
                to: address,
                host: parseHostFromDomainOrAddress(address)
              });
            }
          } catch (err) {
            // TODO: e.g. if the MX servers don't exist for recipient
            // then obviously there should be an error
            logger.warn(err, { session, resolver: this.resolver });
            errors.push(err);
          }
        },
        { concurrency: config.concurrency }
      );

      // map it back
      recipient.addresses = addresses;

      // TODO: how does work with IMAP (?)
      // custom port support
      if (recipient.addresses.length === 0 && recipient.port !== 25) {
        recipient.addresses.push({
          to: recipient.address,
          host: parseHostFromDomainOrAddress(recipient.address)
        });
      }

      if (recipient.addresses.length > 0 || recipient.hasIMAP) return recipient;
      if (errors.length === 0) return;
      for (const err of errors) {
        logger.warn(err, { session, resolver: this.resolver });
      }

      const err = combineErrors(errors);
      if (errors.some((err) => err instanceof DenylistError))
        err.name = 'DenylistError';
      // TODO: rewrite `err.response` and `err.message` if either/both start with diagnostic code
      err.responseCode = _.sortBy(errors.map((err) => getErrorCode(err)))[0];
      bounces.push({
        address: recipient.address,
        err,
        recipient
      });
    },
    { concurrency: config.concurrency }
  );

  recipients = _.compact(recipients);

  if (_.isEmpty(recipients)) {
    if (_.isEmpty(bounces)) {
      // return early if silent banned recipients
      if (hasSilentBannedRecipients) return;
      throw new SMTPError('Invalid recipients', { ignore_hook: true });
    }

    // if there was only one bounce then throw it by itself
    if (bounces.length === 1) throw bounces[0].err;

    //
    // otherwise combine the bounce errors into one error
    //

    // go by lowest code (e.g. 421 retry instead of 5xx if one still hasn't sent yet)
    const errors = [];
    const codes = [];
    for (const bounce of bounces) {
      // NOTE: we also have `bounce.host` and `bounce.address` to use if needed for more verbosity
      errors.push(bounce.err);
      codes.push(getErrorCode(bounce.err));
    }

    // join the messages together
    const err = combineErrors(errors);

    //
    // NOTE: we only do this because in the web UI we render a removal button
    //       and there could be multiple RCPT TO errors and not all could be denylist
    //       (e.g. some could be Redis/Mongo, but we want to make it easy for the user)
    //
    // NOTE: `combineErrors` will additionally set `err` properties such as `err.name`
    //       on the resulting combined error object returned `err`
    //       if all of the errors being combined have the same value for `err.name`
    //
    if (errors.some((err) => err instanceof DenylistError))
      err.name = 'DenylistError';

    err.responseCode = _.sortBy(codes)[0];
    err.bounces = bounces;
    throw err;
  }

  for (const recipient of recipients) {
    // if it's ignored then don't bother
    if (recipient.ignored) continue;

    if (recipient.softRejected) {
      bounces.push({
        address: recipient.address,
        err: new SMTPError('Mailbox is disabled, try again later', {
          responseCode: 421,
          ignore_hook: true
        })
      });
      continue;
    }

    if (recipient.hardRejected) {
      bounces.push({
        address: recipient.address,
        err: new SMTPError('Mailbox is disabled', { ignore_hook: true })
      });
      continue;
    }

    // if it has imap then push it
    if (recipient.hasIMAP && recipient.aliasIds) {
      for (const aliasId of recipient.aliasIds) {
        if (
          imap.some(
            (obj) => obj.address === recipient.address && obj.id === aliasId
          )
        )
          continue;
        imap.push({
          address: recipient.address,
          id: aliasId,
          vacationResponder: recipient.vacationResponder
        });
      }
    }

    for (const address of recipient.addresses) {
      // if it's a webhook then return early
      if (address.is_webhook) {
        //
        // NOTE: we group webhooks based off their endpoint
        //       to reduce the number of requests sent across
        //
        const match = normalized.find((r) => r.webhook === address.to);

        if (match) {
          if (!match.to.includes(address.to)) match.to.push(address.to);

          if (!match.replacements[recipient.address])
            match.replacements[recipient.address] = address.to; // normal;
        } else {
          const replacements = {};
          replacements[recipient.address] = address.to; // normal;
          normalized.push({
            aliasPublicKey: recipient.aliasPublicKey,
            aliasSmimeCertificate: recipient.aliasSmimeCertificate,
            vacationResponder: recipient.vacationResponder,
            webhookKey: recipient.webhookKey,
            webhook: address.to,
            to: [address.to],
            recipient: recipient.address,
            replacements
          });
        }

        continue;
      }

      const replacements = {};
      replacements[recipient.address] = address.to;
      normalized.push({
        aliasPublicKey: recipient.aliasPublicKey,
        aliasSmimeCertificate: recipient.aliasSmimeCertificate,
        vacationResponder: recipient.vacationResponder,
        host: address.host,
        port: recipient.port,
        recipient: recipient.address,
        to: [address.to],
        replacements,
        ...(recipient.srs ? { srs: true } : {})
      });
    }
  }

  return { bounces, normalized, imap };
}

module.exports = getRecipients;
