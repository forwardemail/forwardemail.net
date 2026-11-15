/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// A DNS lookup that gets no answer (e.g. our resolver timing out, or being
// throttled) is about our servers, not anyone's setup: the domain's admins
// are not emailed that it needs outbound SMTP configured or re-verified.
//

// the emails sent are captured once sent (the module is wrapped before
// anything binds to it)
const sentEmails = [];
const emailModulePath = require.resolve('#helpers/email');
const emailHelper = require(emailModulePath);
require.cache[emailModulePath].exports = async (data) => {
  const result = await emailHelper(data);
  sentEmails.push(data);
  return result;
};

const util = require('node:util');
const { randomUUID } = require('node:crypto');
const { setTimeout: delay } = require('node:timers/promises');
const { Writable } = require('node:stream');

const Redis = require('ioredis-mock');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');
const SMTP = require('../../smtp-server');

const config = require('#config');
const env = require('#config/env');
const logger = require('#helpers/logger');
const processEmail = require('#helpers/process-email');
const { Emails } = require('#models');

let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const client = new Redis();
client.setMaxListeners(0);

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);

//
// A paid domain with outbound SMTP, its DNS records in place, and a server
// that accepts mail to `destination`'s domain
//
async function setup(t) {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const smtp = new SMTP({ client: t.context.client }, false);
  await smtp.listen(await getPort());
  const { resolver } = smtp;
  const port = await getPort();

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
      has_smtp: true,
      resolver
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email]
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();

  const destination = `dest-${randomUUID().slice(0, 8)}.com`;
  const returnPath = `${domain.return_path}.${domain.name}`;
  const spoof = (name, type, data) =>
    resolver.spoofPacket(name, type, data, true, ms('5m'));
  await resolver.options.cache.mset(
    new Map([
      [
        `mx:${destination}`,
        spoof(destination, 'MX', [{ exchange: IP_ADDRESS, priority: 0 }])
      ],
      [
        `txt:${domain.name}`,
        spoof(domain.name, 'TXT', [
          `${config.paidPrefix}${domain.verification_record}`
        ])
      ],
      [
        `txt:${domain.dkim_key_selector}._domainkey.${domain.name}`,
        spoof(`${domain.dkim_key_selector}._domainkey.${domain.name}`, 'TXT', [
          `v=DKIM1; k=rsa; p=${domain.dkim_public_key.toString('base64')};`
        ])
      ],
      [
        `txt:${env.WEB_HOST}`,
        spoof(env.WEB_HOST, 'TXT', [`v=spf1 ip4:${IP_ADDRESS} -all`])
      ],
      [`cname:${returnPath}`, spoof(returnPath, 'CNAME', [env.WEB_HOST])],
      [
        `txt:${returnPath}`,
        spoof(returnPath, 'TXT', [`v=spf1 ip4:${IP_ADDRESS} -all`])
      ],
      [
        `txt:_dmarc.${domain.name}`,
        spoof(`_dmarc.${domain.name}`, 'TXT', [
          `v=DMARC1; p=reject; pct=100; rua=mailto:dmarc-${domain.id}@forwardemail.net;`
        ])
      ]
    ])
  );

  const server = new SMTPServer({
    disabledCommands: ['AUTH'],
    logger: false,
    secure: false,
    onRcptTo(address, session, fn) {
      fn();
    },
    onData(stream, session, fn) {
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            next();
          }
        })
      );
      stream.on('end', () => fn());
    }
  });
  await pify(server.listen.bind(server))(port);

  t.teardown(async () => {
    await pify(server.close.bind(server))().catch(() => {});
    await smtp.close().catch(() => {});
  });

  //
  // the resolver gets no answer for `name` (its `method`, e.g. "resolve"
  // for an MX lookup), as Tangerine answers when its servers time out, or
  // answers with `code` (e.g. ENODATA: there is no such record)
  //
  function noAnswer(method, name, code = 'ETIMEOUT') {
    const original = resolver[method];
    resolver[method] = async function (host, ...args) {
      if (host === name)
        throw this.constructor.createError(
          host,
          typeof args[0] === 'string' ? args[0] : 'A',
          code
        );
      return original.call(this, host, ...args);
    };

    return () => {
      resolver[method] = original;
    };
  }

  // submit a message, then find its email
  async function submit() {
    const mx = await asyncMxConnect({
      target: IP_ADDRESS,
      port: smtp.server.address().port,
      dnsOptions: {
        resolve: util.callbackify(resolver.resolve.bind(resolver))
      }
    });
    const transporter = nodemailer.createTransport({
      logger,
      host: mx.host,
      port: mx.port,
      connection: mx.socket,
      secure: false,
      tls: { rejectUnauthorized: false },
      auth: { user: `${alias.name}@${domain.name}`, pass }
    });
    const messageId = `${randomUUID()}@${domain.name}`;
    const to = `foo@${destination}`;
    await transporter.sendMail({
      envelope: {
        from: `${alias.name}@${domain.name}`,
        to
      },
      raw: [
        `Message-ID: <${messageId}>`,
        `To: ${to}`,
        `From: ${alias.name}@${domain.name}`,
        'Subject: Test',
        `Date: ${new Date().toUTCString()}`,
        'Content-Type: text/plain; charset=us-ascii',
        '',
        'Test'
      ].join('\r\n')
    });
    return Emails.findOne({ messageId }).lean().exec();
  }

  // process an email again, as the queue does once a deferred one is due
  async function process(email) {
    await Emails.collection.updateOne(
      { _id: email._id },
      {
        $set: {
          is_locked: false,
          updated_at: dayjs().subtract(2, 'minute').toDate()
        },
        $unset: { locked_by: 1, locked_at: 1 }
      }
    );
    const fresh = await Emails.findById(email._id).lean().exec();
    return processEmail({ email: fresh, port, resolver, client });
  }

  return {
    resolver,
    domain,
    destination,
    returnPath,
    noAnswer,
    submit,
    process
  };
}

const sentAbout = (pattern) =>
  sentEmails.filter((data) => pattern.test(String(data.message?.subject)));

test.serial(
  'a return path lookup that got no answer does not email the domain admins',
  async (t) => {
    const ctx = await setup(t);
    const subject = new RegExp(
      `${ctx.domain.name}.*needs outbound SMTP configured or re-verified`
    );
    const email = await ctx.submit();

    // (the message is deferred, as when its return path is not set up)
    const restore = ctx.noAnswer('resolveCname', ctx.returnPath);
    await ctx.process(email);
    restore();
    const deferred = await Emails.findById(email._id).lean().exec();
    t.is(deferred.status, 'deferred');
    await delay(1000);
    t.is(sentAbout(subject).length, 0);

    // (a return path that is not set up is still emailed about)
    const missing = ctx.noAnswer('resolveCname', ctx.returnPath, 'ENODATA');
    await ctx.process(email);
    missing();
    await pWaitFor(() => sentAbout(subject).length === 1, {
      timeout: ms('10s')
    });
    t.pass();
  }
);
