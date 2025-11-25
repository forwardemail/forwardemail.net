/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const { series, concurrent } = require('nps-utils');

module.exports = {
  scripts: {
    all: series.nps('build', 'apps-and-watch'),
    appsAndWatch: concurrent.nps('apps', 'watch'),
    apps: series.nps('bree', 'api', 'web', 'smtp', 'imap', 'pop3', 'sqlite'),

    webAndWatch: series.nps('build', 'web', 'watch'),

    bree: 'nodemon bree.js',
    api: 'nodemon api.js',
    web: 'nodemon web.js',
    smtp: 'SMTP_ALLOW_INSECURE_AUTH=true SMTP_PORT=2432 nodemon smtp.js',
    imap: 'IMAP_PORT=2113 nodemon imap.js',
    pop3: 'POP3_PORT=2115 nodemon pop3.js',
    sqlite: 'nodemon sqlite.js',
    // caldav: 'NODE_TLS_REJECT_UNAUTHORIZED=0 nodemon caldav.js',
    caldav: 'nodemon caldav.js',
    carddav: 'nodemon carddav.js',
    mx: 'nodemon mx.js',

    watch: 'gulp watch',
    clean: 'gulp clean',
    // Main build now includes SnappyMail webmail build automatically
    build: 'gulp build',
    buildTest: 'NODE_ENV=test gulp build',
    // Webmail client (Vite) tasks
    webmailBuild: 'pnpm --dir webmail-client build',
    webmailDev: 'pnpm --dir webmail-client dev',
    webmailPreview: 'pnpm --dir webmail-client preview',

    //
    // TODO: once remark-preset-github is upgraded to ESM and all deps upgraded
    //       then we can change `-qo` to `-qfo` to get failure on warnings
    //       <https://github.com/remarkjs/remark-lint/blob/main/packages/remark-preset-lint-recommended/index.js>
    //
    lintMd: 'remark . -qo',
    lintPkg: 'fixpack',
    lintPug: 'prettier --write **/*.pug && pug-lint **/*.pug',
    lintJs: 'xo --fix',
    lintScss: 'stylelint --fix **/*.scss',

    lint: concurrent.nps(
      'lint-js',
      'lint-md',
      'lint-pug',
      'lint-pkg',
      'lint-scss'
    ),

    // <https://github.com/kentcdodds/nps-utils/issues/24>
    pretest: concurrent.nps('lint', 'build-test'),

    test: 'nyc ava',
    testUpdateSnapshots: series('nps pretest', 'ava --update-snapshots'),
    testCustomerSupportAi:
      'NODE_ENV=test node node_modules/.pnpm/ava@5.3.1/node_modules/ava/entrypoints/cli.mjs test/customer-support-ai'
  }
};
