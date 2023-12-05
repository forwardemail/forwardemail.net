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

    bree: 'ttab -G nodemon bree.js',
    api: 'ttab -G nodemon api.js',
    web: 'ttab -G nodemon web.js',
    smtp: 'ttab -G SMTP_ALLOW_INSECURE_AUTH=true SMTP_PORT=2432 nodemon smtp.js',
    imap: 'ttab -G IMAP_PORT=2113 nodemon imap.js',
    pop3: 'ttab -G POP3_PORT=2115 nodemon pop3.js',
    sqlite: 'ttab -G nodemon sqlite.js',

    watch: 'ttab -G gulp watch',
    clean: 'gulp clean',
    build: 'gulp build',
    buildTest: 'NODE_ENV=test gulp build',

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
    testUpdateSnapshots: series('nps pretest', 'ava --update-snapshots')
  }
};
