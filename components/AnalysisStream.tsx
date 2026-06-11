"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  "Reading the deal terms",
  "Calculating federal + state + self-employment tax",
  "Building quarterly estimated payment schedule",
  "Picking the right accounts for your stage",
  "Running 3,000-path Monte Carlo projection",
  "Flagging the 6 athlete kills",
];

/**
 * Live agent UI. Plays the analysis steps one at a time, with checkmarks
 * filling in as each completes. ~5 seconds total.
 */
export function AnalysisStream({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= STEPS.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShown((s) => s + 1), 650);
    return () => clearTimeout(t);
  }, [shown, onDone]);

  return (
    <section className="max-w-3xl mx-auto pt-16">
      <div className="display text-4xl md:text-6xl leading-[0.95] tracking-tight mb-10">
        Building your check{shown < STEPS.length && <span className="text-signal animate-pulse">_</span>}
      </div>

      <div className="flex items-center gap-3 mb-7">
        <span className="relative flex">
          <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
          <span className="absolute inset-0 rounded-full bg-signal animate-ping opacity-30" />
        </span>
        <span className="mono text-[10px] uppercase tracking-[0.28em] text-fg-muted">
          analyzing · {shown} / {STEPS.length}
        </span>
      </div>

      <div className="space-y-2.5">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={
              i < shown
                ? { opacity: 1, x: 0 }
                : i === shown
                  ? { opacity: 0.5, x: 0 }
                  : { opacity: 0, x: -8 }
            }
            transition={{ duration: 0.4 }}
            className="flex items-center gap-4"
          >
            <span className={`mono text-xs ${i < shown ? "text-signal" : "text-fg-dim"}`}>
              {(i + 1).toString().padStart(2, "0")}
            </span>
            <span className={`text-base ${i < shown ? "text-fg" : "text-fg-dim"}`}>{step}</span>
            {i < shown && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mono text-xs text-signal ml-auto"
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
