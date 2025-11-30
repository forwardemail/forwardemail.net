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
  if (route === 'mailbox') viewModel.mailboxView.load();
  if (route === 'settings') viewModel.settingsModal.open();
  if (route === 'calendar') viewModel.calendarView.load();
  if (route === 'contacts') viewModel.contactsView.load();
});

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
