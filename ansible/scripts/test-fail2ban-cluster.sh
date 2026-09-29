#!/bin/bash
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# End-to-end test of the fail2ban cluster bans
# (ansible/playbooks/files/fail2ban-cluster).
#
# Runs two real fail2ban servers ("a" and "b", each in its own network
# namespace with its own iptables/ipset) and a real Redis over TLS, feeds sshd
# failures to their logs and checks the bans reach the other server.
#
# Needs root, fail2ban, ipset, iptables, redis-server, redis-cli, openssl and
# util-linux (unshare, nsenter).
#
# Usage: sudo ansible/scripts/test-fail2ban-cluster.sh

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../playbooks/files/fail2ban-cluster" && pwd)"
SCRIPT="$ROOT/fail2ban-cluster.sh"

if (( EUID != 0 )); then
  echo "skipped: needs root (network namespaces, iptables, ipset)"
  exit 0
fi

for command in fail2ban-client ipset iptables redis-server redis-cli openssl unshare nsenter; do
  if ! command -v "$command" > /dev/null; then
    echo "skipped: $command is not installed"
    exit 0
  fi
done

WORK="$(mktemp -d)"
NETNS_DIR="/run/fail2ban-cluster-test.$$"
REDIS_PORT=16399
REDIS_PASSWORD="test \"'\\\$x-$RANDOM"
STREAM="fail2ban_cluster:sshd"
FAILURES=0
declare -A DAEMONS=()

cleanup() {
  local name
  for name in a b; do
    [[ -n ${DAEMONS[$name]:-} ]] && kill "${DAEMONS[$name]}" 2> /dev/null
    [[ -S $WORK/$name/run/fail2ban.sock ]] && f2b "$name" stop > /dev/null 2>&1
    umount "$NETNS_DIR/$name" 2> /dev/null
  done
  redis_cli SHUTDOWN NOSAVE > /dev/null 2>&1
  rm -rf "$NETNS_DIR" "$WORK"
}
trap cleanup EXIT

pass() { echo "ok - $*"; }
fail() {
  echo "not ok - $*"
  FAILURES=$(( FAILURES + 1 ))
}

# waits up to 30 seconds for a command to succeed
eventually() {
  local i
  for (( i = 0; i < 60; i++ )); do
    "$@" && return 0
    sleep 0.5
  done
  return 1
}

check() {
  local description="$1"
  shift
  if eventually "$@"; then pass "$description"; else fail "$description"; fi
}

# holds for 5 seconds
check_never() {
  local description="$1" i
  shift
  for (( i = 0; i < 10; i++ )); do
    if "$@"; then
      fail "$description"
      return
    fi
    sleep 0.5
  done
  pass "$description"
}

# ---------------------------------------------------------------------------
# Redis over TLS
# ---------------------------------------------------------------------------

mkdir -p "$WORK/tls" "$NETNS_DIR"
(
  cd "$WORK/tls" || exit 1
  openssl req -x509 -newkey rsa:2048 -nodes -keyout ca.key -out ca.pem -days 1 -subj '/CN=Test CA' 2> /dev/null &&
    openssl req -newkey rsa:2048 -nodes -keyout redis.key -out redis.csr -subj '/CN=localhost' 2> /dev/null &&
    printf 'subjectAltName=DNS:localhost\n' > ext &&
    openssl x509 -req -in redis.csr -CA ca.pem -CAkey ca.key -CAcreateserial -out redis.crt -days 1 -extfile ext 2> /dev/null
) || {
  echo "could not create certificates"
  exit 1
}

redis_cli() {
  REDISCLI_AUTH="$REDIS_PASSWORD" redis-cli --tls --cacert "$WORK/tls/ca.pem" -h 127.0.0.1 -p "$REDIS_PORT" "$@"
}

start_redis() {
  redis-server --port 0 --tls-port "$REDIS_PORT" --bind 127.0.0.1 \
    --tls-cert-file "$WORK/tls/redis.crt" --tls-key-file "$WORK/tls/redis.key" \
    --tls-ca-cert-file "$WORK/tls/ca.pem" --tls-auth-clients no \
    --requirepass "$REDIS_PASSWORD" --save '' --appendonly no \
    --dir "$WORK" --daemonize yes > /dev/null
  eventually redis_ping
}

redis_ping() {
  [[ $(redis_cli PING 2> /dev/null) == PONG ]]
}

# ---------------------------------------------------------------------------
# fail2ban servers, configured as the Ansible role and playbook do
# ---------------------------------------------------------------------------

f2b() {
  local name="$1"
  shift
  timeout 60 fail2ban-client -c "$WORK/$name/conf" -s "$WORK/$name/run/fail2ban.sock" "$@"
}

in_netns() {
  local name="$1"
  shift
  nsenter --net="$NETNS_DIR/$name" "$@"
}

setup_server() {
  local name="$1" dir="$WORK/$1"
  mkdir -p "$dir/conf" "$dir/run" "$dir/state" "$dir/spool"
  cp -r /etc/fail2ban/. "$dir/conf/"
  rm -f "$dir/conf/jail.d/"* "$dir/conf/jail.local" "$dir/conf/fail2ban.local"
  touch "$dir/auth.log" "$dir/ignore"

  cat > "$dir/conf/fail2ban.local" << EOF
[Definition]
socket = $dir/run/fail2ban.sock
pidfile = $dir/run/fail2ban.pid
dbfile = $dir/run/fail2ban.sqlite3
logtarget = $dir/run/fail2ban.log
EOF

  # (what the oefenweb.fail2ban role writes, without the mail action)
  cat > "$dir/conf/jail.local" << EOF
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1
bantime = -1
maxretry = 2
findtime = 365d
backend = polling
banaction = iptables-multiport
banaction_allports = iptables-allports
protocol = tcp
chain = INPUT
action_ = %(banaction)s[name=%(__name__)s, port="%(port)s", protocol="%(protocol)s", chain="%(chain)s"]
action = %(action_)s

[sshd]
enabled = true
logpath = $dir/auth.log
EOF

  cp "$ROOT/jail.d/fail2ban-cluster.local" "$dir/conf/jail.d/"
  cp "$ROOT/action.d/"*.conf "$dir/conf/action.d/"
  cat > "$dir/conf/action.d/cluster-publish.local" << EOF
[Init]
cluster_cmd = env FAIL2BAN_CLUSTER_SPOOL_DIR=$dir/spool bash $SCRIPT
EOF

  touch "$NETNS_DIR/$name"
  unshare --net="$NETNS_DIR/$name" true
}

start_fail2ban() {
  local name="$1"
  in_netns "$name" fail2ban-client -c "$WORK/$name/conf" -s "$WORK/$name/run/fail2ban.sock" \
    -p "$WORK/$name/run/fail2ban.pid" start > /dev/null 2>&1
  eventually jail_running "$name" sshd-cluster
}

jail_running() {
  f2b "$1" status "$2" > /dev/null 2>&1
}

start_daemon() {
  local name="$1" dir="$WORK/$1"
  printf '%s' "$REDIS_PASSWORD" > "$WORK/redis-password"
  env -u REDISCLI_AUTH REDIS_HOST=localhost REDIS_PORT="$REDIS_PORT" \
    FAIL2BAN_CLUSTER_PASSWORD_FILE="$WORK/redis-password" REDIS_CACERT="$WORK/tls/ca.pem" \
    FAIL2BAN_CLUSTER_CLIENT="fail2ban-client -c $dir/conf -s $dir/run/fail2ban.sock" \
    FAIL2BAN_CLUSTER_STATE_DIR="$dir/state" FAIL2BAN_CLUSTER_SPOOL_DIR="$dir/spool" \
    FAIL2BAN_CLUSTER_IGNORE_FILE="$dir/ignore" FAIL2BAN_CLUSTER_HOSTNAME="$name.test" \
    FAIL2BAN_CLUSTER_POLL_SECONDS=1 FAIL2BAN_CLUSTER_IGNORE_REFRESH_SECONDS=2 \
    bash "$SCRIPT" run >> "$dir/daemon.log" 2>&1 &
  DAEMONS[$name]=$!
}

stop_daemon() {
  kill "${DAEMONS[$1]}" 2> /dev/null
  wait "${DAEMONS[$1]}" 2> /dev/null
  DAEMONS[$1]=''
}

# two failed logins (maxretry = 2) from an address
attack() {
  local name="$1" ip="$2" i
  for i in 1 2; do
    printf '%s host sshd[%d]: Failed password for invalid user admin from %s port %d ssh2\n' \
      "$(date '+%b %e %H:%M:%S')" "$(( 1000 + RANDOM % 1000 ))" "$ip" "$(( 40000 + i ))" >> "$WORK/$name/auth.log"
  done
}

banned() {
  local name="$1" jail="$2" target="$3"
  f2b "$name" get "$jail" banned 2> /dev/null | grep -qF "'$target'"
}

# whether the server's firewall blocks an address (the ipset matches it)
blocked() {
  local name="$1" ip="$2" set="f2b-sshd-cluster"
  [[ $ip == *:* ]] && set="f2b-sshd-cluster6"
  in_netns "$name" ipset test "$set" "$ip" > /dev/null 2>&1
}

# whether the sshd jail's own action (iptables-multiport) bans an address
sshd_rule() {
  in_netns "$1" iptables -S f2b-sshd 2> /dev/null | grep -qF -- "-s $2/32 "
}

not_banned() {
  ! banned "$@"
}

not_blocked() {
  ! blocked "$@"
}

all_blocked() {
  local name="$1" ip
  shift
  for ip in "$@"; do
    blocked "$name" "$ip" || return 1
  done
}

stream_length() {
  [[ $(redis_cli XLEN "$STREAM" 2> /dev/null) == "$1" ]]
}

# ---------------------------------------------------------------------------

start_redis || {
  echo "could not start Redis"
  exit 1
}

setup_server a
setup_server b
# b never bans 192.0.2.10, nor any range containing 172.16.5.99 or
# 2001:db8:77:1::5
printf '# ours\n192.0.2.10\n172.16.5.99 localhost\n2001:db8:77:1::5\n' > "$WORK/b/ignore"
start_fail2ban a || fail "fail2ban a started"
start_fail2ban b || fail "fail2ban b started"

# bans from before the service was installed
attack a 203.0.113.44
check "a bans an attacker in its sshd jail" banned a sshd 203.0.113.44
EARLIER=()
for (( i = 1; i <= 300; i++ )); do EARLIER+=("45.$(( i / 100 )).$(( i % 100 )).1"); done
f2b a set sshd banip "${EARLIER[@]}" > /dev/null
# (the ban action did not exist then)
rm -f "$WORK/a/spool/outbox"

# fail2ban restarted just before the service starts: it restores these bans
# in the background while the service imports them
f2b a stop > /dev/null 2>&1
start_fail2ban a || fail "fail2ban a restarted"
start_daemon a
start_daemon b

check "an earlier ban reaches b" banned b sshd-cluster 203.0.113.44
check "every earlier ban reaches b (read from fail2ban's database)" all_blocked b "${EARLIER[@]}"
check "b blocks it" blocked b 203.0.113.44
check "and a applies it too" banned a sshd-cluster 203.0.113.44

attack a 198.18.0.1
check "a new ban on a reaches b" banned b sshd-cluster 198.18.0.1
check "b blocks it" blocked b 198.18.0.1
if in_netns b iptables -S INPUT | grep -q -- '--dport 22 -m set --match-set f2b-sshd-cluster src -j REJECT'; then
  pass "only SSH is blocked"
else
  fail "only SSH is blocked"
fi

check "a's sshd jail still bans with its own action" sshd_rule a 198.18.0.1

attack b 2001:db8:5:6::1234
check "an IPv6 ban on b reaches a as its /64" banned a sshd-cluster 2001:db8:5:6::/64
check "a blocks the whole /64" blocked a 2001:db8:5:6::ffff
check "b blocks the whole /64 too" blocked b 2001:db8:5:6:ffff::1

attack a 198.51.100.1
attack a 198.51.100.2
check "two addresses of a /24 are banned individually" banned b sshd-cluster 198.51.100.2
if banned b sshd-cluster 198.51.100.0/24; then fail "the /24 is not banned yet"; else pass "the /24 is not banned yet"; fi
attack b 198.51.100.3
check "a third address of the /24 (from the other server) bans the /24 on a" banned a sshd-cluster 198.51.100.0/24
check "and on b" banned b sshd-cluster 198.51.100.0/24
check "b blocks the whole /24" blocked b 198.51.100.200

attack a 192.0.2.10
check "a applies a ban its ignore list allows" banned a sshd-cluster 192.0.2.10
check_never "b never bans an address on its ignore list" banned b sshd-cluster 192.0.2.10

attack a 172.16.5.1
attack a 172.16.5.2
attack a 172.16.5.3
check "a bans a /24" banned a sshd-cluster 172.16.5.0/24
check "b bans its addresses" banned b sshd-cluster 172.16.5.3
check_never "b never bans a /24 containing an ignored address" banned b sshd-cluster 172.16.5.0/24

# 203.0.113.44 and the 300 earlier bans, 198.18.0.1, 2001:db8:5:6::1234,
# 198.51.100.1-3, 192.0.2.10, 172.16.5.1-3: received bans are not published
# again
check "each ban is published once" stream_length 310

# Redis down (and its data lost) while a server bans
redis_cli SHUTDOWN NOSAVE > /dev/null 2>&1
attack a 198.18.2.1
check "a bans while Redis is down" banned a sshd 198.18.2.1
sleep 3
start_redis || fail "Redis restarted"
check "the ban reaches b once Redis is back" banned b sshd-cluster 198.18.2.1

# b's service down while a bans
stop_daemon b
attack a 198.18.3.1
check "a bans while b's service is down" banned a sshd-cluster 198.18.3.1
start_daemon b
check "b catches up when its service starts" banned b sshd-cluster 198.18.3.1

# b's fail2ban down while a bans
f2b b stop > /dev/null 2>&1
attack a 198.18.4.1
check "a bans while b's fail2ban is down" banned a sshd-cluster 198.18.4.1
sleep 3
start_fail2ban b || fail "fail2ban b restarted"
check "b applies it once fail2ban is back" banned b sshd-cluster 198.18.4.1
check "b restored its earlier bans" blocked b 198.18.0.1

# entries not written by the service are skipped
redis_cli XADD "$STREAM" '*' b 'not an address;$(id)' > /dev/null
redis_cli XADD "$STREAM" '*' x y > /dev/null
attack a 198.18.5.1
check "malformed entries are skipped" banned b sshd-cluster 198.18.5.1

# (Redis lost its data above) 198.18.2.1, 198.18.3.1, 198.18.4.1, the two
# malformed entries and 198.18.5.1: restarting fail2ban republished nothing
check "a restarted fail2ban does not publish its bans again" stream_length 6

# an IPv6 /64 overlapping b's ignore list (2001:db8:77:1::5)
attack a 2001:db8:77:1::9
check "a bans the /64" banned a sshd-cluster 2001:db8:77:1::/64
check "b bans only the address when its /64 overlaps the ignore list" banned b sshd-cluster 2001:db8:77:1::9
check "b does not block the ignored address" not_blocked b 2001:db8:77:1::5

# unban on every server, requested on b
FAIL2BAN_CLUSTER_SPOOL_DIR="$WORK/b/spool" bash "$SCRIPT" unban 198.51.100.0/24 2> /dev/null
check "an unban lifts the /24 on a" not_banned a sshd-cluster 198.51.100.0/24
check "and a's own sshd bans inside it" not_banned a sshd 198.51.100.1
check "and the /24 on b" not_banned b sshd-cluster 198.51.100.0/24
check "b no longer blocks it" not_blocked b 198.51.100.200
attack a 198.51.100.7
check "a later ban inside it is applied" banned b sshd-cluster 198.51.100.7
check_never "without banning the /24 again at once" banned b sshd-cluster 198.51.100.0/24

# an address added to the ignore list later
printf '198.18.0.1\n' >> "$WORK/b/ignore"
check "b lifts the ban of an address added to its ignore list" not_banned b sshd-cluster 198.18.0.1
check "a keeps it" banned a sshd-cluster 198.18.0.1

# unbanning one address of a banned /24 keeps its other attackers banned
attack a 198.18.10.1
attack a 198.18.10.2
attack a 198.18.10.3
check "a /24 is banned" banned b sshd-cluster 198.18.10.0/24
attack a 198.18.10.4
check "a later attacker inside it is covered" banned a sshd 198.18.10.4
FAIL2BAN_CLUSTER_SPOOL_DIR="$WORK/a/spool" bash "$SCRIPT" unban 198.18.10.2 2> /dev/null
check "unbanning one address lifts the /24" not_banned b sshd-cluster 198.18.10.0/24
check "and that address" not_blocked b 198.18.10.2
check "its other attackers stay banned" all_blocked b 198.18.10.1 198.18.10.3 198.18.10.4

if FAIL2BAN_CLUSTER_SPOOL_DIR="$WORK/a/spool" bash "$SCRIPT" unban 198.0.0.0/8 2> /dev/null; then
  fail "an unban wider than /16 is refused"
else
  pass "an unban wider than /16 is refused"
fi

# a banned /24 that comes to overlap the ignore list
attack a 198.18.11.1
attack a 198.18.11.2
attack a 198.18.11.3
check "another /24 is banned" banned b sshd-cluster 198.18.11.0/24
printf '198.18.11.50\n' >> "$WORK/b/ignore"
check "b lifts it once it overlaps the ignore list" not_banned b sshd-cluster 198.18.11.0/24
check "and bans its attackers one by one" all_blocked b 198.18.11.1 198.18.11.2 198.18.11.3
check "without the ignored address" not_blocked b 198.18.11.50

# a host name of the ignore list that does not resolve
stop_daemon b
printf 'unresolvable-host.invalid\n' >> "$WORK/b/ignore"
start_daemon b
attack a 198.18.6.1
check "a bans" banned a sshd-cluster 198.18.6.1
check_never "b applies no ban while its ignore list is not known" banned b sshd-cluster 198.18.6.1
sed -i '/unresolvable-host.invalid/d' "$WORK/b/ignore"
check "b applies it once the list is known" banned b sshd-cluster 198.18.6.1

# what an address is banned as ("" = invalid or ignored)
expect_target() {
  local got
  got="$(FAIL2BAN_CLUSTER_IGNORE_FILE=/dev/null bash "$SCRIPT" target "$1" 2> /dev/null)"
  if [[ $got == "$2" ]]; then pass "target '$1' is '$2'"; else fail "target '$1' is '$2' (got '$got')"; fi
}
expect_target 198.51.100.7 198.51.100.7
expect_target 2001:DB8:1:2:3:4:5:6 2001:db8:1:2::/64
expect_target 2001:db8::1 2001:db8:0:0::/64
expect_target ::ffff:198.51.100.7 198.51.100.7
expect_target ::ffff:c633:6407 198.51.100.7
expect_target 1:2:3:4:5:6:1.2.3.4 1:2:3:4::/64
expect_target ::1 ''
expect_target 127.0.0.2 ''
expect_target 01.2.3.4 ''
expect_target 256.1.1.1 ''
expect_target '1.2.3.4;id' ''
expect_target 1::2: ''
expect_target 1::2::3 ''
expect_target fe80::1%eth0 ''
expect_target 1:2:3:4:5:6:7:8:9 ''

# publish only queues valid addresses
FAIL2BAN_CLUSTER_SPOOL_DIR="$WORK/c-spool" bash "$SCRIPT" publish '198.18.0.6 $(touch /tmp/fail2ban-cluster-injected)' 2> /dev/null
FAIL2BAN_CLUSTER_SPOOL_DIR="$WORK/c-spool" bash "$SCRIPT" publish '198.18.0.7;id' 2> /dev/null
if [[ ! -e /tmp/fail2ban-cluster-injected && ! -s $WORK/c-spool/outbox ]]; then
  pass "publish refuses anything but an address"
else
  fail "publish refuses anything but an address"
fi

if grep -qi -E 'syntax error|unbound variable|command not found' "$WORK/a/daemon.log" "$WORK/b/daemon.log"; then
  fail "no script errors"
  cat "$WORK/a/daemon.log" "$WORK/b/daemon.log"
else
  pass "no script errors"
fi

if (( FAILURES > 0 )); then
  echo "--- a"
  cat "$WORK/a/daemon.log"
  echo "--- b"
  cat "$WORK/b/daemon.log"
  echo "$FAILURES failed"
  exit 1
fi

echo "all passed"
