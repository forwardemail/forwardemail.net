/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// const path = require('node:path');
const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const Meta = require('koa-meta');
const isSANB = require('is-string-and-not-blank');
// const pug = require('pug');
// const { parse } = require('node-html-parser');

const getDmarcRecord = require('mailauth/lib/dmarc/get-dmarc-record');
const importAliases = require('./import-aliases');
const _ = require('#helpers/lodash');

const { Domains, Aliases } = require('#models');
const config = require('#config');
const { encrypt } = require('#helpers/encrypt-decrypt');
const logger = require('#helpers/logger');
const parseRootDomain = require('#helpers/parse-root-domain');

const meta = new Meta(config.meta, logger);

const META_TITLE_AFFIX = `| ${config.appName}`;
const EXCHANGES = config.exchanges;

async function retrieveDomain(ctx, next) {
  if (!isSANB(ctx.params.domain_id) && !isSANB(ctx.request.body.domain))
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  const id = isSANB(ctx.params.domain_id)
    ? ctx.params.domain_id
    : ctx.request.body.domain;

  ctx.state.domain = ctx.state.domains.find((domain) =>
    [domain.id, domain.name, punycode.toASCII(domain.name)].includes(id)
  );

  // check if domain exists, and if it doesn't then check
  // if we have a pending invite
  if (!ctx.state.domain)
    throw Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'));

  const member = ctx.state.domain.members.find((m) =>
    m?.user?.id
      ? m.user.id === ctx.state.user.id
      : m.user.toString() === ctx.state.user.id
  );

  if (!member) throw Boom.notFound(ctx.translateError('INVALID_MEMBER'));

  // set a `group` virtual helper alias to the member's group
  ctx.state.domain.group = member.group;

  // if it's an API request then return early
  if (ctx.api) {
    return next();
  }

  //
  // if we're on the advanced settings page, then calculate alias_count for each member
  // and also lookup DKIM, DMARC, and Return-Path if the user has SMTP Outbound Configuration
  //
  if (
    ctx.state.domain.group === 'admin' &&
    ctx.method === 'GET' &&
    ctx.pathWithoutLocale ===
      `/my-account/domains/${punycode.toASCII(
        ctx.state.domain.name
      )}/advanced-settings`
  ) {
    const domain = await Domains.findOne(ctx.state.domain._id)
      .populate(
        'members.user',
        `id email plan ${config.passport.fields.displayName} ${config.userFields.isBanned}`
      )
      .populate('tokens.user', 'email')
      .select('+tokens.description')
      .sort('name') // A-Z domains
      .lean()
      .exec();
    domain.locale = ctx.locale;
    domain.resolver = ctx.resolver;
    let x = domain.members.length;
    let member;
    while (x--) {
      const m = domain.members[x];

      // ensure members have populated users and are not banned
      if (!_.isObject(m.user) || m.user[config.userFields.isBanned]) {
        domain.members.splice(x, 1);
        continue;
      }

      // omit properties we don't need to share
      delete m.user[config.userFields.isBanned];

      // check if there was a match for the current member (logged in user)
      if (m.user.id === ctx.state.user.id) member = m;
    }

    // if the domain was not global and there was no member
    if (
      domain.is_global && // store a boolean for the count
      !member
    ) {
      member = {
        user: {
          _id: ctx.state.user._id,
          id: ctx.state.user.id,
          email: ctx.state.user.email
        },
        group: 'user'
      };
      domain.members.push(member);
    }

    // set a `group` virtual helper alias to the member's group
    domain.group = member.group;
    domain.members = await Promise.all(
      domain.members.map(async (member) => {
        member.alias_count = await Aliases.countDocuments({
          domain: domain._id,
          user: member.user._id
        });
        return member;
      })
    );
    // set domain_id on each invite so the link virtual can generate encrypted tokens
    if (Array.isArray(domain.invites)) {
      for (const invite of domain.invites) {
        invite.link = encrypt(
          JSON.stringify({
            d: domain.id,
            e: invite.email
          })
        );
      }
    }

    ctx.state.domain = domain;
  }

  //
  // Lookup SMTP Outbound Configuration if the user has SMTP enabled and not suspended
  //
  if (
    ctx.state.domain.group === 'admin' &&
    ctx.method === 'GET' &&
    ctx.pathWithoutLocale ===
      `/my-account/domains/${punycode.toASCII(
        ctx.state.domain.name
      )}/verify-smtp` &&
    // ctx.state.domain.has_smtp &&
    !_.isDate(ctx.state.domain.smtp_suspended_sent_at)
  ) {
    try {
      // <https://github.com/postalsys/mailauth#dmarc>
      // <https://github.com/postalsys/mailauth/pull/29>
      // <https://github.com/postalsys/mailauth/issues/27>
      await ctx.resolver.resolveTxt(`_dmarc.${ctx.state.domain.name}`, {
        purgeCache: true
      });
      const dmarcRecord = await getDmarcRecord(
        ctx.state.domain.name,
        ctx.resolver.resolve
      );
      // {
      //   v: 'DMARC1',
      //   p: 'none',
      //   pct: 100,
      //   rua: 'mailto:foo@bar.com',
      //   sp: 'none',
      //   aspf: 'r',
      //   rr: 'v=DMARC1; p=none; pct=100; rua=mailto:foo@bar.com; sp=none; aspf=r;',
      //   isOrgRecord: false
      // }
      if (
        dmarcRecord &&
        (dmarcRecord?.v !== 'DMARC1' ||
          // !isSANB(dmarcRecord?.p) ||
          // !['none', 'reject', 'quarantine'].includes(dmarcRecord.p) ||
          (typeof dmarcRecord?.pct === 'number' && dmarcRecord.pct !== 100))
      ) {
        ctx.state.isDMARCInvalid = true;
      }
    } catch (err) {
      ctx.logger.warn(err);
    }
  }

  //
  // populate a virtual helper for rendering views
  // (e.g. subdomain in Host column for onboarding DNS setup)
  //
  ctx.state.domain.root_name = parseRootDomain(ctx.state.domain.name);
  ctx.state.hasExistingMX = false;
  ctx.state.hasExistingTXT = false;
  ctx.state.isSelfHosted = config.isSelfHosted;
  ctx.state.exchanges = Array.isArray(EXCHANGES) ? EXCHANGES : [EXCHANGES];

  //
  // only check dns/mx if we're on the setup page
  //
  if (
    ctx.method === 'GET' &&
    ctx.pathWithoutLocale ===
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
  ) {
    await Promise.all([
      (async () => {
        if (ctx.state.domain.ignore_mx_check === true) return;
        try {
          const records = await ctx.resolver.resolveMx(ctx.state.domain.name, {
            purgeCache: true
          });
          if (
            _.isArray(records) &&
            !_.isEmpty(records) &&
            records.every(
              (record) =>
                _.isObject(record) &&
                _.isString(record.exchange) &&
                _.isNumber(record.priority)
            )
          ) {
            const existingMX = records.filter(
              (record) => !EXCHANGES.includes(record.exchange.toLowerCase())
            );
            if (existingMX.length > 0) {
              ctx.state.hasExistingMX = true;
              ctx.state.existingMX = existingMX;
            }
          }
        } catch (err) {
          ctx.logger.warn(err);
        }
      })(),
      (async () => {
        try {
          const records = await ctx.resolver.resolveTxt(ctx.state.domain.name, {
            purgeCache: true
          });
          const existingTXT = [];
          for (const record of records) {
            if (_.isArray(record)) {
              for (const string_ of record) {
                if (
                  string_.includes('forward-email=') ||
                  string_.includes('forward-email-port=')
                ) {
                  existingTXT.push(string_);
                }
              }
            }
          }

          if (existingTXT.length > 0) {
            ctx.state.hasExistingTXT = true;
            ctx.state.existingTXT = existingTXT;
          }
        } catch (err) {
          ctx.logger.warn(err);
        }
      })()
    ]);
  }

  //
  // we need to import existing aliases
  // if there were existingTXT found
  //
  if (ctx.state.hasExistingTXT) {
    try {
      await importAliases(ctx);
    } catch (err) {
      ctx.logger.warn(err);
    }
  }

  const message = ctx.translate(
    'SETUP_REQUIRED',
    ctx.state.domain.name,
    ctx.state.l(
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
    )
  );

  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

  //
  // set breadcrumbs
  //
  ctx.state.breadcrumbs = [
    'my-account',
    {
      name: ctx.state.t('Domains'),
      header: ctx.state.domain.name,
      href: ctx.state.l('/my-account/domains')
    },
    {
      name: ctx.state.domain.name,
      href:
        ctx.state.domain.group === 'admin'
          ? ctx.state.l(
              `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
            )
          : null
    }
  ];

  //
  // NOTE: if the user is on any My Account > Domains page and is an admin of the domain
  //       then we need to toast alert that they need to complete SMTP configuration if it's not done yet
  //
  if (
    ctx.state.domain.group === 'admin' &&
    ctx.method === 'GET' &&
    ctx.state.domain.has_smtp &&
    !_.isDate(ctx.state.domain.smtp_suspended_sent_at) &&
    (!ctx.state.domain.has_dkim_record ||
      !ctx.state.domain.has_return_path_record ||
      !ctx.state.domain.has_dmarc_record) &&
    ctx.pathWithoutLocale.startsWith(
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}`
    ) &&
    ctx.pathWithoutLocale !==
      `/my-account/domains/${punycode.toASCII(
        ctx.state.domain.name
      )}/verify-smtp` &&
    ctx.accepts('html')
  ) {
    ctx.flash('custom', {
      title: ctx.request.t('Important'),
      html: ctx.translate(
        'EMAIL_SMTP_CONFIGURATION_REQUIRED',
        ctx.state.domain.name,
        ctx.state.l(
          `/my-account/domains/${punycode.toASCII(
            ctx.state.domain.name
          )}/verify-smtp`
        )
      ),
      type: 'info',
      toast: true,
      position: 'top'
    });
  }

  if (
    ctx.method === 'GET' &&
    ctx.pathWithoutLocale ===
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}` &&
    ctx.accepts('html')
  ) {
    // if we're on the setup page and the user is not on paid plan and it's not allowed anymore
    let message;
    if (ctx.state.domain.plan === 'free') {
      const { isGood, isDisposable, isRestricted } =
        Domains.getNameRestrictions(ctx.state.domain.name);

      if (isRestricted) {
        message = ctx.translate(
          'RESTRICTED_PLAN_UPGRADE_REQUIRED',
          ctx.state.domain.name,
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.state.domain.name
            )}/billing?plan=enhanced_protection`
          )
        );
        ctx.flash('error', message);
      } else if (!isGood) {
        message = ctx.translate(
          'MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED',
          ctx.state.domain.name,
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.state.domain.name
            )}/billing?plan=enhanced_protection`
          )
        );
        ctx.flash('error', message);
      } else if (isDisposable) {
        message = ctx.translate(
          'RESERVED_KEYWORD_DOMAIN_PLAN_UPGRADE_REQUIRED',
          ctx.state.domain.name,
          ctx.state.l(
            `/my-account/domains/${punycode.toASCII(
              ctx.state.domain.name
            )}/billing?plan=enhanced_protection`
          )
        );
        ctx.flash('error', message);
      }
    }

    //
    // attempt to re-verify the domain
    //
    ctx.state.domain = await Domains.findById(ctx.state.domain._id);
    ctx.state.domain.skip_payment_check = true;
    ctx.state.domain.locale = ctx.locale;
    ctx.state.domain.resolver = ctx.resolver;

    try {
      ctx.state.domain = await ctx.state.domain.save();
      const member = ctx.state.domain.members.find(
        (m) => m.user.toString() === ctx.state.user.id
      );

      if (!member) throw Boom.notFound(ctx.translateError('INVALID_MEMBER'));

      // set a `group` virtual helper alias to the member's group
      ctx.state.domain.group = member.group;

      // get storage quota for the domain
      if (!ctx.state.domain.is_global && ctx.state.domain.plan !== 'free') {
        try {
          const [storageUsed, storageUsedByAliases, maxQuotaPerAlias] =
            await Promise.all([
              Domains.getStorageUsed(ctx.state.domain._id, ctx.locale),
              Domains.getStorageUsed(ctx.state.domain._id, ctx.locale, true),
              Domains.getMaxQuota(ctx.state.domain._id)
            ]);
          ctx.state.domain.storage_used = storageUsed;
          ctx.state.domain.storage_used_by_aliases = storageUsedByAliases;
          ctx.state.domain.storage_quota = maxQuotaPerAlias;
        } catch (err) {
          ctx.logger.fatal(err);
        }
      }

      //
      // populate a virtual helper for rendering views
      // (e.g. subdomain in Host column for onboarding DNS setup)
      //
      ctx.state.domain.root_name = parseRootDomain(ctx.state.domain.name);
    } catch (err) {
      ctx.logger.warn(err);
    }

    if (
      (message ||
        !ctx.state.domain.has_mx_record ||
        !ctx.state.domain.has_txt_record) &&
      ctx.accepts('html')
    ) {
      ctx.flash('custom', {
        title: ctx.request.t('Important'),
        html: message || ctx.translate('SETUP_NOT_FINISHED'),
        type: 'info',
        toast: true,
        position: 'top'
      });
    }

    ctx.state.meta.title = ctx.state.t(
      `${
        ctx.state.domain.has_mx_record && ctx.state.domain.has_txt_record
          ? ctx.state.emoji('white_check_mark')
          : ctx.state.emoji('x')
      } Setup ${META_TITLE_AFFIX}`
    );
    ctx.state.breadcrumbs.push({ name: ctx.state.t('Setup') });
  }

  // eslint-disable-next-line unicorn/prefer-switch
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
  ) {
    // user must be on a paid plan to use a global domain
    if (
      ctx.state.domain.is_global &&
      ctx.state.user.group !== 'admin' &&
      ctx.state.user.plan === 'free' &&
      ctx.accepts('html')
    ) {
      ctx.flash(
        'warning',
        ctx.translate(
          'PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS',
          ctx.state.l('/my-account/billing/upgrade?plan=enhanced_protection')
        )
      );
    }

    if (
      ctx.accepts('html') &&
      (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
    ) {
      ctx.flash('warning', message);
    }

    ctx.state.meta.title = ctx.state.t(`Aliases ${META_TITLE_AFFIX}`);
    ctx.state.breadcrumbs.push({
      name: ctx.state.t('Aliases'),
      href: ctx.state.l(
        `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
      )
    });

    if (
      ctx.method === 'GET' &&
      !ctx.state.domain.is_global &&
      ctx.state.domain.plan !== 'free'
    ) {
      // get storage quota for the domain
      try {
        const [storageUsed, storageUsedByAliases, maxQuotaPerAlias] =
          await Promise.all([
            Domains.getStorageUsed(ctx.state.domain._id, ctx.locale),
            Domains.getStorageUsed(ctx.state.domain._id, ctx.locale, true),
            Domains.getMaxQuota(ctx.state.domain._id)
          ]);
        ctx.state.domain.storage_used = storageUsed;
        ctx.state.domain.storage_used_by_aliases = storageUsedByAliases;
        ctx.state.domain.storage_quota = maxQuotaPerAlias;
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${punycode.toASCII(
      ctx.state.domain.name
    )}/advanced-settings`
  ) {
    ctx.state.meta.title = ctx.state.t(`Settings ${META_TITLE_AFFIX}`);
    ctx.state.breadcrumbs.push('advanced-settings');
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/verify-smtp`
  ) {
    ctx.state.meta.title = `${
      ctx.state.domain.has_dkim_record &&
      ctx.state.domain.has_return_path_record &&
      ctx.state.domain.has_dmarc_record
        ? ctx.state.emoji('white_check_mark')
        : ctx.state.emoji('x')
    } ${ctx.state.t('Verify')} SMTP ${META_TITLE_AFFIX}`;
    ctx.state.breadcrumbs.push({
      name: `${ctx.state.t('Verify')} SMTP`
    });
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases/new`
  ) {
    if (
      ctx.accepts('html') &&
      (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
    ) {
      ctx.flash('warning', message);
    }

    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.meta.title = ctx.state.t(`Add Alias ${META_TITLE_AFFIX}`);
    ctx.state.breadcrumbs.push(
      {
        name: ctx.state.t('Aliases'),
        href: ctx.state.l(
          `/my-account/domains/${punycode.toASCII(
            ctx.state.domain.name
          )}/aliases`
        )
      },
      {
        name: ctx.state.t('Add Alias')
      }
    );
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/billing`
  ) {
    ctx.state.meta.title = ctx.state.t(`Billing ${META_TITLE_AFFIX}`);
    ctx.state.breadcrumbs.push('billing');
  } else if (
    ctx.pathWithoutLocale ===
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/logs` &&
    (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record) &&
    ctx.accepts('html')
  ) {
    ctx.flash('warning', message);
  }

  /*
  // dynamically load the DNS Management by Registrar table from FAQ
  try {
    const html = pug.renderFile(
      path.join(config.views.root, 'faq', 'index.pug'),
      // make flash a noop so we don't interfere with messages/session
      {
        ...ctx.state,
        flash() {
          return {};
        }
      }
    );

    // expose it to the view
    const root = parse(html);
    ctx.state.modalFAQTable = root.querySelector(
      '#table-dns-management-by-registrar'
    ).outerHTML;
  } catch (err) {
    ctx.logger.error(err);
  }
  */

  return next();
}

module.exports = retrieveDomain;
