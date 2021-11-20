const { promisify } = require('util');

const paypal = require('paypal-rest-sdk');
const superagent = require('superagent');
const ms = require('ms');

const config = require('../config');
const { paypalRestSdkConfig } = require('../config/payments');

const { PAYPAL_ENDPOINT } = config.payments;

paypal.configure(paypalRestSdkConfig);

const paypalAgent = {};
for (const verb of ['get', 'post', 'put', 'delete']) {
  paypalAgent[verb] = async (path) => {
    const token = await promisify(paypal.generateToken)();
    return superagent[verb](`${PAYPAL_ENDPOINT}${path}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', token)
      .timeout(ms('5s'));
  };
}

module.exports = { paypalAgent, paypal };
