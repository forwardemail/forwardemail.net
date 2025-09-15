/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Email Attachments Handler
window.EmailAttachments = {
  fileInput: null,
  dropZone: null,
  attachmentList: null,
  browseBtn: null,
  initialized: false,
  attachments: [],

  initialize() {
    if (this.initialized) return;

    this.fileInput = document.getElementById('file-input');
    this.dropZone = document.getElementById('attachment-drop-zone');
    this.attachmentList = document.getElementById('attachment-list');
    this.browseBtn = document.getElementById('btn-browse');

    if (!this.fileInput || !this.dropZone || !this.attachmentList) {
      console.warn('Attachment elements not found');
      return;
    }

    this.setupEventHandlers();
    this.initialized = true;
    console.log('✅ Email attachments initialized');
  },

  setupEventHandlers() {
    var self = this;
    // File input change handler
    this.fileInput.addEventListener('change', function(e) {
      self.handleFiles(e.target.files);
    });

    // Browse button click
    if (this.browseBtn) {
      this.browseBtn.addEventListener('click', function() {
        self.fileInput.click();
      });
    }

    // Drop zone handlers
    this.dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      self.dropZone.classList.add('dragover');
    });

    this.dropZone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      self.dropZone.classList.remove('dragover');
    });

    this.dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      self.dropZone.classList.remove('dragover');
      self.handleFiles(e.dataTransfer.files);
    });

    // Click to browse
    this.dropZone.addEventListener('click', function() {
      self.fileInput.click();
    });
  },

  handleFiles(files) {
    var self = this;
    Array.from(files).forEach(function(file) {
      if (self.validateFile(file)) {
        self.addAttachment(file);
      }
    });
  },

  validateFile(file) {
    const maxSize = 25 * 1024 * 1024; // 25MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain', 'text/csv'
    ];

    if (file.size > maxSize) {
      alert(`File "${file.name}" is too large. Maximum size is 25MB.`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      alert(`File type "${file.type}" is not supported.`);
      return false;
    }

    return true;
  },

  addAttachment(file) {
    const attachmentId = 'attachment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

    const attachment = {
      id: attachmentId,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    };

    this.attachments.push(attachment);
    this.renderAttachment(attachment);
    console.log('✅ Added attachment:', file.name);
  },

  renderAttachment(attachment) {
    const attachmentEl = document.createElement('div');
    attachmentEl.className = 'attachment-item';
    attachmentEl.dataset.id = attachment.id;

    const fileIcon = this.getFileIcon(attachment.type);
    const fileSize = this.formatFileSize(attachment.size);

    attachmentEl.innerHTML = `
      <div class="attachment-info">
        <i class="fa ${fileIcon} attachment-icon"></i>
        <div class="attachment-details">
          <div class="attachment-name">${attachment.name}</div>
          <div class="attachment-size">${fileSize}</div>
        </div>
      </div>
      <button type="button" class="attachment-remove" data-id="${attachment.id}">
        <i class="fa fa-times"></i>
      </button>
    `;

    // Add remove handler
    const removeBtn = attachmentEl.querySelector('.attachment-remove');
    var self = this;
    removeBtn.addEventListener('click', function() {
      self.removeAttachment(attachment.id);
    });

    this.attachmentList.appendChild(attachmentEl);
  },

  removeAttachment(attachmentId) {
    this.attachments = this.attachments.filter(function(att) { return att.id !== attachmentId; });
    const element = this.attachmentList.querySelector(`[data-id="${attachmentId}"]`);
    if (element) {
      element.remove();
    }
    console.log('✅ Removed attachment:', attachmentId);
  },

  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fa-image';
    if (fileType === 'application/pdf') return 'fa-file-pdf';
    if (fileType.includes('word')) return 'fa-file-word';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'fa-file-excel';
    if (fileType.startsWith('text/')) return 'fa-file-text';
    return 'fa-file';
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  reset() {
    this.attachments = [];
    if (this.attachmentList) {
      this.attachmentList.innerHTML = '';
    }
    if (this.fileInput) {
      this.fileInput.value = '';
    }
  }
};