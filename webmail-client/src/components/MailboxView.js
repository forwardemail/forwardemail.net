import ko from 'knockout';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';
import { config } from '../config';
import { sanitizeHtml } from '../utils/sanitize';

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
    this.page = ko.observable(1);
    this.limit = 20;
    this.hasNextPage = ko.observable(false);
    this.query = ko.observable('');
    this.unreadOnly = ko.observable(false);
    this.searchTimer = null;

    this.filteredMessages = ko.pureComputed(() =>
      this.messages().filter((msg) => msg.folder === this.selectedFolder())
    );

    this.setMockData();
  }

  signOut = () => {
    Local.clear();
    window.location.href = '/';
  };

  selectFolder = (folderName) => {
    this.selectedFolder(folderName);
    this.page(1);
    this.loadMessages();
  };

  selectMessage = (message) => {
    this.selectedMessage(message);
    if (message) this.loadMessage(message);
  };

  async load() {
    if (config.useMockWebmail) {
      this.setMockData();
      return;
    }

    try {
      const foldersRes = await Remote.request('Folders', {});
      const foldersRaw = foldersRes?.Result || foldersRes || [];
      const folders = Array.isArray(foldersRaw)
        ? foldersRaw
        : foldersRaw.Items || foldersRaw.items || [];

      const mappedFolders = folders.map((f) => ({
        id: f.id || f.Id,
        path: f.path || f.Path || f.fullName || f.FullName || f.name || 'INBOX',
        name: f.name || f.Name || f.path || f.Path || 'Folder',
        count: f.Unread || f.unread || f.Count || 0,
        specialUse: f.special_use || f.SpecialUse
      }));

      this.folders(mappedFolders);
      if (!this.selectedFolder() && mappedFolders.length > 0) {
        const inbox = mappedFolders.find((f) => f.path?.toUpperCase?.() === 'INBOX');
        this.selectedFolder(inbox?.path || mappedFolders[0].path);
      }

      await this.loadMessages();
    } catch (error) {
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

    try {
      const messagesRes = await Remote.request('MessageList', {
        folder: this.selectedFolder(),
        page: this.page(),
        limit: this.limit,
        ...(this.query() ? { search: this.query() } : {}),
        ...(this.unreadOnly() ? { is_unread: true } : {})
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
            date: m.Date || m.date || m.header_date || m.internal_date || '',
            flags: normalizeFlags(m.flags),
            is_unread: m.is_unread ?? !normalizeFlags(m.flags).includes('\\Seen')
          }))
        );
        this.selectedMessage(this.messages()[0] || null);
        if (this.selectedMessage()) await this.loadMessage(this.selectedMessage());
      }
    } catch (error) {
      this.error(error?.message || 'Unable to load messages.');
    } finally {
      this.loading(false);
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

    try {
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

      const body =
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
      this.messageBody(sanitizeHtml(body));
      // sync the selected message observable with updated flags/unread state
      this.selectedMessage(Object.assign({}, message));
    } catch (error) {
      this.error(error?.message || 'Unable to load message.');
      this.messageBody(sanitizeHtml(message.snippet || ''));
    } finally {
      this.messageLoading(false);
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
      this.error(error?.message || 'Unable to update message flags.');
    }
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

  onSearch = (text) => {
    this.query(text);
    this.page(1);

    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadMessages();
    }, 300);
  };

  toggleUnreadFilter = () => {
    this.unreadOnly(!this.unreadOnly());
    this.page(1);
    this.loadMessages();
  };

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

    this.folders(mockFolders);
    this.selectedFolder('INBOX');
    this.messages(mockMessages);
    this.selectedMessage(mockMessages[0]);
    this.messageBody(sanitizeHtml(mockMessages[0]?.snippet || ''));
  }
}
