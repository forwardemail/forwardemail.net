import ko from 'knockout';
import { Remote } from '../utils/remote';
import { Local, Accounts } from '../utils/storage';

export class LoginUserView {
  constructor() {
    this.email = ko.observable(Local.get('email') || '');
    this.password = ko.observable('');
    this.signMe = ko.observable(Local.get('signMe') === '1');
    this.submitRequest = ko.observable(false);
    this.submitError = ko.observable('');
    this.submitErrorAdditional = ko.observable('');

    this.submitButtonText = ko.pureComputed(() =>
      this.submitRequest() ? 'Signing in...' : 'Sign In'
    );
  }

  submitForm = () => {
    if (this.submitRequest()) return false;

    const email = (this.email() || '').trim();
    const password = this.password();

    if (!email || !password) {
      this.submitError('Please enter both email and password.');
      return false;
    }

    this.submitRequest(true);
    this.submitError('');
    this.submitErrorAdditional('');

    const authHeader = `Basic ${btoa(`${email}:${password}`)}`;

    Remote.request(
      'Folders',
      {},
      { method: 'GET', skipAuth: true, headers: { Authorization: authHeader } }
    )
      .then((result) => {
        if (!result) {
          this.submitError('Login failed. Please try again.');
          return;
        }

        // Initialize multi-account system FIRST (before setting Local storage)
        Accounts.init();

        // Add this account to the multi-account system
        Accounts.add(email, {
          aliasAuth: `${email}:${password}`
        });

        // Set as active account
        Accounts.setActive(email);

        // Set Local storage values (for backwards compatibility)
        Local.set('signMe', this.signMe() ? '1' : '0');
        Local.set('email', email);
        Local.set('alias_auth', `${email}:${password}`);
        Local.remove('api_token');
        Local.remove('locale');

        window.location.href = '/mailbox';
      })
      .catch((error) => {
        const message = error?.message || 'Login failed. Please try again.';
        this.submitError(message);
        if (error?.description) this.submitErrorAdditional(error.description);
      })
      .finally(() => {
        this.submitRequest(false);
      });

    return false;
  };
}
