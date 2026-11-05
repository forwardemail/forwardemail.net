/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: MPL-2.0
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 *   WildDuck Mail Agent is licensed under the European Union Public License 1.2 or later.
 *   https://github.com/nodemailer/wildduck
 */

const onAppend = require('./on-append');
const onCopy = require('./on-copy');
const onCreate = require('./on-create');
const onDelete = require('./on-delete');
const onExpunge = require('./on-expunge');
const onFetch = require('./on-fetch');
const onGetQuota = require('./on-get-quota');
const onGetQuotaRoot = require('./on-get-quota-root');
const onList = require('./on-list');
const onLsub = require('./on-lsub');
const onMove = require('./on-move');
const onOpen = require('./on-open');
const onRename = require('./on-rename');
const onSearch = require('./on-search');
const onStatus = require('./on-status');
const onStore = require('./on-store');
const onSubscribe = require('./on-subscribe');
const onUnsubscribe = require('./on-unsubscribe');
const onXAPPLEPUSHSERVICE = require('./on-xapplepushservice');

//
// An alias without IMAP only sends mail, but mail apps such as Apple Mail
// need an incoming server to send mail, so it signs in (see on-auth.js) to
// an empty INBOX that is never stored: no mailbox is opened or created, and
// anything that would store mail is refused.  Turning IMAP on signs these
// sessions out, so the next sign in opens the mailbox and creates its
// folders (see app/models/aliases.js).
//
function isSendOnly(session) {
  return session?.user?.alias_has_imap === false;
}

function getInbox(session) {
  return {
    _id: session.user.alias_id,
    path: 'INBOX',
    specialUse: '\\Inbox',
    uidValidity: 1,
    uidNext: 1,
    modifyIndex: 1,
    subscribed: true,
    flags: []
  };
}

const quota = { root: '', quota: 0, storageUsed: 0 };

// (the reply for each command, from the session and its first argument)
const sendOnly = {
  onAppend: () => 'CANNOT',
  onCopy: () => 'CANNOT',
  onCreate: () => 'CANNOT',
  onDelete: () => 'CANNOT',
  onExpunge: () => true,
  onFetch: () => true,
  onGetQuota: () => quota,
  onGetQuotaRoot: () => quota,
  onList: (session) => [getInbox(session)],
  onLsub: (session) => [getInbox(session)],
  onMove: () => 'CANNOT',
  onOpen: (session, path) =>
    path === 'INBOX' ? { ...getInbox(session), uidList: [] } : 'NONEXISTENT',
  onRename: () => 'CANNOT',
  onSearch: () => ({ uidList: [], highestModseq: 1 }),
  onStatus: (session, path) =>
    path === 'INBOX'
      ? { messages: 0, uidNext: 1, uidValidity: 1, unseen: 0, highestModseq: 1 }
      : 'NONEXISTENT',
  onStore: () => true,
  onSubscribe: () => true,
  onUnsubscribe: () => true
};

const handlers = {
  onAppend,
  onCopy,
  onCreate,
  onDelete,
  onExpunge,
  onFetch,
  onGetQuota,
  onGetQuotaRoot,
  onList,
  onLsub,
  onMove,
  onOpen,
  onRename,
  onSearch,
  onStatus,
  onStore,
  onSubscribe,
  onUnsubscribe,
  // (it registers for Apple push as usual, see refresh-session.js)
  onXAPPLEPUSHSERVICE
};

// (imap-core passes the session and then the callback last)
for (const name of Object.keys(sendOnly)) {
  const handler = handlers[name];
  handlers[name] = function (...args) {
    const session = args.at(-2);
    if (!isSendOnly(session)) return handler.apply(this, args);
    args.at(-1)(null, sendOnly[name](session, args[0]));
  };
}

module.exports = { ...handlers, isSendOnly };
