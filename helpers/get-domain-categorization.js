/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Reusable helper that categorises a domain by:
//
//   1. Resolving it through Cloudflare Family DNS (1.1.1.3 / 1.1.0.3)
//      to detect adult-content or malware blocks (returns 0.0.0.0).
//   2. Fetching the domain over HTTPS (falling back to HTTP) with undici
//      and analysing the HTML content for category-specific keywords.
//   3. Checking the domain name itself against known patterns
//      (URL shortener naming, phishing look-alikes, etc.).
//
// The function returns an object with a `blocked` boolean, a list of
// `categories` (strings), and metadata such as `title`, `statusCode`,
// and `contentLength`.
//
// Usage:
//
//   const getDomainCategorization = require('#helpers/get-domain-categorization');
//   const result = await getDomainCategorization('example.com', {
//     familyResolver,   // Tangerine instance with 1.1.1.3 servers
//     logger,           // optional – defaults to module-level logger
//     timeout: 10000    // optional – HTTP timeout in ms (default 10 000)
//   });
//
//   // result.blocked        – true if Cloudflare Family DNS returned 0.0.0.0
//   // result.categories     – ['adult', 'gambling', …]
//   // result.title          – page <title> (if any)
//   // result.statusCode     – HTTP status code (if reachable)
//   // result.contentLength  – byte length of response body
//   // result.isParked       – true if domain appears parked / for sale
//   // result.error          – error string if HTTP fetch failed entirely
//

const { Buffer } = require('node:buffer');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const { parse } = require('node-html-parser');
const undici = require('undici');

const pkg = require('../package.json');

const { hasLegitimateHosting } = require('#helpers/check-domain-reputation');
const config = require('#config');
const { PARKING_IPS } = require('#config/smtp-reputation');
const loggerDefault = require('#helpers/logger');

// ───────────────────────────────────────────────────────────────────
// Keyword dictionaries for content-based categorisation
// ───────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS = {
  //
  // Parked / domain-for-sale pages
  //
  parked: [
    'domain is for sale',
    'buy this domain',
    'domain parking',
    'parked domain',
    'parked free',
    'sedoparking',
    'parkingcrew',
    'hugedomains',
    'afternic',
    'dan.com',
    'is available for purchase',
    'domain name for sale',
    'this webpage is parked',
    'domain expired',
    'has expired',
    'namecheap parking',
    'godaddy park',
    'register this domain',
    'domain may be for sale',
    'make an offer',
    'buy now for',
    'this domain is parked',
    'this domain has been registered',
    'coming soon',
    'under construction',
    'website coming soon',
    'future home of',
    'bodis.com',
    'sedo.com'
  ],

  //
  // Gambling / casino / betting
  //
  gambling: [
    'casino',
    'poker',
    'betting',
    'slot machine',
    'gambl',
    'jackpot',
    'roulette',
    'blackjack',
    'sportsbook',
    'baccarat',
    'online casino',
    'bet365',
    'live casino',
    'free spins',
    'deposit bonus',
    'wagering',
    'okebet',
    'jili',
    'scatter',
    'slot online',
    'pragmatic play',
    'pgsoft',
    'togel',
    'sbobet',
    'maxbet'
  ],

  //
  // Adult / NSFW content
  //
  adult: [
    'xxx',
    'porn',
    'adult content',
    'nsfw',
    'hentai',
    'erotic',
    'sex video',
    'nude',
    'webcam girl',
    'onlyfans',
    'chaturbate',
    'fakku',
    'doujin',
    'xvideos',
    'xhamster',
    'pornhub',
    'brazzers',
    'livejasmin',
    'cam girl',
    'adult entertainment',
    'escort service',
    'adult dating',
    'hookup'
  ],

  //
  // Phishing indicators (page content)
  //
  phishing: [
    'verify your account',
    'confirm your identity',
    'update your payment',
    'unusual activity',
    'login to continue',
    'your account has been',
    'verify your email',
    'security alert',
    'suspended your account',
    'unauthorized access',
    'confirm your details',
    'update billing',
    'reactivate your account',
    'verify ownership'
  ],

  //
  // Disposable / temporary email services
  //
  disposable_email: [
    'temp mail',
    'temporary email',
    'disposable email',
    'fake email',
    'throwaway email',
    'temp-mail',
    'tempmail',
    'anonymous email',
    'one-time email',
    'burner email',
    'temporary inbox',
    'disposable inbox',
    'guerrilla mail',
    'mailinator',
    '10 minute mail',
    '10minutemail',
    'yopmail',
    'trash mail',
    'trashmail'
  ],

  //
  // URL shortener services
  //
  url_shortener: [
    'url shortener',
    'shorten your',
    'short link',
    'link shortener',
    'shorten url',
    'create short',
    'shrink url',
    'tiny url',
    'link management',
    'custom short link',
    'branded short link',
    'link tracking'
  ],

  //
  // TikTok / social media download tools
  //
  tiktok_tool: [
    'tiktok',
    'douyin',
    'download tiktok',
    'tik tok',
    'save tiktok',
    'tiktok video',
    'snaptik',
    'ssstik',
    'musically',
    'tiktok downloader',
    'tiktok mp3',
    'tiktok watermark'
  ],

  //
  // Piracy / unlicensed streaming / manga scanlation
  //
  piracy: [
    'manga scan',
    'read manga free',
    'free movie',
    'watch online free',
    'download free movie',
    'torrent',
    'pirate',
    'mangascan',
    'komik',
    'read manga',
    'anime stream',
    'free anime',
    'watch series free',
    'free download movie',
    'hdmovie',
    'fmovie',
    '123movie',
    'putlocker',
    'soap2day',
    'gogoanime',
    'kissanime',
    'mangakakalot',
    'manganato',
    'manhwa free',
    'webtoon free'
  ],

  //
  // Crypto scams / fraudulent token schemes
  //
  crypto_scam: [
    'send btc',
    'double your bitcoin',
    'crypto airdrop',
    'free bitcoin',
    'mining profit',
    'connect wallet',
    'web3 wallet',
    'claim your tokens',
    'nft mint',
    'guaranteed return',
    'send ethereum',
    'free crypto',
    'claim airdrop',
    'flash loan',
    'rug pull',
    'pump and dump'
  ],

  //
  // Unlicensed drama / streaming sites
  //
  streaming: [
    'watch drama',
    'korean drama',
    'drama online',
    'free drama',
    'drama streaming',
    'kdrama',
    'cdrama',
    'watch series online',
    'free streaming',
    'watch movies online',
    'iptv',
    'live tv free'
  ],

  //
  // Pharmacy / controlled substance sales
  //
  pharmacy: [
    'buy viagra',
    'cheap cialis',
    'online pharmacy',
    'buy medication',
    'prescription free',
    'order pills',
    'generic viagra',
    'pharmacy online',
    'buy adderall',
    'buy xanax',
    'buy oxycodone',
    'canadian pharmacy',
    'discount medication'
  ],

  //
  // Malware / exploit distribution
  //
  malware: [
    'free crack',
    'keygen',
    'serial key',
    'activation key',
    'license key free',
    'crack download',
    'patch download',
    'full version free',
    'nulled',
    'warez'
  ]
};

// ───────────────────────────────────────────────────────────────────
// Domain-name-based pattern matching (no HTTP required)
// ───────────────────────────────────────────────────────────────────

const DOMAIN_NAME_PATTERNS = {
  //
  // URL shortener naming patterns
  //
  url_shortener: [
    'short',
    'hoshort',
    'kiwishort',
    'pandashort',
    'nextshort',
    'singshort',
    'starshort',
    'vishort',
    'shortaura',
    'shortecho',
    'shortglow',
    'shortmuse',
    'shrink',
    'tiny',
    'bitly',
    'rebrand'
  ],

  //
  // Phishing look-alike domain names
  //
  phishing: [
    'paypalservices',
    'nortonlifelock',
    'www-fidelity',
    'jp-smbc',
    'support.ssa',
    'appleid-',
    'microsoft-verify',
    'google-verify',
    'amazon-verify',
    'netflix-login',
    'bankofamerica-',
    'chase-verify',
    'wellsfargo-',
    'signin-',
    'account-verify',
    'secure-login-'
  ],

  //
  // Streaming / drama domain names
  //
  streaming: ['drama', 'flix', 'stream', 'movie', 'anime'],

  //
  // Disposable email domain names
  //
  disposable_email: [
    'tempmail',
    'throwaway',
    'fakeinbox',
    'mailnator',
    'guerrillamail',
    'trashmail',
    'yopmail',
    'sharklasers',
    'guerrillamailblock',
    'grr.la',
    'dispostable'
  ]
};

// ───────────────────────────────────────────────────────────────────
// Implementation
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve a domain through Cloudflare Family DNS and check resolved
 * IPs against known parking IPs from `config/smtp-reputation.js`.
 *
 * Returns `'blocked_by_cloudflare_family'` when the resolver returns
 * 0.0.0.0, `'parking_ip'` when the IP matches a known parking
 * address, or `false` otherwise.
 *
 * @param   {string}  name            FQDN to check
 * @param   {object}  familyResolver  Tangerine instance (1.1.1.3)
 * @returns {Promise<{dnsCategory: string|false, aRecords: string[]}>}
 */
async function checkCloudflareFamilyDNS(name, familyResolver) {
  try {
    const answer = await familyResolver.resolve(name);
    if (
      answer &&
      Array.isArray(answer) &&
      answer.length === 1 &&
      answer[0] === '0.0.0.0'
    ) {
      return { dnsCategory: 'blocked_by_cloudflare_family', aRecords: answer };
    }

    // Also check if the resolved IPs are known parking IPs
    if (answer && Array.isArray(answer)) {
      for (const ip of answer) {
        if (PARKING_IPS.has(ip)) {
          return { dnsCategory: 'parking_ip', aRecords: answer };
        }
      }

      return { dnsCategory: false, aRecords: answer };
    }

    return { dnsCategory: false, aRecords: [] };
  } catch {
    return { dnsCategory: false, aRecords: [] };
  }
}

/**
 * Fetch a domain over HTTPS (falling back to HTTP) and return the
 * response body as a string together with metadata.
 *
 * Uses the same User-Agent convention as `retryRequest` and
 * `check-domain-reputation.js` (`respondsToHTTP`).
 *
 * @param   {string}  domain
 * @param   {object}  opts
 * @param   {number}  opts.timeout
 * @param   {object}  opts.logger
 * @returns {Promise<object>}
 */
async function fetchDomainContent(domain, opts = {}) {
  const timeout = opts.timeout || 10_000;
  const log = opts.logger || loggerDefault;

  const result = {
    statusCode: null,
    contentLength: 0,
    body: '',
    title: '',
    error: null,
    server: null
  };

  //
  // undici v7 removed the `maxRedirections` request option;
  // use the redirect interceptor on a per-request Agent instead.
  //
  const dispatcher = new undici.Agent().compose(
    undici.interceptors.redirect({ maxRedirections: 5 })
  );

  for (const scheme of ['https', 'http']) {
    const url = `${scheme}://${domain}`;

    const abortController = new AbortController();
    const timer = setTimeout(() => {
      if (!abortController.signal.aborted) abortController.abort();
    }, timeout);

    try {
      const response = await undici.request(url, {
        method: 'GET',
        signal: abortController.signal,
        dispatcher,
        headers: {
          'User-Agent': `Mozilla/5.0 (compatible; ${pkg.name}/${pkg.version}; +${config.urls.web})`,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });

      clearTimeout(timer);

      result.statusCode = response.statusCode;
      result.server = response.headers.server || null;

      // Read up to 256 KB of the body to avoid memory issues
      const chunks = [];
      let totalBytes = 0;
      const MAX_BYTES = 256 * 1024;

      for await (const chunk of response.body) {
        chunks.push(chunk);
        totalBytes += chunk.length;
        if (totalBytes >= MAX_BYTES) break;
      }

      // Consume any remaining body to prevent socket hang
      try {
        if (typeof response.body?.dump === 'function') {
          await response.body.dump();
        }
      } catch {
        // ignore dump errors
      }

      const bodyBuffer = Buffer.concat(chunks);
      result.contentLength = totalBytes;
      result.body = bodyBuffer.toString('utf8');

      return result;
    } catch (err) {
      clearTimeout(timer);

      // If HTTPS failed, try HTTP
      if (scheme === 'https') {
        log.debug(`HTTPS failed for ${domain}, trying HTTP`, {
          error: err.message
        });
        continue;
      }

      result.error = err.code || err.message || 'UNKNOWN_ERROR';
      log.debug(`HTTP fetch failed for ${domain}`, {
        error: result.error
      });
    }
  }

  return result;
}

/**
 * Analyse the text content of a page and return matching categories.
 *
 * @param   {string}  textContent  Lowercased page text
 * @returns {string[]}
 */
function categoriseByContent(textContent) {
  const categories = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (textContent.includes(kw)) {
        categories.push(category);
        break; // one match per category is enough
      }
    }
  }

  return categories;
}

/**
 * Analyse the domain name itself for suspicious patterns.
 *
 * @param   {string}  domain
 * @returns {string[]}
 */
function categoriseByDomainName(domain) {
  const categories = [];
  const lc = domain.toLowerCase();

  for (const [category, patterns] of Object.entries(DOMAIN_NAME_PATTERNS)) {
    for (const pattern of patterns) {
      if (lc.includes(pattern)) {
        categories.push(category);
        break;
      }
    }
  }

  return categories;
}

/**
 * Extract the page title from raw HTML.
 *
 * @param   {string}  html
 * @returns {string}
 */
function extractTitle(html) {
  try {
    const root = parse(html);
    const titleEl = root.querySelector('title');
    if (titleEl) {
      return titleEl.text.trim().slice(0, 300);
    }
  } catch {
    // fall through
  }

  return '';
}

/**
 * Extract visible text from HTML (strip scripts, styles, tags).
 *
 * @param   {string}  html
 * @returns {string}
 */
function extractVisibleText(html) {
  try {
    const root = parse(html);

    // Remove script and style elements
    for (const el of root.querySelectorAll('script, style, noscript')) {
      el.remove();
    }

    return root.text.replace(/\s+/g, ' ').trim().slice(0, 50_000);
  } catch {
    // Fallback: crude regex strip
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text.slice(0, 50_000);
  }
}

/**
 * Main entry point – categorise a single domain.
 *
 * Performs three layers of analysis:
 *   1. Cloudflare Family DNS (1.1.1.3) – detects adult/malware blocks
 *   2. Domain-name pattern matching – URL shorteners, phishing, etc.
 *   3. HTTP content analysis – fetches the page and scans for keywords
 *
 * Additionally leverages `hasLegitimateHosting` from
 * `check-domain-reputation.js` to flag domains whose A records
 * resolve to known parking IPs (reusing the same `PARKING_IPS` set
 * from `config/smtp-reputation.js` that the SMTP approval flow uses).
 *
 * @param   {string}  domain  FQDN to categorise
 * @param   {object}  opts
 * @param   {object}  opts.familyResolver  Tangerine instance (1.1.1.3)
 * @param   {object}  [opts.logger]        Logger (defaults to module logger)
 * @param   {number}  [opts.timeout=10000] HTTP timeout in ms
 * @returns {Promise<object>}
 */
async function getDomainCategorization(domain, opts = {}) {
  const { familyResolver } = opts;
  const log = opts.logger || loggerDefault;
  const timeout = opts.timeout || 10_000;

  const result = {
    domain,
    blocked: false,
    categories: [],
    title: '',
    statusCode: null,
    contentLength: 0,
    isParked: false,
    hasLegitimateHosting: true,
    error: null
  };

  //
  // Step 1 – Cloudflare Family DNS check + parking IP / hosting check
  //
  if (familyResolver) {
    const { dnsCategory, aRecords } = await checkCloudflareFamilyDNS(
      domain,
      familyResolver
    );

    if (dnsCategory) {
      result.blocked = dnsCategory === 'blocked_by_cloudflare_family';
      result.categories.push(dnsCategory);
    }

    // Reuse hasLegitimateHosting from check-domain-reputation.js
    // (same function the SMTP approval flow uses in domains.js verifySMTP)
    if (aRecords.length > 0) {
      result.hasLegitimateHosting = hasLegitimateHosting(aRecords);
    }
  }

  //
  // Step 2 – Domain-name pattern matching (no HTTP needed)
  //
  const nameCategories = categoriseByDomainName(domain);
  for (const cat of nameCategories) {
    if (!result.categories.includes(cat)) {
      result.categories.push(cat);
    }
  }

  //
  // Step 3 – HTTP content fetch and analysis
  //
  try {
    const fetched = await fetchDomainContent(domain, { timeout, logger: log });

    result.statusCode = fetched.statusCode;
    result.contentLength = fetched.contentLength;
    result.error = fetched.error;

    if (fetched.body && fetched.body.length > 0) {
      result.title = extractTitle(fetched.body);

      const visibleText = extractVisibleText(fetched.body);
      const textLower = visibleText.toLowerCase();

      // Content-based categorisation
      const contentCategories = categoriseByContent(textLower);
      for (const cat of contentCategories) {
        if (!result.categories.includes(cat)) {
          result.categories.push(cat);
        }
      }

      // Mark as parked if the parked category was detected
      if (result.categories.includes('parked')) {
        result.isParked = true;
      }

      // If no categories matched and the page has very little content,
      // flag it as minimal / splash page
      if (
        result.categories.length === 0 &&
        result.contentLength < 500 &&
        result.statusCode &&
        result.statusCode < 400
      ) {
        result.categories.push('minimal_content');
      }
    } else if (!fetched.error && fetched.statusCode === null) {
      result.error = 'NO_RESPONSE';
    }
  } catch (err) {
    log.debug(`HTTP categorisation error for ${domain}`, {
      error: err.message
    });
    result.error = err.message;
  }

  return result;
}

module.exports = getDomainCategorization;
