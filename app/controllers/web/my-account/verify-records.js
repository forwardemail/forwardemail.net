const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');

const config = require('#config');
const logger = require('#helpers/logger');
const { Domains } = require('#models');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

async function verifyRecords(ctx) {
  try {
    // reset redis cache for web and smtp
    if (ctx.client)
      await Promise.all(
        ['A', 'MX', 'TXT'].map(async (type) => {
          try {
            await app.resolver(ctx.state.domain.name, type, true, ctx.client);
          } catch (err) {
            ctx.logger.fatal(err);
          }
        })
      );

    // check mx and txt
    let extra;
    const { txt, mx, errors } = await Domains.verifyRecords(
      ctx.state.domain._id,
      ctx.locale,
      ctx.client
    );
    if (txt && mx && errors.length > 0) {
      extra =
        errors.length === 1
          ? errors[0].message
          : `<ul class="text-left mb-0">${errors
              .map(
                (e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`
              )
              .join('')}</ul>`;
      if (!ctx.api) ctx.flash('warning', extra);
    } else if (errors.length > 0) {
      const err = new Error(
        errors.length === 1
          ? errors[0]
          : ctx.translate('MULTIPLE_VERIFICATION_ERRORS')
      );
      err.no_translate = true;
      if (errors.length > 1) err.errors = errors;
      throw err;
    }

    const text = ctx.translate('DOMAIN_IS_VERIFIED');

    if (ctx.api) {
      const response = [text];
      if (extra) response.push(extra);
      ctx.body = response.join(' ');
      return;
    }

    // if everything OK then success
    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text,
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });

    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.warn(err);

    if (Array.isArray(err.errors)) {
      if (ctx.api) {
        err.message = err.errors.map((e) => e.message);
      } else {
        err.message = `<ul class="text-left mb-0">${err.errors
          .map((e) => `<li class="mb-3">${e && e.message ? e.message : e}</li>`)
          .join('')}</ul>`;
      }
    }

    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = verifyRecords;
