# Forward Email MCP Server {#forward-email-mcp-server}

<img loading="lazy" src="/img/articles/mcp.webp" alt="Forward Email MCP Server" class="rounded-lg" />

<p class="lead mt-3">
  <strong>TL;DR:</strong> 私たちの <a href="https://github.com/forwardemail/mcp-server">オープンソースMCPサーバー</a> は、Claude、ChatGPT、Cursor、WindsurfなどのAIアシスタントが自然言語を通じてメール、ドメイン、エイリアス、連絡先、カレンダーを管理できるようにします。全68のAPIエンドポイントがMCPツールとして公開されています。<code>npx @forwardemail/mcp-server</code> でローカルに実行され、認証情報は決してマシンを離れません。
</p>


## 目次 {#table-of-contents}

* [MCPとは？](#what-is-mcp)
* [クイックスタート](#quick-start)
  * [APIキーを取得する](#get-an-api-key)
  * [Claudeデスクトップ](#claude-desktop)
  * [Cursor](#cursor)
  * [Windsurf](#windsurf)
  * [その他のMCPクライアント](#other-mcp-clients)
* [認証](#authentication)
  * [APIキー認証](#api-key-auth)
  * [エイリアス認証](#alias-auth)
  * [エイリアスパスワードの生成](#generating-an-alias-password)
* [全68ツール](#all-68-tools)
  * [アカウント（APIキーまたはエイリアス認証）](#account-api-key-or-alias-auth)
  * [ドメイン（APIキー）](#domains-api-key)
  * [エイリアス（APIキー）](#aliases-api-key)
  * [メール — 送信SMTP（APIキー；Sendは両方対応）](#emails--outbound-smtp-api-key-send-supports-both)
  * [メッセージ — IMAP（エイリアス認証）](#messages--imap-alias-auth)
  * [フォルダ — IMAP（エイリアス認証）](#folders--imap-alias-auth)
  * [連絡先 — CardDAV（エイリアス認証）](#contacts--carddav-alias-auth)
  * [カレンダー — CalDAV（エイリアス認証）](#calendars--caldav-alias-auth)
  * [カレンダーイベント — CalDAV（エイリアス認証）](#calendar-events--caldav-alias-auth)
  * [Sieveスクリプト（APIキー）](#sieve-scripts-api-key)
  * [Sieveスクリプト（エイリアス認証）](#sieve-scripts-alias-auth)
  * [ドメインメンバーと招待（APIキー）](#domain-members-and-invites-api-key)
  * [キャッチオールパスワード（APIキー）](#catch-all-passwords-api-key)
  * [ログ（APIキー）](#logs-api-key)
  * [暗号化（認証不要）](#encrypt-no-auth)
* [20の実用例](#20-real-world-use-cases)
  * [1. メールの仕分け](#1-email-triage)
  * [2. ドメイン設定の自動化](#2-domain-setup-automation)
  * [3. エイリアス一括管理](#3-bulk-alias-management)
  * [4. メールキャンペーンの監視](#4-email-campaign-monitoring)
  * [5. 連絡先の同期と整理](#5-contact-sync-and-cleanup)
  * [6. カレンダー管理](#6-calendar-management)
  * [7. Sieveスクリプトの自動化](#7-sieve-script-automation)
  * [8. チームのオンボーディング](#8-team-onboarding)
  * [9. セキュリティ監査](#9-security-auditing)
  * [10. メール転送設定](#10-email-forwarding-setup)
  * [11. 受信箱の検索と分析](#11-inbox-search-and-analysis)
  * [12. フォルダ整理](#12-folder-organization)
  * [13. パスワードのローテーション](#13-password-rotation)
  * [14. DNSレコードの暗号化](#14-dns-record-encryption)
  * [15. 配信ログの分析](#15-delivery-log-analysis)
  * [16. マルチドメイン管理](#16-multi-domain-management)
  * [17. キャッチオール設定](#17-catch-all-configuration)
  * [18. ドメイン招待管理](#18-domain-invite-management)
  * [19. S3ストレージのテスト](#19-s3-storage-testing)
  * [20. メール下書き作成](#20-email-draft-composition)
* [例示プロンプト](#example-prompts)
* [環境変数](#environment-variables)
* [セキュリティ](#security)
* [プログラムによる利用](#programmatic-usage)
* [オープンソース](#open-source)


## MCPとは？ {#what-is-mcp}

[Model Context Protocol](https://modelcontextprotocol.io)（MCP）は、Anthropicによって作成されたオープンスタンダードで、AIモデルが外部ツールを安全に呼び出せるようにします。APIレスポンスをチャットウィンドウにコピー＆ペーストする代わりに、MCPはモデルにサービスへの直接的かつ構造化されたアクセスを提供します。

私たちのMCPサーバーは、[Forward Email API](/email-api)全体—すべてのエンドポイント、すべてのパラメータ—をラップし、MCP対応クライアントが利用できるツールとして公開します。サーバーはstdioトランスポートを使ってローカルマシン上で動作し、認証情報は環境変数に保持され、AIモデルに送信されることはありません。


## クイックスタート {#quick-start}

### APIキーを取得する {#get-an-api-key}
1. [Forward Emailアカウント](/my-account/domains)にログインします。
2. **マイアカウント** → **セキュリティ** → **APIキー** に移動します。
3. 新しいAPIキーを生成してコピーします。

### Claude Desktop {#claude-desktop}

これをClaude Desktopの設定ファイルに追加してください：

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

Claude Desktopを再起動してください。ツールピッカーにForward Emailツールが表示されるはずです。

> **注意：** `FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` の変数はオプションですが、メールボックスツール（メッセージ、フォルダ、連絡先、カレンダー）には必須です。詳細は[認証](#authentication)を参照してください。

### Cursor {#cursor}

Cursorの設定を開き → MCP → サーバーを追加：

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

Windsurfの設定を開き → MCP → 上記と同じ設定でサーバーを追加してください。

### その他のMCPクライアント {#other-mcp-clients}

MCP stdioトランスポートをサポートする任意のクライアントで動作します。コマンドは以下の通りです：

```sh
FORWARD_EMAIL_API_KEY=your-api-key \
  FORWARD_EMAIL_ALIAS_USER=you@example.com \
  FORWARD_EMAIL_ALIAS_PASSWORD=your-generated-alias-password \
  npx @forwardemail/mcp-server
```


## 認証 {#authentication}

Forward Email APIはエンドポイントに応じて2種類の資格情報を使う**HTTP Basic認証**を使用します。MCPサーバーがこれを自動的に処理するため、適切な資格情報を提供するだけで済みます。

### APIキー認証 {#api-key-auth}

ほとんどの管理用エンドポイント（ドメイン、エイリアス、送信メール、ログ）は、Basic認証のユーザー名に**APIキー**を使い、パスワードは空にします。

これはREST APIで使うのと同じAPIキーです。`FORWARD_EMAIL_API_KEY`環境変数で設定してください。

### エイリアス認証 {#alias-auth}

メールボックス用エンドポイント（メッセージ、フォルダ、連絡先、カレンダー、エイリアススコープのSieveスクリプト）は**エイリアス資格情報**を使います。ユーザー名はエイリアスのメールアドレス、パスワードは生成されたパスワードです。

これらのエンドポイントはIMAP、CalDAV、CardDAVプロトコルを通じてエイリアスごとのデータにアクセスします。APIキーではなく、エイリアスメールアドレスと生成されたパスワードが必要です。

エイリアス資格情報は以下の2通りで提供できます：

1. **環境変数**（デフォルトエイリアスに推奨）：`FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` を設定
2. **ツール呼び出しごとのパラメータ**：任意のエイリアス認証ツールに `alias_username` と `alias_password` を引数として渡す。環境変数より優先され、複数エイリアスを扱う際に便利です。

### エイリアスパスワードの生成 {#generating-an-alias-password}

エイリアス認証ツールを使う前に、エイリアスのパスワードを生成する必要があります。`generateAliasPassword`ツールかAPIで生成可能です：

```sh
curl -u "YOUR_API_KEY:" \
  https://api.forwardemail.net/v1/domains/example.com/aliases/ALIAS_ID/generate-password \
  -X POST
```

レスポンスには `username`（エイリアスメール）と `password` フィールドが含まれます。これらをエイリアス資格情報として使用してください。

> **ヒント：** AIアシスタントに「ドメインexample.comのエイリアス<user@example.com>のパスワードを生成して」と依頼すると、`generateAliasPassword`ツールを呼び出して資格情報を返します。

以下の表は各ツールグループが必要とする認証方法をまとめています：

| ツールグループ                                               | 認証方法                 | 資格情報                                                     |
| ------------------------------------------------------------ | ------------------------ | ------------------------------------------------------------ |
| アカウント                                                   | APIキー **または** エイリアス認証 | どちらでも可                                                |
| ドメイン、エイリアス、ドメインメンバー、招待、キャッチオールパスワード | APIキー                   | `FORWARD_EMAIL_API_KEY`                                     |
| 送信メール（一覧、取得、削除、制限）                         | APIキー                   | `FORWARD_EMAIL_API_KEY`                                     |
| メール送信                                                   | APIキー **または** エイリアス認証 | どちらでも可                                                |
| メッセージ（IMAP）                                          | エイリアス認証            | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| フォルダ（IMAP）                                           | エイリアス認証            | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| 連絡先（CardDAV）                                         | エイリアス認証            | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| カレンダー（CalDAV）                                       | エイリアス認証            | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| カレンダーイベント（CalDAV）                               | エイリアス認証            | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| Sieveスクリプト（ドメインスコープ）                        | APIキー                   | `FORWARD_EMAIL_API_KEY`                                     |
| Sieveスクリプト（エイリアススコープ）                      | エイリアス認証            | `FORWARD_EMAIL_ALIAS_USER` + `FORWARD_EMAIL_ALIAS_PASSWORD` |
| ログ                                                       | APIキー                   | `FORWARD_EMAIL_API_KEY`                                     |
| 暗号化                                                     | なし                      | 資格情報不要                                               |
## 全68ツール {#all-68-tools}

すべてのツールは直接[Forward Email API](/email-api)のエンドポイントに対応しています。パラメータはAPIドキュメントと同じ名前を使用しています。認証方法は各セクションの見出しに記載されています。

### アカウント（APIキーまたはエイリアス認証） {#account-api-key-or-alias-auth}

APIキー認証では、これらはユーザーアカウント情報を返します。エイリアス認証では、ストレージクォータや設定を含むエイリアス/メールボックス情報を返します。

| ツール            | APIエンドポイント      | 説明                         |
| --------------- | ----------------- | ---------------------------- |
| `getAccount`    | `GET /v1/account` | アカウント情報を取得          |
| `updateAccount` | `PUT /v1/account` | アカウント設定を更新          |

### ドメイン（APIキー） {#domains-api-key}

| ツール                  | APIエンドポイント                                     | 説明                       |
| --------------------- | ------------------------------------------------ | ------------------------- |
| `listDomains`         | `GET /v1/domains`                                | すべてのドメインを一覧表示   |
| `createDomain`        | `POST /v1/domains`                               | 新しいドメインを追加         |
| `getDomain`           | `GET /v1/domains/:domain_id`                     | ドメインの詳細を取得         |
| `updateDomain`        | `PUT /v1/domains/:domain_id`                     | ドメイン設定を更新           |
| `deleteDomain`        | `DELETE /v1/domains/:domain_id`                  | ドメインを削除               |
| `verifyDomainRecords` | `GET /v1/domains/:domain_id/verify-records`      | DNSレコードを検証            |
| `verifySmtpRecords`   | `GET /v1/domains/:domain_id/verify-smtp`         | SMTP設定を検証              |
| `testS3Connection`    | `POST /v1/domains/:domain_id/test-s3-connection` | カスタムS3ストレージをテスト  |

### エイリアス（APIキー） {#aliases-api-key}

| ツール                    | APIエンドポイント                                                      | 説明                                |
| ----------------------- | ----------------------------------------------------------------- | ------------------------------------------ |
| `listAliases`           | `GET /v1/domains/:domain_id/aliases`                              | ドメインのエイリアスを一覧表示                |
| `createAlias`           | `POST /v1/domains/:domain_id/aliases`                             | 新しいエイリアスを作成                       |
| `getAlias`              | `GET /v1/domains/:domain_id/aliases/:alias_id`                    | エイリアスの詳細を取得                       |
| `updateAlias`           | `PUT /v1/domains/:domain_id/aliases/:alias_id`                    | エイリアスを更新                            |
| `deleteAlias`           | `DELETE /v1/domains/:domain_id/aliases/:alias_id`                 | エイリアスを削除                            |
| `generateAliasPassword` | `POST /v1/domains/:domain_id/aliases/:alias_id/generate-password` | エイリアス認証用のIMAP/SMTPパスワードを生成  |

### メール — 送信SMTP（APIキー；Sendは両方対応） {#emails--outbound-smtp-api-key-send-supports-both}

| ツール            | APIエンドポイント            | 認証                  | 説明                         |
| --------------- | ----------------------- | --------------------- | ---------------------------- |
| `sendEmail`     | `POST /v1/emails`       | APIキーまたはエイリアス認証 | SMTP経由でメールを送信          |
| `listEmails`    | `GET /v1/emails`        | APIキー               | 送信済みメールを一覧表示         |
| `getEmail`      | `GET /v1/emails/:id`    | APIキー               | メールの詳細とステータスを取得   |
| `deleteEmail`   | `DELETE /v1/emails/:id` | APIキー               | キューにあるメールを削除          |
| `getEmailLimit` | `GET /v1/emails/limit`  | APIキー               | 送信制限を確認                  |

`sendEmail`ツールは`from`、`to`、`cc`、`bcc`、`subject`、`text`、`html`、`attachments`を受け付けます。これは`POST /v1/emails`エンドポイントと同じです。

### メッセージ — IMAP（エイリアス認証） {#messages--imap-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username`と`alias_password`を渡すか、環境変数`FORWARD_EMAIL_ALIAS_USER`と`FORWARD_EMAIL_ALIAS_PASSWORD`を設定してください。
| ツール            | API エンドポイント              | 説明                           |
| --------------- | ------------------------- | ------------------------------------- |
| `listMessages`  | `GET /v1/messages`        | メールボックス内のメッセージを一覧表示および検索 |
| `createMessage` | `POST /v1/messages`       | 下書きを作成またはメッセージをアップロード    |
| `getMessage`    | `GET /v1/messages/:id`    | IDでメッセージを取得                   |
| `updateMessage` | `PUT /v1/messages/:id`    | フラグを更新（未読、スター付きなど）    |
| `deleteMessage` | `DELETE /v1/messages/:id` | メッセージを削除                      |

`listMessages` ツールは `subject`、`from`、`to`、`text`、`since`、`before`、`is_unread`、`has_attachment` を含む15以上の検索パラメータをサポートしています。完全なリストは[API docs](/email-api)をご覧ください。

### フォルダ — IMAP（エイリアス認証） {#folders--imap-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username` と `alias_password` を渡すか、環境変数 `FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` を設定してください。

| ツール           | API エンドポイント             | 説明              |
| -------------- | ------------------------ | ------------------------ |
| `listFolders`  | `GET /v1/folders`        | すべてのメールボックスフォルダを一覧表示 |
| `createFolder` | `POST /v1/folders`       | 新しいフォルダを作成      |
| `getFolder`    | `GET /v1/folders/:id`    | フォルダの詳細を取得       |
| `updateFolder` | `PUT /v1/folders/:id`    | フォルダ名を変更          |
| `deleteFolder` | `DELETE /v1/folders/:id` | フォルダを削除            |

### 連絡先 — CardDAV（エイリアス認証） {#contacts--carddav-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username` と `alias_password` を渡すか、環境変数 `FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` を設定してください。

| ツール            | API エンドポイント              | 説明          |
| --------------- | ------------------------- | -------------------- |
| `listContacts`  | `GET /v1/contacts`        | すべての連絡先を一覧表示    |
| `createContact` | `POST /v1/contacts`       | 新しい連絡先を作成 |
| `getContact`    | `GET /v1/contacts/:id`    | 連絡先の詳細を取得  |
| `updateContact` | `PUT /v1/contacts/:id`    | 連絡先を更新     |
| `deleteContact` | `DELETE /v1/contacts/:id` | 連絡先を削除     |

### カレンダー — CalDAV（エイリアス認証） {#calendars--caldav-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username` と `alias_password` を渡すか、環境変数 `FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` を設定してください。

| ツール             | API エンドポイント               | 説明           |
| ---------------- | -------------------------- | --------------------- |
| `listCalendars`  | `GET /v1/calendars`        | すべてのカレンダーを一覧表示    |
| `createCalendar` | `POST /v1/calendars`       | 新しいカレンダーを作成 |
| `getCalendar`    | `GET /v1/calendars/:id`    | カレンダーの詳細を取得  |
| `updateCalendar` | `PUT /v1/calendars/:id`    | カレンダーを更新     |
| `deleteCalendar` | `DELETE /v1/calendars/:id` | カレンダーを削除     |

### カレンダーイベント — CalDAV（エイリアス認証） {#calendar-events--caldav-alias-auth}

> **エイリアス認証情報が必要です。** `alias_username` と `alias_password` を渡すか、環境変数 `FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` を設定してください。

| ツール                  | API エンドポイント                     | 説明        |
| --------------------- | -------------------------------- | ------------------ |
| `listCalendarEvents`  | `GET /v1/calendar-events`        | すべてのイベントを一覧表示    |
| `createCalendarEvent` | `POST /v1/calendar-events`       | 新しいイベントを作成 |
| `getCalendarEvent`    | `GET /v1/calendar-events/:id`    | イベントの詳細を取得  |
| `updateCalendarEvent` | `PUT /v1/calendar-events/:id`    | イベントを更新    |
| `deleteCalendarEvent` | `DELETE /v1/calendar-events/:id` | イベントを削除    |

### Sieve スクリプト（API キー） {#sieve-scripts-api-key}

これらはドメインスコープのパスを使用し、API キーで認証します。

| ツール                  | API エンドポイント                                                              | 説明               |
| --------------------- | ------------------------------------------------------------------------- | ------------------------- |
| `listSieveScripts`    | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve`                      | エイリアスのスクリプトを一覧表示 |
| `createSieveScript`   | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve`                     | 新しいスクリプトを作成       |
| `getSieveScript`      | `GET /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | スクリプトの詳細を取得        |
| `updateSieveScript`   | `PUT /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`           | スクリプトを更新           |
| `deleteSieveScript`   | `DELETE /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id`        | スクリプトを削除           |
| `activateSieveScript` | `POST /v1/domains/:domain_id/aliases/:alias_id/sieve/:script_id/activate` | スクリプトを有効化         |
### Sieve Scripts (Alias Auth) {#sieve-scripts-alias-auth}

これらはエイリアスレベルの認証を使用します。APIキーを必要とせず、エイリアスごとの自動化に便利です。

> **エイリアスの認証情報が必要です。** `alias_username` と `alias_password` を渡すか、環境変数 `FORWARD_EMAIL_ALIAS_USER` と `FORWARD_EMAIL_ALIAS_PASSWORD` を設定してください。

| Tool                           | API Endpoint                                 | Description        |
| ------------------------------ | -------------------------------------------- | ------------------ |
| `listSieveScriptsAliasAuth`    | `GET /v1/sieve-scripts`                      | スクリプトの一覧表示       |
| `createSieveScriptAliasAuth`   | `POST /v1/sieve-scripts`                     | スクリプトの作成    |
| `getSieveScriptAliasAuth`      | `GET /v1/sieve-scripts/:script_id`           | スクリプトの詳細取得 |
| `updateSieveScriptAliasAuth`   | `PUT /v1/sieve-scripts/:script_id`           | スクリプトの更新    |
| `deleteSieveScriptAliasAuth`   | `DELETE /v1/sieve-scripts/:script_id`        | スクリプトの削除    |
| `activateSieveScriptAliasAuth` | `POST /v1/sieve-scripts/:script_id/activate` | スクリプトの有効化  |

### Domain Members and Invites (API Key) {#domain-members-and-invites-api-key}

| Tool                 | API Endpoint                                       | Description                |
| -------------------- | -------------------------------------------------- | -------------------------- |
| `updateDomainMember` | `PUT /v1/domains/:domain_id/members/:member_id`    | メンバーの役割変更         |
| `removeDomainMember` | `DELETE /v1/domains/:domain_id/members/:member_id` | メンバーの削除             |
| `acceptDomainInvite` | `GET /v1/domains/:domain_id/invites`               | 保留中の招待を承諾         |
| `createDomainInvite` | `POST /v1/domains/:domain_id/invites`              | ドメインへの招待作成       |
| `removeDomainInvite` | `DELETE /v1/domains/:domain_id/invites`            | 招待の取り消し             |

### Catch-All Passwords (API Key) {#catch-all-passwords-api-key}

| Tool                     | API Endpoint                                                  | Description                 |
| ------------------------ | ------------------------------------------------------------- | --------------------------- |
| `listCatchAllPasswords`  | `GET /v1/domains/:domain_id/catch-all-passwords`              | キャッチオールパスワードの一覧表示    |
| `createCatchAllPassword` | `POST /v1/domains/:domain_id/catch-all-passwords`             | キャッチオールパスワードの作成 |
| `deleteCatchAllPassword` | `DELETE /v1/domains/:domain_id/catch-all-passwords/:token_id` | キャッチオールパスワードの削除 |

### Logs (API Key) {#logs-api-key}

| Tool           | API Endpoint            | Description                  |
| -------------- | ----------------------- | ---------------------------- |
| `downloadLogs` | `GET /v1/logs/download` | メール配信ログのダウンロード |

### Encrypt (No Auth) {#encrypt-no-auth}

| Tool            | API Endpoint       | Description              |
| --------------- | ------------------ | ------------------------ |
| `encryptRecord` | `POST /v1/encrypt` | DNS TXTレコードの暗号化 |

このツールは認証を必要としません。DNS TXTレコードで使用する `forward-email=user@example.com` のような転送レコードを暗号化します。


## 20 Real-World Use Cases {#20-real-world-use-cases}

MCPサーバーをAIアシスタントと連携して使う実用的な方法をご紹介します：

### 1. Email Triage {#1-email-triage}

AIに受信トレイをスキャンして未読メールを要約するよう依頼します。緊急メールのフラグ付け、送信者別の分類、返信の下書き作成など、すべて自然言語で行えます。*(受信トレイアクセスにはエイリアス認証情報が必要です。)*

### 2. Domain Setup Automation {#2-domain-setup-automation}

新しいドメインを設定していますか？AIにドメインの作成、エイリアスの追加、DNSレコードの検証、SMTP設定のテストを依頼しましょう。通常10分かかるダッシュボード操作が会話ひとつで完了します。

### 3. Bulk Alias Management {#3-bulk-alias-management}

新プロジェクト用に20個のエイリアスを作成する必要がありますか？必要な内容を説明すれば、AIが繰り返し作業を代行します。エイリアスの作成、転送ルールの設定、パスワード生成を一括で行えます。
### 4. Email Campaign Monitoring {#4-email-campaign-monitoring}

AIに送信制限の確認、最近の送信メール一覧表示、配信状況の報告を依頼しましょう。トランザクションメールの健全性を監視するのに便利です。

### 5. Contact Sync and Cleanup {#5-contact-sync-and-cleanup}

CardDAVツールを使ってすべての連絡先を一覧表示し、重複を見つけ、古い情報を更新したり、チャットに貼り付けたスプレッドシートから連絡先を一括作成したりできます。*(エイリアス認証情報が必要です。)*

### 6. Calendar Management {#6-calendar-management}

カレンダーの作成、イベントの追加、会議時間の更新、キャンセルされたイベントの削除をすべて会話で行えます。CalDAVツールはカレンダーとイベントの完全なCRUDをサポートします。*(エイリアス認証情報が必要です。)*

### 7. Sieve Script Automation {#7-sieve-script-automation}

Sieveスクリプトは強力ですが、構文が難解です。AIに「<billing@example.com>からのすべてのメールをBillingフォルダに振り分ける」などと依頼すれば、RFC 5228仕様に触れずに動作するスクリプトを作成してくれます。

### 8. Team Onboarding {#8-team-onboarding}

新しいチームメンバーが参加したら、AIにエイリアスの作成、パスワード生成、認証情報を含む歓迎メールの送信、ドメインメンバーへの追加を依頼しましょう。1つのプロンプトで4つのAPIコールを実行します。

### 9. Security Auditing {#9-security-auditing}

AIにすべてのドメイン一覧、DNS検証状況、エイリアス設定の確認、未検証レコードのあるドメインの特定を依頼しましょう。自然言語での迅速なセキュリティチェックです。

### 10. Email Forwarding Setup {#10-email-forwarding-setup}

新しいドメインのメール転送を設定する際は、AIにドメイン作成、転送エイリアス追加、DNSレコードの暗号化、設定の正確な検証を依頼しましょう。

### 11. Inbox Search and Analysis {#11-inbox-search-and-analysis}

メッセージ検索ツールを使って特定のメールを探せます：「過去30日間に<john@example.com>からの添付ファイル付きメールをすべて見つけて」。15以上の検索パラメータで強力です。*(エイリアス認証情報が必要です。)*

### 12. Folder Organization {#12-folder-organization}

AIに新しいプロジェクト用のフォルダ構造作成、フォルダ間のメッセージ移動、不要になった古いフォルダの整理を依頼しましょう。*(エイリアス認証情報が必要です。)*

### 13. Password Rotation {#13-password-rotation}

定期的にエイリアスの新しいパスワードを生成します。AIに各エイリアスの新パスワード生成と新しい認証情報の報告を依頼しましょう。

### 14. DNS Record Encryption {#14-dns-record-encryption}

転送レコードをDNSに追加する前に暗号化します。`encryptRecord`ツールは認証不要でこれを処理します — 簡単な一時的暗号化に便利です。

### 15. Delivery Log Analysis {#15-delivery-log-analysis}

メール配信ログをダウンロードし、AIにバウンス率の分析、問題のある受信者の特定、配信時間の追跡を依頼しましょう。

### 16. Multi-Domain Management {#16-multi-domain-management}

複数ドメインを管理している場合、AIにステータスレポートを依頼しましょう：どのドメインが検証済みか、問題のあるドメイン、各ドメインのエイリアス数、送信制限の状況など。

### 17. Catch-All Configuration {#17-catch-all-configuration}

任意のアドレスでメールを受信する必要があるドメインのキャッチオールパスワードを設定します。AIはこれらのパスワードの作成、一覧表示、管理を行えます。

### 18. Domain Invite Management {#18-domain-invite-management}

チームメンバーをドメイン管理に招待し、保留中の招待状を確認し、期限切れのものを整理しましょう。複数のドメイン管理者がいる組織に便利です。

### 19. S3 Storage Testing {#19-s3-storage-testing}

メールバックアップ用にカスタムS3ストレージを使用している場合、AIに接続テストと正常動作の検証を依頼しましょう。

### 20. Email Draft Composition {#20-email-draft-composition}

送信せずにメールボックス内に下書きメールを作成します。送信前のレビュー用メールやメールテンプレート作成に便利です。*(エイリアス認証情報が必要です。)*


## Example Prompts {#example-prompts}

AIアシスタントに直接使えるプロンプト例はこちらです：

**メール送信：**

> "<hello@mydomain.com>から<john@example.com>へ、件名『明日のミーティング』、本文『ジョンさん、午後2時の予定はまだ大丈夫ですか？』のメールを送ってください。"
**ドメイン管理:**

> "私のすべてのドメインをリストアップし、未検証のDNSレコードがあるものを教えてください。"

**エイリアス作成:**

> "私の個人メールに転送する新しいエイリアス <support@mydomain.com> を作成してください。"

**受信トレイ検索（エイリアス認証情報が必要）:**

> "過去1週間の未読メールで「invoice」という言葉が含まれるものをすべて見つけてください。"

**カレンダー（エイリアス認証情報が必要）:**

> "「Work」というカレンダーを作成し、明日午後2時に「Team Standup」という会議を追加してください。"

**Sieveスクリプト:**

> "<info@mydomain.com> 用のSieveスクリプトを書いてください。内容は「お問い合わせありがとうございます。24時間以内にご連絡いたします。」という自動返信です。"

**一括操作:**

> "mydomain.com の sales@、support@、billing@、info@ のエイリアスをすべて作成し、<team@mydomain.com> に転送してください。"

**セキュリティチェック:**

> "私のすべてのドメインのDNSとSMTPの検証状況をチェックし、注意が必要なものがあれば教えてください。"

**エイリアスパスワード生成:**

> "エイリアス <user@example.com> のパスワードを生成して、受信トレイにアクセスできるようにしてください。"


## 環境変数 {#environment-variables}

| 変数名                         | 必須     | デフォルト                      | 説明                                                                           |
| ------------------------------ | -------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `FORWARD_EMAIL_API_KEY`        | はい     | —                              | Forward Email APIキー（APIキーエンドポイントのBasic認証ユーザー名として使用） |
| `FORWARD_EMAIL_ALIAS_USER`     | いいえ   | —                              | メールボックスエンドポイント用のエイリアスメールアドレス（例: `user@example.com`） |
| `FORWARD_EMAIL_ALIAS_PASSWORD` | いいえ   | —                              | メールボックスエンドポイント用に生成されたエイリアスパスワード               |
| `FORWARD_EMAIL_API_URL`        | いいえ   | `https://api.forwardemail.net` | APIのベースURL（セルフホストやテスト用）                                      |


## セキュリティ {#security}

MCPサーバーはローカルのマシン上で動作します。セキュリティの仕組みは以下の通りです:

* **認証情報はローカルに留まります。** APIキーとエイリアス認証情報は環境変数から読み込まれ、HTTP Basic認証を通じてAPIリクエストの認証に使用されます。AIモデルには一切送信されません。
* **stdio通信。** サーバーはstdin/stdoutを介してAIクライアントと通信します。ネットワークポートは開放されません。
* **データ保存なし。** サーバーはステートレスで、メールデータのキャッシュ、ログ、保存は行いません。
* **オープンソース。** コードベースはすべて[GitHub](https://github.com/forwardemail/mcp-server)に公開されています。すべてのコードを監査可能です。


## プログラムによる利用 {#programmatic-usage}

サーバーはライブラリとしても使用できます:

```js
const { McpServer } = require('@forwardemail/mcp-server');

const server = new McpServer({
  apiKey: 'your-api-key',
  aliasUser: 'user@example.com',
  aliasPassword: 'generated-alias-password',
});

server.listen();
```


## オープンソース {#open-source}

Forward Email MCP Serverは[GitHubでオープンソース](https://github.com/forwardemail/mcp-server)として公開されており、BUSL-1.1ライセンスの下で提供されています。私たちは透明性を重視しています。バグを見つけた場合や機能要望がある場合は、[issueを開いてください](https://github.com/forwardemail/mcp-server/issues)。
