const { extname } = require('path');

const _ = require('lodash');
const humanize = require('humanize-string');
const titleize = require('titleize');

const config = require('../../../config');

const admin = require('./admin');
const api = require('./api');
const auth = require('./auth');
const faq = require('./faq');
const help = require('./help');
const myAccount = require('./my-account');
const onboard = require('./onboard');
const openStartup = require('./open-startup');
const otp = require('./otp');
const report = require('./report');

function breadcrumbs(ctx, next) {
  // return early if its not a pure path (e.g. ignore static assets)
  // and also return early if it's not a GET request
  // and also return early if it's an XHR request
  if (ctx.method !== 'GET' || extname(ctx.path) !== '') return next();

  const breadcrumbs = _.compact(ctx.path.split('/')).slice(1);
  ctx.state.breadcrumbs = breadcrumbs;

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

module.exports = {
  admin,
  api,
  auth,
  breadcrumbs,
  faq,
  help,
  myAccount,
  onboard,
  openStartup,
  otp,
  report
};
