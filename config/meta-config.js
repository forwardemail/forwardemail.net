const env = require('./env');

module.exports = {
  metaTitleAffix: `&#124; <span class="notranslate">${env.APP_NAME}</span>`,
  appName: env.APP_NAME,
  loginRoute: '/login',
  verifyRoute: '/verify',
  otpRoutePrefix: '/otp'
};
