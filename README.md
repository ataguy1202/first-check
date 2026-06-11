# 💵 First Check

**The financial playbook every athlete deserves — built for the 99% who never had an agent.**

Free AI tool. Pick your situation (NIL deal, drafted rookie, etc.) or upload your contract. Get back the personalized investment plan the top-1% already have — in about a minute.

---

## What it does

1. **Tax math.** Real federal + state + self-employment tax owed on your check.
2. **Quarterly schedule.** The 4 estimated payment dates + amounts the IRS expects but doesn't withhold.
3. **Personalized investment plan.** Which account is right for YOUR stage (Roth IRA, SEP-IRA, HSA, taxable) and exactly which funds to buy (FZROX, FXAIX, etc).
4. **30-year Monte Carlo projection.** 3,000-path bootstrap from real S&P returns 1928–2024.
5. **The 6 athlete kills.** Defensive checklist of the patterns that have bankrupted previous athletes.
6. **This-week action plan.** What to actually do today, tomorrow, next week.

Output: a single printable plan you can hand to your parents, coach, or compliance office.

## Why it exists

1 in 6 NFL players file for bankruptcy within 12 years of retirement — six times the general population (NBER, 2015).

In a 2022 NCAA survey, **49% of college athletes** said they need tax + investment education. **Only 9%** had ever met with a financial counselor.

Now NIL has put $1.95B/year into the hands of athletes who never had a financial advisor in their family. The math fails them the same way it failed the pros.

First Check exists to give every athlete — NIL, drafted, pro, retired — the personalized investment math the top 1% already have.

## What's in here

```
first-check/
├── app/
│   ├── page.tsx              # Pick scenario → analyze → plan
│   ├── globals.css           # Athletic dark editorial palette
│   ├── icon.tsx              # Favicon (server-rendered)
│   └── opengraph-image.tsx   # 1200×630 LinkedIn preview
├── components/
│   ├── Brand.tsx             # Wordmark + glyph
│   ├── Hero.tsx              # Editorial hero
│   ├── ScenarioPicker.tsx    # 3 click-to-run athlete profiles
│   ├── AnalysisStream.tsx    # Live "analyzing" agent UI
│   └── PlanArtifact.tsx      # The 1-page printable plan
├── lib/
│   ├── types.ts
│   ├── tax-engine.ts         # Federal + state + SE tax
│   ├── quarterly-schedule.ts # IRS estimated payment dates
│   ├── investment-plan.ts    # Account stack + fund picks
│   ├── projection.ts         # 3K-path Monte Carlo
│   ├── kills.ts              # The 6 athlete kills
│   ├── scenarios.ts          # 3 preset athlete situations
│   └── plan-builder.ts       # Orchestrator
└── POST_DRAFT.md             # LinkedIn copy (placeholders to fill)
```

## Stack

- **Framework:** Next.js 16 (App Router) + Tailwind v4
- **Animation:** Framer Motion
- **Charts:** Pure SVG (no chart library)
- **Math:** Deterministic tax engine + bootstrap Monte Carlo
- **Data:** S&P 500 annual returns 1928–2024 embedded inline (public domain)
- **Deploy:** Vercel
- **Storage:** None. Stateless. Math runs in your browser.

## Run locally

```bash
git clone https://github.com/ataguy1202/first-check
cd first-check
npm install
npm run dev
```

Open [localhost:3040](http://localhost:3040).

No environment variables needed. Everything runs client-side.

## What First Check is NOT

- A robo-advisor (no fiduciary duty, no AUM)
- A signup product (no account, no email capture)
- A data-harvesting funnel
- A substitute for a real fiduciary if your situation is complex
- A contract-replacement (it flags clauses; talk to a lawyer before signing)

## Sources

- NBER Working Paper 21085 — Carlson, Kim, Lusardi, Camerer (2015) — Bankruptcy Rates Among NFL Players with Short-Lived Income Spikes
- Opendorse NIL at 3 Annual Report (June 2025)
- 2022 NCAA Student-Athlete Experience Survey
- IRS Taxpayer Advocate blog on NIL tax obligations (December 2023)
- Bloomberg Tax Management Memo on NIL earnings risk

## Series context

First Check is post 3 in a recurring LinkedIn series of AI tools that open access for people who otherwise wouldn't have it.

- **Post 1** — [Hoops Lens](https://github.com/ataguy1202/hoops-lens): NBA-grade scouting reports from amateur basketball film
- **Post 2** — [Stretch](https://github.com/ataguy1202/stretch): dietitian-grade nutrition planning on SNAP benefits
- **Post 3** — **First Check**: the financial playbook the top-1% have, for the 99%

Different domain, same throughline: take a service the wealthy already buy and make it free.

## License

MIT
