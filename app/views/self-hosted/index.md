# Self Hosted


## Table of Contents

* [Getting started](#getting-started)
* [Requirements](#requirements)
  * [Cloud-init / User-data](#cloud-init--user-data)
* [Install](#install)
  * [Debug install script](#debug-install-script)
  * [Prompts](#prompts)
  * [Initial Setup (Option 1)](#initial-setup-option-1)
* [Services](#services)
  * [Important file paths](#important-file-paths)
* [Configuration](#configuration)
  * [Initial DNS setup](#initial-dns-setup)
* [Onboarding](#onboarding)
* [Testing](#testing)
  * [Creating your first alias](#creating-your-first-alias)
  * [Sending / Receiving your first email](#sending--receiving-your-first-email)
* [Troubleshooting](#troubleshooting)
  * [What is the basic auth username and password](#what-is-the-basic-auth-username-and-password)
  * [How do I know what is running](#how-do-i-know-what-is-running)
  * [How do I know if something isn't running that should be](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [How do I find logs](#how-do-i-find-logs)
  * [Why are my outgoing emails timing out](#why-are-my-outgoing-emails-timing-out)


## Getting started

Our self-hosted email solution, like all our products, is 100% open-source—both frontend and backend. This means:

1. **Complete Transparency**: Every line of code that processes your emails is available for public scrutiny
2. **Community Contributions**: Anyone can contribute improvements or fix issues
3. **Security Through Openness**: Vulnerabilities can be identified and fixed by a global community
4. **No Vendor Lock-in**: You're never dependent on our company's existence

The entire codebase is available on GitHub at <https://github.com/forwardemail/forwardemail.net>, licensed under the MIT License.

The architecture includes containers for:

* SMTP server for outbound email
* IMAP/POP3 servers for email retrieval
* Web interface for administration
* Database for configuration storage
* Redis for caching and performance
* SQLite for secure, encrypted mailbox storage

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.


## Requirements

Before running the installation script, ensure you have the following:

* **Operating System**: A Linux-based server (currently supporting Ubuntu 22.04+).
* **Resources**: 1 vCPUs and 2GB RAM
* **Root Access**: Administrative privileges to execute commands.
* **Domain Name**: A custom domain ready for DNS configuration.
* **Clean IP**: Ensure your server has a clean IP address with no prior spam reputation by checking blacklists. More info [here](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation).
* Public IP address with port 25 support
* Ability to set [reverse PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* IPv4 and IPv6 support

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / User-data

Most cloud vendors support a cloud-init configuration for when the virtual private server (VPS) is provisioned. This is great way to set some files and environment variables ahead of time for use by the scripts initial setup logic which will bypass the need to prompt while the script is running for additional information.

**Options**

* `EMAIL` - email used for certbot expiration reminders
* `DOMAIN` - custom domain (e.g. `example.com`) used for self hosting setup
* `AUTH_BASIC_USERNAME` - username used in first time setup to protect the site
* `AUTH_BASIC_PASSWORD` - passward used in first time setup to protect the site
* `/root/.cloudflare.ini` - (**Cloudflare users only**) cloudflare configuration file used by certbot for DNS configuration. It requires you set your API token via `dns_cloudflare_api_token`. Read more [here](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

Example:

```sh
#cloud-config
write_files:
  - path: /root/.cloudflare.ini
    content: |
      dns_cloudflare_api_token = "xxx"
    owner: root:root
    permissions: '0600'
  - path: /etc/profile.d/env.sh
    content: |
      export EMAIL="test@myemail.com"
      export DOMAIN="mydomain.com"

runcmd:
  - chmod +x /etc/profile.d/env.sh
```


## Install

Run the following command in your server to download and execute the installation script:

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Debug install script

Add `DEBUG=true` in front of the install script for verbose output:

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### Prompts

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **Initial setup**: Download the latest forward email code, configure the environment, prompt for your custom domain and setup all necessary certificates, keys and secrets.
* **Setup Backup**: Will setup a cron to backup mongoDB and redis using an S3-compatible store for secure, remote storage. Separately, sqlite will be backed up on login if there are changes for secure, encrypted backups.
* **Setup Upgrade**: Setup a cron to look for nightly updates which will safely rebuild and restart infrastructure components.
* **Renew certificates**: Certbot / lets encrypt is used for SSL certificates and keys will expire every 3 months. This will renew the certificates for your domain and place them in the necessary folder for related components to consume. See [important file paths](#important-file-paths)
* **Restore from backup**: Will trigger mongodb and redis to restore from backup data.

### Initial Setup (Option 1)

Choose option `1. Initial setup` to begin.

Once complete, you should see a success message. You can even run `docker ps` to see **the** components spun up. More information on componets below.


## Services

| Service Name | Default Port | Description                                            |
| ------------ | :----------: | ------------------------------------------------------ |
| Web          |     `443`    | Web interface for all admin interactions               |
| API          |    `4000`    | Api layer to abstract databases                        |
| Bree         |     None     | Background job and task runner                         |
| SMTP         |   `465/587`  | SMTP server for outboound email                        |
| SMTP Bree    |     None     | SMTP background job                                    |
| MX           |    `2525`    | Mail exchange for inbound email and email forwarding   |
| IMAP         |  `993/2993`  | IMAP server for inbound email and mailbox management   |
| POP3         |  `995/2995`  | POP3 server for inbound email and mailbox management   |
| SQLite       |    `3456`    | SQLite server for interactions with sqlite database(s) |
| SQLite Bree  |     None     | SQLite background job                                  |
| CalDAV       |    `5000`    | CalDAV server for calendar management                  |
| CardDAV      |    `6000`    | CardDAV server for calendar management                 |
| MongoDB      |    `27017`   | MongoDB database for most data management              |
| Redis        |    `6379`    | Redis for caching and state management                 |
| SQLite       |     None     | SQLite database(s) for encrypted mailboxes             |

### Important file paths

Note: *Host path* below is relative to `/root/forwardemail.net/self-hosting/`.

| Component              |       Host path       | Container path               |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env file               |        `./.env`       | `/app/.env`                  |
| SSL certs/keys         |        `./ssl`        | `/app/ssl/`                  |
| Private key            |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| Full chain certificate | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA certificate         |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM private key       |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.


## Configuration

### Initial DNS setup

In your DNS provider of choice, configure the appropriate DNS records. Do note anything in brackets (`<>`) is dynamic and needs to be updated with your value.

| Type  | Name               | Content                       | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", or blank | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", or blank | mx.<domain_name> (priority 0) | auto |
| TXT   | "@", ".", or blank | "v=spf1 a -all"               | auto |

#### Reverse DNS / PTR record

Reverse DNS (rDNS) or reverse pointer records (PTR records) are essential for email servers because they help verify the legitimacy of the server sending the email. Each cloud provider does this differently, so you will need to lookup how to add "Reverse DNS" to map the host and IP to it's corresponding hostname. Most likely in the networking section of the provider.

#### Port 25 Blocked

Some ISPs and cloud providers block 25 to avoid bad actors. You may need to file a support ticket to open up port 25 for SMTP / outgoing email.


## Onboarding

1. Open the Landing Page
   Navigate to https\://\<domain\_name>, replacing \<domain\_name> with the domain configured in your DNS settings. You should see the Forward Email landing page.

2. Log In and Onboard Your Domain

* Sign in with a valid email and password.
* Enter the domain name you wish to set up (this must match the DNS configuration).
* Follow the prompts to add the required **MX** and **TXT** records for verification.

3. Complete Setup

* Once verified, access the Aliases page to create your first alias.
* Optionally, configure **SMTP for outbound email** in the **Domain Settings**. This requires additional DNS records.

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.


## Testing

### Creating your first alias

1. Navigate to the Aliases Page
   Open the alias management page:

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. Add a New Alias

* Click **Add Alias** (top right).
* Enter the alias name and adjust email settings as needed.
* (Optional) Enable **IMAP/POP3/CalDAV/CardDAV** support by selecting the checkbox.
* Click **Create Alias.**

3. Set a Password

* Click **Generate Password** to create a secure password.
* This password will be required to log in to your email client.

4. Configure Your Email Client

* Use an email client like Betterbird.
* Enter the alias name and generated password.
* Configure the **IMAP** and **SMTP** settings accordingly.

#### Email server settings

Username: `<alias name>`

| Type | Hostname           | Port | Connection Security | Authentication  |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS           | Normal Password |
| IMAP | imap.<domain_name> | 993  | SSL / TLS           | Normal Password |

### Sending / Receiving your first email

Once configured, you should be able to send and receive email to your newly created and self hosted email address!


## Troubleshooting

#### Why doesn't this work outside of Ubuntu and Debian

We're currently looking to support MacOS and will look to others. Please open a [discussion](https://github.com/orgs/forwardemail/discussions) or contribute if you would like to see others supported.

#### Why is the certbot acme challenge failing

Most common pitfall is that certbot / letsencrypt will sometimes request **2** challenges. You need to be sure to add **BOTH** txt records.

Example:
You might see two challenges like this:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

It is also possible that DNS propagation has not completed. You can use tools like: `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`. This will give you an idea if your TXT record changes should be reflected. It's also possible that local DNS cache on your host is still using an old, stale value or hasn't picked up the recent changes.

Another option is to use the automated cerbot DNS changes by setting the `/root/.cloudflare.ini` file with the api token in your cloud-init / user-data on initial VPS setup or create this file and run the script again. This will manage the DNS changes and challenge updates automatically.

### What is the basic auth username and password

For self hosting, we add a first time browser native authentication pop up with a simple username (`admin`) and password (randomly generated on initial setup). We just add this as a protection in case automation / scrapers somehow beat you to first sign up on the web experience. You can find this password after initial setup in your `.env` file under `AUTH_BASIC_USERNAME` and `AUTH_BASIC_PASSWORD`.

### How do I know what is running

You can run `docker ps` to see all the running containers which is being spun up from the `docker-compose-self-hosting.yml` file. You can also run `docker ps -a` to see everything (including containers that aren't running).

### How do I know if something isn't running that should be

You can run `docker ps -a` to see everything (including containers that aren't running). You may see an exit log or note.

### How do I find logs

You can get more logs via `docker logs -f <container_name>`. If anything exited, it's likely related to the `.env` file being configured incorrectly.

Within the web UI, you can view `/admin/emails` and `/admin/logs` for outbound email logs and error logs respectively.

### Why are my outgoing emails timing out

If you see a message like Connection timed out when connecting to MX server... then you may need to check if port 25 is blocked. It is common for ISPs or cloud providers to block this by default where you may need to reach out to support / file a ticket to get this opened up.

#### What tools should I use to test email configuration best practices and IP reputation

Take a look at our [FAQ here](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation).
