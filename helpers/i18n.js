/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const I18N = require('@ladjs/i18n');

const logger = require('./logger');
const cookieOptions = require('#config/cookies');
const i18nConfig = require('#config/i18n');

const i18n = new I18N({
  ...i18nConfig,
  cookieOptions,
  logger
});

delete i18n.config.phrases;
if (!global.phrases) global.phrases = i18nConfig.phrases;
i18n.config.phrases = global.phrases;

//
// delete unused methods since it pollutes memory
//
// NOTE: if you change this, also change it elsewhere `rg "new I18N"`
//
for (const fn of [
  'addLocale',
  'removeLocale',
  'configure',
  'getCatalog',
  'getLocale',
  'getLocales'
]) {
  delete i18n[fn];
}

module.exports = i18n;
