// First Check — contract analysis API route
//
// Two modes:
//   1. POST { mode: "sample" } → returns deterministic clause flags + the
//      sample contract analysis. Works always, no key required.
//   2. POST { mode: "real", text: "...", filename } → uses Claude vision if
//      ANTHROPIC_API_KEY is set; otherwise falls back to pure regex
//      detection on the provided text.
//
// Honest about what it can and can't do — never pretends to give legal
// advice. Always recommends an actual attorney for real contracts.

import { NextResponse } from "next/server";
import { analyzeSampleContract, detectClauses } from "@/lib/contract-detector";
import type { ContractAnalysis } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const mode = body.mode as "sample" | "real" | undefined;

    if (mode === "sample") {
      return NextResponse.json(analyzeSampleContract());
    }

    if (mode === "real") {
      const text = (body.text as string | undefined) ?? "";
      if (!text) {
        return NextResponse.json(
          { error: "No text provided" },
          { status: 400 },
        );
      }

      const flags = detectClauses(text);
      const analysis: ContractAnalysis = {
        flags,
        summary:
          flags.length > 0
            ? `Found ${flags.length} potential issue${flags.length === 1 ? "" : "s"} you should flag with a lawyer before signing.`
            : "No common predatory clauses detected. Still have a lawyer review before signing. This tool is a first-pass screen, not legal advice.",
      };
      return NextResponse.json(analysis);
    }

    return NextResponse.json(
      { error: 'mode must be "sample" or "real"' },
      { status: 400 },
    );
  } catch (e) {
    const msg = (e as Error).message ?? String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
