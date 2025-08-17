/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Swal = require('sweetalert2/dist/sweetalert2.js');
const { spinner: Spinner } = require('@ladjs/assets');

const sendRequest = require('./send-request');

const spinner = new Spinner($);

// Enhanced functionality for Email API-based inquiries
class InquiryEnhancements {
  constructor() {
    this.init();
  }

  init() {
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Add visual enhancements
    this.addVisualEnhancements();
    
    // Enhanced status indicators
    this.updateStatusIndicators();
  }

  addVisualEnhancements() {
    // Add loading states to action buttons
    $('.btn').on('click', function() {
      if (!$(this).hasClass('no-loading')) {
        $(this).prop('disabled', true);
        setTimeout(() => $(this).prop('disabled', false), 2000);
      }
    });
  }

  updateStatusIndicators() {
    // Update row highlighting based on status - use white background instead
    $('tr').each(function() {
      const $row = $(this);
      if ($row.find('.badge-warning').length > 0) {
        $row.addClass('bg-white');
      }
    });
  }
}

// Initialize enhancements
$(document).ready(() => {
  new InquiryEnhancements();
});

// Bulk functionality removed - now focusing on individual inquiry management
