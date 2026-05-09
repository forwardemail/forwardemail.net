/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Returns the APNs topic string for the given service ('Calendar',
// 'Contact', 'Mail') from Forward Email's reverse-engineered Apple
// XServer certificate bundle.
//
// The topic is the UID component of the certificate's subject DN, e.g.
//   `com.apple.calendar.XServer.b1b2c3d4-...`
// and MUST be advertised verbatim in the CalDAV/CardDAV
// <CS:push-transports><CS:transport><CS:apsbundleid> property so iOS
// dataaccessd knows which APNs topic to subscribe under.
//
// Topics are derived once and cached in Redis (keyed by service +
// certificate fingerprint) because:
//   * the cert is rotated periodically and we want to invalidate the
//     cached topic when that happens,
//   * we don't want to re-parse the X509 subject on every PROPFIND.
//
// Returns null if the cert bundle is unavailable (cold start, APNs cert
// rotation in progress) so callers can omit push-transports advertising
// gracefully and iOS will fall back to its default poll interval.
//

const crypto = require('node:crypto');

const splitLines = require('split-lines');

const getApnCerts = require('#helpers/get-apn-certs');
const logger = require('#helpers/logger');

async function getApnTopic(client, service) {
  if (!['Calendar', 'Contact', 'Mail'].includes(service))
    throw new TypeError(`Unsupported APNs service: ${service}`);

  let certs;
  try {
    certs = await getApnCerts(client);
  } catch (err) {
    logger.warn('getApnTopic: cert bundle unavailable', { err, service });
    return null;
  }

  if (!certs || !certs[service] || !certs[service].certificate) return null;

  // Mail topic is already populated by get-apn-certs.parseResponse;
  // Calendar/Contact topics are derived lazily here.
  if (certs[service].topic) return certs[service].topic;

  try {
    const x509 = new crypto.X509Certificate(certs[service].certificate);
    // Subject is multi-line; the UID= line carries the topic.
    const subjectLine = splitLines(x509.subject).find((l) =>
      l.includes('UID=')
    );
    if (!subjectLine) return null;
    const topic = subjectLine.split('UID=')[1].trim();
    return topic || null;
  } catch (err) {
    logger.warn('getApnTopic: failed to parse cert subject', { err, service });
    return null;
  }
}

module.exports = getApnTopic;
