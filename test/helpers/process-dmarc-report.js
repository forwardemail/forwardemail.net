/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Aggregate reports sent to a domain's public `rua=` address
// (dmarc-<id>@WEB_HOST): a report about another domain is not stored, a
// report that did not pass DMARC cannot use up the daily limit of reports
// that did, and the envelope sender is only a truth source when SPF passed.
//

const zlib = require('node:zlib');
const { randomUUID } = require('node:crypto');

const Redis = require('ioredis-mock');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const test = require('ava');

const utils = require('../utils');

const config = require('#config');
const Logs = require('#models/logs');
const { processDmarcReport } = require('#helpers/process-dmarc-report');

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);
test.beforeEach(utils.setupFactories);
test.beforeEach(async (t) => {
  t.context.client = new Redis({ keyPrefix: randomUUID() });
  const user = await t.context.userFactory
    .withState({ plan: 'enhanced_protection' })
    .create();
  t.context.domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: 'enhanced_protection',
      skip_verification: true
    })
    .create();
});

function report(domain, id = randomUUID()) {
  // (the report covers yesterday)
  const end = Math.floor(Date.now() / 1000);
  const begin = end - 86_400;
  return `<?xml version="1.0" encoding="UTF-8"?>
<feedback>
  <report_metadata>
    <org_name>Example Reporter</org_name>
    <email>noreply-dmarc@reporter.example.com</email>
    <report_id>${id}</report_id>
    <date_range><begin>${begin}</begin><end>${end}</end></date_range>
  </report_metadata>
  <policy_published>
    <domain>${domain}</domain><adkim>r</adkim><aspf>r</aspf>
    <p>reject</p><sp>reject</sp><pct>100</pct><fo>0</fo>
  </policy_published>
  <record>
    <row>
      <source_ip>203.0.113.1</source_ip><count>1</count>
      <policy_evaluated><disposition>none</disposition><dkim>pass</dkim><spf>pass</spf></policy_evaluated>
    </row>
    <identifiers><header_from>${domain}</header_from></identifiers>
    <auth_results><spf><domain>${domain}</domain><result>pass</result></spf></auth_results>
  </record>
</feedback>`;
}

async function send(
  t,
  { policyDomain, mailFrom, spf = 'none', dmarc = 'none' }
) {
  const info = await nodemailer
    .createTransport({ streamTransport: true, buffer: true })
    .sendMail({
      from: mailFrom,
      to: `dmarc-${t.context.domain.id}@${config.webHost}`,
      subject: 'Report Domain: example',
      text: 'DMARC aggregate report',
      attachments: [
        {
          filename: 'report.xml.gz',
          contentType: 'application/gzip',
          content: zlib.gzipSync(report(policyDomain))
        }
      ]
    });
  const session = {
    remoteAddress: '203.0.113.9',
    envelope: {
      mailFrom: { address: mailFrom },
      rcptTo: [{ address: `dmarc-${t.context.domain.id}@${config.webHost}` }]
    },
    spf: { status: { result: spf } },
    dmarc: { status: { result: dmarc } }
  };
  return processDmarcReport(session, info.message, null, t.context.client);
}

async function count(t) {
  const logs = await stored(t);
  return logs.length;
}

function stored(t) {
  return Logs.find({
    is_dmarc_report: true,
    domains: new mongoose.Types.ObjectId(t.context.domain.id)
  })
    .lean()
    .exec();
}

test('does not store a report about another domain', async (t) => {
  const result = await send(t, {
    policyDomain: 'some-other-domain.example.net',
    mailFrom: 'noreply-dmarc@reporter.example.com',
    dmarc: 'pass'
  });
  t.true(result?.rejected);
  t.is(await count(t), 0);

  // a report about the domain is stored
  await send(t, {
    policyDomain: t.context.domain.name,
    mailFrom: 'noreply-dmarc@reporter.example.com',
    dmarc: 'pass'
  });
  t.is(await count(t), 1);
});

test('unauthenticated reports do not use up the daily limit of authenticated ones', async (t) => {
  const { client, domain } = t.context;
  const dateKey = new Date().toISOString().split('T')[0];
  // (as if other senders already sent today's limit of unauthenticated reports)
  await client.set(
    `dmarc_rate:domain:${domain.id}:unauthenticated:${dateKey}`,
    100
  );
  await send(t, {
    policyDomain: domain.name,
    mailFrom: 'anyone@unauthenticated-reporter.example.com',
    dmarc: 'fail'
  });
  t.is(await count(t), 0);

  await send(t, {
    policyDomain: domain.name,
    mailFrom: 'noreply-dmarc@reporter.example.com',
    dmarc: 'pass'
  });
  t.is(await count(t), 1);
});

test('the envelope sender is only a truth source when SPF passed', async (t) => {
  const { truthSources } = config;
  config.truthSources = new Set([...truthSources, 'reporter.example.com']);
  t.teardown(() => {
    config.truthSources = truthSources;
  });

  await send(t, {
    policyDomain: t.context.domain.name,
    mailFrom: 'noreply-dmarc@reporter.example.com',
    spf: 'softfail',
    dmarc: 'pass'
  });
  await send(t, {
    policyDomain: t.context.domain.name,
    mailFrom: 'noreply-dmarc@reporter.example.com',
    spf: 'pass',
    dmarc: 'pass'
  });
  const logs = await stored(t);
  t.is(logs.length, 2);
  t.deepEqual(logs.map((log) => log.meta.dmarc_report.is_truth_source).sort(), [
    false,
    true
  ]);
});
