/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const $ = require('jquery');
const Swal = require('sweetalert2/dist/sweetalert2.js');
const { spinner: Spinner } = require('@ladjs/assets');

const sendRequest = require('./send-request');

const spinner = new Spinner($);

function handleBulkReply() {
  const checkboxes = $('#table-inquiries input[type="checkbox"]:checked');
  const inquiries = checkboxes
    .map(function () {
      return { id: $(this).val(), email: $(this).data('email') };
    })
    .get();

  const emails = inquiries.map((inquiry) => inquiry.email);
  const uniqueEmails = [...new Set(emails)];

  if (inquiries.length === 0) {
    Swal.fire(window._types.error, 'No inquiries selected.', 'error');
    return;
  }

  if (inquiries.length === 1) {
    const { origin, pathname } = window.location;
    const redirectUrl = `${origin}${pathname}/${inquiries[0].id}`;
    window.location.href = redirectUrl;
    return;
  }

  const $emailList = $('#modal-reply-to-email-list');
  $emailList.empty();

  for (const email of uniqueEmails) {
    const listItem = $('<li class="list-group-item">').text(email);
    $emailList.append(listItem);
  }

  $('#bulk-reply-modal').modal('show');
}

async function handleSubmitBulkReply() {
  console.log('testing');
  const checkboxes = $('#table-inquiries input[type="checkbox"]:checked');
  const inquiries = checkboxes
    .map(function () {
      return { id: $(this).val(), email: $(this).data('email') };
    })
    .get();

  const ids = inquiries.map((inquiry) => inquiry.id);

  const message = $('#textarea-bulk-reply-message').val();

  try {
    spinner.show();

    const url = `${window.location.pathname}/bulk`;
    const response = await sendRequest({ ids, message }, url);

    if (response.err) {
      console.log('error in response', { response });
      throw response.err;
    }

    spinner.hide();

    location.reload(true);
  } catch (err) {
    console.error(err);
    spinner.hide();
    Swal.fire(window._types.error, err.message, 'error');
  }
}

$('#table-inquiries').on('click', '#bulk-reply-button', handleBulkReply);
$('#submit-bulk-reply').on('click', handleSubmitBulkReply);
