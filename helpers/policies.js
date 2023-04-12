const Policies = require('@ladjs/policies');

const {
  loginOtpRoute,
  verifyRoute,
  userFields,
  passport,
  appName,
  turnstileEnabled,
  turnstileSecretKey
} = require('#config');
const { Users } = require('#models');

const policies = new Policies(
  {
    schemeName: appName,
    hasVerifiedEmail: userFields.hasVerifiedEmail,
    verifyRoute,
    loginRoute: '/login',
    loginOtpRoute,
    passport,
    turnstileEnabled,
    turnstileSecretKey
  },
  (apiToken) => {
    return Users.findOne({
      [userFields.apiToken]: apiToken
    });
  }
);

module.exports = policies;
