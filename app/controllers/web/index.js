/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const Meta = require('koa-meta');
const QRCode = require('qrcode');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const mongoose = require('mongoose');
const ms = require('ms');
const reservedEmailAddressesList = require('reserved-email-addresses-list');
const revHash = require('rev-hash');
const sanitizeHtml = require('sanitize-html');
const sharp = require('sharp');
const shortID = require('mongodb-short-id');
const splitLines = require('split-lines');
const titleize = require('titleize');
const wrap = require('word-wrap');
const { Octokit } = require('@octokit/core');
const { gzip } = require('node-gzip');

const admin = require('./admin');
const api = require('./api');
const auth = require('./auth');
const encryptTxt = require('./encrypt');
const faq = require('./faq');
const help = require('./help');
const myAccount = require('./my-account');
const onboard = require('./onboard');
const otp = require('./otp');
const report = require('./report');
const denylist = require('./denylist');
const guides = require('./guides');
const sitemap = require('./sitemap');
const search = require('./search');
const ips = require('./ips');
const mobileConfig = require('./mobile-config');
const feed = require('./feed');
const calendar = require('./calendar');
const eventFeed = require('./event-feed');
const unsubscribe = require('./unsubscribe');
const _ = require('#helpers/lodash');

const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const Users = require('#models/users');
const config = require('#config');
const env = require('#config/env');
// const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const isValidPassword = require('#helpers/is-valid-password');
const logger = require('#helpers/logger');
// const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');
const { decrypt } = require('#helpers/encrypt-decrypt');

const meta = new Meta(config.meta, logger);

const octokit = new Octokit({
  auth: env.GITHUB_OCTOKIT_TOKEN
});

// every 6 hours update github star count
let STARS = 1000;
async function checkGitHubStars() {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
      owner: 'forwardemail',
      repo: 'forwardemail.net',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    if (Number.isFinite(response?.data?.stargazers_count))
      STARS = response.data.stargazers_count;
    if (STARS <= 0) STARS = 1000;
  } catch (err) {
    logger.error(err);
  }
}

if (config.env !== 'test' && !config.isSelfHosted) {
  checkGitHubStars();
  setInterval(checkGitHubStars, ms('6h'));
}

const SVG_STR = fs.readFileSync(
  path.join(__dirname, '..', '..', '..', 'assets', 'img', 'template.svg'),
  'utf8'
);

const MAX_AGE = ms('1y') / 1000;

function breadcrumbs(ctx, next) {
  const breadcrumbs = _.compact(ctx.path.split('/')).slice(1);
  ctx.state.breadcrumbs = breadcrumbs;

  // TODO: should this titleize(humanize( usage get wrapped with translation?
  // only override the title if the match was not accurate
  if (!config.meta[ctx.pathWithoutLocale])
    ctx.state.meta.title = ctx.request.t(
      breadcrumbs.length === 1
        ? titleize(humanize(breadcrumbs[0]))
        : `${titleize(humanize(breadcrumbs[0]))} - ${titleize(
            humanize(breadcrumbs[1])
          )}`
    );

  return next();
}

function reservedEmailAddresses(ctx, next) {
  ctx.state.reservedEmailAddressesList = reservedEmailAddressesList;
  return next();
}

async function recipientVerification(ctx) {
  //
  // note that we don't throw translated errors here because we never show them to the user
  // we only want them internally for logging purposes if we need to track down an issue
  //
  try {
    // When using wildcard route /v/(.*), the captured value is in params[0]
    const encryptedText = ctx.params.text || ctx.params[0];
    if (!isSANB(encryptedText))
      throw new Error(config.i18n.phrases.INVALID_EMAIL);

    // Security: validate encrypted token format and length
    if (encryptedText.length > 1000) throw new Error('Token too long');
    if (!/^[\w+/=-]+$/.test(encryptedText))
      throw new Error('Invalid token format');

    const text = decrypt(encryptedText);
    const [aliasId, recipient] = text.split('|');

    // ensure recipient is a valid email address
    if (!isEmail(recipient)) throw new Error(config.i18n.phrases.INVALID_EMAIL);

    const alias = await Aliases.findById(shortID.shortToLong(aliasId));
    if (!alias) throw new Error(config.i18n.phrases.ALIAS_DOES_NOT_EXIST);

    const domain = await Domains.findById(alias.domain).lean().exec();
    if (!domain)
      throw new Error(config.i18n.phrases.DOMAIN_DOES_NOT_EXIST_ANYWHERE);

    // if the domain is not on a paid plan
    // or if the alias does not require verification then throw error
    if (domain.plan === 'free' || !alias.has_recipient_verification)
      throw new Error(
        config.i18n.phrases.PAID_PLAN_REQUIRED_FOR_RECIPIENT_VERIFICATION
      );

    // if the recipient is not listed in `recipients` then throw error
    if (!alias.recipients.includes(recipient))
      throw new Error(config.i18n.phrases.ALIAS_DOES_NOT_EXIST);

    // if the recipient is already verified just continue
    // if the recipient is not yet verified then save them as verified and remove from pending
    alias.pending_recipients = alias.pending_recipients.filter(
      (r) => r !== recipient
    );
    alias.verified_recipients.push(recipient);
    await alias.save();

    // handle custom redirect if it was set
    const redirectTo =
      domain.has_custom_verification && domain.custom_verification.redirect
        ? domain.custom_verification.redirect
        : ctx.state.l();

    const message = ctx.translate('EMAIL_VERIFICATION_SUCCESS');

    if (ctx.accepts('html')) {
      if (!ctx.api && redirectTo === ctx.state.l())
        ctx.flash('success', message);
      ctx.redirect(redirectTo);
    } else {
      ctx.body = {
        message,
        redirectTo
      };
    }
  } catch (err) {
    logger.error(err);
    throw Boom.badRequest(ctx.translateError('INVALID_RECIPIENT_VERIFICATION'));
  }
}

// fetches all pages from sitemap
// TODO: if you change this then also change sitemap controller
const keys = new Set(
  Object.keys(config.meta).filter((key) => {
    // exclude certain pages from sitemap
    // (e.g. 401 not authorized)
    if (
      [
        '/admin',
        '/my-account',
        '/auth',
        '/logout',
        '/reset-password',
        config.verifyRoute,
        config.otpRoutePrefix
      ].includes(key)
    )
      return false;
    if (key.startsWith('/admin') || key.startsWith('/my-account')) return false;
    return key;
  })
);

// add all the alternatives (since it would be massive translation file addition otherwise)
for (const alternative of config.alternatives) {
  keys.add(`/blog/best-${alternative.slug}-alternative`);
  for (const a of config.alternatives) {
    if (a.name === alternative.name) continue;
    keys.add(`/blog/${alternative.slug}-vs-${a.slug}-email-service-comparison`);
  }
}

async function generateOpenGraphImage(ctx, next) {
  if (ctx.path === '/mermaid.png') return next();
  try {
    let url = (ctx.pathWithoutLocale || ctx.path)
      .replace('.png', '')
      .replace('.jpeg', '')
      .replace('.svg', '');
    if (url === '/index') url = '/';

    // ensure that the URL is in our sitemap otherwise redirect to generic
    if (!keys.has(url) && !i18n.config.locales.includes(url.slice(1))) {
      ctx.redirect(`/${ctx.locale}/index.png?v=${Date.now()}`);
      return;
    }

    // load seo metadata
    let data = {};
    let found = false;
    try {
      data = meta.getByPath(url, ctx.request.t);
      found = true;
    } catch (err) {
      if (!keys.has(url)) logger.error(err);
      data = meta.getByPath('/', ctx.request.t);
    }

    // add all the alternatives (since it would be massive translation file addition otherwise)
    if (!found) {
      for (const alternative of config.alternatives) {
        const slug = `/blog/best-${alternative.slug}-alternative`;
        if (url === slug) {
          const title = ctx.state.t(
            '<span class="notranslate">%d</span> Best <span class="notranslate">%s</span> Alternatives in <span class="notranslate">%s</span>',
            config.alternatives.length - 1,
            alternative.name,
            dayjs().format('YYYY')
          );
          const description = ctx.state.t(
            'Reviews, comparison, screenshots and more for the <span class="notranslate">%d</span> best alternatives to <span class="notranslate">%s</span> email service.',
            config.alternatives.length - 1,
            alternative.name
          );

          data = {
            title: sanitizeHtml(title, {
              allowedTags: [],
              allowedAttributes: {}
            }),
            description: sanitizeHtml(description, {
              allowedTags: [],
              allowedAttributes: {}
            })
          };
          break;
        }

        for (const a of config.alternatives) {
          if (a.name === alternative.name) continue;
          const slug = `/blog/${alternative.slug}-vs-${a.slug}-email-service-comparison`;
          if (url === slug) {
            const title = ctx.state.t(
              `<span class="notranslate">%s</span> vs <span class="notranslate">%s</span> Comparison (<span class="notranslate">%s</span>)`,
              alternative.name,
              a.name,
              dayjs().format('YYYY')
            );

            const description = ctx.state.t(
              `What are the differences between <span class="notranslate">%s</span> and <span class="notranslate">%s</span>?`,
              alternative.name,
              a.name
            );

            data = {
              title: sanitizeHtml(title, {
                allowedTags: [],
                allowedAttributes: {}
              }),
              description: sanitizeHtml(description, {
                allowedTags: [],
                allowedAttributes: {}
              })
            };
          }
        }
      }
    }

    ctx.type = ctx.path.endsWith('.svg')
      ? 'image/svg+xml'
      : ctx.path.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/png';

    let [title] = data.title
      .replace(config.views.locals.striptags(config.metaTitleAffix), '')
      .replace(
        config.views.locals
          .striptags(config.metaTitleAffix)
          .replace('&#124;', '|'),
        ''
      )
      .split(' - ');
    title = title.trim();
    if (url.startsWith('/guides') && title.includes(' for '))
      title = title.split(' for ')[1].trim();
    else if (title.includes(' for ')) title = title.split(' for ')[0].trim();
    if (title.length > 40)
      title = _.escape(_.unescape(title.trim()).slice(0, 40).trim() + '...');

    // if it was a developer doc then parse the title
    const doc = config.views.locals.developerDocs.find((d) => d.slug === url);
    if (doc && isSANB(doc.ogBtnText)) title = doc.ogBtnText.trim();

    // if it was a open source guide then parse the title
    const platform = config.views.locals.platforms.find(
      (p) =>
        `/blog/open-source/${config.views.locals.dashify(p)}-email-server` ===
          url ||
        `/blog/open-source/${config.views.locals.dashify(p)}-email-clients` ===
          url
    );
    if (platform) title = platform.trim();

    // remove year
    title = title.replace(`in ${dayjs().format('YYYY')}`, ' ').trim();
    title = title.replace(`for ${dayjs().format('YYYY')}`, ' ').trim();
    title = title.replace(dayjs().format('YYYY'), ' ').trim();
    title = title.replace('( )', '').trim();

    // fallback safeguard
    if (title.length > 24)
      title = i18n.translate('PRIVATE_BUSINESS', 'en').trim();

    // LINE1, LINE2, LINE3
    let [line1, line2, line3, line4] = splitLines(
      wrap(data.description.trim(), { width: 50 })
    );

    if (line4) line3 += '...';

    const svgReplaced = SVG_STR.replace('TITLE', title.trim())
      .replace('LINE1', line1 || '')
      .replace('LINE2', line2 || '')
      .replace('LINE3', line3 || '')
      .replace('COUNT', STARS);

    const svg = Buffer.from(svgReplaced, 'utf8');
    const hash = revHash(ctx.type + ':' + svgReplaced);

    const key = `og:gzip:${hash}`;
    let result;

    if (config.env === 'production') result = await ctx.client.get(key);

    ctx.set('Cache-Control', `public, max-age=${MAX_AGE}`);

    // <https://github.com/koajs/compress/blob/41d501bd5db02d810572cfe154088c5fa6fcb957/lib/index.js#L89-L90>
    ctx.set('Content-Encoding', 'gzip');

    if (!ctx.res.headersSent) ctx.res.removeHeader('Content-Length');

    if (result) {
      ctx.body = Buffer.from(result, 'hex');
      return;
    }

    if (ctx.type === 'image/svg+xml') {
      const compressed = await gzip(svg);
      ctx.body = compressed;
      ctx.client
        // NOTE: this takes up too much space so we set TTL to 1 hour
        // .set(key, compressed.toString('hex'), 'EX', MAX_AGE)
        .set(key, compressed.toString('hex'), 'PX', ms('1h'))
        .then()
        .catch((err) => ctx.logger.fatal(err));
    } else {
      const buffer =
        ctx.type === 'image/jpeg'
          ? await sharp(svg).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
          : await sharp(svg)
              .png({
                quality: 100,
                palette: true,
                compressionLevel: 9,
                dither: 0,
                effort: 10
              })
              .toBuffer();
      const compressed = await gzip(buffer);
      ctx.body = compressed;
      ctx.client
        // NOTE: this takes up too much space so we set TTL to 1 hour
        // .set(key, compressed.toString('hex'), 'EX', MAX_AGE)
        .set(key, compressed.toString('hex'), 'PX', ms('1h'))
        .then()
        .catch((err) => ctx.logger.fatal(err));
    }
  } catch (err) {
    ctx.logger.error(err);
    throw Boom.clientTimeout(ctx.translateError('UNKNOWN_ERROR'));
  }
}

async function regenerateAliasPassword(ctx) {
  try {
    // validate domain_id is set
    if (
      !isSANB(ctx.params.domain_id) ||
      !mongoose.isObjectIdOrHexString(ctx.params.domain_id)
    )
      throw new Error('Domain param missing');

    // validate alias_id is set
    if (
      !isSANB(ctx.params.alias_id) ||
      !mongoose.isObjectIdOrHexString(ctx.params.alias_id)
    )
      throw new Error('Alias param missing');

    // validate encrypted_password is set
    // When using wildcard route, the captured value is in params[0]
    const encryptedPassword = ctx.params.encrypted_password || ctx.params[0];
    if (!isSANB(encryptedPassword))
      throw new Error('Encrypted password param missing');

    // Security: validate encrypted token format and length
    if (encryptedPassword.length > 1000) throw new Error('Token too long');
    if (!/^[\w+/=-]+$/.test(encryptedPassword))
      throw new Error('Invalid token format');

    // validate domain exists
    const domain = await Domains.findById(ctx.params.domain_id).lean().exec();
    if (!domain) throw new Error('Domain does not exist');

    const alias = await Aliases.findOne({
      id: ctx.params.alias_id,
      domain: domain._id
    })
      .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
      .exec();

    // validate alias exists
    if (!alias || alias.name === '*' || alias.name.startsWith('/'))
      throw new Error('Alias does not exist');

    const user = await Users.findById(alias.user)
      .select(`email ${config.lastLocaleField}`)
      .lean()
      .exec();

    if (!user) throw new Error('User does not exist');

    if (!Array.isArray(alias.tokens) || alias.tokens.length === 0)
      throw new Error('Alias does not have any generated passwords');

    // validate emailed_instructions is set and an email
    if (
      !isSANB(alias.emailed_instructions) ||
      !isEmail(alias.emailed_instructions)
    )
      throw new Error('Emailed instructions was not set');

    // validate password
    // ensure that the token is valid
    const isValid = await isValidPassword(
      alias.tokens,
      decrypt(encryptedPassword)
    );

    if (!isValid) throw new Error('Invalid password');

    const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(domain);

    /*
    // generate new password
    // set locale for translation in `createToken`
    alias.locale = ctx.locale;
    alias.tokens = [];
    const pass = await alias.createToken(alias.emailed_instructions);

    // change password on existing sqlite file using supplied password and new password
    const wsp = createWebSocketAsPromised();
    await wsp.request({
      action: 'rekey',
      new_password: encrypt(pass),
      session: {
        user: {
          id: alias.id,
          username: `${alias.name}@${domain.name}`,
          alias_id: alias.id,
          alias_name: alias.name,
          domain_id: domain.id,
          domain_name: domain.name,
          password: ctx.params.encrypted_password,
          storage_location: alias.storage_location,
          alias_has_pgp: alias.has_pgp,
          alias_public_key: alias.public_key,
          alias_has_smime: alias.has_smime,
          alias_smime_certificate: alias.smime_certificate,
          locale: user[config.lastLocaleField] || i18n.config.defaultLocale,
          owner_full_email: user.email
        }
      }
    }, 0);

    // don't save until we're sure that sqlite operations were performed
    await alias.save();

    // close websocket
    try {
      wsp.close();
    } catch (err) {
      ctx.logger.fatal(err);
    }
    */

    // email admins that user claimed password
    email({
      template: 'alert',
      message: {
        to,
        subject: i18n.translate(
          'ALIAS_PASSWORD_CLAIMED_SUBJECT',
          locale,
          `${alias.name}@${domain.name}`
        )
      },
      locals: {
        locale,
        message: i18n.translate(
          'ALIAS_PASSWORD_CLAIMED',
          locale,
          `${alias.name}@${domain.name}`,
          alias.emailed_instructions
        )
      }
    })
      .then()
      .catch((err) => ctx.logger.fatal(err));

    // we use shortID to generate shorter querystring for less complicated QR code
    // (this same logic is in app/controllers/web/my-account/generate-alias-password.js)
    const username = `${alias.name}@${domain.name}`;
    const appleLink = `${
      config.urls.web
    }/c/${username}.mobileconfig?a=${shortID.longToShort(alias.id)}&p=${
      ctx.params.encrypted_password
    }`;
    const appleImgSrc = await QRCode.toDataURL(appleLink, {
      margin: 0,
      width: 200
    });
    const k9Link = `${
      config.urls.web
    }/c/${username}.k9s?a=${shortID.longToShort(alias.id)}&p=${
      ctx.params.encrypted_password
    }`;
    const k9ImgSrc = await QRCode.toDataURL(k9Link, {
      margin: 0,
      width: 200
    });

    // render modal with pass
    const html = ctx.translate(
      'ALIAS_GENERATED_PASSWORD',
      username,
      username,
      decrypt(encryptedPassword),
      decrypt(encryptedPassword),
      appleImgSrc,
      appleLink,
      `${username}.mobileconfig`,
      k9ImgSrc,
      k9Link,
      `${username}.k9s`
    );

    const swal = {
      title: ctx.request.t('Success'),
      html,
      type: 'success',
      timer: ms('10m'),
      position: 'top',
      allowEscapeKey: false,
      allowOutsideClick: false,
      focusConfirm: false,
      confirmButtonText: ctx.translate('CLOSE_POPUP'),
      grow: 'row'
    };

    ctx.flash('custom', swal);

    // redirect to faq section:
    const redirectTo = ctx.state.l(
      '/faq#how-do-i-configure-my-email-client-to-work-with-forward-email'
    );

    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }

    // in the background remove the `emailed_instructions`
    // since it was claimed already by the end user
    Aliases.findByIdAndUpdate(alias._id, {
      $unset: {
        emailed_instructions: 1
      }
    })
      .then()
      .catch((err) => {
        ctx.logger.fatal(
          new TypeError(
            `Error while removing emailed_instructions for alias ID ${alias.id}`
          )
        );
        ctx.logger.fatal(err);
      });
  } catch (err) {
    ctx.logger.error(err);
    throw Boom.badRequest(ctx.translateError('LINK_EXPIRED_OR_INVALID'));
  }
}

module.exports = {
  admin,
  api,
  auth,
  breadcrumbs,
  calendar,
  eventFeed,
  encryptTxt,
  faq,
  help,
  myAccount,
  onboard,
  otp,
  report,
  reservedEmailAddresses,
  recipientVerification,
  denylist,
  guides,
  sitemap,
  generateOpenGraphImage,
  regenerateAliasPassword,
  search,
  ips,
  mobileConfig,
  feed,
  unsubscribe
};
