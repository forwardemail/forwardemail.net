# セルフホスト型メール：オープンソースへのコミットメント {#self-hosted-email-commitment-to-open-source}

<img loading="lazy" src="/img/articles/self-hosted.webp" alt="セルフホスト型メールソリューションのイラスト" class="rounded-lg" />


## 目次 {#table-of-contents}

* [序文](#foreword)
* [セルフホスト型メールが重要な理由](#why-self-hosted-email-matters)
  * [従来のメールサービスの問題点](#the-problem-with-traditional-email-services)
  * [セルフホスト型の代替案](#the-self-hosted-alternative)
* [当社のセルフホスト型実装：技術的概要](#our-self-hosted-implementation-technical-overview)
  * [シンプルさと移植性のためのDockerベースのアーキテクチャ](#docker-based-architecture-for-simplicity-and-portability)
  * [Bashスクリプトによるインストール：アクセスのしやすさとセキュリティの両立](#bash-script-installation-accessibility-meets-security)
  * [将来を見据えた量子安全暗号化](#quantum-safe-encryption-for-future-proof-privacy)
  * [自動メンテナンスとアップデート](#automated-maintenance-and-updates)
* [オープンソースへのコミットメント](#the-open-source-commitment)
* [セルフホスト型 vs. マネージド：最適な選択をするために](#self-hosted-vs-managed-making-the-right-choice)
  * [セルフホスト型メールの現実](#the-reality-of-self-hosting-email)
  * [当社のマネージドサービスを選ぶべき時](#when-to-choose-our-managed-service)
* [セルフホスト型Forward Emailの始め方](#getting-started-with-self-hosted-forward-email)
  * [システム要件](#system-requirements)
  * [インストール手順](#installation-steps)
* [セルフホスト型メールの未来](#the-future-of-self-hosted-email)
* [結論：すべての人にメールの自由を](#conclusion-email-freedom-for-everyone)
* [参考文献](#references)


## 序文 {#foreword}

今日のデジタル環境において、メールは私たちのオンラインアイデンティティとコミュニケーションの基盤であり続けています。しかし、プライバシーへの懸念が高まる中、多くのユーザーは難しい選択を迫られています。利便性を取るか、プライバシーを取るか。Forward Emailでは、この二者択一を強いられるべきではないと常に考えてきました。

本日、私たちは大きな節目を迎えました。セルフホスト型メールソリューションのリリースです。この機能は、オープンソースの原則、プライバシー重視の設計、そしてユーザーの権限強化に対する私たちの最も深いコミットメントを表しています。セルフホスト型オプションにより、メールコミュニケーションの完全な力とコントロールをユーザー自身の手に委ねます。

本ブログ記事では、セルフホスト型ソリューションの哲学、技術的実装、そしてプライバシーと所有権を重視するユーザーにとってなぜ重要なのかを探ります。


## セルフホスト型メールが重要な理由 {#why-self-hosted-email-matters}

私たちのセルフホスト型メールソリューションは、真のプライバシーとはコントロールであり、そのコントロールはオープンソースから始まるという信念の最も明確な表現です。デジタルコミュニケーションの完全な所有権を求めるユーザーにとって、セルフホスティングはもはや周辺的な考えではなく、不可欠な権利です。私たちは、その信念を完全にオープンで検証可能なプラットフォームとして、自分の条件で運用できる形で提供できることを誇りに思います。

### 従来のメールサービスの問題点 {#the-problem-with-traditional-email-services}

従来のメールサービスは、プライバシーを重視するユーザーにとっていくつかの根本的な課題を抱えています：

1. **信頼の必要性**：プロバイダーがあなたのデータにアクセス、分析、共有しないと信頼しなければならない
2. **中央集権的な管理**：理由を問わずいつでもアクセスが取り消される可能性がある
3. **監視の脆弱性**：中央集権的なサービスは監視の主要なターゲットとなる
4. **透明性の欠如**：ほとんどのサービスは独自のクローズドソースソフトウェアを使用している
5. **ベンダーロックイン**：これらのサービスからの移行は困難または不可能な場合がある

「プライバシー重視」のメールプロバイダーでさえ、フロントエンドアプリケーションのみをオープンソース化し、バックエンドシステムは独自でクローズドなままにしていることが多いです。これにより、プライバシーの約束を検証できないという大きな信頼のギャップが生まれています。

### セルフホスト型の代替案 {#the-self-hosted-alternative}
メールをセルフホスティングすることは、根本的に異なるアプローチを提供します：

1. **完全なコントロール**：メールインフラ全体を所有し管理できます
2. **検証可能なプライバシー**：システム全体が透明で監査可能です
3. **信頼不要**：通信を第三者に信頼する必要がありません
4. **カスタマイズの自由**：システムを特定のニーズに合わせて適応可能です
5. **レジリエンス**：どの企業の決定にも関わらずサービスは継続します

あるユーザーはこう言いました：「メールをセルフホスティングすることは、自分で食べ物を育てるのと同じデジタルの感覚です—手間はかかりますが、中身を正確に知ることができます。」


## Our Self-Hosted Implementation: Technical Overview {#our-self-hosted-implementation-technical-overview}

私たちのセルフホスト型メールソリューションは、すべての製品を導くプライバシーファーストの原則に基づいて構築されています。これを可能にする技術的実装を見ていきましょう。

### Docker-Based Architecture for Simplicity and Portability {#docker-based-architecture-for-simplicity-and-portability}

私たちはメールインフラ全体をDockerでパッケージ化しており、ほぼすべてのLinuxベースのシステムに簡単に展開できます。このコンテナ化されたアプローチは以下の主要な利点を提供します：

1. **簡素化された展開**：単一コマンドでインフラ全体をセットアップ
2. **一貫した環境**：「自分の環境では動く」問題を排除
3. **分離されたコンポーネント**：各サービスは独自のコンテナで実行されセキュリティを確保
4. **簡単なアップデート**：スタック全体を更新する簡単なコマンド
5. **最小限の依存関係**：DockerとDocker Composeのみが必要

アーキテクチャには以下のコンテナが含まれます：

* 管理用のウェブインターフェース
* 送信用SMTPサーバー
* 受信用IMAP/POP3サーバー
* カレンダー用CalDAVサーバー
* 連絡先用CardDAVサーバー
* 設定保存用データベース
* キャッシュとパフォーマンス用Redis
* 安全で暗号化されたメールボックス保存用SQLite

> \[!NOTE]
> ぜひ[セルフホスト開発者ガイド](https://forwardemail.net/self-hosted)もご覧ください

### Bash Script Installation: Accessibility Meets Security {#bash-script-installation-accessibility-meets-security}

インストールプロセスは可能な限り簡単にしつつ、セキュリティのベストプラクティスを維持するよう設計しています：

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
```

この単一コマンドは：

1. システム要件を検証
2. 設定を案内
3. DNSレコードをセットアップ
4. TLS証明書を設定
5. Dockerコンテナを展開
6. 初期のセキュリティ強化を実施

bashにスクリプトをパイプすることに懸念がある方（その通りです！）は、実行前にスクリプトを確認することを推奨します。完全にオープンソースで検査可能です。

### Quantum-Safe Encryption for Future-Proof Privacy {#quantum-safe-encryption-for-future-proof-privacy}

ホスト型サービスと同様に、セルフホスト型ソリューションはSQLiteデータベースの暗号化にChaCha20-Poly1305を用いた量子耐性暗号を実装しています。この方法は現在の脅威だけでなく、将来の量子コンピュータ攻撃からもメールデータを保護します。

各メールボックスは独自の暗号化されたSQLiteデータベースファイルに保存され、ユーザー間の完全な分離を提供します。これは従来の共有データベース方式に比べて大きなセキュリティ上の利点です。

### Automated Maintenance and Updates {#automated-maintenance-and-updates}

セルフホスト型ソリューションには包括的なメンテナンスユーティリティを組み込んでいます：

1. **自動バックアップ**：重要データのスケジュールバックアップ
2. **証明書更新**：Let's Encrypt証明書の自動管理
3. **システム更新**：最新バージョンへの簡単なアップデートコマンド
4. **ヘルスモニタリング**：システムの整合性を保証する組み込みチェック

これらのユーティリティはシンプルな対話型メニューからアクセス可能です：

```bash
# script prompt

1. Initial setup
2. Setup Backups
3. Setup Auto Upgrades
4. Renew certificates
5. Restore from Backup
6. Help
7. Exit
```


## The Open-Source Commitment {#the-open-source-commitment}

私たちのセルフホスト型メールソリューションは、すべての製品と同様に、フロントエンドとバックエンドの両方が100%オープンソースです。これは：
1. **完全な透明性**: あなたのメールを処理するすべてのコードは公開されており、誰でも確認可能です  
2. **コミュニティによる貢献**: 誰でも改善や問題修正に参加できます  
3. **オープン性によるセキュリティ**: 脆弱性は世界中のコミュニティによって発見・修正されます  
4. **ベンダーロックインなし**: 当社の存続に依存することはありません  

コードベース全体はGitHubの <https://github.com/forwardemail/forwardemail.net> で公開されています。


## セルフホスト vs. マネージド: 正しい選択をするために {#self-hosted-vs-managed-making-the-right-choice}

セルフホストのオプションを提供できることを誇りに思っていますが、すべての方に適しているわけではないことも認識しています。メールのセルフホスティングには現実的な責任と課題があります：

### メールのセルフホスティングの現実 {#the-reality-of-self-hosting-email}

#### 技術的な考慮事項 {#technical-considerations}

* **サーバー管理**: VPSまたは専用サーバーの維持が必要です  
* **DNS設定**: 配信性のために適切なDNS設定が不可欠です  
* **セキュリティアップデート**: セキュリティパッチを常に最新に保つ必要があります  
* **スパム管理**: スパムフィルタリングの対応が必要です  
* **バックアップ戦略**: 信頼できるバックアップの実装はあなたの責任です  

#### 時間の投資 {#time-investment}

* **初期設定**: セットアップ、検証、ドキュメントの読解に時間がかかります  
* **継続的なメンテナンス**: 時折のアップデートと監視が必要です  
* **トラブルシューティング**: 問題解決に時間を要することがあります  

#### 金銭的な考慮事項 {#financial-considerations}

* **サーバー費用**: 基本的なVPSで月5～20ドル程度  
* **ドメイン登録費用**: 年間10～20ドル程度  
* **時間の価値**: あなたの時間投資には実際の価値があります  

### マネージドサービスを選ぶべき場合 {#when-to-choose-our-managed-service}

多くのユーザーにとって、マネージドサービスが最適な選択肢です：

1. **利便性**: メンテナンス、アップデート、監視をすべて当社が担当します  
2. **信頼性**: 確立されたインフラと専門知識を活用できます  
3. **サポート**: 問題発生時にサポートを受けられます  
4. **配信性**: 確立されたIPレピュテーションを利用できます  
5. **コスト効率**: 時間コストを考慮すると、当社サービスの方が経済的な場合が多いです  

どちらのオプションも同じプライバシー保護とオープンソースの透明性を提供し、違いはインフラ管理者が誰かだけです。


## セルフホスト版 Forward Email の始め方 {#getting-started-with-self-hosted-forward-email}

メールインフラを自分で管理したいですか？始め方はこちらです：

### システム要件 {#system-requirements}

* Ubuntu 20.04 LTS 以降（推奨）  
* 最低1GB RAM（2GB以上推奨）  
* 20GBのストレージ推奨  
* あなたが管理するドメイン名  
* ポート25対応のグローバルIPアドレス  
* [逆引きPTR](https://www.cloudflare.com/learning/dns/dns-records/dns-ptr-record/)の設定が可能  
* IPv4およびIPv6対応  

> \[!TIP]  
> 推奨する複数のメールサーバープロバイダーは <https://forwardemail.net/blog/docs/best-mail-server-providers> にて紹介しています（ソースは <https://github.com/forwardemail/awesome-mail-server-providers>）

### インストール手順 {#installation-steps}

1. **インストールスクリプトを実行**:  
   ```bash
   bash <(curl -fsSL https://raw.githubusercontent.com/forwardemail/forwardemail.net/master/self-hosting/setup.sh)
   ```

2. **対話形式の指示に従う**:  
   * ドメイン名を入力  
   * 管理者資格情報を設定  
   * 指示に従いDNSレコードを設定  
   * 好みの設定オプションを選択  

3. **インストールの検証**:  
   インストール完了後、以下で動作確認ができます：  
   * コンテナの状態確認: `docker ps`  
   * テストメールの送信  
   * Webインターフェースへのログイン  


## セルフホストメールの未来 {#the-future-of-self-hosted-email}

セルフホストソリューションは始まりに過ぎません。今後も以下の改善に取り組みます：

1. **強化された管理ツール**: より強力なWebベースの管理機能  
2. **追加の認証オプション**: ハードウェアセキュリティキー対応を含む  
3. **高度な監視機能**: システムの健康状態とパフォーマンスの詳細な洞察  
4. **マルチサーバー展開**: 高可用性構成の選択肢  
5. **コミュニティ主導の改善**: ユーザーからの貢献を取り入れること
## 結論：すべての人にメールの自由を {#conclusion-email-freedom-for-everyone}

当社のセルフホスト型メールソリューションのリリースは、プライバシー重視で透明性のあるメールサービスを提供するという使命における重要なマイルストーンです。マネージドサービスを選ぶにせよセルフホストオプションを選ぶにせよ、オープンソースの原則とプライバシーファーストの設計に対する揺るぎないコミットメントの恩恵を受けられます。

メールは、ユーザープライバシーよりもデータ収集を優先する閉鎖的で独自のシステムに支配されるには重要すぎます。Forward Emailのセルフホスト型ソリューションでは、デジタルコミュニケーションを完全にコントロールできる真の代替手段を誇りを持って提供しています。

プライバシーは単なる機能ではなく、基本的な権利だと私たちは信じています。そしてセルフホスト型メールオプションにより、その権利をこれまで以上にアクセスしやすくしています。

メールのコントロールを取り戻す準備はできましたか？[今すぐ始める](https://forwardemail.net/self-hosted)か、[GitHubリポジトリ](https://github.com/forwardemail/forwardemail.net)を探索して詳細を学んでください。


## 参考文献 {#references}

\[1] Forward Email GitHubリポジトリ: <https://github.com/forwardemail/forwardemail.net>

\[2] セルフホストドキュメント: <https://forwardemail.net/en/self-hosted>

\[3] メールプライバシー技術的実装: <https://forwardemail.net/en/blog/docs/email-privacy-protection-technical-implementation>

\[4] なぜオープンソースメールが重要か: <https://forwardemail.net/en/blog/docs/why-open-source-email-security-privacy>
