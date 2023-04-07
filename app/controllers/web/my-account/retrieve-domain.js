const path = require('path');

const Boom = require('@hapi/boom');
const Meta = require('koa-meta');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');
const { parse } = require('node-html-parser');

const importAliases = require('./import-aliases');

const { Domains, Aliases } = require('#models');
const config = require('#config');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

const EXCHANGES = config.exchanges;

// eslint-disable-next-line complexity
async function retrieveDomain(ctx, next) {
  if (!isSANB(ctx.params.domain_id) && !isSANB(ctx.request.body.domain))
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  const id = isSANB(ctx.params.domain_id)
    ? ctx.params.domain_id
    : ctx.request.body.domain;

  ctx.state.domain = ctx.state.domains.find((domain) =>
    [domain.id, domain.name].includes(id)
  );

  // check if domain exists, and if it doesn't then check
  // if we have a pending invite
  if (!ctx.state.domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // if it's an API request then return early
  if (ctx.api) return next();

  //
  // if we're on the advanced settings page, then calculate alias_count for each member
  //
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/advanced-settings`
  ) {
    ctx.state.domain.members = await Promise.all(
      ctx.state.domain.members.map(async (member) => {
        member.alias_count = await Aliases.countDocuments({
          domain: ctx.state.domain._id,
          user: member.user._id
        });
        return member;
      })
    );
  }

  //
  // populate a virtual helper for rendering views
  // (e.g. subdomain in Host column for onboarding DNS setup)
  //
  try {
    const parseResult = parseDomain(fromUrl(ctx.state.domain.name));
    ctx.state.domain.root_name = (
      parseResult.type === ParseResultType.Listed &&
      _.isObject(parseResult.icann) &&
      isSANB(parseResult.icann.domain)
        ? `${parseResult.icann.domain}.${parseResult.icann.topLevelDomains.join(
            '.'
          )}`
        : ctx.state.domain.name
    ).toLowerCase();
  } catch (err) {
    ctx.logger.fatal(err);
  }

  ctx.state.hasExistingMX = false;
  ctx.state.hasExistingTXT = false;

  await Promise.all([
    (async () => {
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
            (record) => !EXCHANGES.includes(record.exchange)
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
            for (const str of record) {
              // eslint-disable-next-line max-depth
              if (
                str.includes('forward-email=') ||
                str.includes('forward-email-port=')
              )
                existingTXT.push(str);
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
    ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
  );

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
          ? ctx.state.l(`/my-account/domains/${ctx.state.domain.name}`)
          : null
    }
  ];

  if (
    ctx.method === 'GET' &&
    (ctx.pathWithoutLocale === `/my-account/domains/${ctx.state.domain.name}` ||
      ctx.pathWithoutLocale === `/my-account/domains/${ctx.state.domain.id}`)
  ) {
    // if we're on the setup page and the user is not on paid plan and it's not allowed anymore
    let checkDNS = false;
    let message;
    if (ctx.state.domain.plan === 'free') {
      const { isGood, isDisposable, isRestricted } =
        Domains.getNameRestrictions(ctx.state.domain.name);

      if (isRestricted) {
        message = ctx.translate(
          'RESTRICTED_PLAN_UPGRADE_REQUIRED',
          ctx.state.domain.name,
          ctx.state.l(
            `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
          )
        );
        ctx.flash('error', message);
      } else if (!isGood) {
        message = ctx.translate(
          'MALICIOUS_DOMAIN_PLAN_UPGRADE_REQUIRED',
          ctx.state.domain.name,
          ctx.state.l(
            `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
          )
        );
        ctx.flash('error', message);
      } else if (isDisposable) {
        message = ctx.translate(
          'RESERVED_KEYWORD_DOMAIN_PLAN_UPGRADE_REQUIRED',
          ctx.state.domain.name,
          ctx.state.l(
            `/my-account/domains/${ctx.state.domain.name}/billing?plan=enhanced_protection`
          )
        );
        ctx.flash('error', message);
      } else {
        checkDNS = true;
      }
    } else {
      checkDNS = true;
    }

    //
    // attempt to re-verify the domain
    //
    if (checkDNS) {
      ctx.state.domain = await Domains.findById(ctx.state.domain._id);
      ctx.state.domain.skip_payment_check = true;
      ctx.state.domain.locale = ctx.locale;
      ctx.state.domain.resolver = ctx.resolver;

      try {
        ctx.state.domain = await ctx.state.domain.save();
      } catch (err) {
        ctx.logger.warn(err);
      }
    }

    if (
      message ||
      !ctx.state.domain.has_mx_record ||
      !ctx.state.domain.has_txt_record
    ) {
      ctx.flash('custom', {
        title: ctx.request.t('Important'),
        html: message || ctx.translate('SETUP_NOT_FINISHED'),
        type: 'info',
        toast: true,
        position: 'top'
      });
    }

    ctx.state.breadcrumbs.push({ name: ctx.state.t('Setup') });
  }

  // eslint-disable-next-line unicorn/prefer-switch
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  ) {
    // user must be on a paid plan to use a global domain
    if (
      !ctx.api &&
      ctx.state.domain.is_global &&
      ctx.state.user.group !== 'admin' &&
      ctx.state.user.plan === 'free'
    )
      ctx.flash(
        'warning',
        ctx.translate(
          'PLAN_UPGRADE_REQUIRED_FOR_GLOBAL_DOMAINS',
          ctx.state.l(`/my-account/billing/upgrade?plan=enhanced_protection`)
        )
      );
    if (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
      ctx.flash('warning', message);
    ctx.state.breadcrumbs.push('aliases');
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/advanced-settings`
  )
    ctx.state.breadcrumbs.push('advanced-settings');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/new`
  ) {
    if (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
      ctx.flash('warning', message);
    ctx.state.breadcrumbHeaderCentered = true;
    ctx.state.breadcrumbs.push(
      {
        name: ctx.state.t('Aliases'),
        href: ctx.state.l(
          `/my-account/domains/${ctx.state.domain.name}/aliases`
        )
      },
      {
        name: ctx.state.t('Add Alias')
      }
    );
  } else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/billing`
  ) {
    ctx.state.breadcrumbs.push('billing');
  } else if (
    ctx.pathWithoutLocale ===
      `/my-account/domains/${ctx.state.domain.name}/logs` &&
    (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
  )
    ctx.flash('warning', message);

  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

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

  return next();
}

module.exports = retrieveDomain;
