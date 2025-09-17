/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Wait for both DOM and jQuery to be ready
function initializeRealTimeUpdates() {
  // Check if jQuery is available
  if (typeof $ === 'undefined') {
    setTimeout(initializeRealTimeUpdates, 100);
    return;
  }

  $(document).ready(function() {
  // Real-time email updates using WebSocket (for future enhancement)
  let reconnectTimeout;
  let wsConnection;
  let isConnected = false;

  function initializeRealTimeUpdates() {
    // Check if WebSocket is supported
    if (typeof WebSocket === 'undefined') {
      console.log('WebSocket not supported, falling back to polling');
      initializePolling();
      return;
    }

    // For now, we'll use polling as the WebSocket integration requires
    // the SQLite server setup which is complex for this POC
    console.log('Real-time updates: Using polling fallback');
    initializePolling();
  }

  function initializePolling() {
    // Poll for new messages every 30 seconds
    setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkForNewMessages();
      }
    }, 30000);

    // Check when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkForNewMessages();
      }
    });
  }

  function checkForNewMessages() {
    // Get current message count
    const currentMessageCount = $('.message-row').length;
    const currentFolder = getCurrentFolder();

    // Make a lightweight request to check for updates
    $.ajax({
      url: `/my-account/mailbox/${currentFolder}`,
      method: 'GET',
      data: {
        ajax: true,
        page: 1,
        limit: 1
      },
      success: function(data) {
        if (data.pagination && data.pagination.totalCount > currentMessageCount) {
          showNewMessageNotification(data.pagination.totalCount - currentMessageCount);
        }
      },
      error: function(xhr, status, error) {
        console.log('Failed to check for new messages:', error);
      }
    });
  }

  function getCurrentFolder() {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');
    return pathParts[pathParts.length - 1] || 'inbox';
  }

  function showNewMessageNotification(newMessageCount) {
    // Show a toast notification for new messages
    if (window.Swal && newMessageCount > 0) {
      Swal.fire({
        icon: 'info',
        title: 'New Messages',
        text: `You have ${newMessageCount} new message${newMessageCount > 1 ? 's' : ''}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: true,
        confirmButtonText: 'Refresh',
        showCancelButton: true,
        cancelButtonText: 'Dismiss',
        timer: 10000
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      // Fallback: show a simple browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Forward Email', {
          body: `You have ${newMessageCount} new message${newMessageCount > 1 ? 's' : ''}`,
          icon: '/favicon.ico'
        });
      }
    }

    // Update document title with unread count
    updateDocumentTitle(newMessageCount);
  }

  function updateDocumentTitle(unreadCount) {
    const baseTitle = 'Mailbox - Forward Email';
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
  }

  // Request notification permission when email client loads
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  // Initialize real-time features
  initializeRealTimeUpdates();
  requestNotificationPermission();

  // Auto-refresh functionality
  window.refreshInbox = function() {
    window.location.reload();
  };

  // Keyboard shortcuts removed

  // Keyboard shortcuts help removed
  });
}

// Initialize when script loads
initializeRealTimeUpdates();