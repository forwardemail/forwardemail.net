#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
FULL=false

usage() {
  cat <<'USAGE'
Usage: ansible/scripts/test-alerts.sh [--full]

Runs local alert tests. No email, SMS, or GitHub request is sent.

  --full  Also test every alert host in isolated namespaces. This is slower and
          is only needed after changing hostname or SPF alert code.
USAGE
}

if [[ "${1:-}" == '--help' || "${1:-}" == '-h' ]]; then
  usage
  exit 0
fi
if [[ "${1:-}" == '--full' ]]; then
  FULL=true
elif [[ "$#" -ne 0 ]]; then
  usage >&2
  exit 64
fi

for command in bash python3 ansible-playbook shellcheck systemd-analyze; do
  command -v "$command" >/dev/null || {
    printf 'Missing required command: %s\n' "$command" >&2
    exit 1
  }
done

run() {
  printf 'Running %s...\n' "$(basename "$1")"
  "$1"
}

run "$SCRIPT_DIR/test-alert-hostname-order.py"
run "$SCRIPT_DIR/test-email-sender-status.sh"
run "$SCRIPT_DIR/test-pm2-systemd-policy.py"
run "$SCRIPT_DIR/test-pm2-systemd-notification-runtime.sh"
run "$SCRIPT_DIR/test-systemd-failure-notification-contract.py"
run "$SCRIPT_DIR/test-alert-policy-rollout.py"
run "$SCRIPT_DIR/test-systemd-sms-policy-render.sh"
run "$SCRIPT_DIR/test-status-incident-lifecycle.py"

if [[ "$FULL" == true ]]; then
  printf '%s\n' 'Running full all-host hostname test...'
  if [[ "$(id -u)" -eq 0 ]]; then
    "$SCRIPT_DIR/test-alert-hostname-runtime.sh"
  elif sudo -n true >/dev/null 2>&1; then
    sudo \
      ANSIBLE_COLLECTIONS_PATH="${ANSIBLE_COLLECTIONS_PATH:-}" \
      ANSIBLE_ROLES_PATH="${ANSIBLE_ROLES_PATH:-}" \
      "$SCRIPT_DIR/test-alert-hostname-runtime.sh"
  else
    printf '%s\n' 'Run again with sudo for --full.' >&2
    exit 2
  fi
fi

git -C "$REPO_ROOT" diff --check
printf '%s\n' 'PASS: alert checks completed'
