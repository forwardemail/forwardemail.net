<template>
  <div id="rl-app" :class="{ 'mailbox-mode': isMailboxMode }">
    <!-- Starfield canvases -->
    <div class="fe-stars">
      <canvas id="stars"></canvas>
      <canvas id="stars2"></canvas>
      <canvas id="stars3"></canvas>
    </div>

    <!-- Login wrapper -->
    <div v-if="route === 'login'" class="fe-login-wrapper">
      <LoginUserView :navigate="navigate" />
    </div>

    <!-- Mailbox view -->
    <MailboxView
      v-if="route === 'mailbox'"
      ref="mailboxViewRef"
      :navigate="navigate"
      :composeModal="composeModalRef"
      :passphraseModal="passphraseModalRef"
      :toasts="toastsRef"
    />

    <!-- Settings view -->
    <SettingsModal
      v-if="route === 'settings'"
      :navigate="navigate"
      :bodyIndexingEnabled="mailboxViewRef?.bodyIndexingEnabled"
      :indexCount="mailboxViewRef?.indexCount || 0"
      :indexSize="mailboxViewRef?.indexSize || 0"
      :syncPending="mailboxViewRef?.syncPending || 0"
      :localUsage="mailboxViewRef?.localUsage || 0"
      :localQuota="mailboxViewRef?.localQuota || 0"
      :threadingEnabled="mailboxViewRef?.threadingEnabled"
      :toggleBodyIndexing="mailboxViewRef?.toggleBodyIndexing"
      :rebuildIndex="mailboxViewRef?.rebuildSearchFromCache"
      :applyTheme="applyTheme"
      :toasts="toastsRef"
    />

    <!-- Calendar view -->
    <CalendarView
      v-if="route === 'calendar'"
      ref="calendarViewRef"
      :navigate="navigate"
      :toasts="toastsRef"
    />

    <!-- Contacts view -->
    <ContactsView
      v-if="route === 'contacts'"
      ref="contactsViewRef"
      :navigate="navigate"
      :toasts="toastsRef"
    />

    <!-- Compose modal -->
    <ComposeModal
      ref="composeModalRef"
      :toasts="toastsRef"
    />

    <!-- Passphrase modal -->
    <PassphraseModal ref="passphraseModalRef" />

    <!-- Toast notifications -->
    <Toast ref="toastsRef" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from './composables/useRouter';
import { useTheme } from './composables/useTheme';
import { createStarfield } from './utils/starfield';
import { Local } from './utils/storage';
import LoginUserView from './components/LoginUserView.vue';
import MailboxView from './components/MailboxView.vue';
import SettingsModal from './components/SettingsModal.vue';
import CalendarView from './components/CalendarView.vue';
import ContactsView from './components/ContactsView.vue';
import ComposeModal from './components/ComposeModal.vue';
import PassphraseModal from './components/PassphraseModal.vue';
import Toast from './components/Toast.vue';
import './styles/tailwind.css';
import './styles/app.css';
import './styles/main.css';

const { route, navigate } = useRouter();
const { applyTheme } = useTheme();

const mailboxViewRef = ref(null);
const calendarViewRef = ref(null);
const contactsViewRef = ref(null);
const composeModalRef = ref(null);
const passphraseModalRef = ref(null);
const toastsRef = ref(null);

const isMailboxMode = computed(() => {
  return ['mailbox', 'settings', 'calendar', 'contacts'].includes(route.value);
});

// Initialize starfield
const initStarfield = () => {
  const layers = [
    { id: 'stars', starCount: 180, speed: 0.15, maxRadius: 1.2 },
    { id: 'stars2', starCount: 120, speed: 0.08, maxRadius: 1.4 },
    { id: 'stars3', starCount: 80, speed: 0.04, maxRadius: 1.6 }
  ];

  return layers.map((layer) => createStarfield(layer.id, layer));
};

// Watch route changes
watch(route, (newRoute, oldRoute) => {
  // Update body class
  document.body.classList.toggle('mailbox-mode', isMailboxMode.value);

  // Close compose modal when leaving mailbox
  if (newRoute !== 'mailbox' && composeModalRef.value) {
    composeModalRef.value.close?.();
  }

  // Load views when navigating to them
  if (newRoute === 'mailbox' && mailboxViewRef.value?.load) {
    mailboxViewRef.value.load();
  }
  if (newRoute === 'calendar' && calendarViewRef.value?.load) {
    calendarViewRef.value.load();
  }
  if (newRoute === 'contacts' && contactsViewRef.value?.load) {
    contactsViewRef.value.load();
  }
});

// Handle hash-based actions (e.g., #compose=user@example.com)
const handleHashActions = () => {
  const hash = window.location.hash || '';
  if (hash.startsWith('#compose=')) {
    const addr = decodeURIComponent(hash.replace('#compose=', ''));
    if (addr && composeModalRef.value) {
      if (route.value !== 'mailbox') {
        navigate('/mailbox');
      }
      setTimeout(() => {
        composeModalRef.value.open?.();
        composeModalRef.value.toList?.([addr]);
      }, 0);
    }
  } else if (hash.startsWith('#search=')) {
    const term = decodeURIComponent(hash.replace('#search=', ''));
    if (route.value !== 'mailbox') {
      navigate('/mailbox');
    }
    // Search functionality can be added later
  }
  // Clear hash
  if (hash) {
    history.replaceState({}, '', window.location.pathname);
  }
};

onMounted(() => {
  // Check auth for protected routes
  const currentRoute = route.value;
  if (
    (currentRoute === 'mailbox' || currentRoute === 'settings' || currentRoute === 'calendar' || currentRoute === 'contacts') &&
    !Local.get('authToken') &&
    !Local.get('alias_auth')
  ) {
    navigate('/');
  }

  // Apply theme
  applyTheme();

  // Initialize starfield
  const disposers = initStarfield();

  // Handle hash actions
  handleHashActions();
  window.addEventListener('hashchange', handleHashActions);

  // Load initial view
  if (route.value === 'mailbox' && mailboxViewRef.value?.load) {
    mailboxViewRef.value.load();
  }
  if (route.value === 'calendar' && calendarViewRef.value?.load) {
    calendarViewRef.value.load();
  }
  if (route.value === 'contacts' && contactsViewRef.value?.load) {
    contactsViewRef.value.load();
  }

  // Register service worker
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed', error);
      });
    });
  }

  // Cleanup
  return () => {
    disposers.forEach((dispose) => dispose && dispose());
    window.removeEventListener('hashchange', handleHashActions);
  };
});
</script>

<style>
/* App is visible by default */
</style>
