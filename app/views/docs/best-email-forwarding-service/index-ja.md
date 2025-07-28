# Forward Email がプライバシー、ドメイン、セキュリティを保護する仕組み: 技術的な詳細 {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img 読み込み="lazy" src="/img/articles/email-forwarding.webp" alt="" class="rounded-lg" />

## 目次 {#table-of-contents}

* [序文](#foreword)
* [フォワードメールのプライバシー哲学](#the-forward-email-privacy-philosophy)
* [SQLite の実装: データの耐久性と移植性](#sqlite-implementation-durability-and-portability-for-your-data)
* [スマートキューと再試行メカニズム: メール配信の保証](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [インテリジェントなレート制限による無制限のリソース](#unlimited-resources-with-intelligent-rate-limiting)
* [セキュリティ強化のためのサンドボックス暗号化](#sandboxed-encryption-for-enhanced-security)
* [メモリ内電子メール処理: ディスクストレージなしでプライバシーを最大限に保護](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [完全なプライバシーを実現する OpenPGP によるエンドツーエンドの暗号化](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [包括的なセキュリティを実現する多層コンテンツ保護](#multi-layered-content-protection-for-comprehensive-security)
* [他のメールサービスとの違い: 技術的なプライバシーの優位性](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [検証可能なプライバシーのためのオープンソースの透明性](#open-source-transparency-for-verifiable-privacy)
  * [ベンダーロックインなしでプライバシーを妥協することなく保護](#no-vendor-lock-in-for-privacy-without-compromise)
  * [真の分離を実現するサンドボックス化されたデータ](#sandboxed-data-for-true-isolation)
  * [データの移植性と制御](#data-portability-and-control)
* [プライバシー重視のメール転送の技術的課題](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [ログなし電子メール処理のためのメモリ管理](#memory-management-for-no-logging-email-processing)
  * [プライバシー保護フィルタリングのためのコンテンツ分析なしのスパム検出](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [プライバシー重視の設計との互換性の維持](#maintaining-compatibility-with-privacy-first-design)
* [転送メールユーザーのためのプライバシーのベストプラクティス](#privacy-best-practices-for-forward-email-users)
* [結論: プライベートメール転送の将来](#conclusion-the-future-of-private-email-forwarding)

## 序文 {#foreword}

今日のデジタル環境では、電子メールのプライバシーはこれまで以上に重要になっています。データ侵害、監視の懸念、電子メールの内容に基づくターゲット広告などにより、ユーザーはプライバシーを優先するソリューションを求めるようになっています。Forward Email では、プライバシーをアーキテクチャの基盤として、サービスをゼロから構築してきました。このブログ投稿では、当社のサービスを最もプライバシー重視の電子メール転送ソリューションの 1 つにしている技術的な実装について説明します。

## Forward Emailのプライバシー哲学 {#the-forward-email-privacy-philosophy}

技術的な詳細に入る前に、当社の基本的なプライバシー理念を理解することが重要です。**あなたのメールはあなただけのものです**。この理念は、メール転送の処理方法から暗号化の実装方法に至るまで、当社が行うあらゆる技術的決定の指針となっています。

広告目的でメッセージをスキャンしたり、サーバー上にメッセージを無期限に保存したりする多くのメール プロバイダーとは異なり、Forward Email は根本的に異なるアプローチで動作します。

1. **メモリ内処理のみ** - 転送されたメールはディスクに保存されません
2. **メタデータ保存なし** - 誰が誰にメールを送信したかの記録は保持されません
3. **100%オープンソース** - コードベース全体が透明性と監査性を備えています
4. **エンドツーエンド暗号化** - 真にプライベートな通信のためにOpenPGPをサポートしています

## SQLite 実装: データの耐久性と移植性 {#sqlite-implementation-durability-and-portability-for-your-data}

Forward Email のプライバシー保護における最大のメリットの一つは、綿密に設計された [SQLite](https://en.wikipedia.org/wiki/SQLite) の実装です。SQLite を特定の PRAGMA 設定と [先行書き込みログ (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging) で微調整することで、最高水準のプライバシーとセキュリティを維持しながら、データの耐久性と移植性を確保しています。

以下に、量子耐性暗号化の暗号として [ChaCha20-ポリ1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) を使用して SQLite を実装した方法を示します。

```javascript
// Initialize the database with better-sqlite3-multiple-ciphers
const Database = require('better-sqlite3-multiple-ciphers');

// Set up encryption with ChaCha20-Poly1305 cipher
db.pragma(`key="${decrypt(session.user.password)}"`);

// Enable Write-Ahead Logging for durability and performance
db.pragma('journal_mode=WAL');

// Overwrite deleted content with zeros for privacy
db.pragma('secure_delete=ON');

// Enable auto vacuum for efficient storage management
db.pragma('auto_vacuum=FULL');

// Set busy timeout for handling concurrent access
db.pragma(`busy_timeout=${config.busyTimeout}`);

// Optimize synchronization for reliability
db.pragma('synchronous=NORMAL');

// Enable foreign key constraints for data integrity
db.pragma('foreign_keys=ON');

// Set UTF-8 encoding for international character support
db.pragma(`encoding='UTF-8'`);

// Optimize database performance
db.pragma('optimize=0x10002;');

// Use disk for temporary storage instead of memory
db.pragma('temp_store=1;');
```

この実装により、データの安全性だけでなく、可搬性も確保されます。[MBOX](https://en.wikipedia.org/wiki/Email#Storage)、[EML](https://en.wikipedia.org/wiki/Email#Storage)、またはSQLite形式でエクスポートすることで、いつでもメールを持ち出すことができます。また、データを削除したい場合も、完全に消去されます。データベースに痕跡が残る可能性のあるSQL DELETE ROWコマンドを実行するのではなく、ディスクストレージからファイルを削除するだけです。

当社の実装の量子暗号化の側面では、データベースを初期化するときに暗号として ChaCha20-Poly1305 を使用し、データ プライバシーに対する現在および将来の脅威に対して強力な保護を提供します。

## スマートキューと再試行メカニズム: メール配信の保証 {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

ヘッダー処理のみに焦点を絞るのではなく、`getBounceInfo` メソッドを用いた、洗練されたスマートキューと再試行のメカニズムを実装しました。このシステムにより、一時的な問題が発生した場合でも、メールが確実に配信される可能性が高まります。

```javascript
function getBounceInfo(err) {
  // Initialize bounce info with default values
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // Analyze error response to determine appropriate action
  const response = err.response || err.message || '';

  // Determine if the issue is temporary or permanent
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // Categorize the bounce reason for appropriate handling
  if (response.includes('mailbox full')) {
    bounceInfo.category = 'full';
    bounceInfo.action = 'defer';
  } else if (response.includes('user unknown')) {
    bounceInfo.category = 'unknown';
  }

  return bounceInfo;
}
```

> \[!NOTE]
> This is an excerpt of the `getBounceInfo` method and not the actual extensive implementation. For the complete code, you can review it on [GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js).

メール配信の再試行は、業界標準の[ポストフィックス](https://en.wikipedia.org/wiki/Postfix_\(software\)などと同様に5日間行います。これにより、一時的な問題が解決する時間を確保します。このアプローチにより、プライバシーを維持しながら配信率を大幅に向上させることができます。

同様に、送信 SMTP メールのメッセージ内容も、配信が成功した後に編集します。これは、ストレージ システムでデフォルトの保存期間 30 日に設定されていますが、ドメインの詳細設定で調整できます。この期間が過ぎると、メールの内容は自動的に編集されて消去され、プレースホルダー メッセージのみが残ります。

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

このアプローチにより、送信された電子メールが無期限に保存されることがなくなり、データ漏洩や通信への不正アクセスのリスクが軽減されます。

## インテリジェントなレート制限による無制限のリソース {#unlimited-resources-with-intelligent-rate-limiting}

Forward Email では無制限のドメインとエイリアスを提供していますが、システムを不正使用から保護し、すべてのユーザーに公平な使用を保証するために、インテリジェントなレート制限を実装しています。たとえば、非エンタープライズのお客様は 1 日に最大 50 以上のエイリアスを作成できます。これにより、データベースがスパムやフラッディングされるのを防ぎ、リアルタイムの不正使用および保護機能を効果的に機能させることができます。

```javascript
// Rate limiter implementation
const rateLimiter = new RateLimiter({
  // Configuration settings
});

// Check rate limits before processing
const limit = await rateLimiter.get({
  key: `domain:${domain.id}`,
  duration: ms('1d')
});

// Apply appropriate action based on limit status
if (limit.remaining <= 0) {
  // Handle rate limit exceeded
}
```

このバランスの取れたアプローチにより、すべてのユーザーに対するサービスの整合性とパフォーマンスを維持しながら、包括的なプライバシー管理のために必要な数の電子メール アドレスを柔軟に作成できます。

## セキュリティ強化のためのサンドボックス暗号化 {#sandboxed-encryption-for-enhanced-security}

当社独自のサンドボックス暗号化アプローチは、多くのユーザーがメール サービスを選択する際に見落としがちな重要なセキュリティ上の利点を提供します。サンドボックス データ、特にメールがなぜそれほど重要なのかを見てみましょう。

GmailやProtonのようなサービスは、共有の[リレーショナルデータベース](https://en.wikipedia.org/wiki/Relational_database)を使用している可能性が高いため、根本的なセキュリティ上の脆弱性が生じます。共有データベース環境では、誰かがあるユーザーのデータにアクセスした場合、他のユーザーのデータにもアクセスできる可能性があります。これは、すべてのユーザーデータが同じデータベーステーブルに保存され、ユーザーIDなどの識別子によってのみ区切られているためです。

Forward Email は、サンドボックス化された暗号化によって根本的に異なるアプローチを採用しています。

1. **完全な分離**: 各ユーザーのデータは、他のユーザーから完全に分離された、暗号化されたSQLiteデータベースファイルに保存されます。
2. **独立した暗号化キー**: 各データベースは、ユーザーのパスワードから派生した固有のキーで暗号化されます。
3. **共有ストレージなし**: すべてのユーザーのメールアドレスが単一の「emails」テーブルに保存されるリレーショナルデータベースとは異なり、当社のアプローチではデータの混在が防止されます。
4. **多層防御**: たとえあるユーザーのデータベースが何らかの理由で侵害されたとしても、他のユーザーのデータにアクセスすることはできません。

このサンドボックス化されたアプローチは、内部に仕切りがある共有ストレージ施設ではなく、別の物理的な金庫に電子メールを保管するのと似ています。これは、プライバシーとセキュリティを大幅に強化する根本的なアーキテクチャの違いです。

## メモリ内メール処理：ディスクストレージなしでプライバシーを最大限に確保 {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

当社の電子メール転送サービスでは、電子メールはすべて RAM 内で処理され、ディスク ストレージやデータベースに書き込まれることはありません。このアプローチにより、電子メール監視やメタデータ収集に対する比類のない保護が実現します。

電子メール処理の仕組みを簡単に説明します。

```javascript
async function onData(stream, _session, fn) {
  // Store clone of session since it gets modified/destroyed
  const session = JSON.parse(safeStringify(_session));

  try {
    // Process the email stream in memory
    const messageSplitter = new MessageSplitter({
      maxBytes: MAX_BYTES
    });
    stream.pipe(messageSplitter);
    const body = await getStream.buffer(messageSplitter);

    const { headers } = messageSplitter;

    // Update session object with useful debug info for error logs
    await updateSession.call(this, body, headers, session);

    // Process the email without storing to disk
    // [Processing code omitted for brevity]

    // Return success without persisting email data
    fn();
  } catch (err) {
    // Handle errors without storing sensitive information
    fn(err);
  }
}
```

このアプローチは、たとえ当社のサーバーが侵害されたとしても、攻撃者がアクセスできる過去のメール データが存在しないことを意味します。お客様のメールは当社のシステムを通過するだけで、痕跡を残さずにすぐに宛先に転送されます。このログなしのメール転送アプローチは、お客様の通信を監視から保護するための基本です。

## 完全なプライバシーのための OpenPGP によるエンドツーエンドの暗号化 {#end-to-end-encryption-with-openpgp-for-complete-privacy}

メール監視から最高レベルのプライバシー保護を求めるユーザーのために、エンドツーエンドの暗号化を実現する[オープンPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy) をサポートしています。多くのメールプロバイダーが独自のブリッジやアプリを必要とするのに対し、当社の実装は標準的なメールクライアントで動作するため、誰もが安全な通信を利用できます。

OpenPGP 暗号化を実装する方法は次のとおりです。

```javascript
async function encryptMessage(pubKeyArmored, raw, isArmored = true) {
  // [Initial validation code omitted for brevity]

  // Read the public key
  const pubKey = isArmored
    ? await openpgp.readKey({
        armoredKey: tools.prepareArmoredPubKey(pubKeyArmored),
        config: { tolerant: true }
      })
    : pubKeyArmored;

  if (!pubKey) throw new TypeError('Public key does not exist');

  // Perform the actual encryption using OpenPGP
  const ciphertext = await openpgp.encrypt({
    message: await openpgp.createMessage({
      binary: Buffer.concat([Buffer.from(bodyHeaders + '\r\n\r\n'), body])
    }),
    encryptionKeys: pubKey,
    format: 'armored',
    config: { minRSABits: 1024 }
  });

  // Format the encrypted message as a proper MIME message
  // [MIME formatting code omitted for brevity]

  return Buffer.concat([headers, breaker, Buffer.from(text)]);
}
```

この実装により、メールはデバイスから送信される前に暗号化され、意図した受信者のみが復号化できるため、当社に対しても通信のプライバシーが保護されます。これは、機密性の高い通信を不正アクセスや監視から保護するために不可欠です。

## 包括的なセキュリティのための多層コンテンツ保護 {#multi-layered-content-protection-for-comprehensive-security}

Forward Email は、デフォルトで有効になっている複数のレイヤーのコンテンツ保護を提供し、さまざまな脅威に対する包括的なセキュリティを提供します。

1. **アダルトコンテンツ保護** - プライバシーを侵害することなく不適切なコンテンツをフィルタリングします
2. **[フィッシング](https://en.wikipedia.org/wiki/Phishing) 保護** - 匿名性を維持しながら、情報窃取の試みをブロックします
3. **実行ファイル保護** - コンテンツをスキャンすることなく、潜在的に有害な添付ファイルをブロックします
4. **[ウイルス](https://en.wikipedia.org/wiki/Computer_virus) 保護** - プライバシー保護技術を使用してマルウェアをスキャンします

これらの機能をオプトインにしている多くのプロバイダーとは異なり、当社はオプトアウトにすることで、すべてのユーザーがデフォルトでこれらの保護の恩恵を受けられるようにしています。このアプローチは、プライバシーとセキュリティの両方に対する当社の取り組みを反映しており、多くのメール サービスが達成できないバランスを実現しています。

## 他のメールサービスとの違い：技術的なプライバシーの優位性 {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Forward Email を他のメール サービスと比較すると、いくつかの重要な技術的な違いが、プライバシーを第一に考える当社のアプローチを浮き彫りにしています。

### 検証可能なプライバシーのためのオープンソースの透明性 {#open-source-transparency-for-verifiable-privacy}

多くのメールプロバイダーはオープンソースを謳っていますが、バックエンドのコードは非公開であることが多いです。Forward Emailは、フロントエンドとバックエンドのコードを含め、100% [オープンソース](https://en.wikipedia.org/wiki/Open_source) で保護されています。この透明性により、すべてのコンポーネントの独立したセキュリティ監査が可能になり、プライバシーに関する当社の主張を誰でも検証できるようになります。

### ベンダーロックインなしでプライバシーを侵害することなく {#no-vendor-lock-in-for-privacy-without-compromise}

プライバシー重視のメールプロバイダーの多くは、独自のアプリやブリッジの使用を要求します。Forward Emailは、[IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)、[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)、[SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)プロトコルを通じて、あらゆる標準的なメールクライアントと連携できるため、プライバシーを損なうことなく、お好みのメールソフトウェアを自由に選択できます。

### 真の分離を実現するサンドボックス化されたデータ {#sandboxed-data-for-true-isolation}

すべてのユーザーのデータが混在する共有データベースを使用するサービスとは異なり、サンドボックス化されたアプローチでは、各ユーザーのデータが完全に分離されます。この基本的なアーキテクチャの違いにより、ほとんどの電子メール サービスが提供するものよりもはるかに強力なプライバシー保証が実現します。

### データの移植性と管理 {#data-portability-and-control}

私たちは、あなたのデータはあなたのものであると信じています。そのため、標準形式 (MBOX、EML、SQLite) でメールを簡単にエクスポートし、必要に応じてデータを完全に削除できるようにしています。このレベルの制御はメール プロバイダーでは珍しいものですが、真のプライバシーには不可欠です。

## プライバシー重視のメール転送における技術的課題 {#the-technical-challenges-of-privacy-first-email-forwarding}

プライバシーを第一に考えたメール サービスを構築するには、大きな技術的課題が伴います。私たちが克服した障害のいくつかを以下に示します。

### ログなしメール処理のためのメモリ管理 {#memory-management-for-no-logging-email-processing}

ディスク ストレージを使用せずにメモリ内で電子メールを処理するには、大量の電子メール トラフィックを効率的に処理するために、慎重なメモリ管理が必要です。当社では、プライバシー保護戦略の重要な要素であるストレージなしポリシーを犠牲にすることなく、信頼性の高いパフォーマンスを確保するために、高度なメモリ最適化技術を実装しました。

### プライバシー保護フィルタリングのためのコンテンツ分析なしのスパム検出 {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

ほとんどの[スパム](https://en.wikipedia.org/wiki/Email_spam)検出システムはメールの内容の分析に依存しており、これは当社のプライバシー原則に反します。当社は、メールの内容を読むことなくスパムパターンを識別する技術を開発し、プライバシーと使いやすさのバランスを取りながら、お客様の通信の機密性を維持しています。

### プライバシー優先設計との互換性の維持 {#maintaining-compatibility-with-privacy-first-design}

高度なプライバシー機能を実装しながら、すべての電子メール クライアントとの互換性を確保するには、独創的なエンジニアリング ソリューションが必要です。当社のチームは、プライバシーをシームレスにするためにたゆまぬ努力を重ねてきました。そのため、電子メール通信を保護する際に利便性とセキュリティのどちらかを選択する必要はありません。

## 転送メールユーザー向けのプライバシーのベストプラクティス {#privacy-best-practices-for-forward-email-users}

電子メールの監視に対する保護を最大限に高め、電子メール転送を使用する際のプライバシーを最大限に保護するには、次のベスト プラクティスをお勧めします。

1. **サービスごとに異なるエイリアスを使用する** - 登録するサービスごとに異なるメールエイリアスを作成し、サービス間のトラッキングを防止します。
2. **OpenPGP暗号化を有効にする** - 機密性の高い通信には、エンドツーエンド暗号化を使用して完全なプライバシーを確保します。
3. **メールエイリアスを定期的にローテーションする** - 重要なサービスのエイリアスを定期的に更新し、長期的なデータ収集を最小限に抑えます。
4. **強力で固有のパスワードを使用する** - 強力なパスワードで転送メールアカウントを保護し、不正アクセスを防止します。
5. **[IPアドレス](https://en.wikipedia.org/wiki/IP_address)匿名化を実装する** - 完全な匿名性を確保するために、転送メールと[VPN](https://en.wikipedia.org/wiki/Virtual_private_network)を併用することを検討してください。

## 結論: プライベートメール転送の将来 {#conclusion-the-future-of-private-email-forwarding}

Forward Email では、プライバシーは単なる機能ではなく、基本的な権利であると考えています。当社の技術的実装はこの信念を反映しており、あらゆるレベルでプライバシーを尊重し、メール監視やメタデータ収集から保護するメール転送を提供しています。

当社はサービスの開発と改善を続けていますが、プライバシーに対する取り組みは揺るぎないものです。当社は常に新しい暗号化方式を研究し、追加のプライバシー保護を模索し、コードベースを改良して、可能な限り最も安全な電子メール エクスペリエンスを提供しています。

「メール転送」を選択することは、単にメール サービスを選択することではなく、プライバシーが例外ではなくデフォルトであるインターネットのビジョンをサポートすることです。メール 1 つずつ、よりプライベートなデジタルの未来を構築するために、私たちと一緒に取り組んでください。

<!-- *キーワード: プライベートメール転送、メールプライバシー保護、セキュアメールサービス、オープンソースメール、耐量子暗号化、OpenPGPメール、インメモリメール処理、ログなしメールサービス、メールメタデータ保護、メールヘッダープライバシー、エンドツーエンド暗号化メール、プライバシー重視メール、匿名メール転送、メールセキュリティのベストプラクティス、メールコンテンツ保護、フィッシング対策、メールウイルススキャン、プライバシー重視のメールプロバイダー、セキュアメールヘッダー、メールプライバシー実装、メール監視からの保護、ログなしメール転送、メールメタデータ漏洩防止、メールプライバシー技術、メールのIPアドレス匿名化、プライベートメールエイリアス、メール転送セキュリティ、広告主からのメールプライバシー、耐量子メール暗号化、妥協のないメールプライバシー、SQLiteメールストレージ、サンドボックスメール暗号化、メールのデータポータビリティ* -->