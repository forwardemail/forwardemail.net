/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');

const Email = require('email-templates');
const nodemailer = require('nodemailer');
const pug = require('pug');
const sharp = require('sharp');
const test = require('ava');
const { JSDOM } = require('jsdom');

const config = require('#config');
const i18n = require('#helpers/i18n');

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
  'free-plan-intro',
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
  'free-plan-intro': { locale: 'en', domain: 'example.com' },
  'upgrade-reminder': {
    locale: 'en',
    domain: 'example.xyz',
    isGood: false,
    isDisposable: false,
    isRestricted: false
  },
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
  'free-plan-intro',
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

test('the one-time free plan email names the domain and what to do next', async (t) => {
  const info = await renderer.send({
    template: 'free-plan-intro',
    message: { to: user.email },
    locals: callerLocals['free-plan-intro']
  });
  const { subject, html } = JSON.parse(info.message);
  t.true(subject.endsWith('example.com forwards mail with Forward Email'));
  const content = body(html);
  t.true(content.includes('example.com'));
  t.true(content.includes(`${config.urls.web}/en/encrypt`));
  t.true(content.includes(`${config.urls.web}/en/register`));
  // (the tour, the apps and the terminal app: each video's poster, linked
  //  to where the site plays it, and Terminal Email)
  const { document } = new JSDOM(content).window;
  for (const [file, href] of [
    ['forward-email', `${config.urls.web}/en#video`],
    ['forward-email-apps', `${config.urls.web}/en/download#video`],
    ['forward-email-terminal', `${config.urls.web}/en/download#video-terminal`]
  ]) {
    const links = [...document.querySelectorAll(`a[href="${href}"]`)];
    t.is(links.length, 2, `${file}`);
    const poster = links[0].querySelector('img');
    t.regex(
      poster.getAttribute('src'),
      new RegExp(`/img/video/${file}-play(-[\\da-f]+)?\\.jpg$`),
      `${file}`
    );
    t.truthy(poster.getAttribute('alt'));
  }

  t.truthy(document.querySelector('a[href="https://terminalemail.com"]'));

  // (a mail client cannot layer a play button over a picture, so each
  //  poster has one drawn into its middle: blue on white, where the plain
  //  poster is dark)
  for (const file of [
    'forward-email',
    'forward-email-apps',
    'forward-email-terminal'
  ]) {
    const dir = path.join(__dirname, '..', '..', 'assets', 'img', 'video');
    const middle = (name) =>
      sharp(path.join(dir, name))
        .extract({ left: 636, top: 356, width: 8, height: 8 })
        .raw()
        .toBuffer();
    const [r, g, b] = await middle(`${file}-play.jpg`);
    t.true(b > 190 && r < 90 && g < 140, `${file} ${r},${g},${b}`);
    const { width, height } = await sharp(
      path.join(dir, `${file}-play.jpg`)
    ).metadata();
    t.deepEqual([width, height], [1280, 720], `${file}`);
  }

  // (it thanks them, says what the service is now, and links each part to
  //  its page or its answer in the FAQ)
  t.true(content.includes('Thank you for using Forward Email.'));
  for (const href of [
    `${config.urls.web}/en/private-business-email`,
    `${config.urls.web}/en/email-api`,
    `${config.urls.web}/en/faq#do-you-support-receiving-email-with-imap`,
    `${config.urls.web}/en/faq#do-you-support-sending-email-with-smtp`,
    `${config.urls.web}/en/faq#what-is-included-in-the-enterprise-license`,
    `${config.urls.web}/en/faq#how-do-you-protect-against-spam-and-abuse`,
    `${config.urls.web}/en/faq#can-i-keep-my-email-processing-and-storage-in-the-eu-data-residency`,
    `${config.urls.web}/en/faq#do-you-support-newsletters-or-mailing-lists-for-marketing-related-email`,
    'https://privacyratings.com',
    'https://attestium.com',
    'https://spamscanner.net',
    'https://github.com/forwardemail',
    'https://matrix.to/#/#forwardemail:matrix.org'
  ])
    t.truthy(document.querySelector(`a[href="${href}"]`), `${href}`);
  t.true(content.includes('Coming in 2027, at no extra cost'));
  // (where updates are: X and the Event Feed, which a calendar can follow)
  t.true(content.includes('https://x.com/fwdemail'));
  t.true(content.includes(`${config.urls.web}/en/event-feed`));
  t.false(content.includes('/blog/docs"'));
  t.true(content.includes(`${config.urls.web}/technical-whitepaper.pdf`));
  // (it says it is sent once)
  t.true(content.includes('You will not receive it again'));
});

test('the upgrade reminder gives no deadline that has passed, and one name for what happened', async (t) => {
  const info = await renderer.send({
    template: 'upgrade-reminder',
    message: { to: user.email },
    locals: callerLocals['upgrade-reminder']
  });
  const { subject, html } = JSON.parse(info.message);
  t.true(subject.endsWith('Email forwarding paused for example.xyz'));
  t.false(html.includes('March 31'));
  t.notRegex(html, /upgrade to a paid plan by/);
  t.false(html.includes('suspended'));
  t.false(html.includes('deliverablity'));
  // (the heading is not repeated under itself)
  t.is(html.split('Email forwarding is paused').length - 1, 1);
});

test('an email opens in the inbox list with a line of its own', async (t) => {
  const html = await render('welcome');
  const { document } = new JSDOM(html).window;
  const preheader = document.querySelector('.email-preheader');
  t.truthy(preheader);
  t.regex(preheader.getAttribute('style'), /display:\s*none/);
  t.true(preheader.textContent.includes('Add your domain'));
  // (before the header, which is what was shown otherwise)
  t.is(preheader.nextElementSibling, document.querySelector('.email-header'));
  // an email without one renders an empty, hidden line
  const alert = new JSDOM(await render('alert')).window.document;
  t.is(alert.querySelector('.email-preheader').textContent.trim(), '');
});

test('the domain emails share one verification status block', async (t) => {
  for (const template of [
    'domain-onboard',
    'domain-verified',
    'domain-configuration-issue'
  ]) {
    const html = await render(template, {
      domain: { ...domain, plan: 'enhanced_protection' }
    });
    t.is(html.split('Verification Status').length - 1, 1, `${template}`);
    t.true(html.includes('DMARC'), `${template}`);
  }
});

test('an ignored MX check is noted on the dark panel, in its own line', async (t) => {
  const html = await render('domain-onboard', {
    domain: { ...domain, ignore_mx_check: true, has_mx_record: false }
  });
  const { document } = new JSDOM(html).window;
  const note = [...document.querySelectorAll('.bg-dark .text-white')].find(
    (element) => element.textContent.includes('MX check ignored')
  );
  t.truthy(note);
  t.is(note.textContent.trim(), '(i) = MX check ignored');
});

test('emails call a mailbox a mailbox', async (t) => {
  const verified = await render('domain-verified', {
    domain: { ...domain, plan: 'enhanced_protection', has_mx_record: true }
  });
  t.true(verified.includes('Manage mailboxes'));
  t.false(verified.includes('Manage aliases'));
  const welcome = await render('welcome');
  t.true(welcome.includes('Manage your mailboxes'));
});

test('the footer has the unsubscribe link without an account too', async (t) => {
  const unsubscribeUrl = `${config.urls.web}/en/unsubscribe/token`;
  const footerOf = (html) => html.slice(html.lastIndexOf('<footer'));
  // (an address without an account: no `user`)
  const intro = await renderAsCaller('free-plan-intro', { unsubscribeUrl });
  t.true(footerOf(intro).includes(`href="${unsubscribeUrl}"`));
  // an account, as before
  const welcome = await render('welcome', { unsubscribeUrl });
  t.true(footerOf(welcome).includes(`href="${unsubscribeUrl}"`));
  const account = await render('welcome');
  t.true(footerOf(account).includes('/en/my-account/profile"'));
  // an email that cannot be unsubscribed from, to no account: no link
  const alert = await renderAsCaller('free-plan-intro');
  t.false(footerOf(alert).includes('Unsubscribe'));
});

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

test('the wordmark uses the site font and weight', async (t) => {
  const html = await render('welcome');
  // the site's Nunito Sans is loaded where the client allows web fonts
  for (const weight of [400, 700])
    t.true(
      html.includes(
        `url('${config.urls.web}/fonts/nunito-sans-latin-${weight}.woff2')`
      )
    );
  // same size and weight as the wordmark in the site navigation
  const brand = html.match(/class="email-brand"[^>]*style="([^"]*)"/);
  t.truthy(brand);
  t.regex(brand[1], /font-size: 17px/);
  t.regex(brand[1], /font-weight: 700/);
});

test('long code lines wrap between words, not inside them', async (t) => {
  // system alerts list IDs in <code>; break-all split every word ("Missing
  // Domain I" / "D") instead of only a word too long for the line
  const html = await render('alert', {
    message:
      '<ul><li><code class="small">Alias ID: 6abd5e46f6134a99671bddca, Domain ID: 6abd5e46f6134a99671bddcc</code></li></ul>'
  });
  const code = html.match(/<code class="small"[^>]*style="([^"]*)"/);
  t.truthy(code);
  t.notRegex(code[1], /break-all/);
  // (`anywhere` would also let a table cell shrink below a short value)
  t.notRegex(code[1], /anywhere/);
  t.regex(code[1], /overflow-wrap: break-word/);
});

// WCAG contrast ratio of two #rrggbb colors
function contrast(a, b) {
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.039_28 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const outboundEmail = {
  envelope: { from: 'jane@example.com', to: ['bob@example.org'] },
  messageId: '<123@example.com>',
  subject: 'Hello',
  date: now
};
const smtpResponse =
  "Link hostname of example.org was detected by Cloudflare's Family DNS to contain adult-related content, phishing, and/or malware.";

for (const [template, extra] of [
  [
    'smtp-prevented',
    {
      email: outboundEmail,
      truthSource: 'cloudflare.com',
      category: 'Spam',
      responseCode: 554,
      response: smtpResponse
    }
  ],
  [
    'smtp-suspended',
    {
      email: outboundEmail,
      truthSource: 'cloudflare.com',
      category: 'Spam',
      responseCode: 554,
      response: smtpResponse,
      detectionCount: 3,
      threshold: 3,
      uniqueRecipients: 3
    }
  ],
  ['dmarc-issue', { response: smtpResponse, dmarc: { result: 'fail' } }]
]) {
  test(`${template} code blocks are dark text on a light panel`, async (t) => {
    const html = await render(template, extra);
    const blocks = [
      ...html.matchAll(
        /<pre[^>]*style="([^"]*)"[^>]*>\s*<code[^>]*style="([^"]*)"/g
      )
    ];
    t.true(blocks.length > 0);
    for (const [, pre, code] of blocks) {
      const background = pre.match(/background-color: (#[\da-f]{6})/i)[1];
      // the text color is the code color, or the pre color it inherits
      const textColor = (style) =>
        style.match(/(?:^|;)\s*color: (#[\da-f]{6})/i)?.[1];
      const color = textColor(code) || textColor(pre);
      t.true(
        contrast(color, background) >= 7,
        `${color} on ${background} is ${contrast(color, background).toFixed(
          2
        )}:1`
      );
      // still readable in a client that drops the panel's background, and
      // the reverse: a client that drops the text color shows its default
      // (black) on the panel
      t.true(contrast(color, '#ffffff') >= 7, `${color} on white`);
      t.true(contrast('#000000', background) >= 7, `black on ${background}`);
    }
  });
}

// a regex alias name may hold "<", ">" and quotes (see `Aliases`), and the
// recipient of this email is any address the domain admin entered
test('recipient-verification escapes the alias and recipient addresses', async (t) => {
  const fromEmail =
    '/<a href=https://evil.example/login>click to verify</a>/@example.com';
  const toEmail = 'victim@example.org';
  const html = await render('recipient-verification', {
    fromEmail,
    toEmail,
    link: `${config.urls.web}/v/x`
  });
  t.false(html.includes('href="https://evil.example/login"'));
  t.false(html.includes('<a href=https://evil.example/login>'));
  t.true(html.includes('&lt;a href=https://evil.example/login&gt;'));
});

test('change-email escapes both addresses', async (t) => {
  const html = await render('change-email', {
    user: {
      ...user,
      [config.userFields.changeEmailNewAddress]:
        '"<a href=//evil.example>x</a>"@example.org',
      [config.userFields.changeEmailTokenExpiresAt]: new Date(
        Date.now() + 60_000
      )
    }
  });
  t.false(html.includes('<a href=//evil.example>'));
  t.true(html.includes('&lt;a href=//evil.example&gt;'));
});

//
// Every template, in English and in German (longer strings wrap and hit
// more of the layout), with locals shaped like each sender's: every piece
// of text must be at least 4.5:1 against the background it sits on. The
// colors are read from the inlined styles the way a client reads them: a
// text node takes the color of its nearest element that sets one, over the
// background of its nearest element that paints one (white otherwise).
//
const emailsDir = path.join(__dirname, '..', '..', 'emails');
const allTemplates = fs
  .readdirSync(emailsDir)
  .filter((name) => fs.existsSync(path.join(emailsDir, name, 'html.pug')));

const readabilityLocals = {
  email: outboundEmail,
  truthSource: 'apple.com',
  category: 'Spam',
  responseCode: 550,
  response:
    '554 5.7.1 [HM08] Message rejected due to local policy. Please visit https://support.apple.com/en-us/HT204137. Txn ID 4fbc0af0-417e-4180-91d8-66754d53a162',
  detectionCount: 3,
  threshold: 3,
  uniqueRecipients: 3,
  uniqueTruthSources: 1,
  dmarc: { result: 'fail' },
  // system alerts carry inline code and code blocks in their message
  message:
    '<p>Alias <code>hello@example.com</code> failed:</p><pre><code>Alias ID: 6abd5e46f6134a99671bddca\nhttps://example.com/x</code></pre>',
  inquiry: {
    id: 'i1',
    message: 'Hello\n<pre><code>dig example.com txt</code></pre>',
    subject: 'Help',
    created_at: now
  },
  accountUpdates: [
    { name: config.passport.fields.otpEnabled, current: true },
    { name: 'email', text: 'Email', redacted: true },
    { name: 'has_newsletter', text: 'Newsletter', current: false }
  ],
  domainUpdates: [
    {
      name: 'has_smtp',
      text: 'Outbound SMTP',
      current: true,
      previous: false,
      changedByEmail: 'jane@example.com',
      ip: '127.0.0.1',
      userAgent: 'curl/8',
      isAdmin: false,
      isSystem: false,
      changed_at: now
    },
    { name: 'secret', text: 'Secret', redacted: true, isAdmin: true },
    { name: 'note', text: 'Note', current: 'a', previous: 'b', isSystem: true }
  ],
  timezone: 'UTC',
  domainName: 'example.com',
  alias: 'hello@example.com',
  destination: 'bob@example.org',
  isMailbox: false,
  isWebhook: false,
  status: 'bounced',
  isRetryWindowExceeded: true,
  retryWindow: '5 days',
  interval: '1 day',
  error:
    '550 5.1.1 <bob@example.org>: Recipient address rejected: User unknown',
  from: 'jane@example.com',
  subject: 'Hello',
  messageId: '<1@example.com>',
  date: now
};

// a CSS color as [r, g, b], or null for none or transparent
function rgb(value) {
  if (!value) return null;
  const color = value.trim().toLowerCase();
  if (color === 'white') return [255, 255, 255];
  if (color === 'black') return [0, 0, 0];
  let match = /^#([\da-f])([\da-f])([\da-f])$/.exec(color);
  if (match) return match.slice(1).map((h) => Number.parseInt(`${h}${h}`, 16));
  // #rrggbb, or #rrggbbaa painted over white
  match = /^#([\da-f]{6})([\da-f]{2})?$/.exec(color);
  if (match) {
    const alpha = match[2] ? Number.parseInt(match[2], 16) / 255 : 1;
    return [0, 2, 4].map((i) => {
      const c = Number.parseInt(match[1].slice(i, i + 2), 16);
      return Math.round(c * alpha + 255 * (1 - alpha));
    });
  }

  match = /^rgba?\(([^)]+)\)$/.exec(color);
  if (match) {
    const [r, g, b, a = 1] = match[1].split(',').map(Number);
    if (a === 0) return null;
    return [r, g, b].map((c) => Math.round(c * a + 255 * (1 - a)));
  }

  return null;
}

const hex = (color) =>
  `#${color.map((c) => c.toString(16).padStart(2, '0')).join('')}`;

function declaration(element, property) {
  let value = null;
  for (const part of (element.getAttribute('style') || '').split(';')) {
    const i = part.indexOf(':');
    if (i !== -1 && part.slice(0, i).trim().toLowerCase() === property)
      value = part.slice(i + 1).replace(/!important/i, '');
  }

  return value;
}

// text that is only emoji or symbols draws in its own colors
const PICTOGRAPHIC = /^[\p{Extended_Pictographic}️‍\s()+=]+$/u;

for (const template of allTemplates) {
  test(`${template} has readable text in English and German`, async (t) => {
    for (const locale of ['en', 'de']) {
      const html = await render(template, {
        ...readabilityLocals,
        // the support reply is an object, not an SMTP response
        ...(template === 'inquiry-response'
          ? {
              response: {
                message:
                  'Hi\n<pre><code>dig example.com txt</code></pre>\nUse <code>inline</code>.'
              }
            }
          : {}),
        locale
      });
      const { window } = new JSDOM(html);
      const { document, NodeFilter } = window;
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
      );
      const failures = new Set();
      while (walker.nextNode()) {
        const text = walker.currentNode.textContent.trim();
        if (!text || PICTOGRAPHIC.test(text)) continue;
        let color = null;
        let background = null;
        for (
          let element = walker.currentNode.parentElement;
          element && (!color || !background);
          element = element.parentElement
        ) {
          color ||= rgb(declaration(element, 'color'));
          background ||=
            rgb(declaration(element, 'background-color')) ||
            rgb(element.getAttribute('bgcolor'));
        }

        color ||= [0, 0, 0];
        background ||= [255, 255, 255];
        const ratio = contrast(hex(color), hex(background));
        if (ratio < 4.5)
          failures.add(
            `${locale}: "${text.slice(0, 40)}" ${hex(color)} on ${hex(
              background
            )} is ${ratio.toFixed(2)}:1`
          );
      }

      window.close();
      t.deepEqual([...failures], [], `${template} (${locale})`);
    }
  });
}

//
// Tables: a table wider than the screen scrolls sideways in its wrapper
// instead of being cut off by the card around it, and short values (a
// response code, a status, a button) are never split across lines ("421"
// used to render as "42" / "1").
//

// the receipt the payment email includes (see `Payments.getPDFReceipt`)
function renderReceipt() {
  const l = (p = '') => `/en${p}`;
  return pug.renderFile(
    path.join(config.views.root, 'my-account', 'billing', '_receipt.pug'),
    {
      ...config.views.locals,
      ctx: {
        path: l('/my-account/billing/ABC123'),
        pathWithoutLocale: '/my-account/billing/ABC123',
        get: () => ''
      },
      l,
      locale: 'en',
      payment: locals.payment,
      user,
      isPDF: true,
      returnHTML: true,
      t: (phrase, ...args) => i18n.api.t({ phrase, locale: 'en' }, ...args)
    }
  );
}

const tableLocals = {
  ...readabilityLocals,
  stats: {
    ...locals.stats,
    bounceCategories: { blocklist: 3 },
    responseCodes: {
      421: {
        totalCount: 3,
        messages: [
          {
            text: '421 4.7.0 Messages temporarily deferred due to unexpected volume or user complaints',
            count: 3
          }
        ]
      }
    }
  },
  topReporters: [{ name: 'example.org', reports: 1, messages: 3 }],
  topIpIssues: [
    {
      ip: '192.0.2.1',
      count: 3,
      spfResult: 'fail',
      dkimResult: 'pass',
      disposition: 'quarantine'
    }
  ]
};

// the nearest ancestor that scrolls sideways, as a client reads the inlined
// styles
function scroller(element) {
  for (let el = element.parentElement; el; el = el.parentElement) {
    if (['auto', 'scroll'].includes(declaration(el, 'overflow-x')?.trim()))
      return el;
  }

  return null;
}

test('every table scrolls sideways instead of being cut off', async (t) => {
  const receiptHTML = renderReceipt();
  let count = 0;
  for (const template of allTemplates) {
    const html = await render(template, {
      ...tableLocals,
      receiptHTML,
      // (the support reply is an object, not an SMTP response)
      ...(template === 'inquiry-response'
        ? { response: { message: 'Hi' } }
        : {})
    });
    const { window } = new JSDOM(html);
    for (const table of window.document.querySelectorAll('table')) {
      count++;
      t.truthy(
        scroller(table),
        `${template}: ${table.textContent.trim().slice(0, 40)}`
      );
    }

    window.close();
  }

  // (daily and weekly reports, account summaries, receipts, outbound SMTP,
  // DMARC and domain setting emails)
  t.true(count >= 20, `${count} tables`);
});

test('short values in a table stay on one line', async (t) => {
  for (const template of [
    'daily-log-alert',
    'weekly-dmarc-report',
    'smtp-prevented',
    'dmarc-issue',
    'domain-update',
    'payment-reminder'
  ]) {
    const html = await render(template, tableLocals);
    const { window } = new JSDOM(html);
    const cells = window.document.querySelectorAll('td, th');
    t.true(cells.length > 0, `${template}`);
    for (const cell of cells) {
      // (code blocks wrap inside their panel)
      for (const el of [cell, ...cell.querySelectorAll('*')]) {
        if (el.closest('pre')) continue;
        const what = `${template}: <${el.tagName.toLowerCase()}> "${el.textContent
          .trim()
          .slice(0, 30)}"`;
        // these let the table squeeze a column below its shortest value
        t.not(declaration(el, 'overflow-wrap')?.trim(), 'anywhere', `${what}`);
        t.notRegex(
          declaration(el, 'word-break') || '',
          /break-word|break-all/,
          `${what}`
        );
      }

      for (const el of cell.querySelectorAll('.badge, .btn'))
        t.is(
          declaration(el, 'white-space')?.trim(),
          'nowrap',
          `${el.textContent}`
        );
    }

    window.close();
  }

  // the response code badge in the daily report
  const html = await render('daily-log-alert', tableLocals);
  t.regex(html, /<span class="badge"[^>]*white-space: nowrap[^>]*>421<\/span>/);
});

test('an expired card subscription links to updating the payment method', async (t) => {
  const expired = {
    ...user,
    plan: 'enhanced_protection',
    [config.userFields.planExpiresAt]: new Date(Date.now() - 86_400_000),
    [config.userFields.stripeSubscriptionID]: 'sub_test'
  };
  const html = await render('welcome', { user: expired });
  t.regex(
    html,
    new RegExp(
      `href="${config.urls.web}/en/my-account/billing/update-card"[^>]*>update payment method<`
    )
  );

  // without auto-renew it asks for a payment
  delete expired[config.userFields.stripeSubscriptionID];
  t.regex(
    await render('welcome', { user: expired }),
    new RegExp(
      `href="${config.urls.web}/en/my-account/billing/make-payment"[^>]*>Make payment<`
    )
  );
});
