<template>
  <div class="fe-mailbox-wrapper">
    <div class="fe-mailbox-header">
      <button class="fe-button ghost fe-icon-btn" type="button" aria-label="Back" title="Back" @click="navigate('/mailbox')">←</button>
      <div class="fe-title-left">
        <h1>Contacts</h1>
        <span>{{ email }}</span>
      </div>
    </div>

    <div class="fe-contacts-shell">
      <div class="fe-contacts-list">
        <div class="fe-contacts-list-header">
          <input type="search" class="fe-search" placeholder="Search contacts" v-model="query" />
          <button class="fe-button ghost fe-icon-btn" type="button" title="New contact" @click="startNewContact">＋</button>
        </div>
        <div v-if="loading" class="fe-empty">Loading contacts…</div>
        <div v-else-if="error" class="fe-alert error">{{ error }}</div>
        <ul v-else-if="filteredContacts.length" class="fe-contacts-items">
          <li
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="fe-contact-row"
            :class="{ active: selectedContact && selectedContact.id === contact.id }"
            @click="selectContact(contact)"
          >
            <div class="fe-contact-name">{{ contact.name || contact.email || 'Unknown' }}</div>
            <div class="fe-contact-email">{{ contact.email }}</div>
          </li>
        </ul>
        <div v-else class="fe-empty">No contacts found.</div>
      </div>

      <div class="fe-contacts-detail">
        <div v-if="selectedContact" class="fe-contacts-detail-grid">
          <div class="fe-contacts-detail-col">
            <label class="fe-settings-row">Name
              <input class="fe-input" type="text" v-model="selectedContact.name" :disabled="!isEditing" />
            </label>
            <label class="fe-settings-row">Primary email
              <input class="fe-input" type="email" v-model="selectedContact.email" :disabled="!isEditing" />
            </label>
            <label class="fe-settings-row">Phone
              <input class="fe-input" type="text" v-model="selectedContact.phone" :disabled="!isEditing" />
            </label>
            <div class="fe-settings-actions">
              <button v-if="!isEditing" class="fe-button" @click="isEditing = true">Edit</button>
              <template v-else>
                <button class="fe-button ghost" @click="cancelEdit">Cancel</button>
                <button class="fe-button" @click="saveContact">Save</button>
              </template>
            </div>
          </div>
        </div>
        <div v-else class="fe-empty">Select a contact to view details</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Local } from '../utils/storage';
import { Remote } from '../utils/remote';

const props = defineProps({
  navigate: Function,
  toasts: Object
});

const email = ref(Local.get('email') || '');
const query = ref('');
const loading = ref(false);
const error = ref('');
const contacts = ref([]);
const selectedContact = ref(null);
const isEditing = ref(false);

const filteredContacts = computed(() => {
  if (!query.value) return contacts.value;
  const q = query.value.toLowerCase();
  return contacts.value.filter(c =>
    (c.name?.toLowerCase().includes(q)) ||
    (c.email?.toLowerCase().includes(q))
  );
});

const load = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await Remote.request('Contacts', { limit: 500 });
    const list = Array.isArray(res) ? res : res?.Result || res?.contacts || [];
    contacts.value = list.map(c => ({
      id: c.id || c.Id,
      name: c.name || c.Name || '',
      email: (c.emails && c.emails[0]?.value) || (c.Emails && c.Emails[0]?.value) || c.email || '',
      phone: c.phone || ''
    }));
  } catch (err) {
    error.value = err?.message || 'Failed to load contacts';
  } finally {
    loading.value = false;
  }
};

const selectContact = (contact) => {
  selectedContact.value = { ...contact };
  isEditing.value = false;
};

const startNewContact = () => {
  selectedContact.value = { id: null, name: '', email: '', phone: '' };
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  selectedContact.value = null;
};

const saveContact = async () => {
  // Placeholder for save logic
  props.toasts?.show?.('Contact save not yet implemented', 'info');
  isEditing.value = false;
};

onMounted(() => {
  load();
});

defineExpose({ load });
</script>
