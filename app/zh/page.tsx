import type { Metadata } from "next";
import Home from "../page";

export const metadata: Metadata = {
  title: "Building Reliable Long-Horizon Agents: A Survey",
  description: "可靠长时程智能体的定义、指标、基准与系统设计。",
  openGraph: {
    title: "Building Reliable Long-Horizon Agents: A Survey",
    description: "可靠长时程智能体的定义、指标、基准与系统设计。",
    type: "article",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary",
    title: "Building Reliable Long-Horizon Agents: A Survey",
    description: "可靠长时程智能体的定义、指标、基准与系统设计。",
  },
  alternates: {
    canonical: "/zh/",
    languages: {
      en: "/",
      "zh-CN": "/zh/",
    },
  },
};

export default function ChineseHome() {
  return <Home />;
}
