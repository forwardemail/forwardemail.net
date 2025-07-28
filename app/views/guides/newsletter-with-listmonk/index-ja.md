# ニュースレターを安全に配信するための転送メール機能を備えたListmonk {#listmonk-with-forward-email-for-secure-newsletter-delivery}

## 目次 {#table-of-contents}

* [概要](#overview)
* [Listmonkとメール転送の理由](#why-listmonk-and-forward-email)
* [前提条件](#prerequisites)
* [インストール](#installation)
  * [1. サーバーを更新する](#1-update-your-server)
  * [2. 依存関係をインストールする](#2-install-dependencies)
  * [3. Listmonk設定をダウンロードする](#3-download-listmonk-configuration)
  * [4. ファイアウォール（UFW）を構成する](#4-configure-firewall-ufw)
  * [5. HTTPSアクセスを構成する](#5-configure-https-access)
  * [6. Listmonkを起動する](#6-start-listmonk)
  * [7. Listmonkでメール転送SMTPを設定する](#7-configure-forward-email-smtp-in-listmonk)
  * [8. バウンス処理を設定する](#8-configure-bounce-processing)
* [テスト](#testing)
  * [メーリングリストを作成する](#create-a-mailing-list)
  * [購読者を追加する](#add-subscribers)
  * [キャンペーンを作成して送信する](#create-and-send-a-campaign)
* [検証](#verification)
* [開発者ノート](#developer-notes)
* [結論](#conclusion)

## 概要 {#overview}

このガイドでは、強力なオープンソースのニュースレターおよびメーリングリスト管理ツールである[リストモンク](https://listmonk.app/)を、SMTPプロバイダーとして[メールを転送する](https://forwardemail.net/)を使用するように設定する手順を開発者向けに段階的に説明します。この組み合わせにより、安全でプライバシーが確保され、信頼性の高いメール配信を確保しながら、キャンペーンを効果的に管理できます。

* **Listmonk**: 購読者管理、リストの整理、キャンペーンの作成、パフォーマンスの追跡を行います。
* **メール転送**: セキュアなSMTPサーバーとして機能し、SPF、DKIM、DMARC、TLS暗号化などのセキュリティ機能を組み込んでメールの送信処理を行います。

これら 2 つを統合することで、Forward Email の堅牢な配信システムを活用しながら、データとインフラストラクチャを完全に制御できます。

## Listmonkとメール転送の理由 {#why-listmonk-and-forward-email}

* **オープンソース**: Listmonk と Forward Email の理念は、どちらも透明性と制御性を重視しています。Listmonk はお客様ご自身でホストし、データの所有権を持ちます。
* **プライバシー重視**: Forward Email はプライバシーを最優先に設計されており、データ保持を最小限に抑え、安全な送信に重点を置いています。
* **費用対効果が高い**: Listmonk は無料で、Forward Email は充実した無料プランと手頃な価格の有料プランを提供しているため、予算に優しいソリューションとなっています。
* **スケーラビリティ**: Listmonk は高性能で、Forward Email のインフラストラクチャは大規模な環境でも信頼性の高い配信を実現するように設計されています。
* **開発者向け**: Listmonk は堅牢な API を提供し、Forward Email は簡単な SMTP 統合と Webhook を提供します。

## 前提条件 {#prerequisites}

始める前に、次のものがあることを確認してください。

* 最新の Linux ディストリビューション（Ubuntu 20.04 以降を推奨）で動作する仮想プライベートサーバー（VPS）。CPU 1 基以上、RAM 1GB 以上（2GB 推奨）。
* プロバイダーをお探しですか？[推奨VPSリスト](https://github.com/forwardemail/awesome-mail-server-providers) をご確認ください。
* ご自身で管理するドメイン名（DNS アクセスが必要です）。
* [メールを転送する](https://forwardemail.net/) を持つアクティブなアカウント。
* VPS へのルート権限または `sudo` 権限。
* Linux のコマンドライン操作に関する基本的な知識。

## インストール {#installation}

以下の手順では、Docker と Docker Compose を使用して VPS に Listmonk をインストールする方法について説明します。

### 1. サーバーを更新する {#1-update-your-server}

システムのパッケージ リストとインストールされているパッケージが最新であることを確認します。

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 依存関係をインストールする {#2-install-dependencies}

Docker、Docker Compose、UFW (Uncomplicated Firewall) をインストールします。

```bash
sudo apt install -y docker.io docker-compose ufw
```

### 3. Listmonk設定をダウンロードする {#3-download-listmonk-configuration}

Listmonk 用のディレクトリを作成し、公式の `docker-compose.yml` ファイルをダウンロードします。

```bash
mkdir listmonk && cd listmonk
curl -Lo docker-compose.yml https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml
```

このファイルは、Listmonk アプリケーション コンテナーとそれに必要な PostgreSQL データベース コンテナーを定義します。

### 4. ファイアウォール（UFW）を構成する {#4-configure-firewall-ufw}

ファイアウォールを通過する必須トラフィック（SSH、HTTP、HTTPS）を許可します。SSHが標準以外のポートで実行される場合は、それに応じて調整してください。

```bash
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

プロンプトが表示されたら、ファイアウォールを有効にすることを確認します。

### 5. HTTPSアクセスを構成する {#5-configure-https-access}

ListmonkをHTTPS経由で実行することはセキュリティ上非常に重要です。主に2つの選択肢があります。

#### オプションA: Cloudflareプロキシの使用（シンプルさのために推奨）{#option-a-using-cloudflare-proxy-recommended-for-simplicity}

ドメインの DNS が Cloudflare によって管理されている場合は、プロキシ機能を活用して簡単に HTTPS を利用できます。

1. **DNS を指定**: Cloudflare で、Listmonk のサブドメイン (例: `listmonk.yourdomain.com`) の `A` レコードを作成し、VPS の IP アドレスを指定します。**プロキシステータス** が **プロキシ済み** (オレンジ色の雲マーク) に設定されていることを確認します。
2. **Docker Compose を変更**: ダウンロードした `docker-compose.yml` ファイルを編集します。
```bash
   sed -i 's/9000:9000/80:9000/' docker-compose.yml
   ```
これにより、Listmonk がポート 80 で内部的にアクセス可能になり、Cloudflare は HTTPS でプロキシし、セキュリティ保護できるようになります。

#### オプションB: リバースプロキシ（Nginx、Caddyなど）の使用 {#option-b-using-a-reverse-proxy-nginx-caddy-etc}

あるいは、VPS に Nginx や Caddy などのリバース プロキシを設定して、HTTPS 終了と Listmonk (デフォルトではポート 9000 で実行) へのプロキシ要求を処理することもできます。

* Listmonk がローカルからのみアクセスできるようにするため、`docker-compose.yml` にはデフォルトの `ports: - "127.0.0.1:9000:9000"` をそのまま使用します。
* 選択したリバースプロキシを、ポート 80 と 443 で listen し、SSL 証明書の取得（例：Let's Encrypt 経由）を行い、トラフィックを `http://127.0.0.1:9000` に転送するように設定します。
* リバースプロキシの詳細な設定はこのガイドの範囲外ですが、オンラインで多くのチュートリアルが利用可能です。

### 6. Listmonkを起動します {#6-start-listmonk}

`listmonk` ディレクトリに戻り (まだそこにいない場合は)、コンテナをデタッチ モードで起動します。

```bash
cd ~/listmonk # Or the directory where you saved docker-compose.yml
docker compose up -d
```

Dockerは必要なイメージをダウンロードし、Listmonkアプリケーションとデータベースコンテナを起動します。初回は1～2分かかる場合があります。

✅ **Listmonk にアクセス**: これで、設定したドメイン (例: `https://listmonk.yourdomain.com`) 経由で Listmonk Web インターフェースにアクセスできるようになります。

### 7. Listmonkでメール転送SMTPを設定する {#7-configure-forward-email-smtp-in-listmonk}

次に、転送メール アカウントを使用してメールを送信するように Listmonk を設定します。

1. **転送メールでSMTPを有効にする**：転送メールアカウントのダッシュボードでSMTP認証情報を生成していることを確認してください。まだ生成していない場合は、[SMTP経由でカスタムドメインのメールを送信するためのメール転送ガイド](https://forwardemail.net/en/guides/send-email-with-custom-domain-smtp)の手順に従ってください。
2. **Listmonkを設定する**：Listmonk管理パネルにログインします。
* **設定 -> SMTP** に移動します。

* Listmonkにはメール転送機能が組み込まれています。プロバイダーリストから**ForwardEmail**を選択するか、以下の情報を手動で入力してください。

| 設定 | 価値 |
| :---------------- | :------------------------------------------------------------------------------------------------------------------ |
| **ホスト** | `smtp.forwardemail.net` |
| **ポート** | `465` |
| **認証プロトコル** | `LOGIN` |
| **ユーザー名** | 転送メールの**SMTPユーザー名** |
| **パスワード** | 転送メールの**SMTPパスワード** |
| **TLS** | `SSL/TLS` |
| **メールから** | ご希望の`From`アドレス（例：`newsletter@yourdomain.com`）。このドメインがメール転送に設定されていることを確認してください。 |

* **重要**: メール転送機能で安全な接続を行うには、必ず`465`ポートと`SSL/TLS`ポートを使用してください。STARTTLS（ポート587）は使用しないでください。

* **保存** をクリックします。
3. **テストメールを送信**：SMTP設定ページ内の「テストメールを送信」ボタンを使用します。アクセスできる受信者のアドレスを入力し、**送信** をクリックします。メールが受信者の受信トレイに届くことを確認します。

### 8. バウンス処理を設定する {#8-configure-bounce-processing}

バウンス処理により、Listmonk は配信できなかったメール（例：無効なアドレス）を自動的に処理できます。Forward Email は、バウンスを Listmonk に通知する Webhook を提供します。

#### メール転送設定 {#forward-email-setup}

1. [メール転送ダッシュボード](https://forwardemail.net/) にログインします。
2. **ドメイン** に移動し、送信に使用しているドメインを選択して、**設定** ページに移動します。
3. **バウンス Webhook URL** セクションまでスクロールします。
4. 次の URL を入力します。`<your_listmonk_domain>` は、Listmonk インスタンスにアクセスできる実際のドメインまたはサブドメインに置き換えてください。
```sh
   https://<your_listmonk_domain>/webhooks/service/forwardemail
   ```
*例*: `https://listmonk.yourdomain.com/webhooks/service/forwardemail`
5. さらに下にスクロールして、**Webhook 署名ペイロード検証キー** セクションに移動します。
6. 生成された検証キーを**コピー**します。このキーは Listmonk で必要になります。
7. 転送メールのドメイン設定で変更を保存します。

#### Listmonk セットアップ {#listmonk-setup}

1. Listmonk 管理パネルで、**「設定」->「バウンス」** に移動します。
2. **「バウンス処理を有効にする」** を有効にします。
3. **「バウンス Webhook を有効にする」** を有効にします。
4. **「Webhook プロバイダー」** セクションまで下にスクロールします。
5. **「メール転送」** を有効にします。
6. 「メール転送」ダッシュボードからコピーした **「Webhook 署名ペイロード検証キー」** を「メール転送キー」** フィールドに貼り付けます。
7. ページ下部の **「保存」** をクリックします。
8. これでバウンス処理が設定されました。Forward Email が Listmonk から送信されたメールのバウンスを検出すると、Webhook 経由で Listmonk インスタンスに通知され、Listmonk はそれに応じて購読者にマークを付けます。
9. [テスト](#testing) で以下の手順を完了し、すべてが機能していることを確認します。

## テスト {#testing}

以下は、Listmonk のコア機能の概要です。

### メーリングリストを作成する {#create-a-mailing-list}

* サイドバーの「**リスト**」に移動します。
* 「**新しいリスト**」をクリックします。
* 詳細（名前、タイプ：公開/非公開、説明、タグ）を入力し、「**保存**」します。

### 購読者を追加 {#add-subscribers}

* **「購読者」**セクションに移動します。
* 購読者を追加するには、以下の方法があります。
* **手動**: **「新しい購読者」**をクリックします。
* **インポート**: **「購読者のインポート」**をクリックしてCSVファイルをアップロードします。
* **API**: プログラムによる追加にはListmonk APIを使用します。
* 作成時またはインポート時に、購読者を1つ以上のリストに割り当てます。
* **ベストプラクティス**: ダブルオプトインプロセスを使用します。これは**[設定] -> [オプトインと購読]**で設定できます。

### キャンペーンを作成して送信する {#create-and-send-a-campaign}

* **キャンペーン** -> **新しいキャンペーン** に移動します。
* キャンペーンの詳細（名前、件名、送信元メール、送信先リスト）を入力します。
* コンテンツタイプ（リッチテキスト/HTML、プレーンテキスト、HTML）を選択します。
* メールの本文を作成します。`{{ .Subscriber.Email }}` や `{{ .Subscriber.FirstName }}` などのテンプレート変数を使用できます。
* **必ず最初にテストメールを送信してください！** 「テスト送信」オプションを使用して、受信トレイでメールをプレビューします。
* 問題がなければ、**キャンペーンを開始** をクリックしてすぐに送信するか、後で送信するようにスケジュールを設定します。

## 検証 {#verification}

* **SMTP配信**: ListmonkのSMTP設定ページから定期的にテストメールを送信し、キャンペーンをテストして、メールが正しく配信されていることを確認してください。
* **バウンス処理**: 無効なメールアドレス（例：`bounce-test@yourdomain.com`。実際のメールアドレスがない場合は、`bounce-test@yourdomain.com`。ただし、結果は異なる場合があります）にテストキャンペーンを送信します。しばらくしてからListmonkでキャンペーンの統計情報を確認し、バウンスが登録されているかどうかを確認してください。
* **メールヘッダー**: [メールテスター](https://www.mail-tester.com/)などのツールを使用するか、メールヘッダーを手動で検査して、SPF、DKIM、DMARCが適切に設定されていることを確認してください。これは、転送メールが適切に設定されていることを示しています。
* **転送メールログ**: SMTPサーバーに起因する配信の問題が疑われる場合は、転送メールダッシュボードのログを確認してください。

## 開発者ノート {#developer-notes}

* **テンプレート**: Listmonk は Go のテンプレートエンジンを使用しています。高度なパーソナライゼーションについては、ドキュメント `{{ .Subscriber.Attribs.your_custom_field }}` をご覧ください。
* **API**: Listmonk は、リスト、購読者、キャンペーン、テンプレートなどを管理するための包括的な REST API を提供しています。API ドキュメントへのリンクは、Listmonk インスタンスのフッターにあります。
* **カスタムフィールド**: **[設定] -> [購読者フィールド]** でカスタム購読者フィールドを定義し、追加データを保存できます。
* **Webhook**: バウンス以外にも、Listmonk は他のイベント（購読など）に対して Webhook を送信できるため、他のシステムとの統合が可能です。

## 結論 {#conclusion}

Listmonkのセルフホスティング機能と、Forward Emailの安全でプライバシーに配慮した配信機能を統合することで、堅牢かつ倫理的なメールマーケティングプラットフォームを構築できます。高い配信率と自動化されたセキュリティ機能のメリットを享受しながら、オーディエンスデータの完全な所有権を維持できます。

このセットアップは、オープンソース ソフトウェアとユーザーのプライバシーの精神に完全に合致し、独自の電子メール サービスに代わる、スケーラブルでコスト効率が高く、開発者に優しい代替手段を提供します。

送信していただきありがとうございます！🚀