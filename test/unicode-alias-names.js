/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Aliases with a Unicode local part (e.g. "fællestest") on a paid domain:
// mail to them, signing in with them, and the aliases made for when local
// parts were converted to punycode ("xn--fllestest-g3a"), see #619.
//

const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const punycode = require('node:punycode');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('./utils');

const config = require('#config');
const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Emails = require('#models/emails');
const getForwardingConfiguration = require('#helpers/get-forwarding-configuration');

const FAELLES = 'fællestest';
const FAELLES_PUNYCODE = 'xn--fllestest-g3a';
const BLA_NFC = 'blåtest'.normalize('NFC');
const BLA_NFD = 'blåtest'.normalize('NFD');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  t.context.user = await user.save();

  t.context.domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: t.context.resolver,
      has_smtp: true,
      ignore_mx_check: true
    })
    .create();

  // spoof dns records
  const map = new Map();
  map.set(
    `txt:${t.context.domain.name}`,
    t.context.resolver.spoofPacket(
      t.context.domain.name,
      'TXT',
      [`${config.paidPrefix}${t.context.domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await t.context.resolver.options.cache.mset(map);
});

test.afterEach.always(utils.teardownApiServer);

async function createAlias(t, name, recipient, extra = {}) {
  return t.context.aliasFactory
    .withState({
      name,
      user: t.context.user._id,
      domain: t.context.domain._id,
      recipients: [recipient],
      ...extra
    })
    .create();
}

// (an alias saved as it is in the database, e.g. before names were
// normalized, or one named in punycode next to its Unicode twin, which can
// no longer be made)
async function insertAliasAsSaved(t, name, recipient, extra = {}) {
  const alias = await createAlias(t, `old-${randomUUID()}`, recipient, extra);
  await Aliases.collection.updateOne({ _id: alias._id }, { $set: { name } });
  return Aliases.findById(alias._id);
}

// (whether the domain has a catch-all or regex alias decides how aliases are
// looked up: by name, or all of them)
async function setLookupByName(t, byName) {
  await Domains.collection.updateOne(
    { _id: t.context.domain._id },
    { $set: { has_catchall: !byName, has_regex: !byName } }
  );
}

function lookup(t, username) {
  return getForwardingConfiguration({
    verificationRecord: t.context.domain.verification_record,
    domainName: t.context.domain.name,
    username,
    client: t.context.client
  });
}

for (const byName of [true, false]) {
  const how = byName ? 'by name' : 'among all aliases';

  test(`mail to a Unicode alias is mapped to it (${how})`, async (t) => {
    await setLookupByName(t, byName);
    await createAlias(t, FAELLES, 'exact@example.net');
    for (const username of [FAELLES, FAELLES_PUNYCODE]) {
      const body = await lookup(t, username);
      t.deepEqual(
        body.mapping,
        [`${FAELLES}:exact@example.net`],
        `${username}`
      );
    }
  });

  test(`an alias named in punycode still gets the mail (${how})`, async (t) => {
    await setLookupByName(t, byName);
    await createAlias(t, FAELLES_PUNYCODE, 'legacy@example.net');
    const body = await lookup(t, FAELLES);
    t.deepEqual(body.mapping, [`${FAELLES_PUNYCODE}:legacy@example.net`]);
  });

  test(`the alias named as the mail was sent is used (${how})`, async (t) => {
    await setLookupByName(t, byName);
    await createAlias(t, FAELLES, 'exact@example.net');
    await insertAliasAsSaved(t, FAELLES_PUNYCODE, 'legacy@example.net');
    const unicode = await lookup(t, FAELLES);
    t.deepEqual(unicode.mapping, [`${FAELLES}:exact@example.net`]);
    const legacy = await lookup(t, FAELLES_PUNYCODE);
    t.deepEqual(legacy.mapping, [`${FAELLES_PUNYCODE}:legacy@example.net`]);
  });

  test(`a name saved decomposed gets mail sent composed (${how})`, async (t) => {
    await setLookupByName(t, byName);
    await insertAliasAsSaved(t, BLA_NFD, 'nfd@example.net');
    const body = await lookup(t, BLA_NFC);
    t.deepEqual(body.mapping, [`${BLA_NFD}:nfd@example.net`]);
  });
}

test('a regular expression is matched against the Unicode name', async (t) => {
  await createAlias(t, '*', 'catchall@example.net');
  await createAlias(t, '/^.*llestest$/', 'regex@example.net');
  await setLookupByName(t, false);
  const body = await lookup(t, FAELLES);
  t.true(body.mapping.includes('/^.*llestest$/:regex@example.net'));
});

test('an alias saved next to its other form can still be saved', async (t) => {
  await createAlias(t, FAELLES, 'a@example.net');
  const legacy = await insertAliasAsSaved(t, FAELLES_PUNYCODE, 'b@example.net');
  legacy.description = 'changed';
  await legacy.save();
  const saved = await Aliases.findById(legacy._id).lean();
  t.is(saved.name, FAELLES_PUNYCODE);
  t.is(saved.description, 'changed');
});

test('an alias signs in with its name in either form', async (t) => {
  const alias = await createAlias(t, FAELLES, t.context.user.email, {
    has_imap: true
  });
  const pass = await alias.createToken();
  await alias.save();

  // (a script made signed in as one form is listed signed in as the others)
  const auth = (name) =>
    `Basic ${Buffer.from(`${name}@${t.context.domain.name}:${pass}`).toString(
      'base64'
    )}`;
  const created = await t.context.api
    .post('/v1/sieve-scripts')
    .set('Authorization', auth(FAELLES))
    .send({ name: 'unicode', content: 'keep;' });
  t.is(created.status, 200);

  for (const name of [
    FAELLES,
    FAELLES.toUpperCase(),
    FAELLES_PUNYCODE,
    `${FAELLES}+tag`
  ]) {
    const res = await t.context.api
      .get('/v1/sieve-scripts')
      .set('Authorization', auth(name));
    t.is(res.status, 200, `${name}`);
    t.deepEqual(
      res.body.map((script) => script.name),
      ['unicode'],
      `${name}`
    );
  }
});

//
// A name is matched as text (a name starting with "$" was read by MongoDB as
// a field path or a variable, and every sign-in failed for now)
//
test('an alias whose name starts with "$" signs in', async (t) => {
  const alias = await createAlias(t, '$$money', t.context.user.email, {
    has_imap: true
  });
  const pass = await alias.createToken();
  await alias.save();

  const status = async (name, pass) => {
    const res = await t.context.api
      .get('/v1/sieve-scripts')
      .set(
        'Authorization',
        `Basic ${Buffer.from(
          `${name}@${t.context.domain.name}:${pass}`
        ).toString('base64')}`
      );
    return res.status;
  };

  t.is(await status('$$money', pass), 200);
  // (and a name that is not an alias is refused, not failed)
  t.is(await status('$', pass), 401);
});

test('the alias signed in with is the one named as given', async (t) => {
  const unicode = await createAlias(t, FAELLES, t.context.user.email, {
    has_imap: true
  });
  const legacy = await insertAliasAsSaved(
    t,
    FAELLES_PUNYCODE,
    t.context.user.email,
    { has_imap: true }
  );
  const unicodePass = await unicode.createToken();
  await unicode.save();
  const legacyPass = await legacy.createToken();
  await legacy.save();

  const status = async (name, pass) => {
    const res = await t.context.api
      .get('/v1/sieve-scripts')
      .set(
        'Authorization',
        `Basic ${Buffer.from(
          `${name}@${t.context.domain.name}:${pass}`
        ).toString('base64')}`
      );
    return res.status;
  };

  t.is(await status(FAELLES, unicodePass), 200);
  t.is(await status(FAELLES_PUNYCODE, legacyPass), 200);
  // (each password is for its own alias)
  t.not(await status(FAELLES, legacyPass), 200);
  t.not(await status(FAELLES_PUNYCODE, unicodePass), 200);
});

test('a member sends as their Unicode alias with its name in either form', async (t) => {
  const member = await t.context.userFactory.withState({}).create();
  await Domains.collection.updateOne(
    { _id: t.context.domain._id },
    { $push: { members: { user: member._id, group: 'user' } } }
  );
  // (a name without a reserved word, which only an admin may use)
  const name = 'blåbær';
  await createAlias(t, name, member.email, { user: member._id });

  for (const from of [
    name,
    name.normalize('NFD'),
    name.toUpperCase(),
    punycode.toASCII(name),
    `${name}+tag`
  ]) {
    const email = await Emails.queue({
      message: {
        from: `${from}@${t.context.domain.name}`,
        to: 'someone@example.net',
        subject: 'test',
        text: 'test'
      },
      user: member._id
    });
    t.is(email.status, 'queued', `${from}`);
  }

  // (and not as an alias of someone else)
  const err = await t.throwsAsync(
    Emails.queue({
      message: {
        from: `other@${t.context.domain.name}`,
        to: 'someone@example.net',
        subject: 'test',
        text: 'test'
      },
      user: member._id
    })
  );
  t.regex(err.message, /alias does not exist/i);
});

//
// Two aliases named with the two forms of one name (made before that was
// refused) are two aliases: one may not send From the other.
//
test('a member cannot send From the other form of their alias', async (t) => {
  const member = await t.context.userFactory.withState({}).create();
  await Domains.collection.updateOne(
    { _id: t.context.domain._id },
    { $push: { members: { user: member._id, group: 'user' } } }
  );
  const name = 'blåbær';
  const ascii = punycode.toASCII(name);
  // (the Unicode one is the admin's, the punycode one the member's)
  await createAlias(t, name, t.context.user.email);
  await insertAliasAsSaved(t, ascii, member.email, { user: member._id });

  const send = (from, envelopeFrom = from) =>
    Emails.queue({
      message: {
        from: `${from}@${t.context.domain.name}`,
        envelope: {
          from: `${envelopeFrom}@${t.context.domain.name}`,
          to: ['someone@example.net']
        },
        to: 'someone@example.net',
        subject: 'test',
        text: 'test'
      },
      user: member._id
    });

  const email = await send(ascii);
  t.is(email.status, 'queued');
  // (the admin's alias, as the envelope sender or in the From header)
  await t.throwsAsync(send(name));
  await t.throwsAsync(send(name, ascii));
  await t.throwsAsync(send(ascii, name));
});

//
// Names are not normalized when saved, so two users can each have an alias
// named the same composed (NFC) and decomposed (NFD): each one sends as
// their own, and neither as the other's.
//
test('of two aliases named composed and decomposed, each sends as its own', async (t) => {
  const members = [];
  for (let i = 0; i < 2; i++) {
    const member = await t.context.userFactory.withState({}).create();
    await Domains.collection.updateOne(
      { _id: t.context.domain._id },
      { $push: { members: { user: member._id, group: 'user' } } }
    );
    members.push(member);
  }

  const nfc = 'blåbær'.normalize('NFC');
  const nfd = 'blåbær'.normalize('NFD');
  await insertAliasAsSaved(t, nfc, members[0].email, { user: members[0]._id });
  await insertAliasAsSaved(t, nfd, members[1].email, { user: members[1]._id });

  const send = (from, member) =>
    Emails.queue({
      message: {
        from: `${from}@${t.context.domain.name}`,
        to: 'someone@example.net',
        subject: 'test',
        text: 'test'
      },
      user: member._id
    });

  // (whichever of the two the database gives first)
  for (let i = 0; i < 3; i++) {
    const own = await send(nfc, members[0]);
    t.is(own.status, 'queued');
    const other = await send(nfd, members[1]);
    t.is(other.status, 'queued');
    await t.throwsAsync(send(nfd, members[0]));
    await t.throwsAsync(send(nfc, members[1]));
  }
});
