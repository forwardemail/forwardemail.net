#!/usr/bin/env python3

from pathlib import Path
import sys

REPO = (
    Path(sys.argv[1])
    if len(sys.argv) > 1
    else Path(__file__).resolve().parents[2]
)
PLAYBOOKS = REPO / "ansible" / "playbooks"
TEMPLATES = PLAYBOOKS / "templates"
SECURITY = PLAYBOOKS / "security.yml"
SCRIPT = TEMPLATES / "send-failure-notification.sh.j2"
SENDER = TEMPLATES / "send-rate-limited-email.sh.j2"
UNIT = TEMPLATES / "failure-notification@.service.j2"
INCIDENT_REPORTER = TEMPLATES / "report-systemd-status-incident.sh.j2"


def require(content, needle, source):
    if needle not in content:
        raise AssertionError(f"{source}: missing {needle!r}")


def require_before(content, first, second, source):
    require(content, first, source)
    require(content, second, source)
    if content.index(first) >= content.index(second):
        raise AssertionError(
            f"{source}: {first!r} must execute before {second!r}"
        )


def main():
    security = SECURITY.read_text(encoding="utf-8")
    script = SCRIPT.read_text(encoding="utf-8")
    sender = SENDER.read_text(encoding="utf-8")
    unit = UNIT.read_text(encoding="utf-8")
    incident_reporter = INCIDENT_REPORTER.read_text(encoding="utf-8")

    for variable in (
        "MONITOR_UNIT",
        "MONITOR_SERVICE_RESULT",
        "MONITOR_EXIT_CODE",
        "MONITOR_EXIT_STATUS",
        "MONITOR_INVOCATION_ID",
    ):
        require(script, variable, SCRIPT.name)

    require(script, "ignored_non_failure_monitor_context", SCRIPT.name)
    require(script, "ignored_monitor_unit_mismatch", SCRIPT.name)
    require(script, "ignored_invalid_monitor_result", SCRIPT.name)
    require(script, "start-limit-hit", SCRIPT.name)
    require(script, "_SYSTEMD_INVOCATION_ID=", SCRIPT.name)
    require(script, "TriggerResult=", SCRIPT.name)
    require(script, "TriggerExitCode=", SCRIPT.name)
    require(script, "TriggerExitStatus=", SCRIPT.name)
    require(script, "TriggerInvocationID=", SCRIPT.name)
    require(script, "=== CURRENT UNIT PROPERTIES ===", SCRIPT.name)
    require(script, "=== CURRENT SERVICE STATUS ===", SCRIPT.name)
    require(script, "=== EXACT FAILURE INVOCATION JOURNAL ===", SCRIPT.name)
    require(script, "=== INTERPRETATION ===", SCRIPT.name)
    require(script, "systemctl status", SCRIPT.name)
    require(script, "--no-pager --full -n 100", SCRIPT.name)
    require(script, "-n 200 --no-pager --output=short-iso-precise", SCRIPT.name)
    require(script, "redact_diagnostics", SCRIPT.name)
    require(script, "[REDACTED PRIVATE KEY]", SCRIPT.name)
    require(script, "[REDACTED_GITHUB_TOKEN]", SCRIPT.name)
    require(script, "EMAIL_BODY_FILE", SCRIPT.name)
    require(script, "--body-file", SCRIPT.name)
    require(script, "EmailQueue=", SCRIPT.name)
    require(script, "--report-status", SCRIPT.name)
    require(
        script,
        "systemd_failure_email_previously_queued=true",
        SCRIPT.name,
    )
    require(script, "curl --config -", SCRIPT.name)
    require(script, "unset TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN", SCRIPT.name)
    require(script, "systemd_failure_sms_skipped_by_policy", SCRIPT.name)
    require(script, "FORWARDEMAIL_SMS_HOST", SCRIPT.name)
    require(script, "FORWARDEMAIL_SMS_SERVICES", SCRIPT.name)
    require(script, "HOST_NAME=$(hostname", SCRIPT.name)
    if "HOST_NAME=$(hostname -f" in script:
        raise AssertionError(
            f"{SCRIPT.name}: routing must not trust provider PTR FQDN"
        )
    for approved_pair in (
        "mongo.forwardemail.net|mongod.service",
        "logs.forwardemail.net|mongod.service",
        "redis.forwardemail.net|valkey-server.service",
    ):
        require(script, approved_pair, SCRIPT.name)
    for approved_pm2_unit in (
        "pm2-deploy.service",
        "pm2-health-check.service",
    ):
        require(script, approved_pm2_unit, SCRIPT.name)
    require(script, "systemd_failure_sms_skipped_invalid_policy", SCRIPT.name)
    if "curl -u" in script or "--user \"$TWILIO" in script:
        raise AssertionError(
            f"{SCRIPT.name}: Twilio credential must not appear in curl argv"
        )

    sms_start = script.index('sms_body="[SYSTEMD FAILURE]')
    sms_end = script.index("form_body=$(jq -rn", sms_start)
    sms_block = script[sms_start:sms_end]
    require(sms_block, "Unit=$UNIT_NAME", "SMS payload")
    require(sms_block, "Host=$HOST_NAME", "SMS payload")
    require(sms_block, "Result=$MONITOR_RESULT_VALUE", "SMS payload")
    require(sms_block, "EmailQueue=$EMAIL_DELIVERY_STATUS", "SMS payload")
    require(sms_block, "cut -c1-320", "SMS payload")
    for forbidden in (
        "LOGS",
        "INVOCATION_LOGS",
        "SERVICE_STATUS",
        "CURRENT_PROPERTIES",
        "TriggerInvocationID",
    ):
        if forbidden in sms_block:
            raise AssertionError(
                f"SMS payload: private diagnostic {forbidden!r} is prohibited"
            )

    require_before(
        script,
        "ignored_non_failure_monitor_context",
        "/usr/local/bin/send-rate-limited-email.sh",
        SCRIPT.name,
    )
    require_before(
        script,
        "ignored_monitor_unit_mismatch",
        "/usr/local/bin/send-rate-limited-email.sh",
        SCRIPT.name,
    )
    require_before(
        script,
        "/usr/local/bin/send-rate-limited-email.sh",
        "systemd_failure_sms_skipped_by_policy",
        SCRIPT.name,
    )
    require_before(
        script,
        "/usr/local/bin/send-rate-limited-email.sh",
        "systemd_failure_sms_skipped_invalid_policy",
        SCRIPT.name,
    )
    require_before(
        script,
        "systemd_failure_sms_skipped_by_policy",
        'source "$TWILIO_ENV_FILE"',
        SCRIPT.name,
    )
    require_before(
        script,
        "unset TWILIO_ACCOUNT_SID TWILIO_AUTH_TOKEN",
        "curl --config -",
        SCRIPT.name,
    )

    require(sender, "--report-status", SENDER.name)
    require(sender, "--body-file", SENDER.name)
    require(sender, "BODY=$(cat -- \"$BODY_FILE\")", SENDER.name)
    require(sender, "131072", SENDER.name)
    require(sender, "report_status queued", SENDER.name)
    require(sender, "report_status suppressed", SENDER.name)
    require(sender, "report_status failed", SENDER.name)

    public_start = incident_reporter.index("readonly ISSUE_TITLE=")
    public_end = incident_reporter.index("IFS=/", public_start)
    public_payload = incident_reporter[public_start:public_end]
    require(
        public_payload,
        "Automated service health checks detected a sustained interruption",
        INCIDENT_REPORTER.name,
    )
    require(
        public_payload,
        "We are investigating and will update this incident",
        INCIDENT_REPORTER.name,
    )
    for forbidden in (
        "MONITOR_",
        "TriggerResult",
        "TriggerExit",
        "InvocationID",
        "journalctl",
        "systemctl status",
        "SERVICE_STATUS",
        "INVOCATION_LOGS",
    ):
        if forbidden in public_payload:
            raise AssertionError(
                f"{INCIDENT_REPORTER.name}: public payload contains {forbidden!r}"
            )

    require(unit, "RefuseManualStart=true", UNIT.name)
    require(
        unit,
        "ConditionPathExists=/etc/forwardemail-alerts/systemd-notifier-policy",
        UNIT.name,
    )
    require(unit, "FORWARDEMAIL_SMS_HOST", UNIT.name)
    require(unit, "FORWARDEMAIL_SMS_SERVICES", UNIT.name)
    require(unit, "ExecStart=/usr/local/bin/send-failure-notification.sh %i", UNIT.name)

    require(security, "Deploy Twilio environment on eligible SMS hosts", SECURITY.name)
    require(
        security,
        "Remove Twilio environment from email-only hosts",
        SECURITY.name,
    )
    require(
        security,
        "forwardemail_systemd_sms_enabled | bool",
        SECURITY.name,
    )
    require(security, "security_sms_services | default([])", SECURITY.name)
    require(security, "pm2-deploy.service", SECURITY.name)
    require(security, "pm2-health-check.service", SECURITY.name)
    require(security, "Disable notifications while updating alert policy", SECURITY.name)
    require(security, "Remove old alert policy marker", SECURITY.name)
    require(security, "Verify legacy detailed SMS body is absent", SECURITY.name)
    require(security, "Mark current failure notification policy ready", SECURITY.name)
    require(security, "Re-enable updated failure notifications", SECURITY.name)
    require(security, "forwardemail-alert-policy", SECURITY.name)

    print(
        "PASS: exact systemd context and invocation logs are enforced; every "
        "genuine failure reaches email first; only validated MongoDB, Logs, "
        "Redis, and PM2 startup or health mappings add bounded SMS; private "
        "email retains redacted properties, status, and exact invocation logs; "
        "public incidents remain generic"
    )


if __name__ == "__main__":
    main()
