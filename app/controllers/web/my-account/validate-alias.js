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

  if (isSANB(body.description)) body.description = striptags(body.description);
  else delete body.description;

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
  else delete body.labels;

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
  else delete body.recipients;

  ctx.state.body = body;

  return next();
}

module.exports = validateAlias;
