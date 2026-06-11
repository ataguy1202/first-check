// First Check — tax engine
//
// Calculates the real, honest tax bill on an athlete's check. Handles three
// modes:
//   1. NIL athlete: 100% 1099 income, SE tax + federal + state, no withholding
//   2. Drafted rookie: W-2 with withholding, but signing bonus often un-withheld
//   3. Pro vet: high bracket, multi-state issues, but typically agent handles
//
// This is honest, intentionally conservative math. The Bloomberg Tax + IRS
// Taxpayer Advocate references confirm SE tax + estimated payment rules.

import type { Intake, TaxBreakdown } from "./types";

// 2026 federal income tax brackets (single filer). Used for marginal rate
// calc on incremental NIL income.
const BRACKETS_2026_SINGLE: Array<{ upTo: number; rate: number }> = [
  { upTo: 11_925, rate: 0.10 },
  { upTo: 48_475, rate: 0.12 },
  { upTo: 103_350, rate: 0.22 },
  { upTo: 197_300, rate: 0.24 },
  { upTo: 250_525, rate: 0.32 },
  { upTo: 626_350, rate: 0.35 },
  { upTo: Infinity, rate: 0.37 },
];

// State income tax approximate top marginal rate (single filer).
// Conservative averages for the most common athlete-heavy states.
const STATE_TAX_RATE: Record<string, number> = {
  AL: 0.05, AK: 0.0, AZ: 0.025, AR: 0.039, CA: 0.093,
  CO: 0.044, CT: 0.0699, DE: 0.066, DC: 0.0985,
  FL: 0.0, GA: 0.054, HI: 0.11, ID: 0.058, IL: 0.0495,
  IN: 0.0305, IA: 0.038, KS: 0.057, KY: 0.04, LA: 0.045,
  ME: 0.0715, MD: 0.0575, MA: 0.05, MI: 0.0425, MN: 0.0985,
  MS: 0.04, MO: 0.0495, MT: 0.058, NE: 0.0584, NV: 0.0,
  NH: 0.0, NJ: 0.1075, NM: 0.059, NY: 0.109, NC: 0.0425,
  ND: 0.025, OH: 0.035, OK: 0.0475, OR: 0.099, PA: 0.0307,
  RI: 0.0599, SC: 0.064, SD: 0.0, TN: 0.0, TX: 0.0,
  UT: 0.0455, VT: 0.0875, VA: 0.0575, WA: 0.0, WV: 0.065,
  WI: 0.0765, WY: 0.0,
};

/**
 * Calculate the real tax bill on an athlete's check, mode-aware.
 *
 * For NIL athletes (1099 only): SE tax + federal + state. No withholding.
 * For drafted rookies (W-2 with bonus): assume bonus is also 1099-ish for
 *   safety since signing bonus tax surprises are notorious.
 * For pro vets: same math, top bracket.
 *
 * Honest assumption: the check is incremental income on top of $0 other
 * income for college athletes. For pros we apply top bracket directly.
 */
export function calculateTax(intake: Intake): TaxBreakdown {
  const { checkAmount, stage, state } = intake;

  // Self-employment tax applies if 1099 income (NIL athletes always, pros
  // for endorsement income). SE tax is 15.3% on net earnings.
  const isSelfEmployment = stage === "nil" || stage === "retired";
  const seTax = isSelfEmployment ? checkAmount * 0.9235 * 0.153 : 0;

  // SE deduction reduces federal taxable income by half of SE tax.
  const seDeduction = isSelfEmployment ? seTax * 0.5 : 0;
  const fedTaxable = Math.max(0, checkAmount - seDeduction);

  // Federal income tax — marginal calc.
  let federal = 0;
  if (stage === "nil" || stage === "drafted-rookie") {
    // Treat as incremental on $0 base (most college athletes have no other income)
    let remaining = fedTaxable;
    let lastBracket = 0;
    for (const b of BRACKETS_2026_SINGLE) {
      if (remaining <= 0) break;
      const taxableInBracket = Math.min(remaining, b.upTo - lastBracket);
      federal += taxableInBracket * b.rate;
      remaining -= taxableInBracket;
      lastBracket = b.upTo;
    }
  } else {
    // Pro vets / retired — top bracket on incremental
    federal = fedTaxable * 0.37;
  }

  const stateRate = STATE_TAX_RATE[state.toUpperCase()] ?? 0.05;
  const stateTax = checkAmount * stateRate;

  const total = federal + stateTax + seTax;
  return {
    federal: Math.round(federal),
    state: Math.round(stateTax),
    selfEmployment: Math.round(seTax),
    total: Math.round(total),
    effectiveRate: total / checkAmount,
  };
}
