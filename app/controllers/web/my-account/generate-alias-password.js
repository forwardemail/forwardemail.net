/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

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
const { encrypt } = require('#helpers/encrypt-decrypt');

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

  try {
    const alias = await Aliases.findById(ctx.state.alias._id)
      .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
      .exec();

    originalTokens = alias.tokens;

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
      if (isSANB(ctx.request.body.password)) {
        // change password on existing sqlite file using supplied password and new password
        //
        // TODO: because rekey has VACUUM INTO and VACUUM calls
        //       this operation is likely to take longer than HTTP timeout
        //       therefore we should change messaging and functionality
        //       so that this alerts the user via email once it is complete
        //
        await wsp.request(
          {
            action: 'rekey',
            new_password: encrypt(pass),
            session: {
              user: {
                id: alias.id,
                username: `${alias.name}@${ctx.state.domain.name}`,
                alias_id: alias.id,
                alias_name: alias.name,
                domain_id: ctx.state.domain.id,
                domain_name: ctx.state.domain.name,
                password: encrypt(ctx.request.body.password),
                storage_location: alias.storage_location,
                alias_has_pgp: alias.has_pgp,
                alias_public_key: alias.public_key,
                alias_has_smime: alias.has_smime,
                alias_smime_certificate: alias.smime_certificate,
                locale: ctx.locale,
                owner_full_email: ctx.state.user.email
              }
            }
          },
          // don't retry so we can email user quicker to try again
          // and also in case of an error with the backup worker
          // e.g. it won't keep retrying and flood it
          0
        );

        if (!ctx.api) {
          ctx.flash(
            'success',
            ctx.translate(
              'ALIAS_REKEY_STARTED',
              `${alias.name}@${ctx.state.domain.name}`
            )
          );
        }

        // don't save until we're sure that sqlite operations were performed
        alias.is_rekey = true;
        await alias.save();
      } else if (boolean(ctx.request.body.is_override)) {
        // reset existing mailbox and create new mailbox
        await wsp.request(
          {
            action: 'reset',
            session: {
              user: {
                id: alias.id,
                username: `${alias.name}@${ctx.state.domain.name}`,
                alias_id: alias.id,
                alias_name: alias.name,
                domain_id: ctx.state.domain.id,
                domain_name: ctx.state.domain.name,
                password: encrypt(pass),
                storage_location: alias.storage_location,
                alias_has_pgp: alias.has_pgp,
                alias_public_key: alias.public_key,
                alias_has_smime: alias.has_smime,
                alias_smime_certificate: alias.smime_certificate,
                locale: ctx.locale,
                owner_full_email: ctx.state.user.email
              }
            }
          },
          // don't retry so we can email user quicker to try again
          // and also in case of an error with the backup worker
          // e.g. it won't keep retrying and flood it
          0
        );

        // don't save until we're sure that sqlite operations were performed
        await alias.save();
      } else {
        // create new mailbox
        /*
        // NOTE: we're just using reset here as a safeguard
        await wsp.request({
          action: 'setup',
          session: {
            user: {
              id: alias.id,
              username: `${alias.name}@${ctx.state.domain.name}`,
              alias_id: alias.id,
              alias_name: alias.name,
              domain_id: ctx.state.domain.id,
              domain_name: ctx.state.domain.name,
              password: encrypt(pass),
              storage_location: alias.storage_location,
              alias_has_pgp: alias.has_pgp,
              alias_public_key: alias.public_key,
              alias_has_smime: alias.has_smime,
              alias_smime_certificate: alias.smime_certificate,
              locale: ctx.locale,
              owner_full_email: ctx.state.user.email
            }
          }
        },
        // don't retry so we can email user quicker to try again
        // and also in case of an error with the backup worker
        // e.g. it won't keep retrying and flood it
        0
        );
        */
        await wsp.request(
          {
            action: 'reset',
            session: {
              user: {
                id: alias.id,
                username: `${alias.name}@${ctx.state.domain.name}`,
                alias_id: alias.id,
                alias_name: alias.name,
                domain_id: ctx.state.domain.id,
                domain_name: ctx.state.domain.name,
                password: encrypt(pass),
                storage_location: alias.storage_location,
                alias_has_pgp: alias.has_pgp,
                alias_public_key: alias.public_key,
                alias_has_smime: alias.has_smime,
                alias_smime_certificate: alias.smime_certificate,
                locale: ctx.locale,
                owner_full_email: ctx.state.user.email
              }
            }
          },
          // don't retry so we can email user quicker to try again
          // and also in case of an error with the backup worker
          // e.g. it won't keep retrying and flood it
          0
        );

        // save alias
        await alias.save();
      }
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

    const html = emailedInstructions
      ? ctx.translate('ALIAS_PASSWORD_INSTRUCTIONS', emailedInstructions)
      : ctx.translate(
          'ALIAS_GENERATED_PASSWORD',
          username,
          username,
          pass,
          pass,
          appleImgSrc,
          appleLink,
          `${username}.mobileconfig`,
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
    // if an error occurs then remove any tokens created (if any)
    // and restore the original tokens that were there (if any)
    // (this edge case happens if `wsp.request` cannot connect or set new key)
    //
    if (newToken && Array.isArray(originalTokens)) {
      // restore original tokens
      try {
        await Aliases.findByIdAndUpdate(ctx.state.alias._id, {
          $set: {
            tokens: originalTokens
          }
        });
      } catch (err) {
        ctx.logger.fatal(err);
      }
    }

    if (err && err.isBoom) throw err;
    if (isErrorConstructorName(err, 'ValidationError')) throw err;
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
