/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */
const crypto = require('node:crypto');
const http2 = require('node:http2');
const { Buffer } = require('node:buffer');
const { setTimeout } = require('node:timers/promises');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');

const Aliases = require('#models/aliases');
const config = require('#config');
const getApnCerts = require('#helpers/get-apn-certs');
const getApnMailCert = require('#helpers/get-apn-mail-cert');
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
//   * pushType    - APNs `apns-push-type` header.  All three services use
//                   `background` to match the dovecot-xaps-daemon reference
//                   implementation.  These pushes are silent data-only signals
//                   that wake iOS system daemons (mobilemail, dataaccessd);
//                   the daemon then connects via IMAP/CalDAV/CardDAV to fetch
//                   new data and iOS itself generates any visible user-facing
//                   notification locally.
//                   <https://github.com/freswa/dovecot-xaps-daemon/blob/main/internal/apns.go>
//
const SERVICES = {
  Mail: {
    cert: 'Mail',
    subtopic: 'com.apple.mobilemail',
    cachePrefix: 'aps_check',
    errorLabel: 'APS failed',
    pushType: 'background'
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

// certificate bundle and long-lived provider per service
const bundles = Object.create(null);
const providers = Object.create(null);

//
// Mail uses the Apple-issued certificate for our own topic (see
// helpers/get-apn-mail-cert.js) when configured; Calendar, Contacts and
// Mail without it use the XServer certificate bundle.
//
async function getBundle(client, service) {
  if (service.cert === 'Mail') {
    const mailCert = getApnMailCert();
    if (mailCert) return { Mail: mailCert, fromFile: true };
  }

  const certs = await getApnCerts(client);
  if (!certs || !certs[service.cert] || !certs[service.cert].certificate)
    return null;

  ensureTopic(certs, service.cert);
  return certs;
}

function ensureTopic(certBundle, certKey) {
  if (certBundle[certKey].topic) {
    return certBundle[certKey].topic;
  }

  const cert = new crypto.X509Certificate(certBundle[certKey].certificate);
  const parsedCert = new (require('@peculiar/x509').X509Certificate)(
    certBundle[certKey].certificate
  );
  const extension = parsedCert.extensions.find(
    (e) => e.type === '1.2.840.113635.100.6.3.6'
  );
  if (extension) {
    const value = Buffer.from(extension.value).toString('utf8');
    const match = value.match(/com\.apple\.[a-zA-Z\d.-]+/);
    if (match) {
      certBundle[certKey].topic = match[0];
      return match[0];
    }
  }

  const lines = cert.subject.split('\n');
  const uidLine = lines.find((l) => l.includes('UID='));
  if (uidLine) {
    certBundle[certKey].topic = uidLine.split('UID=')[1].trim();
    return certBundle[certKey].topic;
  }

  throw new Error(`Could not determine APNs topic for ${certKey}`);
}

//
// Pure Node.js HTTP/2 APNs Client
// Replaces @parse/node-apn to fix missing Content-Type headers and connection
// lifecycle issues.
//
// Key differences from @parse/node-apn:
//   1. Explicitly sets `content-type: application/json; charset=utf-8` on every
//      request -- node-apn never set this header, which caused APNs to silently
//      drop payloads even while returning HTTP 200.
//      <https://github.com/sideshow/apns2/blob/master/client.go#L214>
//   2. Connection lifecycle managed via native http2 session events (close /
//      error / goaway) instead of the fragile isProviderAlive() property check.
//   3. No third-party dependency -- uses Node's built-in node:http2 module.
//
class ApnsClient {
  constructor(cert, key, serviceName) {
    this.cert = cert;
    this.key = key;
    this.serviceName = serviceName;
    //
    // Always use the production endpoint.  The XAPPLEPUSHSERVICE certificates
    // are provisioned against production APNs only; the sandbox endpoint will
    // reject them with a 403 InvalidProviderToken.
    //
    this.host = 'api.push.apple.com';
    this.client = null;
    this.connectPromise = null;
  }

  async connect() {
    if (this.client && !this.client.closed && !this.client.destroyed) {
      return this.client;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      const client = http2.connect(`https://${this.host}`, {
        cert: this.cert,
        key: this.key,
        ALPNProtocols: ['h2'],
        rejectUnauthorized: true
      });

      client.on('connect', () => {
        this.client = client;
        this.connectPromise = null;
        resolve(client);
      });

      client.on('error', (err) => {
        logger.error(`APNs HTTP/2 connection error: ${err.message}`);
        this.client = null;
        this.connectPromise = null;
        reject(err);
      });

      client.on('close', () => {
        this.client = null;
        this.connectPromise = null;
      });

      client.on('goaway', (_errorCode, _lastStreamId, _opaqueData) => {
        this.client = null;
        this.connectPromise = null;
      });
    });

    return this.connectPromise;
  }

  async send(note, deviceToken) {
    const client = await this.connect();

    return new Promise((resolve) => {
      const headers = {
        ':method': 'POST',
        ':path': `/3/device/${deviceToken}`,
        'content-type': 'application/json; charset=utf-8',
        'apns-topic': note.topic,
        'apns-push-type': note.pushType,
        'apns-expiration': note.expiry
      };

      if (note.priority !== undefined) {
        headers['apns-priority'] = note.priority;
      }

      const req = client.request(headers);

      req.setEncoding('utf8');

      let status;
      req.on('response', (resHeaders) => {
        status = resHeaders[':status'];
      });

      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        if (status === 200) {
          resolve({ sent: [{ device: deviceToken }], failed: [] });
        } else {
          let reason = 'UnknownError';
          try {
            if (data) {
              reason = JSON.parse(data).reason;
            }
          } catch {}

          resolve({
            sent: [],
            failed: [{ device: deviceToken, status, response: { reason } }]
          });
        }
      });

      req.on('error', (err) => {
        resolve({
          sent: [],
          failed: [
            {
              device: deviceToken,
              status: 500,
              response: { reason: err.message }
            }
          ]
        });
      });

      const body = note.compile();
      req.write(body);
      req.end();
    });
  }
}

function createNote(certBundle, service, obj, options) {
  const note = {
    topic: certBundle[service.cert].topic,
    pushType: service.pushType,
    expiry: Math.floor(dayjs().add(24, 'hour').toDate().getTime() / 1000),
    payload: {},
    aps: {}
  };

  if (service.cert === 'Mail') {
    //
    // Mail: omit apns-priority to match dovecot-xaps-daemon behaviour.
    // sideshow/apns2 (used by dovecot-xaps-daemon) leaves Priority at zero
    // and skips the apns-priority header when Priority <= 0.  APNs then
    // applies its own default delivery policy for the background push type.
    // <https://github.com/freswa/dovecot-xaps-daemon/blob/main/internal/apns.go>
    // note.priority intentionally left undefined -- ApnsClient.send() omits
    // the apns-priority header when priority is undefined.
    //
    if (obj.account_id) {
      note.aps['account-id'] = obj.account_id;
    }

    //
    // aps.m is an array containing one md5 hex string identifying the mailbox
    // that changed.  iOS Mail uses it to refresh only that mailbox instead of
    // doing a full-account sync.  Format confirmed from argon/push_notify
    // (the original Apple employee reference implementation):
    //   new Notification({aps: {"account-id": accountId, m: [mailboxHash]}})
    // <https://github.com/argon/push_notify/blob/master/lib/controller.js>
    //
    note.aps.m = [
      crypto
        .createHash('md5')
        .update(options.mailboxPath || 'INBOX')
        .digest('hex')
    ];
    note.payload.aps = note.aps;
  } else {
    //
    // Calendar / Contact: priority 5 (background batched delivery is fine).
    // Payload matches Apple's ccs-calendarserver reference implementation:
    //   { key, dataChangedTimestamp, pushRequestSubmittedTimestamp }
    // No `aps` dictionary -- wire JSON omits aps entirely since note.aps
    // is empty and compile() only includes it when non-empty.
    //
    note.priority = 5;

    const now = Math.floor(Date.now() / 1000);
    note.payload = {
      key: obj.key || '',
      dataChangedTimestamp: now,
      pushRequestSubmittedTimestamp: now
    };
  }

  //
  // compile() serializes the note payload to the APNs wire JSON format.
  // For Mail, aps is already embedded in note.payload.aps above.
  // For Calendar/Contact, aps is empty and omitted from the wire body.
  //
  note.compile = () => JSON.stringify(note.payload);

  return note;
}

//
// Pre-filter alias.aps[] entries to one row per (device, target) pair so
// duplicate or near-duplicate rows do not produce duplicate APNs sends.
// Exposed via `sendApn._test.dedupeRegistrations` for unit testing.  See
// the call site for the full motivation; the dedupe key is:
//
//   * Mail               -> lowercase(device_token) + '|' + mailboxPath
//   * Calendar / Contact -> lowercase(device_token) + '|' + (key || '')
//
// The most recently updated row for each dedupe key wins so that when iOS
// rotates its account_id on re-registration the fresh account_id is used.
// device_token casing from the winning row is preserved for the 410-Gone
// unsubscribe path.
//
function dedupeRegistrations(matched, service, options = {}) {
  const mailboxPathForKey =
    service.cert === 'Mail' ? options.mailboxPath || 'INBOX' : null;
  //
  // Sort descending by updated_at so the most recently registered entry wins.
  // iOS generates a new account_id UUID on every re-registration (reboot,
  // iOS update, account remove/re-add) while keeping the same device_token.
  // Without this sort the oldest stale account_id would win and iOS would
  // silently ignore the push even though APNs returns HTTP 200.
  //
  const sorted = [...matched].sort((a, b) => {
    const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
    const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
    return tb - ta;
  });
  const seen = new Map();
  for (const row of sorted) {
    if (!row || !row.device_token) {
      continue;
    }

    const tokenLc = row.device_token.toLowerCase();
    const dedupeKey =
      service.cert === 'Mail'
        ? `${tokenLc}|${mailboxPathForKey}`
        : `${tokenLc}|${row.key || ''}`;

    if (!seen.has(dedupeKey)) {
      seen.set(dedupeKey, row);
    }
  }

  return [...seen.values()];
}

async function sendApnForService(serviceName, client, id, options = {}) {
  const service = SERVICES[serviceName];
  if (!service) {
    throw new TypeError(`Unsupported APN service: ${serviceName}`);
  }

  const alias = await Aliases.findOne({ id }).lean().select('+aps').exec();
  if (!alias) {
    return;
  }

  if (!Array.isArray(alias.aps) || alias.aps.length === 0) {
    return;
  }

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
  const matched = alias.aps.filter((a) =>
    service.cert === 'Mail'
      ? !a.subtopic || a.subtopic === service.subtopic
      : a.subtopic === service.subtopic
  );

  if (matched.length === 0) {
    return;
  }

  //
  // In-memory uniqueness pre-filter.
  //
  // alias.aps[] can accumulate duplicate or near-duplicate rows over time.
  // The two real-world causes we have observed in production:
  //
  //  1. iOS Mail rotates `account_id` on backup-and-restore, account
  //     remove/re-add, or OS-upgrade migration -- but `device_token` is
  //     stable.  The on-xapplepushservice upsert key is
  //     (device_token, account_id), so each rotation appends a new row
  //     instead of replacing the old one.  We have observed 15+ stale
  //     rows for a single physical device on one alias.
  //
  //  2. APNs treats device_token as case-insensitive hex, but iOS
  //     XAPPLEPUSHSERVICE registrations historically use UPPERCASE while
  //     CalDAV / CardDAV /apns POSTs use lowercase.  Two rows differing
  //     only in token case still address the SAME physical device.
  //
  // Without dedupe each duplicate row would produce a separate APNs send
  // with an identical wire body, wasting writes (and risking APNs
  // throttling) without delivering any additional information to iOS
  // (the device only refreshes the affected mailbox / collection once
  // regardless of how many duplicate pushes it receives).
  //
  // Dedupe key per service:
  //   * Mail               -- lowercase(device_token) + '|' + mailboxPath
  //                           (one push per (device, mailbox); identical
  //                            (token, mailbox) regardless of account_id
  //                            produces an identical Mail push payload
  //                            because aps.m = [md5(mailboxPath)])
  //   * Calendar / Contact -- lowercase(device_token) + '|' + (key || '')
  //                           (one push per (device, collection); the wire
  //                            body's `key` is opaque and identifies the
  //                            collection that changed)
  //
  // We keep the FIRST row for each dedupe key so the original
  // device_token casing is preserved for the 410-Gone unsubscribe path,
  // which strict-equals on (device_token, key) when removing rows.
  //
  const registrations = dedupeRegistrations(matched, service, options);

  if (matched.length !== registrations.length) {
    logger.debug('sendApnForService deduped registrations', {
      service: serviceName,
      aliasId: id,
      before: matched.length,
      after: registrations.length
    });
  }

  //
  // Long-lived cached provider (one per service).  We never call
  // `provider.shutdown(fn)` because we keep the HTTP/2 connection alive.
  //
  //
  // Reconnect Mail when the Apple-issued certificate appears, is renewed or
  // expires (getApnMailCert then returns a different object or null).
  //
  if (service.cert === 'Mail' && providers[serviceName]) {
    const inUse = bundles[serviceName].fromFile
      ? bundles[serviceName].Mail
      : null;
    if (getApnMailCert() !== inUse) {
      if (providers[serviceName].client) providers[serviceName].client.close();
      delete providers[serviceName];
      delete bundles[serviceName];
    }
  }

  if (!providers[serviceName]) {
    const bundle = await getBundle(client, service);
    if (!bundle) {
      logger.warn('sendApnForService: no APNs certificate', {
        service: serviceName
      });
      return;
    }

    bundles[serviceName] = bundle;
    providers[serviceName] = new ApnsClient(
      bundle[service.cert].certificate,
      bundle[service.cert].privateKey,
      serviceName
    );
  }

  const provider = providers[serviceName];
  const bundle = bundles[serviceName];

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

      if (cache) {
        return;
      }

      //
      // Mailbox subscription filter (matches argon/push_notify behaviour).
      // iOS Mail registers with a list of mailboxes it wants push for.
      // Only send the push if the changed mailbox is in that list.
      // If mailboxes is empty or absent we send unconditionally (legacy
      // registrations that pre-date per-mailbox subscription support).
      //
      if (
        service.cert === 'Mail' &&
        Array.isArray(obj.mailboxes) &&
        obj.mailboxes.length > 0 &&
        !obj.mailboxes.includes(options.mailboxPath || 'INBOX')
      ) {
        // Release the coalesce lock so a future push for a subscribed mailbox
        // is not blocked by this skipped send.
        await client.del(key);
        return;
      }

      await client.set(key, true, 'PX', ms('1m'));
      // Artificial 10s delay so multiple back-to-back mutations coalesce
      // into a single push (matches the pre-unification behaviour).
      await setTimeout(ms('10s'));
      const note = createNote(bundle, service, obj, options);

      // Note they have commented out code at this below link for setting priority in note
      // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>
      logger.debug('sendApnForService dispatching', {
        service: serviceName,
        topic: note.topic,
        deviceToken: obj.device_token,
        key: obj.key,
        subtopic: obj.subtopic,
        priority: note.priority === undefined ? '(omitted)' : note.priority,
        pushType: note.pushType
      });

      const result = await provider.send(note, obj.device_token);

      logger.debug('sendApnForService result', {
        service: serviceName,
        sent: Array.isArray(result.sent) ? result.sent.length : 0,
        failed: Array.isArray(result.failed) ? result.failed.length : 0,
        result
      });

      // NOTE: if device returns 410 then unsubscribe on our side too
      // If the device returns 410 we unsubscribe on our side too.
      if (Array.isArray(result.failed) && result.failed.length > 0) {
        //
        // Handle 429 TooManyRequests -- APNs rate limit, not a bug.
        // The device will receive the next successful push and sync then.
        // Extend the coalescing lock to 5 minutes for this device to
        // back off and avoid hitting the rate limit again immediately.
        //
        const rateLimited = result.failed.filter(
          (r) => Number.parseInt(r.status, 10) === 429
        );

        if (rateLimited.length > 0) {
          logger.warn('APNs rate limited (429 TooManyRequests)', {
            service: serviceName,
            device: obj.device_token,
            count: rateLimited.length
          });
          await client.set(key, true, 'PX', ms('5m'));
          return;
        }

        //
        // 400 DeviceTokenNotForTopic: the device registered under another
        // topic (e.g. the XServer topic before APNS_MAIL_TOPIC was set) and
        // has not reconnected yet.  iOS re-registers with the topic we
        // advertise on its next IMAP session, so keep the row.
        //
        const notForTopic = result.failed.filter(
          (r) =>
            Number.parseInt(r.status, 10) === 400 &&
            r.response?.reason === 'DeviceTokenNotForTopic'
        );

        if (notForTopic.length === result.failed.length) {
          logger.warn('APNs device token not registered for topic', {
            service: serviceName,
            topic: note.topic,
            device: obj.device_token
          });
          return;
        }

        //
        // 410 Unregistered and 400 BadDeviceToken both mean this token will
        // never be delivered to again, so the registration is removed.
        //
        const unregisteredDeviceTokens = result.failed
          .filter(
            (r) =>
              Number.parseInt(r.status, 10) === 410 ||
              (Number.parseInt(r.status, 10) === 400 &&
                r.response?.reason === 'BadDeviceToken')
          )
          .map((r) => r.device);

        if (unregisteredDeviceTokens.length === 0) {
          const err = new TypeError(service.errorLabel);
          err.isCodeBug = true;
          err.result = result;
          logger.fatal(err);
          return;
        }

        if (
          unregisteredDeviceTokens.length === 1 &&
          unregisteredDeviceTokens[0] === obj.device_token
        ) {
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
              const filtered = alias.aps.filter(
                (a) =>
                  !(a.device_token === obj.device_token && a.key === obj.key)
              );
              await Aliases.findByIdAndUpdate(alias._id, {
                $set: { aps: filtered }
              });
            },
            { concurrency: config.concurrency }
          );
        } else {
          throw new TypeError(
            `Device token mismatch ${
              obj.device_token
            } vs. ${unregisteredDeviceTokens.join(', ')}`
          );
        }
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
sendApn._test = {
  createNote,
  dedupeRegistrations,
  SERVICES,
  providers,
  bundles
};

module.exports = sendApn;
