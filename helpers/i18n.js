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

module.exports = i18n;
