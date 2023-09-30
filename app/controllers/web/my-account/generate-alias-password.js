const Boom = require('@hapi/boom');
const noReplyList = require('reserved-email-addresses-list/no-reply-list.json');

const Aliases = require('#models/aliases');

const NO_REPLY_USERNAMES = new Set(noReplyList);

async function generateAliasPassword(ctx) {
  // if domain has not yet been setup yet then alert user
  if (
    !ctx.api &&
    (!ctx.state.domain.has_dkim_record ||
      !ctx.state.domain.has_return_path_record ||
      !ctx.state.domain.has_dmarc_record)
  ) {
    ctx.flash(
      'warning',
      ctx.translate(
        'EMAIL_SMTP_CONFIGURATION_REQUIRED',
        ctx.state.domain.name,
        ctx.state.l(`/my-account/domains/${ctx.state.domain.name}/verify-smtp`)
      )
    );

    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/advanced-settings`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
    return;
  }

  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );
  try {
    const alias = await Aliases.findById(ctx.state.alias._id);
    // prevent for disabled usernames
    if (!alias.is_enabled)
      throw Boom.badRequest(ctx.translateError('ALIAS_IS_NOT_ENABLED'));

    // prevent for no-reply usernames
    const string = alias.name.replace(/[^\da-z]/g, '');
    if (NO_REPLY_USERNAMES.has(string))
      throw Boom.badRequest(ctx.translateError('NO_REPLY_USERNAME_NO_SMTP'));

    // set locale for translation in `createToken`
    alias.locale = ctx.locale;
    // TODO: support more than one generated password
    alias.tokens = [];
    const pass = await alias.createToken(ctx.state.user.email);
    await alias.save();
    const swal = {
      title: ctx.request.t('Success'),
      html: ctx.translate(
        'ALIAS_GENERATED_PASSWORD',
        `${alias.name}@${ctx.state.domain.name}`,
        pass
      ),
      timer: 30000,
      type: 'success',
      position: 'top',
      allowEscapeKey: false,
      allowOutsideClick: false,
      focusConfirm: false,
      returnFocus: false,
      grow: 'fullscreen',
      backdrop: 'rgba(0,0,0,0.8)'
    };
    if (ctx.accepts('html')) {
      ctx.flash('custom', swal);
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { swal };
    }
  } catch (err) {
    if (err && err.isBoom) throw err;
    ctx.logger.fatal(err);
    ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  }
}

module.exports = generateAliasPassword;
