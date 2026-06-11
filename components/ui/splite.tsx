"use client";

import { Suspense, lazy } from "react";
import { cn } from "@/lib/utils";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

/**
 * SplineScene — lazy-loaded 3D scene wrapper.
 *
 * Streams the Spline runtime (~500KB) on demand so the initial paint of the
 * page is instant. Falls back to a pulsing signal-green dot while loading so
 * the empty space doesn't read as broken.
 */
export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className={cn("w-full h-full flex items-center justify-center", className)}>
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-signal animate-pulse" />
            <span className="absolute inset-0 rounded-full bg-signal animate-ping opacity-50" />
          </div>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
