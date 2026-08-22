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

// gmail.com is the only Google consumer From domain whose published
// organizational policy is p=none. Googlemail and Google are handled by their
// published p=quarantine and p=reject policies, respectively.
function shouldRejectUnauthenticatedGmail(session, isTruthSource, isLegitDSN) {
  return (
    session.originalFromAddressDomain === 'gmail.com' &&
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
  shouldRejectUnauthenticatedGmail
};
