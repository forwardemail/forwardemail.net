/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An outbound message that the scanner flags (an executable attachment
// here) is refused at the API before it is queued: it is not stored, the
// domain is not suspended for it (only that one message is prevented), and
// the domain's admins get a notice that says exactly that.
//

// the notices the API emails are captured (the module is wrapped before
// anything binds to it)
const sentEmails = [];
const emailModulePath = require.resolve('#helpers/email');
const emailHelper = require(emailModulePath);
require.cache[emailModulePath].exports = (data) => {
  sentEmails.push(data);
  return emailHelper(data);
};

const { Buffer } = require('node:buffer');

const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const { Domains, Emails } = require('#models');

// how the scanner names an executable attachment ("executable" up to Spam
// Scanner 5, "a file type that runs code" from Spam Scanner 7)
const EXECUTABLE = /executable|runs code/i;

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupApiServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownApiServer);

// a paid domain with outbound SMTP, and a way to send from one of its aliases
async function setup(t) {
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
      resolver: t.context.resolver,
      has_smtp: true
    })
    .create();

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();

  const send = (attachments) =>
    t.context.api
      .post('/v1/emails')
      .auth(user[config.userFields.apiToken])
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        from: `${alias.name}@${domain.name}`,
        to: 'someone@example.net',
        subject: 'quarterly report',
        text: 'please see the attachment',
        attachments
      });

  return { user, domain, alias, send };
}

test('a message with an executable attachment is prevented, and only that message', async (t) => {
  const { user, domain, send } = await setup(t);

  // a Windows executable (its magic number and its extension both give it
  // away)
  const res = await send([
    {
      filename: 'report.exe',
      content: Buffer.from(`MZ${'\u0000'.repeat(64)}`).toString('base64'),
      encoding: 'base64',
      contentType: 'application/octet-stream'
    }
  ]);
  t.is(res.status, 403, `${JSON.stringify(res.body)}`);
  t.regex(res.body.message, EXECUTABLE);

  // nothing was queued
  t.is(await Emails.countDocuments({ domain: domain._id }), 0);

  // the domain's outbound service is untouched: not suspended, not marked
  const fresh = await Domains.findById(domain._id).lean().exec();
  t.false(fresh.is_smtp_suspended);
  t.is(fresh.smtp_suspended_sent_at, undefined);

  // and the admins were told that this one message was prevented (once a
  // day for the domain)
  await pWaitFor(
    () => sentEmails.some((data) => data.template === 'smtp-prevented'),
    { timeout: ms('10s') }
  );
  const notice = sentEmails.find((data) => data.template === 'smtp-prevented');
  t.true(
    (Array.isArray(notice.message.to)
      ? notice.message.to
      : [notice.message.to]
    ).includes(user.email)
  );
  t.is(notice.locals.responseCode, 554);
  t.regex(notice.locals.response, EXECUTABLE);
  // (rendered through the real template)
  const { info } = await emailHelper(notice);
  const { html } = info.originalMessage;
  t.true(
    html.includes('Only this outbound message was prevented from delivery.')
  );
  t.true(
    html.includes(
      'Your outbound SMTP service and other queued messages remain active.'
    )
  );
  t.false(html.includes('Outbound SMTP is currently paused and suspended.'));
  t.false(
    html.includes(
      'This means that all of your outbound emails are not being processed.'
    )
  );

  // the next, harmless message of the same domain goes through
  const ok = await send([
    {
      filename: 'report.txt',
      content: Buffer.from('all good').toString('base64'),
      encoding: 'base64',
      contentType: 'text/plain'
    }
  ]);
  t.is(ok.status, 200, `${JSON.stringify(ok.body)}`);
  t.is(await Emails.countDocuments({ domain: domain._id }), 1);
});

//
// Spam Scanner's file type check (file-type 16.5.4) looped forever on an ASF
// file with a sub-header shorter than its own header (GHSA-5v7r-6r5c-r473),
// which held the whole process (see helpers/harden-file-type.js).
//
test('an attachment the file type check could not finish is still checked', async (t) => {
  const { domain, send } = await setup(t);

  // (an ASF header object, then a sub-header that gives its size as 0)
  const content = Buffer.alloc(256);
  Buffer.from([
    0x30, 0x26, 0xb2, 0x75, 0x8e, 0x66, 0xcf, 0x11, 0xa6, 0xd9, 0x00, 0xaa,
    0x00, 0x62, 0xce, 0x6c
  ]).copy(content);
  content.writeBigUInt64LE(256n, 16);
  content.fill(0x11, 30, 46);
  content.writeBigUInt64LE(0n, 46);

  // (and the same after an ID3 tag, which file-type skips first: its size
  //  bytes are read as file-type reads them, here 0x80 * 2^7 bytes)
  const id3 = Buffer.from([0x49, 0x44, 0x33, 4, 0, 0, 0, 0, 0x80, 0]);
  const tagged = Buffer.concat([id3, Buffer.alloc(0x80 * 2 ** 7), content]);

  for (const [i, file] of [content, tagged].entries()) {
    const res = await send([
      {
        filename: 'clip.wmv',
        content: file.toString('base64'),
        encoding: 'base64',
        contentType: 'video/x-ms-wmv'
      }
    ]);
    t.is(res.status, 200, `${JSON.stringify(res.body)}`);
    t.is(await Emails.countDocuments({ domain: domain._id }), i + 1);
  }
});
