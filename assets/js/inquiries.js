/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const CodeMirror = require('codemirror');
const markdownIt = require('markdown-it');

// Load required CodeMirror addons
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/markdown/markdown');

const debounce = require('./debounce');

// Global CodeMirror instance
let cmEditor = null;

// Auto-save functionality
function autoSave() {
  const content = cmEditor.getValue();
  const inquiryId = $('[data-inquiry-id]').data('inquiry-id');

  if (inquiryId && content) {
    localStorage.setItem(`inquiry-draft-${inquiryId}`, content);
    $('#save-indicator')
      .text('Draft saved')
      .removeClass('text-muted')
      .addClass('text-success');

    setTimeout(() => {
      $('#save-indicator')
        .text('Auto-saving...')
        .removeClass('text-success')
        .addClass('text-muted');
    }, 2000);
  }
}

// Load saved draft
function loadDraft() {
  const inquiryId = $('[data-inquiry-id]').data('inquiry-id');
  if (inquiryId) {
    const draft = localStorage.getItem(`inquiry-draft-${inquiryId}`);
    if (draft) {
      cmEditor.setValue(draft);
    }
  }
}

// Update character count
function updateCount() {
  const content = cmEditor.getValue();
  const chars = content.length;
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  $('#character-count').text(`${chars} characters, ${words} words`);
}

// Initialize when DOM is ready
$(document).ready(function () {
  console.log('Initializing CodeMirror for inquiries...');

  const $textarea = $('#inquiry-response-editor');
  if ($textarea.length === 0) {
    console.log('No textarea found with id inquiry-response-editor');
    return;
  }

  console.log('Found textarea, initializing CodeMirror...');

  try {
    // Initialize CodeMirror with enhanced configuration
    cmEditor = CodeMirror.fromTextArea($textarea[0], {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: false,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      styleActiveLine: true,
      placeholder:
        'Write your response here... You can use Markdown formatting.',
      extraKeys: {
        'Ctrl-Enter'() {
          $('form.confirm-prompt').submit();
        },
        'Cmd-Enter'() {
          $('form.confirm-prompt').submit();
        }
      },
      viewportMargin: Number.POSITIVE_INFINITY,
      spellcheck: true,
      inputStyle: 'textarea'
    });

    console.log('CodeMirror initialized successfully');

    // Event handlers
    cmEditor.on('change', debounce(autoSave, 2000));
    cmEditor.on('change', updateCount);

    // Load draft and update count
    loadDraft();
    updateCount();

    // Form submission handler
    $('form.confirm-prompt').on('submit', function () {
      console.log('Form submitting, syncing CodeMirror content...');

      // Sync content back to textarea
      const content = cmEditor.getValue();
      $textarea.val(content);

      console.log('Content synced:', content.slice(0, 100) + '...');

      // Clear draft
      const inquiryId = $('[data-inquiry-id]').data('inquiry-id');
      if (inquiryId) {
        localStorage.removeItem(`inquiry-draft-${inquiryId}`);
      }

      return true;
    });
  } catch (err) {
    console.error('Error initializing CodeMirror:', err);
  }
});

// Preview and utility functions

window.showPreview = function () {
  console.log('Show preview clicked');
  
  let content = '';
  
  // Try to get content from CodeMirror first, then fallback to textarea
  if (cmEditor) {
    content = cmEditor.getValue();
    console.log('Got content from CodeMirror');
    console.log({ content });
  } else {
    // Fallback to textarea if CodeMirror is not available
    const textarea = document.getElementById('inquiry-response-editor');
    if (textarea) {
      content = textarea.value;
      console.log('Got content from textarea fallback');
    } else {
      console.error('Neither CodeMirror nor textarea found');
      return;
    }
  }
  
  console.log('Preview content length:', content.length);
  console.log('Preview content:', content.substring(0, 200) + '...');

  if (!content.trim()) {
    // Create a notification instead of alert
    const notification = $('<div class="alert alert-warning alert-dismissible fade show mt-2" role="alert">' +
      '<i class="fa fa-exclamation-triangle mr-1"></i>' +
      'Please write a response before previewing.' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span>&times;</span>' +
      '</button>' +
      '</div>');
    
    $('.editor-container').before(notification);
    setTimeout(() => notification.fadeOut(), 3000);
    return;
  }

  try {
    // Ensure CodeMirror content is synced to textarea if available
    if (cmEditor) {
      const textarea = document.getElementById('inquiry-response-editor');
      console.log({ textarea });
      if (textarea) {
        textarea.value = content;
        console.log('Synced content to textarea');
      }
    }
    
    let html = '';
    
    // Check if markdownIt is available
    if (typeof markdownIt === 'function') {
      // Initialize markdown-it with enhanced options
      const md = markdownIt({
        html: false,
        xhtmlOut: false,
        breaks: true,
        linkify: true,
        typographer: true
      });

      // Convert markdown to HTML
      html = md.render(content);
      console.log('Converted HTML with markdown-it:', html.length, 'characters');
    } else {
      console.warn('markdown-it not available, using basic conversion');
      // Basic markdown conversion fallback
      html = content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      
      // Wrap in paragraphs
      html = '<p>' + html + '</p>';
      
      html = html.replace(/<li>[\s\S]*?<\/li>/g, '<ul>$&</ul>');
    }
    
    console.log('Final HTML preview length:', html.length);

    // Escape content for safe insertion into template
    const escapedContent = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    // Create modal
    const modalHtml = `
      <div class="modal fade" id="preview-modal" tabindex="-1" role="dialog" aria-labelledby="preview-modal-title" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="preview-modal-title">
                <i class="fa fa-eye mr-2"></i>
                Preview Response
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="alert alert-info">
                <i class="fa fa-info-circle mr-1"></i>
                <strong>Preview:</strong> This is how your response will appear to the recipient.
              </div>
              <div class="preview-content border p-3 rounded bg-white">
                ${html}
              </div>
              <hr>
              <h6>
                <i class="fa fa-code mr-1"></i>
                Raw Markdown:
              </h6>
              <pre class="bg-light p-2 rounded small">${escapedContent}</pre>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">
                <i class="fa fa-pencil mr-1"></i>
                Edit More
              </button>
              <button type="button" class="btn btn-primary" onclick="window.confirmSend()">
                <i class="fa fa-paper-plane mr-1"></i>
                Send Response
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Remove existing modal and show new one
    $('#preview-modal').remove();
    $('body').append(modalHtml);
    
    // Show modal with proper Bootstrap method
    const $modal = $('#preview-modal');
    
    // Add event listeners for debugging
    $modal.on('shown.bs.modal', function() {
      console.log('Modal is now visible');
    });
    
    $modal.on('hidden.bs.modal', function() {
      console.log('Modal is now hidden');
      $modal.remove(); // Clean up when hidden
    });
    
    // Show the modal
    $modal.modal({
      backdrop: true,
      keyboard: true,
      focus: true,
      show: true
    });
    
    console.log('Modal created and show() called');
    
    // Fallback: if modal doesn't show within 1 second, try alternative method
    setTimeout(() => {
      if (!$modal.hasClass('show')) {
        console.warn('Modal not showing, trying alternative method');
        $modal.addClass('show').css('display', 'block');
        $('body').addClass('modal-open');
      }
    }, 1000);
    
  } catch (error) {
    console.error('Error creating preview:', error);
    
    // Show error notification
    const errorNotification = $('<div class="alert alert-danger alert-dismissible fade show mt-2" role="alert">' +
      '<i class="fa fa-exclamation-circle mr-1"></i>' +
      'Error creating preview. Please check the console for details.' +
      '<button type="button" class="close" data-dismiss="alert">' +
      '<span>&times;</span>' +
      '</button>' +
      '</div>');
    
    $('.editor-container').before(errorNotification);
    setTimeout(() => errorNotification.fadeOut(), 5000);
  }
};

window.confirmSend = function () {
  console.log('Confirm send clicked');
  $('#preview-modal').modal('hide');
  $('form.confirm-prompt').submit();
};

// Debug functions
window.debugCodeMirror = function () {
  console.log('CodeMirror instance:', cmEditor);
  if (cmEditor) {
    console.log('Current content:', cmEditor.getValue());
  }
  
  const textarea = document.getElementById('inquiry-response-editor');
  if (textarea) {
    console.log('Textarea value:', textarea.value);
  }
  
  console.log('markdownIt available:', typeof markdownIt === 'function');
};

// Test preview with sample content
window.testPreview = function() {
  console.log('Testing preview with sample content');
  
  if (cmEditor) {
    cmEditor.setValue('# Test Header\n\nThis is **bold** text and *italic* text.\n\n- List item 1\n- List item 2\n\n[Link example](https://example.com)');
  } else {
    const textarea = document.getElementById('inquiry-response-editor');
    if (textarea) {
      textarea.value = '# Test Header\n\nThis is **bold** text and *italic* text.\n\n- List item 1\n- List item 2\n\n[Link example](https://example.com)';
    }
  }
  
  // Trigger preview
  window.showPreview();
};
