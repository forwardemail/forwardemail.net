const { Buffer } = require('node:buffer');

const Boom = require('@hapi/boom');
const isSANB = require('is-string-and-not-blank');
const striptags = require('striptags');

const env = require('#config/env');
const { encrypt } = require('#helpers/encrypt-decrypt');

async function encryptTxt(ctx) {
  if (!isSANB(ctx.request.body.input))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  // if string is longer than 1000 characters then error (rudimentary safeguard)
  if (ctx.request.body.input.length >= 1000)
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  const isPort = /forward-email-port/i.test(ctx.request.body.input);

  ctx.request.body.input = ctx.request.body.input
    .replace(/forward-email=/i, '')
    .replace(/forward-email-port=/i, '')
    .trim();

  if (
    ctx.request.body.input
      .toLowerCase()
      .includes('forward-email-site-verification=')
  )
    throw Boom.badRequest(ctx.translateError('INPUT_HAD_FE_SV'));

  if (!isSANB(ctx.request.body.input))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  const encryptedValue = encrypt(
    ctx.request.body.input.trim(),
    16,
    env.TXT_ENCRYPTION_KEY
  );

  const b64encryptedValue = Buffer.from(encryptedValue, 'utf8').toString(
    'base64'
  );

  if (ctx.api) {
    ctx.body = `${
      isPort ? 'forward-email-port' : 'forward-email'
    }=${b64encryptedValue}`;
    return;
  }

  const html = ctx.translate(
    'ENCRYPTED_VALUE',
    striptags(ctx.request.body.input.trim()),
    isPort ? 'forward-email-port' : 'forward-email',
    b64encryptedValue,
    `${isPort ? 'forward-email-port' : 'forward-email'}=${b64encryptedValue}`
  );

  const swal = {
    title: ctx.request.t('Success'),
    html,
    grow: 'row',
    confirmButtonText: ctx.translate('CLOSE_POPUP'),
    type: 'success',
    allowEscapeKey: false,
    allowOutsideClick: false,
    focusConfirm: false
  };

  if (ctx.accepts('html')) {
    ctx.flash('custom', swal);
    ctx.redirect(ctx.state.l('/encrypt'));
    return;
  }

  ctx.body = { swal };
}

module.exports = encryptTxt;
