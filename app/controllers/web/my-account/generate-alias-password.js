/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { randomUUID } = require('node:crypto');
const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const QRCode = require('qrcode');
const RE2 = require('re2');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const sanitizeHtml = require('sanitize-html');
const shortID = require('mongodb-short-id');
const titleize = require('titleize');
const { boolean } = require('boolean');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const _ = require('#helpers/lodash');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const email = require('#helpers/email');
const env = require('#config/env');
const i18n = require('#helpers/i18n');
const isEmail = require('#helpers/is-email');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const isValidPassword = require('#helpers/is-valid-password');
const ServerShutdownError = require('#helpers/server-shutdown-error');
const { encrypt } = require('#helpers/encrypt-decrypt');
const { acquireRekeyLock } = require('#helpers/rekey-lock');
const { rollbackRekey } = require('#helpers/rekey-recovery');

//
// (this punctuation stuff is borrowed from our work with `spamscanner`)
// punctuation characters
// (need stripped from tokenization)
// <https://github.com/regexhq/punctuation-regex>
// NOTE: we prepended a normal "-" hyphen since it was missing
const PUNCTUATION_REGEX = new RE2(
  /[-‒–—―|$&~=\\/⁄@+*!?({[\]})<>‹›«».;:^‘’“”'",،、`·•†‡°″¡¿※#№÷×%‰−‱¶′‴§_‖¦]/g
);

async function generateAliasPassword(ctx) {
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
  );

  let originalTokens;
  let newToken = false;
  let rekeyStateSaved = false;
  let rekeyId;

  try {
    const alias = await Aliases.findById(ctx.state.alias._id)
      .select(
        '+tokens.description +tokens.hash +tokens.salt +tokens.has_pbkdf2_migration'
      )
      .exec();

    //
    // Clone the token subdocuments before replacing the array.  The snapshot
    // is persisted with is_rekey below and is the authoritative rollback
    // state if the rotation does not complete.
    //
    // The fields are copied one by one on purpose: `toObject()` applies the
    // model's hidden-field transform, which strips the salt and the hash
    // (they are `select: false`), and a snapshot without them cannot
    // validate the previous password once it is restored -- the owner would
    // be locked out of an intact mailbox after every rollback.
    //
    originalTokens = alias.tokens.map((token) => ({
      _id: token._id,
      description: token.description,
      salt: token.salt,
      hash: token.hash,
      has_pbkdf2_migration: token.has_pbkdf2_migration,
      ...(token.created_at ? { created_at: token.created_at } : {}),
      ...(token.updated_at ? { updated_at: token.updated_at } : {})
    }));

    // never persist (or restore) a snapshot that cannot validate a password
    if (
      originalTokens.some((token) => !isSANB(token.salt) || !isSANB(token.hash))
    ) {
      const err = new TypeError(
        `Token snapshot of alias ${alias.id} is missing its salt or hash`
      );
      err.isCodeBug = true;
      throw err;
    }

    if (alias.is_rekey)
      throw Boom.conflict(ctx.translateError('ALIAS_REKEY_IN_PROGRESS'));

    if (alias.name === '*')
      throw Boom.badRequest(
        ctx.translateError('CANNOT_CREATE_TOKEN_FOR_CATCHALL')
      );

    if (alias.name.startsWith('/'))
      throw Boom.badRequest(
        ctx.translateError('CANNOT_CREATE_TOKEN_FOR_REGEX')
      );

    // if user did not specify is_override === true and no password provided
    // and the alias had existing passwords then throw an error
    if (
      Array.isArray(alias.tokens) &&
      alias.tokens.length > 0 &&
      !isSANB(ctx.request.body.password) &&
      !boolean(ctx.request.body.is_override)
    )
      throw Boom.badRequest(ctx.translateError('ALIAS_OVERRIDE_REQUIRED'));

    // prompt user for email address to send password to
    let emailedInstructions;
    if (isSANB(ctx.request.body.emailed_instructions)) {
      if (!isEmail(ctx.request.body.emailed_instructions))
        throw Boom.badRequest(ctx.translateError('INVALID_EMAIL'));
      emailedInstructions = ctx.request.body.emailed_instructions.toLowerCase();
    }

    if (isSANB(ctx.request.body.password)) {
      if (boolean(ctx.request.body.is_override))
        throw Boom.badRequest(
          ctx.translateError('ALIAS_OVERRIDE_CANNOT_HAVE_PASSWORD')
        );

      //
      // rate limiting (checks if we have had more than 5 failed auth attempts in a row)
      //
      const count = await ctx.client.incrby(
        `auth_limit_${config.env}:${ctx.state.user.id}`,
        0
      );

      if (count >= config.smtpLimitAuth)
        throw Boom.forbidden(ctx.translateError('ALIAS_RATE_LIMITED'));

      // trim password
      ctx.request.body.password = ctx.request.body.password.trim();

      // ensure that the token is valid
      const isValid = await isValidPassword(
        alias.tokens,
        ctx.request.body.password,
        alias
      );

      if (!isValid) {
        // increase failed counter by 1
        const key = `auth_limit_${config.env}:${ctx.state.user.id}`;
        await ctx.client
          .pipeline()
          .incr(key)
          .pexpire(key, config.smtpLimitAuthDuration)
          .exec();
        throw Boom.forbidden(ctx.translateError('INVALID_PASSWORD'));
      }

      // Clear authentication limit for this user
      await ctx.client.del(`auth_limit_${config.env}:${ctx.state.user.id}`);
    }

    // set locale for translation in `createToken`
    alias.locale = ctx.locale;
    alias.tokens = [];

    // get user inputs
    const userInputs = [
      alias.name,
      alias.description,
      ...alias.labels,
      ctx.state.domain.name,
      `${alias.name}@${ctx.state.domain.name}`
    ];

    for (const prop of [
      'email',
      config.passport.fields.givenName,
      config.passport.fields.familyName,
      config.userFields.receiptEmail,
      config.userFields.companyName,
      config.userFields.addressLine1,
      config.userFields.addressLine2,
      config.userFields.addressCity,
      config.userFields.addressState,
      config.userFields.addressZip,
      config.userFields.companyVAT
    ]) {
      if (isSANB(ctx.state.user[prop])) userInputs.push(ctx.state.user[prop]);
    }

    const pass = await alias.createToken(
      `${ctx.state.user.email}${
        emailedInstructions ? ` for ${emailedInstructions}` : ''
      }`,
      ctx.request.body.new_password || undefined,
      _.uniq(_.compact(userInputs))
    );
    newToken = true;
    alias.emailed_instructions = emailedInstructions || undefined;

    // use shared wsp from instance if available (API server),
    // otherwise create an ephemeral connection (web server)
    const hasSharedWsp = Boolean(ctx.instance?.wsp);
    const wsp = hasSharedWsp ? ctx.instance.wsp : createWebSocketAsPromised();

    try {
      // Bail early if the server is shutting down: do not start a rotation
      // that may never complete.
      if (ctx.instance?.isClosing || ctx.isClosing) {
        throw new ServerShutdownError();
      }

      //
      // Every rotation of the mailbox password -- a rekey of the existing
      // mailbox, or a reset that replaces it with a fresh one -- persists the
      // replacement token together with the rollback snapshot BEFORE the
      // sqlite server is asked to do anything.  Authentication is refused
      // and mailbox operations are gated while `is_rekey` is set, so no
      // session can touch the mailbox with either password until the
      // rotation is settled: by the sqlite-worker (rekey), by the sqlite
      // server (reset), by the rollback below, or by recovery after a crash
      // (helpers/recover-rekeys.js, jobs/cleanup-stuck-rekeys.js).
      //
      rekeyId = randomUUID();
      alias.is_rekey = true;
      alias.rekey_started_at = new Date();
      alias.rekey_previous_tokens = originalTokens;
      alias.rekey_id = rekeyId;
      alias.rekey_processing = false;
      await alias.save();
      rekeyStateSaved = true;

      // Cache hits do not query MongoDB. Acquire the operation-scoped lock
      // before queuing work so every protocol is forced to see is_rekey.
      await acquireRekeyLock(ctx.client, alias.id, rekeyId);

      // Invalidate cached credentials across SMTP, IMAP, and POP3 (and
      // cached mailbox handles in the sqlite server) before any work starts.
      await ctx.client.publish('sqlite_auth_reset', alias.id);

      const sessionUser = {
        id: alias.id,
        username: `${alias.name}@${ctx.state.domain.name}`,
        alias_id: alias.id,
        alias_name: alias.name,
        domain_id: ctx.state.domain.id,
        domain_name: ctx.state.domain.name,
        storage_location: alias.storage_location,
        alias_has_pgp: alias.has_pgp,
        alias_public_key: alias.public_key,
        alias_has_smime: alias.has_smime,
        alias_smime_certificate: alias.smime_certificate,
        alias_has_wkd_disabled: alias.has_wkd_disabled,
        locale: ctx.locale,
        owner_full_email: ctx.state.user.email
      };

      if (isSANB(ctx.request.body.password)) {
        // Enqueue the rekey job via WSP → parse-payload → Redis List.
        // The actual rekey is performed asynchronously by sqlite-worker;
        // the user is emailed on completion or failure.
        await wsp.request(
          {
            action: 'rekey',
            rekey_id: rekeyId,
            new_password: encrypt(pass),
            session: {
              user: {
                ...sessionUser,
                password: encrypt(ctx.request.body.password)
              }
            }
          },
          // don't retry so we can email user quicker to try again
          // and also in case of an error with the backup worker
          // e.g. it won't keep retrying and flood it
          0
        );

        //
        // Return early for rekey — the user will be emailed once complete.
        // This avoids HTTP timeout issues since rekey involves VACUUM INTO
        // and VACUUM calls that can take longer than the HTTP timeout.
        //
        if (ctx.api) {
          ctx.body = {
            message: ctx.translate(
              'ALIAS_REKEY_STARTED',
              `${alias.name}@${ctx.state.domain.name}`
            )
          };
        } else {
          ctx.flash(
            'success',
            ctx.translate(
              'ALIAS_REKEY_STARTED',
              `${alias.name}@${ctx.state.domain.name}`
            )
          );
          if (ctx.accepts('html')) ctx.redirect(redirectTo);
          else ctx.body = { redirectTo };
        }

        return;
      }

      //
      // Reset (the owner overrides a lost password, or the alias gets its
      // first one): the sqlite server replaces the mailbox with a fresh one
      // encrypted with the new password and finalizes the rotation itself
      // (helpers/reset-mailbox.js and the `reset` action).  The outcome is
      // read from MongoDB rather than from the reply, which can be lost in
      // transit after the work was done.
      //
      let resetErr;
      try {
        await wsp.request(
          {
            action: 'reset',
            rekey_id: rekeyId,
            session: {
              user: {
                ...sessionUser,
                password: encrypt(pass)
              }
            }
          },
          // don't retry so we can email user quicker to try again
          // and also in case of an error with the backup worker
          // e.g. it won't keep retrying and flood it
          0
        );
      } catch (err) {
        resetErr = err;
      }

      const newTokenHash = alias.tokens[0].hash;
      const state = await Aliases.findById(alias._id)
        .select({
          is_rekey: 1,
          rekey_id: 1,
          rekey_swap_ino: 1,
          'tokens.hash': 1
        })
        .lean()
        .exec();

      // the sqlite server finalized the rotation with the new token
      const finalized =
        state &&
        state.is_rekey !== true &&
        Array.isArray(state.tokens) &&
        state.tokens.some((token) => token.hash === newTokenHash);

      // the fresh mailbox is in place (recorded right before it replaces
      // the old one) and the sqlite server is still finalizing, or died
      // before it could: recovery finalizes from that record
      const swapRecorded =
        state &&
        state.is_rekey === true &&
        state.rekey_id === rekeyId &&
        isSANB(state.rekey_swap_ino);

      if (!finalized && !swapRecorded)
        throw resetErr || new Error('Mailbox reset did not complete');

      if (resetErr)
        ctx.logger.warn(resetErr, {
          alias_id: alias.id,
          rekey_id: rekeyId,
          finalized,
          swap_recorded: swapRecorded
        });
    } finally {
      // close ephemeral websocket (do not close the shared instance)
      if (!hasSharedWsp && wsp?.isOpened) {
        try {
          wsp.close();
        } catch (err) {
          ctx.logger.fatal(err);
        }
      }
    }

    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
      ctx.state.domain
    );

    // send password instructions to address provided
    if (emailedInstructions) {
      await email({
        template: 'alert',
        message: {
          to: emailedInstructions,
          locale,
          subject: i18n.translate(
            'ALIAS_PASSWORD_INSTRUCTIONS_SUBJECT',
            locale,
            `${alias.name}@${ctx.state.domain.name}`
          )
        },
        locals: {
          locale,
          message: i18n.translate(
            'ALIAS_PASSWORD_EMAIL',
            locale,
            ctx.state.user.email,
            `${alias.name}@${ctx.state.domain.name}`,
            //
            // NOTE: if this URL is retrieved and valid then a new password is generated and rendered for 30s
            //       (and can only be accessed if the alias has `emailed_instructions` equal to the entered value
            //
            `${config.urls.web}/ap/${ctx.state.domain.id}/${alias.id}/${encrypt(
              pass
            )}`
          )
        }
      });
    }

    // send email notification when new password generated
    email({
      template: 'alert',
      message: {
        to,
        ...(to.includes(ctx.state.user.email)
          ? {}
          : { cc: ctx.state.user.email }),
        subject: i18n.translate(
          'ALIAS_PASSWORD_GENERATED_SUBJECT',
          locale,
          `${alias.name}@${ctx.state.domain.name}`
        )
      },
      locals: {
        user: ctx.state.user,
        locale,
        message: (
          i18n.translate(
            'ALIAS_PASSWORD_GENERATED',
            locale,
            `${alias.name}@${ctx.state.domain.name}`,
            ctx.state.user.email
          ) +
          ' ' +
          (emailedInstructions
            ? i18n.translate(
                'ALIAS_PASSWORD_INSTRUCTIONS',
                locale,
                emailedInstructions
              )
            : '')
        ).trim()
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));

    // we use shortID to generate shorter querystring for less complicated QR code
    // (this same logic is in app/controllers/web/index.js)
    const username = `${alias.name}@${ctx.state.domain.name}`;
    const appleLink = `${
      config.urls.web
    }/c/${username}.mobileconfig?a=${shortID.longToShort(alias.id)}&p=${encrypt(
      pass
    )}`;
    const appleImgSrc = await QRCode.toDataURL(appleLink, {
      margin: 0,
      width: 200
    });
    /*
    const k9Link = `${
      config.urls.web
    }/c/${username}.k9s?a=${shortID.longToShort(alias.id)}&p=${encrypt(pass)}`;
    const k9ImgSrc = await QRCode.toDataURL(k9Link, {
      margin: 0,
      width: 200
    });
    */

    const name = titleize(humanize(alias.name.replace(PUNCTUATION_REGEX, ' ')));

    // <https://gist.github.com/titanism/4a1a2816e0b57a5fa930f449256b75f6>
    //
    // 3 = TLS/SSL connection security
    // if (env.IMAP_PORT === 993 || env.IMAP_PORT === 2993) = 3
    // if (!env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production') = 3
    // otherwise 1 or 2 (probably 2)
    //
    // 1 = Password (cleartext) authentication
    //
    const imapTLS = env.IMAP_PORT === 993 || env.IMAP_PORT === 2993 ? 3 : 2;
    const smtpTLS =
      !env.SMTP_ALLOW_INSECURE_AUTH || config.env === 'production' ? 3 : 2;
    const thunderbirdQRCode = await QRCode.toDataURL(
      `[1,[1,1],[0,"${env.IMAP_HOST}",${env.IMAP_PORT},${imapTLS},1,"${username}","${username}","${pass}"],[[[0,"${env.SMTP_HOST}",${env.SMTP_PORT},${smtpTLS},1,"${username}","${pass}"],["${username}","${name}"]]]]`,
      {
        margin: 0,
        width: 200
      }
    );

    //
    // FWD-01-007: HTML-escape user-controlled values before interpolation
    // into the HTML template. The password can be user-supplied via
    // ctx.request.body.new_password and username contains the alias name.
    // Without escaping, these could inject arbitrary HTML/JS into the
    // SweetAlert2 popup which renders via the `html` property.
    //
    const escapeHtml = (str) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    const safeUsername = escapeHtml(username);
    const safePass = escapeHtml(pass);

    const html = emailedInstructions
      ? ctx.translate('ALIAS_PASSWORD_INSTRUCTIONS', emailedInstructions)
      : ctx.translate(
          'ALIAS_GENERATED_PASSWORD',
          safeUsername,
          safeUsername,
          safePass,
          safePass,
          appleImgSrc,
          appleLink,
          `${safeUsername}.mobileconfig`,
          thunderbirdQRCode
          // k9Link,
          // `${username}.k9s`
        );

    if (ctx.api) {
      if (emailedInstructions) {
        ctx.body = sanitizeHtml(
          ctx.translate('ALIAS_PASSWORD_INSTRUCTIONS', emailedInstructions),
          {
            allowedTags: [],
            allowedAttributes: {}
          }
        );
      } else {
        ctx.body = {
          username: `${alias.name}@${ctx.state.domain.name}`,
          password: pass
        };
      }

      return;
    }

    const swal = {
      title: ctx.request.t('Success'),
      html,
      type: 'success',
      ...(emailedInstructions
        ? {}
        : {
            timer: ms('10m'),
            position: 'top',
            allowEscapeKey: false,
            allowOutsideClick: false,
            focusConfirm: false,
            confirmButtonText: ctx.translate('CLOSE_POPUP'),
            grow: 'row'
          })
    };
    ctx.flash('custom', swal);
    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }
  } catch (err) {
    //
    // If no rekey state was persisted, remove any created tokens and restore
    // the original tokens.  Once the state is persisted, do not roll it back
    // here: a WebSocket transport failure can occur after the job was queued.
    // In that uncertain case the worker, startup recovery, or stale-rekey job
    // performs an atomic rollback from rekey_previous_tokens instead.
    if (newToken && Array.isArray(originalTokens)) {
      try {
        if (rekeyStateSaved && rekeyId) {
          //
          // A transport error can happen after the sqlite server accepted
          // the request.  Roll back only when the operation is still
          // unclaimed (the sqlite-worker claims a rekey before touching the
          // mailbox) and no swap was recorded (the sqlite server records a
          // reset's fresh mailbox before it replaces the old one); otherwise
          // the owner of the operation, or recovery, settles the state.
          // The pre-rotation tokens are restored as they were, so an alias
          // that had no password before has none afterwards.
          //
          await rollbackRekey(ctx.client, ctx.state.alias._id, {
            filter: { rekey_id: rekeyId, rekey_processing: { $ne: true } },
            rekeyId,
            tokens: originalTokens
          });
        } else {
          // No asynchronous state was saved, so a regular token-generation
          // error can restore the in-memory pre-change token set directly.
          await Aliases.findByIdAndUpdate(ctx.state.alias._id, {
            $set: {
              tokens: originalTokens
            }
          });
        }
      } catch (rollbackErr) {
        ctx.logger.fatal(rollbackErr);
      }
    }

    if (err && err.isBoom) throw err;
    if (isErrorConstructorName(err, 'ValidationError')) throw err;

    //
    // A reset that could not replace the mailbox (a connection to it is
    // still open somewhere, or another rotation owns the alias) was rolled
    // back above and nothing changed: tell the owner to try again.
    //
    if (err && (err.isResetRetryable || err.isRekeying)) {
      ctx.logger.warn(err);
      throw Boom.conflict(
        ctx.translateError(
          err.isRekeying ? 'ALIAS_REKEY_IN_PROGRESS' : 'MAILBOX_CREATION_FAILED'
        )
      );
    }

    ctx.logger.fatal(err);

    if (ctx.api) {
      throw ctx.translateError('UNKNOWN_ERROR');
    } else {
      ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
      const redirectTo = ctx.state.l(
        `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
      );
      if (ctx.accepts('html')) ctx.redirect(redirectTo);
      else ctx.body = { redirectTo };
    }
  }
}

module.exports = generateAliasPassword;
