/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const ms = require('ms');
const test = require('ava');

//
// Replace the network-bound categorisation and the mailer with stubs so the
// real helper runs end to end and we can inspect the alert it builds.
//
let categorization;
const sent = [];

function stubModule(id, exports) {
  const filename = require.resolve(id);
  require.cache[filename] = {
    id: filename,
    filename,
    loaded: true,
    exports
  };
}

stubModule('#helpers/get-domain-categorization', async () => categorization);
let sendError = null;
let sendDelay = 0;
let sendHook = null;
stubModule('#helpers/email', async (options) => {
  if (sendHook) await sendHook(options);
  if (sendDelay)
    await new Promise((resolve) => {
      setTimeout(resolve, sendDelay);
    });
  if (sendError) throw sendError;
  sent.push(options);
});

const checkDomainAndAct = require('#helpers/check-domain-and-act');

test.beforeEach(() => {
  sent.length = 0;
  sendError = null;
  sendDelay = 0;
  sendHook = null;
});

test.serial(
  'the review alert escapes the attacker-controlled page title and user data',
  async (t) => {
    categorization = {
      categories: ['phishing'],
      title: '<a href="https://attacker.example/login">Click to review</a>',
      statusCode: 200,
      contentLength: 123,
      isParked: false,
      hasLegitimateHosting: false
    };

    const user = {
      _id: '0123456789abcdef01234567',
      email: '"<img src=x>"@example.com',
      group: 'user',
      has_passed_kyc: false,
      created_at: new Date()
    };

    const Users = {
      find: () => ({
        select: () => ({ lean: () => ({ exec: async () => [user] }) })
      })
    };
    const Aliases = { countDocuments: async () => 1 };
    const ctx = {
      bannedResults: [],
      reviewResults: [],
      skippedResults: [],
      dryRun: false
    };

    await checkDomainAndAct(
      {
        _id: 'domain-id',
        name: 'attacker.example',
        members: [{ user: user._id }]
      },
      ctx,
      {
        Users,
        Aliases,
        logger: { info() {}, fatal() {}, warn() {}, debug() {} }
      }
    );

    t.is(sent.length, 1);
    const { message } = sent[0].locals;
    t.false(message.includes('<a href="https://attacker.example/login">'));
    t.true(
      message.includes(
        '&lt;a href=&quot;https://attacker.example/login&quot;&gt;Click to review&lt;/a&gt;'
      )
    );
    t.false(message.includes('<img src=x>'));
    t.true(message.includes('&quot;&lt;img src=x&gt;&quot;@example.com'));
    // the result recorded for the digest keeps the raw values
    t.is(ctx.bannedResults[0].title, categorization.title);
  }
);

//
// A new member of a flagged domain, the models it is read from, and a Redis
// client keeping keys in memory
//
const NEW_USER = {
  _id: '0123456789abcdef01234568',
  email: 'new-user@example.com',
  group: 'user',
  has_passed_kyc: false,
  created_at: new Date()
};

function models(users = [NEW_USER]) {
  return {
    Users: {
      find: () => ({
        select: () => ({ lean: () => ({ exec: async () => users }) })
      })
    },
    Aliases: { countDocuments: async () => 2 }
  };
}

// (the keys of review alerts sent)
async function alertKeys(client) {
  const keys = await client.keys('*');
  return keys.filter((key) => key.includes('domain_check_alert:'));
}

// (what a domain is held for, or undefined)
async function heldFor(client, domainId) {
  const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
  const verdict = await getDomainCheckVerdict(client, domainId);
  return verdict?.categories;
}

function redisClient() {
  return new Redis({ keyPrefix: `${randomUUID()}:` });
}

const quiet = { info() {}, fatal() {}, error() {}, warn() {}, debug() {} };

function newCtx() {
  return {
    bannedResults: [],
    reviewResults: [],
    skippedResults: [],
    dryRun: false
  };
}

async function check(
  name,
  opts = {},
  users = [NEW_USER],
  domainId = `${name}-id`
) {
  const ctx = newCtx();
  await checkDomainAndAct(
    { _id: domainId, name, members: users.map((u) => ({ user: u._id })) },
    ctx,
    { logger: quiet, ...models(users), ...opts }
  );
  return ctx;
}

const CLEAN_PAGE = {
  title: 'Example',
  statusCode: 200,
  contentLength: 1000,
  textLength: 800,
  isParked: false,
  hasLegitimateHosting: true,
  evidence: {}
};

test.serial(
  'a Cloudflare block for adult content alone is listed for review, not emailed',
  async (t) => {
    categorization = {
      ...CLEAN_PAGE,
      blocked: true,
      cloudflareBlock: 'adult',
      categories: ['blocked_by_cloudflare_family']
    };

    const ctx = await check('adult-block.example');
    t.is(sent.length, 0);
    t.is(ctx.bannedResults.length, 0);
    t.is(ctx.reviewResults.length, 1);
    t.deepEqual(ctx.reviewResults[0].reviewCategories, [
      'blocked_by_cloudflare_family'
    ]);
    t.is(ctx.reviewResults[0].cloudflareBlock, 'adult');
    t.true(ctx.reviewResults[0].isUnconfirmedAdultBlock);
  }
);

test.serial(
  'a parked domain Cloudflare blocks for adult content is listed for review',
  async (t) => {
    // (a domain registered again keeps its old categorization)
    categorization = {
      ...CLEAN_PAGE,
      contentLength: 114,
      textLength: 0,
      isParked: true,
      isParkedLander: true,
      blocked: true,
      cloudflareBlock: 'adult',
      categories: ['blocked_by_cloudflare_family', 'parked']
    };

    const ctx = await check('parked.example');
    t.is(sent.length, 0);
    t.is(ctx.reviewResults.length, 1);
  }
);

test.serial(
  'a Cloudflare block for adult content is emailed when the page could not be read',
  async (t) => {
    // (adult sites often refuse the check: nothing contradicts the block)
    for (const page of [
      { statusCode: 403, contentLength: 1000 },
      { statusCode: null, contentLength: 0, textLength: 0 },
      { statusCode: 301, contentLength: 300 },
      // (an age gate, or an app that draws its page with scripts)
      { statusCode: 200, contentLength: 5000, textLength: 120 },
      // (a phrase such as "coming soon" does not make a page parked here)
      {
        statusCode: 200,
        contentLength: 800,
        textLength: 60,
        isParked: true,
        categories: ['blocked_by_cloudflare_family', 'parked']
      }
    ]) {
      sent.length = 0;
      categorization = {
        ...CLEAN_PAGE,
        blocked: true,
        cloudflareBlock: 'adult',
        categories: ['blocked_by_cloudflare_family'],
        ...page
      };

      const ctx = await check('unreadable.example');
      t.is(sent.length, 1);
      t.is(ctx.reviewResults.length, 0);
    }
  }
);

test.serial(
  'a Cloudflare block for adult content is emailed when the page has an adult keyword',
  async (t) => {
    // (an age gate with one: too few to flag the page on its own)
    categorization = {
      ...CLEAN_PAGE,
      blocked: true,
      cloudflareBlock: 'adult',
      categories: ['blocked_by_cloudflare_family'],
      keywordCounts: { adult: 1 }
    };

    const ctx = await check('age-gate.example');
    t.is(sent.length, 1);
    t.is(ctx.reviewResults.length, 0);
  }
);

test.serial(
  'a Cloudflare block for adult content is emailed when the page looks adult too',
  async (t) => {
    categorization = {
      ...CLEAN_PAGE,
      blocked: true,
      cloudflareBlock: 'adult',
      categories: ['blocked_by_cloudflare_family', 'adult'],
      evidence: {
        adult: [
          { keyword: 'porn video', in: 'text', excerpt: 'free porn videos' },
          { keyword: 'hentai', in: 'title', excerpt: '<b>hentai</b> site' }
        ]
      }
    };

    const ctx = await check('adult-page.example');
    t.is(sent.length, 1);
    t.deepEqual(ctx.bannedResults[0].bannableCategories, [
      'blocked_by_cloudflare_family',
      'adult'
    ]);
    const { message } = sent[0].locals;
    // the alert says why: Cloudflare's verdict and each keyword, in context
    t.true(
      message.includes('Blocked as adult content by Cloudflare Family DNS')
    );
    t.true(message.includes('&ldquo;porn video&rdquo; in the page text'));
    t.true(message.includes('<em>free porn videos</em>'));
    // (excerpts come from the page and are escaped)
    t.true(message.includes('&lt;b&gt;hentai&lt;/b&gt; site'));
    t.false(message.includes('<b>hentai</b>'));
  }
);

test.serial('a Cloudflare security block is emailed on its own', async (t) => {
  categorization = {
    ...CLEAN_PAGE,
    blocked: true,
    cloudflareBlock: 'security',
    categories: ['blocked_by_cloudflare_family']
  };

  const ctx = await check('security-block.example');
  t.is(sent.length, 1);
  t.is(ctx.bannedResults.length, 1);
  t.true(
    sent[0].locals.message.includes(
      'Blocked as a security threat (malware or phishing)'
    )
  );
});

test.serial(
  'a domain is emailed once, and again only when the findings change',
  async (t) => {
    const client = redisClient();
    categorization = {
      ...CLEAN_PAGE,
      categories: ['gambling'],
      evidence: {
        gambling: [{ keyword: 'casino', in: 'text', excerpt: 'casino' }]
      }
    };

    // the hourly check finds the same thing again: one email
    const first = await check('flagged.example', { client });
    const second = await check('flagged.example', { client });
    t.is(sent.length, 1);
    t.false(first.bannedResults[0].alreadyReported);
    // (the digest still lists the domain, as already reported)
    t.true(second.bannedResults[0].alreadyReported);

    // other categories: emailed again
    categorization = { ...categorization, categories: ['gambling', 'adult'] };
    await check('flagged.example', { client });
    t.is(sent.length, 2);

    // another user to review: emailed again
    const other = { ...NEW_USER, _id: '0123456789abcdef01234569' };
    await check('flagged.example', { client }, [NEW_USER, other]);
    t.is(sent.length, 3);
    await check('flagged.example', { client }, [NEW_USER, other]);
    t.is(sent.length, 3);

    // another domain with the same findings is its own alert
    await check('other-flagged.example', { client });
    t.is(sent.length, 4);

    // and each alert is remembered for 30 days
    const keys = await alertKeys(client);
    t.is(keys.length, 4);
    const pttl = await client.pttl(
      keys[0].slice(client.options.keyPrefix.length)
    );
    t.true(pttl > ms('29d') && pttl <= ms('30d'));
  }
);

test.serial('findings that alternate are not emailed again', async (t) => {
  const client = redisClient();
  const loaded = {
    ...CLEAN_PAGE,
    blocked: true,
    cloudflareBlock: 'security',
    categories: ['blocked_by_cloudflare_family', 'piracy']
  };
  // (the page timed out)
  const timedOut = {
    ...loaded,
    statusCode: null,
    categories: ['blocked_by_cloudflare_family']
  };

  for (const found of [loaded, timedOut, loaded, timedOut]) {
    categorization = found;

    await check('alternating.example', { client });
  }

  t.is(sent.length, 2);
});

test.serial(
  'two domains with the same name are each emailed once',
  async (t) => {
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['gambling'] };
    const other = { ...NEW_USER, _id: '0123456789abcdef01234569' };

    // (two users each added the domain: two records, checked every hour)
    for (let run = 0; run < 3; run++) {
      await check('same-name.example', { client }, [NEW_USER], 'first-id');

      await check('same-name.example', { client }, [other], 'second-id');
    }

    t.is(sent.length, 2);
  }
);

test.serial(
  'an alert that fails to send is sent again on the next check',
  async (t) => {
    const client = redisClient();
    categorization = {
      ...CLEAN_PAGE,
      categories: ['phishing'],
      evidence: {}
    };

    sendError = new Error('SMTP unavailable');
    const failed = await check('unsent.example', { client });
    t.is(sent.length, 0);
    t.false(failed.bannedResults[0].alertSent);
    t.deepEqual(await alertKeys(client), []);

    sendError = null;
    const retried = await check('unsent.example', { client });
    t.is(sent.length, 1);
    t.true(retried.bannedResults[0].alertSent);
  }
);

test.serial('the alert is sent before the check returns', async (t) => {
  // (the job's worker is ended once every domain is checked: an alert still
  //  being sent then would be lost, and not sent again for 30 days)
  const client = redisClient();
  categorization = { ...CLEAN_PAGE, categories: ['phishing'] };
  sendDelay = 50;

  const ctx = await check('slow-send.example', { client });
  t.is(sent.length, 1);
  t.true(ctx.bannedResults[0].alertSent);
});

test.serial(
  'what a domain is flagged for is kept for the SMTP auto-approval',
  async (t) => {
    const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
    const client = redisClient();

    categorization = { ...CLEAN_PAGE, categories: ['crypto_scam'] };
    await check('kept.example', { client });
    const verdict = await getDomainCheckVerdict(client, 'kept.example-id');
    t.deepEqual(verdict.categories, ['crypto_scam']);

    // (also when every member is protected, and not for a review-only finding)
    const admin = { ...NEW_USER, group: 'admin' };
    await check('protected.example', { client }, [admin]);
    t.truthy(await getDomainCheckVerdict(client, 'protected.example-id'));

    categorization = { ...CLEAN_PAGE, categories: ['dns_error'] };
    await check('review-only.example', { client });
    t.is(await getDomainCheckVerdict(client, 'review-only.example-id'), null);

    // (a Cloudflare adult block only listed in the digest still waits for one)
    categorization = {
      ...CLEAN_PAGE,
      blocked: true,
      cloudflareBlock: 'adult',
      categories: ['blocked_by_cloudflare_family']
    };
    await check('adult-block.example', { client });
    t.is(sent.length, 1);
    const adultVerdict = await getDomainCheckVerdict(
      client,
      'adult-block.example-id'
    );
    t.deepEqual(adultVerdict.categories, ['blocked_by_cloudflare_family']);

    // a clean check clears it
    categorization = { ...CLEAN_PAGE, categories: [] };
    await check('kept.example', { client });
    t.is(await getDomainCheckVerdict(client, 'kept.example-id'), null);

    // nor in a dry run
    categorization = { ...CLEAN_PAGE, categories: ['crypto_scam'] };
    const ctx = newCtx();
    ctx.dryRun = true;
    const sentBefore = sent.length;
    await checkDomainAndAct(
      { _id: 'dry-id', name: 'dry.example', members: [{ user: NEW_USER._id }] },
      ctx,
      { logger: quiet, client, ...models() }
    );
    t.is(await getDomainCheckVerdict(client, 'dry-id'), null);
    // (and no review email is sent)
    t.is(sent.length, sentBefore);

    // (and a dry run leaves one there is)
    categorization = { ...CLEAN_PAGE, categories: [] };
    const dry = newCtx();
    dry.dryRun = true;
    await checkDomainAndAct(
      {
        _id: 'protected.example-id',
        name: 'protected.example',
        members: [{ user: NEW_USER._id }]
      },
      dry,
      { logger: quiet, client, ...models() }
    );
    t.truthy(await getDomainCheckVerdict(client, 'protected.example-id'));
  }
);

test.serial(
  'a check that could not see what a domain was flagged for keeps it flagged',
  async (t) => {
    const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
    const client = redisClient();
    const verdict = async () => {
      const found = await getDomainCheckVerdict(client, 'blocking.example-id');
      return found?.categories;
    };

    // flagged for its page, and blocked by Cloudflare as a threat
    categorization = {
      ...CLEAN_PAGE,
      blocked: true,
      cloudflareBlock: 'security',
      categories: ['blocked_by_cloudflare_family', 'crypto_scam']
    };
    await check('blocking.example', { client });
    t.deepEqual(await verdict(), [
      'blocked_by_cloudflare_family',
      'crypto_scam'
    ]);

    // the DNS lookup fails and the page refuses the check (or times out)
    for (const page of [
      { statusCode: 403 },
      { statusCode: null, contentLength: 0, textLength: 0 }
    ]) {
      categorization = {
        ...CLEAN_PAGE,
        ...page,
        dnsError: 'ETIMEOUT',
        categories: ['dns_error']
      };
      await check('blocking.example', { client });
      t.deepEqual(await verdict(), [
        'blocked_by_cloudflare_family',
        'crypto_scam'
      ]);
    }

    // (and each such check starts its 30 days again)
    await client.pexpire('domain_check_verdict:blocking.example-id', ms('1d'));
    categorization = { ...CLEAN_PAGE, statusCode: 403, categories: [] };
    await check('blocking.example', { client });
    t.true(
      (await client.pttl('domain_check_verdict:blocking.example-id')) >
        ms('29d')
    );
    // (Cloudflare no longer blocks it: only what the page was flagged for is
    //  kept, as the page still cannot be read)
    t.deepEqual(await verdict(), ['crypto_scam']);

    // still blocked, page unread: what it was flagged for is kept with it
    categorization = {
      ...CLEAN_PAGE,
      statusCode: 403,
      blocked: true,
      cloudflareBlock: 'security',
      categories: ['blocked_by_cloudflare_family']
    };
    await check('blocking.example', { client });
    t.deepEqual(await verdict(), [
      'blocked_by_cloudflare_family',
      'crypto_scam'
    ]);

    // a block hidden by the domain pointing to 0.0.0.0 itself is kept
    categorization = {
      ...CLEAN_PAGE,
      statusCode: 403,
      pointsToZeroAddress: true,
      categories: []
    };
    await check('blocking.example', { client });
    t.deepEqual(await verdict(), [
      'blocked_by_cloudflare_family',
      'crypto_scam'
    ]);

    // an empty page (a script-drawn app, or a challenge page) is not read
    categorization = { ...CLEAN_PAGE, textLength: 0, categories: [] };
    await check('blocking.example', { client });
    t.deepEqual(await verdict(), ['crypto_scam']);

    // a check that sees everything clean clears it
    categorization = { ...CLEAN_PAGE, categories: [] };
    await check('blocking.example', { client });
    t.is(await verdict(), undefined);
  }
);

test.serial('a Redis error leaves the verdict as it is', async (t) => {
  const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
  const client = redisClient();
  categorization = { ...CLEAN_PAGE, categories: ['phishing'] };
  await check('redis-error.example', { client });

  // (the next check cannot read the verdict: it does not take that for
  //  "not flagged" and delete it)
  const { get } = client;
  client.get = async () => {
    throw new Error('connection lost');
  };

  categorization = { ...CLEAN_PAGE, statusCode: 403, categories: [] };
  await check('redis-error.example', { client });
  client.get = get;
  const verdict = await getDomainCheckVerdict(client, 'redis-error.example-id');
  t.deepEqual(verdict.categories, ['phishing']);
});

test.serial('a domain never flagged costs no write', async (t) => {
  const client = redisClient();
  const writes = [];
  for (const command of ['set', 'del', 'pexpire']) {
    const original = client[command].bind(client);
    client[command] = async (...args) => {
      writes.push(command);
      return original(...args);
    };
  }

  categorization = { ...CLEAN_PAGE, categories: [] };
  await check('clean.example', { client });
  t.deepEqual(writes, []);
});

test.serial(
  'an alert being sent is claimed briefly, and kept once sent',
  async (t) => {
    // (one whose process ends mid-send is sent again 15 minutes later)
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['phishing'] };
    let claimed;
    sendHook = async () => {
      const [key] = await alertKeys(client);
      claimed = await client.pttl(key.slice(client.options.keyPrefix.length));
    };

    await check('claimed.example', { client });
    t.true(claimed > 0 && claimed <= ms('15m'));
    const [key] = await alertKeys(client);
    t.true(
      (await client.pttl(key.slice(client.options.keyPrefix.length))) >
        ms('29d')
    );
  }
);

test.serial(
  'possible phishing is listed for review, not emailed, and held for SMTP',
  async (t) => {
    const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['possible_phishing'] };

    const ctx = await check('sign-in.example', { client });
    t.is(sent.length, 0);
    t.deepEqual(ctx.reviewResults[0].reviewCategories, ['possible_phishing']);
    const verdict = await getDomainCheckVerdict(client, 'sign-in.example-id');
    t.deepEqual(verdict.categories, ['possible_phishing']);
  }
);

test.serial(
  'an alert whose claim lapsed during a slow send is still kept once sent',
  async (t) => {
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['phishing'] };
    sendHook = async () => {
      // (the 15-minute claim expires before the send ends)
      const [key] = await alertKeys(client);
      await client.del(key.slice(client.options.keyPrefix.length));
    };

    await check('slow.example', { client });
    const [key] = await alertKeys(client);
    t.truthy(key);
    t.true(
      (await client.pttl(key.slice(client.options.keyPrefix.length))) >
        ms('29d')
    );
  }
);

test.serial(
  'a domain with no address is not blocked, and keeps what its page was flagged for',
  async (t) => {
    const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
    const client = redisClient();
    categorization = {
      ...CLEAN_PAGE,
      blocked: true,
      cloudflareBlock: 'security',
      categories: ['blocked_by_cloudflare_family', 'gambling']
    };
    await check('no-address.example', { client });

    //
    // (its A record removed: Cloudflare answers 0.0.0.0 for a name it
    //  blocks, with or without one, so the block is gone; its page cannot
    //  be read)
    //
    categorization = {
      ...CLEAN_PAGE,
      statusCode: null,
      contentLength: 0,
      textLength: 0,
      noAddress: true,
      categories: []
    };
    await check('no-address.example', { client });
    const verdict = await getDomainCheckVerdict(
      client,
      'no-address.example-id'
    );
    t.deepEqual(verdict.categories, ['gambling']);
  }
);

test.serial('a stored value that is not a verdict is replaced', async (t) => {
  const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
  const client = redisClient();
  await client.set('domain_check_verdict:garbled.example-id', 'not json');

  categorization = { ...CLEAN_PAGE, categories: ['gambling'] };
  await check('garbled.example', { client });
  const verdict = await getDomainCheckVerdict(client, 'garbled.example-id');
  t.deepEqual(verdict.categories, ['gambling']);

  await client.set('domain_check_verdict:garbled.example-id', '{}');
  categorization = { ...CLEAN_PAGE, categories: [] };
  await check('garbled.example', { client });
  t.is(await getDomainCheckVerdict(client, 'garbled.example-id'), null);
});

test.serial(
  'a disposable email listing is kept while the list cannot be read',
  async (t) => {
    const { getDomainCheckVerdict } = require('#helpers/domain-check-verdict');
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['disposable_email'] };
    await check('listed.example', { client });

    categorization = {
      ...CLEAN_PAGE,
      disposableListError: true,
      categories: []
    };
    await check('listed.example', { client });
    const verdict = await getDomainCheckVerdict(client, 'listed.example-id');
    t.deepEqual(verdict.categories, ['disposable_email']);

    // (and cleared by a check that could read it)
    categorization = { ...CLEAN_PAGE, categories: [] };
    await check('listed.example', { client });
    t.is(await getDomainCheckVerdict(client, 'listed.example-id'), null);
  }
);

test.serial('rows for the digest only are marked so', async (t) => {
  categorization = { ...CLEAN_PAGE, categories: ['possible_phishing'] };
  const pp = await check('pp.example');
  t.true(pp.reviewResults[0].digestOnly);

  categorization = {
    ...CLEAN_PAGE,
    blocked: true,
    cloudflareBlock: 'adult',
    categories: ['blocked_by_cloudflare_family']
  };
  const unconfirmed = await check('unconfirmed.example');
  t.true(unconfirmed.reviewResults[0].digestOnly);

  // (a review the new domain email still shows)
  categorization = { ...CLEAN_PAGE, categories: ['dns_error'] };
  const dns = await check('dns.example');
  t.false(dns.reviewResults[0].digestOnly);

  // (nor one with something else to review)
  categorization = {
    ...CLEAN_PAGE,
    categories: ['possible_phishing', 'dns_error']
  };
  const both = await check('both.example');
  t.false(both.reviewResults[0].digestOnly);

  // (a site selling email service is listed in the digest)
  categorization = { ...CLEAN_PAGE, categories: ['email_service'] };
  const esp = await check('esp.example');
  t.true(esp.reviewResults[0].digestOnly);
});

test.serial(
  'what a check cannot see again lapses 90 days after it was last seen',
  async (t) => {
    const {
      getDomainCheckVerdict,
      UNSEEN_TTL_MS
    } = require('#helpers/domain-check-verdict');
    const unreadable = {
      ...CLEAN_PAGE,
      statusCode: 403,
      textLength: 0,
      categories: []
    };

    // (seen 10 days ago: kept, and still seen then)
    const client = redisClient();
    const tenDaysAgo = new Date(Date.now() - ms('10d')).toISOString();
    await client.set(
      'domain_check_verdict:recent.example-id',
      JSON.stringify({
        categories: ['gambling'],
        checked_at: tenDaysAgo,
        seen: { gambling: tenDaysAgo }
      })
    );
    categorization = unreadable;
    await check('recent.example', { client });
    const kept = await getDomainCheckVerdict(client, 'recent.example-id');
    t.deepEqual(kept.categories, ['gambling']);
    t.is(kept.seen.gambling, tenDaysAgo);

    // (and twice, without a duplicate)
    await check('recent.example', { client });
    t.deepEqual(await heldFor(client, 'recent.example-id'), ['gambling']);

    // (seen longer ago than that: lapsed)
    const longAgo = new Date(
      Date.now() - UNSEEN_TTL_MS - ms('1d')
    ).toISOString();
    await client.set(
      'domain_check_verdict:old.example-id',
      JSON.stringify({ categories: ['gambling'], checked_at: longAgo })
    );
    await check('old.example', { client });
    t.is(await getDomainCheckVerdict(client, 'old.example-id'), null);
  }
);

test.serial(
  'a disposable email page that refuses a later check stays flagged',
  async (t) => {
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['disposable_email'] };
    await check('temp-inbox.example', { client });

    categorization = {
      ...CLEAN_PAGE,
      statusCode: 403,
      textLength: 0,
      categories: []
    };
    await check('temp-inbox.example', { client });
    t.deepEqual(await heldFor(client, 'temp-inbox.example-id'), [
      'disposable_email'
    ]);
  }
);

test.serial(
  'a new domain is held as pending until its first check',
  async (t) => {
    const {
      getDomainCheckVerdict,
      setDomainCheckPending,
      setDomainCheckVerdict,
      PENDING
    } = require('#helpers/domain-check-verdict');
    const client = redisClient();

    await setDomainCheckPending(client, 'new.example-id');
    t.deepEqual(await heldFor(client, 'new.example-id'), [PENDING]);
    const pendingTtl = await client.pttl('domain_check_verdict:new.example-id');
    t.true(pendingTtl > 0 && pendingTtl <= ms('10m'));

    // (a flagged check replaces it, a clean one clears it)
    categorization = { ...CLEAN_PAGE, categories: ['gambling'] };
    await check('new.example', { client });
    t.deepEqual(await heldFor(client, 'new.example-id'), ['gambling']);
    await setDomainCheckPending(client, 'clean.example-id');
    categorization = { ...CLEAN_PAGE, categories: [] };
    await check('clean.example', { client });
    t.is(await getDomainCheckVerdict(client, 'clean.example-id'), null);

    // (and it never replaces a verdict)
    await setDomainCheckVerdict(client, 'flagged.example-id', ['phishing']);
    await setDomainCheckPending(client, 'flagged.example-id');
    t.deepEqual(await heldFor(client, 'flagged.example-id'), ['phishing']);
  }
);

test.serial('an alert is sent when its claim cannot be made', async (t) => {
  const client = redisClient();
  client.set = async () => {
    throw new Error('connection lost');
  };

  categorization = { ...CLEAN_PAGE, categories: ['phishing'] };
  const before = sent.length;
  await check('claim-error.example', { client });
  t.is(sent.length, before + 1);
});

test.serial('two checks at once do not undo each other', async (t) => {
  const { setDomainCheckPending } = require('#helpers/domain-check-verdict');
  const client = redisClient();
  await setDomainCheckPending(client, 'race.example-id');

  //
  // (this check cannot read the page; right after it reads the verdict,
  //  the check when the domain was created ends: it saw a casino)
  //
  const { get } = client;
  let interleaved = false;
  client.get = async (...args) => {
    const value = await get.apply(client, args);
    if (!interleaved && String(args[0]).startsWith('domain_check_verdict:')) {
      interleaved = true;
      categorization = { ...CLEAN_PAGE, categories: ['gambling'] };
      await check('race.example', { client });
    }

    return value;
  };

  categorization = { ...CLEAN_PAGE, statusCode: 403, categories: [] };
  await check('race.example', { client });
  client.get = get;
  t.true(interleaved);
  t.deepEqual(await heldFor(client, 'race.example-id'), ['gambling']);
});

test.serial(
  'a page cut off by the timeout does not clear what it was held for',
  async (t) => {
    const client = redisClient();
    categorization = { ...CLEAN_PAGE, categories: ['gambling'] };
    await check('cut-off.example', { client });
    t.deepEqual(await heldFor(client, 'cut-off.example-id'), ['gambling']);

    // (its first part was clean; the rest was not read)
    categorization = { ...CLEAN_PAGE, timedOut: true, categories: [] };
    await check('cut-off.example', { client });
    t.deepEqual(await heldFor(client, 'cut-off.example-id'), ['gambling']);

    // (a whole clean page clears it)
    categorization = { ...CLEAN_PAGE, categories: [] };
    await check('cut-off.example', { client });
    t.is(await heldFor(client, 'cut-off.example-id'), undefined);
  }
);
