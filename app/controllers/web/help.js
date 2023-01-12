const sanitize = require('sanitize-html');
const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');
const _ = require('lodash');

const email = require('#helpers/email');
const { Domains, Inquiries } = require('#models');
const config = require('#config');

async function help(ctx) {
  const { body } = ctx.request;

  if (_.isString(body.message)) {
    body.message = sanitize(body.message, {
      allowedTags: [],
      allowedAttributes: []
    });
  }

  if (!isSANB(body.message))
    throw Boom.badRequest(ctx.translateError('INVALID_MESSAGE'));

  if (body.message.length > config.supportRequestMaxLength)
    throw Boom.badRequest(ctx.translateError('INVALID_MESSAGE'));

  try {
    const domains = await Domains.find({
      'members.user': ctx.state.user._id
    })
      .sort('name')
      .lean()
      .exec();

    const inquiry = await Inquiries.create({
      user: ctx.state.user._id,
      message: body.message
    });

    ctx.logger.debug('created inquiry', { inquiry });

    await email({
      template: 'inquiry',
      message: {
        to: ctx.state.user[config.userFields.fullEmail],
        cc: config.email.message.from
      },
      locals: {
        user: ctx.state.user.toObject(),
        domains,
        inquiry
      }
    });

    const message = ctx.translate('SUPPORT_REQUEST_SENT');
    if (ctx.accepts('html')) {
      ctx.flash('success', message);
      ctx.redirect('back');
    } else {
      ctx.body = { message, resetForm: true, hideModal: true };
    }
  } catch (err) {
    ctx.logger.fatal(err);
    throw Boom.badRequest(ctx.translateError('SUPPORT_REQUEST_ERROR'));
  }
}

module.exports = help;
