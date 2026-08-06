#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path

ENTRYPOINTS = {
    "bree.yml": [("bree", "BREE_HOST")],
    "http.yml": [
        ("web", "WEB_HOST"),
        ("api", "API_HOST"),
        ("caldav", "CALDAV_HOST"),
        ("carddav", "CARDDAV_HOST"),
    ],
    "imap.yml": [("imap", "IMAP_HOST")],
    "mx1.yml": [("mx1", "MX1_HOST")],
    "mx2.yml": [("mx2", "MX2_HOST")],
    "pop3.yml": [("pop3", "POP3_HOST")],
    "smtp.yml": [("smtp", "SMTP_HOST")],
    "sqlite.yml": [("sqlite", "SQLITE_HOST")],
}

PM2_UNITS = ("pm2-deploy.service", "pm2-health-check.service")


def require(text: str, needle: str, context: str) -> None:
    if needle not in text:
        raise AssertionError(f"{context}: missing {needle!r}")


def forbid(text: str, needle: str, context: str) -> None:
    if needle in text:
        raise AssertionError(f"{context}: forbidden {needle!r}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("repo", nargs="?", type=Path)
    args = parser.parse_args()
    repo = args.repo or Path(__file__).resolve().parents[2]
    playbooks = repo / "ansible" / "playbooks"

    for filename, host_specs in ENTRYPOINTS.items():
        path = playbooks / filename
        text = path.read_text(encoding="utf-8")
        security_index = text.index("import_playbook: security.yml")
        node_index = text.index("import_playbook: node.yml")
        if security_index >= node_index:
            raise AssertionError(
                f"{filename}: security must precede node after hostname convergence"
            )
        require(text, "security_expected_alert_hostname: >-", filename)
        require(
            text,
            "{{ forwardemail_entrypoint_expected_hostname }}",
            filename,
        )
        require(text, "security_sms_services:", filename)
        for unit in PM2_UNITS:
            require(text, f"- {unit}", filename)
        for group, env_name in host_specs:
            host_marker = f"hosts: {group}"
            env_marker = f"lookup('env', '{env_name}')"
            host_index = text.index(host_marker)
            env_index = text.index(env_marker, host_index)
            if host_index >= security_index or env_index >= security_index:
                raise AssertionError(
                    f"{filename}: {group}/{env_name} hostname must converge "
                    "before security"
                )
        prefix = text[:security_index]
        require(prefix, "gather_facts: false", filename)
        require(prefix, "- always", filename)
        require(
            prefix,
            "forwardemail_entrypoint_expected_hostname:",
            filename,
        )

    security = (playbooks / "security.yml").read_text(encoding="utf-8")
    require(
        security,
        "security_sms_services | default([])",
        "security.yml",
    )
    require(security, "forwardemail_sms_services:", "security.yml")
    require(security, "forwardemail_systemd_sms_enabled:", "security.yml")
    require(security, "pm2-deploy.service", "security.yml")
    require(security, "pm2-health-check.service", "security.yml")
    require(
        security,
        "forwardemail_sms_services | length > 0",
        "security.yml",
    )
    forbid(
        security,
        "forwardemail_systemd_incident_config | length > 0\n"
        "      no_log: true\n\n"
        "    - name: Remove Twilio",
        "security.yml Twilio deployment",
    )

    unit = (
        playbooks / "templates" / "failure-notification@.service.j2"
    ).read_text(encoding="utf-8")
    require(
        unit,
        "FORWARDEMAIL_SMS_SERVICES",
        "failure-notification unit",
    )

    notifier = (
        playbooks / "templates" / "send-failure-notification.sh.j2"
    ).read_text(encoding="utf-8")
    require(notifier, "SMS_POLICY_UNITS", "failure notifier")
    require(notifier, "pm2-deploy.service", "failure notifier")
    require(notifier, "pm2-health-check.service", "failure notifier")
    forbid(notifier, "SMS_POLICY_UNIT=", "failure notifier singular policy")

    node = (playbooks / "node.yml").read_text(encoding="utf-8")
    require(
        node,
        "ConditionPathExists=!/run/forwardemail-pm2-maintenance",
        "node.yml",
    )
    require(node, "exit 1", "node.yml health failure")
    health_start = node.index("# PM2 HEALTH MONITORING")
    health_end = node.index("- name: Create PM2 health check systemd timer")
    health_block = node[health_start:health_end]
    forbid(
        health_block,
        "send-rate-limited-email.sh",
        "PM2 health centralized delivery",
    )

    health_template = (
        playbooks / "templates" / "pm2-health-check.service.j2"
    ).read_text(encoding="utf-8")
    require(
        health_template,
        "ConditionPathExists=!/run/forwardemail-pm2-maintenance",
        "PM2 health template",
    )

    print(
        "PASS: all PM2 entrypoints converge identity before security; "
        "startup and health failures use exact dual-channel routing; "
        "maintenance and non-core boundaries remain fail-closed"
    )


if __name__ == "__main__":
    main()
