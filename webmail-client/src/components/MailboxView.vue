<template>
  <div class="fe-mailbox-wrapper">
    <!-- Header -->
    <div class="fe-mailbox-header">
      <button class="fe-nav-toggle" type="button" aria-label="Toggle sidebar" @click="toggleSidebar">☰</button>
      <div class="fe-mailbox-header-right">
        <div class="fe-search-group" style="flex:1; justify-content:flex-start;">
          <input
            type="search"
            class="fe-search"
            placeholder="Search mail"
            v-model="query"
            @input="onSearch"
          />
        </div>
        <div class="fe-toolbar-actions">
          <span v-if="syncPending > 0" class="fe-badge fe-badge-outline">{{ syncPending }} queued</span>
          <button class="fe-button ghost fe-icon-btn" type="button" title="Contacts" @click="navigate('/contacts')">
            <svg class="fe-icon-svg" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          </button>
          <button class="fe-button ghost fe-icon-btn" type="button" title="Calendar" @click="navigate('/calendar')">
            <svg class="fe-icon-svg" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          </button>
          <button class="fe-button ghost fe-icon-btn fe-settings-btn" type="button" title="Settings" @click="navigate('/mailbox/settings')">
            <svg class="fe-icon-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0A1.65 1.65 0 0 0 10.91 3V3a2 2 0 0 1 4 0v.09c0 .66.38 1.26.97 1.54h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="fe-alert error">{{ error }}</div>

    <div class="fe-sidebar-backdrop" :class="{ visible: sidebarOpen }" @click="toggleSidebar"></div>

    <div class="fe-mailbox-shell">
      <!-- Sidebar with folders -->
      <aside class="fe-folders" :class="{ 'fe-folders-open': sidebarOpen }">
        <div class="fe-folder-actions">
          <button class="fe-button fe-compose" type="button" @click="composeModal?.open()">
            <svg class="fe-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
            <span>Compose</span>
          </button>
        </div>
        <div class="fe-account-actions fe-dropdown" style="position:relative;">
          <button class="fe-button ghost" type="button" style="justify-content: space-between;" @click="toggleAccountMenu">
            <span>{{ currentAccount }}</span>
            <span aria-hidden="true">▾</span>
          </button>
          <div
            class="fe-action-menu-panel"
            v-show="accountMenuOpen"
            style="min-width:100%; width:100%; left:0; right:auto;"
          >
            <button type="button" @click="addAccount">
              <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span>Add account</span>
            </button>
            <div class="fe-menu-divider"></div>
            <button type="button" class="fe-menu-danger" @click="signOut">
              <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              <span>Sign out</span>
            </button>
          </div>
        </div>
        <nav class="fe-folder-list">
          <button
            v-for="folder in folders"
            :key="folder.path"
            class="fe-folder"
            :class="{ active: selectedFolder === folder.path }"
            @click="selectFolder(folder.path)"
          >
            <span>{{ folder.name }}</span>
            <span v-if="folder.count > 0" class="fe-badge">{{ folder.count }}</span>
          </button>
        </nav>
      </aside>

      <!-- Message list -->
      <section class="fe-messages">
        <div class="fe-section-header">
          <span>{{ selectedFolder }}</span>
          <div class="fe-list-actions">
            <button class="fe-button ghost fe-icon-btn" type="button" title="Refresh" @click="loadMessages">
              <svg class="fe-icon-svg" viewBox="0 0 24 24" aria-hidden="true">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10" />
                <path d="M20.49 15a9 9 0 0 1-14.13 3.36L1 14" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="loading" class="fe-empty">Loading messages…</div>
        <div v-else-if="conversations.length === 0" class="fe-empty">No messages</div>
        <ul v-else class="fe-conversation-list">
          <li
            v-for="conversation in conversations"
            :key="conversation.id"
            class="fe-conversation-item"
            :class="{
              'fe-unread': conversation.hasUnread,
              active: selectedMessage && selectedMessage.id === conversation.id
            }"
            @click="selectConversation(conversation)"
          >
            <div class="fe-conversation-header">
              <div class="fe-conversation-meta">
                <span class="fe-conversation-from">{{ conversation.latestFrom }}</span>
              </div>
              <span class="fe-conversation-date">{{ conversation.latestDate }}</span>
            </div>
            <div class="fe-conversation-subject">{{ conversation.displaySubject }}</div>
            <div class="fe-conversation-preview">{{ conversation.preview }}</div>
          </li>
        </ul>
      </section>

      <!-- Message reader -->
      <div class="fe-reader">
        <div v-if="messageLoading" class="fe-empty">Loading…</div>
        <div v-else-if="selectedMessage" class="fe-reader-content">
          <div class="fe-reader-header">
            <div class="fe-reader-subject">{{ selectedMessage.subject }}</div>
            <div class="fe-reader-from">From: {{ selectedMessage.from }}</div>
            <div class="fe-reader-date">{{ selectedMessage.date }}</div>
          </div>
          <div class="fe-reader-actions">
            <div class="fe-chip ghost">{{ selectedMessage.folder || selectedFolder }}</div>
            <div class="fe-chip ghost" v-if="false">Decrypted</div>
            <button
              type="button"
              class="fe-button ghost fe-icon-btn"
              aria-label="Reply"
              title="Reply"
              @click="replyTo(selectedMessage)"
            >
              <svg class="fe-icon-svg" viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
            </button>
            <div class="fe-action-menu" :class="{ open: actionMenuOpen }">
              <button
                type="button"
                class="fe-button ghost fe-icon-btn"
                aria-label="Message actions"
                @click="toggleActionMenu"
              >
                ⋯
              </button>
              <div class="fe-action-menu-panel" v-show="actionMenuOpen">
                <button type="button" @click="replyTo(selectedMessage)">
                  <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                  <span>Reply</span>
                </button>
                <button type="button" @click="forwardMessage(selectedMessage)">
                  <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 17 20 12 15 7"></polyline><path d="M4 18v-2a4 4 0 0 1 4-4h12"></path></svg>
                  <span>Forward</span>
                </button>
                <button type="button" @click="toggleRead(selectedMessage)">
                  <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span>{{ selectedMessage.is_unread ? 'Mark Read' : 'Mark Unread' }}</span>
                </button>
                <div class="fe-menu-divider"></div>
                <button type="button" @click="deleteMessage(selectedMessage)">
                  <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  <span>Delete</span>
                </button>
                <button type="button" @click="downloadOriginal(selectedMessage)">
                  <svg class="fe-menu-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  <span>Download original</span>
                </button>
              </div>
            </div>
          </div>
          <div class="fe-reader-body" v-html="messageBody"></div>
        </div>
        <div v-else class="fe-empty">Select a message to read</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';
import { db } from '../utils/db';
import { sanitizeHtml } from '../utils/sanitize';

const props = defineProps({
  navigate: Function,
  composeModal: Object,
  passphraseModal: Object,
  toasts: Object
});

const email = ref(Local.get('email') || '');
const folders = ref([]);
const selectedFolder = ref('');
const messages = ref([]);
const selectedMessage = ref(null);
const loading = ref(false);
const messageLoading = ref(false);
const error = ref('');
const messageBody = ref('');
const page = ref(1);
const limit = 20;
const hasNextPage = ref(false);
const query = ref('');
const sidebarOpen = ref(true);
const syncPending = ref(0);
const bodyIndexingEnabled = ref(Local.get('search_body_index') !== '0');
const indexCount = ref(0);
const indexSize = ref(0);
const localUsage = ref(0);
const localQuota = ref(0);
const threadingEnabled = ref(Local.get('threading_enabled') !== 'false');
const accountMenuOpen = ref(false);
const currentAccount = ref(Local.get('email') || '');
const actionMenuOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const selectFolder = async (folderPath) => {
  selectedFolder.value = folderPath;
  page.value = 1;
  await loadMessages();
  if (window.innerWidth <= 820) {
    sidebarOpen.value = false;
  }
};

const selectMessage = async (message) => {
  selectedMessage.value = message;
  actionMenuOpen.value = false;
  await loadMessage(message);
};

const onSearch = (event) => {
  query.value = event.target?.value || query.value;
};

const toggleAccountMenu = () => {
  accountMenuOpen.value = !accountMenuOpen.value;
};

const addAccount = () => {
  accountMenuOpen.value = false;
  window.location.href = '/';
};

const signOut = () => {
  Local.clear();
  window.location.href = '/';
};

const toggleActionMenu = () => {
  actionMenuOpen.value = !actionMenuOpen.value;
};

const replyTo = (message) => {
  props.toasts?.show?.('Reply not implemented yet', 'info');
  actionMenuOpen.value = false;
};

const forwardMessage = (message) => {
  props.toasts?.show?.('Forward not implemented yet', 'info');
  actionMenuOpen.value = false;
};

const toggleRead = (message) => {
  if (!message) return;
  const targetId = message.id;
  const updated = messages.value.map((m) =>
    m.id === targetId ? { ...m, is_unread: !m.is_unread } : m
  );
  messages.value = updated;
  if (selectedMessage.value?.id === targetId) {
    selectedMessage.value = { ...selectedMessage.value, is_unread: !selectedMessage.value.is_unread };
  }
  props.toasts?.show?.('Updated read state', 'success');
  actionMenuOpen.value = false;
};

const deleteMessage = (message) => {
  if (!message) return;
  messages.value = messages.value.filter((m) => m.id !== message.id);
  if (selectedMessage.value?.id === message.id) {
    selectedMessage.value = null;
    messageBody.value = '';
  }
  props.toasts?.show?.('Message removed (not yet synced)', 'info');
  actionMenuOpen.value = false;
};

const downloadOriginal = (message) => {
  if (!message?.id) return;
  const url = `/v1/messages/${encodeURIComponent(message.id)}/original`;
  window.open(url, '_blank', 'noopener');
  actionMenuOpen.value = false;
};

const conversations = computed(() => {
  const q = (query.value || '').toLowerCase();
  return messages.value
    .filter((m) => {
      if (!q) return true;
      return (
        m.from?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.snippet?.toLowerCase().includes(q)
      );
    })
    .map((m) => ({
      id: m.id,
      latestFrom: m.from,
      displaySubject: m.subject,
      preview: m.snippet,
      latestDate: m.date,
      hasUnread: !!m.is_unread,
      message: m
    }));
});

const selectConversation = (conversation) => {
  if (!conversation) return;
  selectMessage(conversation.message);
};

const load = async () => {
  try {
    // Load folders
    const foldersRes = await Remote.request('Folders', {});
    const foldersRaw = foldersRes?.Result || foldersRes || [];
    const foldersList = Array.isArray(foldersRaw) ? foldersRaw : foldersRaw.Items || foldersRaw.items || [];

    folders.value = foldersList.map(f => ({
      path: f.path || f.Path || f.fullName || f.FullName || 'INBOX',
      name: f.name || f.Name || f.path || 'Folder',
      count: f.Unread || f.unread || f.unseen || 0
    }));

    if (!selectedFolder.value && folders.value.length > 0) {
      const inbox = folders.value.find(f => f.path?.toUpperCase() === 'INBOX');
      selectedFolder.value = inbox?.path || folders.value[0].path;
    }

    await loadMessages();
  } catch (err) {
    error.value = err?.message || 'Unable to load mailbox.';
  }
};

const loadMessages = async () => {
  loading.value = true;
  error.value = '';
  messages.value = [];
  selectedMessage.value = null;

  try {
    const messagesRes = await Remote.request('MessageList', {
      folder: selectedFolder.value,
      page: page.value,
      limit
    });

    const list = messagesRes?.Result?.List || messagesRes?.Result || messagesRes || [];
    messages.value = list.map(m => ({
      id: m.Uid || m.id || m.uid,
      folder: m.folder_path || m.folder || selectedFolder.value,
      from: m.From?.Display || m.From?.Email || m.from || 'Unknown',
      subject: m.Subject || m.subject || '(No subject)',
      snippet: m.Plain?.slice?.(0, 140) || m.snippet || '',
      date: m.Date || m.date || '',
      flags: m.flags || [],
      is_unread: m.is_unread ?? true,
      has_attachment: m.has_attachment || false
    }));

    if (messages.value.length > 0) {
      selectedMessage.value = messages.value[0];
      await loadMessage(messages.value[0]);
    }
  } catch (err) {
    error.value = err?.message || 'Unable to load messages.';
  } finally {
    loading.value = false;
  }
};

const loadMessage = async (message) => {
  if (!message) return;
  messageLoading.value = true;
  messageBody.value = '';

  try {
    // Use pathOverride to get a specific message by ID
    const detailRes = await Remote.request('Message', {}, {
      pathOverride: `/v1/messages/${encodeURIComponent(message.id)}?folder=${encodeURIComponent(message.folder)}`
    });

    console.log('Message detail response:', detailRes);
    const result = detailRes?.Result || detailRes;

    // Check nodemailer object for body content
    const nodemailer = result?.nodemailer;
    console.log('Nodemailer object:', nodemailer);

    // Try all possible body field names
    const rawBody = nodemailer?.html || nodemailer?.textAsHtml ||
                    nodemailer?.text ||
                    result?.html || result?.Html ||
                    result?.text || result?.Text ||
                    result?.Plain || result?.plain ||
                    result?.body || result?.Body ||
                    message.snippet || '';

    console.log('Available fields:', Object.keys(result || {}));
    console.log('Raw body length:', rawBody?.length);
    console.log('Raw body preview:', rawBody?.substring?.(0, 200));
    messageBody.value = sanitizeHtml(rawBody);
  } catch (err) {
    console.error('Failed to load message:', err);
    messageBody.value = sanitizeHtml(message.snippet || '<p>Failed to load message content.</p>');
  } finally {
    messageLoading.value = false;
  }
};

const toggleBodyIndexing = (enabled) => {
  bodyIndexingEnabled.value = enabled;
  Local.set('search_body_index', enabled ? '1' : '0');
};

const rebuildSearchFromCache = async () => {
  props.toasts?.show?.('Rebuild index not yet fully implemented', 'info');
};

onMounted(() => {
  load();
});

defineExpose({
  load,
  bodyIndexingEnabled,
  indexCount,
  indexSize,
  syncPending,
  localUsage,
  localQuota,
  threadingEnabled,
  toggleBodyIndexing,
  rebuildSearchFromCache
});
</script>

<style>
/* MailboxView specific overrides - most styles are in app.css */
</style>
