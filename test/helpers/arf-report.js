/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Which abuse reports are read (helpers/arf-report.js), and what is learned
// from them, for every worker (helpers/spam-scanner-learned.js)
//

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const { setTimeout } = require('node:timers/promises');
const ms = require('ms');
const arf = require('spamscanner/arf');
const { Classifier } = require('spamscanner');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const env = require('#config/env');
const spamScanner = require('#helpers/spam-scanner');
const {
  CLAIM,
  FINISH,
  FORGET,
  RELEASE,
  getReporter,
  isOurSender,
  isReportType,
  isToAbuseOnly
} = require('#helpers/arf-report');
const {
  learnSpam,
  getDayKey,
  getLearnedVersion,
  loadLearned,
  VERSION_KEY
} = require('#helpers/spam-scanner-learned');

const TRUTH_SOURCE = [...config.truthSources][0];

// (the Message-ID of the copies the X-Forward-Email-Report fields here are
//  made for, and reported)
const COPY = '<copy@sender.example.net>';
function makeHeader(options) {
  const { createHeader } = require('#helpers/arf-recipient-block');
  return createHeader({ messageId: COPY, ...options });
}

function blockCopy(client, resolver, value, options = {}) {
  const { blockFromReport } = require('#helpers/arf-recipient-block');
  return blockFromReport(client, resolver, value, {
    messageId: COPY,
    ...options
  });
}

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always(async (t) => {
  await spamScanner.reset();
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);

function withReporters(t, values) {
  const reporters = new Set(config.arf.reporters);
  config.arf.reporters.clear();
  for (const value of values) config.arf.reporters.add(value);
  t.teardown(() => {
    config.arf.reporters.clear();
    for (const value of reporters) config.arf.reporters.add(value);
  });
}

// (signed, by default, by the From address's domain, aligned with it)
function session(
  from,
  dmarc = 'pass',
  dmarcDomain = TRUTH_SOURCE,
  signingDomain = from.slice(from.lastIndexOf('@') + 1).toLowerCase()
) {
  return {
    originalFromAddress: from,
    dmarc: { status: { result: dmarc }, domain: dmarcDomain },
    alignedDKIMResults: signingDomain
      ? [{ signingDomain, status: { result: 'pass', aligned: signingDomain } }]
      : []
  };
}

test('reads reports only from a feedback loop address at a truth source that passed DMARC', (t) => {
  withReporters(t, [
    `feedback@arf.${TRUTH_SOURCE}`,
    `@fbl.${TRUTH_SOURCE}`,
    'feedback@arf.not-a-truth-source.net'
  ]);
  t.is(getReporter(session(`feedback@arf.${TRUTH_SOURCE}`)), TRUTH_SOURCE);
  t.is(getReporter(session(`FeedBack@ARF.${TRUTH_SOURCE}`)), TRUTH_SOURCE);
  // (any address at a domain listed with "@", but not at its subdomains)
  t.is(getReporter(session(`loop@fbl.${TRUTH_SOURCE}`)), TRUTH_SOURCE);
  t.is(getReporter(session(`loop@x.fbl.${TRUTH_SOURCE}`)), null);
  // (a user of the provider is no feedback loop)
  t.is(getReporter(session(`someone@${TRUTH_SOURCE}`)), null);
  t.is(getReporter(session(`someone@arf.${TRUTH_SOURCE}`)), null);
  // (passing DMARC by SPF alone, which a provider's shared servers may pass
  //  for others, or signed by another domain)
  t.is(
    getReporter(
      session(`feedback@arf.${TRUTH_SOURCE}`, 'pass', TRUTH_SOURCE, null)
    ),
    null
  );
  t.is(
    getReporter(
      session(
        `feedback@arf.${TRUTH_SOURCE}`,
        'pass',
        TRUTH_SOURCE,
        'attacker.example.net'
      )
    ),
    null
  );
  // (failing DMARC, or passing it for another domain)
  for (const result of ['fail', 'none', 'temperror', ''])
    t.is(getReporter(session(`feedback@arf.${TRUTH_SOURCE}`, result)), null);
  t.is(
    getReporter(
      session(`feedback@arf.${TRUTH_SOURCE}`, 'pass', 'attacker.example.net')
    ),
    null
  );
  t.is(
    getReporter({
      originalFromAddress: `feedback@arf.${TRUTH_SOURCE}`,
      dmarc: { status: { result: 'pass' } }
    }),
    null
  );
  // (a feedback loop that is no truth source)
  t.is(
    getReporter(
      session(
        'feedback@arf.not-a-truth-source.net',
        'pass',
        'not-a-truth-source.net'
      )
    ),
    null
  );
  t.is(getReporter({}), null);
  t.is(getReporter(session('not-an-address')), null);
});

test('trusts only our own servers’ X-Forward-Email-Sender', (t) => {
  const ours = env.WEB_HOST;
  t.true(isOurSender(`rfc822; a@b.example, smtp.${ours}, 192.0.2.1`));
  t.true(isOurSender(`rfc822; a@b.example, ${ours}, 192.0.2.1`));
  t.true(
    isOurSender(`RFC822;a@b.example,MX1.${ours.toUpperCase()},2001:db8::1`)
  );
  t.false(isOurSender(`rfc822; a@b.example, smtp.${ours}.evil.net, 192.0.2.1`));
  t.false(isOurSender(`rfc822; a@b.example, not${ours}, 192.0.2.1`));
  t.false(isOurSender('rfc822; a@b.example, mail.test.com, 192.0.2.1'));
  // (without a host: a client without reverse DNS)
  t.false(isOurSender(`rfc822; a@${ours}, 192.0.2.1`));
  t.false(isOurSender('rfc822; 192.0.2.1'));
  t.false(isOurSender(''));
  t.false(isOurSender(null));
});

test('knows an ARF report by its content type, and the abuse address alone', (t) => {
  const headers = (value) => ({ getFirst: () => value });
  t.true(
    isReportType(
      headers('multipart/report; report-type=feedback-report; boundary="b"')
    )
  );
  t.true(
    isReportType(
      headers('Multipart/Report; boundary="b"; Report-Type="feedback-report"')
    )
  );
  t.false(
    isReportType(
      headers('multipart/report; report-type=delivery-status; boundary="b"')
    )
  );
  t.false(isReportType(headers('multipart/mixed; boundary="b"')));
  t.false(isReportType(headers(undefined)));

  const rcpt = (...addresses) => ({
    envelope: { rcptTo: addresses.map((address) => ({ address })) }
  });
  t.true(isToAbuseOnly(rcpt(config.abuseEmail)));
  t.true(isToAbuseOnly(rcpt(config.abuseEmail.toUpperCase())));
  t.true(isToAbuseOnly(rcpt(config.abuseEmail, config.abuseEmail)));
  t.false(isToAbuseOnly(rcpt(config.abuseEmail, 'bob@example.org')));
  t.false(isToAbuseOnly(rcpt()));
  t.false(isToAbuseOnly({}));
});

// a message in English with words no classifier was trained on
function gibberish() {
  const words = [];
  for (let i = 0; i < 40; i++)
    words.push(`q${randomUUID().replaceAll('-', '').slice(0, 10)}`);
  return [
    'From: sender@test.com',
    'To: bob@example.org',
    'Subject: A note about the meeting',
    `Message-ID: <${randomUUID()}@test.com>`,
    'Date: Mon, 19 Oct 2026 10:00:00 +0000',
    'Content-Type: text/plain; charset=us-ascii',
    '',
    'Hello, I wanted to let you know that the meeting has moved to next week.',
    'Please read the notes below and tell me what you think about them.',
    words.join(' '),
    'Thank you for your time, and have a good day.',
    ''
  ].join('\r\n');
}

function reportOf(original) {
  return arf.create({
    feedbackType: 'abuse',
    userAgent: 'Feedback/1.0',
    from: `feedback@arf.${TRUTH_SOURCE}`,
    to: config.abuseEmail,
    originalMessage: Buffer.from(original)
  });
}

test.serial(
  'every worker scans with what was learned from reports',
  async (t) => {
    const { client } = t.context;
    await spamScanner.reset();
    const { timeout } = config.spamScanner;
    config.spamScanner.timeout = ms('30s');
    t.teardown(() => {
      config.spamScanner.timeout = timeout;
    });

    const message = gibberish();
    const before = await spamScanner.scan(Buffer.from(message), { client });
    t.truthy(before);
    t.not(before.classification.category, 'spam');

    const analysis = await spamScanner.analyzeArf(reportOf(message), {
      learn: true
    });
    t.is(analysis.feedbackType, 'abuse');
    t.true(analysis.hasBody);
    t.true(analysis.features instanceof Uint32Array);
    t.true(analysis.features.length > 0);
    t.true(analysis.features.length <= config.arf.maxFeaturesPerMessage);
    // (in increasing order, each once, as a model holds them)
    for (let i = 1; i < analysis.features.length; i++)
      t.true(analysis.features[i] > analysis.features[i - 1]);

    // (not the features that name a party, e.g. its From domain, which
    //  whoever sends a message chooses)
    const party = new Classifier();
    party.learn(['from:test.com', 'url:plexoria.example.com'], 'spam');
    for (const hash of new Uint32Array(
      Uint8Array.from(Buffer.from(party.toJSON().keys, 'base64')).buffer
    ))
      t.false(analysis.features.includes(hash));

    // (reported by many recipients over twenty days, each report about another
    //  copy; each feature is learned at most three times a day)
    const day = ms('1d');
    for (let i = 0; i < 80; i++)
      t.is(
        await learnSpam(client, {
          id: `copy-${i}`,
          party: `recipient:r${i}@example.org`,
          group: 'domain:test',
          features: analysis.features,
          now: Date.now() - Math.floor(i / 4) * day
        }),
        i % 4 !== 3
      );
    // (a copy learned already is not learned again)
    t.false(
      await learnSpam(client, {
        id: 'copy-0',
        party: 'recipient:other@example.org',
        group: 'domain:test',
        features: analysis.features
      })
    );
    t.is(await client.get(VERSION_KEY), '60');
    t.is(await client.hget(getDayKey(Date.now()), 'n'), '3');
    t.regex(await getLearnedVersion(client), /^60:\d{4}-\d{2}-\d{2}$/);

    // (not read for a scan that can refuse a message, which is never sent
    //  it, e.g. on the SMTP and API servers)
    await spamScanner.reset();
    let versionReads = 0;
    const counting = Object.create(client);
    counting.get = (key, ...rest) => {
      if (key === VERSION_KEY) versionReads++;
      return client.get(key, ...rest);
    };

    t.truthy(
      await spamScanner.scan(Buffer.from(message), {
        client: counting,
        direction: 'outbound',
        blocks: true
      })
    );
    t.is(versionReads, 0);

    // (Redis is read once a minute: at once after a reset)
    await spamScanner.reset();
    await spamScanner.refreshLearned(client);
    // (a worker that was not sent what was learned in time, e.g. on a busy
    //  machine running the whole test suite, scans with the default
    //  classifier and asks again with its next scan: so at most a few)
    let after;
    for (let i = 0; i < 10; i++) {
      after = await spamScanner.scan(Buffer.from(message), { client });
      if (after?.classification?.category === 'spam') break;
      // (time for the worker to load what it was sent)
      await setTimeout(250);
    }

    t.truthy(after);
    t.is(after.classification.category, 'spam');

    // (a message not learned is scanned as before)
    const other = await spamScanner.scan(Buffer.from(gibberish()), { client });
    t.not(other.classification.category, 'spam');
  }
);

test.serial(
  'learns no word that names a party of the message reported, from its text or subject',
  async (t) => {
    await spamScanner.reset();
    const message = [
      'From: "Northwind Team" <news@mail.northwindtraders.com>',
      'Reply-To: help@contoso-billing.net',
      'To: bob@example.org',
      'Subject: Northwind invoice from northwindtraders.com',
      `Message-ID: <${randomUUID()}@northwindtraders.com>`,
      'Date: Mon, 19 Oct 2026 10:00:00 +0000',
      'Content-Type: text/plain; charset=us-ascii',
      '',
      'Hello from northwindtraders.com and the Northwind team. Write to',
      'contoso billing or visit https://www.fabrikam-portal.org/login today.',
      ''
    ].join('\r\n');
    const analysis = await spamScanner.analyzeArf(reportOf(message), {
      learn: true
    });
    const hashes = (features) => {
      const model = new Classifier();
      model.learn(features, 'spam');
      // (copied: a small Buffer's `buffer` is a shared pool)
      return [
        ...new Uint32Array(
          Uint8Array.from(Buffer.from(model.toJSON().keys, 'base64')).buffer
        )
      ];
    };

    for (const feature of [
      'northwind',
      'northwindtraders.com',
      'northwind team',
      'from northwindtraders.com',
      's:northwind',
      's:northwindtraders.com',
      // (and the words of a name with hyphens, of its Reply-To domain)
      'contoso',
      'billing',
      'contoso billing'
    ])
      t.false(
        hashes([feature]).some((hash) => analysis.features.includes(hash)),
        `${feature}`
      );
    // (what names no one is learned)
    for (const feature of ['hello', 's:invoice', 'today'])
      t.true(
        hashes([feature]).every((hash) => analysis.features.includes(hash)),
        `${feature}`
      );
  }
);

test.serial(
  'learns within a day’s limits also from reports read at the same time',
  async (t) => {
    const { client } = t.context;
    const now = Date.parse('2026-01-03T12:00:00Z');
    // (one message reported many times at once, each another copy: each
    //  feature three times that day)
    const results = await Promise.all(
      Array.from({ length: 30 }, (_, i) =>
        learnSpam(client, {
          id: `same-${i}`,
          party: `recipient:r${i}@example.org`,
          group: 'domain:test',
          features: new Uint32Array([7, 8, 9]),
          now
        })
      )
    );
    t.is(results.filter(Boolean).length, 3);
    t.deepEqual(await client.hgetall(getDayKey(now)), {
      7: '3',
      8: '3',
      9: '3',
      n: '3'
    });
    // (nor more features a day than the limit; and a feature given twice
    //  counts once)
    const { maxLearnedFeaturesPerDay } = config.arf;
    config.arf.maxLearnedFeaturesPerDay = 10;
    t.teardown(() => {
      config.arf.maxLearnedFeaturesPerDay = maxLearnedFeaturesPerDay;
    });
    const later = now + ms('1d');
    await Promise.all(
      Array.from({ length: 20 }, (_, i) =>
        learnSpam(client, {
          id: `many-${i}`,
          party: `recipient:m${i}@example.org`,
          group: 'domain:test',
          features: new Uint32Array([100 + i * 3, 100 + i * 3, 101 + i * 3]),
          now: later
        })
      )
    );
    const day = await client.hgetall(getDayKey(later));
    t.true(Object.keys(day).length - 1 <= 10);
    t.true(
      Object.entries(day).every(
        ([field, count]) => field === 'n' || count === '1'
      )
    );
  }
);

test.serial('learns at most a day’s limits', async (t) => {
  const { client } = t.context;
  const { maxLearnedPerDay, maxLearnedFeaturesPerDay } = config.arf;
  t.teardown(() => {
    config.arf.maxLearnedPerDay = maxLearnedPerDay;
    config.arf.maxLearnedFeaturesPerDay = maxLearnedFeaturesPerDay;
  });
  t.is(config.arf.maxLearnedPerFeaturePerDay, 3);
  const now = Date.parse('2026-01-02T12:00:00Z');
  const features = new Uint32Array([1, 2, 3]);
  config.arf.maxLearnedPerDay = 2;
  t.true(
    await learnSpam(client, {
      id: 'a',
      party: 'recipient:a@example.org',
      group: 'domain:test',
      features,
      now
    })
  );
  t.true(
    await learnSpam(client, {
      id: 'b',
      party: 'recipient:b@example.org',
      group: 'domain:test',
      features,
      now
    })
  );
  t.false(
    await learnSpam(client, {
      id: 'c',
      party: 'recipient:c@example.org',
      group: 'domain:test',
      features,
      now
    })
  );
  config.arf.maxLearnedPerDay = 100;
  config.arf.maxLearnedFeaturesPerDay = 5;
  // (features the day has already do not count toward its limit; one
  //  learned three times that day is not learned again)
  t.true(
    await learnSpam(client, {
      id: 'd',
      party: 'recipient:d@example.org',
      group: 'domain:test',
      features: new Uint32Array([1, 2, 3, 4, 5]),
      now
    })
  );
  t.false(
    await learnSpam(client, {
      id: 'e',
      party: 'recipient:e@example.org',
      group: 'domain:test',
      features: new Uint32Array([6]),
      now
    })
  );
  t.true(
    await learnSpam(client, {
      id: 'f',
      party: 'recipient:f@example.org',
      group: 'domain:test',
      features: new Uint32Array([1, 4]),
      now
    })
  );
  t.false(
    await learnSpam(client, {
      id: 'g',
      party: 'recipient:g@example.org',
      group: 'domain:test',
      features: new Uint32Array([1, 2, 3]),
      now
    })
  );
  t.deepEqual(await client.hgetall(getDayKey(now)), {
    1: '3',
    2: '3',
    3: '3',
    4: '2',
    5: '1',
    n: '4'
  });
  // (nothing, or not a list of feature hashes, is not learned)
  t.false(
    await learnSpam(client, {
      id: 'h',
      party: 'recipient:h@example.org',
      group: 'domain:test',
      features: new Uint32Array(),
      now
    })
  );
  t.false(
    await learnSpam(client, {
      id: 'i',
      party: 'recipient:i@example.org',
      group: 'domain:test',
      features: [1, 2],
      now
    })
  );
  t.false(
    await learnSpam(null, {
      id: 'j',
      party: 'recipient:j@example.org',
      group: 'domain:test',
      features,
      now
    })
  );
});

test.serial(
  'reports read at once on several servers pass neither the day’s limit nor each other: one being read is not read again, and one not read after all may be',
  async (t) => {
    const { client } = t.context;
    const countKey = `arf_reports:test-${randomUUID()}`;
    const tokens = new Map();
    const claim = async (rawKey) => {
      const token = `reading:${randomUUID()}`;
      tokens.set(rawKey, token);
      return Number(
        await client.eval(CLAIM, 2, countKey, rawKey, 3, 60_000, 60_000, token)
      );
    };

    const release = (rawKey, token = tokens.get(rawKey)) =>
      client.eval(RELEASE, 2, countKey, rawKey, token);
    const raws = Array.from(
      { length: 10 },
      () => `arf_report_raw:${randomUUID()}`
    );
    const claimed = await Promise.all(raws.map((raw) => claim(raw)));
    t.is(claimed.filter((value) => value === 1).length, 3);
    t.is(claimed.filter((value) => value === -1).length, 7);
    t.is(await client.get(countKey), '3');
    // (the same report at once: being read, so delivered rather than lost)
    const [first, second] = raws.filter((_, i) => claimed[i] === 1);
    t.is(await claim(first), -1);
    await release(second);
    t.is(await claim(first), -2);
    // (read: not read again)
    await client.set(first, 'read');
    t.is(await claim(first), 0);
    // (one given up is not counted, and may be read again; a release with
    //  another claim's token, e.g. one that expired, does nothing)
    t.is(await client.get(countKey), '2');
    t.is(await claim(second), 1);
    t.is(await release(second, 'reading:expired'), 0);
    t.is(await client.get(countKey), '3');
    t.is(await release(second), 1);
    t.is(await client.get(countKey), '2');
    // (one read whose handling failed after is let go by its token, and is
    //  read again if it is sent again; not by another's)
    t.is(await claim(second), 1);
    const token = tokens.get(second);
    t.is(Number(await client.eval(FINISH, 1, second, token, 60_000)), 1);
    t.is(await claim(second), -1);
    t.is(Number(await client.eval(FORGET, 1, second, 'reading:other')), 0);
    t.is(Number(await client.eval(FORGET, 1, second, token)), 1);
    t.is(await client.get(second), null);
  }
);

test.serial(
  'what was learned is read with each day added, a day before yesterday read once',
  async (t) => {
    const { client } = t.context;
    const now = Date.parse('2026-02-10T12:00:00Z');
    const day = (i) => getDayKey(now - i * ms('1d'));
    await client.hset(day(0), { n: '1', 5: '1', 9: '2' });
    await client.hset(day(1), { n: '2', 9: '1', 7: '3' });
    await client.hset(day(5), { n: '1', 5: '2', 4294967295: '1', x: '1' });
    let reads = 0;
    const counting = new Proxy(client, {
      get(target, name) {
        if (name === 'pipeline')
          return () => {
            const pipeline = target.pipeline();
            const { hgetall } = pipeline;
            pipeline.hgetall = (...args) => {
              reads++;
              return hgetall.apply(pipeline, args);
            };

            return pipeline;
          };

        const value = target[name];
        return typeof value === 'function' ? value.bind(target) : value;
      }
    });
    const first = await loadLearned(counting, 'v1', now);
    t.is(first.nspam, 4);
    t.deepEqual([...first.keys], [5, 7, 9, 4_294_967_295]);
    t.deepEqual([...first.spam], [3, 3, 3, 1]);
    t.is(reads, config.arf.learnDays);
    // (again: today and yesterday only, with what today learned since)
    reads = 0;
    await client.hincrby(day(0), '7', 1);
    const second = await loadLearned(counting, 'v2', now);
    t.is(reads, 2);
    t.deepEqual([...second.spam], [3, 4, 3, 1]);
    // (a day kept that was deleted since, e.g. to undo what was learned, is
    //  read again)
    reads = 0;
    await client.del(day(5));
    const third = await loadLearned(counting, 'v3', now);
    t.is(reads, 3);
    t.is(third.nspam, 3);
    t.deepEqual([...third.keys], [5, 7, 9]);
  }
);

test.serial(
  'one group learns only so many new features a day, so it cannot stop the others learning',
  async (t) => {
    const { client } = t.context;
    const { maxLearnedFeaturesPerGroupPerDay } = config.arf;
    t.teardown(() => {
      config.arf.maxLearnedFeaturesPerGroupPerDay =
        maxLearnedFeaturesPerGroupPerDay;
    });
    config.arf.maxLearnedFeaturesPerGroupPerDay = 3;
    const now = Date.parse('2026-01-05T12:00:00Z');
    const learn = (id, party, group, features) =>
      learnSpam(client, {
        id,
        party,
        group,
        features: new Uint32Array(features),
        now
      });
    // (as many new ones as it has room for)
    t.true(
      await learn('a', 'recipient:a@example.org', 'user:a', [10, 11, 12, 13])
    );
    t.false(await learn('b', 'recipient:b@example.org', 'user:a', [14]));
    // (but those learned already, and other groups' new ones)
    t.true(await learn('c', 'recipient:c@example.org', 'user:a', [10, 14]));
    t.true(await learn('d', 'recipient:d@example.org', 'user:b', [14, 15]));
    t.deepEqual(await client.hgetall(getDayKey(now)), {
      10: '2',
      11: '1',
      12: '1',
      14: '1',
      15: '1',
      n: '3'
    });
  }
);

test.serial(
  'learns only so many messages a day from one party and from one group, and none without one, once each by its Message-ID and features',
  async (t) => {
    const { client } = t.context;
    const now = Date.parse('2026-01-04T12:00:00Z');
    const party = 'destination:me@example.org';
    t.is(config.arf.maxLearnedPerPartyPerDay, 5);
    const results = [];
    for (let i = 0; i < 8; i++)
      results.push(
        await learnSpam(client, {
          id: `p-${i}`,
          party,
          group: 'domain:party-test',
          features: new Uint32Array([200 + i]),
          now
        })
      );
    t.deepEqual(results, [true, true, true, true, true, false, false, false]);
    // (another party, or the next day, is learned)
    t.true(
      await learnSpam(client, {
        id: 'p-8',
        party: 'destination:you@example.org',
        group: 'domain:party-test',
        features: new Uint32Array([300]),
        now
      })
    );
    t.true(
      await learnSpam(client, {
        id: 'p-9',
        party,
        group: 'domain:party-test',
        features: new Uint32Array([301]),
        now: now + ms('1d')
      })
    );
    // (nor more than so many a day from one group, whatever its parties)
    t.is(config.arf.maxLearnedPerGroupPerDay, 20);
    const { maxLearnedPerGroupPerDay } = config.arf;
    config.arf.maxLearnedPerGroupPerDay = 7;
    t.teardown(() => {
      config.arf.maxLearnedPerGroupPerDay = maxLearnedPerGroupPerDay;
    });
    t.true(
      await learnSpam(client, {
        id: 'g-1',
        party: 'destination:third@example.org',
        group: 'domain:party-test',
        features: new Uint32Array([500]),
        now
      })
    );
    t.false(
      await learnSpam(client, {
        id: 'g-2',
        party: 'destination:fourth@example.org',
        group: 'domain:party-test',
        features: new Uint32Array([501]),
        now
      })
    );
    config.arf.maxLearnedPerGroupPerDay = maxLearnedPerGroupPerDay;
    // (not without a party)
    t.false(
      await learnSpam(client, {
        id: 'p-10',
        features: new Uint32Array([302]),
        now
      })
    );
    // (a Message-ID learned with other features first does not keep this
    //  message from being learned; the same message is learned once)
    const later = now + ms('2d');
    const features = new Uint32Array([400, 401]);
    t.true(
      await learnSpam(client, {
        id: 'campaign@example.net',
        party: 'recipient:a@example.org',
        group: 'domain:party-test',
        features: new Uint32Array([999]),
        now: later
      })
    );
    t.true(
      await learnSpam(client, {
        id: 'campaign@example.net',
        party: 'recipient:b@example.org',
        group: 'domain:party-test',
        features,
        now: later
      })
    );
    t.false(
      await learnSpam(client, {
        id: 'campaign@example.net',
        party: 'recipient:c@example.org',
        group: 'domain:party-test',
        features,
        now: later
      })
    );
  }
);

test.serial(
  'reads no report that is not one, nor learns a report of headers only',
  async (t) => {
    await spamScanner.reset();
    t.is(
      await spamScanner.analyzeArf(Buffer.from(gibberish()), { learn: true }),
      null
    );
    const headersOnly = arf.create({
      feedbackType: 'abuse',
      userAgent: 'Feedback/1.0',
      from: `feedback@arf.${TRUTH_SOURCE}`,
      to: config.abuseEmail,
      originalMessage: Buffer.from(gibberish().split('\r\n\r\n')[0])
    });
    const analysis = await spamScanner.analyzeArf(headersOnly, { learn: true });
    t.is(analysis.features, null);
    t.false(analysis.hasBody);
    t.is(analysis.fields['message-id'].length, 1);
    // (more of a field than are read are none that can be trusted)
    const many = arf.create({
      feedbackType: 'abuse',
      userAgent: 'Feedback/1.0',
      from: `feedback@arf.${TRUTH_SOURCE}`,
      to: config.abuseEmail,
      originalMessage: Buffer.from(
        `${'X-Forward-Email-ID: 1\r\n'.repeat(8)}Subject: x\r\n\r\nbody\r\n`
      )
    });
    const read = await spamScanner.analyzeArf(many, { learn: false });
    t.true(read.fields['x-forward-email-id'].includes(null));
    t.is(read.features, null);
  }
);

test('keeps X-Forward-Email-ID only on mail from our own servers', (t) => {
  const make = () => {
    const values = new Map([
      ['x-forward-email-id', ['64b7f0c2a1b2c3d4e5f60718']],
      ['x-forward-email-sender', ['rfc822; forged']]
    ]);
    return {
      values,
      remove(name) {
        values.delete(name);
      },
      add(name, value) {
        const key = name.toLowerCase();
        values.set(key, [...(values.get(key) || []), value]);
      }
    };
  };

  const session = (resolvedRootClientHostname) => ({
    resolvedRootClientHostname,
    resolvedClientHostname: resolvedRootClientHostname
      ? `mx1.${resolvedRootClientHostname}`
      : undefined,
    remoteAddress: '192.0.2.1',
    envelope: { mailFrom: { address: 'a@b.example' } },
    // (the header object webhooks and logs get, see `helpers/get-headers`)
    headers: {
      'X-Forward-Email-ID': '64b7f0c2a1b2c3d4e5f60718',
      '\u000BX-Forward-Email-Report': 'forged',
      Subject: 'hello'
    }
  });

  // (required once Mongoose is set up, as the models it loads need it)
  const { updateMXHeaders } = require('#helpers/on-data-mx');
  const ours = make();
  updateMXHeaders(ours, session(env.WEB_HOST));
  t.deepEqual(ours.values.get('x-forward-email-id'), [
    '64b7f0c2a1b2c3d4e5f60718'
  ]);
  for (const root of ['test.com', undefined]) {
    const theirs = make();
    const s = session(root);
    updateMXHeaders(theirs, s);
    t.false(theirs.values.has('x-forward-email-id'));
    // (nor in the header object, by its name without white space around it)
    t.deepEqual(s.headers, { Subject: 'hello' });
    // (and X-Forward-Email-Sender is ours, once)
    t.is(theirs.values.get('x-forward-email-sender').length, 1);
  }
});

test.serial(
  'a field blocks only for a report of the copy it was made for, never for a disabled alias or a domain another account now verifies, and lifting a block lifts only the alias’s own',
  async (t) => {
    const { client } = t.context;
    const {
      blockFromReport,
      createHeader,
      isBlocked,
      unblock
    } = require('#helpers/arf-recipient-block');
    const { Aliases, Domains } = require('#models');
    const user = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    const domain = await t.context.domainFactory
      .withState({
        name: `test-${randomUUID()}.com`,
        members: [{ user: user._id, group: 'admin' }],
        plan: 'enhanced_protection',
        skip_verification: true
      })
      .create();
    await Domains.findByIdAndUpdate(domain._id, {
      $set: { has_txt_record: true }
    });
    const destination = `bob-${randomUUID()}@forward.example.org`;
    const alias = await t.context.aliasFactory
      .withState({
        name: 'bob',
        user: user._id,
        domain: domain._id,
        recipients: [destination]
      })
      .create();
    const recipient = `bob@${domain.name}`;
    let verification = domain.verification_record;
    const resolver = {
      async resolveTxt(name) {
        return name === domain.name
          ? [[`${config.paidPrefix}${verification}`]]
          : [];
      }
    };
    const sender = 'news@sender.example.net';
    const header = createHeader({
      recipient,
      destination,
      sender,
      messageId: '<copy-1@sender.example.net>'
    });
    // (a report of another message, or of one without its Message-ID: none)
    for (const messageId of ['<copy-2@sender.example.net>', '', undefined])
      t.false(
        await blockFromReport(client, resolver, header, { messageId }),
        `${String(messageId)}`
      );
    // (of the copy it was made for, with or without angle brackets)
    t.true(
      await blockFromReport(client, resolver, header, {
        messageId: ' copy-1@sender.example.net '
      })
    );
    const report = { recipient, destination, sender };
    t.true(await isBlocked(client, report, resolver));

    // (not while the alias is disabled)
    await Aliases.findByIdAndUpdate(alias._id, { $set: { is_enabled: false } });
    t.false(await isBlocked(client, report, resolver));
    await Aliases.findByIdAndUpdate(alias._id, { $set: { is_enabled: true } });
    t.true(await isBlocked(client, report, resolver));

    // (nor once the domain's DNS holds another account's verification record)
    verification = 'another-accounts-record';
    t.false(await isBlocked(client, report, resolver));
    verification = domain.verification_record;

    // (an enforced key that names another alias now is not lifted with this
    //  alias's record of it)
    // (KEYS takes the client's prefix as it is)
    const prefix = client.options.keyPrefix || '';
    const keys = await client.keys(`${prefix}arf_block:*`);
    t.is(keys.length, 1);
    const key = keys[0].slice(prefix.length);
    await client.set(key, '000000000000000000000000');
    t.true(await unblock(client, alias._id, destination, sender));
    t.is(await client.get(key), '000000000000000000000000');

    // (a Message-ID read with other white space or control characters, as
    //  a report's reader may read it, is the same one)
    const spaced = 'spaced@sender.example.net';
    t.true(
      await blockFromReport(
        client,
        resolver,
        createHeader({
          recipient,
          destination,
          sender: spaced,
          messageId: '<copy-3@sender.example.net>'
        }),
        { messageId: '<copy-3@sender.\texample.net\u0000>' }
      )
    );
    // (and a copy without one by a report with any, as a receiving server,
    //  e.g. Outlook.com, adds one of its own, or none, so a sender cannot
    //  leave it out to be never blocked)
    const without = 'without@sender.example.net';
    const bare = createHeader({ recipient, destination, sender: without });
    t.truthy(bare);
    t.true(
      await blockFromReport(client, resolver, bare, {
        messageId: '<added-by-receiver@outlook.example>'
      })
    );
    const none = 'none@sender.example.net';
    t.true(
      await blockFromReport(
        client,
        resolver,
        createHeader({ recipient, destination, sender: none }),
        { messageId: '' }
      )
    );
  }
);

test.serial(
  'reads only an X-Forward-Email-Report field we made, and blocks within limits',
  async (t) => {
    const { client } = t.context;
    const {
      getAuthenticatedSender,
      hashMessageId,
      isBlocked,
      listBlocks,
      parseHeader,
      unblock
    } = require('#helpers/arf-recipient-block');
    const { Domains } = require('#models');

    // an alias on a verified paid domain, forwarding to bob
    const user = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    const domain = await t.context.domainFactory
      .withState({
        name: `test-${randomUUID()}.com`,
        members: [{ user: user._id, group: 'admin' }],
        plan: 'enhanced_protection',
        skip_verification: true
      })
      .create();
    await Domains.findByIdAndUpdate(domain._id, {
      $set: { has_txt_record: true }
    });
    const destination = `bob-${randomUUID()}@forward.example.org`;
    const alias = await t.context.aliasFactory
      .withState({
        name: 'bob',
        user: user._id,
        domain: domain._id,
        recipients: [destination]
      })
      .create();
    const recipient = `bob@${domain.name}`;
    // (its DNS holds its verification record, as the MX server reads it)
    const resolver = {
      async resolveTxt(name) {
        return name === domain.name
          ? [[`${config.paidPrefix}${domain.verification_record}`]]
          : [];
      }
    };

    // another account that added the same domain name, unverified, with an
    // alias of the same name forwarding to the same address
    const impostor = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    const copy = await t.context.domainFactory
      .withState({
        name: domain.name,
        members: [{ user: impostor._id, group: 'admin' }],
        plan: 'enhanced_protection',
        skip_verification: true
      })
      .create();
    await Domains.findByIdAndUpdate(copy._id, {
      $set: { has_txt_record: true }
    });
    const copyAlias = await t.context.aliasFactory
      .withState({
        name: 'bob',
        user: impostor._id,
        domain: copy._id,
        recipients: [destination]
      })
      .create();

    const header = makeHeader({
      recipient,
      destination,
      sender: 'News@Sender.example.net'
    });
    // (it names neither the alias, the forwarding address nor the sender)
    for (const value of [domain.name, 'forward.example.org', 'sender.example'])
      t.false(header.toLowerCase().includes(value));
    t.deepEqual(parseHeader(header), {
      recipient,
      destination,
      sender: 'news@sender.example.net',
      message: hashMessageId(COPY)
    });

    // (changed, folded, too old, or made for something else, it is none)
    t.is(parseHeader(`${header.slice(0, -2)}AA`), null);
    t.is(
      parseHeader(header.replace(/^(.{20})/, '$1\r\n ')).sender,
      'news@sender.example.net'
    );
    t.is(parseHeader(header, Date.now() + config.arf.maxAge + 1000), null);
    t.is(parseHeader(header, Date.now() - ms('2h')), null);
    const { encrypt } = require('#helpers/encrypt-decrypt');
    t.is(
      parseHeader(
        encrypt(
          JSON.stringify({
            r: recipient,
            d: destination,
            s: 'a@b.example',
            t: Date.now()
          })
        )
      ),
      null
    );
    t.is(parseHeader(''), null);
    t.is(parseHeader(null), null);

    // (only a sender that passed DMARC, on the domain it passed for or a
    //  subdomain of it)
    t.is(
      getAuthenticatedSender({
        originalFromAddress: 'A@B.example',
        dmarc: { status: { result: 'pass', header: { from: 'b.example' } } }
      }),
      'a@b.example'
    );
    t.is(
      getAuthenticatedSender({
        originalFromAddress: 'a@mail.b.example',
        dmarc: { domain: 'B.example', status: { result: 'pass' } }
      }),
      'a@mail.b.example'
    );
    // (not an address another parser read from the field than the one DMARC
    //  passed for)
    t.is(
      getAuthenticatedSender({
        originalFromAddress: 'victim@victim.example',
        dmarc: { status: { result: 'pass', header: { from: 'evil.example' } } }
      }),
      null
    );
    t.is(
      getAuthenticatedSender({
        originalFromAddress: 'a@b.example',
        dmarc: { status: { result: 'pass' } }
      }),
      null
    );
    t.is(
      getAuthenticatedSender({
        originalFromAddress: 'a@b.example',
        dmarc: { status: { result: 'fail' } }
      }),
      null
    );
    t.is(getAuthenticatedSender({}), null);

    // (only for an alias that forwards to the address: not a catch-all, nor
    //  an address it does not forward to, nor one on another domain)
    for (const [to, at] of [
      [`*@${domain.name}`, destination],
      [recipient, 'other@forward.example.org'],
      [`bob@other-${randomUUID()}.com`, destination]
    ])
      t.false(
        await blockCopy(
          client,
          resolver,
          makeHeader({
            recipient: to,
            destination: at,
            sender: 'x@y.example'
          })
        )
      );

    const { maxBlocksPerAliasPerDay } = config.arf;
    config.arf.maxBlocksPerAliasPerDay = 2;
    t.teardown(() => {
      config.arf.maxBlocksPerAliasPerDay = maxBlocksPerAliasPerDay;
    });
    const block = (sender) =>
      blockCopy(
        client,
        resolver,
        makeHeader({ recipient, destination, sender })
      );
    t.true(await block('news@sender.example.net'));
    // (blocked again, it is only kept longer)
    t.true(await block('news@sender.example.net'));
    t.true(await block('b@c.example'));
    t.false(await block('c@d.example'));
    t.true(
      await isBlocked(client, {
        recipient,
        destination,
        sender: 'news@sender.example.net'
      })
    );
    t.false(
      await isBlocked(client, { recipient, destination, sender: 'c@d.example' })
    );
    // (mail to another alias forwarded to the same address is not blocked)
    t.false(
      await isBlocked(client, {
        recipient: `carol@${domain.name}`,
        destination,
        sender: 'b@c.example'
      })
    );
    const listed = await listBlocks(client, alias._id, recipient);
    t.deepEqual(listed.map((b) => b.sender).sort(), [
      'b@c.example',
      'news@sender.example.net'
    ]);
    // (listed for no other alias: not the impostor's either)
    t.deepEqual(await listBlocks(client, randomUUID(), recipient), []);
    t.deepEqual(await listBlocks(client, copyAlias._id, recipient), []);
    // (and without the verification record in its DNS, or with two, none)
    t.false(
      await blockCopy(
        client,
        { resolveTxt: async () => [] },
        makeHeader({ recipient, destination, sender: 'g@h.example' })
      )
    );
    t.false(
      await blockCopy(
        client,
        {
          resolveTxt: async () => [
            [`${config.paidPrefix}${domain.verification_record}`],
            [`${config.paidPrefix}${copy.verification_record}`]
          ]
        },
        makeHeader({ recipient, destination, sender: 'g@h.example' })
      )
    );

    t.true(await unblock(client, alias._id, destination, 'b@c.example'));
    t.false(await unblock(client, alias._id, destination, 'b@c.example'));
    // (nor one a report made again as it was being lifted: it stays, and is
    //  not said to be lifted)
    const [remade] = await listBlocks(client, alias._id, recipient);
    t.truthy(remade);
    const racing = Object.create(client);
    racing.eval = async (...args) => {
      await client.hset(args[2], args[4], 'made again');
      return client.eval(...args);
    };

    t.false(
      await unblock(racing, alias._id, remade.destination, remade.sender)
    );
    t.false(
      await isBlocked(client, { recipient, destination, sender: 'b@c.example' })
    );

    // (blocks that have ended do not count toward an alias's limit)
    const { maxBlocksPerAlias } = config.arf;
    config.arf.maxBlocksPerAlias = 1;
    config.arf.maxBlocksPerAliasPerDay = 100;
    t.teardown(() => {
      config.arf.maxBlocksPerAlias = maxBlocksPerAlias;
    });
    const later = Date.now() + config.arf.blockDuration + 1000;
    t.true(
      await blockCopy(
        client,
        resolver,
        makeHeader({
          recipient,
          destination,
          sender: 'e@f.example',
          now: later
        }),
        { now: later }
      )
    );

    // (and reports read at once do not pass it: room for two more, of ten,
    //  also with each read of the alias's blocks answered late, as it may
    //  be by a Redis that several MX servers ask at once)
    config.arf.maxBlocksPerAlias = 3;
    const slow = new Proxy(client, {
      get(target, name) {
        if (name === 'hgetall')
          return async (...args) => {
            const value = await target.hgetall(...args);
            await setTimeout(50);
            return value;
          };

        const value = target[name];
        return typeof value === 'function' ? value.bind(target) : value;
      }
    });
    const made = await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        blockCopy(
          slow,
          resolver,
          makeHeader({
            recipient,
            destination,
            sender: `at-once-${i}@f.example`,
            now: later
          }),
          { now: later }
        )
      )
    );
    t.is(made.filter(Boolean).length, 2);

    // (a block that cannot be read is no block)
    t.false(
      await isBlocked(
        {
          get() {
            throw new Error('down');
          }
        },
        { recipient, destination, sender: 'news@sender.example.net' }
      )
    );
  }
);

test.serial(
  'blocks an alias by the address the MX server finds it by, only while its owner can see and lift the block, within limits for each forwarding address',
  async (t) => {
    const { client } = t.context;
    const punycode = require('node:punycode');
    const {
      isBlocked,
      listBlocks,
      parseHeader
    } = require('#helpers/arf-recipient-block');
    const { Aliases, Domains } = require('#models');

    // an alias on a verified paid domain with a name beyond ASCII, forwarding
    // to two addresses (one of them on a domain beyond ASCII too)
    const user = await t.context.userFactory
      .withState({ plan: 'enhanced_protection' })
      .create();
    const name = `bücher-${randomUUID().slice(0, 8)}.com`;
    const domain = await t.context.domainFactory
      .withState({
        name,
        members: [{ user: user._id, group: 'admin' }],
        plan: 'enhanced_protection',
        skip_verification: true
      })
      .create();
    await Domains.findByIdAndUpdate(domain._id, {
      $set: { has_txt_record: true }
    });
    const ascii = punycode.toASCII(domain.name);
    const destination = `bob@straße-${randomUUID().slice(0, 8)}.example`;
    const other = `bob-${randomUUID()}@forward.example.org`;
    const alias = await t.context.aliasFactory
      .withState({
        name: 'bob',
        user: user._id,
        domain: domain._id,
        recipients: [destination, other]
      })
      .create();
    const resolver = {
      async resolveTxt(value) {
        return value === ascii
          ? [[`${config.paidPrefix}${domain.verification_record}`]]
          : [];
      }
    };

    // mail sent to "Bob+news@" its ASCII name, forwarded to the address
    // written in ASCII, is a block of the alias, listed on its page, and
    // enforced for mail to it however it is written
    const header = makeHeader({
      recipient: `Bob+news@${ascii}`,
      destination: `bob@${punycode.toASCII(destination.split('@')[1])}`,
      sender: 'a@sender.example'
    });
    t.true(await blockCopy(client, resolver, header));
    const listed = await listBlocks(client, alias._id, `bob@${domain.name}`);
    t.deepEqual(
      listed.map((block) => block.sender),
      ['a@sender.example']
    );
    for (const recipient of [
      `bob@${domain.name}`,
      `BOB+other@${ascii}`,
      `bob@${ascii}`
    ])
      t.true(
        await isBlocked(client, {
          recipient,
          destination,
          sender: 'a@sender.example'
        }),
        `${recipient}`
      );
    t.false(
      await isBlocked(client, {
        recipient: `bob@${domain.name}`,
        destination: other,
        sender: 'a@sender.example'
      })
    );

    // not enforced once the alias forwards there no more, is renamed (so
    // another alias of its old name is not blocked), or its domain is on
    // the free plan; enforced again once it is as it was
    const blocked = () =>
      isBlocked(client, {
        recipient: `bob@${domain.name}`,
        destination,
        sender: 'a@sender.example'
      });
    await Aliases.findByIdAndUpdate(alias._id, {
      $set: { recipients: [other] }
    });
    t.false(await blocked());
    await Aliases.findByIdAndUpdate(alias._id, {
      $set: { recipients: [destination, other], name: 'robert' }
    });
    t.false(await blocked());
    await Aliases.findByIdAndUpdate(alias._id, { $set: { name: 'bob' } });
    t.true(await blocked());
    await Domains.findByIdAndUpdate(domain._id, { $set: { plan: 'free' } });
    t.false(await blocked());
    await Domains.findByIdAndUpdate(domain._id, {
      $set: { plan: 'enhanced_protection' }
    });
    t.true(await blocked());
    // (nor without the alias's own record of it)
    await client.del(`arf_blocks:${alias._id}`);
    t.false(await blocked());

    // (nor when that record is of the alias under another name: one made
    //  while it was renamed, for the same address and sender, replaces it)
    t.true(await blockCopy(client, resolver, header));
    t.true(await blocked());
    await Aliases.findByIdAndUpdate(alias._id, { $set: { name: 'alice' } });
    t.true(
      await blockCopy(
        client,
        resolver,
        makeHeader({
          recipient: `alice@${ascii}`,
          destination,
          sender: 'a@sender.example'
        })
      )
    );
    await Aliases.findByIdAndUpdate(alias._id, { $set: { name: 'bob' } });
    t.false(await blocked());
    t.deepEqual(await listBlocks(client, alias._id, `bob@${domain.name}`), []);
    await client.del(`arf_blocks:${alias._id}`);

    // (so many a day for each forwarding address: one does not use up
    //  another's)
    const { maxBlocksPerAliasPerDay } = config.arf;
    config.arf.maxBlocksPerAliasPerDay = 1;
    t.teardown(() => {
      config.arf.maxBlocksPerAliasPerDay = maxBlocksPerAliasPerDay;
    });
    const block = (to, sender) =>
      blockCopy(
        client,
        resolver,
        makeHeader({ recipient: `bob@${ascii}`, destination: to, sender })
      );
    t.false(await block(destination, 'b@sender.example'));
    t.true(await block(other, 'b@sender.example'));
    t.false(await block(other, 'c@sender.example'));

    // a field too long to fold within a line is not made
    t.is(
      makeHeader({
        recipient: `${'a'.repeat(64)}@${'b'.repeat(60)}.${'c'.repeat(
          60
        )}.${'d'.repeat(60)}.com`,
        destination: `${'e'.repeat(64)}@${'f'.repeat(60)}.${'g'.repeat(
          60
        )}.${'h'.repeat(60)}.com`,
        sender: `${'i'.repeat(64)}@${'j'.repeat(60)}.${'k'.repeat(60)}.com`
      }),
      null
    );

    // each period's field has a key of its own, named by the period: one
    // read with another period's name is none
    const now = Date.now();
    const field = makeHeader({
      recipient: `bob@${ascii}`,
      destination: other,
      sender: 'd@sender.example',
      now
    });
    t.truthy(parseHeader(field, now));
    const [period, rest] = field.split('.');
    const previous = (Number.parseInt(period, 36) - 1).toString(36);
    t.is(parseHeader(`${previous}.${rest}`, now), null);
    t.is(parseHeader(rest, now), null);
    t.not(
      makeHeader({
        recipient: `bob@${ascii}`,
        destination: other,
        sender: 'd@sender.example',
        now: now + ms('31d')
      }).split('.')[0],
      period
    );
  }
);
