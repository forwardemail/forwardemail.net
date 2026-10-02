/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// An account is only verified without the emailed code when the code could
// not be sent at all (e.g. our mail server is down), never when the address
// was refused, and sign up takes the addresses our mail servers accept, so
// an address that cannot receive mail (e.g. with an invisible character
// such as "support\u200B@forwardemail.net") cannot become a verified account.
//

// Replace the email helper BEFORE anything loads it (it is captured by
// reference), so a test can choose how sending the code fails.
const emailPath = require.resolve('#helpers/email');
let sendError = null;
require(emailPath);
require.cache[emailPath].exports = async () => {
  if (sendError) throw sendError;
  return {};
};

const { randomUUID } = require('node:crypto');

const falso = require('@ngneat/falso');
const request = require('supertest');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const phrases = require('#config/phrases');
const { Users } = require('#models');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.after.always(() => {
  delete require.cache[emailPath];
});
test.beforeEach(utils.setupWebServer);
test.beforeEach(utils.setupFactories);
test.afterEach.always(utils.teardownWebServer);

test.serial(
  'sign up refuses addresses our mail servers do not accept',
  async (t) => {
    for (const email of [
      `support\u200B@example.com`,
      `"<a href=https://evil.example>x</a>"@example.com`
    ]) {
      const res = await t.context.web
        .post('/en/register')
        .set('Accept', 'application/json')
        .send({ email, password: falso.randPassword() });
      t.is(res.status, 400);
      t.is(res.body.message, phrases.INVALID_EMAIL);

      t.falsy(await Users.exists({ email }));
    }
  }
);

async function signUp(t) {
  const email = falso.randEmail({ provider: 'example', suffix: 'com' });
  const res = await t.context.web
    .post('/en/register')
    .send({ email, password: falso.randPassword() });
  t.is(res.status, 302);
  return email;
}

test.serial('an address that refuses the code is not verified', async (t) => {
  const email = await signUp(t);
  sendError = Object.assign(new Error('Recipient address rejected'), {
    code: 'EENVELOPE',
    responseCode: 553
  });
  try {
    const res = await t.context.web
      .get('/en/verify')
      .set('Accept', 'text/html');
    t.is(res.status, 400);
  } finally {
    sendError = null;
  }

  const user = await Users.findOne({ email }).lean().exec();
  t.false(user[config.userFields.hasVerifiedEmail]);
});

test.serial(
  'an account is not verified when the code cannot be sent, it is asked to try again',
  async (t) => {
    const email = await signUp(t);
    // (e.g. our mail server is down, our transport login failed, or the
    // message was refused for a reason of our own or for now)
    for (const err of [
      Object.assign(new Error('connect ECONNREFUSED'), {
        code: 'ECONNECTION'
      }),
      Object.assign(new Error('Invalid login: 535 Authentication failed'), {
        code: 'EAUTH',
        command: 'AUTH PLAIN',
        responseCode: 535
      }),
      Object.assign(new Error('Message failed: 550 Message rejected'), {
        code: 'EMESSAGE',
        command: 'DATA',
        responseCode: 550
      }),
      Object.assign(new Error('Data command failed: 554 Transaction failed'), {
        code: 'EENVELOPE',
        command: 'DATA',
        responseCode: 554
      }),
      Object.assign(new Error('Mail command failed: 421 Try again later'), {
        code: 'EENVELOPE',
        command: 'MAIL FROM',
        responseCode: 421
      }),
      Object.assign(new Error('Recipient command failed: 450 Busy'), {
        code: 'EENVELOPE',
        command: 'RCPT TO',
        responseCode: 450
      }),
      // (nodemailer's own check of our sender)
      Object.assign(new Error('Invalid sender "support@"'), {
        code: 'EENVELOPE',
        command: 'API'
      })
    ]) {
      sendError = err;
      try {
        const res = await t.context.web
          .get('/en/verify')
          .set('Accept', 'text/html');
        t.is(res.status, 503, `${err.message}`);
        t.is(res.headers.location, undefined);
        t.true(res.text.includes('an error occurred while sending the email'));
      } finally {
        sendError = null;
      }

      const user = await Users.findOne({ email }).lean().exec();
      t.false(user[config.userFields.hasVerifiedEmail], `${err.message}`);
      t.falsy(user[config.userFields.verificationPin], `${err.message}`);
    }

    // trying again once the email can be sent sends the code
    const res = await t.context.web
      .get('/en/verify')
      .set('Accept', 'text/html');
    t.is(res.status, 200);
    const user = await Users.findOne({ email }).lean().exec();
    t.false(user[config.userFields.hasVerifiedEmail]);
    t.truthy(user[config.userFields.verificationPin]);
  }
);

test.serial(
  'an account is not verified when its code cannot be sent through the API',
  async (t) => {
    const email = await signUp(t);
    sendError = Object.assign(new Error('connect ECONNREFUSED'), {
      code: 'ECONNECTION'
    });
    try {
      const res = await t.context.web
        .get('/en/verify')
        .set('Accept', 'application/json');
      t.is(res.status, 503);
      t.true(
        res.body.message.includes('an error occurred while sending the email')
      );
    } finally {
      sendError = null;
    }

    const user = await Users.findOne({ email }).lean().exec();
    t.false(user[config.userFields.hasVerifiedEmail]);
  }
);

test.serial(
  'an account made from the onboarding form is not verified when its code cannot be sent',
  async (t) => {
    const email = falso.randEmail({ provider: 'example', suffix: 'com' });
    sendError = Object.assign(new Error('connect ECONNREFUSED'), {
      code: 'ECONNECTION'
    });
    try {
      // (signed out, as a new visitor)
      await request
        .agent(t.context._web.server)
        .post('/en')
        .set('Accept', 'text/html')
        .send({ email, domain: `${randomUUID()}.example.com` });
    } finally {
      sendError = null;
    }

    const user = await Users.findOne({ email }).lean().exec();
    t.truthy(user);
    t.false(user[config.userFields.hasVerifiedEmail]);
  }
);

test.serial(
  'an address nodemailer refuses as a recipient is not verified',
  async (t) => {
    const email = await signUp(t);
    sendError = Object.assign(new Error(`Invalid recipient "${email}"`), {
      code: 'EENVELOPE',
      command: 'API'
    });
    try {
      const res = await t.context.web
        .get('/en/verify')
        .set('Accept', 'text/html');
      t.is(res.status, 400);
    } finally {
      sendError = null;
    }

    const user = await Users.findOne({ email }).lean().exec();
    t.false(user[config.userFields.hasVerifiedEmail]);
  }
);

test.serial(
  'an address that refuses the code is shown the error without a redirect',
  async (t) => {
    await signUp(t);
    sendError = Object.assign(new Error('Recipient command failed'), {
      code: 'EENVELOPE',
      command: 'RCPT TO',
      responseCode: 550
    });
    try {
      // (e.g. the "resend" link on the verify page)
      const res = await t.context.web
        .get('/en/verify')
        .query({ resend: true })
        .set('Accept', 'text/html')
        .set('Referer', `${config.urls.web}/en/verify`);
      t.is(res.status, 400);
      t.is(res.headers.location, undefined);
      // (the error is flashed on the rendered page)
      t.true(res.text.includes('an error occurred while sending the email'));
    } finally {
      sendError = null;
    }
  }
);

test.serial(
  'a pending recovery is signed out once verified from the emailed link',
  async (t) => {
    const email = await signUp(t);
    await Users.updateOne(
      { email },
      { $set: { [config.userFields.pendingRecovery]: true } }
    );

    // the code is sent
    await t.context.web.get('/en/verify').set('Accept', 'text/html');
    const user = await Users.findOne({ email }).lean().exec();
    const pin = user[config.userFields.verificationPin];
    t.truthy(pin);

    // and its link opened from the mail provider's site
    const res = await t.context.web
      .get('/en/verify')
      .query({ pin })
      .set('Accept', 'text/html')
      .set('Sec-Fetch-Site', 'cross-site');
    t.is(res.status, 302);
    t.not(res.headers.location, '/logout');

    const verified = await Users.findOne({ email }).lean().exec();
    t.true(verified[config.userFields.hasVerifiedEmail]);

    // the session is signed out
    const account = await t.context.web
      .get('/en/my-account')
      .set('Accept', 'text/html');
    t.is(account.status, 302);
    t.regex(account.headers.location, /\/login/);
  }
);
