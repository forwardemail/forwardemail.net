const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');
const { isPort } = require('validator');

const { Domains } = require('#models');

async function updateDomain(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);

  // Custom SMTP Port Forwarding
  if (isSANB(ctx.request.body.smtp_port)) {
    if (isPort(ctx.request.body.smtp_port))
      ctx.state.domain.smtp_port = ctx.request.body.smtp_port;
    else return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PORT')));
  } else {
    // Spam Scanner Settings
    ctx.state.domain.has_adult_content_protection = boolean(
      ctx.request.body.has_adult_content_protection
    );
    ctx.state.domain.has_phishing_protection = boolean(
      ctx.request.body.has_phishing_protection
    );
    ctx.state.domain.has_executable_protection = boolean(
      ctx.request.body.has_executable_protection
    );
    ctx.state.domain.has_virus_protection = boolean(
      ctx.request.body.has_virus_protection
    );
  }

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = updateDomain;
