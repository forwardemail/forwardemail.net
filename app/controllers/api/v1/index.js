const aliases = require('./aliases');
const domains = require('./domains');
const log = require('./log');
const lookup = require('./lookup');
const maxForwardedAddresses = require('./max-forwarded-addresses');
const port = require('./port');
const restricted = require('./restricted');
const selfTest = require('./self-test');
const spfError = require('./spf-error');
const test = require('./test');
const users = require('./users');

module.exports = {
  aliases,
  domains,
  log,
  lookup,
  maxForwardedAddresses,
  port,
  restricted,
  selfTest,
  spfError,
  test,
  users
};
