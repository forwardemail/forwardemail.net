/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Email Client Core Functionality
class EmailClient {
  constructor() {
    this.composeModal = null;
    this.composeBtn = null;
    this.richEditorContent = null;
    this.initialized = false;

    this.init();
  }

  init() {
    var self = this;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { self.initializeClient(); });
    } else {
      this.initializeClient();
    }
  }

  initializeClient() {
    console.log('🚀 Initializing email client...');

    // Get DOM elements
    this.composeBtn = document.getElementById('compose-btn');
    this.composeModal = document.getElementById('compose-modal');
    this.richEditorContent = document.getElementById('rich-editor-content');

    console.log('📋 Element check:', {
      composeBtn: this.composeBtn ? 'Found' : 'NOT FOUND',
      composeModal: this.composeModal ? 'Found' : 'NOT FOUND',
      richEditorContent: this.richEditorContent ? 'Found' : 'NOT FOUND'
    });

    // Check Bootstrap availability
    console.log('📚 Bootstrap check:', {
      bootstrap: typeof bootstrap !== 'undefined' ? 'Available' : 'NOT AVAILABLE',
      bootstrapModal: typeof bootstrap !== 'undefined' && bootstrap.Modal ? 'Available' : 'NOT AVAILABLE'
    });

    if (this.composeBtn && this.composeModal) {
      this.initializeCompose();
      this.initializeSearch();
      this.initializeMessageList();
      this.initialized = true;
      console.log('✅ Email client initialization completed');
    } else {
      console.error('❌ Missing required elements for email client');
    }
  }

  initializeCompose() {
    console.log('✅ Setting up compose functionality');

    // Set up modal event handlers
    var self = this;
    if (this.composeModal) {
      this.composeModal.addEventListener('shown.bs.modal', function() {
        console.log('🎉 Modal shown event fired!');
        self.onModalShown();
      });

      this.composeModal.addEventListener('hidden.bs.modal', function() {
        console.log('👋 Modal hidden event fired!');
        self.onModalHidden();
      });
    }

    // Set up compose button click handler
    if (this.composeBtn) {
      this.composeBtn.addEventListener('click', function(e) {
        console.log('🖱️ Compose button clicked!');
        self.handleComposeClick(e);
      });
    }

    // Set up CC/BCC toggle functionality
    this.initializeCCBCCToggles();

    // Set up close button functionality
    this.initializeCloseHandlers();
  }

  initializeSearch() {
    const searchForm = document.querySelector('.inbox-header-top form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        const searchInput = searchForm.querySelector('input[name="q"]');
        if (!searchInput.value.trim()) {
          e.preventDefault();
          return;
        }
      });
    }

    // Enhanced search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
      });

      searchInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
    }
  }

  initializeMessageList() {
    // Message row click handlers
    document.querySelectorAll('.message-row').forEach(function(row) {
      row.addEventListener('click', function() {
        const messageId = this.dataset.messageId;
        if (messageId) {
          window.location.href = '/my-account/inbox/message/' + messageId;
        }
      });
    });
  }

  handleComposeClick(e) {
    console.log('📝 Button attributes:', {
      'data-bs-toggle': this.composeBtn.getAttribute('data-bs-toggle'),
      'data-bs-target': this.composeBtn.getAttribute('data-bs-target')
    });

    // Try manual modal opening if Bootstrap doesn't work automatically
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      console.log('🔧 Trying Bootstrap 5 Modal...');
      try {
        const modal = new bootstrap.Modal(this.composeModal);
        modal.show();
        console.log('✅ Bootstrap 5 modal opened successfully');
      } catch (error) {
        console.error('❌ Bootstrap 5 modal failed:', error);
      }
    } else {
      console.log('🔧 Trying manual modal opening...');
      this.composeModal.style.display = 'block';
      this.composeModal.classList.add('show');
      document.body.classList.add('modal-open');

      // Create backdrop manually
      if (!document.querySelector('.modal-backdrop')) {
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        document.body.appendChild(backdrop);
        console.log('✅ Manual modal opened with backdrop');
      }
    }
  }

  onModalShown() {
    const toField = document.getElementById('compose-to');
    if (toField) {
      toField.focus();
      console.log('✅ Focused on To field');
    }

    try {
      // Initialize modal features
      if (window.EmailRichEditor) {
        window.EmailRichEditor.initialize();
      }
      if (window.EmailAttachments) {
        window.EmailAttachments.initialize();
      }
      if (window.EmailAutoComplete) {
        window.EmailAutoComplete.initialize();
      }
      console.log('✅ Modal features initialized');
    } catch (error) {
      console.error('❌ Error initializing modal features:', error);
    }
  }

  onModalHidden() {
    const form = document.getElementById('compose-form');
    if (form) form.reset();

    if (this.richEditorContent) {
      this.richEditorContent.innerHTML = '<p style="color: #aaa; margin: 0;">Write your message...</p>';
    }

    // Reset CC/BCC fields
    const ccField = document.getElementById('cc-field');
    const bccField = document.getElementById('bcc-field');
    if (ccField) ccField.classList.remove('show');
    if (bccField) bccField.classList.remove('show');
    const toggleCc = document.getElementById('toggle-cc');
    const toggleBcc = document.getElementById('toggle-bcc');
    if (toggleCc) toggleCc.style.display = '';
    if (toggleBcc) toggleBcc.style.display = '';

    // Clear attachments
    const attachmentList = document.getElementById('attachment-list');
    if (attachmentList) attachmentList.innerHTML = '';

    console.log('✅ Modal cleanup completed');
  }

  initializeCCBCCToggles() {
    document.addEventListener('click', function(e) {
      if (e.target.dataset.action === 'show-cc') {
        e.preventDefault();
        const ccField = document.getElementById('cc-field');
        ccField.classList.add('show');
        e.target.style.display = 'none';
        document.getElementById('compose-cc').focus();
      }
      if (e.target.dataset.action === 'show-bcc') {
        e.preventDefault();
        const bccField = document.getElementById('bcc-field');
        bccField.classList.add('show');
        e.target.style.display = 'none';
        document.getElementById('compose-bcc').focus();
      }
    });
  }

  initializeCloseHandlers() {
    const closeBtn = document.querySelector('.compose-close');
    const cancelBtn = document.querySelector('.footer-right .btn-secondary');
    var self = this;

    // Handle X button
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        console.log('✖️ Close button clicked');
        e.preventDefault();
        self.closeModal();
      });
    }

    // Handle Cancel button
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function(e) {
        console.log('🚫 Cancel button clicked');
        e.preventDefault();
        self.closeModal();
      });
    }
  }

  closeModal() {
    // Try Bootstrap modal hide
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      const modalInstance = bootstrap.Modal.getInstance(this.composeModal);
      if (modalInstance) {
        modalInstance.hide();
      } else {
        const modal = new bootstrap.Modal(this.composeModal);
        modal.hide();
      }
    } else {
      // Manual close
      this.composeModal.style.display = 'none';
      this.composeModal.classList.remove('show');
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    }
  }
}

// Initialize email client when DOM is ready
new EmailClient();