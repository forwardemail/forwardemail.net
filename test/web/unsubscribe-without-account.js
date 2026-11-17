/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An address a free plan domain forwards to has no account, and is sent the
// occasional email about that domain. Its unsubscribe link said "Unsubscribe
// Successful" and kept nothing, and the footer showed no link at all. The
// link is in the footer now, and the address is not emailed again (apart
// from what cannot be unsubscribed from).
//

const { randomUUID } = require('node:crypto');

const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const emailHelper = require('#helpers/email');
const { EmailOptOuts } = require('#models');
const { generateUnsubscribeLink, hashEmail } = require('#helpers/unsubscribe');

test.before(utils.setupMongoose);
test.before(utils.setupWebServer);
test.after.always(utils.teardownMongoose);
test.after.always(utils.teardownWebServer);

function send(template, to, locals = {}) {
  return emailHelper({
    template,
    message: { to },
    locals: {
      locale: 'en',
      domain: 'example.com',
      message: 'Hello.',
      ...locals
    }
  });
}

function pathOf(email, template) {
  return generateUnsubscribeLink(email, template, 'en').slice(
    config.urls.web.length
  );
}

test('the link in the footer keeps an address without an account from further emails', async (t) => {
  const email = `nobody-${randomUUID().slice(0, 8)}@example.com`;

  // the email has the link in its footer, and in its headers
  const { info } = await send('free-plan-intro', email);
  const link = generateUnsubscribeLink(email, null, 'en');
  const { html, headers } = info.originalMessage;
  const footer = html.slice(html.lastIndexOf('<footer'));
  const href = footer.match(/href="([^"]+\/unsubscribe\/[^"]+)"/);
  t.truthy(href);
  t.true(headers['List-Unsubscribe'].includes('/en/unsubscribe/'));
  t.is(await EmailOptOuts.countDocuments({ hash: hashEmail(email) }), 0);

  // following it is kept (by a hash, not the address)
  const res = await t.context.web.get(
    href[1].replace(/&amp;/g, '&').slice(config.urls.web.length)
  );
  t.is(res.status, 200);
  t.true(res.text.includes('Unsubscribe Successful'));
  const optOut = await EmailOptOuts.findOne({ hash: hashEmail(email) });
  t.true(optOut.all);
  t.false(JSON.stringify(optOut.toObject()).includes(email));
  t.truthy(link);

  // so it is not sent that email, or another with an unsubscribe link
  for (const template of ['free-plan-intro', 'self-test']) {
    const err = await t.throwsAsync(send(template, email));
    t.regex(err.message, /may have unsubscribed/, `${template}`);
  }

  // (among several recipients, only it is left out)
  const other = `other-${randomUUID().slice(0, 8)}@example.com`;
  const both = await send('self-test', [email, other]);
  t.deepEqual(both.info.originalMessage.to, [other]);

  // what cannot be unsubscribed from is still sent
  const alert = await send('alert', email);
  t.is(alert.info.originalMessage.to, email);
});

test('a one-click unsubscribe from a mail app is kept too, for that kind of email', async (t) => {
  const email = `oneclick-${randomUUID().slice(0, 8)}@example.com`;
  const res = await t.context.web.post(pathOf(email, 'phishing-alert'));
  t.is(res.status, 200);
  const optOut = await EmailOptOuts.findOne({ hash: hashEmail(email) });
  t.false(optOut.all);
  t.deepEqual([...optOut.templates], ['phishing-alert']);

  const err = await t.throwsAsync(
    send('phishing-alert', email, { from: 'sender@example.org' })
  );
  t.regex(err.message, /may have unsubscribed/);
  // (other kinds are still sent)
  const intro = await send('free-plan-intro', email);
  t.is(intro.info.originalMessage.to, email);
});
