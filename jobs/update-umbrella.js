// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const dns = require('dns');
const os = require('os');
const process = require('process');
const { parentPort } = require('worker_threads');

const AdmZip = require('adm-zip');
const Graceful = require('@ladjs/graceful');
const Redis = require('@ladjs/redis');
const _ = require('lodash');
const got = require('got');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const pFilter = require('p-filter');
const parseErr = require('parse-err');
const safeStringify = require('fast-safe-stringify');
const sharedConfig = require('@ladjs/shared-config');
const splitLines = require('split-lines');
const superagent = require('superagent');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');
const { boolean } = require('boolean');

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
const MAX_RESULTS = 50000;
// these domains are arbitrary 15K - 50K+ in the list
// so this is a safeguard (see below logic) to make sure we've included enough results
const REQUIRED_DOMAINS = [
  'forwardemail.net',
  'mailgun.com',
  'mailgun.info',
  'sendgrid.net',
  'postmarkapp.com',
  'mtasv.net'
];
const THREE_MONTHS_TO_MS = ms('90d');

// <https://blog.cloudflare.com/introducing-1-1-1-1-for-families/>
// eslint-disable-next-line n/prefer-promises/dns
dns.setServers([
  '1.1.1.3',
  '[2606:4700:4700::1113]',
  '1.1.0.3',
  '[2606:4700:4700::1003]'
]);

// <http://s3-us-west-1.amazonaws.com/umbrella-static/index.html>
const list = 'http://s3-us-west-1.amazonaws.com/umbrella-static/top-1m.csv.zip';

graceful.listen();

// TODO: remove all individual denylisted but @outlook @gmail @yandex @yahoo @hotmail @comcast

// <https://radar.cloudflare.com/categorization-feedback/>
const ENDPOINT = 'https://family.cloudflare-dns.com/dns-query';
const TIMEOUT = ms('10s');

async function mapper(name) {
  // check redis cache
  try {
    const result = await client.get(`bad:${name}`);

    if (result === 'true') {
      logger.info(`${name} was in bad cache`);
      return false;
    }

    if (result === 'false') {
      logger.info(`${name} was in good cache`);
      return true;
    }

    if (result) {
      client
        .del(`bad:${name}`)
        .then()
        .catch((err) => logger.fatal(err));
    }
  } catch (err) {
    logger.warn(err);
  }

  let isBad = false;
  try {
    const response = await superagent
      .get(ENDPOINT)
      .query({
        name,
        type: 'A'
      })
      .timeout(TIMEOUT)
      .set('Accept', 'application/dns-json')
      // .set('User-Agent', `${PKG.name}/${PKG.version}`)
      .send();
    const body = JSON.parse(response.body);
    isBad =
      Array.isArray(body.Answer) &&
      body.Answer.length === 1 &&
      body.Answer[0].data === '0.0.0.0';
  } catch (err) {
    logger.warn(err);
    try {
      //
      // NOTE: note that in newer Node versions we will
      // be able to configure a DNS lookup timeout
      // and we should also support this DNS + fallback approach
      // in Forward Email at some point in the future
      // and additionally ensure that the DNS lookup fallback
      // uses DNS over TLS with DNSSEC (+ documentation for self hosting)
      //
      const records = await dns.promises.resolve4(name);
      isBad =
        Array.isArray(records) &&
        records.length === 1 &&
        records[0] === '0.0.0.0';
    } catch (err) {
      logger.warn(err);
    }
  }

  if (isBad) {
    logger.info(`${name} was bad`);
    client
      .del(`allowlist:${name}`)
      .then()
      .catch((err) => logger.fatal(err));
  }

  client
    .set(`bad:${name}`, isBad.toString(), 'PX', THREE_MONTHS_TO_MS)
    .then()
    .catch((err) => logger.fatal(err));

  return !isBad;
}

// eslint-disable-next-line complexity
(async () => {
  try {
    await setupMongoose(logger);
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
      if (entry.name === 'top-1m.csv') {
        data = zip.readAsText(entry);
        break;
      }
    }

    if (!data) throw new Error('top-1m.csv was not in ZIP file');

    //       then iterate over all root domains and for the first 20K add to allowlist
    //       if size >= 20K then break out of loop
    //
    //       find the position of forward email

    const lines = splitLines(data);
    const domains = new Set();
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

      // Forward Email was #15562 as of February 3, 2023
      if (rootDomain === 'forwardemail.net')
        logger.info(`Forward Email was #${domains.size}`);

      // Add it to the set
      domains.add(rootDomain);

      // Break out when we've surpassed >= MAX_RESULTS in the list and it also has required domains
      // (e.g. forwardemail.net, mailgun, sendgrid, postmarkapp as loose result checks)
      if (
        domains.size >= MAX_RESULTS &&
        REQUIRED_DOMAINS.every((d) => domains.has(d))
      )
        break;
    }

    if (domains.size === 0) throw new Error('No domains were found');

    //
    // query against cloudflare dns for 1.1.1.3
    // (do not allowlist adult content nor malware)
    //
    logger.info('scanning domains', { count: domains.size });
    const filteredDomains = await pFilter([...domains], mapper, {
      concurrency
    });

    // log how many we're adding
    logger.info('filtered domains', { count: filteredDomains.length });

    // delete any allowlisted values that were on the existing allowlist
    // and also that were not in the new filtered domains list we're adding
    const existingRemoved = [];

    const allowlistKeys = await client.keys('allowlist:*');
    for (const key of allowlistKeys) {
      const value = key.replace('allowlist:', '');
      if (isFQDN(value) && !filteredDomains.includes(value))
        existingRemoved.push(value);
    }

    // delete any allowlisted values that were on the denylist
    const denylistRemoved = await pFilter(
      filteredDomains,
      async (domain) => {
        const result = await client.get(`denylist:${domain}`);
        return boolean(result);
      },
      { concurrency }
    );

    // add to the cache for 90d (loose rule based on domain expiration window of 90d)
    const p = client.pipeline();
    for (const domain of filteredDomains) {
      p.set(`allowlist:${domain}`, 'true', 'PX', THREE_MONTHS_TO_MS);
    }

    for (const domain of existingRemoved) {
      p.del(`allowlist:${domain}`);
    }

    for (const domain of denylistRemoved) {
      p.del(`denylist:${domain}`);
    }

    await p.exec();

    logger.info('successfully added domains to list', {
      count: filteredDomains.length
    });
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Update Umbrella Successful'
      },
      locals: {
        message: `
          <p class="text-center">Added ${
            filteredDomains.length
          } to allowlist.</p>
          <p class="text-center">The following domains were on the existing allowlist and removed:</p>
          <ul>
            <li><code>${
              existingRemoved.length === 0
                ? 'No domains were removed'
                : existingRemoved.join('</code></li><li><code>')
            }</code></li>
          </ul>
          <p class="text-center">The following domains were removed from the denylist:</p>
          <ul>
            <li><code>${
              denylistRemoved.length === 0
                ? 'No domains were removed'
                : denylistRemoved.join('</code></li><li><code>')
            }</code></li>
          </ul>
        `
      }
    });
  } catch (err) {
    logger.error(err);
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: 'Update Umbrella had an error'
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
