# セキュアなニュースレター配信のための Forward Email と Listmonk の連携 {#listmonk-with-forward-email-for-secure-newsletter-delivery}


## 目次 {#table-of-contents}

* [概要](#overview)
* [なぜ Listmonk と Forward Email なのか](#why-listmonk-and-forward-email)
* [前提条件](#prerequisites)
* [インストール](#installation)
  * [1. サーバーの更新](#1-update-your-server)
  * [2. 依存関係のインストール](#2-install-dependencies)
  * [3. Listmonk 設定のダウンロード](#3-download-listmonk-configuration)
  * [4. ファイアウォール（UFW）の設定](#4-configure-firewall-ufw)
  * [5. HTTPS アクセスの設定](#5-configure-https-access)
  * [6. Listmonk の起動](#6-start-listmonk)
  * [7. Listmonk での Forward Email SMTP 設定](#7-configure-forward-email-smtp-in-listmonk)
  * [8. バウンス処理の設定](#8-configure-bounce-processing)
* [テスト](#testing)
  * [メーリングリストの作成](#create-a-mailing-list)
  * [購読者の追加](#add-subscribers)
  * [キャンペーンの作成と送信](#create-and-send-a-campaign)
* [検証](#verification)
* [開発者向けノート](#developer-notes)
* [まとめ](#conclusion)


## 概要 {#overview}

本ガイドは、強力なオープンソースのニュースレターおよびメーリングリスト管理ツールである [Listmonk](https://listmonk.app/) を、SMTP プロバイダーとして [Forward Email](https://forwardemail.net/) を使用するためのステップバイステップの手順を開発者向けに提供します。この組み合わせにより、キャンペーンを効果的に管理しつつ、安全でプライベートかつ信頼性の高いメール配信を実現できます。

* **Listmonk**: 購読者管理、リストの整理、キャンペーン作成、パフォーマンス追跡を担当します。
* **Forward Email**: セキュアな SMTP サーバーとして機能し、SPF、DKIM、DMARC、TLS 暗号化などの組み込みセキュリティ機能を備えたメールの実際の送信を処理します。

これらを統合することで、データとインフラの完全なコントロールを保持しつつ、Forward Email の堅牢な配信システムを活用できます。


## なぜ Listmonk と Forward Email なのか {#why-listmonk-and-forward-email}

* **オープンソース**: Listmonk と Forward Email の理念は透明性とコントロールを重視しています。Listmonk は自身でホストし、データの所有権を保持します。
* **プライバシー重視**: Forward Email はプライバシーを核に設計されており、データ保持を最小限に抑え、安全な送信に注力しています。
* **コスト効率**: Listmonk は無料で、Forward Email は寛大な無料プランと手頃な有料プランを提供しており、予算に優しいソリューションです。
* **スケーラビリティ**: Listmonk は高性能であり、Forward Email のインフラは大規模な配信に対応できるよう設計されています。
* **開発者フレンドリー**: Listmonk は強力な API を提供し、Forward Email はシンプルな SMTP 統合とウェブフックを提供します。


## 前提条件 {#prerequisites}

開始する前に、以下を準備してください：

* 最近の Linux ディストリビューション（Ubuntu 20.04 以降推奨）を実行する仮想プライベートサーバー（VPS）、最低 1 CPU と 1GB RAM（推奨 2GB）。
  * プロバイダーが必要ですか？[推奨 VPS リスト](https://github.com/forwardemail/awesome-mail-server-providers) をご覧ください。
* 管理可能なドメイン名（DNS アクセスが必要）。
* [Forward Email](https://forwardemail.net/) のアクティブなアカウント。
* VPS への root または `sudo` アクセス。
* Linux コマンドライン操作の基本的な知識。


## インストール {#installation}

以下の手順では、VPS 上で Docker と Docker Compose を使用して Listmonk をインストールする方法を説明します。

### 1. サーバーの更新 {#1-update-your-server}

システムのパッケージリストとインストール済みパッケージを最新にします。

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 依存関係のインストール {#2-install-dependencies}

Docker、Docker Compose、および UFW（Uncomplicated Firewall）をインストールします。

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk 設定のダウンロード {#3-download-listmonk-configuration}

Listmonk 用のディレクトリを作成し、公式の `docker-compose.yml` ファイルをダウンロードします。

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

このファイルは Listmonk アプリケーションコンテナと、そのために必要な PostgreSQL データベースコンテナを定義しています。
### 4. ファイアウォールの設定 (UFW) {#4-configure-firewall-ufw}

ファイアウォールを通じて必要なトラフィック（SSH、HTTP、HTTPS）を許可します。SSHが標準以外のポートで動作している場合は、適宜調整してください。

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

プロンプトが表示されたら、ファイアウォールの有効化を確認してください。

### 5. HTTPSアクセスの設定 {#5-configure-https-access}

ListmonkをHTTPSで実行することはセキュリティ上非常に重要です。主に2つの選択肢があります。

#### オプションA: Cloudflareプロキシの利用（簡単さのため推奨） {#option-a-using-cloudflare-proxy-recommended-for-simplicity}

ドメインのDNSがCloudflareで管理されている場合、彼らのプロキシ機能を利用して簡単にHTTPSを実現できます。

1. **DNSを設定**: CloudflareでListmonkのサブドメイン（例：`listmonk.yourdomain.com`）の`A`レコードを作成し、VPSのIPアドレスを指すようにします。**Proxy status**が**Proxied**（オレンジの雲）になっていることを確認してください。
2. **Docker Composeの修正**: ダウンロードした`docker-compose.yml`ファイルを編集します：
   ```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
   これにより、Listmonkは内部的にポート80でアクセス可能になり、CloudflareがHTTPSでプロキシし保護します。

#### オプションB: リバースプロキシの利用（Nginx、Caddyなど） {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

あるいは、VPS上でNginxやCaddyなどのリバースプロキシを設定し、HTTPS終端処理を行い、Listmonk（デフォルトでポート9000で動作）へのリクエストをプロキシする方法もあります。

* `docker-compose.yml`の`ports: - "127.0.0.1:9000:9000"`はそのままにして、Listmonkがローカルのみでアクセス可能な状態を維持します。
* 選択したリバースプロキシをポート80と443でリッスンさせ、SSL証明書の取得（例：Let's Encrypt）を行い、トラフィックを`http://127.0.0.1:9000`に転送するよう設定します。
* 詳細なリバースプロキシの設定は本ガイドの範囲外ですが、多くのチュートリアルがオンラインで利用可能です。

### 6. Listmonkの起動 {#6-start-listmonk}

`listmonk`ディレクトリに戻り（まだでなければ）、コンテナをデタッチモードで起動します。

```bash
cd ~/listmonk # またはdocker-compose.ymlを保存したディレクトリ
docker compose up -d
```

Dockerは必要なイメージをダウンロードし、Listmonkアプリケーションとデータベースのコンテナを起動します。初回は1～2分かかる場合があります。

✅ **Listmonkにアクセス**: 設定したドメイン（例：`https://listmonk.yourdomain.com`）からListmonkのウェブインターフェースにアクセスできるはずです。

### 7. ListmonkでForward Email SMTPを設定する {#7-configure-forward-email-smtp-in-listmonk}

次に、Forward Emailアカウントを使ってListmonkからメールを送信する設定を行います。

1. **Forward EmailでSMTPを有効化**: Forward EmailのアカウントダッシュボードでSMTP認証情報を生成してください。まだの場合は、[Forward EmailのカスタムドメインでSMTPを使ってメールを送信するガイド](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)を参照してください。
2. **Listmonkの設定**: Listmonkの管理パネルにログインします。
   * **設定 -> SMTP** に移動します。

   * ListmonkはForward Emailをネイティブサポートしています。プロバイダーリストから**ForwardEmail**を選択するか、以下の詳細を手動で入力してください：

     | 設定項目           | 値                                                                                                               |
     | :---------------- | :------------------------------------------------------------------------------------------------------------------ |
     | **ホスト**          | `smtp.forwardemail.net`                                                                                             |
     | **ポート**          | `465`                                                                                                               |
     | **認証プロトコル** | `LOGIN`                                                                                                             |
     | **ユーザー名**      | Forward Emailの**SMTPユーザー名**                                                                                   |
     | **パスワード**      | Forward Emailの**SMTPパスワード**                                                                                   |
     | **TLS**             | `SSL/TLS`                                                                                                           |
     | **送信元メール**    | 希望する`From`アドレス（例：`newsletter@yourdomain.com`）。このドメインがForward Emailで設定されていることを確認してください。 |
* **重要**: Forward Emailでの安全な接続には常にポート`465`と`SSL/TLS`を使用してください（推奨）。ポート`587`のSTARTTLSもサポートされていますが、SSL/TLSの使用が推奨されます。

   * **保存**をクリックします。
3. **テストメール送信**: SMTP設定ページ内の「テストメール送信」ボタンを使用します。アクセス可能な受信者アドレスを入力し、**送信**をクリックします。メールが受信者の受信箱に届くことを確認してください。

### 8. バウンス処理の設定 {#8-configure-bounce-processing}

バウンス処理により、Listmonkは配信できなかったメール（例：無効なアドレスなど）を自動的に処理できます。Forward EmailはバウンスをListmonkに通知するためのWebhookを提供しています。

#### Forward Emailの設定 {#forward-email-setup}

1. [Forward Emailダッシュボード](https://forwardemail.net/)にログインします。
2. **Domains**に移動し、送信に使用しているドメインを選択して**Settings**ページに進みます。
3. 下にスクロールして**Bounce Webhook URL**セクションを見つけます。
4. 以下のURLを入力します。`<your_listmonk_domain>`はListmonkインスタンスがアクセス可能な実際のドメインまたはサブドメインに置き換えてください：
   ```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
   *例*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. さらに下にスクロールして**Webhook Signature Payload Verification Key**セクションを見つけます。
6. 生成された検証キーを**コピー**します。これはListmonkで必要になります。
7. Forward Emailのドメイン設定で変更を保存します。

#### Listmonkの設定 {#listmonk-setup}

1. Listmonkの管理パネルで**Settings -> Bounces**に移動します。
2. **Enable bounce processing**を有効にします。
3. **Enable bounce webhooks**を有効にします。
4. 下にスクロールして**Webhook Providers**セクションを見つけます。
5. **Forward Email**を有効にします。
6. Forward Emailダッシュボードからコピーした**Webhook Signature Payload Verification Key**を**Forward Email Key**フィールドに貼り付けます。
7. ページ下部の**保存**をクリックします。
8. これでバウンス処理が設定されました！Forward EmailがListmonkから送信されたメールのバウンスを検出すると、Webhookを通じてListmonkに通知し、Listmonkは該当する購読者を適切にマークします。
9. 以下の[テスト](#testing)の手順を完了して、すべてが正常に動作していることを確認してください。


## テスト {#testing}

Listmonkの主要な機能の概要は以下の通りです：

### メーリングリストの作成 {#create-a-mailing-list}

* サイドバーの**Lists**に移動します。
* **New List**をクリックします。
* 詳細（名前、タイプ：公開/非公開、説明、タグ）を入力し、**保存**します。

### 購読者の追加 {#add-subscribers}

* **Subscribers**セクションに移動します。
* 購読者を追加できます：
  * **手動で**: **New Subscriber**をクリックします。
  * **インポート**: **Import Subscribers**をクリックしてCSVファイルをアップロードします。
  * **API**: Listmonk APIを使用してプログラム的に追加します。
* 作成またはインポート時に購読者を1つ以上のリストに割り当てます。
* **ベストプラクティス**: ダブルオプトインプロセスを使用してください。これは**Settings -> Opt-in & Subscriptions**で設定できます。

### キャンペーンの作成と送信 {#create-and-send-a-campaign}

* **Campaigns** -> **New Campaign**に移動します。
* キャンペーンの詳細（名前、件名、送信元メール、送信先リスト）を入力します。
* コンテンツタイプ（リッチテキスト/HTML、プレーンテキスト、生HTML）を選択します。
* メールコンテンツを作成します。`{{ .Subscriber.Email }}`や`{{ .Subscriber.FirstName }}`などのテンプレート変数を使用できます。
* **必ず最初にテストメールを送信してください！** 「テスト送信」オプションを使って受信箱でメールをプレビューします。
* 満足したら、**Start Campaign**をクリックして即時送信するか、後でスケジュールします。


## 検証 {#verification}

* **SMTP配信**: ListmonkのSMTP設定ページやテストキャンペーンを使って定期的にテストメールを送信し、メールが正しく配信されているか確認します。
* **バウンス処理**: 実際に存在しないメールアドレス（例：`bounce-test@yourdomain.com`、実際にない場合でも結果は異なる可能性があります）にテストキャンペーンを送信します。しばらくしてListmonkのキャンペーン統計でバウンスが記録されているか確認します。
* **メールヘッダー**: [Mail-Tester](https://www.mail-tester.com/)などのツールを使うか、メールヘッダーを手動で確認して、SPF、DKIM、DMARCが通過しているかを検証し、Forward Email経由の適切な設定を確認します。
* **Forward Emailログ**: SMTPサーバー由来の配信問題が疑われる場合は、Forward Emailダッシュボードのログを確認してください。
## Developer Notes {#developer-notes}

* **テンプレート**: ListmonkはGoのテンプレートエンジンを使用しています。高度なパーソナライズにはそのドキュメントを参照してください: `{{ .Subscriber.Attribs.your_custom_field }}`。
* **API**: Listmonkはリスト、購読者、キャンペーン、テンプレートなどを管理するための包括的なREST APIを提供しています。APIドキュメントへのリンクはListmonkインスタンスのフッターにあります。
* **カスタムフィールド**: 追加データを保存するために、**設定 -> 購読者フィールド**でカスタム購読者フィールドを定義してください。
* **Webhook**: バウンス以外にも、Listmonkは他のイベント（例：購読）に対してWebhookを送信でき、他のシステムとの連携が可能です。


## Conclusion {#conclusion}

セルフホスト型のListmonkのパワーと、Forward Emailの安全でプライバシーを尊重した配信を組み合わせることで、堅牢で倫理的なメールマーケティングプラットフォームを構築できます。オーディエンスデータの完全な所有権を維持しつつ、高い配信成功率と自動化されたセキュリティ機能の恩恵を受けられます。

このセットアップは、スケーラブルでコスト効率が高く、開発者に優しいプロプライエタリなメールサービスの代替手段を提供し、オープンソースソフトウェアとユーザープライバシーの理念に完全に合致します。

Happy Sending! 🚀
