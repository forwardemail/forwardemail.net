/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');
const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');

const Domains = require('#models/domains');
const config = require('#config');
const { isSetupComplete } = require('#helpers/is-setup-complete');

// the first-run wizard only exists in self-hosted mode
async function ensureSetupEnabled(ctx, next) {
  if (!config.isSelfHosted) throw Boom.notFound();

  ctx.state.setupComplete = await isSetupComplete();
  return next();
}

// GET /setup — route the operator to the right step
async function dispatch(ctx) {
  // step 1: no admin exists yet — create the admin account
  // (reuses the entire POST /register pipeline; session.returnTo brings the
  // freshly registered admin straight back into the wizard)
  if (!ctx.state.setupComplete) {
    ctx.session.returnTo = ctx.state.l('/setup');
    return ctx.render('setup/index');
  }

  if (!ctx.isAuthenticated())
    return ctx.redirect(
      ctx.state.l(`/login?return_to=${encodeURIComponent('/setup')}`)
    );

  if (ctx.state.user.group !== 'admin')
    return ctx.redirect(ctx.state.l('/my-account'));

  // step 2: no domain yet — create one
  const domain = await Domains.findOne({
    'members.user': ctx.state.user._id,
    is_global: false
  })
    .sort('created_at')
    .lean()
    .exec();

  if (!domain) return ctx.redirect(ctx.state.l('/setup/domain'));

  // step 3: domain exists — show the DNS checklist
  return ctx.redirect(
    ctx.state.l(`/setup/dns/${punycode.toASCII(domain.name)}`)
  );
}

// GET /setup/dns/:domain_id — DNS checklist with live status
// (runs after web.myAccount.retrieveDomain, which sets ctx.state.domain,
// ctx.state.exchanges and ctx.state.isSelfHosted)
async function retrieveDnsStatus(ctx) {
  const { domain } = ctx.state;
  const exchange =
    Array.isArray(ctx.state.exchanges) && ctx.state.exchanges.length > 0
      ? ctx.state.exchanges[0]
      : config.exchanges[0];

  const [verification, smtp] = await Promise.all([
    Domains.getVerificationResults(domain, ctx.resolver, true),
    Domains.verifySMTP(domain, ctx.resolver)
  ]);

  // A/AAAA records on the MX host (self-hosters run the MX themselves)
  const addresses = [];
  let hasA = false;
  let hasAAAA = false;

  try {
    const records = await ctx.resolver.resolve(exchange, 'A', {
      purgeCache: true
    });
    hasA = Array.isArray(records) && records.length > 0;
    if (hasA) addresses.push(...records);
  } catch (err) {
    ctx.logger.debug(err);
  }

  try {
    const records = await ctx.resolver.resolve(exchange, 'AAAA', {
      purgeCache: true
    });
    hasAAAA = Array.isArray(records) && records.length > 0;
    if (hasAAAA) addresses.push(...records);
  } catch (err) {
    ctx.logger.debug(err);
  }

  // PTR / reverse DNS (warning-level: set at the VPS provider, not the zone)
  let ptr = false;
  for (const address of addresses) {
    try {
      const hostnames = await ctx.resolver.reverse(address);
      if (Array.isArray(hostnames) && hostnames.includes(exchange)) {
        ptr = true;
        break;
      }
    } catch (err) {
      ctx.logger.debug(err);
    }
  }

  const checklist = [
    {
      key: 'a',
      name: exchange,
      type: 'A',
      expected: ctx.translate('SETUP_DNS_A_EXPECTED'),
      pass: hasA || hasAAAA,
      required: true
    },
    {
      key: 'mx',
      name: '@',
      type: 'MX',
      expected: exchange,
      pass: verification.mx,
      required: true
    },
    {
      key: 'txt',
      name: '@',
      type: 'TXT',
      expected: `${config.recordPrefix}-site-verification=${domain.verification_record}`,
      pass: verification.txt,
      required: true
    },
    {
      key: 'spf',
      name: '@',
      type: 'TXT',
      expected: 'v=spf1 mx ~all',
      pass: smtp.spf,
      required: true
    },
    {
      key: 'dkim',
      name: `${domain.dkim_key_selector}._domainkey`,
      type: 'TXT',
      expected: `v=DKIM1; k=rsa; p=${
        domain.dkim_public_key
          ? Buffer.from(
              domain.dkim_public_key.buffer || domain.dkim_public_key
            ).toString('base64')
          : ''
      };`,
      pass: smtp.dkim,
      required: true
    },
    {
      key: 'return_path',
      name: domain.return_path,
      type: 'CNAME',
      expected: config.webHost,
      pass: smtp.returnPath,
      required: true
    },
    {
      key: 'dmarc',
      name: '_dmarc',
      type: 'TXT',
      expected: `v=DMARC1; p=quarantine; rua=mailto:dmarc@${domain.name}`,
      pass: smtp.dmarc,
      required: true
    },
    {
      key: 'ptr',
      name: addresses.length > 0 ? addresses.join(', ') : exchange,
      type: 'PTR',
      expected: exchange,
      pass: ptr,
      required: false
    }
  ];

  ctx.state.checklist = checklist;
  ctx.state.setupCompleteAllPass = checklist
    .filter((record) => record.required)
    .every((record) => record.pass);

  if (ctx.accepts('html')) return ctx.render('setup/dns');

  ctx.body = {
    checklist,
    complete: ctx.state.setupCompleteAllPass
  };
}

module.exports = {
  ensureSetupEnabled,
  dispatch,
  retrieveDnsStatus
};
