/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const crypto = require('node:crypto');
const url = require('node:url');

const Attestation = require('@forwardemail/passport-fido2-webauthn/lib/fido2/attestation');
const AuthenticatorData = require('@forwardemail/passport-fido2-webauthn/lib/fido2/authenticatordata');
const Boom = require('@hapi/boom');
const Router = require('@koa/router');
const attestationFormats = require('@forwardemail/passport-fido2-webauthn/lib/fido2/formats');
const base64url = require('base64url');
const cose2jwk = require('cose-to-jwk');
const isSANB = require('is-string-and-not-blank');
const jwk2pem = require('jwk-to-pem');
const paginate = require('koa-ctx-paginate');
const pify = require('pify');
const render = require('koa-views-render');
// const utils = require('@forwardemail/passport-fido2-webauthn/lib/utils');
const {
  SessionChallengeStore
} = require('@forwardemail/passport-fido2-webauthn');
const { sha256 } = require('crypto-hash');
const _ = require('#helpers/lodash');

const Users = require('#models/users');
const config = require('#config');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const invalidateOtherSessions = require('#helpers/invalidate-other-sessions');
const policies = require('#helpers/policies');
const rateLimit = require('#helpers/rate-limit');
const web = require('#controllers/web');

const router = new Router({ prefix: '/my-account' });

const store = new SessionChallengeStore();
const storeVerify = pify(store.verify, { multiArgs: true }).bind(store);

const USER_PRESENT = 0x01;
const USER_VERIFIED = 0x04;

router
  .use((ctx, next) => {
    // don't allow robots
    ctx.set('X-Robots-Tag', 'none');
    // don't cache anything
    // <https://github.com/koa-modules/koa-no-cache/issues/5>
    ctx.set('Surrogate-Control', 'no-store');
    ctx.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', '0');
    return next();
  })
  .use(web.myAccount.ensureNotBanned)
  .use(policies.ensureLoggedIn)
  .use(policies.ensureOtp)
  .use(web.breadcrumbs)
  .use(web.myAccount.retrieveDomains)
  .use(web.myAccount.ensurePaidToDate)
  .get('/', (ctx) => {
    ctx.redirect(ctx.state.l('/my-account/domains'));
  })
  .delete(
    '/',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.remove
  )
  .get('/analytics', web.myAccount.listAnalytics)
  .get(
    '/billing',
    web.myAccount.retrieveBilling,
    web.myAccount.setConversionAndRefundStateHelpers,
    paginate.middleware(10, 50),
    web.myAccount.listBilling
  )
  .delete(
    '/billing',
    web.myAccount.cancelSubscription,
    web.myAccount.retrieveBilling,
    web.myAccount.setConversionAndRefundStateHelpers,
    paginate.middleware(10, 50),
    web.myAccount.listBilling
  )
  // deprecated old endpoint (can remove in future)
  .post('/billing/manage-payments', (ctx) =>
    ctx.redirect(ctx.state.l('/my-account/update-card'))
  )
  .get(
    '/billing/update-card',
    rateLimit(50, 'update card'),
    web.myAccount.updateCard
  )
  .post(
    '/billing/update-card',
    rateLimit(50, 'update card'),
    web.myAccount.updateCard
  )
  .get(
    '/billing/make-payment',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/billing/make-payment',
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .get(
    '/billing/enable-auto-renew',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/billing/enable-auto-renew',
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .post(
    '/billing/upgrade-request',
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.upgradeBillingRequest
  )
  .get(
    '/billing/upgrade',
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/billing/upgrade',
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .get(
    '/billing/:reference',
    rateLimit(90, 'retrieve receipt'),
    web.myAccount.retrieveReceipt
  )
  .get('/domains', paginate.middleware(10, 50), web.myAccount.listDomains)
  // TODO: document this endpoint
  .post(
    '/aliases',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias
  )
  .get(
    '/domains/new',
    web.myAccount.createDomainForm,
    render('my-account/domains/new')
  )
  .post(
    '/domains/new',
    web.myAccount.validateDomain,
    rateLimit(50, 'create domain'),
    web.myAccount.createDomain
  )

  .post(
    '/domains/:domain_id/restricted-alias-names',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(100, 'restricted alias names'),
    web.myAccount.updateRestrictedAliasNames
  )

  .post(
    '/domains/:domain_id/allowlist',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(100, 'update allowlist'),
    web.myAccount.updateAllowlistAndDenylist
  )

  .post(
    '/domains/:domain_id/denylist',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(100, 'update denylist'),
    web.myAccount.updateAllowlistAndDenylist
  )

  .post(
    '/domains/:domain_id/catch-all-passwords',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(100, 'create catch all password'),
    web.myAccount.createCatchAllPassword
  )

  .delete(
    '/domains/:domain_id/catch-all-passwords/:token_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeCatchAllPassword
  )

  .get('/domains/:domain_id/invites', web.myAccount.retrieveInvite)

  .post(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(10, 'create invite'),
    web.myAccount.createInvite
  )

  .delete(
    '/domains/:domain_id/invites',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.removeInvite
  )

  .put(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAliases,
    web.myAccount.updateMember
  )

  .delete(
    '/domains/:domain_id/members/:member_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureTeamPlan,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAliases,
    web.myAccount.removeMember
  )
  .get(
    '/domains/:domain_id/advanced-settings',
    web.myAccount.checkVerifiedEmail,
    web.myAccount.retrieveDomain,
    render('my-account/domains/advanced-settings')
  )
  .put(
    '/domains/:domain_id/advanced-settings',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.updateDomain
  )
  .del(
    '/domains/:domain_id/advanced-settings/reset-domain-webhook-key',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(20, 'reset domain webhook key'),
    web.myAccount.resetDomainWebhookKey
  )
  .get(
    '/domains/:domain_id/verify-smtp',
    web.myAccount.checkVerifiedEmail,
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    render('my-account/domains/verify-smtp')
  )
  .post(
    '/domains/:domain_id/verify-smtp',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    rateLimit(200, 'verify smtp'),
    web.myAccount.verifySMTP
  )
  .post(
    '/domains/:domain_id/change-modulus-length',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    rateLimit(20, 'change modulus length'),
    web.myAccount.changeModulusLength
  )
  .get(
    '/domains/:domain_id/aliases',
    web.myAccount.checkVerifiedEmail,
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    paginate.middleware(10, 50),
    web.myAccount.retrieveAliases,
    web.myAccount.listAliases
  )
  .get(
    '/domains/aliases/new',
    web.myAccount.createAliasForm,
    render('my-account/domains/aliases/form')
  )
  .post(
    '/domains/aliases/new',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias
  )
  .get(
    '/domains/:domain_id/aliases/new',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    // TODO: clean up this later
    (ctx, next) => {
      //
      // if the domain is ubuntu.com and the user is in the user group
      // then don't allow them to create aliases (only manage/delete their own)
      //
      if (
        (ctx.state.domain.plan === 'team' ||
          ctx.state.domain.plan === 'enterprise') &&
        ctx.state.domain.has_txt_record &&
        Object.keys(config.ubuntuTeamMapping).includes(ctx.state.domain.name)
      ) {
        const member = ctx.state.domain.members.find(
          (member) => member.user && member.user.id === ctx.state.user.id
        );

        if (!member) throw Boom.notFound(ctx.translateError('INVALID_USER'));

        if (member.group === 'user')
          throw Boom.notFound(ctx.translateError('UBUNTU_PERMISSIONS'));
      }

      return next();
    },
    render('my-account/domains/aliases/form')
  )
  .post(
    '/domains/:domain_id/aliases/new',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.validateAlias,
    rateLimit(300, 'create alias'),
    web.myAccount.createAlias
  )
  .post(
    '/domains/:domain_id/aliases/import',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.ensureUpgradedPlan,
    rateLimit(50, 'import alias'),
    web.myAccount.importAliases
  )
  .get(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    render('my-account/domains/aliases/form')
  )
  .put(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.validateAlias,
    web.myAccount.updateAlias
  )
  .delete(
    '/domains/:domain_id/aliases/:alias_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    web.myAccount.removeAlias
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/resend-verification',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    rateLimit(100, 'resend verification'),
    web.myAccount.resendVerification
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/generate-password',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    policies.ensureTurnstile,
    rateLimit(300, 'generate alias password'),
    web.myAccount.generateAliasPassword
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/qrcode',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    policies.ensureTurnstile,
    rateLimit(500, 'qrcode'),
    web.myAccount.retrieveQRCode
  )
  .post(
    '/domains/:domain_id/aliases/:alias_id/download-backup',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureUpgradedPlan,
    web.myAccount.ensureSMTPAccess,
    web.myAccount.retrieveAlias,
    web.myAccount.ensureAliasAdmin,
    policies.ensureTurnstile,
    web.myAccount.downloadAliasBackup
  )
  .get(
    '/domains/:domain_id/billing',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.setConversionAndRefundStateHelpers,
    web.myAccount.retrieveDomainBilling
  )
  .post(
    '/domains/:domain_id/billing',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    rateLimit(100, 'create domain billing'),
    web.myAccount.createDomainBilling
  )
  .post(
    '/domains/:domain_id/verify-records',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    rateLimit(200, 'verify records'),
    web.myAccount.verifyRecords
  )
  .get(
    '/emails',
    paginate.middleware(10, 50),
    rateLimit(100, 'list emails'),
    web.myAccount.listEmails
  )
  .get(
    '/emails/:id',
    rateLimit(100, 'retrieve emails'),
    web.myAccount.retrieveEmail,
    render('my-account/emails/retrieve')
  )
  .delete(
    '/emails/:id',
    rateLimit(100, 'remove emails'),
    web.myAccount.retrieveEmail,
    web.myAccount.removeEmail
  )
  .get(
    '/logs',
    paginate.middleware(10, 50),
    rateLimit(100, 'list logs'),
    web.myAccount.listLogs
  )
  .get('/logs/download', rateLimit(10, 'download logs'), web.myAccount.listLogs)
  .get(
    '/logs/:id',
    rateLimit(100, 'retrieve logs'),
    web.myAccount.retrieveLog,
    render('my-account/logs/retrieve')
  )
  .delete(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    web.myAccount.removeDomain
  )
  .get(
    '/domains/:domain_id',
    web.myAccount.retrieveDomain,
    web.myAccount.ensureDomainAdmin,
    render('my-account/domains/retrieve')
  )
  .get(
    '/change-email/:token',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    render('change-email')
  )
  .post(
    '/change-email/:token',
    policies.ensureLoggedIn,
    policies.ensureOtp,
    rateLimit(100, 'change email'),
    web.auth.changeEmail
  )
  .get(
    '/profile',
    web.myAccount.checkVerifiedEmail,
    async (ctx, next) => {
      if (ctx.query.newsletter === 'true') {
        try {
          if (ctx.state.user.has_newsletter === true) {
            ctx.flash(
              'success',
              ctx.translate('NEWSLETTER_ALREADY_SUBSCRIBED')
            );
          } else {
            ctx.state.user.has_newsletter = true;
            await ctx.state.user.save();
            ctx.flash('success', ctx.translate('NEWSLETTER_SUBSCRIBED'));
          }

          ctx.redirect(ctx.state.l('/my-account/profile'));
          return;
        } catch (err) {
          ctx.logger.fatal(err);
        }
      }

      return next();
    },
    web.myAccount.retrieveProfile
  )
  .put('/profile', web.myAccount.updateProfile)
  .put(
    '/profile/resend-email-change',
    rateLimit(5, 'resend email change'),
    web.myAccount.resendEmailChange
  )
  .put('/profile/cancel-email-change', web.myAccount.cancelEmailChange)
  .get('/timezone', (ctx) => {
    ctx.status = 301;
    ctx.redirect(ctx.state.l('/my-account'));
  })
  .post('/timezone', web.myAccount.updateTimezone)
  .delete('/security', web.myAccount.resetAPIToken)
  .post('/invalidate-other-sessions', async (ctx) => {
    await invalidateOtherSessions(ctx);
    ctx.flash('success', ctx.translate('LOGGED_OUT_OTHER_DEVICES'));
    if (ctx.accepts('html')) ctx.redirect('back');
    else ctx.body = { reloadPage: true };
  })
  .get(
    '/security',
    web.myAccount.checkVerifiedEmail,
    render('my-account/security')
  )
  .post('/recovery-keys', web.myAccount.recoveryKeys)
  .post('/passkeys', async (ctx) => {
    //
    // TODO: note that the passport-fido2-webauthn codebase has a LOT of TODO statements
    //       <https://github.com/search?q=repo%3Ajaredhanson%2Fpassport-webauthn%20TODO&type=code>
    //
    // NOTE: this source code was inspired/mirrored from example here
    //       <https://github.com/passport/todos-express-webauthn>
    //

    if (!_.isPlainObject(ctx?.request?.body?.response))
      throw new TypeError('Invalid response');

    if (!isSANB(ctx.request.body.response.clientDataJSON))
      throw new TypeError('Invalid clientDataJSON');

    if (!isSANB(ctx.request.body.response.attestationObject))
      throw new TypeError('Invalid attestationObject');

    if (!Array.isArray(ctx.request.body.response.transports))
      ctx.request.body.response.transports = [];

    // ctx.request.body {
    //   response: {
    //     clientDataJSON: '******',
    //     attestationObject: '******',
    //     transports: [ 'usb' ]
    //   }
    // }

    const { response } = ctx.request.body;
    const clientDataJSON = base64url.decode(response.clientDataJSON);
    const clientData = JSON.parse(clientDataJSON);

    // clientData {
    //   type: 'webauthn.create',
    //   challenge: '******',
    //   origin: 'http://localhost:3000',
    //   crossOrigin: false
    // }

    if (clientData.type !== 'webauthn.create')
      throw new TypeError('Client data type must be webauthn.create');

    // <https://github.com/jaredhanson/passport-webauthn/issues/7>
    const challenge = base64url.toBuffer(clientData.challenge);
    // const [ok, obj] = await storeVerify(ctx, challenge);
    const [ok] = await storeVerify(ctx, challenge);
    // [ false, { message: 'Invalid challenge.' } ]
    if (!ok) throw Boom.badRequest(ctx.translateError('INVALID_CHALLENGE'));

    // Verify that the origin contained in client data matches the origin of this
    // app (which is the relying party).
    //
    // NOTE: `originalOrigin` function uses express-style `req.connection.encrypted` check
    //       but since we're on Koa, the `req.connection` is actually `ctx.socket`
    //       (so we bind a virtual helper and cleanup after)
    //       <https://github.com/jaredhanson/passport-webauthn/issues/5>
    //
    // ctx.connection = ctx.socket;
    // const origin = utils.originalOrigin(ctx);
    // delete ctx.connection;
    // if (origin !== clientData.origin)
    //   throw Boom.badRequest(ctx.translateError('INVALID_ORIGIN_MISMATCH'))
    if (ctx.origin !== clientData.origin) {
      ctx.logger.fatal(
        new TypeError(`Origin mismatch ${ctx.origin} ${clientData.origin}`)
      );
      throw Boom.badRequest(ctx.translateError('INVALID_ORIGIN_MISMATCH'));
    }

    // TODO: Verify the state of Token Binding for the TLS connection over which
    // the attestation was obtained.

    const rpID = url.parse(ctx.origin).hostname;
    const rpIdHash = crypto.createHash('sha256').update(rpID).digest();

    // https://www.w3.org/TR/webauthn-2/#sctn-registering-a-new-credential
    const b_attestation = base64url.toBuffer(response.attestationObject);
    const attestation = Attestation.parse(b_attestation);
    const authenticatorData = AuthenticatorData.parse(
      attestation.authData,
      true,
      false
    );

    // Verify that the RP ID hash contained in authenticator data matches the
    // hash of this app's (which is the relying party) RP ID.
    if (!rpIdHash.equals(authenticatorData.rpIdHash))
      throw Boom.badRequest(ctx.translateError('INVALID_RP_ID_HASH_MISMATCH'));

    // Verify that the user present bit is set in authenticator data flags.
    // eslint-disable-next-line no-bitwise
    if (!(authenticatorData.flags & USER_PRESENT))
      throw Boom.badRequest(ctx.translateError('INVALID_USER_NOT_PRESENT'));

    // TODO: Verify alg is allowed
    // TODO: Verify that extensions are as expected.

    const format = attestationFormats[attestation.fmt];
    if (!format)
      throw Boom.badRequest(
        ctx.translateError('INVALID_ATTESTATION_FORMAT', attestation.fmt)
      );

    // Verify that the attestation statement conveys a valid attestation signature.
    const hash = crypto.createHash('sha256').update(clientDataJSON).digest();
    let vAttestation;
    try {
      vAttestation = format.verify(
        attestation.attStmt,
        attestation.authData,
        hash
      );
      ctx.logger.debug('vAttestation', { vAttestation });
    } catch (err) {
      ctx.logger.fatal(err);
      throw Boom.badRequest(ctx.translateError('INVALID_ATTESTATION_DATA'));
    }

    const credentialId = base64url.encode(
      authenticatorData.attestedCredentialData.credentialId
    );
    const jwk = cose2jwk(
      authenticatorData.attestedCredentialData.credentialPublicKey
    );
    const publicKey = jwk2pem(jwk);
    const flags = {
      // eslint-disable-next-line no-bitwise
      userPresent: Boolean(authenticatorData.flags & USER_PRESENT),
      // eslint-disable-next-line no-bitwise
      userVerified: Boolean(authenticatorData.flags & USER_VERIFIED)
    };

    ctx.logger.debug('flags', { flags });

    // self._register(obj.user, credentialId, pem, flags, authenticatorData.signCount, response.transports, vAttestation, registered);

    // <https://docs.github.com/en/authentication/authenticating-with-a-passkey/about-passkeys#about-passkeys>
    const nickname =
      response.transports
        .map((t) => t.toUpperCase())
        .join(' ')
        .trim() || 'Device';

    // save new passkey to user
    let user = await Users.findById(ctx.state.user._id);
    if (!user) throw new TypeError('User does not exist');
    user.passkeys.push({
      credentialId,
      publicKey,
      nickname,
      sha256: await sha256(
        base64url.encode(
          publicKey
            .replace('-----BEGIN PUBLIC KEY-----', '')
            .replace('-----END PUBLIC KEY-----', '')
        )
      )
    });
    user = await user.save();

    email({
      template: 'alert',
      message: {
        to: ctx.state.user.email,
        subject: i18n.translate('PASSKEY_ADDED', ctx.locale)
      },
      locals: {
        user: ctx.state.user,
        locale: ctx.locale,
        message: i18n.translate('PASSKEY_ADDED', ctx.locale)
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));

    // cleanup challenge
    delete ctx.session[store._key];
    await ctx.saveSession();

    const redirectTo = ctx.state.l(
      `/my-account/security?passkey=${
        user.passkeys[user.passkeys.length - 1].id
      }`
    );
    ctx.flash('success', ctx.translate('SUCCESSFULLY_ADDED_PASSKEY'));
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  })
  .put('/passkeys/:id', async (ctx) => {
    if (!isSANB(ctx?.request?.body?.nickname))
      throw Boom.badRequest(ctx.translateError('INVALID_NICKNAME'));

    const user = await Users.findById(ctx.state.user._id);
    if (!user) throw new TypeError('User does not exist');
    const passkey = user.passkeys.id(ctx.params.id);
    if (!passkey) throw Boom.badRequest(ctx.translateError('INVALID_PASSKEY'));
    passkey.nickname = ctx.request.body.nickname;
    await user.save();
    const redirectTo = ctx.state.l('/my-account/security');
    ctx.flash(
      'success',
      ctx.translate('SUCCESSFULLY_UPDATED_PASSKEY_NICKNAME')
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  })
  .del('/passkeys/:id', async (ctx) => {
    const user = await Users.findById(ctx.state.user._id);
    if (!user) throw new TypeError('User does not exist');
    const passkey = user.passkeys.id(ctx.params.id);
    if (!passkey) throw Boom.badRequest(ctx.translateError('INVALID_PASSKEY'));

    passkey.remove();
    await user.save();

    email({
      template: 'alert',
      message: {
        to: ctx.state.user.email,
        subject: i18n.translate('PASSKEY_REMOVED', ctx.locale)
      },
      locals: {
        user: ctx.state.user,
        locale: ctx.locale,
        message: i18n.translate('PASSKEY_REMOVED', ctx.locale)
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));

    const redirectTo = ctx.state.l('/my-account/security');
    ctx.flash('success', ctx.translate('SUCCESSFULLY_REMOVED_PASSKEY'));
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  });

module.exports = router;
