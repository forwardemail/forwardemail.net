const aliases = require('./aliases');
const domains = require('./domains');
const log = require('./log');
const lookup = require('./lookup');
const maxForwardedAddresses = require('./max-forwarded-addresses');
const port = require('./port');
const restricted = require('./restricted');
const selfTest = require('./self-test');
const settings = require('./settings');
const spfError = require('./spf-error');
const test = require('./test');
const users = require('./users');
const stripe = require('./stripe');
const paypal = require('./paypal');

module.exports = {
  aliases,
  domains,
  log,
  lookup,
  maxForwardedAddresses,
  port,
  restricted,
  selfTest,
  settings,
  spfError,
  test,
  users,
  stripe,
  paypal
};
