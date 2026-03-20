# Node.js本番インフラの最適化方法：ベストプラクティス {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.jsパフォーマンス最適化ガイド" class="rounded-lg" />


## 目次 {#table-of-contents}

* [序文](#foreword)
* [私たちの573%シングルコアパフォーマンス最適化革命](#our-573-single-core-performance-optimization-revolution)
  * [Node.jsにおけるシングルコアパフォーマンス最適化の重要性](#why-single-core-performance-optimization-matters-for-nodejs)
  * [関連コンテンツ](#related-content)
* [Node.js本番環境構築：私たちの技術スタック](#nodejs-production-environment-setup-our-technology-stack)
  * [パッケージマネージャー：本番効率のためのpnpm](#package-manager-pnpm-for-production-efficiency)
  * [Webフレームワーク：モダンなNode.js本番向けのKoa](#web-framework-koa-for-modern-nodejs-production)
  * [バックグラウンドジョブ処理：本番信頼性のためのBree](#background-job-processing-bree-for-production-reliability)
  * [エラーハンドリング：本番信頼性のための@hapi/boom](#error-handling-hapiboom-for-production-reliability)
* [Node.jsアプリケーションの本番監視方法](#how-to-monitor-nodejs-applications-in-production)
  * [システムレベルのNode.js本番監視](#system-level-nodejs-production-monitoring)
  * [アプリケーションレベルのNode.js本番監視](#application-level-monitoring-for-nodejs-production)
  * [アプリケーション固有の監視](#application-specific-monitoring)
* [PM2ヘルスチェックによるNode.js本番監視](#nodejs-production-monitoring-with-pm2-health-checks)
  * [私たちのPM2ヘルスチェックシステム](#our-pm2-health-check-system)
  * [私たちのPM2本番構成](#our-pm2-production-configuration)
  * [自動化されたPM2デプロイ](#automated-pm2-deployment)
* [本番エラーハンドリングと分類システム](#production-error-handling-and-classification-system)
  * [本番向けのisCodeBug実装](#our-iscodebug-implementation-for-production)
  * [本番ログとの統合](#integration-with-our-production-logging)
  * [関連コンテンツ](#related-content-1)
* [v8-profiler-nextとcpuproによる高度なパフォーマンスデバッグ](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Node.js本番向けのプロファイリングアプローチ](#our-profiling-approach-for-nodejs-production)
  * [ヒープスナップショット解析の実装方法](#how-we-implement-heap-snapshot-analysis)
  * [パフォーマンスデバッグワークフロー](#performance-debugging-workflow)
  * [あなたのNode.jsアプリケーションに推奨する実装](#recommended-implementation-for-your-nodejs-application)
  * [本番監視との統合](#integration-with-our-production-monitoring)
* [Node.js本番インフラのセキュリティ](#nodejs-production-infrastructure-security)
  * [Node.js本番のシステムレベルセキュリティ](#system-level-security-for-nodejs-production)
  * [Node.jsアプリケーションのアプリケーションセキュリティ](#application-security-for-nodejs-applications)
  * [インフラセキュリティの自動化](#infrastructure-security-automation)
  * [私たちのセキュリティコンテンツ](#our-security-content)
* [Node.jsアプリケーションのデータベースアーキテクチャ](#database-architecture-for-nodejs-applications)
  * [Node.js本番向けSQLite実装](#sqlite-implementation-for-nodejs-production)
  * [Node.js本番向けMongoDB実装](#mongodb-implementation-for-nodejs-production)
* [Node.js本番バックグラウンドジョブ処理](#nodejs-production-background-job-processing)
  * [本番向けのBreeサーバー設定](#our-bree-server-setup-for-production)
  * [本番ジョブの例](#production-job-examples)
  * [Node.js本番向けのジョブスケジューリングパターン](#our-job-scheduling-patterns-for-nodejs-production)
* [本番Node.jsアプリケーションの自動メンテナンス](#automated-maintenance-for-production-nodejs-applications)
  * [私たちのクリーンアップ実装](#our-cleanup-implementation)
  * [Node.js本番のディスクスペース管理](#disk-space-management-for-nodejs-production)
  * [インフラメンテナンスの自動化](#infrastructure-maintenance-automation)
* [Node.js本番デプロイ実装ガイド](#nodejs-production-deployment-implementation-guide)
  * [本番ベストプラクティスの実際のコードを学ぶ](#study-our-actual-code-for-production-best-practices)
  * [私たちのブログ記事から学ぶ](#learn-from-our-blog-posts)
  * [Node.js本番のインフラ自動化](#infrastructure-automation-for-nodejs-production)
  * [私たちのケーススタディ](#our-case-studies)
* [結論：Node.js本番デプロイのベストプラクティス](#conclusion-nodejs-production-deployment-best-practices)
* [Node.js本番の完全リソースリスト](#complete-resource-list-for-nodejs-production)
  * [私たちのコア実装ファイル](#our-core-implementation-files)
  * [私たちのサーバー実装](#our-server-implementations)
  * [私たちのインフラ自動化](#our-infrastructure-automation)
  * [私たちの技術ブログ記事](#our-technical-blog-posts)
  * [私たちの企業向けケーススタディ](#our-enterprise-case-studies)
## 序文 {#foreword}

Forward Emailでは、Node.jsの本番環境セットアップを何年もかけて完璧にしてきました。この包括的なガイドでは、パフォーマンス最適化、監視、そして日々数百万のトランザクションを処理するためにNode.jsアプリケーションをスケールさせる中で学んだ教訓に焦点を当てた、実績のあるNode.js本番環境デプロイのベストプラクティスを共有します。


## 私たちの573%シングルコアパフォーマンス最適化革命 {#our-573-single-core-performance-optimization-revolution}

IntelからAMD Ryzenプロセッサに移行した際、Node.jsアプリケーションで**573%のパフォーマンス向上**を達成しました。これは単なる小さな最適化ではなく、Node.jsアプリケーションの本番環境でのパフォーマンスを根本的に変え、シングルコアパフォーマンス最適化があらゆるNode.jsアプリケーションにとって重要であることを示しています。

> \[!TIP]
> Node.js本番環境デプロイのベストプラクティスとして、ハードウェアの選択は非常に重要です。JavaScriptの実行がシングルスレッドであるため、シングルコアパフォーマンスがNode.jsアプリケーションにとって重要であることから、AMD Ryzenが利用可能なDataPacketホスティングを特に選びました。

### なぜNode.jsにシングルコアパフォーマンス最適化が重要なのか {#why-single-core-performance-optimization-matters-for-nodejs}

IntelからAMD Ryzenへの移行により、以下を実現しました：

* リクエスト処理での**573%のパフォーマンス向上**（[ステータスページのGitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671)に記録）
* 処理遅延の解消によりほぼ即時応答を実現（[GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298)で言及）
* Node.js本番環境における**価格対性能比の向上**
* すべてのアプリケーションエンドポイントでの応答時間の改善

このパフォーマンス向上は非常に大きく、ウェブアプリケーション、API、マイクロサービス、その他のNode.jsワークロードを運用する際には、AMD Ryzenプロセッサを真剣に検討すべき必須要素と考えています。

### 関連コンテンツ {#related-content}

インフラ選択の詳細については、以下をご覧ください：

* [最高のメール転送サービス](https://forwardemail.net/blog/docs/best-email-forwarding-service) - パフォーマンス比較
* [セルフホストソリューション](https://forwardemail.net/blog/docs/self-hosted-solution) - ハードウェア推奨


## Node.js本番環境セットアップ：私たちの技術スタック {#nodejs-production-environment-setup-our-technology-stack}

私たちのNode.js本番環境デプロイのベストプラクティスは、長年の本番運用経験に基づく意図的な技術選択を含みます。以下は私たちが使用しているものと、これらの選択があらゆるNode.jsアプリケーションに適用される理由です：

### パッケージマネージャー：本番効率のためのpnpm {#package-manager-pnpm-for-production-efficiency}

**使用しているもの：** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)（バージョン固定）

Node.js本番環境セットアップにおいてnpmやyarnよりpnpmを選んだ理由は：

* CI/CDパイプラインでの**高速なインストール時間**
* ハードリンクによる**ディスクスペースの効率化**
* 幻の依存関係を防ぐ**厳密な依存関係解決**
* 本番デプロイでの**より良いパフォーマンス**

> \[!NOTE]
> Node.js本番環境デプロイのベストプラクティスの一環として、pnpmのような重要ツールのバージョンを正確に固定し、すべての環境やチームメンバーのマシンで一貫した動作を保証しています。

**実装の詳細：**

* [package.jsonの設定](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPMエコシステムに関するブログ記事](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### ウェブフレームワーク：モダンなNode.js本番環境のためのKoa {#web-framework-koa-for-modern-nodejs-production}

**使用しているもの：**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
私たちはNode.jsの本番環境インフラストラクチャにおいて、モダンなasync/awaitサポートとよりクリーンなミドルウェア構成のためにExpressよりもKoaを選びました。創設者のNick BaughはExpressとKoaの両方に貢献しており、両フレームワークの本番利用に関する深い洞察を持っています。

これらのパターンは、REST API、GraphQLサーバー、ウェブアプリケーション、マイクロサービスの構築に関わらず適用されます。

**私たちの実装例:**

* [ウェブサーバーのセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [APIサーバーの設定](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [お問い合わせフォーム実装ガイド](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### バックグラウンドジョブ処理: 本番の信頼性のためのBree {#background-job-processing-bree-for-production-reliability}

**使用しているもの:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) スケジューラー

既存のジョブスケジューラーは、ワーカースレッドのサポートや本番Node.js環境でのモダンなJavaScript機能の要件を満たさなかったため、私たちはBreeを作成しメンテナンスしています。これはバックグラウンド処理、スケジュールされたタスク、ワーカースレッドを必要とするあらゆるNode.jsアプリケーションに適用されます。

**私たちの実装例:**

* [Breeサーバーのセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [すべてのジョブ定義](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2ヘルスチェックジョブ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [クリーンアップジョブの実装](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### エラーハンドリング: 本番の信頼性のための@hapi/boom {#error-handling-hapiboom-for-production-reliability}

**使用しているもの:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

私たちはNode.jsの本番アプリケーション全体で構造化されたエラー応答のために@hapi/boomを使用しています。このパターンは一貫したエラーハンドリングが必要なあらゆるNode.jsアプリケーションに適用されます。

**私たちの実装例:**

* [エラー分類ヘルパー](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ロガーの実装](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)


## 本番環境でのNode.jsアプリケーションの監視方法 {#how-to-monitor-nodejs-applications-in-production}

私たちのNode.jsアプリケーションの本番監視へのアプローチは、大規模にアプリケーションを運用してきた長年の経験を通じて進化してきました。あらゆるタイプのNode.jsアプリケーションの信頼性とパフォーマンスを確保するために、複数のレイヤーで監視を実装しています。

### システムレベルのNode.js本番監視 {#system-level-nodejs-production-monitoring}

**コア実装:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**使用しているもの:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

私たちの本番監視の閾値（実際の本番コードから）:

* **2GBのヒープサイズ制限** と自動アラート
* **25%のメモリ使用率** 警告閾値
* **80%のCPU使用率** アラート閾値
* **75%のディスク使用率** 警告閾値

> \[!WARNING]
> これらの閾値は私たちの特定のハードウェア構成に適しています。Node.js本番監視を実装する際は、monitor-server.jsの実装を確認し、正確なロジックを理解した上で環境に合わせて値を調整してください。

### アプリケーションレベルのNode.js本番監視 {#application-level-monitoring-for-nodejs-production}

**エラー分類:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

このヘルパーは以下を区別します:

* **即時対応が必要な実際のコードバグ**
* **予期される動作であるユーザーエラー**
* **制御不能な外部サービスの障害**

このパターンはウェブアプリ、API、マイクロサービス、バックグラウンドサービスなど、あらゆるNode.jsアプリケーションに適用されます。
**当社のログ実装:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

当社は、Node.jsの本番環境において有用なデバッグ機能を維持しつつ、機密情報を保護するために包括的なフィールドのマスキングを実装しています。

### アプリケーション固有の監視 {#application-specific-monitoring}

**当社のサーバー実装:**

* [SMTPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3サーバー](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**キュー監視:** リソース枯渇を防ぐために、5GBのキュー制限と180秒のリクエスト処理タイムアウトを実装しています。これらのパターンは、キューやバックグラウンド処理を持つ任意のNode.jsアプリケーションに適用されます。


## PM2ヘルスチェックによるNode.js本番監視 {#nodejs-production-monitoring-with-pm2-health-checks}

当社は長年の本番運用経験を通じてPM2を用いたNode.js本番環境のセットアップを洗練させてきました。PM2のヘルスチェックは、あらゆるNode.jsアプリケーションの信頼性維持に不可欠です。

### 当社のPM2ヘルスチェックシステム {#our-pm2-health-check-system}

**コア実装:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

当社のPM2ヘルスチェックによるNode.js本番監視は以下を含みます:

* **20分ごとに実行**（cronスケジューリングによる）
* **プロセスを健全とみなすには最低15分の稼働時間が必要**
* **プロセスの状態とメモリ使用量を検証**
* **失敗したプロセスを自動的に再起動**
* **インテリジェントなヘルスチェックで再起動ループを防止**

> \[!CAUTION]
> Node.js本番展開のベストプラクティスとして、再起動ループを避けるためにプロセスを健全とみなすには15分以上の稼働時間を必要としています。これはメモリ不足やその他の問題でプロセスが苦戦している際の連鎖的な障害を防ぎます。

### 当社のPM2本番構成 {#our-pm2-production-configuration}

**エコシステム設定:** Node.js本番環境セットアップのために当社のサーバースタートアップファイルを参照してください:

* [Webサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [APIサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Breeスケジューラー](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

これらのパターンは、Expressアプリ、Koaサーバー、GraphQL API、その他のNode.jsアプリケーションのいずれにも適用されます。

### 自動PM2デプロイメント {#automated-pm2-deployment}

**PM2デプロイメント:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

当社はAnsibleを通じてPM2のセットアップ全体を自動化し、すべてのサーバーで一貫したNode.js本番展開を実現しています。


## 本番エラー処理と分類システム {#production-error-handling-and-classification-system}

当社の最も価値あるNode.js本番展開ベストプラクティスの一つは、あらゆるNode.jsアプリケーションに適用可能なインテリジェントなエラー分類です:

### 本番向けisCodeBug実装 {#our-iscodebug-implementation-for-production}

**ソース:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

このヘルパーは本番環境のNode.jsアプリケーション向けにインテリジェントなエラー分類を提供し:

* **ユーザーエラーより実際のバグを優先**
* **実際の問題に注力することでインシデント対応を改善**
* **予期されるユーザーエラーによるアラート疲れを軽減**
* **アプリケーション起因とユーザー起因の問題をより良く理解**

このパターンは、eコマースサイト、SaaSプラットフォーム、API、マイクロサービスなど、あらゆるNode.jsアプリケーションに適用可能です。

### 当社の本番ログとの統合 {#integration-with-our-production-logging}

**ロガー統合:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
私たちのロガーは `isCodeBug` を使用してアラートレベルとフィールドのマスキングを判定し、Node.js の本番環境でノイズを除外しつつ実際の問題について通知を受け取れるようにしています。

### 関連コンテンツ {#related-content-1}

エラーハンドリングパターンについて詳しくはこちら：

* [信頼性の高い決済システムの構築](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - エラーハンドリングパターン
* [メールプライバシー保護](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - セキュリティエラーハンドリング


## v8-profiler-next と cpupro を使った高度なパフォーマンスデバッグ {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

本番環境でのヒープスナップショット解析や OOM（メモリ不足）問題、パフォーマンスボトルネック、Node.js のメモリ問題のデバッグに高度なプロファイリングツールを使用しています。これらのツールはメモリリークやパフォーマンス問題が発生している Node.js アプリケーションにとって不可欠です。

### Node.js 本番環境向けのプロファイリングアプローチ {#our-profiling-approach-for-nodejs-production}

**推奨ツール：**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - ヒープスナップショットと CPU プロファイルの生成用
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPU プロファイルとヒープスナップショットの解析用

> \[!TIP]
> v8-profiler-next と cpupro を組み合わせて使用することで、Node.js アプリケーションの完全なパフォーマンスデバッグワークフローを構築しています。この組み合わせにより、メモリリークやパフォーマンスボトルネックの特定と本番コードの最適化が可能になります。

### ヒープスナップショット解析の実装方法 {#how-we-implement-heap-snapshot-analysis}

**監視の実装例：** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

本番環境の監視では、メモリ閾値を超えた際に自動でヒープスナップショットを生成します。これにより、アプリケーションクラッシュ前に OOM 問題のデバッグが可能です。

**主な実装パターン：**

* ヒープサイズが 2GB の閾値を超えた際の **自動スナップショット**
* 本番環境でのオンデマンド解析のための **シグナルベースのプロファイリング**
* スナップショット保存管理のための **保持ポリシー**
* 自動メンテナンスのための **クリーンアップジョブとの統合**

### パフォーマンスデバッグワークフロー {#performance-debugging-workflow}

**実際の実装例を参照：**

* [モニターサーバー実装](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - ヒープ監視とスナップショット生成
* [クリーンアップジョブ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - スナップショットの保持とクリーンアップ
* [ロガー統合](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - パフォーマンスログ記録

### あなたの Node.js アプリケーション向け推奨実装 {#recommended-implementation-for-your-nodejs-application}

**ヒープスナップショット解析の場合：**

1. スナップショット生成のために **v8-profiler-next をインストール**
2. 生成されたスナップショットの解析に **cpupro を使用**
3. monitor-server.js に似た **監視閾値の実装**
4. スナップショット保存管理のための **自動クリーンアップ設定**
5. 本番環境でのオンデマンドプロファイリング用に **シグナルハンドラーを作成**

**CPU プロファイリングの場合：**

1. 高負荷時に **CPU プロファイルを生成**
2. cpupro で解析し **ボトルネックを特定**
3. ホットパスと最適化の機会に **注力**
4. パフォーマンス改善の前後を **モニタリング**

> \[!WARNING]
> ヒープスナップショットや CPU プロファイルの生成はパフォーマンスに影響を与える可能性があります。調査時やメンテナンスウィンドウ中のみプロファイリングを有効にし、スロットリングを実装することを推奨します。

### 本番監視との統合 {#integration-with-our-production-monitoring}

当社のプロファイリングツールは広範な監視戦略と統合されています：

* メモリ/CPU 閾値に基づく **自動トリガー**
* パフォーマンス問題検出時の **アラート連携**
* 時系列でのパフォーマンストレンドを追うための **履歴解析**
* 包括的なデバッグのための **アプリケーションメトリクスとの相関**
このアプローチにより、メモリリークの特定と解決、ホットコードパスの最適化、およびNode.js本番環境での安定したパフォーマンスの維持が可能になりました。


## Node.js本番インフラストラクチャのセキュリティ {#nodejs-production-infrastructure-security}

Ansibleの自動化を通じて、Node.js本番インフラストラクチャに対して包括的なセキュリティを実装しています。これらのプラクティスはすべてのNode.jsアプリケーションに適用されます。

### Node.js本番のシステムレベルセキュリティ {#system-level-security-for-nodejs-production}

**当社のAnsible実装:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Node.js本番環境における主なセキュリティ対策：

* **スワップ無効化**により、機密データがディスクに書き込まれるのを防止
* **コアダンプ無効化**により、機密情報を含むメモリダンプを防止
* **USBストレージのブロック**により、不正なデータアクセスを防止
* **カーネルパラメータの調整**によるセキュリティとパフォーマンスの最適化

> \[!WARNING]
> Node.js本番デプロイのベストプラクティスを実装する際、スワップを無効にすると、アプリケーションが利用可能なRAMを超えた場合にメモリ不足による強制終了が発生する可能性があります。私たちはメモリ使用量を慎重に監視し、サーバーのサイズを適切に設定しています。

### Node.jsアプリケーションのアプリケーションセキュリティ {#application-security-for-nodejs-applications}

**当社のログフィールドのマスキング:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

パスワード、トークン、APIキー、個人情報などの機密フィールドをログからマスキングしています。これにより、ユーザーのプライバシーを保護しつつ、あらゆるNode.js本番環境でのデバッグ機能を維持します。

### インフラストラクチャセキュリティの自動化 {#infrastructure-security-automation}

**Node.js本番向けの完全なAnsibleセットアップ：**

* [セキュリティプレイブック](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSHキー管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [証明書管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIM設定](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### 当社のセキュリティコンテンツ {#our-security-content}

当社のセキュリティアプローチについて詳しくはこちら：

* [最高のセキュリティ監査会社](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [量子耐性暗号化メール](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [なぜオープンソースのメールセキュリティか](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)


## Node.jsアプリケーションのデータベースアーキテクチャ {#database-architecture-for-nodejs-applications}

Node.jsアプリケーションに最適化されたハイブリッドデータベースアプローチを採用しています。これらのパターンは任意のNode.jsアプリケーションに適用可能です。

### Node.js本番向けSQLite実装 {#sqlite-implementation-for-nodejs-production}

**使用しているもの：**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**当社の設定:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Node.jsアプリケーションのユーザー固有データにはSQLiteを使用しています。理由は以下の通りです：

* **ユーザー/テナントごとのデータ分離**
* **単一ユーザークエリに対する優れたパフォーマンス**
* **バックアップとマイグレーションの簡素化**
* **共有データベースに比べた複雑さの軽減**

このパターンはSaaSアプリケーション、マルチテナントシステム、またはデータ分離が必要な任意のNode.jsアプリケーションに適しています。

### Node.js本番向けMongoDB実装 {#mongodb-implementation-for-nodejs-production}

**使用しているもの：**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
**私たちのセットアップ実装:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**私たちの設定:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

私たちはNode.jsの本番環境でアプリケーションデータにMongoDBを使用しています。なぜなら、MongoDBは以下を提供するからです：

* **柔軟なスキーマ** による進化するデータ構造への対応
* **複雑なクエリに対する優れたパフォーマンス**
* **水平スケーリング** の能力
* **豊富なクエリ言語**

> \[!NOTE]
> 私たちのハイブリッドアプローチは特定のユースケースに最適化されています。コードベース内の実際のデータベース使用パターンを調査し、このアプローチがあなたのNode.jsアプリケーションのニーズに合うかどうかを理解してください。


## Node.js本番環境のバックグラウンドジョブ処理 {#nodejs-production-background-job-processing}

私たちは信頼性の高いNode.js本番環境のデプロイのためにBreeを中心にバックグラウンドジョブアーキテクチャを構築しました。これはバックグラウンド処理が必要なあらゆるNode.jsアプリケーションに適用されます：

### 本番環境向けBreeサーバー設定 {#our-bree-server-setup-for-production}

**私たちの主な実装:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**私たちのAnsibleデプロイ:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### 本番ジョブの例 {#production-job-examples}

**ヘルスモニタリング:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**クリーンアップ自動化:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**すべてのジョブ:** [完全なジョブディレクトリを閲覧](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

これらのパターンは以下のようなNode.jsアプリケーションに適用されます：

* スケジュールされたタスク（データ処理、レポート、クリーンアップ）
* バックグラウンド処理（画像リサイズ、メール送信、データインポート）
* ヘルスモニタリングとメンテナンス
* CPU集約型タスクのためのワーカースレッド利用

### Node.js本番環境向けジョブスケジューリングパターン {#our-job-scheduling-patterns-for-nodejs-production}

ジョブディレクトリ内の実際のジョブスケジューリングパターンを調査して理解してください：

* Node.js本番環境でのcronのようなスケジューリングの実装方法
* エラーハンドリングとリトライロジック
* CPU集約型タスクに対するワーカースレッドの使用方法


## 本番Node.jsアプリケーションの自動メンテナンス {#automated-maintenance-for-production-nodejs-applications}

私たちは一般的なNode.js本番環境の問題を防ぐために積極的なメンテナンスを実施しています。これらのパターンはあらゆるNode.jsアプリケーションに適用されます：

### クリーンアップ実装 {#our-cleanup-implementation}

**ソース:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Node.js本番環境アプリケーション向けの自動メンテナンスは以下を対象としています：

* **24時間以上経過した一時ファイル**
* **保持期間を超えたログファイル**
* **キャッシュファイル** と一時データ
* **不要になったアップロードファイル**
* パフォーマンスデバッグ用の**ヒープスナップショット**

これらのパターンは一時ファイル、ログ、キャッシュデータを生成するあらゆるNode.jsアプリケーションに適用されます。

### Node.js本番環境のディスクスペース管理 {#disk-space-management-for-nodejs-production}

**私たちの監視閾値:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* バックグラウンド処理の**キュー制限**
* **75%のディスク使用率** 警告閾値
* 閾値超過時の**自動クリーンアップ**

### インフラメンテナンスの自動化 {#infrastructure-maintenance-automation}

**Node.js本番環境向けのAnsible自動化:**

* [環境デプロイ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [デプロイメントキー管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)


## Node.js本番環境デプロイ実装ガイド {#nodejs-production-deployment-implementation-guide}
### 本番環境のベストプラクティスのための実際のコードを学ぶ {#study-our-actual-code-for-production-best-practices}

**Node.js 本番環境セットアップのための重要なファイルはこちらから始めてください：**

1. **設定:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **監視:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **エラー処理:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **ログ記録:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **プロセスの健全性:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### ブログ記事から学ぶ {#learn-from-our-blog-posts}

**Node.js 本番環境の技術的実装ガイド：**

* [NPMパッケージのエコシステム](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [決済システムの構築](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [メールプライバシーの実装](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScriptコンタクトフォーム](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Reactメール統合](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js 本番環境のインフラ自動化 {#infrastructure-automation-for-nodejs-production}

**Node.js 本番環境デプロイのためのAnsibleプレイブック：**

* [プレイブックの完全ディレクトリ](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [セキュリティ強化](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.jsセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### ケーススタディ {#our-case-studies}

**当社のエンタープライズ実装例：**

* [Linux Foundation ケーススタディ](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu ケーススタディ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [卒業生メール転送](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)


## 結論：Node.js 本番環境デプロイのベストプラクティス {#conclusion-nodejs-production-deployment-best-practices}

当社の Node.js 本番インフラは、Node.js アプリケーションがエンタープライズグレードの信頼性を達成できることを示しています：

* **実証済みのハードウェア選択**（AMD Ryzen による573%のシングルコア性能最適化）
* **実戦で検証された Node.js 本番監視**、特定の閾値と自動対応を備えています
* **スマートなエラー分類**により本番環境でのインシデント対応を改善
* **v8-profiler-next と cpupro を用いた高度なパフォーマンスデバッグ**でOOMを防止
* **Ansible自動化による包括的なセキュリティ強化**
* **アプリケーションニーズに最適化されたハイブリッドデータベースアーキテクチャ**
* **一般的な Node.js 本番問題を防ぐ自動メンテナンス**

**重要なポイント：** 一般的なベストプラクティスに従うのではなく、当社の実際の実装ファイルとブログ記事を学んでください。当社のコードベースは、Webアプリ、API、マイクロサービス、バックグラウンドサービスなど、あらゆる Node.js アプリケーションに適用可能な実践的なパターンを提供します。


## Node.js 本番環境のための完全リソースリスト {#complete-resource-list-for-nodejs-production}

### 当社のコア実装ファイル {#our-core-implementation-files}

* [メイン設定](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [パッケージ依存関係](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [サーバー監視](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [エラー分類](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ログシステム](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2 健全性チェック](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [自動クリーンアップ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)
### Our Server Implementations {#our-server-implementations}

* [Webサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [APIサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Breeスケジューラー](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3サーバー](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### Our Infrastructure Automation {#our-infrastructure-automation}

* [すべてのAnsibleプレイブック](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [セキュリティ強化](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.jsセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [データベース構成](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### Our Technical Blog Posts {#our-technical-blog-posts}

* [NPMエコシステム分析](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [決済システム実装](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [メールプライバシー技術ガイド](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScriptコンタクトフォーム](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Reactメール統合](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [セルフホストソリューションガイド](https://forwardemail.net/blog/docs/self-hosted-solution)

### Our Enterprise Case Studies {#our-enterprise-case-studies}

* [Linux Foundation導入事例](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu事例研究](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [連邦政府コンプライアンス](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [卒業生メールシステム](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)
