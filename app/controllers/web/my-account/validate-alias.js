const _ = require('lodash');
const isSANB = require('is-string-and-not-blank');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const { boolean } = require('boolean');

function validateAlias(ctx, next) {
  const body = _.pick(ctx.request.body, [
    'name',
    'description',
    'labels',
    'is_enabled',
    'recipients'
  ]);

  if (!isSANB(body.name)) delete body.name;

  body.description = isSANB(body.description)
    ? striptags(body.description)
    : '';

  if (isSANB(body.labels))
    body.labels = _.compact(
      _.uniq(
        _.map(
          splitLines(body.labels).join(' ').split(',').join(' ').split(' '),
          (label) => slug(label.trim())
        )
      )
    );
  else if (_.isArray(body.labels))
    body.labels = _.compact(
      _.uniq(
        _.map(body.labels, (label) =>
          isSANB(label) ? slug(label.trim()) : null
        )
      )
    );
  else body.labels = [];

  // has_recipient_verification (defaults to domain's setting if not set)
  if (ctx.api) {
    if (
      _.isBoolean(ctx.request.body.has_recipient_verification) ||
      isSANB(ctx.request.body.has_recipient_verification)
    )
      body.has_recipient_verification = boolean(
        ctx.request.body.has_recipient_verification
      );
    else if (!ctx.state.alias)
      body.has_recipient_verification =
        ctx.state.domain.has_recipient_verification;
  } else {
    body.has_recipient_verification = boolean(
      ctx.request.body.has_recipient_verification
    );
  }

  body.is_enabled = boolean(body.is_enabled);

  if (isSANB(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(
          splitLines(body.recipients).join(' ').split(',').join(' ').split(' '),
          (recipient) => recipient.trim()
        )
      )
    );
  else if (_.isArray(body.recipients))
    body.recipients = _.compact(
      _.uniq(
        _.map(body.recipients, (recipient) =>
          isSANB(recipient) ? recipient.trim() : null
        )
      )
    );
  else body.recipients = [];

  if (_.isEmpty(body.recipients)) body.recipients = [ctx.state.user.email];

  ctx.state.body = body;

  return next();
}

module.exports = validateAlias;
