"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ContractAnalysis } from "@/lib/types";

/**
 * Contract upload + analysis UI.
 *
 * Two paths:
 *   1. "Try sample contract" — instant deterministic clause detection on a
 *      pre-baked NIL agreement. Works always. Perfect for the demo video.
 *   2. "Paste contract text" — paste real contract text, runs the same
 *      detection. (PDF upload + Claude vision wired through /api but the UX
 *      uses paste for v1 reliability.)
 */
export function ContractUpload() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ContractAnalysis | null>(null);
  const [mode, setMode] = useState<"sample" | "paste" | null>(null);

  const runSample = async () => {
    setMode("sample");
    setLoading(true);
    const res = await fetch("/api/analyze-contract", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "sample" }),
    });
    const data = (await res.json()) as ContractAnalysis;
    setResult(data);
    setLoading(false);
  };

  const runPaste = async () => {
    if (!text.trim()) return;
    setMode("paste");
    setLoading(true);
    const res = await fetch("/api/analyze-contract", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "real", text }),
    });
    const data = (await res.json()) as ContractAnalysis;
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      {!result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          <button
            type="button"
            onClick={runSample}
            className="w-full text-left rounded-2xl border border-border bg-bg-2 hover:border-signal/40 transition group p-6"
          >
            <div className="inline-flex mb-4 px-2.5 py-1 rounded-full bg-bg border border-border-strong mono text-[9px] uppercase tracking-[0.18em] text-fg-muted">
              instant demo
            </div>
            <div className="font-medium text-fg leading-snug mb-2 text-lg">
              Try a sample NIL contract
            </div>
            <p className="text-sm text-fg-muted leading-relaxed mb-4">
              A realistic $25K NIL deal with the most common predatory clauses baked in. See the
              detector work in 2 seconds.
            </p>
            <div className="mono text-[10px] uppercase tracking-[0.22em] text-fg-dim group-hover:text-signal transition flex items-center gap-1.5">
              analyze sample <span className="group-hover:translate-x-0.5 transition-transform">→</span>
            </div>
          </button>

          <div className="rounded-2xl border border-border bg-bg-2 p-6">
            <div className="inline-flex mb-4 px-2.5 py-1 rounded-full bg-bg border border-border-strong mono text-[9px] uppercase tracking-[0.18em] text-fg-muted">
              your contract
            </div>
            <div className="font-medium text-fg leading-snug mb-2 text-lg">
              Paste your real contract text
            </div>
            <p className="text-sm text-fg-muted leading-relaxed mb-4">
              Open the PDF, select all, paste it here. We scan for the 6 known bad-clause patterns
              and flag them. Nothing gets sent anywhere except for the scan.
            </p>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your contract text here…"
              rows={8}
              className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-fg leading-relaxed font-mono resize-y focus:outline-none focus:border-signal/50 mb-4"
            />
            <button
              type="button"
              onClick={runPaste}
              disabled={!text.trim()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-bg font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, hsl(88 80% 60%) 0%, hsl(38 92% 60%) 100%)",
              }}
            >
              Scan for predatory clauses →
            </button>
          </div>

          <p className="text-[11px] text-fg-dim mono leading-relaxed">
            ⚠ Not legal advice. This is a first-pass screen. Always have a lawyer review before
            signing a real contract.
          </p>
        </motion.div>
      )}

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-12 text-center"
        >
          <div className="display text-3xl md:text-4xl tracking-tight mb-3">
            Reading the contract<span className="text-signal animate-pulse">_</span>
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-fg-muted">
            scanning 6 known bad-clause patterns
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-border bg-bg-2 p-6">
              <div className="flex items-baseline justify-between mb-3">
                <span className="mono text-[10px] uppercase tracking-[0.28em] text-signal">
                  analysis complete
                </span>
                <span className="mono text-[10px] uppercase tracking-[0.22em] text-fg-dim">
                  {mode === "sample" ? "sample contract" : "your contract"}
                </span>
              </div>
              <div className="display text-3xl md:text-4xl tracking-tight mb-3">
                {result.flags.length} {result.flags.length === 1 ? "issue" : "issues"} found.
              </div>
              <p className="text-fg-muted leading-relaxed">{result.summary}</p>
            </div>

            {result.flags.map((flag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="rounded-2xl border bg-bg-2 p-6"
                style={{
                  borderColor:
                    flag.severity === "high"
                      ? "hsl(0 84% 65% / 0.4)"
                      : flag.severity === "medium"
                        ? "hsl(38 92% 60% / 0.35)"
                        : "hsl(0 0% 22%)",
                }}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <span
                    className={`mono text-[10px] uppercase tracking-[0.28em] ${
                      flag.severity === "high"
                        ? "text-danger"
                        : flag.severity === "medium"
                          ? "text-gold"
                          : "text-fg-dim"
                    }`}
                  >
                    {(i + 1).toString().padStart(2, "0")} · {flag.severity} severity
                  </span>
                </div>
                <div className="font-medium text-fg text-lg leading-snug mb-3">{flag.clause}</div>
                <div className="text-[12px] mono text-fg-dim bg-bg rounded-lg p-3 mb-4 leading-relaxed">
                  &ldquo;…{flag.quote}…&rdquo;
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] mono uppercase tracking-[0.22em] text-fg-dim mb-1">
                      why it&apos;s bad
                    </div>
                    <p className="text-sm text-fg-muted leading-relaxed">{flag.why}</p>
                  </div>
                  <div>
                    <div className="text-[10px] mono uppercase tracking-[0.22em] text-signal mb-1">
                      what to push for
                    </div>
                    <p className="text-sm text-fg leading-relaxed">{flag.fix}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="pt-2">
              <button
                onClick={() => {
                  setResult(null);
                  setText("");
                  setMode(null);
                }}
                className="text-fg-muted hover:text-fg transition underline underline-offset-4 decoration-fg-dim hover:decoration-fg text-sm"
              >
                scan another contract
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
