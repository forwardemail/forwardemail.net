<h1 align="center">
  <a href="https://forwardemail.net"><img src="https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/media/header.png" alt="ForwardEmail" /></a>
</h1>
<div align="center">
  <a href="https://github.com/forwardemail/forwardemail.net/actions/workflows/ci.yml"><img src="https://github.com/forwardemail/forwardemail.net/actions/workflows/ci.yml/badge.svg" alt="build status" /></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="code style" /></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="styled with prettier" /></a>
  <a href="https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE.md"><img src="https://img.shields.io/badge/license-BUSL_1.1_AND_MPL_2.0-blue" alt="license" /></a>
</div>
<br />

<div align="center">Forward Email is the 100% open-source and privacy-focused email service @ <a href="https://forwardemail.net">https://forwardemail.net</a>.</div>

<hr />


## Table of Contents

* [How do I get started](#how-do-i-get-started)
  * [For Consumers](#for-consumers)
  * [For Developers](#for-developers)
* [Requirements](#requirements)
  * [macOS](#macos)
  * [Ubuntu](#ubuntu)
* [Local Development Guide](#local-development-guide)
* [Server Infrastructure](#server-infrastructure)
  * [Naming Convention](#naming-convention)
  * [Load Balancing](#load-balancing)
  * [Provisioning](#provisioning)
  * [Deployment](#deployment)
* [License](#license)


## How do I get started

### For Consumers

Visit <https://forwardemail.net> to get started!

### For Developers

See [Requirements](#requirements) and [Local Development Guide](#local-development-guide) below.


## Requirements

### macOS

1. Install [n][] and Node v18.16.0:

   ```sh
   curl -L https://raw.githubusercontent.com/mklement0/n-install/stable/bin/n-install | bash -s -- -y 18.16.0
   ```

2. Ensure that you are running on Node v18.6.0:

   ```sh
   node --version
   v18.16.0
   ```

3. Install [brew][] and the following dependencies using `brew` command:

   ```sh
   brew tap mongodb/brew
   brew install mongodb-community redis libtool automake autoconf nasm
   brew services start mongodb-community
   brew services start redis
   ```

4. Install [pnpm][]:

   ```sh
   npm i -g pnpm
   ```

5. [Fork the repository from GitHub](https://github.com/forwardemail/forwardemail.net/fork)

6. Clone your fork locally (replace `forwardemail` with your username\`):

   ```sh
   git@github.com:forwardemail/forwardemail.net.git
   cd forwardemail.net
   ```

7. Install [npm][] dependencies:

   ```sh
   pnpm install
   ```

8. Install [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html#stable) (**optional:** only used for generating PDF receipts)

### Ubuntu

1. Install [n][] and Node v18.16.0:

   ```sh
   curl -L https://raw.githubusercontent.com/mklement0/n-install/stable/bin/n-install | bash -s -- -y 18.16.0
   ```

2. Ensure that you are running on Node v18.6.0:

   ```sh
   node --version
   v18.16.0
   ```

3. Install [pnpm][]:

   ```sh
   npm i -g pnpm
   ```

4. [Fork the repository from GitHub](https://github.com/forwardemail/forwardemail.net/fork)

5. Clone your fork locally (replace `forwardemail` with your username\`):

   ```sh
   git@github.com:forwardemail/forwardemail.net.git
   cd forwardemail.net
   ```

6. Install [npm][] dependencies:

   ```sh
   pnpm install
   ```

7. Install fonts:

   ```sh
   echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | sudo debconf-set-selections
   ```

   ```sh
   sudo apt-get install xfonts-75dpi fontconfig libxrender1 xfonts-base ttf-mscorefonts-installer libfontconfig
   ```

8. Install [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html#stable) (**optional:** only used for generating PDF receipts):

   ```sh
   wget "https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.$(lsb_release -c -s)_$(dpkg --print-architecture).deb"
   sudo dpkg -i "wkhtmltox_0.12.6.1-2.$(lsb_release -c -s)_$(dpkg --print-architecture).deb"
   ```

9. Install MongoDB by following the guide at <https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/#install-mongodb-community-edition>

10. Install Redis by following the guide at <https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04>.


## Local Development Guide

Once you have followed [Requirements](#requirements), you should now have all the dependencies, repository, and npm packages installed.

You can start any of the services using our pre-built commands to make it easy.  Note that all of these pre-built commands are using [nps](https://github.com/sezna/nps) and [ttab](https://github.com/mklement0/ttab) (it will automatically open a new tab in terminal for you!).

| Service Name | Command          | Default Development Port | Development Preview URL |
| ------------ | ---------------- | :----------------------: | ----------------------- |
| Web          | `npm start web`  |          `3000`          | <http://localhost:3000> |
| API          | `npm start api`  |          `4000`          | <http://localhost:4000> |
| Bree         | `npm start bree` |           None           | None                    |
| SMTP         | `npm start smtp` |          `2432`          | `telnet localhost 2432` |
| IMAP         | `npm start imap` |          `2113`          | `telnet localhost 2113` |
| POP3         | `npm start pop3` |          `2115`          | `telnet localhost 2115` |

You can test the local SMTP, IMAP, and POP3 servers using [Thunderbird](), `telnet`, or `openssl`.  Note that all local development servers do not require TLS and are running with `{ rejectUnauthorized: true }` option passed to TLS server configurations.

Try running the local web server:

```sh
npm start webAndWatch
```

It should open a new tab for you with the local web server running and terminal output using [signale](https://github.com/klaudiosinani/signale).  You can now open your browser to <http://localhost:3000> for a development playground.

**You can also run all apps at once:**

```sh
npm start all
```

Note that if you open your browser to <http://localhost:3000> and no assets are rendering, then you must have forgotten to run a build beforehand.  You can run builds manually by running `npm run build`.

An easy way to kill all existing Node apps running is by typing `killall node`.


## Server Infrastructure

### Naming Convention

Our server alias naming convention consists of the following fields, joined together by a hyphen, and converted to lower case:

1. App name (e.g. "web", "api", "bree", "smtp", "imap", "pop3", or "sqlite")
2. (Optional) App count (starting with 1) of the application (relative to the same provider and region).  Only applicable for apps with potential count > 1.
3. Provider name (abbreviated to 2 characters, e.g. "do" for "Digital Ocean", but you can optionally use more verbose for providers such as "Vultr" as "vultr")
4. Region name (this is the region name given by the provider, e.g. "sfo3" for DO's SFO3 region)

For example, one of our web servers is named `web-do-sfo3` and another is `web-vultr-dallas`.

### Load Balancing

All server aliases with the same hostname (with a minimum count of at least 2) are set in Cloudflare under a geo-located load balancer.

Unless otherwise noted, all of the servers should have dedicated CPU's and not be running in a shared CPU environment.

### Provisioning

See the [ansible](ansible/) folder for our [Ansible][] configuration and playbooks, which we use to provision servers with.

We recommend you to install [yamllint][] and configure it in your editor while working with [Ansible][] playbooks.

Also note that [ansible-lint][] is a helpful linting tool you can use if you plan on making changes to playbooks.  Note that our current playbooks have several existing lint errors.

First you must provision Ubuntu 18.04 LTS 64-bit server(s) using [Digital Ocean][digital-ocean], [Linode][], [Vultr][], or your host of choice.  These newly provisioned server(s) should have your SSH key automatically added.

Follow the [Deployment](#deployment) guide below for automatic provisioning and deployment instructions.

### Deployment

1. Ensure that you have [pm2][] installed locally:

   ```sh
   npm i -g pm2
   ```

2. Ensure that you have [ansible](https://docs.ansible.com/ansible/latest/installation_guide/installation_distros.html) and [ansible-lint](https://ansible.readthedocs.io/projects/lint/installing/) installed locally:

   > For macOS:

   ```sh
   brew install ansible ansible-lint
   ```

   > For Ubuntu:

   ```sh
   sudo apt-add-repository ppa:ansible/ansible
   sudo apt update
   sudo apt install ansible
   pip3 install ansible-lint
   ```

3. Install [ansible-galaxy][] requirements (assumes current working directory is the root of this repository):

   ```sh
   ansible-galaxy install -r ansible/requirements.yml
   ```

4. Set up host configuration by copying the `hosts.yml` file template:

   ```sh
   cp ansible/playbooks/templates/hosts.yml hosts.yml
   ```

5. Edit this configuration and update the file with your newly created server aliases and IP addresses.  You can add more than one host to each group if you are setting up load balancing.  Refer to the [Naming Convention](#naming-convention) documentation for our recommended approach to server alias naming.  Note that this file is automatically ignored by git.  If you have a private repository and would like to commit this, then remove `hosts.yml` from the root `.gitignore` file.

   ```sh
   vim hosts.yml
   ```

6. Set up environment configuration by copying the `env` file template:

   ```sh
   cp ansible/playbooks/templates/env .env.production
   ```

7. Edit this configuration and reference the official [Lad][] documentation for a list of all available environment variables (or see [.env.defaults](.env.defaults)).  **You will need to open this file in your preferred editor** and set the values for any fields containing `TODO`, whereby you replace `TODO` with the appropriate value.  Preserve double quotes where they are already defined.

   ```sh
   vim .env.production
   ```

8. Generate [pm2][] [ecosystem files][ecosystem-files] using our automatic template generator. We created an [ansible-playbook.js](ansible-playbook.js) which loads the `.env.production` environment variables rendered with [@ladjs/env][] into `process.env`, which then gets used in the playbooks.  This is a superior, simple, and the only known dotenv approach we know of in Ansible. Newly created `ecosystem-api.json`, `ecosystem-bree.json`, `ecosystem-web.json`, `ecosystem-smtp.json`, `ecosystem-imap.json`, `ecosystem-pop3.json`, and `ecosystem-sqlite.json` files will now be created for you in the root of the repository.  If you ever more add or change IP addresses, you can simply re-run this command.

   ```sh
   node ansible-playbook ansible/playbooks/ecosystem.yml -l 'localhost'
   ```

9. Set up the web and API server(s) (see [patterns and ansible-playbook flags docs](https://docs.ansible.com/ansible/latest/user_guide/intro_patterns.html#patterns-and-ansible-playbook-flags) if you need help).  If you completely (or partially) run this playbook (or any others below), then the second time you try to run it may not succeed.  This is because we prevent root user access through security hardening.  To workaround this, run the same command but without `--user root` appended as it will default to the `devops` user created.

   ```sh
   node ansible-playbook ansible/playbooks/http.yml --user root -l 'http'
   ```

10. Set up the Bree server(s):

    ```sh
    node ansible-playbook ansible/playbooks/bree.yml --user root -l 'bree'
    ```

11. Set up the SMTP server(s):

    ```sh
    node ansible-playbook ansible/playbooks/smtp.yml --user root -l 'smtp'
    ```

12. Set up the IMAP server(s):

    ```sh
    node ansible-playbook ansible/playbooks/imap.yml --user root -l 'imap'
    ```

13. Set up the POP3 server(s):

    ```sh
    node ansible-playbook ansible/playbooks/pop3.yml --user root -l 'pop3'
    ```

14. Set up the SQLite server(s):

    ```sh
    node ansible-playbook ansible/playbooks/sqlite.yml --user root -l 'sqlite'
    ```

15. Set up GitHub deployment keys for all the servers. Note that the `deployment-keys` directory is ignored from git, so if you have a private repository and wish to commit it, then remove `deployment-keys` from the `.gitignore` file.

    ```sh
    node ansible-playbook ansible/playbooks/deployment-keys.yml -l 'imap:pop3:smtp:http:bree:sqlite' --user deploy
    ```

16. Go to your repository "Settings" page on GitHub, click on "Deploy keys", and then add a deployment key for each servers' deployment key copied to the `deployment-keys` directory.  If you're on macOS, you can use the `pbcopy` command to copy each file's contents to your clipboard.  Use tab completion for speed, and replace the server names and paths with yours.  You can also use the `gh` CLI at <https://cli.github.com/manual/gh_repo_deploy-key_add> as shown below (switch the repo/org/repo paths and deployment key paths below to yours):

    ```sh
    gh repo deploy-key add deployment-keys/api-vu-sj-ca.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/api-do-am-nl.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/web-vu-sj-ca.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/web-do-am-nl.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/bree-vu-sj-ca.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/smtp-vu-sj-ca.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/smtp-do-am-nl.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/imap-vu-sj-ca.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/imap-do-am-nl.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/pop3-vu-sj-ca.pub -R forwardemail/forwardemail.net
    gh repo deploy-key add deployment-keys/sqlite-do-sf-ca.pub -R forwardemail/forwardemail.net
    ```

17. Set up PM2 deployment directories on all the servers:

    ```sh
    pm2 deploy ecosystem-web.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-api.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-bree.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-smtp.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-imap.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-pop3.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-sqlite.json production setup
    ```

18. Create a SSL certificate at [Namecheap][] (we recommend a 5 year wildcard certificate), set up the certificate, and download and extract the ZIP file with the certificate (emailed to you) to your computer. We do not recommend using tools like [LetsEncrypt][] and `certbot` due to complexity when you have (or scale to) a cluster of servers set up behind load balancers.  In other words, we've tried approaches like `lsyncd` in combination with `crontab` for `certbot` renewals and automatic checking.  Furthermore, using this exposes the server(s) to downtime as ports `80` and `443` may need to be shut down so that `certbot` can use them for certificate generation.  This is not a reliable approach, and simply renewing certificates once a year is vastly simpler and also makes using load balancers trivial.  Instead you can use a provider like [Namecheap][] to get a cheap SSL certificate, then run a few commands as we've documented below. This command will prompt you for an absolute file path to the certificates you downloaded. Renewed your certificate after 1 year? Simply follow this step again.  Do not set a password on the certificate files.  When using the `openssl` command (see Namecheap instructions), you need to use `*.example.com` with an asterisk followed by a period if you are registering a wildcard certificate.

    ```sh
    node ansible-playbook ansible/playbooks/certificates.yml --user deploy
    ```

    > **Important:** If you renew or change certificates in the future, then after running the previous command, you will subsequently need to reload the processes as such:

    ```sh
    #
    # NOTE: See the "Important" note above BEFORE running this command.
    #       This command ONLY APPLIES for certificate renewals/changes.
    #
    pm2 deploy ecosystem-web.json production exec "pm2 reload all"
    pm2 deploy ecosystem-api.json production exec "pm2 reload all"
    pm2 deploy ecosystem-smtp.json production exec "pm2 reload all"
    pm2 deploy ecosystem-imap.json production exec "pm2 reload all"
    pm2 deploy ecosystem-pop3.json production exec "pm2 reload all"
    pm2 deploy ecosystem-sqlite.json production exec "pm2 reload all"
    ```

19. (Optional) Create a Google application credentials profile file and store it locally.  You only need this if you want to support automatic translation.  The following command will prompt you for the absolute file path (e.g. `/path/to/client-profile.json`).  See the [mandarin][] docs for more information.

    ```sh
    node ansible-playbook ansible/playbooks/gapp-creds.yml -l 'imap:pop3:smtp:http:bree:sqlite' --user deploy
    ```

20. Copy the `.env.production` to the servers:

    ```sh
    node ansible-playbook ansible/playbooks/env.yml -l 'imap:pop3:smtp:http:bree:sqlite' --user deploy
    ```

21. Run an initial deploy to all the servers:

    ```sh
    pm2 deploy ecosystem-web.json production
    ```

    ```sh
    pm2 deploy ecosystem-api.json production
    ```

    ```sh
    pm2 deploy ecosystem-bree.json production
    ```

    ```sh
    pm2 deploy ecosystem-smtp.json production
    ```

    ```sh
    pm2 deploy ecosystem-imap.json production
    ```

    ```sh
    pm2 deploy ecosystem-pop3.json production
    ```

    ```sh
    pm2 deploy ecosystem-sqlite.json production
    ```

22. Save the process list on the servers so when if the server were to reboot, it will automatically boot back up the processes:

    ```sh
    pm2 deploy ecosystem-web.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-api.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-bree.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-smtp.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-imap.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-pop3.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-sqlite.json production exec "pm2 save"
    ```

23. Test by visiting your web and API server in your browser (click "proceed to unsafe" site and bypass certificate warning).

24. Configure your DNS records for the web and API server hostnames and respective IP addresses.

25. Test by visiting your web and API server in your browser (in an incognito window).  There should not be any certificate warnings (similar to the one that occurred in step 15).

26. (Optional) Remove the local `.env.production` file for security purposes.  If you do this, then make sure you have a backup, or securely back up off the server in the future before destroying the server.

    ```sh
    rm .env.production
    ```

27. (Optional) Remove the local certificate files you downloaded locally and specified in step 11.  If you do this, then make sure you have a backup, or securely back up off the server in the future before destroying the server.

28. Finished. If you need to deploy again, then push your changes to GitHub `master` branch and then follow step 14 again.  We recommend you to read the [Ansible getting started guide][ansible-guide], as it provides you with insight into commands like `ansible all -a "echo hello"` which can be run across all or specific servers.


## License

[(BUSL-1.1 AND MPL-2.0)](LICENSE.md) © [Forward Email LLC](https://forwardemail.net)


##

<a href="#"><img src="https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/media/footer.png" alt="#" /></a>

[ansible]: https://github.com/ansible/ansible

[yamllint]: https://github.com/adrienverge/yamllint

[brew]: https://brew.sh/

[node]: https://nodejs.org/

[n]: https://github.com/tj/n

[ansible-lint]: https://github.com/ansible/ansible-lint

[digital-ocean]: https://m.do.co/c/2ffb8129b8d6

[linode]: https://www.linode.com/?r=a2840b36770c7020730251a5643428ddbf2e284e

[vultr]: https://www.vultr.com/?ref=7429848

[ansible-galaxy]: https://galaxy.ansible.com/

[pm2]: https://github.com/Unitech/pm2

[ecosystem-files]: https://pm2.keymetrics.io/docs/usage/application-declaration/

[@ladjs/env]: https://github.com/ladjs/env

[lad]: https://lad.js.org

[namecheap]: https://namecheap.com

[npm]: https://www.npmjs.com

[letsencrypt]: https://letsencrypt.org/

[ansible-guide]: https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html

[mandarin]: https://github.com/ladjs/mandarin

[pnpm]: https://github.com/pnpm/pnpm
