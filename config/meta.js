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
const arrayJoinConjunction = require('array-join-conjunction');
const dashify = require('dashify');
const dayjs = require('dayjs-with-plugins');

const { developerDocs, nsProviders, platforms } = require('#config/utilities');

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
      `Free Private Secure Email for Custom Domains ${lad}`,
      'How to set up free email forwarding, private business email, and send outbound SMTP email for custom domains.'
    ],
    '/about': [
      `About ${lad}`,
      `Learn more about ${config.appName} and the history of our service.`
    ],
    '/private-business-email': [
      `Business Enterprise Free Private Secure Email ${lad}`,
      'Create your free, private, secure email for professional business and enterprise.'
    ],
    '/faq': [
      `Frequently Asked Questions ${lad}`,
      'How to configure email for custom domain names, outbound SMTP service, and more.'
    ],
    '/email-api': [
      `Email API ${lad}`,
      'Developers love our RESTful email forwarding API for custom domains.'
    ],
    '/free-email-webhooks': [
      `Free Email Webhooks ${lad}`,
      'Send email with HTTP using our developer webhooks and DNS email forwarding service.'
    ],
    '/email-forwarding-regex-pattern-filter': [
      `Regex Email Forwarding ${lad}`,
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
    '/resources': [
      `Free Startup and Developer Email Tools List (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      'Get free startup and developer email tools, bundles, resources, guides, tutorials, code samples, and more.'
    ],
    '/docs': [
      `Free Email Developer Tools and Resources (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      'Free email developer tools and resources for startups and businesses. See our complete RESTful email API reference and manage your custom domains and aliases.'
    ],
    '/guides': [
      `Free Email Hosting Setup Guides (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      'Follow our free email forwarding and hosting guides to send and receive mail with your custom domain. We publish an email hosting guide list of the most popular website and DNS providers.'
    ],
    '/guides/send-email-with-custom-domain-smtp': [
      `Free Email Forwarding and Hosting for Custom Domain Setup Guide (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      'Set up free email forwarding and hosting with your custom domain, DNS, and SMTP configuration step by step guide.'
    ],
    '/guides/send-mail-as-gmail-custom-domain': [
      `How to Send Mail As for Gmail Custom Domain Setup Guide (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      'Set up email forwarding for free with custom domain and Gmail to forward, send, and receive email. Send mail as not working? Follow our video and instructions.'
    ],
    '/guides/port-25-blocked-by-isp-workaround': [
      `Port 25 blocked by ISP ${lad}`,
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
      `Free Forwarding and Hosting for <span class="notranslate">${
        provider.name
      }</span> Email Setup Guide (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      `How to send and receive emails with <span class="notranslate">${provider.name}</span> DNS and setup free email forwarding for <span class="notranslate">${provider.name}</span> with video and step by step instructions.`
    ];
  }

  if (platforms.length > 0) {
    meta['/open-source'] = [
      `The Best Free and Open Source Email Servers <span class="notranslate">(${dayjs().format(
        'YYYY'
      )})</span> ${lad}`,
      `Open-source email server tutorials for ${arrayJoinConjunction([
        'Linux',
        ...platforms.filter((p) => !p.toLowerCase().includes('linux'))
      ])}.`
    ];
  }

  for (const platform of platforms) {
    meta[`/open-source/${dashify(platform)}-email-server`] = [
      `Open Source <span class="notranslate">${platform}</span> Email Server (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      `The best free and open-source email server for <span class="notranslate">${platform}</span> with step guides, tutorials, videos, and instructions.`
    ];
  }

  // developer docs
  for (const doc of developerDocs) {
    meta[doc.slug] = [
      `${doc.title} Code Example (<span class="notranslate">${dayjs().format(
        'YYYY'
      )}</span>) ${lad}`,
      doc.description
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
