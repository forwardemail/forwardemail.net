import ko from 'knockout';

export class Toasts {
  constructor() {
    this.items = ko.observableArray([]);
    this.nextId = 1;
  }

  show(message, type = 'info', timeout = 3000) {
    const id = (this.nextId += 1);
    this.items.push({ id, message, type });
    if (timeout) {
      setTimeout(() => this.dismiss(id), timeout);
    }
  }

  dismiss(id) {
    this.items.remove((item) => item.id === id);
  }
}
