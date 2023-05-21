const Aliases = require('#models/aliases');

async function generateAliasPassword(ctx) {
  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );
  try {
    const alias = await Aliases.findById(ctx.state.alias._id);
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
