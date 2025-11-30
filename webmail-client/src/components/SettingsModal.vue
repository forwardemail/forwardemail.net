<template>
  <div class="fe-mailbox-wrapper">
    <div class="fe-mailbox-header">
      <button class="fe-button ghost fe-icon-btn" type="button" aria-label="Back" title="Back" @click="navigate('/mailbox')">←</button>
      <div class="fe-title-left">
        <h1>Settings</h1>
        <span>{{ aliasEmail }}</span>
      </div>
    </div>

    <div class="fe-settings-shell">
      <div class="fe-settings-layout">
        <aside class="fe-settings-sidebar">
          <div class="fe-settings-sidebar-header">
            <span>Settings</span>
          </div>
          <nav class="fe-settings-nav">
            <a href="#" :class="{ active: section === 'general' }" @click.prevent="section = 'general'">General</a>
            <a href="#" :class="{ active: section === 'accounts' }" @click.prevent="section = 'accounts'">Accounts</a>
            <a href="#" :class="{ active: section === 'appearance' }" @click.prevent="section = 'appearance'">Appearance</a>
            <a href="#" :class="{ active: section === 'security' }" @click.prevent="section = 'security'">Security &amp; Privacy</a>
            <a href="#" :class="{ active: section === 'filters' }" @click.prevent="section = 'filters'">Filters</a>
          </nav>
        </aside>

        <div class="fe-settings-content">
          <!-- General Section -->
          <div v-show="section === 'general'" class="fe-settings-grid">
            <div class="fe-settings-card">
              <h3>Search &amp; storage</h3>
              <label class="fe-settings-row">
                <input type="checkbox" :checked="bodyIndexingEnabled?.value" @change="handleToggleBodyIndexing" />
                <span>Include message bodies in search (uses more local storage)</span>
              </label>
              <div class="fe-settings-meta">Indexed messages: {{ indexCount }}</div>
              <div v-if="indexSize > 0" class="fe-settings-meta">
                Index size ~ {{ (Math.round(indexSize / 1024 / 1024 * 10) / 10) }} MB
              </div>
              <div class="fe-settings-meta">Queued actions: {{ syncPending }}</div>
              <div class="fe-settings-meta">
                Local cache: {{ localUsage ? (Math.round(localUsage / 1024 / 1024 * 10) / 10) + ' MB' : '—' }}
                <span v-if="localQuota">/{{ (Math.round(localQuota / 1024 / 1024 * 10) / 10) }} MB</span>
              </div>
              <div class="fe-settings-actions" style="margin-top:12px;">
                <button class="fe-button ghost" type="button" @click="rebuildIndexConfirm = true">Rebuild index</button>
              </div>
            </div>

            <div class="fe-settings-card">
              <h3>Conversation threading</h3>
              <label class="fe-settings-row">
                <input type="checkbox" :checked="threadingEnabled?.value" @change="e => threadingEnabled.value = e.target.checked" />
                <span>Group messages into conversations</span>
              </label>
              <div class="fe-settings-note">
                Messages in the same thread will be grouped together, similar to Gmail. Recommended for most users.
              </div>
            </div>
          </div>

          <!-- Appearance Section -->
          <div v-show="section === 'appearance'" class="fe-settings-grid">
            <div class="fe-settings-card">
              <h3>Theme</h3>
              <div class="fe-settings-row">
                <label><input type="radio" name="theme" value="system" v-model="theme" @change="handleThemeChange" /> Auto (follow system)</label>
                <label><input type="radio" name="theme" value="light" v-model="theme" @change="handleThemeChange" /> Light</label>
                <label><input type="radio" name="theme" value="dark" v-model="theme" @change="handleThemeChange" /> Dark</label>
              </div>
            </div>
          </div>

          <!-- Security Section -->
          <div v-show="section === 'security'" class="fe-settings-grid">
            <div class="fe-settings-card">
              <h3>PGP encryption</h3>
              <div class="fe-settings-meta">
                Signed in as <strong>{{ aliasEmail }}</strong>
              </div>
              <div class="fe-settings-row" style="justify-content: space-between;">
                <div class="fe-settings-note" style="margin:0;">PGP encryption keys</div>
                <button class="fe-button ghost" type="button" @click="openKeyForm">Add key</button>
              </div>
              <div class="fe-key-list">
                <div v-for="(key, idx) in pgpKeys" :key="idx" class="fe-key-row">
                  <span class="fe-key-name">{{ key.name || 'Key' }}</span>
                  <div class="fe-key-actions">
                    <button class="fe-button ghost fe-icon-btn" type="button" @click="editKey(idx)">✎</button>
                    <button class="fe-button ghost fe-icon-btn" type="button" @click="removeKey(idx)">✕</button>
                  </div>
                </div>
              </div>
              <div v-if="keyFormVisible" class="fe-key-form">
                <input class="fe-input" type="text" placeholder="Key name (e.g., Personal)" v-model="editingKeyName" />
                <textarea class="fe-textarea" rows="6" placeholder="PGP private key (ASCII armor)" v-model="editingKeyValue"></textarea>
                <div class="fe-settings-actions">
                  <button class="fe-button ghost" type="button" @click="cancelKeyForm">Cancel</button>
                  <button class="fe-button" type="button" @click="saveKey">Save key</button>
                </div>
              </div>
              <div class="fe-settings-actions">
                <button class="fe-button ghost" type="button" @click="clearData">Clear saved data</button>
              </div>
            </div>
          </div>

          <!-- Placeholder sections -->
          <div v-show="section === 'accounts'" class="fe-settings-grid">
            <div class="fe-settings-card">
              <h3>Your accounts</h3>
              <div class="fe-settings-note">Account management coming soon.</div>
            </div>
          </div>

          <div v-show="section === 'filters'" class="fe-settings-grid">
            <div class="fe-settings-card coming-soon">
              <h3>Filters<span class="fe-coming-soon-badge">Coming soon</span></h3>
              <div class="fe-settings-note">Create rules to automatically label, move, or forward mail.</div>
            </div>
          </div>

          <div v-if="error" class="fe-alert error">{{ error }}</div>
          <div v-if="success" class="fe-alert success">{{ success }}</div>
        </div>
      </div>
    </div>

    <!-- Rebuild confirm modal -->
    <div v-if="rebuildIndexConfirm" class="fe-modal-backdrop">
      <div class="fe-modal">
        <div class="fe-modal-header">
          <h2>Rebuild search index?</h2>
          <button class="fe-button ghost" type="button" @click="rebuildIndexConfirm = false">Close</button>
        </div>
        <div class="fe-modal-body">
          <p>This will rebuild the search index from cached messages. Continue?</p>
        </div>
        <div class="fe-modal-actions">
          <button class="fe-button ghost" type="button" @click="rebuildIndexConfirm = false">Cancel</button>
          <button class="fe-button" type="button" @click="confirmRebuild">Rebuild</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Local } from '../utils/storage';

const props = defineProps({
  navigate: Function,
  bodyIndexingEnabled: Object,
  indexCount: Number,
  indexSize: Number,
  syncPending: Number,
  localUsage: Number,
  localQuota: Number,
  threadingEnabled: Object,
  toggleBodyIndexing: Function,
  rebuildIndex: Function,
  applyTheme: Function,
  toasts: Object
});

const section = ref('general');
const theme = ref(Local.get('theme') || 'system');
const pgpKeys = ref([]);
const keyFormVisible = ref(false);
const editingKeyName = ref('');
const editingKeyValue = ref('');
const editingIndex = ref(-1);
const error = ref('');
const success = ref('');
const rebuildIndexConfirm = ref(false);

const aliasEmail = computed(() => {
  const aliasAuth = Local.get('alias_auth') || '';
  if (aliasAuth.includes(':')) return aliasAuth.split(':')[0];
  return Local.get('email') || aliasAuth || '';
});

const loadPgpKeys = () => {
  try {
    const stored = Local.get('pgp_keys');
    pgpKeys.value = stored ? JSON.parse(stored) : [];
  } catch {
    pgpKeys.value = [];
  }
};

const handleThemeChange = () => {
  Local.set('theme', theme.value);
  if (props.applyTheme) props.applyTheme(theme.value);
};

const handleToggleBodyIndexing = (e) => {
  const newValue = e.target.checked;
  if (props.bodyIndexingEnabled) props.bodyIndexingEnabled.value = newValue;
  if (props.toggleBodyIndexing) props.toggleBodyIndexing(newValue);
};

const openKeyForm = () => {
  keyFormVisible.value = true;
  editingIndex.value = -1;
  editingKeyName.value = '';
  editingKeyValue.value = '';
};

const editKey = (idx) => {
  keyFormVisible.value = true;
  editingIndex.value = idx;
  editingKeyName.value = pgpKeys.value[idx].name || '';
  editingKeyValue.value = pgpKeys.value[idx].value || '';
};

const removeKey = (idx) => {
  pgpKeys.value.splice(idx, 1);
  Local.set('pgp_keys', JSON.stringify(pgpKeys.value));
  success.value = 'Key removed.';
};

const cancelKeyForm = () => {
  keyFormVisible.value = false;
  editingIndex.value = -1;
  editingKeyName.value = '';
  editingKeyValue.value = '';
};

const saveKey = () => {
  const name = editingKeyName.value.trim();
  const value = editingKeyValue.value.trim();
  if (!name || !value) {
    error.value = 'Please provide a name and key.';
    return;
  }
  if (editingIndex.value >= 0) {
    pgpKeys.value[editingIndex.value] = { name, value };
  } else {
    pgpKeys.value.push({ name, value });
  }
  Local.set('pgp_keys', JSON.stringify(pgpKeys.value));
  cancelKeyForm();
  success.value = 'Encryption key saved locally.';
};

const clearData = () => {
  if (confirm('This will clear all local data and sign you out. Continue?')) {
    Local.clear();
    window.location.href = '/';
  }
};

const confirmRebuild = async () => {
  rebuildIndexConfirm.value = false;
  try {
    if (props.rebuildIndex) await props.rebuildIndex();
    success.value = 'Search index rebuilt.';
    props.toasts?.show?.('Search index rebuilt', 'success');
  } catch (err) {
    error.value = err?.message || 'Failed to rebuild index.';
    props.toasts?.show?.(error.value, 'error');
  }
};

loadPgpKeys();
</script>
