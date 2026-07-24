import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete research article", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Building Reliable Long-Horizon Agents: A Survey · Reliable Horizon<\/title>/i,
  );
  assert.match(
    html,
    /<h1>Building Reliable Long-Horizon Agents: A Survey<\/h1>/i,
  );
  assert.doesNotMatch(html, /class="site-header"|aria-label="Primary navigation"/);
  assert.doesNotMatch(html, /class="site-footer"|Back to top/);
  assert.match(html, /Kai Wu<sup>1,\*<\/sup>/);
  assert.match(html, /Qingwen Liu<sup>1,†<\/sup>/);
  assert.match(html, /aria-label="Author affiliations \/ 作者单位"/);
  assert.match(html, /id="horizon"/);
  assert.match(html, /id="framework"/);
  assert.match(html, /id="evaluation"/);
  assert.match(html, /id="agenda"/);
  assert.doesNotMatch(html, /id="axes"|id="benchmarks"|id="design"/);
  assert.match(html, /What makes a task long-horizon\?/);
  assert.match(html, /Reliability belongs to the whole system\./);
  assert.match(html, /How should we evaluate progress\?/);
  assert.match(html, /What remains unsolved\?/);
  assert.equal(
    (html.match(/class="section-heading"/g) ?? []).length,
    4,
  );
  assert.match(html, /href="\/paper\.pdf"/);
  assert.match(html, /class="button primary" href="\/paper\.pdf">PDF<\/a>/);
  assert.match(html, /class="site-preferences"/);
  assert.match(
    html,
    /href="\/zh\/"[^>]*hrefLang="zh-CN"[^>]*aria-label="切换为中文"/,
  );
  assert.match(html, /aria-label="Switch color theme \/ 切换明暗主题"/);
  assert.match(html, /可靠性属于整个系统/);
  assert.match(html, /data-alt-zh="可靠长时程智能体研究版图/);
  assert.doesNotMatch(html, /Start with the abstract|Read the full paper/);
  assert.doesNotMatch(html, /Open full resolution/);
  assert.doesNotMatch(html, /closing-statement|Progress is not an agent/);
  assert.match(
    html,
    /href="https:\/\/github\.com\/Building-Reliable-Long-Horizon-Agent\/Building-Reliable-Long-Horizon-Agent\.github\.io"/,
  );
  assert.match(
    html,
    /class="button unavailable" aria-disabled="true"><img[^>]+src="\/icons\/arxiv\.svg"[^>]*\/>arXiv<span class="resource-status"><span class="lang-en" lang="en">soon<\/span><span class="lang-zh" lang="zh-CN">即将开放<\/span><\/span>/,
  );
  assert.match(
    html,
    /class="button unavailable" aria-disabled="true">OpenReview<span class="resource-status"><span class="lang-en" lang="en">soon<\/span><span class="lang-zh" lang="zh-CN">即将开放<\/span><\/span>/,
  );
  assert.match(
    html,
    /<link rel="icon" href="(?:https:\/\/building-reliable-long-horizon-agent\.github\.io)?\/favicon-long-horizon\.svg" type="image\/svg\+xml"\/>/,
  );
  assert.match(
    html,
    /<link rel="icon" href="(?:https:\/\/building-reliable-long-horizon-agent\.github\.io)?\/favicon-long-horizon-32\.png" sizes="32x32" type="image\/png"\/>/,
  );
  assert.match(
    html,
    /<link rel="icon" href="(?:https:\/\/building-reliable-long-horizon-agent\.github\.io)?\/favicon-long-horizon-192\.png" sizes="192x192" type="image\/png"\/>/,
  );
  assert.match(
    html,
    /<link rel="apple-touch-icon" href="(?:https:\/\/building-reliable-long-horizon-agent\.github\.io)?\/apple-touch-icon-long-horizon\.png" sizes="180x180" type="image\/png"\/>/,
  );
  assert.match(html, /64-entry benchmark inventory/);
  assert.doesNotMatch(html, /Table of contents|class="article-toc"/);
  assert.match(html, /id="citation"/);
  assert.doesNotMatch(html, /How to cite this survey|Read the complete survey/);
  assert.match(
    html,
    /src="\/figures\/overleaf\/figure-1-teaser-960\.webp"[^>]*srcSet="[^"]*figure-1-teaser-1920\.webp 1920w"[^>]*sizes="[^"]*904px"[^>]*loading="eager"[^>]*fetchPriority="high"/,
  );
  assert.match(
    html,
    /href="\/figures\/overleaf\/figure-6-open-problems\.png"[^>]*><img[^>]*src="\/figures\/overleaf\/figure-6-open-problems-960\.webp"[^>]*srcSet="[^"]*figure-6-open-problems-1920\.webp 1920w"[^>]*loading="lazy"/,
  );
  const paperImages =
    html.match(/<img[^>]*data-paper-asset="true"[^>]*>/g) ?? [];
  assert.equal(paperImages.length, 5);
  for (const image of paperImages) {
    assert.match(image, /\bwidth="\d+"/);
    assert.match(image, /\bheight="\d+"/);
  }
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
  assert.doesNotMatch(
    html,
    /figure-2-survey-map|class="note"|class="signal-quote"|class="plain-agenda"/,
  );
  assert.doesNotMatch(
    html,
    /table-1-six-axes|table-2-benchmarks|table-3-metric-stack/,
  );
});

test("serves Chinese from an explicit route while English remains the default", async () => {
  const [englishResponse, chineseResponse] = await Promise.all([
    render("/"),
    render("/zh"),
  ]);

  assert.equal(englishResponse.status, 200);
  assert.equal(chineseResponse.status, 200);

  const englishHtml = await englishResponse.text();
  const chineseHtml = await chineseResponse.text();

  assert.match(englishHtml, /href="\/zh\/"[^>]*hrefLang="zh-CN"/);
  assert.match(chineseHtml, /href="\/"[^>]*hrefLang="en"/);
  assert.match(chineseHtml, /可靠长时程智能体的定义、指标、基准与系统设计。/);
});

test("removes starter-only code and packages local article assets", async () => {
  const [
    page,
    client,
    layout,
    packageJson,
    hosting,
    paper,
    githubIcon,
    faviconSvg,
    favicon,
    appleTouchIcon,
    figure,
    responsiveFirstFigure,
    responsiveLastFigure,
  ] = await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/client.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
      access(new URL("../public/paper.pdf", import.meta.url)),
      access(new URL("../public/icons/github.svg", import.meta.url)),
      readFile(
        new URL("../public/favicon-long-horizon.svg", import.meta.url),
        "utf8",
      ),
      access(new URL("../public/favicon-long-horizon-32.png", import.meta.url)),
      access(
        new URL(
          "../public/apple-touch-icon-long-horizon.png",
          import.meta.url,
        ),
      ),
      access(
        new URL(
          "../public/figures/overleaf/figure-5-evidence-chain.webp",
          import.meta.url,
        ),
      ),
      access(
        new URL(
          "../public/figures/overleaf/figure-1-teaser-960.webp",
          import.meta.url,
        ),
      ),
      access(
        new URL(
          "../public/figures/overleaf/figure-6-open-problems-1920.webp",
          import.meta.url,
        ),
      ),
    ]);

  assert.match(page, /Building Reliable Long-Horizon Agents/);
  assert.match(layout, /Reliable Horizon/);
  assert.doesNotMatch(layout, /reliable-horizon-language|navigator\.language/);
  assert.match(layout, /window\.location\.pathname/);
  assert.match(layout, /reliable-horizon-theme/);
  assert.match(layout, /suppressHydrationWarning/);
  assert.doesNotMatch(client, /languageStorageKey/);
  assert.match(client, /href="\/zh\/"/);
  assert.match(client, /localStorage\.setItem\(themeStorageKey, next\)/);
  assert.match(packageJson, /"name": "reliable-horizon-blog"/);
  assert.match(hosting, /"project_id": "appgprj_/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /codex-preview|_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(page, /step-line|system-stack|evaluation-stack/);
  assert.doesNotMatch(page, /table-[123][^"]*\.png/);
  assert.match(page, /figures\/overleaf\/figure-6-open-problems-960\.webp/);
  assert.match(page, /fullSrc="\/figures\/overleaf\/figure-6-open-problems\.png"/);
  assert.match(client, /Wang, Shengzhi and Liu, Qingwen/);
  assert.match(
    client,
    /title  = \{\{Building Reliable Long-Horizon Agents: A Survey\}\}/,
  );
  assert.match(
    client,
    /url    = \{https:\/\/building-reliable-long-horizon-agent\.github\.io\/\}/,
  );
  assert.doesNotMatch(client, /preloadPaperAssets|image\.fetchPriority = "low"/);
  assert.doesNotMatch(client, /and others/);
  assert.equal(paper, undefined);
  assert.equal(githubIcon, undefined);
  assert.match(faviconSvg, /<title>Long-Horizon Agents<\/title>/);
  assert.equal(favicon, undefined);
  assert.equal(appleTouchIcon, undefined);
  assert.equal(figure, undefined);
  assert.equal(responsiveFirstFigure, undefined);
  assert.equal(responsiveLastFigure, undefined);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
