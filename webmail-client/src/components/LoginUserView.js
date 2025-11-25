import ko from 'knockout';
import { Remote } from '../utils/remote';
import { Local } from '../utils/storage';

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

    Remote.request('Login', {
      Email: email,
      Password: password,
      SignMe: this.signMe() ? '1' : '0'
    })
      .then((result) => {
        if (result && result.Result) {
          Local.set('signMe', this.signMe() ? '1' : '0');
          Local.set('email', email);

          if (result.Result.Token) {
            Local.set('authToken', result.Result.Token);
          } else {
            Local.remove('authToken');
          }

          // Always store Basic Auth for mailbox decryption
          Local.set('alias_auth', `${email}:${password}`);

          window.location.href = '/mailbox';
          return;
        }

        this.submitError('Login failed. Please try again.');
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
