#!/usr/bin/env node
/**
 * Seed a mailbox via the local /v1/messages API.
 *
 * Usage:
 *   SEED_ALIAS="test@domain.com" SEED_PASSWORD="token" node scripts/seed-mailbox.js
 *
 * Optional env:
 *   SEED_API_BASE=http://localhost:4000
 *   SEED_COUNT=50
 *   SEED_FOLDERS=INBOX,Sent,Archive,Spam
 *   SEED_ATTACHMENTS_PERCENT=20
 *   SEED_THREADS_PERCENT=30
 *   SEED_DELAY_MS=50
 */

const { setTimeout } = require('node:timers/promises');
const { Buffer } = require('node:buffer');
const process = require('node:process');

const alias = process.env.SEED_ALIAS;
const password = process.env.SEED_PASSWORD;
const apiBase = process.env.SEED_API_BASE || 'http://localhost:4000';
const count = Number.parseInt(process.env.SEED_COUNT || '50', 10);
const folders = (process.env.SEED_FOLDERS || 'INBOX,Sent,Archive,Spam')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const attachmentsPercent = Number.parseInt(
  process.env.SEED_ATTACHMENTS_PERCENT || '20',
  10
);
const threadsPercent = Number.parseInt(
  process.env.SEED_THREADS_PERCENT || '30',
  10
);
const delayMs = Number.parseInt(process.env.SEED_DELAY_MS || '50', 10);

if (!alias || !password) {
  console.error('Missing SEED_ALIAS or SEED_PASSWORD.');
  process.exit(1);
}

if (!Number.isFinite(count) || count < 1) {
  console.error('SEED_COUNT must be a positive integer.');
  process.exit(1);
}

function authHeader(user, pass) {
  const token = Buffer.from(`${user}:${pass}`).toString('base64');
  return `Basic ${token}`;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function should(percent) {
  return Math.random() * 100 < percent;
}

function makeMessageId(i) {
  return `<seed-${i}-${Date.now()}@local>`;
}

function makeSubject(i, isReply) {
  return isReply ? `Re: Seed thread ${i}` : `Seed message ${i}`;
}

function makeBody(i, folder) {
  const text = [
    `Hello from seed message ${i}.`,
    `Folder: ${folder}`,
    `Time: ${new Date().toISOString()}`
  ].join('\n');

  const html = [
    `<p>Hello from <strong>seed message ${i}</strong>.</p>`,
    `<p>Folder: <code>${folder}</code></p>`,
    `<p>Time: ${new Date().toISOString()}</p>`
  ].join('');

  return { text, html };
}

async function postMessage(message) {
  const res = await fetch(`${apiBase}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(alias, password)
    },
    body: JSON.stringify(message)
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body}`);
  }

  return res.json();
}

async function main() {
  const threads = [];
  let sent = 0;

  for (let i = 1; i <= count; i++) {
    const folder = pick(folders);
    const isReply = threads.length > 0 && should(threadsPercent);
    const messageId = makeMessageId(i);

    const message = {
      from: `Seeder <seed-${i}@example.com>`,
      to: alias,
      subject: makeSubject(i, isReply),
      messageId,
      folder
    };

    const { text, html } = makeBody(i, folder);
    message.text = text;
    message.html = html;

    if (isReply) {
      const thread = pick(threads);
      message.inReplyTo = thread.messageId;
      message.references = [thread.messageId, ...(thread.references || [])];
      thread.references = message.references;
    } else if (should(threadsPercent)) {
      threads.push({ messageId, references: [messageId] });
    }

    if (should(attachmentsPercent)) {
      message.attachments = [
        {
          filename: `seed-${i}.txt`,
          content: `Attachment for seed message ${i}\n`
        }
      ];
    }

    const date = new Date(Date.now() - (count - i) * 60 * 1000);
    message.date = date.toUTCString();

    await postMessage(message);
    sent++;
    if (delayMs > 0) await setTimeout(delayMs);
  }

  console.log(`Seeded ${sent} messages into ${alias}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
