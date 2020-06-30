# ForwardEmail.net

[![build status](https://img.shields.io/travis/com/forwardemail/forwardemail.net.svg)](https://travis-ci.com/forwardemail/forwardemail.net)
[![code coverage](https://img.shields.io/codecov/c/github/forwardemail/forwardemail.net.svg)](https://codecov.io/gh/forwardemail/forwardemail.net)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lad](https://img.shields.io/badge/made_with-lad-95CC28.svg)](https://lad.js.org)


## Table of Contents

* [How do I get started](#how-do-i-get-started)
  * [For Consumers](#for-consumers)
  * [For Developers](#for-developers)
* [Requirements](#requirements)
  * [macOS](#macos)
  * [Ubuntu](#ubuntu)
* [Infrastructure](#infrastructure)
  * [Server Naming Conventions](#server-naming-conventions)
  * [Servers](#servers)
* [Contributors](#contributors)
* [License](#license)


## How do I get started

### For Consumers

Visit <https://forwardemail.net> to get started!

### For Developers

See [Requirements](#requirements) below.


## Requirements

### macOS

You should have [brew][] and [node][] installed.  We recommend installing Node.js with [nvm][] (e.g. `nvm install --lts`).

Install brew dependencies:

```sh
brew update
brew upgrade
brew tap mongodb/brew
brew install mongodb-community@3.4 redis python3
brew services start mongodb-community@3.4
brew services start redis
pip3 install dkimpy pyspf dnspython
```

### Ubuntu

Coming soon


## Infrastructure

### Server Naming Conventions

Our naming convention consists of the following fields, separated by a hyphen and lowercased:

1. Project name (this is the project name, abbreviated to two characters).  In our case it is `fe` which stands for Forward Email.
2. Application name
3. Application count (starting with 1) of the application (relative to the same provider and region).  This is optional, as it only applies for applications that can grow to have a count greater than 1.
4. Provider name (abbreviated to two characters)
5. Region name (this is the region name given by the provider, abbreviated to three characters max for region name, and appended with a count for multiple datacenters in the same region).

### Servers

All server aliases with the same hostname (with a minimum count of at least 2) are set in Cloudflare under a geo-located load balancer.

Unless otherwise noted, all of the servers listed below have dedicated CPU's (not a shared CPU environment).

#### Playbooks

See the [playbooks](playbooks/) folder for our [Ansible][] playbooks.  We recommend you to install [yamllint][] and configure it in your editor.  You should also install [ansible-lint][] if you make changes to the playbook (e.g. `brew install ansible-lint`).

You simply need to install the requirements to get started:

```sh
ansible-galaxy install -r playbooks/requirements.yml
```

And then you can install the playbook to your newly provisioned server:

```sh
ansible-playbook playbooks/web.yml -l 1.2.3.4 -u root
```

Be sure to replace `web` if necessary (with either `api`, `bull`, `redis`, or `mongo`), and replace `1.2.3.4` with its IP address.

This assumes you have a `root` user with your SSH key added to the server already.

#### Legend

| Abbreviation | Meaning         |
| ------------ | --------------- |
| `do`         | Digital Ocean   |
| `nyc3`       | New York City 3 |
| `li`         | Linode          |
| `fra`        | Frankfurt       |

#### Current Servers

| Alias                        | Hostname               | IP   | CPU/RAM/SSD | Cost            |
| ---------------------------- | ---------------------- | ---- | ----------- | --------------- |
| `fe-api-1-do-nyc3`           | `api.forwardemail.net` | TODO | 2/4GB/25GB  | $40/mo          |
| `fe-api-1-li-fra`            | `api.forwardemail.net` | TODO | 2/4GB/80GB  | $30/mo          |
| `fe-bull-1-do-nyc3`          |                        | TODO | 2/4GB/25GB  | $40/mo          |
| `fe-bull-1-li-fra`           |                        | TODO | 2/4GB/80GB  | $30/mo          |
| `fe-web-1-do-nyc3`           | `forwardemail.net`     | TODO | 2/4GB/25GB  | $40/mo          |
| `fe-web-1-li-fra`            | `forwardemail.net`     | TODO | 2/4GB/80GB  | $30/mo          |
| `fe-redis-master-1-do-nyc3`  |                        | TODO | 2/4GB/25GB  | $40/mo + backup |
| `fe-mongo-primary-1-do-nyc3` |                        | TODO | 2/4GB/25GB  | $40/mo + backup |
| `fe-mx1-1-do-nyc3`           | `mx1.forwardemail.net` | TODO | 2/4GB/25GB  | $40/mo          |
| `fe-mx1-1-li-fra`            | `mx1.forwardemail.net` | TODO | 2/4GB/80GB  | $30/mo          |
| `fe-mx2-1-do-nyc3`           | `mx2.forwardemail.net` | TODO | 2/4GB/25GB  | $40/mo          |
| `fe-mx2-1-li-fra`            | `mx2.forwardemail.net` | TODO | 2/4GB/80GB  | $30/mo          |
|                              |                        |      | **Total**   | $420            |

#### Future Servers

| Alias                         | Hostname | IP   | CPU/RAM/SSD | Cost            |
| ----------------------------- | -------- | ---- | ----------- | --------------- |
| `fe-redis-slave-1-li-fra`     |          | TODO | 2/4GB/80GB  | $30/mo + backup |
| `fe-mongo-secondary-1-li-fra` |          | TODO | 2/4GB/80GB  | $30/mo + backup |
|                               |          |      | **Total**   | $60             |

#### Legacy Servers

These legacy servers will soon be deprecated and removed, and also do not follow our [Server Naming Conventions](#server-naming-conventions).

| Alias                              | Hostname               | IP Address        | CPU/RAM/SSD          | Cost   |
| ---------------------------------- | ---------------------- | ----------------- | -------------------- | ------ |
| `forwardemail-net-deploy`          | `forwardemail.net`     | `64.225.47.157`   | 4/8GB/160GB (Shared) | $40/mo |
| `us-sf-1-mx1-forwardemail-net`     | `mx1.forwardemail.net` | `138.197.213.185` | 2/2GB/60GB (Shared)  | $15/mo |
| `uk-london-1-mx1-forwardemail-net` | `mx1.forwardemail.net` | `178.62.29.206`   | 2/2GB/60GB (Shared)  | $15/mo |
| `us-nyc-1-mx2-forwardemail-net`    | `mx2.forwardemail.net` | `104.248.224.170` | 2/2GB/60GB (Shared)  | $15/mo |
|                                    |                        |                   | **Total**            | $85    |


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[Business Source License 1.1](https://github.com/forwardemail/forwardemail.net/blob/master/LICENSE) © [Niftylettuce, LLC.](https://niftylettuce.com/)


## 

[ansible]: https://github.com/ansible/ansible

[yamllint]: https://github.com/adrienverge/yamllint

[brew]: https://brew.sh/

[node]: https://nodejs.org/

[nvm]: https://github.com/nvm-sh/nvm

[ansible-lint]: https://github.com/ansible/ansible-lint
