// First Check — 30-year wealth projection
//
// Bootstrap from real S&P 500 historical annual returns 1928-2024.
// Returns p10 / p50 / p90 outcomes at 5, 10, 20, and 30 years from now.

import type { Projection, AllocationRow } from "./types";

const SP500_RETURNS = [
  0.4381, -0.083, -0.2512, -0.4384, -0.0864, 0.4998, -0.0119, 0.4674, 0.3194, -0.3534,
  0.2928, -0.011, -0.1067, -0.1277, 0.1917, 0.2506, 0.1903, 0.3582, -0.0843, 0.052,
  0.057, 0.183, 0.3081, 0.2368, 0.1815, -0.0121, 0.5256, 0.3260, 0.0744, -0.1078,
  0.4336, 0.1196, 0.0047, 0.2689, -0.0873, 0.2280, 0.1648, 0.1245, -0.1006, 0.2398,
  0.1106, -0.0850, 0.0401, 0.1431, 0.1898, -0.1466, -0.2647, 0.3720, 0.2384, -0.0718,
  0.0656, 0.1844, 0.3242, -0.0491, 0.2155, 0.2256, 0.0627, 0.3173, 0.1867, 0.0525,
  0.1661, 0.3169, -0.0310, 0.3047, 0.0762, 0.1008, 0.0132, 0.3758, 0.2296, 0.3336,
  0.2858, 0.2104, -0.0910, -0.1189, -0.2210, 0.2868, 0.1088, 0.0491, 0.1579, 0.0549,
  -0.3700, 0.2646, 0.1506, 0.0211, 0.1600, 0.3239, 0.1369, 0.0138, 0.1196, 0.2183,
  -0.0438, 0.3149, 0.1840, 0.2871, -0.1811, 0.2629, 0.2511,
];

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Project the user's invested portion forward through Monte Carlo.
 * Returns wealth at 5, 10, 20, 30 years out.
 */
export function projectWealth(allocation: AllocationRow[]): Projection[] {
  const investedNow = allocation
    .filter((a) => a.category === "roth" || a.category === "sep" || a.category === "taxable" || a.category === "hsa")
    .reduce((s, a) => s + a.amount, 0);

  if (investedNow <= 0) return [];

  const horizons = [5, 10, 20, 30];
  const paths = 3000;
  const r = rng(42);

  return horizons.map((years) => {
    const finals: number[] = [];
    for (let p = 0; p < paths; p++) {
      let w = investedNow;
      for (let y = 0; y < years; y++) {
        const ret = SP500_RETURNS[Math.floor(r() * SP500_RETURNS.length)];
        w *= 1 + ret;
      }
      finals.push(w);
    }
    finals.sort((a, b) => a - b);
    const p10 = finals[Math.floor(paths * 0.1)];
    const p50 = finals[Math.floor(paths * 0.5)];
    const p90 = finals[Math.floor(paths * 0.9)];
    return { years, median: p50, p10, p90 };
  });
}
