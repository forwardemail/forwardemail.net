# 使用 Forward Email 的 Listmonk 实现安全的新闻通讯发送 {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## 目录 {#table-of-contents}

* [概述](#overview)
* [为什么选择 Listmonk 和 Forward Email](#why-listmonk-and-forward-email)
* [先决条件](#prerequisites)
* [安装](#installation)
  * [1. 更新服务器](#1-update-your-server)
  * [2. 安装依赖](#2-install-dependencies)
  * [3. 下载 Listmonk 配置](#3-download-listmonk-configuration)
  * [4. 配置防火墙 (UFW)](#4-configure-firewall-ufw)
  * [5. 配置 HTTPS 访问](#5-configure-https-access)
  * [6. 启动 Listmonk](#6-start-listmonk)
  * [7. 在 Listmonk 中配置 Forward Email SMTP](#7-configure-forward-email-smtp-in-listmonk)
  * [8. 配置退信处理](#8-configure-bounce-processing)
* [测试](#testing)
  * [创建邮件列表](#create-a-mailing-list)
  * [添加订阅者](#add-subscribers)
  * [创建并发送活动](#create-and-send-a-campaign)
* [验证](#verification)
* [开发者笔记](#developer-notes)
* [总结](#conclusion)


## 概述 {#overview}

本指南为开发者提供了使用 [Listmonk](https://listmonk.app/)（一个强大的开源新闻通讯和邮件列表管理器）结合 [Forward Email](https://forwardemail.net/) 作为 SMTP 提供商的逐步设置说明。此组合让您能够有效管理活动，同时确保邮件发送的安全、私密和可靠。

* **Listmonk**：负责订阅者管理、列表组织、活动创建和性能跟踪。
* **Forward Email**：作为安全的 SMTP 服务器，处理邮件的实际发送，内置 SPF、DKIM、DMARC 和 TLS 加密等安全功能。

通过整合这两者，您可以完全控制自己的数据和基础设施，同时利用 Forward Email 强大的投递系统。


## 为什么选择 Listmonk 和 Forward Email {#why-listmonk-and-forward-email}

* **开源**：Listmonk 和 Forward Email 背后的理念都强调透明和控制。您自行托管 Listmonk，拥有自己的数据。
* **注重隐私**：Forward Email 以隐私为核心，最小化数据保留，专注于安全传输。
* **成本效益**：Listmonk 免费，Forward Email 提供慷慨的免费额度和实惠的付费计划，是经济实惠的解决方案。
* **可扩展性**：Listmonk 性能优异，Forward Email 的基础设施设计用于大规模可靠投递。
* **开发者友好**：Listmonk 提供强大的 API，Forward Email 提供简洁的 SMTP 集成和 Webhook 支持。


## 先决条件 {#prerequisites}

开始之前，请确保您具备以下条件：

* 一台运行较新 Linux 发行版（推荐 Ubuntu 20.04+）的虚拟专用服务器（VPS），至少 1 个 CPU 和 1GB 内存（推荐 2GB）。
  * 需要提供商？查看 [推荐 VPS 列表](https://github.com/forwardemail/awesome-mail-server-providers)。
* 您控制的域名（需要 DNS 访问权限）。
* 一个有效的 [Forward Email](https://forwardemail.net/) 账户。
* VPS 的 root 或 `sudo` 权限。
* 基本的 Linux 命令行操作知识。


## 安装 {#installation}

以下步骤指导您在 VPS 上使用 Docker 和 Docker Compose 安装 Listmonk。

### 1. 更新服务器 {#1-update-your-server}

确保系统的软件包列表和已安装的软件包是最新的。

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 安装依赖 {#2-install-dependencies}

安装 Docker、Docker Compose 和 UFW（简单防火墙）。

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. 下载 Listmonk 配置 {#3-download-listmonk-configuration}

创建 Listmonk 目录并下载官方的 `docker-compose.yml` 文件。

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

该文件定义了 Listmonk 应用容器及其所需的 PostgreSQL 数据库容器。
### 4. 配置防火墙 (UFW) {#4-configure-firewall-ufw}

允许必要的流量（SSH、HTTP、HTTPS）通过防火墙。如果你的 SSH 使用非标准端口，请相应调整。

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

在提示时确认启用防火墙。

### 5. 配置 HTTPS 访问 {#5-configure-https-access}

通过 HTTPS 运行 Listmonk 对安全性至关重要。你有两个主要选项：

#### 选项 A：使用 Cloudflare 代理（推荐，简单易用） {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

如果你的域名 DNS 由 Cloudflare 管理，可以利用他们的代理功能轻松实现 HTTPS。

1. **指向 DNS**：在 Cloudflare 中为你的 Listmonk 子域（例如 `listmonk.yourdomain.com`）创建一个 `A` 记录，指向你的 VPS IP 地址。确保 **代理状态** 设置为 **已代理**（橙色云朵）。
2. **修改 Docker Compose**：编辑你下载的 `docker-compose.yml` 文件：
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   这样 Listmonk 在内部将通过端口 80 访问，Cloudflare 可以代理该端口并通过 HTTPS 保护。

#### 选项 B：使用反向代理（Nginx、Caddy 等） {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

或者，你可以在 VPS 上设置反向代理（如 Nginx 或 Caddy）来处理 HTTPS 终止，并将请求代理到默认运行在端口 9000 的 Listmonk。

* 保持 `docker-compose.yml` 中默认的 `ports: - "127.0.0.1:9000:9000"`，确保 Listmonk 仅在本地可访问。
* 配置你选择的反向代理监听端口 80 和 443，处理 SSL 证书获取（例如通过 Let's Encrypt），并将流量转发到 `http://127.0.0.1:9000`。
* 详细的反向代理设置超出本指南范围，但网上有许多教程可供参考。

### 6. 启动 Listmonk {#6-start-listmonk}

返回你的 `listmonk` 目录（如果你还不在该目录），并以后台模式启动容器。

```bash
cd ~/listmonk # 或你保存 docker-compose.yml 的目录
docker compose up -d
```

Docker 会下载所需镜像并启动 Listmonk 应用和数据库容器。首次启动可能需要一两分钟。

✅ **访问 Listmonk**：现在你应该可以通过配置的域名访问 Listmonk 网页界面（例如 `https://listmonk.yourdomain.com`）。

### 7. 在 Listmonk 中配置 Forward Email SMTP {#7-configure-forward-email-smtp-in-listmonk}

接下来，配置 Listmonk 使用你的 Forward Email 账户发送邮件。

1. **启用 Forward Email SMTP**：确保你已在 Forward Email 账户仪表盘生成 SMTP 凭据。如果还没有，请参阅 [Forward Email 使用自定义域通过 SMTP 发送邮件指南](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)。
2. **配置 Listmonk**：登录你的 Listmonk 管理面板。
   * 进入 **设置 -> SMTP**。

   * Listmonk 内置支持 Forward Email。你可以从提供商列表中选择 **ForwardEmail**，或者手动输入以下信息：

     | 设置             | 值                                                                                                                  |
     | :--------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **主机**         | `smtp.forwardemail.net`                                                                                             |
     | **端口**         | `465`                                                                                                               |
     | **认证协议**     | `LOGIN`                                                                                                             |
     | **用户名**       | 你的 Forward Email **SMTP 用户名**                                                                                  |
     | **密码**         | 你的 Forward Email **SMTP 密码**                                                                                     |
     | **TLS**          | `SSL/TLS`                                                                                                           |
     | **发件邮箱**     | 你想使用的 `From` 地址（例如 `newsletter@yourdomain.com`）。确保该域名已在 Forward Email 中配置。                      |
* **重要**：始终使用端口 `465` 和 `SSL/TLS` 以确保与 Forward Email 的安全连接（推荐）。端口 `587` 和 STARTTLS 也受支持，但优先使用 SSL/TLS。

   * 点击 **保存**。
3. **发送测试邮件**：在 SMTP 设置页面使用“发送测试邮件”按钮。输入一个您可以访问的收件人地址，点击 **发送**。确认邮件已到达收件人的收件箱。

### 8. 配置退信处理 {#8-configure-bounce-processing}

退信处理允许 Listmonk 自动处理无法投递的邮件（例如，因地址无效）。Forward Email 提供了一个 webhook 来通知 Listmonk 有关退信的信息。

#### Forward Email 设置 {#forward-email-setup}

1. 登录您的 [Forward Email 控制面板](https://forwardemail.net/)。
2. 进入 **Domains**，选择您用于发送的域名，进入其 **Settings** 页面。
3. 向下滚动到 **Bounce Webhook URL** 部分。
4. 输入以下 URL，将 `<your_listmonk_domain>` 替换为您的 Listmonk 实例可访问的实际域名或子域名：
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *示例*：`https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. 继续向下滚动到 **Webhook Signature Payload Verification Key** 部分。
6. **复制**生成的验证密钥。您将在 Listmonk 中使用它。
7. 保存 Forward Email 域名设置中的更改。

#### Listmonk 设置 {#listmonk-setup}

1. 在您的 Listmonk 管理面板中，导航到 **Settings -> Bounces**。
2. 启用 **启用退信处理**。
3. 启用 **启用退信 webhook**。
4. 向下滚动到 **Webhook Providers** 部分。
5. 启用 **Forward Email**。
6. 将您从 Forward Email 控制面板复制的 **Webhook Signature Payload Verification Key** 粘贴到 **Forward Email Key** 字段。
7. 点击页面底部的 **保存**。
8. 退信处理现已配置完成！当 Forward Email 检测到 Listmonk 发送的邮件退信时，会通过 webhook 通知您的 Listmonk 实例，Listmonk 会相应地标记订阅者。
9. 按照下面的 [测试](#testing) 步骤完成，确保一切正常。

## 测试 {#testing}

以下是 Listmonk 核心功能的快速概览：

### 创建邮件列表 {#create-a-mailing-list}

* 进入侧边栏的 **Lists**。
* 点击 **新建列表**。
* 填写详细信息（名称、类型：公开/私密、描述、标签），然后 **保存**。

### 添加订阅者 {#add-subscribers}

* 导航到 **Subscribers** 部分。
* 您可以添加订阅者：
  * **手动**：点击 **新建订阅者**。
  * **导入**：点击 **导入订阅者** 上传 CSV 文件。
  * **API**：使用 Listmonk API 进行程序化添加。
* 在创建或导入时，将订阅者分配到一个或多个列表。
* **最佳实践**：使用双重确认流程。可在 **Settings -> Opt-in & Subscriptions** 中配置。

### 创建并发送活动 {#create-and-send-a-campaign}

* 进入 **Campaigns** -> **新建活动**。
* 填写活动详情（名称、主题、发件邮箱、发送列表）。
* 选择内容类型（富文本/HTML、纯文本、原始 HTML）。
* 撰写邮件内容。您可以使用模板变量，如 `{{ .Subscriber.Email }}` 或 `{{ .Subscriber.FirstName }}`。
* **务必先发送测试邮件！** 使用“发送测试”选项在收件箱预览邮件。
* 满意后，点击 **开始活动** 立即发送或安排稍后发送。

## 验证 {#verification}

* **SMTP 发送**：定期通过 Listmonk 的 SMTP 设置页面和测试活动发送测试邮件，确保邮件正确投递。
* **退信处理**：向一个已知无效的邮箱地址发送测试活动（例如，如果没有真实地址，可用 `bounce-test@yourdomain.com`，但结果可能不同）。稍后检查 Listmonk 中的活动统计，确认是否记录了退信。
* **邮件头验证**：使用 [Mail-Tester](https://www.mail-tester.com/) 等工具或手动检查邮件头，验证 SPF、DKIM 和 DMARC 是否通过，确认通过 Forward Email 正确设置。
* **Forward Email 日志**：如果怀疑 SMTP 服务器导致投递问题，请检查 Forward Email 控制面板的日志。
## 开发者说明 {#developer-notes}

* **模板引擎**：Listmonk 使用 Go 的模板引擎。探索其文档以实现高级个性化：`{{ .Subscriber.Attribs.your_custom_field }}`。
* **API**：Listmonk 提供了全面的 REST API，用于管理列表、订阅者、活动、模板等。API 文档链接位于您的 Listmonk 实例页脚。
* **自定义字段**：在 **设置 -> 订阅者字段** 下定义自定义订阅者字段以存储额外数据。
* **Webhook**：除了退信，Listmonk 还可以为其他事件（例如订阅）发送 webhook，便于与其他系统集成。

## 结论 {#conclusion}

通过将自托管的 Listmonk 强大功能与 Forward Email 安全且尊重隐私的投递相结合，您打造了一个强大且合乎道德的电子邮件营销平台。您完全拥有受众数据的所有权，同时享受高投递率和自动化安全功能。

此方案提供了一个可扩展、经济高效且开发者友好的替代专有电子邮件服务的选择，完美契合开源软件和用户隐私的理念。

祝发送愉快！🚀
