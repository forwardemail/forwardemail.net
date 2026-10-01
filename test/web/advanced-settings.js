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

const http = require('node:http');
const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const sinon = require('sinon');
const test = require('ava');
const { JSDOM } = require('jsdom');

const utils = require('../utils');

const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');
const config = require('#config');
const phrases = require('#config/phrases');
const { Domains, Users } = require('#models');

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
      name: `test-${randomUUID()}.example.com`,
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

//
// Custom S3 storage: the endpoint and bucket are validated before the
// public bucket probe, so a private endpoint is never requested.
//
async function createS3Domain(t) {
  const { user } = t.context;
  user.plan = 'enhanced_protection';
  await user.save();
  return t.context.domainFactory
    .withState({
      name: `test-${randomUUID()}.example.com`,
      members: [{ user: user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      has_mx_record: true,
      has_txt_record: true,
      skip_verification: true
    })
    .create();
}

function saveS3Settings(t, domain, fields) {
  return t.context.web
    .put(`/en/my-account/domains/${domain.name}/advanced-settings`)
    .set('Accept', 'application/json')
    .send({
      _section: 'custom_s3_storage',
      has_custom_s3: 'true',
      s3_access_key_id: 'access-key',
      s3_secret_access_key: 'secret-key',
      s3_region: 'auto',
      ...fields
    });
}

test.serial(
  'custom S3: a private endpoint is refused before it is probed',
  async (t) => {
    const hits = [];
    const server = http.createServer((req, res) => {
      hits.push(req.url);
      res.writeHead(200);
      res.end();
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });

    // let the probe itself through so only the controller's own validation
    // can keep the request from being made
    const stub = sinon
      .stub(checkS3BucketAccess, 'isPrivateTarget')
      .resolves(false);
    try {
      const domain = await createS3Domain(t);
      const res = await saveS3Settings(t, domain, {
        s3_endpoint: `http://127.0.0.1:${server.address().port}`,
        s3_bucket: 'test-bucket'
      });
      t.is(res.status, 400);
      t.is(res.body.message, phrases.INVALID_LOCALHOST_URL);
      t.is(hits.length, 0, 'the private endpoint must not be requested');
      t.false(stub.called);
      const saved = await Domains.findById(domain._id).lean();
      t.not(saved.has_custom_s3, true);
    } finally {
      stub.restore();
      server.close();
    }
  }
);

test.serial(
  'custom S3: a bucket name that is not a valid S3 name is refused',
  async (t) => {
    const stub = sinon
      .stub(checkS3BucketAccess, 'isPrivateTarget')
      .resolves(true);
    try {
      const domain = await createS3Domain(t);
      const res = await saveS3Settings(t, domain, {
        // public IP literal (no DNS lookup needed)
        s3_endpoint: 'https://93.184.216.34',
        s3_bucket: '127.0.0.1/.s3.example.com'
      });
      t.is(res.status, 400);
      t.is(res.body.message, phrases.CUSTOM_S3_INVALID_BUCKET);
      t.false(stub.called);
      const saved = await Domains.findById(domain._id).lean();
      t.not(saved.s3_bucket, '127.0.0.1/.s3.example.com');
    } finally {
      stub.restore();
    }
  }
);
