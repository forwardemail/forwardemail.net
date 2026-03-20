# Forward Emailを使ったNASメール設定完全ガイド {#complete-guide-to-nas-email-setup-with-forward-email}

NASでのメール通知設定は面倒であってはなりません。Synology、QNAP、あるいはRaspberry Piのセットアップであっても、このガイドがあればForward Emailと連携して、問題が発生したときに確実に通知を受け取れます。

ほとんどのNASデバイスはドライブ障害、温度警告、バックアップ完了、セキュリティイベントのメールアラートを送信できます。問題は、多くのメールプロバイダーがセキュリティに厳しくなり、古いデバイスが対応できないことです。そこでForward Emailの出番です。最新デバイスもレガシーデバイスもサポートしています。

このガイドでは75以上のNASプロバイダーのメール設定を、ステップバイステップの手順、対応情報、トラブルシューティングのヒントとともに解説します。どんなデバイスでも通知が確実に届くようにします。


## 目次 {#table-of-contents}

* [NASメール通知が必要な理由](#why-you-need-nas-email-notifications)
* [TLSの問題（とその解決方法）](#the-tls-problem-and-how-we-fix-it)
* [Forward EmailのSMTP設定](#forward-email-smtp-settings)
* [包括的なNASプロバイダー対応マトリックス](#comprehensive-nas-provider-compatibility-matrix)
* [Synology NASメール設定](#synology-nas-email-configuration)
  * [設定手順](#configuration-steps)
* [QNAP NASメール設定](#qnap-nas-email-configuration)
  * [設定手順](#configuration-steps-1)
  * [QNAPのよくあるトラブルシューティング](#common-qnap-troubleshooting-issues)
* [ReadyNASレガシー設定](#readynas-legacy-configuration)
  * [レガシー設定手順](#legacy-configuration-steps)
  * [ReadyNASトラブルシューティング](#readynas-troubleshooting)
* [TerraMaster NAS設定](#terramaster-nas-configuration)
* [ASUSTOR NAS設定](#asustor-nas-configuration)
* [Buffalo TeraStation設定](#buffalo-terastation-configuration)
* [Western Digital My Cloud設定](#western-digital-my-cloud-configuration)
* [TrueNASメール設定](#truenas-email-configuration)
* [OpenMediaVault設定](#openmediavault-configuration)
* [Raspberry Pi NAS設定](#raspberry-pi-nas-configuration)
  * [Raspberry Pi初期セットアップ](#initial-raspberry-pi-setup)
  * [Sambaファイル共有設定](#samba-file-sharing-configuration)
  * [FTPサーバー設定](#ftp-server-setup)
  * [メール通知設定](#email-notification-configuration)
  * [高度なRaspberry Pi NAS機能](#advanced-raspberry-pi-nas-features)
  * [Raspberry Piメールトラブルシューティング](#raspberry-pi-email-troubleshooting)
  * [パフォーマンス最適化](#performance-optimization)
  * [セキュリティ考慮事項](#security-considerations)


## NASメール通知が必要な理由 {#why-you-need-nas-email-notifications}

NASはドライブの状態、温度、ネットワーク問題、セキュリティイベントなど多くのことを監視しています。メールアラートがなければ、問題が数週間気づかれずに放置され、データ損失やセキュリティ侵害につながる可能性があります。

メール通知はドライブ障害の即時警告、不正アクセス試行の警告、バックアップ成功の確認、システム状態の情報提供を行います。Forward Emailはこれら重要な通知が確実に届くようにします。


## TLSの問題（とその解決方法） {#the-tls-problem-and-how-we-fix-it}

状況はこうです：2020年以前に作られたNASはおそらくTLS 1.0しかサポートしていません。GmailやOutlook、多くのプロバイダーは何年も前にTLS 1.0のサポートを終了しています。デバイスはメール送信を試みますが拒否され、通知が届かなくなります。

Forward Emailはデュアルポート対応でこれを解決します。最新デバイスは標準ポート（`465`と`587`）を使い、古いデバイスはTLS 1.0をサポートするレガシーポート（`2455`と`2555`）を使えます。

> \[!IMPORTANT]
> Forward Emailはデュアルポート戦略により最新およびレガシーのNASデバイス両方をサポートします。TLS 1.2以上対応の最新デバイスはポート465/587を、TLS 1.0のみ対応のレガシーデバイスはポート2455/2555を使用してください。


## Forward EmailのSMTP設定 {#forward-email-smtp-settings}
こちらは当社のSMTP設定について知っておくべきことです：

**最新のNASデバイス（2020年以降）向け：** ポート`465`（SSL/TLS）またはポート`587`（STARTTLS）で`smtp.forwardemail.net`を使用してください。これらはTLS 1.2以上をサポートする最新のファームウェアで動作します。

**古いNASデバイス向け：** ポート`2455`（SSL/TLS）またはポート`2555`（STARTTLS）で`smtp.forwardemail.net`を使用してください。これらはレガシーデバイス向けにTLS 1.0をサポートしています。

**認証：** Forward Emailのエイリアスをユーザー名として使用し、[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)で生成されたパスワードを使用してください（アカウントのパスワードではありません）。

> \[!CAUTION]
> SMTP認証には決してアカウントのログインパスワードを使用しないでください。NASの設定には必ず[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)で生成されたパスワードを使用してください。

> \[!TIP]
> 設定前にNASデバイスのファームウェアバージョンとTLSサポートを確認してください。2020年以降に製造されたほとんどのデバイスは最新のTLSプロトコルをサポートしていますが、古いデバイスは通常レガシー互換ポートが必要です。


## 総合NASプロバイダー互換性マトリックス {#comprehensive-nas-provider-compatibility-matrix}

以下のマトリックスは主要なNASプロバイダーの詳細な互換性情報を提供しており、TLSサポートレベル、ファームウェアの状態、および推奨されるForward Emailの設定を含みます。

| NASプロバイダー | 現行モデル      | TLSサポート | ファームウェア状態 | 推奨ポート         | 一般的な問題                                                                                                                                           | 設定ガイド/スクリーンショット                                                                                                                     |
| ---------------- | --------------- | ----------- | ------------------ | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Synology         | DSM 7.x         | TLS 1.2以上 | アクティブ         | `465`, `587`       | [STARTTLS設定](https://community.synology.com/enu/forum/2/post/124584)                                                                                 | [DSMメール通知設定](https://kb.synology.com/en-af/DSM/help/DSM/AdminCenter/system_notification_email)                                            |
| QNAP             | QTS 5.x         | TLS 1.2以上 | アクティブ         | `465`, `587`       | [通知センターの障害](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)          | [QTSメールサーバー設定](https://docs.qnap.com/operating-system/qts/5.1.x/en-us/configuring-an-email-notification-server-EB4E6D7F.html)           |
| Raspberry Pi     | Raspberry Pi OS | TLS 1.2以上 | アクティブ         | `465`, `587`       | [DNS解決の問題](https://www.raspberrypi.org/forums/viewtopic.php?t=294014)                                                                             | [Raspberry Piメール設定ガイド](#raspberry-pi-nas-configuration)                                                                                   |
| ASUSTOR          | ADM 4.x         | TLS 1.2以上 | アクティブ         | `465`, `587`       | [証明書検証](https://forum.asustor.com/viewtopic.php?f=134&t=12345)                                                                                   | [ASUSTOR通知設定](https://www.asustor.com/en/online/online_help?id=8)                                                                             |
| TerraMaster      | TOS 6.x         | TLS 1.2     | アクティブ         | `465`, `587`       | [SMTP認証](https://www.terra-master.com/global/forum/)                                                                                               | [TerraMasterメール設定](https://www.terra-master.com/global/support/download.php)                                                                 |
| TrueNAS          | SCALE/CORE      | TLS 1.2以上 | アクティブ         | `465`, `587`       | [SSL証明書設定](https://www.truenas.com/community/threads/email-notifications-not-working.95234/)                                                    | [TrueNASメール設定ガイド](https://www.truenas.com/docs/scale/scaletutorials/systemsettings/general/settingupsystememail/)                         |
| Buffalo          | TeraStation     | TLS 1.2     | 制限あり           | `465`, `587`       | [ファームウェア互換性](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)            | [TeraStationメール設定](https://buffaloamericas.com/knowledge-base/configuring-email-notifications-on-a-ts3010-or-ts5010-series-terastation)      |
| Western Digital  | My Cloud OS 5   | TLS 1.2     | 制限あり           | `465`, `587`       | [レガシーOS互換性](https://community.wd.com/t/my-cloud-email-notifications-not-working/265432)                                                      | [My Cloudメール設定](https://support-en.wd.com/app/answers/detailweb/a_id/10222)                                                                 |
| OpenMediaVault   | OMV 7.x         | TLS 1.2以上 | アクティブ         | `465`, `587`       | [プラグイン依存関係](https://forum.openmediavault.org/index.php?thread/42156-email-notifications-not-working/)                                        | [OMV通知設定](https://docs.openmediavault.org/en/latest/administration/general/notifications.html)                                               |
| Netgear ReadyNAS | OS 6.x          | TLS 1.0のみ | サポート終了       | `2455`, `2555`     | [レガシーTLSサポート](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)                        | [ReadyNASメールアラート設定](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)             |
| Drobo            | Dashboard       | TLS 1.2     | サポート終了       | `465`, `587`       | [限定的なサポート](https://myprojects.drobo.com/support/)                                                                                             | [Droboメール通知](https://www.drobo.com/support/)                                                                                                |
このマトリックスは、最新で積極的にメンテナンスされているNASシステムと、特別な互換性の考慮が必要なレガシーデバイスとの明確な区分を示しています。現在のほとんどのNASデバイスは最新のTLS標準をサポートしており、Forward Emailの主要なSMTPポートを特別な設定なしで使用できます。


## Synology NASのメール設定 {#synology-nas-email-configuration}

DSM搭載のSynologyデバイスは設定が非常に簡単です。最新のTLSをサポートしているため、標準ポートを問題なく使用できます。

> \[!NOTE]
> Synology DSM 7.xは最も包括的なメール通知機能を提供します。古いDSMバージョンでは設定オプションが制限されている場合があります。

### 設定手順 {#configuration-steps}

1. **NASデバイスのIPアドレスまたはQuickConnect IDをウェブブラウザに入力してDSMのウェブインターフェースにアクセスします。**

2. **コントロールパネルに移動し、「通知」セクションを選択してから「メール」タブをクリックし、メール設定オプションにアクセスします。**

3. **「メール通知を有効にする」チェックボックスをオンにしてメール通知を有効化します。**

4. **SMTPサーバーを設定し、サーバーアドレスに`smtp.forwardemail.net`を入力します。**

5. **ポート設定をSSL/TLS接続用のポート465に設定します（推奨）。代替としてSTARTTLS対応のポート587もサポートされています。**

6. **認証を設定し、「SMTP認証が必要」を選択して、ユーザー名欄にForward Emailのエイリアスを入力します。**

7. **[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)から生成されたパスワードを入力します。**

8. **通知を受け取る最大5つのメールアドレスを入力して受信者アドレスを設定します。**

9. **通知フィルタリングを設定して、どのイベントでメール通知を送るかを制御し、通知過多を防ぎつつ重要なイベントを確実に報告します。**

10. **DSMの組み込みテスト機能を使って設定をテストし、すべての設定が正しくForward Emailのサーバーと通信できているか確認します。**

> \[!TIP]
> Synologyは異なる通知タイプを異なる受信者に割り当てることができ、チーム内でのアラート配信に柔軟性を提供します。


## QNAP NASのメール設定 {#qnap-nas-email-configuration}

QTS搭載のQNAPデバイスはForward Emailと非常に相性が良いです。最新のTLSをサポートし、設定用の使いやすいウェブインターフェースがあります。

> \[!IMPORTANT]
> QNAP QTS 5.2.4にはメール通知に関する既知の問題があり、[QTS 5.2.5で修正されました](https://www.qnap.com/en/how-to/faq/article/email-notifications-fail-after-updating-to-qts-524%E2%80%93fixed-in-qts-525)。通知失敗を避けるためにファームウェアを最新に更新してください。

### 設定手順 {#configuration-steps-1}

1. **QNAPデバイスのIPアドレスをウェブブラウザに入力してウェブインターフェースにアクセスします。**

2. **コントロールパネルに移動し、「サービスアカウントとデバイスペアリング」を選択してから「Eメール」セクションをクリックし、メール設定を開始します。**

3. **「SMTPサービスを追加」をクリックして新しいメール設定を作成します。**

4. **SMTPサーバーを設定し、SMTPサーバーアドレスに`smtp.forwardemail.net`を入力します。**

5. **適切なセキュリティプロトコルを選択します。推奨はポート`465`の「SSL/TLS」です。STARTTLS対応のポート`587`もサポートされています。**

6. **ポート番号を設定します。SSL/TLSのポート`465`が推奨です。必要に応じてSTARTTLSのポート`587`も利用可能です。**

7. **認証情報を入力します。ユーザー名にForward Emailのエイリアスを、パスワードに[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)から生成したパスワードを使用します。**

8. **送信者情報を設定します。「From」欄には「QNAP NAS System」やデバイスのホスト名など、わかりやすい名前を入力します。**

9. **異なる通知タイプごとに受信者アドレスを設定します。QNAPは複数の受信者グループを異なるアラートタイプに割り当てることができます。**

10. **QNAPの組み込みメールテスト機能を使って設定をテストし、すべての設定が正常に動作していることを確認します。**

> \[!TIP]
> [Gmail SMTP設定の問題](https://forum.qnap.com/viewtopic.php?t=152466)に遭遇した場合、同じトラブルシューティング手順がForward Emailにも適用されます。認証が正しく有効になっていることと、認証情報が正確であることを確認してください。
> \[!NOTE]
> QNAPデバイスは高度な通知スケジューリングをサポートしており、重要でない通知を抑制する静かな時間帯を設定できます。これは特にビジネス環境で役立ちます。

### 一般的なQNAPトラブルシューティングの問題 {#common-qnap-troubleshooting-issues}

QNAPデバイスが[通知メールを送信できない](https://www.reddit.com/r/qnap/comments/1dc6z03/qnap_nas_will_not_send_notification_emails/)場合は、以下を確認してください：

* Forward Emailの認証情報が正しいことを確認する
* SMTPサーバーのアドレスが正確に`smtp.forwardemail.net`であることを確認する
* ポートが暗号化方式に合っていることを確認する（SSL/TLSには`465`推奨、STARTTLSも`587`がサポートされています）
* [SMTPサーバーの設定](https://www.qnap.com/en/how-to/faq/article/why-does-notification-center-fail-to-send-emails-to-my-smtp-server)が接続を許可していることを確認する


## ReadyNASレガシー設定 {#readynas-legacy-configuration}

Netgear ReadyNASデバイスは、ファームウェアのサポート終了とTLS 1.0のレガシープロトコルに依存しているため、独特の課題があります。しかし、Forward Emailのレガシーポートサポートにより、これらのデバイスは引き続きメール通知を確実に送信できます。

> \[!CAUTION]
> ReadyNAS OS 6.xはTLS 1.0のみをサポートしており、Forward Emailのレガシー互換ポート`2455`と`2555`が必要です。最新のポート`465`と`587`はこれらのデバイスでは動作しません。

### レガシー設定手順 {#legacy-configuration-steps}

1. **ReadyNASのウェブインターフェースにアクセス**するには、デバイスのIPアドレスをウェブブラウザに入力します。

2. **System > Settings > Alerts**に移動してメール設定セクションにアクセスします。

3. **SMTPサーバーを設定**し、サーバーアドレスに`smtp.forwardemail.net`を入力します。

4. **ポート設定を行う**：SSL/TLS接続には`2455`、STARTTLS接続には`2555`を設定します。これらはForward Emailのレガシー互換ポートです。

5. **認証を有効にし**、Forward Emailのエイリアスをユーザー名として、[My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains)で生成したパスワードを入力します。

6. **送信者情報を設定**し、ReadyNASデバイスを識別できる説明的な「From」アドレスを入力します。

7. **受信者のメールアドレスを追加**し、メール連絡先セクションの+ボタンを使用します。

8. **設定をテスト**して、レガシーTLS接続が正しく機能していることを確認します。

> \[!IMPORTANT]
> ReadyNASデバイスは、最新のTLSプロトコルを使用した安全な接続を確立できないため、レガシーポートが必要です。これはサポート終了したファームウェアの[既知の制限](https://kb.netgear.com/23066/How-do-I-manage-my-email-alert-contacts-on-my-ReadyNAS-OS-6-storage-system)です。

### ReadyNASトラブルシューティング {#readynas-troubleshooting}

ReadyNASのメール設定でよくある問題：

* **TLSバージョンの不一致**：最新ポートではなく、`2455`または`2555`のポートを使用していることを確認してください
* **認証失敗**：Forward Emailの認証情報が正しいことを確認してください
* **ネットワーク接続**：ReadyNASが`smtp.forwardemail.net`に接続できるか確認してください
* **ファームウェアの制限**：一部の古いReadyNASモデルは追加の[HTTPS設定要件](https://kb.netgear.com/23100/How-do-I-configure-HTTPS-HTTP-with-SSL-encryption-settings-on-my-ReadyNAS-OS-6-storage-system)がある場合があります

ReadyNASデバイス（OS 6.xおよびそれ以前のバージョン）はTLS 1.0接続のみをサポートしており、ほとんどの最新メールプロバイダーはこれを受け入れていません。Forward Emailの専用レガシーポート（2455および2555）はこれらの古いプロトコルを特にサポートし、ReadyNASユーザーの継続的な機能を保証します。

ReadyNASデバイスでメールを設定するには、デバイスのIPアドレスからウェブインターフェースにアクセスします。Systemセクションに移動し、「Notifications」を選択してメール設定オプションにアクセスします。

メール設定セクションでメール通知を有効にし、SMTPサーバーにsmtp.forwardemail.netを入力します。これは重要です — 標準のSMTPポートではなく、Forward Emailのレガシー互換ポートを使用してください。

SSL/TLS接続の場合は、標準のポート465ではなくポート2455を設定します（推奨）。STARTTLS接続の場合は、ポート587ではなくポート2555を使用します。これらの特別なポートはTLS 1.0互換性を維持しつつ、レガシーデバイスに対して可能な限り最良のセキュリティを提供します。
Forward Emailのエイリアスをユーザー名として、認証用に生成されたパスワードを入力してください。ReadyNASデバイスはSMTP認証をサポートしており、Forward Email接続には認証が必要です。

通知要件に応じて送信元メールアドレスと受信者アドレスを設定してください。ReadyNASは複数の受信者アドレスを許可しており、異なるチームメンバーやメールアカウントにアラートを配信できます。

設定を慎重にテストしてください。ReadyNASデバイスは設定が失敗した場合に詳細なエラーメッセージを提供しないことがあります。標準のテストが機能しない場合は、最新のSMTPポートではなく正しいレガシーポート（2455または2555）を使用しているか確認してください。

レガシーTLSプロトコルの使用に伴うセキュリティ上の影響を考慮してください。Forward Emailのレガシーポートは古いデバイスに対して利用可能な最良のセキュリティを提供しますが、可能な場合は最新のTLSサポートを備えたモダンなNASシステムへのアップグレードを推奨します。


## TerraMaster NASの設定 {#terramaster-nas-configuration}

TOS 6.xを実行しているTerraMasterデバイスは最新のTLSをサポートしており、Forward Emailの標準ポートと良好に連携します。

> \[!NOTE]
> TerraMaster TOS 6.xは包括的なメール通知機能を提供します。最高の互換性を得るためにファームウェアを最新の状態に保ってください。

1. **システム設定にアクセス**
   * TerraMasterのウェブインターフェースにログイン
   * **コントロールパネル** > **通知** に移動

2. **SMTP設定を構成**
   * サーバー: `smtp.forwardemail.net`
   * ポート: `465`（SSL/TLS推奨）または `587`（STARTTLS）
   * ユーザー名: Forward Emailのエイリアス
   * パスワード: [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) から生成されたパスワード

3. **通知を有効化**
   * 受信したい通知タイプにチェックを入れる
   * 組み込みのテスト機能で設定をテスト

> \[!TIP]
> TerraMasterデバイスはSSL/TLS接続にポート`465`を使用するのが最適です（推奨）。問題が発生した場合はSTARTTLS対応のポート`587`もサポートされています。


## ASUSTOR NASの設定 {#asustor-nas-configuration}

ADM 4.xを搭載したASUSTORデバイスは堅牢なメール通知サポートを備え、Forward Emailとシームレスに連携します。

> \[!NOTE]
> ASUSTOR ADM 4.xは高度な通知フィルタリングオプションを含みます。どのイベントでメールアラートをトリガーするかカスタマイズ可能です。

1. **通知設定を開く**
   * ADMのウェブインターフェースにアクセス
   * **設定** > **通知** に移動

2. **SMTP設定を行う**
   * SMTPサーバー: `smtp.forwardemail.net`
   * ポート: `465`（SSL/TLS推奨）または `587`（STARTTLS）
   * 認証: 有効にする
   * ユーザー名: Forward Emailのエイリアス
   * パスワード: [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) から生成されたパスワード

3. **アラートタイプを設定**
   * メールを送信するシステムイベントを選択
   * 受信者アドレスを設定
   * 設定をテスト

> \[!IMPORTANT]
> ASUSTORデバイスではSMTP設定で認証を明示的に有効にする必要があります。このオプションを忘れずにチェックしてください。


## Buffalo TeraStationの設定 {#buffalo-terastation-configuration}

Buffalo TeraStationデバイスは限定的ながら機能的なメール通知機能を備えています。設定は場所さえわかれば簡単です。

> \[!CAUTION]
> Buffalo TeraStationのファームウェア更新は頻繁ではありません。メール設定を行う前にお使いのモデルの最新ファームウェアを使用していることを確認してください。

1. **ウェブ設定にアクセス**
   * TeraStationのウェブインターフェースに接続
   * **システム** > **通知** に移動

2. **メール設定を構成**
   * SMTPサーバー: `smtp.forwardemail.net`
   * ポート: `465`（SSL/TLS推奨）または `587`（STARTTLS）
   * ユーザー名: Forward Emailのエイリアス
   * パスワード: [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) から生成されたパスワード
   * SSL/TLS暗号化を有効にする

3. **通知設定を行う**
   * メールを送信するイベントを選択（ディスクエラー、温度警告など）
   * 受信者メールアドレスを入力
   * 設定を保存してテスト

> \[!NOTE]
> 一部の古いTeraStationモデルはSMTP設定オプションが限定的な場合があります。モデルのドキュメントで具体的な機能を確認してください。
## Western Digital My Cloud 設定 {#western-digital-my-cloud-configuration}

OS 5 を搭載した Western Digital My Cloud デバイスはメール通知をサポートしていますが、設定画面の中で少し見つけにくい場合があります。

> \[!WARNING]
> Western Digital は多くの My Cloud モデルのサポートを終了しています。重要なアラートのためにメール通知を利用する前に、お使いのデバイスがまだファームウェアの更新を受け取っているか確認してください。

1. **設定に移動**
   * My Cloud のウェブダッシュボードを開く
   * **設定** > **一般** > **通知** に進む

2. **SMTP 詳細の設定**
   * メールサーバー: `smtp.forwardemail.net`
   * ポート: `465`（SSL/TLS 推奨）または `587`（STARTTLS）
   * ユーザー名: あなたの Forward Email エイリアス
   * パスワード: [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) から生成されたパスワード
   * 暗号化を有効にする

3. **アラートタイプの設定**
   * 通知カテゴリを選択（システムアラート、ディスクの健康状態など）
   * 受信者のメールアドレスを追加
   * メール設定をテストする

> \[!TIP]
> ポート `465` の SSL/TLS 使用を推奨します。問題が発生した場合は、ポート `587` の STARTTLS もサポートされています。


## TrueNAS メール設定 {#truenas-email-configuration}

TrueNAS（SCALE と CORE の両方）は詳細な設定オプションを備えた優れたメール通知機能を提供します。

> \[!NOTE]
> TrueNAS は NAS システムの中でも最も包括的なメール通知機能を提供しています。詳細なアラートルールや複数の受信者を設定可能です。

1. **システム設定にアクセス**
   * TrueNAS のウェブインターフェースにログイン
   * **システム** > **メール** に移動

2. **SMTP 設定の構成**
   * 送信メールサーバー: `smtp.forwardemail.net`
   * メールサーバーポート: `465`（推奨）または `587`
   * セキュリティ: SSL/TLS（465 用、推奨）または STARTTLS（587 用）
   * ユーザー名: あなたの Forward Email エイリアス
   * パスワード: [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) から生成されたパスワード

3. **アラートの設定**
   * **システム** > **アラートサービス** に移動
   * メールで送信するアラートを設定
   * 受信者アドレスとアラートレベルを設定
   * 組み込みのテスト機能で設定をテスト

> \[!IMPORTANT]
> TrueNAS では異なるアラートレベル（INFO、NOTICE、WARNING、ERROR、CRITICAL）を設定できます。メールスパムを避けつつ重要な問題を報告するために適切なレベルを選択してください。


## OpenMediaVault 設定 {#openmediavault-configuration}

OpenMediaVault はウェブインターフェースを通じて堅実なメール通知機能を提供します。セットアップはシンプルでわかりやすいです。

> \[!NOTE]
> OpenMediaVault の通知システムはプラグインベースです。メール通知プラグインがインストールされ有効になっていることを確認してください。

1. **通知設定にアクセス**
   * OpenMediaVault のウェブインターフェースを開く
   * **システム** > **通知** > **メール** に移動

2. **SMTP パラメータの設定**
   * SMTP サーバー: `smtp.forwardemail.net`
   * ポート: `465`（SSL/TLS 推奨）または `587`（STARTTLS）
   * ユーザー名: あなたの Forward Email エイリアス
   * パスワード: [My Account -> Domains -> Aliases](https://forwardemail.net/my-account/domains) から生成されたパスワード
   * SSL/TLS を有効にする

3. **通知ルールの設定**
   * **システム** > **通知** > **通知** に移動
   * どのシステムイベントでメールを送信するか設定
   * 受信者アドレスを設定
   * メール機能をテスト

> \[!TIP]
> OpenMediaVault では通知スケジュールを設定可能です。静かな時間帯を設定したり、通知頻度を制限してアラートに圧倒されないようにできます。


## Raspberry Pi NAS 設定 {#raspberry-pi-nas-configuration}

Raspberry Pi はホームや小規模オフィス環境向けのコスト効率の良い NAS 機能の入り口として優れています。Raspberry Pi を NAS デバイスとして設定するには、ファイル共有プロトコル、メール通知、基本的なネットワークサービスの構成が必要です。

> \[!TIP]
> Raspberry Pi 愛好家には、リモートサーバー管理用の [PiKVM](https://pikvm.org/) とネットワーク全体の広告ブロックおよび DNS 管理用の [Pi-hole](https://pi-hole.net/) を組み合わせて NAS 設定を補完することを強くお勧めします。これらのツールは包括的なホームラボ環境を作り出します。
### 初期のRaspberry Piセットアップ {#initial-raspberry-pi-setup}

NASサービスを構成する前に、Raspberry Piが最新のRaspberry Pi OSを実行しており、十分なストレージがあることを確認してください。高品質のmicroSDカード（クラス10以上）またはUSB 3.0 SSDは、NASの操作においてより良いパフォーマンスと信頼性を提供します。

1. すべてのパッケージが最新であることを確認するために、`sudo apt update && sudo apt upgrade -y` を実行して**システムを更新**します。

2. リモート管理のために、`sudo systemctl enable ssh && sudo systemctl start ssh` を使用して**SSHアクセスを有効化**します。

3. 一貫したネットワークアクセスを確保するために、`/etc/dhcpcd.conf` を編集して**静的IPアドレスを設定**します。

4. USBドライブを接続してマウントするか、データ冗長性のためにRAIDアレイを構成して**外部ストレージをセットアップ**します。

### Sambaファイル共有の設定 {#samba-file-sharing-configuration}

SambaはWindows互換のファイル共有を提供し、ネットワーク上のどのデバイスからでもRaspberry Piにアクセスできるようにします。設定プロセスには、Sambaのインストール、共有の作成、ユーザー認証の設定が含まれます。

`sudo apt install samba samba-common-bin` を使用してSambaをインストールし、`/etc/samba/smb.conf` のメイン設定ファイルを構成します。共有ディレクトリを作成し、`sudo mkdir -p /srv/samba/shared && sudo chmod 755 /srv/samba/shared` を使って適切な権限を設定します。

設定ファイルに各共有ディレクトリのセクションを追加してSamba共有を構成します。`sudo smbpasswd -a username` を使用してネットワークアクセス用のSamba専用パスワードを作成し、ユーザー認証を設定します。

> \[!IMPORTANT]
> Sambaユーザーには常に強力なパスワードを使用し、非機密の共有フォルダにのみゲストアクセスを有効にすることを検討してください。高度なセキュリティ設定については、[公式Sambaドキュメント](https://www.samba.org/samba/docs/current/man-html/smb.conf.5.html)を参照してください。

### FTPサーバーのセットアップ {#ftp-server-setup}

FTPは特に自動バックアップやリモートファイル管理に便利なファイルアクセスの別の方法を提供します。信頼性の高いFTPサービスのためにvsftpd（Very Secure FTP Daemon）をインストールして構成します。

`sudo apt install vsftpd` を使用してvsftpdをインストールし、`/etc/vsftpd.conf` を編集してサービスを構成します。ローカルユーザーアクセスを有効にし、パッシブモードの設定を行い、適切なセキュリティ制限を設定します。

FTPユーザーを作成し、ディレクトリアクセス権限を構成します。すべてのデータ転送を暗号化するために、従来のFTPの代わりにSFTP（SSHファイル転送プロトコル）を使用することを検討してください。

> \[!CAUTION]
> 従来のFTPはパスワードを平文で送信します。安全なファイル転送のために常にSFTPを使用するか、TLS暗号化でFTPを構成してください。導入前に[vsftpdのセキュリティベストプラクティス](https://security.appspot.com/vsftpd.html)を確認してください。

### メール通知の設定 {#email-notification-configuration}

システムイベント、ストレージアラート、バックアップ完了状況のメール通知をRaspberry Pi NASで送信するように設定します。これにはメール転送エージェントのインストールとForward Email統合の設定が含まれます。

軽量SMTPクライアントとして`msmtp`を`sudo apt install msmtp msmtp-mta`でインストールします。以下の設定で`/etc/msmtprc`ファイルを作成します：

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        forwardemail
host           smtp.forwardemail.net
port           465
tls_starttls   off
from           your-alias@yourdomain.com
user           your-alias@yourdomain.com
password       your-generated-password
```

cronジョブやシステム監視スクリプトを設定して`msmtp`を使った通知を送信することで、システム通知を構成します。ディスク容量監視、温度アラート、バックアップ完了通知用のスクリプトを作成します。

### 高度なRaspberry Pi NAS機能 {#advanced-raspberry-pi-nas-features}

追加のサービスや監視機能でRaspberry Pi NASを強化します。ネットワーク監視ツール、自動バックアップソリューション、リモートアクセスサービスをインストールして構成します。

ウェブベースのファイルアクセス、カレンダー同期、共同作業機能を備えたクラウドのような機能を提供する[Nextcloud](https://nextcloud.com/)をセットアップします。DockerまたはRaspberry Pi向けの公式Nextcloudインストールガイドを使用してインストールしてください。
`rsync` と `cron` を使用して自動バックアップを設定し、重要なデータのスケジュールバックアップを作成します。バックアップ完了および失敗通知のメールは、Forward Email の設定を使用してセットアップしてください。

[Nagios](https://www.nagios.org/) や [Zabbix](https://www.zabbix.com/) のようなツールを使ってネットワーク監視を実装し、システムの健全性、ネットワーク接続性、およびサービスの可用性を監視します。

> \[!NOTE]
> ネットワークインフラを管理しているユーザーは、PiKVM セットアップに [Switchbot](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) を統合してリモートで物理スイッチを制御することを検討してください。この [Python 統合ガイド](https://www.reddit.com/r/pikvm/comments/skhxkm/pikvm_with_switchbot/) は物理デバイス管理の自動化に関する詳細な手順を提供します。

### Raspberry Pi メールトラブルシューティング {#raspberry-pi-email-troubleshooting}

Raspberry Pi のメール設定でよくある問題には、DNS 解決の問題、ファイアウォールの制限、認証失敗があります。Raspberry Pi システムの軽量性が原因で SMTP 接続のタイミング問題が発生することがあります。

メール通知が失敗した場合は、詳細なエラーメッセージを確認するために `/var/log/msmtp.log` の `msmtp` ログファイルをチェックしてください。Forward Email の認証情報が正しいこと、および Raspberry Pi が `smtp.forwardemail.net` を解決できることを確認してください。

コマンドラインでメール機能をテストするには、`echo "Test message" | msmtp recipient@example.com` を使用します。これにより、設定の問題とアプリケーション固有の問題を切り分けることができます。

DNS 解決の問題がある場合は、`/etc/resolv.conf` に適切な DNS 設定を行ってください。ローカル DNS が信頼できない場合は、`8.8.8.8` や `1.1.1.1` のようなパブリック DNS サーバーの使用を検討してください。

### パフォーマンス最適化 {#performance-optimization}

ストレージ、ネットワーク設定、およびシステムリソースの適切な構成を通じて、Raspberry Pi NAS のパフォーマンスを最適化します。高品質なストレージデバイスを使用し、ユースケースに応じた適切なファイルシステムオプションを設定してください。

外付けドライブを使用している場合は、より良いストレージパフォーマンスのために USB 3.0 ブートを有効にします。`sudo raspi-config` を使って GPU メモリの分割を設定し、グラフィックス処理よりもシステム操作に多くの RAM を割り当ててください。

`htop`、`iotop`、`nethogs` などのツールを使ってシステムパフォーマンスを監視し、ボトルネックを特定してリソース使用を最適化します。要求の高い NAS アプリケーションには 8GB RAM 搭載の Raspberry Pi 4 へのアップグレードを検討してください。

集中的な操作中のサーマルスロットリングを防ぐために適切な冷却ソリューションを実装します。`/opt/vc/bin/vcgencmd measure_temp` を使って CPU 温度を監視し、十分な換気を確保してください。

### セキュリティ上の考慮事項 {#security-considerations}

適切なアクセス制御、ネットワークセキュリティ対策、および定期的なセキュリティアップデートを実施して Raspberry Pi NAS を保護します。デフォルトパスワードの変更、不要なサービスの無効化、ファイアウォールルールの設定を行ってください。

SSH やその他のサービスに対するブルートフォース攻撃から保護するために `fail2ban` をインストールおよび設定します。重要なセキュリティパッチが迅速に適用されるように `unattended-upgrades` を使って自動セキュリティアップデートを設定してください。

可能な場合はネットワークセグメンテーションを構成して NAS を他のネットワークデバイスから分離します。サービスを直接インターネットに公開する代わりに、リモート接続には VPN アクセスを使用してください。

ハードウェア障害やセキュリティインシデントによるデータ損失を防ぐために、Raspberry Pi の設定とデータを定期的にバックアップしてください。データ復旧能力を確保するためにバックアップ復元手順をテストしてください。

Raspberry Pi NAS の構成は、ネットワークストレージの概念を学ぶための優れた基盤を提供し、家庭や小規模オフィス環境で実用的な機能を提供します。Forward Email との組み合わせにより、システム監視およびメンテナンス通知の信頼性の高い配信が保証されます。
