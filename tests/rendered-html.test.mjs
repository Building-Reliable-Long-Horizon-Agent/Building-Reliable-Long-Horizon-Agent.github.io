import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /Kai Wu<sup>1,\*<\/sup>/);
  assert.match(html, /Qingwen Liu<sup>1,†<\/sup>/);
  assert.match(html, /aria-label="Author affiliations"/);
  assert.match(html, /id="horizon"/);
  assert.match(html, /id="framework"/);
  assert.match(html, /id="axes"/);
  assert.match(html, /id="benchmarks"/);
  assert.match(html, /id="evaluation"/);
  assert.match(html, /href="\/paper\.pdf"/);
  assert.match(
    html,
    /href="https:\/\/github\.com\/Building-Reliable-Long-Horizon-Agent\/Building-Reliable-Long-Horizon-Agent\.github\.io"/,
  );
  assert.match(
    html,
    /class="button unavailable" aria-disabled="true">arXiv<span class="resource-status">soon<\/span>/,
  );
  assert.match(
    html,
    /class="button unavailable" aria-disabled="true">OpenReview<span class="resource-status">soon<\/span>/,
  );
  assert.match(
    html,
    /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"\/>/,
  );
  assert.match(html, /64-entry benchmark inventory/);
  assert.match(html, /<summary>Table of contents<\/summary>/);
  assert.match(html, /id="citation"/);
  assert.match(
    html,
    /src="\/figures\/overleaf\/figure-1-teaser\.webp"[^>]*loading="eager"[^>]*fetchPriority="high"/,
  );
  assert.match(
    html,
    /href="\/figures\/overleaf\/figure-6-open-problems\.png"[^>]*><img[^>]*src="\/figures\/overleaf\/figure-6-open-problems\.webp"[^>]*loading="lazy"/,
  );
  const paperImages =
    html.match(/<img[^>]*data-paper-asset="true"[^>]*>/g) ?? [];
  assert.equal(paperImages.length, 9);
  for (const image of paperImages) {
    assert.match(image, /\bwidth="\d+"/);
    assert.match(image, /\bheight="\d+"/);
  }
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Your site is taking shape/);
});

test("removes starter-only code and packages local article assets", async () => {
  const [
    page,
    client,
    layout,
    packageJson,
    hosting,
    paper,
    favicon,
    figure,
    benchmarkTable,
  ] = await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/client.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
      access(new URL("../public/paper.pdf", import.meta.url)),
      access(new URL("../public/favicon.svg", import.meta.url)),
      access(
        new URL(
          "../public/figures/overleaf/figure-5-evidence-chain.webp",
          import.meta.url,
        ),
      ),
      access(
        new URL(
          "../public/figures/overleaf/table-2-benchmarks.svg",
          import.meta.url,
        ),
      ),
    ]);

  assert.match(page, /Building Reliable Long-Horizon Agents/);
  assert.match(layout, /Reliable Horizon/);
  assert.match(packageJson, /"name": "reliable-horizon-blog"/);
  assert.match(hosting, /"project_id": "appgprj_/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.doesNotMatch(page, /codex-preview|_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(page, /step-line|system-stack|evaluation-stack/);
  assert.doesNotMatch(page, /table-[123][^"]*\.png/);
  assert.match(page, /figures\/overleaf\/figure-6-open-problems\.webp/);
  assert.match(page, /fullSrc="\/figures\/overleaf\/figure-6-open-problems\.png"/);
  assert.match(client, /Wang, Shengzhi and Liu, Qingwen/);
  assert.match(client, /preloadPaperAssets/);
  assert.match(client, /image\.fetchPriority = "low"/);
  assert.doesNotMatch(client, /and others/);
  assert.equal(paper, undefined);
  assert.equal(favicon, undefined);
  assert.equal(figure, undefined);
  assert.equal(benchmarkTable, undefined);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
