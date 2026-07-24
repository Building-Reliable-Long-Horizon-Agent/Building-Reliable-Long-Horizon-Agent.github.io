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
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{citation}</code>
      </pre>
    </div>
  );
}
