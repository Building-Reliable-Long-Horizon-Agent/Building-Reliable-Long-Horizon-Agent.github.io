import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Building Reliable Long-Horizon Agents: A Survey",
    template: "%s · Reliable Horizon",
  },
  description:
    "Definitions, metrics, benchmarks, and system design for reliable long-horizon LLM agents.",
  icons: {
    icon: [
      {
        url: "/favicon-long-horizon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/favicon-long-horizon-32.png",
        type: "image/png",
        sizes: "32x32",
      },
      {
        url: "/favicon-long-horizon-192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: {
      url: "/apple-touch-icon-long-horizon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
  openGraph: {
    title: "Building Reliable Long-Horizon Agents: A Survey",
    description:
      "Definitions, metrics, benchmarks, and system design for reliable long-horizon LLM agents.",
    type: "article",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Building Reliable Long-Horizon Agents: A Survey",
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
