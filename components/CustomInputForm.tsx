"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Intake, AthleteStage } from "@/lib/types";

const STAGES: Array<{ value: AthleteStage; label: string; sub: string }> = [
  { value: "nil", label: "NIL athlete", sub: "College, 1099 income" },
  { value: "drafted-rookie", label: "Drafted rookie", sub: "Just turned pro" },
  { value: "pro-vet", label: "Pro vet", sub: "Multi-year contract" },
  { value: "retired", label: "Retired", sub: "Income stopped" },
];

const DEFAULTS: Intake = {
  name: "Your check",
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
};

/**
 * Custom intake form — six essentials at the top, an optional "more
 * details" toggle revealing the secondary fields. Premium feel matching
 * the rest of the site.
 */
export function CustomInputForm({ onSubmit }: { onSubmit: (intake: Intake) => void }) {
  const [intake, setIntake] = useState<Intake>(DEFAULTS);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = <K extends keyof Intake>(key: K, value: Intake[K]) =>
    setIntake((prev) => ({ ...prev, [key]: value }));

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(intake);
      }}
      className="space-y-5 max-w-2xl"
    >
      {/* Stage picker */}
      <Field label="What kind of money is this?">
        <div className="grid grid-cols-2 gap-2">
          {STAGES.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => set("stage", s.value)}
              className={`text-left p-4 rounded-xl border transition ${
                intake.stage === s.value
                  ? "bg-signal-soft/60 border-signal/40 text-fg"
                  : "bg-bg-2 border-border text-fg-muted hover:border-border-strong hover:text-fg"
              }`}
            >
              <div className="font-medium text-sm leading-tight">{s.label}</div>
              <div className="text-[11px] mono text-fg-dim mt-1">{s.sub}</div>
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Check amount">
          <NumberInput
            value={intake.checkAmount}
            onChange={(v) => set("checkAmount", v)}
            prefix="$"
          />
        </Field>
        <Field label="Your age">
          <NumberInput value={intake.age} onChange={(v) => set("age", v)} suffix="yrs" />
        </Field>
      </div>

      <Field label="State (for state tax math)">
        <input
          type="text"
          maxLength={2}
          value={intake.state}
          onChange={(e) => set("state", e.target.value.toUpperCase().slice(0, 2))}
          placeholder="NC"
          className="w-full bg-bg-2 border border-border rounded-xl py-3.5 px-4 num text-fg uppercase tracking-widest text-lg focus:outline-none focus:border-signal/50"
        />
      </Field>

      <button
        type="button"
        onClick={() => setShowAdvanced((s) => !s)}
        className="mono text-[11px] uppercase tracking-[0.18em] text-fg-dim hover:text-fg transition flex items-center gap-2"
      >
        <span>{showAdvanced ? "−" : "+"}</span>
        <span>{showAdvanced ? "hide details" : "more details (optional)"}</span>
      </button>

      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-5 overflow-hidden border-t border-border pt-5"
        >
          <Field label="Your name" hint="appears on the plan artifact">
            <input
              type="text"
              value={intake.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Maya Johnson"
              className="w-full bg-bg-2 border border-border rounded-xl py-3.5 px-4 text-fg focus:outline-none focus:border-signal/50"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Annual expenses" hint="rent + food + bills × 12">
              <NumberInput
                value={intake.annualExpenses}
                onChange={(v) => set("annualExpenses", v)}
                prefix="$"
              />
            </Field>
            <Field label="Cash already saved">
              <NumberInput
                value={intake.emergencyFund}
                onChange={(v) => set("emergencyFund", v)}
                prefix="$"
              />
            </Field>
          </div>

          <Field label="Credit card / high-interest debt">
            <NumberInput
              value={intake.highInterestDebt}
              onChange={(v) => set("highInterestDebt", v)}
              prefix="$"
            />
          </Field>

          {(intake.stage === "drafted-rookie" || intake.stage === "pro-vet") && (
            <Field label="Job offers a 401k with match?">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => set("hasW2WithMatch", true)}
                  className={`py-3 rounded-xl border transition text-sm mono uppercase tracking-wider ${
                    intake.hasW2WithMatch
                      ? "bg-fg text-bg border-fg"
                      : "bg-bg-2 border-border text-fg-muted"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => set("hasW2WithMatch", false)}
                  className={`py-3 rounded-xl border transition text-sm mono uppercase tracking-wider ${
                    !intake.hasW2WithMatch
                      ? "bg-fg text-bg border-fg"
                      : "bg-bg-2 border-border text-fg-muted"
                  }`}
                >
                  No
                </button>
              </div>
            </Field>
          )}

          <Field label="Kids / dependents" hint="affects 529 plan + family LLC moves">
            <NumberInput value={intake.dependents} onChange={(v) => set("dependents", v)} />
          </Field>

          <Field label="Risk preference" hint="auto picks based on age + stage + cushion">
            <div className="grid grid-cols-4 gap-2">
              {(["auto", "conservative", "moderate", "aggressive"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set("riskPreference", r)}
                  className={`py-2.5 rounded-xl border transition text-xs mono uppercase tracking-wider ${
                    intake.riskPreference === r
                      ? "bg-fg text-bg border-fg"
                      : "bg-bg-2 border-border text-fg-muted hover:text-fg"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Field>
        </motion.div>
      )}

      <button
        type="submit"
        className="mt-3 w-full group relative overflow-hidden rounded-2xl py-4 px-6 font-medium tracking-tight text-bg transition"
        style={{
          background: "linear-gradient(135deg, hsl(88 80% 60%) 0%, hsl(38 92% 60%) 100%)",
        }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          Build my plan
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </button>

      <p className="text-[11px] mono text-center text-fg-dim">
        nothing saved · no signup · the math runs on your phone
      </p>
    </motion.form>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-2.5">
        <div className="text-sm font-medium text-fg leading-snug">{label}</div>
        {hint && <div className="text-[11px] text-fg-dim mt-0.5 leading-relaxed">{hint}</div>}
      </div>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative bg-bg-2 border border-border rounded-xl focus-within:border-signal/50 transition">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-dim text-sm mono pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className={`w-full bg-transparent py-3.5 num text-fg focus:outline-none ${
          prefix ? "pl-9" : "pl-4"
        } ${suffix ? "pr-12" : "pr-4"}`}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-dim text-sm mono pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}
