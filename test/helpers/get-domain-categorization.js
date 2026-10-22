/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// How a domain is categorised from what Cloudflare Family DNS answers for
// it (the resolver is injected: jobs/check-domains-cloudflare-family.js and
// the Domains model hand in one that queries 1.1.1.3 and 1.0.0.3): a domain
// the family filter blocks resolves to 0.0.0.0, a parked domain to a
// parking IP, and a resolver failure is reported rather than treated as
// either.
//

const process = require('node:process');

const test = require('ava');

//
// No lookups or fetches: the pages below are given, and a domain's own page
// is refused as if it were private, without asking a resolver (unless a
// test serves one itself: see `servePage`)
//
const isPrivateHost = require('#helpers/is-private-host');

let refuseFetch = true;
const isPrivateHostPath = require.resolve('#helpers/is-private-host');
require.cache[isPrivateHostPath].exports = Object.assign(
  (...args) => isPrivateHost(...args),
  isPrivateHost,
  { isPrivateHostResolved: async () => refuseFetch }
);

const getDomainCategorization = require('#helpers/get-domain-categorization');

// (the content fetch of the domain is not the point here)
const DOMAIN = 'categorised-domain.invalid';
const OPTIONS = {
  timeout: 1000,
  logger: { debug() {}, error() {}, warn() {} }
};

function resolverAnswering(answer) {
  return {
    async resolve(name) {
      if (name !== DOMAIN) throw new Error(`unexpected lookup of ${name}`);
      if (answer instanceof Error) throw answer;
      return answer;
    }
  };
}

test('a domain the family filter blocks is blocked', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0'])
  });
  t.true(result.blocked);
  t.true(result.categories.includes('blocked_by_cloudflare_family'));

  // even when the block answer comes with other records
  const mixed = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['93.184.216.34', '0.0.0.0'])
  });
  t.true(mixed.blocked);
});

test('a domain that resolves normally is not', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['93.184.216.34'])
  });
  t.false(result.blocked);
  t.false(result.categories.includes('blocked_by_cloudflare_family'));
  t.true(result.hasLegitimateHosting);
});

test('a resolver failure is reported, not taken for an answer', async (t) => {
  const err = new Error('query timed out');
  err.code = 'ETIMEOUT';
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(err)
  });
  t.false(result.blocked);
  t.true(result.categories.includes('dns_error'));
  t.is(result.dnsError, 'ETIMEOUT');

  // and without a family resolver at all the DNS check is simply skipped
  const none = await getDomainCategorization(DOMAIN, OPTIONS);
  t.false(none.blocked);
  t.false(none.categories.includes('dns_error'));
});

//
// Cloudflare's security resolver (1.1.1.2) blocks malware and phishing but
// not adult content, so asked about a domain the family resolver blocks it
// tells the two apart
//
test('a block is a security threat when the security resolver blocks too', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(['0.0.0.0'])
  });
  t.true(result.blocked);
  t.is(result.cloudflareBlock, 'security');
});

test('a block is adult content when only the family resolver blocks', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(['93.184.216.34'])
  });
  t.true(result.blocked);
  t.is(result.cloudflareBlock, 'adult');
});

test('a block stays unexplained when the security resolver cannot tell', async (t) => {
  const err = new Error('query timed out');
  err.code = 'ETIMEOUT';
  const failed = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(err)
  });
  t.true(failed.blocked);
  t.is(failed.cloudflareBlock, 'unknown');

  const none = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0'])
  });
  t.is(none.cloudflareBlock, 'unknown');

  // and a domain that is not blocked is not asked about
  const clean = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['93.184.216.34']),
    securityResolver: {
      async resolve() {
        throw new Error('the security resolver was asked');
      }
    }
  });
  t.false(clean.blocked);
  t.is(clean.cloudflareBlock, null);
});

test("a domain's own 0.0.0.0 record is not a block", async (t) => {
  // (a domain that only sends mail points there; both resolvers pass it on)
  const own = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(['0.0.0.0']),
    resolver: resolverAnswering(['0.0.0.0'])
  });
  t.false(own.blocked);
  t.false(own.categories.includes('blocked_by_cloudflare_family'));
  t.true(own.pointsToZeroAddress);

  const blocked = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(['0.0.0.0']),
    resolver: resolverAnswering(['93.184.216.34'])
  });
  t.true(blocked.blocked);
  t.is(blocked.cloudflareBlock, 'security');
});

//
// Categories from page content. Every page below is synthetic, modelled on
// pages the content check flagged by mistake (a keyword inside another word
// or language, a placeholder, a code sample, a passing mention, a page about
// a subject rather than selling it) and on the abuse it is there to find.
//
const { getContentCategories } = getDomainCategorization;

function page(body, head = '', title = 'Example') {
  return `<!doctype html><html><head><title>${title}</title>${head}</head><body>${body}</body></html>`;
}

function categoriesOf(html) {
  return getContentCategories(html).categories;
}

// (milliseconds of CPU time since `start`: a busy test runner does not
//  count, as it would by the clock)
function cpuMsSince(start) {
  const { user, system } = process.cpuUsage(start);
  return (user + system) / 1000;
}

test('a keyword inside a longer word does not match', (t) => {
  const { keywordCounts } = getContentCategories(
    page(`
      <h1>Rezepte</h1>
      <p>Das Rezept für cremige Brokkoli-Nudeln ist unser Favorit.</p>
      <h2>Podcast</h2>
      <p>Folge 59: hinter den Kulissen der Pornowelt, im Gespräch mit einem Kameramann.</p>
      <p>Provinzen: Liaoning, Jilin, Heilongjiang. Stadtteil Kazinograd.</p>
    `)
  );
  t.deepEqual(keywordCounts, {});
});

test('placeholders and code samples are not page text', (t) => {
  const { keywordCounts } = getContentCategories(
    page(`
      <h1>Getting started</h1>
      <p>Install the client, then create an app in the dashboard and copy its
      key into your configuration. The market data widget shows MCAP XXXX and
      PRICE XXXX until the first quote arrives. Call support at +1 xxx-xxx-xxxx
      if the key is rejected.</p>
      <pre>init({ app: 'myapp', key: 'key_xxx', tags: 'porn nsfw hentai' });</pre>
      <code>free porn video</code>
    `)
  );
  t.is(keywordCounts.adult, undefined);
});

test('a page made of code samples is read', (t) => {
  // (its text wrapped in <pre> to keep it out of the check)
  t.true(
    categoriesOf(
      page(
        '<pre style="font-family: inherit">Online casino with free spins and a deposit bonus.</pre>'
      )
    ).includes('gambling')
  );
});

test('one passing mention is not enough to flag a page', (t) => {
  t.false(
    categoriesOf(
      page(
        '<p>A new platform to overcome gambling addiction and debt.</p>',
        '<meta name="description" content="Overcome gambling addiction">'
      )
    ).includes('gambling')
  );

  // (one phrase is one keyword: "online casino" is not also "casino")
  t.false(
    categoriesOf(page('<p>Our review of an online casino.</p>')).includes(
      'gambling'
    )
  );
});

test('a page about a subject is not one that runs or sells it', (t) => {
  for (const [html, category] of [
    // (a casino-themed bar, and a travel guide)
    [
      page(
        '<p>Casino Royale bar: poker night on Fridays, blackjack and roulette tables for private parties.</p>'
      ),
      'gambling'
    ],
    [
      page(
        '<p>Las Vegas guide: the best casino hotels, poker rooms and slot machines on the Strip.</p>'
      ),
      'gambling'
    ],
    // (sex education)
    [
      page(
        '<p>Talking with teens about porn, nudity online and sexual activity.</p>'
      ),
      'adult'
    ],
    // (a pharmacy chain)
    [
      page(
        '<p>Our online pharmacy refills prescriptions. Allergy tablets are sold without a prescription.</p>'
      ),
      'pharmacy'
    ],
    // (an exchange)
    [
      page(
        '<p>Connect your wallet, check the contract address and read the tokenomics before you trade.</p>'
      ),
      'crypto_scam'
    ],
    // (a library, and a torrent client)
    [
      page(
        '<p>Read manga and watch online free with your library card. Torrent client docs: seeders and leechers.</p>'
      ),
      'piracy'
    ]
  ]) {
    t.false(categoriesOf(html).includes(category), `${category}`);
  }
});

test('pages that are what their keywords say are flagged, with evidence', (t) => {
  const casino = getContentCategories(
    page(
      '<p>Claim 100 free spins and a deposit bonus. Hit the jackpot at our online casino!</p>',
      '<meta name="description" content="The best casino slots">'
    )
  );
  t.true(casino.categories.includes('gambling'));
  const keywords = new Set(casino.evidence.gambling.map((e) => e.keyword));
  t.true(keywords.has('free spins'));
  t.true(keywords.has('casino'));
  const inTitle = casino.evidence.gambling.find((e) => e.keyword === 'casino');
  t.is(inTitle.in, 'title');
  t.true(inTitle.excerpt.includes('best casino slots'));

  for (const [html, category] of [
    [
      page(
        '<p>Sports betting with free bets for new players. Bet now on tonight’s games.</p>'
      ),
      'gambling'
    ],
    [
      page(
        '<p>Crypto casino: crash, dice and plinko. Provably fair, with rakeback.</p>'
      ),
      'gambling'
    ],
    [
      page('<p>Casino en línea con giros gratis y apuestas deportivas.</p>'),
      'gambling'
    ],
    [page('<p>Slot gacor maxwin hari ini, togel 4D.</p>'), 'gambling'],
    [page('<p>Free porn videos, hentai and live sex cams.</p>'), 'adult'],
    [
      page(
        '<h1>Latest OnlyFans leaks</h1><p>Free nudes of your favourite creators.</p>'
      ),
      'adult'
    ],
    [
      page('<p>Free temporary email. Get a disposable inbox in one click.</p>'),
      'disposable_email'
    ],
    [
      page(
        '<p>$EXAMPLE is a meme coin. Stealth launch today: connect your wallet.</p>'
      ),
      'crypto_scam'
    ],
    [
      page(
        '<p>Claim airdrop: eligible wallets receive 2,500 tokens. Connect wallet.</p>'
      ),
      'crypto_scam'
    ],
    [
      page(
        '<p>Canadian pharmacy: order Viagra, Cialis and Xanax without prescription.</p>'
      ),
      'pharmacy'
    ],
    [
      page('<p>Kamagra, sildenafil and tadalafil at the lowest prices.</p>'),
      'pharmacy'
    ],
    [
      page(
        '<h1>Example Music MOD APK (pro unlocked)</h1><p>Unlimited coins, no ads.</p>'
      ),
      'malware'
    ]
  ]) {
    t.true(categoriesOf(html).includes(category), `${html}`);
  }
});

test('minified markup is read word by word', (t) => {
  // (no whitespace between elements, as server-rendered apps send it)
  t.true(
    categoriesOf(
      '<html><body><nav><a>Free spins</a><a>Roulette</a></nav><p>Play at our online casino</p></body></html>'
    ).includes('gambling')
  );
  t.true(
    categoriesOf(
      '<html><head><title>Temp Mail</title></head><body><h1>Temporary Email Address</h1></body></html>'
    ).includes('disposable_email')
  );
});

test('brand names with digits and keywords next to other scripts match', (t) => {
  t.true(
    categoriesOf(page('<p>SBOBET88 TOGEL4D JILI777</p>')).includes('gambling')
  );
  t.true(
    categoriesOf(page('<p>最新porn视频 免费hentai动漫</p>')).includes('adult')
  );
  // (digits before a keyword, as in "888casino")
  t.is(
    getContentCategories(page('<p>888casino 777poker</p>')).keywordCounts
      .gambling,
    2
  );
});

test('forms of one word count as one keyword', (t) => {
  // ("free porn video" is not both "free porn" and "porn video")
  t.is(
    getContentCategories(page('<p>free porn video</p>')).keywordCounts.adult,
    1
  );
  for (const [html, category] of [
    // (a consumer safety page)
    [
      page(
        '<p>Know the risks of buying from online pharmacies. A safe online pharmacy asks for your prescription.</p>'
      ),
      'pharmacy'
    ],
    [
      page(
        '<p>Ibuprofen is sold without a prescription. No prescription is needed.</p>'
      ),
      'pharmacy'
    ],
    // (a historian)
    [
      page(
        '<p>A history of pornography laws, and of pornographic films in court.</p>'
      ),
      'adult'
    ]
  ]) {
    t.is(getContentCategories(html).keywordCounts[category], 1);
  }
});

test('a keyword first seen inside a longer one still counts on its own', (t) => {
  // (each match of "online casino" takes its characters, not the first 20)
  const { evidence } = getContentCategories(
    page(
      `<p>${'Our online casino. '.repeat(
        40
      )}</p><p>Casino night tickets, free spins.</p>`
    )
  );
  t.true(evidence.gambling.some((e) => e.keyword === 'casino'));
});

test('an age gate counts, but only an adult site is adult content', (t) => {
  // (a vape shop, a liquor store and a resort say "18 or older" too)
  for (const html of [
    page('<p>You must be 18 or older to enter. Adults only.</p>'),
    page('<p>Adults only pool and spa. You must be 18 to book.</p>')
  ]) {
    t.false(categoriesOf(html).includes('adult'), `${html}`);
  }

  t.true(
    categoriesOf(
      page(
        '<p>Free porn videos inside. This website contains sexually explicit material. You must be 18 or older to enter.</p>'
      )
    ).includes('adult')
  );

  // (one adult keyword is counted, though too few to flag the page: an age
  //  gate bears out a Cloudflare adult block, see check-domain-and-act)
  const { categories, keywordCounts } = getContentCategories(
    page('<p>This website contains sexually explicit material.</p>')
  );
  t.false(categories.includes('adult'));
  t.is(keywordCounts.adult, 1);
});

test('a warning, a denial or a filter does not count', (t) => {
  for (const [html, category] of [
    [
      page(
        '<p>Earn staking rewards (not a guaranteed return). Analysts warn about presale scams and free crypto offers.</p>'
      ),
      'crypto_scam'
    ],
    // (parental controls)
    [
      page(
        '<p>Block adult content, porn sites, online casino and gambling apps, and live sex streams.</p>'
      ),
      'gambling'
    ],
    [
      page(
        '<p>Block adult content, porn sites, online casino and gambling apps, and live sex streams.</p>'
      ),
      'adult'
    ],
    [
      page(
        '<p>Beware of sites that sell Viagra without prescription: avoid any offer to buy Viagra online.</p>'
      ),
      'pharmacy'
    ]
  ]) {
    t.false(categoriesOf(html).includes(category), `${category}`);
  }
});

test('a sign-up rule or a filter naming disposable email is not one', (t) => {
  t.false(
    categoriesOf(
      page(
        '<p>Disposable email addresses (temp mail, 10 minute mail, etc.) are not allowed.</p>'
      )
    ).includes('disposable_email')
  );
  t.false(
    categoriesOf(
      page(
        '<p>Our API detects temp mail and every disposable inbox in real time.</p>'
      )
    ).includes('disposable_email')
  );
  // (a temp mail service saying some sites block it is still one)
  t.true(
    categoriesOf(
      page(
        '<h1>Temp Mail</h1><p>A free temporary inbox. Some sites block temp mail; ours keeps working.</p>'
      )
    ).includes('disposable_email')
  );
});

test('disposable email services in other languages match', (t) => {
  for (const html of [
    page('<h1>Temp Mail</h1><p>Correo temporal desechable y gratis.</p>'),
    page('<h1>Wegwerf-E-Mail</h1><p>Kostenlose tempmail Adresse.</p>'),
    page('<h1>Email jetable</h1><p>Une adresse mail temporaire gratuite.</p>'),
    page('<h1>临时邮箱</h1><p>免费 temp mail</p>')
  ]) {
    t.true(categoriesOf(html).includes('disposable_email'), `${html}`);
  }
});

//
// Phishing
//
const PASSWORD_FORM =
  '<form><input name="user"><input type="password" name="pass"><button>Sign in</button></form>';

test('sign-in wording alone, or without pressure, is not phishing', (t) => {
  // (no field asking for credentials)
  const otp = page(`
    <p>We noticed unusual activity.</p>
    <p>Please enter the one-time password to verify your account.</p>
    <input type="text" name="code">
  `);
  t.deepEqual(categoriesOf(otp), []);

  // (a sign-in page: every one says these)
  const signIn = page(`
    <h1>Sign in to continue to Example Bank</h1>
    <p>Verify your email, then confirm your identity. Login to continue.</p>
    ${PASSWORD_FORM}
  `);
  t.deepEqual(categoriesOf(signIn), []);
});

test('sign-in wording with pressure on a page asking for credentials is possible phishing', (t) => {
  // (banks and help desks write it too: listed for review, not phishing)
  const result = getContentCategories(
    page(`
      <p>We noticed unusual activity.</p>
      <p>Sign in to verify your account.</p>
      ${PASSWORD_FORM}
    `)
  );
  t.deepEqual(result.categories, ['possible_phishing']);
  t.deepEqual(result.evidence.possible_phishing.map((e) => e.keyword).sort(), [
    'unusual activity',
    'verify your account'
  ]);

  const wording = `
    <p>We noticed unusual activity.</p>
    <p>Please verify your account to continue.</p>
  `;
  for (const html of [
    // (a card form known only by its field names, or its hints)
    page(`${wording}<form><input name="cardnumber"><input name="cvv"></form>`),
    page(
      `${wording}<form><input name="cc" placeholder="Card number"><input name="cv2"></form>`
    ),
    // (a password field a script adds, or one in a template)
    page(
      `${wording}<div id="app"></div><script>render({ type: "password" })</script>`
    ),
    page(`${wording}<template><form><input type="password"></form></template>`),
    // (a sign-in's first step, a username, with more of the wording)
    page(`
      <p>Security alert: we noticed unusual activity.</p>
      <p>Verify your account to continue.</p>
      <form><input type="email" name="loginfmt"><button>Next</button></form>
    `)
  ]) {
    t.deepEqual(categoriesOf(html), ['possible_phishing'], `${html}`);
  }

  // (a stylesheet styling password fields, a hidden field or a newsletter
  //  field does not ask for credentials)
  for (const html of [
    page(`${wording}<style>input[type="password"] { border: 0 }</style>`),
    page(
      `${wording}<form><input type="hidden" name="pwd_policy" value="1"></form>`
    ),
    page(`
      ${wording}<p>Your account has been flagged for review.</p>
      <form><input type="email" name="email" autocomplete="email"><button>Subscribe</button></form>
    `)
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('a page asking for credentials under a brand it copies is phishing', (t) => {
  for (const html of [
    page(PASSWORD_FORM, '', 'Microsoft 365 – Sign in'),
    page(PASSWORD_FORM, '', 'PayPal: Log in to your account'),
    page(PASSWORD_FORM, '', 'Google Account – Security alert'),
    page(PASSWORD_FORM, '', 'DocuSign - Review Document'),
    page(
      '<form><input name="cardnumber"><input name="cvv"></form>',
      '',
      'Netflix – Update your payment'
    ),
    page(
      '<form><input name="identifier"><button>Next</button></form>',
      '',
      'Sign in - Google Accounts'
    ),
    // (a wallet's recovery phrase, asked for in a text box)
    page(
      '<p>Enter your 12-word recovery phrase to restore your wallet.</p><form><textarea name="phrase"></textarea></form>',
      '',
      'MetaMask - Restore Wallet'
    )
  ]) {
    const { categories, evidence } = getContentCategories(html);
    t.true(categories.includes('phishing'), `${html}`);
    t.is(evidence.phishing.at(-1).in, 'title');
  }

  // (the title of Microsoft's own sign-in, with no brand: possible phishing)
  t.deepEqual(
    categoriesOf(
      page(
        '<form><input type="email" name="loginfmt"><button>Next</button></form>',
        '',
        'Sign in to your account'
      )
    ),
    ['possible_phishing']
  );

  // (a title that names a brand without being a sign-in to it, a button for
  //  single sign-on, or a brand on a page asking for nothing)
  for (const title of [
    'Sign in with Microsoft',
    'Example IT | Microsoft 365 & Azure Partner',
    'Example Shop – PayPal accepted',
    'Example Store - Netflix gift cards',
    'Print discounted USPS postage | Example'
  ]) {
    t.deepEqual(categoriesOf(page(PASSWORD_FORM, '', title)), [], `${title}`);
  }

  t.deepEqual(categoriesOf(page('<p>Hello</p>', '', 'PayPal')), []);
  // (an email's Cc field, and a postal PIN code, are not credentials)
  t.deepEqual(
    categoriesOf(
      page(
        '<p>We noticed unusual activity. Verify your account.</p><form><input name="cc"><input name="pin" placeholder="PIN code"></form>'
      )
    ),
    []
  );
});

test('phishing wording in a warning does not count', (t) => {
  const { keywordCounts } = getContentCategories(
    page(`
      <p>We will never ask you to confirm your identity by email.</p>
      <p>Beware of messages saying your account suspended.</p>
      ${PASSWORD_FORM}
    `)
  );
  t.is(keywordCounts.phishing, undefined);
});

//
// Crypto
//
test('a meme coin page linking to DEX sites through icons is a crypto scam', (t) => {
  const { categories, evidence } = getContentCategories(
    page(`
      <h1>$EXAMPLE</h1>
      <p>CA: TBA</p>
      <a href="https://dexscreener.com/example"><svg></svg></a>
      <a href="//www.pump.fun/coin/example"><svg></svg></a>
      <a href="/about">About</a>
    `)
  );
  t.true(categories.includes('crypto_scam'));
  // (the links are one keyword, next to a keyword)
  t.deepEqual(
    evidence.crypto_scam.map((e) => [e.keyword, e.in]),
    [
      ['ca: tba', 'text'],
      ['dexscreener.com', 'link']
    ]
  );
});

test('links to crypto sites alone, or with their own names, are not a crypto scam', (t) => {
  // (a developer's blog)
  for (const html of [
    page(`
      <p>Notes on swapping tokens programmatically.</p>
      <a href="https://raydium.io/swap">one</a> <a href="https://jup.ag">two</a>
    `),
    page(`
      <p>The chart is on <a href="https://dexscreener.com/example">DexScreener</a>.</p>
    `)
  ]) {
    t.false(categoriesOf(html).includes('crypto_scam'));
  }
});

//
// Reading the page
//
test('keywords written to slip past a plain match still match', (t) => {
  for (const html of [
    // fullwidth letters
    page('<p>ｆｒｅｅ ｓｐｉｎｓ ａｔ ｏｕｒ ｏｎｌｉｎｅ ｃａｓｉｎｏ</p>'),
    // the Turkish dotted capital I
    page('<p>FREE SPİNS AT OUR ONLİNE CASİNO</p>'),
    // a soft hyphen and invisible characters inside the words
    page('<p>free spi&shy;ns at our online cas&#x200B;ino</p>'),
    page('<p>free spi&#x2066;ns at our online cas&#x3164;ino</p>'),
    // accents
    page('<p>frée spíns at our ónline cásino</p>')
  ]) {
    t.true(categoriesOf(html).includes('gambling'), `${html}`);
  }
});

test('deeply nested or unclosed markup is read quickly', (t) => {
  for (const html of [
    '<span>online casino free spins '.repeat(40_000),
    '<div>'.repeat(40_000) + 'online casino free spins',
    '<div>'.repeat(20_000) +
      '</span>'.repeat(20_000) +
      'online casino free spins',
    '<span><i>online casino free spins</span>'.repeat(10_000)
  ]) {
    const start = process.cpuUsage();
    const { categories } = getContentCategories(html);
    t.true(cpuMsSince(start) < 5000);
    t.true(categories.includes('gambling'));
  }
});

test('an element left open does not hide the rest of the page', (t) => {
  // (a browser shows the paragraph after an unclosed <svg>)
  t.true(
    categoriesOf(
      '<html><body><svg width="0"><p>Online casino with free spins and a deposit bonus.</p></body></html>'
    ).includes('gambling')
  );
  // (the title of a closed one is not page text)
  t.deepEqual(
    getContentCategories(
      page(
        '<svg><title>online casino free spins deposit bonus</title></svg><p>Hello</p>'
      )
    ).keywordCounts,
    {}
  );
});

test('the doctype is not page text', (t) => {
  const { textLength } = getContentCategories(
    '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html><body><p>Hi</p></body></html>'
  );
  t.is(textLength, 2);
});

test('a heading followed by a colon is not one phrase with what follows', (t) => {
  const { keywordCounts } = getContentCategories(
    page('<p>Watch live: Sex Education, season two.</p>')
  );
  t.is(keywordCounts.adult, undefined);
});

test('a GoDaddy parked domain is parked', (t) => {
  const { categories, isParkedLander } = getContentCategories(
    '<!DOCTYPE html><html><head><script>window.onload=function(){window.location.href="/lander"}</script></head></html>'
  );
  t.true(categories.includes('parked'));
  t.true(isParkedLander);
});

test('a page selling email service for other domains is an email service', (t) => {
  t.true(
    categoriesOf(
      page(
        '<p>Email hosting for your business: unlimited mailboxes and an SMTP relay.</p>'
      )
    ).includes('email_service')
  );
});

//
// Domain-level checks
//
test('a blocked domain on a parking IP is parked', async (t) => {
  // (the security resolver answers with the domain's own records)
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(['3.33.130.190'])
  });
  t.is(result.cloudflareBlock, 'adult');
  t.true(result.categories.includes('parking_ip'));
  t.true(result.isParked);
});

test('a domain with no address is not a DNS error', async (t) => {
  for (const code of ['ENODATA', 'ENOTFOUND']) {
    const err = new Error(code);
    err.code = code;

    const result = await getDomainCategorization(DOMAIN, {
      ...OPTIONS,
      familyResolver: resolverAnswering(err)
    });
    t.false(result.categories.includes('dns_error'), `${code}`);
    t.false(result.blocked);
  }
});

test('a domain on the disposable email domain list is a disposable email service', async (t) => {
  const Redis = require('ioredis-mock');
  const { randomUUID } = require('node:crypto');
  const { storeDisposableDomains } = require('#helpers/disposable-domains');

  const client = new Redis({ keyPrefix: `${randomUUID()}:` });
  await storeDisposableDomains(client, [DOMAIN]);
  const result = await getDomainCategorization(DOMAIN, { ...OPTIONS, client });
  t.true(result.categories.includes('disposable_email'));
  t.is(result.evidence.disposable_email[0].in, 'list');
});

test('a domain named after a disposable email service is one', async (t) => {
  const result = await getDomainCategorization(
    'yopmail-mirror.invalid',
    OPTIONS
  );
  t.true(result.categories.includes('disposable_email'));
  t.is(result.evidence.disposable_email[0].in, 'domain');
});

test('a page asking for a wallet recovery phrase is a crypto scam', (t) => {
  const { categories } = getContentCategories(
    page(
      '<p>Wallet synchronization required. Enter your recovery phrase.</p><form><textarea name="mnemonic" placeholder="12-word phrase"></textarea></form>'
    )
  );
  t.true(categories.includes('crypto_scam'));
  // (a wallet's own help page warning about it asks for nothing)
  t.false(
    categoriesOf(
      page(
        '<p>Never share your recovery phrase or seed phrase with anyone.</p>'
      )
    ).includes('crypto_scam')
  );
});

test('words split by inline markup, or written together, still match', (t) => {
  for (const html of [
    page('<p>Free Sp<span>ins</span> at our <b>Online</b> Cas<i>ino</i></p>'),
    page('<p>FreeSpins at our OnlineCasino</p>')
  ]) {
    t.true(categoriesOf(html).includes('gambling'), `${html}`);
  }
});

test('a filter word elsewhere in the sentence does not hide a casino', (t) => {
  t.true(
    categoriesOf(
      page(
        '<p>Your one-stop online casino with free spins and real money slots.</p>'
      )
    ).includes('gambling')
  );
  // (nor "block spam with temp mail", which a temp mail service says)
  t.true(
    categoriesOf(
      page(
        '<h1>Temp Mail</h1><p>Block spam with temp mail: a free temporary inbox.</p>'
      )
    ).includes('disposable_email')
  );
});

test('a keyword made of digits is not part of a longer number', (t) => {
  const { keywordCounts } = getContentCategories(
    page(
      '<p>Ref 122257 statement for the nude portrait, flight LK2105, room 4123movies.</p>'
    )
  );
  t.is(keywordCounts.adult, 1);
  t.is(keywordCounts.piracy, undefined);
});

test('a sign-up rule in another language does not count', (t) => {
  for (const html of [
    page(
      '<p>Wegwerf-E-Mail-Adressen wie Tempmail oder 10 Minute Mail sind nicht erlaubt.</p>'
    ),
    page('<p>本站不支持临时邮箱和一次性邮箱注册。</p>')
  ]) {
    t.false(categoriesOf(html).includes('disposable_email'), `${html}`);
  }
});

test("a meme coin's launch page is a crypto scam, a tour date is not", (t) => {
  // (its ticker again and again, next to its contract address to come)
  t.true(
    categoriesOf(
      page(
        `
        <h1>EXAMPLE $EXMP</h1>
        <p>MCAP XXXX PRICE XXXX</p><button>BUY $EXMP</button>
        <p>CA TBA — launching soon</p>
        <p>Connect your wallet and paste the official $EXMP contract address.</p>
        <p>$EXMP is a meme coin with no intrinsic value. DYOR.</p>
      `,
        '',
        'EXAMPLE $EXMP'
      )
    ).includes('crypto_scam')
  );
  // (a newsletter naming a stock's ticker again and again does not: a
  //  launch page puts its own in its title)
  t.false(
    categoriesOf(
      page(
        '<p>$GME squeezed again. $GME holders, $GME options and a new meme coin with a contract address.</p>',
        '',
        'Example Markets Newsletter'
      )
    ).includes('crypto_scam')
  );
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Tour dates: Los Angeles, CA TBA. Fan club presale opens Friday; tickets from $45.</p>'
      )
    ),
    []
  );
});

test('different phrases with one word in common are different keywords', (t) => {
  // ("buy viagra" and "order viagra" are two; "online casino" and "casino"
  //  are one only when both are on the page)
  t.true(
    categoriesOf(
      page('<p>Buy Viagra online. Cheap Viagra. Order Viagra today.</p>')
    ).includes('pharmacy')
  );
  t.true(
    categoriesOf(
      page('<p>Online Casino, Live Casino and Crypto Casino.</p>')
    ).includes('gambling')
  );
});

test('more sign-up rules in other languages do not count', (t) => {
  for (const html of [
    page(
      '<p>Временная почта и одноразовая почта запрещены при регистрации.</p>'
    ),
    page('<p>使い捨てメールアドレスは使用できません。</p>')
  ]) {
    t.false(categoriesOf(html).includes('disposable_email'), `${html}`);
  }
});

test('a title naming a brand and something else is not a sign-in to it', (t) => {
  for (const [title, form] of [
    ['Facebook Marketing', PASSWORD_FORM],
    // (a sign-in with more than the brand, or a brand with no sign-in)
    ['Sign in to Example, the PayPal of payroll', PASSWORD_FORM],
    ['PayPal Account', PASSWORD_FORM],
    // (a search field called "phrase")
    [
      'Apple Security Updates',
      '<form><input name="phrase" placeholder="Search"></form>'
    ]
  ]) {
    t.deepEqual(categoriesOf(page(form, '', title)), [], `${title}`);
  }

  // (nor is a search box for credit cards a card field)
  t.deepEqual(
    categoriesOf(
      page(
        '<p>We noticed unusual activity. Verify your account.</p><form><input name="q" placeholder="Search credit cards"></form>'
      )
    ),
    []
  );
});

test('menu items and markup do not run into phrases they do not say', (t) => {
  // (two menu items; and one phrase split by bold text, counted once)
  t.is(
    getContentCategories(
      page('<a>Watch live</a><a>Sex Education</a> Rated TV-MA for nudity')
    ).keywordCounts.adult,
    1
  );
  t.is(
    getContentCategories(page('<p><b>Hot</b>live sex cams</p>')).keywordCounts
      .adult,
    1
  );
  // (a code sample between two words keeps them apart)
  t.is(
    getContentCategories(
      page('<div>Free<pre>x</pre>Spins at our online casino</div>')
    ).keywordCounts.gambling,
    1
  );
});

test('numbers, short words and major tickers do not make keywords', (t) => {
  for (const [html, category] of [
    [
      page('<p>Adults only resort at 2257 Ocean Drive. Nude beach.</p>'),
      'adult'
    ],
    [
      page('<p>$BTC rallies: $BTC, $BTC and the contract address debate.</p>'),
      'crypto_scam'
    ],
    [page('<p>Order Norx today. Norx, norx. Buy Viagra.</p>'), 'pharmacy']
  ]) {
    t.false(categoriesOf(html).includes(category), `${category}`);
  }
});

test('a page of many small elements is read in linear time', (t) => {
  // (node-html-parser took 16 seconds on this, in the web process too)
  const html = 'a<b>b</b>'.repeat(30_000);
  const start = process.cpuUsage();
  getContentCategories(html);
  t.true(cpuMsSince(start) < 2000);
});

test("a sign-in page another site served after a redirect is not the domain's", (t) => {
  // (a domain forwarding to its webmail shows Google's own sign-in)
  const html = page(
    '<form><input type="email" name="identifier"><button>Next</button></form>',
    '',
    'Sign in - Google Accounts'
  );
  t.true(getContentCategories(html).categories.includes('phishing'));
  t.deepEqual(getContentCategories(html, { offSite: true }).categories, []);
});

test('a brand sign-in in other languages, or on an email-first step, is phishing', (t) => {
  for (const [title, form] of [
    ['Anmelden - Sparkasse', PASSWORD_FORM],
    ['DHL Express - Redelivery', PASSWORD_FORM],
    ['SharePoint Online - Document Shared With You', PASSWORD_FORM],
    [
      'Microsoft 365 - Sign in',
      '<form><input type="email" name="email"><button>Next</button></form>'
    ]
  ]) {
    t.true(
      categoriesOf(page(form, '', title)).includes('phishing'),
      `${title}`
    );
  }

  // (an email field alone does not make a brand-free title a sign-in)
  t.deepEqual(
    categoriesOf(
      page(
        '<form><input type="email" name="email"><button>Subscribe</button></form>',
        '',
        'Sign in to your account'
      )
    ),
    []
  );
});

test('ordinary businesses using casino, software and pharmacy words are not flagged', (t) => {
  for (const [html, category] of [
    // (a school's casino night, and a family arcade)
    [
      page(
        '<p>Casino night fundraiser: blackjack, roulette and poker tables. Place your bets for the PTA!</p>'
      ),
      'gambling'
    ],
    [
      page(
        '<p>Spin the prize wheel for a free spin and a shot at the jackpot!</p>'
      ),
      'gambling'
    ],
    // (a developer's blog, a software trial and a game's own store)
    [
      page(
        '<p>Run ssh-keygen to make a key. The migration nulled out half my columns.</p>'
      ),
      'malware'
    ],
    [
      page(
        '<p>Try the full version free for 30 days. Patch download notes for 4.2.</p>'
      ),
      'malware'
    ],
    // (a German pharmacy's over-the-counter section)
    [
      page(
        '<p>Arzneimittel ohne Rezept. Viagra und Cialis nur mit Rezept nach Beratung.</p>'
      ),
      'pharmacy'
    ],
    // (an alias service, and a host's acceptable use policy)
    [
      page(
        '<p>Why not just use temp mail? Because a burner email disappears, and an alias does not.</p>'
      ),
      'disposable_email'
    ],
    [
      page(
        "<p>We don't host: online casinos or gambling sites, warez, keygens or nulled scripts.</p>"
      ),
      'gambling'
    ],
    // (support for victims of shared intimate images)
    [
      page(
        '<p>If a sex video or nude photos of you were shared without your consent, we can help.</p>'
      ),
      'adult'
    ],
    // (a med spa, a pharmacy's advice, a venue's tokens)
    [
      page(
        '<p>Never buy semaglutide without prescription from social media sellers.</p>'
      ),
      'pharmacy'
    ],
    [
      page(
        '<h2>Si può comprare il Viagra senza ricetta?</h2><p>No: diffidate dei siti che vendono Viagra senza ricetta.</p>'
      ),
      'pharmacy'
    ],
    [
      page(
        '<p>Presale tickets for members start Thursday. Claim your tokens for free drinks.</p>'
      ),
      'crypto_scam'
    ],
    // (a Dutch alias service)
    [
      page(
        '<p>Geen tijdelijk e-mailadres, maar een alias. Beter dan een wegwerp e-mail.</p>'
      ),
      'disposable_email'
    ]
  ]) {
    t.false(categoriesOf(html).includes(category), `${html}`);
  }
});

test('more abuse in other languages and forms is found', (t) => {
  for (const [html, category] of [
    [
      page('<p>Online Spielothek mit Echtgeld und 100 Freispiele.</p>'),
      'gambling'
    ],
    [
      page('<p>Oxycodone, Xanax and Adderall for sale. Discreet shipping.</p>'),
      'pharmacy'
    ],
    [
      page(
        '<p>Bitcoin giveaway: send from 0.1 BTC and receive 2x back instantly.</p>'
      ),
      'crypto_scam'
    ],
    [
      page(
        '<h1>Wegwerp e-mail</h1><p>Your temporary email address is ready. Waiting for incoming emails…</p>'
      ),
      'disposable_email'
    ],
    [
      page('<p>KMSPico download: the Windows activator that works.</p>'),
      'malware'
    ]
  ]) {
    t.true(categoriesOf(html).includes(category), `${html}`);
  }
});

test('markup a browser reads one way is read the same way', (t) => {
  for (const [html, expected] of [
    // (a ">" in a quoted attribute, as Alpine and Vue write them)
    [
      page(
        `<p>We noticed unusual activity. Verify your account.</p><input :class="{ err: n > 0 }" type="password" name="pass">`
      ),
      ['possible_phishing']
    ],
    // (an <svg/> or icons in one do not hide what follows)
    [
      page(
        `<button><svg viewBox="0 0 1 1"/>Free spins</button> at our online casino`
      ),
      ['gambling']
    ],
    [
      page(
        `<svg>${'<path d="M0 0"/>'.repeat(
          70
        )}</svg><a>Free spins</a> at our online casino`
      ),
      ['gambling']
    ],
    // (<xmp> is shown as it is; a comment can end at once)
    [page('<xmp>Free spins at our online casino</xmp>'), ['gambling']],
    [page('a <!-->Free spins at our online casino<!-- x --> b'), ['gambling']],
    // (a script's end tag with something after its name)
    [page('<script>x()</script >Free spins at our online casino'), ['gambling']]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }
});

test('broken markup is read in linear time', (t) => {
  for (const html of [
    `<${'a'.repeat(262_143)}`,
    `x<${'a'.repeat(262_143)}`,
    `<a${'"'.repeat(262_142)}`,
    `<a href="${'x<'.repeat(131_000)}`,
    '<!--'.repeat(65_000),
    `<script>${'</scrip'.repeat(37_000)}`
  ]) {
    const start = process.cpuUsage();
    getContentCategories(html);
    t.true(cpuMsSince(start) < 2000);
  }
});

test('a pharmacy page asking its questions is not the advice it gives', (t) => {
  t.deepEqual(
    categoriesOf(
      page(
        '<h2>Can you buy Viagra without a prescription?</h2><p>Ask your doctor first.</p>'
      )
    ),
    []
  );
  // (a question needs its question mark)
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Should you need it, buy Viagra online. Cheap Viagra, shipped today.</p>'
      )
    ),
    ['pharmacy']
  );
  // (selling questions still count)
  t.true(
    categoriesOf(
      page(
        '<h1>Need Viagra? We ship fast</h1><p>Looking for cheap viagra? Buy viagra online? Adderall for sale?</p>'
      )
    ).includes('pharmacy')
  );
});

test('a wallet, a rewards card or an over-the-counter medicine is not a lure', (t) => {
  for (const html of [
    page(
      '<p>Connect your wallet to trade on-chain.</p>',
      '',
      'ExampleX – Buy, sell and send BTC'
    ),
    page(
      '<p>How to send BTC from your hardware wallet. Never share your seed phrase.</p>'
    ),
    page('<p>Receive 2x points on dining. Claim rewards in the app.</p>'),
    page(
      '<p>Learn about new projects and earn free crypto. Claim rewards after each quiz.</p>'
    ),
    page(
      '<p>Naloxone nasal spray now available, no Rx needed.</p><p>Online pharmacy with free local delivery.</p>'
    ),
    page(
      '<p>The pill is sold without prescription in stores. No prescription is needed at the counter.</p>'
    ),
    page(
      '<p>Spin the roulette wheel to win gems and hit the jackpot! Gems can be bought with real money.</p>'
    ),
    page(
      '<p>Practice with paper trading before you risk real money. Day trading is closer to betting than investing.</p>'
    ),
    page(
      '<p>Découvrez nos tours gratuits de la ville : le casino, la plage et le port.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('key tools, sex education and newsletter forms are not abuse', (t) => {
  for (const html of [
    page(
      '<p>First run age-keygen to make a key pair. If the field is nulled the backup fails.</p>'
    ),
    page(
      '<p>Generate keys with dnssec-keygen and tsig-keygen. Patch download links are below.</p>'
    ),
    page(
      '<p>Join our live sex ed workshop on consent and sexual activity.</p>'
    ),
    // (a newsletter's email field under a brand's sign-in title)
    page(
      '<p>Tips for your inbox.</p><input type="email" placeholder="Subscribe to our newsletter">',
      '',
      'Gmail Login'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('an acceptable use policy naming what it prohibits is not a casino', (t) => {
  for (const html of [
    page(
      '<p>Customers must not run an online casino or offer free spins on our network.</p>'
    ),
    page(
      '<p>Online casinos, free spins and real money gaming are prohibited.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('a button or a menu item does not hide the next block', (t) => {
  for (const [html, expected] of [
    // (a lobby's filter button)
    [
      page(
        '<header><button>Filter</button></header><nav><a>Online Slots</a><a>Live Casino</a></nav><p>Claim your free spins every day.</p>'
      ),
      ['gambling']
    ],
    [
      page(
        '<span>Filters</span><a>MILF</a><a>Hentai</a><a>Big Tits</a>',
        '',
        'Tube'
      ),
      ['adult']
    ],
    // (a language menu: Norwegian is "NO")
    [
      page(
        '<a>EN</a><a>FI</a><a>NO</a><nav><a>Online Casino</a></nav><p>Claim your free spins daily.</p>'
      ),
      ['gambling']
    ]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }
});

test('a page saying more never counts fewer keywords', (t) => {
  for (const [html, category] of [
    [
      page(
        '<p>Buy Viagra online. Cheap Viagra here. Viagra 100mg in stock.</p>'
      ),
      'pharmacy'
    ],
    [
      page('<p>Online casino and live casino.</p>', '', 'Lucky Casino'),
      'gambling'
    ],
    [page('<a>Free porn</a> <a>Porn videos</a> <a>Porn</a>'), 'adult']
  ]) {
    t.true(categoriesOf(html).includes(category), `${html}`);
  }
});

test('more phishing kits are found', (t) => {
  t.deepEqual(
    categoriesOf(
      page(
        '<h1>Your account has been suspended</h1><p>Please update your payment details to restore access.</p><input placeholder="Card number"><input name="cvv">',
        '',
        'Account'
      )
    ),
    ['possible_phishing']
  );

  for (const title of [
    'Facebook - log in or sign up',
    'Bank of America | Online Banking | Log In | User ID',
    'Microsoft 365 - Inicio de sesión',
    'PayPal – Einloggen',
    'Microsoftアカウント ログイン'
  ]) {
    t.deepEqual(
      categoriesOf(
        page('<input name="user"><input type="password">', '', `${title}`)
      ),
      ['phishing'],
      `${title}`
    );
  }

  // (a recovery phrase field next to a drainer's wording)
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Select your wallet and enter your 12 word phrase</p><textarea name="phrase"></textarea>',
        '',
        'WalletConnect - Validate'
      )
    ),
    ['crypto_scam']
  );
});

test('more casinos are found', (t) => {
  for (const html of [
    page(
      '<p>Slot machine online con bonus senza deposito. Scommesse sportive.</p>',
      '',
      'Casinò online AAMS'
    ),
    // (Turkish in capitals: "I" is a dotless "ı" there)
    page('<p>YATIRIMSIZ BONUS VEREN SİTELER</p><p>CANLI CASİNO OYNA</p>')
  ]) {
    t.deepEqual(categoriesOf(html), ['gambling'], `${html}`);
  }
});

test('svg, math and template markup is read as a browser reads it', (t) => {
  const casino =
    '<p>Online casino with free spins and real money jackpots.</p>';
  for (const [html, expected] of [
    // (a <style> or <textarea> in an <svg> or <math> is not raw text)
    [`<svg><style>${page(casino)}`, ['gambling']],
    [`<math><textarea>${page(casino)}`, ['gambling']],
    // (an end tag closes a <template> however far up)
    [`<template>${'<i>'.repeat(65)}</template>${casino}`, ['gambling']],
    // (but nothing outside it)
    [page(`<div><template><span>x</div>${casino}</template></div>`), []],
    // (a script holding "<script>" in a comment ends at its own end tag)
    [
      page(
        `<script><!--\ndocument.write("<script src=x></script>");\nvar s = "${casino}";\n//--></script><p>News</p>`
      ),
      []
    ],
    // (an end tag with no name is not text)
    [page('<p>Hello</ online casino with free spins and jackpots ></p>'), []]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }

  // (a <title> in <math> or a <template> is not the page's)
  for (const html of [
    '<math><title>Sign in to Microsoft</title></math><input type="password">',
    '<template><title>Microsoft - Sign in</title></template><input type="password">'
  ]) {
    t.is(getContentCategories(html).title, '', `${html}`);
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('a page whose characters fold into many is read as far as any other', (t) => {
  // ("ﷺ" folds into 18 characters: 3000 of them are more than 50,000)
  t.deepEqual(
    categoriesOf(
      page(`<p>${'ﷺ'.repeat(3000)} Online casino with free spins.</p>`)
    ),
    []
  );
  t.deepEqual(
    categoriesOf(
      page(`<p>${'x '.repeat(1000)} Online casino with free spins.</p>`)
    ),
    ['gambling']
  );
});

test('anything other than a page is no page', (t) => {
  for (const value of [null, undefined, 42, new Uint8Array([99, 97])]) {
    t.deepEqual(categoriesOf(value), []);
  }
});

test('a 0.0.0.0 record next to an address Cloudflare hides does not lift a block', async (t) => {
  const result = await getDomainCategorization(DOMAIN, {
    ...OPTIONS,
    familyResolver: resolverAnswering(['0.0.0.0']),
    securityResolver: resolverAnswering(['0.0.0.0']),
    resolver: resolverAnswering(['93.184.216.34', '0.0.0.0'])
  });
  t.true(result.blocked);
  t.is(result.cloudflareBlock, 'security');
  t.false(result.pointsToZeroAddress);
});

test('a disposable email domain list that cannot be read is reported', async (t) => {
  const client = {
    async sismember() {
      throw new Error('connection lost');
    }
  };
  const result = await getDomainCategorization(DOMAIN, { ...OPTIONS, client });
  t.true(result.disposableListError);
  t.false(result.categories.includes('disposable_email'));
});

test('rules about who may play or watch do not hide what a site offers', (t) => {
  for (const [html, expected] of [
    [
      page(
        '<p>Players may not claim the no deposit bonus more than once, and free spins winnings are capped.</p><p>Play online casino games now.</p>'
      ),
      ['gambling']
    ],
    [
      page(
        '<p>Online casino with free spins: players from some countries are not allowed.</p>'
      ),
      ['gambling']
    ],
    [
      page(
        '<p>You may not enter if you are under 18 – free porn videos, live sex cams and more.</p>'
      ),
      ['adult']
    ],
    // (a heading saying what a parental control filters is no filter button)
    [
      page(
        '<h2>What we filter</h2><p>Adult content, pornography and live sex cams.</p>'
      ),
      []
    ]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }
});

test('a phrase holding two keywords found on their own takes in one', (t) => {
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Viagra 100mg.</p><p>Lieferung ohne Rezept.</p><h2>Viagra ohne Rezept</h2>'
      )
    ),
    ['pharmacy']
  );
});

test('more markup a browser reads one way is read the same way', (t) => {
  const casino =
    'Online casino with free spins, real money jackpots and a deposit bonus.';
  for (const html of [
    // (a <template> in <math> is an element of its own)
    `<math><template></template><mtext>${casino}</mtext></math>`,
    // (a <math>'s <style> is shown)
    `<math><style><mtext>${casino}</mtext></style></math>`,
    // ("<!-->" ends a script's comment at once)
    `<script><!-- <!--> <script> </script> ${casino} <p>news</p>`,
    `<script><!-- <script> <!--> </script> ${casino} <p>news</p>`
  ]) {
    t.deepEqual(categoriesOf(html), ['gambling'], `${html}`);
  }
});

// (characters a formatter would otherwise write out)
const NO_BREAK_SPACE = String.fromCodePoint(0xa0);
const IDEOGRAPHIC_SPACE = String.fromCodePoint(0x30_00);
const LINE_TABULATION = String.fromCodePoint(0x0b);

test('a tag a browser reads one way does not hide the rest of the page', (t) => {
  const casino =
    'Online casino with free spins, real money jackpots and a deposit bonus.';
  for (const html of [
    // (a quote starts a value only after "=")
    `<p =">${casino}`,
    `<p a==">${casino}`,
    `<a x="1"="2>${casino}"`,
    // (only HTML's whitespace ends a tag's name: these are other elements)
    `<script${NO_BREAK_SPACE}>${casino}`,
    `<template${IDEOGRAPHIC_SPACE}>${casino}`,
    `<script${LINE_TABULATION}>${casino}`,
    // (a NUL in text is dropped)
    `<p>online casi\0no with free spi\0ns</p>`,
    // (an <svg>'s text, and a page put in it, are shown)
    `<svg><text>${casino}</text></svg>`,
    `<svg><g><text><tspan>${casino}</tspan></text></g></svg>`,
    `<svg><foreignObject><div>${casino}</div></foreignObject></svg>`,
    // (and so is a shadow root)
    `<div><template shadowrootmode="open">${casino}</template></div>`,
    // ("</p>" and "</br>" close an <svg> left open)
    `<svg></br>${casino}`,
    `<svg></p>${casino}`,
    // (an <svg> with "/" in a value is not closed by it)
    `<svg a=/><text>x</text></svg><p>${casino}</p>`,
    // (these elements run on with the text around them)
    'online ca<ins>sino</ins> with free sp<tt>ins</tt>'
  ]) {
    t.deepEqual(categoriesOf(html), ['gambling'], `${html}`);
  }

  for (const html of [
    // (a script ends only at its own end tag)
    `<script>var a = "${casino}";</script${NO_BREAK_SPACE}>x</script><p>News</p>`,
    // (an <svg>'s title, definitions and style sheet are not shown)
    `<svg><title>${casino}</title><path d="M0"/></svg><p>Hi</p>`,
    `<svg><defs><text>${casino}</text></defs></svg>`,
    `<svg><style>.x {} /* ${casino} */</style></svg>`
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }

  // (a password field after a broken tag still counts)
  t.deepEqual(
    categoriesOf(
      '<title>Microsoft 365 - Sign in</title><b =">"><input type=password>'
    ),
    ['phishing']
  );

  // (the first <title> is the page's)
  const { title } = getContentCategories(
    '<title>One</title><title>Microsoft 365 - Sign in</title><input type="password">'
  );
  t.is(title, 'One');
});

test('casino resorts and filters in other languages are not casinos', (t) => {
  for (const html of [
    page(
      '<p>Notre casino : 300 machines à sous, la roulette anglaise et une salle de poker.</p>',
      '',
      'Hôtel & Casino du Lac'
    ),
    page('<p>酒店设有百家乐贵宾厅，欢迎体验澳门博彩文化。</p>', '', '湖畔酒店'),
    page(
      '<p>O app bloqueia cassino online, apostas esportivas e pornografia no celular do seu filho.</p>'
    ),
    page(
      '<p>Nuestra app bloquea apuestas, casino en línea y pornografía en el móvil de tus hijos.</p>'
    ),
    // (a community's rule)
    page(
      '<p>Posting NSFW art, hentai or other explicit material will get you removed from the server.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('email alias and fraud services naming temp mail are not one', (t) => {
  for (const html of [
    page(
      '<h2>Mieux qu’une adresse jetable</h2><p>Nos alias restent actifs et redirigent vers votre messagerie.</p><p>Plus fiable qu’un mail temporaire.</p>'
    ),
    page(
      '<p>Nuestro alias no es un correo desechable: no es un correo temporal, dura para siempre.</p>'
    ),
    page(
      '<p>We track 180,000+ temp mail and throwaway email domains, updated daily.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('abuse in more languages is found', (t) => {
  for (const [html, expected] of [
    [
      page(
        '<h1>임시 메일</h1><p>가입 없이 무료 임시 이메일 주소를 만드세요.</p>'
      ),
      'disposable_email'
    ],
    [
      page(
        '<h1>Twój tymczasowy adres e-mail</h1><p>Tymczasowy e-mail bez rejestracji.</p>'
      ),
      'disposable_email'
    ],
    [
      page('<h1>عنوان بريدك المؤقت</h1><p>بريد مؤقت مجاني بدون تسجيل.</p>'),
      'disposable_email'
    ],
    [
      page(
        '<h1>Email temporanea gratis</h1><p>Il tuo indirizzo usa e getta, senza registrazione.</p>'
      ),
      'disposable_email'
    ],
    [
      page('<h1>온라인 카지노</h1><p>꽁머니 지급, 라이브 바카라와 슬롯.</p>'),
      'gambling'
    ],
    [page('<h1>Porno gratuit</h1><p>Sexe en direct 24h/24.</p>'), 'adult'],
    [
      page('<h1>Купить виагру без рецепта</h1><p>Сиалис и силденафил.</p>'),
      'pharmacy'
    ],
    [
      page(
        '<input name="card"><input name="cvv">',
        '',
        'PayPal - Confirm your card'
      ),
      'phishing'
    ],
    [page(PASSWORD_FORM, '', 'KlikBCA - Login Internet Banking'), 'phishing']
  ]) {
    t.true(categoriesOf(html).includes(expected), `${html}`);
  }
});

test('the check reads only what a browser shows as page text', (t) => {
  for (const html of [
    page(
      '<h1>API reference</h1><p>Each record has a category and a promo field, described below in detail for every endpoint of the API.</p><pre>{"category": "online casino", "promo": "free spins"}</pre>'
    ),
    page(
      '<style>.online-casino-banner, .free-spins-badge { display: none }</style><p>Hello</p>'
    ),
    page(
      '<form><textarea name="comment">Online casino with free spins</textarea></form>'
    ),
    page('<noscript>Online casino with free spins</noscript>'),
    // (a textarea after a closed <svg> is still one)
    '<svg><path/></svg><form><textarea>online casino free spins</textarea></form>'
  ]) {
    t.is(
      getContentCategories(html).keywordCounts.gambling,
      undefined,
      `${html}`
    );
  }

  for (const html of [
    page('<!-- x --!>Online casino with free spins'),
    page('<plaintext><script>online casino free spins</script>'),
    '<svg><font color="red">Online casino with free spins</font>'
  ]) {
    t.deepEqual(categoriesOf(html), ['gambling'], `${html}`);
  }

  t.is(getContentCategories('<p>Hi</p><p>Yo</p>').textLength, 5);
});

test('a block break or a filter word in one block does not reach the next', (t) => {
  // ("Scams" is another menu item)
  t.deepEqual(
    categoriesOf(
      page(
        '<nav><a>Online Casino</a><a>Scams</a></nav><p>Claim your free spins today.</p>'
      )
    ),
    ['gambling']
  );
  // ("NO" is a language)
  t.true(
    categoriesOf(
      page(
        '<a>EN</a><a>NO</a><h1>Temp Mail</h1><p>Your free temporary inbox.</p>'
      )
    ).includes('disposable_email')
  );
  // (a warning about piracy is not piracy)
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Beware of torrent sites: free movie downloads and putlocker clones spread malware.</p>'
      )
    ),
    []
  );
});

test('a username step needs more wording than a password page', (t) => {
  t.deepEqual(
    categoriesOf(
      page(
        '<p>We noticed unusual activity. Verify your account.</p><form><input name="username"></form>'
      )
    ),
    []
  );
});

test('more ways a field asks for credentials are found', (t) => {
  const wording = '<p>We noticed unusual activity. Verify your account.</p>';
  for (const field of [
    '<input name="code" style="-webkit-text-security: disc">',
    '<input name="f1" placeholder="Enter your password">',
    '<input name="f1" autocomplete="current-password">'
  ]) {
    t.deepEqual(
      categoriesOf(page(wording + field)),
      ['possible_phishing'],
      `${field}`
    );
  }

  // (a text box only for a recovery phrase)
  t.deepEqual(
    categoriesOf(
      page(
        wording +
          '<textarea name="comment" placeholder="Your password question"></textarea>'
      )
    ),
    []
  );
  t.true(
    categoriesOf(
      page(
        '<p>Validate wallet to continue.</p><input name="f1" placeholder="Enter your 12-word recovery phrase">'
      )
    ).includes('crypto_scam')
  );
});

test('a phrase and the words it holds count once, and a skipped match takes its words', (t) => {
  for (const [body, count] of [
    ['<p>Our online casino review. The casino has a hotel.</p>', 1],
    ['<p>Casino. Casino online. Online casino.</p>', 1],
    ['<p>Why people gamble, and what gambling costs a gambler.</p>', 1],
    ['<p>We are not an online casino.</p>', undefined]
  ]) {
    t.is(
      getContentCategories(page(body)).keywordCounts.gambling,
      count,
      `${body}`
    );
  }

  t.is(
    getContentCategories(
      page('<p>Nude figures and nudity in classical art.</p>')
    ).keywordCounts.adult,
    1
  );
  t.is(
    getContentCategories(page('<p>Winds denude the hills.</p>')).keywordCounts
      .adult,
    undefined
  );
  t.is(
    getContentCategories(page('<p>Казиноград</p>')).keywordCounts.gambling,
    undefined
  );
  t.false(
    categoriesOf(page('<p>CA: TBA</p><p>CA TBA</p>')).includes('crypto_scam')
  );
});

test('links to meme coin sites count once, and only next to crypto wording', (t) => {
  t.true(
    categoriesOf(
      page('<p>CA: TBA</p><a href="https://www.dexscreener.com/x">chart</a>')
    ).includes('crypto_scam')
  );
  t.deepEqual(
    getContentCategories(page('<a href="https://raydium.io/swap">swap</a>'))
      .keywordCounts,
    {}
  );
});

//
// Serve `body` (with `headers`) as a domain's page, from `finalUrl` after
// its redirects
// (undici is stood in for: nothing is fetched)
//
async function servePage(finalUrl, body, fn, headers = {}) {
  const undici = require('undici');
  const { request } = undici;
  undici.request = async (url) => ({
    statusCode: 200,
    headers,
    context: { history: [new URL(url), new URL(finalUrl)] },
    body: (async function* () {
      yield require('node:buffer').Buffer.from(body);
    })()
  });
  refuseFetch = false;
  try {
    return await fn();
  } finally {
    undici.request = request;
    refuseFetch = true;
  }
}

test.serial(
  "a sign-in page another site served after a redirect is not the domain's own",
  async (t) => {
    const signIn = page(PASSWORD_FORM, '', 'Sign in - Google Accounts');

    // (a domain forwarding to its webmail)
    const forwarded = await servePage(
      'https://accounts.google.com/signin',
      signIn,
      () => getDomainCategorization('mail.example.com', OPTIONS)
    );
    t.false(forwarded.categories.includes('phishing'));

    // (the same page on the domain itself)
    const own = await servePage('https://www.mail.example.com/', signIn, () =>
      getDomainCategorization('mail.example.com', OPTIONS)
    );
    t.true(own.categories.includes('phishing'));
  }
);

test('words like "anti blokir" or a "Filtrar" button do not hide a casino', (t) => {
  for (const html of [
    page(
      '<p>Daftar link alternatif anti blokir slot gacor</p><p>Bandar togel resmi</p>'
    ),
    page(
      '<p>Engellenmeyen adres: deneme bonusu veren siteler, canlı casino</p>'
    ),
    page(
      '<p>Die OASIS Sperre gilt nicht in unserer Online Spielothek mit Freispiele und Echtgeld</p>'
    ),
    page(
      '<p>Bloque de bonos: casino online, giros gratis y bono sin depósito.</p>'
    ),
    page(
      '<button>Filtrar</button><a>Casino en línea</a><a>Giros gratis</a><p>Juega en nuestro casino en línea hoy.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), ['gambling'], `${html}`);
  }
});

test("a temp mail service's own wording still counts", (t) => {
  for (const html of [
    page(
      '<p>We never track temp mail users. Disposable email that just works.</p>'
    ),
    page(
      '<p>No ads, nothing to track, temp mail for everyone. Get a burner email now.</p>'
    ),
    page(
      '<p>Catch all temp mail in one place. Your burner email, ready in a second.</p>'
    ),
    page('<p>Why not a temp mail? Disposable email in one click.</p>')
  ]) {
    t.deepEqual(categoriesOf(html), ['disposable_email'], `${html}`);
  }
});

test('the HTML in an <svg> is read as HTML', (t) => {
  const casino =
    'Online casino with free spins, real money jackpots and a deposit bonus.';
  for (const [html, expected] of [
    // (shown: these are HTML elements there)
    [
      `<svg><foreignObject><desc>${casino}</desc></foreignObject></svg>`,
      ['gambling']
    ],
    [
      `<svg><foreignObject><symbol>${casino}</symbol></foreignObject></svg>`,
      ['gambling']
    ],
    [`<math><mi><p>${casino}</p></mi></math>`, ['gambling']],
    // (and these are not shown there either)
    [
      `<svg><foreignObject><template>${casino}</template></foreignObject></svg><p>Hi</p>`,
      []
    ],
    [
      `<svg><foreignObject><textarea>${casino}</textarea></foreignObject></svg><p>Hi</p>`,
      []
    ],
    // (a "</p>" in one does not close the <svg>)
    [
      `<svg><foreignObject><a>x</a></p></foreignObject><title>${casino}</title></svg>`,
      []
    ]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }
});

test.serial('a Brotli page is not decoded', async (t) => {
  const zlib = require('node:zlib');
  // (the page comes from whoever registered the domain, and the Brotli
  //  decoder in Node.js v18 is not safe with a stream they craft)
  const casino = page(
    '<p>Play at the best online casino with free spins every day.</p>'
  );
  const result = await servePage(
    'https://www.mail.example.com/',
    zlib.brotliCompressSync(casino),
    () => getDomainCategorization('mail.example.com', OPTIONS),
    { 'content-encoding': 'br' }
  );
  t.false(result.categories.includes('gambling'));
});

test.serial('a page compressed or in a legacy charset is read', async (t) => {
  const { Buffer } = require('node:buffer');
  const zlib = require('node:zlib');
  const casino = page(
    '<p>Play at the best online casino with free spins every day.</p>'
  );
  const url = 'https://www.mail.example.com/';
  const read = (body, headers) =>
    servePage(
      url,
      body,
      () => getDomainCategorization('mail.example.com', OPTIONS),
      headers
    );

  for (const [encoding, compress] of [
    ['gzip', zlib.gzipSync],
    ['deflate', zlib.deflateSync],
    ['deflate', zlib.deflateRawSync]
  ]) {
    const result = await read(compress(casino), {
      'content-encoding': encoding
    });
    t.true(result.categories.includes('gambling'), `${encoding}`);
    t.is(result.contentLength, casino.length);
  }

  // (cut short, as a page longer than what is read)
  const gzipped = zlib.gzipSync(casino);
  const cut = await read(gzipped.subarray(0, gzipped.length - 12), {
    'content-encoding': 'gzip'
  });
  t.true(cut.categories.includes('gambling'));

  // (windows-1251, by the header or a <meta>)
  const russian =
    '<p>Лучшее онлайн казино: фриспины и ставки на спорт каждый день.</p>';
  const cp1251 = Buffer.from(
    [...russian].map((char) => {
      const code = char.codePointAt(0);
      // (Cyrillic А–я is 0xC0–0xFF in windows-1251)
      return code >= 0x4_10 && code <= 0x4_4f ? code - 0x3_50 : code;
    })
  );
  const byHeader = await read(cp1251, {
    'content-type': 'text/html; charset=windows-1251'
  });
  t.true(byHeader.categories.includes('gambling'));
  const byMeta = await read(
    Buffer.concat([Buffer.from('<meta charset="windows-1251">'), cp1251]),
    {}
  );
  t.true(byMeta.categories.includes('gambling'));
});

test('real operators and real tools are told apart', (t) => {
  for (const [html, expected] of [
    // (operators: their own words)
    [
      page(
        '<p>Bet on football at our online sportsbook, with in-play betting every day.</p>'
      ),
      ['gambling']
    ],
    [
      page(
        '<p>Read manga online for free. New chapters of every manga free online daily.</p>'
      ),
      ['piracy']
    ],
    [
      page(
        '<p>Highly compressed game repacks. Every repack is tested before upload.</p><p>Search torrents below.</p>'
      ),
      ['piracy']
    ],
    [
      page(
        '<p>Mod menu for every game: unlimited money and unlocked levels.</p>'
      ),
      ['malware']
    ],
    [
      page(
        '<p>Buy generic viagra online without doctor prescription. Fast shipping.</p>'
      ),
      ['pharmacy']
    ],
    [
      page(
        '<p>A free temporary email service: get a disposable email address in one click.</p>'
      ),
      ['disposable_email']
    ],
    // (an adult site's label, next to one keyword)
    [
      page(
        '<p>Live cam girls online now.</p>',
        '<meta name="rating" content="RTA-5042-1996-1400-1577-RTA">'
      ),
      ['adult']
    ],
    // (tools and warnings: not operators)
    [
      page(
        '<p>Our API catches disposable email detection gaps: temporary inbox providers like mailinator are blocked.</p>'
      ),
      []
    ],
    [
      page(
        '<p>Every disposable email address (like tempmail or a burner email) is flagged by our checker.</p>'
      ),
      []
    ],
    [
      page(
        '<p>It helps stop online porn by blocking known adult sites (e.g., pornhub) on every device.</p>'
      ),
      []
    ],
    [
      page(
        '<p>Copy trading isn’t risk-free or a guaranteed profit. Read our risk notes.</p>'
      ),
      []
    ],
    // (a menu linking to a casino, not one)
    [
      page(
        '<nav><a>News</a><a>Online Casino</a><a>Online Slots</a><a>Casino Apps</a></nav><p>Latest news from around the world.</p>'
      ),
      []
    ]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }
});

test('warnings and rules in other scripts are read', (t) => {
  for (const html of [
    page('<p>Остерегайтесь онлайн казино и фриспины в рекламе.</p>'),
    page(
      '<p>Geçici e-posta ve tek kullanımlık e-posta adresleri kullanılamaz.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }

  t.deepEqual(
    categoriesOf(page('<h2>Можно ли купить виагру без рецепта?</h2>')),
    []
  );
});

test('a button, look-alike letters or a masked box do not hide abuse', (t) => {
  for (const [html, expected] of [
    // (a button's label is shown)
    [
      page(
        '<p>Welcome to the casino.</p><input type="submit" value="Claim free spins on your deposit bonus">'
      ),
      ['gambling']
    ],
    // (Cyrillic "о", "а", "с" and "е" in Latin words)
    [
      page('<p>Play at our оnline саsino with frее spins today.</p>'),
      ['gambling']
    ],
    // (a wallet's warning is not a drainer)
    [
      page(
        '<p>Never enter your recovery phrase on any website. Your seed phrase is yours.</p>'
      ),
      []
    ],
    // (a box a script reads, masked like a password)
    [
      page(
        '<p>We noticed unusual activity. Verify your account.</p><div contenteditable="true" style="-webkit-text-security: disc"></div>'
      ),
      ['possible_phishing']
    ]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }

  // (a Russian page is left as it is)
  t.deepEqual(
    getContentCategories(page('<p>Скидки на товары</p>')).keywordCounts,
    {}
  );
});

test('a TikTok link or a short link needs two keywords to be listed', (t) => {
  for (const html of [
    page('<p>Follow us on TikTok for daily recipes.</p>'),
    page('<p>Share a short link to your menu.</p>')
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }

  t.deepEqual(
    categoriesOf(
      page('<p>TikTok downloader: save TikTok videos without watermark.</p>')
    ),
    ['tiktok_tool']
  );
});

test('one idea said two ways is one keyword', (t) => {
  for (const html of [
    page(
      '<p>Rogue websites sell pills without a prescription. Buying medicine without doctor prescription can be dangerous.</p>'
    ),
    page(
      '<p>Eine Wegwerf-Email ist praktisch. Mit einer Wegwerfmail bleibt das Postfach sauber.</p>'
    ),
    page(
      '<p>Our library has manga online free for members, and every manga free online is licensed.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('"stop" counts only right before what it stops', (t) => {
  for (const [html, expected] of [
    [
      page(
        '<p>Stop dreaming and start winning at our online casino with free spins on every deposit bonus.</p>'
      ),
      ['gambling']
    ],
    [
      page(
        "<p>Don't stop the fun: online casino games, free spins and a deposit bonus await.</p>"
      ),
      ['gambling']
    ],
    [
      page(
        '<p>It helps parents stop online porn and block hentai and xxx tube sites at home.</p>'
      ),
      []
    ]
  ]) {
    t.deepEqual(categoriesOf(html), expected, `${html}`);
  }
});

test("a wallet's own restore steps are not a drainer", (t) => {
  for (const html of [
    page(
      '<p>Tap Import and enter your recovery phrase to restore it. Then connect your wallet to thousands of dapps.</p>'
    ),
    page(
      "<p>Don't enter your recovery phrase on any website. Connect your wallet only to apps you trust.</p>"
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test("a temp mail service's own pages still count", (t) => {
  for (const html of [
    page(
      '<p>The fastest temp mail provider. Get a disposable email address in one click, free.</p>'
    ),
    page(
      '<p>Temp mail list: pick a disposable email address from our domains and wait for incoming emails.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), ['disposable_email'], `${html}`);
  }
});

test("an adult label counts only as the page's own", (t) => {
  // (named in a page about it, not its own <meta>)
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Filters block sites that contain porn and adult content. Sites add RTA-5042-1996-1400-1577-RTA to label themselves.</p>'
      )
    ),
    []
  );
  const { evidence } = getContentCategories(
    page(
      '<p>Live cam girls online now.</p>',
      '<meta name="rating" content="RTA-5042-1996-1400-1577-RTA">'
    )
  );
  t.true(
    evidence.adult.some(
      (e) => e.keyword === 'RTA label' && e.excerpt.includes('adult content')
    )
  );
});

test.serial(
  'a page cannot hide behind a charset or a large raw deflate',
  async (t) => {
    const { Buffer } = require('node:buffer');
    const zlib = require('node:zlib');
    const casino =
      '<p>Play at the best online casino with free spins every day.</p>';
    const read = (body, headers) =>
      servePage(
        'https://www.mail.example.com/',
        body,
        () => getDomainCategorization('mail.example.com', OPTIONS),
        headers
      );

    // (a <meta> cannot make a page UTF-16, in a comment or a description
    //  either)
    for (const head of [
      '<meta charset="utf-16le">',
      '<!-- <meta charset="utf-16"> -->',
      '<meta name="description" content="Encoded with charset=utf-16be">'
    ]) {
      const result = await read(page(casino, head), {});
      t.true(result.categories.includes('gambling'), `${head}`);
    }

    // (raw deflate, longer than what is decompressed)
    const long = page(
      casino + '<p>Lorem ipsum dolor sit amet.</p>'.repeat(20_000)
    );
    const result = await read(zlib.deflateRawSync(Buffer.from(long)), {
      'content-encoding': 'deflate'
    });
    t.true(result.categories.includes('gambling'));
  }
);

//
// (a stand-in for undici.request: `serve(url, signal)` gives the response,
//  or waits for the request to be cancelled)
//
async function withRequests(serve, fn) {
  const undici = require('undici');
  const { request } = undici;
  const cancelled = (signal) =>
    new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => {
        reject(new Error('aborted'));
      });
    });
  undici.request = async (url, options) =>
    serve(new URL(url), options.signal, cancelled);
  refuseFetch = false;
  try {
    return await fn();
  } finally {
    undici.request = request;
    refuseFetch = true;
  }
}

test.serial(
  'a page still arriving at the timeout is read as far as it came',
  async (t) => {
    const startedAt = Date.now();
    const result = await withRequests(
      async (url, signal, cancelled) => ({
        statusCode: 200,
        headers: {},
        context: { history: [url] },
        body: (async function* () {
          yield require('node:buffer').Buffer.from(
            '<p>Welcome to our online casino: claim free spins and a deposit bonus.</p>'
          );
          // (then nothing, until the request is cancelled)
          await cancelled(signal);
        })()
      }),
      () =>
        getDomainCategorization('slow.example.com', {
          ...OPTIONS,
          timeout: 300
        })
    );
    t.true(Date.now() - startedAt < 1000);
    t.true(result.timedOut);
    t.is(result.error, null);
    t.true(result.categories.includes('gambling'));
  }
);

test.serial(
  'a domain that never answers on HTTPS still has time for HTTP',
  async (t) => {
    const startedAt = Date.now();
    const result = await withRequests(
      async (url, signal, cancelled) => {
        if (url.protocol === 'https:') await cancelled(signal);
        return {
          statusCode: 200,
          headers: {},
          context: { history: [url] },
          body: (async function* () {
            yield require('node:buffer').Buffer.from(
              '<p>Welcome to our online casino: claim free spins and a deposit bonus.</p>'
            );
          })()
        };
      },
      () =>
        getDomainCategorization('slow.example.com', {
          ...OPTIONS,
          timeout: 500
        })
    );
    t.true(Date.now() - startedAt < 1000);
    t.false(result.timedOut);
    t.true(result.categories.includes('gambling'));
  }
);

test.serial(
  'DNS lookups that never answer end the check at the timeout',
  async (t) => {
    const never = { resolve: () => new Promise(() => {}) };
    const startedAt = Date.now();
    const result = await getDomainCategorization(DOMAIN, {
      ...OPTIONS,
      timeout: 300,
      familyResolver: never,
      securityResolver: never,
      resolver: never,
      client: {
        get: () => new Promise(() => {}),
        sismember: () => new Promise(() => {})
      }
    });
    t.true(Date.now() - startedAt < 1000);
    t.is(result.dnsError, 'ETIMEOUT');
    t.true(result.categories.includes('dns_error'));
    t.true(result.disposableListError);
  }
);

test('a typographic apostrophe in a denial or a rule still counts', (t) => {
  for (const html of [
    page(
      '<p>We don’t host online casinos, sports betting or other gambling sites.</p>'
    ),
    page(
      '<p>We won’t sell viagra without a prescription, and you can’t buy cialis here either.</p>'
    ),
    page(
      '<p>Our sign-up form isn’t a temp mail service and doesn’t accept 10 minute mail.</p>'
    )
  ]) {
    t.deepEqual(categoriesOf(html), [], `${html}`);
  }
});

test('a sign-up rule about temp mail is not a temp mail service', (t) => {
  for (const rule of [
    "Please don't use temp mail or 10 minute mail addresses to sign up.",
    "We don't allow temp mail or burner email addresses.",
    "Temp mail and YOPmail addresses won't work for registration.",
    'Accounts created with a temp mail or trash mail address may be suspended.',
    'Do not register with temp mail or 10 minute mail services.'
  ]) {
    t.false(
      categoriesOf(page(`<h1>Help</h1><p>${rule}</p>`)).includes(
        'disposable_email'
      ),
      `${rule}`
    );
  }

  // (a temp mail service saying what it is for)
  t.true(
    categoriesOf(
      page(
        "<h1>Temp Mail</h1><p>Don't use your real address: get a free temporary email and use temp mail to sign up.</p>"
      )
    ).includes('disposable_email')
  );
});

test('a ban of online casinos is not a casino', (t) => {
  t.deepEqual(
    categoriesOf(
      page(
        '<p>Shares fell after the state banned online casinos and sports betting apps.</p>'
      )
    ),
    []
  );
});

test('text an <svg> shows is read, also in a CDATA section', (t) => {
  t.true(
    categoriesOf(
      page(
        '<svg><text><![CDATA[Welcome to our online casino: claim free spins and a deposit bonus]]></text></svg>'
      )
    ).includes('gambling')
  );
  // (an <mi> is HTML only in a <math>: in an <svg>, a paragraph ends it)
  t.true(
    categoriesOf(
      page(
        '<svg><mi><p>Welcome to our online casino: claim free spins and a deposit bonus</p></mi></svg>'
      )
    ).includes('gambling')
  );
});

test.serial(
  'a charset the decoder does not know is passed over for the <meta> one',
  async (t) => {
    // (windows-1251, for the Cyrillic letters below)
    const encode = (text) =>
      require('node:buffer').Buffer.from(
        [...text].map((char) => {
          const code = char.codePointAt(0);
          return code >= 0x4_10 && code <= 0x4_4f ? code - 0x4_10 + 0xc0 : code;
        })
      );
    const body = encode(
      '<html><head><meta charset="windows-1251"><title>Казино</title></head><body><p>Лучшее онлайн казино: фриспины и бонусы каждый день.</p></body></html>'
    );
    for (const type of [
      'text/html; charset=None',
      'text/html; charset=utf8mb4'
    ]) {
      const result = await servePage(
        'https://www.mail.example.com/',
        body,
        () => getDomainCategorization('mail.example.com', OPTIONS),
        { 'content-type': type }
      );
      t.is(result.title, 'Казино', `${type}`);
      t.true(result.categories.includes('gambling'), `${type}`);
    }
  }
);

test('a news story naming TikTok is not a TikTok tool', (t) => {
  for (const html of [
    page(
      '<p>Our music school helps musically curious kids grow.</p><footer><a href="https://www.tiktok.com/@school">TikTok</a></footer>'
    ),
    page(
      '<p>TikTok and its Chinese twin Douyin face new rules in the EU this year.</p>'
    )
  ]) {
    t.false(categoriesOf(html).includes('tiktok_tool'), `${html}`);
  }

  t.true(
    categoriesOf(
      page(
        '<h1>Download TikTok videos without watermark</h1><p>Paste the TikTok link to save TikTok videos in HD.</p>'
      )
    ).includes('tiktok_tool')
  );
});

test('a word with a pattern in it is not a streaming domain name', async (t) => {
  for (const name of [
    'mainstreamhealth.example',
    'upstreamconsulting.example',
    'dramaticarts.example'
  ]) {
    const result = await getDomainCategorization(name, OPTIONS);
    t.false(result.categories.includes('streaming'), `${name}`);
  }

  const result = await getDomainCategorization('dramacool.example', OPTIONS);
  t.true(result.categories.includes('streaming'));
});

test.serial(
  'a sign-in page any other site serves after a redirect is phishing',
  async (t) => {
    const signIn = page(PASSWORD_FORM, '', 'Sign in - Google Accounts');
    const result = await servePage(
      'https://login.kit.example/google/',
      signIn,
      () => getDomainCategorization('mail.example.com', OPTIONS)
    );
    t.true(result.categories.includes('phishing'));
  }
);
