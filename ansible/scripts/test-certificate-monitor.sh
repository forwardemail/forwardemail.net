#!/bin/bash
# Runs ansible/playbooks/files/ssl-certificate-monitor.sh against real
# certificates, OpenPGP keys and local TLS services made for the test, with a
# stub in place of the email sender. Needs openssl, gpg, ss and node.
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
MONITOR=${1:-$SCRIPT_DIR/../playbooks/files/ssl-certificate-monitor.sh}
TEST_ROOT=$(mktemp -d /tmp/forwardemail-certificate-monitor-test.XXXXXX)
PIDS=()

cleanup() {
  local pid
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  [[ -z "${GPG_HOME:-}" ]] || gpgconf --homedir "$GPG_HOME" --kill all 2>/dev/null || true
  if [[ -n "${KEEP_TEST_ROOT:-}" ]]; then
    printf 'Kept %s\n' "$TEST_ROOT" >&2
  else
    rm -rf "$TEST_ROOT"
  fi
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

for tool in openssl gpg ss node; do
  command -v "$tool" >/dev/null || fail "$tool is required"
done

CA_DIR="$TEST_ROOT/ca"
BIN="$TEST_ROOT/bin"
OUT="$TEST_ROOT/out"
mkdir -p "$CA_DIR/new" "$BIN" "$OUT"
: > "$CA_DIR/index.txt"
printf '1000\n' > "$CA_DIR/serial"

cat > "$CA_DIR/ca.cnf" <<EOF
[ ca ]
default_ca = test_ca

[ test_ca ]
dir = $CA_DIR
database = \$dir/index.txt
new_certs_dir = \$dir/new
serial = \$dir/serial
default_md = sha256
policy = any_name
unique_subject = no
copy_extensions = none

[ any_name ]
commonName = supplied

[ root_ca ]
basicConstraints = critical, CA:TRUE
keyUsage = critical, keyCertSign, cRLSign
EOF

openssl req -x509 -newkey rsa:2048 -nodes -days 3650 -subj '/CN=Monitor Test CA' \
  -keyout "$CA_DIR/ca.key" -out "$CA_DIR/ca.crt" 2>/dev/null

utc() {
  date -u -d "$1" +%Y%m%d%H%M%SZ
}

# A certificate for CN, valid from START until END (date -d expressions)
issue() {
  local name="$1" start="$2" end="$3"
  openssl req -newkey rsa:2048 -nodes -subj "/CN=$name" \
    -keyout "$OUT/$name.key" -out "$OUT/$name.csr" 2>/dev/null
  openssl ca -batch -notext -config "$CA_DIR/ca.cnf" \
    -cert "$CA_DIR/ca.crt" -keyfile "$CA_DIR/ca.key" \
    -startdate "$(utc "$start")" -enddate "$(utc "$end")" \
    -in "$OUT/$name.csr" -out "$OUT/$name.crt" 2>/dev/null
}

issue site-ok '-1 day' '+200 days'
issue apns-mail-critical '-1 day' '+3 days'
issue database-expired '-60 days' '-2 days'
issue imap-warning '-1 day' '+20 days'
issue smtp-critical '-1 day' '+5 days'
issue web-expired '-60 days' '-1 day'

# A root that expired and is still in the CA bundle
openssl req -new -newkey rsa:2048 -nodes -subj '/CN=Old Test Root' \
  -keyout "$OUT/old-root.key" -out "$OUT/old-root.csr" 2>/dev/null
openssl ca -batch -notext -selfsign -config "$CA_DIR/ca.cnf" -extensions root_ca \
  -keyfile "$OUT/old-root.key" -startdate "$(utc '-3 years')" -enddate "$(utc '-1 year')" \
  -in "$OUT/old-root.csr" -out "$OUT/old-root.crt" 2>/dev/null
cat "$CA_DIR/ca.crt" "$OUT/old-root.crt" > "$OUT/ca-bundle.pem"

# The full chain, as .ssl-cert holds it
cat "$OUT/site-ok.crt" "$CA_DIR/ca.crt" > "$OUT/site-chain.pem"
# A DER certificate
openssl x509 -in "$OUT/database-expired.crt" -outform der -out "$OUT/database.der"

# OpenPGP keys
GPG_HOME="$TEST_ROOT/gnupg"
mkdir -m 0700 "$GPG_HOME"
gpg_batch() {
  gpg --homedir "$GPG_HOME" --batch --no-tty --pinentry-mode loopback --passphrase '' "$@" 2>/dev/null
}
fingerprint() {
  gpg --homedir "$GPG_HOME" --batch --with-colons --list-keys "$1" 2>/dev/null |
    awk -F: '/^fpr:/ { print $10; exit }'
}

# security.txt key: signs and certifies, expires in 20 days
gpg_batch --quick-gen-key 'Security Test <security@example.com>' ed25519 'cert,sign' 20d
SECURITY_FPR=$(fingerprint security@example.com)
gpg_batch --armor --export-secret-keys "$SECURITY_FPR" > "$OUT/security.gpg-security-key"

# A key that never expires, whose first signing subkey expired in 2020 and was
# replaced: nothing to report
gpg_batch --faked-system-time '20200101T000000!' --quick-gen-key 'Rotated Test <rotated@example.com>' ed25519 cert never
ROTATED_FPR=$(fingerprint rotated@example.com)
gpg_batch --faked-system-time '20200102T000000!' --quick-add-key "$ROTATED_FPR" ed25519 sign 1d
gpg_batch --quick-add-key "$ROTATED_FPR" ed25519 sign never
gpg_batch --armor --export-secret-keys "$ROTATED_FPR" > "$OUT/rotated.gpg-security-key"

# A revoked key
gpg_batch --quick-gen-key 'Revoked Test <revoked@example.com>' ed25519 'cert,sign' 1y
REVOKED_FPR=$(fingerprint revoked@example.com)
sed 's/^:-----/-----/' "$GPG_HOME/openpgp-revocs.d/$REVOKED_FPR.rev" > "$OUT/revoke.asc"
gpg_batch --import "$OUT/revoke.asc"
gpg_batch --armor --export-secret-keys "$REVOKED_FPR" > "$OUT/revoked.gpg-security-key"

# The app's .env, with a reference as the env template writes them
ENV_FILE="$TEST_ROOT/app.env"
cat > "$ENV_FILE" <<EOF
SSL_CERT_PATH="$OUT/site-chain.pem"
SSL_CA_PATH="$OUT/ca-bundle.pem"
WEB_SSL_CERT_PATH={{{SSL_CERT_PATH}}}
API_SSL_CA_PATH={{SSL_CA_PATH}}
PROXY_SSL_CERT_PATH=$OUT/missing.pem
APNS_MAIL_CERT_PATH=$OUT/apns-mail-critical.crt
CALDAV_SSL_CERT_PATH=
GPG_SECURITY_KEY=$OUT/security.gpg-security-key
EOF

free_port() {
  node -e 'const s = require("net").createServer().listen(0, "127.0.0.1", () => { console.log(s.address().port); s.close(); });'
}

wait_for_port() {
  local port="$1" _
  for _ in $(seq 1 100); do
    if ss -Hltn "sport = :$port" | grep -q .; then
      return 0
    fi
    sleep 0.1
  done
  fail "nothing listens on port $port"
}

# Local services run from executables of their own, so the monitor checks
# these and no other process on the machine
cp "$(command -v openssl)" "$BIN/fakeimapd"
cp "$(command -v openssl)" "$BIN/fakewebd"
cp "$(readlink -f "$(command -v node)")" "$BIN/fakenoded"

IMAP_PORT=$(free_port)
"$BIN/fakeimapd" s_server -quiet -www -accept "$IMAP_PORT" \
  -cert "$OUT/imap-warning.crt" -key "$OUT/imap-warning.key" > /dev/null 2>&1 < /dev/null &
PIDS+=("$!")

WEB_PORT=$(free_port)
"$BIN/fakewebd" s_server -quiet -www -accept "$WEB_PORT" \
  -cert "$OUT/web-expired.crt" -key "$OUT/web-expired.key" > /dev/null 2>&1 < /dev/null &
PIDS+=("$!")

# SMTP that upgrades with STARTTLS
SMTP_PORT=$(free_port)
cat > "$TEST_ROOT/smtp.js" <<'EOF'
const fs = require('node:fs');
const net = require('node:net');
const tls = require('node:tls');

const [port, cert, key] = process.argv.slice(2);
net
  .createServer((socket) => {
    let buffer = '';
    const onData = (data) => {
      buffer += data;
      let index;
      while ((index = buffer.indexOf('\r\n')) !== -1) {
        const line = buffer.slice(0, index);
        buffer = buffer.slice(index + 2);
        if (/^(EHLO|HELO)/i.test(line)) {
          socket.write('250-test.example.com\r\n250 STARTTLS\r\n');
        } else if (/^STARTTLS/i.test(line)) {
          socket.removeListener('data', onData);
          socket.write('220 Ready to start TLS\r\n');
          const secure = new tls.TLSSocket(socket, {
            isServer: true,
            cert: fs.readFileSync(cert),
            key: fs.readFileSync(key)
          });
          secure.on('error', () => {});
          secure.on('data', () => {});
          return;
        } else if (/^QUIT/i.test(line)) {
          socket.end('221 Bye\r\n');
        } else {
          socket.write('250 OK\r\n');
        }
      }
    };

    socket.on('data', onData);
    socket.on('error', () => {});
    socket.write('220 test.example.com ESMTP\r\n');
  })
  .listen(Number(port), '127.0.0.1');
EOF
"$BIN/fakenoded" "$TEST_ROOT/smtp.js" "$SMTP_PORT" "$OUT/smtp-critical.crt" "$OUT/smtp-critical.key" &
PIDS+=("$!")

# PM2 cluster mode: the primary owns the port and is named "PM2 v5.3.0: God"
CLUSTER_PORT=$(free_port)
cat > "$TEST_ROOT/cluster.js" <<'EOF'
const cluster = require('node:cluster');
const fs = require('node:fs');
const tls = require('node:tls');

const [port, cert, key] = process.argv.slice(2);
if (cluster.isPrimary) {
  process.title = 'PM2 v5.3.0: God';
  const worker = cluster.fork();
  process.on('SIGTERM', () => {
    worker.kill();
    process.exit(0);
  });
} else {
  tls
    .createServer({ cert: fs.readFileSync(cert), key: fs.readFileSync(key) }, (socket) =>
      socket.end()
    )
    .listen(Number(port));
}
EOF
issue cluster-critical '-1 day' '+2 days'
"$BIN/fakenoded" "$TEST_ROOT/cluster.js" "$CLUSTER_PORT" "$OUT/cluster-critical.crt" "$OUT/cluster-critical.key" &
PIDS+=("$!")

wait_for_port "$IMAP_PORT"
wait_for_port "$WEB_PORT"
wait_for_port "$SMTP_PORT"
wait_for_port "$CLUSTER_PORT"
ss -Hltnp "sport = :$CLUSTER_PORT" | grep -q 'PM2 v5' ||
  fail "the cluster fixture does not look like PM2: $(ss -Hltnp "sport = :$CLUSTER_PORT")"

# Push certificates cached in Redis, as scripts/apn-cert-expiry.js prints
# them: Calendar is renewed when the cache expires; Contact is cached without
# an expiry and runs out in 5 days
NOW=$(date +%s)
cat > "$TEST_ROOT/apn-certs.txt" <<EOF
not a certificate line
APN_CERT	Calendar	$((NOW + 10 * 86400))	$((NOW + 5 * 86400))	CN=APSP:calendar-test
APN_CERT	Contact	$((NOW + 5 * 86400))	-1	CN=APSP:contact-test
EOF

# Records the alert instead of sending it
cat > "$BIN/sender" <<'EOF'
#!/bin/bash
set -Eeuo pipefail
count=0
[[ ! -s "$MOCK_ROOT/count" ]] || read -r count < "$MOCK_ROOT/count"
count=$((count + 1))
printf '%d\n' "$count" > "$MOCK_ROOT/count"
if [[ "$1" == --body-file ]]; then
  cp "$2" "$MOCK_ROOT/body.$count"
  shift 2
else
  printf '%s' "$3" > "$MOCK_ROOT/body.$count"
fi
[[ "$#" -ge 2 ]] || exit 64
printf '%s\n' "$1" > "$MOCK_ROOT/key.$count"
printf '%s\n' "$2" > "$MOCK_ROOT/subject.$count"
[[ ! -e "$MOCK_ROOT/fail" ]]
EOF
chmod 0755 "$BIN/sender"
MOCK_ROOT="$TEST_ROOT/mock"
mkdir -p "$MOCK_ROOT"
export MOCK_ROOT

LOCK_DIR="$TEST_ROOT/lock"
mkdir -p "$LOCK_DIR"

run_monitor() {
  set +e
  env -u WEB_URL \
    CERT_MONITOR_LOG="$TEST_ROOT/monitor.log" \
    CERT_MONITOR_LOCK_DIR="$LOCK_DIR" \
    CERT_MONITOR_SENDER="$BIN/sender" \
    CERT_MONITOR_ENV_FILE="$ENV_FILE" \
    CERT_MONITOR_KNOWN_PATHS="$OUT/database.der $TEST_ROOT/not-deployed.pem" \
    CERT_MONITOR_PATHS="$OUT/rotated.gpg-security-key $OUT/revoked.gpg-security-key" \
    CERT_MONITOR_PROCESSES="fakeimapd fakenoded" \
    CERT_MONITOR_STARTTLS_PORTS="$SMTP_PORT:smtp" \
    CERT_MONITOR_APN_CACHE=true \
    CERT_MONITOR_APN_COMMAND="cat '$TEST_ROOT/apn-certs.txt'" \
    WEB_URL="https://localhost:$WEB_PORT" \
    "$@" bash "$MONITOR" > "$TEST_ROOT/monitor.out" 2>&1
  LAST_RC=$?
  set -e
}

sent() {
  if [[ -s "$MOCK_ROOT/count" ]]; then cat "$MOCK_ROOT/count"; else printf '0\n'; fi
}

# The table row (<tr>…</tr>) of "Everything checked" that mentions TEXT
row() {
  awk -v text="$1" '
    /<h3>Everything checked:<\/h3>/ { all = 1 }
    all && /<tr>/ { buffer = ""; inside = 1 }
    inside { buffer = buffer $0 "\n" }
    inside && /<\/tr>/ { inside = 0; if (index(buffer, text)) { printf "%s", buffer; found = 1; exit } }
    END { if (!found) exit 1 }
  ' "$MOCK_ROOT/body.1"
}

expect_row() {
  local text="$1" status="$2" got
  got=$(row "$text") || fail "no row for $text"
  grep -q ">$status<" <<< "$got" || fail "row for $text is not $status: $got"
}

# 1. Everything is found, and one email lists it
run_monitor
[[ "$LAST_RC" -eq 0 ]] || { cat "$TEST_ROOT/monitor.out"; fail "monitor exited $LAST_RC"; }
[[ "$(sent)" -eq 1 ]] || fail "expected one alert, got $(sent)"
[[ "$(cat "$MOCK_ROOT/key.1")" == ssl-certificate-monitor ]] || fail 'wrong alert key'
grep -qE '^\[EXPIRED\] Certificates: 10 findings - ' "$MOCK_ROOT/subject.1" ||
  fail "unexpected subject: $(cat "$MOCK_ROOT/subject.1")"

# Public site, by the port in WEB_URL, with its chain in the email
expect_row "https://localhost:$WEB_PORT" EXPIRED
grep -q 'CN=web-expired' <<< "$(row "https://localhost:$WEB_PORT")" || fail 'web row has no subject'
grep -q '<h3>Certificate Chain (localhost):</h3>' "$MOCK_ROOT/body.1" || fail 'no chain for the website'

# One file under every name it goes by; every certificate in a chain
expect_row 'CN=site-ok' OK
grep -q "(SSL_CERT_PATH, WEB_SSL_CERT_PATH) (certificate 1 of 2)" <<< "$(row 'CN=site-ok')" ||
  fail "site row: $(row 'CN=site-ok')"
grep -q "(SSL_CERT_PATH, WEB_SSL_CERT_PATH) (certificate 2 of 2)" "$MOCK_ROOT/body.1" ||
  fail 'the CA in the chain was not checked'
grep -q '(API_SSL_CA_PATH, SSL_CA_PATH)' "$MOCK_ROOT/body.1" || fail 'CA bundle labels'
# an expired root left in a bundle is noted, not reported every day
expect_row 'CN=Old Test Root' OK
grep -q 'Expired root certificate' <<< "$(row 'CN=Old Test Root')" || fail 'old root note'
[[ "$(grep -c 'site-chain.pem' "$MOCK_ROOT/body.1")" -eq 2 ]] || fail 'chain listed more than once'

expect_row 'CN=apns-mail-critical' CRITICAL
grep -q 'Apple Mail push certificate (XAPPLEPUSHSERVICE)' <<< "$(row 'CN=apns-mail-critical')" ||
  fail 'APNs Mail certificate not labeled'
grep -q 'Apple Push Notification service SSL certificate for the mail topic' "$MOCK_ROOT/body.1" ||
  fail 'no APNs renewal steps'

expect_row 'CN=database-expired' EXPIRED
expect_row 'missing.pem (PROXY_SSL_CERT_PATH)' ERROR
if grep -q 'not-deployed.pem' "$MOCK_ROOT/body.1"; then
  fail 'a known path that is not deployed was reported'
fi

# OpenPGP: the security.txt key expires; the rotated key does not count its
# expired subkey
expect_row 'Security Test &lt;security@example.com&gt;' WARNING
grep -q ', signing<' <<< "$(row 'Security Test')" || fail 'signing capability missing'
expect_row 'Rotated Test' OK
grep -q '>never<' <<< "$(row 'Rotated Test')" || fail "rotated key: $(row 'Rotated Test')"
expect_row 'Revoked Test' ERROR
grep -q 'The key is revoked' <<< "$(row 'Revoked Test')" || fail 'revoked key note'

# Local services, implicit TLS and STARTTLS
expect_row "port $IMAP_PORT (fakeimapd)" WARNING
grep -q 'CN=imap-warning' <<< "$(row "port $IMAP_PORT (fakeimapd)")" || fail 'IMAP certificate'
expect_row "port $SMTP_PORT (fakenoded, STARTTLS)" CRITICAL
grep -q 'CN=smtp-critical' <<< "$(row "port $SMTP_PORT (fakenoded")" || fail 'SMTP certificate'
# PM2 cluster mode: the port belongs to "PM2 v5.3.0: God", a node executable
expect_row "port $CLUSTER_PORT (fakenoded)" CRITICAL
grep -q 'CN=cluster-critical' <<< "$(row "port $CLUSTER_PORT (fakenoded)")" || fail 'cluster certificate'
if grep -q "port $WEB_PORT " "$MOCK_ROOT/body.1"; then
  fail 'a process outside CERT_MONITOR_PROCESSES was checked'
fi

# Push certificates in Redis: renewed by the cache, or not
expect_row 'Redis aps_certs (Calendar)' OK
grep -q 'Renewed after' <<< "$(row 'Redis aps_certs (Calendar)')" || fail 'calendar renewal note'
expect_row 'Redis aps_certs (Contact)' CRITICAL
grep -q 'not renewed' <<< "$(row 'Redis aps_certs (Contact)')" || fail 'contact note'

# Problems first, with what to do for each kind
problems=$(awk '/<h3>Needs attention:<\/h3>/,/<h3>.*Renewal Instructions/' "$MOCK_ROOT/body.1")
grep -q 'CN=apns-mail-critical' <<< "$problems" || fail 'problem table'
if grep -q 'CN=site-ok' <<< "$problems"; then
  fail 'an OK certificate is listed as a problem'
fi
for steps in certificates.yml gpg-security-key.yml 'pm2 reload all' aps_certs; do
  grep -q "$steps" "$MOCK_ROOT/body.1" || fail "no renewal steps mentioning $steps"
done

# 2. Within a day, no second email
run_monitor
[[ "$LAST_RC" -eq 0 ]] || fail "second run exited $LAST_RC"
[[ "$(sent)" -eq 1 ]] || fail 'alert was not rate limited'

# 3. A failed send is reported to systemd and not rate limited
rm -f "$LOCK_DIR/ssl-certificate-monitor.lock"
: > "$MOCK_ROOT/fail"
run_monitor
[[ "$LAST_RC" -eq 1 ]] || fail "failed send exited $LAST_RC"
[[ ! -e "$LOCK_DIR/ssl-certificate-monitor.lock" ]] || fail 'failed send started the cooldown'
rm -f "$MOCK_ROOT/fail"

# 4. Nothing to report, no email
rm -f "$LOCK_DIR/ssl-certificate-monitor.lock"
printf 'SSL_CERT_PATH=%s\n' "$OUT/site-chain.pem" > "$ENV_FILE"
before=$(sent)
run_monitor env CERT_MONITOR_KNOWN_PATHS= CERT_MONITOR_PATHS= CERT_MONITOR_PROCESSES= \
  CERT_MONITOR_APN_CACHE=false WEB_URL=
[[ "$LAST_RC" -eq 0 ]] || fail "clean run exited $LAST_RC"
[[ "$(sent)" -eq "$before" ]] || fail 'emailed with nothing to report'

# 5. Redis cannot be read
printf 'SSL_CERT_PATH=%s\n' "$OUT/site-chain.pem" > "$ENV_FILE"
run_monitor env CERT_MONITOR_KNOWN_PATHS= CERT_MONITOR_PATHS= CERT_MONITOR_PROCESSES= \
  CERT_MONITOR_APN_COMMAND='echo "connect ECONNREFUSED" >&2; exit 1' WEB_URL=
[[ "$LAST_RC" -eq 0 ]] || fail "unreadable Redis run exited $LAST_RC"
[[ "$(sent)" -eq $((before + 1)) ]] || fail 'no alert when Redis cannot be read'
grep -q 'Could not read the cached push certificates: connect ECONNREFUSED' \
  "$MOCK_ROOT/body.$((before + 1))" || fail 'Redis error not in the alert'

printf 'PASS: certificate monitor\n'
