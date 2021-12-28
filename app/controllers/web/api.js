const childProcess = require('child_process');
const path = require('path');
const util = require('util');

const Meta = require('koa-meta');
const RE2 = require('re2');
const isFQDN = require('is-fqdn');
const isSANB = require('is-string-and-not-blank');
const pug = require('pug');
const { JSDOM } = require('jsdom');
const { isIP, isEmail } = require('validator');

const exec = util.promisify(childProcess.exec);
const config = require('#config');
const markdown = require('#helpers/markdown');
const logger = require('#helpers/logger');

const REGEX_404 = new RE2(/"statusCode": 404,/g);
const REGEX_ALIAS_ID = new RE2(/ALIAS_ID/g);
const REGEX_ALIAS_PARAM = new RE2(/:alias_id/g);
const REGEX_API_TOKEN = new RE2(/API_TOKEN/g);
const REGEX_BASE_URI = new RE2(/BASE_URI/g);
const REGEX_CURL_DELETE = new RE2(/curl -X DELETE/g);
const REGEX_DOMAIN_NAME = new RE2(/DOMAIN_NAME/g);
const REGEX_DOMAIN_PARAM = new RE2(/:domain_name/g);
const REGEX_EMAIL = new RE2(/EMAIL/g);
const REGEX_MEMBER_ID = new RE2(/MEMBER_ID/g);
const REGEX_MEMBER_PARAM = new RE2(/:member_id/g);

const meta = new Meta(config.meta, logger);

// <https://stackoverflow.com/a/494348/3586413>
function createElementFromHTML(dom, html) {
  const div = dom.window.document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

const filePath = path.join(config.views.root, 'api', 'index.pug');

//
// this approach will allow us to rewrite the API documentation
// respective to the currently logged in user, e.g. show their API keys
// and also perform real data JSON output for permitted endpoints
//
async function api(ctx) {
  ctx.state.email = ctx.state.user ? ctx.state.user.email : '';

  if (
    isSANB(ctx.query.domain) &&
    (isFQDN(ctx.query.domain) || isIP(ctx.query.domain))
  )
    ctx.state.domain_name = ctx.query.domain;
  else if (Array.isArray(ctx.state.domains) && ctx.state.domains.length > 0)
    ctx.state.domain_name = ctx.state.domains[0].name;

  if (isSANB(ctx.query.email) && isEmail(ctx.query.email))
    ctx.state.email = ctx.query.email;

  // load seo metadata
  let data = {};
  try {
    data = meta.getByPath(ctx.pathWithoutLocale || ctx.path, ctx.request.t);
  } catch (err) {
    logger.error(err);
    data = meta.getByPath('/', ctx.request.t);
  }

  Object.assign(ctx.state.meta, data);

  let html = pug
    .renderFile(filePath, ctx.state)
    .replace(REGEX_BASE_URI, config.urls.api)
    .replace(
      REGEX_EMAIL,
      encodeURIComponent(ctx.state.email || 'user@gmail.com')
    )
    .replace(REGEX_DOMAIN_NAME, ctx.state.domain_name || 'example.com')
    .replace(REGEX_ALIAS_ID, ':alias_id')
    .replace(REGEX_MEMBER_ID, ':member_id');

  if (ctx.isAuthenticated())
    html = html.replace(
      REGEX_API_TOKEN,
      ctx.state.user[config.userFields.apiToken]
    );

  // expose it to the view
  const dom = new JSDOM(html);
  const $codeTags = dom.window.document.querySelectorAll(
    'code.hljs.language-sh'
  );

  await Promise.all(
    [...$codeTags].map(async ($codeTag) => {
      const cmd = $codeTag.textContent.trim();
      if (REGEX_CURL_DELETE.test(cmd)) return;
      if (REGEX_DOMAIN_PARAM.test(cmd)) return;
      if (REGEX_ALIAS_PARAM.test(cmd)) return;
      if (REGEX_MEMBER_PARAM.test(cmd)) return;
      try {
        const { stdout, stderr } = await exec(cmd);
        if (REGEX_404.test(stdout || stderr)) return;
        $codeTag.parentNode.parentNode.insertBefore(
          createElementFromHTML(
            dom,
            markdown.render(['```json', stdout || stderr, '```'].join('\n'))
          ),
          $codeTag.parentNode.nextSibling
        );
        $codeTag.parentNode.parentNode.insertBefore(
          createElementFromHTML(dom, markdown.render('> Example Response:')),
          $codeTag.parentNode.nextSibling
        );
      } catch (err) {
        ctx.logger.error(err);
      }
    })
  );

  ctx.body = dom.window.document.documentElement.outerHTML;
}

module.exports = api;
