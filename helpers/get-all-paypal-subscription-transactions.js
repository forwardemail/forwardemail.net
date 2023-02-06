const pWhilst = require('p-whilst');
const { paypalAgent } = require('#helpers/paypal');

// subscription is PayPal subscription object
async function getAllPayPalSubscriptionTransactions(subscription, agent) {
  const transactions = [];
  let currentPage = 1;
  let totalPages = 1;

  if (!agent) agent = await paypalAgent();

  // res.body.transactions = [ ... ]
  // res.body.total_pages = 3

  await pWhilst(
    () => currentPage === 1 || currentPage < totalPages,
    async () => {
      const res = await agent.get(
        `/v1/billing/subscriptions/${subscription.id}/transactions?start_time=${
          subscription.create_time
        }&end_time=${new Date().toISOString()}`
      );
      transactions.push(...res.body.transactions);
      currentPage++;
      totalPages = res.body.total_pages;
      if (totalPages > 1)
        throw new Error(
          'PayPal transactions endpoint had pagination but does not support it'
        );
    }
  );

  return transactions;
}

module.exports = getAllPayPalSubscriptionTransactions;
