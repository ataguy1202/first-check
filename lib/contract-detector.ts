// First Check — contract clause detector
//
// Deterministic pattern matching for the 6 common NIL/athlete contract
// traps. Runs entirely client-side on plain text. Used both for the
// "sample contract" demo mode (no API key needed) and as a fallback layer
// over LLM extraction for real uploads.

import type { ContractAnalysis, ContractFlag } from "./types";

type Pattern = {
  /** Headline name of the bad clause. */
  clause: string;
  /** Severity label. */
  severity: "low" | "medium" | "high";
  /** Regexes that detect this clause. */
  patterns: RegExp[];
  /** Why it's bad. */
  why: string;
  /** What to push for instead. */
  fix: string;
};

const PATTERNS: Pattern[] = [
  {
    clause: "No exit / no termination clause",
    severity: "high",
    patterns: [
      /perpetual/i,
      /irrevocable/i,
      /(?:term|duration).{0,40}(unlimited|indefinite|perpetual)/i,
    ],
    why: "Locks you in even if the brand breaches the deal. The brand can sit on your name forever while paying nothing.",
    fix: 'Insist on a "Termination for Convenience" clause with 30-day notice on either side, or at least an exit-on-payment-default.',
  },
  {
    clause: "Vague payment terms",
    severity: "high",
    patterns: [
      /payment.{0,20}upon.{0,20}completion/i,
      /(?:to be determined|TBD).{0,40}(payment|compensation)/i,
      /paid.{0,20}quarterly.{0,40}performance/i,
    ],
    why: '"Upon completion" with no defined date lets the brand delay forever. "Performance-based" with no metric is a way to never pay you.',
    fix: "Demand specific payment dates (Net-30 or Net-15) and concrete deliverables. No payment language without numbers attached.",
  },
  {
    clause: "Mandatory arbitration in brand's location",
    severity: "medium",
    patterns: [
      /(?:binding )?arbitration/i,
      /(JAMS|AAA|American Arbitration Association)/i,
      /(?:venue|forum).{0,40}exclusive/i,
    ],
    why: "Forces you to fight legal battles in the brand's home city with the brand's lawyers. Massively favors the better-resourced side.",
    fix: "Require either small-claims court in YOUR jurisdiction OR a neutral arbitrator in a third-party location.",
  },
  {
    clause: "Broad morality clause",
    severity: "high",
    patterns: [
      /moral/i,
      /(?:damaging|negative).{0,30}(behavior|conduct|publicity)/i,
      /reputation/i,
      /allegation/i,
    ],
    why: "If defined as 'allegations' instead of 'convictions', any social media controversy can void payment. Used to claw back checks already earned.",
    fix: 'Limit to "criminal convictions" or "documented intentional misconduct." Allegations alone should never be enough to cancel.',
  },
  {
    clause: "Overbroad exclusivity",
    severity: "high",
    patterns: [
      /exclusiv/i,
      /(?:no other|may not).{0,40}(endorsement|brand|product)/i,
      /entire category/i,
    ],
    why: "Locks you out of an entire industry (e.g. 'any beverage company') for one deal. Can cost you 6-figure deals later.",
    fix: 'Limit exclusivity to specific named competitors, not categories. "No Pepsi" not "no beverages."',
  },
  {
    clause: "Perpetual IP / image transfer",
    severity: "high",
    patterns: [
      /perpetual.{0,30}(license|rights|use)/i,
      /in perpetuity/i,
      /worldwide rights/i,
      /irrevocable.{0,30}license/i,
    ],
    why: "Brand owns your image forever even after the deal ends. They can re-use your face in ads 20 years later with no payment.",
    fix: 'Cap usage rights to the campaign duration + 6 months. Anything longer should require a separate "image rights" payment.',
  },
];

/**
 * Run pattern detection over plain contract text. Returns the flags found
 * (severity-sorted, high first).
 */
export function detectClauses(text: string): ContractFlag[] {
  const flags: ContractFlag[] = [];
  for (const p of PATTERNS) {
    for (const rx of p.patterns) {
      const m = text.match(rx);
      if (m) {
        const quoteStart = Math.max(0, (m.index ?? 0) - 30);
        const quoteEnd = Math.min(text.length, (m.index ?? 0) + 120);
        flags.push({
          clause: p.clause,
          severity: p.severity,
          quote: text.slice(quoteStart, quoteEnd).trim().slice(0, 220),
          why: p.why,
          fix: p.fix,
        });
        break;
      }
    }
  }
  const order = { high: 0, medium: 1, low: 2 };
  return flags.sort((a, b) => order[a.severity] - order[b.severity]);
}

/* ────────────────────────────────────────────────────────────────────────
 * Pre-baked sample NIL contract for demo mode (no API key required)
 * ────────────────────────────────────────────────────────────────────── */

export const SAMPLE_CONTRACT_TEXT = `
NAME, IMAGE, AND LIKENESS AGREEMENT

This Agreement is entered into between Sunbelt Auto Dealers, LLC ("Brand")
and Athlete ("Talent") for the use of Talent's name, image, and likeness
for promotional purposes.

1. TERM. This Agreement shall remain in effect in perpetuity unless
terminated by Brand at its sole discretion.

2. COMPENSATION. Brand agrees to pay Talent the sum of $25,000, payable
upon completion of the campaign deliverables to Brand's reasonable
satisfaction.

3. EXCLUSIVITY. Talent agrees not to enter into any endorsement, sponsorship,
or promotional arrangement with any other beverage company, automotive
dealership, or restaurant chain during the Term.

4. LICENSE OF RIGHTS. Talent hereby grants Brand an irrevocable, perpetual,
worldwide license to use Talent's name, image, and likeness in any media
now known or later developed.

5. MORALITY. Brand may terminate this Agreement and withhold any unpaid
compensation in the event of any allegation of damaging behavior,
controversial conduct, or negative publicity involving the Talent.

6. DISPUTES. Any dispute arising from this Agreement shall be resolved by
binding arbitration administered by JAMS in Wilmington, Delaware. The
prevailing party shall be entitled to attorneys' fees.

7. ASSIGNMENT. Brand may assign this Agreement to any successor entity or
affiliate without notice to Talent.
`;

/**
 * Wrapper used by the upload UI to analyze the sample contract for the
 * deterministic demo (no API key required).
 */
export function analyzeSampleContract(): ContractAnalysis {
  return {
    athleteName: "Sample athlete",
    dealAmount: 25_000,
    flags: detectClauses(SAMPLE_CONTRACT_TEXT),
    summary:
      "This is a real-world pattern: a small-dollar NIL deal with several clauses that would be considered predatory in any other context.",
  };
}
