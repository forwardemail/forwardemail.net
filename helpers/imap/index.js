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

module.exports = {
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
  onUnsubscribe
};
