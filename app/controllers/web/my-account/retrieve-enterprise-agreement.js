/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const sendEnterpriseAgreement = require('#helpers/send-enterprise-agreement');

//
// An enterprise customer downloads their own agreement from their Billing
// page, for as long as their account is an enterprise one
//
async function retrieveEnterpriseAgreement(ctx) {
  if (!ctx.state.user.is_enterprise)
    throw Boom.notFound(ctx.translateError('PAYMENT_REFERENCE_INVALID'));

  await sendEnterpriseAgreement(ctx, ctx.state.user._id);
}

module.exports = retrieveEnterpriseAgreement;
