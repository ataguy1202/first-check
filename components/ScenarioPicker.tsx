"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SCENARIOS, type Scenario } from "@/lib/scenarios";
import type { Intake } from "@/lib/types";
import { CustomInputForm } from "./CustomInputForm";
import { ContractUpload } from "./ContractUpload";

type Mode = "demo" | "custom" | "contract";

/**
 * Three modes:
 *   - "demo"     → three click-to-run preset scenarios (no typing, no upload)
 *   - "custom"   → form where anyone can plug in their own contract terms
 *   - "contract" → sample contract or paste-your-own → flagged clauses
 */
export function ScenarioPicker({
  onPickScenario,
  onSubmitCustom,
}: {
  onPickScenario: (s: Scenario) => void;
  onSubmitCustom: (intake: Intake) => void;
}) {
  const [mode, setMode] = useState<Mode>("demo");

  return (
    <section className="max-w-5xl mx-auto pb-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.28em] text-signal mb-2">
            01 · try it
          </div>
          <h2 className="display text-3xl md:text-4xl tracking-tight">
            {mode === "demo" && "Click a real situation. Watch the math."}
            {mode === "custom" && "Plug in your numbers. Get your plan."}
            {mode === "contract" && "Scan a contract for predatory clauses."}
          </h2>
        </div>

        <div className="inline-flex p-1 rounded-full bg-bg-2 border border-border self-start flex-wrap">
          <Tab active={mode === "demo"} onClick={() => setMode("demo")}>
            See a demo
          </Tab>
          <Tab active={mode === "custom"} onClick={() => setMode("custom")}>
            Your numbers
          </Tab>
          <Tab active={mode === "contract"} onClick={() => setMode("contract")}>
            Scan a contract
          </Tab>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "demo" && (
          <motion.div
            key="demo"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {SCENARIOS.map((s, i) => (
              <motion.button
                key={s.key}
                type="button"
                onClick={() => onPickScenario(s)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="text-left rounded-2xl border border-border bg-bg-2 hover:border-signal/40 hover:bg-bg-2/80 transition group p-6 md:p-7"
              >
                <div className="inline-flex mb-5 px-2.5 py-1 rounded-full bg-bg border border-border-strong mono text-[9px] uppercase tracking-[0.18em] text-fg-muted">
                  {s.badge}
                </div>
                <div className="font-medium text-fg leading-snug mb-2.5 text-lg">{s.title}</div>
                <p className="text-sm text-fg-muted leading-relaxed mb-6">{s.hint}</p>
                <div className="mono text-[10px] uppercase tracking-[0.22em] text-fg-dim group-hover:text-signal transition flex items-center gap-1.5">
                  run <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {mode === "custom" && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <CustomInputForm onSubmit={onSubmitCustom} />
          </motion.div>
        )}

        {mode === "contract" && (
          <motion.div
            key="contract"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            <ContractUpload />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-full text-sm transition whitespace-nowrap ${
        active ? "text-bg" : "text-fg-muted hover:text-fg"
      }`}
    >
      {active && (
        <motion.span
          layoutId="picker-pill"
          className="absolute inset-0 rounded-full"
          style={{
            background: "linear-gradient(135deg, hsl(88 80% 60%) 0%, hsl(38 92% 60%) 100%)",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
