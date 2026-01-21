# A Decade of Impact: How Our npm Packages Hit 1 Billion Downloads and Shaped JavaScript

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## Table of Contents

* [Foreword](#foreword)
* [The Pioneers Who Trust Us: Isaac Z. Schlueter and Forward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [From npm's Creation to Node.js Leadership](#from-npms-creation-to-nodejs-leadership)
* [The Architect Behind the Code: Nick Baugh's Journey](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express Technical Committee and Core Contributions](#express-technical-committee-and-core-contributions)
  * [Koa Framework Contributions](#koa-framework-contributions)
  * [From Individual Contributor to Organization Leader](#from-individual-contributor-to-organization-leader)
* [Our GitHub Organizations: Ecosystems of Innovation](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin: Structured Logging for Modern Applications](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner: Fighting Email Abuse](#spam-scanner-fighting-email-abuse)
  * [Bree: Modern Job Scheduling with Worker Threads](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email: Open Source Email Infrastructure](#forward-email-open-source-email-infrastructure)
  * [Lad: Essential Koa Utilities and Tools](#lad-essential-koa-utilities-and-tools)
  * [Upptime: Open Source Uptime Monitoring](#upptime-open-source-uptime-monitoring)
* [Our Contributions to the Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem)
  * [From Packages to Production](#from-packages-to-production)
  * [The Feedback Loop](#the-feedback-loop)
* [Forward Email's Core Principles: A Foundation for Excellence](#forward-emails-core-principles-a-foundation-for-excellence)
  * [Always Developer-Friendly, Security-Focused, and Transparent](#always-developer-friendly-security-focused-and-transparent)
  * [Adherence to Time-Tested Software Development Principles](#adherence-to-time-tested-software-development-principles)
  * [Targeting the Scrappy, Bootstrapped Developer](#targeting-the-scrappy-bootstrapped-developer)
  * [Principles in Practice: The Forward Email Codebase](#principles-in-practice-the-forward-email-codebase)
  * [Privacy by Design](#privacy-by-design)
  * [Sustainable Open Source](#sustainable-open-source)
* [The Numbers Don't Lie: Our Staggering npm Download Statistics](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [A Bird's-Eye View of Our Impact](#a-birds-eye-view-of-our-impact)
  * [Daily Impact at Scale](#daily-impact-at-scale)
  * [Beyond the Raw Numbers](#beyond-the-raw-numbers)
* [Supporting the Ecosystem: Our Open Source Sponsorships](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman: Email Infrastructure Pioneer](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus: Utility Package Mastermind](#sindre-sorhus-utility-package-mastermind)
* [Uncovering Security Vulnerabilities in the JavaScript Ecosystem](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [The Koa-Router Rescue](#the-koa-router-rescue)
  * [Addressing ReDoS Vulnerabilities](#addressing-redos-vulnerabilities)
  * [Advocating for Node.js and Chromium Security](#advocating-for-nodejs-and-chromium-security)
  * [Securing npm Infrastructure](#securing-npm-infrastructure)
* [Our Contributions to the Forward Email Ecosystem](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Enhancing Nodemailer's Core Functionality](#enhancing-nodemailers-core-functionality)
  * [Advancing Email Authentication with Mailauth](#advancing-email-authentication-with-mailauth)
  * [Key Upptime Enhancements](#key-upptime-enhancements)
* [The Glue That Holds It All Together: Custom Code at Scale](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [A Massive Development Effort](#a-massive-development-effort)
  * [Core Dependencies Integration](#core-dependencies-integration)
  * [DNS Infrastructure with Tangerine and mx-connect](#dns-infrastructure-with-tangerine-and-mx-connect)
* [Enterprise Impact: From Open Source to Mission-Critical Solutions](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [Case Studies in Mission-Critical Email Infrastructure](#case-studies-in-mission-critical-email-infrastructure)
* [A Decade of Open Source: Looking Forward](#a-decade-of-open-source-looking-forward)


## Foreword

In the [JavaScript](https://en.wikipedia.org/wiki/JavaScript) and [Node.js](https://en.wikipedia.org/wiki/Node.js) world, some packages are essential—downloaded millions of times daily and powering apps worldwide. Behind these tools are developers focused on open source quality. Today, we're showing how our team helps build and maintain npm packages that have become key parts of the JavaScript ecosystem.


## The Pioneers Who Trust Us: Isaac Z. Schlueter and Forward Email

We're proud to have [Isaac Z. Schlueter](https://izs.me/) ([GitHub: isaacs](https://github.com/isaacs)) as a user. Isaac created [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) and helped build [Node.js](https://en.wikipedia.org/wiki/Node.js). His trust in Forward Email shows our focus on quality and security. Isaac uses Forward Email for several domains including izs.me.

Isaac's impact on JavaScript is huge. In 2009, he was among the first to see Node.js's potential, working with [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl), who created the platform. As Isaac said in an [interview with Increment magazine](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/): "In the midst of this very small community of a bunch of people trying to figure out how to make server-side JS happen, Ryan Dahl came out with Node, which was just very clearly the right approach. I threw my chips in with that and got very involved in about the middle of 2009."

> \[!NOTE]
> For those interested in the history of Node.js, there are excellent documentaries available that chronicle its development, including [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) and [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I). Ryan Dahl's [personal website](https://tinyclouds.org/) also contains valuable insights into his work.

### From npm's Creation to Node.js Leadership

Isaac created npm in September 2009, with the first usable version released in early 2010. This package manager filled a key need in Node.js, letting developers easily share and reuse code. According to the [Node.js Wikipedia page](https://en.wikipedia.org/wiki/Node.js), "In January 2010, a package manager was introduced for the Node.js environment called npm. The package manager allows programmers to publish and share Node.js packages, along with the accompanying source code, and is designed to simplify the installation, update and uninstallation of packages."

When Ryan Dahl stepped back from Node.js in January 2012, Isaac took over as project leader. As noted on [his résumé](https://izs.me/resume), he "Led development of several fundamental Node.js core APIs, including CommonJS module system, filesystem APIs, and streams" and "Acted as BDFL (Benevolent Dictator For Life) of project for 2 years, ensuring ever-increasing quality and reliable build process for Node.js versions v0.6 through v0.10."

Isaac guided Node.js through a key growth period, setting standards that still shape the platform today. He later started npm, Inc. in 2014 to support the npm registry, which he had run on his own before.

We thank Isaac for his huge contributions to JavaScript and continue to use many packages he created. His work has changed how we build software and how millions of developers share code worldwide.


## The Architect Behind the Code: Nick Baugh's Journey

At the heart of our open source success is Nick Baugh, Forward Email's founder and owner. His work in JavaScript spans nearly 20 years and has shaped how countless developers build apps. His open source journey shows both technical skill and community leadership.

### Express Technical Committee and Core Contributions

Nick's web framework expertise earned him a spot on the [Express Technical Committee](https://expressjs.com/en/resources/community.html), where he helped with one of the most used Node.js frameworks. Nick is now listed as an inactive member on the [Express community page](https://expressjs.com/en/resources/community.html).

> \[!IMPORTANT]
> Express was originally created by TJ Holowaychuk, a prolific open source contributor who has shaped much of the Node.js ecosystem. We're grateful for TJ's foundational work and respect his [decision to take a break](https://news.ycombinator.com/item?id=37687017) from his extensive open source contributions.

As a member of the [Express Technical Committee](https://expressjs.com/en/resources/community.html), Nick showed great attention to detail in issues like clarifying `req.originalUrl` documentation and fixing multipart form handling problems.

### Koa Framework Contributions

Nick's work with the [Koa framework](https://github.com/koajs/koa)—a modern, lighter alternative to Express also created by TJ Holowaychuk—further shows his commitment to better web development tools. His Koa contributions include both issues and code through pull requests, addressing error handling, content type management, and documentation improvements.

His work across both Express and Koa gives him a unique view of Node.js web development, helping our team create packages that work well with multiple framework ecosystems.

### From Individual Contributor to Organization Leader

What started as helping existing projects grew into creating and maintaining whole package ecosystems. Nick founded multiple GitHub organizations—including [Cabin](https://github.com/cabinjs), [Spam Scanner](https://github.com/spamscanner), [Forward Email](https://github.com/forwardemail), [Lad](https://github.com/ladjs), and [Bree](https://github.com/breejs)—each solving specific needs in the JavaScript community.

This shift from contributor to leader shows Nick's vision for well-designed software that solves real problems. By organizing related packages under focused GitHub organizations, he's built tool ecosystems that work together while staying modular and flexible for the wider developer community.


## Our GitHub Organizations: Ecosystems of Innovation

We organize our open source work around focused GitHub organizations, each solving specific needs in JavaScript. This structure creates cohesive package families that work well together while staying modular.

### Cabin: Structured Logging for Modern Applications

The [Cabin organization](https://github.com/cabinjs) is our take on simple, powerful app logging. The main [`cabin`](https://github.com/cabinjs/cabin) package has nearly 900 GitHub stars and over 100,000 weekly downloads\[^1]. Cabin provides structured logging that works with popular services like Sentry, LogDNA, and Papertrail.

What makes Cabin special is its thoughtful API and plugin system. Supporting packages like [`axe`](https://github.com/cabinjs/axe) for Express middleware and [`parse-request`](https://github.com/cabinjs/parse-request) for HTTP request parsing show our commitment to complete solutions rather than isolated tools.

The [`bson-objectid`](https://github.com/cabinjs/bson-objectid) package deserves special mention, with over 1.7 million downloads in just two months\[^2]. This light MongoDB ObjectID implementation has become the go-to for developers needing IDs without full MongoDB dependencies.

### Spam Scanner: Fighting Email Abuse

The [Spam Scanner organization](https://github.com/spamscanner) shows our commitment to solving real problems. The main [`spamscanner`](https://github.com/spamscanner/spamscanner) package provides advanced email spam detection, but it's the [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe) package that's seen amazing adoption.

With over 1.2 million downloads in two months\[^3], `url-regex-safe` fixes critical security issues in other URL detection regular expressions. This package shows our approach to open source: finding a common problem (in this case, [ReDoS](https://en.wikipedia.org/wiki/ReDoS) vulnerabilities in URL validation), creating a solid solution, and maintaining it carefully.

### Bree: Modern Job Scheduling with Worker Threads

The [Bree organization](https://github.com/breejs) is our answer to a common Node.js challenge: reliable job scheduling. The main [`bree`](https://github.com/breejs/bree) package, with over 3,100 GitHub stars, provides a modern job scheduler using Node.js worker threads for better performance and reliability.

> \[!NOTE]
> Bree was created after we helped maintain [Agenda](https://github.com/agenda/agenda), applying lessons learned to build a better job scheduler. Our Agenda contributions helped us find ways to improve job scheduling.

What makes Bree different from other schedulers like Agenda:

* **No External Dependencies**: Unlike Agenda which needs MongoDB, Bree doesn't require Redis or MongoDB to manage job state.
* **Worker Threads**: Bree uses Node.js worker threads for sandboxed processes, giving better isolation and performance.
* **Simple API**: Bree offers detailed control with simplicity, making it easier to implement complex scheduling needs.
* **Built-in Support**: Things like graceful reloading, cron jobs, dates, and human-friendly times are included by default.

Bree is a key part of [forwardemail.net](https://github.com/forwardemail/forwardemail.net), handling critical background tasks like email processing, cleanup, and scheduled maintenance. Using Bree in Forward Email shows our commitment to using our own tools in production, ensuring they meet high reliability standards.

We also use and appreciate other great worker thread packages like [piscina](https://github.com/piscinajs/piscina) and HTTP clients like [undici](https://github.com/nodejs/undici). Piscina, like Bree, uses Node.js worker threads for efficient task processing. We thank [Matteo Collina](https://github.com/mcollina), who maintains both undici and piscina, for his major contributions to Node.js. Matteo serves on the Node.js Technical Steering Committee and has greatly improved HTTP client capabilities in Node.js.

### Forward Email: Open Source Email Infrastructure

Our most ambitious project is [Forward Email](https://github.com/forwardemail), an open source email service that provides email forwarding, storage, and API services. The main repository has over 1,100 GitHub stars\[^4], showing community appreciation for this alternative to proprietary email services.

The [`preview-email`](https://github.com/forwardemail/preview-email) package from this organization, with over 2.5 million downloads in two months\[^5], has become an essential tool for developers working with email templates. By providing a simple way to preview emails during development, it solves a common pain point in building email-enabled applications.

### Lad: Essential Koa Utilities and Tools

The [Lad organization](https://github.com/ladjs) provides a collection of essential utilities and tools primarily focused on enhancing the Koa framework ecosystem. These packages solve common challenges in web development and are designed to work seamlessly together while remaining independently useful.

#### koa-better-error-handler: Improved Error Handling for Koa

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler) offers a better error handling solution for Koa applications. With over 50 GitHub stars, this package makes `ctx.throw` produce user-friendly error messages while addressing several limitations of Koa's built-in error handler:

* Detects and properly handles Node.js DNS errors, Mongoose errors, and Redis errors
* Uses [Boom](https://github.com/hapijs/boom) for creating consistent, well-formatted error responses
* Preserves headers (unlike Koa's built-in handler)
* Maintains appropriate status codes rather than defaulting to 500
* Supports flash messages and session preservation
* Provides HTML error lists for validation errors
* Supports multiple response types (HTML, JSON, and plain text)

This package is particularly valuable when used alongside [`koa-404-handler`](https://github.com/ladjs/koa-404-handler) for comprehensive error management in Koa applications.

#### passport: Authentication for Lad

[`@ladjs/passport`](https://github.com/ladjs/passport) extends the popular Passport.js authentication middleware with specific enhancements for modern web applications. This package supports multiple authentication strategies out of the box:

* Local authentication with email
* Sign in with Apple
* GitHub authentication
* Google authentication
* One-time password (OTP) authentication

The package is highly customizable, allowing developers to adjust field names and phrases to match their application's requirements. It's designed to integrate seamlessly with Mongoose for user management, making it an ideal solution for Koa-based applications that need robust authentication.

#### graceful: Elegant Application Shutdown

[`@ladjs/graceful`](https://github.com/ladjs/graceful) solves the critical challenge of gracefully shutting down Node.js applications. With over 70 GitHub stars, this package ensures that your application can terminate cleanly without losing data or leaving connections hanging. Key features include:

* Support for gracefully closing HTTP servers (Express/Koa/Fastify)
* Clean shutdown of database connections (MongoDB/Mongoose)
* Proper closing of Redis clients
* Handling of Bree job schedulers
* Support for custom shutdown handlers
* Configurable timeout settings
* Integration with logging systems

This package is essential for production applications where unexpected shutdowns could lead to data loss or corruption. By implementing proper shutdown procedures, `@ladjs/graceful` helps ensure the reliability and stability of your application.

### Upptime: Open Source Uptime Monitoring

The [Upptime organization](https://github.com/upptime) represents our commitment to transparent, open source monitoring. The main [`upptime`](https://github.com/upptime/upptime) repository has over 13,000 GitHub stars, making it one of the most popular projects we contribute to. Upptime provides a GitHub-powered uptime monitor and status page that operates entirely without a server.

We use Upptime for our own status page at <https://status.forwardemail.net> with the source code available at <https://github.com/forwardemail/status.forwardemail.net>.

What makes Upptime special is its architecture:

* **100% Open Source**: Every component is fully open source and customizable.
* **Powered by GitHub**: Leverages GitHub Actions, Issues, and Pages for a serverless monitoring solution.
* **No Server Required**: Unlike traditional monitoring tools, Upptime doesn't require you to run or maintain a server.
* **Automatic Status Page**: Generates a beautiful status page that can be hosted on GitHub Pages.
* **Powerful Notifications**: Integrates with various notification channels including email, SMS, and Slack.

To enhance our users' experience, we've integrated [@octokit/core](https://github.com/octokit/core.js/) into the forwardemail.net codebase to render real-time status updates and incidents directly on our website. This integration provides clear transparency to our users in case of any issues across our entire stack (Website, API, MongoDB, Redis, SQLite, SMTP, POP3, IMAP, Bree, etc.) with instant toast notifications, badge icon changes, warning colors, and more.

The @octokit/core library allows us to fetch real-time data from our Upptime GitHub repository, process it, and display it in a user-friendly manner. When any service has an outage or degraded performance, users are immediately notified through visual indicators without having to leave the main application. This seamless integration ensures that our users always have up-to-date information about our system status, enhancing transparency and trust.

Upptime has been adopted by hundreds of organizations looking for a transparent, reliable way to monitor their services and communicate status to users. The project's success shows the power of building tools that leverage existing infrastructure (in this case, GitHub) to solve common problems in new ways.


## Our Contributions to the Forward Email Ecosystem

While our open source packages are used by developers worldwide, they also form the foundation of our own Forward Email service. This dual role—as both creators and users of these tools—gives us a unique perspective on their real-world application and drives continuous improvement.

### From Packages to Production

The journey from individual packages to a cohesive production system involves careful integration and extension. For Forward Email, this process includes:

* **Custom Extensions**: Building Forward Email-specific extensions to our open source packages that address our unique requirements.
* **Integration Patterns**: Developing patterns for how these packages interact in a production environment.
* **Performance Optimizations**: Identifying and addressing performance bottlenecks that only emerge at scale.
* **Security Hardening**: Adding additional security layers specific to email handling and user data protection.

This work represents thousands of hours of development beyond the core packages themselves, resulting in a robust, secure email service that leverages the best of our open source contributions.

### The Feedback Loop

Perhaps the most valuable aspect of using our own packages in production is the feedback loop it creates. When we encounter limitations or edge cases in Forward Email, we don't just patch them locally—we improve the underlying packages, benefiting both our service and the broader community.

This approach has led to numerous improvements:

* **Bree's Graceful Shutdown**: Forward Email's need for zero-downtime deployments led to enhanced graceful shutdown capabilities in Bree.
* **Spam Scanner's Pattern Recognition**: Real-world spam patterns encountered in Forward Email have informed Spam Scanner's detection algorithms.
* **Cabin's Performance Optimizations**: High-volume logging in production revealed optimization opportunities in Cabin that benefit all users.

By maintaining this virtuous cycle between our open source work and production service, we ensure our packages remain practical, battle-tested solutions rather than theoretical implementations.


## Forward Email's Core Principles: A Foundation for Excellence

Forward Email is designed according to a set of core principles that guide all our development decisions. These principles, detailed on our [website](/blog/docs/best-quantum-safe-encrypted-email-service#principles), ensure that our service remains developer-friendly, secure, and focused on user privacy.

### Always Developer-Friendly, Security-Focused, and Transparent

Our first and foremost principle is to create software that is developer-friendly while maintaining the highest standards of security and privacy. We believe that technical excellence should never come at the expense of usability, and that transparency builds trust with our community.

This principle shows in our detailed documentation, clear error messages, and open communication about both successes and challenges. By making our entire codebase open source, we invite scrutiny and collaboration, strengthening both our software and the broader ecosystem.

### Adherence to Time-Tested Software Development Principles

We follow several established software development principles that have proven their value over decades:

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**: Separating concerns through the Model-View-Controller pattern
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**: Creating modular components that do one thing well
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**: Keeping It Simple and Straightforward
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**: Don't Repeat Yourself, promoting code reuse
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**: You Aren't Gonna Need It, avoiding premature optimization
* **[Twelve Factor](https://12factor.net/)**: Following best practices for building modern, scalable applications
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**: Choosing the simplest solution that meets requirements
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**: Using our own products extensively

These principles aren't just theoretical concepts—they're embedded in our daily development practices. For example, our adherence to the Unix philosophy is evident in how we've structured our npm packages: small, focused modules that can be composed together to solve complex problems.

### Targeting the Scrappy, Bootstrapped Developer

We specifically target the scrappy, bootstrapped, and [ramen-profitable](https://www.paulgraham.com/ramenprofitable.html) developer. This focus shapes everything from our pricing model to our technical decisions. We understand the challenges of building products with limited resources because we've been there ourselves.

This principle is particularly important in how we approach open source. We create and maintain packages that solve real problems for developers without enterprise budgets, making powerful tools accessible to everyone regardless of their resources.

### Principles in Practice: The Forward Email Codebase

These principles are clearly visible in the Forward Email codebase. Our package.json file reveals a thoughtful selection of dependencies, each chosen to align with our core values:

* Security-focused packages like `mailauth` for email authentication
* Developer-friendly tools like `preview-email` for easier debugging
* Modular components like the various `p-*` utilities from Sindre Sorhus

By following these principles consistently over time, we've built a service that developers can trust with their email infrastructure—secure, reliable, and aligned with the values of the open source community.

### Privacy by Design

Privacy isn't an afterthought or marketing feature for Forward Email—it's a fundamental design principle that informs every aspect of our service and code:

* **Zero-Access Encryption**: We've implemented systems that make it technically impossible for us to read users' emails.
* **Minimal Data Collection**: We collect only the data necessary to provide our service, nothing more.
* **Transparent Policies**: Our privacy policy is written in clear, understandable language without legal jargon.
* **Open Source Verification**: Our open source codebase allows security researchers to verify our privacy claims.

This commitment extends to our open source packages, which are designed with security and privacy best practices built in from the ground up.

### Sustainable Open Source

We believe that open source software needs sustainable models to thrive long-term. Our approach includes:

* **Commercial Support**: Offering premium support and services around our open source tools.
* **Balanced Licensing**: Using licenses that protect both user freedoms and project sustainability.
* **Community Engagement**: Actively engaging with contributors to build a supportive community.
* **Transparent Roadmaps**: Sharing our development plans to allow users to plan accordingly.

By focusing on sustainability, we ensure that our open source contributions can continue to grow and improve over time rather than falling into neglect.


## The Numbers Don't Lie: Our Staggering npm Download Statistics

When we talk about the impact of open source software, download statistics provide a tangible measure of adoption and trust. Many of the packages we help maintain have reached a scale that few open source projects ever achieve, with combined downloads numbering in the billions.

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> While we're proud to help maintain several highly-downloaded packages in the JavaScript ecosystem, we want to acknowledge that many of these packages were originally created by other talented developers. Packages like superagent and supertest were originally created by TJ Holowaychuk, whose prolific contributions to open source have been instrumental in shaping the Node.js ecosystem.

### A Bird's-Eye View of Our Impact

In just the two-month period from February to March 2025, the top packages we contribute to and help maintain recorded staggering download numbers:

* **[superagent](https://www.npmjs.com/package/superagent)**: 84,575,829 downloads\[^7] (originally created by TJ Holowaychuk)
* **[supertest](https://www.npmjs.com/package/supertest)**: 76,432,591 downloads\[^8] (originally created by TJ Holowaychuk)
* **[koa](https://www.npmjs.com/package/koa)**: 28,539,295 downloads\[^34] (originally created by TJ Holowaychuk)
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11,007,327 downloads\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3,498,918 downloads\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 downloads\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2,500,000 downloads\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1,800,000 downloads\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 downloads\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1,128,139 downloads\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1,124,686 downloads\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 downloads\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 downloads\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 downloads\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145,000 downloads\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24,270 downloads\[^30]

> \[!NOTE]
> Several other packages we help maintain but didn't create have even higher download counts, including `form-data` (738M+ downloads), `toidentifier` (309M+ downloads), `stackframe` (116M+ downloads), and `error-stack-parser` (113M+ downloads). We're honored to contribute to these packages while respecting the work of their original authors.

These aren't just impressive numbers—they represent real developers solving real problems with code that we help maintain. Every download is an instance where these packages have helped someone build something meaningful, from hobbyist projects to enterprise applications used by millions.

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### Daily Impact at Scale

The daily download patterns reveal consistent, high-volume usage, with peaks reaching millions of downloads per day\[^13]. This consistency speaks to the stability and reliability of these packages—developers don't just try them; they integrate them into their core workflows and depend on them day after day.

Weekly download patterns show even more impressive numbers, consistently hovering around tens of millions of downloads per week\[^14]. This represents a massive footprint in the JavaScript ecosystem, with these packages running in production environments across the globe.

### Beyond the Raw Numbers

While the download statistics are impressive on their own, they tell a deeper story about the trust the community places in these packages. Maintaining packages at this scale requires an unwavering commitment to:

* **Backward Compatibility**: Changes must be carefully considered to avoid breaking existing implementations.
* **Security**: With millions of applications depending on these packages, security vulnerabilities could have far-reaching consequences.
* **Performance**: At this scale, even minor performance improvements can have significant aggregate benefits.
* **Documentation**: Clear, comprehensive documentation is essential for packages used by developers of all experience levels.

The consistent growth in download numbers over time reflects the success in meeting these commitments, building trust with the developer community through reliable, well-maintained packages.


## Supporting the Ecosystem: Our Open Source Sponsorships

> \[!TIP]
> Open source sustainability isn't just about contributing code—it's also about supporting the developers who maintain critical infrastructure.

Beyond our direct contributions to the JavaScript ecosystem, we're proud to sponsor prominent Node.js contributors whose work forms the foundation of many modern applications. Our sponsorships include:

### Andris Reinman: Email Infrastructure Pioneer

[Andris Reinman](https://github.com/andris9) is the creator of [Nodemailer](https://github.com/nodemailer/nodemailer), the most popular email sending library for Node.js with over 14 million weekly downloads\[^15]. His work extends to other critical email infrastructure components like [SMTP Server](https://github.com/nodemailer/smtp-server), [Mailparser](https://github.com/nodemailer/mailparser), and [WildDuck](https://github.com/nodemailer/wildduck).

Our sponsorship helps ensure the continued maintenance and development of these essential tools that power email communication for countless Node.js applications, including our own Forward Email service.

### Sindre Sorhus: Utility Package Mastermind

[Sindre Sorhus](https://github.com/sindresorhus) is one of the most prolific open source contributors in the JavaScript ecosystem, with over 1,000 npm packages to his name. His utilities like [p-map](https://github.com/sindresorhus/p-map), [p-retry](https://github.com/sindresorhus/p-retry), and [is-stream](https://github.com/sindresorhus/is-stream) are fundamental building blocks used throughout the Node.js ecosystem.

By sponsoring Sindre's work, we help sustain the development of these critical utilities that make JavaScript development more efficient and reliable.

These sponsorships reflect our commitment to the broader open source ecosystem. We recognize that our own success is built on the foundation laid by these and other contributors, and we're dedicated to ensuring the sustainability of the entire ecosystem.


## Uncovering Security Vulnerabilities in the JavaScript Ecosystem

Our commitment to open source extends beyond feature development to include identifying and addressing security vulnerabilities that could impact millions of developers. Several of our most significant contributions to the JavaScript ecosystem have been in the realm of security.

### The Koa-Router Rescue

In February 2019, Nick identified a critical issue with the maintenance of the popular koa-router package. As he [reported on Hacker News](https://news.ycombinator.com/item?id=19156707), the package had been abandoned by its original maintainer, leaving security vulnerabilities unaddressed and the community without updates.

> \[!WARNING]
> Abandoned packages with security vulnerabilities pose significant risks to the entire ecosystem, especially when they're downloaded millions of times weekly.

In response, Nick created [@koa/router](https://github.com/koajs/router) and helped alert the community about the situation. He has been maintaining this critical package ever since, ensuring that Koa users have a secure, well-maintained routing solution.

### Addressing ReDoS Vulnerabilities

In 2020, Nick identified and addressed a critical [Regular Expression Denial of Service (ReDoS)](https://en.wikipedia.org/wiki/ReDoS) vulnerability in the widely-used `url-regex` package. This vulnerability ([SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)) could allow attackers to cause denial of service by providing specially crafted input that caused catastrophic backtracking in the regular expression.

Rather than simply patching the existing package, Nick created [`url-regex-safe`](https://github.com/spamscanner/url-regex-safe), a completely rewritten implementation that addresses the vulnerability while maintaining compatibility with the original API. He also published a [comprehensive blog post](/blog/docs/url-regex-javascript-node-js) explaining the vulnerability and how to mitigate it.

This work shows our approach to security: not just fixing issues but educating the community and providing robust alternatives that prevent similar problems in the future.

### Advocating for Node.js and Chromium Security

Nick has also been active in advocating for security improvements in the broader ecosystem. In August 2020, he identified a significant security issue in Node.js related to its handling of HTTP headers, which was reported in [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/).

This issue, which stemmed from a patch in Chromium, could potentially allow attackers to bypass security measures. Nick's advocacy helped ensure that the issue was addressed promptly, protecting millions of Node.js applications from potential exploitation.

### Securing npm Infrastructure

Later that same month, Nick identified another critical security issue, this time in npm's email infrastructure. As reported in [The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/), npm was not properly implementing DMARC, SPF, and DKIM email authentication protocols, potentially allowing attackers to send phishing emails that appeared to come from npm.

Nick's report led to improvements in npm's email security posture, protecting the millions of developers who rely on npm for package management from potential phishing attacks.


## Our Contributions to the Forward Email Ecosystem

Forward Email is built on top of several critical open source projects, including Nodemailer, WildDuck, and mailauth. Our team has made significant contributions to these projects, helping to identify and fix deep issues that affect email delivery and security.

### Enhancing Nodemailer's Core Functionality

[Nodemailer](https://github.com/nodemailer/nodemailer) is the backbone of email sending in Node.js, and our contributions have helped make it more robust:

* **SMTP Server Improvements**: We've fixed parsing bugs, stream handling issues, and TLS configuration problems in the SMTP server component\[^16]\[^17].
* **Mail Parser Enhancements**: We've addressed character sequence decoding errors and address parser issues that could cause email processing failures\[^18]\[^19].

These contributions ensure that Nodemailer remains a reliable foundation for email processing in Node.js applications, including Forward Email.

### Advancing Email Authentication with Mailauth

[Mailauth](https://github.com/postalsys/mailauth) provides critical email authentication functionality, and our contributions have significantly improved its capabilities:

* **DKIM Verification Improvements**: We discovered and reported that X/Twitter had DNS cache issues causing DKIM failure for their outbound messages, reporting it on Hacker One\[^20].
* **DMARC and ARC Enhancements**: We've fixed issues with DMARC and ARC verification that could lead to incorrect authentication results\[^21]\[^22].
* **Performance Optimizations**: We've contributed optimizations that improve the performance of email authentication processes\[^23]\[^24]\[^25]\[^26].

These improvements help ensure that email authentication is accurate and reliable, protecting users from phishing and spoofing attacks.

### Key Upptime Enhancements

Our contributions to Upptime include:

* **SSL Certificate Monitoring**: We added functionality to monitor SSL certificate expiration, preventing unexpected downtime due to expired certificates\[^27].
* **Multiple SMS Number Support**: We implemented support for alerting multiple team members via SMS when incidents occur, improving response times\[^28].
* **IPv6 Check Fixes**: We fixed issues with IPv6 connectivity checks, ensuring more accurate monitoring in modern network environments\[^29].
* **Dark/Light Mode Support**: We added theme support to improve the user experience of status pages\[^31].
* **Better TCP-Ping Support**: We enhanced the TCP ping functionality to provide more reliable connection testing\[^32].

These improvements not only benefit Forward Email's status monitoring but are available to the entire community of Upptime users, demonstrating our commitment to improving the tools we depend on.


## The Glue That Holds It All Together: Custom Code at Scale

While our npm packages and contributions to existing projects are significant, it's the custom code that integrates these components that truly showcases our technical expertise. The Forward Email codebase represents a decade of development effort, dating back to 2017 when the project began as [free-email-forwarding](https://github.com/forwardemail/free-email-forwarding) before being merged into a monorepo.

### A Massive Development Effort

The scale of this custom integration code is impressive:

* **Total Contributions**: Over 3,217 commits
* **Codebase Size**: Over 421,545 lines of code across JavaScript, Pug, CSS, and JSON files\[^33]

This represents thousands of hours of development work, debugging sessions, and performance optimizations. It's the "secret sauce" that transforms individual packages into a cohesive, reliable service used by thousands of customers daily.

### Core Dependencies Integration

The Forward Email codebase integrates numerous dependencies into a seamless whole:

* **Email Processing**: Integrates Nodemailer for sending, SMTP Server for receiving, and Mailparser for parsing
* **Authentication**: Uses Mailauth for DKIM, SPF, DMARC, and ARC verification
* **DNS Resolution**: Leverages Tangerine for DNS-over-HTTPS with global caching
* **MX Connection**: Utilizes mx-connect with Tangerine integration for reliable mail server connections
* **Job Scheduling**: Employs Bree for reliable background task processing with worker threads
* **Templating**: Employs email-templates to reuse stylesheets from the website in customer communications
* **Email Storage**: Implements individually encrypted SQLite mailboxes using better-sqlite3-multiple-ciphers with ChaCha20-Poly1305 encryption for quantum-safe privacy, ensuring complete isolation between users and that only the user has access to their mailbox

Each of these integrations requires careful consideration of edge cases, performance implications, and security concerns. The result is a robust system that handles millions of email transactions reliably. Our SQLite implementation also leverages msgpackr for efficient binary serialization and WebSockets (via ws) for real-time status updates across our infrastructure.

### DNS Infrastructure with Tangerine and mx-connect

A critical component of Forward Email's infrastructure is our DNS resolution system, built around two key packages:

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**: Our Node.js DNS-over-HTTPS implementation provides a drop-in replacement for the standard DNS resolver, with built-in retries, timeouts, smart server rotation, and caching support.

* **[mx-connect](https://github.com/zone-eu/mx-connect)**: This package establishes TCP connections to MX servers, taking a target domain or email address, resolving appropriate MX servers, and connecting to them in priority order.

We've integrated Tangerine with mx-connect through [pull request #4](https://github.com/zone-eu/mx-connect/pull/4), ensuring application-layer DNS over HTTP requests throughout Forward Email. This provides global caching for DNS at scale with 1:1 consistency across any region, app, or process—critical for reliable email delivery in a distributed system.


## Enterprise Impact: From Open Source to Mission-Critical Solutions

The culmination of our decade-long journey in open source development has enabled Forward Email to serve not just individual developers but also major enterprises and educational institutions that form the backbone of the open source movement itself.

### Case Studies in Mission-Critical Email Infrastructure

Our commitment to reliability, privacy, and open source principles has made Forward Email the trusted choice for organizations with demanding email requirements:

* **Educational Institutions**: As detailed in our [alumni email forwarding case study](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study), major universities rely on our infrastructure to maintain lifelong connections with hundreds of thousands of alumni through reliable email forwarding services.

* **Enterprise Linux Solutions**: The [Canonical Ubuntu email enterprise case study](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study) demonstrates how our open source approach aligns perfectly with the needs of enterprise Linux providers, offering them the transparency and control they require.

* **Open Source Foundations**: Perhaps most validating is our partnership with the Linux Foundation, as documented in the [Linux Foundation email enterprise case study](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study), where our service powers communication for the very organization that stewards Linux development.

There's a beautiful symmetry in how our open source packages, maintained with care over many years, have enabled us to build an email service that now supports the very communities and organizations that champion open source software. This full-circle journey—from contributing individual packages to powering enterprise-grade email infrastructure for open source leaders—represents the ultimate validation of our approach to software development.


## A Decade of Open Source: Looking Forward

As we look back on a decade of open source contributions and forward to the next ten years, we're filled with gratitude for the community that has supported our work and excitement for what's to come.

Our journey from individual package contributors to maintainers of a comprehensive email infrastructure used by major enterprises and open source foundations has been remarkable. It's a testament to the power of open source development and the impact that thoughtful, well-maintained software can have on the broader ecosystem.

In the coming years, we're committed to:

* **Continuing to maintain and improve our existing packages**, ensuring they remain reliable tools for developers worldwide.
* **Expanding our contributions to critical infrastructure projects**, particularly in the email and security domains.
* **Enhancing Forward Email's capabilities** while maintaining our commitment to privacy, security, and transparency.
* **Supporting the next generation of open source contributors** through mentorship, sponsorship, and community engagement.

We believe that the future of software development is open, collaborative, and built on a foundation of trust. By continuing to contribute high-quality, security-focused packages to the JavaScript ecosystem, we hope to play a small part in building that future.

Thank you to everyone who has used our packages, contributed to our projects, reported issues, or simply spread the word about our work. Your support has made this decade of impact possible, and we're excited to see what we can accomplish together in the next ten years.

\[^1]: npm download statistics for cabin, April 2025
\[^2]: npm download statistics for bson-objectid, February-March 2025
\[^3]: npm download statistics for url-regex-safe, April 2025
\[^4]: GitHub stars count for forwardemail/forwardemail.net as of April 2025
\[^5]: npm download statistics for preview-email, April 2025
\[^7]: npm download statistics for superagent, February-March 2025
\[^8]: npm download statistics for supertest, February-March 2025
\[^9]: npm download statistics for preview-email, February-March 2025
\[^10]: npm download statistics for cabin, February-March 2025
\[^11]: npm download statistics for url-regex-safe, February-March 2025
\[^12]: npm download statistics for spamscanner, February-March 2025
\[^13]: Daily download patterns from npm statistics, April 2025
\[^14]: Weekly download patterns from npm statistics, April 2025
\[^15]: npm download statistics for nodemailer, April 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Based on GitHub issues in the Upptime repository
\[^28]: Based on GitHub issues in the Upptime repository
\[^29]: Based on GitHub issues in the Upptime repository
\[^30]: npm download statistics for bree, February-March 2025
\[^31]: Based on GitHub pull requests to Upptime
\[^32]: Based on GitHub pull requests to Upptime
\[^34]: npm download statistics for koa, February-March 2025
\[^35]: npm download statistics for @koa/router, February-March 2025
\[^36]: npm download statistics for koa-router, February-March 2025
\[^37]: npm download statistics for url-regex, February-March 2025
\[^38]: npm download statistics for @breejs/later, February-March 2025
\[^39]: npm download statistics for email-templates, February-March 2025
\[^40]: npm download statistics for get-paths, February-March 2025
\[^41]: npm download statistics for dotenv-parse-variables, February-March 2025
\[^42]: npm download statistics for @koa/multer, February-March 2025
