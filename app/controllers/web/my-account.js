const path = require('path');

const Boom = require('@hapi/boom');
const ForwardEmail = require('forward-email');
const Meta = require('koa-meta');
const RE2 = require('re2');
const Stripe = require('stripe');
const _ = require('lodash');
const countryList = require('country-list');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pify = require('pify');
const pug = require('pug');
const slug = require('speakingurl');
const splitLines = require('split-lines');
const striptags = require('striptags');
const webResourceInliner = require('web-resource-inliner');
const wkhtmltopdf = require('wkhtmltopdf');
const { boolean } = require('boolean');
const { isEmail, isIP, isPort } = require('validator');
const { parse } = require('node-html-parser');

const inline = pify(webResourceInliner.html);

const env = require('../../../config/env');
const config = require('../../../config');
const emailHelper = require('../../../helpers/email');
const { paypalAgent } = require('../../../helpers/paypal');
const logger = require('../../../helpers/logger');
const toObject = require('../../../helpers/to-object');
const { Users, Domains, Aliases, Payments } = require('../../models');

const {
  cancelEmailChange,
  createDomainBilling,
  listAliases,
  listBilling,
  verifyRecords,
  removeDomain,
  createDomain,
  remove,
  listDomains,
  manageBilling,
  retrieveDomain,
  resendEmailChange,
  retrieveDomains,
  resetAPIToken,
  retrieveBilling,
  retrieveDomainBilling,
  retrieveProfile,
  updateProfile
} = require('./my-account/index');

const meta = new Meta(config.meta, logger);

// country list with USA at the top
const USA = 'United States of America';
const countries = countryList.getNames().sort();
countries.splice(countries.indexOf(USA), 1);
countries.unshift(USA);

const app = new ForwardEmail({
  logger,
  recordPrefix: config.recordPrefix,
  srs: { secret: 'null' },
  redis: false
});

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

async function createInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  // ensure invite does not already exist
  const invite = ctx.state.domain.invites.find(
    (invite) => invite.email.toLowerCase() === email.toLowerCase()
  );

  if (invite)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('INVITE_ALREADY_SENT'))
    );

  // ensure user is not already a member
  const user = await Users.findOne({ email }).lean().exec();
  if (user) {
    const member = ctx.state.domain.members.find(
      (member) => member.user.id === user.id
    );
    if (member)
      return ctx.throw(
        Boom.badRequest(ctx.translateError('USER_ALREADY_MEMBER'))
      );
  }

  // create the invite
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  ctx.state.domain.invites.push({
    email: email.toLowerCase(),
    group: ctx.request.body.group
  });
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

  // send an email
  try {
    await emailHelper({
      template: 'invite',
      message: {
        to: email.toLowerCase()
      },
      locals: {
        domain: { id: ctx.state.domain.id, name: ctx.state.domain.name }
      }
    });
  } catch (err) {
    if (!ctx.api) ctx.flash('error', ctx.translate('INVITE_EMAIL_ERROR'));
    ctx.logger.error(err);
  }

  if (ctx.api) return next();

  // send response
  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function removeInvite(ctx, next) {
  // ctx.request.body.email
  // ctx.query.email
  const email = ctx.request.body.email || ctx.query.email;
  if (!isSANB(email) || !isEmail(email))
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_EMAIL')));
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  // remove invite
  ctx.state.domain.invites = ctx.state.domain.invites.filter(
    (invite) => invite.email.toLowerCase() !== email.toLowerCase()
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function updateMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  // ctx.request.body.group
  if (
    !isSANB(ctx.request.body.group) ||
    !['admin', 'user'].includes(ctx.request.body.group)
  )
    return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_GROUP')));

  const member = ctx.state.domain.members.find(
    (member) => member.user.id === ctx.params.member_id
  );

  if (!member)
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  // swap the user group based off ctx.request.body.group
  ctx.state.domain.members = ctx.state.domain.members.map((member) => ({
    ...member,
    group:
      member.user.toString() === ctx.params.member_id
        ? ctx.request.body.group
        : member.group
  }));

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.client = ctx.client;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

async function removeMember(ctx, next) {
  // ctx.params.member_id
  if (!isSANB(ctx.params.member_id))
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  const member = ctx.state.domain.members.find(
    (member) => member.user && member.user.id === ctx.params.member_id
  );

  if (!member || !member.user)
    return ctx.throw(Boom.notFound(ctx.translateError('INVALID_USER')));

  // ensure that no aliases created with this user being removed
  // (they need re-assigned first before the user can be removed)
  const memberAliases = ctx.state.domain.aliases.filter(
    (alias) => alias.user && alias.user.id === member.user.id
  );

  if (memberAliases.length > 0)
    return ctx.throw(
      Boom.badRequest(ctx.translateError('ALIASES_NEED_REASSIGNED'))
    );

  ctx.state.domain = await Domains.findById(ctx.state.domain._id);
  ctx.state.domain.members = ctx.state.domain.members.filter(
    (member) => member.user.toString() !== ctx.params.member_id
  );
  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.client = ctx.client;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

function ensureNotBanned(ctx, next) {
  if (ctx.state.user[config.userFields.isBanned])
    return ctx.throw(Boom.forbidden(ctx.translateError('ACCOUNT_BANNED')));
  return next();
}

async function recoveryKeys(ctx) {
  const otpRecoveryKeys = ctx.state.user[config.userFields.otpRecoveryKeys];

  ctx.attachment('recovery-keys.txt');
  ctx.body = otpRecoveryKeys.toString().replace(/,/g, '\n').replace(/"/g, '');
}

async function updateDomain(ctx, next) {
  ctx.state.domain = await Domains.findById(ctx.state.domain._id);

  // Custom SMTP Port Forwarding
  if (isSANB(ctx.request.body.smtp_port)) {
    if (isPort(ctx.request.body.smtp_port))
      ctx.state.domain.smtp_port = ctx.request.body.smtp_port;
    else return ctx.throw(Boom.badRequest(ctx.translateError('INVALID_PORT')));
  } else {
    // Spam Scanner Settings
    ctx.state.domain.has_adult_content_protection = boolean(
      ctx.request.body.has_adult_content_protection
    );
    ctx.state.domain.has_phishing_protection = boolean(
      ctx.request.body.has_phishing_protection
    );
    ctx.state.domain.has_executable_protection = boolean(
      ctx.request.body.has_executable_protection
    );
    ctx.state.domain.has_virus_protection = boolean(
      ctx.request.body.has_virus_protection
    );
  }

  ctx.state.domain.locale = ctx.locale;
  ctx.state.domain.skip_verification = true;
  ctx.state.domain = await ctx.state.domain.save();

  if (ctx.api) return next();

  ctx.flash('custom', {
    title: ctx.request.t('Success'),
    text: ctx.translate('REQUEST_OK'),
    type: 'success',
    toast: true,
    showConfirmButton: false,
    timer: 3000,
    position: 'top'
  });

  if (ctx.accepts('html')) ctx.redirect('back');
  else ctx.body = { reloadPage: true };
}

module.exports = {
  cancelEmailChange,
  cancelSubscription,
  createAlias,
  createAliasForm,
  createDomain,
  createDomainBilling,
  createInvite,
  ensureAliasAdmin,
  ensureDomainAdmin,
  ensureNotBanned,
  ensureTeamPlan,
  ensureUpgradedPlan,
  importAliases,
  listAliases,
  listBilling,
  listDomains,
  manageBilling,
  recoveryKeys,
  remove,
  removeAlias,
  removeDomain,
  removeInvite,
  removeMember,
  resendEmailChange,
  resetAPIToken,
  retrieveAlias,
  retrieveAliases,
  retrieveBilling,
  retrieveDomain,
  retrieveDomainBilling,
  retrieveDomains,
  retrieveInvite,
  retrieveProfile,
  retrieveReceipt,
  sortedDomains,
  updateAlias,
  updateDomain,
  updateMember,
  updateProfile,
  validateAlias,
  verifyRecords
};
