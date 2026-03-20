# 自托管 {#self-hosted}


## 目录 {#table-of-contents}

* [快速开始](#getting-started)
* [需求](#requirements)
  * [Cloud-init / 用户数据](#cloud-init--user-data)
* [安装](#install)
  * [调试安装脚本](#debug-install-script)
  * [提示](#prompts)
  * [初始设置（选项1）](#initial-setup-option-1)
* [服务](#services)
  * [重要文件路径](#important-file-paths)
* [配置](#configuration)
  * [初始 DNS 设置](#initial-dns-setup)
* [入门](#onboarding)
* [测试](#testing)
  * [创建你的第一个别名](#creating-your-first-alias)
  * [发送 / 接收你的第一封邮件](#sending--receiving-your-first-email)
* [故障排除](#troubleshooting)
  * [基本认证用户名和密码是什么](#what-is-the-basic-auth-username-and-password)
  * [我如何知道正在运行的服务](#how-do-i-know-what-is-running)
  * [我如何知道应该运行的服务是否未运行](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [我如何查找日志](#how-do-i-find-logs)
  * [为什么我的外发邮件超时](#why-are-my-outgoing-emails-timing-out)


## 快速开始 {#getting-started}

我们的自托管邮件解决方案，和我们所有产品一样，100% 开源——包括前端和后端。这意味着：

1. **完全透明**：处理您邮件的每一行代码都可供公众审查
2. **社区贡献**：任何人都可以贡献改进或修复问题
3. **开放带来的安全性**：漏洞可以被全球社区发现并修复
4. **无供应商锁定**：您永远不依赖于我们公司的存在

整个代码库托管在 GitHub，地址为 <https://github.com/forwardemail/forwardemail.net>，采用 MIT 许可证。

架构包括以下容器：

* 用于外发邮件的 SMTP 服务器
* 用于邮件检索的 IMAP/POP3 服务器
* 用于管理的 Web 界面
* 用于配置存储的数据库
* 用于缓存和性能的 Redis
* 用于安全加密邮箱存储的 SQLite

> \[!NOTE]
> 请务必查看我们的 [自托管博客](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> 对于想要更详细分步骤版本的用户，请参阅我们的基于 [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) 或 [Debian](https://forwardemail.net/guides/selfhosted-on-debian) 的指南。


## 需求 {#requirements}

在运行安装脚本之前，请确保您具备以下条件：

* **操作系统**：基于 Linux 的服务器（当前支持 Ubuntu 22.04 及以上版本）。
* **资源**：1 个 vCPU 和 2GB 内存
* **Root 权限**：具备执行命令的管理员权限。
* **域名**：准备好用于 DNS 配置的自定义域名。
* **干净的 IP**：确保您的服务器拥有干净的 IP 地址，无垃圾邮件历史，可通过检查黑名单确认。更多信息见 [这里](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation)。
* 支持端口 25 的公网 IP 地址
* 能够设置 [反向 PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)
* 支持 IPv4 和 IPv6

> \[!TIP]
> 查看我们的 [优秀邮件服务器提供商列表](https://github.com/forwardemail/awesome-mail-server-providers)

### Cloud-init / 用户数据 {#cloud-init--user-data}

大多数云服务商支持在虚拟专用服务器（VPS）配置时使用 cloud-init 配置。这是提前设置一些文件和环境变量的好方法，供脚本的初始设置逻辑使用，从而避免脚本运行时需要额外提示输入信息。

**选项**

* `EMAIL` - 用于 certbot 证书过期提醒的邮箱
* `DOMAIN` - 用于自托管设置的自定义域名（例如 `example.com`）
* `AUTH_BASIC_USERNAME` - 首次设置时用于保护网站的用户名
* `AUTH_BASIC_PASSWORD` - 首次设置时用于保护网站的密码
* `/root/.cloudflare.ini` - （**仅限 Cloudflare 用户**）certbot 用于 DNS 配置的 Cloudflare 配置文件。需要通过 `dns_cloudflare_api_token` 设置您的 API 令牌。详情见 [这里](https://certbot-dns-cloudflare.readthedocs.io/en/stable/)。
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

## 安装 {#install}

在您的服务器上运行以下命令以下载并执行安装脚本：

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 调试安装脚本 {#debug-install-script}

在安装脚本前添加 `DEBUG=true` 以获得详细输出：

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### 提示 {#prompts}

```sh
1. 初始设置
2. 设置备份
3. 设置自动升级
4. 续订证书
5. 从备份恢复
6. 帮助
7. 退出
```

* **初始设置**：下载最新的 forward email 代码，配置环境，提示输入您的自定义域名，并设置所有必要的证书、密钥和秘密。
* **设置备份**：将设置一个 cron 任务，使用兼容 S3 的存储来备份 mongoDB 和 redis，实现安全的远程存储。另有 sqlite 会在登录时备份（如果有更改），以实现安全加密备份。
* **设置升级**：设置一个 cron 任务，查找每晚更新，安全地重建并重启基础设施组件。
* **续订证书**：使用 Certbot / lets encrypt 获取 SSL 证书，证书和密钥每 3 个月过期。此操作将为您的域名续订证书，并将其放置在相关组件可使用的必要文件夹中。详见 [重要文件路径](#important-file-paths)
* **从备份恢复**：将触发 mongodb 和 redis 从备份数据恢复。

### 初始设置（选项 1） {#initial-setup-option-1}

选择选项 `1. 初始设置` 开始。

完成后，您应该会看到成功消息。您甚至可以运行 `docker ps` 查看启动的组件。组件的更多信息见下文。

## 服务 {#services}

| 服务名称    |         默认端口         | 描述                                                   |
| ----------- | :----------------------: | ------------------------------------------------------ |
| Web         |            `443`          | 所有管理交互的 Web 界面                                |
| API         |            `4000`         | 抽象数据库的 API 层                                    |
| Bree        |            无             | 后台作业和任务运行器                                   |
| SMTP        | `465`（推荐）/ `587`      | 用于外发邮件的 SMTP 服务器                             |
| SMTP Bree   |            无             | SMTP 后台作业                                         |
| MX          |            `2525`         | 用于收件邮件和邮件转发的邮件交换服务器                |
| IMAP        |          `993/2993`       | 用于收件邮件和邮箱管理的 IMAP 服务器                   |
| POP3        |          `995/2995`       | 用于收件邮件和邮箱管理的 POP3 服务器                   |
| SQLite      |            `3456`         | 用于与 sqlite 数据库交互的 SQLite 服务器               |
| SQLite Bree |            无             | SQLite 后台作业                                       |
| CalDAV      |            `5000`         | 用于日历管理的 CalDAV 服务器                           |
| CardDAV     |            `6000`         | 用于日历管理的 CardDAV 服务器                          |
| MongoDB     |           `27017`         | 用于大部分数据管理的 MongoDB 数据库                    |
| Redis       |            `6379`         | 用于缓存和状态管理的 Redis                             |
| SQLite      |            无             | 用于加密邮箱的 SQLite 数据库                           |

### 重要文件路径 {#important-file-paths}

注意：下方 *主机路径* 是相对于 `/root/forwardemail.net/self-hosting/` 的。

| 组件                   |       主机路径         | 容器路径                      |
| ---------------------- | :-------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`   | `/backups`                   |
| Redis                  |     `./redis-data`    | `/data`                      |
| Sqlite                 |    `./sqlite-data`    | `/mnt/{SQLITE_STORAGE_PATH}` |
| 环境文件               |        `./.env`       | `/app/.env`                  |
| SSL 证书/密钥          |        `./ssl`        | `/app/ssl/`                  |
| 私钥                   |  `./ssl/privkey.pem`  | `/app/ssl/privkey.pem`       |
| 完整链证书             | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem`     |
| CA 证书                |    `./ssl/cert.pem`   | `/app/ssl/cert.pem`          |
| DKIM 私钥              |    `./ssl/dkim.key`   | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> 请安全保存 `.env` 文件。这对于故障恢复至关重要。
> 你可以在 `/root/forwardemail.net/self-hosting/.env` 找到它。


## 配置 {#configuration}

### 初始 DNS 设置 {#initial-dns-setup}

在你选择的 DNS 提供商处，配置相应的 DNS 记录。请注意，括号内的内容（`<>`）是动态的，需要替换为你的实际值。

| 类型  | 名称               | 内容                         | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", 或空白   | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", 或空白   | mx.<domain_name> (优先级 0)   | auto |
| TXT   | "@", ".", 或空白   | "v=spf1 a -all"               | auto |

#### 反向 DNS / PTR 记录 {#reverse-dns--ptr-record}

反向 DNS（rDNS）或反向指针记录（PTR 记录）对邮件服务器非常重要，因为它们有助于验证发送邮件服务器的合法性。每个云服务提供商的操作方式不同，你需要查找如何添加“反向 DNS”以将主机和 IP 映射到对应的主机名。通常在提供商的网络设置部分。

#### 端口 25 被阻止 {#port-25-blocked}

一些 ISP 和云服务提供商会阻止端口 25 以防止恶意行为。你可能需要提交支持工单以开放端口 25 用于 SMTP / 外发邮件。


## 入门 {#onboarding}

1. 打开登录页面  
   访问 https\://\<domain_name>，将 \<domain_name> 替换为你 DNS 设置中配置的域名。你应该能看到 Forward Email 的登录页面。

2. 登录并添加你的域名

* 使用有效的邮箱和密码登录。
* 输入你想设置的域名（必须与 DNS 配置匹配）。
* 按提示添加所需的 **MX** 和 **TXT** 记录以完成验证。

3. 完成设置

* 验证通过后，进入别名页面创建你的第一个别名。
* 可选地，在 **域设置** 中配置 **SMTP 用于外发邮件**。这需要额外的 DNS 记录。

> \[!NOTE]
> 没有信息会发送到你的服务器之外。自托管选项和初始账户仅用于管理员登录和网页管理域名、别名及相关邮件配置。


## 测试 {#testing}

### 创建你的第一个别名 {#creating-your-first-alias}

1. 进入别名页面  
   打开别名管理页面：

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. 添加新别名

* 点击右上角的 **添加别名**。
* 输入别名名称并根据需要调整邮件设置。
* （可选）勾选启用 **IMAP/POP3/CalDAV/CardDAV** 支持。
* 点击 **创建别名**。

3. 设置密码

* 点击 **生成密码** 创建一个安全密码。
* 该密码用于登录你的邮件客户端。

4. 配置你的邮件客户端

* 使用 Thunderbird 等邮件客户端。
* 输入别名名称和生成的密码。
* 按照要求配置 **IMAP** 和 **SMTP** 设置。

#### 邮件服务器设置 {#email-server-settings}

用户名：`<alias name>`

| 类型 | 主机名             | 端口 | 连接安全性         | 认证方式        |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<domain_name> | 465  | SSL / TLS           | 普通密码        |
| IMAP | imap.<domain_name> | 993  | SSL / TLS           | 普通密码        |

### 发送 / 接收你的第一封邮件 {#sending--receiving-your-first-email}

配置完成后，你应该能够使用新创建的自托管邮箱发送和接收邮件！
## 故障排除 {#troubleshooting}

#### 为什么这在 Ubuntu 和 Debian 之外不起作用 {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

我们目前正在寻求支持 MacOS，并将考虑其他系统。如果您希望支持其他系统，请打开一个[讨论](https://github.com/orgs/forwardemail/discussions)或贡献代码。

#### 为什么 certbot acme 挑战失败 {#why-is-the-certbot-acme-challenge-failing}

最常见的问题是 certbot / letsencrypt 有时会请求 **2** 个挑战。您需要确保添加 **两个** TXT 记录。

示例：
您可能会看到两个挑战，如下所示：
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

也有可能 DNS 传播尚未完成。您可以使用类似 `https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` 的工具。这将帮助您了解 TXT 记录的更改是否已反映出来。也有可能主机上的本地 DNS 缓存仍在使用旧的、过时的值，或者尚未获取到最近的更改。

另一种选择是在初始 VPS 设置时，通过在 cloud-init / user-data 中设置 `/root/.cloudflare.ini` 文件并包含 API 令牌，使用自动化 certbot DNS 更改。或者创建此文件后再次运行脚本。这将自动管理 DNS 更改和挑战更新。

### 基本认证的用户名和密码是什么 {#what-is-the-basic-auth-username-and-password}

对于自托管，我们会添加首次浏览器原生认证弹窗，用户名为简单的 `admin`，密码在初始设置时随机生成。我们这样做是为了防止自动化程序 / 爬虫抢先完成网页体验的首次注册。您可以在初始设置后，在 `.env` 文件中的 `AUTH_BASIC_USERNAME` 和 `AUTH_BASIC_PASSWORD` 找到此密码。

### 如何知道正在运行什么 {#how-do-i-know-what-is-running}

您可以运行 `docker ps` 查看所有正在运行的容器，这些容器是由 `docker-compose-self-hosting.yml` 文件启动的。您也可以运行 `docker ps -a` 查看所有容器（包括未运行的）。

### 如何知道应该运行的服务是否未运行 {#how-do-i-know-if-something-isnt-running-that-should-be}

您可以运行 `docker ps -a` 查看所有容器（包括未运行的）。您可能会看到退出日志或相关提示。

### 如何查找日志 {#how-do-i-find-logs}

您可以通过 `docker logs -f <container_name>` 获取更多日志。如果有容器退出，通常是 `.env` 文件配置错误导致的。

在网页 UI 中，您可以查看 `/admin/emails` 和 `/admin/logs`，分别用于查看外发邮件日志和错误日志。

### 为什么我的外发邮件超时 {#why-are-my-outgoing-emails-timing-out}

如果您看到类似“连接到 MX 服务器时连接超时”的消息，则可能需要检查端口 25 是否被阻塞。ISP 或云服务提供商通常默认阻止此端口，您可能需要联系支持或提交工单以开放该端口。

#### 我应该使用哪些工具来测试邮件配置最佳实践和 IP 声誉 {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

请查看我们的[常见问题解答](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)。
