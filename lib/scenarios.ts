// First Check — preset athlete scenarios
//
// Three click-to-run scenarios so the LinkedIn demo doesn't require typing.
// Each one is a real, common athlete situation that lands on a different
// part of the plan.

import type { Intake } from "./types";

export type Scenario = {
  key: string;
  title: string;
  badge: string;
  hint: string;
  intake: Intake;
};

export const SCENARIOS: Scenario[] = [
  {
    key: "nil-25k",
    title: "$25K NIL deal at a mid-major",
    badge: "Most common",
    hint: "Redshirt freshman gets a local dealership deal. No agent. Watch what First Check tells them to do.",
    intake: {
      name: "Sample · NIL athlete",
      stage: "nil",
      checkAmount: 25_000,
      age: 19,
      state: "NC",
      filingStatus: "single",
      highInterestDebt: 0,
      emergencyFund: 0,
      annualExpenses: 12_000,
      hasW2WithMatch: false,
      dependents: 0,
      riskPreference: "auto",
    },
  },
  {
    key: "rookie-840k",
    title: "Undrafted rookie · league minimum",
    badge: "Career may be 1.8 years",
    hint: "$840K rookie minimum sounds like a fortune. After taxes and agent fees it's $450K, and the career might be over by Christmas.",
    intake: {
      name: "Sample · Pro rookie",
      stage: "drafted-rookie",
      checkAmount: 840_000,
      age: 23,
      state: "NJ",
      filingStatus: "single",
      highInterestDebt: 0,
      emergencyFund: 0,
      annualExpenses: 60_000,
      hasW2WithMatch: true,
      dependents: 0,
      riskPreference: "auto",
    },
  },
  {
    key: "nil-5k",
    title: "$5K NIL deal at a non-Power-5 school",
    badge: "The 14,000 athletes outside the Power 4",
    hint: "Walk-on with a $5K dorm-room deal. No agent. The math still works, and it changes everything by retirement.",
    intake: {
      name: "Sample · NIL walk-on",
      stage: "nil",
      checkAmount: 5_000,
      age: 20,
      state: "NC",
      filingStatus: "single",
      highInterestDebt: 0,
      emergencyFund: 500,
      annualExpenses: 9_000,
      hasW2WithMatch: false,
      dependents: 0,
      riskPreference: "auto",
    },
  },
];
