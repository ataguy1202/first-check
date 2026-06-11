import type { Metadata } from "next";
import "./globals.css";
import InteractiveShaderBackground from "@/components/ui/interactive-shader-background";

export const metadata: Metadata = {
  metadataBase: new URL("https://firstcheck.app"),
  title: "First Check · your NIL & contract AI assistant",
  description:
    "Your AI assistant for the moment an athlete gets paid. Reads your NIL or pro contract, calculates your real tax bill, and builds your personalized investment plan in 60 seconds.",
  openGraph: {
    title: "First Check · your NIL & contract AI assistant",
    description:
      "Reads your contract, calculates your real tax bill, builds your investment plan. Free. Built for the 99% of athletes who never had an agent.",
    type: "website",
    siteName: "First Check",
  },
  twitter: {
    card: "summary_large_image",
    title: "First Check · your NIL & contract AI assistant",
    description:
      "Reads your contract, calculates your real tax bill, builds your investment plan. Free.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="grain">
      <body className="min-h-dvh">
        <InteractiveShaderBackground />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
