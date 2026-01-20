# Forward Email がプライバシー、ドメイン、セキュリティを保護する仕組み: 技術的な詳細 {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="Best email forwarding service comparison" class="rounded-lg" />

## 目次 {#table-of-contents}

* [序文](#foreword)
* [フォワードメールのプライバシー哲学](#the-forward-email-privacy-philosophy)
* [SQLite の実装: データの耐久性と移植性](#sqlite-implementation-durability-and-portability-for-your-data)
* [スマートキューと再試行メカニズム：メール配信の保証](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [インテリジェントなレート制限による無制限のリソース](#unlimited-resources-with-intelligent-rate-limiting)
* [セキュリティ強化のためのサンドボックス暗号化](#sandboxed-encryption-for-enhanced-security)
* [メモリ内メール処理：ディスクストレージなしでプライバシーを最大限に保護](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [完全なプライバシーを実現するOpenPGPによるエンドツーエンドの暗号化](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [包括的なセキュリティのための多層コンテンツ保護](#multi-layered-content-protection-for-comprehensive-security)
* [他のメールサービスとの違い：技術的なプライバシーの優位性](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [検証可能なプライバシーのためのオープンソースの透明性](#open-source-transparency-for-verifiable-privacy)
  * [ベンダーロックインなしでプライバシーを妥協なく保護](#no-vendor-lock-in-for-privacy-without-compromise)
  * [真の分離を実現するサンドボックス化されたデータ](#sandboxed-data-for-true-isolation)
  * [データの移植性と制御](#data-portability-and-control)
* [プライバシー重視のメール転送における技術的課題](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [ログなしメール処理のためのメモリ管理](#memory-management-for-no-logging-email-processing)
  * [プライバシー保護フィルタリングのためのコンテンツ分析なしのスパム検出](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [プライバシー重視の設計との互換性の維持](#maintaining-compatibility-with-privacy-first-design)
* [転送メールユーザーのためのプライバシーのベストプラクティス](#privacy-best-practices-for-forward-email-users)
* [結論：プライベートメール転送の将来](#conclusion-the-future-of-private-email-forwarding)

## 序文 {#foreword}

今日のデジタル環境において、メールのプライバシーはかつてないほど重要になっています。データ漏洩、監視の懸念、メールの内容に基づくターゲティング広告といった問題を抱える中、ユーザーはプライバシーを最優先するソリューションを求める傾向が高まっています。Forward Emailでは、プライバシーをアーキテクチャの根幹に据えてサービスをゼロから構築してきました。このブログ記事では、当社のサービスを最もプライバシー重視のメール転送ソリューションの一つにしている技術的な実装について解説します。

## Forward Emailのプライバシー哲学 {#the-forward-email-privacy-philosophy}

技術的な詳細に入る前に、当社の基本的なプライバシー理念を理解することが重要です。**あなたのメールはあなただけのものです**。この理念は、メール転送の処理方法から暗号化の実装方法に至るまで、当社が行うあらゆる技術的決定の指針となっています。

広告目的でメッセージをスキャンしたり、メッセージをサーバー上に無期限に保存したりする多くのメール プロバイダーとは異なり、Forward Email は根本的に異なるアプローチで動作します。

1. **メモリ内処理のみ** - 転送されたメールはディスクに保存されません
2. **メタデータ保存なし** - 誰が誰にメールを送信したかの記録は保持されません
3. **100%オープンソース** - コードベース全体が透明性と監査性を備えています
4. **エンドツーエンド暗号化** - 真にプライベートな通信のためにOpenPGPをサポートしています

## SQLite 実装: データの耐久性と移植性 {#sqlite-implementation-durability-and-portability-for-your-data}

Forward Emailのプライバシー保護における最大のメリットの一つは、綿密に設計された[SQLite](https://en.wikipedia.org/wiki/SQLite)の実装です。SQLiteを特定のPRAGMA設定と[先行書き込みログ（WAL）](https://en.wikipedia.org/wiki/Write-ahead_logging)で微調整することで、最高水準のプライバシーとセキュリティを維持しながら、データの耐久性と移植性を確保しています。

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

ヘッダー処理のみに焦点を絞るのではなく、`getBounceInfo`メソッドを使用して、洗練されたスマートキューと再試行メカニズムを実装しました。このシステムにより、一時的な問題が発生した場合でも、メールが確実に配信される可能性が高まります。

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
> これは`getBounceInfo`メソッドの抜粋であり、実際の実装ではありません。完全なコードは[GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js)で確認できます。

業界標準の[ポストフィックス](https://en.wikipedia.org/wiki/Postfix_\(software\)と同様に、メール配信を5日間再試行することで、一時的な問題が解決する時間を確保します。このアプローチにより、プライバシーを維持しながら配信率を大幅に向上させることができます。

同様に、送信SMTPメールについても、配信成功後にメッセージの内容を編集します。これはストレージシステムで設定されており、デフォルトの保存期間は30日間です。この期間はドメインの詳細設定で調整できます。この期間が過ぎると、メールの内容は自動的に編集・消去され、プレースホルダーメッセージのみが残ります。

```txt
This message was successfully sent. It has been redacted and purged for your security and privacy. If you would like to increase your message retention time, please go to the Advanced Settings page for your domain.
```

このアプローチにより、送信したメールが無期限に保存されることがなくなり、データ漏洩や通信への不正アクセスのリスクが軽減されます。

## インテリジェントなレート制限による無制限のリソース {#unlimited-resources-with-intelligent-rate-limiting}

Forward Emailではドメインとエイリアスを無制限にご利用いただけますが、システムの不正使用を防ぎ、すべてのユーザーにとって公平な利用を保証するため、インテリジェントなレート制限を実装しています。例えば、エンタープライズプラン以外のお客様は1日に最大50件以上のエイリアスを作成できます。これにより、データベースへのスパム攻撃や過剰なアクセスを防ぎ、リアルタイムの不正使用防止機能を効果的に運用できます。

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

当社独自のサンドボックス暗号化アプローチは、多くのユーザーがメールサービスを選ぶ際に見落としがちな、セキュリティ上の重要なメリットを提供します。データ、特にメールのサンドボックス化がなぜそれほど重要なのか、その理由を探ってみましょう。

GmailやProtonなどのサービスは、共有[リレーショナルデータベース](https://en.wikipedia.org/wiki/Relational_database)を使用している可能性が高いため、根本的なセキュリティ上の脆弱性が生じます。共有データベース環境では、誰かがあるユーザーのデータにアクセスした場合、他のユーザーのデータにもアクセスできる可能性があります。これは、すべてのユーザーデータが同じデータベーステーブルに保存され、ユーザーIDなどの識別子によってのみ区切られているためです。

Forward Email は、サンドボックス化された暗号化によって根本的に異なるアプローチを採用しています。

1. **完全な分離**: 各ユーザーのデータは、他のユーザーから完全に分離された、暗号化されたSQLiteデータベースファイルに保存されます。
2. **独立した暗号化キー**: 各データベースは、ユーザーのパスワードから派生した固有のキーで暗号化されます。
3. **共有ストレージなし**: すべてのユーザーのメールアドレスが単一の「emails」テーブルに保存されるリレーショナルデータベースとは異なり、当社のアプローチではデータの混在が防止されます。
4. **多層防御**: たとえあるユーザーのデータベースが何らかの理由で侵害されたとしても、他のユーザーのデータにアクセスすることはできません。

このサンドボックス化されたアプローチは、メールを内部に仕切りのある共有ストレージ施設ではなく、独立した物理的な保管庫に保管するようなものです。これは根本的なアーキテクチャの違いであり、プライバシーとセキュリティを大幅に強化します。

## メモリ内メール処理：ディスクストレージなしでプライバシーを最大限に確保 {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

当社のメール転送サービスでは、メール処理はすべてRAM内で行われ、ディスクストレージやデータベースへの書き込みは一切行われません。このアプローチにより、メール監視やメタデータ収集に対する比類のない保護を実現しています。

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

このアプローチにより、たとえサーバーが侵害されたとしても、攻撃者がアクセスできるメール履歴データは存在しません。お客様のメールは当社のシステムを通過するだけで、痕跡を残さずに即座に宛先に転送されます。このログなしのメール転送アプローチは、お客様の通信を監視から保護するための基本的な手段です。

## 完全なプライバシーのための OpenPGP によるエンドツーエンドの暗号化 {#end-to-end-encryption-with-openpgp-for-complete-privacy}

メール監視から最高レベルのプライバシー保護を求めるユーザーのために、エンドツーエンドの暗号化を実現する[オープンPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)をサポートしています。多くのメールプロバイダーが独自のブリッジやアプリを必要とするのに対し、当社の実装は標準的なメールクライアントと連携し、誰もが安全な通信を利用できるようにします。

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

この実装により、メールはデバイスから送信される前に暗号化され、本来の受信者のみが復号できるため、当社からも通信のプライバシーが保護されます。これは、機密性の高い通信を不正アクセスや監視から保護するために不可欠です。

## 包括的なセキュリティのための多層コンテンツ保護 {#multi-layered-content-protection-for-comprehensive-security}

Forward Email は、デフォルトで有効になっている複数層のコンテンツ保護を提供し、さまざまな脅威に対する包括的なセキュリティを提供します。

1. **アダルトコンテンツ保護** - プライバシーを侵害することなく不適切なコンテンツをフィルタリングします
2. **[フィッシング](https://en.wikipedia.org/wiki/Phishing)保護** - 匿名性を維持しながら、情報窃取の試みをブロックします
3. **実行ファイル保護** - コンテンツをスキャンすることなく、潜在的に有害な添付ファイルをブロックします
4. **[ウイルス](https://en.wikipedia.org/wiki/Computer_virus)保護** - プライバシー保護技術を使用してマルウェアをスキャンします

これらの機能をオプトイン制にしている多くのプロバイダーとは異なり、当社はオプトアウト制を採用することで、すべてのユーザーがデフォルトでこれらの保護の恩恵を受けられるようにしています。このアプローチは、プライバシーとセキュリティの両方に対する当社のコミットメントを反映しており、多くのメールサービスが実現できていないバランスを実現しています。

## 他のメールサービスとの違い：技術的なプライバシーの優位性 {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Forward Email を他のメール サービスと比較すると、いくつかの重要な技術的な違いが、プライバシーを最優先する当社のアプローチを際立たせています。

### 検証可能なプライバシーのためのオープンソースの透明性 {#open-source-transparency-for-verifiable-privacy}

多くのメールプロバイダーはオープンソースを謳っていますが、バックエンドのコードは非公開にしているケースが多いです。Forward Emailは、フロントエンドとバックエンドのコードを含め、100% [オープンソース](https://en.wikipedia.org/wiki/Open_source)で構築されています。この透明性により、すべてのコンポーネントに対する独立したセキュリティ監査が可能になり、プライバシーに関する当社の主張を誰でも検証できるようになります。

### ベンダーロックインなしでプライバシーを侵害することなく {#no-vendor-lock-in-for-privacy-without-compromise}

プライバシー重視のメールプロバイダーの多くは、独自のアプリやブリッジの使用を要求します。Forward Emailは、[IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)、[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)、[SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)プロトコルを介して、あらゆる標準的なメールクライアントと連携するため、プライバシーを損なうことなく、お好みのメールソフトウェアを自由に選択できます。

### 真の分離を実現するサンドボックス化されたデータ {#sandboxed-data-for-true-isolation}

すべてのユーザーのデータが混在する共有データベースを使用するサービスとは異なり、当社のサンドボックス型アプローチでは、各ユーザーのデータが完全に分離されます。この根本的なアーキテクチャの違いにより、ほとんどのメールサービスが提供するものよりもはるかに強力なプライバシー保証が実現します。

### データの移植性と制御 {#data-portability-and-control}

私たちは、お客様のデータはお客様のものであると考えています。だからこそ、メールを標準形式（MBOX、EML、SQLite）で簡単にエクスポートし、必要に応じてデータを完全に削除できるようにしています。このようなレベルの制御はメールプロバイダーでは稀ですが、真のプライバシーのためには不可欠です。

## プライバシー重視のメール転送における技術的課題 {#the-technical-challenges-of-privacy-first-email-forwarding}

プライバシー重視のメールサービスを構築するには、大きな技術的課題が伴います。私たちが克服してきた課題の一部をご紹介します。

### ログなしメール処理のメモリ管理 {#memory-management-for-no-logging-email-processing}

ディスクストレージを使わずにメモリ内でメールを処理するには、大量のメールトラフィックを効率的に処理するために、綿密なメモリ管理が必要です。プライバシー保護戦略の重要な要素である「ストレージ不要」ポリシーを損なうことなく、信頼性の高いパフォーマンスを確保するために、高度なメモリ最適化技術を実装しました。

### プライバシー保護フィルタリングのためのコンテンツ分析なしのスパム検出 {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

ほとんどの[スパム](https://en.wikipedia.org/wiki/Email_spam)検出システムはメールの内容の分析に依存しており、これは当社のプライバシー原則に反します。当社は、メールの内容を読むことなくスパムパターンを識別する技術を開発し、プライバシーと使いやすさのバランスを取りながら、お客様のコミュニケーションの機密性を維持しています。

### プライバシー優先設計との互換性の維持 {#maintaining-compatibility-with-privacy-first-design}

高度なプライバシー機能を実装しながら、あらゆるメールクライアントとの互換性を確保するには、独創的なエンジニアリングソリューションが必要でした。私たちのチームは、プライバシーをシームレスに実現するためにたゆまぬ努力を重ねてきました。そのため、メール通信を保護する際に、利便性とセキュリティのどちらかを選ぶ必要はありません。

## 転送メールユーザー向けのプライバシーのベストプラクティス {#privacy-best-practices-for-forward-email-users}

電子メールの監視に対する保護を最大限に高め、電子メール転送を使用する際のプライバシーを最大限に高めるには、次のベスト プラクティスをお勧めします。

1. **サービスごとに異なるエイリアスを使用する** - 登録するサービスごとに異なるメールエイリアスを作成し、サービス間のトラッキングを防止します。
2. **OpenPGP暗号化を有効にする** - 機密性の高い通信には、エンドツーエンド暗号化を使用して完全なプライバシーを確保します。
3. **メールエイリアスを定期的にローテーションする** - 重要なサービスのエイリアスを定期的に更新し、長期的なデータ収集を最小限に抑えます。
4. **強力で固有のパスワードを使用する** - 不正アクセスを防ぐため、強力なパスワードで転送メールアカウントを保護します。
5. **[IPアドレス](https://en.wikipedia.org/wiki/IP_address)による匿名化を実装する** - 完全な匿名性を確保するために、転送メールと[VPN](https://en.wikipedia.org/wiki/Virtual_private_network)を併用することを検討してください。

## 結論: プライベートメール転送の将来 {#conclusion-the-future-of-private-email-forwarding}

Forward Emailでは、プライバシーは単なる機能ではなく、基本的な権利であると考えています。当社の技術実装はこの信念を反映し、あらゆるレベルでプライバシーを尊重し、メール監視やメタデータ収集から保護するメール転送サービスを提供しています。

サービスの開発と改善を続ける中で、プライバシーへの取り組みは揺るぎないものです。私たちは常に新しい暗号化方式を研究し、プライバシー保護の強化を模索し、コードベースを改良することで、可能な限り最も安全なメール体験を提供しています。

「メール転送」を選択することは、単にメールサービスを選択することではなく、プライバシーが例外ではなく標準となるインターネットのビジョンをサポートすることなのです。メールを一つずつ、よりプライバシーに配慮したデジタルの未来を築き上げていきましょう。

<!-- *キーワード: プライベートメール転送、メールプライバシー保護、セキュアメールサービス、オープンソースメール、耐量子暗号化、OpenPGPメール、インメモリメール処理、ログなしメールサービス、メールメタデータ保護、メールヘッダープライバシー、エンドツーエンド暗号化メール、プライバシー重視メール、匿名メール転送、メールセキュリティのベストプラクティス、メールコンテンツ保護、フィッシング対策、メールウイルススキャン、プライバシー重視のメールプロバイダー、セキュアメールヘッダー、メールプライバシー実装、メール監視からの保護、ログなしメール転送、メールメタデータ漏洩防止、メールプライバシー技術、メールのIPアドレス匿名化、プライベートメールエイリアス、メール転送セキュリティ、広告主からのメールプライバシー、耐量子メール暗号化、妥協のないメールプライバシー、SQLiteメールストレージ、サンドボックスメール暗号化、メールのデータポータビリティ* -->