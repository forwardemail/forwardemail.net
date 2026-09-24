/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const fs = require('node:fs');
const path = require('node:path');
const test = require('ava');

const i18n = require('#config/i18n');

const objectId = /^[a-f\d]{24}$/i;
const localesDirectory = path.join(__dirname, '..', '..', 'locales');
const obsoleteKeys = new Set(['VC Honey', 'Contact us to schedule a call']);

test('does not permit runtime i18n catalog mutation', (t) => {
  t.false(i18n.autoReload);
  t.false(i18n.updateFiles);
  t.false(i18n.syncFiles);
});

test('locale catalogs preserve key parity and contain no runtime identifiers', (t) => {
  const english = JSON.parse(
    fs.readFileSync(path.join(localesDirectory, 'en.json'), 'utf8')
  );
  const englishKeys = Object.keys(english).sort();

  for (const file of fs.readdirSync(localesDirectory)) {
    if (!file.endsWith('.json')) continue;

    const catalog = JSON.parse(
      fs.readFileSync(path.join(localesDirectory, file), 'utf8')
    );

    t.deepEqual(Object.keys(catalog).sort(), englishKeys, `${file} key parity`);

    for (const [key, value] of Object.entries(catalog)) {
      t.notRegex(key, objectId, `${file} contains ObjectId-shaped key`);
      t.false(
        typeof value === 'string' && objectId.test(value),
        `${file} contains ObjectId-shaped value`
      );
      t.false(obsoleteKeys.has(key), `${file} contains obsolete locale key`);
    }
  }
});
