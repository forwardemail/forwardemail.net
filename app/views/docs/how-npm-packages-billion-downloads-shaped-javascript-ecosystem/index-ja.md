# 10年の軌跡：私たちのnpmパッケージが10億ダウンロードを達成し、JavaScriptに与えた影響 {#a-decade-of-impact-how-our-npm-packages-hit-1-billion-downloads-and-shaped-javascript}

<img loading="lazy" src="/img/articles/npm.webp" alt="NPM packages billion downloads ecosystem" class="rounded-lg" />


## 目次 {#table-of-contents}

* [序文](#foreword)
* [私たちを信頼する先駆者たち：Isaac Z. SchlueterとForward Email](#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email)
  * [npmの創設からNode.jsリーダーシップへ](#from-npms-creation-to-nodejs-leadership)
* [コードの設計者：Nick Baughの軌跡](#the-architect-behind-the-code-nick-baughs-journey)
  * [Express技術委員会とコアへの貢献](#express-technical-committee-and-core-contributions)
  * [Koaフレームワークへの貢献](#koa-framework-contributions)
  * [個人貢献者から組織リーダーへ](#from-individual-contributor-to-organization-leader)
* [私たちのGitHub組織：イノベーションのエコシステム](#our-github-organizations-ecosystems-of-innovation)
  * [Cabin：モダンアプリケーションのための構造化ログ](#cabin-structured-logging-for-modern-applications)
  * [Spam Scanner：メール悪用との戦い](#spam-scanner-fighting-email-abuse)
  * [Bree：Worker Threadsを使ったモダンなジョブスケジューリング](#bree-modern-job-scheduling-with-worker-threads)
  * [Forward Email：オープンソースのメールインフラ](#forward-email-open-source-email-infrastructure)
  * [Lad：必須のKoaユーティリティとツール](#lad-essential-koa-utilities-and-tools)
  * [Upptime：オープンソースの稼働監視](#upptime-open-source-uptime-monitoring)
* [Forward Emailエコシステムへの貢献](#our-contributions-to-the-forward-email-ecosystem)
  * [パッケージから本番環境へ](#from-packages-to-production)
  * [フィードバックループ](#the-feedback-loop)
* [Forward Emailのコア原則：卓越性の基盤](#forward-emails-core-principles-a-foundation-for-excellence)
  * [常に開発者フレンドリーで、セキュリティ重視、透明性を保つ](#always-developer-friendly-security-focused-and-transparent)
  * [時代を超えたソフトウェア開発原則の遵守](#adherence-to-time-tested-software-development-principles)
  * [苦労するブートストラップ開発者をターゲットに](#targeting-the-scrappy-bootstrapped-developer)
  * [実践における原則：Forward Emailコードベース](#principles-in-practice-the-forward-email-codebase)
  * [プライバシー・バイ・デザイン](#privacy-by-design)
  * [持続可能なオープンソース](#sustainable-open-source)
* [数字は嘘をつかない：驚異的なnpmダウンロード統計](#the-numbers-dont-lie-our-staggering-npm-download-statistics)
  * [私たちの影響の俯瞰図](#a-birds-eye-view-of-our-impact)
  * [大規模な日々の影響](#daily-impact-at-scale)
  * [単なる数字を超えて](#beyond-the-raw-numbers)
* [エコシステム支援：私たちのオープンソーススポンサーシップ](#supporting-the-ecosystem-our-open-source-sponsorships)
  * [Andris Reinman：メールインフラの先駆者](#andris-reinman-email-infrastructure-pioneer)
  * [Sindre Sorhus：ユーティリティパッケージの立役者](#sindre-sorhus-utility-package-mastermind)
* [JavaScriptエコシステムのセキュリティ脆弱性の発見](#uncovering-security-vulnerabilities-in-the-javascript-ecosystem)
  * [Koa-Routerの救出](#the-koa-router-rescue)
  * [ReDoS脆弱性への対応](#addressing-redos-vulnerabilities)
  * [Node.jsとChromiumのセキュリティ擁護](#advocating-for-nodejs-and-chromium-security)
  * [npmインフラのセキュリティ強化](#securing-npm-infrastructure)
* [Forward Emailエコシステムへの貢献](#our-contributions-to-the-forward-email-ecosystem-1)
  * [Nodemailerのコア機能強化](#enhancing-nodemailers-core-functionality)
  * [Mailauthによるメール認証の推進](#advancing-email-authentication-with-mailauth)
  * [Upptimeの主要な改善](#key-upptime-enhancements)
* [すべてをつなぐ接着剤：大規模なカスタムコード](#the-glue-that-holds-it-all-together-custom-code-at-scale)
  * [大規模な開発努力](#a-massive-development-effort)
  * [コア依存関係の統合](#core-dependencies-integration)
  * [Tangerineとmx-connectによるDNSインフラ](#dns-infrastructure-with-tangerine-and-mx-connect)
* [エンタープライズへの影響：オープンソースからミッションクリティカルなソリューションへ](#enterprise-impact-from-open-source-to-mission-critical-solutions)
  * [ミッションクリティカルなメールインフラのケーススタディ](#case-studies-in-mission-critical-email-infrastructure)
* [10年のオープンソース：これからの展望](#a-decade-of-open-source-looking-forward)
## 序文 {#foreword}

[JavaScript](https://en.wikipedia.org/wiki/JavaScript) と [Node.js](https://en.wikipedia.org/wiki/Node.js) の世界では、いくつかのパッケージが不可欠であり、毎日何百万回もダウンロードされ、世界中のアプリを支えています。これらのツールの背後には、オープンソースの品質に注力する開発者たちがいます。本日は、私たちのチームがどのようにして JavaScript エコシステムの重要な一部となった npm パッケージの構築と維持を支援しているかをご紹介します。


## 私たちを信頼する先駆者たち：Isaac Z. Schlueter と Forward Email {#the-pioneers-who-trust-us-isaac-z-schlueter-and-forward-email}

私たちは [Isaac Z. Schlueter](https://izs.me/)（[GitHub: isaacs](https://github.com/isaacs)）をユーザーとして迎えられることを誇りに思っています。Isaac は [npm](https://en.wikipedia.org/wiki/Npm_\(software\)) を作成し、[Node.js](https://en.wikipedia.org/wiki/Node.js) の構築にも貢献しました。彼が Forward Email を信頼していることは、私たちの品質とセキュリティへの注力を示しています。Isaac は izs.me を含む複数のドメインで Forward Email を利用しています。

Isaac の JavaScript への影響は非常に大きいです。2009年、彼は Node.js の可能性を最初に見抜いた一人であり、このプラットフォームを作った [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl) と共に活動しました。Isaac が [Increment magazine のインタビュー](https://increment.com/development/interview-with-isaac-z-schlueter-ceo-of-npm/) で語ったように：「サーバーサイド JS を実現しようとする非常に小さなコミュニティの中で、Ryan Dahl が Node を発表しました。それは明らかに正しいアプローチでした。私はその時点で賭けに出て、2009年の中頃から深く関わりました。」

> \[!NOTE]
> Node.js の歴史に興味がある方には、その開発を記録した優れたドキュメンタリーがあります。例えば [The Story of Node.js](https://www.youtube.com/watch?v=LB8KwiiUGy0) や [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=jo_B4LTHi3I) です。Ryan Dahl の [個人ウェブサイト](https://tinyclouds.org/) も彼の仕事に関する貴重な洞察を含んでいます。

### npm の創設から Node.js のリーダーシップへ {#from-npms-creation-to-nodejs-leadership}

Isaac は 2009年9月に npm を作成し、最初の実用的なバージョンは 2010年初頭にリリースされました。このパッケージマネージャーは Node.js における重要なニーズを満たし、開発者がコードを簡単に共有・再利用できるようにしました。[Node.js の Wikipedia ページ](https://en.wikipedia.org/wiki/Node.js) によると、「2010年1月に Node.js 環境向けのパッケージマネージャー npm が導入されました。このパッケージマネージャーは、プログラマーが Node.js パッケージとそれに伴うソースコードを公開・共有できるようにし、パッケージのインストール、更新、アンインストールを簡素化するよう設計されています。」

Ryan Dahl が 2012年1月に Node.js から退いた後、Isaac がプロジェクトリーダーを引き継ぎました。[彼の履歴書](https://izs.me/resume) に記されているように、彼は「CommonJS モジュールシステム、ファイルシステム API、ストリームなど、いくつかの基本的な Node.js コア API の開発を主導し」、「2年間プロジェクトの BDFL（Benevolent Dictator For Life）として活動し、Node.js バージョン v0.6 から v0.10 までの品質向上と信頼性の高いビルドプロセスを確保しました。」

Isaac は Node.js の重要な成長期を導き、現在もプラットフォームの基準となっている標準を設定しました。彼は後に 2014年に npm, Inc. を設立し、それまで自身で運営していた npm レジストリのサポートを開始しました。

私たちは Isaac の JavaScript への多大な貢献に感謝し、彼が作成した多くのパッケージを今も利用し続けています。彼の仕事は、ソフトウェアの構築方法と世界中の何百万もの開発者がコードを共有する方法を変えました。


## コードの設計者：Nick Baugh の軌跡 {#the-architect-behind-the-code-nick-baughs-journey}

私たちのオープンソースの成功の中心には、Forward Email の創設者でオーナーの Nick Baugh がいます。彼の JavaScript における活動はほぼ 20 年にわたり、数え切れないほどの開発者がアプリを構築する方法に影響を与えました。彼のオープンソースの歩みは、技術力とコミュニティリーダーシップの両方を示しています。

### Express 技術委員会とコアへの貢献 {#express-technical-committee-and-core-contributions}

Nick のウェブフレームワークに関する専門知識は、[Express 技術委員会](https://expressjs.com/en/resources/community.html) のメンバーとしての地位を得ることにつながり、Node.js で最も使われているフレームワークの一つに貢献しました。Nick は現在、[Express コミュニティページ](https://expressjs.com/en/resources/community.html) に非アクティブメンバーとして記載されています。
> \[!IMPORTANT]
> ExpressはもともとTJ Holowaychukによって作成されました。彼はNode.jsエコシステムの多くを形作った多作なオープンソース貢献者です。私たちはTJの基盤となる仕事に感謝し、彼が広範なオープンソース貢献から休止するという[決断](https://news.ycombinator.com/item?id=37687017)を尊重しています。

[Express Technical Committee](https://expressjs.com/en/resources/community.html)のメンバーとして、Nickは`req.originalUrl`のドキュメントの明確化やマルチパートフォーム処理の問題修正など、細部にわたる注意を示しました。

### Koa Framework Contributions {#koa-framework-contributions}

Nickの[TJ Holowaychukが作成したExpressのよりモダンで軽量な代替であるKoaフレームワーク](https://github.com/koajs/koa)での作業は、より良いウェブ開発ツールへの彼のコミットメントをさらに示しています。彼のKoaへの貢献は、エラーハンドリング、コンテンツタイプ管理、ドキュメント改善に関する問題報告やプルリクエストによるコードの両方を含みます。

ExpressとKoaの両方での彼の作業は、Node.jsウェブ開発に対する独自の視点をもたらし、複数のフレームワークエコシステムでうまく機能するパッケージを私たちのチームが作成するのに役立っています。

### From Individual Contributor to Organization Leader {#from-individual-contributor-to-organization-leader}

既存プロジェクトの支援から始まったものが、パッケージエコシステム全体の作成と維持へと成長しました。Nickは複数のGitHub組織を設立しました。これには[Cabin](https://github.com/cabinjs)、[Spam Scanner](https://github.com/spamscanner)、[Forward Email](https://github.com/forwardemail)、[Lad](https://github.com/ladjs)、[Bree](https://github.com/breejs)が含まれ、それぞれがJavaScriptコミュニティの特定のニーズを解決しています。

貢献者からリーダーへのこの変化は、実際の問題を解決するよく設計されたソフトウェアに対するNickのビジョンを示しています。関連するパッケージを焦点を絞ったGitHub組織の下にまとめることで、彼はモジュール性と柔軟性を保ちながら連携して動作するツールエコシステムを構築し、より広い開発者コミュニティに貢献しています。


## Our GitHub Organizations: Ecosystems of Innovation {#our-github-organizations-ecosystems-of-innovation}

私たちはオープンソースの作業を、JavaScriptの特定のニーズを解決する焦点を絞ったGitHub組織の周りに構築しています。この構造により、モジュール性を保ちつつ連携して動作するまとまりのあるパッケージファミリーが生まれます。

### Cabin: Structured Logging for Modern Applications {#cabin-structured-logging-for-modern-applications}

[Cabin組織](https://github.com/cabinjs)は、シンプルで強力なアプリケーションログ記録に対する私たちのアプローチです。メインの[`cabin`](https://github.com/cabinjs/cabin)パッケージは約900のGitHubスターと週あたり10万以上のダウンロード数\[^1]を誇ります。CabinはSentry、LogDNA、Papertrailなどの人気サービスと連携する構造化ログ記録を提供します。

Cabinの特長は、その考え抜かれたAPIとプラグインシステムです。Expressミドルウェア用の[`axe`](https://github.com/cabinjs/axe)やHTTPリクエスト解析用の[`parse-request`](https://github.com/cabinjs/parse-request)などのサポートパッケージは、単独のツールではなく包括的なソリューションへのコミットメントを示しています。

[`bson-objectid`](https://github.com/cabinjs/bson-objectid)パッケージは特に注目に値し、わずか2か月で170万以上のダウンロード数\[^2]を記録しています。この軽量なMongoDB ObjectID実装は、完全なMongoDB依存なしにIDが必要な開発者の間で定番となっています。

### Spam Scanner: Fighting Email Abuse {#spam-scanner-fighting-email-abuse}

[Spam Scanner組織](https://github.com/spamscanner)は、実際の問題解決への私たちのコミットメントを示しています。メインの[`spamscanner`](https://github.com/spamscanner/spamscanner)パッケージは高度なメールスパム検出を提供しますが、特に[`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)パッケージの採用が驚異的です。

2か月で120万以上のダウンロード数\[^3]を誇る`url-regex-safe`は、他のURL検出正規表現における重大なセキュリティ問題を修正します。このパッケージは私たちのオープンソースへのアプローチを示しており、共通の問題（この場合はURL検証における[ReDoS](https://en.wikipedia.org/wiki/ReDoS)脆弱性）を見つけ、堅実な解決策を作成し、慎重に維持しています。
### Bree: ワーカースレッドを使ったモダンなジョブスケジューリング {#bree-modern-job-scheduling-with-worker-threads}

[Bree organization](https://github.com/breejs) は、Node.js における一般的な課題である信頼性の高いジョブスケジューリングに対する私たちの答えです。3,100以上のGitHubスターを持つメインの[`bree`](https://github.com/breejs/bree)パッケージは、Node.jsのワーカースレッドを使用してパフォーマンスと信頼性を向上させたモダンなジョブスケジューラを提供します。

> \[!NOTE]
> Breeは、[Agenda](https://github.com/agenda/agenda)のメンテナンスを支援した後に作成され、そこで得た教訓を活かしてより良いジョブスケジューラを構築しました。私たちのAgendaへの貢献は、ジョブスケジューリングの改善方法を見つける助けとなりました。

BreeがAgendaのような他のスケジューラと異なる点:

* **外部依存なし**: MongoDBが必要なAgendaとは異なり、Breeはジョブ状態の管理にRedisやMongoDBを必要としません。
* **ワーカースレッド**: BreeはNode.jsのワーカースレッドを使い、サンドボックス化されたプロセスでより良い分離とパフォーマンスを実現します。
* **シンプルなAPI**: Breeは詳細な制御をシンプルに提供し、複雑なスケジューリング要件の実装を容易にします。
* **組み込みサポート**: 優雅なリロード、cronジョブ、日付、人間に優しい時間指定などがデフォルトで含まれています。

Breeは[forwardemail.net](https://github.com/forwardemail/forwardemail.net)の重要な部分であり、メール処理、クリーンアップ、スケジュールされたメンテナンスなどの重要なバックグラウンドタスクを担当しています。Forward EmailでBreeを使用することは、自社ツールを本番環境で使い、高い信頼性基準を満たしていることを示しています。

また、[piscina](https://github.com/piscinajs/piscina)のような他の優れたワーカースレッドパッケージや、[undici](https://github.com/nodejs/undici)のようなHTTPクライアントも使用し評価しています。PiscinaはBree同様、Node.jsのワーカースレッドを使って効率的なタスク処理を実現しています。[Matteo Collina](https://github.com/mcollina)はundiciとpiscinaの両方をメンテナンスしており、Node.jsへの大きな貢献者です。MatteoはNode.jsの技術運営委員会のメンバーであり、Node.jsのHTTPクライアント機能を大幅に改善しました。

### Forward Email: オープンソースのメールインフラストラクチャ {#forward-email-open-source-email-infrastructure}

私たちの最も野心的なプロジェクトは[Forward Email](https://github.com/forwardemail)で、メール転送、ストレージ、APIサービスを提供するオープンソースのメールサービスです。メインリポジトリは1,100以上のGitHubスター\[^4]を持ち、プロプライエタリなメールサービスの代替としてコミュニティから高く評価されています。

この組織の[`preview-email`](https://github.com/forwardemail/preview-email)パッケージは、2か月で250万回以上ダウンロードされ\[^5]、メールテンプレートを扱う開発者にとって不可欠なツールとなっています。開発中にメールを簡単にプレビューできる方法を提供し、メール対応アプリケーション構築の一般的な課題を解決しています。

### Lad: Koaのための必須ユーティリティとツール {#lad-essential-koa-utilities-and-tools}

[Lad organization](https://github.com/ladjs)は、主にKoaフレームワークのエコシステムを強化するための必須ユーティリティとツールのコレクションを提供しています。これらのパッケージはウェブ開発の一般的な課題を解決し、独立して有用でありながらシームレスに連携できるよう設計されています。

#### koa-better-error-handler: Koaのための改善されたエラーハンドリング {#koa-better-error-handler-improved-error-handling-for-koa}

[`koa-better-error-handler`](https://github.com/ladjs/koa-better-error-handler)はKoaアプリケーション向けのより良いエラーハンドリングソリューションを提供します。50以上のGitHubスターを持つこのパッケージは、`ctx.throw`でユーザーフレンドリーなエラーメッセージを生成し、Koaの組み込みエラーハンドラのいくつかの制限を解決します:

* Node.jsのDNSエラー、Mongooseエラー、Redisエラーを検出し適切に処理
* 一貫性のある整形されたエラーレスポンスを作成するために[Boom](https://github.com/hapijs/boom)を使用
* ヘッダーを保持（Koaの組み込みハンドラとは異なる）
* デフォルトで500にするのではなく適切なステータスコードを維持
* フラッシュメッセージとセッションの保持をサポート
* バリデーションエラー用のHTMLエラーリストを提供
* 複数のレスポンスタイプ（HTML、JSON、プレーンテキスト）をサポート
このパッケージは、Koaアプリケーションでの包括的なエラー管理のために[`koa-404-handler`](https://github.com/ladjs/koa-404-handler)と併用すると特に価値があります。

#### passport: Ladの認証 {#passport-authentication-for-lad}

[`@ladjs/passport`](https://github.com/ladjs/passport)は、人気のPassport.js認証ミドルウェアを拡張し、モダンなウェブアプリケーション向けの特定の強化機能を提供します。このパッケージは複数の認証戦略を標準でサポートしています：

* メールによるローカル認証
* Appleでサインイン
* GitHub認証
* Google認証
* ワンタイムパスワード（OTP）認証

このパッケージは非常にカスタマイズ可能で、開発者がフィールド名やフレーズをアプリケーションの要件に合わせて調整できます。ユーザー管理のためにMongooseとシームレスに統合されるよう設計されており、堅牢な認証が必要なKoaベースのアプリケーションに最適なソリューションです。

#### graceful: 優雅なアプリケーションシャットダウン {#graceful-elegant-application-shutdown}

[`@ladjs/graceful`](https://github.com/ladjs/graceful)は、Node.jsアプリケーションを優雅にシャットダウンするという重要な課題を解決します。70以上のGitHubスターを獲得しているこのパッケージは、データを失ったり接続が残ったりすることなく、アプリケーションをクリーンに終了できることを保証します。主な機能は以下の通りです：

* HTTPサーバー（Express/Koa/Fastify）の優雅なクローズ対応
* データベース接続（MongoDB/Mongoose）のクリーンなシャットダウン
* Redisクライアントの適切なクローズ
* Breeジョブスケジューラの処理
* カスタムシャットダウンハンドラのサポート
* 設定可能なタイムアウト設定
* ロギングシステムとの統合

このパッケージは、予期しないシャットダウンがデータ損失や破損につながる可能性のある本番環境のアプリケーションに不可欠です。適切なシャットダウン手順を実装することで、`@ladjs/graceful`はアプリケーションの信頼性と安定性を確保します。

### Upptime: オープンソースの稼働監視 {#upptime-open-source-uptime-monitoring}

[Upptime組織](https://github.com/upptime)は、透明性のあるオープンソース監視への私たちのコミットメントを表しています。メインの[`upptime`](https://github.com/upptime/upptime)リポジトリは13,000以上のGitHubスターを持ち、私たちが貢献する最も人気のあるプロジェクトの一つです。UpptimeはGitHubを活用した稼働監視とステータスページを提供し、完全にサーバーレスで動作します。

私たちは自身のステータスページとして<https://status.forwardemail.net>をUpptimeで運用しており、ソースコードは<https://github.com/forwardemail/status.forwardemail.net>で公開しています。

Upptimeの特長はそのアーキテクチャにあります：

* **100%オープンソース**：すべてのコンポーネントが完全にオープンソースでカスタマイズ可能です。
* **GitHub活用**：GitHub Actions、Issues、Pagesを利用したサーバーレス監視ソリューション。
* **サーバー不要**：従来の監視ツールとは異なり、サーバーの運用や管理が不要です。
* **自動ステータスページ**：GitHub Pages上にホスト可能な美しいステータスページを生成します。
* **強力な通知機能**：メール、SMS、Slackなど様々な通知チャネルと統合可能です。

ユーザー体験を向上させるために、forwardemail.netのコードベースに[@octokit/core](https://github.com/octokit/core.js/)を統合し、リアルタイムのステータス更新やインシデントをウェブサイト上に直接表示しています。この統合により、ウェブサイト、API、MongoDB、Redis、SQLite、SMTP、POP3、IMAP、Breeなどの全スタックにわたる問題発生時に、即時のトースト通知、バッジアイコンの変更、警告色表示などでユーザーに明確な透明性を提供します。

@octokit/coreライブラリは、UpptimeのGitHubリポジトリからリアルタイムデータを取得し、それを処理してユーザーフレンドリーに表示することを可能にします。サービスに障害や性能低下が発生した場合、ユーザーはメインアプリケーションを離れることなく視覚的なインジケーターで即座に通知されます。このシームレスな統合により、ユーザーは常に最新のシステムステータス情報を得られ、透明性と信頼性が向上します。

Upptimeは、サービスの透明で信頼性の高い監視とステータスのユーザーへの伝達を求める数百の組織に採用されています。このプロジェクトの成功は、既存のインフラ（この場合はGitHub）を活用して共通の問題を新しい方法で解決するツール構築の力を示しています。
## Forward Emailエコシステムへの私たちの貢献 {#our-contributions-to-the-forward-email-ecosystem}

私たちのオープンソースパッケージは世界中の開発者に利用されていますが、同時に私たち自身のForward Emailサービスの基盤も形成しています。この二重の役割—これらのツールの作成者でありユーザーでもあること—は、実際の利用に関する独自の視点をもたらし、継続的な改善を促進しています。

### パッケージから本番環境へ {#from-packages-to-production}

個々のパッケージから統合された本番システムへの道のりは、慎重な統合と拡張を伴います。Forward Emailにおけるこのプロセスには以下が含まれます：

* **カスタム拡張**：Forward Email固有の要件に対応するため、オープンソースパッケージに対するカスタム拡張を構築。
* **統合パターン**：これらのパッケージが本番環境でどのように連携するかのパターンを開発。
* **パフォーマンス最適化**：大規模運用でのみ明らかになるパフォーマンスのボトルネックを特定し対処。
* **セキュリティ強化**：メール処理やユーザーデータ保護に特化した追加のセキュリティ層を追加。

この作業はコアパッケージ自体を超えて数千時間に及ぶ開発を意味し、私たちのオープンソース貢献の最良の部分を活用した堅牢で安全なメールサービスを実現しています。

### フィードバックループ {#the-feedback-loop}

自社のパッケージを本番環境で使用する最も価値ある側面は、フィードバックループの創出です。Forward Emailで制限やエッジケースに遭遇した際、単にローカルで修正するだけでなく、基盤となるパッケージを改善し、サービスと広範なコミュニティの双方に利益をもたらします。

このアプローチにより多くの改善がもたらされました：

* **Breeのグレースフルシャットダウン**：Forward Emailのゼロダウンタイムデプロイメントの必要性から、Breeのグレースフルシャットダウン機能が強化されました。
* **Spam Scannerのパターン認識**：Forward Emailで遭遇した実際のスパムパターンがSpam Scannerの検出アルゴリズムに反映されました。
* **Cabinのパフォーマンス最適化**：本番環境での大量ログ記録により、Cabinの最適化機会が明らかになり、全ユーザーに恩恵をもたらしています。

このようにオープンソースの作業と本番サービスの間で良循環を維持することで、私たちのパッケージは理論的な実装ではなく、実用的で実戦に耐えうるソリューションであり続けます。


## Forward Emailのコア原則：卓越性の基盤 {#forward-emails-core-principles-a-foundation-for-excellence}

Forward Emailは、すべての開発判断を導く一連のコア原則に基づいて設計されています。これらの原則は、私たちの[ウェブサイト](/blog/docs/best-quantum-safe-encrypted-email-service#principles)で詳述されており、サービスが開発者に優しく、安全で、ユーザープライバシーに重点を置き続けることを保証します。

### 常に開発者に優しく、セキュリティ重視で透明性を保つ {#always-developer-friendly-security-focused-and-transparent}

私たちの最も重要な原則は、最高水準のセキュリティとプライバシーを維持しつつ、開発者に優しいソフトウェアを作ることです。技術的な卓越性は使いやすさを犠牲にすべきではなく、透明性がコミュニティとの信頼を築くと信じています。

この原則は、詳細なドキュメント、明確なエラーメッセージ、成功と課題の両方に関するオープンなコミュニケーションに表れています。コードベース全体をオープンソースにすることで、精査と協力を促し、ソフトウェアとエコシステムの双方を強化しています。

### 時間をかけて証明されたソフトウェア開発原則の遵守 {#adherence-to-time-tested-software-development-principles}

私たちは、数十年にわたり価値が証明されてきたいくつかの確立されたソフトウェア開発原則に従っています：

* **[MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)**：モデル・ビュー・コントローラパターンによる関心の分離
* **[Unix Philosophy](https://en.wikipedia.org/wiki/Unix_philosophy)**：一つのことをうまく行うモジュールコンポーネントの作成
* **[KISS](https://en.wikipedia.org/wiki/KISS_principle)**：シンプルかつ明快に保つ
* **[DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)**：繰り返しを避け、コードの再利用を促進
* **[YAGNI](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)**：必要になるまで実装しない、早すぎる最適化を避ける
* **[Twelve Factor](https://12factor.net/)**：モダンでスケーラブルなアプリケーション構築のベストプラクティスに従う
* **[Occam's razor](https://en.wikipedia.org/wiki/Occam%27s_razor)**：要件を満たす最も単純な解決策を選択
* **[Dogfooding](https://en.wikipedia.org/wiki/Eating_your_own_dog_food)**：自社製品を積極的に使用すること
これらの原則は単なる理論的な概念ではなく、私たちの日々の開発実践に組み込まれています。例えば、Unix哲学への準拠は、npmパッケージの構造に明確に表れており、小さく焦点を絞ったモジュールを組み合わせて複雑な問題を解決できるようにしています。

### タフで自力で立ち上げた開発者をターゲットに {#targeting-the-scrappy-bootstrapped-developer}

私たちは特に、タフで自力で立ち上げ、かつ[ラーメン収益化](https://www.paulgraham.com/ramenprofitable.html)している開発者をターゲットにしています。この焦点は、価格モデルから技術的な決定に至るまであらゆる面に影響を与えています。限られたリソースで製品を作る難しさを理解しているのは、私たち自身も同じ経験をしてきたからです。

この原則はオープンソースへのアプローチにおいて特に重要です。企業の予算がない開発者のために実際の問題を解決するパッケージを作成・維持し、リソースに関係なく誰もが強力なツールを利用できるようにしています。

### 実践における原則：Forward Emailのコードベース {#principles-in-practice-the-forward-email-codebase}

これらの原則はForward Emailのコードベースに明確に現れています。package.jsonファイルには、私たちのコアバリューに沿った慎重に選ばれた依存関係が示されています：

* メール認証のための `mailauth` のようなセキュリティ重視のパッケージ
* デバッグを容易にする `preview-email` のような開発者フレンドリーなツール
* Sindre Sorhusの様々な `p-*` ユーティリティのようなモジュールコンポーネント

これらの原則を一貫して守り続けることで、開発者がメールインフラストラクチャを安心して任せられる、セキュアで信頼性の高いサービスを構築してきました。これはオープンソースコミュニティの価値観にも合致しています。

### プライバシー・バイ・デザイン {#privacy-by-design}

プライバシーはForward Emailにとって後付けの考慮やマーケティング機能ではなく、サービスとコードのあらゆる側面を形作る基本的な設計原則です：

* **ゼロアクセス暗号化**：ユーザーのメールを私たちが技術的に読むことが不可能なシステムを実装しています。
* **最小限のデータ収集**：サービス提供に必要なデータのみを収集し、それ以上は収集しません。
* **透明なポリシー**：プライバシーポリシーは法律用語を使わず、明確で理解しやすい言葉で書かれています。
* **オープンソースによる検証**：オープンソースのコードベースにより、セキュリティ研究者がプライバシー主張を検証できます。

このコミットメントは、セキュリティとプライバシーのベストプラクティスを基盤から組み込んだオープンソースパッケージにも及んでいます。

### 持続可能なオープンソース {#sustainable-open-source}

オープンソースソフトウェアが長期的に繁栄するには持続可能なモデルが必要だと私たちは考えています。私たちのアプローチは以下を含みます：

* **商用サポート**：オープンソースツールに関するプレミアムサポートやサービスの提供。
* **バランスの取れたライセンス**：ユーザーの自由とプロジェクトの持続可能性の両方を保護するライセンスの使用。
* **コミュニティの関与**：貢献者と積極的に関わり、支え合うコミュニティを構築。
* **透明なロードマップ**：開発計画を共有し、ユーザーが計画を立てやすくする。

持続可能性に注力することで、私たちのオープンソースへの貢献が放置されることなく、時間とともに成長・改善し続けることを保証しています。

## 数字は嘘をつかない：驚異的なnpmダウンロード統計 {#the-numbers-dont-lie-our-staggering-npm-download-statistics}

オープンソースソフトウェアの影響を語る際、ダウンロード統計は採用と信頼の具体的な指標を提供します。私たちが維持を支援している多くのパッケージは、数十億回の合計ダウンロード数という、ほとんどのオープンソースプロジェクトが達成しない規模に達しています。

![Top npm Packages by Downloads](/img/art/top_packages_bar_chart.svg)

> \[!IMPORTANT]
> JavaScriptエコシステムで非常に多くダウンロードされている複数のパッケージの維持を支援していることを誇りに思いますが、これらの多くのパッケージは元々他の才能ある開発者によって作成されたことを認めたいと思います。superagentやsupertestのようなパッケージは、Node.jsエコシステムの形成に重要な役割を果たしたTJ Holowaychukによって最初に作成されました。
### 私たちの影響の俯瞰図 {#a-birds-eye-view-of-our-impact}

2025年2月から3月のわずか2か月間で、私たちが貢献しメンテナンスを支援している主要なパッケージは驚異的なダウンロード数を記録しました：

* **[superagent](https://www.npmjs.com/package/superagent)**: 84,575,829 ダウンロード\[^7]（元々はTJ Holowaychukによって作成）
* **[supertest](https://www.npmjs.com/package/supertest)**: 76,432,591 ダウンロード\[^8]（元々はTJ Holowaychukによって作成）
* **[koa](https://www.npmjs.com/package/koa)**: 28,539,295 ダウンロード\[^34]（元々はTJ Holowaychukによって作成）
* **[@koa/router](https://www.npmjs.com/package/@koa/router)**: 11,007,327 ダウンロード\[^35]
* **[koa-router](https://www.npmjs.com/package/koa-router)**: 3,498,918 ダウンロード\[^36]
* **[url-regex](https://www.npmjs.com/package/url-regex)**: 2,819,520 ダウンロード\[^37]
* **[preview-email](https://www.npmjs.com/package/preview-email)**: 2,500,000 ダウンロード\[^9]
* **[cabin](https://www.npmjs.com/package/cabin)**: 1,800,000 ダウンロード\[^10]
* **[@breejs/later](https://www.npmjs.com/package/@breejs/later)**: 1,709,938 ダウンロード\[^38]
* **[email-templates](https://www.npmjs.com/package/email-templates)**: 1,128,139 ダウンロード\[^39]
* **[get-paths](https://www.npmjs.com/package/get-paths)**: 1,124,686 ダウンロード\[^40]
* **[url-regex-safe](https://www.npmjs.com/package/url-regex-safe)**: 1,200,000 ダウンロード\[^11]
* **[dotenv-parse-variables](https://www.npmjs.com/package/dotenv-parse-variables)**: 894,666 ダウンロード\[^41]
* **[@koa/multer](https://www.npmjs.com/package/@koa/multer)**: 839,585 ダウンロード\[^42]
* **[spamscanner](https://www.npmjs.com/package/spamscanner)**: 145,000 ダウンロード\[^12]
* **[bree](https://www.npmjs.com/package/bree)**: 24,270 ダウンロード\[^30]

> \[!NOTE]
> 私たちがメンテナンスを支援しているが作成していない他のパッケージには、`form-data`（7億3800万以上のダウンロード）、`toidentifier`（3億900万以上のダウンロード）、`stackframe`（1億1600万以上のダウンロード）、`error-stack-parser`（1億1300万以上のダウンロード）など、さらに多くのダウンロード数を誇るものがあります。これらのパッケージに貢献できることを光栄に思い、元の作者の仕事を尊重しています。

これらは単なる数字ではなく、私たちがメンテナンスを支援するコードで実際の開発者が現実の問題を解決している証です。すべてのダウンロードは、趣味のプロジェクトから何百万ものユーザーが利用するエンタープライズアプリケーションまで、誰かが意味のあるものを構築するのに役立った瞬間を表しています。

![Package Categories Distribution](/img/art/category_pie_chart.svg)

### 大規模な日々の影響 {#daily-impact-at-scale}

日々のダウンロードパターンは、一貫して大量の利用があり、ピーク時には1日あたり数百万のダウンロードに達しています\[^13]。この一貫性は、これらのパッケージの安定性と信頼性を示しており、開発者は単に試すだけでなく、コアワークフローに統合し、日々依存しています。

週間のダウンロードパターンはさらに印象的で、常に数千万のダウンロード数を維持しています\[^14]。これはJavaScriptエコシステムにおける巨大な足跡を示しており、これらのパッケージは世界中の本番環境で稼働しています。

### 単なる数字を超えて {#beyond-the-raw-numbers}

ダウンロード統計はそれ自体で印象的ですが、これらのパッケージに対するコミュニティの信頼というより深い物語を語っています。この規模でパッケージを維持するには、以下への揺るぎないコミットメントが必要です：

* **後方互換性**：既存の実装を壊さないように変更は慎重に検討されなければなりません。
* **セキュリティ**：数百万のアプリケーションがこれらのパッケージに依存しているため、セキュリティの脆弱性は広範囲に影響を及ぼす可能性があります。
* **パフォーマンス**：この規模では、わずかなパフォーマンス改善でも大きな総合的利益をもたらします。
* **ドキュメント**：あらゆる経験レベルの開発者が利用するため、明確で包括的なドキュメントが不可欠です。

時間をかけてダウンロード数が一貫して増加していることは、これらのコミットメントを果たし、信頼できる、よくメンテナンスされたパッケージを通じて開発者コミュニティとの信頼を築いている成功の証です。
## エコシステムの支援：私たちのオープンソーススポンサーシップ {#supporting-the-ecosystem-our-open-source-sponsorships}

> \[!TIP]
> オープンソースの持続可能性はコードの貢献だけでなく、重要なインフラを維持する開発者の支援も含まれます。

JavaScriptエコシステムへの直接的な貢献に加え、私たちは多くの現代的なアプリケーションの基盤を形成する著名なNode.jsコントリビューターをスポンサーすることを誇りに思っています。私たちのスポンサーシップには以下が含まれます：

### Andris Reinman：メールインフラのパイオニア {#andris-reinman-email-infrastructure-pioneer}

[Andris Reinman](https://github.com/andris9)は、Node.jsで最も人気のあるメール送信ライブラリである[Nodemailer](https://github.com/nodemailer/nodemailer)の作者で、週に1400万回以上ダウンロードされています\[^15]。彼の仕事は、[SMTP Server](https://github.com/nodemailer/smtp-server)、[Mailparser](https://github.com/nodemailer/mailparser)、[WildDuck](https://github.com/nodemailer/wildduck)などの他の重要なメールインフラコンポーネントにも及びます。

私たちのスポンサーシップは、これらの重要なツールの継続的なメンテナンスと開発を支援し、Forward Emailサービスを含む数多くのNode.jsアプリケーションのメール通信を支えています。

### Sindre Sorhus：ユーティリティパッケージの立案者 {#sindre-sorhus-utility-package-mastermind}

[Sindre Sorhus](https://github.com/sindresorhus)はJavaScriptエコシステムで最も多作なオープンソースコントリビューターの一人で、1000以上のnpmパッケージを公開しています。彼のユーティリティである[p-map](https://github.com/sindresorhus/p-map)、[p-retry](https://github.com/sindresorhus/p-retry)、[is-stream](https://github.com/sindresorhus/is-stream)はNode.jsエコシステム全体で基本的な構成要素として使われています。

Sindreの仕事をスポンサーすることで、JavaScript開発をより効率的かつ信頼性の高いものにするこれらの重要なユーティリティの開発を支えています。

これらのスポンサーシップは、より広範なオープンソースエコシステムへの私たちのコミットメントを反映しています。私たち自身の成功はこれらおよび他のコントリビューターによって築かれた基盤の上に成り立っていることを認識しており、エコシステム全体の持続可能性を確保することに専念しています。


## JavaScriptエコシステムにおけるセキュリティ脆弱性の発見 {#uncovering-security-vulnerabilities-in-the-javascript-ecosystem}

私たちのオープンソースへの取り組みは、機能開発にとどまらず、何百万もの開発者に影響を与える可能性のあるセキュリティ脆弱性の特定と対処にも及びます。JavaScriptエコシステムへの最も重要な貢献のいくつかは、セキュリティの分野にあります。

### Koa-Routerの救済 {#the-koa-router-rescue}

2019年2月、Nickは人気のkoa-routerパッケージのメンテナンスに重大な問題があることを特定しました。彼が[Hacker Newsで報告したように](https://news.ycombinator.com/item?id=19156707)、このパッケージは元のメンテナによって放棄されており、セキュリティ脆弱性が放置され、コミュニティに更新が提供されていませんでした。

> \[!WARNING]
> セキュリティ脆弱性を持つ放棄されたパッケージは、特に週に何百万回もダウンロードされる場合、エコシステム全体に重大なリスクをもたらします。

これに対応して、Nickは[@koa/router](https://github.com/koajs/router)を作成し、コミュニティに状況を警告しました。それ以来、彼はこの重要なパッケージのメンテナンスを続けており、Koaユーザーに安全で適切に管理されたルーティングソリューションを提供しています。

### ReDoS脆弱性への対応 {#addressing-redos-vulnerabilities}

2020年、Nickは広く使われている`url-regex`パッケージにおける重大な[正規表現サービス拒否（ReDoS）](https://en.wikipedia.org/wiki/ReDoS)脆弱性を特定し対処しました。この脆弱性（[SNYK-JS-URLREGEX-569472](https://security.snyk.io/vuln/SNYK-JS-URLREGEX-569472)）は、攻撃者が特別に細工した入力を提供することで、正規表現の破滅的なバックトラッキングを引き起こしサービス拒否を発生させる可能性がありました。

既存のパッケージを単に修正するのではなく、Nickは脆弱性に対応しつつ元のAPIとの互換性を維持した完全に書き直された実装である[`url-regex-safe`](https://github.com/spamscanner/url-regex-safe)を作成しました。また、脆弱性の説明とその緩和方法を解説した[包括的なブログ記事](/blog/docs/url-regex-javascript-node-js)も公開しています。
この作品は、問題を修正するだけでなく、コミュニティを教育し、将来同様の問題を防ぐ堅牢な代替手段を提供するという私たちのセキュリティへのアプローチを示しています。

### Node.js と Chromium のセキュリティ擁護 {#advocating-for-nodejs-and-chromium-security}

Nick は、より広範なエコシステムにおけるセキュリティ改善の擁護にも積極的に取り組んできました。2020年8月、彼は HTTP ヘッダーの処理に関連する Node.js の重大なセキュリティ問題を特定し、これは [The Register](https://www.theregister.com/2020/08/18/nodejs_chromium_patch/) で報告されました。

この問題は Chromium のパッチに起因しており、攻撃者がセキュリティ対策を回避する可能性がありました。Nick の擁護により、この問題は迅速に対処され、数百万の Node.js アプリケーションが潜在的な悪用から保護されました。

### npm インフラストラクチャのセキュリティ強化 {#securing-npm-infrastructure}

同じ月の後半、Nick は今度は npm のメールインフラストラクチャにおける別の重大なセキュリティ問題を特定しました。[The Register](https://www.theregister.com/2020/08/25/nodejs_dmarc_phishing/) によると、npm は DMARC、SPF、および DKIM のメール認証プロトコルを適切に実装しておらず、攻撃者が npm から送信されたように見えるフィッシングメールを送信できる可能性がありました。

Nick の報告により、npm のメールセキュリティ体制が改善され、パッケージ管理に npm を利用する数百万の開発者が潜在的なフィッシング攻撃から保護されました。


## Forward Email エコシステムへの私たちの貢献 {#our-contributions-to-the-forward-email-ecosystem-1}

Forward Email は Nodemailer、WildDuck、mailauth などのいくつかの重要なオープンソースプロジェクトの上に構築されています。私たちのチームはこれらのプロジェクトに大きく貢献し、メール配信とセキュリティに影響を与える深刻な問題の特定と修正を支援してきました。

### Nodemailer のコア機能強化 {#enhancing-nodemailers-core-functionality}

[Nodemailer](https://github.com/nodemailer/nodemailer) は Node.js におけるメール送信の基盤であり、私たちの貢献によりより堅牢になりました：

* **SMTP サーバーの改善**: SMTP サーバーコンポーネントにおけるパースバグ、ストリーム処理の問題、TLS 設定の問題を修正しました\[^16]\[^17]。
* **メールパーサーの強化**: 文字列シーケンスのデコードエラーやアドレスパーサーの問題を解決し、メール処理の失敗を防止しました\[^18]\[^19]。

これらの貢献により、Nodemailer は Forward Email を含む Node.js アプリケーションにおけるメール処理の信頼できる基盤であり続けています。

### Mailauth によるメール認証の推進 {#advancing-email-authentication-with-mailauth}

[Mailauth](https://github.com/postalsys/mailauth) は重要なメール認証機能を提供しており、私たちの貢献によりその能力が大幅に向上しました：

* **DKIM 検証の改善**: X/Twitter の DNS キャッシュ問題により送信メッセージの DKIM が失敗する問題を発見し、Hacker One に報告しました\[^20]。
* **DMARC と ARC の強化**: 誤った認証結果を招く可能性のある DMARC と ARC の検証問題を修正しました\[^21]\[^22]。
* **パフォーマンス最適化**: メール認証プロセスのパフォーマンスを向上させる最適化に貢献しました\[^23]\[^24]\[^25]\[^26]。

これらの改善により、メール認証の正確性と信頼性が確保され、フィッシングやなりすまし攻撃からユーザーを保護します。

### Upptime の主要な強化 {#key-upptime-enhancements}

私たちの Upptime への貢献には以下が含まれます：

* **SSL 証明書監視**: SSL 証明書の有効期限を監視する機能を追加し、証明書の期限切れによる予期せぬダウンタイムを防止しました\[^27]。
* **複数 SMS 番号対応**: インシデント発生時に複数のチームメンバーへ SMS でアラートを送信するサポートを実装し、対応時間を改善しました\[^28]。
* **IPv6 チェックの修正**: IPv6 接続チェックの問題を修正し、現代のネットワーク環境での監視精度を向上させました\[^29]。
* **ダーク/ライトモード対応**: ステータスページのユーザー体験を向上させるためテーマサポートを追加しました\[^31]。
* **TCP-Ping サポートの改善**: TCP ピング機能を強化し、より信頼性の高い接続テストを提供しました\[^32]。
これらの改善はForward Emailのステータス監視に利益をもたらすだけでなく、Upptimeユーザー全体のコミュニティに提供されており、私たちが依存するツールの改善に取り組んでいることを示しています。


## すべてをつなぐ接着剤：大規模なカスタムコード {#the-glue-that-holds-it-all-together-custom-code-at-scale}

私たちのnpmパッケージや既存プロジェクトへの貢献は重要ですが、これらのコンポーネントを統合するカスタムコードこそが私たちの技術的専門知識を真に示しています。Forward Emailのコードベースは、2017年に[free-email-forwarding](https://github.com/forwardemail/free-email-forwarding)として始まったプロジェクトがモノレポに統合されるまでの10年にわたる開発努力を表しています。

### 大規模な開発努力 {#a-massive-development-effort}

このカスタム統合コードの規模は印象的です：

* **総コミット数**：3,217回以上
* **コードベースの規模**：JavaScript、Pug、CSS、JSONファイルを合わせて421,545行以上\[^33]

これは何千時間もの開発作業、デバッグセッション、パフォーマンス最適化を意味します。個々のパッケージを結集し、毎日何千もの顧客に利用される一体的で信頼性の高いサービスに変える「秘密のソース」です。

### コア依存関係の統合 {#core-dependencies-integration}

Forward Emailのコードベースは多数の依存関係をシームレスに統合しています：

* **メール処理**：送信にNodemailer、受信にSMTP Server、解析にMailparserを統合
* **認証**：DKIM、SPF、DMARC、ARC検証にMailauthを使用
* **DNS解決**：グローバルキャッシュ付きのDNS-over-HTTPSにTangerineを活用
* **MX接続**：信頼性の高いメールサーバー接続にTangerine統合済みのmx-connectを利用
* **ジョブスケジューリング**：ワーカースレッドによる信頼性の高いバックグラウンドタスク処理にBreeを採用
* **テンプレート**：顧客コミュニケーションでウェブサイトのスタイルシートを再利用するためにemail-templatesを使用
* **メール保存**：better-sqlite3-multiple-ciphersを用いた個別暗号化SQLiteメールボックスを実装し、ChaCha20-Poly1305暗号化で量子耐性のプライバシーを確保。ユーザー間の完全な分離とユーザーのみが自分のメールボックスにアクセス可能

これらの統合は、エッジケース、パフォーマンスの影響、セキュリティ上の懸念を慎重に考慮する必要があります。その結果、数百万件のメール取引を確実に処理する堅牢なシステムが実現しています。SQLiteの実装では効率的なバイナリシリアライズのためにmsgpackrを活用し、インフラ全体でのリアルタイムステータス更新にはWebSockets（ws経由）を利用しています。

### Tangerineとmx-connectによるDNSインフラ {#dns-infrastructure-with-tangerine-and-mx-connect}

Forward Emailのインフラの重要な構成要素は、以下の2つの主要パッケージを中心としたDNS解決システムです：

* **[Tangerine](https://github.com/forwardemail/nodejs-dns-over-https-tangerine)**：Node.jsのDNS-over-HTTPS実装で、標準DNSリゾルバーの代替として、リトライ、タイムアウト、スマートなサーバーローテーション、キャッシュサポートを内蔵しています。

* **[mx-connect](https://github.com/zone-eu/mx-connect)**：ターゲットドメインまたはメールアドレスを受け取り、適切なMXサーバーを解決し、優先順位順に接続するTCP接続を確立するパッケージです。

私たちは[プルリクエスト #4](https://github.com/zone-eu/mx-connect/pull/4)を通じてTangerineをmx-connectに統合し、Forward Email全体でアプリケーション層のDNS over HTTPリクエストを実現しました。これにより、任意の地域、アプリ、プロセス間で1:1の整合性を持つグローバルDNSキャッシュが可能となり、分散システムにおける信頼性の高いメール配信に不可欠な基盤を提供しています。


## エンタープライズへの影響：オープンソースからミッションクリティカルなソリューションへ {#enterprise-impact-from-open-source-to-mission-critical-solutions}

10年にわたるオープンソース開発の集大成により、Forward Emailは個々の開発者だけでなく、オープンソース運動の基盤を形成する主要な企業や教育機関にもサービスを提供できるようになりました。
### ミッションクリティカルなメールインフラにおけるケーススタディ {#case-studies-in-mission-critical-email-infrastructure}

信頼性、プライバシー、オープンソースの原則へのコミットメントにより、Forward Emailは厳しいメール要件を持つ組織にとって信頼される選択肢となっています：

* **教育機関**：私たちの[卒業生メール転送ケーススタディ](https://forwardemail.net/blog/docs/alumni-email-forwarding-university-case-study)で詳述されているように、大手大学は信頼性の高いメール転送サービスを通じて何十万人もの卒業生との生涯にわたるつながりを維持するために当社のインフラを利用しています。

* **エンタープライズLinuxソリューション**：[Canonical Ubuntuメールエンタープライズケーススタディ](https://forwardemail.net/blog/docs/canonical-ubuntu-email-enterprise-case-study)は、当社のオープンソースアプローチがエンタープライズLinuxプロバイダーのニーズに完全に合致し、彼らが必要とする透明性と制御を提供していることを示しています。

* **オープンソース財団**：最も検証的なのは、Linux Foundationとのパートナーシップであり、[Linux Foundationメールエンタープライズケーススタディ](https://forwardemail.net/blog/docs/linux-foundation-email-enterprise-case-study)に記録されているように、Linux開発を管理する組織のコミュニケーションを当社のサービスが支えています。

長年にわたり丁寧にメンテナンスされた当社のオープンソースパッケージが、オープンソースソフトウェアを推進するコミュニティや組織を支えるメールサービスの構築を可能にしたことには美しい対称性があります。個々のパッケージへの貢献から、オープンソースリーダーのためのエンタープライズグレードのメールインフラを支えるまでのこの完全な循環の旅は、当社のソフトウェア開発アプローチの究極の検証を表しています。


## オープンソースの10年：これからの展望 {#a-decade-of-open-source-looking-forward}

10年にわたるオープンソースへの貢献を振り返り、次の10年を見据える中で、私たちは支えてくれたコミュニティへの感謝とこれからの展望に胸を膨らませています。

個々のパッケージ貢献者から、大手企業やオープンソース財団が利用する包括的なメールインフラのメンテナへと成長した私たちの旅は驚くべきものです。これはオープンソース開発の力と、思慮深く適切にメンテナンスされたソフトウェアが広範なエコシステムに与える影響の証です。

今後数年間、私たちは以下にコミットしています：

* **既存パッケージの維持と改善を継続し**、世界中の開発者にとって信頼できるツールであり続けること。
* **特にメールとセキュリティ分野の重要なインフラプロジェクトへの貢献を拡大すること。**
* **Forward Emailの機能強化を図りつつ、プライバシー、セキュリティ、透明性へのコミットメントを維持すること。**
* **メンターシップ、スポンサーシップ、コミュニティ参加を通じて次世代のオープンソース貢献者を支援すること。**

私たちは、ソフトウェア開発の未来はオープンで協力的、そして信頼の基盤の上に築かれると信じています。JavaScriptエコシステムに高品質でセキュリティ重視のパッケージを提供し続けることで、その未来の構築に小さな役割を果たしたいと考えています。

当社のパッケージを利用し、プロジェクトに貢献し、問題を報告し、あるいは単に当社の活動を広めてくださったすべての方々に感謝します。皆様の支援がこの10年の成果を可能にし、これからの10年で共に成し遂げられることを楽しみにしています。

\[^1]: npm download statistics for cabin, April 2025
\[^2]: npm download statistics for bson-objectid, February-March 2025
\[^3]: npm download statistics for url-regex-safe, April 2025
\[^4]: GitHub stars count for forwardemail/forwardemail.net as of April 2025
\[^5]: npm download statistics for preview-email, April 2025
\[^7]: npm download statistics for superagent, February-March 2025
\[^8]: npm download statistics for supertest, February-March 2025
\[^9]: npm download statistics for preview-email, February-March 2025
\[^10]: npm download statistics for cabin, February-March 2025
\[^11]: npm download statistics for url-regex-safe, February-March 2025
\[^12]: npm download statistics for spamscanner, February-March 2025
\[^13]: Daily download patterns from npm statistics, April 2025
\[^14]: Weekly download patterns from npm statistics, April 2025
\[^15]: npm download statistics for nodemailer, April 2025
\[^16]: <https://github.com/nodemailer/smtp-server/issues/155>
\[^17]: <https://github.com/nodemailer/smtp-server/issues/node-v12-requires-tls-min>
\[^18]: <https://github.com/nodemailer/mailparser/issues/261>
\[^19]: <https://github.com/nodemailer/nodemailer/issues/1102>
\[^20]: <https://github.com/postalsys/mailauth/issues/30>
\[^21]: <https://github.com/postalsys/mailauth/issues/58>
\[^22]: <https://github.com/postalsys/mailauth/issues/48>
\[^23]: <https://github.com/postalsys/mailauth/issues/74>
\[^24]: <https://github.com/postalsys/mailauth/issues/75>
\[^25]: <https://github.com/postalsys/mailauth/issues/60>
\[^26]: <https://github.com/postalsys/mailauth/issues/73>
\[^27]: Based on GitHub issues in the Upptime repository
\[^28]: Based on GitHub issues in the Upptime repository
\[^29]: Based on GitHub issues in the Upptime repository
\[^30]: npm download statistics for bree, February-March 2025
\[^31]: Based on GitHub pull requests to Upptime
\[^32]: Based on GitHub pull requests to Upptime
\[^34]: npm download statistics for koa, February-March 2025
\[^35]: npm download statistics for @koa/router, February-March 2025
\[^36]: npm download statistics for koa-router, February-March 2025
\[^37]: npm download statistics for url-regex, February-March 2025
\[^38]: npm download statistics for @breejs/later, February-March 2025
\[^39]: npm download statistics for email-templates, February-March 2025
\[^40]: npm download statistics for get-paths, February-March 2025
\[^41]: npm download statistics for dotenv-parse-variables, February-March 2025
\[^42]: npm download statistics for @koa/multer, February-March 2025
