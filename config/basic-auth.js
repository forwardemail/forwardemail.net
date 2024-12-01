const env = require('#config/env');

let auth = false;

if (env.AUTH_BASIC_ENABLED) {
  auth = {};

  if (env.AUTH_BASIC_USERNAME) {
    auth.name = env.AUTH_BASIC_USERNAME;
  }

  if (env.AUTH_BASIC_PASSWORD) {
    auth.pass = env.AUTH_BASIC_PASSWORD;
  }

  if (!auth.name && !auth.pass) {
    auth = false; // throw?
  }
}

module.exports = auth;
