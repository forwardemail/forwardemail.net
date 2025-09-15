/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Email Autocomplete Handler
window.EmailAutoComplete = {
  initialized: false,
  activeField: null,
  activeDropdown: null,
  contacts: [],

  initialize() {
    if (this.initialized) return;

    this.setupContactFields();
    this.loadContacts();
    this.initialized = true;
    console.log('✅ Email autocomplete initialized');
  },

  setupContactFields() {
    const fields = ['compose-to', 'compose-cc', 'compose-bcc'];

    var self = this;
    fields.forEach(function(fieldId) {
      const field = document.getElementById(fieldId);
      const dropdown = document.getElementById(fieldId.replace('compose-', '') + '-autocomplete');

      if (field && dropdown) {
        self.setupFieldHandlers(field, dropdown);
      }
    });
  },

  setupFieldHandlers(field, dropdown) {
    let searchTimeout;

    var self = this;
    field.addEventListener('input', function(e) {
      clearTimeout(searchTimeout);
      const query = e.target.value;

      // Get the last email being typed (after comma/semicolon)
      const emails = query.split(/[,;]+/);
      const currentEmail = emails[emails.length - 1].trim();

      if (currentEmail.length > 1) {
        searchTimeout = setTimeout(function() {
          self.showSuggestions(field, dropdown, currentEmail);
        }, 300);
      } else {
        self.hideSuggestions(dropdown);
      }
    });

    field.addEventListener('keydown', function(e) {
      if (dropdown.style.display !== 'none') {
        self.handleKeyNavigation(e, dropdown);
      }
    });

    field.addEventListener('blur', function(e) {
      // Delay hiding to allow clicking on suggestions
      setTimeout(function() {
        self.hideSuggestions(dropdown);
      }, 150);
    });

    field.addEventListener('focus', function() {
      self.activeField = field;
      self.activeDropdown = dropdown;
    });
  },

  showSuggestions(field, dropdown, query) {
    const suggestions = this.searchContacts(query);

    if (suggestions.length === 0) {
      this.hideSuggestions(dropdown);
      return;
    }

    dropdown.innerHTML = '';
    var self = this;
    suggestions.forEach(function(contact, index) {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      if (index === 0) item.classList.add('active');

      item.innerHTML = `
        <div class="contact-name">${contact.name}</div>
        <div class="contact-email">${contact.email}</div>
      `;

      item.addEventListener('click', function() {
        self.selectContact(field, contact);
        self.hideSuggestions(dropdown);
      });

      dropdown.appendChild(item);
    });

    // Position dropdown
    const rect = field.getBoundingClientRect();
    dropdown.style.top = field.offsetTop + field.offsetHeight + 'px';
    dropdown.style.left = field.offsetLeft + 'px';
    dropdown.style.width = field.offsetWidth + 'px';
    dropdown.style.display = 'block';
  },

  hideSuggestions(dropdown) {
    dropdown.style.display = 'none';
    dropdown.innerHTML = '';
  },

  handleKeyNavigation(e, dropdown) {
    const items = dropdown.querySelectorAll('.autocomplete-item');
    const activeItem = dropdown.querySelector('.autocomplete-item.active');
    let activeIndex = Array.from(items).indexOf(activeItem);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        this.setActiveItem(items, activeIndex);
        break;

      case 'ArrowUp':
        e.preventDefault();
        activeIndex = activeIndex <= 0 ? items.length - 1 : activeIndex - 1;
        this.setActiveItem(items, activeIndex);
        break;

      case 'Enter':
        e.preventDefault();
        if (activeItem) {
          const contact = {
            name: activeItem.querySelector('.contact-name').textContent,
            email: activeItem.querySelector('.contact-email').textContent
          };
          this.selectContact(this.activeField, contact);
          this.hideSuggestions(dropdown);
        }
        break;

      case 'Escape':
        this.hideSuggestions(dropdown);
        break;
    }
  },

  setActiveItem(items, activeIndex) {
    items.forEach(function(item, index) {
      item.classList.toggle('active', index === activeIndex);
    });
  },

  selectContact(field, contact) {
    const currentValue = field.value;
    const emails = currentValue.split(/[,;]+/);

    // Replace the last (current) email with the selected one
    emails[emails.length - 1] = contact.email;

    // Add a space after if it's not the only email
    const newValue = emails.join(', ') + (emails.length > 1 || currentValue.includes(',') ? ', ' : '');

    field.value = newValue;
    field.focus();

    // Position cursor at the end
    field.setSelectionRange(newValue.length, newValue.length);
  },

  searchContacts(query) {
    if (!query || query.length < 2) return [];

    const queryLower = query.toLowerCase();

    return this.contacts.filter(function(contact) {
      return contact.name.toLowerCase().includes(queryLower) ||
             contact.email.toLowerCase().includes(queryLower);
    }).slice(0, 5); // Limit to 5 suggestions
  },

  loadContacts() {
    // This would typically load from an API endpoint
    // For now, using sample data
    this.contacts = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Bob Johnson', email: 'bob@example.com' },
      { name: 'Alice Wilson', email: 'alice@example.com' },
      { name: 'Charlie Brown', email: 'charlie@example.com' }
    ];

    // TODO: Load contacts from server
    // fetch('/my-account/contacts')
    //   .then(response => response.json())
    //   .then(contacts => {
    //     this.contacts = contacts;
    //   })
    //   .catch(error => {
    //     console.error('Failed to load contacts:', error);
    //   });
  },

  addContact(name, email) {
    const contact = { name, email };
    if (!this.contacts.find(function(c) { return c.email === email; })) {
      this.contacts.push(contact);
    }
  },

  reset() {
    this.activeField = null;
    this.activeDropdown = null;

    // Hide all dropdowns
    var self = this;
    document.querySelectorAll('.autocomplete-dropdown').forEach(function(dropdown) {
      self.hideSuggestions(dropdown);
    });
  }
};