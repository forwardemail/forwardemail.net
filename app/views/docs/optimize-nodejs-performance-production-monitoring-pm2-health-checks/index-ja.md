# Node.jsの本番環境インフラストラクチャを最適化する方法：ベストプラクティス {#how-to-optimize-nodejs-production-infrastructure-best-practices}

<img loading="lazy" src="/img/articles/nodejs-performance.webp" alt="Node.js performance optimization guide" class="rounded-lg" />

## 目次 {#table-of-contents}

* [序文](#foreword)
* [573%のシングルコアパフォーマンス最適化革命](#our-573-single-core-performance-optimization-revolution)
  * [Node.js においてシングルコアパフォーマンスの最適化が重要な理由](#why-single-core-performance-optimization-matters-for-nodejs)
  * [関連コンテンツ](#related-content)
* [Node.jsの本番環境のセットアップ：私たちのテクノロジースタック](#nodejs-production-environment-setup-our-technology-stack)
  * [パッケージマネージャー: 生産効率を高めるpnpm](#package-manager-pnpm-for-production-efficiency)
  * [Webフレームワーク：最新のNode.js制作のためのKoa](#web-framework-koa-for-modern-nodejs-production)
  * [バックグラウンドジョブ処理：本番環境の信頼性を高める Bree](#background-job-processing-bree-for-production-reliability)
  * [エラー処理: 実稼働環境の信頼性を高める @hapi/boom](#error-handling-hapiboom-for-production-reliability)
* [本番環境でNode.jsアプリケーションを監視する方法](#how-to-monitor-nodejs-applications-in-production)
  * [システムレベルの Node.js 運用監視](#system-level-nodejs-production-monitoring)
  * [Node.js 本番環境向けアプリケーションレベル監視](#application-level-monitoring-for-nodejs-production)
  * [アプリケーション固有の監視](#application-specific-monitoring)
* [PM2ヘルスチェックによるNode.js本番環境監視](#nodejs-production-monitoring-with-pm2-health-checks)
  * [PM2ヘルスチェックシステム](#our-pm2-health-check-system)
  * [PM2生産構成](#our-pm2-production-configuration)
  * [自動PM2展開](#automated-pm2-deployment)
* [生産エラー処理および分類システム](#production-error-handling-and-classification-system)
  * [本番環境向けisCodeBug実装](#our-iscodebug-implementation-for-production)
  * [当社のプロダクションログとの統合](#integration-with-our-production-logging)
  * [関連コンテンツ](#related-content-1)
* [v8-profiler-nextとcpuproを使用した高度なパフォーマンスデバッグ](#advanced-performance-debugging-with-v8-profiler-next-and-cpupro)
  * [Node.jsプロダクション向けのプロファイリングアプローチ](#our-profiling-approach-for-nodejs-production)
  * [ヒープスナップショット分析の実装方法](#how-we-implement-heap-snapshot-analysis)
  * [パフォーマンスデバッグワークフロー](#performance-debugging-workflow)
  * [Node.jsアプリケーションに推奨される実装](#recommended-implementation-for-your-nodejs-application)
  * [生産監視との統合](#integration-with-our-production-monitoring)
* [Node.js の本番環境インフラストラクチャのセキュリティ](#nodejs-production-infrastructure-security)
  * [Node.jsの本番環境におけるシステムレベルのセキュリティ](#system-level-security-for-nodejs-production)
  * [Node.js アプリケーションのアプリケーションセキュリティ](#application-security-for-nodejs-applications)
  * [インフラストラクチャセキュリティの自動化](#infrastructure-security-automation)
  * [セキュリティコンテンツ](#our-security-content)
* [Node.js アプリケーション向けデータベースアーキテクチャ](#database-architecture-for-nodejs-applications)
  * [Node.jsプロダクション向けのSQLite実装](#sqlite-implementation-for-nodejs-production)
  * [Node.js の本番環境向け MongoDB 実装](#mongodb-implementation-for-nodejs-production)
* [Node.js プロダクションのバックグラウンドジョブ処理](#nodejs-production-background-job-processing)
  * [実稼働環境向けの Bree Server のセットアップ](#our-bree-server-setup-for-production)
  * [生産ジョブの例](#production-job-examples)
  * [Node.jsプロダクション向けのジョブスケジューリングパターン](#our-job-scheduling-patterns-for-nodejs-production)
* [本番環境 Node.js アプリケーションの自動メンテナンス](#automated-maintenance-for-production-nodejs-applications)
  * [クリーンアップの実装](#our-cleanup-implementation)
  * [Node.js プロダクションのディスクスペース管理](#disk-space-management-for-nodejs-production)
  * [インフラメンテナンスの自動化](#infrastructure-maintenance-automation)
* [Node.js 本番環境デプロイメント実装ガイド](#nodejs-production-deployment-implementation-guide)
  * [実際のコードから本番環境のベストプラクティスを学ぶ](#study-our-actual-code-for-production-best-practices)
  * [ブログ投稿から学ぶ](#learn-from-our-blog-posts)
  * [Node.jsプロダクション向けインフラストラクチャ自動化](#infrastructure-automation-for-nodejs-production)
  * [ケーススタディ](#our-case-studies)
* [結論: Node.jsの本番環境へのデプロイのベストプラクティス](#conclusion-nodejs-production-deployment-best-practices)
* [Node.js プロダクションの完全なリソースリスト](#complete-resource-list-for-nodejs-production)
  * [コア実装ファイル](#our-core-implementation-files)
  * [当社のサーバー実装](#our-server-implementations)
  * [インフラストラクチャ自動化](#our-infrastructure-automation)
  * [技術ブログ投稿](#our-technical-blog-posts)
  * [当社の企業事例](#our-enterprise-case-studies)

## 序文 {#foreword}

Forward Emailでは、Node.jsの本番環境構築に長年を費やし、完璧な環境づくりに努めてきました。この包括的なガイドでは、パフォーマンスの最適化、監視、そしてNode.jsアプリケーションをスケールアップして毎日数百万件ものトランザクションを処理する際に得られた教訓に焦点を当て、実戦で実証されたNode.jsの本番環境導入のベストプラクティスを共有します。

## 573% シングルコアパフォーマンス最適化革命 {#our-573-single-core-performance-optimization-revolution}

Intel プロセッサから AMD Ryzen プロセッサに移行した結果、Node.js アプリケーションで **573% のパフォーマンス向上** を達成しました。これは単なる小さな最適化ではなく、Node.js アプリケーションの運用環境におけるパフォーマンスを根本的に変えるものであり、あらゆる Node.js アプリケーションにおいてシングルコアパフォーマンスの最適化がいかに重要であるかを実証しています。

> \[!TIP]
> Node.jsの本番環境導入のベストプラクティスでは、ハードウェアの選択が非常に重要です。JavaScriptの実行はシングルスレッドであるため、Node.jsアプリケーションではシングルコアのパフォーマンスが不可欠であり、AMD Ryzenを利用できるという理由から、DataPacketホスティングを選択しました。

### Node.js においてシングルコアパフォーマンスの最適化が重要な理由 {#why-single-core-performance-optimization-matters-for-nodejs}

Intel から AMD Ryzen への移行の結果、次のようになりました。

* リクエスト処理における**パフォーマンスが573%向上** ([ステータスページのGitHub Issue #1519](https://github.com/forwardemail/status.forwardemail.net/issues/1519#issuecomment-2652177671))
* **処理遅延を解消**し、ほぼ瞬時の応答を実現([GitHub Issue #298](https://github.com/forwardemail/forwardemail.net/issues/298))
* Node.jsの本番環境における**価格性能比の向上**
* すべてのアプリケーションエンドポイントにおける**応答時間の改善**

パフォーマンスの向上は非常に大きく、Webアプリケーション、API、マイクロサービス、その他のNode.jsワークロードを実行する場合でも、本格的なNode.jsの本番環境展開にはAMD Ryzenプロセッサーが不可欠であると考えています。

### 関連コンテンツ {#related-content}

当社のインフラストラクチャの選択に関する詳細は、以下をご覧ください。

* [最高のメール転送サービス]](https://forwardemail.net/blog/docs/best-email-forwarding-service) - パフォーマンス比較に記載)
* [セルフホストソリューション](https://forwardemail.net/blog/docs/self-hosted-solution) - ハードウェア推奨事項

## Node.js本番環境のセットアップ: 当社のテクノロジースタック {#nodejs-production-environment-setup-our-technology-stack}

Node.jsの本番環境へのデプロイにおけるベストプラクティスには、長年の運用経験に基づいた慎重なテクノロジー選択が含まれています。以下では、私たちが使用しているテクノロジーと、これらの選択があらゆるNode.jsアプリケーションに適用される理由についてご説明します。

### パッケージマネージャー: 生産効率のためのpnpm {#package-manager-pnpm-for-production-efficiency}

**使用方法:** [`pnpm`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) (固定バージョン)

私たちが Node.js の実稼働環境のセットアップに npm と yarn ではなく pnpm を選択したのは、次の理由からです。

* CI/CDパイプラインでの**インストール時間の短縮**
* ハードリンクによる**ディスク容量の効率化**
* ファントム依存関係を防ぐ**厳密な依存関係解決**
* 本番環境デプロイメントでの**パフォーマンス向上**

> \[!NOTE]
> Node.jsの本番環境デプロイメントのベストプラクティスの一環として、pnpmなどの重要なツールの正確なバージョンを固定することで、すべての環境とチームメンバーのマシン間で一貫した動作を確保しています。

**実装の詳細:**

* [package.json の設定](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [NPMエコシステムに関するブログ投稿](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)

### Webフレームワーク: 最新のNode.jsプロダクション向けKoa {#web-framework-koa-for-modern-nodejs-production}

**私たちが使用するもの:**

* [`@koa/router`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@koa/multer`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/koa-simple-ratelimit`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

Node.jsの本番環境インフラとして、ExpressではなくKoaを選択しました。その理由は、最新のasync/awaitサポートと、よりクリーンなミドルウェア構成です。当社の創設者であるNick Baughは、ExpressとKoaの両方に貢献し、本番環境における両フレームワークの深い知見を私たちに与えてくれました。

これらのパターンは、REST API、GraphQL サーバー、Web アプリケーション、マイクロサービスなどを構築する場合に適用されます。

**当社の実装例:**

* [Webサーバーのセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [APIサーバーの構成](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [お問い合わせフォーム実装ガイド](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)

### バックグラウンドジョブ処理: 実稼働環境の信頼性を高める Bree {#background-job-processing-bree-for-production-reliability}

**使用方法:** [`bree`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json) スケジューラ

Bree を開発・保守しているのは、既存のジョブスケジューラが、本番環境の Node.js におけるワーカースレッドのサポートと最新の JavaScript 機能のニーズを満たしていなかったためです。これは、バックグラウンド処理、スケジュールされたタスク、またはワーカースレッドを必要とするあらゆる Node.js アプリケーションに当てはまります。

**当社の実装例:**

* [Breeサーバーのセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [すべての職務定義](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)
* [PM2ヘルスチェックジョブ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [クリーンアップジョブの実装](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### エラー処理: 実稼働環境の信頼性のための @hapi/boom {#error-handling-hapiboom-for-production-reliability}

**使用するもの:** [`@hapi/boom`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

私たちのNode.js製品版アプリケーションでは、構造化されたエラーレスポンスのために@hapi/boomを使用しています。このパターンは、一貫したエラー処理が必要なあらゆるNode.jsアプリケーションで有効です。

**当社の実装例:**

* [エラー分類ヘルパー](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ロガー実装](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

## 本番環境でのNode.jsアプリケーションの監視方法 {#how-to-monitor-nodejs-applications-in-production}

本番環境におけるNode.jsアプリケーションの監視に対する当社のアプローチは、長年にわたる大規模アプリケーション運用を通じて進化してきました。あらゆる種類のNode.jsアプリケーションの信頼性とパフォーマンスを確保するために、複数のレイヤーで監視を実装しています。

### システムレベルの Node.js 運用監視 {#system-level-nodejs-production-monitoring}

**コア実装:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

**使用するもの:** [`node-os-utils`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

当社の本番環境監視しきい値（実際の本番環境コードより）:

* **ヒープサイズ制限2GB**（自動アラート）
* **メモリ使用量25%**（警告しきい値）
* **CPU使用量80%**（警告しきい値）
* **ディスク使用量75%**（警告しきい値）

> \[!WARNING]
> これらのしきい値は、弊社の特定のハードウェア構成で機能します。Node.jsの本番環境監視を実装する際は、monitor-server.jsの実装を確認して正確なロジックを理解し、設定に合わせて値を調整してください。

### Node.js本番環境向けアプリケーションレベル監視 {#application-level-monitoring-for-nodejs-production}

**エラー分類:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

このヘルパーは次のものを区別します:

* **実際のコードバグ** はすぐに対処する必要があります
* **ユーザーエラー** は想定内の動作です
* **外部サービスの障害** は制御できません

このパターンは、Web アプリ、API、マイクロサービス、バックグラウンド サービスなど、あらゆる Node.js アプリケーションに適用されます。

**ログ記録の実装:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

当社では、Node.js 実稼働環境で便利なデバッグ機能を維持しながら機密情報を保護するために、包括的なフィールド編集を実装しています。

### アプリケーション固有の監視 {#application-specific-monitoring}

**当社のサーバー実装:**

* [SMTPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3サーバー](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

**キュー監視：** リソース枯渇を防ぐため、リクエスト処理には5GBのキュー制限と180秒のタイムアウトを実装しています。これらのパターンは、キューまたはバックグラウンド処理を使用するすべてのNode.jsアプリケーションに適用されます。

## PM2ヘルスチェックによるNode.js本番環境監視 {#nodejs-production-monitoring-with-pm2-health-checks}

長年の運用経験に基づき、PM2を活用したNode.js本番環境のセットアップを改良してきました。PM2ヘルスチェックは、あらゆるNode.jsアプリケーションの信頼性維持に不可欠です。

### PM2ヘルスチェックシステム {#our-pm2-health-check-system}

**コア実装:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

PM2 ヘルスチェックによる Node.js の本番環境監視には次のものが含まれます。

* **20分ごとに実行** cronスケジュールにより実行
* **プロセスが正常と判断されるには、最低15分の稼働時間が必要**
* **プロセスの状態とメモリ使用量を検証**
* **失敗したプロセスを自動的に再起動**
* **インテリジェントなヘルスチェックにより、再起動ループを防止**

> \[!CAUTION]
> Node.jsの本番環境デプロイのベストプラクティスでは、再起動ループを回避するため、プロセスが正常であると判断するまでに15分以上の稼働時間が必要です。これにより、プロセスがメモリ不足などの問題を抱えている場合に、連鎖的な障害が発生するのを防ぎます。

### PM2プロダクション構成 {#our-pm2-production-configuration}

**エコシステムのセットアップ:** Node.js の実稼働環境のセットアップについては、サーバー起動ファイルを参照してください。

* [ウェブサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [APIサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Breeスケジューラー](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)

これらのパターンは、Express アプリ、Koa サーバー、GraphQL API、またはその他の Node.js アプリケーションを実行している場合に適用されます。

### 自動 PM2 展開 {#automated-pm2-deployment}

**PM2 デプロイメント:** [`ansible/playbooks/node.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

当社では、すべてのサーバーにわたって一貫した Node.js の本番環境の展開を確保するために、Ansible を通じて PM2 のセットアップ全体を自動化しています。

## 生産エラー処理および分類システム {#production-error-handling-and-classification-system}

Node.js の本番環境展開における最も重要なベスト プラクティスの 1 つは、あらゆる Node.js アプリケーションに適用されるインテリジェントなエラー分類です。

### 本番環境向けisCodeBug実装 {#our-iscodebug-implementation-for-production}

**ソース:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)

このヘルパーは、運用中の Node.js アプリケーションに対してインテリジェントなエラー分類を提供し、次のことを実現します。

* **実際のバグをユーザーエラーよりも優先する**
* **実際の問題に焦点を当てることで、インシデント対応を改善する**
* **想定されるユーザーエラーによるアラート疲れを軽減する**
* **アプリケーションが原因の問題とユーザーが原因の問題を**より深く理解する**

このパターンは、eコマース サイト、SaaS プラットフォーム、API、マイクロサービスなど、あらゆる Node.js アプリケーションで機能します。

### 弊社のプロダクションログとの統合 {#integration-with-our-production-logging}

**ロガー統合:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

私たちのロガーは `isCodeBug` を使用してアラート レベルとフィールド編集を決定し、Node.js 実稼働環境のノイズを除去しながら実際の問題について通知を受けられるようにします。

### 関連コンテンツ {#related-content-1}

エラー処理パターンの詳細については、以下をご覧ください。

* [信頼できる決済システムの構築](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal) - エラー処理パターン
* [メールのプライバシー保護](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation) - セキュリティエラー処理

## v8-profiler-nextとcpuproを使用した高度なパフォーマンスデバッグ {#advanced-performance-debugging-with-v8-profiler-next-and-cpupro}

当社では、高度なプロファイリングツールを使用してヒープスナップショットを分析し、OOM（Out of Memory）問題、パフォーマンスボトルネック、そして本番環境におけるNode.jsのメモリ問題をデバッグしています。これらのツールは、メモリリークやパフォーマンス問題が発生しているNode.jsアプリケーションにとって不可欠です。

### Node.jsプロダクション向けのプロファイリングアプローチ {#our-profiling-approach-for-nodejs-production}

**推奨ツール:**

* [`v8-profiler-next`](https://www.npmjs.com/package/v8-profiler-next) - ヒープスナップショットとCPUプロファイルの生成用
* [`cpupro`](https://github.com/discoveryjs/cpupro) - CPUプロファイルとヒープスナップショットの分析用

> \[!TIP]
> v8-profiler-next と cpupro を組み合わせて使用することで、Node.js アプリケーションの包括的なパフォーマンスデバッグワークフローを構築しています。この組み合わせにより、メモリリークやパフォーマンスのボトルネックを特定し、本番環境のコードを最適化できます。

### ヒープスナップショット分析の実装方法 {#how-we-implement-heap-snapshot-analysis}

**当社の監視実装:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

当社の本番環境監視機能には、メモリしきい値を超えた際に自動的にヒープスナップショットを生成する機能が含まれています。これにより、OOM（メモリ使用量制限）の問題がアプリケーションクラッシュを引き起こす前にデバッグすることが可能になります。

**主な実装パターン:**

* ヒープサイズが2GBのしきい値を超えた場合の**自動スナップショット**
* 本番環境でのオンデマンド分析のための**シグナルベースのプロファイリング**
* スナップショットストレージを管理するための**保持ポリシー**
* 自動メンテナンスのための**クリーンアップジョブとの統合**

### パフォーマンスデバッグワークフロー {#performance-debugging-workflow}

**実際の実装を研究してください:**

* [監視サーバーの実装](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js) - ヒープ監視とスナップショット生成
* [クリーンアップジョブ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js) - スナップショットの保持とクリーンアップ
* [ロガー統合](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js) - パフォーマンスログ

### Node.jsアプリケーションに推奨される実装 {#recommended-implementation-for-your-nodejs-application}

**ヒープスナップショット分析の場合:**

1. スナップショット生成用に **v8-profiler-next をインストール**
2. 生成されたスナップショットを分析するために **cpupro を使用**
3. monitor-server.js と同様の **監視しきい値を実装**
4. スナップショットストレージを管理するために **自動クリーンアップを設定**
5. 本番環境でオンデマンドプロファイリングを行うために **シグナルハンドラーを作成**

**CPUプロファイリングの場合:**

1. 高負荷時に**CPUプロファイルを生成**する
2. **cpuproで分析**し、ボトルネックを特定する
3. **ホットパス**と最適化の機会に焦点を当てる
4. **パフォーマンス改善前後をモニタリング**する

> \[!WARNING]
> ヒープスナップショットとCPUプロファイルの生成はパフォーマンスに影響を与える可能性があります。スロットリングを実装し、特定の問題を調査する場合やメンテナンス期間中のみプロファイリングを有効にすることを推奨します。

### 生産監視との統合 {#integration-with-our-production-monitoring}

当社のプロファイリング ツールは、より広範な監視戦略と統合されています。

* メモリ/CPUしきい値に基づく**自動トリガー**
* パフォーマンス問題検出時の**アラート統合**
* パフォーマンス傾向の経時的な追跡のための**履歴分析**
* 包括的なデバッグのための**アプリケーションメトリクスとの相関分析**

このアプローチは、メモリ リークを特定して解決し、ホット コード パスを最適化し、Node.js 実稼働環境で安定したパフォーマンスを維持するのに役立ちました。

## Node.js 本番環境インフラストラクチャのセキュリティ {#nodejs-production-infrastructure-security}

Ansibleの自動化により、Node.jsの本番環境インフラストラクチャに包括的なセキュリティを実装しています。これらのプラクティスは、あらゆるNode.jsアプリケーションに適用されます。

### Node.js本番環境向けシステムレベルセキュリティ {#system-level-security-for-nodejs-production}

**Ansible 実装:** [`ansible/playbooks/security.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)

Node.js 実稼働環境における主要なセキュリティ対策:

* **スワップを無効化** し、機密データがディスクに書き込まれるのを防止
* **コアダンプを無効化** し、機密情報を含むメモリダンプを防止
* **USBストレージをブロック** し、不正なデータアクセスを防止
* **カーネルパラメータのチューニング** し、セキュリティとパフォーマンスの両方を実現

> \[!WARNING]
> Node.jsの本番環境デプロイのベストプラクティスを実装する際に、スワップを無効にすると、アプリケーションが利用可能なRAM容量を超えた場合にメモリ不足による強制終了が発生する可能性があります。私たちはメモリ使用量を注意深く監視し、サーバーのサイズを適切に調整しています。

### Node.jsアプリケーションのアプリケーションセキュリティ {#application-security-for-nodejs-applications}

**ログフィールドの編集:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)

パスワード、トークン、APIキー、個人情報といった機密性の高いフィールドをログから削除します。これにより、ユーザーのプライバシーを保護しながら、あらゆるNode.js本番環境におけるデバッグ機能を維持できます。

### インフラストラクチャセキュリティ自動化 {#infrastructure-security-automation}

**Node.js 本番環境向けの完全な Ansible セットアップ:**

* [セキュリティプレイブック](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [SSHキー管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/ssh-keys.yml)
* [証明書管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/certificates.yml)
* [DKIMの設定](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/dkim.yml)

### セキュリティコンテンツ {#our-security-content}

当社のセキュリティアプローチの詳細については、以下をご覧ください。

* [最高のセキュリティ監査会社](https://forwardemail.net/blog/docs/best-security-audit-companies)
* [量子耐性暗号化メール](https://forwardemail.net/blog/docs/best-quantum-safe-encrypted-email-service)
* [オープンソースのメールセキュリティの理由](https://forwardemail.net/blog/docs/why-open-source-email-security-privacy)

## Node.jsアプリケーション向けデータベースアーキテクチャ {#database-architecture-for-nodejs-applications}

私たちは、Node.jsアプリケーション向けに最適化されたハイブリッドデータベースアプローチを採用しています。これらのパターンは、あらゆるNode.jsアプリケーションに適用できます。

### Node.jsプロダクション向けSQLite実装 {#sqlite-implementation-for-nodejs-production}

**私たちが使用するもの:**

* [`better-sqlite3`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`better-sqlite3-multiple-ciphers`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**当社の構成:** [`ansible/playbooks/sqlite.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

Node.js アプリケーションでは、ユーザー固有のデータに SQLite を使用します。SQLite には次の機能があるためです。

* ユーザー/テナントごとの**データ分離**
* 単一ユーザークエリの**パフォーマンス向上**
* **バックアップと移行の簡素化**
* 共有データベースに比べて**複雑さの軽減**

このパターンは、SaaS アプリケーション、マルチテナント システム、またはデータ分離が必要な Node.js アプリケーションに適しています。

### Node.jsプロダクション向けMongoDB実装 {#mongodb-implementation-for-nodejs-production}

**私たちが使用するもの:**

* [`@ladjs/mongoose`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@ladjs/mongoose-error-messages`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [`@zainundin/mongoose-factory`](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)

**セットアップ実装:** [`helpers/setup-mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/setup-mongoose.js)

**当社の構成:** [`config/mongoose.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/mongoose.js)

Node.js 実稼働環境でのアプリケーション データに MongoDB を使用する理由は、次のとおりです。

* 進化するデータ構造に対応する**柔軟なスキーマ**
* 複雑なクエリに対する**優れたパフォーマンス**
* **水平スケーリング**機能
* **豊富なクエリ言語**

> \[!NOTE]
> 当社のハイブリッドアプローチは、特定のユースケースに合わせて最適化されています。コードベースにおける実際のデータベース使用パターンを調査し、このアプローチがお客様のNode.jsアプリケーションのニーズに適合するかどうかをご確認ください。

## Node.js 本番環境バックグラウンドジョブ処理 {#nodejs-production-background-job-processing}

Breeをベースにバックグラウンドジョブアーキテクチャを構築することで、信頼性の高いNode.jsの本番環境へのデプロイを実現しました。これは、バックグラウンド処理を必要とするあらゆるNode.jsアプリケーションに当てはまります。

### 本番環境向け Bree サーバーのセットアップ {#our-bree-server-setup-for-production}

**主な実装:** [`bree.js`](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)

**Ansible のデプロイメント:** [`ansible/playbooks/bree.yml`](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/bree.yml)

### 実稼働ジョブの例 {#production-job-examples}

**ヘルスモニタリング:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

**クリーンアップの自動化:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

**すべての求人:** [求人情報一覧を閲覧する](https://github.com/forwardemail/forwardemail.net/tree/master/jobs)

これらのパターンは、以下を必要とするあらゆる Node.js アプリケーションに適用されます。

* スケジュールされたタスク（データ処理、レポート作成、クリーンアップ）
* バックグラウンド処理（画像のサイズ変更、メール送信、データのインポート）
* ヘルスモニタリングとメンテナンス
* CPU負荷の高いタスクにおけるワーカースレッドの利用

### Node.jsプロダクション向けのジョブスケジューリングパターン {#our-job-scheduling-patterns-for-nodejs-production}

次の点を理解するために、ジョブ ディレクトリで実際のジョブ スケジューリング パターンを調べてください。

* Node.jsの本番環境でcronのようなスケジューリングを実装する方法
* エラー処理と再試行ロジック
* CPU負荷の高いタスクでワーカースレッドを使用する方法

## 本番環境 Node.js アプリケーションの自動メンテナンス {#automated-maintenance-for-production-nodejs-applications}

Node.jsの本番環境でよくある問題を防ぐため、プロアクティブなメンテナンスを実施しています。以下のパターンは、あらゆるNode.jsアプリケーションに適用されます。

### クリーンアップ実装 {#our-cleanup-implementation}

**ソース:** [`jobs/cleanup-tmp.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

Node.js の本番アプリケーションに対する自動メンテナンスのターゲット:

* **一時ファイル** 24時間以上経過
* **ログファイル** 保存期間の制限を超えたもの
* **キャッシュファイル** と一時データ
* **アップロード済みファイル** のうち不要になったもの
* **パフォーマンスデバッグからのヒープスナップショット**

これらのパターンは、一時ファイル、ログ、またはキャッシュされたデータを生成するすべての Node.js アプリケーションに適用されます。

### Node.jsプロダクションのディスクスペース管理 {#disk-space-management-for-nodejs-production}

**監視しきい値:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)

* バックグラウンド処理の**キュー制限**
* **ディスク使用率75%の警告しきい値**
* しきい値を超えた場合の**自動クリーンアップ**

### インフラストラクチャメンテナンス自動化 {#infrastructure-maintenance-automation}

**Node.js プロダクション向けの Ansible 自動化:**

* [環境の展開](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/env.yml)
* [デプロイメントキーの管理](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/deployment-keys.yml)

## Node.js 本番環境導入実装ガイド {#nodejs-production-deployment-implementation-guide}

### 実際のコードで本番環境のベストプラクティスを学ぶ {#study-our-actual-code-for-production-best-practices}

**Node.js の本番環境のセットアップには、次の主要ファイルから始めます:**

1. **構成:** [`config/index.js`](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
2. **監視:** [`helpers/monitor-server.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
3. **エラー処理:** [`helpers/is-code-bug.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
4. **ログ記録:** [`helpers/logger.js`](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
5. **プロセス状態:** [`jobs/check-pm2.js`](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)

### ブログ投稿から学ぶ {#learn-from-our-blog-posts}

**Node.js 制作のための技術実装ガイド:**

* [NPM パッケージエコシステム](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [決済システムの構築](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [メールプライバシーの実装](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript お問い合わせフォーム](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Reactメール統合](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)

### Node.js本番環境向けインフラストラクチャ自動化 {#infrastructure-automation-for-nodejs-production}

**Node.js の本番環境への展開を学習するための Ansible プレイブック:**

* [完全なプレイブックディレクトリ](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [セキュリティ強化](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.jsのセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)

### 事例紹介 {#our-case-studies}

**当社のエンタープライズ実装:**

* [Linux Foundation のケーススタディ](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu のケーススタディ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [卒業生向けメール転送](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)

## 結論: Node.js の本番環境デプロイメントのベストプラクティス {#conclusion-nodejs-production-deployment-best-practices}

当社の Node.js 実稼働インフラストラクチャは、以下の機能を通じて Node.js アプリケーションがエンタープライズ グレードの信頼性を実現できることを実証しています。

* **実績のあるハードウェア** (AMD Ryzenでシングルコアパフォーマンスを573%向上)
* **実績のあるNode.js本番環境監視** (特定のしきい値と自動応答機能付き)
* **スマートなエラー分類** (本番環境におけるインシデント対応を向上)
* **v8-profiler-nextとcpuproによる高度なパフォーマンスデバッグ** (OOM防止)
* **Ansible自動化による包括的なセキュリティ強化** (Ansible自動化による)
* **ハイブリッドデータベースアーキテクチャ** (アプリケーションのニーズに合わせて最適化)
* **自動メンテナンス** (Node.js本番環境でよくある問題を防ぐ)

**重要なポイント:** 一般的なベストプラクティスに従うのではなく、実際の実装ファイルとブログ記事を研究してください。私たちのコードベースは、Node.jsの本番環境へのデプロイメントに実用的なパターンを提供しており、Webアプリ、API、マイクロサービス、バックグラウンドサービスなど、あらゆるNode.jsアプリケーションに適用できます。

## Node.jsプロダクション用の完全なリソースリスト {#complete-resource-list-for-nodejs-production}

### コア実装ファイル {#our-core-implementation-files}

* [主な構成](https://github.com/forwardemail/forwardemail.net/blob/master/config/index.js)
* [パッケージの依存関係](https://github.com/forwardemail/forwardemail.net/blob/master/package.json)
* [サーバー監視](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/monitor-server.js)
* [エラー分類](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/is-code-bug.js)
* [ログシステム](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/logger.js)
* [PM2ヘルスチェック](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/check-pm2.js)
* [自動クリーンアップ](https://github.com/forwardemail/forwardemail.net/blob/master/jobs/cleanup-tmp.js)

### 当社のサーバー実装 {#our-server-implementations}

* [ウェブサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/web.js)
* [APIサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/api.js)
* [Breeスケジューラー](https://github.com/forwardemail/forwardemail.net/blob/master/bree.js)
* [SMTPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/smtp.js)
* [IMAPサーバー](https://github.com/forwardemail/forwardemail.net/blob/master/imap.js)
* [POP3サーバー](https://github.com/forwardemail/forwardemail.net/blob/master/pop3.js)

### インフラストラクチャ自動化 {#our-infrastructure-automation}

* [すべてのAnsibleプレイブック](https://github.com/forwardemail/forwardemail.net/tree/master/ansible/playbooks)
* [セキュリティ強化](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/security.yml)
* [Node.jsのセットアップ](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/node.yml)
* [データベース構成](https://github.com/forwardemail/forwardemail.net/blob/master/ansible/playbooks/sqlite.yml)

### 弊社の技術ブログ投稿 {#our-technical-blog-posts}

* [NPMエコシステム分析](https://forwardemail.net/blog/docs/how-npm-packages-billion-downloads-shaped-javascript-ecosystem)
* [決済システムの導入](https://forwardemail.net/blog/docs/building-reliable-payment-system-stripe-paypal)
* [メールプライバシー技術ガイド](https://forwardemail.net/blog/docs/email-privacy-protection-technical-implementation)
* [JavaScript お問い合わせフォーム](https://forwardemail.net/blog/docs/how-to-javascript-contact-forms-node-js)
* [Reactメール統合](https://forwardemail.net/blog/docs/send-emails-with-react-js-node-web-app)
* [セルフホストソリューションガイド](https://forwardemail.net/blog/docs/self-hosted-solution)

### エンタープライズケーススタディ {#our-enterprise-case-studies}

* [Linux Foundationの実装](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)
* [Canonical Ubuntu のケーススタディ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)
* [連邦政府のコンプライアンス](https://forwardemail.net/blog/docs/federal-government-email-service-section-889-compliant)
* [卒業生向けメールシステム](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)