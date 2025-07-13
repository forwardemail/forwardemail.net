/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');

const process = require('node:process');

// eslint-disable-next-line import/no-unassigned-import
require('#config/env');
// eslint-disable-next-line import/no-unassigned-import
require('#config/mongoose');

const Graceful = require('@ladjs/graceful');
const falso = require('@ngneat/falso');
const mongoose = require('mongoose');
const dayjs = require('dayjs-with-plugins');
const ms = require('ms');

const { Users, Domains, Payments, EnterpriseAccounts } = require('#models');
const setupMongoose = require('#helpers/setup-mongoose');

const ENTERPRISE_COUNT = 25; // Number of enterprise accounts to create

// Enterprise only supports 1-year one-time payments
const ENTERPRISE_DURATION = ms('1y');
const ENTERPRISE_PAYMENT_KIND = 'one-time';
const CURRENCIES = ['usd', 'eur', 'gbp', 'cad', 'aud'];

// Valid payment methods from Payment model enum
const PAYMENT_METHODS = [
  'card',
  'paypal',
  'visa',
  'mastercard',
  'amex',
  'discover',
  'klarna',
  'afterpay_clearpay',
  'amazon_pay',
  'cashapp',
  'ideal',
  'sofort',
  'sepa_debit',
  'us_bank_account',
  'link',
  'free_beta_program'
];

// Enterprise-specific constants
const ENTERPRISE_PLANS = ['enterprise'];

// Enterprise-focused business types for realistic company generation
const ENTERPRISE_BUSINESS_TYPES = [
  'Solutions',
  'Technologies',
  'Systems',
  'Dynamics',
  'Partners',
  'Labs',
  'Enterprise',
  'Communications',
  'Services',
  'Group',
  'Inc',
  'LLC',
  'Co',
  'Ltd'
];

const ENTERPRISE_PREFIXES = [
  'Global',
  'Advanced',
  'Digital',
  'Modern',
  'Strategic',
  'Professional',
  'Corporate',
  'Enterprise',
  'Business',
  'Innovation',
  'Integrated',
  'NextGen',
  'SecureComm',
  'CloudFirst'
];

const graceful = new Graceful({
  mongooses: [mongoose]
});

graceful.listen();

// Generate realistic enterprise company info using falso
const getRandomCompanyInfo = () => {
  // Generate company name using falso company name + business type
  const baseCompany = falso.randCompanyName();
  const businessType = falso.rand(ENTERPRISE_BUSINESS_TYPES);
  const prefix = falso.randBoolean()
    ? falso.rand(ENTERPRISE_PREFIXES) + ' '
    : '';
  const company = `${prefix}${baseCompany} ${businessType}`;

  // Generate domain from company name
  const domainBase = baseCompany.toLowerCase().replace(/[^a-z\d]/g, '');
  const tld = falso.rand([
    'com',
    'io',
    'net',
    'co',
    'tech',
    'solutions',
    'group'
  ]);
  const domain = `${domainBase}.${tld}`;

  // Generate realistic names using falso
  const firstName = falso.randFirstName();
  const lastName = falso.randLastName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;

  return {
    company,
    domain,
    email,
    firstName,
    lastName
  };
};

const createEnterpriseUser = async () => {
  const { company, domain, email, firstName, lastName } =
    getRandomCompanyInfo();

  // Check if user already exists
  const existingUser = await Users.findOne({ email });
  if (existingUser) {
    console.log(`User ${email} already exists, skipping...`);
    return existingUser;
  }

  // Randomly assign plan (more team plans for enterprise)
  const plan = falso.rand(ENTERPRISE_PLANS);

  // Create realistic enterprise user data
  const country = falso.randCountry();
  const createdAt = falso.randPastDate({ years: 2 });
  const planSetAt = dayjs(createdAt)
    .add(falso.randNumber({ min: 0, max: 30 }), 'days')
    .toDate();

  // Generate plan expiration (1-3 years from plan set date)
  const planExpiresAt = dayjs(planSetAt)
    .add(falso.randNumber({ min: 1, max: 3 }), 'years')
    .toDate();

  const userData = {
    email,
    plan,
    group: falso.randBoolean({ probability: 0.1 }) ? 'admin' : 'user', // 10% chance of being admin
    display_name: `${firstName} ${lastName}`,
    given_name: firstName,
    family_name: lastName,
    company_name: company,

    // Enterprise address information
    address_line1: falso.randStreetAddress(),
    address_city: falso.randCity(),
    address_state: falso.randState(),
    address_zip: falso.randZipCode(),
    address_country: country,

    // Enterprise features
    has_passed_kyc: falso.randBoolean({ probability: 0.8 }), // 80% have passed KYC
    has_verified_email: true,
    has_set_password: true,
    is_banned: false,
    is_removed: false,

    // Plan and timing
    plan_set_at: planSetAt,
    plan_expires_at: planExpiresAt,
    created_at: createdAt,
    updated_at: createdAt,

    // Enterprise settings
    timezone: falso.randTimeZone(),
    smtp_limit:
      plan === 'enterprise'
        ? falso.randNumber({ min: 1000, max: 10000 })
        : falso.randNumber({ min: 300, max: 1000 }),
    max_quota_per_alias: falso.randNumber({
      min: 1000000000,
      max: 10000000000
    }), // 1GB to 10GB in bytes

    // Subscription management (some have Stripe, some PayPal)
    stripe_customer_id: falso.randBoolean({ probability: 0.7 })
      ? `cus_${falso.randAlphaNumeric({ length: 14 }).join('')}`
      : null,
    paypal_payer_id: falso.randBoolean({ probability: 0.3 })
      ? falso.randAlphaNumeric({ length: 13 }).join('').toUpperCase()
      : null,

    // VAT for international businesses (use country abbreviation for VAT)
    company_vat:
      country !== 'United States' && falso.randBoolean({ probability: 0.6 })
        ? `${country.slice(0, 2).toUpperCase()}${falso.randNumber({
            min: 100000000,
            max: 999999999
          })}`
        : null,

    // Security
    otp_enabled: falso.randBoolean({ probability: 0.4 }), // 40% use 2FA

    // Newsletter and communication preferences
    has_newsletter: falso.randBoolean({ probability: 0.8 }) // 80% subscribed to newsletter
  };

  console.log(
    `Creating enterprise user: ${email} (${company}) - Plan: ${plan}`
  );

  try {
    const user = await Users.create(userData);

    // Create some domains for this enterprise user
    await createEnterpriseDomains(user, domain);

    // Create payment history for this user
    await createEnterprisePayments(user);

    // Create enterprise account record
    await createEnterpriseAccount(user, company, firstName, lastName);

    return user;
  } catch (err) {
    // Handle duplicate user errors by retrying
    if (err.code === 11000 || err.message.includes('email')) {
      console.log(`  User ${email} already exists, skipping...`);
      return null;
    }

    console.error(`  Error creating user ${email}:`, err.message);
    return null;
  }
};

const createEnterpriseDomains = async (user, primaryDomain) => {
  // Enterprise users typically have 1-5 domains
  const domainCount = falso.randNumber({ min: 1, max: 5 });
  const domains = [primaryDomain];

  // Add additional domains for larger enterprises
  if (domainCount > 1) {
    for (let i = 1; i < domainCount; i++) {
      const additionalDomain = `${falso.randDomainName()}.${falso.randDomainSuffix()}`;
      domains.push(additionalDomain);
    }
  }

  for (const domainName of domains) {
    try {
      // Check if domain already exists
      const existingDomain = await Domains.findOne({ name: domainName });
      if (existingDomain) {
        console.log(`Domain ${domainName} already exists, skipping...`);
        continue;
      }

      const domainData = {
        name: domainName,
        members: [
          {
            user: user._id,
            group: 'admin'
          }
        ],
        plan: user.plan,
        has_mx_record: falso.randBoolean({ probability: 0.9 }), // 90% have MX records set up
        has_txt_record: falso.randBoolean({ probability: 0.9 }), // 90% have TXT records set up
        has_dkim_record: falso.randBoolean({ probability: 0.8 }), // 80% have DKIM set up
        smtp_port: falso.rand([587, 465]),
        created_at: dayjs(user.created_at)
          .add(falso.randNumber({ min: 1, max: 7 }), 'days')
          .toDate()
      };

      await Domains.create(domainData);
      console.log(`  Created domain: ${domainName}`);
    } catch (err) {
      // Handle duplicate domain errors
      if (err.code === 11000 || err.message.includes('name')) {
        console.log(`  Domain ${domainName} already exists, skipping...`);
      } else {
        console.error(`  Error creating domain ${domainName}:`, err.message);
      }
    }
  }
};

// Helper function to get realistic enterprise payment amounts in cents
const getEnterprisePaymentAmount = (plan) => {
  // Enterprise payment amounts in cents (higher than regular users)
  const teamAmounts = [
    29999, // $299.99
    49999, // $499.99
    99999, // $999.99
    199999, // $1999.99
    299999 // $2999.99
  ];

  const enhancedAmounts = [
    9999, // $99.99
    19999, // $199.99
    29999, // $299.99
    49999 // $499.99
  ];

  const amounts = plan === 'enterprise' ? teamAmounts : enhancedAmounts;
  return falso.rand(amounts);
};

const createEnterprisePayments = async (user) => {
  // Enterprise users typically have 1-8 payments (subscriptions + one-time)
  const paymentCount = falso.randNumber({ min: 1, max: 8 });

  for (let i = 0; i < paymentCount; i++) {
    try {
      const kind = ENTERPRISE_PAYMENT_KIND;
      const method = user.stripe_customer_id
        ? falso.rand(['card', 'visa', 'mastercard', 'amex'])
        : user.paypal_payer_id
        ? 'paypal'
        : falso.rand(PAYMENT_METHODS);

      const currency = falso.rand(CURRENCIES);
      const amount = getEnterprisePaymentAmount(user.plan);
      const duration = ENTERPRISE_DURATION;

      // Payment date within the last 2 years
      const paymentDate = falso.randPastDate({ years: 2 });
      const createdAt = dayjs(paymentDate)
        .add(falso.randNumber({ min: 0, max: 60 }), 'minutes')
        .toDate();

      // Generate payment IDs based on method
      let stripePaymentIntentId = null;
      let paypalTransactionId = null;
      let last4 = null;
      let expMonth = null;
      let expYear = null;

      if (method === 'paypal') {
        paypalTransactionId = falso
          .randAlphaNumeric({ length: 17 })
          .join('')
          .toUpperCase();
      } else if (
        ['card', 'visa', 'mastercard', 'amex', 'discover'].includes(method)
      ) {
        stripePaymentIntentId = `pi_${falso
          .randAlphaNumeric({ length: 24 })
          .join('')}`;
        const cc = falso.randCreditCard();
        last4 = cc.number.slice(-4);
        const [month, year] = cc.untilEnd.split('/');
        expMonth = month;
        expYear = year;
      }

      const isRefunded =
        falso.randBoolean() && falso.randNumber({ min: 1, max: 100 }) <= 5; // 5% refund rate
      const amountRefunded = isRefunded
        ? falso.randNumber({ min: 0, max: amount })
        : 0;

      const paymentData = {
        user: user._id,
        amount,
        currency,
        plan: user.plan,
        kind,
        method,
        duration,
        invoice_at: paymentDate,
        created_at: createdAt,
        updated_at: createdAt,
        amount_refunded: amountRefunded,
        stripe_payment_intent_id: stripePaymentIntentId,
        paypal_transaction_id: paypalTransactionId,
        last4,
        exp_month: expMonth,
        exp_year: expYear,
        is_apple_pay: false,
        is_google_pay: false,
        receipt_sent_at: falso.randBoolean()
          ? dayjs(createdAt)
              .add(falso.randNumber({ min: 1, max: 30 }), 'minutes')
              .toDate()
          : null,
        refund_receipt_sent_at:
          isRefunded && falso.randBoolean()
            ? dayjs(createdAt)
                .add(falso.randNumber({ min: 1, max: 24 }), 'hours')
                .toDate()
            : null
      };

      console.log(
        `  Creating payment: $${(amount / 100).toFixed(
          2
        )} ${currency.toUpperCase()} (${method})`
      );

      await Payments.create(paymentData);
    } catch (err) {
      // Handle duplicate reference errors by retrying
      if (err.code === 11000 || err.message.includes('reference')) {
        console.log('  Duplicate payment reference detected, skipping...');
      } else {
        console.error(
          `  Error creating payment for user ${user.email}:`,
          err.message
        );
      }
    }
  }

  console.log(`  Created ${paymentCount} payments for ${user.email}`);
};

const createEnterpriseAccount = async (
  user,
  companyName,
  _firstName,
  _lastName
) => {
  try {
    // Check if enterprise account already exists
    const existingAccount = await EnterpriseAccounts.findOne({
      user: user._id
    });
    if (existingAccount) {
      console.log(
        `  Enterprise account for ${user.email} already exists, skipping...`
      );
      return existingAccount;
    }

    const enterpriseAccountData = {
      user: user._id,
      company_name: companyName,
      company_address: `${falso.randStreetAddress()}, ${falso.randCity()}, ${falso.randState()} ${falso.randZipCode()}`,
      is_active: true,

      created_at: user.created_at,
      updated_at: user.created_at
    };

    const enterpriseAccount = await EnterpriseAccounts.create(
      enterpriseAccountData
    );
    console.log(`  Created enterprise account for ${companyName}`);
    return enterpriseAccount;
  } catch (err) {
    // Handle duplicate enterprise account errors
    if (err.code === 11000 || err.message.includes('user')) {
      console.log(
        `  Enterprise account for ${user.email} already exists, skipping...`
      );
      return null;
    }

    console.error(
      `  Error creating enterprise account for ${user.email}:`,
      err.message
    );
    return null;
  }
};

(async () => {
  try {
    await setupMongoose();

    console.log(`Generating ${ENTERPRISE_COUNT} enterprise accounts...`);
    console.log('This includes users, domains, and payment history.\n');

    for (let count = 0; count < ENTERPRISE_COUNT; count++) {
      await createEnterpriseUser();

      // Add a small delay to avoid overwhelming the database
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }

    console.log(
      `\nSuccessfully generated ${ENTERPRISE_COUNT} enterprise accounts!`
    );
    console.log('Data includes:');
    console.log('- Enterprise users with team/enhanced_protection plans');
    console.log('- Company information and billing details');
    console.log('- Multiple domains per enterprise');
    console.log('- Payment history and subscriptions');
    console.log('- Realistic enterprise metrics for admin dashboard');

    process.exit(0);
  } catch (err) {
    console.error('Error generating enterprise data:', err);
    process.exit(1);
  }
})();
