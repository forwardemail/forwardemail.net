const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const { boolean } = require('boolean');

const toObject = require('#helpers/to-object');
const { Users, Domains, Aliases } = require('#models');

async function createAlias(ctx, next) {
  try {
    if (
      isSANB(ctx.state.body.name) &&
      !ctx.state.body.name.startsWith('/') &&
      ctx.state.body.name.includes('+')
    )
      return ctx.throw(
        Boom.badRequest(ctx.translateError('ALIAS_WITH_PLUS_UNSUPPORTED'))
      );

    ctx.state.alias = await Aliases.create({
      ...ctx.state.body,
      is_api: boolean(ctx.api),
      user: ctx.state.user._id,
      domain: ctx.state.domain._id,
      locale: ctx.locale
    });

    if (ctx.api) {
      ctx.state.alias = toObject(Aliases, ctx.state.alias);
      ctx.state.alias.user = toObject(Users, ctx.state.user);
      ctx.state.alias.domain = toObject(Domains, ctx.state.domain);
      ctx.state.alias.domain.members = ctx.state.domain.members;
      ctx.state.alias.domain.invites = ctx.state.domain.invites;
      return next();
    }

    if (
      ctx.state.alias.has_recipient_verification &&
      (!ctx.state.domain.has_mx_record || !ctx.state.domain.has_txt_record)
    )
      ctx.flash(
        'warning',
        ctx.translate('RECIPIENT_VERIFICATION_PENDING_DOMAIN_VERIFICATION')
      );

    ctx.flash('custom', {
      title: ctx.request.t('Success'),
      text: ctx.translate('REQUEST_OK'),
      type: 'success',
      toast: true,
      showConfirmButton: false,
      timer: 3000,
      position: 'top'
    });
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  } catch (err) {
    ctx.logger.error(err);
    ctx.throw(Boom.badRequest(err.message));
  }
}

module.exports = createAlias;
