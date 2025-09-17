/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// Wait for both DOM and jQuery to be ready
function initializeAliasSwitcher() {
  // Check if jQuery is available
  if (typeof $ === 'undefined') {
    setTimeout(initializeAliasSwitcher, 100);
    return;
  }

  $(document).ready(function() {
  const aliasDropdown = $('#aliasDropdown');
  const currentAliasDisplay = $('#current-alias-display');

  // Handle alias selection
  $(document).on('click', '.alias-option', function(e) {
    e.preventDefault();

    const aliasId = $(this).data('alias-id');
    const aliasEmail = $(this).data('alias-email');

    if ($(this).hasClass('active')) {
      // Already selected, just close dropdown
      aliasDropdown.dropdown('hide');
      return;
    }

    switchToAlias(aliasId, aliasEmail);
  });

  function switchToAlias(aliasId, aliasEmail) {
    // Show loading state
    currentAliasDisplay.html('<i class="fa fa-spinner fa-spin me-1"></i>Switching...');

    // Disable dropdown while switching
    aliasDropdown.prop('disabled', true);

    $.ajax({
      url: '/my-account/mailbox/switch-alias',
      method: 'POST',
      data: {
        alias_id: aliasId
      },
      success: function(data) {
        // Update display
        currentAliasDisplay.html(`
          <i class="fa fa-user me-1"></i>
          ${aliasEmail}
        `);

        // Show success message
        if (window.Swal) {
          Swal.fire({
            icon: 'success',
            title: 'Email Account Switched',
            text: `Now viewing ${aliasEmail}`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        }

        // Reload the page to refresh the inbox with the new alias
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: function(xhr, status, error) {
        console.error('Failed to switch alias:', error);

        // Restore original display (no need to reload - server-side rendered)
        currentAliasDisplay.html('<i class="fa fa-user me-1"></i>' + aliasEmail);

        // Show error message
        let errorMessage = 'Failed to switch email account. Please try again.';
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        }

        if (window.Swal) {
          Swal.fire({
            icon: 'error',
            title: 'Switch Failed',
            text: errorMessage,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 5000
          });
        }
      },
      complete: function() {
        // Re-enable dropdown
        aliasDropdown.prop('disabled', false);
      }
    });
  }

  // No need to refresh aliases - they're server-side rendered
  });
}

// Initialize when script loads
initializeAliasSwitcher();