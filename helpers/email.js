const Email = require('email-templates');
const _ = require('lodash');
const striptags = require('striptags');

const getEmailLocals = require('./get-email-locals');
const logger = require('./logger');
const config = require('#config');

const email = new Email(config.email);

// TODO: email-templates should strip tags from HTML in subject
// TODO: rewrite to create a new email, queue it, and send
module.exports = async (data) => {
  try {
    logger.info('sending email', { data });
    if (!_.isObject(data.locals)) data.locals = {};
    const emailLocals = await getEmailLocals();
    Object.assign(data.locals, emailLocals);
    if (data?.message?.subject)
      data.message.subject = striptags(data.message.subject);
    if (
      data?.message?.to &&
      data.message.to.endsWith(`@${config.removedEmailDomain}`)
    )
      return;
    const res = await email.send(data);
    logger.info('sent email', { data });
    return res;
  } catch (err) {
    logger.error(err, { data });
    throw err;
  }
};
