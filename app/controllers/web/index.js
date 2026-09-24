/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { Buffer } = require('node:buffer');
const punycode = require('node:punycode');

const Boom = require('@hapi/boom');
const Meta = require('koa-meta');
const dayjs = require('dayjs-with-plugins');
const humanize = require('humanize-string');
const isSANB = require('is-string-and-not-blank');
const ms = require('ms');
const reservedEmailAddressesList = require('reserved-email-addresses-list');
const revHash = require('rev-hash');
const sanitizeHtml = require('sanitize-html');
const sharp = require('sharp');
const shortID = require('mongodb-short-id');
const titleize = require('titleize');
const undici = require('undici');
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
const { autoconfig, autodiscover } = require('./autoconfig');
const domainAvailability = require('./domain-availability');
const domainAvailabilityBulk = require('./domain-availability-bulk');
const domainConnect = require('./domain-connect');
const domainSuggestions = require('./domain-suggestions');
const search = require('./search');
const ips = require('./ips');
const aiDiscovery = require('./ai-discovery');
const mobileConfig = require('./mobile-config');
const feed = require('./feed');
const calendar = require('./calendar');
const eventFeed = require('./event-feed');
const unsubscribe = require('./unsubscribe');
const calendarResponse = require('./calendar-response');
const _ = require('#helpers/lodash');

const isEmail = require('#helpers/is-email');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
// const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const email = require('#helpers/email');
const i18n = require('#helpers/i18n');
const getAliasPasswordSwal = require('#helpers/get-alias-password-swal');
const isValidPassword = require('#helpers/is-valid-password');
const {
  claimAliasPasswordLink,
  peekAliasPasswordLink
} = require('#helpers/alias-password-link');
const logger = require('#helpers/logger');
const { renderOpenGraphImage } = require('#helpers/open-graph-image');
// const { encrypt, decrypt } = require('#helpers/encrypt-decrypt');
const { decrypt } = require('#helpers/encrypt-decrypt');

const meta = new Meta(config.meta, logger);

// every 6 hours update github star count
let STARS = 1000;
async function checkGitHubStars() {
  try {
    const reqHeaders = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'forwardemail.net',
      'X-GitHub-Api-Version': '2022-11-28'
    };

    // Use GitHub token if available for higher rate limits (5000 req/hr)
    if (config.githubOctokitToken) {
      reqHeaders.Authorization = `Bearer ${config.githubOctokitToken}`;
    }

    const { statusCode, headers, body } = await undici.request(
      'https://api.github.com/repos/forwardemail/forwardemail.net',
      {
        method: 'GET',
        headers: reqHeaders,
        bodyTimeout: 10_000,
        headersTimeout: 10_000
      }
    );

    const data = await body.json();

    if (statusCode !== 200) {
      throw new Error(
        `GitHub API responded with ${statusCode}: ${
          data?.message || 'Unknown error'
        }`
      );
    }

    if (Number.isFinite(data?.stargazers_count)) {
      STARS = data.stargazers_count;
      logger.info(
        `GitHub star count updated: ${STARS} (rate limit: ${headers['x-ratelimit-remaining']}/${headers['x-ratelimit-limit']})`
      );
    }

    // only reset to 1000 if we got a bad value, but preserve last known good value on errors
    if (STARS <= 0) STARS = 1000;
  } catch (err) {
    // log rate limit errors more explicitly
    if (
      err.status === 403 ||
      (err.message && err.message.includes('rate limit'))
    ) {
      logger.error(
        new Error(
          `GitHub API rate limit exceeded. Using cached star count: ${STARS}`
        )
      );
    } else {
      logger.error(err, {
        message: `Failed to fetch GitHub stars, using cached value: ${STARS}`
      });
    }
  }
}

if (config.env !== 'test' && !config.isSelfHosted) {
  checkGitHubStars();
  setInterval(checkGitHubStars, ms('6h'));
}

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
            'Explore the <span class="notranslate">%d</span> best alternatives to <span class="notranslate">%s</span> email service. Side-by-side feature comparison, pricing analysis, privacy review, and screenshots to find your ideal email provider.',
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
              `Compare <span class="notranslate">%s</span> vs <span class="notranslate">%s</span> email services. In-depth analysis of features, pricing, security, privacy, and storage to find the best email provider for your needs.`,
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

    //
    // The image is laid out from measurements (helpers/open-graph-image.js)
    // so the whole title fits, wrapped over two lines and shrunk as needed,
    // and the description is cut at the last line that fits: neither has
    // to be shortened blindly here any more.
    //
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

    // a developer doc carries its own title for the image
    const doc = config.views.locals.developerDocs.find((d) => d.slug === url);
    if (doc && isSANB(doc.ogBtnText)) title = doc.ogBtnText.trim();

    // remove year (the current one anywhere, any year the title ends with)
    title = title.replace(`in ${dayjs().format('YYYY')}`, ' ').trim();
    title = title.replace(`for ${dayjs().format('YYYY')}`, ' ').trim();
    title = title.replace(dayjs().format('YYYY'), ' ').trim();
    title = title.replace('( )', '').trim();
    title = title
      .replace(/\s+(?:in|for|of)?\s*\(?(?:19|20)\d{2}\)?$/i, '')
      .trim();

    // plain text only (the renderer escapes it for the SVG)
    const plain = (string) =>
      _.unescape(
        sanitizeHtml(string, { allowedTags: [], allowedAttributes: {} })
      )
        .replace(/\s+/g, ' ')
        .trim();

    const svgString = await renderOpenGraphImage({
      title: plain(title),
      description: plain(data.description),
      url,
      stars: STARS
    });

    const svg = Buffer.from(svgString, 'utf8');
    const hash = revHash(ctx.type + ':' + svgString);

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
      // (full colour: a palette bands the gradients of the image)
      const buffer =
        ctx.type === 'image/jpeg'
          ? await sharp(svg).jpeg({ quality: 80, mozjpeg: true }).toBuffer()
          : await sharp(svg)
              .png({
                compressionLevel: 9,
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

//
// One-time link to view a newly generated alias password (the password is
// never emailed, see helpers/alias-password-link.js).  A link for the owner
// requires them to be logged in (so a link scanner cannot use it up) and
// re-opens the password popup on the aliases page; a link for emailed
// instructions opens the popup on the email client setup guide.
//
async function regenerateAliasPassword(ctx) {
  const invalid = () =>
    Boom.badRequest(ctx.translateError('LINK_EXPIRED_OR_INVALID'));

  // links in the previous format (they carried the encrypted password) are
  // no longer accepted
  if (!isSANB(ctx.params.token)) throw invalid();

  let record;
  try {
    record = await peekAliasPasswordLink(ctx.client, ctx.params.token);
  } catch (err) {
    ctx.logger.error(err);
  }

  if (!record) throw invalid();

  // owner links can only be claimed by the user who generated the password
  if (record.user_id) {
    if (!ctx.isAuthenticated()) {
      ctx.session.returnTo = ctx.originalUrl;
      ctx.flash('warning', ctx.translate('LOGIN_REQUIRED'));
      ctx.redirect(ctx.state.l('/login'));
      return;
    }

    if (ctx.state.user.id !== record.user_id) throw invalid();
  }

  try {
    const domain = await Domains.findById(record.domain_id).lean().exec();
    if (!domain) throw new Error('Domain does not exist');

    const alias = await Aliases.findOne({
      _id: record.alias_id,
      domain: domain._id
    })
      .select('+tokens.hash +tokens.salt +tokens.has_pbkdf2_migration')
      .lean()
      .exec();

    // validate alias exists
    if (!alias || alias.name === '*' || alias.name.startsWith('/'))
      throw new Error('Alias does not exist');

    if (!Array.isArray(alias.tokens) || alias.tokens.length === 0)
      throw new Error('Alias does not have any generated passwords');

    // instructions that were emailed again (or to someone else) since
    if (
      record.emailed_instructions &&
      alias.emailed_instructions !== record.emailed_instructions
    )
      throw new Error('Emailed instructions do not match');

    // the link is used up here, whatever happens next
    const password = await claimAliasPasswordLink(ctx.client, ctx.params.token);
    if (!password) throw new Error('Link was already claimed');

    // a password generated after this one replaced it
    const isValid = await isValidPassword(alias.tokens, password);
    if (!isValid) throw new Error('Invalid password');

    const swal = await getAliasPasswordSwal(ctx, {
      aliasId: alias._id.toString(),
      aliasName: alias.name,
      domainName: domain.name,
      password,
      isRekey: alias.is_rekey === true
    });
    ctx.flash('custom', swal);

    if (record.emailed_instructions) {
      const { to, locale } = await Domains.getToAndMajorityLocaleByDomain(
        domain
      );

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
            record.emailed_instructions
          )
        }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));

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
              `Error while removing emailed_instructions for alias ID ${alias._id}`
            )
          );
          ctx.logger.fatal(err);
        });
    }

    const redirectTo = record.emailed_instructions
      ? ctx.state.l(
          '/faq#how-do-i-configure-my-email-client-to-work-with-forward-email'
        )
      : ctx.state.l(
          `/my-account/domains/${punycode.toASCII(domain.name)}/aliases`
        );

    if (ctx.accepts('html')) {
      ctx.redirect(redirectTo);
    } else {
      ctx.body = { redirectTo };
    }
  } catch (err) {
    ctx.logger.error(err);
    throw invalid();
  }
}

module.exports = {
  aiDiscovery,
  autoconfig,
  autodiscover,
  domainAvailability,
  domainAvailabilityBulk,
  domainConnect,
  domainSuggestions,
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
  unsubscribe,
  calendarResponse
};
