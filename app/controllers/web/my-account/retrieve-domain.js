const path = require('path');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const Meta = require('koa-meta');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { fromUrl, parseDomain, ParseResultType } = require('parse-domain');
const { parse } = require('node-html-parser');

const importAliases = require('./import-aliases');

const config = require('#config');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const EXCHANGES = app.config.exchanges;

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
        const records = await app.resolver(
          ctx.state.domain.name,
          'MX',
          false,
          ctx.client
        );
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
        ctx.logger.error(err);
      }
    })(),
    (async () => {
      try {
        const records = await app.resolver(
          ctx.state.domain.name,
          'TXT',
          false,
          ctx.client
        );
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
        ctx.logger.error(err);
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
      ctx.logger.error(err);
    }
  }

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
    ctx.pathWithoutLocale === `/my-account/domains/${ctx.state.domain.name}` ||
    ctx.pathWithoutLocale === `/my-account/domains/${ctx.state.domain.id}`
  )
    ctx.state.breadcrumbs.push({ name: ctx.state.t('Setup Forwarding') });

  // eslint-disable-next-line unicorn/prefer-switch
  if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  )
    ctx.state.breadcrumbs.push('aliases');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/advanced-settings`
  )
    ctx.state.breadcrumbs.push('advanced-settings');
  else if (
    ctx.pathWithoutLocale ===
    `/my-account/domains/${ctx.state.domain.name}/aliases/new`
  ) {
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
  )
    ctx.state.breadcrumbs.push('billing');

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
