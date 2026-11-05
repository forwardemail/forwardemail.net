/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The Sieve script form of an alias: it sends the content with every
// change, and content as it was saved is not checked again, so a script
// saved before a check was added can still be renamed or activated.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');
const SieveScripts = require('#models/sieve-scripts');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.password = falso.randPassword();
  let user = await t.context.userFactory.make();
  user = await Users.register(user, t.context.password);
  user[config.userFields.hasSetPassword] = true;
  user[config.userFields.hasVerifiedEmail] = true;
  t.context.user = await user.save();
  await utils.setupWebServer(t);
  await utils.loginUser(t);
});
test.afterEach.always(utils.teardownWebServer);

test('renames and activates a script saved before stricter checks', async (t) => {
  const { user, web } = t.context;
  user.plan = 'enhanced_protection';
  await user.save();
  const domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      has_mx_record: true,
      has_txt_record: true,
      skip_verification: true
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

  // (a name of a variable that is not an identifier is refused when saved)
  const content = 'require "variables"; set "my-folder" "x";';
  const now = new Date();
  // (with the id the model gives a script, as it has a unique index)
  const _id = new mongoose.Types.ObjectId();
  const { insertedId } = await SieveScripts.collection.insertOne({
    _id,
    id: _id.toString(),
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'saved-before',
    content,
    is_active: false,
    is_valid: true,
    required_capabilities: ['variables'],
    created_at: now,
    updated_at: now
  });

  const url = `/en/my-account/domains/${domain.name}/aliases/${alias.id}/sieve/${insertedId}`;
  const res = await web
    .put(url)
    .set('Accept', 'application/json')
    .send({ name: 'renamed', content, is_active: 'true' });
  t.is(res.status, 200);
  const script = await SieveScripts.findById(insertedId).lean();
  t.is(script.name, 'renamed');
  t.true(script.is_active);

  // (new content that is refused is still refused)
  const changed = await web.put(url).set('Accept', 'application/json').send({
    name: 'renamed',
    content: 'require "variables"; set "other-folder" "y";'
  });
  t.is(changed.status, 400);
  const unchanged = await SieveScripts.findById(insertedId).lean();
  t.is(unchanged.content, content);
});

test('changes a script saved before stricter checks with the content as the form sends it', async (t) => {
  const { user, web } = t.context;
  user.plan = 'enhanced_protection';
  await user.save();
  const domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      has_mx_record: true,
      has_txt_record: true,
      skip_verification: true
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

  // (saved with LF and a first empty line, which the form does not send)
  const content = '\nrequire "variables";\nset "my-folder" "x";\n';
  const now = new Date();
  // (with the id the model gives a script, as it has a unique index)
  const _id = new mongoose.Types.ObjectId();
  const { insertedId } = await SieveScripts.collection.insertOne({
    _id,
    id: _id.toString(),
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'saved-with-lf',
    content,
    is_active: false,
    is_valid: true,
    required_capabilities: ['variables'],
    created_at: now,
    updated_at: now
  });

  // (as jQuery serialize sends the form, with CRLF line ends)
  const res = await web
    .put(
      `/en/my-account/domains/${domain.name}/aliases/${alias.id}/sieve/${insertedId}`
    )
    .set('Accept', 'application/json')
    .type('form')
    .send({
      name: 'saved-with-lf',
      description: 'Changed',
      content: 'require "variables";\r\nset "my-folder" "x";\r\n',
      is_active: 'true'
    });
  t.is(res.status, 200);
  const script = await SieveScripts.findById(insertedId).lean();
  t.is(script.description, 'Changed');
  t.true(script.is_active);
  t.is(script.content, content);
});

test('keeps a script saved with blank lines first as the form sends it', async (t) => {
  const { user, web } = t.context;
  user.plan = 'enhanced_protection';
  await user.save();
  const domain = await t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      has_mx_record: true,
      has_txt_record: true,
      skip_verification: true
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

  const content = '\n\nrequire "variables";\nset "my-folder" "x";\n';
  const now = new Date();
  // (with the id the model gives a script, as it has a unique index)
  const _id = new mongoose.Types.ObjectId();
  const { insertedId } = await SieveScripts.collection.insertOne({
    _id,
    id: _id.toString(),
    alias: alias._id,
    user: user._id,
    domain: domain._id,
    name: 'saved-with-blank-lines',
    content,
    is_active: false,
    is_valid: true,
    required_capabilities: ['variables'],
    created_at: now,
    updated_at: now
  });

  // (the textarea drops only the first line end, as HTML parsing does; the
  // content as it was saved is unchanged too)
  const url = `/en/my-account/domains/${domain.name}/aliases/${alias.id}/sieve/${insertedId}`;
  for (const [description, sent] of [
    ['From the form', '\r\nrequire "variables";\r\nset "my-folder" "x";\r\n'],
    ['As saved', content]
  ]) {
    const res = await web
      .put(url)
      .set('Accept', 'application/json')
      .type('form')
      .send({
        name: 'saved-with-blank-lines',
        description,
        content: sent,
        is_active: 'true'
      });
    t.is(res.status, 200);
    const script = await SieveScripts.findById(insertedId).lean();
    t.is(script.description, description);
    t.is(script.content, content);
  }
});
