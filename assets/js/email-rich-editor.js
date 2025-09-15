/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Rich Text Editor for Email Compose
window.EmailRichEditor = {
  toolbar: null,
  content: null,
  fallback: null,
  initialized: false,

  initialize() {
    if (this.initialized) return;

    this.toolbar = document.getElementById('rich-editor-toolbar');
    this.content = document.getElementById('rich-editor-content');
    this.fallback = document.getElementById('compose-message');

    if (!this.toolbar || !this.content) {
      console.warn('Rich text editor elements not found');
      return;
    }

    this.createToolbar();
    this.setupContentHandlers();
    this.initialized = true;
    console.log('✅ Rich text editor initialized');
  },

  createToolbar() {
    // Create basic toolbar buttons
    const buttons = [
      { cmd: 'bold', icon: 'fa-bold', title: 'Bold' },
      { cmd: 'italic', icon: 'fa-italic', title: 'Italic' },
      { cmd: 'underline', icon: 'fa-underline', title: 'Underline' },
      { type: 'separator' },
      { cmd: 'insertOrderedList', icon: 'fa-list-ol', title: 'Numbered List' },
      { cmd: 'insertUnorderedList', icon: 'fa-list-ul', title: 'Bulleted List' },
      { type: 'separator' },
      { cmd: 'createLink', icon: 'fa-link', title: 'Insert Link' },
      { cmd: 'insertImage', icon: 'fa-image', title: 'Insert Image' }
    ];

    // Clear existing toolbar
    this.toolbar.innerHTML = '';

    buttons.forEach(btn => {
      if (btn.type === 'separator') {
        const separator = document.createElement('span');
        separator.className = 'toolbar-separator';
        separator.style.cssText = 'width: 1px; height: 20px; background: #666; margin: 0 4px;';
        this.toolbar.appendChild(separator);
      } else {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'toolbar-btn';
        button.innerHTML = `<i class="fa ${btn.icon}"></i>`;
        button.title = btn.title;
        button.style.cssText = `
          border: none;
          background: none;
          color: white;
          padding: 6px;
          margin: 2px;
          border-radius: 3px;
          cursor: pointer;
          transition: background 0.2s;
        `;

        button.addEventListener('mouseenter', function() {
          button.style.background = '#555';
        });

        button.addEventListener('mouseleave', function() {
          button.style.background = 'none';
        });

        var self = this;
        button.addEventListener('click', function() {
          self.executeCommand(btn);
        });

        this.toolbar.appendChild(button);
      }
    });
  },

  executeCommand(btn) {
    if (btn.cmd === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) document.execCommand(btn.cmd, false, url);
    } else if (btn.cmd === 'insertImage') {
      const url = prompt('Enter image URL:');
      if (url) document.execCommand(btn.cmd, false, url);
    } else {
      document.execCommand(btn.cmd, false, null);
    }
    this.content.focus();
    this.syncContent();
  },

  setupContentHandlers() {
    // Sync content with hidden textarea for form submission
    var self = this;
    this.content.addEventListener('input', function() {
      self.syncContent();
    });

    // Set placeholder behavior for dark theme
    this.content.addEventListener('focus', function() {
      if (self.content.textContent.trim() === '' || self.content.innerHTML.includes('Write your message...')) {
        self.content.innerHTML = '';
      }
    });

    this.content.addEventListener('blur', function() {
      if (self.content.textContent.trim() === '') {
        self.content.innerHTML = '<p style="color: #aaa; margin: 0;">Write your message...</p>';
      }
    });

    // Initialize with placeholder for dark theme
    this.content.innerHTML = '<p style="color: #aaa; margin: 0;">Write your message...</p>';
  },

  syncContent() {
    if (this.fallback) {
      this.fallback.value = this.content.innerHTML;
    }
  },

  reset() {
    if (this.content) {
      this.content.innerHTML = '<p style="color: #aaa; margin: 0;">Write your message...</p>';
    }
    if (this.fallback) {
      this.fallback.value = '';
    }
  }
};