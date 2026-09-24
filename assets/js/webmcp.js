//
// WebMCP imperative tools
// <https://github.com/webmachinelearning/webmcp>
// <https://developer.chrome.com/docs/ai/webmcp/imperative-api>
//
// Registers a few read-only tools that an AI agent running in the visitor's
// browser can call instead of scraping the page. Every tool wraps a public
// endpoint the site already serves; nothing here signs anyone up, changes an
// account or sends email. Browsers without WebMCP skip all of it.
//
// Declarative tools (site search, domain search, onboarding, TXT record
// encryption) are declared on their <form> elements instead.
//

(function () {
  const modelContext =
    (window.navigator && window.navigator.modelContext) ||
    (window.document && window.document.modelContext);
  if (!modelContext || typeof modelContext.registerTool !== 'function') return;

  const script = document.currentScript;
  const locale =
    (script && script.dataset.locale) || document.documentElement.lang || 'en';
  // "free:0,enhanced:3,team:9,enterprise:250" (monthly USD, from the server)
  let pricing = null;
  if (script && script.dataset.pricing) {
    pricing = {};
    for (const pair of script.dataset.pricing.split(',')) {
      const [plan, price] = pair.split(':');
      if (plan && Number.isFinite(Number(price))) pricing[plan] = Number(price);
    }
  }

  function text(value) {
    return {
      content: [
        {
          type: 'text',
          text: typeof value === 'string' ? value : JSON.stringify(value)
        }
      ]
    };
  }

  function getJSON(url, signal) {
    return window
      .fetch(url, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
        signal
      })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      });
  }

  const readOnly = { readOnlyHint: true };

  const tools = [
    {
      name: 'get_forward_email_overview',
      description:
        'Get a concise, up-to-date overview of Forward Email (features, plans, protocols, security, comparisons and links to docs) as plain text (llms.txt).',
      inputSchema: { type: 'object', properties: {} },
      annotations: readOnly,
      execute(_input, options) {
        return window
          .fetch('/llms.txt', { signal: options && options.signal })
          .then((response) => response.text())
          .then(text);
      }
    },
    {
      name: 'search_forward_email_help',
      description:
        "Search Forward Email's FAQ, guides and developer docs. Returns up to 10 results with title, URL and a short excerpt.",
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              'Keywords, letters and numbers only, at most 50 characters (e.g. "DKIM", "IMAP settings").',
            maxLength: 50
          }
        },
        required: ['query']
      },
      annotations: readOnly,
      execute(input, options) {
        const query = String((input && input.query) || '')
          .replace(/[\W_]+/g, ' ')
          .trim()
          .slice(0, 50);
        if (!query) return Promise.resolve(text('A query is required.'));
        return getJSON(
          `/${encodeURIComponent(locale)}/search?q=${encodeURIComponent(
            query
          )}`,
          options && options.signal
        ).then((results) =>
          text(
            (Array.isArray(results) ? results : []).slice(0, 10).map((r) => ({
              title: r.header || r.title,
              url: new URL(r.href || '/', window.location.origin).href,
              excerpt: String(r.content || '').slice(0, 280)
            }))
          )
        );
      }
    },
    {
      name: 'check_domain_availability',
      description:
        'Check whether a domain name is available to register (WHOIS/RDAP lookup). Read-only: it does not register anything.',
      inputSchema: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
            description: 'Fully qualified domain name, e.g. example.com'
          }
        },
        required: ['domain']
      },
      annotations: readOnly,
      execute(input, options) {
        return window
          .fetch('/domain-availability', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
              domainName: String((input && input.domain) || '').trim()
            }),
            signal: options && options.signal
          })
          .then((response) => response.json())
          .then(text);
      }
    },
    {
      name: 'get_mail_server_ip_addresses',
      description:
        "List Forward Email's outbound mail server hostnames with their IPv4 and IPv6 addresses (for allowlists and firewall rules).",
      inputSchema: { type: 'object', properties: {} },
      annotations: readOnly,
      execute(_input, options) {
        return getJSON('/ips.json', options && options.signal).then(text);
      }
    }
  ];

  if (pricing)
    tools.push({
      name: 'get_forward_email_pricing',
      description:
        'Get Forward Email monthly plan prices in USD (free, enhanced, team, enterprise) and a link to the full plan comparison.',
      inputSchema: { type: 'object', properties: {} },
      annotations: readOnly,
      execute() {
        return Promise.resolve(
          text({
            currency: 'USD',
            period: 'month',
            plans: pricing,
            details: new URL(
              `/${locale}/private-business-email`,
              window.location.origin
            ).href
          })
        );
      }
    });

  // Registration and execution must never surface as page errors: the API is
  // still changing between Chrome releases (registerTool may return a promise
  // and reject), and a tool failure should reach the agent as a result, not
  // as an unhandled rejection in the visitor's console.
  function register(tool) {
    const { execute } = tool;
    tool.execute = function (input, options) {
      let result;
      try {
        result = Promise.resolve(execute.call(this, input, options));
      } catch (err) {
        result = Promise.reject(err);
      }

      return result.catch((err) =>
        text(`Error: ${(err && err.message) || 'request failed'}`)
      );
    };

    try {
      const registration = modelContext.registerTool(tool);
      if (registration && typeof registration.catch === 'function')
        registration.catch((err) => console.warn('WebMCP', tool.name, err));
    } catch (err) {
      // e.g. a tool with this name already exists (script loaded twice)
      console.warn('WebMCP', tool.name, err);
    }
  }

  for (const tool of tools) register(tool);
})();
