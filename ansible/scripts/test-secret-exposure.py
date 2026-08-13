#!/usr/bin/env python3
"""Regression checks for Ansible credential handling."""

from __future__ import annotations

from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]


def read(relative_path: str) -> str:
    return (ROOT / relative_path).read_text(encoding="utf-8")


def require(source: str, needle: str, label: str, failures: list[str]) -> None:
    if needle not in source:
        failures.append(f"missing {label}: {needle}")


def forbid(source: str, needle: str, label: str, failures: list[str]) -> None:
    if needle in source:
        failures.append(f"unsafe {label}: {needle}")


def main() -> int:
    failures: list[str] = []
    mongo = read("ansible/playbooks/mongo.yml")
    logs = read("ansible/playbooks/logs.yml")
    redis = read("ansible/playbooks/redis.yml")
    env = read("ansible/playbooks/env.yml")
    disaster_recovery = read("ansible/docs/DISASTER_RECOVERY.md")
    operations_guide = read("ansible/docs/README_MONGO_REDIS.md")

    for name, source in (("mongo", mongo), ("logs", logs)):
        require(
            source,
            "EnvironmentFile=/etc/forwardemail-backups/mongodb.env",
            f"{name} backup EnvironmentFile",
            failures,
        )
        require(
            source,
            "mongodump --config /etc/forwardemail-backups/mongodump.yml",
            f"{name} mongodump config file",
            failures,
        )
        require(
            source,
            "GPG_PASSPHRASE_FILE=/etc/forwardemail-backups/backup.passphrase",
            f"{name} runtime GPG passphrase file variable",
            failures,
        )
        require(
            source,
            "[ ! -s \"$GPG_PASSPHRASE_FILE\" ]",
            f"{name} nonempty GPG passphrase check",
            failures,
        )
        require(
            source,
            "--passphrase-file \"$GPG_PASSPHRASE_FILE\"",
            f"{name} GPG passphrase file",
            failures,
        )
        require(source, "set -o pipefail", f"{name} pipeline failure propagation", failures)
        require(
            source,
            "mode: '0600'",
            f"{name} root-only secret-file mode",
            failures,
        )
        require(source, "no_log: true", f"{name} Ansible redaction", failures)
        forbid(source, "mongodump --uri=\"mongodb://${", f"{name} password URI", failures)
        forbid(source, "BACKUP_SECRET=\"${BACKUP_SECRET}\"", f"{name} runtime secret variable", failures)
        forbid(source, "--passphrase \"$BACKUP_SECRET\"", f"{name} GPG argument", failures)
        forbid(source, "PASS first 8 chars", f"{name} password preview", failures)
        forbid(source, "export MONGO_PASS=", f"{name} shell password export", failures)
        forbid(source, "export LOGS_PASS=", f"{name} shell password export", failures)
        forbid(source, 'Environment="MONGO_PASS=', f"{name} MongoDB service password", failures)
        forbid(source, 'Environment="LOGS_PASS=', f"{name} logs service password", failures)
        forbid(source, 'Environment="AWS_SECRET_ACCESS_KEY=', f"{name} AWS secret unit", failures)

    require(
        redis,
        "EnvironmentFile=/etc/forwardemail-backups/redis.env",
        "Valkey EnvironmentFile",
        failures,
    )
    require(redis, "export REDISCLI_AUTH=\"$REDIS_PASSWORD\"", "Valkey environment authentication", failures)
    require(
        redis,
        "GPG_PASSPHRASE_FILE=/etc/forwardemail-backups/backup.passphrase",
        "Valkey runtime GPG passphrase file variable",
        failures,
    )
    require(redis, "[ ! -s \"$GPG_PASSPHRASE_FILE\" ]", "Valkey nonempty GPG passphrase check", failures)
    require(redis, "--passphrase-file \"$GPG_PASSPHRASE_FILE\"", "Valkey GPG passphrase file", failures)
    require(redis, "set -o pipefail", "Valkey pipeline failure propagation", failures)
    require(redis, "group: valkey", "restricted Valkey config group", failures)
    require(redis, "mode: '0640'", "restricted Valkey config mode", failures)
    require(redis, "no_log: true", "Valkey Ansible redaction", failures)
    forbid(redis, "VALKEY_CMD=\"${VALKEY_CMD} -a ${REDIS_PASSWORD}\"", "Valkey password argument", failures)
    forbid(redis, 'redis-cli -p 6380 --tls -a "$REDIS_PASSWORD"', "Valkey password example", failures)
    forbid(redis, "BACKUP_SECRET=\"${BACKUP_SECRET}\"", "Valkey runtime secret variable", failures)
    forbid(redis, "--passphrase \"$BACKUP_SECRET\"", "Valkey GPG argument", failures)
    forbid(redis, 'Environment="REDIS_PASSWORD=', "Valkey password unit", failures)
    forbid(redis, 'Environment="AWS_SECRET_ACCESS_KEY=', "Valkey AWS secret unit", failures)

    require(
        mongo,
        "OnCalendar=*-*-* 02:00:00 America/Chicago",
        "MongoDB DST-safe Central Time schedule",
        failures,
    )
    require(
        logs,
        "OnCalendar=*-*-* 02:20:00 America/Chicago",
        "logs MongoDB DST-safe Central Time schedule",
        failures,
    )
    require(
        redis,
        "OnCalendar=*-*-* 02:40:00 America/Chicago",
        "Valkey DST-safe Central Time schedule",
        failures,
    )

    require(env, 'mode: "0600"', "application environment-file mode", failures)
    require(env, "no_log: true", "application environment-file redaction", failures)

    for name, source in (
        ("disaster recovery guide", disaster_recovery),
        ("database operations guide", operations_guide),
    ):
        require(
            source,
            "--passphrase-file /etc/forwardemail-backups/backup.passphrase",
            f"{name} protected passphrase file",
            failures,
        )
        forbid(source, '--passphrase "$BACKUP_SECRET"', f"{name} password argument", failures)

    if failures:
        print("Credential handling regression check failed:", file=sys.stderr)
        for failure in failures:
            print(f"- {failure}", file=sys.stderr)
        return 1

    print("Credential handling regression check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
