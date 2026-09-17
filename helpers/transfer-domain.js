/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');

const config = require('#config');
const i18n = require('#helpers/i18n');
const { isWithinGracePeriod } = require('#helpers/is-within-grace-period');
const { Aliases, Emails, SieveScripts } = require('#models');

function hasActivePlan(user) {
  return (
    new Date(user[config.userFields.planExpiresAt]).getTime() >= Date.now() ||
    isSANB(user[config.userFields.stripeSubscriptionID]) ||
    isSANB(user[config.userFields.paypalSubscriptionID]) ||
    isWithinGracePeriod(user)
  );
}

function assertTargetCanOwnDomain(domain, user, locale) {
  if (user[config.userFields.isBanned]) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_TRANSFER_TARGET_BANNED', locale)
    );
  }

  if (!user[config.userFields.hasVerifiedEmail]) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_TRANSFER_TARGET_UNVERIFIED', locale)
    );
  }

  if (
    user.plan !== domain.plan ||
    (domain.plan !== 'free' && !hasActivePlan(user))
  ) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_TRANSFER_TARGET_PLAN_REQUIRED', locale)
    );
  }
}

async function restoreOwners(model, owners) {
  if (!Array.isArray(owners) || owners.length === 0) return;

  await model.bulkWrite(
    owners.map((owner) => ({
      updateOne: {
        filter: { _id: owner._id },
        update: { $set: { user: owner.user } }
      }
    })),
    { ordered: true }
  );
}

/**
 * Transfers one non-global domain to a verified eligible user.
 *
 * The transfer preserves domain and alias credentials, device push tokens,
 * PGP keys, S/MIME certificates, and operational alias state so the new owner
 * can continue using the domain without disruption. It also preserves aliases,
 * forwarding settings, mailbox data, contacts, calendars, Sieve content, and
 * all domain-linked historical logs and delivered-email attribution. Only
 * in-flight outbound messages are reassigned so queued delivery continues
 * under the new owner without rewriting completed-message provenance.
 *
 * Mongo deployments may be standalone and therefore cannot rely on
 * multi-document transactions. The current alias and Sieve owners are captured
 * before mutation and restored if a later ownership write fails.
 *
 * @param {Object} options - Transfer inputs and optional test model overrides.
 * @returns {Promise<Object>} Transfer metadata used for audit notifications.
 */
async function transferDomain({
  domain,
  sourceUser,
  user,
  admin,
  locale = i18n.config.defaultLocale,
  aliases = Aliases,
  emails = Emails,
  sieveScripts = SieveScripts
}) {
  if (!domain) {
    throw Boom.notFound(i18n.translateError('DOMAIN_DOES_NOT_EXIST_ANYWHERE'));
  }

  if (domain.is_global) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_TRANSFER_GLOBAL_NOT_PERMITTED', locale)
    );
  }

  if (!sourceUser) {
    throw Boom.notFound(
      i18n.translateError('DOMAIN_TRANSFER_ORIGINAL_OWNER_NOT_FOUND', locale)
    );
  }

  if (!user) {
    throw Boom.notFound(
      i18n.translateError('DOMAIN_TRANSFER_TARGET_NOT_FOUND', locale)
    );
  }

  if (sourceUser._id.toString() === user._id.toString()) {
    throw Boom.badRequest(
      i18n.translateError(
        'DOMAIN_TRANSFER_TARGET_SAME_AS_ORIGINAL_OWNER',
        locale
      )
    );
  }

  assertTargetCanOwnDomain(domain, user, locale);

  const currentMembers = Array.isArray(domain.members) ? domain.members : [];
  const hasSourceOwner = currentMembers.some(
    (member) =>
      member?.group === 'admin' &&
      member?.user?.toString() === sourceUser._id.toString()
  );

  if (!hasSourceOwner) {
    throw Boom.notFound(
      i18n.translateError('DOMAIN_TRANSFER_ORIGINAL_OWNER_MISMATCH', locale)
    );
  }

  const previousAdminIds = currentMembers
    .filter((member) => member?.group === 'admin' && member.user)
    .map((member) => member.user);

  if (
    currentMembers.length === 1 &&
    currentMembers[0]?.group === 'admin' &&
    currentMembers[0]?.user?.toString() === user._id.toString()
  ) {
    throw Boom.badRequest(
      i18n.translateError('DOMAIN_TRANSFER_TARGET_ALREADY_OWNER', locale)
    );
  }

  const rekeyInProgress = await aliases.exists({
    domain: domain._id,
    $or: [
      { is_rekey: true },
      { rekey_processing: true },
      { rekey_id: { $exists: true, $ne: null } }
    ]
  });

  if (rekeyInProgress) {
    throw Boom.conflict(
      i18n.translateError('DOMAIN_TRANSFER_REKEY_IN_PROGRESS', locale)
    );
  }

  const [aliasOwners, emailOwners, sieveOwners] = await Promise.all([
    aliases.find({ domain: domain._id }).select('_id user').lean().exec(),
    emails
      .find({
        domain: domain._id,
        status: { $in: ['pending', 'queued', 'deferred'] }
      })
      .select('_id user')
      .lean()
      .exec(),
    sieveScripts.find({ domain: domain._id }).select('_id user').lean().exec()
  ]);

  const transferAliases = { $set: { user: user._id } };

  let aliasesTransferred = false;
  let emailsTransferred = false;
  let sieveTransferred = false;

  try {
    await aliases.updateMany({ domain: domain._id }, transferAliases);
    aliasesTransferred = true;

    await emails.updateMany(
      {
        domain: domain._id,
        status: { $in: ['pending', 'queued', 'deferred'] }
      },
      { $set: { user: user._id } }
    );
    emailsTransferred = true;

    await sieveScripts.updateMany(
      { domain: domain._id },
      { $set: { user: user._id } }
    );
    sieveTransferred = true;

    domain.members = [{ user: user._id, group: 'admin' }];
    domain.__audit_metadata = {
      user: admin,
      isAdmin: true
    };

    await domain.save();
  } catch (err) {
    const errors = [err];

    if (sieveTransferred) {
      try {
        await restoreOwners(sieveScripts, sieveOwners);
      } catch (restoreErr) {
        errors.push(restoreErr);
      }
    }

    if (emailsTransferred) {
      try {
        await restoreOwners(emails, emailOwners);
      } catch (restoreErr) {
        errors.push(restoreErr);
      }
    }

    if (aliasesTransferred) {
      try {
        await restoreOwners(aliases, aliasOwners);
      } catch (restoreErr) {
        errors.push(restoreErr);
      }
    }

    if (errors.length > 1) {
      err.transferRestoreErrors = errors.slice(1);
    }

    throw err;
  }

  return {
    previousAdminIds,
    aliasCount: aliasOwners.length,
    pendingEmailCount: emailOwners.length,
    sieveScriptCount: sieveOwners.length
  };
}

module.exports = {
  assertTargetCanOwnDomain,
  hasActivePlan,
  transferDomain
};
