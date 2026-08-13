/*
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

function shouldRejectDmarcReject(session, isTruthSource, isLegitDSN) {
  return (
    session.dmarc &&
    session.dmarc.status &&
    session.dmarc.status.result === 'fail' &&
    session.dmarc.policy === 'reject' &&
    !isLegitDSN &&
    !isTruthSource
  );
}

function shouldRejectDmarcQuarantine(session, isTruthSource, isLegitDSN) {
  return (
    session.dmarc &&
    session.dmarc.status &&
    session.dmarc.status.result === 'fail' &&
    session.dmarc.policy === 'quarantine' &&
    !session.hadAlignedAndPassingDKIM &&
    session.spfFromHeader.status.result !== 'pass' &&
    !isLegitDSN &&
    !isTruthSource
  );
}

function shouldRejectUnauthenticatedMessage(
  session,
  isTruthSource,
  isLegitDSN
) {
  return (
    !isTruthSource &&
    !isLegitDSN &&
    !session.hadAlignedAndPassingDKIM &&
    session.spfFromHeader.status.result !== 'pass' &&
    !(
      session.dmarc &&
      session.dmarc.status &&
      session.dmarc.status.result === 'pass'
    )
  );
}

module.exports = {
  shouldRejectDmarcReject,
  shouldRejectDmarcQuarantine,
  shouldRejectUnauthenticatedMessage
};
