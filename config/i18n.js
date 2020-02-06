const path = require('path');

const phrases = require('./phrases');

module.exports = {
  // see @ladjs/i18n for a list of defaults
  // <https://github.com/ladjs/i18n>
  // but for complete configuration reference please see:
  // <https://github.com/mashpie/i18n-node#list-of-all-configuration-options>
  phrases,
  directory: path.join(__dirname, '..', 'locales'),
  ignoredRedirectGlobs: ['/auth/*', '/auth/**/*'],
  lastLocaleField: 'last_locale',
  locales: [
    'ar',
    'cs',
    'da',
    'de',
    'en',
    'es',
    'fi',
    'fr',
    'he',
    'hu',
    'id',
    'it',
    'ja',
    'ko',
    'nl',
    'no',
    'pl',
    'pt',
    'ru',
    'sv',
    'th',
    'tr',
    'uk',
    'vi',
    'zh'
  ]
};
