import ko from 'knockout';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';
import { config } from '../config';
import { sanitizeHtml } from '../utils/sanitize';
import * as openpgp from 'openpgp';
import PostalMime from 'postal-mime';
import FlexSearch from 'flexsearch';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { db } from '../utils/db';
import { groupIntoConversations, deduplicateMessages, buildConversationTree, flattenConversationTree } from '../utils/threading';

function bufferToDataUrl(attachment) {
  try {
    const { content, contentType, mimeType, type } = attachment || {};
    if (!content) return '';
    const mime = contentType || mimeType || type || 'application/octet-stream';
    // content can be Buffer-like (Uint8Array/ArrayBuffer) or string
    let base64;
    if (typeof content === 'string') {
      const isB64 = /^[A-Za-z0-9/+]+={0,2}$/.test(content.replace(/\s+/g, ''));
      base64 = isB64 ? content.replace(/\s+/g, '') : btoa(unescape(encodeURIComponent(content)));
    } else if (content instanceof ArrayBuffer) {
      const view = new Uint8Array(content);
      base64 = btoa(String.fromCharCode(...view));
    } else if (ArrayBuffer.isView(content)) {
      const view = new Uint8Array(content.buffer);
      base64 = btoa(String.fromCharCode(...view));
    } else if (content?.data) {
      base64 = btoa(String.fromCharCode(...content.data));
    } else if (Array.isArray(content)) {
      base64 = btoa(String.fromCharCode(...content));
    } else {
      return '';
    }
    return `data:${mime};base64,${base64}`;
  } catch (error) {
    console.error('bufferToDataUrl failed', error);
    return '';
  }
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
    const size = att.size ?? (att.content ? att.content.length : 0);
    // Skip tiny placeholder attachments (e.g., "Version: 1" blocks)
    if (!att.href && size <= 24) return false;
    // Skip nameless tiny attachments
    if (!att.href && size <= 64 && (!name || name.toLowerCase() === 'attachment')) return false;
    return att.href || size > 0;
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
    this.searchIndex = null;
    this.toasts = null;
    this.storageUsed = ko.observable(0);
    this.storageTotal = ko.observable(0);
    this.searchTimer = null;
    this.sidebarOpen = ko.observable(typeof window !== 'undefined' ? window.innerWidth > 820 : true);
    this.isDesktop = ko.observable(typeof window !== 'undefined' ? window.innerWidth > 820 : true);
    // Threading
    this.threadingEnabled = ko.observable(Local.get('threading_enabled') !== 'false'); // enabled by default
    this.conversations = ko.observableArray([]);
    this.selectedConversation = ko.observable(null);
    this.expandedConversations = ko.observable(new Set()); // Track which conversations are expanded
    this.accountMenuOpen = ko.observable(false);
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
    this.defaultFolders = [
      { path: 'INBOX', name: 'Inbox', icon: 'inbox' },
      { path: 'Drafts', name: 'Drafts', icon: 'drafts' },
      { path: 'Sent Mail', name: 'Sent Mail', icon: 'sent' },
      { path: 'Archive', name: 'Archive', icon: 'archive' },
      { path: 'Spam', name: 'Spam', icon: 'spam' },
      { path: 'Trash', name: 'Trash', icon: 'trash' },
      { path: 'Outbox', name: 'Outbox', icon: 'outbox' }
    ];

    this.filteredMessages = ko.pureComputed(() => {
      const folder = this.selectedFolder();
      const q = (this.query() || '').trim();
    let list = this.messages().filter((msg) => msg.folder === folder);
    if (this.unreadOnly()) list = list.filter((m) => m.is_unread);
    if (this.hasAttachmentsOnly()) list = list.filter((m) => m.has_attachment);
      if (!q || !this.searchIndex) return list;
      const results = this.searchIndex.search(q, { enrich: true });
      const ids = new Set();
      const hits = [];
      results.forEach((res) => {
        const arr = res?.result || res || [];
        arr.forEach((id) => {
          if (ids.has(id)) return;
          const msg = list.find((m) => m.id === id);
          if (msg) {
            ids.add(id);
            hits.push(msg);
          }
        });
      });
      return hits;
    });
    this.availableMoveTargets = ko.pureComputed(() =>
      this.folders().filter((f) => f.path !== this.selectedFolder())
    );
    this.unreadCounts = {};

    this.selectedFolder.subscribe(() => {
      const firstOther = this.availableMoveTargets()[0];
      if (firstOther) this.moveTarget(firstOther.path);
      this.actionMenuOpen(false);
    });
  }

  updateFolderUnread(folderPath, count) {
    if (!folderPath) return;
    const key = folderPath.toLowerCase();
    this.unreadCounts[key] = typeof count === 'number' ? count : 0;
    this.folders(
      this.folders().map((f) =>
        f.path?.toLowerCase() === key ? { ...f, count: this.unreadCounts[key] } : f
      )
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

  signOut = () => {
    Local.clear();
    window.location.href = '/';
  };

  initListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize);
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
    // Placeholder: redirect to login to add another account
    this.accountMenuOpen(false);
    window.location.href = '/';
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

    try {
      // Try cached folders first
      const cachedFolders = await db.folders.toArray();
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
      await db.folders.clear();
      await db.folders.bulkAdd(
        mappedFolders.map((f) => ({ ...f, updatedAt: Date.now() }))
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

    this.loading(true);
    this.error('');
    this.messageBody('');
    this.selectedMessage(null);
    this.messages([]);
    this.searchIndex = null;

    let cached = [];
    try {
      // seed from cache for instant UI
      cached = await db.messages.where('folder').equals(this.selectedFolder()).toArray();
      if (cached?.length) {
        this.messages(cached);
        this.rebuildSearchIndex(cached);
        this.selectedMessage(cached[0] || null);
      }

      const messagesRes = await Remote.request('MessageList', {
        folder: this.selectedFolder(),
        page: this.page(),
        limit: this.limit,
        ...(this.query() ? { search: this.query() } : {}),
        ...(this.unreadOnly() ? { is_unread: true } : {}),
        ...(this.hasAttachmentsOnly() ? { has_attachment: true } : {})
      });

      const list = messagesRes?.Result?.List || messagesRes?.Result || messagesRes || [];
      this.hasNextPage(Array.isArray(list) && list.length >= this.limit);

      if (Array.isArray(list) && list.length > 0) {
        this.messages(
          list.map((m) => ({
            id: m.Uid || m.id || m.uid,
            folder: m.folder_path || m.folder || m.path || this.selectedFolder(),
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
              (m.nodemailer?.textAsHtml || m.nodemailer?.text) ||
              '',
            date: this.formatDate(
              m.Date || m.date || m.header_date || m.internal_date || ''
            ),
            flags: normalizeFlags(m.flags),
            is_unread: m.is_unread ?? !normalizeFlags(m.flags).includes('\\Seen'),
            has_attachment: m.has_attachment || m.hasAttachments || false
          }))
        );
        // persist to cache (list only)
        await db.messages
          .where('folder')
          .equals(this.selectedFolder())
          .delete();
        await db.messages.bulkAdd(
          this.messages().map((msg) => ({ ...msg, updatedAt: Date.now() }))
        );
        this.rebuildSearchIndex(this.messages());

        // Group messages into conversations if threading is enabled
        if (this.threadingEnabled()) {
          const conversations = groupIntoConversations(this.messages());
          this.conversations(conversations);
        } else {
          this.conversations([]);
        }

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
        this.selectedMessage(this.messages()[0] || null);
        if (this.selectedMessage()) await this.loadMessage(this.selectedMessage());
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

    this.messageLoading(true);
      this.messageBody('');
      this.attachments([]);
      this.pgpStatus('');

    try {
      // try cached body first
      const cached = await db.messages.get(message.id);
      if (cached?.body) {
        this.messageBody(sanitizeHtml(cached.body));
        this.attachments(sanitizeAttachments(cached.attachments));
      }

      const detailRes = await Remote.request(
        'Message',
        {
          id: message.id,
          folder: message.folder
        },
        { pathOverride: `/v1/messages/${encodeURIComponent(message.id)}` }
      );

      const result = detailRes?.Result || detailRes;
      const detailFlags = normalizeFlags(result?.flags || message.flags);
      const isUnread = result?.is_unread ?? !detailFlags.includes('\\Seen');
      message.flags = detailFlags;
      message.is_unread = isUnread;
      const detailAttachments = result?.nodemailer?.attachments || result?.attachments || [];
      const attachments = (detailAttachments || []).map((att) => ({
        name: att.name || att.filename,
        filename: att.filename,
        size: att.size,
        contentId: att.cid || att.contentId,
        // TODO: prefer API-provided download URL or cid mapping when available.
        href: bufferToDataUrl(att),
        contentType: att.contentType || att.mimeType || att.type,
        content: att.content
      }));
      this.attachments(sanitizeAttachments(attachments));

      const rawBody =
        result?.html ||
        result?.Html ||
        result?.textAsHtml ||
        result?.text ||
        result?.Plain ||
        result?.body ||
        result?.preview ||
        result?.nodemailer?.html ||
        result?.nodemailer?.textAsHtml ||
        result?.nodemailer?.text ||
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
            this.messageBody(`<div class="fe-message-canvas">${sanitizeHtml(parsed.body)}</div>`);
            this.attachments(sanitizeAttachments(parsed.attachments));
            await db.messages.put({
              ...(cached || message),
              id: message.id,
              folder: message.folder,
              body: parsed.body,
              attachments: sanitizeAttachments(parsed.attachments),
              updatedAt: Date.now()
            });
          } else {
            this.messageBody(sanitizeHtml(this.normalizeDecrypted(decrypted)));
          }
        } else {
          this.pgpStatus('PGP encrypted – unable to decrypt with current keys');
          this.messageBody(
            `<pre style="white-space:pre-wrap">${sanitizeHtml(pgpPayload)}</pre>`
          );
        }
      } else {
        this.pgpStatus('');
        const parsed = await this.parseWithPostalMime(rawBody, attachments);
        if (parsed) {
          this.messageBody(`<div class="fe-message-canvas">${sanitizeHtml(parsed.body)}</div>`);
          this.attachments(sanitizeAttachments(parsed.attachments));
          await db.messages.put({
            ...(cached || message),
            id: message.id,
            folder: message.folder,
            body: parsed.body,
            attachments: sanitizeAttachments(parsed.attachments),
            updatedAt: Date.now()
          });
        } else {
          const inlinedBody = applyInlineAttachments(rawBody, attachments);
          this.messageBody(`<div class="fe-message-canvas">${sanitizeHtml(inlinedBody)}</div>`);
        }
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
        const cachedBody = await db.messages.get(message?.id);
        if (cachedBody?.body) {
          this.messageBody(sanitizeHtml(cachedBody.body));
          this.attachments(sanitizeAttachments(cachedBody.attachments));
        } else {
          this.messageBody(sanitizeHtml(message.snippet || ''));
        }
      }
      this.pgpStatus('');
    } finally {
      this.messageLoading(false);
      this.actionMenuOpen(false);
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

    try {
      await Remote.request(
        'Message',
        {
          id: message.id,
          folder: message.folder,
          flags: Array.from(newFlags)
        },
        { method: 'PUT', pathOverride: `/v1/messages/${encodeURIComponent(message.id)}` }
      );
    } catch (error) {
      // revert on failure
      if (hasSeen) newFlags.add('\\Seen');
      else newFlags.delete('\\Seen');
      message.flags = Array.from(newFlags);
      message.is_unread = !newIsUnread;
      this.messages.valueHasMutated?.();
      this.selectedMessage(Object.assign({}, message));
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      this.error(error?.message || 'Unable to update message flags.');
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

  rebuildSearchIndex(list = []) {
    try {
      this.searchIndex = new FlexSearch.Document({
        document: {
          id: 'id',
          index: ['subject', 'from', 'snippet']
        },
        tokenize: 'forward',
        context: true
      });
      (list || []).forEach((m) => {
        this.searchIndex.add({
          id: m.id,
          subject: m.subject || '',
          from: m.from || '',
          snippet: m.snippet || ''
        });
      });
    } catch (error) {
      console.warn('search index build failed', error);
      this.searchIndex = null;
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
            contentType: att.mimeType || att.contentType || 'application/octet-stream'
          }),
          contentType: att.mimeType || att.contentType || 'application/octet-stream'
        })) || [];
      const merged = [...existingAttachments, ...attachments].filter(
        (att) => !/\.asc$/i.test(att.filename || att.name || '')
      );
      const body =
        email.html ||
        (email.text ? `<pre style="white-space:pre-wrap">${email.text}</pre>` : raw);
      const inlined = applyInlineAttachments(body, merged);
      return { body: inlined, attachments: merged };
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
            passphrase
          });
          this.cachePassphrase(key.name, passphrase, false);
        }
        const message = await openpgp.readMessage({ armoredMessage: armored });
        const { data, signatures } = await openpgp.decrypt({
          message,
          decryptionKeys: unlocked
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

  async parseWithMailparser(rawString) {
    return null;
  }

  async deleteMessage(message) {
    if (!message?.id) return;
    try {
      await Remote.request(
        'MessageDelete',
        {},
        { method: 'DELETE', pathOverride: `/v1/messages/${encodeURIComponent(message.id)}` }
      );
      this.messages.remove((m) => m.id === message.id);
      this.selectedMessage(null);
      this.messageBody('');
      this.attachments([]);
      this.updateUnreadCountFromList();
      this.toasts?.show('Message deleted', 'success');
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      this.error(error?.message || 'Unable to delete message.');
      this.toasts?.show(this.error(), 'error');
    }
    this.actionMenuOpen(false);
  }

  async moveMessage(message, targetOverride) {
    if (!message?.id) return;
    const target = targetOverride || this.moveTarget();
    if (!target || target === message.folder) return;
    try {
      await Remote.request(
        'MessageUpdate',
        { folder: target },
        { method: 'PUT', pathOverride: `/v1/messages/${encodeURIComponent(message.id)}` }
      );
      // Navigate to the target folder and refresh to stay in sync
      this.selectedFolder(target);
      this.page(1);
      await this.loadMessages();
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        window.location.href = '/';
        return;
      }
      this.error(error?.message || 'Unable to move message.');
    }
    this.actionMenuOpen(false);
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
        `<p><br></p><blockquote>${this.messageBody()}</blockquote>`
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
      this.composeModal.editorView.commands.setContent(
        `<p><br></p><hr>${this.messageBody()}`
      );
    }
    if (this.composeModal.focusEditorStart) this.composeModal.focusEditorStart();
    this.actionMenuOpen(false);
  }

  async downloadOriginal(message) {
    if (!message?.id) return;
    try {
      const aliasAuth = Local.get('alias_auth');
      if (!aliasAuth) throw new Error('Missing auth');
      const url = `${config.apiBase}/v1/messages/${encodeURIComponent(
        message.id
      )}?eml=true`;
      const res = await fetch(url, {
        headers: { Authorization: `Basic ${btoa(aliasAuth)}` }
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
            (c.emails && c.emails[0]?.value) ||
            (c.Emails && c.Emails[0]?.value) ||
            c.email ||
            '';
          if (!email) return null;
          const name = c.full_name || c.FullName || c.name || '';
          return name ? `${name} <${email}>` : email;
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
    } catch (error) {
      // non-blocking
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
      specialUse: f.special_use || f.SpecialUse
    }));

    const map = new Map();
    parsed.forEach((f) => {
      if (!f.path) return;
      map.set(f.path.toLowerCase(), f);
    });

    const ordered = [];
    this.defaultFolders.forEach((def) => {
      const found = map.get(def.path.toLowerCase());
      const merged = {
        ...def,
        ...(found || {}),
        icon: def.icon || found?.icon || 'folder',
        count: found?.count || 0
      };
      ordered.push(merged);
    });

    const extras = parsed.filter(
      (f) => !this.defaultFolders.some((d) => d.path.toLowerCase() === (f.path || '').toLowerCase())
    );
    extras
      .sort((a, b) => (a.name || a.path || '').localeCompare(b.name || b.path || ''))
      .forEach((f) => ordered.push({ ...f, icon: f.icon || 'folder' }));

    return ordered;
  }

  toggleThreading() {
    const newValue = !this.threadingEnabled();
    this.threadingEnabled(newValue);
    Local.set('threading_enabled', newValue ? 'true' : 'false');

    // Re-group messages
    if (newValue) {
      const conversations = groupIntoConversations(this.messages());
      this.conversations(conversations);
    } else {
      this.conversations([]);
    }

    this.toasts?.show(
      newValue ? 'Conversation view enabled' : 'Conversation view disabled',
      'success'
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
      { name: 'Trash', path: 'Trash', count: 0 }
    ];

    const mockMessages = [
      {
        id: 'msg-1',
        folder: 'INBOX',
        from: 'team@forwardemail.net',
        subject: 'Welcome to ForwardEmail Webmail',
        snippet: 'Thanks for trying the new experience. The full mailbox UI is on the way.',
        date: 'Today'
      },
      {
        id: 'msg-2',
        folder: 'INBOX',
        from: 'security@forwardemail.net',
        subject: 'Security tips',
        snippet: 'Remember to enable 2FA on your account and keep recovery codes safe.',
        date: 'Yesterday'
      },
      {
        id: 'msg-3',
        folder: 'INBOX',
        from: 'status@forwardemail.net',
        subject: 'System status',
        snippet: 'All systems operational. Subscribe to status updates for alerts.',
        date: '2d ago'
      }
    ];

    this.folders(this.buildFolderList(mockFolders));
    this.selectedFolder('INBOX');
    this.messages(mockMessages);
    this.selectedMessage(mockMessages[0]);
    this.messageBody(sanitizeHtml(mockMessages[0]?.snippet || ''));
  }
}
