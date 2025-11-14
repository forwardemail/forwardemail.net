/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const path = require('node:path');

const Meta = require('koa-meta');
const pug = require('pug');
const { parse } = require('node-html-parser');

const config = require('#config');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

async function sendEmailWithCustomDomainSMTP(ctx, next) {
  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

  // dynamically load the Send Email with Custom Domain SMTP guide from FAQ
  try {
    const html = pug.renderFile(
      path.join(config.views.root, 'faq', 'index.pug'),
      // make flash a noop so we don't interfere with messages/session
      {
        ...ctx.state,
        flash() {
          return {};
        }
      }
    );

    // expose it to the view
    const root = parse(html);
    ctx.state.sendEmailWithCustomDomainSMTP =
      root.querySelector('#smtp-instructions').outerHTML;
  } catch (err) {
    ctx.logger.error(err);
    //
    // NOTE: if the locale was not "en" then try again
    //       (this is due to translation bug issues)
    //
    try {
      const html = pug.renderFile(
        path.join(config.views.root, 'faq', 'index.pug'),
        {
          ...ctx.state,
          locale: 'en',
          flash() {
            return {};
          }
        }
      );

      // expose it to the view
      const root = parse(html);
      ctx.state.sendEmailWithCustomDomainSMTP =
        root.querySelector('#smtp-instructions').outerHTML;
    } catch {}
  }

  return next();
}

async function sendMailAs(ctx, next) {
  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

  // dynamically load the Send Mail As guide from FAQ
  try {
    const html = pug.renderFile(
      path.join(config.views.root, 'faq', 'index.pug'),
      // make flash a noop so we don't interfere with messages/session
      {
        ...ctx.state,
        flash() {
          return {};
        }
      }
    );

    // expose it to the view
    const root = parse(html);
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
      const html = pug.renderFile(
        path.join(config.views.root, 'faq', 'index.pug'),
        // make flash a noop so we don't interfere with messages/session
        {
          ...ctx.state,
          locale: 'en',
          flash() {
            return {};
          }
        }
      );

      // expose it to the view
      const root = parse(html);
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
