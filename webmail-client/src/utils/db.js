import Dexie from 'dexie';

const db = new Dexie('webmail-cache');

// Current schema version - increment this when adding new versions below
export const CURRENT_SCHEMA_VERSION = 4;

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
  });

/**
 * Reset the entire database (useful for testing or major breaking changes)
 */
export async function resetDatabase() {
  try {
    await db.close();
    await db.delete();
    await db.open();
    return true;
  } catch (error) {
    console.error('Failed to reset database:', error);
    return false;
  }
}

/**
 * Clear all cached data but keep the database structure
 */
export async function clearCache() {
  try {
    await Promise.all([
      db.folders.clear(),
      db.messages.clear(),
      db.messageBodies.clear(),
      db.searchIndex.clear(),
      db.indexMeta.clear(),
      db.syncQueue.clear()
    ]);
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

/**
 * Get current database version and metadata
 */
export async function getDatabaseInfo() {
  try {
    const info = {
      version: db.verno,
      name: db.name,
      isOpen: db.isOpen(),
      tables: db.tables.map(t => ({
        name: t.name,
        schema: t.schema.primKey?.keyPath || t.schema.primKey?.name,
        indexes: t.schema.indexes?.map(idx => idx.name) || []
      }))
    };

    // Get record counts
    const counts = {};
    for (const table of db.tables) {
      try {
        counts[table.name] = await table.count();
      } catch (err) {
        counts[table.name] = 0;
      }
    }
    info.counts = counts;

    return info;
  } catch (error) {
    console.error('Failed to get database info:', error);
    return null;
  }
}

/**
 * Verify database integrity
 */
export async function verifyDatabaseIntegrity() {
  try {
    // Check if database is open and accessible
    if (!db.isOpen()) {
      await db.open();
    }

    // Verify each table is accessible
    const results = {};
    for (const table of db.tables) {
      try {
        await table.limit(1).toArray();
        results[table.name] = 'ok';
      } catch (err) {
        results[table.name] = 'error: ' + err.message;
      }
    }

    return results;
  } catch (error) {
    console.error('Database integrity check failed:', error);
    return { error: error.message };
  }
}

export { db };

/*
 * ============================================================================
 * SCHEMA UPGRADE GUIDE
 * ============================================================================
 *
 * When you need to make schema changes, follow these steps:
 *
 * 1. INCREMENT THE VERSION NUMBER
 *    Update CURRENT_SCHEMA_VERSION at the top of this file
 *
 * 2. ADD A NEW VERSION BLOCK
 *    Copy the template below and fill in your changes:
 *
 *    db.version(5)  // Next version number
 *      .stores({
 *        // Copy ALL tables from previous version
 *        // Modify only the ones that need changes
 *        folders: '[account+path],account,path,parentPath,unread_count,specialUse,updatedAt',
 *        messages: '[account+id],id,folder,account,[account+folder],from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt,bodyIndexed',
 *        // ... rest of tables
 *        newTable: 'id,someField,updatedAt'  // Add new table
 *      })
 *      .upgrade(async (tx) => {
 *        // Optional: Add migration logic here
 *        console.log('Upgraded to v5: description of changes');
 *
 *        // Example: Add new field to existing records
 *        await tx.table('messages').toCollection().modify((msg) => {
 *          msg.newField = 'defaultValue';
 *        });
 *      });
 *
 * 3. COMMON OPERATIONS IN UPGRADE FUNCTION
 *
 *    // Add a field to all records
 *    await tx.table('messages').toCollection().modify((record) => {
 *      record.newField = defaultValue;
 *    });
 *
 *    // Transform existing data
 *    await tx.table('messages').toCollection().modify((record) => {
 *      record.transformedField = transform(record.oldField);
 *      delete record.oldField;
 *    });
 *
 *    // Migrate data from one table to another
 *    const oldRecords = await tx.table('oldTable').toArray();
 *    await tx.table('newTable').bulkPut(
 *      oldRecords.map(r => transformToNewFormat(r))
 *    );
 *    await tx.table('oldTable').clear();
 *
 *    // Delete a table (set to null in stores)
 *    // tableToDelete: null
 *
 * 4. TESTING YOUR MIGRATION
 *
 *    Before deploying:
 *    - Test on fresh database (new user scenario)
 *    - Test on database with v1 data (upgrade from oldest version)
 *    - Test on database with v(N-1) data (upgrade from previous version)
 *    - Verify data integrity after migration
 *    - Test rollback scenario (if user has v5, opens v4 code)
 *
 * 5. IMPORTANT RULES
 *
 *    ✅ DO:
 *    - Always increment version number sequentially (4 → 5 → 6)
 *    - Keep ALL previous version blocks (Dexie needs full history)
 *    - Test migrations thoroughly before deployment
 *    - Add console.log in upgrade function for debugging
 *    - Document what changed in the upgrade function
 *
 *    ❌ DON'T:
 *    - Skip version numbers
 *    - Modify previous version blocks after deployment
 *    - Remove previous version blocks
 *    - Change primary keys without careful migration
 *    - Forget to update CURRENT_SCHEMA_VERSION
 *
 * 6. EMERGENCY RECOVERY
 *
 *    If a migration fails in production:
 *    - Users can use Settings → "Reset database"
 *    - Developers can call resetDatabase() in console
 *    - Add fallback/recovery logic in upgrade function
 *
 * 7. MONITORING UPGRADES
 *
 *    Check browser console for:
 *    - "Upgraded to vX: ..." messages from upgrade functions
 *    - Dexie error messages about schema conflicts
 *    - Use getDatabaseInfo() to verify current state
 *
 * ============================================================================
 * EXAMPLE: Adding a new field to messages
 * ============================================================================
 *
 * // CURRENT_SCHEMA_VERSION = 5
 *
 * db.version(5)
 *   .stores({
 *     accounts: 'id,email,createdAt,updatedAt',
 *     folders: '[account+path],account,path,parentPath,unread_count,specialUse,updatedAt',
 *     messages:
 *       '[account+id],id,folder,account,[account+folder],from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt,bodyIndexed,importance',  // Added 'importance'
 *     messageBodies:
 *       '[account+id],account,id,[account+folder],folder,body,textContent,attachments,updatedAt',
 *     drafts: '[account+id],id,account,folder,updatedAt',
 *     searchIndex: '[account+key],key,account,updatedAt',
 *     indexMeta: '[account+key],key,account,updatedAt',
 *     syncQueue: '++queueId,account,action,resource,folder,status,createdAt',
 *     meta: 'key,updatedAt'
 *   })
 *   .upgrade(async (tx) => {
 *     console.log('Upgraded to v5: Added importance field to messages');
 *
 *     // Add importance field to existing messages (default: normal)
 *     await tx.table('messages').toCollection().modify((msg) => {
 *       msg.importance = msg.importance || 'normal';
 *     });
 *   });
 *
 * ============================================================================
 */
