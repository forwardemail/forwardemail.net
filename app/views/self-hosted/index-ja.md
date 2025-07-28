# セルフホスト {#self-hosted}

## 目次 {#table-of-contents}

* [はじめる](#getting-started)
* [要件](#requirements)
  * [クラウド初期化 / ユーザーデータ](#cloud-init--user-data)
* [インストール](#install)
  * [インストール スクリプトのデバッグ](#debug-install-script)
  * [プロンプト](#prompts)
  * [初期設定（オプション1）](#initial-setup-option-1)
* [サービス](#services)
  * [重要なファイルパス](#important-file-paths)
* [構成](#configuration)
  * [初期DNS設定](#initial-dns-setup)
* [オンボーディング](#onboarding)
* [テスト](#testing)
  * [最初のエイリアスを作成する](#creating-your-first-alias)
  * [最初のメールの送受信](#sending--receiving-your-first-email)
* [トラブルシューティング](#troubleshooting)
  * [基本認証のユーザー名とパスワードは何ですか](#what-is-the-basic-auth-username-and-password)
  * [何が実行されているかを知るには](#how-do-i-know-what-is-running)
  * [実行されるべき何かが実行されていないかどうかを知るにはどうすればいいですか？](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [ログを見つけるにはどうすればいいですか](#how-do-i-find-logs)
  * [送信メールがタイムアウトになるのはなぜですか](#why-are-my-outgoing-emails-timing-out)

## はじめに {#getting-started}

当社のセルフホスト型メール ソリューションは、当社のすべての製品と同様に、フロントエンドとバックエンドの両方で 100% オープンソースです。これは次のことを意味します。

1. **完全な透明性**: メールを処理するすべてのコード行が公開されており、誰でも精査できます。
2. **コミュニティへの貢献**: 誰でも改善や問題の修正に貢献できます。
3. **オープン性によるセキュリティ**: 脆弱性はグローバルコミュニティによって特定・修正されます。
4. **ベンダーロックインなし**: お客様は当社の存在に依存する必要はありません。

コードベース全体は、MIT ライセンスの下で GitHub の <https://github.com/forwardemail/forwardemail.net>, から入手できます。

アーキテクチャには次のコンテナが含まれます。

* 送信メール用のSMTPサーバー
* メール取得用のIMAP/POP3サーバー
* 管理用のWebインターフェース
* 設定保存用のデータベース
* キャッシュとパフォーマンス向上のためのRedis
* 安全で暗号化されたメールボックス保存用のSQLite

> \[!NOTE]
> Be sure to check out our [self-hosted blog](https://forwardemail.net/blog/docs/self-hosted-solution)
>
> And for those interested in a more broken down step-by-step version see our [Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) or [Debian](https://forwardemail.net/guides/selfhosted-on-debian) based guides.

## 要件 {#requirements}

インストール スクリプトを実行する前に、次のものがあることを確認してください。

* **オペレーティング システム**: Linux ベースのサーバー (現在 Ubuntu 22.04 以降をサポート)
* **リソース**: vCPU 1 基と RAM 2GB
* **ルートアクセス**: コマンド実行に必要な管理者権限
* **ドメイン名**: DNS 設定可能なカスタムドメイン
* **クリーン IP**: ブラックリストを確認し、スパム評価のないクリーンな IP アドレスをサーバーに割り当ててください。詳細については、[ここ](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation) をご覧ください。
* ポート 25 をサポートするパブリック IP アドレス
* [逆PTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) の設定が可能
* IPv4 および IPv6 をサポート

> \[!TIP]
> See our list of [awesome mail server providers](https://github.com/forwardemail/awesome-mail-server-providers)

### クラウド初期化 / ユーザーデータ {#cloud-init--user-data}

ほとんどのクラウド ベンダーは、仮想プライベート サーバー (VPS) がプロビジョニングされるときに cloud-init 構成をサポートしています。これは、スクリプトの初期セットアップ ロジックで使用するために事前にいくつかのファイルと環境変数を設定するための優れた方法であり、スクリプトの実行中に追加情報を求めるプロンプトを表示する必要がなくなります。

**オプション**

* `EMAIL` - certbot の有効期限リマインダーに使用するメールアドレス
* `DOMAIN` - セルフホスティング設定で使用するカスタムドメイン（例：`example.com`）
* `AUTH_BASIC_USERNAME` - サイト保護のため初回設定で使用するユーザー名
* `AUTH_BASIC_PASSWORD` - サイト保護のため初回設定で使用するパスワード
* `/root/.cloudflare.ini` - （**Cloudflare ユーザーのみ**）certbot が DNS 設定に使用する Cloudflare 設定ファイル。`dns_cloudflare_api_token` で API トークンを設定する必要があります。詳しくは [ここ](https://certbot-dns-cloudflare.readthedocs.io/en/stable/) をご覧ください。

例：

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

## インストール {#install}

サーバーで次のコマンドを実行して、インストール スクリプトをダウンロードして実行します。

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### デバッグインストールスクリプト {#debug-install-script}

詳細出力のために、インストール スクリプトの前に `DEBUG=true` を追加します。

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### プロンプト {#prompts}

```sh
1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```

* **初期設定**: 最新の転送メールコードをダウンロードし、環境設定を行い、カスタムドメインの入力を求め、必要な証明書、キー、シークレットをすべて設定します。
* **バックアップの設定**: 安全なリモートストレージとして、S3 互換ストアを使用して mongoDB と redis をバックアップするための cron を設定します。また、安全で暗号化されたバックアップのために、変更があった場合はログイン時に sqlite もバックアップされます。
* **アップグレードの設定**: インフラストラクチャコンポーネントを安全に再構築して再起動するための夜間更新を確認する cron を設定します。
* **証明書の更新**: SSL 証明書には Certbot / lets encrypt が使用され、キーは 3 か月ごとに期限切れになります。これにより、ドメインの証明書が更新され、関連コンポーネントが使用する適切なフォルダに配置されます。[重要なファイルパス](#important-file-paths) を参照してください。
* **バックアップからの復元**: mongoDB と redis をトリガーしてバックアップデータから復元します。

### 初期設定（オプション1） {#initial-setup-option-1}

開始するにはオプション`1. Initial setup` を選択してください。

完了すると、成功メッセージが表示されます。`docker ps` を実行して、**コンポーネント**が起動していることを確認することもできます。コンポーネントの詳細については、以下をご覧ください。

## サービス {#services}

| サービス名 | デフォルトポート | 説明 |
| ------------ | :----------: | ------------------------------------------------------ |
| ウェブ | `443` | すべての管理者とのやり取りのためのWebインターフェース |
| API | `4000` | データベースを抽象化するAPIレイヤー |
| ブリー | なし | バックグラウンドジョブとタスクランナー |
| SMTP | `465/587` | 送信メール用の SMTP サーバー |
| SMTPブリー | なし | SMTP バックグラウンドジョブ |
| MX | `2525` | 受信メールとメール転送のためのメール交換 |
| IMAP | `993/2993` | 受信メールとメールボックス管理用の IMAP サーバー |
| POP3 | `995/2995` | 受信メールとメールボックス管理用の POP3 サーバー |
| SQLite | `3456` | SQLite データベースとのやり取りのための SQLite サーバー |
| SQLite ブリー | なし | SQLite バックグラウンドジョブ |
| カルダブ | `5000` | カレンダー管理用のCalDAVサーバー |
| カードDAV | `6000` | カレンダー管理用のCardDAVサーバー |
| モンゴDB | `27017` | ほとんどのデータ管理にMongoDBデータベースを使用 |
| レディス | `6379` | キャッシュと状態管理のためのRedis |
| SQLite | なし | 暗号化されたメールボックス用の SQLite データベース |

### 重要なファイルパス {#important-file-paths}

注: 以下の *ホスト パス* は `/root/forwardemail.net/self-hosting/` を基準としています。

| 成分 | ホストパス | コンテナパス |
| ---------------------- | :-------------------: | ---------------------------- |
| モンゴDB | `./mongo-backups` | `/backups` |
| レディス | `./redis-data` | `/data` |
| スクライト | `./sqlite-data` | `/mnt/{SQLITE_STORAGE_PATH}` |
| 環境変数ファイル | `./.env` | `/app/.env` |
| SSL 証明書/キー | `./ssl` | `/app/ssl/` |
| 秘密鍵 | `./ssl/privkey.pem` | `/app/ssl/privkey.pem` |
| フルチェーン証明書 | `./ssl/fullchain.pem` | `/app/ssl/fullchain.pem` |
| 認定CA | `./ssl/cert.pem` | `/app/ssl/cert.pem` |
| DKIM秘密鍵 | `./ssl/dkim.key` | `/app/ssl/dkim.key` |

> \[!IMPORTANT]
> Save the `.env` file securely. It is critical for recovery in case of failure.
> You can find this in `/root/forwardemail.net/self-hosting/.env`.

## 構成 {#configuration}

### 初期 DNS 設定 {#initial-dns-setup}

ご利用のDNSプロバイダーで、適切なDNSレコードを設定してください。括弧内の値（`<>`）は動的であるため、設定値に合わせて更新する必要があります。

| タイプ | 名前 | コンテンツ | TTL |
| ----- | ------------------ | ----------------------------- | ---- |
| A | 「@」、「.」、または空白 | <IPアドレス> | 自動車 |
| CNAME | アピ | <ドメイン名> | 自動車 |
| CNAME | カルダブ | <ドメイン名> | 自動車 |
| CNAME | カードダブ | <ドメイン名> | 自動車 |
| CNAME | feバウンス | <ドメイン名> | 自動車 |
| CNAME | iマップ | <ドメイン名> | 自動車 |
| CNAME | MX | <ドメイン名> | 自動車 |
| CNAME | ポップ3 | <ドメイン名> | 自動車 |
| CNAME | SMTP | <ドメイン名> | 自動車 |
| MX | 「@」、「.」、または空白 | mx.<ドメイン名> (優先度 0) | 自動車 |
| TXT | 「@」、「.」、または空白 | 「v=spf1a-すべて」 | 自動車 |

#### 逆DNS / PTRレコード {#reverse-dns--ptr-record}

逆 DNS (rDNS) または逆ポインター レコード (PTR レコード) は、電子メールを送信するサーバーの正当性を確認するのに役立つため、電子メール サーバーにとって不可欠です。各クラウド プロバイダーはこれを異なる方法で実行するため、ホストと IP を対応するホスト名にマップするための「逆 DNS」の追加方法を調べる必要があります。プロバイダーのネットワーク セクションにある可能性が高いです。

#### ポート25がブロックされています {#port-25-blocked}

一部の ISP およびクラウド プロバイダーは、悪意のある行為者を避けるために 25 をブロックします。SMTP/送信メール用にポート 25 を開くには、サポート チケットを提出する必要がある場合があります。

## オンボーディング {#onboarding}

1. ランディングページを開く
https://<domain_name> にアクセスします。<domain_name> は、DNS設定で設定したドメインに置き換えてください。メール転送のランディングページが表示されます。

2. ログインしてドメインを登録する

* 有効なメールアドレスとパスワードでサインインしてください。
* 設定するドメイン名を入力してください（DNS設定と一致する必要があります）。
* プロンプトに従って、確認に必要な**MX**レコードと**TXT**レコードを追加してください。

3. セットアップを完了する

* 確認が完了したら、「エイリアス」ページにアクセスして最初のエイリアスを作成してください。
* 必要に応じて、**ドメイン設定** で **送信メール用の SMTP** を設定します。これには追加の DNS レコードが必要です。

> \[!NOTE]
> No information is sent outside of your server. The self hosted option and initial account is just for the admin login and web view to manage domains, aliases and related email configurations.

## テスト {#testing}

### 最初のエイリアスを作成する {#creating-your-first-alias}

1. エイリアスページに移動します
エイリアス管理ページを開きます。

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. 新しいエイリアスを追加する

* **エイリアスを追加** (右上) をクリックします。
* エイリアス名を入力し、必要に応じてメール設定を調整します。
* (オプション) チェックボックスをオンにして、**IMAP/POP3/CalDAV/CardDAV** サポートを有効にします。
* **エイリアスを作成** をクリックします。

3. パスワードを設定する

* 安全なパスワードを作成するには、[**パスワードを生成**] をクリックします。
* このパスワードは、メールクライアントにログインする際に必要になります。

4. メールクライアントを設定する

* Thunderbird などのメールクライアントを使用します。
* エイリアス名と生成されたパスワードを入力します。
* **IMAP** と **SMTP** の設定を適宜行います。

#### メールサーバー設定 {#email-server-settings}

ユーザー名: `<alias name>`

| タイプ | ホスト名 | ポート | 接続セキュリティ | 認証 |
| ---- | ------------------ | ---- | ------------------- | --------------- |
| SMTP | smtp.<ドメイン名> | 465 | SSL / TLS | 通常のパスワード |
| IMAP | imap.<ドメイン名> | 993 | SSL / TLS | 通常のパスワード |

### 最初のメールの送受信 {#sending--receiving-your-first-email}

設定が完了すると、新しく作成して自分でホストしたメール アドレスでメールを送受信できるようになります。

## トラブルシューティング {#troubleshooting}

#### UbuntuとDebian以外ではなぜ動作しないのか {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

現在、macOSのサポートを検討しており、他のOSへの対応も検討しています。他のOSへの対応をご希望の場合は、[議論](https://github.com/orgs/forwardemail/discussions) を開設するか、ご寄付をお願いいたします。

#### certbot acmeチャレンジが失敗する理由 {#why-is-the-certbot-acme-challenge-failing}

最もよくある落とし穴は、certbot / letsencrypt が **2** 回のチャレンジを要求する場合があることです。必ず **両方** の txt レコードを追加してください。

例:
次のような2つのチャレンジが表示される場合があります:
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

DNSの伝播が完了していない可能性もあります。`https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>`などのツールが利用可能です。これにより、TXTレコードの変更が反映されるかどうかを確認できます。また、ホスト上のローカルDNSキャッシュが古い値を使用しているか、最近の変更が反映されていない可能性もあります。

もう一つの選択肢は、CerbotのDNS自動変更機能を利用することです。VPSの初期セットアップ時に、cloud-init / user-data内の`/root/.cloudflare.ini`ファイルにAPIトークンを設定するか、このファイルを作成してスクリプトを再度実行します。これにより、DNSの変更とチャレンジの更新が自動的に管理されます。

### 基本認証のユーザー名とパスワードは何ですか？ {#what-is-the-basic-auth-username-and-password}

セルフホスティングの場合、初回ログイン時にブラウザネイティブの認証ポップアップを表示し、シンプルなユーザー名（`admin`）とパスワード（初期設定時にランダムに生成）を入力します。これは、自動化ツールやスクレーパーが何らかの理由でウェブ上での初回登録を先取りした場合の保護対策です。このパスワードは、初期設定後に`.env` ファイルの `AUTH_BASIC_USERNAME` と `AUTH_BASIC_PASSWORD` で確認できます。

### 何が実行されているかを知るにはどうすればいいですか？ {#how-do-i-know-what-is-running}

`docker ps` を実行すると、`docker-compose-self-hosting.yml` ファイルから起動されている実行中のコンテナをすべて表示できます。また、`docker ps -a` を実行すると、実行されていないコンテナも含め、すべてを表示できます。

### 実行されているはずの何かが実行されていないかどうかは、どうすればわかりますか？ {#how-do-i-know-if-something-isnt-running-that-should-be}

`docker ps -a` を実行すると、すべて（実行されていないコンテナも含む）を確認できます。終了ログまたはメモが表示される場合があります。

### ログを見つけるにはどうすればいいですか？ {#how-do-i-find-logs}

`docker logs -f <container_name>` でさらにログを取得できます。何かログが残っている場合は、`.env` ファイルの設定が間違っている可能性があります。

Web UI 内では、送信メール ログとエラー ログのそれぞれ `/admin/emails` と `/admin/logs` を表示できます。

### 送信メールがタイムアウトするのはなぜですか？ {#why-are-my-outgoing-emails-timing-out}

MX サーバーへの接続時に「接続がタイムアウトしました...」などのメッセージが表示される場合は、ポート 25 がブロックされていないか確認する必要があります。ISP またはクラウド プロバイダーがデフォルトでこれをブロックするのはよくあることです。その場合、これを開くにはサポートに問い合わせるか、チケットを提出する必要があります。

#### 電子メール構成のベストプラクティスと IP レピュテーションをテストするにはどのツールを使用すればよいですか？ {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

[よくある質問はこちら](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation) をご覧ください。