"use client";

import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { SplineScene } from "@/components/ui/splite";

/**
 * Hero — 2-column split: editorial text content on the LEFT, animated
 * Spline 3D robot on the RIGHT. Stacks vertically on mobile.
 *
 * The robot physically embodies the new positioning: First Check as an AI
 * NIL & contract assistant.
 */
export function Hero({ onPrimary, onSecondary }: { onPrimary?: () => void; onSecondary?: () => void }) {
  const scrollToTryIt = () => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("try-it");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 overflow-hidden">
      <Spotlight
        className="-top-40 left-40 md:left-[60%] md:-top-20"
        fill="rgba(163, 230, 53, 0.5)"
      />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center min-h-[88vh]">
        {/* LEFT — text content */}
        <div className="relative z-10 flex flex-col items-start text-left order-1">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-signal/10 backdrop-blur-md border border-signal/30 text-sm"
          >
            <span className="relative flex">
              <span className="w-1.5 h-1.5 rounded-full bg-signal animate-pulse" />
              <span className="absolute inset-0 rounded-full bg-signal animate-ping opacity-40" />
            </span>
            <span className="text-fg mono text-[11px] uppercase tracking-[0.2em]">
              free · no signup · 60 seconds
            </span>
          </motion.div>

          <div className="space-y-1 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.92] tracking-tight"
            >
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(0 0% 78%) 100%)",
                }}
              >
                Your first big check
              </span>
            </motion.h1>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.92] tracking-tight"
            >
              <span
                className="bg-clip-text text-transparent animate-gradient"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(88 80% 60%), hsl(38 92% 60%), hsl(174 84% 60%), hsl(88 80% 60%))",
                  backgroundSize: "300% 300%",
                }}
              >
                deserves a plan.
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-base md:text-xl text-fg-muted/90 font-light leading-relaxed max-w-xl mb-10"
          >
            <span className="text-fg">Your AI assistant for the moment an athlete gets paid.</span>{" "}
            Reads your NIL or pro contract, calculates your real tax bill, and builds your
            personalized investment plan in 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={onPrimary ?? scrollToTryIt}
              className="px-7 py-3.5 rounded-full text-black font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                background:
                  "linear-gradient(135deg, hsl(88 80% 60%) 0%, hsl(38 92% 60%) 100%)",
                boxShadow: "0 0 40px hsl(88 80% 60% / 0.25)",
              }}
            >
              Try it in 60 seconds
            </button>
            <button
              onClick={onSecondary ?? scrollToTryIt}
              className="px-7 py-3.5 rounded-full bg-signal/10 hover:bg-signal/15 border border-signal/30 hover:border-signal/50 text-fg font-medium text-base transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              Scan a contract instead
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12 mono text-[10px] uppercase tracking-[0.28em] text-fg-dim"
          >
            for the 99% of athletes who never had an agent
          </motion.div>
        </div>

        {/* RIGHT — Spline 3D robot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="relative w-full h-[400px] lg:h-[680px] xl:h-[720px] order-2"
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
          {/* Soft gradient mask along the bottom so the canvas blends into the page */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
            style={{
              background: "linear-gradient(to bottom, transparent, hsl(var(--bg)))",
            }}
          />
        </motion.div>
      </div>
    </header>
  );
}
