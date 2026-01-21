# Jak zbudowaliśmy solidny system płatności ze Stripe i PayPal: podejście Trifecta {#how-we-built-a-robust-payment-system-with-stripe-and-paypal-a-trifecta-approach}

<img loading="lazy" src="/img/articles/payment-trifecta.webp" alt="Payment system with Stripe and PayPal" class="rounded-lg" />

## Spis treści {#table-of-contents}

* [Przedmowa](#foreword)
* [Wyzwanie: Wiele procesorów płatności, jedno źródło prawdy](#the-challenge-multiple-payment-processors-one-source-of-truth)
* [Podejście Trifecta: trzy warstwy niezawodności](#the-trifecta-approach-three-layers-of-reliability)
* [Warstwa 1: przekierowania po dokonaniu zakupu](#layer-1-post-checkout-redirects)
  * [Wdrożenie usługi Stripe Checkout](#stripe-checkout-implementation)
  * [Przepływ płatności PayPal](#paypal-payment-flow)
* [Warstwa 2: Obsługa webhooków z weryfikacją podpisu](#layer-2-webhook-handlers-with-signature-verification)
  * [Implementacja webhooka Stripe](#stripe-webhook-implementation)
  * [Implementacja webhooka PayPal](#paypal-webhook-implementation)
* [Warstwa 3: Zautomatyzowane zadania z Bree](#layer-3-automated-jobs-with-bree)
  * [Sprawdzanie dokładności subskrypcji](#subscription-accuracy-checker)
  * [Synchronizacja subskrypcji PayPal](#paypal-subscription-synchronization)
* [Obsługa przypadków brzegowych](#handling-edge-cases)
  * [Wykrywanie i zapobieganie oszustwom](#fraud-detection-and-prevention)
  * [Rozwiązywanie sporów](#dispute-handling)
* [Ponowne wykorzystanie kodu: zasady KISS i DRY](#code-reuse-kiss-and-dry-principles)
* [Wdrażanie wymagań subskrypcji VISA](#visa-subscription-requirements-implementation)
  * [Automatyczne powiadomienia e-mail przed odnowieniem](#automated-pre-renewal-email-notifications)
  * [Obsługa przypadków brzegowych](#handling-edge-cases-1)
  * [Okresy próbne i warunki subskrypcji](#trial-periods-and-subscription-terms)
* [Wnioski: Korzyści płynące z naszego podejścia Trifecta](#conclusion-the-benefits-of-our-trifecta-approach)

## Przedmowa {#foreword}

W Forward Email zawsze priorytetowo traktowaliśmy tworzenie systemów, które są niezawodne, dokładne i przyjazne dla użytkownika. Wdrażając nasz system przetwarzania płatności, wiedzieliśmy, że potrzebujemy rozwiązania, które obsłuży wiele systemów płatności, zachowując jednocześnie idealną spójność danych. Ten wpis na blogu szczegółowo opisuje, jak nasz zespół programistów zintegrował Stripe i PayPal, stosując podejście trifecta, które zapewnia dokładność danych w czasie rzeczywistym 1:1 w całym naszym systemie.

## Wyzwanie: Wiele procesorów płatności, jedno źródło prawdy {#the-challenge-multiple-payment-processors-one-source-of-truth}

Jako firma oferująca usługi poczty elektronicznej nastawione na prywatność, chcieliśmy zapewnić naszym użytkownikom opcje płatności. Niektórzy preferują prostotę płatności kartą kredytową za pośrednictwem Stripe, podczas gdy inni cenią sobie dodatkową warstwę separacji, jaką zapewnia PayPal. Jednak obsługa wielu procesorów płatności wiąże się ze znaczną złożonością:

1. Jak zapewniamy spójność danych w różnych systemach płatności?
2. Jak radzimy sobie z przypadkami skrajnymi, takimi jak spory, zwroty pieniędzy czy nieudane płatności?
3. Jak utrzymujemy jedno źródło informacji w naszej bazie danych?

Naszym rozwiązaniem było wdrożenie tego, co nazywamy „podejściem trifecta” – trójwarstwowego systemu zapewniającego redundancję i spójność danych bez względu na wszystko.

## Podejście Trifecta: trzy warstwy niezawodności {#the-trifecta-approach-three-layers-of-reliability}

Nasz system płatności składa się z trzech kluczowych komponentów, które współpracując ze sobą, zapewniają doskonałą synchronizację danych:

1. **Przekierowania po dokonaniu płatności** – Przechwytywanie informacji o płatnościach bezpośrednio po dokonaniu płatności
2. **Obsługa webhooków** – Przetwarzanie zdarzeń w czasie rzeczywistym z procesorów płatności
3. **Zadania automatyczne** – Okresowe weryfikowanie i uzgadnianie danych płatności

Przyjrzyjmy się bliżej każdemu z komponentów i zobaczmy, jak one ze sobą współdziałają.

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

## Warstwa 1: przekierowania po realizacji transakcji {#layer-1-post-checkout-redirects}

Pierwsza warstwa naszego podejścia trifecta ma miejsce natychmiast po dokonaniu płatności przez użytkownika. Zarówno Stripe, jak i PayPal zapewniają mechanizmy przekierowujące użytkowników z powrotem do naszej witryny z informacjami o transakcji.

### Implementacja płatności Stripe {#stripe-checkout-implementation}

W przypadku Stripe korzystamy z ich API sesji płatności (Checkout Sessions API), aby zapewnić płynny proces płatności. Gdy użytkownik wybiera plan i decyduje się na płatność kartą kredytową, tworzymy sesję płatności z określonymi adresami URL potwierdzającymi pomyślne zakończenie transakcji i anulowanie:

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

Kluczowym elementem jest tutaj parametr `success_url`, który zawiera parametr `session_id` jako parametr zapytania. Gdy Stripe przekieruje użytkownika z powrotem na naszą stronę po pomyślnej płatności, możemy użyć tego identyfikatora sesji do weryfikacji transakcji i odpowiedniej aktualizacji naszej bazy danych.

### Przepływ płatności PayPal {#paypal-payment-flow}

W przypadku serwisu PayPal stosujemy podobne podejście w ramach interfejsu API zamówień:

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

Podobnie jak w Stripe, określamy parametry `return_url` i `cancel_url` do obsługi przekierowań po dokonaniu płatności. Gdy PayPal przekieruje użytkownika z powrotem na naszą stronę, możemy przechwycić dane dotyczące płatności i zaktualizować naszą bazę danych.

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

## Warstwa 2: Obsługa webhooków z weryfikacją podpisu {#layer-2-webhook-handlers-with-signature-verification}

Chociaż przekierowania po finalizacji zakupu działają dobrze w większości scenariuszy, nie są niezawodne. Użytkownicy mogą zamknąć przeglądarkę przed przekierowaniem lub problemy z siecią mogą uniemożliwić ukończenie przekierowania. Właśnie tutaj pojawiają się webhooki.

Zarówno Stripe, jak i PayPal oferują systemy webhooków, które wysyłają powiadomienia w czasie rzeczywistym o zdarzeniach związanych z płatnościami. Wdrożyliśmy solidne mechanizmy obsługi webhooków, które weryfikują autentyczność tych powiadomień i odpowiednio je przetwarzają.

### Implementacja webhooka Stripe {#stripe-webhook-implementation}

Nasz moduł obsługi webhooków Stripe weryfikuje podpis przychodzących zdarzeń webhooków, aby upewnić się, że są one prawidłowe:

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

Funkcja `stripe.webhooks.constructEvent` weryfikuje podpis za pomocą naszego tajnego klucza punktu końcowego. Jeśli podpis jest prawidłowy, przetwarzamy zdarzenie asynchronicznie, aby uniknąć zablokowania odpowiedzi webhooka.

### Implementacja webhooka PayPal {#paypal-webhook-implementation}

Podobnie nasz moduł obsługi webhooków PayPal weryfikuje autentyczność przychodzących powiadomień:

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

Oba handlery webhooków działają według tego samego schematu: weryfikują podpis, potwierdzają odbiór i przetwarzają zdarzenie asynchronicznie. Dzięki temu nigdy nie przegapimy zdarzenia płatności, nawet jeśli przekierowanie po finalizacji zamówienia się nie powiedzie.

## Warstwa 3: Zautomatyzowane zadania z Bree {#layer-3-automated-jobs-with-bree}

Ostatnią warstwą naszego podejścia trifecta jest zestaw zautomatyzowanych zadań, które okresowo weryfikują i uzgadniają dane dotyczące płatności. Do regularnego uruchamiania tych zadań w regularnych odstępach czasu używamy Bree, narzędzia do planowania zadań dla Node.js.

### Sprawdzanie dokładności subskrypcji {#subscription-accuracy-checker}

Jednym z naszych kluczowych zadań jest sprawdzanie poprawności subskrypcji, które zapewnia, że nasza baza danych dokładnie odzwierciedla status subskrypcji w Stripe:

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

To zadanie sprawdza rozbieżności między naszą bazą danych a Stripe, takie jak niezgodne adresy e-mail lub wiele aktywnych subskrypcji. Jeśli wykryje jakiekolwiek problemy, rejestruje je i wysyła alerty do naszego zespołu administracyjnego.

### Synchronizacja subskrypcji PayPal {#paypal-subscription-synchronization}

Podobną pracę wykonujemy w przypadku subskrypcji PayPal:

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

Te zautomatyzowane zadania stanowią naszą ostateczną siatkę bezpieczeństwa, gwarantując, że nasza baza danych zawsze odzwierciedla rzeczywisty stan subskrypcji i płatności zarówno w Stripe, jak i PayPal.

## Obsługa przypadków brzegowych {#handling-edge-cases}

Solidny system płatności musi sprawnie obsługiwać przypadki skrajne. Przyjrzyjmy się, jak radzimy sobie z typowymi scenariuszami.

### Wykrywanie i zapobieganie oszustwom {#fraud-detection-and-prevention}

Wdrożyliśmy zaawansowane mechanizmy wykrywania oszustw, które automatycznie identyfikują i reagują na podejrzane działania płatnicze:

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

Ten kod automatycznie blokuje użytkowników, którzy mają na swoim koncie wiele nieudanych płatności i nie posiadają zweryfikowanych domen, co jest silnym wskaźnikiem oszustwa.

### Rozpatrywanie sporów {#dispute-handling}

Gdy użytkownik kwestionuje opłatę, automatycznie akceptujemy roszczenie i podejmujemy odpowiednie działania:

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

Takie podejście minimalizuje wpływ sporów na naszą działalność, zapewniając jednocześnie klientom dobre doświadczenia.

## Ponowne wykorzystanie kodu: zasady KISS i DRY {#code-reuse-kiss-and-dry-principles}

W całym naszym systemie płatności przestrzegamy zasad KISS (Keep It Simple, Stupid) i DRY (Don't Repeat Yourself). Oto kilka przykładów:

1. **Współdzielone funkcje pomocnicze**: Stworzyliśmy wielokrotnego użytku funkcje pomocnicze do typowych zadań, takich jak synchronizacja płatności i wysyłanie wiadomości e-mail.

2. **Spójna obsługa błędów**: Zarówno obsługa webhooków Stripe, jak i PayPal wykorzystuje ten sam wzorzec obsługi błędów i powiadomień administratora.

3. **Ujednolicony schemat bazy danych**: Nasz schemat bazy danych został zaprojektowany tak, aby pomieścić zarówno dane Stripe, jak i PayPal, ze wspólnymi polami dotyczącymi statusu płatności, kwoty i informacji o planie.

4. **Konfiguracja scentralizowana**: Konfiguracja związana z płatnościami jest scentralizowana w jednym pliku, co ułatwia aktualizację cen i informacji o produktach.

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

## Implementacja wymagań subskrypcji VISA {#visa-subscription-requirements-implementation}

Oprócz naszego podejścia trifecta, wdrożyliśmy konkretne funkcje, aby spełnić wymagania VISA dotyczące subskrypcji, jednocześnie poprawiając komfort użytkowania. Jednym z kluczowych wymagań VISA jest powiadomienie użytkowników przed naliczeniem opłaty za subskrypcję, zwłaszcza w przypadku przejścia z okresu próbnego na subskrypcję płatną.

### Automatyczne powiadomienia e-mail przed odnowieniem {#automated-pre-renewal-email-notifications}

Stworzyliśmy zautomatyzowany system, który identyfikuje użytkowników z aktywnymi subskrypcjami próbnymi i wysyła im powiadomienie e-mail przed pierwszym obciążeniem. To nie tylko pozwala nam zachować zgodność z wymogami VISA, ale także zmniejsza liczbę obciążeń zwrotnych i poprawia zadowolenie klientów.

Oto jak wdrożyliśmy tę funkcję:

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

Dzięki temu wdrożeniu użytkownicy są zawsze informowani o nadchodzących opłatach, z zachowaniem przejrzystości i szczegółów dotyczących:

1. Kiedy nastąpi pierwsze obciążenie
2. Częstotliwość przyszłych opłat (miesięczna, roczna itd.)
3. Dokładna kwota, jaką zostaną pobrane
4. Które domeny są objęte subskrypcją

Automatyzując ten proces, zachowujemy pełną zgodność z wymogami VISA (które nakazują powiadomienie co najmniej 7 dni przed obciążeniem karty), jednocześnie ograniczając liczbę zapytań o pomoc techniczną i poprawiając ogólne doświadczenie użytkownika.

### Obsługa przypadków brzegowych {#handling-edge-cases-1}

Nasza implementacja obejmuje również solidną obsługę błędów. Jeśli w procesie powiadamiania wystąpi jakikolwiek problem, nasz system automatycznie powiadomi nasz zespół:

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

Dzięki temu mamy pewność, że nawet jeśli wystąpi jakiś problem z systemem powiadomień, nasz zespół będzie mógł szybko się nim zająć i zachować zgodność z wymogami VISA.

System powiadomień o subskrypcjach VISA to kolejny przykład tego, jak zbudowaliśmy naszą infrastrukturę płatności, mając na uwadze zarówno zgodność z przepisami, jak i doświadczenie użytkownika, uzupełniając nasze potrójne podejście w celu zapewnienia niezawodnego i przejrzystego przetwarzania płatności.

### Okresy próbne i warunki subskrypcji {#trial-periods-and-subscription-terms}

W przypadku użytkowników, którzy włączyli opcję automatycznego odnawiania istniejących planów, obliczamy odpowiedni okres próbny, aby mieć pewność, że nie zostaną oni obciążeni opłatą aż do wygaśnięcia bieżącego planu:

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

Zapewniamy również przejrzyste informacje o warunkach subskrypcji, w tym o częstotliwości rozliczeń i zasadach anulowania, a do każdej subskrypcji dołączamy szczegółowe metadane, aby zapewnić właściwe śledzenie i zarządzanie.

## Wnioski: Korzyści z naszego podejścia Trifecta {#conclusion-the-benefits-of-our-trifecta-approach}

Nasze potrójne podejście do przetwarzania płatności zapewniło nam szereg kluczowych korzyści:

1. **Niezawodność**: Wdrażając trzy poziomy weryfikacji płatności, gwarantujemy, że żadna płatność nie zostanie pominięta ani nieprawidłowo przetworzona.

2. **Dokładność**: Nasza baza danych zawsze odzwierciedla prawdziwy stan subskrypcji i płatności zarówno w Stripe, jak i PayPal.

3. **Elastyczność**: Użytkownicy mogą wybrać preferowaną metodę płatności, nie narażając przy tym niezawodności naszego systemu.

4. **Solidność**: Nasz system bez problemu radzi sobie z przypadkami ekstremalnymi, od awarii sieci po działania oszukańcze.

Jeśli wdrażasz system płatności obsługujący wiele procesorów, zdecydowanie polecamy to trifecta. Wymaga ono większego nakładu pracy na początku, ale długoterminowe korzyści w zakresie niezawodności i dokładności są tego warte.

Aby uzyskać więcej informacji na temat usługi Forward Email i naszych usług poczty e-mail zapewniających prywatność, odwiedź naszą stronę [strona internetowa](https://forwardemail.net).

<!-- *Słowa kluczowe: przetwarzanie płatności, integracja ze Stripe, integracja z PayPal, obsługa webhooków, synchronizacja płatności, zarządzanie subskrypcjami, zapobieganie oszustwom, obsługa sporów, system płatności Node.js, wieloprocesorowy system płatności, integracja z bramką płatniczą, weryfikacja płatności w czasie rzeczywistym, spójność danych płatniczych, rozliczanie subskrypcji, bezpieczeństwo płatności, automatyzacja płatności, webhooki płatnicze, uzgadnianie płatności, skrajne przypadki płatności, obsługa błędów płatności, wymagania dotyczące subskrypcji VISA, powiadomienia przed odnowieniem, zgodność subskrypcji* -->