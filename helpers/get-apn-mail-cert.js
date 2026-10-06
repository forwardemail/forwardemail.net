/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const { Buffer } = require('node:buffer');

const X509 = require('@peculiar/x509');
const splitLines = require('split-lines');

const env = require('#config/env');
const logger = require('#helpers/logger');

X509.cryptoProvider.set(crypto);

//
// Apple Mail push certificate issued for our own topic.
//
// Apple grants mail providers a dedicated APNs topic for IMAP
// XAPPLEPUSHSERVICE, for example `com.apple.mobilemail.push.net.forwardemail`.
// The certificate is an "Apple Push Notification service SSL (Sandbox &
// Production)" certificate created under that App ID in the Apple Developer
// portal, and the topic is the UID in its subject.
//
// When APNS_MAIL_CERT_PATH and APNS_MAIL_KEY_PATH are set, Mail pushes use
// this certificate and the IMAP server advertises its topic.  Calendar and
// Contacts keep using the XServer certificates from get-apn-certs.
//
// APNS_MAIL_TOPIC is optional; it defaults to the subject UID and must match
// a topic the certificate allows (APNs answers TopicDisallowed otherwise).
//
// The private key is read from disk on each process and never written to
// Redis.
//

// <https://developer.apple.com/documentation/usernotifications/establishing-a-certificate-based-connection-to-apns>
const TOPICS_EXTENSION = '1.2.840.113635.100.6.3.6';

function getUid(x509) {
  const line = splitLines(x509.subject).find((l) => l.startsWith('UID='));
  return line ? line.slice(4).trim() : null;
}

//
// Read one DER TLV at `offset`; returns { tag, start, end } of its value
//
function readTlv(buf, offset) {
  const tag = buf[offset];
  let length = buf[offset + 1];
  let start = offset + 2;
  // long form: 0x80 + number of length bytes
  if (length >= 0x80) {
    const bytes = length - 0x80;
    if (bytes === 0 || bytes > 4) throw new TypeError('Invalid DER length');
    length = 0;
    for (let i = 0; i < bytes; i++) length = length * 256 + buf[start + i];
    start += bytes;
  }

  const end = start + length;
  if (tag === undefined || end > buf.length)
    throw new TypeError('Truncated DER value');
  return { tag, start, end };
}

//
// The topics extension is a SEQUENCE of a UTF8String topic followed by a
// SEQUENCE of its options, repeated:
//   SEQUENCE { "com.apple.mobilemail.push.net.example", SEQUENCE { "app" },
//              "com.apple.mobilemail.push.net.example.voip", SEQUENCE { … } }
// so the allowed topics are the UTF8Strings directly inside the outer SEQUENCE.
//
function parseTopicsExtension(value) {
  const buf = Buffer.from(value);
  const outer = readTlv(buf, 0);
  if (outer.tag !== 0x30) throw new TypeError('Expected a DER SEQUENCE');
  const topics = [];
  let offset = outer.start;
  while (offset < outer.end) {
    const tlv = readTlv(buf, offset);
    if (tlv.tag === 0x0c)
      topics.push(buf.subarray(tlv.start, tlv.end).toString('utf8'));
    offset = tlv.end;
  }

  return topics;
}

function getAllowedTopics(pem, uid) {
  const topics = new Set(uid ? [uid] : []);
  try {
    const parsed = new X509.X509Certificate(pem);
    const extension = parsed.getExtension(TOPICS_EXTENSION);
    if (extension) {
      for (const topic of parseTopicsExtension(extension.value))
        topics.add(topic);
    }
  } catch (err) {
    logger.warn(err);
  }

  return topics;
}

function loadApnMailCert(options = {}) {
  const certPath = options.certPath ?? env.APNS_MAIL_CERT_PATH;
  const keyPath = options.keyPath ?? env.APNS_MAIL_KEY_PATH;
  const topicOverride = options.topic ?? env.APNS_MAIL_TOPIC;

  if (!certPath || !keyPath) return null;

  const certificate = fs.readFileSync(certPath, 'utf8');
  const privateKey = fs.readFileSync(keyPath, 'utf8');

  const x509 = new crypto.X509Certificate(certificate);

  if (!x509.checkPrivateKey(crypto.createPrivateKey(privateKey)))
    throw new TypeError(
      'APNS_MAIL_KEY_PATH does not hold the private key for APNS_MAIL_CERT_PATH'
    );

  if (new Date(x509.validTo).getTime() <= Date.now())
    throw new TypeError(`APNs Mail certificate expired on ${x509.validTo}`);

  const uid = getUid(x509);
  const topic = topicOverride || uid;

  if (!topic)
    throw new TypeError(
      'APNs Mail certificate has no UID in its subject; set APNS_MAIL_TOPIC'
    );

  if (!getAllowedTopics(certificate, uid).has(topic))
    throw new TypeError(
      `APNS_MAIL_TOPIC "${topic}" is not a topic of the APNs Mail certificate (UID "${uid}")`
    );

  return {
    certificate,
    privateKey,
    topic,
    validTo: x509.validTo
  };
}

// a failed load is retried after this long (e.g. files deployed late)
const RETRY_MS = 5 * 60 * 1000;
// warn this long before the certificate expires
const EXPIRY_WARNING_MS = 30 * 24 * 60 * 60 * 1000;

let cached;
let loadedAt = 0;
let warnedAt = 0;

//
// Returns `{ certificate, privateKey, topic, validTo }` or `null` when the
// Mail certificate is not configured, fails to load or has expired (each
// failure is logged and the XServer certificate keeps working as a
// fallback).  The same object is returned until it changes, so callers can
// compare by reference to know when to reconnect.
//
function getApnMailCert() {
  const now = Date.now();

  if (cached) {
    const expires = new Date(cached.validTo).getTime();
    if (expires > now) {
      if (
        expires - now < EXPIRY_WARNING_MS &&
        now - warnedAt > 24 * 60 * 60 * 1000
      ) {
        warnedAt = now;
        logger.warn(
          new TypeError(
            `APNs Mail certificate expires on ${cached.validTo}; renew it`
          )
        );
      }

      return cached;
    }
  } else if (cached === null && now - loadedAt < RETRY_MS) {
    return null;
  }

  loadedAt = now;
  try {
    cached = loadApnMailCert();
  } catch (err) {
    err.isCodeBug = true;
    logger.fatal(err);
    cached = null;
  }

  return cached;
}

module.exports = getApnMailCert;
module.exports.loadApnMailCert = loadApnMailCert;
module.exports.parseTopicsExtension = parseTopicsExtension;
