const Policies = require('@ladjs/policies');

const {
  loginOtpRoute,
  passportCallbackOptions,
  verificationPath,
  userFields,
  passport,
  appName
} = require('../config');
const { Users } = require('../app/models');

const policies = new Policies(
  {
    schemeName: appName,
    hasVerifiedEmail: userFields.hasVerifiedEmail,
    verifyRoute: verificationPath,
    loginRoute: passportCallbackOptions.failureRedirect,
    loginOtpRoute,
    passport
  },
  apiToken => {
    const query = {};
    query[userFields.apiToken] = apiToken;
    return Users.findOne(query);
  }
);

module.exports = policies;
