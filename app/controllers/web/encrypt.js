const { Buffer } = require('node:buffer');

const isSANB = require('is-string-and-not-blank');
const Boom = require('@hapi/boom');

const env = require('#config/env');
const { encrypt } = require('#helpers/encrypt-decrypt');

async function encryptTxt(ctx) {
  if (!isSANB(ctx.request.body.input))
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  // if string is longer than 1000 characters then error (rudimentary safeguard)
  if (ctx.request.body.input.length >= 1000)
    throw Boom.badRequest(ctx.translateError('UNKNOWN_ERROR'));

  ctx.request.body.input = ctx.request.body.input
    .replace('forward-email=', '')
    .replace('forward-email-port=', '');

  if (
    ctx.request.body.input
      .toLowerCase()
      .includes('forward-email-site-verification=')
  )
    throw Boom.badRequest(ctx.translateError('INPUT_HAD_FE_SV'));

  // this is the output from encrypt() invocation
  const encryptedValue = await encrypt(
    ctx.request.body.input,
    12,
    env.TXT_ENCRYPTION_KEY,
    'chacha20-poly1305'
  );

  const b64encryptedValue = Buffer.from(encryptedValue, 'hex').toString(
    'base64'
  );

  const html = ctx.translate('ENCRYPTED_VALUE', b64encryptedValue);

  const swal = {
    title: ctx.request.t('Success'),
    html,
    type: 'success',
    allowEscapeKey: false,
    allowOutsideClick: false,
    focusConfirm: false
  };

  if (ctx.api) {
    ctx.body = b64encryptedValue;
    return;
  }

  if (ctx.accepts('html')) {
    ctx.flash('custom', swal);
    ctx.redirect(ctx.state.l('/encrypt'));
    return;
  }

  ctx.body = { swal };
}

module.exports = encryptTxt;
