"use client";

import { useEffect, useState } from "react";

const citation = `@misc{wu2026building,
  title  = {Building Reliable Long-Horizon Agents: A Survey},
  author = {Wu, Kai and Lyu, Hao and Luo, Zhen and Wang, Chaofan and Ye, Siyu and Lin, Jinghao and Ji, Xiaozhong and Jiang, Boyuan and Ye, Yiwen and Wang, Zimu and Liu, Wenzhe and Wang, Ruobing and Cai, Kai and Wang, Shengzhi and Liu, Qingwen},
  year   = {2026},
  month  = jul,
  note   = {Preprint}
}`;

export function ArticleEnhancements() {
  useEffect(() => {
    const root = document.documentElement;
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".article-section[id]"),
    );
    const outlineLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".outline a[href^='#']"),
    );
    let disposed = false;
    let preloadTimer: number | undefined;

    const update = () => {
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      root.style.setProperty("--reading-progress", `${Math.min(progress, 1) * 100}%`);

      const marker = window.scrollY + 170;
      let activeId = headings[0]?.id ?? "";
      for (const heading of headings) {
        if (heading.offsetTop <= marker) activeId = heading.id;
      }
      for (const link of outlineLinks) {
        link.toggleAttribute("aria-current", link.hash === `#${activeId}`);
      }
    };

    const preloadPaperAssets = () => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>(
          'img[data-paper-asset][loading="lazy"]:not([data-preload-queued])',
        ),
      );

      for (const image of images) {
        image.dataset.preloadQueued = "true";
      }

      let cursor = 0;
      const loadNext = () => {
        if (disposed) return;
        const image = images[cursor++];
        if (!image) return;
        if (image.complete) {
          queueMicrotask(loadNext);
          return;
        }

        let advanced = false;
        const advance = () => {
          if (advanced) return;
          advanced = true;
          image.removeEventListener("load", advance);
          image.removeEventListener("error", advance);
          loadNext();
        };

        image.addEventListener("load", advance, { once: true });
        image.addEventListener("error", advance, { once: true });
        image.fetchPriority = "low";
        image.loading = "eager";
        if (image.complete) advance();
      };

      // Warm two assets at a time after the critical page load. Images remain
      // low priority, while native lazy loading can still win if the reader
      // scrolls to a later figure first.
      loadNext();
      loadNext();
    };

    const startPreloading = () => {
      preloadTimer = window.setTimeout(preloadPaperAssets, 200);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    if (document.readyState === "complete") {
      startPreloading();
    } else {
      window.addEventListener("load", startPreloading, { once: true });
    }

    return () => {
      disposed = true;
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("load", startPreloading);
      if (preloadTimer !== undefined) window.clearTimeout(preloadTimer);
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
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{citation}</code>
      </pre>
    </div>
  );
}
