// First Check — plan builder
//
// Orchestrates the modules: tax → quarterly → allocation → accounts →
// projection → kills → final headline + this-week list.

import type { Intake, Plan } from "./types";
import { calculateTax } from "./tax-engine";
import { buildQuarterlySchedule } from "./quarterly-schedule";
import { buildAllocation, buildAccounts, scoreRisk } from "./investment-plan";
import { projectWealth } from "./projection";
import { ATHLETE_KILLS } from "./kills";

export function buildPlan(intake: Intake): Plan {
  const tax = calculateTax(intake);
  const quarterly = buildQuarterlySchedule(tax);
  const riskTier = scoreRisk(intake);
  const allocation = buildAllocation(intake, tax);
  const accounts = buildAccounts(intake, allocation, riskTier);
  const projection = projectWealth(allocation);

  const aftertax = intake.checkAmount - tax.total;
  const headline = buildHeadline(intake, aftertax);
  const thisWeek = buildThisWeek(intake, allocation, accounts);

  return {
    intake,
    tax,
    quarterly,
    allocation,
    accounts,
    kills: ATHLETE_KILLS,
    projection,
    riskTier,
    headline,
    thisWeek,
  };
}

function buildHeadline(intake: Intake, aftertax: number): string {
  if (intake.stage === "nil") {
    return `Your $${intake.checkAmount.toLocaleString()} NIL deal is $${aftertax.toLocaleString()} after taxes. Here's how to turn that into generational wealth.`;
  }
  if (intake.stage === "drafted-rookie") {
    return `Your $${intake.checkAmount.toLocaleString()} rookie deal is $${aftertax.toLocaleString()} after taxes. The average career is 1.8 years, so build the runway now.`;
  }
  if (intake.stage === "pro-vet") {
    return `Your $${intake.checkAmount.toLocaleString()} contract is $${aftertax.toLocaleString()} after taxes. Your peak window is short, so max every tax-advantaged dollar.`;
  }
  return `Your $${intake.checkAmount.toLocaleString()} check is $${aftertax.toLocaleString()} after taxes. Protect what you have, grow what you can.`;
}

function buildThisWeek(
  intake: Intake,
  allocation: ReturnType<typeof buildAllocation>,
  accounts: ReturnType<typeof buildAccounts>,
): string[] {
  const steps: string[] = [];

  const taxRow = allocation.find((a) => a.category === "tax");
  if (taxRow) {
    steps.push(
      `Open a high-yield savings account today and transfer $${taxRow.amount.toLocaleString()} into it. Label it "TAXES, DO NOT TOUCH". Ally, Marcus, or your local credit union all work (~4% APY).`,
    );
  }

  if (accounts.find((a) => a.kind === "roth-ira")) {
    steps.push(
      "Open a Roth IRA at Fidelity (15 minutes online). Buy the ETF mix from the plan. Done. That money grows tax-free for life.",
    );
  }

  if (accounts.find((a) => a.kind === "sep-ira")) {
    steps.push(
      "Open a SEP-IRA at Fidelity. Fund it from the SEP allocation. This is the move 99% of NIL athletes don't know exists.",
    );
  }

  steps.push(
    "Add 4 reminders to your phone: April 15, June 16, Sep 15, and Jan 15. Those are the IRS quarterly tax payment dates.",
  );

  if (intake.stage === "drafted-rookie" || intake.stage === "pro-vet") {
    steps.push(
      "Get Permanent Total Disability insurance this week. A career-ending injury = $0 income forever. Costs ~$5K/yr. The single biggest difference between bankrupt-at-30 and not.",
    );
  }

  if (intake.dependents > 0) {
    steps.push(
      `Open a 529 college savings plan for each of your ${intake.dependents} kid(s). State tax deduction depends on which plan you pick, so check your state's plan first.`,
    );
  }

  return steps;
}
