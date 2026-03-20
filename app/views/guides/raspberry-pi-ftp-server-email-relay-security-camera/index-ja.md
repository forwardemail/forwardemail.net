# Raspberry Piを安全なFTPサーバー兼メールリレーに変える方法 {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

使っていないRaspberry Piはありませんか？最新のPi 5、Pi 4、Pi Zero、あるいは古いモデルでも、このガイドでは強力で自動化されたファイルサーバー兼メールリレー機能を持つサーバーに変える方法を紹介します。防犯カメラやIoTデバイスなどに最適です。

**対応機種:** Raspberry Pi 5、Raspberry Pi 4 Model B、Raspberry Pi 3 Model B+、Raspberry Pi 3 Model B、Raspberry Pi 2 Model B、Raspberry Pi Zero 2 W、Raspberry Pi Zero W、Raspberry Pi Zero。

> \[!NOTE]
> このガイドはUbuntu Server 22.04 LTSを実行するRaspberry Pi 3 Model Bでテスト・検証済みです。


## 目次 {#table-of-contents}

* [作るものについて](#what-were-building)
* [パート1: PiにUbuntu Serverをインストールする](#part-1-getting-ubuntu-server-on-your-pi)
  * [必要なもの](#what-youll-need)
  * [OSの書き込み](#flashing-the-os)
  * [起動と接続](#booting-up--connecting)
* [パート2: 安全なFTPサーバーの設定](#part-2-setting-up-a-secure-ftp-server)
  * [インストールと設定](#installation--configuration)
  * [FTPユーザーの作成](#creating-an-ftp-user)
* [パート3: ファイアウォールとブルートフォース対策](#part-3-firewall-and-brute-force-protection)
  * [UFWの設定](#setting-up-ufw)
  * [Fail2banの設定](#setting-up-fail2ban)
* [パート4: 自動ファイル処理とメール通知](#part-4-automated-file-processing-with-email-notifications)
  * [オプション1: Forward Email APIの利用（推奨）](#option-1-using-forward-email-api-recommended)
  * [オプション2: 他のメールプロバイダーの利用](#option-2-using-other-email-providers)
  * [Systemdサービスの作成](#create-a-systemd-service)
* [パート5: レガシーデバイス向けメールオプション](#part-5-email-options-for-legacy-devices)
  * [オプション1: Forward EmailのレガシーTLS 1.0ポートを使う（推奨）](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [オプション2: Postfix SMTPリレーの設定](#option-2-set-up-a-postfix-smtp-relay)
* [トラブルシューティング](#troubleshooting)
* [まとめ](#wrapping-up)


## 作るものについて {#what-were-building}

このガイドでは以下の完全なシステム構築を案内します：

* **Ubuntu Server 22.04 LTS:** Piに最適な堅牢で軽量なOS。
* **安全なFTPサーバー（vsftpd）:** ファイルを安全にアップロード可能。
* **ファイアウォール（UFW）＆Fail2ban:** 不正アクセスを防止。
* **自動ファイル処理スクリプト:** 新しいファイルを検知し、添付ファイルとしてメール送信し、処理後にファイルを削除。
* **レガシーデバイス向けメールオプション:** 最新TLS非対応デバイス向けに2つの方法を用意：
  * Forward EmailのレガシーTLS 1.0ポートを利用（最も簡単）
  * Postfix SMTPリレーを設定（任意のメールプロバイダー対応）

準備はいいですか？始めましょう。


## パート1: PiにUbuntu Serverをインストールする {#part-1-getting-ubuntu-server-on-your-pi}

まずはRaspberry PiにUbuntu Serverをインストールします。Raspberry Pi Imagerのおかげで驚くほど簡単です。

### 必要なもの {#what-youll-need}

* 対応するRaspberry Pi（上記リスト参照）
* microSDカード（最低8GB、16GB以上推奨）
* microSDカードリーダー付きのパソコン
* Piモデルに合った適切な電源
* インターネット接続（有線またはWi-Fi）

> \[!NOTE]
> Raspberry Pi 2やPi Zeroなど古いモデルは動作が遅い場合がありますが、このセットアップには問題ありません。

### OSの書き込み {#flashing-the-os}

1. **Raspberry Pi Imagerを入手:** [公式サイト](https://www.raspberrypi.com/software/)からダウンロードします。

2. **OSを選択:** Imagerで「CHOOSE OS」 > 「Other general-purpose OS」 > 「Ubuntu」を選びます。
   * 64ビットモデル（Pi 3、4、5、Zero 2 W）は **「Ubuntu Server 22.04.1 LTS (64-bit)」** を選択。
   * 古い32ビットモデル（Pi 2、Pi Zero、Pi Zero W）は **「Ubuntu Server 22.04.1 LTS (32-bit)」** を選択。

3. **ストレージを選択:** microSDカードを選びます。

> \[!WARNING]
> microSDカードの内容はすべて消去されます。重要なデータは必ずバックアップしてください。

4. **詳細オプションを活用:** ギアアイコン（⚙️）をクリックしてヘッドレスモード（モニターやキーボード不要）を設定します。
   * **ホスト名:** Piの名前を設定（例：`pi-server`）。
   * **SSH:** 有効化し、ユーザー名とパスワードを設定。
   * **Wi-Fi:** 有線接続でなければWi-Fi情報を入力。
   * **ロケール:** タイムゾーンとキーボードレイアウトを設定。
5. **書き込む！** 「WRITE」ボタンをクリックして、イメージャーに処理を任せましょう。

### 起動と接続 {#booting-up--connecting}

イメージャーが完了したら、microSDカードをPiに差し込み、電源を入れます。起動に数分かかります。バックグラウンドで初期設定を行っています。ルーターの管理ページからIPアドレスを確認し、SSHで接続します：

```bash
ssh your_username@your_pi_ip_address
```

接続完了です！Raspberry Piは設定の準備が整いました。


## パート2: セキュアなFTPサーバーの設定 {#part-2-setting-up-a-secure-ftp-server}

次に、最大限のセキュリティを考慮して設定された`vsftpd`（Very Secure FTP Daemon）をセットアップします。

### インストールと設定 {#installation--configuration}

1. **vsftpdをインストール：**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **設定ファイルのバックアップ：**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **設定ファイルを編集：**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> 行がコメントアウトされている場合（`#`で始まる）、`#`を削除してコメント解除してください。

以下の変更を行います：

| 設定項目                  | 値     | 目的                                                     |
| ------------------------ | ------ | -------------------------------------------------------- |
| `anonymous_enable`       | `NO`   | 匿名FTPアクセスを無効化                                  |
| `local_enable`           | `YES`  | ローカルユーザーのログインを許可                         |
| `write_enable`           | `YES`  | ファイルのアップロードを有効化                           |
| `local_umask`            | `022`  | ファイル権限の設定（ファイルは644、ディレクトリは755）   |
| `chroot_local_user`      | `YES`  | ユーザーをホームディレクトリに閉じ込める（ジャイル）     |
| `allow_writeable_chroot` | `YES`  | ジャイル内でのアップロードを許可                         |

4. **パッシブポート範囲の追加：** ファイアウォールのために、ファイルの末尾に以下を追加します。

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **ログ記録の有効化：** Fail2ban用にログを有効にするため、以下を追加します。

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **保存して再起動：** `Ctrl+O`、`Enter`、`Ctrl+X`で保存し、サービスを再起動します：

   ```bash
   sudo systemctl restart vsftpd
   ```

### FTPユーザーの作成 {#creating-an-ftp-user}

FTPアクセス用の専用制限ユーザーを作成します。

1. **ユーザーを作成：**

   ```bash
   sudo adduser ftpuser
   ```

   パスワード設定のプロンプトに従ってください。その他の項目（名前、電話番号など）は空欄で構いません。

2. **ディレクトリ構造を作成：**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - メインのFTPディレクトリ
   * `/home/ftpuser/ftp/uploads` - ファイルのアップロード先

3. **権限を設定：**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## パート3: ファイアウォールとブルートフォース攻撃対策 {#part-3-firewall-and-brute-force-protection}

UFW（Uncomplicated Firewall）とFail2banでPiを保護します。

### UFWの設定 {#setting-up-ufw}

1. **UFWをインストール：**

   ```bash
   sudo apt install ufw -y
   ```

2. **デフォルトポリシーを設定：**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **SSHを許可（重要！）：**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> ファイアウォールを有効にする前に必ずSSHを許可してください。そうしないと自分自身がアクセス不能になります！

4. **FTPポートを許可：**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **ファイアウォールを有効化：**

   ```bash
   sudo ufw enable
   ```

### Fail2banの設定 {#setting-up-fail2ban}

Fail2banは繰り返し失敗したログイン試行のIPアドレスを自動でブロックします。

1. **Fail2banをインストール：**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **ローカル設定ファイルを作成：**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **以下の設定を追加：**
   ```ini
   [DEFAULT]
   bantime = 3600
   findtime = 600
   maxretry = 5

   [sshd]
   enabled = true
   port = ssh
   logpath = /var/log/auth.log

   [vsftpd]
   enabled = true
   port = ftp,ftp-data,40000:50000
   logpath = /var/log/vsftpd.log
   maxretry = 3
   ```

4. **Restart Fail2ban:**

   ```bash
   sudo systemctl restart fail2ban
   ```


## Part 4: Automated File Processing with Email Notifications {#part-4-automated-file-processing-with-email-notifications}

Now for the magic: a script that monitors the FTP folder, emails new files as attachments, and deletes them. There are two approaches depending on your email provider:

### Option 1: Using Forward Email API (Recommended) {#option-1-using-forward-email-api-recommended}

If you have a Forward Email account, use the Email API for the most reliable delivery.

#### Get Your API Key {#get-your-api-key}

1. Log in to [Forward Email](https://forwardemail.net)
2. Navigate to [My Account → Security](https://forwardemail.net/my-account/security)
3. Scroll down to the **"Developer Access"** section at the bottom
4. Copy your API key

> \[!WARNING]
> Keep your API key private at all times. Never share it publicly or commit it to version control.

> \[!NOTE]
> The Enhanced Protection plan ($3/month) or higher is required for API access.

#### Install inotify-tools {#install-inotify-tools}

```bash
sudo apt install inotify-tools -y
```

#### Create the Monitoring Script {#create-the-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="noreply@yourdomain.com"
TO_EMAIL="your-email@example.com"
API_KEY="your_forward_email_api_key"  # Replace with your actual API key

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Base64 encode the file
    FILE_CONTENT=$(base64 -w 0 "$FILEPATH")

    # Send email with attachment via Forward Email API
    RESPONSE=$(curl -X POST https://api.forwardemail.net/v1/emails \
      -u "$API_KEY:" \
      -H "Content-Type: application/json" \
      -d '{
        "from": "'"$FROM_EMAIL"'",
        "to": "'"$TO_EMAIL"'",
        "subject": "'"$SUBJECT"'",
        "text": "New file uploaded: '"$FILENAME"'",
        "attachments": [
          {
            "filename": "'"$FILENAME"'",
            "content": "'"$FILE_CONTENT"'",
            "encoding": "base64"
          }
        ]
      }')

    # Check if email was sent successfully
    if echo "$RESPONSE" | grep -q '"statusCode":200'; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
        echo "Response: $RESPONSE"
    fi
done
```

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Option 2: Using Other Email Providers {#option-2-using-other-email-providers}

If you prefer to use Gmail, Outlook, Yahoo, or another provider, modify the script to use `sendmail` or `msmtp` instead of the Forward Email API.

#### Install msmtp {#install-msmtp}

```bash
sudo apt install msmtp msmtp-mta -y
```

#### Configure msmtp {#configure-msmtp}

Create the configuration file:

```bash
sudo nano /etc/msmtprc
```

Add your provider's settings (example for Gmail):

```
defaults
auth           on
tls            on
tls_trust_file /etc/ssl/certs/ca-certificates.crt
logfile        /var/log/msmtp.log

account        gmail
host           smtp.gmail.com
port           587
from           your-email@gmail.com
user           your-email@gmail.com
password       your-app-password

account default : gmail
```

Secure the file:

```bash
sudo chmod 600 /etc/msmtprc
```

#### Create the Alternative Monitoring Script {#create-the-alternative-monitoring-script}

```bash
sudo nano /usr/local/bin/ftp-monitor.sh
```

Paste this script:

```bash
#!/bin/bash

# Configuration
WATCH_DIR="/home/ftpuser/ftp/uploads"
FROM_EMAIL="your-email@gmail.com"
TO_EMAIL="recipient@example.com"

# Monitor for new files
inotifywait -m -e close_write --format '%w%f' "$WATCH_DIR" | while read FILEPATH
do
    FILENAME=$(basename "$FILEPATH")
    FOLDERNAME=$(basename "$WATCH_DIR")
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    SUBJECT="$TIMESTAMP - $FOLDERNAME - $FILENAME"

    # Send email with attachment using msmtp
    (
        echo "To: $TO_EMAIL"
        echo "From: $FROM_EMAIL"
        echo "Subject: $SUBJECT"
        echo "MIME-Version: 1.0"
        echo "Content-Type: multipart/mixed; boundary=\"BOUNDARY\""
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: text/plain; charset=utf-8"
        echo ""
        echo "New file uploaded: $FILENAME"
        echo ""
        echo "--BOUNDARY"
        echo "Content-Type: application/octet-stream; name=\"$FILENAME\""
        echo "Content-Transfer-Encoding: base64"
        echo "Content-Disposition: attachment; filename=\"$FILENAME\""
        echo ""
        base64 "$FILEPATH"
        echo ""
        echo "--BOUNDARY--"
    ) | msmtp -t

    # Check if email was sent successfully
    if [ $? -eq 0 ]; then
        echo "Email sent successfully for $FILENAME"
        # Delete the file
        rm -f "$FILEPATH"
        echo "Deleted $FILENAME"
    else
        echo "Failed to send email for $FILENAME"
    fi
done
```

実行可能にする：

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Systemdサービスを作成する {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

以下の内容を追加します：

```ini
[Unit]
Description=FTP Upload Monitor
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ftp-monitor.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

サービスを有効化して起動します：

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

ステータスを確認します：

```bash
sudo systemctl status ftp-monitor.service
```


## パート5：レガシーデバイス向けのメールオプション {#part-5-email-options-for-legacy-devices}

FOSSCAMカメラのようなデバイスは、最新のTLSバージョンをサポートしていないことが多いです。解決策は2つあります：

### オプション1：Forward EmailのレガシーTLS 1.0ポートを使う（推奨） {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Forward Emailを使用している場合、これが最も簡単な解決策です。Forward Emailは、カメラ、プリンター、スキャナー、ファックス機などの古いデバイス向けに専用のレガシーTLS 1.0ポートを提供しています。

#### 料金 {#pricing}

Forward Emailは複数のプランを提供しています：

| プラン                   | 価格          | 機能                                   |
| ----------------------- | ------------ | -------------------------------------- |
| 無料                    | $0/月        | メール転送のみ（送信は不可）           |
| **Enhanced Protection** | **$3/月**    | **SMTPアクセス + レガシーTLS 1.0ポート** |
| チーム                  | $9/月        | Enhanced + チーム機能                   |
| エンタープライズ        | $250/月      | チーム + 無制限APIリクエスト           |

> \[!IMPORTANT]
> SMTPアクセスとレガシーTLS 1.0ポートのサポートには、**Enhanced Protectionプラン（$3/月）**以上が必要です。

詳細は[Forward Email Pricing](https://forwardemail.net/en/pricing)をご覧ください。

#### パスワードを生成する {#generate-your-password}

デバイスを設定する前に、Forward Emailでパスワードを生成します：

1. [Forward Email](https://forwardemail.net)にログイン
2. **マイアカウント → ドメイン → \[あなたのドメイン] → エイリアス**に移動
3. エイリアスを作成または選択（例：`camera@yourdomain.com`）
4. エイリアスの横にある**「パスワードを生成」**をクリック
5. 生成されたパスワードをコピー — SMTP認証に使用します

> \[!TIP]
> 各エイリアスは独自のパスワードを持つことができます。どのデバイスがどのメールを送信したか追跡するのに便利です。

#### デバイスを設定する {#configure-your-device}

カメラ、プリンター、スキャナー、その他のレガシーデバイスで以下の設定を使用してください：

| 設定項目         | 値                                               |
| --------------- | ------------------------------------------------ |
| SMTPサーバー     | `smtp.forwardemail.net`                          |
| ポート（SSL/TLS）| `2455`                                           |
| ポート（STARTTLS）| `2555`（代替）                                  |
| ユーザー名       | あなたのエイリアスメール（例：`camera@yourdomain.com`） |
| パスワード       | 「パスワードを生成」で得たパスワード             |
| 認証             | 必須                                             |
| 暗号化           | SSL/TLS（推奨）またはSTARTTLS                     |

> \[!WARNING]
> これらのポートは、既知のセキュリティ脆弱性（BEAST、POODLE）がある廃止されたTLS 1.0プロトコルを使用しています。デバイスが最新のTLS 1.2+をサポートできない場合のみ使用してください。

これらの設定でデバイスを構成すれば、ローカルリレーサーバーを必要とせずにForward Email経由で直接メールを送信できます。

詳細は[Forward EmailのレガシーTLSサポートに関するFAQ](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings)をご覧ください。

### オプション2：Postfix SMTPリレーを設定する {#option-2-set-up-a-postfix-smtp-relay}

Forward Emailを使っていない場合やローカルリレーソリューションを好む場合は、Raspberry PiにPostfixを設定して中継役にします。これはGmail、Outlook、Yahoo、AOLなど任意のメールプロバイダーで動作します。

#### Postfixをインストールする {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
インストール中:

* **「インターネットサイト」** を選択
* 「システムメール名」にPiのホスト名（例: `raspberrypi-ftp`）を入力

#### メールプロバイダーを選択 {#choose-your-email-provider}

| プロバイダー | SMTPサーバー           | ポート | アプリパスワード必要？ |
| -------- | --------------------- | ---- | ---------------------- |
| Gmail    | smtp.gmail.com        | 587  | はい                    |
| Outlook  | smtp-mail.outlook.com | 587  | はい                    |
| Yahoo    | smtp.mail.yahoo.com   | 465  | はい                    |
| AOL      | smtp.aol.com          | 587  | はい                    |

#### アプリ固有パスワードを取得 {#get-an-app-specific-password}

ほとんどのプロバイダーはサードパーティアプリ用にアプリパスワードを要求します。メールプロバイダーのセキュリティ設定から生成してください:

* **Gmail:** [Google アカウント セキュリティ](https://myaccount.google.com/security)
* **Outlook:** [Microsoft アカウント セキュリティ](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo アカウント セキュリティ](https://login.yahoo.com/account/security)
* **AOL:** [AOL アカウント セキュリティ](https://login.aol.com/account/security)

> \[!IMPORTANT]
> 通常のメールパスワードは絶対に使用しないでください。必ずアプリ固有パスワードを使用してください。

#### SASL認証の設定 {#configure-sasl-authentication}

選択したプロバイダー用のパスワードファイルを作成します。ここではYahooを例にします:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

この行を追加（プロバイダーに合わせてサーバーとポートを調整）:

```
[smtp.mail.yahoo.com]:465 your_email@yahoo.com:your_app_password
```

Gmailの場合は以下を使用:

```
[smtp.gmail.com]:587 your_email@gmail.com:your_app_password
```

ファイルの権限を設定しハッシュ化:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### メールアドレスのマッピング設定 {#configure-email-address-mapping}

ローカルのメールアドレスをメールプロバイダーに合わせて書き換えます:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

この行を追加（`HOSTNAME` をPiのホスト名に置き換え、メールアドレスを使用）:

```
/.+@HOSTNAME/    your_email@provider.com
```

例:

```
/.+@raspberrypi-ftp/    john@yahoo.com
```

ファイルの権限を設定:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Postfixメイン設定の構成 {#configure-postfix-main-settings}

メイン設定を編集:

```bash
sudo nano /etc/postfix/main.cf
```

リレーホストを探して更新（またはファイル末尾に追加）:

```
relayhost = [smtp.mail.yahoo.com]:465
```

ファイル末尾に以下を追加:

```
# SMTPリレー設定
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# ネットワーク設定
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Gmail（ポート587）の場合は `smtp_tls_wrappermode = yes` を `no` に設定してください。

> \[!WARNING]
> `mynetworks` は実際のネットワーク範囲に更新してください。信頼できるネットワークのみ追加してください。これらのネットワーク上の任意のデバイスは認証なしでメールをリレーできます。

**一般的なネットワーク範囲:**

| ネットワーク範囲    | IPアドレス範囲              |
| ---------------- | --------------------------- |
| `192.168.0.0/24` | 192.168.0.1 - 192.168.0.254 |
| `192.168.1.0/24` | 192.168.1.1 - 192.168.1.254 |
| `10.0.0.0/8`     | 10.0.0.0 - 10.255.255.255   |

#### ファイアウォールの更新と再起動 {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP for local devices'
sudo systemctl restart postfix
```

Postfixが動作しているか確認:

```bash
sudo systemctl status postfix
```

#### リレーのテスト {#test-the-relay}

テストメールを送信:

```bash
echo "Test from Postfix" | mail -s "Test" your_email@provider.com
```

ログを確認:

```bash
sudo tail -f /var/log/mail.log
```

`status=sent` があれば成功です。

#### デバイスの設定 {#configure-your-device-1}

カメラやデバイスの設定で:
* **SMTPサーバー:** あなたのPiのIPアドレス（例：`192.168.1.100`）
* **SMTPポート:** `25`
* **認証:** なし
* **暗号化:** なし（ローカルネットワークのみ）


## トラブルシューティング {#troubleshooting}

問題が発生した場合は、以下のログファイルを確認してください：

**FTPサーバー:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**ファイルモニター:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfixメール:**

```bash
sudo tail -f /var/log/mail.log
mailq  # メールキューを表示
```


## まとめ {#wrapping-up}

Raspberry Piは、セキュアなファイルアップロード、自動メール通知（添付ファイル付き）、およびレガシーデバイス向けのSMTPリレー機能を備えた完全な自動化システムとなりました。Forward EmailのレガシーTLSポートやローカルのPostfixリレーを使用することで、古いデバイスでも最新のメールプロバイダーを通じて信頼性の高いメール送信が可能になります。
