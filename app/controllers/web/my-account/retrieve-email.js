/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const previewEmail = require('preview-email');

const config = require('#config');
const { Domains, Emails, Aliases } = require('#models');

async function retrieveEmail(ctx, next) {
  if (!isSANB(ctx.params.id))
    throw Boom.notFound(ctx.translateError('EMAIL_DOES_NOT_EXIST'));

  // user must be domain admin or alias owner of the email
  const [domains, aliases, goodDomains] = await Promise.all([
    Domains.distinct('_id', {
      has_smtp: true,
      // is_smtp_suspended: false,
      members: {
        $elemMatch: {
          user: ctx.state.user._id,
          group: 'admin'
        }
      }
    }),
    Aliases.distinct('_id', {
      user: ctx.state.user._id
    }),
    Domains.distinct('_id', {
      has_smtp: true
      // is_smtp_suspended: false
    })
  ]);

  ctx.state.email = await Emails.findOne({
    $or: [
      {
        id: ctx.params.id.replace('.eml', ''),
        alias: { $in: aliases },
        domain: { $in: goodDomains }
      },
      {
        id: ctx.params.id.replace('.eml', ''),
        domain: { $in: domains }
      }
    ]
  });

  if (!ctx.state.email)
    throw Boom.notFound(ctx.translateError('EMAIL_DOES_NOT_EXIST'));

  if (!ctx.api) {
    // eml download
    if (ctx.params.id.endsWith('.eml')) {
      ctx.type = 'message/rfc822';
      ctx.body = await Emails.getMessage(ctx.state.email.message);
      return;
    }

    try {
      const message = await Emails.getMessage(ctx.state.email.message);
      ctx.state.html = await previewEmail(message, config.previewEmailOptions);
    } catch (err) {
      ctx.flash('error', ctx.translate('EMAIL_PREVIEW_ERROR'));
      ctx.logger.fatal(err);
    }
  }

  return next();
}

module.exports = retrieveEmail;
