/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const sendRequest = require('./send-request');

/**
 * Open a URL in a centered popup window
 * @param {string} url
 * @param {string} name
 * @param {number} w - width
 * @param {number} h - height
 * @returns {Window}
 */
function openPopup(url, name, w, h) {
  const left = Math.round((window.screen.width - w) / 2);
  const top = Math.round((window.screen.height - h) / 2);
  const features =
    'width=' +
    w +
    ',height=' +
    h +
    ',left=' +
    left +
    ',top=' +
    top +
    ',menubar=no,toolbar=no,location=yes,status=yes,resizable=yes,scrollbars=yes';
  return window.open(url, name, features);
}

/**
 * Show the follow-up registration modal for a given domain
 * @param {string} domain
 */
function showRegistrationModal(domain) {
  const overlay = document.querySelector('#domain-register-overlay');
  const domainSpan = document.querySelector('#domain-register-name');
  if (!overlay) return;
  if (domainSpan) domainSpan.textContent = domain;

  // Build the setup URL with locale prefix and domain pre-filled
  const locale = typeof window.LOCALE === 'string' ? window.LOCALE : 'en';
  const setupLink = document.querySelector('#domain-register-setup');
  if (setupLink) {
    setupLink.href =
      '/' +
      locale +
      '/my-account/domains/new?domain=' +
      encodeURIComponent(domain);
  }

  // Show the overlay (it sits inside the same modal)
  overlay.style.display = 'block';

  // Hide the search form and results
  const searchBody = document.querySelector('#domain-search-body');
  if (searchBody) searchBody.style.display = 'none';
}

/**
 * Hide the registration overlay and restore the search view
 */
function hideRegistrationModal() {
  const overlay = document.querySelector('#domain-register-overlay');
  const searchBody = document.querySelector('#domain-search-body');
  if (overlay) overlay.style.display = 'none';
  if (searchBody) searchBody.style.display = 'block';
}

/**
 * Render a single domain result row
 * @param {Object} r - { domain, available, found, message }
 * @returns {string} HTML
 */
function renderResult(r) {
  const available = r.available || !r.found;
  const borderClass = available ? 'border-success' : 'border-secondary';
  const iconClass = available
    ? 'fa-check-circle text-success'
    : 'fa-times-circle text-muted';
  const badgeClass = available ? 'badge-success' : 'badge-secondary';
  const badgeText = available ? 'Available' : 'Registered';
  const registerUrl =
    'https://domains.cloudflare.com/?domain=' + encodeURIComponent(r.domain);
  const setupBtn = available
    ? '<button type="button" class="btn btn-sm btn-success ml-auto text-nowrap domain-register-btn" ' +
      'data-domain="' +
      r.domain +
      '" data-url="' +
      registerUrl +
      '">' +
      'Register <i class="fa fa-external-link"></i></button>'
    : '';
  return (
    '<div class="d-flex align-items-center p-2 mb-2 border rounded ' +
    borderClass +
    '">' +
    '<i class="fa ' +
    iconClass +
    ' fa-lg mr-3"></i>' +
    '<div class="mr-2 text-truncate">' +
    '<span class="font-weight-bold notranslate">' +
    r.domain +
    '</span>' +
    '</div>' +
    '<span class="badge ' +
    badgeClass +
    ' mr-2">' +
    badgeText +
    '</span>' +
    setupBtn +
    '</div>'
  );
}

/**
 * Attach click handlers to all Register buttons (uses event delegation)
 * @param {HTMLElement} container
 */
function attachRegisterHandlers(container) {
  container.addEventListener('click', function (e) {
    const btn = e.target.closest('.domain-register-btn');
    if (!btn) return;
    e.preventDefault();
    const { url, domain } = btn.dataset;
    // Open Cloudflare in a popup window (900x700)
    openPopup(url, 'cloudflare_register', 900, 700);
    // Show the follow-up registration modal
    showRegistrationModal(domain);
  });
}

/**
 * Render final results HTML
 * @param {Object[]} allResults
 * @param {HTMLElement} resultsContainer
 */
function renderFinalResults(allResults, resultsContainer) {
  if (allResults.length === 0) {
    resultsContainer.innerHTML =
      '<div class="alert alert-warning mb-0">' +
      '<i class="fa fa-info-circle mr-2"></i>' +
      'No results found. Please try again.' +
      '</div>';
    return;
  }

  // Sort: available first, then registered
  allResults.sort(function (a, b) {
    const aAvail = a.available || !a.found ? 1 : 0;
    const bAvail = b.available || !b.found ? 1 : 0;
    return bAvail - aAvail;
  });

  let html = '';
  let availCount = 0;
  for (const result of allResults) {
    if (result.available || !result.found) availCount++;
    html += renderResult(result);
  }

  const summary =
    '<div class="mb-3 small text-muted">' +
    '<i class="fa fa-info-circle mr-1"></i>' +
    'Found <strong>' +
    availCount +
    '</strong> available out of ' +
    allResults.length +
    ' checked' +
    '</div>';

  resultsContainer.innerHTML = summary + html;
}

/**
 * Process bulk domain check in batches
 * @param {string[]} domains
 * @param {Object} ctx - { statusText, resultsContainer, hideLoading, checkBulk }
 */
function processBulkCheck(domains, ctx) {
  const allResults = [];
  const batches = [];
  for (let i = 0; i < domains.length; i += 10) {
    batches.push(domains.slice(i, i + 10));
  }

  if (ctx.statusText) {
    ctx.statusText.textContent = 'Checking ' + domains.length + ' domains...';
  }

  let batchIndex = 0;

  function nextBatch() {
    if (batchIndex >= batches.length) {
      ctx.hideLoading();
      renderFinalResults(allResults, ctx.resultsContainer);
      return;
    }

    const batch = batches[batchIndex];
    batchIndex++;

    if (ctx.statusText) {
      ctx.statusText.textContent =
        'Checking batch ' + batchIndex + ' of ' + batches.length + '...';
    }

    ctx.checkBulk(batch).then(function (batchRes) {
      if (!batchRes.err && batchRes.body && batchRes.body.results) {
        for (let k = 0; k < batchRes.body.results.length; k++) {
          allResults.push(batchRes.body.results[k]);
        }
      }

      nextBatch();
    });
  }

  nextBatch();
}

/**
 * Initialize the domain search functionality
 */
function initDomainSearch() {
  const form = document.querySelector('#form-domain-search');
  if (!form) return;

  const input = document.querySelector('#domain-search-input');
  const resultsContainer = document.querySelector('#domain-search-results');
  const loading = document.querySelector('#domain-search-loading');
  const statusText = document.querySelector('#domain-search-status');
  const randomBtn = document.querySelector('#domain-search-random');
  const searchBtn = document.querySelector('#domain-search-btn');
  const backBtn = document.querySelector('#domain-register-back');

  if (!input || !resultsContainer || !loading) return;

  // Attach event delegation for Register buttons
  attachRegisterHandlers(resultsContainer);

  // Handle "Back to results" button in the registration overlay
  if (backBtn) {
    backBtn.addEventListener('click', function () {
      hideRegistrationModal();
    });
  }

  // When the modal is closed, reset the registration overlay
  const modal = document.querySelector('#modal-domain-search');
  if (modal) {
    modal.addEventListener('hidden.bs.modal', hideRegistrationModal);
    // Bootstrap 4 uses jQuery events
    if (window.jQuery) {
      window.jQuery(modal).on('hidden.bs.modal', hideRegistrationModal);
    }
  }

  /**
   * Show loading state
   * @param {string} msg
   */
  function showLoading(msg) {
    loading.style.display = 'block';
    if (statusText) statusText.textContent = msg || 'Generating suggestions...';
    resultsContainer.innerHTML = '';
    if (searchBtn) searchBtn.disabled = true;
  }

  /**
   * Hide loading state
   */
  function hideLoading() {
    loading.style.display = 'none';
    if (searchBtn) searchBtn.disabled = false;
  }

  /**
   * Show error message
   * @param {string} msg
   */
  function showError(msg) {
    hideLoading();
    resultsContainer.innerHTML =
      '<div class="alert alert-danger mb-0">' +
      '<i class="fa fa-exclamation-circle mr-2"></i>' +
      (msg || 'An error occurred. Please try again.') +
      '</div>';
  }

  /**
   * Get domain suggestions from server
   * @param {string} query
   * @returns {Promise<Object>}
   */
  function getSuggestions(query) {
    return sendRequest({ q: query || '' }, '/domain-suggestions');
  }

  /**
   * Check domains in bulk
   * @param {string[]} domains
   * @returns {Promise<Object>}
   */
  function checkBulk(domains) {
    return sendRequest({ domains }, '/domain-availability/bulk');
  }

  /**
   * Check a single domain
   * @param {string} domainName
   * @returns {Promise<Object>}
   */
  function checkSingle(domainName) {
    return sendRequest({ domainName }, '/domain-availability');
  }

  /**
   * Perform the search flow:
   * 1. Get suggestions from server (or use direct domain)
   * 2. Check availability via bulk endpoint
   * 3. Render results
   * @param {string} query
   */
  function performSearch(query) {
    // Ensure search view is visible (in case overlay was shown)
    hideRegistrationModal();
    showLoading('Generating suggestions...');

    // Step 1: Get suggestions
    getSuggestions(query).then(function (suggestRes) {
      if (suggestRes.err) {
        showError(suggestRes.err.message);
        return;
      }

      const { body } = suggestRes;
      if (!body || !body.domains || body.domains.length === 0) {
        hideLoading();
        resultsContainer.innerHTML =
          '<div class="alert alert-warning mb-0">' +
          '<i class="fa fa-info-circle mr-2"></i>' +
          'No suggestions found. Try a different keyword.' +
          '</div>';
        return;
      }

      const { domains } = body;

      // Step 2: Check availability
      if (body.type === 'single' && domains.length === 1) {
        // Single domain check
        if (statusText)
          statusText.textContent = 'Checking ' + domains[0] + '...';
        checkSingle(domains[0]).then(function (checkRes) {
          hideLoading();
          if (checkRes.err) {
            showError(checkRes.err.message);
            return;
          }

          resultsContainer.innerHTML = renderResult(checkRes.body);
        });
      } else {
        // Bulk check - process in batches of 10
        processBulkCheck(domains, {
          statusText,
          resultsContainer,
          hideLoading,
          checkBulk
        });
      }
    });
  }

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    performSearch(query);
  });

  // Handle random button
  if (randomBtn) {
    randomBtn.addEventListener('click', function () {
      input.value = '';
      performSearch('');
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDomainSearch);
} else {
  initDomainSearch();
}
