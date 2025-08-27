/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// TODO: remove user.email for all users from denylist

const { isIP } = require('node:net');
const punycode = require('node:punycode');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const isFQDN = require('is-fqdn');
const mongoose = require('mongoose');
const ms = require('ms');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const { boolean } = require('boolean');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const resolver = createTangerine(client, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});
const SEVEN_DAYS_TO_MS = ms('7d');

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const bannedUserIdsSet = await Users.getBannedUserIdSet(client);

    for await (const domain of Domains.find({
      plan: { $in: ['enhanced_protection', 'team', 'enterprise'] },
      has_mx_record: true,
      has_txt_record: true
    })
      .sort({ last_allowlist_sync_at: 1 })
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true)) {
      logger.debug('processing %s', domain.name);

      // filter out domains where all users are banned
      if (
        !domain.members ||
        !Array.isArray(domain.members) ||
        domain.members.every((m) => bannedUserIdsSet.has(m.user.toString()))
      ) {
        logger.info('all domain users were banned %s', domain.name);
        continue;
      }

      const set = new Set();
      set.add(punycode.toASCII(domain.name));
      set.add(domain.name);
      {
        // parse root domain
        const rootDomain = parseRootDomain(domain.name);
        if (domain.name !== rootDomain) {
          set.add(rootDomain);
          set.add(punycode.toASCII(rootDomain));
        }
      }

      for await (const alias of Aliases.find({
        domain: domain._id,
        is_enabled: true,
        user: {
          $nin: [...bannedUserIdsSet]
        }
      })
        .lean()
        .cursor()
        .addCursorFlag('noCursorTimeout', true)) {
        logger.debug(
          'alias %s@%s (%d recipients)',
          alias.name,
          domain.name,
          alias.recipients.length
        );
        // add alias.name @ domain.name
        // if (
        //   !alias.name.startsWith('/') &&
        //   isEmail(`${alias.name}@${domain.name}`)
        // )
        //   set.add(`${alias.name}@${domain.name}`);
        for (const recipient of alias.recipients) {
          if (isFQDN(recipient)) {
            const domain = recipient.toLowerCase();
            set.add(domain);
            set.add(punycode.toASCII(domain));
            // parse root domain
            const rootDomain = parseRootDomain(domain);
            if (domain !== rootDomain) {
              set.add(domain);
              set.add(punycode.toASCII(domain));
            }
          } else if (isEmail(recipient)) {
            // parse domain
            // const [userPortion, domain] = recipient.split('@');
            const [, domain] = recipient.split('@');
            // parse root domain
            set.add(domain);
            set.add(punycode.toASCII(domain));
            // if (alias.name.startsWith('/') && !/\$\d/.test(userPortion))
            //   set.add(recipient); // already lowercased (see alias model)
            // else set.add(recipient); // already lowercased (see alias model)
            // parse root domain
            const rootDomain = parseRootDomain(domain);
            if (domain !== rootDomain) {
              set.add(domain);
              set.add(punycode.toASCII(domain));
            }
          } else if (isIP(recipient)) {
            set.add(recipient);
          }
          // TODO: we don't ban webhooks currently
        }
      }

      // update the date for `last_allowlist_sync_at`
      await Domains.findByIdAndUpdate(domain._id, {
        $set: {
          last_allowlist_sync_at: new Date()
        }
      });

      // continue early if no results found
      if (set.size === 0) continue;

      // lookup mx records for recipient and domain
      for (const host of set) {
        if (!isFQDN(host)) continue;
        // lookup A record for the hostname
        try {
          const ips = await resolver.resolve(host);

          for (const ip of ips) {
            if (isIP(ip)) set.add(ip);
          }
        } catch (err) {
          logger.debug(err, { domain, host });
        }

        // TODO: we should also check hostnames of the exchanges for denylist (?)
        //       (we'd need to mirror this to SMTP side if so)

        //
        // lookup the MX records for the hostname
        // and then if any are found, if they are IP's then add otherwise if FQDN then lookup A records
        //
        try {
          const records = await resolver.resolveMx(host);
          if (records.length > 0) {
            for (const record of records) {
              if (isIP(record.exchange)) {
                set.add(record.exchange);
              } else if (isFQDN(record.exchange)) {
                // lookup the IP address of the exchange
                try {
                  const ips = await resolver.resolve(record.exchange);
                  for (const ip of ips) {
                    if (isIP(ip)) set.add(ip);
                  }
                } catch (err) {
                  logger.debug(err, { domain, host });
                }
              }
            }
          }
        } catch (err) {
          logger.debug(err, { domain, host });
        }
      }

      if (set.size === 0) continue;

      // filter out any values that are hardcoded and allowlisted
      if (Array.isArray(config?.rateLimit?.allowlist)) {
        for (const v of config.rateLimit.allowlist) {
          set.delete(v);
        }
      }

      // filter out any values that are allowlisted
      {
        const arr = [...set];
        const results = await client.mget(arr.map((v) => `allowlist:${v}`));
        const list = [];
        for (const [i, result] of results.entries()) {
          if (boolean(result)) list.push(arr[i]);
        }

        if (list.length > 0) {
          for (const v of list) {
            set.delete(v);
          }
        }
      }

      if (set.size === 0) continue;

      // check backscatter (filtered for ip's only)
      {
        const filteredIPs = [...set].filter((v) => isIP(v));
        if (filteredIPs.length > 0) {
          const results = await client.mget(
            filteredIPs.map((v) => `backscatter:${v}`)
          );

          const list = [];
          for (const [i, result] of results.entries()) {
            if (boolean(result)) list.push(filteredIPs[i]);
          }

          // email admins regarding this specific domain
          /*
          if (list.length > 0)
            await emailHelper({
              template: 'alert',
              message: {
                to: config.alertsEmail,
                subject: `Backscatter results detected for ${domain.name}`
              },
              locals: {
                message: `<p class="text-center">The domain ${domain.name} (${
                  domain.id
                }) had the following backscatter results:</p><ul class="mb-0 text-left"><li>${list.join(
                  '</li><li>'
                )}</li></ul>`
              }
            });
          */
        }
      }

      if (set.size === 0) continue;

      // check denylist
      {
        const arr = [...set];
        const results = await client.mget(arr.map((v) => `denylist:${v}`));
        const list = [];
        for (const [i, result] of results.entries()) {
          if (boolean(result)) list.push(arr[i]);
        }

        // email admins regarding this specific domain
        /*
        if (list.length > 0) {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `Denylist results detected for ${domain.name}`
            },
            locals: {
              message: `<p class="text-center">The domain ${domain.name} (${
                domain.id
              }) had the following denylist results:</p><ul class="mb-0 text-left"><li>${list.join(
                '</li><li>'
              )}</li></ul>`
            }
          });

          // remove all domains and emails that were denylisted
          // (paying customers shouldn't get denylisted but we monitor this via email alerts)
          const p = client.pipeline();
          for (const v of list) {
            p.del(`denylist:${v}`);
          }

          await p.exec();
        }
        */
      }

      if (set.size === 0) continue;

      // check silent ban
      {
        const arr = [...set];
        const results = await client.mget(arr.map((v) => `silent:${v}`));
        const list = [];
        for (const [i, result] of results.entries()) {
          // NOTE: we never allowlist if on silent ban, we only alert admins
          if (boolean(result)) list.push(arr[i]);
        }

        // email admins regarding this specific domain
        if (list.length > 0) {
          await emailHelper({
            template: 'alert',
            message: {
              to: config.alertsEmail,
              subject: `Silent ban results detected for ${domain.name}`
            },
            locals: {
              message: `<p class="text-center">The domain ${domain.name} (${
                domain.id
              }) had the following silent ban results:</p><ul class="mb-0 text-left"><li>${list.join(
                '</li><li>'
              )}</li></ul>`
            }
          });
          for (const v of list) {
            set.delete(v);
          }
        }
      }

      if (set.size === 0) continue;

      logger.debug('adding', { set: [...set], domain });

      const p = client.pipeline();
      for (const v of set) {
        p.set(`allowlist:${v}`, 'true', 'PX', SEVEN_DAYS_TO_MS);
      }

      await p.exec();
    }
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Sync paid alias allowlist had an error'
      },
      locals: {
        message: `<pre><code>${safeStringify(
          parseErr(err),
          null,
          2
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
