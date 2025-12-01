import Dexie from 'dexie';

const db = new Dexie('webmail-cache');

// v1: basic folders/messages/meta
db.version(1).stores({
  folders: 'path,name,count,specialUse,updatedAt',
  messages:
    'id,folder,from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt',
  meta: 'key,value'
});

// v2: split message bodies/attachments into dedicated store
db.version(2)
  .stores({
    folders: 'path,name,count,specialUse,updatedAt',
    messages:
      'id,folder,from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt',
    meta: 'key,value',
    messageContent: 'id,updatedAt'
  })
  .upgrade(async (tx) => {
    const messages = tx.table('messages');
    // Drop large fields that were stored in v1 to avoid quota issues.
    await messages.toCollection().modify((value) => {
      delete value.body;
      delete value.attachments;
    });
  });

// v3: add account scoping indexes, sync queue, search persistence, and richer body storage
// NOTE: primary keys remain unchanged to avoid Dexie upgrade errors; account-aware indexes are added.
db.version(3)
  .stores({
    accounts: 'id,email,createdAt,updatedAt',
    folders: 'path,account,[account+path],parentPath,unread_count,specialUse,updatedAt',
    messages:
      'id,folder,account,[account+id],[account+folder],from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt,bodyIndexed',
    messageContent: 'id,updatedAt', // legacy alias kept for backwards compatibility
    messageBodies:
      'id,account,[account+id],[account+folder],folder,body,textContent,attachments,updatedAt',
    drafts: 'id,account,folder,updatedAt',
    searchIndex: 'key,account,[account+key],updatedAt',
    indexMeta: 'key,account,[account+key],updatedAt',
    syncQueue: '++queueId,account,action,resource,folder,status,createdAt',
    meta: 'key,updatedAt'
  })
  .upgrade(async (tx) => {
    const defaultAccount = 'default';

    // Add account + normalized fields to folders
    await tx
      .table('folders')
      .toCollection()
      .modify((folder) => {
        folder.account = folder.account || defaultAccount;
        folder.parentPath = folder.parentPath || '';
        folder.unread_count =
          typeof folder.unread_count === 'number'
            ? folder.unread_count
            : folder.count ?? 0;
      });

    // Add account + bodyIndexed flag to messages
    await tx
      .table('messages')
      .toCollection()
      .modify((msg) => {
        msg.account = msg.account || defaultAccount;
        msg.bodyIndexed = msg.bodyIndexed || false;
      });

    // Migrate any legacy messageContent records into messageBodies and clear the old store
    try {
      const legacy = tx.table('messageContent');
      const legacyRecords = await legacy.toArray();
      if (legacyRecords?.length) {
        const bodies = tx.table('messageBodies');
        for (const rec of legacyRecords) {
          await bodies.put({
            id: rec.id,
            account: rec.account || defaultAccount,
            folder: rec.folder || '',
            body: rec.body,
            textContent: rec.textContent || '',
            attachments: rec.attachments || [],
            updatedAt: rec.updatedAt || Date.now()
          });
        }
        await legacy.clear();
      }
    } catch (err) {
      // best-effort migration; continue if the legacy store is missing
      console.warn('messageContent migration skipped', err);
    }
  });

// v4: Fix primary keys to use [account+path] to prevent conflicts between accounts
db.version(4)
  .stores({
    accounts: 'id,email,createdAt,updatedAt',
    folders: '[account+path],account,path,parentPath,unread_count,specialUse,updatedAt',
    messages:
      '[account+id],id,folder,account,[account+folder],from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt,bodyIndexed',
    messageContent: null, // Delete legacy store
    messageBodies:
      '[account+id],account,id,[account+folder],folder,body,textContent,attachments,updatedAt',
    drafts: '[account+id],id,account,folder,updatedAt',
    searchIndex: '[account+key],key,account,updatedAt',
    indexMeta: '[account+key],key,account,updatedAt',
    syncQueue: '++queueId,account,action,resource,folder,status,createdAt',
    meta: 'key,updatedAt'
  })
  .upgrade(async (tx) => {
    // No data migration needed - Dexie will handle the reindexing
    // The compound keys [account+path] and [account+id] will be created automatically
    console.log('Upgraded to v4: account-scoped primary keys');
  });

export { db };
