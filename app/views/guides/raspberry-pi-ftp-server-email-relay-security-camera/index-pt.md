# Transforme seu Raspberry Pi em um Servidor FTP Seguro com Relay de Email {#turn-your-raspberry-pi-into-a-secure-ftp-server-with-email-relay}

Tem um Raspberry Pi juntando poeira? Seja o mais recente Pi 5, um Pi 4, Pi Zero ou até um modelo mais antigo, este guia mostrará como transformá-lo em um servidor de arquivos poderoso e automatizado com capacidades de relay de email. Perfeito para câmeras de segurança, dispositivos IoT e muito mais.

**Compatível com:** Raspberry Pi 5, Raspberry Pi 4 Model B, Raspberry Pi 3 Model B+, Raspberry Pi 3 Model B, Raspberry Pi 2 Model B, Raspberry Pi Zero 2 W, Raspberry Pi Zero W e Raspberry Pi Zero.

> \[!NOTE]
> Este guia foi testado e verificado em um Raspberry Pi 3 Model B rodando Ubuntu Server 22.04 LTS.


## Índice {#table-of-contents}

* [O Que Estamos Construindo](#what-were-building)
* [Parte 1: Instalando o Ubuntu Server no Seu Pi](#part-1-getting-ubuntu-server-on-your-pi)
  * [O Que Você Vai Precisar](#what-youll-need)
  * [Gravando o SO](#flashing-the-os)
  * [Inicializando e Conectando](#booting-up--connecting)
* [Parte 2: Configurando um Servidor FTP Seguro](#part-2-setting-up-a-secure-ftp-server)
  * [Instalação e Configuração](#installation--configuration)
  * [Criando um Usuário FTP](#creating-an-ftp-user)
* [Parte 3: Firewall e Proteção contra Força Bruta](#part-3-firewall-and-brute-force-protection)
  * [Configurando o UFW](#setting-up-ufw)
  * [Configurando o Fail2ban](#setting-up-fail2ban)
* [Parte 4: Processamento Automático de Arquivos com Notificações por Email](#part-4-automated-file-processing-with-email-notifications)
  * [Opção 1: Usando a API do Forward Email (Recomendado)](#option-1-using-forward-email-api-recommended)
  * [Opção 2: Usando Outros Provedores de Email](#option-2-using-other-email-providers)
  * [Criar um Serviço Systemd](#create-a-systemd-service)
* [Parte 5: Opções de Email para Dispositivos Legados](#part-5-email-options-for-legacy-devices)
  * [Opção 1: Use as portas TLS 1.0 legadas do Forward Email (Recomendado)](#option-1-use-forward-emails-legacy-tls-10-ports-recommended)
  * [Opção 2: Configure um Relay SMTP Postfix](#option-2-set-up-a-postfix-smtp-relay)
* [Resolução de Problemas](#troubleshooting)
* [Conclusão](#wrapping-up)


## O Que Estamos Construindo {#what-were-building}

Este guia irá guiá-lo na configuração de um sistema completo que inclui:

* **Ubuntu Server 22.04 LTS:** Um sistema operacional leve e robusto para o Pi.
* **Um Servidor FTP Seguro (vsftpd):** Para enviar arquivos com segurança.
* **Um Firewall (UFW) & Fail2ban:** Para manter os invasores afastados.
* **Um Processador Automático de Arquivos:** Um script que captura novos arquivos, envia-os por email como anexos e depois faz a limpeza.
* **Opções de Email para Dispositivos Legados:** Duas abordagens para dispositivos que não suportam TLS moderno:
  * Usar as portas TLS 1.0 legadas do Forward Email (mais fácil)
  * Configurar um relay SMTP Postfix (funciona com qualquer provedor de email)

Pronto? Vamos começar.


## Parte 1: Instalando o Ubuntu Server no Seu Pi {#part-1-getting-ubuntu-server-on-your-pi}

Primeiro de tudo, coloque o Ubuntu Server rodando no Raspberry Pi. Isso é surpreendentemente fácil graças ao Raspberry Pi Imager.

### O Que Você Vai Precisar {#what-youll-need}

* Qualquer Raspberry Pi compatível (veja a lista acima)
* Um cartão microSD (mínimo 8GB, recomendado 16GB+)
* Um computador com leitor de cartão microSD
* Fonte de alimentação adequada para seu modelo de Pi
* Acesso à internet (Ethernet ou Wi-Fi)

> \[!NOTE]
> Modelos mais antigos como o Raspberry Pi 2 ou Pi Zero podem ser mais lentos, mas funcionarão bem para esta configuração.

### Gravando o SO {#flashing-the-os}

1. **Obtenha o Raspberry Pi Imager:** Baixe-o do [site oficial](https://www.raspberrypi.com/software/).

2. **Escolha o SO:** No imager, selecione "CHOOSE OS" > "Other general-purpose OS" > "Ubuntu".
   * Para modelos 64-bit (Pi 3, 4, 5, Zero 2 W), escolha **"Ubuntu Server 22.04.1 LTS (64-bit)"**.
   * Para modelos 32-bit mais antigos (Pi 2, Pi Zero, Pi Zero W), escolha **"Ubuntu Server 22.04.1 LTS (32-bit)"**.

3. **Escolha seu armazenamento:** Selecione seu cartão microSD.

> \[!WARNING]
> Isso apagará completamente seu cartão microSD. Certifique-se de ter feito backup de tudo que for importante.

4. **Opções avançadas são suas amigas:** Clique no ícone de engrenagem (⚙️) para configurar o Pi para modo headless (sem monitor ou teclado).
   * **Hostname:** Dê um nome ao seu Pi (ex.: `pi-server`).
   * **SSH:** Ative e defina um nome de usuário e senha.
   * **Wi-Fi:** Se não estiver usando Ethernet, insira os dados do seu Wi-Fi.
   * **Locale:** Defina seu fuso horário e layout de teclado.
5. **Escreva!** Clique no botão "WRITE" e deixe o imager fazer seu trabalho.

### Inicializando e Conectando {#booting-up--connecting}

Quando o imager terminar, insira o cartão microSD no Pi e conecte-o. Dê alguns minutos para inicializar. Ele está fazendo uma configuração inicial em segundo plano. Encontre o endereço IP no painel de administração do seu roteador e conecte via SSH:

```bash
ssh seu_usuario@endereco_ip_do_pi
```

Você está dentro! O Raspberry Pi agora está pronto para configuração.


## Parte 2: Configurando um Servidor FTP Seguro {#part-2-setting-up-a-secure-ftp-server}

Em seguida, configure o `vsftpd` (Very Secure FTP Daemon), configurado para máxima segurança.

### Instalação e Configuração {#installation--configuration}

1. **Instale o vsftpd:**

   ```bash
   sudo apt update
   sudo apt install vsftpd -y
   ```

2. **Faça backup do arquivo de configuração:**

   ```bash
   sudo cp /etc/vsftpd.conf /etc/vsftpd.conf.backup
   ```

3. **Edite a configuração:**

   ```bash
   sudo nano /etc/vsftpd.conf
   ```

> \[!TIP]
> Se uma linha estiver comentada (começa com `#`), descomente removendo o `#`.

Faça estas alterações:

| Configuração             | Valor | Propósito                                                |
| ------------------------ | ----- | -------------------------------------------------------- |
| `anonymous_enable`       | `NO`  | Desabilitar acesso FTP anônimo                           |
| `local_enable`           | `YES` | Permitir login de usuários locais                        |
| `write_enable`           | `YES` | Habilitar upload de arquivos                             |
| `local_umask`            | `022` | Definir permissões de arquivos (644 para arquivos, 755 para diretórios) |
| `chroot_local_user`      | `YES` | Prender usuários ao diretório home                       |
| `allow_writeable_chroot` | `YES` | Permitir uploads dentro do jail chroot                   |

4. **Adicione o intervalo de portas passivas:** Adicione estas linhas ao final do arquivo. Isso é necessário para o firewall.

   ```
   pasv_enable=YES
   pasv_min_port=40000
   pasv_max_port=50000
   ```

5. **Habilite o registro de logs:** Adicione estas linhas para ativar o log para o Fail2ban.

   ```
   xferlog_enable=YES
   xferlog_file=/var/log/vsftpd.log
   log_ftp_protocol=YES
   ```

6. **Salve e reinicie:** Pressione `Ctrl+O`, `Enter`, `Ctrl+X`, depois reinicie o serviço:

   ```bash
   sudo systemctl restart vsftpd
   ```

### Criando um Usuário FTP {#creating-an-ftp-user}

Crie um usuário dedicado e restrito para acesso FTP.

1. **Crie o usuário:**

   ```bash
   sudo adduser ftpuser
   ```

   Siga as instruções para definir uma senha. Os outros campos (nome, telefone, etc.) podem ser deixados em branco.

2. **Crie a estrutura de diretórios:**

   ```bash
   sudo mkdir -p /home/ftpuser/ftp/uploads
   ```

   * `/home/ftpuser/ftp` - Diretório principal do FTP
   * `/home/ftpuser/ftp/uploads` - Onde os arquivos serão enviados

3. **Defina as permissões:**

   ```bash
   sudo chown -R ftpuser:ftpuser /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp
   sudo chmod 755 /home/ftpuser/ftp/uploads
   ```


## Parte 3: Firewall e Proteção contra Força Bruta {#part-3-firewall-and-brute-force-protection}

Proteja o Pi com UFW (Uncomplicated Firewall) e Fail2ban.

### Configurando o UFW {#setting-up-ufw}

1. **Instale o UFW:**

   ```bash
   sudo apt install ufw -y
   ```

2. **Defina as políticas padrão:**

   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   ```

3. **Permita SSH (crítico!):**

   ```bash
   sudo ufw allow ssh comment 'SSH access'
   ```

> \[!WARNING]
> Sempre permita SSH antes de ativar o firewall, ou você ficará trancado para fora!

4. **Permita as portas FTP:**

   ```bash
   sudo ufw allow 20/tcp comment 'FTP data'
   sudo ufw allow 21/tcp comment 'FTP control'
   sudo ufw allow 40000:50000/tcp comment 'FTP passive mode'
   ```

5. **Ative o firewall:**

   ```bash
   sudo ufw enable
   ```

### Configurando o Fail2ban {#setting-up-fail2ban}

O Fail2ban bloqueia automaticamente endereços IP após tentativas repetidas de login falhadas.

1. **Instale o Fail2ban:**

   ```bash
   sudo apt install fail2ban -y
   ```

2. **Crie uma configuração local:**

   ```bash
   sudo nano /etc/fail2ban/jail.local
   ```

3. **Adicione estas configurações:**
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

Torne-o executável:

```bash
sudo chmod +x /usr/local/bin/ftp-monitor.sh
```

### Crie um Serviço Systemd {#create-a-systemd-service}

```bash
sudo nano /etc/systemd/system/ftp-monitor.service
```

Adicione este conteúdo:

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

Habilite e inicie o serviço:

```bash
sudo systemctl daemon-reload
sudo systemctl enable ftp-monitor.service
sudo systemctl start ftp-monitor.service
```

Verifique o status:

```bash
sudo systemctl status ftp-monitor.service
```


## Parte 5: Opções de Email para Dispositivos Legados {#part-5-email-options-for-legacy-devices}

Dispositivos como câmeras FOSSCAM frequentemente não suportam versões modernas do TLS. Existem duas soluções:

### Opção 1: Use as Portas TLS 1.0 Legadas do Forward Email (Recomendado) {#option-1-use-forward-emails-legacy-tls-10-ports-recommended}

Se você está usando o Forward Email, esta é a solução mais fácil. O Forward Email fornece portas dedicadas TLS 1.0 legadas especificamente para dispositivos mais antigos como câmeras, impressoras, scanners e máquinas de fax.

#### Preços {#pricing}

O Forward Email oferece vários planos:

| Plano                   | Preço        | Recursos                              |
| ----------------------- | ------------ | ----------------------------------- |
| Gratuito                | $0/mês       | Apenas encaminhamento de email (sem envio) |
| **Proteção Aprimorada** | **$3/mês**   | **Acesso SMTP + portas TLS 1.0 legadas** |
| Equipe                  | $9/mês       | Proteção Aprimorada + recursos para equipe |
| Empresarial             | $250/mês     | Equipe + solicitações ilimitadas de API |

> \[!IMPORTANT]
> O **plano Proteção Aprimorada ($3/mês)** ou superior é necessário para acesso SMTP e suporte às portas TLS 1.0 legadas.

Saiba mais em [Forward Email Pricing](https://forwardemail.net/en/pricing).

#### Gere Sua Senha {#generate-your-password}

Antes de configurar seu dispositivo, gere uma senha no Forward Email:

1. Faça login em [Forward Email](https://forwardemail.net)
2. Navegue para **Minha Conta → Domínios → \[Seu Domínio] → Aliases**
3. Crie ou selecione um alias (ex.: `camera@seudominio.com`)
4. Clique em **"Generate Password"** ao lado do alias
5. Copie a senha gerada - você usará isso para autenticação SMTP

> \[!TIP]
> Cada alias pode ter sua própria senha. Isso é útil para rastrear qual dispositivo enviou qual email.

#### Configure Seu Dispositivo {#configure-your-device}

Use estas configurações na sua câmera, impressora, scanner ou outro dispositivo legado:

| Configuração    | Valor                                            |
| --------------- | ------------------------------------------------ |
| Servidor SMTP   | `smtp.forwardemail.net`                          |
| Porta (SSL/TLS) | `2455`                                           |
| Porta (STARTTLS)| `2555` (alternativa)                             |
| Usuário         | Seu email alias (ex.: `camera@seudominio.com`)  |
| Senha           | A senha gerada em "Generate Password"            |
| Autenticação    | Obrigatória                                      |
| Criptografia    | SSL/TLS (recomendado) ou STARTTLS                |

> \[!WARNING]
> Essas portas usam o protocolo TLS 1.0 obsoleto que possui vulnerabilidades conhecidas (BEAST, POODLE). Use somente se seu dispositivo não suportar TLS moderno 1.2+.

Basta configurar seu dispositivo com essas configurações e ele enviará emails diretamente pelo Forward Email sem precisar de um servidor relay local.

Para mais detalhes, veja o [FAQ do Forward Email sobre Suporte a TLS Legado](https://forwardemail.net/en/faq#what-are-your-smtp-server-configuration-settings).

### Opção 2: Configure um Relay SMTP Postfix {#option-2-set-up-a-postfix-smtp-relay}

Se você não usa o Forward Email, ou prefere uma solução de relay local, configure o Postfix no Raspberry Pi para atuar como intermediário. Isso funciona com qualquer provedor de email (Gmail, Outlook, Yahoo, AOL, etc.).

#### Instale o Postfix {#install-postfix}

```bash
sudo apt update
sudo apt install postfix mailutils libsasl2-modules -y
```
Durante a instalação:

* Selecione **"Internet Site"**
* Insira o nome do host do seu Pi (por exemplo, `raspberrypi-ftp`) para "System mail name"

#### Escolha Seu Provedor de Email {#choose-your-email-provider}

| Provedor | Servidor SMTP        | Porta | Senha de App Necessária? |
| -------- | -------------------- | ----- | ------------------------ |
| Gmail    | smtp.gmail.com       | 587   | Sim                      |
| Outlook  | smtp-mail.outlook.com| 587   | Sim                      |
| Yahoo    | smtp.mail.yahoo.com  | 465   | Sim                      |
| AOL      | smtp.aol.com         | 587   | Sim                      |

#### Obtenha uma Senha Específica para App {#get-an-app-specific-password}

A maioria dos provedores exige senhas de app para aplicações de terceiros. Gere uma nas configurações de segurança do seu provedor de email:

* **Gmail:** [Google Account Security](https://myaccount.google.com/security)
* **Outlook:** [Microsoft Account Security](https://account.microsoft.com/security)
* **Yahoo:** [Yahoo Account Security](https://login.yahoo.com/account/security)
* **AOL:** [AOL Account Security](https://login.aol.com/account/security)

> \[!IMPORTANT]
> Nunca use sua senha de email normal. Sempre use uma senha específica para app.

#### Configure a Autenticação SASL {#configure-sasl-authentication}

Crie o arquivo de senha para o provedor escolhido. Este exemplo usa Yahoo:

```bash
sudo mkdir -p /etc/postfix/sasl
sudo chmod 700 /etc/postfix/sasl
sudo nano /etc/postfix/sasl/sasl_passwd
```

Adicione esta linha (ajuste servidor e porta para seu provedor):

```
[smtp.mail.yahoo.com]:465 seu_email@yahoo.com:sua_senha_de_app
```

Para Gmail, use:

```
[smtp.gmail.com]:587 seu_email@gmail.com:sua_senha_de_app
```

Proteja e gere o hash do arquivo:

```bash
sudo chmod 600 /etc/postfix/sasl/sasl_passwd
sudo postmap /etc/postfix/sasl/sasl_passwd
```

#### Configure o Mapeamento de Endereços de Email {#configure-email-address-mapping}

Reescreva endereços de email locais para corresponder ao seu provedor:

```bash
sudo mkdir -p /etc/postfix/map
sudo chmod 700 /etc/postfix/map
sudo nano /etc/postfix/map/regex_map
```

Adicione esta linha (substitua `HOSTNAME` pelo nome do host do seu Pi e use seu email):

```
/.+@HOSTNAME/    seu_email@provedor.com
```

Exemplo:

```
/.+@raspberrypi-ftp/    joao@yahoo.com
```

Proteja o arquivo:

```bash
sudo chmod 600 /etc/postfix/map/regex_map
```

#### Configure as Configurações Principais do Postfix {#configure-postfix-main-settings}

Edite a configuração principal:

```bash
sudo nano /etc/postfix/main.cf
```

Encontre e atualize o relay host (ou adicione no final):

```
relayhost = [smtp.mail.yahoo.com]:465
```

Adicione estas configurações no final do arquivo:

```
# Configuração do Relay SMTP
smtp_use_tls = yes
smtp_sasl_auth_enable = yes
smtp_sasl_security_options = noanonymous
smtp_sasl_password_maps = hash:/etc/postfix/sasl/sasl_passwd
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
smtp_tls_wrappermode = yes
smtp_tls_security_level = encrypt
smtp_generic_maps = regexp:/etc/postfix/map/regex_map

# Configurações de rede
inet_interfaces = all
inet_protocols = ipv4
mynetworks = 127.0.0.0/8 [::1]/128 192.168.1.0/24
```

> \[!TIP]
> Para Gmail (porta 587), defina `smtp_tls_wrappermode = no` em vez de `yes`.

> \[!WARNING]
> Atualize `mynetworks` com o intervalo real da sua rede. Adicione apenas redes confiáveis - qualquer dispositivo nessas redes pode enviar emails sem autenticação.

**Intervalos comuns de rede:**

| Intervalo de Rede | Faixa de Endereços IP          |
| ----------------- | ------------------------------ |
| `192.168.0.0/24`  | 192.168.0.1 - 192.168.0.254    |
| `192.168.1.0/24`  | 192.168.1.1 - 192.168.1.254    |
| `10.0.0.0/8`      | 10.0.0.0 - 10.255.255.255      |

#### Atualize o Firewall e Reinicie {#update-firewall-and-restart}

```bash
sudo ufw allow 25/tcp comment 'SMTP para dispositivos locais'
sudo systemctl restart postfix
```

Verifique se o Postfix está rodando:

```bash
sudo systemctl status postfix
```

#### Teste o Relay {#test-the-relay}

Envie um email de teste:

```bash
echo "Teste do Postfix" | mail -s "Teste" seu_email@provedor.com
```

Verifique os logs:

```bash
sudo tail -f /var/log/mail.log
```

Procure por `status=sent` para confirmar sucesso.

#### Configure Seu Dispositivo {#configure-your-device-1}

Nas configurações da sua câmera ou dispositivo:
* **Servidor SMTP:** O endereço IP do seu Pi (ex.: `192.168.1.100`)
* **Porta SMTP:** `25`
* **Autenticação:** Nenhuma
* **Criptografia:** Nenhuma (somente rede local)


## Solução de Problemas {#troubleshooting}

Se surgirem problemas, verifique estes arquivos de log:

**Servidor FTP:**

```bash
sudo tail -f /var/log/vsftpd.log
```

**Fail2ban:**

```bash
sudo fail2ban-client status
sudo tail -f /var/log/fail2ban.log
```

**Monitor de Arquivos:**

```bash
sudo journalctl -u ftp-monitor.service -f
```

**Postfix Mail:**

```bash
sudo tail -f /var/log/mail.log
mailq  # Ver fila de emails
```


## Finalizando {#wrapping-up}

O Raspberry Pi agora é um sistema automatizado completo com uploads de arquivos seguros, notificações automáticas por email com anexos e capacidades de retransmissão SMTP para dispositivos legados. Seja usando as portas TLS legadas do Forward Email ou um relay Postfix local, dispositivos mais antigos agora podem enviar emails de forma confiável através de provedores modernos.
