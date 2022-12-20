const users = require('./users');
const domains = require('./domains');
const dashboard = require('./dashboard');
const logs = require('./logs');
const allowlist = require('./allowlist');
const blocklist = require('./blocklist');

module.exports = { dashboard, users, domains, logs, allowlist, blocklist };
