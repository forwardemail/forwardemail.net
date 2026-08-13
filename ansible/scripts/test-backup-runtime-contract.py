#!/usr/bin/env python3
"""Exercise generated backup scripts with mocked external dependencies.

The test extracts the shell script bodies embedded in the Ansible playbooks and
runs them in a temporary directory. Only the root-owned passphrase path is
remapped to a fixture; all pipeline, error-handling, and command behavior is
otherwise the deployed script.
"""

from __future__ import annotations

import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import textwrap

ROOT = Path(__file__).resolve().parents[2]
PASSPHRASE_PATH = "/etc/forwardemail-backups/backup.passphrase"


def extract_script(playbook: str, script_name: str) -> str:
    source = (ROOT / playbook).read_text(encoding="utf-8")
    pattern = re.compile(
        rf"^\s*dest: /usr/local/bin/{re.escape(script_name)}\n"
        r"^\s*mode: .+\n^\s*content: \|\n"
        r"(?P<body>(?:^ {10}.*\n|^\n)+)",
        re.MULTILINE,
    )
    match = pattern.search(source)
    if match is None:
        raise RuntimeError(f"could not extract {script_name} from {playbook}")

    return textwrap.dedent(match.group("body"))


def write_executable(path: Path, content: str) -> None:
    path.write_text(content, encoding="utf-8")
    path.chmod(0o755)


def create_mocks(temp: Path) -> Path:
    bin_dir = temp / "bin"
    bin_dir.mkdir()
    write_executable(
        bin_dir / "aws",
        """#!/bin/bash
set -euo pipefail
printf 'aws:%s\\n' "$*" >> "$MOCK_LOG"
if [ "$1" = s3 ] && [ "$2" = cp ]; then
  bandwidth=$(awk -F= '/^[[:space:]]*max_bandwidth[[:space:]]*=/ { gsub(/[[:space:]]/, "", $2); print $2 }' "$AWS_CONFIG_FILE")
  if ! [[ "$bandwidth" =~ ^[1-9][0-9]*$ ]]; then
    echo "invalid literal for int() with base 10: '$bandwidth'" >&2
    exit 1
  fi
  cat >/dev/null
fi
""",
    )
    write_executable(
        bin_dir / "gpg",
        """#!/bin/bash
set -euo pipefail
printf 'gpg:%s\\n' "$*" >> "$MOCK_LOG"
passphrase_file=""
while [ "$#" -gt 0 ]; do
  if [ "$1" = --passphrase-file ]; then
    passphrase_file="$2"
    shift
  fi
  shift
done
[ -s "$passphrase_file" ]
cat
""",
    )
    write_executable(
        bin_dir / "mongodump",
        """#!/bin/bash
set -euo pipefail
printf 'mongodump:%s\\n' "$*" >> "$MOCK_LOG"
printf 'mock mongo archive'
[ "${FAIL_MONGODUMP:-0}" != 1 ]
""",
    )
    write_executable(
        bin_dir / "valkey-cli",
        """#!/bin/bash
set -euo pipefail
printf 'valkey-cli:%s\\n' "$*" >> "$MOCK_LOG"
case " $* " in
  *" LASTSAVE "*)
    if [ "${VALKEY_LASTSAVE_STATIC:-0}" = 1 ]; then
      printf '%s\\n' 100
      exit 0
    fi
    count=0
    [ -f "$VALKEY_CALLS" ] && count=$(cat "$VALKEY_CALLS")
    count=$((count + 1))
    printf '%s' "$count" > "$VALKEY_CALLS"
    printf '%s\\n' "$count"
    ;;
  *" BGSAVE "*) printf '%s\\n' 'Background saving started' ;;
  *" INFO persistence "*)
    count=0
    [ -f "$VALKEY_INFO_CALLS" ] && count=$(cat "$VALKEY_INFO_CALLS")
    count=$((count + 1))
    printf '%s' "$count" > "$VALKEY_INFO_CALLS"
    if [ "${VALKEY_BGSAVE_STUCK:-0}" = 1 ]; then
      printf 'rdb_bgsave_in_progress:1\\nrdb_last_bgsave_status:ok\\n'
    elif [ "$count" -eq 1 ]; then
      printf 'rdb_bgsave_in_progress:1\\nrdb_last_bgsave_status:ok\\n'
    else
      printf 'rdb_bgsave_in_progress:0\\nrdb_last_bgsave_status:ok\\n'
    fi
    ;;
esac
""",
    )
    write_executable(bin_dir / "sleep", "#!/bin/bash\nexit 0\n")
    return bin_dir


def prepare_script(temp: Path, playbook: str, script_name: str, passphrase: Path) -> Path:
    script = extract_script(playbook, script_name).replace(
        PASSPHRASE_PATH, str(passphrase)
    )
    target = temp / script_name
    write_executable(target, script)
    return target


def run(script: Path, temp: Path, **extra: str) -> subprocess.CompletedProcess[str]:
    environment = {
        "AWS_ACCESS_KEY_ID": "test-access-key",
        "AWS_CONFIG_FILE": str(temp / "aws" / "backup-config"),
        "AWS_ENDPOINT_URL": "https://example.invalid",
        "AWS_SECRET_ACCESS_KEY": "test-secret-key",
        "HOME": str(temp),
        "LOGS_HOST": "logs.example.test",
        "LOGS_NAME": "logs",
        "LOGS_PORT": "27017",
        "MOCK_LOG": str(temp / "mock.log"),
        "MONGO_HOST": "mongo.example.test",
        "MONGO_NAME": "mail",
        "MONGO_PORT": "27017",
        "PATH": f"{temp / 'bin'}:{os.environ['PATH']}",
        "REDIS_DATA_DIR": str(temp / "redis-data"),
        "REDIS_HOST": "redis.example.test",
        "REDIS_PORT": "6379",
        "VALKEY_CALLS": str(temp / "valkey-calls"),
        "VALKEY_INFO_CALLS": str(temp / "valkey-info-calls"),
    }
    environment.update(extra)
    return subprocess.run(
        ["bash", str(script)],
        check=False,
        capture_output=True,
        encoding="utf-8",
        env=environment,
    )


def create_passphrase(temp: Path) -> Path:
    passphrase = temp / "backup.passphrase"
    passphrase.write_text("backup-secret\n", encoding="utf-8")
    return passphrase


def create_redis_dump(temp: Path) -> None:
    redis_data = temp / "redis-data"
    redis_data.mkdir()
    (redis_data / "dump.rdb").write_bytes(b"mock redis dump")


def test_successful_backups_normalize_decimal_bandwidth_and_use_file_passphrases() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = create_passphrase(temp)
        create_mocks(temp)
        create_redis_dump(temp)
        scripts = [
            prepare_script(temp, "ansible/playbooks/mongo.yml", "backup-mongodb.sh", passphrase),
            prepare_script(temp, "ansible/playbooks/logs.yml", "backup-mongodb.sh", passphrase),
            prepare_script(temp, "ansible/playbooks/redis.yml", "backup-redis.sh", passphrase),
        ]
        for script in scripts:
            result = run(script, temp, BACKUP_MAX_BANDWIDTH="62.5MB/s")
            assert result.returncode == 0, result.stdout + result.stderr
            assert "62500000 bytes/s" in result.stdout

        log = (temp / "mock.log").read_text(encoding="utf-8")
        assert log.count("gpg:") == 3
        assert str(passphrase) in log
        assert "backup-secret" not in log
        assert log.count("aws:s3 cp") == 3


def test_invalid_bandwidth_fails_before_backup_pipeline() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = create_passphrase(temp)
        create_mocks(temp)
        script = prepare_script(
            temp, "ansible/playbooks/mongo.yml", "backup-mongodb.sh", passphrase
        )

        result = run(script, temp, BACKUP_MAX_BANDWIDTH="62.5MB/s; bad")
        assert result.returncode != 0
        assert "Invalid BACKUP_MAX_BANDWIDTH" in result.stdout
        assert not (temp / "mock.log").exists()


def test_empty_passphrase_fails_before_backup_pipeline() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = temp / "backup.passphrase"
        passphrase.touch()
        create_mocks(temp)
        script = prepare_script(
            temp, "ansible/playbooks/mongo.yml", "backup-mongodb.sh", passphrase
        )

        result = run(script, temp)
        assert result.returncode != 0
        assert "passphrase file is missing or empty" in result.stdout
        assert not (temp / "mock.log").exists()


def test_mongodump_failure_is_not_masked_by_downstream_success() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = create_passphrase(temp)
        create_mocks(temp)
        script = prepare_script(
            temp, "ansible/playbooks/mongo.yml", "backup-mongodb.sh", passphrase
        )

        result = run(script, temp, FAIL_MONGODUMP="1")
        assert result.returncode != 0
        assert "Failed to backup/encrypt/upload MongoDB" in result.stdout


def test_redis_waits_for_persistence_state_when_lastsave_is_unchanged() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = create_passphrase(temp)
        create_mocks(temp)
        create_redis_dump(temp)
        script = prepare_script(
            temp, "ansible/playbooks/redis.yml", "backup-redis.sh", passphrase
        )

        result = run(script, temp, VALKEY_LASTSAVE_STATIC="1")
        assert result.returncode == 0, result.stdout + result.stderr
        assert "BGSAVE completed successfully" in result.stdout


def test_redis_bgsave_timeout_is_bounded_and_actionable() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = create_passphrase(temp)
        create_mocks(temp)
        create_redis_dump(temp)
        script = prepare_script(
            temp, "ansible/playbooks/redis.yml", "backup-redis.sh", passphrase
        )

        result = run(
            script,
            temp,
            REDIS_BGSAVE_POLL_INTERVAL="2",
            REDIS_BGSAVE_TIMEOUT="4",
            VALKEY_BGSAVE_STUCK="1",
        )
        assert result.returncode != 0
        assert "BGSAVE timed out after 4 seconds" in result.stdout
        assert "in_progress=1" in result.stdout


def main() -> int:
    tests = [
        test_successful_backups_normalize_decimal_bandwidth_and_use_file_passphrases,
        test_invalid_bandwidth_fails_before_backup_pipeline,
        test_empty_passphrase_fails_before_backup_pipeline,
        test_mongodump_failure_is_not_masked_by_downstream_success,
        test_redis_waits_for_persistence_state_when_lastsave_is_unchanged,
        test_redis_bgsave_timeout_is_bounded_and_actionable,
    ]
    for test in tests:
        test()
        print(f"PASS: {test.__name__}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (AssertionError, OSError, RuntimeError, subprocess.SubprocessError) as error:
        print(f"Backup runtime contract test failed: {error}", file=sys.stderr)
        raise SystemExit(1) from error
