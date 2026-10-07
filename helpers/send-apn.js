/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */
const crypto = require('node:crypto');
const http2 = require('node:http2');
const { Buffer } = require('node:buffer');
const timers = require('node:timers');
const { setTimeout } = require('node:timers/promises');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pMap = require('p-map');
const revHash = require('rev-hash');

const Aliases = require('#models/aliases');
const apnsDebug = require('#helpers/apns-debug');
const getApnCerts = require('#helpers/get-apn-certs');
const getApnMailCert = require('#helpers/get-apn-mail-cert');

const { maskToken } = apnsDebug;
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

//
// Timeouts, kept in one object so tests can shorten them.
//
//   * coalesce -- changes within this window share one push
//   * connect  -- give up on a connection to APNs that does not open
//   * request  -- give up on a push APNs does not answer; the connection is
//                 then dropped and the push retried once on a new one, since
//                 a connection a firewall or NAT dropped silently would
//                 otherwise hold every later push forever
//   * idle     -- close a connection after this long without traffic, so a
//                 silently dropped one is not reused
//   * certs    -- reuse a fetched XServer certificate bundle this long before
//                 reading Redis again, so a renewed bundle (new certificates
//                 and topics) is used without a restart
//
const TIMEOUTS = {
  coalesce: ms('10s'),
  connect: ms('15s'),
  request: ms('15s'),
  idle: ms('5m'),
  certs: ms('5m')
};

// APNs endpoint (tests point it at a local server)
const ORIGIN = {
  host: 'api.push.apple.com',
  tls: {}
};

// replaceable in tests, where the XServer certificates cannot be fetched
const deps = { getApnCerts };

function isSubscribed(mailboxes, mailboxPath) {
  if (!Array.isArray(mailboxes) || mailboxes.length === 0) return true;
  if (mailboxPath.toUpperCase() === 'INBOX')
    return mailboxes.some(
      (m) => typeof m === 'string' && m.toUpperCase() === 'INBOX'
    );
  return mailboxes.includes(mailboxPath);
}

// long-lived HTTP/2 provider per certificate, keyed by target name
const providers = Object.create(null);

let xserver = { certs: null, at: 0 };

async function getXServerCerts(client) {
  if (Date.now() - xserver.at < TIMEOUTS.certs) return xserver.certs;
  let certs = null;
  try {
    certs = await deps.getApnCerts(client);
  } catch (err) {
    // retried after TIMEOUTS.certs instead of on every push
    logger.error(err);
  }

  xserver = { certs, at: Date.now() };
  return certs;
}

function getProvider(target) {
  const existing = providers[target.name];
  if (
    existing &&
    existing.cert === target.cert.certificate &&
    existing.key === target.cert.privateKey
  )
    return existing;

  // the certificate was renewed or replaced: drop the old connection
  if (existing?.client) existing.client.close();

  apnsDebug('provider created', {
    name: target.name,
    topic: target.topic,
    certificate: target.source,
    validTo: target.cert.validTo
  });

  providers[target.name] = new ApnsClient(
    target.cert.certificate,
    target.cert.privateKey,
    target.name
  );
  return providers[target.name];
}

//
// The certificate a push for this service goes out on.
//
// Mail only uses the Apple-issued certificate for our own topic
// (APNS_MAIL_CERT_PATH); iOS Mail does not take pushes on the XServer Mail
// topic.  Calendar and Contacts use the XServer certificates.
//
async function getTargets(client, service) {
  const targets = [];

  if (service.cert === 'Mail') {
    const mailCert = getApnMailCert();
    if (mailCert)
      targets.push({
        name: 'Mail',
        source: 'APNS_MAIL_CERT_PATH',
        cert: mailCert
      });
  } else {
    const certs = await getXServerCerts(client);
    if (certs?.[service.cert]?.certificate) {
      ensureTopic(certs, service.cert);
      targets.push({
        name: `${service.cert}:XServer`,
        source: 'XServer',
        cert: certs[service.cert]
      });
    }
  }

  for (const target of targets) {
    target.topic = target.cert.topic;
    target.provider = getProvider(target);
  }

  return targets;
}

//
// A device only accepts pushes on the topic the IMAP server gave it, so a
// registration that stored another topic (an older certificate or the
// XServer topic) is skipped until the device registers again.  Rows stored
// before topics were kept, and Calendar and Contacts rows, have none and
// get the push on the current topic.
//
function getTargetsFor(registration, targets) {
  if (!registration.topic) return targets;
  return targets.filter((target) => target.topic === registration.topic);
}

const statusOf = (failure) => Number.parseInt(failure.status, 10);

// a timeout, dropped connection or APNs server error, retried once
const isTransient = (failure) => [0, 500, 503].includes(statusOf(failure));

// the token will never be delivered to on this topic again
const isPermanent = (failure) =>
  statusOf(failure) === 410 ||
  (statusOf(failure) === 400 && failure.response?.reason === 'BadDeviceToken');

const isNotForTopic = (failure) =>
  statusOf(failure) === 400 &&
  failure.response?.reason === 'DeviceTokenNotForTopic';

function failure(device, status, reason, extra = {}) {
  return {
    sent: [],
    failed: [{ device, status, ...extra, response: { reason } }]
  };
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
      const client = http2.connect(`https://${ORIGIN.host}`, {
        cert: this.cert,
        key: this.key,
        ALPNProtocols: ['h2'],
        rejectUnauthorized: true,
        ...ORIGIN.tls
      });

      //
      // One timer for the session: until it connects it bounds the connect,
      // afterwards it closes the session once idle.  (Each setTimeout call
      // with a callback adds a listener, so the callback is added once.)
      //
      let connected = false;
      client.setTimeout(TIMEOUTS.connect, () => {
        if (connected) {
          apnsDebug('closing idle connection', { service: this.serviceName });
          client.close();
          return;
        }

        client.destroy(new Error('APNs connection timed out'));
      });

      client.on('connect', () => {
        connected = true;
        client.setTimeout(TIMEOUTS.idle);
        apnsDebug('connected', {
          service: this.serviceName,
          host: ORIGIN.host
        });
        this.client = client;
        this.connectPromise = null;
        resolve(client);
      });

      client.on('error', (err) => {
        logger.error(`APNs HTTP/2 connection error: ${err.message}`);
        apnsDebug('connection error', {
          service: this.serviceName,
          error: err.message,
          code: err.code
        });
        if (this.client === client) this.client = null;
        this.connectPromise = null;
        reject(err);
      });

      client.on('close', () => {
        if (this.client === client) this.client = null;
        if (!connected) {
          this.connectPromise = null;
          // closed before connecting without an error event
          reject(new Error('APNs connection closed'));
        }
      });

      client.on('goaway', (errorCode, _lastStreamId, _opaqueData) => {
        apnsDebug('goaway', { service: this.serviceName, errorCode });
        if (this.client === client) this.client = null;
      });
    });

    return this.connectPromise;
  }

  //
  // Always resolves; a timeout or dropped connection resolves as status 0.
  //
  async send(note, deviceToken) {
    let client;
    try {
      client = await this.connect();
    } catch (err) {
      return failure(deviceToken, 0, err.message);
    }

    return new Promise((resolve) => {
      let timer = null;
      let done = false;
      const finish = (result) => {
        if (done) return;
        done = true;
        timers.clearTimeout(timer);
        resolve(result);
      };

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

      let req;
      try {
        req = client.request(headers);
      } catch (err) {
        // the session closed between connect() and now
        finish(failure(deviceToken, 0, err.message));
        return;
      }

      timer = timers.setTimeout(() => {
        apnsDebug('no response from APNs; dropping the connection', {
          service: this.serviceName,
          timeoutMs: TIMEOUTS.request
        });
        req.close(http2.constants.NGHTTP2_CANCEL);
        client.destroy();
        finish(failure(deviceToken, 0, 'Timeout'));
      }, TIMEOUTS.request);

      req.setEncoding('utf8');

      let status;
      let apnsId;
      req.on('response', (resHeaders) => {
        status = resHeaders[':status'];
        apnsId = resHeaders['apns-id'];
      });

      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });

      req.on('end', () => {
        if (status === 200) {
          finish({ sent: [{ device: deviceToken, apnsId }], failed: [] });
          return;
        }

        let reason = 'UnknownError';
        let timestamp;
        try {
          if (data) {
            ({ reason, timestamp } = JSON.parse(data));
          }
        } catch {}

        finish(
          failure(deviceToken, status ?? 0, reason, { apnsId, timestamp })
        );
      });

      req.on('error', (err) => {
        finish(failure(deviceToken, 0, err.message));
      });

      // reset by the server or the connection closed before a response
      req.on('close', () => {
        finish(failure(deviceToken, 0, 'StreamClosed'));
      });

      const body = note.compile();
      req.write(body);
      req.end();
    });
  }
}

function createNote(certBundle, service, obj, _options) {
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
    //
    // Body is only `{"aps":{"account-id":"…"}}`, as sent by
    // dovecot-xaps-daemon and WildDuck for the Apple-issued Mail topics:
    // iOS Mail then checks the whole account.  An `aps.m` mailbox hash
    // used to be added; one push often covers several coalesced changes in
    // different mailboxes (e.g. a draft save followed by new mail in INBOX),
    // and naming only the first one could make iOS skip the mailbox that
    // actually received mail.
    // <https://github.com/freswa/dovecot-xaps-daemon/blob/main/internal/apns.go>
    // <https://github.com/zone-eu/wildduck/blob/master/lib/apn-client.js>
    //
    if (obj.account_id) {
      note.aps['account-id'] = obj.account_id;
    }

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

  const debug = {
    service: serviceName,
    alias: id,
    mailbox: options.mailboxPath
  };

  const alias = await Aliases.findOne({ id }).lean().select('+aps').exec();
  if (!alias) {
    apnsDebug('skip: alias not found', debug);
    return;
  }

  if (!Array.isArray(alias.aps) || alias.aps.length === 0) {
    apnsDebug('skip: alias has no push registrations', debug);
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
    apnsDebug('skip: no registrations for this service', {
      ...debug,
      subtopics: alias.aps.map((a) => a.subtopic || '(none)')
    });
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
  //                           (one push per device; the newest row has the
  //                            current account_id and topic)
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

  apnsDebug('registrations', {
    ...debug,
    matched: matched.length,
    deduped: registrations.length,
    devices: registrations.map((r) => ({
      deviceToken: maskToken(r.device_token),
      accountId: r.account_id,
      subtopic: r.subtopic,
      mailboxes: r.mailboxes,
      updatedAt: r.updated_at
    }))
  });

  const targets = await getTargets(client, service);
  if (targets.length === 0) {
    logger.warn('sendApnForService: no APNs certificate', {
      service: serviceName
    });
    apnsDebug('skip: no APNs certificate', debug);
    return;
  }

  await pMap(registrations, async (obj) => {
    try {
      //
      // Coalesce sends to the same registration.  We key on (device_token,
      // collection-key) because account_id is OPTIONAL for CalDAV/CardDAV
      // (iOS never sends it in the registration POST); using account_id
      // here would collapse all subscriptions for the alias into a single
      // shared lock and only one push per window would be delivered to the
      // alias regardless of which collection changed.
      //
      const cacheTokens = [
        service.cachePrefix,
        revHash(obj.device_token || ''),
        revHash(obj.key || obj.account_id || '')
      ];
      const key = cacheTokens.join(':');
      const device = {
        ...debug,
        deviceToken: maskToken(obj.device_token),
        accountId: obj.account_id,
        registeredTopic: obj.topic || '(not stored)',
        registeredAt: obj.updated_at
      };

      //
      // Mailbox subscription filter (matches argon/push_notify behaviour).
      // iOS Mail registers with a list of mailboxes it wants push for.
      // Only send the push if the changed mailbox is in that list.
      // If mailboxes is empty or absent we send unconditionally (legacy
      // registrations that pre-date per-mailbox subscription support).
      // INBOX is case-insensitive in IMAP (RFC 3501 section 5.1).
      //
      if (
        service.cert === 'Mail' &&
        !isSubscribed(obj.mailboxes, options.mailboxPath || 'INBOX')
      ) {
        apnsDebug('skip: mailbox not subscribed', {
          ...device,
          mailboxes: obj.mailboxes
        });
        return;
      }

      const routed = getTargetsFor(obj, targets);
      if (routed.length === 0) {
        //
        // The device registered for a topic we no longer send on (e.g. the
        // XServer Mail topic); it gets the current topic the next time it
        // connects over IMAP.
        //
        logger.warn('APNs registration topic has no certificate', {
          service: serviceName,
          topic: obj.topic
        });
        apnsDebug('skip: registered for a topic we no longer send on', {
          ...device,
          available: targets.map((t) => t.topic)
        });
        return;
      }

      //
      // Coalesce: the first change takes the lock and sends one push when
      // the window ends, so every change made during the window (a draft
      // save, then new mail, then a flag change) is covered by that push.
      // The lock lasts exactly as long as the window; it used to last a
      // minute after a 10 second wait, which silently dropped any new mail
      // that arrived in the 50 seconds after a push.
      //
      const locked = await client.set(key, true, 'PX', TIMEOUTS.coalesce, 'NX');

      if (!locked) {
        apnsDebug('coalesced: a push for this device is already queued', {
          ...device,
          lockMs: await client.pttl(key)
        });
        return;
      }

      apnsDebug('queued', { ...device, inMs: TIMEOUTS.coalesce });
      await setTimeout(TIMEOUTS.coalesce);

      const results = await pMap(routed, async (target) => {
        const note = createNote({ [service.cert]: target.cert }, service, obj);

        // Note they have commented out code at this below link for setting priority in note
        // <https://github.com/freswa/dovecot-xaps-daemon/blob/abce2f14cf1b5afa56329ebb4d923c9c2aebdfe3/internal/apns.go#L162-L163>
        apnsDebug('sending', {
          ...device,
          topic: target.topic,
          certificate: target.source,
          pushType: note.pushType,
          priority: note.priority === undefined ? '(omitted)' : note.priority,
          body: note.compile()
        });

        let result = await target.provider.send(note, obj.device_token);
        if (result.failed.some((f) => isTransient(f))) {
          apnsDebug('retrying on a new connection', {
            ...device,
            topic: target.topic,
            reason: result.failed[0].response?.reason
          });
          result = await target.provider.send(note, obj.device_token);
        }

        apnsDebug(result.sent.length > 0 ? 'sent' : 'refused', {
          ...device,
          topic: target.topic,
          status: result.failed[0]?.status ?? 200,
          reason: result.failed[0]?.response?.reason,
          apnsId: result.sent[0]?.apnsId || result.failed[0]?.apnsId
        });

        return { target, result };
      });

      // delivered on at least one topic
      if (results.some(({ result }) => result.sent.length > 0)) return;

      const failures = results.flatMap(({ target, result }) =>
        result.failed.map((f) => ({ ...f, topic: target.topic }))
      );

      //
      // Handle 429 TooManyRequests -- APNs rate limit, not a bug.
      // The device will receive the next successful push and sync then.
      // Extend the coalescing lock to 5 minutes for this device to
      // back off and avoid hitting the rate limit again immediately.
      //
      if (failures.some((f) => statusOf(f) === 429)) {
        logger.warn('APNs rate limited (429 TooManyRequests)', {
          service: serviceName,
          device: obj.device_token
        });
        await client.set(key, true, 'PX', ms('5m'));
        apnsDebug('backing off for 5 minutes after 429', device);
        return;
      }

      //
      // 400 DeviceTokenNotForTopic: the device registered under another
      // topic and has not reconnected yet.  iOS registers again with the
      // topic we advertise on its next IMAP session, so keep the row.
      //
      if (failures.every((f) => isNotForTopic(f))) {
        logger.warn('APNs device token not registered for topic', {
          service: serviceName,
          topics: failures.map((f) => f.topic),
          device: obj.device_token
        });
        apnsDebug(
          'device has not registered for this topic yet; it must reconnect (or re-add the account) so iOS sends XAPPLEPUSHSERVICE again',
          device
        );
        return;
      }

      //
      // 410 Unregistered and 400 BadDeviceToken both mean this token will
      // never be delivered to on that topic again, so the registration is
      // removed once every topic it was sent on refused it this way.
      //
      if (
        !failures.every((f) => isPermanent(f) || isNotForTopic(f)) ||
        !failures.some((f) => isPermanent(f))
      ) {
        const err = new TypeError(service.errorLabel);
        err.isCodeBug = true;
        err.result = failures;
        logger.fatal(err);
        return;
      }

      await removeRegistrations(
        obj,
        failures.filter((f) => isPermanent(f))
      );
      apnsDebug('removed registration refused by APNs', device);
    } catch (err) {
      logger.fatal(err, { obj });
    }
  });
}

//
// Remove the registrations APNs refused for good, on every alias that has
// this device.  Matched on (device_token, key) so the device's other
// subscriptions (one per calendar or address book) are kept, on the topics
// that refused it, and atomically with $pull so a registration made at the
// same moment is not overwritten.  A 410 carries the time APNs last saw the
// token become invalid; a registration made after that time is kept, since
// the device registered again with a working token.
//
async function removeRegistrations(obj, permanent) {
  const timestamps = permanent.map((f) => f.timestamp);
  const cutoff = timestamps.every((t) => Number.isFinite(t))
    ? new Date(Math.max(...timestamps))
    : null;

  const variants = [
    ...new Set([
      obj.device_token,
      obj.device_token.toLowerCase(),
      obj.device_token.toUpperCase()
    ])
  ];

  const condition = {
    device_token: { $in: variants },
    key: obj.key || null,
    topic: { $in: [...new Set(permanent.map((f) => f.topic)), null] }
  };
  // ($not also matches rows without updated_at)
  if (cutoff) condition.updated_at = { $not: { $gt: cutoff } };

  await Aliases.updateMany(
    { 'aps.device_token': { $in: variants } },
    { $pull: { aps: condition } }
  );
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
  deps,
  TIMEOUTS,
  ORIGIN,
  resetCerts() {
    xserver = { certs: null, at: 0 };
  }
};

module.exports = sendApn;
