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
// const ms = require('ms');
const parseErr = require('parse-err');
const pEvent = require('p-event');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');
const parseHostFromDomainOrAddress = require('#helpers/parse-host-from-domain-or-address');
const parseRootDomain = require('#helpers/parse-root-domain');
const setupMongoose = require('#helpers/setup-mongoose');
const monitorServer = require('#helpers/monitor-server');

monitorServer();

const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  mongooses: [mongoose],
  redisClients: [client],
  logger
});

// const SEVEN_DAYS_TO_MS = ms('7d');

graceful.listen();

(async () => {
  await setupMongoose(logger);

  try {
    const bannedUserIdsSet = await Users.getBannedUserIdSet(client);

    const set = new Set();

    const cursor = Domains.find({
      plan: { $in: ['enhanced_protection', 'team'] },
      // has_mx_record: true,
      has_txt_record: true
    })
      .select('name members _id')
      .lean()
      .cursor()
      .addCursorFlag('noCursorTimeout', true);

    await cursor.eachAsync(
      async (domain) => {
        logger.debug('processing %s', domain.name);

        // filter out domains where all users are banned
        if (
          !domain.members ||
          !Array.isArray(domain.members) ||
          domain.members.every((m) => bannedUserIdsSet.has(m.user.toString()))
        ) {
          logger.info('all domain users were banned %s', domain.name);
          return;
        }

        set.add(punycode.toASCII(domain.name));
        {
          // parse root domain
          const rootDomain = parseRootDomain(domain.name);
          if (domain.name !== rootDomain) {
            set.add(punycode.toASCII(rootDomain));
          }
        }

        const aliasCursor = Aliases.find({
          domain: domain._id,
          is_enabled: true,
          user: {
            $nin: [...bannedUserIdsSet]
          }
        })
          .lean()
          .select('name recipients')
          .cursor()
          .addCursorFlag('noCursorTimeout', true);

        await aliasCursor.eachAsync(
          (alias) => {
            logger.debug(
              'alias %s@%s (%d recipients)',
              alias.name,
              domain.name,
              alias.recipients.length
            );
            // add alias.name @ domain.name
            /*
            if (
              !alias.name.startsWith('/') &&
              isEmail(`${alias.name}@${domain.name}`) &&
              alias.name !== '*'
            ) {
              set.add(`${alias.name}@${domain.name}`);
            }
            */

            for (const recipient of alias.recipients) {
              if (isFQDN(recipient)) {
                const domain = recipient.toLowerCase();
                set.add(punycode.toASCII(domain));
                // parse root domain
                const rootDomain = parseRootDomain(domain);
                if (domain !== rootDomain) {
                  set.add(punycode.toASCII(domain));
                }
              } else if (isEmail(recipient)) {
                // parse domain
                // const [userPortion, domain] = recipient.split('@');
                const [, domain] = recipient.split('@');
                // parse root domain
                set.add(punycode.toASCII(domain));
                // if (alias.name.startsWith('/') && !/\$\d/.test(userPortion))
                //   set.add(recipient); // already lowercased (see alias model)
                // else set.add(recipient); // already lowercased (see alias model)
                // parse root domain
                const rootDomain = parseRootDomain(domain);
                if (domain !== rootDomain) {
                  set.add(punycode.toASCII(domain));
                }
              } else if (isIP(recipient)) {
                set.add(recipient);
              }
              // TODO: we don't ban webhooks currently
            }
          },
          { parallel: 10000 }
        );

        /*
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
      */
      },
      { parallel: 10000 }
    );

    const p = client.pipeline();

    /*
    for (const key of set) {
      p.set(`allowlist:${key}`, true, 'PX', SEVEN_DAYS_TO_MS);
    }
    */

    // denylist:*
    const denylistSet = new Set();
    {
      const stream = client.scanStream({
        match: 'denylist:*',
        count: 10000,
        type: 'string'
      });

      stream.on('data', (keys) => {
        for (const key of keys) {
          const keyWithoutPrefix = key.replace('denylist:', '');
          if (set.has(keyWithoutPrefix)) {
            p.del(key);
            denylistSet.add(keyWithoutPrefix);
          }

          if (isIP(keyWithoutPrefix)) continue;

          if (isFQDN(keyWithoutPrefix) || isEmail(keyWithoutPrefix)) {
            const host = parseHostFromDomainOrAddress(keyWithoutPrefix);
            const root = parseRootDomain(host);
            if (set.has(host)) {
              p.del(key);
              denylistSet.add(keyWithoutPrefix);
            }

            if (host !== root && set.has(root)) {
              p.del(key);
              denylistSet.add(keyWithoutPrefix);
            }
          }
        }
      });
      await pEvent(stream, 'end');
    }

    // silent:*
    const silentSet = new Set();
    {
      const stream = client.scanStream({
        match: 'silent:*',
        count: 10000,
        type: 'string'
      });

      stream.on('data', (keys) => {
        for (const key of keys) {
          const keyWithoutPrefix = key.replace('silent:', '');
          if (set.has(keyWithoutPrefix)) {
            p.del(key);
            silentSet.add(keyWithoutPrefix);
          }

          if (isIP(keyWithoutPrefix)) continue;

          if (isFQDN(keyWithoutPrefix) || isEmail(keyWithoutPrefix)) {
            const host = parseHostFromDomainOrAddress(keyWithoutPrefix);
            const root = parseRootDomain(host);
            if (set.has(host)) {
              p.del(key);
              silentSet.add(keyWithoutPrefix);
            }

            if (host !== root && set.has(root)) {
              p.del(key);
              silentSet.add(keyWithoutPrefix);
            }
          }
        }
      });
      await pEvent(stream, 'end');
    }

    // backscatter:*
    const backscatterSet = new Set();
    {
      const stream = client.scanStream({
        match: 'backscatter:*',
        count: 10000,
        type: 'string'
      });

      stream.on('data', (keys) => {
        for (const key of keys) {
          const keyWithoutPrefix = key.replace('backscatter:', '');
          if (set.has(keyWithoutPrefix)) {
            p.del(key);
            backscatterSet.add(keyWithoutPrefix);
          }

          if (isIP(keyWithoutPrefix)) continue;

          if (isFQDN(keyWithoutPrefix) || isEmail(keyWithoutPrefix)) {
            const host = parseHostFromDomainOrAddress(keyWithoutPrefix);
            const root = parseRootDomain(host);
            if (set.has(host)) {
              p.del(key);
              backscatterSet.add(keyWithoutPrefix);
            }

            if (host !== root && set.has(root)) {
              p.del(key);
              backscatterSet.add(keyWithoutPrefix);
            }
          }
        }
      });
      await pEvent(stream, 'end');
    }

    await p.exec();

    const csvContent = ['prefix,value']; // header row

    for (const key of denylistSet) {
      csvContent.push('denylist', key);
    }

    for (const key of backscatterSet) {
      csvContent.push('backscatter', key);
    }

    for (const key of silentSet) {
      csvContent.push('silent', key);
    }

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Sync paid users report',
        attachments: [
          {
            filename: 'report.csv',
            content: csvContent.join('\n')
          }
        ]
      },
      locals: {
        message: `
<ul>
  <li><strong>Denylist Removals</strong>: ${denylistSet.size}</li>
  <li><strong>Backscatter Removals</strong>: ${backscatterSet.size}</li>
  <li><strong>Silent Removals</strong>: ${silentSet.size}</li>
</ul>
        `.trim()
      }
    });
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Sync paid users had an error'
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
