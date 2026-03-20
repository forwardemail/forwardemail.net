# Email API {#email-api}


## 目次 {#table-of-contents}

* [ライブラリ](#libraries)
* [ベースURI](#base-uri)
* [認証](#authentication)
  * [APIトークン認証（ほとんどのエンドポイントに推奨）](#api-token-authentication-recommended-for-most-endpoints)
  * [エイリアスクレデンシャル認証（送信メール用）](#alias-credentials-authentication-for-outbound-email)
  * [エイリアス専用エンドポイント](#alias-only-endpoints)
* [エラー](#errors)
* [ローカリゼーション](#localization)
* [ページネーション](#pagination)
* [ログ](#logs)
  * [ログの取得](#retrieve-logs)
* [アカウント](#account)
  * [アカウントの作成](#create-account)
  * [アカウントの取得](#retrieve-account)
  * [アカウントの更新](#update-account)
* [エイリアス連絡先（CardDAV）](#alias-contacts-carddav)
  * [連絡先の一覧](#list-contacts)
  * [連絡先の作成](#create-contact)
  * [連絡先の取得](#retrieve-contact)
  * [連絡先の更新](#update-contact)
  * [連絡先の削除](#delete-contact)
* [エイリアスカレンダー（CalDAV）](#alias-calendars-caldav)
  * [カレンダーの一覧](#list-calendars)
  * [カレンダーの作成](#create-calendar)
  * [カレンダーの取得](#retrieve-calendar)
  * [カレンダーの更新](#update-calendar)
  * [カレンダーの削除](#delete-calendar)
* [エイリアスメッセージ（IMAP/POP3）](#alias-messages-imappop3)
  * [メッセージの一覧と検索](#list-and-search-for-messages)
  * [メッセージの作成](#create-message)
  * [メッセージの取得](#retrieve-message)
  * [メッセージの更新](#update-message)
  * [メッセージの削除](#delete-message)
* [エイリアスフォルダー（IMAP/POP3）](#alias-folders-imappop3)
  * [フォルダーの一覧](#list-folders)
  * [フォルダーの作成](#create-folder)
  * [フォルダーの取得](#retrieve-folder)
  * [フォルダーの更新](#update-folder)
  * [フォルダーの削除](#delete-folder)
  * [フォルダーのコピー](#copy-folder)
* [送信メール](#outbound-emails)
  * [送信SMTPメールの制限取得](#get-outbound-smtp-email-limit)
  * [送信SMTPメールの一覧](#list-outbound-smtp-emails)
  * [送信SMTPメールの作成](#create-outbound-smtp-email)
  * [送信SMTPメールの取得](#retrieve-outbound-smtp-email)
  * [送信SMTPメールの削除](#delete-outbound-smtp-email)
* [ドメイン](#domains)
  * [ドメインの一覧](#list-domains)
  * [ドメインの作成](#create-domain)
  * [ドメインの取得](#retrieve-domain)
  * [ドメインレコードの検証](#verify-domain-records)
  * [ドメインSMTPレコードの検証](#verify-domain-smtp-records)
  * [ドメイン全体のキャッチオールパスワード一覧](#list-domain-wide-catch-all-passwords)
  * [ドメイン全体のキャッチオールパスワード作成](#create-domain-wide-catch-all-password)
  * [ドメイン全体のキャッチオールパスワード削除](#remove-domain-wide-catch-all-password)
  * [ドメインの更新](#update-domain)
  * [ドメインの削除](#delete-domain)
* [招待](#invites)
  * [ドメイン招待の承認](#accept-domain-invite)
  * [ドメイン招待の作成](#create-domain-invite)
  * [ドメイン招待の削除](#remove-domain-invite)
* [メンバー](#members)
  * [ドメインメンバーの更新](#update-domain-member)
  * [ドメインメンバーの削除](#remove-domain-member)
* [エイリアス](#aliases)
  * [エイリアスパスワードの生成](#generate-an-alias-password)
  * [ドメインエイリアスの一覧](#list-domain-aliases)
  * [新しいドメインエイリアスの作成](#create-new-domain-alias)
  * [ドメインエイリアスの取得](#retrieve-domain-alias)
  * [ドメインエイリアスの更新](#update-domain-alias)
  * [ドメインエイリアスの削除](#delete-domain-alias)
* [暗号化](#encrypt)
  * [TXTレコードの暗号化](#encrypt-txt-record)


## ライブラリ {#libraries}

現時点ではAPIラッパーはまだリリースしていませんが、近い将来リリースする予定です。特定のプログラミング言語のAPIラッパーがリリースされた際に通知を希望される場合は、<api@forwardemail.net> にメールを送ってください。その間は、以下の推奨HTTPリクエストライブラリをアプリケーションで使用するか、下記の例のように単に[curl](https://stackoverflow.com/a/27442239/3586413)を使用できます。

| 言語       | ライブラリ                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Ruby       | [Faraday](https://github.com/lostisland/faraday)                       |
| Python     | [requests](https://github.com/psf/requests)                            |
| Java       | [OkHttp](https://github.com/square/okhttp/)                            |
| PHP        | [guzzle](https://github.com/guzzle/guzzle)                             |
| JavaScript | [superagent](https://github.com/ladjs/superagent) (私たちがメンテナ)    |
| Node.js    | [superagent](https://github.com/ladjs/superagent) (私たちがメンテナ)    |
| Go         | [net/http](https://golang.org/pkg/net/http/)                           |
| .NET       | [RestSharp](https://github.com/restsharp/RestSharp)                    |
## Base URI {#base-uri}

現在のHTTPベースURIパスは次のとおりです：`BASE_URI`。


## Authentication {#authentication}

すべてのエンドポイントは[Basic Authorization](https://en.wikipedia.org/wiki/Basic_access_authentication)を使用した認証が必要です。認証方法は2つあります：

### API Token Authentication (ほとんどのエンドポイントに推奨) {#api-token-authentication-recommended-for-most-endpoints}

[APIキー](https://forwardemail.net/my-account/security)を「ユーザー名」値として設定し、パスワードは空にします：

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

APIトークンの後のコロン（`:`）に注意してください。これはBasic認証形式でパスワードが空であることを示します。

### Alias Credentials Authentication (送信メール用) {#alias-credentials-authentication-for-outbound-email}

[送信SMTPメール作成](#create-outbound-smtp-email)エンドポイントは、エイリアスメールアドレスと[生成されたエイリアスパスワード](/faq#do-you-support-receiving-email-with-imap)を使用した認証もサポートしています：

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@yourdomain.com:your_generated_password" \
  -d "to=recipient@example.com" \
  -d "subject=Hello" \
  -d "text=Test email"
```

この方法は、すでにSMTP認証情報を使用しているアプリケーションからメールを送信する際に便利で、SMTPからAPIへの移行をシームレスにします。

### Alias-Only Endpoints {#alias-only-endpoints}

[Alias Contacts](#alias-contacts-carddav)、[Alias Calendars](#alias-calendars-caldav)、[Alias Messages](#alias-messages-imappop3)、および[Alias Folders](#alias-folders-imappop3)エンドポイントはエイリアス認証情報が必要で、APIトークン認証はサポートしていません。

ご心配なく — 何かわからない場合は以下に例を示しています。


## Errors {#errors}

エラーが発生した場合、APIリクエストのレスポンスボディに詳細なエラーメッセージが含まれます。

| Code | Name                  |
| ---- | --------------------- |
| 200  | OK                    |
| 400  | 不正なリクエスト       |
| 401  | 認証エラー             |
| 403  | 禁止                   |
| 404  | 見つかりません         |
| 429  | リクエスト過多         |
| 500  | サーバー内部エラー     |
| 501  | 未実装                 |
| 502  | バッドゲートウェイ     |
| 503  | サービス利用不可       |
| 504  | ゲートウェイタイムアウト |

> \[!TIP]
> 5xxステータスコードを受け取った場合（通常は発生しません）、<a href="mailto:api@forwardemail.net"><api@forwardemail.net></a>までご連絡ください。すぐに問題解決をお手伝いします。


## Localization {#localization}

当サービスは25以上の言語に翻訳されています。すべてのAPIレスポンスメッセージは、APIリクエストを行うユーザーの最後に検出されたロケールに翻訳されます。カスタムの`Accept-Language`ヘッダーを渡すことでこれを上書きできます。このページ下部の言語ドロップダウンでぜひお試しください。


## Pagination {#pagination}

> \[!NOTE]
> 2024年11月1日以降、[ドメイン一覧](#list-domains)および[ドメインエイリアス一覧](#list-domain-aliases)のAPIエンドポイントは、1ページあたりの最大結果数がデフォルトで`1000`になります。これを早期に適用したい場合は、エンドポイントのURLに追加のクエリ文字列パラメータとして`?paginate=true`を渡してください。

ページネーションは結果を一覧表示するすべてのAPIエンドポイントでサポートされています。

クエリ文字列の`page`（および任意で`limit`）を指定してください。

`page`は`1`以上の数値である必要があります。`limit`を指定する場合（これも数値）は、最小値が`10`、最大値が`50`です（特に記載がない限り）。

| クエリ文字列パラメータ | 必須 | 型     | 説明                                                                                                                                                     |
| --------------------- | ---- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page`                | いいえ | 数値   | 返す結果のページ。指定しない場合、`page`の値は`1`になります。`1`以上の数値である必要があります。                                                       |
| `limit`               | いいえ | 数値   | 1ページあたりの結果数。指定しない場合はデフォルトで`10`。`1`以上かつ`50`以下の数値である必要があります。                                               |
より多くの結果が利用可能かどうかを判断するために、これらのHTTPレスポンスヘッダーを提供しています（プログラムでページネーションを行うために解析できます）：

| HTTP Response Header | Example                                                                                                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `X-Page-Count`       | `X-Page-Count: 3`                                                                                                                                                                                                                                        | 利用可能な総ページ数。                                                                                                                                                                                                                                                                                                                                             |
| `X-Page-Current`     | `X-Page-Current: 1`                                                                                                                                                                                                                                      | 返された結果の現在のページ（例：`page`クエリ文字列パラメータに基づく）。                                                                                                                                                                                                                                                                                           |
| `X-Page-Size`        | `X-Page-Size: 10`                                                                                                                                                                                                                                        | 返されたページ内の結果の総数（例：`limit`クエリ文字列パラメータおよび実際に返された結果に基づく）。                                                                                                                                                                                                                                                               |
| `X-Item-Count`       | `X-Item-Count: 30`                                                                                                                                                                                                                                       | すべてのページにわたる利用可能なアイテムの総数。                                                                                                                                                                                                                                                                                                                  |
| `Link`               | `Link: <https://api.forwardemail.net/v1/emails?page=1>; rel="prev", <https://api.forwardemail.net/v1/emails?page=3>; rel="next", <https://api.forwardemail.net/v1/emails?page=3; rel="last", https://api.forwardemail.net/v1/emails?page=1; rel="first"` | 例のように解析できる`Link` HTTPレスポンスヘッダーを提供しています。これは[GitHubに似ています](https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api#using-link-headers)（例：関連性がないか利用できない場合はすべての値が提供されるわけではありません。例えば、次のページがない場合は`"next"`は提供されません）。 |
> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?page=2&pagination=true \
  -u API_TOKEN:
```


## ログ {#logs}

### ログの取得 {#retrieve-logs}

当社のAPIは、アカウントのログをプログラム的にダウンロードすることを可能にします。このエンドポイントにリクエストを送信すると、アカウントのすべてのログが処理され、完了後に添付ファイル（[Gzip](https://en.wikipedia.org/wiki/Gzip)圧縮された[CSV](https://en.wikipedia.org/wiki/Comma-separated_values)スプレッドシートファイル）としてメールで送信されます。

これにより、[Cronジョブ](https://en.wikipedia.org/wiki/Cron)や当社の[Node.jsジョブスケジューリングソフトウェアBree](https://github.com/breejs/bree)を使用してバックグラウンドジョブを作成し、必要なときにログを受け取ることができます。なお、このエンドポイントは1日あたり`10`リクエストに制限されています。

添付ファイル名は小文字の`email-deliverability-logs-YYYY-MM-DD-h-mm-A-z.csv.gz`形式で、メール本文には取得したログの簡単な概要が含まれています。また、[マイアカウント → ログ](/my-account/logs)からいつでもログをダウンロードできます。

> `GET /v1/logs/download`

| クエリ文字列パラメータ | 必須 | 型            | 説明                                                                                                                         |
| --------------------- | ---- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `domain`              | いいえ | 文字列 (FQDN) | 完全修飾ドメイン名（FQDN）でログをフィルタリングします。指定しない場合はすべてのドメインのログが取得されます。               |
| `q`                   | いいえ | 文字列        | メール、ドメイン、エイリアス名、IPアドレス、または日付（`M/Y`、`M/D/YY`、`M-D`、`M-D-YY`、`M.D.YY`形式）でログを検索します。 |
| `bounce_category`     | いいえ | 文字列        | 特定のバウンスカテゴリ（例：`blocklist`）でログを検索します。                                                               |
| `response_code`       | いいえ | 数値          | 特定のエラー応答コード（例：`421`や`550`）でログを検索します。                                                               |

> Example Request:

```sh
curl BASE_URI/v1/logs/download \
  -u API_TOKEN:
```

> Cronジョブの例（毎日深夜）:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download -u API_TOKEN: &>/dev/null
```

Cronジョブの式の構文を検証するには、[Crontab.guru](https://crontab.guru/)などのサービスを利用できます。

> Cronジョブの例（毎日深夜、**前日のログ付き**）:

MacOSの場合:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date -v-1d -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```

LinuxおよびUbuntuの場合:

```sh
0 0 * * * /usr/bin/curl BASE_URI/v1/logs/download?q=`date --date "-1 days" -u "+%-m/%-d/%y"` -u API_TOKEN: &>/dev/null
```


## アカウント {#account}

### アカウントの作成 {#create-account}

> `POST /v1/account`

| ボディパラメータ | 必須 | 型             | 説明           |
| -------------- | ---- | -------------- | -------------- |
| `email`        | はい | 文字列 (メール) | メールアドレス |
| `password`     | はい | 文字列         | パスワード     |

> Example Request:

```sh
curl -X POST BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```

### アカウントの取得 {#retrieve-account}

> `GET /v1/account`

> Example Request:

```sh
curl BASE_URI/v1/account \
  -u API_TOKEN:
```

### アカウントの更新 {#update-account}

> `PUT /v1/account`

| ボディパラメータ | 必須 | 型             | 説明               |
| -------------- | ---- | -------------- | ------------------ |
| `email`        | いいえ | 文字列 (メール) | メールアドレス     |
| `given_name`   | いいえ | 文字列         | 名                 |
| `family_name`  | いいえ | 文字列         | 姓                 |
| `avatar_url`   | いいえ | 文字列 (URL)   | アバター画像のリンク |

> Example Request:

```sh
curl -X PUT BASE_URI/v1/account \
  -u API_TOKEN: \
  -d "email=EMAIL"
```


## エイリアス連絡先 (CardDAV) {#alias-contacts-carddav}

> \[!NOTE]
> 他のAPIエンドポイントとは異なり、これらは[認証](#authentication)で「ユーザー名」をエイリアスのユーザー名、「パスワード」をエイリアス生成パスワードとし、Basic認証ヘッダーとして送信する必要があります。
> \[!WARNING]
> このエンドポイントセクションは現在作業中で、（できれば）2024年にリリース予定です。 それまでの間は、当社ウェブサイトのナビゲーションにある「Apps」ドロップダウンからIMAPクライアントをご利用ください。

### 連絡先一覧 {#list-contacts}

> `GET /v1/contacts`

**近日公開予定**

### 連絡先作成 {#create-contact}

> `POST /v1/contacts`

**近日公開予定**

### 連絡先取得 {#retrieve-contact}

> `GET /v1/contacts/:id`

**近日公開予定**

### 連絡先更新 {#update-contact}

> `PUT /v1/contacts/:id`

**近日公開予定**

### 連絡先削除 {#delete-contact}

> `DELETE /v1/contacts/:id`

**近日公開予定**


## エイリアスカレンダー（CalDAV） {#alias-calendars-caldav}

> \[!NOTE]
> 他のAPIエンドポイントとは異なり、これらは[認証](#authentication)で「username」にエイリアスのユーザー名、「password」にエイリアス生成パスワードをBasic認証ヘッダーとして指定する必要があります。

> \[!WARNING]
> このエンドポイントセクションは現在作業中で、（できれば）2024年にリリース予定です。 それまでの間は、当社ウェブサイトのナビゲーションにある「Apps」ドロップダウンからIMAPクライアントをご利用ください。

### カレンダー一覧 {#list-calendars}

> `GET /v1/calendars`

**近日公開予定**

### カレンダー作成 {#create-calendar}

> `POST /v1/calendars`

**近日公開予定**

### カレンダー取得 {#retrieve-calendar}

> `GET /v1/calendars/:id`

**近日公開予定**

### カレンダー更新 {#update-calendar}

> `PUT /v1/calendars/:id`

**近日公開予定**

### カレンダー削除 {#delete-calendar}

> `DELETE /v1/calendars/:id`

**近日公開予定**


## エイリアスメッセージ（IMAP/POP3） {#alias-messages-imappop3}

> \[!NOTE]
> 他のAPIエンドポイントとは異なり、これらは[認証](#authentication)で「username」にエイリアスのユーザー名、「password」にエイリアス生成パスワードをBasic認証ヘッダーとして指定する必要があります。

> \[!WARNING]
> このエンドポイントセクションは現在作業中で、（できれば）2024年にリリース予定です。 それまでの間は、当社ウェブサイトのナビゲーションにある「Apps」ドロップダウンからIMAPクライアントをご利用ください。

ドメインのセットアップ手順を必ずご確認ください。

これらの手順はFAQセクションの[IMAPでのメール受信をサポートしていますか？](/faq#do-you-support-receiving-email-with-imap)に記載されています。

### メッセージ一覧および検索 {#list-and-search-for-messages}

> `GET /v1/messages`

**近日公開予定**

### メッセージ作成 {#create-message}

> \[!NOTE]
> これはメールを**送信しません**。単にメッセージをメールボックスフォルダに追加するだけです（例：IMAPの`APPEND`コマンドに似ています）。メールを送信したい場合は、下記の[送信SMTPメール作成](#create-outbound-smtp-email)をご覧ください。送信SMTPメールを作成後、このエンドポイントを使ってエイリアスのメールボックスにコピーを追加し保存できます。

> `POST /v1/messages`

**近日公開予定**

### メッセージ取得 {#retrieve-message}

> `GET /v1/messages/:id`

**近日公開予定**

### メッセージ更新 {#update-message}

> `PUT /v1/messages/:id`

**近日公開予定**

### メッセージ削除 {#delete-message}

> `DELETE /v1/messages:id`

**近日公開予定**


## エイリアスフォルダ（IMAP/POP3） {#alias-folders-imappop3}

> \[!TIP]
> フォルダのパスを使うエンドポイント <code>/v1/folders/:path</code> は、フォルダID <code>:id</code> と互換性があります。つまり、フォルダは<code>path</code>または<code>id</code>のどちらでも指定可能です。

> \[!WARNING]
> このエンドポイントセクションは現在作業中で、（できれば）2024年にリリース予定です。 それまでの間は、当社ウェブサイトのナビゲーションにある「Apps」ドロップダウンからIMAPクライアントをご利用ください。

### フォルダ一覧 {#list-folders}

> `GET /v1/folders`

**近日公開予定**

### フォルダ作成 {#create-folder}

> `POST /v1/folders`

**近日公開予定**

### フォルダ取得 {#retrieve-folder}

> `GET /v1/folders/:id`

**近日公開予定**

### フォルダ更新 {#update-folder}

> `PUT /v1/folders/:id`

**近日公開予定**

### フォルダ削除 {#delete-folder}

> `DELETE /v1/folders/:id`

**近日公開予定**

### フォルダコピー {#copy-folder}

> `POST /v1/folders/:id/copy`

**近日公開予定**


## 送信メール {#outbound-emails}

ドメインのセットアップ手順を必ずご確認ください。

これらの手順は[マイアカウント → ドメイン → 設定 → 送信SMTP設定](/my-account/domains)に記載されています。送信SMTPでドメインを使用するには、DKIM、Return-Path、DMARCの設定が必要です。
### アウトバウンドSMTPメールの制限取得 {#get-outbound-smtp-email-limit}

これは、アカウントごとの1日あたりのSMTPアウトバウンドメッセージ数の `count` と `limit` を含むJSONオブジェクトを返すシンプルなエンドポイントです。

> `GET /v1/emails/limit`

> リクエスト例:

```sh
curl BASE_URI/v1/emails/limit \
  -u API_TOKEN:
```

### アウトバウンドSMTPメール一覧 {#list-outbound-smtp-emails}

このエンドポイントは、メールの `message`、`headers`、および `rejectedErrors` のプロパティ値を返しません。

それらのプロパティと値を取得するには、メールIDを使って [メール取得](#retrieve-email) エンドポイントを使用してください。

> `GET /v1/emails`

| クエリ文字列パラメータ | 必須 | 型                        | 説明                                                                                                                                               |
| --------------------- | ---- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | いいえ | 文字列（正規表現対応）     | メタデータによるメール検索                                                                                                                        |
| `domain`              | いいえ | 文字列（正規表現対応）     | ドメイン名によるメール検索                                                                                                                        |
| `sort`                | いいえ | 文字列                    | 特定フィールドでのソート（フィールドの前に単一のハイフン `-` を付けると逆順ソート）。未設定の場合は `created_at` がデフォルト。                    |
| `page`                | いいえ | 数値                      | 詳細は [ページネーション](#pagination) を参照                                                                                                   |
| `limit`               | いいえ | 数値                      | 詳細は [ページネーション](#pagination) を参照                                                                                                   |

> リクエスト例:

```sh
curl BASE_URI/v1/emails?limit=1 \
  -u API_TOKEN:
```

### アウトバウンドSMTPメール作成 {#create-outbound-smtp-email}

メール作成用APIは Nodemailer のメッセージオプション設定に触発されており、それを活用しています。以下の本文パラメータについては [Nodemailer メッセージ設定](https://nodemailer.com/message/) を参照してください。

`envelope` と `dkim`（自動設定されるため）を除き、すべての Nodemailer オプションをサポートしています。セキュリティのために `disableFileAccess` と `disableUrlAccess` オプションは自動的に `true` に設定されます。

ヘッダーを含む生の完全なメールを `raw` オプションで渡すか、以下の個別の本文パラメータを渡してください。

このAPIはヘッダー内に絵文字があれば自動的にエンコードします（例：`Subject: 🤓 Hello` は自動的に `Subject: =?UTF-8?Q?=F0=9F=A4=93?= Hello` に変換されます）。開発者に優しく、ミスを防ぐメールAPIを目指しています。

**認証:** このエンドポイントは [APIトークン認証](#api-token-authentication-recommended-for-most-endpoints) と [エイリアス認証](#alias-credentials-authentication-for-outbound-email) の両方をサポートしています。詳細は上記の [認証](#authentication) セクションを参照してください。

> `POST /v1/emails`

| 本文パラメータ       | 必須 | 型                | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | ---- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`               | いいえ | 文字列（メール）   | 送信者のメールアドレス（ドメインのエイリアスとして存在する必要があります）。                                                                                                                                                                                                                                                                                                                                                                              |
| `to`                 | いいえ | 文字列または配列  | "To" ヘッダーの受信者のカンマ区切りリストまたは配列。                                                                                                                                                                                                                                                                                                                                                                                                      |
| `cc`                 | いいえ | 文字列または配列  | "Cc" ヘッダーの受信者のカンマ区切りリストまたは配列。                                                                                                                                                                                                                                                                                                                                                                                                      |
| `bcc`                | いいえ | 文字列または配列  | "Bcc" ヘッダーの受信者のカンマ区切りリストまたは配列。                                                                                                                                                                                                                                                                                                                                                                                                     |
| `subject`            | いいえ | 文字列            | メールの件名。                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `text`               | いいえ | 文字列またはバッファ | メッセージのプレーンテキスト版。                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `html`               | いいえ | 文字列またはバッファ | メッセージのHTML版。                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `attachments`        | いいえ | 配列              | 添付ファイルオブジェクトの配列（[Nodemailerの共通フィールド](https://nodemailer.com/message/#common-fields)を参照）。                                                                                                                                                                                                                                                                                                                                        |
| `sender`             | いいえ | 文字列            | "Sender" ヘッダーのメールアドレス（[Nodemailerの高度なフィールド](https://nodemailer.com/message/#more-advanced-fields)を参照）。                                                                                                                                                                                                                                                                                                                           |
| `replyTo`            | いいえ | 文字列            | "Reply-To" ヘッダーのメールアドレス。                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `inReplyTo`          | いいえ | 文字列            | メッセージが返信している Message-ID。                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `references`         | いいえ | 文字列または配列  | スペース区切りリストまたは Message-ID の配列。                                                                                                                                                                                                                                                                                                                                                                                                               |
| `attachDataUrls`     | いいえ | ブール値          | `true` の場合、メッセージのHTML内の `data:` 画像を埋め込み添付ファイルに変換します。                                                                                                                                                                                                                                                                                                                                                                         |
| `watchHtml`          | いいえ | 文字列            | Apple Watch専用のHTML版メッセージ（[Nodemailerドキュメント](https://nodemailer.com/message/#content-options)によると、最新のウォッチでは設定不要）。                                                                                                                                                                                                                                                                                                      |
| `amp`                | いいえ | 文字列            | AMP4EMAIL専用のHTML版メッセージ（[Nodemailerの例](https://nodemailer.com/message/#amp-example)を参照）。                                                                                                                                                                                                                                                                                                                                                       |
| `icalEvent`          | いいえ | オブジェクト      | 代替メッセージコンテンツとして使用するiCalendarイベント（[Nodemailerのカレンダーイベント](https://nodemailer.com/message/calendar-events/)を参照）。                                                                                                                                                                                                                                                                                                       |
| `alternatives`       | いいえ | 配列              | 代替メッセージコンテンツの配列（[Nodemailerの代替コンテンツ](https://nodemailer.com/message/alternatives/)を参照）。                                                                                                                                                                                                                                                                                                                                          |
| `encoding`           | いいえ | 文字列            | テキストおよびHTML文字列のエンコーディング（デフォルトは `"utf-8"`、`"hex"` と `"base64"` もサポート）。                                                                                                                                                                                                                                                                                                                                                   |
| `raw`                | いいえ | 文字列またはバッファ | Nodemailerで生成されるものではなくカスタム生成されたRFC822形式のメッセージ（[Nodemailerのカスタムソース](https://nodemailer.com/message/custom-source/)を参照）。                                                                                                                                                                                                                                                                                           |
| `textEncoding`       | いいえ | 文字列            | テキスト値に強制的に使用するエンコーディング（`"quoted-printable"` または `"base64"`）。デフォルトは検出された最適値（ASCIIの場合は `"quoted-printable"`）。                                                                                                                                                                                                                                                                                           |
| `priority`           | いいえ | 文字列            | メールの優先度（`"high"`、`"normal"`（デフォルト）、または `"low"`）。`"normal"` は優先度ヘッダーを設定しません（デフォルト動作）。`"high"` または `"low"` の場合は `X-Priority`、`X-MSMail-Priority`、`Importance` ヘッダーが[適切に設定されます](https://github.com/nodemailer/nodemailer/blob/19fce2dc4dcb83224acaf1cfc890d08126309594/lib/mailer/mail-message.js#L222-L240)。 |
| `headers`            | いいえ | オブジェクトまたは配列 | 追加のヘッダーフィールドのオブジェクトまたは配列（[Nodemailerのカスタムヘッダー](https://nodemailer.com/message/custom-headers/)を参照）。                                                                                                                                                                                                                                                                                                                |
| `messageId`          | いいえ | 文字列            | "Message-ID" ヘッダーのオプションのMessage-ID値（未設定の場合は自動生成されます。値は[RFC2822仕様](https://stackoverflow.com/a/4031705)に準拠する必要があります）。                                                                                                                                                                                                                                                                                         |
| `date`               | いいえ | 文字列または日付  | 解析後にDateヘッダーがない場合に使用されるオプションの日時値。未設定の場合は現在のUTC日時文字列が使用されます。日付ヘッダーは現在時刻より30日以上先であってはなりません。                                                                                                                                                                                                                                                                               |
| `list`               | いいえ | オブジェクト      | `List-*` ヘッダーのオプションオブジェクト（[Nodemailerのリストヘッダー](https://nodemailer.com/message/list-headers/)を参照）。                                                                                                                                                                                                                                                                                                                              |
> 例リクエスト（APIトークン）:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 例リクエスト（エイリアスクレデンシャル）:

```sh
curl -X POST BASE_URI/v1/emails \
  -u "alias@DOMAIN_NAME:GENERATED_PASSWORD" \
  -d "from=alias@DOMAIN_NAME" \
  -d "to=EMAIL" \
  -d "subject=test" \
  -d "text=test"
```

> 例リクエスト（Rawメール）:

```sh
curl -X POST BASE_URI/v1/emails \
  -u API_TOKEN: \
  -d "raw=`cat file.eml`"
```

### アウトバウンドSMTPメールの取得 {#retrieve-outbound-smtp-email}

> `GET /v1/emails/:id`

> 例リクエスト:

```sh
curl BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```

### アウトバウンドSMTPメールの削除 {#delete-outbound-smtp-email}

メールの削除は、現在のステータスが `"pending"`、`"queued"`、または `"deferred"` のいずれかの場合に限り、ステータスを `"rejected"` に設定し（その後キューで処理されません）、実行されます。メールは作成または送信後30日経過すると自動的に削除される場合があります。そのため、クライアント、データベース、またはアプリケーションにアウトバウンドSMTPメールのコピーを保持することを推奨します。必要に応じて、[Create email](#create-email) および [Retrieve email](#retrieve-email) エンドポイントの両方から返されるメールID値をデータベースで参照できます。

> `DELETE /v1/emails/:id`

> 例リクエスト:

```sh
curl -X DELETE BASE_URI/v1/emails/:id \
  -u API_TOKEN:
```


## ドメイン {#domains}

> \[!TIP]
> ドメインの名前を使ったエンドポイント <code>/v1/domains/:domain_name</code> は、ドメインID <code>:domain_id</code> を使ったものと相互に置き換え可能です。つまり、ドメインは <code>name</code> または <code>id</code> のいずれかの値で参照できます。

### ドメイン一覧取得 {#list-domains}

> \[!NOTE]
> 2024年11月1日以降、[List domains](#list-domains) および [List domain aliases](#list-domain-aliases) のAPIエンドポイントは、ページあたりの最大結果数がデフォルトで `1000` になります。これを早期に適用したい場合は、エンドポイントのURLに追加のクエリ文字列パラメータとして `?paginate=true` を渡すことができます。詳細は [Pagination](#pagination) を参照してください。

> `GET /v1/domains`

| クエリ文字列パラメータ | 必須 | 型                         | 説明                                                                                                                                               |
| --------------------- | ---- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | いいえ | 文字列（正規表現対応）      | ドメイン名で検索                                                                                                                                   |
| `name`                | いいえ | 文字列（正規表現対応）      | ドメイン名で検索                                                                                                                                   |
| `sort`                | いいえ | 文字列                     | 特定のフィールドでソート（フィールド名の前にハイフン `-` を付けると逆順でソート）。未指定の場合は `created_at` がデフォルト。                     |
| `page`                | いいえ | 数値                       | 詳細は [Pagination](#pagination) を参照                                                                                                         |
| `limit`               | いいえ | 数値                       | 詳細は [Pagination](#pagination) を参照                                                                                                         |

> 例リクエスト:

```sh
curl BASE_URI/v1/domains \
  -u API_TOKEN:
```

### ドメイン作成 {#create-domain}

> `POST /v1/domains`

| ボディパラメータ                 | 必須 | 型                                            | 説明                                                                                                                                                                                                                                                                                                               |
| ------------------------------ | ---- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `domain`                       | はい | 文字列（FQDNまたはIP）                        | 完全修飾ドメイン名（"FQDN"）またはIPアドレス                                                                                                                                                                                                                                                                      |
| `team_domain`                  | いいえ | 文字列（ドメインIDまたはドメイン名；FQDN）   | このドメインを別のドメインと同じチームに自動割り当てします。これにより、このドメインのすべてのメンバーがチームメンバーとして割り当てられ、`plan` は自動的に `team` に設定されます。必要に応じて `"none"` に設定して明示的に無効化できますが、通常は不要です。                                         |
| `plan`                         | いいえ | 文字列（列挙型）                             | プランタイプ（`"free"`、`"enhanced_protection"`、または `"team"` のいずれかでなければならず、デフォルトは `"free"` またはユーザーの現在の有料プラン）                                                                                                                                                             |
| `catchall`                     | いいえ | 文字列（区切られたメールアドレス）またはブール値 | デフォルトのキャッチオールエイリアスを作成します。デフォルトは `true`（`true` の場合はAPIユーザーのメールアドレスを受信者として使用し、`false` の場合はキャッチオールを作成しません）。文字列が渡された場合は、改行、スペース、および/またはカンマで区切られた受信者メールアドレスのリストとして扱います。                   |
| `has_adult_content_protection` | いいえ | ブール値                                       | このドメインでスパムスキャナーの成人向けコンテンツ保護を有効にするかどうか                                                                                                                                                                                                                                         |
| `has_phishing_protection`      | いいえ | ブール値                                       | このドメインでスパムスキャナーのフィッシング保護を有効にするかどうか                                                                                                                                                                                                                                              |
| `has_executable_protection`    | いいえ | ブール値                                       | このドメインでスパムスキャナーの実行可能ファイル保護を有効にするかどうか                                                                                                                                                                                                                                            |
| `has_virus_protection`         | いいえ | ブール値                                       | このドメインでスパムスキャナーのウイルス保護を有効にするかどうか                                                                                                                                                                                                                                                   |
| `has_recipient_verification`   | いいえ | ブール値                                       | エイリアス受信者がメールを通過させるためにメール検証リンクをクリックする必要があるかどうかのグローバルドメインデフォルト                                                                                                                                                                                         |
| `ignore_mx_check`              | いいえ | ブール値                                       | ドメインの検証においてMXレコードチェックを無視するかどうか。主に高度なMX交換設定ルールを持ち、既存のMX交換を維持しつつ当社のものに転送する必要があるユーザー向け。                                                                                                                                               |
| `retention_days`               | いいえ | 数値                                           | 成功裏に配信されたか永久的にエラーとなったアウトバウンドSMTPメールを保存する保持日数（0〜30の整数）。デフォルトは `0` で、これはアウトバウンドSMTPメールが即座に削除および編集されることを意味します（セキュリティのため）。                                                                                   |
| `bounce_webhook`               | いいえ | 文字列（URL）またはブール値（false）          | バウンスWebhookを送信するための任意の `http://` または `https://` のWebhook URL。アウトバウンドSMTPの失敗（ソフトまたはハード失敗など）に関する情報をこのURLに `POST` リクエストで送信し、購読者管理やアウトバウンドメールのプログラム的管理が可能になります。                                                        |
| `max_quota_per_alias`          | いいえ | 文字列                                         | このドメイン名のエイリアスに対するストレージ最大クォータ。`"1 GB"` のような値を入力し、[bytes](https://github.com/visionmedia/bytes.js) によって解析されます。                                                                                                                                                   |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains \
  -u API_TOKEN: \
  -d domain=DOMAIN_NAME \
  -d plan=free
```

### ドメインの取得 {#retrieve-domain}

> `GET /v1/domains/DOMAIN_NAME`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### ドメインレコードの検証 {#verify-domain-records}

> `GET /v1/domains/DOMAIN_NAME/verify-records`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-records \
  -u API_TOKEN:
```

### ドメインのSMTPレコードの検証 {#verify-domain-smtp-records}

> `GET /v1/domains/DOMAIN_NAME/verify-smtp`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/verify-smtp \
  -u API_TOKEN:
```

### ドメイン全体のキャッチオールパスワード一覧 {#list-domain-wide-catch-all-passwords}

> `GET /v1/domains/DOMAIN_NAME/catch-all-passwords`

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### ドメイン全体のキャッチオールパスワードの作成 {#create-domain-wide-catch-all-password}

> `POST /v1/domains/DOMAIN_NAME/catch-all-passwords`

| Body Parameter | 必須 | タイプ | 説明                                                                                                                                                                                                                     |
| -------------- | ---- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password` | いいえ | String | ドメイン全体のキャッチオールパスワードとして使用するカスタムの新しいパスワード。APIリクエストボディから空白または未指定にすると、ランダムで強力なパスワードが生成されます。                                                                                   |
| `description`  | いいえ | String | 組織の目的での説明のみ。                                                                                                                                                                                                 |

> Example Request:

```sh
curl BASE_URL/v1/domains/DOMAIN_NAME/catch-all-passwords \
  -u API_TOKEN:
```

### ドメイン全体のキャッチオールパスワードの削除 {#remove-domain-wide-catch-all-password}

> `DELETE /v1/domains/DOMAIN_NAME/catch-all-passwords/:token_id`

> Example Request:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/catch-all-passwords/:token_id \
  -u API_TOKEN:
```

### ドメインの更新 {#update-domain}

> `PUT /v1/domains/DOMAIN_NAME`

| Body Parameter                 | 必須 | タイプ                         | 説明                                                                                                                                                                                                                                                                                       |
| ------------------------------ | ---- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `smtp_port`                    | いいえ | String または Number           | SMTP転送用に設定するカスタムポート（デフォルトは `"25"`）                                                                                                                                                                                                                                |
| `has_adult_content_protection` | いいえ | Boolean                       | このドメインでスパムスキャナーの成人向けコンテンツ保護を有効にするかどうか                                                                                                                                                                                                                 |
| `has_phishing_protection`      | いいえ | Boolean                       | このドメインでスパムスキャナーのフィッシング保護を有効にするかどうか                                                                                                                                                                                                                      |
| `has_executable_protection`    | いいえ | Boolean                       | このドメインでスパムスキャナーの実行可能ファイル保護を有効にするかどうか                                                                                                                                                                                                                  |
| `has_virus_protection`         | いいえ | Boolean                       | このドメインでスパムスキャナーのウイルス保護を有効にするかどうか                                                                                                                                                                                                                          |
| `has_recipient_verification`   | いいえ | Boolean                       | エイリアス受信者がメールの流通のためにメール検証リンクをクリックする必要があるかどうかのグローバルドメインデフォルト設定                                                                                                                                                                   |
| `ignore_mx_check`              | いいえ | Boolean                       | ドメインの検証時にMXレコードチェックを無視するかどうか。これは主に高度なMX交換設定ルールを持ち、既存のMX交換を維持して当社のものに転送する必要があるユーザー向けです。                                                                                                            |
| `retention_days`               | いいえ | Number                        | 配信成功または永久エラーとなった後に送信SMTPメールを保存する保持日数を表す `0` から `30` の整数。デフォルトは `0` で、送信SMTPメールは即座に削除および編集されてセキュリティが保たれます。                                                                                     |
| `bounce_webhook`               | いいえ | String (URL) または Boolean (false) | バウンスWebhookを送信するための任意の `http://` または `https://` のWebhook URL。送信SMTPの失敗（ソフトまたはハード失敗など）に関する情報をこのURLに `POST` リクエストで送信し、購読者の管理や送信メールのプログラム的管理が可能になります。                                         |
| `max_quota_per_alias`          | いいえ | String                        | このドメイン名のエイリアスに対する最大ストレージクォータ。 "1 GB" のような値を入力すると、[bytes](https://github.com/visionmedia/bytes.js) によって解析されます。                                                                                                                   |
> 例のリクエスト:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME \
  -u API_TOKEN:
```

### ドメインを削除 {#delete-domain}

> `DELETE /v1/domains/:domain_name`

> 例のリクエスト:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name \
  -u API_TOKEN:
```


## 招待 {#invites}

### ドメイン招待を承認 {#accept-domain-invite}

> `GET /v1/domains/:domain_name/invites`

> 例のリクエスト:

```sh
curl BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```

### ドメイン招待を作成 {#create-domain-invite}

> `POST /v1/domains/DOMAIN_NAME/invites`

| Body Parameter | 必須 | タイプ               | 説明                                                                                      |
| -------------- | ---- | -------------------- | ----------------------------------------------------------------------------------------- |
| `email`        | はい | 文字列 (メールアドレス) | ドメインメンバーリストに招待するメールアドレス                                           |
| `group`        | はい | 文字列 (列挙可能)    | ユーザーをドメインメンバーシップに追加するグループ（`"admin"` または `"user"` のいずれか） |

> 例のリクエスト:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/invites \
  -u API_TOKEN: \
  -d "email=EMAIL" \
  -d group=admin
```

> \[!IMPORTANT]
> 招待されるユーザーがすでに管理者が所属する他のドメインの承認済みメンバーである場合、招待は自動承認され、メールは送信されません。

### ドメイン招待を削除 {#remove-domain-invite}

> `DELETE /v1/domains/:domain_name/invites`

| Body Parameter | 必須 | タイプ           | 説明                                  |
| -------------- | ---- | ---------------- | ------------------------------------- |
| `email`        | はい | 文字列 (メールアドレス) | ドメインメンバーリストから削除するメールアドレス |

> 例のリクエスト:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/invites \
  -u API_TOKEN:
```


## メンバー {#members}

### ドメインメンバーを更新 {#update-domain-member}

> `PUT /v1/domains/DOMAIN_NAME/members/MEMBER_ID`

| Body Parameter | 必須 | タイプ               | 説明                                                                                      |
| -------------- | ---- | -------------------- | ----------------------------------------------------------------------------------------- |
| `group`        | はい | 文字列 (列挙可能)    | ユーザーをドメインメンバーシップに更新するグループ（`"admin"` または `"user"` のいずれか） |

> 例のリクエスト:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/members/MEMBER_ID \
  -u API_TOKEN:
```

### ドメインメンバーを削除 {#remove-domain-member}

> `DELETE /v1/domains/:domain_name/members/:member_id`

> 例のリクエスト:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/members/:member_id \
  -u API_TOKEN:
```


## エイリアス {#aliases}

### エイリアスパスワードを生成 {#generate-an-alias-password}

メールで指示を送らない場合、ユーザー名とパスワードは成功したリクエストのJSONレスポンスボディに `{ username: 'alias@yourdomain.com', password: 'some-generated-password' }` の形式で含まれます。

> `POST /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password`

| Body Parameter         | 必須 | タイプ   | 説明                                                                                                                                                                                                                                                                                             |
| ---------------------- | ---- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `new_password`         | いいえ | 文字列   | エイリアスに使用するカスタム新パスワード。APIリクエストボディから空白または未指定にすると、ランダムで強力なパスワードが生成されます。                                                                                                                    |
| `password`             | いいえ | 文字列   | 既存のエイリアスパスワード。既存のIMAPメールボックスストレージを削除せずにパスワードを変更する場合に使用します（既存のパスワードがわからない場合は下記の `is_override` オプションを参照してください）。                                                                                  |
| `is_override`          | いいえ | ブール値 | **注意して使用してください**: 既存のエイリアスパスワードとデータベースを完全に上書きし、既存のIMAPストレージを永久に削除し、エイリアスのSQLiteメールデータベースを完全にリセットします。既存のメールボックスがある場合は可能な限りバックアップを取ってください。                                         |
| `emailed_instructions` | いいえ | 文字列   | エイリアスのパスワードとセットアップ手順を送信するメールアドレス。                                                                                                                                                                                                                              |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID/generate-password \
  -u API_TOKEN:
```

### ドメインエイリアス一覧 {#list-domain-aliases}

> \[!NOTE]
> 2024年11月1日以降、[ドメイン一覧](#list-domains)および[ドメインエイリアス一覧](#list-domain-aliases)のAPIエンドポイントは、1ページあたりの最大結果数がデフォルトで`1000`になります。 この動作を早期に適用したい場合は、エンドポイントのURLに追加のクエリ文字列パラメータとして`?paginate=true`を渡すことができます。 詳細は[ページネーション](#pagination)をご覧ください。

> `GET /v1/domains/DOMAIN_NAME/aliases`

| クエリ文字列パラメータ | 必須 | 型                         | 説明                                                                                                                                               |
| --------------------- | ---- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `q`                   | いいえ | 文字列（正規表現対応）       | ドメイン内のエイリアスを名前、ラベル、または受信者で検索                                                                                         |
| `name`                | いいえ | 文字列（正規表現対応）       | ドメイン内のエイリアスを名前で検索                                                                                                               |
| `recipient`           | いいえ | 文字列（正規表現対応）       | ドメイン内のエイリアスを受信者で検索                                                                                                             |
| `sort`                | いいえ | 文字列                     | 特定のフィールドでソート（フィールドの前に単一のハイフン`-`を付けるとそのフィールドの逆順でソート）。未設定の場合は`created_at`がデフォルト。 |
| `page`                | いいえ | 数値                       | 詳細は[ページネーション](#pagination)をご覧ください                                                                                            |
| `limit`               | いいえ | 数値                       | 詳細は[ページネーション](#pagination)をご覧ください                                                                                            |

> Example Request:

```sh
curl BASE_URI/v1/domains/DOMAIN_NAME/aliases?pagination=true \
  -u API_TOKEN:
```

### 新しいドメインエイリアスを作成 {#create-new-domain-alias}

> `POST /v1/domains/DOMAIN_NAME/aliases`

| ボディパラメータ                  | 必須 | 型                                     | 説明                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | ---- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | いいえ | 文字列                                 | エイリアス名（指定しないか空白の場合はランダムなエイリアスが生成されます）                                                                                                                                                                                                                                                                                                                |
| `recipients`                    | いいえ | 文字列または配列                       | 受信者のリスト（改行・空白・カンマ区切りの文字列、または有効なメールアドレス、完全修飾ドメイン名（"FQDN"）、IPアドレス、Webhook URLの配列）。指定しないか空の配列の場合は、APIリクエストを行ったユーザーのメールアドレスが受信者として設定されます）                                                                                                                             |
| `description`                   | いいえ | 文字列                                 | エイリアスの説明                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | いいえ | 文字列または配列                       | ラベルのリスト（改行・空白・カンマ区切りの文字列、または配列）                                                                                                                                                                                                                                                                                                                           |
| `has_recipient_verification`    | いいえ | ブール値                               | 受信者がメールの流通を許可するためにメール検証リンクをクリックすることを要求（リクエストボディで明示的に設定しない場合はドメインの設定が適用されます）                                                                                                                                                                                                                                    |
| `is_enabled`                    | いいえ | ブール値                               | このエイリアスを有効または無効にするか（無効の場合、メールはどこにもルーティングされず成功ステータスコードが返されます）。値が渡された場合は[boolean](https://github.com/thenativeweb/boolean#quick-start)を使ってブール値に変換されます。                                                                                                                                           |
| `error_code_if_disabled`        | いいえ | 数値（`250`、`421`、または`550`のいずれか） | `is_enabled`が`false`の場合、このエイリアス宛の受信メールは`250`（静かにどこにも配信しない、例：ブラックホールや`/dev/null`）、`421`（ソフトリジェクト；約5日間リトライ）、または`550`（永久失敗および拒否）のいずれかで拒否されます。デフォルトは`250`です。                                                                                                         |
| `has_imap`                      | いいえ | ブール値                               | このエイリアスのIMAPストレージを有効または無効にするか（無効の場合、受信メールは[IMAPストレージ](/blog/docs/best-quantum-safe-encrypted-email-service)に保存されません）。値が渡された場合は[boolean](https://github.com/thenativeweb/boolean#quick-start)を使ってブール値に変換されます。                                                                                          |
| `has_pgp`                       | いいえ | ブール値                               | このエイリアスの`public_key`を使って[IMAP/POP3/CalDAV/CardDAV暗号化メールストレージ](/blog/docs/best-quantum-safe-encrypted-email-service)のための[OpenPGP暗号化](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)を有効または無効にするか。                                                                                                         |
| `public_key`                    | いいえ | 文字列                                 | ASCII Armor形式のOpenPGP公開鍵（[例はこちら](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)、例：`support@forwardemail.net`のGPG鍵）。これは`has_pgp`が`true`に設定されている場合のみ適用されます。[FAQのエンドツーエンド暗号化についてはこちら](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)をご覧ください。 |
| `max_quota`                     | いいえ | 文字列                                 | このエイリアスのストレージ最大クォータ。空白にするとドメインの現在の最大クォータにリセットされます。例えば「1 GB」のような値を指定可能で、[bytes](https://github.com/visionmedia/bytes.js)で解析されます。この値はドメイン管理者のみが調整可能です。                                                                                                                                      |
| `vacation_responder_is_enabled` | いいえ | ブール値                               | 自動休暇応答を有効または無効にするか                                                                                                                                                                                                                                                                                                                                                         |
| `vacation_responder_start_date` | いいえ | 文字列                                 | 休暇応答の開始日（有効で開始日が設定されていない場合は既に開始しているとみなします）。`MM/DD/YYYY`、`YYYY-MM-DD`などの形式や、`dayjs`によるスマートパースで他の日付形式もサポートしています。                                                                                                                                                      |
| `vacation_responder_end_date`   | いいえ | 文字列                                 | 休暇応答の終了日（有効で終了日が設定されていない場合は終了しないものとみなし、永続的に応答します）。`MM/DD/YYYY`、`YYYY-MM-DD`などの形式や、`dayjs`によるスマートパースで他の日付形式もサポートしています。                                                                                                                                            |
| `vacation_responder_subject`    | いいえ | 文字列                                 | 休暇応答のプレーンテキスト件名（例："Out of Office"）。ここでは`striptags`を使ってすべてのHTMLを除去します。                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | いいえ | 文字列                                 | 休暇応答のプレーンテキストメッセージ（例："I will be out of office until February."）。ここでは`striptags`を使ってすべてのHTMLを除去します。                                                                                                                                                                                                                                               |
> Example Request:

```sh
curl -X POST BASE_URI/v1/domains/DOMAIN_NAME/aliases \
  -u API_TOKEN:
```

### ドメインエイリアスの取得 {#retrieve-domain-alias}

ドメインエイリアスは、その `id` または `name` の値で取得できます。

> `GET /v1/domains/:domain_name/aliases/:alias_id`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```

> `GET /v1/domains/:domain_name/aliases/:alias_name`

> Example Request:

```sh
curl BASE_URI/v1/domains/:domain_name/aliases/:alias_name \
  -u API_TOKEN:
```

### ドメインエイリアスの更新 {#update-domain-alias}

> `PUT /v1/domains/DOMAIN_NAME/aliases/ALIAS_ID`

| Body Parameter                  | 必須     | 型                                     | 説明                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | -------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                          | いいえ   | 文字列                                 | エイリアス名                                                                                                                                                                                                                                                                                                                                                                               |
| `recipients`                    | いいえ   | 文字列 または 配列                     | 受信者リスト（改行・スペース・カンマ区切りの文字列、または有効なメールアドレス、完全修飾ドメイン名（"FQDN"）、IPアドレス、Webhook URLの配列）                                                                                                                                                                                                                                         |
| `description`                   | いいえ   | 文字列                                 | エイリアスの説明                                                                                                                                                                                                                                                                                                                                                                           |
| `labels`                        | いいえ   | 文字列 または 配列                     | ラベルのリスト（改行・スペース・カンマ区切りの文字列、または配列）                                                                                                                                                                                                                                                                                                                       |
| `has_recipient_verification`    | いいえ   | ブール値                              | 受信者がメールの流通を許可するためにメール検証リンクをクリックすることを要求するかどうか（リクエストボディで明示的に設定されていない場合はドメインの設定がデフォルトで使用されます）                                                                                                                                                                                                 |
| `is_enabled`                    | いいえ   | ブール値                              | このエイリアスを有効または無効にするかどうか（無効の場合、メールはどこにもルーティングされず成功ステータスコードを返します）。値が渡された場合は、[boolean](https://github.com/thenativeweb/boolean#quick-start) を使ってブール値に変換されます                                                                                                                                       |
| `error_code_if_disabled`        | いいえ   | 数値（`250`、`421`、または `550` のいずれか） | `is_enabled` が `false` の場合、このエイリアスへの受信メールは `250`（静かにどこにも配信しない、例：ブラックホールや `/dev/null`）、`421`（ソフトリジェクト；約5日間リトライ）、または `550`（恒久的な失敗と拒否）のいずれかで拒否されます。デフォルトは `250` です。                                                                                                   |
| `has_imap`                      | いいえ   | ブール値                              | このエイリアスのIMAPストレージを有効または無効にするかどうか（無効の場合、受信したメールは[IMAPストレージ](/blog/docs/best-quantum-safe-encrypted-email-service)に保存されません）。値が渡された場合は、[boolean](https://github.com/thenativeweb/boolean#quick-start) を使ってブール値に変換されます                                                                                  |
| `has_pgp`                       | いいえ   | ブール値                              | エイリアスの `public_key` を使って[IMAP/POP3/CalDAV/CardDAV暗号化メールストレージ](/blog/docs/best-quantum-safe-encrypted-email-service)のための[OpenPGP暗号化](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)を有効または無効にするかどうか                                                                                                         |
| `public_key`                    | いいえ   | 文字列                                 | ASCII Armor形式のOpenPGP公開鍵（[例はこちら](/.well-known/openpgpkey/hu/mxqp8ogw4jfq83a58pn1wy1ccc1cx3f5.txt)；例：`support@forwardemail.net` のGPG鍵）。これは `has_pgp` が `true` に設定されている場合にのみ適用されます。[FAQのエンドツーエンド暗号化についてはこちら](/faq#do-you-support-openpgpmime-end-to-end-encryption-e2ee-and-web-key-directory-wkd)をご覧ください。 |
| `max_quota`                     | いいえ   | 文字列                                 | このエイリアスのストレージ最大クォータ。空欄にするとドメインの現在の最大クォータにリセットされます。または "1 GB" のような値を入力可能で、[bytes](https://github.com/visionmedia/bytes.js)で解析されます。この値はドメイン管理者のみが調整可能です。                                                                                                                                      |
| `vacation_responder_is_enabled` | いいえ   | ブール値                              | 自動休暇応答機能を有効または無効にするかどうか                                                                                                                                                                                                                                                                                                                                           |
| `vacation_responder_start_date` | いいえ   | 文字列                                 | 休暇応答の開始日（有効で開始日が設定されていない場合はすでに開始されているとみなされます）。`MM/DD/YYYY`、`YYYY-MM-DD` などの形式や、`dayjs` を使ったスマートパースによる他の形式をサポートしています。                                                                                                                                                      |
| `vacation_responder_end_date`   | いいえ   | 文字列                                 | 休暇応答の終了日（有効で終了日が設定されていない場合は無期限に応答し続けるとみなされます）。`MM/DD/YYYY`、`YYYY-MM-DD` などの形式や、`dayjs` を使ったスマートパースによる他の形式をサポートしています。                                                                                                                                                    |
| `vacation_responder_subject`    | いいえ   | 文字列                                 | 休暇応答の件名（プレーンテキスト）、例："Out of Office"。ここでは `striptags` を使ってすべてのHTMLを除去します。                                                                                                                                                                                                                                                                         |
| `vacation_responder_message`    | いいえ   | 文字列                                 | 休暇応答のメッセージ（プレーンテキスト）、例："I will be out of office until February."。ここでは `striptags` を使ってすべてのHTMLを除去します。                                                                                                                                                                                                                                               |
> 例のリクエスト:

```sh
curl -X PUT BASE_URI/v1/domains/DOMAIN_NAME/aliases/ALIAS_ID \
  -u API_TOKEN:
```

### ドメインエイリアスの削除 {#delete-domain-alias}

> `DELETE /v1/domains/:domain_name/aliases/:alias_id`

> 例のリクエスト:

```sh
curl -X DELETE BASE_URI/v1/domains/:domain_name/aliases/:alias_id \
  -u API_TOKEN:
```


## 暗号化 {#encrypt}

無料プランでも追加料金なしでレコードを暗号化できます。プライバシーは機能ではなく、製品のあらゆる側面に本質的に組み込まれているべきものです。[Privacy Guidesのディスカッション](https://discuss.privacyguides.net/t/forward-email-email-provider/13370)や[当社のGitHubの課題](https://github.com/forwardemail/forwardemail.net/issues/254)で多くの要望があったため、これを追加しました。

### TXTレコードの暗号化 {#encrypt-txt-record}

> `POST /v1/encrypt`

| Body Parameter | 必須 | 型     | 説明                                         |
| -------------- | ---- | ------ | -------------------------------------------- |
| `input`        | はい | 文字列 | 有効なForward EmailのプレーンテキストTXTレコード |

> 例のリクエスト:

```sh
curl -X POST BASE_URI/v1/encrypt \
  -d "input=user@gmail.com"
```
