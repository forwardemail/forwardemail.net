/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

async function uploadAliasMbox() {
  throw new Error('Coming soon');
  /*
  const redirectTo = ctx.state.l(
    `/my-account/domains/${ctx.state.domain.name}/aliases`
  );
  try {
    // ensure the size is not more than 2 GB
    // store the file to the server

    //
    // copy the file to the sqlite server in the background
    // once it's done then fire a websocket request to parse payload
    // which will then kick off the mbox import and email the user once done
    //

  } catch (err) {
    if (err && err.isBoom) throw err;
    if (isErrorConstructorName(err, 'ValidationError')) throw err;
    ctx.logger.fatal(err);
    ctx.flash('error', ctx.translate('UNKNOWN_ERROR'));
    const redirectTo = ctx.state.l(
      `/my-account/domains/${ctx.state.domain.name}/aliases`
    );
    if (ctx.accepts('html')) ctx.redirect(redirectTo);
    else ctx.body = { redirectTo };
  }
  */
}

module.exports = uploadAliasMbox;
