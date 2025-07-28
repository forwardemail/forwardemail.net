# Listmonk 带有转发电子邮件功能，可实现安全的新闻通讯传递 {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## 目录 {#table-of-contents}

* [概述](#overview)
* [为什么使用 Listmonk 和转发电子邮件](#why-listmonk-and-forward-email)
* [先决条件](#prerequisites)
* [安装](#installation)
  * [1.更新您的服务器](#1-update-your-server)
  * [2.安装依赖项](#2-install-dependencies)
  * [3.下载Listmonk配置](#3-download-listmonk-configuration)
  * [4.配置防火墙（UFW）](#4-configure-firewall-ufw)
  * [5.配置HTTPS访问](#5-configure-https-access)
  * [6. 启动 Listmonk](#6-start-listmonk)
  * [7. 在 Listmonk 中配置转发电子邮件 SMTP](#7-configure-forward-email-smtp-in-listmonk)
  * [8. 配置退回处理](#8-configure-bounce-processing)
* [测试](#testing)
  * [创建邮件列表](#create-a-mailing-list)
  * [添加订阅者](#add-subscribers)
  * [创建并发送营销活动](#create-and-send-a-campaign)
* [确认](#verification)
* [开发者笔记](#developer-notes)
* [结论](#conclusion)

## 概览 {#overview}

本指南为开发者提供分步说明，指导他们如何设置功能强大的开源新闻通讯和邮件列表管理器 [Listmonk](https://listmonk.app/)，并使用 [转发电子邮件](https://forwardemail.net/) 作为其 SMTP 提供商。此组合可让您有效地管理营销活动，同时确保电子邮件的安全、私密和可靠投递。

* **Listmonk**：处理订阅者管理、列表组织、活动创建和绩效跟踪。
* **转发电子邮件**：充当安全的 SMTP 服务器，使用内置安全功能（如 SPF、DKIM、DMARC 和 TLS 加密）处理电子邮件的实际发送。

通过整合这两者，您可以完全控制您的数据和基础设施，同时利用 Forward Email 强大的交付系统。

## 为什么使用 Listmonk 并转发电子邮件 {#why-listmonk-and-forward-email}

* **开源**：Listmonk 和 Forward Email 背后的原则都强调透明度和控制力。您可以自行托管 Listmonk，拥有自己的数据。
* **注重隐私**：Forward Email 以隐私为核心，最大限度地减少数据保留，并专注于安全传输。
* **经济高效**：Listmonk 完全免费，Forward Email 提供丰富的免费套餐和价格实惠的付费方案，使其成为一款经济实惠的解决方案。
* **可扩展性**：Listmonk 性能卓越，Forward Email 的基础架构专为大规模可靠交付而设计。
* **开发者友好**：Listmonk 提供强大的 API，Forward Email 提供便捷的 SMTP 集成和 Webhook。

## 先决条件 {#prerequisites}

开始之前，请确保您已准备好以下内容：

* 一台运行最新 Linux 发行版（推荐 Ubuntu 20.04+）的虚拟专用服务器 (VPS)，至少配备 1 个 CPU 和 1GB 内存（推荐 2GB）。
* 需要提供商？请查看 [推荐VPS列表](https://github.com/forwardemail/awesome-mail-server-providers)。
* 一个您控制的域名（需要 DNS 访问权限）。
* 一个拥有 [转发电子邮件](https://forwardemail.net/) 权限的有效账户。
* 拥有您 VPS 的 Root 权限或 `sudo` 权限。
* 熟悉 Linux 命令行操作。

## 安装 {#installation}

这些步骤指导您在 VPS 上使用 Docker 和 Docker Compose 安装 Listmonk。

### 1. 更新您的服务器 {#1-update-your-server}

确保系统的软件包列表和已安装的软件包都是最新的。

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 安装依赖项 {#2-install-dependencies}

安装 Docker、Docker Compose 和 UFW（简单防火墙）。

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. 下载 Listmonk 配置 {#3-download-listmonk-configuration}

为 Listmonk 创建一个目录并下载官方的 `docker-compose.yml` 文件。

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

该文件定义了 Listmonk 应用程序容器及其所需的 PostgreSQL 数据库容器。

### 4. 配置防火墙（UFW）{#4-configure-firewall-ufw}

允许必要的流量（SSH、HTTP、HTTPS）通过防火墙。如果您的 SSH 在非标准端口上运行，请进行相应调整。

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

出现提示时确认启用防火墙。

### 5. 配置 HTTPS 访问 {#5-configure-https-access}

通过 HTTPS 运行 Listmonk 对安全性至关重要。您有两个主要选项：

#### 选项 A：使用 Cloudflare 代理（为简单起见推荐）{#option-a-using-cloudflare-proxy-recommended-for-simplicity}

如果您的域名的 DNS 由 Cloudflare 管理，您可以利用其代理功能轻松实现 HTTPS。

1. **指向 DNS**：在 Cloudflare 中为您的 Listmonk 子域名（例如 `listmonk.yourdomain.com`）创建一条指向您 VPS IP 地址的 `A` 记录。确保 **代理状态** 设置为 **已代理**（橙色云）。
2. **修改 Docker Compose**：编辑您下载的 `docker-compose.yml` 文件：
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
这将使 Listmonk 可在端口 80 上内部访问，然后 Cloudflare 可以使用代理并使用 HTTPS 进行安全保护。

#### 选项 B：使用反向代理（Nginx、Caddy 等）{#option-b-using-a-reverse-proxy-nginx-caddy-etc}

或者，您可以在 VPS 上设置像 Nginx 或 Caddy 这样的反向代理来处理对 Listmonk 的 HTTPS 终止和代理请求（默认在端口 9000 上运行）。

* 保留 `docker-compose.yml` 中的默认 `ports: - "127.0.0.1:9000:9000"`，以确保 Listmonk 只能在本地访问。
* 配置您选择的反向代理，使其监听端口 80 和 443，处理 SSL 证书获取（例如，通过 Let's Encrypt 获取），并将流量转发至 `http://127.0.0.1:9000`。
* 详细的反向代理设置超出了本指南的范围，但网上有很多教程可供参考。

### 6. 启动 Listmonk {#6-start-listmonk}

导航回您的 `listmonk` 目录（如果您还没有到达那里）并以分离模式启动容器。

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Docker 将下载必要的镜像并启动 Listmonk 应用程序和数据库容器。首次启动可能需要一两分钟。

✅ **访问 Listmonk**：您现在应该能够通过您配置的域访问 Listmonk 网络界面（例如，`https://listmonk.yourdomain.com`）。

### 7. 在 Listmonk 中配置转发电子邮件 SMTP {#7-configure-forward-email-smtp-in-listmonk}

接下来，配置 Listmonk 使用您的转发电子邮件帐户发送电子邮件。

1. **在“转发邮件”中启用 SMTP**：确保您已在“转发邮件”账户信息中心中生成 SMTP 凭据。如果您尚未执行此操作，请按照 [转发电子邮件指南，通过 SMTP 发送带有自定义域的电子邮件](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp) 操作。
2. **配置 Listmonk**：登录您的 Listmonk 管理面板。
* 前往 **设置 -> SMTP**。

* Listmonk 内置了“转发邮件”功能。请从提供商列表中选择“转发邮件”，或手动输入以下详细信息：

| 环境 | 价值 |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **主持人** | `smtp.forwardemail.net` |
| **港口** | `465` |
| **授权协议** | `LOGIN` |
| **用户名** | 您的转发电子邮件**SMTP 用户名** |
| **密码** | 您的转发电子邮件**SMTP 密码** |
| **TLS** | `SSL/TLS` |
| **来自电子邮件** | 您想要的 `From` 地址（例如 `newsletter@yourdomain.com`）。请确保在“转发电子邮件”中配置了此域名。 |

* **重要提示**：请务必使用端口 `465` 和 `SSL/TLS` 来建立转发邮件的安全连接。请勿使用 STARTTLS（端口 587）。

* 点击**保存**。
3. **发送测试邮件**：使用 SMTP 设置页面中的“发送测试邮件”按钮。输入您可以访问的收件人地址，然后点击**发送**。验证邮件是否到达收件人的收件箱。

### 8. 配置退回处理 {#8-configure-bounce-processing}

退回处理功能允许 Listmonk 自动处理无法投递的邮件（例如，由于地址无效）。“转发邮件”提供了一个 Webhook，用于通知 Listmonk 邮件退回的情况。

#### 转发电子邮件设置 {#forward-email-setup}

1. 登录您的 [转发电子邮件仪表板](https://forwardemail.net/)。
2. 导航至 **域名**，选择您用于发送邮件的域名，然后进入其 **设置** 页面。
3. 向下滚动到 **反弹 Webhook URL** 部分。
4. 输入以下 URL，将 `<your_listmonk_domain>` 替换为您的 Listmonk 实例可访问的实际域名或子域名：
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*示例*：`https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. 进一步向下滚动到 **Webhook 签名负载验证密钥** 部分。
6. **复制**生成的验证密钥。您在 Listmonk 中需要用到它。
7. 保存转发邮件域名设置中的更改。

#### Listmonk 设置 {#listmonk-setup}

1. 在您的 Listmonk 管理面板中，导航至“设置”->“退回”。
2. 启用“启用退回处理”。
3. 启用“启用退回 webhook”。
4. 向下滚动到“Webhook 提供程序”部分。
5. 启用“转发电子邮件”。
6. 将您从“转发电子邮件”仪表板复制的“Webhook 签名负载验证密钥”粘贴到“转发电子邮件密钥”字段中。
7. 点击页面底部的“保存”。
8. 退回处理现已配置完毕！当“转发电子邮件”检测到 Listmonk 发送的电子邮件被退回时，它将通过 webhook 通知您的 Listmonk 实例，Listmonk 会相应地标记订阅者。
9. 完成 [测试](#testing) 中的以下步骤，以确保一切正常。

## 测试 {#testing}

以下是 Listmonk 核心功能的简要概述：

### 创建邮件列表 {#create-a-mailing-list}

* 前往侧边栏的**列表**。
* 点击**新建列表**。
* 填写详细信息（名称、类型：公开/私密、描述、标签）并**保存**。

### 添加订阅者 {#add-subscribers}

* 导航至“订阅者”部分。
* 您可以添加订阅者：
* **手动**：点击“新建订阅者”。
* **导入**：点击“导入订阅者”上传 CSV 文件。
* **API**：使用 Listmonk API 进行编程添加。
* 在创建或导入期间将订阅者分配到一个或多个列表。
* **最佳实践**：使用双重确认流程。请在“设置”->“确认加入和订阅”下进行配置。

### 创建并发送活动 {#create-and-send-a-campaign}

* 前往 **营销活动** -> **新建营销活动**。
* 填写营销活动详情（名称、主题、发件人邮箱、收件人列表）。
* 选择内容类型（富文本/HTML、纯文本、原始 HTML）。
* 撰写电子邮件内容。您可以使用模板变量，例如 `{{ .Subscriber.Email }}` 或 `{{ .Subscriber.FirstName }}`。
* **请务必先发送测试邮件！** 使用“发送测试”选项在收件箱中预览邮件。
* 满意后，点击 **开始营销活动** 立即发送或安排稍后发送。

## 验证 {#verification}

* **SMTP 投递**：定期通过 Listmonk 的 SMTP 设置页面发送测试邮件，并测试邮件发送情况，以确保邮件正确投递。
* **退回处理**：向已知无效的电子邮件地址发送测试邮件（例如，如果您手边没有真实的电子邮件地址，请发送 `bounce-test@yourdomain.com`，但结果可能会有所不同）。过一会儿，在 Listmonk 中查看邮件发送情况统计信息，看看是否出现退回邮件。
* **邮件标头**：使用 [邮件测试器](https://www.mail-tester.com/) 等工具或手动检查邮件标头，验证 SPF、DKIM 和 DMARC 是否通过，这表示“转发邮件”设置正确。
* **转发邮件日志**：如果您怀疑投递问题源自 SMTP 服务器，请检查“转发邮件”仪表板日志。

## 开发者笔记 {#developer-notes}

* **模板**：Listmonk 使用 Go 的模板引擎。探索其文档，了解高级个性化功能：`{{ .Subscriber.Attribs.your_custom_field }}`。
* **API**：Listmonk 提供全面的 REST API，用于管理列表、订阅者、活动、模板等。API 文档链接位于 Listmonk 实例的页脚中。
* **自定义字段**：在“设置”->“订阅者字段”下定义自定义订阅者字段，以存储其他数据。
* **Webhook**：除了退回邮件，Listmonk 还可以为其他事件（例如订阅）发送 Webhook，从而实现与其他系统集成。

## 结论 {#conclusion}

通过将 Listmonk 的自托管功能与 Forward Email 的安全、尊重隐私的交付功能相结合，您可以创建一个强大且符合道德规范的电子邮件营销平台。您可以完全掌控您的受众数据，同时享受高送达率和自动化安全功能。

此设置提供了一种可扩展、经济高效且开发人员友好的专有电子邮件服务替代方案，完全符合开源软件和用户隐私的精神。

发送愉快！🚀