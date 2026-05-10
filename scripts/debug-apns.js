#!/usr/bin/env node
/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// APNs CalDAV/CardDAV push diagnostic tool.
//
// Usage:
//
//   node scripts/debug-apns.js certs
//     Print each Apple XServer certificate's subject + computed topic.
//     This is the first thing to check when "registration succeeds but no
//     push arrives": if the topic the server would advertise differs from
//     the topic the APNs Provider sends on the wire, APNs replies 400
//     BadTopic and the push is silently dropped.
//
//   node scripts/debug-apns.js alias <alias-id-or-email>
//     Dump alias.aps[] for the given alias.  Each row has:
//        device_token : the iOS APNs device token
//        subtopic     : com.apple.mobilecal | mobileaddressbook | mobilemail
//        key          : the per-collection pushkey (or principalId for the
//                       calendar-home / addressbook-home subscription)
//        account_id?  : optional, only present if iOS sent it (rare)
//
//   node scripts/debug-apns.js push <alias-id-or-email> <service> [key]
//     Force-send a push for every aps[] row matching <service> on <alias>.
//     Bypasses the 1-minute Redis coalesce lock and the 10-second delay
//     in helpers/send-apn.js so you get an immediate result.
//     <service> is one of: Mail | Calendar | Contact
//     <key> optional override for the per-collection pushkey.
//
// All output goes to stdout; APNs HTTP/2 errors and 410 Gone unsubscribes
// surface clearly so you know whether the failure is on the wire (BadTopic
// /  BadDeviceToken) or in the trigger pipeline.
//

const crypto = require('node:crypto');
const process = require('node:process');

const Redis = require('ioredis');
const apn = require('@parse/node-apn');
const mongoose = require('mongoose');
const ms = require('ms');
const splitLines = require('split-lines');

require('dotenv-extended').load({
  path: process.env.NODE_CONFIG_DIR
    ? `${process.env.NODE_CONFIG_DIR}/../.env`
    : '.env'
});

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const env = require('#config/env');
const getApnCerts = require('#helpers/get-apn-certs');
const getApnTopic = require('#helpers/get-apn-topic');

const SERVICES = {
  Mail: { subtopic: 'com.apple.mobilemail', pushType: 'alert' },
  Calendar: { subtopic: 'com.apple.mobilecal', pushType: 'background' },
  Contact: { subtopic: 'com.apple.mobileaddressbook', pushType: 'background' }
};

async function makeRedis() {
  return new Redis(env.REDIS_URI || 'redis://127.0.0.1:6379');
}

async function cmdCerts(redis) {
  console.log('Fetching cert bundle from Redis cache (or rotating it)...');
  const certs = await getApnCerts(redis);
  console.log('Cert keys:', Object.keys(certs));
  for (const key of ['Mail', 'Calendar', 'Contact']) {
    if (!certs[key] || !certs[key].certificate) {
      console.log(`\n[${key}] MISSING certificate`);
      continue;
    }

    const x509 = new crypto.X509Certificate(certs[key].certificate);
    console.log(`\n[${key}]`);
    console.log('  Subject (raw):');
    for (const line of splitLines(x509.subject)) console.log('   ', line);
    console.log('  validFrom:', x509.validFrom);
    console.log('  validTo:  ', x509.validTo);

    // Computed topic per get-apn-topic.js (used in <CS:apsbundleid>).
    const topicFromHelper = await getApnTopic(redis, key);
    // Old buggy line-0 lookup (what was used in send-apn.js until fixed).
    let topicFromOldLine0 = null;
    try {
      topicFromOldLine0 = splitLines(x509.subject)[0].split('UID=')[1].trim();
    } catch {
      topicFromOldLine0 = null;
    }

    console.log('  topic via getApnTopic (UID-line search):', topicFromHelper);
    console.log(
      '  topic via line-0 split (legacy bug):    ',
      topicFromOldLine0
    );
    console.log(
      '  MATCH?',
      topicFromHelper === topicFromOldLine0
        ? 'yes'
        : 'NO -- this would have caused BadTopic on the wire'
    );
  }
}

async function findAlias(idOrEmail) {
  if (idOrEmail.includes('@')) {
    const [name, domainName] = idOrEmail.split('@');
    const dom = await Domains.findOne({ name: domainName }).lean().exec();
    return Aliases.findOne({ name, domain: dom && dom._id })
      .select('+aps')
      .lean()
      .exec();
  }

  return Aliases.findOne({ id: idOrEmail }).select('+aps').lean().exec();
}

async function cmdAlias(idOrEmail) {
  const alias = await findAlias(idOrEmail);
  if (!alias) {
    console.error('alias not found:', idOrEmail);
    process.exit(1);
  }

  console.log('alias.id:', alias.id);
  console.log('alias.name:', alias.name);
  console.log(
    'alias.aps.length:',
    Array.isArray(alias.aps) ? alias.aps.length : 0
  );
  if (!Array.isArray(alias.aps)) return;
  for (const [i, row] of alias.aps.entries()) {
    console.log(`  [${i}]`);
    console.log('    device_token:', row.device_token);
    console.log('    subtopic:    ', row.subtopic || '(none)');
    console.log('    key:         ', row.key || '(none)');
    console.log('    account_id:  ', row.account_id || '(none)');
  }
}

async function cmdPush(redis, idOrEmail, serviceName, keyOverride) {
  const service = SERVICES[serviceName];
  if (!service) {
    console.error('Unsupported service:', serviceName);
    process.exit(1);
  }

  const alias = await findAlias(idOrEmail);
  if (!alias) {
    console.error('alias not found:', idOrEmail);
    process.exit(1);
  }

  const rows = (alias.aps || []).filter((r) =>
    serviceName === 'Mail'
      ? !r.subtopic || r.subtopic === service.subtopic
      : r.subtopic === service.subtopic
  );

  if (rows.length === 0) {
    console.error(
      `No aps[] rows match service=${serviceName} subtopic=${service.subtopic} on alias ${alias.id}`
    );
    process.exit(2);
  }

  const certs = await getApnCerts(redis);
  const topic = await getApnTopic(redis, serviceName);
  console.log('Using topic:', topic);

  const provider = new apn.Provider({
    cert: certs[serviceName].certificate,
    key: certs[serviceName].privateKey,
    requestTimeout: ms('15s'),
    production: true
  });

  for (const row of rows) {
    const note = new apn.Notification();
    note.urlArgs = [];
    note.pushType = service.pushType;
    note.topic = topic;
    note.expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    note.aps = {};
    if (row.account_id) note.aps['account-id'] = row.account_id;
    if (serviceName === 'Calendar' || serviceName === 'Contact') {
      const now = Math.floor(Date.now() / 1000);
      note.payload = {
        key: keyOverride || row.key || '',
        dataChangedTimestamp: now,
        pushRequestSubmittedTimestamp: now
      };
      note.priority = 5;
    }

    console.log(
      `>> sending to ${row.device_token.slice(0, 8)}... key=${row.key} ...`
    );
    const result = await provider.send(note, row.device_token);
    console.log(JSON.stringify(result, null, 2));
  }

  await provider.shutdown();
}

function dispatch(cmd, redis, rest) {
  switch (cmd) {
    case 'certs': {
      return cmdCerts(redis);
    }

    case 'alias': {
      return cmdAlias(rest[0]);
    }

    case 'push': {
      return cmdPush(redis, rest[0], rest[1], rest[2]);
    }

    default: {
      console.error('Unknown command:', cmd);
      process.exit(1);
    }
  }
}

(async () => {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  const rest = argv.slice(1);
  if (!cmd) {
    console.error(
      'Usage: debug-apns.js certs | alias <id|email> | push <id|email> <Mail|Calendar|Contact> [key]'
    );
    process.exit(1);
  }

  await mongoose.connect(env.MONGO_URI);
  const redis = await makeRedis();

  try {
    await dispatch(cmd, redis, rest);
  } finally {
    await mongoose.disconnect();
    await redis.quit();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
