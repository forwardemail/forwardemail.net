/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const Meta = require('koa-meta');
const pug = require('pug');
const { parse } = require('node-html-parser');

const config = require('#config');
const getFaqIndex = require('#helpers/get-faq-index');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

const FAQ_INDEX = path.join(config.views.root, 'faq', 'index.pug');

function loadMeta(ctx) {
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);
}

// Render faq/index.pug with its `faq` data populated, the same data the /faq
// route provides (helpers/get-faq-index.js). The guides below render this page
// and scrape a specific answer out of it by id (e.g. #smtp-instructions,
// #send-mail-as-content). The redesigned page reads every answer from `faq`,
// so without it the render throws and every scrape comes back empty. Loading
// the index fails soft — a miss renders the empty FAQ rather than throwing.
async function renderFaqHtml(ctx, locale) {
  const faq = await getFaqIndex(ctx.client, config.views.root, locale).catch(
    (err) => {
      ctx.logger.error(err);
      return undefined;
    }
  );
  return pug.renderFile(FAQ_INDEX, {
    ...ctx.state,
    faq,
    locale,
    // make flash a noop so we don't interfere with messages/session
    flash() {
      return {};
    }
  });
}

async function sendEmailWithCustomDomainSMTP(ctx, next) {
  loadMeta(ctx);

  // dynamically load the Send Email with Custom Domain SMTP guide from FAQ
  try {
    const root = parse(await renderFaqHtml(ctx, ctx.locale));
    ctx.state.sendEmailWithCustomDomainSMTP =
      root.querySelector('#smtp-instructions').outerHTML;
  } catch (err) {
    ctx.logger.error(err);
    //
    // NOTE: if the locale was not "en" then try again
    //       (this is due to translation bug issues)
    //
    try {
      const root = parse(await renderFaqHtml(ctx, 'en'));
      ctx.state.sendEmailWithCustomDomainSMTP =
        root.querySelector('#smtp-instructions').outerHTML;
    } catch {}
  }

  return next();
}

async function sendMailAs(ctx, next) {
  loadMeta(ctx);

  // dynamically load the Send Mail As guide from FAQ
  try {
    const root = parse(await renderFaqHtml(ctx, ctx.locale));
    ctx.state.sendMailAsContent = root.querySelector(
      '#send-mail-as-content'
    ).outerHTML;
    ctx.state.legacyFreeGuide =
      root.querySelector('#legacy-free-guide').outerHTML;
  } catch (err) {
    //
    // NOTE: typical output/error is:
    //       `TypeError: Cannot read properties of null (reading 'outerHTML')`
    if (err.message.includes('Cannot read properties of null'))
      ctx.logger.debug(err);
    else ctx.logger.error(err);
    //
    // NOTE: if the locale was not "en" then try again
    //       (this is due to translation bug issues)
    //
    try {
      const root = parse(await renderFaqHtml(ctx, 'en'));
      ctx.state.sendMailAsContent = root.querySelector(
        '#send-mail-as-content'
      ).outerHTML;
      ctx.state.legacyFreeGuide =
        root.querySelector('#legacy-free-guide').outerHTML;
    } catch {}
  }

  return next();
}

module.exports = { sendMailAs, sendEmailWithCustomDomainSMTP };
