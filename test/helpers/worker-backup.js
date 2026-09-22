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

const process = require('node:process');

// every upload of this test is throttled to this rate, through the limiter
// the workers share (the environment is read once, before anything loads
// it)
process.env.BACKUP_MAX_BANDWIDTH = '512KB/s';

const fs = require('node:fs');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { Buffer } = require('node:buffer');
const { randomUUID } = require('node:crypto');
const { spawn } = require('node:child_process');

const AdmZip = require('adm-zip');
const Axe = require('axe');
const Database = require('better-sqlite3-multiple-ciphers');
const Redis = require('@ladjs/redis');
const dayjs = require('dayjs-with-plugins');
const ip = require('ip');
const mongoose = require('mongoose');
const ms = require('ms');
const test = require('ava');
const { ImapFlow } = require('imapflow');

const utils = require('../utils');
const SQLite = require('../../sqlite-server');
const IMAP = require('../../imap-server');

const AddressBooks = require('#models/address-books');
const Aliases = require('#models/aliases');
const CalendarEvents = require('#models/calendar-events');
const Calendars = require('#models/calendars');
const Contacts = require('#models/contacts');
const Domains = require('#models/domains');
const config = require('#config');
const getDatabase = require('#helpers/get-database');
const createWebSocketAsPromised = require('#helpers/create-websocket-as-promised');
const setupPragma = require('#helpers/setup-pragma');
const workerConfig = require('#helpers/sqlite-worker-config');
const { backup } = require('#helpers/worker');
const { encrypt } = require('#helpers/encrypt-decrypt');

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
  const sqlite = new SQLite({
    client: t.context.client,
    subscriber: t.context.subscriber
  });
  t.context.sqlite = sqlite;
  await sqlite.listen(0);
  const { port: sqlitePort } = sqlite.server.address();
  const wsp = createWebSocketAsPromised({ port: sqlitePort });
  await wsp.open();
  t.context.wsp = wsp;
  const imap = new IMAP(
    { client: t.context.client, subscriber: t.context.subscriber, wsp },
    false
  );
  await imap.listen(0);
  const { port } = imap.server.address();
  t.context.port = port;
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

  // a contact and a calendar event, which the archive formats carry along
  // (the address book is the one CardDAV creates on first access)
  const session = { user: t.context.sessionUser };
  await getDatabase(imap, t.context.alias, session);
  const addressBook = await AddressBooks.create({
    instance: imap,
    session,
    address_book_id: 'default',
    name: 'Contacts',
    description: 'Default address book',
    color: '#0000FF',
    readonly: false,
    synctoken: `${config.urls.web}/ns/sync-token/1`,
    timezone: 'UTC',
    url: `${config.urls.web}/dav/${t.context.sessionUser.username}/addressbooks/default/`,
    prodId: '//forwardemail.net//carddav//EN'
  });
  await Contacts.create({
    instance: imap,
    session,
    address_book: addressBook._id,
    contact_id: 'alice',
    uid: 'alice',
    content:
      'BEGIN:VCARD\r\nVERSION:3.0\r\nUID:alice\r\nFN:Alice Example\r\nEMAIL:alice@example.com\r\nEND:VCARD\r\n',
    etag: 'alice-1',
    fullName: 'Alice Example',
    isGroup: false,
    emails: [{ value: 'alice@example.com' }],
    phoneNumbers: []
  });
  const calendar = await Calendars.create({
    instance: imap,
    session,
    calendarId: 'work',
    name: 'Work',
    description: config.urls.web,
    color: '#00ff00',
    order: 0,
    prodId: '-//forwardemail.net//caldav//EN',
    timezone: 'UTC',
    url: config.urls.web,
    readonly: false,
    synctoken: `${config.urls.web}/ns/sync-token/1`
  });
  await CalendarEvents.create({
    instance: imap,
    session,
    eventId: 'planning',
    calendar: calendar._id,
    ical: 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//forwardemail.net//caldav//EN\r\nBEGIN:VEVENT\r\nUID:planning\r\nDTSTAMP:20260101T090000Z\r\nDTSTART:20260102T090000Z\r\nDTEND:20260102T100000Z\r\nSUMMARY:Planning\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n',
    href: `/dav/${t.context.sessionUser.username}/calendars/work/planning.ics`
  });
  t.context.session = session;
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
    await new Promise((resolve, reject) => {
      if (!t.context.s3?.server) {
        resolve();
        return;
      }

      t.context.s3.server.close((err) => (err ? reject(err) : resolve()));
    });
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
  // the snapshot is the whole encrypted database: contacts and calendars
  // are in it as rows, not as exported files
  t.is(db.prepare('select count(*) from Contacts').pluck().get(), 1);
  t.is(db.prepare('select count(*) from CalendarEvents').pluck().get(), 1);
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

  assertPortableResources(t, names);
});

//
// The archive formats carry the contacts and the calendars of the mailbox
// along, as portable files under their own folders, and the README counts
// them.
//
function assertPortableResources(t, names) {
  t.true(names.includes('Contacts/'), `entries: ${names.join(', ')}`);
  t.true(names.includes('Contacts/Contacts/'));
  t.true(names.includes('Contacts/Contacts/alice.vcf'));
  t.true(names.includes('Calendars/'));
  t.true(names.includes('Calendars/Work/'));
  t.true(names.includes('Calendars/Work/planning.ics'));
}

// the README of the last archive uploaded (its entry is not encrypted)
function readme(t) {
  const entries = new AdmZip(uploaded(t, 'zip')).getEntries();
  const entry = entries.find((entry) => entry.entryName === 'README.txt');
  t.truthy(entry);
  return entry;
}

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

  assertPortableResources(t, names);
  t.true(readme(t).header.size > 0);
});

//
// Every upload goes through the limiter the workers share (a leaky bucket
// in Redis, see helpers/backup-upload-limiter.js): at the rate this test
// configures, the reservation of the upload is visible in Redis right
// after it, and the upload took the time the rate allows.
//
test('uploads are paced by the shared limiter', async (t) => {
  t.timeout(ms('5m'));
  const started = Date.now();
  await backup(backupPayload(t, 'sqlite'));
  const elapsed = Date.now() - started;

  const object = uploaded(t, 'sqlite');
  const seconds = object.length / (512 * 1024);
  t.true(
    elapsed >= seconds * 1000 * 0.8,
    `${object.length} bytes took ${elapsed} ms at 512 KB/s`
  );

  // the shared reservation: the next upload, of any worker, starts after
  // this one's time slot
  const redis = new Redis();
  t.teardown(() => redis.disconnect());
  const next = Number(await redis.get(`backup_upload:${config.env}`));
  t.true(next > started, `${next} > ${started}`);
  t.true(next <= Date.now() + 1000, `${next} <= now`);
});

//
// A backup never holds the mailbox in memory, so the free memory it waits
// for is the worker's fixed reserve, not a multiple of the mailbox.
//
test('a backup waits for the fixed memory reserve, whatever the mailbox size', async (t) => {
  t.timeout(ms('5m'));

  // the reserve is not available: the backup is put off (without touching
  // storage)
  workerConfig.MIN_FREE_MEM = os.totalmem() * 2;
  const wait = {
    timeout: workerConfig.MEMORY_WAIT_TIMEOUT,
    interval: workerConfig.MEMORY_WAIT_INTERVAL
  };
  workerConfig.MEMORY_WAIT_TIMEOUT = ms('2s');
  workerConfig.MEMORY_WAIT_INTERVAL = ms('500ms');
  t.teardown(() => {
    workerConfig.MEMORY_WAIT_TIMEOUT = wait.timeout;
    workerConfig.MEMORY_WAIT_INTERVAL = wait.interval;
  });
  const payload = backupPayload(t, 'sqlite');
  const err = await t.throwsAsync(backup(payload));
  // (users are told of an internal error; the cause is kept for the team)
  t.regex(err._message, /low memory/i);
  t.is(err.minFreeMem, os.totalmem() * 2);
  t.true(Number.isFinite(err.freemem));
  t.is(t.context.s3.objects.size, 0);

  // the reserve is available: a mailbox that reports far more storage in
  // use than any multiple of the free memory is backed up all the same
  workerConfig.MIN_FREE_MEM = 0;
  await Aliases.updateOne(
    { _id: t.context.alias._id },
    { $set: { storage_used: os.totalmem() * 4 } }
  );
  await backup(backupPayload(t, 'sqlite'));
  t.true(uploaded(t, 'sqlite').length > 0);
});

//
// The manual conversion (scripts/convert-sqlite-to-eml.js, which restores
// a user from a backup by hand) writes the same archive from a mailbox
// file: every message under its folder, the contacts and the calendars.
//
test('the conversion script turns a mailbox file into the EML archive', async (t) => {
  t.timeout(ms('5m'));
  await backup(backupPayload(t, 'sqlite'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'convert-'));
  t.teardown(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, `${t.context.alias.id}.sqlite`);
  fs.writeFileSync(file, uploaded(t, 'sqlite'));

  // (the script connects to the databases of this test)
  const [MONGO_URI, LOGS_URI] = mongoose.connections.map(
    (connection) => connection._connectionString
  );
  const child = spawn(
    process.execPath,
    [path.join(__dirname, '..', '..', 'scripts', 'convert-sqlite-to-eml.js')],
    {
      env: {
        ...process.env,
        NODE_ENV: 'test',
        MONGO_URI,
        LOGS_URI,
        SQLITE_PATH: file,
        ALIAS_ID: t.context.alias.id,
        SQLITE_PASSWORD: t.context.pass
      }
    }
  );
  let stdout = '';
  let stderr = '';
  child.stderr.on('data', (chunk) => {
    stderr = `${stderr}${chunk}`.slice(-4000);
  });
  const zip = await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', (code) => {
      reject(new Error(`the script exited with ${code}: ${stderr}`));
    });
    child.stdout.on('data', (chunk) => {
      stdout += chunk;
      const match = stdout.match(/^tmp (.+\.zip)$/m);
      if (match) resolve(match[1]);
    });
  });
  // (the script keeps its connections open once done)
  child.kill('SIGTERM');
  t.teardown(() => fs.rmSync(zip, { force: true }));

  const entries = new AdmZip(zip).getEntries();
  const names = entries.map((entry) => entry.entryName);
  t.true(names.includes('README.txt'), `entries: ${names.join(', ')}`);
  t.true(names.includes('INBOX/'));
  const messages = entries.filter(
    (entry) =>
      entry.entryName.startsWith('INBOX/') && entry.entryName.endsWith('.eml')
  );
  t.is(messages.length, MESSAGE_COUNT);
  t.true(messages.every((entry) => entry.header.size > BODY_SIZE));
  t.true(messages.every((entry) => entry.header.method === 99));
  assertPortableResources(t, names);
});
