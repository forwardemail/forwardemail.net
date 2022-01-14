const aliases = require('./aliases');
const domains = require('./domains');
const enforcePaidPlan = require('./enforce-paid-plan');
const log = require('./log');
const lookup = require('./lookup');
const maxForwardedAddresses = require('./max-forwarded-addresses');
const paypal = require('./paypal');
const port = require('./port');
const restricted = require('./restricted');
const selfTest = require('./self-test');
const settings = require('./settings');
const spfError = require('./spf-error');
const stripe = require('./stripe');
const test = require('./test');
const users = require('./users');

module.exports = {
  aliases,
  domains,
  enforcePaidPlan,
  log,
  lookup,
  maxForwardedAddresses,
  paypal,
  port,
  restricted,
  selfTest,
  settings,
  spfError,
  stripe,
  test,
  users
};
