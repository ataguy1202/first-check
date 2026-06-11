// First Check — the 6 ways athletes go broke
//
// Real, well-documented patterns from NBER's NFL bankruptcy paper, NBA
// case studies, and the World Economic Forum financial-literacy research.
// These show up on the artifact as a defensive checklist.

import type { AthleteKill } from "./types";

export const ATHLETE_KILLS: AthleteKill[] = [
  {
    title: "Saying yes to family + friend loans",
    why: "The first ask becomes every ask. Most athletes can't say no, so the money drains out over years until there's nothing left.",
    cite: "Antoine Walker reportedly lost $108M largely to family loans; Vince Young filed for bankruptcy after similar requests.",
  },
  {
    title: '"Investing" with teammates',
    why: "Restaurant chains, nightclubs, the next Uber. The pitch is always great and the loss rate is near 100%.",
    cite: "Sports Illustrated and ESPN have documented dozens of failed restaurant chains and clubs co-owned by groups of NBA/NFL players.",
  },
  {
    title: "Lifestyle creep with a leased car you can't sustain",
    why: "A $25K NIL deal does not fund the lifestyle of an $800K rookie contract. Most athletes can't downshift after the first big check.",
    cite: "NBER (2015) found earnings and lifestyle peaked in years 1–3 of an NFL career, then collapsed faster than expected.",
  },
  {
    title: "Buying a primary residence before career stabilizes",
    why: "Houses are illiquid. If you're cut, traded, or your NIL deal ends, you can't sell fast without taking a major loss.",
    cite: "ESPN '30 for 30: Broke' documented athletes underwater on luxury homes within 18 months of retirement.",
  },
  {
    title: "Skipping disability insurance",
    why: "Career-ending injury = $0 income forever. Most athletes don't carry permanent total disability coverage. The wealthy ones all do.",
    cite: "Loss-of-value insurance and PTD policies are standard for top draft picks; almost nobody outside the top tier has them.",
  },
  {
    title: "No tax escrow → April surprise",
    why: "Since NIL income is 1099 (no withholding), athletes spend the gross. April comes, IRS bill arrives, money is already gone.",
    cite: "IRS Taxpayer Advocate (2023) issued a specific warning about NIL athletes missing quarterly estimated payments.",
  },
];
