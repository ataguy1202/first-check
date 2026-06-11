"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Brand } from "@/components/Brand";
import { Hero } from "@/components/Hero";
import { ScenarioPicker } from "@/components/ScenarioPicker";
import { AnalysisStream } from "@/components/AnalysisStream";
import { PlanArtifact } from "@/components/PlanArtifact";
import { buildPlan } from "@/lib/plan-builder";
import type { Scenario } from "@/lib/scenarios";
import type { Plan, Intake } from "@/lib/types";

type Stage = "pick" | "analyzing" | "plan";

export default function Home() {
  const [stage, setStage] = useState<Stage>("pick");
  const [plan, setPlan] = useState<Plan | null>(null);

  const handlePickScenario = (s: Scenario) => {
    setPlan(buildPlan(s.intake));
    setStage("analyzing");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitCustom = (intake: Intake) => {
    setPlan(buildPlan(intake));
    setStage("analyzing");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="px-6 pt-10 pb-24 md:pt-14">
      <Nav />
      <AnimatePresence mode="wait">
        {stage === "pick" && (
          <motion.div
            key="pick"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Hero />
            <div id="try-it" />
            <ScenarioPicker
              onPickScenario={handlePickScenario}
              onSubmitCustom={handleSubmitCustom}
            />
            <SocialProof />
          </motion.div>
        )}

        {stage === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalysisStream onDone={() => setStage("plan")} />
          </motion.div>
        )}

        {stage === "plan" && plan && (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PlanArtifact plan={plan} />
            <div className="mt-10 text-center">
              <button
                onClick={() => setStage("pick")}
                className="text-fg-muted hover:text-fg transition underline underline-offset-4 decoration-fg-dim hover:decoration-fg text-sm"
              >
                run a different scenario
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Nav() {
  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between mb-10 md:mb-14">
      <div className="flex flex-col gap-1">
        <Brand size={36} />
        <div className="mono text-[10px] uppercase tracking-[0.28em] text-fg-dim pl-[3.25rem]">
          your NIL & contract AI assistant
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-fg-muted">
        <a
          href="https://github.com/ataguy1202/first-check"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-fg transition"
        >
          source ↗
        </a>
      </div>
    </nav>
  );
}

function SocialProof() {
  return (
    <div className="max-w-4xl mx-auto mt-24 pt-12 border-t border-border">
      <div className="mb-8 text-center">
        <div className="mono text-[10px] uppercase tracking-[0.28em] text-fg-dim mb-2">
          why this exists
        </div>
        <h3 className="display text-2xl md:text-3xl tracking-tight max-w-2xl mx-auto">
          1 in 6 NFL players go bankrupt within 12 years. Now NIL means it&apos;s hitting 19-year-olds.
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <Metric label="College athletes with NIL deals" value="100K+" />
        <Metric label="2025 NIL market" value="$1.95B" />
        <Metric label="Of athletes have a financial advisor" value="9%" />
        <Metric label="What this costs" value="$0" />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="display text-2xl md:text-3xl text-fg num mb-1">{value}</div>
      <div className="text-xs mono uppercase tracking-wider text-fg-dim">{label}</div>
    </div>
  );
}
