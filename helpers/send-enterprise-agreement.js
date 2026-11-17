/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');

const { Users } = require('#models');

/**
 * Send the enterprise agreement of an account (a PDF an admin uploaded, see
 * `enterprise_agreement` in the user model) as a download.
 *
 * The file is not read with the account, so it is selected here.  The
 * caller decides who may have it: an admin, or the enterprise customer for
 * their own account.
 *
 * @param {Object} ctx - Koa context
 * @param {String|ObjectId} id - ID of the account
 */
async function sendEnterpriseAgreement(ctx, id) {
  const user = await Users.findById(id)
    .select('enterprise_agreement.name +enterprise_agreement.data')
    .lean()
    .exec();

  const agreement = user && user.enterprise_agreement;
  // (the driver returns a Binary for a lean document)
  const data =
    agreement && agreement.data
      ? Buffer.isBuffer(agreement.data)
        ? agreement.data
        : agreement.data.buffer
      : null;
  if (!Buffer.isBuffer(data) || data.length === 0)
    throw Boom.notFound('Enterprise agreement does not exist');

  //
  // always a download, never shown in the page (a PDF can carry scripts),
  // and not kept by the browser or anything between it and us
  //
  ctx.type = 'application/pdf';
  ctx.attachment(agreement.name || 'enterprise-agreement.pdf');
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('Content-Security-Policy', "default-src 'none'; sandbox");
  ctx.set('Cache-Control', 'private, no-store, max-age=0');
  ctx.body = data;
}

module.exports = sendEnterpriseAgreement;
