/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');
const readline = require('node:readline');

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

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${question} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

async function getAllPlans(agent) {
  try {
    console.log('Fetching all subscription plans...');
    const allPlans = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { body: response } = await agent.get(
        `/v1/billing/plans?page=${page}&page_size=20`
      );

      if (response.plans && response.plans.length > 0) {
        allPlans.push(...response.plans);
        console.log(`Fetched ${response.plans.length} plans from page ${page}`);
        page++;

        // Check if there are more pages
        hasMore = response.plans.length === 20;
      } else {
        hasMore = false;
      }
    }

    console.log(`Total plans found: ${allPlans.length}`);
    return allPlans;
  } catch (err) {
    console.error('Error fetching plans:', err.message);
    throw err;
  }
}

async function getAllProducts(agent) {
  try {
    console.log('Fetching all catalog products...');
    const allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { body: response } = await agent.get(
        `/v1/catalogs/products?page=${page}&page_size=20`
      );

      if (response.products && response.products.length > 0) {
        allProducts.push(...response.products);
        console.log(
          `Fetched ${response.products.length} products from page ${page}`
        );
        page++;

        // Check if there are more pages
        hasMore = response.products.length === 20;
      } else {
        hasMore = false;
      }
    }

    console.log(`Total products found: ${allProducts.length}`);
    return allProducts;
  } catch (err) {
    console.error('Error fetching products:', err.message);
    throw err;
  }
}

async function deactivatePlan(agent, planId, planName) {
  try {
    console.log(`Deactivating plan: ${planName} (${planId})`);

    await agent.post(`/v1/billing/plans/${planId}/deactivate`).send({
      reason: 'Cleanup - removing all plans'
    });

    console.log(`✓ Deactivated plan: ${planName}`);
    return true;
  } catch (err) {
    if (
      err.status === 422 &&
      err.response?.body?.name === 'UNPROCESSABLE_ENTITY'
    ) {
      console.log(`⚠ Plan already inactive: ${planName}`);
      return true;
    }

    console.error(`✗ Failed to deactivate plan ${planName}:`, err.message);
    return false;
  }
}

async function deleteProduct(agent, productId, productName) {
  try {
    console.log(`Deleting product: ${productName} (${productId})`);

    await agent.delete(`/v1/catalogs/products/${productId}`);

    console.log(`✓ Deleted product: ${productName}`);
    return true;
  } catch (err) {
    if (err.status === 404) {
      console.log(`⚠ Product already deleted: ${productName}`);
      return true;
    }

    console.error(`✗ Failed to delete product ${productName}:`, err.message);
    return false;
  }
}

async function deleteAllPlansAndProducts() {
  try {
    console.log('Starting PayPal cleanup process...');

    const agent = await paypalAgent();

    // Get all plans and products
    const [plans, products] = await Promise.all([
      getAllPlans(agent),
      getAllProducts(agent)
    ]);

    if (plans.length === 0 && products.length === 0) {
      console.log('No plans or products found to delete.');
      return;
    }

    // Show summary and ask for confirmation
    console.log('\n' + '='.repeat(60));
    console.log('DELETION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Plans to deactivate: ${plans.length}`);
    console.log(`Products to delete: ${products.length}`);
    console.log('');

    if (plans.length > 0) {
      console.log('Plans:');
      for (const plan of plans) {
        console.log(`  - ${plan.name} (${plan.id}) - Status: ${plan.status}`);
      }

      console.log('');
    }

    if (products.length > 0) {
      console.log('Products:');
      for (const product of products) {
        console.log(`  - ${product.name} (${product.id})`);
      }

      console.log('');
    }

    console.log('⚠️  WARNING: This action cannot be undone!');
    console.log('='.repeat(60));

    const confirmed = await askConfirmation(
      'Are you sure you want to delete all PayPal plans and products?'
    );

    if (!confirmed) {
      console.log('Operation cancelled.');
      return;
    }

    // Deactivate all plans first
    if (plans.length > 0) {
      console.log('\n' + '='.repeat(40));
      console.log('DEACTIVATING PLANS');
      console.log('='.repeat(40));

      let deactivatedCount = 0;
      for (const plan of plans) {
        if (plan.status === 'ACTIVE') {
          const success = await deactivatePlan(agent, plan.id, plan.name);
          if (success) deactivatedCount++;
        } else {
          console.log(`⚠ Plan already inactive: ${plan.name}`);
          deactivatedCount++;
        }
      }

      console.log(`\nDeactivated ${deactivatedCount}/${plans.length} plans`);
    }

    // Delete all products
    if (products.length > 0) {
      console.log('\n' + '='.repeat(40));
      console.log('DELETING PRODUCTS');
      console.log('='.repeat(40));

      let deletedCount = 0;
      for (const product of products) {
        const success = await deleteProduct(agent, product.id, product.name);
        if (success) deletedCount++;
      }

      console.log(`\nDeleted ${deletedCount}/${products.length} products`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('CLEANUP COMPLETED');
    console.log('='.repeat(60));
    console.log('All PayPal subscription plans have been deactivated');
    console.log('All PayPal catalog products have been deleted');
    console.log('You can now run get-paypal-mapping.js to recreate them');
    console.log('='.repeat(60));
  } catch (err) {
    console.error('Failed to delete plans and products:', err);
    throw err;
  }
}

(async () => {
  await setupMongoose(logger);

  await deleteAllPlansAndProducts();

  process.exit(0);
})();
