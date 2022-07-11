const Policies = require('@ladjs/policies');

const {
  loginOtpRoute,
  verifyRoute,
  userFields,
  passport,
  appName,
  loginRoute,
  hcaptchaEnabled,
  hcaptchaSecretKey
} = require('#config');
const { Users } = require('#models');

const policies = new Policies(
  {
    schemeName: appName,
    hasVerifiedEmail: userFields.hasVerifiedEmail,
    verifyRoute,
    loginRoute,
    loginOtpRoute,
    passport,
    hcaptchaEnabled,
    hcaptchaSecretKey
  },
  (apiToken) => {
    return Users.findOne({
      [userFields.apiToken]: apiToken
    });
  }
);

module.exports = policies;
