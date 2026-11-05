/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const util = require('node:util');
const http = require('node:http');
const { Writable } = require('node:stream');
const { setTimeout: delay } = require('node:timers/promises');

//
// Capture emails rendered by `#helpers/email`. `renderAll` produces the
// subject and HTML before any preview or transport step, so the assertions do
// not depend on PREVIEW_EMAIL or SEND_EMAIL. `email-templates` binds it in its
// constructor, so this must run before anything below loads that helper.
//
const Email = require('email-templates');
const sinon = require('sinon');

const renderSpy = sinon.spy(Email.prototype, 'renderAll');

//
// Lets a test sign deliveries without our ARC key, as when it is missing (it
// is bound when the MX server loads, so this must run before it does)
//
const mailauth = require('mailauth');

const { sealMessage } = mailauth;
let isSealKeyMissing = false;
mailauth.sealMessage = async (raw, options) =>
  sealMessage(
    raw,
    isSealKeyMissing ? { ...options, privateKey: undefined } : options
  );

const dayjs = require('dayjs-with-plugins');
const { ImapFlow } = require('imapflow');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
const Mail = require('nodemailer/lib/mailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');
const pWaitFor = require('p-wait-for');
const pify = require('pify');
const test = require('ava');
const { SMTPServer } = require('smtp-server');

const utils = require('../utils');

const IMAP = require('../../imap-server');
const MX = require('../../mx-server');
const SQLite = require('../../sqlite-server');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const SieveScripts = require('#models/sieve-scripts');
const Users = require('#models/users');
const clearAliasQuotaCache = require('#helpers/clear-alias-quota-cache');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const env = require('#config/env');
const getForwardingAddresses = require('#helpers/get-forwarding-addresses');
const logger = require('#helpers/logger');
const sendForwardingIssueEmails = require('#helpers/send-forwarding-issue-emails');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const asyncMxConnect = pify(mxConnect);
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

test.before(utils.setupMongoose);
test.before(utils.setupRedisClient);
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  renderSpy.restore();
  if (t.context.client) t.context.client.disconnect();
  if (t.context.subscriber) t.context.subscriber.disconnect();
});
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;
});

test.afterEach.always(async (t) => {
  for (const key of ['mx', 'target', 'imap']) {
    if (!t.context[key]) continue;
    try {
      await t.context[key].close();
    } catch {}
  }

  try {
    await t.context.wsp.close();
  } catch {}

  try {
    await t.context.sqlite.close();
  } catch {}
});

//
// Sets up a paid domain on the MX server whose forwarding destinations live
// on `forwardDomain`, served by a local SMTP server. `rcptTo(address, count)`
// returns an error for a destination (or nothing to accept it), where `count`
// is how many times that destination was attempted so far.
//
async function setup(t, { rcptTo = () => {} } = {}) {
  const mx = new MX({ client: t.context.client, wsp: t.context.wsp });
  t.context.mx = mx;
  const { resolver } = mx;
  await mx.listen(await getPort());

  // destination address => number of messages received
  const received = new Map();
  const attempts = new Map();
  const targetPort = await getPort();
  const target = new SMTPServer({
    disabledCommands: ['AUTH'],
    logger: false,
    secure: false,
    onRcptTo(address, session, fn) {
      const addr = address.address.toLowerCase();
      const count = (attempts.get(addr) || 0) + 1;
      attempts.set(addr, count);
      Promise.resolve(rcptTo(addr, count)).then((err) => fn(err));
    },
    onData(stream, session, fn) {
      stream.pipe(
        new Writable({
          write(chunk, encoding, next) {
            next();
          }
        })
      );
      stream.on('end', () => {
        for (const { address } of session.envelope.rcptTo) {
          const addr = address.toLowerCase();
          received.set(addr, (received.get(addr) || 0) + 1);
        }

        fn();
      });
    }
  });
  t.context.target = target;
  await pify(target.listen.bind(target))(targetPort);

  const admin = await t.context.userFactory
    .withState({
      plan: 'team',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate(),
      [config.userFields.hasVerifiedEmail]: true
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: admin._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: admin.plan,
      kind: 'one-time'
    })
    .create();

  await admin.save();

  const member = await t.context.userFactory
    .withState({ [config.userFields.hasVerifiedEmail]: true })
    .create();

  let domain = await t.context.domainFactory
    .withState({
      members: [
        { user: admin._id, group: 'admin' },
        { user: member._id, group: 'user' }
      ],
      plan: admin.plan,
      resolver,
      smtp_port: targetPort.toString()
    })
    .create();

  // the domain's TXT record is spoofed below
  domain = await Domains.findByIdAndUpdate(
    domain._id,
    { $set: { has_txt_record: true } },
    { new: true }
  );

  const forwardDomain = `forward-${randomUUID()}.example.com`;

  const map = new Map();
  const mxRecord = (name) =>
    resolver.spoofPacket(
      name,
      'MX',
      [{ exchange: IP_ADDRESS, priority: 0 }],
      true,
      ms('5m')
    );
  map.set('mx:test.com', mxRecord('test.com'));
  map.set(`mx:${domain.name}`, mxRecord(domain.name));
  map.set(`mx:${forwardDomain}`, mxRecord(forwardDomain));
  map.set(
    `txt:${domain.name}`,
    resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  map.set(
    `txt:${env.WEB_HOST}`,
    resolver.spoofPacket(
      env.WEB_HOST,
      'TXT',
      [`v=spf1 ip4:${IP_ADDRESS} -all`],
      true,
      ms('5m')
    )
  );
  //
  // Saving a Domain runs its DNS verification with `purgeCache`, which
  // replaces these records with the public answer (example.com has a wildcard,
  // so that is an empty NOERROR answer on a machine with working DNS), so call
  // this again after saving another domain with the same name.
  //
  const spoofDns = () => resolver.options.cache.mset(map);
  await spoofDns();

  // allowlist our IP so the message is not greylisted on first attempt
  await t.context.client.set(`allowlist:${IP_ADDRESS}`, true);

  async function createAlias(name, recipients, user = admin) {
    return t.context.aliasFactory
      .withState({
        name,
        user: user._id,
        domain: domain._id,
        recipients: recipients.map((r) => `${r}@${forwardDomain}`)
      })
      .create();
  }

  // a retry resends the exact same message (same headers), and its To
  // header can list more recipients than it is sent to
  async function send(names, id = randomUUID(), headerNames = names) {
    const address = (name) =>
      name.includes('@') ? name : `${name}@${domain.name}`;
    const to = names.map((name) => address(name));
    const conn = await asyncMxConnect({
      target: IP_ADDRESS,
      port: mx.server.address().port,
      dnsOptions: {
        resolve: util.callbackify(resolver.resolve.bind(resolver))
      }
    });
    const transporter = nodemailer.createTransport({
      logger,
      host: conn.host,
      port: conn.port,
      connection: conn.socket,
      ignoreTLS: true,
      secure: false,
      tls
    });
    return transporter.sendMail({
      envelope: { from: 'test@test.com', to },
      raw: [
        `To: ${headerNames.map((name) => address(name)).join(', ')}`,
        'From: test@test.com',
        `Subject: Test ${id}`,
        `Message-ID: <${id}@test.com>`,
        'Content-Type: text/plain; charset=us-ascii',
        '',
        'Test'
      ].join('\r\n')
    });
  }

  // a retry would otherwise be greylisted after a failed delivery
  async function clearGreylist() {
    const { keyPrefix } = t.context.client.options;
    const keys = await t.context.client.keys(`${keyPrefix}greylist:*`);
    for (const key of keys) {
      await t.context.client.del(key.slice(keyPrefix.length));
    }
  }

  const addr = (name) => `${name}@${forwardDomain}`;

  return {
    resolver,
    admin,
    member,
    domain,
    forwardDomain,
    received,
    createAlias,
    send,
    spoofDns,
    clearGreylist,
    addr
  };
}

function userUnknown(address) {
  const err = new Error(
    `5.1.1 <${address}>: Recipient address rejected: User unknown in relay recipient table`
  );
  err.responseCode = 550;
  // (as the response is seen by the sending side)
  err.response = `550 ${err.message}`;
  return err;
}

function tryAgainLater() {
  const err = new Error('4.3.0 Temporary local problem, try again later');
  err.responseCode = 451;
  return err;
}

async function getForwardingIssueEmails(alias, expected) {
  // renderAll(template, locals, message) resolves to { subject, html, text }
  const find = async () => {
    const calls = renderSpy
      .getCalls()
      .filter(
        (call) =>
          call.args[0] === 'forwarding-issue' && call.args[1]?.alias === alias
      );
    const rendered = await Promise.all(calls.map((call) => call.returnValue));
    return rendered.map((result, i) => ({
      ...result,
      to: calls[i].args[2]?.to
    }));
  };

  // the email is sent in the background, so allow for a slow or busy machine
  if (expected > 0)
    await pWaitFor(
      async () => {
        const found = await find();
        return found.length >= expected;
      },
      { timeout: ms('1m'), interval: 250 }
    );
  // give a background task that should not send anything time to run
  else await delay(2000);

  return find();
}

test.serial(
  'a dead extra destination does not bounce recipients that received the message',
  async (t) => {
    const ctx = await setup(t, {
      rcptTo: (address) =>
        address === ctx.addr('dead') ? userUnknown(address) : undefined
    });

    // "racb" forwards to a working and a dead address (the reported case)
    await ctx.createAlias('racb', ['racb', 'dead'], ctx.member);
    await ctx.createAlias('jbicha', ['jbicha']);

    const info = await ctx.send(['racb', 'jbicha']);
    t.deepEqual(info.accepted.sort(), [
      `jbicha@${ctx.domain.name}`,
      `racb@${ctx.domain.name}`
    ]);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('racb')), 1);
    t.is(ctx.received.get(ctx.addr('jbicha')), 1);
    t.is(ctx.received.get(ctx.addr('dead')), undefined);

    // the alias owner and the domain admin are both emailed, with the error
    // (the owner is a member of the paid team domain without a plan of their own)
    const messages = await getForwardingIssueEmails(
      `racb@${ctx.domain.name}`,
      2
    );
    t.deepEqual(
      messages.map((m) => m.to).sort(),
      [ctx.admin.email, ctx.member.email].sort()
    );
    for (const message of messages) {
      t.regex(message.subject, /Email forwarding issue for racb@/);
      t.true(message.html.includes(ctx.addr('dead')));
      t.true(message.html.includes('User unknown in relay recipient table'));
      t.true(message.html.includes('other recipients received the message'));
    }

    // another message to the same dead address does not email again
    await ctx.send(['racb', 'jbicha']);
    t.is(ctx.received.get(ctx.addr('racb')), 2);
    const after = await getForwardingIssueEmails(`racb@${ctx.domain.name}`, 0);
    t.is(after.length, 2);
  }
);

test.serial(
  'forwarding issue emails are only sent for a domain whose plan is paid for',
  async (t) => {
    const ctx = await setup(t, {
      rcptTo: (address) =>
        address.startsWith('dead') ? userUnknown(address) : undefined
    });

    await ctx.createAlias('paid', ['paid', 'dead1'], ctx.member);
    await ctx.createAlias('other', ['other']);
    await ctx.send(['paid', 'other']);
    const messages = await getForwardingIssueEmails(
      `paid@${ctx.domain.name}`,
      2
    );
    t.deepEqual(
      messages.map((m) => m.to).sort(),
      [ctx.admin.email, ctx.member.email].sort()
    );

    // once the admin's plan has lapsed (expired, no subscription, past the
    // grace period) nobody on the domain is emailed
    await Users.findByIdAndUpdate(ctx.admin._id, {
      $set: {
        [config.userFields.planExpiresAt]: dayjs().subtract(60, 'days').toDate()
      }
    });
    await ctx.createAlias('lapsed', ['lapsed', 'dead2']);
    await ctx.send(['lapsed', 'other']);
    const none = await getForwardingIssueEmails(`lapsed@${ctx.domain.name}`, 0);
    t.is(none.length, 0);
  }
);

test.serial(
  'an alias whose only destination is dead does not bounce the other recipients',
  async (t) => {
    const ctx = await setup(t, {
      rcptTo: (address) =>
        address === ctx.addr('gone') ? userUnknown(address) : undefined
    });

    await ctx.createAlias('gone', ['gone']);
    await ctx.createAlias('ok', ['ok']);

    const info = await ctx.send(['gone', 'ok']);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('ok')), 1);

    const [message] = await getForwardingIssueEmails(
      `gone@${ctx.domain.name}`,
      1
    );
    t.is(message.to, ctx.admin.email);
    t.true(
      message.html.includes(
        'This alias did not receive the message. Other recipients of the same email did, so the sender was not sent a bounce.'
      )
    );
  }
);

test.serial(
  'when nothing is delivered the sender gets a bounce that does not reveal the destination',
  async (t) => {
    const ctx = await setup(t, {
      rcptTo: (address) =>
        address === ctx.addr('gone') ? userUnknown(address) : undefined
    });

    await ctx.createAlias('gone', ['gone']);

    const err = await t.throwsAsync(ctx.send(['gone']));
    t.is(err.responseCode, 550);
    // the destination is replaced by the alias, and the address is kept
    t.true(
      err.response.includes(
        `<gone@${ctx.domain.name}>: Recipient address rejected: User unknown in relay recipient table`
      )
    );
    t.false(err.response.includes(ctx.forwardDomain));

    const [message] = await getForwardingIssueEmails(
      `gone@${ctx.domain.name}`,
      1
    );
    t.true(
      message.html.includes(
        'The message was not delivered, and the sender received a bounce.'
      )
    );
  }
);

test.serial(
  'a temporary failure is retried without delivering twice to recipients that have the message',
  async (t) => {
    const ctx = await setup(t, {
      rcptTo: (address, count) =>
        address === ctx.addr('busy') && count === 1
          ? tryAgainLater()
          : undefined
    });

    await ctx.createAlias('alpha', ['alpha', 'busy']);
    await ctx.createAlias('beta', ['beta']);

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['alpha', 'beta'], id));
    t.is(err.responseCode, 451);
    t.regex(err.response, /was deferred and will complete when the message/);
    t.regex(err.response, /will not receive it twice/);
    t.false(err.response.includes(ctx.forwardDomain));
    t.is(ctx.received.get(ctx.addr('alpha')), 1);
    t.is(ctx.received.get(ctx.addr('beta')), 1);
    t.is(ctx.received.get(ctx.addr('busy')), undefined);

    // the sender retries the same message
    await ctx.clearGreylist();
    const info = await ctx.send(['alpha', 'beta'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('busy')), 1);
    t.is(ctx.received.get(ctx.addr('alpha')), 1);
    t.is(ctx.received.get(ctx.addr('beta')), 1);

    // a temporary failure that recovered is not reported
    const messages = await getForwardingIssueEmails(
      `alpha@${ctx.domain.name}`,
      0
    );
    t.is(messages.length, 0);
  }
);

test.serial(
  'a destination that keeps deferring stops blocking the message after the retry window',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t, {
      rcptTo: (address) =>
        address === ctx.addr('full') ? tryAgainLater() : undefined
    });

    await ctx.createAlias('gamma', ['gamma', 'full']);
    await ctx.createAlias('delta', ['delta']);

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['gamma', 'delta'], id));
    t.is(err.responseCode, 451);

    await delay(50);
    await ctx.clearGreylist();
    const info = await ctx.send(['gamma', 'delta'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('gamma')), 1);
    t.is(ctx.received.get(ctx.addr('delta')), 1);

    const [message] = await getForwardingIssueEmails(
      `gamma@${ctx.domain.name}`,
      1
    );
    t.true(
      message.html.includes(
        'The receiving server kept deferring the message for'
      )
    );
    t.true(message.html.includes(ctx.addr('full')));
  }
);

test.serial(
  'a destination that limits sessions from our IP is not reported as a forwarding issue',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    // the provider throttles our sending IP (e.g. Comcast), which the alias
    // owner cannot fix
    const ctx = await setup(t, {
      rcptTo(address) {
        if (address !== ctx.addr('throttled')) return;
        const err = new Error(
          `4.2.0 ${IP_ADDRESS} Throttled - try again later. Please see https://postmaster.comcast.net/smtp-error-codes.php#RL000003`
        );
        err.responseCode = 421;
        return err;
      }
    });

    await ctx.createAlias('epsilon', ['epsilon', 'throttled']);
    await ctx.createAlias('zeta', ['zeta']);

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['epsilon', 'zeta'], id));
    t.is(err.responseCode, 421);

    await delay(50);
    await ctx.clearGreylist();
    const info = await ctx.send(['epsilon', 'zeta'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('epsilon')), 1);
    t.is(ctx.received.get(ctx.addr('zeta')), 1);

    const emails = await getForwardingIssueEmails(
      `epsilon@${ctx.domain.name}`,
      0
    );
    t.is(emails.length, 0);
  }
);

test.serial(
  'a mailbox that is over quota receives the message when the sender retries',
  async (t) => {
    const ctx = await setup(t);

    const imap = new IMAP(
      {
        client: t.context.client,
        subscriber: t.context.subscriber,
        wsp: t.context.wsp
      },
      false
    );
    t.context.imap = imap;
    const imapPort = await getPort();
    await imap.listen(imapPort);

    const box = await t.context.aliasFactory
      .withState({
        name: 'box',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [],
        has_imap: true
      })
      .create();
    const pass = await box.createToken();
    await box.save();
    await ctx.createAlias('fwd', ['fwd']);

    async function countInbox() {
      const client = new ImapFlow({
        host: IP_ADDRESS,
        port: imapPort,
        secure: false,
        auth: { user: `box@${ctx.domain.name}`, pass },
        tls,
        logger: false
      });
      await client.connect();
      try {
        const lock = await client.getMailboxLock('INBOX');
        try {
          return client.mailbox.exists;
        } finally {
          lock.release();
        }
      } finally {
        await client.logout();
      }
    }

    // (logging in creates the mailbox)
    t.is(await countInbox(), 0);

    // the mailbox is full: it defers, and the forward is delivered
    await Aliases.findByIdAndUpdate(box._id, { $set: { max_quota: 1 } });
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);
    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['box', 'fwd'], id));
    t.is(err.responseCode, 421);
    t.regex(err.response, /was deferred and will complete when the message/);
    t.is(ctx.received.get(ctx.addr('fwd')), 1);
    t.is(await countInbox(), 0);

    // space is freed and the sender retries the same message: the mailbox
    // receives it (it is not skipped as if it already had it), and the
    // forward is not delivered twice
    await Aliases.findByIdAndUpdate(box._id, { $unset: { max_quota: 1 } });
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);
    await ctx.clearGreylist();
    const info = await ctx.send(['box', 'fwd'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('fwd')), 1);
    await pWaitFor(async () => (await countInbox()) === 1, {
      timeout: ms('30s'),
      interval: ms('1s')
    });
    t.is(await countInbox(), 1);
  }
);

test.serial(
  "a mailbox the sender may not be told about defers without exposing the account's billing",
  async (t) => {
    const ctx = await setup(t);

    // one alias with both a mailbox and a forwarding address
    await t.context.aliasFactory
      .withState({
        name: 'both',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [ctx.addr('both-fwd')],
        has_imap: true
      })
      .create();

    // the domain admin's payment ended past the grace period, so storing in
    // the mailbox fails with an error written for the account holder
    await Users.findByIdAndUpdate(ctx.admin._id, {
      $set: {
        [config.userFields.planExpiresAt]: dayjs().subtract(60, 'day').toDate()
      }
    });
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['both'], id));
    t.is(err.responseCode, 421);
    t.is(ctx.received.get(ctx.addr('both-fwd')), 1);

    // one reply covers the alias: the forward was delivered and the mailbox
    // was deferred, so it must not say the alias both was deferred and
    // already received the message
    const alias = `both@${ctx.domain.name}`;
    t.regex(
      err.response,
      new RegExp(
        `Delivery to ${alias.replace(
          '.',
          '\\.'
        )} was deferred and will complete when the message is retried \\(${alias.replace(
          '.',
          '\\.'
        )} was delivered to some of its destinations, which will not receive it twice\\)`
      )
    );
    t.notRegex(err.response, /already received it/);

    // the sender is not told about the account's plan or billing
    t.regex(err.response, /mailbox .* is temporarily unavailable/i);
    t.notRegex(
      err.response,
      /payment|subscription|grace period|billing|admin/i
    );

    // the retry does not deliver the forward twice
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['both'], id));
    t.is(retry.responseCode, 421);
    t.is(ctx.received.get(ctx.addr('both-fwd')), 1);
  }
);

test.serial(
  'forwarding issue emails only go to the domain that the live DNS verification record proves',
  async (t) => {
    const ctx = await setup(t, {
      rcptTo: (address) =>
        address.startsWith('dead') ? userUnknown(address) : undefined
    });

    // another account added the same domain name (it cannot verify it)
    const squatter = await t.context.userFactory
      .withState({
        plan: 'team',
        [config.userFields.planExpiresAt]: dayjs().add(30, 'days').toDate(),
        [config.userFields.hasVerifiedEmail]: true
      })
      .create();
    const squatted = await t.context.domainFactory
      .withState({
        name: ctx.domain.name,
        members: [{ user: squatter._id, group: 'admin' }],
        plan: 'team',
        resolver: ctx.resolver
      })
      .create();
    await Domains.findByIdAndUpdate(squatted._id, {
      $set: { has_txt_record: true }
    });
    t.not(squatted.verification_record, ctx.domain.verification_record);
    // (saving it looked up the shared name in public DNS)
    await ctx.spoofDns();
    await t.context.aliasFactory
      .withState({
        name: 'real',
        user: squatter._id,
        domain: squatted._id,
        recipients: [ctx.addr('dead1')]
      })
      .create();

    // only the admin of the verified domain is emailed
    await ctx.createAlias('real', ['real', 'dead1']);
    await ctx.createAlias('other', ['other']);
    await ctx.send(['real', 'other']);
    const messages = await getForwardingIssueEmails(
      `real@${ctx.domain.name}`,
      1
    );
    t.deepEqual(
      messages.map((m) => m.to),
      [ctx.admin.email]
    );

    // a lookalike domain that copies the verification value into its own DNS
    // never gets the real domain's admins emailed
    const copycat = `copycat-${randomUUID()}.example.com`;
    await ctx.resolver.options.cache.mset(
      new Map([
        [
          `txt:${copycat}`,
          ctx.resolver.spoofPacket(
            copycat,
            'TXT',
            [`${config.paidPrefix}${ctx.domain.verification_record}`],
            true,
            ms('5m')
          )
        ]
      ])
    );
    await ctx.createAlias('copied', ['copied', 'dead2']);

    // (called directly: the same broken destination, reached through the
    // lookalike and through the real domain)
    const notify = (address) =>
      sendForwardingIssueEmails({
        client: t.context.client,
        resolver: ctx.resolver,
        session: {},
        message: { from: 'test@test.com', subject: 'Test' },
        accepted: [address],
        bounces: [
          {
            address,
            destination: ctx.addr('dead2'),
            err: userUnknown(ctx.addr('dead2'))
          }
        ],
        outcome: 'accepted'
      });

    await notify(`copied@${copycat}`);
    const none = await getForwardingIssueEmails(`copied@${copycat}`, 0);
    t.is(none.length, 0);

    await notify(`copied@${ctx.domain.name}`);
    const real = await getForwardingIssueEmails(`copied@${ctx.domain.name}`, 1);
    t.deepEqual(
      real.map((m) => m.to),
      [ctx.admin.email]
    );
  }
);

test.serial(
  'a temporary DNS failure does not hold back the forwarding issue email',
  async (t) => {
    const ctx = await setup(t);
    await ctx.createAlias('flaky', ['flaky', 'dead']);
    const address = `flaky@${ctx.domain.name}`;
    const notify = (resolver) =>
      sendForwardingIssueEmails({
        client: t.context.client,
        resolver,
        session: {},
        message: { from: 'test@test.com', subject: 'Test' },
        accepted: [address],
        bounces: [
          {
            address,
            destination: ctx.addr('dead'),
            err: userUnknown(ctx.addr('dead'))
          }
        ],
        outcome: 'accepted'
      });

    // the verification record could not be looked up this time
    await notify({
      async resolveTxt(name) {
        const err = new Error(`queryTxt ETIMEOUT ${name}`);
        err.code = 'ETIMEOUT';
        throw err;
      }
    });
    const none = await getForwardingIssueEmails(address, 0);
    t.is(none.length, 0);

    // the next bounce for the same destination is reported
    await notify(ctx.resolver);
    const emails = await getForwardingIssueEmails(address, 1);
    t.deepEqual(
      emails.map((m) => m.to),
      [ctx.admin.email]
    );
  }
);

test.serial(
  'forwarding only follows a verification record published by that domain or a subdomain of it',
  async (t) => {
    const ctx = await setup(t);
    await ctx.createAlias('copied', ['copied', 'dead']);

    const mx = (name) =>
      ctx.resolver.spoofPacket(
        name,
        'MX',
        [{ exchange: IP_ADDRESS, priority: 0 }],
        true,
        ms('5m')
      );
    const txt = (name) =>
      ctx.resolver.spoofPacket(
        name,
        'TXT',
        [`${config.paidPrefix}${ctx.domain.verification_record}`],
        true,
        ms('5m')
      );

    // a lookalike that copies the value into its own DNS, and a subdomain of
    // the real domain that publishes the same value
    const copycat = `copycat-${randomUUID()}.example.com`;
    const sub = `sub.${ctx.domain.name}`;
    await ctx.resolver.options.cache.mset(
      new Map([
        [`mx:${copycat}`, mx(copycat)],
        [`txt:${copycat}`, txt(copycat)],
        [`mx:${sub}`, mx(sub)],
        [`txt:${sub}`, txt(sub)]
      ])
    );

    const lookup = (address) =>
      getForwardingAddresses.call(t.context.mx, address, [], false);

    const real = await lookup(`copied@${ctx.domain.name}`);
    t.true(real.addresses.some((a) => a.startsWith('dead')));

    // a domain whose MX records point elsewhere (e.g. Gmail routing mail to us)
    // is matched by its TXT record alone, for forwarding and for the email
    await ctx.resolver.options.cache.mset(
      new Map([
        [
          `mx:${ctx.domain.name}`,
          ctx.resolver.spoofPacket(
            ctx.domain.name,
            'MX',
            [{ exchange: 'aspmx.l.google.com', priority: 1 }],
            true,
            ms('5m')
          )
        ]
      ])
    );
    const routed = await lookup(`copied@${ctx.domain.name}`);
    t.true(routed.addresses.some((a) => a.startsWith('dead')));
    await sendForwardingIssueEmails({
      client: t.context.client,
      resolver: ctx.resolver,
      session: {},
      message: { from: 'test@test.com', subject: 'Test' },
      accepted: [`copied@${ctx.domain.name}`],
      bounces: [
        {
          address: `copied@${ctx.domain.name}`,
          destination: ctx.addr('dead'),
          err: userUnknown(ctx.addr('dead'))
        }
      ],
      outcome: 'accepted'
    });
    const emails = await getForwardingIssueEmails(
      `copied@${ctx.domain.name}`,
      1
    );
    t.deepEqual(
      emails.map((m) => m.to),
      [ctx.admin.email]
    );

    const subdomain = await lookup(`copied@${sub}`);
    t.true(subdomain.addresses.some((a) => a.startsWith('dead')));

    // mail to the lookalike is never routed through the real domain's aliases
    const err = await t.throwsAsync(lookup(`copied@${copycat}`));
    t.regex(err.message, /copied@copycat-/);
  }
);

test.serial(
  'the sender is not told the address an alias forwards to in another form',
  async (t) => {
    const ctx = await setup(t, {
      // the destination's server names it without the brackets of the IP
      // address literal it was sent to (e.g. "user@192.0.2.1")
      rcptTo(address) {
        const err = new Error(
          `5.1.1 <${address.replace(
            /\[|]/g,
            ''
          )}>: Recipient address rejected: User unknown`
        );
        err.responseCode = 550;
        err.response = `550 ${err.message}`;
        return err;
      }
    });

    // a catch-all to an IP address forwards to "literal@[IP]"
    await t.context.aliasFactory
      .withState({
        name: 'literal',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [IP_ADDRESS]
      })
      .create();

    const err = await t.throwsAsync(ctx.send(['literal']));
    t.is(err.responseCode, 550);
    t.true(err.message.includes(`literal@${ctx.domain.name}`));
    t.regex(err.message, /User unknown/);
    t.false(err.message.includes(IP_ADDRESS));
  }
);

test.serial(
  'a message the destination was out of capacity for is greylisted briefly',
  async (t) => {
    const ctx = await setup(t, {
      // (as Gmail answers for a full mailbox)
      rcptTo(address) {
        if (address !== ctx.addr('full')) return;
        const err = new Error(
          "4.2.2 The recipient's inbox is out of storage space and inactive. Please direct the recipient to over quota"
        );
        err.responseCode = 452;
        return err;
      }
    });
    await ctx.createAlias('full', ['full']);
    // (keys from the tests before)
    await ctx.clearGreylist();

    const err = await t.throwsAsync(ctx.send(['full']));
    t.is(err.responseCode, 452);

    // the sender may retry within a minute (allowlisted, see `setup`) rather
    // than after 10 minutes
    const { keyPrefix } = t.context.client.options;
    const keys = await t.context.client.keys(`${keyPrefix}greylist:*`);
    t.is(keys.length, 1);
    const pttl = await t.context.client.pttl(keys[0].slice(keyPrefix.length));
    t.true(pttl > 0 && pttl <= ms('1m'));
  }
);

//
// A mailbox on the MX server's domain (`name`), which can also forward to
// `recipients` (names on the forwarding domain), and a way to count the
// messages in its INBOX over IMAP
//
async function setupMailbox(t, ctx, name, recipients = []) {
  if (!t.context.imap) {
    const imap = new IMAP(
      {
        client: t.context.client,
        subscriber: t.context.subscriber,
        wsp: t.context.wsp
      },
      false
    );
    t.context.imap = imap;
    t.context.imapPort = await getPort();
    await imap.listen(t.context.imapPort);
  }

  const alias = await t.context.aliasFactory
    .withState({
      name,
      user: ctx.admin._id,
      domain: ctx.domain._id,
      recipients: recipients.map((r) => ctx.addr(r)),
      has_imap: true
    })
    .create();
  const pass = await alias.createToken();
  await alias.save();

  async function countInbox() {
    const client = new ImapFlow({
      host: IP_ADDRESS,
      port: t.context.imapPort,
      secure: false,
      auth: { user: `${name}@${ctx.domain.name}`, pass },
      tls,
      logger: false
    });
    await client.connect();
    try {
      const lock = await client.getMailboxLock('INBOX');
      try {
        return client.mailbox.exists;
      } finally {
        lock.release();
      }
    } finally {
      await client.logout();
    }
  }

  // (logging in creates the mailbox)
  t.is(await countInbox(), 0);

  return { address: `${name}@${ctx.domain.name}`, countInbox };
}

//
// Have the MX server's requests to store messages in mailboxes go through
// `fn(data, request)` (e.g. to make one time out as the SQLite server does
// when it is overloaded)
//
function interceptMailboxStorage(t, fn) {
  const request = t.context.wsp.request.bind(t.context.wsp);
  t.context.wsp.request = async (data, ...args) =>
    data?.action === 'tmp'
      ? fn(data, () => request(data, ...args))
      : request(data, ...args);
  t.teardown(() => {
    t.context.wsp.request = request;
  });
}

// (as the WebSocket client rejects a request the SQLite server did not answer)
function storageTimeout() {
  const err = new Error(
    'WebSocket request was rejected by timeout (60000 ms). RequestId: tmp:test'
  );
  err.name = 'TimeoutError';
  return err;
}

//
// Whether a transaction found a destination claimed by another one that is
// still delivering to it (see `claim` in `helpers/on-data-mx`)
//
function watchPendingClaims(t) {
  const { client } = t.context;
  const { get } = client;
  let isPending = false;
  client.get = async function (...args) {
    const value = await get.apply(this, args);
    if (value === 'pending') isPending = true;
    return value;
  };

  t.teardown(() => {
    client.get = get;
  });
  return () => isPending;
}

// (the keys that record when each message was first seen, see
// `hasFingerprintExpired`)
async function getFingerprints(t) {
  const { keyPrefix } = t.context.client.options;
  const keys = await t.context.client.keys(`${keyPrefix}f:*`);
  return new Set(
    keys
      .map((key) => key.slice(keyPrefix.length))
      .filter((key) => /^f:[\da-f]+$/.test(key))
  );
}

// (as if the message sent since `before` was first seen `age` ago)
async function firstSeenBefore(t, before, age) {
  const after = await getFingerprints(t);
  const keys = [...after].filter((key) => !before.has(key));
  t.is(keys.length, 1);
  await t.context.client.set(
    keys[0],
    new Date(Date.now() - age).toISOString(),
    'KEEPTTL'
  );
}

async function waitForInbox(countInbox, expected) {
  await pWaitFor(async () => (await countInbox()) === expected, {
    timeout: ms('30s'),
    interval: ms('1s')
  });
}

test.serial(
  'a mailbox that keeps timing out is retried past the partial delivery window',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'stalled', ['stalled-fwd']);

    let isDown = true;
    interceptMailboxStorage(t, async (data, request) => {
      if (isDown) throw storageTimeout();
      return request();
    });

    // (the destinations that received a message, see `claim` in
    // `helpers/on-data-mx`)
    const { keyPrefix } = t.context.client.options;
    async function getDelivered() {
      const delivered = [];
      for (const key of await t.context.client.keys(`${keyPrefix}f:*:*`)) {
        const name = key.slice(keyPrefix.length);
        if ((await t.context.client.get(name)) === '1') delivered.push(name);
      }

      return delivered;
    }

    const before = new Set(await getDelivered());

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['stalled'], id));
    t.is(err.responseCode, 421);
    t.is(ctx.received.get(ctx.addr('stalled-fwd')), 1);

    // (the forward is skipped on every retry, and for as long as the message
    // keeps being retried: shorten what is left of its claim)
    const after = await getDelivered();
    const delivered = after.filter((key) => !before.has(key));
    t.is(delivered.length, 1);
    await t.context.client.pexpire(delivered[0], ms('1m'));

    // past the window the mailbox is still down: the message is deferred,
    // not accepted without it
    await delay(50);
    const retry = await t.throwsAsync(ctx.send(['stalled'], id));
    t.is(retry.responseCode, 421);
    t.true((await t.context.client.pttl(delivered[0])) > ms('23h'));
    t.is(await box.countInbox(), 0);

    // once it is back, the retry stores it
    isDown = false;
    const info = await ctx.send(['stalled'], id);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
    t.is(ctx.received.get(ctx.addr('stalled-fwd')), 1);

    // no forwarding issue email is sent for our own mailbox
    const emails = await getForwardingIssueEmails(box.address, 0);
    t.is(emails.length, 0);
  }
);

test.serial(
  'a mailbox that fails on our side is retried until it has the message, while the rest is delivered once',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'split', ['split-a', 'split-b']);
    const other = await setupMailbox(t, ctx, 'other');

    // each way storing in our mailbox can fail for now, one per attempt
    // (thrown by the WebSocket request, or replied by the SQLite server)
    const failures = [
      () => {
        throw storageTimeout();
      },
      () => {
        const err = new Error('Connection closed unexpectedly');
        err.code = 'ECONNRESET';
        throw err;
      },
      () => ({
        [box.address]: {
          name: 'SqliteError',
          code: 'SQLITE_BUSY',
          message: 'database is locked'
        }
      }),
      () => ({
        [box.address]: {
          name: 'TypeError',
          message: "Cannot read properties of undefined (reading 'id')"
        }
      }),
      () => ({
        [box.address]: {
          name: 'ReplyError',
          message: "READONLY You can't write against a read only replica."
        }
      }),
      () => ({
        [box.address]: {
          name: 'MongoServerSelectionError',
          message: 'Server selection timed out after 30000 ms'
        }
      })
    ];
    let fail;
    interceptMailboxStorage(t, async (data, request) =>
      fail && data.aliases.some((alias) => alias.address === box.address)
        ? fail()
        : request()
    );

    const id = randomUUID();
    for (const [i, failure] of failures.entries()) {
      fail = failure;
      if (i > 0) {
        // (past the retry window)
        await delay(50);
        await ctx.clearGreylist();
      }

      const err = await t.throwsAsync(ctx.send(['split', 'other'], id));
      t.is(err.responseCode, 421, `attempt ${i + 1}`);
      t.notRegex(
        err.response,
        /timeout|econnreset|sqlite|locked|cannot read|readonly|server selection/i
      );
    }

    // the forwards and the other mailbox got it once, this mailbox not yet
    t.is(ctx.received.get(ctx.addr('split-a')), 1);
    t.is(ctx.received.get(ctx.addr('split-b')), 1);
    t.is(await other.countInbox(), 1);
    t.is(await box.countInbox(), 0);

    // once storage is back, the retry stores it and nothing else twice
    fail = undefined;
    await ctx.clearGreylist();
    const info = await ctx.send(['split', 'other'], id);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
    t.is(await other.countInbox(), 1);
    t.is(ctx.received.get(ctx.addr('split-a')), 1);
    t.is(ctx.received.get(ctx.addr('split-b')), 1);

    // and no one is emailed about a failure of our own
    const emails = await getForwardingIssueEmails(box.address, 0);
    t.is(emails.length, 0);
  }
);

test.serial(
  'an internal error storing a message in a mailbox is temporary',
  async (t) => {
    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'inbox');

    // the SQLite server fails to store it with an error that is not about
    // the message (e.g. a key it could not decrypt)
    let isFailing = true;
    interceptMailboxStorage(t, async (data, request) => {
      if (!isFailing) return request();
      return {
        [box.address]: {
          name: 'Error',
          message: 'Decryption failed for all supported formats',
          isCodeBug: false
        }
      };
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['inbox'], id));
    t.is(err.responseCode, 421);
    t.regex(err.response, /temporarily unavailable/);
    t.notRegex(err.response, /Decryption/);

    isFailing = false;
    const info = await ctx.send(['inbox'], id);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
  }
);

test.serial(
  'a forward that fails on our side is retried instead of bouncing',
  async (t) => {
    const ctx = await setup(t);
    await ctx.createAlias('signed', ['signed']);

    // our ARC signing key cannot be used (Node rejects with
    // ERR_CRYPTO_SIGN_KEY_REQUIRED)
    isSealKeyMissing = true;
    t.teardown(() => {
      isSealKeyMissing = false;
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['signed'], id));
    t.is(err.responseCode, 421);
    t.notRegex(err.response, /key/i);
    t.false(ctx.received.has(ctx.addr('signed')));

    // once it is fixed, the retry is delivered (it is not skipped as if the
    // destination had the message)
    isSealKeyMissing = false;
    const info = await ctx.send(['signed'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('signed')), 1);
  }
);

test.serial(
  'a webhook that fails on our side is retried past the partial delivery window',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    let hits = 0;
    const server = http.createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        hits++;
        res.end('OK');
      });
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    t.teardown(() => {
      server.close();
    });

    const ctx = await setup(t);
    await t.context.aliasFactory
      .withState({
        name: 'hook',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [
          `http://127.0.0.1:${server.address().port}/hook`,
          ctx.addr('hook-fwd')
        ]
      })
      .create();

    // our key for signing webhook requests cannot be read
    await Domains.findByIdAndUpdate(ctx.domain._id, {
      $set: { webhook_key: 'not-encrypted' }
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['hook'], id));
    t.is(err.responseCode, 421);
    t.is(ctx.received.get(ctx.addr('hook-fwd')), 1);
    t.is(hits, 0);

    // past the window the webhook is not given up on
    await delay(50);
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['hook'], id));
    t.is(retry.responseCode, 421);
    t.is(hits, 0);

    // once the key is fixed, the retry is delivered to the webhook only
    await Domains.findByIdAndUpdate(ctx.domain._id, {
      $unset: { webhook_key: 1 }
    });
    await t.context.client.del(`v1_settings:${ctx.domain.name}`);
    await ctx.clearGreylist();
    const info = await ctx.send(['hook'], id);
    t.deepEqual(info.rejected, []);
    t.is(hits, 1);
    t.is(ctx.received.get(ctx.addr('hook-fwd')), 1);
  }
);

test.serial(
  'a failure on our side that never goes away is accepted before the message expires, not bounced for every recipient',
  async (t) => {
    let hits = 0;
    const server = http.createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        hits++;
        res.end('OK');
      });
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    t.teardown(() => {
      server.close();
    });

    const ctx = await setup(t);
    await t.context.aliasFactory
      .withState({
        name: 'stuck',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [
          `http://127.0.0.1:${server.address().port}/hook`,
          ctx.addr('stuck-fwd')
        ]
      })
      .create();

    // our key for signing webhook requests cannot be read, on every attempt
    await Domains.findByIdAndUpdate(ctx.domain._id, {
      $set: { webhook_key: 'not-encrypted' }
    });

    const before = await getFingerprints(t);

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['stuck'], id));
    t.is(err.responseCode, 421);
    t.is(ctx.received.get(ctx.addr('stuck-fwd')), 1);

    // the sender has retried it for the internal retry window (a day before
    // a retry is refused with a 550 for every recipient)
    await firstSeenBefore(t, before, config.internalRetryWindow + ms('1h'));

    // so it is accepted, for the recipient that already has it too
    await ctx.clearGreylist();
    const info = await ctx.send(['stuck'], id);
    t.deepEqual(info.rejected, []);
    t.is(hits, 0);
    t.is(ctx.received.get(ctx.addr('stuck-fwd')), 1);
  }
);

test.serial(
  'a mailbox that fails on our side until the internal retry window ends is emailed about with that window',
  async (t) => {
    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'lapsing', ['lapsing-fwd']);
    interceptMailboxStorage(t, async () => {
      throw storageTimeout();
    });

    const before = await getFingerprints(t);
    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['lapsing'], id));
    t.is(err.responseCode, 421);

    await firstSeenBefore(t, before, config.internalRetryWindow + ms('1h'));
    await ctx.clearGreylist();
    const info = await ctx.send(['lapsing'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('lapsing-fwd')), 1);

    const [message] = await getForwardingIssueEmails(box.address, 1);
    t.true(
      message.html.includes(
        `retried for ${ms(config.internalRetryWindow, { long: true })}`
      )
    );
  }
);

test.serial(
  'a failure on our side is given up on before a sender that retries for 2 days stops',
  async (t) => {
    // (e.g. Exchange, which then bounces every recipient)
    const ctx = await setup(t);
    await setupMailbox(t, ctx, 'brief', ['brief-fwd']);
    interceptMailboxStorage(t, async () => {
      throw storageTimeout();
    });

    const before = await getFingerprints(t);
    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['brief'], id));
    t.is(err.responseCode, 421);

    // its last retry, an hour before it gives up
    await firstSeenBefore(t, before, ms('2d') - ms('1h'));
    await ctx.clearGreylist();
    const info = await ctx.send(['brief'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('brief-fwd')), 1);
  }
);

test.serial(
  'a forward that fails on our side while it is sent is retried past the partial delivery window',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'sent', ['sent-fwd']);

    // a code bug while it is sent (our own handling gives it a 421, see
    // `shouldThrow`, so it looks like a reply until it is told apart)
    const { sendMail } = Mail.prototype;
    let isBroken = true;
    Mail.prototype.sendMail = function (data, ...args) {
      if (isBroken && String(data?.envelope?.to).includes(ctx.addr('sent-fwd')))
        return Promise.reject(
          new TypeError("Cannot read properties of undefined (reading 'host')")
        );
      return sendMail.call(this, data, ...args);
    };

    t.teardown(() => {
      Mail.prototype.sendMail = sendMail;
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['sent'], id));
    t.is(err.responseCode, 421);
    t.notRegex(err.response, /cannot read/i);
    await waitForInbox(box.countInbox, 1);
    t.false(ctx.received.has(ctx.addr('sent-fwd')));

    // past the window it is still deferred, not given up on
    await delay(50);
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['sent'], id));
    t.is(retry.responseCode, 421);
    t.false(ctx.received.has(ctx.addr('sent-fwd')));

    // once it is fixed, the retry is delivered, and the mailbox keeps one copy
    isBroken = false;
    await ctx.clearGreylist();
    const info = await ctx.send(['sent'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('sent-fwd')), 1);
    t.is(await box.countInbox(), 1);

    // and no one is emailed about a failure of our own
    const emails = await getForwardingIssueEmails(box.address, 0);
    t.is(emails.length, 0);
  }
);

test.serial(
  'a forward that rejects the message for good is not sent it again while the message is retried',
  async (t) => {
    let rejections = 0;
    const ctx = await setup(t, {
      rcptTo(address) {
        if (address !== ctx.addr('gone')) return;
        rejections++;
        return userUnknown(address);
      }
    });
    const box = await setupMailbox(t, ctx, 'keep', ['gone']);

    // our mailbox storage is down, so the message is deferred
    let isDown = true;
    interceptMailboxStorage(t, async (data, request) => {
      if (isDown) throw storageTimeout();
      return request();
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['keep'], id));
    t.is(err.responseCode, 421);
    t.is(rejections, 1);

    // a retry does not send it to the destination that rejected it again
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['keep'], id));
    t.is(retry.responseCode, 421);
    t.is(rejections, 1);

    // once storage is back, the message is accepted, the mailbox has it,
    // and the owner is told about the destination with its own reply
    isDown = false;
    await ctx.clearGreylist();
    const info = await ctx.send(['keep'], id);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
    t.is(rejections, 1);
    const emails = await getForwardingIssueEmails(box.address, 1);
    t.is(emails.length, 1);
    t.regex(emails[0].text, /User unknown/);
  }
);

test.serial(
  'a webhook that answers 500 is sent the message again on a retry, and once only after it accepted it',
  async (t) => {
    // (an HTTP status is not an SMTP reply: it fails for now)
    const statuses = [500];
    let hits = 0;
    const server = http.createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        hits++;
        res.statusCode = statuses.shift() || 200;
        res.end(res.statusCode === 200 ? 'OK' : 'Internal Server Error');
      });
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    t.teardown(() => {
      server.close();
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'hooked');
    await Aliases.findOneAndUpdate(
      { name: 'hooked', domain: ctx.domain._id },
      {
        $set: {
          recipients: [`http://127.0.0.1:${server.address().port}/hook`]
        }
      }
    );

    // our mailbox storage is down, so the message is deferred
    let isDown = true;
    interceptMailboxStorage(t, async (data, request) => {
      if (isDown) throw storageTimeout();
      return request();
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['hooked'], id));
    t.is(err.responseCode, 421);
    t.is(hits, 1);

    // the retry is sent to the webhook again, which accepts it now
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['hooked'], id));
    t.is(retry.responseCode, 421);
    t.is(hits, 2);

    isDown = false;
    await ctx.clearGreylist();
    const info = await ctx.send(['hooked'], id);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
    t.is(hits, 2);
  }
);

test.serial(
  'a webhook that is unavailable for now is retried until it accepts the message',
  async (t) => {
    // the webhook is down for the first attempt (e.g. behind a proxy)
    const statuses = [503];
    let hits = 0;
    const server = http.createServer((req, res) => {
      req.resume();
      req.on('end', () => {
        hits++;
        res.statusCode = statuses.shift() || 200;
        res.end(res.statusCode === 200 ? 'OK' : 'Service Unavailable');
      });
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    t.teardown(() => {
      server.close();
    });

    const ctx = await setup(t);
    await t.context.aliasFactory
      .withState({
        name: 'flaky',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [`http://127.0.0.1:${server.address().port}/hook`]
      })
      .create();

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['flaky'], id));
    t.is(err.responseCode, 421);
    t.is(hits, 1);

    // the retry is sent to the webhook again, and it accepts it
    await ctx.clearGreylist();
    const info = await ctx.send(['flaky'], id);
    t.deepEqual(info.rejected, []);
    t.is(hits, 2);
  }
);

test.serial(
  'a destination that two aliases forward to is reported for each, and sent the message once',
  async (t) => {
    let rejections = 0;
    const ctx = await setup(t, {
      rcptTo(address) {
        if (address !== ctx.addr('shared')) return;
        rejections++;
        return userUnknown(address);
      }
    });
    await ctx.createAlias('first', ['shared']);
    await ctx.createAlias('second', ['shared']);

    // it is sent the message once, and each alias gets its own rejection
    const err = await t.throwsAsync(ctx.send(['first', 'second']));
    t.is(err.responseCode, 550);
    t.is(rejections, 1);
    t.regex(err.response, /first@/);
    t.regex(err.response, /second@/);
  }
);

test.serial(
  'a forwarding address that could not be checked is retried, not skipped',
  async (t) => {
    const ctx = await setup(t);

    // (a destination domain that is not allowlisted, so it is checked)
    const destination = `fwd@checked-${randomUUID()}.org`;
    const host = destination.split('@')[1];
    await ctx.resolver.options.cache.mset(
      new Map([
        [
          `mx:${host}`,
          ctx.resolver.spoofPacket(
            host,
            'MX',
            [{ exchange: IP_ADDRESS, priority: 0 }],
            true,
            ms('5m')
          )
        ]
      ])
    );
    const box = await setupMailbox(t, ctx, 'checked');
    await Aliases.findOneAndUpdate(
      { name: 'checked', domain: ctx.domain._id },
      { $set: { recipients: [destination] } }
    );

    // Redis fails while the forwarding address is checked
    const { client } = t.context;
    const get = client.get.bind(client);
    let isFailing = true;
    let failures = 0;
    client.get = async (key, ...args) => {
      if (isFailing && key === `allowlist:${destination}`) {
        failures++;
        throw new Error('Connection is closed.');
      }

      return get(key, ...args);
    };

    t.teardown(() => {
      client.get = get;
    });

    // the mailbox gets it, and the message is deferred for the forward (whose
    // address the sender is not told)
    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['checked'], id));
    t.true(failures > 0);
    t.is(err.responseCode, 421);
    t.notRegex(err.response, new RegExp(host));
    await waitForInbox(box.countInbox, 1);
    t.false(ctx.received.has(destination));

    isFailing = false;
    await ctx.clearGreylist();
    const info = await ctx.send(['checked'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(destination), 1);
    t.is(await box.countInbox(), 1);
  }
);

test.serial(
  'a Sieve rejection of one address of a mailbox does not reject its other addresses',
  async (t) => {
    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'tagged');
    const alias = await Aliases.findOne({
      name: 'tagged',
      domain: ctx.domain._id
    });
    await SieveScripts.create({
      user: ctx.admin._id,
      domain: ctx.domain._id,
      alias: alias._id,
      name: 'Detail',
      content:
        'require ["envelope", "subaddress", "reject"];\nif envelope :detail "to" "spam" {\n  reject "Not here";\n}',
      is_active: true
    });

    // the plus-addressed form is rejected, and the plain address still is
    // stored to
    const info = await ctx.send(['tagged+spam', 'tagged']);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
  }
);

test.serial(
  'a mailbox reached through two recipients of a message is stored to once',
  async (t) => {
    // (as in production, where mailboxes are stored to at the same time)
    const { concurrency } = config;
    config.concurrency = 2;
    t.teardown(() => {
      config.concurrency = concurrency;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'twice');

    let calls = 0;
    interceptMailboxStorage(t, async (data, request) => {
      calls++;
      return request();
    });

    // (one recipient's delivery does not wait on the other's, as if it were
    // another attempt still storing the message)
    const info = await ctx.send(['twice', 'twice+tag']);
    t.deepEqual(info.rejected, []);
    t.is(calls, 1);
    await waitForInbox(box.countInbox, 1);
    await delay(1000);
    t.is(await box.countInbox(), 1);
  }
);

test.serial(
  'a mailbox reached through two recipients is not accepted for one while storing it failed for the other',
  async (t) => {
    // (as in production, where mailboxes are stored to at the same time)
    const { concurrency, partialDeliveryRetryWindow } = config;
    config.concurrency = 2;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.concurrency = concurrency;
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t);
    // (a mailbox only: on a custom port, an alias without forwarding
    // addresses is also sent to that port)
    await Domains.findByIdAndUpdate(ctx.domain._id, {
      $set: { smtp_port: '25' }
    });
    const box = await setupMailbox(t, ctx, 'cramped');
    await Aliases.findOneAndUpdate(
      { name: 'cramped', domain: ctx.domain._id },
      { $set: { max_quota: 1 } }
    );
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);

    const id = randomUUID();
    const first = await t.throwsAsync(ctx.send(['cramped', 'cramped+tag'], id));
    t.true(first.responseCode >= 400 && first.responseCode < 500);

    // past the window the full mailbox is still not reported as having the
    // message for either address
    await delay(50);
    await ctx.clearGreylist();
    const err = await t.throwsAsync(ctx.send(['cramped', 'cramped+tag'], id));
    t.true(err.responseCode >= 400 && err.responseCode < 500);
    t.is(await box.countInbox(), 0);

    // and once it has room, a retry stores it
    await Aliases.findOneAndUpdate(
      { name: 'cramped', domain: ctx.domain._id },
      { $unset: { max_quota: 1 } }
    );
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);
    await ctx.clearGreylist();
    const info = await ctx.send(['cramped', 'cramped+tag'], id);
    t.deepEqual(info.rejected, []);
    await waitForInbox(box.countInbox, 1);
  }
);

test.serial(
  'a mailbox another alias forwards into is stored once, and its address is not told to the sender',
  async (t) => {
    // (as in production, where mailboxes are stored to at the same time)
    const { concurrency } = config;
    config.concurrency = 2;
    t.teardown(() => {
      config.concurrency = concurrency;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'inner');
    await t.context.aliasFactory
      .withState({
        name: 'outer',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [box.address]
      })
      .create();

    let calls = 0;
    interceptMailboxStorage(t, async (data, request) => {
      calls++;
      return request();
    });

    // both recipients reach the mailbox: it is stored to once, and neither
    // waits on the other as if it were another attempt
    const info = await ctx.send(['outer', 'inner']);
    t.deepEqual(info.rejected, []);
    t.is(calls, 1);
    await waitForInbox(box.countInbox, 1);

    // the mailbox is full: the sender of mail to "outer" is not told the
    // address of the mailbox it forwards into
    await Aliases.findOneAndUpdate(
      { name: 'inner', domain: ctx.domain._id },
      { $set: { max_quota: 1 } }
    );
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);
    const err = await t.throwsAsync(ctx.send(['outer']));
    t.is(err.responseCode, 421);
    t.regex(err.response, /quota for .*outer@/i);
    t.notRegex(err.response, /inner@/);
  }
);

test.serial(
  'a retry that arrives while a webhook is still being delivered is deferred for each alias it serves',
  async (t) => {
    // (it waits for the first attempt for a second only)
    const { fingerprintPendingWait } = config;
    config.fingerprintPendingWait = ms('1s');
    t.teardown(() => {
      config.fingerprintPendingWait = fingerprintPendingWait;
    });

    // the webhook is slow to answer the first attempt
    let isWaiting = false;
    let answer;
    const answered = new Promise((resolve) => {
      answer = resolve;
    });
    t.teardown(() => answer());
    const server = http.createServer((req, res) => {
      req.resume();
      req.on('end', async () => {
        isWaiting = true;
        await answered;
        res.end('OK');
      });
    });
    await new Promise((resolve) => {
      server.listen(0, '127.0.0.1', resolve);
    });
    t.teardown(() => {
      server.close();
    });

    const ctx = await setup(t);
    const webhook = `http://127.0.0.1:${server.address().port}/hook`;
    for (const name of ['wa', 'wb']) {
      await t.context.aliasFactory
        .withState({
          name,
          user: ctx.admin._id,
          domain: ctx.domain._id,
          recipients: [webhook]
        })
        .create();
    }

    const id = randomUUID();
    const first = ctx.send(['wa', 'wb'], id).then(
      (info) => ({ info }),
      (err) => ({ err })
    );
    await pWaitFor(() => isWaiting, { timeout: ms('30s'), interval: 50 });

    // both aliases are told it is still in progress
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['wa', 'wb'], id));
    t.is(retry.responseCode, 421);
    t.regex(retry.response, /wa@/);
    t.regex(retry.response, /wb@/);

    answer();
    const { info } = await first;
    t.deepEqual(info.rejected, []);
  }
);

test.serial(
  'a destination whose claim cannot be checked is retried, not skipped',
  async (t) => {
    const ctx = await setup(t);
    await ctx.createAlias('claim', ['claim']);

    // Redis fails to claim the destination (the connection was lost)
    const { client } = t.context;
    const set = client.set.bind(client);
    let isFailing = true;
    client.set = async (...args) => {
      if (isFailing && args[1] === 'pending') {
        isFailing = false;
        throw new Error('Connection is closed.');
      }

      return set(...args);
    };

    t.teardown(() => {
      client.set = set;
    });

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['claim'], id));
    t.is(err.responseCode, 421);
    t.false(ctx.received.has(ctx.addr('claim')));

    const info = await ctx.send(['claim'], id);
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('claim')), 1);
  }
);

test.serial(
  'a mailbox that stays full is emailed about as a storage issue',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'full', ['full-fwd']);
    await Aliases.findOneAndUpdate(
      { name: 'full', domain: ctx.domain._id },
      { $set: { max_quota: 1 } }
    );
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);

    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['full'], id));
    t.is(err.responseCode, 421);
    t.is(ctx.received.get(ctx.addr('full-fwd')), 1);

    // past the window the full mailbox is given up on, and its owner is told
    // why, without the markup of the error
    await delay(50);
    await ctx.clearGreylist();
    const info = await ctx.send(['full'], id);
    t.deepEqual(info.rejected, []);
    t.is(await box.countInbox(), 0);

    const emails = await getForwardingIssueEmails(box.address, 1);
    t.is(emails.length, 1);
    t.regex(emails[0].subject, /Email delivery issue/);
    t.regex(emails[0].text, /does not have enough storage for this message/);
    t.regex(emails[0].text, /Mailbox quota for full@\S+\s+would be exceeded/);
    t.notRegex(emails[0].text, /notranslate|<span/);
  }
);

test.serial(
  "a message the alias owner's Sieve script rejects is not emailed about",
  async (t) => {
    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'picky', ['picky-fwd']);
    const alias = await Aliases.findOne({
      name: 'picky',
      domain: ctx.domain._id
    });
    await SieveScripts.create({
      user: ctx.admin._id,
      domain: ctx.domain._id,
      alias: alias._id,
      name: 'Reject',
      // (as if the address did not exist, which reads as a broken mailbox)
      content: 'require "reject";\nreject "550 5.1.1 User unknown";',
      is_active: true
    });

    // the mailbox rejects it for good, and the forward is delivered
    const info = await ctx.send(['picky'], randomUUID());
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('picky-fwd')), 1);
    t.is(await box.countInbox(), 0);

    const emails = await getForwardingIssueEmails(box.address, 0);
    t.is(emails.length, 0);
  }
);

test.serial(
  'the owner of a full mailbox is emailed about it, not the owners of an alias that forwards into it',
  async (t) => {
    const { partialDeliveryRetryWindow } = config;
    config.partialDeliveryRetryWindow = 1;
    t.teardown(() => {
      config.partialDeliveryRetryWindow = partialDeliveryRetryWindow;
    });

    const ctx = await setup(t);
    const box = await setupMailbox(t, ctx, 'owned', ['owned-fwd']);
    await t.context.aliasFactory
      .withState({
        name: 'via',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [box.address]
      })
      .create();
    await Aliases.findOneAndUpdate(
      { name: 'owned', domain: ctx.domain._id },
      { $set: { max_quota: 1 } }
    );
    await clearAliasQuotaCache(t.context.client, ctx.domain._id);

    // (the alias that forwards into the mailbox comes first)
    const id = randomUUID();
    const err = await t.throwsAsync(ctx.send(['via', 'owned'], id));
    t.is(err.responseCode, 421);

    // past the window the full mailbox is given up on
    await delay(50);
    await ctx.clearGreylist();
    const info = await ctx.send(['via', 'owned'], id);
    t.deepEqual(info.rejected, []);

    const emails = await getForwardingIssueEmails(box.address, 1);
    t.is(emails.length, 1);
    const others = await getForwardingIssueEmails(`via@${ctx.domain.name}`, 0);
    t.is(others.length, 0);
  }
);

test.serial(
  'a retry while an earlier attempt is still storing the message is deferred',
  async (t) => {
    // (it waits for the first attempt for a second only)
    const { fingerprintPendingWait } = config;
    config.fingerprintPendingWait = ms('1s');
    t.teardown(() => {
      config.fingerprintPendingWait = fingerprintPendingWait;
    });

    const ctx = await setup(t);

    const imap = new IMAP(
      {
        client: t.context.client,
        subscriber: t.context.subscriber,
        wsp: t.context.wsp
      },
      false
    );
    t.context.imap = imap;
    const imapPort = await getPort();
    await imap.listen(imapPort);

    const box = await t.context.aliasFactory
      .withState({
        name: 'box',
        user: ctx.admin._id,
        domain: ctx.domain._id,
        recipients: [],
        has_imap: true
      })
      .create();
    const pass = await box.createToken();
    await box.save();

    async function countInbox() {
      const client = new ImapFlow({
        host: IP_ADDRESS,
        port: imapPort,
        secure: false,
        auth: { user: `box@${ctx.domain.name}`, pass },
        tls,
        logger: false
      });
      await client.connect();
      try {
        const lock = await client.getMailboxLock('INBOX');
        try {
          return client.mailbox.exists;
        } finally {
          lock.release();
        }
      } finally {
        await client.logout();
      }
    }

    // (logging in creates the mailbox)
    t.is(await countInbox(), 0);

    // the first attempt is slow to store the message and then times out
    class TimeoutError extends Error {}
    const { request } = t.context.wsp;
    let release;
    const held = new Promise((resolve) => {
      release = resolve;
    });
    let holding = false;
    t.context.wsp.request = async function (data, ...args) {
      if (data.action === 'tmp' && !holding) {
        holding = true;
        await held;
        throw new TimeoutError('Promise timed out after 60000 milliseconds');
      }

      return request.call(this, data, ...args);
    };

    t.teardown(() => {
      t.context.wsp.request = request;
    });

    const id = randomUUID();
    const first = ctx.send(['box'], id);
    await pWaitFor(() => holding, { timeout: ms('30s') });

    // meanwhile the sender retries (e.g. it gave up waiting): the retry is
    // deferred, not accepted, since the first attempt can still fail
    await ctx.clearGreylist();
    const retry = await t.throwsAsync(ctx.send(['box'], id));
    t.is(retry.responseCode, 421);

    release();
    const err = await t.throwsAsync(first);
    t.is(err.responseCode, 421);

    // the next retry stores the message
    await ctx.clearGreylist();
    const info = await ctx.send(['box'], id);
    t.deepEqual(info.rejected, []);
    await pWaitFor(async () => (await countInbox()) === 1, {
      timeout: ms('30s'),
      interval: ms('1s')
    });
    t.is(await countInbox(), 1);
  }
);

test.serial(
  'a retry that waits for an earlier attempt that fails for now delivers the message itself',
  async (t) => {
    // the first attempt is slow at the destination and then fails for now
    let release;
    const held = new Promise((resolve) => {
      release = resolve;
    });
    let holding = false;
    const ctx = await setup(t, {
      async rcptTo(address, count) {
        if (address !== ctx.addr('slow') || count !== 1) return;
        holding = true;
        await held;
        return tryAgainLater();
      }
    });
    await ctx.createAlias('slow', ['slow']);
    await ctx.clearGreylist();

    const id = randomUUID();
    const first = ctx.send(['slow'], id);
    await pWaitFor(() => holding, { timeout: ms('30s') });

    // meanwhile the sender retries, and the retry waits for the first
    // attempt, which then fails and releases the destination: the retry
    // forwards the message instead of being deferred
    const isWaiting = watchPendingClaims(t);
    const retry = ctx.send(['slow'], id);
    await pWaitFor(isWaiting, { timeout: ms('30s'), interval: 50 });
    release();
    const err = await t.throwsAsync(first);
    t.is(err.responseCode, 451);
    const info = await retry;
    t.deepEqual(info.rejected, []);
    t.is(ctx.received.get(ctx.addr('slow')), 1);

    // the next retry skips it
    await ctx.clearGreylist();
    await ctx.send(['slow'], id);
    t.is(ctx.received.get(ctx.addr('slow')), 1);
  }
);

test.serial(
  'a transaction that finds several destinations in progress waits for them once',
  async (t) => {
    const { fingerprintPendingWait } = config;
    config.fingerprintPendingWait = ms('3s');
    t.teardown(() => {
      config.fingerprintPendingWait = fingerprintPendingWait;
    });

    // each destination is slow for the first attempt at it
    const names = ['pa', 'pb', 'pc'];
    let release;
    const held = new Promise((resolve) => {
      release = resolve;
    });
    t.teardown(() => release());
    const holding = new Set();
    const ctx = await setup(t, {
      async rcptTo(address, count) {
        const name = names.find((name) => address === ctx.addr(name));
        if (!name || count !== 1) return;
        holding.add(name);
        await held;
      }
    });
    for (const name of names) await ctx.createAlias(name, [name]);

    // the message is being delivered to each of them by another transaction
    const id = randomUUID();
    const firsts = names.map((name) =>
      ctx.send([name], id, names).then(
        (info) => ({ info }),
        (err) => ({ err })
      )
    );
    await pWaitFor(() => holding.size === names.length, {
      timeout: ms('30s'),
      interval: 50
    });

    // (the destinations are claimed one after another)
    await ctx.clearGreylist();
    const start = Date.now();
    const err = await t.throwsAsync(ctx.send(names, id));
    const elapsed = Date.now() - start;
    t.is(err.responseCode, 421);
    t.true(elapsed < 2 * config.fingerprintPendingWait, `waited ${elapsed}ms`);

    release();
    for (const { info } of await Promise.all(firsts)) {
      t.deepEqual(info?.rejected, []);
    }
  }
);

test.serial(
  'each transaction on a connection waits for a destination in progress',
  async (t) => {
    const { fingerprintPendingWait } = config;
    config.fingerprintPendingWait = ms('2s');
    t.teardown(() => {
      config.fingerprintPendingWait = fingerprintPendingWait;
    });

    // each destination is slow for the first attempt at it
    const names = ['conn-a', 'conn-b'];
    const releases = {};
    const held = {};
    for (const name of names) {
      held[name] = new Promise((resolve) => {
        releases[name] = resolve;
      });
    }

    t.teardown(() => {
      for (const name of names) releases[name]();
    });
    const holding = new Set();
    const ctx = await setup(t, {
      async rcptTo(address, count) {
        const name = names.find((name) => address === ctx.addr(name));
        if (!name || count !== 1) return;
        holding.add(name);
        await held[name];
      }
    });
    for (const name of names) await ctx.createAlias(name, [name]);

    // each message is being delivered by another transaction
    const ids = names.map(() => randomUUID());
    const firsts = names.map((name, i) => ctx.send([name], ids[i]));
    await pWaitFor(() => holding.size === names.length, {
      timeout: ms('30s'),
      interval: 50
    });
    await ctx.clearGreylist();

    // the sender sends both messages again on one connection
    const connection = new SMTPConnection({
      host: IP_ADDRESS,
      port: t.context.mx.server.address().port,
      ignoreTLS: true,
      secure: false,
      tls
    });
    t.teardown(() => connection.close());
    await pify(connection.connect.bind(connection))();
    const sendOnConnection = (name, id) =>
      pify(connection.send.bind(connection))(
        { from: 'test@test.com', to: [`${name}@${ctx.domain.name}`] },
        [
          `To: ${name}@${ctx.domain.name}`,
          'From: test@test.com',
          `Subject: Test ${id}`,
          `Message-ID: <${id}@test.com>`,
          'Content-Type: text/plain; charset=us-ascii',
          '',
          'Test'
        ].join('\r\n')
      );

    // (the number of times a claim was found pending)
    const { client } = t.context;
    const { get } = client;
    let pending = 0;
    client.get = async function (...args) {
      const value = await get.apply(this, args);
      if (value === 'pending') pending++;
      return value;
    };

    t.teardown(() => {
      client.get = get;
    });

    // each one waits for the other transaction, which then delivers it
    for (const [i, name] of names.entries()) {
      const before = pending;
      const sent = sendOnConnection(name, ids[i]);
      await pWaitFor(() => pending > before, {
        timeout: ms('30s'),
        interval: 50
      });
      releases[name]();
      const info = await sent;
      t.deepEqual(info.rejected, []);
      const first = await firsts[i];
      t.deepEqual(first.rejected, []);
      t.is(ctx.received.get(ctx.addr(name)), 1);

      // (the next message comes after this one would have stopped waiting)
      await delay(config.fingerprintPendingWait);
    }
  }
);

test.serial(
  'a transaction waiting for a destination in progress stops waiting on shutdown',
  async (t) => {
    const { fingerprintPendingWait } = config;
    config.fingerprintPendingWait = ms('20s');
    t.teardown(() => {
      config.fingerprintPendingWait = fingerprintPendingWait;
    });

    let release;
    const held = new Promise((resolve) => {
      release = resolve;
    });
    t.teardown(() => release());
    let holding = false;
    const ctx = await setup(t, {
      async rcptTo(address, count) {
        if (address !== ctx.addr('halt') || count !== 1) return;
        holding = true;
        await held;
      }
    });
    await ctx.createAlias('halt', ['halt']);

    const id = randomUUID();
    const first = ctx.send(['halt'], id).catch(() => {});
    await pWaitFor(() => holding, { timeout: ms('30s') });

    const isWaiting = watchPendingClaims(t);
    const second = t.throwsAsync(ctx.send(['halt'], id));
    await pWaitFor(isWaiting, { timeout: ms('30s'), interval: 50 });

    const start = Date.now();
    t.context.mx.isClosing = true;
    const err = await second;
    t.is(err.responseCode, 421);
    t.true(Date.now() - start < ms('5s'));

    release();
    await first;
  }
);

test.serial(
  'two transactions of a message at once are both accepted and deliver it once',
  async (t) => {
    // the first transaction is slow at the destination, and then delivers it
    let release;
    const held = new Promise((resolve) => {
      release = resolve;
    });
    t.teardown(() => release());
    let holding = false;
    const ctx = await setup(t, {
      async rcptTo(address, count) {
        if (address !== ctx.addr('twin') || count !== 1) return;
        holding = true;
        await held;
      }
    });
    await ctx.createAlias('twin', ['twin']);

    const id = randomUUID();
    const first = ctx.send(['twin'], id);
    await pWaitFor(() => holding, { timeout: ms('30s') });

    // the second waits for the first instead of being deferred
    const isWaiting = watchPendingClaims(t);
    const second = ctx.send(['twin'], id);
    await pWaitFor(isWaiting, { timeout: ms('30s'), interval: 50 });
    release();
    const infos = await Promise.all([first, second]);
    for (const info of infos) {
      t.deepEqual(info.rejected, []);
      t.deepEqual(info.accepted, [`twin@${ctx.domain.name}`]);
    }

    t.is(ctx.received.get(ctx.addr('twin')), 1);
  }
);
