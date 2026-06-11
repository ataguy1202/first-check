// First Check — investment plan engine
//
// Personalized ETF portfolio + account stack, scored by:
//   age + stage + check size + emergency cushion + debt drag + user risk
//   preference (auto/conservative/moderate/aggressive)
//
// Different ETFs than a generic robo-advisor: real popular tickers an
// athlete's agent would actually use (VOO, QQQM, VTI, VGT, VEA, VWO, BND,
// AVUV, SCHG, VYM) tiered by risk capacity.

import type {
  AccountRec,
  AllocationRow,
  FundPick,
  Intake,
  RiskTier,
  TaxBreakdown,
} from "./types";

const ROTH_LIMIT_2026 = 7_000;
const SEP_HARD_CAP_2026 = 69_000;
const SEP_PCT = 0.20; // ~20% of net SE income

/* ────────────────────────────────────────────────────────────────────────
 * Risk scoring
 * ────────────────────────────────────────────────────────────────────── */

export function scoreRisk(intake: Intake): RiskTier {
  if (intake.riskPreference !== "auto") {
    return intake.riskPreference === "conservative"
      ? "conservative"
      : intake.riskPreference === "moderate"
        ? "moderate"
        : "aggressive";
  }

  let score = 0;
  const yearsToRetire = Math.max(1, 65 - intake.age);

  if (yearsToRetire >= 40) score += 40;
  else if (yearsToRetire >= 30) score += 30;
  else if (yearsToRetire >= 20) score += 15;
  else if (yearsToRetire < 10) score -= 20;

  if (intake.checkAmount >= 100_000) score += 10;
  else if (intake.checkAmount >= 25_000) score += 5;

  if (intake.emergencyFund >= intake.annualExpenses / 2) score += 12;
  else if (intake.emergencyFund >= intake.annualExpenses / 4) score += 4;

  if (intake.highInterestDebt > 0) score -= 12;
  if (intake.dependents > 0) score -= 6;

  if (intake.stage === "retired") score -= 25;
  if (intake.stage === "pro-vet") score -= 5; // less time, more income volatility

  if (score >= 55) return "aggressive";
  if (score >= 35) return "growth";
  if (score >= 15) return "moderate";
  return "conservative";
}

/* ────────────────────────────────────────────────────────────────────────
 * ETF allocations by risk tier
 *
 * Each tier is calibrated against the athlete's situation:
 *   - aggressive  → 95/5  → max growth, long horizon, can stomach drawdowns
 *   - growth      → 85/15 → most NIL athletes / young pros
 *   - moderate    → 65/35 → balanced, established pro vet
 *   - conservative→ 40/60 → retired / short-horizon, preserve capital
 *
 * Funds chosen are the actual popular tickers an athlete's agent would
 * recommend — broad index ETFs, not active funds, not single stocks.
 * ────────────────────────────────────────────────────────────────────── */

type AllocSpec = {
  stocksPct: number;
  bondsPct: number;
  funds: FundPick[];
};

const FUND_INFO: Record<string, { name: string; expenseRatio: number; why: string }> = {
  VOO: {
    name: "Vanguard S&P 500",
    expenseRatio: 0.0003,
    why: "The 500 biggest US companies. Cheapest fund in the world. Boring beats clever.",
  },
  VTI: {
    name: "Vanguard Total US Stock Market",
    expenseRatio: 0.0003,
    why: "Every public US company: big, mid, small. Even broader than VOO.",
  },
  QQQM: {
    name: "Invesco NASDAQ-100",
    expenseRatio: 0.0015,
    why: "Top 100 tech-heavy NASDAQ names. Higher growth potential, higher volatility.",
  },
  SCHG: {
    name: "Schwab Large-Cap Growth",
    expenseRatio: 0.0004,
    why: "Big US growth companies. Cheaper QQQM alternative.",
  },
  VGT: {
    name: "Vanguard Information Technology",
    expenseRatio: 0.0009,
    why: "US tech sector concentration: Apple, Microsoft, Nvidia heavy.",
  },
  AVUV: {
    name: "Avantis US Small-Cap Value",
    expenseRatio: 0.0025,
    why: "Academic small-cap value premium. Only at very long horizons.",
  },
  VEA: {
    name: "Vanguard Developed International",
    expenseRatio: 0.0005,
    why: "Europe + Japan + Australia. Diversifies away US-only risk.",
  },
  VWO: {
    name: "Vanguard Emerging Markets",
    expenseRatio: 0.0008,
    why: "China + India + Brazil + Mexico. Higher growth, higher volatility.",
  },
  BND: {
    name: "Vanguard Total US Bond Market",
    expenseRatio: 0.0003,
    why: "The bond floor. Cushions drawdowns when stocks fall.",
  },
  BNDX: {
    name: "Vanguard Total International Bond",
    expenseRatio: 0.0007,
    why: "Bond diversification outside the US.",
  },
  VYM: {
    name: "Vanguard High Dividend Yield",
    expenseRatio: 0.0006,
    why: "Steady dividend payers. Cash flow in down years.",
  },
};

function makeFund(ticker: keyof typeof FUND_INFO, pct: number): FundPick {
  const info = FUND_INFO[ticker];
  return {
    ticker,
    name: info.name,
    pct,
    expenseRatio: info.expenseRatio,
    why: info.why,
  };
}

function allocFor(tier: RiskTier): AllocSpec {
  switch (tier) {
    case "aggressive":
      return {
        stocksPct: 95,
        bondsPct: 5,
        funds: [
          makeFund("VOO", 45),
          makeFund("QQQM", 20),
          makeFund("VEA", 15),
          makeFund("AVUV", 10),
          makeFund("VWO", 5),
          makeFund("BND", 5),
        ],
      };
    case "growth":
      return {
        stocksPct: 85,
        bondsPct: 15,
        funds: [
          makeFund("VOO", 50),
          makeFund("QQQM", 10),
          makeFund("VEA", 15),
          makeFund("AVUV", 5),
          makeFund("VWO", 5),
          makeFund("BND", 15),
        ],
      };
    case "moderate":
      return {
        stocksPct: 65,
        bondsPct: 35,
        funds: [
          makeFund("VTI", 40),
          makeFund("VEA", 15),
          makeFund("VWO", 5),
          makeFund("VYM", 5),
          makeFund("BND", 30),
          makeFund("BNDX", 5),
        ],
      };
    case "conservative":
      return {
        stocksPct: 40,
        bondsPct: 60,
        funds: [
          makeFund("VTI", 25),
          makeFund("VYM", 10),
          makeFund("VEA", 5),
          makeFund("BND", 50),
          makeFund("BNDX", 10),
        ],
      };
  }
}

/* ────────────────────────────────────────────────────────────────────────
 * Cash allocation: tax → debt → emergency → Roth → SEP → HSA → taxable → spend
 * ────────────────────────────────────────────────────────────────────── */

export function buildAllocation(intake: Intake, tax: TaxBreakdown): AllocationRow[] {
  const rows: AllocationRow[] = [];

  // 1 — Tax escrow always first.
  rows.push({
    label: "Tax escrow",
    amount: tax.total,
    category: "tax",
    why: `Set aside ${Math.round(tax.effectiveRate * 100)}% of this check the day it lands. Not withdrawable. This is the IRS's money already.`,
  });

  let remaining = intake.checkAmount - tax.total;
  if (remaining <= 0) return rows;

  // 2 — High-interest debt.
  if (intake.highInterestDebt > 0) {
    const payoff = Math.min(intake.highInterestDebt, remaining);
    rows.push({
      label: "Pay off high-interest debt",
      amount: payoff,
      category: "debt",
      why: "Investing while carrying 20%+ APR is a mathematical loss. Pay it. The interest you avoid is a risk-free return.",
    });
    remaining -= payoff;
  }
  if (remaining <= 0) return rows;

  // 3 — Emergency cushion: 6 months expenses for athletes (short careers).
  const targetEmergency = Math.round(intake.annualExpenses / 2);
  const emergencyGap = Math.max(0, targetEmergency - intake.emergencyFund);
  if (emergencyGap > 0) {
    const allocate = Math.min(emergencyGap, remaining);
    rows.push({
      label: "Emergency cushion (6 months)",
      amount: allocate,
      category: "emergency",
      why: `Build to ~$${targetEmergency.toLocaleString()}. Average NFL career: 3.3 years. Average NBA: 4.5. The cushion is non-negotiable.`,
    });
    remaining -= allocate;
  }
  if (remaining <= 0) return rows;

  // 4 — Roth IRA.
  const rothAlloc = Math.min(ROTH_LIMIT_2026, remaining);
  if (rothAlloc > 0) {
    rows.push({
      label: "Roth IRA (max it)",
      amount: rothAlloc,
      category: "roth",
      why: "At your age you're in a low tax bracket. Tax-free growth for life. Future-you (in the top bracket) will thank you.",
    });
    remaining -= rothAlloc;
  }
  if (remaining <= 0) return rows;

  // 5 — SEP-IRA for NIL athletes (1099 self-employment).
  if (intake.stage === "nil" && remaining > 0) {
    const sepLimit = Math.min(SEP_HARD_CAP_2026, intake.checkAmount * SEP_PCT);
    const sepAlloc = Math.min(sepLimit, remaining);
    if (sepAlloc >= 100) {
      rows.push({
        label: "SEP-IRA",
        amount: Math.round(sepAlloc),
        category: "sep",
        why: "Because NIL income is 1099 (self-employed), you can put up to 20% of net into a SEP-IRA. That's about 10x the Roth limit, and it's tax-deductible.",
      });
      remaining -= sepAlloc;
    }
  }
  if (remaining <= 0) return rows;

  // 6 — Taxable brokerage in broad index funds.
  if (remaining > 500) {
    const invest = Math.round(remaining * 0.75);
    rows.push({
      label: "Taxable brokerage",
      amount: invest,
      category: "taxable",
      why: "Park in your personalized ETF mix. Set automatic dividend reinvestment. Don't touch for 10 years.",
    });
    remaining -= invest;
  }

  // 7 — Spend.
  if (remaining > 0) {
    rows.push({
      label: "Spend / enjoy responsibly",
      amount: remaining,
      category: "spend",
      why: "You earned this. Treat yourself, your family, something meaningful. Just stay inside this number.",
    });
  }

  return rows;
}

/* ────────────────────────────────────────────────────────────────────────
 * Build account recommendations with risk-tier ETF picks
 * ────────────────────────────────────────────────────────────────────── */

export function buildAccounts(
  _intake: Intake,
  allocation: AllocationRow[],
  tier: RiskTier,
): AccountRec[] {
  const recs: AccountRec[] = [];
  const spec = allocFor(tier);

  const rothAmount = allocation.find((a) => a.category === "roth")?.amount ?? 0;
  const sepAmount = allocation.find((a) => a.category === "sep")?.amount ?? 0;
  const taxableAmount = allocation.find((a) => a.category === "taxable")?.amount ?? 0;

  if (rothAmount > 0) {
    recs.push({
      kind: "roth-ira",
      name: "Roth IRA",
      broker: "Fidelity (recommended) or Schwab",
      funds: spec.funds,
      why: "Tax-free growth for life. Roth wins for any athlete in a low bracket today (you).",
      targetContribution: rothAmount,
    });
  }

  if (sepAmount > 0) {
    recs.push({
      kind: "sep-ira",
      name: "SEP-IRA",
      broker: "Fidelity (recommended)",
      funds: spec.funds,
      why: "Only available because your NIL income is 1099. Lets you put away ~10x more than Roth, and the contribution is tax-deductible.",
      targetContribution: sepAmount,
    });
  }

  if (taxableAmount > 0) {
    recs.push({
      kind: "taxable",
      name: "Taxable brokerage",
      broker: "Fidelity, Schwab, or Vanguard",
      funds: spec.funds.filter((f) => f.ticker !== "VYM"), // VYM has dividend tax drag
      why: "After tax-advantaged accounts are full, this is where excess goes. Stays liquid. Capital gains hold for 1+ year for the long-term rate.",
      targetContribution: taxableAmount,
    });
  }

  return recs;
}
