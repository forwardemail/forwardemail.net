import { db } from './db';

const DEFAULT_STATUS = 'pending';

function accountKey(account) {
  return account || 'default';
}

export async function enqueueSync(action, payload = {}) {
  const now = Date.now();
  const record = {
    account: accountKey(payload.account),
    action,
    resource: payload.resource || '',
    folder: payload.folder || '',
    data: payload.data || {},
    status: DEFAULT_STATUS,
    createdAt: now,
    updatedAt: now,
  };
  const queueId = await db.syncQueue.add(record);
  return { ...record, queueId };
}

export async function listPendingSync(account) {
  const acct = accountKey(account);
  return db.syncQueue.where({ account: acct, status: DEFAULT_STATUS }).sortBy('createdAt');
}

export async function markSyncComplete(queueId, status = 'done') {
  if (!queueId) return;
  await db.syncQueue.update(queueId, { status, updatedAt: Date.now() });
}

/**
 * Replay pending sync actions with a provided handler.
 * The handler receives (record) and should throw on failure.
 */
export async function replaySyncQueue(handler, account) {
  const pending = await listPendingSync(account);
  for (const record of pending) {
    try {
      await handler(record);
      await markSyncComplete(record.queueId, 'done');
    } catch (err) {
      await markSyncComplete(record.queueId, 'error');
      throw err;
    }
  }
}
