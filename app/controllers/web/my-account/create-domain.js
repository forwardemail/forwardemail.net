const Boom = require('@hapi/boom');
const { boolean } = require('boolean');

const toObject = require('#helpers/to-object');
const { Users, Domains, Aliases } = require('#models');

async function createDomain(ctx, next) {
  try {
    ctx.state.domain = await Domains.create({
      is_api: boolean(ctx.api),
      members: [{ user: ctx.state.user._id, group: 'admin' }],
      name: ctx.request.body.domain,
      is_global:
        ctx.state.user.group === 'admin' && boolean(ctx.request.body.is_global),
      locale: ctx.locale,
      plan: ctx.request.body.plan,
      client: ctx.client,
      ...ctx.state.optionalBooleans
    });

    // create a default alias for the user pointing to the admin
    if (ctx.state.recipients.length > 0)
      await Aliases.create({
        is_api: boolean(ctx.api),
        user: ctx.state.user._id,
        domain: ctx.state.domain._id,
        name: '*',
        recipients: ctx.state.recipients,
        locale: ctx.locale,
        ...(ctx.state.optionalBooleans.has_recipient_verification
          ? { has_recipient_verification: true }
          : {})
      });

    if (ctx.api) {
      ctx.state.domain = toObject(Domains, ctx.state.domain);
      ctx.state.domain.members[0].user = toObject(Users, ctx.state.user);
      return next();
    }

    // TODO: flash messages logic in @ladjs/assets doesn't support both
    // custom and regular flash message yet
    if (ctx.state.domain.name.startsWith('www.') && !ctx.api) {
      ctx.flash(
        'error',
        ctx
          .translate('WWW_WARNING')
          .replace(/example.com/g, ctx.state.domain.name.replace('www.', ''))
      );
    } else if (!ctx.api) {
      ctx.flash('custom', {
        title: ctx.request.t('Success'),
        text: ctx.translate('REQUEST_OK'),
        type: 'success',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        position: 'top'
      });
    }

    if (ctx.accepts('html')) ctx.redirect(ctx.state.redirectTo);
    else ctx.body = { redirectTo: ctx.state.redirectTo };
  } catch (err) {
    ctx.throw(Boom.badRequest(err));
  }
}

module.exports = createDomain;
