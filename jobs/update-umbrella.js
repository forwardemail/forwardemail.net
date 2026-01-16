/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const os = require('node:os');
const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const AdmZip = require('adm-zip');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const Tangerine = require('tangerine');
const dayjs = require('dayjs-with-plugins');
const getDmarcRecord = require('mailauth/lib/dmarc/get-dmarc-record');
const got = require('got');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pFilter = require('p-filter');
const pEvent = require('p-event');
const pMap = require('p-map');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const { encode } = require('html-entities');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const { boolean } = require('boolean');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');
const _ = require('#helpers/lodash');

const config = require('#config');
const setupMongoose = require('#helpers/setup-mongoose');
const emailHelper = require('#helpers/email');
const logger = require('#helpers/logger');

const concurrency = os.cpus().length;
const breeSharedConfig = sharedConfig('BREE');
const client = new Redis(breeSharedConfig.redis, logger);
const graceful = new Graceful({
  redisClients: [client],
  logger
});
// only parse 100K root domains from each list
const MAX_ROOT_DOMAINS_PER_LIST = 100000;
const MAX_RESULTS = process.env.MAX_RESULTS
  ? Number.parseInt(process.env.MAX_RESULTS, 10)
  : 50000;
const DAYS = process.env.DAYS ? Number.parseInt(process.env.DAYS, 10) : 7;
// this helps root out spammers that appear less than 50% of the time over past 7 days
const REQUIRED_FREQUENCY = Math.round(DAYS / 2); // (7 / 2 = 3.5 => 4)
const ALLOWLIST_PX_MS = ms(`${DAYS}d`);
const countByDomain = new Map();
const filteredDomains = new Set();
const badDomains = new Map();

graceful.listen();

const dates = [];
for (let i = 1; i <= DAYS; i++) {
  dates.unshift(dayjs().subtract(i, 'days').format('YYYY-MM-DD'));
}

// this uses in-memory Map cache for optimization
const resolver = new Tangerine({
  logger,
  servers: ['1.1.1.3', '1.1.0.3']
});

async function getSPFRecord(name, isRedirect = false) {
  // <https://github.com/postalsys/mailauth/blob/01e199649ee913c65028f57e81c17823ef039646/lib/spf/spf-verify.js#L77-L94>
  let responses = [];
  let spfRecord;
  let spfRr;
  try {
    responses = await resolver.resolveTxt(name);
  } catch {
    // if no DNS records found for SPF then it's not allowlisted
    return true;
  }

  for (let row of responses) {
    row = row.join('');
    const parts = row.trim().split(/\s+/);

    if (parts[0].toLowerCase() === 'v=spf1') {
      if (spfRecord) {
        // logger.warn(new Error('SPF failure'), { name });
        return true;
      }

      spfRr = row;
      spfRecord = parts.slice(1);

      if (spfRr && /[^\u0020-\u007E]/.test(spfRr)) {
        return true;
        // logger.warn(new Error('Invalid characters in DNS response'), {
        //   name
        // });
      }
    }
  }

  if (!spfRecord || spfRecord.length === 0) return true;

  //
  // handle redirect=some-url.com
  // (e.g. gmail.com has this, `dig gmail.com txt`)
  // > "v=spf1 redirect=_spf.google.com"
  //
  for (const part of spfRecord) {
    const indexOf = part.indexOf('redirect=');
    // only allow 1 redirect lookup
    if (!isRedirect && indexOf !== -1) {
      const [str] = part
        .slice(indexOf)
        .replace('redirect=', '')
        .trim()
        .split(' ');
      return getSPFRecord(str, true);
    }
  }

  // some vendors such as apple.com still use ~all
  if (!['-all', '~all'].includes(spfRecord[spfRecord.length - 1])) return true;

  return false;
}

// criteria for allowlist:
// - [X] must be within top 100K results from Umbrella Popularity List ("UPL")
// - [X] must be within top 25K results from domains appearing in at least 4 of past 7 days of UPL's
// - [X] must not be categorized as adult-content or malware by Cloudflare
//       <https://radar.cloudflare.com/categorization-feedback/>
// - [X] must have either A or MX records
// - [X] must have either MX or A or DMARC record with p=reject or p=quarantine
//       OR have an SPF record with -all or ~all qualifier
// - [X} if criteria met, then cached for 7 days (job runs daily)

async function isBadDomain(name) {
  // check if adult content or malware domain
  if (badDomains.has(name)) return badDomains.get(name);
  let isBad = false;
  let hasExchanges = false;
  let answer;
  try {
    answer = await resolver.resolve(name);
  } catch {}

  // cloudflare detects adult content or malware to be "0.0.0,0"
  isBad =
    answer &&
    Array.isArray(answer) &&
    answer.length === 1 &&
    answer[0] === '0.0.0.0';

  const hasARecords = answer && Array.isArray(answer) && answer.length > 0;

  // domain must have A or MX records (AAAA alone isn't useful)
  if (!isBad && !hasARecords) {
    try {
      const exchanges = await resolver.resolveMx(name);
      hasExchanges =
        exchanges && Array.isArray(exchanges) && exchanges.length > 0;
      if (!hasExchanges) isBad = true;
    } catch {
      isBad = true;
    }
  }

  let dmarcRecord;
  if (!isBad) {
    // <https://github.com/postalsys/mailauth#dmarc>
    // <https://github.com/postalsys/mailauth/pull/29>
    // <https://github.com/postalsys/mailauth/issues/27>
    try {
      await resolver.resolveTxt(`_dmarc.${name}`, {
        purgeCache: true
      });
      dmarcRecord = await getDmarcRecord(name, resolver.resolve);
      // {
      //   v: 'DMARC1',
      //   p: 'none',
      //   pct: 100,
      //   rua: 'mailto:foo@bar.com',
      //   sp: 'none',
      //   aspf: 'r',
      //   rr: 'v=DMARC1; p=none; pct=100; rua=mailto:foo@bar.com; sp=none; aspf=r;',
      //   isOrgRecord: false
      // }
    } catch {}
  }

  // if no A record (or) no MX (or) DMARC record (or) if DMARC record `p` is not equal to `reject` then lookup SPF policy
  // and if no SPF policy or if SPF policy does not have strict `-all` policy then set to isBad
  if (
    !isBad &&
    !hasARecords &&
    !hasExchanges &&
    (!dmarcRecord ||
      !dmarcRecord.p ||
      !['reject', 'quarantine'].includes(dmarcRecord.p))
  ) {
    isBad = await getSPFRecord(name);
  }

  if (isBad) logger.debug(`${name} was bad`, { hide_meta: true });

  // cache value for future lookups
  badDomains.set(name, isBad);

  return isBad;
}

async function checkDate(date) {
  const list = `http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m-${date}.csv.zip`;
  logger.info('updating list', { list });
  const res = await got(list, {
    responseType: 'buffer',
    // <https://github.com/sindresorhus/got/discussions/1813#discussioncomment-3249169>
    retry: {
      statusCodes: [...got.defaults.options.retry.statusCodes, 403, 404]
    }
  });

  const zip = new AdmZip(res.body);
  const zipEntries = zip.getEntries();

  let data;
  for (const entry of zipEntries) {
    if (entry.name === `top-1m.csv`) {
      data = zip.readAsText(entry);
      break;
    }
  }

  if (!data) throw new Error(`top-1m.csv was not in ZIP file`);

  const domains = new Set();
  const lines = splitLines(data);
  for (const line of lines) {
    const [, domain] = line.trim().split(',');
    // Ignore Microsoft Outlook and Outlook Address Book File (olk)
    // And also things like "internal" which shouldn't be in the Umbrella list
    if (!isFQDN(domain)) continue;

    const parseResult = parseDomain(fromUrl(domain));

    if (
      parseResult.type !== ParseResultType.Listed ||
      !_.isObject(parseResult.icann) ||
      !isSANB(parseResult.icann.domain) ||
      !_.isArray(parseResult.icann.topLevelDomains) ||
      _.isEmpty(parseResult.icann.topLevelDomains)
    )
      continue;

    // if the domain did not end with one of our
    // allowlisted domain name extensions then ignore it
    //
    // NOTE: we already allowlist through pure logic any restricted domain
    //       (e.g. if a domain ends in ".edu" it's considered allowlisted)
    //
    const tld = parseResult.icann.topLevelDomains.at(-1);
    if (
      !config.restrictedDomains.includes(tld) &&
      !config.goodDomains.includes(tld) &&
      !parseResult.icann.topLevelDomains.includes('edu') &&
      !parseResult.icann.topLevelDomains.includes('mil') &&
      !parseResult.icann.topLevelDomains.includes('gov') &&
      tld !== 'biz' &&
      tld !== 'info'
    )
      continue;

    const rootDomain = `${
      parseResult.icann.domain
    }.${parseResult.icann.topLevelDomains.join('.')}`.toLowerCase();

    // Add it to the set if it doesn't exist
    // Else if it does exist (and wasn't already parsed)
    // then increase the count by +1
    if (!domains.has(rootDomain)) {
      domains.add(rootDomain);
      if (countByDomain.has(rootDomain)) {
        countByDomain.set(rootDomain, countByDomain.get(rootDomain) + 1);
      } else {
        countByDomain.set(rootDomain, 1);
      }
    }

    if (domains.size >= MAX_ROOT_DOMAINS_PER_LIST) break;
  }

  if (domains.size === 0) throw new Error(`No domains were found for ${date}`);
}

(async () => {
  try {
    await setupMongoose(logger);

    // <http://s3-us-west-1.amazonaws.com/umbrella-static/index.html>
    await pMap(dates, checkDate, { concurrency });

    logger.info(`domains over past ${DAYS} days`, {
      count: countByDomain.size
    });

    // NOTE: we have to do this in order to preserve ranking
    for (const [domain, count] of countByDomain) {
      if (filteredDomains.size >= MAX_RESULTS) break;
      if (count >= REQUIRED_FREQUENCY) {
        // only add it to filtered domains if it passed checklist above

        const isBad = await isBadDomain(domain);
        if (!isBad) filteredDomains.add(domain);
      }
    }

    // log how many we're adding
    logger.info('filtered domains', { count: filteredDomains.size });

    // delete any allowlisted values that were on the denylist
    const denylistRemoved = await pFilter(
      [...filteredDomains],
      async (domain) => {
        const result = await client.get(`denylist:${domain}`);
        return boolean(result);
      },
      { concurrency }
    );

    // add to the cache for 7d
    const p = client.pipeline();
    for (const domain of filteredDomains) {
      p.set(`allowlist:${domain}`, 'true', 'PX', ALLOWLIST_PX_MS);
    }

    for (const domain of denylistRemoved) {
      p.del(`denylist:${domain}`);
    }

    // for (const key of specificDenylistKeys) {
    //   p.del(key);
    // }

    await p.exec();

    logger.info('successfully added domains to list', {
      count: filteredDomains.size
    });
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Update Umbrella Successful'
      },
      locals: {
        message: `
          <p class="text-center">(${
            filteredDomains.size
          }) domains were added to the allowlist:</p>
          <p class="text-center">The following (${
            denylistRemoved.length
          }) domains were removed from the denylist:</p>
          <ul class="list-inline">
            <li class="list-inline-item"><code>${
              denylistRemoved.length === 0
                ? 'No domains were removed'
                : denylistRemoved.join('</code></li><li><code>')
            }</code></li>
          </ul>
        `
      }
    });
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Update Umbrella had an error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  //
  // this should be moved to its own job but we're leaving it here for now
  //
  try {
    // <https://github.com/redis/ioredis?tab=readme-ov-file#streamify-scanning>
    const allowlistKeys = new Set();
    const domains = new Set();
    const stream = client.scanStream({
      match: 'allowlist:*',
      count: 10000,
      type: 'string'
    });
    stream.on('data', (keys) => {
      for (const key of keys) {
        allowlistKeys.add(key);
        const domain = key.replace('allowlist:', '');
        if (isFQDN(domain)) domains.add(domain);
      }
    });
    await pEvent(stream, 'end');
    logger.info('found existing allowlist keys', {
      count: allowlistKeys.size
    });
    logger.info('found existing FQDN allowlist keys', {
      count: domains.size
    });
    const badDomains = await pFilter([...domains], isBadDomain, {
      concurrency
    });
    logger.info('found existing FQDN allowlist keys that were bad domains', {
      count: badDomains.length
    });

    const p = client.pipeline();
    for (const domain of badDomains) {
      p.del(`allowlist:${domain}`);
    }

    const goodDomains = [...domains].filter(
      (domain) => !badDomains.includes(domain)
    );
    const ttlSet = [];
    await pMap(
      goodDomains,
      async (domain) => {
        // pttl
        // <https://redis.io/commands/pttl/>
        // >= redis v2.8 returns -2 if key does not exist or -1 if key exists but without expire
        // <= redis v2.6 returns -1 if key does not exist or if no associated expire
        const result = await client.pttl(`allowlist:${domain}`);
        if (result < 0 || result > ALLOWLIST_PX_MS) {
          ttlSet.push(domain);
          p.set(`allowlist:${domain}`, 'true', 'PX', ALLOWLIST_PX_MS);
        }
      },
      { concurrency }
    );
    await p.exec();

    logger.info('removing previously allowlisted domains that were bad', {
      count: badDomains.length
    });

    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Allowlist cleanup report'
      },
      locals: {
        message: `
          <p class="text-center">The following (${
            badDomains.length
          }) domains were removed from the allowlist as they did not meet the criteria:</p>
          <ul class="list-inline">
            <li class="list-inline-item"><code>${
              badDomains.length === 0
                ? 'No domains were removed'
                : badDomains.join('</code></li><li><code>')
            }</code></li>
          </ul>
          <p class="text-center">(${
            ttlSet.length
          }) previously allowlisted domains had TTL set (as they were missing TTL value).</p>
        `
      }
    });
  } catch (err) {
    await logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.alertsEmail,
        subject: 'Allowlist cleanup had an error'
      },
      locals: {
        message: `<pre><code>${encode(
          safeStringify(parseErr(err), null, 2)
        )}</code></pre>`
      }
    });
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
