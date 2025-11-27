import ko from 'knockout';
import { LoginUserView } from './components/LoginUserView';
import { MailboxView } from './components/MailboxView';
import { ComposeModal } from './components/ComposeModal';
import { SettingsModal } from './components/SettingsModal';
import { PassphraseModal } from './components/PassphraseModal';
import { CalendarView } from './components/CalendarView';
import { createStarfield } from './utils/starfield';
import { Local } from './utils/storage';
import './styles/main.css';

function detectRoute() {
  if (window.location.pathname.startsWith('/calendar')) return 'calendar';
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
  calendarView: new CalendarView()
};

viewModel.mailboxView.composeModal = viewModel.composeModal;
viewModel.mailboxView.passphraseModal = viewModel.pgpPassphraseModal;
viewModel.calendarView.mailboxView = viewModel.mailboxView;

viewModel.route.subscribe((route) => {
  const mailboxMode = route === 'mailbox' || route === 'settings' || route === 'calendar';
  document.body.classList.toggle('mailbox-mode', mailboxMode);
  if (route !== 'mailbox') viewModel.composeModal.close();
  if (route === 'settings') viewModel.settingsModal.open();
  if (route === 'calendar') viewModel.calendarView.load();
});

function applyTheme(pref) {
  const theme = pref || Local.get('theme') || 'system';
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.body.classList.remove('light-mode', 'dark-mode');
  if (theme === 'light') document.body.classList.add('light-mode');
  else if (theme === 'dark' || (theme === 'system' && prefersDark))
    document.body.classList.add('dark-mode');
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
  root.style.visibility = 'hidden';

  const route = viewModel.route();

  if (
    (route === 'mailbox' || route === 'settings') &&
    !Local.get('authToken') &&
    !Local.get('alias_auth')
  ) {
    window.location.replace('/');
    return;
  }

  document.body.classList.toggle('mailbox-mode', route === 'mailbox' || route === 'settings');

  viewModel.settingsModal.applyTheme = applyTheme;
  applyTheme();

  ko.applyBindings(viewModel, root);
  viewModel.composeModal.initEditor();
  if (route === 'mailbox') viewModel.mailboxView.load();
  if (route === 'settings') viewModel.settingsModal.open();
  if (route === 'calendar') viewModel.calendarView.load();
  initStarfield();
  root.style.visibility = 'visible';

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
