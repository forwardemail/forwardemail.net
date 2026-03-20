# Guia de Instalação de Auto-Hospedagem do Forward Email para Debian {#forward-email-self-hosting-installation-guide-for-debian}


## Índice {#table-of-contents}

* [Visão Geral](#overview)
* [Pré-requisitos](#prerequisites)
* [Requisitos do Sistema](#system-requirements)
* [Instalação Passo a Passo](#step-by-step-installation)
  * [Passo 1: Configuração Inicial do Sistema](#step-1-initial-system-setup)
  * [Passo 2: Configurar Resolvedores DNS](#step-2-configure-dns-resolvers)
  * [Passo 3: Instalar Dependências do Sistema](#step-3-install-system-dependencies)
  * [Passo 4: Instalar e Configurar Snapd](#step-4-install-and-configure-snapd)
  * [Passo 5: Instalar Pacotes Snap](#step-5-install-snap-packages)
  * [Passo 6: Instalar Docker](#step-6-install-docker)
  * [Passo 7: Configurar Serviço Docker](#step-7-configure-docker-service)
  * [Passo 8: Instalar e Configurar Firewall UFW](#step-8-install-and-configure-ufw-firewall)
  * [Passo 9: Clonar Repositório do Forward Email](#step-9-clone-forward-email-repository)
  * [Passo 10: Configurar Ambiente](#step-10-set-up-environment-configuration)
  * [Passo 11: Configurar Seu Domínio](#step-11-configure-your-domain)
  * [Passo 12: Gerar Certificados SSL](#step-12-generate-ssl-certificates)
  * [Passo 13: Gerar Chaves de Criptografia](#step-13-generate-encryption-keys)
  * [Passo 14: Atualizar Caminhos SSL na Configuração](#step-14-update-ssl-paths-in-configuration)
  * [Passo 15: Configurar Autenticação Básica](#step-15-set-up-basic-authentication)
  * [Passo 16: Implantar com Docker Compose](#step-16-deploy-with-docker-compose)
  * [Passo 17: Verificar Instalação](#step-17-verify-installation)
* [Configuração Pós-Instalação](#post-installation-configuration)
  * [Configuração de Registros DNS](#dns-records-setup)
  * [Primeiro Login](#first-login)
* [Configuração de Backup](#backup-configuration)
  * [Configurar Backup Compatível com S3](#set-up-s3-compatible-backup)
  * [Configurar Tarefas Cron de Backup](#set-up-backup-cron-jobs)
* [Configuração de Atualização Automática](#auto-update-configuration)
* [Considerações Específicas para Debian](#debian-specific-considerations)
  * [Diferenças no Gerenciamento de Pacotes](#package-management-differences)
  * [Gerenciamento de Serviços](#service-management)
  * [Configuração de Rede](#network-configuration)
* [Manutenção e Monitoramento](#maintenance-and-monitoring)
  * [Locais dos Logs](#log-locations)
  * [Tarefas Regulares de Manutenção](#regular-maintenance-tasks)
  * [Renovação de Certificados](#certificate-renewal)
* [Solução de Problemas](#troubleshooting)
  * [Problemas Específicos do Debian](#debian-specific-issues)
  * [Problemas Comuns](#common-issues)
  * [Obter Ajuda](#getting-help)
* [Melhores Práticas de Segurança](#security-best-practices)
* [Conclusão](#conclusion)


## Visão Geral {#overview}

Este guia fornece instruções passo a passo para instalar a solução auto-hospedada do Forward Email em sistemas Debian. Este guia é especificamente direcionado para Debian 11 (Bullseye) e Debian 12 (Bookworm).


## Pré-requisitos {#prerequisites}

Antes de iniciar a instalação, certifique-se de que você possui:

* **Servidor Debian**: Versão 11 (Bullseye) ou 12 (Bookworm)
* **Acesso Root**: Você deve ser capaz de executar comandos como root (acesso sudo)
* **Nome de Domínio**: Um domínio que você controla com acesso à gestão de DNS
* **Servidor Limpo**: Recomenda-se usar uma instalação Debian nova
* **Conexão com a Internet**: Necessária para baixar pacotes e imagens Docker


## Requisitos do Sistema {#system-requirements}

* **RAM**: Mínimo 2GB (4GB recomendados para produção)
* **Armazenamento**: Mínimo 20GB de espaço disponível (50GB+ recomendados para produção)
* **CPU**: 1 vCPU mínimo (2+ vCPUs recomendados para produção)
* **Rede**: Endereço IP público com as seguintes portas acessíveis:
  * 22 (SSH)
  * 25 (SMTP)
  * 80 (HTTP)
  * 443 (HTTPS)
  * 465 (SMTPS)
  * 993 (IMAPS)
  * 995 (POP3S)


## Instalação Passo a Passo {#step-by-step-installation}

### Passo 1: Configuração Inicial do Sistema {#step-1-initial-system-setup}

Primeiro, certifique-se de que seu sistema está atualizado e mude para o usuário root:

```bash
# Atualizar pacotes do sistema
sudo apt update && sudo apt upgrade -y

# Mudar para usuário root (necessário para a instalação)
sudo su -
```
### Step 2: Configurar Resolvedores DNS {#step-2-configure-dns-resolvers}

Configure seu sistema para usar os servidores DNS da Cloudflare para geração confiável de certificados:

```bash
# Pare e desative o systemd-resolved se estiver em execução
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configure os resolvedores DNS da Cloudflare
tee /etc/resolv.conf > /dev/null <<EOF
nameserver 1.1.1.1
nameserver 2606:4700:4700::1111
nameserver 1.0.0.1
nameserver 2606:4700:4700::1001
nameserver 8.8.8.8
nameserver 2001:4860:4860::8888
nameserver 8.8.4.4
nameserver 2001:4860:4860::8844
EOF
```

### Step 3: Instalar Dependências do Sistema {#step-3-install-system-dependencies}

Instale os pacotes necessários para o Forward Email no Debian:

```bash
# Atualize a lista de pacotes
apt-get update -y

# Instale dependências básicas (lista de pacotes específica para Debian)
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    lsb-release \
    apt-transport-https \
    software-properties-common
```

### Step 4: Instalar e Configurar Snapd {#step-4-install-and-configure-snapd}

O Debian não inclui o snapd por padrão, então precisamos instalá-lo e configurá-lo:

```bash
# Instale o snapd
apt-get install -y snapd

# Habilite e inicie o serviço snapd
systemctl enable snapd
systemctl start snapd

# Crie um link simbólico para o snap funcionar corretamente
ln -sf /var/lib/snapd/snap /snap

# Aguarde o snapd ficar pronto
sleep 10

# Verifique se o snapd está funcionando
snap version
```

### Step 5: Instalar Pacotes Snap {#step-5-install-snap-packages}

Instale o AWS CLI e o Certbot via snap:

```bash
# Instale o AWS CLI
snap install aws-cli --classic

# Instale o Certbot e o plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare

# Verifique as instalações
aws --version
certbot --version
```

### Step 6: Instalar Docker {#step-6-install-docker}

Instale o Docker CE e o Docker Compose no Debian:

```bash
# Adicione a chave GPG oficial do Docker (específico para Debian)
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Adicione o repositório do Docker (específico para Debian)
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Atualize o índice de pacotes e instale o Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Instale o docker-compose standalone como fallback (se o plugin não funcionar)
if ! command -v docker-compose &> /dev/null; then
    apt-get install -y docker-compose
fi

# Verifique a instalação do Docker
docker --version
docker compose version || docker-compose --version
```

### Step 7: Configurar Serviço Docker {#step-7-configure-docker-service}

Garanta que o Docker inicie automaticamente e esteja em execução:

```bash
# Habilite e inicie o serviço Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verifique se o Docker está em execução
docker info
```

Se o Docker falhar ao iniciar, tente iniciá-lo manualmente:

```bash
# Método alternativo de inicialização se o systemctl falhar
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Step 8: Instalar e Configurar Firewall UFW {#step-8-install-and-configure-ufw-firewall}

Instalações mínimas do Debian podem não incluir o UFW, então instale-o primeiro:

```bash
# Instale o UFW se não estiver presente
if ! command -v ufw &> /dev/null; then
    apt-get update -y
    apt-get install -y ufw
fi

# Defina as políticas padrão
ufw default deny incoming
ufw default allow outgoing

# Permita SSH (importante - não se trave para fora!)
ufw allow 22/tcp

# Permita portas relacionadas a email
ufw allow 25/tcp    # SMTP
ufw allow 80/tcp    # HTTP (para Let's Encrypt)
ufw allow 443/tcp   # HTTPS
ufw allow 465/tcp   # SMTPS
ufw allow 993/tcp   # IMAPS
ufw allow 995/tcp   # POP3S
ufw allow 2993/tcp  # IMAP (porta alternativa)
ufw allow 2995/tcp  # POP3 (porta alternativa)
ufw allow 3456/tcp  # Porta de serviço personalizada
ufw allow 4000/tcp  # Porta de serviço personalizada
ufw allow 5000/tcp  # Porta de serviço personalizada

# Permita conexões locais ao banco de dados
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Ative o firewall
echo "y" | ufw enable

# Verifique o status do firewall
ufw status numbered
```
### Passo 9: Clonar o Repositório Forward Email {#step-9-clone-forward-email-repository}

Baixe o código-fonte do Forward Email:

```bash
# Set up variables
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clone the repository
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verify the clone was successful
ls -la
```

### Passo 10: Configurar a Configuração do Ambiente {#step-10-set-up-environment-configuration}

Prepare a configuração do ambiente:

```bash
# Set up directory variables
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copy default environment file
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Create SSL directory
mkdir -p "$SELF_HOST_DIR/ssl"

# Create database directories
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Passo 11: Configure Seu Domínio {#step-11-configure-your-domain}

Defina o nome do seu domínio e atualize as variáveis de ambiente:

```bash
# Replace 'yourdomain.com' with your actual domain
DOMAIN="yourdomain.com"

# Function to update environment file
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Update domain-related environment variables
update_env_file "DOMAIN" "$DOMAIN"
update_env_file "NODE_ENV" "production"
update_env_file "HTTP_PROTOCOL" "https"
update_env_file "WEB_HOST" "$DOMAIN"
update_env_file "WEB_PORT" "443"
update_env_file "CALDAV_HOST" "caldav.$DOMAIN"
update_env_file "CARDDAV_HOST" "carddav.$DOMAIN"
update_env_file "API_HOST" "api.$DOMAIN"
update_env_file "APP_NAME" "$DOMAIN"
update_env_file "SMTP_HOST" "smtp.$DOMAIN"
update_env_file "SMTP_PORT" "465"
update_env_file "IMAP_HOST" "imap.$DOMAIN"
update_env_file "IMAP_PORT" "993"
update_env_file "POP3_HOST" "pop3.$DOMAIN"
update_env_file "POP3_PORT" "995"
update_env_file "MX_HOST" "mx.$DOMAIN"
update_env_file "SMTP_EXCHANGE_DOMAINS" "mx.$DOMAIN"
update_env_file "SELF_HOSTED" "true"
update_env_file "WEBSITE_URL" "$DOMAIN"
update_env_file "AUTH_BASIC_ENABLED" "true"
```

### Passo 12: Gerar Certificados SSL {#step-12-generate-ssl-certificates}

#### Opção A: Desafio DNS Manual (Recomendado para a maioria dos usuários) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Generate certificates using manual DNS challenge
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Quando solicitado, você precisará criar registros TXT no seu DNS. Você pode ver múltiplos desafios para o mesmo domínio - **crie TODOS eles**. Não remova o primeiro registro TXT ao adicionar o segundo.

#### Opção B: DNS Cloudflare (Se você usa Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Se seu domínio usa Cloudflare para DNS, você pode automatizar a geração dos certificados:

```bash
# Create Cloudflare credentials file
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Set proper permissions
chmod 600 /root/.cloudflare.ini

# Generate certificates automatically
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /root/.cloudflare.ini \
  -d "$DOMAIN" \
  -d "*.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  --email "your-email@example.com"
```

#### Copiar Certificados {#copy-certificates}

Após a geração dos certificados, copie-os para o diretório da aplicação:

```bash
# Copy certificates to application SSL directory
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verify certificates were copied
ls -la "$SELF_HOST_DIR/ssl/"
```

### Passo 13: Gerar Chaves de Criptografia {#step-13-generate-encryption-keys}

Crie as várias chaves de criptografia necessárias para a operação segura:

```bash
# Generate helper encryption key
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Generate SRS secret for email forwarding
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Generate TXT encryption key
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Generate DKIM private key for email signing
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Generate webhook signature key
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Set SMTP transport password
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ All encryption keys generated successfully"
```
### Passo 14: Atualizar Caminhos SSL na Configuração {#step-14-update-ssl-paths-in-configuration}

Configure os caminhos do certificado SSL no arquivo de ambiente:

```bash
# Atualize os caminhos SSL para apontar para os arquivos corretos do certificado
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Passo 15: Configurar Autenticação Básica {#step-15-set-up-basic-authentication}

Crie credenciais temporárias de autenticação básica:

```bash
# Gere uma senha aleatória segura
PASSWORD=$(openssl rand -base64 16)

# Atualize o arquivo de ambiente com as credenciais de autenticação básica
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Exiba as credenciais (salve-as!)
echo ""
echo "🔐 IMPORTANTE: Salve estas credenciais de login!"
echo "=================================="
echo "Usuário: admin"
echo "Senha: $PASSWORD"
echo "=================================="
echo ""
echo "Você precisará delas para acessar a interface web após a instalação."
echo ""
```

### Passo 16: Implantar com Docker Compose {#step-16-deploy-with-docker-compose}

Inicie todos os serviços do Forward Email:

```bash
# Defina o caminho do arquivo Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Pare quaisquer containers existentes
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" down
else
    docker compose -f "$DOCKER_COMPOSE_FILE" down
fi

# Baixe as imagens mais recentes
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
else
    docker compose -f "$DOCKER_COMPOSE_FILE" pull
fi

# Inicie todos os serviços em modo destacado
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d
else
    docker compose -f "$DOCKER_COMPOSE_FILE" up -d
fi

# Aguarde um momento para os serviços iniciarem
sleep 10

# Verifique o status dos serviços
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
else
    docker compose -f "$DOCKER_COMPOSE_FILE" ps
fi
```

### Passo 17: Verificar Instalação {#step-17-verify-installation}

Verifique se todos os serviços estão funcionando corretamente:

```bash
# Verifique os containers Docker
docker ps

# Verifique os logs dos serviços para quaisquer erros
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
else
    docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50
fi

# Teste a conectividade da interface web
curl -I https://$DOMAIN

# Verifique se as portas estão escutando
ss -tlnp | grep -E ':(25|80|443|465|587|993|995)'
```


## Configuração Pós-Instalação {#post-installation-configuration}

### Configuração dos Registros DNS {#dns-records-setup}

Você precisa configurar os seguintes registros DNS para seu domínio:

#### Registro MX {#mx-record}

```
@ MX 10 mx.seudominio.com
```

#### Registros A {#a-records}

```
@ A SEU_IP_DO_SERVIDOR
mx A SEU_IP_DO_SERVIDOR
smtp A SEU_IP_DO_SERVIDOR
imap A SEU_IP_DO_SERVIDOR
pop3 A SEU_IP_DO_SERVIDOR
api A SEU_IP_DO_SERVIDOR
caldav A SEU_IP_DO_SERVIDOR
carddav A SEU_IP_DO_SERVIDOR
```

#### Registro SPF {#spf-record}

```
@ TXT "v=spf1 mx ~all"
```

#### Registro DKIM {#dkim-record}

Obtenha sua chave pública DKIM:

```bash
# Extraia a chave pública DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Crie o registro DNS DKIM:

```
default._domainkey TXT "v=DKIM1; k=rsa; p=SUA_CHAVE_PÚBLICA_DKIM"
```

#### Registro DMARC {#dmarc-record}

```
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@seudominio.com"
```

### Primeiro Login {#first-login}

1. Abra seu navegador e acesse `https://seudominio.com`
2. Insira as credenciais de autenticação básica que você salvou anteriormente
3. Complete o assistente de configuração inicial
4. Crie sua primeira conta de e-mail


## Configuração de Backup {#backup-configuration}

### Configurar Backup Compatível com S3 {#set-up-s3-compatible-backup}

Configure backups automatizados para armazenamento compatível com S3:

```bash
# Crie o diretório de credenciais AWS
mkdir -p ~/.aws

# Configure as credenciais AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = SUA_CHAVE_DE_ACESSO
aws_secret_access_key = SUA_CHAVE_SECRETA_DE_ACESSO
EOF

# Configure as definições AWS
cat > ~/.aws/config <<EOF
[default]
region = auto
output = json
EOF

# Para S3 não-AWS (como Cloudflare R2), adicione a URL do endpoint
echo "endpoint_url = SUA_URL_DO_ENDPOINT_S3" >> ~/.aws/config
```
### Configurar Tarefas Cron de Backup {#set-up-backup-cron-jobs}

```bash
# Tornar scripts de backup executáveis
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-mongo.sh"
chmod +x "$ROOT_DIR/self-hosting/scripts/backup-redis.sh"

# Adicionar tarefa cron de backup do MongoDB (executa diariamente à meia-noite)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Adicionar tarefa cron de backup do Redis (executa diariamente à meia-noite)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verificar se as tarefas cron foram adicionadas
crontab -l
```


## Configuração de Atualização Automática {#auto-update-configuration}

Configure atualizações automáticas para sua instalação do Forward Email:

```bash
# Criar comando de autoatualização (use o comando docker compose apropriado)
if command -v docker-compose &> /dev/null; then
    DOCKER_UPDATE_CMD="docker-compose -f $DOCKER_COMPOSE_FILE pull && docker-compose -f $DOCKER_COMPOSE_FILE up -d"
else
    DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"
fi

# Adicionar tarefa cron de autoatualização (executa diariamente às 1h)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verificar se a tarefa cron foi adicionada
crontab -l
```


## Considerações Específicas para Debian {#debian-specific-considerations}

### Diferenças no Gerenciamento de Pacotes {#package-management-differences}

* **Snapd**: Não instalado por padrão no Debian, requer instalação manual
* **Docker**: Usa repositórios e chaves GPG específicos do Debian
* **UFW**: Pode não estar incluído em instalações mínimas do Debian
* **systemd**: O comportamento pode diferir ligeiramente do Ubuntu

### Gerenciamento de Serviços {#service-management}

```bash
# Verificar status dos serviços (comandos específicos do Debian)
systemctl status snapd
systemctl status docker
systemctl status ufw

# Reiniciar serviços se necessário
systemctl restart snapd
systemctl restart docker
```

### Configuração de Rede {#network-configuration}

O Debian pode ter nomes ou configurações de interfaces de rede diferentes:

```bash
# Verificar interfaces de rede
ip addr show

# Verificar roteamento
ip route show

# Verificar resolução DNS
nslookup google.com
```


## Manutenção e Monitoramento {#maintenance-and-monitoring}

### Locais dos Logs {#log-locations}

* **Logs do Docker Compose**: Use o comando docker compose apropriado conforme a instalação
* **Logs do sistema**: `/var/log/syslog`
* **Logs de backup**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logs de autoatualização**: `/var/log/autoupdate.log`
* **Logs do Snapd**: `journalctl -u snapd`

### Tarefas Regulares de Manutenção {#regular-maintenance-tasks}

1. **Monitorar espaço em disco**: `df -h`
2. **Verificar status dos serviços**: Use o comando docker compose apropriado
3. **Revisar logs**: Verifique tanto os logs da aplicação quanto do sistema
4. **Atualizar pacotes do sistema**: `apt update && apt upgrade`
5. **Monitorar snapd**: `snap list` e `snap refresh`

### Renovação de Certificados {#certificate-renewal}

Os certificados devem renovar automaticamente, mas você pode renovar manualmente se necessário:

```bash
# Renovação manual de certificados
certbot renew

# Copiar certificados renovados
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Reiniciar serviços para usar os novos certificados
if command -v docker-compose &> /dev/null; then
    docker-compose -f "$DOCKER_COMPOSE_FILE" restart
else
    docker compose -f "$DOCKER_COMPOSE_FILE" restart
fi
```


## Solução de Problemas {#troubleshooting}

### Problemas Específicos do Debian {#debian-specific-issues}

#### 1. Snapd Não Está Funcionando {#1-snapd-not-working}

```bash
# Verificar status do snapd
systemctl status snapd

# Reiniciar snapd
systemctl restart snapd

# Verificar caminho do snap
echo $PATH | grep snap

# Adicionar snap ao PATH se estiver faltando
echo 'export PATH=$PATH:/snap/bin' >> ~/.bashrc
source ~/.bashrc
```

#### 2. Comando Docker Compose Não Encontrado {#2-docker-compose-command-not-found}

```bash
# Verificar qual comando docker compose está disponível
command -v docker-compose
command -v docker

# Usar o comando apropriado nos scripts
if command -v docker-compose &> /dev/null; then
    echo "Usando docker-compose"
else
    echo "Usando docker compose"
fi
```
#### 3. Problemas na Instalação de Pacotes {#3-package-installation-issues}

```bash
# Atualizar cache de pacotes
apt update

# Corrigir pacotes quebrados
apt --fix-broken install

# Verificar pacotes retidos
apt-mark showhold
```

### Problemas Comuns {#common-issues}

#### 1. Serviço Docker Não Inicia {#1-docker-service-wont-start}

```bash
# Verificar status do Docker
systemctl status docker

# Verificar logs do Docker
journalctl -u docker

# Tentar inicialização alternativa
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Falha na Geração de Certificado {#2-certificate-generation-fails}

* Certifique-se de que as portas 80 e 443 estão acessíveis
* Verifique se os registros DNS apontam para seu servidor
* Confira as configurações do firewall com `ufw status`

#### 3. Problemas na Entrega de Email {#3-email-delivery-issues}

* Verifique se os registros MX estão corretos
* Confira os registros SPF, DKIM e DMARC
* Assegure que a porta 25 não está bloqueada pelo seu provedor de hospedagem

### Obtendo Ajuda {#getting-help}

* **Documentação**: <https://forwardemail.net/self-hosted>
* **Issues no GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Documentação Debian**: <https://www.debian.org/doc/>


## Melhores Práticas de Segurança {#security-best-practices}

1. **Mantenha o Sistema Atualizado**: Atualize regularmente o Debian e os pacotes
2. **Monitore Logs**: Configure monitoramento e alertas de logs
3. **Faça Backups Regulares**: Teste procedimentos de backup e restauração
4. **Use Senhas Fortes**: Gere senhas fortes para todas as contas
5. **Ative o Fail2Ban**: Considere instalar o fail2ban para segurança adicional
6. **Auditorias de Segurança Regulares**: Revise periodicamente sua configuração
7. **Monitore o Snapd**: Mantenha os pacotes snap atualizados com `snap refresh`


## Conclusão {#conclusion}

Sua instalação self-hosted do Forward Email deve agora estar completa e rodando no Debian. Lembre-se de:

1. Configurar corretamente seus registros DNS
2. Testar o envio e recebimento de emails
3. Configurar backups regulares
4. Monitorar seu sistema regularmente
5. Manter sua instalação atualizada
6. Monitorar o snapd e os pacotes snap

As principais diferenças em relação ao Ubuntu são a instalação do snapd e a configuração do repositório Docker. Uma vez que estes estejam configurados corretamente, o aplicativo Forward Email se comporta de forma idêntica em ambos os sistemas.

Para opções adicionais de configuração e recursos avançados, consulte a documentação oficial do Forward Email em <https://forwardemail.net/self-hosted#configuration>.
