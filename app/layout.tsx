import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Reliable Horizon",
    template: "%s · Reliable Horizon",
  },
  description:
    "A research field guide to reliable long-horizon LLM agents.",
  openGraph: {
    title: "Building Reliable Long-Horizon Agents",
    description:
      "Definitions, metrics, benchmarks, and system design for reliable long-horizon LLM agents.",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Building Reliable Long-Horizon Agents",
    description:
      "A field guide to measuring and extending reliable execution horizon.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
