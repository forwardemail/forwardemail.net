# Як ми створили надійну платіжну систему за допомогою Stripe та PayPal: Потрійний підхід {#how-we-built-a-robust-payment-system-with-stripe-and-paypal-a-trifecta-approach}

<img loading="lazy" src="/img/articles/payment-trifecta.webp" alt="Payment system with Stripe and PayPal" class="rounded-lg" />

## Зміст {#table-of-contents}

* [Передмова](#foreword)
* [Проблема: Кілька платіжних систем, одне джерело правди](#the-challenge-multiple-payment-processors-one-source-of-truth)
* [Підхід Trifecta: три рівні надійності](#the-trifecta-approach-three-layers-of-reliability)
* [Рівень 1: Перенаправлення після оформлення замовлення](#layer-1-post-checkout-redirects)
  * [Реалізація Stripe Checkout](#stripe-checkout-implementation)
  * [Процес оплати PayPal](#paypal-payment-flow)
* [Рівень 2: Обробники вебхуків з перевіркою підпису](#layer-2-webhook-handlers-with-signature-verification)
  * [Реалізація вебхука Stripe](#stripe-webhook-implementation)
  * [Реалізація вебхука PayPal](#paypal-webhook-implementation)
* [Рівень 3: Автоматизовані завдання з Bree](#layer-3-automated-jobs-with-bree)
  * [Перевірка точності підписки](#subscription-accuracy-checker)
  * [Синхронізація підписок PayPal](#paypal-subscription-synchronization)
* [Обробка пограничних випадків](#handling-edge-cases)
  * [Виявлення та запобігання шахрайству](#fraud-detection-and-prevention)
  * [Вирішення спорів](#dispute-handling)
* [Повторне використання коду: принципи KISS та DRY](#code-reuse-kiss-and-dry-principles)
* [Впровадження вимог до підписки VISA](#visa-subscription-requirements-implementation)
  * [Автоматичні сповіщення електронною поштою про попереднє поновлення](#automated-pre-renewal-email-notifications)
  * [Обробка пограничних випадків](#handling-edge-cases-1)
  * [Пробні періоди та умови підписки](#trial-periods-and-subscription-terms)
* [Висновок: Переваги нашого Trifecta підходу](#conclusion-the-benefits-of-our-trifecta-approach)

## Передмова {#foreword}

У Forward Email ми завжди надавали пріоритет створенню надійних, точних та зручних у використанні систем. Коли справа дійшла до впровадження нашої системи обробки платежів, ми знали, що нам потрібне рішення, яке могло б обробляти кілька платіжних процесорів, зберігаючи при цьому ідеальну узгодженість даних. У цій публікації блогу детально описано, як наша команда розробників інтегрувала Stripe та PayPal, використовуючи потрійний підхід, який забезпечує точність 1:1 у режимі реального часу в усій нашій системі.

## Виклик: Кілька платіжних систем, одне джерело достовірної інформації {#the-challenge-multiple-payment-processors-one-source-of-truth}

Як сервіс електронної пошти, орієнтований на конфіденційність, ми хотіли надати нашим користувачам варіанти оплати. Деякі віддають перевагу простоті платежів кредитними картками через Stripe, тоді як інші цінують додатковий рівень розділення, який надає PayPal. Однак підтримка кількох платіжних систем створює значні складнощі:

1. Як ми забезпечуємо узгодженість даних у різних платіжних системах?
2. Як ми вирішуємо граничні випадки, такі як суперечки, повернення коштів або невдалі платежі?
3. Як ми підтримуємо єдине джерело достовірної інформації в нашій базі даних?

Нашим рішенням було впровадження того, що ми називаємо «потрійним підходом» – трирівневої системи, яка забезпечує резервування та гарантує узгодженість даних незалежно від обставин.

## Підхід Trifecta: три рівні надійності {#the-trifecta-approach-three-layers-of-reliability}

Наша платіжна система складається з трьох критично важливих компонентів, які працюють разом для забезпечення ідеальної синхронізації даних:

1. **Переадресації після оформлення замовлення** – Збір інформації про оплату одразу після оформлення замовлення
2. **Обробники вебхуків** – Обробка подій у режимі реального часу від платіжних процесорів
3. **Автоматизовані завдання** – Періодична перевірка та узгодження даних про оплату

Давайте заглибимося в кожен компонент і подивимося, як вони працюють разом.

```mermaid
flowchart TD
    User([User]) --> |Selects plan| Checkout[Checkout Page]

    %% Layer 1: Post-checkout redirects
    subgraph "Layer 1: Post-checkout Redirects"
        Checkout --> |Credit Card| Stripe[Stripe Checkout]
        Checkout --> |PayPal| PayPal[PayPal Payment]

        Stripe --> |Success URL with session_id| SuccessPage[Success Page]
        PayPal --> |Return URL| SuccessPage

        SuccessPage --> |Verify payment| Database[(Database Update)]
    end

    %% Layer 2: Webhooks
    subgraph "Layer 2: Webhook Handlers"
        StripeEvents[Stripe Events] --> |Real-time notifications| StripeWebhook[Stripe Webhook Handler]
        PayPalEvents[PayPal Events] --> |Real-time notifications| PayPalWebhook[PayPal Webhook Handler]

        StripeWebhook --> |Verify signature| ProcessStripeEvent[Process Stripe Event]
        PayPalWebhook --> |Verify signature| ProcessPayPalEvent[Process PayPal Event]

        ProcessStripeEvent --> Database
        ProcessPayPalEvent --> Database
    end

    %% Layer 3: Automated jobs
    subgraph "Layer 3: Bree Automated Jobs"
        BreeScheduler[Bree Scheduler] --> StripeSync[Stripe Sync Job]
        BreeScheduler --> PayPalSync[PayPal Sync Job]
        BreeScheduler --> AccuracyCheck[Subscription Accuracy Check]

        StripeSync --> |Verify & reconcile| Database
        PayPalSync --> |Verify & reconcile| Database
        AccuracyCheck --> |Ensure consistency| Database
    end

    %% Edge cases
    subgraph "Edge Case Handling"
        ProcessStripeEvent --> |Fraud detection| FraudCheck[Fraud Check]
        ProcessPayPalEvent --> |Dispute created| DisputeHandler[Dispute Handler]

        FraudCheck --> |Ban user if fraudulent| Database
        DisputeHandler --> |Accept claim & refund| Database

        FraudCheck --> |Send alert| AdminNotification[Admin Notification]
        DisputeHandler --> |Send alert| AdminNotification
    end

    %% Style definitions
    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;
    classDef tertiary fill:green,stroke:#333,stroke-width:1px;

    class Checkout,SuccessPage primary;
    class Stripe,PayPal,StripeWebhook,PayPalWebhook,BreeScheduler secondary;
    class FraudCheck,DisputeHandler tertiary;
```

## Рівень 1: Перенаправлення після оформлення замовлення {#layer-1-post-checkout-redirects}

Перший рівень нашого потрійного підходу реалізується одразу після того, як користувач завершує платіж. Як Stripe, так і PayPal надають механізми для перенаправлення користувачів назад на наш сайт з інформацією про транзакцію.

### Реалізація оформлення замовлення Stripe {#stripe-checkout-implementation}

Для Stripe ми використовуємо їхній API Checkout Sessions для створення безперебійного процесу оплати. Коли користувач вибирає план і вирішує оплатити кредитною карткою, ми створюємо сеанс оформлення замовлення з певними успішними результатами та скасовуємо URL-адреси:

```javascript
const options = {
  mode: paymentType === 'one-time' ? 'payment' : 'subscription',
  customer: ctx.state.user[config.userFields.stripeCustomerID],
  client_reference_id: reference,
  metadata: {
    plan
  },
  line_items: [
    {
      price,
      quantity: 1,
      description
    }
  ],
  locale: config.STRIPE_LOCALES.has(ctx.locale) ? ctx.locale : 'auto',
  cancel_url: `${config.urls.web}${ctx.path}${
    isMakePayment || isEnableAutoRenew ? '' : `/?plan=${plan}`
  }`,
  success_url: `${config.urls.web}${ctx.path}/?${
    isMakePayment || isEnableAutoRenew ? '' : `plan=${plan}&`
  }session_id={CHECKOUT_SESSION_ID}`,
  allow_promotion_codes: true
};

// Create the checkout session and redirect
const session = await stripe.checkout.sessions.create(options);
const redirectTo = session.url;
if (ctx.accepts('html')) {
  ctx.status = 303;
  ctx.redirect(redirectTo);
} else {
  ctx.body = { redirectTo };
}
```

Найважливішою частиною тут є параметр `success_url`, який включає `session_id` як параметр запиту. Коли Stripe перенаправляє користувача назад на наш сайт після успішної оплати, ми можемо використовувати цей ідентифікатор сеансу для перевірки транзакції та відповідного оновлення нашої бази даних.

### Процес оплати PayPal {#paypal-payment-flow}

Для PayPal ми використовуємо аналогічний підхід з їхнім API замовлень:

```javascript
const requestBody = {
  intent: 'CAPTURE',
  application_context: {
    cancel_url: `${config.urls.web}${ctx.path}${
      isMakePayment || isEnableAutoRenew ? '' : `/?plan=${plan}`
    }`,
    return_url: `${config.urls.web}${ctx.path}/?plan=${plan}`,
    brand_name: 'Forward Email',
    shipping_preference: 'NO_SHIPPING',
    user_action: 'PAY_NOW'
  },
  payer: {
    email_address: ctx.state.user.email
  },
  purchase_units: [
    {
      reference_id: ctx.state.user.id,
      description,
      custom_id: sku,
      invoice_id: reference,
      soft_descriptor: sku,
      amount: {
        currency_code: 'USD',
        value: price,
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: price
          }
        }
      },
      items: [
        {
          name,
          description,
          sku,
          unit_amount: {
            currency_code: 'USD',
            value: price
          },
          quantity: '1',
          category: 'DIGITAL_GOODS'
        }
      ]
    }
  ]
};
```

Подібно до Stripe, ми вказуємо параметри `return_url` та `cancel_url` для обробки переадресацій після оплати. Коли PayPal перенаправляє користувача назад на наш сайт, ми можемо зібрати платіжні дані та оновити нашу базу даних.

```mermaid
sequenceDiagram
    participant User
    participant FE as Forward Email
    participant Stripe
    participant PayPal
    participant DB as Database
    participant Bree as Bree Job Scheduler

    %% Initial checkout flow
    User->>FE: Select plan & payment method

    alt Credit Card Payment
        FE->>Stripe: Create Checkout Session
        Stripe-->>FE: Return session URL
        FE->>User: Redirect to Stripe Checkout
        User->>Stripe: Complete payment
        Stripe->>User: Redirect to success URL with session_id
        User->>FE: Return to success page
        FE->>Stripe: Verify session using session_id
        Stripe-->>FE: Return session details
        FE->>DB: Update user plan & payment status
    else PayPal Payment
        FE->>PayPal: Create Order
        PayPal-->>FE: Return approval URL
        FE->>User: Redirect to PayPal
        User->>PayPal: Approve payment
        PayPal->>User: Redirect to return URL
        User->>FE: Return to success page
        FE->>PayPal: Capture payment
        PayPal-->>FE: Return payment details
        FE->>DB: Update user plan & payment status
    end

    %% Webhook flow (asynchronous)
    Note over Stripe,PayPal: Payment events occur (async)

    alt Stripe Webhook
        Stripe->>FE: Send event notification
        FE->>FE: Verify webhook signature
        FE->>DB: Process event & update data
        FE-->>Stripe: Acknowledge receipt (200 OK)
    else PayPal Webhook
        PayPal->>FE: Send event notification
        FE->>FE: Verify webhook signature
        FE->>DB: Process event & update data
        FE-->>PayPal: Acknowledge receipt (200 OK)
    end

    %% Bree automated jobs
    Note over Bree: Scheduled jobs run periodically

    Bree->>Stripe: Get all customers & subscriptions
    Stripe-->>Bree: Return customer data
    Bree->>DB: Compare & reconcile data

    Bree->>PayPal: Get all subscriptions & transactions
    PayPal-->>Bree: Return subscription data
    Bree->>DB: Compare & reconcile data

    %% Edge case: Dispute handling
    Note over User,PayPal: User disputes a charge

    PayPal->>FE: DISPUTE.CREATED webhook
    FE->>PayPal: Accept claim automatically
    FE->>DB: Update user status
    FE->>User: Send notification email
```

## Рівень 2: Обробники вебхуків з перевіркою підпису {#layer-2-webhook-handlers-with-signature-verification}

Хоча перенаправлення після оформлення замовлення добре працюють у більшості сценаріїв, вони не є надійними. Користувачі можуть закрити браузер перед перенаправленням, або проблеми з мережею можуть перешкодити завершенню перенаправлення. Ось тут і знадобляться вебхуки.

Як Stripe, так і PayPal пропонують системи вебхуків, які надсилають сповіщення про платежі в режимі реального часу. Ми реалізували надійні обробники вебхуків, які перевіряють справжність цих сповіщень та обробляють їх відповідно.

### Реалізація вебхука Stripe {#stripe-webhook-implementation}

Наш обробник вебхуків Stripe перевіряє підпис вхідних подій вебхуків, щоб переконатися в їх легітимності:

```javascript
async function webhook(ctx) {
  const sig = ctx.request.get('stripe-signature');
  // throw an error if something was wrong
  if (!isSANB(sig))
    throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));
  const event = stripe.webhooks.constructEvent(
    ctx.request.rawBody,
    sig,
    env.STRIPE_ENDPOINT_SECRET
  );
  // throw an error if something was wrong
  if (!event)
    throw Boom.badRequest(ctx.translateError('INVALID_STRIPE_SIGNATURE'));
  ctx.logger.info('stripe webhook', { event });
  // return a response to acknowledge receipt of the event
  ctx.body = { received: true };
  // run in background
  processEvent(ctx, event)
    .then()
    .catch((err) => {
      ctx.logger.fatal(err, { event });
      // email admin errors
      emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Error with Stripe Webhook (Event ID ${event.id})`
        },
        locals: {
          message: `<pre><code>${safeStringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err, { event }));
    });
}
```

Функція `stripe.webhooks.constructEvent` перевіряє підпис за допомогою нашого секретного коду кінцевої точки. Якщо підпис дійсний, ми обробляємо подію асинхронно, щоб уникнути блокування відповіді вебхука.

### Реалізація вебхука PayPal {#paypal-webhook-implementation}

Аналогічно, наш обробник вебхуків PayPal перевіряє справжність вхідних сповіщень:

```javascript
async function webhook(ctx) {
  const response = await promisify(
    paypal.notification.webhookEvent.verify,
    paypal.notification.webhookEvent
  )(ctx.request.headers, ctx.request.body, env.PAYPAL_WEBHOOK_ID);
  // throw an error if something was wrong
  if (!_.isObject(response) || response.verification_status !== 'SUCCESS')
    throw Boom.badRequest(ctx.translateError('INVALID_PAYPAL_SIGNATURE'));
  // return a response to acknowledge receipt of the event
  ctx.body = { received: true };
  // run in background
  processEvent(ctx)
    .then()
    .catch((err) => {
      ctx.logger.fatal(err);
      // email admin errors
      emailHelper({
        template: 'alert',
        message: {
          to: config.email.message.from,
          subject: `Error with PayPal Webhook (Event ID ${ctx.request.body.id})`
        },
        locals: {
          message: `<pre><code>${safeStringify(
            parseErr(err),
            null,
            2
          )}</code></pre>`
        }
      })
        .then()
        .catch((err) => ctx.logger.fatal(err));
    });
}
```

Обидва обробники вебхуків дотримуються одного шаблону: перевіряють підпис, підтверджують отримання та обробляють подію асинхронно. Це гарантує, що ми ніколи не пропустимо подію оплати, навіть якщо перенаправлення після оформлення замовлення завершиться невдачею.

## Рівень 3: Автоматизовані завдання з Bree {#layer-3-automated-jobs-with-bree}

Останній рівень нашого потрійного підходу — це набір автоматизованих завдань, які періодично перевіряють та узгоджують дані про платежі. Ми використовуємо Bree, планувальник завдань для Node.js, для запуску цих завдань через регулярні проміжки часу.

### Перевірка точності підписки {#subscription-accuracy-checker}

Одним з наших ключових завдань є перевірка точності підписок, яка гарантує, що наша база даних точно відображає стан підписок у Stripe:

```javascript
async function mapper(customer) {
  // wait a second to prevent rate limitation error
  await setTimeout(ms('1s'));
  // check for user on our side
  let user = await Users.findOne({
    [config.userFields.stripeCustomerID]: customer.id
  })
    .lean()
    .exec();
  if (!user) return;
  if (user.is_banned) return;

  // if emails did not match
  if (user.email !== customer.email) {
    logger.info(
      `User email ${user.email} did not match customer email ${customer.email} (${customer.id})`
    );
    customer = await stripe.customers.update(customer.id, {
      email: user.email
    });
    logger.info(`Updated user email to match ${user.email}`);
  }

  // check for active subscriptions
  const [activeSubscriptions, trialingSubscriptions] = await Promise.all([
    stripe.subscriptions.list({
      customer: customer.id,
      status: 'active'
    }),
    stripe.subscriptions.list({
      customer: customer.id,
      status: 'trialing'
    })
  ]);

  // Combine active and trialing subscriptions
  let subscriptions = [
    ...activeSubscriptions.data,
    ...trialingSubscriptions.data
  ];

  // Handle edge case: multiple subscriptions for one user
  if (subscriptions.length > 1) {
    await logger.error(
      new Error(
        `We may need to refund: User had multiple subscriptions ${user.email} (${customer.id})`
      )
    );
    await emailHelper({
      template: 'alert',
      message: {
        to: config.email.message.from,
        subject: `User had multiple subscriptions ${user.email}`
      },
      locals: {
        message: `User ${user.email} (${customer.id}) had multiple subscriptions: ${JSON.stringify(
          subscriptions.map((s) => s.id)
        )}`
      }
    });
  }
}
```

Це завдання перевіряє наявність розбіжностей між нашою базою даних та Stripe, таких як невідповідні адреси електронної пошти або кілька активних підписок. Якщо виявляється будь-яка проблема, вона реєструє її та надсилає сповіщення нашій команді адміністраторів.

### Синхронізація підписки PayPal {#paypal-subscription-synchronization}

У нас є схожа робота для підписок PayPal:

```javascript
async function syncPayPalSubscriptionPayments() {
  const paypalCustomers = await Users.find({
    $or: [
      {
        [config.userFields.paypalSubscriptionID]: { $exists: true, $ne: null }
      },
      {
        [config.userFields.paypalPayerID]: { $exists: true, $ne: null }
      }
    ]
  })
    // sort by newest customers first
    .sort('-created_at')
    .lean()
    .exec();

  await logger.info(
    `Syncing payments for ${paypalCustomers.length} paypal customers`
  );

  // Process each customer and sync their payments
  const errorEmails = await pReduce(
    paypalCustomers,
    // Implementation details...
  );
}
```

Ці автоматизовані завдання слугують нашою останньою системою безпеки, гарантуючи, що наша база даних завжди відображає справжній стан підписок і платежів як у Stripe, так і в PayPal.

## Обробка граничних випадків {#handling-edge-cases}

Надійна платіжна система повинна коректно обробляти пограничні випадки. Давайте розглянемо, як ми обробляємо деякі поширені сценарії.

### Виявлення та запобігання шахрайству {#fraud-detection-and-prevention}

Ми впровадили складні механізми виявлення шахрайства, які автоматично виявляють та обробляють підозрілі платежі:

```javascript
case 'charge.failed': {
  // Get all failed charges in the last 30 days
  const charges = await stripe.charges.list({
    customer: event.data.object.customer,
    created: {
      gte: dayjs().subtract(1, 'month').unix()
    }
  });

  // Filter for declined charges
  const filtered = charges.data.filter(
    (d) => d.status === 'failed' && d.failure_code === 'card_declined'
  );

  // if not more than 5 then return early
  if (filtered.length < 5) break;

  // Check if user has verified domains
  const count = await Domains.countDocuments({
    members: {
      $elemMatch: {
        user: user._id,
        group: 'admin'
      }
    },
    plan: { $in: ['enhanced_protection', 'team'] },
    has_txt_record: true
  });

  if (!user.is_banned) {
    // If no verified domains, ban the user and refund all charges
    if (count === 0) {
      // Ban the user
      user.is_banned = true;
      await user.save();

      // Refund all successful charges
    }
  }
}
```

Цей код автоматично блокує користувачів, у яких було кілька невдалих платежів та немає перевірених доменів, що є вагомим показником шахрайської діяльності.

### Розгляд суперечок {#dispute-handling}

Коли користувач оскаржує стягнення плати, ми автоматично приймаємо претензію та вживаємо відповідних заходів:

```javascript
case 'CUSTOMER.DISPUTE.CREATED': {
  // accept claim
  const agent = await paypalAgent();
  await agent
    .post(`/v1/customer/disputes/${body.resource.dispute_id}/accept-claim`)
    .send({
      note: 'Full refund to the customer.'
    });

  // Find the payment in our database
  const payment = await Payments.findOne({ $or });
  if (!payment) throw new Error('Payment does not exist');

  const user = await Users.findById(payment.user);
  if (!user) throw new Error('User did not exist for customer');

  // Cancel the user's subscription if they have one
  if (isSANB(user[config.userFields.paypalSubscriptionID])) {
    try {
      const agent = await paypalAgent();
      await agent.post(
        `/v1/billing/subscriptions/${
          user[config.userFields.paypalSubscriptionID]
        }/cancel`
      );
    } catch (err) {
      // Handle subscription cancellation errors
    }
  }
}
```

Такий підхід мінімізує вплив суперечок на наш бізнес, водночас забезпечуючи хороший клієнтський досвід.

## Повторне використання коду: принципи KISS та DRY {#code-reuse-kiss-and-dry-principles}

У всій нашій платіжній системі ми дотримуємося принципів KISS (Keep It Simple, Stupid) та DRY (Don't Repeat Yourself). Ось кілька прикладів:

1. **Спільні допоміжні функції**: Ми створили допоміжні функції багаторазового використання для поширених завдань, таких як синхронізація платежів та надсилання електронних листів.

2. **Узгоджена обробка помилок**: Обробники вебхуків Stripe та PayPal використовують однаковий шаблон для обробки помилок та сповіщень адміністратора.

3. **Уніфікована схема бази даних**: Наша схема бази даних розроблена для врахування даних Stripe та PayPal, зі спільними полями для статусу платежу, суми та інформації про план.

4. **Централізована конфігурація**: конфігурація, пов’язана з оплатою, централізована в одному файлі, що спрощує оновлення цін та інформації про продукт.

```mermaid
graph TD
    subgraph "Code Reuse Patterns"
        A[Helper Functions] --> B[syncStripePaymentIntent]
        A --> C[syncPayPalOrderPaymentByPaymentId]
        A --> D[syncPayPalSubscriptionPaymentsByUser]
    end

    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;

    class A,P,V primary;
    class B,C,D,E,I,L,Q,R,S,W,X,Y,Z secondary;
```

```mermaid
graph TD
    subgraph "Code Reuse Patterns"
        E[Error Handling] --> F[Common Error Logging]
        E --> G[Admin Email Notifications]
        E --> H[User Notifications]
    end

    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;

    class A,P,V primary;
    class B,C,D,E,I,L,Q,R,S,W,X,Y,Z secondary;
```

```mermaid
graph TD
    subgraph "Code Reuse Patterns"
        I[Configuration] --> J[Centralized Payment Config]
        I --> K[Shared Environment Variables]
    end

    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;

    class A,P,V primary;
    class B,C,D,E,I,L,Q,R,S,W,X,Y,Z secondary;
```

```mermaid
graph TD
    subgraph "Code Reuse Patterns"
        L[Webhook Processing] --> M[Signature Verification]
        L --> N[Async Event Processing]
        L --> O[Background Processing]
    end

    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;

    class A,P,V primary;
    class B,C,D,E,I,L,Q,R,S,W,X,Y,Z secondary;
```

```mermaid
graph TD
    subgraph "KISS Principle"
        P[Simple Data Flow] --> Q[Unidirectional Updates]
        P --> R[Clear Responsibility Separation]

        S[Explicit Error Handling] --> T[No Silent Failures]
        S --> U[Comprehensive Logging]
    end

    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;

    class A,P,V primary;
    class B,C,D,E,I,L,Q,R,S,W,X,Y,Z secondary;
```

```mermaid
graph TD
    subgraph "DRY Principle"
        V[Shared Logic] --> W[Payment Processing Functions]
        V --> X[Email Templates]
        V --> Y[Validation Logic]

        Z[Common Database Operations] --> AA[User Updates]
        Z --> AB[Payment Recording]
    end

    classDef primary fill:blue,stroke:#333,stroke-width:2px;
    classDef secondary fill:red,stroke:#333,stroke-width:1px;

    class A,P,V primary;
    class B,C,D,E,I,L,Q,R,S,W,X,Y,Z secondary;
```

## Впровадження вимог до підписки VISA {#visa-subscription-requirements-implementation}

Окрім нашого тривимірного підходу, ми впровадили спеціальні функції, щоб відповідати вимогам VISA щодо підписки, одночасно покращуючи взаємодію з користувачами. Одна з ключових вимог VISA полягає в тому, що користувачів необхідно повідомляти перед стягненням плати за підписку, особливо під час переходу з пробної версії на платну.

### Автоматичні сповіщення електронною поштою про попереднє поновлення {#automated-pre-renewal-email-notifications}

Ми створили автоматизовану систему, яка ідентифікує користувачів з активними пробними підписками та надсилає їм сповіщення електронною поштою перед першим стягненням коштів. Це не лише забезпечує дотримання вимог VISA, але й зменшує кількість повернень платежів та підвищує задоволеність клієнтів.

Ось як ми реалізували цю функцію:

```javascript
// Find users with trial subscriptions who haven't received a notification yet
const users = await Users.find({
  $or: [
    {
      $and: [
        { [config.userFields.stripeSubscriptionID]: { $exists: true } },
        { [config.userFields.stripeTrialSentAt]: { $exists: false } },
        // Exclude subscriptions that have already had payments
        ...(paidStripeSubscriptionIds.length > 0
          ? [
              {
                [config.userFields.stripeSubscriptionID]: {
                  $nin: paidStripeSubscriptionIds
                }
              }
            ]
          : [])
      ]
    },
    {
      $and: [
        { [config.userFields.paypalSubscriptionID]: { $exists: true } },
        { [config.userFields.paypalTrialSentAt]: { $exists: false } },
        // Exclude subscriptions that have already had payments
        ...(paidPayPalSubscriptionIds.length > 0
          ? [
              {
                [config.userFields.paypalSubscriptionID]: {
                  $nin: paidPayPalSubscriptionIds
                }
              }
            ]
          : [])
      ]
    }
  ]
});

// Process each user and send notification
for (const user of users) {
  // Get subscription details from payment processor
  const subscription = await getSubscriptionDetails(user);

  // Calculate subscription duration and frequency
  const duration = getDurationFromPlanId(subscription.plan_id);
  const frequency = getHumanReadableFrequency(duration, user.locale);
  const amount = getPlanAmount(user.plan, duration);

  // Get user's domains for personalized email
  const domains = await Domains.find({
    'members.user': user._id
  }).sort('name').lean().exec();

  // Send VISA-compliant notification email
  await emailHelper({
    template: 'visa-trial-subscription-requirement',
    message: {
      to: user.receipt_email || user.email,
      ...(user.receipt_email ? { cc: user.email } : {})
    },
    locals: {
      user,
      firstChargeDate: new Date(subscription.start_time),
      frequency,
      formattedAmount: numeral(amount).format('$0,0,0.00'),
      domains
    }
  });

  // Record that notification was sent
  await Users.findByIdAndUpdate(user._id, {
    $set: {
      [config.userFields.paypalTrialSentAt]: new Date()
    }
  });
}
```

Ця реалізація гарантує, що користувачі завжди будуть поінформовані про майбутні платежі, а також отримають чітку інформацію про:

1. Коли відбудеться перше стягнення плати
2. Частота майбутніх стягнень плати (щомісяця, щорічно тощо)
3. Точна сума, яка з них стягуватиметься
4. На які домени поширюється їхня підписка

Автоматизуючи цей процес, ми забезпечуємо повну відповідність вимогам VISA (які вимагають повідомлення щонайменше за 7 днів до стягнення плати), одночасно зменшуючи кількість запитів до служби підтримки та покращуючи загальний досвід користувачів.

### Обробка граничних випадків {#handling-edge-cases-1}

Наша реалізація також включає надійну обробку помилок. Якщо під час процесу сповіщення щось піде не так, наша система автоматично попередить нашу команду:

```javascript
try {
  await mapper(user);
} catch (err) {
  logger.error(err);

  // Send alert to administrators
  await emailHelper({
    template: 'alert',
    message: {
      to: config.email.message.from,
      subject: 'VISA Trial Subscription Requirement Error'
    },
    locals: {
      message: `<pre><code>${safeStringify(
        parseErr(err),
        null,
        2
      )}</code></pre>`
    }
  });
}
```

Це гарантує, що навіть якщо виникне проблема із системою сповіщень, наша команда зможе швидко її вирішити та забезпечити дотримання вимог VISA.

Система сповіщень про підписки VISA – це ще один приклад того, як ми побудували нашу платіжну інфраструктуру з урахуванням як відповідності вимогам, так і зручності користувачів, доповнюючи наш потрійний підхід до забезпечення надійної та прозорої обробки платежів.

### Пробні періоди та умови підписки {#trial-periods-and-subscription-terms}

Для користувачів, які ввімкнули автоматичне поновлення існуючих планів, ми розраховуємо відповідний пробний період, щоб гарантувати, що з них не стягуватиметься плата, доки не закінчиться термін дії їхнього поточного плану:

```javascript
if (
  isEnableAutoRenew &&
  dayjs(ctx.state.user[config.userFields.planExpiresAt]).isAfter(
    dayjs()
  )
) {
  const hours = dayjs(
    ctx.state.user[config.userFields.planExpiresAt]
  ).diff(dayjs(), 'hours');

  // Handle trial period calculation
}
```

Ми також надаємо чітку інформацію про умови підписки, включаючи частоту виставлення рахунків та політику скасування, а також додаємо детальні метадані до кожної підписки для забезпечення належного відстеження та управління.

## Висновок: Переваги нашого підходу Trifecta {#conclusion-the-benefits-of-our-trifecta-approach}

Наш потрійний підхід до обробки платежів забезпечив кілька ключових переваг:

1. **Надійність**: Завдяки впровадженню трьох рівнів перевірки платежів ми гарантуємо, що жоден платіж не буде пропущено або неправильно оброблено.

2. **Точність**: Наша база даних завжди відображає справжній стан підписок і платежів як у Stripe, так і в PayPal.

3. **Гнучкість**: Користувачі можуть обрати бажаний спосіб оплати, не ставлячи під загрозу надійність нашої системи.

4. **Надійність**: Наша система плавно обробляє крайні випадки, від збоїв мережі до шахрайської діяльності.

Якщо ви впроваджуєте платіжну систему, яка підтримує кілька процесорів, ми наполегливо рекомендуємо цей потрійний підхід. Він вимагає більше початкових зусиль з розробки, але довгострокові переваги з точки зору надійності та точності того варті.

Щоб отримати докладнішу інформацію про пересилання електронної пошти та наші послуги електронної пошти, орієнтовані на конфіденційність, відвідайте нашу сторінку [вебсайт](https://forwardemail.net).

<!-- *Ключові слова: обробка платежів, інтеграція Stripe, інтеграція PayPal, обробка вебхуків, синхронізація платежів, управління підписками, запобігання шахрайству, вирішення суперечок, платіжна система Node.js, багатопроцесорна платіжна система, інтеграція платіжних шлюзів, перевірка платежів у режимі реального часу, узгодженість даних платежів, виставлення рахунків за підписку, безпека платежів, автоматизація платежів, платіжні вебхуки, узгодження платежів, крайні випадки платежів, обробка помилок платежу, вимоги до підписки VISA, сповіщення про попереднє поновлення, відповідність підписки* -->