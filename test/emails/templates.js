/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Email = require('email-templates');
const nodemailer = require('nodemailer');
const test = require('ava');

const config = require('#config');

// renders the real templates (layout, partials, i18n, juice) without sending
const renderer = new Email({
  ...config.email,
  send: true,
  preview: false,
  transport: nodemailer.createTransport({ jsonTransport: true })
});

const now = new Date();
const domain = {
  id: 'd1',
  name: 'example.com',
  plan: 'free',
  created_at: now,
  has_mx_record: false,
  has_txt_record: true,
  has_spf_record: false,
  has_dkim_record: false,
  has_dmarc_record: false,
  has_strict_dmarc: false,
  ignore_mx_check: false,
  logCount: 12,
  messages: 1234,
  spfAlignedPct: 98,
  dkimAlignedPct: 97
};
const user = {
  id: 'u1',
  email: 'jane@example.com',
  plan: 'free',
  created_at: now,
  locale: 'en'
};
const locals = {
  user,
  to: user.email,
  email: user.email,
  domain,
  domains: [domain],
  aliases: [{ id: 'a1', name: 'hello' }],
  payment: {
    id: 'p1',
    amount: 300,
    amount_refunded: 0,
    method: 'visa',
    plan: 'enhanced_protection',
    duration: 2_592_000_000,
    kind: 'one-time',
    invoice_at: now,
    created_at: now,
    reference: 'ABC123'
  },
  plan: 'enhanced_protection',
  link: `${config.urls.web}/en/my-account`,
  message: 'Example message.',
  locale: 'en',
  isDate: true,
  renewalDate: now,
  firstChargeDate: now,
  receiptHTML: '<table><tr><td>Enhanced Protection</td></tr></table>',
  aliasAddress: 'hello@example.com',
  hasEncryptedTxtRecord: false,
  records: [],
  logs: [],
  features: {
    using: [{ title: 'Outbound SMTP', description: 'Send as your domain.' }],
    missing: [
      {
        title: 'Calendar Sync (CalDAV)',
        description: 'Sync calendars across all your devices.',
        link: `${config.urls.web}/en/faq#do-you-support-caldav`
      }
    ]
  },
  stats: {
    total: 100,
    delivered: 90,
    spam: 5,
    virus: 1,
    bounceCategories: [],
    responseCodes: [],
    totalMessages: 1234,
    totalReports: 12,
    accepted: 1200,
    quarantined: 20,
    rejected: 14,
    spfAlignedPct: 98,
    dkimAlignedPct: 97
  }
};

async function render(template, extra = {}) {
  const info = await renderer.send({
    template,
    message: { to: user.email },
    locals: { ...locals, ...extra }
  });
  return JSON.parse(info.message).html;
}

const templates = [
  'daily-log-alert',
  'dmarc-issue',
  'domain-configuration-issue',
  'domain-onboard',
  'domain-verified',
  'feature-reminder',
  'holiday-2025',
  'launch',
  'past-due-relief',
  'payment',
  'payment-reminder',
  'phishing-alert',
  'self-test',
  'subscription-renewal-reminder',
  'two-factor-reminder',
  'visa-trial-subscription-requirement',
  'weekly-dmarc-report',
  'welcome',
  'welcome-mailbox'
];

for (const template of templates) {
  test(`${template} renders the brand header without legacy illustrations`, async (t) => {
    const html = await render(template);
    t.notRegex(html, /img\/(emails|articles)\//);
    t.true(html.includes('logo-square-180x180'));
    t.regex(html, /class="email-brand"[^>]*>[\s\S]*?Forward Email/);
  });
}

// locals shaped like what each sender passes (see jobs/ and helpers/)
const callerLocals = {
  'self-test': { locale: 'en' },
  'phishing-alert': { locale: 'en', domain: 'example.com' },
  'welcome-mailbox': { locale: 'en', aliasAddress: 'hello@example.com' },
  'past-due-relief': { user: { ...user, plan: 'enhanced_protection' } }
};

async function renderAsCaller(template, extra = {}) {
  if (!callerLocals[template]) return render(template, extra);
  const info = await renderer.send({
    template,
    message: { to: user.email },
    locals: { ...callerLocals[template], ...extra }
  });
  return JSON.parse(info.message).html;
}

// body content only (the footer links webmail and downloads in every email)
function body(html) {
  return html.slice(0, html.lastIndexOf('<footer'));
}

// emails that describe the product list what ships today
for (const template of [
  'welcome',
  'self-test',
  'dmarc-issue',
  'phishing-alert',
  'past-due-relief',
  'feature-reminder',
  'welcome-mailbox'
]) {
  test(`${template} links webmail, the download page, and the security audit`, async (t) => {
    const html = body(await renderAsCaller(template));
    t.true(html.includes('https://mail.forwardemail.net'));
    t.true(html.includes(`${config.urls.web}/en/download`));
    t.true(
      html.includes(`${config.urls.web}/pentest-report_forward-email.pdf`)
    );
    t.false(html.includes('years and counting'));
  });
}

test('links follow the recipient locale', async (t) => {
  const html = body(await renderAsCaller('self-test', { locale: 'de' }));
  t.true(html.includes(`${config.urls.web}/de/download`));
  t.false(html.includes(`${config.urls.web}/en/download`));
});

test('feature list marks mailbox features as paid for free-plan users', async (t) => {
  const html = body(await render('welcome'));
  t.true(html.includes('Enhanced Protection'));
  // the web app button is only offered once the account has mailboxes
  t.notRegex(html, /btn[^"]*"[^>]*href="https:\/\/mail\.forwardemail\.net"/);
  const paid = body(
    await render('welcome', { user: { ...user, plan: 'enhanced_protection' } })
  );
  t.regex(paid, /btn[^"]*"[^>]*href="https:\/\/mail\.forwardemail\.net"/);
});

test('feature-reminder no longer lists shipped features as upcoming', async (t) => {
  const html = await render('feature-reminder');
  t.false(html.includes('Coming Soon'));
  t.false(html.includes('3rd Party Security Audit'));
  t.true(html.includes(`${config.urls.web}/en/blog/docs/mcp`));
});

test('footer links webmail and downloads', async (t) => {
  const html = await render('welcome');
  const footer = html.slice(html.lastIndexOf('<footer'));
  t.regex(footer, /href="https:\/\/mail\.forwardemail\.net"/);
  t.regex(footer, /\/en\/download"/);
});
