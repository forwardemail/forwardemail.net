import Dexie from 'dexie';

const db = new Dexie('webmail-cache');

db.version(1).stores({
  folders: 'path,name,count,specialUse,updatedAt',
  messages:
    'id,folder,from,subject,snippet,date,flags,is_unread,has_attachment,modseq,updatedAt',
  meta: 'key,value'
});

export { db };
