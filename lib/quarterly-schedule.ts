// First Check — quarterly estimated payment schedule
//
// The thing 95% of NIL athletes miss. IRS requires quarterly payments if you
// expect to owe $1K+. Penalty applies even if you pay all at the end of the
// year. These dates are the canonical 2026 IRS Form 1040-ES due dates.

import type { QuarterlyPayment, TaxBreakdown } from "./types";

const QUARTERS = [
  { label: "Q1 2026 (Jan–Mar)", due: "April 15, 2026" },
  { label: "Q2 2026 (Apr–May)", due: "June 16, 2026" },
  { label: "Q3 2026 (Jun–Aug)", due: "September 15, 2026" },
  { label: "Q4 2026 (Sep–Dec)", due: "January 15, 2027" },
];

/**
 * Split the total tax bill into 4 equal quarterly estimated payments.
 * In practice the IRS lets you pay annualized (uneven), but for an athlete
 * with one big check the safe move is to set aside 4 equal blocks and pay
 * them when due.
 */
export function buildQuarterlySchedule(tax: TaxBreakdown): QuarterlyPayment[] {
  const each = Math.ceil(tax.total / 4);
  return QUARTERS.map((q) => ({
    dueDate: q.due,
    amount: each,
    label: q.label,
  }));
}
