/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

const Graceful = require('@ladjs/graceful');
const mongoose = require('mongoose');

const logger = require('#helpers/logger');
const { paypalAgent } = require('#helpers/paypal');
const setupMongoose = require('#helpers/setup-mongoose');

const graceful = new Graceful({
  mongooses: [mongoose],
  logger
});

graceful.listen();

// Pricing structure from PAYPAL_MAPPING
const PAYPAL_PRICING = {
  enhanced_protection: {
    '30d': 3,
    '60d': 6,
    '90d': 9,
    '180d': 18,
    '1y': 36
  },
  team: {
    '30d': 9,
    '60d': 18,
    '90d': 27,
    '180d': 54,
    '1y': 108
  }
};

// Duration mapping for PayPal billing cycles
const DURATION_MAPPING = {
  '30d': { interval_unit: 'MONTH', interval_count: 1 },
  '60d': { interval_unit: 'MONTH', interval_count: 2 },
  '90d': { interval_unit: 'MONTH', interval_count: 3 },
  '180d': { interval_unit: 'MONTH', interval_count: 6 },
  '1y': { interval_unit: 'YEAR', interval_count: 1 }
};

async function findOrCreateProduct(agent, productName, description) {
  try {
    // List all products to find existing one
    console.log(`Looking for existing product: ${productName}`);
    const { body: productsResponse } = await agent.get(
      '/v1/catalogs/products?page_size=20'
    );

    const existingProduct = productsResponse.products?.find(
      (product) => product.name === productName
    );

    if (existingProduct) {
      console.log(
        `Found existing product: ${productName} (ID: ${existingProduct.id})`
      );
      return existingProduct.id;
    }

    // Create new product
    console.log(`Creating new product: ${productName}`);
    const productData = {
      name: productName,
      description,
      type: 'SERVICE',
      category: 'SOFTWARE'
    };

    const { body: newProduct } = await agent
      .post('/v1/catalogs/products')
      .send(productData);

    console.log(`Created product: ${productName} (ID: ${newProduct.id})`);
    return newProduct.id;
  } catch (err) {
    console.error(`Error with product ${productName}:`, err.message);
    throw err;
  }
}

async function findOrCreatePlan(
  agent,
  productId,
  planName,
  description,
  pricing,
  duration
) {
  try {
    // List all plans to find existing one
    console.log(`Looking for existing plan: ${planName}`);
    const { body: plansResponse } = await agent.get(
      `/v1/billing/plans?product_id=${productId}&page_size=20`
    );

    const existingPlan = plansResponse.plans?.find(
      (plan) => plan.name === planName
    );

    if (existingPlan) {
      console.log(`Found existing plan: ${planName} (ID: ${existingPlan.id})`);
      return existingPlan.id;
    }

    // Create new plan
    console.log(`Creating new plan: ${planName}`);
    const billingCycle = DURATION_MAPPING[duration];

    const planData = {
      product_id: productId,
      name: planName,
      description,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: billingCycle.interval_unit,
            interval_count: billingCycle.interval_count
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // Infinite cycles
          pricing_scheme: {
            fixed_price: {
              value: pricing.toString(),
              currency_code: 'USD'
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD'
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      }
    };

    const { body: newPlan } = await agent
      .post('/v1/billing/plans')
      .send(planData);

    console.log(`Created plan: ${planName} (ID: ${newPlan.id})`);
    return newPlan.id;
  } catch (err) {
    console.error(`Error with plan ${planName}:`, err.message);
    throw err;
  }
}

async function generatePayPalMapping() {
  try {
    console.log('Starting PayPal mapping generation...');

    const agent = await paypalAgent();
    const mapping = {};

    // Process each product type
    for (const [productType, durations] of Object.entries(PAYPAL_PRICING)) {
      console.log(`\nProcessing product type: ${productType}`);

      // Create or find product
      const productName =
        productType === 'enhanced_protection'
          ? 'Forward Email Enhanced Protection'
          : 'Forward Email Team Plan';
      const productDescription =
        productType === 'enhanced_protection'
          ? 'Enhanced email protection and privacy features'
          : 'Team collaboration and advanced email management';

      const productId = await findOrCreateProduct(
        agent,
        productName,
        productDescription
      );

      // Initialize mapping for this product type
      mapping[productType] = {};

      // Process each duration
      for (const [duration, pricing] of Object.entries(durations)) {
        console.log(`\nProcessing duration: ${duration} for ${productType}`);

        const planName = `${productName} - ${duration.toUpperCase()}`;
        const planDescription = `${productDescription} - ${duration} billing cycle`;

        const planId = await findOrCreatePlan(
          agent,
          productId,
          planName,
          planDescription,
          pricing,
          duration
        );

        mapping[productType][duration] = planId;
      }
    }

    // Generate the output
    console.log('\n' + '='.repeat(80));
    console.log('PAYPAL_PLAN_MAPPING GENERATED SUCCESSFULLY!');
    console.log('='.repeat(80));
    console.log('\nAdd these to your .env file:');
    console.log('');

    // Enhanced Protection Plans
    console.log('# Enhanced Protection Plans');
    for (const [duration, planId] of Object.entries(
      mapping.enhanced_protection
    )) {
      const envVar = `PAYPAL_ENHANCED_PLAN_${duration.toUpperCase()}`;
      console.log(`${envVar}=${planId}`);
    }

    console.log('');

    // Team Plans
    console.log('# Team Plans');
    for (const [duration, planId] of Object.entries(mapping.team)) {
      const envVar = `PAYPAL_TEAM_PLAN_${duration.toUpperCase()}`;
      console.log(`${envVar}=${planId}`);
    }

    console.log('');
    console.log('='.repeat(80));
    console.log('Copy the above environment variables to your .env file');
    console.log('='.repeat(80));

    return mapping;
  } catch (err) {
    console.error('Failed to generate PayPal mapping:', err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  await generatePayPalMapping();

  process.exit(0);
})();
