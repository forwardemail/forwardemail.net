<h1 align="center">
  <a href="https://forwardemail.net"><img src="https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/media/header.png" alt="ForwardEmail" /></a>
</h1>
<div align="center">
  <a href="https://github.com/forwardemail/forwardemail.net/actions/workflows/ci.yml"><img src="https://github.com/forwardemail/forwardemail.net/actions/workflows/ci.yml/badge.svg" alt="build status" /></a>
  <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="code style" /></a>
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg" alt="styled with prettier" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/forwardemail/forwardemail.net.svg" alt="license" /></a>
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
* [Server Infrastructure](#server-infrastructure)
  * [Naming Convention](#naming-convention)
  * [Load Balancing](#load-balancing)
  * [Provisioning](#provisioning)
  * [Deployment](#deployment)
* [Contributors](#contributors)
* [License](#license)


## How do I get started

### For Consumers

Visit <https://forwardemail.net> to get started!

### For Developers

See [Requirements](#requirements) below.


## Requirements

### macOS

1. You should have [brew][] and [node][] installed.  We recommend installing Node.js with [n][] (e.g. `n lts`).

2. Install [brew][] dependencies:

   ```sh
   brew tap mongodb/brew
   brew install mongodb-community redis ansible ansible-lint libtool automake autoconf nasm
   brew services start mongodb-community
   brew services start redis
   ```

3. Install [ansible-galaxy][] requirements (assumes current working directory is the root of this repository):

   ```sh
   ansible-galaxy install -r ansible/requirements.yml
   ```

4. Install [pm2][] which is used for deployment:

   ```sh
   npm i -g pm2
   ```

5. Install [npm][] dependencies:

   ```sh
   npm install
   ```

6. Install [wkhtmltopdf](https://wkhtmltopdf.org/downloads.html#stable).

### Ubuntu

Coming soon

<!-- Download and install wkhtmltopdf from website (manual deb install) -->

<!-- sudo apt-get install xfonts-75dpi -->

<!-- wget wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.bionic_amd64.deb -->

<!-- sudo dpkg -i wkhtmltox_0.12.6-1.bionic_amd64.deb -->


## Server Infrastructure

### Naming Convention

Our server alias naming convention consists of the following fields, joined together by a hyphen, and converted to lower case:

1. App name
2. (Optional) App count (starting with 1) of the application (relative to the same provider and region).  Only applicable for apps with potential count > 1.
3. Provider name (abbreviated to 2 characters)
4. Region name (this is the region name given by the provider)
5. Region country (ISO-3166 alpha-2 code)
6. Project fully-qualified domain name ([FQDN][] - this is the main project domain name; e.g. `forwardemail.net` or `api.forwardemail.net`)

For example, one of our web servers is named `web-1-do-nyc3-us.forwardemail.net`, and one of our API servers is named `api-1-do-nyc3-us.api.forwardemail.net`.

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

1. Set up host configuration by copying the `hosts.yml` file template:

   ```sh
   cp ansible/playbooks/templates/hosts.yml hosts.yml
   ```

2. Edit this configuration and update the file with your newly created server aliases and IP addresses.  You can add more than one host to each group if you are setting up load balancing.  Refer to the [Naming Convention](#naming-convention) documentation for our recommended approach to server alias naming.  Note that this file is automatically ignored by git.  If you have a private repository and would like to commit this, then remove `hosts.yml` from the root `.gitignore` file.

   ```sh
   vim hosts.yml
   ```

3. Set up environment configuration by copying the `env` file template:

   ```sh
   cp ansible/playbooks/templates/env .env.production
   ```

4. Edit this configuration and reference the official [Lad][] documentation for a list of all available environment variables (or see [.env.defaults](.env.defaults)).  **You will need to open this file in your preferred editor** and set the values for any fields containing `TODO`, whereby you replace `TODO` with the appropriate value.  Preserve double quotes where they are already defined.

   ```sh
   vim .env.production
   ```

5. Generate [pm2][] [ecosystem files][ecosystem-files] using our automatic template generator. We created an [ansible-playbook.js](ansible-playbook.js) which loads the `.env.production` environment variables rendered with [@ladjs/env][] into `process.env`, which then gets used in the playbooks.  This is a superior, simple, and the only known dotenv approach we know of in Ansible. Newly created `ecosystem-api.json`, `ecosystem-bree.json`, `ecosystem-web.json` files will now be created for you in the root of the repository.  If you ever more add or change IP addresses, you can simply re-run this command.

   ```sh
   node ansible-playbook ansible/playbooks/ecosystem.yml -l 'localhost'
   ```

6. Set up the web and API server(s) (see [patterns and ansible-playbook flags docs](https://docs.ansible.com/ansible/latest/user_guide/intro_patterns.html#patterns-and-ansible-playbook-flags) if you need help).  If you completely (or partially) run this playbook (or any others below), then the second time you try to run it may not succeed.  This is because we prevent root user access through security hardening.  To workaround this, run the same command but without `-e 'ansible_user=root'` appended as it will default to the `devops` user created.

   ```sh
   node ansible-playbook ansible/playbooks/http.yml -e 'ansible_user=root' -l 'http'
   ```

7. Set up the Bree server(s):

   ```sh
   node ansible-playbook ansible/playbooks/bree.yml -e 'ansible_user=root' -l 'bree'
   ```

8. Set up the Redis server:

   ```sh
   node ansible-playbook ansible/playbooks/redis.yml -e 'ansible_user=root' -l 'redis'
   ```

9. Set up the Mongo server:

   ```sh
   node ansible-playbook ansible/playbooks/mongo.yml -e 'ansible_user=root' -l 'mongo'
   ```

10. Set up GitHub deployment keys for all the servers. Note that the `deployment-keys` directory is ignored from git, so if you have a private repository and wish to commit it, then remove `deployment-keys` from the `.gitignore` file.

    ```sh
    node ansible-playbook ansible/playbooks/deployment-keys.yml -l 'http:bree'
    ```

11. Go to your repository "Settings" page on GitHub, click on "Deploy keys", and then add a deployment key for each servers' deployment key copied to the `deployment-keys` directory.  If you're on macOS, you can use the `pbcopy` command to copy each file's contents to your clipboard.  Use tab completion for speed, and replace the server names and paths with yours:

    ```sh
    cat deployment-keys/api-1-li-dal.forwardemail.net.pub | pbcopy

    #
    # NOTE: repeat the above command for all servers
    # and after running the command, it will copy
    # the key to your clipboard for you to paste as
    # a new deploy key (make sure to use read-only access)
    #
    ```

12. Set up PM2 deployment directories on all the servers:

    ```sh
    pm2 deploy ecosystem-web.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-api.json production setup
    ```

    ```sh
    pm2 deploy ecosystem-bree.json production setup
    ```

13. Create a SSL certificate at [Namecheap][] (we recommend a 5 year wildcard certificate), set up the certificate, and download and extract the ZIP file with the certificate (emailed to you) to your computer. We do not recommend using tools like [LetsEncrypt][] and `certbot` due to complexity when you have (or scale to) a cluster of servers set up behind load balancers.  In other words, we've tried approaches like `lsyncd` in combination with `crontab` for `certbot` renewals and automatic checking.  Furthermore, using this exposes the server(s) to downtime as ports `80` and `443` may need to be shut down so that `certbot` can use them for certificate generation.  This is not a reliable approach, and simply renewing certificates once a year is vastly simpler and also makes using load balancers trivial.  Instead you can use a provider like [Namecheap][] to get a cheap SSL certificate, then run a few commands as we've documented below. This command will prompt you for an absolute file path to the certificates you downloaded. Renewed your certificate after 1 year? Simply follow this step again.  Do not set a password on the certificate files.  When using the `openssl` command (see Namecheap instructions), you need to use `*.example.com` with an asterisk followed by a period if you are registering a wildcard certificate.

    ```sh
    ansible-playbook ansible/playbooks/certificates.yml
    ```

    > **Important:** If you renew or change certificates in the future, then after running the previous command, you will subsequently need to reload the processes as such:

    ```sh
    #
    # NOTE: See the "Important" note above BEFORE running this command.
    #       This command ONLY APPLIES for certificate renewals/changes.
    #
    pm2 deploy ecosystem-web.json production exec "pm2 reload web"
    pm2 deploy ecosystem-api.json production exec "pm2 reload api"
    ```

14. (Optional) Create a Google application credentials profile file and store it locally.  You only need this if you want to support automatic translation.  The following command will prompt you for the absolute file path (e.g. `/path/to/client-profile.json`).  See the [mandarin][] docs for more information.

    ```sh
    ansible-playbook ansible/playbooks/gapp-creds.yml -l 'http:bree'
    ```

15. Copy the `.env.production` file and create an AWS config file on the servers:

    ```sh
    node ansible-playbook ansible/playbooks/env.yml -l 'http:bree'
    ```

16. Run an initial deploy to all the servers:

    ```sh
    pm2 deploy ecosystem-web.json production
    ```

    ```sh
    pm2 deploy ecosystem-api.json production
    ```

    ```sh
    pm2 deploy ecosystem-bree.json production
    ```

17. Save the process list on the servers so when if the server were to reboot, it will automatically boot back up the processes:

    ```sh
    pm2 deploy ecosystem-web.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-api.json production exec "pm2 save"
    ```

    ```sh
    pm2 deploy ecosystem-bree.json production exec "pm2 save"
    ```

18. Test by visiting your web and API server in your browser (click "proceed to unsafe" site and bypass certificate warning).

19. Configure your DNS records for the web and API server hostnames and respective IP addresses.

20. Test by visiting your web and API server in your browser (in an incognito window).  There should not be any certificate warnings (similar to the one that occurred in step 15).

21. (Optional) Remove the local `.env.production` file for security purposes.  If you do this, then make sure you have a backup, or securely back up off the server in the future before destroying the server.

    ```sh
    rm .env.production
    ```

22. (Optional) Remove the local certificate files you downloaded locally and specified in step 11.  If you do this, then make sure you have a backup, or securely back up off the server in the future before destroying the server.

23. Finished. If you need to deploy again, then push your changes to GitHub `master` branch and then follow step 14 again.  We recommend you to read the [Ansible getting started guide][ansible-guide], as it provides you with insight into commands like `ansible all -a "echo hello"` which can be run across all or specific servers.


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[Business Source License 1.1](https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE) © [Niftylettuce, LLC.](https://niftylettuce.com/)


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

[npm]: https//www.npmjs.com

[letsencrypt]: https://letsencrypt.org/

[fqdn]: https://en.wikipedia.org/wiki/Fully_qualified_domain_name

[ansible-guide]: https://docs.ansible.com/ansible/latest/user_guide/intro_getting_started.html

[mandarin]: https://github.com/ladjs/mandarin
