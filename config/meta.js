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
const { nsProviders } = require('#config/utilities');

module.exports = function (config) {
  // currently we cannot use the `|` pipe character due to this issue
  // <https://github.com/mashpie/i18n-node/issues/274>
  // otherwise we'd have `| Lad` below, which is SEO standard
  // so instead we need to use `&#124;` which is the html entity
  // which gets decoded to a `|` in the helper.meta function
  const lad = config.metaTitleAffix;
  const meta = {
    // note that we don't do `Home ${lad}` because if we forget to define
    // meta for a specific route it'd be confusing to see Home
    // in the title bar in the user's browser
    '/': [
      `Free Email Forwarding - Send email custom domain ${lad}`,
      'How to set up free email forwarding, private business email, and send mail with custom domain.'
    ],
    '/about': [
      `About ${lad}`,
      `Learn more about ${config.appName} and the history of our service.`
    ],
    '/private-business-email': [
      `Private Business Email - Free Professional Email ${lad}`,
      'Create your private, free, and professional business email for free.'
    ],
    '/faq': [
      `Frequently Asked Questions ${lad}`,
      'Free DNS email forwarding configuration, questions, guides, and answers.'
    ],
    '/email-forwarding-api': [
      `Email Forwarding API ${lad}`,
      'Developers love our RESTful email forwarding API for custom domains.'
    ],
    '/free-email-webhooks': [
      `Free Email Webhooks ${lad}`,
      'Send email with HTTP using our developer webhooks and DNS email forwarding service.'
    ],
    '/email-forwarding-regex-pattern-filter': [
      `Email Forwarding Regex Pattern Filter ${lad}`,
      'Send email with regular expression matching and DNS email forwarding service.'
    ],
    '/terms': [
      `Terms ${lad}`,
      'Read our terms and conditions of use for our email forwarding service.'
    ],
    '/privacy': [
      `Privacy Policy ${lad}`,
      'Read our privacy policy for our email forwarding service.'
    ],
    '/help': [
      `Help ${lad}`,
      `Ask ${config.appName} your questions or leave comments`
    ],
    '/denylist': [
      `Denylist Removal ${lad}`,
      'Submit your email, domain, or IP address for DNS denylist removal.'
    ],
    '/logout': [`Sign out of ${lad}`, 'Sign out of your account now.'],
    '/register': [
      `Sign up ${lad}`,
      'Get a free account for custom domain email forwarding service.'
    ],
    '/disposable-addresses': [
      `Disposable Addresses ${lad}`,
      'Get disposable email forwarding addresses using your custom domain name.'
    ],
    '/guides': [
      `How to Guides ${lad}`,
      'Follow our easy and simple guides and step by step instructions.'
    ],
    '/guides/send-email-with-custom-domain-smtp': [
      'How to Send Email Custom Domain Name with SMTP',
      'Set up email with your custom domain and SMTP configuration.'
    ],
    '/guides/send-mail-as-gmail-custom-domain': [
      'How to Send Mail As with Gmail',
      'Set up email with custom domain and Gmail to send mail as. Send mail as not working? Follow our video and instructions to fix the issue.'
    ],
    '/guides/port-25-blocked-by-isp-workaround': [
      `How to fix Port 25 blocked by ISP workaround ${lad}`,
      'Workaround port blocking set by your Internet Service Provider on port 25.'
    ],
    '/domain-registration': [
      `Register a domain name ${lad}`,
      'Buy a custom domain name for email forwarding.'
    ],
    '/reserved-email-addresses': [
      `Reserved Email Addresses ${lad}`,
      'List of 1250+ email addresses reserved for security concerns.'
    ],
    '/my-account': [
      `My Account ${lad}`,
      `Manage your ${config.appName} account, domains, and email forwarding aliases.`
    ],
    '/my-account/domains': [
      `Domains ${lad}`,
      `Manage your ${config.appName} domains.`
    ],
    '/my-account/emails': [
      `Emails ${lad}`,
      `Manage your ${config.appName} emails.`
    ],
    '/my-account/logs': [`Logs ${lad}`, `Manage your ${config.appName} logs.`],
    '/my-account/profile': [
      `Profile ${lad}`,
      `Manage your ${config.appName} profile.`
    ],
    '/my-account/billing': [
      `Billing ${lad}`,
      `Manage your ${config.appName} billing.`
    ],
    '/my-account/security': [
      `Security ${lad}`,
      `Manage your ${config.appName} security.`
    ],
    '/admin': [`Admin ${lad}`, `Access your ${config.appName} admin.`],
    '/forgot-password': [
      `Forgot password ${lad}`,
      'Reset your account password to regain access to your account.'
    ],
    '/reset-password': [
      `Reset password ${lad}`,
      'Confirm your password reset token.'
    ],
    '/auth': [`Auth ${lad}`, 'Authenticate yourself to log in.']
  };

  // guides for each provider
  for (const provider of nsProviders) {
    meta[`/guides/${provider.slug}`] = [
      `Free Email Forwarding for <span class="notranslate">${provider.name}</span> ${lad}`,
      `Free and custom domain email forwarding DNS service for <span class="notranslate">${provider.name}</span>.`
    ];
  }

  meta[config.loginRoute] = [
    `Log in ${lad}`,
    'Log in to your free email forwarding service account.'
  ];
  meta[config.verifyRoute] = [
    `Verify email ${lad}`,
    `Verify your ${config.appName} email address.`
  ];
  meta[config.otpRoutePrefix] = [
    `Two Factor Auth ${lad}`,
    'Authenticate yourself with optional OTP to log in.'
  ];
  return meta;
};
