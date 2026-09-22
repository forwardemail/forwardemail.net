/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// The advanced settings page of a domain, as the web server renders it:
// the preview of the custom verification template (user-authored HTML) is
// an opaque, script-disabled frame that starts out blank, so a saved
// template can never run in the authenticated application origin.
//

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const config = require('#config');
const { Users } = require('#models');

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

test('the custom verification preview is a blank, sandboxed frame', async (t) => {
  const { user, web } = t.context;
  const domain = await t.context.domainFactory
    .withState({
      name: `${randomUUID().replaceAll('-', '').slice(0, 12)}.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'free',
      has_mx_record: true,
      has_txt_record: true,
      // (the records are not looked up: the flags stand)
      skip_verification: true
    })
    .create();

  const res = await web.get(
    `/en/my-account/domains/${domain.name}/advanced-settings`
  );
  t.is(res.status, 200);
  const { document } = new JSDOM(res.text).window;

  const frame = document.querySelector('iframe#custom-verification-preview');
  t.truthy(frame);
  // sandboxed with no permission at all (no scripts, no same-origin)
  t.true(frame.hasAttribute('sandbox'));
  t.is(frame.getAttribute('sandbox'), '');
  t.is(frame.getAttribute('src'), 'about:blank');
  // the saved template is handed to the editor, never rendered inline
  t.is(frame.getAttribute('srcdoc'), null);
  t.truthy(document.querySelector('#textarea-custom-verification-html'));
});
