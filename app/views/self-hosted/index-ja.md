# セルフホスト {#self-hosted}


## 目次 {#table-of-contents}

* [はじめに](#getting-started)
* [要件](#requirements)
  * [Cloud-init / ユーザーデータ](#cloud-init--user-data)
* [インストール](#install)
  * [インストールスクリプトのデバッグ](#debug-install-script)
  * [プロンプト](#prompts)
  * [初期設定（オプション1）](#initial-setup-option-1)
* [サービス](#services)
  * [重要なファイルパス](#important-file-paths)
* [設定](#configuration)
  * [初期DNS設定](#initial-dns-setup)
* [オンボーディング](#onboarding)
* [テスト](#testing)
  * [最初のエイリアスの作成](#creating-your-first-alias)
  * [最初のメールの送受信](#sending--receiving-your-first-email)
* [トラブルシューティング](#troubleshooting)
  * [ベーシック認証のユーザー名とパスワードは何ですか](#what-is-the-basic-auth-username-and-password)
  * [何が動作しているかどうやってわかりますか](#how-do-i-know-what-is-running)
  * [動作すべきものが動作していないかどうやってわかりますか](#how-do-i-know-if-something-isnt-running-that-should-be)
  * [ログはどのように見つけますか](#how-do-i-find-logs)
  * [なぜ送信メールがタイムアウトするのですか](#why-are-my-outgoing-emails-timing-out)


## はじめに {#getting-started}

当社のセルフホスト型メールソリューションは、すべての製品と同様に、フロントエンドとバックエンドの両方が100％オープンソースです。これにより：

1. **完全な透明性**：メールを処理するすべてのコードが公開されており、誰でも確認可能です
2. **コミュニティの貢献**：誰でも改善や問題修正に参加できます
3. **オープン性によるセキュリティ**：脆弱性は世界中のコミュニティによって特定・修正されます
4. **ベンダーロックインなし**：当社の存続に依存しません

コードベース全体はGitHubの <https://github.com/forwardemail/forwardemail.net> にてMITライセンスのもと公開されています。

アーキテクチャには以下のコンテナが含まれます：

* 送信メール用のSMTPサーバー
* メール取得用のIMAP/POP3サーバー
* 管理用のウェブインターフェース
* 設定保存用のデータベース
* キャッシュとパフォーマンス向上のためのRedis
* セキュアで暗号化されたメールボックス保存用のSQLite

> \[!NOTE]
> 当社の [セルフホストブログ](https://forwardemail.net/blog/docs/self-hosted-solution) もぜひご覧ください
>
> また、より詳細なステップバイステップ版をお求めの方は、[Ubuntu](https://forwardemail.net/guides/selfhosted-on-ubuntu) または [Debian](https://forwardemail.net/guides/selfhosted-on-debian) ベースのガイドをご参照ください。


## 要件 {#requirements}

インストールスクリプトを実行する前に、以下を確認してください：

* **オペレーティングシステム**：Linuxベースのサーバー（現在はUbuntu 22.04以上をサポート）
* **リソース**：1 vCPU と 2GB RAM
* **ルートアクセス**：コマンド実行のための管理者権限
* **ドメイン名**：DNS設定が可能なカスタムドメイン
* **クリーンなIP**：スパムの評判がないクリーンなIPアドレスであること。ブラックリストを確認してください。詳細は [こちら](#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation)
* ポート25が利用可能なパブリックIPアドレス
* [逆引きPTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/) の設定が可能
* IPv4およびIPv6のサポート

> \[!TIP]
> 当社の [素晴らしいメールサーバープロバイダー一覧](https://github.com/forwardemail/awesome-mail-server-providers) をご覧ください

### Cloud-init / ユーザーデータ {#cloud-init--user-data}

ほとんどのクラウドベンダーは、仮想プライベートサーバー（VPS）をプロビジョニングする際にcloud-init設定をサポートしています。これは、スクリプトの初期セットアップロジックで使用するファイルや環境変数を事前に設定し、スクリプト実行中の追加情報入力を省略するのに便利です。

**オプション**

* `EMAIL` - certbotの有効期限リマインダーに使用するメールアドレス
* `DOMAIN` - セルフホスティング設定に使用するカスタムドメイン（例：`example.com`）
* `AUTH_BASIC_USERNAME` - 初回セットアップ時にサイト保護のために使用するユーザー名
* `AUTH_BASIC_PASSWORD` - 初回セットアップ時にサイト保護のために使用するパスワード
* `/root/.cloudflare.ini` - （**Cloudflareユーザーのみ**）certbotがDNS設定に使用するCloudflare設定ファイル。`dns_cloudflare_api_token`でAPIトークンを設定する必要があります。詳細は [こちら](https://certbot-dns-cloudflare.readthedocs.io/en/stable/) をご覧ください。
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

## インストール {#install}

サーバーで以下のコマンドを実行して、インストールスクリプトをダウンロードし実行してください：

```sh
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### インストールスクリプトのデバッグ {#debug-install-script}

詳細な出力を得るには、インストールスクリプトの前に `DEBUG=true` を追加してください：

```sh
DEBUG=true bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

### プロンプト {#prompts}

```sh
1. 初期設定
2. バックアップの設定
3. 自動アップグレードの設定
4. 証明書の更新
5. バックアップからの復元
6. ヘルプ
7. 終了
```

* **初期設定**: 最新の forward email コードをダウンロードし、環境を設定し、カスタムドメインを入力して必要な証明書、鍵、シークレットをすべてセットアップします。
* **バックアップの設定**: mongoDB と redis のバックアップ用に S3 互換ストアを使った安全なリモートストレージ用の cron を設定します。別途、sqlite は変更があればログイン時にバックアップされ、安全で暗号化されたバックアップが行われます。
* **アップグレードの設定**: 夜間の更新を確認し、安全にインフラコンポーネントを再構築・再起動する cron を設定します。
* **証明書の更新**: SSL 証明書には Certbot / lets encrypt を使用し、鍵は3ヶ月ごとに期限切れになります。これによりドメインの証明書を更新し、関連コンポーネントが利用できるように必要なフォルダに配置します。[重要なファイルパス](#important-file-paths)を参照してください。
* **バックアップからの復元**: mongodb と redis のバックアップデータからの復元をトリガーします。

### 初期設定（オプション1） {#initial-setup-option-1}

`1. 初期設定` を選択して開始してください。

完了すると成功メッセージが表示されます。`docker ps` を実行して起動したコンポーネントを確認することもできます。コンポーネントの詳細は以下をご覧ください。


## サービス {#services}

| サービス名    |         デフォルトポート         | 説明                                                    |
| ------------ | :-----------------------------: | ------------------------------------------------------- |
| Web          |            `443`                | すべての管理操作用のウェブインターフェース             |
| API          |            `4000`               | データベースを抽象化する API レイヤー                   |
| Bree         |             なし                | バックグラウンドジョブおよびタスクランナー             |
| SMTP         | `465`（推奨） / `587`           | 送信メール用 SMTP サーバー                              |
| SMTP Bree    |             なし                | SMTP バックグラウンドジョブ                              |
| MX           |            `2525`               | 受信メールおよびメール転送用のメール交換サーバー       |
| IMAP         |          `993/2993`             | 受信メールおよびメールボックス管理用 IMAP サーバー     |
| POP3         |          `995/2995`             | 受信メールおよびメールボックス管理用 POP3 サーバー     |
| SQLite       |            `3456`               | sqlite データベースとのやりとり用 SQLite サーバー       |
| SQLite Bree  |             なし                | SQLite バックグラウンドジョブ                            |
| CalDAV       |            `5000`               | カレンダー管理用 CalDAV サーバー                         |
| CardDAV      |            `6000`               | カレンダー管理用 CardDAV サーバー                        |
| MongoDB      |           `27017`               | ほとんどのデータ管理用 MongoDB データベース             |
| Redis        |            `6379`               | キャッシュおよび状態管理用 Redis                         |
| SQLite       |             なし                | 暗号化されたメールボックス用 SQLite データベース群      |

### 重要なファイルパス {#important-file-paths}

注：以下の *ホストパス* は `/root/forwardemail.net/self-hosting/` を基準としています。

| コンポーネント          |       ホストパス        | コンテナパス                  |
| ---------------------- | :--------------------: | ---------------------------- |
| MongoDB                |   `./mongo-backups`    | `/backups`                   |
| Redis                  |     `./redis-data`     | `/data`                      |
| Sqlite                 |    `./sqlite-data`     | `/mnt/{SQLITE_STORAGE_PATH}` |
| Env ファイル           |        `./.env`        | `/app/.env`                  |
| SSL 証明書/鍵          |        `./ssl`         | `/app/ssl/`                  |
| 秘密鍵                 |  `./ssl/privkey.pem`   | `/app/ssl/privkey.pem`       |
| フルチェーン証明書     | `./ssl/fullchain.pem`  | `/app/ssl/fullchain.pem`     |
| CA 証明書              |    `./ssl/cert.pem`    | `/app/ssl/cert.pem`          |
| DKIM 秘密鍵            |    `./ssl/dkim.key`    | `/app/ssl/dkim.key`          |
> \[!IMPORTANT]
> `.env` ファイルは安全に保存してください。障害発生時の復旧に不可欠です。
> `/root/forwardemail.net/self-hosting/.env` にあります。


## 設定 {#configuration}

### 初期DNS設定 {#initial-dns-setup}

お使いのDNSプロバイダーで、適切なDNSレコードを設定してください。角括弧 (`<>`) 内のものは動的な値であり、ご自身の値に更新する必要があります。

| 種類  | 名前               | 内容                         | TTL  |
| ----- | ------------------ | ----------------------------- | ---- |
| A     | "@", ".", または空欄 | <ip_address>                  | auto |
| CNAME | api                | <domain_name>                 | auto |
| CNAME | caldav             | <domain_name>                 | auto |
| CNAME | carddav            | <domain_name>                 | auto |
| CNAME | fe-bounces         | <domain_name>                 | auto |
| CNAME | imap               | <domain_name>                 | auto |
| CNAME | mx                 | <domain_name>                 | auto |
| CNAME | pop3               | <domain_name>                 | auto |
| CNAME | smtp               | <domain_name>                 | auto |
| MX    | "@", ".", または空欄 | mx.<domain_name> (優先度 0)   | auto |
| TXT   | "@", ".", または空欄 | "v=spf1 a -all"               | auto |

#### 逆引きDNS / PTRレコード {#reverse-dns--ptr-record}

逆引きDNS（rDNS）または逆ポインタレコード（PTRレコード）は、メールサーバーにとって重要です。送信元サーバーの正当性を検証するのに役立ちます。クラウドプロバイダーごとに設定方法が異なるため、「逆引きDNS」を追加してホストとIPを対応するホスト名にマッピングする方法を調べてください。多くの場合、プロバイダーのネットワーク設定セクションにあります。

#### ポート25がブロックされている場合 {#port-25-blocked}

一部のISPやクラウドプロバイダーは悪意ある利用を防ぐためにポート25をブロックしています。SMTP / 送信メール用にポート25を開放するにはサポートチケットを提出する必要があるかもしれません。


## オンボーディング {#onboarding}

1. ランディングページを開く  
   https\://\<domain_name> にアクセスしてください。\<domain_name> はDNS設定で指定したドメインに置き換えます。Forward Emailのランディングページが表示されます。

2. ログインしてドメインを登録する

* 有効なメールアドレスとパスワードでサインインします。
* 設定したいドメイン名を入力します（DNS設定と一致している必要があります）。
* 検証のために必要な **MX** および **TXT** レコードを追加するよう指示に従います。

3. 設定を完了する

* 検証が完了したら、エイリアスページにアクセスして最初のエイリアスを作成します。
* 必要に応じて、**ドメイン設定**で **SMTPによる送信メール** を設定します。追加のDNSレコードが必要です。

> \[!NOTE]
> 情報はサーバー外に送信されません。セルフホストオプションと初期アカウントは管理者ログインとドメイン、エイリアス、関連メール設定の管理用ウェブビューのみです。


## テスト {#testing}

### 最初のエイリアスを作成する {#creating-your-first-alias}

1. エイリアスページに移動する  
   エイリアス管理ページを開きます：

```sh
https://<domain_name>/en/my-account/domains/<domain_name>/aliases
```

2. 新しいエイリアスを追加する

* 右上の **Add Alias** をクリックします。
* エイリアス名を入力し、必要に応じてメール設定を調整します。
* （任意）**IMAP/POP3/CalDAV/CardDAV** サポートを有効にするにはチェックボックスを選択します。
* **Create Alias** をクリックします。

3. パスワードを設定する

* **Generate Password** をクリックして安全なパスワードを作成します。
* このパスワードはメールクライアントのログインに必要です。

4. メールクライアントを設定する

* Thunderbirdなどのメールクライアントを使用します。
* エイリアス名と生成したパスワードを入力します。
* **IMAP** と **SMTP** の設定を適切に行います。

#### メールサーバー設定 {#email-server-settings}

ユーザー名: `<alias name>`

| 種類 | ホスト名             | ポート | 接続セキュリティ     | 認証方式         |
| ---- | -------------------- | ------ | -------------------- | ---------------- |
| SMTP | smtp.<domain_name>   | 465    | SSL / TLS            | 通常パスワード   |
| IMAP | imap.<domain_name>   | 993    | SSL / TLS            | 通常パスワード   |

### 最初のメールを送受信する {#sending--receiving-your-first-email}

設定が完了すると、新しく作成したセルフホストのメールアドレスでメールの送受信ができるようになります！
## トラブルシューティング {#troubleshooting}

#### なぜUbuntuやDebian以外で動作しないのか {#why-doesnt-this-work-outside-of-ubuntu-and-debian}

現在MacOSのサポートを検討しており、他の環境も対応を検討しています。サポートしてほしい環境があれば、[ディスカッション](https://github.com/orgs/forwardemail/discussions)を開くか、貢献してください。

#### なぜcertbotのacmeチャレンジが失敗するのか {#why-is-the-certbot-acme-challenge-failing}

最も一般的な落とし穴は、certbot / letsencryptが時々**2つ**のチャレンジを要求することです。**両方の**TXTレコードを必ず追加する必要があります。

例：
以下のように2つのチャレンジが表示されることがあります：
\_acme-challenge.example.com -> "randomstring1"
\_acme-challenge.example.com -> "randomstring2"

また、DNSの伝播が完了していない可能性もあります。`https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.<your_domain>` のようなツールを使うと、TXTレコードの変更が反映されているか確認できます。ホストのローカルDNSキャッシュが古い値を使っているか、最近の変更をまだ取得していない可能性もあります。

もう一つの方法は、初期VPSセットアップ時にcloud-init / user-dataでAPIトークンを設定した`/root/.cloudflare.ini`ファイルを使い、自動的にcertbotのDNS変更を行うことです。このファイルを作成してスクリプトを再実行すると、DNS変更とチャレンジの更新を自動で管理します。

### ベーシック認証のユーザー名とパスワードは何ですか {#what-is-the-basic-auth-username-and-password}

セルフホスティングの場合、初回ブラウザでネイティブ認証ポップアップを表示し、シンプルなユーザー名（`admin`）とパスワード（初期セットアップ時にランダム生成）を設定しています。これは、もし自動化ツールやスクレイパーが先にウェブ体験のサインアップをしてしまうのを防ぐための保護です。初期セットアップ後、このパスワードは`.env`ファイルの`AUTH_BASIC_USERNAME`と`AUTH_BASIC_PASSWORD`で確認できます。

### 何が動いているかどうやって確認するの？ {#how-do-i-know-what-is-running}

`docker ps`を実行すると、`docker-compose-self-hosting.yml`ファイルから起動しているすべてのコンテナが表示されます。`docker ps -a`を実行すると、停止中のコンテナも含めてすべてが見られます。

### 動いているはずのものが動いていないかどうやってわかるの？ {#how-do-i-know-if-something-isnt-running-that-should-be}

`docker ps -a`を実行すると、停止中のコンテナも含めてすべてが見られます。終了ログやメモが表示されることがあります。

### ログはどうやって見つけるの？ {#how-do-i-find-logs}

`docker logs -f <container_name>`で詳細なログを取得できます。もし何かが終了している場合は、`.env`ファイルの設定ミスが原因である可能性が高いです。

ウェブUI内では、送信メールログは`/admin/emails`、エラーログは`/admin/logs`で確認できます。

### なぜ送信メールがタイムアウトするの？ {#why-are-my-outgoing-emails-timing-out}

「Connection timed out when connecting to MX server...」のようなメッセージが表示される場合、ポート25がブロックされている可能性があります。ISPやクラウドプロバイダーがデフォルトでブロックしていることが多いため、サポートに連絡するかチケットを提出して開放してもらう必要があります。

#### メール設定のベストプラクティスやIP評価をテストするにはどんなツールを使えばいい？ {#what-tools-should-i-use-to-test-email-configuration-best-practices-and-ip-reputation}

[こちらのFAQ](/faq#why-are-my-emails-landing-in-spam-and-junk-and-how-can-i-check-my-domain-reputation)をご覧ください。
