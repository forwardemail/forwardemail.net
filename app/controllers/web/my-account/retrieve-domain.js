const path = require('path');

const Boom = require('@hapi/boom');
const Meta = require('koa-meta');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { parse } = require('node-html-parser');

const config = require('#config');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

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

  // check if domain exists, and f it doesn't then check
  // if we have a pending invite
  if (!ctx.state.domain)
    return ctx.throw(
      Boom.notFound(ctx.translateError('DOMAIN_DOES_NOT_EXIST'))
    );

  // if it's an API request then return early
  if (ctx.api) return next();

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
