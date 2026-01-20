# プライバシーポリシー {#privacy-policy}

<img loading="lazy" src="/img/articles/privacy.webp" alt="Forward Email privacy policy" class="rounded-lg" />

## 目次 {#table-of-contents}

* [免責事項](#disclaimer)
* [収集されない情報](#information-not-collected)
* [収集される情報](#information-collected)
* [共有される情報](#information-shared)
* [情報の削除](#information-removal)
* [追加開示事項](#additional-disclosures)

## 免責事項 {#disclaimer}

サイト全体に適用される [条項](/terms) に従ってください。

## 情報は収集されませんでした {#information-not-collected}

**[エラー](/faq#do-you-store-error-logs)、[送信SMTPメール](/faq#do-you-support-sending-email-with-smtp) を除き、またスパムや悪意のあるアクティビティが検出された場合 (レート制限など) は、**

* 転送されたメールはディスクストレージやデータベースに保存されません。
* メールに関するメタデータはディスクストレージやデータベースに保存されません。
* ログやIPアドレスはディスクストレージやデータベースに保存されません。

## 収集された情報 {#information-collected}

透明性を確保するため、いつでも<a href="https://github.com/forwardemail" target="_blank" rel="noopener noreferrer">ソース コードを表示</a>して、以下の情報がどのように収集され、使用されているかを確認できます。

**機能性とサービスの向上のためだけに、当社は以下の情報を収集し、安全に保管します。**

* メールとカレンダー情報は、IMAP/POP3/CalDAV/CardDAV へのアクセスとメールボックス機能のみを目的として、[暗号化されたSQLiteデータベース](/blog/docs/best-quantum-safe-encrypted-email-service) に保存されます。
* メール転送サービスのみをご利用の場合、[収集されない情報](#information-not-collected) に記載されているように、メールはディスクやデータベースストアに保存されませんのでご注意ください。
* メール転送サービスはメモリ内でのみ動作します（ディスクストレージやデータベースへの書き込みは行われません）。
* IMAP/POP3/CalDAV/CardDAV ストレージは、保存時および転送時に暗号化され、LUKS 暗号化ディスクに保存されます。
* IMAP/POP3/CalDAV/CardDAV ストレージのバックアップは、保存時および転送時に暗号化され、[クラウドフレアR2](https://www.cloudflare.com/developer-platform/r2/) に保存されます。
* ウェブサイトのトラフィックに関するセッションに Cookie を保存します。
* お客様から提供されたメールアドレスを保存します。 * お客様からご提供いただいたドメイン名、エイリアス、および設定を保存します。
* `4xx` および `5xx`、SMTP 応答コード [エラーログ](/faq#do-you-store-error-logs) は 7 日間保存されます。
* [送信SMTPメール](/faq#do-you-support-sending-email-with-smtp) は 30 日間保存されます。
* この保存期間は「Date」ヘッダーによって異なります。将来の日付の「Date」ヘッダーが存在する場合、メールの送信を許可します。
* **メールが正常に配信された場合、または永続的なエラーが発生した場合、メッセージ本文は編集され、消去されますのでご注意ください。**
* 送信 SMTP メールの本文をデフォルトの 0 日間（正常に配信された場合、または永続的なエラーが発生した場合）より長く保持するように設定する場合は、ドメインの詳細設定に移動し、`0` から `30` の間の値を入力してください。
* 一部のユーザーは、[マイアカウント > メール](/my-account/emails) プレビュー機能を使用してメールの表示方法を確認できるため、設定可能な保持期間をサポートしています。
* なお、__PROTECTED_LINK_30__0 もサポートしています。
* メールや <a href="/help">ヘルプ</a> ページに投稿されたコメントや質問など、お客様が自発的に提供した追加情報。

## 情報共有 {#information-shared}

当社はお客様の情報を第三者と共有することはありません。また、第三者の分析サービスやテレメトリソフトウェアサービスも使用しておりません。

当社は、裁判所命令による法的要請に応じる必要がある場合があり、それに従います (ただし、[上記の「収集されない情報」に記載されている情報は収集しません。](#information-not-collected) に留意してください。そのため、最初からそれを提供することはできません)。

## 情報の削除 {#information-removal}

いつでも、当社に提供した情報を削除したい場合は、<a href="/my-account/security">マイアカウント > セキュリティ</a> に移動して、「アカウントの削除」をクリックしてください。

不正使用の防止と軽減のため、最初のお支払いから 5 日以内にアカウントを削除した場合、管理者による手動削除の確認が必要になる場合があります。

このプロセスは通常 24 時間以内に完了します。これは、ユーザーが当社のサービスにスパムを送信し、その後すぐにアカウントを削除したために実装されました。これにより、Stripe でそのユーザーの支払い方法のフィンガープリントをブロックできなくなりました。

## 追加開示事項 {#additional-disclosures}

このサイトは Cloudflare によって保護されており、その [プライバシーポリシー](https://www.cloudflare.com/privacypolicy/) と [利用規約](https://www.cloudflare.com/website-terms/) が適用されます。