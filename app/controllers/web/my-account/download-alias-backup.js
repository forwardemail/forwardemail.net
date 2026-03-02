/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const dashify = require('dashify');
const isSANB = require('is-string-and-not-blank');
const {
  GetObjectCommand,
  ListObjectsV2Command
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const _ = require('#helpers/lodash');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const isValidPassword = require('#helpers/is-valid-password');
const isErrorConstructorName = require('#helpers/is-error-constructor-name');
const { encrypt } = require('#helpers/encrypt-decrypt');
const checkS3BucketAccess = require('#helpers/check-s3-bucket-access');
const { getS3Client } = require('#helpers/get-s3-client');

async function downloadAliasBackup(ctx) {
  const redirectTo = ctx.state.l(
    `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
  );
  try {
    const alias = await Aliases.findById(ctx.state.alias._id)
      .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
      .lean()
      .exec();

    if (alias.name === '*' || alias.name.startsWith('/'))
      throw Boom.badRequest(ctx.translateError('INVALID_ALIAS_BACKUP'));

    // validate the `auth.password` provided
    if (!Array.isArray(alias.tokens) || alias.tokens.length === 0)
      throw Boom.badRequest(ctx.translateError('ALIAS_NO_GENERATED_PASSWORD'));

    if (isSANB(ctx.request.body.password)) {
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
          .pexpire(key, config.smtpLimitAuthDuration);
        throw Boom.forbidden(ctx.translateError('INVALID_PASSWORD'));
      }

      // Clear authentication limit for this user
      await ctx.client.del(`auth_limit_${config.env}:${ctx.state.user.id}`);
    }

    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
      ctx.state.domain
    );

    // send email notification when backup downloaded
    if (!isSANB(ctx.request.body.password))
      email({
        template: 'alert',
        message: {
          to,
          ...(to.includes(ctx.state.user.email)
            ? {}
            : { cc: ctx.state.user.email }),
          subject: i18n.translate(
            'ALIAS_BACKUP_DOWNLOAD_SUBJECT',
            locale,
            `${alias.name}@${ctx.state.domain.name}`
          )
        },
        locals: {
          user: ctx.state.user,
          locale,
          message: i18n.translate(
            'ALIAS_BACKUP_DOWNLOAD',
            locale,
            ctx.state.user.email,
            `${alias.name}@${ctx.state.domain.name}`
          )
        }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));

    if (!isSANB(ctx.request.body.format)) {
      ctx.request.body.format = 'sqlite';
    } else if (!['eml', 'mbox', 'sqlite'].includes(ctx.request.body.format)) {
      throw Boom.badRequest(ctx.translateError('INVALID_ALIAS_BACKUP_FORMAT'));
    }

    // send backup request
    if (isSANB(ctx.request.body.password)) {
      // use shared wsp from instance if available (API server),
      // otherwise create an ephemeral connection (web server)
      const hasSharedWsp = Boolean(ctx.instance?.wsp);
      const wsp = hasSharedWsp ? ctx.instance.wsp : createWebSocketAsPromised();

      try {
        await wsp.request(
          {
            action: 'backup',
            backup_at: new Date().toISOString(),
            format: ctx.request.body.format,
            email: ctx.state.user.email,
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

      // otherwise flash message that email will be sent once download ready
      ctx.flash(
        'success',
        ctx.translate(
          'ALIAS_BACKUP_STARTED',
          `${alias.name}@${ctx.state.domain.name}`
        )
      );
    } else {
      // otherwise get signed URL if password not specified
      //
      // Look up domain with custom S3 config for per-domain storage
      //
      const domainWithS3 = await Domains.findById(ctx.state.domain._id)
        .select('+s3_access_key_id +s3_secret_access_key')
        .lean()
        .exec();
      let { client: s3, bucket: customBucket } = getS3Client(domainWithS3);

      // Validate the custom bucket is not publicly accessible
      if (domainWithS3 && domainWithS3.has_custom_s3 === true && customBucket) {
        try {
          const isPublic = await checkS3BucketAccess(
            domainWithS3.s3_endpoint,
            customBucket
          );
          if (isPublic) {
            ctx.logger.warn(
              'Custom S3 bucket is publicly accessible, falling back to default',
              { domain_id: domainWithS3._id, bucket: customBucket }
            );
            const defaultResult = getS3Client();
            s3 = defaultResult.client;
            customBucket = null;
          }
        } catch (err) {
          ctx.logger.warn(err);
        }
      }

      const bucket =
        customBucket ||
        `${config.env}-${dashify(_.camelCase(alias.storage_location))}`;

      //
      // for custom S3 storage, backups are stored with ISO 8601 timestamp
      // prefixed keys (e.g. "2025-03-01T12:00:00.000Z-alias_id.sqlite")
      // so we need to list objects and find the latest one
      //
      // for default (system) S3, the key is flat (e.g. "alias_id.sqlite")
      //
      let latestKey = `${alias.id}.sqlite`;

      if (customBucket) {
        try {
          const listResponse = await s3.send(
            new ListObjectsV2Command({
              Bucket: bucket,
              Prefix: '',
              Delimiter: ''
            })
          );

          if (listResponse.Contents && listResponse.Contents.length > 0) {
            // filter to only .sqlite files matching this alias
            const matchingKeys = listResponse.Contents.filter(
              (obj) =>
                obj.Key &&
                (obj.Key.endsWith(`-${alias.id}.sqlite`) ||
                  obj.Key === `${alias.id}.sqlite`)
            ).sort(
              (a, b) => new Date(b.LastModified) - new Date(a.LastModified)
            );

            if (matchingKeys.length > 0) {
              latestKey = matchingKeys[0].Key;
            }
          }
        } catch (err) {
          ctx.logger.warn('Failed to list custom S3 objects, using flat key', {
            error: err
          });
        }
      }

      const link = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: bucket,
          Key: latestKey
        }),
        { expiresIn: 3600 }
      );
      ctx.flash('success', ctx.translate('ALIAS_BACKUP_LINK', link));
    }

    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }
  } catch (err) {
    if (err && err.isBoom) throw err;
    if (isErrorConstructorName(err, 'ValidationError')) throw err;
    ctx.logger.fatal(err);
    ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
    const redirectTo = ctx.state.l(
      `/my-account/domains/${punycode.toASCII(ctx.state.domain.name)}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  }
}

module.exports = downloadAliasBackup;
