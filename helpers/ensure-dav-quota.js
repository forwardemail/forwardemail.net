/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');

const Aliases = require('#models/aliases');
const i18n = require('#helpers/i18n');

//
// CalDAV and CardDAV writes are stored in the alias's mailbox, so they are
// refused once it is over quota, as IMAP and the API refuse them (507
// Insufficient Storage, RFC 4918 Section 11.5 and RFC 4331).
//
async function ensureDavQuota(ctx, size = 0) {
  const user = ctx?.state?.session?.user;
  if (!user?.alias_id || !user?.domain_id)
    throw Boom.unauthorized(i18n.translateError('INVALID_USER', ctx.locale));

  const { isOverQuota } = await Aliases.isOverQuota(
    { id: user.alias_id, domain: user.domain_id, locale: ctx.locale },
    Math.max(0, size || 0),
    ctx.client || ctx.instance?.client
  );
  if (isOverQuota)
    throw new Boom.Boom(i18n.translate('IMAP_MAILBOX_OVER_QUOTA', ctx.locale), {
      statusCode: 507
    });
}

module.exports = ensureDavQuota;
