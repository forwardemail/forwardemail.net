import ko from 'knockout';
import { Local, Accounts } from '../utils/storage';
import { Remote } from '../utils/remote';
import { config } from '../config';
import { sanitizeHtml } from '../utils/sanitize';
import * as openpgp from 'openpgp';
import PostalMime from 'postal-mime';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { db } from '../utils/db';
import { SearchService, SavedSearchService, SEARCH_INDEX_KEY } from '../utils/search-service';
import { IndexingWorker } from '../utils/indexing-worker';
import { enqueueSync, replaySyncQueue } from '../utils/sync-queue';
import { groupIntoConversations } from '../utils/threading';
import { i18n } from '../utils/i18n';

function bufferToDataUrl(attachment) {
  try {
    const { content, contentType, mimeType, type } = attachment || {};
    if (!content) return '';
    const mime = contentType || mimeType || type || 'application/octet-stream';

    // content can be Buffer-like (Uint8Array/ArrayBuffer) or string
    let base64;

    if (typeof content === 'string') {
      // Check if already base64 encoded
      const isB64 = /^[A-Za-z0-9/+]+={0,2}$/.test(content.replace(/\s+/g, ''));
      base64 = isB64 ? content.replace(/\s+/g, '') : btoa(unescape(encodeURIComponent(content)));
    } else if (content instanceof ArrayBuffer) {
      // Convert ArrayBuffer to base64 without spread operator (avoids stack overflow)
      const view = new Uint8Array(content);
      base64 = arrayBufferToBase64(view);
    } else if (ArrayBuffer.isView(content)) {
      // Convert typed array to base64
      const view = new Uint8Array(content.buffer || content);
      base64 = arrayBufferToBase64(view);
    } else if (content?.data) {
      // Handle {type: 'Buffer', data: [...]} format
      const view = new Uint8Array(content.data);
      base64 = arrayBufferToBase64(view);
    } else if (Array.isArray(content)) {
      // Handle plain array
      const view = new Uint8Array(content);
      base64 = arrayBufferToBase64(view);
    } else {
      return '';
    }

    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.error('bufferToDataUrl failed', error);
    return '';
  }
}

// Helper function to convert ArrayBuffer to base64 without stack overflow
function arrayBufferToBase64(uint8Array) {
  // For large buffers, process in chunks to avoid stack overflow
  const chunkSize = 8192; // 8KB chunks
  let binary = '';

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, chunk);
  }

  return btoa(binary);
}

function applyInlineAttachments(html, attachments) {
  if (!html || !attachments || attachments.length === 0) return html;
  let updated = html;

  const byCid = new Map();
  const byName = new Map();
  attachments.forEach((att) => {
    if (att.contentId) byCid.set(att.contentId, att.href);
    if (att.name) byName.set(att.name, att.href);
    if (att.filename) byName.set(att.filename, att.href);
  });

  // Replace cid references
  updated = updated.replace(/src=["']cid:([^"']+)["']/gi, (match, cid) => {
    const url = byCid.get(cid) || '';
    return url ? `src="${url}"` : match;
  });

  // Add src for imgs missing it but with alt matching attachment name
  updated = updated.replace(/<img([^>]*?)>/gi, (match, attrs) => {
    const hasSrc = /src\s*=/.test(attrs);
    if (hasSrc) return match;
    const altMatch = attrs.match(/alt=["']([^"']+)["']/i);
    if (!altMatch) return match;
    const alt = altMatch[1];
    const url = byName.get(alt);
    if (!url) return match;
    return `<img${attrs} src="${url}">`;
  });

  return updated;
}

function sanitizeAttachments(list) {
  return (list || []).filter((att) => {
    if (!att) return false;
    const name = att.filename || att.name || '';
    const mime = att.contentType || '';
    // strip PGP armor/control parts
    if (/\.asc$/i.test(name)) return false;
    if (/application\/pgp-encrypted/i.test(mime)) return false;
    // Skip inline images (attachments with contentId are typically inline)
    if (att.contentId || att.cid) return false;
    // Skip image/* content types without a meaningful filename (likely inline)
    if (
      /^image\//i.test(mime) &&
      (!name || name.toLowerCase() === 'attachment' || name.toLowerCase() === 'image')
    )
      return false;
    const size = att.size ?? (att.content ? att.content.length : 0);
    // Skip tiny placeholder attachments (e.g., "Version: 1" blocks)
    if (!att.href && size <= 24) return false;
    // Skip nameless tiny attachments
    if (!att.href && size <= 64 && (!name || name.toLowerCase() === 'attachment')) return false;
    return att.href || size > 0;
  });
}

const DATA_URL_REGEX = /^data:/i;
const INLINE_DATA_URL_SRC_REGEX = /src=["']data:[^"']*["']/gi;

function stripInlineDataUrls(html) {
  if (!html) return html;
  return html.replace(INLINE_DATA_URL_SRC_REGEX, 'data-inline-removed="true"');
}

function extractTextContent(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function serializeAttachmentsForCache(list) {
  return sanitizeAttachments(list).map((att) => {
    const hrefIsDataUrl = att.href ? DATA_URL_REGEX.test(att.href) : false;
    return {
      name: att.name || att.filename,
      filename: att.filename,
      size: att.size,
      contentId: att.contentId,
      contentType: att.contentType,
      href: hrefIsDataUrl ? undefined : att.href, // drop data URLs before writing to IndexedDB
    };
  });
}

const normalizeFlags = (flags) => {
  if (Array.isArray(flags)) return flags;
  if (typeof flags === 'string') {
    try {
      const parsed = JSON.parse(flags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore parse errors
    }
    return flags
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }
  return [];
};

export class MailboxView {
  constructor() {
    // i18n helper
    this.t = (key, params) => i18n.t(key, params);

    this.email = ko.observable(Local.get('email') || '');
    this.folders = ko.observableArray([]);
    this.selectedFolder = ko.observable('');
    this.messages = ko.observableArray([]);
    this.selectedMessage = ko.observable(null);
    this.loading = ko.observable(false);
    this.messageLoading = ko.observable(false);
    this.error = ko.observable('');
    this.messageBody = ko.observable('');
    this.attachments = ko.observableArray([]);
    this.page = ko.observable(1);
    this.limit = 20;
    this.hasNextPage = ko.observable(false);
    this.query = ko.observable('');
    this.unreadOnly = ko.observable(false);
    this.hasAttachmentsOnly = ko.observable(false);
    this.moveTarget = ko.observable('');
    this.actionMenuOpen = ko.observable(false);
    this.pgpStatus = ko.observable('');
    this.pgpKeys = [];
    this.passphraseCache = {};
    this.contacts = ko.observableArray([]);
    const includeBody = Local.get('search_body_index') !== '0';
    this.bodyIndexingEnabled = ko.observable(includeBody);
    this.searchService = new SearchService({
      includeBody,
      account: this.email() || 'default',
    });
    this.savedSearchService = new SavedSearchService(this.email() || 'default');
    this.searchIndexLoaded = false;
    this.indexingWorker = null;
    this.isIndexing = ko.observable(false);
    this.indexingProgress = ko.observable(0);
    this.indexingFolder = ko.observable('');
    this.savedSearches = ko.observableArray([]);
    this.searchMode = ko.observable(Local.get('search_mode') || 'current');
    this.crossFolderResults = ko.observableArray([]);
    this.loadingCrossFolderSearch = ko.observable(false);

    // Indexing policies
    this.indexingPolicy = ko.observable(Local.get('indexing_policy') || 'CUSTOM');
    this.maxIndexMessages = ko.observable(parseInt(Local.get('max_index_messages')) || 1000);
    this.maxIndexAgeDays = ko.observable(parseInt(Local.get('max_index_age_days')) || 90);
    this.autoCleanupEnabled = ko.observable(Local.get('auto_cleanup_enabled') !== '0');
    this.storageWarningLevel = ko.observable('ok'); // 'ok', 'warning', 'critical'

    // Subscribe to search mode changes
    this.searchMode.subscribe((mode) => {
      Local.set('search_mode', mode);
      console.log('Search mode changed to:', mode);
      // Trigger search if we have a query and switched to "all" mode
      if (mode === 'all' && this.query()) {
        this.performCrossFolderSearch(this.query());
      } else if (mode === 'current') {
        this.crossFolderResults([]);
      }
    });

    // Subscribe to query changes to trigger cross-folder search
    this.query.subscribe((q) => {
      if (this.searchMode() === 'all' && q) {
        // Debounce the search
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {
          this.performCrossFolderSearch(q);
        }, 300);
      } else {
        this.crossFolderResults([]);
      }
    });

    // Subscribe to indexing policy changes
    this.indexingPolicy.subscribe((policy) => {
      Local.set('indexing_policy', policy);
      this.applyIndexingPolicy(policy);
    });

    this.maxIndexMessages.subscribe((value) => {
      Local.set('max_index_messages', value.toString());
    });

    this.maxIndexAgeDays.subscribe((value) => {
      Local.set('max_index_age_days', value.toString());
    });

    this.autoCleanupEnabled.subscribe((value) => {
      Local.set('auto_cleanup_enabled', value ? '1' : '0');
    });

    // Subscribe to body indexing changes
    this.bodyIndexingEnabled.subscribe((value) => {
      Local.set('search_body_index', value ? '1' : '0');

      // Recreate search service with new setting
      this.searchService = new SearchService({
        includeBody: value,
        account: this.getAccountKey(),
      });

      console.log('Body indexing', value ? 'enabled' : 'disabled');
    });
    this.toasts = null;
    this.storageUsed = ko.observable(0);
    this.storageTotal = ko.observable(0);
    this.localUsage = ko.observable(0);
    this.localQuota = ko.observable(0);
    this.indexCount = ko.observable(0);
    this.indexSize = ko.observable(0);
    this.syncPending = ko.observable(0);
    this.searchTimer = null;
    this.sidebarOpen = ko.observable(
      typeof window !== 'undefined' ? window.innerWidth > 820 : true,
    );
    this.isDesktop = ko.observable(typeof window !== 'undefined' ? window.innerWidth > 820 : true);
    this.contextMenuVisible = ko.observable(false);
    this.contextMenuX = ko.observable(0);
    this.contextMenuY = ko.observable(0);
    this.contextMenuMessage = ko.observable(null);
    this.availableLabels = ko.observableArray([]);
    this.contextMenuFlipX = ko.observable(false);
    this.contextMenuFlipY = ko.observable(false);
    // Threading
    this.threadingEnabled = ko.observable(Local.get('threading_enabled') !== 'false'); // enabled by default
    this.conversations = ko.observableArray([]);
    this.conversationCache = new Map();
    this.selectedConversation = ko.observable(null);
    this.expandedConversations = ko.observable(new Set()); // Track which conversations are expanded
    this.selectedConversationIds = ko.observableArray([]);
    this.bulkMoveOpen = ko.observable(false);
    this.selectedConversationCount = ko.pureComputed(() => this.selectedConversationIds().length);
    this.allVisibleConversationsSelected = ko.pureComputed(() => {
      const visible = this.filteredConversations();
      if (!visible.length) return false;
      const selected = this.selectedConversationIds();
      return visible.every((c) => selected.includes(c.id));
    });

    // Subscribe to threading changes to save preference
    this.threadingEnabled.subscribe((enabled) => {
      Local.set('threading_enabled', enabled ? 'true' : 'false');
      this.selectedConversationIds([]);
    });
    this.accountMenuOpen = ko.observable(false);
    this.accounts = ko.observableArray([]);
    this.mobileReader = ko.observable(false);
    this.handleResize = () => {
      if (typeof window === 'undefined') return;
      const desktop = window.innerWidth > 820;
      this.isDesktop(desktop);
      if (!desktop) this.sidebarOpen(false);
      if (desktop) this.mobileReader(false);
    };
    this.showFilters = ko.observable(false);
    this.currentAccount = ko.observable(this.email());
    this.currentAccount.subscribe(() => {
      this.searchService.account = this.getAccountKey();
    });
    this.defaultFolders = [
      { path: 'INBOX', name: 'Inbox', icon: 'inbox' },
      { path: 'Drafts', name: 'Drafts', icon: 'drafts' },
      { path: 'Sent Mail', name: 'Sent Mail', icon: 'sent' },
      { path: 'Archive', name: 'Archive', icon: 'archive' },
      { path: 'Spam', name: 'Spam', icon: 'spam' },
      { path: 'Trash', name: 'Trash', icon: 'trash' },
      { path: 'Outbox', name: 'Outbox', icon: 'outbox' },
    ];

    this.filteredMessages = ko.pureComputed(() => {
      const folder = this.selectedFolder();
      const q = (this.query() || '').trim();
      const mode = this.searchMode();

      // Cross-folder search mode
      if (mode === 'all' && q) {
        // Return cross-folder results when in "all" mode with a query
        return this.crossFolderResults();
      }

      // Default: current folder only
      let list = this.messages().filter((msg) => msg.folder === folder);
      if (this.unreadOnly()) list = list.filter((m) => m.is_unread);
      if (this.hasAttachmentsOnly()) list = list.filter((m) => m.has_attachment);
      if (!q) return list;

      // Search within current folder's loaded messages
      const results = this.searchService ? this.searchService.search(q, list) : list;

      if (q && results.length === 0 && this.searchService && mode === 'current') {
        console.log(
          'No search results in current messages. Index has',
          this.searchService.entries.length,
          'entries',
        );
        console.log('Searching for:', q, 'in', list.length, 'messages');
      }

      return results;
    });

    // Computed conversations that respects filters
    this.filteredConversations = ko.pureComputed(() => {
      if (!this.threadingEnabled()) return [];
      const filtered = this.filteredMessages();
      const prevCache = this.conversationCache || new Map();
      const nextCache = new Map();
      const grouped = groupIntoConversations(filtered);
      const stable = grouped.map((conv) => {
        const existing = prevCache.get(conv.id);
        const merged = existing ? Object.assign(existing, conv) : conv;
        nextCache.set(conv.id, merged);
        return merged;
      });
      this.conversationCache = nextCache;
      return stable;
    });

    this.availableMoveTargets = ko.pureComputed(() =>
      this.folders().filter((f) => f.path !== this.selectedFolder()),
    );
    this.unreadCounts = {};

    this.selectedFolder.subscribe(() => {
      const firstOther = this.availableMoveTargets()[0];
      if (firstOther) this.moveTarget(firstOther.path);
      this.selectedConversationIds([]);
      this.bulkMoveOpen(false);
      this.actionMenuOpen(false);
      // placeholder labels list; replace with real label fetch when available
      this.availableLabels([
        { id: 'label-important', name: 'Important' },
        { id: 'label-personal', name: 'Personal' },
        { id: 'label-work', name: 'Work' },
      ]);
    });

    // Initialize multi-account system
    Accounts.init();
    this.loadAccounts();
  }

  loadAccounts() {
    const allAccounts = Accounts.getAll();
    this.accounts(allAccounts);
  }

  getAccountKey() {
    return this.currentAccount?.() || this.email() || 'default';
  }

  getBodyIndexPref() {
    return this.bodyIndexingEnabled?.() !== false;
  }

  updateFolderUnread(folderPath, count) {
    if (!folderPath) return;
    const key = folderPath.toLowerCase();
    this.unreadCounts[key] = typeof count === 'number' ? count : 0;
    this.folders(
      this.folders().map((f) =>
        f.path?.toLowerCase() === key ? { ...f, count: this.unreadCounts[key] } : f,
      ),
    );
  }

  updateUnreadCountFromList() {
    const folderPath = this.selectedFolder();
    if (!folderPath) return;
    const count = this.messages().filter((m) => m.is_unread).length;
    this.updateFolderUnread(folderPath, count);
  }

  formatDate(value) {
    if (!value) return '';
    let date;
    if (typeof value === 'number') {
      date = new Date(value < 1e12 ? value * 1000 : value);
    } else if (typeof value === 'string' && /^\d+$/.test(value)) {
      const num = Number(value);
      date = new Date(num < 1e12 ? num * 1000 : num);
    } else if (typeof value === 'string') {
      date = parseISO(value);
    } else {
      date = new Date(value);
    }
    if (Number.isNaN(date?.getTime?.())) return '';

    if (isToday(date)) return format(date, 'p');
    if (isYesterday(date)) return `Yesterday ${format(date, 'p')}`;
    return format(date, 'MMM d, yyyy p');
  }

  signOut = async () => {
    const currentEmail = this.email();

    // Remove current account and its cache
    await Accounts.remove(currentEmail, true);

    // Check if there are other accounts
    const remainingAccounts = Accounts.getAll();

    if (remainingAccounts.length > 0) {
      // Switch to another account
      window.location.reload();
    } else {
      // No accounts left, go to login
      window.location.href = '/';
    }
  };

  initListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
    }
  }

  async refreshSyncCounts() {
    try {
      const pending = await db.syncQueue.where('status').equals('pending').count();
      this.syncPending(pending);
    } catch {
      this.syncPending(0);
    }
  }

  async refreshIndexStats() {
    try {
      const account = this.getAccountKey();
      const meta = await db.indexMeta.get({ account, key: SEARCH_INDEX_KEY });
      if (meta?.value?.count >= 0) this.indexCount(meta.value.count);
      if (meta?.value?.sizeBytes >= 0) this.indexSize(meta.value.sizeBytes || 0);
    } catch {
      // ignore
    }
  }

  async toggleBodyIndexing(enabled) {
    const current = this.bodyIndexingEnabled();
    const value = typeof enabled === 'boolean' ? enabled : !current;
    this.bodyIndexingEnabled(value);
    Local.set('search_body_index', value ? '1' : '0');
    // Rebuild service and index with current messages
    this.searchService = new SearchService({
      includeBody: value,
      account: this.getAccountKey(),
    });
    await this.rebuildSearchIndex(this.messages());
  }

  async rebuildSearchFromCache() {
    await this.rebuildSearchIndex(this.messages());
    await this.refreshIndexStats();
  }

  async processSyncQueue() {
    const account = this.getAccountKey();
    try {
      await replaySyncQueue(async (record) => {
        const { action, data } = record;
        if (action === 'updateFlags') {
          await Remote.request(
            'Message',
            {
              id: data.id,
              folder: data.folder,
              flags: data.flags,
            },
            { method: 'PUT', pathOverride: `/v1/messages/${encodeURIComponent(data.id)}` },
          );
        } else if (action === 'move') {
          await Remote.request(
            'MessageUpdate',
            { folder: data.target },
            { method: 'PUT', pathOverride: `/v1/messages/${encodeURIComponent(data.id)}` },
          );
        } else if (action === 'delete') {
          await Remote.request(
            'MessageDelete',
            {},
            { method: 'DELETE', pathOverride: `/v1/messages/${encodeURIComponent(data.id)}` },
          );
        } else if (action === 'send') {
          await Remote.request('Emails', data.payload, { method: 'POST' });
          if (data.localId) await this.removeOutboxMessage(data.localId);
        }
      }, account);
      await this.refreshSyncCounts();
      if (this.selectedFolder() === 'Outbox') {
        await this.loadMessages();
      }
    } catch (err) {
      console.warn('sync queue replay failed', err);
    }
  }

  async removeOutboxMessage(localId) {
    if (!localId) return;
    try {
      await db.messages.delete(localId);
      await db.messageBodies.delete(localId);
    } catch (err) {
      console.warn('Failed to remove outbox message', err);
    }
  }

  toggleSidebar = () => {
    this.sidebarOpen(!this.sidebarOpen());
    this.accountMenuOpen(false);
    this.showFilters(false);
  };

  toggleAccountMenu = () => {
    this.accountMenuOpen(!this.accountMenuOpen());
  };

  addAccount = () => {
    // Redirect to login to add another account
    this.accountMenuOpen(false);
    window.location.href = '/';
  };

  switchAccount = (account) => {
    if (!account || !account.email) return;

    // Set the new active account
    Accounts.setActive(account.email);

    // Close menu and reload to switch context
    this.accountMenuOpen(false);
    window.location.reload();
  };

  backToList = () => {
    this.selectedMessage(null);
    this.mobileReader(false);
    this.actionMenuOpen(false);
  };

  selectFolder = (folderName) => {
    this.selectedFolder(folderName);
    this.page(1);
    this.loadMessages();
    if (typeof window !== 'undefined' && window.innerWidth <= 820) {
      this.sidebarOpen(false);
    }
  };

  selectMessage = (message) => {
    this.selectedMessage(message);
    if (message) {
      this.loadMessage(message);
      if (typeof window !== 'undefined' && window.innerWidth <= 820) {
        this.mobileReader(true);
        this.sidebarOpen(false);
      }
    }
  };

  async load() {
    if (config.useMockWebmail) {
      this.setMockData();
      return;
    }
    this.initListeners();

    const account = this.getAccountKey();

    try {
      // Check storage quota on load
      await this.checkStorageQuota();

      // Auto-cleanup if needed
      if (this.autoCleanupEnabled()) {
        const quota = await this.checkStorageQuota();
        if (quota.percentUsed >= 70) {
          await this.performAutoCleanup();
        }
      }

      await this.refreshSyncCounts();
      await this.processSyncQueue();
      if (!this.searchIndexLoaded) {
        await this.searchService.loadFromCache();
        this.searchIndexLoaded = true;
        this.indexCount(this.searchService.entries.length || 0);
      }
      // Try cached folders first
      const cachedFolders = await db.folders.where('account').equals(account).toArray();
      if (cachedFolders?.length) {
        this.folders(this.buildFolderList(cachedFolders));
        if (!this.selectedFolder()) {
          const inbox = cachedFolders.find((f) => f.path?.toUpperCase?.() === 'INBOX');
          this.selectedFolder(inbox?.path || cachedFolders[0].path);
        }
      }

      const foldersRes = await Remote.request('Folders', {});
      const foldersRaw = foldersRes?.Result || foldersRes || [];
      const folders = Array.isArray(foldersRaw)
        ? foldersRaw
        : foldersRaw.Items || foldersRaw.items || [];

      const mappedFolders = this.buildFolderList(folders);

      this.folders(mappedFolders);
      await db.folders.where('account').equals(account).delete();
      await db.folders.bulkPut(
        mappedFolders.map((f) => ({
          ...f,
          account,
          updatedAt: Date.now(),
        })),
      );

      if (!this.selectedFolder() && mappedFolders.length > 0) {
        const inbox = mappedFolders.find((f) => f.path?.toUpperCase?.() === 'INBOX');
        this.selectedFolder(inbox?.path || mappedFolders[0].path);
      }

      await this.loadMessages();
      this.loadContacts();
      this.loadQuota();
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      this.error(error?.message || 'Unable to load mailbox.');
      this.setMockData();
    }
  }

  async loadMessages() {
    if (config.useMockWebmail) {
      this.setMockData();
      return;
    }

    const account = this.getAccountKey();

    // Check cache first
    let cached = [];
    try {
      cached = await db.messages
        .where('[account+folder]')
        .equals([account, this.selectedFolder()])
        .toArray();

      // Sort by date descending (newest first) to match API behavior
      cached.sort((a, b) => {
        const dateA =
          typeof a.dateMs === 'number'
            ? a.dateMs
            : typeof a.updatedAt === 'number'
              ? a.updatedAt
              : new Date(a.date || 0).getTime();
        const dateB =
          typeof b.dateMs === 'number'
            ? b.dateMs
            : typeof b.updatedAt === 'number'
              ? b.updatedAt
              : new Date(b.date || 0).getTime();
        return dateB - dateA;
      });
    } catch (err) {
      console.warn('Failed to load cached messages', err);
    }

    // Only show loading if we don't have cache for the current page
    const currentPage = this.page();
    const startIdx = (currentPage - 1) * this.limit;
    const endIdx = startIdx + this.limit;
    const cachedPage = cached.slice(startIdx, endIdx);
    const hasCacheForPage = cachedPage.length > 0;

    if (!hasCacheForPage) {
      this.loading(true);
      this.error('');
      this.messageBody('');
      this.selectedMessage(null);
      this.messages([]);
    } else {
      // Display cached page immediately
      this.messages(cachedPage);
      await this.rebuildSearchIndex(cached); // Rebuild index with all cached messages
      if (!this.selectedMessage() || this.selectedMessage()?.folder !== this.selectedFolder()) {
        this.selectedMessage(cachedPage[0] || null);
      }
    }

    try {
      const messagesRes = await Remote.request('MessageList', {
        folder: this.selectedFolder(),
        page: this.page(),
        limit: this.limit,
        ...(this.query() ? { search: this.query() } : {}),
        ...(this.unreadOnly() ? { is_unread: true } : {}),
        ...(this.hasAttachmentsOnly() ? { has_attachment: true } : {}),
      });

      const list = messagesRes?.Result?.List || messagesRes?.Result || messagesRes || [];
      this.hasNextPage(Array.isArray(list) && list.length >= this.limit);

      if (Array.isArray(list) && list.length > 0) {
        const mappedList = list.map((m) => {
          const rawDate = m.Date || m.date || m.header_date || m.internal_date || m.received_at;
          const parsedDate = new Date(rawDate || Date.now());
          const dateMs = Number.isFinite(parsedDate.getTime()) ? parsedDate.getTime() : Date.now();

          return {
            id: m.Uid || m.id || m.uid,
            account,
            folder: m.folder_path || m.folder || m.path || this.selectedFolder(),
            dateMs,
            from:
              m.From?.Display ||
              m.From?.Email ||
              m.from?.text ||
              m.from ||
              m.sender ||
              (m.nodemailer?.from && m.nodemailer.from.text) ||
              'Unknown',
            subject: m.Subject || m.subject || '(No subject)',
            snippet:
              m.Plain?.slice?.(0, 140) ||
              m.snippet ||
              m.preview ||
              m.textAsHtml ||
              m.text ||
              m.nodemailer?.textAsHtml ||
              m.nodemailer?.text ||
              '',
            date: this.formatDate(rawDate || dateMs),
            flags: normalizeFlags(m.flags),
            is_unread: m.is_unread ?? !normalizeFlags(m.flags).includes('\\Seen'),
            has_attachment: Boolean(m.has_attachment || m.hasAttachments),
            bodyIndexed: false,
            pending: false,
          };
        });

        const existingIndexIds =
          this.searchIndexLoaded && this.searchService?.entries?.length
            ? new Set(this.searchService.entries.map((e) => e.id))
            : null;
        const newMessagesForIndex = existingIndexIds
          ? mappedList.filter((msg) => !existingIndexIds.has(msg.id))
          : [];

        let queuedOutbox = [];
        if (this.selectedFolder().toUpperCase() === 'OUTBOX') {
          queuedOutbox = await db.messages
            .where('[account+folder]')
            .equals([account, 'Outbox'])
            .toArray();
          queuedOutbox = queuedOutbox.map((msg) => ({
            ...msg,
            pending: true,
            dateMs: msg.dateMs || Date.now(),
            date: this.formatDate(msg.date || Date.now()),
            from: msg.from || this.email() || 'You',
            is_unread: false,
          }));
        }

        // Check cache BEFORE deleting to preserve corrected has_attachment values
        const cachedMessages = await db.messages
          .where('[account+folder]')
          .equals([account, this.selectedFolder()])
          .toArray();
        const cachedById = new Map(cachedMessages.map((m) => [m.id, m]));

        this.messages([...queuedOutbox, ...mappedList]);
        // refresh cache for this folder with latest data
        await db.messages
          .where('[account+folder]')
          .equals([account, this.selectedFolder()])
          .delete();

        await db.messages.bulkPut(
          mappedList.map((msg) => {
            const cached = cachedById.get(msg.id);
            return {
              ...msg,
              account,
              updatedAt: Date.now(),
              bodyIndexed: msg.bodyIndexed || false,
              // Preserve corrected has_attachment from cache if available
              has_attachment:
                cached?.has_attachment !== undefined ? cached.has_attachment : msg.has_attachment,
            };
          }),
        );
        if (newMessagesForIndex.length) {
          await this.addNewMessagesToGlobalIndex(newMessagesForIndex);
        }
        await this.rebuildSearchIndex(this.messages());
        await this.refreshIndexStats();

        const unreadFromResponse =
          messagesRes?.Result?.Unread ||
          messagesRes?.Unread ||
          messagesRes?.Result?.unread ||
          messagesRes?.unread;
        if (typeof unreadFromResponse === 'number') {
          this.updateFolderUnread(this.selectedFolder(), unreadFromResponse);
        } else {
          this.updateUnreadCountFromList();
        }
        // Only update selected message if we don't have cache for this page or if current selection is invalid
        if (!hasCacheForPage || !this.selectedMessage()) {
          this.selectedMessage(this.messages()[0] || null);
        }
        // Load message content for selected message if needed
        if (this.selectedMessage() && !this.messageBody()) {
          await this.loadMessage(this.selectedMessage());
        }
      }
      // If Outbox and no remote items, still show queued locals
      if (this.selectedFolder().toUpperCase() === 'OUTBOX' && this.messages().length === 0) {
        const queuedOutbox = await db.messages
          .where('[account+folder]')
          .equals([account, 'Outbox'])
          .toArray();
        if (queuedOutbox?.length) {
          this.messages(
            queuedOutbox.map((msg) => ({
              ...msg,
              pending: true,
              date: this.formatDate(msg.date || Date.now()),
              from: msg.from || this.email() || 'You',
              is_unread: false,
            })),
          );
          await this.rebuildSearchIndex(this.messages());
          this.selectedMessage(this.messages()[0] || null);
        }
      }
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      if (cached?.length) {
        // Offline or fetch error but we have cache; stay quiet
        this.error('');
      } else {
        this.error(error?.message || 'Unable to load messages.');
      }
    } finally {
      this.loading(false);
      this.actionMenuOpen(false);
    }
  }

  async loadMessage(message) {
    if (!message) return;

    if (config.useMockWebmail) {
      this.messageBody(sanitizeHtml(message.snippet));
      return;
    }

    const account = this.getAccountKey();

    try {
      // try cached body first
      const cachedContent = await db.messageBodies
        .where('[account+id]')
        .equals([account, message.id])
        .first();
      const cacheAge = cachedContent?.updatedAt ? Date.now() - cachedContent.updatedAt : Infinity;
      const cacheMaxAge = 24 * 60 * 60 * 1000; // 24 hours for message content
      const hasFreshCache = cachedContent?.body && cacheAge < cacheMaxAge;
      const hasAnyCache = cachedContent?.body;

      // Only show loading if we don't have any cache
      if (!hasAnyCache) {
        this.messageLoading(true);
        this.messageBody('');
        this.attachments([]);
        this.pgpStatus('');
      }

      if (hasAnyCache) {
        console.log('Loading message content from cache:', message.id);
        console.log('Cached body length:', cachedContent.body?.length);
        console.log('Cached attachments count:', cachedContent.attachments?.length);
        console.log('Cache age:', Math.round(cacheAge / 1000), 'seconds');
        const hydratedBody = applyInlineAttachments(
          cachedContent.body,
          cachedContent.attachments || [],
        );
        this.messageBody(sanitizeHtml(hydratedBody));
        this.attachments(sanitizeAttachments(cachedContent.attachments));

        // If cache is fresh, skip network request
        if (hasFreshCache) {
          console.log('Using fresh cached content, skipping network request');
          this.messageLoading(false);
          return;
        } else {
          console.log('Cache is stale, fetching fresh data in background');
          // Don't show loading spinner since we have cache displayed
        }
      } else {
        console.log('No cached body for message:', message.id);
      }

      const detailRes = await Remote.request(
        'Message',
        {
          id: message.id,
          folder: message.folder,
        },
        { pathOverride: `/v1/messages/${encodeURIComponent(message.id)}` },
      );

      const result = detailRes?.Result || detailRes;
      const detailFlags = normalizeFlags(result?.flags || message.flags);
      const isUnread = result?.is_unread ?? !detailFlags.includes('\\Seen');
      message.flags = detailFlags;
      message.is_unread = isUnread;
      const detailAttachments = result?.nodemailer?.attachments || result?.attachments || [];
      console.log('Raw attachments from API:', detailAttachments.length, detailAttachments);
      const mappedAttachments = (detailAttachments || []).map((att) => ({
        name: att.name || att.filename,
        filename: att.filename,
        size: att.size,
        contentId: att.cid || att.contentId,
        href: att.url || bufferToDataUrl(att), // prefer API-provided URLs over data URLs
        contentType: att.contentType || att.mimeType || att.type,
        content: att.url ? undefined : att.content,
      }));
      console.log('Mapped attachments:', mappedAttachments);
      const attachments = sanitizeAttachments(mappedAttachments);
      console.log('Sanitized attachments:', attachments.length, attachments);
      this.attachments(attachments);

      const serverText =
        result?.Plain ||
        result?.text ||
        result?.body ||
        result?.preview ||
        result?.nodemailer?.text ||
        result?.nodemailer?.preview;
      const rawBody =
        result?.html ||
        result?.Html ||
        result?.textAsHtml ||
        result?.nodemailer?.html ||
        result?.nodemailer?.textAsHtml ||
        serverText ||
        message.snippet ||
        '';
      const pgpPayload = this.detectPgpPayload(result, attachments);
      if (pgpPayload) {
        this.pgpStatus('Encrypted – attempting decrypt…');
        const decrypted = await this.decryptPgp(pgpPayload);
        if (decrypted) {
          this.pgpStatus('Decrypted with saved key');
          const parsed = await this.parseWithPostalMime(decrypted, attachments);
          if (parsed) {
            const parsedAttachments = sanitizeAttachments(parsed.attachments);
            this.messageBody(`<div class="fe-message-canvas">${sanitizeHtml(parsed.body)}</div>`);
            this.attachments(parsedAttachments);
            await this.cacheMessageContent(message, parsed.body, parsedAttachments, parsed.rawBody);
          } else {
            this.messageBody(sanitizeHtml(this.normalizeDecrypted(decrypted)));
          }
        } else {
          this.pgpStatus('PGP encrypted – unable to decrypt with current keys');
          this.messageBody(`<pre style="white-space:pre-wrap">${sanitizeHtml(pgpPayload)}</pre>`);
        }
      } else {
        this.pgpStatus('');
        const parsed = await this.parseWithPostalMime(rawBody, attachments);
        if (parsed) {
          const parsedAttachments = sanitizeAttachments(parsed.attachments);
          this.messageBody(`<div class="fe-message-canvas">${sanitizeHtml(parsed.body)}</div>`);
          this.attachments(parsedAttachments);
          await this.cacheMessageContent(
            message,
            parsed.body,
            parsedAttachments,
            parsed.rawBody,
            parsed.textContent,
          );
        } else {
          const inlinedBody = applyInlineAttachments(rawBody, attachments);
          this.messageBody(`<div class="fe-message-canvas">${sanitizeHtml(inlinedBody)}</div>`);
          await this.cacheMessageContent(
            message,
            inlinedBody,
            attachments,
            rawBody,
            serverText || extractTextContent(inlinedBody || rawBody),
          );
        }
      }

      // Update has_attachment based on sanitized attachments
      const actualHasAttachment = this.attachments().length > 0;
      if (message.has_attachment !== actualHasAttachment) {
        message.has_attachment = actualHasAttachment;
        // Update in IndexedDB cache
        try {
          await db.messages.update(message.id, { has_attachment: actualHasAttachment });
        } catch (err) {
          console.warn('Failed to update has_attachment in cache', err);
        }
        // Trigger UI update
        this.messages.valueHasMutated?.();
      }

      // sync the selected message observable with updated flags/unread state
      this.selectedMessage(Object.assign({}, message));
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      this.error(error?.message || 'Unable to load message.');
      if (!this.messageBody()) {
        const cachedBody = await db.messageBodies
          .where('[account+id]')
          .equals([account, message?.id])
          .first();
        if (cachedBody?.body) {
          const hydratedBody = applyInlineAttachments(
            cachedBody.body,
            cachedBody.attachments || [],
          );
          this.messageBody(sanitizeHtml(hydratedBody));
          this.attachments(sanitizeAttachments(cachedBody.attachments));
        } else {
          this.messageBody(sanitizeHtml(message.snippet || ''));
        }
      }
      this.pgpStatus('');
    } finally {
      this.messageLoading(false);
      this.actionMenuOpen(false);

      // Auto-mark as read after loading message
      if (message && message.is_unread) {
        setTimeout(() => {
          this.markAsRead(message);
        }, 500); // Small delay to ensure message is displayed
      }
    }
  }

  async markAsRead(message) {
    if (!message || !message.is_unread) return;
    const currentFlags = normalizeFlags(message.flags);
    const newFlags = new Set(currentFlags);
    newFlags.add('\\Seen');

    // Optimistic update
    message.flags = Array.from(newFlags);
    message.is_unread = false;
    this.messages.valueHasMutated?.();
    this.selectedMessage(Object.assign({}, message));

    if (config.useMockWebmail) return;

    const account = this.getAccountKey();
    const payload = {
      id: message.id,
      folder: message.folder,
      flags: Array.from(newFlags),
    };

    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (isOffline) {
      await enqueueSync('updateFlags', {
        account,
        resource: 'message',
        folder: message.folder,
        data: payload,
      });
      return;
    }

    try {
      await Remote.request('Message', payload, {
        method: 'PUT',
        pathOverride: `/v1/messages/${encodeURIComponent(message.id)}?folder=${encodeURIComponent(message.folder)}`,
      });
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      await enqueueSync('updateFlags', {
        account,
        resource: 'message',
        folder: message.folder,
        data: payload,
      });
    }
  }

  async toggleRead(message) {
    if (!message) return;
    const currentFlags = normalizeFlags(message.flags);
    const hasSeen = currentFlags.includes('\\Seen');
    const newFlags = new Set(currentFlags);
    if (hasSeen) newFlags.delete('\\Seen');
    else newFlags.add('\\Seen');

    const newIsUnread = hasSeen;

    // Optimistic update
    message.flags = Array.from(newFlags);
    message.is_unread = newIsUnread;
    this.messages.valueHasMutated?.();
    this.selectedMessage(Object.assign({}, message));

    if (config.useMockWebmail) return;

    const account = this.getAccountKey();
    const payload = {
      id: message.id,
      folder: message.folder,
      flags: Array.from(newFlags),
    };
    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    if (isOffline) {
      await enqueueSync('updateFlags', {
        account,
        resource: 'message',
        folder: message.folder,
        data: payload,
      });
      this.toasts?.show?.('Change queued (offline)', 'info');
      await this.refreshSyncCounts();
      return;
    }

    try {
      await Remote.request('Message', payload, {
        method: 'PUT',
        pathOverride: `/v1/messages/${encodeURIComponent(message.id)}?folder=${encodeURIComponent(message.folder)}`,
      });
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      await enqueueSync('updateFlags', {
        account,
        resource: 'message',
        folder: message.folder,
        data: payload,
      });
      this.toasts?.show?.('Change queued to sync later', 'info');
      await this.refreshSyncCounts();
    }
    this.actionMenuOpen(false);
  }

  detectPgpPayload(result, attachments) {
    const strings = [];
    const maybePush = (val) => {
      if (typeof val === 'string') strings.push(val);
    };

    maybePush(result?.raw);
    maybePush(result?.Raw);
    maybePush(result?.text);
    maybePush(result?.Plain);
    maybePush(result?.html);
    maybePush(result?.body);
    maybePush(result?.nodemailer?.text);
    maybePush(result?.nodemailer?.html);

    (attachments || []).forEach((att) => {
      if (typeof att.content === 'string') strings.push(att.content);
    });

    const marker = '-----BEGIN PGP MESSAGE-----';
    for (const candidate of strings) {
      if (candidate && candidate.includes(marker)) {
        const start = candidate.indexOf(marker);
        return candidate.slice(start);
      }
    }
    return null;
  }

  normalizeDecrypted(decrypted) {
    if (!decrypted) return '';
    const looksHtml = /<\/?[a-z][\s\S]*>/i.test(decrypted);
    if (looksHtml) return decrypted;
    return `<pre style="white-space:pre-wrap">${decrypted}</pre>`;
  }

  async rebuildSearchIndex(list = []) {
    try {
      const account = this.getAccountKey();
      const folder = this.selectedFolder() || '';
      const bodies = await db.messageBodies
        .where('[account+folder]')
        .equals([account, folder])
        .toArray();
      const bodyMap = new Map((bodies || []).map((b) => [b.id, b]));
      const enriched = (list || []).map((m) => {
        const body = bodyMap.get(m.id);
        return {
          ...m,
          body: body?.body,
          textContent: body?.textContent,
        };
      });
      const preserved =
        this.searchIndexLoaded && this.searchService?.entries?.length
          ? this.searchService.entries.filter((entry) => entry.folder !== folder)
          : [];
      const combined = preserved.length ? [...preserved, ...enriched] : enriched;
      await this.searchService.reset(combined);
      this.indexCount(this.searchService.entries.length || 0);
      await this.refreshIndexStats();
    } catch (error) {
      console.warn('search index build failed', error);
    }
  }

  async addNewMessagesToGlobalIndex(messages = []) {
    if (
      !this.searchIndexLoaded ||
      !this.searchService ||
      !Array.isArray(messages) ||
      !messages.length
    ) {
      return;
    }

    try {
      const account = this.getAccountKey();
      const cutoffDate = Date.now() - this.maxIndexAgeDays() * 24 * 60 * 60 * 1000;
      const maxEntries = this.maxIndexMessages();
      const existingEntries = this.searchService.entries || [];
      const existingIds = new Set(existingEntries.map((e) => e.id));
      const remainingSlots = Math.max(0, maxEntries - existingEntries.length);
      if (!remainingSlots) return;

      let bodyMap = new Map();
      if (this.searchService.includeBody) {
        try {
          const bodies = await db.messageBodies
            .where('[account+folder]')
            .equals([account, this.selectedFolder()])
            .toArray();
          bodyMap = new Map((bodies || []).map((b) => [b.id, b]));
        } catch (err) {
          console.warn('Failed to load cached bodies for indexing', err);
        }
      }

      const toAdd = [];
      for (const msg of messages) {
        if (!msg?.id || existingIds.has(msg.id)) continue;

        const dateMs =
          typeof msg.dateMs === 'number'
            ? msg.dateMs
            : new Date(msg.date || msg.internalDate || msg.received_at || Date.now()).getTime();

        if (!Number.isFinite(dateMs) || dateMs < cutoffDate) continue;
        if (toAdd.length >= remainingSlots) break;

        const body = bodyMap.get(msg.id);
        toAdd.push({
          id: msg.id,
          folder: msg.folder,
          subject: msg.subject || '',
          from: msg.from || '',
          to: msg.to || '',
          cc: msg.cc || '',
          snippet: msg.snippet || '',
          date: msg.date || msg.dateMs || '',
          body: body?.body,
          textContent: body?.textContent,
        });
        existingIds.add(msg.id);
      }

      if (!toAdd.length) return;

      await this.searchService.addAndPersist(toAdd);
      this.indexCount(this.searchService.entries.length || 0);
      this.indexSize(this.searchService.sizeBytes || 0);
    } catch (error) {
      console.warn('Failed to add new messages to global index', error);
    }
  }

  async cacheMessageContent(
    message,
    renderedBody,
    attachments = [],
    rawBodyForCache,
    textContent = '',
  ) {
    if (!message?.id || !renderedBody) return;
    const account = this.getAccountKey();
    const safeAttachments = serializeAttachmentsForCache(attachments);
    const bodyForCache = stripInlineDataUrls(rawBodyForCache || renderedBody);
    const normalizedText = textContent || extractTextContent(renderedBody);
    const record = {
      id: message.id,
      account,
      folder: message.folder,
      body: bodyForCache,
      textContent: normalizedText,
      attachments: safeAttachments,
      updatedAt: Date.now(),
    };

    console.log(
      'Saving message content to cache - body length:',
      bodyForCache?.length,
      'attachments:',
      safeAttachments.length,
    );

    try {
      await db.messageBodies.put(record);
      console.log('Successfully cached message content:', message.id);
      await this.refreshIndexStats();
    } catch (err) {
      console.error('Failed to cache message content:', message.id, err);
      if (err.name === 'QuotaExceededError') {
        console.warn('Quota exceeded, caching without attachments for message:', message.id);
        await db.messageBodies.put({
          id: message.id,
          account,
          folder: message.folder,
          body: bodyForCache,
          textContent: normalizedText,
          attachments: [],
          updatedAt: Date.now(),
        });
      }
    }

    // Mark message as bodyIndexed for search visibility
    try {
      await db.messages.update(message.id, { bodyIndexed: true });
    } catch {
      // ignore
    }
  }

  async parseWithPostalMime(raw, existingAttachments = []) {
    if (!raw) return null;
    try {
      const parser = new PostalMime();
      const email = await parser.parse(raw);
      const attachments =
        (email.attachments || []).map((att) => ({
          name: att.filename || 'attachment',
          filename: att.filename || 'attachment',
          size: att.size || att.content?.length || 0,
          contentId: att.contentId || undefined,
          href: bufferToDataUrl({
            content: att.content,
            contentType: att.mimeType || att.contentType || 'application/octet-stream',
          }),
          contentType: att.mimeType || att.contentType || 'application/octet-stream',
        })) || [];
      const merged = [...existingAttachments, ...attachments].filter(
        (att) => !/\.asc$/i.test(att.filename || att.name || ''),
      );
      const body =
        email.html || (email.text ? `<pre style="white-space:pre-wrap">${email.text}</pre>` : raw);
      const inlined = applyInlineAttachments(body, merged);
      return {
        body: inlined,
        rawBody: body,
        attachments: merged,
        textContent: email.text || extractTextContent(body),
      };
    } catch (error) {
      console.warn('postal-mime parse failed', error);
      return null;
    }
  }

  loadPgpKeys() {
    if (!this.pgpKeys || !Array.isArray(this.pgpKeys) || !this.pgpKeys.length) {
      try {
        const stored = Local.get('pgp_keys');
        this.pgpKeys = stored ? JSON.parse(stored) : [];
      } catch {
        this.pgpKeys = [];
      }
    }
    return this.pgpKeys;
  }

  getPassphrase(name) {
    if (!name) return null;
    if (this.passphraseCache[name]) return this.passphraseCache[name];
    try {
      const fromSession = sessionStorage.getItem(`webmail_pgp_pass_${name}`);
      if (fromSession) {
        this.passphraseCache[name] = fromSession;
        return fromSession;
      }
    } catch {
      // ignore
    }
    return null;
  }

  cachePassphrase(name, passphrase, persistSession) {
    if (!name || !passphrase) return;
    this.passphraseCache[name] = passphrase;
    if (persistSession) {
      try {
        sessionStorage.setItem(`webmail_pgp_pass_${name}`, passphrase);
      } catch {
        // ignore
      }
    }
  }

  async decryptPgp(armored) {
    const keys = this.loadPgpKeys();
    if (!keys.length) return null;
    for (const key of keys) {
      try {
        const privateKey = await openpgp.readPrivateKey({ armoredKey: key.value });
        let unlocked = privateKey;
        if (privateKey.isDecrypted() === false) {
          let passphrase = this.getPassphrase(key.name);
          if (!passphrase && this.passphraseModal) {
            try {
              const prompt = await this.passphraseModal.open(key.name);
              if (!prompt?.passphrase) continue;
              passphrase = prompt.passphrase;
              if (prompt.remember) this.cachePassphrase(key.name, passphrase, true);
            } catch {
              continue;
            }
          }
          if (!passphrase) continue;
          unlocked = await openpgp.decryptKey({
            privateKey,
            passphrase,
          });
          this.cachePassphrase(key.name, passphrase, false);
        }
        const message = await openpgp.readMessage({ armoredMessage: armored });
        const { data } = await openpgp.decrypt({
          message,
          decryptionKeys: unlocked,
        });
        // future: verify signatures if needed (signatures array)
        return data;
      } catch (error) {
        console.warn('PGP decrypt failed for key', key.name, error);
        continue;
      }
    }
    return null;
  }

  async parseWithMailparser() {
    return null;
  }

  getArchiveFolderPath() {
    const archiveFolder = this.folders().find(
      (f) =>
        (f.path || '').toLowerCase() === 'archive' || (f.name || '').toLowerCase() === 'archive',
    );
    return archiveFolder?.path || 'Archive';
  }

  async archiveMessage(message) {
    if (!message?.id) return;
    const target = this.getArchiveFolderPath();
    if (!target) {
      this.toasts?.show?.('Archive folder not found', 'error');
      return;
    }
    const result = await this.moveMessage(message, target, { stayInFolder: true });
    if (result?.success) {
      this.toasts?.show?.('Message archived', 'success');
    }
  }

  async deleteMessage(message, options = {}) {
    if (!message?.id) return;
    const account = this.getAccountKey();
    const payload = { id: message.id, folder: message.folder };
    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    const permanent = Boolean(options.permanent);

    // Optimistic remove
    this.messages.remove((m) => m.id === message.id);
    this.selectedMessage(null);
    this.messageBody('');
    this.attachments([]);
    this.updateUnreadCountFromList();

    if (isOffline) {
      await enqueueSync('delete', {
        account,
        resource: 'message',
        folder: message.folder,
        data: { ...payload, permanent },
      });
      this.toasts?.show?.(
        permanent ? 'Permanent delete queued (offline)' : 'Delete queued (offline)',
        'info',
      );
      await this.refreshSyncCounts();
      return;
    }

    try {
      let path = `/v1/messages/${encodeURIComponent(message.id)}`;
      if (permanent) path += '?permanent=1';
      await Remote.request('MessageDelete', {}, { method: 'DELETE', pathOverride: path });
      this.toasts?.show(permanent ? 'Message permanently deleted' : 'Message deleted', 'success');
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      await enqueueSync('delete', {
        account,
        resource: 'message',
        folder: message.folder,
        data: { ...payload, permanent },
      });
      this.toasts?.show?.(
        permanent ? 'Permanent delete queued to sync later' : 'Delete queued to sync later',
        'info',
      );
      await this.refreshSyncCounts();
    }
    this.actionMenuOpen(false);
  }

  async moveMessage(message, targetOverride, options = {}) {
    if (!message?.id) return;
    const stayInFolder = Boolean(options.stayInFolder);
    const target = targetOverride || this.moveTarget();
    if (!target || target === message.folder) return { success: false, queued: false };
    const account = this.getAccountKey();
    const payload = { id: message.id, from: message.folder, target };
    const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
    const originalFolder = message.folder;
    const result = { success: false, queued: false };

    // Optimistic UI: either keep current folder (remove message) or switch to target
    if (stayInFolder) {
      this.messages.remove((m) => m.id === message.id);
      if (this.selectedMessage()?.id === message.id) {
        this.selectedMessage(null);
        this.messageBody('');
        this.attachments([]);
      }
      this.updateUnreadCountFromList();
    } else {
      this.selectedFolder(target);
      this.page(1);
      await this.loadMessages();
    }

    if (isOffline) {
      await enqueueSync('move', {
        account,
        resource: 'message',
        folder: originalFolder,
        data: payload,
      });
      this.toasts?.show?.('Move queued (offline)', 'info');
      await this.refreshSyncCounts();
      result.queued = true;
      return result;
    }

    try {
      await Remote.request(
        'MessageUpdate',
        { folder: target },
        { method: 'PUT', pathOverride: `/v1/messages/${encodeURIComponent(message.id)}` },
      );
      result.success = true;
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return result;
      }
      await enqueueSync('move', {
        account,
        resource: 'message',
        folder: originalFolder,
        data: payload,
      });
      this.toasts?.show?.('Move queued to sync later', 'info');
      await this.refreshSyncCounts();
      result.queued = true;
    }
    this.actionMenuOpen(false);
    return result;
  }

  nextPage = () => {
    if (!this.hasNextPage()) return;
    this.page(this.page() + 1);
    this.loadMessages();
  };

  prevPage = () => {
    if (this.page() === 1) return;
    this.page(this.page() - 1);
    this.loadMessages();
  };

  toggleActionMenu = () => {
    this.actionMenuOpen(!this.actionMenuOpen());
  };

  handleMessageClick = (message, event) => {
    if (!message) return;
    if (event?.ctrlKey || event?.metaKey) {
      this.openContextMenu(message, event);
      return;
    }
    this.selectMessage(message);
  };

  openContextMenu = (message, event) => {
    if (!message) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    this.selectedMessage(message);
    this.contextMenuMessage(message);
    this.contextMenuVisible(true);
    this.contextMenuFlipX(false);
    this.contextMenuFlipY(false);
    document.addEventListener('click', this.closeContextMenuOnce, { once: true });

    // Defer positioning until menu is in DOM
    setTimeout(() => {
      const menuEl = document.querySelector('.fe-context-menu');
      if (!menuEl) return;
      const rect = menuEl.getBoundingClientRect();
      const margin = 12;
      let left = event?.clientX || 0;
      let top = event?.clientY || 0;
      let flipX = false;
      let flipY = false;

      if (left + rect.width + 200 > window.innerWidth - margin) {
        left = Math.max(margin, window.innerWidth - rect.width - margin);
        flipX = true;
      }

      if (top + rect.height > window.innerHeight - margin) {
        top = Math.max(margin, window.innerHeight - rect.height - margin);
        flipY = true;
      }

      this.contextMenuX(left);
      this.contextMenuY(top);
      this.contextMenuFlipX(flipX);
      this.contextMenuFlipY(flipY);
    }, 0);
  };

  closeContextMenu = () => {
    this.contextMenuVisible(false);
    this.contextMenuMessage(null);
  };

  closeContextMenuOnce = (e) => {
    if (e?.target?.closest && e.target.closest('.fe-context-menu')) return;
    this.closeContextMenu();
  };

  contextArchive = () => {
    const msg = this.contextMenuMessage();
    if (!msg) return;
    this.archiveMessage(msg);
    this.closeContextMenu();
  };

  contextDelete = (permanent = false) => {
    const msg = this.contextMenuMessage();
    if (!msg) return;
    this.deleteMessage(msg, { permanent });
    this.closeContextMenu();
  };

  contextToggleRead = () => {
    const msg = this.contextMenuMessage();
    if (!msg) return;
    this.toggleRead(msg);
    this.closeContextMenu();
  };

  contextMoveTo = async (target) => {
    const msg = this.contextMenuMessage();
    if (!msg || !target) {
      this.closeContextMenu();
      return;
    }
    await this.moveMessage(msg, target, { stayInFolder: true });
    this.closeContextMenu();
  };

  contextLabel = (labelId) => {
    const msg = this.contextMenuMessage();
    if (!msg || !labelId) {
      this.closeContextMenu();
      return;
    }
    // Placeholder: tie into labels API when available
    this.toasts?.show?.('Labeling not yet implemented', 'info');
    this.closeContextMenu();
  };

  replyTo(message) {
    if (!this.composeModal || !message) return;
    this.composeModal.open();
    const from = message.from || '';
    const emailMatch = from.match(/<([^>]+)>/);
    const addr = emailMatch ? emailMatch[1] : from;
    if (addr) this.composeModal.toList([addr]);
    this.composeModal.subject(`Re: ${message.subject || ''}`);
    if (this.composeModal.editorView) {
      this.composeModal.editorView.commands.setContent(
        `<p><br></p><blockquote>${this.messageBody()}</blockquote>`,
      );
    }
    if (this.composeModal.focusEditorStart) this.composeModal.focusEditorStart();
    this.actionMenuOpen(false);
  }

  forwardMessage(message) {
    if (!this.composeModal || !message) return;
    this.composeModal.open();
    this.composeModal.subject(`Fwd: ${message.subject || ''}`);
    if (this.composeModal.editorView) {
      this.composeModal.editorView.commands.setContent(`<p><br></p><hr>${this.messageBody()}`);
    }
    if (this.composeModal.focusEditorStart) this.composeModal.focusEditorStart();
    this.actionMenuOpen(false);
  }

  async downloadOriginal(message) {
    if (!message?.id) return;
    try {
      const aliasAuth = Local.get('alias_auth');
      if (!aliasAuth) throw new Error('Missing auth');
      const url = `${config.apiBase}/v1/messages/${encodeURIComponent(message.id)}?eml=true`;
      const res = await fetch(url, {
        headers: { Authorization: `Basic ${btoa(aliasAuth)}` },
      });
      if (!res.ok) throw new Error('Download failed');
      const text = await res.text();
      const blob = new Blob([text], { type: 'message/rfc822' });
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `${message.subject || 'message'}.eml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (error) {
      this.error(error?.message || 'Unable to download original.');
    }
    this.actionMenuOpen(false);
  }

  onSearch = (text) => {
    this.query(text);
  };

  toggleUnreadFilter = () => {
    this.unreadOnly(!this.unreadOnly());
    this.page(1);
    this.loadMessages();
  };

  toggleAttachmentFilter = () => {
    this.hasAttachmentsOnly(!this.hasAttachmentsOnly());
    this.page(1);
    this.loadMessages();
  };

  toggleFilters = () => {
    this.showFilters(!this.showFilters());
  };

  async loadContacts() {
    try {
      const res = await Remote.request('Contacts', { limit: 500 });
      const list = Array.isArray(res) ? res : res?.Result || res?.contacts || [];
      const mapped = (list || [])
        .map((c) => {
          const email =
            (c.emails && c.emails[0]?.value) || (c.Emails && c.Emails[0]?.value) || c.email || '';
          if (!email) return null;
          return email;
        })
        .filter(Boolean);
      this.contacts(mapped);
      if (this.composeModal && this.composeModal.setContacts) {
        this.composeModal.setContacts(mapped);
      }
    } catch (error) {
      console.warn('Contacts load failed', error);
    }
  }

  async loadQuota() {
    try {
      // if Account endpoint available, fetch for quota
      const res = await Remote.request('Account', {});
      const used = res?.storage_used || res?.storage_used_by_aliases || 0;
      const total =
        res?.storage_quota ||
        res?.max_quota_per_alias ||
        res?.max_quota ||
        res?.max_quota_per_aliases ||
        0;
      if (total) {
        this.storageUsed(used);
        this.storageTotal(total);
      }
    } catch {
      // non-blocking
    }

    // Local storage estimate (IndexedDB/cache)
    try {
      if (navigator?.storage?.estimate) {
        const { usage = 0, quota = 0 } = await navigator.storage.estimate();
        this.localUsage(usage);
        this.localQuota(quota);
      }
    } catch {
      // ignore
    }
  }

  buildFolderList(folders) {
    const parsed = (folders || []).map((f) => ({
      id: f.id || f.Id,
      path: f.path || f.Path || f.fullName || f.FullName || f.name || 'INBOX',
      name: f.name || f.Name || f.path || f.Path || 'Folder',
      count:
        f.Unread ||
        f.unread ||
        f.unseen ||
        f.Unseen ||
        f.unreadCount ||
        f.total_unread ||
        f.Count ||
        0,
      specialUse: f.special_use || f.SpecialUse,
      icon: f.icon,
    }));

    // Build a node map keyed by lowercase path
    const nodes = new Map();
    const ensureNode = (path, source = {}) => {
      if (!path) return null;
      const key = path.toLowerCase();
      if (!nodes.has(key)) {
        nodes.set(key, {
          path,
          name: path.split('/').pop() || path,
          count: 0,
          icon: 'folder',
          children: [],
        });
      }
      const node = nodes.get(key);
      Object.assign(node, source, { icon: source.icon || node.icon || 'folder' });
      return node;
    };

    // Seed default folders
    this.defaultFolders.forEach((def) => {
      ensureNode(def.path, { ...def, children: [] });
    });

    // Add/merge API folders
    parsed.forEach((f) => {
      ensureNode(f.path, { ...f, children: [] });
      const parts = f.path.split('/').filter(Boolean);
      // Ensure parent nodes exist for subfolders
      for (let i = 1; i < parts.length; i++) {
        const parentPath = parts.slice(0, i).join('/');
        ensureNode(parentPath, { path: parentPath, name: parts[i - 1] });
      }
    });

    // Reset children and wire parent -> child relationships
    nodes.forEach((node) => {
      node.children = [];
    });
    nodes.forEach((node) => {
      const idx = node.path.lastIndexOf('/');
      if (idx === -1) return; // root
      const parentPath = node.path.slice(0, idx);
      const parent = ensureNode(parentPath);
      if (
        parent &&
        !parent.children.find((c) => c.path.toLowerCase() === node.path.toLowerCase())
      ) {
        parent.children.push(node);
      }
    });

    // Helper to sort children alphabetically
    const sortChildren = (list) =>
      list.sort((a, b) => (a.name || a.path).localeCompare(b.name || b.path));

    // Collect roots in default order, then remaining roots sorted
    const rootSet = new Set();
    const roots = [];
    // Keep defaults in the defined order
    this.defaultFolders.forEach((def) => {
      const node = nodes.get(def.path.toLowerCase());
      if (node) {
        roots.push(node);
        rootSet.add(def.path.toLowerCase());
      }
    });

    // Append remaining roots alphabetically
    const extraRoots = [];
    nodes.forEach((node, key) => {
      if (!node.path.includes('/') && !rootSet.has(key)) {
        extraRoots.push(node);
      }
    });
    extraRoots.sort((a, b) => (a.name || a.path).localeCompare(b.name || b.path));
    extraRoots.forEach((node) => roots.push(node));

    const flatten = (node, level = 0, acc = []) => {
      acc.push({
        ...node,
        level,
        displayName: node.name,
      });
      sortChildren(node.children).forEach((child) => flatten(child, level + 1, acc));
      return acc;
    };

    const ordered = [];
    roots.forEach((root) => flatten(root, 0, ordered));
    return ordered;
  }

  folderCount(folder) {
    if (!folder) return 0;
    const path = (folder.path || '').toUpperCase();
    if (path === 'OUTBOX') {
      return Math.max(folder.count || 0, this.syncPending());
    }
    return folder.count || 0;
  }

  toggleThreading() {
    const newValue = !this.threadingEnabled();
    this.threadingEnabled(newValue);

    this.toasts?.show(
      newValue ? 'Conversation view enabled' : 'Conversation view disabled',
      'success',
    );
  }

  toggleConversation(conversationId) {
    const expanded = this.expandedConversations();
    const newExpanded = new Set(expanded);

    if (newExpanded.has(conversationId)) {
      newExpanded.delete(conversationId);
    } else {
      newExpanded.add(conversationId);
    }

    this.expandedConversations(newExpanded);
    this.expandedConversations.valueHasMutated?.();
  }

  isConversationExpanded(conversationId) {
    return this.expandedConversations().has(conversationId);
  }

  isConversationSelected(conversationId) {
    return this.selectedConversationIds().includes(conversationId);
  }

  toggleConversationSelection(conversation, event) {
    if (event) event.stopPropagation?.();
    if (!conversation?.id) return;
    const current = this.selectedConversationIds();
    const idx = current.indexOf(conversation.id);
    if (idx >= 0) {
      // Remove from array
      current.splice(idx, 1);
      this.selectedConversationIds(current);
    } else {
      // Add to array
      current.push(conversation.id);
      this.selectedConversationIds(current);
    }
  }

  clearSelectedConversations = () => {
    this.selectedConversationIds([]);
    this.bulkMoveOpen(false);
  };

  selectAllVisibleConversations = () => {
    const visible = this.filteredConversations();
    if (!visible.length) return;
    if (this.allVisibleConversationsSelected()) {
      this.selectedConversationIds([]);
      return;
    }
    const next = visible.map((c) => c.id);
    this.selectedConversationIds(next);
  };

  getSelectedConversations() {
    const ids = this.selectedConversationIds();
    if (!ids.length) return [];
    const byId = new Map(this.filteredConversations().map((c) => [c.id, c]));
    const fallback = this.conversations() || [];
    const selected = [];
    ids.forEach((id) => {
      const match = byId.get(id) || fallback.find((c) => c.id === id);
      if (match) selected.push(match);
    });
    return selected;
  }

  getSelectedMessagesFromConversations() {
    const selected = this.getSelectedConversations();
    const seen = new Set();
    return selected
      .flatMap((conv) => conv.messages || [])
      .filter((msg) => {
        if (!msg?.id || seen.has(msg.id)) return false;
        seen.add(msg.id);
        return true;
      });
  }

  async bulkArchiveSelected() {
    const messages = this.getSelectedMessagesFromConversations();
    if (!messages.length) return;
    for (const msg of messages) {
      await this.archiveMessage(msg);
    }
    const count = this.selectedConversationCount();
    this.toasts?.show?.(`Archived ${count} conversation${count === 1 ? '' : 's'}`, 'success');
    this.clearSelectedConversations();
    this.bulkMoveOpen(false);
  }

  async bulkDeleteSelected() {
    const messages = this.getSelectedMessagesFromConversations();
    if (!messages.length) return;
    for (const msg of messages) {
      await this.deleteMessage(msg);
    }
    const count = this.selectedConversationCount();
    this.toasts?.show?.(`Deleted ${count} conversation${count === 1 ? '' : 's'}`, 'success');
    this.clearSelectedConversations();
    this.bulkMoveOpen(false);
  }

  async bulkMoveSelected() {
    const target = this.moveTarget();
    const messages = this.getSelectedMessagesFromConversations();
    if (!messages.length || !target) {
      this.toasts?.show?.('Pick a folder to move conversations', 'info');
      return;
    }
    for (const msg of messages) {
      await this.moveMessage(msg, target, { stayInFolder: true });
    }
    const count = this.selectedConversationCount();
    this.toasts?.show?.(`Moved ${count} conversation${count === 1 ? '' : 's'}`, 'success');
    this.clearSelectedConversations();
    this.bulkMoveOpen(false);
  }

  bulkMoveTo(path) {
    if (!path) return;
    this.moveTarget(path);
    this.bulkMoveSelected();
  }

  toggleBulkMove = () => {
    this.bulkMoveOpen(!this.bulkMoveOpen());
  };

  selectConversation(conversation) {
    this.selectedConversation(conversation);

    // Auto-expand when selected
    if (!this.isConversationExpanded(conversation.id)) {
      this.toggleConversation(conversation.id);
    }

    // Select the latest message in the conversation
    if (conversation.messages && conversation.messages.length > 0) {
      const latestMessage = conversation.messages[conversation.messages.length - 1];
      this.selectedMessage(latestMessage);
      this.loadMessage(latestMessage);
      if (typeof window !== 'undefined' && window.innerWidth <= 820) {
        this.mobileReader(true);
        this.sidebarOpen(false);
      }
    }
  }

  getConversationPreview(conversation) {
    if (!conversation) return '';

    const count = conversation.messageCount;
    if (count === 1) return conversation.snippet;

    return `(${count} messages) ${conversation.snippet}`;
  }

  setMockData() {
    const mockFolders = [
      { name: 'INBOX', path: 'INBOX', count: 3 },
      { name: 'Sent Mail', path: 'Sent Mail', count: 12 },
      { name: 'Drafts', path: 'Drafts', count: 1 },
      { name: 'Archive', path: 'Archive', count: 22 },
      { name: 'Trash', path: 'Trash', count: 0 },
    ];

    const mockMessages = [
      {
        id: 'msg-1',
        folder: 'INBOX',
        from: 'team@forwardemail.net',
        subject: 'Welcome to ForwardEmail Webmail',
        snippet: 'Thanks for trying the new experience. The full mailbox UI is on the way.',
        date: 'Today',
      },
      {
        id: 'msg-2',
        folder: 'INBOX',
        from: 'security@forwardemail.net',
        subject: 'Security tips',
        snippet: 'Remember to enable 2FA on your account and keep recovery codes safe.',
        date: 'Yesterday',
      },
      {
        id: 'msg-3',
        folder: 'INBOX',
        from: 'status@forwardemail.net',
        subject: 'System status',
        snippet: 'All systems operational. Subscribe to status updates for alerts.',
        date: '2d ago',
      },
    ];

    this.folders(this.buildFolderList(mockFolders));
    this.selectedFolder('INBOX');
    this.messages(mockMessages);
    this.selectedMessage(mockMessages[0]);
    this.messageBody(sanitizeHtml(mockMessages[0]?.snippet || ''));
  }

  // Enhanced search indexing methods
  async startBackgroundIndexing(folders = null) {
    if (this.isIndexing()) {
      console.warn('Indexing already in progress');
      return;
    }

    const foldersToIndex = folders || this.folders().filter((f) => f.path);
    if (!foldersToIndex.length) {
      console.warn('No folders available for indexing. Folders:', this.folders());
      this.toasts?.show?.('No folders to index. Please wait for folders to load.', 'info');
      return;
    }

    console.log('Starting indexing for', foldersToIndex.length, 'folders');

    this.loadPgpKeys();

    this.indexingWorker = new IndexingWorker(this.searchService, {
      includeBody: this.bodyIndexingEnabled(),
      account: this.getAccountKey(),
      pgpKeys: this.pgpKeys,
      passphraseCache: this.passphraseCache,
      maxMessages: this.maxIndexMessages(),
      maxAgeDays: this.maxIndexAgeDays(),
      onProgress: (event) => {
        if (event.type === 'progress') {
          this.indexingProgress(Math.round((event.indexed / event.total) * 100));
          this.indexingFolder(event.folder || '');
        } else if (event.type === 'complete') {
          this.isIndexing(false);
          this.indexingProgress(100);
          this.indexCount(this.searchService.entries.length);
          this.indexSize(this.searchService.sizeBytes);
          this.toasts?.show?.(`Indexed ${event.indexed} messages`, 'success');
        } else if (event.type === 'error') {
          this.isIndexing(false);
          this.toasts?.show?.(`Indexing error: ${event.error}`, 'error');
        }
      },
    });

    this.isIndexing(true);
    this.indexingProgress(0);

    try {
      await this.indexingWorker.indexAllFolders(foldersToIndex);
    } catch (error) {
      console.error('Background indexing failed:', error);
      this.toasts?.show?.('Indexing failed', 'error');
      this.isIndexing(false);
    }
  }

  stopBackgroundIndexing() {
    if (this.indexingWorker) {
      this.indexingWorker.stop();
      this.isIndexing(false);
      this.indexingProgress(0);
      this.toasts?.show?.('Indexing stopped', 'info');
    }
  }

  async rebuildFullSearchIndex() {
    console.log('rebuildFullSearchIndex called');

    // Clear existing index
    await this.searchService.reset([]);
    this.searchIndexLoaded = false;
    this.indexCount(0);
    this.indexSize(0);

    // Clear cached bodies if body indexing is disabled
    if (!this.bodyIndexingEnabled()) {
      try {
        await db.messageBodies.where('account').equals(this.getAccountKey()).delete();
      } catch (err) {
        console.warn('Failed to clear message bodies:', err);
      }
    }

    // Start fresh indexing
    await this.startBackgroundIndexing();
  }

  async loadSavedSearches() {
    try {
      const searches = await this.savedSearchService.getAll();
      this.savedSearches(searches || []);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    }
  }

  async saveCurrentSearch(name) {
    const query = this.query();
    if (!query || !name) {
      this.toasts?.show?.('Please enter a search query and name', 'error');
      return;
    }

    try {
      await this.savedSearchService.save(name, query, {
        folder: this.selectedFolder(),
        crossFolder: false,
      });
      await this.loadSavedSearches();
      this.toasts?.show?.(`Search "${name}" saved`, 'success');
    } catch (error) {
      console.error('Failed to save search:', error);
      this.toasts?.show?.('Failed to save search', 'error');
    }
  }

  async loadSavedSearch(savedSearch) {
    if (!savedSearch) return;

    this.query(savedSearch.query);
    if (savedSearch.folder && !savedSearch.crossFolder) {
      this.selectedFolder(savedSearch.folder);
    }
  }

  async deleteSavedSearch(savedSearch) {
    if (!savedSearch?.name) return;

    try {
      await this.savedSearchService.delete(savedSearch.name);
      await this.loadSavedSearches();
      this.toasts?.show?.(`Search "${savedSearch.name}" deleted`, 'success');
    } catch (error) {
      console.error('Failed to delete saved search:', error);
      this.toasts?.show?.('Failed to delete search', 'error');
    }
  }

  // Indexing policy presets
  getIndexingPolicies() {
    return {
      LIGHT: {
        maxMessages: 1000,
        maxAgeDays: 30,
        includeBody: false,
        description: 'Fast & lightweight - indexes last 1,000 messages (30 days)',
        estimatedStorage: '~50 MB',
      },
      STANDARD: {
        maxMessages: 5000,
        maxAgeDays: 90,
        includeBody: false,
        description: 'Balanced - indexes last 5,000 messages (90 days)',
        estimatedStorage: '~200 MB',
      },
      POWER: {
        maxMessages: 20000,
        maxAgeDays: 365,
        includeBody: true,
        description: 'Maximum search - indexes last 20,000 messages (1 year) with body content',
        estimatedStorage: '~1-2 GB',
      },
      CUSTOM: {
        maxMessages: this.maxIndexMessages(),
        maxAgeDays: this.maxIndexAgeDays(),
        includeBody: this.bodyIndexingEnabled(),
        description: 'Custom settings',
        estimatedStorage: 'Varies',
      },
    };
  }

  applyIndexingPolicy(policy) {
    const policies = this.getIndexingPolicies();
    const selected = policies[policy];

    if (!selected || policy === 'CUSTOM') return;

    this.maxIndexMessages(selected.maxMessages);
    this.maxIndexAgeDays(selected.maxAgeDays);

    if (selected.includeBody !== this.bodyIndexingEnabled()) {
      this.toggleBodyIndexing(selected.includeBody);
    }

    console.log('Applied indexing policy:', policy, selected);
  }

  async checkStorageQuota() {
    if (!navigator.storage?.estimate) {
      return { usage: 0, quota: 0, percentUsed: 0, available: 0, supported: false };
    }

    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;

      // Update warning level
      if (percentUsed >= 95) {
        this.storageWarningLevel('critical');
      } else if (percentUsed >= 85) {
        this.storageWarningLevel('critical');
      } else if (percentUsed >= 70) {
        this.storageWarningLevel('warning');
      } else {
        this.storageWarningLevel('ok');
      }

      return {
        usage,
        quota,
        percentUsed,
        available: quota - usage,
        supported: true,
      };
    } catch (error) {
      console.error('Failed to check storage quota:', error);
      return { usage: 0, quota: 0, percentUsed: 0, available: 0, supported: false };
    }
  }

  async performAutoCleanup() {
    if (!this.autoCleanupEnabled()) {
      console.log('Auto-cleanup disabled');
      return;
    }

    const quota = await this.checkStorageQuota();

    if (!quota.supported) {
      console.log('Storage API not supported, skipping cleanup');
      return;
    }

    if (quota.percentUsed < 70) {
      console.log('Storage usage OK, no cleanup needed');
      return;
    }

    console.log('Storage usage high, performing cleanup:', quota.percentUsed + '%');

    try {
      const account = this.getAccountKey();
      const cutoffDate = Date.now() - this.maxIndexAgeDays() * 24 * 60 * 60 * 1000;

      // Clean up old message bodies
      const deletedBodies = await db.messageBodies
        .where('account')
        .equals(account)
        .and((body) => body.updatedAt < cutoffDate)
        .delete();

      console.log('Cleaned up', deletedBodies, 'old message bodies');

      // Clean up old cached messages beyond the limit
      const allMessages = await db.messages
        .where('account')
        .equals(account)
        .reverse()
        .sortBy('date');

      if (allMessages.length > this.maxIndexMessages()) {
        const toDelete = allMessages.slice(this.maxIndexMessages());
        await db.messages.bulkDelete(toDelete.map((m) => [account, m.id]));
        console.log('Cleaned up', toDelete.length, 'old cached messages');
      }

      // Rebuild search index with current limits
      await this.rebuildFullSearchIndex();

      this.toasts?.show?.('Cleaned up old cached data to free storage', 'success');
    } catch (error) {
      console.error('Auto-cleanup failed:', error);
      this.toasts?.show?.('Failed to clean up storage', 'error');
    }
  }

  async performCrossFolderSearch(query) {
    if (!query || !query.trim()) {
      this.crossFolderResults([]);
      return;
    }

    console.log('Performing cross-folder search for:', query);
    this.loadingCrossFolderSearch(true);

    try {
      // Use searchAllFolders which returns results with folder info
      const indexResults = await this.searchService.searchAllFolders(query, 100);

      if (!indexResults || indexResults.length === 0) {
        console.log('No results found in index');
        this.crossFolderResults([]);
        this.loadingCrossFolderSearch(false);
        return;
      }

      console.log('Found', indexResults.length, 'results in index');

      // Load message details from IndexedDB in the background
      const account = this.getAccountKey();
      const messageIds = indexResults.map((r) => r.id);

      // Batch fetch from IndexedDB
      const cachedMessages = await db.messages
        .where('[account+id]')
        .anyOf(messageIds.map((id) => [account, id]))
        .toArray();

      const messageMap = new Map(cachedMessages.map((m) => [m.id, m]));

      // Merge index results with cached message data
      const results = indexResults.map((indexResult) => {
        const cached = messageMap.get(indexResult.id);
        return (
          cached || {
            id: indexResult.id,
            folder: indexResult.folder,
            subject: indexResult.subject,
            from: indexResult.from,
            date: indexResult.date,
            snippet: '...',
            _searchOnly: true, // Mark as search-only result
          }
        );
      });

      this.crossFolderResults(results);
      console.log('Cross-folder search complete:', results.length, 'results');
    } catch (error) {
      console.error('Cross-folder search failed:', error);
      this.toasts?.show?.('Search failed', 'error');
      this.crossFolderResults([]);
    } finally {
      this.loadingCrossFolderSearch(false);
    }
  }
}
