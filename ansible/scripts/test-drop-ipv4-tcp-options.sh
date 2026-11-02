#!/bin/bash
# Copyright (c) Forward Email LLC
# SPDX-License-Identifier: BUSL-1.1
#
# End-to-end test of the IPv4 TCP options drop rule
# (ansible/playbooks/files/drop-ipv4-tcp-options.nft, CVE-2026-98432).
#
# Runs in its own network namespace: a real TCP listener on loopback, and
# real connections with and without an IPv4 Record Route option.
#
# Needs root, nft, socat, ip and util-linux (unshare).
#
# Usage: sudo ansible/scripts/test-drop-ipv4-tcp-options.sh

set -uo pipefail

RULES="$(cd "$(dirname "${BASH_SOURCE[0]}")/../playbooks/files" && pwd)/drop-ipv4-tcp-options.nft"
TABLE="drop_ipv4_tcp_options"
PORT=18025
# Record Route: type 7, length 7, pointer 4, one address slot, then EOL
RECORD_ROUTE="x0707040000000000"

if (( EUID != 0 )); then
  echo "skipped: needs root (network namespaces, nftables)"
  exit 0
fi

for command in nft socat ip unshare; do
  if ! command -v "$command" > /dev/null; then
    echo "skipped: $command is not installed"
    exit 0
  fi
done

# re-run inside a new network namespace so the host's rules are untouched
if [[ -z ${DROP_IPV4_TCP_OPTIONS_NETNS:-} ]]; then
  DROP_IPV4_TCP_OPTIONS_NETNS=1 exec unshare --net "$0" "$@"
fi

FAILURES=0
LISTENER=""

cleanup() {
  [[ -n $LISTENER ]] && kill "$LISTENER" 2> /dev/null
}
trap cleanup EXIT

pass() { echo "ok - $*"; }
fail() {
  echo "not ok - $*"
  FAILURES=$(( FAILURES + 1 ))
}

# connect to the listener, optionally with IPv4 options
connect() {
  local options="${1:+,ip-options=$1}"
  timeout 5 socat -u /dev/null "TCP4:127.0.0.1:$PORT,connect-timeout=2$options" > /dev/null 2>&1
}

dropped() {
  nft list table ip "$TABLE" 2> /dev/null | grep -Eo 'packets [0-9]+' | grep -Eo '[0-9]+'
}

ip link set lo up

socat "TCP4-LISTEN:$PORT,bind=127.0.0.1,reuseaddr,fork" /dev/null 2> /dev/null &
LISTENER=$!
for _ in $(seq 50); do
  connect && break
  sleep 0.1
done

# without the rule, both connect (the options really reach the listener)
if connect; then pass "without rule: plain connection"; else fail "without rule: plain connection"; fi
if connect "$RECORD_ROUTE"; then
  pass "without rule: connection with IPv4 options"
else
  fail "without rule: connection with IPv4 options (cannot test the rule)"
fi

if nft -c -f "$RULES"; then pass "rule file validates"; else fail "rule file validates"; fi

# loading twice must leave one table with one rule
nft -f "$RULES" && nft -f "$RULES"
if [[ $(nft list tables | grep -c "ip $TABLE") == 1 ]] \
  && [[ $(nft list table ip "$TABLE" | grep -c 'hdrlength') == 1 ]]; then
  pass "reloading is idempotent"
else
  fail "reloading is idempotent"
fi

if connect; then pass "with rule: plain connection"; else fail "with rule: plain connection"; fi
if connect "$RECORD_ROUTE"; then
  fail "with rule: connection with IPv4 options is dropped"
else
  pass "with rule: connection with IPv4 options is dropped"
fi
if (( $(dropped) > 0 )); then pass "with rule: drops are counted"; else fail "with rule: drops are counted"; fi

# the systemd unit's ExecStop
nft delete table ip "$TABLE"
if connect "$RECORD_ROUTE"; then pass "after removal: connection with IPv4 options"; else fail "after removal: connection with IPv4 options"; fi

if (( FAILURES > 0 )); then
  echo "$FAILURES failed"
  exit 1
fi
echo "all passed"
