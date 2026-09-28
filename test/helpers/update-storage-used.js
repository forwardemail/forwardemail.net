/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// Storage used is every file of a mailbox on disk: the database and the
// temporary mailbox, each with the files SQLite keeps next to it.
//

const fs = require('node:fs');
const path = require('node:path');
const { Buffer } = require('node:buffer');

const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const sharedConfig = require('@ladjs/shared-config');
const test = require('ava');

const utils = require('../utils');

const Aliases = require('#models/aliases');
const config = require('#config');
const createTangerine = require('#helpers/create-tangerine');
const getPathToDatabase = require('#helpers/get-path-to-database');
const logger = require('#helpers/logger');
const updateStorageUsed = require('#helpers/update-storage-used');

const imapSharedConfig = sharedConfig('IMAP');

test.before(utils.setupMongoose);
test.before((t) => {
  t.context.client = new Redis(imapSharedConfig.redis, logger);
});
test.after.always(utils.teardownMongoose);
test.after.always((t) => {
  t.context.client.disconnect();
});
test.beforeEach(utils.setupFactories);

test('counts the mailbox, the temporary mailbox and their SQLite files', async (t) => {
  const { client } = t.context;
  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();
  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: createTangerine(client, logger),
      has_smtp: true
    })
    .create();
  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const filePath = getPathToDatabase(alias);
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tmpPath = path.join(dir, `${alias.id}-tmp.sqlite`);
  const files = {
    [filePath]: 4096,
    [`${filePath}-wal`]: 1000,
    [`${filePath}-shm`]: 300,
    [`${filePath}-journal`]: 20,
    [tmpPath]: 2048,
    [`${tmpPath}-wal`]: 500,
    [`${tmpPath}-shm`]: 70
  };
  // not part of the mailbox
  const other = path.join(dir, `${alias.id}.sqlite.quarantine-1`);
  t.teardown(() => {
    for (const file of [...Object.keys(files), other])
      fs.rmSync(file, { force: true });
  });
  for (const [file, size] of Object.entries(files))
    fs.writeFileSync(file, Buffer.alloc(size));
  fs.writeFileSync(other, Buffer.alloc(9999));

  const expected = Object.values(files).reduce((a, b) => a + b, 0);
  await client.del(`storage_debounce:${alias.id}`);
  t.is(await updateStorageUsed(alias.id, client), expected);
  await pWaitFor(
    async () => {
      const doc = await Aliases.findById(alias._id).lean();
      return doc.storage_used === expected;
    },
    { timeout: ms('10s') }
  );
  t.pass();
});
