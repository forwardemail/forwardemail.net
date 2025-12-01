import ko from 'knockout';
import { LoginUserView } from './components/LoginUserView';
import { MailboxView } from './components/MailboxView';
import { ComposeModal } from './components/ComposeModal';
import { SettingsModal } from './components/SettingsModal';
import { PassphraseModal } from './components/PassphraseModal';
import { CalendarView } from './components/CalendarView';
import { ContactsView } from './components/ContactsView';
import { Toasts } from './components/Toast';
import { createStarfield } from './utils/starfield';
import { Local } from './utils/storage';
import { keyboardShortcuts, showKeyboardShortcutsHelp } from './utils/keyboard-shortcuts';
import './styles/main.css';

function detectRoute() {
  if (window.location.pathname.startsWith('/calendar')) return 'calendar';
  if (window.location.pathname.startsWith('/contacts')) return 'contacts';
  if (window.location.pathname.startsWith('/mailbox/settings')) return 'settings';
  if (window.location.pathname.startsWith('/mailbox')) return 'mailbox';
  return 'login';
}

const viewModel = {
  route: ko.observable(detectRoute()),
  loginUserView: new LoginUserView(),
  mailboxView: new MailboxView(),
  composeModal: new ComposeModal(),
  settingsModal: new SettingsModal(),
  pgpPassphraseModal: new PassphraseModal(),
  calendarView: new CalendarView(),
  contactsView: new ContactsView()
};

// Forward declaration for handleHashActions
let handleHashActions;

// SPA-style navigation to avoid reload flicker
viewModel.navigate = (path) => {
  if (!path || typeof path !== 'string') return;
  const sameOrigin = path.startsWith('/');
  if (!sameOrigin) {
    window.location.href = path;
    return;
  }

  // Check auth for protected routes
  const targetRoute = path.startsWith('/mailbox/settings') ? 'settings' :
                      path.startsWith('/mailbox') ? 'mailbox' :
                      path.startsWith('/calendar') ? 'calendar' :
                      path.startsWith('/contacts') ? 'contacts' : 'login';

  if (
    (targetRoute === 'mailbox' || targetRoute === 'settings' || targetRoute === 'calendar' || targetRoute === 'contacts') &&
    !Local.get('authToken') &&
    !Local.get('alias_auth')
  ) {
    history.replaceState({}, '', '/');
    viewModel.route('login');
    return;
  }

  history.pushState({}, '', path);
  viewModel.route(detectRoute());

  // Handle hash-based actions after route is set
  if (handleHashActions) {
    handleHashActions();
  }
};

// expose navigation to child contexts
viewModel.mailboxView.navigate = viewModel.navigate;
viewModel.settingsModal.navigate = viewModel.navigate;
viewModel.calendarView.navigate = viewModel.navigate;
viewModel.contactsView.navigate = viewModel.navigate;

viewModel.toasts = new Toasts();
viewModel.mailboxView.toasts = viewModel.toasts;
viewModel.mailboxView.composeModal = viewModel.composeModal;
viewModel.mailboxView.passphraseModal = viewModel.pgpPassphraseModal;
viewModel.calendarView.mailboxView = viewModel.mailboxView;
viewModel.calendarView.toasts = viewModel.toasts;
viewModel.contactsView.toasts = viewModel.toasts;
viewModel.composeModal.mailboxView = viewModel.mailboxView;

// Share storage observables between mailbox and settings
viewModel.settingsModal.storageUsed = viewModel.mailboxView.storageUsed;
viewModel.settingsModal.storageTotal = viewModel.mailboxView.storageTotal;
viewModel.settingsModal.localUsage = viewModel.mailboxView.localUsage;
viewModel.settingsModal.localQuota = viewModel.mailboxView.localQuota;
viewModel.settingsModal.indexCount = viewModel.mailboxView.indexCount;
viewModel.settingsModal.indexSize = viewModel.mailboxView.indexSize;
viewModel.settingsModal.syncPending = viewModel.mailboxView.syncPending;
viewModel.settingsModal.bodyIndexingEnabled = viewModel.mailboxView.bodyIndexingEnabled;
viewModel.settingsModal.rebuildIndex = viewModel.mailboxView.rebuildSearchFromCache.bind(
  viewModel.mailboxView
);
viewModel.settingsModal.toggleBodyIndexing = viewModel.mailboxView.toggleBodyIndexing.bind(
  viewModel.mailboxView
);
viewModel.settingsModal.toasts = viewModel.toasts;

viewModel.route.subscribe((route) => {
  const mailboxMode =
    route === 'mailbox' || route === 'settings' || route === 'calendar' || route === 'contacts';
  document.body.classList.toggle('mailbox-mode', mailboxMode);
  if (route !== 'mailbox') viewModel.composeModal.close();
  if (route !== 'settings') {
    viewModel.settingsModal.cancelEditShortcut();
    keyboardShortcuts.stopCapture();
    viewModel.settingsModal.visible(false);
  }
  if (route === 'mailbox') viewModel.mailboxView.load();
  if (route === 'settings') viewModel.settingsModal.open();
  if (route === 'calendar') viewModel.calendarView.load();
  if (route === 'contacts') viewModel.contactsView.load();
});

function initKeyboardShortcuts() {
  // Only enable shortcuts on mailbox route
  viewModel.route.subscribe((route) => {
    keyboardShortcuts.setEnabled(route === 'mailbox');
  });
  keyboardShortcuts.setEnabled(viewModel.route() === 'mailbox');

  // Update context based on route
  viewModel.route.subscribe((route) => {
    if (route === 'mailbox') {
      keyboardShortcuts.setContext('list');
    } else if (route === 'settings') {
      keyboardShortcuts.setContext('settings');
    } else if (route === 'calendar') {
      keyboardShortcuts.setContext('calendar');
    } else if (route === 'contacts') {
      keyboardShortcuts.setContext('contacts');
    } else {
      keyboardShortcuts.setContext('default');
    }
  });

  // Set initial context
  const route = viewModel.route();
  if (route === 'mailbox') keyboardShortcuts.setContext('list');

  // Register handlers
  // Common / message-level
  keyboardShortcuts.on('new-message', () => {
    if (viewModel.route() === 'mailbox') {
      viewModel.composeModal.open();
    }
  });

  keyboardShortcuts.on('reply', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.composeModal.reply(msg);
    } else {
      viewModel.mailboxView.toasts?.show?.('Select a message to reply', 'info');
    }
  });

  keyboardShortcuts.on('reply-all', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.composeModal.replyAll(msg);
    } else {
      viewModel.mailboxView.toasts?.show?.('Select a message to reply all', 'info');
    }
  });

  keyboardShortcuts.on('reply-list', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.composeModal.replyAll(msg);
    } else {
      viewModel.mailboxView.toasts?.show?.('Select a message to reply', 'info');
    }
  });

  keyboardShortcuts.on('forward', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.composeModal.forward(msg);
    }
  });

  keyboardShortcuts.on('edit-as-new', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.composeModal.forward(msg);
    }
  });

  keyboardShortcuts.on('save-draft', () => {
    if (viewModel.composeModal.visible()) {
      viewModel.composeModal.saveDraft?.();
    } else {
      viewModel.mailboxView.toasts?.show?.('Save draft is available while composing', 'info');
    }
  });

  keyboardShortcuts.on('print', () => {
    window.print();
  });

  keyboardShortcuts.on('send-now', () => {
    if (viewModel.composeModal.visible()) {
      viewModel.composeModal.send();
    }
  });

  // Receiving / navigation
  keyboardShortcuts.on('refresh', () => {
    if (viewModel.route() === 'mailbox') {
      viewModel.mailboxView.loadMessages();
    }
  });

  keyboardShortcuts.on('refresh-all', () => {
    viewModel.mailboxView.loadMessages();
  });

  keyboardShortcuts.on('expand-thread', () => {
    viewModel.mailboxView.toasts?.show?.('Expand thread not yet implemented', 'info');
  });
  keyboardShortcuts.on('collapse-thread', () => {
    viewModel.mailboxView.toasts?.show?.('Collapse thread not yet implemented', 'info');
  });

  // Managing / marking / tags
  keyboardShortcuts.on('toggle-read', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.mailboxView.toggleRead(msg);
    }
  });

  keyboardShortcuts.on('mark-thread-read', () => {
    viewModel.mailboxView.toasts?.show?.('Mark thread read not yet implemented', 'info');
  });

  keyboardShortcuts.on('mark-folder-read', () => {
    viewModel.mailboxView.toasts?.show?.('Mark folder read not yet implemented', 'info');
  });

  keyboardShortcuts.on('mark-date-read', () => {
    viewModel.mailboxView.toasts?.show?.('Mark as read by date not yet implemented', 'info');
  });

  keyboardShortcuts.on('mark-junk', () => {
    viewModel.mailboxView.toasts?.show?.('Mark as junk not yet implemented', 'info');
  });

  keyboardShortcuts.on('mark-not-junk', () => {
    viewModel.mailboxView.toasts?.show?.('Mark as not junk not yet implemented', 'info');
  });

  keyboardShortcuts.on('star', () => {
    viewModel.mailboxView.toasts?.show?.('Star not yet implemented', 'info');
  });

  keyboardShortcuts.on('archive', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.mailboxView.archiveMessage(msg);
    }
  });

  keyboardShortcuts.on('delete', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.mailboxView.deleteMessage(msg, { permanent: false });
    }
  });

  keyboardShortcuts.on('delete-permanent', () => {
    const msg = viewModel.mailboxView.selectedMessage();
    if (msg) {
      viewModel.mailboxView.deleteMessage(msg, { permanent: true });
    }
  });

  keyboardShortcuts.on('move-copy', () => {
    viewModel.mailboxView.toasts?.show?.('Move / copy not yet implemented', 'info');
  });

  // Search
  keyboardShortcuts.on('quick-filter', () => {
    const searchInput = document.querySelector('.fe-search');
    if (searchInput) {
      searchInput.focus();
    }
  });

  keyboardShortcuts.on('find-in-message', () => {
    const searchInput = document.querySelector('.fe-search');
    if (searchInput) {
      searchInput.focus();
    }
  });

  keyboardShortcuts.on('advanced-search', () => {
    viewModel.mailboxView.toasts?.show?.('Advanced search not yet implemented', 'info');
  });

  keyboardShortcuts.on('quick-filter-advanced', () => {
    const searchInput = document.querySelector('.fe-search');
    if (searchInput) {
      searchInput.focus();
    }
  });

  // Help
  keyboardShortcuts.on('help', () => {
    showShortcutsHelp();
  });

  keyboardShortcuts.on('redo', () => {
    viewModel.mailboxView.toasts?.show?.('Redo not yet implemented', 'info');
  });
}

function showShortcutsHelp() {
  const shortcuts = showKeyboardShortcutsHelp();

  // Create modal HTML
  let html = '<div class="fe-shortcuts-help"><h2>Keyboard Shortcuts</h2>';

  for (const [category, items] of Object.entries(shortcuts)) {
    if (items.length === 0) continue;
    html += `<h3>${category}</h3><table class="fe-shortcuts-table">`;
    items.forEach(item => {
      html += `<tr><td class="fe-shortcut-key">${item.key}</td><td>${item.label}</td></tr>`;
    });
    html += '</table>';
  }

  html += '</div>';

  // Show in modal (you'll need to create a modal for this)
  viewModel.mailboxView.toasts?.show?.('Press ? to see keyboard shortcuts', 'info');
  console.log('Keyboard shortcuts:', shortcuts);
}

function applyTheme(pref) {
  const theme = pref || Local.get('theme') || 'system';
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.remove('light-mode', 'dark-mode');
  if (theme === 'light' || (theme === 'system' && !prefersDark)) {
    document.body.classList.add('light-mode');
  } else if (theme === 'dark' || (theme === 'system' && prefersDark)) {
    document.body.classList.add('dark-mode');
  }
}

function initStarfield() {
  const layers = [
    { id: 'stars', starCount: 180, speed: 0.15, maxRadius: 1.2 },
    { id: 'stars2', starCount: 120, speed: 0.08, maxRadius: 1.4 },
    { id: 'stars3', starCount: 80, speed: 0.04, maxRadius: 1.6 }
  ];

  const disposers = layers.map((layer) => createStarfield(layer.id, layer));

  return () => disposers.forEach((dispose) => dispose && dispose());
}

function bootstrap() {
  const root = document.getElementById('rl-app');
  if (!root) return;

  let route = viewModel.route();

  // Check auth before showing anything
  if (
    (route === 'mailbox' || route === 'settings' || route === 'calendar' || route === 'contacts') &&
    !Local.get('authToken') &&
    !Local.get('alias_auth')
  ) {
    // Use navigate instead of full page reload to prevent flicker
    viewModel.route('login');
    history.replaceState({}, '', '/');
    route = 'login';
  }

  document.body.classList.toggle(
    'mailbox-mode',
    route === 'mailbox' || route === 'settings' || route === 'calendar' || route === 'contacts'
  );

  viewModel.settingsModal.applyTheme = applyTheme;
  applyTheme();

  ko.applyBindings(viewModel, root);
  viewModel.composeModal.initEditor();
  if (route === 'mailbox') viewModel.mailboxView.load();
  if (route === 'settings') viewModel.settingsModal.open();
  if (route === 'calendar') viewModel.calendarView.load();
  if (route === 'contacts') viewModel.contactsView.load();
  initStarfield();
  initKeyboardShortcuts();

  // Mark as ready to show - use class for better performance
  root.classList.add('ready');

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('Service worker registration failed', error);
      });
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

window.addEventListener('popstate', () => {
  viewModel.route(detectRoute());
});

// Handle hash-based compose deep link (e.g., /mailbox#compose=user@example.com)
handleHashActions = function() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#compose=')) {
    const addr = decodeURIComponent(hash.replace('#compose=', ''));
    if (addr) {
      // Only set route if not already on mailbox
      const currentRoute = viewModel.route();
      if (currentRoute !== 'mailbox') {
        viewModel.route('mailbox');
      }
      // Use setTimeout to ensure the route and modal are ready
      setTimeout(() => {
        viewModel.mailboxView.composeModal.open();
        viewModel.mailboxView.composeModal.toList([addr]);
      }, 0);
    }
  } else if (hash.startsWith('#addevent=')) {
    const addr = decodeURIComponent(hash.replace('#addevent=', ''));
    // Only set route if not already on calendar
    const currentRoute = viewModel.route();
    if (currentRoute !== 'calendar') {
      viewModel.route('calendar');
    }
    // Use setTimeout to ensure the route and calendar are ready
    setTimeout(() => {
      if (viewModel.calendarView.prefillQuickEvent) {
        viewModel.calendarView.prefillQuickEvent(addr);
      }
    }, 0);
  } else if (hash.startsWith('#search=')) {
    const term = decodeURIComponent(hash.replace('#search=', ''));
    // Only set route if not already on mailbox
    const currentRoute = viewModel.route();
    if (currentRoute !== 'mailbox') {
      viewModel.route('mailbox');
    }
    setTimeout(() => {
      if (typeof viewModel.mailboxView.onSearch === 'function') {
        viewModel.mailboxView.onSearch(term);
        viewModel.mailboxView.page?.(1);
        viewModel.mailboxView.loadMessages?.();
      }
    }, 0);
  } else {
    return;
  }
  // clear hash to avoid repeat
  history.replaceState({}, '', window.location.pathname);
}

window.addEventListener('hashchange', handleHashActions);
handleHashActions();
