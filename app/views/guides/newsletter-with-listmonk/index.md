# Listmonk with Forward Email for Secure Newsletter Delivery


## Table of Contents

* [Overview](#overview)
* [Why Listmonk and Forward Email?](#why-listmonk-and-forward-email)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
  * [1. Update Your Server](#1-update-your-server)
  * [2. Install Dependencies](#2-install-dependencies)
  * [3. Download Listmonk Configuration](#3-download-listmonk-configuration)
  * [4. Configure Firewall (UFW)](#4-configure-firewall-ufw)
  * [5. Configure HTTPS Access](#5-configure-https-access)
  * [6. Start Listmonk](#6-start-listmonk)
  * [7. Configure Forward Email SMTP in Listmonk](#7-configure-forward-email-smtp-in-listmonk)
  * [8. Configure Bounce Processing](#8-configure-bounce-processing)
* [Testing](#testing)
  * [Create a Mailing List](#create-a-mailing-list)
  * [Add Subscribers](#add-subscribers)
  * [Create and Send a Campaign](#create-and-send-a-campaign)
* [Verification](#verification)
* [Developer Notes](#developer-notes)
* [Conclusion](#conclusion)


## Overview

This guide provides developers with step-by-step instructions for setting up [Listmonk](https://listmonk.app/), a powerful open-source newsletter and mailing list manager, to use [Forward Email](https://forwardemail.net/) as its SMTP provider. This combination allows you to manage your campaigns effectively while ensuring secure, private, and reliable email delivery.

* **Listmonk**: Handles subscriber management, list organization, campaign creation, and performance tracking.
* **Forward Email**: Acts as the secure SMTP server, handling the actual sending of emails with built-in security features like SPF, DKIM, DMARC, and TLS encryption.

By integrating these two, you retain full control over your data and infrastructure while leveraging Forward Email's robust delivery system.


## Why Listmonk and Forward Email?

* **Open Source**: Both Listmonk and the principles behind Forward Email emphasize transparency and control. You host Listmonk yourself, owning your data.
* **Privacy-Focused**: Forward Email is built with privacy at its core, minimizing data retention and focusing on secure transmission.
* **Cost-Effective**: Listmonk is free, and Forward Email offers generous free tiers and affordable paid plans, making this a budget-friendly solution.
* **Scalability**: Listmonk is highly performant, and Forward Email's infrastructure is designed for reliable delivery at scale.
* **Developer-Friendly**: Listmonk offers a robust API, and Forward Email provides straightforward SMTP integration and webhooks.


## Prerequisites

Before you begin, ensure you have the following:

* A Virtual Private Server (VPS) running a recent Linux distribution (Ubuntu 20.04+ recommended) with at least 1 CPU and 1GB RAM (2GB recommended).
  * Need a provider? Check out the [recommended VPS list](https://github.com/forwardemail/awesome-mail-server-providers).
* A domain name that you control (DNS access required).
* An active account with [Forward Email](https://forwardemail.net/).
* Root or `sudo` access to your VPS.
* Basic familiarity with Linux command-line operations.


## Installation

These steps guide you through installing Listmonk using Docker and Docker Compose on your VPS.

### 1. Update Your Server

Ensure your system's package list and installed packages are up-to-date.

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Dependencies

Install Docker, Docker Compose, and UFW (Uncomplicated Firewall).

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Download Listmonk Configuration

Create a directory for Listmonk and download the official `docker-compose.yml` file.

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

This file defines the Listmonk application container and its required PostgreSQL database container.

### 4. Configure Firewall (UFW)

Allow essential traffic (SSH, HTTP, HTTPS) through the firewall. If your SSH runs on a non-standard port, adjust accordingly.

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

Confirm enabling the firewall when prompted.

### 5. Configure HTTPS Access

Running Listmonk over HTTPS is crucial for security. You have two primary options:

**Option A: Using Cloudflare Proxy (Recommended for Simplicity)**

If your domain's DNS is managed by Cloudflare, you can leverage their proxy feature for easy HTTPS.

1. **Point DNS**: Create an `A` record in Cloudflare for your Listmonk subdomain (e.g., `listmonk.yourdomain.com`) pointing to your VPS IP address. Ensure the **Proxy status** is set to **Proxied** (orange cloud).
2. **Modify Docker Compose**: Edit the `docker-compose.yml` file you downloaded:
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   This makes Listmonk accessible internally on port 80, which Cloudflare can then proxy and secure with HTTPS.

**Option B: Using a Reverse Proxy (Nginx, Caddy, etc.)**

Alternatively, you can set up a reverse proxy like Nginx or Caddy on your VPS to handle HTTPS termination and proxy requests to Listmonk (running on port 9000 by default).

* Keep the default `ports: - "127.0.0.1:9000:9000"` in `docker-compose.yml` to ensure Listmonk is only accessible locally.
* Configure your chosen reverse proxy to listen on ports 80 and 443, handle SSL certificate acquisition (e.g., via Let's Encrypt), and forward traffic to `http://127.0.0.1:9000`.
* Detailed reverse proxy setup is beyond this guide's scope, but many tutorials are available online.

### 6. Start Listmonk

Navigate back to your `listmonk` directory (if you aren't already there) and start the containers in detached mode.

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker will download the necessary images and start the Listmonk application and database containers. It might take a minute or two the first time.

✅ **Access Listmonk**: You should now be able to access the Listmonk web interface via the domain you configured (e.g., `https://listmonk.yourdomain.com`).

### 7. Configure Forward Email SMTP in Listmonk

Next, configure Listmonk to send emails using your Forward Email account.

1. **Enable SMTP in Forward Email**: Ensure you have generated SMTP credentials within your Forward Email account dashboard. Follow the [Forward Email guide to send email with a custom domain via SMTP](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) if you haven't already.
2. **Configure Listmonk**: Log in to your Listmonk admin panel.
   * Navigate to **Settings -> SMTP**.

   * Listmonk has built-in support for Forward Email. Select **ForwardEmail** from the provider list, or manually enter the following details:

     | Setting           | Value                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **Host**          | `smtp.forwardemail.net`                                                                                             |
     | **Port**          | `465`                                                                                                               |
     | **Auth protocol** | `LOGIN`                                                                                                             |
     | **Username**      | Your Forward Email **SMTP username**                                                                                |
     | **Password**      | Your Forward Email **SMTP password**                                                                                |
     | **TLS**           | `SSL/TLS`                                                                                                           |
     | **From e-mail**   | Your desired `From` address (e.g., `newsletter@yourdomain.com`). Ensure this domain is configured in Forward Email. |

   * **Important**: Always use Port `465` with `SSL/TLS` for secure connections with Forward Email. Do not use STARTTLS (port 587).

   * Click **Save**.
3. **Send Test Email**: Use the "Send Test E-mail" button within the SMTP settings page. Enter a recipient address you can access and click **Send**. Verify that the email arrives in the recipient's inbox.

### 8. Configure Bounce Processing

Bounce processing allows Listmonk to automatically handle emails that couldn't be delivered (e.g., due to invalid addresses). Forward Email provides a webhook to notify Listmonk about bounces.

#### Forward Email Setup

1. Log in to your [Forward Email Dashboard](https://forwardemail.net/).
2. Navigate to **Domains**, select the domain you are using for sending, and go to its **Settings** page.
3. Scroll down to the **Bounce Webhook URL** section.
4. Enter the following URL, replacing `<your_listmonk_domain>` with the actual domain or subdomain where your Listmonk instance is accessible:
   ```
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *Example*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. Scroll down further to the **Webhook Signature Payload Verification Key** section.
6. **Copy** the generated verification key. You will need this in Listmonk.
7. Save the changes in your Forward Email domain settings.

#### Listmonk Setup

1. In your Listmonk admin panel, navigate to **Settings -> Bounces**.
2. Enable **Enable bounce processing**.
3. Enable **Enable bounce webhooks**.
4. Scroll down to the **Webhook Providers** section.
5. Enable **Forward Email**.
6. Paste the **Webhook Signature Payload Verification Key** you copied from the Forward Email dashboard into the **Forward Email Key** field.
7. Click **Save** at the bottom of the page.
8. Bounce processing is now configured! When Forward Email detects a bounce for an email sent by Listmonk, it will notify your Listmonk instance via the webhook, and Listmonk will mark the subscriber accordingly.
9. Complete the steps below in [Testing](#testing) to ensure everything is working.


## Testing

Here's a quick overview of core Listmonk functions:

### Create a Mailing List

* Go to **Lists** in the sidebar.
* Click **New List**.
* Fill in the details (Name, Type: Public/Private, Description, Tags) and **Save**.

### Add Subscribers

* Navigate to the **Subscribers** section.
* You can add subscribers:
  * **Manually**: Click **New Subscriber**.
  * **Import**: Click **Import Subscribers** to upload a CSV file.
  * **API**: Use the Listmonk API for programmatic additions.
* Assign subscribers to one or more lists during creation or import.
* **Best Practice**: Use a double opt-in process. Configure this under **Settings -> Opt-in & Subscriptions**.

### Create and Send a Campaign

* Go to **Campaigns** -> **New Campaign**.
* Fill in the campaign details (Name, Subject, From Email, List(s) to send to).
* Choose your content type (Rich Text/HTML, Plain Text, Raw HTML).
* Compose your email content. You can use template variables like `{{ .Subscriber.Email }}` or `{{ .Subscriber.FirstName }}`.
* **Always send a test email first!** Use the "Send Test" option to preview the email in your inbox.
* Once satisfied, click **Start Campaign** to send immediately or schedule it for later.


## Verification

* **SMTP Delivery**: Regularly send test emails via Listmonk's SMTP settings page and test campaigns to ensure emails are delivered correctly.
* **Bounce Handling**: Send a test campaign to a known invalid email address (e.g., `bounce-test@yourdomain.com` if you don't have a real one handy, though results may vary). Check the campaign stats in Listmonk after a short while to see if the bounce is registered.
* **Email Headers**: Use tools like [Mail-Tester](https://www.mail-tester.com/) or inspect email headers manually to verify that SPF, DKIM, and DMARC are passing, indicating proper setup through Forward Email.
* **Forward Email Logs**: Check your Forward Email dashboard logs if you suspect delivery issues originating from the SMTP server.


## Developer Notes

* **Templating**: Listmonk uses Go's templating engine. Explore its documentation for advanced personalization: `{{ .Subscriber.Attribs.your_custom_field }}`.
* **API**: Listmonk provides a comprehensive REST API for managing lists, subscribers, campaigns, templates, and more. Find the API documentation link in your Listmonk instance's footer.
* **Custom Fields**: Define custom subscriber fields under **Settings -> Subscriber Fields** to store additional data.
* **Webhooks**: Besides bounces, Listmonk can send webhooks for other events (e.g., subscriptions), allowing integration with other systems.


## Conclusion

By integrating the self-hosted power of Listmonk with the secure, privacy-respecting delivery of Forward Email, you create a robust and ethical email marketing platform. You maintain full ownership of your audience data while benefiting from high deliverability and automated security features.

This setup provides a scalable, cost-effective, and developer-friendly alternative to proprietary email services, aligning perfectly with the ethos of open-source software and user privacy.

Happy Sending! 🚀
