# セルフホストリリース {#self-hosted-releases}

このセクションでは、ForwardEmail のセルフホスト ソリューションの CI/CD ワークフローについて説明し、Docker イメージの構築、公開、およびデプロイの方法を説明します。

## 目次 {#table-of-contents}

* [概要](#overview)
* [CI/CDワークフロー](#cicd-workflow)
  * [GitHub アクションワークフロー](#github-actions-workflow)
  * [Dockerイメージの構造](#docker-image-structure)
* [展開プロセス](#deployment-process)
  * [インストール](#installation)
  * [Docker Compose の設定](#docker-compose-configuration)
* [メンテナンス機能](#maintenance-features)
  * [自動更新](#automatic-updates)
  * [バックアップと復元](#backup-and-restore)
  * [証明書の更新](#certificate-renewal)
* [バージョン管理](#versioning)
* [画像へのアクセス](#accessing-images)
* [貢献](#contributing)

## 概要 {#overview}

ForwardEmailのセルフホスト型ソリューションは、GitHub Actionsを使用して、新しいリリースが作成されるたびにDockerイメージを自動的にビルド・公開します。これらのイメージは、提供されているセットアップスクリプトを使用してユーザーが自身のサーバーにデプロイできます。

> \[!NOTE]
> [セルフホストブログ](https://forwardemail.net/blog/docs/self-hosted-solution) と [セルフホスト開発者ガイド](https://forwardemail.net/self-hosted) もございます。
>
> より詳細な手順については、[ウブントゥ](https://forwardemail.net/guides/selfhosted-on-ubuntu) または [デビアン](https://forwardemail.net/guides/selfhosted-on-debian) ベースのガイドをご覧ください。

## CI/CD ワークフロー {#cicd-workflow}

### GitHub Actions ワークフロー {#github-actions-workflow}

セルフホスト型Dockerイメージのビルドと公開プロセスは、`.github/workflows/docker-image-build-publish.yml`に定義されています。このワークフローは次のようになります。

1. **トリガー**: 新しいGitHubリリースが公開されると自動的に実行されます
2. **環境**: UbuntuでNode.js 18.20.4を使用して実行されます
3. **ビルドプロセス**:
* リポジトリのコードをチェックアウトします
* マルチプラットフォームビルド用にDocker Buildxをセットアップします
* GitHub Container Registry (GHCR)にログインします
* セルフホスト型デプロイメント用にスキーマを更新します
* `self-hosting/Dockerfile-selfhosted`を使用してDockerイメージをビルドします
* リリースバージョンと`latest`の両方でイメージにタグを付けます
* イメージをGitHub Container Registryにプッシュします

```yaml
# Key workflow steps
name: Build and Publish Self-Hosted Docker Image

on:
  release:
    types: [published]  # Trigger on new releases

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      # Setup steps...

      # Build and publish Docker image
      - name: Build / Publish Docker image to GitHub Container Registry
        run: |
          IMAGE_NAME=ghcr.io/${{ github.repository }}-selfhosted:${{ github.ref_name }}
          docker build -f self-hosting/Dockerfile-selfhosted -t $IMAGE_NAME .
          docker tag $IMAGE_NAME ghcr.io/${{ github.repository }}-selfhosted:latest
          docker push $IMAGE_NAME
          docker push ghcr.io/${{ github.repository }}-selfhosted:latest
```

### Dockerイメージ構造 {#docker-image-structure}

Docker イメージは、`self-hosting/Dockerfile-selfhosted` で定義されたマルチステージ アプローチを使用して構築されます。

1. **ビルダーステージ**:
* Node.js 20 をベースイメージとして使用します
* `SELF_HOSTED=true` 環境変数を設定します
* pnpm を使用して依存関係をインストールします
* アプリケーションを本番環境でビルドします

2. **最終ステージ**:
* よりスリムな Node.js 20 イメージを使用します
* 必要なシステム依存関係のみをインストールします
* データ保存に必要なディレクトリを作成します
* ビルダーステージからビルドされたアプリケーションをコピーします

このアプローチにより、最終的な画像のサイズとセキュリティが最適化されます。

## 展開プロセス {#deployment-process}

### インストール {#installation}

ユーザーは、提供されているセットアップ スクリプトを使用して、セルフホスト ソリューションを展開できます。

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/refs/heads/master/self-hosting/setup.sh)
```

このスクリプト:

1. リポジトリのクローンを作成する
2. 環境をセットアップする
3. DNSとファイアウォールを設定する
4. SSL証明書を生成する
5. 最新のDockerイメージをプルする
6. Docker Composeを使用してサービスを起動する

### Docker Compose 構成 {#docker-compose-configuration}

`docker-compose-self-hosted.yml` ファイルは、セルフホスト ソリューションに必要なすべてのサービスを定義します。

* **Web**: メインのWebインターフェース
* **API**: プログラムによるアクセスのためのAPIサーバー
* **SMTP**: メール送信サービス
* **IMAP/POP3**: メール取得サービス
* **MX**: メール交換サービス
* **CalDAV**: カレンダーサービス
* **CardDAV**: 連絡先サービス
* **MongoDB**: ユーザーデータ保存用データベース
* **Redis**: インメモリデータストア
* **SQLite**: メール保存用データベース

各サービスは同じ Docker イメージを使用しますが、エントリ ポイントが異なるため、モジュール式アーキテクチャが可能になり、メンテナンスが簡素化されます。

## メンテナンス機能 {#maintenance-features}

セルフホスト ソリューションには、いくつかのメンテナンス機能が含まれています。

### 自動更新 {#automatic-updates}

ユーザーは、次の自動更新を有効にすることができます。

* 最新のDockerイメージを毎晩プルする
* 更新されたイメージでサービスを再起動する
* 更新プロセスをログに記録する

```bash
# Setup auto-updates (runs at 1 AM daily)
0 1 * * * docker compose -f /path/to/docker-compose-self-hosted.yml pull && docker compose -f /path/to/docker-compose-self-hosted.yml up -d >> /var/log/autoupdate.log 2>&1
```

### バックアップと復元 {#backup-and-restore}

セットアップでは次のオプションが提供されます:

* S3互換ストレージへの定期バックアップの設定
* MongoDB、Redis、SQLiteデータのバックアップ
* 障害発生時のバックアップからの復元

### 証明書の更新 {#certificate-renewal}

SSL 証明書は、次のオプションを使用して自動的に管理されます。

* セットアップ中に新しい証明書を生成する
* 必要に応じて証明書を更新する
* メール認証用にDKIMを設定する

## バージョン管理 {#versioning}

各 GitHub リリースでは、次のタグが付けられた新しい Docker イメージが作成されます。

1. 特定のリリースバージョン（例：`v1.0.0`）
2. 最新リリースの`latest`タグ

ユーザーは、安定性のために特定のバージョンを使用するか、または `latest` タグを使用して常に最新の機能を取得するかを選択できます。

## 画像へのアクセス {#accessing-images}

Docker イメージは次の場所で公開されています:

* `ghcr.io/forwardemail/forwardemail.net-selfhosted:latest`
* `ghcr.io/forwardemail/forwardemail.net-selfhosted:v1.0.0` (バージョンタグの例)

これらのイメージをプルするには認証は必要ありません。

## 貢献 {#contributing}

セルフホスト ソリューションに貢献するには:

1. `self-hosting` ディレクトリ内の関連ファイルに変更を加える
2. 提供されている `setup.sh` スクリプトを使用して、ローカルまたは Ubuntu ベースの VPS でテストする
3. プルリクエストを送信する
4. マージされて新しいリリースが作成されると、CI ワークフローによって更新された Docker イメージが自動的にビルドされ、公開されます