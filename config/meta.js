// turn off max length eslint rule since this is a config file with long strs
/* eslint max-len: 0 */

// meta tags is an object of paths
// where each path is an array containing
//
// '/some/path': [ title, description ]
//
// note that you can include <span class="notranslate">
// if needed around certain text values in ordre to
// prevent Google Translate from translating them
// note that the helper named `meta` in `helpers/meta.js`
// will automatically remove HTML tags from the strings
// before returning them to be rendered in tags such as
// `<title>` and `<meta name="description">`
//

module.exports = function(config) {
  // currently we cannot use the `|` pipe character due to this issue
  // <https://github.com/mashpie/i18n-node/issues/274>
  // otherwise we'd have `| Lad` below, which is SEO standard
  // so instead we need to use `&#124;` which is the html entity
  // which gets decoded to a `|` in the helper.meta function
  const lad = `&#124; <span class="notranslate">${config.appName}</span>`;
  return {
    // note that we don't do `Home ${lad}` because if we forget to define
    // meta for a specific route it'd be confusing to see Home
    // in the title bar in the user's browser
    '/': [config.appName, config.pkg.description],
    '/about': [`About ${lad}`, `Learn more about ${config.appName}`],
    '/features': [
      `Features ${lad}`,
      'Our features include Custom Domain Email Forwarding, Disposable Addresses, Multiple Recipients, Wildcards, and more!'
    ],
    '/faq': [`FAQ ${lad}`, 'Read frequently asked questions about our service'],
    '/donate': [
      `Donate ${lad}`,
      'Donate to our service to support our efforts'
    ],
    '/terms': [`Terms ${lad}`, 'Read our terms and conditions of use'],
    '/privacy': [`Privacy Policy ${lad}`, 'Read our privacy policy'],
    '/help': [
      `Help ${lad}`,
      `Ask ${config.appName} your questions or leave comments`
    ],
    '/login': [`Sign in ${lad}`, 'Sign in to your account'],
    '/logout': [`Sign out of ${lad}`, 'Sign out of your account'],
    '/register': [`Sign up ${lad}`, `Create a ${config.appName} account`],
    '/verify': [`Verify email ${lad}`, `Verify your ${config.appName} email`],
    '/free-disposable-addresses': [
      `Free Disposable Addresses ${lad}`,
      'Try free and disposable email addresses with our short and memorable vanity domains, or you can use a custom domain name for free disposable addresses.'
    ],
    '/domain-registration': [
      `Register a domain name ${lad}`,
      'Buy a custom domain name for email forwarding'
    ],
    '/reserved-email-addresses': [
      `Reserved Email Addresses ${lad}`,
      'List of 1250+ email addresses reserved for security concerns'
    ],
    '/my-account': [
      `My Account ${lad}`,
      `Manage your ${config.appName} profile`
    ],
    '/admin': [`Admin ${lad}`, `Access your ${config.appName} admin`],
    '/forgot-password': [
      `Forgot password ${lad}`,
      'Reset your account password'
    ],
    '/reset-password': [
      `Reset password ${lad}`,
      'Confirm your password reset token'
    ],
    '/auth': [`Auth ${lad}`, 'Authenticate yourself to log in'],
    '/otp': [
      `Two Factor Auth ${lad}`,
      'Authenticate yourself with optional OTP to log in'
    ],
    '/404': [
      `Page not found ${lad}`,
      'The page you requested could not be found'
    ],
    '/500': [`Server error ${lad}`, 'A server error has unfortunately occurred']
  };
};
