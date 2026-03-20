# Forward Emailがあなたのプライバシー、ドメイン、セキュリティを守る方法：技術的詳細解説 {#how-forward-email-protects-your-privacy-domain-and-security-the-technical-deep-dive}

<img loading="lazy" src="/img/articles/email-forwarding.webp" alt="最高のメール転送サービス比較" class="rounded-lg" />


## 目次 {#table-of-contents}

* [序文](#foreword)
* [Forward Emailのプライバシー哲学](#the-forward-email-privacy-philosophy)
* [SQLiteの実装：データの耐久性と移植性](#sqlite-implementation-durability-and-portability-for-your-data)
* [スマートキューと再試行メカニズム：メール配信の確実性](#smart-queue-and-retry-mechanism-ensuring-email-delivery)
* [インテリジェントなレート制限による無制限リソース](#unlimited-resources-with-intelligent-rate-limiting)
* [強化されたセキュリティのためのサンドボックス化された暗号化](#sandboxed-encryption-for-enhanced-security)
* [インメモリメール処理：最大限のプライバシーのためのディスク保存なし](#in-memory-email-processing-no-disk-storage-for-maximum-privacy)
* [完全なプライバシーのためのOpenPGPによるエンドツーエンド暗号化](#end-to-end-encryption-with-openpgp-for-complete-privacy)
* [包括的なセキュリティのための多層コンテンツ保護](#multi-layered-content-protection-for-comprehensive-security)
* [他のメールサービスとの違い：技術的プライバシー優位性](#how-we-differ-from-other-email-services-the-technical-privacy-advantage)
  * [検証可能なプライバシーのためのオープンソース透明性](#open-source-transparency-for-verifiable-privacy)
  * [妥協のないプライバシーのためのベンダーロックインなし](#no-vendor-lock-in-for-privacy-without-compromise)
  * [真の分離のためのサンドボックス化されたデータ](#sandboxed-data-for-true-isolation)
  * [データの移植性とコントロール](#data-portability-and-control)
* [プライバシーファーストなメール転送の技術的課題](#the-technical-challenges-of-privacy-first-email-forwarding)
  * [ログなしメール処理のためのメモリ管理](#memory-management-for-no-logging-email-processing)
  * [プライバシー保護フィルタリングのためのコンテンツ解析なしスパム検出](#spam-detection-without-content-analysis-for-privacy-preserving-filtering)
  * [プライバシーファースト設計との互換性維持](#maintaining-compatibility-with-privacy-first-design)
* [Forward Emailユーザーのためのプライバシー最良実践](#privacy-best-practices-for-forward-email-users)
* [結論：プライベートメール転送の未来](#conclusion-the-future-of-private-email-forwarding)


## 序文 {#foreword}

現代のデジタル環境において、メールのプライバシーはかつてないほど重要になっています。データ漏洩、監視の懸念、メール内容に基づくターゲティング広告などにより、ユーザーはプライバシーを最優先するソリューションを求めています。Forward Emailでは、プライバシーをアーキテクチャの基盤としてサービスを一から構築しました。本記事では、当サービスが最もプライバシー重視のメール転送ソリューションの一つである技術的実装について解説します。


## Forward Emailのプライバシー哲学 {#the-forward-email-privacy-philosophy}

技術的詳細に入る前に、私たちの基本的なプライバシー哲学を理解することが重要です：**あなたのメールはあなた自身のものであり、あなただけのものです**。この原則が、メール転送の取り扱いから暗号化の実装に至るまで、すべての技術的決定を導いています。

多くのメールプロバイダーが広告目的でメッセージをスキャンしたり、無期限にサーバーに保存したりするのとは異なり、Forward Emailは根本的に異なるアプローチを採用しています：

1. **インメモリ処理のみ** - 転送されたメールをディスクに保存しません
2. **メタデータの保存なし** - 誰が誰にメールを送っているかの記録を保持しません
3. **100%オープンソース** - コードベース全体が透明で監査可能です
4. **エンドツーエンド暗号化** - 真にプライベートな通信のためにOpenPGPをサポートしています


## SQLiteの実装：データの耐久性と移植性 {#sqlite-implementation-durability-and-portability-for-your-data}

Forward Emailの最も重要なプライバシー利点の一つは、慎重に設計された[SQLite](https://en.wikipedia.org/wiki/SQLite)の実装です。特定のPRAGMA設定と[Write-Ahead Logging (WAL)](https://en.wikipedia.org/wiki/Write-ahead_logging)を用いてSQLiteを最適化し、データの耐久性と移植性を確保しつつ、最高水準のプライバシーとセキュリティを維持しています。
量子耐性暗号化のための暗号として[ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305)を使用してSQLiteを実装した方法を以下に示します:

```javascript
// better-sqlite3-multiple-ciphersでデータベースを初期化
const Database = require('better-sqlite3-multiple-ciphers');

// ChaCha20-Poly1305暗号で暗号化を設定
db.pragma(`key="${decrypt(session.user.password)}"`);

// 耐久性とパフォーマンスのためにWrite-Ahead Loggingを有効化
db.pragma('journal_mode=WAL');

// プライバシー保護のため削除済みコンテンツをゼロで上書き
db.pragma('secure_delete=ON');

// 効率的なストレージ管理のため自動バキュームを有効化
db.pragma('auto_vacuum=FULL');

// 同時アクセス処理のためのビジータイムアウトを設定
db.pragma(`busy_timeout=${config.busyTimeout}`);

// 信頼性向上のため同期設定を最適化
db.pragma('synchronous=NORMAL');

// データ整合性のため外部キー制約を有効化
db.pragma('foreign_keys=ON');

// 国際文字対応のためUTF-8エンコーディングを設定
db.pragma(`encoding='UTF-8'`);

// データベースパフォーマンスを最適化
db.pragma('optimize=0x10002;');

// メモリではなくディスクを一時ストレージとして使用
db.pragma('temp_store=1;');
```

この実装により、データは安全であるだけでなく、ポータブルにもなります。メールは[MBOX](https://en.wikipedia.org/wiki/Email#Storage)、[EML](https://en.wikipedia.org/wiki/Email#Storage)、またはSQLite形式でいつでもエクスポート可能です。データを削除したい場合は、SQLのDELETE ROWコマンドを実行するのではなく、ディスク上のファイルを単純に削除するため、データベース内に痕跡が残ることはありません。

量子暗号化の側面では、データベース初期化時にChaCha20-Poly1305を暗号として使用し、現在および将来のデータプライバシーに対する脅威から強力に保護します。


## スマートキューとリトライ機構: メール配信の確実性を保証 {#smart-queue-and-retry-mechanism-ensuring-email-delivery}

ヘッダー処理だけに注目するのではなく、`getBounceInfo`メソッドによる高度なスマートキューとリトライ機構を実装しています。このシステムにより、一時的な問題が発生してもメールが配信される可能性を最大化します。

```javascript
function getBounceInfo(err) {
  // デフォルト値でバウンス情報を初期化
  const bounceInfo = {
    action: err.responseCode >= 500 ? 'reject' : 'defer',
    category: err.category || 'other',
    message: err.message,
    code: err.responseCode || err.code
  };

  // 適切なアクションを決定するためエラー応答を解析
  const response = err.response || err.message || '';

  // 問題が一時的か恒久的かを判定
  if (response.includes('temporarily deferred') ||
      response.includes('try again later')) {
    bounceInfo.action = 'defer';
  }

  // 適切な処理のためバウンス理由を分類
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
> これは`getBounceInfo`メソッドの抜粋であり、実際の詳細な実装ではありません。完全なコードは[GitHub](https://github.com/forwardemail/forwardemail.net/blob/master/helpers/get-bounce-info.js)でご確認いただけます。

業界標準の[Postfix](https://en.wikipedia.org/wiki/Postfix_\(software\))などと同様に、5日間メール配信をリトライし、一時的な問題が解決する時間を確保しています。この方法により、配信率を大幅に向上させつつプライバシーも維持します。

同様に、送信SMTPメールのメッセージ内容は配信成功後に編集（レダクト）されます。これはストレージシステムで設定されており、デフォルトの保持期間は30日で、ドメインの高度な設定で調整可能です。この期間経過後、メール内容は自動的に編集・削除され、プレースホルダーメッセージのみが残ります:

```txt
このメッセージは正常に送信されました。セキュリティとプライバシー保護のため、内容は編集され削除されました。メッセージ保持期間を延長したい場合は、ドメインの高度な設定ページにアクセスしてください。
```
このアプローチにより、送信したメールが無期限に保存されることがなくなり、データ漏洩や通信の不正アクセスのリスクを軽減します。


## インテリジェントなレート制限による無制限リソース {#unlimited-resources-with-intelligent-rate-limiting}

Forward Emailは無制限のドメインとエイリアスを提供していますが、システムの悪用を防ぎ、すべてのユーザーに公平な利用を保証するためにインテリジェントなレート制限を実装しています。例えば、非エンタープライズの顧客は1日に最大50以上のエイリアスを作成でき、これによりデータベースのスパムや過負荷を防ぎ、リアルタイムの悪用検知および保護機能が効果的に機能します。

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

このバランスの取れたアプローチにより、包括的なプライバシー管理のために必要なだけ多くのメールアドレスを作成する柔軟性を提供しつつ、すべてのユーザーに対してサービスの整合性とパフォーマンスを維持します。


## 強化されたセキュリティのためのサンドボックス化された暗号化 {#sandboxed-encryption-for-enhanced-security}

当社独自のサンドボックス化された暗号化アプローチは、多くのユーザーがメールサービス選択時に見落としがちな重要なセキュリティ上の利点を提供します。なぜデータ、特にメールをサンドボックス化することが重要なのかを見てみましょう。

GmailやProtonのようなサービスは、おそらく共有の[リレーショナルデータベース](https://en.wikipedia.org/wiki/Relational_database)を使用しており、これは根本的なセキュリティの脆弱性を生み出します。共有データベース環境では、あるユーザーのデータにアクセスできた場合、他のユーザーのデータにもアクセスできる可能性があります。これはすべてのユーザーデータが同じデータベーステーブルに格納されており、ユーザーIDなどの識別子でのみ区別されているためです。

Forward Emailはサンドボックス化された暗号化で根本的に異なるアプローチを取っています：

1. **完全な分離**：各ユーザーのデータは他のユーザーから完全に分離された独自の暗号化されたSQLiteデータベースファイルに保存されます
2. **独立した暗号化キー**：各データベースはユーザーのパスワードから派生した固有のキーで暗号化されます
3. **共有ストレージなし**：すべてのユーザーのメールが単一の「emails」テーブルにあるリレーショナルデータベースとは異なり、データの混在はありません
4. **多層防御**：仮に1人のユーザーのデータベースが侵害されても、他のユーザーのデータにはアクセスできません

このサンドボックス化アプローチは、メールを内部仕切りのある共有保管施設ではなく、別々の物理的な金庫に保管するようなものです。これはプライバシーとセキュリティを大幅に強化する根本的なアーキテクチャの違いです。


## メモリ内メール処理：最大限のプライバシーのためのディスク保存なし {#in-memory-email-processing-no-disk-storage-for-maximum-privacy}

当社のメール転送サービスでは、メールを完全にRAM内で処理し、ディスク保存やデータベースへの書き込みは一切行いません。このアプローチにより、メール監視やメタデータ収集に対して比類のない保護を提供します。

以下はメール処理の簡略化した流れです：

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
このアプローチは、たとえ当社のサーバーが侵害されたとしても、攻撃者がアクセスできる過去のメールデータが存在しないことを意味します。あなたのメールは単に当社のシステムを通過し、痕跡を残すことなく即座に宛先に転送されます。このログを残さないメール転送の方法は、監視からあなたの通信を守るための基本です。


## 完全なプライバシーのためのOpenPGPによるエンドツーエンド暗号化 {#end-to-end-encryption-with-openpgp-for-complete-privacy}

メール監視から最高レベルのプライバシー保護を必要とするユーザー向けに、当社はエンドツーエンド暗号化のための[OpenPGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy)をサポートしています。多くのメールプロバイダーが独自のブリッジやアプリを必要とするのに対し、当社の実装は標準的なメールクライアントで動作し、誰でも安全な通信を利用できるようにしています。

OpenPGP暗号化の実装方法は以下の通りです：

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

この実装により、メールはデバイスを離れる前に暗号化され、意図した受信者だけが復号できるため、当社でさえ通信内容を知ることはできません。これは、機密通信を不正アクセスや監視から守るために不可欠です。


## 包括的なセキュリティのための多層コンテンツ保護 {#multi-layered-content-protection-for-comprehensive-security}

Forward Emailは、さまざまな脅威に対して包括的なセキュリティを提供するために、デフォルトで有効になっている複数のコンテンツ保護レイヤーを提供しています：

1. **アダルトコンテンツ保護** - プライバシーを損なうことなく不適切なコンテンツをフィルタリング
2. **[フィッシング](https://en.wikipedia.org/wiki/Phishing)保護** - 匿名性を維持しつつ情報窃盗の試みをブロック
3. **実行ファイル保護** - コンテンツをスキャンせずに潜在的に有害な添付ファイルを防止
4. **[ウイルス](https://en.wikipedia.org/wiki/Computer_virus)保護** - プライバシーを守る技術を用いてマルウェアをスキャン

多くのプロバイダーがこれらの機能をオプトインにしているのに対し、当社はオプトアウト方式を採用し、すべてのユーザーがデフォルトでこれらの保護を享受できるようにしています。このアプローチは、プライバシーとセキュリティの両立に対する当社のコミットメントを反映しており、多くのメールサービスが達成できていないバランスを提供します。


## 他のメールサービスとの違い：技術的プライバシー優位性 {#how-we-differ-from-other-email-services-the-technical-privacy-advantage}

Forward Emailを他のメールサービスと比較すると、いくつかの重要な技術的違いが当社のプライバシーファーストのアプローチを際立たせています：

### 検証可能なプライバシーのためのオープンソースの透明性 {#open-source-transparency-for-verifiable-privacy}

多くのメールプロバイダーはオープンソースを謳っていますが、バックエンドコードを非公開にしていることが多いです。Forward Emailはフロントエンドとバックエンドの両方を含めて100% [オープンソース](https://en.wikipedia.org/wiki/Open_source)です。この透明性により、すべてのコンポーネントの独立したセキュリティ監査が可能であり、当社のプライバシー主張が誰でも検証できるようになっています。

### 妥協のないプライバシーのためのベンダーロックインなし {#no-vendor-lock-in-for-privacy-without-compromise}

多くのプライバシー重視のメールプロバイダーは独自のアプリやブリッジの使用を要求します。Forward Emailは[IMAP](https://en.wikipedia.org/wiki/Internet_Message_Access_Protocol)、[POP3](https://en.wikipedia.org/wiki/Post_Office_Protocol)、[SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)プロトコルを通じて任意の標準メールクライアントで動作し、プライバシーを損なうことなく好みのメールソフトを自由に選べます。
### 真の分離のためのサンドボックス化データ {#sandboxed-data-for-true-isolation}

すべてのユーザーのデータが混在する共有データベースを使用するサービスとは異なり、当社のサンドボックス化アプローチは各ユーザーのデータを完全に分離します。この根本的なアーキテクチャの違いにより、ほとんどのメールサービスよりもはるかに強力なプライバシー保証を提供します。

### データのポータビリティとコントロール {#data-portability-and-control}

私たちはあなたのデータはあなたのものであると考えているため、標準フォーマット（MBOX、EML、SQLite）でメールを簡単にエクスポートでき、必要なときにデータを完全に削除できるようにしています。このレベルのコントロールはメールプロバイダーの中でも稀ですが、真のプライバシーには不可欠です。


## プライバシー重視のメール転送における技術的課題 {#the-technical-challenges-of-privacy-first-email-forwarding}

プライバシー重視のメールサービスを構築するには、重大な技術的課題があります。私たちが克服してきた障害のいくつかを紹介します：

### ログを残さないメール処理のためのメモリ管理 {#memory-management-for-no-logging-email-processing}

ディスクに保存せずにメモリ内でメールを処理するには、高いメールトラフィックを効率的に処理するための慎重なメモリ管理が必要です。私たちは、高度なメモリ最適化技術を実装し、プライバシー保護戦略の重要な要素である保存しない方針を損なうことなく信頼性の高いパフォーマンスを確保しています。

### プライバシー保護フィルタリングのための内容解析なしのスパム検出 {#spam-detection-without-content-analysis-for-privacy-preserving-filtering}

ほとんどの[スパム](https://en.wikipedia.org/wiki/Email_spam)検出システムはメール内容の解析に依存していますが、これは私たちのプライバシー原則と矛盾します。私たちはメールの内容を読むことなくスパムパターンを特定する技術を開発し、プライバシーと使いやすさのバランスを取り、通信の機密性を守っています。

### プライバシー重視設計との互換性維持 {#maintaining-compatibility-with-privacy-first-design}

高度なプライバシー機能を実装しながらすべてのメールクライアントとの互換性を確保するには、創造的なエンジニアリングソリューションが必要でした。私たちのチームはプライバシーをシームレスにするために懸命に取り組んでおり、メール通信を保護する際に利便性とセキュリティのどちらかを選ぶ必要がないようにしています。


## Forward Emailユーザーのためのプライバシーのベストプラクティス {#privacy-best-practices-for-forward-email-users}

Forward Emailを使用する際にメール監視からの保護を最大化し、プライバシーを最大限に高めるために、以下のベストプラクティスを推奨します：

1. **サービスごとにユニークなエイリアスを使用する** - サービスごとに異なるメールエイリアスを作成し、サービス間の追跡を防ぐ
2. **OpenPGP暗号化を有効にする** - 機密通信にはエンドツーエンド暗号化を使用して完全なプライバシーを確保する
3. **メールエイリアスを定期的にローテーションする** - 重要なサービスのエイリアスを定期的に更新し、長期的なデータ収集を最小限に抑える
4. **強力でユニークなパスワードを使用する** - 不正アクセスを防ぐためにForward Emailアカウントを強力なパスワードで保護する
5. **[IPアドレス](https://en.wikipedia.org/wiki/IP_address)の匿名化を実施する** - 完全な匿名性のためにForward Emailと併用して[VPN](https://en.wikipedia.org/wiki/Virtual_private_network)の使用を検討する


## 結論：プライベートメール転送の未来 {#conclusion-the-future-of-private-email-forwarding}

Forward Emailでは、プライバシーは単なる機能ではなく基本的な権利であると考えています。私たちの技術的実装はこの信念を反映しており、あらゆるレベルでプライバシーを尊重し、メール監視やメタデータ収集からあなたを守るメール転送を提供します。

サービスの開発と改善を続ける中で、プライバシーへのコミットメントは揺るぎません。新しい暗号化手法の研究、追加のプライバシー保護の模索、コードベースの洗練を常に行い、最も安全なメール体験を提供しています。

Forward Emailを選ぶことは、単にメールサービスを選ぶことではなく、プライバシーが例外ではなくデフォルトであるインターネットのビジョンを支持することです。私たちと共に、よりプライベートなデジタル未来を一通のメールから築いていきましょう。
<!-- *Keywords: private email forwarding, email privacy protection, secure email service, open-source email, quantum-safe encryption, OpenPGP email, in-memory email processing, no-log email service, email metadata protection, email header privacy, end-to-end encrypted email, privacy-first email, anonymous email forwarding, email security best practices, email content protection, phishing protection, email virus scanning, privacy-focused email provider, secure email headers, email privacy implementation, protection from email surveillance, no-logging email forwarding, prevent email metadata leakage, email privacy techniques, IP address anonymization for email, private email aliases, email forwarding security, email privacy from advertisers, quantum-resistant email encryption, email privacy without compromise, SQLite email storage, sandboxed email encryption, data portability for email* -->

