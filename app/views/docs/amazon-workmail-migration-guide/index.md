# Amazon WorkMail Migration Guide: Step-by-Step Switch to Forward Email Before the 2027 Shutdown

<img loading="lazy" src="/img/articles/workmail-migration.webp" alt="Amazon WorkMail to Forward Email migration guide" class="rounded-lg" />

> \[!IMPORTANT]
> **Disclaimer**: Forward Email is not affiliated with, endorsed by, or sponsored by Amazon Web Services (AWS), Amazon WorkMail, or any Amazon subsidiary. All Amazon and AWS trademarks are the property of Amazon.com, Inc. This guide is provided independently to help Amazon WorkMail customers evaluate their migration options.


## Table of Contents

* [Overview](#overview)
* [Why Migrate from Amazon WorkMail](#why-migrate-from-amazon-workmail)
* [Amazon WorkMail End of Support Timeline](#amazon-workmail-end-of-support-timeline)
* [Why Forward Email is the Best Amazon WorkMail Alternative](#why-forward-email-is-the-best-amazon-workmail-alternative)
* [Before You Begin](#before-you-begin)
* [Step 1: Export Your Email from Amazon WorkMail](#step-1-export-your-email-from-amazon-workmail)
  * [Option A: Export via IMAP Using Thunderbird (Recommended)](#option-a-export-via-imap-using-thunderbird-recommended)
  * [Option B: Export via AWS Mailbox Export API](#option-b-export-via-aws-mailbox-export-api)
  * [Option C: Export via imapsync Command-Line Tool](#option-c-export-via-imapsync-command-line-tool)
* [Step 2: Create Your Forward Email Account](#step-2-create-your-forward-email-account)
* [Step 3: Add and Verify Your Domain](#step-3-add-and-verify-your-domain)
* [Step 4: Configure DNS Records](#step-4-configure-dns-records)
  * [MX Records](#mx-records)
  * [SPF Record](#spf-record)
  * [DKIM and DMARC Records](#dkim-and-dmarc-records)
  * [Verify DNS Configuration](#verify-dns-configuration)
* [Step 5: Create Email Aliases and Mailboxes](#step-5-create-email-aliases-and-mailboxes)
* [Step 6: Import Your Email to Forward Email](#step-6-import-your-email-to-forward-email)
  * [Import Using Thunderbird (Recommended)](#import-using-thunderbird-recommended)
  * [Import Using imapsync](#import-using-imapsync)
* [Step 7: Configure Your Email Clients](#step-7-configure-your-email-clients)
  * [Thunderbird](#thunderbird)
  * [Microsoft Outlook](#microsoft-outlook)
  * [Apple Mail](#apple-mail)
  * [Mobile Devices (iOS and Android)](#mobile-devices-ios-and-android)
* [Step 8: Verify and Test Your Setup](#step-8-verify-and-test-your-setup)
* [Step 9: Decommission Amazon WorkMail](#step-9-decommission-amazon-workmail)
* [Migrating Contacts and Calendars](#migrating-contacts-and-calendars)
* [Migrating Multiple Users or an Organization](#migrating-multiple-users-or-an-organization)
* [Troubleshooting Common Migration Issues](#troubleshooting-common-migration-issues)
* [Frequently Asked Questions](#frequently-asked-questions)
* [Conclusion](#conclusion)


## Overview

Amazon Web Services (AWS) has announced that **Amazon WorkMail will be discontinued on March 31, 2027**. After that date, you will no longer be able to access the Amazon WorkMail console, web client, or any WorkMail resources. This guide provides a complete, step-by-step walkthrough for migrating your email, contacts, and calendars from Amazon WorkMail to [Forward Email](https://forwardemail.net) — a privacy-focused, open-source email service that supports custom domains, IMAP, SMTP, CalDAV, and CardDAV.

Whether you are an individual user, a small business, or an organization with multiple mailboxes, this guide covers everything you need to ensure a smooth transition with zero data loss.


## Why Migrate from Amazon WorkMail

AWS officially confirmed the end of support for Amazon WorkMail in their [administrator documentation](https://docs.aws.amazon.com/workmail/latest/adminguide/workmail-end-of-support.html). The key facts are straightforward:

Amazon WorkMail will no longer accept new customers beginning April 30, 2026. Existing customers can continue using the service until March 31, 2027. After that date, all access to WorkMail — including the web client, APIs, IMAP/SMTP endpoints, and the AWS console — will be permanently shut down.

This means every Amazon WorkMail user must migrate to another email provider before the deadline. Waiting until the last minute risks data loss, service interruption, and the inability to receive email on your custom domain.


## Amazon WorkMail End of Support Timeline

| Date                 | Event                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------- |
| April 30, 2026       | Amazon WorkMail stops accepting new customers                                           |
| March 31, 2027       | Full shutdown — no access to WorkMail console, web client, IMAP, SMTP, or any resources |
| After March 31, 2027 | All WorkMail data becomes permanently inaccessible                                      |

> **Recommendation**: Begin your migration as soon as possible. DNS propagation, email client reconfiguration, and data transfer all take time. Starting early ensures you can test everything thoroughly before the shutdown date.


## Why Forward Email is the Best Amazon WorkMail Alternative

AWS recommends migrating to third-party solutions. [Forward Email](https://forwardemail.net) stands out as the best alternative for Amazon WorkMail users for several reasons:

| Feature                             | Amazon WorkMail               | Forward Email                                                       |
| ----------------------------------- | ----------------------------- | ------------------------------------------------------------------- |
| Custom domain support               | Yes                           | Yes                                                                 |
| IMAP/SMTP/POP3                      | Yes                           | Yes                                                                 |
| CalDAV (calendars)                  | No (Exchange ActiveSync only) | Yes                                                                 |
| CardDAV (contacts)                  | No (Exchange ActiveSync only) | Yes                                                                 |
| End-to-end encryption (OpenPGP)     | No                            | Yes                                                                 |
| Open source                         | No                            | Yes — [100% open source on GitHub](https://github.com/forwardemail) |
| Privacy-focused (no email scanning) | Partial                       | Yes — no ads, no tracking, no email scanning                        |
| Quantum-safe encrypted storage      | No                            | Yes                                                                 |
| Unlimited aliases                   | No                            | Yes                                                                 |
| Email forwarding                    | No                            | Yes                                                                 |
| Pricing                             | $4.00/user/month              | Starting at $3.00/month for unlimited domains                       |
| Vendor lock-in                      | AWS ecosystem                 | None — standard IMAP/SMTP, export anytime                           |

Forward Email is trusted by over 500,000 domains including the U.S. Naval Academy, Canonical (Ubuntu), Netflix Games, The Linux Foundation, and many universities and government organizations. You can read more on our [about page](https://forwardemail.net/en/about).


## Before You Begin

Before starting the migration, gather the following information and complete these prerequisites:

**From your Amazon WorkMail account, you will need:**

1. Your Amazon WorkMail email address (e.g., `user@yourdomain.com`)
2. Your Amazon WorkMail password
3. Your WorkMail IMAP server endpoint (based on your AWS region — see table below)
4. Access to your domain's DNS management (Route 53, Cloudflare, or wherever your domain is hosted)
5. A list of all users/mailboxes if migrating an organization

**Amazon WorkMail IMAP and SMTP server endpoints by region:**

| AWS Region            | IMAP Server                       | SMTP Server                       |
| --------------------- | --------------------------------- | --------------------------------- |
| US East (N. Virginia) | `imap.mail.us-east-1.awsapps.com` | `smtp.mail.us-east-1.awsapps.com` |
| US West (Oregon)      | `imap.mail.us-west-2.awsapps.com` | `smtp.mail.us-west-2.awsapps.com` |
| Europe (Ireland)      | `imap.mail.eu-west-1.awsapps.com` | `smtp.mail.eu-west-1.awsapps.com` |

> **Tip**: You can find your region by logging into the [Amazon WorkMail console](https://console.aws.amazon.com/workmail/) and checking the URL or the region selector in the top-right corner. Your WorkMail web client URL also contains the region (e.g., `https://your-alias.awsapps.com/mail`).

**IMAP connection settings for Amazon WorkMail:**

| Setting        | Value                   |
| -------------- | ----------------------- |
| Protocol       | IMAP                    |
| Port           | 993                     |
| Encryption     | SSL/TLS                 |
| Authentication | Normal password         |
| Username       | Your full email address |


## Step 1: Export Your Email from Amazon WorkMail

There are three methods to export your email from Amazon WorkMail. We recommend **Option A** (Thunderbird) for most users because it is the simplest and does not require any programming knowledge.

### Option A: Export via IMAP Using Thunderbird (Recommended)

[Thunderbird](https://www.thunderbird.net/) is a free, open-source email client that makes it easy to connect to Amazon WorkMail via IMAP and export all your messages.

1. **Download and install [Thunderbird](https://www.thunderbird.net/)** if you do not already have it.

2. **Add your Amazon WorkMail account to Thunderbird:**

   * Open Thunderbird and go to **Account Settings** (Edit → Account Settings on Linux, or Tools → Account Settings)
   * Click **Account Actions → Add Mail Account**
   * Enter your name, your Amazon WorkMail email address, and your WorkMail password
   * Click **Configure manually** and enter the following settings:

   | Setting        | Incoming (IMAP)                  | Outgoing (SMTP)                  |
   | -------------- | -------------------------------- | -------------------------------- |
   | Server         | `imap.mail.{region}.awsapps.com` | `smtp.mail.{region}.awsapps.com` |
   | Port           | 993                              | 465                              |
   | Encryption     | SSL/TLS                          | SSL/TLS                          |
   | Authentication | Normal password                  | Normal password                  |
   | Username       | Your full email address          | Your full email address          |

   Replace `{region}` with your AWS region (e.g., `us-east-1`, `us-west-2`, or `eu-west-1`).

3. **Wait for Thunderbird to sync all your folders and messages.** This may take several minutes to hours depending on the size of your mailbox. You can monitor progress in the status bar at the bottom of the Thunderbird window.

4. **Install the [ImportExportTools NG](https://github.com/thunderbird/import-export-tools-ng) add-on:**
   * Go to **Tools → Add-ons and Themes** (or press `Ctrl+Shift+A`)
   * Search for "ImportExportTools NG"
   * Click **Add to Thunderbird** and restart Thunderbird

5. **Export your email:**

   * Right-click on a folder (e.g., Inbox) in your Amazon WorkMail account
   * Select **ImportExportTools NG → Export folder as MBOX file**
   * Choose a location to save the exported file
   * Repeat for each folder you want to export (Sent, Drafts, etc.)

   Alternatively, you can right-click on the top-level account and select **ImportExportTools NG → Export all folders as MBOX files** to export everything at once.

> **Tip**: Keep Thunderbird open with your Amazon WorkMail account connected — you will use it again in Step 6 to import your email into Forward Email. You can also skip the export step entirely and simply drag-and-drop emails between accounts in Thunderbird (see Step 6).

### Option B: Export via AWS Mailbox Export API

If you are comfortable with the AWS CLI and prefer an automated approach, you can use the `StartMailboxExportJob` API to export mailbox content to an Amazon S3 bucket. This method exports all email messages and calendar items in MIME format as a `.zip` file.

**Prerequisites:**

* AWS CLI installed and configured
* An S3 bucket (with public access blocked)
* A symmetric AWS KMS key
* An IAM role with the appropriate permissions

**Step-by-step:**

1. **Create an S3 bucket** for the export (if you do not already have one):

   ```bash
   aws s3 mb s3://my-workmail-export-bucket --region us-east-1
   ```

2. **Create an IAM policy** (`mailbox-export-policy.json`) that grants write access to the S3 bucket and KMS encryption:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:AbortMultipartUpload",
           "s3:PutObject",
           "s3:GetBucketPolicyStatus"
         ],
         "Resource": [
           "arn:aws:s3:::my-workmail-export-bucket",
           "arn:aws:s3:::my-workmail-export-bucket/*"
         ]
       },
       {
         "Effect": "Allow",
         "Action": [
           "kms:Decrypt",
           "kms:GenerateDataKey"
         ],
         "Resource": [
           "arn:aws:kms:us-east-1:YOUR_ACCOUNT_ID:key/YOUR_KEY_ID"
         ],
         "Condition": {
           "StringEquals": {
             "kms:ViaService": "s3.us-east-1.amazonaws.com"
           }
         }
       }
     ]
   }
   ```

3. **Create an IAM trust policy** (`mailbox-export-trust-policy.json`):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "",
         "Effect": "Allow",
         "Principal": {
           "Service": "export.workmail.amazonaws.com"
         },
         "Action": "sts:AssumeRole"
       }
     ]
   }
   ```

4. **Create the IAM role and attach the policy:**

   ```bash
   aws iam create-role \
     --role-name WorkMailExportRole \
     --assume-role-policy-document file://mailbox-export-trust-policy.json

   aws iam put-role-policy \
     --role-name WorkMailExportRole \
     --policy-name WorkMailExportPolicy \
     --policy-document file://mailbox-export-policy.json
   ```

5. **Start the mailbox export job:**

   ```bash
   aws workmail start-mailbox-export-job \
     --organization-id YOUR_ORG_ID \
     --entity-id YOUR_USER_ENTITY_ID \
     --role-arn arn:aws:iam::YOUR_ACCOUNT_ID:role/WorkMailExportRole \
     --kms-key-arn arn:aws:kms:us-east-1:YOUR_ACCOUNT_ID:key/YOUR_KEY_ID \
     --s3-bucket-name my-workmail-export-bucket \
     --s3-prefix exports/ \
     --region us-east-1
   ```

6. **Monitor the export job:**

   ```bash
   aws workmail describe-mailbox-export-job \
     --organization-id YOUR_ORG_ID \
     --job-id YOUR_JOB_ID \
     --region us-east-1
   ```

7. **Download the exported `.zip` file** from your S3 bucket once the job completes.

> **Note**: The AWS mailbox export only includes email messages and calendar items. Contacts and tasks are **not** exported. The export time depends on the size of your mailbox.

### Option C: Export via imapsync Command-Line Tool

[imapsync](https://github.com/imapsync/imapsync) is an open-source IMAP transfer and migration tool that can copy emails directly from one IMAP server to another. This is particularly useful for large mailboxes or automated migrations of multiple users.

1. **Install imapsync** on a Linux machine (Debian/Ubuntu):

   ```bash
   sudo apt-get update
   sudo apt-get install -y imapsync
   ```

   On macOS (via Homebrew):

   ```bash
   brew install imapsync
   ```

2. **Run imapsync to transfer directly from WorkMail to Forward Email:**

   ```bash
   imapsync \
     --host1 imap.mail.us-east-1.awsapps.com \
     --port1 993 --ssl1 \
     --user1 user@yourdomain.com \
     --password1 'YOUR_WORKMAIL_PASSWORD' \
     --host2 imap.forwardemail.net \
     --port2 993 --ssl2 \
     --user2 user@yourdomain.com \
     --password2 'YOUR_FORWARD_EMAIL_PASSWORD'
   ```

   Replace the server, user, and password values with your actual credentials. Adjust `--host1` to match your WorkMail region.

> **Tip**: Using imapsync with the `--dry` flag first runs a simulation without transferring any data, which is useful for testing: `imapsync --dry --host1 ... --host2 ...`

> **Note**: If you use Option C, you can skip Step 6 (Import) entirely since imapsync transfers email directly between the two servers.


## Step 2: Create Your Forward Email Account

1. Go to [forwardemail.net/register](https://forwardemail.net/register) and create a new account.

2. Choose a plan that fits your needs. For full IMAP/SMTP mailbox access (which you will need to replace Amazon WorkMail), a paid plan is required. Plans start at **$3.00/month** and include unlimited custom domains and aliases.

3. Verify your email address by clicking the confirmation link sent to your registration email.


## Step 3: Add and Verify Your Domain

1. Log in to your Forward Email dashboard at [forwardemail.net/my-account/domains](https://forwardemail.net/my-account/domains).

2. Click **Add Domain** and enter your custom domain name (e.g., `yourdomain.com`).

3. Follow the on-screen setup guide. Forward Email's onboarding will walk you through every DNS record you need to add, with exact values tailored to your domain.

> \[!TIP]
> Forward Email supports **1-click DNS setup** via [Domain Connect](https://forwardemail.net/en/domain-connect) for major DNS providers including **Cloudflare, GoDaddy, IONOS, WordPress.com, NameSilo**, and others. If your domain is hosted with one of these providers, you can configure all DNS records automatically in a single click — no manual record entry required. Simply enter your domain name and Forward Email will auto-detect your DNS provider.

4. Wait for DNS propagation (typically a few minutes, but can take up to 48 hours) and click **Verify** in your Forward Email dashboard.

> \[!WARNING]
> Do **not** change your MX records yet if you are still using Amazon WorkMail. Keep your Amazon WorkMail MX records in place until you have completed the email export and are ready to switch over. Changing MX records prematurely will cause new incoming emails to be routed to Forward Email before your mailboxes are set up.


## Step 4: Configure DNS Records

Once your domain is verified and you are ready to switch, update your DNS records. Forward Email's domain setup guide in your dashboard at <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> will show you the exact records to add, with copy-to-clipboard buttons for each value.

If your domain uses the 1-click Domain Connect setup, this step is handled automatically. Otherwise, follow the instructions below.

**Remove your old Amazon WorkMail DNS records** (MX, autodiscover CNAME, and any WorkMail-specific SPF/DKIM records) and replace them with the Forward Email records shown in your dashboard.

### MX Records

Remove the existing Amazon WorkMail MX record (e.g., `inbound-smtp.us-east-1.amazonaws.com`) and add:

| Type | Name/Host                 | Priority | Value                  |
| ---- | ------------------------- | -------- | ---------------------- |
| MX   | `@` (or `yourdomain.com`) | 10       | `mx1.forwardemail.net` |
| MX   | `@` (or `yourdomain.com`) | 20       | `mx2.forwardemail.net` |

### SPF Record

Remove the old SPF record that referenced `amazonses.com` and add (or update) the following TXT record:

| Type | Name/Host                 | Value                                           |
| ---- | ------------------------- | ----------------------------------------------- |
| TXT  | `@` (or `yourdomain.com`) | `v=spf1 a mx include:spf.forwardemail.net -all` |

> **Important**: You should only have **one** SPF record per domain. If you have an existing SPF record, merge the `include:spf.forwardemail.net` into it rather than creating a duplicate.

### DKIM and DMARC Records

To set up DKIM and DMARC for your domain, go to <a href="/my-account/domains" class="alert-link" target="_blank" rel="noopener noreferrer">My Account <i class="fa fa-angle-right"></i> Domains</a> <i class="fa fa-angle-right"></i> Settings <i class="fa fa-angle-right"></i> **Outbound SMTP Configuration** and follow the setup instructions displayed there. The dashboard will provide you with the exact DKIM CNAME records and DMARC TXT record values specific to your domain.

You should also remove any old Amazon WorkMail DKIM CNAME records (they typically look like `xxxxxxxx._domainkey.yourdomain.com` pointing to `xxxxxxxx.dkim.amazonses.com`).

For more details, see our [DKIM setup guide](https://forwardemail.net/en/faq#how-do-i-set-up-dkim-for-forward-email) and [DMARC setup guide](https://forwardemail.net/en/faq#how-do-i-set-up-dmarc-for-forward-email).

### Verify DNS Configuration

After adding all DNS records, return to your Forward Email dashboard and click **Verify** next to your domain. The dashboard will confirm when all records are properly configured with green checkmarks.

> **Tip**: You can also use the [MX Toolbox](https://mxtoolbox.com/) or `dig` command to verify your DNS records have propagated:
>
> ```bash
> dig MX yourdomain.com +short
> dig TXT yourdomain.com +short
> ```


## Step 5: Create Email Aliases and Mailboxes

1. In your Forward Email dashboard, navigate to **My Account → Domains → yourdomain.com → Aliases**.

2. For each Amazon WorkMail user, create a corresponding alias. For example:
   * `user@yourdomain.com` → Create as a mailbox alias (for IMAP/SMTP access)
   * `info@yourdomain.com` → Create as a forwarding alias (if you just want forwarding)

3. For each alias that needs IMAP/SMTP access (i.e., a full mailbox), click on the alias and **generate a password**. Save this password — you will need it to configure your email clients and to import your email.

> **Important**: Each user who had an Amazon WorkMail mailbox should have a corresponding alias with a generated password in Forward Email. This password is used for IMAP, SMTP, POP3, CalDAV, and CardDAV authentication.


## Step 6: Import Your Email to Forward Email

Now that your Forward Email account is set up with aliases and passwords, import the email you exported in Step 1. For detailed instructions on importing from various providers and formats, see our [FAQ on importing and migrating your mailbox](https://forwardemail.net/en/faq#how-do-i-import-and-migrate-my-existing-mailbox).

### Import Using Thunderbird (Recommended)

This is the simplest method, especially if you already have Thunderbird open with your Amazon WorkMail account connected from Step 1.

1. **Add your Forward Email account to Thunderbird:**

   * Go to **Account Settings → Account Actions → Add Mail Account**
   * Enter your name, your Forward Email address (e.g., `user@yourdomain.com`), and the password you generated in Step 5
   * Click **Configure manually** and enter:

   | Setting        | Incoming (IMAP)         | Outgoing (SMTP)         |
   | -------------- | ----------------------- | ----------------------- |
   | Server         | `imap.forwardemail.net` | `smtp.forwardemail.net` |
   | Port           | 993                     | 465                     |
   | Encryption     | SSL/TLS                 | SSL/TLS                 |
   | Authentication | Normal password         | Normal password         |
   | Username       | Your full email address | Your full email address |

   * Click **Done**

2. **Transfer your email by drag-and-drop:**

   * In Thunderbird, you should now see both your Amazon WorkMail account and your Forward Email account in the left sidebar
   * Select all messages in a WorkMail folder (e.g., Inbox) by pressing `Ctrl+A` (or `Cmd+A` on macOS)
   * Drag the selected messages to the corresponding folder in your Forward Email account
   * Repeat for each folder (Sent, Drafts, Archive, etc.)

   Thunderbird will upload the messages to Forward Email via IMAP. This may take some time depending on the number and size of messages.

3. **Alternatively, import from MBOX files** (if you exported in Step 1, Option A):
   * Right-click on a folder in your Forward Email account
   * Select **ImportExportTools NG → Import MBOX file**
   * Choose the MBOX file you exported earlier
   * Repeat for each folder

> **Tip**: For large mailboxes, the drag-and-drop method is often more reliable than MBOX import because it handles one message at a time and is less likely to encounter memory issues.

### Import Using imapsync

If you used [imapsync](https://github.com/imapsync/imapsync) in Step 1 (Option C), your email has already been transferred directly from Amazon WorkMail to Forward Email. No additional import step is needed.

If you did not use imapsync earlier but want to use it now, run:

```bash
imapsync \
  --host1 imap.mail.us-east-1.awsapps.com \
  --port1 993 --ssl1 \
  --user1 user@yourdomain.com \
  --password1 'YOUR_WORKMAIL_PASSWORD' \
  --host2 imap.forwardemail.net \
  --port2 993 --ssl2 \
  --user2 user@yourdomain.com \
  --password2 'YOUR_FORWARD_EMAIL_PASSWORD'
```


## Step 7: Configure Your Email Clients

After importing your email, configure your email clients to connect to Forward Email instead of Amazon WorkMail.

### Thunderbird

If you already added your Forward Email account in Step 6, you are done. Simply remove the Amazon WorkMail account from Thunderbird:

1. Go to **Account Settings**
2. Select your Amazon WorkMail account
3. Click **Account Actions → Remove Account**

### Microsoft Outlook

1. Go to **File → Add Account**
2. Enter your Forward Email address and click **Connect**
3. Choose **Advanced options → Let me set up my account manually**
4. Select **IMAP** and enter:

| Setting    | Incoming                | Outgoing                |
| ---------- | ----------------------- | ----------------------- |
| Server     | `imap.forwardemail.net` | `smtp.forwardemail.net` |
| Port       | 993                     | 465                     |
| Encryption | SSL/TLS                 | SSL/TLS                 |
| Username   | Your full email address | Your full email address |
| Password   | Your generated password | Your generated password |

5. Click **Connect**
6. Remove your old Amazon WorkMail account from Outlook

### Apple Mail

1. Go to **Mail → Settings → Accounts → +**
2. Select **Other Mail Account**
3. Enter your name, Forward Email address, and generated password
4. For server settings:
   * Incoming: `imap.forwardemail.net`
   * Outgoing: `smtp.forwardemail.net`
5. Click **Sign In**
6. Remove your old Amazon WorkMail account

### Mobile Devices (iOS and Android)

**iOS:**

1. Go to **Settings → Mail → Accounts → Add Account → Other**
2. Tap **Add Mail Account**
3. Enter your name, Forward Email address, and generated password
4. Enter server settings:
   * Incoming: `imap.forwardemail.net`, port 993, SSL
   * Outgoing: `smtp.forwardemail.net`, port 465, SSL
5. Tap **Save**

**Android:**

1. Go to **Settings → Accounts → Add Account → Personal (IMAP)**
2. Enter your Forward Email address and generated password
3. Enter server settings:
   * Incoming: `imap.forwardemail.net`, port 993, SSL/TLS
   * Outgoing: `smtp.forwardemail.net`, port 465, SSL/TLS
4. Tap **Done**


## Step 8: Verify and Test Your Setup

Before decommissioning Amazon WorkMail, verify that everything is working correctly:

1. **Send a test email** from an external account (e.g., Gmail, Outlook.com) to your custom domain address. Confirm it arrives in your Forward Email mailbox.

2. **Send a test email** from your Forward Email account to an external address. Confirm it is delivered and check that SPF, DKIM, and DMARC pass. You can use [mail-tester.com](https://www.mail-tester.com/) to verify your email authentication.

3. **Check your imported email** — browse through your Inbox, Sent, and other folders to confirm all messages were transferred successfully.

4. **Test calendar and contacts** (if applicable) — see the section below on migrating contacts and calendars.

5. **Verify DNS records** by running:

   ```bash
   dig MX yourdomain.com +short
   # Should show: 10 mx1.forwardemail.net. and 20 mx2.forwardemail.net.

   dig TXT yourdomain.com +short
   # Should include your SPF record with spf.forwardemail.net
   ```

> **Important**: Run your domain through the Forward Email dashboard verification to ensure all records show green checkmarks. If any records show warnings, fix them before proceeding.


## Step 9: Decommission Amazon WorkMail

Once you have confirmed that Forward Email is working correctly and all your email has been migrated:

1. **Keep Amazon WorkMail active for a transition period** (at least 1-2 weeks) to catch any stragglers or services that may still be sending to old endpoints.

2. **Remove the Amazon WorkMail organization** from the AWS console:
   * Go to the [Amazon WorkMail console](https://console.aws.amazon.com/workmail/)
   * Select your organization
   * Follow the steps to delete the organization

3. **Clean up AWS resources:**
   * Remove any WorkMail-related IAM roles and policies
   * Delete the S3 bucket used for mailbox exports (if applicable)
   * Remove any Route 53 records that were specific to WorkMail (e.g., autodiscover CNAME records)

4. **Update any applications or services** that were configured to send email through Amazon WorkMail SMTP. Point them to Forward Email's SMTP server (`smtp.forwardemail.net`, port 465, SSL/TLS) instead.


## Migrating Contacts and Calendars

Amazon WorkMail uses Exchange ActiveSync for contacts and calendars, which makes direct migration more involved. Here is how to handle each:

**Contacts:**

1. Log in to the Amazon WorkMail web client (`https://your-alias.awsapps.com/mail`)
2. Go to **Contacts** and export them as a `.csv` or vCard (`.vcf`) file
3. In Forward Email, contacts are managed via CardDAV. You can import your contacts using any CardDAV-compatible client (such as Thunderbird with the [CardBook add-on](https://github.com/nicovak/nicovak.github.io), Apple Contacts, or GNOME Contacts)
4. Forward Email CardDAV server: `https://caldav.forwardemail.net` (see our [CardDAV setup guide](https://forwardemail.net/en/faq#do-you-support-contacts-carddav) for details)

**Calendars:**

1. Log in to the Amazon WorkMail web client
2. Go to **Calendar** and export your calendar as an `.ics` file
3. Import the `.ics` file into Forward Email's CalDAV-compatible calendar using any CalDAV client (such as Thunderbird, Apple Calendar, or GNOME Calendar)
4. Forward Email CalDAV server: `https://caldav.forwardemail.net` (see our [CalDAV setup guide](https://forwardemail.net/en/faq#do-you-support-calendars-caldav) for details)

> **Note**: The AWS mailbox export API (Option B in Step 1) exports calendar items in MIME format, but it does **not** export contacts or tasks.


## Migrating Multiple Users or an Organization

If you are migrating an entire organization with multiple WorkMail users, follow this process:

1. **Create a spreadsheet** listing all users with their email addresses and current WorkMail passwords.

2. **Add all users as aliases** in Forward Email under your domain. Generate a password for each alias.

3. **Use imapsync in a batch script** to migrate all mailboxes automatically:

   ```bash
   #!/bin/bash
   # migrate-all-users.sh
   # Format: workmail_user:workmail_pass:fe_user:fe_pass

   while IFS=: read -r wm_user wm_pass fe_user fe_pass; do
     echo "Migrating $wm_user..."
     imapsync \
       --host1 imap.mail.us-east-1.awsapps.com \
       --port1 993 --ssl1 \
       --user1 "$wm_user" \
       --password1 "$wm_pass" \
       --host2 imap.forwardemail.net \
       --port2 993 --ssl2 \
       --user2 "$fe_user" \
       --password2 "$fe_pass" \
       --log --logdir ./migration-logs/
     echo "Done: $wm_user"
   done < users.txt
   ```

   Create a `users.txt` file with one user per line:

   ```
   alice@yourdomain.com:wmpass1:alice@yourdomain.com:fepass1
   bob@yourdomain.com:wmpass2:bob@yourdomain.com:fepass2
   ```

4. **Update DNS records once** (as described in Step 4) — this applies to the entire domain.

5. **Distribute new passwords** to each user and provide them with the email client configuration settings from Step 7.


## Troubleshooting Common Migration Issues

**"Authentication failed" when connecting to Amazon WorkMail via IMAP:**

* Double-check your password. Amazon WorkMail does not use app passwords like Gmail — use your regular WorkMail password.
* Ensure you are using the correct IMAP server endpoint for your AWS region.
* Verify that IMAP access has not been disabled for your WorkMail organization.

**Emails are not arriving at Forward Email after changing MX records:**

* DNS changes can take up to 48 hours to propagate. Use `dig MX yourdomain.com` to check if the new records are live.
* Ensure you removed the old Amazon WorkMail MX records. Having both old and new MX records can cause unpredictable routing.
* Check the Forward Email dashboard for any domain verification warnings.

**Some folders or messages are missing after import:**

* IMAP folder names may differ between providers. Check for folders with different names (e.g., "Sent Items" in WorkMail vs. "Sent" in Forward Email).
* Run imapsync with the `--subscribed` flag to include subscribed folders only, or without it to include all folders.
* For very large mailboxes, the transfer may have timed out. Re-run imapsync — it will only transfer messages that were not already copied.

**Email client shows "certificate error" or "connection refused":**

* Ensure you are using the correct port and encryption settings: port 993 with SSL/TLS for IMAP, port 465 with SSL/TLS for SMTP.
* Forward Email also supports port 587 with STARTTLS for SMTP if your client requires it.

**Sent emails are not appearing in the Sent folder:**

* Some email clients need to be configured to save sent messages to the IMAP Sent folder. In Thunderbird, go to **Account Settings → Copies & Folders** and ensure "Place a copy in" is set to the Sent folder on your Forward Email IMAP account.


## Frequently Asked Questions

**Q: Can I migrate from Amazon WorkMail to Forward Email without any downtime?**

Yes. The recommended approach is to set up Forward Email and import your email while keeping Amazon WorkMail active. Only switch the MX records once everything is verified. During DNS propagation, some emails may still arrive at WorkMail — keep both accounts monitored for a few days.

**Q: Will my email addresses stay the same?**

Yes. Forward Email supports custom domains, so your email addresses (e.g., `user@yourdomain.com`) will remain exactly the same. Only the underlying email service changes.

**Q: How long does the migration take?**

For a single user with a moderate mailbox (a few thousand messages), the migration typically takes 1-2 hours. For large mailboxes (100,000+ messages), it may take several hours. The DNS propagation for MX records usually completes within a few hours but can take up to 48 hours.

**Q: What happens to my email if I do not migrate before March 31, 2027?**

After March 31, 2027, you will lose access to all Amazon WorkMail data. Emails stored in WorkMail will become permanently inaccessible. Your domain will stop receiving email if the MX records still point to WorkMail servers that no longer exist.

**Q: Does Forward Email support Exchange ActiveSync?**

Forward Email uses standard open protocols: IMAP, SMTP, POP3, CalDAV, and CardDAV. Exchange ActiveSync is not supported. Most modern email clients support IMAP/SMTP, and most calendar/contact apps support CalDAV/CardDAV.

**Q: Can I use Forward Email with AWS Route 53 for DNS?**

Yes. You can manage your DNS records in Route 53 exactly as described in Step 4. Forward Email works with any DNS provider.

**Q: Is Forward Email open source?**

Yes. Forward Email is [100% open source on GitHub](https://github.com/forwardemail). You can audit the code, self-host it, or contribute to the project. See our [GitHub repository](https://github.com/forwardemail/forwardemail.net) for the full source code.


## Conclusion

Migrating from Amazon WorkMail to Forward Email is a straightforward process that can be completed in an afternoon for individual users, or over a few days for organizations with multiple mailboxes. By following this guide, you ensure that your email, contacts, and calendars are safely transferred, your DNS records are properly configured, and your email clients are set up to work with Forward Email.

Forward Email provides a privacy-focused, open-source, and cost-effective alternative to Amazon WorkMail — with additional features like end-to-end encryption, unlimited aliases, email forwarding, and quantum-safe encrypted storage. Start your migration today at [forwardemail.net/register](https://forwardemail.net/register).

For additional help, visit our [FAQ page](https://forwardemail.net/en/faq) or contact our support team. You can also compare Forward Email with other providers on our [email comparison page](https://forwardemail.net/en/blog/best-amazon-workmail-alternative).
