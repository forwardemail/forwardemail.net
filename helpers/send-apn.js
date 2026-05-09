/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const { setTimeout } = require('node:timers/promises');

const apn = require('@parse/node-apn');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');
const splitLines = require('split-lines');

const Aliases = require('#models/aliases');
const config = require('#config');
const getApnCerts = require('#helpers/get-apn-certs');
const logger = require('#helpers/logger');

//
// Unified Apple Push Notification helper for all three DAV-style services
// the project supports (Mail, Calendar, Contacts).  Historically this was
// three near-identical files (helpers/send-apn.js plus the now-removed
// helpers/send-apn-calendar.js and helpers/send-apn-contacts.js) which
// duplicated the provider lifecycle, the 410 unsubscribe path, the
// per-(account_id, device_token) rate-limit cache, and the topic-extraction
// logic.  All three now share this single file.
//
// Per-service differences captured in SERVICES:
//
//   * cert      -- key inside the `certs` bundle returned by getApnCerts
//   * subtopic  -- the alias.aps[].subtopic value to filter on
//   * cachePrefix -- Redis key prefix for the 1-minute send-coalescing lock
//   * errorLabel  -- label used in the "APS X failed" fatal error
//
// Exports:
//   * default    = sendApn (Mail variant with mailboxPath, used by IMAP)
//   * sendApnCalendar  -- CalDAV push entry-point
//   * sendApnContacts  -- CardDAV push entry-point
//   * sendApnForService -- low-level dispatcher used by the three above
//
// Call sites import the named exports directly via
// `const { sendApnCalendar } = require('#helpers/send-apn');` -- the old
// thin wrapper modules were intentionally deleted in v15 to avoid having
// two equivalent require paths for the same function.
//

//
// Per-service push semantics:
//
//   * cert        - key inside the `certs` bundle returned by getApnCerts
//   * subtopic    - the alias.aps[].subtopic value to filter on
//   * cachePrefix - Redis key prefix for the 1-minute send-coalescing lock
//   * errorLabel  - label used in the "APS X failed" fatal error
//   * pushType    - APNs `apns-push-type` header.  iOS Mail (XAPPLEPUSHSERVICE)
//                   uses `alert` because the iOS Mail extension surfaces a
//                   user-visible banner.  CalDAV / CardDAV pubsub pushes are
//                   silent data-only refresh signals; Apple's iOS 13+ APNs
//                   strictness drops `alert`-typed pushes that lack an
//                   `aps.alert` payload, so we send those as `background`.
//                   Reference: Apple's caldav-pubsubdiscovery.txt and the
//                   ccs-calendarserver applepush.py implementation.
//
const SERVICES = {
  Mail: {
    cert: 'Mail',
    subtopic: 'com.apple.mobilemail',
    cachePrefix: 'aps_check',
    errorLabel: 'APS failed',
    pushType: 'alert'
  },
  Calendar: {
    cert: 'Calendar',
    subtopic: 'com.apple.mobilecal',
    cachePrefix: 'aps_calendar_check',
    errorLabel: 'APS Calendar failed',
    pushType: 'background'
  },
  Contact: {
    cert: 'Contact',
    subtopic: 'com.apple.mobileaddressbook',
    cachePrefix: 'aps_contacts_check',
    errorLabel: 'APS Contacts failed',
    pushType: 'background'
  }
};

let certs;
const providers = Object.create(null);

function ensureTopic(certBundle, certKey) {
  if (certBundle[certKey].topic) return certBundle[certKey].topic;
  const cert = new crypto.X509Certificate(certBundle[certKey].certificate);
  // Mirrors the get-apn-certs helper (which already uses the same
  // splitLines(...)[0].split('UID=')[1].trim() pattern for Mail).
  certBundle[certKey].topic = splitLines(cert.subject)[0]
    .split('UID=')[1]
    .trim();
  return certBundle[certKey].topic;
}

function isProviderAlive(provider) {
  return Boolean(
    provider &&
      provider.client &&
      provider.client.session &&
      !provider.client.session.closed &&
      !provider.client.session.destroyed
  );
}

function createNote(certBundle, service, obj, options) {
  // <https://github.com/argon/push_notify/blob/05b3d8025b217694e45eab8202f3d460f9237652/lib/controller.js#L48>
  // <https://github.com/argon/push_notify/pull/6#issue-179062203>
  const note = new apn.Notification();

  // Without urlArgs the notification is delivered but never displayed.
  // <https://github.com/node-apn/node-apn/issues/638>
  note.urlArgs = [];

  // Per-service push type (see SERVICES table above).
  note.pushType = service.pushType;
  //
  // NOTE: it's not as simple as setting topic to `com.apple.mobilemail`
  // <https://lists.andrew.cmu.edu/pipermail/info-cyrus/2017-August/039743.html#:~:text=aps_topic%3A%20com.apple.mail.XServer.xxxxxxxxxxxxxxx%0A%0Aaps_topic%20is%20the%20common%20name%20take%20from%20the%20certificate.%20It%E2%80%99s%20sent%20to%20the%20mobile%20device%20so%20that%20it%20will%20match%20the%20source%20of%20the%20push%20notification%20when%20it%20arrives.>
  // note.topic = 'com.apple.mobilemail';
  //
  // instead, the topic is extracted from the common name of the certificate:
  //
  // note.topic = 'com.apple.mail.XServer.xxxxxxxxxxxxxxx';
  //
  // to extract the <UUID> portion we need to follow similar process to this
  // (but in a more automated way)
  // <https://github.com/jcvernaleo/macports-ports/blob/72f6ba4623151b6171ed2262af0bcaba88d3dd93/mail/dovecot/Portfile#L216-L247>
  //
  note.topic = certBundle[service.cert].topic;
  note.expiry = Math.floor(dayjs().add(24, 'hour').toDate().getTime() / 1000);

  //
  // Build the APNs aps payload.  `account-id` is OPTIONAL and is included
  // ONLY when iOS provided one at registration time -- never synthesise it
  // from the collection key.  Apple's iOS dataaccessd routes pushes by
  // matching aps['account-id'] against an iOS-side account UUID; an
  // unrecognised value causes the push to be silently dropped, so for
  // CalDAV/CardDAV (where iOS does not send account-id in the registration
  // POST) we omit the field entirely and let the push route by device-token
  // alone, matching Apple's ccs-calendarserver reference behaviour.
  //
  note.aps = {};
  if (obj.account_id) note.aps['account-id'] = obj.account_id;

  // Mail-only: the `m` field carries the md5 of the mailbox path so the
  // device knows which mailbox to refresh.
  // <https://github.com/freswa/dovecot-xaps-daemon/issues/39#issuecomment-2262987315>
  if (service.cert === 'Mail') {
    note.aps.m = crypto
      .createHash('md5')
      .update(options.mailboxPath || 'INBOX')
      .digest('hex');
  }

  return note;
}

async function sendApnForService(serviceName, client, id, options = {}) {
  const service = SERVICES[serviceName];
  if (!service) throw new TypeError(`Unsupported APN service: ${serviceName}`);

  const alias = await Aliases.findOne({ id }).lean().select('+aps').exec();

  if (!alias || !Array.isArray(alias.aps) || alias.aps.length === 0) return;

  //
  // Filter to the registrations that belong to this service.
  //
  // alias.aps[] may contain a mix of Mail (com.apple.mobilemail), Calendar
  // (com.apple.mobilecal) and Contacts (com.apple.mobileaddressbook)
  // entries.  Sending a Calendar push (topic = certs.Calendar.topic,
  // aps.account-id = <Mail account UUID>) to a Mail device token is
  // silently dropped by iOS dataaccessd because the topic + account-id
  // pair does not match any account on the device.  Without this filter
  // the pushes appear to be sent but never reach the user.
  //
  // For Mail we accept either an explicit subtopic match OR no subtopic
  // (legacy registrations from before subtopic enforcement -- those were
  // all Mail registrations, since Calendar/Contacts push registration
  // post-dates the subtopic field).
  //
  const registrations = alias.aps.filter((a) =>
    service.cert === 'Mail'
      ? !a.subtopic || a.subtopic === service.subtopic
      : a.subtopic === service.subtopic
  );

  if (registrations.length === 0) return;

  //
  // Long-lived cached provider (one per service).  We never call
  // `provider.shutdown(fn)` because we keep the HTTP/2 connection alive.
  //
  if (!isProviderAlive(providers[serviceName])) {
    certs = await getApnCerts(client);
    ensureTopic(certs, service.cert);
    providers[serviceName] = new apn.Provider({
      logger,
      cert: certs[service.cert].certificate,
      key: certs[service.cert].privateKey,
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L26>
      // ca: GEO_TRUST_CA,
      // rejectUnauthorized: false, // only needed if GEO_TRUST_CA passed
      requestTimeout: ms('15s'),
      production: true // always required
    });
  }

  const provider = providers[serviceName];

  await pMap(registrations, async (obj) => {
    try {
      //
      // Coalesce sends to the same registration to one per minute -- avoids
      // piling up requests during a sync storm.  We key on (device_token,
      // collection-key) because account_id is OPTIONAL for CalDAV/CardDAV
      // (iOS never sends it in the registration POST); using account_id
      // here would collapse all subscriptions for the alias into a single
      // shared lock and only one push per minute would be delivered to the
      // alias regardless of which collection changed.
      //
      const cacheTokens = [
        service.cachePrefix,
        revHash(obj.device_token || ''),
        revHash(obj.key || obj.account_id || '')
      ];
      const key = cacheTokens.join(':');
      const cache = await client.get(key);
      if (cache) return;
      await client.set(key, true, 'PX', ms('1m'));

      // Artificial 10s delay so multiple back-to-back mutations coalesce
      // into a single push (matches the pre-unification behaviour).
      await setTimeout(ms('10s'));

      const note = createNote(certs, service, obj, options);

      // <https://github.com/parse-community/node-apn/issues/114>
      const result = await provider.send(note, obj.device_token);

      // note they have commented out code at this below link for setting priority in note
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>

      // NOTE: if device returns 410 then unsubscribe on our side too
      // If the device returns 410 we unsubscribe on our side too.
      if (Array.isArray(result.failed) && result.failed.length > 0) {
        const unregisteredDeviceTokens = result.failed
          .filter((r) => Number.parseInt(r.status, 10) === 410)
          .map((r) => r.device);

        if (unregisteredDeviceTokens.length === 0) {
          const err = new TypeError(service.errorLabel);
          err.isCodeBug = true;
          err.result = result;
          logger.fatal(err);
          return;
        }

        if (
          unregisteredDeviceTokens.length !== 1 ||
          unregisteredDeviceTokens[0] !== obj.device_token
        )
          throw new TypeError(
            `Device token mismatch ${
              obj.device_token
            } vs. ${unregisteredDeviceTokens.join(', ')}`
          );

        const aliases = await Aliases.find({
          // We are unsure of the likelihood of Apple issuing two identical
          // device tokens; the pair-match filter below is the safeguard.
          'aps.device_token': obj.device_token
        })
          .select('+aps')
          .lean()
          .exec();

        await pMap(
          aliases,
          async (alias) => {
            //
            // Remove the (device_token, key) pair that returned 410.
            // Match strictly on the pair: a single physical device may
            // hold multiple subscriptions on this alias (one per
            // calendar/addressbook), so we must not unsubscribe siblings
            // that share the device_token but identify a different
            // collection.  account_id is optional and not always present.
            //
            await Aliases.findByIdAndUpdate(alias._id, {
              $set: {
                aps: alias.aps.filter(
                  (a) =>
                    !(a.device_token === obj.device_token && a.key === obj.key)
                )
              }
            });
          },
          { concurrency: config.concurrency }
        );
      } else {
        // Re-send the note 20s later as a belt-and-braces refresh.
        await setTimeout(ms('20s'));
        const note = createNote(certs, service, obj, options);
        provider
          .send(note, obj.device_token)
          .then()
          .catch((err) => logger.fatal(err));
      }
    } catch (err) {
      logger.fatal(err, { obj });
    }
  });
}

// Backward-compatible default export: Mail push with optional mailboxPath.
async function sendApn(client, id, mailboxPath = 'INBOX') {
  return sendApnForService('Mail', client, id, { mailboxPath });
}

async function sendApnCalendar(client, id) {
  return sendApnForService('Calendar', client, id);
}

async function sendApnContacts(client, id) {
  return sendApnForService('Contact', client, id);
}

// Default export remains `sendApn` (Mail) for full backward compatibility
// with `require('#helpers/send-apn')` call sites.  Named helpers are
// attached to the function for code that wants to switch on service.
//
// `createNote` and `SERVICES` are exported as test-only surface so unit
// tests can verify the per-service pushType, the conditional account-id
// payload, and the SERVICES table without mounting an APN provider.
sendApn.sendApn = sendApn;
sendApn.sendApnCalendar = sendApnCalendar;
sendApn.sendApnContacts = sendApnContacts;
sendApn.sendApnForService = sendApnForService;
sendApn._test = { createNote, SERVICES };

module.exports = sendApn;
