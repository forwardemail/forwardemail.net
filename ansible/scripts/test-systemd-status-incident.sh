#!/usr/bin/env bash
# Validate the GitHub token and, only with explicit confirmation, exercise an
# issue create/lock/resolve/close lifecycle.  The default mode is read-only.

set -euo pipefail

PATH=/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
export PATH
umask 077

readonly API_URL='https://api.github.com'
readonly API_VERSION='2022-11-28'
readonly API_ACCEPT='application/vnd.github+json'
readonly STATUS_LABEL='status'
readonly COMPONENT_LABEL_COLOR='ededed'
readonly MODE="${SYSTEMD_INCIDENT_TEST_MODE:-read-only}"
readonly REPOSITORY="${SYSTEMD_INCIDENT_TEST_REPOSITORY:-${GITHUB_REPOSITORY:-forwardemail/status.forwardemail.net}}"
readonly COMPONENT="${SYSTEMD_INCIDENT_TEST_COMPONENT:-mongo.forwardemail.net}"
readonly CONFIRMATION="${SYSTEMD_INCIDENT_TEST_CONFIRM:-}"

for dependency in curl date jq mktemp od tr; do
  if ! command -v "$dependency" >/dev/null 2>&1; then
    printf 'Missing required command: %s\n' "$dependency" >&2
    exit 69
  fi
done

TOKEN_VALUE="${GITHUB_OCTOKIT_TOKEN:-}"
unset GITHUB_OCTOKIT_TOKEN
if [[ -z "$TOKEN_VALUE" ]] ||
  (( ${#TOKEN_VALUE} < 20 || ${#TOKEN_VALUE} > 255 )) ||
  ! [[ "$TOKEN_VALUE" =~ ^[A-Za-z0-9_]+$ ]]; then
  printf '%s\n' 'GITHUB_OCTOKIT_TOKEN is missing or malformed.' >&2
  exit 64
fi
if ! [[ "$REPOSITORY" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
  printf '%s\n' 'SYSTEMD_INCIDENT_TEST_REPOSITORY is malformed.' >&2
  exit 64
fi
case "$MODE" in
  read-only | lifecycle | status-lifecycle)
    ;;
  *)
    printf '%s\n' 'SYSTEMD_INCIDENT_TEST_MODE must be read-only, lifecycle, or status-lifecycle.' >&2
    exit 64
    ;;
esac

COMPONENT_LABEL=''
case "$COMPONENT" in
  mongo.forwardemail.net)
    COMPONENT_LABEL='mongo-forwardemail-net'
    ;;
  logs.forwardemail.net)
    COMPONENT_LABEL='logs-forwardemail-net'
    ;;
  redis.forwardemail.net)
    COMPONENT_LABEL='redis-forwardemail-net'
    ;;
  bree.forwardemail.net)
    COMPONENT_LABEL='bree-forwardemail-net'
    ;;
  forwardemail.net)
    COMPONENT_LABEL='forwardemail-net-443-i-pv4'
    ;;
  api.forwardemail.net)
    COMPONENT_LABEL='api-forwardemail-net-443-i-pv4'
    ;;
  caldav.forwardemail.net)
    COMPONENT_LABEL='caldav-forwardemail-net-443-i-pv4'
    ;;
  carddav.forwardemail.net)
    COMPONENT_LABEL='carddav-forwardemail-net-443-i-pv4'
    ;;
  imap.forwardemail.net)
    COMPONENT_LABEL='imap-forwardemail-net-993-i-pv4'
    ;;
  mx1.forwardemail.net)
    COMPONENT_LABEL='mx1-forwardemail-net-25-i-pv4'
    ;;
  mx2.forwardemail.net)
    COMPONENT_LABEL='mx2-forwardemail-net-25-i-pv4'
    ;;
  pop3.forwardemail.net)
    COMPONENT_LABEL='pop3-forwardemail-net-995-i-pv4'
    ;;
  smtp.forwardemail.net)
    COMPONENT_LABEL='smtp-forwardemail-net-587-i-pv4'
    ;;
  sqlite.forwardemail.net)
    COMPONENT_LABEL='sqlite-forwardemail-net'
    ;;
  *)
    printf '%s\n' 'SYSTEMD_INCIDENT_TEST_COMPONENT is not allowlisted.' >&2
    exit 64
    ;;
esac
readonly COMPONENT_LABEL
readonly COMPONENT_LABEL_DESCRIPTION="Upptime monitor: ${COMPONENT}"

IFS=/ read -r OWNER REPO <<<"$REPOSITORY"
readonly OWNER REPO
REQUEST_FILE=$(mktemp)
RESPONSE_FILE=$(mktemp)
ISSUE_NUMBER=0
ISSUE_LOCKED=false
ISSUE_CLOSED=false
cleanup() {
  local rc=$?
  if (( ISSUE_NUMBER > 0 )) && [[ "$ISSUE_CLOSED" != true ]]; then
    # Best-effort cleanup prevents an interrupted test from leaving an open issue.
    api_request DELETE "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock" '' '204 404' >/dev/null 2>&1 || true
    ISSUE_LOCKED=false
    if api_request PATCH "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}" '{"state":"closed","state_reason":"not_planned"}' '200 404' >/dev/null 2>&1; then
      ISSUE_CLOSED=true
    fi
  fi
  if (( ISSUE_NUMBER > 0 )) && [[ "$ISSUE_LOCKED" != true ]]; then
    if api_request PUT "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock" '' '204 404' >/dev/null 2>&1; then
      ISSUE_LOCKED=true
    fi
  fi
  TOKEN_VALUE=''
  rm -f "$REQUEST_FILE" "$RESPONSE_FILE"
  exit "$rc"
}
trap cleanup EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

api_config() {
  local method="$1"
  local path="$2"
  printf 'silent\n'
  printf 'show-error\n'
  printf 'request = "%s"\n' "$method"
  printf 'url = "%s%s"\n' "$API_URL" "$path"
  printf 'header = "Accept: %s"\n' "$API_ACCEPT"
  printf 'header = "Authorization: Bearer %s"\n' "$TOKEN_VALUE"
  printf 'header = "X-GitHub-Api-Version: %s"\n' "$API_VERSION"
  printf 'header = "User-Agent: forwardemail-systemd-incident-test/1"\n'
  printf 'connect-timeout = 10\n'
  printf 'max-time = 30\n'
}

api_request() {
  local method="$1"
  local path="$2"
  local payload="$3"
  local expected_codes="$4"
  local http_code

  : > "$REQUEST_FILE"
  : > "$RESPONSE_FILE"
  [[ -z "$payload" ]] || printf '%s' "$payload" > "$REQUEST_FILE"
  if [[ -n "$payload" ]]; then
    http_code=$(api_config "$method" "$path" | \
      curl --config - --header 'Content-Type: application/json' \
        --data-binary @"$REQUEST_FILE" --output "$RESPONSE_FILE" \
        --write-out '%{http_code}')
  else
    http_code=$(api_config "$method" "$path" | \
      curl --config - --output "$RESPONSE_FILE" --write-out '%{http_code}')
  fi
  if [[ " $expected_codes " != *" $http_code "* ]]; then
    printf 'GitHub API request failed: method=%s path=%s http=%s\n' "$method" "$path" "$http_code" >&2
    return 1
  fi
}

response_has_required_labels() {
  jq -e \
    --arg status_label "$STATUS_LABEL" \
    --arg component_label "$COMPONENT_LABEL" '
      [ .labels[]? | if type == "string" then . else .name end ] as $labels |
      ($labels | index($status_label) != null) and
      ($labels | index($component_label) != null)
    ' "$RESPONSE_FILE" >/dev/null 2>&1
}

printf 'Testing repository access for %s...\n' "$REPOSITORY"
api_request GET "/repos/${OWNER}/${REPO}" '' '200'
if [[ "$(jq -r '.full_name // empty' "$RESPONSE_FILE")" != "$REPOSITORY" ]]; then
  printf '%s\n' 'Repository identity check failed.' >&2
  exit 1
fi
api_request GET "/repos/${OWNER}/${REPO}/labels/${STATUS_LABEL}" '' '200'
if [[ "$(jq -r '.name // empty' "$RESPONSE_FILE")" != "$STATUS_LABEL" ]]; then
  printf '%s\n' 'Status label identity check failed.' >&2
  exit 1
fi

COMPONENT_LABEL_EXISTS=false
api_request GET "/repos/${OWNER}/${REPO}/labels/${COMPONENT_LABEL}" '' '200 404'
if [[ "$(jq -r '.name // empty' "$RESPONSE_FILE")" == "$COMPONENT_LABEL" ]]; then
  COMPONENT_LABEL_EXISTS=true
elif [[ "$(jq -r '.message // empty' "$RESPONSE_FILE")" != 'Not Found' ]]; then
  printf '%s\n' 'Component label lookup returned an unexpected response.' >&2
  exit 1
fi

api_request GET "/repos/${OWNER}/${REPO}/issues?state=open&labels=${STATUS_LABEL},${COMPONENT_LABEL}&per_page=1" '' '200'
printf 'Read-only GitHub repository, status-label, component-label, and issue-list checks passed.\n'
if [[ "$COMPONENT_LABEL_EXISTS" != true ]]; then
  printf 'Component label %s is absent. A confirmed public lifecycle test or the production reporter will create it.\n' "$COMPONENT_LABEL"
fi

if [[ "$MODE" == 'read-only' ]]; then
  printf '%s\n' 'No issue or repository label was created. Set SYSTEMD_INCIDENT_TEST_MODE only when you want a mutation test.'
  exit 0
fi

EXPECTED_CONFIRMATION='CREATE_AND_CLOSE_GITHUB_TEST_ISSUE'
LABELS='[]'
TITLE='Forward Email systemd incident integration test'
BODY_PREFIX='Automated integration test for the privacy-preserving systemd incident lifecycle. No production host or diagnostic data is included.'
if [[ "$MODE" == 'status-lifecycle' ]]; then
  EXPECTED_CONFIRMATION='CREATE_AND_CLOSE_PUBLIC_STATUS_INCIDENT'
  LABELS=$(jq -cn --arg status_label "$STATUS_LABEL" --arg component_label "$COMPONENT_LABEL" '[$status_label,$component_label]')
  TITLE="🛑 ${COMPONENT} is unavailable"
  BODY_PREFIX="Automated service health checks detected a sustained interruption affecting **${COMPONENT}**.

We are investigating and will update this incident after automated recovery checks confirm stability."
fi
if [[ "$CONFIRMATION" != "$EXPECTED_CONFIRMATION" ]]; then
  printf 'Refusing mutation. Set SYSTEMD_INCIDENT_TEST_CONFIRM=%s to run %s mode.\n' "$EXPECTED_CONFIRMATION" "$MODE" >&2
  exit 64
fi

if [[ "$MODE" == 'status-lifecycle' && "$COMPONENT_LABEL_EXISTS" != true ]]; then
  PAYLOAD=$(jq -n \
    --arg name "$COMPONENT_LABEL" \
    --arg color "$COMPONENT_LABEL_COLOR" \
    --arg description "$COMPONENT_LABEL_DESCRIPTION" \
    '{name:$name,color:$color,description:$description}')
  api_request POST "/repos/${OWNER}/${REPO}/labels" "$PAYLOAD" '201 422'
  api_request GET "/repos/${OWNER}/${REPO}/labels/${COMPONENT_LABEL}" '' '200'
  if [[ "$(jq -r '.name // empty' "$RESPONSE_FILE")" != "$COMPONENT_LABEL" ]]; then
    printf '%s\n' 'Component label provisioning verification failed.' >&2
    exit 1
  fi
fi

TEST_ID="$(date -u +%s)-$(od -An -N4 -tx4 /dev/urandom | tr -d '[:space:]')"
readonly TEST_ID
readonly MARKER="<!-- forwardemail-systemd-incident-test:${TEST_ID} -->"
BODY="${BODY_PREFIX}

${MARKER}"
PAYLOAD=$(jq -n --arg title "$TITLE" --arg body "$BODY" --argjson labels "$LABELS" '{title:$title,body:$body,labels:$labels}')
api_request POST "/repos/${OWNER}/${REPO}/issues" "$PAYLOAD" '201'
ISSUE_NUMBER=$(jq -r '.number // 0' "$RESPONSE_FILE")
ISSUE_URL=$(jq -r '.html_url // empty' "$RESPONSE_FILE")
if ! [[ "$ISSUE_NUMBER" =~ ^[1-9][0-9]*$ ]] || [[ -z "$ISSUE_URL" ]]; then
  printf '%s\n' 'Created issue response was invalid.' >&2
  exit 1
fi
printf 'Created test issue #%s: %s\n' "$ISSUE_NUMBER" "$ISSUE_URL"

api_request PUT "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock" '' '204'
ISSUE_LOCKED=true
api_request GET "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}" '' '200'
if [[ "$(jq -r '.state' "$RESPONSE_FILE")" != 'open' ]] ||
  [[ "$(jq -r '.locked // false' "$RESPONSE_FILE")" != 'true' ]] ||
  [[ "$(jq -r '.body' "$RESPONSE_FILE")" != *"$MARKER"* ]]; then
  printf '%s\n' 'Open issue verification failed.' >&2
  exit 1
fi
if [[ "$MODE" == 'status-lifecycle' ]] && ! response_has_required_labels; then
  printf '%s\n' 'Open public issue is missing a required Upptime label.' >&2
  exit 1
fi

api_request DELETE "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock" '' '204'
ISSUE_LOCKED=false
COMMENT_BODY="**Resolved:** The systemd incident integration test completed successfully.

<!-- forwardemail-systemd-incident-test-resolution:${TEST_ID} -->"
PAYLOAD=$(jq -n --arg body "$COMMENT_BODY" '{body:$body}')
api_request POST "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/comments" "$PAYLOAD" '201'
api_request PATCH "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}" '{"state":"closed","state_reason":"completed"}' '200'
ISSUE_CLOSED=true
api_request PUT "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/lock" '' '204'
ISSUE_LOCKED=true
api_request GET "/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}" '' '200'
if [[ "$(jq -r '.state' "$RESPONSE_FILE")" != 'closed' ]] ||
  [[ "$(jq -r '.state_reason' "$RESPONSE_FILE")" != 'completed' ]] ||
  [[ "$(jq -r '.locked // false' "$RESPONSE_FILE")" != 'true' ]]; then
  printf '%s\n' 'Closed issue verification failed.' >&2
  exit 1
fi
if [[ "$MODE" == 'status-lifecycle' ]] && ! response_has_required_labels; then
  printf '%s\n' 'Closed public issue is missing a required Upptime label.' >&2
  exit 1
fi

printf 'Lifecycle test passed: issue #%s was created, locked, resolved, closed, and locked again.\n' "$ISSUE_NUMBER"
if [[ "$MODE" == 'status-lifecycle' ]]; then
  printf 'Verified Upptime labels: %s, %s\n' "$STATUS_LABEL" "$COMPONENT_LABEL"
fi
exit 0
