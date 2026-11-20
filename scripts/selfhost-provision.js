/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Sets up a self-hosted install's first account without the web interface:
// the admin user (their email address counts as verified, since on a fresh
// install there may be no working outbound mail to verify it with yet), a
// domain they administer that may send mail (`has_smtp`: on a self-hosted
// install the admin approves their own domains) and a mailbox on it with a
// generated IMAP/SMTP password. Then it prints the domain's DNS records.
//
// It can be run again: what exists already is kept, and a mailbox that exists
// gets a new password (its others keep working).
//
// Usage (in the app container, e.g. through `forwardemail-selfhost provision`):
//
//   node scripts/selfhost-provision.js \
//     --email you@example.com --domain example.com [--mailbox you] \
//     [--password <web login password, generated if left out>] [--json]
//
// `--json` prints one JSON object (for the CLI) instead of text.
//

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const { randomBytes } = require('node:crypto');
const process = require('node:process');
const { parseArgs } = require('node:util');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const isFQDN = require('is-fqdn');
const mongoose = require('mongoose');
const sharedConfig = require('@ladjs/shared-config');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const env = require('#config/env');
const createTangerine = require('#helpers/create-tangerine');
const isEmail = require('#helpers/is-email');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');
const { getDnsRecords } = require('#helpers/get-zone-file');

const { values: args } = parseArgs({
  options: {
    email: { type: 'string' },
    domain: { type: 'string' },
    mailbox: { type: 'string' },
    password: { type: 'string' },
    json: { type: 'boolean', default: false }
  }
});

function fail(message) {
  if (args.json) console.log(JSON.stringify({ ok: false, error: message }));
  else console.error(`Error: ${message}`);
  process.exit(1);
}

if (!config.isSelfHosted) fail('this script is for self-hosted installs');
if (!args.email || !isEmail(args.email)) fail('--email must be an address');
if (!args.domain || !isFQDN(args.domain)) fail('--domain must be a domain');

const email = args.email.toLowerCase().trim();
const domainName = args.domain.toLowerCase().trim();
const mailboxName = (args.mailbox || email.split('@')[0]).toLowerCase().trim();

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);

const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});
graceful.listen();

async function ensureUser() {
  let user = await Users.findOne({ email });
  if (user) {
    if (!user[config.userFields.hasVerifiedEmail]) {
      user[config.userFields.hasVerifiedEmail] = true;
      user = await user.save();
    }

    return { user, password: null, created: false };
  }

  // the first admin of an install, as `register` in
  // app/controllers/web/auth.js makes the first person to sign up
  const hasAdmin = (await Users.countDocuments({ group: 'admin' })) > 0;
  const password = args.password || randomBytes(18).toString('base64url');
  user = await Users.register(
    {
      email,
      group: hasAdmin ? 'user' : 'admin',
      plan: 'team',
      [config.userFields.hasVerifiedEmail]: true,
      [config.userFields.hasSetPassword]: true
    },
    password
  );
  return { user, password, created: true };
}

async function ensureDomain(user, resolver) {
  let domain = await Domains.findOne({ name: domainName });
  let created = false;
  if (domain) {
    const isAdmin = domain.members.some(
      (m) => m.user.toString() === user._id.toString() && m.group === 'admin'
    );
    if (!isAdmin)
      fail(`${domainName} exists and ${email} is not one of its admins`);
  } else {
    domain = await Domains.create({
      members: [{ user: user._id, group: 'admin' }],
      name: domainName,
      plan: 'team',
      resolver
    });
    created = true;
  }

  // a self-hosted install's admin approves their own domains for sending
  if (!domain.has_smtp) {
    await Domains.updateOne(
      { _id: domain._id },
      { $set: { has_smtp: true, smtp_verified_at: new Date() } }
    );
    domain = await Domains.findById(domain._id);
  }

  return { domain, created };
}

async function ensureMailbox(user, domain) {
  let alias = await Aliases.findOne({ name: mailboxName, domain: domain._id });
  let created = false;
  if (!alias) {
    alias = new Aliases({
      name: mailboxName,
      domain: domain._id,
      user: user._id,
      recipients: [],
      has_imap: true
    });
    created = true;
  } else if (!alias.has_imap) {
    alias.has_imap = true;
  }

  const password = await alias.createToken('selfhost-provision');
  await alias.save();
  return { alias, password, created };
}

(async () => {
  try {
    await setupMongoose(logger);
    const resolver = createTangerine(client, logger);

    const user = await ensureUser();
    const domain = await ensureDomain(user.user, resolver);
    const mailbox = await ensureMailbox(user.user, domain.domain);
    const records = getDnsRecords(domain.domain, user.user);

    const result = {
      ok: true,
      web: {
        url: config.urls.web,
        email,
        password: user.password,
        created: user.created
      },
      domain: { name: domainName, created: domain.created },
      mailbox: {
        address: `${mailboxName}@${domainName}`,
        password: mailbox.password,
        created: mailbox.created,
        imap: { host: env.IMAP_HOST, port: 993 },
        smtp: { host: env.SMTP_HOST, port: 465 }
      },
      records
    };

    if (args.json) {
      console.log(JSON.stringify(result));
    } else {
      console.log(`\nWeb interface: ${result.web.url}`);
      console.log(`  login:    ${email}`);
      console.log(
        `  password: ${user.password || '(unchanged, the account existed)'}`
      );
      console.log(`\nMailbox: ${result.mailbox.address}`);
      console.log(`  password: ${mailbox.password}  (IMAP and SMTP)`);
      console.log(
        `  IMAP ${result.mailbox.imap.host}:993 and SMTP ${result.mailbox.smtp.host}:465, both TLS`
      );
      console.log(`\nDNS records for ${domainName}:`);
      for (const r of records) {
        const extra = r.type === 'MX' ? `${r.priority} ` : '';
        const srv =
          r.type === 'SRV' ? `${r.priority} ${r.weight} ${r.port} ` : '';
        console.log(`  ${r.name}  ${r.type}  ${extra}${srv}${r.value}`);
      }

      console.log('\nSave these passwords now: they cannot be shown again.\n');
    }

    await graceful.stopRedisClients();
    await graceful.stopMongooses();
    process.exit(0);
  } catch (err) {
    logger.error(err);
    fail(err.message);
  }
})();
