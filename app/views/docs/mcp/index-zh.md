# 转发邮件 MCP 服务器 {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="转发邮件 MCP 服务器" class="rounded-lg" />

<p class="lead mt-3">
  <strong>简要说明：</strong>我们的<a href="https://github.com/forwardemail/mcp-server">开源 MCP 服务器</a>让 Claude、ChatGPT、Cursor 和 Windsurf 等 AI 助手通过自然语言管理您的电子邮件、域名、别名、联系人和日历。所有 68 个 API 端点都作为 MCP 工具公开。它通过 <code>npx @forwardemail/mcp-server</code> 本地运行——您的凭据永远不会离开您的机器。
</p>


## 目录 {#table-of-contents}

* [什么是 MCP？](#what-is-mcp)
* [快速开始](#quick-start)
  * [获取 API 密钥](#get-an-api-key)
  * [Claude 桌面版](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [其他 MCP 客户端](#other-mcp-clients)
* [认证](#authentication)
  * [API 密钥认证](#api-key-auth)
  * [别名认证](#alias-auth)
  * [生成别名密码](#generating-an-alias-password)
* [全部 68 个工具](#all-68-tools)
  * [账户（API 密钥或别名认证）](#account-api-key-or-alias-auth)
  * [域名（API 密钥）](#domains-api-key)
  * [别名（API 密钥）](#aliases-api-key)
  * [邮件 — 出站 SMTP（API 密钥；发送支持两者）](#emails--outbound-smtp-api-key-send-supports-both)
  * [消息 — IMAP（别名认证）](#messages--imap-alias-auth)
  * [文件夹 — IMAP（别名认证）](#folders--imap-alias-auth)
  * [联系人 — CardDAV（别名认证）](#contacts--carddav-alias-auth)
  * [日历 — CalDAV（别名认证）](#calendars--caldav-alias-auth)
  * [日历事件 — CalDAV（别名认证）](#calendar-events--caldav-alias-auth)
  * [Sieve 脚本（API 密钥）](#sieve-scripts-api-key)
  * [Sieve 脚本（别名认证）](#sieve-scripts-alias-auth)
  * [域成员和邀请（API 密钥）](#domain-members-and-invites-api-key)
  * [Catch-All 密码（API 密钥）](#catch-all-passwords-api-key)
  * [日志（API 密钥）](#logs-api-key)
  * [加密（无认证）](#encrypt-no-auth)
* [20 个真实用例](#20-real-world-use-cases)
  * [1. 邮件分拣](#1-email-triage)
  * [2. 域名设置自动化](#2-domain-setup-automation)
  * [3. 批量别名管理](#3-bulk-alias-management)
  * [4. 邮件活动监控](#4-email-campaign-monitoring)
  * [5. 联系人同步与清理](#5-contact-sync-and-cleanup)
  * [6. 日历管理](#6-calendar-management)
  * [7. Sieve 脚本自动化](#7-sieve-script-automation)
  * [8. 团队入职](#8-team-onboarding)
  * [9. 安全审计](#9-security-auditing)
  * [10. 邮件转发设置](#10-email-forwarding-setup)
  * [11. 收件箱搜索与分析](#11-inbox-search-and-analysis)
  * [12. 文件夹整理](#12-folder-organization)
  * [13. 密码轮换](#13-password-rotation)
  * [14. DNS 记录加密](#14-dns-record-encryption)
  * [15. 传递日志分析](#15-delivery-log-analysis)
  * [16. 多域名管理](#16-multi-domain-management)
  * [17. Catch-All 配置](#17-catch-all-configuration)
  * [18. 域邀请管理](#18-domain-invite-management)
  * [19. S3 存储测试](#19-s3-storage-testing)
  * [20. 邮件草稿撰写](#20-email-draft-composition)
* [示例提示](#example-prompts)
* [环境变量](#environment-variables)
* [安全](#security)
* [编程使用](#programmatic-usage)
* [开源](#open-source)


## 什么是 MCP？ {#what-is-mcp}

[模型上下文协议](https://modelcontextprotocol.io)（MCP）是 Anthropic 创建的一个开放标准，允许 AI 模型安全调用外部工具。MCP 让模型无需复制粘贴 API 响应到聊天窗口，而是直接以结构化方式访问您的服务。

我们的 MCP 服务器封装了整个[转发邮件 API](/email-api)——每个端点、每个参数——并将它们作为任何兼容 MCP 的客户端都能使用的工具公开。服务器在您的机器本地运行，使用 stdio 传输。您的凭据保存在环境变量中，绝不会发送给 AI 模型。


## 快速开始 {#quick-start}

### 获取 API 密钥 {#get-an-api-key}
1. 登录您的 [Forward Email 账户](/my-account/domains)。
2. 进入 **我的账户** → **安全** → **API 密钥**。
3. 生成一个新的 API 密钥并复制它。

### Claude Desktop {#claude-desktop}

将此添加到您的 Claude Desktop 配置文件中：

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

重启 Claude Desktop。您应该能在工具选择器中看到 Forward Email 工具。

> **注意：** `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD` 变量是可选的，但邮箱工具（消息、文件夹、联系人、日历）需要它们。详情请参见 [认证](#authentication)。

### Cursor {#cursor}

打开 Cursor 设置 → MCP → 添加服务器：

```json
{
  "mcpServers": {
    "forwardemail": {
      "command": "npx",
      "args": ["-y", "@forwardemail/mcp-server"],
      "env": {
        "FORWARD_EMAIL_API_KEY": "your-api-key-here",
        "FORWARD_EMAIL_ALIAS_USER": "you@example.com",
        "FORWARD_EMAIL_ALIAS_PASSWORD": "your-generated-alias-password"
      }
    }
  }
}
```

### Windsurf {#windsurf}

打开 Windsurf 设置 → MCP → 添加服务器，配置同上。

### 其他 MCP 客户端 {#other-mcp-clients}

任何支持 MCP stdio 传输的客户端都可以使用。命令如下：

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```

## 认证 {#authentication}

Forward Email API 使用 **HTTP 基本认证**，根据不同的端点使用两种不同的凭据类型。MCP 服务器会自动处理认证 —— 您只需提供正确的凭据。

### API 密钥认证 {#api-key-auth}

大多数管理端点（域名、别名、发件邮件、日志）使用您的 **API 密钥** 作为 Basic 认证的用户名，密码为空。

这就是您用于 REST API 的同一个 API 密钥。通过 `FORWARD_EMAIL_API_KEY` 环境变量设置。

### 别名认证 {#alias-auth}

邮箱端点（消息、文件夹、联系人、日历、别名作用域的 Sieve 脚本）使用 **别名凭据** —— 以别名邮箱地址作为用户名，生成的密码作为密码。

这些端点通过 IMAP、CalDAV 和 CardDAV 协议访问每个别名的数据。它们需要别名邮箱和生成的密码，而非 API 密钥。

您可以通过两种方式提供别名凭据：

1. **环境变量**（推荐用于默认别名）：设置 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。
2. **每次工具调用参数**：将 `alias_username` 和 `alias_password` 作为参数传递给任何别名认证工具。这会覆盖环境变量，适合处理多个别名时使用。

### 生成别名密码 {#generating-an-alias-password}

在使用别名认证工具之前，您需要为别名生成密码。您可以使用 `generateAliasPassword` 工具或通过 API 实现：

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

响应中包含 `username`（别名邮箱）和 `password` 字段。使用它们作为别名凭据。

> **提示：** 您也可以询问您的 AI 助手：“为域 example.com 上的别名 <user@example.com> 生成密码” —— 它会调用 `generateAliasPassword` 工具并返回凭据。

下表总结了各工具组所需的认证方式：

| 工具组                                                         | 认证方式                 | 凭据                                                       |
| -------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------- |
| 账户                                                           | API 密钥 **或** 别名认证 | 任一                                                       |
| 域名、别名、域成员、邀请、Catch-All 密码                       | API 密钥                 | `FORWARD_EMAIL_API_KEY`                                    |
| 发件邮件（列表、获取、删除、限制）                             | API 密钥                 | `FORWARD_EMAIL_API_KEY`                                    |
| 发送邮件                                                       | API 密钥 **或** 别名认证 | 任一                                                       |
| 消息（IMAP）                                                   | 别名认证                 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 文件夹（IMAP）                                                 | 别名认证                 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 联系人（CardDAV）                                             | 别名认证                 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 日历（CalDAV）                                               | 别名认证                 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 日历事件（CalDAV）                                           | 别名认证                 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieve 脚本（域作用域）                                        | API 密钥                 | `FORWARD_EMAIL_API_KEY`                                    |
| Sieve 脚本（别名作用域）                                      | 别名认证                 | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 日志                                                           | API 密钥                 | `FORWARD_EMAIL_API_KEY`                                    |
| 加密                                                           | 无                       | 不需要凭据                                               |
## 所有 68 个工具 {#all-68-tools}

每个工具都直接映射到一个 [Forward Email API](/email-api) 端点。参数使用与 API 文档相同的名称。每个部分标题中注明了认证方式。

### 账户（API 密钥或别名认证） {#account-api-key-or-alias-auth}

使用 API 密钥认证时，这些接口返回您的用户账户信息。使用别名认证时，它们返回别名/邮箱信息，包括存储配额和设置。

| 工具               | API 端点             | 描述                       |
| ------------------ | -------------------- | -------------------------- |
| `getAccount`       | `GET /v1/account`    | 获取您的账户信息           |
| `updateAccount`    | `PUT /v1/account`    | 更新您的账户设置           |

### 域名（API 密钥） {#domains-api-key}

| 工具                  | API 端点                                      | 描述                       |
| --------------------- | --------------------------------------------- | -------------------------- |
| `listDomains`         | `GET /v1/domains`                             | 列出您所有的域名           |
| `createDomain`        | `POST /v1/domains`                            | 添加新域名                 |
| `getDomain`           | `GET /v1/domains/:domain_id`                  | 获取域名详情               |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                  | 更新域名设置               |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`               | 删除域名                   |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`  | 验证 DNS 记录              |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`     | 验证 SMTP 配置             |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | 测试自定义 S3 存储       |

### 别名（API 密钥） {#aliases-api-key}

| 工具                     | API 端点                                                      | 描述                             |
| ------------------------ | ------------------------------------------------------------- | -------------------------------- |
| `listAliases`            | `GET /v1/domains/:domain_id/aliases`                          | 列出域名的别名                   |
| `createAlias`            | `POST /v1/domains/:domain_id/aliases`                         | 创建新别名                      |
| `getAlias`               | `GET /v1/domains/:domain_id/aliases/:alias_id`                | 获取别名详情                   |
| `updateAlias`            | `PUT /v1/domains/:domain_id/aliases/:alias_id`                | 更新别名                       |
| `deleteAlias`            | `DELETE /v1/domains/:domain_id/aliases/:alias_id`             | 删除别名                       |
| `generateAliasPassword`  | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | 为别名认证生成 IMAP/SMTP 密码 |

### 邮件 — 外发 SMTP（API 密钥；发送支持两者） {#emails--outbound-smtp-api-key-send-supports-both}

| 工具            | API 端点               | 认证方式               | 描述                         |
| --------------- | ---------------------- | ---------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`      | API 密钥或别名认证     | 通过 SMTP 发送邮件           |
| `listEmails`    | `GET /v1/emails`       | API 密钥               | 列出外发邮件                 |
| `getEmail`      | `GET /v1/emails/:id`   | API 密钥               | 获取邮件详情和状态           |
| `deleteEmail`   | `DELETE /v1/emails/:id`| API 密钥               | 删除排队邮件                 |
| `getEmailLimit` | `GET /v1/emails/limit` | API 密钥               | 检查您的发送限制             |

`sendEmail` 工具接受 `from`、`to`、`cc`、`bcc`、`subject`、`text`、`html` 和 `attachments` 参数。这与 `POST /v1/emails` 端点相同。

### 消息 — IMAP（别名认证） {#messages--imap-alias-auth}

> **需要别名凭证。** 传递 `alias_username` 和 `alias_password`，或设置环境变量 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。
| 工具             | API 端点                   | 描述                           |
| --------------- | ------------------------- | ------------------------------ |
| `listMessages`  | `GET /v1/messages`        | 列出并搜索邮箱中的邮件          |
| `createMessage` | `POST /v1/messages`       | 创建草稿或上传邮件              |
| `getMessage`    | `GET /v1/messages/:id`    | 通过 ID 获取邮件                |
| `updateMessage` | `PUT /v1/messages/:id`    | 更新标记（已读、加星等）        |
| `deleteMessage` | `DELETE /v1/messages/:id` | 删除邮件                      |

`listMessages` 工具支持 15+ 搜索参数，包括 `subject`、`from`、`to`、`text`、`since`、`before`、`is_unread` 和 `has_attachment`。完整列表请参见 [API docs](/email-api)。

### 文件夹 — IMAP（别名认证）{#folders--imap-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password`，或设置环境变量 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。

| 工具            | API 端点                 | 描述               |
| -------------- | ------------------------ | ------------------ |
| `listFolders`  | `GET /v1/folders`        | 列出所有邮箱文件夹  |
| `createFolder` | `POST /v1/folders`       | 创建新文件夹        |
| `getFolder`    | `GET /v1/folders/:id`    | 获取文件夹详情      |
| `updateFolder` | `PUT /v1/folders/:id`    | 重命名文件夹        |
| `deleteFolder` | `DELETE /v1/folders/:id` | 删除文件夹          |

### 联系人 — CardDAV（别名认证）{#contacts--carddav-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password`，或设置环境变量 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。

| 工具             | API 端点                 | 描述               |
| --------------- | ------------------------ | ------------------ |
| `listContacts`  | `GET /v1/contacts`        | 列出所有联系人      |
| `createContact` | `POST /v1/contacts`       | 创建新联系人        |
| `getContact`    | `GET /v1/contacts/:id`    | 获取联系人详情      |
| `updateContact` | `PUT /v1/contacts/:id`    | 更新联系人          |
| `deleteContact` | `DELETE /v1/contacts/:id` | 删除联系人          |

### 日历 — CalDAV（别名认证）{#calendars--caldav-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password`，或设置环境变量 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。

| 工具              | API 端点                  | 描述               |
| ---------------- | ------------------------- | ------------------ |
| `listCalendars`  | `GET /v1/calendars`        | 列出所有日历        |
| `createCalendar` | `POST /v1/calendars`       | 创建新日历          |
| `getCalendar`    | `GET /v1/calendars/:id`    | 获取日历详情        |
| `updateCalendar` | `PUT /v1/calendars/:id`    | 更新日历            |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | 删除日历            |

### 日历事件 — CalDAV（别名认证）{#calendar-events--caldav-alias-auth}

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password`，或设置环境变量 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。

| 工具                   | API 端点                      | 描述               |
| --------------------- | ----------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`      | 列出所有事件        |
| `createCalendarEvent` | `POST /v1/calendar-events`     | 创建新事件          |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`  | 获取事件详情        |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`  | 更新事件            |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | 删除事件          |

### Sieve 脚本（API 密钥）{#sieve-scripts-api-key}

这些使用域范围路径，并通过您的 API 密钥进行认证。

| 工具                   | API 端点                                                                 | 描述                   |
| --------------------- | ------------------------------------------------------------------------ | ---------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | 列出别名的脚本          |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                    | 创建新脚本              |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`          | 获取脚本详情            |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`          | 更新脚本                |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`       | 删除脚本                |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | 激活脚本                |
### 筛选脚本（别名认证）{#sieve-scripts-alias-auth}

这些使用别名级别的认证。适用于无需 API 密钥即可进行每个别名的自动化操作。

> **需要别名凭据。** 传递 `alias_username` 和 `alias_password`，或设置环境变量 `FORWARD_EMAIL_ALIAS_USER` 和 `FORWARD_EMAIL_ALIAS_PASSWORD`。

| 工具                           | API 端点                                     | 描述              |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | 列出脚本           |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | 创建脚本           |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | 获取脚本详情       |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | 更新脚本           |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | 删除脚本           |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | 激活脚本           |

### 域成员和邀请（API 密钥）{#domain-members-and-invites-api-key}

| 工具                 | API 端点                                         | 描述                    |
| -------------------- | ------------------------------------------------ | ------------------------ |
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id`  | 更改成员角色             |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | 移除成员                 |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites`             | 接受待处理邀请           |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites`            | 邀请某人加入域           |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites`          | 撤销邀请                 |

### 通配密码（API 密钥）{#catch-all-passwords-api-key}

| 工具                     | API 端点                                                    | 描述                      |
| ------------------------ | ----------------------------------------------------------- | -------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`            | 列出通配密码               |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`           | 创建通配密码               |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | 删除通配密码               |

### 日志（API 密钥）{#logs-api-key}

| 工具           | API 端点                | 描述                      |
| -------------- | ----------------------- | -------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | 下载邮件投递日志           |

### 加密（无认证）{#encrypt-no-auth}

| 工具            | API 端点       | 描述                      |
| --------------- | -------------- | -------------------------- |
| `encryptRecord` | `POST /v1/encrypt` | 加密 DNS TXT 记录          |

此工具无需认证。它加密转发记录，如 `forward-email=user@example.com`，用于 DNS TXT 记录。

## 20 个真实世界用例 {#20-real-world-use-cases}

以下是将 MCP 服务器与您的 AI 助手结合使用的实用方法：

### 1. 邮件分类处理 {#1-email-triage}

让您的 AI 扫描收件箱并总结未读邮件。它可以标记紧急邮件、按发件人分类，并起草回复——全部通过自然语言完成。*（访问收件箱需要别名凭据。）*

### 2. 域名设置自动化 {#2-domain-setup-automation}

正在设置新域名？让 AI 创建域名、添加别名、验证 DNS 记录并测试 SMTP 配置。通常需要 10 分钟点击操作的流程，变成一次对话。

### 3. 批量别名管理 {#3-bulk-alias-management}

需要为新项目创建 20 个别名？描述您的需求，让 AI 处理重复工作。它可以一次性创建别名、设置转发规则并生成密码。
### 4. 电子邮件活动监控 {#4-email-campaign-monitoring}

让你的 AI 检查发送限制，列出最近的外发邮件，并报告投递状态。对监控事务性邮件健康状况非常有用。

### 5. 联系人同步与清理 {#5-contact-sync-and-cleanup}

使用 CardDAV 工具列出所有联系人，查找重复项，更新过时信息，或从你粘贴到聊天中的电子表格批量创建联系人。*（需要别名凭证。）*

### 6. 日历管理 {#6-calendar-management}

创建日历、添加事件、更新会议时间、删除已取消事件——全部通过对话完成。CalDAV 工具支持对日历和事件的完整增删改查。*（需要别名凭证。）*

### 7. Sieve 脚本自动化 {#7-sieve-script-automation}

Sieve 脚本功能强大但语法晦涩。让你的 AI 为你编写 Sieve 脚本：“将所有来自 <billing@example.com> 的邮件过滤到 Billing 文件夹”即可生成可用脚本，无需接触 RFC 5228 规范。

### 8. 团队入职 {#8-team-onboarding}

当新成员加入时，让 AI 创建他们的别名，生成密码，发送包含凭证的欢迎邮件，并将其添加为域成员。一个提示，四个 API 调用。

### 9. 安全审计 {#9-security-auditing}

让你的 AI 列出所有域，检查 DNS 验证状态，审查别名配置，并识别任何未验证记录的域。用自然语言快速完成安全检查。

### 10. 邮件转发设置 {#10-email-forwarding-setup}

为新域设置邮件转发？让 AI 创建域，添加转发别名，加密 DNS 记录，并验证所有配置是否正确。

### 11. 收件箱搜索与分析 {#11-inbox-search-and-analysis}

使用消息搜索工具查找特定邮件：“查找过去 30 天内所有来自 <john@example.com> 且带附件的邮件。”15+ 搜索参数使其功能强大。*（需要别名凭证。）*

### 12. 文件夹组织 {#12-folder-organization}

让你的 AI 为新项目创建文件夹结构，在文件夹间移动邮件，或清理不再需要的旧文件夹。*（需要别名凭证。）*

### 13. 密码轮换 {#13-password-rotation}

按计划生成新的别名密码。让你的 AI 为每个别名生成新密码并报告新凭证。

### 14. DNS 记录加密 {#14-dns-record-encryption}

在添加到 DNS 之前加密你的转发记录。`encryptRecord` 工具无需认证即可处理此操作——适合快速一次性加密。

### 15. 投递日志分析 {#15-delivery-log-analysis}

下载你的邮件投递日志，让 AI 分析退信率，识别问题收件人，或跟踪投递时间。

### 16. 多域管理 {#16-multi-domain-management}

如果你管理多个域，让 AI 给你状态报告：哪些域已验证，哪些有问题，每个域有多少别名，发送限制情况如何。

### 17. 通配符配置 {#17-catch-all-configuration}

为需要接收任意地址邮件的域设置通配符密码。AI 可以为你创建、列出和管理这些密码。

### 18. 域邀请管理 {#18-domain-invite-management}

邀请团队成员管理域，检查待处理邀请，并清理过期邀请。适合拥有多个域管理员的组织。

### 19. S3 存储测试 {#19-s3-storage-testing}

如果你使用自定义 S3 存储备份邮件，让 AI 测试连接并验证其正常工作。

### 20. 邮件草稿撰写 {#20-email-draft-composition}

在邮箱中创建邮件草稿而不发送。适合准备需要审核的邮件或构建邮件模板。*（需要别名凭证。）*


## 示例提示 {#example-prompts}

以下是你可以直接与 AI 助手使用的提示：

**发送邮件：**

> “从 <hello@mydomain.com> 发送邮件到 <john@example.com>，主题为‘明天开会’，正文为‘嗨 John，我们下午 2 点的会议还确定吗？’”
**域名管理：**

> “列出我所有的域名，并告诉我哪些域名有未验证的 DNS 记录。”

**别名创建：**

> “创建一个新的别名 <support@mydomain.com>，将邮件转发到我的个人邮箱。”

**收件箱搜索（需要别名凭据）：**

> “查找过去一周内所有未读且提及‘invoice’的邮件。”

**日历（需要别名凭据）：**

> “创建一个名为‘工作’的日历，并添加一个明天下午2点的会议，名称为‘团队站会’。”

**Sieve 脚本：**

> “为 <info@mydomain.com> 编写一个 Sieve 脚本，自动回复邮件内容为‘感谢您的联系，我们将在24小时内回复您。’”

**批量操作：**

> “为 mydomain.com 创建 sales@、support@、billing@ 和 info@ 的别名，全部转发到 <team@mydomain.com>。”

**安全检查：**

> “检查我所有域名的 DNS 和 SMTP 验证状态，并告诉我是否有需要注意的事项。”

**生成别名密码：**

> “为别名 <user@example.com> 生成一个密码，以便我访问收件箱。”


## 环境变量 {#environment-variables}

| 变量                           | 必填   | 默认值                         | 描述                                                                           |
| ------------------------------ | ------ | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | 是     | —                              | 您的 Forward Email API 密钥（用于 API 密钥端点的 Basic 认证用户名）             |
| `FORWARD_EMAIL_ALIAS_USER`     | 否     | —                              | 邮箱端点的别名邮箱地址（例如 `user@example.com`）                              |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | 否     | —                              | 邮箱端点的生成别名密码                                                          |
| `FORWARD_EMAIL_API_URL`        | 否     | `https://api.forwardemail.net` | API 基础 URL（用于自托管或测试）                                               |


## 安全 {#security}

MCP 服务器在您的本地机器上运行。安全机制如下：

* **您的凭据保持本地。** 您的 API 密钥和别名凭据均从环境变量读取，并通过 HTTP Basic 认证用于 API 请求身份验证。它们绝不会发送给 AI 模型。
* **stdio 传输。** 服务器通过 stdin/stdout 与 AI 客户端通信。不打开任何网络端口。
* **无数据存储。** 服务器无状态，不缓存、不记录或存储您的任何邮件数据。
* **开源。** 整个代码库托管在 [GitHub](https://github.com/forwardemail/mcp-server)。您可以审计每一行代码。


## 编程使用 {#programmatic-usage}

您也可以将服务器作为库使用：

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## 开源 {#open-source}

Forward Email MCP 服务器是 [GitHub 上的开源项目](https://github.com/forwardemail/mcp-server)，采用 BUSL-1.1 许可证。我们相信透明。如果您发现漏洞或想要新功能，[请提交 issue](https://github.com/forwardemail/mcp-server/issues)。
