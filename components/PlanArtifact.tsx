"use client";

import { motion } from "framer-motion";
import type { Plan } from "@/lib/types";
import { MetalButton } from "@/components/ui/metal-button";

const CAT_COLOR: Record<string, string> = {
  tax: "hsl(0 84% 65%)",
  emergency: "hsl(38 92% 60%)",
  debt: "hsl(0 84% 65%)",
  roth: "hsl(88 80% 60%)",
  sep: "hsl(88 80% 60%)",
  hsa: "hsl(88 80% 60%)",
  taxable: "hsl(174 84% 50%)",
  spend: "hsl(0 0% 64%)",
};

const fmt = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(2)}M`
    : v >= 1_000
      ? `$${(v / 1_000).toFixed(v >= 100_000 ? 0 : 1)}K`
      : `$${Math.round(v).toLocaleString()}`;

/**
 * The First Check artifact — a single printable page that visually structures:
 *   01 Tax math (federal + state + SE + total)
 *   02 Quarterly schedule (4 dated payments)
 *   03 Allocation (the save/invest/spend split with reasoning)
 *   04 Accounts (where to put it, what to buy)
 *   05 Projection (30 years)
 *   06 Athlete kills (defensive checklist)
 *   07 This week
 *
 * Designed so each section is scannable in 5 seconds. The whole thing is
 * one print-to-PDF artifact.
 */
export function PlanArtifact({ plan }: { plan: Plan }) {
  const { intake, tax, quarterly, allocation, accounts, projection, kills, headline, thisWeek } = plan;
  const afterTax = intake.checkAmount - tax.total;

  return (
    <motion.article
      id="first-check-plan"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-5xl mx-auto"
    >
      {/* Header card */}
      <header className="relative rounded-3xl border border-border bg-bg-2 overflow-hidden mb-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-signal to-transparent" />
        <div className="p-8 md:p-12">
          <div className="flex items-baseline justify-between mb-4">
            <span className="mono text-[10px] uppercase tracking-[0.32em] text-signal">
              first check plan
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
              for {intake.name}
            </span>
          </div>
          <h2 className="display text-3xl md:text-5xl tracking-tight leading-tight">
            {headline}
          </h2>
        </div>
      </header>

      {/* Tax breakdown */}
      <Section number="01" label="Your real tax bill">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border mb-4">
          <TaxTile label="Federal" value={fmt(tax.federal)} />
          <TaxTile label={`${intake.state.toUpperCase()} state`} value={fmt(tax.state)} />
          <TaxTile label="Self-employment" value={fmt(tax.selfEmployment)} />
          <TaxTile label="Total owed" value={fmt(tax.total)} accent />
        </div>
        <p className="text-fg-muted text-sm leading-relaxed">
          That&apos;s <span className="text-fg num">{(tax.effectiveRate * 100).toFixed(1)}%</span>{" "}
          of your check. The IRS doesn&apos;t withhold a dollar of this. They expect you to put
          it aside yourself. Most athletes don&apos;t. That&apos;s the April surprise.
        </p>
      </Section>

      {/* Quarterly schedule */}
      <Section number="02" label="Quarterly tax payments">
        <div className="rounded-2xl border border-border bg-bg overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-bg-2 border-b border-border">
            <div className="col-span-3 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
              Quarter
            </div>
            <div className="col-span-5 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
              Due
            </div>
            <div className="col-span-4 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim text-right">
              Pay IRS
            </div>
          </div>
          {quarterly.map((q, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-3 px-5 py-3.5 border-b border-border last:border-0"
            >
              <div className="col-span-3 mono text-sm text-fg">Q{i + 1}</div>
              <div className="col-span-5 text-sm text-fg-muted">{q.dueDate}</div>
              <div className="col-span-4 mono text-sm text-fg num text-right">
                {fmt(q.amount)}
              </div>
            </div>
          ))}
        </div>
        <p className="text-fg-muted text-sm leading-relaxed mt-4">
          Set 4 phone reminders right now. Pay each one through{" "}
          <a
            href="https://www.irs.gov/payments/direct-pay"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 decoration-fg-dim hover:decoration-fg text-fg"
          >
            IRS Direct Pay
          </a>
          . Free, takes 60 seconds per payment, prevents the underpayment penalty.
        </p>
      </Section>

      {/* Allocation */}
      <Section number="03" label={`Split your $${intake.checkAmount.toLocaleString()}`}>
        <div className="space-y-3">
          {allocation.map((row, i) => {
            const pct = (row.amount / intake.checkAmount) * 100;
            return (
              <div key={i}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-fg font-medium">{row.label}</span>
                  <span className="mono text-sm text-fg num">
                    {fmt(row.amount)}{" "}
                    <span className="text-fg-dim">({pct.toFixed(0)}%)</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-bg overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(2, pct)}%`,
                      background: `linear-gradient(90deg, ${CAT_COLOR[row.category]}88, ${CAT_COLOR[row.category]})`,
                    }}
                  />
                </div>
                <p className="text-sm text-fg-muted leading-relaxed pl-px">{row.why}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-6 rounded-xl border border-signal/30 bg-signal-soft/40 p-4 text-sm">
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-signal mb-1.5">
            after this plan
          </div>
          <div className="text-fg">
            You&apos;ll have <span className="num font-medium">{fmt(afterTax)}</span> working for you
            instead of sitting in a checking account losing 4% a year to inflation.
          </div>
        </div>
      </Section>

      {/* Accounts */}
      {accounts.length > 0 && (
        <Section
          number="04"
          label={`The accounts and exactly what to buy · risk tier: ${plan.riskTier}`}
        >
          <div className="space-y-5">
            {accounts.map((acc, i) => (
              <div key={i} className="rounded-2xl border border-border bg-bg-2 p-6 md:p-7">
                <div className="flex items-baseline justify-between mb-2.5 gap-3">
                  <div className="font-medium text-fg text-lg leading-tight">{acc.name}</div>
                  <div className="mono text-[10px] uppercase tracking-[0.22em] text-fg-dim text-right">
                    {acc.broker}
                  </div>
                </div>
                <p className="text-sm text-fg-muted leading-relaxed mb-5">{acc.why}</p>
                {acc.targetContribution > 0 && (
                  <div className="mb-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-signal-soft border border-signal/30 mono text-[10px] uppercase tracking-[0.22em] text-fg">
                    put in {fmt(acc.targetContribution)}
                  </div>
                )}
                <div className="rounded-xl border border-border bg-bg overflow-hidden">
                  <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-bg-2 border-b border-border">
                    <div className="col-span-2 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                      %
                    </div>
                    <div className="col-span-2 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                      Ticker
                    </div>
                    <div className="col-span-6 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim">
                      Fund
                    </div>
                    <div className="col-span-2 mono text-[10px] uppercase tracking-[0.18em] text-fg-dim text-right">
                      Fees
                    </div>
                  </div>
                  {acc.funds.map((f, j) => (
                    <div
                      key={j}
                      className="px-4 py-3 border-b border-border last:border-0"
                    >
                      <div className="grid grid-cols-12 gap-3 items-baseline">
                        <div className="col-span-2 display text-fg num">{f.pct}<span className="text-fg-dim text-sm">%</span></div>
                        <div className="col-span-2 mono text-sm text-fg">{f.ticker}</div>
                        <div className="col-span-6 text-sm text-fg-muted">{f.name}</div>
                        <div className="col-span-2 mono text-sm text-fg num text-right">
                          {f.expenseRatio === 0 ? "0.00%" : `${(f.expenseRatio * 100).toFixed(2)}%`}
                        </div>
                      </div>
                      <div className="grid grid-cols-12 gap-3 mt-1.5">
                        <div className="col-start-3 col-span-10 text-[11px] text-fg-dim leading-relaxed">
                          {f.why}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projection */}
      {projection.length > 0 && (
        <Section number="05" label="If you stick with this">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {projection.map((p) => (
              <div key={p.years} className="bg-bg-2 p-5">
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-fg-dim mb-2">
                  in {p.years} years
                </div>
                <div className="display text-2xl md:text-3xl num signal-text">
                  {fmt(p.median)}
                </div>
                <div className="text-[11px] text-fg-dim mt-1.5">
                  range {fmt(p.p10)} – {fmt(p.p90)}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mono text-fg-dim text-center mt-5">
            3,000-path Monte Carlo · bootstrapped from S&amp;P annual returns 1928–2024
          </p>
        </Section>
      )}

      {/* Athlete kills */}
      <Section number="06" label="The 6 ways athletes go broke">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {kills.map((k, i) => (
            <div key={i} className="rounded-2xl border border-border bg-bg-2 p-5">
              <div className="flex items-start gap-3 mb-2.5">
                <span className="mono text-xs text-danger shrink-0 pt-1">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div className="font-medium text-fg leading-snug">{k.title}</div>
              </div>
              <p className="text-sm text-fg-muted leading-relaxed mb-3">{k.why}</p>
              <p className="text-[11px] text-fg-dim italic leading-relaxed">{k.cite}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* This week */}
      <Section number="07" label="This week">
        <ol className="space-y-3">
          {thisWeek.map((step, i) => (
            <li
              key={i}
              className="flex gap-4 py-3.5 border-b border-border last:border-0"
            >
              <span className="mono text-xs text-signal shrink-0 pt-1">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span className="text-fg leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Print CTA */}
      <div className="mt-10 flex flex-col md:flex-row items-center gap-5 justify-between rounded-3xl border border-border bg-bg-2 p-6 md:p-8">
        <div className="text-fg-muted text-sm leading-relaxed">
          This plan is yours. Print it, screenshot it, share it with someone who needs it.
        </div>
        <MetalButton variant="gold" onClick={() => window.print()}>
          Save as PDF ↗
        </MetalButton>
      </div>
    </motion.article>
  );
}

function Section({
  number,
  label,
  children,
}: {
  number: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-bg-2 mb-6 overflow-hidden">
      <div className="p-7 md:p-10">
        <div className="flex items-baseline gap-3 mb-6">
          <span className="display text-xl text-fg-dim num">{number}</span>
          <span className="mono text-[10px] uppercase tracking-[0.28em] text-fg-dim">{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}

function TaxTile({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-bg-2 p-5">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-fg-dim mb-2">{label}</div>
      <div className={`display text-2xl md:text-3xl num ${accent ? "signal-text" : "text-fg"}`}>
        {value}
      </div>
    </div>
  );
}
