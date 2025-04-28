# Create and Manage Newsletters with Listmonk


## Table of Contents

* [Overview](#overview)
* [Prerequisites](#prerequisites)
* [VPS Setup Tips](#vps-setup-tips)
* [Install Listmonk](#install-listmonk)
* [Enable SMTP in Forward Email](#enable-smtp-in-forward-email)
* [Configure Forward Email as SMTP](#configure-forward-email-as-smtp)
* [Configure Bounce Processing](#configure-bounce-processing)
  * [Changes in Forward Email](#changes-in-forward-email)
  * [Changes in Listmonk](#changes-in-listmonk)
  * [Additional Notes](#additional-notes)
* [Create a Mailing List and Campaign in Listmonk](#create-a-mailing-list-and-campaign-in-listmonk)
  * [Create a Mailing List](#create-a-mailing-list)
  * [Add Subscribers](#add-subscribers)
  * [Create and Send a Campaign](#create-and-send-a-campaign)
* [Testing and Verification](#testing-and-verification)
* [Notes for Developers](#notes-for-developers)
* [Conclusion](#conclusion)


## Overview

This guide walks developers through setting up a newsletter and mailing list system using [Listmonk](https://listmonk.app/) for campaign management and [Forward Email](https://forwardemail.net/) as the SMTP provider for secure and reliable email delivery.

| Component         | Responsibility                                                                                         |
| :---------------- | :----------------------------------------------------------------------------------------------------- |
| **Listmonk**      | Manages subscribers, mailing lists, campaign creation, and scheduling.                                 |
| **Forward Email** | Provides SMTP service for sending emails and enforces built-in email security (SPF, DKIM, DMARC, TLS). |

You will use Listmonk to **manage your audience and newsletters**, while Forward Email **handles email delivery and security**.

---


## Prerequisites

* A VPS (Virtual Private Server) with at least:
  * 1 CPU
  * 1 GB RAM (2 GB recommended)
  * Ubuntu 20.04+ or similar Linux distro
* A domain name with control over DNS records
* An account with [Forward Email](https://forwardemail.net/)
* Basic Linux server administration knowledge

---


## VPS Setup Tips

1. **Update your system:**

   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install necessary packages:**

   ```bash
   sudo apt install -y docker.io docker-compose
   ```

3. **Set up a basic firewall (UFW):**

   ```bash
   sudo ufw allow ssh
   sudo ufw allow http
   sudo ufw allow https
   sudo ufw enable
   ```

> \[!NOTE] Note on HTTPS
> You may wish to configure a reverse proxy (e.g., with Nginx or Caddy) to provide HTTPS support for your Listmonk instance.
>
> Alternatively, if you are using **Cloudflare** for your DNS, you can enable the **proxy** setting for your VPS IP to get automatic HTTPS support through Cloudflare.
>
> * To do this, you'll need to modify your Listmonk Docker Compose file:
>   * Change the app's port mapping from `9000:9000` to `80:9000`.
>   * This allows Cloudflare to route traffic to standard HTTP (port 80) while still securing it externally.
>
> Example Docker Compose change:
>
> ```yaml
> ports:
>   - "80:9000"
> ```
>
> Make sure to restart your containers (`docker compose down && docker compose up -d`) after making this change.

---


## Install Listmonk

1. **Download Listmonk:**

   ```bash
   # Download the compose file to the current directory.
   curl -LO https://github.com/knadh/listmonk/raw/master/docker-compose.yml
   ```

2. **Start listmonk components**

   ```bash
   # Run the services in the background.
   docker compose up -d
   ```

✅ Listmonk is now running on `http://<your-server-ip>:<port>`.

---


## Enable SMTP in Forward Email

Follow [this guide](https://forwardemail.net/guides/send-email-with-custom-domain-smtp) to enable SMTP for your domains alias if you haven't done so already.

> !\[IMPORTANT]
> Please ensure you have read our [Terms](https://forwardemail.net/terms), [Privacy Policy](https://forwardemail.net/privacy), and [Outbound SMTP Limits](https://forwardemail.net/faq#what-are-your-outbound-smtp-limits) – your use is considered acknowledgement and agreement.
>
> Please note that in order to maintain IP reputation and ensure deliverability, Forward Email has a manual review process on a per-domain basis for outbound SMTP approval. Email <support@forwardemail.net> or open a [help request](https://forwardemail.net/help) for approval. This typically takes less than 24 hours, with most requests being honored within 1-2 hours. In the near future we aim to make this process instant with additional spam controls and alerting. This process ensures that your emails reach the inbox and your messages don't get marked as spam.

---


## Configure Forward Email as SMTP

Listmonk includes a built-in option for **Forward Email** in the SMTP settings tab.\
You simply need to populate the fields as follows:

| Setting           | Value                        |
| :---------------- | :--------------------------- |
| **Host**          | `smtp.forwardemail.net`      |
| **Port**          | `465`                        |
| **Auth protocol** | `LOGIN`                      |
| **Username**      | Your alias **SMTP username** |
| **Password**      | Your alias **SMTP password** |
| **TLS**           | `SSL/TLS`                    |

✅ Using these settings ensures secure and authenticated email sending through Forward Email.

---


## Configure Bounce Processing

> !\[NOTE]
> Bounce processing in email is the process of handling emails that couldn’t be delivered to the recipient.
>
> When you send an email, sometimes it can’t reach the destination inbox. When that happens, the receiving email server sends back a bounce message (also called a Non-Delivery Report or NDR) to let you know delivery failed. Bounce processing is the system or logic you have that catches those bounce messages, reads them, and reacts to them.

### Changes in Forward Email

In the Forward Email dashboard, under your Domains Settings page, navigate down to the **Bounce Webhook URL** section and add `https://<your_listmonk_domain>/webhooks/service/forwardemail`. This will tell forward email when processing a bounced email to send a webhook (`POST` request) back to listmonk to process.

Just below this section, is the **Webhook Signature Payload Verification Key** section. Copy this verification key which will be used in your listmonk settings described below.

### Changes in Listmonk

In listmonk, navigate to **Settings** -> **Bounces**.

* Click the slider for **Enable bounce processing**.
* Click the slider for **Enable bounce webhooks**.
  * Scroll down and click the **Enable Forward Email**
  * For **Forward Email Key**, input the **Webhook Signature Payload Verification Key** you copied from Forward Email dashboard referenced above.
* Be sure to click Save.

✅ You've successfully enabled bounce processing! When a campaign email is unable to deliver to it's destination email address, you will see bounce information in the campaign dashboard.

### Additional Notes

* **Username/Password**: You can generate or view your SMTP credentials in your [Forward Email dashboard](https://forwardemail.net/).
* **TLS/SSL**: Always select **SSL/TLS** (not STARTTLS) for port 465 for best security.
* **Testing**: After configuring, use Listmonk’s built-in "Send Test Email" function to verify SMTP setup before launching a real campaign.

---


## Create a Mailing List and Campaign in Listmonk

### Create a Mailing List

* Go to **Lists** → **New List** → Fill in name, type (public/private), and save.

### Add Subscribers

* **Manually** (through admin UI), **bulk CSV upload**, or **API**.

### Create and Send a Campaign

* Create a new campaign.
* Write your email content (HTML or plain text).
* Attach the campaign to one or more mailing lists.
* Send a **test email** first!
* Launch the campaign when ready.

---


## Testing and Verification

* Ensure emails are **sent successfully** via Forward Email's SMTP server.
* Verify email security headers using tools like [Mail-Tester](https://www.mail-tester.com/).
* Monitor Listmonk’s delivery and bounce reports.
* Use Forward Email’s dashboard/logs for any SMTP delivery issues.

---


## Notes for Developers

* **Templates**: Listmonk supports Go templates (`{{ .Subscriber.Email }}`) for dynamic email content.
* **APIs**: Listmonk is fully API-driven for programmatic list, subscriber, and campaign management.
* **Scalability**: Forward Email handles security and high deliverability at scale; Listmonk can be horizontally scaled if needed.
* **Best Practice**: Always use double opt-in workflows for mailing lists to ensure compliance and reduce bounces.

---


## Conclusion

By combining Listmonk and Forward Email:

* You **own your subscribers and campaigns**.
* You **control your email deliverability and security**.
* You have a **cost-effective, scalable, and privacy-focused** system.

Happy sending! 🚀
