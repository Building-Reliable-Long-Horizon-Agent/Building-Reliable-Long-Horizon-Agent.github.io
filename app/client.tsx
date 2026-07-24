"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const themeStorageKey = "reliable-horizon-theme";

const citation = `@misc{wu2026building,
  title  = {{Building Reliable Long-Horizon Agents: A Survey}},
  author = {Wu, Kai and Lyu, Hao and Luo, Zhen and Wang, Chaofan and Ye, Siyu and Lin, Jinghao and Ji, Xiaozhong and Jiang, Boyuan and Ye, Yiwen and Wang, Zimu and Liu, Wenzhe and Wang, Ruobing and Cai, Kai and Wang, Shengzhi and Liu, Qingwen},
  year   = {2026},
  month  = jul,
  note   = {Preprint},
  url    = {https://building-reliable-long-horizon-agent.github.io/}
}`;

type Language = "en" | "zh";
type Theme = "light" | "dark";

function isLanguage(value: string | undefined): value is Language {
  return value === "en" || value === "zh";
}

function isTheme(value: string | undefined): value is Theme {
  return value === "light" || value === "dark";
}

function updateFigureAltText(language: Language) {
  const images = document.querySelectorAll<HTMLImageElement>(
    "img[data-alt-en][data-alt-zh]",
  );

  for (const image of images) {
    image.alt =
      language === "zh"
        ? (image.dataset.altZh ?? image.alt)
        : (image.dataset.altEn ?? image.alt);
  }
}

function applyLanguage(language: Language) {
  const root = document.documentElement;
  root.dataset.lang = language;
  root.lang = language === "zh" ? "zh-CN" : "en";
  updateFigureAltText(language);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#111513" : "#fcfcfa");
}

export function SitePreferences() {
  useEffect(() => {
    const root = document.documentElement;
    const initialLanguage = isLanguage(root.dataset.lang)
      ? root.dataset.lang
      : "en";
    const initialTheme = isTheme(root.dataset.theme)
      ? root.dataset.theme
      : "light";

    applyLanguage(initialLanguage);
    applyTheme(initialTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = (event: MediaQueryListEvent) => {
      try {
        if (window.localStorage.getItem(themeStorageKey)) return;
      } catch {
        return;
      }
      applyTheme(event.matches ? "dark" : "light");
    };
    const syncPreferences = (event: StorageEvent) => {
      if (event.key === themeStorageKey && isTheme(event.newValue ?? undefined)) {
        applyTheme(event.newValue as Theme);
      }
    };

    media.addEventListener("change", syncSystemTheme);
    window.addEventListener("storage", syncPreferences);
    return () => {
      media.removeEventListener("change", syncSystemTheme);
      window.removeEventListener("storage", syncPreferences);
    };
  }, []);

  function toggleTheme() {
    const current = isTheme(document.documentElement.dataset.theme)
      ? document.documentElement.dataset.theme
      : "light";
    const next: Theme = current === "light" ? "dark" : "light";
    applyTheme(next);
    try {
      window.localStorage.setItem(themeStorageKey, next);
    } catch {}
  }

  return (
    <div
      className="site-preferences"
      aria-label="Display preferences / 显示设置"
    >
      <span className="lang-en" lang="zh-CN">
        <Link
          className="preference-button"
          href="/zh/"
          hrefLang="zh-CN"
          aria-label="切换为中文"
        >
          中文
        </Link>
      </span>
      <span className="lang-zh" lang="en">
        <Link
          className="preference-button"
          href="/"
          hrefLang="en"
          aria-label="Switch to English"
        >
          EN
        </Link>
      </span>
      <button
        className="preference-button"
        type="button"
        onClick={toggleTheme}
        aria-label="Switch color theme / 切换明暗主题"
      >
        <span className="theme-light-only">
          <span className="lang-en">Dark</span>
          <span className="lang-zh">深色</span>
        </span>
        <span className="theme-dark-only">
          <span className="lang-en">Light</span>
          <span className="lang-zh">浅色</span>
        </span>
      </button>
    </div>
  );
}

export function ArticleEnhancements() {
  useEffect(() => {
    const root = document.documentElement;

    const update = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty("--reading-progress", `${Math.min(progress, 1) * 100}%`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="reading-progress" aria-hidden="true" />;
}

export function CitationCopy() {
  const [copied, setCopied] = useState(false);

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="citation">
      <div className="citation-head">
        <span>BibTeX</span>
        <button type="button" onClick={copyCitation}>
          {copied ? (
            <>
              <span className="lang-en">Copied</span>
              <span className="lang-zh">已复制</span>
            </>
          ) : (
            <>
              <span className="lang-en">Copy</span>
              <span className="lang-zh">复制</span>
            </>
          )}
        </button>
      </div>
      <pre>
        <code>{citation}</code>
      </pre>
    </div>
  );
}
