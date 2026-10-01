# Self-Hosted Email: Commitment to Open Source

<!-- <img loading="lazy" src="/img/articles/self-hosted.webp" alt="Self-hosted email solution illustration" class="rounded-lg" /> -->


## Table of Contents

* [Foreword](#foreword)
* [Why Self-Hosted Email Matters](#why-self-hosted-email-matters)
  * [The Problem with Traditional Email Services](#the-problem-with-traditional-email-services)
  * [The Self-Hosted Alternative](#the-self-hosted-alternative)
* [Our Self-Hosted Implementation: Technical Overview](#our-self-hosted-implementation-technical-overview)
  * [Docker-Based Architecture for Simplicity and Portability](#docker-based-architecture-for-simplicity-and-portability)
  * [Bash Script Installation: Accessibility Meets Security](#bash-script-installation-accessibility-meets-security)
  * [Quantum-Safe Encryption for Future-Proof Privacy](#quantum-safe-encryption-for-future-proof-privacy)
  * [Automated Maintenance and Updates](#automated-maintenance-and-updates)
* [The Open-Source Commitment](#the-open-source-commitment)
* [Self-Hosted vs. Managed: Making the Right Choice](#self-hosted-vs-managed-making-the-right-choice)
  * [The Reality of Self-Hosting Email](#the-reality-of-self-hosting-email)
  * [When to Choose Our Managed Service](#when-to-choose-our-managed-service)
* [Getting Started with Self-Hosted Forward Email](#getting-started-with-self-hosted-forward-email)
  * [System Requirements](#system-requirements)
  * [Installation Steps](#installation-steps)
* [The Future of Self-Hosted Email](#the-future-of-self-hosted-email)
* [Conclusion: Email Freedom for Everyone](#conclusion-email-freedom-for-everyone)
* [References](#references)


## Foreword

Email remains the backbone of our online identity and communication. Many users have to trade privacy for convenience, or convenience for privacy. At Forward Email, we've always believed you shouldn't have to choose between the two.

We've launched our self-hosted email solution. It follows our open-source principles and privacy-focused design, and it puts full control of your email communication in your hands.

This post covers the philosophy behind our self-hosted solution, its technical implementation, and what it offers users who want both privacy and ownership of their digital communications.


## Why Self-Hosted Email Matters

We believe privacy means control, and control starts with open source. Our self-hosted email solution gives users who want full ownership of their digital communications a fully open, verifiable platform they can run on their own terms.

### The Problem with Traditional Email Services

Traditional email services pose these problems for privacy-conscious users:

1. **Trust Requirements**: You must trust the provider not to access, analyze, or share your data
2. **Centralized Control**: Your access can be revoked at any time for any reason
3. **Surveillance Vulnerability**: Centralized services are prime targets for surveillance
4. **Limited Transparency**: Most services use proprietary, closed-source software
5. **Vendor Lock-in**: Migrating away from these services can be difficult or impossible

Even "privacy-focused" email providers often fall short by only open-sourcing their frontend applications while keeping their backend systems proprietary and closed. You're asked to believe their privacy promises without the ability to verify them.

### The Self-Hosted Alternative

Self-hosting your email gives you:

1. **Complete Control**: You own and control the entire email infrastructure
2. **Verifiable Privacy**: The entire system is transparent and auditable
3. **No Trust Required**: You don't need to trust a third party with your communications
4. **Customization Freedom**: Adapt the system to your specific needs
5. **Resilience**: Your service continues regardless of any company's decisions

As one user put it: "Self-hosting my email is the digital equivalent of growing my own food—it takes more work, but I know exactly what's in it."


## Our Self-Hosted Implementation: Technical Overview

Our self-hosted email solution is built on the same privacy-first principles that guide all our products. Here is how we implemented it.

### Docker-Based Architecture for Simplicity and Portability

We've packaged our entire email infrastructure using Docker, making it easy to deploy on most Linux-based systems. This containerized approach provides these benefits:

1. **Simplified Deployment**: A single command sets up the entire infrastructure
2. **Consistent Environment**: Eliminates "works on my machine" problems
3. **Isolated Components**: Each service runs in its own container for security
4. **Easy Updates**: Simple commands to update the entire stack
5. **Minimal Dependencies**: Only requires Docker and Docker Compose

The architecture includes containers for:

* Web interface for administration, plus an API server for programmatic access
* An nginx SNI router that terminates TLS on port 443 and proxies to the web, API, CalDAV, and CardDAV apps
* SMTP server for outbound email and an MX server for inbound mail
* IMAP/POP3 servers for email retrieval
* CalDAV server for calendars
* CardDAV server for contacts
* SQLite server for secure, encrypted mailbox storage, plus a SQLite worker that runs mailbox backups, `VACUUM`s, and alias-password rotations
* Scheduled job runners (Bree) for the web/API, outbound, and SQLite tiers
* MongoDB for configuration storage
* Redis for caching and performance

> \[!NOTE]
> Be sure to check out our [self-hosted developer guide](https://forwardemail.net/self-hosted)

### Bash Script Installation: Accessibility Meets Security

We've designed the installation process to be as simple as possible while maintaining security best practices:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

This single command:

1. Verifies system requirements
2. Guides you through configuration
3. Sets up DNS records
4. Configures TLS certificates
5. Deploys the Docker containers
6. Performs initial security hardening

For those concerned about piping scripts to bash (as you should be!), we encourage reviewing the script before execution. It's fully open-source and available for inspection.

### Quantum-Safe Encryption for Future-Proof Privacy

Like our hosted service, our self-hosted solution implements quantum-resistant encryption using ChaCha20-Poly1305 as the cipher for SQLite databases. This approach protects your email data against current threats and future quantum computing attacks.

Each mailbox is stored in its own encrypted SQLite database file, providing complete isolation between users, which is more secure than traditional shared database approaches.

### Automated Maintenance and Updates

We've built maintenance utilities into the self-hosted solution:

1. **Automatic Backups**: Scheduled backups of all critical data
2. **Certificate Renewal**: Automated Let's Encrypt certificate management
3. **System Updates**: Simple command to update to the latest version
4. **Health Monitoring**: Built-in checks to ensure system integrity

These utilities are accessible through a simple interactive menu:

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```


## The Open-Source Commitment

Our self-hosted email solution, like all our products, is 100% open-source, frontend and backend. This means:

1. **Complete Transparency**: Every line of code that processes your emails is available for public scrutiny
2. **Community Contributions**: Anyone can contribute improvements or fix issues
3. **Security Through Openness**: Vulnerabilities can be identified and fixed by a global community
4. **No Vendor Lock-in**: You're never dependent on our company's existence

The entire codebase is available on GitHub at <https://github.com/forwardemail/forwardemail.net>.


## Self-Hosted vs. Managed: Making the Right Choice

Self-hosting is not the right choice for everyone. Self-hosting email comes with real responsibilities and challenges:

### The Reality of Self-Hosting Email

#### Technical Considerations

* **Server Management**: You'll need to maintain a VPS or dedicated server
* **DNS Configuration**: Proper DNS setup is critical for deliverability
* **Security Updates**: Staying current with security patches is essential
* **Spam Management**: You'll need to handle spam filtering
* **Backup Strategy**: Implementing reliable backups is your responsibility

#### Time Investment

* **Initial Setup**: Time to setup, verify and read the documentation
* **Ongoing Maintenance**: Occasional updates and monitoring
* **Troubleshooting**: Occasional time for resolving issues

#### Financial Considerations

* **Server Costs**: $5-$20/month for a basic VPS
* **Domain Registration**: $10-$20/year
* **Time Value**: Your time investment has real value

### When to Choose Our Managed Service

For many users, our managed service remains the best option:

1. **Convenience**: We handle all maintenance, updates, and monitoring
2. **Reliability**: Benefit from our established infrastructure and expertise
3. **Support**: Get help when issues arise
4. **Deliverability**: Use our established IP reputation
5. **Cost-Effectiveness**: When you factor in time costs, our service often costs less

Both options provide the same privacy benefits and open-source transparency. The difference is who manages the infrastructure.


## Getting Started with Self-Hosted Forward Email

To get started:

### System Requirements

* Ubuntu 20.04 LTS or newer, or Debian 11/12 (see the [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) and [Debian](https://forwardemail.net/guides/selfhosted-on-debian) step-by-step guides)
* 1GB RAM minimum (2GB+ recommended)
* 20GB storage recommended
* A domain name you control
* Public IP address with port 25 support
* Ability to set [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4 and IPv6 support

> \[!TIP]
> We recommend several mail server providers at <https://forwardemail.net/blog/docs/best-mail-server-providers> (source at <https://github.com/forwardemail/awesome-mail-server-providers>)

### Installation Steps

1. **Run the Installation Script**:
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
   ```

2. **Follow the Interactive Prompts**:
   * Enter your domain name
   * Configure administrator credentials
   * Set up DNS records as instructed
   * Choose your preferred configuration options

3. **Verify Installation**:
   Once installation completes, you can verify everything is working by:
   * Checking container status: `docker ps`
   * Sending a test email
   * Logging into the web interface


## The Future of Self-Hosted Email

We plan to improve the self-hosted solution with:

1. **Enhanced Administration Tools**: More powerful web-based management
2. **Additional Authentication Options**: Including hardware security key support
3. **Advanced Monitoring**: Better insights into system health and performance
4. **Multi-Server Deployment**: Options for high-availability configurations
5. **Community-Driven Improvements**: Incorporating contributions from users


## Conclusion: Email Freedom for Everyone

Our self-hosted email solution extends our privacy-focused, transparent email services. Our managed service and self-hosted option share the same open-source code and privacy-first design.

Email is too important to be controlled by closed, proprietary systems that prioritize data collection over user privacy. Forward Email's self-hosted solution is an alternative that puts you in complete control of your digital communications.

We believe privacy is a fundamental right, and our self-hosted email option makes it more accessible.

[Get started today](https://forwardemail.net/self-hosted) or explore our [GitHub repository](https://github.com/forwardemail/forwardemail.net) to learn more.


## References

\[1] Forward Email GitHub Repository: <https://github.com/forwardemail/forwardemail.net>

\[2] Self-Hosted Documentation: <https://forwardemail.net/en/self-hosted>

\[3] Email Privacy Technical Implementation: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] Why Open-Source Email Matters: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
