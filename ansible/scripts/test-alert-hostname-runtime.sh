#!/bin/bash
set -Eeuo pipefail

if [[ "$(id -u)" -ne 0 ]]; then
  printf '%s\n' 'Run this isolated hostname regression as root.' >&2
  exit 1
fi

if [[ -n "${SUDO_USER:-}" ]]; then
  SUDO_HOME=$(getent passwd "$SUDO_USER" | cut -d: -f6)
  if [[ -z "${ANSIBLE_COLLECTIONS_PATH:-}" &&
    -d "$SUDO_HOME/.ansible/collections" ]]; then
    export ANSIBLE_COLLECTIONS_PATH="$SUDO_HOME/.ansible/collections:/usr/share/ansible/collections"
  fi
  if [[ -z "${ANSIBLE_ROLES_PATH:-}" && -d "$SUDO_HOME/.ansible/roles" ]]; then
    export ANSIBLE_ROLES_PATH="$SUDO_HOME/.ansible/roles:/usr/share/ansible/roles:/etc/ansible/roles"
  fi
fi

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
TEST_ROOT=$(mktemp -d /tmp/forwardemail-hostname-runtime.XXXXXX)
INVENTORY=${1:-$TEST_ROOT/inventory.yml}
ORIGINAL_HOSTNAME=$(hostname)
ORIGINAL_ETC_HOSTNAME=$(cat /etc/hostname)
ORIGINAL_ETC_HOSTNAME_HASH=$(sha256sum /etc/hostname | awk '{print $1}')
ORIGINAL_ETC_HOSTS=$(cat /etc/hosts)
ORIGINAL_ETC_HOSTS_HASH=$(sha256sum /etc/hosts | awk '{print $1}')

cleanup() {
  local rc=$?
  local isolation_failed=false
  trap - EXIT
  if [[ "$(hostname)" != "$ORIGINAL_HOSTNAME" ]]; then
    isolation_failed=true
    hostname "$ORIGINAL_HOSTNAME" || true
    printf '%s\n' 'FAIL: hostname escaped the UTS namespace and was restored' >&2
  fi
  if [[ "$(sha256sum /etc/hostname | awk '{print $1}')" != \
    "$ORIGINAL_ETC_HOSTNAME_HASH" ]]; then
    isolation_failed=true
    printf '%s\n' "$ORIGINAL_ETC_HOSTNAME" > /etc/hostname
    printf '%s\n' 'FAIL: /etc/hostname escaped the mount namespace and was restored' >&2
  fi
  if [[ "$(sha256sum /etc/hosts | awk '{print $1}')" != \
    "$ORIGINAL_ETC_HOSTS_HASH" ]]; then
    isolation_failed=true
    printf '%s\n' "$ORIGINAL_ETC_HOSTS" > /etc/hosts
    printf '%s\n' 'FAIL: /etc/hosts escaped the mount namespace and was restored' >&2
  fi
  if [[ "${DEBUG_KEEP_TEST_ROOT:-0}" == 1 && "$rc" -ne 0 ]]; then
    printf 'DEBUG: preserved test root at %s\n' "$TEST_ROOT" >&2
  else
    rm -rf "$TEST_ROOT"
  fi
  if [[ "$isolation_failed" == true ]]; then
    exit 1
  fi
  exit "$rc"
}
trap cleanup EXIT

cat > "$INVENTORY" <<'EOF_INVENTORY'
all:
  vars:
    ansible_connection: local
    ansible_host: localhost
  children:
    mongo:
      hosts:
        mongo.forwardemail.net:
    logs:
      hosts:
        logs.forwardemail.net:
    redis:
      hosts:
        redis.forwardemail.net:
    bree:
      hosts:
        bree.forwardemail.net:
    web:
      hosts:
        web-dp-dv-co:
    api:
      hosts:
        api.forwardemail.net:
    caldav:
      hosts:
        caldav.forwardemail.net:
    carddav:
      hosts:
        carddav.forwardemail.net:
    imap:
      hosts:
        imap.forwardemail.net:
    mx1:
      hosts:
        mx1.forwardemail.net:
    mx2:
      hosts:
        mx2.forwardemail.net:
    pop3:
      hosts:
        pop3.forwardemail.net:
    smtp:
      hosts:
        smtp.forwardemail.net:
    sqlite:
      hosts:
        sqlite.forwardemail.net:
EOF_INVENTORY

install -d -m 0700 "$TEST_ROOT/bin"
cat > "$TEST_ROOT/bin/hostnamectl" <<'EOF_HOSTNAMECTL'
#!/bin/bash
set -Eeuo pipefail
case "$*" in
  '--transient status')
    hostname
    ;;
  '--static status')
    cat /etc/hostname
    ;;
  '--transient set-hostname '*)
    hostname "${*: -1}"
    ;;
  '--pretty --static set-hostname '*)
    printf '%s\n' "${*: -1}" > /etc/hostname
    ;;
  *)
    printf 'Unexpected hostnamectl arguments: %s\n' "$*" >&2
    exit 64
    ;;
esac
EOF_HOSTNAMECTL
chmod 0755 "$TEST_ROOT/bin/hostnamectl"

run_case() {
  local play=$1 limit=$2 target=$3 stale=$4
  local case_name="${play}-${limit}"
  local first_log="$TEST_ROOT/$case_name-first.log"
  local second_log="$TEST_ROOT/$case_name-second.log"
  local hostname_file="$TEST_ROOT/$case_name-hostname"
  local hosts_file="$TEST_ROOT/$case_name-hosts"
  printf '%s\n' "$stale" > "$hostname_file"
  cat > "$hosts_file" <<EOF_HOSTS
127.0.0.1 localhost
127.0.1.1 provider-ptr.example.invalid $target
::1 localhost ip6-localhost ip6-loopback
EOF_HOSTS

  env \
    ANSIBLE_CONFIG="$REPO_ROOT/ansible.cfg" \
    MONGO_HOST='mongo.forwardemail.net' \
    MONGO_NAME='test' \
    MONGO_PASS='test' \
    MONGO_PORT='27017' \
    MONGO_USER='test' \
    LOGS_HOST='logs.forwardemail.net' \
    LOGS_NAME='test' \
    LOGS_PASS='test' \
    LOGS_PORT='27017' \
    LOGS_USER='test' \
    REDIS_HOST='redis.forwardemail.net' \
    REDIS_PASSWORD='test' \
    REDIS_PORT='6380' \
    BREE_HOST='bree.forwardemail.net' \
    WEB_HOST='forwardemail.net' \
    API_HOST='api.forwardemail.net' \
    CALDAV_HOST='caldav.forwardemail.net' \
    CARDDAV_HOST='carddav.forwardemail.net' \
    IMAP_HOST='imap.forwardemail.net' \
    MX1_HOST='mx1.forwardemail.net' \
    MX2_HOST='mx2.forwardemail.net' \
    POP3_HOST='pop3.forwardemail.net' \
    SMTP_HOST='smtp.forwardemail.net' \
    SQLITE_HOST='sqlite.forwardemail.net' \
    SSL_CERT_PATH='/tmp/cert' \
    SSL_KEY_PATH='/tmp/key' \
    SSL_CA_PATH='/tmp/ca' \
    AWS_ACCESS_KEY_ID='test' \
    AWS_SECRET_ACCESS_KEY='test' \
    AWS_ENDPOINT_URL='https://example.invalid' \
    BACKUP_SECRET='test' \
    TEST_REPO_ROOT="$REPO_ROOT" \
    TEST_INVENTORY="$INVENTORY" \
    TEST_PLAY="$play" \
    TEST_LIMIT="$limit" \
    TEST_TARGET="$target" \
    TEST_STALE="$stale" \
    TEST_HOSTNAME_FILE="$hostname_file" \
    TEST_HOSTS_FILE="$hosts_file" \
    TEST_MOCK_BIN="$TEST_ROOT/bin" \
    TEST_FIRST_LOG="$first_log" \
    TEST_SECOND_LOG="$second_log" \
    unshare --uts --mount --fork /bin/bash <<'EOF_NAMESPACE'
set -Eeuo pipefail
mount --make-rprivate /
mount -t tmpfs -o mode=0755 tmpfs /run/systemd
mkdir -p /run/systemd/system
mount --bind "$TEST_HOSTNAME_FILE" /etc/hostname
mount --bind "$TEST_HOSTS_FILE" /etc/hosts
export PATH="$TEST_MOCK_BIN:$PATH"
hostname "$TEST_STALE"
[[ "$(hostname)" == "$TEST_STALE" ]]

common_args=(
  -i "$TEST_INVENTORY"
  "$TEST_REPO_ROOT/ansible/playbooks/$TEST_PLAY.yml"
  --limit "$TEST_LIMIT"
  --tags forwardemail-alert-hostname
  -e input_key=/tmp/key
  -e input_cert=/tmp/cert
  -e input_ca=/tmp/ca
)
ansible-playbook "${common_args[@]}" > "$TEST_FIRST_LOG"
[[ "$(hostname)" == "$TEST_TARGET" ]]
[[ "$(python3 -c 'import socket; print(socket.getfqdn())')" == \
  'provider-ptr.example.invalid' ]]
ansible-playbook "${common_args[@]}" > "$TEST_SECOND_LOG"
[[ "$(hostname)" == "$TEST_TARGET" ]]
[[ "$(python3 -c 'import socket; print(socket.getfqdn())')" == \
  'provider-ptr.example.invalid' ]]
EOF_NAMESPACE

  grep -Fq 'Set hostname before security identity discovery' "$first_log"
  grep -Fq "Verify this server's alert hostname" "$first_log"
  grep -Fq 'Verify saved alert hostname matches this server' "$first_log"
  grep -Eq 'changed=[1-9][0-9]*' "$first_log"
  grep -Fq 'changed=0' "$second_log"
  grep -Fq 'failed=0' "$first_log"
  grep -Fq 'failed=0' "$second_log"
  printf 'PASS: %s/%s converged %s to %s, ignored conflicting provider PTR, and remained idempotent\n' \
    "$play" "$limit" "$stale" "$target"
}

run_case mongo mongo mongo.forwardemail.net redis.forwardemail.net
run_case logs logs logs.forwardemail.net mongo.forwardemail.net
run_case redis redis redis.forwardemail.net mongo.forwardemail.net
run_case bree bree bree.forwardemail.net redis.forwardemail.net
run_case http web forwardemail.net redis.forwardemail.net
run_case http api api.forwardemail.net redis.forwardemail.net
run_case http caldav caldav.forwardemail.net redis.forwardemail.net
run_case http carddav carddav.forwardemail.net redis.forwardemail.net
run_case imap imap imap.forwardemail.net redis.forwardemail.net
run_case mx1 mx1 mx1.forwardemail.net redis.forwardemail.net
run_case mx2 mx2 mx2.forwardemail.net redis.forwardemail.net
run_case pop3 pop3 pop3.forwardemail.net redis.forwardemail.net
run_case smtp smtp smtp.forwardemail.net redis.forwardemail.net
run_case sqlite sqlite sqlite.forwardemail.net redis.forwardemail.net

printf '%s\n' \
  'PASS: every database and PM2 alert host rejects stale cross-host identity and provider PTR substitution before Postfix, SPF, or SMS routing use'
