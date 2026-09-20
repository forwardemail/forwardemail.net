/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

//
// End-to-end backups of a real mailbox by the sqlite-worker jobs module
// (helpers/worker.js): every format is produced from a mailbox filled
// through the IMAP server and uploaded to an S3 endpoint served by this
// test, then the uploaded object is inspected.
//

const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');

const AdmZip = require('adm-zip');
const Axe = require('axe');
const Database = require('better-sqlite3-multiple-ciphers');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const ms = require('ms');
const pWaitFor = require('p-wait-for');
const test = require('ava');
const { ImapFlow } = require('imapflow');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const Aliases = require('#models/aliases');
const Domains = require('#models/domains');
const config = require('#config');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const setupPragma = require('#helpers/setup-pragma');
const workerConfig = require('#helpers/sqlite-worker-config');
const { backup } = require('#helpers/worker');
const { encrypt } = require('#helpers/encrypt-decrypt');

// dynamically import get-port
let getPort;
import('get-port').then((obj) => {
  getPort = obj.default;
});

const logger = new Axe({ silent: true });
const IP_ADDRESS = ip.address();
const tls = { rejectUnauthorized: false };

const MESSAGE_COUNT = 30;
const BODY_SIZE = 24 * 1024;

//
// The subset of the S3 API a backup upload uses: the anonymous probe of the
// bucket, HeadObject, PutObject and the multipart upload calls.  Objects
// are kept in memory.
//
async function startS3() {
  const objects = new Map();
  const uploads = new Map();
  const requests = [];

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const body = Buffer.concat(chunks);
      const [, bucket, ...rest] = url.pathname.split('/');
      const key = decodeURIComponent(rest.join('/'));
      requests.push({ method: req.method, bucket, key, query: url.search });

      // the anonymous public-bucket probe (no Authorization header)
      if (!req.headers.authorization) {
        res.writeHead(403);
        res.end();
        return;
      }

      if (req.method === 'HEAD') {
        res.writeHead(objects.has(key) ? 200 : 404);
        res.end();
        return;
      }

      if (req.method === 'POST' && url.searchParams.has('uploads')) {
        const uploadId = randomUUID();
        uploads.set(uploadId, []);
        res.writeHead(200, { 'content-type': 'application/xml' });
        res.end(
          `<InitiateMultipartUploadResult><Bucket>${bucket}</Bucket><Key>${key}</Key><UploadId>${uploadId}</UploadId></InitiateMultipartUploadResult>`
        );
        return;
      }

      if (req.method === 'PUT' && url.searchParams.has('uploadId')) {
        const parts = uploads.get(url.searchParams.get('uploadId'));
        parts[Number(url.searchParams.get('partNumber')) - 1] = body;
        res.writeHead(200, { etag: `"part-${parts.length}"` });
        res.end();
        return;
      }

      if (req.method === 'POST' && url.searchParams.has('uploadId')) {
        const parts = uploads.get(url.searchParams.get('uploadId'));
        objects.set(key, Buffer.concat(parts));
        res.writeHead(200, { 'content-type': 'application/xml' });
        res.end(
          `<CompleteMultipartUploadResult><Bucket>${bucket}</Bucket><Key>${key}</Key><ETag>"done"</ETag></CompleteMultipartUploadResult>`
        );
        return;
      }

      if (req.method === 'PUT') {
        objects.set(key, body);
        res.writeHead(200, { etag: '"put"' });
        res.end();
        return;
      }

      res.writeHead(400);
      res.end();
    });
  });

  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  return { server, port: server.address().port, objects, requests };
}

test.before(utils.setupMongoose);
test.after.always(utils.teardownMongoose);

test.beforeEach(async (t) => {
  await utils.setupFactories(t);
  await utils.setupRedisClient(t);
  if (!getPort) await pWaitFor(() => Boolean(getPort), { timeout: ms('30s') });
  const port = await getPort();
  const sqlitePort = await getPort();
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(sqlitePort);
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  t.context.port = port;
  t.context.server = await imap.listen(port);
  t.context.imap = imap;

  const user = await t.context.userFactory
    .withState({
      plan: 'enhanced_protection',
      [config.userFields.planSetAt]: dayjs().startOf('day').toDate()
    })
    .create();

  await t.context.paymentFactory
    .withState({
      user: user._id,
      amount: 300,
      invoice_at: dayjs().startOf('day').toDate(),
      method: 'free_beta_program',
      duration: ms('30d'),
      plan: user.plan,
      kind: 'one-time'
    })
    .create();

  t.context.user = await user.save();

  const domain = await t.context.domainFactory
    .withState({
      members: [{ user: user._id, group: 'admin' }],
      plan: user.plan,
      resolver: imap.resolver,
      has_smtp: true
    })
    .create();
  t.context.domain = domain;

  const alias = await t.context.aliasFactory
    .withState({
      user: user._id,
      domain: domain._id,
      recipients: [user.email],
      has_imap: true
    })
    .create();

  const pass = await alias.createToken();
  t.context.pass = pass;

  t.context.sessionUser = {
    id: alias.id,
    username: `${alias.name}@${domain.name}`,
    alias_id: alias.id,
    alias_name: alias.name,
    domain_id: domain.id,
    domain_name: domain.name,
    password: encrypt(pass),
    storage_location: alias.storage_location,
    alias_has_pgp: alias.has_pgp,
    alias_public_key: alias.public_key,
    locale: 'en',
    owner_full_email: user.email
  };

  await wsp.request(
    {
      action: 'setup',
      session: { remoteAddress: IP_ADDRESS, user: t.context.sessionUser }
    },
    0
  );
  t.context.alias = await alias.save();

  const map = new Map();
  map.set(
    `txt:${domain.name}`,
    imap.resolver.spoofPacket(
      domain.name,
      'TXT',
      [`${config.paidPrefix}${domain.verification_record}`],
      true,
      ms('5m')
    )
  );
  await imap.resolver.options.cache.mset(map);

  //
  // The domain brings its own S3-compatible storage: the endpoint served by
  // this test.  The model refuses private endpoints and probes the bucket
  // on save, so the settings are written directly.
  //
  const s3 = await startS3();
  t.context.s3 = s3;
  await Domains.collection.updateOne(
    { _id: domain._id },
    {
      $set: {
        has_custom_s3: true,
        s3_endpoint: `http://127.0.0.1:${s3.port}`,
        s3_access_key_id: encrypt('access-key'),
        s3_secret_access_key: encrypt('secret-key'),
        s3_region: 'auto',
        s3_bucket: 'mailbox-backups'
      }
    }
  );

  // a backup waits (for minutes) for free memory before it starts, which
  // is not what this test is about and would stall it on a small runner
  t.context.minFreeMem = workerConfig.MIN_FREE_MEM;
  workerConfig.MIN_FREE_MEM = 0;

  const imapFlow = new ImapFlow({
    host: IP_ADDRESS,
    port,
    secure: false,
    logger,
    tls,
    auth: { user: `${alias.name}@${domain.name}`, pass },
    commandTimeout: 120000
  });
  await imapFlow.connect();
  t.context.imapFlow = imapFlow;

  // a mailbox with plain messages and messages with an attachment
  const attachment = Buffer.alloc(BODY_SIZE, 7).toString('base64');
  for (let i = 0; i < MESSAGE_COUNT; i++) {
    const boundary = `boundary-${i}`;
    const raw =
      i % 3 === 0
        ? `Date: ${new Date().toISOString()}
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: sender-${i}@example.com
Subject: backup-${i}
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset=UTF-8

message ${i} with an attachment
--${boundary}
Content-Type: application/octet-stream; name="file-${i}.bin"
Content-Disposition: attachment; filename="file-${i}.bin"
Content-Transfer-Encoding: base64

${attachment}
--${boundary}--`
        : `Date: ${new Date().toISOString()}
MIME-Version: 1.0
To: ${alias.name}@${domain.name}
From: sender-${i}@example.com
Subject: backup-${i}
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 7bit

${String(i % 10).repeat(BODY_SIZE)}`;

    await imapFlow.append('INBOX', Buffer.from(raw), [], new Date());
  }
});

test.afterEach.always(async (t) => {
  workerConfig.MIN_FREE_MEM = t.context.minFreeMem;

  try {
    await t.context.imapFlow?.logout();
  } catch {}

  try {
    await t.context.imap?.close();
  } catch {}

  try {
    await t.context.wsp?.close();
  } catch {}

  try {
    await t.context.sqlite?.close();
  } catch {}

  try {
    await t.context.server?.close();
  } catch {}

  try {
    t.context.s3?.server.close();
  } catch {}
});

function backupPayload(t, format) {
  return {
    id: randomUUID(),
    action: 'backup',
    backup_at: new Date().toISOString(),
    format,
    session: { user: t.context.sessionUser }
  };
}

function uploaded(t, extension) {
  const { objects } = t.context.s3;
  const keys = [...objects.keys()].filter((key) =>
    key.endsWith(`-${t.context.alias.id}.${extension}`)
  );
  t.is(keys.length, 1, `uploaded: ${keys.join(', ')}`);
  return objects.get(keys[0]);
}

test('sqlite: uploads an encrypted copy of the mailbox', async (t) => {
  t.timeout(ms('5m'));
  const payload = backupPayload(t, 'sqlite');
  await backup(payload);

  const object = uploaded(t, 'sqlite');
  t.true(object.length > 0);

  // the copy opens with the mailbox password and holds every message
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-sqlite-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'copy.sqlite');
  fs.writeFileSync(file, object);
  const db = new Database(file, { readonly: true, fileMustExist: true });
  t.teardown(() => db.close());
  await setupPragma(db, { user: t.context.sessionUser });
  t.is(
    db.prepare('select count(*) from Messages').pluck().get(),
    MESSAGE_COUNT
  );
  t.is(db.pragma('integrity_check', { simple: true }), 'ok');

  // the backup is recorded on the alias
  const alias = await Aliases.findById(t.context.alias._id).lean();
  t.is(new Date(alias.imap_backup_at).toISOString(), payload.backup_at);

  // the memory reserve is a fixed floor (the mailbox is never in memory)
  t.is(workerConfig.MIN_FREE_MEM, 0);
});

test('mbox: streams every mailbox into an encrypted archive', async (t) => {
  t.timeout(ms('5m'));
  await backup(backupPayload(t, 'mbox'));

  const entries = new AdmZip(uploaded(t, 'zip')).getEntries();
  const names = entries.map((entry) => entry.entryName);
  t.true(names.includes('README.txt'));
  t.true(names.includes('INBOX.mbox'), `entries: ${names.join(', ')}`);

  // every message of INBOX was written to its mbox (uncompressed size)
  const inbox = entries.find((entry) => entry.entryName === 'INBOX.mbox');
  t.true(
    inbox.header.size > MESSAGE_COUNT * BODY_SIZE,
    `${inbox.header.size} bytes`
  );
  // (AES encrypted entries carry the WinZip AES method)
  t.is(inbox.header.method, 99);
});

test('eml: streams every message into an encrypted archive', async (t) => {
  t.timeout(ms('5m'));
  await backup(backupPayload(t, 'eml'));

  const entries = new AdmZip(uploaded(t, 'zip')).getEntries();
  const names = entries.map((entry) => entry.entryName);
  t.true(names.includes('README.txt'));
  t.true(names.includes('INBOX/'), `entries: ${names.join(', ')}`);

  // one entry per message, each complete
  const messages = entries.filter(
    (entry) =>
      entry.entryName.startsWith('INBOX/') && entry.entryName.endsWith('.eml')
  );
  t.is(messages.length, MESSAGE_COUNT);
  t.true(
    messages.every((entry) => entry.header.size > BODY_SIZE),
    `sizes: ${messages.map((entry) => entry.header.size).join(', ')}`
  );
  t.true(messages.every((entry) => entry.header.method === 99));
});
