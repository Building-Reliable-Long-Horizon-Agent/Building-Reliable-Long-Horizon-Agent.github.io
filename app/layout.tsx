import type { Metadata } from "next";
import "./globals.css";

const preferenceBootstrap = `
(function () {
  var root = document.documentElement;
  try {
    var language = /\\/zh(?:\\/|$)/.test(window.location.pathname) ? "zh" : "en";
    var theme = localStorage.getItem("reliable-horizon-theme");
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.dataset.lang = language;
    root.lang = language === "zh" ? "zh-CN" : "en";
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    var themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute("content", theme === "dark" ? "#111513" : "#fcfcfa");
    }
  } catch (error) {
    root.dataset.lang = "en";
    root.dataset.theme = "light";
    root.style.colorScheme = "light";
  }
})();
`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#fcfcfa" />
        <script dangerouslySetInnerHTML={{ __html: preferenceBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
