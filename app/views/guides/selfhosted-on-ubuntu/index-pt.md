# Guia de Instalação de Auto-Hospedagem do Forward Email para Ubuntu {#forward-email-self-hosting-installation-guide-for-ubuntu}


## Índice {#table-of-contents}

* [Visão Geral](#overview)
* [Pré-requisitos](#prerequisites)
* [Requisitos do Sistema](#system-requirements)
* [Instalação Passo a Passo](#step-by-step-installation)
  * [Passo 1: Configuração Inicial do Sistema](#step-1-initial-system-setup)
  * [Passo 2: Configurar Resolvedores DNS](#step-2-configure-dns-resolvers)
  * [Passo 3: Instalar Dependências do Sistema](#step-3-install-system-dependencies)
  * [Passo 4: Instalar Pacotes Snap](#step-4-install-snap-packages)
  * [Passo 5: Instalar Docker](#step-5-install-docker)
  * [Passo 6: Configurar Serviço Docker](#step-6-configure-docker-service)
  * [Passo 7: Configurar Firewall](#step-7-configure-firewall)
  * [Passo 8: Clonar Repositório do Forward Email](#step-8-clone-forward-email-repository)
  * [Passo 9: Configurar Ambiente](#step-9-set-up-environment-configuration)
  * [Passo 10: Configurar Seu Domínio](#step-10-configure-your-domain)
  * [Passo 11: Gerar Certificados SSL](#step-11-generate-ssl-certificates)
  * [Passo 12: Gerar Chaves de Criptografia](#step-12-generate-encryption-keys)
  * [Passo 13: Atualizar Caminhos SSL na Configuração](#step-13-update-ssl-paths-in-configuration)
  * [Passo 14: Configurar Autenticação Básica](#step-14-set-up-basic-authentication)
  * [Passo 15: Implantar com Docker Compose](#step-15-deploy-with-docker-compose)
  * [Passo 16: Verificar Instalação](#step-16-verify-installation)
* [Configuração Pós-Instalação](#post-installation-configuration)
  * [Configuração de Registros DNS](#dns-records-setup)
  * [Primeiro Login](#first-login)
* [Configuração de Backup](#backup-configuration)
  * [Configurar Backup Compatível com S3](#set-up-s3-compatible-backup)
  * [Configurar Tarefas Cron de Backup](#set-up-backup-cron-jobs)
* [Configuração de Atualização Automática](#auto-update-configuration)
* [Manutenção e Monitoramento](#maintenance-and-monitoring)
  * [Locais dos Logs](#log-locations)
  * [Tarefas Regulares de Manutenção](#regular-maintenance-tasks)
  * [Renovação de Certificados](#certificate-renewal)
* [Solução de Problemas](#troubleshooting)
  * [Problemas Comuns](#common-issues)
  * [Obter Ajuda](#getting-help)
* [Melhores Práticas de Segurança](#security-best-practices)
* [Conclusão](#conclusion)


## Visão Geral {#overview}

Este guia fornece instruções passo a passo para instalar a solução auto-hospedada do Forward Email em sistemas Ubuntu. Este guia é especificamente direcionado para as versões Ubuntu 20.04, 22.04 e 24.04 LTS.


## Pré-requisitos {#prerequisites}

Antes de iniciar a instalação, certifique-se de que você possui:

* **Servidor Ubuntu**: 20.04, 22.04 ou 24.04 LTS
* **Acesso Root**: Você deve ser capaz de executar comandos como root (acesso sudo)
* **Nome de Domínio**: Um domínio que você controla com acesso à gestão de DNS
* **Servidor Limpo**: Recomenda-se usar uma instalação Ubuntu nova
* **Conexão com a Internet**: Necessária para baixar pacotes e imagens Docker


## Requisitos do Sistema {#system-requirements}

* **RAM**: Mínimo 2GB (4GB recomendado para produção)
* **Armazenamento**: Mínimo 20GB de espaço disponível (50GB+ recomendado para produção)
* **CPU**: 1 vCPU mínimo (2+ vCPUs recomendado para produção)
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

### Passo 2: Configurar Resolvedores DNS {#step-2-configure-dns-resolvers}

Configure seu sistema para usar os servidores DNS da Cloudflare para geração confiável de certificados:

```bash
# Parar e desabilitar systemd-resolved se estiver em execução
if systemctl is-active --quiet systemd-resolved; then
    rm /etc/resolv.conf
    systemctl stop systemd-resolved
    systemctl disable systemd-resolved
    systemctl mask systemd-resolved
fi

# Configurar resolvedores DNS da Cloudflare
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
### Passo 3: Instalar Dependências do Sistema {#step-3-install-system-dependencies}

Instale os pacotes necessários para o Forward Email:

```bash
# Atualizar lista de pacotes
apt-get update -y

# Instalar dependências básicas
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    git \
    openssl \
    docker-compose \
    snapd
```

### Passo 4: Instalar Pacotes Snap {#step-4-install-snap-packages}

Instale AWS CLI e Certbot via snap:

```bash
# Instalar AWS CLI
snap install aws-cli --classic

# Instalar Certbot e plugin DNS
snap install certbot --classic
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-cloudflare
```

### Passo 5: Instalar Docker {#step-5-install-docker}

Instale Docker CE e Docker Compose:

```bash
# Adicionar chave GPG oficial do Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | tee /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc

# Adicionar repositório Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list

# Atualizar índice de pacotes e instalar Docker
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verificar instalação do Docker
docker --version
docker compose version
```

### Passo 6: Configurar Serviço Docker {#step-6-configure-docker-service}

Garanta que o Docker inicie automaticamente e esteja em execução:

```bash
# Habilitar e iniciar serviço Docker
systemctl unmask docker
systemctl enable docker
systemctl start docker

# Verificar se o Docker está em execução
docker info
```

Se o Docker falhar ao iniciar, tente iniciá-lo manualmente:

```bash
# Método alternativo de inicialização se systemctl falhar
nohup dockerd >/dev/null 2>/dev/null &
sleep 5
docker info
```

### Passo 7: Configurar Firewall {#step-7-configure-firewall}

Configure o firewall UFW para proteger seu servidor:

```bash
# Definir políticas padrão
ufw default deny incoming
ufw default allow outgoing

# Permitir SSH (importante - não se trave para fora!)
ufw allow 22/tcp

# Permitir portas relacionadas a email
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

# Permitir conexões locais ao banco de dados
ufw allow from 127.0.0.1 to any port 27017  # MongoDB
ufw allow from 127.0.0.1 to any port 6379   # Redis

# Ativar firewall
echo "y" | ufw enable

# Verificar status do firewall
ufw status numbered
```

### Passo 8: Clonar Repositório Forward Email {#step-8-clone-forward-email-repository}

Baixe o código-fonte do Forward Email:

```bash
# Definir variáveis
REPO_FOLDER_NAME="forwardemail.net"
REPO_URL="https://github.com/forwardemail/forwardemail.net.git"
ROOT_DIR="/root/$REPO_FOLDER_NAME"

# Clonar o repositório
git clone "$REPO_URL" "$ROOT_DIR"
cd "$ROOT_DIR"

# Verificar se o clone foi bem-sucedido
ls -la
```

### Passo 9: Configurar Arquivo de Ambiente {#step-9-set-up-environment-configuration}

Prepare a configuração do ambiente:

```bash
# Definir variáveis de diretório
SELF_HOST_DIR="$ROOT_DIR/self-hosting"
ENV_FILE_DEFAULTS=".env.defaults"
ENV_FILE=".env"

# Copiar arquivo de ambiente padrão
cp "$ROOT_DIR/$ENV_FILE_DEFAULTS" "$SELF_HOST_DIR/$ENV_FILE"

# Criar diretório SSL
mkdir -p "$SELF_HOST_DIR/ssl"

# Criar diretórios do banco de dados
mkdir -p "$SELF_HOST_DIR/sqlite-data"
mkdir -p "$SELF_HOST_DIR/mongo-backups"
mkdir -p "$SELF_HOST_DIR/redis-backups"
```

### Passo 10: Configurar Seu Domínio {#step-10-configure-your-domain}

Defina seu nome de domínio e atualize as variáveis de ambiente:

```bash
# Substitua 'yourdomain.com' pelo seu domínio real
DOMAIN="yourdomain.com"

# Função para atualizar arquivo de ambiente
update_env_file() {
  local key="$1"
  local value="$2"

  if grep -qE "^${key}=" "$SELF_HOST_DIR/$ENV_FILE"; then
    sed -i -E "s|^${key}=.*|${key}=${value}|" "$SELF_HOST_DIR/$ENV_FILE"
  else
    echo "${key}=${value}" >> "$SELF_HOST_DIR/$ENV_FILE"
  fi
}

# Atualizar variáveis de ambiente relacionadas ao domínio
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
### Passo 11: Gerar Certificados SSL {#step-11-generate-ssl-certificates}

#### Opção A: Desafio DNS Manual (Recomendado para a maioria dos usuários) {#option-a-manual-dns-challenge-recommended-for-most-users}

```bash
# Gerar certificados usando desafio DNS manual
certbot certonly \
  --manual \
  --agree-tos \
  --preferred-challenges dns \
  -d "*.$DOMAIN" \
  -d "$DOMAIN"
```

**Importante**: Quando solicitado, você precisará criar registros TXT no seu DNS. Você pode ver múltiplos desafios para o mesmo domínio - **crie TODOS eles**. Não remova o primeiro registro TXT ao adicionar o segundo.

#### Opção B: DNS Cloudflare (Se você usa Cloudflare) {#option-b-cloudflare-dns-if-you-use-cloudflare}

Se seu domínio usa Cloudflare para DNS, você pode automatizar a geração de certificados:

```bash
# Criar arquivo de credenciais do Cloudflare
cat > /root/.cloudflare.ini <<EOF
dns_cloudflare_email = "your-email@example.com"
dns_cloudflare_api_key = "your-cloudflare-global-api-key"
EOF

# Definir permissões adequadas
chmod 600 /root/.cloudflare.ini

# Gerar certificados automaticamente
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
# Copiar certificados para o diretório SSL da aplicação
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Verificar se os certificados foram copiados
ls -la "$SELF_HOST_DIR/ssl/"
```

### Passo 12: Gerar Chaves de Criptografia {#step-12-generate-encryption-keys}

Crie as várias chaves de criptografia necessárias para a operação segura:

```bash
# Gerar chave de criptografia auxiliar
helper_encryption_key=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "HELPER_ENCRYPTION_KEY" "$helper_encryption_key"

# Gerar segredo SRS para encaminhamento de email
srs_secret=$(openssl rand -base64 32 | tr -d /=+ | cut -c -32)
update_env_file "SRS_SECRET" "$srs_secret"

# Gerar chave de criptografia TXT
txt_encryption_key=$(openssl rand -hex 16)
update_env_file "TXT_ENCRYPTION_KEY" "$txt_encryption_key"

# Gerar chave privada DKIM para assinatura de email
openssl genrsa -f4 -out "$SELF_HOST_DIR/ssl/dkim.key" 2048
update_env_file "DKIM_PRIVATE_KEY_PATH" "/app/ssl/dkim.key"

# Gerar chave de assinatura para webhook
webhook_signature_key=$(openssl rand -hex 16)
update_env_file "WEBHOOK_SIGNATURE_KEY" "$webhook_signature_key"

# Definir senha do transporte SMTP
update_env_file "SMTP_TRANSPORT_PASS" "$(openssl rand -base64 32)"

echo "✅ Todas as chaves de criptografia geradas com sucesso"
```

### Passo 13: Atualizar Caminhos SSL na Configuração {#step-13-update-ssl-paths-in-configuration}

Configure os caminhos dos certificados SSL no arquivo de ambiente:

```bash
# Atualizar caminhos SSL para apontar para os arquivos corretos do certificado
sed -i -E \
  -e 's|^(.*_)?SSL_KEY_PATH=.*|\1SSL_KEY_PATH=/app/ssl/privkey.pem|' \
  -e 's|^(.*_)?SSL_CERT_PATH=.*|\1SSL_CERT_PATH=/app/ssl/fullchain.pem|' \
  -e 's|^(.*_)?SSL_CA_PATH=.*|\1SSL_CA_PATH=/app/ssl/chain.pem|' \
  "$SELF_HOST_DIR/$ENV_FILE"
```

### Passo 14: Configurar Autenticação Básica {#step-14-set-up-basic-authentication}

Crie credenciais temporárias para autenticação básica:

```bash
# Gerar uma senha aleatória segura
PASSWORD=$(openssl rand -base64 16)

# Atualizar arquivo de ambiente com credenciais de autenticação básica
update_env_file "AUTH_BASIC_USERNAME" "admin"
update_env_file "AUTH_BASIC_PASSWORD" "$PASSWORD"

# Exibir credenciais (salve estas!)
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

### Passo 15: Implantar com Docker Compose {#step-15-deploy-with-docker-compose}

Inicie todos os serviços do Forward Email:

```bash
# Definir caminho do arquivo Docker Compose
DOCKER_COMPOSE_FILE="$SELF_HOST_DIR/docker-compose-self-hosted.yml"

# Parar quaisquer containers existentes
docker compose -f "$DOCKER_COMPOSE_FILE" down

# Baixar as imagens mais recentes
docker compose -f "$DOCKER_COMPOSE_FILE" pull

# Iniciar todos os serviços em modo destacado
docker compose -f "$DOCKER_COMPOSE_FILE" up -d

# Aguarde um momento para os serviços iniciarem
sleep 10

# Verificar status dos serviços
docker compose -f "$DOCKER_COMPOSE_FILE" ps
```
### Passo 16: Verificar Instalação {#step-16-verify-installation}

Verifique se todos os serviços estão funcionando corretamente:

```bash
# Verificar containers Docker
docker ps

# Verificar logs dos serviços para quaisquer erros
docker compose -f "$DOCKER_COMPOSE_FILE" logs --tail=50

# Testar conectividade da interface web
curl -I https://$DOMAIN

# Verificar se as portas estão escutando
netstat -tlnp | grep -E ':(25|80|443|465|587|993|995)'
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
# Extrair chave pública DKIM
openssl rsa -in "$SELF_HOST_DIR/ssl/dkim.key" -pubout -outform DER | openssl base64 -A
```

Crie o registro DKIM no DNS:

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
# Criar diretório de credenciais AWS
mkdir -p ~/.aws

# Configurar credenciais AWS
cat > ~/.aws/credentials <<EOF
[default]
aws_access_key_id = SUA_CHAVE_DE_ACESSO
aws_secret_access_key = SUA_CHAVE_SECRETA_DE_ACESSO
EOF

# Configurar definições AWS
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

# Adicionar tarefa cron para backup do MongoDB (executa diariamente à meia-noite)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-mongo.sh >> /var/log/mongo-backup.log 2>&1") | crontab -

# Adicionar tarefa cron para backup do Redis (executa diariamente à meia-noite)
(crontab -l 2>/dev/null; echo "0 0 * * * $ROOT_DIR/self-hosting/scripts/backup-redis.sh >> /var/log/redis-backup.log 2>&1") | crontab -

# Verificar se as tarefas cron foram adicionadas
crontab -l
```


## Configuração de Atualização Automática {#auto-update-configuration}

Configure atualizações automáticas para sua instalação do Forward Email:

```bash
# Criar comando de atualização automática
DOCKER_UPDATE_CMD="docker compose -f $DOCKER_COMPOSE_FILE pull && docker compose -f $DOCKER_COMPOSE_FILE up -d"

# Adicionar tarefa cron de atualização automática (executa diariamente às 1h)
(crontab -l 2>/dev/null; echo "0 1 * * * $DOCKER_UPDATE_CMD >> /var/log/autoupdate.log 2>&1") | crontab -

# Verificar se a tarefa cron foi adicionada
crontab -l
```


## Manutenção e Monitoramento {#maintenance-and-monitoring}

### Locais dos Logs {#log-locations}

* **Logs do Docker Compose**: `docker compose -f $DOCKER_COMPOSE_FILE logs`
* **Logs do sistema**: `/var/log/syslog`
* **Logs de backup**: `/var/log/mongo-backup.log`, `/var/log/redis-backup.log`
* **Logs de atualização automática**: `/var/log/autoupdate.log`

### Tarefas Regulares de Manutenção {#regular-maintenance-tasks}

1. **Monitorar espaço em disco**: `df -h`
2. **Verificar status dos serviços**: `docker compose -f $DOCKER_COMPOSE_FILE ps`
3. **Revisar logs**: `docker compose -f $DOCKER_COMPOSE_FILE logs --tail=100`
4. **Atualizar pacotes do sistema**: `apt update && apt upgrade`
5. **Renovar certificados**: Os certificados renovam automaticamente, mas monitore a expiração

### Renovação de Certificado {#certificate-renewal}

Os certificados devem renovar automaticamente, mas você pode renovar manualmente se necessário:

```bash
# Renovação manual de certificado
certbot renew

# Copiar certificados renovados
cp /etc/letsencrypt/live/$DOMAIN*/* "$SELF_HOST_DIR/ssl/"

# Reiniciar serviços para usar os novos certificados
docker compose -f "$DOCKER_COMPOSE_FILE" restart
```
## Solução de Problemas {#troubleshooting}

### Problemas Comuns {#common-issues}

#### 1. Serviço Docker Não Inicia {#1-docker-service-wont-start}

```bash
# Verificar status do Docker
systemctl status docker

# Tentar inicialização alternativa
nohup dockerd >/dev/null 2>/dev/null &
```

#### 2. Falha na Geração do Certificado {#2-certificate-generation-fails}

* Certifique-se de que as portas 80 e 443 estão acessíveis
* Verifique se os registros DNS apontam para seu servidor
* Confira as configurações do firewall

#### 3. Problemas na Entrega de Email {#3-email-delivery-issues}

* Verifique se os registros MX estão corretos
* Confira os registros SPF, DKIM e DMARC
* Certifique-se de que a porta 25 não está bloqueada pelo seu provedor de hospedagem

#### 4. Interface Web Não Acessível {#4-web-interface-not-accessible}

* Verifique as configurações do firewall: `ufw status`
* Verifique os certificados SSL: `openssl x509 -in $SELF_HOST_DIR/ssl/fullchain.pem -text -noout`
* Confira as credenciais de autenticação básica

### Obtendo Ajuda {#getting-help}

* **Documentação**: <https://forwardemail.net/self-hosted>
* **Issues no GitHub**: <https://github.com/forwardemail/forwardemail.net/issues>
* **Suporte da Comunidade**: Confira as discussões no GitHub do projeto


## Melhores Práticas de Segurança {#security-best-practices}

1. **Mantenha o Sistema Atualizado**: Atualize regularmente o Ubuntu e os pacotes
2. **Monitore Logs**: Configure monitoramento e alertas de logs
3. **Faça Backups Regulares**: Teste os procedimentos de backup e restauração
4. **Use Senhas Fortes**: Gere senhas fortes para todas as contas
5. **Ative o Fail2Ban**: Considere instalar o fail2ban para segurança adicional
6. **Auditorias de Segurança Regulares**: Revise periodicamente sua configuração


## Conclusão {#conclusion}

Sua instalação self-hosted do Forward Email deve agora estar completa e rodando no Ubuntu. Lembre-se de:

1. Configurar corretamente seus registros DNS
2. Testar o envio e recebimento de emails
3. Configurar backups regulares
4. Monitorar seu sistema regularmente
5. Manter sua instalação atualizada

Para opções adicionais de configuração e recursos avançados, consulte a documentação oficial do Forward Email em <https://forwardemail.net/self-hosted#configuration>.
