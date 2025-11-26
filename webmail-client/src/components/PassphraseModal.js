import ko from 'knockout';

export class PassphraseModal {
  constructor() {
    this.visible = ko.observable(false);
    this.keyName = ko.observable('');
    this.passphrase = ko.observable('');
    this.remember = ko.observable(false);
    this._resolve = null;
    this._reject = null;
  }

  open = (name) => {
    this.keyName(name || '');
    this.passphrase('');
    this.remember(false);
    this.visible(true);
    return new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  };

  submit = () => {
    if (this._resolve) {
      this._resolve({ passphrase: this.passphrase(), remember: this.remember() });
    }
    this.cleanup();
  };

  cancel = () => {
    if (this._reject) this._reject(new Error('Passphrase cancelled'));
    this.cleanup();
  };

  cleanup() {
    this.visible(false);
    this.keyName('');
    this.passphrase('');
    this.remember(false);
    this._resolve = null;
    this._reject = null;
  }
}
