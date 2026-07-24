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
  assert.match(html, /Kai Wu<sup>1,\*<\/sup>/);
  assert.match(html, /Qingwen Liu<sup>1,†<\/sup>/);
  assert.match(html, /aria-label="Author affiliations"/);
  assert.match(html, /id="horizon"/);
  assert.match(html, /id="framework"/);
  assert.match(html, /id="axes"/);
  assert.match(html, /id="benchmarks"/);
  assert.match(html, /id="evaluation"/);
  assert.match(html, /href="\/paper\.pdf"/);
  assert.match(html, /64-entry benchmark inventory/);
  assert.match(html, /<summary>Table of contents<\/summary>/);
  assert.match(html, /id="citation"/);
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
    figure,
    benchmarkTable,
  ] = await Promise.all([
      readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/client.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../package.json", import.meta.url), "utf8"),
      readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
      access(new URL("../public/paper.pdf", import.meta.url)),
      access(
        new URL(
          "../public/figures/overleaf/figure-5-evidence-chain.png",
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
  assert.match(page, /figures\/overleaf\/figure-6-open-problems\.png/);
  assert.match(client, /Wang, Shengzhi and Liu, Qingwen/);
  assert.doesNotMatch(client, /and others/);
  assert.equal(paper, undefined);
  assert.equal(figure, undefined);
  assert.equal(benchmarkTable, undefined);

  await assert.rejects(
    access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)),
  );
});
