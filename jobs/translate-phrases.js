/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const { parentPort } = require('node:worker_threads');

const Mandarin = require('mandarin');
const I18N = require('@ladjs/i18n');

const i18nConfig = require('#config/i18n');
const logger = require('#helpers/logger');
const setupMongoose = require('#helpers/setup-mongoose');

//
// NOTE: we want our own instance of i18n that does not auto reload files
//
const i18n = new I18N({
  ...i18nConfig,
  autoReload: false,
  updateFiles: false,
  syncFiles: false,
  logger
});

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

const mandarin = new Mandarin({ i18n, logger });

(async () => {
  await setupMongoose(logger);
  try {
    await mandarin.translate();
  } catch (err) {
    await logger.error(err);
  }

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
})();
