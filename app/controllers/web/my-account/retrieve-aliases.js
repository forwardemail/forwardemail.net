const RE2 = require('re2');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');

function retrieveAliases(ctx, next) {
  // if there aren't any aliases yet
  // then prompt the user to create one and flash a message
  // otherwise take them to the next middleware
  if (ctx.api || ctx.state.domain.aliases.length > 0) {
    //
    // search functionality (with RegExp support)
    //
    if (isSANB(ctx.query.name))
      ctx.state.domain.aliases = ctx.state.domain.aliases.filter((alias) =>
        new RE2(_.escapeRegExp(ctx.query.name)).test(alias.name)
      );

    if (isSANB(ctx.query.recipient)) {
      const recipientRegex = new RE2(_.escapeRegExp(ctx.query.recipient));
      ctx.state.domain.aliases = ctx.state.domain.aliases.filter((alias) =>
        alias.recipients.some((recipient) => recipientRegex.test(recipient))
      );
    }

    return next();
  }

  ctx.flash('custom', {
    title: ctx.translate('ADD_ALIAS'),
    text: ctx.translate('NO_ALIASES_EXIST'),
    type: 'info',
    toast: true,
    showConfirmButton: false,
    timer: 5000,
    position: 'top'
  });
  ctx.redirect(`/my-account/domains/${ctx.state.domain.name}/aliases/new`);
}

module.exports = retrieveAliases;
