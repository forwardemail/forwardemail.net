// Email Deliverability Tool - Minimal client-side JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Basic form validation for raw email analysis
  const form = document.querySelector('#deliverability-form');

  // Email form validation
  if (form) {
    form.addEventListener('submit', function (e) {
      const emlFile = form.querySelector('input[name="emlFile"]').files[0];
      const emailContent = form.querySelector('textarea[name="email"]').value;

      if (!emlFile && !emailContent.trim()) {
        e.preventDefault();
        showError(
          'Please provide either an .eml file or paste raw email content.'
        );
        return false;
      }

      // Show loading state during submission
      const analyzeBtn = document.querySelector('#analyze-btn');
      if (analyzeBtn) {
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML =
          '<i class="fa fa-spinner fa-spin me-2"></i>Analyzing...';
      }
    });
  }

  function showError(message) {
    // Simple error display
    const existingAlert = document.querySelector('.alert-danger');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show mt-3';
    alert.innerHTML =
      '<i class="fa fa-exclamation-circle me-2"></i>' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';

    const container = document.querySelector('.container');
    if (container) {
      container.append(alert);
    }

    // Auto-dismiss after 5 seconds
    setTimeout(function () {
      if (alert && alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  }

  // Initialize Bootstrap tooltips if any exist
  const tooltipTriggerList = Array.prototype.slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  if (tooltipTriggerList.length > 0 && typeof bootstrap !== 'undefined') {
    const tooltipList = [];
    for (const element of tooltipTriggerList) {
      tooltipList.push(new bootstrap.Tooltip(element));
    }
  }
});
