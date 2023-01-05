const path = require('path');

const Meta = require('koa-meta');
const pug = require('pug');
const { parse } = require('node-html-parser');

const config = require('#config');
const logger = require('#helpers/logger');

const meta = new Meta(config.meta, logger);

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
  } catch (err) {
    ctx.logger.error(err);
  }

  return next();
}

module.exports = { sendMailAs };
