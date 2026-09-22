/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A token without a salt or a hash can never validate a password, and the
// schema's `required` does not prevent one from being saved: Mongoose skips
// `required` for a path left out of the query projection, and the salt and
// hash are `select: false`.  helpers/token-guard.js closes that gap for
// every write that goes through `save()`; these tests write tokens the way
// the code (and the bugs of the past) did and check what reaches MongoDB.
//

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const { isUsableToken, usableTokens } = require('#helpers/token-guard');

const SECRETS = '+tokens.description +tokens.hash +tokens.salt';

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);

async function createUserDomainAlias(t, tokens = 2) {
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
  await user.save();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      has_smtp: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();
  for (let i = 0; i < tokens; i++) await alias.createToken(`token ${i}`);
  await alias.save();
  return { user, domain, alias };
}

// the tokens as stored, reduced to what matters
async function storedTokens(Model, _id, path = 'tokens') {
  const raw = await Model.collection.findOne({ _id });
  return raw[path].map((token) => ({
    _id: token._id.toString(),
    description: token.description,
    usable: isUsableToken(token)
  }));
}

test('isUsableToken and usableTokens', (t) => {
  t.true(isUsableToken({ salt: 's', hash: 'h' }));
  t.false(isUsableToken({ salt: 's' }));
  t.false(isUsableToken({ hash: 'h' }));
  t.false(isUsableToken({ salt: '', hash: 'h' }));
  t.false(isUsableToken({ salt: 's', hash: ' ' }));
  t.false(isUsableToken({ salt: 1, hash: 'h' }));
  t.false(isUsableToken(null));
  t.false(isUsableToken());
  t.deepEqual(usableTokens([{ salt: 's', hash: 'h' }, {}, null]), [
    { salt: 's', hash: 'h' }
  ]);
  t.deepEqual(usableTokens(), []);
});

test('a new token without a salt or a hash is never saved', async (t) => {
  const { alias: created } = await createUserDomainAlias(t);
  const before = await storedTokens(Aliases, created._id);

  // pushed to an alias loaded with the default projection (where
  // `required` would not fire)
  const alias = await Aliases.findById(created._id).exec();
  alias.tokens.push({ description: 'no secrets' });
  await t.throwsAsync(alias.save(), {
    message: /^tokens: a token without a salt or a hash/
  });
  t.deepEqual(await storedTokens(Aliases, created._id), before);

  // on a brand new alias
  await t.throwsAsync(
    new Aliases({
      user: created.user,
      domain: created.domain,
      name: 'guarded',
      tokens: [{ description: 'no secrets', salt: 'salt' }]
    }).save(),
    { message: /^tokens: a token without a salt or a hash/ }
  );
});

test('the snapshot of a rotation cannot be saved without the secrets', async (t) => {
  const { alias: created } = await createUserDomainAlias(t);
  const alias = await Aliases.findById(created._id).select(SECRETS).exec();

  // how rollbacks of the old rotation code lost every password: the
  // snapshot was built with `toObject()`, which hides the salt and the hash
  alias.is_rekey = true;
  alias.rekey_started_at = new Date();
  alias.rekey_previous_tokens = alias.tokens.map((token) => token.toObject());
  await t.throwsAsync(alias.save(), {
    message: /^rekey_previous_tokens: a token without a salt or a hash/
  });
  const raw = await Aliases.collection.findOne({ _id: created._id });
  t.not(raw.is_rekey, true);
  t.deepEqual(raw.rekey_previous_tokens, []);

  // copied field by field the snapshot is complete, and is saved
  alias.rekey_previous_tokens = alias.tokens.map((token) => ({
    _id: token._id,
    description: token.description,
    salt: token.salt,
    hash: token.hash
  }));
  await alias.save();
  const snapshot = await storedTokens(
    Aliases,
    created._id,
    'rekey_previous_tokens'
  );
  t.is(snapshot.length, 2);
  t.true(snapshot.every((token) => token.usable));
});

test('tokens loaded without their secrets cannot be replaced as a whole', async (t) => {
  const { alias: created } = await createUserDomainAlias(t);
  const before = await storedTokens(Aliases, created._id);

  // (this write would have kept the first token without its secrets)
  const alias = await Aliases.findById(created._id).exec();
  alias.tokens = alias.tokens.filter((token, i) => i === 0);
  await t.throwsAsync(alias.save(), {
    message:
      /^tokens: the tokens cannot be replaced without their salt and hash/
  });
  t.deepEqual(await storedTokens(Aliases, created._id), before);

  const spliced = await Aliases.findById(created._id).exec();
  spliced.tokens.splice(0, 1);
  await t.throwsAsync(spliced.save(), {
    message:
      /^tokens: the tokens cannot be replaced without their salt and hash/
  });
  t.deepEqual(await storedTokens(Aliases, created._id), before);

  // with the secrets selected the same write keeps them
  const complete = await Aliases.findById(created._id).select(SECRETS).exec();
  complete.tokens = complete.tokens.filter((token, i) => i === 0);
  await complete.save();
  t.deepEqual(await storedTokens(Aliases, created._id), [before[0]]);
});

test('a push leaves the other tokens intact and is allowed', async (t) => {
  const { alias: created } = await createUserDomainAlias(t);
  const before = await storedTokens(Aliases, created._id);

  // a third password, added to an alias loaded with the default projection
  const alias = await Aliases.findById(created._id).exec();
  await alias.createToken('token 2');
  await alias.save();
  const pushed = await storedTokens(Aliases, created._id);
  t.deepEqual(pushed.slice(0, 2), before);
  t.is(pushed.length, 3);
  t.true(pushed[2].usable);

  // and an unrelated change of the alias
  const unrelated = await Aliases.findById(created._id).exec();
  unrelated.description = 'changed';
  await unrelated.save();
  t.deepEqual(await storedTokens(Aliases, created._id), pushed);
});

test('a pull is only allowed when it leaves the other tokens intact', async (t) => {
  const { alias: created } = await createUserDomainAlias(t, 3);
  const before = await storedTokens(Aliases, created._id);

  // Mongoose writes a pull that re-indexes the tokens after the pulled one
  // as a whole-array write: without the secrets loaded the others would
  // lose them
  const pulled = await Aliases.findById(created._id).exec();
  pulled.tokens.pull(before[1]._id);
  await t.throwsAsync(pulled.save(), {
    message:
      /^tokens: the tokens cannot be replaced without their salt and hash/
  });
  t.deepEqual(await storedTokens(Aliases, created._id), before);

  // with the secrets selected (as the catch-all password controllers do)
  const complete = await Aliases.findById(created._id).select(SECRETS).exec();
  complete.tokens.pull(before[1]._id);
  await complete.save();
  t.deepEqual(await storedTokens(Aliases, created._id), [before[0], before[2]]);
});

test('a password rotation replaces the tokens as the controller does', async (t) => {
  const { alias: created } = await createUserDomainAlias(t);
  const alias = await Aliases.findById(created._id).select(SECRETS).exec();
  const snapshot = alias.tokens.map((token) => ({
    _id: token._id,
    description: token.description,
    salt: token.salt,
    hash: token.hash
  }));

  alias.tokens = [];
  await alias.createToken('replacement');
  alias.is_rekey = true;
  alias.rekey_started_at = new Date();
  alias.rekey_previous_tokens = snapshot;
  await alias.save();

  const tokens = await storedTokens(Aliases, created._id);
  t.is(tokens.length, 1);
  t.is(tokens[0].description, 'replacement');
  t.true(tokens[0].usable);
  const stored = await storedTokens(
    Aliases,
    created._id,
    'rekey_previous_tokens'
  );
  t.is(stored.length, 2);
});

test('an alias that already carries an unusable token can still be saved', async (t) => {
  const { alias: created } = await createUserDomainAlias(t, 1);
  // the legacy damage
  await Aliases.collection.updateOne(
    { _id: created._id },
    { $unset: { 'tokens.0.salt': 1, 'tokens.0.hash': 1 } }
  );
  const before = await storedTokens(Aliases, created._id);
  t.false(before[0].usable);

  // an unrelated change
  const alias = await Aliases.findById(created._id).exec();
  alias.description = 'changed';
  await alias.save();
  t.deepEqual(await storedTokens(Aliases, created._id), before);

  // a new password (the controller drops the unusable token)
  const rotated = await Aliases.findById(created._id).select(SECRETS).exec();
  rotated.tokens = [];
  await rotated.createToken('fresh');
  await rotated.save();
  const tokens = await storedTokens(Aliases, created._id);
  t.is(tokens.length, 1);
  t.true(tokens[0].usable);
});

test('catch-all passwords of a domain are guarded the same way', async (t) => {
  const { user, domain: created } = await createUserDomainAlias(t, 0);

  const domain = await Domains.findById(created._id).exec();
  domain.tokens.push({ description: 'no secrets', user: user._id });
  domain.skip_verification = true;
  await t.throwsAsync(domain.save(), {
    message: /^tokens: a token without a salt or a hash/
  });

  // the way the catch-all password controllers write them
  const complete = await Domains.findById(created._id).select(SECRETS).exec();
  complete.tokens.push({
    description: 'catch-all',
    user: user._id,
    salt: 'salt',
    hash: 'hash'
  });
  complete.skip_verification = true;
  await complete.save();
  let tokens = await storedTokens(Domains, created._id);
  t.is(tokens.length, 1);
  t.true(tokens[0].usable);

  const removing = await Domains.findById(created._id).select(SECRETS).exec();
  removing.tokens.id(tokens[0]._id).remove();
  removing.skip_verification = true;
  await removing.save();
  tokens = await storedTokens(Domains, created._id);
  t.deepEqual(tokens, []);
});
