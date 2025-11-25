import ko from 'knockout';
import { LoginUserView } from './components/LoginUserView';
import { MailboxView } from './components/MailboxView';
import { createStarfield } from './utils/starfield';
import { Local } from './utils/storage';
import './styles/main.css';

function detectRoute() {
  return window.location.pathname.startsWith('/mailbox') ? 'mailbox' : 'login';
}

const viewModel = {
  route: ko.observable(detectRoute()),
  loginUserView: new LoginUserView(),
  mailboxView: new MailboxView()
};

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

  const route = viewModel.route();

  if (
    route === 'mailbox' &&
    !Local.get('authToken') &&
    !Local.get('alias_auth')
  ) {
    window.location.replace('/');
    return;
  }

  document.body.classList.toggle('mailbox-mode', route === 'mailbox');

  ko.applyBindings(viewModel, root);
  if (route === 'mailbox') viewModel.mailboxView.load();
  initStarfield();

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
