/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Reusable helper that categorises a domain by:
//
//   1. Resolving it through Cloudflare Family DNS (1.1.1.3 / 1.0.0.3)
//      to detect adult-content or malware blocks (returns 0.0.0.0), and
//      telling them apart with Cloudflare's security resolver (1.1.1.2).
//   2. Fetching the domain over HTTPS (falling back to HTTP) with undici
//      and analysing the HTML content for category-specific keywords.
//   3. Checking the domain name itself against known patterns
//      (URL shortener naming, phishing look-alikes, etc.), and against
//      the disposable email domain list (see `disposable-domains`).
//
// Usage:
//
//   const getDomainCategorization = require('#helpers/get-domain-categorization');
//   const result = await getDomainCategorization('example.com', {
//     familyResolver,   // Tangerine instance with 1.1.1.3 servers
//     securityResolver, // optional – Tangerine instance with 1.1.1.2 servers
//     resolver,         // optional – unfiltered Tangerine instance
//     client,           // optional – Redis client (disposable domain list)
//     logger,           // optional – defaults to module-level logger
//     timeout: 1500     // optional – ms for the whole check (default 1500)
//   });
//
//   // result.blocked        – true if Cloudflare blocks the domain (0.0.0.0
//   //                         from 1.1.1.3, and not the domain's own record)
//   // result.cloudflareBlock – 'security', 'adult' or 'unknown' when blocked
//   // result.pointsToZeroAddress – true if the domain itself points to 0.0.0.0
//   // result.noAddress      – true if the domain has no address
//   // result.dnsError       – the error code if the family resolver failed
//   // result.disposableListError – true if the list could not be read
//   // result.categories     – ['adult', 'gambling', …]
//   // result.evidence       – { adult: [{ keyword, in, excerpt }], … }
//   // result.keywordCounts  – { adult: 1, … } keywords found, also too few
//   // result.title          – page <title> (if any)
//   // result.statusCode     – HTTP status code (if reachable)
//   // result.contentLength  – byte length of the page read (decompressed)
//   // result.textLength     – characters of visible page text
//   // result.isParked       – true if parked / for sale, or on a parking IP
//   // result.isParkedLander – true for a GoDaddy parked page
//   // result.hasLegitimateHosting – false if its records are parking IPs
//   // result.error          – error string if HTTP fetch failed entirely
//   // result.timedOut       – true if the page was cut off by the timeout
//

const { Buffer } = require('node:buffer');
const dns = require('node:dns');
const net = require('node:net');
const zlib = require('node:zlib');

// eslint-disable-next-line import/no-unassigned-import
require('#helpers/polyfill-towellformed');

const { decode } = require('html-entities');
const undici = require('undici');

const pkg = require('../package.json');

const { hasLegitimateHosting } = require('#helpers/check-domain-reputation');
const { isBlockedAnswer } = require('#helpers/create-family-resolver');
const {
  DISPOSABLE_SERVICE_NAMES
} = require('#helpers/get-domain-name-restrictions');
const isPrivateHost = require('#helpers/is-private-host');
const parseRootDomain = require('#helpers/parse-root-domain');
const withDeadline = require('#helpers/with-deadline');
const { getListedDisposableDomain } = require('#helpers/disposable-domains');
const config = require('#config');
const { PARKING_IPS } = require('#config/smtp-reputation');
const loggerDefault = require('#helpers/logger');
const _ = require('#helpers/lodash');

const { isPrivateHostResolved } = isPrivateHost;

// ───────────────────────────────────────────────────────────────────
// Module-level undici dispatcher (shared across all calls)
// ───────────────────────────────────────────────────────────────────
//
// undici v7 removed the `maxRedirections` request option;
// use the redirect interceptor on a shared Agent instead.
// Creating the Agent once avoids per-call overhead and enables
// connection pooling across concurrent categorisation requests.
//
// Use a custom connect.lookup that validates resolved IPs at connect time
// to prevent DNS rebinding attacks (TOCTOU gap between isPrivateHostResolved
// pre-check and the actual TCP connection) and redirect-to-private-IP attacks.
//
// NOTE: Node's net.connect() only invokes `lookup` for hostnames. An
// IP-literal target -- e.g. a redirect to http://169.254.169.254/ -- is
// connected to directly and never reaches the validating lookup. Because
// the redirect interceptor below follows up to 5 hops, the private-address
// invariant must be enforced at the connection itself so it holds on every
// hop. The custom `connect` handles IP literals; hostnames still flow
// through the validating lookup.
const baseConnect = undici.buildConnector({
  lookup(hostname, options, fn) {
    dns.lookup(hostname, options, (err, address, family) => {
      if (err) return fn(err);
      if (address && isPrivateHost(address)) {
        const error = new Error(
          `Resolved IP ${address} is a private/reserved address`
        );
        error.code = 'EPRIVATEADDR';
        return fn(error);
      }

      return fn(null, address, family);
    });
  }
});

const dispatcher = new undici.Agent({
  connect(opts, cb) {
    if (net.isIP(opts.hostname) && isPrivateHost(opts.hostname)) {
      const error = new Error(
        `Refusing to connect to private/reserved address ${opts.hostname}`
      );
      error.code = 'EPRIVATEADDR';
      return cb(error);
    }

    return baseConnect(opts, cb);
  }
}).compose(undici.interceptors.redirect({ maxRedirections: 5 }));

// ───────────────────────────────────────────────────────────────────
// Keyword dictionaries for content-based categorisation
// ───────────────────────────────────────────────────────────────────
//
// A keyword matches as a whole word or phrase (see `KEYWORD_MATCHERS`):
// "nude" no longer matches the German "Nudeln" (noodles), "porn" the
// German "Pornowelt", or "jili" the Chinese province "Jilin".
//

//
// Page text and keywords are compared in one form: compatibility characters
// folded (fullwidth "ｃａｓｉｎｏ"), lowercased, accents and other marks
// dropped ("cásino", the Turkish "CASİNO"), the Turkish dotless "ı" read as
// "i" ("CANLI" lowercases to "canli", "canlı" is the same word), and
// invisible characters that split a word removed (a soft hyphen or
// zero-width space in "cas&shy;ino")
//
const INVISIBLE = /[\p{M}\p{Default_Ignorable_Code_Point}]/gu;

//
// Cyrillic and Greek letters that look like Latin ones, read as those in a
// word that mixes them with Latin letters ("саsino" with a Cyrillic "с" and
// "а"); a word all in Cyrillic or Greek is left as it is
//
const LOOKALIKES = new Map(
  Object.entries({
    а: 'a',
    е: 'e',
    о: 'o',
    р: 'p',
    с: 'c',
    х: 'x',
    у: 'y',
    к: 'k',
    і: 'i',
    ј: 'j',
    ѕ: 's',
    ԁ: 'd',
    һ: 'h',
    ӏ: 'l',
    α: 'a',
    ε: 'e',
    ι: 'i',
    κ: 'k',
    ν: 'v',
    ο: 'o',
    ρ: 'p',
    τ: 't',
    υ: 'u',
    χ: 'x'
  })
);
const OTHER_SCRIPT = /[\p{Script=Cyrillic}\p{Script=Greek}]/u;

// (typographic apostrophes, which WordPress and word processors put in
//  "don’t", read as plain ones)
const APOSTROPHES = /[‘’‛]/g;
const WORD = /\p{L}+/gu;

function foldLookalikes(word) {
  if (!/[a-z]/.test(word) || !OTHER_SCRIPT.test(word)) return word;
  let folded = '';
  for (const char of word) folded += LOOKALIKES.get(char) || char;
  return folded;
}

// (`limit`: characters kept, cut before the slowest step)
function normalizeText(text, limit = Number.POSITIVE_INFINITY) {
  const folded = text
    .normalize('NFKC')
    .toLowerCase()
    .replaceAll('ı', 'i')
    .normalize('NFKD')
    .replace(INVISIBLE, '')
    .replace(APOSTROPHES, "'")
    .slice(0, limit);
  return OTHER_SCRIPT.test(folded) && /[a-z]/.test(folded)
    ? folded.replace(WORD, foldLookalikes)
    : folded;
}

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
    // (games and betting, also named by casino hotels, travel guides and
    //  sports news: see `SUPPORTING_KEYWORDS`)
    'casino',
    'poker',
    'betting',
    'sports betting',
    'slot machine',
    'gambling',
    'gamble',
    'gambler',
    'jackpot',
    'roulette',
    'blackjack',
    'sportsbook',
    'baccarat',
    'wagering',
    'apuestas',
    'cassino',
    'apostas',
    'казино',
    'machines à sous',
    'игровые автоматы',
    '博彩',
    '百家乐',
    '카지노',
    '바카라',
    '스포츠 배팅',
    // (sports news and charities show these notices too)
    'responsible gaming',
    'gamble responsibly',
    'gambleaware',
    'welcome offer',
    'welcome bonus',
    'min deposit',
    'minimum deposit',
    'bonus de bienvenue',
    'argent réel',
    'bahis',
    'place your bets',
    'live casino',
    'bet365',
    'echtgeld',
    'kasyno online',
    // (also paper trading, a game's shop, free walking tours and rides)
    'real money',
    'tours gratuits',
    'giri gratis',
    'scommesse',
    // (an operator: deposits, bonuses and brands)
    'online casino',
    'casino online',
    'free spins',
    'deposit bonus',
    'no deposit bonus',
    'free bets',
    'bet now',
    'online slots',
    'crypto casino',
    'provably fair',
    'rakeback',
    'okebet',
    'jili',
    'slot online',
    'slot gacor',
    'gacor',
    'maxwin',
    'judi online',
    'pragmatic play',
    'pgsoft',
    'togel',
    'sbobet',
    'maxbet',
    'casino en línea',
    'giros gratis',
    'cassino online',
    'apostas esportivas',
    'онлайн казино',
    'nhà cái',
    'สล็อต',
    '网上赌场',
    'casino en ligne',
    'bonus senza deposito',
    'фриспины',
    'オンラインカジノ',
    '入金不要ボーナス',
    'ライブカジノ',
    'deneme bonusu',
    'canlı casino',
    'yatırımsız',
    'fortune tiger',
    'plataforma nova pagando',
    'bônus sem depósito',
    'freispiele',
    'online spielothek',
    'darmowe spiny',
    '온라인 카지노',
    '카지노 사이트',
    '토토사이트',
    '꽁머니',
    'online betting',
    'online sportsbook',
    'in-play betting',
    'live betting',
    'bookmaker',
    'online poker',
    'poker online',
    'real money poker',
    'poker en ligne',
    'ставки на спорт',
    'букмекер'
  ],

  //
  // Adult / NSFW content
  //
  // (no "xxx": it is the usual placeholder, as in "MCAP XXXX" or "key_xxx")
  //
  adult: [
    // (also used by sex education, health clinics, therapists, art and
    //  parental controls: see `SUPPORTING_KEYWORDS`)
    'porn',
    'porno',
    'pornography',
    'pornographic',
    'nude',
    'nudity',
    'erotic',
    'erotica',
    'nsfw',
    'adult content',
    'adult material',
    'adult entertainment',
    'sexual activity',
    'sexually explicit',
    'hookup',
    'escort service',
    'onlyfans',
    'doujin',
    'you must be 18',
    'i am 18 or older',
    '18 or older to enter',
    'adults only',
    'incall',
    'outcall',
    'onlyfans leaks',
    'leaked nudes',
    'порно',
    '色情',
    // (a site showing it, selling it, or behind an age gate)
    'pornstar',
    'free porn',
    'porn video',
    'xxx video',
    'xxx movie',
    'xxx tube',
    'sex movie',
    'sex tube',
    'sex video',
    'sex cam',
    'sex chat',
    'live sex',
    'webcam girl',
    'cam girl',
    'milf',
    'hentai',
    'adult dating',
    'independent escorts',
    'chaturbate',
    'fakku',
    'xvideos',
    'xhamster',
    'pornhub',
    'brazzers',
    'livejasmin',
    'free nudes',
    'big tits',
    '18 u.s.c. 2257',
    '2257 statement',
    '無修正',
    'エロ動画',
    '成人影片',
    'порно видео',
    'секс видео',
    '无码',
    'sexo grátis',
    'porno gratis',
    'videos porno',
    'filmy porno',
    'darmowe porno',
    'porno gratuit',
    'film porno',
    'sexe en direct'
  ],

  //
  // Phishing indicators (page content)
  //
  // (every sign-in, sign-up and billing page says the first of these, so
  //  they only count on a page asking for credentials, next to pressure
  //  wording or a brand it impersonates: see `getContentCategories`)
  //
  phishing: [
    'verify your account',
    'confirm your identity',
    'verify your identity',
    'update your payment',
    'login to continue',
    'your account has been',
    'verify your email',
    'security alert',
    'confirm your details',
    'update billing',
    'verify ownership',
    'confirm your account',
    // (pressure)
    'unusual activity',
    'unauthorized access',
    'account suspended',
    'suspended your account',
    'reactivate your account',
    'has been limited',
    'has been locked',
    // (longer than "your account has been", which would take its words)
    'account has been suspended',
    'has been suspended',
    'temporarily limited',
    'could not be delivered',
    'delivery attempt failed',
    'redelivery fee',
    'account will be suspended',
    'account will be closed',
    'will be deactivated',
    'avoid suspension',
    'sua conta foi bloqueada',
    'atualização cadastral',
    'konto wurde gesperrt',
    'sicherheitsüberprüfung',
    'votre compte a été suspendu',
    'su cuenta ha sido suspendida',
    'аккаунт заблокирован',
    'アカウントがロック',
    '異常なアクティビティ'
  ],

  //
  // Disposable / temporary email services
  //
  // (no "fake email" or "anonymous email": email alias and security
  //  services say them)
  //
  disposable_email: [
    // (also in sign-up rules and privacy articles: see `SUPPORTING_KEYWORDS`)
    'temporary email',
    'disposable email',
    'one-time email',
    'email palsu',
    'tijdelijk e-mailadres',
    'email usa e getta',
    'indirizzo usa e getta',
    'tymczasowy email',
    'tymczasowy e-mail',
    'jednorazowy email',
    'jednorazowy e-mail',
    '임시 이메일',
    '일회용 이메일',
    'بريد إلكتروني مؤقت',
    // (a test inbox developers name too)
    'mailinator',
    // (a service)
    'temp mail',
    'temp-mail',
    'tempmail',
    'temporary inbox',
    'temporary mailbox',
    'disposable inbox',
    'throwaway email',
    'throwaway inbox',
    'burner email',
    'guerrilla mail',
    '10 minute mail',
    '10minutemail',
    'yopmail',
    'trash mail',
    'trashmail',
    // (the same services in other languages)
    'correo temporal',
    'email temporal',
    'correo desechable',
    'email temporário',
    'e-mail temporário',
    'email descartável',
    'email temporaire',
    'e-mail temporaire',
    'adresse email temporaire',
    'mail temporaire',
    'email jetable',
    'mail jetable',
    'adresse jetable',
    'email temporanea',
    'email sementara',
    'geçici e-posta',
    'wegwerf-e-mail',
    'wegwerfmail',
    'wegwerf-mail',
    'wegwerf e-mail',
    'temporäre e-mail',
    'временная почта',
    'одноразовая почта',
    '临时邮箱',
    '一次性邮箱',
    '使い捨てメール',
    '捨てアド',
    'email tạm thời',
    'hộp thư tạm thời',
    'geçici mail',
    'tek kullanımlık e-posta',
    'wegwerp e-mail',
    'tymczasowa poczta',
    'tymczasowy adres e-mail',
    '임시 메일',
    '임시 메일함',
    '10분 메일',
    'بريد مؤقت',
    'بريدك المؤقت',
    'your temporary email address',
    'waiting for incoming emails',
    'disposable email service',
    'temporary email service',
    'free temporary email',
    'free disposable email',
    'fake email generator',
    'fake mail generator',
    'wegwerf email'
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
  // (a page naming TikTok, a news story or a footer link, is not one)
  //
  tiktok_tool: [
    'tiktok',
    'douyin',
    'tik tok',
    'tiktok video',
    'download tiktok',
    'save tiktok',
    'snaptik',
    'ssstik',
    'tiktok downloader',
    'tiktok mp3',
    'tiktok watermark'
  ],

  //
  // Piracy / unlicensed streaming / manga scanlation
  //
  // (no "pirate": a restaurant or a game uses it)
  //
  piracy: [
    // (also in libraries, reviews of legal services and torrent client
    //  docs: see `SUPPORTING_KEYWORDS`)
    'torrent',
    'seeders',
    'leechers',
    'free movie',
    'watch online free',
    'read manga',
    'manga scan',
    'mangascan',
    'anime stream',
    'free anime',
    'komik',
    'watch full movie',
    'film izle',
    'dizi izle',
    // (a site serving it)
    'read manga free',
    'download free movie',
    'free download movie',
    'watch series free',
    'manhwa free',
    'webtoon free',
    'hdmovie',
    'fmovie',
    '123movie',
    'putlocker',
    'soap2day',
    'gogoanime',
    'kissanime',
    'mangakakalot',
    'manganato',
    'phim vietsub',
    'xem phim online miễn phí',
    'assistir filmes online grátis',
    'filme completo dublado',
    'ver películas online gratis',
    'full hd film izle',
    'фильмы онлайн бесплатно',
    'nonton film gratis',
    'lk21',
    'repack',
    'read manga online',
    'manga online free',
    'manga free online',
    'torrent site',
    'bittorrent site',
    'tv torrents',
    'verified torrents',
    'search torrents'
  ],

  //
  // Crypto scams / fraudulent token schemes, and meme coin launches
  //
  // (no "rug pull", "pump and dump", "flash loan" or "web3 wallet": a
  //  warning or a developer's guide says them, a scam does not)
  //
  crypto_scam: [
    // (also on exchanges, wallets and developer docs: see
    //  `SUPPORTING_KEYWORDS`)
    'connect wallet',
    'connect your wallet',
    'contract address',
    'tokenomics',
    'fair launch',
    'nft mint',
    'meme coin',
    'memecoin',
    'dexscreener',
    'dextools',
    'recovery phrase',
    'seed phrase',
    'claim rewards',
    'presale',
    'ca tba',
    'pump.fun',
    'cloud mining',
    'daily returns',
    '连接钱包',
    'claim your tokens',
    // (a wallet's own pages, a learn-and-earn quiz, a card's rewards)
    'send btc',
    'send ethereum',
    'free crypto',
    'receive 2x',
    // (what a wallet drainer asks for, next to a recovery phrase field)
    'import wallet',
    'validate wallet',
    'wallet validation',
    'synchronize wallet',
    'secret phrase',
    '12 word phrase',
    '24 word phrase',
    // (a lure, or a launch)
    'send back double',
    'double your bitcoin',
    'free bitcoin',
    'crypto airdrop',
    'claim airdrop',
    'eligible wallet',
    'guaranteed return',
    'mining profit',
    'stealth launch',
    'ca: tba',
    'ca:tba',
    'bitcoin giveaway',
    'guaranteed profit',
    '领取空投'
  ],

  //
  // Email services: hosting mailboxes or sending for others (a domain
  // used to run one on top of ours)
  //
  email_service: [
    'email hosting',
    'custom domain email',
    'email for your domain',
    'free email account',
    'create a free email',
    'create your email account',
    'unlimited mailboxes',
    'smtp relay',
    'smtp service',
    'bulk email',
    'mass mailing',
    'email api',
    'transactional email'
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
    // (also on pharmacy chains, drug makers and telehealth: see
    //  `SUPPORTING_KEYWORDS`)
    'online pharmacy',
    'online pharmacies',
    'pharmacy online',
    'canadian pharmacy',
    'canadian pharmacies',
    'generic viagra',
    'generic cialis',
    'no prescription',
    'without a prescription',
    'prescription free',
    'discount medication',
    'sildenafil',
    'tadalafil',
    'levitra',
    'viagra',
    'cialis',
    'ohne rezept',
    'sin receta',
    'sans ordonnance',
    'sem receita',
    'без рецепта',
    'senza ricetta',
    'bez recepty',
    'ozempic',
    'semaglutide',
    'oxycodone',
    'xanax',
    'adderall',
    'tramadol',
    'виагра',
    'сиалис',
    'силденафил',
    'тадалафил',
    // (an over-the-counter medicine: "Narcan, no Rx needed")
    'no rx',
    // (selling it: "without prescription", without the article, is spam)
    'buy viagra',
    'order viagra',
    'buy cialis',
    'cheap cialis',
    'without prescription',
    'bonus pills',
    'kamagra',
    'buy medication',
    'order pills',
    'buy adderall',
    'buy xanax',
    'buy oxycodone',
    'order oxycodone',
    'buy tramadol',
    'buy valium',
    'cheap viagra',
    'comprar viagra',
    'viagra ohne rezept',
    'cialis ohne rezept',
    'viagra sin receta',
    'cialis sin receta',
    'viagra sans ordonnance',
    'cialis sans ordonnance',
    'viagra sem receita',
    'cialis sem receita',
    'viagra senza ricetta',
    'viagra bez recepty',
    'виагра без рецепта',
    'купить виагру',
    'купить сиалис',
    'adderall for sale',
    'oxycodone for sale',
    'xanax for sale',
    'buy generic viagra',
    'buy generic cialis',
    'without medical prescription',
    'without doctor prescription'
  ],

  //
  // Malware / exploit distribution
  //
  // (no "activation key" or "serial key": a shop selling licenses says them)
  //
  malware: [
    // (a game's own subscription page says these)
    'pro unlocked',
    'unlimited coins',
    'nulled',
    'full version free',
    'patch download',
    'premium unlocked',
    // (a site serving it)
    'free crack',
    'keygen',
    'crack download',
    'license key free',
    'warez',
    'mod apk',
    'cracked apk',
    'nulled script',
    'nulled theme',
    'nulled plugin',
    'kmspico',
    'kmsauto',
    'windows activator',
    'office activator',
    'активатор windows',
    'crackli',
    'full indir',
    'unlimited money',
    'mod menu',
    'standalone setup',
    'offline installer standalone'
  ]
};

//
// Keywords that also describe legitimate pages: a casino hotel, sports
// news, a bank's welcome offer, a vape shop's age gate, a sex education
// site, an exchange or a pharmacy chain. They count toward a category's
// keywords but cannot make one on their own: a category needs at least one
// other keyword, one that says the site runs or sells it (an operator's
// "free spins", a tube site, a lure such as "claim airdrop"). Each list
// has them first, up to the keyword named here. For phishing they are a
// sign-in's wording, and the rest is pressure.
//
const FIRST_DECIDING_KEYWORD = {
  gambling: 'online casino',
  adult: 'pornstar',
  phishing: 'unusual activity',
  disposable_email: 'temp mail',
  piracy: 'read manga free',
  crypto_scam: 'send back double',
  pharmacy: 'buy viagra',
  malware: 'free crack',
  tiktok_tool: 'download tiktok'
};

const SUPPORTING_KEYWORDS = new Set(
  Object.entries(FIRST_DECIDING_KEYWORD).flatMap(([category, first]) => {
    const keywords = CATEGORY_KEYWORDS[category];
    if (!keywords.includes(first)) throw new Error(`${category}: ${first}`);
    return keywords.slice(0, keywords.indexOf(first));
  })
);

//
// Brands phishing pages copy. A page asking for credentials whose title is
// a sign-in to one and nothing else ("Microsoft 365 – Sign in", "PayPal:
// Log in to your account", "MetaMask - Restore Wallet") is phishing on its
// own; one that only names it ("Microsoft 365 partner", "Sign in to
// Example, the PayPal of payroll", "Sign in with Google") is not.
//
const PHISHING_BRANDS = [
  'microsoft',
  'microsoft 365',
  'microsoft account',
  'office 365',
  'outlook',
  'onedrive',
  'sharepoint',
  'google',
  'google account',
  'gmail',
  'apple',
  'apple id',
  'icloud',
  'paypal',
  'netflix',
  'amazon',
  'facebook',
  'instagram',
  'docusign',
  'dropbox',
  'adobe',
  'wells fargo',
  'bank of america',
  'chase',
  'usps',
  'dhl',
  'fedex',
  'coinbase',
  'binance',
  'metamask',
  'banco do brasil',
  'sparkasse',
  'poste italiane',
  'klikbca'
];

//
// The sites of these brands, and of sign-in services, where a domain sends
// a browser to its webmail or its single sign-on. A sign-in page one of
// them serves after a redirect is not phishing; one any other site serves
// is (a domain sending a browser on to a phishing kit).
//
const SIGN_IN_SITES = new Set([
  'microsoft.com',
  'microsoftonline.com',
  'live.com',
  'office.com',
  'office365.com',
  'outlook.com',
  'sharepoint.com',
  'google.com',
  'gmail.com',
  'apple.com',
  'icloud.com',
  'paypal.com',
  'netflix.com',
  'amazon.com',
  'facebook.com',
  'instagram.com',
  'docusign.com',
  'docusign.net',
  'dropbox.com',
  'adobe.com',
  'wellsfargo.com',
  'bankofamerica.com',
  'chase.com',
  'usps.com',
  'dhl.com',
  'fedex.com',
  'coinbase.com',
  'binance.com',
  'metamask.io',
  'bb.com.br',
  'sparkasse.de',
  'poste.it',
  'klikbca.com',
  'okta.com',
  'auth0.com',
  'onelogin.com',
  'yahoo.com',
  'zoho.com',
  'proton.me',
  'fastmail.com',
  'forwardemail.net'
]);

// (the words a sign-in page's title adds to a brand: one of the first, and
//  only these)
const SIGN_IN_ACTIONS = new Set(
  [
    'sign',
    'signin',
    'log',
    'login',
    'logon',
    'verify',
    'verification',
    'restore',
    'recover',
    'recovery',
    'unlock',
    'sync',
    'validate',
    'redelivery',
    'update',
    'confirm',
    'review',
    'security',
    'shared',
    // (the same in other languages)
    'anmelden',
    'anmeldung',
    'einloggen',
    'connexion',
    'connecter',
    'iniciar',
    'sesión',
    'entrar',
    'accedi',
    'accesso',
    'inloggen',
    'zaloguj',
    'logowanie',
    'masuk',
    'giriş',
    'вход',
    'войти',
    'ログイン',
    'サインイン',
    '登录',
    '登入'
  ].map((word) => normalizeText(word))
);
const SIGN_IN_TITLE_WORDS = new Set([
  ...SIGN_IN_ACTIONS,
  ...[
    'in',
    'on',
    'up',
    'or',
    'to',
    'with',
    'you',
    'your',
    'my',
    'the',
    'a',
    'of',
    'and',
    'com',
    'account',
    'accounts',
    'id',
    'user',
    'alert',
    'details',
    'information',
    'method',
    'membership',
    'payment',
    'billing',
    'card',
    'cards',
    'internet',
    'secure',
    'online',
    'bank',
    'banking',
    'password',
    'package',
    'parcel',
    'delivery',
    'express',
    'tracking',
    'document',
    'documents',
    'file',
    'view',
    'locked',
    'web',
    'app',
    'mail',
    'email',
    'wallet',
    // (the same in other languages)
    'se',
    'de',
    'inicio',
    'mon',
    'votre',
    'compte',
    'konto',
    'ihr',
    'sua',
    'conta',
    'su',
    'mi',
    'cuenta',
    'il',
    'tuo',
    'uw',
    'akun',
    'anda',
    'アカウント'
  ].map((word) => normalizeText(word))
]);

//
// The title of a sign-in page with no brand in it (Microsoft's own): on a
// page asking for credentials it is possible phishing
//
const SIGN_IN_TITLES = new Set(['sign in to your account']);

//
// Content categories that put a domain up for review (parked only describes
// it, and streaming is listed on one keyword; email_service and
// possible_phishing are listed in the digest only, see
// `helpers/check-domain-and-act`). One keyword is not enough for these: a
// portfolio listing a poker game or a gambling-addiction charity mentions
// one in passing. Each needs `MIN_CONTENT_KEYWORDS` different
// keywords, in the page text or in its title and description, at least one
// of them not a supporting one (see `SUPPORTING_KEYWORDS`); phishing has
// its own rule (see `getContentCategories`).
//
const ACTIONABLE_CONTENT_CATEGORIES = new Set([
  'email_service',
  'url_shortener',
  'tiktok_tool',
  'adult',
  'gambling',
  'phishing',
  'disposable_email',
  'piracy',
  'crypto_scam',
  'pharmacy',
  'malware'
]);

const MIN_CONTENT_KEYWORDS = 2;

//
// Forms of one word or phrase, counted as one keyword: an addiction
// therapist writing "pornography" and "pornographic", or a page saying a
// medicine is sold "without a prescription" ("no prescription needed"),
// uses one idea, not two. A keyword that holds another ("online casino",
// "casino") is a form of it too (see `KEYWORD_SIGNAL`).
//
const KEYWORD_FORMS = [
  ['porn', 'porno', 'pornstar', 'pornography', 'pornographic'],
  ['nude', 'nudity'],
  ['erotic', 'erotica'],
  ['gambling', 'gamble', 'gambler'],
  ['online pharmacy', 'online pharmacies', 'pharmacy online'],
  ['canadian pharmacy', 'canadian pharmacies'],
  ['online casino', 'casino online'],
  ['12 word phrase', '24 word phrase'],
  [
    'no prescription',
    'without a prescription',
    'without prescription',
    'without doctor prescription',
    'without medical prescription',
    'prescription free',
    'no rx'
  ],
  ['manga online free', 'manga free online'],
  ['temp mail', 'temp-mail', 'tempmail'],
  ['trash mail', 'trashmail'],
  ['10 minute mail', '10minutemail'],
  ['correo temporal', 'email temporal'],
  ['email temporário', 'e-mail temporário'],
  [
    'email temporaire',
    'e-mail temporaire',
    'adresse email temporaire',
    'mail temporaire'
  ],
  ['email jetable', 'mail jetable', 'adresse jetable'],
  [
    'wegwerf-e-mail',
    'wegwerf e-mail',
    'wegwerf email',
    'wegwerfmail',
    'wegwerf-mail'
  ],
  ['download free movie', 'free download movie'],
  ['meme coin', 'memecoin'],
  ['connect wallet', 'connect your wallet'],
  ['crypto airdrop', 'claim airdrop'],
  ['ca tba', 'ca: tba', 'ca:tba']
];

//
// A keyword matches when it is not part of a longer word: no letter of its
// own script or underscore right before or after it (so "Nudeln" and
// "Jilin" do not match, while brand names with digits such as "SBOBET88" or
// "888casino" and keywords next to Chinese or Japanese text still do;
// Chinese, Japanese and Thai keywords match anywhere, as those languages
// have no spaces between words). A plural "s" is allowed, so "casino"
// matches "casinos" and "fmovie" matches "fmovies", and the words of a
// phrase can be apart by a hyphen or a dash, or written together
// ("online-casino", "FreeSpins"). A colon
// is not one: it ends a heading ("Watch live: Sex Education"), so "CA: TBA"
// is a keyword of its own.
//
// Each matcher comes with the longest word of its keyword: most keywords are
// absent, and `includes` is far cheaper than the regex.
//
const WORD_SCRIPTS = ['Latin', 'Cyrillic', 'Greek'];

function getBoundary(char) {
  const script = WORD_SCRIPTS.find((script) =>
    new RegExp(`\\p{Script=${script}}`, 'u').test(char)
  );
  return script ? `[\\p{Script=${script}}_]` : null;
}

const KEYWORD_MATCHERS = new Map();
for (const keywords of Object.values(CATEGORY_KEYWORDS)) {
  for (const keyword of keywords) {
    if (KEYWORD_MATCHERS.has(keyword)) continue;
    const words = normalizeText(keyword).split(' ');
    const phrase = words.join(' ');
    const before = getBoundary(phrase.at(0));
    const after = getBoundary(phrase.at(-1));
    // (a keyword starting or ending with a digit, such as "2257", is not
    //  part of a longer number)
    const digitBefore = /\p{Nd}/u.test(phrase.at(0)) ? '(?<!\\p{Nd})' : '';
    const digitAfter = /\p{Nd}/u.test(phrase.at(-1)) ? '(?!\\p{Nd})' : '';
    // (written together only when each word has three letters or more:
    //  "norx" is not "no rx")
    const body = words
      .map((word) => _.escapeRegExp(word))
      .join(
        words.every((word) => word.length >= 3)
          ? '\\s{0,3}[-–—]?\\s{0,3}'
          : '(?:\\s{1,3}|\\s{0,3}[-–—]\\s{0,3})'
      );
    KEYWORD_MATCHERS.set(keyword, {
      probe: _.maxBy(words, (word) => word.length),
      length: phrase.length,
      phrase,
      regex: new RegExp(
        `${digitBefore}${before ? `(?<!${before})` : ''}${body}${
          after && after.includes('Latin') ? 's?' : ''
        }${after ? `(?!${after})` : ''}${digitAfter}`,
        'gu'
      )
    });
  }
}

// (longest first, see `findKeywords`)
const SORTED_KEYWORDS = new Map(
  Object.values(CATEGORY_KEYWORDS).map((keywords) => [
    keywords,
    _.sortBy(keywords, (keyword) => -KEYWORD_MATCHERS.get(keyword).length)
  ])
);

//
// The different keywords among those found: forms of one (see
// `KEYWORD_FORMS`) are one, and so is a keyword with a longer one of its
// category holding it as a whole word ("casino" and "online casino" on one
// page are one keyword, "read manga" and "read manga free" too). A longer
// keyword takes in one shorter one at most: "buy viagra", "cheap viagra" and
// "viagra" are two, and so are "viagra", "ohne Rezept" and "Viagra ohne
// Rezept", so a page saying more never counts fewer.
//
const FORM_SIGNAL = new Map(
  KEYWORD_FORMS.flatMap((forms) => forms.map((form) => [form, forms[0]]))
);

// keyword → the longer keywords of its category holding it, shortest first
const HOLDERS = new Map();
for (const keywords of Object.values(CATEGORY_KEYWORDS)) {
  // (shortest first)
  const shortestFirst = [...SORTED_KEYWORDS.get(keywords)].reverse();
  for (const keyword of shortestFirst) {
    const { regex, length } = KEYWORD_MATCHERS.get(keyword);
    const holders = shortestFirst.filter(
      (other) =>
        KEYWORD_MATCHERS.get(other).length > length &&
        new RegExp(regex.source, 'u').test(KEYWORD_MATCHERS.get(other).phrase)
    );
    if (holders.length > 0) HOLDERS.set(keyword, holders);
  }
}

function getSignals(found) {
  // keyword → the longer one found taking it in
  const takenBy = new Map();
  const taking = new Set();
  const shortestFirst = _.sortBy(
    [...found],
    (keyword) => KEYWORD_MATCHERS.get(keyword).length
  );
  for (const keyword of shortestFirst) {
    const holder = (HOLDERS.get(keyword) || []).find(
      (other) => found.has(other) && !taking.has(other)
    );
    if (!holder) continue;
    takenBy.set(keyword, holder);
    taking.add(holder);
  }

  // (a holder is longer, so this ends)
  const getSignal = (keyword) =>
    takenBy.has(keyword)
      ? getSignal(takenBy.get(keyword))
      : FORM_SIGNAL.get(keyword) || keyword;
  return new Set([...found].map((keyword) => getSignal(keyword)));
}

// (a keyword's matches looked at, at most)
const MAX_MATCHES = 5000;

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
  disposable_email: DISPOSABLE_SERVICE_NAMES
};

// ───────────────────────────────────────────────────────────────────
// Implementation
// ───────────────────────────────────────────────────────────────────

//
// A domain is checked within this (its DNS lookups and its page, which are
// asked at once): a check waits for no server longer, and what is not in
// by then is not read (see `wasPageRead` in `check-domain-and-act`).
//
const DEFAULT_TIMEOUT_MS = 1500;

/**
 * Resolve a domain through Cloudflare Family DNS and check resolved
 * IPs against known parking IPs from `config/smtp-reputation.js`.
 *
 * Its `dnsCategory` is `'blocked_by_cloudflare_family'` when the resolver
 * answers 0.0.0.0, `'parking_ip'` when an address is a known parking
 * address, `'dns_error'` when the lookup fails (not for a domain with no
 * address), or `false` otherwise.
 *
 * A blocked domain is then asked of Cloudflare's security resolver
 * (1.1.1.2), which blocks malware and phishing but not adult content,
 * to tell the two apart (`cloudflareBlock`):
 *
 *   - `'security'`  blocked by both: Cloudflare lists it as a threat
 *   - `'adult'`     blocked by the family resolver only
 *   - `'unknown'`   no security resolver, or it failed to answer
 *
 * Both answer a domain's own 0.0.0.0 record as they get it (a domain that
 * sends mail only can point there), so a block that is not adult-only is
 * also asked of an unfiltered resolver: when it answers 0.0.0.0 too, it is
 * not a block (`pointsToZeroAddress`).
 *
 * @param   {string}  name              FQDN to check
 * @param   {object}  familyResolver    Tangerine instance (1.1.1.3)
 * @param   {object}  [securityResolver]  Tangerine instance (1.1.1.2)
 * @param   {object}  [resolver]        Tangerine instance (unfiltered)
 * @returns {Promise<{dnsCategory: string|false, aRecords: string[], cloudflareBlock?: string, onParkingIp?: boolean, pointsToZeroAddress?: boolean, dnsError?: string}>}
 */
async function checkCloudflareFamilyDNS(
  name,
  familyResolver,
  securityResolver,
  resolver
) {
  let answer;
  try {
    answer = await familyResolver.resolve(name);
  } catch (err) {
    //
    // A domain with no address (no website yet, or not registered) is
    // simply not blocked: every new domain without one was listed as a
    // DNS error for review
    //
    if (err.code === 'ENODATA' || err.code === 'ENOTFOUND')
      return { dnsCategory: false, aRecords: [], noAddress: true };

    //
    // Track DNS errors separately so they appear in the digest
    // instead of silently treating unreachable domains as clean.
    //
    return {
      dnsCategory: 'dns_error',
      aRecords: [],
      dnsError: err.code || err.message || 'UNKNOWN_DNS_ERROR'
    };
  }

  if (!Array.isArray(answer) || answer.length === 0)
    return { dnsCategory: false, aRecords: [], noAddress: true };

  // Cloudflare Family DNS returns 0.0.0.0 for blocked domains
  if (isBlockedAnswer(answer)) {
    let cloudflareBlock = 'unknown';
    let aRecords = answer;
    if (securityResolver) {
      try {
        const security = await securityResolver.resolve(name);
        if (isBlockedAnswer(security)) {
          cloudflareBlock = 'security';
        } else {
          cloudflareBlock = 'adult';
          // (its answer is the domain's own records, e.g. a parking IP)
          if (Array.isArray(security) && security.length > 0)
            aRecords = security;
        }
      } catch {
        // (left as 'unknown': the block stands on its own)
      }
    }

    //
    // (a domain pointing to 0.0.0.0 itself gets the same answer; not one
    //  adding a 0.0.0.0 record next to an address Cloudflare hides)
    //
    if (cloudflareBlock !== 'adult' && resolver) {
      try {
        const own = await resolver.resolve(name);
        if (isBlockedAnswer(own) && own.every((ip) => answer.includes(ip)))
          return {
            dnsCategory: false,
            aRecords: own,
            pointsToZeroAddress: true
          };
      } catch {
        // (the block stands on its own)
      }
    }

    return {
      dnsCategory: 'blocked_by_cloudflare_family',
      aRecords,
      cloudflareBlock,
      onParkingIp: aRecords.some((ip) => PARKING_IPS.has(ip))
    };
  }

  // Also check if the resolved IPs are known parking IPs
  for (const ip of answer) {
    if (PARKING_IPS.has(ip)) {
      return { dnsCategory: 'parking_ip', aRecords: answer };
    }
  }

  return { dnsCategory: false, aRecords: answer };
}

// (bytes of a page read, and of one decompressed)
const MAX_BODY_BYTES = 256 * 1024;
const MAX_DECODED_BYTES = 512 * 1024;

//
// A body compressed although no encoding was asked for, as some servers
// send it, decompressed up to `MAX_DECODED_BYTES` (also when it was cut
// short); null when it cannot be
//
// (never Brotli: the page comes from whoever registered the domain, and the
//  Brotli decoder in Node.js v18 can be exploited with a crafted stream, see
//  `refuse-unsafe-encoding`)
//
function decompress(buffer, encoding) {
  const create = {
    gzip: () => zlib.createGunzip(),
    'x-gzip': () => zlib.createGunzip(),
    deflate: () => zlib.createInflate(),
    // (a "deflate" body without its zlib header, as some servers send it)
    'deflate-raw': () => zlib.createInflateRaw()
  }[encoding];
  if (!create) return Promise.resolve(null);
  return new Promise((resolve) => {
    const stream = create();
    const chunks = [];
    let size = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      stream.destroy();
      resolve(size > 0 ? Buffer.concat(chunks) : null);
    };

    stream.on('data', (chunk) => {
      chunks.push(chunk);
      size += chunk.length;
      if (size >= MAX_DECODED_BYTES) finish();
    });
    stream.on('end', finish);
    stream.on('error', finish);
    stream.end(buffer);
  });
}

//
// The charset a page's `<meta>` gives in its first 4 KB (not one in a
// comment, or in another attribute's value), as a browser takes it: a page
// cannot say it is UTF-16 there (it is then read as UTF-8)
//
const META_CHARSET = /charset\s*=\s*["']?([\w.:-]+)/i;

function getMetaCharset(bytes) {
  const head = bytes
    .subarray(0, 4096)
    .toString('latin1')
    .replace(/<!--[\s\S]*?(?:-->|$)/g, '');
  for (const match of head.matchAll(/<meta(?=[\t\n\f\r />])/gi)) {
    const read = readAttributes(head, match.index + 5, true);
    if (!read) break;
    const { attributes } = read;
    const charset =
      attributes.get('charset') ||
      ((attributes.get('http-equiv') || '').toLowerCase() === 'content-type'
        ? META_CHARSET.exec(attributes.get('content') || '')?.[1]
        : null);
    if (!charset) continue;
    const label = charset.trim().toLowerCase();
    if (label.startsWith('utf-16')) return 'utf8';
    if (label === 'x-user-defined') return 'windows-1252';
    return label;
  }

  return null;
}

/**
 * A page's body as text, as a browser reads it: decompressed, and in the
 * charset its byte order mark, its Content-Type header or a `<meta>` tag
 * gives (windows-1251, Shift_JIS, …), else UTF-8.
 *
 * @param   {Buffer}  buffer
 * @param   {object}  headers  Response headers
 * @returns {Promise<{text: string, length: number}>}  The text, and bytes
 *                                                     of the page read
 */
async function decodeBody(buffer, headers = {}) {
  const encoding = String(headers['content-encoding'] || '')
    .trim()
    .toLowerCase();
  let bytes = buffer;
  if (encoding && encoding !== 'identity') {
    const decompressed =
      (await decompress(buffer, encoding)) ||
      (encoding === 'deflate' ? await decompress(buffer, 'deflate-raw') : null);
    if (decompressed) bytes = decompressed;
  }

  const bom =
    bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf
      ? 'utf8'
      : bytes[0] === 0xff && bytes[1] === 0xfe
      ? 'utf-16le'
      : bytes[0] === 0xfe && bytes[1] === 0xff
      ? 'utf-16be'
      : null;
  // (a label the decoder does not know, "None" or "utf8mb4", is passed
  //  over as a browser does)
  let text;
  for (const label of [
    bom,
    META_CHARSET.exec(String(headers['content-type'] || ''))?.[1],
    getMetaCharset(bytes)
  ]) {
    if (!label) continue;
    try {
      text = new TextDecoder(label).decode(bytes);
      break;
    } catch {
      // (the next one)
    }
  }

  return { text: text ?? bytes.toString('utf8'), length: bytes.length };
}

/**
 * Fetch a domain over HTTPS (falling back to HTTP) and return the
 * response body as a string together with metadata, all within `timeout`
 * (the address lookup, redirects and reading the body too).
 *
 * HTTP is asked too when HTTPS fails or has not answered by 40% of it, so
 * a domain that never answers on port 443 still leaves HTTP time. A body
 * still arriving at the end is read as far as it came (`timedOut`).
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
  const timeout = opts.timeout || DEFAULT_TIMEOUT_MS;
  const log = opts.logger || loggerDefault;
  const startedAt = Date.now();
  const deadline = startedAt + timeout;

  const result = {
    statusCode: null,
    contentLength: 0,
    body: '',
    error: null,
    // (the host that served the page, after redirects)
    finalHost: null,
    // (the time ran out while its body was still arriving)
    timedOut: false
  };

  // SSRF protection: block requests to private/internal hosts
  const isPrivate = await withDeadline(
    isPrivateHostResolved(domain),
    timeout,
    'TIMEOUT'
  );
  if (isPrivate === 'TIMEOUT') {
    result.error = 'TIMEOUT';
    return result;
  }

  if (isPrivate) {
    result.error = 'SSRF_BLOCKED_PRIVATE_HOST';
    return result;
  }

  //
  // (HTTPS first, and HTTP as soon as HTTPS fails, or has not answered by
  //  40% of the time: a domain that never answers on port 443 still leaves
  //  HTTP time; the first to answer is read, the other is cancelled)
  //
  const controllers = {};
  const errors = [];
  let fallback;
  const timer = setTimeout(() => {
    for (const controller of Object.values(controllers)) controller.abort();
  }, Math.max(0, deadline - Date.now()));
  let winner;
  try {
    winner = await new Promise((resolve) => {
      let settled = false;
      const pending = new Set();
      const start = (scheme) => {
        if (settled || controllers[scheme] || Date.now() >= deadline) return;
        const controller = new AbortController();
        controllers[scheme] = controller;
        pending.add(scheme);
        undici
          .request(`${scheme}://${domain}`, {
            method: 'GET',
            signal: controller.signal,
            dispatcher,
            headers: {
              'User-Agent': `Mozilla/5.0 (compatible; ${pkg.name}/${pkg.version}; +${config.urls.web})`,
              Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5'
            }
          })
          .then(
            (response) => {
              pending.delete(scheme);
              if (settled) {
                response.body?.destroy?.();
                return;
              }

              settled = true;
              resolve({ scheme, response, controller });
            },
            (err) => {
              pending.delete(scheme);
              errors.push(
                controller.signal.aborted
                  ? 'TIMEOUT'
                  : err.code || err.message || 'UNKNOWN_ERROR'
              );
              log.debug(`${scheme.toUpperCase()} failed for ${domain}`, {
                error: errors.at(-1)
              });
              if (scheme === 'https') start('http');
              if (!settled && pending.size === 0) {
                settled = true;
                resolve(null);
              }
            }
          );
      };

      start('https');
      fallback = setTimeout(() => {
        start('http');
      }, timeout * 0.4);
    });

    clearTimeout(fallback);
    if (!winner) {
      result.error = errors.at(-1) || 'TIMEOUT';
      return result;
    }

    // (the other one is not needed)
    for (const controller of Object.values(controllers))
      if (controller !== winner.controller) controller.abort();

    const { response, controller } = winner;
    result.statusCode = response.statusCode;
    // (where the page came from, after redirects)
    const history = response.context?.history;
    result.finalHost = Array.isArray(history)
      ? history.at(-1)?.hostname || null
      : null;

    // Read up to 256 KB of the body to avoid memory issues
    const chunks = [];
    let totalBytes = 0;
    try {
      for await (const chunk of response.body) {
        chunks.push(chunk);
        totalBytes += chunk.length;
        if (totalBytes >= MAX_BODY_BYTES) break;
      }
    } catch (err) {
      // (out of time: what came is read)
      if (!controller.signal.aborted || chunks.length === 0) {
        result.statusCode = null;
        result.finalHost = null;
        result.error = controller.signal.aborted
          ? 'TIMEOUT'
          : err.code || err.message || 'UNKNOWN_ERROR';
        return result;
      }

      result.timedOut = true;
    } finally {
      // (the rest of the body is not waited for)
      response.body?.destroy?.();
    }

    const { text, length } = await decodeBody(
      Buffer.concat(chunks),
      response.headers
    );
    result.body = text;
    // (of the page, decompressed)
    result.contentLength = length;
    return result;
  } finally {
    clearTimeout(timer);
    clearTimeout(fallback);
  }
}

// (code samples: see `readPage`)
const CODE_TEXT = new Set(['pre', 'code', 'kbd', 'samp']);

// (the label an adult site gives itself: `<meta name="rating" content="…">`,
//  or a link to rtalabel.org)
const RTA_LABEL = /rta-5042-1996-1400-1577-rta/i;

const HEAD_META = new Set([
  'description',
  'og:title',
  'og:description',
  'twitter:title'
]);

//
// Sites a meme coin page links to, usually through icons with no text, and
// the keyword each is the same signal as (see `getContentCategories`)
//
const CRYPTO_LINK_HOSTS = {
  'pump.fun': 'pump.fun',
  'dexscreener.com': 'dexscreener',
  'dextools.io': 'dextools',
  'raydium.io': null,
  'birdeye.so': null,
  'jup.ag': null
};

//
// A field asking for a password, a card or a wallet's recovery phrase: by
// its type, its autocomplete hint, its name or id ("cardnumber", "cvv",
// "passwd", "senha", "mnemonic"), the hint shown in it ("Card number",
// "Enter your 12-word recovery phrase"), or a style that masks it; also a
// password field a script adds (`type: "password"`). Not "cc" or "pin":
// an email's Cc field and India's postal PIN code.
//
const CREDENTIAL_AUTOCOMPLETE =
  /\b(?:current-password|new-password|cc-number|cc-csc)\b/i;
const CREDENTIAL_NAME =
  /passw|pwd|senha|contrase|card.?num|cc.?num|cvv|cvc|mnemonic|seed.?phrase|recovery.?phrase|private.?key|^(?:pw|cc_?no|cv2|csc)$/i;
// (a hint saying what to type, not "Search credit cards" or "Forgot your
//  password? Enter your email")
const CREDENTIAL_HINT =
  /^\W*(?:(?:enter|type|confirm) (?:your |the )?|your )?(?:password|passwort|mot de passe|contrase|senha|card number|credit card number|cvv|cvc)/i;
// (a wallet's recovery phrase: a page asking for one is a crypto scam)
const SEED_FIELD =
  /mnemonic|seed.?phrase|recovery.?phrase|secret.?phrase|private.?key|12.word|24.word/i;
// (also these names, on a text box: a search field is called "phrase" too)
const SEED_TEXTAREA = /^(?:phrase|seed|words)$/i;
const MASKED_STYLE = /-webkit-text-security\s*:\s*(?:disc|circle|square)/i;
const SCRIPTED_PASSWORD =
  /\btype["']?\s*[:=]\s*\\?["'`]password\b|setattribute\(\s*["'`]type["'`]\s*,\s*["'`]password/i;

// a field asking for a username (a sign-in's first step), by its name, not
// by `type="email"`: a newsletter form asks for an email address too
const LOGIN_AUTOCOMPLETE = /\busername\b/i;
// (an email field that says it is a newsletter's)
const NEWSLETTER_FIELD = /newsletter|subscri/i;
const LOGIN_NAME =
  /^(?:login|loginfmt|username|userid|loginid|identifier|appleid|_?user)$/i;

// fields whose name says nothing about what a visitor types
const NOT_TYPED = new Set([
  'hidden',
  'submit',
  'button',
  'reset',
  'image',
  'checkbox',
  'radio'
]);

// (elements whose text runs on with the text around them)
// (not links: neighbouring ones are menu items, "Watch live" and "Sex
//  Education")
const INLINE = new Set([
  'abbr',
  'acronym',
  'b',
  'bdi',
  'bdo',
  'big',
  'blink',
  'cite',
  'data',
  'del',
  'dfn',
  'em',
  'font',
  'i',
  'ins',
  'label',
  'map',
  'mark',
  'nobr',
  'output',
  'q',
  'rb',
  'ruby',
  's',
  'slot',
  'small',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'time',
  'tt',
  'u',
  'var',
  'wbr'
]);

//
// In an `<svg>`, the elements whose text is shown (its other text is not:
// a style sheet, a script, a shape's title), and those whose content never
// is (definitions, a title or a description)
//
const SVG_SHOWN = new Set(['text', 'tspan', 'textpath', 'foreignobject']);
// (the parts of an <svg> or a <math> holding HTML, as a browser reads them)
const INTEGRATION_POINTS = {
  svg: new Set(['foreignobject', 'desc', 'title']),
  math: new Set(['mi', 'mo', 'mn', 'ms', 'mtext'])
};
const SVG_HIDDEN = new Set([
  'clippath',
  'defs',
  'desc',
  'lineargradient',
  'marker',
  'mask',
  'metadata',
  'pattern',
  'radialgradient',
  'script',
  'style',
  'symbol',
  'title'
]);

// (what keeps blocks apart in the page text: see `readPage`)
const BREAK = ' | ';

// (characters of a page's text, and of its title and description, looked at)
const MAX_TEXT_LENGTH = 50_000;
const MAX_HEAD_LENGTH = 2000;

// where a piece of the page is (see `readPage`)
const TEXT = 0;
const CODE = 1;
const HIDDEN = 2;

//
// Elements whose content is raw text up to their end tag (or the page's
// end), as a browser reads them: a script's code, a style sheet, a text
// box's default value, the title
//
const RAW_TEXT = new Set([
  'script',
  'style',
  'noscript',
  'textarea',
  'title',
  'xmp',
  'iframe',
  'noembed',
  'noframes'
]);

// (elements with no content or end tag)
const VOID = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr'
]);

//
// HTML elements a browser does not put inside an `<svg>` or `<math>`: one
// left open is closed by them, so it does not hide the rest of the page
//
const SVG_BREAKOUT = new Set([
  'b',
  'big',
  'blockquote',
  'body',
  'br',
  'center',
  'code',
  'dd',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'hr',
  'i',
  'img',
  'li',
  'listing',
  'menu',
  'meta',
  'nobr',
  'ol',
  'p',
  'pre',
  'ruby',
  's',
  'small',
  'span',
  'strong',
  'strike',
  'sub',
  'sup',
  'table',
  'tt',
  'u',
  'ul',
  'var'
]);

// (an end tag closes an element at most this far up the open ones)
const MAX_CLOSE_DEPTH = 64;

//
// Where a script's content ends: at its first "</script", unless that one
// is in a "<!-- … -->" holding a "<script" of its own, as old ad code
// writes with `document.write` (a browser reads it so)
//
const SCRIPT_TOKENS = /<!--|-->|<(\/?)script(?=[\t\n\f\r />])/gi;

function getScriptEnd(html, from) {
  // (0: script, 1: in "<!--", 2: in a "<script" in "<!--")
  let state = 0;
  SCRIPT_TOKENS.lastIndex = from;
  let match;
  while ((match = SCRIPT_TOKENS.exec(html))) {
    const [token, slash] = match;
    if (token === '<!--') {
      if (state === 0) state = 1;
      // (its dashes can end it at once: "<!-->", "<!--->")
      SCRIPT_TOKENS.lastIndex = match.index + 2;
    } else if (token === '-->') {
      state = 0;
    } else if (slash) {
      if (state !== 2) return match.index;
      state = 1;
    } else if (state === 1) {
      state = 2;
    }
  }

  return -1;
}

// (a tag's name, and the end of a comment)
const TAG_NAME = /[a-z][^\t\n\f\r />]*/iy;
const COMMENT_END = /--!?>/g;

// (HTML's whitespace)
function isSpace(code) {
  return (
    code === 0x20 ||
    code === 0x09 ||
    code === 0x0a ||
    code === 0x0c ||
    code === 0x0d
  );
}

//
// A tag's attributes from `from` (after its name) to its ">", as HTML's
// tokenizer reads them; null when the page ends inside the tag
//
function readAttributes(html, from, keep) {
  const attributes = keep ? new Map() : null;
  let selfClosing = false;
  let i = from;
  const add = (name, value) => {
    if (keep && !attributes.has(name))
      attributes.set(name, decode(value, { scope: 'attribute' }));
  };

  while (i < html.length) {
    const code = html.codePointAt(i);
    if (isSpace(code)) {
      i++;
      continue;
    }

    if (code === 0x3e /* > */) return { end: i + 1, attributes, selfClosing };
    if (code === 0x2f /* / */) {
      selfClosing = html.codePointAt(i + 1) === 0x3e;
      i++;
      continue;
    }

    // (a name: "=" may start one, as in `<p =">`)
    let j = i + 1;
    while (j < html.length) {
      const c = html.codePointAt(j);
      if (isSpace(c) || c === 0x2f || c === 0x3e || c === 0x3d /* = */) break;
      j++;
    }

    const name = html.slice(i, j).toLowerCase();
    i = j;
    while (i < html.length && isSpace(html.codePointAt(i))) i++;
    if (html.codePointAt(i) !== 0x3d) {
      add(name, '');
      continue;
    }

    // (its value)
    i++;
    while (i < html.length && isSpace(html.codePointAt(i))) i++;
    const quote = html[i];
    if (quote === '"' || quote === "'") {
      const close = html.indexOf(quote, i + 1);
      if (close === -1) return null;
      add(name, html.slice(i + 1, close));
      i = close + 1;
      continue;
    }

    if (html.codePointAt(i) === 0x3e) {
      add(name, '');
      continue;
    }

    j = i;
    while (j < html.length) {
      const c = html.codePointAt(j);
      if (isSpace(c) || c === 0x3e) break;
      j++;
    }

    add(name, html.slice(i, j));
    i = j;
  }

  return null;
}

//
// The next tag, comment or declaration of a page at or after `from`, read
// as a browser does and in linear time: each character is looked at once,
// a quoted attribute value may hold "<" and ">" (`:class="{ err: n > 0 }"`),
// a quote starts a value only right after "=" (`<p =">` is a tag), only
// HTML's whitespace separates (not a no-break space: `<script\u00A0>` is
// another element), and a tag the page ends inside is dropped. Returns null
// when there is none, else where it starts and ends and, for a tag, its
// name, whether it closes an element, its attributes (a start tag's) and
// whether it ends with "/>".
//
function nextMarkup(html, from) {
  let start = html.indexOf('<', from);
  while (start !== -1) {
    const next = html[start + 1];
    // (a comment: "<!-->" and "<!--->" end at once, "--!>" ends one too)
    if (html.startsWith('<!--', start)) {
      if (html.startsWith('>', start + 4)) return { start, end: start + 5 };
      if (html.startsWith('->', start + 4)) return { start, end: start + 6 };
      COMMENT_END.lastIndex = start + 4;
      const found = COMMENT_END.exec(html);
      return {
        start,
        end: found ? found.index + found[0].length : html.length
      };
    }

    // (the doctype, an XML declaration or another bogus comment)
    if (next === '!' || next === '?') {
      const end = html.indexOf('>', start);
      return { start, end: end === -1 ? html.length : end + 1 };
    }

    const closing = next === '/';
    // (an end tag with no name: "</>" is dropped, and "</ casino >" or
    //  "</3>" is a bogus comment; "</" at the page's end is text)
    if (closing && !/[a-z]/i.test(html[start + 2] || '')) {
      if (html[start + 2] === '>') return { start, end: start + 3 };
      if (start + 2 < html.length) {
        const end = html.indexOf('>', start + 2);
        return { start, end: end === -1 ? html.length : end + 1 };
      }
    }

    TAG_NAME.lastIndex = start + (closing ? 2 : 1);
    const name = TAG_NAME.exec(html);
    if (name) {
      const read = readAttributes(html, TAG_NAME.lastIndex, !closing);
      // (the page ends inside the tag)
      if (!read) return { start, end: html.length };
      return {
        start,
        end: read.end,
        tag: name[0].toLowerCase(),
        closing,
        attributes: read.attributes,
        selfClosing: read.selfClosing
      };
    }

    // (a "<" that starts no tag is text)
    start = html.indexOf('<', start + 1);
  }

  return null;
}

/**
 * What a form field asks for.
 *
 * @param   {string}  tag         input or textarea
 * @param   {Map}     attributes
 * @returns {{credentials: boolean, login: boolean, email: boolean, seed: boolean}}
 */
function getFieldKind(tag, attributes) {
  const none = { credentials: false, login: false, email: false, seed: false };
  const type = (attributes.get('type') || '').toLowerCase();
  if (NOT_TYPED.has(type)) return none;
  const autocomplete = attributes.get('autocomplete') || '';
  const names = [attributes.get('name'), attributes.get('id')].filter(Boolean);
  const hints = [
    attributes.get('placeholder'),
    attributes.get('aria-label')
  ].filter(Boolean);
  const isTextBox = tag === 'textarea';
  const seed =
    [...names, ...hints].some((value) => SEED_FIELD.test(value)) ||
    (isTextBox && names.some((name) => SEED_TEXTAREA.test(name)));

  // (a text box only asks for credentials when it asks for a recovery phrase)
  if (isTextBox) return { ...none, credentials: seed, seed };

  return {
    credentials:
      seed ||
      type === 'password' ||
      MASKED_STYLE.test(attributes.get('style') || '') ||
      CREDENTIAL_AUTOCOMPLETE.test(autocomplete) ||
      names.some((name) => CREDENTIAL_NAME.test(name)) ||
      hints.some((hint) => CREDENTIAL_HINT.test(hint)),
    login:
      LOGIN_AUTOCOMPLETE.test(autocomplete) ||
      names.some((name) => LOGIN_NAME.test(name)),
    email:
      type === 'email' &&
      ![...names, ...hints].some((value) => NEWSLETTER_FIELD.test(value)),
    seed
  };
}

/**
 * Read what the categorisation looks at from raw HTML: the title, the
 * title and description given in the head, the visible text (also as a
 * browser runs inline elements together, `joinedText`), the links to meme
 * coin sites, and whether the page asks for a password, a card number, a
 * username, an email address or a wallet's recovery phrase.
 *
 * The text of each element is kept apart: blocks and links by `BREAK`,
 * which a phrase does not match across ("Watch live" and "Sex Education"
 * are two menu items), and inline elements by a space, so minified markup
 * (`<a>Casino</a><a>Poker</a>`) is not one word. In `joinedText` inline
 * elements are joined to the text next to them, so "Free Sp<span>ins" is
 * "Free Spins" there.
 *
 * Scripts, style sheets, form fields and `<template>` are not page text
 * (their fields and links still count), nor is an `<svg>` but for its
 * text and the HTML in it (a shadow root's `<template>` is), and code
 * samples (`key_xxx`) are not either, unless they are most of it (a page
 * that wraps its text in them to hide it).
 *
 * @param   {string}  html
 * @returns {object}
 */
function readPage(html) {
  const page = {
    title: '',
    head: '',
    text: '',
    textLength: 0,
    asksForCredentials: false,
    asksForLogin: false,
    asksForEmail: false,
    asksForSeedPhrase: false,
    linkHosts: [],
    isParkedLander: false,
    // (an adult site's label for parental filters, rtalabel.org)
    hasRtaLabel: false
  };

  //
  // GoDaddy's parked domains answer with a page that only sends the
  // browser to `/lander`
  //
  page.isParkedLander =
    /location\.href\s*=\s*["']\/lander["']/.test(html) && html.length < 2048;

  const head = [];
  const parts = [];
  const joinedParts = [];
  const codeParts = [];
  // (the elements open, innermost last, and where the <svg>, <math> and
  //  <template> ones are)
  const open = [{ tag: '', place: TEXT, inline: false }];
  const svgs = [];
  const maths = [];
  const templates = [];
  let sawTitle = false;
  const place = () => open.at(-1).place;
  //
  // (the <svg> and <math> elements open in HTML, not in another one: a
  //  paragraph closes the innermost of them, and what it holds, and in
  //  their HTML parts, such as a <foreignObject>, it is HTML again)
  //
  const foreignRoots = [];
  const inForeignNow = () => foreignRoots.length > 0 && !open.at(-1).html;
  const getForeign = () => foreignRoots.at(-1);

  function addText(text) {
    if (!text) return;
    const where = place();
    if (where === TEXT) {
      parts.push(text);
      joinedParts.push(text);
    } else if (where === CODE) {
      codeParts.push(text);
    }
  }

  function separate(element) {
    // (in the text of its parent)
    const where = open.at(-1).place;
    if (where !== TEXT) return;
    if (element.inline) {
      parts.push(' ');
    } else {
      parts.push(BREAK);
      joinedParts.push(BREAK);
    }
  }

  function close(depth) {
    for (let i = 0; i < depth; i++) separate(open.pop());
    for (const stack of [svgs, maths, templates, foreignRoots])
      while (stack.length > 0 && stack.at(-1) >= open.length) stack.pop();
  }

  function startTag(tag, attributes) {
    // (a box a script reads, masked like a password: `contenteditable`)
    if (
      attributes.has('contenteditable') &&
      MASKED_STYLE.test(attributes.get('style') || '')
    )
      page.asksForCredentials = true;

    switch (tag) {
      case 'meta': {
        const key = (
          attributes.get('name') ||
          attributes.get('property') ||
          ''
        ).toLowerCase();
        if (HEAD_META.has(key)) head.push(attributes.get('content') || '');
        if (key === 'rating' && RTA_LABEL.test(attributes.get('content') || ''))
          page.hasRtaLabel = true;
        break;
      }

      case 'input':
      case 'textarea': {
        const kind = getFieldKind(tag, attributes);
        if (kind.credentials) page.asksForCredentials = true;
        if (kind.login) page.asksForLogin = true;
        if (kind.email) page.asksForEmail = true;
        if (kind.seed) page.asksForSeedPhrase = true;
        break;
      }

      case 'a': {
        try {
          // (a protocol-relative link such as //dexscreener.com counts too)
          const { hostname } = new URL(
            attributes.get('href') || '',
            'https://base.invalid'
          );
          const host = Object.keys(CRYPTO_LINK_HOSTS).find(
            (h) => hostname === h || hostname.endsWith(`.${h}`)
          );
          if (host && !page.linkHosts.includes(host)) page.linkHosts.push(host);
          // (an adult site's label, as a link)
          if (hostname === 'rtalabel.org' || hostname.endsWith('.rtalabel.org'))
            page.hasRtaLabel = true;
        } catch {
          // (an invalid link)
        }

        break;
      }

      default:
    }
  }

  // (text between tags: a NUL in it is dropped, as a browser does)
  const addData = (raw) => addText(decode(raw).replaceAll('\0', ''));

  let last = 0;
  let markup;
  while ((markup = nextMarkup(html, last))) {
    addData(html.slice(last, markup.start));
    last = markup.end;
    // (in an <svg> or <math>, a CDATA section is text)
    if (inForeignNow() && html.startsWith('<![CDATA[', markup.start)) {
      const end = html.indexOf(']]>', markup.start + 9);
      addText(html.slice(markup.start + 9, end === -1 ? html.length : end));
      last = end === -1 ? html.length : end + 3;
      continue;
    }

    // (a comment, the doctype or an XML declaration)
    if (!markup.tag) continue;
    const { tag } = markup;

    if (markup.closing) {
      // (a "</p>" or "</br>" closes an <svg> or <math> left open too)
      if ((tag === 'p' || tag === 'br') && inForeignNow())
        close(open.length - getForeign());
      // (and "</br>" is a line break)
      if (tag === 'br') {
        separate({ inline: false });
        continue;
      }

      //
      // (closes the innermost element of its name, if one is open nearby;
      //  a <template>, <svg> or <math> however far up, and nothing outside
      //  the innermost <template>, as a browser does)
      //
      const floor = templates.at(-1) ?? 0;
      let at = -1;
      switch (tag) {
        case 'template': {
          at = templates.at(-1) ?? -1;
          break;
        }

        case 'svg': {
          at = svgs.at(-1) ?? -1;
          break;
        }

        case 'math': {
          at = maths.at(-1) ?? -1;
          break;
        }

        default: {
          const limit = Math.max(floor + 1, open.length - MAX_CLOSE_DEPTH);
          for (let i = open.length - 1; i >= limit; i--) {
            if (open[i].tag === tag) {
              at = i;
              break;
            }
          }
        }
      }

      if (at > 0 && (at > floor || tag === 'template')) close(open.length - at);
      continue;
    }

    const { attributes } = markup;
    startTag(tag, attributes);

    //
    // (an <svg> or <math> left open is closed by the next paragraph, as a
    //  browser does, and by a <font> with a color, face or size)
    //
    if (
      inForeignNow() &&
      (SVG_BREAKOUT.has(tag) ||
        (tag === 'font' &&
          ['color', 'face', 'size'].some((name) => attributes.has(name))))
    )
      close(open.length - getForeign());
    const inForeign = inForeignNow();

    //
    // (a button's label: `<input type="submit" value="…">`; not an image's
    //  text, a field's hint or a tooltip, which describe the page as much
    //  as they show it: "Search torrents" on a Linux tracker)
    //
    const label =
      tag === 'input' &&
      /^(?:submit|button|reset)$/i.test(attributes.get('type') || '')
        ? (attributes.get('value') || '').replaceAll('\0', '').trim()
        : '';
    if (label && place() === TEXT) {
      parts.push(BREAK, label, BREAK);
      joinedParts.push(BREAK, label, BREAK);
    }

    if (VOID.has(tag)) {
      // (a line break or a rule keeps words apart, and so does an image or
      //  a field: "Free<img>Spins")
      if (tag === 'br' || tag === 'hr') separate({ inline: false });
      else if (tag === 'img' || tag === 'input' || tag === 'embed')
        separate({ inline: true });
      continue;
    }

    // (an <svg/>, or a <path/> in one, has no content)
    if (markup.selfClosing && (inForeign || tag === 'svg' || tag === 'math'))
      continue;

    // (the rest of the page is text, shown as it is)
    if (tag === 'plaintext' && !inForeign) {
      addText(html.slice(last));
      last = html.length;
      break;
    }

    // (in an <svg> or <math> nothing is raw text: an <svg>'s <script> and
    //  <style> are elements, hidden below; a <math>'s are shown)
    if (RAW_TEXT.has(tag) && !inForeign) {
      // (its content runs to its end tag, or to the page's end)
      let found;
      if (tag === 'script') {
        found = getScriptEnd(html, last);
      } else {
        const end = new RegExp(`</${tag}(?=[\\t\\n\\f\\r />])`, 'gi');
        end.lastIndex = last;
        found = end.exec(html)?.index ?? -1;
      }

      const content = html.slice(last, found === -1 ? html.length : found);
      if (found === -1) {
        last = html.length;
      } else {
        const gt = html.indexOf('>', found);
        last = gt === -1 ? html.length : gt + 1;
      }

      if (tag === 'title') {
        const title = decode(content).replace(/\s+/g, ' ').trim();
        // (the first <title>, not one in a <template>, as a browser shows)
        if (!sawTitle && place() !== HIDDEN) {
          sawTitle = true;
          page.title = title.slice(0, 300);
        }

        separate({ inline: false });
        addText(title);
        separate({ inline: false });
      } else if (tag === 'xmp') {
        // (shown as it is)
        separate({ inline: false });
        addText(content);
        separate({ inline: false });
      } else if (tag === 'script' && SCRIPTED_PASSWORD.test(content)) {
        page.asksForCredentials = true;
      }

      continue;
    }

    //
    // (where its content is: an <svg>'s is hidden but for its text, and a
    //  <template>'s unless it is a shadow root a browser shows)
    //
    const parent = open.at(-1);
    let where = parent.place;
    // (where an <svg>'s text is shown, while in one)
    let svgText;
    if (tag === 'svg') {
      svgText = where === HIDDEN ? parent.svgText : where;
      where = HIDDEN;
    } else if (inForeign && svgs.length > 0) {
      if (SVG_HIDDEN.has(tag)) where = HIDDEN;
      else if (SVG_SHOWN.has(tag) && parent.svgText !== undefined)
        where = parent.svgText;
      else svgText = parent.svgText;
    } else if (
      tag === 'template' &&
      !inForeign &&
      !/^(?:open|closed)$/i.test(attributes.get('shadowrootmode') || '')
    ) {
      where = HIDDEN;
    } else if (where === TEXT && CODE_TEXT.has(tag)) {
      where = CODE;
    }

    // (an <svg> in a <math> is a MathML element, as a browser reads it)
    const ns = inForeign
      ? parent.ns
      : tag === 'svg' || tag === 'math'
      ? tag
      : undefined;
    const element = {
      tag,
      inline: INLINE.has(tag),
      place: where,
      svgText,
      ns,
      // (in HTML inside an <svg> or <math>)
      html: inForeign
        ? INTEGRATION_POINTS[ns].has(tag)
        : ns === undefined && Boolean(parent.html)
    };
    // (an <svg>'s text is a block of its own)
    if (parent.place === HIDDEN && where === TEXT) {
      parts.push(BREAK);
      joinedParts.push(BREAK);
    } else {
      separate(element);
    }

    if ((tag === 'svg' || tag === 'math') && !inForeign)
      foreignRoots.push(open.length);
    if (tag === 'svg') svgs.push(open.length);
    else if (tag === 'math') maths.push(open.length);
    else if (tag === 'template' && !inForeign) templates.push(open.length);
    open.push(element);
  }

  addData(html.slice(last));

  page.head = [page.title, ...head]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_HEAD_LENGTH);

  const toText = (values) =>
    values
      .join('')
      .replace(/\s+/g, ' ')
      .replace(/(?: ?\| ?)+/g, BREAK)
      .replace(/^[\s|]+|[\s|]+$/g, '');
  const text = toText(parts);
  const codeText = codeParts.join(' ').replace(/\s+/g, ' ').trim();
  page.text = (
    codeText.length > text.length ? `${text}${BREAK}${codeText}` : text
  ).slice(0, MAX_TEXT_LENGTH);
  // (characters of text, not counting the breaks)
  page.textLength = page.text.replaceAll(BREAK, ' ').length;
  const joinedText = toText(joinedParts).slice(0, MAX_TEXT_LENGTH);
  if (joinedText !== text) page.joinedText = joinedText;

  return page;
}

//
// Matches that do not count, by what is around them:
//
//   - phishing wording in a warning ("we will never ask you to verify your
//     account", "beware of emails saying …")
//   - a disposable email service named in a sign-up rule, or by a service
//     that blocks them ("disposable email addresses are not allowed", "we
//     detect temp mail")
//   - the other categories named by a warning, a denial or a filter ("not
//     a guaranteed return", "presale scams", "beware of free crypto", "block
//     online casinos", "online slots addiction")
//
// (each cue is close to the keyword: a few words before it, or in the same
//  sentence for a warning or a filter, and a denial right before it; a
//  casino page saying "don't miss our free spins" is still a casino page)
//
// (a cue right before or after a keyword is in the same block of the page:
//  a language menu's "NO" is not a denial of the casino in the next one, see
//  `getBlockBefore`; nor is a lobby's "Filter" button a filter of its games,
//  see `isWarning`)
//
const PHISHING_WARNING =
  /(?:never (?:ask|request)s?(?: you)?(?: to)?|beware of|watch out for|look out for|if you (?:notice|see|receive|get)|scams? (?:that )?(?:say|ask)|(?:emails?|messages?|texts?|calls?) (?:that )?(?:say|ask|claim)(?:ing)?|(?:emails?|messages?|texts?|calls?) about)[^\w.!?]+(?:\w+[^\w.!?]+){0,3}$/;
// (a filter's verb right before the keyword, with at most one word between:
//  "blocks disposable email", "detect any temp mail", "no burner email",
//  "unlike a disposable email", "不支持临时邮箱"; not "block spam with temp
//  mail", which a temp mail service says)
const DISPOSABLE_REJECTED_BEFORE =
  /(?:\b(?:block(?:s|ed|ing)?|detect(?:s|ed|ing)?|reject(?:s|ed|ing)?|prevent(?:s|ed|ing)?|filter(?:s|ed|ing)?|ban(?:s|ned|ning)?|flag(?:s|ged|ging)?|identif(?:y|ies|ied|ying)|disallow(?:s|ed)?|unlike)\W+(?:\w+\W+)?|(?<!\b(?:never|not|don'?t|no|nothing to)\s)\b(?:track(?:s|ed|ing)?|catch(?:es|ing)?|caught)\s+(?:[\d.,]+\+?\s+)?|\b(?:no|geen|kein|keine|pas de|sin|(?<!\bwhy )not an?|isn'?t an?|no es una?|n'?est pas une?|nao e uma?|ist keine?)\W+|(?:不支持|不允许|禁止|不接受)\s*)$/;
// (a service named in a list of them earlier in the sentence: "providers
//  like Mailinator, Guerrilla Mail and YOPmail", "why not just use temp
//  mail?", "instead of a burner email")
const DISPOSABLE_LISTED_BEFORE =
  /\b(?:(?:providers?|services?|domains?|addresses|ones|sites) (?:like|such as|including)|instead of|rather than|better than|beter dan|besser als|anders als|mieux qu['e]|plutot qu['e]|au lieu de|meglio di|invece di|a diferencia de|en lugar de|en vez de|em vez de|ao inves de|why not (?:just )?use|compared? (?:to|with))\b[^.!?]*$/;
// (a sign-up rule after it, in the same sentence: "disposable email
//  addresses (temp mail, 10 minute mail, etc.) are not allowed")
const DISPOSABLE_REJECTED_AFTER = new RegExp(
  `^(?:[^.!?]|\\betc\\.){0,120}?(?:\\b(?:${[
    '(?:is|are) not (?:allowed|accepted|permitted)',
    "(?:isn'?t|aren'?t) (?:allowed|accepted|permitted)",
    'not allowed',
    '(?:is|are) (?:blocked|rejected|prohibited|banned)',
    'cannot be used',
    "can'?t be used",
    "(?:won'?t|will not|do not|don'?t) work",
    '(?:will|may|can) be (?:rejected|blocked|suspended|banned|deleted|removed)',
    '(?:is|are) not supported',
    'nicht (?:erlaubt|zulassig|gestattet)',
    '(?:sind|ist|werden|wird) blockiert',
    'no se (?:permiten|aceptan|admiten)',
    'nao (?:sao|e) (?:permitid|aceit)',
    'nao aceitamos',
    'ne sont pas (?:acceptee|autorisee)',
    'interdit',
    'kabul edilmez',
    'kullanilamaz'
  ].join('|')})|(?<!\\p{L})(?:${['запрещен', 'не принимаются']
    .map((cue) => normalizeText(cue))
    .join('|')})|${[
    '使用できません',
    '登録できません',
    '不支持',
    '不允许',
    '禁止'
  ]
    .map((cue) => normalizeText(cue))
    .join('|')})`,
  'u'
);

// (a denial right before the keyword: "not a guaranteed return", "no free
//  spins", "without real money")
// (also "isn't risk-free or a guaranteed profit")
const NEGATED_BEFORE =
  /\b(?:(?:not|no|never|without|isn'?t|aren'?t|don'?t)\W+(?:[\w-]+\W+or\W+)?(?:(?:a|an|any)\W+)?|(?:never|don'?t|do not)\W+(?:buy|order|purchase)\W+(?:\w+\W+)?)$/;
// (a warning, a filter or a rule earlier in the sentence: "beware of free
//  crypto", "block adult content, porn sites and online casinos",
//  "customers must not run an online casino")
const WARNING_BEFORE =
  /\b(?:beware of|warn(?:s|ed|ing)? (?:about|against|of)|dangers? of|risks? of|avoid(?:s|ing)?|block(?:s|ed|ing)?|filter(?:s|ed|ing)?|ban(?:s|ned|ning)?|outlaw(?:s|ed|ing)?|prohibit(?:s|ed|ing)?|forbid(?:s|den)?|(?:don'?t|do not|never|won'?t|will not|cannot|can'?t) (?:host|allow|accept|permit|support|sell)|(?:must|may|shall) not (?:run|host|operate|offer|promote|sell|advertise|publish|distribute|send|use)|not (?:allowed|permitted)|asks? you to|asking you to|diffidate|attenzione a|cuidado con|desconfie|vorsicht vor|mefiez-vous)\b(?:\b(?:e\.g|i\.e)\.|[^.!?])*$/;
// (the same in other scripts: `\b` is for ASCII words only)
const OTHER_SCRIPT_WARNING_BEFORE = new RegExp(
  `(?<![\\p{L}\\p{N}_])(?:${['остерегайтесь']
    .map((cue) => normalizeText(cue))
    .join('|')})(?![\\p{L}\\p{N}_])[^.!?]*$`,
  'u'
);
// (a block in another language, in the same block of the page: "o app
//  bloqueia cassino online", "la app bloquea apuestas"; not "anti blokir",
//  "sem bloqueio" or a noun such as "Bloque de bonos")
const BLOCKS_BEFORE =
  /(?<!\b(?:anti|sem|sin|ohne|no|non|tanpa)[\s-]?)\b(?:bloquea|bloquean|bloqueia|bloqueiam|bloqueie|bloquear|bloquez|blocca|bloccano|bloccare|blokkeert|blokkeren|blokuje|blokujemy|memblokir|sperrt|sperren|engeller|engelleyin)\b[^.!?]*$/;
// (harm right after it: "online slots addiction", "presale scams", "nude
//  photos shared without consent")
const HARM_AFTER =
  /^\W+(?:addiction|addicts?|scams?|schemes?|fraud|(?:\w+[^\w.!?]+){0,6}without (?:\w+ )?consent)\b/;
// (a rule later in the sentence: "online casinos and free spins are
//  prohibited", "posting hentai will get you removed"; not one about who
//  may play: "players from the UK are not allowed")
const PROHIBITED_AFTER =
  /^([^.!?]{0,60}?)\b(?:(?:are|is) (?:(?:strictly )?(?:prohibited|forbidden|banned|not tolerated)|not (?:allowed|permitted))|will get you (?:banned|removed|kicked))\b/;
const RULE_ABOUT_PEOPLE =
  /\b(?:players?|users?|customers?|members?|minors?|persons?|people|residents?|anyone|visitors?|you|under \d+)\b/;

// (a question a pharmacy's advice page asks: it starts with one of these
//  words and ends with "?"; "Looking for cheap Viagra?" is not one)
const QUESTION_BEFORE =
  /(?:^|[.!?|]\s*)(?:can|could|is it|is|are|should|si puo|se puede|pode|kann man|peut-on|можно)(?![\p{L}\p{N}_])[^.!?|]*$/u;
const QUESTION_AFTER = /^[^.!?|]{0,40}\?/;

//
// (the text up to `length` characters before a match, or after it; and the
//  same in the block of the page the match is in: see `BREAK`)
//
function getBefore(text, start, length) {
  return text.slice(Math.max(0, start - length), start);
}

function getAfter(text, end, length) {
  return text.slice(end, end + length);
}

function getBlockBefore(text, start, length) {
  const before = getBefore(text, start, length);
  const at = before.lastIndexOf(BREAK);
  return at === -1 ? before : before.slice(at + BREAK.length);
}

function getBlockAfter(text, end, length) {
  const after = getAfter(text, end, length);
  const at = after.indexOf(BREAK);
  return at === -1 ? after : after.slice(0, at);
}

// (a block that is only a filter's label: a lobby's button or menu)
const FILTER_LABEL =
  /^(?:sort (?:and|&) )?(?:filters?|filtrar|filtrer|filtra|filtri|filtro|filtros|filtre|filtres|filtern|filtry)(?: by| por| par)?\W*$/;

// (the block of the page a position is in)
function getBlock(text, at) {
  const start = text.lastIndexOf(BREAK, at);
  const end = text.indexOf(BREAK, at);
  return text
    .slice(
      start === -1 ? 0 : start + BREAK.length,
      end === -1 ? undefined : end
    )
    .trim();
}

// ("stop" with the keyword right after it: "helps stop online porn"; not
//  "stop dreaming and start winning at our online casino" or "non-stop")
const STOP_BEFORE = /(?<!\b(?:non|one)[\s-])\bstop(?:s|ping)?\W+(?:\w+\W+)?$/;

function isWarning(text, start, end) {
  const from = Math.max(0, start - 60);
  const before = getBefore(text, start, 60);
  const blockBefore = getBlockBefore(text, start, 60);
  const warning = WARNING_BEFORE.exec(before);
  const after = getBlockAfter(text, end, 80);
  const rule = PROHIBITED_AFTER.exec(after);
  return (
    NEGATED_BEFORE.test(blockBefore) ||
    BLOCKS_BEFORE.test(blockBefore) ||
    STOP_BEFORE.test(blockBefore) ||
    OTHER_SCRIPT_WARNING_BEFORE.test(before) ||
    (warning !== null &&
      !FILTER_LABEL.test(getBlock(text, from + warning.index))) ||
    HARM_AFTER.test(after) ||
    (rule !== null && !RULE_ABOUT_PEOPLE.test(rule[1]))
  );
}

// (a key tool of an operating system or a developer, not a crack's:
//  "ssh-keygen", "age-keygen", "dnssec-keygen")
const KEYGEN_TOOL_BEFORE =
  /(?:^|[^\w-])(?:ssh|age|dnssec|tsig|rndc|ddns|wg|cosign|minisign|step|tpm2|openssl|gpg)-$/;
// (sex education: "live sex ed workshop", "live sex education")
const SEX_EDUCATION_AFTER = /^\W{1,3}ed(?:ucation)?\b/;

// (a tool against them right after: "disposable email detection",
//  "throwaway email providers", "a trashmail list"; not a service's own "the
//  fastest temp mail provider" or "Temp mail list: …")
const DISPOSABLE_TOOL_AFTER =
  /^s?\W{0,3}(?:(?:address(?:es)?|domains?)\W+)?(?:detection|detector|detect|checker|checking|filter|filtering|blocker|blocking|blocklist|validation|validator|providers|lists?(?!\W*:))\b/;
// (an example in brackets: "a disposable email address (like tempmail)")
const DISPOSABLE_EXAMPLE_BEFORE = /\((?:like|e\.?g\.?,?|such as)\s[^)]*$/;
// (a sign-up rule before it: "please don't use temp mail", "do not register
//  with a burner email", "we don't allow temp mail"; not "block spam with
//  temp mail", which a temp mail service says)
const DISPOSABLE_DONT_USE_BEFORE =
  /\b(?:don'?t|do not|never|cannot|can'?t)\W+(?:use|register with|sign up with|sign up using)\W+(?:(?:a|an|any)\W+)?$/;
const DISPOSABLE_RULE_BEFORE =
  /\b(?:(?:don'?t|do not|never|won'?t|will not|cannot|can'?t) (?:allow|accept|permit|support)|not (?:allowed|permitted|accepted))\b[^.!?]*$/;

const SKIP_CONTEXT = {
  phishing: (text, start) => PHISHING_WARNING.test(getBefore(text, start, 60)),
  disposable_email: (text, start, end) =>
    DISPOSABLE_REJECTED_BEFORE.test(getBlockBefore(text, start, 60)) ||
    DISPOSABLE_LISTED_BEFORE.test(getBefore(text, start, 100)) ||
    DISPOSABLE_EXAMPLE_BEFORE.test(getBefore(text, start, 40)) ||
    DISPOSABLE_DONT_USE_BEFORE.test(getBlockBefore(text, start, 40)) ||
    DISPOSABLE_REJECTED_AFTER.test(getAfter(text, end, 160)) ||
    DISPOSABLE_RULE_BEFORE.test(getBefore(text, start, 60)) ||
    DISPOSABLE_TOOL_AFTER.test(getBlockAfter(text, end, 40)),
  gambling: isWarning,
  adult: (text, start, end) =>
    isWarning(text, start, end) ||
    (text.slice(end - 3, end) === 'sex' &&
      SEX_EDUCATION_AFTER.test(getBlockAfter(text, end, 20))),
  crypto_scam: isWarning,
  // (and a question: "can you buy Viagra without a prescription?")
  pharmacy: (text, start, end) =>
    isWarning(text, start, end) ||
    (QUESTION_BEFORE.test(getBefore(text, start, 80)) &&
      QUESTION_AFTER.test(getAfter(text, end, 41))),
  malware: (text, start, end) =>
    KEYGEN_TOOL_BEFORE.test(getBefore(text, start, 12)) ||
    isWarning(text, start, end),
  piracy: isWarning
};

//
// What a page's title says about a sign-in (see `PHISHING_BRANDS`): the
// brand of a sign-in to it, a sign-in with no brand, or nothing. A brand
// right after "with", "using" or "via" is single sign-on.
//
const PHISHING_BRAND_MATCHERS = _.sortBy(
  PHISHING_BRANDS,
  (brand) => -brand.length
).map((brand) => [
  brand,
  new RegExp(
    `(?<!\\b(?:with|using|via)\\W+)(?<![\\p{Script=Latin}_])${_.escapeRegExp(
      brand
    )}s?(?![\\p{Script=Latin}_])`,
    'gu'
  )
]);

function getSignInTitle(title) {
  const plain = title.replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  if (SIGN_IN_TITLES.has(plain)) return { generic: plain };
  let rest = title;
  let brand = null;
  for (const [name, regex] of PHISHING_BRAND_MATCHERS) {
    regex.lastIndex = 0;
    if (!regex.test(rest)) continue;
    brand ||= name;
    rest = rest.replace(regex, ' ');
  }

  if (!brand) return null;
  const words = rest.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  return words.some((word) => SIGN_IN_ACTIONS.has(word)) &&
    words.every((word) => SIGN_IN_TITLE_WORDS.has(word))
    ? { brand }
    : null;
}

// (words a block of the page has at least, around a keyword, to be prose)
const MIN_PROSE_WORDS = 4;

/**
 * Whether a keyword is in prose somewhere in text: in a block of the page
 * with `MIN_PROSE_WORDS` words or more around it, not a menu's link
 * ("Online Casino | Sports | Poker").
 *
 * @param   {string}    text
 * @param   {string}    keyword
 * @param   {Function}  [skip]   See `findKeywords`
 * @returns {boolean}
 */
function isInProse(text, keyword, skip) {
  const { probe, regex } = KEYWORD_MATCHERS.get(keyword);
  if (!text.includes(probe)) return false;
  let seen = 0;
  for (const match of text.matchAll(regex)) {
    const start = match.index;
    const end = start + match[0].length;
    if (!(skip && skip(text, start, end))) {
      const around = `${getBlockBefore(text, start, 60)} ${
        match[0]
      } ${getBlockAfter(text, end, 60)}`;
      if (around.split(/\s+/).filter(Boolean).length >= MIN_PROSE_WORDS)
        return true;
    }

    if (++seen >= MAX_MATCHES) break;
  }

  return false;
}

/**
 * Find each keyword of a category in text, as a whole word or phrase (see
 * `KEYWORD_MATCHERS`). A match overlapping a longer keyword's match does not
 * count on its own: "online casino" is one keyword, not also "casino", and
 * "free porn video" is one, not "free porn" and "porn video" (longer
 * keywords are matched first, and each match of them takes its characters).
 *
 * @param   {string}    text      See `normalizeText`
 * @param   {string[]}  keywords
 * @param   {Function}  [skip]    Whether a match does not count (see
 *                                `SKIP_CONTEXT`); it still takes its
 *                                characters
 * @returns {Map<string, {start: number, end: number}>}  keyword → first match
 */
function findKeywords(text, keywords, skip) {
  const found = new Map();
  // (characters a longer keyword already matched)
  let taken;
  for (const keyword of SORTED_KEYWORDS.get(keywords) || keywords) {
    const { probe, regex } = KEYWORD_MATCHERS.get(keyword);
    if (!text.includes(probe)) continue;
    let seen = 0;
    for (const match of text.matchAll(regex)) {
      const start = match.index;
      const end = start + match[0].length;
      taken ||= new Uint8Array(text.length);
      if (!taken.subarray(start, end).includes(1)) {
        taken.fill(1, start, end);
        if (!found.has(keyword) && !(skip && skip(text, start, end)))
          found.set(keyword, { start, end });
      }

      if (++seen >= MAX_MATCHES) break;
    }
  }

  // (in the order they appear)
  return new Map([...found].sort((a, b) => a[1].start - b[1].start));
}

//
// A ticker ("$bird") a page says at least `MIN_TICKER_COUNT` times, or null
// (not a price: "$45" starts with a digit; not a code sample: "${name}")
//
const TICKER = /(?<![\w$])\$[a-z][a-z\d]{1,9}\b/g;
const MIN_TICKER_COUNT = 3;
// (news, exchanges and wallets name these)
const MAJOR_TICKERS = new Set(
  [
    'btc',
    'eth',
    'sol',
    'usdt',
    'usdc',
    'bnb',
    'xrp',
    'ada',
    'doge',
    'dot',
    'trx',
    'ltc',
    'avax',
    'matic',
    'link',
    'ton'
  ].map((ticker) => `$${ticker}`)
);

function getRepeatedTicker(text) {
  const counts = new Map();
  let seen = 0;
  for (const [ticker] of text.matchAll(TICKER)) {
    if (MAJOR_TICKERS.has(ticker)) continue;
    const count = (counts.get(ticker) || 0) + 1;
    if (count >= MIN_TICKER_COUNT) return ticker;
    counts.set(ticker, count);
    if (++seen >= MAX_MATCHES) break;
  }

  return null;
}

/**
 * The words around a match, for a reviewer to see how a keyword was used.
 *
 * @param   {string}  text
 * @param   {object}  span
 * @returns {string}
 */
function getExcerpt(text, span) {
  const start = Math.max(0, span.start - 60);
  const end = Math.min(text.length, span.end + 60);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${
    end < text.length ? '…' : ''
  }`;
}

/**
 * Categorise a page by its content, and say which keywords matched where.
 *
 * @param   {string}   html
 * @param   {object}   [options]
 * @param   {boolean}  [options.offSite]  Whether a sign-in site served the
 *                                        page after a redirect (see
 *                                        `SIGN_IN_SITES`)
 * @returns {{categories: string[], evidence: object, keywordCounts: object, title: string, textLength: number, isParkedLander: boolean}}
 */
function getContentCategories(html, options = {}) {
  const page = readPage(typeof html === 'string' ? html : '');
  //
  // (cut again once folded: a compatibility character can fold into many,
  //  "ﷺ" into 18, and every keyword is looked for in all of it)
  //
  const text = normalizeText(page.text, MAX_TEXT_LENGTH);
  const joined = page.joinedText
    ? normalizeText(page.joinedText, MAX_TEXT_LENGTH)
    : null;
  const head = normalizeText(page.head, MAX_HEAD_LENGTH);

  const categories = [];
  const evidence = {};
  // category → how many different keywords were found, also too few to flag
  const keywordCounts = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const skip = SKIP_CONTEXT[category];
    const inText = findKeywords(text, keywords, skip);
    // (and in the text as a browser runs it together; see `readPage`)
    const inJoined = joined ? findKeywords(joined, keywords, skip) : new Map();
    // (a keyword found only there: one an inline element splits)
    for (const [keyword, span] of inJoined) {
      if (inText.has(keyword)) continue;
      if (!text.includes(joined.slice(span.start, span.end)))
        inText.set(keyword, { ...span, joined: true });
    }

    const inHead = findKeywords(head, keywords, skip);
    const words = new Set([...inText.keys(), ...inHead.keys()]);
    // (forms of one word, such as "porn" and "pornography", are one keyword)
    const signals = getSignals(words);
    // (keywords that can make the category: see `SUPPORTING_KEYWORDS`)
    //
    // (for gambling, one in the title or description, or in a sentence:
    //  a news site's or a resort's menu links to a casino it is not)
    //
    const deciding = [...words].filter(
      (word) =>
        !SUPPORTING_KEYWORDS.has(word) &&
        (category !== 'gambling' ||
          inHead.has(word) ||
          isInProse(text, word, skip) ||
          (joined !== null && isInProse(joined, word, skip)))
    );

    //
    // Links to meme coin sites are one keyword however many there are, the
    // same one as their name in the text ("DexScreener" linking to
    // dexscreener.com), and only next to a keyword: a developer's blog
    // links to them too
    //
    const inLinks =
      category === 'crypto_scam' && words.size > 0
        ? page.linkHosts
            .filter((host) => !words.has(CRYPTO_LINK_HOSTS[host]))
            .slice(0, 1)
        : [];
    //
    // (a field asking for a wallet's recovery phrase decides it, and so
    //  does a coin's ticker said again and again: "$BIRD", as a meme coin's
    //  launch page does, next to other crypto wording)
    //
    const inFields = [];
    // (an adult site's own label for parental filters)
    if (category === 'adult' && page.hasRtaLabel) inFields.push('RTA label');
    if (category === 'crypto_scam') {
      if (page.asksForSeedPhrase) inFields.push('recovery phrase field');
      // (and in its title or description, as a launch page puts it: a
      //  news ticker or a stock's cashtag does not)
      const ticker = words.size > 0 ? getRepeatedTicker(text) : null;
      if (ticker && head.includes(ticker)) inFields.push(ticker);
    }

    deciding.push(...inFields);

    // (a sign-in's title on a page asking for credentials, see
    //  `getSignInTitle`)
    //  (a brand's also on an email-first step: `<input type="email">`)
    const asks = page.asksForCredentials || page.asksForLogin;
    //  (not on a page a sign-in site served after a redirect: a domain
    //  forwarding to its webmail shows Google's or Microsoft's own sign-in)
    let signIn =
      category === 'phishing' && !options.offSite && (asks || page.asksForEmail)
        ? getSignInTitle(normalizeText(page.title))
        : null;
    if (signIn?.generic && !asks) signIn = null;
    const brand = signIn?.brand;

    const distinct = signals.size + inLinks.length + inFields.length;
    if (distinct === 0 && !signIn) continue;
    if (distinct > 0) keywordCounts[category] = distinct;

    let found = category;
    if (ACTIONABLE_CONTENT_CATEGORIES.has(category)) {
      if (category === 'phishing') {
        //
        // A page asking for credentials whose title is a sign-in to a
        // brand it copies is phishing. Sign-in wording next to pressure
        // ("unusual activity", "account suspended") on a page asking for a
        // password or a card, or more of it on a sign-in's first step (a
        // username), is only possible phishing: banks, ISPs and help desks
        // write it too. So is the title of a sign-in with no brand.
        //
        if (!brand) {
          const needed = page.asksForCredentials
            ? MIN_CONTENT_KEYWORDS
            : page.asksForLogin
            ? MIN_CONTENT_KEYWORDS + 1
            : Number.POSITIVE_INFINITY;
          if (!signIn && (distinct < needed || deciding.length === 0)) continue;
          found = 'possible_phishing';
        }
      } else if (distinct < MIN_CONTENT_KEYWORDS || deciding.length === 0) {
        continue;
      }
    }

    categories.push(found);
    evidence[found] = [
      ...[...inHead].map(([keyword, span]) => ({
        keyword,
        in: 'title',
        excerpt: getExcerpt(head, span)
      })),
      ...[...inText]
        .filter(([keyword]) => !inHead.has(keyword))
        .map(([keyword, span]) => ({
          keyword,
          in: 'text',
          excerpt: getExcerpt(span.joined ? joined : text, span)
        })),
      ...inLinks.map((host) => ({
        keyword: host,
        in: 'link',
        excerpt: `a link to ${host}`
      })),
      ...inFields.map((field) => ({
        keyword: field,
        in: 'text',
        excerpt:
          field === 'recovery phrase field'
            ? 'the page asks for a wallet recovery phrase'
            : field === 'RTA label'
            ? 'the page labels itself adult content (RTA)'
            : `the page names the ticker ${field} again and again`
      })),
      ...(signIn
        ? [
            {
              keyword: brand || signIn.generic,
              in: 'title',
              excerpt: `${page.title} (a page asking for credentials)`
            }
          ]
        : [])
    ].slice(0, 5);
  }

  if (page.isParkedLander && !categories.includes('parked')) {
    categories.push('parked');
    evidence.parked = [
      {
        keyword: '/lander',
        in: 'text',
        excerpt: 'the page only redirects to /lander (a GoDaddy parked domain)'
      }
    ];
  }

  return {
    categories,
    evidence,
    keywordCounts,
    title: page.title,
    textLength: page.textLength,
    isParkedLander: page.isParkedLander
  };
}

/**
 * Analyse the domain name itself for suspicious patterns.
 *
 * @param   {string}  domain
 * @returns {Array<{category: string, pattern: string}>}
 */
// (words with a pattern in them: "mainstreamhealth" is not a streaming
//  site, nor "dramaticarts")
const NOT_DOMAIN_NAME_PATTERN =
  /(?:main|up|down|slip|jet|gulf|blood|data|work|revenue|income)stream|dramati[cs]/g;

function categoriseByDomainName(domain) {
  const matches = [];
  const lc = domain.toLowerCase().replace(NOT_DOMAIN_NAME_PATTERN, '');

  for (const [category, patterns] of Object.entries(DOMAIN_NAME_PATTERNS)) {
    const pattern = patterns.find((pattern) => lc.includes(pattern));
    if (pattern) matches.push({ category, pattern });
  }

  return matches;
}

/**
 * Main entry point – categorise a single domain.
 *
 * Performs three layers of analysis:
 *   1. Cloudflare Family DNS (1.1.1.3) – detects adult/malware blocks; a
 *      block is also asked of 1.1.1.2 (a security threat or adult content)
 *      and of an unfiltered resolver (a domain pointing to 0.0.0.0 itself)
 *   2. The disposable email domain list, and domain-name pattern matching –
 *      URL shorteners, phishing, etc.
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
 * @param   {object}  [opts.securityResolver]  Tangerine instance (1.1.1.2)
 * @param   {object}  [opts.resolver]      Tangerine instance (unfiltered)
 * @param   {object}  [opts.client]        Redis client (the disposable domain list)
 * @param   {object}  [opts.logger]        Logger (defaults to module logger)
 * @param   {number}  [opts.timeout=10000] HTTP timeout in ms
 * @returns {Promise<object>}
 */
async function getDomainCategorization(domain, opts = {}) {
  const { familyResolver, securityResolver, resolver, client } = opts;
  const log = opts.logger || loggerDefault;
  const timeout = opts.timeout || DEFAULT_TIMEOUT_MS;

  const result = {
    domain,
    blocked: false,
    // security, adult or unknown when blocked (see checkCloudflareFamilyDNS)
    cloudflareBlock: null,
    // true when both Cloudflare resolvers answer 0.0.0.0 because the domain
    // itself points there: whether Cloudflare blocks it is not known
    pointsToZeroAddress: false,
    // true when the domain has no address (Cloudflare answers 0.0.0.0 for a
    // name it blocks, with or without one, so it is not blocked)
    noAddress: false,
    // true when the disposable email domain list could not be read
    disposableListError: false,
    categories: [],
    // category → the keywords that matched, where, and the words around them
    evidence: {},
    // characters of visible page text
    textLength: 0,
    // true for a GoDaddy parked page (it only redirects to /lander)
    isParkedLander: false,
    // category → different keywords found on the page, also too few to flag
    keywordCounts: {},
    title: '',
    statusCode: null,
    contentLength: 0,
    isParked: false,
    hasLegitimateHosting: true,
    // true when the time ran out while its page was still arriving (what
    // came is read)
    timedOut: false,
    error: null
  };

  //
  // Run the DNS check, the HTTP fetch and the disposable list lookup
  // concurrently, all within `timeout`: they are independent I/O
  // operations.  Domain-name pattern matching (Step 2) is synchronous and
  // runs afterwards.
  //
  const [dnsResult, fetchResult, listedDisposable] = await Promise.all([
    // Step 1 – Cloudflare Family DNS check
    // (a lookup that takes longer is a DNS error: it does not clear a
    //  block, see `updateVerdict` in `check-domain-and-act`)
    familyResolver
      ? withDeadline(
          checkCloudflareFamilyDNS(
            domain,
            familyResolver,
            securityResolver,
            resolver
          ),
          timeout,
          { dnsCategory: 'dns_error', aRecords: [], dnsError: 'ETIMEOUT' }
        )
      : { dnsCategory: false, aRecords: [] },

    // Step 3 – HTTP content fetch (runs in parallel with DNS)
    // (and not a moment longer, also when a cancelled request is slow to
    //  end)
    withDeadline(
      fetchDomainContent(domain, { timeout, logger: log }).catch((err) => {
        log.debug(`HTTP categorisation error for ${domain}`, {
          error: err.message
        });
        return {
          statusCode: null,
          contentLength: 0,
          body: '',
          error: err.message
        };
      }),
      timeout + 50,
      { statusCode: null, contentLength: 0, body: '', error: 'TIMEOUT' }
    ),

    // A domain of a known disposable email service
    withDeadline(
      getListedDisposableDomain(client, domain),
      timeout,
      'TIMEOUT'
    ).then(
      (listed) => {
        if (listed !== 'TIMEOUT') return listed;
        result.disposableListError = true;
        return null;
      },
      (err) => {
        log.warn(err);
        result.disposableListError = true;
        return null;
      }
    )
  ]);

  //
  // Apply DNS results
  //
  if (dnsResult.dnsCategory) {
    result.blocked = dnsResult.dnsCategory === 'blocked_by_cloudflare_family';
    if (result.blocked) result.cloudflareBlock = dnsResult.cloudflareBlock;
    result.categories.push(dnsResult.dnsCategory);
    if (dnsResult.onParkingIp) result.categories.push('parking_ip');
  }

  if (dnsResult.pointsToZeroAddress) result.pointsToZeroAddress = true;
  if (dnsResult.noAddress) result.noAddress = true;

  // Propagate DNS error details so the digest can report them
  if (dnsResult.dnsError) {
    result.dnsError = dnsResult.dnsError;
  }

  // Reuse hasLegitimateHosting from check-domain-reputation.js
  // (same function the SMTP approval flow uses in domains.js verifySMTP)
  if (dnsResult.aRecords.length > 0) {
    result.hasLegitimateHosting = hasLegitimateHosting(dnsResult.aRecords);
  }

  //
  // Step 2 – the disposable email domain list, and domain-name patterns
  //
  if (listedDisposable) {
    result.categories.push('disposable_email');
    result.evidence.disposable_email = [
      {
        keyword: listedDisposable,
        in: 'list',
        excerpt: 'github.com/disposable/disposable-email-domains'
      }
    ];
  }

  for (const { category, pattern } of categoriseByDomainName(domain)) {
    if (!result.categories.includes(category)) {
      result.categories.push(category);
      result.evidence[category] = [
        { keyword: pattern, in: 'domain', excerpt: domain }
      ];
    }
  }

  //
  // Apply HTTP fetch results
  //
  result.statusCode = fetchResult.statusCode;
  result.contentLength = fetchResult.contentLength;
  result.error = fetchResult.error;
  result.timedOut = Boolean(fetchResult.timedOut);

  if (fetchResult.body && fetchResult.body.length > 0) {
    // Content-based categorisation
    // (a page a sign-in site served, after a redirect)
    const finalRoot = fetchResult.finalHost
      ? parseRootDomain(fetchResult.finalHost)
      : null;
    const offSite = Boolean(
      finalRoot &&
        finalRoot !== parseRootDomain(domain) &&
        SIGN_IN_SITES.has(finalRoot)
    );
    const content = getContentCategories(fetchResult.body, { offSite });
    result.title = content.title;
    result.textLength = content.textLength;
    result.isParkedLander = content.isParkedLander;
    result.keywordCounts = content.keywordCounts;
    for (const cat of content.categories) {
      if (!result.categories.includes(cat)) {
        result.categories.push(cat);
        result.evidence[cat] = content.evidence[cat];
      }
    }

    // If no categories matched and the page has very little content,
    // flag it as minimal / splash page
    if (
      result.categories.length === 0 &&
      !result.timedOut &&
      result.contentLength < 500 &&
      result.statusCode &&
      result.statusCode < 400
    ) {
      result.categories.push('minimal_content');
    }
  } else if (!fetchResult.error && fetchResult.statusCode === null) {
    result.error = 'NO_RESPONSE';
  }

  // Mark as parked if a parked page or a parking IP was detected
  if (
    result.categories.includes('parked') ||
    result.categories.includes('parking_ip')
  ) {
    result.isParked = true;
  }

  return result;
}

module.exports = getDomainCategorization;
module.exports.getContentCategories = getContentCategories;
module.exports.checkCloudflareFamilyDNS = checkCloudflareFamilyDNS;
