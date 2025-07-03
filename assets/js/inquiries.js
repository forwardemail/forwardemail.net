/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const CodeMirror = require('codemirror');

// Load required CodeMirror addons
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchbrackets');
require('codemirror/addon/selection/active-line');
require('codemirror/mode/markdown/markdown');

const debounce = require('./debounce');

// Global CodeMirror instance
let cmEditor = null;

// Initialize when DOM is ready
$(document).ready(function() {
  console.log('Initializing CodeMirror for inquiries...');
  
  const $textarea = $('#input-message');
  if ($textarea.length === 0) {
    console.log('No textarea found with id input-message');
    return;
  }
  
  console.log('Found textarea, initializing CodeMirror...');
  
  try {
    // Initialize CodeMirror
    cmEditor = CodeMirror.fromTextArea($textarea[0], {
      mode: 'markdown',
      theme: 'default',
      lineNumbers: true,
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      styleActiveLine: true,
      placeholder: 'Write your response in markdown...'
    });
    
    console.log('CodeMirror initialized successfully');
    
    // Auto-save functionality
    function autoSave() {
      const content = cmEditor.getValue();
      const inquiryId = $('[data-inquiry-id]').data('inquiry-id');
      
      if (inquiryId && content) {
        localStorage.setItem(`inquiry-draft-${inquiryId}`, content);
        $('#save-indicator').text('Draft saved').removeClass('text-muted').addClass('text-success');
        
        setTimeout(() => {
          $('#save-indicator').text('Auto-saving...').removeClass('text-success').addClass('text-muted');
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
    
    // Event handlers
    cmEditor.on('change', debounce(autoSave, 2000));
    cmEditor.on('change', updateCount);
    
    // Load draft and update count
    loadDraft();
    updateCount();
    
    // Form submission handler
    $('form.confirm-prompt').on('submit', function() {
      console.log('Form submitting, syncing CodeMirror content...');
      
      // Sync content back to textarea
      const content = cmEditor.getValue();
      $textarea.val(content);
      
      console.log('Content synced:', content.substring(0, 100) + '...');
      
      // Clear draft
      const inquiryId = $('[data-inquiry-id]').data('inquiry-id');
      if (inquiryId) {
        localStorage.removeItem(`inquiry-draft-${inquiryId}`);
      }
      
      return true;
    });
    
  } catch (error) {
    console.error('Error initializing CodeMirror:', error);
  }
});

// Global toolbar functions
window.insertBold = function() {
  console.log('Insert bold clicked');
  if (!cmEditor) {
    console.error('CodeMirror not initialized');
    return;
  }
  
  const doc = cmEditor.getDoc();
  const cursor = doc.getCursor();
  const selection = doc.getSelection();
  
  if (selection) {
    doc.replaceSelection('**' + selection + '**');
  } else {
    doc.replaceRange('****', cursor);
    doc.setCursor(cursor.line, cursor.ch + 2);
  }
  cmEditor.focus();
};

window.insertItalic = function() {
  console.log('Insert italic clicked');
  if (!cmEditor) {
    console.error('CodeMirror not initialized');
    return;
  }
  
  const doc = cmEditor.getDoc();
  const cursor = doc.getCursor();
  const selection = doc.getSelection();
  
  if (selection) {
    doc.replaceSelection('*' + selection + '*');
  } else {
    doc.replaceRange('**', cursor);
    doc.setCursor(cursor.line, cursor.ch + 1);
  }
  cmEditor.focus();
};

window.insertLink = function() {
  console.log('Insert link clicked');
  if (!cmEditor) {
    console.error('CodeMirror not initialized');
    return;
  }
  
  const doc = cmEditor.getDoc();
  const cursor = doc.getCursor();
  const selection = doc.getSelection();
  
  if (selection) {
    doc.replaceSelection('[' + selection + '](url)');
  } else {
    doc.replaceRange('[Link Text](url)', cursor);
    doc.setCursor(cursor.line, cursor.ch + 1);
  }
  cmEditor.focus();
};

window.insertList = function() {
  console.log('Insert list clicked');
  if (!cmEditor) {
    console.error('CodeMirror not initialized');
    return;
  }
  
  const doc = cmEditor.getDoc();
  const cursor = doc.getCursor();
  doc.replaceRange('- ', cursor);
  cmEditor.focus();
};

window.showPreview = function() {
  console.log('Show preview clicked');
  if (!cmEditor) {
    console.error('CodeMirror not initialized');
    alert('Editor not ready. Please try again.');
    return;
  }
  
  const content = cmEditor.getValue();
  console.log('Preview content:', content);
  
  if (!content.trim()) {
    alert('Please write a response before previewing.');
    return;
  }
  
  // Simple markdown to HTML conversion
  let html = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>');
  
  // Wrap list items
  html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
  
  // Create modal
  const modalHtml = `
    <div class="modal fade" id="preview-modal" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Preview Response</h5>
            <button type="button" class="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="alert alert-info">
              <strong>Preview:</strong> This is how your response will appear.
            </div>
            <div class="border p-3 rounded bg-light">
              ${html}
            </div>
            <hr>
            <h6>Raw Markdown:</h6>
            <pre class="bg-light p-2 rounded small">${content}</pre>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Edit More</button>
            <button type="button" class="btn btn-primary" onclick="confirmSend()">
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
  $('#preview-modal').modal('show');
};

window.confirmSend = function() {
  console.log('Confirm send clicked');
  $('#preview-modal').modal('hide');
  $('form.confirm-prompt').submit();
};

// Debug function
window.debugCodeMirror = function() {
  console.log('CodeMirror instance:', cmEditor);
  if (cmEditor) {
    console.log('Current content:', cmEditor.getValue());
  }
};