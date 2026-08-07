#!/usr/bin/env python3
"""Contract tests for the systemd status incident reporter and test CLI."""

from __future__ import annotations

import json
import os
from pathlib import Path
import re
import subprocess
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

REPO_ROOT = (
    Path(os.environ['FORWARDEMAIL_REPO_ROOT'])
    if os.environ.get('FORWARDEMAIL_REPO_ROOT')
    else Path(__file__).resolve().parents[2]
)
REPORTER_TEMPLATE = REPO_ROOT / 'ansible/playbooks/templates/report-systemd-status-incident.sh.j2'
TEST_SCRIPT = REPO_ROOT / 'ansible/scripts/test-systemd-status-incident.sh'
TOKEN = 'github_pat_contract_test_token_1234567890'
REPOSITORY = 'forwardemail/status.forwardemail.net'


class ApiState:
    def __init__(self) -> None:
        self.next_number = 1000
        self.issues: dict[int, dict] = {}
        self.calls: list[dict] = []
        self.labels: dict[str, dict] = {
            'status': {'name': 'status', 'color': 'ededed', 'description': None},
            'mongo-forwardemail-net': {
                'name': 'mongo-forwardemail-net',
                'color': 'ededed',
                'description': None,
            },
            'redis-forwardemail-net': {
                'name': 'redis-forwardemail-net',
                'color': 'ededed',
                'description': None,
            },
        }

    def public_issue(self, issue: dict) -> dict:
        return {
            'number': issue['number'],
            'html_url': issue['html_url'],
            'title': issue['title'],
            'body': issue['body'],
            'labels': [{'name': label} for label in issue['labels']],
            'state': issue['state'],
            'state_reason': issue.get('state_reason'),
            'locked': issue['locked'],
        }


STATE = ApiState()


class Handler(BaseHTTPRequestHandler):
    server_version = 'ForwardEmailIncidentMock/1'

    def log_message(self, _format: str, *_args: object) -> None:
        return

    def _send(self, code: int, data: object | None = None) -> None:
        payload = b'' if data is None else json.dumps(data).encode()
        self.send_response(code)
        if data is not None:
            self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _body(self) -> dict:
        length = int(self.headers.get('Content-Length', '0'))
        if not length:
            return {}
        return json.loads(self.rfile.read(length))

    def _authorize(self) -> bool:
        if self.headers.get('Authorization') != f'Bearer {TOKEN}':
            self._send(401, {'message': 'bad token'})
            return False
        return True

    def _record(self, body: dict | None = None) -> None:
        STATE.calls.append({'method': self.command, 'path': self.path, 'body': body or {}})

    def do_GET(self) -> None:  # noqa: N802
        if not self._authorize():
            return
        parsed = urlparse(self.path)
        self._record()
        if parsed.path == '/repos/forwardemail/status.forwardemail.net':
            self._send(200, {'full_name': REPOSITORY})
            return
        label_match = re.fullmatch(
            r'/repos/forwardemail/status\.forwardemail\.net/labels/([A-Za-z0-9_.-]+)',
            parsed.path,
        )
        if label_match:
            label = STATE.labels.get(label_match.group(1))
            self._send(200, label) if label else self._send(404, {'message': 'Not Found'})
            return
        if parsed.path == '/search/issues':
            query = parse_qs(parsed.query).get('q', [''])[0]
            items = [
                STATE.public_issue(issue)
                for issue in STATE.issues.values()
                if issue['state'] == 'open'
                and '<!-- forwardemail-systemd-incident:' in issue['body']
                and next(
                    (
                        marker
                        for marker in re.findall(r'<!-- forwardemail-systemd-incident:[^>]+-->', issue['body'])
                        if marker in query
                    ),
                    None,
                )
            ]
            self._send(200, {'total_count': len(items), 'items': items})
            return
        if parsed.path == '/repos/forwardemail/status.forwardemail.net/issues':
            requested_labels = [
                label
                for label in parse_qs(parsed.query).get('labels', [''])[0].split(',')
                if label
            ]
            issues = [
                STATE.public_issue(issue)
                for issue in STATE.issues.values()
                if issue['state'] == 'open'
                and all(label in issue['labels'] for label in requested_labels)
            ]
            self._send(200, issues)
            return
        comments_match = re.fullmatch(r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)/comments', parsed.path)
        if comments_match:
            issue = STATE.issues.get(int(comments_match.group(1)))
            if not issue:
                self._send(404, {'message': 'Not Found'})
                return
            self._send(200, [{'id': index + 1, 'body': body} for index, body in enumerate(issue['comments'])])
            return
        match = re.fullmatch(r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)', parsed.path)
        if match:
            issue = STATE.issues.get(int(match.group(1)))
            self._send(200, STATE.public_issue(issue)) if issue else self._send(404, {'message': 'Not Found'})
            return
        self._send(404, {'message': 'not found'})

    def do_POST(self) -> None:  # noqa: N802
        if not self._authorize():
            return
        parsed = urlparse(self.path)
        body = self._body()
        self._record(body)
        if parsed.path == '/repos/forwardemail/status.forwardemail.net/labels':
            name = body.get('name', '')
            if name in STATE.labels:
                self._send(422, {'message': 'Validation Failed'})
                return
            assert re.fullmatch(r'[a-z0-9-]+', name)
            assert body.get('color') == 'ededed'
            description = body.get('description')
            assert isinstance(description, str) and description.startswith('Upptime monitor: ')
            label = {'name': name, 'color': 'ededed', 'description': description}
            STATE.labels[name] = label
            self._send(201, label)
            return
        if parsed.path == '/repos/forwardemail/status.forwardemail.net/issues':
            title = body.get('title', '')
            issue_body = body.get('body', '')
            requested_labels = body.get('labels', [])
            assert isinstance(requested_labels, list)
            labels = [label for label in requested_labels if label in STATE.labels]
            forbidden = [TOKEN, '121.127.', 'mongod.service', 'valkey-server.service', '/var/', '/etc/', 'journalctl']
            assert not any(value in title or value in issue_body for value in forbidden)
            number = STATE.next_number
            STATE.next_number += 1
            issue = {
                'number': number,
                'html_url': f'http://example.invalid/issues/{number}',
                'title': title,
                'body': issue_body,
                'labels': labels,
                'state': 'open',
                'state_reason': None,
                'locked': False,
                'comments': [],
            }
            STATE.issues[number] = issue
            self._send(201, STATE.public_issue(issue))
            return
        labels_match = re.fullmatch(
            r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)/labels',
            parsed.path,
        )
        if labels_match and int(labels_match.group(1)) in STATE.issues:
            issue = STATE.issues[int(labels_match.group(1))]
            requested_labels = body.get('labels', [])
            assert isinstance(requested_labels, list)
            if not all(label in STATE.labels for label in requested_labels):
                self._send(422, {'message': 'Validation Failed'})
                return
            for label in requested_labels:
                if label not in issue['labels']:
                    issue['labels'].append(label)
            self._send(200, [{'name': label} for label in issue['labels']])
            return
        match = re.fullmatch(r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)/comments', parsed.path)
        if match and int(match.group(1)) in STATE.issues:
            issue = STATE.issues[int(match.group(1))]
            issue['comments'].append(body.get('body', ''))
            self._send(201, {'id': len(issue['comments']), 'body': body.get('body', '')})
            return
        self._send(404, {'message': 'not found'})

    def do_PATCH(self) -> None:  # noqa: N802
        if not self._authorize():
            return
        parsed = urlparse(self.path)
        body = self._body()
        self._record(body)
        match = re.fullmatch(r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)', parsed.path)
        if match and int(match.group(1)) in STATE.issues:
            issue = STATE.issues[int(match.group(1))]
            issue['state'] = body.get('state', issue['state'])
            issue['state_reason'] = body.get('state_reason', issue['state_reason'])
            self._send(200, STATE.public_issue(issue))
            return
        self._send(404, {'message': 'not found'})

    def do_PUT(self) -> None:  # noqa: N802
        if not self._authorize():
            return
        parsed = urlparse(self.path)
        self._record()
        match = re.fullmatch(r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)/lock', parsed.path)
        if match and int(match.group(1)) in STATE.issues:
            STATE.issues[int(match.group(1))]['locked'] = True
            self._send(204)
            return
        self._send(404, {'message': 'not found'})

    def do_DELETE(self) -> None:  # noqa: N802
        if not self._authorize():
            return
        parsed = urlparse(self.path)
        self._record()
        match = re.fullmatch(r'/repos/forwardemail/status\.forwardemail\.net/issues/(\d+)/lock', parsed.path)
        if match and int(match.group(1)) in STATE.issues:
            STATE.issues[int(match.group(1))]['locked'] = False
            self._send(204)
            return
        self._send(404, {'message': 'not found'})


def run(command: list[str], env: dict[str, str], expected: int = 0) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, env=env, text=True, capture_output=True, check=False)
    if result.returncode != expected:
        raise AssertionError(
            f'command failed ({result.returncode} != {expected}): {command}\nstdout:\n{result.stdout}\nstderr:\n{result.stderr}'
        )
    return result


def main() -> None:
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    api_url = f'http://127.0.0.1:{server.server_port}'

    with tempfile.TemporaryDirectory(prefix='forwardemail-incident-test-') as temporary:
        root = Path(temporary)
        state_dir = root / 'state'
        state_dir.mkdir(mode=0o700)
        env_file = root / 'incident.env'
        service_state = root / 'service.state'
        service_state_dir = root / 'unit-states'
        service_state_dir.mkdir()
        logger_output = root / 'logger.txt'
        mock_bin = root / 'bin'
        mock_bin.mkdir()

        systemctl = mock_bin / 'systemctl'
        systemctl.write_text(
            '#!/bin/bash\n'
            'set -euo pipefail\n'
            'operation="${1:-}"\n'
            'unit="${!#}"\n'
            'case "$operation" in\n'
            '  is-active) expected=active ;;\n'
            '  is-failed) expected=failed ;;\n'
            '  *) exit 2 ;;\n'
            'esac\n'
            'if [[ -n "${MOCK_SYSTEMD_STATE_DIR:-}" && -f "$MOCK_SYSTEMD_STATE_DIR/$unit" ]]; then\n'
            '  grep -qx "$expected" "$MOCK_SYSTEMD_STATE_DIR/$unit"\n'
            'else\n'
            '  grep -qx "$expected" "$MOCK_SYSTEMD_STATE"\n'
            'fi\n'
        )
        logger = mock_bin / 'logger'
        logger.write_text(
            '#!/bin/bash\n'
            'set -euo pipefail\n'
            'printf "%q " "$@" >> "$MOCK_LOGGER_OUTPUT"\n'
            "printf '\\n' >> \"$MOCK_LOGGER_OUTPUT\"\n"
        )
        clock = mock_bin / 'date'
        clock.write_text(
            '#!/bin/bash\n'
            'set -euo pipefail\n'
            'if [[ "$*" == *"+%s"* ]]; then\n'
            '  value=$(cat "$MOCK_TIME_FILE")\n'
            '  printf "%s\\n" "$value"\n'
            '  printf "%s\\n" "$((value + 61))" > "$MOCK_TIME_FILE"\n'
            'else\n'
            '  exec /usr/bin/date "$@"\n'
            'fi\n'
        )
        systemctl.chmod(0o755)
        logger.chmod(0o755)
        clock.chmod(0o755)

        rendered_reporter = root / 'reporter.sh'
        reporter = REPORTER_TEMPLATE.read_text()
        root_guard = """if (( EUID != 0 )); then
  log_incident 'non_root_invocation'
  exit 0
fi"""
        assert root_guard in reporter
        reporter = reporter.replace(
            root_guard,
            ": # Contract harness bypasses only the production root guard.",
        )
        reporter = reporter.replace('PATH=/usr/sbin:/usr/bin:/sbin:/bin', f'PATH={mock_bin}:/usr/sbin:/usr/bin:/sbin:/bin')
        reporter = reporter.replace('readonly ENV_FILE=/etc/forwardemail-alerts/github-systemd-incident.env', f"readonly ENV_FILE='{env_file}'")
        reporter = reporter.replace('readonly STATE_DIR=/var/lib/forwardemail-alerts', f"readonly STATE_DIR='{state_dir}'")
        reporter = reporter.replace("'https://api.github.com'", f"'{api_url}'")
        rendered_reporter.write_text(reporter)
        rendered_reporter.chmod(0o755)

        env_file.write_text(
            '\n'.join(
                [
                    f'GITHUB_OCTOKIT_TOKEN={TOKEN}',
                    'GITHUB_REPOSITORY=forwardemail/status.forwardemail.net',
                    'SYSTEMD_INCIDENT_PUBLIC_COMPONENT=mongo.forwardemail.net',
                    'SYSTEMD_INCIDENT_COMPONENT_LABEL=mongo-forwardemail-net',
                    'SYSTEMD_INCIDENT_WATCHED_UNITS=mongod.service',
                    'SYSTEMD_INCIDENT_FAILURE_THRESHOLD=3',
                    'SYSTEMD_INCIDENT_RECOVERY_THRESHOLD=3',
                    'SYSTEMD_INCIDENT_OBSERVATION_INTERVAL_SECONDS=60',
                    f'SYSTEMD_INCIDENT_API_URL={api_url}',
                    '',
                ]
            )
        )
        env_file.chmod(0o600)
        service_state.write_text('inactive\n')
        time_file = root / 'time.txt'
        time_file.write_text('1000\n')
        process_env = os.environ.copy()
        process_env.update(
            {
                'MOCK_SYSTEMD_STATE': str(service_state),
                'MOCK_SYSTEMD_STATE_DIR': str(service_state_dir),
                'MOCK_LOGGER_OUTPUT': str(logger_output),
                'MOCK_TIME_FILE': str(time_file),
            }
        )

        # Event plus two inactive reconciliations opens exactly one incident.
        run([str(rendered_reporter), 'event', 'mongod.service'], process_env)
        assert not STATE.issues
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert not STATE.issues
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert len(STATE.issues) == 1, (
            f'issues={STATE.issues!r} calls={STATE.calls!r} '
            f'state={list(state_dir.glob("*"))!r} '
            f'state_text={[path.read_text() for path in state_dir.glob("*.json")]!r} '
            f'logger={logger_output.read_text() if logger_output.exists() else "<none>"}'
        )
        incident_number = next(iter(STATE.issues))
        incident = STATE.issues[incident_number]
        assert incident['state'] == 'open' and incident['locked'] is True
        assert incident['labels'] == ['status', 'mongo-forwardemail-net']
        assert incident['title'] == '🛑 mongo.forwardemail.net is unavailable'
        assert '<!-- forwardemail-systemd-incident:v1:mongo.forwardemail.net -->' in incident['body']

        # Continued failure verifies the owned issue without creating a duplicate.
        calls_before = len(STATE.calls)
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert len(STATE.issues) == 1
        assert len(STATE.calls) == calls_before + 1
        assert STATE.calls[-1]['method'] == 'GET'
        assert STATE.calls[-1]['path'].endswith(f'/issues/{incident_number}')

        # Repair externally removed labels and locking while the unit stays down.
        incident['labels'] = ['status']
        incident['locked'] = False
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert incident['labels'] == ['status', 'mongo-forwardemail-net']
        assert incident['locked'] is True

        # Replace an incident that another label-based workflow closed while the
        # systemd unit is still unhealthy.
        incident['state'] = 'closed'
        incident['state_reason'] = 'completed'
        issue_count_before_replacement = len(STATE.issues)
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert len(STATE.issues) == issue_count_before_replacement + 1
        replacement = STATE.issues[max(STATE.issues)]
        assert replacement['state'] == 'open'
        assert replacement['locked'] is True
        assert replacement['labels'] == ['status', 'mongo-forwardemail-net']
        incident = replacement
        incident_number = replacement['number']

        # Two healthy observations keep the issue open; the third resolves it.
        service_state.write_text('active\n')
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert incident['state'] == 'open'
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert incident['state'] == 'open'
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert incident['state'] == 'closed'
        assert incident['state_reason'] == 'completed'
        assert incident['locked'] is True
        assert len(incident['comments']) == 1
        assert incident['comments'][0].startswith(
            '**Resolved:** Automated health checks confirm **mongo.forwardemail.net** has recovered'
        )

        # Unmapped units are ignored without API writes.
        calls_before = len(STATE.calls)
        run([str(rendered_reporter), 'event', 'ssh.service'], process_env)
        assert len(STATE.calls) == calls_before

        state = json.loads((state_dir / 'systemd-incident-mongo.forwardemail.net.json').read_text())
        assert state == {
            'failure_count': 0,
            'recovery_count': 0,
            'issue_number': 0,
            'opened_at': 0,
            'last_event_at': 0,
        }
        assert TOKEN not in logger_output.read_text()

        # Recover an issue that GitHub accepted before local issue state could be
        # committed.  Threshold state must trigger marker-based rediscovery on a
        # healthy observation, then apply the ordinary three-sample recovery
        # debounce without creating a duplicate.
        interrupted_number = STATE.next_number
        STATE.next_number += 1
        interrupted = {
            'number': interrupted_number,
            'html_url': f'http://example.invalid/issues/{interrupted_number}',
            'title': '🛑 mongo.forwardemail.net is unavailable',
            'body': (
                'Automated service health checks detected a sustained interruption '
                'affecting **mongo.forwardemail.net**.\n\n'
                '<!-- forwardemail-systemd-incident:v1:mongo.forwardemail.net -->'
            ),
            'labels': ['status'],
            'state': 'open',
            'state_reason': None,
            'locked': True,
            'comments': [],
        }
        STATE.issues[interrupted_number] = interrupted
        (state_dir / 'systemd-incident-mongo.forwardemail.net.json').write_text(
            json.dumps(
                {
                    'failure_count': 3,
                    'recovery_count': 0,
                    'issue_number': 0,
                    'opened_at': 0,
                    'last_event_at': 0,
                }
            )
        )
        issue_count_before = len(STATE.issues)
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert interrupted['state'] == 'open'
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert interrupted['state'] == 'open'
        run([str(rendered_reporter), 'reconcile'], process_env)
        assert interrupted['state'] == 'closed'
        assert interrupted['state_reason'] == 'completed'
        assert interrupted['locked'] is True
        assert interrupted['labels'] == ['status', 'mongo-forwardemail-net']
        assert len(interrupted['comments']) == 1
        assert len(STATE.issues) == issue_count_before

        # The live Logs monitor slug has no repository label yet.  A Logs-host
        # reporter must provision, verify, assign, lock, and later resolve it.
        assert 'logs-forwardemail-net' not in STATE.labels
        logs_state_dir = root / 'logs-state'
        logs_state_dir.mkdir(mode=0o700)
        logs_env_file = root / 'logs-incident.env'
        logs_env_file.write_text(
            '\n'.join(
                [
                    f'GITHUB_OCTOKIT_TOKEN={TOKEN}',
                    'GITHUB_REPOSITORY=forwardemail/status.forwardemail.net',
                    'SYSTEMD_INCIDENT_PUBLIC_COMPONENT=logs.forwardemail.net',
                    'SYSTEMD_INCIDENT_COMPONENT_LABEL=logs-forwardemail-net',
                    'SYSTEMD_INCIDENT_WATCHED_UNITS=mongod.service',
                    'SYSTEMD_INCIDENT_FAILURE_THRESHOLD=3',
                    'SYSTEMD_INCIDENT_RECOVERY_THRESHOLD=3',
                    'SYSTEMD_INCIDENT_OBSERVATION_INTERVAL_SECONDS=60',
                    f'SYSTEMD_INCIDENT_API_URL={api_url}',
                    '',
                ]
            )
        )
        logs_env_file.chmod(0o600)
        logs_reporter_source = REPORTER_TEMPLATE.read_text()
        assert (
            'redis.forwardemail.net:redis-forwardemail-net:valkey-server.service'
            in logs_reporter_source
        )
        assert (
            'bree.forwardemail.net:bree-forwardemail-net:pm2-deploy.service:'
            'pm2-health-check.service'
            in logs_reporter_source
        )
        logs_reporter_source = logs_reporter_source.replace(
            root_guard,
            ': # Contract harness bypasses only the production root guard.',
        )
        logs_reporter_source = logs_reporter_source.replace(
            'PATH=/usr/sbin:/usr/bin:/sbin:/bin',
            f'PATH={mock_bin}:/usr/sbin:/usr/bin:/sbin:/bin',
        )
        logs_reporter_source = logs_reporter_source.replace(
            'readonly ENV_FILE=/etc/forwardemail-alerts/github-systemd-incident.env',
            f"readonly ENV_FILE='{logs_env_file}'",
        )
        logs_reporter_source = logs_reporter_source.replace(
            'readonly STATE_DIR=/var/lib/forwardemail-alerts',
            f"readonly STATE_DIR='{logs_state_dir}'",
        )
        logs_reporter_source = logs_reporter_source.replace(
            "'https://api.github.com'",
            f"'{api_url}'",
        )
        logs_reporter = root / 'logs-reporter.sh'
        logs_reporter.write_text(logs_reporter_source)
        logs_reporter.chmod(0o755)
        service_state.write_text('inactive\n')
        logs_issue_numbers_before = set(STATE.issues)
        logs_calls_before = len(STATE.calls)
        run([str(logs_reporter), 'event', 'mongod.service'], process_env)
        run([str(logs_reporter), 'reconcile'], process_env)
        run([str(logs_reporter), 'reconcile'], process_env)
        logs_issue_numbers = set(STATE.issues) - logs_issue_numbers_before
        assert len(logs_issue_numbers) == 1
        logs_incident = STATE.issues[logs_issue_numbers.pop()]
        assert logs_incident['title'] == '🛑 logs.forwardemail.net is unavailable'
        assert logs_incident['labels'] == ['status', 'logs-forwardemail-net']
        assert logs_incident['state'] == 'open' and logs_incident['locked'] is True
        assert STATE.labels['logs-forwardemail-net'] == {
            'name': 'logs-forwardemail-net',
            'color': 'ededed',
            'description': 'Upptime monitor: logs.forwardemail.net',
        }
        logs_calls = STATE.calls[logs_calls_before:]
        create_label_index = next(
            index
            for index, call in enumerate(logs_calls)
            if call['method'] == 'POST'
            and call['path'] == '/repos/forwardemail/status.forwardemail.net/labels'
        )
        create_issue_index = next(
            index
            for index, call in enumerate(logs_calls)
            if call['method'] == 'POST'
            and call['path'] == '/repos/forwardemail/status.forwardemail.net/issues'
        )
        assert create_label_index < create_issue_index
        service_state.write_text('active\n')
        run([str(logs_reporter), 'reconcile'], process_env)
        run([str(logs_reporter), 'reconcile'], process_env)
        run([str(logs_reporter), 'reconcile'], process_env)
        assert logs_incident['state'] == 'closed'
        assert logs_incident['labels'] == ['status', 'logs-forwardemail-net']
        assert logs_incident['locked'] is True

        # A PM2 host watches both deployment and health units as one public
        # component. Either failure opens the same issue; both must recover before
        # the usual recovery debounce resolves it.
        pm2_state_dir = root / 'pm2-state'
        pm2_state_dir.mkdir(mode=0o700)
        pm2_env_file = root / 'bree-incident.env'
        pm2_env_file.write_text(
            '\n'.join(
                [
                    f'GITHUB_OCTOKIT_TOKEN={TOKEN}',
                    'GITHUB_REPOSITORY=forwardemail/status.forwardemail.net',
                    'SYSTEMD_INCIDENT_PUBLIC_COMPONENT=bree.forwardemail.net',
                    'SYSTEMD_INCIDENT_COMPONENT_LABEL=bree-forwardemail-net',
                    'SYSTEMD_INCIDENT_WATCHED_UNITS=pm2-deploy.service:pm2-health-check.service',
                    'SYSTEMD_INCIDENT_FAILURE_THRESHOLD=3',
                    'SYSTEMD_INCIDENT_RECOVERY_THRESHOLD=3',
                    'SYSTEMD_INCIDENT_OBSERVATION_INTERVAL_SECONDS=60',
                    f'SYSTEMD_INCIDENT_API_URL={api_url}',
                    '',
                ]
            )
        )
        pm2_env_file.chmod(0o600)
        pm2_reporter_source = REPORTER_TEMPLATE.read_text()
        pm2_reporter_source = pm2_reporter_source.replace(
            root_guard,
            ': # Contract harness bypasses only the production root guard.',
        )
        pm2_reporter_source = pm2_reporter_source.replace(
            'PATH=/usr/sbin:/usr/bin:/sbin:/bin',
            f'PATH={mock_bin}:/usr/sbin:/usr/bin:/sbin:/bin',
        )
        pm2_reporter_source = pm2_reporter_source.replace(
            'readonly ENV_FILE=/etc/forwardemail-alerts/github-systemd-incident.env',
            f"readonly ENV_FILE='{pm2_env_file}'",
        )
        pm2_reporter_source = pm2_reporter_source.replace(
            'readonly STATE_DIR=/var/lib/forwardemail-alerts',
            f"readonly STATE_DIR='{pm2_state_dir}'",
        )
        pm2_reporter_source = pm2_reporter_source.replace(
            "'https://api.github.com'",
            f"'{api_url}'",
        )
        pm2_reporter = root / 'bree-reporter.sh'
        pm2_reporter.write_text(pm2_reporter_source)
        pm2_reporter.chmod(0o755)
        (service_state_dir / 'pm2-deploy.service').write_text('inactive\n')
        # A successful oneshot health check is inactive, not active.
        (service_state_dir / 'pm2-health-check.service').write_text('inactive\n')
        pm2_issue_numbers_before = set(STATE.issues)
        run([str(pm2_reporter), 'event', 'pm2-deploy.service'], process_env)
        run([str(pm2_reporter), 'reconcile'], process_env)
        run([str(pm2_reporter), 'reconcile'], process_env)
        pm2_issue_numbers = set(STATE.issues) - pm2_issue_numbers_before
        assert len(pm2_issue_numbers) == 1
        pm2_incident = STATE.issues[pm2_issue_numbers.pop()]
        assert pm2_incident['labels'] == ['status', 'bree-forwardemail-net']
        assert pm2_incident['state'] == 'open' and pm2_incident['locked'] is True
        assert pm2_incident['title'] == '🛑 bree.forwardemail.net is unavailable'
        assert STATE.labels['bree-forwardemail-net'] == {
            'name': 'bree-forwardemail-net',
            'color': 'ededed',
            'description': 'Upptime monitor: bree.forwardemail.net',
        }

        # A failed health check during the same PM2 outage cannot create a second
        # public issue.
        (service_state_dir / 'pm2-health-check.service').write_text('failed\n')
        run([str(pm2_reporter), 'event', 'pm2-health-check.service'], process_env)
        assert len(STATE.issues) == len(pm2_issue_numbers_before) + 1
        assert pm2_incident['state'] == 'open'

        # One recovered PM2 unit is not enough to close the shared incident.
        (service_state_dir / 'pm2-deploy.service').write_text('active\n')
        run([str(pm2_reporter), 'reconcile'], process_env)
        assert pm2_incident['state'] == 'open'
        # The health check returns to its normal inactive oneshot state.
        (service_state_dir / 'pm2-health-check.service').write_text('inactive\n')
        run([str(pm2_reporter), 'reconcile'], process_env)
        run([str(pm2_reporter), 'reconcile'], process_env)
        assert pm2_incident['state'] == 'open'
        run([str(pm2_reporter), 'reconcile'], process_env)
        assert pm2_incident['state'] == 'closed'
        assert pm2_incident['locked'] is True
        assert len(pm2_incident['comments']) == 1

        # Render the user-facing API test against the same mock endpoint.
        rendered_test = root / 'test-cli.sh'
        test_cli = TEST_SCRIPT.read_text().replace("readonly API_URL='https://api.github.com'", f"readonly API_URL='{api_url}'")
        rendered_test.write_text(test_cli)
        rendered_test.chmod(0o755)
        cli_env = os.environ.copy()
        cli_env.update({'GITHUB_OCTOKIT_TOKEN': TOKEN, 'SYSTEMD_INCIDENT_TEST_REPOSITORY': REPOSITORY})
        read_only_count = len(STATE.issues)
        result = run([str(rendered_test)], cli_env)
        assert 'No issue or repository label was created' in result.stdout
        assert len(STATE.issues) == read_only_count

        refused_env = cli_env | {'SYSTEMD_INCIDENT_TEST_MODE': 'lifecycle'}
        run([str(rendered_test)], refused_env, expected=64)
        assert len(STATE.issues) == read_only_count

        lifecycle_env = refused_env | {'SYSTEMD_INCIDENT_TEST_CONFIRM': 'CREATE_AND_CLOSE_GITHUB_TEST_ISSUE'}
        result = run([str(rendered_test)], lifecycle_env)
        assert 'Lifecycle test passed' in result.stdout
        lifecycle_issue = STATE.issues[max(STATE.issues)]
        assert lifecycle_issue['labels'] == []
        assert lifecycle_issue['state'] == 'closed' and lifecycle_issue['locked'] is True

        status_env = cli_env | {
            'SYSTEMD_INCIDENT_TEST_MODE': 'status-lifecycle',
            'SYSTEMD_INCIDENT_TEST_CONFIRM': 'CREATE_AND_CLOSE_PUBLIC_STATUS_INCIDENT',
        }
        result = run([str(rendered_test)], status_env)
        assert 'Lifecycle test passed' in result.stdout
        status_issue = STATE.issues[max(STATE.issues)]
        assert status_issue['labels'] == ['status', 'mongo-forwardemail-net']
        assert status_issue['state'] == 'closed' and status_issue['locked'] is True

    server.shutdown()
    server.server_close()
    thread.join(timeout=2)
    print(
        'PASS: database and PM2 public incidents open once after sustained '
        'failure, stay unique across repeated or second-unit failures, and the '
        'same issue automatically unlocks, comments, closes, and re-locks after '
        'sustained recovery'
    )
    print('PASS: token CLI contract, label provisioning, privacy, and crash recovery')


if __name__ == '__main__':
    main()
