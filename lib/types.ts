// First Check — core domain types

export type AthleteStage = "nil" | "drafted-rookie" | "pro-vet" | "retired";
export type FilingStatus = "single" | "mfj";
export type RiskPreference = "conservative" | "moderate" | "aggressive" | "auto";

export type Intake = {
  /** Athlete name (used in artifact). */
  name: string;
  /** What kind of money are we looking at? */
  stage: AthleteStage;
  /** The check amount being planned. */
  checkAmount: number;
  /** Athlete's age (used for Roth vs Trad recommendation). */
  age: number;
  /** State (used for state tax + 529 deduction). */
  state: string;
  /** Filing status — single by default for college-age. */
  filingStatus: FilingStatus;
  /** Existing high-interest debt that should be paid first. */
  highInterestDebt: number;
  /** Existing emergency cash on hand. */
  emergencyFund: number;
  /** Estimated annual ongoing expenses (rent / food / phone / etc). */
  annualExpenses: number;
  /** Does the W-2 job (if any) match a 401k? */
  hasW2WithMatch: boolean;
  /** Kids / dependents (affects EITC, 529, family LLC moves). */
  dependents: number;
  /** Explicit risk preference; "auto" lets the engine score it. */
  riskPreference: RiskPreference;
};

export type TaxBreakdown = {
  federal: number;
  state: number;
  selfEmployment: number;
  total: number;
  effectiveRate: number;
};

export type QuarterlyPayment = {
  dueDate: string;
  amount: number;
  label: string;
};

export type AllocationRow = {
  label: string;
  amount: number;
  category: "tax" | "emergency" | "debt" | "roth" | "sep" | "hsa" | "taxable" | "spend";
  why: string;
};

export type AccountKind = "roth-ira" | "sep-ira" | "hsa" | "taxable" | "401k";

export type FundPick = {
  ticker: string;
  name: string;
  pct: number;
  expenseRatio: number;
  why: string;
};

export type AccountRec = {
  kind: AccountKind;
  name: string;
  /** Where to open it. */
  broker: string;
  /** ETF allocation inside this account, picked by risk tier. */
  funds: FundPick[];
  /** Why this account for this athlete. */
  why: string;
  /** How much they should put in. */
  targetContribution: number;
};

export type RiskTier = "conservative" | "moderate" | "growth" | "aggressive";

export type AthleteKill = {
  title: string;
  why: string;
  cite: string;
};

export type Projection = {
  years: number;
  median: number;
  p10: number;
  p90: number;
};

export type Plan = {
  intake: Intake;
  tax: TaxBreakdown;
  quarterly: QuarterlyPayment[];
  allocation: AllocationRow[];
  accounts: AccountRec[];
  kills: AthleteKill[];
  projection: Projection[];
  /** The risk tier we landed on, surfaced on the artifact. */
  riskTier: RiskTier;
  /** Headline verdict. */
  headline: string;
  /** What to do this week. */
  thisWeek: string[];
};

export type ContractFlag = {
  clause: string;
  severity: "low" | "medium" | "high";
  quote: string;
  why: string;
  fix: string;
};

export type ContractAnalysis = {
  athleteName?: string;
  dealAmount?: number;
  flags: ContractFlag[];
  summary: string;
};
