/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const util = require('node:util');
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

const dayjs = require('dayjs-with-plugins');
const { ImapFlow } = require('imapflow');
const ip = require('ip');
const ms = require('ms');
const mxConnect = require('@forwardemail/mx-connect');
const nodemailer = require('nodemailer');
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
      fn(rcptTo(addr, count));
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

  // a retry resends the exact same message (same headers)
  async function send(names, id = randomUUID()) {
    const to = names.map((name) =>
      name.includes('@') ? name : `${name}@${domain.name}`
    );
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
        `To: ${to.join(', ')}`,
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
