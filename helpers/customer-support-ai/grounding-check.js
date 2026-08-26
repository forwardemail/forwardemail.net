/**
 * Copyright (c) Forward Email LLC
 * SPDX-License-Identifier: BUSL-1.1
 */

const axios = require('axios');

const logger = require('#helpers/logger');
const config = require('#config');

//
// A model's own stated confidence about its answer is close to worthless -
// LLMs are poorly calibrated at "am I sure," and asking directly gets a
// number that doesn't track correctness. What actually works is a
// verification task: a separate call asking "is every claim in this
// specific draft actually supported by the context," which checks facts
// against a text it can compare against, rather than introspecting on its
// own certainty.
//
// This does NOT block or rewrite anything - it produces a signal. What to
// do with an ungrounded draft (flag for review, regenerate, etc.) is a
// decision for the caller. The Enterprise-scale/SLA finding
// (.customer-support-archive/golden-candidates.answerable.yaml id 9001)
// is the concrete case this exists for: a draft can score perfectly on
// fact-recall while still asserting an unsupported quantitative
// conclusion (comparing numbers of different scope) that no amount of
// "did it mention X" checking would catch.
//

const HOST = (config.ollamaHost || 'http://127.0.0.1:11434').replace(
  'localhost',
  '127.0.0.1'
);

function buildPrompt(response, context) {
  return `You are fact-checking a customer support draft reply against the knowledge-base context it was supposed to be grounded in.

KNOWLEDGE BASE CONTEXT (what the draft was allowed to use):
${context || '(no context was retrieved)'}

DRAFT REPLY:
${response}

Identify every substantive factual or quantitative claim in the draft reply (numbers, limits, prices, capabilities, comparisons, what a plan includes, etc. - not greetings or generic offers to help). For each one, check whether it is directly supported by the context above.

A claim is UNSUPPORTED if:
- It states a specific number, limit, price, or term that isn't in the context
- It compares two numbers/quantities of different scope or units (e.g. a monthly total vs. a daily per-recipient limit) as if equivalent
- It asserts something is true, covered, or included without the context actually saying so
- It goes beyond what the context states, even if the general topic is covered

Respond with ONLY this JSON, nothing else:
{"claims": [{"claim": "<short quote or paraphrase of the claim>", "supported": boolean, "issue": "<if unsupported, what's wrong - empty string if supported>"}]}

If the draft makes no substantive factual claims at all, respond with {"claims": []}.`;
}

/**
 * @param {string} response - the generated draft text
 * @param {string} context - the retrieved KB context the draft was built from
 * @returns {Promise<{grounded: boolean, claims: Array, checkFailed: boolean}>}
 */
async function checkGrounding(response, context) {
  if (!response || !response.trim()) {
    return { grounded: true, claims: [], checkFailed: false };
  }

  try {
    const prompt = buildPrompt(response, context);

    const apiResponse = await axios.post(
      `${HOST}/api/chat`,
      {
        model: config.ollamaModel,
        messages: [{ role: 'user', content: prompt }],
        stream: false,
        format: 'json',
        think: true,
        options: {
          temperature: 0,
          // Has to reason over the full context AND the full response AND
          // check every claim against it - the most reasoning-heavy of
          // the judge-style calls in this pipeline. 4000 truncated on a
          // long context + long response case; matching the generation
          // budget rather than guessing again.
          num_predict: 8000
        }
      },
      { timeout: 90_000 }
    );

    if (apiResponse.data.done_reason === 'length') {
      throw new Error('grounding check hit num_predict before finishing');
    }

    const raw =
      apiResponse.data.message?.content ||
      apiResponse.data.message?.thinking ||
      '';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/{[\s\S]*}/);
      parsed = m ? JSON.parse(m[0]) : null;
    }

    if (!parsed || !Array.isArray(parsed.claims)) {
      throw new Error('unparseable grounding check response');
    }

    const grounded = parsed.claims.every((c) => c.supported !== false);

    return { grounded, claims: parsed.claims, checkFailed: false };
  } catch (err) {
    logger.error(err, { context: 'grounding check' });
    // Fail open (grounded: true, but checkFailed: true) - a failed check
    // shouldn't itself block a draft. Callers can inspect checkFailed to
    // treat "unknown" differently from "verified grounded" if they need to.
    return { grounded: true, claims: [], checkFailed: true };
  }
}

module.exports = { checkGrounding };
