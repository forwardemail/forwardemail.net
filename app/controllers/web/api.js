const path = require('path');

const pug = require('pug');

const config = require('../../../config');

//
// this approach will allow us to rewrite the API documentation
// respective to the currently logged in user, e.g. show their API keys
// and also perform real data JSON output for permitted endpoints
//
function api(ctx) {
  const filePath = path.join(config.views.root, 'api', 'index.pug');
  const html = pug.renderFile(filePath, ctx.state);
  ctx.body = html;
}

module.exports = api;
