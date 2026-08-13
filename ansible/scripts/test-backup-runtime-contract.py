#!/usr/bin/env python3
"""Exercise generated backup scripts with mocked external dependencies.

The test extracts the shell script bodies embedded in the Ansible playbooks and
runs them in a temporary directory.  Only the root-owned passphrase path is
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
    count=0
    [ -f "$VALKEY_CALLS" ] && count=$(cat "$VALKEY_CALLS")
    count=$((count + 1))
    printf '%s' "$count" > "$VALKEY_CALLS"
    printf '%s\\n' "$count"
    ;;
  *" BGSAVE "*) printf '%s\\n' 'Background saving started' ;;
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
    }
    environment.update(extra)
    return subprocess.run(
        ["bash", str(script)],
        check=False,
        capture_output=True,
        encoding="utf-8",
        env=environment,
    )


def test_successful_backups_use_file_passphrases() -> None:
    with tempfile.TemporaryDirectory() as temporary:
        temp = Path(temporary)
        passphrase = temp / "backup.passphrase"
        passphrase.write_text("backup-secret\n", encoding="utf-8")
        create_mocks(temp)
        redis_data = temp / "redis-data"
        redis_data.mkdir()
        (redis_data / "dump.rdb").write_bytes(b"mock redis dump")

        scripts = [
            prepare_script(temp, "ansible/playbooks/mongo.yml", "backup-mongodb.sh", passphrase),
            prepare_script(temp, "ansible/playbooks/logs.yml", "backup-mongodb.sh", passphrase),
            prepare_script(temp, "ansible/playbooks/redis.yml", "backup-redis.sh", passphrase),
        ]
        for script in scripts:
            result = run(script, temp)
            assert result.returncode == 0, result.stdout + result.stderr

        log = (temp / "mock.log").read_text(encoding="utf-8")
        assert log.count("gpg:") == 3
        assert str(passphrase) in log
        assert "backup-secret" not in log
        assert log.count("aws:s3 cp") == 3


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
        passphrase = temp / "backup.passphrase"
        passphrase.write_text("backup-secret\n", encoding="utf-8")
        create_mocks(temp)
        script = prepare_script(
            temp, "ansible/playbooks/mongo.yml", "backup-mongodb.sh", passphrase
        )

        result = run(script, temp, FAIL_MONGODUMP="1")
        assert result.returncode != 0
        assert "Failed to backup/encrypt/upload MongoDB" in result.stdout


def main() -> int:
    tests = [
        test_successful_backups_use_file_passphrases,
        test_empty_passphrase_fails_before_backup_pipeline,
        test_mongodump_failure_is_not_masked_by_downstream_success,
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
