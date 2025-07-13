/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const process = require('node:process');

const env = require('./env');

const isTest =
  !env.STRIPE_SECRET_KEY || env.STRIPE_SECRET_KEY.startsWith('sk_test');

const STRIPE_MAPPING = {
  enhanced_protection: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXyLFuf8FuIPJrPzAy9y7',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJOZ53q1Pa',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJt1actni9',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJakedaHaz',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLXzLFuf8FuIPJ3X8FfkRn',
      '2y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJFKeUg5kf',
      '3y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJWtqJ0Sa3'
        : 'price_1HbLY0LFuf8FuIPJkavB2UyM'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLglLFuf8FuIPJDmpFggVW',
      '60d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1Kq01ELFuf8FuIPJ6zCIlJaA',
      '90d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1Kq000LFuf8FuIPJEVDxj9gs',
      '180d': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLhaLFuf8FuIPJ2eUbPZfI',
      '1y': isTest
        ? 'price_1Hc3xlLFuf8FuIPJeQjmmDHr'
        : 'price_1HbLi4LFuf8FuIPJTSsQAit3'
    }
  },
  team: {
    'one-time': {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJFo5Q9L3E',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2ypLFuf8FuIPJxLg7dYmV',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJlvIwyhNT',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ00A3zNFB',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJENDdnNWs',
      '2y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJ8LSXjG48',
      '3y': isTest
        ? 'price_1Hc40fLFuf8FuIPJH6VlhUx3'
        : 'price_1Hc2yqLFuf8FuIPJSaHAcuOv'
    },
    subscription: {
      '30d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJa44UB4fa',
      '60d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yrLFuf8FuIPJ33ffzO71',
      '90d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJ3ev702mN',
      '180d': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJvNJJswbG',
      '1y': isTest
        ? 'price_1Hc40fLFuf8FuIPJfrJ8Uhf9'
        : 'price_1Hc2yqLFuf8FuIPJYbtNstWT'
    }
  },
  enterprise: {
    'one-time': {
      '1y': isTest ? 'price_1EntTestOneTime1y' : 'price_1EntProdOneTime1y'
    }
  }
};

const STRIPE_PRODUCTS = {
  // test
  prod_ICSwLEvQhmYDcy: 'team',
  prod_ICStJG6fjZhEjl: 'enhanced_protection',
  prod_EntTestProduct: 'enterprise',
  // live
  prod_ICRsgPRv2sVKlp: 'team',
  prod_IBizMRHKSjMQcl: 'enhanced_protection',
  prod_EntProdProduct: 'enterprise'
};

const PAYMENT_DURATIONS = new Set([
  '30d',
  '60d',
  '90d',
  '180d',
  '1y',
  '2y',
  '3y'
]);

const PAYPAL_MAPPING = {
  enhanced_protection: {
    '30d': 3,
    '60d': 6,
    '90d': 9,
    '180d': 18,
    '1y': 36,
    '2y': 72,
    '3y': 108
  },
  team: {
    '30d': 9,
    '60d': 18,
    '90d': 27,
    '180d': 54,
    '1y': 108,
    '2y': 216,
    '3y': 324
  },
  enterprise: {
    '1y': 1188
  }
};

const PAYPAL_PLAN_MAPPING = {
  enhanced_protection: {
    '30d': process.env.PAYPAL_ENHANCED_PLAN_30D,
    '60d': process.env.PAYPAL_ENHANCED_PLAN_60D,
    '90d': process.env.PAYPAL_ENHANCED_PLAN_90D,
    '180d': process.env.PAYPAL_ENHANCED_PLAN_180D,
    '1y': process.env.PAYPAL_ENHANCED_PLAN_1Y
  },
  team: {
    '30d': process.env.PAYPAL_TEAM_PLAN_30D,
    '60d': process.env.PAYPAL_TEAM_PLAN_60D,
    '90d': process.env.PAYPAL_TEAM_PLAN_90D,
    '180d': process.env.PAYPAL_TEAM_PLAN_180D,
    '1y': process.env.PAYPAL_TEAM_PLAN_1Y
  },
  enterprise: {
    '1y': process.env.PAYPAL_ENTERPRISE_PLAN_1Y
  }
};

const PAYPAL_PLAN_MAPPING_LEGACY = {
  enhanced_protection: {
    '30d': process.env.PAYPAL_ENHANCED_PLAN_30D_LEGACY,
    '60d': process.env.PAYPAL_ENHANCED_PLAN_60D_LEGACY,
    '90d': process.env.PAYPAL_ENHANCED_PLAN_90D_LEGACY,
    '180d': process.env.PAYPAL_ENHANCED_PLAN_180D_LEGACY,
    '1y': process.env.PAYPAL_ENHANCED_PLAN_1Y_LEGACY
  },
  team: {
    '30d': process.env.PAYPAL_TEAM_PLAN_30D_LEGACY,
    '60d': process.env.PAYPAL_TEAM_PLAN_60D_LEGACY,
    '90d': process.env.PAYPAL_TEAM_PLAN_90D_LEGACY,
    '180d': process.env.PAYPAL_TEAM_PLAN_180D_LEGACY,
    '1y': process.env.PAYPAL_TEAM_PLAN_1Y_LEGACY
  },
  enterprise: {
    '1y': process.env.PAYPAL_ENTERPRISE_PLAN_1Y_LEGACY
  }
};

const PAYPAL_ENDPOINT =
  env.NODE_ENV === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const paypalRestSdkConfig = {
  mode: env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  client_id: env.PAYPAL_CLIENT_ID,
  client_secret: env.PAYPAL_SECRET
};

const paypalRestSdkConfigLegacy = {
  mode: env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  client_id: env.PAYPAL_CLIENT_ID_LEGACY,
  client_secret: env.PAYPAL_SECRET_LEGACY
};

module.exports = {
  STRIPE_MAPPING,
  STRIPE_PRODUCTS,
  PAYMENT_DURATIONS,
  PAYPAL_MAPPING,
  PAYPAL_PLAN_MAPPING,
  PAYPAL_PLAN_MAPPING_LEGACY,
  PAYPAL_ENDPOINT,
  paypalRestSdkConfig,
  paypalRestSdkConfigLegacy
};
