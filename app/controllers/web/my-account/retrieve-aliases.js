const RE2 = require('re2');
const ForwardEmail = require('forward-email');
const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const logger = require('#helpers/logger');

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

async function retrieveAliases(ctx, next) {
  // if there aren't any aliases yet
  // then prompt the user to create one and flash a message
  // otherwise take them to the next middleware
  if (ctx.api || ctx.state.domain.aliases.length > 0) {
    //
    // search functionality (with RegExp support)
    //
    if (isSANB(ctx.query.name)) {
      let regex;
      try {
        regex = new RE2(_.escapeRegExp(ctx.query.name) + '|' + ctx.query.name);
      } catch (err) {
        ctx.logger.warn(err);
      }

      if (regex)
        ctx.state.domain.aliases = ctx.state.domain.aliases.filter((alias) =>
          regex.test(alias.name)
        );
    }

    if (isSANB(ctx.query.recipient)) {
      let recipientRegex;
      try {
        recipientRegex = new RE2(
          _.escapeRegExp(ctx.query.recipient) + '|' + ctx.query.recipient
        );
      } catch (err) {
        ctx.logger.warn(err);
      }

      if (recipientRegex)
        ctx.state.domain.aliases = ctx.state.domain.aliases.filter((alias) =>
          alias.recipients.some((recipient) => recipientRegex.test(recipient))
        );
    }

    return next();
  }

  // render the IMPORT TXT button conditionally
  ctx.state.hasExistingTXT = false;
  if (ctx.state.domain.plan !== 'free') {
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
          // eslint-disable-next-line max-depth
          for (const str of record) {
            // eslint-disable-next-line max-depth
            if (str.includes('forward-email=')) existingTXT.push(str);
          }
        }
      }

      if (existingTXT.length > 0) ctx.state.hasExistingTXT = true;
    } catch (err) {
      ctx.logger.warn(err);
    }
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
